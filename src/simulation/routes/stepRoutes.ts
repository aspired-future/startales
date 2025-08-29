/**
 * Simulation Step API Routes
 * Provides endpoints for executing simulation steps
 */

import express from 'express';
import { step } from '../engine/engine';

export function createStepRoutes(): express.Router {
  const router = express.Router();

  // POST /api/sim/step - Execute a simulation step
  router.post('/step', async (req: express.Request, res: express.Response) => {
    const { campaignId, seed, actions = [] } = req.body;

    // Validate required parameters
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    if (!seed) {
      return res.status(400).json({ error: 'Seed is required for deterministic simulation' });
    }

    try {
      // Execute simulation step
      const result = await step({
        campaignId: Number(campaignId),
        seed: String(seed),
        actions
      });

      return res.status(200).json({
        success: true,
        data: {
          step: result.step,
          resources: result.resources,
          buildings: result.buildings,
          kpis: result.kpis,
          queueCount: result.queues.length,
          eventCount: result.veziesEvents.length
        }
      });
    } catch (error) {
      console.error('Simulation step API error:', error);
      return res.status(500).json({ 
        error: 'Simulation step failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
}

export default createStepRoutes;
