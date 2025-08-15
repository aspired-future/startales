import { step, CampaignState } from './engine';
import { db } from '../storage/db';

// Mock the database
jest.mock('../storage/db', () => ({
  db: {
    transaction: jest.fn((callback) => callback({}))
  }
}));

describe('Simulation Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PRNG Determinism', () => {
    it('should produce identical results with the same seed', async () => {
      const params = {
        campaignId: 1,
        seed: 'test-seed-123',
        actions: []
      };

      const result1 = await step(params);
      const result2 = await step(params);

      // Results should be identical with the same seed
      expect(result1.resources).toEqual(result2.resources);
      expect(result1.kpis).toEqual(result2.kpis);
      expect(result1.step).toEqual(result2.step);
    });

    it('should produce different results with different seeds', async () => {
      const params1 = {
        campaignId: 1,
        seed: 'test-seed-123',
        actions: []
      };

      const params2 = {
        campaignId: 1,
        seed: 'test-seed-456',
        actions: []
      };

      const result1 = await step(params1);
      const result2 = await step(params2);

      // Results should be different with different seeds
      expect(result1.resources).not.toEqual(result2.resources);
    });
  });

  describe('Production Reducer', () => {
    it('should calculate resource production based on buildings', async () => {
      const result = await step({
        campaignId: 1,
        seed: 'production-test',
        actions: []
      });

      // Should have positive resource production
      expect(result.resources.credits).toBeGreaterThan(1000); // Base 1000 + production
      expect(result.resources.materials).toBeGreaterThan(500); // Base 500 + production
      expect(result.resources.energy).toBeGreaterThan(200); // Base 200 + production
      expect(result.resources.food).toBeGreaterThan(300); // Base 300 + production
    });

    it('should apply bounded random variation to production', async () => {
      const results = [];
      
      // Run multiple simulations with the same seed
      for (let i = 0; i < 10; i++) {
        const result = await step({
          campaignId: 1,
          seed: `variation-test-${i}`,
          actions: []
        });
        results.push(result.resources.credits);
      }

      // All results should be within reasonable bounds (variation should be ±5%)
      const minExpected = 1000 + Math.floor(2 * 50 * 0.95); // Base + min production
      const maxExpected = 1000 + Math.ceil(2 * 50 * 1.05); // Base + max production
      
      results.forEach(credits => {
        expect(credits).toBeGreaterThanOrEqual(minExpected);
        expect(credits).toBeLessThanOrEqual(maxExpected);
      });
    });
  });

  describe('Queue Reducer', () => {
    it('should advance queue progress', async () => {
      // This test would require mocking the loadCampaignState function
      // to return a state with queue items
      const result = await step({
        campaignId: 1,
        seed: 'queue-test',
        actions: []
      });

      // For now, just verify the step completed successfully
      expect(result.step).toBeGreaterThan(0);
    });
  });

  describe('KPI Calculations', () => {
    it('should calculate KPIs correctly', async () => {
      const result = await step({
        campaignId: 1,
        seed: 'kpi-test',
        actions: []
      });

      expect(result.kpis).toBeDefined();
      expect(result.kpis.total_population).toBeGreaterThan(0);
      expect(result.kpis.total_resources).toBeGreaterThan(0);
      expect(result.kpis.production_rate).toBeGreaterThan(0);
      expect(result.kpis.queue_efficiency).toBeDefined();
    });
  });

  describe('Transaction Handling', () => {
    it('should wrap operations in a database transaction', async () => {
      await step({
        campaignId: 1,
        seed: 'transaction-test',
        actions: []
      });

      expect(db.transaction).toHaveBeenCalledTimes(1);
      expect(db.transaction).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should handle transaction errors gracefully', async () => {
      // Mock transaction to throw an error
      (db.transaction as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Database connection failed');
      });

      await expect(step({
        campaignId: 1,
        seed: 'error-test',
        actions: []
      })).rejects.toThrow('Database connection failed');
    });
  });

  describe('Step Counter', () => {
    it('should increment step counter', async () => {
      const result = await step({
        campaignId: 1,
        seed: 'step-counter-test',
        actions: []
      });

      expect(result.step).toBe(1); // Should increment from 0 to 1
    });
  });

  describe('Vezies Events', () => {
    it('should generate events for queue completions', async () => {
      const result = await step({
        campaignId: 1,
        seed: 'events-test',
        actions: []
      });

      // Events array should exist (may be empty if no queues completed)
      expect(Array.isArray(result.veziesEvents)).toBe(true);
    });
  });
});
