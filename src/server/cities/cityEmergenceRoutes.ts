/**
 * City Emergence API Routes
 * 
 * RESTful API endpoints for the City Emergence System
 */

import express from 'express';
import { Pool } from 'pg';
import { CityEmergenceEngine } from './CityEmergenceEngine.js';
import { CityEmergenceService, initializeCityEmergenceSchema } from './cityEmergenceSchema.js';

const router = express.Router();
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

export default router;
