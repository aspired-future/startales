import express from 'express';

const router = express.Router();

router.get('/financial-markets', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Financial Markets System - Demo</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 1600px;
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
            grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
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
        .stock-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #2ecc71;
        }
        .stock-card.negative {
            border-left-color: #e74c3c;
        }
        .stock-card h3 {
            margin: 0 0 8px 0;
            color: #3498db;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .bond-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #f39c12;
        }
        .bond-card h3 {
            margin: 0 0 8px 0;
            color: #f39c12;
        }
        .leader-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #9b59b6;
        }
        .leader-card h3 {
            margin: 0 0 8px 0;
            color: #9b59b6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .sector-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #1abc9c;
        }
        .sector-card h3 {
            margin: 0 0 8px 0;
            color: #1abc9c;
        }
        .price-change {
            font-weight: bold;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.9em;
        }
        .price-change.positive { background: #27ae60; color: white; }
        .price-change.negative { background: #e74c3c; color: white; }
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
        }
        .status.open { background: #27ae60; }
        .status.closed { background: #95a5a6; }
        .status.high-availability { background: #2ecc71; }
        .status.medium-availability { background: #f39c12; }
        .status.low-availability { background: #e74c3c; }
        .rating {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 8px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .rating.aaa { background: #2ecc71; }
        .rating.aa { background: #3498db; }
        .rating.a { background: #f39c12; }
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
        .witter-handle {
            color: #1abc9c;
            font-weight: bold;
            text-decoration: none;
        }
        .witter-handle:hover {
            text-decoration: underline;
        }
        .personality-trait {
            display: inline-block;
            background: rgba(155, 89, 182, 0.3);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            margin: 2px;
        }
        .company-advantage {
            display: inline-block;
            background: rgba(52, 152, 219, 0.3);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            margin: 2px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📈 Financial Markets System</h1>
            <p>Stock Markets • Bond Markets • Corporate Leaders • Economic Integration</p>
            <p><strong>Real-time Trading:</strong> Multi-Currency • Government & Corporate Securities • Leader Communications</p>
        </div>

        <div class="dashboard">
            <!-- Stock Market Panel -->
            <div class="panel">
                <h2>📊 Stock Market Overview</h2>
                <div class="stock-card">
                    <h3>QuantumCore Technologies (QCOM) <span class="price-change positive">+2.80%</span></h3>
                    <p><strong>$265.63</strong> • Market Cap: $850.0B • P/E: 35.2</p>
                    <p><strong>Sector:</strong> Technology - Quantum Computing</p>
                    <p><strong>Recent:</strong> Room-temperature quantum computing breakthrough, $50B government contract</p>
                    <div class="company-advantage">Quantum Error Correction</div>
                    <div class="company-advantage">Neural Interface Patents</div>
                    <div class="company-advantage">Military Contracts</div>
                </div>
                <div class="stock-card">
                    <h3>NeuralGen Corporation (NGEN) <span class="price-change positive">+2.10%</span></h3>
                    <p><strong>$257.14</strong> • Market Cap: $720.0B • P/E: 42.8</p>
                    <p><strong>Sector:</strong> Technology - Artificial Intelligence</p>
                    <p><strong>Recent:</strong> First commercially viable AGI assistant launched, AI ethics board established</p>
                    <div class="company-advantage">Advanced AGI Research</div>
                    <div class="company-advantage">Neural Architectures</div>
                </div>
                <div class="stock-card">
                    <h3>LifeExtend Biotech (LIFE) <span class="price-change positive">+2.44%</span></h3>
                    <p><strong>$309.52</strong> • Market Cap: $650.0B • P/E: 28.9</p>
                    <p><strong>Sector:</strong> Healthcare - Biotechnology</p>
                    <p><strong>Recent:</strong> FDA approved first anti-aging treatment, new regenerative medicine facility</p>
                    <div class="company-advantage">Gene Editing Technology</div>
                    <div class="company-advantage">Organ Printing</div>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewAllStocks()">View All Stocks</button>
                    <button class="btn primary" onclick="executeStockTrade()">Execute Trade</button>
                </div>
            </div>

            <!-- Corporate Leaders Panel -->
            <div class="panel">
                <h2>👔 Corporate Leaders</h2>
                <div class="leader-card">
                    <h3>Dr. Elena Vasquez <span class="status high-availability">High Availability</span></h3>
                    <p><strong>CEO, QuantumCore Technologies</strong> • Age 52 • Influence: 9/10</p>
                    <p><a href="#" class="witter-handle">@ElenaQ_CEO</a></p>
                    <p><strong>Background:</strong> Former CERN quantum physicist, pioneered commercial quantum computing</p>
                    <div class="personality-trait">Visionary</div>
                    <div class="personality-trait">Analytical</div>
                    <div class="personality-trait">Risk-taking</div>
                    <div class="personality-trait">Inspiring</div>
                    <p><strong>Recent Statement:</strong> "The future is quantum - everything else is just classical computing"</p>
                </div>
                <div class="leader-card">
                    <h3>Sarah Kim-Nakamura <span class="status high-availability">High Availability</span></h3>
                    <p><strong>CEO, NeuralGen Corporation</strong> • Age 48 • Influence: 9/10</p>
                    <p><a href="#" class="witter-handle">@SarahAI_Ethics</a></p>
                    <p><strong>Background:</strong> AI ethics pioneer, former DeepMind research head</p>
                    <div class="personality-trait">Ethical</div>
                    <div class="personality-trait">Strategic</div>
                    <div class="personality-trait">Empathetic</div>
                    <div class="personality-trait">Forward-thinking</div>
                    <p><strong>Recent Statement:</strong> "AI should amplify human potential, not replace human judgment"</p>
                </div>
                <div class="leader-card">
                    <h3>Dr. James Morrison <span class="status medium-availability">Medium Availability</span></h3>
                    <p><strong>CEO, LifeExtend Biotech</strong> • Age 58 • Influence: 8/10</p>
                    <p><a href="#" class="witter-handle">@DrMorrison_Life</a></p>
                    <p><strong>Background:</strong> Renowned geneticist, developed first anti-aging gene therapy</p>
                    <div class="personality-trait">Determined</div>
                    <div class="personality-trait">Compassionate</div>
                    <div class="personality-trait">Scientific</div>
                    <div class="personality-trait">Patient</div>
                    <p><strong>Recent Statement:</strong> "Death is not inevitable - it is a problem to be solved"</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewAllLeaders()">View All Leaders</button>
                    <button class="btn primary" onclick="contactLeader()">Contact Leader</button>
                    <button class="btn success" onclick="viewWitterFeed()">View Witter Posts</button>
                </div>
            </div>

            <!-- Bond Market Panel -->
            <div class="panel">
                <h2>🏛️ Bond Market</h2>
                <div class="bond-card">
                    <h3>Terran Republic 10-Year Bond (TER10Y)</h3>
                    <p><strong>Price:</strong> $98.50 • <strong>Yield:</strong> 3.75% • <span class="rating aaa">AAA</span></p>
                    <p><strong>Outstanding:</strong> $485.0B • <strong>Maturity:</strong> 2034-01-15</p>
                    <p><strong>Currency:</strong> TER • <strong>Coupon:</strong> 3.50%</p>
                </div>
                <div class="bond-card">
                    <h3>Alpha Centauri 10-Year Bond (ALC10Y)</h3>
                    <p><strong>Price:</strong> $96.25 • <strong>Yield:</strong> 4.55% • <span class="rating aa">AA+</span></p>
                    <p><strong>Outstanding:</strong> $340.0B • <strong>Maturity:</strong> 2034-02-01</p>
                    <p><strong>Currency:</strong> ALC • <strong>Coupon:</strong> 4.20%</p>
                </div>
                <div class="bond-card">
                    <h3>QuantumCore 5-Year Corporate Bond</h3>
                    <p><strong>Price:</strong> $97.50 • <strong>Yield:</strong> 4.85% • <span class="rating a">A+</span></p>
                    <p><strong>Outstanding:</strong> $24.5B • <strong>Maturity:</strong> 2029-06-01</p>
                    <p><strong>Currency:</strong> TER • <strong>Coupon:</strong> 4.50%</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewYieldCurve()">View Yield Curve</button>
                    <button class="btn primary" onclick="executeBondTrade()">Execute Bond Trade</button>
                </div>
            </div>

            <!-- Market Sentiment Panel -->
            <div class="panel">
                <h2>🎭 Market Sentiment</h2>
                <div class="metrics">
                    <div class="metric">
                        <div class="metric-value">62.5</div>
                        <div class="metric-label">Fear & Greed Index</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">+0.25</div>
                        <div class="metric-label">Overall Sentiment</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">18.5%</div>
                        <div class="metric-label">Volatility Index</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">35%</div>
                        <div class="metric-label">Economic Confidence</div>
                    </div>
                </div>
                <div class="stock-card">
                    <h3>Sentiment Drivers</h3>
                    <p>GDP Growth Impact: +30% (strong economic expansion)</p>
                    <p>Inflation Impact: -10% (moderate inflation concerns)</p>
                    <p>Interest Rate Impact: -5% (neutral monetary policy)</p>
                    <p>Fiscal Policy Impact: +15% (infrastructure spending optimism)</p>
                    <p>Political Stability: +5% (stable government)</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="analyzeSentiment()">Analyze Sentiment</button>
                    <button class="btn warning" onclick="updateSentiment()">Update Sentiment</button>
                </div>
            </div>

            <!-- Sector Performance Panel -->
            <div class="panel">
                <h2>🏭 Sector Performance</h2>
                <div class="sector-card">
                    <h3>Technology Sector</h3>
                    <p><strong>Market Cap:</strong> $1.57T • <strong>Companies:</strong> 2</p>
                    <p><strong>Avg Daily Change:</strong> +2.45% • <strong>Avg P/E:</strong> 39.0</p>
                    <p><strong>Key Players:</strong> QuantumCore, NeuralGen</p>
                </div>
                <div class="sector-card">
                    <h3>Healthcare Sector</h3>
                    <p><strong>Market Cap:</strong> $650.0B • <strong>Companies:</strong> 1</p>
                    <p><strong>Avg Daily Change:</strong> +2.44% • <strong>Avg P/E:</strong> 28.9</p>
                    <p><strong>Key Players:</strong> LifeExtend Biotech</p>
                </div>
                <div class="sector-card">
                    <h3>Energy Sector</h3>
                    <p><strong>Market Cap:</strong> $580.0B • <strong>Companies:</strong> 1</p>
                    <p><strong>Avg Daily Change:</strong> +2.06% • <strong>Avg P/E:</strong> 19.8</p>
                    <p><strong>Key Players:</strong> Fusion Dynamics Corp</p>
                </div>
                <div class="sector-card">
                    <h3>Transportation Sector</h3>
                    <p><strong>Market Cap:</strong> $680.0B • <strong>Companies:</strong> 1</p>
                    <p><strong>Avg Daily Change:</strong> +2.48% • <strong>Avg P/E:</strong> 24.8</p>
                    <p><strong>Key Players:</strong> WarpDrive Logistics</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewSectorAnalysis()">Sector Analysis</button>
                    <button class="btn" onclick="compareSectors()">Compare Sectors</button>
                </div>
            </div>

            <!-- Portfolio Management Panel -->
            <div class="panel">
                <h2>💼 Government Portfolio</h2>
                <div class="stock-card">
                    <h3>Portfolio Performance</h3>
                    <p><strong>Total Value:</strong> $25.4B • <strong>Total Cost:</strong> $24.1B</p>
                    <p><strong>Unrealized Gain:</strong> +$1.3B (+5.4%)</p>
                    <p><strong>Holdings:</strong> 8 securities across 3 asset classes</p>
                </div>
                <div class="bond-card">
                    <h3>Top Holdings</h3>
                    <p>1. Alpha Centauri 10Y Bonds: $14.4B (56.7%)</p>
                    <p>2. QuantumCore Technologies Stock: $9.0B (35.4%)</p>
                    <p>3. QuantumCore Corporate Bonds: $2.0B (7.9%)</p>
                </div>
                <div class="metrics">
                    <div class="metric">
                        <div class="metric-value">5.4%</div>
                        <div class="metric-label">Total Return</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">65%</div>
                        <div class="metric-label">Bonds Allocation</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">35%</div>
                        <div class="metric-label">Stocks Allocation</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">8</div>
                        <div class="metric-label">Holdings Count</div>
                    </div>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewPortfolio()">View Full Portfolio</button>
                    <button class="btn warning" onclick="rebalancePortfolio()">Rebalance Portfolio</button>
                </div>
            </div>

            <!-- Market Indices Panel -->
            <div class="panel">
                <h2>📈 Market Indices</h2>
                <div class="stock-card">
                    <h3>Terran Composite Index (TCI)</h3>
                    <p><strong>1,245.67</strong> <span class="price-change positive">+0.85%</span></p>
                    <p><strong>Components:</strong> 50 companies • <strong>Market Cap Weighted</strong></p>
                </div>
                <div class="stock-card">
                    <h3>Terran Technology Index (TTI)</h3>
                    <p><strong>1,456.23</strong> <span class="price-change positive">+1.25%</span></p>
                    <p><strong>Components:</strong> 15 tech companies • <strong>Sector Focus</strong></p>
                </div>
                <div class="stock-card">
                    <h3>Alpha Centauri Index (ACI)</h3>
                    <p><strong>1,189.34</strong> <span class="price-change positive">+0.45%</span></p>
                    <p><strong>Components:</strong> 35 companies • <strong>Multi-Sector</strong></p>
                </div>
                <div class="stock-card">
                    <h3>Vega Prime Index (VPI)</h3>
                    <p><strong>1,298.78</strong> <span class="price-change positive">+1.12%</span></p>
                    <p><strong>Components:</strong> 40 companies • <strong>Industrial Focus</strong></p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewAllIndices()">View All Indices</button>
                    <button class="btn" onclick="updateIndices()">Update Indices</button>
                </div>
            </div>
        </div>

        <!-- API Demo Section -->
        <div class="panel">
            <h3>🔧 API Endpoints Demo</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px;">
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    GET /api/financial-markets/overview/:civilization
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    GET /api/financial-markets/stocks/companies
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    GET /api/financial-markets/leaders
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    GET /api/financial-markets/companies/:id/profile
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    POST /api/financial-markets/stocks/trade
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em;">
                    GET /api/financial-markets/leaders/available/:civ
                </div>
            </div>
            <div class="controls">
                <button class="btn" onclick="testAPI()">Test API Endpoints</button>
                <button class="btn" onclick="viewAPIDoc()">View API Documentation</button>
            </div>
        </div>
    </div>

    <script>
        function viewAllStocks() {
            alert('📊 Complete Stock Market Overview\\n\\nTerran Stock Exchange (TSE):\\n\\n🚀 Technology Sector:\\n• QuantumCore Technologies (QCOM): $265.63 (+2.80%)\\n  - Quantum computing breakthrough, $50B government contract\\n  - CEO: Dr. Elena Vasquez (@ElenaQ_CEO)\\n\\n• NeuralGen Corporation (NGEN): $257.14 (+2.10%)\\n  - First commercial AGI assistant launched\\n  - CEO: Sarah Kim-Nakamura (@SarahAI_Ethics)\\n\\n• DigitalVerse Platforms (DIGI): $250.00 (+1.92%)\\n  - Revolutionary haptic feedback system launched\\n  - CEO: Alex Rivera-Chen (@AlexRivera_Digital)\\n\\n• TechLicense Global (TLIC): $266.67 (+2.00%)\\n  - Largest tech licensing deal in history\\n  - CEO: Dr. Patricia Okafor (@DrOkafor_Patents)\\n\\n• Research & Development Nexus (RDEV): $253.33 (+1.78%)\\n  - New quantum research facility opened\\n  - CEO: Dr. Raj Patel (@DrPatel_RnD)\\n\\n🧬 Healthcare Sector:\\n• LifeExtend Biotech (LIFE): $309.52 (+2.44%)\\n  - FDA approved anti-aging treatment\\n  - CEO: Dr. James Morrison (@DrMorrison_Life)\\n\\n⚡ Energy Sector:\\n• Fusion Dynamics Corp (FUSE): $241.67 (+2.06%)\\n  - Largest fusion plant completed\\n  - CEO: Admiral Rebecca Torres (@AdmiralTorres_Fusion)\\n\\n(This would call GET /api/financial-markets/stocks/companies)');
        }

        function executeStockTrade() {
            alert('💰 Execute Stock Trade\\n\\nStock Trading Interface:\\n\\n📈 Available Actions:\\n• Buy QuantumCore (QCOM) at $265.63\\n• Sell NeuralGen (NGEN) at $257.14\\n• Buy LifeExtend (LIFE) at $309.52\\n\\n💡 Trade Impact Analysis:\\n• Large orders affect stock price\\n• Commission: 0.1% of trade value\\n• Settlement: T+2 days\\n• Portfolio rebalancing recommended\\n\\nExample Trade:\\nBuy 1M shares QCOM at $265.63\\nTotal Value: $265.63M\\nCommission: $265,630\\nPrice Impact: +0.15% (large order)\\n\\n(This would call POST /api/financial-markets/stocks/trade)');
        }

        function viewAllLeaders() {
            alert('👔 Corporate Leaders Directory\\n\\nTechnology Sector Leaders:\\n\\n🧠 Dr. Elena Vasquez - CEO, QuantumCore\\n• Age 52, Influence 9/10, High Availability\\n• Background: Former CERN physicist\\n• Personality: Visionary, Analytical, Risk-taking\\n• Contact: @ElenaQ_CEO\\n\\n🤖 Sarah Kim-Nakamura - CEO, NeuralGen\\n• Age 48, Influence 9/10, High Availability\\n• Background: AI ethics pioneer, ex-DeepMind\\n• Personality: Ethical, Strategic, Empathetic\\n• Contact: @SarahAI_Ethics\\n\\n🎮 Alex Rivera-Chen - CEO, DigitalVerse\\n• Age 39, Influence 8/10, High Availability\\n• Background: Digital native, metaverse architect\\n• Personality: Creative, Tech-savvy, User-focused\\n• Contact: @AlexRivera_Digital\\n\\n⚖️ Dr. Patricia Okafor - CEO, TechLicense\\n• Age 51, Influence 9/10, Medium Availability\\n• Background: Patent attorney, IP licensing expert\\n• Personality: Strategic, Detail-oriented, Negotiator\\n• Contact: @DrOkafor_Patents\\n\\n🔬 Dr. Raj Patel - CEO, R&D Nexus\\n• Age 46, Influence 8/10, High Availability\\n• Background: Former Bell Labs director\\n• Personality: Collaborative, Systematic, Curious\\n• Contact: @DrPatel_RnD\\n\\n🧬 Dr. James Morrison - CEO, LifeExtend\\n• Age 58, Influence 8/10, Medium Availability\\n• Background: Renowned geneticist\\n• Personality: Determined, Compassionate, Scientific\\n• Contact: @DrMorrison_Life\\n\\n⚡ Admiral Rebecca Torres - CEO, Fusion Dynamics\\n• Age 55, Influence 7/10, Low Availability\\n• Background: Former Space Force Admiral\\n• Personality: Disciplined, Strategic, Results-oriented\\n\\n(This would call GET /api/financial-markets/leaders)');
        }

        function contactLeader() {
            alert('📞 Contact Corporate Leader\\n\\nAvailable for Direct Contact:\\n\\n🟢 High Availability:\\n• Dr. Elena Vasquez (QuantumCore CEO)\\n  - "Happy to discuss quantum computing applications for government"\\n  - Best time: Weekdays 9-11 AM\\n\\n• Sarah Kim-Nakamura (NeuralGen CEO)\\n  - "Always available for AI policy discussions"\\n  - Best time: Weekdays 2-4 PM\\n\\n• Captain Yuki Tanaka (WarpDrive CEO)\\n  - "Ready to discuss transportation infrastructure needs"\\n  - Best time: Any time, very flexible\\n\\n🟡 Medium Availability:\\n• Dr. James Morrison (LifeExtend CEO)\\n  - "Available for healthcare policy consultations"\\n  - Best time: Weekdays 10-12 PM\\n\\nContact initiated! Leader will respond within 24 hours.\\n\\n(This would call GET /api/financial-markets/leaders/available/1)');
        }

        function viewWitterFeed() {
            alert('🐦 Corporate Leader Witter Activity\\n\\nRecent Posts:\\n\\n@ElenaQ_CEO (Dr. Elena Vasquez):\\n"Excited to announce our quantum computing breakthrough! Room-temperature quantum processors are now a reality. The future of computing starts today. #QuantumRevolution #Innovation"\\n\\n@SarahAI_Ethics (Sarah Kim-Nakamura):\\n"Our new AGI assistant passed all ethical AI benchmarks. Proud to lead the industry in responsible AI development. Humans and AI, better together. #EthicalAI #FutureOfWork"\\n\\n@DrMorrison_Life (Dr. James Morrison):\\n"Clinical trials show 40% improvement in cellular regeneration. We are not just extending life - we are extending healthy, productive life. #Longevity #Biotech"\\n\\n@CaptainYuki_Warp (Captain Yuki Tanaka):\\n"New speed record! 15.7 parsecs in 3.2 hours. The galaxy keeps getting smaller. Next stop: Kepler system direct route! #WarpSpeed #Exploration"\\n\\n(This would integrate with Witter system)');
        }

        function viewYieldCurve() {
            alert('📈 Government Bond Yield Curve\\n\\nTerran Republic Yield Curve:\\n\\n• 1 Year: 2.85%\\n• 2 Year: 3.15%\\n• 5 Year: 2.95%\\n• 10 Year: 3.75%\\n• 30 Year: 4.25%\\n\\nCurve Analysis:\\n• Slightly inverted 2Y-5Y (recession signal)\\n• Normal long-term slope\\n• Credit spread: 15 bps vs risk-free\\n\\nComparative Analysis:\\n• Alpha Centauri: +80 bps premium\\n• Vega Prime: +30 bps premium\\n• Sirius Federation: +50 bps premium\\n• Proxima Alliance: +110 bps premium\\n\\n(This would call GET /api/financial-markets/bonds/yield-curve/1)');
        }

        function executeBondTrade() {
            alert('🏛️ Execute Bond Trade\\n\\nBond Trading Interface:\\n\\n💰 Available Government Bonds:\\n• Terran 10Y (TER10Y): $98.50, 3.75% yield, AAA rated\\n• Alpha Centauri 10Y (ALC10Y): $96.25, 4.55% yield, AA+ rated\\n• Vega Prime 10Y (VEG10Y): $97.80, 4.05% yield, AA rated\\n\\n🏢 Available Corporate Bonds:\\n• QuantumCore 5Y: $97.50, 4.85% yield, A+ rated\\n• Terran Defense 7Y: $96.80, 5.65% yield, A rated\\n\\nExample Trade:\\nBuy $10B face value TER10Y at $98.50\\nTotal Cost: $9.85B\\nCommission: $4.925M\\nYield to Maturity: 3.75%\\nCurrency: TER\\n\\n(This would call POST /api/financial-markets/bonds/trade)');
        }

        function analyzeSentiment() {
            alert('🎭 Market Sentiment Analysis\\n\\nCurrent Market Psychology:\\n\\n😊 Fear & Greed Index: 62.5 (Greed)\\n• Above 60 indicates market optimism\\n• Driven by strong GDP growth and tech breakthroughs\\n\\n📊 Sentiment Breakdown:\\n• Overall Sentiment: +0.25 (Moderately Positive)\\n• Economic Confidence: 35% (Cautiously Optimistic)\\n• Policy Uncertainty: 15% (Low)\\n• Geopolitical Risk: 10% (Minimal)\\n\\n🎯 Key Drivers:\\n• GDP Growth: +30% impact (3.2% growth rate)\\n• Infrastructure Spending: +15% impact\\n• Tech Sector Momentum: +20% impact\\n• Stable Government: +5% impact\\n\\n⚠️ Risk Factors:\\n• Inflation concerns: -10% impact\\n• Interest rate uncertainty: -5% impact\\n\\n(This would call GET /api/financial-markets/sentiment/1)');
        }

        function updateSentiment() {
            alert('🔄 Update Market Sentiment\\n\\nSentiment Update Process:\\n\\n📈 Economic Factors Integration:\\n• GDP Growth Rate: 3.2% → Market positive\\n• Inflation Rate: 2.5% → Moderate concern\\n• Interest Rate: 3.5% → Neutral impact\\n• Unemployment: 4.5% → Positive employment\\n\\n🏛️ Policy Impact Assessment:\\n• Fiscal Balance: -2.5% of GDP → Manageable deficit\\n• Debt-to-GDP: 65% → Sustainable levels\\n• Infrastructure Spending: +$50B → Market optimism\\n\\n📊 Updated Sentiment Metrics:\\n• Fear & Greed Index: 62.5 → 65.2 (increased optimism)\\n• Volatility Index: 18.5% → 16.8% (reduced uncertainty)\\n• Economic Confidence: 35% → 38% (improved outlook)\\n\\nSentiment successfully updated and propagated to all market systems!\\n\\n(This would call POST /api/financial-markets/sentiment/1/update)');
        }

        function viewSectorAnalysis() {
            alert('🏭 Comprehensive Sector Analysis\\n\\nSector Performance Rankings:\\n\\n🥇 Technology Sector:\\n• Market Cap: $2.42T (35.8% of total market)\\n• Average P/E: 36.8 (high growth expectations)\\n• YTD Performance: +26.2%\\n• Key Drivers: Quantum computing, AGI, digital products, IP licensing, R&D platforms\\n• Subsectors: Quantum Computing, AI, Digital Products, Tech Licensing, R&D Ecosystems\\n\\n🥈 Healthcare Sector:\\n• Market Cap: $650.0B (9.6% of total market)\\n• Average P/E: 28.9 (strong fundamentals)\\n• YTD Performance: +22.1%\\n• Key Drivers: Anti-aging treatments, regenerative medicine\\n\\n🥉 Energy Sector:\\n• Market Cap: $580.0B (8.6% of total market)\\n• Average P/E: 19.8 (value opportunity)\\n• YTD Performance: +18.7%\\n• Key Drivers: Fusion energy, Helium-3 mining\\n\\n📊 Sector Rotation Analysis:\\n• Technology dominance continues with diversified growth\\n• Digital products and IP licensing driving new value creation\\n• R&D ecosystem companies benefiting from innovation surge\\n• Healthcare maintaining strong fundamentals\\n\\n(This would call GET /api/financial-markets/analytics/1/sectors)');
        }

        function compareSectors() {
            alert('⚖️ Sector Comparison Analysis\\n\\nCross-Sector Performance Metrics:\\n\\n📈 Growth Metrics:\\n• Technology: 39.0 P/E, 2.45% daily avg, High volatility\\n• Healthcare: 28.9 P/E, 2.44% daily avg, Medium volatility\\n• Energy: 19.8 P/E, 2.06% daily avg, Low volatility\\n• Transportation: 24.8 P/E, 2.48% daily avg, High volatility\\n\\n💰 Value Metrics:\\n• Technology: Expensive but justified by growth\\n• Healthcare: Fair value with strong fundamentals\\n• Energy: Undervalued, dividend opportunity\\n• Transportation: Growth story with expansion potential\\n\\n🎯 Investment Recommendations:\\n• Overweight: Technology, Healthcare\\n• Neutral: Transportation\\n• Underweight: Energy (short-term)\\n\\n🔮 Future Outlook:\\n• Technology: Quantum revolution just beginning\\n• Healthcare: Aging population drives demand\\n• Energy: Fusion adoption accelerating\\n• Transportation: Interstellar expansion continues\\n\\n(This would call GET /api/financial-markets/analytics/1/top-performers)');
        }

        function viewPortfolio() {
            alert('💼 Government Investment Portfolio\\n\\nComplete Portfolio Analysis:\\n\\n📊 Asset Allocation:\\n• Government Bonds: $16.2B (63.8%)\\n• Corporate Stocks: $7.6B (29.9%)\\n• Corporate Bonds: $1.6B (6.3%)\\n\\n🏆 Top Holdings:\\n1. Alpha Centauri 10Y Bonds: $14.4B (+$0.1B unrealized)\\n2. QuantumCore Technologies: $9.0B (+$0.75B unrealized)\\n3. Vega Prime 10Y Bonds: $11.7B (-$0.3B unrealized)\\n4. QuantumCore Corporate Bonds: $2.0B (-$0.05B unrealized)\\n\\n📈 Performance Metrics:\\n• Total Return: +5.4% YTD\\n• Sharpe Ratio: 1.85 (excellent risk-adjusted return)\\n• Maximum Drawdown: -2.1% (low risk)\\n• Correlation to market: 0.65 (diversified)\\n\\n🎯 Rebalancing Recommendations:\\n• Reduce bond allocation by 5%\\n• Increase technology exposure\\n• Add international diversification\\n\\n(This would call GET /api/financial-markets/portfolio/1)');
        }

        function rebalancePortfolio() {
            alert('⚖️ Portfolio Rebalancing Analysis\\n\\nCurrent vs. Target Allocation:\\n\\n📊 Current Allocation:\\n• Bonds: 70.1% (Target: 65%)\\n• Stocks: 29.9% (Target: 35%)\\n\\n🎯 Recommended Trades:\\n• Sell $1.3B government bonds\\n• Buy $800M technology stocks\\n• Buy $500M healthcare stocks\\n\\n💡 Rebalancing Benefits:\\n• Improved risk-return profile\\n• Better sector diversification\\n• Reduced interest rate sensitivity\\n• Increased growth potential\\n\\n📈 Expected Impact:\\n• Portfolio Beta: 0.75 → 0.85\\n• Expected Return: 6.2% → 7.1%\\n• Volatility: 8.5% → 9.2%\\n• Sharpe Ratio: 1.85 → 2.05\\n\\nRebalancing trades executed successfully!\\nNew portfolio allocation matches target weights.\\n\\n(This would call POST /api/financial-markets/portfolio/rebalance)');
        }

        function viewAllIndices() {
            alert('📈 Market Indices Overview\\n\\nMajor Market Indices:\\n\\n🌍 Broad Market Indices:\\n• Terran Composite (TCI): 1,245.67 (+0.85%)\\n• Alpha Centauri Index (ACI): 1,189.34 (+0.45%)\\n• Vega Prime Index (VPI): 1,298.78 (+1.12%)\\n• Sirius Market Index (SMI): 1,167.89 (-0.25%)\\n• Proxima Composite (PCI): 1,134.56 (+0.78%)\\n\\n🏭 Sector Indices:\\n• Terran Technology (TTI): 1,456.23 (+1.25%)\\n• Galactic Healthcare (GHI): 1,387.45 (+2.15%)\\n• Energy Composite (ECI): 1,098.67 (+0.95%)\\n• Transportation Index (TXI): 1,234.89 (+1.85%)\\n\\n📊 Bond Indices:\\n• Terran Bond Index (TBI): 1,032.45 (-0.15%)\\n• Government Bond Index: 1,028.90 (-0.20%)\\n• Corporate Bond Index: 1,045.67 (+0.05%)\\n\\n(This would call GET /api/financial-markets/indices/1)');
        }

        function updateIndices() {
            alert('🔄 Market Indices Update\\n\\nIndex Recalculation Process:\\n\\n📊 Terran Composite Index (TCI):\\n• Previous: 1,245.67\\n• Updated: 1,251.23 (+0.45%)\\n• Components: 50 companies reweighted\\n• Market cap changes incorporated\\n\\n🚀 Technology Index (TTI):\\n• Previous: 1,456.23\\n• Updated: 1,472.89 (+1.14%)\\n• Driven by QuantumCore and NeuralGen gains\\n• Sector momentum continues\\n\\n💡 Index Methodology:\\n• Market capitalization weighted\\n• Real-time price updates\\n• Corporate action adjustments\\n• Sector rebalancing quarterly\\n\\nAll indices updated successfully!\\nNew values reflect current market conditions.\\n\\n(This would call PUT /api/financial-markets/indices/update)');
        }

        function testAPI() {
            alert('🔧 Financial Markets API Testing\\n\\nTesting Financial Markets APIs:\\n\\n✅ GET /api/financial-markets/overview/1 (200 OK)\\n✅ GET /api/financial-markets/stocks/companies (200 OK)\\n✅ GET /api/financial-markets/leaders (200 OK)\\n✅ GET /api/financial-markets/companies/1/profile (200 OK)\\n✅ GET /api/financial-markets/leaders/available/1 (200 OK)\\n✅ GET /api/financial-markets/bonds/government/1 (200 OK)\\n✅ GET /api/financial-markets/sentiment/1 (200 OK)\\n✅ GET /api/financial-markets/portfolio/1 (200 OK)\\n✅ GET /api/financial-markets/analytics/1/sectors (200 OK)\\n\\nCorporate Leader APIs:\\n✅ GET /api/financial-markets/leaders/witter/@ElenaQ_CEO (200 OK)\\n✅ POST /api/financial-markets/leaders/1/statement (200 OK)\\n\\nAll endpoints responding correctly!');
        }

        function viewAPIDoc() {
            alert('📚 Financial Markets API Documentation\\n\\nCore Endpoints:\\n• Stock Market Operations & Trading\\n• Bond Market & Government Securities\\n• Corporate Leader Management & Communication\\n• Market Sentiment & Economic Integration\\n• Portfolio Management & Performance\\n• Sector Analysis & Company Profiles\\n\\nFeatures:\\n• Real-time market data and sentiment\\n• Corporate leader personalities and availability\\n• Multi-currency bond trading\\n• Economic policy integration\\n• Witter social media integration\\n\\nIntegration: Treasury, Central Bank, Fiscal Policy\\nOutput: Business news, market commentary, leader statements');
        }
    </script>
</body>
</html>
  `);
});

export default router;
