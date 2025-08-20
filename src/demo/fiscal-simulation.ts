import express from 'express';

const router = express.Router();

router.get('/fiscal-simulation', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fiscal Policy Simulation Integration - Demo</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #2c3e50 100%);
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
            border: 1px solid rgba(255,255,255,0.2);
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
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
        .effect-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #3498db;
        }
        .effect-card h3 {
            margin: 0 0 8px 0;
            color: #3498db;
        }
        .modifier-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #e74c3c;
        }
        .modifier-card h3 {
            margin: 0 0 8px 0;
            color: #e74c3c;
        }
        .behavioral-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #f39c12;
        }
        .behavioral-card h3 {
            margin: 0 0 8px 0;
            color: #f39c12;
        }
        .narrative-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #9b59b6;
        }
        .narrative-card h3 {
            margin: 0 0 8px 0;
            color: #9b59b6;
        }
        .progress-bar {
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
            height: 8px;
            margin: 10px 0;
            overflow: hidden;
        }
        .progress-fill {
            background: linear-gradient(90deg, #3498db, #2ecc71);
            height: 100%;
            transition: width 0.3s ease;
        }
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
        }
        .status.active { background: #27ae60; }
        .status.implementing { background: #f39c12; }
        .status.completed { background: #2ecc71; }
        .status.positive { background: #27ae60; }
        .status.negative { background: #e74c3c; }
        .status.neutral { background: #95a5a6; }
        .btn {
            background: linear-gradient(45deg, #3498db, #2980b9);
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
        .btn.primary {
            background: linear-gradient(45deg, #e74c3c, #c0392b);
        }
        .btn.success {
            background: linear-gradient(45deg, #27ae60, #229954);
        }
        .btn.warning {
            background: linear-gradient(45deg, #f39c12, #e67e22);
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
            color: #3498db;
        }
        .metric-label {
            font-size: 0.9em;
            opacity: 0.8;
            margin-top: 5px;
        }
        .impact-indicator {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
            margin-left: 10px;
        }
        .impact-indicator.high { background: #e74c3c; }
        .impact-indicator.medium { background: #f39c12; }
        .impact-indicator.low { background: #27ae60; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ Fiscal Policy Simulation Integration</h1>
            <p>Government Spending Effects • Tax Policy Consequences • Inflation Transmission • Economic Multipliers</p>
            <p><strong>Real-time Impact:</strong> Budget → Simulation → Natural Language</p>
        </div>

        <div class="dashboard">
            <!-- Fiscal Policy Effects Panel -->
            <div class="panel">
                <h2>💰 Active Fiscal Effects</h2>
                <div class="effect-card">
                    <h3>Transportation Infrastructure</h3>
                    <div class="status implementing">Implementing</div>
                    <div class="impact-indicator medium">Medium Impact</div>
                    <p>$25M investment • Economic Growth: +15%</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 60%"></div>
                    </div>
                    <p><strong>Progress:</strong> 60% • <strong>Time to Full Effect:</strong> 18 months</p>
                </div>
                <div class="effect-card">
                    <h3>Defense Equipment Modernization</h3>
                    <div class="status implementing">Implementing</div>
                    <div class="impact-indicator high">High Impact</div>
                    <p>$18M investment • Military Capability: +12%</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 80%"></div>
                    </div>
                    <p><strong>Progress:</strong> 80% • <strong>Time to Full Effect:</strong> 12 months</p>
                </div>
                <div class="effect-card">
                    <h3>Basic Research Funding</h3>
                    <div class="status implementing">Implementing</div>
                    <div class="impact-indicator low">Long-term</div>
                    <p>$8M investment • Knowledge Base: +20%</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 30%"></div>
                    </div>
                    <p><strong>Progress:</strong> 30% • <strong>Time to Full Effect:</strong> 36 months</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewAllEffects()">View All Effects</button>
                    <button class="btn primary" onclick="calculateNewEffect()">Calculate New Effect</button>
                </div>
            </div>

            <!-- Simulation State Modifiers Panel -->
            <div class="panel">
                <h2>🎮 Simulation State</h2>
                <div class="modifier-card">
                    <h3>Infrastructure Quality</h3>
                    <p>Transport: 0.68 (+0.15 fiscal) • Utilities: 0.74 (+0.12 fiscal)</p>
                    <p>Digital: 0.55 (+0.18 fiscal) • Overall: 0.66</p>
                </div>
                <div class="modifier-card">
                    <h3>Military Readiness</h3>
                    <p>Personnel: 0.78 (+0.08 fiscal) • Equipment: 0.72 (+0.14 fiscal)</p>
                    <p>Technology: 0.58 (+0.06 fiscal) • Overall: 0.69</p>
                </div>
                <div class="modifier-card">
                    <h3>Research Capacity</h3>
                    <p>Knowledge: 0.35 (+0.05 fiscal) • Innovation: 0.52 (+0.13 fiscal)</p>
                    <p>Technology Transfer: 0.48 (+0.08 fiscal) • Overall: 0.45</p>
                </div>
                <div class="modifier-card">
                    <h3>Social Development</h3>
                    <p>Education: 0.72 (+0.18 fiscal) • Healthcare: 0.81 (+0.14 fiscal)</p>
                    <p>Social Cohesion: 0.88 (+0.13 fiscal) • Overall: 0.80</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewSimulationState()">View Full State</button>
                    <button class="btn" onclick="updateModifiers()">Update Modifiers</button>
                </div>
            </div>

            <!-- Tax Behavioral Effects Panel -->
            <div class="panel">
                <h2>📊 Tax Behavioral Effects</h2>
                <div class="behavioral-card">
                    <h3>Income Tax (25%)</h3>
                    <div class="status negative">Work Disincentive</div>
                    <p>Effect Magnitude: -8% • Laffer Position: 45%</p>
                    <p><strong>Deadweight Loss:</strong> 2% • <strong>Revenue Efficiency:</strong> Good</p>
                </div>
                <div class="behavioral-card">
                    <h3>Corporate Tax (20%)</h3>
                    <div class="status negative">Investment Disincentive</div>
                    <p>Effect Magnitude: -12% • Laffer Position: 40%</p>
                    <p><strong>Deadweight Loss:</strong> 3% • <strong>Revenue Efficiency:</strong> Fair</p>
                </div>
                <div class="behavioral-card">
                    <h3>Sales Tax (8%)</h3>
                    <div class="status neutral">Consumption Shift</div>
                    <p>Effect Magnitude: -5% • Laffer Position: 25%</p>
                    <p><strong>Deadweight Loss:</strong> 1% • <strong>Revenue Efficiency:</strong> Excellent</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="analyzeTaxEffects()">Analyze Tax Effects</button>
                    <button class="btn warning" onclick="optimizeTaxRates()">Optimize Tax Rates</button>
                </div>
            </div>

            <!-- Inflation Impact Panel -->
            <div class="panel">
                <h2>📈 Inflation Impact Tracking</h2>
                <div class="metrics">
                    <div class="metric">
                        <div class="metric-value">2.5%</div>
                        <div class="metric-label">Current Inflation</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">97.5</div>
                        <div class="metric-label">Purchasing Power</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">102.0</div>
                        <div class="metric-label">Competitiveness</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">-1.0%</div>
                        <div class="metric-label">Real Wage Effect</div>
                    </div>
                </div>
                <div class="effect-card">
                    <h3>Inflation Transmission Effects</h3>
                    <p>Investment Effect: +0.5% (moderate inflation encourages investment)</p>
                    <p>Social Stability: -2% (cost of living concerns)</p>
                    <p>Export Competitiveness: +2% (currency depreciation)</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="trackInflation()">Track Inflation</button>
                    <button class="btn primary" onclick="analyzeInflationImpact()">Analyze Impact</button>
                </div>
            </div>

            <!-- Narrative Generation Panel -->
            <div class="panel">
                <h2>📰 Narrative Generation Inputs</h2>
                <div class="narrative-card">
                    <h3>Major Highway Project Completed</h3>
                    <div class="status positive">Positive Impact</div>
                    <p>Transportation infrastructure investment has reduced transport costs by 15%</p>
                    <p><strong>Emotional Valence:</strong> +0.7 • <strong>Magnitude:</strong> 1.5</p>
                    <p><strong>Citizen Reaction:</strong> Very positive • <strong>Systems Affected:</strong> Trade, Economic Growth</p>
                </div>
                <div class="narrative-card">
                    <h3>Income Tax Increase Effects</h3>
                    <div class="status negative">Mixed Reaction</div>
                    <p>Higher income taxes reduced work incentives but increased social program funding</p>
                    <p><strong>Emotional Valence:</strong> -0.2 • <strong>Magnitude:</strong> 1.1</p>
                    <p><strong>Citizen Reaction:</strong> Mixed • <strong>Systems Affected:</strong> Labor Market, Social Services</p>
                </div>
                <div class="narrative-card">
                    <h3>Healthcare System Expansion</h3>
                    <div class="status positive">Major Achievement</div>
                    <p>Healthcare spending improved population health and reduced medical costs</p>
                    <p><strong>Emotional Valence:</strong> +0.8 • <strong>Magnitude:</strong> 1.3</p>
                    <p><strong>Citizen Reaction:</strong> Very positive • <strong>Systems Affected:</strong> Health, Productivity</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewNarrativeInputs()">View All Inputs</button>
                    <button class="btn success" onclick="generateNarratives()">Generate Narratives</button>
                </div>
            </div>

            <!-- Policy Scenario Analyzer -->
            <div class="panel">
                <h2>🔬 Policy Scenario Analyzer</h2>
                <div class="effect-card">
                    <h3>Current Scenario Analysis</h3>
                    <p><strong>Infrastructure Spending:</strong> $55M → +18% economic growth</p>
                    <p><strong>Defense Spending:</strong> $28M → +12% military readiness</p>
                    <p><strong>Research Spending:</strong> $20M → +15% innovation capacity</p>
                    <p><strong>Social Spending:</strong> $35M → +16% social stability</p>
                </div>
                <div class="behavioral-card">
                    <h3>Tax Policy Analysis</h3>
                    <p><strong>Total Tax Burden:</strong> 31.5% of GDP</p>
                    <p><strong>Revenue Efficiency:</strong> 78% (22% deadweight loss)</p>
                    <p><strong>Laffer Curve Position:</strong> Near optimal for most taxes</p>
                    <p><strong>Behavioral Impact:</strong> Moderate work/investment disincentives</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="analyzeScenario()">Analyze Current Scenario</button>
                    <button class="btn primary" onclick="optimizePolicy()">Optimize Policy Mix</button>
                    <button class="btn warning" onclick="testPolicyChange()">Test Policy Change</button>
                </div>
            </div>
        </div>

        <!-- API Demo Section -->
        <div class="panel">
            <h3>🔧 API Endpoints Demo</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    GET /api/fiscal-simulation/effects/:civilization
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    POST /api/fiscal-simulation/effects/calculate
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    GET /api/fiscal-simulation/state/:civilization
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    POST /api/fiscal-simulation/behavioral/calculate
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    GET /api/fiscal-simulation/inflation/:civilization
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    GET /api/fiscal-simulation/narrative/:civilization
                </div>
            </div>
            <div class="controls">
                <button class="btn" onclick="testAPI()">Test API Endpoints</button>
                <button class="btn" onclick="viewAPIDoc()">View API Documentation</button>
            </div>
        </div>
    </div>

    <script>
        function viewAllEffects() {
            alert('💰 Fiscal Policy Effects Overview\\n\\nActive Effects:\\n\\n1. Infrastructure Transport: $25M → +15% economic growth (60% complete)\\n2. Defense Equipment: $18M → +12% military capability (80% complete)\\n3. Basic Research: $8M → +20% knowledge base (30% complete)\\n4. Education System: $15M → +18% human capital (70% complete)\\n5. Digital Infrastructure: $12M → +22% productivity (80% complete)\\n\\nTotal Investment: $78M\\nWeighted Impact Score: 16.2\\n\\n(This would call GET /api/fiscal-simulation/effects/1)');
        }

        function calculateNewEffect() {
            alert('🔬 Calculate Fiscal Policy Effect\\n\\nPolicy Effect Calculator:\\n\\n1. Policy Type (Spending/Taxation/Transfer)\\n2. Policy Category (Infrastructure/Defense/Research/Social)\\n3. Investment Amount\\n4. Economic Conditions Assessment\\n5. Multiplier Application\\n6. Time Profile Analysis\\n\\nExample: $10M infrastructure spending\\n→ Base multiplier: 1.5x\\n→ Economic conditions: 1.1x\\n→ Expected effect: +16.5% over 24 months\\n\\n(This would call POST /api/fiscal-simulation/effects/calculate)');
        }

        function viewSimulationState() {
            alert('🎮 Current Simulation State\\n\\nSimulation Modifiers by Category:\\n\\nInfrastructure:\\n• Transport Quality: 0.68 (Base: 0.50, Fiscal: +0.15, Other: +0.03)\\n• Utilities Reliability: 0.74 (Base: 0.60, Fiscal: +0.12, Other: +0.02)\\n• Digital Connectivity: 0.73 (Base: 0.40, Fiscal: +0.18, Other: +0.15)\\n\\nMilitary:\\n• Readiness Level: 0.78 (Base: 0.70, Fiscal: +0.08, Other: +0.00)\\n• Equipment Quality: 0.86 (Base: 0.60, Fiscal: +0.14, Other: +0.12)\\n\\n(This would call GET /api/fiscal-simulation/state/1)');
        }

        function updateModifiers() {
            alert('⚡ Update Simulation Modifiers\\n\\nUpdating simulation state based on fiscal effects:\\n\\n• Recalculating all active fiscal policy effects\\n• Applying time-based implementation progress\\n• Updating total modifier values\\n• Triggering simulation parameter updates\\n\\nModifiers updated successfully!\\nSimulation state synchronized with fiscal policies.\\n\\n(This would call PUT /api/fiscal-simulation/effects/update-progress)');
        }

        function analyzeTaxEffects() {
            alert('📊 Tax Behavioral Effects Analysis\\n\\nCurrent Tax Analysis:\\n\\nIncome Tax (25%):\\n• Work Incentive: -8% (moderate disincentive)\\n• Laffer Position: 45% (below optimal)\\n• Deadweight Loss: 2%\\n\\nCorporate Tax (20%):\\n• Investment Incentive: -12% (significant disincentive)\\n• Laffer Position: 40% (below optimal)\\n• Deadweight Loss: 3%\\n\\nRecommendation: Consider rate optimization\\n\\n(This would call GET /api/fiscal-simulation/behavioral/1)');
        }

        function optimizeTaxRates() {
            alert('⚖️ Tax Rate Optimization\\n\\nOptimal Tax Rate Analysis:\\n\\nCurrent vs. Optimal Rates:\\n• Income Tax: 25% → 22% (optimal for revenue)\\n• Corporate Tax: 20% → 18% (optimal for growth)\\n• Sales Tax: 8% → 10% (can increase without major distortion)\\n\\nProjected Effects:\\n• Revenue: +5% increase\\n• Economic Growth: +3% increase\\n• Deadweight Loss: -25% reduction\\n\\n(This would call POST /api/fiscal-simulation/behavioral/calculate)');
        }

        function trackInflation() {
            alert('📈 Inflation Impact Tracking\\n\\nCurrent Inflation Analysis:\\n\\nInflation Rate: 2.5%\\nPurchasing Power Index: 97.5 (2.5% erosion)\\nCompetitiveness Index: 102.0 (improved exports)\\n\\nDetailed Effects:\\n• Real Wages: -1.0% (wages lag inflation)\\n• Investment: +0.5% (moderate inflation encourages investment)\\n• Social Stability: -2.0% (cost of living concerns)\\n\\nOverall Assessment: Manageable inflation level\\n\\n(This would call GET /api/fiscal-simulation/inflation/1)');
        }

        function analyzeInflationImpact() {
            alert('🔍 Comprehensive Inflation Impact Analysis\\n\\nInflation Transmission Mechanisms:\\n\\n1. Purchasing Power:\\n   • Consumer spending patterns shifting\\n   • Fixed-income earners most affected\\n   • Savings erosion accelerating\\n\\n2. Competitiveness:\\n   • Export prices becoming more competitive\\n   • Import substitution increasing\\n   • Trade balance improving\\n\\n3. Investment:\\n   • Real returns on fixed investments declining\\n   • Equity investments becoming more attractive\\n\\n(This would call POST /api/fiscal-simulation/inflation/update)');
        }

        function viewNarrativeInputs() {
            alert('📰 Narrative Generation Inputs\\n\\nRecent Policy Narratives:\\n\\n1. "Major Highway Project Completed"\\n   • Impact: Transportation efficiency +15%\\n   • Reaction: Citizens praise improved connectivity\\n   • Weight: 1.2 (high importance)\\n\\n2. "Healthcare System Expansion Shows Results"\\n   • Impact: Population health +18%\\n   • Reaction: Widespread approval for health improvements\\n   • Weight: 1.1 (high importance)\\n\\n3. "Tax Policy Adjustments Take Effect"\\n   • Impact: Work incentives -12%\\n   • Reaction: Mixed response from business community\\n\\n(This would call GET /api/fiscal-simulation/narrative/1)');
        }

        function generateNarratives() {
            alert('✨ Generate Policy Narratives\\n\\nGenerating natural language narratives from fiscal effects:\\n\\n📰 News Headlines Generated:\\n• "Infrastructure Investment Pays Dividends as Transport Costs Drop 15%"\\n• "Defense Modernization Program Enhances National Security Capabilities"\\n• "Education Funding Boost Shows Early Promise in Skills Development"\\n\\n💬 Citizen Commentary:\\n• "Finally seeing real improvements in our roads and transit!"\\n• "Higher taxes are worth it if we get better public services"\\n• "Military spending increase makes me feel safer"\\n\\n(This would call PUT /api/fiscal-simulation/narrative/process)');
        }

        function analyzeScenario() {
            alert('🔬 Fiscal Policy Scenario Analysis\\n\\nCurrent Policy Mix Analysis:\\n\\nSpending Effectiveness:\\n• Infrastructure: 85% efficiency (high multiplier)\\n• Defense: 72% efficiency (moderate multiplier)\\n• Research: 95% efficiency (very high long-term multiplier)\\n• Social: 78% efficiency (good social stability impact)\\n\\nTax Efficiency:\\n• Revenue collection: 94% of theoretical maximum\\n• Economic distortion: Moderate level\\n• Distributional impact: Progressive overall\\n\\nOverall Assessment: Well-balanced fiscal policy\\n\\n(This would call GET /api/fiscal-simulation/analytics/1/impact-summary)');
        }

        function optimizePolicy() {
            alert('⚖️ Fiscal Policy Optimization\\n\\nOptimized Policy Recommendations:\\n\\nSpending Reallocation:\\n• Increase research spending by $5M (highest multiplier)\\n• Reduce defense spending by $3M (approaching diminishing returns)\\n• Maintain infrastructure spending (good efficiency)\\n• Increase social spending by $2M (stability benefits)\\n\\nTax Optimization:\\n• Reduce income tax to 22% (closer to Laffer optimum)\\n• Reduce corporate tax to 18% (boost investment)\\n• Increase sales tax to 10% (low distortion)\\n\\nProjected Net Effect: +8% overall economic performance\\n\\n(This would call POST /api/fiscal-simulation/scenario/analyze)');
        }

        function testPolicyChange() {
            alert('🧪 Test Policy Change Impact\\n\\nPolicy Change Simulation:\\n\\nProposed Change: +$10M Education Spending\\n\\nCalculated Effects:\\n• Human Capital: +12% over 24 months\\n• Productivity Growth: +8% long-term\\n• Social Stability: +5% immediate\\n• Economic Growth: +3% multiplier effect\\n\\nImplementation Timeline:\\n• Month 1-6: 20% effect (teacher hiring)\\n• Month 7-12: 60% effect (curriculum improvements)\\n• Month 13-24: 100% effect (full system enhancement)\\n\\nRecommendation: Proceed with implementation\\n\\n(This would call POST /api/fiscal-simulation/effects/calculate)');
        }

        function testAPI() {
            alert('🔧 Fiscal Simulation API Testing\\n\\nTesting Fiscal Policy Integration APIs:\\n\\n✅ GET /api/fiscal-simulation/effects/1 (200 OK)\\n✅ POST /api/fiscal-simulation/effects/calculate (200 OK)\\n✅ GET /api/fiscal-simulation/state/1 (200 OK)\\n✅ POST /api/fiscal-simulation/behavioral/calculate (200 OK)\\n✅ GET /api/fiscal-simulation/inflation/1 (200 OK)\\n✅ GET /api/fiscal-simulation/narrative/1 (200 OK)\\n✅ GET /api/fiscal-simulation/analytics/1/* (200 OK)\\n\\nAll endpoints responding correctly!');
        }

        function viewAPIDoc() {
            alert('📚 Fiscal Simulation API Documentation\\n\\nCore Endpoints:\\n• Fiscal Policy Effects Management\\n• Simulation State Monitoring\\n• Tax Behavioral Analysis\\n• Inflation Impact Tracking\\n• Narrative Generation Integration\\n• Policy Scenario Analysis\\n\\nFeatures: Real-time multipliers, behavioral modeling\\nIntegration: Treasury, Central Bank, Economic Simulation\\nOutput: Natural language narrative generation');
        }
    </script>
</body>
</html>
  `);
});

export default router;
