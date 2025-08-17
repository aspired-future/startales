#!/usr/bin/env node
/**
 * Civilization Analytics Demo Server
 * Task 45: Economic inequality visualization and social mobility tracking
 * 
 * Showcases:
 * - Economic inequality measurement (Gini coefficient)
 * - Social mobility tracking
 * - Population demographics analysis
 * - Policy impact simulation
 * - Historical trend visualization
 */

import express from 'express';
import cors from 'cors';
import { initDb } from '../server/storage/db.js';
import civilizationAnalyticsRouter from '../server/routes/civilizationAnalytics.js';

const app = express();
const PORT = process.env.PORT || 4020;

app.use(cors());
app.use(express.json());

// Initialize database
let dbInitialized = false;
const initializeDb = async () => {
  if (!dbInitialized) {
    try {
      await initDb();
      dbInitialized = true;
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.log('⚠️ Database initialization failed, using mock data:', error.message);
    }
  }
};

// Mount civilization analytics routes
app.use('/api/civilization-analytics', civilizationAnalyticsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    systems: {
      database: dbInitialized,
      analytics: true,
      demographics: true,
      socialMobility: true
    }
  });
});

// Comprehensive Civilization Analytics Demo HUD
app.get('/demo/civilization-analytics', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Civilization Analytics Demo - Task 45</title>
    <style>
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #1a1a2e, #16213e); 
            color: #fff; 
            min-height: 100vh;
        }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #4fc3f7; margin: 0; font-size: 2.5em; }
        .header p { color: #b0bec5; margin: 10px 0; font-size: 1.1em; }
        
        .dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
        .panel { 
            background: rgba(255,255,255,0.1); 
            backdrop-filter: blur(10px);
            padding: 25px; 
            border-radius: 15px; 
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .panel h2 { color: #4fc3f7; margin-top: 0; font-size: 1.4em; }
        .panel h3 { color: #81c784; margin: 20px 0 10px 0; font-size: 1.1em; }
        
        button { 
            background: linear-gradient(45deg, #4fc3f7, #29b6f6); 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            margin: 8px 4px; 
            border-radius: 25px; 
            cursor: pointer; 
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3);
        }
        button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(79, 195, 247, 0.4);
        }
        button.secondary {
            background: linear-gradient(45deg, #81c784, #66bb6a);
            box-shadow: 0 4px 15px rgba(129, 199, 132, 0.3);
        }
        button.secondary:hover {
            box-shadow: 0 6px 20px rgba(129, 199, 132, 0.4);
        }
        
        .output { 
            background: rgba(0,0,0,0.3); 
            padding: 15px; 
            margin: 15px 0; 
            border-radius: 8px; 
            font-family: 'Consolas', monospace; 
            white-space: pre-wrap; 
            font-size: 0.9em;
            border-left: 4px solid #4fc3f7;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 15px 0; }
        .metric-card { 
            background: rgba(255,255,255,0.05); 
            padding: 15px; 
            border-radius: 8px; 
            text-align: center;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .metric-value { font-size: 1.8em; font-weight: bold; color: #4fc3f7; }
        .metric-label { font-size: 0.9em; color: #b0bec5; margin-top: 5px; }
        
        .status { color: #4caf50; font-weight: bold; }
        .warning { color: #ff9800; font-weight: bold; }
        .error { color: #f44336; font-weight: bold; }
        
        input, select { 
            background: rgba(255,255,255,0.1); 
            border: 1px solid rgba(255,255,255,0.3); 
            color: white; 
            padding: 8px 12px; 
            border-radius: 6px; 
            margin: 5px;
        }
        input::placeholder { color: rgba(255,255,255,0.6); }
        
        .trend-indicator { 
            display: inline-block; 
            padding: 4px 8px; 
            border-radius: 12px; 
            font-size: 0.8em; 
            font-weight: bold;
            margin-left: 10px;
        }
        .trend-up { background: #4caf50; color: white; }
        .trend-down { background: #f44336; color: white; }
        .trend-stable { background: #ff9800; color: white; }
        
        .recommendation { 
            background: rgba(129, 199, 132, 0.1); 
            border-left: 4px solid #81c784; 
            padding: 12px; 
            margin: 8px 0; 
            border-radius: 4px;
        }
        
        .inequality-bar {
            height: 20px;
            background: linear-gradient(90deg, #4caf50 0%, #ff9800 50%, #f44336 100%);
            border-radius: 10px;
            margin: 10px 0;
            position: relative;
        }
        .inequality-marker {
            position: absolute;
            top: -5px;
            width: 4px;
            height: 30px;
            background: white;
            border-radius: 2px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏛️ Civilization Analytics Dashboard</h1>
        <p>Task 45: Economic Inequality Visualization & Social Mobility Tracking</p>
        <div id="systemStatus" class="status">Loading system status...</div>
    </div>

    <div class="dashboard">
        <!-- System Overview -->
        <div class="panel">
            <h2>📊 System Overview</h2>
            <button onclick="checkHealth()">Refresh Status</button>
            <button onclick="loadFullAnalytics()" class="secondary">Load Full Analytics</button>
            <div id="overviewOutput" class="output">Click "Load Full Analytics" to see comprehensive civilization metrics...</div>
        </div>

        <!-- Economic Inequality -->
        <div class="panel">
            <h2>💰 Economic Inequality Analysis</h2>
            <button onclick="loadEconomicMetrics()">Load Economic Data</button>
            <button onclick="loadInequalityAnalysis()" class="secondary">Detailed Inequality</button>
            
            <div id="economicMetrics" class="metric-grid" style="display: none;">
                <div class="metric-card">
                    <div id="giniValue" class="metric-value">-</div>
                    <div class="metric-label">Gini Coefficient</div>
                </div>
                <div class="metric-card">
                    <div id="economicHealthValue" class="metric-value">-</div>
                    <div class="metric-label">Economic Health</div>
                </div>
                <div class="metric-card">
                    <div id="povertyRateValue" class="metric-value">-</div>
                    <div class="metric-label">Poverty Rate (%)</div>
                </div>
                <div class="metric-card">
                    <div id="middleClassValue" class="metric-value">-</div>
                    <div class="metric-label">Middle Class (%)</div>
                </div>
            </div>
            
            <div id="inequalityBar" style="display: none;">
                <h3>Inequality Level</h3>
                <div class="inequality-bar">
                    <div id="inequalityMarker" class="inequality-marker"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8em; color: #b0bec5;">
                    <span>Low (0.0)</span>
                    <span>Moderate (0.4)</span>
                    <span>High (0.8)</span>
                </div>
            </div>
            
            <div id="economicOutput" class="output"></div>
        </div>

        <!-- Social Mobility -->
        <div class="panel">
            <h2>📈 Social Mobility Tracking</h2>
            <button onclick="loadSocialMobility()">Load Mobility Data</button>
            <button onclick="loadDemographics()" class="secondary">Demographics</button>
            
            <div id="mobilityMetrics" class="metric-grid" style="display: none;">
                <div class="metric-card">
                    <div id="upwardMobilityValue" class="metric-value">-</div>
                    <div class="metric-label">Upward Mobility (%)</div>
                </div>
                <div class="metric-card">
                    <div id="educationImpactValue" class="metric-value">-</div>
                    <div class="metric-label">Education Impact (%)</div>
                </div>
                <div class="metric-card">
                    <div id="employmentRateValue" class="metric-value">-</div>
                    <div class="metric-label">Employment Rate (%)</div>
                </div>
                <div class="metric-card">
                    <div id="urbanizationValue" class="metric-value">-</div>
                    <div class="metric-label">Urbanization (%)</div>
                </div>
            </div>
            
            <div id="mobilityOutput" class="output"></div>
        </div>

        <!-- Policy Simulation -->
        <div class="panel">
            <h2>🎯 Policy Impact Simulation</h2>
            <div style="margin: 15px 0;">
                <select id="policyType">
                    <option value="education_investment">Education Investment</option>
                    <option value="wealth_redistribution">Wealth Redistribution</option>
                    <option value="job_creation">Job Creation Programs</option>
                </select>
                <input type="range" id="policyIntensity" min="0.5" max="3" step="0.5" value="1">
                <span id="intensityLabel">Intensity: 1.0</span>
            </div>
            <button onclick="simulatePolicy()">Simulate Policy Impact</button>
            <button onclick="loadRecommendations()" class="secondary">Get Recommendations</button>
            
            <div id="simulationOutput" class="output"></div>
            <div id="recommendationsOutput"></div>
        </div>

        <!-- Historical Trends -->
        <div class="panel">
            <h2>📉 Historical Trends</h2>
            <button onclick="loadTrends()">Load Trend Data</button>
            <button onclick="generateTrendChart()" class="secondary">Visualize Trends</button>
            
            <div id="trendsOutput" class="output"></div>
            <canvas id="trendChart" width="400" height="200" style="display: none; background: rgba(255,255,255,0.1); border-radius: 8px; margin-top: 15px;"></canvas>
        </div>
    </div>

    <script>
        const campaignId = 1;
        let currentAnalytics = null;

        // Update intensity label
        document.getElementById('policyIntensity').addEventListener('input', function() {
            document.getElementById('intensityLabel').textContent = 'Intensity: ' + this.value;
        });

        async function checkHealth() {
            try {
                const response = await fetch('/health');
                const data = await response.json();
                document.getElementById('systemStatus').innerHTML = 
                    \`Status: \${data.status} | Database: \${data.systems.database ? '✅' : '❌'} | Analytics: \${data.systems.analytics ? '✅' : '❌'}\`;
            } catch (error) {
                document.getElementById('systemStatus').innerHTML = 'Error: ' + error.message;
                document.getElementById('systemStatus').className = 'error';
            }
        }

        async function loadFullAnalytics() {
            try {
                const response = await fetch(\`/api/civilization-analytics/\${campaignId}\`);
                const data = await response.json();
                currentAnalytics = data.data;
                
                document.getElementById('overviewOutput').textContent = JSON.stringify(data.data, null, 2);
                
                // Update economic metrics display
                updateEconomicDisplay(data.data.economic);
                updateMobilityDisplay(data.data.socialMobility, data.data.demographics);
                
            } catch (error) {
                document.getElementById('overviewOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function loadEconomicMetrics() {
            try {
                const response = await fetch(\`/api/civilization-analytics/\${campaignId}/economic\`);
                const data = await response.json();
                
                updateEconomicDisplay(data.data.economic);
                document.getElementById('economicOutput').textContent = JSON.stringify(data.data.economic, null, 2);
                
            } catch (error) {
                document.getElementById('economicOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function loadInequalityAnalysis() {
            try {
                const response = await fetch(\`/api/civilization-analytics/\${campaignId}/inequality\`);
                const data = await response.json();
                
                const inequality = data.data.inequality;
                const interpretation = data.data.interpretation;
                
                // Update inequality bar
                const marker = document.getElementById('inequalityMarker');
                const position = (inequality.giniCoefficient / 0.8) * 100; // Scale to 0-100%
                marker.style.left = position + '%';
                
                document.getElementById('inequalityBar').style.display = 'block';
                document.getElementById('economicOutput').innerHTML = 
                    \`<strong>Inequality Analysis:</strong>\\n\` +
                    \`Gini Coefficient: \${inequality.giniCoefficient.toFixed(3)} (\${interpretation.inequalityLevel})\\n\` +
                    \`Economic Health: \${interpretation.economicHealth}\\n\\n\` +
                    \`Income Distribution:\\n\` +
                    \`• Poor: \${inequality.incomeDistribution.poor.percentage.toFixed(1)}% (avg: $\${inequality.incomeDistribution.poor.averageIncome.toLocaleString()})\\n\` +
                    \`• Middle: \${inequality.incomeDistribution.median.percentage.toFixed(1)}% (avg: $\${inequality.incomeDistribution.median.averageIncome.toLocaleString()})\\n\` +
                    \`• Rich: \${inequality.incomeDistribution.rich.percentage.toFixed(1)}% (avg: $\${inequality.incomeDistribution.rich.averageIncome.toLocaleString()})\`;
                
            } catch (error) {
                document.getElementById('economicOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function loadSocialMobility() {
            try {
                const response = await fetch(\`/api/civilization-analytics/\${campaignId}/social-mobility\`);
                const data = await response.json();
                
                updateMobilityDisplay(data.data.socialMobility);
                document.getElementById('mobilityOutput').textContent = JSON.stringify(data.data.socialMobility, null, 2);
                
            } catch (error) {
                document.getElementById('mobilityOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function loadDemographics() {
            try {
                const response = await fetch(\`/api/civilization-analytics/\${campaignId}/demographics\`);
                const data = await response.json();
                
                updateMobilityDisplay(null, data.data.demographics);
                document.getElementById('mobilityOutput').textContent = JSON.stringify(data.data.demographics, null, 2);
                
            } catch (error) {
                document.getElementById('mobilityOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function simulatePolicy() {
            try {
                const policyType = document.getElementById('policyType').value;
                const intensity = parseFloat(document.getElementById('policyIntensity').value);
                
                const response = await fetch(\`/api/civilization-analytics/\${campaignId}/simulate-policy\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ policyType, intensity })
                });
                const data = await response.json();
                
                const impact = data.data.impact;
                const current = data.data.current;
                const simulated = data.data.simulated;
                
                document.getElementById('simulationOutput').innerHTML = 
                    \`<strong>Policy Simulation: \${policyType.replace('_', ' ').toUpperCase()}</strong>\\n\` +
                    \`Intensity: \${intensity}x\\n\\n\` +
                    \`<strong>CURRENT → SIMULATED (CHANGE)</strong>\\n\` +
                    \`Economic Health: \${current.economicHealth.toFixed(1)} → \${simulated.economicHealth.toFixed(1)} (\${impact.economicHealthChange > 0 ? '+' : ''}\${impact.economicHealthChange.toFixed(1)})\\n\` +
                    \`Gini Coefficient: \${current.giniCoefficient.toFixed(3)} → \${simulated.giniCoefficient.toFixed(3)} (\${impact.inequalityChange > 0 ? '+' : ''}\${impact.inequalityChange.toFixed(3)})\\n\` +
                    \`Upward Mobility: \${current.upwardMobility.toFixed(1)}% → \${simulated.upwardMobility.toFixed(1)}% (\${impact.mobilityChange > 0 ? '+' : ''}\${impact.mobilityChange.toFixed(1)}%)\\n\\n\` +
                    \`<strong>IMPACT ASSESSMENT:</strong>\\n\` +
                    \`\${impact.economicHealthChange > 5 ? '🟢 Significant economic improvement' : impact.economicHealthChange > 0 ? '🟡 Moderate economic improvement' : '🔴 Economic decline'}\\n\` +
                    \`\${impact.inequalityChange < -0.02 ? '🟢 Meaningful inequality reduction' : impact.inequalityChange < 0 ? '🟡 Slight inequality reduction' : '🔴 Inequality increase'}\\n\` +
                    \`\${impact.mobilityChange > 5 ? '🟢 Strong mobility improvement' : impact.mobilityChange > 0 ? '🟡 Modest mobility improvement' : '🔴 Mobility decline'}\`;
                
            } catch (error) {
                document.getElementById('simulationOutput').textContent = 'Error: ' + error.message;
            }
        }

        async function loadRecommendations() {
            try {
                const response = await fetch(\`/api/civilization-analytics/\${campaignId}/recommendations\`);
                const data = await response.json();
                
                const recommendations = data.data.recommendations;
                const metrics = data.data.metrics;
                
                let html = '<h3>🎯 Policy Recommendations</h3>';
                recommendations.forEach(rec => {
                    html += \`<div class="recommendation">💡 \${rec}</div>\`;
                });
                
                html += \`<h3>📊 Current Metrics</h3>\`;
                html += \`<div style="font-family: monospace; font-size: 0.9em;">\`;
                html += \`Economic Health: \${metrics.economicHealth.toFixed(1)}/100\\n\`;
                html += \`Gini Coefficient: \${metrics.giniCoefficient.toFixed(3)}\\n\`;
                html += \`Social Mobility: \${metrics.socialMobilityIndex.toFixed(3)}\`;
                html += \`</div>\`;
                
                document.getElementById('recommendationsOutput').innerHTML = html;
                
            } catch (error) {
                document.getElementById('recommendationsOutput').innerHTML = '<div class="error">Error: ' + error.message + '</div>';
            }
        }

        async function loadTrends() {
            try {
                const response = await fetch(\`/api/civilization-analytics/\${campaignId}/trends\`);
                const data = await response.json();
                
                document.getElementById('trendsOutput').textContent = JSON.stringify(data.data.trends, null, 2);
                
            } catch (error) {
                document.getElementById('trendsOutput').textContent = 'Error: ' + error.message;
            }
        }

        function updateEconomicDisplay(economic) {
            if (!economic) return;
            
            document.getElementById('economicMetrics').style.display = 'grid';
            document.getElementById('giniValue').textContent = economic.giniCoefficient.toFixed(3);
            document.getElementById('economicHealthValue').textContent = economic.economicHealth.toFixed(1);
            document.getElementById('povertyRateValue').textContent = economic.povertyRate.toFixed(1);
            document.getElementById('middleClassValue').textContent = economic.middleClassRate.toFixed(1);
        }

        function updateMobilityDisplay(socialMobility, demographics) {
            document.getElementById('mobilityMetrics').style.display = 'grid';
            
            if (socialMobility) {
                document.getElementById('upwardMobilityValue').textContent = socialMobility.upwardMobility.toFixed(1);
                document.getElementById('educationImpactValue').textContent = socialMobility.educationImpact.toFixed(1);
            }
            
            if (demographics) {
                document.getElementById('employmentRateValue').textContent = demographics.employmentRate.toFixed(1);
                document.getElementById('urbanizationValue').textContent = demographics.urbanizationRate.toFixed(1);
            }
        }

        // Auto-load status on page load
        checkHealth();
    </script>
</body>
</html>
  `);
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🏛️ Civilization Analytics Demo Server running on http://localhost:${PORT}`);
  console.log(`📊 Analytics Dashboard: http://localhost:${PORT}/demo/civilization-analytics`);
  
  await initializeDb();
  
  console.log('\n✅ TASK 45 SYSTEMS READY:');
  console.log('   📊 Economic Inequality Analysis');
  console.log('   📈 Social Mobility Tracking');
  console.log('   👥 Population Demographics');
  console.log('   🎯 Policy Impact Simulation');
  console.log('   📉 Historical Trend Analysis');
  console.log('\n🎯 Visit the dashboard to explore civilization analytics!');
});
