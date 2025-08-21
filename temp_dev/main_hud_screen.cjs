// Main HUD Screen - Central Command Interface
// This is the primary screen that integrates all systems

function getMainHUDScreen() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Witty Galaxy - Command Center</title>
    <style>
        /* Import Futuristic Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
        
        /* CSS Variables - Witty Galaxy Theme */
        :root {
            /* Primary Colors */
            --primary-glow: #00d9ff;
            --primary-bright: #0099cc;
            --primary-dark: #004d66;
            --primary-shadow: rgba(0, 217, 255, 0.3);
            
            /* Secondary Colors */
            --secondary-glow: #ff6b35;
            --secondary-bright: #cc5529;
            --secondary-dark: #66291a;
            
            /* Accent Colors */
            --accent-success: #00ff88;
            --accent-warning: #ffaa00;
            --accent-danger: #ff3366;
            --accent-info: #3366ff;
            
            /* Background Colors */
            --bg-primary: #0a0a0f;
            --bg-secondary: #1a1a2e;
            --bg-panel: #16213e;
            --bg-card: #1e2749;
            --bg-hover: #2a3f5f;
            
            /* Text Colors */
            --text-primary: #e0e6ed;
            --text-secondary: #b8c5d1;
            --text-muted: #8a9ba8;
            --text-accent: var(--primary-glow);
            
            /* Border Colors */
            --border-primary: #2d4a6b;
            --border-accent: var(--primary-glow);
            --border-subtle: #1a2332;
            
            /* Shadow Effects */
            --shadow-glow: 0 0 20px var(--primary-shadow);
            --shadow-panel: 0 4px 20px rgba(0, 0, 0, 0.3);
            --shadow-card: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        
        /* Global Styles */
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
        
        /* Main Layout Grid */
        .hud-container {
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
        .hud-header {
            grid-area: header;
            background: var(--bg-panel);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            border-bottom: 2px solid var(--border-accent);
            box-shadow: var(--shadow-panel);
        }
        
        .hud-logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .hud-logo h1 {
            font-family: 'Orbitron', monospace;
            font-size: 24px;
            font-weight: 900;
            color: var(--primary-glow);
            text-shadow: 0 0 10px var(--primary-shadow);
        }
        
        .hud-logo .galaxy-icon {
            width: 40px;
            height: 40px;
            background: radial-gradient(circle, var(--primary-glow) 0%, var(--primary-dark) 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            animation: rotate 20s linear infinite;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .hud-status {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .status-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: var(--bg-card);
            border-radius: 20px;
            border: 1px solid var(--border-primary);
            font-size: 14px;
            font-weight: 500;
        }
        
        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        .status-online { background: var(--accent-success); }
        .status-warning { background: var(--accent-warning); }
        .status-danger { background: var(--accent-danger); }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        /* Sidebar Navigation */
        .hud-sidebar {
            grid-area: sidebar;
            background: var(--bg-panel);
            padding: 20px;
            overflow-y: auto;
        }
        
        .nav-section {
            margin-bottom: 24px;
        }
        
        .nav-section h3 {
            font-family: 'Orbitron', monospace;
            font-size: 14px;
            font-weight: 700;
            color: var(--text-accent);
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            margin-bottom: 4px;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 8px;
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .nav-item:hover {
            background: var(--bg-hover);
            border-color: var(--border-accent);
            color: var(--text-primary);
            transform: translateX(4px);
        }
        
        .nav-item.active {
            background: var(--bg-card);
            border-color: var(--border-accent);
            color: var(--text-accent);
            box-shadow: var(--shadow-glow);
        }
        
        .nav-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        
        /* Main Content Area */
        .hud-main {
            grid-area: main-content;
            background: var(--bg-secondary);
            padding: 24px;
            overflow-y: auto;
            position: relative;
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
            box-shadow: var(--shadow-card);
        }
        
        .action-btn.primary {
            background: var(--primary-dark);
            border-color: var(--primary-bright);
            color: var(--primary-glow);
        }
        
        .action-btn.primary:hover {
            background: var(--primary-bright);
            color: white;
            box-shadow: var(--shadow-glow);
        }
        
        /* Dashboard Grid */
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 24px;
        }
        
        .dashboard-card {
            background: var(--bg-panel);
            border: 1px solid var(--border-primary);
            border-radius: 12px;
            padding: 20px;
            box-shadow: var(--shadow-card);
            transition: all 0.3s ease;
        }
        
        .dashboard-card:hover {
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
        
        .card-content {
            color: var(--text-secondary);
            line-height: 1.6;
        }
        
        .metric-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 4px;
        }
        
        .metric-label {
            font-size: 12px;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .metric-change {
            font-size: 14px;
            font-weight: 500;
            margin-top: 8px;
        }
        
        .metric-change.positive { color: var(--accent-success); }
        .metric-change.negative { color: var(--accent-danger); }
        .metric-change.neutral { color: var(--accent-warning); }
        
        /* Right Panel */
        .hud-right-panel {
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
        
        .witter-feed {
            max-height: 400px;
            overflow-y: auto;
        }
        
        .witter-post {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 12px;
            transition: all 0.3s ease;
        }
        
        .witter-post:hover {
            border-color: var(--border-primary);
            box-shadow: var(--shadow-card);
        }
        
        .witter-author {
            font-weight: 600;
            color: var(--text-accent);
            margin-bottom: 4px;
            font-size: 14px;
        }
        
        .witter-content {
            color: var(--text-secondary);
            font-size: 13px;
            line-height: 1.4;
            margin-bottom: 8px;
        }
        
        .witter-meta {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: var(--text-muted);
        }
        
        .alerts-list {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .alert-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 12px;
            background: var(--bg-card);
            border-radius: 8px;
            margin-bottom: 8px;
            border-left: 4px solid var(--accent-info);
        }
        
        .alert-item.warning { border-left-color: var(--accent-warning); }
        .alert-item.danger { border-left-color: var(--accent-danger); }
        .alert-item.success { border-left-color: var(--accent-success); }
        
        .alert-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            background: var(--accent-info);
            color: white;
            flex-shrink: 0;
        }
        
        .alert-content {
            flex: 1;
        }
        
        .alert-title {
            font-weight: 600;
            color: var(--text-primary);
            font-size: 13px;
            margin-bottom: 2px;
        }
        
        .alert-message {
            color: var(--text-secondary);
            font-size: 12px;
            line-height: 1.3;
        }
        
        .alert-time {
            color: var(--text-muted);
            font-size: 11px;
            margin-top: 4px;
        }
        
        /* Footer */
        .hud-footer {
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
        
        .footer-info {
            display: flex;
            gap: 20px;
        }
        
        .footer-actions {
            display: flex;
            gap: 12px;
        }
        
        .footer-btn {
            padding: 6px 12px;
            background: transparent;
            border: 1px solid var(--border-primary);
            border-radius: 4px;
            color: var(--text-secondary);
            font-size: 11px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .footer-btn:hover {
            background: var(--bg-hover);
            border-color: var(--border-accent);
            color: var(--text-primary);
        }
        
        /* Responsive Design */
        @media (max-width: 1200px) {
            .hud-container {
                grid-template-columns: 240px 1fr 280px;
            }
        }
        
        @media (max-width: 768px) {
            .hud-container {
                grid-template-areas: 
                    "header"
                    "main-content"
                    "footer";
                grid-template-columns: 1fr;
                grid-template-rows: 80px 1fr 60px;
            }
            
            .hud-sidebar,
            .hud-right-panel {
                display: none;
            }
            
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }
        
        /* Loading States */
        .loading {
            opacity: 0.6;
            pointer-events: none;
        }
        
        .loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin: -10px 0 0 -10px;
            border: 2px solid var(--border-primary);
            border-top-color: var(--primary-glow);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        /* Animations */
        .slide-in {
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="hud-container">
        <!-- Header -->
        <header class="hud-header">
            <div class="hud-logo">
                <div class="galaxy-icon">🌌</div>
                <h1>WITTY GALAXY</h1>
            </div>
            <div class="hud-status">
                <div class="status-indicator">
                    <div class="status-dot status-online"></div>
                    <span>Systems Online</span>
                </div>
                <div class="status-indicator">
                    <div class="status-dot status-warning"></div>
                    <span>3 Alerts</span>
                </div>
                <div class="status-indicator">
                    <span id="current-time">--:--:--</span>
                </div>
            </div>
        </header>
        
        <!-- Sidebar Navigation -->
        <nav class="hud-sidebar">
            <div class="nav-section">
                <h3>Command</h3>
                <a href="#" class="nav-item active" data-screen="dashboard">
                    <div class="nav-icon">🏠</div>
                    <span>Dashboard</span>
                </a>
                <a href="#" class="nav-item" data-screen="galaxy-map">
                    <div class="nav-icon">🗺️</div>
                    <span>Galaxy Map</span>
                </a>
                <a href="#" class="nav-item" data-screen="witter">
                    <div class="nav-icon">💬</div>
                    <span>Witter Network</span>
                </a>
            </div>
            
            <div class="nav-section">
                <h3>Civilization</h3>
                <a href="#" class="nav-item" data-screen="demographics">
                    <div class="nav-icon">👥</div>
                    <span>Demographics</span>
                </a>
                <a href="#" class="nav-item" data-screen="cities">
                    <div class="nav-icon">🏙️</div>
                    <span>Cities</span>
                </a>
                <a href="#" class="nav-item" data-screen="trade">
                    <div class="nav-icon">💰</div>
                    <span>Trade & Economy</span>
                </a>
            </div>
            
            <div class="nav-section">
                <h3>Government</h3>
                <a href="#" class="nav-item" data-screen="cabinet">
                    <div class="nav-icon">🏛️</div>
                    <span>Cabinet</span>
                </a>
                <a href="#" class="nav-item" data-screen="military">
                    <div class="nav-icon">⚔️</div>
                    <span>Military</span>
                </a>
                <a href="#" class="nav-item" data-screen="intelligence">
                    <div class="nav-icon">🕵️</div>
                    <span>Intelligence</span>
                </a>
            </div>
            
            <div class="nav-section">
                <h3>Systems</h3>
                <a href="#" class="nav-item" data-screen="technology">
                    <div class="nav-icon">🔬</div>
                    <span>Technology</span>
                </a>
                <a href="#" class="nav-item" data-screen="news">
                    <div class="nav-icon">📰</div>
                    <span>News & Media</span>
                </a>
                <a href="#" class="nav-item" data-screen="characters">
                    <div class="nav-icon">👤</div>
                    <span>Characters</span>
                </a>
                <a href="#" class="nav-item" data-screen="settings">
                    <div class="nav-icon">⚙️</div>
                    <span>Settings</span>
                </a>
            </div>
        </nav>
        
        <!-- Main Content Area -->
        <main class="hud-main" id="main-content">
            <div class="content-header">
                <h2 class="content-title">Command Dashboard</h2>
                <div class="content-actions">
                    <button class="action-btn">Refresh Data</button>
                    <button class="action-btn primary">Emergency Powers</button>
                </div>
            </div>
            
            <!-- Dashboard Overview -->
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3 class="card-title">Population</h3>
                        <div class="card-icon">👥</div>
                    </div>
                    <div class="card-content">
                        <div class="metric-value" id="population-count">2.4B</div>
                        <div class="metric-label">Total Citizens</div>
                        <div class="metric-change positive">+2.1% this cycle</div>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3 class="card-title">Economy</h3>
                        <div class="card-icon">💰</div>
                    </div>
                    <div class="card-content">
                        <div class="metric-value" id="gdp-value">847T</div>
                        <div class="metric-label">Galactic GDP</div>
                        <div class="metric-change positive">+5.7% growth</div>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3 class="card-title">Military</h3>
                        <div class="card-icon">⚔️</div>
                    </div>
                    <div class="card-content">
                        <div class="metric-value" id="fleet-strength">92%</div>
                        <div class="metric-label">Fleet Readiness</div>
                        <div class="metric-change neutral">Stable</div>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3 class="card-title">Technology</h3>
                        <div class="card-icon">🔬</div>
                    </div>
                    <div class="card-content">
                        <div class="metric-value" id="tech-progress">Level 47</div>
                        <div class="metric-label">Tech Level</div>
                        <div class="metric-change positive">3 breakthroughs</div>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3 class="card-title">Approval</h3>
                        <div class="card-icon">📊</div>
                    </div>
                    <div class="card-content">
                        <div class="metric-value" id="approval-rating">78%</div>
                        <div class="metric-label">Public Approval</div>
                        <div class="metric-change positive">+4% this week</div>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3 class="card-title">Security</h3>
                        <div class="card-icon">🛡️</div>
                    </div>
                    <div class="card-content">
                        <div class="metric-value" id="threat-level">LOW</div>
                        <div class="metric-label">Threat Level</div>
                        <div class="metric-change neutral">No active threats</div>
                    </div>
                </div>
            </div>
        </main>
        
        <!-- Right Panel -->
        <aside class="hud-right-panel">
            <div class="panel-section">
                <h3 class="panel-title">
                    <span>💬</span>
                    Witter Feed
                </h3>
                <div class="witter-feed" id="witter-feed">
                    <div class="witter-post slide-in">
                        <div class="witter-author">Admiral Chen</div>
                        <div class="witter-content">Fleet exercises completed successfully. All systems nominal. 🚀</div>
                        <div class="witter-meta">
                            <span>2 min ago</span>
                            <span>❤️ 23 | 🔄 5</span>
                        </div>
                    </div>
                    <div class="witter-post slide-in">
                        <div class="witter-author">Dr. Vorthak</div>
                        <div class="witter-content">Breakthrough in quantum computing! Efficiency increased by 340%. The future is bright! ⚡</div>
                        <div class="witter-meta">
                            <span>5 min ago</span>
                            <span>❤️ 156 | 🔄 42</span>
                        </div>
                    </div>
                    <div class="witter-post slide-in">
                        <div class="witter-author">Minister Rodriguez</div>
                        <div class="witter-content">New trade agreements with the Centauri Alliance finalized. Economic prosperity ahead! 💰</div>
                        <div class="witter-meta">
                            <span>12 min ago</span>
                            <span>❤️ 89 | 🔄 18</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="panel-section">
                <h3 class="panel-title">
                    <span>🚨</span>
                    Active Alerts
                </h3>
                <div class="alerts-list" id="alerts-list">
                    <div class="alert-item warning">
                        <div class="alert-icon">⚠️</div>
                        <div class="alert-content">
                            <div class="alert-title">Resource Shortage</div>
                            <div class="alert-message">Dilithium reserves at 23% capacity</div>
                            <div class="alert-time">15 minutes ago</div>
                        </div>
                    </div>
                    <div class="alert-item success">
                        <div class="alert-icon">✅</div>
                        <div class="alert-content">
                            <div class="alert-title">Mission Complete</div>
                            <div class="alert-message">Diplomatic mission to Kepler-442b successful</div>
                            <div class="alert-time">1 hour ago</div>
                        </div>
                    </div>
                    <div class="alert-item danger">
                        <div class="alert-icon">🔴</div>
                        <div class="alert-content">
                            <div class="alert-title">Security Breach</div>
                            <div class="alert-message">Unauthorized access detected in Sector 7</div>
                            <div class="alert-time">3 hours ago</div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
        
        <!-- Footer -->
        <footer class="hud-footer">
            <div class="footer-info">
                <span>Stardate: 2387.156</span>
                <span>|</span>
                <span>Sector: Alpha Quadrant</span>
                <span>|</span>
                <span>Version: 2.4.7</span>
            </div>
            <div class="footer-actions">
                <button class="footer-btn">Help</button>
                <button class="footer-btn">Logout</button>
            </div>
        </footer>
    </div>
    
    <script>
        class WittyGalaxyHUD {
            constructor() {
                this.currentScreen = 'dashboard';
                this.websocket = null;
                this.init();
            }
            
            init() {
                console.log('🚀 Initializing Witty Galaxy HUD...');
                this.setupEventListeners();
                this.startClock();
                this.connectWebSocket();
                this.loadInitialData();
                console.log('✅ HUD initialized successfully');
            }
            
            setupEventListeners() {
                // Navigation
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        const screen = item.dataset.screen;
                        this.switchScreen(screen);
                    });
                });
                
                // Action buttons
                document.querySelectorAll('.action-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const action = e.target.textContent.toLowerCase().replace(/\\s+/g, '-');
                        this.handleAction(action);
                    });
                });
            }
            
            switchScreen(screenName) {
                console.log(\`🔄 Switching to \${screenName} screen\`);
                
                // Update navigation
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                document.querySelector(\`[data-screen="\${screenName}"]\`).classList.add('active');
                
                // Update content
                this.currentScreen = screenName;
                this.loadScreenContent(screenName);
            }
            
            loadScreenContent(screenName) {
                const mainContent = document.getElementById('main-content');
                mainContent.classList.add('loading');
                
                // Simulate loading delay
                setTimeout(() => {
                    mainContent.innerHTML = this.getScreenHTML(screenName);
                    mainContent.classList.remove('loading');
                    mainContent.classList.add('fade-in');
                }, 300);
            }
            
            getScreenHTML(screenName) {
                switch(screenName) {
                    case 'dashboard':
                        return this.getDashboardHTML();
                    case 'galaxy-map':
                        return '<div class="content-header"><h2 class="content-title">Galaxy Map</h2></div><div style="text-align: center; padding: 100px; color: var(--text-muted);">🗺️ Galaxy Map will be loaded here</div>';
                    case 'witter':
                        return '<div class="content-header"><h2 class="content-title">Witter Network</h2></div><div style="text-align: center; padding: 100px; color: var(--text-muted);">💬 Witter Network will be loaded here</div>';
                    default:
                        return \`<div class="content-header"><h2 class="content-title">\${screenName.charAt(0).toUpperCase() + screenName.slice(1)}</h2></div><div style="text-align: center; padding: 100px; color: var(--text-muted);">Screen content will be loaded here</div>\`;
                }
            }
            
            getDashboardHTML() {
                return \`
                    <div class="content-header">
                        <h2 class="content-title">Command Dashboard</h2>
                        <div class="content-actions">
                            <button class="action-btn">Refresh Data</button>
                            <button class="action-btn primary">Emergency Powers</button>
                        </div>
                    </div>
                    
                    <div class="dashboard-grid">
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Population</h3>
                                <div class="card-icon">👥</div>
                            </div>
                            <div class="card-content">
                                <div class="metric-value">2.4B</div>
                                <div class="metric-label">Total Citizens</div>
                                <div class="metric-change positive">+2.1% this cycle</div>
                            </div>
                        </div>
                        
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Economy</h3>
                                <div class="card-icon">💰</div>
                            </div>
                            <div class="card-content">
                                <div class="metric-value">847T</div>
                                <div class="metric-label">Galactic GDP</div>
                                <div class="metric-change positive">+5.7% growth</div>
                            </div>
                        </div>
                        
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Military</h3>
                                <div class="card-icon">⚔️</div>
                            </div>
                            <div class="card-content">
                                <div class="metric-value">92%</div>
                                <div class="metric-label">Fleet Readiness</div>
                                <div class="metric-change neutral">Stable</div>
                            </div>
                        </div>
                        
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Technology</h3>
                                <div class="card-icon">🔬</div>
                            </div>
                            <div class="card-content">
                                <div class="metric-value">Level 47</div>
                                <div class="metric-label">Tech Level</div>
                                <div class="metric-change positive">3 breakthroughs</div>
                            </div>
                        </div>
                        
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Approval</h3>
                                <div class="card-icon">📊</div>
                            </div>
                            <div class="card-content">
                                <div class="metric-value">78%</div>
                                <div class="metric-label">Public Approval</div>
                                <div class="metric-change positive">+4% this week</div>
                            </div>
                        </div>
                        
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Security</h3>
                                <div class="card-icon">🛡️</div>
                            </div>
                            <div class="card-content">
                                <div class="metric-value">LOW</div>
                                <div class="metric-label">Threat Level</div>
                                <div class="metric-change neutral">No active threats</div>
                            </div>
                        </div>
                    </div>
                \`;
            }
            
            handleAction(action) {
                console.log(\`🎯 Handling action: \${action}\`);
                
                switch(action) {
                    case 'refresh-data':
                        this.refreshData();
                        break;
                    case 'emergency-powers':
                        this.activateEmergencyPowers();
                        break;
                    default:
                        console.log('Unknown action:', action);
                }
            }
            
            refreshData() {
                console.log('🔄 Refreshing data...');
                // Simulate data refresh
                this.showNotification('Data refreshed successfully', 'success');
            }
            
            activateEmergencyPowers() {
                console.log('🚨 Activating emergency powers...');
                this.showNotification('Emergency powers activated', 'warning');
            }
            
            showNotification(message, type = 'info') {
                const notification = document.createElement('div');
                notification.className = \`notification \${type}\`;
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
                    max-width: 300px;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                \`;
                
                if (type === 'warning') {
                    notification.style.borderLeftColor = 'var(--accent-warning)';
                } else if (type === 'success') {
                    notification.style.borderLeftColor = 'var(--accent-success)';
                } else if (type === 'danger') {
                    notification.style.borderLeftColor = 'var(--accent-danger)';
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
                }, 5000);
            }
            
            startClock() {
                const updateClock = () => {
                    const now = new Date();
                    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
                    const clockElement = document.getElementById('current-time');
                    if (clockElement) {
                        clockElement.textContent = timeString;
                    }
                };
                
                updateClock();
                setInterval(updateClock, 1000);
            }
            
            connectWebSocket() {
                // Placeholder for WebSocket connection
                console.log('🔗 WebSocket connection placeholder');
            }
            
            loadInitialData() {
                // Placeholder for initial data loading
                console.log('📊 Loading initial data...');
            }
        }
        
        // Initialize HUD when page loads
        document.addEventListener('DOMContentLoaded', () => {
            window.hud = new WittyGalaxyHUD();
        });
    </script>
</body>
</html>
    `;
}

module.exports = { getMainHUDScreen };
