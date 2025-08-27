const { getGameStateAPIs } = require('../apis/game-state-apis.cjs');

function getMainHUD() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Startales Command Center - Main HUD</title>
    <style>
        /* Import Futuristic Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
        
        /* CSS Variables - Futuristic Color Palette */
        :root {
            /* Primary - Cyan/Blue Tech */
            --primary-glow: #00d9ff;
            --primary-bright: #0099cc;
            --primary-dark: #004d66;
            --primary-shadow: rgba(0, 217, 255, 0.3);
            
            /* Secondary - Orange/Amber Energy */
            --secondary-glow: #ff9500;
            --secondary-bright: #cc7700;
            --secondary-dark: #663c00;
            --secondary-shadow: rgba(255, 149, 0, 0.3);
            
            /* Success - Green Matrix */
            --success-glow: #00ff88;
            --success-bright: #00cc66;
            --success-dark: #004d26;
            
            /* Warning - Yellow Alert */
            --warning-glow: #ffdd00;
            --warning-bright: #ccaa00;
            --warning-dark: #665500;
            
            /* Danger - Red Alert */
            --danger-glow: #ff3366;
            --danger-bright: #cc1144;
            --danger-dark: #660822;
            
            /* Interface - Dark Sci-Fi */
            --bg-space: #0a0a0f;
            --bg-panel: #1a1a2e;
            --bg-surface: #16213e;
            --border-glow: #2a4a6b;
            --text-primary: #e0e6ed;
            --text-secondary: #a0b3c8;
            --text-accent: #00d9ff;
            
            /* Typography */
            --font-display: 'Orbitron', sans-serif;
            --font-ui: 'Rajdhani', sans-serif;
            --font-mono: 'Share Tech Mono', monospace;
        }
        
        /* Global Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: var(--font-ui);
            background: var(--bg-space);
            color: var(--text-primary);
            overflow: hidden;
            height: 100vh;
        }
        
        /* Particle Background */
        .particle-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: 
                radial-gradient(circle at 20% 80%, rgba(0, 217, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 149, 0, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(0, 255, 136, 0.05) 0%, transparent 50%);
            z-index: -1;
        }
        
        /* Main Layout */
        .command-center {
            display: flex;
            flex-direction: column;
            height: 100vh;
            width: 100vw;
        }
        
        /* Command Header */
        .command-header {
            height: 140px;
            background: linear-gradient(135deg, var(--bg-panel) 0%, var(--bg-surface) 100%);
            border-bottom: 2px solid var(--border-glow);
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }
        
        .header-left {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .header-title {
            font-family: var(--font-display);
            font-size: 24px;
            font-weight: 700;
            color: var(--primary-glow);
            text-shadow: 0 0 10px var(--primary-shadow);
        }
        
        .header-campaign {
            font-size: 18px;
            color: var(--text-secondary);
        }
        
        .header-center {
            display: flex;
            gap: 30px;
            align-items: center;
        }
        
        .header-stat {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }
        
        .stat-label {
            font-size: 12px;
            color: var(--text-secondary);
            text-transform: uppercase;
        }
        
        .stat-value {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .stat-trend {
            font-size: 14px;
            color: var(--success-glow);
        }
        
        .header-right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
        }
        
        .header-time {
            font-family: var(--font-mono);
            font-size: 16px;
            color: var(--text-accent);
        }
        
        .header-alerts {
            background: var(--danger-glow);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
        }
        
        /* Main Content Area */
        .main-content {
            flex: 1;
            display: flex;
            height: calc(100vh - 240px);
        }
        
        /* Left Panel - System Navigation */
        .left-panel {
            width: 320px;
            background: var(--bg-panel);
            border-right: 1px solid var(--border-glow);
            overflow-y: auto;
            padding: 20px;
        }
        
        .system-category {
            margin-bottom: 24px;
        }
        
        .category-header {
            font-family: var(--font-display);
            font-size: 14px;
            font-weight: 600;
            color: var(--primary-glow);
            text-transform: uppercase;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border-glow);
        }
        
        .system-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            margin-bottom: 4px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .system-item:hover {
            background: var(--bg-surface);
            color: var(--text-primary);
            box-shadow: 0 2px 10px rgba(0, 217, 255, 0.1);
        }
        
        .system-item.active {
            background: var(--bg-surface);
            color: var(--primary-glow);
            border-left: 3px solid var(--primary-glow);
        }
        
        .system-icon {
            font-size: 16px;
            width: 20px;
            text-align: center;
        }
        
        /* Central Display */
        .central-display {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: var(--bg-space);
            position: relative;
        }
        
        .primary-view {
            height: 400px;
            background: linear-gradient(135deg, var(--bg-panel) 0%, var(--bg-surface) 100%);
            border: 1px solid var(--border-glow);
            margin: 20px;
            border-radius: 12px;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .planet-display {
            text-align: center;
        }
        
        .planet-name {
            font-family: var(--font-display);
            font-size: 32px;
            color: var(--primary-glow);
            margin-bottom: 20px;
            text-shadow: 0 0 20px var(--primary-shadow);
        }
        
        .planet-stats {
            display: flex;
            gap: 40px;
            justify-content: center;
            margin-top: 20px;
        }
        
        .planet-stat {
            text-align: center;
        }
        
        .planet-stat-value {
            font-size: 24px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .planet-stat-label {
            font-size: 14px;
            color: var(--text-secondary);
            margin-top: 4px;
        }
        
        /* System Tabs */
        .system-tabs {
            display: flex;
            background: var(--bg-panel);
            border-top: 1px solid var(--border-glow);
            border-bottom: 1px solid var(--border-glow);
            margin: 0 20px;
        }
        
        .system-tab {
            flex: 1;
            padding: 12px 16px;
            text-align: center;
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: var(--font-ui);
            font-size: 14px;
            font-weight: 500;
            border-bottom: 2px solid transparent;
        }
        
        .system-tab:hover {
            color: var(--text-primary);
            background: rgba(0, 217, 255, 0.1);
        }
        
        .system-tab.active {
            color: var(--primary-glow);
            border-bottom-color: var(--primary-glow);
            background: rgba(0, 217, 255, 0.1);
        }
        
        /* Active System Display */
        .active-system-display {
            flex: 1;
            margin: 20px;
            background: var(--bg-panel);
            border: 1px solid var(--border-glow);
            border-radius: 12px;
            padding: 24px;
            overflow-y: auto;
        }
        
        .system-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }
        
        .overview-card {
            background: var(--bg-surface);
            border: 1px solid var(--border-glow);
            border-radius: 8px;
            padding: 20px;
            transition: all 0.3s ease;
        }
        
        .overview-card:hover {
            box-shadow: 0 4px 20px rgba(0, 217, 255, 0.1);
            border-color: var(--primary-glow);
        }
        
        .card-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }
        
        .card-icon {
            font-size: 20px;
            color: var(--primary-glow);
        }
        
        .card-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .card-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .card-stat {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .card-stat-label {
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .card-stat-value {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        /* Right Panel - Live Metrics */
        .right-panel {
            width: 320px;
            background: var(--bg-panel);
            border-left: 1px solid var(--border-glow);
            padding: 20px;
            overflow-y: auto;
        }
        
        .metrics-section {
            margin-bottom: 32px;
        }
        
        .metrics-header {
            font-family: var(--font-display);
            font-size: 14px;
            font-weight: 600;
            color: var(--primary-glow);
            text-transform: uppercase;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border-glow);
        }
        
        .metric-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .metric-item:last-child {
            border-bottom: none;
        }
        
        .metric-label {
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .metric-value {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .metric-trend {
            font-size: 12px;
            margin-left: 8px;
        }
        
        .trend-up {
            color: var(--success-glow);
        }
        
        .trend-down {
            color: var(--danger-glow);
        }
        
        .progress-bar {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            margin-top: 4px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-glow), var(--success-glow));
            transition: width 0.3s ease;
        }
        
        /* Action Bar */
        .action-bar {
            height: 100px;
            background: var(--bg-panel);
            border-top: 2px solid var(--border-glow);
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .action-buttons {
            display: flex;
            gap: 16px;
        }
        
        .action-btn {
            background: linear-gradient(135deg, var(--primary-bright), var(--primary-dark));
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-family: var(--font-ui);
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .action-btn:hover {
            background: linear-gradient(135deg, var(--primary-glow), var(--primary-bright));
            transform: translateY(-2px);
            box-shadow: 0 4px 15px var(--primary-shadow);
        }
        
        .status-info {
            display: flex;
            gap: 24px;
            align-items: center;
            font-family: var(--font-mono);
            font-size: 12px;
            color: var(--text-secondary);
        }
        
        .status-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .status-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--success-glow);
        }
        
        /* Glow Effects */
        .glow-primary {
            box-shadow: 0 0 20px var(--primary-shadow);
            border: 1px solid var(--primary-glow);
        }
        
        .glow-text {
            text-shadow: 0 0 10px currentColor;
        }
        
        /* Animations */
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes borderScan {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .animated-border {
            position: relative;
            overflow: hidden;
        }
        
        .animated-border::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--primary-glow), transparent);
            animation: borderScan 3s infinite;
        }
        
        /* Responsive Design */
        @media (max-width: 1366px) {
            .left-panel, .right-panel {
                width: 280px;
            }
            
            .command-header {
                height: 120px;
                padding: 16px;
            }
            
            .header-title {
                font-size: 20px;
            }
        }
        
        @media (max-width: 1024px) {
            .left-panel {
                position: fixed;
                left: -320px;
                top: 0;
                height: 100vh;
                z-index: 1000;
                transition: left 0.3s ease;
            }
            
            .left-panel.open {
                left: 0;
            }
            
            .right-panel {
                width: 250px;
            }
            
            .main-content {
                margin-left: 0;
            }
        }
        
        /* Loading States */
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
            font-style: italic;
        }
        
        .loading::after {
            content: '...';
            animation: pulse 1.5s infinite;
        }
        
        /* Crisis Mode Styles */
        .crisis-mode {
            border: 2px solid var(--danger-glow);
            background: linear-gradient(135deg, var(--danger-dark), var(--bg-panel));
        }
        
        .crisis-alert {
            background: var(--danger-glow);
            color: white;
            padding: 12px;
            text-align: center;
            font-weight: 600;
            animation: pulse 1s infinite;
        }
    </style>
</head>
<body data-testid="command-center-main">
    <div class="particle-bg"></div>
    
    <div class="command-center">
        <!-- Command Header -->
        <header class="command-header animated-border">
            <div class="header-left">
                <div class="header-title glow-text">🌌 STARTALES COMMAND CENTER</div>
                <div class="header-campaign">🎯 <span id="campaignName">Terra Nova Federation</span></div>
            </div>
            
            <div class="header-center">
                <div class="header-stat">
                    <div class="stat-label">Leader</div>
                    <div class="stat-value" id="leaderName">President Sarah Chen</div>
                </div>
                <div class="header-stat">
                    <div class="stat-label">Approval</div>
                    <div class="stat-value" id="approvalRating">67%</div>
                    <div class="stat-trend" id="approvalTrend">↗️</div>
                </div>
                <div class="header-stat">
                    <div class="stat-label">Treasury</div>
                    <div class="stat-value" id="treasuryBalance">2.4T ₵</div>
                </div>
                <div class="header-stat">
                    <div class="stat-label">GDP Growth</div>
                    <div class="stat-value" id="gdpGrowth">+2.1%</div>
                    <div class="stat-trend trend-up">↗️</div>
                </div>
            </div>
            
            <div class="header-right">
                <div class="header-time" id="gameTime">⏰ Stardate 2387.156.14:23</div>
                <div class="header-alerts" id="alertCount">🔔 12 Alerts</div>
            </div>
        </header>
        
        <!-- Main Content -->
        <main class="main-content">
            <!-- Left Panel - System Navigation -->
            <nav class="left-panel" data-testid="system-navigation">
                <!-- Quick Commands -->
                <div class="system-category">
                    <div class="category-header">🎮 Quick Commands</div>
                    <div class="system-item" data-system="crisis">
                        <span class="system-icon">🚨</span>
                        <span>Crisis Center</span>
                    </div>
                    <div class="system-item" data-system="briefing">
                        <span class="system-icon">📋</span>
                        <span>Daily Briefing</span>
                    </div>
                    <div class="system-item" data-system="address">
                        <span class="system-icon">🎤</span>
                        <span>Address Nation</span>
                    </div>
                    <div class="system-item" data-system="emergency">
                        <span class="system-icon">⚖️</span>
                        <span>Emergency Powers</span>
                    </div>
                    <div class="system-item" data-system="status">
                        <span class="system-icon">🔄</span>
                        <span>System Status</span>
                    </div>
                </div>
                
                <!-- Government Systems -->
                <div class="system-category">
                    <div class="category-header">🏛️ Government</div>
                    <div class="system-item active" data-system="cabinet">
                        <span class="system-icon">🏛️</span>
                        <span>Cabinet</span>
                    </div>
                    <div class="system-item" data-system="policies">
                        <span class="system-icon">⚖️</span>
                        <span>Policies</span>
                    </div>
                    <div class="system-item" data-system="legislature">
                        <span class="system-icon">🏛️</span>
                        <span>Legislature</span>
                    </div>
                    <div class="system-item" data-system="supreme-court">
                        <span class="system-icon">⚖️</span>
                        <span>Supreme Court</span>
                    </div>
                    <div class="system-item" data-system="political-parties">
                        <span class="system-icon">🎭</span>
                        <span>Political Parties</span>
                    </div>
                    <div class="system-item" data-system="delegation">
                        <span class="system-icon">🤝</span>
                        <span>Delegation</span>
                    </div>
                </div>
                
                <!-- Economy Systems -->
                <div class="system-category">
                    <div class="category-header">💰 Economy</div>
                    <div class="system-item" data-system="treasury">
                        <span class="system-icon">💰</span>
                        <span>Treasury</span>
                    </div>
                    <div class="system-item" data-system="trade">
                        <span class="system-icon">📈</span>
                        <span>Trade</span>
                    </div>
                    <div class="system-item" data-system="business">
                        <span class="system-icon">🏢</span>
                        <span>Business</span>
                    </div>
                    <div class="system-item" data-system="central-bank">
                        <span class="system-icon">🏦</span>
                        <span>Central Bank</span>
                    </div>
                    <div class="system-item" data-system="markets">
                        <span class="system-icon">📊</span>
                        <span>Markets</span>
                    </div>
                    <div class="system-item" data-system="inflation">
                        <span class="system-icon">💸</span>
                        <span>Inflation</span>
                    </div>
                </div>
                
                <!-- Population Systems -->
                <div class="system-category">
                    <div class="category-header">👥 Population</div>
                    <div class="system-item" data-system="demographics">
                        <span class="system-icon">👥</span>
                        <span>Demographics</span>
                    </div>
                    <div class="system-item" data-system="planets-cities">
                        <span class="system-icon">🌍</span>
                        <span>Planets & Cities</span>
                    </div>
                    <div class="system-item" data-system="migration">
                        <span class="system-icon">🚶</span>
                        <span>Migration</span>
                    </div>
                    <div class="system-item" data-system="professions">
                        <span class="system-icon">💼</span>
                        <span>Professions</span>
                    </div>
                </div>
                
                <!-- Security Systems -->
                <div class="system-category">
                    <div class="category-header">🛡️ Security</div>
                    <div class="system-item" data-system="military">
                        <span class="system-icon">🛡️</span>
                        <span>Military</span>
                    </div>
                    <div class="system-item" data-system="defense">
                        <span class="system-icon">🏰</span>
                        <span>Defense</span>
                    </div>
                    <div class="system-item" data-system="security">
                        <span class="system-icon">🔒</span>
                        <span>Security</span>
                    </div>
                    <div class="system-item" data-system="joint-chiefs">
                        <span class="system-icon">⭐</span>
                        <span>Joint Chiefs</span>
                    </div>
                    <div class="system-item" data-system="intelligence">
                        <span class="system-icon">🕵️</span>
                        <span>Intelligence</span>
                    </div>
                </div>
                
                <!-- Science & Tech Systems -->
                <div class="system-category">
                    <div class="category-header">🔬 Science & Tech</div>
                    <div class="system-item" data-system="technology">
                        <span class="system-icon">🔬</span>
                        <span>Technology</span>
                    </div>
                    <div class="system-item" data-system="research">
                        <span class="system-icon">🧪</span>
                        <span>Research</span>
                    </div>
                    <div class="system-item" data-system="simulation">
                        <span class="system-icon">🎮</span>
                        <span>Simulation</span>
                    </div>

                </div>
                
                <!-- Galaxy Systems -->
                <div class="system-category">
                    <div class="category-header">🌌 Galaxy</div>
                    <div class="system-item" data-system="galaxy-stats">
                        <span class="system-icon">📊</span>
                        <span>Statistics</span>
                    </div>
                    <div class="system-item" data-system="galaxy-map">
                        <span class="system-icon">🌌</span>
                        <span>Galaxy Map</span>
                    </div>
                    <div class="system-item" data-system="visuals">
                        <span class="system-icon">🎨</span>
                        <span>Visuals</span>
                    </div>
                    <div class="system-item" data-system="conquest">
                        <span class="system-icon">🚀</span>
                        <span>Conquest</span>
                    </div>
                </div>
                
                <!-- Communications Systems -->
                <div class="system-category">
                    <div class="category-header">📡 Communications</div>
                    <div class="system-item" data-system="whoseapp">
                        <span class="system-icon">💬</span>
                        <span>WhoseApp</span>
                    </div>
                    <div class="system-item" data-system="comm-hub">
                        <span class="system-icon">📡</span>
                        <span>Comm Hub</span>
                    </div>
                    <div class="system-item" data-system="news">
                        <span class="system-icon">📰</span>
                        <span>News</span>
                    </div>
                    <div class="system-item" data-system="speeches">
                        <span class="system-icon">🎤</span>
                        <span>Speeches</span>
                    </div>
                    <div class="system-item" data-system="approval">
                        <span class="system-icon">📊</span>
                        <span>Approval</span>
                    </div>
                    <div class="system-item" data-system="policy-advisor">
                        <span class="system-icon">🎯</span>
                        <span>Policy Advisor</span>
                    </div>
                </div>
                
                <!-- Administration Systems -->
                <div class="system-category">
                    <div class="category-header">⚙️ Administration</div>
                    <div class="system-item" data-system="campaign">
                        <span class="system-icon">🎮</span>
                        <span>Campaign</span>
                    </div>
                    <div class="system-item" data-system="legal">
                        <span class="system-icon">📋</span>
                        <span>Legal</span>
                    </div>
                    <div class="system-item" data-system="interior">
                        <span class="system-icon">🏠</span>
                        <span>Interior</span>
                    </div>
                    <div class="system-item" data-system="commerce">
                        <span class="system-icon">💼</span>
                        <span>Commerce</span>
                    </div>
                    <div class="system-item" data-system="state">
                        <span class="system-icon">🏛️</span>
                        <span>State</span>
                    </div>
                </div>
            </nav>
            
            <!-- Central Display -->
            <section class="central-display" data-testid="central-display">
                <!-- Primary View -->
                <div class="primary-view glow-primary">
                    <div class="planet-display">
                        <div class="planet-name">🌍 TERRA NOVA</div>
                        <div style="font-size: 18px; color: var(--text-secondary); margin-bottom: 20px;">
                            [AI-Generated Planet Visualization]
                        </div>
                        <div class="planet-stats">
                            <div class="planet-stat">
                                <div class="planet-stat-value" id="planetCities">47</div>
                                <div class="planet-stat-label">Cities</div>
                            </div>
                            <div class="planet-stat">
                                <div class="planet-stat-value" id="planetPopulation">340M</div>
                                <div class="planet-stat-label">Population</div>
                            </div>
                            <div class="planet-stat">
                                <div class="planet-stat-value" id="planetHappiness">72%</div>
                                <div class="planet-stat-label">Happiness</div>
                            </div>
                            <div class="planet-stat">
                                <div class="planet-stat-value" id="planetSecurity">87%</div>
                                <div class="planet-stat-label">Security</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- System Tabs -->
                <div class="system-tabs">
                    <button class="system-tab active" data-tab="gov">Gov</button>
                    <button class="system-tab" data-tab="econ">Econ</button>
                    <button class="system-tab" data-tab="pop">Pop</button>
                    <button class="system-tab" data-tab="mil">Mil</button>
                    <button class="system-tab" data-tab="sci">Sci</button>
                    <button class="system-tab" data-tab="comm">Comm</button>
                    <button class="system-tab" data-tab="intel">Intel</button>
                </div>
                
                <!-- Active System Display -->
                <div class="active-system-display" id="systemDisplay">
                    <div class="system-overview" id="governmentOverview">
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🏛️</span>
                                <span class="card-title">Cabinet Status</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Members Active</span>
                                    <span class="card-stat-value">9/9</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Meetings Today</span>
                                    <span class="card-stat-value">2</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Efficiency</span>
                                    <span class="card-stat-value">94%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">⚖️</span>
                                <span class="card-title">Active Policies</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Active Policies</span>
                                    <span class="card-stat-value">23</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Pending Approval</span>
                                    <span class="card-stat-value">5</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Implementation Rate</span>
                                    <span class="card-stat-value">87%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🏛️</span>
                                <span class="card-title">Legislature</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Session Status</span>
                                    <span class="card-stat-value">Active</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Bills Pending</span>
                                    <span class="card-stat-value">12</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Approval Rating</span>
                                    <span class="card-stat-value">67%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">⚖️</span>
                                <span class="card-title">Supreme Court</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Cases Pending</span>
                                    <span class="card-stat-value">3</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Constitutional Review</span>
                                    <span class="card-stat-value">Active</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Justices Present</span>
                                    <span class="card-stat-value">8/9</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Right Panel - Live Metrics -->
            <aside class="right-panel" data-testid="live-metrics">
                <div class="metrics-section">
                    <div class="metrics-header">📊 Live Metrics</div>
                    <div class="metric-item">
                        <span class="metric-label">Population</span>
                        <span class="metric-value">340M<span class="metric-trend trend-up">+0.8%</span></span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 78%"></div>
                    </div>
                    
                    <div class="metric-item">
                        <span class="metric-label">GDP Growth</span>
                        <span class="metric-value">+2.1%<span class="metric-trend trend-up">↗️</span></span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 85%"></div>
                    </div>
                    
                    <div class="metric-item">
                        <span class="metric-label">Security</span>
                        <span class="metric-value">87%<span class="metric-trend trend-up">↗️</span></span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 87%"></div>
                    </div>
                </div>
                
                <div class="metrics-section">
                    <div class="metrics-header">🎯 Objectives</div>
                    <div class="metric-item">
                        <span class="metric-label">Reduce Unemployment</span>
                        <span class="metric-value">67%</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Improve Relations</span>
                        <span class="metric-value">45%</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Complete Fusion</span>
                        <span class="metric-value">23%</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Address Climate</span>
                        <span class="metric-value">89%</span>
                    </div>
                </div>
                
                <div class="metrics-section">
                    <div class="metrics-header">📈 Quick Stats</div>
                    <div class="metric-item">
                        <span class="metric-label">Military</span>
                        <span class="metric-value">890K</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Scientists</span>
                        <span class="metric-value">2.1M</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Unemployed</span>
                        <span class="metric-value">14M</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Cities</span>
                        <span class="metric-value">47</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Trade Routes</span>
                        <span class="metric-value">23</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Research Projects</span>
                        <span class="metric-value">8</span>
                    </div>
                </div>
                
                <div class="metrics-section">
                    <div class="metrics-header">🔔 Alerts</div>
                    <div class="metric-item">
                        <span class="metric-label">🚨 Urgent</span>
                        <span class="metric-value">3</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">⚠️ Important</span>
                        <span class="metric-value">7</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">ℹ️ Info</span>
                        <span class="metric-value">2</span>
                    </div>
                    <div style="text-align: center; margin-top: 12px;">
                        <button class="action-btn" style="font-size: 12px; padding: 6px 12px;">
                            View All Alerts
                        </button>
                    </div>
                </div>
            </aside>
        </main>
        
        <!-- Action Bar -->
        <footer class="action-bar">
            <div class="action-buttons">
                <button class="action-btn" data-action="address">
                    <span>🎤</span>
                    <span>Address Nation</span>
                </button>
                <button class="action-btn" data-action="briefing">
                    <span>📋</span>
                    <span>Daily Brief</span>
                </button>
                <button class="action-btn" data-action="military">
                    <span>⚔️</span>
                    <span>Military</span>
                </button>
                <button class="action-btn" data-action="research">
                    <span>🔬</span>
                    <span>Research</span>
                </button>
                <button class="action-btn" data-action="budget">
                    <span>💰</span>
                    <span>Budget</span>
                </button>
            </div>
            
            <div class="status-info">
                <div class="status-item">
                    <span class="status-indicator"></span>
                    <span>Simulation: RUNNING</span>
                </div>
                <div class="status-item">
                    <span>Tick: 1,247</span>
                </div>
                <div class="status-item">
                    <span>Tick Rate: 2min</span>
                </div>
                <div class="status-item">
                    <span>Next: 00:47</span>
                </div>
                <div class="status-item">
                    <span class="status-indicator"></span>
                    <span>Network: ONLINE</span>
                </div>
                <div class="status-item">
                    <span>Performance: 98%</span>
                </div>
            </div>
        </footer>
    </div>
    
    <script>
        // HUD JavaScript functionality
        class StarTalesHUD {
            constructor() {
                this.currentSystem = 'cabinet';
                this.currentTab = 'gov';
                this.isLoading = false;
                this.init();
            }
            
            init() {
                this.setupEventListeners();
                this.startRealTimeUpdates();
                this.loadSystemData();
            }
            
            setupEventListeners() {
                // System navigation
                document.querySelectorAll('.system-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        const system = e.currentTarget.dataset.system;
                        this.switchSystem(system);
                    });
                });
                
                // System tabs
                document.querySelectorAll('.system-tab').forEach(tab => {
                    tab.addEventListener('click', (e) => {
                        const tabName = e.currentTarget.dataset.tab;
                        this.switchTab(tabName);
                    });
                });
                
                // Action buttons
                document.querySelectorAll('.action-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const action = e.currentTarget.dataset.action;
                        this.executeAction(action);
                    });
                });
                
                // Responsive menu toggle
                this.setupResponsiveMenu();
            }
            
            switchSystem(systemName) {
                // Update active system
                document.querySelectorAll('.system-item').forEach(item => {
                    item.classList.remove('active');
                });
                document.querySelector(\`[data-system="\${systemName}"]\`).classList.add('active');
                
                this.currentSystem = systemName;
                this.loadSystemData();
                
                // Navigate to specific demo if available
                this.navigateToDemo(systemName);
            }
            
            switchTab(tabName) {
                // Update active tab
                document.querySelectorAll('.system-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                document.querySelector(\`[data-tab="\${tabName}"]\`).classList.add('active');
                
                this.currentTab = tabName;
                this.loadTabContent(tabName);
            }
            
            loadSystemData() {
                const systemDisplay = document.getElementById('systemDisplay');
                systemDisplay.innerHTML = '<div class="loading">Loading system data</div>';
                
                // Simulate loading delay
                setTimeout(() => {
                    this.renderSystemContent();
                }, 500);
            }
            
            loadTabContent(tabName) {
                const systemDisplay = document.getElementById('systemDisplay');
                
                const tabContent = {
                    'gov': this.getGovernmentContent(),
                    'econ': this.getEconomyContent(),
                    'pop': this.getPopulationContent(),
                    'mil': this.getMilitaryContent(),
                    'sci': this.getScienceContent(),
                    'comm': this.getCommunicationContent(),
                    'intel': this.getIntelligenceContent()
                };
                
                systemDisplay.innerHTML = tabContent[tabName] || '<div class="loading">Loading content</div>';
            }
            
            renderSystemContent() {
                // Default to government overview
                this.loadTabContent(this.currentTab);
            }
            
            getGovernmentContent() {
                return \`
                    <div class="system-overview">
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🏛️</span>
                                <span class="card-title">Cabinet Status</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Members Active</span>
                                    <span class="card-stat-value">9/9</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Meetings Today</span>
                                    <span class="card-stat-value">2</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Efficiency</span>
                                    <span class="card-stat-value">94%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">⚖️</span>
                                <span class="card-title">Active Policies</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Active Policies</span>
                                    <span class="card-stat-value">23</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Pending Approval</span>
                                    <span class="card-stat-value">5</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Implementation Rate</span>
                                    <span class="card-stat-value">87%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🏛️</span>
                                <span class="card-title">Legislature</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Session Status</span>
                                    <span class="card-stat-value">Active</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Bills Pending</span>
                                    <span class="card-stat-value">12</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Approval Rating</span>
                                    <span class="card-stat-value">67%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">⚖️</span>
                                <span class="card-title">Supreme Court</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Cases Pending</span>
                                    <span class="card-stat-value">3</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Constitutional Review</span>
                                    <span class="card-stat-value">Active</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Justices Present</span>
                                    <span class="card-stat-value">8/9</span>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }
            
            getEconomyContent() {
                return \`
                    <div class="system-overview">
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">💰</span>
                                <span class="card-title">Treasury</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Balance</span>
                                    <span class="card-stat-value">2.4T ₵</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Revenue</span>
                                    <span class="card-stat-value">+340B</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Expenses</span>
                                    <span class="card-stat-value">-280B</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">📈</span>
                                <span class="card-title">Trade Balance</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Exports</span>
                                    <span class="card-stat-value">1.8T ₵/year</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Imports</span>
                                    <span class="card-stat-value">1.2T ₵/year</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Surplus</span>
                                    <span class="card-stat-value">+600B ₵/year</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🏢</span>
                                <span class="card-title">Business Sector</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Companies</span>
                                    <span class="card-stat-value">2.3M</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Employment</span>
                                    <span class="card-stat-value">96%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Growth</span>
                                    <span class="card-stat-value">+12%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🏦</span>
                                <span class="card-title">Central Bank</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Interest Rate</span>
                                    <span class="card-stat-value">2.5%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Inflation Target</span>
                                    <span class="card-stat-value">2%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Money Supply</span>
                                    <span class="card-stat-value">Stable</span>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }
            
            getPopulationContent() {
                return \`
                    <div class="system-overview">
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">👥</span>
                                <span class="card-title">Demographics</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Total Population</span>
                                    <span class="card-stat-value">340M</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Growth Rate</span>
                                    <span class="card-stat-value">+0.8%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Life Expectancy</span>
                                    <span class="card-stat-value">89 years</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🏙️</span>
                                <span class="card-title">Cities</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Total Cities</span>
                                    <span class="card-stat-value">47</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Urban Population</span>
                                    <span class="card-stat-value">89%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Development Index</span>
                                    <span class="card-stat-value">Advanced</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🚶</span>
                                <span class="card-title">Migration</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Immigration Rate</span>
                                    <span class="card-stat-value">+2.3%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Internal Migration</span>
                                    <span class="card-stat-value">12M/year</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Integration Success</span>
                                    <span class="card-stat-value">89%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">💼</span>
                                <span class="card-title">Professions</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Employment Rate</span>
                                    <span class="card-stat-value">96%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Skill Level</span>
                                    <span class="card-stat-value">High</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Job Satisfaction</span>
                                    <span class="card-stat-value">78%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }
            
            getMilitaryContent() {
                return \`
                    <div class="system-overview">
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🛡️</span>
                                <span class="card-title">Military Forces</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Active Personnel</span>
                                    <span class="card-stat-value">890K</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Readiness Level</span>
                                    <span class="card-stat-value">87%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Fleet Strength</span>
                                    <span class="card-stat-value">12 Fleets</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🏰</span>
                                <span class="card-title">Defense Systems</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Planetary Defense</span>
                                    <span class="card-stat-value">94%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Shield Coverage</span>
                                    <span class="card-stat-value">98%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Early Warning</span>
                                    <span class="card-stat-value">Active</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🔒</span>
                                <span class="card-title">Security Status</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Threat Level</span>
                                    <span class="card-stat-value">LOW</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Active Threats</span>
                                    <span class="card-stat-value">2</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Response Time</span>
                                    <span class="card-stat-value">4.2 min</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">⭐</span>
                                <span class="card-title">Joint Chiefs</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Command Efficiency</span>
                                    <span class="card-stat-value">96%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Strategic Planning</span>
                                    <span class="card-stat-value">Active</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Coordination</span>
                                    <span class="card-stat-value">Excellent</span>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }
            
            getScienceContent() {
                return \`
                    <div class="system-overview">
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🔬</span>
                                <span class="card-title">Technology Research</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Active Projects</span>
                                    <span class="card-stat-value">8</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Research Efficiency</span>
                                    <span class="card-stat-value">94%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Breakthrough Rate</span>
                                    <span class="card-stat-value">+12%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🧪</span>
                                <span class="card-title">Science Department</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Scientists</span>
                                    <span class="card-stat-value">2.1M</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Research Budget</span>
                                    <span class="card-stat-value">340B ₵</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Innovation Index</span>
                                    <span class="card-stat-value">Advanced</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🎮</span>
                                <span class="card-title">Simulation Engine</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">System Performance</span>
                                    <span class="card-stat-value">98%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Prediction Accuracy</span>
                                    <span class="card-stat-value">89%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Processing Speed</span>
                                    <span class="card-stat-value">2min/tick</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🎨</span>
                                <span class="card-title">Visual Systems</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">AI Generation</span>
                                    <span class="card-stat-value">Active</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Render Quality</span>
                                    <span class="card-stat-value">Ultra</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Content Library</span>
                                    <span class="card-stat-value">2.3M Assets</span>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }
            
            getCommunicationContent() {
                return \`
                    <div class="system-overview">
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">📡</span>
                                <span class="card-title">Communication Hub</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Active Channels</span>
                                    <span class="card-stat-value">20</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Contacts</span>
                                    <span class="card-stat-value">200+</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Translation Accuracy</span>
                                    <span class="card-stat-value">99.7%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">📰</span>
                                <span class="card-title">News Systems</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Media Outlets</span>
                                    <span class="card-stat-value">47</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Public Sentiment</span>
                                    <span class="card-stat-value">Positive</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Coverage Rating</span>
                                    <span class="card-stat-value">78%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🎤</span>
                                <span class="card-title">Leader Communications</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Speeches This Month</span>
                                    <span class="card-stat-value">12</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Public Approval</span>
                                    <span class="card-stat-value">67%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Media Reach</span>
                                    <span class="card-stat-value">89%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🎯</span>
                                <span class="card-title">Policy Advisor</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">AI Recommendations</span>
                                    <span class="card-stat-value">23</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Success Rate</span>
                                    <span class="card-stat-value">87%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Analysis Depth</span>
                                    <span class="card-stat-value">Comprehensive</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🌌</span>
                                <span class="card-title">Galaxy Map</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Star Systems</span>
                                    <span class="card-stat-value">5</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Active Fleets</span>
                                    <span class="card-stat-value">12</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Trade Routes</span>
                                    <span class="card-stat-value">8</span>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }
            
            getIntelligenceContent() {
                return \`
                    <div class="system-overview">
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🕵️</span>
                                <span class="card-title">Intelligence Operations</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Active Operations</span>
                                    <span class="card-stat-value">23</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Intelligence Gathering</span>
                                    <span class="card-stat-value">94%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Threat Assessment</span>
                                    <span class="card-stat-value">Current</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🔍</span>
                                <span class="card-title">Surveillance Network</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Coverage</span>
                                    <span class="card-stat-value">98%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Data Processing</span>
                                    <span class="card-stat-value">Real-time</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Alert Response</span>
                                    <span class="card-stat-value">2.1 min</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">📊</span>
                                <span class="card-title">Analysis Division</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Reports Generated</span>
                                    <span class="card-stat-value">156/month</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Accuracy Rate</span>
                                    <span class="card-stat-value">91%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Predictive Models</span>
                                    <span class="card-stat-value">Active</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="overview-card">
                            <div class="card-header">
                                <span class="card-icon">🛡️</span>
                                <span class="card-title">Counter-Intelligence</span>
                            </div>
                            <div class="card-content">
                                <div class="card-stat">
                                    <span class="card-stat-label">Security Breaches</span>
                                    <span class="card-stat-value">0 this month</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Threat Mitigation</span>
                                    <span class="card-stat-value">98%</span>
                                </div>
                                <div class="card-stat">
                                    <span class="card-stat-label">Asset Protection</span>
                                    <span class="card-stat-value">Maximum</span>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }
            
            executeAction(action) {
                console.log(\`Executing action: \${action}\`);
                
                // Action implementations
                const actions = {
                    'address': () => this.openAddressNation(),
                    'briefing': () => this.openDailyBriefing(),
                    'military': () => this.openMilitaryCommand(),
                    'research': () => this.openResearchCenter(),
                    'budget': () => this.openBudgetManager()
                };
                
                if (actions[action]) {
                    actions[action]();
                } else {
                    console.warn(\`Unknown action: \${action}\`);
                }
            }
            
            navigateToDemo(systemName) {
                // Map system names to demo URLs
                const demoUrls = {
                    'demographics': '/demo/demographics',
                    'cities': '/demo/cities',
                    'migration': '/demo/migration',
                    'trade': '/demo/trade',
                    'policies': '/demo/policies',
                    'comm-hub': '/demo/communication',
                    'news': '/demo/witter',
                    'approval': '/demo/approval-rating',
                    'galaxy-map': '/demo/galaxy-map',
                    'conquest': '/demo/conquest'
                };
                
                if (demoUrls[systemName]) {
                    // Embed demo in HUD instead of opening new tab
                    this.embedDemo(systemName, demoUrls[systemName]);
                } else {
                    // For systems without demos, show placeholder
                    this.showSystemPlaceholder(systemName);
                }
            }
            
            embedDemo(systemName, demoUrl) {
                const systemDisplay = document.getElementById('systemDisplay');
                
                // Create embedded demo container
                systemDisplay.innerHTML = \`
                    <div style="height: 100%; display: flex; flex-direction: column;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 12px; background: var(--bg-surface); border-radius: 6px;">
                            <h3 style="color: var(--primary-glow); margin: 0; font-family: var(--font-display);">
                                \${this.getSystemDisplayName(systemName)} - Live Demo
                            </h3>
                            <div style="display: flex; gap: 8px;">
                                <button onclick="window.starTalesHUD.openDemoInNewTab('\${demoUrl}')" 
                                        style="background: var(--primary-bright); border: none; color: white; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                                    🔗 Open in New Tab
                                </button>
                                <button onclick="window.starTalesHUD.refreshDemo('\${systemName}', '\${demoUrl}')" 
                                        style="background: var(--secondary-bright); border: none; color: white; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                                    🔄 Refresh
                                </button>
                                <button onclick="window.starTalesHUD.closeDemoEmbed()" 
                                        style="background: var(--danger-bright); border: none; color: white; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                                    ✕ Close
                                </button>
                            </div>
                        </div>
                        <iframe src="\${demoUrl}" 
                                style="flex: 1; border: 1px solid var(--border-glow); border-radius: 8px; background: white;"
                                frameborder="0"
                                id="embeddedDemo">
                        </iframe>
                    </div>
                \`;
            }
            
            openDemoInNewTab(demoUrl) {
                window.open(demoUrl, '_blank');
            }
            
            refreshDemo(systemName, demoUrl) {
                const iframe = document.getElementById('embeddedDemo');
                if (iframe) {
                    iframe.src = iframe.src; // Force reload
                }
            }
            
            closeDemoEmbed() {
                // Return to system overview
                this.loadTabContent(this.currentTab);
            }
            
            showSystemPlaceholder(systemName) {
                const systemDisplay = document.getElementById('systemDisplay');
                const displayName = this.getSystemDisplayName(systemName);
                
                systemDisplay.innerHTML = \`
                    <div style="height: 100%; display: flex; align-items: center; justify-content: center; text-align: center;">
                        <div style="background: var(--bg-surface); padding: 40px; border-radius: 12px; border: 1px solid var(--border-glow);">
                            <div style="font-size: 48px; margin-bottom: 20px;">🚧</div>
                            <h3 style="color: var(--primary-glow); margin-bottom: 16px; font-family: var(--font-display);">
                                \${displayName} System
                            </h3>
                            <p style="color: var(--text-secondary); margin-bottom: 20px; max-width: 400px;">
                                This system is currently being developed. Full functionality will be available in future updates.
                            </p>
                            <button onclick="window.starTalesHUD.loadTabContent(window.starTalesHUD.currentTab)" 
                                    style="background: var(--primary-bright); border: none; color: white; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                                ← Back to Overview
                            </button>
                        </div>
                    </div>
                \`;
            }
            
            getSystemDisplayName(systemName) {
                const displayNames = {
                    'demographics': 'Demographics',
                    'planets-cities': 'Planets & Cities Management',
                    'migration': 'Migration System',
                    'trade': 'Trade System',
                    'policies': 'Policy Management',
                    'whoseapp': 'WhoseApp Communication',
                    'comm-hub': 'Communication Hub',
                    'news': 'Witter Social Network',
                    'approval': 'Approval Rating',
                    'galaxy-stats': 'Galaxy-Wide Statistics',
                    'galaxy-map': 'Galaxy Map',
                    'conquest': 'Conquest & Merge System',
                    'cabinet': 'Cabinet Workflow',
                    'treasury': 'Treasury Management',
                    'business': 'Business Management',
                    'central-bank': 'Central Bank',
                    'markets': 'Financial Markets',
                    'inflation': 'Inflation Control',
                    'military': 'Military Command',
                    'defense': 'Defense Systems',
                    'security': 'Security Operations',
                    'joint-chiefs': 'Joint Chiefs',
                    'intelligence': 'Intelligence Services',
                    'technology': 'Technology Research',
                    'research': 'Science Department',
                    'simulation': 'Simulation Engine',
                    'visuals': 'Visual Systems',
                    'legislature': 'Legislature',
                    'supreme-court': 'Supreme Court',
                    'political-parties': 'Political Parties',
                    'delegation': 'Delegation Systems',
                    'professions': 'Professions System',
                    'campaign': 'Campaign Management',
                    'legal': 'Legal Systems',
                    'interior': 'Interior Department',
                    'commerce': 'Commerce Department',
                    'state': 'State Management'
                };
                
                return displayNames[systemName] || systemName.charAt(0).toUpperCase() + systemName.slice(1);
            }
            
            openAddressNation() {
                alert('Address Nation feature - Coming Soon!');
            }
            
            openDailyBriefing() {
                alert('Daily Briefing feature - Coming Soon!');
            }
            
            openMilitaryCommand() {
                alert('Military Command feature - Coming Soon!');
            }
            
            openResearchCenter() {
                alert('Research Center feature - Coming Soon!');
            }
            
            openBudgetManager() {
                alert('Budget Manager feature - Coming Soon!');
            }
            
            setupResponsiveMenu() {
                // Mobile menu toggle (if needed)
                const menuToggle = document.createElement('button');
                menuToggle.className = 'menu-toggle';
                menuToggle.innerHTML = '☰';
                menuToggle.style.display = 'none';
                
                // Add to header for mobile
                document.querySelector('.command-header').appendChild(menuToggle);
                
                menuToggle.addEventListener('click', () => {
                    document.querySelector('.left-panel').classList.toggle('open');
                });
            }
            
            async startRealTimeUpdates() {
                // Initialize WebSocket connection for real-time updates
                this.initializeWebSocket();
                
                // Fallback polling every 30 seconds if WebSocket fails
                setInterval(() => {
                    if (!this.wsConnected) {
                        this.updateMetricsFromAPI();
                    }
                }, 30000);
                
                // Initial data load
                await this.updateMetricsFromAPI();
            }
            
            initializeWebSocket() {
                try {
                    const wsUrl = \`ws://\${window.location.host}/ws\`;
                    this.ws = new WebSocket(wsUrl);
                    this.wsConnected = false;

                    this.ws.onopen = () => {
                        console.log('🔗 WebSocket connected - Real-time data streaming active');
                        this.wsConnected = true;
                        this.updateConnectionStatus('ONLINE');
                    };

                    this.ws.onmessage = (event) => {
                        try {
                            const data = JSON.parse(event.data);
                            this.handleRealTimeEvent(data);
                        } catch (error) {
                            console.error('Error parsing WebSocket message:', error);
                        }
                    };

                    this.ws.onclose = () => {
                        console.log('🔌 WebSocket disconnected');
                        this.wsConnected = false;
                        this.updateConnectionStatus('POLLING');
                    };

                    this.ws.onerror = (error) => {
                        console.error('WebSocket error:', error);
                        this.wsConnected = false;
                        this.updateConnectionStatus('ERROR');
                    };
                } catch (error) {
                    console.error('Failed to initialize WebSocket:', error);
                    this.updateConnectionStatus('OFFLINE');
                }
            }
            
            async updateMetricsFromAPI() {
                try {
                    // Fetch real data from APIs
                    const [analyticsResponse, alertsResponse, witterResponse] = await Promise.all([
                        fetch('/api/analytics/empire?scope=campaign&id=1'),
                        fetch('/api/alerts/active'),
                        fetch('/api/witter/feed?limit=5')
                    ]);
                    
                    const analytics = await analyticsResponse.json();
                    const alerts = await alertsResponse.json();
                    const witter = await witterResponse.json();
                    
                    this.updateMetricsFromData(analytics, alerts, witter);
                    
                } catch (error) {
                    console.error('Error fetching live data:', error);
                    // Use safe defaults instead of random mock data
                    this.updateMetricsFromData({
                        metrics: {
                            population: { population: 0, morale: 0.5 },
                            economy: { gdpProxy: 0, budgetBalance: 0 },
                            population: { stability: 0.5 }
                        }
                    }, { alerts: [] }, { posts: [] });
                }
            }
            
            updateMetricsFromData(analytics, alerts, witter) {
                const metrics = analytics.metrics || {};
                
                // Update header metrics with real data
                const approval = Math.round((metrics.population?.morale || 0.5) * 100);
                const gdpGrowth = (metrics.economy?.gdpProxy || 0) / 1000000;
                const treasury = this.formatCurrency(metrics.economy?.budgetBalance || 0);
                const population = this.formatNumber(metrics.population?.population || 0);
                const security = Math.round((metrics.population?.stability || 0.5) * 100);
                
                // Update DOM elements
                document.getElementById('approvalRating').textContent = approval + '%';
                document.getElementById('gdpGrowth').textContent = '+' + gdpGrowth.toFixed(1) + '%';
                document.getElementById('treasuryBalance').textContent = treasury;
                document.getElementById('planetPopulation').textContent = population;
                document.getElementById('planetSecurity').textContent = security + '%';
                
                // Update alerts
                const alertCount = alerts.alerts?.length || 0;
                document.getElementById('alertCount').textContent = \`🔔 \${alertCount} Alert\${alertCount !== 1 ? 's' : ''}\`;
                
                console.log('✅ Live metrics updated from APIs');
            }
            
            handleRealTimeEvent(data) {
                console.log('📡 Real-time event received:', data.type, data);
                
                switch (data.type) {
                    case 'simulation_tick':
                        if (data.metrics) {
                            this.updateMetricsFromData(data.metrics, { alerts: data.alerts || [] }, { posts: [] });
                        }
                        break;
                    case 'alert_new':
                        this.addNewAlert(data.alert);
                        break;
                    case 'population_change':
                        this.updatePopulationDisplay(data.population);
                        break;
                    case 'economic_update':
                        this.updateEconomicDisplay(data.economics);
                        break;
                }
            }
            
            formatNumber(num) {
                if (num >= 1e12) return \`\${(num / 1e12).toFixed(1)}T\`;
                if (num >= 1e9) return \`\${(num / 1e9).toFixed(1)}B\`;
                if (num >= 1e6) return \`\${(num / 1e6).toFixed(1)}M\`;
                if (num >= 1e3) return \`\${(num / 1e3).toFixed(1)}K\`;
                return num.toString();
            }
            
            formatCurrency(amount) {
                return \`\${this.formatNumber(amount)} ₵\`;
            }
            
            updateConnectionStatus(status) {
                const statusElements = document.querySelectorAll('.status-item');
                statusElements.forEach(element => {
                    if (element.textContent.includes('Network:')) {
                        element.innerHTML = \`<span class="status-indicator"></span><span>Network: \${status}</span>\`;
                        const indicator = element.querySelector('.status-indicator');
                        if (status === 'ONLINE') {
                            indicator.style.background = 'var(--success-glow)';
                        } else if (status === 'POLLING') {
                            indicator.style.background = 'var(--warning-glow)';
                        } else {
                            indicator.style.background = 'var(--danger-glow)';
                        }
                    }
                });
            }
        }
        
        // Initialize HUD when page loads
        document.addEventListener('DOMContentLoaded', () => {
            window.starTalesHUD = new StarTalesHUD();
            console.log('StarTales HUD initialized');
        });
    </script>
</body>
</html>
    `;
}

module.exports = { getMainHUD };
