import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTransactionSchema, insertUserRoleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      let userId: string;
      
      // Development mode: create or use existing dev user
      if (process.env.NODE_ENV === 'development') {
        userId = "dev-user-123";
        let user = await storage.getUser(userId);
        
        if (!user) {
          // Create development user
          user = await storage.upsertUser({
            id: userId,
            email: "dev@example.com",
            name: "Development User",
            currentRole: "consumer"
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
      
      // Auto-seed if user has no wallets or empty balances
      if (wallets.length === 0 || wallets.every(w => parseFloat(w.balance || "0") === 0)) {
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
      
      let holdings = await storage.getAssetHoldings(userId);
      
      // Auto-seed if user has no holdings
      if (holdings.length === 0) {
        try {
          const { createUserSampleData } = await import('./seed-data');
          await createUserSampleData(userId, 'consumer');
          console.log(`Auto-generated holdings for user: ${userId}`);
          holdings = await storage.getAssetHoldings(userId);
        } catch (seedError) {
          console.error("Error auto-seeding holdings:", seedError);
        }
      }
      
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
      
      let investments = await storage.getUserInvestments(userId);
      
      // Auto-seed if user has no investments
      if (investments.length === 0) {
        try {
          const { createUserSampleData } = await import('./seed-data');
          await createUserSampleData(userId, 'consumer');
          console.log(`Auto-generated investments for user: ${userId}`);
          investments = await storage.getUserInvestments(userId);
        } catch (seedError) {
          console.error("Error auto-seeding investments:", seedError);
        }
      }
      
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
      
      let facilities = await storage.getCreditFacilities(userId);
      
      // Auto-seed if user has no credit facilities
      if (facilities.length === 0) {
        try {
          const { createUserSampleData } = await import('./seed-data');
          await createUserSampleData(userId, 'consumer');
          console.log(`Auto-generated credit facilities for user: ${userId}`);
          facilities = await storage.getCreditFacilities(userId);
        } catch (seedError) {
          console.error("Error auto-seeding credit facilities:", seedError);
        }
      }
      
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

  const httpServer = createServer(app);
  return httpServer;
}
