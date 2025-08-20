/**
 * State Department Demo Page
 * 
 * Interactive demo for the Secretary of State and State Department operations
 */

import { Router, Request, Response } from 'express';

const stateDemo = Router();

/**
 * GET /demo/state
 * State Department demo page
 */
stateDemo.get('/demo/state', (req: Request, res: Response) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>State Department Command Center - Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: #ffffff;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
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
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #ffd700, #ffed4e);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 15px;
            padding: 25px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        .card h3 {
            font-size: 1.4rem;
            margin-bottom: 15px;
            color: #ffd700;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .card-content {
            line-height: 1.6;
        }
        
        .metric {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .metric:last-child {
            border-bottom: none;
        }
        
        .metric-value {
            font-weight: bold;
            color: #4ade80;
        }
        
        .actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 30px;
        }
        
        .action-btn {
            background: linear-gradient(45deg, #3b82f6, #1d4ed8);
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s ease;
            text-decoration: none;
            text-align: center;
            display: inline-block;
        }
        
        .action-btn:hover {
            background: linear-gradient(45deg, #1d4ed8, #1e40af);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
        }
        
        .action-btn.diplomatic {
            background: linear-gradient(45deg, #10b981, #059669);
        }
        
        .action-btn.diplomatic:hover {
            background: linear-gradient(45deg, #059669, #047857);
            box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
        }
        
        .action-btn.treaty {
            background: linear-gradient(45deg, #8b5cf6, #7c3aed);
        }
        
        .action-btn.treaty:hover {
            background: linear-gradient(45deg, #7c3aed, #6d28d9);
            box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4);
        }
        
        .action-btn.embassy {
            background: linear-gradient(45deg, #f59e0b, #d97706);
        }
        
        .action-btn.embassy:hover {
            background: linear-gradient(45deg, #d97706, #b45309);
            box-shadow: 0 5px 15px rgba(245, 158, 11, 0.4);
        }
        
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .status-allied { background-color: #10b981; }
        .status-friendly { background-color: #3b82f6; }
        .status-neutral { background-color: #6b7280; }
        .status-tense { background-color: #f59e0b; }
        .status-hostile { background-color: #ef4444; }
        
        .api-section {
            margin-top: 40px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 15px;
            padding: 25px;
        }
        
        .api-section h3 {
            color: #ffd700;
            margin-bottom: 20px;
            font-size: 1.3rem;
        }
        
        .endpoint {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            font-family: 'Courier New', monospace;
        }
        
        .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            margin-right: 10px;
            font-size: 0.8rem;
        }
        
        .method.get { background-color: #10b981; }
        .method.post { background-color: #3b82f6; }
        .method.put { background-color: #f59e0b; }
        .method.delete { background-color: #ef4444; }
        
        .relations-list {
            max-height: 200px;
            overflow-y: auto;
        }
        
        .relation-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .relation-item:last-child {
            border-bottom: none;
        }
        
        .trust-level {
            font-size: 0.9rem;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌍 State Department Command Center</h1>
            <p>Diplomatic Relations • Treaty Management • Embassy Operations • Foreign Policy</p>
        </div>
        
        <div class="dashboard">
            <div class="card">
                <h3>🤝 Diplomatic Relations</h3>
                <div class="card-content">
                    <div class="relations-list">
                        <div class="relation-item">
                            <span><span class="status-indicator status-allied"></span>Stellar Federation</span>
                            <span class="trust-level">Trust: +85</span>
                        </div>
                        <div class="relation-item">
                            <span><span class="status-indicator status-friendly"></span>Quantum Collective</span>
                            <span class="trust-level">Trust: +62</span>
                        </div>
                        <div class="relation-item">
                            <span><span class="status-indicator status-neutral"></span>Void Wanderers</span>
                            <span class="trust-level">Trust: +15</span>
                        </div>
                        <div class="relation-item">
                            <span><span class="status-indicator status-tense"></span>Iron Dominion</span>
                            <span class="trust-level">Trust: -23</span>
                        </div>
                        <div class="relation-item">
                            <span><span class="status-indicator status-hostile"></span>Shadow Syndicate</span>
                            <span class="trust-level">Trust: -78</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>📜 Active Treaties</h3>
                <div class="card-content">
                    <div class="metric">
                        <span>Trade Agreements</span>
                        <span class="metric-value">7</span>
                    </div>
                    <div class="metric">
                        <span>Military Alliances</span>
                        <span class="metric-value">3</span>
                    </div>
                    <div class="metric">
                        <span>Cultural Exchanges</span>
                        <span class="metric-value">5</span>
                    </div>
                    <div class="metric">
                        <span>Research Partnerships</span>
                        <span class="metric-value">4</span>
                    </div>
                    <div class="metric">
                        <span>Non-Aggression Pacts</span>
                        <span class="metric-value">12</span>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>🏛️ Embassy Network</h3>
                <div class="card-content">
                    <div class="metric">
                        <span>Operational Embassies</span>
                        <span class="metric-value">18</span>
                    </div>
                    <div class="metric">
                        <span>Consulates</span>
                        <span class="metric-value">31</span>
                    </div>
                    <div class="metric">
                        <span>Trade Offices</span>
                        <span class="metric-value">24</span>
                    </div>
                    <div class="metric">
                        <span>Cultural Centers</span>
                        <span class="metric-value">15</span>
                    </div>
                    <div class="metric">
                        <span>Diplomatic Personnel</span>
                        <span class="metric-value">847</span>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>📨 Communications</h3>
                <div class="card-content">
                    <div class="metric">
                        <span>Pending Responses</span>
                        <span class="metric-value">12</span>
                    </div>
                    <div class="metric">
                        <span>Urgent Messages</span>
                        <span class="metric-value">3</span>
                    </div>
                    <div class="metric">
                        <span>Classified Channels</span>
                        <span class="metric-value">8</span>
                    </div>
                    <div class="metric">
                        <span>Translation Queue</span>
                        <span class="metric-value">7</span>
                    </div>
                    <div class="metric">
                        <span>Diplomatic Pouches</span>
                        <span class="metric-value">23</span>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>⚠️ Current Issues</h3>
                <div class="card-content">
                    <div class="metric">
                        <span>Border Disputes</span>
                        <span class="metric-value" style="color: #f59e0b;">2</span>
                    </div>
                    <div class="metric">
                        <span>Trade Violations</span>
                        <span class="metric-value" style="color: #f59e0b;">1</span>
                    </div>
                    <div class="metric">
                        <span>Diplomatic Incidents</span>
                        <span class="metric-value" style="color: #ef4444;">3</span>
                    </div>
                    <div class="metric">
                        <span>Treaty Violations</span>
                        <span class="metric-value" style="color: #ef4444;">1</span>
                    </div>
                    <div class="metric">
                        <span>Security Breaches</span>
                        <span class="metric-value" style="color: #ef4444;">0</span>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>📊 Department Status</h3>
                <div class="card-content">
                    <div class="metric">
                        <span>Secretary Approval</span>
                        <span class="metric-value">94%</span>
                    </div>
                    <div class="metric">
                        <span>Response Time</span>
                        <span class="metric-value">4.2 hrs</span>
                    </div>
                    <div class="metric">
                        <span>Success Rate</span>
                        <span class="metric-value">87%</span>
                    </div>
                    <div class="metric">
                        <span>Budget Utilization</span>
                        <span class="metric-value">76%</span>
                    </div>
                    <div class="metric">
                        <span>Staff Efficiency</span>
                        <span class="metric-value">91%</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="actions">
            <button class="action-btn diplomatic" onclick="initiateContact()">
                🤝 Initiate Diplomatic Contact
            </button>
            <button class="action-btn treaty" onclick="proposeTreaty()">
                📜 Propose New Treaty
            </button>
            <button class="action-btn embassy" onclick="establishEmbassy()">
                🏛️ Establish Embassy
            </button>
            <button class="action-btn" onclick="sendCommunication()">
                📨 Send Diplomatic Message
            </button>
            <button class="action-btn diplomatic" onclick="viewRelations()">
                🌐 View All Relations
            </button>
            <button class="action-btn" onclick="viewDashboard()">
                📊 Full Dashboard
            </button>
        </div>
        
        <div class="api-section">
            <h3>🔧 State Department API Endpoints</h3>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <strong>/api/state/relations</strong> - Get diplomatic relations
            </div>
            
            <div class="endpoint">
                <span class="method put">PUT</span>
                <strong>/api/state/relations</strong> - Update diplomatic relation
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <strong>/api/state/relations/event</strong> - Record diplomatic event
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <strong>/api/state/treaties</strong> - Get treaties
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <strong>/api/state/treaties</strong> - Create new treaty
            </div>
            
            <div class="endpoint">
                <span class="method put">PUT</span>
                <strong>/api/state/treaties/:id/status</strong> - Update treaty status
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <strong>/api/state/embassies</strong> - Get embassies
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <strong>/api/state/embassies</strong> - Establish new embassy
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <strong>/api/state/communications</strong> - Get diplomatic communications
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <strong>/api/state/communications</strong> - Send diplomatic communication
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <strong>/api/state/dashboard</strong> - Get comprehensive dashboard data
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <strong>/api/state/actions/initiate-contact</strong> - Initiate diplomatic contact
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <strong>/api/state/actions/propose-treaty</strong> - Propose new treaty
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <strong>/api/state/actions/establish-embassy</strong> - Request embassy establishment
            </div>
        </div>
    </div>
    
    <script>
        // Demo functions for interactive buttons
        function initiateContact() {
            alert('🤝 Diplomatic Contact Initiated\\n\\nSending formal greeting to selected civilization...\\n\\nExpected response time: 2-4 hours');
        }
        
        function proposeTreaty() {
            alert('📜 Treaty Proposal Drafted\\n\\nProposing trade agreement with mutual benefits...\\n\\nNegotiation timeline: 2-3 weeks');
        }
        
        function establishEmbassy() {
            alert('🏛️ Embassy Request Sent\\n\\nRequesting permission to establish diplomatic mission...\\n\\nApproval expected: 1-2 weeks');
        }
        
        function sendCommunication() {
            alert('📨 Diplomatic Message Sent\\n\\nSecure communication transmitted via diplomatic pouch...\\n\\nDelivery confirmed');
        }
        
        function viewRelations() {
            alert('🌐 Diplomatic Relations Overview\\n\\n• 18 Active relationships\\n• 7 Allied nations\\n• 3 Hostile relations\\n• 8 Neutral contacts');
        }
        
        function viewDashboard() {
            // Simulate API call
            fetch('/api/state/dashboard?civilizationId=player_civ')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('📊 Dashboard Data Retrieved\\n\\nFull diplomatic status loaded successfully!');
                    } else {
                        alert('⚠️ Dashboard Error\\n\\nUnable to load complete data. Please try again.');
                    }
                })
                .catch(error => {
                    alert('🔧 Demo Mode\\n\\nThis is a demonstration. In the full system, this would show comprehensive diplomatic analytics.');
                });
        }
        
        // Auto-refresh simulation
        setInterval(() => {
            const metrics = document.querySelectorAll('.metric-value');
            metrics.forEach(metric => {
                if (Math.random() < 0.1) { // 10% chance to update
                    const currentValue = parseInt(metric.textContent);
                    if (!isNaN(currentValue)) {
                        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                        metric.textContent = Math.max(0, currentValue + change);
                    }
                }
            });
        }, 5000);
    </script>
</body>
</html>
  `;
  
  res.send(html);
});

export default stateDemo;
