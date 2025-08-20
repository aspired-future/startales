// Galaxy Map Demo Page
// Interactive 3D galaxy visualization with zoom levels and layers

function getGalaxyMapDemo() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galaxy Map - Startales Demo</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            overflow: hidden;
        }

        .galaxy-container {
            position: relative;
            width: 100vw;
            height: 100vh;
        }

        #galaxy-canvas {
            display: block;
            width: 100%;
            height: 100%;
        }

        /* UI Overlay */
        .ui-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
        }

        /* Header Controls */
        .header-controls {
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            pointer-events: auto;
        }

        .galaxy-title {
            font-size: 24px;
            font-weight: bold;
            color: #4A90E2;
            text-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
        }

        .zoom-controls {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .zoom-level {
            background: rgba(0, 0, 0, 0.8);
            padding: 8px 16px;
            border-radius: 20px;
            border: 1px solid #4A90E2;
            font-size: 14px;
            color: #4A90E2;
        }

        .zoom-btn {
            background: rgba(74, 144, 226, 0.2);
            border: 1px solid #4A90E2;
            color: #4A90E2;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .zoom-btn:hover {
            background: rgba(74, 144, 226, 0.4);
            box-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
        }

        /* Layer Controls */
        .layer-controls {
            position: absolute;
            top: 80px;
            left: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #333;
            border-radius: 8px;
            padding: 15px;
            min-width: 250px;
            pointer-events: auto;
        }

        .layer-controls h3 {
            margin-bottom: 15px;
            color: #4A90E2;
            font-size: 16px;
        }

        .layer-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding: 5px 0;
        }

        .layer-checkbox {
            margin-right: 10px;
        }

        .layer-opacity {
            width: 80px;
            margin-left: 10px;
        }

        .layer-label {
            flex: 1;
            font-size: 14px;
        }

        /* Detail Panels */
        .detail-panel {
            position: absolute;
            top: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.95);
            border: 1px solid #4A90E2;
            border-radius: 8px;
            min-width: 350px;
            max-width: 500px;
            max-height: 80vh;
            overflow: hidden;
            pointer-events: auto;
            display: none;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .detail-panel.visible {
            display: block;
        }

        .detail-panel-header {
            background: linear-gradient(135deg, #4A90E2, #357ABD);
            padding: 15px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .detail-panel-title {
            color: white;
            font-size: 18px;
            font-weight: bold;
            margin: 0;
        }

        .detail-panel-subtitle {
            color: rgba(255, 255, 255, 0.8);
            font-size: 12px;
            margin: 2px 0 0 0;
        }

        .detail-panel-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
            border-radius: 3px;
        }

        .detail-panel-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .detail-panel-content {
            padding: 0;
            max-height: calc(80vh - 80px);
            overflow-y: auto;
        }

        .detail-panel-tabs {
            display: flex;
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid #333;
        }

        .detail-panel-tab {
            flex: 1;
            padding: 10px 15px;
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            font-size: 13px;
            border-bottom: 2px solid transparent;
            transition: all 0.3s ease;
        }

        .detail-panel-tab:hover {
            color: #4A90E2;
            background: rgba(74, 144, 226, 0.1);
        }

        .detail-panel-tab.active {
            color: #4A90E2;
            border-bottom-color: #4A90E2;
            background: rgba(74, 144, 226, 0.1);
        }

        .detail-panel-tab-content {
            padding: 20px;
            display: none;
        }

        .detail-panel-tab-content.active {
            display: block;
        }

        .detail-section {
            margin-bottom: 20px;
        }

        .detail-section-title {
            color: #4A90E2;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #333;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-label {
            color: #cccccc;
            font-size: 13px;
            flex: 1;
        }

        .detail-value {
            color: white;
            font-size: 13px;
            font-weight: bold;
            text-align: right;
            flex: 1;
        }

        .detail-progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            margin: 5px 0;
        }

        .detail-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4A90E2, #2ECC71);
            transition: width 0.3s ease;
        }

        .detail-chart {
            width: 100%;
            height: 120px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            margin: 10px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #888;
            font-size: 12px;
        }

        .detail-actions {
            padding: 15px 20px;
            border-top: 1px solid #333;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .detail-action-btn {
            background: linear-gradient(135deg, #4A90E2, #357ABD);
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s ease;
        }

        .detail-action-btn:hover {
            background: linear-gradient(135deg, #357ABD, #2E5A87);
            transform: translateY(-1px);
        }

        .detail-action-btn.secondary {
            background: linear-gradient(135deg, #666, #555);
        }

        .detail-action-btn.secondary:hover {
            background: linear-gradient(135deg, #777, #666);
        }

        .detail-status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
        }

        .status-active { background: #2ECC71; }
        .status-inactive { background: #E74C3C; }
        .status-warning { background: #F39C12; }
        .status-neutral { background: #95A5A6; }

        .info-section {
            margin-bottom: 15px;
        }

        .info-section h4 {
            color: #E74C3C;
            margin-bottom: 5px;
            font-size: 14px;
        }

        .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
            font-size: 13px;
        }

        .info-value {
            color: #2ECC71;
            font-weight: bold;
        }

        /* Search Panel */
        .search-panel {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            pointer-events: auto;
        }

        .search-input {
            flex: 1;
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid #4A90E2;
            color: #ffffff;
            padding: 10px 15px;
            border-radius: 25px;
            font-size: 14px;
        }

        .search-input:focus {
            outline: none;
            box-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
        }

        .search-btn {
            background: #4A90E2;
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .search-btn:hover {
            background: #357ABD;
            box-shadow: 0 0 15px rgba(74, 144, 226, 0.5);
        }

        /* Statistics Panel */
        .stats-panel {
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #333;
            border-radius: 8px;
            padding: 15px;
            min-width: 200px;
            pointer-events: auto;
        }

        .stats-panel h4 {
            color: #4A90E2;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .stat-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 12px;
        }

        .stat-value {
            color: #2ECC71;
            font-weight: bold;
        }

        /* Loading Screen */
        .loading-screen {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0a0a0a;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #333;
            border-top: 3px solid #4A90E2;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loading-text {
            color: #4A90E2;
            font-size: 18px;
            margin-bottom: 10px;
        }

        .loading-progress {
            color: #888;
            font-size: 14px;
        }

        /* Tooltips */
        .tooltip {
            position: absolute;
            background: rgba(0, 0, 0, 0.95);
            border: 1px solid #4A90E2;
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 12px;
            color: #ffffff;
            pointer-events: none;
            z-index: 200;
            max-width: 250px;
            display: none;
        }

        .tooltip.visible {
            display: block;
        }

        .tooltip h5 {
            color: #4A90E2;
            margin-bottom: 5px;
            font-size: 13px;
        }

        .tooltip-item {
            margin-bottom: 2px;
        }

        /* Context Menus */
        .context-menu {
            position: absolute;
            background: rgba(0, 0, 0, 0.95);
            border: 1px solid #4A90E2;
            border-radius: 4px;
            padding: 5px 0;
            min-width: 150px;
            z-index: 300;
            display: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .context-menu.visible {
            display: block;
        }

        .context-menu-item {
            padding: 8px 15px;
            color: #ffffff;
            cursor: pointer;
            font-size: 13px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .context-menu-item:last-child {
            border-bottom: none;
        }

        .context-menu-item:hover {
            background: rgba(74, 144, 226, 0.2);
        }

        .context-menu-item.disabled {
            color: #666;
            cursor: not-allowed;
        }

        .context-menu-item.disabled:hover {
            background: none;
        }

        .context-menu-separator {
            height: 1px;
            background: #333;
            margin: 5px 0;
        }

        .context-menu-shortcut {
            color: #888;
            font-size: 11px;
        }

        /* Multi-Select UI */
        .selection-box {
            position: absolute;
            border: 2px dashed #4A90E2;
            background: rgba(74, 144, 226, 0.1);
            pointer-events: none;
            z-index: 150;
            display: none;
        }

        .selection-box.visible {
            display: block;
        }

        .selection-counter {
            position: absolute;
            top: 100px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #4A90E2;
            border-radius: 4px;
            padding: 8px 12px;
            color: #4A90E2;
            font-size: 14px;
            display: none;
        }

        .selection-counter.visible {
            display: block;
        }

        /* Drag and Drop */
        .drag-ghost {
            position: absolute;
            pointer-events: none;
            z-index: 200;
            opacity: 0.7;
            display: none;
        }

        .drag-ghost.visible {
            display: block;
        }

        .drop-zone {
            position: absolute;
            border: 2px dashed #2ECC71;
            background: rgba(46, 204, 113, 0.1);
            border-radius: 50%;
            pointer-events: none;
            z-index: 100;
            display: none;
        }

        .drop-zone.visible {
            display: block;
        }

        .drop-zone.invalid {
            border-color: #E74C3C;
            background: rgba(231, 76, 60, 0.1);
        }

        /* Bookmarks Panel */
        .bookmarks-panel {
            position: absolute;
            top: 300px;
            left: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #333;
            border-radius: 8px;
            padding: 15px;
            min-width: 250px;
            max-height: 300px;
            overflow-y: auto;
            pointer-events: auto;
            display: none;
        }

        .bookmarks-panel.visible {
            display: block;
        }

        .bookmarks-panel h4 {
            color: #4A90E2;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .bookmark-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;
            border-bottom: 1px solid #333;
            cursor: pointer;
        }

        .bookmark-item:hover {
            background: rgba(74, 144, 226, 0.1);
        }

        .bookmark-name {
            color: #ffffff;
            font-size: 13px;
        }

        .bookmark-actions {
            display: flex;
            gap: 5px;
        }

        .bookmark-btn {
            background: none;
            border: 1px solid #666;
            color: #666;
            padding: 2px 6px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
        }

        .bookmark-btn:hover {
            border-color: #4A90E2;
            color: #4A90E2;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .layer-controls,
            .info-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                max-width: 90vw;
                max-height: 80vh;
            }

            .search-panel {
                flex-direction: column;
                gap: 5px;
            }

            .stats-panel {
                min-width: 150px;
            }

            .bookmarks-panel {
                max-width: 90vw;
            }
        }
    </style>
</head>
<body>
    <div class="galaxy-container">
        <!-- Loading Screen -->
        <div class="loading-screen" id="loadingScreen">
            <div class="loading-spinner"></div>
            <div class="loading-text">Initializing Galaxy Map</div>
            <div class="loading-progress" id="loadingProgress">Loading galaxy data...</div>
        </div>

        <!-- 3D Canvas -->
        <canvas id="galaxy-canvas"></canvas>

        <!-- UI Overlay -->
        <div class="ui-overlay">
            <!-- Header Controls -->
            <div class="header-controls">
                <div class="galaxy-title">Startales Galaxy</div>
                <div class="zoom-controls">
                    <div class="zoom-level" id="zoomLevel">Galaxy View</div>
                    <button class="zoom-btn" id="zoomIn">Zoom In</button>
                    <button class="zoom-btn" id="zoomOut">Zoom Out</button>
                    <button class="zoom-btn" id="resetView">Reset</button>
                </div>
            </div>

            <!-- Layer Controls -->
            <div class="layer-controls">
                <h3>Map Layers</h3>
                <div class="layer-item">
                    <input type="checkbox" class="layer-checkbox" id="layer-political" checked>
                    <label class="layer-label" for="layer-political">Political Boundaries</label>
                    <input type="range" class="layer-opacity" id="opacity-political" min="0" max="1" step="0.1" value="1">
                </div>
                <div class="layer-item">
                    <input type="checkbox" class="layer-checkbox" id="layer-economic" checked>
                    <label class="layer-label" for="layer-economic">Trade Routes</label>
                    <input type="range" class="layer-opacity" id="opacity-economic" min="0" max="1" step="0.1" value="0.8">
                </div>
                <div class="layer-item">
                    <input type="checkbox" class="layer-checkbox" id="layer-military" checked>
                    <label class="layer-label" for="layer-military">Military Assets</label>
                    <input type="range" class="layer-opacity" id="opacity-military" min="0" max="1" step="0.1" value="0.7">
                </div>
                <div class="layer-item">
                    <input type="checkbox" class="layer-checkbox" id="layer-diplomatic">
                    <label class="layer-label" for="layer-diplomatic">Diplomatic Relations</label>
                    <input type="range" class="layer-opacity" id="opacity-diplomatic" min="0" max="1" step="0.1" value="0.6">
                </div>
                <div class="layer-item">
                    <input type="checkbox" class="layer-checkbox" id="layer-resource">
                    <label class="layer-label" for="layer-resource">Resource Distribution</label>
                    <input type="range" class="layer-opacity" id="opacity-resource" min="0" max="1" step="0.1" value="0.5">
                </div>
                <div class="layer-item">
                    <input type="checkbox" class="layer-checkbox" id="layer-environmental">
                    <label class="layer-label" for="layer-environmental">Environmental Data</label>
                    <input type="range" class="layer-opacity" id="opacity-environmental" min="0" max="1" step="0.1" value="0.4">
                </div>
            </div>

            <!-- Detail Panel -->
            <div class="detail-panel" id="detailPanel">
                <div class="detail-panel-header">
                    <div>
                        <div class="detail-panel-title" id="detailPanelTitle">Select an object</div>
                        <div class="detail-panel-subtitle" id="detailPanelSubtitle">Click on a star system, fleet, or point of interest</div>
                    </div>
                    <button class="detail-panel-close" id="detailPanelClose">×</button>
                </div>
                <div class="detail-panel-content">
                    <div class="detail-panel-tabs" id="detailPanelTabs">
                        <button class="detail-panel-tab active" data-tab="overview">Overview</button>
                        <button class="detail-panel-tab" data-tab="details">Details</button>
                        <button class="detail-panel-tab" data-tab="resources">Resources</button>
                        <button class="detail-panel-tab" data-tab="military">Military</button>
                    </div>
                    <div class="detail-panel-tab-content active" id="tab-overview">
                        <div class="detail-section">
                            <div class="detail-section-title">Basic Information</div>
                            <div id="basicInfo">
                                <p>Select an object to view detailed information.</p>
                            </div>
                        </div>
                    </div>
                    <div class="detail-panel-tab-content" id="tab-details">
                        <div class="detail-section">
                            <div class="detail-section-title">Detailed Analysis</div>
                            <div id="detailedInfo">
                                <p>Detailed information will appear here.</p>
                            </div>
                        </div>
                    </div>
                    <div class="detail-panel-tab-content" id="tab-resources">
                        <div class="detail-section">
                            <div class="detail-section-title">Resource Information</div>
                            <div id="resourceInfo">
                                <p>Resource data will appear here.</p>
                            </div>
                        </div>
                    </div>
                    <div class="detail-panel-tab-content" id="tab-military">
                        <div class="detail-section">
                            <div class="detail-section-title">Military Status</div>
                            <div id="militaryInfo">
                                <p>Military information will appear here.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="detail-actions" id="detailActions">
                    <button class="detail-action-btn" id="focusBtn">Focus</button>
                    <button class="detail-action-btn secondary" id="bookmarkBtn">Bookmark</button>
                </div>
            </div>

            <!-- Search Panel -->
            <div class="search-panel">
                <input type="text" class="search-input" id="searchInput" placeholder="Search systems, civilizations, fleets...">
                <button class="search-btn" id="searchBtn">Search</button>
            </div>

            <!-- Statistics Panel -->
            <div class="stats-panel">
                <h4>Galaxy Statistics</h4>
                <div class="stat-item">
                    <span>Star Systems:</span>
                    <span class="stat-value" id="stat-systems">-</span>
                </div>
                <div class="stat-item">
                    <span>Civilizations:</span>
                    <span class="stat-value" id="stat-civilizations">-</span>
                </div>
                <div class="stat-item">
                    <span>Total Population:</span>
                    <span class="stat-value" id="stat-population">-</span>
                </div>
                <div class="stat-item">
                    <span>Active Fleets:</span>
                    <span class="stat-value" id="stat-fleets">-</span>
                </div>
                <div class="stat-item">
                    <span>Trade Value:</span>
                    <span class="stat-value" id="stat-trade">-</span>
                </div>
            </div>
        </div>

        <!-- Tooltip -->
        <div class="tooltip" id="tooltip">
            <h5 id="tooltipTitle"></h5>
            <div id="tooltipContent"></div>
        </div>

        <!-- Context Menu -->
        <div class="context-menu" id="contextMenu">
            <div class="context-menu-item" data-action="focus">
                <span>Focus on Object</span>
                <span class="context-menu-shortcut">F</span>
            </div>
            <div class="context-menu-item" data-action="bookmark">
                <span>Add Bookmark</span>
                <span class="context-menu-shortcut">Ctrl+B</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="trade">
                <span>Establish Trade</span>
            </div>
            <div class="context-menu-item" data-action="diplomacy">
                <span>Open Diplomacy</span>
            </div>
            <div class="context-menu-item" data-action="military">
                <span>Military Orders</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="details">
                <span>View Details</span>
                <span class="context-menu-shortcut">Enter</span>
            </div>
        </div>

        <!-- Multi-Select UI -->
        <div class="selection-box" id="selectionBox"></div>
        <div class="selection-counter" id="selectionCounter">
            <span id="selectionCount">0</span> objects selected
        </div>

        <!-- Drag and Drop -->
        <div class="drag-ghost" id="dragGhost">
            <div style="background: rgba(74, 144, 226, 0.8); padding: 5px 10px; border-radius: 4px; color: white; font-size: 12px;">
                Moving Fleet...
            </div>
        </div>
        <div class="drop-zone" id="dropZone"></div>

        <!-- Bookmarks Panel -->
        <div class="bookmarks-panel" id="bookmarksPanel">
            <h4>Bookmarks</h4>
            <div id="bookmarksList">
                <div class="bookmark-item">
                    <span class="bookmark-name">No bookmarks yet</span>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Galaxy Map 3D Visualization
        class GalaxyMap {
            constructor() {
                this.scene = null;
                this.camera = null;
                this.renderer = null;
                this.controls = null;
                this.galaxyData = null;
                this.selectedObject = null;
                this.selectedObjects = []; // Multi-select support
                this.zoomLevel = 1; // 1=Galaxy, 2=Sector, 3=System, 4=Planet, 5=City, 6=District
                this.layers = {
                    political: { visible: true, opacity: 1.0, objects: [] },
                    economic: { visible: true, opacity: 0.8, objects: [] },
                    military: { visible: true, opacity: 0.7, objects: [] },
                    diplomatic: { visible: false, opacity: 0.6, objects: [] },
                    resource: { visible: false, opacity: 0.5, objects: [] },
                    environmental: { visible: false, opacity: 0.4, objects: [] }
                };
                this.raycaster = new THREE.Raycaster();
                this.mouse = new THREE.Vector2();
                this.tooltip = document.getElementById('tooltip');
                this.detailPanel = document.getElementById('detailPanel');
                this.currentDetailObject = null;
                
                // Enhanced interaction state
                this.isMultiSelecting = false;
                this.multiSelectStart = { x: 0, y: 0 };
                this.isDragging = false;
                this.dragObject = null;
                this.bookmarks = [];
                this.contextMenu = document.getElementById('contextMenu');
                this.selectionBox = document.getElementById('selectionBox');
                this.selectionCounter = document.getElementById('selectionCounter');
                this.dragGhost = document.getElementById('dragGhost');
                this.dropZone = document.getElementById('dropZone');
                this.bookmarksPanel = document.getElementById('bookmarksPanel');
                
                this.init();
            }

            async init() {
                try {
                    this.updateLoadingProgress('Setting up 3D scene...');
                    this.setupScene();
                    this.setupCamera();
                    this.setupRenderer();
                    this.setupControls();
                    this.setupEventListeners();

                    this.updateLoadingProgress('Loading galaxy data...');
                    await this.loadGalaxyData();

                    this.updateLoadingProgress('Generating star systems...');
                    this.createStarSystems();

                    this.updateLoadingProgress('Creating trade routes...');
                    this.createTradeRoutes();

                    this.updateLoadingProgress('Positioning fleets...');
                    this.createFleets();

                    this.updateLoadingProgress('Adding points of interest...');
                    this.createPointsOfInterest();

                    this.updateLoadingProgress('Creating political boundaries...');
                    this.createPoliticalBoundaries();

                    this.updateLoadingProgress('Establishing diplomatic relations...');
                    this.createDiplomaticRelations();

                    this.updateLoadingProgress('Mapping resource distribution...');
                    this.createResourceOverlays();

                    this.updateLoadingProgress('Analyzing environmental data...');
                    this.createEnvironmentalData();

                    this.updateLoadingProgress('Finalizing visualization...');
                    this.updateStatistics();
                    this.hideLoadingScreen();

                    this.animate();
                } catch (error) {
                    console.error('Error initializing galaxy map:', error);
                    this.updateLoadingProgress('Error loading galaxy map');
                }
            }

            setupScene() {
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0x000510);

                // Add starfield background
                this.createStarfield();
            }

            setupCamera() {
                const canvas = document.getElementById('galaxy-canvas');
                this.camera = new THREE.PerspectiveCamera(
                    75,
                    canvas.clientWidth / canvas.clientHeight,
                    0.1,
                    10000
                );
                this.camera.position.set(0, 50, 100);
            }

            setupRenderer() {
                const canvas = document.getElementById('galaxy-canvas');
                this.renderer = new THREE.WebGLRenderer({ 
                    canvas: canvas,
                    antialias: true 
                });
                this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
                this.renderer.setPixelRatio(window.devicePixelRatio);
            }

            setupControls() {
                this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                this.controls.enableDamping = true;
                this.controls.dampingFactor = 0.05;
                this.controls.maxDistance = 500;
                this.controls.minDistance = 5;
            }

            createStarfield() {
                const starGeometry = new THREE.BufferGeometry();
                const starCount = 10000;
                const positions = new Float32Array(starCount * 3);

                for (let i = 0; i < starCount * 3; i += 3) {
                    positions[i] = (Math.random() - 0.5) * 2000;
                    positions[i + 1] = (Math.random() - 0.5) * 2000;
                    positions[i + 2] = (Math.random() - 0.5) * 2000;
                }

                starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

                const starMaterial = new THREE.PointsMaterial({
                    color: 0xffffff,
                    size: 0.5,
                    transparent: true,
                    opacity: 0.8
                });

                const stars = new THREE.Points(starGeometry, starMaterial);
                this.scene.add(stars);
            }

            async loadGalaxyData() {
                const response = await fetch('/api/galaxy/overview');
                const result = await response.json();
                if (result.success) {
                    this.galaxyData = result.data;
                } else {
                    throw new Error('Failed to load galaxy data');
                }

                // Load additional data
                const systemsResponse = await fetch('/api/galaxy/systems');
                const systemsResult = await systemsResponse.json();
                if (systemsResult.success) {
                    this.galaxyData.systems = systemsResult.data;
                }

                const civsResponse = await fetch('/api/galaxy/civilizations');
                const civsResult = await civsResponse.json();
                if (civsResult.success) {
                    this.galaxyData.civilizations = civsResult.data;
                }

                const routesResponse = await fetch('/api/galaxy/trade-routes');
                const routesResult = await routesResponse.json();
                if (routesResult.success) {
                    this.galaxyData.tradeRoutes = routesResult.data;
                }

                const fleetsResponse = await fetch('/api/galaxy/fleets');
                const fleetsResult = await fleetsResponse.json();
                if (fleetsResult.success) {
                    this.galaxyData.fleets = fleetsResult.data;
                }

                const poisResponse = await fetch('/api/galaxy/points-of-interest');
                const poisResult = await poisResponse.json();
                if (poisResult.success) {
                    this.galaxyData.pointsOfInterest = poisResult.data;
                }
            }

            createStarSystems() {
                if (!this.galaxyData.systems) return;

                this.galaxyData.systems.forEach(system => {
                    // Create star
                    const starGeometry = new THREE.SphereGeometry(0.5, 16, 16);
                    const starColor = this.getStarColor(system.starType);
                    const starMaterial = new THREE.MeshBasicMaterial({ 
                        color: starColor,
                        transparent: true,
                        opacity: 0.9
                    });
                    
                    const star = new THREE.Mesh(starGeometry, starMaterial);
                    star.position.set(system.position.x, system.position.y, system.position.z);
                    star.userData = { type: 'star', data: system };
                    
                    // Add glow effect
                    const glowGeometry = new THREE.SphereGeometry(1.2, 16, 16);
                    const glowMaterial = new THREE.MeshBasicMaterial({
                        color: starColor,
                        transparent: true,
                        opacity: 0.3
                    });
                    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                    glow.position.copy(star.position);
                    
                    this.scene.add(star);
                    this.scene.add(glow);
                    this.layers.political.objects.push(star, glow);

                    // Create system label
                    this.createSystemLabel(system);

                    // Create planets (simplified as smaller spheres)
                    if (system.planets) {
                        system.planets.forEach((planet, index) => {
                            const planetGeometry = new THREE.SphereGeometry(0.2, 8, 8);
                            const planetMaterial = new THREE.MeshBasicMaterial({ 
                                color: this.getPlanetColor(planet.type)
                            });
                            
                            const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
                            const angle = (index / system.planets.length) * Math.PI * 2;
                            const distance = 2 + index * 0.5;
                            
                            planetMesh.position.set(
                                system.position.x + Math.cos(angle) * distance,
                                system.position.y,
                                system.position.z + Math.sin(angle) * distance
                            );
                            
                            planetMesh.userData = { type: 'planet', data: planet, system: system };
                            this.scene.add(planetMesh);
                            this.layers.political.objects.push(planetMesh);
                        });
                    }
                });
            }

            createTradeRoutes() {
                if (!this.galaxyData.tradeRoutes || !this.galaxyData.systems) return;

                this.galaxyData.tradeRoutes.forEach(route => {
                    const fromSystem = this.galaxyData.systems.find(s => s.id === route.from);
                    const toSystem = this.galaxyData.systems.find(s => s.id === route.to);
                    
                    if (fromSystem && toSystem) {
                        // Create animated trade route with particles
                        this.createAnimatedTradeRoute(fromSystem, toSystem, route);
                        
                        // Create static trade route line
                        const points = [
                            new THREE.Vector3(fromSystem.position.x, fromSystem.position.y, fromSystem.position.z),
                            new THREE.Vector3(toSystem.position.x, toSystem.position.y, toSystem.position.z)
                        ];
                        
                        const geometry = new THREE.BufferGeometry().setFromPoints(points);
                        const material = new THREE.LineBasicMaterial({ 
                            color: this.getTradeRouteColor(route.security),
                            transparent: true,
                            opacity: 0.6
                        });
                        
                        const line = new THREE.Line(geometry, material);
                        line.userData = { type: 'trade-route', data: route };
                        
                        this.scene.add(line);
                        this.layers.economic.objects.push(line);
                    }
                });
            }

            createAnimatedTradeRoute(fromSystem, toSystem, route) {
                // Create animated particles flowing along trade route
                const particleCount = Math.min(10, Math.floor(route.volume / 10000));
                const particles = new THREE.BufferGeometry();
                const positions = new Float32Array(particleCount * 3);
                
                for (let i = 0; i < particleCount; i++) {
                    const t = i / particleCount;
                    positions[i * 3] = fromSystem.position.x + (toSystem.position.x - fromSystem.position.x) * t;
                    positions[i * 3 + 1] = fromSystem.position.y + (toSystem.position.y - fromSystem.position.y) * t;
                    positions[i * 3 + 2] = fromSystem.position.z + (toSystem.position.z - fromSystem.position.z) * t;
                }
                
                particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                
                const particleMaterial = new THREE.PointsMaterial({
                    color: 0x00ff88,
                    size: 0.3,
                    transparent: true,
                    opacity: 0.8
                });
                
                const particleSystem = new THREE.Points(particles, particleMaterial);
                particleSystem.userData = { 
                    type: 'trade-particles', 
                    data: route,
                    animationSpeed: route.volume / 100000
                };
                
                this.scene.add(particleSystem);
                this.layers.economic.objects.push(particleSystem);
            }

            getTradeRouteColor(security) {
                switch (security) {
                    case 'high': return 0x00ff88;
                    case 'medium': return 0xffaa00;
                    case 'low': return 0xff4444;
                    default: return 0x888888;
                }
            }

            createFleets() {
                if (!this.galaxyData.fleets || !this.galaxyData.systems) return;

                this.galaxyData.fleets.forEach(fleet => {
                    const fleetGeometry = new THREE.ConeGeometry(0.3, 1, 6);
                    const fleetMaterial = new THREE.MeshBasicMaterial({ 
                        color: this.getCivilizationColor(fleet.owner)
                    });
                    
                    const fleetMesh = new THREE.Mesh(fleetGeometry, fleetMaterial);
                    
                    if (fleet.currentSystem !== 'transit') {
                        const system = this.galaxyData.systems.find(s => s.id === fleet.currentSystem);
                        if (system) {
                            fleetMesh.position.set(
                                system.position.x + (Math.random() - 0.5) * 4,
                                system.position.y + 2,
                                system.position.z + (Math.random() - 0.5) * 4
                            );
                        }
                    } else {
                        fleetMesh.position.set(fleet.position.x, fleet.position.y, fleet.position.z);
                    }
                    
                    fleetMesh.userData = { type: 'fleet', data: fleet };
                    this.scene.add(fleetMesh);
                    this.layers.military.objects.push(fleetMesh);
                });
            }

            createPointsOfInterest() {
                if (!this.galaxyData.pointsOfInterest) return;

                this.galaxyData.pointsOfInterest.forEach(poi => {
                    const geometry = new THREE.SphereGeometry(0.4, 8, 8);
                    const material = new THREE.MeshBasicMaterial({ 
                        color: this.getPOIColor(poi.type),
                        transparent: true,
                        opacity: 0.7
                    });
                    
                    const poiMesh = new THREE.Mesh(geometry, material);
                    poiMesh.position.set(poi.position.x, poi.position.y, poi.position.z);
                    poiMesh.userData = { type: 'poi', data: poi };
                    
                    // Add pulsing animation for undiscovered POIs
                    if (!poi.discovered) {
                        poiMesh.userData.pulseAnimation = true;
                    }
                    
                    this.scene.add(poiMesh);
                    this.layers.environmental.objects.push(poiMesh);
                });
            }

            createDiplomaticRelations() {
                if (!this.galaxyData.civilizations) return;

                this.galaxyData.civilizations.forEach(civ => {
                    Object.entries(civ.diplomaticStatus || {}).forEach(([targetCivId, status]) => {
                        const targetCiv = this.galaxyData.civilizations.find(c => c.id === targetCivId);
                        if (!targetCiv) return;

                        const civSystem = this.galaxyData.systems.find(s => s.id === civ.homeworld);
                        const targetSystem = this.galaxyData.systems.find(s => s.id === targetCiv.homeworld);
                        
                        if (civSystem && targetSystem) {
                            this.createDiplomaticConnection(civSystem, targetSystem, status, civ, targetCiv);
                        }
                    });
                });
            }

            createDiplomaticConnection(fromSystem, toSystem, status, fromCiv, toCiv) {
                const points = [
                    new THREE.Vector3(fromSystem.position.x, fromSystem.position.y + 1, fromSystem.position.z),
                    new THREE.Vector3(toSystem.position.x, toSystem.position.y + 1, toSystem.position.z)
                ];
                
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineDashedMaterial({ 
                    color: this.getDiplomaticColor(status),
                    transparent: true,
                    opacity: 0.5,
                    dashSize: 1,
                    gapSize: 0.5
                });
                
                const line = new THREE.Line(geometry, material);
                line.computeLineDistances(); // Required for dashed lines
                line.userData = { 
                    type: 'diplomatic-relation', 
                    data: { status, fromCiv, toCiv }
                };
                
                this.scene.add(line);
                this.layers.diplomatic.objects.push(line);
            }

            createResourceOverlays() {
                if (!this.galaxyData.systems) return;

                this.galaxyData.systems.forEach(system => {
                    if (!system.planets) return;

                    system.planets.forEach(planet => {
                        if (!planet.resources || planet.resources.length === 0) return;

                        // Create resource indicators around planets
                        planet.resources.forEach((resource, index) => {
                            const geometry = new THREE.RingGeometry(1.5 + index * 0.3, 1.8 + index * 0.3, 8);
                            const material = new THREE.MeshBasicMaterial({ 
                                color: this.getResourceColor(resource),
                                transparent: true,
                                opacity: 0.4,
                                side: THREE.DoubleSide
                            });
                            
                            const ring = new THREE.Mesh(geometry, material);
                            ring.position.set(system.position.x, system.position.y, system.position.z);
                            ring.lookAt(this.camera.position);
                            ring.userData = { 
                                type: 'resource-indicator', 
                                data: { resource, planet, system }
                            };
                            
                            this.scene.add(ring);
                            this.layers.resource.objects.push(ring);
                        });
                    });
                });
            }

            createEnvironmentalData() {
                if (!this.galaxyData.systems) return;

                this.galaxyData.systems.forEach(system => {
                    // Create habitability zones
                    const habitabilityGeometry = new THREE.RingGeometry(3, 5, 16);
                    const habitabilityMaterial = new THREE.MeshBasicMaterial({
                        color: 0x00ff00,
                        transparent: true,
                        opacity: 0.1,
                        side: THREE.DoubleSide
                    });
                    
                    const habitabilityZone = new THREE.Mesh(habitabilityGeometry, habitabilityMaterial);
                    habitabilityZone.position.set(system.position.x, system.position.y, system.position.z);
                    habitabilityZone.lookAt(this.camera.position);
                    habitabilityZone.userData = { 
                        type: 'habitability-zone', 
                        data: system
                    };
                    
                    this.scene.add(habitabilityZone);
                    this.layers.environmental.objects.push(habitabilityZone);

                    // Add stellar radiation effects
                    if (system.starType && (system.starType.startsWith('O') || system.starType.startsWith('B'))) {
                        const radiationGeometry = new THREE.SphereGeometry(6, 16, 16);
                        const radiationMaterial = new THREE.MeshBasicMaterial({
                            color: 0xff4444,
                            transparent: true,
                            opacity: 0.05,
                            side: THREE.BackSide
                        });
                        
                        const radiationZone = new THREE.Mesh(radiationGeometry, radiationMaterial);
                        radiationZone.position.set(system.position.x, system.position.y, system.position.z);
                        radiationZone.userData = { 
                            type: 'radiation-zone', 
                            data: system
                        };
                        
                        this.scene.add(radiationZone);
                        this.layers.environmental.objects.push(radiationZone);
                    }
                });
            }

            createPoliticalBoundaries() {
                if (!this.galaxyData.civilizations || !this.galaxyData.systems) return;

                this.galaxyData.civilizations.forEach(civ => {
                    const civSystems = this.galaxyData.systems.filter(system => 
                        system.planets && system.planets.some(planet => planet.owner === civ.id)
                    );

                    if (civSystems.length > 1) {
                        // Create territory boundary
                        this.createTerritoryBoundary(civSystems, civ);
                    }

                    // Create influence spheres around each system
                    civSystems.forEach(system => {
                        this.createInfluenceSphere(system, civ);
                    });
                });
            }

            createTerritoryBoundary(systems, civilization) {
                // Create a convex hull around civilization's systems
                const points = systems.map(s => new THREE.Vector3(s.position.x, s.position.y, s.position.z));
                
                if (points.length < 3) return;

                // Simple boundary creation (in a real implementation, use proper convex hull algorithm)
                const geometry = new THREE.BufferGeometry();
                const positions = [];
                
                for (let i = 0; i < points.length; i++) {
                    const current = points[i];
                    const next = points[(i + 1) % points.length];
                    
                    positions.push(current.x, current.y, current.z);
                    positions.push(next.x, next.y, next.z);
                }
                
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                
                const material = new THREE.LineBasicMaterial({
                    color: parseInt(civilization.color.replace('#', '0x')),
                    transparent: true,
                    opacity: 0.6
                });
                
                const boundary = new THREE.LineSegments(geometry, material);
                boundary.userData = { 
                    type: 'territory-boundary', 
                    data: civilization
                };
                
                this.scene.add(boundary);
                this.layers.political.objects.push(boundary);
            }

            createInfluenceSphere(system, civilization) {
                const geometry = new THREE.SphereGeometry(4, 16, 16);
                const material = new THREE.MeshBasicMaterial({
                    color: parseInt(civilization.color.replace('#', '0x')),
                    transparent: true,
                    opacity: 0.1,
                    side: THREE.BackSide
                });
                
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(system.position.x, system.position.y, system.position.z);
                sphere.userData = { 
                    type: 'influence-sphere', 
                    data: { system, civilization }
                };
                
                this.scene.add(sphere);
                this.layers.political.objects.push(sphere);
            }

            getPOIColor(type) {
                const colors = {
                    'ancient-ruins': 0xffd700,
                    'natural-hazard': 0xff4444,
                    'derelict': 0x888888,
                    'anomaly': 0x9966ff,
                    'resource-rich': 0x00ff88
                };
                return colors[type] || 0xffffff;
            }

            getDiplomaticColor(status) {
                const colors = {
                    'allied': 0x00ff00,
                    'friendly': 0x88ff88,
                    'neutral': 0xffff00,
                    'tense': 0xff8800,
                    'hostile': 0xff0000
                };
                return colors[status] || 0x888888;
            }

            getResourceColor(resource) {
                const colors = {
                    'water': 0x0088ff,
                    'minerals': 0x8b4513,
                    'biologicals': 0x00ff00,
                    'iron': 0x666666,
                    'silicon': 0xc0c0c0,
                    'rare-metals': 0xffd700,
                    'crystals': 0x9966ff,
                    'energy': 0xffff00,
                    'hydrogen': 0x88ccff,
                    'helium': 0xffcc88,
                    'exotic-matter': 0xff00ff,
                    'rare-earth': 0xff8800,
                    'quantum-crystals': 0x00ffff,
                    'heavy-metals': 0x444444,
                    'radioactives': 0x00ff00,
                    'dark-matter': 0x330033
                };
                return colors[resource] || 0xffffff;
            }

            createSystemLabel(system) {
                // Create text labels for systems (simplified - in production would use proper text rendering)
                const labelDiv = document.createElement('div');
                labelDiv.className = 'system-label';
                labelDiv.textContent = system.name;
                labelDiv.style.position = 'absolute';
                labelDiv.style.color = '#ffffff';
                labelDiv.style.fontSize = '12px';
                labelDiv.style.pointerEvents = 'none';
                document.body.appendChild(labelDiv);
                
                // Store reference for positioning updates
                system.labelElement = labelDiv;
            }

            getStarColor(starType) {
                const colors = {
                    'O': 0x9bb0ff,  // Blue
                    'B': 0xaabfff,  // Blue-white
                    'A': 0xcad7ff,  // White
                    'F': 0xf8f7ff,  // Yellow-white
                    'G': 0xfff4ea,  // Yellow (like our Sun)
                    'K': 0xffd2a1,  // Orange
                    'M': 0xffad51   // Red
                };
                
                const type = starType.charAt(0);
                return colors[type] || colors['G'];
            }

            getPlanetColor(planetType) {
                const colors = {
                    'terrestrial': 0x4a90e2,
                    'gas-giant': 0xf39c12,
                    'super-earth': 0x27ae60,
                    'ice-world': 0xecf0f1,
                    'desert': 0xe67e22,
                    'ocean': 0x3498db,
                    'volcanic': 0xe74c3c
                };
                
                return colors[planetType] || colors['terrestrial'];
            }

            getCivilizationColor(civId) {
                if (!this.galaxyData.civilizations) return 0xffffff;
                
                const civ = this.galaxyData.civilizations.find(c => c.id === civId);
                return civ ? parseInt(civ.color.replace('#', '0x')) : 0xffffff;
            }

            setupEventListeners() {
                // Mouse events
                this.renderer.domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
                this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event));
                this.renderer.domElement.addEventListener('contextmenu', (event) => this.onContextMenu(event));
                this.renderer.domElement.addEventListener('mousedown', (event) => this.onMouseDown(event));
                this.renderer.domElement.addEventListener('mouseup', (event) => this.onMouseUp(event));

                // UI controls
                document.getElementById('zoomIn').addEventListener('click', () => this.zoomIn());
                document.getElementById('zoomOut').addEventListener('click', () => this.zoomOut());
                document.getElementById('resetView').addEventListener('click', () => this.resetView());
                document.getElementById('searchBtn').addEventListener('click', () => this.performSearch());
                document.getElementById('searchInput').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.performSearch();
                });

                // Layer controls
                Object.keys(this.layers).forEach(layerName => {
                    const checkbox = document.getElementById('layer-' + layerName);
                    const opacity = document.getElementById('opacity-' + layerName);
                    
                    if (checkbox) {
                        checkbox.addEventListener('change', () => this.toggleLayer(layerName, checkbox.checked));
                    }
                    
                    if (opacity) {
                        opacity.addEventListener('input', () => this.setLayerOpacity(layerName, parseFloat(opacity.value)));
                    }
                });

                // Context menu events
                this.contextMenu.addEventListener('click', (event) => this.onContextMenuClick(event));
                document.addEventListener('click', () => this.hideContextMenu());

                // Keyboard shortcuts
                document.addEventListener('keydown', (event) => this.onKeyDown(event));

                // Detail panel events
                this.setupDetailPanelEvents();

                // Window resize
                window.addEventListener('resize', () => this.onWindowResize());
            }

            onMouseMove(event) {
                const rect = this.renderer.domElement.getBoundingClientRect();
                this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                // Raycast for hover effects
                this.raycaster.setFromCamera(this.mouse, this.camera);
                const intersects = this.raycaster.intersectObjects(this.scene.children, true);

                if (intersects.length > 0) {
                    const object = intersects[0].object;
                    if (object.userData && object.userData.type) {
                        this.showTooltip(event, object.userData);
                    } else {
                        this.hideTooltip();
                    }
                } else {
                    this.hideTooltip();
                }
            }

            onMouseClick(event) {
                // Handle multi-select with Ctrl key
                if (event.ctrlKey) {
                    this.handleMultiSelect(event);
                    return;
                }

                this.raycaster.setFromCamera(this.mouse, this.camera);
                const intersects = this.raycaster.intersectObjects(this.scene.children, true);

                if (intersects.length > 0) {
                    const object = intersects[0].object;
                    if (object.userData && object.userData.type) {
                        this.selectObject(object.userData);
                    }
                } else {
                    // Clear selection if clicking empty space
                    this.clearSelection();
                }
            }

            onMouseDown(event) {
                if (event.button === 0 && event.shiftKey) {
                    // Start multi-select box
                    this.startMultiSelectBox(event);
                } else if (event.button === 0 && this.selectedObjects.length > 0) {
                    // Check if starting drag operation
                    this.checkStartDrag(event);
                }
            }

            onMouseUp(event) {
                if (this.isMultiSelecting) {
                    this.endMultiSelectBox(event);
                } else if (this.isDragging) {
                    this.endDrag(event);
                }
            }

            onContextMenu(event) {
                event.preventDefault();
                
                this.raycaster.setFromCamera(this.mouse, this.camera);
                const intersects = this.raycaster.intersectObjects(this.scene.children, true);

                if (intersects.length > 0) {
                    const object = intersects[0].object;
                    if (object.userData && object.userData.type) {
                        this.showContextMenu(event, object.userData);
                    }
                }
            }

            onKeyDown(event) {
                switch (event.key) {
                    case 'f':
                    case 'F':
                        if (this.selectedObject) {
                            this.focusOnObject(this.selectedObject.data);
                        }
                        break;
                    case 'Escape':
                        this.clearSelection();
                        this.hideContextMenu();
                        this.hideBookmarksPanel();
                        break;
                    case 'Delete':
                        if (this.selectedObjects.length > 0) {
                            this.deleteSelectedObjects();
                        }
                        break;
                    case 'b':
                    case 'B':
                        if (event.ctrlKey) {
                            event.preventDefault();
                            this.toggleBookmarksPanel();
                        }
                        break;
                    case 'a':
                    case 'A':
                        if (event.ctrlKey) {
                            event.preventDefault();
                            this.selectAll();
                        }
                        break;
                    case 'Tab':
                        event.preventDefault();
                        this.cycleSelection();
                        break;
                }
            }

            showTooltip(event, userData) {
                const tooltip = document.getElementById('tooltip');
                const title = document.getElementById('tooltipTitle');
                const content = document.getElementById('tooltipContent');

                let titleText = '';
                let contentHTML = '';

                switch (userData.type) {
                    case 'star':
                        titleText = userData.data.name;
                        contentHTML = \`
                            <div class="tooltip-item">Type: \${userData.data.starType}</div>
                            <div class="tooltip-item">Planets: \${userData.data.planets ? userData.data.planets.length : 0}</div>
                            <div class="tooltip-item">Population: \${this.formatNumber(userData.data.planets ? userData.data.planets.reduce((sum, p) => sum + p.population, 0) : 0)}</div>
                        \`;
                        break;
                    case 'planet':
                        titleText = userData.data.name;
                        contentHTML = \`
                            <div class="tooltip-item">Type: \${userData.data.type}</div>
                            <div class="tooltip-item">Habitability: \${(userData.data.habitability * 100).toFixed(0)}%</div>
                            <div class="tooltip-item">Population: \${this.formatNumber(userData.data.population)}</div>
                            <div class="tooltip-item">Owner: \${userData.data.owner || 'Uncolonized'}</div>
                        \`;
                        break;
                    case 'fleet':
                        titleText = userData.data.name;
                        contentHTML = \`
                            <div class="tooltip-item">Owner: \${userData.data.owner}</div>
                            <div class="tooltip-item">Ships: \${userData.data.ships}</div>
                            <div class="tooltip-item">Strength: \${userData.data.strength.toFixed(1)}</div>
                            <div class="tooltip-item">Status: \${userData.data.status}</div>
                        \`;
                        break;
                    case 'trade-route':
                        titleText = userData.data.name;
                        contentHTML = \`
                            <div class="tooltip-item">Volume: \${this.formatNumber(userData.data.volume)} units</div>
                            <div class="tooltip-item">Value: \${this.formatCurrency(userData.data.value)}</div>
                            <div class="tooltip-item">Security: \${userData.data.security}</div>
                        \`;
                        break;
                }

                title.textContent = titleText;
                content.innerHTML = contentHTML;

                tooltip.style.left = event.clientX + 10 + 'px';
                tooltip.style.top = event.clientY - 10 + 'px';
                tooltip.classList.add('visible');
            }

            hideTooltip() {
                document.getElementById('tooltip').classList.remove('visible');
            }

            selectObject(userData) {
                this.selectedObject = userData;
                this.showDetailPanel(userData);
            }

            showInfoPanel(userData) {
                const panel = document.getElementById('infoPanel');
                const title = document.getElementById('infoPanelTitle');
                const content = document.getElementById('infoPanelContent');

                let titleText = '';
                let contentHTML = '';

                switch (userData.type) {
                    case 'star':
                        titleText = userData.data.name + ' System';
                        contentHTML = this.generateSystemInfo(userData.data);
                        break;
                    case 'planet':
                        titleText = userData.data.name;
                        contentHTML = this.generatePlanetInfo(userData.data);
                        break;
                    case 'fleet':
                        titleText = userData.data.name;
                        contentHTML = this.generateFleetInfo(userData.data);
                        break;
                    case 'trade-route':
                        titleText = userData.data.name;
                        contentHTML = this.generateTradeRouteInfo(userData.data);
                        break;
                }

                title.textContent = titleText;
                content.innerHTML = contentHTML;
                panel.classList.add('visible');
            }

            generateSystemInfo(system) {
                return \`
                    <div class="info-section">
                        <h4>Stellar Data</h4>
                        <div class="info-item">
                            <span>Star Type:</span>
                            <span class="info-value">\${system.starType}</span>
                        </div>
                        <div class="info-item">
                            <span>Mass:</span>
                            <span class="info-value">\${system.starMass} Solar Masses</span>
                        </div>
                        <div class="info-item">
                            <span>Temperature:</span>
                            <span class="info-value">\${system.starTemperature} K</span>
                        </div>
                    </div>
                    <div class="info-section">
                        <h4>System Overview</h4>
                        <div class="info-item">
                            <span>Planets:</span>
                            <span class="info-value">\${system.planets ? system.planets.length : 0}</span>
                        </div>
                        <div class="info-item">
                            <span>Total Population:</span>
                            <span class="info-value">\${this.formatNumber(system.planets ? system.planets.reduce((sum, p) => sum + p.population, 0) : 0)}</span>
                        </div>
                        <div class="info-item">
                            <span>Trade Routes:</span>
                            <span class="info-value">\${system.tradeRoutes ? system.tradeRoutes.length : 0}</span>
                        </div>
                    </div>
                    \${system.militaryPresence ? \`
                    <div class="info-section">
                        <h4>Military Presence</h4>
                        <div class="info-item">
                            <span>Fleets:</span>
                            <span class="info-value">\${system.militaryPresence.fleets}</span>
                        </div>
                        <div class="info-item">
                            <span>Bases:</span>
                            <span class="info-value">\${system.militaryPresence.bases}</span>
                        </div>
                        <div class="info-item">
                            <span>Defense Rating:</span>
                            <span class="info-value">\${system.militaryPresence.defenseRating}/10</span>
                        </div>
                    </div>
                    \` : ''}
                \`;
            }

            generatePlanetInfo(planet) {
                return \`
                    <div class="info-section">
                        <h4>Planetary Data</h4>
                        <div class="info-item">
                            <span>Type:</span>
                            <span class="info-value">\${planet.type}</span>
                        </div>
                        <div class="info-item">
                            <span>Habitability:</span>
                            <span class="info-value">\${(planet.habitability * 100).toFixed(0)}%</span>
                        </div>
                        <div class="info-item">
                            <span>Population:</span>
                            <span class="info-value">\${this.formatNumber(planet.population)}</span>
                        </div>
                        <div class="info-item">
                            <span>Owner:</span>
                            <span class="info-value">\${planet.owner || 'Uncolonized'}</span>
                        </div>
                    </div>
                    <div class="info-section">
                        <h4>Resources</h4>
                        \${planet.resources ? planet.resources.map(resource => 
                            \`<div class="info-item">
                                <span>\${resource}:</span>
                                <span class="info-value">Available</span>
                            </div>\`
                        ).join('') : '<div class="info-item">No known resources</div>'}
                    </div>
                    \${planet.cities && planet.cities.length > 0 ? \`
                    <div class="info-section">
                        <h4>Major Cities</h4>
                        \${planet.cities.map(city => 
                            \`<div class="info-item">
                                <span>\${city}:</span>
                                <span class="info-value">Active</span>
                            </div>\`
                        ).join('')}
                    </div>
                    \` : ''}
                \`;
            }

            generateFleetInfo(fleet) {
                return \`
                    <div class="info-section">
                        <h4>Fleet Composition</h4>
                        <div class="info-item">
                            <span>Ships:</span>
                            <span class="info-value">\${fleet.ships}</span>
                        </div>
                        <div class="info-item">
                            <span>Strength:</span>
                            <span class="info-value">\${fleet.strength.toFixed(1)}/10</span>
                        </div>
                        <div class="info-item">
                            <span>Owner:</span>
                            <span class="info-value">\${fleet.owner}</span>
                        </div>
                    </div>
                    <div class="info-section">
                        <h4>Current Orders</h4>
                        <div class="info-item">
                            <span>Status:</span>
                            <span class="info-value">\${fleet.status}</span>
                        </div>
                        <div class="info-item">
                            <span>Mission:</span>
                            <span class="info-value">\${fleet.mission}</span>
                        </div>
                        <div class="info-item">
                            <span>Location:</span>
                            <span class="info-value">\${fleet.currentSystem}</span>
                        </div>
                    </div>
                \`;
            }

            generateTradeRouteInfo(route) {
                return \`
                    <div class="info-section">
                        <h4>Route Details</h4>
                        <div class="info-item">
                            <span>From:</span>
                            <span class="info-value">\${route.from}</span>
                        </div>
                        <div class="info-item">
                            <span>To:</span>
                            <span class="info-value">\${route.to}</span>
                        </div>
                        <div class="info-item">
                            <span>Travel Time:</span>
                            <span class="info-value">\${route.travelTime} years</span>
                        </div>
                    </div>
                    <div class="info-section">
                        <h4>Trade Data</h4>
                        <div class="info-item">
                            <span>Volume:</span>
                            <span class="info-value">\${this.formatNumber(route.volume)} units</span>
                        </div>
                        <div class="info-item">
                            <span>Value:</span>
                            <span class="info-value">\${this.formatCurrency(route.value)}</span>
                        </div>
                        <div class="info-item">
                            <span>Security:</span>
                            <span class="info-value">\${route.security}</span>
                        </div>
                    </div>
                    <div class="info-section">
                        <h4>Goods</h4>
                        \${route.goods ? route.goods.map(good => 
                            \`<div class="info-item">
                                <span>\${good}:</span>
                                <span class="info-value">Active</span>
                            </div>\`
                        ).join('') : '<div class="info-item">No goods data</div>'}
                    </div>
                \`;
            }

            toggleLayer(layerName, visible) {
                this.layers[layerName].visible = visible;
                this.updateLayerVisibility(layerName);
            }

            setLayerOpacity(layerName, opacity) {
                this.layers[layerName].opacity = opacity;
                this.updateLayerVisibility(layerName);
            }

            updateLayerVisibility(layerName) {
                const layer = this.layers[layerName];
                layer.objects.forEach(object => {
                    object.visible = layer.visible;
                    if (object.material) {
                        object.material.opacity = layer.opacity;
                    }
                });
            }

            zoomIn() {
                if (this.zoomLevel < 6) {
                    this.zoomLevel++;
                    this.updateZoomLevel();
                }
            }

            zoomOut() {
                if (this.zoomLevel > 1) {
                    this.zoomLevel--;
                    this.updateZoomLevel();
                }
            }

            updateZoomLevel() {
                const zoomLevels = {
                    1: 'Galaxy View',
                    2: 'Sector View',
                    3: 'System View',
                    4: 'Planet View',
                    5: 'City View',
                    6: 'District View'
                };
                
                document.getElementById('zoomLevel').textContent = zoomLevels[this.zoomLevel];
                
                // Adjust camera constraints based on zoom level
                const distances = {
                    1: { min: 50, max: 500 },
                    2: { min: 20, max: 200 },
                    3: { min: 5, max: 50 },
                    4: { min: 2, max: 20 },
                    5: { min: 1, max: 10 },
                    6: { min: 0.5, max: 5 }
                };
                
                this.controls.minDistance = distances[this.zoomLevel].min;
                this.controls.maxDistance = distances[this.zoomLevel].max;
            }

            resetView() {
                this.camera.position.set(0, 50, 100);
                this.controls.target.set(0, 0, 0);
                this.controls.update();
                this.zoomLevel = 1;
                this.updateZoomLevel();
            }

            async performSearch() {
                const query = document.getElementById('searchInput').value.trim();
                if (!query) return;

                try {
                    const response = await fetch(\`/api/galaxy/search?q=\${encodeURIComponent(query)}\`);
                    const result = await response.json();
                    
                    if (result.success && result.totalResults > 0) {
                        // Focus on first result
                        const firstResult = Object.values(result.data).find(arr => arr.length > 0)?.[0];
                        if (firstResult) {
                            this.focusOnObject(firstResult);
                        }
                    } else {
                        alert('No results found for: ' + query);
                    }
                } catch (error) {
                    console.error('Search error:', error);
                    alert('Search failed');
                }
            }

            focusOnObject(object) {
                // Focus camera on the object
                if (object.position) {
                    this.camera.position.set(
                        object.position.x + 20,
                        object.position.y + 20,
                        object.position.z + 20
                    );
                    this.controls.target.set(
                        object.position.x,
                        object.position.y,
                        object.position.z
                    );
                    this.controls.update();
                }
            }

            updateStatistics() {
                if (!this.galaxyData.statistics) return;

                const stats = this.galaxyData.statistics;
                document.getElementById('stat-systems').textContent = stats.totalSystems || 0;
                document.getElementById('stat-civilizations').textContent = stats.totalCivilizations || 0;
                document.getElementById('stat-population').textContent = this.formatNumber(stats.totalPopulation || 0);
                document.getElementById('stat-fleets').textContent = stats.totalFleets || 0;
                document.getElementById('stat-trade').textContent = this.formatCurrency(stats.totalTradeValue || 0);
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

            updateLoadingProgress(message) {
                document.getElementById('loadingProgress').textContent = message;
            }

            hideLoadingScreen() {
                document.getElementById('loadingScreen').style.display = 'none';
            }

            onWindowResize() {
                const canvas = document.getElementById('galaxy-canvas');
                this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            }

            // === ENHANCED INTERACTIVE METHODS ===

            handleMultiSelect(event) {
                this.raycaster.setFromCamera(this.mouse, this.camera);
                const intersects = this.raycaster.intersectObjects(this.scene.children, true);

                if (intersects.length > 0) {
                    const object = intersects[0].object;
                    if (object.userData && object.userData.type) {
                        const index = this.selectedObjects.findIndex(obj => obj.data.id === object.userData.data.id);
                        if (index >= 0) {
                            // Remove from selection
                            this.selectedObjects.splice(index, 1);
                        } else {
                            // Add to selection
                            this.selectedObjects.push(object.userData);
                        }
                        this.updateSelectionUI();
                    }
                }
            }

            startMultiSelectBox(event) {
                this.isMultiSelecting = true;
                const rect = this.renderer.domElement.getBoundingClientRect();
                this.multiSelectStart.x = event.clientX - rect.left;
                this.multiSelectStart.y = event.clientY - rect.top;
                
                this.selectionBox.style.left = this.multiSelectStart.x + 'px';
                this.selectionBox.style.top = this.multiSelectStart.y + 'px';
                this.selectionBox.style.width = '0px';
                this.selectionBox.style.height = '0px';
                this.selectionBox.classList.add('visible');
            }

            endMultiSelectBox(event) {
                this.isMultiSelecting = false;
                this.selectionBox.classList.remove('visible');
                
                // Find objects within selection box
                const rect = this.renderer.domElement.getBoundingClientRect();
                const endX = event.clientX - rect.left;
                const endY = event.clientY - rect.top;
                
                const minX = Math.min(this.multiSelectStart.x, endX);
                const maxX = Math.max(this.multiSelectStart.x, endX);
                const minY = Math.min(this.multiSelectStart.y, endY);
                const maxY = Math.max(this.multiSelectStart.y, endY);
                
                // Check each object if it's within the selection box
                this.scene.children.forEach(object => {
                    if (object.userData && object.userData.type) {
                        const vector = object.position.clone();
                        vector.project(this.camera);
                        
                        const x = (vector.x * 0.5 + 0.5) * rect.width;
                        const y = (vector.y * -0.5 + 0.5) * rect.height;
                        
                        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
                            if (!this.selectedObjects.find(obj => obj.data.id === object.userData.data.id)) {
                                this.selectedObjects.push(object.userData);
                            }
                        }
                    }
                });
                
                this.updateSelectionUI();
            }

            checkStartDrag(event) {
                this.raycaster.setFromCamera(this.mouse, this.camera);
                const intersects = this.raycaster.intersectObjects(this.scene.children, true);

                if (intersects.length > 0) {
                    const object = intersects[0].object;
                    if (object.userData && object.userData.type === 'fleet') {
                        this.isDragging = true;
                        this.dragObject = object.userData;
                        this.showDragGhost(event);
                    }
                }
            }

            endDrag(event) {
                if (this.isDragging && this.dragObject) {
                    this.raycaster.setFromCamera(this.mouse, this.camera);
                    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

                    if (intersects.length > 0) {
                        const targetObject = intersects[0].object;
                        if (targetObject.userData && targetObject.userData.type === 'star') {
                            this.moveFleetToSystem(this.dragObject, targetObject.userData);
                        }
                    }
                }
                
                this.isDragging = false;
                this.dragObject = null;
                this.hideDragGhost();
                this.hideDropZone();
            }

            showContextMenu(event, userData) {
                this.contextMenu.style.left = event.clientX + 'px';
                this.contextMenu.style.top = event.clientY + 'px';
                this.contextMenu.classList.add('visible');
                this.contextMenu.userData = userData;
                
                // Update menu items based on object type
                const items = this.contextMenu.querySelectorAll('.context-menu-item');
                items.forEach(item => {
                    const action = item.dataset.action;
                    item.classList.remove('disabled');
                    
                    if (action === 'trade' && userData.type !== 'star') {
                        item.classList.add('disabled');
                    }
                    if (action === 'military' && userData.type !== 'fleet') {
                        item.classList.add('disabled');
                    }
                });
            }

            hideContextMenu() {
                this.contextMenu.classList.remove('visible');
            }

            onContextMenuClick(event) {
                event.stopPropagation();
                const item = event.target.closest('.context-menu-item');
                if (!item || item.classList.contains('disabled')) return;
                
                const action = item.dataset.action;
                const userData = this.contextMenu.userData;
                
                switch (action) {
                    case 'focus':
                        this.focusOnObject(userData.data);
                        break;
                    case 'bookmark':
                        this.addBookmark(userData);
                        break;
                    case 'trade':
                        this.openTradeDialog(userData);
                        break;
                    case 'diplomacy':
                        this.openDiplomacyDialog(userData);
                        break;
                    case 'military':
                        this.openMilitaryDialog(userData);
                        break;
                    case 'details':
                        this.showDetailPanel(userData);
                        break;
                }
                
                this.hideContextMenu();
            }

            clearSelection() {
                this.selectedObjects = [];
                this.selectedObject = null;
                this.updateSelectionUI();
                this.hideDetailPanel();
            }

            selectAll() {
                this.selectedObjects = [];
                this.scene.children.forEach(object => {
                    if (object.userData && object.userData.type) {
                        this.selectedObjects.push(object.userData);
                    }
                });
                this.updateSelectionUI();
            }

            cycleSelection() {
                const selectableObjects = this.scene.children.filter(obj => obj.userData && obj.userData.type);
                if (selectableObjects.length === 0) return;
                
                let currentIndex = -1;
                if (this.selectedObject) {
                    currentIndex = selectableObjects.findIndex(obj => obj.userData.data.id === this.selectedObject.data.id);
                }
                
                const nextIndex = (currentIndex + 1) % selectableObjects.length;
                this.selectObject(selectableObjects[nextIndex].userData);
            }

            updateSelectionUI() {
                const count = this.selectedObjects.length;
                document.getElementById('selectionCount').textContent = count;
                
                if (count > 0) {
                    this.selectionCounter.classList.add('visible');
                } else {
                    this.selectionCounter.classList.remove('visible');
                }
            }

            showDragGhost(event) {
                this.dragGhost.style.left = event.clientX + 10 + 'px';
                this.dragGhost.style.top = event.clientY - 10 + 'px';
                this.dragGhost.classList.add('visible');
            }

            hideDragGhost() {
                this.dragGhost.classList.remove('visible');
            }

            showDropZone(position, valid = true) {
                this.dropZone.style.left = (position.x - 25) + 'px';
                this.dropZone.style.top = (position.y - 25) + 'px';
                this.dropZone.style.width = '50px';
                this.dropZone.style.height = '50px';
                this.dropZone.classList.toggle('invalid', !valid);
                this.dropZone.classList.add('visible');
            }

            hideDropZone() {
                this.dropZone.classList.remove('visible');
            }

            addBookmark(userData) {
                const bookmark = {
                    id: Date.now().toString(),
                    name: userData.data.name,
                    type: userData.type,
                    data: userData.data
                };
                
                this.bookmarks.push(bookmark);
                this.updateBookmarksList();
                this.showNotification('Bookmark added: ' + bookmark.name);
            }

            toggleBookmarksPanel() {
                this.bookmarksPanel.classList.toggle('visible');
                if (this.bookmarksPanel.classList.contains('visible')) {
                    this.updateBookmarksList();
                }
            }

            hideBookmarksPanel() {
                this.bookmarksPanel.classList.remove('visible');
            }

            updateBookmarksList() {
                const list = document.getElementById('bookmarksList');
                
                if (this.bookmarks.length === 0) {
                    list.innerHTML = '<div class="bookmark-item"><span class="bookmark-name">No bookmarks yet</span></div>';
                    return;
                }
                
                list.innerHTML = this.bookmarks.map(bookmark => \`
                    <div class="bookmark-item" data-bookmark-id="\${bookmark.id}">
                        <span class="bookmark-name">\${bookmark.name}</span>
                        <div class="bookmark-actions">
                            <button class="bookmark-btn" onclick="galaxyMap.focusOnBookmark('\${bookmark.id}')">Go</button>
                            <button class="bookmark-btn" onclick="galaxyMap.removeBookmark('\${bookmark.id}')">×</button>
                        </div>
                    </div>
                \`).join('');
            }

            focusOnBookmark(bookmarkId) {
                const bookmark = this.bookmarks.find(b => b.id === bookmarkId);
                if (bookmark) {
                    this.focusOnObject(bookmark.data);
                }
            }

            removeBookmark(bookmarkId) {
                this.bookmarks = this.bookmarks.filter(b => b.id !== bookmarkId);
                this.updateBookmarksList();
            }

            moveFleetToSystem(fleetData, systemData) {
                // Simulate fleet movement
                this.showNotification(\`Moving \${fleetData.data.name} to \${systemData.data.name}\`);
                
                // In a real implementation, this would update the game state
                // and send API calls to move the fleet
                console.log('Fleet movement:', fleetData.data.name, 'to', systemData.data.name);
            }

            openTradeDialog(userData) {
                this.showNotification('Opening trade dialog for ' + userData.data.name);
                // Implementation would open a trade interface
            }

            openDiplomacyDialog(userData) {
                this.showNotification('Opening diplomacy dialog for ' + userData.data.name);
                // Implementation would open a diplomacy interface
            }

            openMilitaryDialog(userData) {
                this.showNotification('Opening military orders for ' + userData.data.name);
                // Implementation would open a military command interface
            }

            deleteSelectedObjects() {
                if (this.selectedObjects.length === 0) return;
                
                const count = this.selectedObjects.length;
                this.showNotification(\`Deleted \${count} object\${count > 1 ? 's' : ''}\`);
                
                // In a real implementation, this would remove objects from the scene
                // and update the game state
                this.clearSelection();
            }

            showNotification(message) {
                // Simple notification system
                const notification = document.createElement('div');
                notification.style.cssText = \`
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(74, 144, 226, 0.9);
                    color: white;
                    padding: 10px 15px;
                    border-radius: 4px;
                    z-index: 1000;
                    font-size: 14px;
                \`;
                notification.textContent = message;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 3000);
            }

            // === DETAIL PANEL METHODS ===

            setupDetailPanelEvents() {
                // Tab switching
                const tabs = document.querySelectorAll('.detail-panel-tab');
                tabs.forEach(tab => {
                    tab.addEventListener('click', () => this.switchDetailTab(tab.dataset.tab));
                });

                // Close button
                document.getElementById('detailPanelClose').addEventListener('click', () => {
                    this.hideDetailPanel();
                });

                // Action buttons
                document.getElementById('focusBtn').addEventListener('click', () => {
                    if (this.currentDetailObject) {
                        this.focusOnObject(this.currentDetailObject.data);
                    }
                });

                document.getElementById('bookmarkBtn').addEventListener('click', () => {
                    if (this.currentDetailObject) {
                        this.addBookmark(this.currentDetailObject);
                    }
                });
            }

            switchDetailTab(tabName) {
                // Remove active class from all tabs and contents
                document.querySelectorAll('.detail-panel-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                document.querySelectorAll('.detail-panel-tab-content').forEach(content => {
                    content.classList.remove('active');
                });

                // Add active class to selected tab and content
                document.querySelector(\`[data-tab="\${tabName}"]\`).classList.add('active');
                document.getElementById(\`tab-\${tabName}\`).classList.add('active');
            }

            showDetailPanel(userData) {
                this.currentDetailObject = userData;
                this.detailPanel.classList.add('visible');
                
                // Update header
                document.getElementById('detailPanelTitle').textContent = userData.data.name || 'Unknown Object';
                document.getElementById('detailPanelSubtitle').textContent = this.getObjectTypeDescription(userData.type);

                // Update content based on object type
                this.updateDetailPanelContent(userData);
            }

            hideDetailPanel() {
                this.detailPanel.classList.remove('visible');
                this.currentDetailObject = null;
            }

            getObjectTypeDescription(type) {
                const descriptions = {
                    'star': 'Star System',
                    'planet': 'Planetary Body',
                    'fleet': 'Military Fleet',
                    'trade-route': 'Trade Route',
                    'poi': 'Point of Interest',
                    'civilization': 'Civilization',
                    'city': 'Urban Center'
                };
                return descriptions[type] || 'Unknown Object';
            }

            updateDetailPanelContent(userData) {
                switch (userData.type) {
                    case 'star':
                        this.updateStarSystemDetails(userData.data);
                        break;
                    case 'planet':
                        this.updatePlanetDetails(userData.data);
                        break;
                    case 'fleet':
                        this.updateFleetDetails(userData.data);
                        break;
                    case 'poi':
                        this.updatePOIDetails(userData.data);
                        break;
                    case 'civilization':
                        this.updateCivilizationDetails(userData.data);
                        break;
                    default:
                        this.updateGenericDetails(userData.data);
                }
            }

            updateStarSystemDetails(system) {
                // Overview tab
                document.getElementById('basicInfo').innerHTML = \`
                    <div class="detail-row">
                        <span class="detail-label">System Name:</span>
                        <span class="detail-value">\${system.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Star Type:</span>
                        <span class="detail-value">\${system.starType || 'G-Class'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Planets:</span>
                        <span class="detail-value">\${system.planets ? system.planets.length : 0}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Population:</span>
                        <span class="detail-value">\${this.formatNumber(system.totalPopulation || 0)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Security Level:</span>
                        <span class="detail-value">
                            <span class="detail-status-indicator status-\${this.getSecurityStatus(system.security)}"></span>
                            \${system.security || 'Unknown'}
                        </span>
                    </div>
                \`;

                // Details tab
                document.getElementById('detailedInfo').innerHTML = \`
                    <div class="detail-section">
                        <div class="detail-section-title">Stellar Data</div>
                        <div class="detail-row">
                            <span class="detail-label">Luminosity:</span>
                            <span class="detail-value">\${system.luminosity || '1.0'} Sol</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Age:</span>
                            <span class="detail-value">\${system.age || '4.6'} Billion Years</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Metallicity:</span>
                            <span class="detail-value">\${system.metallicity || '0.02'}</span>
                        </div>
                    </div>
                    <div class="detail-section">
                        <div class="detail-section-title">Orbital Bodies</div>
                        \${system.planets ? system.planets.map(planet => \`
                            <div class="detail-row">
                                <span class="detail-label">\${planet.name}:</span>
                                <span class="detail-value">\${planet.type || 'Terrestrial'}</span>
                            </div>
                        \`).join('') : '<p>No planetary data available</p>'}
                    </div>
                \`;

                // Resources tab
                document.getElementById('resourceInfo').innerHTML = \`
                    <div class="detail-section">
                        <div class="detail-section-title">System Resources</div>
                        \${system.planets && system.planets.some(p => p.resources) ? 
                            system.planets.map(planet => 
                                planet.resources ? \`
                                    <div class="detail-section">
                                        <div class="detail-section-title">\${planet.name}</div>
                                        \${planet.resources.map(resource => \`
                                            <div class="detail-row">
                                                <span class="detail-label">\${resource}:</span>
                                                <span class="detail-value">Available</span>
                                            </div>
                                        \`).join('')}
                                    </div>
                                \` : ''
                            ).join('') : 
                            '<p>No resource data available</p>'
                        }
                    </div>
                \`;

                // Military tab
                document.getElementById('militaryInfo').innerHTML = \`
                    <div class="detail-section">
                        <div class="detail-section-title">Defense Status</div>
                        <div class="detail-row">
                            <span class="detail-label">Security Rating:</span>
                            <span class="detail-value">\${system.security || 'Unknown'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Patrol Frequency:</span>
                            <span class="detail-value">\${system.patrolLevel || 'Standard'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Defensive Installations:</span>
                            <span class="detail-value">\${system.defenses || 'Basic'}</span>
                        </div>
                    </div>
                \`;
            }

            updateFleetDetails(fleet) {
                // Overview tab
                document.getElementById('basicInfo').innerHTML = \`
                    <div class="detail-row">
                        <span class="detail-label">Fleet Name:</span>
                        <span class="detail-value">\${fleet.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Commander:</span>
                        <span class="detail-value">\${fleet.commander || 'Unknown'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Ship Count:</span>
                        <span class="detail-value">\${fleet.shipCount || 0}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">
                            <span class="detail-status-indicator status-\${this.getFleetStatus(fleet.status)}"></span>
                            \${fleet.status || 'Unknown'}
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Mission:</span>
                        <span class="detail-value">\${fleet.mission || 'Patrol'}</span>
                    </div>
                \`;

                // Military tab
                document.getElementById('militaryInfo').innerHTML = \`
                    <div class="detail-section">
                        <div class="detail-section-title">Combat Capability</div>
                        <div class="detail-row">
                            <span class="detail-label">Combat Strength:</span>
                            <span class="detail-value">\${fleet.strength || 100}</span>
                        </div>
                        <div class="detail-progress-bar">
                            <div class="detail-progress-fill" style="width: \${(fleet.strength || 100)}%"></div>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Fuel Level:</span>
                            <span class="detail-value">\${fleet.fuel || 85}%</span>
                        </div>
                        <div class="detail-progress-bar">
                            <div class="detail-progress-fill" style="width: \${fleet.fuel || 85}%"></div>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Morale:</span>
                            <span class="detail-value">\${fleet.morale || 'High'}</span>
                        </div>
                    </div>
                \`;
            }

            updatePOIDetails(poi) {
                // Overview tab
                document.getElementById('basicInfo').innerHTML = \`
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">\${poi.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Type:</span>
                        <span class="detail-value">\${poi.type}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Discovered:</span>
                        <span class="detail-value">
                            <span class="detail-status-indicator status-\${poi.discovered ? 'active' : 'inactive'}"></span>
                            \${poi.discovered ? 'Yes' : 'No'}
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Explored:</span>
                        <span class="detail-value">
                            <span class="detail-status-indicator status-\${poi.explored ? 'active' : 'inactive'}"></span>
                            \${poi.explored ? 'Yes' : 'No'}
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Significance:</span>
                        <span class="detail-value">\${poi.significance || 'Unknown'}</span>
                    </div>
                \`;

                // Details tab
                document.getElementById('detailedInfo').innerHTML = \`
                    <div class="detail-section">
                        <div class="detail-section-title">Description</div>
                        <p>\${poi.description || 'No description available.'}</p>
                    </div>
                    <div class="detail-section">
                        <div class="detail-section-title">Investigation Status</div>
                        <div class="detail-row">
                            <span class="detail-label">Survey Progress:</span>
                            <span class="detail-value">\${poi.surveyProgress || 0}%</span>
                        </div>
                        <div class="detail-progress-bar">
                            <div class="detail-progress-fill" style="width: \${poi.surveyProgress || 0}%"></div>
                        </div>
                    </div>
                \`;
            }

            updateGenericDetails(data) {
                // Overview tab
                document.getElementById('basicInfo').innerHTML = \`
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">\${data.name || 'Unknown'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Type:</span>
                        <span class="detail-value">\${data.type || 'Unknown'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">\${data.status || 'Unknown'}</span>
                    </div>
                \`;

                // Clear other tabs
                document.getElementById('detailedInfo').innerHTML = '<p>No detailed information available.</p>';
                document.getElementById('resourceInfo').innerHTML = '<p>No resource information available.</p>';
                document.getElementById('militaryInfo').innerHTML = '<p>No military information available.</p>';
            }

            getSecurityStatus(security) {
                const statusMap = {
                    'high': 'active',
                    'medium': 'warning',
                    'low': 'inactive'
                };
                return statusMap[security] || 'neutral';
            }

            getFleetStatus(status) {
                const statusMap = {
                    'active': 'active',
                    'moving': 'warning',
                    'docked': 'neutral',
                    'damaged': 'inactive'
                };
                return statusMap[status] || 'neutral';
            }

            formatNumber(num) {
                if (num >= 1000000000) {
                    return (num / 1000000000).toFixed(1) + 'B';
                } else if (num >= 1000000) {
                    return (num / 1000000).toFixed(1) + 'M';
                } else if (num >= 1000) {
                    return (num / 1000).toFixed(1) + 'K';
                }
                return num.toString();
            }

            animate() {
                requestAnimationFrame(() => this.animate());
                
                this.controls.update();
                
                // Update layer animations
                this.updateLayerAnimations();
                
                this.renderer.render(this.scene, this.camera);
                
                // Update drag ghost position
                if (this.isDragging) {
                    const rect = this.renderer.domElement.getBoundingClientRect();
                    this.dragGhost.style.left = (rect.left + this.mouse.x * rect.width * 0.5 + rect.width * 0.5 + 10) + 'px';
                    this.dragGhost.style.top = (rect.top + this.mouse.y * rect.height * -0.5 + rect.height * 0.5 - 10) + 'px';
                }
                
                // Update multi-select box
                if (this.isMultiSelecting) {
                    const rect = this.renderer.domElement.getBoundingClientRect();
                    const currentX = this.mouse.x * rect.width * 0.5 + rect.width * 0.5;
                    const currentY = this.mouse.y * rect.height * -0.5 + rect.height * 0.5;
                    
                    const width = Math.abs(currentX - this.multiSelectStart.x);
                    const height = Math.abs(currentY - this.multiSelectStart.y);
                    const left = Math.min(currentX, this.multiSelectStart.x);
                    const top = Math.min(currentY, this.multiSelectStart.y);
                    
                    this.selectionBox.style.left = left + 'px';
                    this.selectionBox.style.top = top + 'px';
                    this.selectionBox.style.width = width + 'px';
                    this.selectionBox.style.height = height + 'px';
                }
                
                // Update system labels positions (if implemented)
                this.updateSystemLabels();
            }

            updateLayerAnimations() {
                const time = Date.now() * 0.001;

                // Animate trade route particles
                this.layers.economic.objects.forEach(object => {
                    if (object.userData.type === 'trade-particles') {
                        const positions = object.geometry.attributes.position.array;
                        const speed = object.userData.animationSpeed || 1;
                        
                        for (let i = 0; i < positions.length; i += 3) {
                            // Move particles along the route
                            const progress = (time * speed + i / 3) % 1;
                            // Update particle positions based on progress
                            // This is a simplified animation - in production would use proper curve interpolation
                        }
                        
                        object.geometry.attributes.position.needsUpdate = true;
                    }
                });

                // Animate pulsing POIs
                this.layers.environmental.objects.forEach(object => {
                    if (object.userData.pulseAnimation) {
                        const pulse = Math.sin(time * 2) * 0.3 + 0.7;
                        object.material.opacity = pulse;
                        object.scale.setScalar(1 + Math.sin(time * 3) * 0.2);
                    }
                });

                // Animate resource rings rotation
                this.layers.resource.objects.forEach(object => {
                    if (object.userData.type === 'resource-indicator') {
                        object.rotation.z += 0.01;
                    }
                });

                // Animate influence spheres pulsing
                this.layers.political.objects.forEach(object => {
                    if (object.userData.type === 'influence-sphere') {
                        const pulse = Math.sin(time * 0.5) * 0.05 + 0.1;
                        object.material.opacity = pulse;
                    }
                });

                // Animate habitability zones
                this.layers.environmental.objects.forEach(object => {
                    if (object.userData.type === 'habitability-zone') {
                        object.rotation.z += 0.005;
                        // Update lookAt to face camera
                        object.lookAt(this.camera.position);
                    }
                });
            }

            updateSystemLabels() {
                // Update 2D label positions based on 3D positions
                if (this.galaxyData && this.galaxyData.systems) {
                    this.galaxyData.systems.forEach(system => {
                        if (system.labelElement) {
                            const vector = new THREE.Vector3(
                                system.position.x,
                                system.position.y,
                                system.position.z
                            );
                            vector.project(this.camera);
                            
                            const x = (vector.x * 0.5 + 0.5) * this.renderer.domElement.clientWidth;
                            const y = (vector.y * -0.5 + 0.5) * this.renderer.domElement.clientHeight;
                            
                            system.labelElement.style.left = x + 'px';
                            system.labelElement.style.top = y + 'px';
                        }
                    });
                }
            }
        }

        // Initialize the galaxy map when the page loads
        let galaxyMap;
        document.addEventListener('DOMContentLoaded', () => {
            galaxyMap = new GalaxyMap();
        });
    </script>
</body>
</html>
  `;
}

module.exports = {
  getGalaxyMapDemo
};
