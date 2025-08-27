// Conquest and Planet Merge Demo Page

function getConquestDemo() {
    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Conquest & Planet Merge System - Startales Demo</title>
    <style>
        :root {
            --bg-primary: #0a0a0a;
            --bg-secondary: #1a1a1a;
            --bg-surface: #2a2a2a;
            --text-primary: #ffffff;
            --text-secondary: #cccccc;
            --text-muted: #888888;
            --accent-primary: #ff6b35;
            --accent-secondary: #f7931e;
            --success: #4caf50;
            --warning: #ff9800;
            --danger: #f44336;
            --info: #2196f3;
            --border: #333333;
            --border-light: #444444;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
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
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }

        .tabs {
            display: flex;
            background: var(--bg-secondary);
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
        }

        .tab {
            flex: 1;
            padding: 15px 20px;
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            border-bottom: 3px solid transparent;
        }

        .tab:hover {
            background: var(--bg-surface);
            color: var(--text-primary);
        }

        .tab.active {
            background: var(--bg-surface);
            color: var(--accent-primary);
            border-bottom-color: var(--accent-primary);
        }

        .tab-content {
            display: none;
            animation: fadeIn 0.3s ease-in;
        }

        .tab-content.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .card {
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid var(--border);
            transition: all 0.3s ease;
        }

        .card:hover {
            border-color: var(--accent-primary);
            box-shadow: 0 4px 20px rgba(255, 107, 53, 0.2);
        }

        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border);
        }

        .card-icon {
            font-size: 1.5em;
            margin-right: 10px;
        }

        .card-title {
            font-size: 1.3em;
            font-weight: bold;
            color: var(--accent-primary);
        }

        .card-content {
            color: var(--text-secondary);
        }

        .stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid var(--border-light);
        }

        .stat-row:last-child {
            border-bottom: none;
        }

        .stat-label {
            color: var(--text-secondary);
        }

        .stat-value {
            color: var(--text-primary);
            font-weight: bold;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: var(--bg-surface);
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
            transition: width 0.3s ease;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            text-transform: uppercase;
        }

        .status-active { background: var(--success); color: white; }
        .status-planning { background: var(--info); color: white; }
        .status-completed { background: var(--success); color: white; }
        .status-failed { background: var(--danger); color: white; }
        .status-discovered { background: var(--warning); color: white; }
        .status-surveyed { background: var(--info); color: white; }
        .status-claimed { background: var(--accent-primary); color: white; }
        .status-colonized { background: var(--success); color: white; }

        .btn {
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            margin: 5px;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
        }

        .btn-secondary {
            background: linear-gradient(135deg, var(--bg-surface), var(--border));
        }

        .btn-danger {
            background: linear-gradient(135deg, var(--danger), #d32f2f);
        }

        .btn-success {
            background: linear-gradient(135deg, var(--success), #388e3c);
        }

        .actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            flex-wrap: wrap;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
        }

        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-content {
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            border: 1px solid var(--border);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .modal-title {
            font-size: 1.5em;
            color: var(--accent-primary);
        }

        .close-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.5em;
            cursor: pointer;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            margin-bottom: 5px;
            color: var(--text-secondary);
            font-weight: bold;
        }

        .form-input, .form-select {
            width: 100%;
            padding: 10px;
            background: var(--bg-surface);
            border: 1px solid var(--border);
            border-radius: 6px;
            color: var(--text-primary);
            font-size: 14px;
        }

        .form-input:focus, .form-select:focus {
            outline: none;
            border-color: var(--accent-primary);
        }

        .objectives-list {
            list-style: none;
            padding: 0;
        }

        .objective-item {
            display: flex;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid var(--border-light);
        }

        .objective-item:last-child {
            border-bottom: none;
        }

        .objective-status {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 10px;
        }

        .objective-status.completed { background: var(--success); }
        .objective-status.in-progress { background: var(--warning); }
        .objective-status.pending { background: var(--text-muted); }

        .loading {
            text-align: center;
            padding: 40px;
            color: var(--text-secondary);
        }

        .loading::after {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid var(--text-muted);
            border-top-color: var(--accent-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: 10px;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .metric-card {
            background: var(--bg-surface);
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid var(--border);
        }

        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: var(--accent-primary);
            display: block;
        }

        .metric-label {
            color: var(--text-secondary);
            font-size: 0.9em;
        }

        .timeline {
            position: relative;
            padding-left: 30px;
        }

        .timeline::before {
            content: '';
            position: absolute;
            left: 10px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: var(--border);
        }

        .timeline-item {
            position: relative;
            margin-bottom: 20px;
            padding: 15px;
            background: var(--bg-surface);
            border-radius: 8px;
            border: 1px solid var(--border);
        }

        .timeline-item::before {
            content: '';
            position: absolute;
            left: -25px;
            top: 20px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--accent-primary);
        }

        .timeline-date {
            color: var(--text-muted);
            font-size: 0.9em;
            margin-bottom: 5px;
        }

        .timeline-title {
            color: var(--accent-primary);
            font-weight: bold;
            margin-bottom: 5px;
        }

        .timeline-description {
            color: var(--text-secondary);
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }

            .header h1 {
                font-size: 2em;
            }

            .grid {
                grid-template-columns: 1fr;
            }

            .tabs {
                flex-direction: column;
            }

            .actions {
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Conquest & Planet Merge System</h1>
            <p>Manage territorial expansion, planetary conquest, and civilization integration</p>
        </div>

        <div class="tabs">
            <button class="tab active" onclick="switchTab('overview')">📊 Overview</button>
            <button class="tab" onclick="switchTab('campaigns')">⚔️ Active Campaigns</button>
            <button class="tab" onclick="switchTab('discoveries')">🔍 Discoveries</button>
            <button class="tab" onclick="switchTab('mergers')">🔄 Mergers</button>
            <button class="tab" onclick="switchTab('integrations')">🏗️ Integrations</button>
        </div>

        <!-- Overview Tab -->
        <div id="overview" class="tab-content active">
            <div class="metrics-grid">
                <div class="metric-card">
                    <span class="metric-value" id="activeCampaignsCount">-</span>
                    <span class="metric-label">Active Campaigns</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value" id="discoveredPlanetsCount">-</span>
                    <span class="metric-label">Discovered Planets</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value" id="completedMergersCount">-</span>
                    <span class="metric-label">Completed Mergers</span>
                </div>
                <div class="metric-card">
                    <span class="metric-value" id="activeIntegrationsCount">-</span>
                    <span class="metric-label">Active Integrations</span>
                </div>
            </div>

            <div class="grid">
                <div class="card">
                    <div class="card-header">
                        <span class="card-icon">📈</span>
                        <span class="card-title">Integration Metrics</span>
                    </div>
                    <div class="card-content" id="integrationMetrics">
                        <div class="loading">Loading metrics...</div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <span class="card-icon">📅</span>
                        <span class="card-title">Recent Activity</span>
                    </div>
                    <div class="card-content">
                        <div class="timeline" id="recentActivity">
                            <div class="loading">Loading activity...</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="actions">
                <button class="btn" onclick="openNewCampaignModal()">🚀 Start New Campaign</button>
                <button class="btn btn-secondary" onclick="openDiscoveryModal()">🔍 Discover Planet</button>
                <button class="btn btn-success" onclick="simulateTime()">⏰ Simulate Time Passage</button>
            </div>
        </div>

        <!-- Active Campaigns Tab -->
        <div id="campaigns" class="tab-content">
            <div class="actions">
                <button class="btn" onclick="openNewCampaignModal()">🚀 Start New Campaign</button>
                <button class="btn btn-secondary" onclick="loadCampaigns()">🔄 Refresh</button>
            </div>
            <div class="grid" id="campaignsGrid">
                <div class="loading">Loading campaigns...</div>
            </div>
        </div>

        <!-- Discoveries Tab -->
        <div id="discoveries" class="tab-content">
            <div class="actions">
                <button class="btn" onclick="openDiscoveryModal()">🔍 Discover New Planet</button>
                <button class="btn btn-secondary" onclick="loadDiscoveries()">🔄 Refresh</button>
            </div>
            <div class="grid" id="discoveriesGrid">
                <div class="loading">Loading discoveries...</div>
            </div>
        </div>

        <!-- Mergers Tab -->
        <div id="mergers" class="tab-content">
            <div class="actions">
                <button class="btn btn-secondary" onclick="loadMergers()">🔄 Refresh</button>
            </div>
            <div class="grid" id="mergersGrid">
                <div class="loading">Loading mergers...</div>
            </div>
        </div>

        <!-- Integrations Tab -->
        <div id="integrations" class="tab-content">
            <div class="actions">
                <button class="btn btn-secondary" onclick="loadIntegrations()">🔄 Refresh</button>
            </div>
            <div class="grid" id="integrationsGrid">
                <div class="loading">Loading integrations...</div>
            </div>
        </div>
    </div>

    <!-- New Campaign Modal -->
    <div id="newCampaignModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Start New Campaign</h2>
                <button class="close-btn" onclick="closeModal('newCampaignModal')">&times;</button>
            </div>
            <form id="newCampaignForm">
                <div class="form-group">
                    <label class="form-label">Target System</label>
                    <input type="text" class="form-input" id="targetSystem" placeholder="e.g., kepler-442" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Target Planet</label>
                    <input type="text" class="form-input" id="targetPlanet" placeholder="e.g., kepler-442b" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Campaign Type</label>
                    <select class="form-select" id="campaignType" required>
                        <option value="conquest">Military Conquest</option>
                        <option value="discovery">Peaceful Colonization</option>
                        <option value="diplomacy">Diplomatic Annexation</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Fleet Size</label>
                    <input type="number" class="form-input" id="fleetSize" min="1" max="50" value="5">
                </div>
                <div class="form-group">
                    <label class="form-label">Troop Count</label>
                    <input type="number" class="form-input" id="troopCount" min="1000" max="1000000" value="50000">
                </div>
                <div class="actions">
                    <button type="submit" class="btn">🚀 Launch Campaign</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal('newCampaignModal')">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Discovery Modal -->
    <div id="discoveryModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Discover New Planet</h2>
                <button class="close-btn" onclick="closeModal('discoveryModal')">&times;</button>
            </div>
            <form id="discoveryForm">
                <div class="form-group">
                    <label class="form-label">System Name</label>
                    <input type="text" class="form-input" id="discoverySystem" placeholder="e.g., wolf-359" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Coordinates X</label>
                    <input type="number" class="form-input" id="coordX" min="-50" max="50" value="0">
                </div>
                <div class="form-group">
                    <label class="form-label">Coordinates Y</label>
                    <input type="number" class="form-input" id="coordY" min="-50" max="50" value="0">
                </div>
                <div class="form-group">
                    <label class="form-label">Coordinates Z</label>
                    <input type="number" class="form-input" id="coordZ" min="-50" max="50" value="0">
                </div>
                <div class="form-group">
                    <label class="form-label">Discoverer Civilization</label>
                    <select class="form-select" id="discovererCiv" required>
                        <option value="terran-federation">Terran Federation</option>
                        <option value="martian-republic">Martian Republic</option>
                        <option value="zephyrian-empire">Zephyrian Empire</option>
                        <option value="jovian-collective">Jovian Collective</option>
                    </select>
                </div>
                <div class="actions">
                    <button type="submit" class="btn">🔍 Discover Planet</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal('discoveryModal')">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        // Global state
        let currentTab = 'overview';
        let overviewData = null;

        // Initialize the demo
        document.addEventListener('DOMContentLoaded', function() {
            loadOverview();
            loadCampaigns();
            loadDiscoveries();
            loadMergers();
            loadIntegrations();

            // Set up form handlers
            document.getElementById('newCampaignForm').addEventListener('submit', handleNewCampaign);
            document.getElementById('discoveryForm').addEventListener('submit', handleDiscovery);
        });

        // Tab switching
        function switchTab(tabName) {
            // Update tab buttons
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            document.querySelector(\`[onclick="switchTab('\${tabName}')"]\`).classList.add('active');

            // Update tab content
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(tabName).classList.add('active');

            currentTab = tabName;

            // Load data for the active tab
            switch(tabName) {
                case 'overview':
                    loadOverview();
                    break;
                case 'campaigns':
                    loadCampaigns();
                    break;
                case 'discoveries':
                    loadDiscoveries();
                    break;
                case 'mergers':
                    loadMergers();
                    break;
                case 'integrations':
                    loadIntegrations();
                    break;
            }
        }

        // Load overview data
        async function loadOverview() {
            try {
                const response = await fetch('/api/conquest/overview');
                const data = await response.json();

                if (data.success) {
                    overviewData = data.data;
                    updateOverviewDisplay();
                } else {
                    console.error('Failed to load overview:', data.error);
                }
            } catch (error) {
                console.error('Error loading overview:', error);
            }
        }

        function updateOverviewDisplay() {
            if (!overviewData) return;

            // Update metric cards
            document.getElementById('activeCampaignsCount').textContent = overviewData.activeCampaigns;
            document.getElementById('discoveredPlanetsCount').textContent = overviewData.discoveredPlanets;
            document.getElementById('completedMergersCount').textContent = overviewData.completedMergers;
            document.getElementById('activeIntegrationsCount').textContent = overviewData.activeIntegrations;

            // Update integration metrics
            const metricsContainer = document.getElementById('integrationMetrics');
            const metrics = overviewData.integrationMetrics;
            metricsContainer.innerHTML = \`
                <div class="stat-row">
                    <span class="stat-label">Success Rate</span>
                    <span class="stat-value">\${(metrics.successRate * 100).toFixed(1)}%</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Avg Integration Time</span>
                    <span class="stat-value">\${metrics.averageIntegrationTime} days</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Population Satisfaction</span>
                    <span class="stat-value">\${(metrics.populationSatisfaction * 100).toFixed(1)}%</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Rebellion Risk</span>
                    <span class="stat-value">\${(metrics.rebellionRisk * 100).toFixed(1)}%</span>
                </div>
            \`;

            // Update recent activity
            const activityContainer = document.getElementById('recentActivity');
            if (overviewData.recentActivity && overviewData.recentActivity.length > 0) {
                activityContainer.innerHTML = overviewData.recentActivity.map(activity => \`
                    <div class="timeline-item">
                        <div class="timeline-date">\${activity.date}</div>
                        <div class="timeline-title">\${activity.target}</div>
                        <div class="timeline-description">\${activity.type} \${activity.action}</div>
                    </div>
                \`).join('');
            } else {
                activityContainer.innerHTML = '<div class="timeline-item"><div class="timeline-description">No recent activity</div></div>';
            }
        }

        // Load campaigns
        async function loadCampaigns() {
            try {
                const response = await fetch('/api/conquest/campaigns');
                const data = await response.json();

                if (data.success) {
                    displayCampaigns(data.data);
                } else {
                    console.error('Failed to load campaigns:', data.error);
                }
            } catch (error) {
                console.error('Error loading campaigns:', error);
                document.getElementById('campaignsGrid').innerHTML = '<div class="card"><div class="card-content">Error loading campaigns</div></div>';
            }
        }

        function displayCampaigns(campaigns) {
            const container = document.getElementById('campaignsGrid');
            
            if (campaigns.length === 0) {
                container.innerHTML = '<div class="card"><div class="card-content">No active campaigns</div></div>';
                return;
            }

            container.innerHTML = campaigns.map(campaign => \`
                <div class="card">
                    <div class="card-header">
                        <span class="card-icon">\${campaign.defendingCiv ? '⚔️' : '🚀'}</span>
                        <span class="card-title">\${campaign.name}</span>
                    </div>
                    <div class="card-content">
                        <div class="stat-row">
                            <span class="stat-label">Target</span>
                            <span class="stat-value">\${campaign.targetPlanet}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">System</span>
                            <span class="stat-value">\${campaign.targetSystem}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Status</span>
                            <span class="status-badge status-\${campaign.status}">\${campaign.status}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Progress</span>
                            <span class="stat-value">\${campaign.progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: \${campaign.progress}%"></div>
                        </div>
                        
                        <div style="margin-top: 15px;">
                            <strong>Objectives:</strong>
                            <ul class="objectives-list">
                                \${campaign.objectives.map(obj => \`
                                    <li class="objective-item">
                                        <div class="objective-status \${obj.status}"></div>
                                        <span>\${obj.name}</span>
                                    </li>
                                \`).join('')}
                            </ul>
                        </div>
                        
                        <div class="actions">
                            <button class="btn btn-success" onclick="updateCampaignProgress('\${campaign.id}', 10)">
                                📈 Advance Progress
                            </button>
                            \${campaign.progress >= 90 ? \`
                                <button class="btn" onclick="completeCampaign('\${campaign.id}')">
                                    ✅ Complete Campaign
                                </button>
                            \` : ''}
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        // Load discoveries
        async function loadDiscoveries() {
            try {
                const response = await fetch('/api/conquest/discoveries');
                const data = await response.json();

                if (data.success) {
                    displayDiscoveries(data.data);
                } else {
                    console.error('Failed to load discoveries:', data.error);
                }
            } catch (error) {
                console.error('Error loading discoveries:', error);
                document.getElementById('discoveriesGrid').innerHTML = '<div class="card"><div class="card-content">Error loading discoveries</div></div>';
            }
        }

        function displayDiscoveries(discoveries) {
            const container = document.getElementById('discoveriesGrid');
            
            if (discoveries.length === 0) {
                container.innerHTML = '<div class="card"><div class="card-content">No discovered planets</div></div>';
                return;
            }

            container.innerHTML = discoveries.map(planet => \`
                <div class="card">
                    <div class="card-header">
                        <span class="card-icon">🪐</span>
                        <span class="card-title">\${planet.name}</span>
                    </div>
                    <div class="card-content">
                        <div class="stat-row">
                            <span class="stat-label">System</span>
                            <span class="stat-value">\${planet.system}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Status</span>
                            <span class="status-badge status-\${planet.status}">\${planet.status}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Habitability</span>
                            <span class="stat-value">\${(planet.habitability * 100).toFixed(1)}%</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Discovered By</span>
                            <span class="stat-value">\${planet.discoveredBy}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Est. Value</span>
                            <span class="stat-value">\${planet.estimatedValue.toLocaleString()} credits</span>
                        </div>
                        
                        <div style="margin-top: 15px;">
                            <strong>Resources:</strong>
                            <div class="stat-row">
                                <span class="stat-label">Minerals</span>
                                <span class="stat-value">\${planet.resources.minerals}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Water</span>
                                <span class="stat-value">\${planet.resources.water}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Atmosphere</span>
                                <span class="stat-value">\${planet.resources.atmosphere}</span>
                            </div>
                        </div>
                        
                        \${planet.threats.length > 0 ? \`
                            <div style="margin-top: 15px;">
                                <strong>Threats:</strong>
                                <div style="color: var(--danger); font-size: 0.9em;">
                                    \${planet.threats.join(', ')}
                                </div>
                            </div>
                        \` : ''}
                        
                        <div class="actions">
                            \${planet.status === 'discovered' || planet.status === 'surveyed' ? \`
                                <button class="btn" onclick="claimPlanet('\${planet.id}', 'terran-federation')">
                                    🏴 Claim Planet
                                </button>
                            \` : ''}
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        // Load mergers
        async function loadMergers() {
            try {
                const response = await fetch('/api/conquest/mergers');
                const data = await response.json();

                if (data.success) {
                    displayMergers(data.data);
                } else {
                    console.error('Failed to load mergers:', data.error);
                }
            } catch (error) {
                console.error('Error loading mergers:', error);
                document.getElementById('mergersGrid').innerHTML = '<div class="card"><div class="card-content">Error loading mergers</div></div>';
            }
        }

        function displayMergers(mergers) {
            const container = document.getElementById('mergersGrid');
            
            if (mergers.length === 0) {
                container.innerHTML = '<div class="card"><div class="card-content">No completed mergers</div></div>';
                return;
            }

            container.innerHTML = mergers.map(merger => \`
                <div class="card">
                    <div class="card-header">
                        <span class="card-icon">\${merger.type === 'conquest' ? '⚔️' : '🤝'}</span>
                        <span class="card-title">\${merger.planet}</span>
                    </div>
                    <div class="card-content">
                        <div class="stat-row">
                            <span class="stat-label">Type</span>
                            <span class="stat-value">\${merger.type}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">System</span>
                            <span class="stat-value">\${merger.system}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Integration Status</span>
                            <span class="status-badge status-\${merger.integrationStatus.replace('-', '')}">\${merger.integrationStatus}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Completion Date</span>
                            <span class="stat-value">\${merger.completionDate}</span>
                        </div>
                        
                        <div style="margin-top: 15px;">
                            <strong>Population Impact:</strong>
                            <div class="stat-row">
                                <span class="stat-label">Original Population</span>
                                <span class="stat-value">\${merger.populationTransfer.original.toLocaleString()}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Satisfaction</span>
                                <span class="stat-value">\${(merger.populationTransfer.satisfaction * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                        
                        <div style="margin-top: 15px;">
                            <strong>Economic Impact:</strong>
                            <div class="stat-row">
                                <span class="stat-label">GDP Change</span>
                                <span class="stat-value">+\${merger.economicImpact.gdpChange.toFixed(1)}%</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">New Resources</span>
                                <span class="stat-value">\${merger.economicImpact.resourceAccess.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        // Load integrations
        async function loadIntegrations() {
            try {
                const response = await fetch('/api/conquest/integrations');
                const data = await response.json();

                if (data.success) {
                    displayIntegrations(data.data);
                } else {
                    console.error('Failed to load integrations:', data.error);
                }
            } catch (error) {
                console.error('Error loading integrations:', error);
                document.getElementById('integrationsGrid').innerHTML = '<div class="card"><div class="card-content">Error loading integrations</div></div>';
            }
        }

        function displayIntegrations(integrations) {
            const container = document.getElementById('integrationsGrid');
            
            if (integrations.length === 0) {
                container.innerHTML = '<div class="card"><div class="card-content">No active integrations</div></div>';
                return;
            }

            container.innerHTML = integrations.map(integration => \`
                <div class="card">
                    <div class="card-header">
                        <span class="card-icon">🏗️</span>
                        <span class="card-title">\${integration.planetId}</span>
                    </div>
                    <div class="card-content">
                        <div class="stat-row">
                            <span class="stat-label">Current Phase</span>
                            <span class="stat-value">\${integration.phase}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Progress</span>
                            <span class="stat-value">\${(integration.progress * 100).toFixed(1)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: \${integration.progress * 100}%"></div>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Time Remaining</span>
                            <span class="stat-value">\${integration.timeRemaining} days</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Success Probability</span>
                            <span class="stat-value">\${(integration.successProbability * 100).toFixed(1)}%</span>
                        </div>
                        
                        \${integration.challenges.length > 0 ? \`
                            <div style="margin-top: 15px;">
                                <strong>Challenges:</strong>
                                <div style="color: var(--warning); font-size: 0.9em;">
                                    \${integration.challenges.join(', ')}
                                </div>
                            </div>
                        \` : ''}
                        
                        <div class="actions">
                            <button class="btn btn-success" onclick="advanceIntegration('\${integration.planetId}', 7)">
                                📅 Advance 1 Week
                            </button>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        // Modal functions
        function openNewCampaignModal() {
            document.getElementById('newCampaignModal').classList.add('active');
        }

        function openDiscoveryModal() {
            document.getElementById('discoveryModal').classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        // Form handlers
        async function handleNewCampaign(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const campaignData = {
                targetSystem: formData.get('targetSystem') || document.getElementById('targetSystem').value,
                targetPlanet: formData.get('targetPlanet') || document.getElementById('targetPlanet').value,
                campaignType: formData.get('campaignType') || document.getElementById('campaignType').value,
                forces: {
                    attacking: {
                        fleets: parseInt(document.getElementById('fleetSize').value),
                        troops: parseInt(document.getElementById('troopCount').value),
                        strength: parseInt(document.getElementById('fleetSize').value) * 500 + parseInt(document.getElementById('troopCount').value) / 100
                    },
                    defending: null
                }
            };

            try {
                const response = await fetch('/api/conquest/campaigns', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(campaignData)
                });

                const result = await response.json();
                
                if (result.success) {
                    alert(\`Campaign "\${result.data.name}" started successfully!\`);
                    closeModal('newCampaignModal');
                    document.getElementById('newCampaignForm').reset();
                    loadCampaigns();
                    loadOverview();
                } else {
                    alert('Failed to start campaign: ' + result.error);
                }
            } catch (error) {
                console.error('Error starting campaign:', error);
                alert('Error starting campaign');
            }
        }

        async function handleDiscovery(event) {
            event.preventDefault();
            
            const discoveryData = {
                systemName: document.getElementById('discoverySystem').value,
                coordinates: {
                    x: parseInt(document.getElementById('coordX').value),
                    y: parseInt(document.getElementById('coordY').value),
                    z: parseInt(document.getElementById('coordZ').value)
                },
                discovererCiv: document.getElementById('discovererCiv').value
            };

            try {
                const response = await fetch('/api/conquest/discoveries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(discoveryData)
                });

                const result = await response.json();
                
                if (result.success) {
                    alert(\`Planet "\${result.data.name}" discovered successfully!\`);
                    closeModal('discoveryModal');
                    document.getElementById('discoveryForm').reset();
                    loadDiscoveries();
                    loadOverview();
                } else {
                    alert('Failed to discover planet: ' + result.error);
                }
            } catch (error) {
                console.error('Error discovering planet:', error);
                alert('Error discovering planet');
            }
        }

        // Action functions
        async function updateCampaignProgress(campaignId, progressDelta) {
            try {
                const response = await fetch(\`/api/conquest/campaigns/\${campaignId}/progress\`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ progressDelta })
                });

                const result = await response.json();
                
                if (result.success) {
                    loadCampaigns();
                    loadOverview();
                } else {
                    alert('Failed to update campaign progress: ' + result.error);
                }
            } catch (error) {
                console.error('Error updating campaign progress:', error);
                alert('Error updating campaign progress');
            }
        }

        async function completeCampaign(campaignId) {
            try {
                const response = await fetch(\`/api/conquest/campaigns/\${campaignId}/complete\`, {
                    method: 'POST'
                });

                const result = await response.json();
                
                if (result.success) {
                    alert('Campaign completed successfully! Integration process started.');
                    loadCampaigns();
                    loadMergers();
                    loadIntegrations();
                    loadOverview();
                } else {
                    alert('Failed to complete campaign: ' + result.error);
                }
            } catch (error) {
                console.error('Error completing campaign:', error);
                alert('Error completing campaign');
            }
        }

        async function claimPlanet(planetId, claimantCiv) {
            try {
                const response = await fetch(\`/api/conquest/discoveries/\${planetId}/claim\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ claimantCiv })
                });

                const result = await response.json();
                
                if (result.success) {
                    alert(result.message);
                    loadDiscoveries();
                    loadCampaigns();
                    loadOverview();
                } else {
                    alert('Failed to claim planet: ' + result.error);
                }
            } catch (error) {
                console.error('Error claiming planet:', error);
                alert('Error claiming planet');
            }
        }

        async function advanceIntegration(planetId, days) {
            try {
                const response = await fetch(\`/api/conquest/integrations/\${planetId}/progress\`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ daysPassed: days })
                });

                const result = await response.json();
                
                if (result.success) {
                    loadIntegrations();
                    loadOverview();
                } else {
                    alert('Failed to advance integration: ' + result.error);
                }
            } catch (error) {
                console.error('Error advancing integration:', error);
                alert('Error advancing integration');
            }
        }

        async function simulateTime() {
            try {
                const response = await fetch('/api/conquest/simulate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ days: 7 })
                });

                const result = await response.json();
                
                if (result.success) {
                    alert('Simulated 1 week of progress!');
                    // Reload all data
                    loadOverview();
                    loadCampaigns();
                    loadDiscoveries();
                    loadMergers();
                    loadIntegrations();
                } else {
                    alert('Failed to simulate time: ' + result.error);
                }
            } catch (error) {
                console.error('Error simulating time:', error);
                alert('Error simulating time');
            }
        }

        // Close modals when clicking outside
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.classList.remove('active');
            }
        });
    </script>
</body>
</html>`;
}

module.exports = { getConquestDemo };

