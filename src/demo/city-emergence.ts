/**
 * City Emergence System Demo
 * 
 * Interactive demo for the dynamic city emergence system
 */

import express from 'express';

const router = express.Router();

router.get('/demo/city-emergence', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>City Emergence System</title>
        <link rel="stylesheet" href="/styles.css">
        <style>
            .emergence-dashboard {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            .emergence-panel {
                background-color: #1a1a1a;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            .emergence-panel h3 {
                color: #4CAF50;
                margin-top: 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .expansion-pressure {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background-color: #2a2a2a;
                border-radius: 8px;
                margin: 15px 0;
            }
            .pressure-bar {
                flex: 1;
                height: 20px;
                background-color: #333;
                border-radius: 10px;
                margin: 0 15px;
                overflow: hidden;
            }
            .pressure-fill {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50 0%, #FFC107 50%, #F44336 100%);
                transition: width 0.5s ease;
                border-radius: 10px;
            }
            .emergence-history {
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid #333;
                border-radius: 8px;
                padding: 10px;
            }
            .history-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px;
                border-bottom: 1px solid #333;
                font-size: 0.9em;
            }
            .history-item:last-child {
                border-bottom: none;
            }
            .city-name {
                font-weight: bold;
                color: #66BB6A;
            }
            .emergence-reason {
                color: #FFC107;
                font-size: 0.8em;
            }
            .location-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            .location-card {
                background-color: #2a2a2a;
                border-radius: 8px;
                padding: 15px;
                border: 2px solid transparent;
                transition: border-color 0.3s ease;
            }
            .location-card.high-suitability {
                border-color: #4CAF50;
            }
            .location-card.medium-suitability {
                border-color: #FFC107;
            }
            .location-card.low-suitability {
                border-color: #FF9800;
            }
            .suitability-score {
                font-size: 1.2em;
                font-weight: bold;
                color: #4CAF50;
            }
            .condition-toggle {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background-color: #2a2a2a;
                border-radius: 8px;
                margin: 8px 0;
            }
            .condition-toggle input[type="checkbox"] {
                transform: scale(1.2);
            }
            .condition-toggle input[type="range"] {
                width: 100px;
                margin-left: 10px;
            }
            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            .metric-card {
                background-color: #2a2a2a;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
            }
            .metric-value {
                font-size: 1.8em;
                font-weight: bold;
                color: #66BB6A;
                display: block;
            }
            .metric-label {
                color: #bbb;
                font-size: 0.9em;
                margin-top: 5px;
            }
            .action-buttons {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }
            .action-btn {
                flex: 1;
                padding: 12px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                transition: background-color 0.3s ease;
            }
            .action-btn:hover {
                background-color: #45a049;
            }
            .action-btn.secondary {
                background-color: #2196F3;
            }
            .action-btn.secondary:hover {
                background-color: #1976D2;
            }
            .action-btn:disabled {
                background-color: #666;
                cursor: not-allowed;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🌱 City Emergence System</h1>
            <div class="tab-buttons">
                <button class="tab-button active" onclick="showTab('overview')">Overview</button>
                <button class="tab-button" onclick="showTab('conditions')">Conditions</button>
                <button class="tab-button" onclick="showTab('locations')">Locations</button>
                <button class="tab-button" onclick="showTab('history')">History</button>
                <button class="tab-button" onclick="showTab('analytics')">Analytics</button>
                <button class="tab-button" onclick="showTab('settings')">Settings</button>
            </div>

            <div id="overview-tab" class="tab-content active">
                <div class="emergence-dashboard">
                    <div class="emergence-panel">
                        <h3>🎯 Expansion Analysis</h3>
                        <div class="metrics-grid" id="expansionMetrics"></div>
                        
                        <div class="expansion-pressure">
                            <span>Expansion Pressure:</span>
                            <div class="pressure-bar">
                                <div class="pressure-fill" id="pressureFill" style="width: 0%"></div>
                            </div>
                            <span id="pressureValue">0%</span>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="action-btn" onclick="evaluateEmergence()">
                                🔍 Evaluate Emergence
                            </button>
                            <button class="action-btn secondary" onclick="refreshAnalysis()">
                                🔄 Refresh Analysis
                            </button>
                        </div>
                    </div>

                    <div class="emergence-panel">
                        <h3>📊 Current Status</h3>
                        <div id="currentStatus">
                            <p>Loading expansion status...</p>
                        </div>
                    </div>
                </div>
            </div>

            <div id="conditions-tab" class="tab-content">
                <div class="emergence-panel">
                    <h3>⚙️ Emergence Conditions</h3>
                    <p>Configure the conditions that trigger new city emergence:</p>
                    <div id="emergenceConditions"></div>
                </div>
            </div>

            <div id="locations-tab" class="tab-content">
                <div class="emergence-panel">
                    <h3>📍 Potential Locations</h3>
                    <p>Scouted locations suitable for new city development:</p>
                    <div class="location-grid" id="potentialLocations"></div>
                </div>
            </div>

            <div id="history-tab" class="tab-content">
                <div class="emergence-panel">
                    <h3>📜 Emergence History</h3>
                    <div class="emergence-history" id="emergenceHistory"></div>
                </div>
            </div>

            <div id="analytics-tab" class="tab-content">
                <div class="emergence-dashboard">
                    <div class="emergence-panel">
                        <h3>📈 Emergence Analytics</h3>
                        <div id="emergenceAnalytics"></div>
                    </div>
                </div>
            </div>

            <div id="settings-tab" class="tab-content">
                <div class="emergence-panel">
                    <h3>🛠️ System Settings</h3>
                    <div id="systemSettings">
                        <p>Configure global city emergence parameters:</p>
                        <div class="condition-toggle">
                            <label>Auto-Evaluation Enabled:</label>
                            <input type="checkbox" id="autoEvaluationToggle" checked>
                        </div>
                        <div class="condition-toggle">
                            <label>Evaluation Frequency (hours):</label>
                            <input type="range" id="evaluationFrequency" min="1" max="24" value="6">
                            <span id="frequencyValue">6</span>
                        </div>
                        <div class="condition-toggle">
                            <label>Max Cities Per Evaluation:</label>
                            <input type="range" id="maxCitiesPerEval" min="1" max="5" value="1">
                            <span id="maxCitiesValue">1</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            const API_BASE_URL = '/api/city-emergence';
            let currentCivilizationId = 1; // Default civilization ID
            let currentData = {};

            async function fetchData(url) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
                    return await response.json();
                } catch (error) {
                    console.error('Fetch error:', error);
                    throw error;
                }
            }

            async function postData(url, data) {
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
                    return await response.json();
                } catch (error) {
                    console.error('Post error:', error);
                    throw error;
                }
            }

            async function putData(url, data) {
                try {
                    const response = await fetch(url, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
                    return await response.json();
                } catch (error) {
                    console.error('Put error:', error);
                    throw error;
                }
            }

            async function loadOverview() {
                try {
                    const data = await fetchData(\`\${API_BASE_URL}/expansion/\${currentCivilizationId}\`);
                    currentData.expansion = data;
                    
                    displayExpansionMetrics(data.expansionState);
                    displayCurrentStatus(data);
                    updatePressureBar(data.expansionState.expansionPressure);
                    
                } catch (error) {
                    document.getElementById('expansionMetrics').innerHTML = 
                        '<p style="color: #f44336;">Error loading expansion data</p>';
                }
            }

            function displayExpansionMetrics(state) {
                const metricsHtml = \`
                    <div class="metric-card">
                        <span class="metric-value">\${state.currentCities}</span>
                        <div class="metric-label">Current Cities</div>
                    </div>
                    <div class="metric-card">
                        <span class="metric-value">\${(state.totalPopulation / 1000000).toFixed(1)}M</span>
                        <div class="metric-label">Total Population</div>
                    </div>
                    <div class="metric-card">
                        <span class="metric-value">\${(state.economicOutput / 1000000000).toFixed(1)}B</span>
                        <div class="metric-label">Economic Output</div>
                    </div>
                    <div class="metric-card">
                        <span class="metric-value">\${state.technologyLevel.toFixed(1)}</span>
                        <div class="metric-label">Tech Level</div>
                    </div>
                \`;
                document.getElementById('expansionMetrics').innerHTML = metricsHtml;
            }

            function displayCurrentStatus(data) {
                const status = data.expansionState;
                const daysSinceExpansion = Math.floor(
                    (Date.now() - new Date(status.lastExpansion).getTime()) / (1000 * 60 * 60 * 24)
                );
                
                const statusHtml = \`
                    <div class="metric">
                        <span class="metric-label">Expansion Readiness:</span>
                        <span class="metric-value" style="color: \${data.emergenceReadiness ? '#4CAF50' : '#FFC107'}">\${data.emergenceReadiness ? 'Ready' : 'Not Ready'}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Recommended Action:</span>
                        <span class="metric-value">\${data.recommendedAction.replace(/_/g, ' ').toUpperCase()}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Days Since Last Expansion:</span>
                        <span class="metric-value">\${daysSinceExpansion}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Available Territory:</span>
                        <span class="metric-value">\${status.availableTerritory.toFixed(0)} units</span>
                    </div>
                \`;
                document.getElementById('currentStatus').innerHTML = statusHtml;
            }

            function updatePressureBar(pressure) {
                const fill = document.getElementById('pressureFill');
                const value = document.getElementById('pressureValue');
                
                fill.style.width = pressure + '%';
                value.textContent = Math.round(pressure) + '%';
            }

            async function loadHistory() {
                try {
                    const data = await fetchData(\`\${API_BASE_URL}/history/\${currentCivilizationId}\`);
                    currentData.history = data;
                    
                    const historyHtml = data.history.map(emergence => \`
                        <div class="history-item">
                            <div>
                                <div class="city-name">\${emergence.city_name}</div>
                                <div class="emergence-reason">\${emergence.emergence_reason}</div>
                            </div>
                            <div style="text-align: right; color: #bbb;">
                                <div>\${new Date(emergence.founded_date).toLocaleDateString()}</div>
                                <div>\${emergence.initial_population.toLocaleString()} pop</div>
                            </div>
                        </div>
                    \`).join('');
                    
                    document.getElementById('emergenceHistory').innerHTML = 
                        historyHtml || '<p style="color: #888;">No emergence history yet</p>';
                        
                } catch (error) {
                    document.getElementById('emergenceHistory').innerHTML = 
                        '<p style="color: #f44336;">Error loading history</p>';
                }
            }

            async function loadLocations() {
                try {
                    const data = await fetchData(\`\${API_BASE_URL}/locations/\${currentCivilizationId}\`);
                    currentData.locations = data;
                    
                    const locationsHtml = data.potentialLocations.map(location => {
                        const suitabilityClass = 
                            location.suitability_score >= 80 ? 'high-suitability' :
                            location.suitability_score >= 60 ? 'medium-suitability' : 'low-suitability';
                        
                        return \`
                            <div class="location-card \${suitabilityClass}">
                                <div class="suitability-score">\${location.suitability_score.toFixed(0)}%</div>
                                <div style="color: #bbb; font-size: 0.9em; margin-top: 5px;">
                                    <div><strong>Terrain:</strong> \${location.terrain}</div>
                                    <div><strong>Climate:</strong> \${location.climate}</div>
                                    <div><strong>Strategic Value:</strong> \${location.strategic_value.toFixed(0)}</div>
                                    <div><strong>Distance:</strong> \${location.distance_to_nearest_city.toFixed(0)}km</div>
                                </div>
                                <div style="margin-top: 10px;">
                                    <strong>Resources:</strong> \${JSON.parse(location.nearby_resources || '[]').join(', ') || 'None'}
                                </div>
                            </div>
                        \`;
                    }).join('');
                    
                    document.getElementById('potentialLocations').innerHTML = 
                        locationsHtml || '<p style="color: #888;">No potential locations scouted</p>';
                        
                } catch (error) {
                    document.getElementById('potentialLocations').innerHTML = 
                        '<p style="color: #f44336;">Error loading locations</p>';
                }
            }

            async function loadAnalytics() {
                try {
                    const data = await fetchData(\`\${API_BASE_URL}/analytics/\${currentCivilizationId}\`);
                    currentData.analytics = data;
                    
                    const analyticsHtml = \`
                        <div class="metrics-grid">
                            <div class="metric-card">
                                <span class="metric-value">\${data.totalEmergences}</span>
                                <div class="metric-label">Total Emergences</div>
                            </div>
                            <div class="metric-card">
                                <span class="metric-value">\${data.averageInitialPopulation.toLocaleString()}</span>
                                <div class="metric-label">Avg Initial Pop</div>
                            </div>
                            <div class="metric-card">
                                <span class="metric-value">\${data.emergenceFrequency.toFixed(1)}</span>
                                <div class="metric-label">Months Between</div>
                            </div>
                            <div class="metric-card">
                                <span class="metric-value">\${data.currentExpansionPressure.toFixed(0)}%</span>
                                <div class="metric-label">Current Pressure</div>
                            </div>
                        </div>
                        
                        <h4 style="color: #4CAF50; margin-top: 30px;">Emergences by Condition</h4>
                        <div style="margin-top: 15px;">
                            \${Object.entries(data.emergencesByCondition || {}).map(([condition, count]) => \`
                                <div class="condition-toggle">
                                    <span>\${condition.replace(/_/g, ' ').toUpperCase()}</span>
                                    <span style="color: #66BB6A; font-weight: bold;">\${count} cities</span>
                                </div>
                            \`).join('')}
                        </div>
                        
                        <h4 style="color: #4CAF50; margin-top: 30px;">Emergences by Terrain</h4>
                        <div style="margin-top: 15px;">
                            \${Object.entries(data.emergencesByTerrain || {}).map(([terrain, count]) => \`
                                <div class="condition-toggle">
                                    <span>\${terrain.toUpperCase()}</span>
                                    <span style="color: #66BB6A; font-weight: bold;">\${count} cities</span>
                                </div>
                            \`).join('')}
                        </div>
                    \`;
                    
                    document.getElementById('emergenceAnalytics').innerHTML = analyticsHtml;
                    
                } catch (error) {
                    document.getElementById('emergenceAnalytics').innerHTML = 
                        '<p style="color: #f44336;">Error loading analytics</p>';
                }
            }

            async function loadConditions() {
                // Mock emergence conditions for demo
                const conditions = [
                    { id: 'population_overflow', name: 'Population Overflow', enabled: true, priority: 8 },
                    { id: 'economic_boom', name: 'Economic Boom', enabled: true, priority: 7 },
                    { id: 'resource_discovery', name: 'Resource Discovery', enabled: true, priority: 9 },
                    { id: 'trade_hub_opportunity', name: 'Trade Hub Opportunity', enabled: false, priority: 6 },
                    { id: 'technological_advancement', name: 'Technological Advancement', enabled: true, priority: 5 },
                    { id: 'strategic_expansion', name: 'Strategic Expansion', enabled: false, priority: 4 }
                ];
                
                const conditionsHtml = conditions.map(condition => \`
                    <div class="condition-toggle">
                        <div>
                            <strong>\${condition.name}</strong>
                            <div style="color: #bbb; font-size: 0.9em;">Priority: \${condition.priority}/10</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" \${condition.enabled ? 'checked' : ''} 
                                   onchange="updateCondition('\${condition.id}', this.checked)">
                            <input type="range" min="1" max="10" value="\${condition.priority}" 
                                   onchange="updateConditionPriority('\${condition.id}', this.value)">
                        </div>
                    </div>
                \`).join('');
                
                document.getElementById('emergenceConditions').innerHTML = conditionsHtml;
            }

            async function evaluateEmergence() {
                try {
                    const button = event.target;
                    button.disabled = true;
                    button.textContent = '🔄 Evaluating...';
                    
                    const data = await postData(\`\${API_BASE_URL}/evaluate/\${currentCivilizationId}\`, {});
                    
                    if (data.newCitiesEmerged > 0) {
                        alert(\`🎉 \${data.message}\`);
                        await loadOverview();
                        await loadHistory();
                    } else {
                        alert(\`ℹ️ \${data.message}\`);
                    }
                    
                } catch (error) {
                    alert('❌ Error evaluating emergence: ' + error.message);
                } finally {
                    const button = document.querySelector('button[onclick="evaluateEmergence()"]');
                    button.disabled = false;
                    button.textContent = '🔍 Evaluate Emergence';
                }
            }

            async function refreshAnalysis() {
                await loadOverview();
            }

            async function updateCondition(conditionId, enabled) {
                try {
                    await putData(\`\${API_BASE_URL}/conditions/\${currentCivilizationId}/\${conditionId}\`, {
                        isEnabled: enabled
                    });
                } catch (error) {
                    console.error('Error updating condition:', error);
                }
            }

            async function updateConditionPriority(conditionId, priority) {
                try {
                    await putData(\`\${API_BASE_URL}/conditions/\${currentCivilizationId}/\${conditionId}\`, {
                        priorityModifier: parseFloat(priority) / 10
                    });
                } catch (error) {
                    console.error('Error updating condition priority:', error);
                }
            }

            function showTab(tabId) {
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Remove active class from all tabs
                document.querySelectorAll('.tab-button').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Show selected tab content
                document.getElementById(tabId + '-tab').classList.add('active');
                
                // Add active class to clicked tab
                event.target.classList.add('active');
                
                // Load content for the tab
                switch(tabId) {
                    case 'overview':
                        loadOverview();
                        break;
                    case 'conditions':
                        loadConditions();
                        break;
                    case 'locations':
                        loadLocations();
                        break;
                    case 'history':
                        loadHistory();
                        break;
                    case 'analytics':
                        loadAnalytics();
                        break;
                }
            }

            // Settings event listeners
            document.addEventListener('DOMContentLoaded', () => {
                showTab('overview');
                
                // Settings sliders
                document.getElementById('evaluationFrequency').addEventListener('input', (e) => {
                    document.getElementById('frequencyValue').textContent = e.target.value;
                });
                
                document.getElementById('maxCitiesPerEval').addEventListener('input', (e) => {
                    document.getElementById('maxCitiesValue').textContent = e.target.value;
                });
            });
        </script>
    </body>
    </html>
  `;
  
  res.send(html);
});

export default router;
