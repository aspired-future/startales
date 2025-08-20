// Galaxy Map API Endpoints
// Provides REST API for galaxy map data and interactions

const { galaxyMapGameState, galaxyMapUtils } = require('../game-state/galaxy-map-state.cjs');

function setupGalaxyMapAPIs(app) {
  console.log('Setting up Galaxy Map APIs...');

  // === GALAXY OVERVIEW ENDPOINTS ===

  // Get galaxy overview data
  app.get('/api/galaxy/overview', (req, res) => {
    try {
      const stats = galaxyMapUtils.getGalaxyStatistics();
      res.json({
        success: true,
        data: {
          galaxy: galaxyMapGameState.galaxy,
          config: galaxyMapGameState.config,
          statistics: stats,
          viewState: galaxyMapGameState.viewState
        }
      });
    } catch (error) {
      console.error('Error getting galaxy overview:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get galaxy overview',
        details: error.message
      });
    }
  });

  // === STAR SYSTEMS ENDPOINTS ===

  // Get all star systems
  app.get('/api/galaxy/systems', (req, res) => {
    try {
      const { range, center } = req.query;
      let systems = galaxyMapGameState.starSystems;

      // Filter by range if specified
      if (range && center) {
        const rangeValue = parseFloat(range);
        systems = galaxyMapUtils.getSystemsInRange(center, rangeValue);
        // Include the center system
        const centerSystem = galaxyMapUtils.getSystem(center);
        if (centerSystem) {
          systems.unshift(centerSystem);
        }
      }

      res.json({
        success: true,
        data: systems,
        count: systems.length
      });
    } catch (error) {
      console.error('Error getting star systems:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get star systems',
        details: error.message
      });
    }
  });

  // Get specific star system
  app.get('/api/galaxy/systems/:systemId', (req, res) => {
    try {
      const { systemId } = req.params;
      const system = galaxyMapUtils.getSystem(systemId);
      
      if (!system) {
        return res.status(404).json({
          success: false,
          error: 'Star system not found'
        });
      }

      // Get additional data for the system
      const tradeRoutes = galaxyMapUtils.getTradeRoutesForSystem(systemId);
      const fleets = galaxyMapUtils.getFleetsInSystem(systemId);
      const owner = system.planets.length > 0 && system.planets[0].owner 
        ? galaxyMapUtils.getCivilization(system.planets[0].owner)
        : null;

      res.json({
        success: true,
        data: {
          ...system,
          tradeRoutes,
          fleets,
          owner
        }
      });
    } catch (error) {
      console.error('Error getting star system:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get star system',
        details: error.message
      });
    }
  });

  // === CIVILIZATIONS ENDPOINTS ===

  // Get all civilizations
  app.get('/api/galaxy/civilizations', (req, res) => {
    try {
      res.json({
        success: true,
        data: galaxyMapGameState.civilizations,
        count: galaxyMapGameState.civilizations.length
      });
    } catch (error) {
      console.error('Error getting civilizations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get civilizations',
        details: error.message
      });
    }
  });

  // Get specific civilization
  app.get('/api/galaxy/civilizations/:civId', (req, res) => {
    try {
      const { civId } = req.params;
      const civilization = galaxyMapUtils.getCivilization(civId);
      
      if (!civilization) {
        return res.status(404).json({
          success: false,
          error: 'Civilization not found'
        });
      }

      // Get territory systems
      const territorySystems = civilization.territory.map(systemId => 
        galaxyMapUtils.getSystem(systemId)
      ).filter(Boolean);

      res.json({
        success: true,
        data: {
          ...civilization,
          territorySystems
        }
      });
    } catch (error) {
      console.error('Error getting civilization:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get civilization',
        details: error.message
      });
    }
  });

  // === TRADE ROUTES ENDPOINTS ===

  // Get all trade routes
  app.get('/api/galaxy/trade-routes', (req, res) => {
    try {
      const { system } = req.query;
      let routes = galaxyMapGameState.tradeRoutes;

      // Filter by system if specified
      if (system) {
        routes = galaxyMapUtils.getTradeRoutesForSystem(system);
      }

      res.json({
        success: true,
        data: routes,
        count: routes.length
      });
    } catch (error) {
      console.error('Error getting trade routes:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get trade routes',
        details: error.message
      });
    }
  });

  // === MILITARY FLEETS ENDPOINTS ===

  // Get all fleets
  app.get('/api/galaxy/fleets', (req, res) => {
    try {
      const { system, owner } = req.query;
      let fleets = galaxyMapGameState.fleets;

      // Filter by system if specified
      if (system) {
        fleets = fleets.filter(fleet => fleet.currentSystem === system);
      }

      // Filter by owner if specified
      if (owner) {
        fleets = fleets.filter(fleet => fleet.owner === owner);
      }

      res.json({
        success: true,
        data: fleets,
        count: fleets.length
      });
    } catch (error) {
      console.error('Error getting fleets:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get fleets',
        details: error.message
      });
    }
  });

  // Get specific fleet
  app.get('/api/galaxy/fleets/:fleetId', (req, res) => {
    try {
      const { fleetId } = req.params;
      const fleet = galaxyMapGameState.fleets.find(f => f.id === fleetId);
      
      if (!fleet) {
        return res.status(404).json({
          success: false,
          error: 'Fleet not found'
        });
      }

      // Get owner civilization
      const owner = galaxyMapUtils.getCivilization(fleet.owner);
      const currentSystem = fleet.currentSystem !== 'transit' 
        ? galaxyMapUtils.getSystem(fleet.currentSystem)
        : null;

      res.json({
        success: true,
        data: {
          ...fleet,
          ownerCivilization: owner,
          systemData: currentSystem
        }
      });
    } catch (error) {
      console.error('Error getting fleet:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get fleet',
        details: error.message
      });
    }
  });

  // === POINTS OF INTEREST ENDPOINTS ===

  // Get all points of interest
  app.get('/api/galaxy/points-of-interest', (req, res) => {
    try {
      const { type, discovered } = req.query;
      let pois = galaxyMapGameState.pointsOfInterest;

      // Filter by type if specified
      if (type) {
        pois = pois.filter(poi => poi.type === type);
      }

      // Filter by discovered status if specified
      if (discovered !== undefined) {
        const isDiscovered = discovered === 'true';
        pois = pois.filter(poi => poi.discovered === isDiscovered);
      }

      res.json({
        success: true,
        data: pois,
        count: pois.length
      });
    } catch (error) {
      console.error('Error getting points of interest:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get points of interest',
        details: error.message
      });
    }
  });

  // === EVENTS ENDPOINTS ===

  // Get active events
  app.get('/api/galaxy/events', (req, res) => {
    try {
      const { type, system } = req.query;
      let events = galaxyMapGameState.activeEvents;

      // Filter by type if specified
      if (type) {
        events = events.filter(event => event.type === type);
      }

      // Filter by affected system if specified
      if (system) {
        events = events.filter(event => 
          event.affectedSystems && event.affectedSystems.includes(system)
        );
      }

      res.json({
        success: true,
        data: events,
        count: events.length
      });
    } catch (error) {
      console.error('Error getting events:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get events',
        details: error.message
      });
    }
  });

  // === VIEW STATE ENDPOINTS ===

  // Get current view state
  app.get('/api/galaxy/view-state', (req, res) => {
    try {
      res.json({
        success: true,
        data: galaxyMapGameState.viewState
      });
    } catch (error) {
      console.error('Error getting view state:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get view state',
        details: error.message
      });
    }
  });

  // Update view state
  app.post('/api/galaxy/view-state', (req, res) => {
    try {
      const updates = req.body;
      galaxyMapUtils.updateViewState(updates);
      
      res.json({
        success: true,
        data: galaxyMapGameState.viewState,
        message: 'View state updated successfully'
      });
    } catch (error) {
      console.error('Error updating view state:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update view state',
        details: error.message
      });
    }
  });

  // === LAYER MANAGEMENT ENDPOINTS ===

  // Update layer visibility
  app.post('/api/galaxy/layers/visibility', (req, res) => {
    try {
      const { layer, visible } = req.body;
      
      if (!layer) {
        return res.status(400).json({
          success: false,
          error: 'Layer name is required'
        });
      }

      const currentLayers = galaxyMapGameState.viewState.visibleLayers;
      
      if (visible && !currentLayers.includes(layer)) {
        currentLayers.push(layer);
      } else if (!visible && currentLayers.includes(layer)) {
        const index = currentLayers.indexOf(layer);
        currentLayers.splice(index, 1);
      }

      res.json({
        success: true,
        data: {
          visibleLayers: currentLayers
        },
        message: 'Layer visibility updated'
      });
    } catch (error) {
      console.error('Error updating layer visibility:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update layer visibility',
        details: error.message
      });
    }
  });

  // Update layer opacity
  app.post('/api/galaxy/layers/opacity', (req, res) => {
    try {
      const { layer, opacity } = req.body;
      
      if (!layer || opacity === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Layer name and opacity are required'
        });
      }

      if (opacity < 0 || opacity > 1) {
        return res.status(400).json({
          success: false,
          error: 'Opacity must be between 0 and 1'
        });
      }

      galaxyMapGameState.viewState.layerOpacity[layer] = opacity;

      res.json({
        success: true,
        data: {
          layerOpacity: galaxyMapGameState.viewState.layerOpacity
        },
        message: 'Layer opacity updated'
      });
    } catch (error) {
      console.error('Error updating layer opacity:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update layer opacity',
        details: error.message
      });
    }
  });

  // === SEARCH AND FILTER ENDPOINTS ===

  // Search galaxy objects
  app.get('/api/galaxy/search', (req, res) => {
    try {
      const { q, type } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }

      const query = q.toLowerCase();
      const results = {
        systems: [],
        civilizations: [],
        fleets: [],
        pointsOfInterest: []
      };

      // Search systems
      if (!type || type === 'systems') {
        results.systems = galaxyMapGameState.starSystems.filter(system =>
          system.name.toLowerCase().includes(query) ||
          system.id.toLowerCase().includes(query)
        );
      }

      // Search civilizations
      if (!type || type === 'civilizations') {
        results.civilizations = galaxyMapGameState.civilizations.filter(civ =>
          civ.name.toLowerCase().includes(query) ||
          civ.id.toLowerCase().includes(query)
        );
      }

      // Search fleets
      if (!type || type === 'fleets') {
        results.fleets = galaxyMapGameState.fleets.filter(fleet =>
          fleet.name.toLowerCase().includes(query) ||
          fleet.id.toLowerCase().includes(query)
        );
      }

      // Search points of interest
      if (!type || type === 'poi') {
        results.pointsOfInterest = galaxyMapGameState.pointsOfInterest.filter(poi =>
          poi.name.toLowerCase().includes(query) ||
          poi.description.toLowerCase().includes(query)
        );
      }

      const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

      res.json({
        success: true,
        data: results,
        totalResults,
        query: q
      });
    } catch (error) {
      console.error('Error searching galaxy:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search galaxy',
        details: error.message
      });
    }
  });

  console.log('Galaxy Map APIs setup complete');
}

module.exports = {
  setupGalaxyMapAPIs
};

