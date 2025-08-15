import express from 'express';
import policiesRouter from '../server/routes/policies';
import advisorsRouter from '../server/routes/advisors';
import campaignsRouter from '../server/routes/campaigns';

const app = express();
app.use(express.json());

// Mount the API routers
app.use('/api/policies', policiesRouter);
app.use('/api/advisors', advisorsRouter);
app.use('/api/campaigns', campaignsRouter);

/**
 * Sprint 3 Demo: Policies & Advisors
 * Demo: approve policy → step → KPI delta; advisor propose→approve→step
 */
app.get('/demo/policies', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sprint 3 - Policies & Advisors</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 20px; background: #f0f0f0; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .demo-section { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #007bff; }
        .controls { display: flex; gap: 10px; align-items: center; margin: 15px 0; flex-wrap: wrap; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        button:disabled { background: #ccc; cursor: not-allowed; }
        .success { background: #28a745; }
        .warning { background: #ffc107; color: black; }
        .danger { background: #dc3545; }
        input, select, textarea { padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin: 0 5px; }
        textarea { width: 100%; min-height: 100px; resize: vertical; }
        .log { height: 200px; overflow-y: auto; background: white; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; border: 1px solid #ddd; }
        .policy-list, .advisor-list { display: grid; gap: 10px; margin: 10px 0; }
        .policy-item, .advisor-item { padding: 15px; background: white; border: 1px solid #ddd; border-radius: 4px; }
        .policy-item h4, .advisor-item h4 { margin: 0 0 10px 0; }
        .policy-actions, .advisor-actions { display: flex; gap: 5px; margin-top: 10px; }
        .policy-actions button, .advisor-actions button { padding: 5px 10px; font-size: 12px; }
        .status-badge { padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
        .status-draft { background: #e9ecef; color: #495057; }
        .status-active { background: #d4edda; color: #155724; }
        .status-pending { background: #fff3cd; color: #856404; }
        .risk-low { color: #28a745; }
        .risk-medium { color: #ffc107; }
        .risk-high { color: #dc3545; }
        .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .advisor-response { background: #f8f9fa; padding: 10px; border-radius: 4px; margin: 10px 0; border-left: 3px solid #007bff; }
        .proposal-box { background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 4px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Sprint 3: Policies & Advisors</h1>
        <p>Policy console (free-form text → capped modifiers) and Advisors (query/propose) integrated with engine</p>
        
        <!-- Campaign Selection -->
        <div class="demo-section">
          <h3>🎮 Campaign Context</h3>
          <div class="controls">
            <label>Campaign ID:</label>
            <input type="number" id="campaignId" value="1" min="1">
            <button onclick="loadCampaignContext()">Load Campaign</button>
            <span id="campaignInfo" style="margin-left: 20px;">No campaign loaded</span>
          </div>
        </div>
        
        <div class="two-column">
          <!-- Policy Console -->
          <div class="demo-section">
            <h3>📋 Policy Console</h3>
            <div style="margin-bottom: 15px;">
              <label><strong>Free-form Policy Text:</strong></label>
              <textarea id="policyText" placeholder="Enter policy description...
Example: 'Increase military spending by 40% to improve defense readiness and modernize equipment'"></textarea>
            </div>
            <div class="controls">
              <label><input type="checkbox" id="requireApproval"> Require Approval</label>
              <button onclick="createPolicy()">Parse & Create Policy</button>
            </div>
            
            <div id="policyParseResult" style="margin-top: 15px;"></div>
            
            <h4>Campaign Policies:</h4>
            <div class="controls">
              <button onclick="loadPolicies()">Refresh Policies</button>
              <select id="policyStatusFilter">
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div id="policiesList" class="policy-list">Loading policies...</div>
          </div>
          
          <!-- Advisor System -->
          <div class="demo-section">
            <h3>👥 Advisor System</h3>
            
            <h4>Available Advisors:</h4>
            <div id="advisorsList" class="advisor-list">Loading advisors...</div>
            
            <h4>Query Advisor:</h4>
            <div style="margin-bottom: 15px;">
              <select id="advisorDomain">
                <option value="economic">Economic Advisor</option>
                <option value="military">Defense Secretary</option>
                <option value="science">Science Advisor</option>
                <option value="infrastructure">Infrastructure Minister</option>
                <option value="foreign">Foreign Minister</option>
              </select>
            </div>
            <div style="margin-bottom: 15px;">
              <textarea id="advisorQuestion" placeholder="Ask your advisor a question...
Example: 'What should our tax policy be given current economic conditions?'"></textarea>
            </div>
            <div class="controls">
              <button onclick="queryAdvisor()">Query Advisor</button>
              <button onclick="requestProposal()">Request Policy Proposal</button>
            </div>
            
            <div id="advisorResponse" style="margin-top: 15px;"></div>
          </div>
        </div>
        
        <!-- Simulation Integration -->
        <div class="demo-section">
          <h3>⚡ Simulation Integration</h3>
          <div class="controls">
            <button onclick="executeStepWithPolicies()" id="stepBtn">Execute Simulation Step</button>
            <span>This will apply active policy modifiers to the simulation</span>
          </div>
          <div id="simulationResult" style="margin-top: 15px;"></div>
        </div>
        
        <!-- Activity Log -->
        <div class="demo-section">
          <h3>📋 Activity Log</h3>
          <div id="log" class="log"></div>
        </div>
      </div>

      <script>
        let currentCampaignId = 1;
        let campaignState = null;
        
        function log(message, type = 'info') {
          const logDiv = document.getElementById('log');
          const timestamp = new Date().toLocaleTimeString();
          const color = type === 'error' ? 'red' : type === 'success' ? 'green' : type === 'warning' ? 'orange' : 'black';
          logDiv.innerHTML += \`<div style="color: \${color}">[\${timestamp}] \${message}</div>\`;
          logDiv.scrollTop = logDiv.scrollHeight;
        }
        
        async function loadCampaignContext() {
          currentCampaignId = parseInt(document.getElementById('campaignId').value);
          
          try {
            log(\`Loading campaign \${currentCampaignId} context...\`);
            
            const response = await fetch(\`/api/campaigns/\${currentCampaignId}/resume\`);
            const result = await response.json();
            
            if (result.success) {
              campaignState = result.currentState;
              document.getElementById('campaignInfo').textContent = 
                \`Campaign \${currentCampaignId} - Step: \${campaignState.step}, Credits: \${campaignState.resources.credits}\`;
              log(\`✅ Campaign \${currentCampaignId} loaded (Step: \${campaignState.step})\`, 'success');
              
              // Load policies and advisors for this campaign
              loadPolicies();
              loadAdvisors();
            } else {
              log(\`❌ Failed to load campaign: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        async function createPolicy() {
          const rawText = document.getElementById('policyText').value;
          const requireApproval = document.getElementById('requireApproval').checked;
          
          if (!rawText.trim()) {
            log('Policy text is required', 'error');
            return;
          }
          
          try {
            log('Creating policy from text...');
            
            const response = await fetch('/api/policies', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                campaignId: currentCampaignId,
                rawText,
                requireApproval
              })
            });
            
            const result = await response.json();
            
            if (result.success) {
              log(\`✅ Policy created: "\${result.policy.title}"\`, 'success');
              
              // Display parse result
              const resultDiv = document.getElementById('policyParseResult');
              resultDiv.innerHTML = \`
                <div class="proposal-box">
                  <h4>\${result.policy.title}</h4>
                  <p><strong>Risk Level:</strong> <span class="risk-\${result.policy.riskLevel}">\${result.policy.riskLevel.toUpperCase()}</span></p>
                  <p><strong>Impact:</strong> \${result.policy.estimatedImpact}</p>
                  <p><strong>Modifiers:</strong></p>
                  <ul>
                    \${result.policy.modifiers.map(mod => 
                      \`<li>\${mod.target}: \${mod.operation} \${mod.value} (cap: \${mod.cap})</li>\`
                    ).join('')}
                  </ul>
                  \${result.warnings && result.warnings.length > 0 ? 
                    \`<p><strong>Warnings:</strong> \${result.warnings.join(', ')}</p>\` : ''}
                </div>
              \`;
              
              // Clear the text area and reload policies
              document.getElementById('policyText').value = '';
              loadPolicies();
            } else {
              log(\`❌ Failed to create policy: \${result.message}\`, 'error');
              
              const resultDiv = document.getElementById('policyParseResult');
              resultDiv.innerHTML = \`<div style="color: red; padding: 10px; border: 1px solid red; border-radius: 4px;">
                Error: \${result.message}
              </div>\`;
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        async function loadPolicies() {
          try {
            const statusFilter = document.getElementById('policyStatusFilter').value;
            const url = \`/api/policies?campaignId=\${currentCampaignId}\${statusFilter ? '&status=' + statusFilter : ''}\`;
            
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success) {
              displayPolicies(result.policies, result.stats);
              log(\`📋 Loaded \${result.policies.length} policies\`);
            } else {
              log(\`❌ Failed to load policies: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        function displayPolicies(policies, stats) {
          const listDiv = document.getElementById('policiesList');
          
          if (policies.length === 0) {
            listDiv.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No policies found</div>';
            return;
          }
          
          const statsHtml = \`
            <div style="background: #e9ecef; padding: 10px; border-radius: 4px; margin-bottom: 15px;">
              <strong>Stats:</strong> Total: \${stats.total}, Active: \${stats.active}, Pending: \${stats.pending}, Draft: \${stats.draft}
            </div>
          \`;
          
          const policiesHtml = policies.map(policy => \`
            <div class="policy-item">
              <h4>\${policy.title} <span class="status-badge status-\${policy.status.replace('_', '-')}">\${policy.status}</span></h4>
              <p>\${policy.description}</p>
              <p><strong>Risk:</strong> <span class="risk-\${policy.riskLevel}">\${policy.riskLevel}</span> | 
                 <strong>Impact:</strong> \${policy.estimatedImpact}</p>
              <div class="policy-actions">
                \${policy.status === 'draft' ? \`<button onclick="activatePolicy('\${policy.id}')" class="success">Activate</button>\` : ''}
                <button onclick="viewPolicy('\${policy.id}')">View Details</button>
                <button onclick="deletePolicy('\${policy.id}')" class="danger">Delete</button>
              </div>
            </div>
          \`).join('');
          
          listDiv.innerHTML = statsHtml + policiesHtml;
        }
        
        async function activatePolicy(policyId) {
          try {
            log(\`Activating policy \${policyId}...\`);
            
            const response = await fetch('/api/policies/activate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ policyId })
            });
            
            const result = await response.json();
            
            if (result.success) {
              log(\`✅ Policy activated: "\${result.policy.title}"\`, 'success');
              loadPolicies();
            } else {
              log(\`❌ Failed to activate policy: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        async function loadAdvisors() {
          try {
            const response = await fetch('/api/advisors');
            const result = await response.json();
            
            if (result.success) {
              displayAdvisors(result.advisors);
              log(\`👥 Loaded \${result.advisors.length} advisors\`);
            } else {
              log(\`❌ Failed to load advisors: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        function displayAdvisors(advisors) {
          const listDiv = document.getElementById('advisorsList');
          
          const advisorsHtml = advisors.map(advisor => \`
            <div class="advisor-item">
              <h4>\${advisor.name}</h4>
              <p>\${advisor.description}</p>
              <p><strong>Expertise:</strong> \${advisor.expertise.join(', ')}</p>
              <p><strong>Personality:</strong> \${advisor.personality}</p>
            </div>
          \`).join('');
          
          listDiv.innerHTML = advisorsHtml;
        }
        
        async function queryAdvisor() {
          const domain = document.getElementById('advisorDomain').value;
          const question = document.getElementById('advisorQuestion').value;
          
          if (!question.trim()) {
            log('Question is required', 'error');
            return;
          }
          
          try {
            log(\`Querying \${domain} advisor...\`);
            
            const response = await fetch(\`/api/advisors/\${domain}/query\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                question,
                campaignId: currentCampaignId
              })
            });
            
            const result = await response.json();
            
            if (result.success) {
              log(\`✅ Response from \${result.advisor.name}\`, 'success');
              
              const responseDiv = document.getElementById('advisorResponse');
              responseDiv.innerHTML = \`
                <div class="advisor-response">
                  <h4>Response from \${result.advisor.name}</h4>
                  <p>\${result.response}</p>
                  <p><strong>Confidence:</strong> \${(result.confidence * 100).toFixed(0)}%</p>
                  \${result.sources ? \`<p><strong>Sources:</strong> \${result.sources.join(', ')}</p>\` : ''}
                  \${result.followUpQuestions && result.followUpQuestions.length > 0 ? 
                    \`<p><strong>Follow-up questions:</strong></p>
                     <ul>\${result.followUpQuestions.map(q => \`<li>\${q}</li>\`).join('')}</ul>\` : ''}
                </div>
              \`;
            } else {
              log(\`❌ Advisor query failed: \${result.message}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        async function requestProposal() {
          const domain = document.getElementById('advisorDomain').value;
          
          try {
            log(\`Requesting policy proposal from \${domain} advisor...\`);
            
            const response = await fetch(\`/api/advisors/\${domain}/propose\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                campaignId: currentCampaignId,
                situation: 'Current campaign conditions',
                goals: ['Improve performance', 'Address challenges']
              })
            });
            
            const result = await response.json();
            
            if (result.success) {
              log(\`✅ Policy proposal from \${result.advisor.name}\`, 'success');
              
              const responseDiv = document.getElementById('advisorResponse');
              responseDiv.innerHTML = \`
                <div class="proposal-box">
                  <h4>Policy Proposal: \${result.proposal.title}</h4>
                  <p><strong>Urgency:</strong> \${result.proposal.urgency.toUpperCase()}</p>
                  <p><strong>Rationale:</strong> \${result.proposal.rationale}</p>
                  <p><strong>Policy Text:</strong> \${result.proposal.policyText}</p>
                  <p><strong>Expected Outcome:</strong> \${result.proposal.expectedOutcome}</p>
                  <p><strong>Risks:</strong></p>
                  <ul>\${result.proposal.risks.map(risk => \`<li>\${risk}</li>\`).join('')}</ul>
                  <div style="margin-top: 15px;">
                    <button onclick="createPolicyFromProposal('\${result.proposal.policyText}')" class="success">
                      Create Policy from Proposal
                    </button>
                  </div>
                </div>
              \`;
            } else {
              log(\`❌ Policy proposal failed: \${result.message}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        function createPolicyFromProposal(policyText) {
          document.getElementById('policyText').value = policyText;
          log('Policy text loaded from advisor proposal', 'success');
        }
        
        async function executeStepWithPolicies() {
          try {
            log('Executing simulation step with policy modifiers...');
            
            const response = await fetch(\`/api/campaigns/\${currentCampaignId}/step\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                seed: \`sprint3-step-\${Date.now()}\`
              })
            });
            
            const result = await response.json();
            
            if (result.success) {
              campaignState = result.state;
              document.getElementById('campaignInfo').textContent = 
                \`Campaign \${currentCampaignId} - Step: \${result.step}, Credits: \${campaignState.resources.credits}\`;
              
              const resultDiv = document.getElementById('simulationResult');
              resultDiv.innerHTML = \`
                <div style="background: #d4edda; padding: 10px; border-radius: 4px; border-left: 3px solid #28a745;">
                  <h4>Step \${result.step} Completed</h4>
                  <p><strong>Resources:</strong> Credits: \${result.state.resources.credits}, 
                     Materials: \${result.state.resources.materials}, 
                     Energy: \${result.state.resources.energy}, 
                     Food: \${result.state.resources.food}</p>
                  <p><strong>Active Policies:</strong> Applied policy modifiers to simulation</p>
                </div>
              \`;
              
              log(\`✅ Step \${result.step} completed with policy effects\`, 'success');
            } else {
              log(\`❌ Simulation step failed: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        // Initialize
        log('🚀 Sprint 3 Policies & Advisors Demo initialized');
        loadCampaignContext();
      </script>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4016;

if (process.env.DEMO_START === '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Sprint 3 Demo Server running on http://localhost:${PORT}`);
    console.log(`📋 Policies & Advisors Demo: http://localhost:${PORT}/demo/policies`);
  });
}

export default app;
