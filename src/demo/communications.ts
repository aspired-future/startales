import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/communications', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Communications Secretary - Media Command Center</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                min-height: 100vh;
                overflow-x: hidden;
            }
            
            .header {
                background: rgba(0, 0, 0, 0.3);
                padding: 1rem 2rem;
                border-bottom: 2px solid #667eea;
                backdrop-filter: blur(10px);
            }
            
            .header h1 {
                font-size: 2.5rem;
                font-weight: 300;
                margin-bottom: 0.5rem;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .header .subtitle {
                font-size: 1.1rem;
                opacity: 0.9;
                font-weight: 300;
            }
            
            .dashboard {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 2rem;
                padding: 2rem;
                max-width: 1400px;
                margin: 0 auto;
            }
            
            .panel {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 1.5rem;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            }
            
            .panel:hover {
                transform: translateY(-5px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
                border-color: #667eea;
            }
            
            .panel h2 {
                font-size: 1.3rem;
                margin-bottom: 1rem;
                color: #667eea;
                border-bottom: 2px solid #667eea;
                padding-bottom: 0.5rem;
            }
            
            .metric {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0.8rem 0;
                padding: 0.5rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
            }
            
            .metric-value {
                font-weight: bold;
                font-size: 1.1rem;
                color: #667eea;
            }
            
            .status-indicator {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-right: 8px;
            }
            
            .status-live { background-color: #4CAF50; }
            .status-scheduled { background-color: #FF9800; }
            .status-pending { background-color: #2196F3; }
            .status-active { background-color: #8BC34A; }
            
            .action-buttons {
                display: flex;
                gap: 1rem;
                margin-top: 1rem;
                flex-wrap: wrap;
            }
            
            .btn {
                padding: 0.7rem 1.2rem;
                border: none;
                border-radius: 6px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
                text-align: center;
            }
            
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                background: linear-gradient(135deg, #764ba2, #667eea);
            }
            
            .btn-secondary {
                background: linear-gradient(135deg, #6c757d, #5a6268);
            }
            
            .btn-secondary:hover {
                background: linear-gradient(135deg, #5a6268, #495057);
            }
            
            .btn-urgent {
                background: linear-gradient(135deg, #f44336, #d32f2f);
            }
            
            .btn-urgent:hover {
                background: linear-gradient(135deg, #d32f2f, #c62828);
            }
            
            .operation-item {
                background: rgba(255, 255, 255, 0.05);
                margin: 0.5rem 0;
                padding: 0.8rem;
                border-radius: 6px;
                border-left: 4px solid #667eea;
            }
            
            .operation-crisis { border-left-color: #f44336; }
            .operation-strategy { border-left-color: #ff9800; }
            .operation-routine { border-left-color: #4caf50; }
            
            .message-item {
                background: rgba(255, 255, 255, 0.05);
                margin: 0.5rem 0;
                padding: 0.8rem;
                border-radius: 6px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                margin: 0.5rem 0;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                transition: width 0.3s ease;
            }
            
            .full-width {
                grid-column: 1 / -1;
            }
            
            .two-column {
                grid-column: span 2;
            }
            
            .api-endpoint {
                font-family: 'Courier New', monospace;
                background: rgba(0, 0, 0, 0.3);
                padding: 0.5rem;
                border-radius: 4px;
                font-size: 0.9rem;
                margin: 0.5rem 0;
                border-left: 3px solid #667eea;
            }
            
            .integration-note {
                background: rgba(102, 126, 234, 0.1);
                border: 1px solid rgba(102, 126, 234, 0.3);
                padding: 1rem;
                border-radius: 6px;
                margin: 1rem 0;
            }
            
            .leader-panel {
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 193, 7, 0.1));
                border: 1px solid rgba(255, 215, 0, 0.3);
            }
            
            .leader-panel h2 {
                color: #ffd700;
                border-bottom-color: #ffd700;
            }
            
            .sentiment-positive { color: #4CAF50; }
            .sentiment-neutral { color: #FF9800; }
            .sentiment-negative { color: #f44336; }
            
            @media (max-width: 1200px) {
                .dashboard {
                    grid-template-columns: 1fr 1fr;
                }
            }
            
            @media (max-width: 768px) {
                .dashboard {
                    grid-template-columns: 1fr;
                    padding: 1rem;
                }
                
                .header {
                    padding: 1rem;
                }
                
                .header h1 {
                    font-size: 2rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>📡 Communications Secretary</h1>
            <p class="subtitle">Media Command Center - Information Strategy & Public Relations</p>
        </div>
        
        <div class="dashboard">
            <!-- Communications Overview -->
            <div class="panel">
                <h2>📊 Communications Overview</h2>
                <div class="metric">
                    <span>Total Media Budget</span>
                    <span class="metric-value">$180M</span>
                </div>
                <div class="metric">
                    <span>Active Operations</span>
                    <span class="metric-value">12</span>
                </div>
                <div class="metric">
                    <span>Media Outlets</span>
                    <span class="metric-value">47</span>
                </div>
                <div class="metric">
                    <span>Press Conferences (Week)</span>
                    <span class="metric-value">3</span>
                </div>
                <div class="metric">
                    <span>Public Approval</span>
                    <span class="metric-value">67.5%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 67.5%"></div>
                </div>
            </div>
            
            <!-- Leader Communications Integration -->
            <div class="panel leader-panel">
                <h2>👑 Leader Communications</h2>
                <div class="metric">
                    <span>Approval Rating</span>
                    <span class="metric-value">67.5%</span>
                </div>
                <div class="metric">
                    <span>Media Favorability</span>
                    <span class="metric-value">58.2%</span>
                </div>
                <div class="metric">
                    <span>Message Reach (Daily)</span>
                    <span class="metric-value">12.5M</span>
                </div>
                <div class="operation-item">
                    <strong>State of the Nation Address</strong><br>
                    <small>Scheduled: Next Week - Parliament Hall</small>
                    <span class="status-indicator status-scheduled"></span>
                </div>
                <div class="operation-item">
                    <strong>Economic Policy Briefing</strong><br>
                    <small>Completed: Today - High Media Coverage</small>
                    <span class="status-indicator status-live"></span>
                </div>
                <div class="action-buttons">
                    <button class="btn" onclick="coordinateLeaderMessage()">Coordinate Message</button>
                    <button class="btn btn-secondary" onclick="scheduleLeaderEvent()">Schedule Event</button>
                </div>
            </div>
            
            <!-- Active Media Operations -->
            <div class="panel">
                <h2>⚡ Active Operations</h2>
                <div class="operation-item operation-crisis">
                    <strong>Crisis Response Campaign</strong><br>
                    <small>Economic Stability Messaging</small>
                    <span class="status-indicator status-live"></span>
                </div>
                <div class="operation-item operation-strategy">
                    <strong>Infrastructure Policy Promotion</strong><br>
                    <small>Multi-platform Strategy</small>
                    <span class="status-indicator status-active"></span>
                </div>
                <div class="operation-item operation-routine">
                    <strong>Weekly Press Briefing Prep</strong><br>
                    <small>Routine Media Relations</small>
                    <span class="status-indicator status-scheduled"></span>
                </div>
                <div class="action-buttons">
                    <button class="btn" onclick="newOperation()">New Operation</button>
                    <button class="btn btn-urgent" onclick="crisisCommunication()">Crisis Response</button>
                </div>
            </div>
            
            <!-- Press Conference Management -->
            <div class="panel">
                <h2>🎤 Press Conferences</h2>
                <div class="message-item">
                    <div>
                        <strong>Weekly Government Briefing</strong><br>
                        <small>Tomorrow 2:00 PM - Press Room</small>
                    </div>
                    <span class="status-indicator status-scheduled"></span>
                </div>
                <div class="message-item">
                    <div>
                        <strong>Defense Policy Announcement</strong><br>
                        <small>Friday 10:00 AM - Main Hall</small>
                    </div>
                    <span class="status-indicator status-scheduled"></span>
                </div>
                <div class="message-item">
                    <div>
                        <strong>Economic Update Conference</strong><br>
                        <small>Completed - 45 journalists attended</small>
                    </div>
                    <span class="status-indicator status-live"></span>
                </div>
                <div class="action-buttons">
                    <button class="btn" onclick="scheduleConference()">Schedule Conference</button>
                    <button class="btn btn-secondary" onclick="manageAccreditation()">Manage Press</button>
                </div>
            </div>
            
            <!-- Public Messaging -->
            <div class="panel">
                <h2>📢 Public Messaging</h2>
                <div class="metric">
                    <span>Pending Approvals</span>
                    <span class="metric-value">5</span>
                </div>
                <div class="message-item">
                    <div>
                        <strong>Infrastructure Investment Announcement</strong><br>
                        <small>Awaiting Final Approval</small>
                    </div>
                    <span class="status-indicator status-pending"></span>
                </div>
                <div class="message-item">
                    <div>
                        <strong>Public Health Advisory</strong><br>
                        <small>Scheduled for Release Tomorrow</small>
                    </div>
                    <span class="status-indicator status-scheduled"></span>
                </div>
                <div class="action-buttons">
                    <button class="btn" onclick="createMessage()">Create Message</button>
                    <button class="btn btn-secondary" onclick="reviewPending()">Review Pending</button>
                </div>
            </div>
            
            <!-- Media Relationships -->
            <div class="panel">
                <h2>🤝 Media Relations</h2>
                <div class="metric">
                    <span>Registered Outlets</span>
                    <span class="metric-value">47</span>
                </div>
                <div class="metric">
                    <span>Favorable Relations</span>
                    <span class="metric-value">28</span>
                </div>
                <div class="message-item">
                    <div>
                        <strong>National News Network</strong><br>
                        <small class="sentiment-positive">Favorable • 2.5M Reach</small>
                    </div>
                    <span class="status-indicator status-active"></span>
                </div>
                <div class="message-item">
                    <div>
                        <strong>Business Daily</strong><br>
                        <small class="sentiment-neutral">Neutral • 1.8M Reach</small>
                    </div>
                    <span class="status-indicator status-active"></span>
                </div>
                <div class="action-buttons">
                    <button class="btn" onclick="manageOutlets()">Manage Outlets</button>
                    <button class="btn btn-secondary" onclick="analyzeRelations()">Analyze Relations</button>
                </div>
            </div>
            
            <!-- News & Witter Integration -->
            <div class="panel full-width">
                <h2>🔗 Platform Integration</h2>
                <div class="integration-note">
                    <strong>🔗 Integration with News & Witter Systems</strong><br>
                    The Communications Secretary coordinates with existing News outlets and Witter platform for comprehensive media strategy implementation.
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                    <div>
                        <h3>📰 News Integration</h3>
                        <div class="metric">
                            <span>Active Outlets</span>
                            <span class="metric-value">15</span>
                        </div>
                        <div class="metric">
                            <span>Coverage Today</span>
                            <span class="metric-value">23</span>
                        </div>
                        <div class="metric">
                            <span>Sentiment</span>
                            <span class="metric-value sentiment-positive">+45%</span>
                        </div>
                        <ul style="list-style: none; padding: 0; margin-top: 0.5rem;">
                            <li>• Press release distribution</li>
                            <li>• Story priority influence</li>
                            <li>• Coverage monitoring</li>
                        </ul>
                    </div>
                    <div>
                        <h3>🐦 Witter Integration</h3>
                        <div class="metric">
                            <span>Official Accounts</span>
                            <span class="metric-value">3</span>
                        </div>
                        <div class="metric">
                            <span>Daily Reach</span>
                            <span class="metric-value">12.5M</span>
                        </div>
                        <div class="metric">
                            <span>Engagement</span>
                            <span class="metric-value">450K</span>
                        </div>
                        <ul style="list-style: none; padding: 0; margin-top: 0.5rem;">
                            <li>• Account coordination</li>
                            <li>• Trending influence</li>
                            <li>• Crisis response</li>
                        </ul>
                    </div>
                    <div>
                        <h3>👑 Leader Coordination</h3>
                        <div class="metric">
                            <span>Recent Briefings</span>
                            <span class="metric-value">2</span>
                        </div>
                        <div class="metric">
                            <span>Upcoming Speeches</span>
                            <span class="metric-value">1</span>
                        </div>
                        <div class="metric">
                            <span>Cross-Platform</span>
                            <span class="metric-value">Active</span>
                        </div>
                        <ul style="list-style: none; padding: 0; margin-top: 0.5rem;">
                            <li>• Speech coordination</li>
                            <li>• Briefing management</li>
                            <li>• Message amplification</li>
                        </ul>
                    </div>
                </div>
                
                <div class="action-buttons" style="margin-top: 1rem;">
                    <button class="btn" onclick="viewNewsIntegration()">News Dashboard</button>
                    <button class="btn" onclick="viewWitterIntegration()">Witter Control</button>
                    <button class="btn" onclick="viewLeaderIntegration()">Leader Coordination</button>
                </div>
            </div>
            
            <!-- API Endpoints -->
            <div class="panel full-width">
                <h2>🔌 API Endpoints</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                    <div>
                        <h4>Communications Operations</h4>
                        <div class="api-endpoint">POST /api/communications/operations</div>
                        <div class="api-endpoint">GET /api/communications/operations</div>
                        <div class="api-endpoint">GET /api/communications/analytics</div>
                    </div>
                    <div>
                        <h4>Media Management</h4>
                        <div class="api-endpoint">POST /api/communications/strategies</div>
                        <div class="api-endpoint">POST /api/communications/press-conferences</div>
                        <div class="api-endpoint">GET /api/communications/media-outlets</div>
                    </div>
                    <div>
                        <h4>Integration & Coordination</h4>
                        <div class="api-endpoint">GET /api/communications/leader-integration</div>
                        <div class="api-endpoint">GET /api/communications/news-integration</div>
                        <div class="api-endpoint">GET /api/communications/witter-integration</div>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            // Demo functions for interactive elements
            function coordinateLeaderMessage() {
                alert('Leader Message Coordination\\n\\nCoordinating leader message across platforms:\\n• News outlets for press coverage\\n• Witter for social engagement\\n• Television for broadcast reach\\n• Radio for audio distribution\\n\\nEstimated reach: 25M+ citizens');
            }
            
            function scheduleLeaderEvent() {
                alert('Leader Event Scheduling\\n\\nScheduling leader communication event:\\n• Press conferences\\n• Public speeches\\n• Media interviews\\n• Town halls\\n\\nFull media strategy coordination included');
            }
            
            function newOperation() {
                alert('New Communications Operation\\n\\nCreating new operation:\\n• Media Strategy Development\\n• Crisis Communication Response\\n• Public Messaging Campaign\\n• Press Relations Initiative');
            }
            
            function crisisCommunication() {
                alert('Crisis Communication Protocol\\n\\nActivating rapid response system:\\n• Immediate message coordination\\n• Multi-platform deployment\\n• Real-time monitoring\\n• Counter-narrative preparation');
            }
            
            function scheduleConference() {
                alert('Press Conference Scheduling\\n\\nScheduling new press conference:\\n• Venue coordination\\n• Journalist accreditation\\n• Topic preparation\\n• Media kit distribution');
            }
            
            function manageAccreditation() {
                alert('Press Accreditation Management\\n\\nManaging journalist access:\\n• Credential verification\\n• Security clearance levels\\n• Exclusive access grants\\n• Relationship tracking');
            }
            
            function createMessage() {
                alert('Public Message Creation\\n\\nCreating new public message:\\n• Multi-platform adaptation\\n• Audience targeting\\n• Approval workflow\\n• Distribution scheduling');
            }
            
            function reviewPending() {
                alert('Pending Message Review\\n\\nReviewing messages awaiting approval:\\n• Content verification\\n• Legal compliance check\\n• Strategic alignment\\n• Release authorization');
            }
            
            function manageOutlets() {
                alert('Media Outlet Management\\n\\nManaging media relationships:\\n• Outlet registration\\n• Relationship status tracking\\n• Coverage analysis\\n• Partnership agreements');
            }
            
            function analyzeRelations() {
                alert('Media Relations Analysis\\n\\nAnalyzing media relationships:\\n• Coverage sentiment trends\\n• Relationship effectiveness\\n• Influence mapping\\n• Strategic recommendations');
            }
            
            function viewNewsIntegration() {
                alert('News System Integration\\n\\nNews platform capabilities:\\n• Press release distribution\\n• Story priority influence\\n• Coverage sentiment monitoring\\n• Outlet coordination');
            }
            
            function viewWitterIntegration() {
                alert('Witter Platform Integration\\n\\nWitter control capabilities:\\n• Official account coordination\\n• Trending topic influence\\n• Crisis rapid response\\n• Public sentiment tracking');
            }
            
            function viewLeaderIntegration() {
                alert('Leader Communications Integration\\n\\nLeader coordination features:\\n• Speech and briefing management\\n• Cross-platform message coordination\\n• Public appearance scheduling\\n• Approval rating tracking');
            }
            
            // Simulate real-time updates
            setInterval(() => {
                const metrics = document.querySelectorAll('.metric-value');
                metrics.forEach(metric => {
                    if (Math.random() > 0.95) {
                        metric.style.color = '#4CAF50';
                        setTimeout(() => {
                            metric.style.color = '#667eea';
                        }, 1000);
                    }
                });
            }, 2000);
            
            // Add some dynamic behavior to progress bars
            setInterval(() => {
                const progressBars = document.querySelectorAll('.progress-fill');
                progressBars.forEach(bar => {
                    const currentWidth = parseInt(bar.style.width);
                    if (Math.random() > 0.9) {
                        const change = Math.floor(Math.random() * 6) - 3; // -3 to +3
                        const newWidth = Math.max(0, Math.min(100, currentWidth + change));
                        bar.style.width = newWidth + '%';
                    }
                });
            }, 5000);
            
            // Simulate live status updates
            setInterval(() => {
                const indicators = document.querySelectorAll('.status-indicator');
                indicators.forEach(indicator => {
                    if (Math.random() > 0.98) {
                        indicator.style.boxShadow = '0 0 10px currentColor';
                        setTimeout(() => {
                            indicator.style.boxShadow = 'none';
                        }, 500);
                    }
                });
            }, 1000);
        </script>
    </body>
    </html>
  `);
});

export default router;
