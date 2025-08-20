import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/central-bank', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Central Bank Advisory System - Monetary Policy Command Center</title>
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
                overflow-x: hidden;
            }
            
            .header {
                background: rgba(0, 0, 0, 0.3);
                padding: 1.5rem 2rem;
                border-bottom: 2px solid #2a5298;
                backdrop-filter: blur(10px);
            }
            
            .header h1 {
                font-size: 2.8rem;
                font-weight: 300;
                margin-bottom: 0.5rem;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .header .subtitle {
                font-size: 1.2rem;
                opacity: 0.9;
                font-weight: 300;
            }
            
            .dashboard {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 2rem;
                padding: 2rem;
                max-width: 1600px;
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
                border-color: #2a5298;
            }
            
            .panel h2 {
                font-size: 1.4rem;
                margin-bottom: 1rem;
                color: #ffd700;
                border-bottom: 2px solid #ffd700;
                padding-bottom: 0.5rem;
            }
            
            .metric {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0.8rem 0;
                padding: 0.6rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
            }
            
            .metric-value {
                font-weight: bold;
                font-size: 1.2rem;
                color: #ffd700;
            }
            
            .status-indicator {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-right: 8px;
            }
            
            .status-stable { background-color: #4CAF50; }
            .status-watch { background-color: #FF9800; }
            .status-concern { background-color: #f44336; }
            .status-pending { background-color: #2196F3; }
            .status-approved { background-color: #8BC34A; }
            
            .action-buttons {
                display: flex;
                gap: 1rem;
                margin-top: 1rem;
                flex-wrap: wrap;
            }
            
            .btn {
                padding: 0.8rem 1.4rem;
                border: none;
                border-radius: 6px;
                background: linear-gradient(135deg, #2a5298, #1e3c72);
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
                box-shadow: 0 4px 12px rgba(42, 82, 152, 0.3);
                background: linear-gradient(135deg, #1e3c72, #2a5298);
            }
            
            .btn-secondary {
                background: linear-gradient(135deg, #6c757d, #5a6268);
            }
            
            .btn-secondary:hover {
                background: linear-gradient(135deg, #5a6268, #495057);
            }
            
            .btn-critical {
                background: linear-gradient(135deg, #f44336, #d32f2f);
            }
            
            .btn-critical:hover {
                background: linear-gradient(135deg, #d32f2f, #c62828);
            }
            
            .btn-success {
                background: linear-gradient(135deg, #4CAF50, #388E3C);
            }
            
            .btn-success:hover {
                background: linear-gradient(135deg, #388E3C, #2E7D32);
            }
            
            .recommendation-item {
                background: rgba(255, 255, 255, 0.05);
                margin: 0.5rem 0;
                padding: 1rem;
                border-radius: 8px;
                border-left: 4px solid #ffd700;
            }
            
            .recommendation-critical { border-left-color: #f44336; }
            .recommendation-high { border-left-color: #ff9800; }
            .recommendation-medium { border-left-color: #2196F3; }
            .recommendation-low { border-left-color: #4caf50; }
            
            .policy-item {
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
                background: linear-gradient(90deg, #ffd700, #ffb300);
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
                border-left: 3px solid #ffd700;
            }
            
            .independence-panel {
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 193, 7, 0.1));
                border: 1px solid rgba(255, 215, 0, 0.3);
            }
            
            .independence-panel h2 {
                color: #ffd700;
                border-bottom-color: #ffd700;
            }
            
            .crisis-panel {
                background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(211, 47, 47, 0.1));
                border: 1px solid rgba(244, 67, 54, 0.3);
            }
            
            .crisis-panel h2 {
                color: #f44336;
                border-bottom-color: #f44336;
            }
            
            .stability-excellent { color: #4CAF50; }
            .stability-good { color: #8BC34A; }
            .stability-fair { color: #FF9800; }
            .stability-poor { color: #f44336; }
            
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
                    font-size: 2.2rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🏦 Central Bank Advisory System</h1>
            <p class="subtitle">Monetary Policy Command Center - Independent Advisory with Leader Authority</p>
        </div>
        
        <div class="dashboard">
            <!-- Central Bank Overview -->
            <div class="panel independence-panel">
                <h2>🎯 Central Bank Overview</h2>
                <div class="metric">
                    <span>Independence Score</span>
                    <span class="metric-value">85/100</span>
                </div>
                <div class="metric">
                    <span>Policy Rate</span>
                    <span class="metric-value">2.50%</span>
                </div>
                <div class="metric">
                    <span>Inflation Target</span>
                    <span class="metric-value">2.00%</span>
                </div>
                <div class="metric">
                    <span>Market Confidence</span>
                    <span class="metric-value">7.5/10</span>
                </div>
                <div class="metric">
                    <span>Policy Stance</span>
                    <span class="metric-value">Neutral</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 85%"></div>
                </div>
            </div>
            
            <!-- Pending Policy Recommendations -->
            <div class="panel">
                <h2>📋 Policy Recommendations</h2>
                <div class="metric">
                    <span>Pending Decisions</span>
                    <span class="metric-value">3</span>
                </div>
                <div class="recommendation-item recommendation-critical">
                    <strong>Interest Rate Adjustment</strong><br>
                    <small>Recommend 0.25% increase due to inflation pressures</small>
                    <span class="status-indicator status-pending"></span>
                </div>
                <div class="recommendation-item recommendation-high">
                    <strong>Reserve Requirement Update</strong><br>
                    <small>Increase to 12% to manage liquidity</small>
                    <span class="status-indicator status-pending"></span>
                </div>
                <div class="recommendation-item recommendation-medium">
                    <strong>Forward Guidance Revision</strong><br>
                    <small>Update market communication strategy</small>
                    <span class="status-indicator status-pending"></span>
                </div>
                <div class="action-buttons">
                    <button class="btn" onclick="reviewRecommendations()">Review All</button>
                    <button class="btn btn-success" onclick="createRecommendation()">New Recommendation</button>
                </div>
            </div>
            
            <!-- Financial Stability Monitor -->
            <div class="panel">
                <h2>📊 Financial Stability</h2>
                <div class="metric">
                    <span>Overall Rating</span>
                    <span class="metric-value stability-good">Stable</span>
                </div>
                <div class="metric">
                    <span>Banking Health</span>
                    <span class="metric-value stability-excellent">Excellent</span>
                </div>
                <div class="metric">
                    <span>Market Volatility</span>
                    <span class="metric-value stability-good">Low</span>
                </div>
                <div class="metric">
                    <span>Systemic Risk</span>
                    <span class="metric-value stability-good">Minimal</span>
                </div>
                <div class="policy-item">
                    <div>
                        <strong>Banking Stress Test</strong><br>
                        <small>Completed: All major banks pass</small>
                    </div>
                    <span class="status-indicator status-stable"></span>
                </div>
                <div class="action-buttons">
                    <button class="btn" onclick="runStabilityAssessment()">Run Assessment</button>
                    <button class="btn btn-secondary" onclick="viewIndicators()">View Indicators</button>
                </div>
            </div>
            
            <!-- Monetary Policy Settings -->
            <div class="panel">
                <h2>⚙️ Current Policy Settings</h2>
                <div class="policy-item">
                    <div>
                        <strong>Policy Rate</strong><br>
                        <small>Last changed: 3 months ago</small>
                    </div>
                    <span class="metric-value">2.50%</span>
                </div>
                <div class="policy-item">
                    <div>
                        <strong>Deposit Rate</strong><br>
                        <small>Central Bank deposits</small>
                    </div>
                    <span class="metric-value">1.50%</span>
                </div>
                <div class="policy-item">
                    <div>
                        <strong>Lending Rate</strong><br>
                        <small>Emergency lending facility</small>
                    </div>
                    <span class="metric-value">3.50%</span>
                </div>
                <div class="policy-item">
                    <div>
                        <strong>Reserve Requirement</strong><br>
                        <small>Bank reserve ratio</small>
                    </div>
                    <span class="metric-value">10.0%</span>
                </div>
                <div class="action-buttons">
                    <button class="btn" onclick="updatePolicy()">Update Policy</button>
                    <button class="btn btn-secondary" onclick="policyHistory()">View History</button>
                </div>
            </div>
            
            <!-- Economic Research & Forecasts -->
            <div class="panel">
                <h2>📈 Economic Research</h2>
                <div class="metric">
                    <span>GDP Forecast (Next Year)</span>
                    <span class="metric-value">+3.2%</span>
                </div>
                <div class="metric">
                    <span>Inflation Projection</span>
                    <span class="metric-value">2.1%</span>
                </div>
                <div class="policy-item">
                    <div>
                        <strong>Quarterly Economic Outlook</strong><br>
                        <small>Published: Last week</small>
                    </div>
                    <span class="status-indicator status-approved"></span>
                </div>
                <div class="policy-item">
                    <div>
                        <strong>Financial Stability Report</strong><br>
                        <small>Due: Next month</small>
                    </div>
                    <span class="status-indicator status-pending"></span>
                </div>
                <div class="action-buttons">
                    <button class="btn" onclick="viewForecasts()">View Forecasts</button>
                    <button class="btn btn-secondary" onclick="createResearch()">New Research</button>
                </div>
            </div>
            
            <!-- Crisis Management Protocols -->
            <div class="panel crisis-panel">
                <h2>🚨 Crisis Management</h2>
                <div class="metric">
                    <span>Active Protocols</span>
                    <span class="metric-value">3</span>
                </div>
                <div class="policy-item">
                    <div>
                        <strong>Banking Crisis Protocol</strong><br>
                        <small>Ready for activation</small>
                    </div>
                    <span class="status-indicator status-stable"></span>
                </div>
                <div class="policy-item">
                    <div>
                        <strong>Currency Crisis Protocol</strong><br>
                        <small>Ready for activation</small>
                    </div>
                    <span class="status-indicator status-stable"></span>
                </div>
                <div class="policy-item">
                    <div>
                        <strong>Inflation Crisis Protocol</strong><br>
                        <small>Ready for activation</small>
                    </div>
                    <span class="status-indicator status-stable"></span>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-critical" onclick="activateCrisisProtocol()">Activate Protocol</button>
                    <button class="btn btn-secondary" onclick="reviewProtocols()">Review Protocols</button>
                </div>
            </div>
            
            <!-- Leader Interaction & Decision Authority -->
            <div class="panel full-width">
                <h2>👑 Leader Authority & Central Bank Independence</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">
                    <div>
                        <h3>🎯 Advisory Role</h3>
                        <div class="metric">
                            <span>Recommendations Made</span>
                            <span class="metric-value">24</span>
                        </div>
                        <div class="metric">
                            <span>Leader Acceptance Rate</span>
                            <span class="metric-value">78%</span>
                        </div>
                        <ul style="list-style: none; padding: 0; margin-top: 0.5rem;">
                            <li>• Expert economic analysis</li>
                            <li>• Independent policy recommendations</li>
                            <li>• Financial stability oversight</li>
                            <li>• Crisis response protocols</li>
                        </ul>
                    </div>
                    <div>
                        <h3>👑 Leader Authority</h3>
                        <div class="metric">
                            <span>Final Decision Power</span>
                            <span class="metric-value">100%</span>
                        </div>
                        <div class="metric">
                            <span>Policy Overrides</span>
                            <span class="metric-value">5</span>
                        </div>
                        <ul style="list-style: none; padding: 0; margin-top: 0.5rem;">
                            <li>• Ultimate monetary policy authority</li>
                            <li>• Can override CB recommendations</li>
                            <li>• Political consideration integration</li>
                            <li>• Democratic accountability</li>
                        </ul>
                    </div>
                    <div>
                        <h3>🤝 Collaboration Model</h3>
                        <div class="metric">
                            <span>Consultation Meetings</span>
                            <span class="metric-value">12</span>
                        </div>
                        <div class="metric">
                            <span>Joint Decisions</span>
                            <span class="metric-value">18</span>
                        </div>
                        <ul style="list-style: none; padding: 0; margin-top: 0.5rem;">
                            <li>• Regular policy consultations</li>
                            <li>• Transparent decision processes</li>
                            <li>• Respectful disagreement allowed</li>
                            <li>• Shared economic objectives</li>
                        </ul>
                    </div>
                </div>
                
                <div class="action-buttons" style="margin-top: 1.5rem;">
                    <button class="btn" onclick="scheduleConsultation()">Schedule Consultation</button>
                    <button class="btn btn-secondary" onclick="viewInteractionHistory()">Interaction History</button>
                    <button class="btn btn-success" onclick="updateIndependenceMetrics()">Update Independence Metrics</button>
                </div>
            </div>
            
            <!-- API Endpoints -->
            <div class="panel full-width">
                <h2>🔌 API Endpoints</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                    <div>
                        <h4>Policy Recommendations</h4>
                        <div class="api-endpoint">POST /api/central-bank/recommendations</div>
                        <div class="api-endpoint">GET /api/central-bank/recommendations</div>
                        <div class="api-endpoint">PUT /api/central-bank/recommendations/:id/leader-response</div>
                    </div>
                    <div>
                        <h4>Monetary Policy</h4>
                        <div class="api-endpoint">GET /api/central-bank/monetary-policy/current</div>
                        <div class="api-endpoint">POST /api/central-bank/monetary-policy/update</div>
                        <div class="api-endpoint">GET /api/central-bank/stability/indicators</div>
                    </div>
                    <div>
                        <h4>Crisis & Research</h4>
                        <div class="api-endpoint">GET /api/central-bank/crisis/protocols</div>
                        <div class="api-endpoint">POST /api/central-bank/crisis/activate</div>
                        <div class="api-endpoint">GET /api/central-bank/research/forecasts</div>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            // Demo functions for interactive elements
            function reviewRecommendations() {
                alert('Policy Recommendations Review\\n\\n📋 Current Pending Recommendations:\\n\\n1. Interest Rate Adjustment (Critical)\\n   - Recommend 0.25% increase\\n   - Rationale: Rising inflation pressures\\n   - Confidence: 9/10\\n\\n2. Reserve Requirement Update (High)\\n   - Increase to 12%\\n   - Rationale: Manage excess liquidity\\n   - Confidence: 8/10\\n\\n3. Forward Guidance Revision (Medium)\\n   - Update market communication\\n   - Rationale: Clarity on policy direction\\n   - Confidence: 7/10\\n\\nLeader has final authority on all decisions.');
            }
            
            function createRecommendation() {
                alert('Create New Policy Recommendation\\n\\n📝 Recommendation Types:\\n• Interest Rate Changes\\n• Reserve Requirement Adjustments\\n• Inflation Target Modifications\\n• Forward Guidance Updates\\n• Emergency Liquidity Measures\\n• Financial Stability Interventions\\n\\nEach recommendation includes:\\n• Detailed economic analysis\\n• Risk assessment\\n• Alternative options\\n• Implementation timeline\\n• Confidence level');
            }
            
            function runStabilityAssessment() {
                alert('Financial Stability Assessment\\n\\n🔍 Running Comprehensive Assessment:\\n\\n✅ Banking System Health: Excellent\\n   - Capital adequacy: 15.2% (well above minimum)\\n   - Liquidity coverage: 145%\\n   - Non-performing loans: 2.1%\\n\\n✅ Market Stability: Good\\n   - Volatility index: Low\\n   - Credit spreads: Normal\\n   - Asset price trends: Stable\\n\\n✅ Systemic Risk: Minimal\\n   - Interconnectedness: Manageable\\n   - Concentration risk: Low\\n   - External vulnerabilities: Limited\\n\\nOverall Rating: STABLE');
            }
            
            function viewIndicators() {
                alert('Key Financial Stability Indicators\\n\\n📊 Real-time Monitoring:\\n\\n🏦 Banking Sector:\\n• Tier 1 Capital Ratio: 15.2%\\n• Loan-to-Deposit Ratio: 85%\\n• Return on Assets: 1.8%\\n\\n📈 Market Indicators:\\n• VIX Equivalent: 18.5 (Low)\\n• Credit Default Swaps: 95 bps\\n• Currency Volatility: 8.2%\\n\\n🌍 Systemic Measures:\\n• Systemic Risk Index: 0.23 (Low)\\n• Interconnectedness Score: 6.8/10\\n• Stress Test Results: All Pass');
            }
            
            function updatePolicy() {
                alert('Update Monetary Policy Settings\\n\\n⚙️ Current Settings:\\n• Policy Rate: 2.50%\\n• Deposit Rate: 1.50%\\n• Lending Rate: 3.50%\\n• Reserve Requirement: 10.0%\\n• Policy Stance: Neutral\\n\\n📝 Leader Authority:\\nThe leader has final authority to:\\n• Accept Central Bank recommendations\\n• Modify proposed changes\\n• Override CB advice with justification\\n• Set political priorities\\n\\n🤝 Advisory Process:\\nCentral Bank provides expert analysis and recommendations, but leader makes final decisions.');
            }
            
            function policyHistory() {
                alert('Monetary Policy History\\n\\n📅 Recent Policy Changes:\\n\\n2157-01-15: Policy Rate 2.25% → 2.50%\\n   - Leader Decision: Accepted CB recommendation\\n   - Rationale: Preemptive inflation control\\n\\n2156-11-20: Reserve Requirement 9.5% → 10.0%\\n   - Leader Decision: Modified CB recommendation (was 10.5%)\\n   - Rationale: Gradual approach preferred\\n\\n2156-09-10: Forward Guidance Updated\\n   - Leader Decision: Accepted with modifications\\n   - Rationale: Political communication considerations\\n\\nLeader Acceptance Rate: 78%\\nModification Rate: 15%\\nOverride Rate: 7%');
            }
            
            function viewForecasts() {
                alert('Economic Forecasts & Research\\n\\n📈 Central Bank Economic Projections:\\n\\n🎯 GDP Growth:\\n• 2157: +3.2% (±0.5%)\\n• 2158: +2.8% (±0.7%)\\n• 2159: +2.5% (±0.9%)\\n\\n💰 Inflation Forecast:\\n• Current: 2.1%\\n• 6 months: 2.0%\\n• 12 months: 1.9%\\n• Target: 2.0% ±0.5%\\n\\n💼 Employment:\\n• Current: 4.2%\\n• Projected: 4.0%\\n\\n🏦 Financial Conditions:\\n• Credit growth: +5.8%\\n• Asset prices: Stable\\n• Exchange rate: Moderate appreciation');
            }
            
            function createResearch() {
                alert('Create Economic Research\\n\\n📊 Research Types:\\n• Quarterly Economic Outlook\\n• Financial Stability Report\\n• Inflation Analysis\\n• Labor Market Study\\n• International Comparison\\n• Policy Impact Assessment\\n\\n🔬 Research Process:\\n• Independent analysis\\n• Peer review\\n• Publication approval\\n• Public release (if appropriate)\\n• Policy implications\\n\\nResearch supports evidence-based policy recommendations.');
            }
            
            function activateCrisisProtocol() {
                alert('Crisis Protocol Activation\\n\\n🚨 Available Crisis Protocols:\\n\\n1. Banking Crisis Protocol\\n   - Triggers: Bank failures, liquidity crisis\\n   - Response: Emergency lending, coordination\\n   - Authority: CB emergency powers + Leader approval\\n\\n2. Currency Crisis Protocol\\n   - Triggers: Exchange rate volatility, capital flight\\n   - Response: Market intervention, rate changes\\n   - Authority: Joint CB-Leader coordination\\n\\n3. Inflation Crisis Protocol\\n   - Triggers: Inflation >5%, unanchored expectations\\n   - Response: Aggressive tightening\\n   - Authority: CB recommendation + Leader decision\\n\\n⚠️ Crisis activation requires careful coordination between Central Bank expertise and Leader authority.');
            }
            
            function reviewProtocols() {
                alert('Crisis Response Protocols Review\\n\\n📋 Protocol Framework:\\n\\n🎯 Central Bank Role:\\n• Rapid economic assessment\\n• Technical recommendations\\n• Market intervention advice\\n• International coordination\\n\\n👑 Leader Authority:\\n• Final decision on major interventions\\n• Political consideration integration\\n• Public communication approval\\n• Resource allocation decisions\\n\\n🤝 Coordination Requirements:\\n• Treasury: Fiscal response\\n• Communications: Public messaging\\n• State: International cooperation\\n• Defense: Security implications\\n\\nAll protocols respect leader\'s ultimate authority while leveraging CB expertise.');
            }
            
            function scheduleConsultation() {
                alert('Schedule Leader-Central Bank Consultation\\n\\n📅 Consultation Types:\\n\\n🎯 Regular Policy Meetings:\\n• Monthly policy review\\n• Quarterly economic assessment\\n• Annual strategy planning\\n\\n🚨 Emergency Consultations:\\n• Crisis response coordination\\n• Urgent policy decisions\\n• Market intervention discussions\\n\\n📊 Agenda Items:\\n• Economic outlook review\\n• Policy recommendation discussion\\n• Risk assessment\\n• International developments\\n• Market conditions\\n\\nConsultations maintain CB independence while ensuring leader input on policy direction.');
            }
            
            function viewInteractionHistory() {
                alert('Leader-Central Bank Interaction History\\n\\n📋 Recent Interactions:\\n\\n2157-03-15: Policy Rate Consultation\\n   - CB Recommendation: +0.25%\\n   - Leader Decision: Accepted\\n   - Outcome: Rate increased to 2.50%\\n\\n2157-02-28: Financial Stability Review\\n   - CB Assessment: Stable\\n   - Leader Response: Agreed, no action needed\\n   - Outcome: Continued monitoring\\n\\n2157-02-10: Forward Guidance Discussion\\n   - CB Proposal: Hawkish tone\\n   - Leader Modification: Balanced approach\\n   - Outcome: Compromise language adopted\\n\\n📊 Interaction Statistics:\\n• Total consultations: 24\\n• Agreement rate: 78%\\n• Compromise solutions: 15%\\n• Leader overrides: 7%');
            }
            
            function updateIndependenceMetrics() {
                alert('Central Bank Independence Metrics\\n\\n📊 Current Independence Scores:\\n\\n🎯 Analytical Independence: 85/100\\n   - Research autonomy\\n   - Data analysis freedom\\n   - Professional staff\\n\\n💼 Policy Influence: 70/100\\n   - Recommendation acceptance\\n   - Implementation input\\n   - Technical expertise recognition\\n\\n🌍 Public Credibility: 78/100\\n   - Market confidence\\n   - Professional reputation\\n   - Communication effectiveness\\n\\n🤝 International Standing: 82/100\\n   - Peer recognition\\n   - Global cooperation\\n   - Best practice adoption\\n\\n📈 Market Confidence: 7.5/10\\n\\nIndependence balanced with democratic accountability through leader authority.');
            }
            
            // Simulate real-time updates
            setInterval(() => {
                const metrics = document.querySelectorAll('.metric-value');
                metrics.forEach(metric => {
                    if (Math.random() > 0.97) {
                        metric.style.color = '#4CAF50';
                        setTimeout(() => {
                            metric.style.color = '#ffd700';
                        }, 1000);
                    }
                });
            }, 2000);
            
            // Add some dynamic behavior to progress bars
            setInterval(() => {
                const progressBars = document.querySelectorAll('.progress-fill');
                progressBars.forEach(bar => {
                    const currentWidth = parseInt(bar.style.width);
                    if (Math.random() > 0.95) {
                        const change = Math.floor(Math.random() * 4) - 2; // -2 to +2
                        const newWidth = Math.max(70, Math.min(95, currentWidth + change));
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
