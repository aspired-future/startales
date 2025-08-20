const express = require('express');
const path = require('path');

// Import demo modules
const { setupGameStateAPIs } = require('./apis/game-state-apis.cjs');
const { setupDemographicsAPIs } = require('./apis/demographics-apis.cjs');
const { setupMigrationAPIs } = require('./apis/migration-apis.cjs');
const { setupCitiesAPIs } = require('./apis/cities-apis.cjs');
const { setupPolicyAPIs } = require('./apis/policy-apis.cjs');
const { setupTradeAPIs } = require('./apis/trade-apis.cjs');
const { setupWitterAPIs } = require('./apis/witter-apis.cjs');
// Cabinet functionality merged into Communication Hub
// const { setupCabinetAPIs } = require('./apis/cabinet-apis.cjs');
const { setupCommunicationAPIs } = require('./apis/communication-apis.cjs');
const { setupGalaxyMapAPIs } = require('./apis/galaxy-map-apis.cjs');
const { setupConquestAPIs } = require('./apis/conquest-apis.cjs');
const { setupOtherAPIs } = require('./apis/other-apis.cjs');

// Import demo pages
const { setupDemoPages } = require('./pages/demo-pages.cjs');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Setup all API endpoints
setupGameStateAPIs(app);
setupDemographicsAPIs(app);
setupMigrationAPIs(app);
setupCitiesAPIs(app);
setupPolicyAPIs(app);
setupTradeAPIs(app);
setupWitterAPIs(app);
// setupCabinetAPIs(app); // Merged into Communication Hub
setupCommunicationAPIs(app);
setupGalaxyMapAPIs(app);
setupConquestAPIs(app);
setupOtherAPIs(app);

// Setup all demo pages
setupDemoPages(app);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const endpoints = [
    // Demographics
    { name: 'Demographics Population', endpoint: '/api/demographics/population', method: 'GET', category: 'Demographics' },
    { name: 'Demographics Trends', endpoint: '/api/demographics/trends', method: 'GET', category: 'Demographics' },
    { name: 'Demographics Mobility', endpoint: '/api/demographics/mobility', method: 'GET', category: 'Demographics' },
    { name: 'Demographics Projections', endpoint: '/api/demographics/projections', method: 'GET', category: 'Demographics' },
    { name: 'Demographics Comparative', endpoint: '/api/demographics/comparative', method: 'GET', category: 'Demographics' },
    { name: 'Demographics Simulation', endpoint: '/api/demographics/simulate', method: 'POST', category: 'Demographics' },
    
    // Migration
    { name: 'Migration Flows', endpoint: '/api/migration/flows', method: 'GET', category: 'Demographics' },
    { name: 'Migration Policies', endpoint: '/api/migration/policies', method: 'GET', category: 'Demographics' },
    { name: 'Migration Events', endpoint: '/api/migration/events', method: 'GET', category: 'Demographics' },
    { name: 'Migration Simulation', endpoint: '/api/migration/simulate', method: 'POST', category: 'Demographics' },
    
    // Cities
    { name: 'Cities Management', endpoint: '/api/cities', method: 'GET', category: 'Infrastructure' },
    { name: 'Cities Autopilot', endpoint: '/api/cities/autopilot/settings', method: 'GET', category: 'Infrastructure' },
    { name: 'Cities Overview', endpoint: '/api/cities/galactic-overview', method: 'GET', category: 'Infrastructure' },
    
    // Witter
    { name: 'Witter Posts', endpoint: '/api/witter/posts', method: 'GET', category: 'Social' },
    { name: 'Witter Filters', endpoint: '/api/witter/filters', method: 'GET', category: 'Social' },
    
    // Galaxy Map
    { name: 'Galaxy Overview', endpoint: '/api/galaxy/overview', method: 'GET', category: 'Galaxy' },
    { name: 'Galaxy Systems', endpoint: '/api/galaxy/systems', method: 'GET', category: 'Galaxy' },
    { name: 'Galaxy Civilizations', endpoint: '/api/galaxy/civilizations', method: 'GET', category: 'Galaxy' },
    { name: 'Galaxy Trade Routes', endpoint: '/api/galaxy/trade-routes', method: 'GET', category: 'Galaxy' },
    { name: 'Galaxy Fleets', endpoint: '/api/galaxy/fleets', method: 'GET', category: 'Galaxy' },
    
    // Other systems
    { name: 'Visual Assets', endpoint: '/api/visual/assets', method: 'GET', category: 'Graphics' },
    { name: 'Communication Hub', endpoint: '/api/communication/status', method: 'GET', category: 'Communication' },
    { name: 'Policy System', endpoint: '/api/policies', method: 'GET', category: 'Governance' },
    { name: 'Trade System', endpoint: '/api/trade/routes', method: 'GET', category: 'Economy' },
    { name: 'Legal System', endpoint: '/api/legal/laws', method: 'GET', category: 'Legal' }
  ];

  let systemStats = {
    totalEndpoints: endpoints.length,
    healthyEndpoints: 0,
    failedEndpoints: 0,
    categories: {}
  };

  const results = [];

  for (const endpoint of endpoints) {
    try {
      const startTime = Date.now();
      const testUrl = `http://localhost:${PORT}${endpoint.endpoint}`;
      
      let response;
      if (endpoint.method === 'POST') {
        response = await fetch(testUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
      } else {
        response = await fetch(testUrl);
      }
      
      const responseTime = Date.now() - startTime;
      const isHealthy = response.ok;
      
      if (isHealthy) {
        systemStats.healthyEndpoints++;
      } else {
        systemStats.failedEndpoints++;
      }
      
      if (!systemStats.categories[endpoint.category]) {
        systemStats.categories[endpoint.category] = { healthy: 0, failed: 0 };
      }
      
      if (isHealthy) {
        systemStats.categories[endpoint.category].healthy++;
      } else {
        systemStats.categories[endpoint.category].failed++;
      }
      
      results.push({
        name: endpoint.name,
        endpoint: endpoint.endpoint,
        method: endpoint.method,
        category: endpoint.category,
        status: isHealthy ? 'healthy' : 'failed',
        responseTime: responseTime,
        statusCode: response.status
      });
    } catch (error) {
      systemStats.failedEndpoints++;
      
      if (!systemStats.categories[endpoint.category]) {
        systemStats.categories[endpoint.category] = { healthy: 0, failed: 0 };
      }
      systemStats.categories[endpoint.category].failed++;
      
      results.push({
        name: endpoint.name,
        endpoint: endpoint.endpoint,
        method: endpoint.method,
        category: endpoint.category,
        status: 'error',
        error: error.message
      });
    }
  }

  res.json({
    timestamp: new Date().toISOString(),
    systemStats,
    endpoints: results
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Demo server listening on http://localhost:${PORT}`);
  console.log('Available demos:');
  console.log(`  HUD:         http://localhost:${PORT}/demo/hud`);
  console.log(`  Demographics: http://localhost:${PORT}/demo/demographics`);
  console.log(`  Cities:      http://localhost:${PORT}/demo/cities`);
  console.log(`  Migration:   http://localhost:${PORT}/demo/migration`);
  console.log(`  Witter:      http://localhost:${PORT}/demo/witter`);
  console.log(`  Galaxy Map:  http://localhost:${PORT}/demo/galaxy-map`);
  console.log(`  API Health:  http://localhost:${PORT}/demo/api-health`);
});

module.exports = app;
