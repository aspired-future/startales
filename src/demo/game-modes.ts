/**
 * Advanced Game Modes - Demo Interface
 * 
 * Interactive demonstration of COOP, Achievement, Conquest, and Hero game modes
 * with session management, objectives, and player interactions.
 */

import { Router } from 'express';

const router = Router();

router.get('/demo/game-modes', (_req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced Game Modes - Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 300;
        }

        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }

        .game-modes-overview {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-radius: 15px;
            padding: 25px;
            margin: 30px;
        }

        .game-modes-overview h3 {
            color: white;
            margin-bottom: 20px;
            text-align: center;
        }

        .mode-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
        }

        .mode-badge {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 1em;
            font-weight: 500;
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .mode-icon {
            font-size: 1.2em;
        }

        .demo-tabs {
            display: flex;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }

        .tab {
            flex: 1;
            padding: 15px 20px;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            color: #495057;
            transition: all 0.3s ease;
        }

        .tab.active {
            background: white;
            color: #667eea;
            border-bottom: 3px solid #667eea;
        }

        .tab:hover:not(.active) {
            background: #e9ecef;
        }

        .tab-content {
            display: none;
            padding: 30px;
        }

        .tab-content.active {
            display: block;
        }

        .demo-section {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            border: 1px solid #e9ecef;
        }

        .demo-section h3 {
            color: #495057;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .icon {
            font-size: 1.5em;
        }

        .demo-controls {
            margin: 20px 0;
        }

        .control-group {
            margin-bottom: 15px;
        }

        .control-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: #495057;
        }

        .control-group select,
        .control-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ced4da;
            border-radius: 8px;
            font-size: 14px;
        }

        .control-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            margin: 5px;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: linear-gradient(135deg, #6c757d, #495057);
        }

        .btn-success {
            background: linear-gradient(135deg, #28a745, #20c997);
        }

        .btn-danger {
            background: linear-gradient(135deg, #dc3545, #c82333);
        }

        .btn-warning {
            background: linear-gradient(135deg, #ffc107, #fd7e14);
        }

        .results-area {
            margin-top: 20px;
            padding: 20px;
            background: white;
            border-radius: 10px;
            border: 1px solid #e9ecef;
            min-height: 100px;
            max-height: 500px;
            overflow-y: auto;
        }

        .loading {
            text-align: center;
            color: #7f8c8d;
            font-style: italic;
        }

        .success {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
        }

        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #dc3545;
        }

        .game-mode-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin: 15px 0;
            border: 1px solid #e9ecef;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .mode-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .mode-title {
            font-size: 1.3em;
            font-weight: bold;
            color: #333;
        }

        .mode-type {
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: 500;
        }

        .mode-description {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.5;
        }

        .mode-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
        }

        .detail-item {
            text-align: center;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 8px;
        }

        .detail-label {
            font-size: 0.8em;
            color: #666;
            margin-bottom: 5px;
        }

        .detail-value {
            font-weight: bold;
            color: #333;
        }

        .session-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin: 15px 0;
            border: 1px solid #e9ecef;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .session-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .session-id {
            font-family: monospace;
            background: #f8f9fa;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }

        .session-status {
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: 500;
        }

        .status-waiting {
            background: #fff3cd;
            color: #856404;
        }

        .status-in-progress {
            background: #d4edda;
            color: #155724;
        }

        .status-completed {
            background: #cce5ff;
            color: #004085;
        }

        .players-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 10px 0;
        }

        .player-tag {
            background: #e9ecef;
            color: #495057;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
        }

        .achievement-card {
            background: white;
            border-radius: 10px;
            padding: 15px;
            margin: 10px 0;
            border: 1px solid #e9ecef;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .achievement-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .achievement-name {
            font-weight: bold;
            color: #333;
        }

        .achievement-difficulty {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7em;
            font-weight: 500;
        }

        .difficulty-bronze {
            background: #cd7f32;
            color: white;
        }

        .difficulty-silver {
            background: #c0c0c0;
            color: #333;
        }

        .difficulty-gold {
            background: #ffd700;
            color: #333;
        }

        .difficulty-platinum {
            background: #e5e4e2;
            color: #333;
        }

        .difficulty-diamond {
            background: #b9f2ff;
            color: #333;
        }

        .hero-card {
            background: white;
            border-radius: 10px;
            padding: 15px;
            margin: 10px 0;
            border: 1px solid #e9ecef;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .hero-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .hero-name {
            font-weight: bold;
            color: #333;
        }

        .hero-level {
            background: #667eea;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 500;
        }

        .hero-class {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 10px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 8px;
        }

        .stat-item {
            text-align: center;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 6px;
        }

        .stat-label {
            font-size: 0.7em;
            color: #666;
            margin-bottom: 2px;
        }

        .stat-value {
            font-weight: bold;
            color: #333;
        }

        .territory-card {
            background: white;
            border-radius: 10px;
            padding: 15px;
            margin: 10px 0;
            border: 1px solid #e9ecef;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .territory-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .territory-name {
            font-weight: bold;
            color: #333;
        }

        .territory-type {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7em;
            font-weight: 500;
            background: #667eea;
            color: white;
        }

        .territory-controller {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 10px;
        }

        .resources-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .resource-tag {
            background: #e9ecef;
            color: #495057;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
        }

        .quest-card {
            background: white;
            border-radius: 10px;
            padding: 15px;
            margin: 10px 0;
            border: 1px solid #e9ecef;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .quest-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .quest-name {
            font-weight: bold;
            color: #333;
        }

        .quest-difficulty {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7em;
            font-weight: 500;
            background: #28a745;
            color: white;
        }

        .quest-description {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 10px;
        }

        .objectives-list {
            margin-top: 10px;
        }

        .objective-item {
            background: #f8f9fa;
            padding: 8px;
            border-radius: 6px;
            margin: 5px 0;
            font-size: 0.9em;
        }

        .api-section {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 25px;
            margin: 30px;
        }

        .api-endpoint {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #667eea;
        }

        .endpoint-method {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
            margin-right: 10px;
        }

        .endpoint-path {
            font-family: monospace;
            font-weight: bold;
        }

        .endpoint-description {
            color: #666;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎮 Advanced Game Modes</h1>
            <p>COOP, Achievement, Conquest & Hero Game Modes with Unique Objectives & Mechanics</p>
        </div>

        <!-- Game Modes Overview -->
        <div class="game-modes-overview">
            <h3>🎯 Available Game Modes</h3>
            <div class="mode-badges">
                <div class="mode-badge">
                    <span class="mode-icon">🤝</span>
                    <span>COOP - Cooperative Defense</span>
                </div>
                <div class="mode-badge">
                    <span class="mode-icon">🏆</span>
                    <span>Achievement - Competitive Scoring</span>
                </div>
                <div class="mode-badge">
                    <span class="mode-icon">🌌</span>
                    <span>Conquest - Galactic Domination</span>
                </div>
                <div class="mode-badge">
                    <span class="mode-icon">⚔️</span>
                    <span>Hero - Adventure & Quests</span>
                </div>
            </div>
        </div>

        <div class="demo-tabs">
            <button class="tab active" onclick="showTab('game-modes')">🎮 Game Modes</button>
            <button class="tab" onclick="showTab('sessions')">🎯 Sessions</button>
            <button class="tab" onclick="showTab('achievements')">🏆 Achievements</button>
            <button class="tab" onclick="showTab('heroes')">⚔️ Heroes</button>
            <button class="tab" onclick="showTab('conquest')">🌌 Conquest</button>
            <button class="tab" onclick="showTab('quests')">📜 Quests</button>
        </div>

        <!-- Game Modes Tab -->
        <div id="game-modes" class="tab-content active">
            <div class="demo-section">
                <h3><span class="icon">🎮</span>Game Modes Management</h3>
                <p>Explore and manage different game modes with unique objectives and mechanics.</p>
                
                <div class="demo-controls">
                    <div class="control-grid">
                        <div class="control-group">
                            <label>Filter by Type:</label>
                            <select id="gameModeType">
                                <option value="">All Types</option>
                                <option value="COOP">COOP</option>
                                <option value="ACHIEVEMENT">Achievement</option>
                                <option value="CONQUEST">Conquest</option>
                                <option value="HERO">Hero</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Filter by Difficulty:</label>
                            <select id="gameModeDifficulty">
                                <option value="">All Difficulties</option>
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                                <option value="EXTREME">Extreme</option>
                                <option value="ADAPTIVE">Adaptive</option>
                            </select>
                        </div>
                    </div>
                    
                    <button onclick="loadGameModes()" class="btn">🎮 Load Game Modes</button>
                    <button onclick="getGameModeCapabilities()" class="btn btn-secondary">📋 View Capabilities</button>
                </div>
                
                <div id="gameModesResults" class="results-area"></div>
            </div>
        </div>

        <!-- Sessions Tab -->
        <div id="sessions" class="tab-content">
            <div class="demo-section">
                <h3><span class="icon">🎯</span>Session Management</h3>
                <p>Create, join, and manage game sessions with real-time updates.</p>
                
                <div class="demo-controls">
                    <div class="control-grid">
                        <div class="control-group">
                            <label>Game Mode for New Session:</label>
                            <select id="sessionGameMode">
                                <option value="coop_defense">COOP - Cooperative Defense</option>
                                <option value="achievement_challenge">Achievement Challenge</option>
                                <option value="galactic_conquest">Galactic Conquest</option>
                                <option value="hero_adventure">Hero Adventure</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Player ID:</label>
                            <input type="text" id="playerId" placeholder="Enter your player ID" value="demo_player_001">
                        </div>
                    </div>
                    
                    <button onclick="createSession()" class="btn btn-success">🎯 Create Session</button>
                    <button onclick="loadActiveSessions()" class="btn">📋 Load Active Sessions</button>
                    <button onclick="getPlayerSession()" class="btn btn-secondary">👤 My Session</button>
                </div>
                
                <div id="sessionsResults" class="results-area"></div>
            </div>
        </div>

        <!-- Achievements Tab -->
        <div id="achievements" class="tab-content">
            <div class="demo-section">
                <h3><span class="icon">🏆</span>Achievement System</h3>
                <p>Browse achievements and track player progress across different categories.</p>
                
                <div class="demo-controls">
                    <div class="control-grid">
                        <div class="control-group">
                            <label>Filter by Category:</label>
                            <select id="achievementCategory">
                                <option value="">All Categories</option>
                                <option value="COMBAT">Combat</option>
                                <option value="ECONOMIC">Economic</option>
                                <option value="TECHNOLOGICAL">Technological</option>
                                <option value="DIPLOMATIC">Diplomatic</option>
                                <option value="EXPLORATION">Exploration</option>
                                <option value="SPECIAL">Special</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Filter by Difficulty:</label>
                            <select id="achievementDifficulty">
                                <option value="">All Difficulties</option>
                                <option value="BRONZE">Bronze</option>
                                <option value="SILVER">Silver</option>
                                <option value="GOLD">Gold</option>
                                <option value="PLATINUM">Platinum</option>
                                <option value="DIAMOND">Diamond</option>
                            </select>
                        </div>
                    </div>
                    
                    <button onclick="loadAchievements()" class="btn">🏆 Load Achievements</button>
                    <button onclick="checkPlayerAchievements()" class="btn btn-success">✅ Check My Achievements</button>
                </div>
                
                <div id="achievementsResults" class="results-area"></div>
            </div>
        </div>

        <!-- Heroes Tab -->
        <div id="heroes" class="tab-content">
            <div class="demo-section">
                <h3><span class="icon">⚔️</span>Hero System</h3>
                <p>Manage heroes, classes, and progression in Hero mode adventures.</p>
                
                <div class="demo-controls">
                    <div class="control-grid">
                        <div class="control-group">
                            <label>Filter by Class:</label>
                            <select id="heroClass">
                                <option value="">All Classes</option>
                                <option value="warrior">Warrior</option>
                                <option value="mage">Mage</option>
                                <option value="rogue">Rogue</option>
                                <option value="cleric">Cleric</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Hero ID for Level Up:</label>
                            <input type="text" id="heroLevelUpId" placeholder="Enter hero ID">
                        </div>
                    </div>
                    
                    <button onclick="loadHeroes()" class="btn">⚔️ Load Heroes</button>
                    <button onclick="levelUpHero()" class="btn btn-warning">⬆️ Level Up Hero</button>
                </div>
                
                <div id="heroesResults" class="results-area"></div>
            </div>
        </div>

        <!-- Conquest Tab -->
        <div id="conquest" class="tab-content">
            <div class="demo-section">
                <h3><span class="icon">🌌</span>Conquest System</h3>
                <p>Manage territories, factions, and strategic conquest in galactic domination mode.</p>
                
                <div class="demo-controls">
                    <div class="control-grid">
                        <div class="control-group">
                            <label>Filter by Type:</label>
                            <select id="territoryType">
                                <option value="">All Types</option>
                                <option value="CAPITAL">Capital</option>
                                <option value="CITY">City</option>
                                <option value="FORTRESS">Fortress</option>
                                <option value="RESOURCE">Resource</option>
                                <option value="STRATEGIC">Strategic</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Territory ID for Capture:</label>
                            <input type="text" id="territoryId" placeholder="Enter territory ID">
                        </div>
                    </div>
                    
                    <button onclick="loadTerritories()" class="btn">🌌 Load Territories</button>
                    <button onclick="captureTerritory()" class="btn btn-danger">⚔️ Capture Territory</button>
                </div>
                
                <div id="conquestResults" class="results-area"></div>
            </div>
        </div>

        <!-- Quests Tab -->
        <div id="quests" class="tab-content">
            <div class="demo-section">
                <h3><span class="icon">📜</span>Quest System</h3>
                <p>Browse and complete quests in Hero mode adventures with various objectives.</p>
                
                <div class="demo-controls">
                    <div class="control-grid">
                        <div class="control-group">
                            <label>Filter by Type:</label>
                            <select id="questType">
                                <option value="">All Types</option>
                                <option value="MAIN">Main</option>
                                <option value="SIDE">Side</option>
                                <option value="DAILY">Daily</option>
                                <option value="WEEKLY">Weekly</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Quest ID for Completion:</label>
                            <input type="text" id="questId" placeholder="Enter quest ID">
                        </div>
                    </div>
                    
                    <button onclick="loadQuests()" class="btn">📜 Load Quests</button>
                    <button onclick="completeQuest()" class="btn btn-success">✅ Complete Quest</button>
                </div>
                
                <div id="questsResults" class="results-area"></div>
            </div>
        </div>

        <!-- API Documentation -->
        <div class="api-section">
            <h3>🔗 API Endpoints</h3>
            <div class="api-endpoint">
                <span class="endpoint-method">GET</span>
                <span class="endpoint-path">/api/game-modes</span>
                <div class="endpoint-description">Get all available game modes with filtering options</div>
            </div>
            <div class="api-endpoint">
                <span class="endpoint-method">POST</span>
                <span class="endpoint-path">/api/game-modes/sessions</span>
                <div class="endpoint-description">Create new game session for specified game mode</div>
            </div>
            <div class="api-endpoint">
                <span class="endpoint-method">POST</span>
                <span class="endpoint-path">/api/game-modes/sessions/:id/join</span>
                <div class="endpoint-description">Join existing game session</div>
            </div>
            <div class="api-endpoint">
                <span class="endpoint-method">POST</span>
                <span class="endpoint-path">/api/game-modes/sessions/:id/start</span>
                <div class="endpoint-description">Start game session when ready</div>
            </div>
            <div class="api-endpoint">
                <span class="endpoint-method">GET</span>
                <span class="endpoint-path">/api/game-modes/achievements</span>
                <div class="endpoint-description">Get achievements with category and difficulty filtering</div>
            </div>
            <div class="api-endpoint">
                <span class="endpoint-method">GET</span>
                <span class="endpoint-path">/api/game-modes/heroes</span>
                <div class="endpoint-description">Get heroes with class and level filtering</div>
            </div>
            <div class="api-endpoint">
                <span class="endpoint-method">GET</span>
                <span class="endpoint-path">/api/game-modes/territories</span>
                <div class="endpoint-description">Get territories for conquest mode</div>
            </div>
            <div class="api-endpoint">
                <span class="endpoint-method">GET</span>
                <span class="endpoint-path">/api/game-modes/quests</span>
                <div class="endpoint-description">Get quests with type and category filtering</div>
            </div>
        </div>
    </div>

    <script>
        let currentSessionId = null;

        // ===== TAB MANAGEMENT =====

        function showTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabName).classList.add('active');
            
            // Add active class to clicked tab
            event.target.classList.add('active');
        }

        // ===== GAME MODES FUNCTIONS =====

        async function loadGameModes() {
            const resultsArea = document.getElementById('gameModesResults');
            resultsArea.innerHTML = '<div class="loading">🎮 Loading game modes...</div>';

            try {
                const type = document.getElementById('gameModeType').value;
                const difficulty = document.getElementById('gameModeDifficulty').value;

                let url = '/api/game-modes';
                const params = new URLSearchParams();
                if (type) params.append('type', type);
                if (difficulty) params.append('difficulty', difficulty);
                if (params.toString()) url += '?' + params.toString();

                const response = await fetch(url);
                const data = await response.json();

                if (data.success) {
                    displayGameModes(data.gameModes, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to load game modes: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Game modes loading error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to load game modes due to network error</div>';
            }
        }

        async function getGameModeCapabilities() {
            const resultsArea = document.getElementById('gameModesResults');
            resultsArea.innerHTML = '<div class="loading">📋 Loading capabilities...</div>';

            try {
                const response = await fetch('/api/game-modes/capabilities');
                const data = await response.json();

                if (data.success) {
                    displayCapabilities(data.capabilities, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to load capabilities: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Capabilities loading error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to load capabilities due to network error</div>';
            }
        }

        // ===== SESSION FUNCTIONS =====

        async function createSession() {
            const resultsArea = document.getElementById('sessionsResults');
            resultsArea.innerHTML = '<div class="loading">🎯 Creating session...</div>';

            try {
                const gameModeId = document.getElementById('sessionGameMode').value;
                const hostPlayerId = document.getElementById('playerId').value;

                if (!hostPlayerId) {
                    resultsArea.innerHTML = '<div class="error">Please enter a player ID</div>';
                    return;
                }

                const response = await fetch('/api/game-modes/sessions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        gameModeId: gameModeId,
                        hostPlayerId: hostPlayerId
                    })
                });

                const data = await response.json();

                if (data.success) {
                    currentSessionId = data.session.id;
                    displaySession(data.session, resultsArea, 'Session created successfully!');
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to create session: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Session creation error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to create session due to network error</div>';
            }
        }

        async function loadActiveSessions() {
            const resultsArea = document.getElementById('sessionsResults');
            resultsArea.innerHTML = '<div class="loading">📋 Loading active sessions...</div>';

            try {
                const response = await fetch('/api/game-modes/sessions');
                const data = await response.json();

                if (data.success) {
                    displaySessions(data.sessions, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to load sessions: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Sessions loading error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to load sessions due to network error</div>';
            }
        }

        async function getPlayerSession() {
            const resultsArea = document.getElementById('sessionsResults');
            resultsArea.innerHTML = '<div class="loading">👤 Loading player session...</div>';

            try {
                const playerId = document.getElementById('playerId').value;

                if (!playerId) {
                    resultsArea.innerHTML = '<div class="error">Please enter a player ID</div>';
                    return;
                }

                const response = await fetch(\`/api/game-modes/player/\${playerId}/session\`);
                const data = await response.json();

                if (data.success) {
                    currentSessionId = data.session.id;
                    displaySession(data.session, resultsArea, 'Your current session:');
                } else {
                    resultsArea.innerHTML = \`<div class="error">No active session found for player</div>\`;
                }

            } catch (error) {
                console.error('Player session loading error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to load player session due to network error</div>';
            }
        }

        // ===== ACHIEVEMENT FUNCTIONS =====

        async function loadAchievements() {
            const resultsArea = document.getElementById('achievementsResults');
            resultsArea.innerHTML = '<div class="loading">🏆 Loading achievements...</div>';

            try {
                const category = document.getElementById('achievementCategory').value;
                const difficulty = document.getElementById('achievementDifficulty').value;

                let url = '/api/game-modes/achievements';
                const params = new URLSearchParams();
                if (category) params.append('category', category);
                if (difficulty) params.append('difficulty', difficulty);
                if (params.toString()) url += '?' + params.toString();

                const response = await fetch(url);
                const data = await response.json();

                if (data.success) {
                    displayAchievements(data.achievements, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to load achievements: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Achievements loading error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to load achievements due to network error</div>';
            }
        }

        async function checkPlayerAchievements() {
            const resultsArea = document.getElementById('achievementsResults');
            resultsArea.innerHTML = '<div class="loading">✅ Checking achievements...</div>';

            try {
                const playerId = document.getElementById('playerId').value;

                if (!playerId || !currentSessionId) {
                    resultsArea.innerHTML = '<div class="error">Please enter a player ID and create/join a session first</div>';
                    return;
                }

                const response = await fetch('/api/game-modes/achievements/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        playerId: playerId,
                        sessionId: currentSessionId
                    })
                });

                const data = await response.json();

                if (data.success) {
                    displayPlayerAchievements(data.achievements, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to check achievements: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Achievement check error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to check achievements due to network error</div>';
            }
        }

        // ===== HERO FUNCTIONS =====

        async function loadHeroes() {
            const resultsArea = document.getElementById('heroesResults');
            resultsArea.innerHTML = '<div class="loading">⚔️ Loading heroes...</div>';

            try {
                const heroClass = document.getElementById('heroClass').value;

                let url = '/api/game-modes/heroes';
                if (heroClass) url += \`?class=\${heroClass}\`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.success) {
                    displayHeroes(data.heroes, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to load heroes: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Heroes loading error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to load heroes due to network error</div>';
            }
        }

        async function levelUpHero() {
            const resultsArea = document.getElementById('heroesResults');
            resultsArea.innerHTML = '<div class="loading">⬆️ Leveling up hero...</div>';

            try {
                const heroId = document.getElementById('heroLevelUpId').value;

                if (!heroId || !currentSessionId) {
                    resultsArea.innerHTML = '<div class="error">Please enter a hero ID and create/join a session first</div>';
                    return;
                }

                const response = await fetch(\`/api/game-modes/heroes/\${heroId}/level-up\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId: currentSessionId
                    })
                });

                const data = await response.json();

                if (data.success) {
                    displayHero(data.hero, resultsArea, 'Hero leveled up successfully!');
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to level up hero: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Hero level up error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to level up hero due to network error</div>';
            }
        }

        // ===== CONQUEST FUNCTIONS =====

        async function loadTerritories() {
            const resultsArea = document.getElementById('conquestResults');
            resultsArea.innerHTML = '<div class="loading">🌌 Loading territories...</div>';

            try {
                const type = document.getElementById('territoryType').value;

                let url = '/api/game-modes/territories';
                if (type) url += \`?type=\${type}\`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.success) {
                    displayTerritories(data.territories, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to load territories: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Territories loading error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to load territories due to network error</div>';
            }
        }

        async function captureTerritory() {
            const resultsArea = document.getElementById('conquestResults');
            resultsArea.innerHTML = '<div class="loading">⚔️ Capturing territory...</div>';

            try {
                const territoryId = document.getElementById('territoryId').value;
                const playerId = document.getElementById('playerId').value;

                if (!territoryId || !playerId || !currentSessionId) {
                    resultsArea.innerHTML = '<div class="error">Please enter territory ID, player ID, and create/join a session first</div>';
                    return;
                }

                const response = await fetch(\`/api/game-modes/territories/\${territoryId}/capture\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        playerId: playerId,
                        sessionId: currentSessionId
                    })
                });

                const data = await response.json();

                if (data.success) {
                    displayTerritory(data.territory, resultsArea, 'Territory captured successfully!');
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to capture territory: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Territory capture error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to capture territory due to network error</div>';
            }
        }

        // ===== QUEST FUNCTIONS =====

        async function loadQuests() {
            const resultsArea = document.getElementById('questsResults');
            resultsArea.innerHTML = '<div class="loading">📜 Loading quests...</div>';

            try {
                const type = document.getElementById('questType').value;

                let url = '/api/game-modes/quests';
                if (type) url += \`?type=\${type}\`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.success) {
                    displayQuests(data.quests, resultsArea);
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to load quests: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Quests loading error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to load quests due to network error</div>';
            }
        }

        async function completeQuest() {
            const resultsArea = document.getElementById('questsResults');
            resultsArea.innerHTML = '<div class="loading">✅ Completing quest...</div>';

            try {
                const questId = document.getElementById('questId').value;
                const playerId = document.getElementById('playerId').value;

                if (!questId || !playerId || !currentSessionId) {
                    resultsArea.innerHTML = '<div class="error">Please enter quest ID, player ID, and create/join a session first</div>';
                    return;
                }

                const response = await fetch(\`/api/game-modes/quests/\${questId}/complete\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        playerId: playerId,
                        sessionId: currentSessionId
                    })
                });

                const data = await response.json();

                if (data.success) {
                    resultsArea.innerHTML = \`<div class="success">Quest completed successfully!</div>\`;
                } else {
                    resultsArea.innerHTML = \`<div class="error">Failed to complete quest: \${data.error}</div>\`;
                }

            } catch (error) {
                console.error('Quest completion error:', error);
                resultsArea.innerHTML = '<div class="error">Failed to complete quest due to network error</div>';
            }
        }

        // ===== DISPLAY FUNCTIONS =====

        function displayGameModes(gameModes, container) {
            let html = \`
                <div class="success">
                    <h4>🎮 Game Modes (\${gameModes.length})</h4>
            \`;

            if (gameModes.length === 0) {
                html += '<p>No game modes found.</p>';
            } else {
                gameModes.forEach(mode => {
                    html += \`
                        <div class="game-mode-card">
                            <div class="mode-header">
                                <div class="mode-title">\${mode.name}</div>
                                <div class="mode-type">\${mode.type}</div>
                            </div>
                            <div class="mode-description">\${mode.description}</div>
                            <div class="mode-details">
                                <div class="detail-item">
                                    <div class="detail-label">Players</div>
                                    <div class="detail-value">\${mode.playerCount.min}-\${mode.playerCount.max}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Duration</div>
                                    <div class="detail-value">\${mode.duration.estimated}min</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Difficulty</div>
                                    <div class="detail-value">\${mode.difficulty}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Objectives</div>
                                    <div class="detail-value">\${mode.objectives.length}</div>
                                </div>
                            </div>
                        </div>
                    \`;
                });
            }

            html += '</div>';
            container.innerHTML = html;
        }

        function displayCapabilities(capabilities, container) {
            let html = \`
                <div class="success">
                    <h4>📋 Game Modes Capabilities</h4>
                    <div class="demo-section">
                        <h5>Game Mode Types</h5>
                        <p>\${capabilities.gameModeTypes.join(', ')}</p>
                    </div>
                    <div class="demo-section">
                        <h5>Difficulty Levels</h5>
                        <p>\${capabilities.difficultyLevels.join(', ')}</p>
                    </div>
                    <div class="demo-section">
                        <h5>Victory Types</h5>
                        <p>\${capabilities.victoryTypes.join(', ')}</p>
                    </div>
                    <div class="demo-section">
                        <h5>Features</h5>
                        <ul>
            \`;

            Object.entries(capabilities.features).forEach(([feature, enabled]) => {
                html += \`<li>\${feature}: \${enabled ? '✅' : '❌'}</li>\`;
            });

            html += \`
                        </ul>
                    </div>
                </div>
            \`;

            container.innerHTML = html;
        }

        function displaySessions(sessions, container) {
            let html = \`
                <div class="success">
                    <h4>📋 Active Sessions (\${sessions.length})</h4>
            \`;

            if (sessions.length === 0) {
                html += '<p>No active sessions found.</p>';
            } else {
                sessions.forEach(session => {
                    html += \`
                        <div class="session-card">
                            <div class="session-header">
                                <div class="session-id">\${session.id}</div>
                                <div class="session-status status-\${session.status.toLowerCase().replace('_', '-')}">\${session.status}</div>
                            </div>
                            <div><strong>Game Mode:</strong> \${session.gameMode.name}</div>
                            <div><strong>Players:</strong> \${session.players.length}/\${session.gameMode.playerCount.max}</div>
                            <div class="players-list">
                                \${session.players.map(player => \`<span class="player-tag">\${player.playerName}</span>\`).join('')}
                            </div>
                            <div><strong>Started:</strong> \${new Date(session.startTime).toLocaleString()}</div>
                        </div>
                    \`;
                });
            }

            html += '</div>';
            container.innerHTML = html;
        }

        function displaySession(session, container, message) {
            let html = \`
                <div class="success">
                    <h4>\${message}</h4>
                    <div class="session-card">
                        <div class="session-header">
                            <div class="session-id">\${session.id}</div>
                            <div class="session-status status-\${session.status.toLowerCase().replace('_', '-')}">\${session.status}</div>
                        </div>
                        <div><strong>Game Mode:</strong> \${session.gameMode.name}</div>
                        <div><strong>Type:</strong> \${session.gameMode.type}</div>
                        <div><strong>Players:</strong> \${session.players.length}/\${session.gameMode.playerCount.max}</div>
                        <div class="players-list">
                            \${session.players.map(player => \`<span class="player-tag">\${player.playerName}</span>\`).join('')}
                        </div>
                        <div><strong>Started:</strong> \${new Date(session.startTime).toLocaleString()}</div>
                    </div>
                </div>
            \`;
            container.innerHTML = html;
        }

        function displayAchievements(achievements, container) {
            let html = \`
                <div class="success">
                    <h4>🏆 Achievements (\${achievements.length})</h4>
            \`;

            if (achievements.length === 0) {
                html += '<p>No achievements found.</p>';
            } else {
                achievements.forEach(achievement => {
                    html += \`
                        <div class="achievement-card">
                            <div class="achievement-header">
                                <div class="achievement-name">\${achievement.name}</div>
                                <div class="achievement-difficulty difficulty-\${achievement.difficulty.toLowerCase()}">\${achievement.difficulty}</div>
                            </div>
                            <div class="achievement-description">\${achievement.description}</div>
                            <div><strong>Category:</strong> \${achievement.category}</div>
                            <div><strong>Points:</strong> \${achievement.points}</div>
                            <div><strong>Completion Rate:</strong> \${achievement.statistics.completionRate.toFixed(1)}%</div>
                        </div>
                    \`;
                });
            }

            html += '</div>';
            container.innerHTML = html;
        }

        function displayPlayerAchievements(achievements, container) {
            let html = \`
                <div class="success">
                    <h4>✅ Your Achievements (\${achievements.length})</h4>
            \`;

            if (achievements.length === 0) {
                html += '<p>No achievements earned in this session.</p>';
            } else {
                achievements.forEach(achievement => {
                    html += \`
                        <div class="achievement-card">
                            <div class="achievement-header">
                                <div class="achievement-name">🎉 \${achievement.name}</div>
                                <div class="achievement-difficulty difficulty-\${achievement.difficulty.toLowerCase()}">\${achievement.difficulty}</div>
                            </div>
                            <div class="achievement-description">\${achievement.description}</div>
                            <div><strong>Points Earned:</strong> \${achievement.points}</div>
                        </div>
                    \`;
                });
            }

            html += '</div>';
            container.innerHTML = html;
        }

        function displayHeroes(heroes, container) {
            let html = \`
                <div class="success">
                    <h4>⚔️ Heroes (\${heroes.length})</h4>
            \`;

            if (heroes.length === 0) {
                html += '<p>No heroes found.</p>';
            } else {
                heroes.forEach(hero => {
                    html += \`
                        <div class="hero-card">
                            <div class="hero-header">
                                <div class="hero-name">\${hero.name}</div>
                                <div class="hero-level">Level \${hero.level}</div>
                            </div>
                            <div class="hero-class">\${hero.class.name} - \${hero.class.description}</div>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <div class="stat-label">Health</div>
                                    <div class="stat-value">\${hero.stats.health}</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Mana</div>
                                    <div class="stat-value">\${hero.stats.mana}</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Strength</div>
                                    <div class="stat-value">\${hero.stats.strength}</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Agility</div>
                                    <div class="stat-value">\${hero.stats.agility}</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Intelligence</div>
                                    <div class="stat-value">\${hero.stats.intelligence}</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Armor</div>
                                    <div class="stat-value">\${hero.stats.armor}</div>
                                </div>
                            </div>
                        </div>
                    \`;
                });
            }

            html += '</div>';
            container.innerHTML = html;
        }

        function displayHero(hero, container, message) {
            let html = \`
                <div class="success">
                    <h4>\${message}</h4>
                    <div class="hero-card">
                        <div class="hero-header">
                            <div class="hero-name">\${hero.name}</div>
                            <div class="hero-level">Level \${hero.level}</div>
                        </div>
                        <div class="hero-class">\${hero.class.name} - \${hero.class.description}</div>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-label">Health</div>
                                <div class="stat-value">\${hero.stats.health}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Mana</div>
                                <div class="stat-value">\${hero.stats.mana}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Strength</div>
                                <div class="stat-value">\${hero.stats.strength}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Agility</div>
                                <div class="stat-value">\${hero.stats.agility}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Intelligence</div>
                                <div class="stat-value">\${hero.stats.intelligence}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Armor</div>
                                <div class="stat-value">\${hero.stats.armor}</div>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
            container.innerHTML = html;
        }

        function displayTerritories(territories, container) {
            let html = \`
                <div class="success">
                    <h4>🌌 Territories (\${territories.length})</h4>
            \`;

            if (territories.length === 0) {
                html += '<p>No territories found.</p>';
            } else {
                territories.forEach(territory => {
                    html += \`
                        <div class="territory-card">
                            <div class="territory-header">
                                <div class="territory-name">\${territory.name}</div>
                                <div class="territory-type">\${territory.type}</div>
                            </div>
                            <div class="territory-controller">
                                <strong>Controlled by:</strong> \${territory.controlledBy || 'Neutral'}
                            </div>
                            <div><strong>Defense Value:</strong> \${territory.defenseValue}</div>
                            <div><strong>Population:</strong> \${territory.population.toLocaleString()}</div>
                            <div class="resources-list">
                                \${territory.resources.map(resource => 
                                    \`<span class="resource-tag">\${resource.type}: \${resource.amount}</span>\`
                                ).join('')}
                            </div>
                        </div>
                    \`;
                });
            }

            html += '</div>';
            container.innerHTML = html;
        }

        function displayTerritory(territory, container, message) {
            let html = \`
                <div class="success">
                    <h4>\${message}</h4>
                    <div class="territory-card">
                        <div class="territory-header">
                            <div class="territory-name">\${territory.name}</div>
                            <div class="territory-type">\${territory.type}</div>
                        </div>
                        <div class="territory-controller">
                            <strong>Controlled by:</strong> \${territory.controlledBy || 'Neutral'}
                        </div>
                        <div><strong>Defense Value:</strong> \${territory.defenseValue}</div>
                        <div><strong>Population:</strong> \${territory.population.toLocaleString()}</div>
                        <div class="resources-list">
                            \${territory.resources.map(resource => 
                                \`<span class="resource-tag">\${resource.type}: \${resource.amount}</span>\`
                            ).join('')}
                        </div>
                    </div>
                </div>
            \`;
            container.innerHTML = html;
        }

        function displayQuests(quests, container) {
            let html = \`
                <div class="success">
                    <h4>📜 Quests (\${quests.length})</h4>
            \`;

            if (quests.length === 0) {
                html += '<p>No quests found.</p>';
            } else {
                quests.forEach(quest => {
                    html += \`
                        <div class="quest-card">
                            <div class="quest-header">
                                <div class="quest-name">\${quest.name}</div>
                                <div class="quest-difficulty">\${quest.difficulty}</div>
                            </div>
                            <div class="quest-description">\${quest.description}</div>
                            <div><strong>Type:</strong> \${quest.type}</div>
                            <div><strong>Category:</strong> \${quest.category}</div>
                            <div><strong>Level:</strong> \${quest.level}</div>
                            <div class="objectives-list">
                                <strong>Objectives:</strong>
                                \${quest.objectives.map(obj => 
                                    \`<div class="objective-item">\${obj.description} (\${obj.currentProgress}/\${obj.requiredProgress})</div>\`
                                ).join('')}
                            </div>
                        </div>
                    \`;
                });
            }

            html += '</div>';
            container.innerHTML = html;
        }

        // Load initial data
        document.addEventListener('DOMContentLoaded', function() {
            loadGameModes();
        });
    </script>
</body>
</html>
  `;

  res.send(html);
});

export default router;
