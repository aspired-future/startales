const { getDemographicsDemo } = require('./demographics-demo.cjs');
const { getMigrationDemo } = require('./migration-demo.cjs');
const { getCitiesDemo } = require('./cities-demo.cjs');
const { getPolicyDemo } = require('./policy-demo.cjs');
const { getTradeDemo } = require('./trade-demo.cjs');
const { getWitterDemo } = require('./witter-demo.cjs');
// Cabinet demo merged into Communication Hub
// const { getCabinetDemo } = require('./cabinet-demo.cjs');
const { getCommunicationDemo } = require('./communication-demo.cjs');
const { getGalaxyMapDemo } = require('./galaxy-map-demo.cjs');
const { getConquestDemo } = require('./conquest-demo.cjs');
const { getMainHUD } = require('./main-hud.cjs');

function setupDemoPages(app) {
  // Main Command Center HUD
  app.get('/demo/command-center', (req, res) => {
    res.type('html').send(getMainHUD());
  });

  // Demo Hub page
  app.get('/demo/hud', (req, res) => {
    res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Startales Demo Hub</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 20px; background: #0a0a0a; color: #e0e0e0; margin: 0; }
      .container { max-width: 1200px; margin: 0 auto; }
      .header { text-align: center; margin-bottom: 40px; }
      .demo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
      .demo-card { background: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #333; text-align: center; }
      .demo-card:hover { border-color: #4ecdc4; }
      .demo-link { color: #4ecdc4; text-decoration: none; font-weight: bold; }
      .demo-link:hover { color: #44a08d; }
      .demo-description { color: #ccc; margin: 10px 0; }
      .status { padding: 4px 8px; border-radius: 4px; font-size: 0.8em; }
      .status.working { background: #22c55e; color: #000; }
      .status.partial { background: #fbbf24; color: #000; }
      .status.placeholder { background: #ef4444; color: #fff; }
      h1 { color: #4ecdc4; }
      h2 { color: #fbbf24; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🌌 Startales Demo Hub</h1>
        <p>Comprehensive galactic civilization builder demos and systems</p>
      </div>

      <div class="demo-grid">
        <div class="demo-card" style="border: 2px solid #4ecdc4; background: linear-gradient(135deg, #1a1a1a, #2a2a2a);">
          <h2>🌌 MAIN COMMAND CENTER</h2>
          <div class="status working">✅ FULLY INTEGRATED</div>
          <div class="demo-description">Complete galactic civilization management HUD with all 40+ systems integrated into a unified command interface</div>
          <a href="/demo/command-center" class="demo-link" style="font-size: 1.2em;">🚀 LAUNCH COMMAND CENTER →</a>
        </div>

        <div class="demo-card">
          <h2>📊 Demographics Deep Dive</h2>
          <div class="status working">✅ WORKING</div>
          <div class="demo-description">Advanced population analytics, demographic trends, social mobility tracking, and population projection modeling</div>
          <a href="/demo/demographics" class="demo-link">Launch Demographics Demo →</a>
        </div>

        <div class="demo-card">
          <h2>🏙️ Cities Management</h2>
          <div class="status working">✅ WORKING</div>
          <div class="demo-description">Urban planning, infrastructure development, city growth mechanics, and autopilot systems</div>
          <a href="/demo/cities" class="demo-link">Launch Cities Demo →</a>
        </div>

        <div class="demo-card">
          <h2>🚀 Migration System</h2>
          <div class="status working">✅ WORKING</div>
          <div class="demo-description">Inter-civilization migration, economic drivers, cultural assimilation mechanics, and policy controls</div>
          <a href="/demo/migration" class="demo-link">Launch Migration Demo →</a>
        </div>

        <div class="demo-card">
          <h2>🐦 Witter Social Network</h2>
          <div class="status working">✅ WORKING</div>
          <div class="demo-description">AI-powered social network with dynamic content generation and character interactions</div>
          <a href="/demo/witter" class="demo-link">Launch Witter Demo →</a>
        </div>

        <div class="demo-card">
          <h2>📋 Policy System</h2>
          <div class="status working">✅ WORKING</div>
          <div class="demo-description">AI-powered policy generation, expert advisors, and governance systems</div>
          <a href="/demo/policies" class="demo-link">Launch Policy Demo →</a>
        </div>

        <div class="demo-card">
          <h2>💬 Communication Hub</h2>
          <div class="status placeholder">⚠️ PLACEHOLDER</div>
          <div class="demo-description">Player-to-player voice/text communication, alliance messaging</div>
          <a href="/demo/communication" class="demo-link">Launch Communication Demo →</a>
        </div>

        <div class="demo-card">
          <h2>🔬 Technology Research</h2>
          <div class="status placeholder">⚠️ PLACEHOLDER</div>
          <div class="demo-description">Research trees, technological advancement, innovation systems</div>
          <a href="/demo/technology" class="demo-link">Launch Technology Demo →</a>
        </div>

        <div class="demo-card">
          <h2>💰 Trade System</h2>
          <div class="status working">✅ WORKING</div>
          <div class="demo-description">Galactic trade routes, resource management, economic systems</div>
          <a href="/demo/trade" class="demo-link">Launch Trade Demo →</a>
        </div>

        <div class="demo-card">
          <h2>🌌 Galaxy Map</h2>
          <div class="status working">✅ WORKING</div>
          <div class="demo-description">Interactive 3D galaxy visualization with zoom levels, layers, and real-time updates</div>
          <a href="/demo/galaxy-map" class="demo-link">Launch Galaxy Map →</a>
        </div>

        <div class="demo-card">
          <h2>🚀 Conquest & Merge System</h2>
          <div class="status working">✅ WORKING</div>
          <div class="demo-description">Planetary conquest, discovery, and civilization integration management system</div>
          <a href="/demo/conquest" class="demo-link">Launch Conquest Demo →</a>
        </div>

                    <div class="demo-card">
              <h2>🌌 Communication Hub</h2>
              <div class="status working">✅ WORKING</div>
              <div class="demo-description">Real-time communication, cabinet meetings, character management, group conversations, universal translation</div>
              <a href="/demo/communication" class="demo-link">Launch Communication Demo →</a>
            </div>

        <div class="demo-card">
          <h2>🎯 API Health Monitor</h2>
          <div class="status working">✅ WORKING</div>
          <div class="demo-description">Real-time API health monitoring and system status dashboard</div>
          <a href="/api/health" class="demo-link">View API Health →</a>
        </div>
      </div>

      <div style="margin-top: 40px; text-align: center;">
        <p style="color: #666;">
          <strong>Legend:</strong> 
          <span class="status working">✅ WORKING</span> = Fully functional | 
          <span class="status partial">⚠️ PARTIAL</span> = Basic functionality | 
          <span class="status placeholder">⚠️ PLACEHOLDER</span> = Not yet extracted
        </p>
      </div>
    </div>
  </body>
</html>`);
  });

  // Demographics demo page
  app.get('/demo/demographics', (req, res) => {
    res.type('html').send(getDemographicsDemo());
  });

  // Migration demo page
  app.get('/demo/migration', (req, res) => {
    res.type('html').send(getMigrationDemo());
  });

  // Cities demo page
  app.get('/demo/cities', (req, res) => {
    res.type('html').send(getCitiesDemo());
  });

  // Policy demo page
  app.get('/demo/policies', (req, res) => {
    res.type('html').send(getPolicyDemo());
  });

  // Trade demo page
  app.get('/demo/trade', (req, res) => {
    res.type('html').send(getTradeDemo());
  });

  // Witter demo page
  app.get('/demo/witter', (req, res) => {
    res.type('html').send(getWitterDemo());
  });

  // Cabinet functionality merged into Communication Hub
  // app.get('/demo/cabinet', (req, res) => {
  //   res.type('html').send(getCabinetDemo());
  // });

  // Communication demo page
  app.get('/demo/communication', (req, res) => {
    res.type('html').send(getCommunicationDemo());
  });

  // Galaxy Map demo page
  app.get('/demo/galaxy-map', (req, res) => {
    res.type('html').send(getGalaxyMapDemo());
  });

  // Conquest demo page
  app.get('/demo/conquest', (req, res) => {
    res.type('html').send(getConquestDemo());
  });

  // Placeholder demo pages
  const placeholderDemos = [
    'technology', 'simulation', 'population',
    'professions', 'businesses', 'legal', 'security'
  ];

  placeholderDemos.forEach(demo => {
    app.get(`/demo/${demo}`, (req, res) => {
      res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${demo.charAt(0).toUpperCase() + demo.slice(1)} Demo - Placeholder</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 20px; background: #0a0a0a; color: #e0e0e0; margin: 0; text-align: center; }
      .container { max-width: 800px; margin: 0 auto; padding-top: 100px; }
      .placeholder { background: #1a1a1a; padding: 40px; border-radius: 8px; border: 1px solid #333; }
      .btn { background: #4ecdc4; color: #0a0a0a; padding: 10px 20px; border: none; border-radius: 4px; text-decoration: none; display: inline-block; margin-top: 20px; }
      .btn:hover { background: #44a08d; }
      h1 { color: #4ecdc4; }
      h2 { color: #fbbf24; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="placeholder">
        <h1>🚧 ${demo.charAt(0).toUpperCase() + demo.slice(1)} Demo</h1>
        <h2>Coming Soon</h2>
        <p>This demo is currently being extracted from the comprehensive demo server.</p>
        <p>The ${demo} system will be available once the refactoring is complete.</p>
        <a href="/demo/hud" class="btn">← Back to Demo Hub</a>
      </div>
    </div>
  </body>
</html>`);
    });
  });
}

module.exports = { setupDemoPages };
