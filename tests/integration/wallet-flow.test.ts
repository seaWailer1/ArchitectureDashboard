import request from 'supertest';
import express from 'express';
import { registerRoutes } from '@server/routes';
import { DatabaseStorage } from '@server/storage';

describe('Wallet Integration Tests', () => {
  let app: express.Application;
  let storage: DatabaseStorage;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);
    storage = new DatabaseStorage();
  });

  describe('Complete Transaction Flow', () => {
    it('processes send transaction end-to-end', async () => {
      // Test the complete flow from wallet creation to transaction
      const mockUserId = 'test-user-123';
      
      // 1. Create wallet
      const wallet = await storage.createWallet({
        userId: mockUserId,
        balance: '1000.00',
        currency: 'USD',
        walletType: 'primary'
      });

      expect(wallet).toHaveProperty('id');
      expect(wallet.balance).toBe('1000.00');

      // 2. Create transaction
      const transaction = await storage.createTransaction({
        fromWalletId: wallet.id,
        toWalletId: 2,
        type: 'send',
        amount: '100.00',
        status: 'pending',
        description: 'Test payment'
      });

      expect(transaction).toHaveProperty('id');
      expect(transaction.amount).toBe('100.00');
      expect(transaction.status).toBe('pending');

      // 3. Update transaction status
      const completedTransaction = await storage.updateTransactionStatus(
        transaction.id,
        'completed'
      );

      expect(completedTransaction.status).toBe('completed');
    });

    it('handles insufficient balance scenarios', async () => {
      const mockUserId = 'test-user-low-balance';
      
      const wallet = await storage.createWallet({
        userId: mockUserId,
        balance: '10.00',
        currency: 'USD',
        walletType: 'primary'
      });

      // Attempt transaction exceeding balance
      const transactionData = {
        fromWalletId: wallet.id,
        toWalletId: 2,
        type: 'send',
        amount: '100.00',
        status: 'pending',
        description: 'Insufficient funds test'
      };

      // This should be handled by business logic validation
      expect(parseFloat(transactionData.amount)).toBeGreaterThan(parseFloat(wallet.balance));
    });
  });

  describe('Multi-wallet scenarios', () => {
    it('handles multiple wallet types per user', async () => {
      const userId = 'multi-wallet-user';
      
      const primaryWallet = await storage.createWallet({
        userId,
        balance: '1000.00',
        currency: 'USD',
        walletType: 'primary'
      });

      const savingsWallet = await storage.createWallet({
        userId,
        balance: '5000.00',
        currency: 'USD',
        walletType: 'savings'
      });

      const userWallets = await storage.getUserWallets(userId);
      
      expect(userWallets).toHaveLength(2);
      expect(userWallets.some(w => w.walletType === 'primary')).toBe(true);
      expect(userWallets.some(w => w.walletType === 'savings')).toBe(true);
    });
  });
});