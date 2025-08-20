/**
 * Demographics & Lifecycle Systems Demo
 * 
 * Interactive demonstration of population lifecycle, casualty tracking,
 * plunder management, and demographic analytics.
 */

import express from 'express';

const router = express.Router();

router.get('/demo/demographics', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demographics & Lifecycle Systems Demo</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
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
            color: #333;
            margin: 0;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        .header p {
            color: #666;
            font-size: 1.2em;
            margin: 10px 0 0 0;
        }
        .nav-tabs {
            display: flex;
            background: #f8f9fa;
            border-radius: 10px;
            padding: 5px;
            margin-bottom: 30px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        .nav-tab {
            flex: 1;
            padding: 12px 20px;
            text-align: center;
            background: transparent;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            color: #666;
        }
        .nav-tab.active {
            background: #667eea;
            color: white;
            box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        }
        .nav-tab:hover:not(.active) {
            background: #e9ecef;
            color: #333;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        .section {
            background: white;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.07);
            border: 1px solid #e9ecef;
        }
        .section h3 {
            color: #333;
            margin: 0 0 20px 0;
            font-size: 1.4em;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .icon {
            width: 24px;
            height: 24px;
            background: #667eea;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        .controls {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }
        .btn-primary {
            background: #667eea;
            color: white;
        }
        .btn-primary:hover {
            background: #5a67d8;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        }
        .btn-success {
            background: #48bb78;
            color: white;
        }
        .btn-success:hover {
            background: #38a169;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(72, 187, 120, 0.3);
        }
        .btn-warning {
            background: #ed8936;
            color: white;
        }
        .btn-warning:hover {
            background: #dd6b20;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(237, 137, 54, 0.3);
        }
        .btn-danger {
            background: #f56565;
            color: white;
        }
        .btn-danger:hover {
            background: #e53e3e;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(245, 101, 101, 0.3);
        }
        .data-display {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            border-left: 4px solid #667eea;
        }
        .data-display pre {
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            line-height: 1.4;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .stat-label {
            font-size: 0.9em;
            opacity: 0.9;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
        }
        .form-group input, .form-group select, .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 1em;
            transition: border-color 0.3s ease;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        .error {
            background: #fed7d7;
            color: #c53030;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border: 1px solid #feb2b2;
        }
        .success {
            background: #c6f6d5;
            color: #22543d;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border: 1px solid #9ae6b4;
        }
        .chart-container {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .progress-bar {
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            height: 20px;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 0.8em;
            font-weight: bold;
        }
        .api-links {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .api-links h4 {
            margin: 0 0 15px 0;
            color: #333;
        }
        .api-links a {
            display: inline-block;
            margin: 5px 10px 5px 0;
            padding: 8px 15px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-size: 0.9em;
            transition: background 0.3s ease;
        }
        .api-links a:hover {
            background: #5a67d8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ Demographics & Lifecycle Systems</h1>
            <p>Comprehensive population lifecycle, casualty tracking, and demographic analytics</p>
        </div>

        <div class="nav-tabs">
            <button class="nav-tab active" onclick="showTab('lifespan')">👥 Lifespan Management</button>
            <button class="nav-tab" onclick="showTab('casualties')">⚠️ Casualty Tracking</button>
            <button class="nav-tab" onclick="showTab('plunder')">💰 Plunder & Conquest</button>
            <button class="nav-tab" onclick="showTab('transitions')">📈 Demographic Transitions</button>
            <button class="nav-tab" onclick="showTab('analytics')">📊 Analytics & Projections</button>
        </div>

        <!-- Lifespan Management Tab -->
        <div id="lifespan" class="tab-content active">
            <div class="section">
                <h3><span class="icon">👤</span>Population Lifespan Overview</h3>
                <div class="controls">
                    <button class="btn btn-primary" onclick="loadLifespanData()">📊 Load Population Data</button>
                    <button class="btn btn-success" onclick="simulatePopulation()">🎲 Simulate Population</button>
                    <button class="btn btn-warning" onclick="simulateAging()">⏰ Simulate Aging</button>
                </div>
                <div id="lifespanStats" class="stats-grid"></div>
                <div id="lifespanData" class="data-display" style="display: none;"></div>
            </div>

            <div class="section">
                <h3><span class="icon">➕</span>Create Lifespan Profile</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Citizen ID:</label>
                        <input type="text" id="citizenId" placeholder="e.g., citizen_001">
                    </div>
                    <div class="form-group">
                        <label>Birth Date:</label>
                        <input type="date" id="birthDate">
                    </div>
                </div>
                <button class="btn btn-success" onclick="createLifespanProfile()">Create Profile</button>
                <div id="createLifespanResult"></div>
            </div>
        </div>

        <!-- Casualty Tracking Tab -->
        <div id="casualties" class="tab-content">
            <div class="section">
                <h3><span class="icon">📋</span>Casualty Events Overview</h3>
                <div class="controls">
                    <button class="btn btn-primary" onclick="loadCasualtyData()">📊 Load Casualty Data</button>
                    <button class="btn btn-warning" onclick="generateCasualtyEvent()">⚠️ Generate Sample Event</button>
                </div>
                <div id="casualtyStats" class="stats-grid"></div>
                <div id="casualtyData" class="data-display" style="display: none;"></div>
            </div>

            <div class="section">
                <h3><span class="icon">📝</span>Record Casualty Event</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Event Type:</label>
                        <select id="casualtyType">
                            <option value="warfare">Warfare</option>
                            <option value="crime">Crime</option>
                            <option value="accident">Accident</option>
                            <option value="disaster">Natural Disaster</option>
                            <option value="disease">Disease</option>
                            <option value="terrorism">Terrorism</option>
                            <option value="civil_unrest">Civil Unrest</option>
                            <option value="industrial">Industrial</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Cause:</label>
                        <select id="casualtyCause">
                            <option value="combat">Combat</option>
                            <option value="bombing">Bombing</option>
                            <option value="shooting">Shooting</option>
                            <option value="vehicle_accident">Vehicle Accident</option>
                            <option value="natural_disaster">Natural Disaster</option>
                            <option value="fire">Fire</option>
                            <option value="epidemic">Epidemic</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Location:</label>
                    <input type="text" id="casualtyLocation" placeholder="e.g., Downtown District">
                </div>
                <div class="form-group">
                    <label>Number of Casualties:</label>
                    <input type="number" id="casualtyCount" min="1" max="1000" value="5">
                </div>
                <button class="btn btn-danger" onclick="recordCasualtyEvent()">Record Event</button>
                <div id="recordCasualtyResult"></div>
            </div>
        </div>

        <!-- Plunder & Conquest Tab -->
        <div id="plunder" class="tab-content">
            <div class="section">
                <h3><span class="icon">💎</span>Plunder Events Overview</h3>
                <div class="controls">
                    <button class="btn btn-primary" onclick="loadPlunderData()">📊 Load Plunder Data</button>
                    <button class="btn btn-warning" onclick="generatePlunderEvent()">💰 Generate Sample Event</button>
                </div>
                <div id="plunderStats" class="stats-grid"></div>
                <div id="plunderData" class="data-display" style="display: none;"></div>
            </div>

            <div class="section">
                <h3><span class="icon">⚔️</span>Record Plunder Event</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Plunder Type:</label>
                        <select id="plunderType">
                            <option value="conquest">Conquest</option>
                            <option value="raid">Raid</option>
                            <option value="tribute">Tribute</option>
                            <option value="piracy">Piracy</option>
                            <option value="banditry">Banditry</option>
                            <option value="taxation">Taxation</option>
                            <option value="confiscation">Confiscation</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Total Value:</label>
                        <input type="number" id="plunderValue" min="1000" max="10000000" value="100000">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Source (Conquered/Target):</label>
                        <input type="text" id="plunderSource" placeholder="e.g., Enemy Territory">
                    </div>
                    <div class="form-group">
                        <label>Target (Receiving):</label>
                        <input type="text" id="plunderTarget" placeholder="e.g., Capital City">
                    </div>
                </div>
                <button class="btn btn-success" onclick="recordPlunderEvent()">Record Plunder</button>
                <div id="recordPlunderResult"></div>
            </div>
        </div>

        <!-- Demographic Transitions Tab -->
        <div id="transitions" class="tab-content">
            <div class="section">
                <h3><span class="icon">📈</span>Demographic Transitions Overview</h3>
                <div class="controls">
                    <button class="btn btn-primary" onclick="loadTransitionData()">📊 Load Transition Data</button>
                    <button class="btn btn-warning" onclick="generateTransition()">🔄 Generate Sample Transition</button>
                </div>
                <div id="transitionStats" class="stats-grid"></div>
                <div id="transitionData" class="data-display" style="display: none;"></div>
            </div>

            <div class="section">
                <h3><span class="icon">🚀</span>Initiate Demographic Transition</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Transition Type:</label>
                        <select id="transitionType">
                            <option value="demographic_transition">Demographic Transition</option>
                            <option value="population_boom">Population Boom</option>
                            <option value="population_decline">Population Decline</option>
                            <option value="aging_society">Aging Society</option>
                            <option value="youth_bulge">Youth Bulge</option>
                            <option value="migration_wave">Migration Wave</option>
                            <option value="urbanization">Urbanization</option>
                            <option value="rural_exodus">Rural Exodus</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Affected Population:</label>
                        <input type="number" id="affectedPopulation" min="100" max="1000000" value="10000">
                    </div>
                </div>
                <div class="form-group">
                    <label>Cause:</label>
                    <input type="text" id="transitionCause" placeholder="e.g., Economic Development">
                </div>
                <button class="btn btn-primary" onclick="initiateTransition()">Initiate Transition</button>
                <div id="initiateTransitionResult"></div>
            </div>
        </div>

        <!-- Analytics & Projections Tab -->
        <div id="analytics" class="tab-content">
            <div class="section">
                <h3><span class="icon">📊</span>Comprehensive Analytics</h3>
                <div class="controls">
                    <button class="btn btn-primary" onclick="loadAnalytics()">📈 Load Full Analytics</button>
                    <button class="btn btn-success" onclick="loadPopulationGrowth()">👥 Population Growth</button>
                    <button class="btn btn-warning" onclick="loadMortalityAnalysis()">💀 Mortality Analysis</button>
                    <button class="btn btn-danger" onclick="loadCasualtyAnalysis()">⚠️ Casualty Analysis</button>
                </div>
                <div id="analyticsStats" class="stats-grid"></div>
                <div id="analyticsData" class="data-display" style="display: none;"></div>
            </div>

            <div class="section">
                <h3><span class="icon">🔮</span>Demographic Projections</h3>
                <div class="controls">
                    <button class="btn btn-primary" onclick="loadProjections()">📊 Load Projections</button>
                    <button class="btn btn-success" onclick="loadHealthMetrics()">🏥 Health Metrics</button>
                    <button class="btn btn-warning" onclick="loadRecommendations()">💡 Recommendations</button>
                </div>
                <div id="projectionsData" class="data-display" style="display: none;"></div>
            </div>
        </div>

        <!-- API Links -->
        <div class="api-links">
            <h4>🔗 API Endpoints</h4>
            <a href="/api/demographics/health" target="_blank">Health Check</a>
            <a href="/api/demographics/lifespan" target="_blank">Lifespan Data</a>
            <a href="/api/demographics/casualties" target="_blank">Casualty Events</a>
            <a href="/api/demographics/plunder" target="_blank">Plunder Events</a>
            <a href="/api/demographics/transitions" target="_blank">Demographic Transitions</a>
            <a href="/api/demographics/analytics" target="_blank">Full Analytics</a>
            <a href="/api/demographics/analytics/population-growth" target="_blank">Population Growth</a>
            <a href="/api/demographics/analytics/mortality" target="_blank">Mortality Analysis</a>
            <a href="/api/demographics/analytics/casualties" target="_blank">Casualty Analysis</a>
            <a href="/api/demographics/analytics/projections" target="_blank">Projections</a>
            <a href="/api/demographics/analytics/health" target="_blank">Health Metrics</a>
            <a href="/api/demographics/analytics/recommendations" target="_blank">Recommendations</a>
        </div>
    </div>

    <script>
        function showTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all nav tabs
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabName).classList.add('active');
            
            // Add active class to clicked nav tab
            event.target.classList.add('active');
        }

        function showLoading(elementId) {
            document.getElementById(elementId).innerHTML = '<div class="loading">Loading...</div>';
        }

        function showError(elementId, message) {
            document.getElementById(elementId).innerHTML = \`<div class="error">Error: \${message}</div>\`;
        }

        function showSuccess(elementId, message) {
            document.getElementById(elementId).innerHTML = \`<div class="success">\${message}</div>\`;
        }

        // Lifespan Management Functions
        async function loadLifespanData() {
            showLoading('lifespanStats');
            try {
                const response = await fetch('/api/demographics/lifespan');
                const result = await response.json();
                
                if (result.success) {
                    const stats = result.data.summary;
                    document.getElementById('lifespanStats').innerHTML = \`
                        <div class="stat-card">
                            <div class="stat-value">\${result.data.totalProfiles}</div>
                            <div class="stat-label">Total Profiles</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">\${stats.averageAge.toFixed(1)}</div>
                            <div class="stat-label">Average Age</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">\${stats.averageLifeExpectancy.toFixed(1)}</div>
                            <div class="stat-label">Life Expectancy</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">\${(stats.averageMortalityRisk * 100).toFixed(2)}%</div>
                            <div class="stat-label">Mortality Risk</div>
                        </div>
                    \`;
                    
                    document.getElementById('lifespanData').style.display = 'block';
                    document.getElementById('lifespanData').innerHTML = \`<pre>\${JSON.stringify(result.data, null, 2)}</pre>\`;
                } else {
                    showError('lifespanStats', result.error);
                }
            } catch (error) {
                showError('lifespanStats', error.message);
            }
        }

        async function simulatePopulation() {
            showLoading('lifespanStats');
            try {
                const response = await fetch('/api/demographics/simulate/populate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ count: 100 })
                });
                const result = await response.json();
                
                if (result.success) {
                    showSuccess('createLifespanResult', \`Created \${result.data.createdProfiles} population profiles. Total population: \${result.data.totalPopulation}\`);
                    loadLifespanData(); // Refresh data
                } else {
                    showError('createLifespanResult', result.error);
                }
            } catch (error) {
                showError('createLifespanResult', error.message);
            }
        }

        async function simulateAging() {
            showLoading('lifespanStats');
            try {
                const response = await fetch('/api/demographics/simulate/aging', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const result = await response.json();
                
                if (result.success) {
                    showSuccess('createLifespanResult', \`Processed \${result.data.processedProfiles} profiles. Natural deaths: \${result.data.naturalDeaths}. Remaining population: \${result.data.remainingPopulation}\`);
                    loadLifespanData(); // Refresh data
                } else {
                    showError('createLifespanResult', result.error);
                }
            } catch (error) {
                showError('createLifespanResult', error.message);
            }
        }

        async function createLifespanProfile() {
            const citizenId = document.getElementById('citizenId').value;
            const birthDate = document.getElementById('birthDate').value;
            
            if (!citizenId || !birthDate) {
                showError('createLifespanResult', 'Please fill in all fields');
                return;
            }

            try {
                const response = await fetch('/api/demographics/lifespan/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ citizenId, birthDate })
                });
                const result = await response.json();
                
                if (result.success) {
                    showSuccess('createLifespanResult', 'Lifespan profile created successfully');
                    document.getElementById('createLifespanResult').innerHTML += \`<div class="data-display"><pre>\${JSON.stringify(result.data, null, 2)}</pre></div>\`;
                    loadLifespanData(); // Refresh data
                } else {
                    showError('createLifespanResult', result.error);
                }
            } catch (error) {
                showError('createLifespanResult', error.message);
            }
        }

        // Casualty Management Functions
        async function loadCasualtyData() {
            showLoading('casualtyStats');
            try {
                const response = await fetch('/api/demographics/casualties');
                const result = await response.json();
                
                if (result.success) {
                    const data = result.data;
                    document.getElementById('casualtyStats').innerHTML = \`
                        <div class="stat-card">
                            <div class="stat-value">\${data.totalEvents}</div>
                            <div class="stat-label">Total Events</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">\${data.totalCasualties}</div>
                            <div class="stat-label">Total Casualties</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">\${data.summary.averageResponseTime.toFixed(1)}m</div>
                            <div class="stat-label">Avg Response Time</div>
                        </div>
                    \`;
                    
                    document.getElementById('casualtyData').style.display = 'block';
                    document.getElementById('casualtyData').innerHTML = \`<pre>\${JSON.stringify(result.data, null, 2)}</pre>\`;
                } else {
                    showError('casualtyStats', result.error);
                }
            } catch (error) {
                showError('casualtyStats', error.message);
            }
        }

        async function generateCasualtyEvent() {
            const casualties = [];
            const count = Math.floor(Math.random() * 10) + 1;
            
            for (let i = 0; i < count; i++) {
                casualties.push({
                    citizenId: \`casualty_\${Date.now()}_\${i}\`,
                    outcome: ['death', 'critical_injury', 'serious_injury', 'minor_injury'][Math.floor(Math.random() * 4)],
                    injuryType: ['trauma', 'burn', 'fracture', 'laceration'][Math.floor(Math.random() * 4)],
                    severity: ['minor', 'moderate', 'severe', 'life_threatening'][Math.floor(Math.random() * 4)],
                    treatmentRequired: Math.random() > 0.3,
                    recoveryTime: Math.floor(Math.random() * 30),
                    permanentDisability: Math.random() > 0.8,
                    economicLoss: Math.floor(Math.random() * 50000)
                });
            }

            try {
                const response = await fetch('/api/demographics/casualties/record', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'accident',
                        cause: 'vehicle_accident',
                        location: 'Highway 101',
                        casualties
                    })
                });
                const result = await response.json();
                
                if (result.success) {
                    showSuccess('recordCasualtyResult', 'Sample casualty event generated successfully');
                    loadCasualtyData(); // Refresh data
                } else {
                    showError('recordCasualtyResult', result.error);
                }
            } catch (error) {
                showError('recordCasualtyResult', error.message);
            }
        }

        async function recordCasualtyEvent() {
            const type = document.getElementById('casualtyType').value;
            const cause = document.getElementById('casualtyCause').value;
            const location = document.getElementById('casualtyLocation').value;
            const count = parseInt(document.getElementById('casualtyCount').value);
            
            if (!location || !count) {
                showError('recordCasualtyResult', 'Please fill in all fields');
                return;
            }

            // Generate casualties
            const casualties = [];
            for (let i = 0; i < count; i++) {
                casualties.push({
                    citizenId: \`casualty_\${Date.now()}_\${i}\`,
                    outcome: ['death', 'critical_injury', 'serious_injury', 'minor_injury'][Math.floor(Math.random() * 4)],
                    injuryType: ['trauma', 'burn', 'fracture', 'laceration'][Math.floor(Math.random() * 4)],
                    severity: ['minor', 'moderate', 'severe', 'life_threatening'][Math.floor(Math.random() * 4)],
                    treatmentRequired: Math.random() > 0.3,
                    recoveryTime: Math.floor(Math.random() * 30),
                    permanentDisability: Math.random() > 0.8,
                    economicLoss: Math.floor(Math.random() * 50000)
                });
            }

            try {
                const response = await fetch('/api/demographics/casualties/record', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, cause, location, casualties })
                });
                const result = await response.json();
                
                if (result.success) {
                    showSuccess('recordCasualtyResult', 'Casualty event recorded successfully');
                    document.getElementById('recordCasualtyResult').innerHTML += \`<div class="data-display"><pre>\${JSON.stringify(result.data, null, 2)}</pre></div>\`;
                    loadCasualtyData(); // Refresh data
                } else {
                    showError('recordCasualtyResult', result.error);
                }
            } catch (error) {
                showError('recordCasualtyResult', error.message);
            }
        }

        // Plunder Management Functions
        async function loadPlunderData() {
            showLoading('plunderStats');
            try {
                const response = await fetch('/api/demographics/plunder');
                const result = await response.json();
                
                if (result.success) {
                    const data = result.data;
                    document.getElementById('plunderStats').innerHTML = \`
                        <div class="stat-card">
                            <div class="stat-value">\${data.totalEvents}</div>
                            <div class="stat-label">Total Events</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">$\${(data.totalValue / 1000000).toFixed(1)}M</div>
                            <div class="stat-label">Total Value</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">$\${(data.summary.averageValue / 1000).toFixed(0)}K</div>
                            <div class="stat-label">Average Value</div>
                        </div>
                    \`;
                    
                    document.getElementById('plunderData').style.display = 'block';
                    document.getElementById('plunderData').innerHTML = \`<pre>\${JSON.stringify(result.data, null, 2)}</pre>\`;
                } else {
                    showError('plunderStats', result.error);
                }
            } catch (error) {
                showError('plunderStats', error.message);
            }
        }

        async function generatePlunderEvent() {
            try {
                const response = await fetch('/api/demographics/plunder/record', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'conquest',
                        source: 'Enemy Fortress',
                        target: 'Capital Treasury',
                        totalValue: Math.floor(Math.random() * 1000000) + 100000
                    })
                });
                const result = await response.json();
                
                if (result.success) {
                    showSuccess('recordPlunderResult', 'Sample plunder event generated successfully');
                    loadPlunderData(); // Refresh data
                } else {
                    showError('recordPlunderResult', result.error);
                }
            } catch (error) {
                showError('recordPlunderResult', error.message);
            }
        }

        async function recordPlunderEvent() {
            const type = document.getElementById('plunderType').value;
            const source = document.getElementById('plunderSource').value;
            const target = document.getElementById('plunderTarget').value;
            const totalValue = parseInt(document.getElementById('plunderValue').value);
            
            if (!source || !target || !totalValue) {
                showError('recordPlunderResult', 'Please fill in all fields');
                return;
            }

            try {
                const response = await fetch('/api/demographics/plunder/record', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, source, target, totalValue })
                });
                const result = await response.json();
                
                if (result.success) {
                    showSuccess('recordPlunderResult', 'Plunder event recorded successfully');
                    document.getElementById('recordPlunderResult').innerHTML += \`<div class="data-display"><pre>\${JSON.stringify(result.data, null, 2)}</pre></div>\`;
                    loadPlunderData(); // Refresh data
                } else {
                    showError('recordPlunderResult', result.error);
                }
            } catch (error) {
                showError('recordPlunderResult', error.message);
            }
        }

        // Demographic Transitions Functions
        async function loadTransitionData() {
            showLoading('transitionStats');
            try {
                const response = await fetch('/api/demographics/transitions');
                const result = await response.json();
                
                if (result.success) {
                    const data = result.data;
                    document.getElementById('transitionStats').innerHTML = \`
                        <div class="stat-card">
                            <div class="stat-value">\${data.totalTransitions}</div>
                            <div class="stat-label">Total Transitions</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">\${data.summary.totalAffectedPopulation.toLocaleString()}</div>
                            <div class="stat-label">Affected Population</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">\${data.summary.activeTransitions}</div>
                            <div class="stat-label">Active Transitions</div>
                        </div>
                    \`;
                    
                    document.getElementById('transitionData').style.display = 'block';
                    document.getElementById('transitionData').innerHTML = \`<pre>\${JSON.stringify(result.data, null, 2)}</pre>\`;
                } else {
                    showError('transitionStats', result.error);
                }
            } catch (error) {
                showError('transitionStats', error.message);
            }
        }

        async function generateTransition() {
            try {
                const response = await fetch('/api/demographics/transitions/initiate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'urbanization',
                        cause: 'economic_development',
                        affectedPopulation: Math.floor(Math.random() * 50000) + 10000
                    })
                });
                const result = await response.json();
                
                if (result.success) {
                    showSuccess('initiateTransitionResult', 'Sample demographic transition generated successfully');
                    loadTransitionData(); // Refresh data
                } else {
                    showError('initiateTransitionResult', result.error);
                }
            } catch (error) {
                showError('initiateTransitionResult', error.message);
            }
        }

        async function initiateTransition() {
            const type = document.getElementById('transitionType').value;
            const cause = document.getElementById('transitionCause').value;
            const affectedPopulation = parseInt(document.getElementById('affectedPopulation').value);
            
            if (!cause || !affectedPopulation) {
                showError('initiateTransitionResult', 'Please fill in all fields');
                return;
            }

            try {
                const response = await fetch('/api/demographics/transitions/initiate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, cause, affectedPopulation })
                });
                const result = await response.json();
                
                if (result.success) {
                    showSuccess('initiateTransitionResult', 'Demographic transition initiated successfully');
                    document.getElementById('initiateTransitionResult').innerHTML += \`<div class="data-display"><pre>\${JSON.stringify(result.data, null, 2)}</pre></div>\`;
                    loadTransitionData(); // Refresh data
                } else {
                    showError('initiateTransitionResult', result.error);
                }
            } catch (error) {
                showError('initiateTransitionResult', error.message);
            }
        }

        // Analytics Functions
        async function loadAnalytics() {
            showLoading('analyticsStats');
            try {
                const response = await fetch('/api/demographics/analytics');
                const result = await response.json();
                
                if (result.success) {
                    const data = result.data;
                    document.getElementById('analyticsStats').innerHTML = \`
                        <div class="stat-card">
                            <div class="stat-value">\${data.populationGrowth.currentGrowthRate.toFixed(2)}%</div>
                            <div class="stat-label">Growth Rate</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">\${data.healthMetrics.overallHealthIndex.toFixed(0)}</div>
                            <div class="stat-label">Health Index</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">\${data.recommendations.length}</div>
                            <div class="stat-label">Recommendations</div>
                        </div>
                    \`;
                    
                    document.getElementById('analyticsData').style.display = 'block';
                    document.getElementById('analyticsData').innerHTML = \`<pre>\${JSON.stringify(result.data, null, 2)}</pre>\`;
                } else {
                    showError('analyticsStats', result.error);
                }
            } catch (error) {
                showError('analyticsStats', error.message);
            }
        }

        async function loadPopulationGrowth() {
            showLoading('analyticsStats');
            try {
                const response = await fetch('/api/demographics/analytics/population-growth');
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('analyticsData').style.display = 'block';
                    document.getElementById('analyticsData').innerHTML = \`<pre>\${JSON.stringify(result.data, null, 2)}</pre>\`;
                    document.getElementById('analyticsStats').innerHTML = \`
                        <div class="stat-card">
                            <div class="stat-value">\${result.data.currentGrowthRate.toFixed(2)}%</div>
                            <div class="stat-label">Current Growth Rate</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">\${result.data.doubleTime.toFixed(0)} years</div>
                            <div class="stat-label">Population Double Time</div>
                        </div>
                    \`;
                } else {
                    showError('analyticsStats', result.error);
                }
            } catch (error) {
                showError('analyticsStats', error.message);
            }
        }

        async function loadMortalityAnalysis() {
            showLoading('analyticsStats');
            try {
                const response = await fetch('/api/demographics/analytics/mortality');
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('analyticsData').style.display = 'block';
                    document.getElementById('analyticsData').innerHTML = \`<pre>\${JSON.stringify(result.data, null, 2)}</pre>\`;
                    document.getElementById('analyticsStats').innerHTML = \`
                        <div class="stat-card">
                            <div class="stat-value">\${result.data.preventableDeaths}</div>
                            <div class="stat-label">Preventable Deaths</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">\${result.data.interventionOpportunities.length}</div>
                            <div class="stat-label">Intervention Opportunities</div>
                        </div>
                    \`;
                } else {
                    showError('analyticsStats', result.error);
                }
            } catch (error) {
                showError('analyticsStats', error.message);
            }
        }

        async function loadCasualtyAnalysis() {
            showLoading('analyticsStats');
            try {
                const response = await fetch('/api/demographics/analytics/casualties');
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('analyticsData').style.display = 'block';
                    document.getElementById('analyticsData').innerHTML = \`<pre>\${JSON.stringify(result.data, null, 2)}</pre>\`;
                    document.getElementById('analyticsStats').innerHTML = \`
                        <div class="stat-card">
                            <div class="stat-value">\${result.data.totalCasualties}</div>
                            <div class="stat-label">Total Casualties</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">\${result.data.casualtyRate.toFixed(1)}</div>
                            <div class="stat-label">Casualty Rate</div>
                        </div>
                    \`;
                } else {
                    showError('analyticsStats', result.error);
                }
            } catch (error) {
                showError('analyticsStats', error.message);
            }
        }

        async function loadProjections() {
            showLoading('projectionsData');
            try {
                const response = await fetch('/api/demographics/analytics/projections');
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('projectionsData').style.display = 'block';
                    document.getElementById('projectionsData').innerHTML = \`<pre>\${JSON.stringify(result.data, null, 2)}</pre>\`;
                } else {
                    showError('projectionsData', result.error);
                }
            } catch (error) {
                showError('projectionsData', error.message);
            }
        }

        async function loadHealthMetrics() {
            showLoading('projectionsData');
            try {
                const response = await fetch('/api/demographics/analytics/health');
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('projectionsData').style.display = 'block';
                    document.getElementById('projectionsData').innerHTML = \`<pre>\${JSON.stringify(result.data, null, 2)}</pre>\`;
                } else {
                    showError('projectionsData', result.error);
                }
            } catch (error) {
                showError('projectionsData', error.message);
            }
        }

        async function loadRecommendations() {
            showLoading('projectionsData');
            try {
                const response = await fetch('/api/demographics/analytics/recommendations');
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('projectionsData').style.display = 'block';
                    document.getElementById('projectionsData').innerHTML = \`<pre>\${JSON.stringify(result.data, null, 2)}</pre>\`;
                } else {
                    showError('projectionsData', result.error);
                }
            } catch (error) {
                showError('projectionsData', error.message);
            }
        }

        // Initialize with some sample data
        document.addEventListener('DOMContentLoaded', function() {
            // Set default birth date to 30 years ago
            const thirtyYearsAgo = new Date();
            thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30);
            document.getElementById('birthDate').value = thirtyYearsAgo.toISOString().split('T')[0];
        });
    </script>
</body>
</html>
  `;

  res.send(html);
});

export default router;
