import express from 'express';
import { getFiscalSimulationService } from './FiscalSimulationService.js';

const router = express.Router();

/**
 * GET /api/fiscal-simulation/effects/:civilization - Get fiscal policy effects
 */
router.get('/effects/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const policyType = req.query.policy_type as string;
    const policyCategory = req.query.policy_category as string;
    const activeOnly = req.query.active_only === 'true';
    
    const service = getFiscalSimulationService();
    const effects = await service.getFiscalPolicyEffects(civilizationId, {
      policy_type: policyType,
      policy_category: policyCategory,
      active_only: activeOnly
    });

    res.json({
      success: true,
      data: effects,
      count: effects.length
    });
  } catch (error) {
    console.error('Error fetching fiscal policy effects:', error);
    res.status(500).json({
      error: 'Failed to fetch fiscal policy effects',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/fiscal-simulation/effects/calculate - Calculate fiscal policy effect
 */
router.post('/effects/calculate', async (req, res) => {
  try {
    const { civilization_id, policy_type, policy_category, amount } = req.body;
    
    if (!civilization_id || !policy_type || !policy_category || !amount) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'civilization_id, policy_type, policy_category, and amount are required'
      });
    }

    const service = getFiscalSimulationService();
    const effect = await service.calculateFiscalEffect(
      civilization_id, 
      policy_type, 
      policy_category, 
      amount
    );

    res.json({
      success: true,
      data: effect,
      message: 'Fiscal policy effect calculated successfully'
    });
  } catch (error) {
    console.error('Error calculating fiscal policy effect:', error);
    res.status(500).json({
      error: 'Failed to calculate fiscal policy effect',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/fiscal-simulation/effects/apply - Apply fiscal policy effect
 */
router.post('/effects/apply', async (req, res) => {
  try {
    const { effect_id } = req.body;
    
    if (!effect_id) {
      return res.status(400).json({
        error: 'Missing effect ID',
        message: 'effect_id is required'
      });
    }

    const service = getFiscalSimulationService();
    await service.applyFiscalEffect(effect_id);

    res.json({
      success: true,
      message: 'Fiscal policy effect applied successfully'
    });
  } catch (error) {
    console.error('Error applying fiscal policy effect:', error);
    res.status(500).json({
      error: 'Failed to apply fiscal policy effect',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/fiscal-simulation/effects/update-progress - Update implementation progress
 */
router.put('/effects/update-progress', async (req, res) => {
  try {
    const service = getFiscalSimulationService();
    await service.updateFiscalEffectProgress();

    res.json({
      success: true,
      message: 'Fiscal effect progress updated successfully'
    });
  } catch (error) {
    console.error('Error updating fiscal effect progress:', error);
    res.status(500).json({
      error: 'Failed to update fiscal effect progress',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/fiscal-simulation/state/:civilization - Get simulation state
 */
router.get('/state/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const modifierType = req.query.modifier_type as string;
    
    const service = getFiscalSimulationService();
    const state = await service.getSimulationState(civilizationId, modifierType);

    res.json({
      success: true,
      data: state,
      count: state.length
    });
  } catch (error) {
    console.error('Error fetching simulation state:', error);
    res.status(500).json({
      error: 'Failed to fetch simulation state',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/fiscal-simulation/state/:civilization/modifiers/:type/:category - Get specific modifier
 */
router.get('/state/:civilization/modifiers/:type/:category', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const modifierType = req.params.type;
    const modifierCategory = req.params.category;
    
    const service = getFiscalSimulationService();
    const modifier = await service.getSimulationModifier(civilizationId, modifierType, modifierCategory);

    if (!modifier) {
      return res.status(404).json({
        error: 'Simulation modifier not found',
        message: `No modifier found for ${modifierType}/${modifierCategory}`
      });
    }

    res.json({
      success: true,
      data: modifier
    });
  } catch (error) {
    console.error('Error fetching simulation modifier:', error);
    res.status(500).json({
      error: 'Failed to fetch simulation modifier',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/fiscal-simulation/state/:civilization/modifiers/:type/:category - Update modifier
 */
router.put('/state/:civilization/modifiers/:type/:category', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const modifierType = req.params.type;
    const modifierCategory = req.params.category;
    
    const service = getFiscalSimulationService();
    const modifier = await service.updateSimulationModifier(
      civilizationId, 
      modifierType, 
      modifierCategory, 
      req.body
    );

    res.json({
      success: true,
      data: modifier,
      message: 'Simulation modifier updated successfully'
    });
  } catch (error) {
    console.error('Error updating simulation modifier:', error);
    res.status(500).json({
      error: 'Failed to update simulation modifier',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/fiscal-simulation/behavioral/calculate - Calculate tax behavioral effect
 */
router.post('/behavioral/calculate', async (req, res) => {
  try {
    const { civilization_id, tax_type, old_rate, new_rate } = req.body;
    
    if (!civilization_id || !tax_type || old_rate === undefined || new_rate === undefined) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'civilization_id, tax_type, old_rate, and new_rate are required'
      });
    }

    const service = getFiscalSimulationService();
    const effect = await service.calculateTaxBehavioralEffect(
      civilization_id, 
      tax_type, 
      old_rate, 
      new_rate
    );

    res.json({
      success: true,
      data: effect,
      message: 'Tax behavioral effect calculated successfully'
    });
  } catch (error) {
    console.error('Error calculating tax behavioral effect:', error);
    res.status(500).json({
      error: 'Failed to calculate tax behavioral effect',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/fiscal-simulation/behavioral/:civilization - Get behavioral effects
 */
router.get('/behavioral/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const taxType = req.query.tax_type as string;
    
    const service = getFiscalSimulationService();
    const effects = await service.getBehavioralEffects(civilizationId, taxType);

    res.json({
      success: true,
      data: effects,
      count: effects.length
    });
  } catch (error) {
    console.error('Error fetching behavioral effects:', error);
    res.status(500).json({
      error: 'Failed to fetch behavioral effects',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/fiscal-simulation/inflation/update - Update inflation impact
 */
router.post('/inflation/update', async (req, res) => {
  try {
    const { civilization_id, inflation_rate } = req.body;
    
    if (!civilization_id || inflation_rate === undefined) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'civilization_id and inflation_rate are required'
      });
    }

    const service = getFiscalSimulationService();
    const impact = await service.updateInflationImpact(civilization_id, inflation_rate);

    res.json({
      success: true,
      data: impact,
      message: 'Inflation impact updated successfully'
    });
  } catch (error) {
    console.error('Error updating inflation impact:', error);
    res.status(500).json({
      error: 'Failed to update inflation impact',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/fiscal-simulation/inflation/:civilization - Get inflation impacts
 */
router.get('/inflation/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const days = req.query.days ? parseInt(req.query.days as string) : undefined;
    
    const service = getFiscalSimulationService();
    const impacts = await service.getInflationImpacts(civilizationId, days);

    res.json({
      success: true,
      data: impacts,
      count: impacts.length
    });
  } catch (error) {
    console.error('Error fetching inflation impacts:', error);
    res.status(500).json({
      error: 'Failed to fetch inflation impacts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/fiscal-simulation/narrative/:civilization - Get narrative inputs
 */
router.get('/narrative/:civilization', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    const unprocessedOnly = req.query.unprocessed_only === 'true';
    
    const service = getFiscalSimulationService();
    const inputs = await service.getNarrativeInputs(civilizationId, unprocessedOnly);

    res.json({
      success: true,
      data: inputs,
      count: inputs.length
    });
  } catch (error) {
    console.error('Error fetching narrative inputs:', error);
    res.status(500).json({
      error: 'Failed to fetch narrative inputs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/fiscal-simulation/narrative/process - Mark narrative inputs as processed
 */
router.put('/narrative/process', async (req, res) => {
  try {
    const { input_ids } = req.body;
    
    if (!input_ids || !Array.isArray(input_ids)) {
      return res.status(400).json({
        error: 'Invalid input IDs',
        message: 'input_ids must be an array of numbers'
      });
    }

    const service = getFiscalSimulationService();
    await service.markNarrativeInputsProcessed(input_ids);

    res.json({
      success: true,
      message: 'Narrative inputs marked as processed'
    });
  } catch (error) {
    console.error('Error processing narrative inputs:', error);
    res.status(500).json({
      error: 'Failed to process narrative inputs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/fiscal-simulation/analytics/:civilization/impact-summary - Get fiscal impact summary
 */
router.get('/analytics/:civilization/impact-summary', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    
    const service = getFiscalSimulationService();
    const summary = await service.getFiscalImpactSummary(civilizationId);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching fiscal impact summary:', error);
    res.status(500).json({
      error: 'Failed to fetch fiscal impact summary',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/fiscal-simulation/analytics/:civilization/state-summary - Get simulation state summary
 */
router.get('/analytics/:civilization/state-summary', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilization);
    
    const service = getFiscalSimulationService();
    const summary = await service.getSimulationStateSummary(civilizationId);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching simulation state summary:', error);
    res.status(500).json({
      error: 'Failed to fetch simulation state summary',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/fiscal-simulation/scenario/analyze - Analyze fiscal policy scenario
 */
router.post('/scenario/analyze', async (req, res) => {
  try {
    const { civilization_id, policies } = req.body;
    
    if (!civilization_id || !policies || !Array.isArray(policies)) {
      return res.status(400).json({
        error: 'Invalid scenario data',
        message: 'civilization_id and policies array are required'
      });
    }

    const service = getFiscalSimulationService();
    const results = [];

    // Calculate effects for each policy in the scenario
    for (const policy of policies) {
      try {
        const effect = await service.calculateFiscalEffect(
          civilization_id,
          policy.policy_type,
          policy.policy_category,
          policy.amount
        );
        results.push({
          policy,
          effect,
          success: true
        });
      } catch (error) {
        results.push({
          policy,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        });
      }
    }

    res.json({
      success: true,
      data: {
        scenario_results: results,
        total_policies: policies.length,
        successful_calculations: results.filter(r => r.success).length
      },
      message: 'Fiscal policy scenario analyzed successfully'
    });
  } catch (error) {
    console.error('Error analyzing fiscal policy scenario:', error);
    res.status(500).json({
      error: 'Failed to analyze fiscal policy scenario',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
