import { Router } from 'express';

const router = Router();

router.get('/demo/interior', (_req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interior Department - Infrastructure & Public Works Command Center</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: #e0e6ed;
            min-height: 100vh;
            overflow-x: auto;
        }
        
        .header {
            background: rgba(0, 0, 0, 0.3);
            padding: 1rem 2rem;
            border-bottom: 2px solid #4a90e2;
            backdrop-filter: blur(10px);
        }
        
        .header h1 {
            color: #4a90e2;
            font-size: 2rem;
            font-weight: 300;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .header .subtitle {
            color: #8fa4b8;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 1.5rem;
            border: 1px solid rgba(74, 144, 226, 0.2);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-2px);
            border-color: rgba(74, 144, 226, 0.4);
            box-shadow: 0 8px 32px rgba(74, 144, 226, 0.1);
        }
        
        .card h3 {
            color: #4a90e2;
            margin-bottom: 1rem;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0.75rem 0;
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 6px;
        }
        
        .metric-label {
            color: #b8c5d1;
            font-size: 0.9rem;
        }
        
        .metric-value {
            color: #4a90e2;
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 0.5rem;
        }
        
        .status-operational { background-color: #27ae60; }
        .status-maintenance { background-color: #f39c12; }
        .status-critical { background-color: #e74c3c; }
        .status-planned { background-color: #3498db; }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            margin: 0.5rem 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4a90e2, #27ae60);
            transition: width 0.3s ease;
        }
        
        .action-buttons {
            display: flex;
            gap: 0.75rem;
            margin-top: 1rem;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 500;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #4a90e2, #357abd);
            color: white;
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: #e0e6ed;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn-warning {
            background: linear-gradient(135deg, #f39c12, #d68910);
            color: white;
        }
        
        .btn-success {
            background: linear-gradient(135deg, #27ae60, #1e8449);
            color: white;
        }
        
        .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .project-list {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .project-item {
            padding: 0.75rem;
            margin: 0.5rem 0;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 6px;
            border-left: 3px solid #4a90e2;
        }
        
        .project-title {
            font-weight: 600;
            color: #e0e6ed;
            margin-bottom: 0.25rem;
        }
        
        .project-details {
            font-size: 0.85rem;
            color: #8fa4b8;
        }
        
        .alert {
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 6px;
            border-left: 4px solid;
        }
        
        .alert-warning {
            background: rgba(243, 156, 18, 0.1);
            border-color: #f39c12;
            color: #f39c12;
        }
        
        .alert-info {
            background: rgba(74, 144, 226, 0.1);
            border-color: #4a90e2;
            color: #4a90e2;
        }
        
        .live-indicator {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #27ae60;
            font-size: 0.85rem;
            margin-left: auto;
        }
        
        .pulse {
            width: 8px;
            height: 8px;
            background: #27ae60;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        .grid-2 {
            grid-column: span 2;
        }
        
        @media (max-width: 768px) {
            .dashboard {
                grid-template-columns: 1fr;
                padding: 1rem;
            }
            
            .grid-2 {
                grid-column: span 1;
            }
            
            .header {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>
            🏗️ Interior Department Command Center
            <div class="live-indicator">
                <div class="pulse"></div>
                Live Infrastructure Monitoring
            </div>
        </h1>
        <div class="subtitle">Infrastructure Management • Public Works • Resource Development • Domestic Development</div>
    </div>

    <div class="dashboard">
        <!-- Infrastructure Overview -->
        <div class="card">
            <h3>🏛️ Infrastructure Overview</h3>
            <div class="metric">
                <span class="metric-label">Total Projects</span>
                <span class="metric-value" id="total-projects">42</span>
            </div>
            <div class="metric">
                <span class="metric-label">Active Projects</span>
                <span class="metric-value" id="active-projects">18</span>
            </div>
            <div class="metric">
                <span class="metric-label">Infrastructure Health</span>
                <span class="metric-value" id="infra-health">87%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 87%"></div>
            </div>
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="createProject()">New Project</button>
                <button class="btn btn-secondary" onclick="viewAllProjects()">View All</button>
            </div>
        </div>

        <!-- Budget & Resources -->
        <div class="card">
            <h3>💰 Budget & Resources</h3>
            <div class="metric">
                <span class="metric-label">Total Budget</span>
                <span class="metric-value">$2.4B</span>
            </div>
            <div class="metric">
                <span class="metric-label">Spent This Year</span>
                <span class="metric-value">$1.8B</span>
            </div>
            <div class="metric">
                <span class="metric-label">Available Funds</span>
                <span class="metric-value">$600M</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 75%"></div>
            </div>
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="requestFunding()">Request Funding</button>
                <button class="btn btn-secondary" onclick="viewBudget()">Budget Details</button>
            </div>
        </div>

        <!-- Active Projects -->
        <div class="card grid-2">
            <h3>🚧 Active Infrastructure Projects</h3>
            <div class="project-list">
                <div class="project-item">
                    <div class="project-title">
                        <span class="status-indicator status-operational"></span>
                        Hyperloop Transit System - Phase 2
                    </div>
                    <div class="project-details">Progress: 68% • Budget: $450M • Est. Completion: Q3 2157</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 68%"></div>
                    </div>
                </div>
                <div class="project-item">
                    <div class="project-title">
                        <span class="status-indicator status-maintenance"></span>
                        Orbital Platform Expansion
                    </div>
                    <div class="project-details">Progress: 34% • Budget: $1.2B • Est. Completion: Q1 2158</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 34%"></div>
                    </div>
                </div>
                <div class="project-item">
                    <div class="project-title">
                        <span class="status-indicator status-planned"></span>
                        Quantum Communication Grid
                    </div>
                    <div class="project-details">Progress: 12% • Budget: $800M • Est. Completion: Q4 2158</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 12%"></div>
                    </div>
                </div>
                <div class="project-item">
                    <div class="project-title">
                        <span class="status-indicator status-operational"></span>
                        Atmospheric Processors Network
                    </div>
                    <div class="project-details">Progress: 89% • Budget: $320M • Est. Completion: Q2 2157</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 89%"></div>
                    </div>
                </div>
            </div>
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="viewProjectDetails()">Project Details</button>
                <button class="btn btn-warning" onclick="updateProgress()">Update Progress</button>
            </div>
        </div>

        <!-- Public Works Orders -->
        <div class="card">
            <h3>🔧 Public Works Orders</h3>
            <div class="metric">
                <span class="metric-label">Pending Orders</span>
                <span class="metric-value" id="pending-orders">23</span>
            </div>
            <div class="metric">
                <span class="metric-label">In Progress</span>
                <span class="metric-value" id="in-progress-orders">15</span>
            </div>
            <div class="metric">
                <span class="metric-label">Overdue</span>
                <span class="metric-value" id="overdue-orders">3</span>
            </div>
            <div class="alert alert-warning">
                <strong>⚠️ Attention:</strong> 3 maintenance orders are overdue
            </div>
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="createWorkOrder()">New Work Order</button>
                <button class="btn btn-warning" onclick="viewOverdue()">View Overdue</button>
            </div>
        </div>

        <!-- Resource Development -->
        <div class="card">
            <h3>⛏️ Resource Development</h3>
            <div class="metric">
                <span class="metric-label">Active Operations</span>
                <span class="metric-value">12</span>
            </div>
            <div class="metric">
                <span class="metric-label">Daily Output</span>
                <span class="metric-value">2,450 units</span>
            </div>
            <div class="metric">
                <span class="metric-label">Environmental Compliance</span>
                <span class="metric-value">94%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 94%"></div>
            </div>
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="newResourceProject()">New Operation</button>
                <button class="btn btn-secondary" onclick="viewCompliance()">Compliance Report</button>
            </div>
        </div>

        <!-- Infrastructure Assets -->
        <div class="card">
            <h3>🏢 Infrastructure Assets</h3>
            <div class="metric">
                <span class="metric-label">Total Assets</span>
                <span class="metric-value">1,247</span>
            </div>
            <div class="metric">
                <span class="metric-label">Operational</span>
                <span class="metric-value">1,189</span>
            </div>
            <div class="metric">
                <span class="metric-label">Needs Maintenance</span>
                <span class="metric-value">34</span>
            </div>
            <div class="metric">
                <span class="metric-label">Critical Issues</span>
                <span class="metric-value">8</span>
            </div>
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="scheduleInspection()">Schedule Inspection</button>
                <button class="btn btn-warning" onclick="viewCritical()">Critical Issues</button>
            </div>
        </div>

        <!-- Emergency Response -->
        <div class="card grid-2">
            <h3>🚨 Emergency Response Center</h3>
            <div class="alert alert-info">
                <strong>ℹ️ Status:</strong> All systems operational - No active emergencies
            </div>
            <div class="metric">
                <span class="metric-label">Response Teams Ready</span>
                <span class="metric-value">8/8</span>
            </div>
            <div class="metric">
                <span class="metric-label">Emergency Equipment</span>
                <span class="metric-value">98% Ready</span>
            </div>
            <div class="metric">
                <span class="metric-label">Last Drill</span>
                <span class="metric-value">3 days ago</span>
            </div>
            <div class="action-buttons">
                <button class="btn btn-warning" onclick="initiateEmergencyResponse()">Emergency Response</button>
                <button class="btn btn-secondary" onclick="scheduleDrill()">Schedule Drill</button>
                <button class="btn btn-secondary" onclick="viewProtocols()">Response Protocols</button>
            </div>
        </div>
    </div>

    <script>
        // Simulate live data updates
        function updateMetrics() {
            const totalProjects = document.getElementById('total-projects');
            const activeProjects = document.getElementById('active-projects');
            const infraHealth = document.getElementById('infra-health');
            const pendingOrders = document.getElementById('pending-orders');
            const inProgressOrders = document.getElementById('in-progress-orders');
            const overdueOrders = document.getElementById('overdue-orders');
            
            // Simulate small changes in metrics
            if (Math.random() > 0.7) {
                const currentActive = parseInt(activeProjects.textContent);
                activeProjects.textContent = Math.max(15, Math.min(25, currentActive + (Math.random() > 0.5 ? 1 : -1)));
            }
            
            if (Math.random() > 0.8) {
                const currentPending = parseInt(pendingOrders.textContent);
                pendingOrders.textContent = Math.max(20, Math.min(30, currentPending + (Math.random() > 0.5 ? 1 : -1)));
            }
        }
        
        // Interior Department Actions
        function createProject() {
            alert('🏗️ Creating new infrastructure project...\n\nProject Type: Transportation\nLocation: Central District\nEstimated Cost: $250M\nDuration: 18 months');
        }
        
        function viewAllProjects() {
            alert('📋 Displaying all infrastructure projects:\n\n• Hyperloop Transit System\n• Orbital Platform Expansion\n• Quantum Communication Grid\n• Atmospheric Processors\n• Smart City Integration\n• Renewable Energy Grid');
        }
        
        function requestFunding() {
            alert('💰 Funding request submitted to Treasury:\n\nAmount: $500M\nPurpose: Critical Infrastructure Upgrades\nJustification: Aging systems require modernization\nExpected ROI: 15% over 10 years');
        }
        
        function viewBudget() {
            alert('📊 Budget Breakdown:\n\n• Transportation: $800M (33%)\n• Utilities: $600M (25%)\n• Public Works: $480M (20%)\n• Development: $360M (15%)\n• Emergency Reserve: $160M (7%)');
        }
        
        function createWorkOrder() {
            alert('🔧 Creating new public works order...\n\nType: Maintenance\nPriority: Medium\nLocation: Power Grid Station 7\nEstimated Duration: 8 hours\nRequired Crew: 4 technicians');
        }
        
        function viewOverdue() {
            alert('⚠️ Overdue Work Orders:\n\n1. Bridge Inspection - 5 days overdue\n2. Water Treatment Maintenance - 3 days overdue\n3. Traffic Signal Repair - 2 days overdue\n\nRecommendation: Prioritize bridge inspection due to safety concerns');
        }
        
        function newResourceProject() {
            alert('⛏️ New resource development operation:\n\nType: Rare Earth Mining\nLocation: Asteroid Belt Station 3\nEstimated Reserves: 50,000 tons\nEnvironmental Impact: Low\nPermit Status: Approved');
        }
        
        function viewCompliance() {
            alert('📋 Environmental Compliance Report:\n\n• Mining Operations: 96% compliant\n• Processing Facilities: 92% compliant\n• Waste Management: 98% compliant\n• Air Quality: 91% compliant\n\nOverall Rating: Excellent');
        }
        
        function scheduleInspection() {
            alert('🔍 Scheduling infrastructure inspection...\n\nAsset: Fusion Power Plant #3\nInspection Type: Annual Safety Review\nScheduled Date: Next Tuesday\nInspector: Chief Engineer Martinez\nEstimated Duration: 6 hours');
        }
        
        function viewCritical() {
            alert('🚨 Critical Infrastructure Issues:\n\n1. Water Treatment Plant - Filtration system failure\n2. Power Grid - Transformer overheating\n3. Transit Hub - Structural stress detected\n4. Communication Array - Signal degradation\n\nAll issues have emergency response teams assigned');
        }
        
        function initiateEmergencyResponse() {
            if (confirm('🚨 Are you sure you want to initiate emergency response protocols?')) {
                alert('🚨 EMERGENCY RESPONSE ACTIVATED\n\n• All response teams mobilized\n• Emergency supplies deployed\n• Communication channels opened\n• Backup systems activated\n• Incident command center established\n\nResponse Time: 4 minutes');
            }
        }
        
        function scheduleDrill() {
            alert('📅 Emergency drill scheduled:\n\nType: Infrastructure Failure Simulation\nDate: Next Friday 10:00 AM\nParticipants: All response teams\nScenario: Power grid failure during peak hours\nDuration: 2 hours');
        }
        
        function viewProtocols() {
            alert('📋 Emergency Response Protocols:\n\n• Infrastructure Failure Response\n• Natural Disaster Protocols\n• Cyber Attack Response\n• Public Safety Procedures\n• Evacuation Plans\n• Communication Protocols\n• Resource Allocation Guidelines');
        }
        
        function viewProjectDetails() {
            alert('📊 Hyperloop Transit System - Phase 2:\n\nStatus: On Schedule\nProgress: 68% Complete\nBudget Used: $306M of $450M\nTeam Size: 150 engineers\nNext Milestone: Tunnel completion (2 weeks)\nRisk Level: Low');
        }
        
        function updateProgress() {
            alert('📈 Progress updated:\n\nHyperloop Transit System: 68% → 71%\nOrbital Platform: 34% → 36%\nQuantum Grid: 12% → 15%\n\nAll projects remain on schedule');
        }
        
        // Update metrics every 5 seconds
        setInterval(updateMetrics, 5000);
        
        console.log('🏗️ Interior Department Command Center initialized');
        console.log('📊 Real-time infrastructure monitoring active');
        console.log('🔧 Public works management system online');
        console.log('⛏️ Resource development tracking enabled');
    </script>
</body>
</html>
  `);
});

export default router;
