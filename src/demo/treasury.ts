import { Router } from 'express';

const treasuryDemo = Router();

// Treasury Secretary Demo Page
treasuryDemo.get('/demo/treasury', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Treasury Secretary Demo</title>
    <style>
      body { 
        font-family: system-ui, sans-serif; 
        margin: 0; 
        padding: 20px; 
        background: linear-gradient(135deg, #1a1a2e, #16213e); 
        color: #e0e0e0; 
        min-height: 100vh;
      }
      .container { 
        max-width: 1400px; 
        margin: 0 auto; 
      }
      h1 { 
        color: #4ade80; 
        text-align: center; 
        margin-bottom: 30px; 
        font-size: 2.5em;
        text-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
      }
      .dashboard-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
        gap: 20px; 
        margin-bottom: 30px; 
      }
      .panel { 
        background: rgba(26, 26, 46, 0.8); 
        padding: 20px; 
        border-radius: 12px; 
        border: 1px solid #333; 
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }
      .panel h3 { 
        color: #fbbf24; 
        margin-top: 0; 
        display: flex; 
        align-items: center; 
        gap: 10px;
      }
      .metric { 
        display: flex; 
        justify-content: space-between; 
        margin: 10px 0; 
        padding: 8px 0; 
        border-bottom: 1px solid #333;
      }
      .metric-value { 
        color: #4ade80; 
        font-weight: bold; 
      }
      .budget-bar { 
        background: #333; 
        height: 8px; 
        border-radius: 4px; 
        margin: 5px 0; 
        overflow: hidden;
      }
      .budget-fill { 
        height: 100%; 
        background: linear-gradient(90deg, #4ade80, #22c55e); 
        transition: width 0.3s ease; 
      }
      button { 
        background: linear-gradient(135deg, #4ade80, #22c55e); 
        color: #000; 
        border: none; 
        padding: 12px 20px; 
        border-radius: 8px; 
        cursor: pointer; 
        font-weight: bold;
        margin: 5px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3);
      }
      button:hover { 
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
      }
      .controls { 
        background: rgba(26, 26, 46, 0.8); 
        padding: 20px; 
        border-radius: 12px; 
        margin-bottom: 20px; 
        border: 1px solid #333;
      }
      input, select { 
        background: #333; 
        color: #e0e0e0; 
        border: 1px solid #555; 
        padding: 8px 12px; 
        border-radius: 6px; 
        margin: 5px;
      }
      .department-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
        gap: 15px; 
      }
      .department-card { 
        background: rgba(42, 42, 42, 0.8); 
        padding: 15px; 
        border-radius: 8px; 
        border-left: 4px solid #4ade80;
      }
      .department-name { 
        font-weight: bold; 
        color: #4ade80; 
        margin-bottom: 10px;
      }
      .alert { 
        background: rgba(239, 68, 68, 0.2); 
        border: 1px solid #ef4444; 
        color: #fca5a5; 
        padding: 10px; 
        border-radius: 6px; 
        margin: 10px 0;
      }
      .success { 
        background: rgba(34, 197, 94, 0.2); 
        border: 1px solid #22c55e; 
        color: #86efac; 
        padding: 10px; 
        border-radius: 6px; 
        margin: 10px 0;
      }
      pre { 
        background: #1a1a1a; 
        padding: 15px; 
        border-radius: 8px; 
        overflow-x: auto; 
        border: 1px solid #333;
        font-size: 0.9em;
      }
      .status-indicator {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;
      }
      .status-healthy { background: #22c55e; }
      .status-warning { background: #fbbf24; }
      .status-critical { background: #ef4444; }
      .tab-container {
        background: rgba(26, 26, 46, 0.8);
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #333;
      }
      .tab-nav {
        display: flex;
        background: rgba(42, 42, 42, 0.8);
        border-bottom: 1px solid #333;
      }
      .tab-button {
        background: none;
        border: none;
        padding: 15px 25px;
        color: #ccc;
        cursor: pointer;
        transition: all 0.3s ease;
        border-bottom: 3px solid transparent;
      }
      .tab-button.active {
        color: #4ade80;
        border-bottom-color: #4ade80;
        background: rgba(74, 222, 128, 0.1);
      }
      .tab-content {
        display: none;
        padding: 20px;
      }
      .tab-content.active {
        display: block;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🏦 Treasury Secretary Dashboard</h1>
      
      <div class="controls">
        <label>Campaign ID: <input type="number" id="campaignId" value="1" min="1"></label>
        <label>Fiscal Year: <input type="number" id="fiscalYear" value="2024" min="2020"></label>
        <button onclick="initializeBudgets()">Initialize Department Budgets</button>
        <button onclick="loadDashboard()">Load Dashboard</button>
        <button onclick="generateRollup()">Generate Budget Rollup</button>
      </div>

      <div class="tab-container">
        <div class="tab-nav">
          <button class="tab-button active" onclick="showTab('dashboard')">📊 Dashboard</button>
          <button class="tab-button" onclick="showTab('departments')">🏛️ Departments</button>
          <button class="tab-button" onclick="showTab('rollup')">📋 Budget Rollup</button>
          <button class="tab-button" onclick="showTab('requests')">📝 Spending Requests</button>
          <button class="tab-button" onclick="showTab('analytics')">📈 Advanced Analytics</button>
          <button class="tab-button" onclick="showTab('forecasting')">🔮 Forecasting</button>
        </div>

        <!-- Dashboard Tab -->
        <div id="dashboard-tab" class="tab-content active">
          <div class="dashboard-grid">
            <div class="panel">
              <h3>💰 Government Finances</h3>
              <div class="metric">
                <span>Total Budget:</span>
                <span class="metric-value" id="totalBudget">$0</span>
              </div>
              <div class="metric">
                <span>Total Spent:</span>
                <span class="metric-value" id="totalSpent">$0</span>
              </div>
              <div class="metric">
                <span>Remaining:</span>
                <span class="metric-value" id="totalRemaining">$0</span>
              </div>
              <div class="budget-bar">
                <div class="budget-fill" id="budgetUtilization" style="width: 0%"></div>
              </div>
            </div>

            <div class="panel">
              <h3>📈 Revenue Streams</h3>
              <div class="metric">
                <span>Tax Collections:</span>
                <span class="metric-value" id="taxRevenue">$0</span>
              </div>
              <div class="metric">
                <span>Collection Efficiency:</span>
                <span class="metric-value" id="collectionEfficiency">0%</span>
              </div>
              <div class="metric">
                <span>Corporate Tax:</span>
                <span class="metric-value" id="corporateTax">$0</span>
              </div>
              <div class="metric">
                <span>Individual Tax:</span>
                <span class="metric-value" id="individualTax">$0</span>
              </div>
              <div class="metric">
                <span>Trade Tariffs:</span>
                <span class="metric-value" id="tradeTariffs">$0</span>
              </div>
              <div class="metric">
                <span>Other Revenue:</span>
                <span class="metric-value" id="otherRevenue">$0</span>
              </div>
            </div>

            <div class="panel">
              <h3>🏛️ Fiscal Health</h3>
              <div class="metric">
                <span>Current Deficit:</span>
                <span class="metric-value" id="currentDeficit">$0</span>
              </div>
              <div class="metric">
                <span>Debt-to-GDP Ratio:</span>
                <span class="metric-value" id="debtRatio">0%</span>
              </div>
              <div class="metric">
                <span>Credit Rating:</span>
                <span class="metric-value" id="creditRating">AAA</span>
              </div>
              <div class="metric">
                <span>Interest Payments:</span>
                <span class="metric-value" id="interestPayments">$0</span>
              </div>
              <div class="metric">
                <span>Debt Service Ratio:</span>
                <span class="metric-value" id="debtServiceRatio">0%</span>
              </div>
              <div class="metric">
                <span>Fiscal Balance:</span>
                <span class="metric-value" id="fiscalBalance">$0</span>
              </div>
            </div>

            <div class="panel">
              <h3>📊 Budget Performance</h3>
              <div class="metric">
                <span>Budget Execution Rate:</span>
                <span class="metric-value" id="budgetExecutionRate">0%</span>
              </div>
              <div class="metric">
                <span>Variance from Plan:</span>
                <span class="metric-value" id="budgetVariance">$0</span>
              </div>
              <div class="metric">
                <span>Emergency Reserves:</span>
                <span class="metric-value" id="emergencyReserves">$0</span>
              </div>
              <div class="metric">
                <span>Contingency Fund:</span>
                <span class="metric-value" id="contingencyFund">$0</span>
              </div>
              <div class="budget-bar">
                <div class="budget-fill" id="performanceIndicator" style="width: 0%"></div>
              </div>
            </div>

            <div class="panel">
              <h3>⚠️ Alerts & Notifications</h3>
              <div id="alertsContainer">
                <div class="success">System ready for budget operations</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Departments Tab -->
        <div id="departments-tab" class="tab-content">
          <div class="department-grid" id="departmentGrid">
            <!-- Department cards will be populated here -->
          </div>
        </div>

        <!-- Budget Rollup Tab -->
        <div id="rollup-tab" class="tab-content">
          <div class="panel">
            <h3>📊 Government-Wide Budget Summary</h3>
            <div id="rollupSummary">
              <p>Click "Generate Budget Rollup" to view comprehensive budget analysis</p>
            </div>
          </div>
          
          <div class="panel">
            <h3>🔝 Top Spending Categories</h3>
            <div id="topCategories">
              <p>Budget rollup data will appear here</p>
            </div>
          </div>
        </div>

        <!-- Spending Requests Tab -->
        <div id="requests-tab" class="tab-content">
          <div class="panel">
            <h3>📝 Submit Spending Request</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <label>Department:
                  <select id="requestDepartment">
                    <option value="Defense">Defense</option>
                    <option value="State">State</option>
                    <option value="Treasury">Treasury</option>
                    <option value="Interior">Interior</option>
                    <option value="Science">Science</option>
                    <option value="Justice">Justice</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Intelligence">Intelligence</option>
                    <option value="Administration">Administration</option>
                  </select>
                </label>
                <label>Category:
                  <select id="requestCategory">
                    <option value="Personnel">Personnel</option>
                    <option value="Operations">Operations</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Research">Research</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </label>
                <label>Amount:
                  <input type="number" id="requestAmount" placeholder="50000" min="1">
                </label>
                <label>Urgency:
                  <select id="requestUrgency">
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </label>
              </div>
              <div>
                <label>Purpose:
                  <input type="text" id="requestPurpose" placeholder="Equipment procurement" style="width: 100%;">
                </label>
                <label>Justification:
                  <textarea id="requestJustification" rows="4" style="width: 100%; background: #333; color: #e0e0e0; border: 1px solid #555; padding: 8px; border-radius: 6px;" placeholder="Detailed justification for the expenditure..."></textarea>
                </label>
                <button onclick="submitSpendingRequest()" style="width: 100%; margin-top: 10px;">Submit Request</button>
              </div>
            </div>
          </div>
          
          <div class="panel">
            <h3>📋 Recent Requests</h3>
            <div id="recentRequests">
              <p>Spending requests will appear here</p>
            </div>
          </div>
        </div>

        <!-- Advanced Analytics Tab -->
        <div id="analytics-tab" class="tab-content">
          <div class="dashboard-grid">
            <div class="panel">
              <h3>📈 Spending Trends</h3>
              <div class="metric">
                <span>Monthly Burn Rate:</span>
                <span class="metric-value" id="monthlyBurnRate">$0</span>
              </div>
              <div class="metric">
                <span>YoY Growth:</span>
                <span class="metric-value" id="yoyGrowth">0%</span>
              </div>
              <div class="metric">
                <span>Seasonal Variance:</span>
                <span class="metric-value" id="seasonalVariance">0%</span>
              </div>
              <div id="spendingChart" style="height: 200px; background: #1a1a1a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666;">
                📊 Spending Trend Chart (Simulated)
              </div>
            </div>

            <div class="panel">
              <h3>🎯 Department Efficiency</h3>
              <div class="metric">
                <span>Most Efficient:</span>
                <span class="metric-value" id="mostEfficient">Science (94%)</span>
              </div>
              <div class="metric">
                <span>Least Efficient:</span>
                <span class="metric-value" id="leastEfficient">Defense (67%)</span>
              </div>
              <div class="metric">
                <span>Avg Efficiency:</span>
                <span class="metric-value" id="avgEfficiency">78%</span>
              </div>
              <div id="efficiencyChart" style="height: 200px; background: #1a1a1a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666;">
                📊 Department Efficiency Chart
              </div>
            </div>

            <div class="panel">
              <h3>💸 Cash Flow Analysis</h3>
              <div class="metric">
                <span>Operating Cash Flow:</span>
                <span class="metric-value" id="operatingCashFlow">$0</span>
              </div>
              <div class="metric">
                <span>Free Cash Flow:</span>
                <span class="metric-value" id="freeCashFlow">$0</span>
              </div>
              <div class="metric">
                <span>Cash Runway:</span>
                <span class="metric-value" id="cashRunway">0 months</span>
              </div>
              <div id="cashFlowChart" style="height: 200px; background: #1a1a1a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666;">
                💰 Cash Flow Projection
              </div>
            </div>

            <div class="panel">
              <h3>🚨 Risk Assessment</h3>
              <div class="metric">
                <span>Budget Risk Score:</span>
                <span class="metric-value" id="budgetRiskScore">Low</span>
              </div>
              <div class="metric">
                <span>Revenue Risk:</span>
                <span class="metric-value" id="revenueRisk">Medium</span>
              </div>
              <div class="metric">
                <span>Liquidity Risk:</span>
                <span class="metric-value" id="liquidityRisk">Low</span>
              </div>
              <div class="controls">
                <button onclick="runRiskAnalysis()">Run Risk Analysis</button>
                <button onclick="generateStressTest()">Stress Test</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Forecasting Tab -->
        <div id="forecasting-tab" class="tab-content">
          <div class="dashboard-grid">
            <div class="panel">
              <h3>🔮 Revenue Forecasting</h3>
              <div class="metric">
                <span>Next Quarter Projection:</span>
                <span class="metric-value" id="nextQuarterRevenue">$0</span>
              </div>
              <div class="metric">
                <span>Annual Projection:</span>
                <span class="metric-value" id="annualRevenueProjection">$0</span>
              </div>
              <div class="metric">
                <span>Confidence Interval:</span>
                <span class="metric-value" id="revenueConfidence">±5%</span>
              </div>
              <div id="revenueProjectionChart" style="height: 250px; background: #1a1a1a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666;">
                📈 Revenue Projection Chart
              </div>
            </div>

            <div class="panel">
              <h3>💰 Expenditure Forecasting</h3>
              <div class="metric">
                <span>Next Quarter Spending:</span>
                <span class="metric-value" id="nextQuarterSpending">$0</span>
              </div>
              <div class="metric">
                <span>Annual Spending Projection:</span>
                <span class="metric-value" id="annualSpendingProjection">$0</span>
              </div>
              <div class="metric">
                <span>Budget Overrun Risk:</span>
                <span class="metric-value" id="overrunRisk">Low</span>
              </div>
              <div id="spendingProjectionChart" style="height: 250px; background: #1a1a1a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666;">
                📉 Spending Projection Chart
              </div>
            </div>

            <div class="panel">
              <h3>⚖️ Budget Balance Scenarios</h3>
              <div class="metric">
                <span>Best Case Scenario:</span>
                <span class="metric-value" id="bestCaseBalance">$0</span>
              </div>
              <div class="metric">
                <span>Most Likely Scenario:</span>
                <span class="metric-value" id="likelyBalance">$0</span>
              </div>
              <div class="metric">
                <span>Worst Case Scenario:</span>
                <span class="metric-value" id="worstCaseBalance">$0</span>
              </div>
              <div class="controls">
                <button onclick="runScenarioAnalysis()">Run Scenario Analysis</button>
                <button onclick="generateForecast()">Generate Forecast</button>
              </div>
            </div>

            <div class="panel">
              <h3>🎯 Policy Impact Modeling</h3>
              <div class="metric">
                <span>Tax Policy Impact:</span>
                <span class="metric-value" id="taxPolicyImpact">+$0</span>
              </div>
              <div class="metric">
                <span>Spending Policy Impact:</span>
                <span class="metric-value" id="spendingPolicyImpact">-$0</span>
              </div>
              <div class="metric">
                <span>Net Policy Effect:</span>
                <span class="metric-value" id="netPolicyEffect">$0</span>
              </div>
              <div class="controls">
                <button onclick="modelPolicyImpact()">Model Policy Impact</button>
                <button onclick="optimizeBudget()">Optimize Budget</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel" style="margin-top: 20px;">
        <h3>🔧 API Response</h3>
        <pre id="apiResponse">Treasury system ready. Use the controls above to interact with the Treasury APIs.</pre>
      </div>
    </div>

    <script>
      let currentCampaignId = 1;
      let currentFiscalYear = 2024;

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
        const alertsContainer = document.getElementById('alertsContainer');
        const alertClass = type === 'error' ? 'alert' : 'success';
        alertsContainer.innerHTML = \`<div class="\${alertClass}">\${message}</div>\`;
      }

      async function initializeBudgets() {
        currentCampaignId = parseInt(document.getElementById('campaignId').value);
        currentFiscalYear = parseInt(document.getElementById('fiscalYear').value);
        
        try {
          const response = await fetch('/api/treasury/departments/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              campaignId: currentCampaignId, 
              fiscalYear: currentFiscalYear 
            })
          });
          
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            showAlert(\`Successfully initialized budgets for \${data.budgets?.length || 0} departments\`);
            loadDepartments();
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function loadDashboard() {
        try {
          const response = await fetch(\`/api/treasury/dashboard?campaignId=\${currentCampaignId}\`);
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            const dashboard = data.dashboard;
            
            // Update government finances
            document.getElementById('totalBudget').textContent = \`$\${dashboard.departmentBudgets?.totalGovernmentBudget?.toLocaleString() || 0}\`;
            document.getElementById('totalSpent').textContent = \`$\${dashboard.departmentBudgets?.totalGovernmentSpent?.toLocaleString() || 0}\`;
            document.getElementById('totalRemaining').textContent = \`$\${dashboard.departmentBudgets?.totalGovernmentRemaining?.toLocaleString() || 0}\`;
            
            // Update budget utilization bar
            const utilization = dashboard.departmentBudgets?.totalGovernmentBudget > 0 ? 
              (dashboard.departmentBudgets.totalGovernmentSpent / dashboard.departmentBudgets.totalGovernmentBudget) * 100 : 0;
            document.getElementById('budgetUtilization').style.width = \`\${Math.min(100, utilization)}%\`;
            
            // Update revenue streams
            document.getElementById('taxRevenue').textContent = \`$\${dashboard.revenueSummary?.totalCollected?.toLocaleString() || 0}\`;
            document.getElementById('collectionEfficiency').textContent = \`\${Math.round((dashboard.revenueSummary?.collectionEfficiency || 0) * 100)}%\`;
            document.getElementById('corporateTax').textContent = \`$\${dashboard.revenueSummary?.corporateTax?.toLocaleString() || 0}\`;
            document.getElementById('individualTax').textContent = \`$\${dashboard.revenueSummary?.individualTax?.toLocaleString() || 0}\`;
            document.getElementById('tradeTariffs').textContent = \`$\${dashboard.revenueSummary?.tradeTariffs?.toLocaleString() || 0}\`;
            document.getElementById('otherRevenue').textContent = \`$\${dashboard.revenueSummary?.otherRevenue?.toLocaleString() || 0}\`;
            
            // Update fiscal health
            document.getElementById('currentDeficit').textContent = \`$\${dashboard.fiscalHealth?.currentDeficit?.toLocaleString() || 0}\`;
            document.getElementById('debtRatio').textContent = \`\${Math.round((dashboard.fiscalHealth?.debtToGdpRatio || 0) * 100)}%\`;
            document.getElementById('creditRating').textContent = dashboard.fiscalHealth?.creditRating || 'AAA';
            document.getElementById('interestPayments').textContent = \`$\${dashboard.fiscalHealth?.interestPayments?.toLocaleString() || 0}\`;
            document.getElementById('debtServiceRatio').textContent = \`\${Math.round((dashboard.fiscalHealth?.debtServiceRatio || 0) * 100)}%\`;
            document.getElementById('fiscalBalance').textContent = \`$\${dashboard.fiscalHealth?.fiscalBalance?.toLocaleString() || 0}\`;
            
            // Update budget performance
            document.getElementById('budgetExecutionRate').textContent = \`\${Math.round((dashboard.budgetPerformance?.executionRate || 0) * 100)}%\`;
            document.getElementById('budgetVariance').textContent = \`$\${dashboard.budgetPerformance?.variance?.toLocaleString() || 0}\`;
            document.getElementById('emergencyReserves').textContent = \`$\${dashboard.budgetPerformance?.emergencyReserves?.toLocaleString() || 0}\`;
            document.getElementById('contingencyFund').textContent = \`$\${dashboard.budgetPerformance?.contingencyFund?.toLocaleString() || 0}\`;
            
            // Update performance indicator bar
            const performanceRate = (dashboard.budgetPerformance?.executionRate || 0) * 100;
            document.getElementById('performanceIndicator').style.width = \`\${Math.min(100, performanceRate)}%\`;
            
            // Update alerts
            const alertsHtml = dashboard.alerts?.map(alert => \`<div class="alert">\${alert}</div>\`).join('') || 
              '<div class="success">All systems operational</div>';
            document.getElementById('alertsContainer').innerHTML = alertsHtml;
            
            showAlert('Dashboard loaded successfully');
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function loadDepartments() {
        const departments = ['Defense', 'State', 'Treasury', 'Interior', 'Science', 'Justice', 'Commerce', 'Intelligence', 'Administration'];
        const departmentGrid = document.getElementById('departmentGrid');
        departmentGrid.innerHTML = '';
        
        for (const dept of departments) {
          try {
            const response = await fetch(\`/api/treasury/departments/\${dept}/budget?campaignId=\${currentCampaignId}&fiscalYear=\${currentFiscalYear}\`);
            const data = await response.json();
            
            if (response.ok) {
              const budget = data.budget;
              const utilizationPercent = Math.round(budget.utilizationRate * 100);
              const statusClass = utilizationPercent > 90 ? 'status-critical' : utilizationPercent > 70 ? 'status-warning' : 'status-healthy';
              
              const departmentCard = \`
                <div class="department-card">
                  <div class="department-name">
                    <span class="status-indicator \${statusClass}"></span>
                    \${dept} Department
                  </div>
                  <div class="metric">
                    <span>Allocated:</span>
                    <span class="metric-value">$\${budget.totalAllocated.toLocaleString()}</span>
                  </div>
                  <div class="metric">
                    <span>Spent:</span>
                    <span class="metric-value">$\${budget.totalSpent.toLocaleString()}</span>
                  </div>
                  <div class="metric">
                    <span>Remaining:</span>
                    <span class="metric-value">$\${budget.remainingBalance.toLocaleString()}</span>
                  </div>
                  <div class="metric">
                    <span>Utilization:</span>
                    <span class="metric-value">\${utilizationPercent}%</span>
                  </div>
                  <div class="budget-bar">
                    <div class="budget-fill" style="width: \${utilizationPercent}%"></div>
                  </div>
                  <button onclick="viewDepartmentDetails('\${dept}')">View Details</button>
                </div>
              \`;
              departmentGrid.innerHTML += departmentCard;
            }
          } catch (error) {
            console.error(\`Failed to load \${dept} budget:\`, error);
          }
        }
      }

      async function generateRollup() {
        try {
          const response = await fetch(\`/api/treasury/departments/rollup?campaignId=\${currentCampaignId}&fiscalYear=\${currentFiscalYear}\`);
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            const rollup = data.rollup;
            
            // Update rollup summary
            const summaryHtml = \`
              <div class="metric">
                <span>Total Government Budget:</span>
                <span class="metric-value">$\${rollup.totalGovernmentBudget.toLocaleString()}</span>
              </div>
              <div class="metric">
                <span>Total Government Spent:</span>
                <span class="metric-value">$\${rollup.totalGovernmentSpent.toLocaleString()}</span>
              </div>
              <div class="metric">
                <span>Total Remaining:</span>
                <span class="metric-value">$\${rollup.totalGovernmentRemaining.toLocaleString()}</span>
              </div>
              <h4>Department Breakdown:</h4>
              \${Object.entries(rollup.departmentSummaries).map(([dept, summary]) => \`
                <div class="department-card" style="margin: 10px 0;">
                  <div class="department-name">\${dept}</div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9em;">
                    <div>Allocated: $\${summary.allocated.toLocaleString()}</div>
                    <div>Spent: $\${summary.spent.toLocaleString()}</div>
                    <div>Remaining: $\${summary.remaining.toLocaleString()}</div>
                    <div>Utilization: \${Math.round(summary.utilizationRate * 100)}%</div>
                  </div>
                </div>
              \`).join('')}
            \`;
            document.getElementById('rollupSummary').innerHTML = summaryHtml;
            
            // Update top categories
            const categoriesHtml = rollup.topSpendingCategories.map(cat => \`
              <div class="metric">
                <span>\${cat.category}:</span>
                <span class="metric-value">$\${cat.totalSpent.toLocaleString()} (\${cat.percentage.toFixed(1)}%)</span>
              </div>
            \`).join('');
            document.getElementById('topCategories').innerHTML = categoriesHtml;
            
            showAlert('Budget rollup generated successfully');
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function submitSpendingRequest() {
        const department = document.getElementById('requestDepartment').value;
        const category = document.getElementById('requestCategory').value;
        const amount = parseInt(document.getElementById('requestAmount').value);
        const urgency = document.getElementById('requestUrgency').value;
        const purpose = document.getElementById('requestPurpose').value;
        const justification = document.getElementById('requestJustification').value;
        
        if (!amount || !purpose || !justification) {
          showAlert('Please fill in all required fields', 'error');
          return;
        }
        
        try {
          const response = await fetch(\`/api/treasury/departments/\${department}/spending-request\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secretaryId: \`ai-secretary-\${department.toLowerCase()}\`,
              category,
              amount,
              purpose,
              description: justification,
              justification,
              urgency
            })
          });
          
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            showAlert(\`Spending request submitted successfully for \${department} Department\`);
            
            // Clear form
            document.getElementById('requestAmount').value = '';
            document.getElementById('requestPurpose').value = '';
            document.getElementById('requestJustification').value = '';
            
            // Update recent requests
            const requestsHtml = \`
              <div class="department-card" style="margin: 10px 0;">
                <div class="department-name">\${department} - \${category}</div>
                <div class="metric">
                  <span>Amount:</span>
                  <span class="metric-value">$\${amount.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span>Purpose:</span>
                  <span>\${purpose}</span>
                </div>
                <div class="metric">
                  <span>Status:</span>
                  <span class="metric-value">\${urgency === 'emergency' ? 'Auto-Approved' : 'Pending Approval'}</span>
                </div>
              </div>
            \`;
            document.getElementById('recentRequests').innerHTML = requestsHtml + document.getElementById('recentRequests').innerHTML;
          } else {
            showAlert(\`Error: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      async function viewDepartmentDetails(department) {
        try {
          const response = await fetch(\`/api/treasury/departments/\${department}/analytics?campaignId=\${currentCampaignId}\`);
          const data = await response.json();
          updateApiResponse(data);
          
          if (response.ok) {
            showAlert(\`Loaded analytics for \${department} Department\`);
          } else {
            showAlert(\`Error loading \${department} analytics: \${data.error}\`, 'error');
          }
        } catch (error) {
          showAlert(\`Request failed: \${error.message}\`, 'error');
        }
      }

      // Initialize with current values
      document.getElementById('campaignId').addEventListener('change', (e) => {
        currentCampaignId = parseInt(e.target.value);
      });
      
      document.getElementById('fiscalYear').addEventListener('change', (e) => {
        currentFiscalYear = parseInt(e.target.value);
      });
      
      // Advanced Analytics Functions
      async function runRiskAnalysis() {
        try {
          // Simulate risk analysis with realistic data
          const riskData = {
            budgetRisk: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
            revenueRisk: Math.random() > 0.6 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low',
            liquidityRisk: Math.random() > 0.8 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low'
          };
          
          document.getElementById('budgetRiskScore').textContent = riskData.budgetRisk;
          document.getElementById('revenueRisk').textContent = riskData.revenueRisk;
          document.getElementById('liquidityRisk').textContent = riskData.liquidityRisk;
          
          showAlert('Risk analysis completed successfully');
          updateApiResponse({ riskAnalysis: riskData, timestamp: new Date().toISOString() });
        } catch (error) {
          showAlert(\`Risk analysis failed: \${error.message}\`, 'error');
        }
      }

      async function generateStressTest() {
        try {
          const stressTestResults = {
            scenario: 'Economic Downturn',
            revenueImpact: '-15%',
            spendingPressure: '+8%',
            liquidityPosition: 'Stable',
            recommendations: [
              'Increase emergency reserves by 20%',
              'Defer non-critical infrastructure spending',
              'Implement revenue diversification strategy'
            ]
          };
          
          showAlert('Stress test completed - Review recommendations in API response');
          updateApiResponse({ stressTest: stressTestResults, timestamp: new Date().toISOString() });
        } catch (error) {
          showAlert(\`Stress test failed: \${error.message}\`, 'error');
        }
      }

      async function runScenarioAnalysis() {
        try {
          const scenarios = {
            bestCase: { balance: 2500000000, probability: 0.2 },
            mostLikely: { balance: 1800000000, probability: 0.6 },
            worstCase: { balance: -500000000, probability: 0.2 }
          };
          
          document.getElementById('bestCaseBalance').textContent = \`$\${scenarios.bestCase.balance.toLocaleString()}\`;
          document.getElementById('likelyBalance').textContent = \`$\${scenarios.mostLikely.balance.toLocaleString()}\`;
          document.getElementById('worstCaseBalance').textContent = \`$\${scenarios.worstCase.balance.toLocaleString()}\`;
          
          showAlert('Scenario analysis completed successfully');
          updateApiResponse({ scenarioAnalysis: scenarios, timestamp: new Date().toISOString() });
        } catch (error) {
          showAlert(\`Scenario analysis failed: \${error.message}\`, 'error');
        }
      }

      async function generateForecast() {
        try {
          const forecast = {
            nextQuarterRevenue: 45000000000,
            annualRevenueProjection: 180000000000,
            nextQuarterSpending: 42000000000,
            annualSpendingProjection: 175000000000,
            confidence: '±5%'
          };
          
          document.getElementById('nextQuarterRevenue').textContent = \`$\${forecast.nextQuarterRevenue.toLocaleString()}\`;
          document.getElementById('annualRevenueProjection').textContent = \`$\${forecast.annualRevenueProjection.toLocaleString()}\`;
          document.getElementById('nextQuarterSpending').textContent = \`$\${forecast.nextQuarterSpending.toLocaleString()}\`;
          document.getElementById('annualSpendingProjection').textContent = \`$\${forecast.annualSpendingProjection.toLocaleString()}\`;
          document.getElementById('revenueConfidence').textContent = forecast.confidence;
          
          // Calculate overrun risk
          const overrunRisk = forecast.annualSpendingProjection > forecast.annualRevenueProjection ? 'High' : 'Low';
          document.getElementById('overrunRisk').textContent = overrunRisk;
          
          showAlert('Financial forecast generated successfully');
          updateApiResponse({ forecast, timestamp: new Date().toISOString() });
        } catch (error) {
          showAlert(\`Forecast generation failed: \${error.message}\`, 'error');
        }
      }

      async function modelPolicyImpact() {
        try {
          const policyImpact = {
            taxPolicyImpact: 5000000000,
            spendingPolicyImpact: -3000000000,
            netEffect: 2000000000
          };
          
          document.getElementById('taxPolicyImpact').textContent = \`+$\${policyImpact.taxPolicyImpact.toLocaleString()}\`;
          document.getElementById('spendingPolicyImpact').textContent = \`-$\${Math.abs(policyImpact.spendingPolicyImpact).toLocaleString()}\`;
          document.getElementById('netPolicyEffect').textContent = \`$\${policyImpact.netEffect.toLocaleString()}\`;
          
          showAlert('Policy impact modeling completed');
          updateApiResponse({ policyImpact, timestamp: new Date().toISOString() });
        } catch (error) {
          showAlert(\`Policy impact modeling failed: \${error.message}\`, 'error');
        }
      }

      async function optimizeBudget() {
        try {
          const optimization = {
            potentialSavings: 8500000000,
            efficiencyGains: '12%',
            recommendations: [
              'Consolidate IT infrastructure across departments',
              'Implement shared services for HR and Finance',
              'Optimize procurement through bulk purchasing',
              'Reduce administrative overhead by 15%'
            ]
          };
          
          showAlert(\`Budget optimization identified $\${optimization.potentialSavings.toLocaleString()} in potential savings\`);
          updateApiResponse({ budgetOptimization: optimization, timestamp: new Date().toISOString() });
        } catch (error) {
          showAlert(\`Budget optimization failed: \${error.message}\`, 'error');
        }
      }

      // Load initial data
      setTimeout(() => {
        showAlert('Treasury Secretary Dashboard ready. Initialize budgets to begin.');
        
        // Load some sample analytics data
        document.getElementById('monthlyBurnRate').textContent = '$3.2B';
        document.getElementById('yoyGrowth').textContent = '+8.5%';
        document.getElementById('seasonalVariance').textContent = '±12%';
        document.getElementById('operatingCashFlow').textContent = '$2.8B';
        document.getElementById('freeCashFlow').textContent = '$1.9B';
        document.getElementById('cashRunway').textContent = '18 months';
      }, 500);
    </script>
  </body>
  </html>`);
});

export default treasuryDemo;
