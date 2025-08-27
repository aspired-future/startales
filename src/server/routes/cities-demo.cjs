function getCitiesDemo() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cities Management System - StarTales Demo</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Roboto', sans-serif;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
      color: #e0e0e0;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 15px;
      border: 1px solid rgba(187, 134, 252, 0.3);
    }

    .header h1 {
      font-family: 'Orbitron', monospace;
      font-size: 2.5rem;
      color: #bb86fc;
      margin-bottom: 10px;
      text-shadow: 0 0 20px rgba(187, 134, 252, 0.5);
    }

    .header p {
      font-size: 1.1rem;
      color: #a0a0a0;
    }

    .controls {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn {
      background: linear-gradient(135deg, #bb86fc 0%, #6200ea 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      font-size: 14px;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(187, 134, 252, 0.4);
    }

    .btn.secondary {
      background: linear-gradient(135deg, #03dac6 0%, #018786 100%);
    }

    .btn.danger {
      background: linear-gradient(135deg, #cf6679 0%, #b00020 100%);
    }

    .dashboard {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }

    @media (max-width: 768px) {
      .dashboard {
        grid-template-columns: 1fr;
      }
    }

    .card {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 15px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .card:hover {
      border-color: rgba(187, 134, 252, 0.5);
      box-shadow: 0 8px 32px rgba(187, 134, 252, 0.2);
    }

    .card h3 {
      color: #bb86fc;
      margin-bottom: 15px;
      font-family: 'Orbitron', monospace;
      font-size: 1.2rem;
    }

    .metric {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .metric:last-child {
      border-bottom: none;
    }

    .metric-label {
      color: #a0a0a0;
    }

    .metric-value {
      color: #03dac6;
      font-weight: 600;
    }

    .cities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .city-card {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 15px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      position: relative;
    }

    .city-card:hover {
      border-color: rgba(187, 134, 252, 0.5);
      transform: translateY(-5px);
      box-shadow: 0 12px 40px rgba(187, 134, 252, 0.2);
    }

    .city-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .city-name {
      font-family: 'Orbitron', monospace;
      font-size: 1.3rem;
      color: #bb86fc;
    }

    .city-status {
      display: flex;
      gap: 5px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-autopilot {
      background: rgba(3, 218, 198, 0.2);
      color: #03dac6;
      border: 1px solid #03dac6;
    }

    .status-player {
      background: rgba(187, 134, 252, 0.2);
      color: #bb86fc;
      border: 1px solid #bb86fc;
    }

    .city-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
    }

    .city-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn-small {
      padding: 6px 12px;
      font-size: 0.8rem;
      border-radius: 6px;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #a0a0a0;
    }

    .error {
      background: rgba(207, 102, 121, 0.2);
      border: 1px solid #cf6679;
      color: #cf6679;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .success {
      background: rgba(3, 218, 198, 0.2);
      border: 1px solid #03dac6;
      color: #03dac6;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .back-link {
      display: inline-block;
      margin-top: 30px;
      color: #03dac6;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .back-link:hover {
      color: #bb86fc;
    }

    .autopilot-controls {
      background: rgba(3, 218, 198, 0.1);
      border: 1px solid rgba(3, 218, 198, 0.3);
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 20px;
    }

    .autopilot-settings {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }

    .setting-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .setting-group label {
      color: #a0a0a0;
      font-size: 0.9rem;
    }

    .setting-group select,
    .setting-group input {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      padding: 8px;
      color: #e0e0e0;
      font-size: 0.9rem;
    }

    .specialization-badge {
      background: rgba(255, 193, 7, 0.2);
      color: #ffc107;
      border: 1px solid #ffc107;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
      margin-top: 5px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #03dac6, #bb86fc);
      transition: width 0.3s ease;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏙️ Cities Management System</h1>
      <p>Galactic Urban Planning & Infrastructure Development</p>
    </div>

    <div class="controls">
      <button class="btn" onclick="loadGalacticOverview()">🌌 Galactic Overview</button>
      <button class="btn secondary" onclick="loadCities()">🏙️ Load Cities</button>
      <button class="btn secondary" onclick="runAllAutopilot()">🤖 Run All Autopilot</button>
      <button class="btn secondary" onclick="simulateAllCities()">⚡ Simulate All Cities</button>
      <button class="btn" onclick="toggleAutopilotSettings()">⚙️ Autopilot Settings</button>
    </div>

    <div id="autopilot-panel" class="autopilot-controls" style="display: none;">
      <h3>🤖 Global Autopilot Settings</h3>
      <div class="autopilot-settings">
        <div class="setting-group">
          <label>Enabled</label>
          <select id="autopilot-enabled">
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>
        <div class="setting-group">
          <label>Aggressiveness</label>
          <select id="autopilot-aggressiveness">
            <option value="conservative">Conservative</option>
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
        <div class="setting-group">
          <label>Priority Focus</label>
          <select id="autopilot-priority">
            <option value="economic">Economic</option>
            <option value="military">Military</option>
            <option value="research">Research</option>
            <option value="balanced">Balanced</option>
          </select>
        </div>
        <div class="setting-group">
          <label>Infrastructure Threshold</label>
          <input type="range" id="autopilot-threshold" min="0.5" max="1.0" step="0.05" value="0.8">
          <span id="threshold-value">80%</span>
        </div>
      </div>
      <div style="margin-top: 15px;">
        <button class="btn" onclick="updateAutopilotSettings()">💾 Save Settings</button>
      </div>
    </div>

    <div id="content">
      <div class="loading">
        <p>🌌 Initializing Cities Management System...</p>
      </div>
    </div>

    <a href="/demo/command-center" class="back-link">← Back to Command Center</a>
  </div>

  <script>
    let citiesData = [];
    let galacticData = null;
    let autopilotSettings = null;

    // Initialize the demo
    document.addEventListener('DOMContentLoaded', function() {
      loadAutopilotSettings();
      loadGalacticOverview();
    });

    async function loadAutopilotSettings() {
      try {
        const response = await fetch('/api/cities/autopilot/settings');
        autopilotSettings = await response.json();
        
        document.getElementById('autopilot-enabled').value = autopilotSettings.enabled.toString();
        document.getElementById('autopilot-aggressiveness').value = autopilotSettings.aggressiveness;
        document.getElementById('autopilot-priority').value = autopilotSettings.priorityFocus;
        document.getElementById('autopilot-threshold').value = autopilotSettings.infrastructureThreshold;
        document.getElementById('threshold-value').textContent = Math.round(autopilotSettings.infrastructureThreshold * 100) + '%';
        
        // Update threshold display when slider changes
        document.getElementById('autopilot-threshold').addEventListener('input', function(e) {
          document.getElementById('threshold-value').textContent = Math.round(e.target.value * 100) + '%';
        });
      } catch (error) {
        console.error('Failed to load autopilot settings:', error);
      }
    }

    async function updateAutopilotSettings() {
      try {
        const settings = {
          enabled: document.getElementById('autopilot-enabled').value === 'true',
          aggressiveness: document.getElementById('autopilot-aggressiveness').value,
          priorityFocus: document.getElementById('autopilot-priority').value,
          infrastructureThreshold: parseFloat(document.getElementById('autopilot-threshold').value)
        };

        const response = await fetch('/api/cities/autopilot/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        });

        const result = await response.json();
        if (result.success) {
          showMessage('Autopilot settings updated successfully!', 'success');
          autopilotSettings = result.settings;
        } else {
          showMessage('Failed to update autopilot settings', 'error');
        }
      } catch (error) {
        showMessage('Error updating autopilot settings: ' + error.message, 'error');
      }
    }

    async function loadGalacticOverview() {
      try {
        showLoading('Loading galactic overview...');
        const response = await fetch('/api/cities/galactic-overview');
        galacticData = await response.json();
        displayGalacticOverview();
      } catch (error) {
        showError('Failed to load galactic overview: ' + error.message);
      }
    }

    async function loadCities() {
      try {
        showLoading('Loading cities data...');
        const response = await fetch('/api/cities');
        const data = await response.json();
        citiesData = data.cities;
        displayCities();
      } catch (error) {
        showError('Failed to load cities: ' + error.message);
      }
    }

    function displayGalacticOverview() {
      if (!galacticData) return;

      const content = document.getElementById('content');
      content.innerHTML = \`
        <div class="dashboard">
          <div class="card">
            <h3>🌌 Empire Statistics</h3>
            <div class="metric">
              <span class="metric-label">Total Cities</span>
              <span class="metric-value">\${galacticData.empireStats.totalCities.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Total Population</span>
              <span class="metric-value">\${galacticData.empireStats.totalPopulation.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Economic Output</span>
              <span class="metric-value">\${galacticData.empireStats.totalEconomicOutput.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Military Strength</span>
              <span class="metric-value">\${galacticData.empireStats.totalMilitaryStrength.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Research Output</span>
              <span class="metric-value">\${galacticData.empireStats.totalResearchOutput.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Trade Value</span>
              <span class="metric-value">\${galacticData.empireStats.totalTradeValue.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Avg Quality of Life</span>
              <span class="metric-value">\${galacticData.empireStats.averageQualityOfLife.toFixed(1)}%</span>
            </div>
          </div>

          <div class="card">
            <h3>🤖 Automation Status</h3>
            <div class="metric">
              <span class="metric-label">Autopilot Cities</span>
              <span class="metric-value">\${galacticData.empireStats.autopilotCities}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Player Controlled</span>
              <span class="metric-value">\${galacticData.empireStats.playerControlledCities}</span>
            </div>
            <div class="metric">
              <span class="metric-label">AI Managed</span>
              <span class="metric-value">\${galacticData.empireStats.totalCities - galacticData.empireStats.playerControlledCities}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Autopilot Status</span>
              <span class="metric-value">\${galacticData.autopilotSettings.enabled ? '✅ Enabled' : '❌ Disabled'}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Priority Focus</span>
              <span class="metric-value">\${galacticData.autopilotSettings.priorityFocus}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Aggressiveness</span>
              <span class="metric-value">\${galacticData.autopilotSettings.aggressiveness}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>🌟 Star Systems Overview</h3>
          <div class="cities-grid">
            \${galacticData.starSystems.map(system => \`
              <div class="city-card">
                <div class="city-header">
                  <div class="city-name">\${system.name}</div>
                  <div class="city-status">
                    <span class="status-badge">\${system.cities} Cities</span>
                  </div>
                </div>
                <div class="city-info">
                  <div class="metric">
                    <span class="metric-label">Type</span>
                    <span class="metric-value">\${system.type}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Planets</span>
                    <span class="metric-value">\${system.planets}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Distance</span>
                    <span class="metric-value">\${system.distanceFromSol} LY</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Strategic Value</span>
                    <span class="metric-value">\${system.strategicValue}</span>
                  </div>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>

        <div class="card">
          <h3>📊 Strategic Importance Breakdown</h3>
          <div class="cities-grid">
            \${Object.entries(galacticData.strategicBreakdown).map(([importance, count]) => \`
              <div class="metric">
                <span class="metric-label">\${importance.charAt(0).toUpperCase() + importance.slice(1)}</span>
                <span class="metric-value">\${count} cities</span>
              </div>
            \`).join('')}
          </div>
        </div>

        <div class="card">
          <h3>🏭 Specialization Breakdown</h3>
          <div class="cities-grid">
            \${Object.entries(galacticData.specializationBreakdown).map(([spec, count]) => \`
              <div class="metric">
                <span class="metric-label">\${spec === 'none' ? 'Unspecialized' : spec.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}</span>
                <span class="metric-value">\${count} cities</span>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    function displayCities() {
      const content = document.getElementById('content');
      content.innerHTML = \`
        <div class="card">
          <h3>🏙️ Cities Overview (\${citiesData.length} cities)</h3>
          <div class="cities-grid">
            \${citiesData.map(city => \`
              <div class="city-card">
                <div class="city-header">
                  <div class="city-name">\${city.name}</div>
                  <div class="city-status">
                    \${city.autopilotEnabled ? '<span class="status-badge status-autopilot">🤖 Auto</span>' : ''}
                    \${city.playerControlled ? '<span class="status-badge status-player">👤 Player</span>' : '<span class="status-badge">🤖 AI</span>'}
                  </div>
                </div>
                
                <div class="city-info">
                  <div class="metric">
                    <span class="metric-label">Population</span>
                    <span class="metric-value">\${city.population.toLocaleString()}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Planet</span>
                    <span class="metric-value">\${city.planet}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">System</span>
                    <span class="metric-value">\${city.starSystem}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Economic Output</span>
                    <span class="metric-value">\${city.economicOutput.toLocaleString()}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Quality of Life</span>
                    <span class="metric-value">\${city.qualityOfLife}%</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Strategic Role</span>
                    <span class="metric-value">\${city.strategicImportance}</span>
                  </div>
                </div>

                \${city.currentSpecialization ? \`
                  <div style="margin: 10px 0;">
                    <span class="specialization-badge">\${city.currentSpecialization.replace(/_/g, ' ')}</span>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: \${city.specializationProgress}%"></div>
                    </div>
                    <small style="color: #a0a0a0;">\${city.specializationProgress}% Complete</small>
                  </div>
                \` : ''}

                <div class="city-actions">
                  <button class="btn btn-small" onclick="toggleCityAutopilot('\${city.id}')">
                    \${city.autopilotEnabled ? '⏸️ Disable' : '▶️ Enable'} Auto
                  </button>
                  <button class="btn btn-small secondary" onclick="togglePlayerControl('\${city.id}')">
                    \${city.playerControlled ? '🤖 AI Control' : '👤 Take Control'}
                  </button>
                  <button class="btn btn-small secondary" onclick="simulateCity('\${city.id}')">⚡ Simulate</button>
                  <button class="btn btn-small" onclick="viewCityDetails('\${city.id}')">📊 Details</button>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    async function toggleCityAutopilot(cityId) {
      try {
        const response = await fetch(\`/api/cities/\${cityId}/autopilot/toggle\`, { method: 'POST' });
        const result = await response.json();
        if (result.success) {
          showMessage(result.message, 'success');
          loadCities(); // Refresh the display
        } else {
          showMessage('Failed to toggle autopilot', 'error');
        }
      } catch (error) {
        showMessage('Error toggling autopilot: ' + error.message, 'error');
      }
    }

    async function togglePlayerControl(cityId) {
      try {
        const response = await fetch(\`/api/cities/\${cityId}/player-control/toggle\`, { method: 'POST' });
        const result = await response.json();
        if (result.success) {
          showMessage(result.message, 'success');
          loadCities(); // Refresh the display
        } else {
          showMessage('Failed to toggle player control', 'error');
        }
      } catch (error) {
        showMessage('Error toggling player control: ' + error.message, 'error');
      }
    }

    async function simulateCity(cityId) {
      try {
        const response = await fetch(\`/api/cities/\${cityId}/simulate\`, { method: 'POST' });
        const result = await response.json();
        if (result.success) {
          showMessage(\`City simulation completed! Population grew by \${result.simulationResults.populationGrowth.toLocaleString()}\`, 'success');
          loadCities(); // Refresh the display
        } else {
          showMessage('City simulation failed', 'error');
        }
      } catch (error) {
        showMessage('Error simulating city: ' + error.message, 'error');
      }
    }

    async function runAllAutopilot() {
      try {
        showLoading('Running autopilot for all cities...');
        const response = await fetch('/api/cities/autopilot/run-all', { method: 'POST' });
        const result = await response.json();
        if (result.success) {
          showMessage(\`Autopilot completed! Made \${result.totalDecisions} optimization decisions across \${result.cityResults.length} cities\`, 'success');
          loadCities(); // Refresh the display
        } else {
          showMessage('Autopilot run failed', 'error');
        }
      } catch (error) {
        showMessage('Error running autopilot: ' + error.message, 'error');
      }
    }

    async function simulateAllCities() {
      try {
        showLoading('Simulating all cities...');
        let successCount = 0;
        let totalPopulationGrowth = 0;
        
        for (const city of citiesData) {
          try {
            const response = await fetch(\`/api/cities/\${city.id}/simulate\`, { method: 'POST' });
            const result = await response.json();
            if (result.success) {
              successCount++;
              totalPopulationGrowth += result.simulationResults.populationGrowth;
            }
          } catch (error) {
            console.error(\`Failed to simulate city \${city.id}:\`, error);
          }
        }
        
        showMessage(\`Simulated \${successCount} cities successfully! Total population growth: \${totalPopulationGrowth.toLocaleString()}\`, 'success');
        loadCities(); // Refresh the display
      } catch (error) {
        showMessage('Error simulating cities: ' + error.message, 'error');
      }
    }

    async function viewCityDetails(cityId) {
      try {
        const response = await fetch(\`/api/cities/\${cityId}\`);
        const city = await response.json();
        
        // Create a detailed view modal or new section
        const detailsHtml = \`
          <div class="card">
            <h3>🏙️ \${city.name} - Detailed View</h3>
            <div class="dashboard">
              <div class="card">
                <h4>📊 Basic Information</h4>
                <div class="metric">
                  <span class="metric-label">Population</span>
                  <span class="metric-value">\${city.population.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Planet</span>
                  <span class="metric-value">\${city.planet}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Star System</span>
                  <span class="metric-value">\${city.starSystem}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Founded</span>
                  <span class="metric-value">\${new Date(city.founded).toLocaleDateString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Climate</span>
                  <span class="metric-value">\${city.climate}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Terrain</span>
                  <span class="metric-value">\${city.terrain}</span>
                </div>
              </div>
              
              <div class="card">
                <h4>💰 Economic Metrics</h4>
                <div class="metric">
                  <span class="metric-label">Economic Output</span>
                  <span class="metric-value">\${city.economicOutput.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Average Income</span>
                  <span class="metric-value">\${city.averageIncome.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Government Budget</span>
                  <span class="metric-value">\${city.governmentBudget.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Infrastructure Budget</span>
                  <span class="metric-value">\${city.infrastructureBudget.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Tax Rate</span>
                  <span class="metric-value">\${(city.taxRate * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div class="dashboard">
              <div class="card">
                <h4>🏗️ Infrastructure</h4>
                \${city.infrastructure.map(infra => \`
                  <div class="metric">
                    <span class="metric-label">\${infra.name} (Level \${infra.level})</span>
                    <span class="metric-value">\${(infra.utilization * 100).toFixed(1)}% utilized</span>
                  </div>
                \`).join('')}
              </div>
              
              <div class="card">
                <h4>⚔️ Strategic Metrics</h4>
                <div class="metric">
                  <span class="metric-label">Military Strength</span>
                  <span class="metric-value">\${city.militaryStrength.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Research Output</span>
                  <span class="metric-value">\${city.researchOutput.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Trade Value</span>
                  <span class="metric-value">\${city.tradeValue.toLocaleString()}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Quality of Life</span>
                  <span class="metric-value">\${city.qualityOfLife}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Attractiveness</span>
                  <span class="metric-value">\${city.attractiveness}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Sustainability</span>
                  <span class="metric-value">\${city.sustainability}%</span>
                </div>
              </div>
            </div>
            
            <div class="city-actions" style="margin-top: 20px;">
              <button class="btn" onclick="loadCities()">← Back to Cities List</button>
            </div>
          </div>
        \`;
        
        document.getElementById('content').innerHTML = detailsHtml;
      } catch (error) {
        showMessage('Error loading city details: ' + error.message, 'error');
      }
    }

    function toggleAutopilotSettings() {
      const panel = document.getElementById('autopilot-panel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    function showLoading(message) {
      document.getElementById('content').innerHTML = \`
        <div class="loading">
          <p>🌌 \${message}</p>
        </div>
      \`;
    }

    function showError(message) {
      document.getElementById('content').innerHTML = \`
        <div class="error">
          <p>❌ \${message}</p>
        </div>
      \`;
    }

    function showMessage(message, type) {
      const messageDiv = document.createElement('div');
      messageDiv.className = type;
      messageDiv.innerHTML = \`<p>\${message}</p>\`;
      
      const container = document.querySelector('.container');
      container.insertBefore(messageDiv, container.firstChild);
      
      setTimeout(() => {
        messageDiv.remove();
      }, 5000);
    }
  </script>
</body>
</html>`;
}

module.exports = { getCitiesDemo };

