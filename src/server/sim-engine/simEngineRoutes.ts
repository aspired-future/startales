/**
 * API Routes for Sim Engine Management
 * Provides endpoints for managing AI simulation, telemetry, and learning systems
 */

import express from 'express';
import { Pool } from 'pg';
import { SimEngineOrchestrator } from './SimEngineOrchestrator';
import { TelemetrySystem } from './TelemetrySystem';
import { AILearningLoop } from './AILearningLoop';
import { WebSocketManager } from './WebSocketManager';

export function createSimEngineRoutes(
  pool: Pool,
  simEngine?: SimEngineOrchestrator,
  telemetry?: TelemetrySystem,
  aiLearning?: AILearningLoop,
  webSocketManager?: WebSocketManager
): express.Router {
  const router = express.Router();

  // Middleware to check if sim engine is available
  const requireSimEngine = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!simEngine) {
      return res.status(503).json({
        success: false,
        error: 'Sim Engine not available',
        message: 'AI Simulation Engine is not initialized'
      });
    }
    next();
  };

  // Get sim engine status
  router.get('/status', (req, res) => {
    try {
      const status = {
        simEngineAvailable: !!simEngine,
        telemetryAvailable: !!telemetry,
        aiLearningAvailable: !!aiLearning,
        webSocketAvailable: !!webSocketManager,
        timestamp: new Date()
      };

      if (simEngine) {
        // Add additional status info
        status['activeSimulations'] = simEngine.getKnobStates ? Object.keys(simEngine.getKnobStates).length : 0;
      }

      if (telemetry) {
        status['telemetryStats'] = telemetry.getStats();
      }

      if (aiLearning) {
        status['learningMetrics'] = aiLearning.getLearningMetrics();
      }

      if (webSocketManager) {
        status['webSocketStats'] = webSocketManager.getStats();
      }

      res.json({
        success: true,
        data: status,
        message: 'Sim Engine status retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting sim engine status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get sim engine status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Register civilization for simulation
  router.post('/civilizations/:campaignId/:civilizationId/register', requireSimEngine, async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { playerId, gameState } = req.body;

      const context = {
        campaignId,
        civilizationId,
        playerId: playerId || 'unknown',
        gameState: gameState || {},
        timestamp: new Date()
      };

      await simEngine!.registerCivilization(context);

      res.json({
        success: true,
        data: context,
        message: 'Civilization registered for AI simulation successfully'
      });
    } catch (error) {
      console.error('Error registering civilization:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to register civilization',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get knob states for a civilization
  router.get('/civilizations/:civilizationId/knobs', requireSimEngine, (req, res) => {
    try {
      const { civilizationId } = req.params;
      const knobStates = simEngine!.getKnobStates(civilizationId);
      const performanceMetrics = simEngine!.getPerformanceMetrics(civilizationId);

      res.json({
        success: true,
        data: {
          civilizationId,
          knobStates: Object.fromEntries(knobStates),
          performanceMetrics,
          timestamp: new Date()
        },
        message: 'Knob states retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting knob states:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get knob states',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Manually adjust a knob
  router.post('/civilizations/:civilizationId/knobs/adjust', requireSimEngine, async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const { apiName, knobName, newValue, reason } = req.body;

      if (!apiName || !knobName || newValue === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters',
          message: 'apiName, knobName, and newValue are required'
        });
      }

      const adjustment = await simEngine!.adjustKnob(
        civilizationId,
        apiName,
        knobName,
        newValue,
        reason || 'Manual adjustment via API',
        0.9 // High confidence for manual adjustments
      );

      res.json({
        success: true,
        data: adjustment,
        message: 'Knob adjusted successfully'
      });
    } catch (error) {
      console.error('Error adjusting knob:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to adjust knob',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get AI recommendations for a civilization
  router.get('/civilizations/:civilizationId/recommendations', requireSimEngine, async (req, res) => {
    try {
      const { civilizationId } = req.params;
      const recommendations = await simEngine!.analyzeAndRecommend(civilizationId);

      res.json({
        success: true,
        data: {
          civilizationId,
          recommendations,
          timestamp: new Date()
        },
        message: 'AI recommendations generated successfully'
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Telemetry endpoints
  router.get('/telemetry/stats', (req, res) => {
    try {
      if (!telemetry) {
        return res.status(503).json({
          success: false,
          error: 'Telemetry system not available'
        });
      }

      const stats = telemetry.getStats();
      res.json({
        success: true,
        data: stats,
        message: 'Telemetry stats retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting telemetry stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get telemetry stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get effectiveness report for a specific knob
  router.get('/telemetry/civilizations/:civilizationId/effectiveness/:apiName/:knobName', async (req, res) => {
    try {
      if (!telemetry) {
        return res.status(503).json({
          success: false,
          error: 'Telemetry system not available'
        });
      }

      const { civilizationId, apiName, knobName } = req.params;
      const { forceRecalculate } = req.query;

      const report = await telemetry.getEffectivenessReport(
        civilizationId,
        apiName,
        knobName,
        forceRecalculate === 'true'
      );

      res.json({
        success: true,
        data: report,
        message: 'Effectiveness report retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting effectiveness report:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get effectiveness report',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get all effectiveness reports for a civilization
  router.get('/telemetry/civilizations/:civilizationId/effectiveness', async (req, res) => {
    try {
      if (!telemetry) {
        return res.status(503).json({
          success: false,
          error: 'Telemetry system not available'
        });
      }

      const { civilizationId } = req.params;
      const reports = await telemetry.getAllEffectivenessReports(civilizationId);

      res.json({
        success: true,
        data: {
          civilizationId,
          reports,
          totalReports: reports.length,
          timestamp: new Date()
        },
        message: 'All effectiveness reports retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting effectiveness reports:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get effectiveness reports',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Record a game outcome for telemetry
  router.post('/telemetry/outcomes', (req, res) => {
    try {
      if (!telemetry) {
        return res.status(503).json({
          success: false,
          error: 'Telemetry system not available'
        });
      }

      const { civilizationId, outcomeType, value, relatedKnobs } = req.body;

      if (!civilizationId || !outcomeType || value === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters',
          message: 'civilizationId, outcomeType, and value are required'
        });
      }

      const outcome = {
        civilizationId,
        outcomeType,
        value,
        relatedKnobs: relatedKnobs || [],
        timestamp: new Date()
      };

      telemetry.recordGameOutcome(outcome);

      res.json({
        success: true,
        data: outcome,
        message: 'Game outcome recorded successfully'
      });
    } catch (error) {
      console.error('Error recording game outcome:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to record game outcome',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // AI Learning endpoints
  router.get('/learning/metrics', (req, res) => {
    try {
      if (!aiLearning) {
        return res.status(503).json({
          success: false,
          error: 'AI Learning system not available'
        });
      }

      const metrics = aiLearning.getLearningMetrics();
      res.json({
        success: true,
        data: metrics,
        message: 'Learning metrics retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting learning metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get learning metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get optimization suggestions for a civilization
  router.get('/learning/civilizations/:civilizationId/suggestions', (req, res) => {
    try {
      if (!aiLearning) {
        return res.status(503).json({
          success: false,
          error: 'AI Learning system not available'
        });
      }

      const { civilizationId } = req.params;
      const suggestions = aiLearning.getOptimizationSuggestions(civilizationId);

      res.json({
        success: true,
        data: {
          civilizationId,
          suggestions,
          totalSuggestions: suggestions.length,
          timestamp: new Date()
        },
        message: 'Optimization suggestions retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting optimization suggestions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get optimization suggestions',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get learning patterns for a civilization
  router.get('/learning/civilizations/:civilizationId/patterns', (req, res) => {
    try {
      if (!aiLearning) {
        return res.status(503).json({
          success: false,
          error: 'AI Learning system not available'
        });
      }

      const { civilizationId } = req.params;
      const patterns = aiLearning.getLearningPatterns(civilizationId);

      res.json({
        success: true,
        data: {
          civilizationId,
          patterns,
          totalPatterns: patterns.length,
          timestamp: new Date()
        },
        message: 'Learning patterns retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting learning patterns:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get learning patterns',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Generate optimization suggestions for a specific knob
  router.post('/learning/civilizations/:civilizationId/optimize/:apiName/:knobName', async (req, res) => {
    try {
      if (!aiLearning) {
        return res.status(503).json({
          success: false,
          error: 'AI Learning system not available'
        });
      }

      const { civilizationId, apiName, knobName } = req.params;
      const suggestions = await aiLearning.generateOptimizationSuggestions(civilizationId, apiName, knobName);

      res.json({
        success: true,
        data: {
          civilizationId,
          apiName,
          knobName,
          suggestions,
          timestamp: new Date()
        },
        message: 'Optimization suggestions generated successfully'
      });
    } catch (error) {
      console.error('Error generating optimization suggestions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate optimization suggestions',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // WebSocket connection info
  router.get('/websocket/info', (req, res) => {
    try {
      const info = {
        available: !!webSocketManager,
        endpoint: '/ws/sim-engine',
        supportedMessages: [
          'subscribe',
          'unsubscribe',
          'knob_request',
          'knob_adjustment'
        ],
        availableSubscriptions: [
          'knob_adjustments',
          'simulation_events',
          'performance_updates',
          'recommendations'
        ]
      };

      if (webSocketManager) {
        info['stats'] = webSocketManager.getStats();
      }

      res.json({
        success: true,
        data: info,
        message: 'WebSocket info retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting WebSocket info:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get WebSocket info',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
}

export default createSimEngineRoutes;

