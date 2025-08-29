/**
 * Galaxy Map API Routes
 * 
 * REST API endpoints for the Galaxy Map & Space Systems
 * including star systems, planets, space exploration, and galactic navigation.
 */

import express from 'express';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';
import { GalaxySimulationIntegration } from './GalaxySimulationIntegration';
import { DEFAULT_GALAXY_KNOBS, GALAXY_KNOBS_AI_PROMPTS } from './galaxyKnobs';

const router = express.Router();

// Enhanced AI Knobs for Galaxy Map & Space Systems
const galaxyKnobsData = DEFAULT_GALAXY_KNOBS;

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

// ===== ENHANCED GALAXY SIMULATION ENDPOINTS =====

/**
 * GET /api/galaxy/simulation/status - Get galaxy simulation status
 */
router.get('/simulation/status', async (req, res) => {
  try {
    const { campaignId, civilizationId } = req.query;

    if (!campaignId || !civilizationId) {
      return res.status(400).json({
        error: 'Missing required parameters: campaignId, civilizationId'
      });
    }

    // This would integrate with the actual simulation
    const simulationStatus = {
      campaignId: Number(campaignId),
      civilizationId: String(civilizationId),
      active: true,
      lastTick: new Date(),
      nextTick: new Date(Date.now() + 30000),
      knobsActive: Object.keys(galaxyKnobsData).length - 1, // Exclude lastUpdated
      eventsProcessed: Math.floor(Math.random() * 100),
      performanceMetrics: {
        explorationEfficiency: Math.random(),
        diplomaticStability: Math.random(),
        economicGrowth: Math.random(),
        scientificProgress: Math.random()
      }
    };

    res.json({
      success: true,
      data: simulationStatus
    });
  } catch (error) {
    console.error('Error fetching simulation status:', error);
    res.status(500).json({
      error: 'Failed to fetch simulation status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/galaxy/simulation/events - Trigger galaxy simulation events
 */
router.post('/simulation/events', async (req, res) => {
  try {
    const {
      campaignId,
      civilizationId,
      eventType,
      parameters = {}
    } = req.body;

    if (!campaignId || !civilizationId || !eventType) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'civilizationId', 'eventType']
      });
    }

    const simulationEvent = {
      id: `sim_event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      campaignId: Number(campaignId),
      civilizationId: String(civilizationId),
      eventType,
      parameters,
      status: 'triggered',
      timestamp: new Date(),
      estimatedCompletion: new Date(Date.now() + 60000), // 1 minute
      expectedOutcomes: [
        'Galaxy map updates',
        'Territory adjustments',
        'Discovery notifications',
        'Diplomatic status changes'
      ]
    };

    res.status(201).json({
      success: true,
      data: simulationEvent
    });
  } catch (error) {
    console.error('Error triggering simulation event:', error);
    res.status(500).json({
      error: 'Failed to trigger simulation event',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/galaxy/ai/recommendations - Get AI recommendations for knob adjustments
 */
router.get('/ai/recommendations', async (req, res) => {
  try {
    const { campaignId, civilizationId } = req.query;

    if (!campaignId || !civilizationId) {
      return res.status(400).json({
        error: 'Missing required parameters: campaignId, civilizationId'
      });
    }

    // Generate AI recommendations based on current game state
    const recommendations = {
      campaignId: Number(campaignId),
      civilizationId: String(civilizationId),
      analysisTimestamp: new Date(),
      recommendations: [
        {
          knobName: 'exploration_reward_frequency',
          currentValue: galaxyKnobsData.exploration_reward_frequency,
          recommendedValue: Math.min(galaxyKnobsData.exploration_reward_frequency + 0.1, 1.0),
          reason: 'Low exploration activity detected, increasing rewards to encourage exploration',
          confidence: 0.85,
          expectedImpact: 'Increased player exploration by 15-25%',
          priority: 'high'
        },
        {
          knobName: 'diplomatic_complexity',
          currentValue: galaxyKnobsData.diplomatic_complexity || 0.7,
          recommendedValue: 0.6,
          reason: 'Diplomatic system may be too complex for current player engagement level',
          confidence: 0.72,
          expectedImpact: 'Simplified diplomatic interactions, improved player satisfaction',
          priority: 'medium'
        },
        {
          knobName: 'scientific_anomaly_frequency',
          currentValue: galaxyKnobsData.scientific_anomaly_frequency,
          recommendedValue: Math.min(galaxyKnobsData.scientific_anomaly_frequency + 0.05, 1.0),
          reason: 'Players showing high interest in scientific discoveries',
          confidence: 0.78,
          expectedImpact: 'More frequent scientific discoveries, enhanced engagement',
          priority: 'medium'
        }
      ],
      gameStateAnalysis: {
        explorationActivity: Math.random(),
        diplomaticTensions: Math.random(),
        scientificProgress: Math.random(),
        economicStability: Math.random(),
        playerEngagement: Math.random()
      }
    };

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    res.status(500).json({
      error: 'Failed to generate AI recommendations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/galaxy/knobs/batch-update - Batch update multiple knobs
 */
router.post('/knobs/batch-update', async (req, res) => {
  try {
    const {
      campaignId,
      civilizationId,
      knobUpdates,
      reason = 'Manual adjustment'
    } = req.body;

    if (!campaignId || !civilizationId || !knobUpdates) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'civilizationId', 'knobUpdates']
      });
    }

    const updateResults = [];
    for (const [knobName, newValue] of Object.entries(knobUpdates)) {
      if (typeof newValue === 'number' && knobName in galaxyKnobsData) {
        const oldValue = galaxyKnobsData[knobName as keyof typeof galaxyKnobsData];
        
        // Update the knob (this would integrate with the actual knob system)
        updateResults.push({
          knobName,
          oldValue,
          newValue,
          success: true,
          timestamp: new Date()
        });
      } else {
        updateResults.push({
          knobName,
          success: false,
          error: 'Invalid knob name or value'
        });
      }
    }

    const batchUpdate = {
      id: `batch_update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      campaignId: Number(campaignId),
      civilizationId: String(civilizationId),
      reason,
      updates: updateResults,
      timestamp: new Date(),
      successCount: updateResults.filter(r => r.success).length,
      failureCount: updateResults.filter(r => !r.success).length
    };

    res.json({
      success: true,
      data: batchUpdate
    });
  } catch (error) {
    console.error('Error batch updating knobs:', error);
    res.status(500).json({
      error: 'Failed to batch update knobs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/galaxy/analytics/performance - Get galaxy system performance analytics
 */
router.get('/analytics/performance', async (req, res) => {
  try {
    const { campaignId, civilizationId, timeRange = '24h' } = req.query;

    if (!campaignId || !civilizationId) {
      return res.status(400).json({
        error: 'Missing required parameters: campaignId, civilizationId'
      });
    }

    const performanceAnalytics = {
      campaignId: Number(campaignId),
      civilizationId: String(civilizationId),
      timeRange,
      generatedAt: new Date(),
      metrics: {
        exploration: {
          systemsExplored: Math.floor(Math.random() * 50) + 10,
          discoveriesMade: Math.floor(Math.random() * 20) + 5,
          explorationEfficiency: Math.random(),
          averageExplorationTime: Math.floor(Math.random() * 120) + 30 // minutes
        },
        diplomacy: {
          treatiesSigned: Math.floor(Math.random() * 10),
          conflictsResolved: Math.floor(Math.random() * 5),
          diplomaticStability: Math.random(),
          relationshipChanges: Math.floor(Math.random() * 15)
        },
        economy: {
          tradeRoutesEstablished: Math.floor(Math.random() * 25) + 5,
          resourcesExtracted: Math.floor(Math.random() * 1000) + 500,
          economicGrowth: Math.random(),
          tradeVolume: Math.floor(Math.random() * 10000) + 5000
        },
        science: {
          researchCompleted: Math.floor(Math.random() * 15) + 3,
          anomaliesStudied: Math.floor(Math.random() * 8) + 2,
          scientificBreakthroughs: Math.floor(Math.random() * 3),
          researchEfficiency: Math.random()
        }
      },
      trends: {
        explorationTrend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
        diplomaticTrend: Math.random() > 0.5 ? 'improving' : 'declining',
        economicTrend: Math.random() > 0.5 ? 'growing' : 'contracting',
        scientificTrend: Math.random() > 0.5 ? 'advancing' : 'stagnating'
      }
    };

    res.json({
      success: true,
      data: performanceAnalytics
    });
  } catch (error) {
    console.error('Error fetching performance analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch performance analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'galaxy', galaxyKnobSystem, applyGalaxyKnobsToGameState);

export default router;
