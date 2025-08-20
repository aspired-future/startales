import { Router } from 'express';

const defenseDemo = Router();

// Defense Secretary Demo Page
defenseDemo.get('/demo/defense', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Defense Secretary Command Center</title>
    <style>
      body { 
        font-family: 'Segoe UI', system-ui, sans-serif; 
        margin: 0; 
        padding: 20px; 
        background: linear-gradient(135deg, #0f172a, #1e293b, #334155); 
        color: #e2e8f0; 
        min-height: 100vh;
      }
      .container { 
        max-width: 1600px; 
        margin: 0 auto; 
      }
      h1 { 
        color: #ef4444; 
        text-align: center; 
        margin-bottom: 30px; 
        font-size: 2.8em;
        text-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
        font-weight: 700;
      }
      .command-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); 
        gap: 25px; 
        margin-bottom: 30px; 
      }
      .panel { 
        background: rgba(15, 23, 42, 0.9); 
        padding: 25px; 
        border-radius: 15px; 
        border: 2px solid #374151; 
        backdrop-filter: blur(15px);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        transition: all 0.3s ease;
      }
      .panel:hover {
        border-color: #ef4444;
        box-shadow: 0 15px 50px rgba(239, 68, 68, 0.2);
      }
      .panel h3 { 
        color: #fbbf24; 
        margin-top: 0; 
        display: flex; 
        align-items: center; 
        gap: 12px;
        font-size: 1.3em;
        font-weight: 600;
      }
      .metric { 
        display: flex; 
        justify-content: space-between; 
        margin: 12px 0; 
        padding: 10px 0; 
        border-bottom: 1px solid #374151;
      }
      .metric-value { 
        color: #ef4444; 
        font-weight: bold; 
        font-size: 1.1em;
      }
      .readiness-bar { 
        background: #374151; 
        height: 12px; 
        border-radius: 6px; 
        margin: 8px 0; 
        overflow: hidden;
        position: relative;
      }
      .readiness-fill { 
        height: 100%; 
        background: linear-gradient(90deg, #ef4444, #dc2626); 
        transition: width 0.5s ease; 
        border-radius: 6px;
      }
      .readiness-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 0.8em;
        font-weight: bold;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
      }
      button { 
        background: linear-gradient(135deg, #ef4444, #dc2626); 
        color: white; 
        border: none; 
        padding: 14px 24px; 
        border-radius: 10px; 
        cursor: pointer; 
        font-weight: 600;
        margin: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      button:hover { 
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
        background: linear-gradient(135deg, #dc2626, #b91c1c);
      }
      button.secondary {
        background: linear-gradient(135deg, #6b7280, #4b5563);
        box-shadow: 0 6px 20px rgba(107, 114, 128, 0.3);
      }
      button.secondary:hover {
        background: linear-gradient(135deg, #4b5563, #374151);
        box-shadow: 0 8px 25px rgba(107, 114, 128, 0.4);
      }
      .controls { 
        background: rgba(15, 23, 42, 0.9); 
        padding: 25px; 
        border-radius: 15px; 
        margin-bottom: 25px; 
        border: 2px solid #374151;
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        align-items: center;
      }
      input, select { 
        background: #374151; 
        color: #e2e8f0; 
        border: 2px solid #4b5563; 
        padding: 12px 16px; 
        border-radius: 8px; 
        margin: 8px;
        font-size: 1em;
        transition: border-color 0.3s ease;
      }
      input:focus, select:focus {
        outline: none;
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
      .unit-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
        gap: 20px; 
      }
      .unit-card { 
        background: rgba(30, 41, 59, 0.8); 
        padding: 20px; 
        border-radius: 12px; 
        border-left: 5px solid #ef4444;
        transition: all 0.3s ease;
      }
      .unit-card:hover {
        background: rgba(30, 41, 59, 1);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      }
      .unit-name { 
        font-weight: bold; 
        color: #ef4444; 
        margin-bottom: 12px;
        font-size: 1.2em;
      }
      .alert { 
        background: rgba(239, 68, 68, 0.15); 
        border: 2px solid #ef4444; 
        color: #fca5a5; 
        padding: 15px; 
        border-radius: 10px; 
        margin: 15px 0;
        animation: pulse 2s infinite;
      }
      .success { 
        background: rgba(34, 197, 94, 0.15); 
        border: 2px solid #22c55e; 
        color: #86efac; 
        padding: 15px; 
        border-radius: 10px; 
        margin: 15px 0;
      }
      .warning {
        background: rgba(251, 191, 36, 0.15);
        border: 2px solid #fbbf24;
        color: #fde68a;
        padding: 15px;
        border-radius: 10px;
        margin: 15px 0;
      }
      pre { 
        background: #0f172a; 
        padding: 20px; 
        border-radius: 10px; 
        overflow-x: auto; 
        border: 2px solid #374151;
        font-size: 0.9em;
        line-height: 1.4;
      }
      .status-indicator {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .status-operational { background: #22c55e; box-shadow: 0 0 10px rgba(34, 197, 94, 0.5); }
      .status-limited { background: #fbbf24; box-shadow: 0 0 10px rgba(251, 191, 36, 0.5); }
      .status-critical { background: #ef4444; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }
      .tab-container {
        background: rgba(15, 23, 42, 0.9);
        border-radius: 15px;
        overflow: hidden;
        border: 2px solid #374151;
        margin-bottom: 25px;
      }
      .tab-nav {
        display: flex;
        background: rgba(30, 41, 59, 0.9);
        border-bottom: 2px solid #374151;
        overflow-x: auto;
      }
      .tab-button {
        background: none;
        border: none;
        padding: 18px 28px;
        color: #94a3b8;
        cursor: pointer;
        transition: all 0.3s ease;
        border-bottom: 4px solid transparent;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        white-space: nowrap;
      }
      .tab-button.active {
        color: #ef4444;
        border-bottom-color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
      }
      .tab-button:hover:not(.active) {
        color: #e2e8f0;
        background: rgba(148, 163, 184, 0.1);
      }
      .tab-content {
        display: none;
        padding: 25px;
      }
      .tab-content.active {
        display: block;
      }
      .operation-card {
        background: rgba(30, 41, 59, 0.6);
        padding: 18px;
        border-radius: 10px;
        margin: 12px 0;
        border-left: 4px solid #fbbf24;
      }
      .operation-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      .operation-title {
        font-weight: bold;
        color: #fbbf24;
        font-size: 1.1em;
      }
      .operation-status {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8em;
        font-weight: bold;
        text-transform: uppercase;
      }
      .status-active { background: #22c55e; color: #000; }
      .status-planned { background: #6b7280; color: #fff; }
      .status-authorized { background: #3b82f6; color: #fff; }
      .status-completed { background: #8b5cf6; color: #fff; }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      .threat-level {
        display: inline-block;
        padding: 6px 16px;
        border-radius: 25px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.9em;
      }
      .threat-low { background: #22c55e; color: #000; }
      .threat-medium { background: #fbbf24; color: #000; }
      .threat-high { background: #f97316; color: #fff; }
      .threat-critical { background: #ef4444; color: #fff; animation: pulse 1.5s infinite; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🛡️ Defense Secretary Command Center</h1>
      
      <div class="controls">
        <label>Campaign ID: <input type="number" id="campaignId" value="1" min="1"></label>
        <label>Secretary ID: <input type="text" id="secretaryId" value="ai-secretary-defense"></label>
        <button onclick="loadDashboard()">🔄 Load Command Dashboard</button>
        <button onclick="generateReadinessReport()">📊 Generate Readiness Report</button>
        <button onclick="initializeDefenseSystem()" class="secondary">⚙️ Initialize Defense System</button>
      </div>

      <div class="tab-container">
        <div class="tab-nav">
          <button class="tab-button active" onclick="showTab('overview')">🏛️ Command Overview</button>
          <button class="tab-button" onclick="showTab('operations')">⚔️ Military Operations</button>
          <button class="tab-button" onclick="showTab('units')">🪖 Force Status</button>
          <button class="tab-button" onclick="showTab('intelligence')">🕵️ Intelligence</button>
          <button class="tab-button" onclick="showTab('procurement')">🛒 Procurement</button>
          <button class="tab-button" onclick="showTab('orders')">📋 Orders & Commands</button>
        </div>

        <!-- Command Overview Tab -->
        <div id="overview-tab" class="tab-content active">
          <div class="command-grid">
            <div class="panel">
              <h3>⚔️ Command Authority</h3>
              <div class="metric">
                <span>Total Military Units:</span>
                <span class="metric-value" id="totalUnits">0</span>
              </div>
              <div class="metric">
                <span>Combat Ready Units:</span>
                <span class="metric-value" id="readyUnits">0</span>
              </div>
              <div class="metric">
                <span>Deployed Units:</span>
                <span class="metric-value" id="deployedUnits">0</span>
              </div>
              <div class="metric">
                <span>Reserve Forces:</span>
                <span class="metric-value" id="reserveUnits">0</span>
              </div>
            </div>

            <div class="panel">
              <h3>💰 Defense Budget Authority</h3>
              <div class="metric">
                <span>Total Defense Budget:</span>
                <span class="metric-value" id="totalDefenseBudget">$0</span>
              </div>
              <div class="metric">
                <span>Available Funds:</span>
                <span class="metric-value" id="availableFunds">$0</span>
              </div>
              <div class="metric">
                <span>Personnel Costs:</span>
                <span class="metric-value" id="personnelCosts">$0</span>
              </div>
              <div class="metric">
                <span>Procurement Budget:</span>
                <span class="metric-value" id="procurementBudget">$0</span>
              </div>
            </div>

            <div class="panel">
              <h3>🎯 Strategic Status</h3>
              <div class="metric">
                <span>Overall Readiness:</span>
                <span class="metric-value" id="overallReadiness">0%</span>
              </div>
              <div class="readiness-bar">
                <div class="readiness-fill" id="readinessBar" style="width: 0%"></div>
                <div class="readiness-text" id="readinessText">0%</div>
              </div>
              <div class="metric">
                <span>Current Threat Level:</span>
                <span class="threat-level" id="threatLevel">MEDIUM</span>
              </div>
              <div class="metric">
                <span>Military Posture:</span>
                <span class="metric-value" id="militaryPosture">DEFENSIVE</span>
              </div>
              <div class="metric">
                <span>Active Operations:</span>
                <span class="metric-value" id="activeOperations">0</span>
              </div>
            </div>

            <div class="panel">
              <h3>⚠️ Command Alerts</h3>
              <div id="commandAlerts">
                <div class="success">Defense systems ready for operations</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Military Operations Tab -->
        <div id="operations-tab" class="tab-content">
          <div class="panel">
            <h3>⚔️ Authorize New Operation</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <label>Operation Name:
                  <input type="text" id="operationName" placeholder="Operation Steel Shield" style="width: 100%;">
                </label>
                <label>Operation Type:
                  <select id="operationType" style="width: 100%;">
                    <option value="defensive">Defensive</option>
                    <option value="offensive">Offensive</option>
                    <option value="peacekeeping">Peacekeeping</option>
                    <option value="humanitarian">Humanitarian</option>
                    <option value="training">Training</option>
                    <option value="intelligence">Intelligence</option>
                  </select>
                </label>
                <label>Priority:
                  <select id="operationPriority" style="width: 100%;">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </label>
                <label>Budget Allocation:
                  <input type="number" id="operationBudget" placeholder="50000" min="1000" style="width: 100%;">
                </label>
              </div>
              <div>
                <label>Objective:
                  <input type="text" id="operationObjective" placeholder="Secure border region" style="width: 100%;">
                </label>
                <label>Duration (hours):
                  <input type="number" id="operationDuration" placeholder="48" min="1" style="width: 100%;">
                </label>
                <label>Risk Level:
                  <select id="operationRisk" style="width: 100%;">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                    <option value="extreme">Extreme</option>
                  </select>
                </label>
                <label>Description:
                  <textarea id="operationDescription" rows="3" style="width: 100%; background: #374151; color: #e2e8f0; border: 2px solid #4b5563; padding: 12px; border-radius: 8px;" placeholder="Detailed operation description..."></textarea>
                </label>
              </div>
            </div>
            <button onclick="authorizeOperation()" style="width: 100%; margin-top: 15px;">🚀 AUTHORIZE OPERATION</button>
          </div>
          
          <div class="panel">
            <h3>📋 Active Military Operations</h3>
            <div id="operationsList">
              <p>Load dashboard to view active operations</p>
            </div>
          </div>
        </div>

        <!-- Force Status Tab -->
        <div id="units-tab" class="tab-content">
          <div class="panel">
            <h3>🪖 Military Units Under Command</h3>
            <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
              <label>Filter by Domain:
                <select id="unitDomain">
                  <option value="">All Domains</option>
                  <option value="land">Land Forces</option>
                  <option value="sea">Naval Forces</option>
                  <option value="air">Air Forces</option>
                  <option value="space">Space Forces</option>
                  <option value="cyber">Cyber Forces</option>
                </select>
              </label>
              <label>Filter by Status:
                <select id="unitStatus">
                  <option value="">All Status</option>
                  <option value="fully-operational">Fully Operational</option>
                  <option value="operational">Operational</option>
                  <option value="limited">Limited</option>
                  <option value="non-operational">Non-Operational</option>
                </select>
              </label>
              <button onclick="loadMilitaryUnits()" class="secondary">🔄 Refresh Units</button>
            </div>
            <div class="unit-grid" id="unitsGrid">
              <p>Click "Refresh Units" to load military units</p>
            </div>
          </div>
        </div>

        <!-- Intelligence Tab -->
        <div id="intelligence-tab" class="tab-content">
          <div class="panel">
            <h3>🕵️ Intelligence Reports</h3>
            <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
              <label>Report Type:
                <select id="intelReportType">
                  <option value="">All Reports</option>
                  <option value="threat-assessment">Threat Assessment</option>
                  <option value="enemy-analysis">Enemy Analysis</option>
                  <option value="capability-assessment">Capability Assessment</option>
                  <option value="strategic-intelligence">Strategic Intelligence</option>
                </select>
              </label>
              <label>Threat Level:
                <select id="intelThreatLevel">
                  <option value="">All Levels</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </label>
              <button onclick="loadIntelligenceReports()" class="secondary">🔄 Load Intelligence</button>
            </div>
            <div id="intelligenceReports">
              <p>Load intelligence reports to view threat assessments</p>
            </div>
          </div>
        </div>

        <!-- Procurement Tab -->
        <div id="procurement-tab" class="tab-content">
          <div class="panel">
            <h3>🛒 Military Procurement Request</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <label>Equipment Type:
                  <input type="text" id="equipmentType" placeholder="M1A2 Abrams Tank" style="width: 100%;">
                </label>
                <label>Quantity:
                  <input type="number" id="equipmentQuantity" placeholder="12" min="1" style="width: 100%;">
                </label>
                <label>Unit Price:
                  <input type="number" id="equipmentPrice" placeholder="8500000" min="1" style="width: 100%;">
                </label>
                <label>Vendor:
                  <input type="text" id="equipmentVendor" placeholder="General Dynamics" style="width: 100%;">
                </label>
              </div>
              <div>
                <label>Urgency:
                  <select id="procurementUrgency" style="width: 100%;">
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </label>
                <label>Delivery Date:
                  <input type="date" id="deliveryDate" style="width: 100%;">
                </label>
                <label>Justification:
                  <textarea id="procurementJustification" rows="4" style="width: 100%; background: #374151; color: #e2e8f0; border: 2px solid #4b5563; padding: 12px; border-radius: 8px;" placeholder="Strategic justification for procurement..."></textarea>
                </label>
              </div>
            </div>
            <button onclick="requestProcurement()" style="width: 100%; margin-top: 15px;">💳 SUBMIT PROCUREMENT REQUEST</button>
          </div>
          
          <div class="panel">
            <h3>📦 Procurement Status</h3>
            <div id="procurementStatus">
              <p>Submit a procurement request to view status</p>
            </div>
          </div>
        </div>

        <!-- Orders & Commands Tab -->
        <div id="orders-tab" class="tab-content">
          <div class="panel">
            <h3>📋 Issue Defense Order</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <label>Order Type:
                  <select id="orderType" style="width: 100%;">
                    <option value="deployment">Force Deployment</option>
                    <option value="mission">Mission Assignment</option>
                    <option value="readiness-change">Readiness Change</option>
                    <option value="training">Training Directive</option>
                    <option value="strategic-directive">Strategic Directive</option>
                  </select>
                </label>
                <label>Priority:
                  <select id="orderPriority" style="width: 100%;">
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="immediate">Immediate</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </label>
                <label>Classification:
                  <select id="orderClassification" style="width: 100%;">
                    <option value="unclassified">Unclassified</option>
                    <option value="confidential">Confidential</option>
                    <option value="secret">Secret</option>
                    <option value="top-secret">Top Secret</option>
                  </select>
                </label>
              </div>
              <div>
                <label>Order Title:
                  <input type="text" id="orderTitle" placeholder="Increase Border Patrol Frequency" style="width: 100%;">
                </label>
                <label>Instructions:
                  <textarea id="orderInstructions" rows="5" style="width: 100%; background: #374151; color: #e2e8f0; border: 2px solid #4b5563; padding: 12px; border-radius: 8px;" placeholder="Detailed instructions for military units..."></textarea>
                </label>
              </div>
            </div>
            <button onclick="issueDefenseOrder()" style="width: 100%; margin-top: 15px;">📤 ISSUE ORDER</button>
          </div>
          
          <div class="panel">
            <h3>📜 Recent Defense Orders</h3>
            <div id="recentOrders">
              <p>Issue an order to view recent commands</p>
            </div>
          </div>
        </div>
      </div>

      <div class="panel" style="margin-top: 25px;">
        <h3>🔧 API Response Monitor</h3>
        <pre id="apiResponse">Defense Secretary Command Center ready. Use the controls above to interact with military systems.</pre>
      </div>
    </div>

    <script>
      let currentCampaignId = 1;
      let currentSecretaryId = 'ai-secretary-defense';

      function showTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
          button.classList.remove('active');
        });
        
        // Show selected tab content
        document.getElementById(tabName + '-tab').classList.add('active');
        
        // Add active class to clicked button
        event.target.classList.add('active');
      }

      function updateApiResponse(data) {
        document.getElementById('apiResponse').textContent = JSON.stringify(data, null, 2);
      }

      function showAlert(message, type = 'success') {
        const alertsContainer = document.getElementById('commandAlerts');
        const alertClass = type === 'error' ? 'alert' : type === 'warning' ? 'warning' : 'success';
        alertsContainer.innerHTML = \`<div class="\${alertClass}">\${message}</div>\`;
      }

      function formatThreatLevel(level) {
        const levelClass = \`threat-\${level}\`;
        return \`<span class="threat-level \${levelClass}">\${level.toUpperCase()}</span>\`;
      }

      async function initializeDefenseSystem() {
        currentCampaignId = parseInt(document.getElementById('campaignId').value);
        
        try {
          // Initialize Defense Secretary data
          const response = await fetch('/api/defense/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              campaignId: currentCampaignId,
              secretaryId: currentSecretaryId
            })
          });
          
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            showAlert('Defense Secretary system initialized successfully');
            loadDashboard();
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function loadDashboard() {
        currentCampaignId = parseInt(document.getElementById('campaignId').value);
        currentSecretaryId = document.getElementById('secretaryId').value;
        
        try {
          const response = await fetch(\`/api/defense/dashboard?campaignId=\${currentCampaignId}\`);
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            const dashboard = data.dashboard;
            
            // Update command authority
            document.getElementById('totalUnits').textContent = dashboard.authority.commandAuthority.totalUnits;
            document.getElementById('readyUnits').textContent = dashboard.authority.commandAuthority.readyUnits;
            document.getElementById('deployedUnits').textContent = dashboard.authority.commandAuthority.deployedUnits;
            document.getElementById('reserveUnits').textContent = dashboard.authority.commandAuthority.reserveUnits;
            
            // Update budget authority
            document.getElementById('totalDefenseBudget').textContent = \`$\${dashboard.authority.budgetAuthority.totalDefenseBudget.toLocaleString()}\`;
            document.getElementById('availableFunds').textContent = \`$\${dashboard.authority.budgetAuthority.availableFunds.toLocaleString()}\`;
            document.getElementById('personnelCosts').textContent = \`$\${dashboard.authority.budgetAuthority.personnelCosts.toLocaleString()}\`;
            document.getElementById('procurementBudget').textContent = \`$\${dashboard.authority.budgetAuthority.procurementBudget.toLocaleString()}\`;
            
            // Update strategic status
            const readiness = dashboard.readiness.overall;
            document.getElementById('overallReadiness').textContent = \`\${Math.round(readiness)}%\`;
            document.getElementById('readinessBar').style.width = \`\${readiness}%\`;
            document.getElementById('readinessText').textContent = \`\${Math.round(readiness)}%\`;
            
            document.getElementById('threatLevel').innerHTML = formatThreatLevel(dashboard.intelligence.currentThreatLevel);
            document.getElementById('militaryPosture').textContent = dashboard.authority.strategicStatus.militaryPosture.toUpperCase();
            document.getElementById('activeOperations').textContent = dashboard.operations.totalActive;
            
            // Update alerts
            const alertsHtml = dashboard.alerts.length > 0 ? 
              dashboard.alerts.map(alert => \`<div class="alert">\${alert}</div>\`).join('') : 
              '<div class="success">All defense systems operational</div>';
            document.getElementById('commandAlerts').innerHTML = alertsHtml;
            
            // Update operations list
            const operationsHtml = dashboard.operations.active.map(op => \`
              <div class="operation-card">
                <div class="operation-header">
                  <div class="operation-title">\${op.name}</div>
                  <div class="operation-status status-\${op.status}">\${op.status}</div>
                </div>
                <div style="font-size: 0.9em; color: #94a3b8;">
                  <div>Type: \${op.type} | Priority: \${op.priority}</div>
                  <div>Budget: $\${(op.budget_allocated || 0).toLocaleString()}</div>
                  <div>Progress: \${op.progress || 0}%</div>
                </div>
              </div>
            \`).join('');
            document.getElementById('operationsList').innerHTML = operationsHtml || '<p>No active operations</p>';
            
            showAlert('Defense Secretary dashboard loaded successfully');
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function generateReadinessReport() {
        try {
          const response = await fetch(\`/api/defense/readiness?campaignId=\${currentCampaignId}\`);
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            const report = data.report;
            showAlert(\`Readiness report generated: \${report.readinessLevel.toUpperCase()} (\${Math.round(report.overallReadiness)}%)\`);
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function authorizeOperation() {
        const name = document.getElementById('operationName').value;
        const type = document.getElementById('operationType').value;
        const priority = document.getElementById('operationPriority').value;
        const budget = parseInt(document.getElementById('operationBudget').value);
        const objective = document.getElementById('operationObjective').value;
        const duration = parseInt(document.getElementById('operationDuration').value);
        const risk = document.getElementById('operationRisk').value;
        const description = document.getElementById('operationDescription').value;
        
        if (!name || !objective || !description) {
          showAlert('Please fill in all required fields', 'error');
          return;
        }
        
        try {
          const response = await fetch('/api/defense/operations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              type,
              priority,
              budgetAllocated: budget || 0,
              objective,
              estimatedDuration: duration || 24,
              riskLevel: risk,
              description,
              requestedBy: 'ai-commander-operations',
              authorizedBy: currentSecretaryId
            })
          });
          
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            showAlert(\`Operation "\${name}" authorized successfully\`);
            
            // Clear form
            document.getElementById('operationName').value = '';
            document.getElementById('operationObjective').value = '';
            document.getElementById('operationDescription').value = '';
            document.getElementById('operationBudget').value = '';
            document.getElementById('operationDuration').value = '';
            
            // Refresh operations list
            loadDashboard();
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function loadMilitaryUnits() {
        const domain = document.getElementById('unitDomain').value;
        const status = document.getElementById('unitStatus').value;
        
        try {
          let url = \`/api/defense/units?campaignId=\${currentCampaignId}\`;
          if (domain) url += \`&domain=\${domain}\`;
          if (status) url += \`&status=\${status}\`;
          
          const response = await fetch(url);
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            const unitsHtml = data.units.map(unit => {
              const status = unit.status || {};
              const combat = status.combat || {};
              const readiness = combat.percentage || 50;
              const statusClass = readiness >= 80 ? 'status-operational' : readiness >= 60 ? 'status-limited' : 'status-critical';
              
              return \`
                <div class="unit-card">
                  <div class="unit-name">
                    <span class="status-indicator \${statusClass}"></span>
                    \${unit.name}
                  </div>
                  <div style="font-size: 0.9em; color: #94a3b8;">
                    <div>Type: \${unit.type} | Domain: \${unit.domain}</div>
                    <div>Size: \${unit.size}/\${unit.max_size}</div>
                    <div>Readiness: \${Math.round(readiness)}%</div>
                    <div>Status: \${status.operational || 'Unknown'}</div>
                  </div>
                  <button onclick="issueUnitOrder('\${unit.id}')" class="secondary" style="margin-top: 10px;">📤 Issue Order</button>
                </div>
              \`;
            }).join('');
            
            document.getElementById('unitsGrid').innerHTML = unitsHtml || '<p>No military units found</p>';
            showAlert(\`Loaded \${data.units.length} military units\`);
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function loadIntelligenceReports() {
        const reportType = document.getElementById('intelReportType').value;
        const threatLevel = document.getElementById('intelThreatLevel').value;
        
        try {
          let url = \`/api/defense/intelligence?campaignId=\${currentCampaignId}\`;
          if (reportType) url += \`&reportType=\${reportType}\`;
          if (threatLevel) url += \`&threatLevel=\${threatLevel}\`;
          
          const response = await fetch(url);
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            const reportsHtml = data.reports.map(report => \`
              <div class="operation-card">
                <div class="operation-header">
                  <div class="operation-title">\${report.report_type.replace('-', ' ').toUpperCase()}</div>
                  <div>\${formatThreatLevel(report.threat_level || 'medium')}</div>
                </div>
                <div style="font-size: 0.9em; color: #94a3b8; margin-top: 10px;">
                  <div><strong>Summary:</strong> \${report.summary}</div>
                  <div><strong>Confidence:</strong> \${Math.round((report.confidence || 0.5) * 100)}%</div>
                  <div><strong>Date:</strong> \${new Date(report.intelligence_date).toLocaleString()}</div>
                  <div><strong>Classification:</strong> \${report.classification.toUpperCase()}</div>
                </div>
              </div>
            \`).join('');
            
            document.getElementById('intelligenceReports').innerHTML = reportsHtml || '<p>No intelligence reports found</p>';
            showAlert(\`Loaded \${data.reports.length} intelligence reports\`);
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function requestProcurement() {
        const equipmentType = document.getElementById('equipmentType').value;
        const quantity = parseInt(document.getElementById('equipmentQuantity').value);
        const unitPrice = parseInt(document.getElementById('equipmentPrice').value);
        const vendor = document.getElementById('equipmentVendor').value;
        const urgency = document.getElementById('procurementUrgency').value;
        const deliveryDate = document.getElementById('deliveryDate').value;
        const justification = document.getElementById('procurementJustification').value;
        
        if (!equipmentType || !quantity || !unitPrice || !vendor || !justification) {
          showAlert('Please fill in all required fields', 'error');
          return;
        }
        
        try {
          const response = await fetch('/api/defense/procurement', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              equipmentType,
              quantity,
              unitPrice,
              vendor,
              urgency,
              deliveryDate: deliveryDate ? new Date(deliveryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              justification
            })
          });
          
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            const totalCost = quantity * unitPrice;
            showAlert(\`Procurement request approved: $\${totalCost.toLocaleString()} reserved\`);
            
            // Update procurement status
            const statusHtml = \`
              <div class="operation-card">
                <div class="operation-header">
                  <div class="operation-title">\${equipmentType}</div>
                  <div class="operation-status status-authorized">APPROVED</div>
                </div>
                <div style="font-size: 0.9em; color: #94a3b8;">
                  <div>Quantity: \${quantity} units</div>
                  <div>Total Cost: $\${totalCost.toLocaleString()}</div>
                  <div>Vendor: \${vendor}</div>
                  <div>Urgency: \${urgency.toUpperCase()}</div>
                </div>
              </div>
            \`;
            document.getElementById('procurementStatus').innerHTML = statusHtml;
            
            // Clear form
            document.getElementById('equipmentType').value = '';
            document.getElementById('equipmentQuantity').value = '';
            document.getElementById('equipmentPrice').value = '';
            document.getElementById('equipmentVendor').value = '';
            document.getElementById('procurementJustification').value = '';
            document.getElementById('deliveryDate').value = '';
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function issueDefenseOrder() {
        const orderType = document.getElementById('orderType').value;
        const priority = document.getElementById('orderPriority').value;
        const classification = document.getElementById('orderClassification').value;
        const title = document.getElementById('orderTitle').value;
        const instructions = document.getElementById('orderInstructions').value;
        
        if (!title || !instructions) {
          showAlert('Please fill in order title and instructions', 'error');
          return;
        }
        
        try {
          const response = await fetch('/api/defense/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secretaryId: currentSecretaryId,
              orderType,
              title,
              description: instructions,
              priority,
              classification,
              instructions,
              effectiveAt: new Date()
            })
          });
          
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            showAlert(\`Defense order "\${title}" issued successfully\`);
            
            // Update recent orders
            const orderHtml = \`
              <div class="operation-card">
                <div class="operation-header">
                  <div class="operation-title">\${title}</div>
                  <div class="operation-status status-active">ISSUED</div>
                </div>
                <div style="font-size: 0.9em; color: #94a3b8;">
                  <div>Type: \${orderType.replace('-', ' ').toUpperCase()}</div>
                  <div>Priority: \${priority.toUpperCase()}</div>
                  <div>Classification: \${classification.toUpperCase()}</div>
                  <div>Issued: \${new Date().toLocaleString()}</div>
                </div>
              </div>
            \`;
            document.getElementById('recentOrders').innerHTML = orderHtml + document.getElementById('recentOrders').innerHTML;
            
            // Clear form
            document.getElementById('orderTitle').value = '';
            document.getElementById('orderInstructions').value = '';
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function issueUnitOrder(unitId) {
        const instructions = prompt('Enter instructions for unit ' + unitId + ':');
        if (!instructions) return;
        
        try {
          const response = await fetch(\`/api/defense/units/\${unitId}/orders\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderType: 'mission',
              instructions,
              priority: 'medium'
            })
          });
          
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            showAlert(\`Order issued to unit \${unitId} successfully\`);
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      // Initialize with current values
      document.getElementById('campaignId').addEventListener('change', (e) => {
        currentCampaignId = parseInt(e.target.value);
      });
      
      document.getElementById('secretaryId').addEventListener('change', (e) => {
        currentSecretaryId = e.target.value;
      });
      
      // Set default delivery date to 30 days from now
      const defaultDeliveryDate = new Date();
      defaultDeliveryDate.setDate(defaultDeliveryDate.getDate() + 30);
      document.getElementById('deliveryDate').value = defaultDeliveryDate.toISOString().split('T')[0];
      
      // Load initial data
      setTimeout(() => {
        showAlert('Defense Secretary Command Center ready. Load dashboard to begin operations.', 'warning');
      }, 500);
    </script>
  </body>
  </html>`);
});

export default defenseDemo;
