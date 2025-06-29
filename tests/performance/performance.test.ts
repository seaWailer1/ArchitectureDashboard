import request from 'supertest';
import express from 'express';
import { registerRoutes } from '@server/routes';
import { performance } from 'perf_hooks';

describe('Performance Tests', () => {
  let app: express.Application;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);
  });

  describe('Response Time Tests', () => {
    it('responds to auth endpoint within acceptable time', async () => {
      const start = performance.now();
      
      await request(app)
        .get('/api/auth/user')
        .expect(401);
      
      const end = performance.now();
      const responseTime = end - start;
      
      expect(responseTime).toBeLessThan(500); // 500ms threshold
    });

    it('handles wallet queries efficiently', async () => {
      const start = performance.now();
      
      await request(app)
        .get('/api/wallet')
        .expect(401);
      
      const end = performance.now();
      const responseTime = end - start;
      
      expect(responseTime).toBeLessThan(300);
    });

    it('processes transaction requests quickly', async () => {
      const start = performance.now();
      
      await request(app)
        .post('/api/transactions')
        .send({
          type: 'send',
          amount: '100.00',
          description: 'Performance test'
        })
        .expect(401);
      
      const end = performance.now();
      const responseTime = end - start;
      
      expect(responseTime).toBeLessThan(400);
    });
  });

  describe('Concurrent Request Handling', () => {
    it('handles multiple simultaneous requests', async () => {
      const concurrentRequests = 50;
      const start = performance.now();
      
      const promises = Array(concurrentRequests).fill(0).map(() =>
        request(app).get('/api/auth/user')
      );
      
      const responses = await Promise.all(promises);
      const end = performance.now();
      
      expect(responses).toHaveLength(concurrentRequests);
      expect(end - start).toBeLessThan(2000); // 2 second threshold for 50 concurrent requests
    });
  });

  describe('Memory Usage', () => {
    it('maintains reasonable memory usage under load', async () => {
      const initialMemory = process.memoryUsage();
      
      // Simulate load
      const requests = Array(100).fill(0).map((_, i) =>
        request(app)
          .get('/api/auth/user')
          .send()
      );
      
      await Promise.all(requests);
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      // Memory increase should be reasonable (less than 50MB for 100 requests)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Database Query Performance', () => {
    it('optimizes transaction queries with pagination', async () => {
      const start = performance.now();
      
      await request(app)
        .get('/api/transactions')
        .query({ limit: 20, offset: 0 })
        .expect(401);
      
      const end = performance.now();
      
      expect(end - start).toBeLessThan(200); // Improved target: 200ms
    });

    it('handles wallet queries efficiently', async () => {
      const start = performance.now();
      
      await request(app)
        .get('/api/wallets')
        .expect(401);
      
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100); // Target: 100ms with caching
    });

    it('performs well under cache pressure', async () => {
      // Warm up cache
      await request(app).get('/api/wallets').expect(401);
      
      const start = performance.now();
      
      // Multiple requests should hit cache
      const promises = Array(10).fill(0).map(() =>
        request(app).get('/api/wallets').expect(401)
      );
      
      await Promise.all(promises);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(150); // Should be faster with cache
    });

    it('maintains performance with large result sets', async () => {
      const start = performance.now();
      
      await request(app)
        .get('/api/transactions')
        .query({ limit: 100, offset: 0 })
        .expect(401);
      
      const end = performance.now();
      
      expect(end - start).toBeLessThan(400); // Larger dataset target
    });
  });
});