import express from 'express';

const router = express.Router();

router.get('/economic-ecosystem', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic Economic Ecosystem - Demo</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 1800px;
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
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
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
        .market-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #3498db;
        }
        .market-card h3 {
            margin: 0 0 8px 0;
            color: #3498db;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .product-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #e74c3c;
        }
        .product-card h3 {
            margin: 0 0 8px 0;
            color: #e74c3c;
        }
        .corporation-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #f39c12;
        }
        .corporation-card h3 {
            margin: 0 0 8px 0;
            color: #f39c12;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .supply-chain-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #2ecc71;
        }
        .supply-chain-card h3 {
            margin: 0 0 8px 0;
            color: #2ecc71;
        }
        .trade-policy-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #9b59b6;
        }
        .trade-policy-card h3 {
            margin: 0 0 8px 0;
            color: #9b59b6;
        }
        .skill-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #1abc9c;
        }
        .skill-card h3 {
            margin: 0 0 8px 0;
            color: #1abc9c;
        }
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
        }
        .status.high { background: #27ae60; }
        .status.medium { background: #f39c12; }
        .status.low { background: #e74c3c; }
        .status.critical { background: #8e44ad; }
        .status.strategic { background: #c0392b; }
        .tier {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 8px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .tier.advanced { background: #2ecc71; }
        .tier.industrial { background: #3498db; }
        .tier.developing { background: #f39c12; }
        .tier.post_scarcity { background: #9b59b6; }
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
        .btn.primary { background: linear-gradient(45deg, #e74c3c, #c0392b); }
        .btn.success { background: linear-gradient(45deg, #27ae60, #229954); }
        .btn.warning { background: linear-gradient(45deg, #f39c12, #e67e22); }
        .btn.generate { background: linear-gradient(45deg, #9b59b6, #8e44ad); }
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
        .advantage-tag {
            display: inline-block;
            background: rgba(52, 152, 219, 0.3);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            margin: 2px;
        }
        .material-tag {
            display: inline-block;
            background: rgba(46, 204, 113, 0.3);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            margin: 2px;
        }
        .equilibrium-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-left: 10px;
        }
        .equilibrium-indicator.balanced { background: #27ae60; }
        .equilibrium-indicator.shortage { background: #e74c3c; }
        .equilibrium-indicator.surplus { background: #f39c12; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏭 Dynamic Economic Ecosystem</h1>
            <p>Supply & Demand Markets • Production Chains • Trade Policies • Procedural Corporations</p>
            <p><strong>Living Economy:</strong> Dynamic Generation • Market Equilibrium • Corporate Evolution • Talent Systems</p>
        </div>

        <div class="dashboard">
            <!-- Dynamic City Markets Panel -->
            <div class="panel">
                <h2>🏙️ Dynamic City Markets</h2>
                <div class="market-card">
                    <h3>🎲 Procedurally Generated Cities</h3>
                    <p><strong>Generation System:</strong> AI-powered city creation with realistic economic profiles</p>
                    <p><strong>Specializations:</strong> Technology, Manufacturing, Financial, Research, Energy, Healthcare</p>
                    <p><strong>Economic Tiers:</strong> Developing → Industrial → Advanced → Post-Scarcity</p>
                    <p><strong>Evolution:</strong> Cities can develop and upgrade their economic tier over time</p>
                </div>
                <div class="market-card">
                    <h3>Sample Generated City: "Quantum Heights" <span class="tier advanced">Advanced</span></h3>
                    <p><strong>Specialization:</strong> Technology • <strong>Population:</strong> 12.5M</p>
                    <p><strong>GDP/Capita:</strong> $165,000 • <strong>Infrastructure:</strong> Level 9/10</p>
                    <p><strong>Key Industries:</strong> Quantum Computing, Neural Interfaces, AI Research</p>
                    <div class="equilibrium-indicator balanced" title="Dynamically balanced market"></div>
                </div>
                <div class="market-card">
                    <h3>Sample Generated City: "Industrial Mesa" <span class="tier industrial">Industrial</span></h3>
                    <p><strong>Specialization:</strong> Manufacturing • <strong>Population:</strong> 8.2M</p>
                    <p><strong>GDP/Capita:</strong> $78,000 • <strong>Infrastructure:</strong> Level 7/10</p>
                    <p><strong>Key Industries:</strong> Robotics, Precision Engineering, Assembly Systems</p>
                    <div class="equilibrium-indicator surplus" title="Production-focused economy"></div>
                </div>
                <div class="controls">
                    <button class="btn generate" onclick="generateAllCities()">Generate All Cities</button>
                    <button class="btn generate" onclick="generateCivilizationCities()">Generate for Civilization</button>
                    <button class="btn" onclick="previewCityGeneration()">Preview City Generation</button>
                    <button class="btn primary" onclick="evolveCityTier()">Evolve City Tier</button>
                </div>
            </div>

            <!-- Product Categories Panel -->
            <div class="panel">
                <h2>📦 Product Categories & Supply</h2>
                <div class="product-card">
                    <h3>Quantum Computers <span class="status critical">Critical</span></h3>
                    <p><strong>Technology Level:</strong> 10/10 • <strong>Track Individually:</strong> Yes</p>
                    <p><strong>Strategic Importance:</strong> Critical • <strong>Current Products:</strong> 2</p>
                    <p><strong>Key Players:</strong> QuantumCore Technologies, Advanced Quantum Systems</p>
                </div>
                <div class="product-card">
                    <h3>Weapons Systems <span class="status critical">Critical</span></h3>
                    <p><strong>Technology Level:</strong> 8/10 • <strong>Track Individually:</strong> Yes</p>
                    <p><strong>Strategic Importance:</strong> Critical • <strong>Current Products:</strong> 3</p>
                    <p><strong>Key Players:</strong> Defense Dynamics Corp, Military Systems Inc</p>
                </div>
                <div class="product-card">
                    <h3>Software <span class="status medium">Medium</span></h3>
                    <p><strong>Technology Level:</strong> 7/10 • <strong>Track Individually:</strong> No</p>
                    <p><strong>Strategic Importance:</strong> Medium • <strong>Current Products:</strong> 15+</p>
                    <p><strong>Key Players:</strong> Neural Software, Quantum Logic Systems</p>
                </div>
                <div class="product-card">
                    <h3>Food Products <span class="status medium">Medium</span></h3>
                    <p><strong>Technology Level:</strong> 3/10 • <strong>Track Individually:</strong> No</p>
                    <p><strong>Strategic Importance:</strong> Medium • <strong>Current Products:</strong> 50+</p>
                    <p><strong>Key Players:</strong> Galactic Agriculture, Synthetic Foods Corp</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewProductCategories()">View All Categories</button>
                    <button class="btn" onclick="analyzeSupplyDemand()">Analyze Supply & Demand</button>
                </div>
            </div>

            <!-- Procedural Corporations Panel -->
            <div class="panel">
                <h2>🏢 Procedurally Generated Corporations</h2>
                <div class="corporation-card">
                    <h3>QuantumTech Solutions <span class="status high">Large Corp</span></h3>
                    <p><strong>Sector:</strong> Technology • <strong>Symbol:</strong> QUTS</p>
                    <p><strong>Market Cap:</strong> $850.0B • <strong>Employees:</strong> 125,000</p>
                    <p><strong>CEO:</strong> Dr. Elena Vasquez • <strong>Founded:</strong> 2387</p>
                    <div class="advantage-tag">Quantum Error Correction</div>
                    <div class="advantage-tag">Neural Interface Patents</div>
                    <div class="advantage-tag">Military Contracts</div>
                </div>
                <div class="corporation-card">
                    <h3>BioLife Therapeutics <span class="status medium">Medium Corp</span></h3>
                    <p><strong>Sector:</strong> Healthcare • <strong>Symbol:</strong> BILT</p>
                    <p><strong>Market Cap:</strong> $420.0B • <strong>Employees:</strong> 75,000</p>
                    <p><strong>CEO:</strong> Dr. Sarah Kim-Nakamura • <strong>Founded:</strong> 2385</p>
                    <div class="advantage-tag">Gene Editing Technology</div>
                    <div class="advantage-tag">Clinical Trial Expertise</div>
                    <div class="advantage-tag">Regulatory Approval</div>
                </div>
                <div class="corporation-card">
                    <h3>WarpDrive Logistics <span class="status high">Large Corp</span></h3>
                    <p><strong>Sector:</strong> Transportation • <strong>Symbol:</strong> WARP</p>
                    <p><strong>Market Cap:</strong> $680.0B • <strong>Employees:</strong> 72,000</p>
                    <p><strong>CEO:</strong> Captain Yuki Tanaka • <strong>Founded:</strong> 2390</p>
                    <div class="advantage-tag">Fastest Warp Technology</div>
                    <div class="advantage-tag">Largest Fleet</div>
                    <div class="advantage-tag">Navigation Systems</div>
                </div>
                <div class="controls">
                    <button class="btn generate" onclick="generateCorporation()">Generate New Corporation</button>
                    <button class="btn generate" onclick="generateEcosystem()">Generate Full Ecosystem</button>
                    <button class="btn" onclick="viewCorporationPreview()">Preview Generation</button>
                </div>
            </div>

            <!-- Supply Chain Management Panel -->
            <div class="panel">
                <h2>🔗 Production & Supply Chains</h2>
                <div class="supply-chain-card">
                    <h3>Quantum Computer Production Chain</h3>
                    <p><strong>Product:</strong> QuantumCore Q-1000 • <strong>Corporation:</strong> QuantumTech Solutions</p>
                    <p><strong>Location:</strong> Neo Silicon Valley • <strong>Output:</strong> 100 units/month</p>
                    <p><strong>Required Materials:</strong></p>
                    <div class="material-tag">Quantum Crystals (5kg)</div>
                    <div class="material-tag">Rare Earth Elements (50kg)</div>
                    <div class="material-tag">Quantum Processors (10 units)</div>
                    <p><strong>Efficiency:</strong> 95% • <strong>Capacity Utilization:</strong> 85%</p>
                </div>
                <div class="supply-chain-card">
                    <h3>Plasma Rifle Production Chain</h3>
                    <p><strong>Product:</strong> Plasma Rifle MK-VII • <strong>Corporation:</strong> Defense Dynamics</p>
                    <p><strong>Location:</strong> Industrial Complex Prime • <strong>Output:</strong> 1,000 units/month</p>
                    <p><strong>Required Materials:</strong></p>
                    <div class="material-tag">Titanium Ore (25kg)</div>
                    <div class="material-tag">Power Cells (2 units)</div>
                    <div class="material-tag">Advanced Sensors (5 units)</div>
                    <p><strong>Efficiency:</strong> 88% • <strong>Capacity Utilization:</strong> 92%</p>
                </div>
                <div class="supply-chain-card">
                    <h3>Fusion Reactor Production Chain</h3>
                    <p><strong>Product:</strong> Compact Fusion Reactor • <strong>Corporation:</strong> Fusion Dynamics</p>
                    <p><strong>Location:</strong> Energy Valley • <strong>Output:</strong> 10 units/month</p>
                    <p><strong>Required Materials:</strong></p>
                    <div class="material-tag">Helium-3 (100kg)</div>
                    <div class="material-tag">Fusion Containment Fields (1 unit)</div>
                    <div class="material-tag">Advanced Sensors (20 units)</div>
                    <p><strong>Efficiency:</strong> 92% • <strong>Capacity Utilization:</strong> 78%</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewSupplyChains()">View All Chains</button>
                    <button class="btn primary" onclick="optimizeProduction()">Optimize Production</button>
                </div>
            </div>

            <!-- Trade Policies Panel -->
            <div class="panel">
                <h2>🛡️ Trade Policies & Tariffs</h2>
                <div class="trade-policy-card">
                    <h3>Terran Republic ↔ Alpha Centauri</h3>
                    <p><strong>Relationship:</strong> Ally • <strong>General Tariff:</strong> 2.5%</p>
                    <p><strong>Diplomatic Modifier:</strong> 0.8x (Friendly)</p>
                    <p><strong>Strategic Products:</strong></p>
                    <p>• Weapons: Export Banned, Import Restricted (15% tariff)</p>
                    <p>• Quantum Computers: License Required, Import Allowed (5% tariff)</p>
                    <p>• Software: Free Trade, Import/Export Allowed (0% tariff)</p>
                </div>
                <div class="trade-policy-card">
                    <h3>Terran Republic ↔ Vega Prime</h3>
                    <p><strong>Relationship:</strong> Competitor • <strong>General Tariff:</strong> 8.5%</p>
                    <p><strong>Diplomatic Modifier:</strong> 1.2x (Tense)</p>
                    <p><strong>Strategic Products:</strong></p>
                    <p>• Weapons: Export Banned, Import Banned</p>
                    <p>• AI Systems: License Required, Import Restricted (25% tariff)</p>
                    <p>• Energy: Import Allowed, Export Restricted (12% tariff)</p>
                </div>
                <div class="trade-policy-card">
                    <h3>Terran Republic ↔ Sirius Federation</h3>
                    <p><strong>Relationship:</strong> Neutral • <strong>General Tariff:</strong> 5.0%</p>
                    <p><strong>Diplomatic Modifier:</strong> 1.0x (Neutral)</p>
                    <p><strong>Strategic Products:</strong></p>
                    <p>• Financial Services: Free Trade (0% tariff)</p>
                    <p>• Transportation: Import/Export Allowed (3% tariff)</p>
                    <p>• Consumer Goods: Import/Export Allowed (5% tariff)</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewTradePolicies()">View All Policies</button>
                    <button class="btn warning" onclick="calculateTariffImpact()">Calculate Tariff Impact</button>
                </div>
            </div>

            <!-- Skills & Talent Panel -->
            <div class="panel">
                <h2>👥 Skills & Talent Ecosystem</h2>
                <div class="skill-card">
                    <h3>Neo Silicon Valley - Quantum Computing</h3>
                    <p><strong>Availability:</strong> Scarce • <strong>Quality Level:</strong> 9.5/10</p>
                    <p><strong>Average Cost:</strong> $250,000/year • <strong>Brain Drain:</strong> -2.5%</p>
                    <p><strong>Development Rate:</strong> +5.2%/year • <strong>Demand:</strong> Very High</p>
                </div>
                <div class="skill-card">
                    <h3>Industrial Complex Prime - Manufacturing</h3>
                    <p><strong>Availability:</strong> Abundant • <strong>Quality Level:</strong> 7.8/10</p>
                    <p><strong>Average Cost:</strong> $85,000/year • <strong>Brain Drain:</strong> +1.2%</p>
                    <p><strong>Development Rate:</strong> +2.8%/year • <strong>Demand:</strong> High</p>
                </div>
                <div class="skill-card">
                    <h3>New Geneva - Financial Services</h3>
                    <p><strong>Availability:</strong> Adequate • <strong>Quality Level:</strong> 8.9/10</p>
                    <p><strong>Average Cost:</strong> $180,000/year • <strong>Brain Drain:</strong> -0.8%</p>
                    <p><strong>Development Rate:</strong> +3.5%/year • <strong>Demand:</strong> Medium</p>
                </div>
                <div class="skill-card">
                    <h3>Research Colony Gamma - R&D</h3>
                    <p><strong>Availability:</strong> Limited • <strong>Quality Level:</strong> 9.8/10</p>
                    <p><strong>Average Cost:</strong> $300,000/year • <strong>Brain Drain:</strong> -4.1%</p>
                    <p><strong>Development Rate:</strong> +8.2%/year • <strong>Demand:</strong> Extreme</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewSkillsAnalysis()">Skills Analysis</button>
                    <button class="btn" onclick="manageTalentMobility()">Manage Talent Mobility</button>
                </div>
            </div>

            <!-- Government Procurement Panel -->
            <div class="panel">
                <h2>⚔️ Government Procurement</h2>
                <div class="market-card">
                    <h3>Defense Contract #2024-001 <span class="status strategic">Strategic</span></h3>
                    <p><strong>Type:</strong> Weapons • <strong>Value:</strong> $25.0B</p>
                    <p><strong>Department:</strong> Defense • <strong>Domestic Preference:</strong> Yes</p>
                    <p><strong>Requirements:</strong> 10,000 Plasma Rifles, 500 Defense Grid Arrays</p>
                    <p><strong>Bidding Deadline:</strong> 2024-03-15 • <strong>Status:</strong> Open</p>
                </div>
                <div class="market-card">
                    <h3>Infrastructure Contract #2024-002 <span class="status high">High Priority</span></h3>
                    <p><strong>Type:</strong> Infrastructure • <strong>Value:</strong> $15.0B</p>
                    <p><strong>Department:</strong> Interior • <strong>Domestic Preference:</strong> Yes</p>
                    <p><strong>Requirements:</strong> 50 Fusion Reactors, Power Grid Upgrade</p>
                    <p><strong>Bidding Deadline:</strong> 2024-04-01 • <strong>Status:</strong> Bidding</p>
                </div>
                <div class="market-card">
                    <h3>Research Contract #2024-003 <span class="status medium">Research</span></h3>
                    <p><strong>Type:</strong> Research • <strong>Value:</strong> $5.0B</p>
                    <p><strong>Department:</strong> Science • <strong>Domestic Preference:</strong> No</p>
                    <p><strong>Requirements:</strong> Quantum AI Development, Neural Interface Research</p>
                    <p><strong>Bidding Deadline:</strong> 2024-05-01 • <strong>Status:</strong> Open</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewGovernmentContracts()">View All Contracts</button>
                    <button class="btn primary" onclick="createContract()">Create New Contract</button>
                </div>
            </div>

            <!-- Industry Statistics Panel -->
            <div class="panel">
                <h2>📈 Industry Statistics & Trade</h2>
                <div class="metrics">
                    <div class="metric">
                        <div class="metric-value">$2.5T</div>
                        <div class="metric-label">Total GDP</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">+$125B</div>
                        <div class="metric-label">Trade Surplus</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">2,847</div>
                        <div class="metric-label">Total Companies</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">15.2M</div>
                        <div class="metric-label">Employment</div>
                    </div>
                </div>
                <div class="supply-chain-card">
                    <h3>Trade Balance by Sector</h3>
                    <p>Technology: +$85.2B (Strong Export Surplus)</p>
                    <p>Healthcare: +$42.1B (Growing Export Market)</p>
                    <p>Energy: -$15.8B (Import Dependent)</p>
                    <p>Materials: -$28.5B (Resource Import Needs)</p>
                    <p>Manufacturing: +$31.7B (Export Competitive)</p>
                    <p>Software: +$67.3B (Dominant Export Sector)</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewIndustryStats()">Detailed Statistics</button>
                    <button class="btn" onclick="analyzeTradeBalance()">Trade Balance Analysis</button>
                </div>
            </div>
        </div>

        <!-- API Demo Section -->
        <div class="panel">
            <h3>🔧 API Endpoints Demo</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 10px;">
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    GET /api/economic-ecosystem/overview/:civilization
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    GET /api/economic-ecosystem/markets/:civilization
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    POST /api/economic-ecosystem/generate-corporation
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    GET /api/economic-ecosystem/production-chains
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    GET /api/economic-ecosystem/trade-policies/:civilization
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    POST /api/economic-ecosystem/generate-ecosystem/:civ
                </div>
            </div>
            <div class="controls">
                <button class="btn" onclick="testAPI()">Test API Endpoints</button>
                <button class="btn" onclick="viewAPIDoc()">View API Documentation</button>
            </div>
        </div>
    </div>

    <script>
        function generateAllCities() {
            alert('🏙️ Generate Complete City Ecosystem\\n\\nDynamic City Generation Process:\\n\\n🎯 Generation Parameters:\\n• All 5 civilizations\\n• 4-8 cities per civilization\\n• Specialized economic profiles\\n• Realistic population distributions\\n\\n🏭 City Specializations:\\n• Technology: Quantum computing, AI research\\n• Manufacturing: Robotics, precision engineering\\n• Financial: Banking, investment services\\n• Research: Universities, innovation centers\\n• Energy: Fusion power, grid management\\n• Healthcare: Biotech, medical devices\\n• Defense: Military bases, weapons systems\\n• Materials: Mining, resource processing\\n• Transportation: Logistics, spaceports\\n\\n📊 Economic Tier Distribution:\\n• Developing: 15% (Frontier settlements)\\n• Industrial: 35% (Production centers)\\n• Advanced: 40% (High-tech hubs)\\n• Post-Scarcity: 10% (Elite cities)\\n\\n⏱️ Estimated Generation Time: 30-60 seconds\\n\\nProceed with complete city ecosystem generation?\\n\\n(This would call POST /api/economic-ecosystem/generate-all-cities)');
        }

        function generateCivilizationCities() {
            alert('🌟 Generate Cities for Specific Civilization\\n\\nCivilization-Specific Generation:\\n\\n🏛️ Terran Republic (Civ 1):\\n• 8 cities with established economy\\n• Mix of technology and financial centers\\n• Higher GDP per capita\\n• Advanced infrastructure\\n\\n🚀 Alpha Centauri (Civ 2):\\n• 6 cities with balanced development\\n• Focus on exploration and research\\n• Moderate economic development\\n• Good infrastructure\\n\\n⭐ Vega Prime (Civ 3):\\n• 7 cities with wealthy economy\\n• 60% advanced tier cities\\n• Highest GDP per capita\\n• Premium infrastructure\\n\\n🏦 Sirius Federation (Civ 4):\\n• 5 cities with financial focus\\n• Commercial and trade specialization\\n• Strong financial services\\n• Excellent connectivity\\n\\n🛡️ Proxima Alliance (Civ 5):\\n• 4 frontier cities\\n• 40% developing tier\\n• Lower GDP but growing\\n• Basic to moderate infrastructure\\n\\n(This would call POST /api/economic-ecosystem/generate-cities/1)');
        }

        function previewCityGeneration() {
            alert('👁️ City Generation Preview\\n\\nPreview Mode (No Database Changes):\\n\\n🎯 Sample Generation - Technology Specialization:\\n\\n🏙️ "Neural Valley"\\n• Civilization: Terran Republic\\n• Specialization: Technology (AI Research)\\n• Economic Tier: Advanced\\n• Population: 9.2M\\n• GDP/Capita: $185,000\\n• Infrastructure: Level 9/10\\n\\n🏢 Key Industries:\\n• Artificial Intelligence Research\\n• Neural Interface Development\\n• Machine Learning Systems\\n• Cognitive Computing\\n• Brain-Computer Interfaces\\n\\n🎯 Economic Profile:\\n• High-skill workforce\\n• Premium salaries\\n• Innovation-focused\\n• Research institutions\\n• Tech company headquarters\\n\\n📊 Generated Metrics:\\n• Population follows log-normal distribution\\n• GDP adjusted for specialization (1.8x multiplier)\\n• Infrastructure bonus for tech cities (+1 level)\\n• Civilization modifier applied (Terran +10%)\\n\\nThis is a preview - no data saved to database.\\n\\n(This would call GET /api/economic-ecosystem/generate-city-preview/1)');
        }

        function evolveCityTier() {
            alert('📈 City Economic Tier Evolution\\n\\nCity Development Process:\\n\\n🏗️ Evolution Path:\\n• Developing → Industrial\\n• Industrial → Advanced\\n• Advanced → Post-Scarcity\\n• Post-Scarcity (Maximum tier)\\n\\n💰 Economic Improvements:\\n• GDP per capita increases significantly\\n• Infrastructure level upgrades\\n• Population growth potential\\n• Industry specialization deepens\\n\\n🎯 Evolution Triggers:\\n• Time-based development\\n• Investment in infrastructure\\n• Education and skill development\\n• Technology advancement\\n• Economic policy success\\n\\n📊 Example Evolution:\\n"Industrial Mesa" (Industrial) → "Advanced Mesa" (Advanced)\\n• GDP/Capita: $78K → $125K (+60%)\\n• Infrastructure: Level 7 → Level 8\\n• New Industries: Advanced robotics, AI integration\\n• Skill Requirements: Higher education, specialization\\n\\n⚡ Evolution Benefits:\\n• Higher tax revenue for government\\n• Better quality of life\\n• Attracts more corporations\\n• Innovation ecosystem development\\n• Competitive advantages\\n\\n(This would call PUT /api/economic-ecosystem/cities/1/evolve)');
        }

        function viewAllMarkets() {
            alert('🌍 Dynamic City Markets Overview\\n\\nProcedurally Generated Cities:\\n\\n🎲 Generation Features:\\n• AI-powered naming system\\n• Realistic economic profiles\\n• Specialization-based industries\\n• Population distribution modeling\\n• GDP calculations with multipliers\\n\\n🏙️ Sample Generated Cities:\\n\\n"Quantum Heights" (Technology, Advanced):\\n• Population: 12.5M, GDP/Capita: $165K\\n• Infrastructure Level: 9/10\\n• Industries: Quantum Computing, Neural Interfaces\\n• Market Status: High-tech innovation hub\\n\\n"Industrial Mesa" (Manufacturing, Industrial):\\n• Population: 8.2M, GDP/Capita: $78K\\n• Infrastructure Level: 7/10\\n• Industries: Robotics, Precision Engineering\\n• Market Status: Production powerhouse\\n\\n"Financial Plaza" (Financial, Advanced):\\n• Population: 6.8M, GDP/Capita: $195K\\n• Infrastructure Level: 9/10\\n• Industries: Banking, Investment Services\\n• Market Status: Economic center\\n\\n🔄 Dynamic Features:\\n• Cities can evolve economic tiers\\n• New cities emerge as civilizations expand\\n• Market conditions adapt to city development\\n• Supply/demand reflects city specializations\\n\\n(This would call GET /api/economic-ecosystem/markets/1)');
        }

        function updateMarketPrices() {
            alert('💰 Market Price Update Process\\n\\nCalculating Market Equilibrium:\\n\\n📊 Supply & Demand Analysis:\\n• Quantum Computers: High demand, limited supply → Price +15%\\n• Weapons Systems: Government contracts → Price +8%\\n• Software: Abundant supply → Price -3%\\n• Food Products: Stable demand → Price +1%\\n\\n⚖️ Equilibrium Calculations:\\n• Price elasticity factors applied\\n• Supply elasticity adjustments\\n• Market efficiency optimization\\n• Shortage/surplus corrections\\n\\n✅ Price Updates Applied:\\n• 247 products updated across 13 markets\\n• Average price change: +2.3%\\n• Market efficiency improved by 8.5%\\n\\n(This would call PUT /api/economic-ecosystem/markets/1/prices)');
        }

        function viewProductCategories() {
            alert('📦 Complete Product Categories\\n\\nStrategic Products (Tracked Individually):\\n\\n🔬 Quantum Computers (Critical, Tech Level 10):\\n• QuantumCore Q-1000: $10M each\\n• Quantum Encryption Module: $2M each\\n\\n⚔️ Weapons Systems (Critical, Tech Level 8):\\n• Plasma Rifle MK-VII: $25K each\\n• Quantum Torpedo: $500K each\\n• Defense Grid Array: $5M each\\n\\n🚀 Spacecraft (High, Tech Level 9):\\n• Interceptor-Class Fighter: $15M each\\n• Cargo Hauler Heavy: $50M each\\n\\nBulk Products (Aggregate Tracking):\\n• Software: 500+ products, $1M-100M range\\n• Food: 1000+ products, $1-1000 range\\n• Consumer Electronics: 300+ products\\n\\n(This would call GET /api/economic-ecosystem/product-categories)');
        }

        function analyzeSupplyDemand() {
            alert('📈 Supply & Demand Analysis\\n\\nMarket Equilibrium Status:\\n\\n🔴 Supply Shortages:\\n• Quantum Computers: 85% demand satisfaction\\n• AI Systems: 72% demand satisfaction\\n• Advanced Sensors: 68% demand satisfaction\\n\\n🟢 Supply Surplus:\\n• Food Products: 125% oversupply\\n• Consumer Electronics: 115% oversupply\\n• Construction Materials: 108% oversupply\\n\\n⚖️ Balanced Markets:\\n• Software: 98% equilibrium\\n• Energy: 102% equilibrium\\n• Transportation: 95% equilibrium\\n\\n💡 Recommendations:\\n• Increase quantum computer production capacity\\n• Reduce food production or find export markets\\n• Optimize supply chain efficiency\\n\\n(This would call GET /api/economic-ecosystem/markets/1/equilibrium/3)');
        }

        function generateCorporation() {
            alert('🎲 Procedural Corporation Generation\\n\\nGenerating New Corporation:\\n\\n🏢 Company Details:\\n• Name: NeuralLogic Industries\\n• Symbol: NLOG\\n• Sector: Technology (AI/Software)\\n• Size: Medium Corporation\\n• Founded: 2392\\n\\n👔 Generated Leadership:\\n• CEO: Dr. Marcus Chen (Age 45)\\n  - Background: Former Google AI researcher\\n  - Personality: Analytical, Strategic, Innovative\\n  - Witter: @MarcusAI_CEO\\n\\n• CTO: Sarah Rodriguez (Age 38)\\n  - Background: Neural interface specialist\\n  - Personality: Technical, Collaborative, Visionary\\n  - Witter: @SarahTech_NLOG\\n\\n💰 Financial Metrics:\\n• Market Cap: $125.5B\\n• Employees: 45,000\\n• Revenue: $28.7B\\n\\nCorporation successfully generated and added to market!\\n\\n(This would call POST /api/economic-ecosystem/generate-corporation)');
        }

        function generateEcosystem() {
            alert('🌟 Generate Complete Economic Ecosystem\\n\\nGenerating Full Ecosystem for Civilization:\\n\\n📊 Generation Parameters:\\n• Target: 3 companies per sector\\n• Sectors: 9 major sectors\\n• Total Companies: ~27 new corporations\\n• Leaders: ~75 new executives\\n\\n🏭 Sector Breakdown:\\n• Technology: 3 companies (AI, Quantum, Software)\\n• Healthcare: 3 companies (Biotech, Medical Devices)\\n• Energy: 3 companies (Fusion, Solar, Grid)\\n• Manufacturing: 3 companies (Robotics, Materials)\\n• Transportation: 3 companies (Space, Logistics)\\n• Financial: 3 companies (Banking, Investment)\\n• Defense: 3 companies (Weapons, Aerospace)\\n• Materials: 3 companies (Mining, Processing)\\n• Software: 3 companies (Enterprise, Consumer)\\n\\n⏱️ Estimated Generation Time: 2-3 minutes\\n\\nProceed with full ecosystem generation?\\n\\n(This would call POST /api/economic-ecosystem/generate-ecosystem/1)');
        }

        function viewCorporationPreview() {
            alert('👁️ Corporation Generation Preview\\n\\nPreview Mode (No Database Changes):\\n\\n🎯 Sample Generation - Energy Sector:\\n\\n🏢 FusionMax Dynamics\\n• Symbol: FMAX\\n• Size Category: Large Corporation\\n• Founded: 2385\\n• Headquarters: Energy Valley, Terra Prime\\n\\n👨‍💼 CEO: Admiral Rebecca Torres\\n• Age: 55, Former Space Force Admiral\\n• Personality: Disciplined, Strategic, Results-oriented\\n• Leadership Style: Military Command\\n• Witter: @AdmiralTorres_Fusion\\n\\n💼 Business Profile:\\n• Specialization: Clean fusion energy systems\\n• Competitive Advantages: Military contracts, Safety protocols\\n• Recent Development: Completed largest fusion plant\\n• Market Cap: $580B, Employees: 45K\\n\\nThis is a preview - no data saved to database.\\n\\n(This would call GET /api/economic-ecosystem/generate-preview/energy)');
        }

        function viewSupplyChains() {
            alert('🔗 Complete Supply Chain Analysis\\n\\nProduction Networks Overview:\\n\\n⚛️ Quantum Computer Chain:\\n• Input: Quantum Crystals (5kg) + Rare Earth (50kg)\\n• Process: 30-day manufacturing cycle\\n• Output: 100 units/month\\n• Efficiency: 95%, Utilization: 85%\\n• Skills Required: Quantum Engineering (50 specialists)\\n\\n⚔️ Weapons Production Chain:\\n• Input: Titanium Ore (25kg) + Power Cells (2 units)\\n• Process: 7-day manufacturing cycle\\n• Output: 1,000 rifles/month\\n• Efficiency: 88%, Utilization: 92%\\n• Skills Required: Precision Manufacturing (200 workers)\\n\\n⚡ Fusion Reactor Chain:\\n• Input: Helium-3 (100kg) + Containment Fields (1 unit)\\n• Process: 90-day manufacturing cycle\\n• Output: 10 reactors/month\\n• Efficiency: 92%, Utilization: 78%\\n• Skills Required: Nuclear Engineering (25 specialists)\\n\\n(This would call GET /api/economic-ecosystem/production-chains)');
        }

        function optimizeProduction() {
            alert('⚙️ Production Optimization Analysis\\n\\nOptimization Recommendations:\\n\\n🎯 Efficiency Improvements:\\n• Quantum Computer Chain: Increase automation → +5% efficiency\\n• Weapons Production: Optimize material flow → +3% efficiency\\n• Fusion Reactor: Reduce bottlenecks → +8% efficiency\\n\\n📈 Capacity Utilization:\\n• Quantum: Increase to 95% utilization (+10 units/month)\\n• Weapons: Maintain current 92% (optimal level)\\n• Fusion: Increase to 85% utilization (+1 reactor/month)\\n\\n💰 Cost Reductions:\\n• Material sourcing optimization: -12% input costs\\n• Skill training programs: -8% labor costs\\n• Process automation: -15% operational costs\\n\\n🎯 Implementation Timeline:\\n• Phase 1: Material optimization (30 days)\\n• Phase 2: Automation upgrades (90 days)\\n• Phase 3: Skill development (180 days)\\n\\n(This would call POST /api/economic-ecosystem/production-chains/optimize)');
        }

        function viewTradePolicies() {
            alert('🛡️ Complete Trade Policy Matrix\\n\\nBilateral Trade Relationships:\\n\\n🤝 Terran Republic ↔ Alpha Centauri (Ally):\\n• General Tariff: 2.5%, Diplomatic Modifier: 0.8x\\n• Weapons: Export Banned, Import Restricted (15%)\\n• Technology: License Required, Import Allowed (5%)\\n• Consumer Goods: Free Trade (0%)\\n\\n⚔️ Terran Republic ↔ Vega Prime (Competitor):\\n• General Tariff: 8.5%, Diplomatic Modifier: 1.2x\\n• Weapons: Mutual Ban\\n• AI Systems: License Required, Restricted (25%)\\n• Energy: Import Allowed, Export Restricted (12%)\\n\\n🤝 Terran Republic ↔ Sirius Federation (Neutral):\\n• General Tariff: 5.0%, Diplomatic Modifier: 1.0x\\n• Financial Services: Free Trade (0%)\\n• Transportation: Standard Trade (3%)\\n• All Others: Standard Tariff (5%)\\n\\n🚫 Terran Republic ↔ Proxima Alliance (Hostile):\\n• General Tariff: 25%, Diplomatic Modifier: 1.5x\\n• Strategic Products: Complete Embargo\\n• Essential Goods Only: Restricted Trade (35%)\\n\\n(This would call GET /api/economic-ecosystem/trade-policies/1)');
        }

        function calculateTariffImpact() {
            alert('💰 Tariff Impact Calculation\\n\\nTrade Impact Analysis:\\n\\n📊 Sample Calculation:\\n• Source: Terran Republic\\n• Target: Vega Prime\\n• Product: AI Systems\\n• Trade Value: $10.0B\\n\\n🧮 Tariff Breakdown:\\n• Base Tariff Rate: 8.5%\\n• Product-Specific Tariff: 25.0%\\n• Combined Rate: 33.5%\\n• Diplomatic Modifier: 1.2x (Tense Relations)\\n• Final Tariff Rate: 40.2%\\n\\n💸 Financial Impact:\\n• Tariff Amount: $4.02B\\n• Effective Price Increase: 40.2%\\n• Trade Volume Impact: -35% (estimated)\\n• Revenue Impact: -$6.5B (net effect)\\n\\n📈 Economic Consequences:\\n• Domestic AI industry protection: +$2.1B\\n• Consumer price increases: +15%\\n• Innovation incentives: Mixed effects\\n\\n(This would call POST /api/economic-ecosystem/tariff-calculation)');
        }

        function viewSkillsAnalysis() {
            alert('👥 Comprehensive Skills Analysis\\n\\nTalent Ecosystem Overview:\\n\\n🎓 High-Demand Skills:\\n• Quantum Computing: Scarce, $250K/year\\n  - Available: 2,500 specialists\\n  - Demand: 8,000 specialists\\n  - Gap: 5,500 (69% shortage)\\n\\n• AI/Machine Learning: Limited, $200K/year\\n  - Available: 15,000 specialists\\n  - Demand: 25,000 specialists\\n  - Gap: 10,000 (40% shortage)\\n\\n• Nuclear Engineering: Scarce, $180K/year\\n  - Available: 1,200 specialists\\n  - Demand: 2,000 specialists\\n  - Gap: 800 (40% shortage)\\n\\n🏭 Abundant Skills:\\n• Manufacturing: Abundant, $85K/year\\n• Logistics: Adequate, $75K/year\\n• Basic Engineering: Adequate, $95K/year\\n\\n🧠 Brain Drain Patterns:\\n• Neo Silicon Valley: -2.5% (losing talent to other systems)\\n• Research Colony Gamma: -4.1% (extreme brain drain)\\n• Industrial Complex: +1.2% (gaining manufacturing talent)\\n\\n(This would call GET /api/economic-ecosystem/skills/1)');
        }

        function manageTalentMobility() {
            alert('🚀 Talent Mobility Management\\n\\nTalent Flow Optimization:\\n\\n📈 Skill Development Programs:\\n• Quantum Computing Bootcamp: 500 new specialists/year\\n• AI Certification Program: 2,000 new specialists/year\\n• Nuclear Engineering Academy: 200 new specialists/year\\n\\n🌍 Inter-City Mobility:\\n• High-speed transport subsidies for skilled workers\\n• Remote work infrastructure for distributed teams\\n• Housing incentives in high-demand locations\\n\\n💰 Retention Strategies:\\n• Competitive salary adjustments: +15% for critical skills\\n• Research grants and innovation bonuses\\n• Career advancement fast-tracks\\n• Quality of life improvements\\n\\n🎯 Immigration Policies:\\n• Skilled worker visa program: 5,000 visas/year\\n• University partnerships for international talent\\n• Corporate sponsorship programs\\n\\n📊 Expected Impact:\\n• Skill shortage reduction: 25% over 3 years\\n• Brain drain mitigation: 40% improvement\\n• Innovation index increase: +12%\\n\\n(This would call PUT /api/economic-ecosystem/skills/1/quantum-computing/manage)');
        }

        function viewGovernmentContracts() {
            alert('⚔️ Government Procurement Overview\\n\\nActive Contracts Portfolio:\\n\\n🛡️ Defense Contracts ($45.0B Total):\\n• Plasma Weapons System: $25.0B (Open Bidding)\\n  - 10,000 Plasma Rifles + 500 Defense Arrays\\n  - Domestic Preference: Required\\n  - Security Clearance: Top Secret\\n\\n• Next-Gen Fighter Program: $20.0B (Awarded)\\n  - 100 Interceptor-Class Fighters\\n  - Contractor: AeroSpace Dynamics\\n  - Delivery: 24 months\\n\\n🏗️ Infrastructure Contracts ($30.0B Total):\\n• Fusion Power Grid: $15.0B (Bidding Phase)\\n  - 50 Fusion Reactors + Grid Integration\\n  - Domestic Preference: Preferred\\n\\n• Quantum Communication Network: $15.0B (Planning)\\n  - Planet-wide quantum internet\\n  - Technology Level: Classified\\n\\n🔬 Research Contracts ($10.0B Total):\\n• Quantum AI Development: $5.0B (Open)\\n• Neural Interface Research: $3.0B (Open)\\n• Advanced Materials: $2.0B (Awarded)\\n\\n(This would call GET /api/economic-ecosystem/government-contracts/1)');
        }

        function createContract() {
            alert('📝 Create Government Contract\\n\\nContract Creation Wizard:\\n\\n📋 Contract Details:\\n• Department: Defense\\n• Type: Weapons System\\n• Value: $35.0B\\n• Title: Advanced Quantum Weapons Program\\n\\n🎯 Requirements:\\n• Product: Quantum Torpedo Systems\\n• Quantity: 1,000 units\\n• Delivery Timeline: 36 months\\n• Quality Standards: Military Grade\\n• Technology Level: Classified (Level 9+)\\n\\n🏛️ Policy Settings:\\n• Domestic Preference: Required\\n• Security Clearance: Top Secret\\n• Small Business Set-Aside: 15%\\n• Innovation Incentives: 10% bonus\\n\\n📅 Timeline:\\n• Bidding Period: 60 days\\n• Evaluation Period: 30 days\\n• Contract Award: 90 days from posting\\n• First Delivery: 12 months after award\\n\\n✅ Contract Created Successfully!\\nContract ID: #2024-004\\nPosted to procurement portal.\\n\\n(This would call POST /api/economic-ecosystem/government-contracts)');
        }

        function viewIndustryStats() {
            alert('📊 Detailed Industry Statistics\\n\\nEconomic Performance by Sector:\\n\\n💻 Technology Sector:\\n• Revenue: $850.0B (+28.5% YoY)\\n• Employment: 2.8M workers\\n• Companies: 347 firms\\n• Exports: $425.0B, Imports: $125.0B\\n• Trade Balance: +$300.0B\\n• Productivity Index: 145.2\\n\\n🏥 Healthcare Sector:\\n• Revenue: $420.0B (+22.1% YoY)\\n• Employment: 1.9M workers\\n• Companies: 156 firms\\n• Exports: $180.0B, Imports: $95.0B\\n• Trade Balance: +$85.0B\\n• Productivity Index: 132.8\\n\\n⚡ Energy Sector:\\n• Revenue: $380.0B (+18.7% YoY)\\n• Employment: 850K workers\\n• Companies: 89 firms\\n• Exports: $95.0B, Imports: $145.0B\\n• Trade Balance: -$50.0B\\n• Productivity Index: 128.5\\n\\n🏭 Manufacturing Sector:\\n• Revenue: $650.0B (+15.2% YoY)\\n• Employment: 3.2M workers\\n• Companies: 892 firms\\n• Exports: $285.0B, Imports: $165.0B\\n• Trade Balance: +$120.0B\\n\\n(This would call GET /api/economic-ecosystem/industry-statistics/1)');
        }

        function analyzeTradeBalance() {
            alert('⚖️ Trade Balance Analysis\\n\\nComprehensive Trade Performance:\\n\\n📈 Overall Trade Position:\\n• Total Exports: $1.25T\\n• Total Imports: $875.0B\\n• Trade Surplus: +$375.0B\\n• Trade-to-GDP Ratio: 85.2%\\n\\n🏆 Export Champions:\\n1. Technology: +$300.0B (Quantum computers, AI systems)\\n2. Software: +$185.0B (Enterprise platforms, games)\\n3. Manufacturing: +$120.0B (Robotics, precision equipment)\\n4. Healthcare: +$85.0B (Medical devices, pharmaceuticals)\\n5. Financial Services: +$65.0B (Banking, investment)\\n\\n📉 Import Dependencies:\\n1. Materials: -$125.0B (Rare earth elements, minerals)\\n2. Energy: -$50.0B (Helium-3, fusion fuel)\\n3. Agriculture: -$35.0B (Exotic foods, luxury items)\\n\\n🎯 Strategic Implications:\\n• Technology dominance provides economic security\\n• Material dependencies create strategic vulnerabilities\\n• Diversification opportunities in emerging sectors\\n• Trade relationships critical for continued growth\\n\\n(This would call GET /api/economic-ecosystem/trade-balance/1)');
        }

        function testAPI() {
            alert('🔧 Economic Ecosystem API Testing\\n\\nTesting Core APIs:\\n\\n✅ GET /api/economic-ecosystem/overview/1 (200 OK)\\n✅ GET /api/economic-ecosystem/markets/1 (200 OK)\\n✅ GET /api/economic-ecosystem/product-categories (200 OK)\\n✅ GET /api/economic-ecosystem/production-chains (200 OK)\\n✅ GET /api/economic-ecosystem/trade-policies/1 (200 OK)\\n✅ GET /api/economic-ecosystem/skills/1 (200 OK)\\n\\nTesting Generation APIs:\\n✅ GET /api/economic-ecosystem/generate-preview/technology (200 OK)\\n✅ POST /api/economic-ecosystem/generate-corporation (200 OK)\\n\\nTesting Analysis APIs:\\n✅ GET /api/economic-ecosystem/markets/1/equilibrium/3 (200 OK)\\n✅ POST /api/economic-ecosystem/tariff-calculation (200 OK)\\n✅ GET /api/economic-ecosystem/industry-statistics/1 (200 OK)\\n✅ GET /api/economic-ecosystem/trade-balance/1 (200 OK)\\n\\nAll endpoints responding correctly!\\nDynamic generation system operational.');
        }

        function viewAPIDoc() {
            alert('📚 Economic Ecosystem API Documentation\\n\\nCore Endpoints:\\n• Market Operations & Supply/Demand Analysis\\n• Procedural Corporation & Leader Generation\\n• Production Chain Management & Optimization\\n• Trade Policy & Tariff Calculations\\n• Skills & Talent Mobility Systems\\n• Government Procurement & Contracts\\n• Industry Statistics & Economic Analysis\\n\\nKey Features:\\n• Real-time market equilibrium calculations\\n• AI-powered corporation and leader generation\\n• Complex supply chain modeling\\n• Multi-civilization trade policy management\\n• Location-based skill availability tracking\\n• Government contract lifecycle management\\n\\nIntegration: Treasury, Financial Markets, Trade Systems\\nOutput: Business ecosystems, market dynamics, economic intelligence');
        }
    </script>
</body>
</html>
  `);
});

export default router;
