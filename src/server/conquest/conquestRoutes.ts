/**
 * Conquest System API Routes - Production
 * 
 * RESTful API endpoints for planetary conquest, civilization merging,
 * and territorial integration management.
 */

import express from 'express';
import { Pool } from 'pg';
import { ConquestService } from './ConquestService.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = express.Router();

// Enhanced AI Knobs for Conquest System
const conquestKnobsData = {
  // Military Strategy & Operations
  military_aggression_level: 0.5,        // Military aggression and force projection level
  conquest_priority: 0.6,                // Conquest campaign prioritization and resource allocation
  defensive_posture: 0.7,                // Defensive strategy and fortification emphasis
  strategic_patience: 0.5,               // Campaign timing and strategic patience level
  
  // Diplomatic & Political Approach
  diplomatic_conquest_preference: 0.4,   // Preference for diplomatic vs military solutions
  alliance_formation_priority: 0.6,      // Alliance building and coalition formation priority
  negotiation_flexibility: 0.5,          // Negotiation stance and compromise willingness
  cultural_assimilation_focus: 0.6,      // Cultural integration and assimilation emphasis
  
  // Resource Management & Economics
  conquest_resource_allocation: 0.7,     // Resource allocation to conquest operations
  integration_investment: 0.6,           // Investment in post-conquest integration processes
  infrastructure_development: 0.5,       // Infrastructure development in conquered territories
  economic_exploitation_balance: 0.4,    // Balance between exploitation and development
  
  // Integration & Governance Strategy
  integration_speed_priority: 0.5,       // Integration process speed vs thoroughness
  cultural_preservation: 0.6,            // Preservation of conquered civilizations' cultures
  population_relocation: 0.3,            // Population movement and resettlement policies
  governance_model_adaptation: 0.7,      // Adaptation of governance models for integration
  
  // Intelligence & Information Operations
  intelligence_gathering_focus: 0.8,     // Intelligence collection and analysis priority
  sabotage_operations: 0.3,              // Covert sabotage and disruption operations
  propaganda_campaigns: 0.5,             // Information warfare and propaganda efforts
  counter_intelligence: 0.7,             // Counter-intelligence and security measures
  
  // Risk Management & Security
  occupation_security_level: 0.8,        // Security measures in occupied territories
  resistance_suppression: 0.4,           // Resistance movement suppression intensity
  civilian_protection_priority: 0.8,     // Civilian population protection and welfare
  territorial_consolidation: 0.6,        // Territorial control consolidation efforts
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Conquest
const conquestKnobSystem = new EnhancedKnobSystem(conquestKnobsData);

// Apply conquest knobs to game state
function applyConquestKnobsToGameState() {
  const knobs = conquestKnobSystem.knobs;
  
  // Apply military strategy settings
  const militaryStrategy = (knobs.military_aggression_level + knobs.conquest_priority + 
    knobs.defensive_posture + knobs.strategic_patience) / 4;
  
  // Apply diplomatic approach settings
  const diplomaticApproach = (knobs.diplomatic_conquest_preference + knobs.alliance_formation_priority + 
    knobs.negotiation_flexibility + knobs.cultural_assimilation_focus) / 4;
  
  // Apply resource management settings
  const resourceManagement = (knobs.conquest_resource_allocation + knobs.integration_investment + 
    knobs.infrastructure_development + knobs.economic_exploitation_balance) / 4;
  
  // Apply integration strategy settings
  const integrationStrategy = (knobs.integration_speed_priority + knobs.cultural_preservation + 
    knobs.population_relocation + knobs.governance_model_adaptation) / 4;
  
  // Apply intelligence operations settings
  const intelligenceOperations = (knobs.intelligence_gathering_focus + knobs.sabotage_operations + 
    knobs.propaganda_campaigns + knobs.counter_intelligence) / 4;
  
  // Apply risk management settings
  const riskManagement = (knobs.occupation_security_level + knobs.resistance_suppression + 
    knobs.civilian_protection_priority + knobs.territorial_consolidation) / 4;
  
  console.log('Applied conquest knobs to game state:', {
    militaryStrategy,
    diplomaticApproach,
    resourceManagement,
    integrationStrategy,
    intelligenceOperations,
    riskManagement
  });
}

// Initialize service (will be properly injected in production)
let conquestService: ConquestService;

// Middleware to ensure service is initialized
router.use((req, res, next) => {
  if (!conquestService && req.app.locals.pool) {
    conquestService = new ConquestService(req.app.locals.pool as Pool);
  }
  next();
});

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Conquest System',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    capabilities: [
      'planetary_conquest',
      'civilization_merging',
      'territorial_integration',
      'campaign_management',
      'intelligence_operations'
    ]
  });
});

/**
 * Get all active conquest campaigns
 */
router.get('/campaigns/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const campaigns = await conquestService.getActiveCampaigns(civilizationId);
    
    res.json({
      success: true,
      campaigns,
      total: campaigns.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get conquest campaigns',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Initiate new conquest campaign
 */
router.post('/campaigns', async (req, res) => {
  try {
    const {
      civilizationId,
      targetPlanetId,
      campaignType,
      objectives,
      resources,
      timeline
    } = req.body;

    if (!civilizationId || !targetPlanetId || !campaignType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['civilizationId', 'targetPlanetId', 'campaignType']
      });
    }

    const campaign = await conquestService.initiateCampaign({
      civilizationId,
      targetPlanetId,
      campaignType,
      objectives,
      resources,
      timeline
    });

    res.status(201).json({
      success: true,
      campaign,
      message: 'Conquest campaign initiated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to initiate conquest campaign',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Update campaign progress
 */
router.put('/campaigns/:campaignId/progress', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { progress, events, casualties, resources } = req.body;

    const updatedCampaign = await conquestService.updateCampaignProgress(
      campaignId,
      { progress, events, casualties, resources }
    );

    res.json({
      success: true,
      campaign: updatedCampaign,
      message: 'Campaign progress updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update campaign progress',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Complete conquest campaign
 */
router.post('/campaigns/:campaignId/complete', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { outcome, spoils, integration_plan } = req.body;

    const result = await conquestService.completeCampaign(campaignId, {
      outcome,
      spoils,
      integration_plan
    });

    res.json({
      success: true,
      result,
      message: 'Conquest campaign completed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to complete conquest campaign',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Discover new planet
 */
router.post('/discovery', async (req, res) => {
  try {
    const {
      civilizationId,
      planetData,
      discoveryMethod,
      explorationTeam
    } = req.body;

    if (!civilizationId || !planetData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['civilizationId', 'planetData']
      });
    }

    const discovery = await conquestService.discoverPlanet({
      civilizationId,
      planetData,
      discoveryMethod,
      explorationTeam
    });

    res.status(201).json({
      success: true,
      discovery,
      message: 'Planet discovered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to discover planet',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Claim discovered planet
 */
router.post('/claim', async (req, res) => {
  try {
    const {
      civilizationId,
      planetId,
      claimType,
      justification,
      resources
    } = req.body;

    if (!civilizationId || !planetId || !claimType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['civilizationId', 'planetId', 'claimType']
      });
    }

    const claim = await conquestService.claimPlanet({
      civilizationId,
      planetId,
      claimType,
      justification,
      resources
    });

    res.status(201).json({
      success: true,
      claim,
      message: 'Planet claimed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to claim planet',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Start integration process for conquered territory
 */
router.post('/integration', async (req, res) => {
  try {
    const {
      civilizationId,
      territoryId,
      integrationPlan,
      timeline,
      resources
    } = req.body;

    if (!civilizationId || !territoryId || !integrationPlan) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['civilizationId', 'territoryId', 'integrationPlan']
      });
    }

    const integration = await conquestService.startIntegrationProcess({
      civilizationId,
      territoryId,
      integrationPlan,
      timeline,
      resources
    });

    res.status(201).json({
      success: true,
      integration,
      message: 'Integration process started successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to start integration process',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get integration progress for territory
 */
router.get('/integration/:territoryId', async (req, res) => {
  try {
    const { territoryId } = req.params;
    const integration = await conquestService.getIntegrationProgress(territoryId);
    
    res.json({
      success: true,
      integration,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get integration progress',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Update integration progress
 */
router.put('/integration/:territoryId/progress', async (req, res) => {
  try {
    const { territoryId } = req.params;
    const { phase, progress, events, challenges } = req.body;

    const updatedIntegration = await conquestService.updateIntegrationProgress(
      territoryId,
      { phase, progress, events, challenges }
    );

    res.json({
      success: true,
      integration: updatedIntegration,
      message: 'Integration progress updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update integration progress',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Complete integration process
 */
router.post('/integration/:territoryId/complete', async (req, res) => {
  try {
    const { territoryId } = req.params;
    const { outcome, benefits, ongoing_challenges } = req.body;

    const result = await conquestService.completeIntegration(territoryId, {
      outcome,
      benefits,
      ongoing_challenges
    });

    res.json({
      success: true,
      result,
      message: 'Integration process completed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to complete integration process',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get conquest analytics and metrics
 */
router.get('/analytics/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const analytics = await conquestService.getConquestAnalytics(civilizationId);
    
    res.json({
      success: true,
      analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get conquest analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'conquest', conquestKnobSystem, applyConquestKnobsToGameState);

export default router;
