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
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
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
        // Create wallet if it doesn't exist
        wallet = await storage.createWallet({
          userId,
          balance: "0.00",
          pendingBalance: "0.00",
          currency: "USD"
        });
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
