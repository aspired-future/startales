/**
 * City Specialization & Geography Engine Demo
 * 
 * Interactive web interface for exploring city development, specializations,
 * infrastructure management, and economic analysis.
 */

import express from 'express';

const router = express.Router();

/**
 * Main city demo page
 */
router.get('/demo/cities', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>City Specialization & Geography Engine Demo</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          border-bottom: 3px solid #667eea;
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
        }
        .nav-tab {
          flex: 1;
          padding: 15px 20px;
          text-align: center;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          color: #6c757d;
          transition: all 0.3s ease;
        }
        .nav-tab.active {
          background: #667eea;
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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
          background: #667eea;
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
          background: #5a67d8;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(90, 103, 216, 0.4);
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
        .status-healthy { background: #28a745; }
        .status-warning { background: #ffc107; }
        .status-critical { background: #dc3545; }
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
          background: linear-gradient(90deg, #667eea, #764ba2);
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
        .specialization-badge {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin: 2px;
        }
        .infrastructure-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
          margin: 5px 0;
        }
        .level-indicator {
          display: flex;
          gap: 2px;
        }
        .level-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e9ecef;
        }
        .level-dot.filled {
          background: #28a745;
        }
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        .comparison-table th,
        .comparison-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }
        .comparison-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }
        .winner {
          font-weight: 700;
          color: #28a745;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏙️ City Specialization & Geography Engine</h1>
          <p>Explore realistic city development with economic specializations, infrastructure systems, and geographic advantages. Watch cities evolve, develop unique characteristics, and compete in dynamic urban ecosystems.</p>
        </div>

        <div class="nav-tabs">
          <button class="nav-tab active" onclick="showTab('overview')">City Overview</button>
          <button class="nav-tab" onclick="showTab('specializations')">Specializations</button>
          <button class="nav-tab" onclick="showTab('infrastructure')">Infrastructure</button>
          <button class="nav-tab" onclick="showTab('analytics')">Analytics</button>
          <button class="nav-tab" onclick="showTab('comparison')">City Comparison</button>
        </div>

        <!-- City Overview Tab -->
        <div id="overview" class="tab-content active">
          <div class="city-selector">
            <label for="citySelect">Select City: </label>
            <select id="citySelect" onchange="loadCityData()">
              <option value="">Loading cities...</option>
            </select>
            <button class="btn" onclick="simulateCity()">Simulate Month</button>
            <button class="btn btn-secondary" onclick="createNewCity()">Create New City</button>
          </div>

          <div id="cityOverview" class="loading">
            <p>Select a city to view details...</p>
          </div>
        </div>

        <!-- Specializations Tab -->
        <div id="specializations" class="tab-content">
          <div class="city-selector">
            <select id="citySelectSpec" onchange="loadSpecializations()">
              <option value="">Select a city...</option>
            </select>
          </div>

          <div id="specializationContent" class="loading">
            <p>Select a city to view specialization options...</p>
          </div>
        </div>

        <!-- Infrastructure Tab -->
        <div id="infrastructure" class="tab-content">
          <div class="city-selector">
            <select id="citySelectInfra" onchange="loadInfrastructure()">
              <option value="">Select a city...</option>
            </select>
          </div>

          <div id="infrastructureContent" class="loading">
            <p>Select a city to view infrastructure...</p>
          </div>
        </div>

        <!-- Analytics Tab -->
        <div id="analytics" class="tab-content">
          <div class="city-selector">
            <select id="citySelectAnalytics" onchange="loadAnalytics()">
              <option value="">Select a city...</option>
            </select>
          </div>

          <div id="analyticsContent" class="loading">
            <p>Select a city to view analytics...</p>
          </div>
        </div>

        <!-- Comparison Tab -->
        <div id="comparison" class="tab-content">
          <div class="city-selector">
            <label for="cityA">City A: </label>
            <select id="cityA">
              <option value="">Select first city...</option>
            </select>
            <label for="cityB">City B: </label>
            <select id="cityB">
              <option value="">Select second city...</option>
            </select>
            <button class="btn" onclick="compareCities()">Compare Cities</button>
          </div>

          <div id="comparisonContent" class="loading">
            <p>Select two cities to compare...</p>
          </div>
        </div>
      </div>

      <script>
        let cities = [];
        let currentCity = null;

        // Initialize the demo
        async function init() {
          await loadCities();
          populateCitySelectors();
        }

        // Load all cities
        async function loadCities() {
          try {
            const response = await fetch('/api/cities');
            const data = await response.json();
            cities = data.cities;
          } catch (error) {
            console.error('Failed to load cities:', error);
          }
        }

        // Populate city selector dropdowns
        function populateCitySelectors() {
          const selectors = ['citySelect', 'citySelectSpec', 'citySelectInfra', 'citySelectAnalytics', 'cityA', 'cityB'];
          
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

        // Load city data for overview
        async function loadCityData() {
          const cityId = document.getElementById('citySelect').value;
          if (!cityId) return;

          try {
            const response = await fetch(\`/api/cities/\${cityId}\`);
            currentCity = await response.json();
            displayCityOverview(currentCity);
          } catch (error) {
            document.getElementById('cityOverview').innerHTML = '<div class="error">Failed to load city data</div>';
          }
        }

        // Display city overview
        function displayCityOverview(city) {
          const formatNumber = (num) => num.toLocaleString();
          const formatCurrency = (num) => '$' + num.toLocaleString();
          const formatPercent = (num) => (num * 100).toFixed(1) + '%';

          const html = \`
            <div class="grid">
              <div class="card">
                <h3><span class="card-icon">🏙️</span>Basic Information</h3>
                <div class="metric">
                  <span class="metric-label">Population</span>
                  <span class="metric-value">\${formatNumber(city.population)}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Founded</span>
                  <span class="metric-value">\${new Date(city.founded).getFullYear()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Climate</span>
                  <span class="metric-value">\${city.climate}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Terrain</span>
                  <span class="metric-value">\${city.terrain}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Size</span>
                  <span class="metric-value">\${city.size} km²</span>
                </div>
              </div>

              <div class="card">
                <h3><span class="card-icon">💰</span>Economy</h3>
                <div class="metric">
                  <span class="metric-label">Economic Output</span>
                  <span class="metric-value">\${formatCurrency(city.economicOutput)}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">GDP per Capita</span>
                  <span class="metric-value">\${formatCurrency(city.economicOutput / city.population)}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Average Income</span>
                  <span class="metric-value">\${formatCurrency(city.averageIncome)}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Unemployment Rate</span>
                  <span class="metric-value">\${formatPercent(city.unemploymentRate)}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Tax Rate</span>
                  <span class="metric-value">\${formatPercent(city.taxRate)}</span>
                </div>
              </div>

              <div class="card">
                <h3><span class="card-icon">🏆</span>Quality & Development</h3>
                <div class="metric">
                  <span class="metric-label">Quality of Life</span>
                  <span class="metric-value">\${city.qualityOfLife}/100</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: \${city.qualityOfLife}%"></div>
                </div>
                <div class="metric">
                  <span class="metric-label">Attractiveness</span>
                  <span class="metric-value">\${city.attractiveness}/100</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: \${city.attractiveness}%"></div>
                </div>
                <div class="metric">
                  <span class="metric-label">Sustainability</span>
                  <span class="metric-value">\${city.sustainability}/100</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: \${city.sustainability}%"></div>
                </div>
              </div>

              <div class="card">
                <h3><span class="card-icon">🎯</span>Specialization</h3>
                \${city.currentSpecialization ? \`
                  <div class="specialization-badge">\${city.currentSpecialization.replace(/_/g, ' ')}</div>
                  <div class="metric">
                    <span class="metric-label">Progress</span>
                    <span class="metric-value">\${city.specializationProgress.toFixed(1)}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: \${city.specializationProgress}%"></div>
                  </div>
                \` : '<p>No current specialization</p>'}
              </div>

              <div class="card">
                <h3><span class="card-icon">🌍</span>Geographic Advantages</h3>
                \${city.geographicAdvantages.length > 0 ? 
                  city.geographicAdvantages.map(advantage => 
                    \`<div class="specialization-badge">\${advantage.replace(/_/g, ' ')}</div>\`
                  ).join('') : 
                  '<p>No geographic advantages</p>'
                }
              </div>

              <div class="card">
                <h3><span class="card-icon">🏛️</span>Government</h3>
                <div class="metric">
                  <span class="metric-label">Budget</span>
                  <span class="metric-value">\${formatCurrency(city.governmentBudget)}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Debt</span>
                  <span class="metric-value">\${formatCurrency(city.governmentDebt)}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Infrastructure Budget</span>
                  <span class="metric-value">\${formatCurrency(city.infrastructureBudget)}</span>
                </div>
              </div>
            </div>
          \`;

          document.getElementById('cityOverview').innerHTML = html;
        }

        // Simulate city for one time step
        async function simulateCity() {
          const cityId = document.getElementById('citySelect').value;
          if (!cityId) {
            alert('Please select a city first');
            return;
          }

          try {
            const response = await fetch(\`/api/cities/\${cityId}/simulate\`, {
              method: 'POST'
            });
            const data = await response.json();
            
            if (response.ok) {
              currentCity = data.city;
              displayCityOverview(currentCity);
              
              // Update cities array
              const cityIndex = cities.findIndex(c => c.id === cityId);
              if (cityIndex !== -1) {
                cities[cityIndex] = currentCity;
              }
              
              document.getElementById('cityOverview').insertAdjacentHTML('afterbegin', 
                '<div class="success">City simulation completed successfully!</div>'
              );
            } else {
              throw new Error(data.message);
            }
          } catch (error) {
            document.getElementById('cityOverview').insertAdjacentHTML('afterbegin', 
              \`<div class="error">Failed to simulate city: \${error.message}</div>\`
            );
          }
        }

        // Load specializations for selected city
        async function loadSpecializations() {
          const cityId = document.getElementById('citySelectSpec').value;
          if (!cityId) return;

          try {
            const [availableResponse, allResponse] = await Promise.all([
              fetch(\`/api/cities/\${cityId}/specializations/available\`),
              fetch('/api/cities/specializations/all')
            ]);
            
            const availableData = await availableResponse.json();
            const allData = await allResponse.json();
            
            displaySpecializations(availableData.availableSpecializations, allData.specializations, cityId);
          } catch (error) {
            document.getElementById('specializationContent').innerHTML = '<div class="error">Failed to load specializations</div>';
          }
        }

        // Display specializations
        function displaySpecializations(available, all, cityId) {
          const html = \`
            <div class="grid">
              <div class="card">
                <h3><span class="card-icon">✅</span>Available Specializations</h3>
                \${available.length > 0 ? available.map(spec => \`
                  <div class="infrastructure-item">
                    <div>
                      <strong>\${spec.name}</strong>
                      <p>\${spec.description}</p>
                      <small>Required Population: \${spec.requiredPopulation.toLocaleString()}</small>
                    </div>
                    <button class="btn btn-success" onclick="developSpecialization('\${cityId}', '\${spec.id}')">
                      Develop
                    </button>
                  </div>
                \`).join('') : '<p>No specializations available for this city yet.</p>'}
              </div>

              <div class="card">
                <h3><span class="card-icon">📋</span>All Specializations</h3>
                \${all.map(spec => \`
                  <div class="infrastructure-item">
                    <div>
                      <strong>\${spec.name}</strong>
                      <p>\${spec.description}</p>
                      <small>Required Population: \${spec.requiredPopulation.toLocaleString()}</small>
                      <div>
                        \${spec.primaryIndustries.map(industry => 
                          \`<span class="specialization-badge">\${industry}</span>\`
                        ).join('')}
                      </div>
                    </div>
                  </div>
                \`).join('')}
              </div>
            </div>
          \`;

          document.getElementById('specializationContent').innerHTML = html;
        }

        // Develop specialization
        async function developSpecialization(cityId, specializationId) {
          try {
            const response = await fetch(\`/api/cities/\${cityId}/specializations/\${specializationId}\`, {
              method: 'POST'
            });
            const data = await response.json();
            
            if (response.ok) {
              document.getElementById('specializationContent').insertAdjacentHTML('afterbegin', 
                '<div class="success">Specialization development started!</div>'
              );
              loadSpecializations(); // Refresh the view
            } else {
              throw new Error(data.message);
            }
          } catch (error) {
            document.getElementById('specializationContent').insertAdjacentHTML('afterbegin', 
              \`<div class="error">Failed to develop specialization: \${error.message}</div>\`
            );
          }
        }

        // Load infrastructure for selected city
        async function loadInfrastructure() {
          const cityId = document.getElementById('citySelectInfra').value;
          if (!cityId) return;

          try {
            const response = await fetch(\`/api/cities/\${cityId}/infrastructure\`);
            const data = await response.json();
            displayInfrastructure(data, cityId);
          } catch (error) {
            document.getElementById('infrastructureContent').innerHTML = '<div class="error">Failed to load infrastructure</div>';
          }
        }

        // Display infrastructure
        function displayInfrastructure(data, cityId) {
          const html = \`
            <div class="grid">
              <div class="card">
                <h3><span class="card-icon">📊</span>Infrastructure Overview</h3>
                <div class="metric">
                  <span class="metric-label">Total Infrastructure</span>
                  <span class="metric-value">\${data.totalInfrastructure}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Average Level</span>
                  <span class="metric-value">\${data.averageLevel.toFixed(1)}/10</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Total Maintenance Cost</span>
                  <span class="metric-value">$\${data.totalMaintenanceCost.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Infrastructure Budget</span>
                  <span class="metric-value">$\${data.infrastructureBudget.toLocaleString()}</span>
                </div>
              </div>

              <div class="card">
                <h3><span class="card-icon">🏗️</span>Infrastructure Details</h3>
                \${data.infrastructure.map(infra => \`
                  <div class="infrastructure-item">
                    <div>
                      <strong>\${infra.name}</strong>
                      <div class="level-indicator">
                        \${Array.from({length: 10}, (_, i) => 
                          \`<div class="level-dot \${i < infra.level ? 'filled' : ''}"></div>\`
                        ).join('')}
                      </div>
                      <small>Level \${infra.level}/10 | Capacity: \${infra.capacity.toLocaleString()}</small>
                      \${infra.upgradeRecommended ? '<br><small style="color: #ffc107;">⚠️ Upgrade Recommended</small>' : ''}
                    </div>
                    <button class="btn btn-warning" onclick="upgradeInfrastructure('\${cityId}', '\${infra.id}')">
                      Upgrade
                    </button>
                  </div>
                \`).join('')}
              </div>
            </div>
          \`;

          document.getElementById('infrastructureContent').innerHTML = html;
        }

        // Upgrade infrastructure
        async function upgradeInfrastructure(cityId, infrastructureId) {
          try {
            const response = await fetch(\`/api/cities/\${cityId}/infrastructure/\${infrastructureId}\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({})
            });
            const data = await response.json();
            
            if (response.ok) {
              document.getElementById('infrastructureContent').insertAdjacentHTML('afterbegin', 
                '<div class="success">Infrastructure upgraded successfully!</div>'
              );
              loadInfrastructure(); // Refresh the view
            } else {
              throw new Error(data.message);
            }
          } catch (error) {
            document.getElementById('infrastructureContent').insertAdjacentHTML('afterbegin', 
              \`<div class="error">Failed to upgrade infrastructure: \${error.message}</div>\`
            );
          }
        }

        // Load analytics for selected city
        async function loadAnalytics() {
          const cityId = document.getElementById('citySelectAnalytics').value;
          if (!cityId) return;

          try {
            const response = await fetch(\`/api/cities/\${cityId}/analytics\`);
            const analytics = await response.json();
            displayAnalytics(analytics);
          } catch (error) {
            document.getElementById('analyticsContent').innerHTML = '<div class="error">Failed to load analytics</div>';
          }
        }

        // Display analytics
        function displayAnalytics(analytics) {
          const html = \`
            <div class="grid">
              <div class="card">
                <h3><span class="card-icon">💼</span>Economic Health</h3>
                <div class="metric">
                  <span class="metric-label">GDP per Capita</span>
                  <span class="metric-value">$\${analytics.economicHealth.gdpPerCapita.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Economic Growth Rate</span>
                  <span class="metric-value">\${analytics.economicHealth.economicGrowthRate.toFixed(2)}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Industrial Diversification</span>
                  <span class="metric-value">\${analytics.economicHealth.industrialDiversification}/100</span>
                </div>
                <div>
                  <strong>Competitive Advantages:</strong>
                  \${analytics.economicHealth.competitiveAdvantages.map(advantage => 
                    \`<div class="specialization-badge">\${advantage}</div>\`
                  ).join('')}
                </div>
              </div>

              <div class="card">
                <h3><span class="card-icon">🏗️</span>Infrastructure Health</h3>
                <div class="metric">
                  <span class="metric-label">Overall Level</span>
                  <span class="metric-value">\${analytics.infrastructureHealth.overallLevel.toFixed(1)}/100</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Maintenance Backlog</span>
                  <span class="metric-value">$\${analytics.infrastructureHealth.maintenanceBacklog.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Capacity Utilization</span>
                  <span class="metric-value">\${analytics.infrastructureHealth.capacityUtilization.toFixed(1)}%</span>
                </div>
              </div>

              <div class="card">
                <h3><span class="card-icon">👥</span>Social Health</h3>
                <div class="metric">
                  <span class="metric-label">Quality of Life</span>
                  <span class="metric-value">\${analytics.socialHealth.qualityOfLife}/100</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Social Mobility</span>
                  <span class="metric-value">\${analytics.socialHealth.socialMobility.toFixed(1)}/100</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Cultural Vitality</span>
                  <span class="metric-value">\${analytics.socialHealth.culturalVitality.toFixed(1)}/100</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Community Engagement</span>
                  <span class="metric-value">\${analytics.socialHealth.communityEngagement.toFixed(1)}/100</span>
                </div>
              </div>

              <div class="card">
                <h3><span class="card-icon">🎯</span>5-Year Projection</h3>
                <div class="metric">
                  <span class="metric-label">Projected Population</span>
                  <span class="metric-value">\${analytics.fiveYearProjection.projectedPopulation.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Projected GDP</span>
                  <span class="metric-value">$\${analytics.fiveYearProjection.projectedGDP.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Projected Quality of Life</span>
                  <span class="metric-value">\${analytics.fiveYearProjection.projectedQualityOfLife}/100</span>
                </div>
                <div>
                  <strong>Key Opportunities:</strong>
                  \${analytics.fiveYearProjection.keyOpportunities.map(opportunity => 
                    \`<div class="specialization-badge">\${opportunity}</div>\`
                  ).join('')}
                </div>
              </div>
            </div>
          \`;

          document.getElementById('analyticsContent').innerHTML = html;
        }

        // Compare two cities
        async function compareCities() {
          const cityAId = document.getElementById('cityA').value;
          const cityBId = document.getElementById('cityB').value;
          
          if (!cityAId || !cityBId) {
            alert('Please select both cities to compare');
            return;
          }

          try {
            const response = await fetch(\`/api/cities/\${cityAId}/compare/\${cityBId}\`);
            const comparison = await response.json();
            displayComparison(comparison);
          } catch (error) {
            document.getElementById('comparisonContent').innerHTML = '<div class="error">Failed to compare cities</div>';
          }
        }

        // Display city comparison
        function displayComparison(comparison) {
          const html = \`
            <div class="card">
              <h3><span class="card-icon">⚖️</span>City Comparison: \${comparison.cityA.name} vs \${comparison.cityB.name}</h3>
              <p><strong>Overall Winner: \${comparison.winner}</strong></p>
              
              <table class="comparison-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>\${comparison.cityA.name}</th>
                    <th>\${comparison.cityB.name}</th>
                    <th>Winner</th>
                  </tr>
                </thead>
                <tbody>
                  \${comparison.comparison.map(comp => \`
                    <tr>
                      <td>\${comp.metric}</td>
                      <td \${comp.winner === comparison.cityA.name ? 'class="winner"' : ''}>\${comp.cityAValue.toLocaleString()}</td>
                      <td \${comp.winner === comparison.cityB.name ? 'class="winner"' : ''}>\${comp.cityBValue.toLocaleString()}</td>
                      <td class="winner">\${comp.winner}</td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          \`;

          document.getElementById('comparisonContent').innerHTML = html;
        }

        // Create new city (simplified for demo)
        function createNewCity() {
          const name = prompt('Enter city name:');
          if (!name) return;

          const climates = ['temperate', 'tropical', 'arid', 'arctic', 'mediterranean'];
          const terrains = ['plains', 'hills', 'mountains', 'coastal', 'river', 'desert'];
          
          const cityData = {
            name: name,
            coordinates: { 
              x: Math.floor(Math.random() * 300), 
              y: Math.floor(Math.random() * 300) 
            },
            climate: climates[Math.floor(Math.random() * climates.length)],
            terrain: terrains[Math.floor(Math.random() * terrains.length)],
            initialPopulation: Math.floor(Math.random() * 100000) + 25000,
            geographicAdvantages: [],
            naturalResources: {}
          };

          fetch('/api/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cityData)
          })
          .then(response => response.json())
          .then(data => {
            if (data.id) {
              cities.push(data);
              populateCitySelectors();
              document.getElementById('citySelect').value = data.id;
              loadCityData();
              alert('City created successfully!');
            } else {
              alert('Failed to create city');
            }
          })
          .catch(error => {
            alert('Error creating city: ' + error.message);
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
