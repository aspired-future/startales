/**
 * Leader Communications Demo Interface
 * 
 * Interactive demo for the Leader Communications System,
 * showcasing briefings, speeches, decision support, and natural language integration.
 */

import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Leader Communications Demo Page
 * GET /demo/leader-communications
 */
router.get('/demo/leader-communications', (req: Request, res: Response) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leader Communications System - Demo</title>
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
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 300;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .tabs {
            display: flex;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
        }
        
        .tab {
            flex: 1;
            padding: 20px;
            text-align: center;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            color: #6c757d;
            transition: all 0.3s ease;
        }
        
        .tab.active {
            background: white;
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
        }
        
        .tab:hover:not(.active) {
            background: #e9ecef;
            color: #495057;
        }
        
        .tab-content {
            display: none;
            padding: 30px;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #3498db;
        }
        
        .form-group textarea {
            resize: vertical;
            min-height: 100px;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .btn {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
        }
        
        .btn.secondary {
            background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
        }
        
        .btn.danger {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        }
        
        .btn.success {
            background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
        }
        
        .result {
            margin-top: 30px;
            padding: 25px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 5px solid #3498db;
        }
        
        .result h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }
        
        .result pre {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            font-size: 0.9rem;
            line-height: 1.4;
        }
        
        .loading {
            display: none;
            text-align: center;
            padding: 40px;
            color: #7f8c8d;
        }
        
        .loading.show {
            display: block;
        }
        
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .stat-card h4 {
            color: #7f8c8d;
            font-size: 0.9rem;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .stat-card .value {
            font-size: 2rem;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .communication-item {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-left: 5px solid #3498db;
        }
        
        .communication-item h4 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 1.2rem;
        }
        
        .communication-item .meta {
            color: #7f8c8d;
            font-size: 0.9rem;
            margin-bottom: 15px;
        }
        
        .communication-item .content {
            color: #34495e;
            line-height: 1.6;
        }
        
        .decision-option {
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .decision-option:hover {
            border-color: #3498db;
            background: #e3f2fd;
        }
        
        .decision-option.selected {
            border-color: #27ae60;
            background: #e8f5e8;
        }
        
        .decision-option h5 {
            color: #2c3e50;
            margin-bottom: 8px;
        }
        
        .decision-option p {
            color: #7f8c8d;
            margin: 0;
        }
        
        .alert {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .alert.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .alert.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .alert.info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ Leader Communications System</h1>
            <p>AI-powered briefings, speeches, and decision support for strategic leadership</p>
        </div>
        
        <div class="tabs">
            <button class="tab active" onclick="showTab('briefings')">📋 Briefings</button>
            <button class="tab" onclick="showTab('speeches')">🎤 Speeches</button>
            <button class="tab" onclick="showTab('decisions')">⚖️ Decision Support</button>
            <button class="tab" onclick="showTab('history')">📚 History</button>
            <button class="tab" onclick="showTab('analytics')">📊 Analytics</button>
        </div>
        
        <!-- Briefings Tab -->
        <div id="briefings" class="tab-content active">
            <h2>📋 Leader Briefings</h2>
            <p>Generate comprehensive briefings with AI-powered analysis and recommendations.</p>
            
            <form id="briefingForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="briefingType">Briefing Type</label>
                        <select id="briefingType" name="type">
                            <option value="daily">Daily Briefing</option>
                            <option value="weekly">Weekly Summary</option>
                            <option value="crisis">Crisis Briefing</option>
                            <option value="strategic">Strategic Assessment</option>
                            <option value="intelligence">Intelligence Report</option>
                            <option value="economic">Economic Update</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="briefingPriority">Priority Level</label>
                        <select id="briefingPriority" name="priority">
                            <option value="routine">Routine</option>
                            <option value="important">Important</option>
                            <option value="urgent">Urgent</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="briefingDetail">Detail Level</label>
                        <select id="briefingDetail" name="detailLevel">
                            <option value="summary">Summary</option>
                            <option value="standard">Standard</option>
                            <option value="detailed">Detailed</option>
                            <option value="comprehensive">Comprehensive</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="briefingTimeframe">Timeframe</label>
                        <select id="briefingTimeframe" name="timeframe">
                            <option value="24h">Last 24 Hours</option>
                            <option value="3d">Last 3 Days</option>
                            <option value="1w">Last Week</option>
                            <option value="1m">Last Month</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="briefingTopics">Specific Topics (optional)</label>
                    <textarea id="briefingTopics" name="specificTopics" placeholder="Enter specific topics to focus on..."></textarea>
                </div>
                
                <button type="submit" class="btn">Generate Briefing</button>
                <button type="button" class="btn secondary" onclick="clearBriefingForm()">Clear</button>
            </form>
            
            <div class="loading" id="briefingLoading">
                <div class="spinner"></div>
                <p>Generating briefing with AI analysis...</p>
            </div>
            
            <div id="briefingResult" class="result" style="display: none;">
                <h3>Generated Briefing</h3>
                <div id="briefingContent"></div>
            </div>
        </div>
        
        <!-- Speeches Tab -->
        <div id="speeches" class="tab-content">
            <h2>🎤 Leader Speeches</h2>
            <p>Create impactful speeches that influence public opinion and simulation outcomes.</p>
            
            <form id="speechForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="speechType">Speech Type</label>
                        <select id="speechType" name="type">
                            <option value="policy_announcement">Policy Announcement</option>
                            <option value="crisis_address">Crisis Address</option>
                            <option value="state_of_union">State of the Union</option>
                            <option value="victory_speech">Victory Speech</option>
                            <option value="diplomatic_address">Diplomatic Address</option>
                            <option value="economic_address">Economic Address</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="speechAudience">Primary Audience</label>
                        <select id="speechAudience" name="audience">
                            <option value="general_public">General Public</option>
                            <option value="parliament">Parliament</option>
                            <option value="military">Military</option>
                            <option value="business_leaders">Business Leaders</option>
                            <option value="international">International Community</option>
                            <option value="party_members">Party Members</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="speechTone">Tone</label>
                        <select id="speechTone" name="tone">
                            <option value="inspirational">Inspirational</option>
                            <option value="authoritative">Authoritative</option>
                            <option value="reassuring">Reassuring</option>
                            <option value="urgent">Urgent</option>
                            <option value="diplomatic">Diplomatic</option>
                            <option value="celebratory">Celebratory</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="speechDuration">Duration (minutes)</label>
                        <input type="number" id="speechDuration" name="duration" value="15" min="5" max="60">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="speechOccasion">Occasion</label>
                    <input type="text" id="speechOccasion" name="occasion" placeholder="e.g., National Address, Press Conference">
                </div>
                
                <div class="form-group">
                    <label for="speechMessages">Key Messages</label>
                    <textarea id="speechMessages" name="keyMessages" placeholder="Enter key messages to include in the speech..."></textarea>
                </div>
                
                <button type="submit" class="btn">Generate Speech</button>
                <button type="button" class="btn secondary" onclick="clearSpeechForm()">Clear</button>
            </form>
            
            <div class="loading" id="speechLoading">
                <div class="spinner"></div>
                <p>Crafting speech with AI content generation...</p>
            </div>
            
            <div id="speechResult" class="result" style="display: none;">
                <h3>Generated Speech</h3>
                <div id="speechContent"></div>
                <button class="btn success" onclick="applySpeechEffects()">Apply Speech Effects</button>
            </div>
        </div>
        
        <!-- Decision Support Tab -->
        <div id="decisions" class="tab-content">
            <h2>⚖️ Decision Support System</h2>
            <p>Get AI-powered analysis and recommendations for critical leadership decisions.</p>
            
            <form id="decisionForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="decisionTitle">Decision Title</label>
                        <input type="text" id="decisionTitle" name="title" placeholder="e.g., Economic Stimulus Package">
                    </div>
                    <div class="form-group">
                        <label for="decisionCategory">Category</label>
                        <select id="decisionCategory" name="category">
                            <option value="economic">Economic</option>
                            <option value="social">Social</option>
                            <option value="military">Military</option>
                            <option value="diplomatic">Diplomatic</option>
                            <option value="environmental">Environmental</option>
                            <option value="technological">Technological</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="decisionUrgency">Urgency</label>
                        <select id="decisionUrgency" name="urgency">
                            <option value="routine">Routine</option>
                            <option value="important">Important</option>
                            <option value="urgent">Urgent</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="decisionDepth">Analysis Depth</label>
                        <select id="decisionDepth" name="analysisDepth">
                            <option value="basic">Basic</option>
                            <option value="standard">Standard</option>
                            <option value="comprehensive">Comprehensive</option>
                            <option value="exhaustive">Exhaustive</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="decisionDescription">Decision Description</label>
                    <textarea id="decisionDescription" name="description" placeholder="Describe the decision that needs to be made..."></textarea>
                </div>
                
                <div class="form-group">
                    <label for="decisionObjectives">Objectives</label>
                    <textarea id="decisionObjectives" name="objectives" placeholder="What are you trying to achieve?"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="decisionConstraints">Constraints</label>
                    <textarea id="decisionConstraints" name="constraints" placeholder="What limitations or constraints exist?"></textarea>
                </div>
                
                <button type="submit" class="btn">Generate Decision Support</button>
                <button type="button" class="btn secondary" onclick="clearDecisionForm()">Clear</button>
            </form>
            
            <div class="loading" id="decisionLoading">
                <div class="spinner"></div>
                <p>Analyzing decision with AI-powered insights...</p>
            </div>
            
            <div id="decisionResult" class="result" style="display: none;">
                <h3>Decision Analysis & Options</h3>
                <div id="decisionContent"></div>
                <div id="decisionOptions"></div>
                <button class="btn success" onclick="implementDecision()" style="display: none;" id="implementBtn">Implement Selected Option</button>
            </div>
        </div>
        
        <!-- History Tab -->
        <div id="history" class="tab-content">
            <h2>📚 Communication History</h2>
            <p>Review past briefings, speeches, and decisions.</p>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="historyType">Type</label>
                    <select id="historyType" onchange="loadHistory()">
                        <option value="briefings">Briefings</option>
                        <option value="speeches">Speeches</option>
                        <option value="decisions">Decisions</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="historyLimit">Items to Show</label>
                    <select id="historyLimit" onchange="loadHistory()">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </div>
            
            <button class="btn" onclick="loadHistory()">Refresh History</button>
            
            <div class="loading" id="historyLoading">
                <div class="spinner"></div>
                <p>Loading communication history...</p>
            </div>
            
            <div id="historyContent">
                <p>Click "Refresh History" to load recent communications.</p>
            </div>
        </div>
        
        <!-- Analytics Tab -->
        <div id="analytics" class="tab-content">
            <h2>📊 Communication Analytics</h2>
            <p>Analyze communication patterns and effectiveness.</p>
            
            <div class="form-group">
                <label for="analyticsTimeframe">Timeframe</label>
                <select id="analyticsTimeframe" onchange="loadAnalytics()">
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                </select>
            </div>
            
            <button class="btn" onclick="loadAnalytics()">Load Analytics</button>
            
            <div class="loading" id="analyticsLoading">
                <div class="spinner"></div>
                <p>Analyzing communication data...</p>
            </div>
            
            <div id="analyticsContent">
                <p>Click "Load Analytics" to view communication statistics.</p>
            </div>
        </div>
    </div>

    <script>
        let currentSpeechId = null;
        let currentDecisionId = null;
        let selectedOptionId = null;

        // Tab Management
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
            
            // Add active class to selected tab
            event.target.classList.add('active');
        }

        // Briefing Generation
        document.getElementById('briefingForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            // Show loading
            document.getElementById('briefingLoading').classList.add('show');
            document.getElementById('briefingResult').style.display = 'none';
            
            try {
                const response = await fetch('/api/leader/briefing', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    displayBriefingResult(result.data);
                } else {
                    showAlert('error', 'Failed to generate briefing: ' + result.message);
                }
            } catch (error) {
                showAlert('error', 'Error generating briefing: ' + error.message);
            } finally {
                document.getElementById('briefingLoading').classList.remove('show');
            }
        });

        function displayBriefingResult(briefing) {
            const content = document.getElementById('briefingContent');
            content.innerHTML = \`
                <div class="communication-item">
                    <h4>\${briefing.title}</h4>
                    <div class="meta">
                        Type: \${briefing.type} | Priority: \${briefing.priority} | 
                        Created: \${new Date(briefing.createdAt).toLocaleString()}
                    </div>
                    <div class="content">
                        <p><strong>Summary:</strong> \${briefing.summary}</p>
                        <div style="margin-top: 15px;">
                            <strong>Key Points:</strong>
                            <ul>
                                \${briefing.keyPoints.map(point => \`<li>\${point}</li>\`).join('')}
                            </ul>
                        </div>
                        \${briefing.recommendations.length > 0 ? \`
                            <div style="margin-top: 15px;">
                                <strong>Recommendations:</strong>
                                <ul>
                                    \${briefing.recommendations.map(rec => \`<li>\${rec}</li>\`).join('')}
                                </ul>
                            </div>
                        \` : ''}
                    </div>
                </div>
            \`;
            
            document.getElementById('briefingResult').style.display = 'block';
        }

        // Speech Generation
        document.getElementById('speechForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            // Parse key messages
            if (data.keyMessages) {
                data.keyMessages = data.keyMessages.split('\\n').filter(msg => msg.trim());
            }
            
            // Show loading
            document.getElementById('speechLoading').classList.add('show');
            document.getElementById('speechResult').style.display = 'none';
            
            try {
                const response = await fetch('/api/leader/speech', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    currentSpeechId = result.data.id;
                    displaySpeechResult(result.data);
                } else {
                    showAlert('error', 'Failed to generate speech: ' + result.message);
                }
            } catch (error) {
                showAlert('error', 'Error generating speech: ' + error.message);
            } finally {
                document.getElementById('speechLoading').classList.remove('show');
            }
        });

        function displaySpeechResult(speech) {
            const content = document.getElementById('speechContent');
            content.innerHTML = \`
                <div class="communication-item">
                    <h4>\${speech.title}</h4>
                    <div class="meta">
                        Type: \${speech.type} | Audience: \${speech.audience.primary} | 
                        Duration: \${speech.duration} minutes | Tone: \${speech.tone}
                    </div>
                    <div class="content">
                        <p><strong>Occasion:</strong> \${speech.occasion}</p>
                        <div style="margin-top: 15px;">
                            <strong>Key Messages:</strong>
                            <ul>
                                \${speech.keyMessages.map(msg => \`<li>\${msg}</li>\`).join('')}
                            </ul>
                        </div>
                        <div style="margin-top: 15px;">
                            <strong>Speech Content:</strong>
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px;">
                                \${speech.content.replace(/\\n/g, '<br>')}
                            </div>
                        </div>
                    </div>
                </div>
            \`;
            
            document.getElementById('speechResult').style.display = 'block';
        }

        async function applySpeechEffects() {
            if (!currentSpeechId) return;
            
            try {
                const response = await fetch(\`/api/leader/speech/\${currentSpeechId}/apply\`, {
                    method: 'POST'
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showAlert('success', \`Applied \${result.data.effectsApplied} speech effects to simulation\`);
                } else {
                    showAlert('error', 'Failed to apply speech effects: ' + result.message);
                }
            } catch (error) {
                showAlert('error', 'Error applying speech effects: ' + error.message);
            }
        }

        // Decision Support
        document.getElementById('decisionForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            // Show loading
            document.getElementById('decisionLoading').classList.add('show');
            document.getElementById('decisionResult').style.display = 'none';
            
            try {
                const response = await fetch('/api/leader/decision-support', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    currentDecisionId = result.data.id;
                    displayDecisionResult(result.data);
                } else {
                    showAlert('error', 'Failed to generate decision support: ' + result.message);
                }
            } catch (error) {
                showAlert('error', 'Error generating decision support: ' + error.message);
            } finally {
                document.getElementById('decisionLoading').classList.remove('show');
            }
        });

        function displayDecisionResult(decision) {
            const content = document.getElementById('decisionContent');
            content.innerHTML = \`
                <div class="communication-item">
                    <h4>\${decision.title}</h4>
                    <div class="meta">
                        Category: \${decision.category} | Urgency: \${decision.urgency} | 
                        Deadline: \${new Date(decision.deadline).toLocaleDateString()}
                    </div>
                    <div class="content">
                        <p><strong>Description:</strong> \${decision.description}</p>
                        \${decision.background ? \`<p><strong>Background:</strong> \${decision.background}</p>\` : ''}
                    </div>
                </div>
            \`;
            
            const optionsContainer = document.getElementById('decisionOptions');
            optionsContainer.innerHTML = \`
                <h4>Decision Options:</h4>
                \${decision.options.map((option, index) => \`
                    <div class="decision-option" onclick="selectOption('\${option.id}', this)">
                        <h5>\${option.title}</h5>
                        <p>\${option.description}</p>
                        <div style="margin-top: 10px;">
                            <small><strong>Pros:</strong> \${option.pros.join(', ')}</small><br>
                            <small><strong>Cons:</strong> \${option.cons.join(', ')}</small>
                        </div>
                    </div>
                \`).join('')}
            \`;
            
            document.getElementById('decisionResult').style.display = 'block';
        }

        function selectOption(optionId, element) {
            // Remove selection from all options
            document.querySelectorAll('.decision-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Select clicked option
            element.classList.add('selected');
            selectedOptionId = optionId;
            
            // Show implement button
            document.getElementById('implementBtn').style.display = 'inline-block';
        }

        async function implementDecision() {
            if (!currentDecisionId || !selectedOptionId) return;
            
            try {
                const response = await fetch(\`/api/leader/decisions/\${currentDecisionId}/implement\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ optionId: selectedOptionId })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showAlert('success', \`Decision implemented with \${result.data.effects.length} effects applied\`);
                    document.getElementById('implementBtn').style.display = 'none';
                } else {
                    showAlert('error', 'Failed to implement decision: ' + result.message);
                }
            } catch (error) {
                showAlert('error', 'Error implementing decision: ' + error.message);
            }
        }

        // History Loading
        async function loadHistory() {
            const type = document.getElementById('historyType').value;
            const limit = document.getElementById('historyLimit').value;
            
            document.getElementById('historyLoading').classList.add('show');
            
            try {
                const response = await fetch(\`/api/leader/\${type}?limit=\${limit}\`);
                const result = await response.json();
                
                if (result.success) {
                    displayHistory(result.data, type);
                } else {
                    showAlert('error', 'Failed to load history: ' + result.message);
                }
            } catch (error) {
                showAlert('error', 'Error loading history: ' + error.message);
            } finally {
                document.getElementById('historyLoading').classList.remove('show');
            }
        }

        function displayHistory(items, type) {
            const container = document.getElementById('historyContent');
            
            if (items.length === 0) {
                container.innerHTML = '<p>No items found.</p>';
                return;
            }
            
            container.innerHTML = items.map(item => \`
                <div class="communication-item">
                    <h4>\${item.title}</h4>
                    <div class="meta">
                        \${type === 'briefings' ? \`Type: \${item.type} | Priority: \${item.priority}\` : 
                          type === 'speeches' ? \`Type: \${item.type} | Duration: \${item.duration}min\` :
                          \`Category: \${item.category} | Status: \${item.status}\`} | 
                        Created: \${new Date(item.createdAt).toLocaleString()}
                    </div>
                    <div class="content">
                        <p>\${item.summary || item.description}</p>
                    </div>
                </div>
            \`).join('');
        }

        // Analytics Loading
        async function loadAnalytics() {
            const timeframe = document.getElementById('analyticsTimeframe').value;
            
            document.getElementById('analyticsLoading').classList.add('show');
            
            try {
                const response = await fetch(\`/api/leader/analytics?timeframe=\${timeframe}\`);
                const result = await response.json();
                
                if (result.success) {
                    displayAnalytics(result.data);
                } else {
                    showAlert('error', 'Failed to load analytics: ' + result.message);
                }
            } catch (error) {
                showAlert('error', 'Error loading analytics: ' + error.message);
            } finally {
                document.getElementById('analyticsLoading').classList.remove('show');
            }
        }

        function displayAnalytics(analytics) {
            const container = document.getElementById('analyticsContent');
            
            container.innerHTML = \`
                <div class="stats-grid">
                    <div class="stat-card">
                        <h4>Total Briefings</h4>
                        <div class="value">\${analytics.briefings.total}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Total Speeches</h4>
                        <div class="value">\${analytics.speeches.total}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Total Decisions</h4>
                        <div class="value">\${analytics.decisions.total}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Avg Speech Duration</h4>
                        <div class="value">\${Math.round(analytics.speeches.averageDuration || 0)}min</div>
                    </div>
                </div>
                
                <h4>Briefings by Type:</h4>
                \${analytics.briefings.byType.map(type => \`
                    <div style="margin-bottom: 10px;">
                        <strong>\${type.type}:</strong> \${type.count} briefings 
                        (Acknowledgment Rate: \${Math.round(type.acknowledgment_rate * 100)}%)
                    </div>
                \`).join('')}
                
                <h4>Speeches by Type:</h4>
                \${analytics.speeches.byType.map(type => \`
                    <div style="margin-bottom: 10px;">
                        <strong>\${type.type}:</strong> \${type.count} speeches 
                        (Avg Duration: \${Math.round(type.avg_duration || 0)} minutes)
                    </div>
                \`).join('')}
                
                <h4>Decisions by Category:</h4>
                \${analytics.decisions.byCategory.map(cat => \`
                    <div style="margin-bottom: 10px;">
                        <strong>\${cat.category} (\${cat.status}):</strong> \${cat.count} decisions 
                        (Avg Priority: \${Math.round(cat.avg_priority * 100)}%)
                    </div>
                \`).join('')}
            \`;
        }

        // Form Clearing Functions
        function clearBriefingForm() {
            document.getElementById('briefingForm').reset();
            document.getElementById('briefingResult').style.display = 'none';
        }

        function clearSpeechForm() {
            document.getElementById('speechForm').reset();
            document.getElementById('speechResult').style.display = 'none';
            currentSpeechId = null;
        }

        function clearDecisionForm() {
            document.getElementById('decisionForm').reset();
            document.getElementById('decisionResult').style.display = 'none';
            currentDecisionId = null;
            selectedOptionId = null;
        }

        // Alert System
        function showAlert(type, message) {
            const alertDiv = document.createElement('div');
            alertDiv.className = \`alert \${type}\`;
            alertDiv.textContent = message;
            
            // Insert at the top of the active tab content
            const activeTab = document.querySelector('.tab-content.active');
            activeTab.insertBefore(alertDiv, activeTab.firstChild);
            
            // Remove after 5 seconds
            setTimeout(() => {
                alertDiv.remove();
            }, 5000);
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            console.log('Leader Communications Demo initialized');
        });
    </script>
</body>
</html>
  `;
  
  res.send(html);
});

export default router;
