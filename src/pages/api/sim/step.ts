import { NextApiRequest, NextApiResponse } from 'next';
import { step } from '@/server/sim/engine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
