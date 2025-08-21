// Galaxy Map API Endpoints
// Provides REST API for galaxy map data and interactions

const { galaxyMapGameState, galaxyMapUtils } = require('../game-state/galaxy-map-state.cjs');
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const galaxyKnobsData = {
  // Exploration & Discovery
  exploration_aggressiveness: 0.6,       // AI can control exploration pace (0.0-1.0)
  discovery_priority: 0.7,               // AI can prioritize new discoveries (0.0-1.0)
  resource_scanning_intensity: 0.5,      // AI can adjust scanning depth (0.0-1.0)
  anomaly_investigation_focus: 0.6,      // AI can focus on anomalies (0.0-1.0)
  
  // Territorial Control
  expansion_strategy: 0.5,               // AI can control territorial expansion (0.0-1.0)
  border_security_priority: 0.7,         // AI can adjust border defenses (0.0-1.0)
  influence_projection: 0.6,             // AI can project galactic influence (0.0-1.0)
  strategic_positioning: 0.5,            // AI can optimize strategic positions (0.0-1.0)
  
  // Galactic Intelligence
  surveillance_network_density: 0.6,     // AI can control surveillance coverage (0.0-1.0)
  intelligence_sharing: 0.4,             // AI can share intel with allies (0.0-1.0)
  threat_assessment_sensitivity: 0.7,    // AI can adjust threat detection (0.0-1.0)
  early_warning_systems: 0.8,           // AI can enhance early warning (0.0-1.0)
  
  // Resource Management
  mining_operation_efficiency: 0.6,      // AI can optimize mining operations (0.0-1.0)
  trade_route_optimization: 0.7,         // AI can optimize galactic trade (0.0-1.0)
  resource_allocation_priority: 0.5,     // AI can prioritize resource allocation (0.0-1.0)
  supply_chain_resilience: 0.6,          // AI can strengthen supply chains (0.0-1.0)
  
  // Diplomatic Relations
  diplomatic_outreach: 0.5,              // AI can initiate diplomatic contact (0.0-1.0)
  alliance_formation_priority: 0.6,      // AI can prioritize alliance building (0.0-1.0)
  neutral_zone_respect: 0.7,             // AI can respect neutral territories (0.0-1.0)
  conflict_avoidance: 0.6,               // AI can avoid unnecessary conflicts (0.0-1.0)
  
  // Scientific Research
  xenobiology_research_focus: 0.7,       // AI can focus on alien life research (0.0-1.0)
  technology_acquisition: 0.6,           // AI can prioritize tech acquisition (0.0-1.0)
  archaeological_investigation: 0.5,     // AI can investigate ancient sites (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const galaxyKnobSystem = new EnhancedKnobSystem(galaxyKnobsData);

// Backward compatibility - expose knobs directly
const galaxyKnobs = galaxyKnobSystem.knobs;

// Structured Outputs - For AI consumption, HUD display, and game state
function generateGalaxyStructuredOutputs() {
  const stats = galaxyMapUtils.getGalaxyStatistics();
  const systems = galaxyMapGameState.starSystems;
  const planets = galaxyMapGameState.planets;
  
  return {
    // High-level galactic metrics for AI decision-making
    galactic_metrics: {
      total_star_systems: systems.length,
      controlled_systems: systems.filter(s => s.controlledBy === 'player').length,
      explored_systems: systems.filter(s => s.explorationStatus === 'explored').length,
      total_planets: planets.length,
      habitable_planets: planets.filter(p => p.habitability > 0.6).length,
      resource_rich_systems: calculateResourceRichSystems(),
      strategic_value_index: calculateStrategicValueIndex(),
      galactic_influence_score: calculateGalacticInfluenceScore()
    },
    
    // Exploration and discovery analysis for AI strategic planning
    exploration_analysis: {
      unexplored_systems: analyzeUnexploredSystems(),
      discovery_opportunities: identifyDiscoveryOpportunities(),
      exploration_efficiency: calculateExplorationEfficiency(),
      anomaly_investigation_status: analyzeAnomalyInvestigations(),
      frontier_expansion_potential: analyzeFrontierExpansion()
    },
    
    // Territorial and strategic assessment for AI feedback
    territorial_assessment: {
      border_security_status: assessBorderSecurity(),
      strategic_position_strength: assessStrategicPositions(),
      expansion_opportunities: identifyExpansionOpportunities(),
      territorial_vulnerabilities: identifyTerritorialVulnerabilities(),
      influence_projection_effectiveness: assessInfluenceProjection()
    },
    
    // Galactic alerts and recommendations for AI attention
    ai_alerts: generateGalaxyAIAlerts(),
    
    // Structured data for other systems
    cross_system_data: {
      resource_distribution_data: calculateResourceDistribution(),
      trade_route_optimization_data: calculateTradeRouteData(),
      diplomatic_contact_opportunities: identifyDiplomaticOpportunities(),
      military_strategic_positions: identifyMilitaryPositions(),
      research_site_priorities: identifyResearchSites(),
      colonization_targets: identifyColonizationTargets()
    },
    
    timestamp: Date.now(),
    knobs_applied: { ...galaxyKnobs }
  };
}

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

  // Helper functions for galaxy structured outputs (streamlined)
  function calculateResourceRichSystems() {
    const systems = galaxyMapGameState.starSystems;
    return systems.filter(s => s.resourceValue && s.resourceValue > 0.7).length;
  }

  function calculateStrategicValueIndex() {
    const systems = galaxyMapGameState.starSystems;
    const controlledSystems = systems.filter(s => s.controlledBy === 'player');
    const strategicPositions = controlledSystems.filter(s => s.strategicValue > 0.6).length;
    return controlledSystems.length > 0 ? strategicPositions / controlledSystems.length : 0;
  }

  function calculateGalacticInfluenceScore() {
    const influenceProjection = galaxyKnobs.influence_projection;
    const strategicPositioning = galaxyKnobs.strategic_positioning;
    const diplomaticOutreach = galaxyKnobs.diplomatic_outreach;
    return (influenceProjection + strategicPositioning + diplomaticOutreach) / 3;
  }

  function analyzeUnexploredSystems() {
    const systems = galaxyMapGameState.starSystems;
    const unexplored = systems.filter(s => s.explorationStatus === 'unexplored');
    const nearbyUnexplored = unexplored.filter(s => s.distanceFromPlayer < 50).length;
    return { total_unexplored: unexplored.length, nearby_unexplored: nearbyUnexplored };
  }

  function identifyDiscoveryOpportunities() {
    const discoveryPriority = galaxyKnobs.discovery_priority;
    const anomalyFocus = galaxyKnobs.anomaly_investigation_focus;
    const systems = galaxyMapGameState.starSystems;
    const anomalySystems = systems.filter(s => s.hasAnomalies).length;
    return { discovery_focus: discoveryPriority, anomaly_systems: anomalySystems, investigation_strength: anomalyFocus };
  }

  function calculateExplorationEfficiency() {
    const aggressiveness = galaxyKnobs.exploration_aggressiveness;
    const scanningIntensity = galaxyKnobs.resource_scanning_intensity;
    const efficiency = (aggressiveness + scanningIntensity) / 2;
    return { efficiency_score: efficiency, exploration_pace: aggressiveness, scanning_depth: scanningIntensity };
  }

  function analyzeAnomalyInvestigations() {
    const systems = galaxyMapGameState.starSystems;
    const anomalySystems = systems.filter(s => s.hasAnomalies);
    const investigatedAnomalies = anomalySystems.filter(s => s.anomalyInvestigated).length;
    const investigationFocus = galaxyKnobs.anomaly_investigation_focus;
    return { total_anomalies: anomalySystems.length, investigated: investigatedAnomalies, focus_level: investigationFocus };
  }

  function analyzeFrontierExpansion() {
    const expansionStrategy = galaxyKnobs.expansion_strategy;
    const systems = galaxyMapGameState.starSystems;
    const frontierSystems = systems.filter(s => s.isFrontier && s.controlledBy !== 'player').length;
    return { frontier_systems: frontierSystems, expansion_focus: expansionStrategy, expansion_potential: frontierSystems * expansionStrategy };
  }

  function assessBorderSecurity() {
    const borderSecurity = galaxyKnobs.border_security_priority;
    const earlyWarning = galaxyKnobs.early_warning_systems;
    const securityScore = (borderSecurity + earlyWarning) / 2;
    return { security_score: securityScore, border_priority: borderSecurity, early_warning: earlyWarning };
  }

  function assessStrategicPositions() {
    const strategicPositioning = galaxyKnobs.strategic_positioning;
    const systems = galaxyMapGameState.starSystems;
    const controlledStrategic = systems.filter(s => s.controlledBy === 'player' && s.strategicValue > 0.6).length;
    return { controlled_strategic: controlledStrategic, positioning_focus: strategicPositioning };
  }

  function identifyExpansionOpportunities() {
    const systems = galaxyMapGameState.starSystems;
    const availableSystems = systems.filter(s => !s.controlledBy && s.habitability > 0.5).length;
    const expansionStrategy = galaxyKnobs.expansion_strategy;
    return { available_systems: availableSystems, expansion_readiness: expansionStrategy, opportunity_score: availableSystems * expansionStrategy };
  }

  function identifyTerritorialVulnerabilities() {
    const systems = galaxyMapGameState.starSystems;
    const borderSystems = systems.filter(s => s.controlledBy === 'player' && s.isBorder);
    const vulnerableBorders = borderSystems.filter(s => s.defenseLevel < 0.5).length;
    const borderSecurity = galaxyKnobs.border_security_priority;
    return { vulnerable_borders: vulnerableBorders, total_borders: borderSystems.length, security_focus: borderSecurity };
  }

  function assessInfluenceProjection() {
    const influenceProjection = galaxyKnobs.influence_projection;
    const diplomaticOutreach = galaxyKnobs.diplomatic_outreach;
    const systems = galaxyMapGameState.starSystems;
    const influencedSystems = systems.filter(s => s.playerInfluence > 0.3).length;
    return { influenced_systems: influencedSystems, projection_strength: influenceProjection, diplomatic_reach: diplomaticOutreach };
  }

  function generateGalaxyAIAlerts() {
    const alerts = [];
    
    // Unexplored system alert
    const unexplored = analyzeUnexploredSystems();
    if (unexplored.nearby_unexplored > 10) {
      alerts.push({ type: 'exploration_opportunity', severity: 'medium', message: `${unexplored.nearby_unexplored} nearby systems remain unexplored` });
    }
    
    // Border vulnerability alert
    const vulnerabilities = identifyTerritorialVulnerabilities();
    if (vulnerabilities.vulnerable_borders > 3) {
      alerts.push({ type: 'border_vulnerability', severity: 'high', message: 'Multiple border systems lack adequate defenses' });
    }
    
    // Resource opportunity alert
    const resourceSystems = calculateResourceRichSystems();
    if (resourceSystems > 5) {
      alerts.push({ type: 'resource_opportunity', severity: 'medium', message: 'Rich resource systems available for exploitation' });
    }
    
    // Strategic position alert
    const strategic = assessStrategicPositions();
    if (strategic.controlled_strategic < 3) {
      alerts.push({ type: 'strategic_weakness', severity: 'high', message: 'Insufficient control of strategic positions' });
    }
    
    return alerts;
  }

  function calculateResourceDistribution() {
    const systems = galaxyMapGameState.starSystems;
    const resourceTypes = { minerals: 0, energy: 0, rare_materials: 0, biological: 0 };
    systems.forEach(system => {
      if (system.resources) {
        Object.keys(system.resources).forEach(resource => {
          if (resourceTypes.hasOwnProperty(resource)) {
            resourceTypes[resource] += system.resources[resource] || 0;
          }
        });
      }
    });
    return resourceTypes;
  }

  function calculateTradeRouteData() {
    const systems = galaxyMapGameState.starSystems;
    const controlledSystems = systems.filter(s => s.controlledBy === 'player');
    const tradeHubs = controlledSystems.filter(s => s.isTradeHub).length;
    const routeOptimization = galaxyKnobs.trade_route_optimization;
    return { controlled_systems: controlledSystems.length, trade_hubs: tradeHubs, optimization_level: routeOptimization };
  }

  function identifyDiplomaticOpportunities() {
    const systems = galaxyMapGameState.starSystems;
    const alienSystems = systems.filter(s => s.controlledBy && s.controlledBy !== 'player' && s.controlledBy !== 'neutral');
    const diplomaticOutreach = galaxyKnobs.diplomatic_outreach;
    const contactOpportunities = alienSystems.filter(s => s.diplomaticStatus === 'unknown').length;
    return { alien_civilizations: new Set(alienSystems.map(s => s.controlledBy)).size, contact_opportunities: contactOpportunities, outreach_level: diplomaticOutreach };
  }

  function identifyMilitaryPositions() {
    const systems = galaxyMapGameState.starSystems;
    const militaryBases = systems.filter(s => s.controlledBy === 'player' && s.hasMilitaryBase).length;
    const strategicPositions = systems.filter(s => s.controlledBy === 'player' && s.strategicValue > 0.7).length;
    const borderSecurity = galaxyKnobs.border_security_priority;
    return { military_bases: militaryBases, strategic_positions: strategicPositions, security_focus: borderSecurity };
  }

  function identifyResearchSites() {
    const systems = galaxyMapGameState.starSystems;
    const researchSites = systems.filter(s => s.hasAnomalies || s.hasAncientRuins || s.hasXenobiology).length;
    const xenobiologyFocus = galaxyKnobs.xenobiology_research_focus;
    const archaeologyFocus = galaxyKnobs.archaeological_investigation;
    return { research_sites: researchSites, xenobiology_priority: xenobiologyFocus, archaeology_priority: archaeologyFocus };
  }

  function identifyColonizationTargets() {
    const systems = galaxyMapGameState.starSystems;
    const planets = galaxyMapGameState.planets;
    const habitablePlanets = planets.filter(p => p.habitability > 0.6 && !p.colonized).length;
    const resourceRichPlanets = planets.filter(p => p.resourceValue > 0.7 && !p.colonized).length;
    const expansionStrategy = galaxyKnobs.expansion_strategy;
    return { habitable_targets: habitablePlanets, resource_targets: resourceRichPlanets, expansion_readiness: expansionStrategy };
  }

  // Apply AI knobs to actual galaxy game state
  function applyGalaxyKnobsToGameState() {
    const systems = galaxyMapGameState.starSystems;
    const planets = galaxyMapGameState.planets;
    
    // Apply exploration aggressiveness to discovery rates
    const explorationAggression = galaxyKnobs.exploration_aggressiveness;
    if (explorationAggression > 0.7) {
      systems.forEach(system => {
        if (system.explorationStatus === 'unexplored' && Math.random() < explorationAggression * 0.1) {
          system.explorationStatus = 'exploring';
          system.explorationProgress = explorationAggression * 0.3;
        }
      });
    }
    
    // Apply resource scanning intensity to resource discovery
    const scanningIntensity = galaxyKnobs.resource_scanning_intensity;
    systems.forEach(system => {
      if (system.explorationStatus === 'explored' && scanningIntensity > 0.6) {
        if (!system.resourcesScanned) {
          system.resourcesScanned = true;
          system.resourceAccuracy = scanningIntensity;
          // Higher scanning intensity reveals more resources
          if (system.resources) {
            Object.keys(system.resources).forEach(resource => {
              system.resources[resource] *= (1 + scanningIntensity * 0.5);
            });
          }
        }
      }
    });
    
    // Apply border security to defensive capabilities
    const borderSecurity = galaxyKnobs.border_security_priority;
    systems.forEach(system => {
      if (system.controlledBy === 'player' && system.isBorder) {
        system.defenseLevel = Math.min(1.0, system.defenseLevel + borderSecurity * 0.2);
        if (borderSecurity > 0.8) {
          system.hasEarlyWarning = true;
          system.defensiveStructures = 'enhanced';
        }
      }
    });
    
    // Apply influence projection to diplomatic reach
    const influenceProjection = galaxyKnobs.influence_projection;
    systems.forEach(system => {
      if (system.controlledBy === 'player') {
        // Extend influence to nearby systems
        const nearbyNeutral = systems.filter(s => 
          s.controlledBy === 'neutral' && 
          calculateDistance(system, s) < 20
        );
        nearbyNeutral.forEach(nearbySystem => {
          nearbySystem.playerInfluence = Math.min(1.0, (nearbySystem.playerInfluence || 0) + influenceProjection * 0.1);
        });
      }
    });
    
    // Apply diplomatic outreach to contact opportunities
    const diplomaticOutreach = galaxyKnobs.diplomatic_outreach;
    if (diplomaticOutreach > 0.6) {
      systems.forEach(system => {
        if (system.controlledBy && system.controlledBy !== 'player' && system.controlledBy !== 'neutral') {
          if (system.diplomaticStatus === 'unknown' && Math.random() < diplomaticOutreach * 0.2) {
            system.diplomaticStatus = 'contact_initiated';
            system.firstContactDate = Date.now();
          }
        }
      });
    }
    
    // Apply mining efficiency to resource extraction
    const miningEfficiency = galaxyKnobs.mining_operation_efficiency;
    systems.forEach(system => {
      if (system.controlledBy === 'player' && system.hasMiningOperations) {
        system.miningEfficiency = miningEfficiency;
        system.resourceExtractionRate = system.baseExtractionRate * (1 + miningEfficiency * 0.5);
      }
    });
    
    console.log('🎛️ Galaxy knobs applied to game state:', {
      exploration_aggressiveness: galaxyKnobs.exploration_aggressiveness,
      resource_scanning_intensity: galaxyKnobs.resource_scanning_intensity,
      border_security_priority: galaxyKnobs.border_security_priority,
      influence_projection: galaxyKnobs.influence_projection,
      diplomatic_outreach: galaxyKnobs.diplomatic_outreach
    });
  }

  // Helper function to calculate distance between systems
  function calculateDistance(system1, system2) {
    const dx = system1.x - system2.x;
    const dy = system1.y - system2.y;
    const dz = (system1.z || 0) - (system2.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // ===== AI INTEGRATION ENDPOINTS =====
  
  // Enhanced AI knob endpoints with multi-format input support
  app.get('/api/galaxy/knobs', (req, res) => {
    const knobData = galaxyKnobSystem.getKnobsWithMetadata();
    res.json({
      ...knobData,
      system: 'galaxy',
      description: 'AI-adjustable parameters for galaxy system with enhanced input support',
      input_help: galaxyKnobSystem.getKnobDescriptions()
    });
  });

  app.post('/api/galaxy/knobs', (req, res) => {
    const { knobs, source = 'ai' } = req.body;
    
    if (!knobs || typeof knobs !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid knobs data. Expected object with knob values.',
        help: galaxyKnobSystem.getKnobDescriptions().examples
      });
    }
    
    // Update knobs using enhanced system
    const updateResult = galaxyKnobSystem.updateKnobs(knobs, source);
    
    // Apply knobs to game state
    try {
      applyGalaxyKnobsToGameState();
    } catch (error) {
      console.error('Error applying galaxy knobs to game state:', error);
    }
    
    res.json({
      success: updateResult.success,
      system: 'galaxy',
      ...updateResult,
      message: 'Galaxy knobs updated successfully using enhanced input processing'
    });
  });

  // Get knob help/documentation
  app.get('/api/galaxy/knobs/help', (req, res) => {
    res.json({
      system: 'galaxy',
      help: galaxyKnobSystem.getKnobDescriptions(),
      current_values: galaxyKnobSystem.getKnobsWithMetadata()
    });
  });

  // Get structured outputs for AI consumption
  app.get('/api/galaxy/ai-data', (req, res) => {
    const structuredData = generateGalaxyStructuredOutputs();
    res.json({
      ...structuredData,
      description: 'Structured galaxy data for AI analysis and decision-making'
    });
  });

  // Get cross-system integration data
  app.get('/api/galaxy/cross-system', (req, res) => {
    const outputs = generateGalaxyStructuredOutputs();
    res.json({
      resource_data: outputs.cross_system_data.resource_distribution_data,
      trade_route_data: outputs.cross_system_data.trade_route_optimization_data,
      diplomatic_data: outputs.cross_system_data.diplomatic_contact_opportunities,
      military_data: outputs.cross_system_data.military_strategic_positions,
      research_data: outputs.cross_system_data.research_site_priorities,
      colonization_data: outputs.cross_system_data.colonization_targets,
      galactic_summary: outputs.galactic_metrics,
      timestamp: outputs.timestamp
    });
  });

  console.log('Galaxy Map APIs setup complete');
}

module.exports = {
  setupGalaxyMapAPIs
};

