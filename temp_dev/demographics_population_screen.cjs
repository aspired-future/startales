// Demographics & Population Screen - Population Analytics and Citizen Management
// Integrates with /api/demographics/* and /api/population/* endpoints

function getDemographicsPopulationScreen() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Witty Galaxy - Demographics & Population</title>
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
            --shadow-card: 0 2px 10px rgba(0, 0, 0, 0.2);
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
        
        .demographics-container {
            display: grid;
            grid-template-areas: 
                "header header header"
                "sidebar main-content right-panel"
                "footer footer footer";
            grid-template-columns: 280px 1fr 320px;
            grid-template-rows: 80px 1fr 60px;
            height: 100vh;
            gap: 1px;
            background: var(--border-subtle);
        }
        
        /* Header */
        .demographics-header {
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
        
        .demo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--accent-success) 0%, var(--primary-glow) 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: white;
            animation: pulse 3s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
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
        .demographics-sidebar {
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
        
        .filter-group {
            margin-bottom: 16px;
        }
        
        .filter-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: var(--text-secondary);
            margin-bottom: 6px;
        }
        
        .filter-select {
            width: 100%;
            padding: 8px 12px;
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: 6px;
            color: var(--text-primary);
            font-size: 14px;
        }
        
        .filter-range {
            width: 100%;
            margin: 8px 0;
            accent-color: var(--primary-glow);
        }
        
        .range-values {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: var(--text-muted);
        }
        
        /* Main Content */
        .demographics-main {
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
        
        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }
        
        .stat-card {
            background: var(--bg-panel);
            border: 1px solid var(--border-primary);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .stat-card:hover {
            border-color: var(--border-accent);
            box-shadow: var(--shadow-glow);
            transform: translateY(-2px);
        }
        
        .stat-icon {
            width: 48px;
            height: 48px;
            background: var(--primary-dark);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: var(--primary-glow);
            margin: 0 auto 12px;
        }
        
        .stat-value {
            font-size: 32px;
            font-weight: 900;
            color: var(--text-primary);
            margin-bottom: 4px;
            font-family: 'Orbitron', monospace;
        }
        
        .stat-label {
            font-size: 14px;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        
        .stat-change {
            font-size: 14px;
            font-weight: 500;
        }
        
        .stat-change.positive { color: var(--accent-success); }
        .stat-change.negative { color: var(--accent-danger); }
        .stat-change.neutral { color: var(--accent-warning); }
        
        /* Charts Section */
        .charts-section {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 24px;
            margin-bottom: 32px;
        }
        
        .chart-container {
            background: var(--bg-panel);
            border: 1px solid var(--border-primary);
            border-radius: 12px;
            padding: 24px;
        }
        
        .chart-title {
            font-family: 'Orbitron', monospace;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .chart-canvas {
            width: 100%;
            height: 300px;
        }
        
        /* Population Table */
        .population-table {
            background: var(--bg-panel);
            border: 1px solid var(--border-primary);
            border-radius: 12px;
            overflow: hidden;
        }
        
        .table-header {
            background: var(--bg-card);
            padding: 16px 24px;
            border-bottom: 1px solid var(--border-subtle);
        }
        
        .table-title {
            font-family: 'Orbitron', monospace;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .table-content {
            max-height: 400px;
            overflow-y: auto;
        }
        
        .table-row {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
            padding: 12px 24px;
            border-bottom: 1px solid var(--border-subtle);
            align-items: center;
            transition: background 0.3s ease;
        }
        
        .table-row:hover {
            background: var(--bg-hover);
        }
        
        .table-row.header {
            background: var(--bg-card);
            font-weight: 600;
            color: var(--text-accent);
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .species-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .species-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            background: var(--primary-dark);
            color: var(--primary-glow);
        }
        
        .species-details h4 {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 2px;
        }
        
        .species-details p {
            font-size: 12px;
            color: var(--text-muted);
        }
        
        .population-number {
            font-family: 'Share Tech Mono', monospace;
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .growth-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .growth-indicator.positive { color: var(--accent-success); }
        .growth-indicator.negative { color: var(--accent-danger); }
        .growth-indicator.stable { color: var(--accent-warning); }
        
        /* Right Panel */
        .demographics-right-panel {
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
        
        .insight-item {
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            transition: all 0.3s ease;
        }
        
        .insight-item:hover {
            border-color: var(--border-accent);
            box-shadow: var(--shadow-card);
        }
        
        .insight-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 8px;
        }
        
        .insight-content {
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.4;
        }
        
        .insight-impact {
            font-size: 12px;
            color: var(--text-accent);
            margin-top: 8px;
            font-weight: 500;
        }
        
        /* Footer */
        .demographics-footer {
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
            .demographics-container {
                grid-template-columns: 240px 1fr 280px;
            }
        }
        
        @media (max-width: 768px) {
            .demographics-container {
                grid-template-areas: 
                    "header"
                    "main-content"
                    "footer";
                grid-template-columns: 1fr;
                grid-template-rows: 80px 1fr 60px;
            }
            
            .demographics-sidebar,
            .demographics-right-panel {
                display: none;
            }
            
            .charts-section {
                grid-template-columns: 1fr;
            }
            
            .stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            }
        }
    </style>
</head>
<body>
    <div class="demographics-container">
        <!-- Header -->
        <header class="demographics-header">
            <div class="header-title">
                <div class="demo-icon">👥</div>
                <h1>Demographics & Population</h1>
            </div>
            <div class="header-controls">
                <button class="control-btn active" data-view="overview">Overview</button>
                <button class="control-btn" data-view="species">Species</button>
                <button class="control-btn" data-view="migration">Migration</button>
                <button class="control-btn" data-view="projections">Projections</button>
                <button class="control-btn" onclick="window.history.back()">← Back to HUD</button>
            </div>
        </header>
        
        <!-- Sidebar -->
        <aside class="demographics-sidebar">
            <div class="sidebar-section">
                <h3 class="sidebar-title">
                    <span>🔍</span>
                    Filters
                </h3>
                
                <div class="filter-group">
                    <label class="filter-label">Time Period</label>
                    <select class="filter-select" id="time-filter">
                        <option value="current">Current Cycle</option>
                        <option value="last-cycle">Last Cycle</option>
                        <option value="last-year">Last Year</option>
                        <option value="last-decade">Last Decade</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label class="filter-label">Region</label>
                    <select class="filter-select" id="region-filter">
                        <option value="all">All Regions</option>
                        <option value="core-worlds">Core Worlds</option>
                        <option value="outer-rim">Outer Rim</option>
                        <option value="frontier">Frontier</option>
                        <option value="colonies">Colonies</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label class="filter-label">Age Range</label>
                    <input type="range" class="filter-range" id="age-range" min="0" max="200" value="100">
                    <div class="range-values">
                        <span>0</span>
                        <span id="age-value">100</span>
                        <span>200+</span>
                    </div>
                </div>
                
                <div class="filter-group">
                    <label class="filter-label">Population Size</label>
                    <input type="range" class="filter-range" id="pop-range" min="1000" max="1000000000" value="50000000">
                    <div class="range-values">
                        <span>1K</span>
                        <span id="pop-value">50M</span>
                        <span>1B+</span>
                    </div>
                </div>
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-title">
                    <span>⚡</span>
                    Quick Actions
                </h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button class="control-btn">Run Simulation</button>
                    <button class="control-btn">Export Data</button>
                    <button class="control-btn">Generate Report</button>
                    <button class="control-btn">Policy Impact</button>
                </div>
            </div>
        </aside>
        
        <!-- Main Content -->
        <main class="demographics-main">
            <div class="content-header">
                <h2 class="content-title">Population Overview</h2>
                <div class="content-actions">
                    <button class="action-btn">Refresh Data</button>
                    <button class="action-btn primary">Run Analysis</button>
                </div>
            </div>
            
            <!-- Key Statistics -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">🌍</div>
                    <div class="stat-value" id="total-population">2.47B</div>
                    <div class="stat-label">Total Population</div>
                    <div class="stat-change positive">+2.1% growth</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">👶</div>
                    <div class="stat-value" id="birth-rate">14.2</div>
                    <div class="stat-label">Birth Rate (per 1K)</div>
                    <div class="stat-change positive">+0.3 this cycle</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">⚰️</div>
                    <div class="stat-value" id="death-rate">8.7</div>
                    <div class="stat-label">Death Rate (per 1K)</div>
                    <div class="stat-change negative">-0.1 this cycle</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">🏠</div>
                    <div class="stat-value" id="migration-rate">3.4%</div>
                    <div class="stat-label">Migration Rate</div>
                    <div class="stat-change positive">+0.8% increase</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">🎓</div>
                    <div class="stat-value" id="education-level">87%</div>
                    <div class="stat-label">Education Level</div>
                    <div class="stat-change positive">+1.2% improvement</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">💼</div>
                    <div class="stat-value" id="employment-rate">94.3%</div>
                    <div class="stat-label">Employment Rate</div>
                    <div class="stat-change positive">+0.7% this cycle</div>
                </div>
            </div>
            
            <!-- Charts -->
            <div class="charts-section">
                <div class="chart-container">
                    <h3 class="chart-title">
                        <span>📈</span>
                        Population Growth Trends
                    </h3>
                    <canvas id="population-chart" class="chart-canvas"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3 class="chart-title">
                        <span>🥧</span>
                        Species Distribution
                    </h3>
                    <canvas id="species-chart" class="chart-canvas"></canvas>
                </div>
            </div>
            
            <!-- Population Table -->
            <div class="population-table">
                <div class="table-header">
                    <h3 class="table-title">Species Demographics</h3>
                </div>
                <div class="table-content">
                    <div class="table-row header">
                        <div>Species</div>
                        <div>Population</div>
                        <div>Growth Rate</div>
                        <div>Avg Age</div>
                        <div>Status</div>
                    </div>
                    <div class="table-row">
                        <div class="species-info">
                            <div class="species-avatar">👨</div>
                            <div class="species-details">
                                <h4>Humans</h4>
                                <p>Homo sapiens</p>
                            </div>
                        </div>
                        <div class="population-number">1.89B</div>
                        <div class="growth-indicator positive">
                            <span>↗️</span>
                            <span>+2.3%</span>
                        </div>
                        <div>67.4 years</div>
                        <div style="color: var(--accent-success);">Thriving</div>
                    </div>
                    <div class="table-row">
                        <div class="species-info">
                            <div class="species-avatar">👽</div>
                            <div class="species-details">
                                <h4>Centaurians</h4>
                                <p>Alpha Centauri natives</p>
                            </div>
                        </div>
                        <div class="population-number">342M</div>
                        <div class="growth-indicator positive">
                            <span>↗️</span>
                            <span>+1.8%</span>
                        </div>
                        <div>124.7 years</div>
                        <div style="color: var(--accent-success);">Stable</div>
                    </div>
                    <div class="table-row">
                        <div class="species-info">
                            <div class="species-avatar">🤖</div>
                            <div class="species-details">
                                <h4>Synthetics</h4>
                                <p>Artificial beings</p>
                            </div>
                        </div>
                        <div class="population-number">156M</div>
                        <div class="growth-indicator positive">
                            <span>↗️</span>
                            <span>+4.2%</span>
                        </div>
                        <div>∞</div>
                        <div style="color: var(--accent-info);">Expanding</div>
                    </div>
                    <div class="table-row">
                        <div class="species-info">
                            <div class="species-avatar">🐙</div>
                            <div class="species-details">
                                <h4>Aquarians</h4>
                                <p>Ocean world dwellers</p>
                            </div>
                        </div>
                        <div class="population-number">89M</div>
                        <div class="growth-indicator stable">
                            <span>→</span>
                            <span>+0.1%</span>
                        </div>
                        <div>156.3 years</div>
                        <div style="color: var(--accent-warning);">Stable</div>
                    </div>
                </div>
            </div>
        </main>
        
        <!-- Right Panel -->
        <aside class="demographics-right-panel">
            <div class="panel-section">
                <h3 class="panel-title">
                    <span>🧠</span>
                    AI Insights
                </h3>
                <div class="insight-item">
                    <div class="insight-title">Population Boom Predicted</div>
                    <div class="insight-content">
                        Current birth rates and improved healthcare suggest a 15% population increase over the next decade.
                    </div>
                    <div class="insight-impact">Impact: High Economic Growth</div>
                </div>
                <div class="insight-item">
                    <div class="insight-title">Migration Patterns</div>
                    <div class="insight-content">
                        Increased migration to Core Worlds driven by economic opportunities and technological advancement.
                    </div>
                    <div class="insight-impact">Impact: Urban Development Needed</div>
                </div>
                <div class="insight-item">
                    <div class="insight-title">Species Integration</div>
                    <div class="insight-content">
                        Synthetic population growth creating new social dynamics and policy considerations.
                    </div>
                    <div class="insight-impact">Impact: Legal Framework Updates</div>
                </div>
            </div>
            
            <div class="panel-section">
                <h3 class="panel-title">
                    <span>📊</span>
                    Live Metrics
                </h3>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-subtle);">
                        <span style="color: var(--text-secondary);">Births Today</span>
                        <span style="color: var(--accent-success); font-weight: 600;">+2,847</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-subtle);">
                        <span style="color: var(--text-secondary);">New Citizens</span>
                        <span style="color: var(--accent-info); font-weight: 600;">+1,234</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-subtle);">
                        <span style="color: var(--text-secondary);">Migrations</span>
                        <span style="color: var(--accent-warning); font-weight: 600;">+567</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                        <span style="color: var(--text-secondary);">Happiness Index</span>
                        <span style="color: var(--accent-success); font-weight: 600;">8.7/10</span>
                    </div>
                </div>
            </div>
        </aside>
        
        <!-- Footer -->
        <footer class="demographics-footer">
            <div>
                <span>Last Updated: <span id="last-updated">Just now</span></span>
                <span>|</span>
                <span>Data Sources: 47 systems</span>
            </div>
            <div>
                <button class="control-btn" style="font-size: 11px;">Export Report</button>
            </div>
        </footer>
    </div>
    
    <script>
        class DemographicsSystem {
            constructor() {
                this.currentView = 'overview';
                this.charts = {};
                this.websocket = null;
                this.init();
            }
            
            init() {
                console.log('👥 Initializing Demographics System...');
                this.setupEventListeners();
                this.initializeCharts();
                this.connectWebSocket();
                this.loadDemographicsData();
                this.startRealTimeUpdates();
                console.log('✅ Demographics system initialized successfully');
            }
            
            setupEventListeners() {
                // View controls
                document.querySelectorAll('[data-view]').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const view = e.target.dataset.view;
                        this.switchView(view);
                    });
                });
                
                // Filters
                document.getElementById('time-filter').addEventListener('change', () => this.updateData());
                document.getElementById('region-filter').addEventListener('change', () => this.updateData());
                document.getElementById('age-range').addEventListener('input', (e) => {
                    document.getElementById('age-value').textContent = e.target.value;
                    this.updateData();
                });
                document.getElementById('pop-range').addEventListener('input', (e) => {
                    const value = parseInt(e.target.value);
                    const formatted = value >= 1000000 ? (value / 1000000).toFixed(0) + 'M' : 
                                     value >= 1000 ? (value / 1000).toFixed(0) + 'K' : value;
                    document.getElementById('pop-value').textContent = formatted;
                    this.updateData();
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
                console.log(\`🔄 Switching to \${viewType} view\`);
                
                // Update active button
                document.querySelectorAll('[data-view]').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(\`[data-view="\${viewType}"]\`).classList.add('active');
                
                this.currentView = viewType;
                this.updateViewContent(viewType);
            }
            
            updateViewContent(viewType) {
                // Update charts and data based on view
                switch(viewType) {
                    case 'overview':
                        this.showOverviewData();
                        break;
                    case 'species':
                        this.showSpeciesData();
                        break;
                    case 'migration':
                        this.showMigrationData();
                        break;
                    case 'projections':
                        this.showProjectionsData();
                        break;
                }
            }
            
            initializeCharts() {
                // Population Growth Chart
                const popCtx = document.getElementById('population-chart').getContext('2d');
                this.charts.population = new Chart(popCtx, {
                    type: 'line',
                    data: {
                        labels: ['2380', '2381', '2382', '2383', '2384', '2385', '2386', '2387'],
                        datasets: [{
                            label: 'Total Population (Billions)',
                            data: [2.1, 2.15, 2.22, 2.28, 2.35, 2.41, 2.44, 2.47],
                            borderColor: '#00d9ff',
                            backgroundColor: 'rgba(0, 217, 255, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: { color: '#e0e6ed' }
                            }
                        },
                        scales: {
                            x: {
                                ticks: { color: '#8a9ba8' },
                                grid: { color: '#2d4a6b' }
                            },
                            y: {
                                ticks: { color: '#8a9ba8' },
                                grid: { color: '#2d4a6b' }
                            }
                        }
                    }
                });
                
                // Species Distribution Chart
                const speciesCtx = document.getElementById('species-chart').getContext('2d');
                this.charts.species = new Chart(speciesCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Humans', 'Centaurians', 'Synthetics', 'Aquarians', 'Others'],
                        datasets: [{
                            data: [76.5, 13.8, 6.3, 3.6, 2.8],
                            backgroundColor: [
                                '#00d9ff',
                                '#ff6b35',
                                '#00ff88',
                                '#ffaa00',
                                '#ff3366'
                            ],
                            borderWidth: 2,
                            borderColor: '#1a1a2e'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: { 
                                    color: '#e0e6ed',
                                    padding: 15,
                                    usePointStyle: true
                                }
                            }
                        }
                    }
                });
            }
            
            loadDemographicsData() {
                console.log('📡 Loading demographics data from APIs...');
                // In real implementation: fetch from /api/demographics/* and /api/population/*
                this.simulateDataLoading();
            }
            
            simulateDataLoading() {
                setTimeout(() => {
                    console.log('✅ Population data loaded');
                    this.updateLiveMetrics();
                }, 500);
                
                setTimeout(() => {
                    console.log('✅ Demographics trends loaded');
                }, 1000);
                
                setTimeout(() => {
                    console.log('✅ Migration data loaded');
                }, 1500);
            }
            
            updateLiveMetrics() {
                // Simulate live metric updates
                const metrics = {
                    'total-population': (2.47 + Math.random() * 0.01).toFixed(2) + 'B',
                    'birth-rate': (14.2 + Math.random() * 0.5 - 0.25).toFixed(1),
                    'death-rate': (8.7 + Math.random() * 0.3 - 0.15).toFixed(1),
                    'migration-rate': (3.4 + Math.random() * 0.2 - 0.1).toFixed(1) + '%',
                    'education-level': (87 + Math.random() * 2 - 1).toFixed(0) + '%',
                    'employment-rate': (94.3 + Math.random() * 1 - 0.5).toFixed(1) + '%'
                };
                
                Object.entries(metrics).forEach(([id, value]) => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.textContent = value;
                    }
                });
                
                // Update timestamp
                document.getElementById('last-updated').textContent = new Date().toLocaleTimeString();
            }
            
            connectWebSocket() {
                try {
                    this.websocket = new WebSocket('ws://localhost:4000/ws/demographics');
                    
                    this.websocket.onopen = () => {
                        console.log('🔗 Demographics WebSocket connected');
                    };
                    
                    this.websocket.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        this.handleRealTimeUpdate(data);
                    };
                    
                    this.websocket.onclose = () => {
                        console.log('🔗 Demographics WebSocket disconnected');
                        setTimeout(() => this.connectWebSocket(), 5000);
                    };
                } catch (error) {
                    console.log('⚠️ WebSocket connection failed, using polling fallback');
                }
            }
            
            handleRealTimeUpdate(data) {
                switch(data.type) {
                    case 'population_change':
                        this.updatePopulationMetrics(data.metrics);
                        break;
                    case 'migration_event':
                        this.handleMigrationEvent(data.event);
                        break;
                    case 'demographic_shift':
                        this.updateDemographicCharts(data.demographics);
                        break;
                }
            }
            
            updatePopulationMetrics(metrics) {
                Object.entries(metrics).forEach(([key, value]) => {
                    const element = document.getElementById(key);
                    if (element) {
                        element.textContent = value;
                        element.parentElement.classList.add('slide-in');
                    }
                });
            }
            
            startRealTimeUpdates() {
                // Update live metrics every 30 seconds
                setInterval(() => {
                    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
                        this.updateLiveMetrics();
                    }
                }, 30000);
            }
            
            handleAction(action) {
                console.log(\`🎯 Handling action: \${action}\`);
                
                switch(action) {
                    case 'refresh-data':
                        this.refreshData();
                        break;
                    case 'run-analysis':
                        this.runAnalysis();
                        break;
                    case 'run-simulation':
                        this.runSimulation();
                        break;
                    case 'export-data':
                        this.exportData();
                        break;
                    case 'generate-report':
                        this.generateReport();
                        break;
                    case 'policy-impact':
                        this.analyzePolicyImpact();
                        break;
                    default:
                        console.log('Unknown action:', action);
                }
            }
            
            refreshData() {
                console.log('🔄 Refreshing demographics data...');
                this.loadDemographicsData();
                this.showNotification('Demographics data refreshed', 'success');
            }
            
            runAnalysis() {
                console.log('🧠 Running AI analysis...');
                this.showNotification('AI analysis started', 'info');
                // Simulate analysis
                setTimeout(() => {
                    this.showNotification('Analysis complete - 3 new insights generated', 'success');
                }, 3000);
            }
            
            runSimulation() {
                console.log('🎮 Running population simulation...');
                this.showNotification('Population simulation started', 'info');
                // In real implementation: POST to /api/demographics/simulate
            }
            
            showNotification(message, type = 'info') {
                const notification = document.createElement('div');
                notification.textContent = message;
                notification.style.cssText = \`
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--bg-panel);
                    color: var(--text-primary);
                    padding: 12px 16px;
                    border-radius: 8px;
                    border-left: 4px solid var(--primary-glow);
                    box-shadow: var(--shadow-panel);
                    z-index: 10000;
                    font-size: 14px;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                \`;
                
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
                console.log('📊 Showing overview data');
            }
            
            showSpeciesData() {
                console.log('👽 Showing species data');
            }
            
            showMigrationData() {
                console.log('🏠 Showing migration data');
            }
            
            showProjectionsData() {
                console.log('🔮 Showing projections data');
            }
            
            updateData() {
                console.log('🔄 Updating data based on filters');
                this.loadDemographicsData();
            }
        }
        
        // Initialize Demographics System when page loads
        document.addEventListener('DOMContentLoaded', () => {
            window.demographics = new DemographicsSystem();
        });
    </script>
</body>
</html>
    `;
}

module.exports = { getDemographicsPopulationScreen };
