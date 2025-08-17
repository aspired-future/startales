import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { AnalyticsService, SystemHealthReport, PredictionRequest, BenchmarkingReport } from './analyticsService.js';
import { AnalyticsSchema } from '../storage/analyticsSchema.js';
import { HouseholdService } from '../households/householdService.js';
import { WonderService } from '../wonders/wonderService.js';

export interface AnalyticsAPIRequest extends Request {
  body: {
    campaign_step?: number;
    target_metric?: string;
    horizon_steps?: number;
    model_type?: string;
    comparison_campaign_id?: number;
    comparison_type?: string;
    metrics?: string[];
    time_range?: { start_step: number; end_step: number };
    alert_ids?: string[];
    recommendation_id?: string;
    include_predictions?: boolean;
    include_trends?: boolean;
    include_alerts?: boolean;
    include_recommendations?: boolean;
  };
  params: {
    campaignId?: string;
    alertId?: string;
    recommendationId?: string;
    metricName?: string;
  };
  query: {
    steps?: string;
    metric?: string;
    severity?: string;
    type?: string;
    limit?: string;
    offset?: string;
    category?: string;
    include_historical?: string;
  };
}

export function createAnalyticsAPI(pool: Pool): Router {
  const router = Router();
  const analyticsSchema = new AnalyticsSchema(pool);
  const householdService = new HouseholdService(pool);
  const wonderService = new WonderService(pool);
  const analyticsService = new AnalyticsService(pool, householdService, wonderService);

  // Initialize analytics system (admin endpoint)
  router.post('/admin/initialize', async (req: Request, res: Response) => {
    try {
      await analyticsSchema.initializeTables();
      await analyticsSchema.seedAnalyticsSystem();
      
      res.json({
        success: true,
        message: 'Civilization Analytics system initialized successfully'
      });
    } catch (error) {
      console.error('Failed to initialize analytics system:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to initialize analytics system',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Calculate metrics for a campaign step
  router.post('/campaigns/:campaignId/calculate', async (req: AnalyticsAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      const { campaign_step = 1 } = req.body;
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      if (typeof campaign_step !== 'number' || campaign_step < 1) {
        return res.status(400).json({
          success: false,
          error: 'Campaign step must be a positive integer'
        });
      }

      const result = await analyticsService.calculateCivilizationMetrics(campaignId, campaign_step);
      
      res.json({
        success: true,
        data: result,
        message: `Calculated civilization metrics for campaign ${campaignId}, step ${campaign_step}`
      });
    } catch (error) {
      console.error('Failed to calculate metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate civilization metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get system health report
  router.get('/campaigns/:campaignId/health', async (req: AnalyticsAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      const healthReport = await analyticsService.getSystemHealthReport(campaignId);
      
      res.json({
        success: true,
        data: healthReport
      });
    } catch (error) {
      console.error('Failed to get system health report:', error);
      
      if (error instanceof Error && error.message.includes('No metrics found')) {
        return res.status(404).json({
          success: false,
          error: error.message,
          suggestion: 'Calculate metrics for this campaign first using POST /calculate'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve system health report',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get historical metrics
  router.get('/campaigns/:campaignId/metrics', async (req: AnalyticsAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      const { steps = '10', metric, include_historical = 'true' } = req.query;
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      const stepsLimit = parseInt(steps);
      if (isNaN(stepsLimit) || stepsLimit < 1 || stepsLimit > 100) {
        return res.status(400).json({
          success: false,
          error: 'Steps limit must be between 1 and 100'
        });
      }

      const client = await pool.connect();
      try {
        let query = `
          SELECT * FROM civilization_metrics
          WHERE campaign_id = $1
          ORDER BY campaign_step DESC
          LIMIT $2
        `;
        const params = [campaignId, stepsLimit];

        const result = await client.query(query, params);
        
        const metrics = result.rows.map(row => ({
          ...row,
          gdp_total: Number(row.gdp_total),
          gdp_per_capita: Number(row.gdp_per_capita),
          gini_coefficient: Number(row.gini_coefficient),
          civilization_health_index: Number(row.civilization_health_index),
          sustainability_index: Number(row.sustainability_index),
          overall_prosperity_score: Number(row.overall_prosperity_score)
        }));

        // If specific metric requested, extract that data for charting
        if (metric && metrics.length > 0) {
          const metricData = metrics.map(m => ({
            campaign_step: m.campaign_step,
            value: m[metric],
            recorded_at: m.recorded_at
          })).filter(d => d.value !== undefined);

          return res.json({
            success: true,
            data: {
              metric_name: metric,
              data_points: metricData.reverse(), // Reverse to get chronological order
              total_points: metricData.length,
              latest_value: metricData[metricData.length - 1]?.value
            }
          });
        }

        res.json({
          success: true,
          data: {
            metrics: metrics.reverse(), // Reverse to get chronological order
            total_records: metrics.length,
            campaign_id: campaignId
          }
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to get historical metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve historical metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get metric trends
  router.get('/campaigns/:campaignId/trends', async (req: AnalyticsAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      const { metric } = req.query;
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      const client = await pool.connect();
      try {
        let query = `
          SELECT * FROM metric_trends
          WHERE campaign_id = $1
        `;
        const params: any[] = [campaignId];

        if (metric) {
          query += ` AND metric_name = $2`;
          params.push(metric);
        }

        query += ` ORDER BY created_at DESC`;

        const result = await client.query(query, params);
        
        const trends = result.rows.map(row => ({
          ...row,
          trend_strength: Number(row.trend_strength),
          confidence_score: Number(row.confidence_score)
        }));

        res.json({
          success: true,
          data: {
            trends,
            total_trends: trends.length,
            campaign_id: campaignId
          }
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to get metric trends:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve metric trends',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get analytics alerts
  router.get('/campaigns/:campaignId/alerts', async (req: AnalyticsAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      const { severity, type, limit = '20' } = req.query;
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      const client = await pool.connect();
      try {
        let query = `
          SELECT * FROM analytics_alerts
          WHERE campaign_id = $1 AND is_resolved = false
        `;
        const params: any[] = [campaignId];

        if (severity) {
          query += ` AND severity_level = $${params.length + 1}`;
          params.push(severity);
        }

        if (type) {
          query += ` AND alert_type = $${params.length + 1}`;
          params.push(type);
        }

        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));

        const result = await client.query(query, params);
        
        const alerts = result.rows.map(row => ({
          ...row,
          current_value: Number(row.current_value),
          threshold_value: Number(row.threshold_value),
          recommended_actions: typeof row.recommended_actions === 'string' ? 
            JSON.parse(row.recommended_actions) : row.recommended_actions
        }));

        res.json({
          success: true,
          data: {
            alerts,
            total_alerts: alerts.length,
            unresolved_count: alerts.length,
            campaign_id: campaignId
          }
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to get analytics alerts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve analytics alerts',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Resolve analytics alert
  router.post('/alerts/:alertId/resolve', async (req: AnalyticsAPIRequest, res: Response) => {
    try {
      const { alertId } = req.params;
      
      if (!alertId) {
        return res.status(400).json({
          success: false,
          error: 'Alert ID is required'
        });
      }

      const client = await pool.connect();
      try {
        const result = await client.query(`
          UPDATE analytics_alerts 
          SET is_resolved = true, resolved_at = NOW()
          WHERE id = $1 AND is_resolved = false
          RETURNING *
        `, [alertId]);

        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'Alert not found or already resolved'
          });
        }

        res.json({
          success: true,
          data: {
            alert: result.rows[0],
            message: 'Alert resolved successfully'
          }
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resolve alert',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get advisory recommendations
  router.get('/campaigns/:campaignId/recommendations', async (req: AnalyticsAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      const { type, limit = '10' } = req.query;
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      const client = await pool.connect();
      try {
        let query = `
          SELECT * FROM advisory_recommendations
          WHERE campaign_id = $1 AND is_implemented = false
        `;
        const params: any[] = [campaignId];

        if (type) {
          query += ` AND recommendation_type = $${params.length + 1}`;
          params.push(type);
        }

        query += ` ORDER BY 
          CASE priority_level 
            WHEN 'urgent' THEN 1 
            WHEN 'high' THEN 2 
            WHEN 'medium' THEN 3 
            WHEN 'low' THEN 4 
          END,
          created_at DESC
          LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));

        const result = await client.query(query, params);
        
        const recommendations = result.rows.map(row => ({
          ...row,
          affected_metrics: typeof row.affected_metrics === 'string' ? 
            JSON.parse(row.affected_metrics) : row.affected_metrics,
          expected_impact: typeof row.expected_impact === 'string' ? 
            JSON.parse(row.expected_impact) : row.expected_impact,
          implementation_cost: typeof row.implementation_cost === 'string' ? 
            JSON.parse(row.implementation_cost) : row.implementation_cost,
          success_probability: Number(row.success_probability)
        }));

        res.json({
          success: true,
          data: {
            recommendations,
            total_recommendations: recommendations.length,
            campaign_id: campaignId
          }
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Implement recommendation
  router.post('/recommendations/:recommendationId/implement', async (req: AnalyticsAPIRequest, res: Response) => {
    try {
      const { recommendationId } = req.params;
      
      if (!recommendationId) {
        return res.status(400).json({
          success: false,
          error: 'Recommendation ID is required'
        });
      }

      const client = await pool.connect();
      try {
        const result = await client.query(`
          UPDATE advisory_recommendations 
          SET is_implemented = true, implemented_at = NOW()
          WHERE id = $1 AND is_implemented = false
          RETURNING *
        `, [recommendationId]);

        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'Recommendation not found or already implemented'
          });
        }

        const recommendation = result.rows[0];

        res.json({
          success: true,
          data: {
            recommendation: {
              ...recommendation,
              affected_metrics: typeof recommendation.affected_metrics === 'string' ? 
                JSON.parse(recommendation.affected_metrics) : recommendation.affected_metrics,
              expected_impact: typeof recommendation.expected_impact === 'string' ? 
                JSON.parse(recommendation.expected_impact) : recommendation.expected_impact,
              implementation_cost: typeof recommendation.implementation_cost === 'string' ? 
                JSON.parse(recommendation.implementation_cost) : recommendation.implementation_cost
            },
            message: 'Recommendation marked as implemented'
          }
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to implement recommendation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to implement recommendation',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get dashboard summary
  router.get('/campaigns/:campaignId/dashboard', async (req: AnalyticsAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      // Get latest metrics, trends, alerts, and recommendations in parallel
      const [healthReport, trendsResult, alertsResult, recommendationsResult] = await Promise.all([
        analyticsService.getSystemHealthReport(campaignId).catch(() => null),
        pool.query(`
          SELECT * FROM metric_trends
          WHERE campaign_id = $1
          ORDER BY created_at DESC
          LIMIT 5
        `, [campaignId]),
        pool.query(`
          SELECT * FROM analytics_alerts
          WHERE campaign_id = $1 AND is_resolved = false
          ORDER BY severity_level DESC, created_at DESC
          LIMIT 5
        `, [campaignId]),
        pool.query(`
          SELECT * FROM advisory_recommendations
          WHERE campaign_id = $1 AND is_implemented = false
          ORDER BY 
            CASE priority_level 
              WHEN 'urgent' THEN 1 
              WHEN 'high' THEN 2 
              WHEN 'medium' THEN 3 
              WHEN 'low' THEN 4 
            END,
            created_at DESC
          LIMIT 5
        `, [campaignId])
      ]);

      const dashboard = {
        campaign_id: campaignId,
        health_report: healthReport,
        recent_trends: trendsResult.rows.map(row => ({
          ...row,
          trend_strength: Number(row.trend_strength),
          confidence_score: Number(row.confidence_score)
        })),
        active_alerts: alertsResult.rows.map(row => ({
          ...row,
          current_value: Number(row.current_value),
          threshold_value: Number(row.threshold_value),
          recommended_actions: typeof row.recommended_actions === 'string' ? 
            JSON.parse(row.recommended_actions) : row.recommended_actions
        })),
        pending_recommendations: recommendationsResult.rows.map(row => ({
          ...row,
          affected_metrics: typeof row.affected_metrics === 'string' ? 
            JSON.parse(row.affected_metrics) : row.affected_metrics,
          expected_impact: typeof row.expected_impact === 'string' ? 
            JSON.parse(row.expected_impact) : row.expected_impact,
          implementation_cost: typeof row.implementation_cost === 'string' ? 
            JSON.parse(row.implementation_cost) : row.implementation_cost,
          success_probability: Number(row.success_probability)
        })),
        summary: {
          alerts_count: alertsResult.rows.length,
          recommendations_count: recommendationsResult.rows.length,
          overall_health: healthReport?.overall_score || 0,
          development_trajectory: healthReport?.development_trajectory || 'stable'
        },
        last_updated: new Date().toISOString()
      };

      res.json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      console.error('Failed to get dashboard summary:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve dashboard summary',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Export analytics data
  router.get('/campaigns/:campaignId/export', async (req: AnalyticsAPIRequest, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId!);
      const { category = 'all' } = req.query;
      
      if (isNaN(campaignId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid campaign ID'
        });
      }

      const exportData: any = {
        campaign_id: campaignId,
        export_timestamp: new Date().toISOString()
      };

      const client = await pool.connect();
      try {
        if (category === 'all' || category === 'metrics') {
          const metricsResult = await client.query(`
            SELECT * FROM civilization_metrics
            WHERE campaign_id = $1
            ORDER BY campaign_step ASC
          `, [campaignId]);
          exportData.metrics = metricsResult.rows;
        }

        if (category === 'all' || category === 'trends') {
          const trendsResult = await client.query(`
            SELECT * FROM metric_trends
            WHERE campaign_id = $1
            ORDER BY created_at DESC
          `, [campaignId]);
          exportData.trends = trendsResult.rows;
        }

        if (category === 'all' || category === 'alerts') {
          const alertsResult = await client.query(`
            SELECT * FROM analytics_alerts
            WHERE campaign_id = $1
            ORDER BY created_at DESC
          `, [campaignId]);
          exportData.alerts = alertsResult.rows;
        }

        if (category === 'all' || category === 'recommendations') {
          const recommendationsResult = await client.query(`
            SELECT * FROM advisory_recommendations
            WHERE campaign_id = $1
            ORDER BY created_at DESC
          `, [campaignId]);
          exportData.recommendations = recommendationsResult.rows;
        }

        // Set appropriate headers for file download
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="analytics-export-campaign-${campaignId}-${new Date().toISOString().split('T')[0]}.json"`);

        res.json({
          success: true,
          data: exportData
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to export analytics data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to export analytics data',
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
          (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'civilization_metrics') as metrics_table,
          (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'metric_trends') as trends_table,
          (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'analytics_alerts') as alerts_table,
          (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'advisory_recommendations') as recommendations_table
      `);
      
      client.release();
      
      const tableStatus = result.rows[0];
      const allTablesExist = tableStatus.metrics_table > 0 && 
                           tableStatus.trends_table > 0 && 
                           tableStatus.alerts_table > 0 &&
                           tableStatus.recommendations_table > 0;

      res.json({
        success: true,
        status: allTablesExist ? 'healthy' : 'degraded',
        database: {
          connected: true,
          tables: {
            civilization_metrics: tableStatus.metrics_table > 0,
            metric_trends: tableStatus.trends_table > 0,
            analytics_alerts: tableStatus.alerts_table > 0,
            advisory_recommendations: tableStatus.recommendations_table > 0
          }
        },
        services: {
          analytics_service: 'operational',
          household_integration: 'operational',
          wonders_integration: 'operational'
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Analytics system health check failed:', error);
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
