// Cities Management Screen - Urban Planning and City Development
// Integrates with /api/cities/* endpoints for comprehensive city management

function getCitiesManagementScreen() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Witty Galaxy - Cities Management</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
        
        :root {
            --primary-glow: #00d9ff;
            --primary-bright: #0099cc;
            --primary-dark: #004d66;
            --secondary-glow: #ff6b35;
            --accent-success: #00ff88;
            --accent-warning: #ffaa00;
            --accent-danger: #ff3366;
            --accent-info: #3366ff;
            --bg-primary: #0a0a0f;
            --bg-secondary: #1a1a2e;
            --bg-panel: #16213e;
            --bg-card: #1e2749;
            --bg-hover: #2a3f5f;
            --text-primary: #e0e6ed;
            --text-secondary: #b8c5d1;
            --text-muted: #8a9ba8;
            --text-accent: var(--primary-glow);
            --border-primary: #2d4a6b;
            --border-accent: var(--primary-glow);
            --border-subtle: #1a2332;
            --shadow-glow: 0 0 20px rgba(0, 217, 255, 0.3);
            --shadow-panel: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Rajdhani', sans-serif;
            background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
            color: var(--text-primary);
            overflow-x: hidden;
            min-height: 100vh;
        }
        
        .cities-container {
            display: grid;
            grid-template-areas: 
                "header header header"
                "sidebar main-content right-panel"
                "footer footer footer";
            grid-template-columns: 300px 1fr 350px;
            grid-template-rows: 80px 1fr 60px;
            height: 100vh;
            gap: 1px;
            background: var(--border-subtle);
        }
        
        /* Header */
        .cities-header {
            grid-area: header;
            background: var(--bg-panel);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            border-bottom: 2px solid var(--border-accent);
            box-shadow: var(--shadow-panel);
        }
        
        .header-title {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .header-title h1 {
            font-family: 'Orbitron', monospace;
            font-size: 24px;
            font-weight: 700;
            color: var(--primary-glow);
        }
        
        .cities-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--accent-success) 0%, var(--primary-glow) 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: white;
        }
        
        .header-controls {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        
        .control-btn {
            padding: 8px 16px;
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: 6px;
            color: var(--text-primary);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
        }
        
        .control-btn:hover {
            background: var(--bg-hover);
            border-color: var(--border-accent);
        }
        
        .control-btn.active {
            background: var(--primary-dark);
            border-color: var(--primary-bright);
            color: var(--primary-glow);
            box-shadow: var(--shadow-glow);
        }
        
        /* Sidebar */
        .cities-sidebar {
            grid-area: sidebar;
            background: var(--bg-panel);
            padding: 20px;
            overflow-y: auto;
        }
        
        .sidebar-section {
            margin-bottom: 24px;
        }
        
        .sidebar-title {
            font-family: 'Orbitron', monospace;
            font-size: 16px;
            font-weight: 600;
            color: var(--text-accent);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .city-list {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .city-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: 8px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .city-item:hover {
            border-color: var(--border-accent);
            box-shadow: var(--shadow-glow);
            transform: translateY(-1px);
        }
        
        .city-item.selected {
            border-color: var(--primary-bright);
            background: var(--bg-hover);
        }
        
        .city-avatar {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            background: var(--primary-dark);
            color: var(--primary-glow);
        }
        
        .city-info h4 {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 2px;
        }
        
        .city-info p {
            font-size: 12px;
            color: var(--text-muted);
        }
        
        .city-status {
            margin-left: auto;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .city-status.thriving {
            background: var(--accent-success);
            color: var(--bg-primary);
        }
        
        .city-status.growing {
            background: var(--accent-warning);
            color: var(--bg-primary);
        }
        
        .city-status.stable {
            background: var(--accent-info);
            color: white;
        }
        
        /* Main Content */
        .cities-main {
            grid-area: main-content;
            background: var(--bg-secondary);
            padding: 24px;
            overflow-y: auto;
        }
        
        .content-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border-subtle);
        }
        
        .content-title {
            font-family: 'Orbitron', monospace;
            font-size: 28px;
            font-weight: 700;
            color: var(--text-primary);
        }
        
        .content-actions {
            display: flex;
            gap: 12px;
        }
        
        .action-btn {
            padding: 10px 20px;
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: 6px;
            color: var(--text-primary);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .action-btn:hover {
            background: var(--bg-hover);
            border-color: var(--border-accent);
        }
        
        .action-btn.primary {
            background: var(--primary-dark);
            border-color: var(--primary-bright);
            color: var(--primary-glow);
        }
        
        /* City Overview Grid */
        .city-overview {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 24px;
            margin-bottom: 32px;
        }
        
        .city-map {
            background: var(--bg-panel);
            border: 1px solid var(--border-primary);
            border-radius: 12px;
            padding: 24px;
            position: relative;
            min-height: 400px;
        }
        
        .map-title {
            font-family: 'Orbitron', monospace;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .city-visual {
            width: 100%;
            height: 300px;
            background: linear-gradient(135deg, #1a1a3a 0%, #2d4a6b 100%);
            border-radius: 8px;
            position: relative;
            overflow: hidden;
        }
        
        .building {
            position: absolute;
            background: linear-gradient(180deg, var(--primary-glow) 0%, var(--primary-dark) 100%);
            border-radius: 2px 2px 0 0;
            box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
        }
        
        .building.residential {
            background: linear-gradient(180deg, var(--accent-success) 0%, #2e7d32 100%);
        }
        
        .building.commercial {
            background: linear-gradient(180deg, var(--accent-warning) 0%, #f57c00 100%);
        }
        
        .building.industrial {
            background: linear-gradient(180deg, var(--secondary-glow) 0%, #d32f2f 100%);
        }
        
        .city-stats {
            background: var(--bg-panel);
            border: 1px solid var(--border-primary);
            border-radius: 12px;
            padding: 24px;
        }
        
        .stats-title {
            font-family: 'Orbitron', monospace;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 20px;
        }
        
        .stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid var(--border-subtle);
        }
        
        .stat-row:last-child {
            border-bottom: none;
        }
        
        .stat-label {
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .stat-value {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .stat-change {
            font-size: 12px;
            margin-left: 8px;
        }
        
        .stat-change.positive { color: var(--accent-success); }
        .stat-change.negative { color: var(--accent-danger); }
        .stat-change.neutral { color: var(--accent-warning); }
        
        /* Infrastructure Grid */
        .infrastructure-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }
        
        .infrastructure-card {
            background: var(--bg-panel);
            border: 1px solid var(--border-primary);
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s ease;
        }
        
        .infrastructure-card:hover {
            border-color: var(--border-accent);
            box-shadow: var(--shadow-glow);
            transform: translateY(-2px);
        }
        
        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
        }
        
        .card-title {
            font-family: 'Orbitron', monospace;
            font-size: 16px;
            font-weight: 600;
            color: var(--text-accent);
        }
        
        .card-icon {
            width: 32px;
            height: 32px;
            background: var(--primary-dark);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-glow);
            font-size: 16px;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: var(--bg-card);
            border-radius: 4px;
            overflow: hidden;
            margin: 12px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-glow) 0%, var(--accent-success) 100%);
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        
        .progress-text {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: var(--text-muted);
        }
        
        /* Right Panel */
        .cities-right-panel {
            grid-area: right-panel;
            background: var(--bg-panel);
            padding: 20px;
            overflow-y: auto;
        }
        
        .panel-section {
            margin-bottom: 24px;
        }
        
        .panel-title {
            font-family: 'Orbitron', monospace;
            font-size: 16px;
            font-weight: 600;
            color: var(--text-accent);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .construction-queue {
            max-height: 200px;
            overflow-y: auto;
        }
        
        .queue-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: 8px;
            margin-bottom: 8px;
        }
        
        .queue-icon {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            background: var(--accent-warning);
            color: var(--bg-primary);
        }
        
        .queue-info {
            flex: 1;
        }
        
        .queue-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 2px;
        }
        
        .queue-time {
            font-size: 12px;
            color: var(--text-muted);
        }
        
        .queue-progress {
            width: 40px;
            height: 40px;
            position: relative;
        }
        
        .circular-progress {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: conic-gradient(var(--primary-glow) 0deg, var(--primary-glow) 120deg, var(--bg-card) 120deg);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        /* Footer */
        .cities-footer {
            grid-area: footer;
            background: var(--bg-panel);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            border-top: 1px solid var(--border-subtle);
            font-size: 12px;
            color: var(--text-muted);
        }
        
        /* Responsive */
        @media (max-width: 1200px) {
            .cities-container {
                grid-template-columns: 250px 1fr 300px;
            }
        }
        
        @media (max-width: 768px) {
            .cities-container {
                grid-template-areas: 
                    "header"
                    "main-content"
                    "footer";
                grid-template-columns: 1fr;
                grid-template-rows: 80px 1fr 60px;
            }
            
            .cities-sidebar,
            .cities-right-panel {
                display: none;
            }
            
            .city-overview {
                grid-template-columns: 1fr;
            }
            
            .infrastructure-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="cities-container">
        <!-- Header -->
        <header class="cities-header">
            <div class="header-title">
                <div class="cities-icon">🏙️</div>
                <h1>Cities Management</h1>
            </div>
            <div class="header-controls">
                <button class="control-btn active" data-view="overview">Overview</button>
                <button class="control-btn" data-view="planning">Planning</button>
                <button class="control-btn" data-view="construction">Construction</button>
                <button class="control-btn" data-view="resources">Resources</button>
                <button class="control-btn" onclick="window.history.back()">← Back to HUD</button>
            </div>
        </header>
        
        <!-- Sidebar -->
        <aside class="cities-sidebar">
            <div class="sidebar-section">
                <h3 class="sidebar-title">
                    <span>🏙️</span>
                    Cities
                </h3>
                <div class="city-list">
                    <div class="city-item selected" data-city="new-terra">
                        <div class="city-avatar">🌍</div>
                        <div class="city-info">
                            <h4>New Terra</h4>
                            <p>Capital City - 12.4M pop</p>
                        </div>
                        <div class="city-status thriving">Thriving</div>
                    </div>
                    <div class="city-item" data-city="alpha-station">
                        <div class="city-avatar">🛰️</div>
                        <div class="city-info">
                            <h4>Alpha Station</h4>
                            <p>Space Hub - 3.2M pop</p>
                        </div>
                        <div class="city-status growing">Growing</div>
                    </div>
                    <div class="city-item" data-city="mining-colony-7">
                        <div class="city-avatar">⛏️</div>
                        <div class="city-info">
                            <h4>Mining Colony 7</h4>
                            <p>Industrial - 890K pop</p>
                        </div>
                        <div class="city-status stable">Stable</div>
                    </div>
                    <div class="city-item" data-city="research-outpost">
                        <div class="city-avatar">🔬</div>
                        <div class="city-info">
                            <h4>Research Outpost</h4>
                            <p>Science Hub - 234K pop</p>
                        </div>
                        <div class="city-status growing">Growing</div>
                    </div>
                </div>
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-title">
                    <span>⚡</span>
                    Quick Actions
                </h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button class="control-btn">New City</button>
                    <button class="control-btn">Expand City</button>
                    <button class="control-btn">Upgrade Infrastructure</button>
                    <button class="control-btn">Emergency Response</button>
                </div>
            </div>
        </aside>
        
        <!-- Main Content -->
        <main class="cities-main">
            <div class="content-header">
                <h2 class="content-title">New Terra Overview</h2>
                <div class="content-actions">
                    <button class="action-btn">Refresh Data</button>
                    <button class="action-btn primary">City Planning</button>
                </div>
            </div>
            
            <!-- City Overview -->
            <div class="city-overview">
                <div class="city-map">
                    <h3 class="map-title">
                        <span>🗺️</span>
                        City Layout
                    </h3>
                    <div class="city-visual">
                        <!-- Simulated city buildings -->
                        <div class="building residential" style="left: 10%; bottom: 0; width: 20px; height: 60px;"></div>
                        <div class="building residential" style="left: 15%; bottom: 0; width: 25px; height: 80px;"></div>
                        <div class="building commercial" style="left: 25%; bottom: 0; width: 30px; height: 120px;"></div>
                        <div class="building commercial" style="left: 35%; bottom: 0; width: 35px; height: 100px;"></div>
                        <div class="building industrial" style="left: 45%; bottom: 0; width: 40px; height: 90px;"></div>
                        <div class="building residential" style="left: 55%; bottom: 0; width: 22px; height: 70px;"></div>
                        <div class="building commercial" style="left: 65%; bottom: 0; width: 28px; height: 110px;"></div>
                        <div class="building residential" style="left: 75%; bottom: 0; width: 18px; height: 50px;"></div>
                        <div class="building industrial" style="left: 85%; bottom: 0; width: 32px; height: 85px;"></div>
                    </div>
                </div>
                
                <div class="city-stats">
                    <h3 class="stats-title">City Statistics</h3>
                    <div class="stat-row">
                        <span class="stat-label">Population</span>
                        <span class="stat-value">12.4M <span class="stat-change positive">+2.3%</span></span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Happiness</span>
                        <span class="stat-value">87% <span class="stat-change positive">+1.2%</span></span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Employment</span>
                        <span class="stat-value">94.7% <span class="stat-change positive">+0.8%</span></span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Housing</span>
                        <span class="stat-value">89% <span class="stat-change neutral">Stable</span></span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Infrastructure</span>
                        <span class="stat-value">92% <span class="stat-change positive">+3.1%</span></span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Crime Rate</span>
                        <span class="stat-value">2.1% <span class="stat-change negative">-0.4%</span></span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Energy Usage</span>
                        <span class="stat-value">78% <span class="stat-change neutral">Optimal</span></span>
                    </div>
                </div>
            </div>
            
            <!-- Infrastructure Grid -->
            <div class="infrastructure-grid">
                <div class="infrastructure-card">
                    <div class="card-header">
                        <h3 class="card-title">Housing</h3>
                        <div class="card-icon">🏠</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 89%;"></div>
                    </div>
                    <div class="progress-text">
                        <span>Capacity: 89%</span>
                        <span>11.1M / 12.5M</span>
                    </div>
                </div>
                
                <div class="infrastructure-card">
                    <div class="card-header">
                        <h3 class="card-title">Transportation</h3>
                        <div class="card-icon">🚇</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 76%;"></div>
                    </div>
                    <div class="progress-text">
                        <span>Efficiency: 76%</span>
                        <span>Good Coverage</span>
                    </div>
                </div>
                
                <div class="infrastructure-card">
                    <div class="card-header">
                        <h3 class="card-title">Energy Grid</h3>
                        <div class="card-icon">⚡</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 92%;"></div>
                    </div>
                    <div class="progress-text">
                        <span>Output: 92%</span>
                        <span>Fusion + Solar</span>
                    </div>
                </div>
                
                <div class="infrastructure-card">
                    <div class="card-header">
                        <h3 class="card-title">Water Systems</h3>
                        <div class="card-icon">💧</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 84%;"></div>
                    </div>
                    <div class="progress-text">
                        <span>Supply: 84%</span>
                        <span>Recycling Active</span>
                    </div>
                </div>
                
                <div class="infrastructure-card">
                    <div class="card-header">
                        <h3 class="card-title">Waste Management</h3>
                        <div class="card-icon">♻️</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 95%;"></div>
                    </div>
                    <div class="progress-text">
                        <span>Efficiency: 95%</span>
                        <span>Zero Waste Goal</span>
                    </div>
                </div>
                
                <div class="infrastructure-card">
                    <div class="card-header">
                        <h3 class="card-title">Communications</h3>
                        <div class="card-icon">📡</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 98%;"></div>
                    </div>
                    <div class="progress-text">
                        <span>Coverage: 98%</span>
                        <span>Quantum Network</span>
                    </div>
                </div>
            </div>
        </main>
        
        <!-- Right Panel -->
        <aside class="cities-right-panel">
            <div class="panel-section">
                <h3 class="panel-title">
                    <span>🚧</span>
                    Construction Queue
                </h3>
                <div class="construction-queue">
                    <div class="queue-item">
                        <div class="queue-icon">🏠</div>
                        <div class="queue-info">
                            <div class="queue-name">Residential Complex</div>
                            <div class="queue-time">2 days remaining</div>
                        </div>
                        <div class="queue-progress">
                            <div class="circular-progress">67%</div>
                        </div>
                    </div>
                    <div class="queue-item">
                        <div class="queue-icon">🏪</div>
                        <div class="queue-info">
                            <div class="queue-name">Shopping District</div>
                            <div class="queue-time">5 days remaining</div>
                        </div>
                        <div class="queue-progress">
                            <div class="circular-progress">23%</div>
                        </div>
                    </div>
                    <div class="queue-item">
                        <div class="queue-icon">🚇</div>
                        <div class="queue-info">
                            <div class="queue-name">Metro Extension</div>
                            <div class="queue-time">8 days remaining</div>
                        </div>
                        <div class="queue-progress">
                            <div class="circular-progress">12%</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="panel-section">
                <h3 class="panel-title">
                    <span>🚨</span>
                    City Alerts
                </h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="padding: 12px; background: var(--bg-card); border-radius: 8px; border-left: 4px solid var(--accent-warning);">
                        <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">Traffic Congestion</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">Downtown area experiencing 23% increase in traffic</div>
                    </div>
                    <div style="padding: 12px; background: var(--bg-card); border-radius: 8px; border-left: 4px solid var(--accent-info);">
                        <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">New Development</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">Tech district expansion approved by city council</div>
                    </div>
                    <div style="padding: 12px; background: var(--bg-card); border-radius: 8px; border-left: 4px solid var(--accent-success);">
                        <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">Milestone Reached</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">Zero carbon emissions achieved in residential sector</div>
                    </div>
                </div>
            </div>
            
            <div class="panel-section">
                <h3 class="panel-title">
                    <span>📊</span>
                    Live Metrics
                </h3>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-subtle);">
                        <span style="color: var(--text-secondary);">Power Consumption</span>
                        <span style="color: var(--accent-warning); font-weight: 600;">2.4 TW</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-subtle);">
                        <span style="color: var(--text-secondary);">Water Usage</span>
                        <span style="color: var(--accent-info); font-weight: 600;">847M L/day</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-subtle);">
                        <span style="color: var(--text-secondary);">Waste Generated</span>
                        <span style="color: var(--accent-success); font-weight: 600;">12.3K tons</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                        <span style="color: var(--text-secondary);">Air Quality Index</span>
                        <span style="color: var(--accent-success); font-weight: 600;">Excellent</span>
                    </div>
                </div>
            </div>
        </aside>
        
        <!-- Footer -->
        <footer class="cities-footer">
            <div>
                <span>Active Cities: 47</span>
                <span>|</span>
                <span>Total Population: 89.2M</span>
                <span>|</span>
                <span>Construction Projects: 23</span>
            </div>
            <div>
                <button class="control-btn" style="font-size: 11px;">Export City Data</button>
            </div>
        </footer>
    </div>
    
    <script>
        class CitiesManagementSystem {
            constructor() {
                this.currentCity = 'new-terra';
                this.currentView = 'overview';
                this.websocket = null;
                this.init();
            }
            
            init() {
                console.log('🏙️ Initializing Cities Management System...');
                this.setupEventListeners();
                this.connectWebSocket();
                this.loadCityData();
                this.startRealTimeUpdates();
                console.log('✅ Cities Management initialized successfully');
            }
            
            setupEventListeners() {
                // View controls
                document.querySelectorAll('[data-view]').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const view = e.target.dataset.view;
                        this.switchView(view);
                    });
                });
                
                // City selection
                document.querySelectorAll('.city-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        const cityId = item.dataset.city;
                        this.selectCity(cityId);
                    });
                });
                
                // Action buttons
                document.querySelectorAll('.action-btn, .control-btn').forEach(btn => {
                    if (!btn.onclick && !btn.dataset.view) {
                        btn.addEventListener('click', (e) => {
                            const action = e.target.textContent.toLowerCase().replace(/\\s+/g, '-');
                            this.handleAction(action);
                        });
                    }
                });
            }
            
            switchView(viewType) {
                console.log('🔄 Switching to ' + viewType + ' view');
                
                // Update active button
                document.querySelectorAll('[data-view]').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector('[data-view="' + viewType + '"]').classList.add('active');
                
                this.currentView = viewType;
                this.updateViewContent(viewType);
            }
            
            selectCity(cityId) {
                console.log('🎯 Selecting city: ' + cityId);
                
                // Update selected city
                document.querySelectorAll('.city-item').forEach(item => {
                    item.classList.remove('selected');
                });
                document.querySelector('[data-city="' + cityId + '"]').classList.add('selected');
                
                this.currentCity = cityId;
                this.loadCityData();
            }
            
            updateViewContent(viewType) {
                // Update content based on view
                switch(viewType) {
                    case 'overview':
                        this.showOverviewData();
                        break;
                    case 'planning':
                        this.showPlanningData();
                        break;
                    case 'construction':
                        this.showConstructionData();
                        break;
                    case 'resources':
                        this.showResourcesData();
                        break;
                }
            }
            
            loadCityData() {
                console.log('📡 Loading city data from /api/cities/*...');
                // In real implementation: fetch from /api/cities endpoints
                this.simulateDataLoading();
            }
            
            simulateDataLoading() {
                setTimeout(() => {
                    console.log('✅ City overview data loaded');
                    this.updateCityStats();
                }, 500);
                
                setTimeout(() => {
                    console.log('✅ Infrastructure data loaded');
                }, 1000);
                
                setTimeout(() => {
                    console.log('✅ Construction queue updated');
                }, 1500);
            }
            
            updateCityStats() {
                // Simulate live city statistics updates
                const stats = {
                    population: (12.4 + Math.random() * 0.1 - 0.05).toFixed(1) + 'M',
                    happiness: (87 + Math.random() * 2 - 1).toFixed(0) + '%',
                    employment: (94.7 + Math.random() * 1 - 0.5).toFixed(1) + '%',
                    housing: (89 + Math.random() * 2 - 1).toFixed(0) + '%',
                    infrastructure: (92 + Math.random() * 1 - 0.5).toFixed(0) + '%',
                    crime: (2.1 + Math.random() * 0.2 - 0.1).toFixed(1) + '%',
                    energy: (78 + Math.random() * 3 - 1.5).toFixed(0) + '%'
                };
                
                // Update UI (simplified for demo)
                console.log('📊 Updated city stats:', stats);
            }
            
            connectWebSocket() {
                try {
                    this.websocket = new WebSocket('ws://localhost:4000/ws/cities');
                    
                    this.websocket.onopen = () => {
                        console.log('🔗 Cities WebSocket connected');
                    };
                    
                    this.websocket.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        this.handleRealTimeUpdate(data);
                    };
                    
                    this.websocket.onclose = () => {
                        console.log('🔗 Cities WebSocket disconnected');
                        setTimeout(() => this.connectWebSocket(), 5000);
                    };
                } catch (error) {
                    console.log('⚠️ WebSocket connection failed, using polling fallback');
                }
            }
            
            handleRealTimeUpdate(data) {
                switch(data.type) {
                    case 'city_stats_update':
                        this.updateCityStats(data.stats);
                        break;
                    case 'construction_progress':
                        this.updateConstructionProgress(data.project);
                        break;
                    case 'city_alert':
                        this.showCityAlert(data.alert);
                        break;
                }
            }
            
            startRealTimeUpdates() {
                // Update city metrics every 30 seconds
                setInterval(() => {
                    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
                        this.updateCityStats();
                    }
                }, 30000);
            }
            
            handleAction(action) {
                console.log('🎯 Handling action: ' + action);
                
                switch(action) {
                    case 'refresh-data':
                        this.refreshData();
                        break;
                    case 'city-planning':
                        this.openCityPlanning();
                        break;
                    case 'new-city':
                        this.createNewCity();
                        break;
                    case 'expand-city':
                        this.expandCity();
                        break;
                    case 'upgrade-infrastructure':
                        this.upgradeInfrastructure();
                        break;
                    case 'emergency-response':
                        this.activateEmergencyResponse();
                        break;
                    default:
                        console.log('Unknown action:', action);
                }
            }
            
            refreshData() {
                console.log('🔄 Refreshing city data...');
                this.loadCityData();
                this.showNotification('City data refreshed', 'success');
            }
            
            openCityPlanning() {
                console.log('🏗️ Opening city planning interface...');
                this.showNotification('City planning mode activated', 'info');
            }
            
            createNewCity() {
                console.log('🌟 Creating new city...');
                this.showNotification('New city creation started', 'info');
            }
            
            showNotification(message, type = 'info') {
                const notification = document.createElement('div');
                notification.textContent = message;
                notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--bg-panel); color: var(--text-primary); padding: 12px 16px; border-radius: 8px; border-left: 4px solid var(--primary-glow); box-shadow: var(--shadow-panel); z-index: 10000; font-size: 14px; opacity: 0; transform: translateX(100%); transition: all 0.3s ease;';
                
                if (type === 'success') {
                    notification.style.borderLeftColor = 'var(--accent-success)';
                } else if (type === 'warning') {
                    notification.style.borderLeftColor = 'var(--accent-warning)';
                }
                
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.opacity = '1';
                    notification.style.transform = 'translateX(0)';
                }, 100);
                
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => notification.remove(), 300);
                }, 4000);
            }
            
            showOverviewData() {
                console.log('📊 Showing city overview data');
            }
            
            showPlanningData() {
                console.log('🏗️ Showing city planning data');
            }
            
            showConstructionData() {
                console.log('🚧 Showing construction data');
            }
            
            showResourcesData() {
                console.log('⚡ Showing resources data');
            }
        }
        
        // Initialize Cities Management when page loads
        document.addEventListener('DOMContentLoaded', () => {
            window.citiesManagement = new CitiesManagementSystem();
        });
    </script>
</body>
</html>
    `;
}

module.exports = { getCitiesManagementScreen };
