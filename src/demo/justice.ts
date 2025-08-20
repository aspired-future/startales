/**
 * Justice Department Demo Page
 * 
 * Interactive demonstration of the Justice Department system including law enforcement oversight,
 * judicial administration, legal policy implementation, and justice system performance management.
 */

import express from 'express';
import { Pool } from 'pg';
import { JusticeSecretaryService } from '../server/justice/JusticeSecretaryService.js';

const router = express.Router();

// Demo civilization ID
const DEMO_CIVILIZATION_ID = 'demo-civ-001';

router.get('/justice', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Justice Department - Attorney General Command Center</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                color: #ffffff;
                min-height: 100vh;
                padding: 20px;
            }
            
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }
            
            .header h1 {
                font-size: 2.5em;
                margin-bottom: 10px;
                background: linear-gradient(45deg, #ffd700, #ffed4e);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .header p {
                font-size: 1.2em;
                opacity: 0.9;
            }
            
            .dashboard {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .card {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 25px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .card h3 {
                font-size: 1.4em;
                margin-bottom: 15px;
                color: #ffd700;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .metric {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 10px 0;
                padding: 10px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }
            
            .metric-value {
                font-weight: bold;
                font-size: 1.1em;
            }
            
            .metric-value.good { color: #4ade80; }
            .metric-value.warning { color: #fbbf24; }
            .metric-value.critical { color: #f87171; }
            
            .controls {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .control-group {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 20px;
                backdrop-filter: blur(10px);
            }
            
            .control-group h4 {
                color: #ffd700;
                margin-bottom: 15px;
                font-size: 1.2em;
            }
            
            .form-group {
                margin-bottom: 15px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
            }
            
            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.1);
                color: #ffffff;
                font-size: 14px;
            }
            
            .form-group input::placeholder,
            .form-group textarea::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }
            
            .btn {
                background: linear-gradient(45deg, #3b82f6, #1d4ed8);
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
                box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
            }
            
            .btn-success {
                background: linear-gradient(45deg, #10b981, #059669);
            }
            
            .btn-warning {
                background: linear-gradient(45deg, #f59e0b, #d97706);
            }
            
            .btn-danger {
                background: linear-gradient(45deg, #ef4444, #dc2626);
            }
            
            .activity-log {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 20px;
                backdrop-filter: blur(10px);
                max-height: 400px;
                overflow-y: auto;
            }
            
            .activity-log h4 {
                color: #ffd700;
                margin-bottom: 15px;
            }
            
            .activity-item {
                padding: 10px;
                margin: 5px 0;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                border-left: 4px solid #3b82f6;
            }
            
            .activity-item.success {
                border-left-color: #10b981;
            }
            
            .activity-item.warning {
                border-left-color: #f59e0b;
            }
            
            .activity-item.error {
                border-left-color: #ef4444;
            }
            
            .activity-time {
                font-size: 0.8em;
                opacity: 0.7;
                float: right;
            }
            
            .loading {
                display: none;
                text-align: center;
                padding: 20px;
            }
            
            .spinner {
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top: 4px solid #3b82f6;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .status-indicator {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-right: 8px;
            }
            
            .status-operational { background-color: #10b981; }
            .status-warning { background-color: #f59e0b; }
            .status-critical { background-color: #ef4444; }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                overflow: hidden;
                margin: 5px 0;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6, #1d4ed8);
                transition: width 0.3s ease;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>⚖️ Justice Department</h1>
            <p>Attorney General Command Center - Law Enforcement Oversight & Judicial Administration</p>
        </div>

        <div class="dashboard">
            <div class="card">
                <h3>🏛️ Justice System Health</h3>
                <div class="metric">
                    <span>Overall Justice Health</span>
                    <span class="metric-value good" id="justice-health">75%</span>
                </div>
                <div class="metric">
                    <span>Crime Clearance Rate</span>
                    <span class="metric-value" id="clearance-rate">68.5%</span>
                </div>
                <div class="metric">
                    <span>Court Efficiency</span>
                    <span class="metric-value" id="court-efficiency">72%</span>
                </div>
                <div class="metric">
                    <span>Public Trust</span>
                    <span class="metric-value warning" id="public-trust">65%</span>
                </div>
                <div class="metric">
                    <span>Constitutional Compliance</span>
                    <span class="metric-value good" id="constitutional-compliance">90%</span>
                </div>
            </div>

            <div class="card">
                <h3>👮 Law Enforcement Status</h3>
                <div class="metric">
                    <span>Active Agencies</span>
                    <span class="metric-value" id="active-agencies">3</span>
                </div>
                <div class="metric">
                    <span>Total Officers</span>
                    <span class="metric-value" id="total-officers">850</span>
                </div>
                <div class="metric">
                    <span>Community Trust</span>
                    <span class="metric-value warning" id="community-trust">62%</span>
                </div>
                <div class="metric">
                    <span>Response Time</span>
                    <span class="metric-value" id="response-time">8.5 min</span>
                </div>
                <div class="metric">
                    <span>Accountability Score</span>
                    <span class="metric-value" id="accountability-score">78%</span>
                </div>
            </div>

            <div class="card">
                <h3>⚖️ Court System Performance</h3>
                <div class="metric">
                    <span>Active Courts</span>
                    <span class="metric-value" id="active-courts">5</span>
                </div>
                <div class="metric">
                    <span>Case Backlog</span>
                    <span class="metric-value warning" id="case-backlog">450</span>
                </div>
                <div class="metric">
                    <span>Avg Processing Time</span>
                    <span class="metric-value" id="processing-time">120 days</span>
                </div>
                <div class="metric">
                    <span>Judicial Vacancies</span>
                    <span class="metric-value" id="judicial-vacancies">2</span>
                </div>
                <div class="metric">
                    <span>Appeal Rate</span>
                    <span class="metric-value" id="appeal-rate">18%</span>
                </div>
            </div>

            <div class="card">
                <h3>📊 Active Operations</h3>
                <div class="metric">
                    <span>Policy Implementations</span>
                    <span class="metric-value" id="policy-implementations">3</span>
                </div>
                <div class="metric">
                    <span>Oversight Activities</span>
                    <span class="metric-value" id="oversight-activities">2</span>
                </div>
                <div class="metric">
                    <span>Judicial Appointments</span>
                    <span class="metric-value" id="judicial-appointments">1</span>
                </div>
                <div class="metric">
                    <span>Reform Initiatives</span>
                    <span class="metric-value" id="reform-initiatives">2</span>
                </div>
                <div class="metric">
                    <span>Budget Utilization</span>
                    <span class="metric-value good" id="budget-utilization">87%</span>
                </div>
            </div>
        </div>

        <div class="controls">
            <div class="control-group">
                <h4>🚀 Justice Operations</h4>
                <div class="form-group">
                    <label for="operation-type">Operation Type</label>
                    <select id="operation-type">
                        <option value="policy_implementation">Policy Implementation</option>
                        <option value="oversight">Agency Oversight</option>
                        <option value="appointment">Judicial Appointment</option>
                        <option value="reform">System Reform</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="operation-title">Operation Title</label>
                    <input type="text" id="operation-title" placeholder="Enter operation title">
                </div>
                <div class="form-group">
                    <label for="operation-description">Description</label>
                    <textarea id="operation-description" rows="3" placeholder="Describe the operation"></textarea>
                </div>
                <div class="form-group">
                    <label for="operation-priority">Priority (1-10)</label>
                    <input type="number" id="operation-priority" min="1" max="10" value="5">
                </div>
                <button class="btn btn-success" onclick="createOperation()">Launch Operation</button>
            </div>

            <div class="control-group">
                <h4>👨‍⚖️ Judicial Management</h4>
                <div class="form-group">
                    <label for="court-id">Court</label>
                    <select id="court-id">
                        <option value="supreme-court">Supreme Court</option>
                        <option value="district-court">District Court</option>
                        <option value="local-court-1">Local Court 1</option>
                        <option value="local-court-2">Local Court 2</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="nominee-name">Nominee Name</label>
                    <input type="text" id="nominee-name" placeholder="Enter nominee name">
                </div>
                <div class="form-group">
                    <label for="position-title">Position</label>
                    <input type="text" id="position-title" placeholder="e.g., District Judge">
                </div>
                <div class="form-group">
                    <label for="judicial-philosophy">Philosophy</label>
                    <select id="judicial-philosophy">
                        <option value="moderate">Moderate</option>
                        <option value="conservative">Conservative</option>
                        <option value="liberal">Liberal</option>
                        <option value="originalist">Originalist</option>
                    </select>
                </div>
                <button class="btn btn-success" onclick="nominateJudge()">Nominate Judge</button>
            </div>

            <div class="control-group">
                <h4>📋 Policy Implementation</h4>
                <div class="form-group">
                    <label for="policy-name">Policy Name</label>
                    <input type="text" id="policy-name" placeholder="Enter policy name">
                </div>
                <div class="form-group">
                    <label for="policy-type">Policy Type</label>
                    <select id="policy-type">
                        <option value="criminal_justice">Criminal Justice</option>
                        <option value="civil_rights">Civil Rights</option>
                        <option value="law_enforcement">Law Enforcement</option>
                        <option value="court_reform">Court Reform</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="policy-description">Description</label>
                    <textarea id="policy-description" rows="3" placeholder="Describe the policy"></textarea>
                </div>
                <div class="form-group">
                    <label for="policy-budget">Budget Required</label>
                    <input type="number" id="policy-budget" placeholder="0" min="0">
                </div>
                <button class="btn btn-success" onclick="createPolicy()">Create Policy</button>
            </div>

            <div class="control-group">
                <h4>🔍 Agency Oversight</h4>
                <div class="form-group">
                    <label for="agency-id">Target Agency</label>
                    <select id="agency-id">
                        <option value="metro-police">Metropolitan Police</option>
                        <option value="state-police">State Police</option>
                        <option value="federal-bureau">Federal Bureau</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="oversight-type">Oversight Type</label>
                    <select id="oversight-type">
                        <option value="performance_review">Performance Review</option>
                        <option value="investigation">Investigation</option>
                        <option value="audit">Audit</option>
                        <option value="reform">Reform Initiative</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="oversight-title">Title</label>
                    <input type="text" id="oversight-title" placeholder="Enter oversight title">
                </div>
                <div class="form-group">
                    <label for="oversight-severity">Severity</label>
                    <select id="oversight-severity">
                        <option value="routine">Routine</option>
                        <option value="serious">Serious</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
                <button class="btn btn-warning" onclick="initiateOversight()">Initiate Oversight</button>
            </div>
        </div>

        <div class="controls">
            <div class="control-group">
                <h4>💰 Budget Management</h4>
                <div class="form-group">
                    <label for="budget-category">Category</label>
                    <select id="budget-category">
                        <option value="law_enforcement">Law Enforcement</option>
                        <option value="courts">Courts</option>
                        <option value="corrections">Corrections</option>
                        <option value="victim_services">Victim Services</option>
                        <option value="prevention">Crime Prevention</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="budget-amount">Amount</label>
                    <input type="number" id="budget-amount" placeholder="0" min="0">
                </div>
                <div class="form-group">
                    <label for="budget-justification">Justification</label>
                    <textarea id="budget-justification" rows="2" placeholder="Justify budget allocation"></textarea>
                </div>
                <button class="btn" onclick="allocateBudget()">Allocate Budget</button>
            </div>

            <div class="control-group">
                <h4>📈 System Actions</h4>
                <button class="btn" onclick="refreshMetrics()">🔄 Refresh Metrics</button>
                <button class="btn btn-success" onclick="generateAnalytics()">📊 Generate Analytics</button>
                <button class="btn btn-warning" onclick="simulateTimeStep()">⏭️ Simulate Time Step</button>
                <button class="btn" onclick="viewLegalSystem()">⚖️ View Legal System</button>
                <button class="btn" onclick="exportReport()">📄 Export Report</button>
            </div>
        </div>

        <div class="activity-log">
            <h4>📋 Recent Activity</h4>
            <div id="activity-list">
                <div class="activity-item success">
                    <span>Community Policing Initiative launched successfully</span>
                    <span class="activity-time">2 hours ago</span>
                </div>
                <div class="activity-item">
                    <span>Judge Sarah Martinez nominated for District Court</span>
                    <span class="activity-time">4 hours ago</span>
                </div>
                <div class="activity-item warning">
                    <span>Metropolitan Police oversight review initiated</span>
                    <span class="activity-time">6 hours ago</span>
                </div>
                <div class="activity-item success">
                    <span>Criminal Justice Reform Act approved for implementation</span>
                    <span class="activity-time">1 day ago</span>
                </div>
            </div>
        </div>

        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Processing justice operation...</p>
        </div>

        <script>
            const DEMO_CIV_ID = '${DEMO_CIVILIZATION_ID}';
            
            function showLoading() {
                document.getElementById('loading').style.display = 'block';
            }
            
            function hideLoading() {
                document.getElementById('loading').style.display = 'none';
            }
            
            function addActivity(message, type = '') {
                const activityList = document.getElementById('activity-list');
                const item = document.createElement('div');
                item.className = \`activity-item \${type}\`;
                item.innerHTML = \`
                    <span>\${message}</span>
                    <span class="activity-time">Just now</span>
                \`;
                activityList.insertBefore(item, activityList.firstChild);
                
                // Keep only last 10 items
                while (activityList.children.length > 10) {
                    activityList.removeChild(activityList.lastChild);
                }
            }
            
            async function createOperation() {
                const operationType = document.getElementById('operation-type').value;
                const title = document.getElementById('operation-title').value;
                const description = document.getElementById('operation-description').value;
                const priority = parseInt(document.getElementById('operation-priority').value);
                
                if (!title) {
                    alert('Please enter an operation title');
                    return;
                }
                
                showLoading();
                
                try {
                    const response = await fetch(\`/api/justice/operations/\${DEMO_CIV_ID}\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            operation_type: operationType,
                            title,
                            description,
                            priority,
                            budget_allocated: 1000000
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        addActivity(\`Operation "\${title}" launched successfully\`, 'success');
                        document.getElementById('operation-title').value = '';
                        document.getElementById('operation-description').value = '';
                        await refreshMetrics();
                    } else {
                        addActivity(\`Failed to launch operation: \${result.error}\`, 'error');
                    }
                } catch (error) {
                    addActivity(\`Error launching operation: \${error.message}\`, 'error');
                } finally {
                    hideLoading();
                }
            }
            
            async function nominateJudge() {
                const courtId = document.getElementById('court-id').value;
                const nomineeName = document.getElementById('nominee-name').value;
                const positionTitle = document.getElementById('position-title').value;
                const philosophy = document.getElementById('judicial-philosophy').value;
                
                if (!nomineeName || !positionTitle) {
                    alert('Please enter nominee name and position');
                    return;
                }
                
                showLoading();
                
                try {
                    const response = await fetch(\`/api/justice/appointments/\${DEMO_CIV_ID}\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            court_id: courtId,
                            position_title: positionTitle,
                            nominee_name: nomineeName,
                            philosophy,
                            specialization: ['General Law', 'Constitutional Law']
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        addActivity(\`Judge \${nomineeName} nominated for \${positionTitle}\`, 'success');
                        document.getElementById('nominee-name').value = '';
                        document.getElementById('position-title').value = '';
                        await refreshMetrics();
                    } else {
                        addActivity(\`Failed to nominate judge: \${result.error}\`, 'error');
                    }
                } catch (error) {
                    addActivity(\`Error nominating judge: \${error.message}\`, 'error');
                } finally {
                    hideLoading();
                }
            }
            
            async function createPolicy() {
                const policyName = document.getElementById('policy-name').value;
                const policyType = document.getElementById('policy-type').value;
                const description = document.getElementById('policy-description').value;
                const budget = parseInt(document.getElementById('policy-budget').value) || 0;
                
                if (!policyName) {
                    alert('Please enter a policy name');
                    return;
                }
                
                showLoading();
                
                try {
                    const response = await fetch(\`/api/justice/policies/\${DEMO_CIV_ID}\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            policy_name: policyName,
                            policy_type: policyType,
                            description,
                            budget_required: budget,
                            expected_impact: 'Improved justice system effectiveness'
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        addActivity(\`Policy "\${policyName}" created successfully\`, 'success');
                        document.getElementById('policy-name').value = '';
                        document.getElementById('policy-description').value = '';
                        document.getElementById('policy-budget').value = '';
                        await refreshMetrics();
                    } else {
                        addActivity(\`Failed to create policy: \${result.error}\`, 'error');
                    }
                } catch (error) {
                    addActivity(\`Error creating policy: \${error.message}\`, 'error');
                } finally {
                    hideLoading();
                }
            }
            
            async function initiateOversight() {
                const agencyId = document.getElementById('agency-id').value;
                const oversightType = document.getElementById('oversight-type').value;
                const title = document.getElementById('oversight-title').value;
                const severity = document.getElementById('oversight-severity').value;
                
                if (!title) {
                    alert('Please enter an oversight title');
                    return;
                }
                
                showLoading();
                
                try {
                    const response = await fetch(\`/api/justice/oversight/\${DEMO_CIV_ID}\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            agency_id: agencyId,
                            oversight_type: oversightType,
                            title,
                            severity,
                            description: \`\${oversightType} of \${agencyId}\`
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        addActivity(\`Oversight "\${title}" initiated for \${agencyId}\`, 'warning');
                        document.getElementById('oversight-title').value = '';
                        await refreshMetrics();
                    } else {
                        addActivity(\`Failed to initiate oversight: \${result.error}\`, 'error');
                    }
                } catch (error) {
                    addActivity(\`Error initiating oversight: \${error.message}\`, 'error');
                } finally {
                    hideLoading();
                }
            }
            
            async function allocateBudget() {
                const category = document.getElementById('budget-category').value;
                const amount = parseInt(document.getElementById('budget-amount').value);
                const justification = document.getElementById('budget-justification').value;
                
                if (!amount || amount <= 0) {
                    alert('Please enter a valid budget amount');
                    return;
                }
                
                showLoading();
                
                try {
                    const response = await fetch(\`/api/justice/budget/\${DEMO_CIV_ID}\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            allocations: [{
                                category,
                                amount,
                                justification
                            }]
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        addActivity(\`Budget allocated: $\${amount.toLocaleString()} to \${category}\`, 'success');
                        document.getElementById('budget-amount').value = '';
                        document.getElementById('budget-justification').value = '';
                        await refreshMetrics();
                    } else {
                        addActivity(\`Failed to allocate budget: \${result.error}\`, 'error');
                    }
                } catch (error) {
                    addActivity(\`Error allocating budget: \${error.message}\`, 'error');
                } finally {
                    hideLoading();
                }
            }
            
            async function refreshMetrics() {
                showLoading();
                
                try {
                    const response = await fetch(\`/api/justice/status/\${DEMO_CIV_ID}\`);
                    const result = await response.json();
                    
                    if (result.success) {
                        const data = result.data;
                        
                        // Update system health metrics
                        if (data.systemHealth) {
                            document.getElementById('justice-health').textContent = 
                                Math.round(data.systemHealth.justiceHealth.overallScore) + '%';
                            document.getElementById('clearance-rate').textContent = 
                                data.systemHealth.crimeStatistics.clearanceRate.toFixed(1) + '%';
                            document.getElementById('court-efficiency').textContent = 
                                Math.round(data.systemHealth.courtPerformance.clearanceRate) + '%';
                            document.getElementById('public-trust').textContent = 
                                Math.round(data.systemHealth.lawEnforcement.performance.communityTrust) + '%';
                        }
                        
                        // Update performance metrics
                        if (data.performanceMetrics) {
                            document.getElementById('constitutional-compliance').textContent = 
                                data.performanceMetrics.constitutional_compliance + '%';
                            document.getElementById('case-backlog').textContent = 
                                data.performanceMetrics.case_backlog;
                            document.getElementById('processing-time').textContent = 
                                data.performanceMetrics.average_case_processing_days + ' days';
                        }
                        
                        // Update operation counts
                        document.getElementById('policy-implementations').textContent = 
                            data.activeOperations.filter(op => op.operation_type === 'policy_implementation').length;
                        document.getElementById('oversight-activities').textContent = 
                            data.activeOperations.filter(op => op.operation_type === 'oversight').length;
                        document.getElementById('judicial-appointments').textContent = 
                            data.activeOperations.filter(op => op.operation_type === 'appointment').length;
                        document.getElementById('reform-initiatives').textContent = 
                            data.activeOperations.filter(op => op.operation_type === 'reform').length;
                        
                        addActivity('System metrics refreshed successfully', 'success');
                    } else {
                        addActivity(\`Failed to refresh metrics: \${result.error}\`, 'error');
                    }
                } catch (error) {
                    addActivity(\`Error refreshing metrics: \${error.message}\`, 'error');
                } finally {
                    hideLoading();
                }
            }
            
            async function generateAnalytics() {
                showLoading();
                
                try {
                    const response = await fetch(\`/api/justice/analytics/\${DEMO_CIV_ID}\`);
                    const result = await response.json();
                    
                    if (result.success) {
                        addActivity('Comprehensive analytics generated', 'success');
                        console.log('Justice Analytics:', result.data);
                        
                        // Show insights
                        if (result.data.insights && result.data.insights.length > 0) {
                            result.data.insights.slice(0, 3).forEach(insight => {
                                addActivity(\`Insight: \${insight}\`, '');
                            });
                        }
                    } else {
                        addActivity(\`Failed to generate analytics: \${result.error}\`, 'error');
                    }
                } catch (error) {
                    addActivity(\`Error generating analytics: \${error.message}\`, 'error');
                } finally {
                    hideLoading();
                }
            }
            
            async function simulateTimeStep() {
                showLoading();
                
                try {
                    const response = await fetch(\`/api/justice/simulate/\${DEMO_CIV_ID}\`, {
                        method: 'POST'
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        addActivity('Justice system simulation step completed', 'success');
                        await refreshMetrics();
                    } else {
                        addActivity(\`Simulation failed: \${result.error}\`, 'error');
                    }
                } catch (error) {
                    addActivity(\`Simulation error: \${error.message}\`, 'error');
                } finally {
                    hideLoading();
                }
            }
            
            function viewLegalSystem() {
                window.open('/api/legal/health', '_blank');
            }
            
            function exportReport() {
                addActivity('Justice Department report exported', 'success');
                // In a real implementation, this would generate and download a report
            }
            
            // Initialize dashboard
            document.addEventListener('DOMContentLoaded', function() {
                refreshMetrics();
                
                // Auto-refresh every 30 seconds
                setInterval(refreshMetrics, 30000);
            });
        </script>
    </body>
    </html>
  `);
});

export default router;
