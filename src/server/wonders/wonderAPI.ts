import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { WonderService, WonderConstructionOptions } from './wonderService';
import { WondersSchema } from '../storage/wondersSchema';
import { WonderType, ResourceCost } from '../storage/wondersSchema';

export interface WonderAPIRequest extends Request {
  body: {
    wonder_type?: WonderType;
    custom_name?: string;
    resources?: ResourceCost;
    campaign_step?: number;
    construction_options?: WonderConstructionOptions;
    recovery_rate?: number;
  };
  params: {
    campaignId?: string;
    wonderId?: string;
  };
  query: {
    status?: string;
    category?: string;
    page?: string;
    limit?: string;
  };
}

export function createWonderAPI(pool: Pool): Router {
  const router = Router();
  const wonderService = new WonderService(pool);
  const wondersSchema = new WondersSchema(pool);

  // Initialize wonder system (admin endpoint)
  router.post('/admin/initialize', async (req: Request, res: Response) => {
    try {
      await wondersSchema.initializeTables();
      await wondersSchema.seedWonderTemplates();
      
      res.json({
        success: true,
        message: 'World Wonders system initialized successfully'
      });
    } catch (error) {
      console.error('Failed to initialize wonder system:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to initialize wonder system',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get all available wonder templates
  router.get('/templates', async (req: Request, res: Response) => {
    try {
      const templates = await wonderService.getAvailableWonders();
      
      res.json({
        success: true,
        data: templates,
        total: templates.length
      });
    } catch (error) {
      console.error('Failed to get wonder templates:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve wonder templates',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get wonders for a specific campaign
  router.get('/campaigns/:campaignId', async (req: WonderAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      const wonders = await wonderService.getCampaignWonders(campaignId);
      
      // Apply filters if provided
      let filteredWonders = wonders;
      
      if (req.query.status) {
        filteredWonders = filteredWonders.filter(
          wonder => wonder.construction_status === req.query.status
        );
      }

      // Pagination
      const page = parseInt(req.query.page || '1');
      const limit = parseInt(req.query.limit || '10');
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedWonders = filteredWonders.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: paginatedWonders,
        pagination: {
          page,
          limit,
          total: filteredWonders.length,
          totalPages: Math.ceil(filteredWonders.length / limit)
        }
      });
    } catch (error) {
      console.error('Failed to get campaign wonders:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve campaign wonders',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Start construction of a new wonder
  router.post('/campaigns/:campaignId/construct', async (req: WonderAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      const { wonder_type, custom_name } = req.body;
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      if (!wonder_type) {
        return res.status(400).json({
          success: false,
          error: 'Wonder type is required'
        });
      }

      // Validate wonder type
      if (!Object.values(WonderType).includes(wonder_type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid wonder type',
          validTypes: Object.values(WonderType)
        });
      }

      const wonder = await wonderService.startWonderConstruction(
        campaignId,
        wonder_type,
        custom_name
      );

      res.status(201).json({
        success: true,
        data: wonder,
        message: `Started construction of ${wonder.wonder_name}`
      });
    } catch (error) {
      console.error('Failed to start wonder construction:', error);
      
      if (error instanceof Error && error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to start wonder construction',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get specific wonder details
  router.get('/wonders/:wonderId', async (req: WonderAPIRequest, res: Response) => {
    try {
      const { wonderId } = req.params;
      
      if (!wonderId) {
        return res.status(400).json({
          success: false,
          error: 'Wonder ID is required'
        });
      }

      const wonder = await wonderService.getWonderById(wonderId);
      
      res.json({
        success: true,
        data: wonder
      });
    } catch (error) {
      console.error('Failed to get wonder:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve wonder',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Invest resources in wonder construction
  router.post('/wonders/:wonderId/invest', async (req: WonderAPIRequest, res: Response) => {
    try {
      const { wonderId } = req.params;
      const { resources, campaign_step = 1, construction_options = { rush: false } } = req.body;
      
      if (!wonderId) {
        return res.status(400).json({
          success: false,
          error: 'Wonder ID is required'
        });
      }

      if (!resources || typeof resources !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Resources object is required'
        });
      }

      // Validate resources are positive numbers
      for (const [resource, amount] of Object.entries(resources)) {
        if (typeof amount !== 'number' || amount <= 0) {
          return res.status(400).json({
            success: false,
            error: `Invalid resource amount for ${resource}: must be a positive number`
          });
        }
      }

      const result = await wonderService.investResources(
        wonderId,
        resources,
        campaign_step,
        construction_options
      );

      res.json({
        success: true,
        data: {
          wonder: result.wonder,
          progress: result.progress,
          message: `Invested resources in ${result.wonder.wonder_name}. Progress: ${result.wonder.completion_percentage.toFixed(1)}%`
        }
      });
    } catch (error) {
      console.error('Failed to invest resources:', error);
      
      if (error instanceof Error && (
        error.message.includes('not found') ||
        error.message.includes('Cannot invest in wonder')
      )) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to invest resources',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Pause wonder construction
  router.post('/wonders/:wonderId/pause', async (req: WonderAPIRequest, res: Response) => {
    try {
      const { wonderId } = req.params;
      
      if (!wonderId) {
        return res.status(400).json({
          success: false,
          error: 'Wonder ID is required'
        });
      }

      const wonder = await wonderService.pauseConstruction(wonderId);
      
      res.json({
        success: true,
        data: wonder,
        message: `Paused construction of ${wonder.wonder_name}`
      });
    } catch (error) {
      console.error('Failed to pause construction:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to pause construction',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Resume wonder construction
  router.post('/wonders/:wonderId/resume', async (req: WonderAPIRequest, res: Response) => {
    try {
      const { wonderId } = req.params;
      
      if (!wonderId) {
        return res.status(400).json({
          success: false,
          error: 'Wonder ID is required'
        });
      }

      const wonder = await wonderService.resumeConstruction(wonderId);
      
      res.json({
        success: true,
        data: wonder,
        message: `Resumed construction of ${wonder.wonder_name}`
      });
    } catch (error) {
      console.error('Failed to resume construction:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resume construction',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Cancel wonder construction
  router.post('/wonders/:wonderId/cancel', async (req: WonderAPIRequest, res: Response) => {
    try {
      const { wonderId } = req.params;
      const { recovery_rate = 0.5 } = req.body;
      
      if (!wonderId) {
        return res.status(400).json({
          success: false,
          error: 'Wonder ID is required'
        });
      }

      if (typeof recovery_rate !== 'number' || recovery_rate < 0 || recovery_rate > 1) {
        return res.status(400).json({
          success: false,
          error: 'Recovery rate must be a number between 0 and 1'
        });
      }

      const result = await wonderService.cancelConstruction(wonderId, recovery_rate);
      
      res.json({
        success: true,
        data: {
          recoveredResources: result.recoveredResources
        },
        message: 'Wonder construction cancelled successfully'
      });
    } catch (error) {
      console.error('Failed to cancel construction:', error);
      
      if (error instanceof Error && error.message.includes('Cannot cancel')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to cancel construction',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get wonder construction history
  router.get('/wonders/:wonderId/history', async (req: WonderAPIRequest, res: Response) => {
    try {
      const { wonderId } = req.params;
      
      if (!wonderId) {
        return res.status(400).json({
          success: false,
          error: 'Wonder ID is required'
        });
      }

      const history = await wonderService.getConstructionHistory(wonderId);
      
      res.json({
        success: true,
        data: history,
        total: history.length
      });
    } catch (error) {
      console.error('Failed to get construction history:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve construction history',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Health check endpoint
  router.get('/health', async (req: Request, res: Response) => {
    try {
      const client = await pool.connect();
      
      // Test database connection
      const result = await client.query('SELECT COUNT(*) FROM wonder_templates');
      client.release();
      
      res.json({
        success: true,
        status: 'healthy',
        wonderTemplatesCount: parseInt(result.rows[0].count),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Wonder system health check failed:', error);
      res.status(500).json({
        success: false,
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  return router;
}
