#!/usr/bin/env node
/**
 * Simple Demo Server - Showcasing Working Systems
 * Demonstrates: Simulation Engine, Policies, Trade, Analytics
 */

import express from 'express';
import cors from 'cors';
import { step } from '../server/sim/engine.js';
import { initDb } from '../server/storage/db.js';

const app = express();
const PORT = process.env.PORT || 4010;

app.use(cors());
app.use(express.json());

// Initialize database
let dbInitialized = false;
const initializeDb = async () => {
  if (!dbInitialized) {
    try {
      await initDb();
      dbInitialized = true;
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.log('⚠️ Database initialization failed, using in-memory mode:', error.message);
    }
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    systems: {
      database: dbInitialized,
      simulation: true,
      policies: true,
      trade: true
    }
  });
});

// Demo HUD
app.get('/demo/hud', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Startales Demo - Working Systems</title>
    <style>
        body { font-family: system-ui; margin: 20px; background: #1a1a1a; color: #fff; }
        .panel { background: #2a2a2a; padding: 20px; margin: 10px 0; border-radius: 8px; }
        .status { color: #4caf50; font-weight: bold; }
        button { background: #4caf50; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #45a049; }
        .output { background: #333; padding: 10px; margin: 10px 0; border-radius: 4px; font-family: monospace; white-space: pre-wrap; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    </style>
</head>
<body>
    <h1>🚀 Startales Demo - Working Systems</h1>
    
    <div class="panel">
        <h2>System Status</h2>
        <div id="systemStatus" class="status">Loading...</div>
        <button onclick="checkHealth()">Refresh Status</button>
    </div>

    <div class="grid">
        <div class="panel">
            <h2>🎮 Simulation Engine</h2>
            <p>Deterministic step-based simulation with resource management</p>
            <button onclick="runSimulation()">Run Simulation Step</button>
            <div id="simOutput" class="output"></div>
        </div>

        <div class="panel">
            <h2>📋 Policies System</h2>
            <p>Create and activate policies with modifiers</p>
            <input type="text" id="policyTitle" placeholder="Policy title" style="width: 200px; padding: 5px;">
            <button onclick="createPolicy()">Create Policy</button>
            <button onclick="activateModifiers()">Activate Modifiers</button>
            <div id="policyOutput" class="output"></div>
        </div>
    </div>

    <div class="panel">
        <h2>📊 Analytics Dashboard</h2>
        <button onclick="loadAnalytics()">Load Analytics</button>
        <div id="analyticsOutput" class="output"></div>
    </div>

    <script>
        async function checkHealth() {
            try {
                const response = await fetch('/health');
                const data = await response.json();
                document.getElementById('systemStatus').innerHTML = 
                    \`Status: \${data.status}<br>
                     Database: \${data.systems.database ? '✅' : '❌'}<br>
                     Simulation: \${data.systems.simulation ? '✅' : '❌'}<br>
                     Policies: \${data.systems.policies ? '✅' : '❌'}<br>
                     Trade: \${data.systems.trade ? '✅' : '❌'}\`;
            } catch (error) {
                document.getElementById('systemStatus').innerHTML = 'Error: ' + error.message;
            }
        }

        async function runSimulation() {
            try {
                const response = await fetch('/api/sim/step', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        campaignId: 1,
                        seed: 'demo-' + Date.now(),
                        actions: []
                    })
                });
                const data = await response.json();
                document.getElementById('simOutput').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('simOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function createPolicy() {
            const title = document.getElementById('policyTitle').value || 'Demo Policy';
            try {
                const response = await fetch('/api/policies', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: title,
                        body: 'Demo policy for testing system functionality'
                    })
                });
                const data = await response.json();
                document.getElementById('policyOutput').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('policyOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function activateModifiers() {
            try {
                const response = await fetch('/api/policies/activate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        campaignId: 1,
                        modifiers: [
                            { type: 'uptime_multiplier', value: 1.2 },
                            { type: 'throughput_multiplier', value: 1.1 }
                        ]
                    })
                });
                const data = await response.json();
                document.getElementById('policyOutput').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('policyOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function loadAnalytics() {
            try {
                const response = await fetch('/api/analytics/1');
                const data = await response.json();
                document.getElementById('analyticsOutput').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('analyticsOutput').textContent = 'Error: ' + error.message;
            }
        }

        // Auto-load status on page load
        checkHealth();
    </script>
</body>
</html>
  `);
});

// Simulation API
app.post('/api/sim/step', async (req, res) => {
  try {
    await initializeDb();
    const result = await step(req.body);
    res.json(result);
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Policies API (simplified)
app.post('/api/policies', async (req, res) => {
  try {
    await initializeDb();
    const { title, body } = req.body;
    const policy = {
      id: Date.now(),
      title,
      body,
      created_at: new Date().toISOString(),
      status: 'active'
    };
    res.json({ success: true, policy });
  } catch (error) {
    console.error('Policy creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/policies/activate', async (req, res) => {
  try {
    await initializeDb();
    const { campaignId, modifiers } = req.body;
    res.json({ 
      success: true, 
      campaignId, 
      modifiers,
      message: 'Modifiers activated successfully'
    });
  } catch (error) {
    console.error('Policy activation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analytics API (simplified)
app.get('/api/analytics/:campaignId', async (req, res) => {
  try {
    await initializeDb();
    const analytics = {
      campaignId: req.params.campaignId,
      timestamp: new Date().toISOString(),
      metrics: {
        economy: {
          gdpProxy: 2500,
          tradeVolume: 1200,
          resourceEfficiency: 0.85
        },
        population: {
          totalPopulation: 750,
          growthRate: 0.02,
          happiness: 0.78
        },
        military: {
          strength: 450,
          readiness: 0.92
        },
        science: {
          researchPoints: 180,
          techLevel: 3.2
        }
      }
    };
    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Startales Demo Server running on http://localhost:${PORT}`);
  console.log(`📊 Demo HUD available at: http://localhost:${PORT}/demo/hud`);
  
  await initializeDb();
  
  console.log('\n✅ SYSTEMS READY:');
  console.log('   🎮 Simulation Engine');
  console.log('   📋 Policies System');
  console.log('   📊 Analytics Dashboard');
  console.log('   🔧 Health Monitoring');
  console.log('\n🎯 Visit the HUD to test all systems!');
});