import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { HouseholdService } from './householdService.js';
import { HouseholdSchema, HouseholdTierType, SocialMobilityEventType } from '../storage/householdSchema.js';

export interface HouseholdAPIRequest extends Request {
  body: {
    total_population?: number;
    resource_type?: string;
    current_price?: number;
    cultural_multiplier?: number;
    seasonal_multiplier?: number;
    household_id?: string;
    event_type?: SocialMobilityEventType;
    from_tier?: HouseholdTierType;
    to_tier?: HouseholdTierType;
    resource_cost?: { [resource: string]: number };
    resources_provided?: { [resource: string]: number };
    resources?: Array<{
      resource_type: string;
      current_price: number;
      cultural_multiplier?: number;
      seasonal_multiplier?: number;
    }>;
    global_cultural_multiplier?: number;
    global_seasonal_multiplier?: number;
  };
  params: {
    campaignId?: string;
    eventId?: string;
    tier?: string;
  };
  query: {
    resource_type?: string;
    page?: string;
    limit?: string;
    status?: string;
    tier?: string;
  };
}

export function createHouseholdAPI(pool: Pool): Router {
  const router = Router();
  const householdService = new HouseholdService(pool);
  const householdSchema = new HouseholdSchema(pool);

  // Initialize household system (admin endpoint)
  router.post('/admin/initialize', async (req: Request, res: Response) => {
    try {
      await householdSchema.initializeTables();
      await householdSchema.seedHouseholdEconomicSystem();
      
      res.json({
        success: true,
        message: 'Household Economic system initialized successfully'
      });
    } catch (error) {
      console.error('Failed to initialize household system:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to initialize household system',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Initialize household economics for a specific campaign
  router.post('/campaigns/:campaignId/initialize', async (req: HouseholdAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      const { total_population = 100000 } = req.body;
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      if (typeof total_population !== 'number' || total_population <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Total population must be a positive number'
        });
      }

      const status = await householdService.initializeCampaignHouseholds(campaignId, total_population);
      
      res.status(201).json({
        success: true,
        data: status,
        message: `Initialized household economics for campaign ${campaignId} with ${total_population} population`
      });
    } catch (error) {
      console.error('Failed to initialize campaign households:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to initialize campaign households',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get household economic status for a campaign
  router.get('/campaigns/:campaignId/status', async (req: HouseholdAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      const status = await householdService.getHouseholdEconomicStatus(campaignId);
      
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      console.error('Failed to get household economic status:', error);
      
      if (error instanceof Error && error.message.includes('No household data found')) {
        return res.status(404).json({
          success: false,
          error: error.message,
          suggestion: 'Initialize household economics for this campaign first'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve household economic status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Calculate demand for a specific resource type
  router.post('/campaigns/:campaignId/demand/calculate', async (req: HouseholdAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      const { 
        resource_type, 
        current_price, 
        cultural_multiplier = 1.0, 
        seasonal_multiplier = 1.0 
      } = req.body;
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      if (!resource_type) {
        return res.status(400).json({
          success: false,
          error: 'Resource type is required'
        });
      }

      if (typeof current_price !== 'number' || current_price <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Current price must be a positive number'
        });
      }

      const demandCalculations = await householdService.calculateTierDemand(
        campaignId,
        resource_type,
        current_price,
        cultural_multiplier,
        seasonal_multiplier
      );

      // Calculate total demand across all tiers
      const totalDemand = demandCalculations.reduce((sum, calc) => sum + calc.final_demand, 0);
      
      res.json({
        success: true,
        data: {
          resource_type,
          current_price,
          modifiers: {
            cultural_multiplier,
            seasonal_multiplier
          },
          tier_breakdown: demandCalculations,
          total_demand: Math.floor(totalDemand),
          demand_summary: {
            most_elastic_tier: demandCalculations.reduce((prev, curr) => 
              Math.abs(curr.elasticity_impact - 1) > Math.abs(prev.elasticity_impact - 1) ? curr : prev
            ).tier,
            highest_demand_tier: demandCalculations.reduce((prev, curr) => 
              curr.final_demand > prev.final_demand ? curr : prev
            ).tier
          }
        }
      });
    } catch (error) {
      console.error('Failed to calculate demand:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate demand',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get available social mobility opportunities for a tier
  router.get('/campaigns/:campaignId/mobility/opportunities/:tier', async (req: HouseholdAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      const tier = req.params.tier as HouseholdTierType;
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      if (!Object.values(HouseholdTierType).includes(tier)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid household tier',
          validTiers: Object.values(HouseholdTierType)
        });
      }

      const opportunities = await householdService.getAvailableMobilityOpportunities(campaignId, tier);
      
      res.json({
        success: true,
        data: {
          from_tier: tier,
          opportunities,
          total_opportunities: opportunities.length
        }
      });
    } catch (error) {
      console.error('Failed to get mobility opportunities:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve mobility opportunities',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Create social mobility event
  router.post('/campaigns/:campaignId/mobility/events', async (req: HouseholdAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      const { 
        household_id, 
        event_type, 
        from_tier, 
        to_tier, 
        resource_cost = {} 
      } = req.body;
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      if (!household_id) {
        return res.status(400).json({
          success: false,
          error: 'Household ID is required'
        });
      }

      if (!event_type || !Object.values(SocialMobilityEventType).includes(event_type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid event type',
          validEventTypes: Object.values(SocialMobilityEventType)
        });
      }

      if (!from_tier || !to_tier || 
          !Object.values(HouseholdTierType).includes(from_tier) ||
          !Object.values(HouseholdTierType).includes(to_tier)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid household tiers',
          validTiers: Object.values(HouseholdTierType)
        });
      }

      // Default campaign step to 1 if not provided
      const campaignStep = 1;

      const event = await householdService.createSocialMobilityOpportunity(
        campaignId,
        campaignStep,
        household_id,
        event_type,
        from_tier,
        to_tier,
        resource_cost
      );

      res.status(201).json({
        success: true,
        data: event,
        message: `Created social mobility event: ${from_tier} to ${to_tier}`
      });
    } catch (error) {
      console.error('Failed to create social mobility event:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create social mobility event',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Process social mobility event
  router.post('/mobility/events/:eventId/process', async (req: HouseholdAPIRequest, res: Response) => {
    try {
      const { eventId } = req.params;
      const { resources_provided = {} } = req.body;
      
      if (!eventId) {
        return res.status(400).json({
          success: false,
          error: 'Event ID is required'
        });
      }

      // Validate resources_provided format
      if (typeof resources_provided !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Resources provided must be an object'
        });
      }

      for (const [resource, amount] of Object.entries(resources_provided)) {
        if (typeof amount !== 'number' || amount < 0) {
          return res.status(400).json({
            success: false,
            error: `Invalid resource amount for ${resource}: must be a non-negative number`
          });
        }
      }

      const result = await householdService.processSocialMobilityEvent(eventId, resources_provided);
      
      res.json({
        success: true,
        data: {
          event_successful: result.success,
          event_outcome: result.outcome,
          message: result.success 
            ? `Social mobility successful: ${result.outcome.from_tier} → ${result.outcome.to_tier}`
            : 'Social mobility attempt failed'
        }
      });
    } catch (error) {
      console.error('Failed to process social mobility event:', error);
      
      if (error instanceof Error && error.message.includes('not found or already processed')) {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to process social mobility event',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get social mobility events for a campaign (with filters)
  router.get('/campaigns/:campaignId/mobility/events', async (req: HouseholdAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      const { status = 'all', tier, page = '1', limit = '20' } = req.query;
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      const client = await pool.connect();
      try {
        let query = `
          SELECT * FROM social_mobility_events 
          WHERE campaign_id = $1
        `;
        const params: any[] = [campaignId];

        // Add filters
        if (status !== 'all') {
          query += ` AND outcome = $${params.length + 1}`;
          params.push(status);
        }

        if (tier && Object.values(HouseholdTierType).includes(tier as HouseholdTierType)) {
          query += ` AND (from_tier = $${params.length + 1} OR to_tier = $${params.length + 1})`;
          params.push(tier, tier);
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limitNum, offset);

        const result = await client.query(query, params);

        // Get total count for pagination
        const countQuery = `
          SELECT COUNT(*) FROM social_mobility_events 
          WHERE campaign_id = $1 
          ${status !== 'all' ? 'AND outcome = $2' : ''}
        `;
        const countParams = status !== 'all' ? [campaignId, status] : [campaignId];
        const countResult = await client.query(countQuery, countParams);

        const events = result.rows.map(row => ({
          ...row,
          resource_cost: typeof row.resource_cost === 'string' ? JSON.parse(row.resource_cost) : row.resource_cost
        }));

        res.json({
          success: true,
          data: events,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: parseInt(countResult.rows[0].count),
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limitNum)
          }
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to get social mobility events:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve social mobility events',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Bulk demand calculation for multiple resources
  router.post('/campaigns/:campaignId/demand/bulk-calculate', async (req: HouseholdAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      const { 
        resources, // Array of {resource_type, current_price, cultural_multiplier?, seasonal_multiplier?}
        global_cultural_multiplier = 1.0,
        global_seasonal_multiplier = 1.0 
      } = req.body;
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      if (!Array.isArray(resources) || resources.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Resources array is required and must not be empty'
        });
      }

      const bulkCalculations = [];
      let totalGlobalDemand = 0;

      for (const resource of resources) {
        if (!resource.resource_type || typeof resource.current_price !== 'number') {
          return res.status(400).json({
            success: false,
            error: 'Each resource must have resource_type and current_price'
          });
        }

        const culturalMult = resource.cultural_multiplier ?? global_cultural_multiplier;
        const seasonalMult = resource.seasonal_multiplier ?? global_seasonal_multiplier;

        const demandCalcs = await householdService.calculateTierDemand(
          campaignId,
          resource.resource_type,
          resource.current_price,
          culturalMult,
          seasonalMult
        );

        const resourceTotalDemand = demandCalcs.reduce((sum, calc) => sum + calc.final_demand, 0);
        totalGlobalDemand += resourceTotalDemand;

        bulkCalculations.push({
          resource_type: resource.resource_type,
          current_price: resource.current_price,
          modifiers: {
            cultural_multiplier: culturalMult,
            seasonal_multiplier: seasonalMult
          },
          tier_breakdown: demandCalcs,
          total_demand: Math.floor(resourceTotalDemand)
        });
      }

      res.json({
        success: true,
        data: {
          global_modifiers: {
            cultural_multiplier: global_cultural_multiplier,
            seasonal_multiplier: global_seasonal_multiplier
          },
          resource_calculations: bulkCalculations,
          total_global_demand: Math.floor(totalGlobalDemand),
          resource_summary: {
            highest_demand_resource: bulkCalculations.reduce((prev, curr) => 
              curr.total_demand > prev.total_demand ? curr : prev
            ).resource_type,
            total_resources_calculated: bulkCalculations.length
          }
        }
      });
    } catch (error) {
      console.error('Failed to calculate bulk demand:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate bulk demand',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Health check endpoint
  router.get('/health', async (req: Request, res: Response) => {
    try {
      const client = await pool.connect();
      
      // Test database connection and table existence
      const result = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'household_tiers') as tiers_table,
          (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'household_consumption') as consumption_table,
          (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'social_mobility_events') as mobility_table
      `);
      
      client.release();
      
      const tableStatus = result.rows[0];
      const allTablesExist = tableStatus.tiers_table > 0 && 
                           tableStatus.consumption_table > 0 && 
                           tableStatus.mobility_table > 0;

      res.json({
        success: true,
        status: allTablesExist ? 'healthy' : 'degraded',
        database: {
          connected: true,
          tables: {
            household_tiers: tableStatus.tiers_table > 0,
            household_consumption: tableStatus.consumption_table > 0,
            social_mobility_events: tableStatus.mobility_table > 0
          }
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Household system health check failed:', error);
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
