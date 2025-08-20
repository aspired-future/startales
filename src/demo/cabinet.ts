/**
 * Cabinet & Bureaucracy Management Demo
 * 
 * Interactive demo interface for testing and demonstrating the
 * cabinet and bureaucracy management system functionality.
 */

import { Router, Request, Response } from 'express';

const router = Router();

router.get('/demo/cabinet', (req: Request, res: Response) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cabinet & Bureaucracy Management Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
            color: #e0e6ed;
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1600px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(26, 26, 46, 0.8);
            border-radius: 12px;
            border: 1px solid rgba(0, 217, 255, 0.3);
        }

        .header h1 {
            font-size: 2.5rem;
            color: #00d9ff;
            margin-bottom: 10px;
            text-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
        }

        .header p {
            font-size: 1.1rem;
            color: #a0b3c8;
        }

        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .panel {
            background: rgba(22, 33, 62, 0.9);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid rgba(0, 217, 255, 0.2);
            backdrop-filter: blur(10px);
        }

        .panel h2 {
            color: #00d9ff;
            margin-bottom: 15px;
            font-size: 1.4rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .tabs {
            display: flex;
            margin-bottom: 20px;
            border-bottom: 1px solid rgba(0, 217, 255, 0.3);
            flex-wrap: wrap;
        }

        .tab {
            padding: 10px 15px;
            background: none;
            border: none;
            color: #a0b3c8;
            cursor: pointer;
            transition: all 0.3s ease;
            border-bottom: 2px solid transparent;
            font-size: 14px;
        }

        .tab.active {
            color: #00d9ff;
            border-bottom-color: #00d9ff;
        }

        .tab:hover {
            color: #00d9ff;
            background: rgba(0, 217, 255, 0.1);
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #00d9ff;
            font-weight: 500;
            font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 8px;
            background: rgba(10, 10, 15, 0.8);
            border: 1px solid rgba(0, 217, 255, 0.3);
            border-radius: 6px;
            color: #e0e6ed;
            font-size: 13px;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #00d9ff;
            box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
        }

        .btn {
            padding: 8px 16px;
            background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
            color: #0a0a0f;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            margin-right: 8px;
            margin-bottom: 8px;
            font-size: 13px;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 217, 255, 0.4);
        }

        .btn-secondary {
            background: linear-gradient(135deg, #ff9500 0%, #cc7700 100%);
        }

        .btn-danger {
            background: linear-gradient(135deg, #ff3366 0%, #cc1144 100%);
        }

        .btn-sm {
            padding: 4px 8px;
            font-size: 11px;
        }

        .results {
            margin-top: 20px;
            padding: 15px;
            background: rgba(10, 10, 15, 0.6);
            border-radius: 8px;
            border-left: 4px solid #00d9ff;
            max-height: 300px;
            overflow-y: auto;
        }

        .results h3 {
            color: #00d9ff;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .results pre {
            color: #a0b3c8;
            font-size: 11px;
            line-height: 1.4;
            white-space: pre-wrap;
        }

        .member-card, .assignment-card, .meeting-card, .process-card {
            background: rgba(10, 10, 15, 0.6);
            border: 1px solid rgba(0, 217, 255, 0.2);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 8px;
        }

        .member-card h4, .assignment-card h4, .meeting-card h4, .process-card h4 {
            color: #00d9ff;
            margin-bottom: 6px;
            font-size: 14px;
        }

        .member-card p, .assignment-card p, .meeting-card p, .process-card p {
            color: #a0b3c8;
            font-size: 12px;
            margin-bottom: 3px;
        }

        .status {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
        }

        .status-active { background: #00ff88; color: #000; }
        .status-nominated { background: #ffdd00; color: #000; }
        .status-confirmed { background: #00d9ff; color: #000; }
        .status-suspended { background: #ff9500; color: #fff; }
        .status-dismissed { background: #ff3366; color: #fff; }
        .status-assigned { background: #ffdd00; color: #000; }
        .status-in-progress { background: #00d9ff; color: #000; }
        .status-completed { background: #00ff88; color: #000; }
        .status-overdue { background: #ff3366; color: #fff; }
        .status-scheduled { background: #00d9ff; color: #000; }

        .clearance-level {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
        }

        .clearance-1 { background: #666; color: #fff; }
        .clearance-2 { background: #ff9500; color: #fff; }
        .clearance-3 { background: #ffdd00; color: #000; }
        .clearance-4 { background: #00ff88; color: #000; }
        .clearance-5 { background: #ff3366; color: #fff; }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 12px;
            margin-bottom: 15px;
        }

        .summary-card {
            background: rgba(10, 10, 15, 0.6);
            border: 1px solid rgba(0, 217, 255, 0.2);
            border-radius: 8px;
            padding: 12px;
            text-align: center;
        }

        .summary-card h3 {
            color: #00d9ff;
            font-size: 1.5rem;
            margin-bottom: 4px;
        }

        .summary-card p {
            color: #a0b3c8;
            font-size: 12px;
        }

        .loading {
            text-align: center;
            color: #00d9ff;
            padding: 15px;
            font-size: 14px;
        }

        .error {
            background: rgba(255, 51, 102, 0.1);
            border: 1px solid #ff3366;
            color: #ff3366;
            padding: 8px;
            border-radius: 6px;
            margin-bottom: 10px;
            font-size: 12px;
        }

        .success {
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            color: #00ff88;
            padding: 8px;
            border-radius: 6px;
            margin-bottom: 10px;
            font-size: 12px;
        }

        .command-interface {
            background: rgba(10, 10, 15, 0.8);
            border: 1px solid rgba(0, 217, 255, 0.3);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
        }

        .command-interface h3 {
            color: #00d9ff;
            margin-bottom: 10px;
            font-size: 16px;
        }

        .command-input {
            width: 100%;
            padding: 10px;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(0, 217, 255, 0.5);
            border-radius: 6px;
            color: #00d9ff;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            margin-bottom: 10px;
        }

        .command-output {
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid rgba(0, 217, 255, 0.3);
            border-radius: 6px;
            padding: 10px;
            color: #00ff88;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            min-height: 100px;
            white-space: pre-wrap;
        }

        @media (max-width: 768px) {
            .dashboard {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .tabs {
                flex-direction: column;
            }
            
            .tab {
                border-bottom: 1px solid rgba(0, 217, 255, 0.2);
                border-right: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ Cabinet & Bureaucracy Management</h1>
            <p>Comprehensive government operations with delegation, voice/text commands, and automated decision-making</p>
        </div>

        <!-- Command Interface -->
        <div class="command-interface">
            <h3>🎤 Voice & Text Command Interface</h3>
            <input type="text" class="command-input" id="commandInput" placeholder="Enter command: 'Secretary of Defense, move 3rd Fleet to Alpha Centauri' or 'Schedule emergency cabinet meeting'">
            <button class="btn" onclick="executeCommand()">Execute Command</button>
            <button class="btn btn-secondary" onclick="showCommandHelp()">Command Help</button>
            <div class="command-output" id="commandOutput">Ready for commands. Type a command above and click Execute Command.</div>
        </div>

        <div class="dashboard">
            <!-- System Overview Panel -->
            <div class="panel">
                <h2>📊 Cabinet Overview</h2>
                <div id="cabinetSummary" class="loading">Loading cabinet summary...</div>
            </div>

            <!-- Quick Actions Panel -->
            <div class="panel">
                <h2>⚡ Quick Actions</h2>
                <button class="btn" onclick="initializeCabinet()">Initialize Cabinet</button>
                <button class="btn btn-secondary" onclick="scheduleEmergencyMeeting()">Emergency Meeting</button>
                <button class="btn" onclick="checkAllAuthorities()">Check Authorities</button>
                <button class="btn btn-secondary" onclick="refreshData()">Refresh Data</button>
            </div>

            <!-- Recent Activity Panel -->
            <div class="panel">
                <h2>📋 Recent Activity</h2>
                <div id="recentActivity" class="loading">Loading recent activity...</div>
            </div>
        </div>

        <!-- Main Content Tabs -->
        <div class="panel">
            <div class="tabs">
                <button class="tab active" onclick="showTab('members')">Cabinet Members</button>
                <button class="tab" onclick="showTab('assignments')">Assignments</button>
                <button class="tab" onclick="showTab('meetings')">Meetings</button>
                <button class="tab" onclick="showTab('processes')">Processes</button>
                <button class="tab" onclick="showTab('decisions')">Decision Support</button>
                <button class="tab" onclick="showTab('commands')">Command Examples</button>
            </div>

            <!-- Cabinet Members Tab -->
            <div id="members-tab" class="tab-content active">
                <h3>Cabinet Members Management</h3>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
                    <div>
                        <h4>Appoint New Member</h4>
                        <div class="form-group">
                            <label>Name:</label>
                            <input type="text" id="memberName" placeholder="e.g., General Sarah Mitchell">
                        </div>
                        <div class="form-group">
                            <label>Role:</label>
                            <select id="memberRole">
                                <option value="secretary-defense">Secretary of Defense</option>
                                <option value="secretary-state">Secretary of State</option>
                                <option value="secretary-treasury">Secretary of Treasury</option>
                                <option value="secretary-interior">Secretary of Interior</option>
                                <option value="secretary-science">Secretary of Science</option>
                                <option value="attorney-general">Attorney General</option>
                                <option value="intelligence-director">Intelligence Director</option>
                                <option value="chief-of-staff">Chief of Staff</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Security Clearance (1-5):</label>
                            <input type="number" id="memberClearance" min="1" max="5" value="3">
                        </div>
                        <div class="form-group">
                            <label>Biography:</label>
                            <textarea id="memberBio" rows="3" placeholder="Background and qualifications"></textarea>
                        </div>
                        <button class="btn" onclick="appointMember()">Appoint Member</button>
                    </div>
                    <div>
                        <h4>Current Cabinet</h4>
                        <div id="membersList" class="loading">Loading cabinet members...</div>
                    </div>
                </div>
            </div>

            <!-- Assignments Tab -->
            <div id="assignments-tab" class="tab-content">
                <h3>Assignment Management</h3>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
                    <div>
                        <h4>Create Assignment</h4>
                        <div class="form-group">
                            <label>Title:</label>
                            <input type="text" id="assignmentTitle" placeholder="e.g., Prepare Defense Budget">
                        </div>
                        <div class="form-group">
                            <label>Assign To:</label>
                            <select id="assignmentMember">
                                <option value="">Select Cabinet Member</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Category:</label>
                            <select id="assignmentCategory">
                                <option value="military">Military</option>
                                <option value="diplomatic">Diplomatic</option>
                                <option value="economic">Economic</option>
                                <option value="domestic">Domestic</option>
                                <option value="scientific">Scientific</option>
                                <option value="legal">Legal</option>
                                <option value="intelligence">Intelligence</option>
                                <option value="administrative">Administrative</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Priority:</label>
                            <select id="assignmentPriority">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Due Date:</label>
                            <input type="datetime-local" id="assignmentDue">
                        </div>
                        <div class="form-group">
                            <label>Description:</label>
                            <textarea id="assignmentDescription" rows="3" placeholder="Assignment details and requirements"></textarea>
                        </div>
                        <button class="btn" onclick="createAssignment()">Create Assignment</button>
                    </div>
                    <div>
                        <h4>Active Assignments</h4>
                        <div id="assignmentsList" class="loading">Loading assignments...</div>
                    </div>
                </div>
            </div>

            <!-- Meetings Tab -->
            <div id="meetings-tab" class="tab-content">
                <h3>Cabinet Meetings</h3>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
                    <div>
                        <h4>Schedule Meeting</h4>
                        <div class="form-group">
                            <label>Title:</label>
                            <input type="text" id="meetingTitle" placeholder="e.g., Weekly Cabinet Meeting">
                        </div>
                        <div class="form-group">
                            <label>Type:</label>
                            <select id="meetingType">
                                <option value="regular">Regular</option>
                                <option value="emergency">Emergency</option>
                                <option value="special">Special</option>
                                <option value="crisis">Crisis</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Scheduled Date:</label>
                            <input type="datetime-local" id="meetingDate">
                        </div>
                        <div class="form-group">
                            <label>Duration (minutes):</label>
                            <input type="number" id="meetingDuration" value="60" min="15" max="480">
                        </div>
                        <div class="form-group">
                            <label>Location:</label>
                            <input type="text" id="meetingLocation" placeholder="e.g., Cabinet Room">
                        </div>
                        <div class="form-group">
                            <label>Security Classification:</label>
                            <select id="meetingClassification">
                                <option value="internal">Internal</option>
                                <option value="confidential">Confidential</option>
                                <option value="secret">Secret</option>
                                <option value="top-secret">Top Secret</option>
                            </select>
                        </div>
                        <button class="btn" onclick="scheduleMeeting()">Schedule Meeting</button>
                    </div>
                    <div>
                        <h4>Upcoming Meetings</h4>
                        <div id="meetingsList" class="loading">Loading meetings...</div>
                    </div>
                </div>
            </div>

            <!-- Processes Tab -->
            <div id="processes-tab" class="tab-content">
                <h3>Bureaucratic Processes</h3>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
                    <div>
                        <h4>Create Process</h4>
                        <div class="form-group">
                            <label>Process Name:</label>
                            <input type="text" id="processName" placeholder="e.g., Budget Approval Process">
                        </div>
                        <div class="form-group">
                            <label>Department:</label>
                            <select id="processDepartment">
                                <option value="Defense">Defense</option>
                                <option value="State">State</option>
                                <option value="Treasury">Treasury</option>
                                <option value="Interior">Interior</option>
                                <option value="Science">Science</option>
                                <option value="Justice">Justice</option>
                                <option value="Intelligence">Intelligence</option>
                                <option value="Administration">Administration</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Category:</label>
                            <select id="processCategory">
                                <option value="administrative">Administrative</option>
                                <option value="approval">Approval</option>
                                <option value="review">Review</option>
                                <option value="compliance">Compliance</option>
                                <option value="emergency">Emergency</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Priority:</label>
                            <select id="processPriority">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Description:</label>
                            <textarea id="processDescription" rows="3" placeholder="Process description and purpose"></textarea>
                        </div>
                        <button class="btn" onclick="createProcess()">Create Process</button>
                    </div>
                    <div>
                        <h4>Active Processes</h4>
                        <div id="processesList" class="loading">Loading processes...</div>
                    </div>
                </div>
            </div>

            <!-- Decision Support Tab -->
            <div id="decisions-tab" class="tab-content">
                <h3>Decision Support System</h3>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
                    <div>
                        <h4>Request Decision Support</h4>
                        <div class="form-group">
                            <label>Decision Title:</label>
                            <input type="text" id="decisionTitle" placeholder="e.g., Increase Defense Spending">
                        </div>
                        <div class="form-group">
                            <label>Category:</label>
                            <select id="decisionCategory">
                                <option value="military">Military</option>
                                <option value="diplomatic">Diplomatic</option>
                                <option value="economic">Economic</option>
                                <option value="domestic">Domestic</option>
                                <option value="scientific">Scientific</option>
                                <option value="legal">Legal</option>
                                <option value="intelligence">Intelligence</option>
                                <option value="administrative">Administrative</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Urgency:</label>
                            <select id="decisionUrgency">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Description:</label>
                            <textarea id="decisionDescription" rows="4" placeholder="Decision context and requirements"></textarea>
                        </div>
                        <button class="btn" onclick="requestDecisionSupport()">Request Support</button>
                    </div>
                    <div>
                        <h4>Pending Decision Support</h4>
                        <div id="decisionsList" class="loading">Loading decision support requests...</div>
                    </div>
                </div>
            </div>

            <!-- Command Examples Tab -->
            <div id="commands-tab" class="tab-content">
                <h3>Voice & Text Command Examples</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h4>Military Commands</h4>
                        <div class="member-card">
                            <p><strong>Troop Movement:</strong></p>
                            <p>"Secretary of Defense, move 3rd Fleet to Alpha Centauri"</p>
                            <p>"Deploy defensive positions around Sol system"</p>
                            <p>"Recall all units from contested zones"</p>
                        </div>
                        <div class="member-card">
                            <p><strong>Alliance Coordination:</strong></p>
                            <p>"Request joint patrol with Alliance partners in Sector 7"</p>
                            <p>"Coordinate defensive response with allied forces"</p>
                            <p>"Share intelligence on Klingon movements with allies"</p>
                        </div>
                        <div class="member-card">
                            <p><strong>Intelligence Operations:</strong></p>
                            <p>"Increase surveillance on enemy border regions"</p>
                            <p>"Activate deep space sensor networks"</p>
                            <p>"Prepare threat assessment for cabinet review"</p>
                        </div>
                    </div>
                    <div>
                        <h4>Government Operations</h4>
                        <div class="member-card">
                            <p><strong>Economic Policy:</strong></p>
                            <p>"Secretary of Treasury, implement emergency economic measures"</p>
                            <p>"Increase defense spending by 15%, reduce from education"</p>
                            <p>"Prepare budget analysis for next quarter"</p>
                        </div>
                        <div class="member-card">
                            <p><strong>Diplomatic Actions:</strong></p>
                            <p>"Secretary of State, schedule trade negotiations with Vulcan ambassador"</p>
                            <p>"Prepare diplomatic response to recent tensions"</p>
                            <p>"Coordinate humanitarian aid to affected systems"</p>
                        </div>
                        <div class="member-card">
                            <p><strong>Administrative Commands:</strong></p>
                            <p>"Chief of Staff, schedule emergency cabinet meeting"</p>
                            <p>"Prepare comprehensive briefing on current situation"</p>
                            <p>"Coordinate inter-departmental response to crisis"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Results Panel -->
        <div class="results" id="results" style="display: none;">
            <h3>API Response</h3>
            <pre id="resultsContent"></pre>
        </div>
    </div>

    <script>
        let currentCampaignId = 1;
        let cabinetMembers = [];

        // Tab Management
        function showTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.getElementById(tabName + '-tab').classList.add('active');
            event.target.classList.add('active');
        }

        // API Helper Functions
        async function apiCall(endpoint, method = 'GET', data = null) {
            try {
                const options = {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                };
                
                if (data) {
                    options.body = JSON.stringify(data);
                }
                
                const response = await fetch('/api/cabinet' + endpoint, options);
                const result = await response.json();
                
                showResults(result);
                return result;
            } catch (error) {
                console.error('API call failed:', error);
                showResults({ success: false, error: error.message });
                return { success: false, error: error.message };
            }
        }

        function showResults(data) {
            const resultsDiv = document.getElementById('results');
            const resultsContent = document.getElementById('resultsContent');
            
            resultsContent.textContent = JSON.stringify(data, null, 2);
            resultsDiv.style.display = 'block';
        }

        // Command Interface
        function executeCommand() {
            const command = document.getElementById('commandInput').value;
            const output = document.getElementById('commandOutput');
            
            if (!command.trim()) {
                output.textContent = 'Error: Please enter a command';
                return;
            }

            // Simulate command processing
            output.textContent = \`Processing command: "\${command}"\n\nCommand parsed and routed to appropriate cabinet member.\nAwaiting execution confirmation...\n\nNote: This is a demo interface. In the full system, this would:\n1. Parse natural language command\n2. Identify target cabinet member\n3. Verify authority and permissions\n4. Execute command through appropriate systems\n5. Provide real-time feedback and confirmation\`;
            
            // Clear input
            document.getElementById('commandInput').value = '';
        }

        function showCommandHelp() {
            const output = document.getElementById('commandOutput');
            output.textContent = \`VOICE & TEXT COMMAND HELP

MILITARY COMMANDS:
• "Secretary of Defense, move [unit] to [location]"
• "Deploy defensive positions around [location]"
• "Activate DEFCON [level]"
• "Request joint patrol with allies in [sector]"

ECONOMIC COMMANDS:
• "Secretary of Treasury, implement emergency measures"
• "Increase [department] spending by [percentage]"
• "Prepare budget analysis for [period]"

DIPLOMATIC COMMANDS:
• "Secretary of State, schedule negotiations with [entity]"
• "Prepare diplomatic response to [situation]"
• "Coordinate humanitarian aid to [location]"

ADMINISTRATIVE COMMANDS:
• "Chief of Staff, schedule [meeting type] meeting"
• "Prepare briefing on [topic]"
• "Coordinate response to [situation]"

GENERAL FORMAT:
[Cabinet Member], [action] [details]

All commands are logged and require appropriate authority levels.\`;
        }

        // System Initialization
        async function initializeCabinet() {
            const result = await apiCall('/initialize', 'POST', { campaignId: currentCampaignId });
            if (result.success) {
                showSuccess('Cabinet initialized successfully!');
                refreshData();
            } else {
                showError('Failed to initialize cabinet: ' + result.error);
            }
        }

        // Data Loading Functions
        async function loadCabinetSummary() {
            const result = await apiCall('/summary');
            const summaryDiv = document.getElementById('cabinetSummary');
            
            if (result.success) {
                const data = result.data;
                summaryDiv.innerHTML = \`
                    <div class="summary-grid">
                        <div class="summary-card">
                            <h3>\${data.totalMembers}</h3>
                            <p>Total Members</p>
                        </div>
                        <div class="summary-card">
                            <h3>\${data.activeMembers}</h3>
                            <p>Active Members</p>
                        </div>
                        <div class="summary-card">
                            <h3>\${data.pendingNominations}</h3>
                            <p>Pending Nominations</p>
                        </div>
                        <div class="summary-card">
                            <h3>\${data.upcomingMeetings}</h3>
                            <p>Upcoming Meetings</p>
                        </div>
                        <div class="summary-card">
                            <h3>\${data.overdueTasks}</h3>
                            <p>Overdue Tasks</p>
                        </div>
                        <div class="summary-card">
                            <h3>\${data.systemHealth.status.toUpperCase()}</h3>
                            <p>System Health</p>
                        </div>
                    </div>
                \`;
            } else {
                summaryDiv.innerHTML = '<div class="error">Failed to load cabinet summary</div>';
            }
        }

        async function loadCabinetMembers() {
            const result = await apiCall('/members');
            const membersDiv = document.getElementById('membersList');
            const memberSelect = document.getElementById('assignmentMember');
            
            if (result.success && result.data) {
                cabinetMembers = result.data;
                
                membersDiv.innerHTML = result.data.map(member => \`
                    <div class="member-card">
                        <h4>\${member.name}</h4>
                        <p><strong>Title:</strong> \${member.title}</p>
                        <p><strong>Department:</strong> \${member.department}</p>
                        <p><strong>Status:</strong> <span class="status status-\${member.status}">\${member.status}</span></p>
                        <p><strong>Clearance:</strong> <span class="clearance-level clearance-\${member.securityClearance}">Level \${member.securityClearance}</span></p>
                        <p><strong>Appointed:</strong> \${new Date(member.appointedDate).toLocaleDateString()}</p>
                        <p>\${member.biography}</p>
                        <button class="btn btn-sm" onclick="viewMemberDetails('\${member.id}')">Details</button>
                        <button class="btn btn-danger btn-sm" onclick="dismissMember('\${member.id}')">Dismiss</button>
                    </div>
                \`).join('');

                // Update assignment member select
                memberSelect.innerHTML = '<option value="">Select Cabinet Member</option>' +
                    result.data.filter(m => m.status === 'active').map(member => 
                        \`<option value="\${member.id}">\${member.name} - \${member.title}</option>\`
                    ).join('');
            } else {
                membersDiv.innerHTML = '<div class="error">Failed to load cabinet members</div>';
            }
        }

        async function loadAssignments() {
            const result = await apiCall('/assignments');
            const assignmentsDiv = document.getElementById('assignmentsList');
            
            if (result.success && result.data) {
                assignmentsDiv.innerHTML = result.data.map(assignment => \`
                    <div class="assignment-card">
                        <h4>\${assignment.title}</h4>
                        <p><strong>Category:</strong> \${assignment.category}</p>
                        <p><strong>Priority:</strong> \${assignment.priority}</p>
                        <p><strong>Status:</strong> <span class="status status-\${assignment.status}">\${assignment.status}</span></p>
                        <p><strong>Due:</strong> \${new Date(assignment.dueDate).toLocaleDateString()}</p>
                        <p><strong>Progress:</strong> \${assignment.progress}%</p>
                        <p>\${assignment.description}</p>
                    </div>
                \`).join('');
            } else {
                assignmentsDiv.innerHTML = '<div class="error">Failed to load assignments</div>';
            }
        }

        async function loadMeetings() {
            const result = await apiCall('/meetings?status=scheduled');
            const meetingsDiv = document.getElementById('meetingsList');
            
            if (result.success && result.data) {
                meetingsDiv.innerHTML = result.data.map(meeting => \`
                    <div class="meeting-card">
                        <h4>\${meeting.title}</h4>
                        <p><strong>Type:</strong> \${meeting.type}</p>
                        <p><strong>Date:</strong> \${new Date(meeting.scheduledDate).toLocaleString()}</p>
                        <p><strong>Duration:</strong> \${meeting.duration} minutes</p>
                        <p><strong>Location:</strong> \${meeting.location}</p>
                        <p><strong>Classification:</strong> \${meeting.securityClassification}</p>
                        <p><strong>Status:</strong> <span class="status status-\${meeting.status}">\${meeting.status}</span></p>
                    </div>
                \`).join('');
            } else {
                meetingsDiv.innerHTML = '<div class="error">Failed to load meetings</div>';
            }
        }

        async function loadProcesses() {
            const result = await apiCall('/processes');
            const processesDiv = document.getElementById('processesList');
            
            if (result.success && result.data) {
                processesDiv.innerHTML = result.data.map(process => \`
                    <div class="process-card">
                        <h4>\${process.name}</h4>
                        <p><strong>Department:</strong> \${process.department}</p>
                        <p><strong>Category:</strong> \${process.category}</p>
                        <p><strong>Priority:</strong> \${process.priority}</p>
                        <p><strong>Status:</strong> <span class="status status-\${process.status}">\${process.status}</span></p>
                        <p><strong>Duration:</strong> \${process.estimatedDuration} minutes</p>
                        <p>\${process.description}</p>
                    </div>
                \`).join('');
            } else {
                processesDiv.innerHTML = '<div class="error">Failed to load processes</div>';
            }
        }

        // CRUD Operations
        async function appointMember() {
            const memberData = {
                name: document.getElementById('memberName').value,
                roleId: document.getElementById('memberRole').value,
                securityClearance: parseInt(document.getElementById('memberClearance').value),
                biography: document.getElementById('memberBio').value,
                userId: 'demo-user-' + Date.now(),
                title: document.getElementById('memberRole').selectedOptions[0].text,
                department: getDepartmentFromRole(document.getElementById('memberRole').value),
                status: 'active'
            };

            if (!memberData.name || !memberData.biography) {
                showError('Please fill in all required fields');
                return;
            }

            const result = await apiCall('/members', 'POST', memberData);
            if (result.success) {
                showSuccess('Cabinet member appointed successfully!');
                clearMemberForm();
                loadCabinetMembers();
            } else {
                showError('Failed to appoint member: ' + result.error);
            }
        }

        async function createAssignment() {
            const assignmentData = {
                title: document.getElementById('assignmentTitle').value,
                description: document.getElementById('assignmentDescription').value,
                category: document.getElementById('assignmentCategory').value,
                priority: document.getElementById('assignmentPriority').value,
                dueDate: document.getElementById('assignmentDue').value,
                assignedBy: 'demo-leader',
                estimatedHours: 8
            };

            if (!assignmentData.title || !assignmentData.description || !assignmentData.dueDate) {
                showError('Please fill in all required fields');
                return;
            }

            const result = await apiCall('/assignments', 'POST', assignmentData);
            if (result.success) {
                showSuccess('Assignment created successfully!');
                clearAssignmentForm();
                loadAssignments();
            } else {
                showError('Failed to create assignment: ' + result.error);
            }
        }

        async function scheduleMeeting() {
            const meetingData = {
                title: document.getElementById('meetingTitle').value,
                type: document.getElementById('meetingType').value,
                scheduledDate: document.getElementById('meetingDate').value,
                duration: parseInt(document.getElementById('meetingDuration').value),
                location: document.getElementById('meetingLocation').value,
                securityClassification: document.getElementById('meetingClassification').value,
                chairperson: 'demo-leader',
                createdBy: 'demo-leader',
                attendees: cabinetMembers.filter(m => m.status === 'active').map(m => ({
                    memberId: m.id,
                    role: m.title,
                    status: 'required',
                    attendance: 'present'
                }))
            };

            if (!meetingData.title || !meetingData.scheduledDate || !meetingData.location) {
                showError('Please fill in all required fields');
                return;
            }

            const result = await apiCall('/meetings', 'POST', meetingData);
            if (result.success) {
                showSuccess('Cabinet meeting scheduled successfully!');
                clearMeetingForm();
                loadMeetings();
            } else {
                showError('Failed to schedule meeting: ' + result.error);
            }
        }

        async function requestDecisionSupport() {
            const requestData = {
                title: document.getElementById('decisionTitle').value,
                description: document.getElementById('decisionDescription').value,
                category: document.getElementById('decisionCategory').value,
                urgency: document.getElementById('decisionUrgency').value,
                requesterId: 'demo-leader'
            };

            if (!requestData.title || !requestData.description) {
                showError('Please fill in all required fields');
                return;
            }

            const result = await apiCall('/decision-support', 'POST', requestData);
            if (result.success) {
                showSuccess('Decision support request created successfully!');
                clearDecisionForm();
            } else {
                showError('Failed to create decision support request: ' + result.error);
            }
        }

        // Quick Actions
        async function scheduleEmergencyMeeting() {
            const meetingData = {
                title: 'Emergency Cabinet Meeting',
                type: 'emergency',
                scheduledDate: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
                duration: 90,
                location: 'Situation Room',
                securityClassification: 'secret',
                chairperson: 'demo-leader',
                createdBy: 'demo-leader',
                attendees: cabinetMembers.filter(m => m.status === 'active').map(m => ({
                    memberId: m.id,
                    role: m.title,
                    status: 'required',
                    attendance: 'present'
                }))
            };

            const result = await apiCall('/meetings', 'POST', meetingData);
            if (result.success) {
                showSuccess('Emergency cabinet meeting scheduled!');
                loadMeetings();
            } else {
                showError('Failed to schedule emergency meeting: ' + result.error);
            }
        }

        async function checkAllAuthorities() {
            showSuccess('Authority check initiated for all cabinet members');
            // This would check authority for all members
        }

        // Utility Functions
        function getDepartmentFromRole(roleId) {
            const roleMap = {
                'secretary-defense': 'Defense',
                'secretary-state': 'State',
                'secretary-treasury': 'Treasury',
                'secretary-interior': 'Interior',
                'secretary-science': 'Science',
                'attorney-general': 'Justice',
                'intelligence-director': 'Intelligence',
                'chief-of-staff': 'Administration'
            };
            return roleMap[roleId] || 'Unknown';
        }

        function clearMemberForm() {
            document.getElementById('memberName').value = '';
            document.getElementById('memberBio').value = '';
            document.getElementById('memberClearance').value = '3';
        }

        function clearAssignmentForm() {
            document.getElementById('assignmentTitle').value = '';
            document.getElementById('assignmentDescription').value = '';
            document.getElementById('assignmentDue').value = '';
        }

        function clearMeetingForm() {
            document.getElementById('meetingTitle').value = '';
            document.getElementById('meetingDate').value = '';
            document.getElementById('meetingLocation').value = '';
            document.getElementById('meetingDuration').value = '60';
        }

        function clearDecisionForm() {
            document.getElementById('decisionTitle').value = '';
            document.getElementById('decisionDescription').value = '';
        }

        function showSuccess(message) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'success';
            alertDiv.textContent = message;
            document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.command-interface'));
            setTimeout(() => alertDiv.remove(), 5000);
        }

        function showError(message) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'error';
            alertDiv.textContent = message;
            document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.command-interface'));
            setTimeout(() => alertDiv.remove(), 5000);
        }

        function refreshData() {
            loadCabinetSummary();
            loadCabinetMembers();
            loadAssignments();
            loadMeetings();
            loadProcesses();
        }

        async function viewMemberDetails(memberId) {
            const result = await apiCall('/members/' + memberId);
            if (result.success) {
                showResults(result);
            }
        }

        async function dismissMember(memberId) {
            if (!confirm('Are you sure you want to dismiss this cabinet member?')) return;
            
            const result = await apiCall('/members/' + memberId, 'DELETE', {
                reason: 'Dismissed via demo interface',
                dismissedBy: 'demo-leader'
            });
            
            if (result.success) {
                showSuccess('Cabinet member dismissed successfully!');
                loadCabinetMembers();
            } else {
                showError('Failed to dismiss member: ' + result.error);
            }
        }

        // Initialize the demo
        document.addEventListener('DOMContentLoaded', function() {
            // Set default meeting date to 1 hour from now
            const defaultMeetingDate = new Date(Date.now() + 60 * 60 * 1000);
            document.getElementById('meetingDate').value = defaultMeetingDate.toISOString().slice(0, 16);
            
            // Set default assignment due date to 1 week from now
            const defaultDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            document.getElementById('assignmentDue').value = defaultDueDate.toISOString().slice(0, 16);
            
            refreshData();
        });
    </script>
</body>
</html>`;

  res.type('html').send(html);
});

export default router;
