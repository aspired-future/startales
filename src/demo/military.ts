/**
 * Enhanced War Simulator Demo Interface
 * 
 * Interactive demonstration of the comprehensive military combat system
 * with AI-driven morale mechanics, alliance warfare, sensor networks,
 * and intelligence operations.
 */

import { Router } from 'express';

const router = Router();

router.get('/demo/military', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced War Simulator - StarTales Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: #e0e6ed;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #64ffda, #448aff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .tabs {
            display: flex;
            margin-bottom: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 5px;
        }
        
        .tab {
            flex: 1;
            padding: 12px 20px;
            text-align: center;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .tab.active {
            background: linear-gradient(45deg, #64ffda, #448aff);
            color: #1a1a2e;
        }
        
        .tab:hover:not(.active) {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .tab-content {
            display: none;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 25px;
            backdrop-filter: blur(10px);
        }
        
        .tab-content.active {
            display: block;
        }
        
        .grid {
            display: grid;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .grid-2 {
            grid-template-columns: 1fr 1fr;
        }
        
        .grid-3 {
            grid-template-columns: 1fr 1fr 1fr;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .card h3 {
            color: #64ffda;
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: #b0bec5;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            color: #e0e6ed;
            font-size: 14px;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #64ffda;
            box-shadow: 0 0 0 2px rgba(100, 255, 218, 0.2);
        }
        
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }
        
        .btn-primary {
            background: linear-gradient(45deg, #64ffda, #448aff);
            color: #1a1a2e;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(100, 255, 218, 0.3);
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: #e0e6ed;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .btn-danger {
            background: linear-gradient(45deg, #ff5722, #f44336);
            color: white;
        }
        
        .status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .status-operational { background: #4caf50; }
        .status-limited { background: #ff9800; }
        .status-non-operational { background: #f44336; }
        .status-destroyed { background: #424242; }
        
        .morale-bar {
            width: 100%;
            height: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        
        .morale-fill {
            height: 100%;
            transition: width 0.3s ease;
            border-radius: 10px;
        }
        
        .morale-high { background: linear-gradient(90deg, #4caf50, #8bc34a); }
        .morale-medium { background: linear-gradient(90deg, #ff9800, #ffc107); }
        .morale-low { background: linear-gradient(90deg, #f44336, #ff5722); }
        
        .battle-log {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            padding: 15px;
            max-height: 300px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.4;
        }
        
        .battle-log .log-entry {
            margin-bottom: 8px;
            padding: 5px;
            border-radius: 4px;
        }
        
        .log-info { background: rgba(33, 150, 243, 0.2); }
        .log-success { background: rgba(76, 175, 80, 0.2); }
        .log-warning { background: rgba(255, 152, 0, 0.2); }
        .log-error { background: rgba(244, 67, 54, 0.2); }
        
        .unit-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
        }
        
        .unit-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .unit-name {
            font-weight: bold;
            color: #64ffda;
        }
        
        .unit-type {
            background: rgba(100, 255, 218, 0.2);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-label {
            font-size: 12px;
            color: #b0bec5;
            margin-bottom: 2px;
        }
        
        .stat-value {
            font-weight: bold;
            color: #64ffda;
        }
        
        .alliance-badge {
            background: linear-gradient(45deg, #9c27b0, #673ab7);
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            margin-left: 8px;
        }
        
        .sensor-network {
            border: 2px solid #64ffda;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            background: rgba(100, 255, 218, 0.05);
        }
        
        .network-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .coverage-indicator {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .coverage-bar {
            width: 100px;
            height: 6px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            overflow: hidden;
        }
        
        .coverage-fill {
            height: 100%;
            background: #64ffda;
            transition: width 0.3s ease;
        }
        
        .intelligence-op {
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin-bottom: 15px;
            background: rgba(255, 152, 0, 0.1);
            border-radius: 0 8px 8px 0;
        }
        
        .op-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .op-status {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .status-planned { background: #2196f3; color: white; }
        .status-active { background: #ff9800; color: white; }
        .status-completed { background: #4caf50; color: white; }
        .status-failed { background: #f44336; color: white; }
        
        .loading {
            text-align: center;
            padding: 20px;
            color: #64ffda;
        }
        
        .error {
            background: rgba(244, 67, 54, 0.2);
            border: 1px solid #f44336;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            color: #ffcdd2;
        }
        
        .success {
            background: rgba(76, 175, 80, 0.2);
            border: 1px solid #4caf50;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            color: #c8e6c9;
        }
        
        @media (max-width: 768px) {
            .grid-2, .grid-3 {
                grid-template-columns: 1fr;
            }
            
            .tabs {
                flex-direction: column;
            }
            
            .header h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚔️ Enhanced War Simulator</h1>
            <p>Comprehensive Military Combat System with AI-Driven Morale, Alliance Warfare & Intelligence Operations</p>
        </div>

        <div class="tabs">
            <div class="tab active" onclick="switchTab('units')">Military Units</div>
            <div class="tab" onclick="switchTab('battles')">Battle Simulation</div>
            <div class="tab" onclick="switchTab('morale')">Morale Analysis</div>
            <div class="tab" onclick="switchTab('alliance')">Alliance Warfare</div>
            <div class="tab" onclick="switchTab('sensors')">Sensor Networks</div>
            <div class="tab" onclick="switchTab('intelligence')">Intelligence Ops</div>
        </div>

        <!-- Military Units Tab -->
        <div id="units-tab" class="tab-content active">
            <div class="grid grid-2">
                <div class="card">
                    <h3>Create Military Unit</h3>
                    <form id="create-unit-form">
                        <div class="form-group">
                            <label>Unit Name</label>
                            <input type="text" id="unit-name" placeholder="1st Armored Division" required>
                        </div>
                        <div class="form-group">
                            <label>Unit Type</label>
                            <select id="unit-type" required>
                                <option value="">Select Type</option>
                                <option value="infantry">Infantry</option>
                                <option value="armor">Armor</option>
                                <option value="artillery">Artillery</option>
                                <option value="air-defense">Air Defense</option>
                                <option value="fighter">Fighter Aircraft</option>
                                <option value="bomber">Bomber Aircraft</option>
                                <option value="destroyer">Destroyer</option>
                                <option value="cruiser">Cruiser</option>
                                <option value="space-fighter">Space Fighter</option>
                                <option value="space-cruiser">Space Cruiser</option>
                                <option value="cyber-warfare">Cyber Warfare</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Combat Domain</label>
                            <select id="unit-domain" required>
                                <option value="">Select Domain</option>
                                <option value="land">Land</option>
                                <option value="sea">Sea</option>
                                <option value="air">Air</option>
                                <option value="space">Space</option>
                                <option value="cyber">Cyber</option>
                                <option value="multi-domain">Multi-Domain</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Unit Size</label>
                            <input type="number" id="unit-size" placeholder="1000" min="1" required>
                        </div>
                        <div class="form-group">
                            <label>Classification</label>
                            <select id="unit-classification" required>
                                <option value="">Select Classification</option>
                                <option value="light">Light</option>
                                <option value="medium">Medium</option>
                                <option value="heavy">Heavy</option>
                                <option value="elite">Elite</option>
                                <option value="veteran">Veteran</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Create Unit</button>
                    </form>
                </div>
                
                <div class="card">
                    <h3>Military Units Overview</h3>
                    <div id="units-overview">
                        <div class="loading">Loading military units...</div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>Active Military Units</h3>
                <div id="units-list">
                    <div class="loading">Loading units...</div>
                </div>
            </div>
        </div>

        <!-- Battle Simulation Tab -->
        <div id="battles-tab" class="tab-content">
            <div class="grid grid-2">
                <div class="card">
                    <h3>Battle Simulator</h3>
                    <form id="battle-form">
                        <div class="form-group">
                            <label>Attacking Units (comma-separated IDs)</label>
                            <input type="text" id="attacker-units" placeholder="unit_1, unit_2" required>
                        </div>
                        <div class="form-group">
                            <label>Defending Units (comma-separated IDs)</label>
                            <input type="text" id="defender-units" placeholder="unit_3, unit_4" required>
                        </div>
                        <div class="form-group">
                            <label>Terrain</label>
                            <select id="battle-terrain" required>
                                <option value="plains">Plains</option>
                                <option value="forest">Forest</option>
                                <option value="mountains">Mountains</option>
                                <option value="desert">Desert</option>
                                <option value="urban">Urban</option>
                                <option value="space">Space</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Weather</label>
                            <select id="battle-weather" required>
                                <option value="clear">Clear</option>
                                <option value="rain">Rain</option>
                                <option value="snow">Snow</option>
                                <option value="fog">Fog</option>
                                <option value="storm">Storm</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Time of Day</label>
                            <select id="battle-time" required>
                                <option value="day">Day</option>
                                <option value="night">Night</option>
                                <option value="dawn">Dawn</option>
                                <option value="dusk">Dusk</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Simulate Battle</button>
                    </form>
                </div>
                
                <div class="card">
                    <h3>Battle Results</h3>
                    <div id="battle-results">
                        <p>Configure and run a battle simulation to see results here.</p>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>Battle Log</h3>
                <div id="battle-log" class="battle-log">
                    <div class="log-entry log-info">Battle simulator ready. Configure units and conditions above.</div>
                </div>
            </div>
            
            <div class="card">
                <h3>Battle History</h3>
                <div id="battle-history">
                    <div class="loading">Loading battle history...</div>
                </div>
            </div>
        </div>

        <!-- Morale Analysis Tab -->
        <div id="morale-tab" class="tab-content">
            <div class="grid grid-2">
                <div class="card">
                    <h3>Unit Morale Analysis</h3>
                    <form id="morale-form">
                        <div class="form-group">
                            <label>Select Unit</label>
                            <select id="morale-unit" required>
                                <option value="">Loading units...</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Analyze Morale</button>
                    </form>
                </div>
                
                <div class="card">
                    <h3>Morale Factors</h3>
                    <div id="morale-factors">
                        <p>Select a unit and run analysis to see detailed morale factors.</p>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>AI Morale Analysis Results</h3>
                <div id="morale-analysis">
                    <p>AI-driven morale analysis will appear here after running analysis.</p>
                </div>
            </div>
            
            <div class="card">
                <h3>Morale Recommendations</h3>
                <div id="morale-recommendations">
                    <p>AI recommendations for improving unit morale will appear here.</p>
                </div>
            </div>
        </div>

        <!-- Alliance Warfare Tab -->
        <div id="alliance-tab" class="tab-content">
            <div class="grid grid-2">
                <div class="card">
                    <h3>Alliance Attack Coordination</h3>
                    <form id="alliance-form">
                        <div class="form-group">
                            <label>Primary Alliance</label>
                            <input type="text" id="primary-alliance" placeholder="Terra Federation" required>
                        </div>
                        <div class="form-group">
                            <label>Allied Forces (JSON)</label>
                            <textarea id="alliance-forces" rows="4" placeholder='[{"allianceId": "terra", "units": ["unit_1"], "integration": {...}}]' required></textarea>
                        </div>
                        <div class="form-group">
                            <label>Target Units (comma-separated IDs)</label>
                            <input type="text" id="alliance-targets" placeholder="enemy_unit_1, enemy_unit_2" required>
                        </div>
                        <div class="form-group">
                            <label>Coordination Level</label>
                            <input type="range" id="coordination-level" min="0" max="1" step="0.1" value="0.7">
                            <span id="coordination-value">0.7</span>
                        </div>
                        <button type="submit" class="btn btn-primary">Coordinate Attack</button>
                    </form>
                </div>
                
                <div class="card">
                    <h3>Alliance Operations</h3>
                    <div id="alliance-operations">
                        <div class="loading">Loading alliance operations...</div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>Alliance Performance Metrics</h3>
                <div id="alliance-metrics">
                    <p>Alliance coordination and performance metrics will appear here.</p>
                </div>
            </div>
        </div>

        <!-- Sensor Networks Tab -->
        <div id="sensors-tab" class="tab-content">
            <div class="grid grid-2">
                <div class="card">
                    <h3>Deploy Sensor Network</h3>
                    <form id="sensor-form">
                        <div class="form-group">
                            <label>Sensor Units (comma-separated IDs)</label>
                            <input type="text" id="sensor-units" placeholder="unit_1, unit_2" required>
                        </div>
                        <div class="form-group">
                            <label>Coverage Area (km radius)</label>
                            <input type="number" id="coverage-radius" placeholder="100" min="1" required>
                        </div>
                        <div class="form-group">
                            <label>Deployment Duration (hours)</label>
                            <input type="number" id="deployment-duration" placeholder="24" min="1" value="24" required>
                        </div>
                        <div class="form-group">
                            <label>Sensor Types</label>
                            <div>
                                <label><input type="checkbox" value="visual"> Visual</label>
                                <label><input type="checkbox" value="radar"> Radar</label>
                                <label><input type="checkbox" value="thermal"> Thermal</label>
                                <label><input type="checkbox" value="electronic"> Electronic</label>
                                <label><input type="checkbox" value="gravitational"> Gravitational</label>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Deploy Network</button>
                    </form>
                </div>
                
                <div class="card">
                    <h3>Active Sensor Networks</h3>
                    <div id="sensor-networks">
                        <div class="loading">Loading sensor networks...</div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>Detection Capabilities</h3>
                <div id="detection-capabilities">
                    <p>Network detection capabilities and coverage maps will appear here.</p>
                </div>
            </div>
        </div>

        <!-- Intelligence Operations Tab -->
        <div id="intelligence-tab" class="tab-content">
            <div class="grid grid-2">
                <div class="card">
                    <h3>Launch Intelligence Operation</h3>
                    <form id="intelligence-form">
                        <div class="form-group">
                            <label>Operation Type</label>
                            <select id="operation-type" required>
                                <option value="">Select Type</option>
                                <option value="reconnaissance">Reconnaissance</option>
                                <option value="surveillance">Surveillance</option>
                                <option value="infiltration">Infiltration</option>
                                <option value="sabotage">Sabotage</option>
                                <option value="counter-intelligence">Counter-Intelligence</option>
                                <option value="signals-intelligence">Signals Intelligence</option>
                                <option value="human-intelligence">Human Intelligence</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Target Information (JSON)</label>
                            <textarea id="intel-target" rows="3" placeholder='{"type": "unit", "id": "enemy_base_1", "location": {...}}' required></textarea>
                        </div>
                        <div class="form-group">
                            <label>Asset Units (comma-separated IDs)</label>
                            <input type="text" id="intel-assets" placeholder="spy_unit_1, recon_unit_2" required>
                        </div>
                        <div class="form-group">
                            <label>Priority Level</label>
                            <select id="intel-priority" required>
                                <option value="1">Low</option>
                                <option value="2">Medium</option>
                                <option value="3" selected>High</option>
                                <option value="4">Critical</option>
                                <option value="5">Urgent</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Launch Operation</button>
                    </form>
                </div>
                
                <div class="card">
                    <h3>Active Operations</h3>
                    <div id="intel-operations">
                        <div class="loading">Loading intelligence operations...</div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>Intelligence Reports</h3>
                <div id="intel-reports">
                    <p>Collected intelligence and analysis reports will appear here.</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Global state
        let currentTab = 'units';
        let units = [];
        let battles = [];
        let sensorNetworks = [];
        let intelOperations = [];

        // Tab switching
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
            document.getElementById(tabName + '-tab').classList.add('active');
            
            // Add active class to selected tab
            event.target.classList.add('active');
            
            currentTab = tabName;
            
            // Load data for the selected tab
            loadTabData(tabName);
        }

        // Load data for specific tab
        async function loadTabData(tabName) {
            switch(tabName) {
                case 'units':
                    await loadUnits();
                    await loadUnitsOverview();
                    break;
                case 'battles':
                    await loadBattleHistory();
                    break;
                case 'morale':
                    await loadUnitsForMorale();
                    break;
                case 'alliance':
                    await loadAllianceOperations();
                    break;
                case 'sensors':
                    await loadSensorNetworks();
                    break;
                case 'intelligence':
                    await loadIntelligenceOperations();
                    break;
            }
        }

        // API helper function
        async function apiCall(endpoint, options = {}) {
            try {
                const response = await fetch('/api/military' + endpoint, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    },
                    ...options
                });
                
                if (!response.ok) {
                    throw new Error(\`HTTP error! status: \${response.status}\`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('API call failed:', error);
                throw error;
            }
        }

        // Load military units
        async function loadUnits() {
            try {
                const response = await apiCall('/units?campaign_id=1');
                units = response.units || [];
                
                const unitsList = document.getElementById('units-list');
                if (units.length === 0) {
                    unitsList.innerHTML = '<p>No military units found. Create some units to get started.</p>';
                    return;
                }
                
                unitsList.innerHTML = units.map(unit => \`
                    <div class="unit-card">
                        <div class="unit-header">
                            <div>
                                <span class="unit-name">\${unit.name}</span>
                                <span class="unit-type">\${unit.type}</span>
                                \${unit.allegiance?.alliance ? \`<span class="alliance-badge">\${unit.allegiance.alliance}</span>\` : ''}
                            </div>
                            <div>
                                <span class="status-indicator status-\${unit.status?.operational || 'operational'}"></span>
                                \${unit.domain}
                            </div>
                        </div>
                        <div class="stats-grid">
                            <div class="stat">
                                <div class="stat-label">Size</div>
                                <div class="stat-value">\${unit.size}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-label">Morale</div>
                                <div class="stat-value">\${unit.morale?.currentMorale || 75}%</div>
                            </div>
                            <div class="stat">
                                <div class="stat-label">Experience</div>
                                <div class="stat-value">\${unit.experience?.totalExperience || 0}</div>
                            </div>
                            <div class="stat">
                                <div class="stat-label">Tech Level</div>
                                <div class="stat-value">\${unit.technology?.level || 1}</div>
                            </div>
                        </div>
                        \${unit.morale?.currentMorale ? \`
                            <div class="morale-bar">
                                <div class="morale-fill morale-\${getMoraleClass(unit.morale.currentMorale)}" 
                                     style="width: \${unit.morale.currentMorale}%"></div>
                            </div>
                        \` : ''}
                    </div>
                \`).join('');
            } catch (error) {
                document.getElementById('units-list').innerHTML = 
                    \`<div class="error">Failed to load units: \${error.message}</div>\`;
            }
        }

        // Load units overview
        async function loadUnitsOverview() {
            try {
                const response = await apiCall('/overview?campaign_id=1');
                const overview = response.overview;
                
                const overviewDiv = document.getElementById('units-overview');
                overviewDiv.innerHTML = \`
                    <div class="stats-grid">
                        <div class="stat">
                            <div class="stat-label">Total Units</div>
                            <div class="stat-value">\${overview.units?.reduce((sum, u) => sum + parseInt(u.count), 0) || 0}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">Battles Fought</div>
                            <div class="stat-value">\${overview.battles?.reduce((sum, b) => sum + parseInt(b.count), 0) || 0}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">Active Operations</div>
                            <div class="stat-value">\${overview.operations?.filter(o => o.status === 'active').reduce((sum, o) => sum + parseInt(o.count), 0) || 0}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">Sensor Networks</div>
                            <div class="stat-value">\${overview.networks?.reduce((sum, n) => sum + parseInt(n.count), 0) || 0}</div>
                        </div>
                    </div>
                \`;
            } catch (error) {
                document.getElementById('units-overview').innerHTML = 
                    \`<div class="error">Failed to load overview: \${error.message}</div>\`;
            }
        }

        // Load battle history
        async function loadBattleHistory() {
            try {
                const response = await apiCall('/battles?campaign_id=1&limit=10');
                battles = response.battles || [];
                
                const historyDiv = document.getElementById('battle-history');
                if (battles.length === 0) {
                    historyDiv.innerHTML = '<p>No battles recorded yet.</p>';
                    return;
                }
                
                historyDiv.innerHTML = battles.map(battle => \`
                    <div class="unit-card">
                        <div class="unit-header">
                            <div class="unit-name">\${battle.battle_name}</div>
                            <div class="unit-type">\${battle.outcome}</div>
                        </div>
                        <p><strong>Duration:</strong> \${battle.duration} hours</p>
                        <p><strong>Decisiveness:</strong> \${(battle.decisiveness * 100).toFixed(1)}%</p>
                        <p><strong>Date:</strong> \${new Date(battle.created_at).toLocaleString()}</p>
                    </div>
                \`).join('');
            } catch (error) {
                document.getElementById('battle-history').innerHTML = 
                    \`<div class="error">Failed to load battle history: \${error.message}</div>\`;
            }
        }

        // Load units for morale analysis
        async function loadUnitsForMorale() {
            try {
                const response = await apiCall('/units?campaign_id=1');
                const units = response.units || [];
                
                const select = document.getElementById('morale-unit');
                select.innerHTML = '<option value="">Select a unit...</option>' +
                    units.map(unit => \`<option value="\${unit.id}">\${unit.name} (\${unit.type})</option>\`).join('');
            } catch (error) {
                document.getElementById('morale-unit').innerHTML = 
                    '<option value="">Failed to load units</option>';
            }
        }

        // Load alliance operations
        async function loadAllianceOperations() {
            try {
                const response = await apiCall('/alliance/coordination?campaign_id=1');
                const operations = response.operations || [];
                
                const operationsDiv = document.getElementById('alliance-operations');
                if (operations.length === 0) {
                    operationsDiv.innerHTML = '<p>No alliance operations recorded.</p>';
                    return;
                }
                
                operationsDiv.innerHTML = operations.map(op => \`
                    <div class="unit-card">
                        <div class="unit-header">
                            <div class="unit-name">\${op.operation_name}</div>
                            <div class="op-status status-\${op.status}">\${op.status}</div>
                        </div>
                        <p><strong>Primary Alliance:</strong> \${op.primary_alliance}</p>
                        <p><strong>Total Units:</strong> \${op.total_units}</p>
                        <p><strong>Coordination Efficiency:</strong> \${(op.coordination_efficiency * 100).toFixed(1)}%</p>
                    </div>
                \`).join('');
            } catch (error) {
                document.getElementById('alliance-operations').innerHTML = 
                    \`<div class="error">Failed to load alliance operations: \${error.message}</div>\`;
            }
        }

        // Load sensor networks
        async function loadSensorNetworks() {
            try {
                const response = await apiCall('/sensors/networks?campaign_id=1');
                sensorNetworks = response.networks || [];
                
                const networksDiv = document.getElementById('sensor-networks');
                if (sensorNetworks.length === 0) {
                    networksDiv.innerHTML = '<p>No sensor networks deployed.</p>';
                    return;
                }
                
                networksDiv.innerHTML = sensorNetworks.map(network => \`
                    <div class="sensor-network">
                        <div class="network-header">
                            <div class="unit-name">\${network.name}</div>
                            <div class="coverage-indicator">
                                <span>Coverage: \${(network.coverage_percentage * 100).toFixed(1)}%</span>
                                <div class="coverage-bar">
                                    <div class="coverage-fill" style="width: \${network.coverage_percentage * 100}%"></div>
                                </div>
                            </div>
                        </div>
                        <p><strong>Status:</strong> \${network.operational ? 'Operational' : 'Offline'}</p>
                        <p><strong>Detection Accuracy:</strong> \${(network.detection_accuracy * 100).toFixed(1)}%</p>
                        <p><strong>Response Time:</strong> \${network.response_time}s</p>
                    </div>
                \`).join('');
            } catch (error) {
                document.getElementById('sensor-networks').innerHTML = 
                    \`<div class="error">Failed to load sensor networks: \${error.message}</div>\`;
            }
        }

        // Load intelligence operations
        async function loadIntelligenceOperations() {
            try {
                const response = await apiCall('/intelligence/operations?campaign_id=1');
                intelOperations = response.operations || [];
                
                const operationsDiv = document.getElementById('intel-operations');
                if (intelOperations.length === 0) {
                    operationsDiv.innerHTML = '<p>No intelligence operations recorded.</p>';
                    return;
                }
                
                operationsDiv.innerHTML = intelOperations.map(op => \`
                    <div class="intelligence-op">
                        <div class="op-header">
                            <div class="unit-name">\${op.operation_name}</div>
                            <div class="op-status status-\${op.status}">\${op.status}</div>
                        </div>
                        <p><strong>Type:</strong> \${op.operation_type}</p>
                        <p><strong>Priority:</strong> \${op.priority}/5</p>
                        <p><strong>Classification:</strong> \${op.classification}</p>
                        \${op.success !== null ? \`<p><strong>Success:</strong> \${op.success ? 'Yes' : 'No'}</p>\` : ''}
                    </div>
                \`).join('');
            } catch (error) {
                document.getElementById('intel-operations').innerHTML = 
                    \`<div class="error">Failed to load intelligence operations: \${error.message}</div>\`;
            }
        }

        // Helper functions
        function getMoraleClass(morale) {
            if (morale >= 70) return 'high';
            if (morale >= 40) return 'medium';
            return 'low';
        }

        function addBattleLogEntry(message, type = 'info') {
            const log = document.getElementById('battle-log');
            const entry = document.createElement('div');
            entry.className = \`log-entry log-\${type}\`;
            entry.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
        }

        // Form handlers
        document.getElementById('create-unit-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('unit-name').value,
                type: document.getElementById('unit-type').value,
                domain: document.getElementById('unit-domain').value,
                size: parseInt(document.getElementById('unit-size').value),
                maxSize: parseInt(document.getElementById('unit-size').value),
                classification: document.getElementById('unit-classification').value,
                campaignId: 1,
                civilizationId: 'player',
                morale: {
                    currentMorale: 75,
                    baseMorale: 75,
                    factors: {},
                    moraleHistory: [],
                    trends: {},
                    combatEffects: {
                        attackBonus: 0,
                        defenseBonus: 0,
                        accuracyModifier: 0,
                        retreatThreshold: 30,
                        surrenderThreshold: 10,
                        berserkThreshold: 95,
                        coordinationEfficiency: 0.8
                    },
                    recovery: {},
                    aiAnalysis: {}
                },
                experience: {
                    totalExperience: 0,
                    combatExperience: 0,
                    battleExperience: {
                        totalBattles: 0,
                        victories: 0,
                        defeats: 0,
                        draws: 0,
                        retreats: 0
                    },
                    experienceBonus: 1.0,
                    veteranStatus: 'green'
                },
                training: {
                    overallTraining: 50,
                    basicTraining: 50,
                    advancedTraining: 0,
                    specializedTraining: 0,
                    trainingBonus: 0.1,
                    trainingStatus: 'basic'
                }
            };
            
            try {
                await apiCall('/units', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                
                document.getElementById('create-unit-form').reset();
                await loadUnits();
                await loadUnitsOverview();
                
                document.querySelector('.success')?.remove();
                const success = document.createElement('div');
                success.className = 'success';
                success.textContent = 'Military unit created successfully!';
                document.getElementById('units-tab').insertBefore(success, document.getElementById('units-tab').firstChild);
            } catch (error) {
                document.querySelector('.error')?.remove();
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error';
                errorDiv.textContent = \`Failed to create unit: \${error.message}\`;
                document.getElementById('units-tab').insertBefore(errorDiv, document.getElementById('units-tab').firstChild);
            }
        });

        document.getElementById('battle-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const attackerIds = document.getElementById('attacker-units').value.split(',').map(id => id.trim());
            const defenderIds = document.getElementById('defender-units').value.split(',').map(id => id.trim());
            
            const battleData = {
                attackerUnitIds: attackerIds,
                defenderUnitIds: defenderIds,
                battleConditions: {
                    terrain: document.getElementById('battle-terrain').value,
                    weather: document.getElementById('battle-weather').value,
                    timeOfDay: document.getElementById('battle-time').value,
                    visibility: 1.0,
                    temperature: 20,
                    duration: 2,
                    strategicImportance: 0.5,
                    civilianPresence: false,
                    infrastructureValue: 0.3,
                    specialConditions: []
                }
            };
            
            addBattleLogEntry('Initializing battle simulation...', 'info');
            addBattleLogEntry(\`Attackers: \${attackerIds.join(', ')}\`, 'info');
            addBattleLogEntry(\`Defenders: \${defenderIds.join(', ')}\`, 'info');
            addBattleLogEntry(\`Conditions: \${battleData.battleConditions.terrain}, \${battleData.battleConditions.weather}, \${battleData.battleConditions.timeOfDay}\`, 'info');
            
            try {
                const response = await apiCall('/battles/simulate', {
                    method: 'POST',
                    body: JSON.stringify(battleData)
                });
                
                const battle = response.battle;
                addBattleLogEntry(\`Battle completed! Outcome: \${battle.outcome}\`, 'success');
                addBattleLogEntry(\`Duration: \${battle.duration} hours, Decisiveness: \${(battle.decisiveness * 100).toFixed(1)}%\`, 'info');
                
                document.getElementById('battle-results').innerHTML = \`
                    <div class="unit-card">
                        <h4>Battle Result: \${battle.outcome}</h4>
                        <div class="stats-grid">
                            <div class="stat">
                                <div class="stat-label">Duration</div>
                                <div class="stat-value">\${battle.duration}h</div>
                            </div>
                            <div class="stat">
                                <div class="stat-label">Decisiveness</div>
                                <div class="stat-value">\${(battle.decisiveness * 100).toFixed(1)}%</div>
                            </div>
                        </div>
                        <p><strong>Key Factors:</strong> \${battle.keyFactors?.join(', ') || 'None recorded'}</p>
                        <p><strong>Strategic Impact:</strong> War effort impact: \${battle.strategicImpact?.warEffort || 0}</p>
                    </div>
                \`;
                
                await loadBattleHistory();
            } catch (error) {
                addBattleLogEntry(\`Battle simulation failed: \${error.message}\`, 'error');
            }
        });

        document.getElementById('morale-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const unitId = document.getElementById('morale-unit').value;
            if (!unitId) return;
            
            try {
                const response = await apiCall(\`/units/\${unitId}/analyze-morale\`, {
                    method: 'POST'
                });
                
                const analysis = response.analysis;
                
                document.getElementById('morale-factors').innerHTML = \`
                    <div class="stats-grid">
                        <div class="stat">
                            <div class="stat-label">Current Morale</div>
                            <div class="stat-value">\${analysis.currentMorale}%</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">Risk Level</div>
                            <div class="stat-value">\${analysis.riskLevel}</div>
                        </div>
                    </div>
                    <div class="morale-bar">
                        <div class="morale-fill morale-\${getMoraleClass(analysis.currentMorale)}" 
                             style="width: \${analysis.currentMorale}%"></div>
                    </div>
                \`;
                
                document.getElementById('morale-analysis').innerHTML = \`
                    <h4>AI Analysis Results</h4>
                    <p><strong>Primary Drivers:</strong> \${analysis.factors ? Object.keys(analysis.factors).slice(0, 3).join(', ') : 'Analysis in progress'}</p>
                    <p><strong>Risk Assessment:</strong> \${analysis.riskLevel} risk level</p>
                    <p><strong>Action Required:</strong> \${analysis.actionRequired ? 'Yes' : 'No'}</p>
                \`;
                
                if (analysis.recommendations && analysis.recommendations.length > 0) {
                    document.getElementById('morale-recommendations').innerHTML = \`
                        <h4>AI Recommendations</h4>
                        \${analysis.recommendations.map(rec => \`
                            <div class="unit-card">
                                <div class="unit-header">
                                    <div class="unit-name">\${rec.title}</div>
                                    <div class="unit-type">\${rec.priority}</div>
                                </div>
                                <p>\${rec.description}</p>
                                <p><strong>Expected Impact:</strong> +\${rec.expectedImpact} morale</p>
                                <p><strong>Time to Implement:</strong> \${rec.timeToImplement} days</p>
                            </div>
                        \`).join('')}
                    \`;
                }
            } catch (error) {
                document.getElementById('morale-analysis').innerHTML = 
                    \`<div class="error">Failed to analyze morale: \${error.message}</div>\`;
            }
        });

        // Coordination level slider
        document.getElementById('coordination-level').addEventListener('input', (e) => {
            document.getElementById('coordination-value').textContent = e.target.value;
        });

        // Initialize the demo
        document.addEventListener('DOMContentLoaded', () => {
            loadTabData('units');
        });
    </script>
</body>
</html>
  `;
  
  res.send(html);
});

export default router;
