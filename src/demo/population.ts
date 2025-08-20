/**
 * Population & Demographics Demo Interface
 * 
 * Interactive demo showcasing the Population & Demographics Engine with
 * citizen behavior simulation, incentive response testing, and demographic evolution.
 */

import express from 'express';

const app = express();

app.get('/demo/population', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Population & Demographics Engine Demo</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: #fff; 
          min-height: 100vh;
        }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { font-size: 1.2em; opacity: 0.9; }
        
        .demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .demo-section { background: rgba(255,255,255,0.1); border-radius: 15px; padding: 25px; backdrop-filter: blur(10px); }
        .section-title { font-size: 1.4em; margin-bottom: 20px; color: #4ade80; display: flex; align-items: center; gap: 10px; }
        
        .controls { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; }
        .control-group { display: flex; flex-direction: column; gap: 5px; }
        .control-group label { font-size: 0.9em; opacity: 0.9; }
        .control-group select, .control-group input { 
          padding: 8px 12px; border: none; border-radius: 8px; 
          background: rgba(255,255,255,0.2); color: #fff; 
        }
        .control-group select option { background: #1e3c72; color: #fff; }
        
        .btn { 
          background: #4ade80; color: #000; border: none; padding: 12px 24px; 
          border-radius: 8px; cursor: pointer; font-weight: bold; 
          transition: all 0.3s; margin: 5px;
        }
        .btn:hover { background: #22c55e; transform: translateY(-2px); }
        .btn.secondary { background: #3b82f6; color: #fff; }
        .btn.danger { background: #ef4444; color: #fff; }
        
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .metric-card { 
          background: rgba(255,255,255,0.15); padding: 15px; border-radius: 10px; 
          text-align: center; border: 1px solid rgba(255,255,255,0.2);
        }
        .metric-value { font-size: 1.8em; font-weight: bold; color: #4ade80; }
        .metric-label { font-size: 0.9em; opacity: 0.8; margin-top: 5px; }
        .metric-change { font-size: 0.8em; margin-top: 3px; }
        .metric-change.positive { color: #4ade80; }
        .metric-change.negative { color: #ef4444; }
        
        .chart-container { 
          background: rgba(255,255,255,0.1); border-radius: 10px; padding: 20px; 
          margin-bottom: 20px; min-height: 300px; position: relative;
        }
        .chart-placeholder { 
          display: flex; align-items: center; justify-content: center; 
          height: 260px; color: #888; font-style: italic;
        }
        
        .citizen-list { max-height: 400px; overflow-y: auto; }
        .citizen-card { 
          background: rgba(255,255,255,0.1); margin-bottom: 10px; padding: 15px; 
          border-radius: 8px; border-left: 4px solid #4ade80;
        }
        .citizen-header { display: flex; justify-content: between; align-items: center; margin-bottom: 10px; }
        .citizen-name { font-weight: bold; color: #4ade80; }
        .citizen-profession { opacity: 0.8; font-size: 0.9em; }
        .citizen-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 0.8em; }
        .citizen-stat { text-align: center; }
        .citizen-stat-value { font-weight: bold; }
        .citizen-stat-label { opacity: 0.7; }
        
        .incentive-panel { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; }
        .incentive-results { margin-top: 20px; }
        .response-bar { 
          background: rgba(255,255,255,0.2); height: 20px; border-radius: 10px; 
          margin: 5px 0; overflow: hidden; position: relative;
        }
        .response-fill { 
          background: linear-gradient(90deg, #4ade80, #22c55e); 
          height: 100%; transition: width 0.5s ease;
        }
        .response-label { 
          position: absolute; left: 10px; top: 50%; transform: translateY(-50%); 
          font-size: 0.8em; font-weight: bold; color: #000;
        }
        
        .log-panel { 
          background: rgba(0,0,0,0.3); border-radius: 10px; padding: 15px; 
          max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 0.9em;
        }
        .log-entry { margin-bottom: 5px; }
        .log-timestamp { color: #888; }
        .log-message { color: #ccc; }
        
        .full-width { grid-column: 1 / -1; }
        
        @media (max-width: 768px) {
          .demo-grid { grid-template-columns: 1fr; }
          .metrics-grid { grid-template-columns: repeat(2, 1fr); }
          .controls { flex-direction: column; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏙️ Population & Demographics Engine</h1>
          <p>Individual citizen modeling with psychological profiles and realistic behavioral economics</p>
        </div>
        
        <div class="demo-grid">
          <!-- Population Overview -->
          <div class="demo-section">
            <div class="section-title">
              📊 Population Overview
            </div>
            
            <div class="controls">
              <div class="control-group">
                <label>City Filter</label>
                <select id="cityFilter">
                  <option value="">All Cities</option>
                  <option value="city_alpha">Alpha City</option>
                  <option value="city_beta">Beta City</option>
                  <option value="city_gamma">Gamma City</option>
                </select>
              </div>
              <button class="btn" onclick="refreshPopulation()">Refresh Data</button>
              <button class="btn secondary" onclick="generateCitizens()">Generate Citizens</button>
            </div>
            
            <div class="metrics-grid" id="populationMetrics">
              <div class="metric-card">
                <div class="metric-value" id="totalPopulation">-</div>
                <div class="metric-label">Total Population</div>
                <div class="metric-change" id="populationChange"></div>
              </div>
              <div class="metric-card">
                <div class="metric-value" id="averageAge">-</div>
                <div class="metric-label">Average Age</div>
                <div class="metric-change" id="ageChange"></div>
              </div>
              <div class="metric-card">
                <div class="metric-value" id="averageIncome">-</div>
                <div class="metric-label">Average Income</div>
                <div class="metric-change" id="incomeChange"></div>
              </div>
              <div class="metric-card">
                <div class="metric-value" id="unemploymentRate">-</div>
                <div class="metric-label">Unemployment Rate</div>
                <div class="metric-change" id="unemploymentChange"></div>
              </div>
              <div class="metric-card">
                <div class="metric-value" id="happinessIndex">-</div>
                <div class="metric-label">Happiness Index</div>
                <div class="metric-change" id="happinessChange"></div>
              </div>
              <div class="metric-card">
                <div class="metric-value" id="socialMobility">-</div>
                <div class="metric-label">Social Mobility</div>
                <div class="metric-change" id="mobilityChange"></div>
              </div>
            </div>
            
            <div class="chart-container">
              <div class="chart-placeholder" id="demographicsChart">
                Demographics Distribution Chart
              </div>
            </div>
          </div>
          
          <!-- Incentive Testing -->
          <div class="demo-section">
            <div class="section-title">
              🎯 Incentive Response Testing
            </div>
            
            <div class="incentive-panel">
              <div class="controls">
                <div class="control-group">
                  <label>Incentive Type</label>
                  <select id="incentiveType">
                    <option value="tax_reduction">Tax Reduction</option>
                    <option value="education_opportunity">Education Opportunity</option>
                    <option value="job_training">Job Training</option>
                    <option value="healthcare_access">Healthcare Access</option>
                    <option value="housing_assistance">Housing Assistance</option>
                    <option value="subsidy">Business Subsidy</option>
                    <option value="infrastructure">Infrastructure Investment</option>
                  </select>
                </div>
                <div class="control-group">
                  <label>Strength</label>
                  <input type="range" id="incentiveStrength" min="0.1" max="2.0" step="0.1" value="1.0">
                  <span id="strengthValue">1.0</span>
                </div>
              </div>
              
              <div class="controls">
                <div class="control-group">
                  <label>Target Age Range</label>
                  <input type="number" id="ageMin" placeholder="Min Age" min="18" max="100" style="width: 80px;">
                  <input type="number" id="ageMax" placeholder="Max Age" min="18" max="100" style="width: 80px;">
                </div>
                <div class="control-group">
                  <label>Target Profession</label>
                  <select id="targetProfession">
                    <option value="">All Professions</option>
                    <option value="teacher">Teacher</option>
                    <option value="engineer">Engineer</option>
                    <option value="doctor">Doctor</option>
                    <option value="manager">Manager</option>
                    <option value="worker">Worker</option>
                  </select>
                </div>
              </div>
              
              <button class="btn" onclick="testIncentive()">Test Incentive Response</button>
              <button class="btn secondary" onclick="applyIncentive()">Apply to Population</button>
              
              <div class="incentive-results" id="incentiveResults" style="display: none;">
                <h4>Response Analysis</h4>
                <div id="responseMetrics"></div>
                <div id="behaviorChanges"></div>
              </div>
            </div>
          </div>
          
          <!-- Citizen Browser -->
          <div class="demo-section">
            <div class="section-title">
              👥 Individual Citizens
            </div>
            
            <div class="controls">
              <div class="control-group">
                <label>Filter by Profession</label>
                <select id="professionFilter">
                  <option value="">All Professions</option>
                  <option value="teacher">Teacher</option>
                  <option value="engineer">Engineer</option>
                  <option value="doctor">Doctor</option>
                  <option value="manager">Manager</option>
                  <option value="worker">Worker</option>
                </select>
              </div>
              <button class="btn" onclick="loadCitizens()">Load Citizens</button>
            </div>
            
            <div class="citizen-list" id="citizenList">
              <div class="chart-placeholder">Click "Load Citizens" to view individual citizen profiles</div>
            </div>
          </div>
          
          <!-- Simulation Controls -->
          <div class="demo-section">
            <div class="section-title">
              ⏱️ Population Simulation
            </div>
            
            <div class="controls">
              <div class="control-group">
                <label>Time Steps</label>
                <input type="number" id="timeSteps" min="1" max="12" value="1" style="width: 80px;">
              </div>
              <div class="control-group">
                <label>Active Incentives</label>
                <select id="activeIncentives" multiple style="height: 80px;">
                  <option value="education_opportunity">Education Opportunity</option>
                  <option value="job_training">Job Training</option>
                  <option value="healthcare_access">Healthcare Access</option>
                </select>
              </div>
            </div>
            
            <button class="btn" onclick="simulatePopulation()">Simulate Time Steps</button>
            <button class="btn secondary" onclick="resetSimulation()">Reset Population</button>
            
            <div class="chart-container">
              <div class="chart-placeholder" id="simulationChart">
                Population Evolution Over Time
              </div>
            </div>
          </div>
        </div>
        
        <!-- Activity Log -->
        <div class="demo-section full-width">
          <div class="section-title">
            📋 Activity Log
          </div>
          <div class="log-panel" id="activityLog">
            <div class="log-entry">
              <span class="log-timestamp">[${new Date().toLocaleTimeString()}]</span>
              <span class="log-message">Population & Demographics Engine initialized</span>
            </div>
          </div>
        </div>
      </div>
      
      <script>
        let currentMetrics = null;
        let previousMetrics = null;
        
        // Initialize demo
        document.addEventListener('DOMContentLoaded', function() {
          refreshPopulation();
          
          // Update strength display
          document.getElementById('incentiveStrength').addEventListener('input', function() {
            document.getElementById('strengthValue').textContent = this.value;
          });
        });
        
        function log(message) {
          const logPanel = document.getElementById('activityLog');
          const timestamp = new Date().toLocaleTimeString();
          const entry = document.createElement('div');
          entry.className = 'log-entry';
          entry.innerHTML = \`
            <span class="log-timestamp">[\${timestamp}]</span>
            <span class="log-message">\${message}</span>
          \`;
          logPanel.insertBefore(entry, logPanel.firstChild);
          
          // Keep only last 50 entries
          while (logPanel.children.length > 50) {
            logPanel.removeChild(logPanel.lastChild);
          }
        }
        
        async function refreshPopulation() {
          try {
            const cityId = document.getElementById('cityFilter').value;
            const url = cityId ? \`/api/population/demographics?cityId=\${cityId}\` : '/api/population/demographics';
            
            const response = await fetch(url);
            const data = await response.json();
            
            previousMetrics = currentMetrics;
            currentMetrics = data.metrics;
            
            updateMetricsDisplay();
            log(\`Population data refreshed for \${cityId || 'all cities'}\`);
          } catch (error) {
            log(\`Error refreshing population: \${error.message}\`);
          }
        }
        
        function updateMetricsDisplay() {
          if (!currentMetrics) return;
          
          // Update metric values
          document.getElementById('totalPopulation').textContent = currentMetrics.totalPopulation.toLocaleString();
          document.getElementById('averageAge').textContent = currentMetrics.averageAge.toFixed(1);
          document.getElementById('averageIncome').textContent = '$' + (currentMetrics.averageIncome * 12).toLocaleString();
          document.getElementById('unemploymentRate').textContent = (currentMetrics.unemploymentRate * 100).toFixed(1) + '%';
          document.getElementById('happinessIndex').textContent = (currentMetrics.happinessIndex * 100).toFixed(1) + '%';
          document.getElementById('socialMobility').textContent = (currentMetrics.socialMobility * 100).toFixed(1) + '%';
          
          // Update change indicators
          if (previousMetrics) {
            updateChangeIndicator('populationChange', currentMetrics.totalPopulation, previousMetrics.totalPopulation);
            updateChangeIndicator('ageChange', currentMetrics.averageAge, previousMetrics.averageAge, 1);
            updateChangeIndicator('incomeChange', currentMetrics.averageIncome, previousMetrics.averageIncome, 0, '$');
            updateChangeIndicator('unemploymentChange', currentMetrics.unemploymentRate, previousMetrics.unemploymentRate, 2, '', '%');
            updateChangeIndicator('happinessChange', currentMetrics.happinessIndex, previousMetrics.happinessIndex, 2, '', '%');
            updateChangeIndicator('mobilityChange', currentMetrics.socialMobility, previousMetrics.socialMobility, 2, '', '%');
          }
        }
        
        function updateChangeIndicator(elementId, current, previous, decimals = 0, prefix = '', suffix = '') {
          const element = document.getElementById(elementId);
          const change = current - previous;
          const changePercent = previous !== 0 ? (change / previous) * 100 : 0;
          
          if (Math.abs(change) < 0.001) {
            element.textContent = 'No change';
            element.className = 'metric-change';
          } else {
            const sign = change > 0 ? '+' : '';
            element.textContent = \`\${sign}\${prefix}\${change.toFixed(decimals)}\${suffix} (\${sign}\${changePercent.toFixed(1)}%)\`;
            element.className = \`metric-change \${change > 0 ? 'positive' : 'negative'}\`;
          }
        }
        
        async function generateCitizens() {
          try {
            const cityId = document.getElementById('cityFilter').value || 'city_alpha';
            const response = await fetch('/api/population/citizens', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cityId, count: 5 })
            });
            
            const data = await response.json();
            log(\`Generated \${data.count} new citizens in \${cityId}\`);
            refreshPopulation();
          } catch (error) {
            log(\`Error generating citizens: \${error.message}\`);
          }
        }
        
        async function testIncentive() {
          try {
            const incentiveType = document.getElementById('incentiveType').value;
            const incentiveStrength = parseFloat(document.getElementById('incentiveStrength').value);
            const ageMin = document.getElementById('ageMin').value;
            const ageMax = document.getElementById('ageMax').value;
            const profession = document.getElementById('targetProfession').value;
            
            const targetCriteria = {};
            if (ageMin) targetCriteria.ageMin = parseInt(ageMin);
            if (ageMax) targetCriteria.ageMax = parseInt(ageMax);
            if (profession) targetCriteria.profession = profession;
            
            const response = await fetch('/api/population/incentives', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                incentiveType,
                incentiveStrength,
                targetCriteria,
                simulateOnly: true
              })
            });
            
            const data = await response.json();
            displayIncentiveResults(data);
            log(\`Tested incentive: \${incentiveType} (strength: \${incentiveStrength}) on \${data.incentive.appliedTo} citizens\`);
          } catch (error) {
            log(\`Error testing incentive: \${error.message}\`);
          }
        }
        
        function displayIncentiveResults(data) {
          const resultsDiv = document.getElementById('incentiveResults');
          const metricsDiv = document.getElementById('responseMetrics');
          const changesDiv = document.getElementById('behaviorChanges');
          
          metricsDiv.innerHTML = \`
            <div class="response-bar">
              <div class="response-fill" style="width: \${data.impact.overallResponseRate * 100}%"></div>
              <div class="response-label">Overall Response: \${(data.impact.overallResponseRate * 100).toFixed(1)}%</div>
            </div>
          \`;
          
          let changesHtml = '<h5>Behavior Changes:</h5>';
          Object.entries(data.impact.behaviorChanges).forEach(([behavior, change]) => {
            changesHtml += \`
              <div class="response-bar">
                <div class="response-fill" style="width: \${Math.abs(change) * 100}%"></div>
                <div class="response-label">\${behavior}: \${(change * 100).toFixed(1)}%</div>
              </div>
            \`;
          });
          changesDiv.innerHTML = changesHtml;
          
          resultsDiv.style.display = 'block';
        }
        
        async function applyIncentive() {
          try {
            const incentiveType = document.getElementById('incentiveType').value;
            const incentiveStrength = parseFloat(document.getElementById('incentiveStrength').value);
            
            const response = await fetch('/api/population/incentives', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                incentiveType,
                incentiveStrength,
                simulateOnly: false
              })
            });
            
            const data = await response.json();
            log(\`Applied incentive: \${incentiveType} to \${data.incentive.appliedTo} citizens\`);
            refreshPopulation();
          } catch (error) {
            log(\`Error applying incentive: \${error.message}\`);
          }
        }
        
        async function loadCitizens() {
          try {
            const profession = document.getElementById('professionFilter').value;
            const cityId = document.getElementById('cityFilter').value;
            
            let url = '/api/population/citizens?limit=10';
            if (profession) url += \`&profession=\${profession}\`;
            if (cityId) url += \`&cityId=\${cityId}\`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            displayCitizens(data.citizens);
            log(\`Loaded \${data.citizens.length} citizens\`);
          } catch (error) {
            log(\`Error loading citizens: \${error.message}\`);
          }
        }
        
        function displayCitizens(citizens) {
          const listDiv = document.getElementById('citizenList');
          
          if (citizens.length === 0) {
            listDiv.innerHTML = '<div class="chart-placeholder">No citizens found matching criteria</div>';
            return;
          }
          
          listDiv.innerHTML = citizens.map(citizen => \`
            <div class="citizen-card">
              <div class="citizen-header">
                <div class="citizen-name">Citizen \${citizen.id.value.split('_')[2]}</div>
                <div class="citizen-profession">\${citizen.career.currentProfession} • Age \${Math.floor(citizen.demographics.age)}</div>
              </div>
              <div class="citizen-stats">
                <div class="citizen-stat">
                  <div class="citizen-stat-value">\${(citizen.happiness * 100).toFixed(0)}%</div>
                  <div class="citizen-stat-label">Happiness</div>
                </div>
                <div class="citizen-stat">
                  <div class="citizen-stat-value">$\${(citizen.finances.income * 12).toLocaleString()}</div>
                  <div class="citizen-stat-label">Annual Income</div>
                </div>
                <div class="citizen-stat">
                  <div class="citizen-stat-value">\${citizen.career.skillLevel.toFixed(0)}</div>
                  <div class="citizen-stat-label">Skill Level</div>
                </div>
              </div>
            </div>
          \`).join('');
        }
        
        async function simulatePopulation() {
          try {
            const steps = parseInt(document.getElementById('timeSteps').value);
            const incentiveSelect = document.getElementById('activeIncentives');
            const incentives = Array.from(incentiveSelect.selectedOptions).map(option => option.value);
            const cityId = document.getElementById('cityFilter').value;
            
            const requestBody = { steps, incentives };
            if (cityId) requestBody.cityId = cityId;
            
            const response = await fetch('/api/population/simulate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestBody)
            });
            
            const data = await response.json();
            log(\`Simulated \${steps} time steps for \${data.simulation.citizensSimulated} citizens\`);
            
            // Update metrics with simulation results
            previousMetrics = data.before;
            currentMetrics = data.after;
            updateMetricsDisplay();
            
            // Log significant changes
            Object.entries(data.changes).forEach(([metric, change]) => {
              if (Math.abs(change) > 0.01) {
                log(\`\${metric}: \${change > 0 ? '+' : ''}\${change.toFixed(3)}\`);
              }
            });
            
          } catch (error) {
            log(\`Error simulating population: \${error.message}\`);
          }
        }
        
        async function resetSimulation() {
          try {
            // In a real implementation, this would reset the population state
            log('Population simulation reset (feature not implemented in demo)');
            refreshPopulation();
          } catch (error) {
            log(\`Error resetting simulation: \${error.message}\`);
          }
        }
      </script>
    </body>
    </html>
  `);
});

export default app;
