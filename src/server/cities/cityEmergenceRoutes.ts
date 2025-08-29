/**
 * City Emergence API Routes
 * 
 * RESTful API endpoints for the City Emergence System
 */

import express from 'express';
import { Pool } from 'pg';
import { CityEmergenceEngine } from './CityEmergenceEngine';
import { CityEmergenceService, initializeCityEmergenceSchema } from './cityEmergenceSchema';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = express.Router();

// Enhanced AI Knobs for City Emergence System
const cityEmergenceKnobsData = {
  // Urban Planning & Development
  urban_planning_sophistication: 0.8,        // Urban planning sophistication and strategic development
  zoning_regulation_effectiveness: 0.7,      // Zoning regulation effectiveness and land use optimization
  infrastructure_development_priority: 0.8,  // Infrastructure development priority and investment focus
  
  // Population Growth & Settlement
  population_growth_accommodation: 0.8,      // Population growth accommodation and housing provision
  migration_attraction_capability: 0.7,      // Migration attraction capability and settlement appeal
  demographic_diversity_promotion: 0.7,      // Demographic diversity promotion and inclusive growth
  
  // Economic Development & Opportunity
  economic_opportunity_creation: 0.8,        // Economic opportunity creation and job market development
  business_district_development: 0.7,        // Business district development and commercial growth
  industrial_zone_optimization: 0.7,         // Industrial zone optimization and manufacturing efficiency
  
  // Transportation & Connectivity
  transportation_network_expansion: 0.8,     // Transportation network expansion and mobility enhancement
  public_transit_system_quality: 0.7,        // Public transit system quality and accessibility
  inter_city_connectivity_strength: 0.7,     // Inter-city connectivity strength and regional integration
  
  // Environmental Sustainability & Resilience
  environmental_sustainability_emphasis: 0.7, // Environmental sustainability emphasis and green development
  climate_resilience_planning: 0.8,          // Climate resilience planning and adaptation strategies
  natural_resource_conservation: 0.7,        // Natural resource conservation and environmental protection
  
  // Social Infrastructure & Services
  social_infrastructure_investment: 0.8,     // Social infrastructure investment and public service quality
  educational_facility_development: 0.8,     // Educational facility development and learning opportunities
  healthcare_system_expansion: 0.8,          // Healthcare system expansion and medical service access
  
  // Cultural Development & Identity
  cultural_identity_preservation: 0.7,       // Cultural identity preservation and heritage protection
  arts_culture_promotion: 0.6,               // Arts and culture promotion and creative community support
  community_engagement_facilitation: 0.7,    // Community engagement facilitation and civic participation
  
  // Innovation & Technology Integration
  smart_city_technology_adoption: 0.7,       // Smart city technology adoption and digital infrastructure
  innovation_hub_development: 0.7,           // Innovation hub development and tech ecosystem growth
  digital_governance_implementation: 0.6,    // Digital governance implementation and e-government services
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for City Emergence
const cityEmergenceKnobSystem = new EnhancedKnobSystem(cityEmergenceKnobsData);

// Apply city emergence knobs to game state
function applyCityEmergenceKnobsToGameState() {
  const knobs = cityEmergenceKnobSystem.knobs;
  
  // Apply urban planning settings
  const urbanPlanning = (knobs.urban_planning_sophistication + knobs.zoning_regulation_effectiveness + 
    knobs.infrastructure_development_priority) / 3;
  
  // Apply population growth settings
  const populationGrowth = (knobs.population_growth_accommodation + knobs.migration_attraction_capability + 
    knobs.demographic_diversity_promotion) / 3;
  
  // Apply economic development settings
  const economicDevelopment = (knobs.economic_opportunity_creation + knobs.business_district_development + 
    knobs.industrial_zone_optimization) / 3;
  
  // Apply transportation settings
  const transportation = (knobs.transportation_network_expansion + knobs.public_transit_system_quality + 
    knobs.inter_city_connectivity_strength) / 3;
  
  // Apply environmental sustainability settings
  const environmentalSustainability = (knobs.environmental_sustainability_emphasis + knobs.climate_resilience_planning + 
    knobs.natural_resource_conservation) / 3;
  
  // Apply social infrastructure settings
  const socialInfrastructure = (knobs.social_infrastructure_investment + knobs.educational_facility_development + 
    knobs.healthcare_system_expansion) / 3;
  
  console.log('Applied city emergence knobs to game state:', {
    urbanPlanning,
    populationGrowth,
    economicDevelopment,
    transportation,
    environmentalSustainability,
    socialInfrastructure
  });
}

let emergenceEngine: CityEmergenceEngine;
let emergenceService: CityEmergenceService;

export function initializeCityEmergenceService(pool: Pool): void {
  emergenceEngine = new CityEmergenceEngine(pool);
  emergenceService = new CityEmergenceService(pool);
  
  // Initialize schema
  initializeCityEmergenceSchema(pool).catch(error => {
    console.error('Failed to initialize City Emergence schema:', error);
  });
}

export function getCityEmergenceEngine(): CityEmergenceEngine {
  if (!emergenceEngine) {
    throw new Error('City Emergence Engine not initialized');
  }
  return emergenceEngine;
}

export function getCityEmergenceService(): CityEmergenceService {
  if (!emergenceService) {
    throw new Error('City Emergence Service not initialized');
  }
  return emergenceService;
}

// Get civilization expansion analysis
router.get('/expansion/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    
    if (isNaN(civilizationId)) {
      return res.status(400).json({ error: 'Invalid civilization ID' });
    }

    const expansionState = await emergenceEngine.analyzeCivilizationExpansion(civilizationId);
    const metrics = await emergenceService.getExpansionMetrics(civilizationId);
    
    res.json({
      expansionState,
      latestMetrics: metrics,
      emergenceReadiness: expansionState.expansionPressure >= 30,
      recommendedAction: expansionState.expansionPressure >= 70 ? 'immediate_expansion' :
                        expansionState.expansionPressure >= 50 ? 'prepare_expansion' :
                        expansionState.expansionPressure >= 30 ? 'monitor_conditions' : 'no_action'
    });

  } catch (error) {
    console.error('Error analyzing expansion:', error);
    res.status(500).json({ error: 'Failed to analyze expansion' });
  }
});

// Evaluate potential city emergence
router.post('/evaluate/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    
    if (isNaN(civilizationId)) {
      return res.status(400).json({ error: 'Invalid civilization ID' });
    }

    const newCities = await emergenceEngine.evaluateEmergence(civilizationId);
    
    // Record the evaluation metrics
    const expansionState = await emergenceEngine.analyzeCivilizationExpansion(civilizationId);
    await emergenceService.recordExpansionMetrics({
      civilization_id: civilizationId,
      evaluation_date: new Date(),
      current_cities: expansionState.currentCities,
      total_population: expansionState.totalPopulation,
      economic_output: expansionState.economicOutput,
      expansion_pressure: expansionState.expansionPressure,
      available_territory: expansionState.availableTerritory,
      technology_level: expansionState.technologyLevel,
      months_since_last_expansion: Math.floor(
        (Date.now() - expansionState.lastExpansion.getTime()) / (1000 * 60 * 60 * 24 * 30)
      ),
      expansion_readiness_score: expansionState.expansionPressure,
      recommended_action: newCities.length > 0 ? 'expansion_occurred' : 'conditions_not_met'
    });

    res.json({
      success: true,
      newCitiesEmerged: newCities.length,
      newCities,
      expansionPressure: expansionState.expansionPressure,
      message: newCities.length > 0 ? 
        `${newCities.length} new city(ies) emerged: ${newCities.join(', ')}` :
        'No new cities emerged - conditions not met'
    });

  } catch (error) {
    console.error('Error evaluating emergence:', error);
    res.status(500).json({ error: 'Failed to evaluate emergence' });
  }
});

// Get emergence history
router.get('/history/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    const limit = parseInt(req.query.limit as string) || 20;
    
    if (isNaN(civilizationId)) {
      return res.status(400).json({ error: 'Invalid civilization ID' });
    }

    const history = await emergenceService.getEmergenceHistory(civilizationId, limit);
    
    res.json({
      history,
      totalEmergences: history.length,
      emergenceRate: history.length > 0 ? 
        history.length / Math.max(1, Math.floor((Date.now() - new Date(history[history.length - 1]?.founded_date || Date.now()).getTime()) / (1000 * 60 * 60 * 24 * 30))) :
        0
    });

  } catch (error) {
    console.error('Error fetching emergence history:', error);
    res.status(500).json({ error: 'Failed to fetch emergence history' });
  }
});

// Get potential emergence locations
router.get('/locations/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    const limit = parseInt(req.query.limit as string) || 5;
    
    if (isNaN(civilizationId)) {
      return res.status(400).json({ error: 'Invalid civilization ID' });
    }

    const locations = await emergenceService.getPotentialLocations(civilizationId, limit);
    
    res.json({
      potentialLocations: locations,
      totalLocations: locations.length,
      bestLocation: locations[0] || null
    });

  } catch (error) {
    console.error('Error fetching potential locations:', error);
    res.status(500).json({ error: 'Failed to fetch potential locations' });
  }
});

// Update emergence condition settings
router.put('/conditions/:civilizationId/:conditionId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    const conditionId = req.params.conditionId;
    const { isEnabled, priorityModifier, customRequirements } = req.body;
    
    if (isNaN(civilizationId)) {
      return res.status(400).json({ error: 'Invalid civilization ID' });
    }

    const updatedCondition = await emergenceService.updateEmergenceCondition(
      civilizationId,
      conditionId,
      { isEnabled, priorityModifier, customRequirements }
    );

    if (!updatedCondition) {
      return res.status(404).json({ error: 'Emergence condition not found' });
    }

    res.json({
      success: true,
      condition: updatedCondition,
      message: `Emergence condition ${conditionId} updated successfully`
    });

  } catch (error) {
    console.error('Error updating emergence condition:', error);
    res.status(500).json({ error: 'Failed to update emergence condition' });
  }
});

// Force city emergence (admin/testing)
router.post('/force/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    const { conditionId, locationOverride } = req.body;
    
    if (isNaN(civilizationId)) {
      return res.status(400).json({ error: 'Invalid civilization ID' });
    }

    // This would be used for testing or admin purposes
    // Implementation would force a city emergence regardless of normal conditions
    
    res.json({
      success: true,
      message: 'Force emergence functionality - implementation pending',
      note: 'This endpoint is for testing/admin purposes only'
    });

  } catch (error) {
    console.error('Error forcing emergence:', error);
    res.status(500).json({ error: 'Failed to force emergence' });
  }
});

// Get emergence analytics
router.get('/analytics/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    
    if (isNaN(civilizationId)) {
      return res.status(400).json({ error: 'Invalid civilization ID' });
    }

    const history = await emergenceService.getEmergenceHistory(civilizationId, 50);
    const metrics = await emergenceService.getExpansionMetrics(civilizationId);
    
    // Calculate analytics
    const emergencesByCondition = history.reduce((acc, emergence) => {
      acc[emergence.emergence_condition_id] = (acc[emergence.emergence_condition_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const emergencesByTerrain = history.reduce((acc, emergence) => {
      acc[emergence.terrain] = (acc[emergence.terrain] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageInitialPopulation = history.length > 0 ?
      history.reduce((sum, e) => sum + e.initial_population, 0) / history.length : 0;

    const emergenceFrequency = history.length > 1 ? 
      (Date.now() - new Date(history[history.length - 1].founded_date).getTime()) / 
      (history.length - 1) / (1000 * 60 * 60 * 24 * 30) : 0; // months between emergences

    res.json({
      totalEmergences: history.length,
      emergencesByCondition,
      emergencesByTerrain,
      averageInitialPopulation: Math.round(averageInitialPopulation),
      emergenceFrequency: Math.round(emergenceFrequency * 10) / 10, // months
      currentExpansionPressure: metrics?.expansion_pressure || 0,
      recommendedAction: metrics?.recommended_action || 'insufficient_data',
      lastEmergence: history[0] || null
    });

  } catch (error) {
    console.error('Error fetching emergence analytics:', error);
    res.status(500).json({ error: 'Failed to fetch emergence analytics' });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'city-emergence', cityEmergenceKnobSystem, applyCityEmergenceKnobsToGameState);

export default router;
