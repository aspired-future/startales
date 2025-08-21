// Trade & Economics Screen - Market data and commerce management
function getTradeEconomicsScreen() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trade & Economics - Witty Galaxy</title>
    <style>
        :root {
            --primary-bg: #0a0a0a;
            --secondary-bg: #1a1a1a;
            --accent-bg: #2a2a2a;
            --primary-text: #ffffff;
            --secondary-text: #cccccc;
            --accent-text: #00ccff;
            --success-color: #00ff88;
            --warning-color: #ffaa00;
            --danger-color: #ff4444;
            --border-color: #333333;
            --glow-color: #00ccff;
            --success-glow: #00ff88;
            --warning-glow: #ffaa00;
            --danger-glow: #ff4444;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, var(--primary-bg) 0%, #1a1a2e 50%, #16213e 100%);
            color: var(--primary-text);
            min-height: 100vh;
            overflow-x: hidden;
        }

        .screen-container {
            display: flex;
            height: 100vh;
        }

        .sidebar {
            width: 250px;
            background: var(--secondary-bg);
            border-right: 1px solid var(--border-color);
            padding: 20px;
            overflow-y: auto;
        }

        .sidebar h2 {
            color: var(--accent-text);
            margin-bottom: 20px;
            font-size: 1.2em;
            text-align: center;
        }

        .nav-item {
            display: block;
            padding: 12px 16px;
            margin: 8px 0;
            background: var(--accent-bg);
            color: var(--primary-text);
            text-decoration: none;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .nav-item:hover {
            background: var(--glow-color);
            color: var(--primary-bg);
            box-shadow: 0 0 15px var(--glow-color);
            transform: translateX(5px);
        }

        .nav-item.active {
            background: var(--glow-color);
            color: var(--primary-bg);
            box-shadow: 0 0 10px var(--glow-color);
        }

        .main-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--border-color);
        }

        .header h1 {
            color: var(--accent-text);
            font-size: 2.5em;
            text-shadow: 0 0 10px var(--glow-color);
        }

        .back-button {
            padding: 10px 20px;
            background: var(--accent-bg);
            color: var(--primary-text);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .back-button:hover {
            background: var(--glow-color);
            color: var(--primary-bg);
            box-shadow: 0 0 10px var(--glow-color);
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .dashboard-card {
            background: var(--secondary-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }

        .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 204, 255, 0.2);
            border-color: var(--glow-color);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .card-title {
            color: var(--accent-text);
            font-size: 1.3em;
            font-weight: bold;
        }

        .card-value {
            font-size: 2em;
            font-weight: bold;
            margin: 10px 0;
        }

        .positive { color: var(--success-color); }
        .negative { color: var(--danger-color); }
        .neutral { color: var(--warning-color); }

        .market-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        .market-table th,
        .market-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }

        .market-table th {
            background: var(--accent-bg);
            color: var(--accent-text);
            font-weight: bold;
        }

        .market-table tr:hover {
            background: var(--accent-bg);
        }

        .trade-route {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            margin: 8px 0;
            background: var(--accent-bg);
            border-radius: 8px;
            border-left: 4px solid var(--success-color);
        }

        .route-info {
            flex: 1;
        }

        .route-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
        }

        .status-active { background: var(--success-color); color: var(--primary-bg); }
        .status-pending { background: var(--warning-color); color: var(--primary-bg); }
        .status-blocked { background: var(--danger-color); color: var(--primary-text); }

        .chart-container {
            height: 200px;
            background: var(--accent-bg);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 15px;
            position: relative;
            overflow: hidden;
        }

        .chart-placeholder {
            color: var(--secondary-text);
            font-style: italic;
        }

        .action-buttons {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .action-btn {
            padding: 10px 20px;
            background: var(--accent-bg);
            color: var(--primary-text);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }

        .action-btn:hover {
            background: var(--glow-color);
            color: var(--primary-bg);
            box-shadow: 0 0 10px var(--glow-color);
        }

        .action-btn.primary {
            background: var(--glow-color);
            color: var(--primary-bg);
        }

        .action-btn.success {
            background: var(--success-color);
            color: var(--primary-bg);
        }

        .action-btn.warning {
            background: var(--warning-color);
            color: var(--primary-bg);
        }

        .action-btn.danger {
            background: var(--danger-color);
            color: var(--primary-text);
        }

        @media (max-width: 768px) {
            .screen-container {
                flex-direction: column;
            }
            
            .sidebar {
                width: 100%;
                height: auto;
                order: 2;
            }
            
            .main-content {
                order: 1;
            }
            
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2em;
            }
        }

        .pulse {
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }

        .slide-in {
            animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
    <div class="screen-container">
        <nav class="sidebar">
            <h2>🏛️ Trade & Economics</h2>
            <a href="#" class="nav-item active" onclick="showSection('overview')">📊 Economic Overview</a>
            <a href="#" class="nav-item" onclick="showSection('markets')">📈 Galactic Markets</a>
            <a href="#" class="nav-item" onclick="showSection('trade-routes')">🚢 Trade Routes</a>
            <a href="#" class="nav-item" onclick="showSection('resources')">⚡ Resource Management</a>
            <a href="#" class="nav-item" onclick="showSection('corporations')">🏢 Corporations</a>
            <a href="#" class="nav-item" onclick="showSection('banking')">🏦 Galactic Banking</a>
            <a href="#" class="nav-item" onclick="showSection('taxation')">💰 Taxation & Revenue</a>
            <a href="#" class="nav-item" onclick="showSection('trade-agreements')">📋 Trade Agreements</a>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border-color);">
                <h3 style="color: var(--accent-text); margin-bottom: 15px;">Quick Actions</h3>
                <a href="#" class="nav-item" onclick="executeTradeAction('new-route')">🚀 New Trade Route</a>
                <a href="#" class="nav-item" onclick="executeTradeAction('market-analysis')">📊 Market Analysis</a>
                <a href="#" class="nav-item" onclick="executeTradeAction('emergency-trade')">🚨 Emergency Trade</a>
            </div>
        </nav>

        <main class="main-content">
            <div class="header">
                <h1>💰 Trade & Economics Command Center</h1>
                <a href="#" class="back-button" onclick="navigateToScreen('dashboard')">← Back to Dashboard</a>
            </div>

            <div id="overview-section" class="content-section">
                <div class="dashboard-grid">
                    <div class="dashboard-card slide-in">
                        <div class="card-header">
                            <span class="card-title">💎 Galactic GDP</span>
                            <span class="pulse">📈</span>
                        </div>
                        <div class="card-value positive">847.2T Credits</div>
                        <div style="color: var(--success-color);">↗ +12.4% from last quarter</div>
                        <div class="chart-container">
                            <div class="chart-placeholder">GDP Growth Chart</div>
                        </div>
                    </div>

                    <div class="dashboard-card slide-in">
                        <div class="card-header">
                            <span class="card-title">📊 Trade Volume</span>
                            <span class="pulse">🚢</span>
                        </div>
                        <div class="card-value neutral">2.1M Ships/Day</div>
                        <div style="color: var(--warning-color);">↔ +2.1% from last month</div>
                        <div class="chart-container">
                            <div class="chart-placeholder">Trade Volume Chart</div>
                        </div>
                    </div>

                    <div class="dashboard-card slide-in">
                        <div class="card-header">
                            <span class="card-title">💱 Exchange Rate</span>
                            <span class="pulse">💰</span>
                        </div>
                        <div class="card-value positive">1 GC = 1.247 UC</div>
                        <div style="color: var(--success-color);">↗ +0.8% vs Universal Credits</div>
                        <div class="chart-container">
                            <div class="chart-placeholder">Exchange Rate Chart</div>
                        </div>
                    </div>

                    <div class="dashboard-card slide-in">
                        <div class="card-header">
                            <span class="card-title">⚡ Resource Prices</span>
                            <span class="pulse">📦</span>
                        </div>
                        <div class="card-value neutral">Mixed Trends</div>
                        <div style="color: var(--secondary-text);">Energy ↗ +5%, Minerals ↘ -2%</div>
                        <table class="market-table">
                            <tr>
                                <th>Resource</th>
                                <th>Price</th>
                                <th>Change</th>
                            </tr>
                            <tr>
                                <td>⚡ Energy Crystals</td>
                                <td>1,247 GC/unit</td>
                                <td class="positive">+5.2%</td>
                            </tr>
                            <tr>
                                <td>⛏️ Rare Minerals</td>
                                <td>892 GC/unit</td>
                                <td class="negative">-2.1%</td>
                            </tr>
                            <tr>
                                <td>🌾 Food Supplies</td>
                                <td>156 GC/unit</td>
                                <td class="positive">+1.8%</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <div class="dashboard-card slide-in">
                        <div class="card-header">
                            <span class="card-title">🚢 Active Trade Routes</span>
                            <span class="pulse">🗺️</span>
                        </div>
                        <div class="trade-route">
                            <div class="route-info">
                                <strong>Terra Prime → Alpha Centauri</strong><br>
                                <small>Energy Crystals • 2.4M GC/day</small>
                            </div>
                            <div class="route-status status-active">ACTIVE</div>
                        </div>
                        <div class="trade-route">
                            <div class="route-info">
                                <strong>Kepler Station → Mars Colony</strong><br>
                                <small>Food Supplies • 890K GC/day</small>
                            </div>
                            <div class="route-status status-active">ACTIVE</div>
                        </div>
                        <div class="trade-route">
                            <div class="route-info">
                                <strong>Vega Mining → Jupiter Base</strong><br>
                                <small>Rare Minerals • 1.7M GC/day</small>
                            </div>
                            <div class="route-status status-pending">PENDING</div>
                        </div>
                        <div class="action-buttons">
                            <a href="#" class="action-btn primary" onclick="showSection('trade-routes')">Manage Routes</a>
                            <a href="#" class="action-btn success" onclick="executeTradeAction('new-route')">New Route</a>
                        </div>
                    </div>

                    <div class="dashboard-card slide-in">
                        <div class="card-header">
                            <span class="card-title">🏢 Top Corporations</span>
                            <span class="pulse">📊</span>
                        </div>
                        <table class="market-table">
                            <tr>
                                <th>Corporation</th>
                                <th>Market Cap</th>
                                <th>Sector</th>
                            </tr>
                            <tr>
                                <td>🚀 Stellar Dynamics</td>
                                <td>47.2T GC</td>
                                <td>Transport</td>
                            </tr>
                            <tr>
                                <td>⚡ Quantum Energy</td>
                                <td>38.9T GC</td>
                                <td>Energy</td>
                            </tr>
                            <tr>
                                <td>⛏️ Galactic Mining</td>
                                <td>29.1T GC</td>
                                <td>Resources</td>
                            </tr>
                            <tr>
                                <td>🌾 AgriSpace Corp</td>
                                <td>18.7T GC</td>
                                <td>Agriculture</td>
                            </tr>
                        </table>
                        <div class="action-buttons">
                            <a href="#" class="action-btn primary" onclick="showSection('corporations')">View All</a>
                            <a href="#" class="action-btn" onclick="executeTradeAction('corp-analysis')">Analysis</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Additional sections would be loaded dynamically -->
            <div id="markets-section" class="content-section" style="display: none;">
                <h2>📈 Galactic Markets</h2>
                <p>Market data and trading interfaces will be loaded here...</p>
            </div>

            <div id="trade-routes-section" class="content-section" style="display: none;">
                <h2>🚢 Trade Routes Management</h2>
                <p>Trade route management interface will be loaded here...</p>
            </div>
        </main>
    </div>

    <script>
        // Trade & Economics Screen JavaScript
        class TradeEconomicsScreen {
            constructor() {
                this.currentSection = 'overview';
                this.initializeScreen();
                this.startRealTimeUpdates();
            }

            initializeScreen() {
                console.log('🏛️ Trade & Economics Screen initialized');
                this.loadMarketData();
                this.setupEventListeners();
            }

            loadMarketData() {
                // Simulate loading market data
                console.log('📊 Loading market data...');
                
                // Update market prices with realistic fluctuations
                setTimeout(() => {
                    this.updateMarketPrices();
                }, 2000);
            }

            updateMarketPrices() {
                const resources = [
                    { name: 'Energy Crystals', basePrice: 1247, element: 'energy-price' },
                    { name: 'Rare Minerals', basePrice: 892, element: 'mineral-price' },
                    { name: 'Food Supplies', basePrice: 156, element: 'food-price' }
                ];

                resources.forEach(resource => {
                    const fluctuation = (Math.random() - 0.5) * 0.1; // ±5% fluctuation
                    const newPrice = Math.round(resource.basePrice * (1 + fluctuation));
                    const change = ((newPrice - resource.basePrice) / resource.basePrice * 100).toFixed(1);
                    
                    console.log('💰 ' + resource.name + ': ' + newPrice + ' GC (' + (change > 0 ? '+' : '') + change + '%)');
                });
            }

            startRealTimeUpdates() {
                // Simulate real-time market updates
                setInterval(() => {
                    this.updateTradeVolume();
                    this.updateExchangeRates();
                }, 30000); // Update every 30 seconds

                // Simulate trade route status updates
                setInterval(() => {
                    this.updateTradeRouteStatus();
                }, 45000); // Update every 45 seconds
            }

            updateTradeVolume() {
                const volumeElements = document.querySelectorAll('.card-value');
                if (volumeElements.length > 1) {
                    const baseVolume = 2.1;
                    const fluctuation = (Math.random() - 0.5) * 0.2; // ±10% fluctuation
                    const newVolume = (baseVolume * (1 + fluctuation)).toFixed(1);
                    console.log('🚢 Trade volume updated: ' + newVolume + 'M ships/day');
                }
            }

            updateExchangeRates() {
                const baseRate = 1.247;
                const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% fluctuation
                const newRate = (baseRate * (1 + fluctuation)).toFixed(3);
                console.log('💱 Exchange rate updated: 1 GC = ' + newRate + ' UC');
            }

            updateTradeRouteStatus() {
                const routes = document.querySelectorAll('.trade-route');
                routes.forEach(route => {
                    const status = route.querySelector('.route-status');
                    if (status && Math.random() < 0.1) { // 10% chance to change status
                        const statuses = ['ACTIVE', 'PENDING', 'MAINTENANCE'];
                        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                        status.textContent = randomStatus;
                        status.className = 'route-status status-' + randomStatus.toLowerCase();
                    }
                });
            }

            setupEventListeners() {
                // Add keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey) {
                        switch(e.key) {
                            case '1':
                                e.preventDefault();
                                this.showSection('overview');
                                break;
                            case '2':
                                e.preventDefault();
                                this.showSection('markets');
                                break;
                            case '3':
                                e.preventDefault();
                                this.showSection('trade-routes');
                                break;
                        }
                    }
                });
            }

            showSection(sectionName) {
                // Hide all sections
                const sections = document.querySelectorAll('.content-section');
                sections.forEach(section => section.style.display = 'none');

                // Show selected section
                const targetSection = document.getElementById(sectionName + '-section');
                if (targetSection) {
                    targetSection.style.display = 'block';
                }

                // Update navigation
                const navItems = document.querySelectorAll('.nav-item');
                navItems.forEach(item => item.classList.remove('active'));
                
                const activeNav = document.querySelector('[onclick*="' + sectionName + '"]');
                if (activeNav) {
                    activeNav.classList.add('active');
                }

                this.currentSection = sectionName;
                console.log('📊 Switched to section: ' + sectionName);
            }

            executeTradeAction(action) {
                console.log('🚀 Executing trade action: ' + action);
                
                switch(action) {
                    case 'new-route':
                        this.createNewTradeRoute();
                        break;
                    case 'market-analysis':
                        this.performMarketAnalysis();
                        break;
                    case 'emergency-trade':
                        this.initiateEmergencyTrade();
                        break;
                    case 'corp-analysis':
                        this.analyzeCorporations();
                        break;
                    default:
                        console.log('⚠️ Unknown action: ' + action);
                }
            }

            createNewTradeRoute() {
                console.log('🚀 Opening new trade route wizard...');
                alert('New Trade Route Wizard\\n\\nThis would open a detailed interface for creating new trade routes between civilizations.');
            }

            performMarketAnalysis() {
                console.log('📊 Performing market analysis...');
                alert('Market Analysis\\n\\nDetailed market trends and predictions would be displayed here.');
            }

            initiateEmergencyTrade() {
                console.log('🚨 Initiating emergency trade protocols...');
                alert('Emergency Trade\\n\\nRapid resource acquisition interface for crisis situations.');
            }

            analyzeCorporations() {
                console.log('🏢 Analyzing corporate performance...');
                alert('Corporate Analysis\\n\\nDetailed corporate performance metrics and investment opportunities.');
            }

            navigateToScreen(screenName) {
                console.log('🔄 Navigating to: ' + screenName);
                // This would integrate with the main screen navigation system
                if (window.parent && window.parent.screenSystem) {
                    window.parent.screenSystem.showScreen(screenName);
                } else {
                    // Fallback for standalone testing
                    alert('Navigation: Would return to ' + screenName + ' screen');
                }
            }
        }

        // Global functions for onclick handlers
        function showSection(sectionName) {
            if (window.tradeScreen) {
                window.tradeScreen.showSection(sectionName);
            }
        }

        function executeTradeAction(action) {
            if (window.tradeScreen) {
                window.tradeScreen.executeTradeAction(action);
            }
        }

        function navigateToScreen(screenName) {
            if (window.tradeScreen) {
                window.tradeScreen.navigateToScreen(screenName);
            }
        }

        // Initialize screen when page loads
        document.addEventListener('DOMContentLoaded', () => {
            window.tradeScreen = new TradeEconomicsScreen();
            console.log('💰 Trade & Economics Screen ready!');
        });
    </script>
</body>
</html>
    `;
}

module.exports = { getTradeEconomicsScreen };
