import express from 'express';

const router = express.Router();

router.get('/inflation-demo', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inflation Tracking System Demo</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #333;
                min-height: 100vh;
            }
            .container {
                max-width: 1400px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 3px solid #667eea;
            }
            .header h1 {
                color: #667eea;
                margin: 0;
                font-size: 2.5em;
                font-weight: 300;
            }
            .header p {
                color: #666;
                font-size: 1.1em;
                margin: 10px 0 0 0;
            }
            .dashboard {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 25px;
                margin-bottom: 30px;
            }
            .card {
                background: white;
                border-radius: 12px;
                padding: 25px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                border-left: 5px solid #667eea;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .card:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 35px rgba(0,0,0,0.15);
            }
            .card h3 {
                color: #667eea;
                margin: 0 0 15px 0;
                font-size: 1.3em;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .metric {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 12px 0;
                padding: 8px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            .metric:last-child {
                border-bottom: none;
            }
            .metric-label {
                font-weight: 500;
                color: #555;
            }
            .metric-value {
                font-weight: bold;
                font-size: 1.1em;
            }
            .positive { color: #e74c3c; }
            .negative { color: #27ae60; }
            .neutral { color: #3498db; }
            .controls {
                background: white;
                border-radius: 12px;
                padding: 25px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                margin-bottom: 30px;
            }
            .controls h3 {
                color: #667eea;
                margin: 0 0 20px 0;
                font-size: 1.3em;
            }
            .control-group {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }
            .btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1em;
                font-weight: 500;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
                text-align: center;
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
            }
            .btn-secondary {
                background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
            }
            .btn-danger {
                background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            }
            .status {
                padding: 15px;
                border-radius: 8px;
                margin: 15px 0;
                font-weight: 500;
            }
            .status.success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            .status.error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            .forecast-chart {
                background: white;
                border-radius: 12px;
                padding: 25px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                margin-bottom: 30px;
            }
            .chart-placeholder {
                height: 300px;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #6c757d;
                font-size: 1.1em;
                border: 2px dashed #dee2e6;
            }
            .risk-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .risk-list li {
                padding: 8px 0;
                border-bottom: 1px solid #f0f0f0;
                position: relative;
                padding-left: 20px;
            }
            .risk-list li:before {
                content: "•";
                color: #667eea;
                font-weight: bold;
                position: absolute;
                left: 0;
            }
            .risk-list li:last-child {
                border-bottom: none;
            }
            .icon {
                font-size: 1.2em;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📈 Inflation Tracking System</h1>
                <p>Comprehensive inflation monitoring and monetary policy analysis for economic management</p>
            </div>

            <div class="controls">
                <h3>🎛️ System Controls</h3>
                <div class="control-group">
                    <button class="btn" onclick="loadInflationMetrics()">📊 Load Current Metrics</button>
                    <button class="btn" onclick="generateForecast()">🔮 Generate Forecast</button>
                    <button class="btn" onclick="analyzePolicyImpact()">🏦 Analyze Policy Impact</button>
                    <button class="btn btn-secondary" onclick="loadDashboard()">📋 Load Dashboard</button>
                </div>
                <div id="status"></div>
            </div>

            <div class="dashboard">
                <div class="card">
                    <h3><span class="icon">📊</span> Current Inflation</h3>
                    <div class="metric">
                        <span class="metric-label">Headline CPI:</span>
                        <span class="metric-value neutral" id="headline-cpi">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Core CPI:</span>
                        <span class="metric-value neutral" id="core-cpi">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Food Inflation:</span>
                        <span class="metric-value neutral" id="food-inflation">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Energy Inflation:</span>
                        <span class="metric-value neutral" id="energy-inflation">--</span>
                    </div>
                </div>

                <div class="card">
                    <h3><span class="icon">🏭</span> Producer Prices</h3>
                    <div class="metric">
                        <span class="metric-label">Overall PPI:</span>
                        <span class="metric-value neutral" id="overall-ppi">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Raw Materials:</span>
                        <span class="metric-value neutral" id="raw-materials">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Finished Goods:</span>
                        <span class="metric-value neutral" id="finished-goods">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Services:</span>
                        <span class="metric-value neutral" id="services-ppi">--</span>
                    </div>
                </div>

                <div class="card">
                    <h3><span class="icon">🔮</span> Expectations</h3>
                    <div class="metric">
                        <span class="metric-label">1-Year Expected:</span>
                        <span class="metric-value neutral" id="exp-1y">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">3-Year Expected:</span>
                        <span class="metric-value neutral" id="exp-3y">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">10-Year Expected:</span>
                        <span class="metric-value neutral" id="exp-10y">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Market Breakeven:</span>
                        <span class="metric-value neutral" id="breakeven">--</span>
                    </div>
                </div>

                <div class="card">
                    <h3><span class="icon">🏦</span> Monetary Transmission</h3>
                    <div class="metric">
                        <span class="metric-label">Rate Pass-through:</span>
                        <span class="metric-value neutral" id="rate-pass">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Credit Growth:</span>
                        <span class="metric-value neutral" id="credit-growth">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Money Supply Growth:</span>
                        <span class="metric-value neutral" id="money-supply">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Money Velocity:</span>
                        <span class="metric-value neutral" id="velocity">--</span>
                    </div>
                </div>

                <div class="card">
                    <h3><span class="icon">🎯</span> Inflation Drivers</h3>
                    <div class="metric">
                        <span class="metric-label">Demand Pull:</span>
                        <span class="metric-value neutral" id="demand-pull">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Cost Push:</span>
                        <span class="metric-value neutral" id="cost-push">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Monetary Expansion:</span>
                        <span class="metric-value neutral" id="monetary-expansion">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Exchange Rate:</span>
                        <span class="metric-value neutral" id="exchange-rate">--</span>
                    </div>
                </div>

                <div class="card">
                    <h3><span class="icon">🏭</span> Sectoral Inflation</h3>
                    <div class="metric">
                        <span class="metric-label">Agriculture:</span>
                        <span class="metric-value neutral" id="agriculture">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Manufacturing:</span>
                        <span class="metric-value neutral" id="manufacturing">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Services:</span>
                        <span class="metric-value neutral" id="services-sector">--</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Technology:</span>
                        <span class="metric-value neutral" id="technology">--</span>
                    </div>
                </div>
            </div>

            <div class="forecast-chart">
                <h3>📈 Inflation Forecast</h3>
                <div class="chart-placeholder">
                    Inflation forecast chart will be displayed here
                    <br><small>Click "Generate Forecast" to load forecast data</small>
                </div>
            </div>

            <div class="dashboard">
                <div class="card">
                    <h3><span class="icon">⚠️</span> Upside Risks</h3>
                    <ul class="risk-list" id="upside-risks">
                        <li>Click "Generate Forecast" to load risk analysis</li>
                    </ul>
                </div>

                <div class="card">
                    <h3><span class="icon">⬇️</span> Downside Risks</h3>
                    <ul class="risk-list" id="downside-risks">
                        <li>Click "Generate Forecast" to load risk analysis</li>
                    </ul>
                </div>
            </div>
        </div>

        <script>
            const civilizationId = 'demo-civ-1';

            function showStatus(message, type = 'success') {
                const statusDiv = document.getElementById('status');
                statusDiv.innerHTML = \`<div class="status \${type}">\${message}</div>\`;
                setTimeout(() => statusDiv.innerHTML = '', 5000);
            }

            function formatPercentage(value) {
                if (value === null || value === undefined || isNaN(value)) return '--';
                return \`\${value.toFixed(1)}%\`;
            }

            function getInflationClass(value) {
                if (value === null || value === undefined || isNaN(value)) return 'neutral';
                if (value > 3) return 'positive';
                if (value < 1) return 'negative';
                return 'neutral';
            }

            async function loadInflationMetrics() {
                try {
                    showStatus('Loading inflation metrics...', 'success');
                    const response = await fetch(\`/api/inflation/metrics/\${civilizationId}\`);
                    const data = await response.json();

                    if (data.success) {
                        const metrics = data.data;
                        
                        // Update CPI metrics
                        document.getElementById('headline-cpi').textContent = formatPercentage(metrics.cpi.overall);
                        document.getElementById('headline-cpi').className = \`metric-value \${getInflationClass(metrics.cpi.overall)}\`;
                        
                        document.getElementById('core-cpi').textContent = formatPercentage(metrics.cpi.core);
                        document.getElementById('core-cpi').className = \`metric-value \${getInflationClass(metrics.cpi.core)}\`;
                        
                        document.getElementById('food-inflation').textContent = formatPercentage(metrics.cpi.food);
                        document.getElementById('food-inflation').className = \`metric-value \${getInflationClass(metrics.cpi.food)}\`;
                        
                        document.getElementById('energy-inflation').textContent = formatPercentage(metrics.cpi.energy);
                        document.getElementById('energy-inflation').className = \`metric-value \${getInflationClass(metrics.cpi.energy)}\`;

                        // Update PPI metrics
                        document.getElementById('overall-ppi').textContent = formatPercentage(metrics.ppi.overall);
                        document.getElementById('raw-materials').textContent = formatPercentage(metrics.ppi.rawMaterials);
                        document.getElementById('finished-goods').textContent = formatPercentage(metrics.ppi.finishedGoods);
                        document.getElementById('services-ppi').textContent = formatPercentage(metrics.ppi.services);

                        // Update expectations
                        document.getElementById('exp-1y').textContent = formatPercentage(metrics.expectations.shortTerm);
                        document.getElementById('exp-3y').textContent = formatPercentage(metrics.expectations.mediumTerm);
                        document.getElementById('exp-10y').textContent = formatPercentage(metrics.expectations.longTerm);
                        document.getElementById('breakeven').textContent = formatPercentage(metrics.expectations.breakeven);

                        // Update transmission
                        document.getElementById('rate-pass').textContent = \`\${(metrics.transmission.interestRatePass * 100).toFixed(0)}%\`;
                        document.getElementById('credit-growth').textContent = formatPercentage(metrics.transmission.creditGrowth);
                        document.getElementById('money-supply').textContent = formatPercentage(metrics.transmission.moneySupplyGrowth);
                        document.getElementById('velocity').textContent = metrics.transmission.velocityOfMoney.toFixed(1);

                        // Update drivers
                        document.getElementById('demand-pull').textContent = formatPercentage(metrics.drivers.demandPull);
                        document.getElementById('cost-push').textContent = formatPercentage(metrics.drivers.costPush);
                        document.getElementById('monetary-expansion').textContent = formatPercentage(metrics.drivers.monetaryExpansion);
                        document.getElementById('exchange-rate').textContent = formatPercentage(metrics.drivers.exchangeRate);

                        // Update sectors
                        document.getElementById('agriculture').textContent = formatPercentage(metrics.sectors.agriculture);
                        document.getElementById('manufacturing').textContent = formatPercentage(metrics.sectors.manufacturing);
                        document.getElementById('services-sector').textContent = formatPercentage(metrics.sectors.services);
                        document.getElementById('technology').textContent = formatPercentage(metrics.sectors.technology);

                        showStatus('Inflation metrics loaded successfully!', 'success');
                    } else {
                        showStatus(\`Error: \${data.error}\`, 'error');
                    }
                } catch (error) {
                    showStatus(\`Failed to load metrics: \${error.message}\`, 'error');
                }
            }

            async function generateForecast() {
                try {
                    showStatus('Generating inflation forecast...', 'success');
                    const response = await fetch(\`/api/inflation/forecast/\${civilizationId}\`);
                    const data = await response.json();

                    if (data.success) {
                        const forecast = data.data;
                        
                        // Update risk lists
                        const upsideRisks = document.getElementById('upside-risks');
                        upsideRisks.innerHTML = forecast.risks.upside.map(risk => \`<li>\${risk}</li>\`).join('');
                        
                        const downsideRisks = document.getElementById('downside-risks');
                        downsideRisks.innerHTML = forecast.risks.downside.map(risk => \`<li>\${risk}</li>\`).join('');

                        showStatus('Inflation forecast generated successfully!', 'success');
                    } else {
                        showStatus(\`Error: \${data.error}\`, 'error');
                    }
                } catch (error) {
                    showStatus(\`Failed to generate forecast: \${error.message}\`, 'error');
                }
            }

            async function analyzePolicyImpact() {
                try {
                    showStatus('Analyzing monetary policy impact...', 'success');
                    
                    const policyChange = {
                        interestRateChange: 0.25, // 25 basis points
                        type: 'rate_hike',
                        rationale: 'Combat rising inflation'
                    };

                    const response = await fetch(\`/api/inflation/policy-impact/\${civilizationId}\`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(policyChange)
                    });
                    
                    const data = await response.json();

                    if (data.success) {
                        const impact = data.data;
                        showStatus(\`Policy impact analysis complete. Expected immediate impact: \${impact.expectedImpact.immediate.toFixed(2)}%\`, 'success');
                    } else {
                        showStatus(\`Error: \${data.error}\`, 'error');
                    }
                } catch (error) {
                    showStatus(\`Failed to analyze policy impact: \${error.message}\`, 'error');
                }
            }

            async function loadDashboard() {
                try {
                    showStatus('Loading inflation dashboard...', 'success');
                    const response = await fetch(\`/api/inflation/dashboard/\${civilizationId}\`);
                    const data = await response.json();

                    if (data.success) {
                        const dashboard = data.data;
                        
                        // Update current inflation
                        document.getElementById('headline-cpi').textContent = formatPercentage(dashboard.currentInflation.headline);
                        document.getElementById('core-cpi').textContent = formatPercentage(dashboard.currentInflation.core);
                        document.getElementById('food-inflation').textContent = formatPercentage(dashboard.currentInflation.food);
                        document.getElementById('energy-inflation').textContent = formatPercentage(dashboard.currentInflation.energy);

                        showStatus('Dashboard loaded successfully!', 'success');
                    } else {
                        showStatus(\`Error: \${data.error}\`, 'error');
                    }
                } catch (error) {
                    showStatus(\`Failed to load dashboard: \${error.message}\`, 'error');
                }
            }

            // Load initial data
            document.addEventListener('DOMContentLoaded', function() {
                showStatus('Inflation Tracking System initialized. Click buttons to load data.', 'success');
            });
        </script>
    </body>
    </html>
  `);
});

export default router;
