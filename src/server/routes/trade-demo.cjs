function getTradeDemo() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Galactic Trade System - StarTales Demo</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Roboto', sans-serif;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
      color: #e0e0e0;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .container {
      max-width: 1600px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 15px;
      border: 1px solid rgba(187, 134, 252, 0.3);
    }

    .header h1 {
      font-family: 'Orbitron', monospace;
      font-size: 2.5rem;
      color: #bb86fc;
      margin-bottom: 10px;
      text-shadow: 0 0 20px rgba(187, 134, 252, 0.5);
    }

    .header p {
      font-size: 1.1rem;
      color: #a0a0a0;
    }

    .controls {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn {
      background: linear-gradient(135deg, #bb86fc 0%, #6200ea 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      font-size: 14px;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(187, 134, 252, 0.4);
    }

    .btn.secondary {
      background: linear-gradient(135deg, #03dac6 0%, #018786 100%);
    }

    .btn.success {
      background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
    }

    .btn.warning {
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
    }

    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .card {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 15px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .card:hover {
      border-color: rgba(187, 134, 252, 0.5);
      box-shadow: 0 8px 32px rgba(187, 134, 252, 0.2);
    }

    .card h3 {
      color: #bb86fc;
      margin-bottom: 15px;
      font-family: 'Orbitron', monospace;
      font-size: 1.2rem;
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

    .metric-label {
      color: #a0a0a0;
    }

    .metric-value {
      color: #03dac6;
      font-weight: 600;
    }

    .metric-value.positive {
      color: #4caf50;
    }

    .metric-value.negative {
      color: #f44336;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .item-card {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 15px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      position: relative;
    }

    .item-card:hover {
      border-color: rgba(187, 134, 252, 0.5);
      transform: translateY(-5px);
      box-shadow: 0 12px 40px rgba(187, 134, 252, 0.2);
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }

    .item-title {
      font-family: 'Orbitron', monospace;
      font-size: 1.2rem;
      color: #bb86fc;
      flex: 1;
      margin-right: 10px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-active {
      background: rgba(76, 175, 80, 0.2);
      color: #4caf50;
      border: 1px solid #4caf50;
    }

    .status-pending {
      background: rgba(255, 193, 7, 0.2);
      color: #ffc107;
      border: 1px solid #ffc107;
    }

    .status-completed {
      background: rgba(3, 218, 198, 0.2);
      color: #03dac6;
      border: 1px solid #03dac6;
    }

    .status-cancelled {
      background: rgba(158, 158, 158, 0.2);
      color: #9e9e9e;
      border: 1px solid #9e9e9e;
    }

    .category-badge {
      background: rgba(3, 218, 198, 0.2);
      color: #03dac6;
      border: 1px solid #03dac6;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: 600;
      margin-left: 5px;
    }

    .priority-high { border-left: 4px solid #f44336; }
    .priority-medium { border-left: 4px solid #ff9800; }
    .priority-low { border-left: 4px solid #4caf50; }

    .item-content {
      margin-bottom: 15px;
    }

    .item-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
      font-size: 0.9rem;
    }

    .item-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn-small {
      padding: 6px 12px;
      font-size: 0.8rem;
      border-radius: 6px;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #a0a0a0;
    }

    .error {
      background: rgba(207, 102, 121, 0.2);
      border: 1px solid #cf6679;
      color: #cf6679;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .success {
      background: rgba(76, 175, 80, 0.2);
      border: 1px solid #4caf50;
      color: #4caf50;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .back-link {
      display: inline-block;
      margin-top: 30px;
      color: #03dac6;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .back-link:hover {
      color: #bb86fc;
    }

    .price-chart {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 15px;
      margin-top: 10px;
      max-height: 200px;
      overflow-y: auto;
    }

    .price-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .price-item:last-child {
      border-bottom: none;
    }

    .route-path {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 10px 0;
      font-weight: 600;
    }

    .route-arrow {
      color: #bb86fc;
      font-size: 1.2rem;
    }

    .opportunity-card {
      border-left: 4px solid #03dac6;
      background: rgba(3, 218, 198, 0.1);
    }

    .profit-highlight {
      background: rgba(76, 175, 80, 0.2);
      color: #4caf50;
      padding: 4px 8px;
      border-radius: 6px;
      font-weight: 600;
      display: inline-block;
      margin: 5px 0;
    }

    .tabs {
      display: flex;
      gap: 5px;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tab {
      padding: 12px 20px;
      background: none;
      border: none;
      color: #a0a0a0;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .tab.active {
      color: #bb86fc;
      border-bottom-color: #bb86fc;
    }

    .tab:hover {
      color: #e0e0e0;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💰 Galactic Trade System</h1>
      <p>Manage interstellar commerce, trade routes, and economic opportunities across the galaxy</p>
    </div>

    <div class="controls">
      <button class="btn" onclick="loadOverview()">📊 Trade Overview</button>
      <button class="btn secondary" onclick="loadCommodities()">📦 Commodities</button>
      <button class="btn secondary" onclick="loadRoutes()">🚀 Trade Routes</button>
      <button class="btn secondary" onclick="loadCorporations()">🏢 Corporations</button>
      <button class="btn secondary" onclick="loadContracts()">📋 Contracts</button>
      <button class="btn secondary" onclick="loadOpportunities()">💡 Opportunities</button>
      <button class="btn warning" onclick="simulateMarket()">🎲 Simulate Market</button>
    </div>

    <div id="content">
      <div class="loading">
        <p>💰 Initializing Galactic Trade System...</p>
      </div>
    </div>

    <a href="/demo/command-center" class="back-link">← Back to Command Center</a>
  </div>

  <script>
    let currentData = {};

    // Initialize the demo
    document.addEventListener('DOMContentLoaded', function() {
      loadOverview();
    });

    async function loadOverview() {
      try {
        showLoading('Loading trade overview...');
        
        const [indicesResponse, systemsResponse] = await Promise.all([
          fetch('/api/trade/indices'),
          fetch('/api/trade/systems')
        ]);
        
        const indices = await indicesResponse.json();
        const systems = await systemsResponse.json();
        
        currentData.indices = indices;
        currentData.systems = systems;
        
        displayOverview();
      } catch (error) {
        showError('Failed to load trade overview: ' + error.message);
      }
    }

    async function loadCommodities() {
      try {
        showLoading('Loading commodity data...');
        
        const response = await fetch('/api/trade/commodities');
        const data = await response.json();
        currentData.commodities = data;
        
        displayCommodities();
      } catch (error) {
        showError('Failed to load commodities: ' + error.message);
      }
    }

    async function loadRoutes() {
      try {
        showLoading('Loading trade routes...');
        
        const response = await fetch('/api/trade/routes');
        const data = await response.json();
        currentData.routes = data;
        
        displayRoutes();
      } catch (error) {
        showError('Failed to load routes: ' + error.message);
      }
    }

    async function loadCorporations() {
      try {
        showLoading('Loading corporations...');
        
        const response = await fetch('/api/trade/corporations');
        const data = await response.json();
        currentData.corporations = data;
        
        displayCorporations();
      } catch (error) {
        showError('Failed to load corporations: ' + error.message);
      }
    }

    async function loadContracts() {
      try {
        showLoading('Loading contracts...');
        
        const response = await fetch('/api/trade/contracts');
        const data = await response.json();
        currentData.contracts = data;
        
        displayContracts();
      } catch (error) {
        showError('Failed to load contracts: ' + error.message);
      }
    }

    async function loadOpportunities() {
      try {
        showLoading('Analyzing trade opportunities...');
        
        const response = await fetch('/api/trade/opportunities');
        const data = await response.json();
        currentData.opportunities = data;
        
        displayOpportunities();
      } catch (error) {
        showError('Failed to load opportunities: ' + error.message);
      }
    }

    function displayOverview() {
      if (!currentData.indices || !currentData.systems) return;

      const indices = currentData.indices.indices;
      const systems = currentData.systems.systems;

      const content = document.getElementById('content');
      content.innerHTML = \`
        <div class="dashboard">
          <div class="card">
            <h3>📊 Market Indices</h3>
            <div class="metric">
              <span class="metric-label">Price Index</span>
              <span class="metric-value">\${indices.priceIndex}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Volume Index</span>
              <span class="metric-value">\${indices.volumeIndex.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Contract Index</span>
              <span class="metric-value">\${indices.contractIndex}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Corporation Index</span>
              <span class="metric-value">\${indices.corporationIndex}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Route Index</span>
              <span class="metric-value">\${indices.routeIndex}</span>
            </div>
          </div>

          <div class="card">
            <h3>🌌 Galactic Overview</h3>
            <div class="metric">
              <span class="metric-label">Total Systems</span>
              <span class="metric-value">\${indices.totalSystems}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Active Routes</span>
              <span class="metric-value">\${indices.totalRoutes}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Total Trade Volume</span>
              <span class="metric-value">\${indices.totalTradeVolume.toLocaleString()}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Average Price</span>
              <span class="metric-value">\${Math.round(indices.averagePrice)} credits</span>
            </div>
            <div class="metric">
              <span class="metric-label">Active Contracts</span>
              <span class="metric-value">\${indices.activeContracts}</span>
            </div>
          </div>

          <div class="card">
            <h3>🏆 Top Commodities</h3>
            \${indices.topCommodities.map(commodity => \`
              <div class="metric">
                <span class="metric-label">\${commodity.name}</span>
                <span class="metric-value">\${commodity.price.toFixed(2)} credits</span>
              </div>
            \`).join('')}
          </div>

          <div class="card">
            <h3>🚀 Top Routes</h3>
            \${indices.topRoutes.map(route => \`
              <div class="metric">
                <span class="metric-label">\${route.name}</span>
                <span class="metric-value">\${route.traffic} ships/day</span>
              </div>
            \`).join('')}
          </div>
        </div>

        <div class="card">
          <h3>🌟 Star Systems</h3>
          <div class="grid">
            \${systems.map(system => \`
              <div class="item-card">
                <div class="item-header">
                  <div class="item-title">\${system.name}</div>
                  <div class="category-badge">\${system.economicTier.replace('_', ' ')}</div>
                </div>
                
                <div class="item-meta">
                  <div class="metric">
                    <span class="metric-label">Trade Volume</span>
                    <span class="metric-value">\${system.tradeVolume.toLocaleString()}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Security Level</span>
                    <span class="metric-value">\${system.securityLevel}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Tax Rate</span>
                    <span class="metric-value">\${(system.taxRate * 100).toFixed(1)}%</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Specializations</span>
                    <span class="metric-value">\${system.specializations.join(', ')}</span>
                  </div>
                </div>

                <div class="price-chart">
                  <strong style="color: #bb86fc;">Current Prices:</strong>
                  \${Object.entries(system.currentPrices).slice(0, 5).map(([commodity, price]) => \`
                    <div class="price-item">
                      <span>\${commodity.replace('_', ' ')}</span>
                      <span>\${price.toFixed(2)} credits</span>
                    </div>
                  \`).join('')}
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    function displayCommodities() {
      if (!currentData.commodities) return;

      const commodities = currentData.commodities.commodities;

      const content = document.getElementById('content');
      content.innerHTML = \`
        <div class="card">
          <h3>📦 Galactic Commodities Market</h3>
          <div class="grid">
            \${commodities.map(commodity => \`
              <div class="item-card">
                <div class="item-header">
                  <div class="item-title">\${commodity.name}</div>
                  <div class="category-badge">\${commodity.category}</div>
                </div>
                
                <div class="item-meta">
                  <div class="metric">
                    <span class="metric-label">Current Price</span>
                    <span class="metric-value">\${commodity.currentPrice.toFixed(2)} credits/\${commodity.unit}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Base Price</span>
                    <span class="metric-value">\${commodity.basePrice} credits/\${commodity.unit}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Price Change</span>
                    <span class="metric-value \${parseFloat(commodity.priceChange) >= 0 ? 'positive' : 'negative'}">\${commodity.priceChange}%</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Supply</span>
                    <span class="metric-value">\${commodity.supply.toLocaleString()}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Demand</span>
                    <span class="metric-value">\${commodity.demand.toLocaleString()}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">S/D Ratio</span>
                    <span class="metric-value">\${commodity.supplyDemandRatio}</span>
                  </div>
                </div>

                <div class="item-actions">
                  <button class="btn btn-small secondary" onclick="viewPriceHistory('\${commodity.id}')">📈 Price History</button>
                  <button class="btn btn-small secondary" onclick="findArbitrage('\${commodity.id}')">💰 Find Arbitrage</button>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    function displayRoutes() {
      if (!currentData.routes) return;

      const routes = currentData.routes.routes;

      const content = document.getElementById('content');
      content.innerHTML = \`
        <div class="card">
          <h3>🚀 Galactic Trade Routes</h3>
          <div class="grid">
            \${routes.map(route => \`
              <div class="item-card">
                <div class="item-header">
                  <div class="item-title">\${route.name}</div>
                  <div class="status-badge status-\${route.status}">\${route.status.toUpperCase()}</div>
                </div>
                
                <div class="route-path">
                  <span>\${route.originName}</span>
                  <span class="route-arrow">→</span>
                  <span>\${route.destinationName}</span>
                </div>
                
                <div class="item-meta">
                  <div class="metric">
                    <span class="metric-label">Route Type</span>
                    <span class="metric-value">\${route.routeTypeInfo ? route.routeTypeInfo.name : route.routeType}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Distance</span>
                    <span class="metric-value">\${route.distance} ly</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Travel Time</span>
                    <span class="metric-value">\${route.travelTime} days</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Traffic Volume</span>
                    <span class="metric-value">\${route.trafficVolume} ships/day</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Security Level</span>
                    <span class="metric-value">\${route.securityLevel}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Est. Daily Profit</span>
                    <span class="metric-value">\${route.estimatedProfit.toLocaleString()} credits</span>
                  </div>
                </div>

                <div style="margin: 10px 0;">
                  <strong style="color: #bb86fc;">Primary Commodities:</strong>
                  <div style="margin-top: 5px;">
                    \${route.primaryCommodities.map(commodity => \`
                      <span class="category-badge" style="margin: 2px;">\${commodity}</span>
                    \`).join('')}
                  </div>
                </div>

                <div class="item-actions">
                  <button class="btn btn-small secondary" onclick="analyzeRoute('\${route.id}')">📊 Analyze</button>
                  <button class="btn btn-small secondary" onclick="optimizeRoute('\${route.id}')">⚡ Optimize</button>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    function displayCorporations() {
      if (!currentData.corporations) return;

      const corporations = currentData.corporations.corporations;

      const content = document.getElementById('content');
      content.innerHTML = \`
        <div class="card">
          <h3>🏢 Galactic Corporations</h3>
          <div class="grid">
            \${corporations.map(corp => \`
              <div class="item-card">
                <div class="item-header">
                  <div class="item-title">\${corp.name}</div>
                  <div class="category-badge">\${corp.sector}</div>
                </div>
                
                <div class="item-meta">
                  <div class="metric">
                    <span class="metric-label">Headquarters</span>
                    <span class="metric-value">\${corp.headquartersName}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Reputation</span>
                    <span class="metric-value">\${corp.reputation.toFixed(1)}/100</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Market Share</span>
                    <span class="metric-value">\${(corp.marketShare * 100).toFixed(1)}%</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Employees</span>
                    <span class="metric-value">\${corp.employees.toLocaleString()}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Annual Revenue</span>
                    <span class="metric-value">\${(corp.revenue / 1000000).toFixed(1)}M credits</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Active Contracts</span>
                    <span class="metric-value">\${corp.contractCount}</span>
                  </div>
                </div>

                <div style="margin: 10px 0;">
                  <strong style="color: #bb86fc;">Specialties:</strong>
                  <div style="margin-top: 5px;">
                    \${corp.specialties.map(specialty => \`
                      <span class="category-badge" style="margin: 2px;">\${specialty}</span>
                    \`).join('')}
                  </div>
                </div>

                <div class="item-actions">
                  <button class="btn btn-small secondary" onclick="viewCorporation('\${corp.id}')">👁️ View Details</button>
                  <button class="btn btn-small secondary" onclick="partnerWith('\${corp.id}')">🤝 Partner</button>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    function displayContracts() {
      if (!currentData.contracts) return;

      const contracts = currentData.contracts.contracts;

      const content = document.getElementById('content');
      content.innerHTML = \`
        <div class="card">
          <h3>📋 Trade Contracts</h3>
          <div class="grid">
            \${contracts.map(contract => \`
              <div class="item-card">
                <div class="item-header">
                  <div class="item-title">\${contract.commodityName} Contract</div>
                  <div class="status-badge status-\${contract.status}">\${contract.status.toUpperCase()}</div>
                </div>
                
                <div class="route-path">
                  <span>\${contract.originName}</span>
                  <span class="route-arrow">→</span>
                  <span>\${contract.destinationName}</span>
                </div>
                
                <div class="item-meta">
                  <div class="metric">
                    <span class="metric-label">Contract Type</span>
                    <span class="metric-value">\${contract.type.replace('_', ' ')}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Quantity</span>
                    <span class="metric-value">\${contract.quantity.toLocaleString()}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Unit Price</span>
                    <span class="metric-value">\${contract.unitPrice} credits</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Total Value</span>
                    <span class="metric-value">\${contract.totalValue.toLocaleString()} credits</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Corporation</span>
                    <span class="metric-value">\${contract.corporationName}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Delivery</span>
                    <span class="metric-value">\${contract.daysUntilDelivery > 0 ? contract.daysUntilDelivery + ' days' : 'Overdue'}</span>
                  </div>
                </div>

                <div class="item-actions">
                  <button class="btn btn-small secondary" onclick="viewContract('\${contract.id}')">👁️ View Details</button>
                  \${contract.status === 'active' ? \`
                    <button class="btn btn-small success" onclick="completeContract('\${contract.id}')">✅ Complete</button>
                    <button class="btn btn-small" onclick="cancelContract('\${contract.id}')">❌ Cancel</button>
                  \` : ''}
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    function displayOpportunities() {
      if (!currentData.opportunities) return;

      const opportunities = currentData.opportunities.opportunities;

      const content = document.getElementById('content');
      content.innerHTML = \`
        <div class="card">
          <h3>💡 Trade Opportunities</h3>
          <div class="grid">
            \${opportunities.map(opportunity => \`
              <div class="item-card opportunity-card priority-\${opportunity.priority}">
                <div class="item-header">
                  <div class="item-title">
                    \${opportunity.type === 'arbitrage' ? '💰 Arbitrage Opportunity' : '🚀 New Route Opportunity'}
                  </div>
                  <div class="status-badge status-\${opportunity.priority === 'high' ? 'active' : opportunity.priority === 'medium' ? 'pending' : 'completed'}">
                    \${opportunity.priority.toUpperCase()} PRIORITY
                  </div>
                </div>
                
                \${opportunity.type === 'arbitrage' ? \`
                  <div class="item-content">
                    <strong style="color: #bb86fc;">Commodity:</strong> \${opportunity.commodityName}
                  </div>
                  
                  <div class="route-path">
                    <span>\${opportunity.buyFrom}</span>
                    <span class="route-arrow">→</span>
                    <span>\${opportunity.sellTo}</span>
                  </div>
                  
                  <div class="item-meta">
                    <div class="metric">
                      <span class="metric-label">Buy Price</span>
                      <span class="metric-value">\${opportunity.buyPrice.toFixed(2)} credits</span>
                    </div>
                    <div class="metric">
                      <span class="metric-label">Sell Price</span>
                      <span class="metric-value">\${opportunity.sellPrice.toFixed(2)} credits</span>
                    </div>
                    <div class="metric">
                      <span class="metric-label">Profit Margin</span>
                      <span class="metric-value positive">\${opportunity.profitMargin}%</span>
                    </div>
                    <div class="metric">
                      <span class="metric-label">Est. Profit (100 units)</span>
                      <span class="metric-value positive">\${opportunity.estimatedProfit.toLocaleString()} credits</span>
                    </div>
                  </div>
                  
                  <div class="profit-highlight">
                    Potential profit: \${opportunity.estimatedProfit.toLocaleString()} credits per 100 units
                  </div>
                \` : \`
                  <div class="route-path">
                    <span>\${opportunity.origin}</span>
                    <span class="route-arrow">→</span>
                    <span>\${opportunity.destination}</span>
                  </div>
                  
                  <div class="item-meta">
                    <div class="metric">
                      <span class="metric-label">Distance</span>
                      <span class="metric-value">\${opportunity.distance} ly</span>
                    </div>
                    <div class="metric">
                      <span class="metric-label">Est. Traffic</span>
                      <span class="metric-value">\${opportunity.estimatedTraffic} ships/day</span>
                    </div>
                    <div class="metric">
                      <span class="metric-label">Investment Required</span>
                      <span class="metric-value">\${(opportunity.investmentRequired / 1000000).toFixed(1)}M credits</span>
                    </div>
                  </div>
                  
                  <div class="profit-highlight">
                    New route opportunity with \${opportunity.estimatedTraffic} ships/day potential
                  </div>
                \`}

                <div class="item-actions">
                  <button class="btn btn-small success" onclick="executeOpportunity('\${opportunity.type}', \${JSON.stringify(opportunity).replace(/"/g, '&quot;')})">
                    \${opportunity.type === 'arbitrage' ? '💰 Execute Trade' : '🚀 Establish Route'}
                  </button>
                  <button class="btn btn-small secondary" onclick="analyzeOpportunity(\${JSON.stringify(opportunity).replace(/"/g, '&quot;')})">📊 Analyze</button>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    async function simulateMarket() {
      try {
        showMessage('Running market simulation...', 'info');
        
        const response = await fetch('/api/trade/simulate', { method: 'POST' });
        const result = await response.json();
        
        if (result.success) {
          showMessage(\`Market simulation completed! New average price: \${result.marketSummary.averagePrice} credits\`, 'success');
          // Refresh current view
          if (currentData.indices) loadOverview();
          if (currentData.commodities) loadCommodities();
        } else {
          showMessage('Market simulation failed', 'error');
        }
      } catch (error) {
        showMessage('Error running simulation: ' + error.message, 'error');
      }
    }

    async function viewPriceHistory(commodityId) {
      try {
        const response = await fetch(\`/api/trade/commodities/\${commodityId}/history\`);
        const data = await response.json();
        
        let historyText = \`Price History for \${data.commodity.name}:\\n\\n\`;
        data.priceHistory.slice(-10).forEach(entry => {
          historyText += \`\${new Date(entry.date).toLocaleDateString()}: \${entry.price} credits (Volume: \${entry.volume})\\n\`;
        });
        
        alert(historyText);
      } catch (error) {
        showMessage('Error loading price history: ' + error.message, 'error');
      }
    }

    async function completeContract(contractId) {
      try {
        const response = await fetch(\`/api/trade/contracts/\${contractId}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'completed' })
        });
        
        const result = await response.json();
        if (result.contract) {
          showMessage(\`Contract completed successfully!\`, 'success');
          loadContracts(); // Refresh contracts view
        }
      } catch (error) {
        showMessage('Error completing contract: ' + error.message, 'error');
      }
    }

    function executeOpportunity(type, opportunity) {
      if (type === 'arbitrage') {
        alert(\`Executing arbitrage trade:\\n\\nBuy \${opportunity.commodityName} from \${opportunity.buyFrom} at \${opportunity.buyPrice} credits\\nSell to \${opportunity.sellTo} at \${opportunity.sellPrice} credits\\n\\nExpected profit: \${opportunity.estimatedProfit} credits\`);
      } else {
        alert(\`Establishing new trade route:\\n\\n\${opportunity.origin} → \${opportunity.destination}\\nDistance: \${opportunity.distance} ly\\nInvestment: \${(opportunity.investmentRequired / 1000000).toFixed(1)}M credits\`);
      }
    }

    function showLoading(message) {
      document.getElementById('content').innerHTML = \`
        <div class="loading">
          <p>💰 \${message}</p>
        </div>
      \`;
    }

    function showError(message) {
      document.getElementById('content').innerHTML = \`
        <div class="error">
          <p>❌ \${message}</p>
        </div>
      \`;
    }

    function showMessage(message, type) {
      const messageDiv = document.createElement('div');
      messageDiv.className = type === 'success' ? 'success' : type === 'error' ? 'error' : 'info';
      messageDiv.innerHTML = \`<p>\${message}</p>\`;
      
      const container = document.querySelector('.container');
      container.insertBefore(messageDiv, container.firstChild);
      
      setTimeout(() => {
        messageDiv.remove();
      }, 5000);
    }

    // Placeholder functions for additional features
    function findArbitrage(commodityId) {
      showMessage('Analyzing arbitrage opportunities for ' + commodityId + '...', 'info');
    }

    function analyzeRoute(routeId) {
      showMessage('Analyzing route performance...', 'info');
    }

    function optimizeRoute(routeId) {
      showMessage('Optimizing route efficiency...', 'info');
    }

    function viewCorporation(corpId) {
      showMessage('Loading corporation details...', 'info');
    }

    function partnerWith(corpId) {
      showMessage('Initiating partnership negotiations...', 'info');
    }

    function viewContract(contractId) {
      showMessage('Loading contract details...', 'info');
    }

    function cancelContract(contractId) {
      if (confirm('Are you sure you want to cancel this contract?')) {
        showMessage('Contract cancelled', 'info');
      }
    }

    function analyzeOpportunity(opportunity) {
      showMessage('Analyzing opportunity details...', 'info');
    }
  </script>
</body>
</html>`;
}

module.exports = { getTradeDemo };

