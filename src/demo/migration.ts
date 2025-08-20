/**
 * Immigration & Migration System Demo
 * 
 * Interactive web interface for exploring migration flows, immigration policies,
 * integration outcomes, and comprehensive migration analytics.
 */

import express from 'express';

const router = express.Router();

/**
 * Main migration demo page
 */
router.get('/demo/migration', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Immigration & Migration System Demo</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          max-width: 1400px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #4facfe;
        }
        .header h1 {
          color: #2c3e50;
          font-size: 2.5em;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        .header p {
          color: #7f8c8d;
          font-size: 1.2em;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .nav-tabs {
          display: flex;
          margin-bottom: 30px;
          background: #f8f9fa;
          border-radius: 10px;
          padding: 5px;
          overflow-x: auto;
        }
        .nav-tab {
          flex: 1;
          min-width: 150px;
          padding: 15px 20px;
          text-align: center;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #6c757d;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .nav-tab.active {
          background: #4facfe;
          color: white;
          box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
        }
        .nav-tab:hover:not(.active) {
          background: #e9ecef;
          color: #495057;
        }
        .tab-content {
          display: none;
        }
        .tab-content.active {
          display: block;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }
        .card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          border: 1px solid #e9ecef;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        .card h3 {
          color: #2c3e50;
          margin-bottom: 15px;
          font-size: 1.4em;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .card-icon {
          font-size: 1.5em;
        }
        .metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f1f3f4;
        }
        .metric:last-child {
          border-bottom: none;
        }
        .metric-label {
          color: #6c757d;
          font-weight: 500;
        }
        .metric-value {
          font-weight: 700;
          color: #2c3e50;
        }
        .btn {
          background: #4facfe;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          margin: 5px;
        }
        .btn:hover {
          background: #3d8bfe;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(61, 139, 254, 0.4);
        }
        .btn-secondary {
          background: #6c757d;
        }
        .btn-secondary:hover {
          background: #5a6268;
        }
        .btn-success {
          background: #28a745;
        }
        .btn-success:hover {
          background: #218838;
        }
        .btn-warning {
          background: #ffc107;
          color: #212529;
        }
        .btn-warning:hover {
          background: #e0a800;
        }
        .status-indicator {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 8px;
        }
        .status-active { background: #28a745; }
        .status-planned { background: #ffc107; }
        .status-completed { background: #6c757d; }
        .status-interrupted { background: #dc3545; }
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
          margin: 8px 0;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4facfe, #00f2fe);
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .city-selector {
          margin-bottom: 20px;
        }
        .city-selector select {
          padding: 10px 15px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 16px;
          background: white;
          min-width: 200px;
          margin-right: 10px;
        }
        .loading {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }
        .error {
          background: #f8d7da;
          color: #721c24;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
          border: 1px solid #f5c6cb;
        }
        .success {
          background: #d4edda;
          color: #155724;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
          border: 1px solid #c3e6cb;
        }
        .flow-badge {
          display: inline-block;
          background: #4facfe;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin: 2px;
        }
        .legal-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          margin: 2px;
        }
        .legal-documented { background: #d4edda; color: #155724; }
        .legal-undocumented { background: #f8d7da; color: #721c24; }
        .legal-refugee { background: #fff3cd; color: #856404; }
        .integration-stage {
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 600;
          margin: 2px;
        }
        .stage-arrival { background: #f8d7da; color: #721c24; }
        .stage-initial_settlement { background: #fff3cd; color: #856404; }
        .stage-adaptation { background: #cce5ff; color: #004085; }
        .stage-integration { background: #d1ecf1; color: #0c5460; }
        .stage-full_integration { background: #d4edda; color: #155724; }
        .flow-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          margin: 10px 0;
          border-left: 4px solid #4facfe;
        }
        .flow-details {
          flex: 1;
        }
        .flow-stats {
          text-align: right;
          min-width: 120px;
        }
        .policy-item {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          margin: 10px 0;
          border-left: 4px solid #28a745;
        }
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        .chart-container {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .integration-timeline {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px 0;
        }
        .timeline-stage {
          flex: 1;
          text-align: center;
          padding: 8px;
          border-radius: 5px;
          font-size: 12px;
          font-weight: 600;
        }
        .timeline-active {
          background: #4facfe;
          color: white;
        }
        .timeline-completed {
          background: #28a745;
          color: white;
        }
        .timeline-pending {
          background: #e9ecef;
          color: #6c757d;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌍 Immigration & Migration System</h1>
          <p>Explore comprehensive population movement modeling with legal/illegal immigration, internal migration, cultural integration, and policy effects. Analyze migration flows, track integration outcomes, and understand the impact of immigration policies on communities.</p>
        </div>

        <div class="nav-tabs">
          <button class="nav-tab active" onclick="showTab('overview')">Migration Overview</button>
          <button class="nav-tab" onclick="showTab('flows')">Migration Flows</button>
          <button class="nav-tab" onclick="showTab('policies')">Immigration Policies</button>
          <button class="nav-tab" onclick="showTab('integration')">Integration Outcomes</button>
          <button class="nav-tab" onclick="showTab('analytics')">Migration Analytics</button>
          <button class="nav-tab" onclick="showTab('simulation')">Live Simulation</button>
        </div>

        <!-- Migration Overview Tab -->
        <div id="overview" class="tab-content active">
          <div class="city-selector">
            <label for="citySelectOverview">Select City: </label>
            <select id="citySelectOverview" onchange="loadOverview()">
              <option value="">Loading cities...</option>
            </select>
            <button class="btn btn-secondary" onclick="loadAllOverview()">Show All Cities</button>
          </div>

          <div id="overviewContent" class="loading">
            <p>Select a city to view migration overview...</p>
          </div>
        </div>

        <!-- Migration Flows Tab -->
        <div id="flows" class="tab-content">
          <div class="city-selector">
            <select id="citySelectFlows" onchange="loadMigrationFlows()">
              <option value="">Select a city...</option>
            </select>
            <button class="btn" onclick="createNewFlow()">Create Migration Flow</button>
            <button class="btn btn-secondary" onclick="loadAllFlows()">Show All Flows</button>
          </div>

          <div id="flowsContent" class="loading">
            <p>Select a city to view migration flows...</p>
          </div>
        </div>

        <!-- Immigration Policies Tab -->
        <div id="policies" class="tab-content">
          <div class="city-selector">
            <button class="btn" onclick="createNewPolicy()">Create New Policy</button>
            <button class="btn btn-secondary" onclick="loadAllPolicies()">Refresh Policies</button>
          </div>

          <div id="policiesContent" class="loading">
            <p>Loading immigration policies...</p>
          </div>
        </div>

        <!-- Integration Outcomes Tab -->
        <div id="integration" class="tab-content">
          <div class="city-selector">
            <select id="citySelectIntegration" onchange="loadIntegrationOutcomes()">
              <option value="">Select a city...</option>
            </select>
          </div>

          <div id="integrationContent" class="loading">
            <p>Select a city to view integration outcomes...</p>
          </div>
        </div>

        <!-- Migration Analytics Tab -->
        <div id="analytics" class="tab-content">
          <div class="city-selector">
            <select id="citySelectAnalytics" onchange="loadMigrationAnalytics()">
              <option value="">Select a city...</option>
            </select>
            <select id="timeframeSelect">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div id="analyticsContent" class="loading">
            <p>Select a city to view migration analytics...</p>
          </div>
        </div>

        <!-- Live Simulation Tab -->
        <div id="simulation" class="tab-content">
          <div class="city-selector">
            <button class="btn" onclick="simulateMigration()">Simulate Time Step</button>
            <button class="btn btn-secondary" onclick="loadSimulationData()">Refresh Data</button>
          </div>

          <div id="simulationContent" class="loading">
            <p>Click "Simulate Time Step" to run migration simulation...</p>
          </div>
        </div>
      </div>

      <script>
        let cities = [];
        let migrationFlows = [];
        let policies = [];
        let currentCity = null;

        // Initialize the demo
        async function init() {
          await loadCities();
          await loadAllPolicies();
          populateCitySelectors();
        }

        // Load cities from city system
        async function loadCities() {
          try {
            const response = await fetch('/api/cities');
            const data = await response.json();
            cities = data.cities;
          } catch (error) {
            console.error('Failed to load cities:', error);
            cities = []; // Fallback to empty array
          }
        }

        // Populate city selector dropdowns
        function populateCitySelectors() {
          const selectors = ['citySelectOverview', 'citySelectFlows', 'citySelectIntegration', 'citySelectAnalytics'];
          
          selectors.forEach(selectorId => {
            const selector = document.getElementById(selectorId);
            selector.innerHTML = '<option value="">Select a city...</option>';
            
            cities.forEach(city => {
              const option = document.createElement('option');
              option.value = city.id;
              option.textContent = city.name;
              selector.appendChild(option);
            });
          });
        }

        // Show specific tab
        function showTab(tabName) {
          // Hide all tabs
          document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
          });
          
          // Remove active class from all nav tabs
          document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
          });
          
          // Show selected tab
          document.getElementById(tabName).classList.add('active');
          event.target.classList.add('active');
        }

        // Load migration overview
        async function loadOverview() {
          const cityId = document.getElementById('citySelectOverview').value;
          if (!cityId) return;

          try {
            const [flowsResponse, analyticsResponse] = await Promise.all([
              fetch(\`/api/migration/flows/city/\${cityId}\`),
              fetch(\`/api/migration/analytics/\${cityId}\`)
            ]);
            
            const flowsData = await flowsResponse.json();
            const analyticsData = await analyticsResponse.json();
            
            displayOverview(flowsData, analyticsData, cityId);
          } catch (error) {
            document.getElementById('overviewContent').innerHTML = '<div class="error">Failed to load migration overview</div>';
          }
        }

        // Display migration overview
        function displayOverview(flowsData, analytics, cityId) {
          const city = cities.find(c => c.id === cityId);
          const cityName = city ? city.name : cityId;
          
          const html = \`
            <div class="grid">
              <div class="card">
                <h3><span class="card-icon">📊</span>Migration Summary - \${cityName}</h3>
                <div class="metric">
                  <span class="metric-label">Total Migration Flows</span>
                  <span class="metric-value">\${flowsData.total}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Inflows</span>
                  <span class="metric-value">\${flowsData.inflows}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Outflows</span>
                  <span class="metric-value">\${flowsData.outflows}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Net Migration</span>
                  <span class="metric-value">\${analytics.flowAnalytics.netMigration.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Migration Rate</span>
                  <span class="metric-value">\${analytics.flowAnalytics.migrationRate.toFixed(2)} per 1000</span>
                </div>
              </div>

              <div class="card">
                <h3><span class="card-icon">🎯</span>Integration Performance</h3>
                <div class="metric">
                  <span class="metric-label">Average Integration Score</span>
                  <span class="metric-value">\${analytics.integrationAnalytics.averageIntegrationScore.toFixed(1)}/100</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: \${analytics.integrationAnalytics.averageIntegrationScore}%"></div>
                </div>
                <div class="metric">
                  <span class="metric-label">Integration Success Rate</span>
                  <span class="metric-value">\${analytics.integrationAnalytics.integrationSuccessRate.toFixed(1)}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Economic Integration</span>
                  <span class="metric-value">\${analytics.integrationAnalytics.economicIntegrationAvg.toFixed(1)}/100</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Social Integration</span>
                  <span class="metric-value">\${analytics.integrationAnalytics.socialIntegrationAvg.toFixed(1)}/100</span>
                </div>
              </div>

              <div class="card">
                <h3><span class="card-icon">💰</span>Economic Impact</h3>
                <div class="metric">
                  <span class="metric-label">Labor Force Contribution</span>
                  <span class="metric-value">\${analytics.economicImpact.laborForceContribution.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Tax Contribution</span>
                  <span class="metric-value">$\${analytics.economicImpact.taxContribution.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Remittance Outflows</span>
                  <span class="metric-value">$\${analytics.economicImpact.remittanceOutflows.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Services Cost</span>
                  <span class="metric-value">$\${analytics.economicImpact.servicesCost.toLocaleString()}</span>
                </div>
              </div>

              <div class="card">
                <h3><span class="card-icon">🤝</span>Social Impact</h3>
                <div class="metric">
                  <span class="metric-label">Cultural Diversity</span>
                  <span class="metric-value">\${analytics.socialImpact.culturalDiversity}/100</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Social Cohesion</span>
                  <span class="metric-value">\${analytics.socialImpact.socialCohesion.toFixed(1)}/100</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Community Vitality</span>
                  <span class="metric-value">\${analytics.socialImpact.communityVitality.toFixed(1)}/100</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Discrimination Reports</span>
                  <span class="metric-value">\${analytics.socialImpact.discriminationReports}</span>
                </div>
              </div>
            </div>
          \`;

          document.getElementById('overviewContent').innerHTML = html;
        }

        // Load migration flows
        async function loadMigrationFlows() {
          const cityId = document.getElementById('citySelectFlows').value;
          if (!cityId) return;

          try {
            const response = await fetch(\`/api/migration/flows/city/\${cityId}\`);
            const data = await response.json();
            displayMigrationFlows(data);
          } catch (error) {
            document.getElementById('flowsContent').innerHTML = '<div class="error">Failed to load migration flows</div>';
          }
        }

        // Display migration flows
        function displayMigrationFlows(data) {
          const html = \`
            <div class="card">
              <h3><span class="card-icon">🌊</span>Migration Flows - \${data.cityId}</h3>
              <p>Total Flows: \${data.total} | Inflows: \${data.inflows} | Outflows: \${data.outflows}</p>
              
              \${data.flows.map(flow => \`
                <div class="flow-item">
                  <div class="flow-details">
                    <strong>\${flow.type.toUpperCase()}: \${flow.subtype.replace(/_/g, ' ')}</strong>
                    <div>
                      <span class="flow-badge">\${flow.populationSize.toLocaleString()} people</span>
                      <span class="legal-badge legal-\${flow.legalStatus}">\${flow.legalStatus.replace(/_/g, ' ')}</span>
                    </div>
                    <small>From: \${flow.originCountry || flow.originCityId || 'Unknown'}</small>
                    <br><small>Started: \${new Date(flow.startDate).toLocaleDateString()}</small>
                  </div>
                  <div class="flow-stats">
                    <div><strong>Status</strong></div>
                    <div><span class="status-indicator status-\${flow.status}"></span>\${flow.status}</div>
                    <div><small>Doc Level: \${flow.documentationLevel.toFixed(0)}%</small></div>
                  </div>
                </div>
              \`).join('')}
            </div>
          \`;

          document.getElementById('flowsContent').innerHTML = html;
        }

        // Load all policies
        async function loadAllPolicies() {
          try {
            const response = await fetch('/api/migration/policies');
            const data = await response.json();
            policies = data.policies;
            displayPolicies(data);
          } catch (error) {
            document.getElementById('policiesContent').innerHTML = '<div class="error">Failed to load policies</div>';
          }
        }

        // Display immigration policies
        function displayPolicies(data) {
          const html = \`
            <div class="card">
              <h3><span class="card-icon">📋</span>Immigration Policies</h3>
              <p>Total Policies: \${data.total} | Active: \${data.policies.filter(p => p.status === 'active').length}</p>
              
              \${data.policies.map(policy => \`
                <div class="policy-item">
                  <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                      <strong>\${policy.name}</strong>
                      <div class="flow-badge">\${policy.type.replace(/_/g, ' ')}</div>
                      <p style="margin: 8px 0; color: #6c757d;">\${policy.description}</p>
                      <div>
                        <small><strong>Target Groups:</strong> \${policy.targetGroups.join(', ')}</small><br>
                        <small><strong>Enforcement:</strong> \${policy.enforcementLevel}% | <strong>Public Support:</strong> \${policy.publicSupport}%</small><br>
                        <small><strong>Annual Cost:</strong> $\${policy.annualOperatingCost.toLocaleString()}</small>
                      </div>
                    </div>
                    <div style="text-align: right;">
                      <div><span class="status-indicator status-\${policy.status}"></span>\${policy.status}</div>
                      <small>Since: \${new Date(policy.implementationDate).getFullYear()}</small>
                    </div>
                  </div>
                  <div style="margin-top: 10px;">
                    <strong>Effects:</strong>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 5px;">
                      <span class="flow-badge">Flow: \${policy.effects.flowMultiplier}x</span>
                      <span class="flow-badge">Legal Pathways: \${policy.effects.legalPathwayStrength}%</span>
                      <span class="flow-badge">Integration Support: \${policy.effects.integrationSupport}%</span>
                      <span class="flow-badge">Economic Impact: \${policy.effects.economicImpact > 0 ? '+' : ''}\${policy.effects.economicImpact}</span>
                    </div>
                  </div>
                </div>
              \`).join('')}
            </div>
          \`;

          document.getElementById('policiesContent').innerHTML = html;
        }

        // Load integration outcomes
        async function loadIntegrationOutcomes() {
          const cityId = document.getElementById('citySelectIntegration').value;
          if (!cityId) return;

          try {
            const response = await fetch(\`/api/migration/integration/\${cityId}\`);
            const data = await response.json();
            displayIntegrationOutcomes(data);
          } catch (error) {
            document.getElementById('integrationContent').innerHTML = '<div class="error">Failed to load integration outcomes</div>';
          }
        }

        // Display integration outcomes
        function displayIntegrationOutcomes(data) {
          const city = cities.find(c => c.id === data.cityId);
          const cityName = city ? city.name : data.cityId;
          
          const html = \`
            <div class="grid">
              <div class="card">
                <h3><span class="card-icon">📈</span>Integration Summary - \${cityName}</h3>
                <div class="metric">
                  <span class="metric-label">Total Migrants</span>
                  <span class="metric-value">\${data.summary.totalMigrants}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Average Integration Score</span>
                  <span class="metric-value">\${data.summary.averageIntegrationScore.toFixed(1)}/100</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: \${data.summary.averageIntegrationScore}%"></div>
                </div>
                <div class="metric">
                  <span class="metric-label">Success Rate</span>
                  <span class="metric-value">\${data.summary.successRate.toFixed(1)}%</span>
                </div>
                
                <div style="margin-top: 15px;">
                  <strong>Integration Stage Distribution:</strong>
                  \${Object.entries(data.summary.stageDistribution).map(([stage, count]) => \`
                    <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                      <span class="integration-stage stage-\${stage}">\${stage.replace(/_/g, ' ')}</span>
                      <span>\${count}</span>
                    </div>
                  \`).join('')}
                </div>
              </div>

              <div class="card">
                <h3><span class="card-icon">👥</span>Individual Outcomes</h3>
                \${data.outcomes.slice(0, 5).map(outcome => \`
                  <div class="flow-item">
                    <div class="flow-details">
                      <strong>Migrant \${outcome.id.slice(-8)}</strong>
                      <div>
                        <span class="integration-stage stage-\${outcome.integrationStage}">\${outcome.integrationStage.replace(/_/g, ' ')}</span>
                      </div>
                      <small>Time in destination: \${outcome.timeInDestination} months</small>
                    </div>
                    <div class="flow-stats">
                      <div><strong>Integration</strong></div>
                      <div>Economic: \${((outcome.economicIntegration.employmentRate + outcome.economicIntegration.socialMobility) / 2).toFixed(0)}%</div>
                      <div>Social: \${((outcome.socialIntegration.languageProficiency + outcome.socialIntegration.culturalAdaptation) / 2).toFixed(0)}%</div>
                    </div>
                  </div>
                \`).join('')}
                \${data.outcomes.length > 5 ? \`<p><em>... and \${data.outcomes.length - 5} more migrants</em></p>\` : ''}
              </div>
            </div>
          \`;

          document.getElementById('integrationContent').innerHTML = html;
        }

        // Load migration analytics
        async function loadMigrationAnalytics() {
          const cityId = document.getElementById('citySelectAnalytics').value;
          if (!cityId) return;

          try {
            const timeframe = document.getElementById('timeframeSelect').value;
            const response = await fetch(\`/api/migration/analytics/\${cityId}?timeframe=\${timeframe}\`);
            const analytics = await response.json();
            displayMigrationAnalytics(analytics);
          } catch (error) {
            document.getElementById('analyticsContent').innerHTML = '<div class="error">Failed to load migration analytics</div>';
          }
        }

        // Display migration analytics
        function displayMigrationAnalytics(analytics) {
          const city = cities.find(c => c.id === analytics.cityId);
          const cityName = city ? city.name : analytics.cityId;
          
          const html = \`
            <div class="analytics-grid">
              <div class="chart-container">
                <h4>📊 Flow Analytics - \${cityName}</h4>
                <div class="metric">
                  <span class="metric-label">Total Inflows</span>
                  <span class="metric-value">\${analytics.flowAnalytics.totalInflows.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Total Outflows</span>
                  <span class="metric-value">\${analytics.flowAnalytics.totalOutflows.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Net Migration</span>
                  <span class="metric-value">\${analytics.flowAnalytics.netMigration.toLocaleString()}</span>
                </div>
                
                <div style="margin-top: 15px;">
                  <strong>Flows by Type:</strong>
                  \${Object.entries(analytics.flowAnalytics.flowsByType).map(([type, count]) => \`
                    <div class="metric">
                      <span class="metric-label">\${type}</span>
                      <span class="metric-value">\${count}</span>
                    </div>
                  \`).join('')}
                </div>
              </div>

              <div class="chart-container">
                <h4>🎯 Integration Analytics</h4>
                <div class="metric">
                  <span class="metric-label">Average Score</span>
                  <span class="metric-value">\${analytics.integrationAnalytics.averageIntegrationScore.toFixed(1)}/100</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Success Rate</span>
                  <span class="metric-value">\${analytics.integrationAnalytics.integrationSuccessRate.toFixed(1)}%</span>
                </div>
                
                <div style="margin-top: 15px;">
                  <strong>Integration by Stage:</strong>
                  \${Object.entries(analytics.integrationAnalytics.integrationByStage).map(([stage, count]) => \`
                    <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                      <span class="integration-stage stage-\${stage}">\${stage.replace(/_/g, ' ')}</span>
                      <span>\${count}</span>
                    </div>
                  \`).join('')}
                </div>
              </div>

              <div class="chart-container">
                <h4>💼 Economic Impact</h4>
                <div class="metric">
                  <span class="metric-label">Labor Contribution</span>
                  <span class="metric-value">\${analytics.economicImpact.laborForceContribution.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Tax Revenue</span>
                  <span class="metric-value">$\${analytics.economicImpact.taxContribution.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Entrepreneurship</span>
                  <span class="metric-value">\${analytics.economicImpact.entrepreneurshipImpact.toFixed(1)}</span>
                </div>
              </div>

              <div class="chart-container">
                <h4>🏛️ Policy Effectiveness</h4>
                <div class="metric">
                  <span class="metric-label">Active Policies</span>
                  <span class="metric-value">\${analytics.policyEffectiveness.activePolicies}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Compliance Rate</span>
                  <span class="metric-value">\${analytics.policyEffectiveness.policyComplianceRate.toFixed(1)}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Impact Score</span>
                  <span class="metric-value">\${analytics.policyEffectiveness.policyImpactScore.toFixed(1)}/100</span>
                </div>
              </div>
            </div>
          \`;

          document.getElementById('analyticsContent').innerHTML = html;
        }

        // Simulate migration system
        async function simulateMigration() {
          try {
            const response = await fetch('/api/migration/simulate', {
              method: 'POST'
            });
            const data = await response.json();
            
            if (response.ok) {
              displaySimulationResults(data);
              
              // Refresh other tabs if they're loaded
              if (document.getElementById('citySelectOverview').value) {
                loadOverview();
              }
            } else {
              throw new Error(data.message);
            }
          } catch (error) {
            document.getElementById('simulationContent').innerHTML = 
              \`<div class="error">Failed to simulate migration: \${error.message}</div>\`;
          }
        }

        // Display simulation results
        function displaySimulationResults(data) {
          const html = \`
            <div class="card">
              <h3><span class="card-icon">⚡</span>Migration Simulation Results</h3>
              <div class="success">Simulation completed successfully!</div>
              
              <div class="metric">
                <span class="metric-label">Timestamp</span>
                <span class="metric-value">\${new Date(data.timestamp).toLocaleString()}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Active Flows</span>
                <span class="metric-value">\${data.activeFlows}</span>
              </div>
              
              <div style="margin-top: 20px;">
                <strong>Recent Events:</strong>
                \${data.recentEvents.map(event => \`
                  <div class="flow-item">
                    <div class="flow-details">
                      <strong>\${event.type.replace(/_/g, ' ').toUpperCase()}</strong>
                      <p>\${event.description}</p>
                      <small>Severity: \${event.severity} | Affected Cities: \${event.affectedCities.length}</small>
                    </div>
                    <div class="flow-stats">
                      <small>\${new Date(event.timestamp).toLocaleString()}</small>
                    </div>
                  </div>
                \`).join('')}
              </div>
            </div>
          \`;

          document.getElementById('simulationContent').innerHTML = html;
        }

        // Load simulation data
        async function loadSimulationData() {
          try {
            const [eventsResponse, flowsResponse] = await Promise.all([
              fetch('/api/migration/events?limit=10'),
              fetch('/api/migration/flows')
            ]);
            
            const eventsData = await eventsResponse.json();
            const flowsData = await flowsResponse.json();
            
            const html = \`
              <div class="grid">
                <div class="card">
                  <h3><span class="card-icon">📊</span>System Status</h3>
                  <div class="metric">
                    <span class="metric-label">Total Migration Flows</span>
                    <span class="metric-value">\${flowsData.total}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Active Flows</span>
                    <span class="metric-value">\${flowsData.flows.filter(f => f.status === 'active').length}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Total Migrants</span>
                    <span class="metric-value">\${flowsData.flows.reduce((sum, f) => sum + f.populationSize, 0).toLocaleString()}</span>
                  </div>
                </div>

                <div class="card">
                  <h3><span class="card-icon">⚡</span>Recent Events</h3>
                  \${eventsData.events.slice(0, 3).map(event => \`
                    <div class="flow-item">
                      <div class="flow-details">
                        <strong>\${event.type.replace(/_/g, ' ')}</strong>
                        <p>\${event.description}</p>
                        <small>Severity: \${event.severity}</small>
                      </div>
                      <div class="flow-stats">
                        <small>\${new Date(event.timestamp).toLocaleDateString()}</small>
                      </div>
                    </div>
                  \`).join('')}
                </div>
              </div>
            \`;

            document.getElementById('simulationContent').innerHTML = html;
          } catch (error) {
            document.getElementById('simulationContent').innerHTML = '<div class="error">Failed to load simulation data</div>';
          }
        }

        // Load all flows
        async function loadAllFlows() {
          try {
            const response = await fetch('/api/migration/flows');
            const data = await response.json();
            displayMigrationFlows(data);
          } catch (error) {
            document.getElementById('flowsContent').innerHTML = '<div class="error">Failed to load all flows</div>';
          }
        }

        // Load overview for all cities
        async function loadAllOverview() {
          try {
            const response = await fetch('/api/migration/flows');
            const flowsData = await response.json();
            
            const html = \`
              <div class="card">
                <h3><span class="card-icon">🌍</span>Global Migration Overview</h3>
                <div class="metric">
                  <span class="metric-label">Total Migration Flows</span>
                  <span class="metric-value">\${flowsData.total}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Total Migrants</span>
                  <span class="metric-value">\${flowsData.flows.reduce((sum, f) => sum + f.populationSize, 0).toLocaleString()}</span>
                </div>
                
                <div style="margin-top: 20px;">
                  <strong>Flows by Type:</strong>
                  \${Object.entries(
                    flowsData.flows.reduce((acc, flow) => {
                      acc[flow.type] = (acc[flow.type] || 0) + flow.populationSize;
                      return acc;
                    }, {})
                  ).map(([type, count]) => \`
                    <div class="metric">
                      <span class="metric-label">\${type}</span>
                      <span class="metric-value">\${count.toLocaleString()}</span>
                    </div>
                  \`).join('')}
                </div>
                
                <div style="margin-top: 20px;">
                  <strong>Flows by Legal Status:</strong>
                  \${Object.entries(
                    flowsData.flows.reduce((acc, flow) => {
                      acc[flow.legalStatus] = (acc[flow.legalStatus] || 0) + flow.populationSize;
                      return acc;
                    }, {})
                  ).map(([status, count]) => \`
                    <div class="metric">
                      <span class="metric-label">\${status.replace(/_/g, ' ')}</span>
                      <span class="metric-value">\${count.toLocaleString()}</span>
                    </div>
                  \`).join('')}
                </div>
              </div>
            \`;

            document.getElementById('overviewContent').innerHTML = html;
          } catch (error) {
            document.getElementById('overviewContent').innerHTML = '<div class="error">Failed to load global overview</div>';
          }
        }

        // Create new migration flow (simplified for demo)
        function createNewFlow() {
          const destinationCity = prompt('Enter destination city ID (or select from dropdown):');
          if (!destinationCity) return;

          const populationSize = parseInt(prompt('Enter population size:') || '100');
          const originCountry = prompt('Enter origin country:') || 'Unknown';

          const flowData = {
            type: 'immigration',
            subtype: 'economic',
            originCountry: originCountry,
            destinationCityId: destinationCity,
            populationSize: populationSize,
            legalStatus: 'documented'
          };

          fetch('/api/migration/flows', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(flowData)
          })
          .then(response => response.json())
          .then(data => {
            if (data.id) {
              alert('Migration flow created successfully!');
              loadMigrationFlows();
            } else {
              alert('Failed to create migration flow');
            }
          })
          .catch(error => {
            alert('Error creating migration flow: ' + error.message);
          });
        }

        // Create new policy (simplified for demo)
        function createNewPolicy() {
          const name = prompt('Enter policy name:');
          if (!name) return;

          const description = prompt('Enter policy description:') || 'New immigration policy';
          const type = prompt('Enter policy type (quota, points_system, family_reunification, refugee):') || 'quota';

          const policyData = {
            name: name,
            description: description,
            type: type,
            effects: {
              flowMultiplier: 1.2,
              legalPathwayStrength: 75,
              illegalFlowReduction: 25,
              integrationSupport: 60,
              economicImpact: 10,
              socialCohesion: 5
            },
            targetGroups: ['economic'],
            enforcementLevel: 75,
            publicSupport: 60,
            implementationCost: 1000000,
            annualOperatingCost: 500000
          };

          fetch('/api/migration/policies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(policyData)
          })
          .then(response => response.json())
          .then(data => {
            if (data.id) {
              alert('Immigration policy created successfully!');
              loadAllPolicies();
            } else {
              alert('Failed to create immigration policy');
            }
          })
          .catch(error => {
            alert('Error creating policy: ' + error.message);
          });
        }

        // Initialize the demo when page loads
        init();
      </script>
    </body>
    </html>
  `;

  res.send(html);
});

export default router;
