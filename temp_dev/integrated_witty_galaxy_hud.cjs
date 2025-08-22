// Integrated Witty Galaxy HUD - Complete Implementation
// This replaces the existing HUD with full API integration and live data streaming

function getIntegratedWittyGalaxyHUD() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Witty Galaxy Command Center - Integrated HUD</title>
    <style>
        /* Import Futuristic Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
        
        /* CSS Variables - Enhanced Witty Galaxy Palette */
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
            
            /* Witty Purple - Brand Color */
            --witty-purple: #8b5cf6;
            --witty-purple-dark: #5b21b6;
            --witty-purple-light: #a78bfa;
            
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
        
        /* Enhanced Particle Background */
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
                radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 60% 60%, rgba(0, 255, 136, 0.05) 0%, transparent 50%);
            z-index: -1;
        }
        
        /* Main Layout */
        .command-center {
            display: flex;
            flex-direction: column;
            height: 100vh;
            width: 100vw;
        }
        
        /* Enhanced Command Header */
        .command-header {
            height: 120px;
            background: linear-gradient(135deg, var(--bg-panel) 0%, var(--bg-surface) 100%);
            border-bottom: 2px solid var(--border-glow);
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            position: relative;
        }
        
        .command-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--witty-purple), var(--primary-glow), var(--secondary-glow));
            animation: headerGlow 3s ease-in-out infinite alternate;
        }
        
        @keyframes headerGlow {
            0% { opacity: 0.6; }
            100% { opacity: 1; }
        }
        
        .header-left {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        
        .header-title {
            font-family: var(--font-display);
            font-size: 22px;
            font-weight: 700;
            color: var(--witty-purple-light);
            text-shadow: 0 0 10px var(--primary-shadow);
        }
        
        .header-subtitle {
            font-size: 14px;
            color: var(--text-secondary);
            font-style: italic;
        }
        
        .header-campaign {
            font-size: 16px;
            color: var(--text-secondary);
        }
        
        .header-center {
            display: flex;
            gap: 25px;
            align-items: center;
        }
        
        .header-stat {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
        }
        
        .stat-label {
            font-size: 11px;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .stat-value {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .stat-trend {
            font-size: 12px;
            color: var(--success-glow);
        }
        
        .header-right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 6px;
        }
        
        .header-time {
            font-family: var(--font-mono);
            font-size: 14px;
            color: var(--text-accent);
        }
        
        .header-alerts {
            background: var(--danger-glow);
            color: white;
            padding: 3px 10px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .header-alerts:hover {
            background: var(--danger-bright);
            transform: scale(1.05);
        }
        
        /* Main Content Area */
        .main-content {
            flex: 1;
            display: flex;
            height: calc(100vh - 200px);
        }
        
        /* Left Panel - System Navigation */
        .left-panel {
            width: 350px;
            background: var(--bg-panel);
            border-right: 1px solid var(--border-glow);
            overflow-y: auto;
            padding: 15px;
        }
        
        .system-category {
            margin-bottom: 20px;
        }
        
        .category-header {
            font-family: var(--font-display);
            font-size: 12px;
            font-weight: 600;
            color: var(--primary-glow);
            text-transform: uppercase;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 1px solid var(--border-glow);
            letter-spacing: 1px;
        }
        
        .system-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 10px;
            margin-bottom: 3px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 13px;
            color: var(--text-secondary);
            position: relative;
        }
        
        .system-item:hover {
            background: var(--bg-surface);
            color: var(--text-primary);
            box-shadow: 0 2px 10px rgba(0, 217, 255, 0.1);
            transform: translateX(3px);
        }
        
        .system-item.active {
            background: var(--bg-surface);
            color: var(--primary-glow);
            border-left: 3px solid var(--primary-glow);
        }
        
        .system-item.live::after {
            content: '●';
            position: absolute;
            right: 8px;
            color: var(--success-glow);
            animation: pulse 2s infinite;
        }
        
        .system-icon {
            font-size: 14px;
            width: 18px;
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
        
        /* Primary Command Center View */
        .primary-view {
            height: 350px;
            background: linear-gradient(135deg, var(--bg-panel) 0%, var(--bg-surface) 100%);
            border: 1px solid var(--border-glow);
            margin: 15px;
            border-radius: 12px;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .command-overview {
            text-align: center;
            width: 100%;
            padding: 20px;
        }
        
        .civilization-name {
            font-family: var(--font-display);
            font-size: 28px;
            color: var(--witty-purple-light);
            margin-bottom: 15px;
            text-shadow: 0 0 20px var(--primary-shadow);
        }
        
        .civilization-stats {
            display: flex;
            gap: 30px;
            justify-content: center;
            margin-top: 15px;
        }
        
        .civ-stat {
            text-align: center;
        }
        
        .civ-stat-value {
            font-size: 20px;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .civ-stat-label {
            font-size: 12px;
            color: var(--text-secondary);
            margin-top: 3px;
        }
        
        /* Witter Feed Integration */
        .witter-feed-container {
            height: 300px;
            background: var(--bg-panel);
            border: 1px solid var(--border-glow);
            margin: 0 15px 15px 15px;
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        
        .witter-header {
            background: linear-gradient(90deg, var(--witty-purple), var(--witty-purple-dark));
            color: white;
            padding: 12px 16px;
            font-weight: 600;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .witter-feed {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
        }
        
        .witter-post {
            background: var(--bg-surface);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 8px;
            transition: all 0.3s ease;
        }
        
        .witter-post:hover {
            border-color: var(--witty-purple);
            box-shadow: 0 2px 10px rgba(139, 92, 246, 0.2);
        }
        
        .witter-author {
            font-weight: 600;
            color: var(--witty-purple-light);
            font-size: 13px;
            margin-bottom: 4px;
        }
        
        .witter-content {
            font-size: 12px;
            color: var(--text-primary);
            line-height: 1.4;
        }
        
        .witter-meta {
            font-size: 10px;
            color: var(--text-secondary);
            margin-top: 6px;
            display: flex;
            justify-content: space-between;
        }
        
        /* Galaxy Map Integration */
        .galaxy-map-container {
            height: 250px;
            background: var(--bg-panel);
            border: 1px solid var(--border-glow);
            margin: 0 15px 15px 15px;
            border-radius: 12px;
            overflow: hidden;
            display: none; /* Initially hidden, shown when galaxy map is active */
        }
        
        .galaxy-map-header {
            background: linear-gradient(90deg, var(--primary-glow), var(--primary-dark));
            color: white;
            padding: 10px 16px;
            font-weight: 600;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .galaxy-map-view {
            flex: 1;
            background: radial-gradient(circle, #001122 0%, #000511 100%);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
            font-style: italic;
        }
        
        /* Right Panel - Live Metrics */
        .right-panel {
            width: 350px;
            background: var(--bg-panel);
            border-left: 1px solid var(--border-glow);
            padding: 15px;
            overflow-y: auto;
        }
        
        .metrics-section {
            margin-bottom: 25px;
        }
        
        .metrics-header {
            font-family: var(--font-display);
            font-size: 12px;
            font-weight: 600;
            color: var(--primary-glow);
            text-transform: uppercase;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 1px solid var(--border-glow);
            letter-spacing: 1px;
        }
        
        .metric-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 13px;
        }
        
        .metric-item:last-child {
            border-bottom: none;
        }
        
        .metric-label {
            color: var(--text-secondary);
        }
        
        .metric-value {
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .metric-trend {
            font-size: 11px;
            margin-left: 6px;
        }
        
        .trend-up {
            color: var(--success-glow);
        }
        
        .trend-down {
            color: var(--danger-glow);
        }
        
        .progress-bar {
            width: 100%;
            height: 3px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            margin-top: 3px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-glow), var(--success-glow));
            transition: width 0.3s ease;
        }
        
        /* Live Alerts Section */
        .alerts-section {
            background: var(--bg-surface);
            border: 1px solid var(--border-glow);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 20px;
        }
        
        .alert-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 0;
            font-size: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .alert-item:last-child {
            border-bottom: none;
        }
        
        .alert-urgent {
            color: var(--danger-glow);
        }
        
        .alert-important {
            color: var(--warning-glow);
        }
        
        .alert-info {
            color: var(--primary-glow);
        }
        
        /* Game Master Messages */
        .game-master-section {
            background: linear-gradient(135deg, var(--witty-purple-dark), var(--bg-surface));
            border: 1px solid var(--witty-purple);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 20px;
        }
        
        .game-master-header {
            color: var(--witty-purple-light);
            font-weight: 600;
            font-size: 13px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .game-master-message {
            font-size: 12px;
            color: var(--text-primary);
            line-height: 1.4;
            font-style: italic;
        }
        
        /* Status Bar */
        .status-bar {
            height: 80px;
            background: var(--bg-panel);
            border-top: 2px solid var(--border-glow);
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .action-buttons {
            display: flex;
            gap: 12px;
        }
        
        .action-btn {
            background: linear-gradient(135deg, var(--primary-bright), var(--primary-dark));
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-family: var(--font-ui);
            font-size: 12px;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .action-btn:hover {
            background: linear-gradient(135deg, var(--primary-glow), var(--primary-bright));
            transform: translateY(-2px);
            box-shadow: 0 4px 15px var(--primary-shadow);
        }
        
        .action-btn.witty {
            background: linear-gradient(135deg, var(--witty-purple), var(--witty-purple-dark));
        }
        
        .action-btn.witty:hover {
            background: linear-gradient(135deg, var(--witty-purple-light), var(--witty-purple));
        }
        
        .status-info {
            display: flex;
            gap: 20px;
            align-items: center;
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--text-secondary);
        }
        
        .status-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .status-indicator {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--success-glow);
            animation: pulse 2s infinite;
        }
        
        /* Animations */
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        @keyframes slideIn {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .slide-in {
            animation: slideIn 0.3s ease-out;
        }
        
        /* Loading States */
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
            font-style: italic;
            font-size: 12px;
        }
        
        .loading::after {
            content: '...';
            animation: pulse 1.5s infinite;
        }
        
        /* Responsive Design */
        @media (max-width: 1366px) {
            .left-panel, .right-panel {
                width: 300px;
            }
            
            .command-header {
                height: 100px;
                padding: 12px 16px;
            }
            
            .header-title {
                font-size: 18px;
            }
        }
        
        @media (max-width: 1024px) {
            .left-panel {
                position: fixed;
                left: -350px;
                top: 0;
                height: 100vh;
                z-index: 1000;
                transition: left 0.3s ease;
            }
            
            .left-panel.open {
                left: 0;
            }
            
            .right-panel {
                width: 280px;
            }
            
            .main-content {
                margin-left: 0;
            }
        }
        
        @media (max-width: 768px) {
            .header-center {
                display: none;
            }
            
            .right-panel {
                position: fixed;
                right: -280px;
                top: 0;
                height: 100vh;
                z-index: 1000;
                transition: right 0.3s ease;
            }
            
            .right-panel.open {
                right: 0;
            }
        }
    </style>
</head>
<body data-testid="witty-galaxy-hud">
    <div class="particle-bg"></div>
    
    <div class="command-center">
        <!-- Enhanced Command Header -->
        <header class="command-header">
            <div class="header-left">
                <div class="header-title">🌌 WITTY GALAXY COMMAND CENTER</div>
                <div class="header-subtitle">WittyGalaxy.com - Real-time Galactic Management</div>
                <div class="header-campaign">🎯 <span id="campaignName">Loading...</span></div>
            </div>
            
            <div class="header-center">
                <div class="header-stat">
                    <div class="stat-label">Leader</div>
                    <div class="stat-value" id="leaderName">Loading...</div>
                </div>
                <div class="header-stat">
                    <div class="stat-label">Approval</div>
                    <div class="stat-value" id="approvalRating">--</div>
                    <div class="stat-trend" id="approvalTrend">--</div>
                </div>
                <div class="header-stat">
                    <div class="stat-label">Treasury</div>
                    <div class="stat-value" id="treasuryBalance">Loading...</div>
                </div>
                <div class="header-stat">
                    <div class="stat-label">GDP Growth</div>
                    <div class="stat-value" id="gdpGrowth">--</div>
                    <div class="stat-trend trend-up" id="gdpTrend">--</div>
                </div>
            </div>
            
            <div class="header-right">
                <div class="header-time" id="gameTime">⏰ Loading...</div>
                <div class="header-alerts" id="alertCount" onclick="toggleAlerts()">🔔 Loading...</div>
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
                </div>
                
                <!-- Government Systems -->
                <div class="system-category">
                    <div class="category-header">🏛️ Government</div>
                    <div class="system-item live" data-system="cabinet">
                        <span class="system-icon">🏛️</span>
                        <span>Cabinet</span>
                    </div>
                    <div class="system-item live" data-system="policies">
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
                </div>
                
                <!-- Economy Systems -->
                <div class="system-category">
                    <div class="category-header">💰 Economy</div>
                    <div class="system-item" data-system="treasury">
                        <span class="system-icon">💰</span>
                        <span>Treasury</span>
                    </div>
                    <div class="system-item live" data-system="trade">
                        <span class="system-icon">📈</span>
                        <span>Trade</span>
                    </div>
                    <div class="system-item live" data-system="business">
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
                </div>
                
                <!-- Population Systems -->
                <div class="system-category">
                    <div class="category-header">👥 Population</div>
                    <div class="system-item live" data-system="demographics">
                        <span class="system-icon">👥</span>
                        <span>Demographics</span>
                    </div>
                    <div class="system-item live" data-system="planets-cities">
                        <span class="system-icon">🌍</span>
                        <span>Planets & Cities</span>
                    </div>
                    <div class="system-item live" data-system="migration">
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
                    <div class="system-item live" data-system="security">
                        <span class="system-icon">🔒</span>
                        <span>Security</span>
                    </div>
                    <div class="system-item live" data-system="intelligence">
                        <span class="system-icon">🕵️</span>
                        <span>Intelligence</span>
                    </div>
                </div>
                
                <!-- Science & Tech Systems -->
                <div class="system-category">
                    <div class="category-header">🔬 Science & Tech</div>
                    <div class="system-item live" data-system="technology">
                        <span class="system-icon">🔬</span>
                        <span>Technology</span>
                    </div>
                    <div class="system-item" data-system="research">
                        <span class="system-icon">🧪</span>
                        <span>Research</span>
                    </div>
                    <div class="system-item live" data-system="education">
                        <span class="system-icon">🎓</span>
                        <span>Education</span>
                    </div>

                </div>
                
                <!-- Galaxy Systems -->
                <div class="system-category">
                    <div class="category-header">🌌 Galaxy</div>
                    <div class="system-item" data-system="galaxy-stats">
                        <span class="system-icon">📊</span>
                        <span>Statistics</span>
                    </div>
                    <div class="system-item live" data-system="galaxy-map">
                        <span class="system-icon">🌌</span>
                        <span>Galaxy Map</span>
                    </div>
                    <div class="system-item" data-system="visuals">
                        <span class="system-icon">🎨</span>
                        <span>Visuals</span>
                    </div>
                    <div class="system-item live" data-system="conquest">
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
                    <div class="system-item live" data-system="witter">
                        <span class="system-icon">🐦</span>
                        <span>Witter Network</span>
                    </div>
                    <div class="system-item" data-system="comm-hub">
                        <span class="system-icon">📡</span>
                        <span>Comm Hub</span>
                    </div>
                    <div class="system-item live" data-system="news">
                        <span class="system-icon">📰</span>
                        <span>News</span>
                    </div>

                </div>
                
                <!-- Administration Systems -->
                <div class="system-category">
                    <div class="category-header">⚙️ Administration</div>
                    <div class="system-item" data-system="campaign">
                        <span class="system-icon">🎮</span>
                        <span>Campaign</span>
                    </div>
                    <div class="system-item live" data-system="legal">
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
                </div>
            </nav>
            
            <!-- Central Display -->
            <section class="central-display" data-testid="central-display">
                <!-- Primary Command Center View -->
                <div class="primary-view">
                    <div class="command-overview">
                        <div class="civilization-name" id="civilizationName">🌍 Loading Civilization...</div>
                        <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 15px;">
                            [AI-Generated Civilization Visualization]
                        </div>
                        <div class="civilization-stats">
                            <div class="civ-stat">
                                <div class="civ-stat-value" id="civCities">--</div>
                                <div class="civ-stat-label">Cities</div>
                            </div>
                            <div class="civ-stat">
                                <div class="civ-stat-value" id="civPopulation">--</div>
                                <div class="civ-stat-label">Population</div>
                            </div>
                            <div class="civ-stat">
                                <div class="civ-stat-value" id="civHappiness">--%</div>
                                <div class="civ-stat-label">Happiness</div>
                            </div>
                            <div class="civ-stat">
                                <div class="civ-stat-value" id="civSecurity">--%</div>
                                <div class="civ-stat-label">Security</div>
                            </div>
                            <div class="civ-stat">
                                <div class="civ-stat-value" id="civTech">--</div>
                                <div class="civ-stat-label">Tech Level</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Witter Feed Integration -->
                <div class="witter-feed-container">
                    <div class="witter-header">
                        <span>🐦</span>
                        <span>Witty Galaxy Social Feed</span>
                        <span style="margin-left: auto; font-size: 12px; opacity: 0.8;">Live</span>
                    </div>
                    <div class="witter-feed" id="witterFeed">
                        <div class="loading">Loading Witter feed...</div>
                    </div>
                </div>
                
                <!-- Galaxy Map Integration (Hidden by default) -->
                <div class="galaxy-map-container" id="galaxyMapContainer">
                    <div class="galaxy-map-header">
                        <span>🌌</span>
                        <span>Interactive Galaxy Map</span>
                    </div>
                    <div class="galaxy-map-view">
                        <iframe id="galaxyMapFrame" src="/demo/galaxy-map" style="width: 100%; height: 100%; border: none;"></iframe>
                    </div>
                </div>
            </section>
            
            <!-- Right Panel - Live Metrics -->
            <aside class="right-panel" data-testid="live-metrics">
                <!-- Live Metrics -->
                <div class="metrics-section">
                    <div class="metrics-header">📊 Live Metrics</div>
                    <div class="metric-item">
                        <span class="metric-label">Population</span>
                        <span class="metric-value" id="metricPopulation">Loading...<span class="metric-trend trend-up" id="populationTrend"></span></span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="populationProgress" style="width: 0%"></div>
                    </div>
                    
                    <div class="metric-item">
                        <span class="metric-label">GDP Growth</span>
                        <span class="metric-value" id="metricGDP">Loading...<span class="metric-trend trend-up" id="gdpMetricTrend"></span></span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="gdpProgress" style="width: 0%"></div>
                    </div>
                    
                    <div class="metric-item">
                        <span class="metric-label">Security</span>
                        <span class="metric-value" id="metricSecurity">Loading...<span class="metric-trend trend-up" id="securityTrend"></span></span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="securityProgress" style="width: 0%"></div>
                    </div>
                    
                    <div class="metric-item">
                        <span class="metric-label">Technology</span>
                        <span class="metric-value" id="metricTechnology">Loading...<span class="metric-trend" id="technologyTrend"></span></span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="technologyProgress" style="width: 0%"></div>
                    </div>
                </div>
                
                <!-- Live Alerts -->
                <div class="alerts-section">
                    <div class="metrics-header">🔔 Live Alerts</div>
                    <div id="liveAlerts">
                        <div class="loading">Loading alerts...</div>
                    </div>
                </div>
                
                <!-- Game Master Messages -->
                <div class="game-master-section">
                    <div class="game-master-header">
                        <span>🎭</span>
                        <span>Game Master</span>
                    </div>
                    <div class="game-master-message" id="gameMasterMessage">
                        Welcome to Witty Galaxy! Your civilization awaits your leadership...
                    </div>
                </div>
                
                <!-- Objectives -->
                <div class="metrics-section">
                    <div class="metrics-header">🎯 Current Objectives</div>
                    <div id="currentObjectives">
                        <div class="loading">Loading objectives...</div>
                    </div>
                </div>
                
                <!-- Quick Stats -->
                <div class="metrics-section">
                    <div class="metrics-header">📈 Quick Stats</div>
                    <div class="metric-item">
                        <span class="metric-label">Military</span>
                        <span class="metric-value" id="statMilitary">Loading...</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Scientists</span>
                        <span class="metric-value" id="statScientists">Loading...</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Trade Routes</span>
                        <span class="metric-value" id="statTradeRoutes">Loading...</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Research Projects</span>
                        <span class="metric-value" id="statResearch">Loading...</span>
                    </div>
                </div>
            </aside>
        </main>
        
        <!-- Status Bar -->
        <footer class="status-bar">
            <div class="action-buttons">
                <button class="action-btn witty" onclick="openWitterNetwork()">
                    <span>🐦</span>
                    <span>Witter Network</span>
                </button>
                <button class="action-btn" onclick="openGalaxyMap()">
                    <span>🌌</span>
                    <span>Galaxy Map</span>
                </button>
                <button class="action-btn" onclick="addressNation()">
                    <span>🎤</span>
                    <span>Address Nation</span>
                </button>
                <button class="action-btn" onclick="dailyBriefing()">
                    <span>📋</span>
                    <span>Daily Brief</span>
                </button>
                <button class="action-btn" onclick="emergencyPowers()">
                    <span>🚨</span>
                    <span>Crisis Center</span>
                </button>
            </div>
            
            <div class="status-info">
                <div class="status-item">
                    <span class="status-indicator"></span>
                    <span id="simulationStatus">Simulation: Loading...</span>
                </div>
                <div class="status-item">
                    <span id="simulationTick">Tick: --</span>
                </div>
                <div class="status-item">
                    <span id="simulationSpeed">Speed: --</span>
                </div>
                <div class="status-item">
                    <span id="nextTick">Next: --</span>
                </div>
                <div class="status-item">
                    <span class="status-indicator"></span>
                    <span id="networkStatus">Network: Connecting...</span>
                </div>
                <div class="status-item">
                    <span id="performanceStatus">Performance: --%</span>
                </div>
            </div>
        </footer>
    </div>
    
    <script>
        // Integrated Witty Galaxy HUD JavaScript
        class WittyGalaxyHUD {
            constructor() {
                this.currentSystem = 'witter';
                this.isLoading = false;
                this.websocket = null;
                this.updateInterval = null;
                this.campaignId = 1; // Default campaign
                this.init();
            }
            
            init() {
                console.log('🌌 Initializing Witty Galaxy HUD...');
                this.setupEventListeners();
                this.connectWebSocket();
                this.startRealTimeUpdates();
                this.loadInitialData();
            }
            
            setupEventListeners() {
                // System navigation
                document.querySelectorAll('.system-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        const system = e.currentTarget.dataset.system;
                        this.switchSystem(system);
                    });
                });
                
                // Responsive menu toggles
                this.setupResponsiveMenu();
            }
            
            connectWebSocket() {
                try {
                    // Connect to real-time event-driven updates
                    this.websocket = new WebSocket('ws://localhost:4010/ws');
                    
                    this.websocket.onopen = () => {
                        console.log('🔗 WebSocket connected - Real-time events active');
                        this.updateNetworkStatus('LIVE');
                        
                        // Subscribe to real-time events
                        this.subscribeToEvents();
                        
                        // Send heartbeat to maintain connection
                        this.startHeartbeat();
                    };
                    
                    this.websocket.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        this.handleRealTimeEvent(data);
                    };
                    
                    this.websocket.onclose = () => {
                        console.log('🔗 WebSocket disconnected - Switching to polling fallback');
                        this.updateNetworkStatus('RECONNECTING');
                        this.stopHeartbeat();
                        
                        // Attempt to reconnect with exponential backoff
                        this.reconnectWithBackoff();
                    };
                    
                    this.websocket.onerror = (error) => {
                        console.error('🔗 WebSocket error:', error);
                        this.updateNetworkStatus('ERROR');
                    };
                } catch (error) {
                    console.warn('🔗 WebSocket not available, using polling fallback');
                    this.updateNetworkStatus('POLLING');
                    this.startPollingFallback();
                }
            }
            
            subscribeToEvents() {
                if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                    // Subscribe to specific event types for real-time updates
                    const subscriptions = {
                        type: 'subscribe',
                        events: [
                            'simulation_tick',          // Game simulation updates
                            'witter_post_new',         // New Witter posts
                            'witter_post_update',      // Updated posts (likes, shares)
                            'alert_new',               // New system alerts
                            'alert_resolved',          // Resolved alerts
                            'population_change',       // Population metrics
                            'economic_update',         // Economic indicators
                            'security_event',          // Security status changes
                            'technology_progress',     // Research progress
                            'diplomatic_event',        // Diplomatic changes
                            'military_movement',       // Fleet movements
                            'trade_update',           // Trade route changes
                            'city_event',             // City developments
                            'character_message',       // Game Master messages
                            'policy_change',          // Policy updates
                            'crisis_event',           // Emergency situations
                            'achievement_unlock',      // Player achievements
                            'news_breaking'           // Breaking news events
                        ],
                        campaignId: this.campaignId
                    };
                    
                    this.websocket.send(JSON.stringify(subscriptions));
                    console.log('📡 Subscribed to real-time events');
                }
            }
            
            startHeartbeat() {
                this.heartbeatInterval = setInterval(() => {
                    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                        this.websocket.send(JSON.stringify({ type: 'ping' }));
                    }
                }, 30000); // Heartbeat every 30 seconds
            }
            
            stopHeartbeat() {
                if (this.heartbeatInterval) {
                    clearInterval(this.heartbeatInterval);
                    this.heartbeatInterval = null;
                }
            }
            
            reconnectWithBackoff() {
                if (!this.reconnectAttempts) this.reconnectAttempts = 0;
                this.reconnectAttempts++;
                
                const backoffDelay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
                console.log(\`🔄 Reconnecting in \${backoffDelay/1000}s (attempt \${this.reconnectAttempts})\`);
                
                this.reconnectTimeout = setTimeout(() => {
                    this.connectWebSocket();
                }, backoffDelay);
            }
            
            startPollingFallback() {
                console.log('📊 Starting polling fallback for real-time updates');
                // Only use polling as a fallback when WebSocket is not available
                this.pollingInterval = setInterval(() => {
                    this.loadLiveData();
                }, 10000); // Poll every 10 seconds as fallback
            }
            
            startRealTimeUpdates() {
                // Only use polling as absolute fallback - real-time is event-driven via WebSocket
                // Initial load only
                this.loadLiveData();
            }
            
            async loadInitialData() {
                try {
                    // Load campaign data
                    await this.loadCampaignData();
                    
                    // Load Witter feed
                    await this.loadWitterFeed();
                    
                    // Load system metrics
                    await this.loadSystemMetrics();
                    
                    // Load alerts
                    await this.loadAlerts();
                    
                    console.log('✅ Initial data loaded successfully');
                } catch (error) {
                    console.error('❌ Error loading initial data:', error);
                }
            }
            
            async loadCampaignData() {
                try {
                    const response = await fetch(\`/api/campaigns/\${this.campaignId}\`);
                    if (response.ok) {
                        const campaign = await response.json();
                        this.updateCampaignInfo(campaign);
                    }
                } catch (error) {
                    console.warn('Campaign data not available, using defaults');
                    this.updateCampaignInfo({
                        name: 'Terra Nova Federation',
                        leader: 'President Sarah Chen',
                        civilization: 'Terra Nova'
                    });
                }
            }
            
            async loadWitterFeed() {
                try {
                    const response = await fetch('http://localhost:5173/api/posts?limit=10');
                    if (response.ok) {
                        const data = await response.json();
                        this.updateWitterFeed(data.posts || []);
                    } else {
                        throw new Error('Witter API not available');
                    }
                } catch (error) {
                    console.warn('Witter feed not available, using sample data');
                    this.updateWitterFeed(this.getSampleWitterPosts());
                }
            }
            
            async loadSystemMetrics() {
                try {
                    // Load various system metrics
                    const endpoints = [
                        '/api/demographics/population',
                        '/api/trade/indices',
                        '/api/security/status',
                        '/api/technology/progress'
                    ];
                    
                    const responses = await Promise.allSettled(
                        endpoints.map(endpoint => fetch(endpoint))
                    );
                    
                    // Process successful responses
                    responses.forEach((result, index) => {
                        if (result.status === 'fulfilled' && result.value.ok) {
                            result.value.json().then(data => {
                                this.updateSystemMetric(endpoints[index], data);
                            });
                        }
                    });
                } catch (error) {
                    console.warn('System metrics not fully available, using sample data');
                    this.updateSystemMetrics(this.getSampleMetrics());
                }
            }
            
            async loadAlerts() {
                try {
                    const response = await fetch('/api/alerts/active');
                    if (response.ok) {
                        const alerts = await response.json();
                        this.updateAlerts(alerts);
                    } else {
                        throw new Error('Alerts API not available');
                    }
                } catch (error) {
                    console.warn('Alerts not available, using sample data');
                    this.updateAlerts(this.getSampleAlerts());
                }
            }
            
            async loadLiveData() {
                // Refresh all live data
                await Promise.all([
                    this.loadWitterFeed(),
                    this.loadSystemMetrics(),
                    this.loadAlerts()
                ]);
                
                // Update timestamp
                this.updateGameTime();
            }
            
            switchSystem(systemName) {
                console.log(\`🔄 Switching to system: \${systemName}\`);
                
                // Update active system
                document.querySelectorAll('.system-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                const activeItem = document.querySelector(\`[data-system="\${systemName}"]\`);
                if (activeItem) {
                    activeItem.classList.add('active');
                }
                
                this.currentSystem = systemName;
                
                // Handle special system views
                if (systemName === 'galaxy-map') {
                    this.showGalaxyMap();
                } else if (systemName === 'witter') {
                    this.showWitterFeed();
                } else {
                    this.hideSpecialViews();
                    this.loadSystemDemo(systemName);
                }
            }
            
            showGalaxyMap() {
                document.getElementById('galaxyMapContainer').style.display = 'flex';
                // Reload galaxy map iframe
                const iframe = document.getElementById('galaxyMapFrame');
                iframe.src = iframe.src;
            }
            
            showWitterFeed() {
                document.getElementById('galaxyMapContainer').style.display = 'none';
                this.loadWitterFeed();
            }
            
            hideSpecialViews() {
                document.getElementById('galaxyMapContainer').style.display = 'none';
            }
            
            loadSystemDemo(systemName) {
                // Map system names to demo URLs
                const demoUrls = {
                    'demographics': '/demo/demographics',
                    'cities': '/demo/cities',
                    'migration': '/demo/migration',
                    'trade': '/demo/trade',
                    'policies': '/demo/policies',
                    'business': '/demo/businesses',
                    'technology': '/demo/technology',
                    'education': '/demo/education',
                    'legal': '/demo/legal',
                    'security': '/demo/security',
                    'intelligence': '/demo/intelligence',
                    'news': '/demo/news',
                    'conquest': '/demo/conquest',
                    'visual-systems': '/demo/visual-systems'
                };
                
                if (demoUrls[systemName]) {
                    // Open demo in new tab for now
                    window.open(demoUrls[systemName], '_blank');
                } else {
                    console.log(\`System \${systemName} demo not yet available\`);
                }
            }
            
            updateCampaignInfo(campaign) {
                document.getElementById('campaignName').textContent = campaign.name || 'Unknown Campaign';
                document.getElementById('leaderName').textContent = campaign.leader || 'Unknown Leader';
                document.getElementById('civilizationName').textContent = \`🌍 \${campaign.civilization || 'Unknown Civilization'}\`;
            }
            
            updateWitterFeed(posts) {
                const feedContainer = document.getElementById('witterFeed');
                
                if (!posts || posts.length === 0) {
                    feedContainer.innerHTML = '<div class="loading">No posts available</div>';
                    return;
                }
                
                feedContainer.innerHTML = posts.map(post => \`
                    <div class="witter-post slide-in">
                        <div class="witter-author">\${post.author || 'Anonymous'}</div>
                        <div class="witter-content">\${post.content || post.text || 'No content'}</div>
                        <div class="witter-meta">
                            <span>\${post.timestamp ? new Date(post.timestamp).toLocaleTimeString() : 'Just now'}</span>
                            <span>❤️ \${post.likes || 0} | 🔄 \${post.shares || 0}</span>
                        </div>
                    </div>
                \`).join('');
            }
            
            updateSystemMetrics(metrics) {
                // Update header stats
                if (metrics.approval) {
                    document.getElementById('approvalRating').textContent = \`\${metrics.approval}%\`;
                    document.getElementById('approvalTrend').textContent = metrics.approvalTrend || '↗️';
                }
                
                if (metrics.treasury) {
                    document.getElementById('treasuryBalance').textContent = metrics.treasury;
                }
                
                if (metrics.gdp) {
                    document.getElementById('gdpGrowth').textContent = \`+\${metrics.gdp}%\`;
                    document.getElementById('gdpTrend').textContent = '↗️';
                }
                
                // Update right panel metrics
                if (metrics.population) {
                    document.getElementById('metricPopulation').innerHTML = \`\${metrics.population}<span class="metric-trend trend-up">+0.8%</span>\`;
                    document.getElementById('populationProgress').style.width = '78%';
                }
                
                if (metrics.security) {
                    document.getElementById('metricSecurity').innerHTML = \`\${metrics.security}%<span class="metric-trend trend-up">↗️</span>\`;
                    document.getElementById('securityProgress').style.width = \`\${metrics.security}%\`;
                }
                
                // Update civilization stats
                if (metrics.cities) document.getElementById('civCities').textContent = metrics.cities;
                if (metrics.population) document.getElementById('civPopulation').textContent = metrics.population;
                if (metrics.happiness) document.getElementById('civHappiness').textContent = \`\${metrics.happiness}%\`;
                if (metrics.security) document.getElementById('civSecurity').textContent = \`\${metrics.security}%\`;
                if (metrics.techLevel) document.getElementById('civTech').textContent = metrics.techLevel;
                
                // Update quick stats
                if (metrics.military) document.getElementById('statMilitary').textContent = metrics.military;
                if (metrics.scientists) document.getElementById('statScientists').textContent = metrics.scientists;
                if (metrics.tradeRoutes) document.getElementById('statTradeRoutes').textContent = metrics.tradeRoutes;
                if (metrics.research) document.getElementById('statResearch').textContent = metrics.research;
            }
            
            updateAlerts(alerts) {
                const alertsContainer = document.getElementById('liveAlerts');
                
                if (!alerts || alerts.length === 0) {
                    alertsContainer.innerHTML = '<div style="text-align: center; color: var(--success-glow); font-size: 12px;">All systems nominal</div>';
                    document.getElementById('alertCount').textContent = '🔔 0 Alerts';
                    return;
                }
                
                alertsContainer.innerHTML = alerts.map(alert => \`
                    <div class="alert-item alert-\${alert.priority || 'info'}">
                        <span>\${this.getAlertIcon(alert.priority)}</span>
                        <span>\${alert.message || alert.text}</span>
                    </div>
                \`).join('');
                
                document.getElementById('alertCount').textContent = \`🔔 \${alerts.length} Alert\${alerts.length !== 1 ? 's' : ''}\`;
            }
            
            getAlertIcon(priority) {
                switch (priority) {
                    case 'urgent': return '🚨';
                    case 'important': return '⚠️';
                    default: return 'ℹ️';
                }
            }
            
            updateGameTime() {
                const now = new Date();
                const stardate = \`Stardate \${2387 + Math.floor(Math.random() * 10)}.\${String(now.getDate()).padStart(3, '0')}.\${now.getHours()}:\${String(now.getMinutes()).padStart(2, '0')}\`;
                document.getElementById('gameTime').textContent = \`⏰ \${stardate}\`;
            }
            
            updateNetworkStatus(status) {
                const statusElement = document.getElementById('networkStatus');
                statusElement.textContent = \`Network: \${status}\`;
                
                const indicator = statusElement.previousElementSibling;
                if (status === 'ONLINE') {
                    indicator.style.background = 'var(--success-glow)';
                } else if (status === 'POLLING') {
                    indicator.style.background = 'var(--warning-glow)';
                } else {
                    indicator.style.background = 'var(--danger-glow)';
                }
            }
            
            updateSystemMetric(endpoint, data) {
                // Process specific endpoint data
                if (endpoint.includes('population')) {
                    this.updateSystemMetrics({ 
                        population: data.totalPopulation ? this.formatNumber(data.totalPopulation) : '340M',
                        cities: data.totalCities || 47
                    });
                } else if (endpoint.includes('trade')) {
                    this.updateSystemMetrics({ 
                        gdp: data.gdpGrowth || 2.1,
                        treasury: data.treasuryBalance ? this.formatCurrency(data.treasuryBalance) : '2.4T ₵'
                    });
                } else if (endpoint.includes('security')) {
                    this.updateSystemMetrics({ 
                        security: data.overallSecurity || 87
                    });
                }
            }
            
            handleRealTimeEvent(data) {
                console.log('📡 Real-time event received:', data.type, data);
                
                // Handle different event types with immediate UI updates
                switch (data.type) {
                    // Social Network Events
                    case 'witter_post_new':
                        this.addNewWitterPost(data.post);
                        this.showNotification('New Witter post', 'info');
                        break;
                    case 'witter_post_update':
                        this.updateWitterPost(data.postId, data.updates);
                        break;
                    
                    // Alert Events
                    case 'alert_new':
                        this.addNewAlert(data.alert);
                        this.showNotification(data.alert.message, data.alert.priority);
                        this.flashAlertIndicator();
                        break;
                    case 'alert_resolved':
                        this.removeAlert(data.alertId);
                        break;
                    
                    // Simulation Events
                    case 'simulation_tick':
                        this.updateSimulationStatus(data.simulation);
                        this.updateAllMetrics(data.metrics);
                        break;
                    
                    // Population Events
                    case 'population_change':
                        this.updatePopulationMetrics(data.population);
                        break;
                    
                    // Economic Events
                    case 'economic_update':
                        this.updateEconomicMetrics(data.economics);
                        break;
                    
                    // Security Events
                    case 'security_event':
                        this.updateSecurityStatus(data.security);
                        if (data.security.threatLevel === 'HIGH') {
                            this.activateCrisisMode();
                        }
                        break;
                    
                    // Technology Events
                    case 'technology_progress':
                        this.updateTechnologyProgress(data.technology);
                        if (data.technology.breakthrough) {
                            this.showNotification(\`Technology breakthrough: \${data.technology.name}\`, 'success');
                        }
                        break;
                    
                    // Military Events
                    case 'military_movement':
                        this.updateMilitaryStatus(data.military);
                        break;
                    
                    // Trade Events
                    case 'trade_update':
                        this.updateTradeMetrics(data.trade);
                        break;
                    
                    // City Events
                    case 'city_event':
                        this.updateCityMetrics(data.city);
                        if (data.city.eventType === 'founded') {
                            this.showNotification(\`New city founded: \${data.city.name}\`, 'success');
                        }
                        break;
                    
                    // Game Master Events
                    case 'character_message':
                        this.updateGameMasterMessage(data.message);
                        this.showNotification('Message from Game Master', 'info');
                        break;
                    
                    // Policy Events
                    case 'policy_change':
                        this.updatePolicyStatus(data.policy);
                        break;
                    
                    // Crisis Events
                    case 'crisis_event':
                        this.handleCrisisEvent(data.crisis);
                        this.activateCrisisMode();
                        break;
                    
                    // Achievement Events
                    case 'achievement_unlock':
                        this.showAchievement(data.achievement);
                        break;
                    
                    // News Events
                    case 'news_breaking':
                        this.addBreakingNews(data.news);
                        break;
                    
                    // Connection Events
                    case 'pong':
                        // Heartbeat response
                        this.lastHeartbeat = Date.now();
                        break;
                    
                    default:
                        console.log('📡 Unknown event type:', data.type);
                }
            }
            
            addNewWitterPost(post) {
                const feedContainer = document.getElementById('witterFeed');
                const newPost = document.createElement('div');
                newPost.className = 'witter-post slide-in';
                
                // Generate avatar URL using visual systems
                const avatarSeed = this.generateSeedFromName(post.author || 'anonymous');
                const avatarUrl = \`/api/visual-systems/generate/avatar?seed=\${avatarSeed}&type=portrait&category=character\`;
                
                newPost.innerHTML = \`
                    <div class="witter-post-header">
                        <div class="witter-avatar">
                            <img src="\${avatarUrl}" 
                                 alt="\${post.author}" 
                                 loading="lazy"
                                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMDk5Y2MiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAxMkM5LjIxIDEyIDcgOS43OSA3IDdTOS4yMSAyIDEyIDJTMTcgNC4yMSAxNyA3UzE0Ljc5IDEyIDEyIDEyWk0xMiAxNEMxNi40MiAxNCAyMCAxNS43OSAyMCAxOFYyMEg0VjE4QzQgMTUuNzkgNy41OCAxNCAxMiAxNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K'">
                        </div>
                        <div class="witter-author-info">
                            <div class="witter-author-name">\${post.author}</div>
                            <div class="witter-author-handle">@\${(post.author || '').toLowerCase().replace(/\\s+/g, '')}</div>
                            <div class="witter-timestamp">\${post.timestamp ? new Date(post.timestamp).toLocaleTimeString() : 'Just now'}</div>
                        </div>
                    </div>
                    <div class="witter-content">\${post.content}</div>
                    \${post.media ? \`
                        <div class="witter-media">
                            \${post.media.type === 'image' ? 
                                \`<img src="\${post.media.url}" alt="Post media" loading="lazy" onclick="this.requestFullscreen()">\` :
                                post.media.type === 'video' ?
                                \`<video src="\${post.media.url}" controls muted loop preload="metadata"></video>\` :
                                ''
                            }
                        </div>
                    \` : ''}
                    <div class="witter-meta">
                        <span class="witter-location">📍 \${post.location || 'Galactic Network'}</span>
                        <span class="witter-engagement">❤️ \${post.likes || 0} | 🔄 \${post.shares || 0} | 💬 \${post.comments || 0}</span>
                    </div>
                \`;
                
                // Add visual enhancement based on post type
                if (post.priority === 'urgent' || post.type === 'alert') {
                    newPost.classList.add('urgent-post');
                    newPost.style.borderLeft = '4px solid var(--danger-glow)';
                } else if (post.type === 'achievement') {
                    newPost.classList.add('achievement-post');
                    newPost.style.borderLeft = '4px solid var(--success-glow)';
                } else if (post.type === 'news') {
                    newPost.classList.add('news-post');
                    newPost.style.borderLeft = '4px solid var(--warning-glow)';
                }
                
                feedContainer.insertBefore(newPost, feedContainer.firstChild);
                
                // Remove old posts if too many
                const posts = feedContainer.querySelectorAll('.witter-post');
                if (posts.length > 10) {
                    posts[posts.length - 1].remove();
                }
            }
            
            // Visual Systems Integration Methods
            generateSeedFromName(name) {
                if (!name) return Math.floor(Math.random() * 1000000);
                let hash = 0;
                for (let i = 0; i < name.length; i++) {
                    const char = name.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32-bit integer
                }
                return Math.abs(hash);
            }
            
            async generateVisualContent(type, category, prompt, options = {}) {
                try {
                    const response = await fetch('/api/visual-systems/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type,
                            category,
                            prompt,
                            options: {
                                priority: 'HIGH',
                                qualityLevel: 'STANDARD',
                                ...options
                            }
                        })
                    });
                    
                    if (!response.ok) throw new Error(\`Visual generation failed: \${response.statusText}\`);
                    return await response.json();
                } catch (error) {
                    console.error('Visual content generation error:', error);
                    return null;
                }
            }
            
            async loadDynamicBackgrounds() {
                // Generate dynamic backgrounds for different sections
                const backgrounds = [
                    { id: 'command-center-bg', prompt: 'Futuristic command center with holographic displays', type: 'BACKGROUND' },
                    { id: 'galaxy-map-bg', prompt: 'Deep space with distant galaxies and nebulae', type: 'BACKGROUND' },
                    { id: 'witter-bg', prompt: 'Social network interface with floating data streams', type: 'UI_ELEMENT' }
                ];
                
                for (const bg of backgrounds) {
                    const result = await this.generateVisualContent(bg.type, 'UI', {
                        text: bg.prompt,
                        style: 'cinematic sci-fi interface',
                        mood: 'high-tech'
                    });
                    
                    if (result && result.success) {
                        const element = document.getElementById(bg.id);
                        if (element) {
                            element.style.backgroundImage = \`url(\${result.data.url})\`;
                            element.style.backgroundSize = 'cover';
                            element.style.backgroundPosition = 'center';
                        }
                    }
                }
            }
            
            setupResponsiveMenu() {
                // Add mobile menu toggles if needed
                // This would be implemented based on the responsive design requirements
            }
            
            formatNumber(num) {
                if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
                if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
                if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
                return num.toString();
            }
            
            formatCurrency(amount) {
                return '₵' + this.formatNumber(amount);
            }
            
            getSampleWitterPosts() {
                return [
                    {
                        author: "Admiral Zara Chen",
                        content: "Fleet patrol reports all quiet in the Outer Rim. Trade routes secure! 🚀",
                        timestamp: new Date(Date.now() - 300000),
                        likes: 23,
                        shares: 5
                    },
                    {
                        author: "Dr. Marcus Webb",
                        content: "Breakthrough in fusion technology! Energy output increased by 15%. The future is bright! ⚡",
                        timestamp: new Date(Date.now() - 600000),
                        likes: 45,
                        shares: 12
                    },
                    {
                        author: "Mayor Lisa Park",
                        content: "New Terra City's population just hit 2 million! Proud of our growing community 🏙️",
                        timestamp: new Date(Date.now() - 900000),
                        likes: 67,
                        shares: 8
                    },
                    {
                        author: "Captain Rex Torres",
                        content: "First contact protocols updated. Ready for whatever the galaxy throws at us! 👽",
                        timestamp: new Date(Date.now() - 1200000),
                        likes: 34,
                        shares: 15
                    }
                ];
            }
            
            getSampleMetrics() {
                return {
                    approval: 67,
                    approvalTrend: '↗️',
                    treasury: '2.4T ₵',
                    gdp: 2.1,
                    population: '340M',
                    cities: 47,
                    happiness: 72,
                    security: 87,
                    techLevel: 'Advanced',
                    military: '890K',
                    scientists: '2.1M',
                    tradeRoutes: 23,
                    research: 8
                };
            }
            
            getSampleAlerts() {
                return [
                    {
                        priority: 'urgent',
                        message: 'Pirate activity detected in Sector 7'
                    },
                    {
                        priority: 'important',
                        message: 'Trade negotiations with Centauri Alliance pending'
                    },
                    {
                        priority: 'info',
                        message: 'Research project completion in 2 days'
                    }
                ];
            }
            
            // === REAL-TIME EVENT HANDLERS ===
            
            updateWitterPost(postId, updates) {
                const post = document.querySelector(\`[data-post-id="\${postId}"]\`);
                if (post) {
                    if (updates.likes !== undefined) {
                        const likesSpan = post.querySelector('.post-likes');
                        if (likesSpan) likesSpan.textContent = updates.likes;
                    }
                    if (updates.shares !== undefined) {
                        const sharesSpan = post.querySelector('.post-shares');
                        if (sharesSpan) sharesSpan.textContent = updates.shares;
                    }
                }
            }
            
            addNewAlert(alert) {
                const alertsContainer = document.getElementById('liveAlerts');
                const newAlert = document.createElement('div');
                newAlert.className = \`alert-item alert-\${alert.priority} slide-in\`;
                newAlert.innerHTML = \`
                    <span>\${this.getAlertIcon(alert.priority)}</span>
                    <span>\${alert.message}</span>
                \`;
                
                alertsContainer.insertBefore(newAlert, alertsContainer.firstChild);
                
                // Update alert count
                const currentCount = parseInt(document.getElementById('alertCount').textContent.match(/\\d+/)?.[0] || '0');
                document.getElementById('alertCount').textContent = \`🔔 \${currentCount + 1} Alert\${currentCount + 1 !== 1 ? 's' : ''}\`;
            }
            
            removeAlert(alertId) {
                const alert = document.querySelector(\`[data-alert-id="\${alertId}"]\`);
                if (alert) {
                    alert.style.opacity = '0';
                    setTimeout(() => alert.remove(), 300);
                    
                    // Update alert count
                    const currentCount = parseInt(document.getElementById('alertCount').textContent.match(/\\d+/)?.[0] || '0');
                    const newCount = Math.max(0, currentCount - 1);
                    document.getElementById('alertCount').textContent = \`🔔 \${newCount} Alert\${newCount !== 1 ? 's' : ''}\`;
                }
            }
            
            updateSimulationStatus(simulation) {
                document.getElementById('simulationStatus').textContent = \`Simulation: \${simulation.status || 'RUNNING'}\`;
                document.getElementById('simulationTick').textContent = \`Tick: \${simulation.currentTick || '--'}\`;
                document.getElementById('simulationSpeed').textContent = \`Speed: \${simulation.speed || '--'}\`;
                document.getElementById('nextTick').textContent = \`Next: \${simulation.nextTick || '--'}\`;
            }
            
            updateAllMetrics(metrics) {
                if (metrics) {
                    this.updateSystemMetrics(metrics);
                    this.updatePerformanceStatus(metrics.performance || 98);
                }
            }
            
            updatePopulationMetrics(population) {
                if (population.total) {
                    document.getElementById('metricPopulation').innerHTML = \`\${this.formatNumber(population.total)}<span class="metric-trend trend-up">+\${population.growthRate || 0.8}%</span>\`;
                    document.getElementById('civPopulation').textContent = this.formatNumber(population.total);
                }
                
                if (population.happiness) {
                    document.getElementById('civHappiness').textContent = \`\${population.happiness}%\`;
                }
            }
            
            updateEconomicMetrics(economics) {
                if (economics.gdpGrowth) {
                    document.getElementById('gdpGrowth').textContent = \`+\${economics.gdpGrowth}%\`;
                    document.getElementById('metricGDP').innerHTML = \`+\${economics.gdpGrowth}%<span class="metric-trend trend-up">↗️</span>\`;
                }
                
                if (economics.treasury) {
                    document.getElementById('treasuryBalance').textContent = this.formatCurrency(economics.treasury);
                }
            }
            
            updateSecurityStatus(security) {
                if (security.overallSecurity) {
                    document.getElementById('metricSecurity').innerHTML = \`\${security.overallSecurity}%<span class="metric-trend trend-up">↗️</span>\`;
                    document.getElementById('civSecurity').textContent = \`\${security.overallSecurity}%\`;
                    document.getElementById('securityProgress').style.width = \`\${security.overallSecurity}%\`;
                }
            }
            
            updateTechnologyProgress(technology) {
                if (technology.level) {
                    document.getElementById('civTech').textContent = technology.level;
                    document.getElementById('metricTechnology').innerHTML = \`\${technology.level}<span class="metric-trend trend-up">↗️</span>\`;
                }
                
                if (technology.researchProjects) {
                    document.getElementById('statResearch').textContent = technology.researchProjects;
                }
            }
            
            updateMilitaryStatus(military) {
                if (military.totalForces) {
                    document.getElementById('statMilitary').textContent = this.formatNumber(military.totalForces);
                }
            }
            
            updateTradeMetrics(trade) {
                if (trade.activeRoutes) {
                    document.getElementById('statTradeRoutes').textContent = trade.activeRoutes;
                }
            }
            
            updateCityMetrics(city) {
                if (city.totalCities) {
                    document.getElementById('civCities').textContent = city.totalCities;
                }
            }
            
            updateGameMasterMessage(message) {
                const messageElement = document.getElementById('gameMasterMessage');
                messageElement.textContent = message.content || message.text;
                messageElement.classList.add('slide-in');
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    messageElement.classList.remove('slide-in');
                }, 300);
            }
            
            updatePolicyStatus(policy) {
                // Update policy-related metrics if displayed
                console.log('Policy update:', policy);
            }
            
            handleCrisisEvent(crisis) {
                this.addNewAlert({
                    priority: 'urgent',
                    message: \`CRISIS: \${crisis.title || crisis.message}\`
                });
                
                this.updateGameMasterMessage({
                    content: \`🚨 CRISIS ALERT: \${crisis.description || crisis.message}\`
                });
            }
            
            activateCrisisMode() {
                document.body.classList.add('crisis-mode');
                document.querySelector('.command-header').style.borderColor = 'var(--danger-glow)';
                
                // Auto-deactivate after 30 seconds unless another crisis occurs
                setTimeout(() => {
                    if (!document.querySelector('.alert-urgent')) {
                        this.deactivateCrisisMode();
                    }
                }, 30000);
            }
            
            deactivateCrisisMode() {
                document.body.classList.remove('crisis-mode');
                document.querySelector('.command-header').style.borderColor = 'var(--border-glow)';
            }
            
            showAchievement(achievement) {
                this.showNotification(\`🏆 Achievement Unlocked: \${achievement.title}\`, 'success');
            }
            
            addBreakingNews(news) {
                // Add to Witter feed as breaking news
                this.addNewWitterPost({
                    author: '📰 Galactic News Network',
                    content: \`🚨 BREAKING: \${news.headline}\`,
                    timestamp: new Date(),
                    likes: 0,
                    shares: 0
                });
            }
            
            showNotification(message, type = 'info') {
                // Create temporary notification
                const notification = document.createElement('div');
                notification.className = \`notification notification-\${type}\`;
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
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    font-size: 14px;
                    max-width: 300px;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                \`;
                
                if (type === 'urgent') {
                    notification.style.borderLeftColor = 'var(--danger-glow)';
                    notification.style.background = 'var(--danger-dark)';
                } else if (type === 'success') {
                    notification.style.borderLeftColor = 'var(--success-glow)';
                }
                
                document.body.appendChild(notification);
                
                // Animate in
                setTimeout(() => {
                    notification.style.opacity = '1';
                    notification.style.transform = 'translateX(0)';
                }, 100);
                
                // Auto-remove after 5 seconds
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => notification.remove(), 300);
                }, 5000);
            }
            
            flashAlertIndicator() {
                const alertButton = document.getElementById('alertCount');
                alertButton.style.animation = 'pulse 0.5s ease-in-out 3';
                setTimeout(() => {
                    alertButton.style.animation = '';
                }, 1500);
            }
            
            updatePerformanceStatus(performance) {
                document.getElementById('performanceStatus').textContent = \`Performance: \${performance}%\`;
            }
        }
        
        // Global functions for button actions
        function openWitterNetwork() {
            window.open('http://localhost:5173', '_blank');
        }
        
        function openGalaxyMap() {
            hud.switchSystem('galaxy-map');
        }
        
        function addressNation() {
            window.open('/demo/leader-communications', '_blank');
        }
        
        function dailyBriefing() {
            console.log('Opening daily briefing...');
            // Implement daily briefing functionality
        }
        
        function emergencyPowers() {
            console.log('Activating crisis center...');
            // Implement crisis center functionality
        }
        
        function toggleAlerts() {
            console.log('Toggling alerts panel...');
            // Implement alerts panel toggle
        }
        
        // Initialize HUD when page loads
        let hud;
        document.addEventListener('DOMContentLoaded', async () => {
            hud = new WittyGalaxyHUD();
            
            // Initialize visual systems after HUD is ready
            setTimeout(async () => {
                await hud.loadDynamicBackgrounds();
                console.log('🎨 Visual systems initialized');
            }, 2000);
        });
    </script>
</body>
</html>
    `;
}

module.exports = { getIntegratedWittyGalaxyHUD };
