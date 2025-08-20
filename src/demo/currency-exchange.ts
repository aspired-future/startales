import express from 'express';

const router = express.Router();

router.get('/currency-exchange', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multi-Currency Exchange System - Demo</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%);
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
        .currency-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #4ECDC4;
        }
        .currency-card h3 {
            margin: 0 0 8px 0;
            color: #4ECDC4;
        }
        .rate-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #FF6B35;
        }
        .rate-card h3 {
            margin: 0 0 8px 0;
            color: #FF6B35;
        }
        .transaction-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #9B59B6;
        }
        .transaction-card h3 {
            margin: 0 0 8px 0;
            color: #9B59B6;
        }
        .union-card {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #F1C40F;
        }
        .union-card h3 {
            margin: 0 0 8px 0;
            color: #F1C40F;
        }
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
        }
        .status.active { background: #4CAF50; }
        .status.floating { background: #2196F3; }
        .status.fixed { background: #FF9800; }
        .status.managed { background: #9C27B0; }
        .status.settled { background: #4CAF50; }
        .status.pending { background: #FF9800; }
        .btn {
            background: linear-gradient(45deg, #4ECDC4, #44A08D);
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
            background: linear-gradient(45deg, #FF6B35, #F7931E);
        }
        .btn.warning {
            background: linear-gradient(45deg, #F39C12, #E67E22);
        }
        .btn.success {
            background: linear-gradient(45deg, #27AE60, #2ECC71);
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
            color: #4ECDC4;
        }
        .metric-label {
            font-size: 0.9em;
            opacity: 0.8;
            margin-top: 5px;
        }
        .converter {
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
            padding: 20px;
            margin-top: 15px;
        }
        .converter input, .converter select {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 5px;
            padding: 10px;
            color: white;
            margin: 5px;
            width: 120px;
        }
        .converter input::placeholder {
            color: rgba(255,255,255,0.6);
        }
        .api-demo {
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
        }
        .api-demo h3 {
            margin: 0 0 15px 0;
            color: #4ECDC4;
        }
        .api-endpoint {
            background: rgba(255,255,255,0.1);
            padding: 10px;
            border-radius: 5px;
            margin: 5px 0;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        .rate-display {
            font-size: 1.2em;
            font-weight: bold;
            color: #FF6B35;
        }
        .change-indicator {
            font-size: 0.9em;
            margin-left: 10px;
        }
        .change-indicator.up { color: #4CAF50; }
        .change-indicator.down { color: #F44336; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💱 Multi-Currency Exchange System</h1>
            <p>Independent Currencies • Exchange Rate Management • Currency Unions • Monetary Sovereignty</p>
            <p><strong>Active Currencies:</strong> GCR, STD, QTC, NEX, ZEN</p>
        </div>

        <div class="dashboard">
            <!-- Currencies Panel -->
            <div class="panel">
                <h2>💰 Active Currencies</h2>
                <div class="currency-card">
                    <h3>Galactic Credits (GCR) ₡</h3>
                    <div class="status active">Reserve Currency</div>
                    <p>Civilization 1 • Base Value: 1.00</p>
                    <p><strong>Policy:</strong> Floating Exchange Rate</p>
                </div>
                <div class="currency-card">
                    <h3>Stellar Dollars (STD) $</h3>
                    <div class="status managed">Managed Float</div>
                    <p>Civilization 2 • Base Value: 0.85</p>
                    <p><strong>Policy:</strong> Intervention Bands ±5%</p>
                </div>
                <div class="currency-card">
                    <h3>Quantum Coins (QTC) Ψ</h3>
                    <div class="status fixed">Fixed Rate</div>
                    <p>Civilization 3 • Base Value: 1.25</p>
                    <p><strong>Policy:</strong> Pegged to GCR</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewAllCurrencies()">View All Currencies</button>
                    <button class="btn primary" onclick="createCurrency()">Create Currency</button>
                </div>
            </div>

            <!-- Exchange Rates Panel -->
            <div class="panel">
                <h2>📈 Live Exchange Rates</h2>
                <div class="rate-card">
                    <h3>GCR/STD</h3>
                    <div class="rate-display">1.1765 <span class="change-indicator up">↗ +0.23%</span></div>
                    <p>Bid: 1.1753 • Ask: 1.1777 • Spread: 0.20%</p>
                    <p><strong>Volume:</strong> 2.4M GCR • <strong>Volatility:</strong> 2.1%</p>
                </div>
                <div class="rate-card">
                    <h3>GCR/QTC</h3>
                    <div class="rate-display">0.8000 <span class="change-indicator down">↘ -0.05%</span></div>
                    <p>Bid: 0.7992 • Ask: 0.8008 • Spread: 0.20%</p>
                    <p><strong>Volume:</strong> 1.8M GCR • <strong>Volatility:</strong> 0.8%</p>
                </div>
                <div class="rate-card">
                    <h3>STD/QTC</h3>
                    <div class="rate-display">0.6800 <span class="change-indicator up">↗ +0.15%</span></div>
                    <p>Bid: 0.6789 • Ask: 0.6811 • Spread: 0.32%</p>
                    <p><strong>Volume:</strong> 890K STD • <strong>Volatility:</strong> 1.5%</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewAllRates()">View All Rates</button>
                    <button class="btn primary" onclick="updateRates()">Update Rates</button>
                </div>
            </div>

            <!-- Currency Converter -->
            <div class="panel">
                <h2>🔄 Currency Converter</h2>
                <div class="converter">
                    <div style="margin-bottom: 15px;">
                        <input type="number" id="fromAmount" placeholder="Amount" value="1000">
                        <select id="fromCurrency">
                            <option value="GCR">GCR - Galactic Credits</option>
                            <option value="STD">STD - Stellar Dollars</option>
                            <option value="QTC">QTC - Quantum Coins</option>
                            <option value="NEX">NEX - Nexus Units</option>
                            <option value="ZEN">ZEN - Zenith Marks</option>
                        </select>
                    </div>
                    <div style="text-align: center; margin: 10px 0;">
                        <button class="btn" onclick="swapCurrencies()">⇅ Swap</button>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <input type="number" id="toAmount" placeholder="Converted Amount" readonly>
                        <select id="toCurrency">
                            <option value="STD">STD - Stellar Dollars</option>
                            <option value="GCR">GCR - Galactic Credits</option>
                            <option value="QTC">QTC - Quantum Coins</option>
                            <option value="NEX">NEX - Nexus Units</option>
                            <option value="ZEN">ZEN - Zenith Marks</option>
                        </select>
                    </div>
                    <div style="text-align: center;">
                        <button class="btn primary" onclick="calculateConversion()">Calculate</button>
                        <button class="btn success" onclick="executeTransaction()">Execute Transaction</button>
                    </div>
                </div>
                <div id="conversionResult" style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; display: none;">
                    <p><strong>Exchange Rate:</strong> <span id="exchangeRate"></span></p>
                    <p><strong>Transaction Fee:</strong> <span id="transactionFee"></span></p>
                    <p><strong>Total Cost:</strong> <span id="totalCost"></span></p>
                </div>
            </div>

            <!-- Currency Transactions -->
            <div class="panel">
                <h2>💸 Recent Transactions</h2>
                <div class="transaction-card">
                    <h3>Trade Settlement</h3>
                    <div class="status settled">Settled</div>
                    <p>1,250,000 GCR → 1,470,625 STD</p>
                    <p><strong>Rate:</strong> 1.1765 • <strong>Fee:</strong> 1,250 GCR</p>
                    <p><strong>Initiator:</strong> Corporation • <strong>Type:</strong> Trade</p>
                </div>
                <div class="transaction-card">
                    <h3>Government Purchase</h3>
                    <div class="status pending">Pending</div>
                    <p>500,000 STD → 735,294 QTC</p>
                    <p><strong>Rate:</strong> 1.4706 • <strong>Fee:</strong> 500 STD</p>
                    <p><strong>Initiator:</strong> Government • <strong>Type:</strong> Reserve Management</p>
                </div>
                <div class="transaction-card">
                    <h3>Tourism Exchange</h3>
                    <div class="status settled">Settled</div>
                    <p>75,000 NEX → 81,522 GCR</p>
                    <p><strong>Rate:</strong> 1.0870 • <strong>Fee:</strong> 75 NEX</p>
                    <p><strong>Initiator:</strong> Tourist • <strong>Type:</strong> Tourism</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewAllTransactions()">View All Transactions</button>
                    <button class="btn primary" onclick="settleTransactions()">Settle Pending</button>
                </div>
            </div>

            <!-- Currency Policies -->
            <div class="panel">
                <h2>🏛️ Currency Policies</h2>
                <div class="currency-card">
                    <h3>Galactic Credits Policy</h3>
                    <div class="status floating">Free Floating</div>
                    <p>Central Bank: Non-interventionist approach</p>
                    <p><strong>Capital Controls:</strong> None</p>
                    <p><strong>Reserve Requirements:</strong> 5%</p>
                </div>
                <div class="currency-card">
                    <h3>Stellar Dollars Policy</h3>
                    <div class="status managed">Managed Float</div>
                    <p>Central Bank: Active intervention within bands</p>
                    <p><strong>Intervention Bands:</strong> ±5% from target</p>
                    <p><strong>Reserve Requirements:</strong> 8%</p>
                </div>
                <div class="currency-card">
                    <h3>Quantum Coins Policy</h3>
                    <div class="status fixed">Currency Board</div>
                    <p>Central Bank: Fixed peg to GCR at 0.80</p>
                    <p><strong>Capital Controls:</strong> Inflow restrictions</p>
                    <p><strong>Reserve Requirements:</strong> 15%</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewPolicies()">View All Policies</button>
                    <button class="btn warning" onclick="executeIntervention()">Execute Intervention</button>
                </div>
            </div>

            <!-- Currency Unions -->
            <div class="panel">
                <h2>🤝 Currency Unions</h2>
                <div class="union-card">
                    <h3>Galactic Trade Union</h3>
                    <div class="status active">Active</div>
                    <p>Common Currency: Galactic Credits (GCR)</p>
                    <p><strong>Members:</strong> Civilization 1, Civilization 4</p>
                    <p><strong>Voting Weights:</strong> 60% / 40%</p>
                </div>
                <div class="union-card">
                    <h3>Stellar Economic Zone</h3>
                    <div class="status pending">Proposed</div>
                    <p>Proposed Currency: Stellar Economic Unit (SEU)</p>
                    <p><strong>Potential Members:</strong> Civilization 2, Civilization 5</p>
                    <p><strong>Status:</strong> Under Negotiation</p>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewUnions()">View All Unions</button>
                    <button class="btn primary" onclick="createUnion()">Create Union</button>
                    <button class="btn success" onclick="joinUnion()">Join Union</button>
                </div>
            </div>

            <!-- Currency Analytics -->
            <div class="panel">
                <h2>📊 Market Analytics</h2>
                <div class="metrics">
                    <div class="metric">
                        <div class="metric-value">5</div>
                        <div class="metric-label">Active Currencies</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">20</div>
                        <div class="metric-label">Trading Pairs</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">$45.2B</div>
                        <div class="metric-label">Daily Volume</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">1.8%</div>
                        <div class="metric-label">Avg Volatility</div>
                    </div>
                </div>
                <div class="controls">
                    <button class="btn" onclick="viewStrengthIndex()">Currency Strength</button>
                    <button class="btn" onclick="viewMarketSummary()">Market Summary</button>
                    <button class="btn" onclick="assessReserves()">Reserve Analysis</button>
                </div>
            </div>
        </div>

        <!-- API Demo Section -->
        <div class="api-demo">
            <h3>🔧 API Endpoints Demo</h3>
            <div class="api-endpoint">GET /api/currency-exchange/currencies - List all currencies</div>
            <div class="api-endpoint">GET /api/currency-exchange/rates - Get current exchange rates</div>
            <div class="api-endpoint">POST /api/currency-exchange/rates/calculate - Calculate conversion</div>
            <div class="api-endpoint">GET /api/currency-exchange/transactions - List transactions</div>
            <div class="api-endpoint">POST /api/currency-exchange/transactions - Execute exchange</div>
            <div class="api-endpoint">GET /api/currency-exchange/policies/:currency - Get currency policy</div>
            <div class="api-endpoint">GET /api/currency-exchange/unions - List currency unions</div>
            <div class="api-endpoint">GET /api/currency-exchange/analytics/strength-index - Currency strength</div>
            <div class="controls">
                <button class="btn" onclick="testAPI()">Test API Endpoints</button>
                <button class="btn" onclick="viewAPIDoc()">View API Documentation</button>
            </div>
        </div>
    </div>

    <script>
        function viewAllCurrencies() {
            alert('💰 Active Currencies Overview\\n\\nGCR (Galactic Credits): Reserve Currency, Floating\\nSTD (Stellar Dollars): Managed Float, ±5% bands\\nQTC (Quantum Coins): Fixed to GCR at 0.80\\nNEX (Nexus Units): Floating, High volatility\\nZEN (Zenith Marks): Floating, Stable\\n\\nTotal Market Cap: $2.4 Trillion\\n\\n(This would call GET /api/currency-exchange/currencies)');
        }

        function createCurrency() {
            alert('🏦 Create New Currency\\n\\nCurrency Creation Wizard:\\n\\n1. Currency Code (3 letters)\\n2. Currency Name\\n3. Currency Symbol\\n4. Base Value (purchasing power)\\n5. Monetary Policy Type\\n6. Central Bank Authority\\n\\nRequires: Government Authorization\\nSubject to: International Recognition\\n\\n(This would call POST /api/currency-exchange/currencies)');
        }

        function viewAllRates() {
            alert('📈 Live Exchange Rates\\n\\nMajor Pairs:\\nGCR/STD: 1.1765 (↗ +0.23%)\\nGCR/QTC: 0.8000 (↘ -0.05%)\\nGCR/NEX: 1.0870 (↗ +0.45%)\\nGCR/ZEN: 0.8696 (→ 0.00%)\\n\\nCross Rates:\\nSTD/QTC: 0.6800 (↗ +0.15%)\\nNEX/ZEN: 0.8000 (↘ -0.12%)\\n\\nTotal Daily Volume: $45.2B\\n\\n(This would call GET /api/currency-exchange/rates)');
        }

        function updateRates() {
            alert('⚡ Exchange Rate Update\\n\\nUpdating real-time exchange rates:\\n\\n• Economic indicators analysis\\n• Trade flow adjustments\\n• Central bank intervention effects\\n• Market sentiment factors\\n• Volatility calculations\\n\\nRate update completed!\\nNew rates effective immediately.\\n\\n(This would call PUT /api/currency-exchange/rates/{base}/{quote})');
        }

        function calculateConversion() {
            const fromAmount = document.getElementById('fromAmount').value;
            const fromCurrency = document.getElementById('fromCurrency').value;
            const toCurrency = document.getElementById('toCurrency').value;
            
            // Simulate conversion calculation
            const rates = {
                'GCR': { 'STD': 1.1765, 'QTC': 0.8000, 'NEX': 1.0870, 'ZEN': 0.8696 },
                'STD': { 'GCR': 0.8500, 'QTC': 0.6800, 'NEX': 0.9240, 'ZEN': 0.7392 },
                'QTC': { 'GCR': 1.2500, 'STD': 1.4706, 'NEX': 1.3588, 'ZEN': 1.0870 },
                'NEX': { 'GCR': 0.9200, 'STD': 1.0822, 'QTC': 0.7361, 'ZEN': 0.8000 },
                'ZEN': { 'GCR': 1.1500, 'STD': 1.3529, 'QTC': 0.9200, 'NEX': 1.2500 }
            };
            
            const rate = rates[fromCurrency]?.[toCurrency] || 1.0;
            const convertedAmount = parseFloat(fromAmount) * rate;
            const fee = parseFloat(fromAmount) * 0.001;
            const totalCost = parseFloat(fromAmount) + fee;
            
            document.getElementById('toAmount').value = convertedAmount.toFixed(2);
            document.getElementById('exchangeRate').textContent = rate.toFixed(4);
            document.getElementById('transactionFee').textContent = fee.toFixed(2) + ' ' + fromCurrency;
            document.getElementById('totalCost').textContent = totalCost.toFixed(2) + ' ' + fromCurrency;
            document.getElementById('conversionResult').style.display = 'block';
        }

        function swapCurrencies() {
            const fromCurrency = document.getElementById('fromCurrency');
            const toCurrency = document.getElementById('toCurrency');
            const temp = fromCurrency.value;
            fromCurrency.value = toCurrency.value;
            toCurrency.value = temp;
            calculateConversion();
        }

        function executeTransaction() {
            alert('💸 Execute Currency Transaction\\n\\nTransaction Details:\\n\\nFrom: ' + document.getElementById('fromAmount').value + ' ' + document.getElementById('fromCurrency').value + '\\nTo: ' + document.getElementById('toAmount').value + ' ' + document.getElementById('toCurrency').value + '\\nRate: ' + document.getElementById('exchangeRate').textContent + '\\nFee: ' + document.getElementById('transactionFee').textContent + '\\n\\nTransaction Status: Executed\\nSettlement: Pending (2-5 minutes)\\nTransaction ID: TX-' + Math.random().toString(36).substr(2, 9).toUpperCase() + '\\n\\n(This would call POST /api/currency-exchange/transactions)');
        }

        function viewAllTransactions() {
            alert('💸 Currency Transactions History\\n\\nRecent Transactions:\\n\\n1. Trade: 1.25M GCR → 1.47M STD (Settled)\\n2. Government: 500K STD → 735K QTC (Pending)\\n3. Tourism: 75K NEX → 81K GCR (Settled)\\n4. Investment: 2M ZEN → 2.3M GCR (Settled)\\n5. Reserve: 800K GCR → 870K NEX (Pending)\\n\\nTotal Volume (24h): $45.2B\\nPending Settlements: 3\\n\\n(This would call GET /api/currency-exchange/transactions)');
        }

        function settleTransactions() {
            alert('⚡ Settle Pending Transactions\\n\\nProcessing pending settlements:\\n\\n✅ TX-A7B9C2: 500K STD → 735K QTC\\n✅ TX-D4F8E1: 800K GCR → 870K NEX\\n✅ TX-G2H5J9: 150K ZEN → 173K GCR\\n\\nAll pending transactions settled!\\nSettlement time: 2.3 seconds\\nNetwork fees: 0.05% average\\n\\n(This would call PUT /api/currency-exchange/transactions/{id}/settle)');
        }

        function viewPolicies() {
            alert('🏛️ Currency Policy Overview\\n\\nPolicy Summary:\\n\\nGCR: Free floating, no intervention\\nSTD: Managed float, ±5% intervention bands\\nQTC: Fixed peg to GCR at 0.80\\nNEX: Free floating, high volatility\\nZEN: Free floating, stability focused\\n\\nCapital Controls:\\nQTC: Inflow restrictions active\\nOthers: No restrictions\\n\\n(This would call GET /api/currency-exchange/policies/{currency})');
        }

        function executeIntervention() {
            alert('⚡ Central Bank Intervention\\n\\n🏦 INTERVENTION PROTOCOL 🏦\\n\\nTarget: STD/GCR exchange rate\\nCurrent Rate: 0.8500\\nTarget Rate: 0.8600\\nIntervention Amount: 50M GCR\\nIntervention Type: Buy Support\\n\\nMarket Impact: +1.2%\\nSuccess Rate: 85%\\nIntervention Status: Executed\\n\\n(This would call POST /api/currency-exchange/interventions)');
        }

        function viewUnions() {
            alert('🤝 Currency Unions Status\\n\\nActive Unions:\\n\\n1. Galactic Trade Union\\n   - Currency: GCR\\n   - Members: Civ 1 (60%), Civ 4 (40%)\\n   - Status: Active since 2387\\n\\n2. Stellar Economic Zone (Proposed)\\n   - Currency: SEU (proposed)\\n   - Members: Civ 2, Civ 5 (negotiating)\\n   - Status: Under discussion\\n\\nBenefits: Reduced transaction costs, price stability\\nChallenges: Monetary sovereignty, policy coordination\\n\\n(This would call GET /api/currency-exchange/unions)');
        }

        function createUnion() {
            alert('🤝 Create Currency Union\\n\\nCurrency Union Creation:\\n\\n1. Union Name\\n2. Common Currency Selection\\n3. Member Civilizations\\n4. Voting Weight Distribution\\n5. Monetary Policy Framework\\n6. Crisis Management Protocols\\n\\nRequires: Multi-civilization agreement\\nProcess: Treaty negotiation and ratification\\n\\n(This would call POST /api/currency-exchange/unions)');
        }

        function joinUnion() {
            alert('🤝 Join Currency Union\\n\\nUnion Membership Application:\\n\\nAvailable Unions:\\n1. Galactic Trade Union (GCR)\\n2. Stellar Economic Zone (SEU - proposed)\\n\\nMembership Requirements:\\n• Economic convergence criteria\\n• Monetary policy alignment\\n• Political stability metrics\\n• Trade integration levels\\n\\nVoting weight based on economic size\\n\\n(This would call POST /api/currency-exchange/unions/{id}/join)');
        }

        function viewStrengthIndex() {
            alert('📊 Currency Strength Index\\n\\nCurrency Performance Rankings:\\n\\n1. GCR: 100.0 (Reserve currency baseline)\\n2. ZEN: 87.3 (Stable, low volatility)\\n3. NEX: 82.1 (High growth, volatile)\\n4. STD: 78.9 (Managed stability)\\n5. QTC: 64.2 (Fixed peg constraints)\\n\\nFactors: Trade volume, volatility, economic fundamentals\\nUpdate frequency: Real-time\\n\\n(This would call GET /api/currency-exchange/analytics/strength-index)');
        }

        function viewMarketSummary() {
            alert('📈 Currency Market Summary\\n\\nMarket Overview:\\n\\nTotal Currencies: 5 active\\nTrading Pairs: 20 active pairs\\nDaily Volume: $45.2 billion\\nAverage Volatility: 1.8%\\nActive Unions: 1 (1 proposed)\\n\\nMarket Sentiment: Stable\\nMajor Events: None\\nIntervention Activity: Low\\nReserve Adequacy: Sufficient\\n\\n(This would call GET /api/currency-exchange/analytics/market-summary)');
        }

        function assessReserves() {
            alert('🏦 Reserve Adequacy Assessment\\n\\nCentral Bank Reserves:\\n\\nCivilization 1 (GCR issuer):\\n• Foreign reserves: $12.4B\\n• Reserve ratio: 18.2%\\n• Adequacy: Excellent\\n\\nCivilization 2 (STD issuer):\\n• Foreign reserves: $8.7B\\n• Reserve ratio: 15.1%\\n• Adequacy: Good\\n\\nRecommendations: Maintain current levels\\n\\n(This would call GET /api/currency-exchange/reserves/{civilization}/adequacy)');
        }

        function testAPI() {
            alert('🔧 Currency Exchange API Testing\\n\\nTesting Multi-Currency System APIs:\\n\\n✅ GET /api/currency-exchange/currencies (200 OK)\\n✅ GET /api/currency-exchange/rates (200 OK)\\n✅ POST /api/currency-exchange/rates/calculate (200 OK)\\n✅ GET /api/currency-exchange/transactions (200 OK)\\n✅ GET /api/currency-exchange/policies/* (200 OK)\\n✅ GET /api/currency-exchange/unions (200 OK)\\n✅ GET /api/currency-exchange/analytics/* (200 OK)\\n\\nAll endpoints responding correctly!');
        }

        function viewAPIDoc() {
            alert('📚 Currency Exchange API Documentation\\n\\nCore Endpoints:\\n• Currency Management (CRUD)\\n• Exchange Rate Operations\\n• Transaction Processing\\n• Policy Management\\n• Currency Union Operations\\n• Reserve Management\\n• Market Analytics\\n\\nFeatures: Real-time rates, automated settlements\\nSecurity: Multi-signature transactions\\nCompliance: International monetary standards');
        }

        // Auto-calculate conversion on input change
        document.addEventListener('DOMContentLoaded', function() {
            const fromAmount = document.getElementById('fromAmount');
            const fromCurrency = document.getElementById('fromCurrency');
            const toCurrency = document.getElementById('toCurrency');
            
            if (fromAmount && fromCurrency && toCurrency) {
                fromAmount.addEventListener('input', calculateConversion);
                fromCurrency.addEventListener('change', calculateConversion);
                toCurrency.addEventListener('change', calculateConversion);
                
                // Initial calculation
                calculateConversion();
            }
        });
    </script>
</body>
</html>
  `);
});

export default router;
