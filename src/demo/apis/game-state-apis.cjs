// Game state APIs - placeholder for now
const { galaxyMapGameState } = require('../game-state/galaxy-map-state.cjs');

function setupGameStateAPIs(app) {
  // Initialize galaxy map state
  console.log('Galaxy Map system initialized with', galaxyMapGameState.starSystems.length, 'star systems');
  
  // Placeholder game state endpoints
  app.get('/api/game/state', (req, res) => {
    res.json({ state: {}, message: 'Game state APIs not yet extracted' });
  });
}

module.exports = { setupGameStateAPIs };
