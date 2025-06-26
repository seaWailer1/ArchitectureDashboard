import type { Express } from "express";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { registerPartnershipRoutes } from "./partnership-routes";
import { 
  validateRequest, 
  onboardingSchema, 
  transactionSchema, 
  kycDocumentSchema,
  sanitizeString 
} from "./validation";
import { insertTransactionSchema, insertUserRoleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Security middleware - more lenient for development
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased limit for development
    message: "Too many requests from this IP",
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for static assets and development
      return process.env.NODE_ENV === 'development' || 
             req.url.includes('/assets/') || 
             req.url.includes('/_vite/') ||
             req.url.includes('.js') ||
             req.url.includes('.css');
    }
  });
  
  app.use('/api/', limiter); // Only apply to API routes
  
  // Auth middleware
  await setupAuth(app);

  // Preset users route
  app.get('/api/preset-users', async (req, res) => {
    try {
      const { getPresetUserCredentials } = await import('./preset-users');
      const credentials = await getPresetUserCredentials();
      res.json(credentials);
    } catch (error) {
      console.error("Error fetching preset users:", error);
      res.status(500).json({ message: "Failed to fetch preset users" });
    }
  });

  app.post('/api/preset-users/create', async (req, res) => {
    try {
      const { createPresetUsers } = await import('./preset-users');
      await createPresetUsers();
      res.json({ success: true, message: "Preset users created successfully" });
    } catch (error) {
      console.error("Error creating preset users:", error);
      res.status(500).json({ message: "Failed to create preset users" });
    }
  });

  app.post('/api/preset-users/switch/:userId', async (req: any, res) => {
    try {
      const { userId } = req.params;
      
      // Validate userId format to prevent injection
      if (!/^[a-zA-Z0-9\-_]+$/.test(userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }
      
      // Restrict to development environment only
      if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({ message: "User switching not allowed in production" });
      }
      
      // Validate against whitelist of preset users
      const allowedUsers = [
        'consumer-001', 'consumer-002', 'consumer-new', 'consumer-kyc',
        'merchant-001', 'merchant-002', 'agent-001', 'dev-user-123'
      ];
      
      if (!allowedUsers.includes(userId)) {
        return res.status(403).json({ message: "User not in allowed preset list" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Preset user not found" });
      }
      
      // Securely update development context without global variables
      req.session.devUserId = userId;
      
      res.json({ success: true, user });
    } catch (error) {
      console.error("Error switching to preset user:", error);
      res.status(500).json({ message: "Failed to switch user" });
    }
  });

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      let userId: string;
      
      // Development mode: create or use existing dev user
      if (process.env.NODE_ENV === 'development') {
        userId = req.session?.devUserId || "dev-user-123";
        let user = await storage.getUser(userId);
        
        if (!user) {
          // Create development user with complete profile
          user = await storage.upsertUser({
            id: userId,
            email: "dev@example.com",
            firstName: "Development",
            lastName: "User",
            currentRole: "consumer",
            kycStatus: "verified",
            phoneVerified: true,
            documentsVerified: true,
            biometricVerified: true
          });
          
          // Auto-generate demo data for dev user
          try {
            const { createUserSampleData } = await import('./seed-data');
            await createUserSampleData(userId, 'consumer');
            console.log(`Auto-generated demo data for dev user: ${userId}`);
          } catch (seedError) {
            console.error("Error auto-seeding demo data:", seedError);
          }
          
          // Fetch updated user data
          user = await storage.getUser(userId);
        }
        
        res.json(user);
        return;
      }
      
      // Production mode: require authentication
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      userId = req.user.claims.sub;
      let user = await storage.getUser(userId);
      
      // Auto-generate demo data for first-time users
      if (user && !user.currentRole) {
        try {
          const { createUserSampleData } = await import('./seed-data');
          await createUserSampleData(userId, 'consumer');
          console.log(`Auto-generated demo data for user: ${userId}`);
          
          // Fetch updated user data
          user = await storage.getUser(userId);
        } catch (seedError) {
          console.error("Error auto-seeding demo data:", seedError);
        }
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Onboarding routes
  app.post('/api/onboarding/complete', async (req: any, res) => {
    try {
      let userId: string;
      
      if (process.env.NODE_ENV === 'development') {
        userId = "dev-user-123";
      } else {
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        userId = req.user.claims.sub;
      }
      
      const {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        address,
        city,
        country,
        preferredRole
      } = req.body;
      
      const user = await storage.upsertUser({
        id: userId,
        email: sanitizeString(email),
        firstName: sanitizeString(firstName),
        lastName: sanitizeString(lastName),
        phone: sanitizeString(phone),
        dateOfBirth,
        address: sanitizeString(address),
        city: sanitizeString(city),
        country,
        currentRole: preferredRole,
        kycStatus: 'pending'
      });
      
      res.json({ success: true, user });
    } catch (error) {
      console.error("Error completing onboarding:", error);
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });

  // KYC routes
  app.post('/api/kyc/send-otp', async (req: any, res) => {
    try {
      const { phoneNumber } = req.body;
      
      // In a real implementation, you would integrate with an SMS service
      // For now, we'll simulate sending an OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in session or database (for demo, we'll just log it)
      console.log(`OTP for ${phoneNumber}: ${otp}`);
      
      res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  });

  app.post('/api/kyc/verify-otp', async (req: any, res) => {
    try {
      let userId: string;
      
      if (process.env.NODE_ENV === 'development') {
        userId = "dev-user-123";
      } else {
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        userId = req.user.claims.sub;
      }
      
      const { phoneNumber, verificationCode } = req.body;
      
      // In a real implementation, you would verify the OTP against stored value
      // For demo, we'll accept any 6-digit code
      if (verificationCode && verificationCode.length === 6) {
        await storage.updateVerificationStatus(userId, 'phoneVerified', true);
        res.json({ success: true, message: "Phone verified successfully" });
      } else {
        res.status(400).json({ message: "Invalid verification code" });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  });

  app.post('/api/kyc/upload-document', async (req: any, res) => {
    try {
      let userId: string;
      
      if (process.env.NODE_ENV === 'development') {
        userId = "dev-user-123";
      } else {
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        userId = req.user.claims.sub;
      }
      
      // In a real implementation, you would handle file uploads
      // For demo, we'll just mark documents as verified
      await storage.updateVerificationStatus(userId, 'documentsVerified', true);
      
      res.json({ success: true, message: "Documents uploaded successfully" });
    } catch (error) {
      console.error("Error uploading documents:", error);
      res.status(500).json({ message: "Failed to upload documents" });
    }
  });

  app.post('/api/kyc/submit-biometric', async (req: any, res) => {
    try {
      let userId: string;
      
      if (process.env.NODE_ENV === 'development') {
        userId = "dev-user-123";
      } else {
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        userId = req.user.claims.sub;
      }
      
      // In a real implementation, you would process biometric data
      // For demo, we'll mark biometric as verified and complete KYC
      await storage.updateVerificationStatus(userId, 'biometricVerified', true);
      await storage.updateKYCStatus(userId, 'verified');
      
      res.json({ success: true, message: "Biometric verification completed" });
    } catch (error) {
      console.error("Error submitting biometric:", error);
      res.status(500).json({ message: "Failed to submit biometric data" });
    }
  });

  // Wallet routes
  app.get('/api/wallet', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let wallet = await storage.getWalletByUserId(userId);
      
      if (!wallet) {
        // Create wallet and automatically seed demo data for new users
        wallet = await storage.createWallet({
          userId,
          balance: "0.00",
          pendingBalance: "0.00",
          currency: "USD"
        });
        
        // Auto-generate demo data for new users
        try {
          const { createUserSampleData } = await import('./seed-data');
          await createUserSampleData(userId, 'consumer');
          console.log(`Auto-generated demo data for new user: ${userId}`);
          
          // Fetch updated wallet with demo data
          wallet = await storage.getWalletByUserId(userId);
        } catch (seedError) {
          console.error("Error auto-seeding demo data:", seedError);
          // Continue without failing the wallet creation
        }
      }
      
      res.json(wallet);
    } catch (error) {
      console.error("Error fetching wallet:", error);
      res.status(500).json({ message: "Failed to fetch wallet" });
    }
  });

  app.post('/api/wallet/topup', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount } = req.body;
      
      if (!amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const wallet = await storage.getWalletByUserId(userId);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const transaction = await storage.createTransaction({
        toWalletId: wallet.id,
        amount: amount.toString(),
        type: "topup",
        status: "completed",
        description: "Wallet Top-up"
      });

      const newBalance = (parseFloat(wallet.balance || "0") + parseFloat(amount)).toFixed(2);
      const updatedWallet = await storage.updateWalletBalance(wallet.id, newBalance);

      res.json({ wallet: updatedWallet, transaction });
    } catch (error) {
      console.error("Error topping up wallet:", error);
      res.status(500).json({ message: "Failed to top up wallet" });
    }
  });

  // Transaction routes
  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const wallet = await storage.getWalletByUserId(userId);
      
      if (!wallet) {
        return res.json([]);
      }

      const transactions = await storage.getTransactionsByWalletId(wallet.id);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post('/api/transactions/send', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { toUserId, amount, description } = req.body;
      
      if (!toUserId || !amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ message: "Invalid transaction data" });
      }

      const fromWallet = await storage.getWalletByUserId(userId);
      const toWallet = await storage.getWalletByUserId(toUserId);

      if (!fromWallet || !toWallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      if (parseFloat(fromWallet.balance || "0") < parseFloat(amount)) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      const transaction = await storage.createTransaction({
        fromWalletId: fromWallet.id,
        toWalletId: toWallet.id,
        amount: amount.toString(),
        type: "send",
        status: "completed",
        description: description || "Payment"
      });

      // Update balances
      const newFromBalance = (parseFloat(fromWallet.balance || "0") - parseFloat(amount)).toFixed(2);
      const newToBalance = (parseFloat(toWallet.balance || "0") + parseFloat(amount)).toFixed(2);

      await storage.updateWalletBalance(fromWallet.id, newFromBalance);
      await storage.updateWalletBalance(toWallet.id, newToBalance);

      res.json(transaction);
    } catch (error) {
      console.error("Error sending money:", error);
      res.status(500).json({ message: "Failed to send money" });
    }
  });

  // Role management routes
  app.get('/api/roles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const roles = await storage.getUserRoles(userId);
      res.json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });

  app.post('/api/roles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertUserRoleSchema.parse({
        ...req.body,
        userId
      });

      const role = await storage.createUserRole(validatedData);
      res.json(role);
    } catch (error) {
      console.error("Error creating role:", error);
      res.status(500).json({ message: "Failed to create role" });
    }
  });

  app.put('/api/user/role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role } = req.body;

      if (!["consumer", "merchant", "agent"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await storage.updateUserCurrentRole(userId, role);
      res.json(user);
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ message: "Failed to update role" });
    }
  });

  // KYC routes
  app.put('/api/kyc/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { status } = req.body;

      if (!["pending", "in_progress", "verified", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid KYC status" });
      }

      const user = await storage.updateKYCStatus(userId, status);
      res.json(user);
    } catch (error) {
      console.error("Error updating KYC status:", error);
      res.status(500).json({ message: "Failed to update KYC status" });
    }
  });

  app.put('/api/kyc/verification', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { field, status } = req.body;

      if (!["phoneVerified", "documentsVerified", "biometricVerified"].includes(field)) {
        return res.status(400).json({ message: "Invalid verification field" });
      }

      const user = await storage.updateVerificationStatus(userId, field, status);
      res.json(user);
    } catch (error) {
      console.error("Error updating verification status:", error);
      res.status(500).json({ message: "Failed to update verification status" });
    }
  });

  // Enhanced wallet operations
  app.get('/api/wallets', async (req: any, res) => {
    try {
      let userId: string;
      
      if (process.env.NODE_ENV === 'development') {
        userId = "dev-user-123";
      } else {
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        userId = req.user.claims.sub;
      }
      
      let wallets = await storage.getUserWallets(userId);
      
      // Only auto-seed if user has absolutely no wallets
      if (wallets.length === 0) {
        try {
          const { createUserSampleData } = await import('./seed-data');
          await createUserSampleData(userId, 'consumer');
          console.log(`Auto-generated wallet data for user: ${userId}`);
          wallets = await storage.getUserWallets(userId);
        } catch (seedError) {
          console.error("Error auto-seeding wallet data:", seedError);
        }
      }
      
      res.json(wallets);
    } catch (error) {
      console.error("Error fetching user wallets:", error);
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });

  app.get('/api/wallets/holdings', async (req: any, res) => {
    try {
      let userId: string;
      
      if (process.env.NODE_ENV === 'development') {
        userId = "dev-user-123";
      } else {
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        userId = req.user.claims.sub;
      }
      
      const holdings = await storage.getAssetHoldings(userId);
      res.json(holdings);
    } catch (error) {
      console.error("Error fetching asset holdings:", error);
      res.status(500).json({ message: "Failed to fetch holdings" });
    }
  });

  app.get('/api/investments', async (req: any, res) => {
    try {
      let userId: string;
      
      if (process.env.NODE_ENV === 'development') {
        userId = "dev-user-123";
      } else {
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        userId = req.user.claims.sub;
      }
      
      const investments = await storage.getUserInvestments(userId);
      res.json(investments);
    } catch (error) {
      console.error("Error fetching investments:", error);
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });

  app.get('/api/credit-facilities', async (req: any, res) => {
    try {
      let userId: string;
      
      if (process.env.NODE_ENV === 'development') {
        userId = "dev-user-123";
      } else {
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        userId = req.user.claims.sub;
      }
      
      const facilities = await storage.getCreditFacilities(userId);
      res.json(facilities);
    } catch (error) {
      console.error("Error fetching credit facilities:", error);
      res.status(500).json({ message: "Failed to fetch credit facilities" });
    }
  });

  app.get('/api/digital-assets', async (req: any, res) => {
    try {
      const assets = await storage.getDigitalAssets();
      res.json(assets);
    } catch (error) {
      console.error("Error fetching digital assets:", error);
      res.status(500).json({ message: "Failed to fetch digital assets" });
    }
  });

  app.get('/api/investment-products', async (req: any, res) => {
    try {
      const products = await storage.getInvestmentProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching investment products:", error);
      res.status(500).json({ message: "Failed to fetch investment products" });
    }
  });

  app.get('/api/trading-pairs', async (req: any, res) => {
    try {
      const pairs = await storage.getTradingPairs();
      res.json(pairs);
    } catch (error) {
      console.error("Error fetching trading pairs:", error);
      res.status(500).json({ message: "Failed to fetch trading pairs" });
    }
  });

  // QR Code generation
  app.post('/api/qr/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount, description } = req.body;

      const qrData = {
        userId,
        amount: amount || null,
        description: description || "Payment request",
        timestamp: Date.now()
      };

      const qrCode = Buffer.from(JSON.stringify(qrData)).toString('base64');
      
      res.json({ qrCode, data: qrData });
    } catch (error) {
      console.error("Error generating QR code:", error);
      res.status(500).json({ message: "Failed to generate QR code" });
    }
  });

  // Demo data management routes
  app.post('/api/seed-demo-data', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role, scenario, features } = req.body;
      
      // Import seed functions
      const { createUserSampleData } = await import('./seed-data');
      
      // Create basic demo data
      await createUserSampleData(userId, role || 'consumer');
      
      res.json({ 
        message: "Demo data generated successfully",
        scenario: scenario || 'basic',
        role: role || 'consumer'
      });
    } catch (error) {
      console.error("Error seeding demo data:", error);
      res.status(500).json({ 
        message: "Failed to generate demo data", 
        error: error.message 
      });
    }
  });

  app.post('/api/clear-demo-data', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get user's wallet to clear demo transactions
      const wallet = await storage.getWalletByUserId(userId);
      if (wallet) {
        // Reset wallet balance to zero
        await storage.updateWalletBalance(wallet.id, "0.00", "0.00");
      }
      
      res.json({ message: "Demo data cleared successfully" });
    } catch (error) {
      console.error("Error clearing demo data:", error);
      res.status(500).json({ 
        message: "Failed to clear demo data", 
        error: error.message 
      });
    }
  });

  // Migration route for walletType column
  app.post('/api/migrate/wallet-type', async (req: any, res) => {
    try {
      const { addWalletTypeColumn } = await import('./migrate-wallet-type');
      await addWalletTypeColumn();
      res.json({ message: "Migration completed successfully" });
    } catch (error) {
      console.error("Migration error:", error);
      res.status(500).json({ message: "Migration failed", error: error.message });
    }
  });

  // User profile management routes
  app.patch('/api/user/profile', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const updates = req.body;
      const sanitizedUpdates = {
        firstName: updates.firstName ? sanitizeString(updates.firstName) : undefined,
        lastName: updates.lastName ? sanitizeString(updates.lastName) : undefined,
        phoneNumber: updates.phoneNumber ? sanitizeString(updates.phoneNumber) : undefined,
        address: updates.address ? sanitizeString(updates.address) : undefined,
        dateOfBirth: updates.dateOfBirth,
      };

      // Remove undefined values
      Object.keys(sanitizedUpdates).forEach(key => 
        sanitizedUpdates[key] === undefined && delete sanitizedUpdates[key]
      );

      const updatedUser = await storage.updateAccountSettings(userId, sanitizedUpdates);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Role switching route
  app.post('/api/user/switch-role', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session?.user?.id;
      const { role } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!['consumer', 'merchant', 'agent'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const updatedUser = await storage.updateUserCurrentRole(userId, role);
      
      // Update session
      if (req.session?.user) {
        req.session.user.currentRole = role;
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Error switching role:", error);
      res.status(500).json({ message: "Failed to switch role" });
    }
  });

  // User devices route
  app.get('/api/user/devices', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const devices = await storage.getUserDevices(userId);
      res.json(devices);
    } catch (error) {
      console.error("Error fetching user devices:", error);
      res.status(500).json({ message: "Failed to fetch devices" });
    }
  });

  // Security logs route
  app.get('/api/user/security-logs', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const logs = await storage.getSecurityLogs(userId);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching security logs:", error);
      res.status(500).json({ message: "Failed to fetch security logs" });
    }
  });

  // Support tickets route
  app.get('/api/user/support-tickets', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const tickets = await storage.getUserSupportTickets(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  // Create support ticket route
  app.post('/api/user/support-tickets', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { subject, description, priority } = req.body;
      
      if (!subject || !description) {
        return res.status(400).json({ message: "Subject and description are required" });
      }

      const ticket = await storage.createSupportTicket({
        userId,
        subject: sanitizeString(subject),
        description: sanitizeString(description),
        priority: priority || 'medium',
        status: 'open',
      });

      res.json(ticket);
    } catch (error) {
      console.error("Error creating support ticket:", error);
      res.status(500).json({ message: "Failed to create support ticket" });
    }
  });

  // Register partnership routes
  registerPartnershipRoutes(app);
  
  const httpServer = createServer(app);
  return httpServer;
}
