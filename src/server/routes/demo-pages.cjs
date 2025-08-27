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
const { getIntegratedWittyGalaxyHUD } = require('../../../temp_dev/integrated_witty_galaxy_hud.js');

function setupDemoPages(app) {
  // Main Command Center HUD
  app.get('/demo/command-center', (req, res) => {
    res.type('html').send(getMainHUD());
  });

  // Integrated LivelyGalaxy.com HUD (New Enhanced Version)
  app.get('/demo/witty-galaxy-hud', (req, res) => {
    res.type('html').send(getIntegratedWittyGalaxyHUD());
  });

  // Main HUD route (redirect to integrated version)
  app.get('/hud', (req, res) => {
    res.redirect('/demo/witty-galaxy-hud');
  });

  // Demo Hub page (removed - no longer needed)

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
        <a href="/demo/command-center" class="btn">← Back to Command Center</a>
      </div>
    </div>
  </body>
</html>`);
    });
  });
}

module.exports = { setupDemoPages };
