import express from 'express';
import tradeRouter from '../server/routes/trade.js';
import campaignsRouter from '../server/routes/campaigns.js';

const app = express();
app.use(express.json());

// Mount the API routers
app.use('/api/trade', tradeRouter);
app.use('/api/campaigns', campaignsRouter);

/**
 * Sprint 4 Demo: Trade & Economy (Phase 1) + Analytics Base
 * Demo: prices react to scarcity/tariffs; contract lifecycle; basic indices
 */
app.get('/demo/trade', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sprint 4 - Trade & Economy</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 20px; background: #f0f0f0; }
        .container { max-width: 1400px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .demo-section { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #007bff; }
        .controls { display: flex; gap: 10px; align-items: center; margin: 15px 0; flex-wrap: wrap; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        button:disabled { background: #ccc; cursor: not-allowed; }
        .success { background: #28a745; }
        .warning { background: #ffc107; color: black; }
        .danger { background: #dc3545; }
        input, select, textarea { padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin: 0 5px; }
        .log { height: 200px; overflow-y: auto; background: white; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; border: 1px solid #ddd; }
        .three-column { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .price-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 10px 0; }
        .price-card { background: white; border: 1px solid #ddd; border-radius: 4px; padding: 10px; }
        .price-card h4 { margin: 0 0 8px 0; }
        .price-trend { font-weight: bold; }
        .trend-rising { color: #28a745; }
        .trend-falling { color: #dc3545; }
        .trend-stable { color: #6c757d; }
        .route-list, .contract-list { display: grid; gap: 10px; margin: 10px 0; }
        .route-item, .contract-item { padding: 15px; background: white; border: 1px solid #ddd; border-radius: 4px; }
        .route-item h4, .contract-item h4 { margin: 0 0 10px 0; }
        .status-badge { padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
        .status-active { background: #d4edda; color: #155724; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-completed { background: #d1ecf1; color: #0c5460; }
        .status-suspended { background: #f8d7da; color: #721c24; }
        .analytics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 15px 0; }
        .analytics-card { background: white; border: 1px solid #ddd; border-radius: 4px; padding: 15px; }
        .analytics-card h4 { margin: 0 0 10px 0; color: #007bff; }
        .large-number { font-size: 24px; font-weight: bold; color: #28a745; }
        .chart-placeholder { height: 150px; background: #f8f9fa; border: 1px dashed #ddd; display: flex; align-items: center; justify-content: center; color: #6c757d; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Sprint 4: Trade & Economy</h1>
        <p>Prices, routes/tariffs, contracts; early economy indices and analytics base</p>
        
        <!-- Campaign Selection -->
        <div class="demo-section">
          <h3>🎮 Campaign Context</h3>
          <div class="controls">
            <label>Campaign ID:</label>
            <input type="number" id="campaignId" value="1" min="1">
            <button onclick="loadCampaignContext()">Load Campaign</button>
            <span id="campaignInfo" style="margin-left: 20px;">No campaign loaded</span>
          </div>
        </div>
        
        <div class="two-column">
          <!-- Market Prices -->
          <div class="demo-section">
            <h3>💰 Market Prices</h3>
            <div class="controls">
              <button onclick="refreshPrices()">Refresh Prices</button>
              <button onclick="simulateMarketStep()">Simulate Market Step</button>
            </div>
            <div id="pricesGrid" class="price-grid">Loading prices...</div>
          </div>
          
          <!-- Trade Analytics -->
          <div class="demo-section">
            <h3>📊 Trade Analytics</h3>
            <div class="controls">
              <button onclick="loadAnalytics()">Load Analytics</button>
            </div>
            <div id="analyticsGrid" class="analytics-grid">Loading analytics...</div>
          </div>
        </div>
        
        <div class="three-column">
          <!-- Trade Routes -->
          <div class="demo-section">
            <h3>🚢 Trade Routes</h3>
            
            <h4>Create New Route:</h4>
            <div style="margin-bottom: 15px;">
              <input type="text" id="routeName" placeholder="Route Name" style="width: 100%; margin: 5px 0;">
              <input type="text" id="routeOrigin" placeholder="Origin" style="width: 48%; margin: 5px 1% 5px 0;">
              <input type="text" id="routeDestination" placeholder="Destination" style="width: 48%; margin: 5px 0 5px 1%;">
              <select id="routeResources" multiple style="width: 100%; height: 80px; margin: 5px 0;">
                <option value="iron_ore">Iron Ore</option>
                <option value="rare_metals">Rare Metals</option>
                <option value="manufactured_goods">Manufactured Goods</option>
                <option value="energy_cells">Energy Cells</option>
                <option value="food_supplies">Food Supplies</option>
                <option value="luxury_items">Luxury Items</option>
                <option value="tech_components">Technology Components</option>
              </select>
              <input type="number" id="routeDistance" placeholder="Distance" style="width: 48%; margin: 5px 1% 5px 0;">
              <input type="number" id="routeTravelTime" placeholder="Travel Time" style="width: 48%; margin: 5px 0 5px 1%;">
              <input type="number" id="routeCapacity" placeholder="Capacity" style="width: 48%; margin: 5px 1% 5px 0;">
              <input type="number" id="routeTariff" placeholder="Tariff Rate %" style="width: 48%; margin: 5px 0 5px 1%;">
            </div>
            <div class="controls">
              <button onclick="createRoute()" class="success">Create Route</button>
            </div>
            
            <h4>Existing Routes:</h4>
            <div class="controls">
              <button onclick="loadRoutes()">Refresh Routes</button>
            </div>
            <div id="routesList" class="route-list">Loading routes...</div>
          </div>
          
          <!-- Trade Contracts -->
          <div class="demo-section">
            <h3>📄 Trade Contracts</h3>
            
            <h4>Create New Contract:</h4>
            <div style="margin-bottom: 15px;">
              <select id="contractType" style="width: 100%; margin: 5px 0;">
                <option value="buy">Buy Contract</option>
                <option value="sell">Sell Contract</option>
                <option value="exchange">Exchange Contract</option>
              </select>
              <select id="contractResource" style="width: 100%; margin: 5px 0;">
                <option value="iron_ore">Iron Ore</option>
                <option value="rare_metals">Rare Metals</option>
                <option value="manufactured_goods">Manufactured Goods</option>
                <option value="energy_cells">Energy Cells</option>
                <option value="food_supplies">Food Supplies</option>
                <option value="luxury_items">Luxury Items</option>
                <option value="tech_components">Technology Components</option>
              </select>
              <input type="number" id="contractQuantity" placeholder="Quantity" style="width: 48%; margin: 5px 1% 5px 0;">
              <input type="number" id="contractPrice" placeholder="Price per Unit" style="width: 48%; margin: 5px 0 5px 1%;">
              <input type="text" id="contractCounterparty" placeholder="Trading Partner" style="width: 100%; margin: 5px 0;">
            </div>
            <div class="controls">
              <button onclick="createContract()" class="success">Create Contract</button>
            </div>
            
            <h4>Existing Contracts:</h4>
            <div class="controls">
              <button onclick="loadContracts()">Refresh Contracts</button>
              <select id="contractStatusFilter">
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div id="contractsList" class="contract-list">Loading contracts...</div>
          </div>
          
          <!-- Market Simulation -->
          <div class="demo-section">
            <h3>🎯 Market Simulation</h3>
            
            <h4>Price History Chart:</h4>
            <div id="priceChart" class="chart-placeholder">Price trends will appear here</div>
            
            <h4>Market Events:</h4>
            <div class="controls">
              <button onclick="simulateScarcity()">Simulate Scarcity</button>
              <button onclick="simulateAbundance()">Simulate Abundance</button>
              <button onclick="applyTariffs()">Apply Tariffs</button>
            </div>
            
            <h4>Quick Actions:</h4>
            <div class="controls">
              <button onclick="executeRandomTrade()">Execute Random Trade</button>
              <button onclick="completeOldestContract()">Complete Oldest Contract</button>
            </div>
          </div>
        </div>
        
        <!-- Activity Log -->
        <div class="demo-section">
          <h3>📋 Activity Log</h3>
          <div id="log" class="log"></div>
        </div>
      </div>

      <script>
        let currentCampaignId = 1;
        let campaignState = null;
        let currentPrices = {};
        let currentRoutes = [];
        let currentContracts = [];
        
        function log(message, type = 'info') {
          const logDiv = document.getElementById('log');
          const timestamp = new Date().toLocaleTimeString();
          const color = type === 'error' ? 'red' : type === 'success' ? 'green' : type === 'warning' ? 'orange' : 'black';
          logDiv.innerHTML += \`<div style="color: \${color}">[\${timestamp}] \${message}</div>\`;
          logDiv.scrollTop = logDiv.scrollHeight;
        }
        
        async function loadCampaignContext() {
          currentCampaignId = parseInt(document.getElementById('campaignId').value);
          
          try {
            log(\`Loading campaign \${currentCampaignId} context...\`);
            
            const response = await fetch(\`/api/campaigns/\${currentCampaignId}/resume\`);
            const result = await response.json();
            
            if (result.success) {
              campaignState = result.currentState;
              document.getElementById('campaignInfo').textContent = 
                \`Campaign \${currentCampaignId} - Step: \${campaignState.step}, Credits: \${campaignState.resources.credits}\`;
              log(\`✅ Campaign \${currentCampaignId} loaded (Step: \${campaignState.step})\`, 'success');
              
              // Load trade data
              refreshPrices();
              loadRoutes();
              loadContracts();
              loadAnalytics();
            } else {
              log(\`❌ Failed to load campaign: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        async function refreshPrices() {
          try {
            log('Refreshing market prices...');
            
            const response = await fetch(\`/api/trade/prices?campaignId=\${currentCampaignId}\`);
            const result = await response.json();
            
            if (result.success) {
              currentPrices = result.prices;
              displayPrices(result.prices, result.resources);
              log(\`💰 Updated prices for \${Object.keys(result.prices).length} resources\`, 'success');
            } else {
              log(\`❌ Failed to refresh prices: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        function displayPrices(prices, resources) {
          const gridDiv = document.getElementById('pricesGrid');
          
          const pricesHtml = resources.map(resource => {
            const price = prices[resource.id];
            const trendClass = price ? \`trend-\${price.trend}\` : '';
            const trendIcon = price?.trend === 'rising' ? '↗️' : price?.trend === 'falling' ? '↘️' : '➡️';
            
            return \`
              <div class="price-card">
                <h4>\${resource.name}</h4>
                <div class="large-number">\${price ? price.currentPrice.toFixed(2) : resource.basePrice.toFixed(2)} ₢</div>
                <div class="price-trend \${trendClass}">\${trendIcon} \${price?.trend || 'stable'}</div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">
                  Supply: \${price?.supply || 0} | Demand: \${price?.demand || 0}
                </div>
                <div style="font-size: 11px; color: #999;">
                  Base: \${resource.basePrice} ₢ | Volatility: \${(resource.volatility * 100).toFixed(0)}%
                </div>
              </div>
            \`;
          }).join('');
          
          gridDiv.innerHTML = pricesHtml;
        }
        
        async function simulateMarketStep() {
          try {
            log('Simulating market step...');
            
            const response = await fetch(\`/api/campaigns/\${currentCampaignId}/step\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                seed: \`market-step-\${Date.now()}\`
              })
            });
            
            const result = await response.json();
            
            if (result.success) {
              campaignState = result.state;
              document.getElementById('campaignInfo').textContent = 
                \`Campaign \${currentCampaignId} - Step: \${result.step}, Credits: \${campaignState.resources.credits}\`;
              
              log(\`✅ Market step completed (Step: \${result.step})\`, 'success');
              
              // Refresh prices to see changes
              setTimeout(refreshPrices, 1000);
            } else {
              log(\`❌ Market step failed: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        async function createRoute() {
          const name = document.getElementById('routeName').value;
          const origin = document.getElementById('routeOrigin').value;
          const destination = document.getElementById('routeDestination').value;
          const resourcesSelect = document.getElementById('routeResources');
          const resources = Array.from(resourcesSelect.selectedOptions).map(option => option.value);
          const distance = document.getElementById('routeDistance').value;
          const travelTime = document.getElementById('routeTravelTime').value;
          const capacity = document.getElementById('routeCapacity').value;
          const tariffRate = (parseFloat(document.getElementById('routeTariff').value) || 0) / 100;
          
          if (!name || !origin || !destination || resources.length === 0 || !distance || !travelTime || !capacity) {
            log('Please fill in all route fields', 'error');
            return;
          }
          
          try {
            log(\`Creating trade route: \${name}...\`);
            
            const response = await fetch('/api/trade/routes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                campaignId: currentCampaignId,
                name,
                origin,
                destination,
                resources,
                distance: Number(distance),
                travelTime: Number(travelTime),
                capacity: Number(capacity),
                tariffRate
              })
            });
            
            const result = await response.json();
            
            if (result.success) {
              log(\`✅ Route created: \${result.route.name}\`, 'success');
              
              // Clear form
              document.getElementById('routeName').value = '';
              document.getElementById('routeOrigin').value = '';
              document.getElementById('routeDestination').value = '';
              document.getElementById('routeResources').selectedIndex = -1;
              document.getElementById('routeDistance').value = '';
              document.getElementById('routeTravelTime').value = '';
              document.getElementById('routeCapacity').value = '';
              document.getElementById('routeTariff').value = '';
              
              loadRoutes();
            } else {
              log(\`❌ Failed to create route: \${result.message || result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        async function loadRoutes() {
          try {
            const response = await fetch(\`/api/trade/routes?campaignId=\${currentCampaignId}\`);
            const result = await response.json();
            
            if (result.success) {
              currentRoutes = result.routes;
              displayRoutes(result.routes);
              log(\`🚢 Loaded \${result.routes.length} trade routes\`);
            } else {
              log(\`❌ Failed to load routes: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        function displayRoutes(routes) {
          const listDiv = document.getElementById('routesList');
          
          if (routes.length === 0) {
            listDiv.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No routes found</div>';
            return;
          }
          
          const routesHtml = routes.map(route => \`
            <div class="route-item">
              <h4>\${route.name} <span class="status-badge status-\${route.status}">\${route.status}</span></h4>
              <p><strong>\${route.origin}</strong> → <strong>\${route.destination}</strong></p>
              <p><strong>Resources:</strong> \${route.resources.join(', ')}</p>
              <p><strong>Distance:</strong> \${route.distance} units | <strong>Travel Time:</strong> \${route.travelTime} steps | <strong>Capacity:</strong> \${route.capacity}</p>
              <p><strong>Tariff:</strong> \${(route.tariffRate * 100).toFixed(1)}%</p>
              <div style="display: flex; gap: 5px; margin-top: 10px;">
                \${route.status === 'active' ? \`<button onclick="updateRouteStatus('\${route.id}', 'suspended')" style="padding: 5px 10px; font-size: 12px;">Suspend</button>\` : ''}
                \${route.status === 'suspended' ? \`<button onclick="updateRouteStatus('\${route.id}', 'active')" style="padding: 5px 10px; font-size: 12px;">Reactivate</button>\` : ''}
              </div>
            </div>
          \`).join('');
          
          listDiv.innerHTML = routesHtml;
        }
        
        async function createContract() {
          const type = document.getElementById('contractType').value;
          const resourceId = document.getElementById('contractResource').value;
          const quantity = document.getElementById('contractQuantity').value;
          const pricePerUnit = document.getElementById('contractPrice').value;
          const counterparty = document.getElementById('contractCounterparty').value;
          
          if (!type || !resourceId || !quantity || !pricePerUnit || !counterparty) {
            log('Please fill in all contract fields', 'error');
            return;
          }
          
          try {
            log(\`Creating \${type} contract for \${quantity} \${resourceId}...\`);
            
            const response = await fetch('/api/trade/contracts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                campaignId: currentCampaignId,
                type,
                resourceId,
                quantity: Number(quantity),
                pricePerUnit: Number(pricePerUnit),
                counterparty,
                terms: {
                  paymentMethod: 'credits',
                  deliveryTerms: 'immediate'
                }
              })
            });
            
            const result = await response.json();
            
            if (result.success) {
              log(\`✅ Contract created: \${result.contract.type} \${result.contract.quantity} \${result.resource.name}\`, 'success');
              
              // Clear form
              document.getElementById('contractQuantity').value = '';
              document.getElementById('contractPrice').value = '';
              document.getElementById('contractCounterparty').value = '';
              
              loadContracts();
            } else {
              log(\`❌ Failed to create contract: \${result.message || result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        async function loadContracts() {
          try {
            const statusFilter = document.getElementById('contractStatusFilter').value;
            const url = \`/api/trade/contracts?campaignId=\${currentCampaignId}\${statusFilter ? '&status=' + statusFilter : ''}\`;
            
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success) {
              currentContracts = result.contracts;
              displayContracts(result.contracts);
              log(\`📄 Loaded \${result.contracts.length} trade contracts\`);
            } else {
              log(\`❌ Failed to load contracts: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        function displayContracts(contracts) {
          const listDiv = document.getElementById('contractsList');
          
          if (contracts.length === 0) {
            listDiv.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No contracts found</div>';
            return;
          }
          
          const contractsHtml = contracts.map(contract => \`
            <div class="contract-item">
              <h4>\${contract.type.toUpperCase()} \${contract.quantity} \${contract.resource.name} <span class="status-badge status-\${contract.status}">\${contract.status}</span></h4>
              <p><strong>Counterparty:</strong> \${contract.counterparty}</p>
              <p><strong>Price:</strong> \${contract.pricePerUnit} ₢/unit | <strong>Total Value:</strong> \${contract.totalValue} ₢</p>
              <p><strong>Terms:</strong> \${contract.terms.paymentMethod}, \${contract.terms.deliveryTerms}</p>
              <div style="display: flex; gap: 5px; margin-top: 10px;">
                \${contract.status === 'pending' ? \`<button onclick="updateContractStatus('\${contract.id}', 'active')" style="padding: 5px 10px; font-size: 12px;">Activate</button>\` : ''}
                \${contract.status === 'active' ? \`<button onclick="updateContractStatus('\${contract.id}', 'completed', true)" style="padding: 5px 10px; font-size: 12px;" class="success">Complete</button>\` : ''}
                \${contract.status === 'pending' || contract.status === 'active' ? \`<button onclick="updateContractStatus('\${contract.id}', 'cancelled')" style="padding: 5px 10px; font-size: 12px;" class="danger">Cancel</button>\` : ''}
              </div>
            </div>
          \`).join('');
          
          listDiv.innerHTML = contractsHtml;
        }
        
        async function loadAnalytics() {
          try {
            log('Loading trade analytics...');
            
            const response = await fetch(\`/api/trade/indices?campaignId=\${currentCampaignId}\`);
            const result = await response.json();
            
            if (result.success) {
              displayAnalytics(result.analytics, result.stats);
              log(\`📊 Trade analytics loaded\`, 'success');
            } else {
              log(\`❌ Failed to load analytics: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        function displayAnalytics(analytics, stats) {
          const gridDiv = document.getElementById('analyticsGrid');
          
          gridDiv.innerHTML = \`
            <div class="analytics-card">
              <h4>Trade Volume</h4>
              <div class="large-number">\${analytics.totalTradeVolume.toLocaleString()} ₢</div>
              <div style="font-size: 12px; color: #666;">Total completed trades</div>
            </div>
            
            <div class="analytics-card">
              <h4>Trade Balance</h4>
              <div class="large-number" style="color: \${analytics.tradeBalance >= 0 ? '#28a745' : '#dc3545'}">
                \${analytics.tradeBalance >= 0 ? '+' : ''}\${analytics.tradeBalance.toLocaleString()} ₢
              </div>
              <div style="font-size: 12px; color: #666;">Exports minus imports</div>
            </div>
            
            <div class="analytics-card">
              <h4>Price Indices</h4>
              <div>Raw Materials: <strong>\${analytics.priceIndices.rawMaterialsIndex.toFixed(2)}</strong></div>
              <div>Manufactured: <strong>\${analytics.priceIndices.manufacturedIndex.toFixed(2)}</strong></div>
              <div>Overall Index: <strong>\${analytics.priceIndices.overallIndex.toFixed(2)}</strong></div>
            </div>
            
            <div class="analytics-card">
              <h4>Active Contracts</h4>
              <div class="large-number">\${analytics.activeContracts}</div>
              <div style="font-size: 12px; color: #666;">Pending + Active</div>
            </div>
            
            <div class="analytics-card">
              <h4>Trade Routes</h4>
              <div class="large-number">\${stats.activeRoutes}/\${stats.totalRoutes}</div>
              <div style="font-size: 12px; color: #666;">Active / Total routes</div>
            </div>
            
            <div class="analytics-card">
              <h4>Completed Contracts</h4>
              <div class="large-number">\${analytics.completedContracts}</div>
              <div style="font-size: 12px; color: #666;">Successfully executed</div>
            </div>
          \`;
        }
        
        async function updateContractStatus(contractId, status, executeContract = false) {
          try {
            log(\`Updating contract \${contractId} to \${status}...\`);
            
            const response = await fetch(\`/api/trade/contracts/\${contractId}/status\`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status, executeContract })
            });
            
            const result = await response.json();
            
            if (result.success) {
              log(\`✅ Contract updated to \${status}\`, 'success');
              loadContracts();
              if (executeContract) {
                loadCampaignContext(); // Refresh campaign state
              }
            } else {
              log(\`❌ Failed to update contract: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        async function updateRouteStatus(routeId, status) {
          try {
            log(\`Updating route \${routeId} to \${status}...\`);
            
            const response = await fetch(\`/api/trade/routes/\${routeId}/status\`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status })
            });
            
            const result = await response.json();
            
            if (result.success) {
              log(\`✅ Route updated to \${status}\`, 'success');
              loadRoutes();
            } else {
              log(\`❌ Failed to update route: \${result.error}\`, 'error');
            }
          } catch (error) {
            log(\`❌ Request failed: \${error.message}\`, 'error');
          }
        }
        
        async function executeRandomTrade() {
          const resources = ['iron_ore', 'rare_metals', 'manufactured_goods', 'energy_cells'];
          const partners = ['Alpha Station', 'Beta Colony', 'Gamma Outpost', 'Delta Mining Corp'];
          const types = ['buy', 'sell'];
          
          const resourceId = resources[Math.floor(Math.random() * resources.length)];
          const counterparty = partners[Math.floor(Math.random() * partners.length)];
          const type = types[Math.floor(Math.random() * types.length)];
          const quantity = Math.floor(Math.random() * 100) + 10;
          const pricePerUnit = Math.floor(Math.random() * 50) + 10;
          
          document.getElementById('contractType').value = type;
          document.getElementById('contractResource').value = resourceId;
          document.getElementById('contractQuantity').value = quantity;
          document.getElementById('contractPrice').value = pricePerUnit;
          document.getElementById('contractCounterparty').value = counterparty;
          
          await createContract();
        }
        
        async function completeOldestContract() {
          const pendingContracts = currentContracts.filter(c => c.status === 'pending' || c.status === 'active');
          if (pendingContracts.length === 0) {
            log('No pending contracts to complete', 'warning');
            return;
          }
          
          const oldest = pendingContracts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0];
          await updateContractStatus(oldest.id, 'completed', true);
        }
        
        // Initialize
        log('🚀 Sprint 4 Trade & Economy Demo initialized');
        loadCampaignContext();
      </script>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4018;

if (process.env.DEMO_START === '1') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Sprint 4 Demo Server running on http://localhost:${PORT}`);
    console.log(`💰 Trade & Economy Demo: http://localhost:${PORT}/demo/trade`);
  });
}

export default app;
