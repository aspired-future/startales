import request from 'supertest';
import { createServer } from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';
import handler from '@/pages/api/sim/step';

// Create a test server for the API endpoint
const testServer = createServer((req, res) => {
  return apiResolver(req, res, undefined, handler, {}, undefined);
});

describe('/api/sim/step', () => {
  describe('POST /api/sim/step', () => {
    it('should return 200 and simulation results for valid request', async () => {
      const response = await request(testServer)
        .post('/api/sim/step')
        .send({
          campaignId: 1,
          seed: 'test-seed-123',
          actions: []
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          step: expect.any(Number),
          resources: expect.any(Object),
          buildings: expect.any(Object),
          kpis: expect.any(Object),
          queueCount: expect.any(Number),
          eventCount: expect.any(Number)
        }
      });
    });

    it('should return 400 for missing campaignId', async () => {
      const response = await request(testServer)
        .post('/api/sim/step')
        .send({
          seed: 'test-seed-123',
          actions: []
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: 'Campaign ID is required'
      });
    });

    it('should return 400 for missing seed', async () => {
      const response = await request(testServer)
        .post('/api/sim/step')
        .send({
          campaignId: 1,
          actions: []
        });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: 'Seed is required for deterministic simulation'
      });
    });

    it('should handle actions parameter correctly', async () => {
      const actions = [
        { type: 'build', itemId: 'factory', priority: 1 },
        { type: 'research', itemId: 'advanced_materials', priority: 2 }
      ];

      const response = await request(testServer)
        .post('/api/sim/step')
        .send({
          campaignId: 1,
          seed: 'test-seed-with-actions',
          actions
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return deterministic results for the same seed', async () => {
      const requestData = {
        campaignId: 1,
        seed: 'determinism-test-seed',
        actions: []
      };

      const response1 = await request(testServer)
        .post('/api/sim/step')
        .send(requestData);

      const response2 = await request(testServer)
        .post('/api/sim/step')
        .send(requestData);

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      
      // Results should be identical for the same seed
      expect(response1.body.data.resources).toEqual(response2.body.data.resources);
      expect(response1.body.data.kpis).toEqual(response2.body.data.kpis);
    });

    it('should return different results for different seeds', async () => {
      const response1 = await request(testServer)
        .post('/api/sim/step')
        .send({
          campaignId: 1,
          seed: 'seed-1',
          actions: []
        });

      const response2 = await request(testServer)
        .post('/api/sim/step')
        .send({
          campaignId: 1,
          seed: 'seed-2',
          actions: []
        });

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      
      // Results should be different for different seeds
      expect(response1.body.data.resources).not.toEqual(response2.body.data.resources);
    });

    it('should return 405 for non-POST requests', async () => {
      const response = await request(testServer)
        .get('/api/sim/step');

      expect(response.status).toBe(405);
      expect(response.body).toMatchObject({
        error: 'Method not allowed'
      });
    });

    it('should handle simulation errors gracefully', async () => {
      // Test with invalid campaignId that might cause database errors
      const response = await request(testServer)
        .post('/api/sim/step')
        .send({
          campaignId: -1,
          seed: 'error-test-seed',
          actions: []
        });

      // Should either succeed or return a proper error response
      if (response.status !== 200) {
        expect(response.status).toBe(500);
        expect(response.body).toMatchObject({
          error: 'Simulation step failed',
          message: expect.any(String)
        });
      }
    });
  });
});