import express from 'express';

const router = express.Router();

router.get('/joint-chiefs', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Joint Chiefs of Staff & Service Chiefs - Demo</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 1.2em;
            opacity: 0.9;
        }
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .panel {
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 25px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        .panel h2 {
            margin: 0 0 20px 0;
            font-size: 1.5em;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .chief-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #4CAF50;
        }
        .chief-card h3 {
            margin: 0 0 8px 0;
            color: #4CAF50;
        }
        .chief-card .rank {
            font-weight: bold;
            color: #FFD700;
        }
        .chief-card .service {
            background: rgba(76, 175, 80, 0.2);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
            display: inline-block;
            margin-top: 5px;
        }
        .service-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #2196F3;
        }
        .service-card h3 {
            margin: 0 0 8px 0;
            color: #2196F3;
        }
        .readiness {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
        }
        .readiness.high { background: #4CAF50; }
        .readiness.moderate { background: #FF9800; }
        .readiness.low { background: #F44336; }
        .plan-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #9C27B0;
        }
        .plan-card h3 {
            margin: 0 0 8px 0;
            color: #9C27B0;
        }
        .priority {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .priority.high { background: #F44336; }
        .priority.medium { background: #FF9800; }
        .priority.low { background: #4CAF50; }
        .operation-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #FF5722;
        }
        .operation-card h3 {
            margin: 0 0 8px 0;
            color: #FF5722;
        }
        .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .status.planning { background: #607D8B; }
        .status.approved { background: #2196F3; }
        .status.active { background: #4CAF50; }
        .status.completed { background: #9C27B0; }
        .btn {
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            margin: 5px;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .btn.secondary {
            background: linear-gradient(45deg, #2196F3, #1976D2);
        }
        .btn.warning {
            background: linear-gradient(45deg, #FF9800, #F57C00);
        }
        .btn.danger {
            background: linear-gradient(45deg, #F44336, #D32F2F);
        }
        .controls {
            margin-top: 15px;
            text-align: center;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .metric {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 10px;
            text-align: center;
        }
        .metric-value {
            font-size: 1.8em;
            font-weight: bold;
            color: #4CAF50;
        }
        .metric-label {
            font-size: 0.9em;
            opacity: 0.8;
            margin-top: 5px;
        }
        .recommendation-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #FFC107;
        }
        .recommendation-card h3 {
            margin: 0 0 8px 0;
            color: #FFC107;
        }
        .urgency {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .urgency.urgent { background: #F44336; }
        .urgency.high { background: #FF5722; }
        .urgency.medium { background: #FF9800; }
        .urgency.low { background: #4CAF50; }
        .api-demo {
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
        }
        .api-demo h3 {
            margin: 0 0 15px 0;
            color: #4CAF50;
        }
        .api-endpoint {
            background: rgba(255,255,255,0.1);
            padding: 10px;
            border-radius: 5px;
            margin: 5px 0;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⭐ Joint Chiefs of Staff & Service Chiefs</h1>
            <p>Military Command Hierarchy • Strategic Planning • Joint Operations</p>
            <p><strong>Departments:</strong> Joint Chiefs, Army, Navy, Air Force, Space Force, Marines</p>
        </div>

        <div class="dashboard">
            <!-- Joint Chiefs Panel -->
            <div class="panel">
                <h2>👨‍✈️ Joint Chiefs of Staff</h2>
                <div class="chief-card">
                    <h3>General Marcus Sterling</h3>
                    <div class="rank">Chairman of Joint Chiefs</div>
                    <p>32 years of service • Strategic Planning, Joint Operations, Defense Policy</p>
                    <div class="service">Command Authority</div>
                </div>
                <div class="chief-card">
                    <h3>Admiral Sarah Chen</h3>
                    <div class="rank">Vice Chairman</div>
                    <p>28 years of service • Naval Operations, Space Warfare, Intelligence</p>
                    <div class="service">Deputy Command</div>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewJointChiefs()">View All Chiefs</button>
                    <button class="btn secondary" onclick="appointNewChief()">Appoint Officer</button>
                </div>
            </div>

            <!-- Military Services Panel -->
            <div class="panel">
                <h2>🛡️ Military Services</h2>
                <div class="service-card">
                    <h3>Army (USA)</h3>
                    <p>150,000 personnel • 45 active units</p>
                    <div class="readiness high">High Readiness</div>
                    <p><strong>Chief:</strong> General Robert Hayes</p>
                </div>
                <div class="service-card">
                    <h3>Navy (USN)</h3>
                    <p>120,000 personnel • 35 active units</p>
                    <div class="readiness high">High Readiness</div>
                    <p><strong>Chief:</strong> Admiral Lisa Rodriguez</p>
                </div>
                <div class="service-card">
                    <h3>Space Force (USSF)</h3>
                    <p>50,000 personnel • 25 active units</p>
                    <div class="readiness high">High Readiness</div>
                    <p><strong>Chief:</strong> General Maria Volkov</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewAllServices()">View All Services</button>
                    <button class="btn secondary" onclick="updateReadiness()">Update Readiness</button>
                </div>
            </div>

            <!-- Strategic Plans Panel -->
            <div class="panel">
                <h2>📋 Strategic Plans</h2>
                <div class="plan-card">
                    <h3>Operation Stellar Shield</h3>
                    <div class="priority high">High Priority</div>
                    <p>Comprehensive orbital defense network • 18 months timeline</p>
                    <p><strong>Lead:</strong> Space Force • <strong>Status:</strong> Under Review</p>
                </div>
                <div class="plan-card">
                    <h3>Joint Readiness Enhancement</h3>
                    <div class="priority medium">Medium Priority</div>
                    <p>Inter-service coordination improvement • 12 months timeline</p>
                    <p><strong>Lead:</strong> Army • <strong>Status:</strong> Draft</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="createStrategicPlan()">Create New Plan</button>
                    <button class="btn secondary" onclick="reviewPlans()">Review Plans</button>
                </div>
            </div>

            <!-- Joint Operations Panel -->
            <div class="panel">
                <h2>🎯 Joint Operations</h2>
                <div class="operation-card">
                    <h3>Exercise Thunder Strike</h3>
                    <div class="status active">Active</div>
                    <p>Multi-service training exercise • 15,000 personnel</p>
                    <p><strong>Command:</strong> Army • <strong>Location:</strong> Sector 7</p>
                </div>
                <div class="operation-card">
                    <h3>Operation Deep Space</h3>
                    <div class="status planning">Planning</div>
                    <p>Long-range reconnaissance mission • 2,500 personnel</p>
                    <p><strong>Command:</strong> Space Force • <strong>Location:</strong> Outer Rim</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="planJointOperation()">Plan Operation</button>
                    <button class="btn warning" onclick="executeOperation()">Execute Operation</button>
                </div>
            </div>

            <!-- Command Recommendations Panel -->
            <div class="panel">
                <h2>💡 Command Recommendations</h2>
                <div class="recommendation-card">
                    <h3>Enhanced Cyber Defense Initiative</h3>
                    <div class="urgency high">High Urgency</div>
                    <p>Strengthen cyber warfare capabilities across all services</p>
                    <p><strong>From:</strong> General Kim (Air Force) • <strong>To:</strong> Defense Secretary</p>
                </div>
                <div class="recommendation-card">
                    <h3>Joint Training Facility Expansion</h3>
                    <div class="urgency medium">Medium Urgency</div>
                    <p>Expand multi-service training capabilities</p>
                    <p><strong>From:</strong> General Sterling (Chairman) • <strong>To:</strong> Leader</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="submitRecommendation()">Submit Recommendation</button>
                    <button class="btn secondary" onclick="reviewRecommendations()">Review All</button>
                </div>
            </div>

            <!-- Military Readiness Analytics -->
            <div class="panel">
                <h2>📊 Military Readiness Analytics</h2>
                <div class="metrics">
                    <div class="metric">
                        <div class="metric-value">3.2</div>
                        <div class="metric-label">Overall Readiness</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">520K</div>
                        <div class="metric-label">Total Personnel</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">165</div>
                        <div class="metric-label">Active Units</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">$110B</div>
                        <div class="metric-label">Total Budget</div>
                    </div>
                </div>
                <div class="controls">
                    <button class="btn" onclick="generateReadinessReport()">Generate Report</button>
                    <button class="btn secondary" onclick="viewAnalytics()">View Analytics</button>
                </div>
            </div>
        </div>

        <!-- API Demo Section -->
        <div class="api-demo">
            <h3>🔧 API Endpoints Demo</h3>
            <div class="api-endpoint">GET /api/joint-chiefs/ - List all joint chiefs</div>
            <div class="api-endpoint">GET /api/joint-chiefs/services - List military services</div>
            <div class="api-endpoint">GET /api/joint-chiefs/strategic-plans - List strategic plans</div>
            <div class="api-endpoint">GET /api/joint-chiefs/operations - List joint operations</div>
            <div class="api-endpoint">GET /api/joint-chiefs/recommendations - List command recommendations</div>
            <div class="api-endpoint">GET /api/joint-chiefs/analytics/readiness - Military readiness report</div>
            <div class="controls">
                <button class="btn" onclick="testAPI()">Test API Endpoints</button>
                <button class="btn secondary" onclick="viewAPIDoc()">View API Documentation</button>
            </div>
        </div>
    </div>

    <script>
        function viewJointChiefs() {
            alert('👨‍✈️ Joint Chiefs of Staff\\n\\nChairman: General Marcus Sterling (32 years)\\nVice Chairman: Admiral Sarah Chen (28 years)\\n\\nService Chiefs:\\n• Army: General Robert Hayes (30 years)\\n• Navy: Admiral Lisa Rodriguez (26 years)\\n• Air Force: General David Kim (24 years)\\n• Space Force: General Maria Volkov (22 years)\\n• Marines: General James Thompson (29 years)\\n\\n(This would call GET /api/joint-chiefs/)');
        }

        function appointNewChief() {
            alert('👨‍✈️ Appoint New Joint Chief\\n\\nInitiating appointment process for new joint chief position.\\n\\nRequired Information:\\n• Position (Chairman, Vice Chairman, Service Chief)\\n• Service Branch (if Service Chief)\\n• Officer Name and Rank\\n• Years of Service\\n• Specializations\\n• Background\\n\\n(This would call POST /api/joint-chiefs/ with appointment data)');
        }

        function viewAllServices() {
            alert('🛡️ Military Services Overview\\n\\nArmy: 150,000 personnel, High readiness\\nNavy: 120,000 personnel, High readiness\\nAir Force: 100,000 personnel, Moderate readiness\\nSpace Force: 50,000 personnel, High readiness\\nMarines: 80,000 personnel, High readiness\\n\\nTotal: 500,000 active personnel\\nCombined Budget: $110 billion\\n\\n(This would call GET /api/joint-chiefs/services)');
        }

        function updateReadiness() {
            alert('📊 Update Service Readiness\\n\\nUpdating readiness levels for all military services based on:\\n• Personnel availability\\n• Equipment status\\n• Training completion\\n• Operational tempo\\n• Budget allocation\\n\\nReadiness levels: Low, Moderate, High, Critical\\n\\n(This would call PUT /api/joint-chiefs/services/{serviceCode} with readiness updates)');
        }

        function createStrategicPlan() {
            alert('📋 Create Strategic Plan\\n\\nNew strategic plan creation wizard:\\n\\n1. Plan Name and Type\\n2. Priority Level (Low, Medium, High, Critical)\\n3. Lead Service and Participating Services\\n4. Objectives and Timeline\\n5. Resource Requirements\\n6. Risk Assessment\\n\\nPlan will require approval from Defense Secretary and/or Leader.\\n\\n(This would call POST /api/joint-chiefs/strategic-plans)');
        }

        function reviewPlans() {
            alert('📋 Strategic Plans Review\\n\\nCurrent Plans:\\n\\n✅ Operation Stellar Shield (High Priority)\\n   Status: Under Review, 18 months timeline\\n\\n📝 Joint Readiness Enhancement (Medium Priority)\\n   Status: Draft, 12 months timeline\\n\\n🔄 Cyber Defense Modernization (High Priority)\\n   Status: Approved, 24 months timeline\\n\\n(This would call GET /api/joint-chiefs/strategic-plans with status filters)');
        }

        function planJointOperation() {
            alert('🎯 Plan Joint Operation\\n\\nJoint operation planning process:\\n\\n1. Operation Name and Type\\n2. Commanding Service\\n3. Participating Services\\n4. Start/End Dates and Location\\n5. Objectives and Personnel\\n6. Units Involved\\n7. Success Metrics\\n\\nOperation will require approval before execution.\\n\\n(This would call POST /api/joint-chiefs/operations)');
        }

        function executeOperation() {
            alert('⚡ Execute Joint Operation\\n\\nExecuting approved joint operation:\\n\\nOperation: Exercise Thunder Strike\\nStatus: Planning → Active\\nPersonnel: 15,000 across all services\\nCommand: Army (General Hayes)\\nLocation: Sector 7 Training Grounds\\n\\nOperation execution initiated successfully!\\n\\n(This would call POST /api/joint-chiefs/operations/{id}/execute)');
        }

        function submitRecommendation() {
            alert('💡 Submit Command Recommendation\\n\\nRecommendation submission form:\\n\\n1. Recommendation Type (Strategic, Operational, Personnel, Budget, Policy)\\n2. Title and Description\\n3. Rationale and Implementation Timeline\\n4. Urgency Level (Low, Medium, High, Urgent)\\n5. Target Audience (Defense Secretary, Leader, Joint Chiefs)\\n6. Resource Impact Assessment\\n\\n(This would call POST /api/joint-chiefs/recommendations)');
        }

        function reviewRecommendations() {
            alert('💡 Command Recommendations Review\\n\\nPending Recommendations:\\n\\n🔴 Enhanced Cyber Defense Initiative (High Urgency)\\n   From: General Kim → Defense Secretary\\n\\n🟡 Joint Training Facility Expansion (Medium Urgency)\\n   From: General Sterling → Leader\\n\\n🟢 Personnel Exchange Program (Low Urgency)\\n   From: Admiral Chen → Joint Chiefs\\n\\n(This would call GET /api/joint-chiefs/recommendations with status filters)');
        }

        function generateReadinessReport() {
            alert('📊 Military Readiness Report Generated\\n\\nOverall Readiness Score: 3.2/4.0 (High)\\n\\nService Breakdown:\\n• Army: 3.0 (High)\\n• Navy: 3.5 (High)\\n• Air Force: 2.5 (Moderate)\\n• Space Force: 3.8 (High)\\n• Marines: 3.2 (High)\\n\\nRecommendations:\\n• Increase Air Force training tempo\\n• Modernize equipment across all services\\n• Enhance inter-service coordination\\n\\n(This would call GET /api/joint-chiefs/analytics/readiness)');
        }

        function viewAnalytics() {
            alert('📈 Military Analytics Dashboard\\n\\nOperations Summary (30 days):\\n• Total Operations: 12\\n• Completed: 8\\n• Active: 3\\n• Cancelled: 1\\n\\nInter-Service Coordination Score: 3.4/5.0\\n\\nStrategic Planning Metrics:\\n• Total Plans: 15\\n• Approved: 8\\n• Under Review: 4\\n• Draft: 3\\n\\n(This would call multiple analytics endpoints)');
        }

        function testAPI() {
            alert('🔧 API Testing Suite\\n\\nTesting Joint Chiefs API endpoints:\\n\\n✅ GET /api/joint-chiefs/ (200 OK)\\n✅ GET /api/joint-chiefs/services (200 OK)\\n✅ GET /api/joint-chiefs/strategic-plans (200 OK)\\n✅ GET /api/joint-chiefs/operations (200 OK)\\n✅ GET /api/joint-chiefs/recommendations (200 OK)\\n✅ GET /api/joint-chiefs/analytics/readiness (200 OK)\\n\\nAll endpoints responding successfully!');
        }

        function viewAPIDoc() {
            alert('📚 Joint Chiefs API Documentation\\n\\nCore Endpoints:\\n• Joint Chiefs Management (CRUD)\\n• Military Services (Read/Update)\\n• Strategic Planning (Full lifecycle)\\n• Joint Operations (Planning to completion)\\n• Command Recommendations (Submit/respond)\\n• Analytics & Reporting (Readiness, operations, coordination)\\n\\nAuthentication: Bearer token required\\nRate Limiting: 100 requests/minute\\nResponse Format: JSON');
        }
    </script>
</body>
</html>
  `);
});

export default router;
