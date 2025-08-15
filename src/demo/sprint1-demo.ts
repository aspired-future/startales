import express from 'express';
import { step } from '../server/sim/engine.js';

const app = express();
app.use(express.json());

// Sprint 1 Demo: Core Loop + Simulation HUD
app.get('/demo/hud', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sprint 1 - Core Loop + Simulation HUD</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 20px; background: #f0f0f0; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .hud-panel { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #007bff; }
        .meter { background: #e9ecef; height: 20px; border-radius: 10px; margin: 5px 0; overflow: hidden; }
        .meter-fill { height: 100%; background: linear-gradient(90deg, #28a745, #20c997); transition: width 0.3s ease; }
        .controls { display: flex; gap: 10px; align-items: center; margin: 15px 0; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .stat-card { background: white; padding: 15px; border-radius: 4px; border: 1px solid #dee2e6; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Sprint 1: Core Loop + Simulation HUD</h1>
        <p>Deterministic simulation engine with HUD visualization</p>
        
        <div class="hud-panel">
          <h3>Simulation Controls</h3>
          <div class="controls">
            <button id="stepBtn">Step Engine</button>
            <span>Step: <strong id="stepCount">0</strong></span>
            <span style="margin-left: 20px">Seed: <strong id="currentSeed">-</strong></span>
          </div>
        </div>
        
        <div class="hud-panel">
          <h3>📊 Key Performance Indicators</h3>
          <div class="stats">
            <div class="stat-card">
              <div>Production Rate</div>
              <div class="meter"><div id="productionMeter" class="meter-fill" style="width: 0%"></div></div>
              <div><span id="productionValue">0</span> units/tick</div>
            </div>
            <div class="stat-card">
              <div>Queue Efficiency</div>
              <div class="meter"><div id="queueMeter" class="meter-fill" style="width: 0%"></div></div>
              <div><span id="queueValue">0</span>%</div>
            </div>
            <div class="stat-card">
              <div>Military Readiness</div>
              <div class="meter"><div id="readinessMeter" class="meter-fill" style="width: 0%"></div></div>
              <div><span id="readinessValue">0</span>%</div>
            </div>
            <div class="stat-card">
              <div>Science Progress</div>
              <div class="meter"><div id="scienceMeter" class="meter-fill" style="width: 0%"></div></div>
              <div><span id="scienceValue">0</span>%</div>
            </div>
          </div>
        </div>
        
        <div class="hud-panel">
          <h3>🏗️ Resources & Buildings</h3>
          <div class="stats">
            <div class="stat-card">
              <div>Credits: <strong id="credits">0</strong></div>
              <div>Materials: <strong id="materials">0</strong></div>
              <div>Energy: <strong id="energy">0</strong></div>
              <div>Food: <strong id="food">0</strong></div>
            </div>
            <div class="stat-card">
              <div id="buildings">No buildings</div>
            </div>
          </div>
        </div>
        
        <div class="hud-panel">
          <h3>📋 Activity Log</h3>
          <div id="log" style="height: 150px; overflow-y: auto; background: white; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;"></div>
        </div>
      </div>

      <script>
        let stepCount = 0;
        let currentSeed = '';
        
        function log(message) {
          const logDiv = document.getElementById('log');
          const timestamp = new Date().toLocaleTimeString();
          logDiv.innerHTML += \`<div>[\${timestamp}] \${message}</div>\`;
          logDiv.scrollTop = logDiv.scrollHeight;
        }
        
        function updateMeter(meterId, value, max = 100) {
          const percentage = Math.min(100, (value / max) * 100);
          document.getElementById(meterId).style.width = \`\${percentage}%\`;
        }
        
        function updateHUD(data) {
          // Update step counter
          stepCount = data.step;
          document.getElementById('stepCount').textContent = stepCount;
          document.getElementById('currentSeed').textContent = currentSeed;
          
          // Update resources
          document.getElementById('credits').textContent = data.resources.credits || 0;
          document.getElementById('materials').textContent = data.resources.materials || 0;
          document.getElementById('energy').textContent = data.resources.energy || 0;
          document.getElementById('food').textContent = data.resources.food || 0;
          
          // Update buildings
          const buildingsDiv = document.getElementById('buildings');
          const buildingEntries = Object.entries(data.buildings);
          if (buildingEntries.length > 0) {
            buildingsDiv.innerHTML = buildingEntries
              .map(([building, count]) => \`<div>\${building}: \${count}</div>\`)
              .join('');
          } else {
            buildingsDiv.innerHTML = 'No buildings';
          }
          
          // Update KPI meters
          const kpis = data.kpis;
          
          const production = Math.min(100, kpis.production_rate || 0);
          updateMeter('productionMeter', production);
          document.getElementById('productionValue').textContent = Math.round(production);
          
          const queueEff = Math.min(100, (kpis.queue_efficiency || 0) * 100);
          updateMeter('queueMeter', queueEff);
          document.getElementById('queueValue').textContent = Math.round(queueEff);
          
          const readiness = Math.min(100, (kpis.military_readiness || 0) * 100);
          updateMeter('readinessMeter', readiness);
          document.getElementById('readinessValue').textContent = Math.round(readiness);
          
          const science = Math.min(100, (kpis.science_progress || 0) * 100);
          updateMeter('scienceMeter', science);
          document.getElementById('scienceValue').textContent = Math.round(science);
          
          log(\`Step \${data.step} completed - \${data.eventCount} events generated\`);
        }
        
        async function stepSimulation() {
          currentSeed = 'sprint1-demo-' + Date.now();
          log(\`Starting simulation step with seed: \${currentSeed}\`);
          
          try {
            const response = await fetch('/api/sim/step', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                campaignId: 1, 
                seed: currentSeed
              })
            });
            
            const result = await response.json();
            
            if (result.success) {
              updateHUD(result.data);
              log(\`✅ Simulation successful\`);
            } else {
              log(\`❌ Error: \${result.error}\`);
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`);
          }
        }
        
        // Initialize
        document.getElementById('stepBtn').addEventListener('click', stepSimulation);
        log('Sprint 1 HUD Demo initialized - Click "Step Engine" to begin');
      </script>
    </body>
    </html>
  `);
});

// Sprint 1 API: POST /api/sim/step
app.post('/api/sim/step', async (req, res) => {
  try {
    const { campaignId = 1, seed = 'default-seed', actions = [] } = req.body;
    
    console.log(`[API] Simulation step - Campaign: ${campaignId}, Seed: ${seed}`);
    
    // Execute simulation step
    const result = await step({
      campaignId: Number(campaignId),
      seed: String(seed),
      actions
    });
    
    console.log(`[API] Step ${result.step} completed`);
    
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
    console.error('[API] Simulation error:', error);
    res.status(500).json({ 
      error: 'Simulation step failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Sprint 1 API: GET /api/analytics/empire
app.get('/api/analytics/empire', async (req, res) => {
  try {
    const { scope = 'campaign', id = 1 } = req.query;
    
    const analytics = {
      scope,
      id: Number(id),
      timestamp: new Date().toISOString(),
      metrics: {
        total_population: 700,
        total_resources: 2000,
        production_rate: 70,
        queue_efficiency: 1.0,
        military_readiness: 0.75,
        science_progress: 0.60,
        logistics_efficiency: 0.85
      }
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('[API] Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Sprint 1 API: GET /api/analytics/snapshots
app.get('/api/analytics/snapshots', async (req, res) => {
  try {
    const { scope = 'campaign', id = 1, limit = 10 } = req.query;
    
    const snapshots = [];
    const now = Date.now();
    
    for (let i = 0; i < Number(limit); i++) {
      snapshots.push({
        id: i + 1,
        scope,
        campaign_id: Number(id),
        timestamp: new Date(now - i * 60000).toISOString(),
        metrics: {
          total_population: 700 + (i * 50),
          total_resources: 2000 + (i * 100),
          production_rate: 70 + (i * 5),
          military_readiness: Math.min(1.0, 0.5 + (i * 0.05))
        }
      });
    }
    
    res.json({ snapshots: snapshots.reverse() });
  } catch (error) {
    console.error('[API] Snapshots error:', error);
    res.status(500).json({ error: 'Failed to fetch snapshots' });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4013;

if (process.env.DEMO_START === '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Sprint 1 Demo Server running on http://localhost:${PORT}`);
    console.log(`📊 HUD Demo: http://localhost:${PORT}/demo/hud`);
  });
}

export default app;
