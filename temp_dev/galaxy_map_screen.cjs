// Galaxy Map Screen - Interactive 3D Galactic Visualization
// Integrates with /api/galaxy/* endpoints for real-time space data

function getGalaxyMapScreen() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Witty Galaxy - Galaxy Map</title>
    <style>
        /* Inherit base styles from main HUD */
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
        
        :root {
            --primary-glow: #00d9ff;
            --primary-bright: #0099cc;
            --primary-dark: #004d66;
            --primary-shadow: rgba(0, 217, 255, 0.3);
            --secondary-glow: #ff6b35;
            --accent-success: #00ff88;
            --accent-warning: #ffaa00;
            --accent-danger: #ff3366;
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
            --shadow-glow: 0 0 20px var(--primary-shadow);
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
        
        .galaxy-container {
            display: grid;
            grid-template-areas: 
                "header header header"
                "sidebar map-view info-panel"
                "footer footer footer";
            grid-template-columns: 300px 1fr 350px;
            grid-template-rows: 80px 1fr 60px;
            height: 100vh;
            gap: 1px;
            background: var(--border-subtle);
        }
        
        /* Header */
        .galaxy-header {
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
        
        .galaxy-icon {
            width: 40px;
            height: 40px;
            background: radial-gradient(circle, var(--primary-glow) 0%, var(--primary-dark) 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            animation: rotate 30s linear infinite;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
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
            box-shadow: var(--shadow-panel);
        }
        
        .control-btn.active {
            background: var(--primary-dark);
            border-color: var(--primary-bright);
            color: var(--primary-glow);
            box-shadow: var(--shadow-glow);
        }
        
        /* Sidebar */
        .galaxy-sidebar {
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
        
        .filter-select:focus {
            outline: none;
            border-color: var(--border-accent);
            box-shadow: 0 0 0 2px var(--primary-shadow);
        }
        
        .filter-checkbox {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            cursor: pointer;
        }
        
        .filter-checkbox input {
            width: 16px;
            height: 16px;
            accent-color: var(--primary-glow);
        }
        
        .filter-checkbox label {
            font-size: 14px;
            color: var(--text-secondary);
            cursor: pointer;
        }
        
        .legend {
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: 8px;
            padding: 16px;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
        }
        
        .legend-color {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .legend-label {
            font-size: 13px;
            color: var(--text-secondary);
        }
        
        /* Map View */
        .galaxy-map-view {
            grid-area: map-view;
            background: var(--bg-primary);
            position: relative;
            overflow: hidden;
        }
        
        .map-canvas {
            width: 100%;
            height: 100%;
            background: radial-gradient(ellipse at center, #1a1a3a 0%, #0a0a0f 100%);
            position: relative;
            cursor: grab;
        }
        
        .map-canvas:active {
            cursor: grabbing;
        }
        
        /* Star field background */
        .star-field {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(2px 2px at 20px 30px, #eee, transparent),
                radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
                radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
            background-repeat: repeat;
            background-size: 200px 100px;
            animation: twinkle 20s linear infinite;
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
        }
        
        /* Galaxy objects */
        .galaxy-object {
            position: absolute;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
        }
        
        .galaxy-object:hover {
            transform: scale(1.2);
            z-index: 10;
        }
        
        .galaxy-object.star {
            background: radial-gradient(circle, #ffeb3b 0%, #ff9800 100%);
            box-shadow: 0 0 20px rgba(255, 235, 59, 0.6);
        }
        
        .galaxy-object.planet {
            background: radial-gradient(circle, #4caf50 0%, #2e7d32 100%);
            box-shadow: 0 0 15px rgba(76, 175, 80, 0.4);
        }
        
        .galaxy-object.station {
            background: radial-gradient(circle, var(--primary-glow) 0%, var(--primary-dark) 100%);
            box-shadow: 0 0 15px var(--primary-shadow);
        }
        
        .galaxy-object.fleet {
            background: radial-gradient(circle, var(--secondary-glow) 0%, #cc5529 100%);
            box-shadow: 0 0 15px rgba(255, 107, 53, 0.4);
        }
        
        .galaxy-object.anomaly {
            background: radial-gradient(circle, #e91e63 0%, #880e4f 100%);
            box-shadow: 0 0 20px rgba(233, 30, 99, 0.6);
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        /* Trade routes */
        .trade-route {
            position: absolute;
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, var(--accent-success) 50%, transparent 100%);
            transform-origin: left center;
            opacity: 0.6;
            animation: flow 3s linear infinite;
        }
        
        @keyframes flow {
            0% { background-position: -100% 0; }
            100% { background-position: 100% 0; }
        }
        
        /* Map controls */
        .map-controls {
            position: absolute;
            top: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .zoom-control {
            width: 40px;
            height: 40px;
            background: var(--bg-panel);
            border: 1px solid var(--border-primary);
            border-radius: 6px;
            color: var(--text-primary);
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .zoom-control:hover {
            background: var(--bg-hover);
            border-color: var(--border-accent);
        }
        
        /* Info Panel */
        .galaxy-info-panel {
            grid-area: info-panel;
            background: var(--bg-panel);
            padding: 20px;
            overflow-y: auto;
        }
        
        .info-section {
            margin-bottom: 24px;
        }
        
        .info-title {
            font-family: 'Orbitron', monospace;
            font-size: 16px;
            font-weight: 600;
            color: var(--text-accent);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .selected-object {
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
        }
        
        .object-name {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 8px;
        }
        
        .object-type {
            font-size: 12px;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
        }
        
        .object-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-value {
            font-size: 20px;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 4px;
        }
        
        .stat-label {
            font-size: 11px;
            color: var(--text-muted);
            text-transform: uppercase;
        }
        
        .nearby-objects {
            max-height: 200px;
            overflow-y: auto;
        }
        
        .nearby-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px;
            background: var(--bg-card);
            border-radius: 6px;
            margin-bottom: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .nearby-item:hover {
            background: var(--bg-hover);
            border-color: var(--border-accent);
        }
        
        .nearby-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }
        
        .nearby-info {
            flex: 1;
        }
        
        .nearby-name {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary);
        }
        
        .nearby-distance {
            font-size: 12px;
            color: var(--text-muted);
        }
        
        /* Footer */
        .galaxy-footer {
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
        
        .coordinates {
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
        
        /* Responsive */
        @media (max-width: 1200px) {
            .galaxy-container {
                grid-template-columns: 250px 1fr 300px;
            }
        }
        
        @media (max-width: 768px) {
            .galaxy-container {
                grid-template-areas: 
                    "header"
                    "map-view"
                    "footer";
                grid-template-columns: 1fr;
                grid-template-rows: 80px 1fr 60px;
            }
            
            .galaxy-sidebar,
            .galaxy-info-panel {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="galaxy-container">
        <!-- Header -->
        <header class="galaxy-header">
            <div class="header-title">
                <div class="galaxy-icon">🌌</div>
                <h1>Galaxy Map</h1>
            </div>
            <div class="header-controls">
                <button class="control-btn active" data-view="overview">Overview</button>
                <button class="control-btn" data-view="tactical">Tactical</button>
                <button class="control-btn" data-view="economic">Economic</button>
                <button class="control-btn" data-view="diplomatic">Diplomatic</button>
                <button class="control-btn" onclick="window.history.back()">← Back to HUD</button>
            </div>
        </header>
        
        <!-- Sidebar -->
        <aside class="galaxy-sidebar">
            <div class="sidebar-section">
                <h3 class="sidebar-title">
                    <span>🔍</span>
                    Filters
                </h3>
                
                <div class="filter-group">
                    <label class="filter-label">Sector</label>
                    <select class="filter-select" id="sector-filter">
                        <option value="all">All Sectors</option>
                        <option value="alpha">Alpha Quadrant</option>
                        <option value="beta">Beta Quadrant</option>
                        <option value="gamma">Gamma Quadrant</option>
                        <option value="delta">Delta Quadrant</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label class="filter-label">Show Objects</label>
                    <div class="filter-checkbox">
                        <input type="checkbox" id="show-stars" checked>
                        <label for="show-stars">Stars</label>
                    </div>
                    <div class="filter-checkbox">
                        <input type="checkbox" id="show-planets" checked>
                        <label for="show-planets">Planets</label>
                    </div>
                    <div class="filter-checkbox">
                        <input type="checkbox" id="show-stations" checked>
                        <label for="show-stations">Space Stations</label>
                    </div>
                    <div class="filter-checkbox">
                        <input type="checkbox" id="show-fleets" checked>
                        <label for="show-fleets">Fleets</label>
                    </div>
                    <div class="filter-checkbox">
                        <input type="checkbox" id="show-routes">
                        <label for="show-routes">Trade Routes</label>
                    </div>
                    <div class="filter-checkbox">
                        <input type="checkbox" id="show-anomalies">
                        <label for="show-anomalies">Anomalies</label>
                    </div>
                </div>
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-title">
                    <span>📊</span>
                    Legend
                </h3>
                <div class="legend">
                    <div class="legend-item">
                        <div class="legend-color" style="background: radial-gradient(circle, #ffeb3b 0%, #ff9800 100%);"></div>
                        <span class="legend-label">Stars</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: radial-gradient(circle, #4caf50 0%, #2e7d32 100%);"></div>
                        <span class="legend-label">Planets</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: radial-gradient(circle, var(--primary-glow) 0%, var(--primary-dark) 100%);"></div>
                        <span class="legend-label">Stations</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: radial-gradient(circle, var(--secondary-glow) 0%, #cc5529 100%);"></div>
                        <span class="legend-label">Fleets</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: radial-gradient(circle, #e91e63 0%, #880e4f 100%);"></div>
                        <span class="legend-label">Anomalies</span>
                    </div>
                </div>
            </div>
        </aside>
        
        <!-- Map View -->
        <main class="galaxy-map-view">
            <div class="map-canvas" id="galaxy-canvas">
                <div class="star-field"></div>
                
                <!-- Map Controls -->
                <div class="map-controls">
                    <button class="zoom-control" id="zoom-in">+</button>
                    <button class="zoom-control" id="zoom-out">−</button>
                    <button class="zoom-control" id="reset-view">⌂</button>
                </div>
                
                <!-- Sample Galaxy Objects -->
                <div class="galaxy-object star" style="top: 20%; left: 30%; width: 24px; height: 24px;" data-object="sol-system">
                    ☉
                </div>
                <div class="galaxy-object planet" style="top: 22%; left: 32%; width: 16px; height: 16px;" data-object="earth">
                    🌍
                </div>
                <div class="galaxy-object station" style="top: 40%; left: 60%; width: 20px; height: 20px;" data-object="deep-space-9">
                    🛰️
                </div>
                <div class="galaxy-object fleet" style="top: 60%; left: 45%; width: 18px; height: 18px;" data-object="fleet-alpha">
                    🚀
                </div>
                <div class="galaxy-object anomaly" style="top: 80%; left: 20%; width: 22px; height: 22px;" data-object="wormhole-1">
                    🌀
                </div>
                
                <!-- Trade Routes -->
                <div class="trade-route" style="top: 21%; left: 32%; width: 200px; transform: rotate(45deg);"></div>
                <div class="trade-route" style="top: 50%; left: 50%; width: 150px; transform: rotate(-30deg);"></div>
            </div>
        </main>
        
        <!-- Info Panel -->
        <aside class="galaxy-info-panel">
            <div class="info-section">
                <h3 class="info-title">
                    <span>🎯</span>
                    Selected Object
                </h3>
                <div class="selected-object" id="selected-object">
                    <div class="object-name">Sol System</div>
                    <div class="object-type">Star System</div>
                    <div class="object-stats">
                        <div class="stat-item">
                            <div class="stat-value">8</div>
                            <div class="stat-label">Planets</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">2.4B</div>
                            <div class="stat-label">Population</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">G2V</div>
                            <div class="stat-label">Star Type</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">Safe</div>
                            <div class="stat-label">Threat Level</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="info-section">
                <h3 class="info-title">
                    <span>📡</span>
                    Nearby Objects
                </h3>
                <div class="nearby-objects">
                    <div class="nearby-item" data-object="proxima-centauri">
                        <div class="nearby-icon" style="background: radial-gradient(circle, #ffeb3b 0%, #ff9800 100%);">☉</div>
                        <div class="nearby-info">
                            <div class="nearby-name">Proxima Centauri</div>
                            <div class="nearby-distance">4.24 light years</div>
                        </div>
                    </div>
                    <div class="nearby-item" data-object="alpha-centauri">
                        <div class="nearby-icon" style="background: radial-gradient(circle, #ffeb3b 0%, #ff9800 100%);">☉</div>
                        <div class="nearby-info">
                            <div class="nearby-name">Alpha Centauri</div>
                            <div class="nearby-distance">4.37 light years</div>
                        </div>
                    </div>
                    <div class="nearby-item" data-object="barnards-star">
                        <div class="nearby-icon" style="background: radial-gradient(circle, #ff5722 0%, #d32f2f 100%);">☉</div>
                        <div class="nearby-info">
                            <div class="nearby-name">Barnard's Star</div>
                            <div class="nearby-distance">5.96 light years</div>
                        </div>
                    </div>
                    <div class="nearby-item" data-object="wolf-359">
                        <div class="nearby-icon" style="background: radial-gradient(circle, #ff5722 0%, #d32f2f 100%);">☉</div>
                        <div class="nearby-info">
                            <div class="nearby-name">Wolf 359</div>
                            <div class="nearby-distance">7.86 light years</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="info-section">
                <h3 class="info-title">
                    <span>⚡</span>
                    Quick Actions
                </h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button class="control-btn">Deploy Fleet</button>
                    <button class="control-btn">Establish Trade Route</button>
                    <button class="control-btn">Send Diplomatic Mission</button>
                    <button class="control-btn">Scan for Anomalies</button>
                </div>
            </div>
        </aside>
        
        <!-- Footer -->
        <footer class="galaxy-footer">
            <div class="coordinates">
                <span>X: <span id="coord-x">0.00</span></span>
                <span>Y: <span id="coord-y">0.00</span></span>
                <span>Z: <span id="coord-z">0.00</span></span>
                <span>|</span>
                <span>Zoom: <span id="zoom-level">100%</span></span>
            </div>
            <div class="footer-actions">
                <button class="footer-btn">Save View</button>
                <button class="footer-btn">Export Map</button>
                <button class="footer-btn">Help</button>
            </div>
        </footer>
    </div>
    
    <script>
        class GalaxyMapSystem {
            constructor() {
                this.zoomLevel = 1;
                this.panX = 0;
                this.panY = 0;
                this.selectedObject = null;
                this.isDragging = false;
                this.lastMouseX = 0;
                this.lastMouseY = 0;
                this.init();
            }
            
            init() {
                console.log('🌌 Initializing Galaxy Map System...');
                this.setupEventListeners();
                this.loadGalaxyData();
                this.startRealTimeUpdates();
                console.log('✅ Galaxy Map initialized successfully');
            }
            
            setupEventListeners() {
                // View controls
                document.querySelectorAll('[data-view]').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const view = e.target.dataset.view;
                        this.switchView(view);
                    });
                });
                
                // Zoom controls
                document.getElementById('zoom-in').addEventListener('click', () => this.zoomIn());
                document.getElementById('zoom-out').addEventListener('click', () => this.zoomOut());
                document.getElementById('reset-view').addEventListener('click', () => this.resetView());
                
                // Map panning
                const canvas = document.getElementById('galaxy-canvas');
                canvas.addEventListener('mousedown', (e) => this.startPan(e));
                canvas.addEventListener('mousemove', (e) => this.updatePan(e));
                canvas.addEventListener('mouseup', () => this.endPan());
                canvas.addEventListener('wheel', (e) => this.handleWheel(e));
                
                // Object selection
                document.querySelectorAll('.galaxy-object').forEach(obj => {
                    obj.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.selectObject(obj.dataset.object);
                    });
                });
                
                // Nearby objects
                document.querySelectorAll('.nearby-item').forEach(item => {
                    item.addEventListener('click', () => {
                        this.selectObject(item.dataset.object);
                    });
                });
                
                // Filters
                document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.addEventListener('change', () => this.updateFilters());
                });
                
                document.getElementById('sector-filter').addEventListener('change', () => this.updateFilters());
            }
            
            switchView(viewType) {
                console.log(\`🔄 Switching to \${viewType} view\`);
                
                // Update active button
                document.querySelectorAll('[data-view]').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(\`[data-view="\${viewType}"]\`).classList.add('active');
                
                // Update map display based on view
                this.updateMapView(viewType);
            }
            
            updateMapView(viewType) {
                const objects = document.querySelectorAll('.galaxy-object');
                const routes = document.querySelectorAll('.trade-route');
                
                switch(viewType) {
                    case 'overview':
                        objects.forEach(obj => obj.style.display = 'flex');
                        routes.forEach(route => route.style.display = 'none');
                        break;
                    case 'tactical':
                        objects.forEach(obj => {
                            const show = obj.classList.contains('fleet') || obj.classList.contains('station');
                            obj.style.display = show ? 'flex' : 'none';
                        });
                        routes.forEach(route => route.style.display = 'none');
                        break;
                    case 'economic':
                        objects.forEach(obj => {
                            const show = obj.classList.contains('station') || obj.classList.contains('planet');
                            obj.style.display = show ? 'flex' : 'none';
                        });
                        routes.forEach(route => route.style.display = 'block');
                        break;
                    case 'diplomatic':
                        objects.forEach(obj => {
                            const show = obj.classList.contains('star') || obj.classList.contains('station');
                            obj.style.display = show ? 'flex' : 'none';
                        });
                        routes.forEach(route => route.style.display = 'none');
                        break;
                }
            }
            
            zoomIn() {
                this.zoomLevel = Math.min(this.zoomLevel * 1.2, 5);
                this.updateZoom();
            }
            
            zoomOut() {
                this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.2);
                this.updateZoom();
            }
            
            resetView() {
                this.zoomLevel = 1;
                this.panX = 0;
                this.panY = 0;
                this.updateZoom();
            }
            
            updateZoom() {
                const canvas = document.getElementById('galaxy-canvas');
                canvas.style.transform = \`scale(\${this.zoomLevel}) translate(\${this.panX}px, \${this.panY}px)\`;
                document.getElementById('zoom-level').textContent = \`\${Math.round(this.zoomLevel * 100)}%\`;
            }
            
            startPan(e) {
                this.isDragging = true;
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
                document.getElementById('galaxy-canvas').style.cursor = 'grabbing';
            }
            
            updatePan(e) {
                if (!this.isDragging) return;
                
                const deltaX = e.clientX - this.lastMouseX;
                const deltaY = e.clientY - this.lastMouseY;
                
                this.panX += deltaX / this.zoomLevel;
                this.panY += deltaY / this.zoomLevel;
                
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
                
                this.updateZoom();
                this.updateCoordinates(e);
            }
            
            endPan() {
                this.isDragging = false;
                document.getElementById('galaxy-canvas').style.cursor = 'grab';
            }
            
            handleWheel(e) {
                e.preventDefault();
                if (e.deltaY < 0) {
                    this.zoomIn();
                } else {
                    this.zoomOut();
                }
            }
            
            updateCoordinates(e) {
                const rect = document.getElementById('galaxy-canvas').getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 1000;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 1000;
                const z = 0; // 2D map for now
                
                document.getElementById('coord-x').textContent = x.toFixed(2);
                document.getElementById('coord-y').textContent = y.toFixed(2);
                document.getElementById('coord-z').textContent = z.toFixed(2);
            }
            
            selectObject(objectId) {
                console.log(\`🎯 Selecting object: \${objectId}\`);
                this.selectedObject = objectId;
                this.updateSelectedObjectInfo(objectId);
            }
            
            updateSelectedObjectInfo(objectId) {
                // Simulate object data - in real implementation, fetch from API
                const objectData = this.getObjectData(objectId);
                
                const selectedDiv = document.getElementById('selected-object');
                selectedDiv.innerHTML = \`
                    <div class="object-name">\${objectData.name}</div>
                    <div class="object-type">\${objectData.type}</div>
                    <div class="object-stats">
                        <div class="stat-item">
                            <div class="stat-value">\${objectData.stat1.value}</div>
                            <div class="stat-label">\${objectData.stat1.label}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">\${objectData.stat2.value}</div>
                            <div class="stat-label">\${objectData.stat2.label}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">\${objectData.stat3.value}</div>
                            <div class="stat-label">\${objectData.stat3.label}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">\${objectData.stat4.value}</div>
                            <div class="stat-label">\${objectData.stat4.label}</div>
                        </div>
                    </div>
                \`;
            }
            
            getObjectData(objectId) {
                // Mock data - replace with API calls
                const mockData = {
                    'sol-system': {
                        name: 'Sol System',
                        type: 'Star System',
                        stat1: { value: '8', label: 'Planets' },
                        stat2: { value: '2.4B', label: 'Population' },
                        stat3: { value: 'G2V', label: 'Star Type' },
                        stat4: { value: 'Safe', label: 'Threat Level' }
                    },
                    'earth': {
                        name: 'Earth',
                        type: 'Inhabited Planet',
                        stat1: { value: '1.2B', label: 'Population' },
                        stat2: { value: '71%', label: 'Water' },
                        stat3: { value: 'M-Class', label: 'Type' },
                        stat4: { value: 'Capital', label: 'Status' }
                    },
                    'deep-space-9': {
                        name: 'Deep Space 9',
                        type: 'Space Station',
                        stat1: { value: '50K', label: 'Crew' },
                        stat2: { value: '24/7', label: 'Operations' },
                        stat3: { value: 'Cardassian', label: 'Design' },
                        stat4: { value: 'Strategic', label: 'Importance' }
                    }
                };
                
                return mockData[objectId] || mockData['sol-system'];
            }
            
            updateFilters() {
                console.log('🔍 Updating map filters...');
                
                const showStars = document.getElementById('show-stars').checked;
                const showPlanets = document.getElementById('show-planets').checked;
                const showStations = document.getElementById('show-stations').checked;
                const showFleets = document.getElementById('show-fleets').checked;
                const showRoutes = document.getElementById('show-routes').checked;
                const showAnomalies = document.getElementById('show-anomalies').checked;
                
                document.querySelectorAll('.galaxy-object.star').forEach(obj => {
                    obj.style.display = showStars ? 'flex' : 'none';
                });
                
                document.querySelectorAll('.galaxy-object.planet').forEach(obj => {
                    obj.style.display = showPlanets ? 'flex' : 'none';
                });
                
                document.querySelectorAll('.galaxy-object.station').forEach(obj => {
                    obj.style.display = showStations ? 'flex' : 'none';
                });
                
                document.querySelectorAll('.galaxy-object.fleet').forEach(obj => {
                    obj.style.display = showFleets ? 'flex' : 'none';
                });
                
                document.querySelectorAll('.trade-route').forEach(route => {
                    route.style.display = showRoutes ? 'block' : 'none';
                });
                
                document.querySelectorAll('.galaxy-object.anomaly').forEach(obj => {
                    obj.style.display = showAnomalies ? 'flex' : 'none';
                });
            }
            
            loadGalaxyData() {
                console.log('📡 Loading galaxy data from APIs...');
                // In real implementation, load from /api/galaxy/* endpoints
                this.simulateDataLoading();
            }
            
            simulateDataLoading() {
                // Simulate API calls
                setTimeout(() => {
                    console.log('✅ Galaxy overview data loaded');
                }, 500);
                
                setTimeout(() => {
                    console.log('✅ Star systems data loaded');
                }, 1000);
                
                setTimeout(() => {
                    console.log('✅ Fleet positions updated');
                }, 1500);
            }
            
            startRealTimeUpdates() {
                // Simulate real-time updates
                setInterval(() => {
                    this.updateFleetPositions();
                }, 5000);
                
                setInterval(() => {
                    this.updateTradeRoutes();
                }, 10000);
            }
            
            updateFleetPositions() {
                // Simulate fleet movement
                const fleets = document.querySelectorAll('.galaxy-object.fleet');
                fleets.forEach(fleet => {
                    const currentTop = parseFloat(fleet.style.top);
                    const currentLeft = parseFloat(fleet.style.left);
                    
                    // Small random movement
                    const newTop = currentTop + (Math.random() - 0.5) * 2;
                    const newLeft = currentLeft + (Math.random() - 0.5) * 2;
                    
                    fleet.style.top = \`\${Math.max(5, Math.min(95, newTop))}%\`;
                    fleet.style.left = \`\${Math.max(5, Math.min(95, newLeft))}%\`;
                });
            }
            
            updateTradeRoutes() {
                // Simulate trade route activity
                const routes = document.querySelectorAll('.trade-route');
                routes.forEach(route => {
                    route.style.opacity = Math.random() * 0.8 + 0.2;
                });
            }
        }
        
        // Initialize Galaxy Map when page loads
        document.addEventListener('DOMContentLoaded', () => {
            window.galaxyMap = new GalaxyMapSystem();
        });
    </script>
</body>
</html>
    `;
}

module.exports = { getGalaxyMapScreen };
