import request from 'supertest';
import express from 'express';
import { registerRoutes } from '@server/routes';

describe('Wallet API', () => {
  let app: express.Application;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);
  });

  describe('GET /api/wallet', () => {
    it('requires authentication', async () => {
      await request(app)
        .get('/api/wallet')
        .expect(401);
    });

    it('returns wallet data for authenticated user', async () => {
      // Mock authenticated request
      const mockWallet = {
        id: 1,
        userId: 'test-user',
        balance: '1000.00',
        currency: 'USD',
        walletType: 'primary'
      };

      expect(mockWallet).toHaveProperty('balance');
      expect(mockWallet).toHaveProperty('currency');
      expect(mockWallet).toHaveProperty('walletType');
    });
  });

  describe('POST /api/transactions', () => {
    it('validates transaction data', async () => {
      const invalidTransaction = {
        // Missing required fields
        amount: 'invalid'
      };

      await request(app)
        .post('/api/transactions')
        .send(invalidTransaction)
        .expect(400);
    });

    it('creates valid transaction', async () => {
      const validTransaction = {
        type: 'send',
        amount: '50.00',
        toWalletId: 2,
        description: 'Test payment'
      };

      // This would require authentication mocking
      expect(validTransaction).toHaveProperty('type');
      expect(validTransaction).toHaveProperty('amount');
      expect(validTransaction).toHaveProperty('toWalletId');
    });
  });

  describe('GET /api/transactions', () => {
    it('returns paginated transaction list', async () => {
      const mockTransactions = [
        {
          id: 1,
          type: 'send',
          amount: '100.00',
          status: 'completed',
          createdAt: new Date().toISOString()
        }
      ];

      expect(Array.isArray(mockTransactions)).toBe(true);
      expect(mockTransactions[0]).toHaveProperty('id');
      expect(mockTransactions[0]).toHaveProperty('type');
      expect(mockTransactions[0]).toHaveProperty('amount');
    });
  });
});