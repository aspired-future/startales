import express from 'express';
import campaignsRouter from '../server/routes/campaigns.js';

const app = express();
app.use(express.json());

// Mount the campaigns API
app.use('/api/campaigns', campaignsRouter);

/**
 * Sprint 2 Demo: Persistence, Memory, Images
 * Demo: save → resume → branch; placeholder→final image swap
 */
app.get('/demo/persistence', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sprint 2 - Persistence, Memory & Images</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 20px; background: #f0f0f0; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .demo-section { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #007bff; }
        .controls { display: flex; gap: 10px; align-items: center; margin: 15px 0; flex-wrap: wrap; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        button:disabled { background: #ccc; cursor: not-allowed; }
        .success { background: #28a745; }
        .warning { background: #ffc107; color: black; }
        .danger { background: #dc3545; }
        input, select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin: 0 5px; }
        .log { height: 200px; overflow-y: auto; background: white; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; border: 1px solid #ddd; }
        .campaign-list { display: grid; gap: 10px; margin: 10px 0; }
        .campaign-item { padding: 10px; background: white; border: 1px solid #ddd; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; }
        .campaign-info { flex: 1; }
        .campaign-actions { display: flex; gap: 5px; }
        .campaign-actions button { padding: 5px 10px; font-size: 12px; }
        .state-display { background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; max-height: 200px; overflow-y: auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Sprint 2: Persistence, Memory & Images</h1>
        <p>Event sourcing with SQLite, save/resume/branch campaigns</p>
        
        <!-- Campaign Creation -->
        <div class="demo-section">
          <h3>📝 Create New Campaign</h3>
          <div class="controls">
            <input type="text" id="campaignName" placeholder="Campaign Name" value="Test Campaign">
            <input type="text" id="campaignSeed" placeholder="Seed" value="demo-seed-${Date.now()}">
            <button onclick="createCampaign()">Create Campaign</button>
          </div>
        </div>
        
        <!-- Campaign List -->
        <div class="demo-section">
          <h3>📋 Saved Campaigns</h3>
          <div class="controls">
            <button onclick="loadCampaigns()">Refresh List</button>
          </div>
          <div id="campaignsList" class="campaign-list">
            Loading campaigns...
          </div>
        </div>
        
        <!-- Active Campaign -->
        <div class="demo-section">
          <h3>🎮 Active Campaign</h3>
          <div class="controls">
            <span>Campaign ID: <strong id="activeCampaignId">None</strong></span>
            <span>Step: <strong id="activeStep">0</strong></span>
            <button id="stepBtn" onclick="executeStep()" disabled>Execute Step</button>
            <button id="branchBtn" onclick="showBranchDialog()" disabled>Branch Campaign</button>
          </div>
          
          <!-- Branch Dialog -->
          <div id="branchDialog" style="display: none; margin-top: 10px;">
            <input type="text" id="branchName" placeholder="Branch Name">
            <input type="number" id="branchFromStep" placeholder="From Step" value="1">
            <button onclick="branchCampaign()">Create Branch</button>
            <button onclick="hideBranchDialog()">Cancel</button>
          </div>
          
          <!-- Current State Display -->
          <div id="currentState" class="state-display">
            No active campaign
          </div>
        </div>
        
        <!-- Activity Log -->
        <div class="demo-section">
          <h3>📋 Activity Log</h3>
          <div id="log" class="log"></div>
        </div>
      </div>

      <script>
        let activeCampaignId = null;
        let currentState = null;
        
        function log(message, type = 'info') {
          const logDiv = document.getElementById('log');
          const timestamp = new Date().toLocaleTimeString();
          const color = type === 'error' ? 'red' : type === 'success' ? 'green' : 'black';
          logDiv.innerHTML += \`<div style="color: \${color}">[\${timestamp}] \${message}</div>\`;
          logDiv.scrollTop = logDiv.scrollHeight;
        }
        
        async function createCampaign() {
          const name = document.getElementById('campaignName').value;
          const seed = document.getElementById('campaignSeed').value;
          
          if (!name || !seed) {
            log('Campaign name and seed are required', 'error');
            return;
          }
          
          try {
            const response = await fetch('/api/campaigns', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, seed })
            });
            
            const result = await response.json();
            
            if (result.success) {
              log(\`✅ Campaign created: "\${name}" (ID: \${result.campaignId})\`, 'success');
              loadCampaigns();
              
              // Generate a new seed for next campaign
              document.getElementById('campaignSeed').value = \`demo-seed-\${Date.now()}\`;
            } else {
              log(\`❌ Failed to create campaign: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        async function loadCampaigns() {
          try {
            const response = await fetch('/api/campaigns');
            const result = await response.json();
            
            if (result.success) {
              displayCampaigns(result.campaigns);
              log(\`📋 Loaded \${result.campaigns.length} campaigns\`);
            } else {
              log(\`❌ Failed to load campaigns: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        function displayCampaigns(campaigns) {
          const listDiv = document.getElementById('campaignsList');
          
          if (campaigns.length === 0) {
            listDiv.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No campaigns found</div>';
            return;
          }
          
          listDiv.innerHTML = campaigns.map(campaign => \`
            <div class="campaign-item">
              <div class="campaign-info">
                <strong>\${campaign.name}</strong><br>
                <small>ID: \${campaign.id} | Step: \${campaign.currentSequence} | Status: \${campaign.status}</small>
                \${campaign.lastPlayed ? \`<br><small>Last played: \${new Date(campaign.lastPlayed).toLocaleString()}</small>\` : ''}
              </div>
              <div class="campaign-actions">
                \${campaign.canResume ? \`<button onclick="resumeCampaign(\${campaign.id})" class="success">Resume</button>\` : ''}
                <button onclick="viewBranches(\${campaign.id})">Branches</button>
              </div>
            </div>
          \`).join('');
        }
        
        async function resumeCampaign(campaignId) {
          try {
            log(\`📂 Resuming campaign \${campaignId}...\`);
            
            const response = await fetch(\`/api/campaigns/\${campaignId}/resume\`);
            const result = await response.json();
            
            if (result.success) {
              activeCampaignId = campaignId;
              currentState = result.currentState;
              
              document.getElementById('activeCampaignId').textContent = campaignId;
              document.getElementById('activeStep').textContent = currentState.step;
              document.getElementById('stepBtn').disabled = false;
              document.getElementById('branchBtn').disabled = false;
              
              updateStateDisplay();
              log(\`✅ Campaign \${campaignId} resumed at step \${currentState.step}\`, 'success');
            } else {
              log(\`❌ Failed to resume campaign: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        async function executeStep() {
          if (!activeCampaignId) {
            log('No active campaign', 'error');
            return;
          }
          
          const seed = \`step-\${Date.now()}\`;
          
          try {
            log(\`⚡ Executing step with seed: \${seed}\`);
            
            const response = await fetch(\`/api/campaigns/\${activeCampaignId}/step\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ seed })
            });
            
            const result = await response.json();
            
            if (result.success) {
              currentState = result.state;
              document.getElementById('activeStep').textContent = result.step;
              updateStateDisplay();
              log(\`✅ Step \${result.step} completed and saved\`, 'success');
            } else {
              log(\`❌ Failed to execute step: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        function showBranchDialog() {
          if (!activeCampaignId) return;
          
          document.getElementById('branchDialog').style.display = 'block';
          document.getElementById('branchFromStep').value = currentState?.step || 1;
        }
        
        function hideBranchDialog() {
          document.getElementById('branchDialog').style.display = 'none';
        }
        
        async function branchCampaign() {
          const branchName = document.getElementById('branchName').value;
          const fromStep = parseInt(document.getElementById('branchFromStep').value);
          
          if (!branchName || isNaN(fromStep)) {
            log('Branch name and step number are required', 'error');
            return;
          }
          
          try {
            log(\`🌿 Creating branch "\${branchName}" from step \${fromStep}...\`);
            
            const response = await fetch(\`/api/campaigns/\${activeCampaignId}/branch\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ branchName, fromStep })
            });
            
            const result = await response.json();
            
            if (result.success) {
              log(\`✅ Branch "\${branchName}" created (ID: \${result.branchCampaignId})\`, 'success');
              hideBranchDialog();
              loadCampaigns();
            } else {
              log(\`❌ Failed to branch campaign: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        async function viewBranches(campaignId) {
          try {
            const response = await fetch(\`/api/campaigns/\${campaignId}/branches\`);
            const result = await response.json();
            
            if (result.success) {
              const branchCount = result.branches.length;
              log(\`📊 Campaign \${campaignId} has \${branchCount} branches\`);
              
              if (branchCount > 0) {
                result.branches.forEach(branch => {
                  log(\`  🌿 \${branch.name} (ID: \${branch.id}) - branched at step \${branch.branchPoint}\`);
                });
              }
            } else {
              log(\`❌ Failed to load branches: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        function updateStateDisplay() {
          const stateDiv = document.getElementById('currentState');
          
          if (!currentState) {
            stateDiv.textContent = 'No active campaign';
            return;
          }
          
          stateDiv.innerHTML = \`
            <strong>Step:</strong> \${currentState.step}<br>
            <strong>Resources:</strong><br>
            &nbsp;&nbsp;Credits: \${currentState.resources.credits}<br>
            &nbsp;&nbsp;Materials: \${currentState.resources.materials}<br>
            &nbsp;&nbsp;Energy: \${currentState.resources.energy}<br>
            &nbsp;&nbsp;Food: \${currentState.resources.food}<br>
            <strong>Buildings:</strong><br>
            \${Object.entries(currentState.buildings).map(([type, count]) => 
              \`&nbsp;&nbsp;\${type}: \${count}\`
            ).join('<br>')}<br>
            <strong>Queues:</strong> \${currentState.queues.length}<br>
            <strong>Events:</strong> \${currentState.veziesEvents.length}
          \`;
        }
        
        // Initialize
        log('🚀 Sprint 2 Persistence Demo initialized');
        loadCampaigns();
      </script>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4015;

if (process.env.DEMO_START === '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Sprint 2 Demo Server running on http://localhost:${PORT}`);
    console.log(`💾 Persistence Demo: http://localhost:${PORT}/demo/persistence`);
  });
}

export default app;
