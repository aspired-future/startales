/**
 * Economic Tier Evolution Demo
 *
 * Interactive demo for the economic tier evolution system
 */

import express from 'express';

const router = express.Router();

router.get('/demo/economic-tiers', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Economic Tier Evolution Demo</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #333;
          min-height: 100vh;
        }
        .container {
          max-width: 1600px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #764ba2;
          text-align: center;
          margin-bottom: 10px;
          font-size: 2.5em;
        }
        .subtitle {
          text-align: center;
          color: #64748b;
          margin-bottom: 30px;
          font-size: 1.1em;
        }
        .section {
          background: white;
          border-radius: 10px;
          padding: 25px;
          margin-bottom: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
          border-left: 4px solid #667eea;
        }
        .section h2 {
          color: #764ba2;
          margin-top: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        label {
          font-weight: 600;
          color: #374151;
        }
        input, select, button {
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }
        input:focus, select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .tier-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .tier-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 2px solid #e5e7eb;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .tier-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        .tier-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--tier-color);
        }
        .tier-developing { --tier-color: #ef4444; }
        .tier-industrial { --tier-color: #f59e0b; }
        .tier-advanced { --tier-color: #10b981; }
        .tier-post_scarcity { --tier-color: #8b5cf6; }
        .tier-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }
        .tier-icon {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          background: var(--tier-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
        }
        .tier-info h3 {
          margin: 0;
          color: #1f2937;
          font-size: 1.2em;
        }
        .tier-info p {
          margin: 5px 0 0 0;
          color: #6b7280;
          font-size: 0.9em;
        }
        .tier-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 15px;
        }
        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: #f9fafb;
          border-radius: 6px;
          font-size: 0.85em;
        }
        .detail-label {
          font-weight: 600;
          color: #374151;
        }
        .detail-value {
          color: #1f2937;
        }
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 10px;
        }
        .progress-fill {
          height: 100%;
          background: var(--tier-color);
          transition: width 0.3s ease;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .stat-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .stat-number {
          font-size: 2em;
          font-weight: bold;
          color: #764ba2;
          margin-bottom: 5px;
        }
        .stat-label {
          color: #64748b;
          font-size: 0.9em;
        }
        .city-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .city-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-left: 4px solid var(--tier-color);
        }
        .city-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .city-title {
          font-size: 1.1em;
          font-weight: 600;
          color: #1f2937;
        }
        .tier-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75em;
          font-weight: 600;
          text-transform: uppercase;
          background: var(--tier-color);
          color: white;
        }
        .loading {
          text-align: center;
          padding: 40px;
          color: #64748b;
        }
        .error {
          background: #fef2f2;
          color: #dc2626;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
          border: 1px solid #fecaca;
        }
        .success {
          background: #f0fdf4;
          color: #16a34a;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
          border: 1px solid #bbf7d0;
        }
        .constraints-list {
          margin-top: 15px;
        }
        .constraint-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: #fef2f2;
          border-radius: 6px;
          margin-bottom: 8px;
          font-size: 0.85em;
        }
        .constraint-severity {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7em;
          font-weight: 600;
          text-transform: uppercase;
        }
        .severity-critical { background: #dc2626; color: white; }
        .severity-high { background: #ea580c; color: white; }
        .severity-medium { background: #d97706; color: white; }
        .severity-low { background: #16a34a; color: white; }
        .opportunities-list {
          margin-top: 15px;
        }
        .opportunity-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: #f0fdf4;
          border-radius: 6px;
          margin-bottom: 8px;
          font-size: 0.85em;
        }
        .opportunity-impact {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7em;
          font-weight: 600;
          background: #16a34a;
          color: white;
        }
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }
        .tab {
          padding: 10px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.2s;
        }
        .tab.active {
          color: #764ba2;
          border-bottom-color: #764ba2;
        }
        .tab-content {
          display: none;
        }
        .tab-content.active {
          display: block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📈 Economic Tier Evolution Demo</h1>
        <p class="subtitle">Advanced city economic development tracking from developing to post-scarcity economies</p>

        <!-- Tab Navigation -->
        <div class="tabs">
          <button class="tab active" onclick="switchTab('overview')">📊 Overview</button>
          <button class="tab" onclick="switchTab('generator')">🌟 Generator</button>
          <button class="tab" onclick="switchTab('analysis')">🔍 Analysis</button>
          <button class="tab" onclick="switchTab('projections')">🔮 Projections</button>
        </div>

        <!-- Overview Tab -->
        <div id="overview" class="tab-content active">
          <!-- Tier Definitions Section -->
          <div class="section">
            <h2>🏛️ Economic Tier Definitions</h2>
            <button onclick="loadTierDefinitions()">Load Tier Definitions</button>
            <div id="tierDefinitionsContainer"></div>
          </div>

          <!-- Civilization Statistics Section -->
          <div class="section">
            <h2>📊 Civilization Statistics</h2>
            <div class="controls">
              <div class="control-group">
                <label for="statsCivilizationId">Civilization ID:</label>
                <input type="number" id="statsCivilizationId" value="1" min="1" max="5">
              </div>
            </div>
            <button onclick="loadCivilizationStats()">Load Statistics</button>
            <div id="civilizationStatsContainer"></div>
          </div>
        </div>

        <!-- Generator Tab -->
        <div id="generator" class="tab-content">
          <!-- City Profile Generation Section -->
          <div class="section">
            <h2>🌟 Generate City Economic Profile</h2>
            <div class="controls">
              <div class="control-group">
                <label for="genCivilizationId">Civilization ID:</label>
                <input type="number" id="genCivilizationId" value="1" min="1" max="5">
              </div>
              <div class="control-group">
                <label for="genPlanetId">Planet ID:</label>
                <input type="number" id="genPlanetId" value="1" min="1" max="10">
              </div>
              <div class="control-group">
                <label for="genCityId">City ID:</label>
                <input type="number" id="genCityId" value="1" min="1" max="100">
              </div>
              <div class="control-group">
                <label for="genPopulation">Population:</label>
                <input type="number" id="genPopulation" value="500000" min="10000" max="50000000">
              </div>
              <div class="control-group">
                <label for="genSpecialization">Specialization:</label>
                <select id="genSpecialization">
                  <option value="general">General</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="tourism">Tourism</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="mining">Mining</option>
                </select>
              </div>
              <div class="control-group">
                <label for="genStrategicLocation">Strategic Location:</label>
                <select id="genStrategicLocation">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
            <button onclick="generateCityProfile()">Generate Economic Profile</button>
            <div id="generationResult"></div>
          </div>

          <!-- Cities by Tier Section -->
          <div class="section">
            <h2>🏙️ Cities by Economic Tier</h2>
            <div class="controls">
              <div class="control-group">
                <label for="tierFilter">Economic Tier:</label>
                <select id="tierFilter">
                  <option value="developing">🔴 Developing</option>
                  <option value="industrial">🟡 Industrial</option>
                  <option value="advanced">🟢 Advanced</option>
                  <option value="post_scarcity">🟣 Post-Scarcity</option>
                </select>
              </div>
              <div class="control-group">
                <label for="tierCivilizationId">Civilization ID:</label>
                <input type="number" id="tierCivilizationId" value="1" min="1" max="5">
              </div>
              <div class="control-group">
                <label for="tierLimit">Limit:</label>
                <input type="number" id="tierLimit" value="10" min="5" max="50">
              </div>
            </div>
            <button onclick="loadCitiesByTier()">Load Cities</button>
            <div id="citiesByTierContainer"></div>
          </div>
        </div>

        <!-- Analysis Tab -->
        <div id="analysis" class="tab-content">
          <!-- City Analysis Section -->
          <div class="section">
            <h2>🔍 City Economic Analysis</h2>
            <div class="controls">
              <div class="control-group">
                <label for="analysisCityId">City ID:</label>
                <input type="number" id="analysisCityId" value="1" min="1" max="100">
              </div>
            </div>
            <button onclick="loadCityProfile()">Load City Profile</button>
            <button onclick="assessCityTier()">Assess Current Tier</button>
            <button onclick="loadConstraints()">Load Constraints</button>
            <button onclick="loadOpportunities()">Load Opportunities</button>
            <div id="cityAnalysisContainer"></div>
          </div>

          <!-- Policy Simulation Section -->
          <div class="section">
            <h2>🎯 Policy Impact Simulation</h2>
            <div class="controls">
              <div class="control-group">
                <label for="policyCityId">City ID:</label>
                <input type="number" id="policyCityId" value="1" min="1" max="100">
              </div>
              <div class="control-group">
                <label for="policyArea">Policy Area:</label>
                <select id="policyArea">
                  <option value="infrastructure">Infrastructure Investment</option>
                  <option value="education">Education Reform</option>
                  <option value="innovation">Innovation Support</option>
                  <option value="environment">Environmental Protection</option>
                  <option value="taxation">Tax Policy</option>
                  <option value="regulation">Regulatory Reform</option>
                </select>
              </div>
              <div class="control-group">
                <label for="policyInvestment">Investment (Currency Units):</label>
                <input type="number" id="policyInvestment" value="1000000" min="100000" max="10000000000">
              </div>
              <div class="control-group">
                <label for="policyTimeframe">Timeframe (Years):</label>
                <input type="number" id="policyTimeframe" value="5" min="1" max="20">
              </div>
            </div>
            <button onclick="simulatePolicyImpact()">Simulate Policy Impact</button>
            <div id="policySimulationContainer"></div>
          </div>
        </div>

        <!-- Projections Tab -->
        <div id="projections" class="tab-content">
          <!-- Development Projections Section -->
          <div class="section">
            <h2>🔮 Development Trajectory Projections</h2>
            <div class="controls">
              <div class="control-group">
                <label for="projectionCityId">City ID:</label>
                <input type="number" id="projectionCityId" value="1" min="1" max="100">
              </div>
              <div class="control-group">
                <label for="projectionYears">Projection Years:</label>
                <input type="number" id="projectionYears" value="10" min="5" max="50">
              </div>
            </div>
            <button onclick="projectDevelopmentTrajectory()">Generate Projections</button>
            <div id="projectionsContainer"></div>
          </div>

          <!-- Development Plan Generation Section -->
          <div class="section">
            <h2>📋 Development Plan Generation</h2>
            <div class="controls">
              <div class="control-group">
                <label for="planCityId">City ID:</label>
                <input type="number" id="planCityId" value="1" min="1" max="100">
              </div>
              <div class="control-group">
                <label for="planTargetTier">Target Tier:</label>
                <select id="planTargetTier">
                  <option value="industrial">🟡 Industrial</option>
                  <option value="advanced">🟢 Advanced</option>
                  <option value="post_scarcity">🟣 Post-Scarcity</option>
                </select>
              </div>
            </div>
            <button onclick="generateDevelopmentPlan()">Generate Development Plan</button>
            <div id="developmentPlanContainer"></div>
          </div>
        </div>
      </div>

      <script>
        function switchTab(tabName) {
          // Hide all tab contents
          document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
          });
          
          // Remove active class from all tabs
          document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
          });
          
          // Show selected tab content
          document.getElementById(tabName).classList.add('active');
          
          // Add active class to clicked tab
          event.target.classList.add('active');
        }

        async function loadTierDefinitions() {
          const container = document.getElementById('tierDefinitionsContainer');
          container.innerHTML = '<div class="loading">📋 Loading tier definitions...</div>';

          try {
            const response = await fetch('/api/economic-tiers/definitions');
            const data = await response.json();

            if (data.success) {
              container.innerHTML = \`
                <div class="tier-grid">
                  \${data.definitions.map(tier => \`
                    <div class="tier-card tier-\${tier.tier}">
                      <div class="tier-header">
                        <div class="tier-icon">
                          \${getTierIcon(tier.tier)}
                        </div>
                        <div class="tier-info">
                          <h3>\${tier.name}</h3>
                          <p>\${tier.tier.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <p style="margin-bottom: 15px; color: #4b5563; font-size: 0.9em;">
                        \${tier.description}
                      </p>
                      <div class="tier-details">
                        <div class="detail-item">
                          <span class="detail-label">GDP Range:</span>
                          <span class="detail-value">$\${tier.characteristics.gdp_per_capita_range[0].toLocaleString()}-\${tier.characteristics.gdp_per_capita_range[1].toLocaleString()}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Infrastructure:</span>
                          <span class="detail-value">\${tier.characteristics.infrastructure_level}/100</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Innovation:</span>
                          <span class="detail-value">\${tier.characteristics.innovation_intensity}/100</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Quality of Life:</span>
                          <span class="detail-value">\${tier.characteristics.quality_of_life}/100</span>
                        </div>
                      </div>
                      <div style="margin-top: 15px;">
                        <strong>Key Sectors:</strong>
                        <div style="margin-top: 5px;">
                          \${tier.characteristics.dominant_sectors.map(sector => 
                            \`<span style="display: inline-block; background: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-size: 0.75em; margin: 2px;">\${sector.replace('_', ' ')}</span>\`
                          ).join('')}
                        </div>
                      </div>
                    </div>
                  \`).join('')}
                </div>
              \`;
            } else {
              container.innerHTML = \`<div class="error">❌ Error loading tier definitions: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        async function loadCivilizationStats() {
          const civilizationId = document.getElementById('statsCivilizationId').value;
          const container = document.getElementById('civilizationStatsContainer');
          
          container.innerHTML = '<div class="loading">📊 Loading civilization statistics...</div>';

          try {
            const response = await fetch(\`/api/economic-tiers/statistics/\${civilizationId}\`);
            const data = await response.json();

            if (data.success) {
              const stats = data.statistics;
              container.innerHTML = \`
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-number">\${stats.total_cities}</div>
                    <div class="stat-label">Total Cities</div>
                  </div>
                  \${stats.tier_distribution.map(tier => \`
                    <div class="stat-card">
                      <div class="stat-number">\${tier.city_count}</div>
                      <div class="stat-label">\${tier.tier.replace('_', ' ')} Cities</div>
                    </div>
                  \`).join('')}
                </div>
                <div class="tier-grid" style="margin-top: 20px;">
                  \${stats.tier_distribution.map(tier => \`
                    <div class="tier-card tier-\${tier.tier}">
                      <div class="tier-header">
                        <div class="tier-icon">
                          \${getTierIcon(tier.tier)}
                        </div>
                        <div class="tier-info">
                          <h3>\${tier.tier.replace('_', ' ')} Tier</h3>
                          <p>\${tier.city_count} cities (\${tier.percentage.toFixed(1)}%)</p>
                        </div>
                      </div>
                      <div class="tier-details">
                        <div class="detail-item">
                          <span class="detail-label">Avg GDP:</span>
                          <span class="detail-value">$\${tier.avg_gdp_per_capita.toLocaleString()}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Avg Infrastructure:</span>
                          <span class="detail-value">\${tier.avg_infrastructure_score}/100</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Avg Innovation:</span>
                          <span class="detail-value">\${tier.avg_innovation_index}/100</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Avg Quality of Life:</span>
                          <span class="detail-value">\${tier.avg_quality_of_life}/100</span>
                        </div>
                      </div>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: \${tier.avg_progress}%"></div>
                      </div>
                      <div style="text-align: center; margin-top: 5px; font-size: 0.8em; color: #6b7280;">
                        \${tier.avg_progress}% progress to next tier
                      </div>
                    </div>
                  \`).join('')}
                </div>
              \`;
            } else {
              container.innerHTML = \`<div class="error">❌ Error loading statistics: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        async function generateCityProfile() {
          const civilizationId = document.getElementById('genCivilizationId').value;
          const planetId = document.getElementById('genPlanetId').value;
          const cityId = document.getElementById('genCityId').value;
          const population = document.getElementById('genPopulation').value;
          const specialization = document.getElementById('genSpecialization').value;
          const strategicLocation = document.getElementById('genStrategicLocation').value === 'true';

          const resultDiv = document.getElementById('generationResult');
          resultDiv.innerHTML = '<div class="loading">🌟 Generating city economic profile...</div>';

          try {
            const response = await fetch('/api/economic-tiers/generate-profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                civilizationId: parseInt(civilizationId),
                planetId: parseInt(planetId),
                cityId: parseInt(cityId),
                population: parseInt(population),
                initialSpecialization: specialization,
                strategicLocation: strategicLocation
              })
            });

            const data = await response.json();

            if (data.success) {
              const profile = data.profile;
              resultDiv.innerHTML = \`
                <div class="success">
                  ✅ Successfully generated economic profile for city \${data.city_id}!
                </div>
                <div class="city-card tier-\${profile.current_tier}" style="margin-top: 15px;">
                  <div class="city-header">
                    <div class="city-title">City \${data.city_id}</div>
                    <div class="tier-badge">\${profile.current_tier.replace('_', ' ')}</div>
                  </div>
                  <div class="tier-details">
                    <div class="detail-item">
                      <span class="detail-label">GDP per Capita:</span>
                      <span class="detail-value">$\${profile.economic_indicators.gdp_per_capita.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Infrastructure:</span>
                      <span class="detail-value">\${profile.infrastructure_score}/100</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Innovation:</span>
                      <span class="detail-value">\${profile.innovation_index}/100</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Quality of Life:</span>
                      <span class="detail-value">\${profile.quality_of_life}/100</span>
                    </div>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: \${profile.tier_progress}%"></div>
                  </div>
                  <div style="text-align: center; margin-top: 5px; font-size: 0.8em; color: #6b7280;">
                    \${profile.tier_progress}% progress to next tier
                  </div>
                </div>
              \`;
            } else {
              resultDiv.innerHTML = \`<div class="error">❌ Error: \${data.error}</div>\`;
            }
          } catch (error) {
            resultDiv.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        async function loadCitiesByTier() {
          const tier = document.getElementById('tierFilter').value;
          const civilizationId = document.getElementById('tierCivilizationId').value;
          const limit = document.getElementById('tierLimit').value;
          const container = document.getElementById('citiesByTierContainer');
          
          container.innerHTML = '<div class="loading">🏙️ Loading cities...</div>';

          try {
            const response = await fetch(\`/api/economic-tiers/tier/\${tier}?civilizationId=\${civilizationId}&limit=\${limit}\`);
            const data = await response.json();

            if (data.success) {
              if (data.cities.length === 0) {
                container.innerHTML = '<div class="loading">No cities found for this tier. Try generating some city profiles first!</div>';
                return;
              }

              container.innerHTML = \`
                <div class="city-grid">
                  \${data.cities.map(city => \`
                    <div class="city-card tier-\${city.current_tier}">
                      <div class="city-header">
                        <div class="city-title">City \${city.city_id}</div>
                        <div class="tier-badge">\${city.current_tier.replace('_', ' ')}</div>
                      </div>
                      <div class="tier-details">
                        <div class="detail-item">
                          <span class="detail-label">GDP per Capita:</span>
                          <span class="detail-value">$\${city.gdp_per_capita.toLocaleString()}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Infrastructure:</span>
                          <span class="detail-value">\${city.infrastructure_score}/100</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Innovation:</span>
                          <span class="detail-value">\${city.innovation_index}/100</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Quality of Life:</span>
                          <span class="detail-value">\${city.quality_of_life}/100</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Constraints:</span>
                          <span class="detail-value">\${city.constraints_count}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Opportunities:</span>
                          <span class="detail-value">\${city.opportunities_count}</span>
                        </div>
                      </div>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: \${city.tier_progress}%"></div>
                      </div>
                      <div style="text-align: center; margin-top: 5px; font-size: 0.8em; color: #6b7280;">
                        \${city.tier_progress}% progress to next tier
                      </div>
                    </div>
                  \`).join('')}
                </div>
              \`;
            } else {
              container.innerHTML = \`<div class="error">❌ Error loading cities: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        async function loadCityProfile() {
          const cityId = document.getElementById('analysisCityId').value;
          const container = document.getElementById('cityAnalysisContainer');
          
          container.innerHTML = '<div class="loading">🔍 Loading city profile...</div>';

          try {
            const response = await fetch(\`/api/economic-tiers/profile/\${cityId}\`);
            const data = await response.json();

            if (data.success) {
              const profile = data.profile;
              container.innerHTML = \`
                <div class="city-card tier-\${profile.current_tier}">
                  <div class="city-header">
                    <div class="city-title">City \${profile.city_id} - Detailed Profile</div>
                    <div class="tier-badge">\${profile.current_tier.replace('_', ' ')}</div>
                  </div>
                  <div class="tier-details">
                    <div class="detail-item">
                      <span class="detail-label">Development Stage:</span>
                      <span class="detail-value">\${profile.development_stage.replace('_', ' ')}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">GDP per Capita:</span>
                      <span class="detail-value">$\${profile.economic_indicators.gdp_per_capita.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">GDP Growth:</span>
                      <span class="detail-value">\${profile.economic_indicators.gdp_growth_rate.toFixed(1)}%</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Unemployment:</span>
                      <span class="detail-value">\${profile.economic_indicators.unemployment_rate.toFixed(1)}%</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Infrastructure:</span>
                      <span class="detail-value">\${profile.infrastructure.overall_score}/100</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Innovation Index:</span>
                      <span class="detail-value">\${profile.innovation_metrics.innovation_index}/100</span>
                    </div>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: \${profile.tier_progress}%"></div>
                  </div>
                  <div style="text-align: center; margin-top: 5px; font-size: 0.8em; color: #6b7280;">
                    \${profile.tier_progress}% progress to next tier
                  </div>
                </div>
              \`;
            } else {
              container.innerHTML = \`<div class="error">❌ Error loading city profile: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        async function assessCityTier() {
          const cityId = document.getElementById('analysisCityId').value;
          const container = document.getElementById('cityAnalysisContainer');
          
          try {
            const response = await fetch(\`/api/economic-tiers/assess/\${cityId}\`, { method: 'POST' });
            const data = await response.json();

            if (data.success) {
              const assessmentHtml = \`
                <div class="success" style="margin-top: 15px;">
                  ✅ Tier Assessment Complete
                  <br><strong>Previous Tier:</strong> \${data.previous_tier.replace('_', ' ')}
                  <br><strong>Assessed Tier:</strong> \${data.assessed_tier.replace('_', ' ')}
                  <br><strong>Tier Changed:</strong> \${data.tier_changed ? 'Yes' : 'No'}
                  <br><strong>Progress:</strong> \${data.tier_progress}%
                </div>
              \`;
              container.innerHTML += assessmentHtml;
            } else {
              container.innerHTML += \`<div class="error" style="margin-top: 15px;">❌ Error assessing tier: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML += \`<div class="error" style="margin-top: 15px;">❌ Network error: \${error.message}</div>\`;
          }
        }

        async function loadConstraints() {
          const cityId = document.getElementById('analysisCityId').value;
          const container = document.getElementById('cityAnalysisContainer');
          
          try {
            const response = await fetch(\`/api/economic-tiers/constraints/\${cityId}\`);
            const data = await response.json();

            if (data.success) {
              const constraintsHtml = \`
                <div style="margin-top: 20px;">
                  <h4>🚧 Development Constraints (\${data.constraints_count})</h4>
                  <div class="constraints-list">
                    \${data.constraints.map(constraint => \`
                      <div class="constraint-item">
                        <span class="constraint-severity severity-\${constraint.severity}">\${constraint.severity}</span>
                        <div>
                          <strong>\${constraint.type.replace('_', ' ')}</strong>: \${constraint.description}
                          <br><small>Cost: $\${constraint.estimated_cost.toLocaleString()} | Timeline: \${constraint.timeframe_years} years</small>
                        </div>
                      </div>
                    \`).join('')}
                  </div>
                </div>
              \`;
              container.innerHTML += constraintsHtml;
            } else {
              container.innerHTML += \`<div class="error" style="margin-top: 15px;">❌ Error loading constraints: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML += \`<div class="error" style="margin-top: 15px;">❌ Network error: \${error.message}</div>\`;
          }
        }

        async function loadOpportunities() {
          const cityId = document.getElementById('analysisCityId').value;
          const container = document.getElementById('cityAnalysisContainer');
          
          try {
            const response = await fetch(\`/api/economic-tiers/opportunities/\${cityId}\`);
            const data = await response.json();

            if (data.success) {
              const opportunitiesHtml = \`
                <div style="margin-top: 20px;">
                  <h4>🚀 Growth Opportunities (\${data.opportunities_count})</h4>
                  <div class="opportunities-list">
                    \${data.opportunities.map(opp => \`
                      <div class="opportunity-item">
                        <span class="opportunity-impact">\${opp.potential_impact}%</span>
                        <div>
                          <strong>\${opp.title}</strong>: \${opp.description}
                          <br><small>Investment: $\${opp.investment_required.toLocaleString()} | Success: \${opp.success_probability}%</small>
                        </div>
                      </div>
                    \`).join('')}
                  </div>
                </div>
              \`;
              container.innerHTML += opportunitiesHtml;
            } else {
              container.innerHTML += \`<div class="error" style="margin-top: 15px;">❌ Error loading opportunities: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML += \`<div class="error" style="margin-top: 15px;">❌ Network error: \${error.message}</div>\`;
          }
        }

        async function simulatePolicyImpact() {
          const cityId = document.getElementById('policyCityId').value;
          const policyArea = document.getElementById('policyArea').value;
          const investment = document.getElementById('policyInvestment').value;
          const timeframe = document.getElementById('policyTimeframe').value;
          const container = document.getElementById('policySimulationContainer');
          
          container.innerHTML = '<div class="loading">🎯 Simulating policy impact...</div>';

          try {
            const policyChanges = [{
              policy_area: policyArea,
              change_description: \`\${policyArea.replace('_', ' ')} investment program\`,
              implementation_cost: parseInt(investment),
              timeframe_years: parseInt(timeframe),
              expected_impact: {},
              uncertainty_level: 30
            }];

            const response = await fetch(\`/api/economic-tiers/simulate-policy/\${cityId}\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ policyChanges })
            });

            const data = await response.json();

            if (data.success) {
              const impact = data.impact_assessment;
              container.innerHTML = \`
                <div class="city-card">
                  <h4>Policy Impact Assessment</h4>
                  <div class="tier-details">
                    <div class="detail-item">
                      <span class="detail-label">Overall Impact:</span>
                      <span class="detail-value">\${impact.overall_impact_score > 0 ? '+' : ''}\${impact.overall_impact_score}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Tier Advancement:</span>
                      <span class="detail-value">\${impact.tier_advancement_probability}%</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Cost-Benefit Ratio:</span>
                      <span class="detail-value">\${impact.cost_benefit_ratio}</span>
                    </div>
                  </div>
                  <div style="margin-top: 15px;">
                    <strong>Implementation Challenges:</strong>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                      \${impact.implementation_challenges.map(challenge => \`<li>\${challenge}</li>\`).join('')}
                    </ul>
                  </div>
                  <div style="margin-top: 10px;">
                    <strong>Stakeholder Reactions:</strong>
                    <div style="margin-top: 5px;">
                      \${Object.entries(impact.stakeholder_reactions).map(([stakeholder, reaction]) => 
                        \`<span style="display: inline-block; background: \${reaction > 0 ? '#dcfce7' : '#fef2f2'}; color: \${reaction > 0 ? '#166534' : '#dc2626'}; padding: 2px 6px; border-radius: 4px; font-size: 0.75em; margin: 2px;">\${stakeholder}: \${reaction > 0 ? '+' : ''}\${reaction}</span>\`
                      ).join('')}
                    </div>
                  </div>
                </div>
              \`;
            } else {
              container.innerHTML = \`<div class="error">❌ Error simulating policy: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        async function projectDevelopmentTrajectory() {
          const cityId = document.getElementById('projectionCityId').value;
          const years = document.getElementById('projectionYears').value;
          const container = document.getElementById('projectionsContainer');
          
          container.innerHTML = '<div class="loading">🔮 Generating development projections...</div>';

          try {
            const response = await fetch(\`/api/economic-tiers/project/\${cityId}\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ years: parseInt(years) })
            });

            const data = await response.json();

            if (data.success) {
              container.innerHTML = \`
                <div class="tier-grid">
                  \${data.projections.map(proj => \`
                    <div class="city-card">
                      <div class="city-header">
                        <div class="city-title">\${proj.scenario_name}</div>
                        <div class="tier-badge" style="background: #6b7280;">\${proj.probability}%</div>
                      </div>
                      <div class="tier-details">
                        <div class="detail-item">
                          <span class="detail-label">Projected Tier:</span>
                          <span class="detail-value">\${proj.projected_tier.replace('_', ' ')}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">GDP Growth:</span>
                          <span class="detail-value">$\${proj.projected_indicators.gdp_per_capita.toLocaleString()}</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Infrastructure:</span>
                          <span class="detail-value">\${proj.projected_indicators.infrastructure_score}/100</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">Innovation:</span>
                          <span class="detail-value">\${proj.projected_indicators.innovation_index}/100</span>
                        </div>
                      </div>
                      <div style="margin-top: 15px;">
                        <strong>Key Assumptions:</strong>
                        <ul style="margin: 5px 0; padding-left: 20px; font-size: 0.85em;">
                          \${proj.key_assumptions.slice(0, 3).map(assumption => \`<li>\${assumption}</li>\`).join('')}
                        </ul>
                      </div>
                      <div style="margin-top: 10px;">
                        <strong>Major Risks:</strong>
                        <ul style="margin: 5px 0; padding-left: 20px; font-size: 0.85em;">
                          \${proj.major_risks.slice(0, 2).map(risk => \`<li>\${risk}</li>\`).join('')}
                        </ul>
                      </div>
                    </div>
                  \`).join('')}
                </div>
              \`;
            } else {
              container.innerHTML = \`<div class="error">❌ Error generating projections: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        async function generateDevelopmentPlan() {
          const cityId = document.getElementById('planCityId').value;
          const targetTier = document.getElementById('planTargetTier').value;
          const container = document.getElementById('developmentPlanContainer');
          
          container.innerHTML = '<div class="loading">📋 Generating development plan...</div>';

          try {
            const response = await fetch(\`/api/economic-tiers/development-plan/\${cityId}\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ targetTier })
            });

            const data = await response.json();

            if (data.success) {
              container.innerHTML = \`
                <div class="success">
                  ✅ Development plan created successfully!
                  <br><strong>Plan ID:</strong> \${data.plan_id}
                  <br><strong>Target Tier:</strong> \${data.target_tier.replace('_', ' ')}
                  <br><strong>Planning Horizon:</strong> \${data.planning_horizon_years} years
                  <br><strong>Strategic Objectives:</strong> \${data.strategic_objectives_count}
                  <br><strong>Implementation Phases:</strong> \${data.implementation_phases_count}
                  <br><strong>Total Investment:</strong> $\${data.total_investment_required.toLocaleString()}
                </div>
              \`;
            } else {
              container.innerHTML = \`<div class="error">❌ Error generating plan: \${data.error}</div>\`;
            }
          } catch (error) {
            container.innerHTML = \`<div class="error">❌ Network error: \${error.message}</div>\`;
          }
        }

        function getTierIcon(tier) {
          const icons = {
            developing: '🔴',
            industrial: '🟡',
            advanced: '🟢',
            post_scarcity: '🟣'
          };
          return icons[tier] || '⚪';
        }

        // Load tier definitions on page load
        document.addEventListener('DOMContentLoaded', function() {
          loadTierDefinitions();
          loadCivilizationStats();
        });
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

export default router;
