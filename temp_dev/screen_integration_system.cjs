// Screen Integration System - Manages all Witty Galaxy HUD screens
// Provides unified navigation and screen management

function getScreenIntegrationSystem() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Witty Galaxy - Complete HUD System</title>
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
            overflow: hidden;
            height: 100vh;
        }
        
        .screen-container {
            display: grid;
            grid-template-areas: 
                "header header"
                "nav content";
            grid-template-columns: 300px 1fr;
            grid-template-rows: 80px 1fr;
            height: 100vh;
            gap: 1px;
            background: var(--border-subtle);
        }
        
        /* Header */
        .system-header {
            grid-area: header;
            background: var(--bg-panel);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            border-bottom: 2px solid var(--border-accent);
            box-shadow: var(--shadow-panel);
        }
        
        .header-logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .header-logo h1 {
            font-family: 'Orbitron', monospace;
            font-size: 24px;
            font-weight: 900;
            color: var(--primary-glow);
            text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
        }
        
        .galaxy-icon {
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
        
        .header-info {
            display: flex;
            align-items: center;
            gap: 20px;
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .current-screen {
            font-weight: 600;
            color: var(--text-accent);
        }
        
        /* Navigation */
        .system-nav {
            grid-area: nav;
            background: var(--bg-panel);
            padding: 20px;
            overflow-y: auto;
        }
        
        .nav-section {
            margin-bottom: 24px;
        }
        
        .nav-title {
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
        
        .nav-badge {
            background: var(--accent-danger);
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 10px;
            margin-left: auto;
        }
        
        /* Content Area */
        .screen-content {
            grid-area: content;
            background: var(--bg-secondary);
            position: relative;
            overflow: hidden;
        }
        
        .screen-frame {
            width: 100%;
            height: 100%;
            border: none;
            background: var(--bg-secondary);
        }
        
        .loading-screen {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-secondary);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid var(--border-primary);
            border-top-color: var(--primary-glow);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .loading-text {
            font-size: 18px;
            color: var(--text-secondary);
            margin-bottom: 8px;
        }
        
        .loading-subtext {
            font-size: 14px;
            color: var(--text-muted);
        }
        
        /* Screen Transition Effects */
        .screen-transition {
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.5s ease;
        }
        
        .screen-transition.active {
            opacity: 1;
            transform: translateX(0);
        }
        
        /* Status Indicators */
        .status-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--bg-primary);
            z-index: 100;
        }
        
        .status-progress {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-glow) 0%, var(--accent-success) 100%);
            width: 0%;
            transition: width 0.3s ease;
        }
        
        /* Responsive Design */
        @media (max-width: 1200px) {
            .screen-container {
                grid-template-columns: 250px 1fr;
            }
        }
        
        @media (max-width: 768px) {
            .screen-container {
                grid-template-areas: 
                    "header"
                    "content";
                grid-template-columns: 1fr;
                grid-template-rows: 80px 1fr;
            }
            
            .system-nav {
                display: none;
            }
            
            .header-info {
                display: none;
            }
        }
        
        /* Notification System */
        .notification {
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
        }
        
        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }
        
        .notification.success { border-left-color: var(--accent-success); }
        .notification.warning { border-left-color: var(--accent-warning); }
        .notification.error { border-left-color: var(--accent-danger); }
    </style>
</head>
<body>
    <div class="screen-container">
        <!-- Header -->
        <header class="system-header">
            <div class="header-logo">
                <div class="galaxy-icon">🌌</div>
                <h1>WITTY GALAXY</h1>
            </div>
            <div class="header-info">
                <span>Current Screen: <span class="current-screen" id="current-screen">Dashboard</span></span>
                <span>|</span>
                <span>Stardate: 2387.156</span>
                <span>|</span>
                <span>Status: <span style="color: var(--accent-success);">Online</span></span>
            </div>
        </header>
        
        <!-- Navigation -->
        <nav class="system-nav">
            <div class="nav-section">
                <h3 class="nav-title">Command</h3>
                <div class="nav-item active" data-screen="dashboard" data-url="main_hud_screen.cjs">
                    <div class="nav-icon">🏠</div>
                    <span>Dashboard</span>
                </div>
                <div class="nav-item" data-screen="galaxy-map" data-url="galaxy_map_screen.cjs">
                    <div class="nav-icon">🗺️</div>
                    <span>Galaxy Map</span>
                </div>
                <div class="nav-item" data-screen="witter" data-url="witter_social_screen.cjs">
                    <div class="nav-icon">💬</div>
                    <span>Witter Network</span>
                    <div class="nav-badge">3</div>
                </div>
            </div>
            
            <div class="nav-section">
                <h3 class="nav-title">Civilization</h3>
                <div class="nav-item" data-screen="demographics" data-url="demographics_population_screen.cjs">
                    <div class="nav-icon">👥</div>
                    <span>Demographics</span>
                </div>
                <div class="nav-item" data-screen="cities" data-url="#cities">
                    <div class="nav-icon">🏙️</div>
                    <span>Cities</span>
                </div>
                <div class="nav-item" data-screen="trade" data-url="#trade">
                    <div class="nav-icon">💰</div>
                    <span>Trade & Economy</span>
                </div>
                <div class="nav-item" data-screen="migration" data-url="#migration">
                    <div class="nav-icon">🏠</div>
                    <span>Migration</span>
                </div>
            </div>
            
            <div class="nav-section">
                <h3 class="nav-title">Government</h3>
                <div class="nav-item" data-screen="cabinet" data-url="#cabinet">
                    <div class="nav-icon">🏛️</div>
                    <span>Cabinet</span>
                </div>
                <div class="nav-item" data-screen="military" data-url="#military">
                    <div class="nav-icon">⚔️</div>
                    <span>Military</span>
                </div>
                <div class="nav-item" data-screen="intelligence" data-url="#intelligence">
                    <div class="nav-icon">🕵️</div>
                    <span>Intelligence</span>
                    <div class="nav-badge">!</div>
                </div>
                <div class="nav-item" data-screen="policies" data-url="#policies">
                    <div class="nav-icon">📋</div>
                    <span>Policies</span>
                </div>
            </div>
            
            <div class="nav-section">
                <h3 class="nav-title">Systems</h3>
                <div class="nav-item" data-screen="technology" data-url="#technology">
                    <div class="nav-icon">🔬</div>
                    <span>Technology</span>
                </div>
                <div class="nav-item" data-screen="news" data-url="#news">
                    <div class="nav-icon">📰</div>
                    <span>News & Media</span>
                </div>
                <div class="nav-item" data-screen="characters" data-url="#characters">
                    <div class="nav-icon">👤</div>
                    <span>Characters</span>
                </div>
                <div class="nav-item" data-screen="settings" data-url="#settings">
                    <div class="nav-icon">⚙️</div>
                    <span>Settings</span>
                </div>
            </div>
        </nav>
        
        <!-- Content Area -->
        <main class="screen-content">
            <div class="loading-screen" id="loading-screen">
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading Screen...</div>
                <div class="loading-subtext">Initializing systems</div>
            </div>
            
            <iframe class="screen-frame screen-transition" id="screen-frame" src=""></iframe>
            
            <div class="status-bar">
                <div class="status-progress" id="status-progress"></div>
            </div>
        </main>
    </div>
    
    <script>
        class ScreenIntegrationSystem {
            constructor() {
                this.currentScreen = 'dashboard';
                this.screens = new Map();
                this.loadingTimeout = null;
                this.init();
            }
            
            init() {
                console.log('🚀 Initializing Screen Integration System...');
                this.setupEventListeners();
                this.registerScreens();
                this.loadInitialScreen();
                console.log('✅ Screen Integration System initialized');
            }
            
            setupEventListeners() {
                // Navigation items
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        const screenName = item.dataset.screen;
                        const screenUrl = item.dataset.url;
                        
                        if (screenUrl && !screenUrl.startsWith('#')) {
                            this.switchScreen(screenName, screenUrl);
                        } else {
                            this.showComingSoon(screenName);
                        }
                    });
                });
                
                // Screen frame load events
                const screenFrame = document.getElementById('screen-frame');
                screenFrame.addEventListener('load', () => {
                    this.hideLoading();
                });
                
                screenFrame.addEventListener('error', () => {
                    this.showError('Failed to load screen');
                });
            }
            
            registerScreens() {
                this.screens.set('dashboard', {
                    name: 'Command Dashboard',
                    url: 'main_hud_screen.cjs',
                    description: 'Central command and control interface'
                });
                
                this.screens.set('galaxy-map', {
                    name: 'Galaxy Map',
                    url: 'galaxy_map_screen.cjs',
                    description: 'Interactive galactic visualization'
                });
                
                this.screens.set('witter', {
                    name: 'Witter Network',
                    url: 'witter_social_screen.cjs',
                    description: 'Galactic social media platform'
                });
                
                this.screens.set('demographics', {
                    name: 'Demographics & Population',
                    url: 'demographics_population_screen.cjs',
                    description: 'Population analytics and citizen management'
                });
                
                // Add more screens as they're implemented
                console.log(\`📋 Registered \${this.screens.size} screens\`);
            }
            
            switchScreen(screenName, screenUrl) {
                if (this.currentScreen === screenName) return;
                
                console.log(\`🔄 Switching to \${screenName} screen\`);
                
                // Update navigation
                this.updateNavigation(screenName);
                
                // Show loading
                this.showLoading(screenName);
                
                // Load screen
                this.loadScreen(screenName, screenUrl);
                
                // Update current screen
                this.currentScreen = screenName;
                document.getElementById('current-screen').textContent = 
                    this.screens.get(screenName)?.name || screenName;
            }
            
            updateNavigation(activeScreen) {
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                const activeItem = document.querySelector(\`[data-screen="\${activeScreen}"]\`);
                if (activeItem) {
                    activeItem.classList.add('active');
                }
            }
            
            showLoading(screenName) {
                const loadingScreen = document.getElementById('loading-screen');
                const screenFrame = document.getElementById('screen-frame');
                
                loadingScreen.style.display = 'flex';
                loadingScreen.querySelector('.loading-text').textContent = \`Loading \${screenName}...\`;
                loadingScreen.querySelector('.loading-subtext').textContent = 'Initializing systems';
                
                screenFrame.classList.remove('active');
                
                // Update progress bar
                this.updateProgress(0);
                this.animateProgress();
            }
            
            hideLoading() {
                const loadingScreen = document.getElementById('loading-screen');
                const screenFrame = document.getElementById('screen-frame');
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    screenFrame.classList.add('active');
                    this.updateProgress(100);
                }, 500);
                
                if (this.loadingTimeout) {
                    clearTimeout(this.loadingTimeout);
                }
            }
            
            loadScreen(screenName, screenUrl) {
                const screenFrame = document.getElementById('screen-frame');
                
                // Convert .cjs files to HTML by loading them as modules
                if (screenUrl.endsWith('.cjs')) {
                    this.loadCJSScreen(screenUrl);
                } else {
                    screenFrame.src = screenUrl;
                }
            }
            
            async loadCJSScreen(cjsFile) {
                try {
                    // For demo purposes, create a data URL with the screen content
                    const response = await fetch(cjsFile);
                    if (!response.ok) {
                        throw new Error(\`Failed to load \${cjsFile}\`);
                    }
                    
                    const moduleText = await response.text();
                    
                    // Extract the HTML content from the module
                    // This is a simplified approach - in production, you'd use proper module loading
                    const htmlMatch = moduleText.match(/return \`([\\s\\S]*?)\`;/);
                    if (htmlMatch) {
                        const htmlContent = htmlMatch[1];
                        const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
                        document.getElementById('screen-frame').src = dataUrl;
                    } else {
                        throw new Error('Could not extract HTML content');
                    }
                } catch (error) {
                    console.error('Error loading CJS screen:', error);
                    this.showError(\`Failed to load screen: \${error.message}\`);
                }
            }
            
            loadInitialScreen() {
                // Load the dashboard by default
                const dashboardUrl = this.screens.get('dashboard').url;
                this.loadScreen('dashboard', dashboardUrl);
            }
            
            animateProgress() {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 15;
                    if (progress >= 90) {
                        progress = 90;
                        clearInterval(interval);
                    }
                    this.updateProgress(progress);
                }, 100);
                
                this.loadingTimeout = setTimeout(() => {
                    clearInterval(interval);
                    this.updateProgress(100);
                }, 3000);
            }
            
            updateProgress(percentage) {
                const progressBar = document.getElementById('status-progress');
                progressBar.style.width = \`\${percentage}%\`;
            }
            
            showComingSoon(screenName) {
                this.showNotification(\`\${screenName} screen coming soon!\`, 'info');
            }
            
            showError(message) {
                this.hideLoading();
                this.showNotification(message, 'error');
                
                // Show error in frame
                const errorHtml = \`
                    <html>
                    <head>
                        <style>
                            body { 
                                font-family: 'Rajdhani', sans-serif; 
                                background: #1a1a2e; 
                                color: #e0e6ed; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center; 
                                height: 100vh; 
                                margin: 0;
                                text-align: center;
                            }
                            .error-container {
                                padding: 40px;
                                border: 1px solid #ff3366;
                                border-radius: 12px;
                                background: #16213e;
                            }
                            h1 { color: #ff3366; margin-bottom: 16px; }
                            p { color: #b8c5d1; margin-bottom: 20px; }
                            button {
                                padding: 10px 20px;
                                background: #00d9ff;
                                border: none;
                                border-radius: 6px;
                                color: white;
                                cursor: pointer;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="error-container">
                            <h1>⚠️ Screen Load Error</h1>
                            <p>\${message}</p>
                            <button onclick="window.parent.location.reload()">Reload System</button>
                        </div>
                    </body>
                    </html>
                \`;
                
                const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(errorHtml);
                document.getElementById('screen-frame').src = dataUrl;
            }
            
            showNotification(message, type = 'info') {
                const notification = document.createElement('div');
                notification.className = \`notification \${type}\`;
                notification.textContent = message;
                
                document.body.appendChild(notification);
                
                // Show notification
                setTimeout(() => {
                    notification.classList.add('show');
                }, 100);
                
                // Hide notification
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                }, 4000);
            }
            
            // Public API for screens to communicate with the system
            getScreenAPI() {
                return {
                    switchScreen: (screenName, screenUrl) => this.switchScreen(screenName, screenUrl),
                    showNotification: (message, type) => this.showNotification(message, type),
                    getCurrentScreen: () => this.currentScreen,
                    getScreens: () => Array.from(this.screens.keys())
                };
            }
        }
        
        // Initialize the system
        document.addEventListener('DOMContentLoaded', () => {
            window.screenSystem = new ScreenIntegrationSystem();
            
            // Make API available globally for screens to use
            window.HUD_API = window.screenSystem.getScreenAPI();
        });
        
        // Handle messages from child frames
        window.addEventListener('message', (event) => {
            if (event.data.type === 'HUD_NOTIFICATION') {
                window.screenSystem.showNotification(event.data.message, event.data.level);
            } else if (event.data.type === 'HUD_NAVIGATE') {
                window.screenSystem.switchScreen(event.data.screen, event.data.url);
            }
        });
    </script>
</body>
</html>
    `;
}

module.exports = { getScreenIntegrationSystem };
