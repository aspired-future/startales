/**
 * Spatial Intelligence API Routes
 * 
 * REST API endpoints for character spatial awareness, military intelligence,
 * trade logistics, and sensor systems integration.
 */

import express from 'express';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';
import { DEFAULT_SPATIAL_AWARENESS_KNOBS, SPATIAL_AWARENESS_AI_PROMPTS } from './spatialAwarenessKnobs.js';

const router = express.Router();

// Enhanced AI Knobs for Spatial Intelligence
const spatialKnobsData = DEFAULT_SPATIAL_AWARENESS_KNOBS;

// Initialize Enhanced Knob System for Spatial Intelligence
const spatialKnobSystem = new EnhancedKnobSystem(spatialKnobsData);

// Apply spatial knobs to character AI state
function applySpatialKnobsToCharacterAI() {
  const knobs = spatialKnobSystem.knobs;
  
  console.log('Applied spatial intelligence knobs to character AI:', {
    mapAwareness: knobs.galactic_map_detail_level,
    militaryIntelligence: knobs.fleet_movement_tracking,
    tradeIntelligence: knobs.trade_route_optimization,
    sensorCapabilities: knobs.sensor_range_efficiency
  });
}

// ===== CHARACTER SPATIAL INTELLIGENCE =====

/**
 * GET /api/characters/spatial/intelligence/:characterId - Get character's spatial intelligence
 */
router.get('/spatial/intelligence/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;
    const { includeFleets = true, includeResources = true, includeTrade = true } = req.query;

    if (!characterId) {
      return res.status(400).json({
        error: 'Missing required parameter: characterId'
      });
    }

    // Mock spatial intelligence data (would integrate with actual SpatialIntelligenceIntegration)
    const spatialIntelligence = {
      characterId,
      role: 'military_commander',
      position: {
        systemId: 'home_system',
        coordinates: { x: 500, y: 300, z: 50 },
        sectorId: 'alpha_sector'
      },
      capabilities: {
        sensorRange: 150,
        intelligenceNetworkReach: 200,
        analysisAccuracy: 0.9,
        predictionReliability: 0.8
      },
      knowledgeBase: {
        fleetIntelligence: includeFleets === 'true' ? [
          {
            fleetId: 'enemy_fleet_1',
            position: {
              systemId: 'border_system_7',
              coordinates: { x: 450, y: 280, z: 45 }
            },
            size: 12,
            composition: ['battleship', 'cruiser', 'destroyer'],
            allegiance: 'enemy',
            lastSeen: new Date(Date.now() - 3600000),
            threatLevel: 8,
            detectionConfidence: 0.85,
            estimatedDestination: {
              systemId: 'strategic_system_3',
              coordinates: { x: 400, y: 250, z: 40 }
            }
          },
          {
            fleetId: 'friendly_patrol_2',
            position: {
              systemId: 'patrol_route_b',
              coordinates: { x: 520, y: 320, z: 55 }
            },
            size: 6,
            composition: ['cruiser', 'frigate', 'frigate'],
            allegiance: 'friendly',
            lastSeen: new Date(Date.now() - 1800000),
            threatLevel: 0,
            detectionConfidence: 0.95
          }
        ] : [],
        resourceIntelligence: includeResources === 'true' ? [
          {
            resourceId: 'rare_minerals_alpha',
            type: 'rare_elements',
            location: {
              systemId: 'mining_system_4',
              coordinates: { x: 600, y: 400, z: 30 }
            },
            quantity: 5000,
            quality: 0.9,
            extractionDifficulty: 0.6,
            marketValue: 850,
            transportCost: 120,
            securityRisk: 0.3,
            controlledBy: 'neutral_corporation'
          }
        ] : [],
        tradeIntelligence: includeTrade === 'true' ? [
          {
            routeId: 'trade_route_alpha_beta',
            origin: {
              systemId: 'trade_hub_alpha',
              coordinates: { x: 300, y: 200, z: 25 }
            },
            destination: {
              systemId: 'trade_hub_beta',
              coordinates: { x: 700, y: 500, z: 75 }
            },
            goods: ['electronics', 'luxury_goods'],
            volume: 500,
            frequency: 3,
            profitMargin: 0.35,
            travelTime: 48,
            securityLevel: 0.8,
            competitionLevel: 0.4,
            demand: 0.9
          }
        ] : [],
        sensorContacts: [
          {
            contactId: 'contact_unknown_1',
            position: {
              systemId: 'outer_rim_7',
              coordinates: { x: 800, y: 600, z: 90 }
            },
            type: 'unknown',
            size: 3,
            signature: 'stealth_variant',
            detectedAt: new Date(Date.now() - 900000),
            confidence: 0.6,
            range: 180
          }
        ]
      },
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      data: spatialIntelligence
    });
  } catch (error) {
    console.error('Error fetching character spatial intelligence:', error);
    res.status(500).json({
      error: 'Failed to fetch character spatial intelligence',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/characters/spatial/scan - Perform spatial scan
 */
router.post('/spatial/scan', async (req, res) => {
  try {
    const {
      characterId,
      scanType = 'general',
      targetPosition,
      scanRange = 100,
      scanDuration = 30
    } = req.body;

    if (!characterId) {
      return res.status(400).json({
        error: 'Missing required field: characterId'
      });
    }

    const scanResult = {
      scanId: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      characterId,
      scanType,
      targetPosition: targetPosition || {
        systemId: 'scan_target',
        coordinates: { x: 500, y: 300, z: 50 }
      },
      scanRange,
      scanDuration,
      status: 'in_progress',
      startTime: new Date(),
      estimatedCompletion: new Date(Date.now() + scanDuration * 1000),
      detectedContacts: Math.floor(Math.random() * 5) + 1,
      anomaliesFound: Math.floor(Math.random() * 3),
      resourceSignatures: Math.floor(Math.random() * 4),
      threatAssessment: {
        level: Math.floor(Math.random() * 10) + 1,
        confidence: Math.random()
      }
    };

    res.status(201).json({
      success: true,
      data: scanResult
    });
  } catch (error) {
    console.error('Error initiating spatial scan:', error);
    res.status(500).json({
      error: 'Failed to initiate spatial scan',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/characters/spatial/distances - Calculate distances and travel times
 */
router.get('/spatial/distances', async (req, res) => {
  try {
    const { 
      origin, 
      destinations, 
      fleetSpeed = 1.0,
      includeHazards = true 
    } = req.query;

    if (!origin || !destinations) {
      return res.status(400).json({
        error: 'Missing required parameters: origin, destinations'
      });
    }

    const originPos = JSON.parse(origin as string);
    const destArray = JSON.parse(destinations as string);

    const distanceCalculations = destArray.map((dest: any, index: number) => {
      const dx = originPos.coordinates.x - dest.coordinates.x;
      const dy = originPos.coordinates.y - dest.coordinates.y;
      const dz = originPos.coordinates.z - dest.coordinates.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      const baseTime = distance / Number(fleetSpeed);
      const hazardFactor = includeHazards === 'true' ? 1 + Math.random() * 0.3 : 1;
      const travelTime = baseTime * hazardFactor;

      return {
        destinationId: dest.systemId,
        destination: dest,
        distance: Math.round(distance * 100) / 100,
        travelTime: Math.round(travelTime * 100) / 100,
        hazardFactor: includeHazards === 'true' ? Math.round(hazardFactor * 100) / 100 : 1,
        fuelRequired: Math.round(distance * 0.1 * 100) / 100,
        recommendedRoute: `Direct route via ${Math.random() > 0.5 ? 'hyperspace' : 'subspace'}`
      };
    });

    res.json({
      success: true,
      data: {
        origin: originPos,
        calculations: distanceCalculations,
        calculatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error calculating distances:', error);
    res.status(500).json({
      error: 'Failed to calculate distances',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== MILITARY INTELLIGENCE =====

/**
 * GET /api/characters/military/intelligence - Get military intelligence summary
 */
router.get('/military/intelligence', async (req, res) => {
  try {
    const { characterId, civilizationId, threatLevel = 'all' } = req.query;

    if (!characterId && !civilizationId) {
      return res.status(400).json({
        error: 'Missing required parameter: characterId or civilizationId'
      });
    }

    const militaryIntelligence = {
      characterId: characterId || `${civilizationId}_military_commander`,
      civilizationId,
      threatLevel,
      generatedAt: new Date(),
      
      fleetMovements: [
        {
          fleetId: 'enemy_task_force_alpha',
          currentPosition: { systemId: 'border_system_12', coordinates: { x: 400, y: 250, z: 35 } },
          lastKnownPosition: { systemId: 'border_system_11', coordinates: { x: 380, y: 240, z: 30 } },
          movementVector: { x: 20, y: 10, z: 5 },
          estimatedDestination: { systemId: 'strategic_target_1', coordinates: { x: 450, y: 280, z: 45 } },
          estimatedArrival: new Date(Date.now() + 7200000), // 2 hours
          threatLevel: 9,
          confidence: 0.8
        }
      ],
      
      strategicAssessment: {
        overallThreatLevel: 7,
        immediateThreats: 2,
        longTermThreats: 1,
        friendlyForceStrength: 0.75,
        enemyForceStrength: 0.85,
        strategicBalance: -0.1,
        recommendedActions: [
          'Reinforce border systems 10-15',
          'Deploy reconnaissance to outer rim',
          'Prepare defensive positions at strategic targets'
        ]
      },
      
      intelligenceNetworkStatus: {
        coverage: 0.8,
        reliability: 0.75,
        activeAgents: 12,
        compromisedAssets: 1,
        recentIntelligence: 8,
        criticalGaps: ['enemy_home_systems', 'supply_lines']
      }
    };

    res.json({
      success: true,
      data: militaryIntelligence
    });
  } catch (error) {
    console.error('Error fetching military intelligence:', error);
    res.status(500).json({
      error: 'Failed to fetch military intelligence',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== TRADE & ECONOMIC INTELLIGENCE =====

/**
 * GET /api/characters/trade/opportunities - Get trade opportunities analysis
 */
router.get('/trade/opportunities', async (req, res) => {
  try {
    const { characterId, maxDistance = 500, minProfitMargin = 0.1 } = req.query;

    if (!characterId) {
      return res.status(400).json({
        error: 'Missing required parameter: characterId'
      });
    }

    const tradeOpportunities = {
      characterId,
      analysisParameters: {
        maxDistance: Number(maxDistance),
        minProfitMargin: Number(minProfitMargin)
      },
      generatedAt: new Date(),
      
      opportunities: [
        {
          opportunityId: 'trade_opp_1',
          type: 'arbitrage',
          goods: 'rare_minerals',
          buyLocation: {
            systemId: 'mining_system_7',
            coordinates: { x: 300, y: 200, z: 25 },
            price: 450,
            availability: 1000
          },
          sellLocation: {
            systemId: 'industrial_hub_3',
            coordinates: { x: 600, y: 400, z: 55 },
            price: 720,
            demand: 800
          },
          distance: 360,
          travelTime: 36,
          profitMargin: 0.6,
          riskLevel: 0.3,
          competitionLevel: 0.4,
          recommendedVolume: 500
        }
      ],
      
      marketAnalysis: {
        hotCommodities: ['rare_minerals', 'energy_cells', 'luxury_goods'],
        emergingMarkets: ['outer_rim_colonies', 'research_stations'],
        priceVolatility: {
          high: ['energy_cells'],
          medium: ['rare_minerals'],
          low: ['basic_materials']
        },
        supplyChainDisruptions: [
          {
            location: 'trade_route_gamma',
            cause: 'pirate_activity',
            impact: 'moderate',
            estimatedDuration: '2-3 weeks'
          }
        ]
      }
    };

    res.json({
      success: true,
      data: tradeOpportunities
    });
  } catch (error) {
    console.error('Error fetching trade opportunities:', error);
    res.status(500).json({
      error: 'Failed to fetch trade opportunities',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== SENSOR SYSTEMS =====

/**
 * GET /api/characters/sensors/contacts - Get sensor contacts
 */
router.get('/sensors/contacts', async (req, res) => {
  try {
    const { 
      characterId, 
      range = 200, 
      contactType = 'all',
      minConfidence = 0.3 
    } = req.query;

    if (!characterId) {
      return res.status(400).json({
        error: 'Missing required parameter: characterId'
      });
    }

    const sensorContacts = {
      characterId,
      scanParameters: {
        range: Number(range),
        contactType,
        minConfidence: Number(minConfidence)
      },
      scanTime: new Date(),
      
      contacts: [
        {
          contactId: 'contact_1',
          position: {
            systemId: 'detected_system_1',
            coordinates: { x: 480, y: 290, z: 48 }
          },
          type: 'fleet',
          size: 8,
          signature: 'military_standard',
          detectedAt: new Date(Date.now() - 1800000),
          confidence: 0.9,
          range: 150,
          classification: 'enemy_patrol',
          movementDetected: true,
          lastMovement: new Date(Date.now() - 900000)
        },
        {
          contactId: 'contact_2',
          position: {
            systemId: 'detected_system_2',
            coordinates: { x: 520, y: 340, z: 62 }
          },
          type: 'station',
          size: 1,
          signature: 'civilian_commercial',
          detectedAt: new Date(Date.now() - 3600000),
          confidence: 0.95,
          range: 180,
          classification: 'trade_station',
          movementDetected: false
        }
      ],
      
      sensorStatus: {
        operationalSensors: 8,
        degradedSensors: 1,
        offlineSensors: 0,
        overallEfficiency: 0.9,
        maxRange: Number(range),
        currentCoverage: 0.85
      }
    };

    res.json({
      success: true,
      data: sensorContacts
    });
  } catch (error) {
    console.error('Error fetching sensor contacts:', error);
    res.status(500).json({
      error: 'Failed to fetch sensor contacts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'spatial', spatialKnobSystem, applySpatialKnobsToCharacterAI);

export default router;
