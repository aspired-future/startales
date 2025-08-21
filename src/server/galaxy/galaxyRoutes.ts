/**
 * Galaxy Map API Routes
 * 
 * REST API endpoints for the Galaxy Map & Space Systems
 * including star systems, planets, space exploration, and galactic navigation.
 */

import express from 'express';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = express.Router();

// Enhanced AI Knobs for Galaxy Map & Space Systems
const galaxyKnobsData = {
  // Galaxy Generation & Procedural Content
  galaxy_size_scale: 0.8,                  // Galaxy size scale and star system density
  procedural_generation_complexity: 0.8,   // Procedural generation complexity and detail level
  star_system_diversity: 0.8,              // Star system diversity and unique characteristics
  
  // Exploration & Discovery
  exploration_reward_frequency: 0.7,       // Exploration reward frequency and discovery incentives
  unknown_region_mystery: 0.8,             // Unknown region mystery and exploration intrigue
  discovery_significance_weighting: 0.7,   // Discovery significance weighting and importance scaling
  
  // Navigation & Travel
  faster_than_light_efficiency: 0.8,       // Faster-than-light travel efficiency and speed
  navigation_accuracy: 0.9,                // Navigation accuracy and route precision
  space_hazard_frequency: 0.6,             // Space hazard frequency and travel dangers
  
  // Planetary Systems & Habitability
  habitable_planet_frequency: 0.7,         // Habitable planet frequency and colonization opportunities
  planetary_resource_abundance: 0.7,       // Planetary resource abundance and extraction potential
  atmospheric_diversity: 0.8,              // Atmospheric diversity and environmental variety
  
  // Galactic Politics & Territories
  territorial_boundary_clarity: 0.8,       // Territorial boundary clarity and sovereignty definition
  neutral_zone_stability: 0.7,             // Neutral zone stability and diplomatic buffer areas
  border_dispute_frequency: 0.5,           // Border dispute frequency and territorial conflicts
  
  // Space Infrastructure & Development
  space_station_development: 0.7,          // Space station development and orbital infrastructure
  trade_route_establishment: 0.8,          // Trade route establishment and commercial pathways
  communication_network_coverage: 0.8,     // Communication network coverage and galactic connectivity
  
  // Scientific Research & Anomalies
  scientific_anomaly_frequency: 0.6,       // Scientific anomaly frequency and research opportunities
  xenoarchaeology_discovery_rate: 0.6,     // Xenoarchaeology discovery rate and ancient artifacts
  astrophysics_research_depth: 0.7,        // Astrophysics research depth and cosmic understanding
  
  // Environmental & Cosmic Events
  cosmic_event_frequency: 0.5,             // Cosmic event frequency and galactic phenomena
  stellar_evolution_simulation: 0.7,       // Stellar evolution simulation and star lifecycle
  galactic_weather_patterns: 0.6,          // Galactic weather patterns and space conditions
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Galaxy
const galaxyKnobSystem = new EnhancedKnobSystem(galaxyKnobsData);

// Apply galaxy knobs to game state
function applyGalaxyKnobsToGameState() {
  const knobs = galaxyKnobSystem.knobs;
  
  // Apply galaxy generation settings
  const galaxyGeneration = (knobs.galaxy_size_scale + knobs.procedural_generation_complexity + 
    knobs.star_system_diversity) / 3;
  
  // Apply exploration settings
  const exploration = (knobs.exploration_reward_frequency + knobs.unknown_region_mystery + 
    knobs.discovery_significance_weighting) / 3;
  
  // Apply navigation settings
  const navigation = (knobs.faster_than_light_efficiency + knobs.navigation_accuracy + 
    knobs.space_hazard_frequency) / 3;
  
  // Apply planetary systems settings
  const planetarySystems = (knobs.habitable_planet_frequency + knobs.planetary_resource_abundance + 
    knobs.atmospheric_diversity) / 3;
  
  // Apply galactic politics settings
  const galacticPolitics = (knobs.territorial_boundary_clarity + knobs.neutral_zone_stability + 
    knobs.border_dispute_frequency) / 3;
  
  // Apply scientific research settings
  const scientificResearch = (knobs.scientific_anomaly_frequency + knobs.xenoarchaeology_discovery_rate + 
    knobs.astrophysics_research_depth) / 3;
  
  console.log('Applied galaxy knobs to game state:', {
    galaxyGeneration,
    exploration,
    navigation,
    planetarySystems,
    galacticPolitics,
    scientificResearch
  });
}

// ===== GALAXY MAP & NAVIGATION =====

/**
 * GET /api/galaxy/map - Get galaxy map data
 */
router.get('/map', async (req, res) => {
  try {
    const { 
      campaignId, 
      sector, 
      zoom = 1, 
      includeUnexplored = false 
    } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    // Generate mock galaxy map data
    const galaxyMap = {
      campaignId: Number(campaignId),
      sectors: Array.from({ length: 10 }, (_, i) => ({
        id: `sector_${i + 1}`,
        name: `Sector ${i + 1}`,
        coordinates: {
          x: Math.floor(Math.random() * 1000),
          y: Math.floor(Math.random() * 1000),
          z: Math.floor(Math.random() * 100)
        },
        starSystems: Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, j) => ({
          id: `system_${i + 1}_${j + 1}`,
          name: `System ${i + 1}-${j + 1}`,
          starType: ['G', 'K', 'M', 'F', 'A'][Math.floor(Math.random() * 5)],
          planets: Math.floor(Math.random() * 8) + 1,
          explored: includeUnexplored === 'true' ? Math.random() > 0.3 : true,
          controlledBy: Math.random() > 0.7 ? `civilization_${Math.floor(Math.random() * 3) + 1}` : null
        })),
        controlStatus: Math.random() > 0.5 ? 'controlled' : Math.random() > 0.5 ? 'contested' : 'neutral',
        explorationLevel: Math.floor(Math.random() * 100)
      })),
      metadata: {
        totalSectors: 10,
        exploredSectors: 7,
        controlledSectors: 4,
        zoom: Number(zoom),
        lastUpdated: new Date()
      }
    };

    res.json({
      success: true,
      data: galaxyMap
    });
  } catch (error) {
    console.error('Error fetching galaxy map:', error);
    res.status(500).json({
      error: 'Failed to fetch galaxy map',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/galaxy/systems/:systemId - Get star system details
 */
router.get('/systems/:systemId', async (req, res) => {
  try {
    const { systemId } = req.params;
    const { includeResources = true } = req.query;

    const starSystem = {
      id: systemId,
      name: `Star System ${systemId}`,
      coordinates: {
        x: Math.floor(Math.random() * 1000),
        y: Math.floor(Math.random() * 1000),
        z: Math.floor(Math.random() * 100)
      },
      star: {
        type: ['G', 'K', 'M', 'F', 'A'][Math.floor(Math.random() * 5)],
        mass: Math.random() * 2 + 0.5,
        luminosity: Math.random() * 3 + 0.1,
        age: Math.floor(Math.random() * 10) + 1 // billion years
      },
      planets: Array.from({ length: Math.floor(Math.random() * 8) + 1 }, (_, i) => ({
        id: `${systemId}_planet_${i + 1}`,
        name: `Planet ${i + 1}`,
        type: ['terrestrial', 'gas_giant', 'ice_giant', 'dwarf'][Math.floor(Math.random() * 4)],
        habitability: Math.random(),
        atmosphere: Math.random() > 0.5 ? 'breathable' : Math.random() > 0.5 ? 'toxic' : 'none',
        resources: includeResources === 'true' ? {
          minerals: Math.floor(Math.random() * 100),
          energy: Math.floor(Math.random() * 100),
          biologicals: Math.floor(Math.random() * 100)
        } : undefined,
        population: Math.random() > 0.8 ? Math.floor(Math.random() * 1000000) : 0,
        colonies: Math.random() > 0.7 ? [{
          id: `colony_${systemId}_${i + 1}`,
          name: `Colony ${i + 1}`,
          population: Math.floor(Math.random() * 100000),
          established: new Date(Date.now() - Math.random() * 31536000000) // Within last year
        }] : []
      })),
      explorationStatus: Math.random() > 0.2 ? 'explored' : 'unexplored',
      controlledBy: Math.random() > 0.6 ? `civilization_${Math.floor(Math.random() * 3) + 1}` : null,
      strategicValue: Math.floor(Math.random() * 10) + 1,
      lastSurveyed: new Date(Date.now() - Math.random() * 86400000 * 30) // Within last 30 days
    };

    res.json({
      success: true,
      data: starSystem
    });
  } catch (error) {
    console.error('Error fetching star system:', error);
    res.status(500).json({
      error: 'Failed to fetch star system',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== EXPLORATION & DISCOVERY =====

/**
 * POST /api/galaxy/explore - Initiate exploration mission
 */
router.post('/explore', async (req, res) => {
  try {
    const {
      campaignId,
      targetSystemId,
      fleetId,
      explorationType = 'survey',
      duration = 7
    } = req.body;

    if (!campaignId || !targetSystemId || !fleetId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'targetSystemId', 'fleetId']
      });
    }

    const explorationMission = {
      id: `exploration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      campaignId: Number(campaignId),
      targetSystemId,
      fleetId,
      explorationType,
      status: 'in_progress',
      startDate: new Date(),
      estimatedCompletion: new Date(Date.now() + (Number(duration) * 24 * 60 * 60 * 1000)),
      progress: 0,
      discoveries: [],
      risks: {
        spaceHazards: Math.random() * 0.3,
        hostileEncounters: Math.random() * 0.2,
        equipmentFailure: Math.random() * 0.1
      }
    };

    res.status(201).json({
      success: true,
      data: explorationMission
    });
  } catch (error) {
    console.error('Error initiating exploration:', error);
    res.status(500).json({
      error: 'Failed to initiate exploration',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/galaxy/discoveries - Get exploration discoveries
 */
router.get('/discoveries', async (req, res) => {
  try {
    const { campaignId, limit = 20, type } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const discoveries = Array.from({ length: Math.min(Number(limit), 50) }, (_, i) => ({
      id: `discovery_${i + 1}`,
      campaignId: Number(campaignId),
      type: type || ['planet', 'anomaly', 'artifact', 'resource', 'life'][Math.floor(Math.random() * 5)],
      name: `Discovery ${i + 1}`,
      location: {
        systemId: `system_${Math.floor(Math.random() * 10) + 1}`,
        coordinates: {
          x: Math.floor(Math.random() * 1000),
          y: Math.floor(Math.random() * 1000),
          z: Math.floor(Math.random() * 100)
        }
      },
      significance: Math.floor(Math.random() * 10) + 1,
      discoveredBy: `fleet_${Math.floor(Math.random() * 5) + 1}`,
      discoveryDate: new Date(Date.now() - Math.random() * 86400000 * 365), // Within last year
      description: `A significant ${type || 'discovery'} found during exploration mission`,
      scientificValue: Math.floor(Math.random() * 100),
      economicValue: Math.floor(Math.random() * 100),
      strategicValue: Math.floor(Math.random() * 100)
    }));

    res.json({
      success: true,
      data: discoveries,
      count: discoveries.length
    });
  } catch (error) {
    console.error('Error fetching discoveries:', error);
    res.status(500).json({
      error: 'Failed to fetch discoveries',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== SPACE TRAVEL & NAVIGATION =====

/**
 * POST /api/galaxy/navigate - Calculate navigation route
 */
router.post('/navigate', async (req, res) => {
  try {
    const {
      fromSystemId,
      toSystemId,
      fleetId,
      routeType = 'fastest'
    } = req.body;

    if (!fromSystemId || !toSystemId || !fleetId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['fromSystemId', 'toSystemId', 'fleetId']
      });
    }

    const navigationRoute = {
      id: `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromSystemId,
      toSystemId,
      fleetId,
      routeType,
      waypoints: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
        systemId: `waypoint_${i + 1}`,
        coordinates: {
          x: Math.floor(Math.random() * 1000),
          y: Math.floor(Math.random() * 1000),
          z: Math.floor(Math.random() * 100)
        },
        stopDuration: Math.floor(Math.random() * 24) // hours
      })),
      totalDistance: Math.floor(Math.random() * 1000) + 100, // light years
      estimatedTravelTime: Math.floor(Math.random() * 168) + 24, // hours
      fuelRequired: Math.floor(Math.random() * 1000) + 100,
      hazards: Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => ({
        type: ['asteroid_field', 'solar_storm', 'gravity_well'][Math.floor(Math.random() * 3)],
        severity: Math.floor(Math.random() * 5) + 1,
        location: `waypoint_${i + 1}`
      })),
      calculatedAt: new Date()
    };

    res.json({
      success: true,
      data: navigationRoute
    });
  } catch (error) {
    console.error('Error calculating navigation route:', error);
    res.status(500).json({
      error: 'Failed to calculate navigation route',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== GALACTIC TERRITORIES & POLITICS =====

/**
 * GET /api/galaxy/territories - Get territorial control map
 */
router.get('/territories', async (req, res) => {
  try {
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const territories = {
      campaignId: Number(campaignId),
      civilizations: Array.from({ length: 5 }, (_, i) => ({
        id: `civilization_${i + 1}`,
        name: `Civilization ${i + 1}`,
        controlledSystems: Math.floor(Math.random() * 20) + 5,
        territorialClaims: Array.from({ length: Math.floor(Math.random() * 10) + 3 }, (_, j) => ({
          systemId: `system_${i + 1}_${j + 1}`,
          claimStrength: Math.random(),
          disputed: Math.random() > 0.8
        })),
        diplomaticStatus: Math.random() > 0.5 ? 'neutral' : Math.random() > 0.5 ? 'allied' : 'hostile'
      })),
      neutralZones: Array.from({ length: 3 }, (_, i) => ({
        id: `neutral_${i + 1}`,
        name: `Neutral Zone ${i + 1}`,
        systems: Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, j) => `neutral_system_${i + 1}_${j + 1}`),
        established: new Date(Date.now() - Math.random() * 31536000000),
        treatyStatus: 'active'
      })),
      disputes: Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => ({
        id: `dispute_${i + 1}`,
        involvedCivilizations: [`civilization_${i + 1}`, `civilization_${i + 2}`],
        disputedSystems: [`system_disputed_${i + 1}`],
        severity: Math.floor(Math.random() * 5) + 1,
        startDate: new Date(Date.now() - Math.random() * 86400000 * 30)
      }))
    };

    res.json({
      success: true,
      data: territories
    });
  } catch (error) {
    console.error('Error fetching territories:', error);
    res.status(500).json({
      error: 'Failed to fetch territories',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'galaxy', galaxyKnobSystem, applyGalaxyKnobsToGameState);

export default router;
