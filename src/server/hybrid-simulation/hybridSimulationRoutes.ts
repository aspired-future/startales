/**
 * Hybrid Simulation API Routes
 * REST API endpoints for controlling and monitoring the hybrid simulation engine
 */

import { Router } from 'express';
import { hybridSimulationEngine } from './HybridSimulationEngine.js';
import { TICK_MODES } from './types.js';

export const hybridSimulationRoutes = Router();

// ===== CAMPAIGN MANAGEMENT =====

/**
 * Register a campaign for hybrid simulation
 * POST /api/hybrid-simulation/campaigns/:campaignId/register
 */
hybridSimulationRoutes.post('/campaigns/:campaignId/register', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const { tickMode = 'strategic' } = req.body;

    if (isNaN(campaignId)) {
      return res.status(400).json({ 
        error: 'Invalid campaign ID',
        message: 'Campaign ID must be a valid number'
      });
    }

    if (!TICK_MODES[tickMode]) {
      return res.status(400).json({
        error: 'Invalid tick mode',
        message: `Tick mode must be one of: ${Object.keys(TICK_MODES).join(', ')}`
      });
    }

    await hybridSimulationEngine.registerCampaign(campaignId, tickMode);

    res.json({
      success: true,
      message: `Campaign ${campaignId} registered for hybrid simulation`,
      campaignId,
      tickMode,
      tickConfiguration: TICK_MODES[tickMode]
    });

  } catch (error) {
    console.error('Campaign registration failed:', error);
    res.status(500).json({
      error: 'Campaign registration failed',
      message: error.message
    });
  }
});

/**
 * Start hybrid simulation for a campaign
 * POST /api/hybrid-simulation/campaigns/:campaignId/start
 */
hybridSimulationRoutes.post('/campaigns/:campaignId/start', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);

    if (isNaN(campaignId)) {
      return res.status(400).json({ 
        error: 'Invalid campaign ID',
        message: 'Campaign ID must be a valid number'
      });
    }

    await hybridSimulationEngine.startCampaign(campaignId);

    const status = hybridSimulationEngine.getCampaignStatus(campaignId);

    res.json({
      success: true,
      message: `Hybrid simulation started for campaign ${campaignId}`,
      campaignId,
      status,
      nextTickTime: status?.nextTickTime
    });

  } catch (error) {
    console.error('Campaign start failed:', error);
    res.status(500).json({
      error: 'Campaign start failed',
      message: error.message
    });
  }
});

/**
 * Stop hybrid simulation for a campaign
 * POST /api/hybrid-simulation/campaigns/:campaignId/stop
 */
hybridSimulationRoutes.post('/campaigns/:campaignId/stop', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);

    if (isNaN(campaignId)) {
      return res.status(400).json({ 
        error: 'Invalid campaign ID',
        message: 'Campaign ID must be a valid number'
      });
    }

    await hybridSimulationEngine.stopCampaign(campaignId);

    res.json({
      success: true,
      message: `Hybrid simulation stopped for campaign ${campaignId}`,
      campaignId
    });

  } catch (error) {
    console.error('Campaign stop failed:', error);
    res.status(500).json({
      error: 'Campaign stop failed',
      message: error.message
    });
  }
});

/**
 * Unregister a campaign from hybrid simulation
 * DELETE /api/hybrid-simulation/campaigns/:campaignId
 */
hybridSimulationRoutes.delete('/campaigns/:campaignId', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);

    if (isNaN(campaignId)) {
      return res.status(400).json({ 
        error: 'Invalid campaign ID',
        message: 'Campaign ID must be a valid number'
      });
    }

    await hybridSimulationEngine.unregisterCampaign(campaignId);

    res.json({
      success: true,
      message: `Campaign ${campaignId} unregistered from hybrid simulation`,
      campaignId
    });

  } catch (error) {
    console.error('Campaign unregistration failed:', error);
    res.status(500).json({
      error: 'Campaign unregistration failed',
      message: error.message
    });
  }
});

// ===== CAMPAIGN STATUS =====

/**
 * Get campaign status
 * GET /api/hybrid-simulation/campaigns/:campaignId/status
 */
hybridSimulationRoutes.get('/campaigns/:campaignId/status', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);

    if (isNaN(campaignId)) {
      return res.status(400).json({ 
        error: 'Invalid campaign ID',
        message: 'Campaign ID must be a valid number'
      });
    }

    const status = hybridSimulationEngine.getCampaignStatus(campaignId);

    if (!status) {
      return res.status(404).json({
        error: 'Campaign not found',
        message: `Campaign ${campaignId} is not registered for hybrid simulation`
      });
    }

    res.json({
      success: true,
      campaignId,
      status: {
        ...status,
        timeToNextTick: status.nextTickTime.getTime() - Date.now(),
        timeSinceLastTick: Date.now() - status.lastTickTime.getTime()
      }
    });

  } catch (error) {
    console.error('Status retrieval failed:', error);
    res.status(500).json({
      error: 'Status retrieval failed',
      message: error.message
    });
  }
});

/**
 * Get all registered campaigns
 * GET /api/hybrid-simulation/campaigns
 */
hybridSimulationRoutes.get('/campaigns', async (req, res) => {
  try {
    const campaigns = hybridSimulationEngine.getAllCampaigns();

    const campaignsWithTiming = campaigns.map(campaign => ({
      ...campaign,
      timeToNextTick: campaign.isActive ? campaign.nextTickTime.getTime() - Date.now() : null,
      timeSinceLastTick: Date.now() - campaign.lastTickTime.getTime()
    }));

    res.json({
      success: true,
      campaigns: campaignsWithTiming,
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.isActive).length
    });

  } catch (error) {
    console.error('Campaigns retrieval failed:', error);
    res.status(500).json({
      error: 'Campaigns retrieval failed',
      message: error.message
    });
  }
});

// ===== TICK PROCESSING =====

/**
 * Manually trigger a tick for a campaign (for testing/debugging)
 * POST /api/hybrid-simulation/campaigns/:campaignId/tick
 */
hybridSimulationRoutes.post('/campaigns/:campaignId/tick', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);

    if (isNaN(campaignId)) {
      return res.status(400).json({ 
        error: 'Invalid campaign ID',
        message: 'Campaign ID must be a valid number'
      });
    }

    const tick = await hybridSimulationEngine.processTick(campaignId);

    res.json({
      success: true,
      message: `Manual tick processed for campaign ${campaignId}`,
      tick: {
        tickId: tick.tickId,
        timestamp: tick.timestamp,
        processingTime: tick.processingTime,
        phaseTimings: tick.phaseTimings,
        modificationsApplied: tick.hybridIntegration.modificationsApplied,
        narrativeEnhancements: tick.hybridIntegration.narrativeEnhancements,
        emergentEvents: tick.hybridIntegration.emergentEvents.length,
        policyRecommendations: tick.hybridIntegration.policyRecommendations.length,
        crisisAlerts: tick.hybridIntegration.crisisAlerts.length
      }
    });

  } catch (error) {
    console.error('Manual tick failed:', error);
    res.status(500).json({
      error: 'Manual tick failed',
      message: error.message
    });
  }
});

// ===== PLAYER ACTIONS =====

/**
 * Queue a player action for the next tick
 * POST /api/hybrid-simulation/campaigns/:campaignId/actions
 */
hybridSimulationRoutes.post('/campaigns/:campaignId/actions', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);

    if (isNaN(campaignId)) {
      return res.status(400).json({ 
        error: 'Invalid campaign ID',
        message: 'Campaign ID must be a valid number'
      });
    }

    const {
      playerId,
      actionType,
      actionData,
      priority = 'medium',
      requiresImmediate = false,
      affectsSimulation = true
    } = req.body;

    if (!playerId || !actionType || !actionData) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'playerId, actionType, and actionData are required'
      });
    }

    const validActionTypes = ['policy', 'building', 'research', 'military', 'diplomacy', 'trade'];
    if (!validActionTypes.includes(actionType)) {
      return res.status(400).json({
        error: 'Invalid action type',
        message: `Action type must be one of: ${validActionTypes.join(', ')}`
      });
    }

    const validPriorities = ['low', 'medium', 'high', 'critical'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        error: 'Invalid priority',
        message: `Priority must be one of: ${validPriorities.join(', ')}`
      });
    }

    const action = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      playerId,
      actionType,
      actionData,
      timestamp: new Date(),
      priority,
      requiresImmediate,
      affectsSimulation
    };

    await hybridSimulationEngine.queuePlayerAction(campaignId, action);

    const status = hybridSimulationEngine.getCampaignStatus(campaignId);

    res.json({
      success: true,
      message: 'Player action queued successfully',
      action: {
        id: action.id,
        actionType: action.actionType,
        priority: action.priority,
        requiresImmediate: action.requiresImmediate
      },
      queuedActions: status?.queuedActions.length || 0,
      nextTickTime: status?.nextTickTime
    });

  } catch (error) {
    console.error('Action queuing failed:', error);
    res.status(500).json({
      error: 'Action queuing failed',
      message: error.message
    });
  }
});

/**
 * Get queued actions for a campaign
 * GET /api/hybrid-simulation/campaigns/:campaignId/actions
 */
hybridSimulationRoutes.get('/campaigns/:campaignId/actions', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);

    if (isNaN(campaignId)) {
      return res.status(400).json({ 
        error: 'Invalid campaign ID',
        message: 'Campaign ID must be a valid number'
      });
    }

    const status = hybridSimulationEngine.getCampaignStatus(campaignId);

    if (!status) {
      return res.status(404).json({
        error: 'Campaign not found',
        message: `Campaign ${campaignId} is not registered for hybrid simulation`
      });
    }

    res.json({
      success: true,
      campaignId,
      queuedActions: status.queuedActions,
      totalActions: status.queuedActions.length,
      nextTickTime: status.nextTickTime
    });

  } catch (error) {
    console.error('Actions retrieval failed:', error);
    res.status(500).json({
      error: 'Actions retrieval failed',
      message: error.message
    });
  }
});

// ===== CONFIGURATION =====

/**
 * Get available tick modes
 * GET /api/hybrid-simulation/tick-modes
 */
hybridSimulationRoutes.get('/tick-modes', async (req, res) => {
  try {
    res.json({
      success: true,
      tickModes: TICK_MODES,
      defaultMode: 'strategic'
    });

  } catch (error) {
    console.error('Tick modes retrieval failed:', error);
    res.status(500).json({
      error: 'Tick modes retrieval failed',
      message: error.message
    });
  }
});

// ===== SYSTEM HEALTH =====

/**
 * Get hybrid simulation engine health status
 * GET /api/hybrid-simulation/health
 */
hybridSimulationRoutes.get('/health', async (req, res) => {
  try {
    const campaigns = hybridSimulationEngine.getAllCampaigns();
    const activeCampaigns = campaigns.filter(c => c.isActive);
    
    const totalErrors = campaigns.reduce((sum, c) => sum + c.errorCount, 0);
    const averageTickTime = campaigns.length > 0 
      ? campaigns.reduce((sum, c) => sum + c.averageTickTime, 0) / campaigns.length 
      : 0;

    const health = {
      status: 'healthy',
      timestamp: new Date(),
      campaigns: {
        total: campaigns.length,
        active: activeCampaigns.length,
        inactive: campaigns.length - activeCampaigns.length
      },
      performance: {
        averageTickTime: Math.round(averageTickTime),
        totalErrors: totalErrors,
        errorRate: campaigns.length > 0 ? totalErrors / campaigns.length : 0
      },
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    };

    // Determine health status
    if (totalErrors > campaigns.length * 5) {
      health.status = 'unhealthy';
    } else if (averageTickTime > 30000 || totalErrors > campaigns.length * 2) {
      health.status = 'degraded';
    }

    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 206 : 503;

    res.status(statusCode).json({
      success: true,
      health
    });

  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      error: 'Health check failed',
      message: error.message,
      health: {
        status: 'unhealthy',
        timestamp: new Date()
      }
    });
  }
});

// ===== ERROR HANDLING =====

/**
 * Global error handler for hybrid simulation routes
 */
hybridSimulationRoutes.use((error: any, req: any, res: any, next: any) => {
  console.error('Hybrid simulation API error:', error);
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred in the hybrid simulation system',
    timestamp: new Date(),
    path: req.path
  });
});

export default hybridSimulationRoutes;
