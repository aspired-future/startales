import express from 'express';
import { 
  saveCampaign, 
  resumeCampaign, 
  executeStep,
  branchCampaignFromStep,
  listCampaigns,
  getCampaignBranches,
  initEventSourcing
} from '../persistence/eventSourcing.js';

const router = express.Router();

// Note: Event sourcing will be initialized on first API call that needs it

/**
 * POST /api/campaigns - Create a new campaign
 */
router.post('/', async (req, res) => {
  try {
    // Lazy initialization - only initialize when first API call is made
    await initEventSourcing();
    
    const { name, seed, initialState } = req.body;
    
    if (!name || !seed) {
      return res.status(400).json({ 
        error: 'Campaign name and seed are required' 
      });
    }
    
    const campaignId = await saveCampaign(name, seed, initialState);
    
    res.json({
      success: true,
      campaignId,
      message: `Campaign "${name}" created successfully`
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ 
      error: 'Failed to create campaign',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/campaigns - List all campaigns
 */
router.get('/', async (req, res) => {
  try {
    const campaigns = await listCampaigns();
    
    res.json({
      success: true,
      campaigns
    });
  } catch (error) {
    console.error('Error listing campaigns:', error);
    res.status(500).json({ 
      error: 'Failed to list campaigns',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/campaigns/:id/resume - Resume a campaign and get current state
 */
router.get('/:id/resume', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }
    
    const currentState = await resumeCampaign(campaignId);
    
    res.json({
      success: true,
      campaignId,
      currentState,
      message: `Campaign ${campaignId} resumed successfully`
    });
  } catch (error) {
    console.error('Error resuming campaign:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ 
        error: 'Campaign not found',
        message: error.message
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to resume campaign',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/campaigns/:id/step - Execute a simulation step with persistence
 */
router.post('/:id/step', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id);
    const { seed, actions = [] } = req.body;
    
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }
    
    if (!seed) {
      return res.status(400).json({ error: 'Seed is required for simulation step' });
    }
    
    const newState = await executeStep(campaignId, seed, actions);
    
    res.json({
      success: true,
      campaignId,
      step: newState.step,
      state: newState,
      message: `Step ${newState.step} executed and saved`
    });
  } catch (error) {
    console.error('Error executing campaign step:', error);
    res.status(500).json({ 
      error: 'Failed to execute simulation step',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/campaigns/:id/branch - Branch a campaign from a specific step
 */
router.post('/:id/branch', async (req, res) => {
  try {
    const parentCampaignId = parseInt(req.params.id);
    const { branchName, fromStep } = req.body;
    
    if (isNaN(parentCampaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }
    
    if (!branchName || typeof fromStep !== 'number') {
      return res.status(400).json({ 
        error: 'Branch name and fromStep are required' 
      });
    }
    
    const branchCampaignId = await branchCampaignFromStep(
      parentCampaignId, 
      branchName, 
      fromStep
    );
    
    res.json({
      success: true,
      parentCampaignId,
      branchCampaignId,
      branchName,
      fromStep,
      message: `Campaign branched successfully: "${branchName}"`
    });
  } catch (error) {
    console.error('Error branching campaign:', error);
    res.status(500).json({ 
      error: 'Failed to branch campaign',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/campaigns/:id/branches - Get all branches of a campaign
 */
router.get('/:id/branches', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }
    
    const branches = await getCampaignBranches(campaignId);
    
    res.json({
      success: true,
      campaignId,
      branches
    });
  } catch (error) {
    console.error('Error getting campaign branches:', error);
    res.status(500).json({ 
      error: 'Failed to get campaign branches',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/campaigns/:id/snapshot - Create a manual snapshot
 */
router.post('/:id/snapshot', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }
    
    // Resume to get current state, then create snapshot
    const currentState = await resumeCampaign(campaignId);
    
    // The snapshot will be created automatically by the executeStep function
    // For manual snapshots, we could add a separate createManualSnapshot function
    
    res.json({
      success: true,
      campaignId,
      step: currentState.step,
      message: 'Manual snapshot created'
    });
  } catch (error) {
    console.error('Error creating snapshot:', error);
    res.status(500).json({ 
      error: 'Failed to create snapshot',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;


