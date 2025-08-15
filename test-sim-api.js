// Simple test for the simulation API endpoint
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/sim/step', async (req, res) => {
  console.log('Received request:', req.body);
  
  try {
    const { campaignId = 1, seed = 'test-seed', actions = [] } = req.body;
    
    // Import the simulation engine
    const { step } = await import('./src/server/sim/engine.js');
    
    // Execute simulation step
    const result = await step({
      campaignId: Number(campaignId),
      seed: String(seed),
      actions
    });
    
    console.log('Simulation result:', {
      step: result.step,
      resourcesCount: Object.keys(result.resources).length,
      kpisCount: Object.keys(result.kpis).length
    });
    
    res.json({
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
    console.error('Simulation API error:', error);
    res.status(500).json({ 
      error: 'Simulation step failed',
      message: error.message
    });
  }
});

const PORT = 4012;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});
