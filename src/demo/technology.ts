/**
 * Technology & Cyber Warfare Systems - Demo Interface
 * Sprint 16: Interactive demonstration of technology acquisition and cyber warfare
 */

import { Router } from 'express';
import { TechnologyEngine } from '../server/technology/TechnologyEngine.js';
import { TechnologyAnalytics } from '../server/technology/TechnologyAnalytics.js';

const router = Router();
const technologyEngine = new TechnologyEngine();
const technologyAnalytics = new TechnologyAnalytics();

// Demo page route
router.get('/demo/technology', (req, res) => {
  const demoHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technology & Cyber Warfare Systems Demo</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: #333;
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
            border-bottom: 3px solid #2a5298;
        }
        .header h1 {
            color: #1e3c72;
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        .header p {
            color: #666;
            font-size: 1.2em;
            margin: 10px 0 0 0;
        }
        .tabs {
            display: flex;
            margin-bottom: 30px;
            background: #f8f9fa;
            border-radius: 10px;
            padding: 5px;
            flex-wrap: wrap;
        }
        .tab {
            flex: 1;
            min-width: 150px;
            padding: 12px 20px;
            background: transparent;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            margin: 2px;
        }
        .tab:hover {
            background: rgba(42, 82, 152, 0.1);
        }
        .tab.active {
            background: #2a5298;
            color: white;
            box-shadow: 0 4px 12px rgba(42, 82, 152, 0.3);
        }
        .tab-content {
            display: none;
            animation: fadeIn 0.5s ease-in;
        }
        .tab-content.active {
            display: block;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            border-left: 5px solid #2a5298;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        .card h3 {
            color: #1e3c72;
            margin: 0 0 15px 0;
            font-size: 1.3em;
        }
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .metric:last-child {
            border-bottom: none;
        }
        .metric-label {
            font-weight: 500;
            color: #555;
        }
        .metric-value {
            font-weight: bold;
            color: #2a5298;
        }
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-operational { background: #28a745; }
        .status-research { background: #ffc107; }
        .status-development { background: #17a2b8; }
        .status-testing { background: #fd7e14; }
        .status-obsolete { background: #dc3545; }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
            margin: 5px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.3s ease;
        }
        .btn {
            background: #2a5298;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.3s ease;
            margin: 5px;
        }
        .btn:hover {
            background: #1e3c72;
        }
        .btn-secondary {
            background: #6c757d;
        }
        .btn-secondary:hover {
            background: #545b62;
        }
        .btn-danger {
            background: #dc3545;
        }
        .btn-danger:hover {
            background: #c82333;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .data-table th {
            background: #2a5298;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 500;
        }
        .data-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }
        .data-table tr:hover {
            background: #f8f9fa;
        }
        .complexity-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
            color: white;
        }
        .complexity-low { background: #28a745; }
        .complexity-medium { background: #ffc107; color: #333; }
        .complexity-high { background: #fd7e14; }
        .complexity-extreme { background: #dc3545; }
        .security-level {
            display: flex;
            align-items: center;
        }
        .security-dots {
            display: flex;
            margin-left: 8px;
        }
        .security-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 2px;
            background: #ddd;
        }
        .security-dot.active {
            background: #2a5298;
        }
        .operation-status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 500;
        }
        .status-planning { background: #e3f2fd; color: #1976d2; }
        .status-active { background: #fff3e0; color: #f57c00; }
        .status-completed { background: #e8f5e8; color: #2e7d32; }
        .status-failed { background: #ffebee; color: #c62828; }
        .status-compromised { background: #fce4ec; color: #ad1457; }
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .success {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .analytics-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .analytics-value {
            font-size: 2em;
            font-weight: bold;
            color: #2a5298;
            margin: 10px 0;
        }
        .analytics-label {
            color: #666;
            font-size: 0.9em;
        }
        .recommendation {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
        }
        .recommendation-priority {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .priority-critical { color: #dc3545; }
        .priority-high { color: #fd7e14; }
        .priority-medium { color: #ffc107; }
        .priority-low { color: #28a745; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔬 Technology & Cyber Warfare Systems</h1>
            <p>Advanced technology acquisition, research acceleration, and cyber warfare capabilities</p>
        </div>

        <div class="tabs">
            <button class="tab active" onclick="showTab('overview')">📊 Overview</button>
            <button class="tab" onclick="showTab('tech-tree')">🌌 Tech Tree</button>
            <button class="tab" onclick="showTab('psychic')">🧠 Psychic Powers</button>
            <button class="tab" onclick="showTab('innovation')">💡 Innovation</button>
            <button class="tab" onclick="showTab('technologies')">🔬 Technologies</button>
            <button class="tab" onclick="showTab('research')">🧪 Research</button>
            <button class="tab" onclick="showTab('cyber')">💻 Cyber Ops</button>
            <button class="tab" onclick="showTab('transfers')">🔄 Transfers</button>
            <button class="tab" onclick="showTab('analytics')">📈 Analytics</button>
        </div>

        <div id="overview" class="tab-content active">
            <div class="analytics-grid">
                <div class="analytics-card">
                    <div class="analytics-value" id="total-technologies">-</div>
                    <div class="analytics-label">Total Technologies</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-value" id="active-research">-</div>
                    <div class="analytics-label">Active Research Projects</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-value" id="cyber-operations">-</div>
                    <div class="analytics-label">Cyber Operations</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-value" id="technology-transfers">-</div>
                    <div class="analytics-label">Technology Transfers</div>
                </div>
            </div>
            
            <div class="grid">
                <div class="card">
                    <h3>🏛️ Civilizations</h3>
                    <div id="civilizations-overview">Loading...</div>
                </div>
                <div class="card">
                    <h3>🎯 Recent Activities</h3>
                    <div id="recent-activities">Loading...</div>
                </div>
                <div class="card">
                    <h3>⚡ System Status</h3>
                    <div class="metric">
                        <span class="metric-label">Technology Engine</span>
                        <span class="metric-value"><span class="status-indicator status-operational"></span>Operational</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Cyber Warfare Module</span>
                        <span class="metric-value"><span class="status-indicator status-operational"></span>Active</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Analytics Engine</span>
                        <span class="metric-value"><span class="status-indicator status-operational"></span>Running</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Research Tracker</span>
                        <span class="metric-value"><span class="status-indicator status-operational"></span>Monitoring</span>
                    </div>
                </div>
            </div>
        </div>

        <div id="technologies" class="tab-content">
            <div class="card">
                <h3>🔬 Technology Portfolio</h3>
                <button class="btn" onclick="loadTechnologies()">Refresh Technologies</button>
                <button class="btn btn-secondary" onclick="createSampleTechnology()">Create Sample Technology</button>
                <div id="technologies-content">
                    <div class="loading">Loading technologies...</div>
                </div>
            </div>
        </div>

        <div id="research" class="tab-content">
            <div class="card">
                <h3>🧪 Research Projects</h3>
                <button class="btn" onclick="loadResearchProjects()">Refresh Projects</button>
                <button class="btn btn-secondary" onclick="startSampleResearch()">Start Sample Project</button>
                <div id="research-content">
                    <div class="loading">Loading research projects...</div>
                </div>
            </div>
        </div>

        <div id="cyber" class="tab-content">
            <div class="card">
                <h3>💻 Cyber Operations</h3>
                <button class="btn" onclick="loadCyberOperations()">Refresh Operations</button>
                <button class="btn btn-secondary" onclick="launchSampleOperation()">Launch Sample Operation</button>
                <button class="btn btn-danger" onclick="executePendingOperations()">Execute Pending</button>
                <div id="cyber-content">
                    <div class="loading">Loading cyber operations...</div>
                </div>
            </div>
        </div>

        <div id="transfers" class="tab-content">
            <div class="card">
                <h3>🔄 Technology Transfers</h3>
                <button class="btn" onclick="loadTechnologyTransfers()">Refresh Transfers</button>
                <button class="btn btn-secondary" onclick="createSampleTransfer()">Create Sample Transfer</button>
                <div id="transfers-content">
                    <div class="loading">Loading technology transfers...</div>
                </div>
            </div>
            
            <div class="card">
                <h3>🔧 Reverse Engineering</h3>
                <button class="btn" onclick="loadReverseEngineering()">Refresh Projects</button>
                <button class="btn btn-secondary" onclick="startSampleReverseEngineering()">Start Sample Project</button>
                <div id="reverse-engineering-content">
                    <div class="loading">Loading reverse engineering projects...</div>
                </div>
            </div>
        </div>

        <div id="tech-tree" class="tab-content">
            <div class="card">
                <h3>🌌 Dynamic Tech Tree</h3>
                <div class="grid">
                    <button class="btn" onclick="generateTechTree()">Generate New Tech Tree</button>
                    <button class="btn btn-secondary" onclick="loadTechTreeStatus()">View Tech Tree Status</button>
                </div>
                <div id="tech-tree-content">
                    <div class="loading">Click to generate or view tech tree...</div>
                </div>
            </div>
        </div>

        <div id="psychic" class="tab-content">
            <div class="card">
                <h3>🧠 Psychic Powers</h3>
                <button class="btn" onclick="loadPsychicPowers()">Load Psychic Powers</button>
                <button class="btn btn-secondary" onclick="triggerPsychicRevelation()">Trigger Psychic Revelation</button>
                <div id="psychic-content">
                    <div class="loading">Loading psychic powers...</div>
                </div>
            </div>
        </div>

        <div id="innovation" class="tab-content">
            <div class="grid">
                <div class="card">
                    <h3>🏢 Corporate Innovation</h3>
                    <button class="btn" onclick="triggerCorporateInnovation()">Trigger Corporate R&D</button>
                    <div id="corporate-innovation">Click to trigger corporate innovation</div>
                </div>
                <div class="card">
                    <h3>👨‍🔬 Citizen Innovation</h3>
                    <button class="btn" onclick="triggerCitizenInnovation()">Trigger Citizen Innovation</button>
                    <div id="citizen-innovation">Click to trigger citizen innovation</div>
                </div>
                <div class="card">
                    <h3>🤖 AI Innovation</h3>
                    <button class="btn" onclick="triggerAIInnovation()">Trigger AI Innovation</button>
                    <div id="ai-innovation">Click to trigger AI innovation</div>
                </div>
                <div class="card">
                    <h3>📊 Innovation Events</h3>
                    <button class="btn" onclick="loadInnovationEvents()">Load Innovation Events</button>
                    <div id="innovation-events">Click to load innovation events</div>
                </div>
            </div>
        </div>

        <div id="analytics" class="tab-content">
            <div class="grid">
                <div class="card">
                    <h3>📊 Portfolio Analysis</h3>
                    <button class="btn" onclick="loadPortfolioAnalysis()">Generate Analysis</button>
                    <div id="portfolio-analysis">Click to generate portfolio analysis</div>
                </div>
                <div class="card">
                    <h3>🔬 Research Performance</h3>
                    <button class="btn" onclick="loadResearchAnalysis()">Analyze Performance</button>
                    <div id="research-analysis">Click to analyze research performance</div>
                </div>
                <div class="card">
                    <h3>💻 Cyber Warfare Analysis</h3>
                    <button class="btn" onclick="loadCyberAnalysis()">Analyze Operations</button>
                    <div id="cyber-analysis">Click to analyze cyber operations</div>
                </div>
                <div class="card">
                    <h3>🔮 Technology Forecast</h3>
                    <button class="btn" onclick="loadTechnologyForecast()">Generate Forecast</button>
                    <div id="technology-forecast">Click to generate technology forecast</div>
                </div>
                <div class="card">
                    <h3>🛡️ Security Analysis</h3>
                    <button class="btn" onclick="loadSecurityAnalysis()">Analyze Security</button>
                    <div id="security-analysis">Click to analyze security posture</div>
                </div>
                <div class="card">
                    <h3>💡 Recommendations</h3>
                    <button class="btn" onclick="loadRecommendations()">Get Recommendations</button>
                    <div id="recommendations">Click to get strategic recommendations</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Tab management
        function showTab(tabName) {
            // Hide all tab contents
            const contents = document.querySelectorAll('.tab-content');
            contents.forEach(content => content.classList.remove('active'));
            
            // Remove active class from all tabs
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Show selected tab content
            document.getElementById(tabName).classList.add('active');
            
            // Add active class to clicked tab
            event.target.classList.add('active');
            
            // Load data for the selected tab
            if (tabName === 'overview') loadOverview();
            else if (tabName === 'technologies') loadTechnologies();
            else if (tabName === 'research') loadResearchProjects();
            else if (tabName === 'cyber') loadCyberOperations();
            else if (tabName === 'transfers') loadTechnologyTransfers();
        }

        // API helper function
        async function apiCall(endpoint, options = {}) {
            try {
                const response = await fetch('/api/technology' + endpoint, {
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

        // Load overview data
        async function loadOverview() {
            try {
                const [technologies, research, cyber, transfers, civilizations] = await Promise.all([
                    apiCall('/technologies'),
                    apiCall('/research'),
                    apiCall('/cyber-operations'),
                    apiCall('/transfers'),
                    apiCall('/civilizations')
                ]);

                document.getElementById('total-technologies').textContent = technologies.count || 0;
                document.getElementById('active-research').textContent = research.count || 0;
                document.getElementById('cyber-operations').textContent = cyber.count || 0;
                document.getElementById('technology-transfers').textContent = transfers.count || 0;

                // Display civilizations
                const civilizationsHtml = civilizations.data.map(civ => \`
                    <div class="metric">
                        <span class="metric-label">\${civ.name}</span>
                        <span class="metric-value">\${civ.techLevel} Level</span>
                    </div>
                \`).join('');
                document.getElementById('civilizations-overview').innerHTML = civilizationsHtml;

                // Display recent activities (simplified)
                const activitiesHtml = \`
                    <div class="metric">
                        <span class="metric-label">Technologies Created</span>
                        <span class="metric-value">\${technologies.count}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Research Projects</span>
                        <span class="metric-value">\${research.count}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Cyber Operations</span>
                        <span class="metric-value">\${cyber.count}</span>
                    </div>
                \`;
                document.getElementById('recent-activities').innerHTML = activitiesHtml;

            } catch (error) {
                console.error('Failed to load overview:', error);
                document.getElementById('civilizations-overview').innerHTML = '<div class="error">Failed to load data</div>';
            }
        }

        // Load technologies
        async function loadTechnologies() {
            try {
                const response = await apiCall('/technologies');
                const technologies = response.data || [];

                if (technologies.length === 0) {
                    document.getElementById('technologies-content').innerHTML = '<p>No technologies found. Create some sample technologies to get started.</p>';
                    return;
                }

                const tableHtml = \`
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Level</th>
                                <th>Complexity</th>
                                <th>Status</th>
                                <th>Security</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${technologies.map(tech => \`
                                <tr>
                                    <td><strong>\${tech.name}</strong></td>
                                    <td>\${tech.category}</td>
                                    <td>\${tech.level}</td>
                                    <td><span class="complexity-badge complexity-\${getComplexityClass(tech.complexity)}">\${tech.complexity}/10</span></td>
                                    <td><span class="status-indicator status-\${tech.operationalStatus.toLowerCase()}"></span>\${tech.operationalStatus}</td>
                                    <td>
                                        <div class="security-level">
                                            \${tech.securityLevel}/10
                                            <div class="security-dots">
                                                \${Array.from({length: 10}, (_, i) => \`
                                                    <div class="security-dot \${i < tech.securityLevel ? 'active' : ''}"></div>
                                                \`).join('')}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: \${tech.implementationProgress}%"></div>
                                        </div>
                                        \${tech.implementationProgress}%
                                    </td>
                                </tr>
                            \`).join('')}
                        </tbody>
                    </table>
                \`;

                document.getElementById('technologies-content').innerHTML = tableHtml;
            } catch (error) {
                document.getElementById('technologies-content').innerHTML = '<div class="error">Failed to load technologies</div>';
            }
        }

        // Load research projects
        async function loadResearchProjects() {
            try {
                const response = await apiCall('/research');
                const projects = response.data || [];

                if (projects.length === 0) {
                    document.getElementById('research-content').innerHTML = '<p>No research projects found. Start some sample projects to get started.</p>';
                    return;
                }

                const tableHtml = \`
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Category</th>
                                <th>Progress</th>
                                <th>Budget</th>
                                <th>Researchers</th>
                                <th>Completion</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${projects.map(project => \`
                                <tr>
                                    <td><strong>\${project.name}</strong></td>
                                    <td>\${project.category}</td>
                                    <td>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: \${project.progress}%"></div>
                                        </div>
                                        \${project.progress}%
                                    </td>
                                    <td>$\${(project.budget / 1000000).toFixed(1)}M</td>
                                    <td>\${project.researchers}</td>
                                    <td>\${new Date(project.estimatedCompletion).toLocaleDateString()}</td>
                                </tr>
                            \`).join('')}
                        </tbody>
                    </table>
                \`;

                document.getElementById('research-content').innerHTML = tableHtml;
            } catch (error) {
                document.getElementById('research-content').innerHTML = '<div class="error">Failed to load research projects</div>';
            }
        }

        // Load cyber operations
        async function loadCyberOperations() {
            try {
                const response = await apiCall('/cyber-operations');
                const operations = response.data || [];

                if (operations.length === 0) {
                    document.getElementById('cyber-content').innerHTML = '<p>No cyber operations found. Launch some sample operations to get started.</p>';
                    return;
                }

                const tableHtml = \`
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Operation Name</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Progress</th>
                                <th>Success Rate</th>
                                <th>Detection Risk</th>
                                <th>Budget</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${operations.map(op => \`
                                <tr>
                                    <td><strong>\${op.name}</strong></td>
                                    <td>\${op.type}</td>
                                    <td><span class="operation-status status-\${op.status.toLowerCase()}">\${op.status}</span></td>
                                    <td>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: \${op.progress}%"></div>
                                        </div>
                                        \${op.progress}%
                                    </td>
                                    <td>\${op.successProbability}%</td>
                                    <td>\${op.detectionRisk}/10</td>
                                    <td>$\${(op.budget / 1000).toFixed(0)}K</td>
                                </tr>
                            \`).join('')}
                        </tbody>
                    </table>
                \`;

                document.getElementById('cyber-content').innerHTML = tableHtml;
            } catch (error) {
                document.getElementById('cyber-content').innerHTML = '<div class="error">Failed to load cyber operations</div>';
            }
        }

        // Load technology transfers
        async function loadTechnologyTransfers() {
            try {
                const [transfers, reverseProjects] = await Promise.all([
                    apiCall('/transfers'),
                    apiCall('/reverse-engineering')
                ]);

                const transfersHtml = transfers.data.length > 0 ? \`
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Technology</th>
                                <th>Method</th>
                                <th>Cost</th>
                                <th>Success</th>
                                <th>Adaptation</th>
                                <th>Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${transfers.data.map(transfer => \`
                                <tr>
                                    <td>\${transfer.technologyId}</td>
                                    <td>\${transfer.transferMethod}</td>
                                    <td>$\${(transfer.cost / 1000).toFixed(0)}K</td>
                                    <td>\${transfer.implementationSuccess ? '✅ Yes' : '❌ No'}</td>
                                    <td>\${transfer.adaptationRequired ? 'Required' : 'Not Required'}</td>
                                    <td>\${100 - transfer.performanceDegradation}%</td>
                                </tr>
                            \`).join('')}
                        </tbody>
                    </table>
                \` : '<p>No technology transfers found.</p>';

                const reverseHtml = reverseProjects.data.length > 0 ? \`
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Target Technology</th>
                                <th>Progress</th>
                                <th>Understanding</th>
                                <th>Reproduction</th>
                                <th>Budget</th>
                                <th>Researchers</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${reverseProjects.data.map(project => \`
                                <tr>
                                    <td>\${project.targetTechnologyId}</td>
                                    <td>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: \${project.progress}%"></div>
                                        </div>
                                        \${project.progress}%
                                    </td>
                                    <td>\${project.understanding}%</td>
                                    <td>\${project.reproduction}%</td>
                                    <td>$\${(project.budget / 1000).toFixed(0)}K</td>
                                    <td>\${project.researchers}</td>
                                </tr>
                            \`).join('')}
                        </tbody>
                    </table>
                \` : '<p>No reverse engineering projects found.</p>';

                document.getElementById('transfers-content').innerHTML = transfersHtml;
                document.getElementById('reverse-engineering-content').innerHTML = reverseHtml;
            } catch (error) {
                document.getElementById('transfers-content').innerHTML = '<div class="error">Failed to load technology transfers</div>';
                document.getElementById('reverse-engineering-content').innerHTML = '<div class="error">Failed to load reverse engineering projects</div>';
            }
        }

        // Analytics functions
        async function loadPortfolioAnalysis() {
            try {
                const response = await apiCall('/analytics/portfolio');
                const analysis = response.data;

                const html = \`
                    <div class="analytics-grid">
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.diversityIndex.toFixed(1)}</div>
                            <div class="analytics-label">Diversity Index</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.maturityScore.toFixed(1)}</div>
                            <div class="analytics-label">Maturity Score</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.innovationPotential.toFixed(1)}</div>
                            <div class="analytics-label">Innovation Potential</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.competitivePosition}</div>
                            <div class="analytics-label">Competitive Position</div>
                        </div>
                    </div>
                \`;

                document.getElementById('portfolio-analysis').innerHTML = html;
            } catch (error) {
                document.getElementById('portfolio-analysis').innerHTML = '<div class="error">Failed to load portfolio analysis</div>';
            }
        }

        async function loadResearchAnalysis() {
            try {
                const response = await apiCall('/analytics/research');
                const analysis = response.data;

                const html = \`
                    <div class="analytics-grid">
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.completionRate.toFixed(1)}%</div>
                            <div class="analytics-label">Completion Rate</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.budgetEfficiency.toFixed(1)}%</div>
                            <div class="analytics-label">Budget Efficiency</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.breakthroughRate.toFixed(1)}</div>
                            <div class="analytics-label">Breakthrough Rate</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.innovationOutput.toFixed(1)}</div>
                            <div class="analytics-label">Innovation Output</div>
                        </div>
                    </div>
                \`;

                document.getElementById('research-analysis').innerHTML = html;
            } catch (error) {
                document.getElementById('research-analysis').innerHTML = '<div class="error">Failed to load research analysis</div>';
            }
        }

        async function loadCyberAnalysis() {
            try {
                const response = await apiCall('/analytics/cyber');
                const analysis = response.data;

                const html = \`
                    <div class="analytics-grid">
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.operationalSuccess.toFixed(1)}%</div>
                            <div class="analytics-label">Success Rate</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.detectionRate.toFixed(1)}%</div>
                            <div class="analytics-label">Detection Rate</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.costEffectiveness.toFixed(1)}</div>
                            <div class="analytics-label">Cost Effectiveness</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.technologicalGains}</div>
                            <div class="analytics-label">Technologies Acquired</div>
                        </div>
                    </div>
                \`;

                document.getElementById('cyber-analysis').innerHTML = html;
            } catch (error) {
                document.getElementById('cyber-analysis').innerHTML = '<div class="error">Failed to load cyber analysis</div>';
            }
        }

        async function loadTechnologyForecast() {
            try {
                const response = await apiCall('/analytics/forecast');
                const forecast = response.data;

                const html = \`
                    <div class="metric">
                        <span class="metric-label">Emerging Technologies</span>
                        <span class="metric-value">\${forecast.emergingTechnologies.join(', ')}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Investment Priorities</span>
                        <span class="metric-value">\${forecast.investmentPriorities.join(', ')}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Competitive Threats</span>
                        <span class="metric-value">\${forecast.competitiveThreats.join(', ')}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Opportunity Areas</span>
                        <span class="metric-value">\${forecast.opportunityAreas.join(', ')}</span>
                    </div>
                \`;

                document.getElementById('technology-forecast').innerHTML = html;
            } catch (error) {
                document.getElementById('technology-forecast').innerHTML = '<div class="error">Failed to load technology forecast</div>';
            }
        }

        async function loadSecurityAnalysis() {
            try {
                const response = await apiCall('/analytics/security');
                const analysis = response.data;

                const html = \`
                    <div class="analytics-grid">
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.overallSecurityScore.toFixed(1)}</div>
                            <div class="analytics-label">Security Score</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.vulnerabilityIndex.toFixed(1)}</div>
                            <div class="analytics-label">Vulnerability Index</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.threatExposure.toFixed(1)}</div>
                            <div class="analytics-label">Threat Exposure</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-value">\${analysis.defenseEffectiveness.toFixed(1)}%</div>
                            <div class="analytics-label">Defense Effectiveness</div>
                        </div>
                    </div>
                    <div style="margin-top: 20px;">
                        <h4>Security Recommendations:</h4>
                        \${analysis.recommendations.map(rec => \`<div class="metric"><span class="metric-label">•</span><span class="metric-value">\${rec}</span></div>\`).join('')}
                    </div>
                \`;

                document.getElementById('security-analysis').innerHTML = html;
            } catch (error) {
                document.getElementById('security-analysis').innerHTML = '<div class="error">Failed to load security analysis</div>';
            }
        }

        async function loadRecommendations() {
            try {
                // Get first civilization for recommendations
                const civilizations = await apiCall('/civilizations');
                if (civilizations.data.length === 0) {
                    document.getElementById('recommendations').innerHTML = '<p>No civilizations found for recommendations.</p>';
                    return;
                }

                const response = await apiCall(\`/recommendations/\${civilizations.data[0].civilizationId}\`);
                const recommendations = response.data;

                const html = recommendations.map(rec => \`
                    <div class="recommendation">
                        <div class="recommendation-priority priority-\${rec.priority.toLowerCase()}">\${rec.priority} Priority</div>
                        <strong>\${rec.description}</strong>
                        <p>\${rec.rationale}</p>
                        <div class="metric">
                            <span class="metric-label">Estimated Cost</span>
                            <span class="metric-value">$\${(rec.estimatedCost / 1000000).toFixed(1)}M</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Estimated Benefit</span>
                            <span class="metric-value">$\${(rec.estimatedBenefit / 1000000).toFixed(1)}M</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Timeframe</span>
                            <span class="metric-value">\${rec.timeframe}</span>
                        </div>
                    </div>
                \`).join('');

                document.getElementById('recommendations').innerHTML = html || '<p>No recommendations available.</p>';
            } catch (error) {
                document.getElementById('recommendations').innerHTML = '<div class="error">Failed to load recommendations</div>';
            }
        }

        // Sample data creation functions
        async function createSampleTechnology() {
            try {
                const sampleTech = {
                    name: \`Advanced Tech \${Date.now()}\`,
                    category: 'Computing',
                    level: 'Advanced',
                    description: 'Sample advanced technology for demonstration',
                    complexity: Math.floor(Math.random() * 5) + 6,
                    researchCost: Math.floor(Math.random() * 1000000) + 500000,
                    implementationCost: Math.floor(Math.random() * 500000) + 250000,
                    maintenanceCost: Math.floor(Math.random() * 100000) + 50000
                };

                await apiCall('/technologies', {
                    method: 'POST',
                    body: JSON.stringify(sampleTech)
                });

                document.getElementById('technologies-content').innerHTML = '<div class="success">Sample technology created successfully!</div>';
                setTimeout(loadTechnologies, 1000);
            } catch (error) {
                document.getElementById('technologies-content').innerHTML = '<div class="error">Failed to create sample technology</div>';
            }
        }

        async function startSampleResearch() {
            try {
                // Get civilizations first
                const civilizations = await apiCall('/civilizations');
                if (civilizations.data.length === 0) {
                    document.getElementById('research-content').innerHTML = '<div class="error">No civilizations found. Cannot start research project.</div>';
                    return;
                }

                const sampleProject = {
                    civilizationId: civilizations.data[0].civilizationId,
                    name: \`Research Project \${Date.now()}\`,
                    targetTechnology: 'Advanced Computing',
                    category: 'Computing',
                    budget: Math.floor(Math.random() * 1000000) + 500000,
                    researchers: Math.floor(Math.random() * 50) + 10,
                    estimatedDuration: Math.floor(Math.random() * 365) + 90
                };

                await apiCall('/research', {
                    method: 'POST',
                    body: JSON.stringify(sampleProject)
                });

                document.getElementById('research-content').innerHTML = '<div class="success">Sample research project started successfully!</div>';
                setTimeout(loadResearchProjects, 1000);
            } catch (error) {
                document.getElementById('research-content').innerHTML = '<div class="error">Failed to start sample research project</div>';
            }
        }

        async function launchSampleOperation() {
            try {
                const civilizations = await apiCall('/civilizations');
                if (civilizations.data.length < 2) {
                    document.getElementById('cyber-content').innerHTML = '<div class="error">Need at least 2 civilizations for cyber operations.</div>';
                    return;
                }

                const sampleOperation = {
                    operatorId: civilizations.data[0].civilizationId,
                    targetId: civilizations.data[1].civilizationId,
                    name: \`Cyber Op \${Date.now()}\`,
                    type: 'Technology Theft',
                    primaryObjective: 'Steal advanced computing technology',
                    duration: Math.floor(Math.random() * 90) + 7,
                    budget: Math.floor(Math.random() * 500000) + 50000,
                    personnel: Math.floor(Math.random() * 10) + 2
                };

                await apiCall('/cyber-operations', {
                    method: 'POST',
                    body: JSON.stringify(sampleOperation)
                });

                document.getElementById('cyber-content').innerHTML = '<div class="success">Sample cyber operation launched successfully!</div>';
                setTimeout(loadCyberOperations, 1000);
            } catch (error) {
                document.getElementById('cyber-content').innerHTML = '<div class="error">Failed to launch sample cyber operation</div>';
            }
        }

        async function executePendingOperations() {
            try {
                const operations = await apiCall('/cyber-operations');
                const pendingOps = operations.data.filter(op => op.status === 'Planning' || op.status === 'Active');

                if (pendingOps.length === 0) {
                    document.getElementById('cyber-content').innerHTML = '<div class="error">No pending operations to execute.</div>';
                    return;
                }

                for (const op of pendingOps.slice(0, 3)) { // Execute up to 3 operations
                    await apiCall(\`/cyber-operations/\${op.id}/execute\`, { method: 'POST' });
                }

                document.getElementById('cyber-content').innerHTML = '<div class="success">Pending operations executed successfully!</div>';
                setTimeout(loadCyberOperations, 1000);
            } catch (error) {
                document.getElementById('cyber-content').innerHTML = '<div class="error">Failed to execute pending operations</div>';
            }
        }

        async function createSampleTransfer() {
            try {
                const [civilizations, technologies] = await Promise.all([
                    apiCall('/civilizations'),
                    apiCall('/technologies')
                ]);

                if (civilizations.data.length < 2 || technologies.data.length === 0) {
                    document.getElementById('transfers-content').innerHTML = '<div class="error">Need at least 2 civilizations and 1 technology for transfers.</div>';
                    return;
                }

                const sampleTransfer = {
                    sourceId: civilizations.data[0].civilizationId,
                    recipientId: civilizations.data[1].civilizationId,
                    technologyId: technologies.data[0].id,
                    transferMethod: 'Sale',
                    cost: Math.floor(Math.random() * 1000000) + 100000
                };

                await apiCall('/transfers', {
                    method: 'POST',
                    body: JSON.stringify(sampleTransfer)
                });

                document.getElementById('transfers-content').innerHTML = '<div class="success">Sample technology transfer created successfully!</div>';
                setTimeout(loadTechnologyTransfers, 1000);
            } catch (error) {
                document.getElementById('transfers-content').innerHTML = '<div class="error">Failed to create sample transfer</div>';
            }
        }

        async function startSampleReverseEngineering() {
            try {
                const [civilizations, technologies] = await Promise.all([
                    apiCall('/civilizations'),
                    apiCall('/technologies')
                ]);

                if (civilizations.data.length === 0 || technologies.data.length === 0) {
                    document.getElementById('reverse-engineering-content').innerHTML = '<div class="error">Need civilizations and technologies for reverse engineering.</div>';
                    return;
                }

                const sampleProject = {
                    civilizationId: civilizations.data[0].civilizationId,
                    targetTechnologyId: technologies.data[0].id,
                    budget: Math.floor(Math.random() * 500000) + 100000,
                    researchers: Math.floor(Math.random() * 20) + 5
                };

                await apiCall('/reverse-engineering', {
                    method: 'POST',
                    body: JSON.stringify(sampleProject)
                });

                document.getElementById('reverse-engineering-content').innerHTML = '<div class="success">Sample reverse engineering project started successfully!</div>';
                setTimeout(loadTechnologyTransfers, 1000);
            } catch (error) {
                document.getElementById('reverse-engineering-content').innerHTML = '<div class="error">Failed to start sample reverse engineering project</div>';
            }
        }

        // Utility functions
        function getComplexityClass(complexity) {
            if (complexity <= 3) return 'low';
            if (complexity <= 6) return 'medium';
            if (complexity <= 8) return 'high';
            return 'extreme';
        }

        // Dynamic Tech Tree Functions
        async function generateTechTree() {
            try {
                const response = await fetch('/api/technology/tech-tree/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ startingEra: 'Digital', gameType: 'rapid' })
                });
                const data = await response.json();
                
                document.getElementById('tech-tree-content').innerHTML = \`
                    <div class="success">
                        <h4>✅ Tech Tree Generated Successfully!</h4>
                        <div class="metric">
                            <span class="metric-label">Starting Era</span>
                            <span class="metric-value">\${data.startingEra}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Technologies Generated</span>
                            <span class="metric-value">\${data.technologies}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Psychic Powers</span>
                            <span class="metric-value">\${data.psychicPowers}</span>
                        </div>
                    </div>
                \`;
            } catch (error) {
                document.getElementById('tech-tree-content').innerHTML = '<div class="error">Failed to generate tech tree</div>';
            }
        }

        async function loadPsychicPowers() {
            try {
                const response = await fetch('/api/technology/psychic-powers');
                const data = await response.json();
                
                let html = '<div class="psychic-powers-grid">';
                data.psychicPowers.forEach(power => {
                    html += \`
                        <div class="power-card">
                            <h4>🧠 \${power.name}</h4>
                            <div class="power-details">
                                <div class="metric">
                                    <span class="metric-label">Category</span>
                                    <span class="metric-value">\${power.category}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Level</span>
                                    <span class="metric-value">\${power.level}/10</span>
                                </div>
                                <div class="power-description">\${power.description}</div>
                            </div>
                        </div>
                    \`;
                });
                html += '</div>';
                
                document.getElementById('psychic-content').innerHTML = html;
            } catch (error) {
                document.getElementById('psychic-content').innerHTML = '<div class="error">Failed to load psychic powers</div>';
            }
        }

        async function triggerCorporateInnovation() {
            try {
                const civilizations = await fetch('/api/technology/civilizations').then(r => r.json());
                if (civilizations.civilizations.length === 0) {
                    document.getElementById('corporate-innovation').innerHTML = '<div class="error">No civilizations available</div>';
                    return;
                }
                
                const response = await fetch('/api/technology/innovation/corporate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        civilizationId: civilizations.civilizations[0].civilizationId,
                        corporationId: 'megacorp_001',
                        researchBudget: 5000000,
                        targetCategory: 'AI',
                        competitivePressure: 0.7
                    })
                });
                const data = await response.json();
                
                document.getElementById('corporate-innovation').innerHTML = \`
                    <div class="success">
                        <h4>🏢 Corporate Innovation Triggered</h4>
                        <div class="metric">
                            <span class="metric-label">Organization</span>
                            <span class="metric-value">\${data.innovationEvent.organization}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Budget</span>
                            <span class="metric-value">$\${data.innovationEvent.cost.toLocaleString()}</span>
                        </div>
                    </div>
                \`;
            } catch (error) {
                document.getElementById('corporate-innovation').innerHTML = '<div class="error">Failed to trigger corporate innovation</div>';
            }
        }

        async function loadInnovationEvents() {
            try {
                const response = await fetch('/api/technology/innovation/events');
                const data = await response.json();
                
                let html = '<div class="innovation-events">';
                if (data.innovationEvents.length === 0) {
                    html += '<div class="info">No innovation events yet. Trigger some innovation to see events here.</div>';
                } else {
                    data.innovationEvents.slice(0, 5).forEach(event => {
                        const statusIcon = event.outcome ? '✅' : '⏳';
                        html += \`
                            <div class="event-card">
                                <h4>\${statusIcon} \${event.type}</h4>
                                <div class="metric">
                                    <span class="metric-label">Organization</span>
                                    <span class="metric-value">\${event.organization}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Team Size</span>
                                    <span class="metric-value">\${event.team.length} members</span>
                                </div>
                            </div>
                        \`;
                    });
                }
                html += '</div>';
                
                document.getElementById('innovation-events').innerHTML = html;
            } catch (error) {
                document.getElementById('innovation-events').innerHTML = '<div class="error">Failed to load innovation events</div>';
            }
        }

        // Initialize the demo
        document.addEventListener('DOMContentLoaded', function() {
            loadOverview();
        });
    </script>
</body>
</html>
  `;

  res.send(demoHtml);
});

export default router;
