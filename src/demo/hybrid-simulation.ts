/**
 * Hybrid Simulation Demo Interface
 * Interactive demonstration of the 120-second strategic tick hybrid simulation engine
 */

import { Router } from 'express';

export const hybridSimulationDemo = Router();

hybridSimulationDemo.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hybrid Simulation Engine - Strategic Ticks Demo</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 1400px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
                border: 1px solid rgba(255, 255, 255, 0.18);
            }
            h1 {
                text-align: center;
                margin-bottom: 10px;
                font-size: 2.5em;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .subtitle {
                text-align: center;
                margin-bottom: 30px;
                font-size: 1.2em;
                opacity: 0.9;
            }
            .section {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 25px;
                margin: 20px 0;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .section h2 {
                margin-top: 0;
                color: #ffd700;
                border-bottom: 2px solid #ffd700;
                padding-bottom: 10px;
            }
            .controls {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }
            .control-group {
                background: rgba(255, 255, 255, 0.1);
                padding: 20px;
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .control-group h3 {
                margin-top: 0;
                color: #87ceeb;
            }
            button {
                background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                margin: 5px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }
            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            }
            button:disabled {
                background: #666;
                cursor: not-allowed;
                transform: none;
            }
            .success { background: linear-gradient(45deg, #00b894, #00a085); }
            .warning { background: linear-gradient(45deg, #fdcb6e, #e17055); }
            .info { background: linear-gradient(45deg, #74b9ff, #0984e3); }
            input, select {
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 8px;
                padding: 10px;
                color: white;
                margin: 5px;
                width: 200px;
            }
            input::placeholder {
                color: rgba(255, 255, 255, 0.7);
            }
            .status-display {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }
            .status-card {
                background: rgba(255, 255, 255, 0.1);
                padding: 15px;
                border-radius: 10px;
                border-left: 4px solid #ffd700;
            }
            .status-card h4 {
                margin: 0 0 10px 0;
                color: #ffd700;
            }
            .tick-timeline {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                font-family: monospace;
                max-height: 400px;
                overflow-y: auto;
            }
            .tick-entry {
                padding: 10px;
                margin: 5px 0;
                border-radius: 5px;
                border-left: 4px solid #00b894;
                background: rgba(255, 255, 255, 0.1);
            }
            .tick-entry.processing {
                border-left-color: #fdcb6e;
                animation: pulse 1s infinite;
            }
            .tick-entry.error {
                border-left-color: #e17055;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }
            .metric-card {
                background: rgba(255, 255, 255, 0.1);
                padding: 15px;
                border-radius: 10px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .metric-value {
                font-size: 2em;
                font-weight: bold;
                color: #ffd700;
            }
            .metric-label {
                font-size: 0.9em;
                opacity: 0.8;
                margin-top: 5px;
            }
            .countdown {
                font-size: 1.5em;
                font-weight: bold;
                text-align: center;
                padding: 15px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                margin: 10px 0;
            }
            .countdown.active {
                color: #00b894;
                animation: pulse 2s infinite;
            }
            .narrative-panel {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                max-height: 300px;
                overflow-y: auto;
            }
            .narrative-entry {
                margin: 10px 0;
                padding: 10px;
                border-radius: 5px;
                background: rgba(255, 255, 255, 0.1);
            }
            .event-alert {
                background: linear-gradient(45deg, #e17055, #d63031);
                padding: 15px;
                border-radius: 10px;
                margin: 10px 0;
                border-left: 4px solid #fff;
                animation: slideIn 0.5s ease-out;
            }
            @keyframes slideIn {
                from { transform: translateX(-100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔄 Hybrid Simulation Engine</h1>
            <p class="subtitle">Strategic 120-Second Ticks • Deterministic + AI Analysis • Real-Time Strategy</p>
            
            <!-- Campaign Management -->
            <div class="section">
                <h2>🎮 Campaign Management</h2>
                <div class="controls">
                    <div class="control-group">
                        <h3>Register Campaign</h3>
                        <input type="number" id="campaignId" placeholder="Campaign ID" value="1">
                        <select id="tickMode">
                            <option value="strategic">Strategic (120s)</option>
                            <option value="accelerated">Accelerated (60s)</option>
                            <option value="idle">Idle (300s)</option>
                        </select>
                        <br>
                        <button onclick="registerCampaign()" class="success">Register Campaign</button>
                    </div>
                    <div class="control-group">
                        <h3>Campaign Controls</h3>
                        <button onclick="startCampaign()" class="success">Start Simulation</button>
                        <button onclick="stopCampaign()" class="warning">Stop Simulation</button>
                        <button onclick="unregisterCampaign()" class="warning">Unregister</button>
                        <br>
                        <button onclick="manualTick()" class="info">Manual Tick</button>
                    </div>
                </div>
            </div>

            <!-- Campaign Status -->
            <div class="section">
                <h2>📊 Campaign Status</h2>
                <div id="campaignStatus" class="status-display">
                    <div class="status-card">
                        <h4>Campaign State</h4>
                        <div id="campaignState">Not Registered</div>
                    </div>
                    <div class="status-card">
                        <h4>Tick Mode</h4>
                        <div id="currentTickMode">-</div>
                    </div>
                    <div class="status-card">
                        <h4>Next Tick</h4>
                        <div id="nextTickCountdown" class="countdown">-</div>
                    </div>
                    <div class="status-card">
                        <h4>Active Players</h4>
                        <div id="activePlayers">0</div>
                    </div>
                </div>
            </div>

            <!-- Performance Metrics -->
            <div class="section">
                <h2>⚡ Performance Metrics</h2>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-value" id="tickCount">0</div>
                        <div class="metric-label">Total Ticks</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" id="avgTickTime">0ms</div>
                        <div class="metric-label">Avg Tick Time</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" id="errorCount">0</div>
                        <div class="metric-label">Error Count</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" id="queuedActions">0</div>
                        <div class="metric-label">Queued Actions</div>
                    </div>
                </div>
            </div>

            <!-- Player Actions -->
            <div class="section">
                <h2>🎯 Player Actions</h2>
                <div class="controls">
                    <div class="control-group">
                        <h3>Queue Action</h3>
                        <input type="text" id="playerId" placeholder="Player ID" value="player1">
                        <select id="actionType">
                            <option value="policy">Policy Change</option>
                            <option value="building">Building Order</option>
                            <option value="research">Research Directive</option>
                            <option value="military">Military Command</option>
                            <option value="diplomacy">Diplomatic Action</option>
                            <option value="trade">Trade Agreement</option>
                        </select>
                        <select id="actionPriority">
                            <option value="low">Low Priority</option>
                            <option value="medium" selected>Medium Priority</option>
                            <option value="high">High Priority</option>
                            <option value="critical">Critical Priority</option>
                        </select>
                        <br>
                        <button onclick="queueAction()" class="info">Queue Action</button>
                        <button onclick="getQueuedActions()" class="info">View Queue</button>
                    </div>
                </div>
            </div>

            <!-- Tick Timeline -->
            <div class="section">
                <h2>📈 Tick Timeline</h2>
                <div id="tickTimeline" class="tick-timeline">
                    <div style="text-align: center; opacity: 0.7;">Tick history will appear here...</div>
                </div>
            </div>

            <!-- AI Analysis Results -->
            <div class="section">
                <h2>🧠 AI Analysis & Narrative</h2>
                <div id="narrativePanel" class="narrative-panel">
                    <div style="text-align: center; opacity: 0.7;">AI-generated narrative analysis will appear here after ticks...</div>
                </div>
            </div>

            <!-- Emergent Events -->
            <div class="section">
                <h2>⚡ Emergent Events & Crises</h2>
                <div id="eventsPanel">
                    <div style="text-align: center; opacity: 0.7;">Emergent events and crisis alerts will appear here...</div>
                </div>
            </div>

            <!-- System Health -->
            <div class="section">
                <h2>🏥 System Health</h2>
                <button onclick="checkHealth()" class="info">Check System Health</button>
                <div id="healthStatus" style="margin-top: 15px;"></div>
            </div>
        </div>

        <script>
            let currentCampaignId = 1;
            let statusUpdateInterval;
            let countdownInterval;

            // Initialize demo
            document.addEventListener('DOMContentLoaded', function() {
                updateStatus();
                startStatusUpdates();
            });

            // Campaign Management Functions
            async function registerCampaign() {
                const campaignId = document.getElementById('campaignId').value;
                const tickMode = document.getElementById('tickMode').value;
                
                try {
                    const response = await fetch(\`/api/hybrid-simulation/campaigns/\${campaignId}/register\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tickMode })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        currentCampaignId = parseInt(campaignId);
                        addToTimeline(\`Campaign \${campaignId} registered with \${tickMode} mode\`, 'success');
                        updateStatus();
                    } else {
                        addToTimeline(\`Registration failed: \${result.message}\`, 'error');
                    }
                } catch (error) {
                    addToTimeline(\`Registration error: \${error.message}\`, 'error');
                }
            }

            async function startCampaign() {
                try {
                    const response = await fetch(\`/api/hybrid-simulation/campaigns/\${currentCampaignId}/start\`, {
                        method: 'POST'
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        addToTimeline(\`Campaign \${currentCampaignId} simulation started\`, 'success');
                        updateStatus();
                        startCountdown();
                    } else {
                        addToTimeline(\`Start failed: \${result.message}\`, 'error');
                    }
                } catch (error) {
                    addToTimeline(\`Start error: \${error.message}\`, 'error');
                }
            }

            async function stopCampaign() {
                try {
                    const response = await fetch(\`/api/hybrid-simulation/campaigns/\${currentCampaignId}/stop\`, {
                        method: 'POST'
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        addToTimeline(\`Campaign \${currentCampaignId} simulation stopped\`, 'warning');
                        updateStatus();
                        stopCountdown();
                    } else {
                        addToTimeline(\`Stop failed: \${result.message}\`, 'error');
                    }
                } catch (error) {
                    addToTimeline(\`Stop error: \${error.message}\`, 'error');
                }
            }

            async function unregisterCampaign() {
                try {
                    const response = await fetch(\`/api/hybrid-simulation/campaigns/\${currentCampaignId}\`, {
                        method: 'DELETE'
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        addToTimeline(\`Campaign \${currentCampaignId} unregistered\`, 'warning');
                        updateStatus();
                        stopCountdown();
                    } else {
                        addToTimeline(\`Unregister failed: \${result.message}\`, 'error');
                    }
                } catch (error) {
                    addToTimeline(\`Unregister error: \${error.message}\`, 'error');
                }
            }

            async function manualTick() {
                addToTimeline(\`Manual tick triggered for campaign \${currentCampaignId}\`, 'processing');
                
                try {
                    const response = await fetch(\`/api/hybrid-simulation/campaigns/\${currentCampaignId}/tick\`, {
                        method: 'POST'
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        const tick = result.tick;
                        addToTimeline(\`Tick \${tick.tickId} completed in \${tick.processingTime}ms\`, 'success');
                        
                        // Update narrative panel
                        updateNarrativePanel(tick);
                        
                        // Update events panel
                        updateEventsPanel(tick);
                        
                        updateStatus();
                    } else {
                        addToTimeline(\`Manual tick failed: \${result.message}\`, 'error');
                    }
                } catch (error) {
                    addToTimeline(\`Manual tick error: \${error.message}\`, 'error');
                }
            }

            // Player Action Functions
            async function queueAction() {
                const playerId = document.getElementById('playerId').value;
                const actionType = document.getElementById('actionType').value;
                const priority = document.getElementById('actionPriority').value;
                
                const actionData = {
                    type: actionType,
                    description: \`\${actionType} action from \${playerId}\`,
                    timestamp: new Date().toISOString()
                };
                
                try {
                    const response = await fetch(\`/api/hybrid-simulation/campaigns/\${currentCampaignId}/actions\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            playerId,
                            actionType,
                            actionData,
                            priority,
                            requiresImmediate: priority === 'critical',
                            affectsSimulation: true
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        addToTimeline(\`Action queued: \${actionType} (\${priority} priority)\`, 'success');
                        updateStatus();
                    } else {
                        addToTimeline(\`Action queue failed: \${result.message}\`, 'error');
                    }
                } catch (error) {
                    addToTimeline(\`Action queue error: \${error.message}\`, 'error');
                }
            }

            async function getQueuedActions() {
                try {
                    const response = await fetch(\`/api/hybrid-simulation/campaigns/\${currentCampaignId}/actions\`);
                    const result = await response.json();
                    
                    if (result.success) {
                        addToTimeline(\`\${result.totalActions} actions in queue\`, 'info');
                        console.log('Queued actions:', result.queuedActions);
                    } else {
                        addToTimeline(\`Get actions failed: \${result.message}\`, 'error');
                    }
                } catch (error) {
                    addToTimeline(\`Get actions error: \${error.message}\`, 'error');
                }
            }

            // Status Update Functions
            async function updateStatus() {
                try {
                    const response = await fetch(\`/api/hybrid-simulation/campaigns/\${currentCampaignId}/status\`);
                    const result = await response.json();
                    
                    if (result.success) {
                        const status = result.status;
                        
                        document.getElementById('campaignState').textContent = 
                            status.isActive ? 'Active' : 'Inactive';
                        document.getElementById('currentTickMode').textContent = 
                            \`\${status.currentMode.mode} (\${status.currentMode.interval/1000}s)\`;
                        document.getElementById('activePlayers').textContent = 
                            status.activePlayers.length;
                        document.getElementById('tickCount').textContent = status.tickCount;
                        document.getElementById('avgTickTime').textContent = 
                            \`\${Math.round(status.averageTickTime)}ms\`;
                        document.getElementById('errorCount').textContent = status.errorCount;
                        document.getElementById('queuedActions').textContent = 
                            status.queuedActions.length;
                        
                        // Update countdown
                        if (status.isActive && result.status.timeToNextTick > 0) {
                            updateCountdown(result.status.timeToNextTick);
                        }
                    } else {
                        document.getElementById('campaignState').textContent = 'Not Registered';
                        document.getElementById('currentTickMode').textContent = '-';
                        document.getElementById('nextTickCountdown').textContent = '-';
                    }
                } catch (error) {
                    console.error('Status update error:', error);
                }
            }

            function startStatusUpdates() {
                if (statusUpdateInterval) clearInterval(statusUpdateInterval);
                statusUpdateInterval = setInterval(updateStatus, 5000); // Update every 5 seconds
            }

            function startCountdown() {
                if (countdownInterval) clearInterval(countdownInterval);
                countdownInterval = setInterval(updateCountdownDisplay, 1000);
            }

            function stopCountdown() {
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                }
                document.getElementById('nextTickCountdown').textContent = '-';
                document.getElementById('nextTickCountdown').classList.remove('active');
            }

            function updateCountdown(timeToNextTick) {
                const seconds = Math.max(0, Math.floor(timeToNextTick / 1000));
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                
                const display = \`\${minutes}:\${remainingSeconds.toString().padStart(2, '0')}\`;
                document.getElementById('nextTickCountdown').textContent = display;
                document.getElementById('nextTickCountdown').classList.add('active');
            }

            function updateCountdownDisplay() {
                // This will be updated by the main status update
                updateStatus();
            }

            // UI Update Functions
            function addToTimeline(message, type = 'info') {
                const timeline = document.getElementById('tickTimeline');
                const entry = document.createElement('div');
                entry.className = \`tick-entry \${type}\`;
                entry.innerHTML = \`
                    <strong>\${new Date().toLocaleTimeString()}</strong>: \${message}
                \`;
                
                timeline.insertBefore(entry, timeline.firstChild);
                
                // Keep only last 20 entries
                while (timeline.children.length > 20) {
                    timeline.removeChild(timeline.lastChild);
                }
            }

            function updateNarrativePanel(tick) {
                const panel = document.getElementById('narrativePanel');
                
                if (tick.narrativeEnhancements && tick.narrativeEnhancements.length > 0) {
                    const entry = document.createElement('div');
                    entry.className = 'narrative-entry';
                    entry.innerHTML = \`
                        <strong>Tick \${tick.tickId} Analysis:</strong><br>
                        \${tick.narrativeEnhancements.join('<br>')}
                        <br><small>Processing: \${tick.processingTime}ms</small>
                    \`;
                    panel.insertBefore(entry, panel.firstChild);
                    
                    // Keep only last 10 entries
                    while (panel.children.length > 10) {
                        panel.removeChild(panel.lastChild);
                    }
                }
            }

            function updateEventsPanel(tick) {
                const panel = document.getElementById('eventsPanel');
                
                if (tick.emergentEvents > 0 || tick.crisisAlerts > 0) {
                    const alert = document.createElement('div');
                    alert.className = 'event-alert';
                    alert.innerHTML = \`
                        <strong>Tick \${tick.tickId} Events:</strong><br>
                        🎯 Emergent Events: \${tick.emergentEvents}<br>
                        🚨 Crisis Alerts: \${tick.crisisAlerts}<br>
                        📋 Policy Recommendations: \${tick.policyRecommendations}
                    \`;
                    panel.insertBefore(alert, panel.firstChild);
                    
                    // Keep only last 5 alerts
                    while (panel.children.length > 5) {
                        panel.removeChild(panel.lastChild);
                    }
                }
            }

            // System Health
            async function checkHealth() {
                try {
                    const response = await fetch('/api/hybrid-simulation/health');
                    const result = await response.json();
                    
                    const healthDiv = document.getElementById('healthStatus');
                    
                    if (result.success) {
                        const health = result.health;
                        healthDiv.innerHTML = \`
                            <div class="status-display">
                                <div class="status-card">
                                    <h4>System Status</h4>
                                    <div style="color: \${health.status === 'healthy' ? '#00b894' : health.status === 'degraded' ? '#fdcb6e' : '#e17055'}">\${health.status.toUpperCase()}</div>
                                </div>
                                <div class="status-card">
                                    <h4>Total Campaigns</h4>
                                    <div>\${health.campaigns.total} (\${health.campaigns.active} active)</div>
                                </div>
                                <div class="status-card">
                                    <h4>Performance</h4>
                                    <div>Avg: \${health.performance.averageTickTime}ms<br>Errors: \${health.performance.totalErrors}</div>
                                </div>
                                <div class="status-card">
                                    <h4>Uptime</h4>
                                    <div>\${Math.floor(health.uptime / 3600)}h \${Math.floor((health.uptime % 3600) / 60)}m</div>
                                </div>
                            </div>
                        \`;
                    } else {
                        healthDiv.innerHTML = \`<div style="color: #e17055;">Health check failed: \${result.message}</div>\`;
                    }
                } catch (error) {
                    document.getElementById('healthStatus').innerHTML = 
                        \`<div style="color: #e17055;">Health check error: \${error.message}</div>\`;
                }
            }
        </script>
    </body>
    </html>
  `);
});

export default hybridSimulationDemo;
