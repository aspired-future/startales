import { Router } from 'express';
import { Pool } from 'pg';
import { PlanetaryGovernmentService } from './PlanetaryGovernmentService.js';

/**
 * Planetary Government API Routes
 * Provides endpoints for managing automated planetary-level governance
 */

export function createPlanetaryGovernmentRoutes(pool: Pool): Router {
  const router = Router();
  const service = new PlanetaryGovernmentService(pool);

  /**
   * GET /api/planetary-government/:planetId/dashboard
   * Get comprehensive dashboard data for a planetary government
   */
  router.get('/:planetId/dashboard', async (req, res) => {
    try {
      const { planetId } = req.params;
      const { civilizationId = '1' } = req.query;
      
      const government = await service.getPlanetaryGovernment(planetId, civilizationId as string);
      
      if (!government) {
        return res.status(404).json({
          success: false,
          error: 'Planetary government not found'
        });
      }

      const dashboardData = await service.getDashboardData(government.id);
      
      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      console.error('Error fetching planetary government dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard data'
      });
    }
  });

  /**
   * GET /api/planetary-government/:planetId
   * Get planetary government details
   */
  router.get('/:planetId', async (req, res) => {
    try {
      const { planetId } = req.params;
      const { civilizationId = '1' } = req.query;
      
      const government = await service.getPlanetaryGovernment(planetId, civilizationId as string);
      
      if (!government) {
        return res.status(404).json({
          success: false,
          error: 'Planetary government not found'
        });
      }

      res.json({
        success: true,
        data: government
      });
    } catch (error) {
      console.error('Error fetching planetary government:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch planetary government'
      });
    }
  });

  /**
   * GET /api/planetary-government/civilization/:civilizationId
   * Get all planetary governments for a civilization
   */
  router.get('/civilization/:civilizationId', async (req, res) => {
    try {
      const { civilizationId } = req.params;
      
      const governments = await service.getPlanetaryGovernmentsByCivilization(civilizationId);
      
      res.json({
        success: true,
        data: governments
      });
    } catch (error) {
      console.error('Error fetching planetary governments:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch planetary governments'
      });
    }
  });

  /**
   * POST /api/planetary-government
   * Create a new planetary government
   */
  router.post('/', async (req, res) => {
    try {
      const governmentData = req.body;
      
      const government = await service.createPlanetaryGovernment(governmentData);
      
      res.status(201).json({
        success: true,
        data: government
      });
    } catch (error) {
      console.error('Error creating planetary government:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create planetary government'
      });
    }
  });

  /**
   * PUT /api/planetary-government/:planetId
   * Update planetary government
   */
  router.put('/:planetId', async (req, res) => {
    try {
      const { planetId } = req.params;
      const { civilizationId = '1' } = req.query;
      const updateData = req.body;
      
      const government = await service.getPlanetaryGovernment(planetId, civilizationId as string);
      
      if (!government) {
        return res.status(404).json({
          success: false,
          error: 'Planetary government not found'
        });
      }

      const updatedGovernment = await service.updatePlanetaryGovernment(government.id, updateData);
      
      res.json({
        success: true,
        data: updatedGovernment
      });
    } catch (error) {
      console.error('Error updating planetary government:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update planetary government'
      });
    }
  });

  /**
   * GET /api/planetary-government/:planetId/cities
   * Get cities managed by planetary government
   */
  router.get('/:planetId/cities', async (req, res) => {
    try {
      const { planetId } = req.params;
      const { civilizationId = '1' } = req.query;
      
      const government = await service.getPlanetaryGovernment(planetId, civilizationId as string);
      
      if (!government) {
        return res.status(404).json({
          success: false,
          error: 'Planetary government not found'
        });
      }

      const cities = await service.getPlanetaryCities(government.id);
      
      res.json({
        success: true,
        data: cities
      });
    } catch (error) {
      console.error('Error fetching planetary cities:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch planetary cities'
      });
    }
  });

  /**
   * POST /api/planetary-government/:planetId/cities
   * Add a city to planetary government management
   */
  router.post('/:planetId/cities', async (req, res) => {
    try {
      const { planetId } = req.params;
      const { civilizationId = '1' } = req.query;
      const cityData = req.body;
      
      const government = await service.getPlanetaryGovernment(planetId, civilizationId as string);
      
      if (!government) {
        return res.status(404).json({
          success: false,
          error: 'Planetary government not found'
        });
      }

      const city = await service.addCityToGovernment(government.id, cityData);
      
      res.status(201).json({
        success: true,
        data: city
      });
    } catch (error) {
      console.error('Error adding city to government:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add city to government'
      });
    }
  });

  /**
   * GET /api/planetary-government/:planetId/decisions
   * Get recent government decisions
   */
  router.get('/:planetId/decisions', async (req, res) => {
    try {
      const { planetId } = req.params;
      const { civilizationId = '1', limit = '10' } = req.query;
      
      const government = await service.getPlanetaryGovernment(planetId, civilizationId as string);
      
      if (!government) {
        return res.status(404).json({
          success: false,
          error: 'Planetary government not found'
        });
      }

      const decisions = await service.getRecentDecisions(government.id, parseInt(limit as string));
      
      res.json({
        success: true,
        data: decisions
      });
    } catch (error) {
      console.error('Error fetching government decisions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch government decisions'
      });
    }
  });

  /**
   * POST /api/planetary-government/:planetId/decisions
   * Record a new government decision
   */
  router.post('/:planetId/decisions', async (req, res) => {
    try {
      const { planetId } = req.params;
      const { civilizationId = '1' } = req.query;
      const decisionData = req.body;
      
      const government = await service.getPlanetaryGovernment(planetId, civilizationId as string);
      
      if (!government) {
        return res.status(404).json({
          success: false,
          error: 'Planetary government not found'
        });
      }

      const decision = await service.recordDecision({
        ...decisionData,
        planetaryGovernmentId: government.id
      });
      
      res.status(201).json({
        success: true,
        data: decision
      });
    } catch (error) {
      console.error('Error recording government decision:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to record government decision'
      });
    }
  });

  /**
   * GET /api/planetary-government/:planetId/metrics
   * Get performance metrics history
   */
  router.get('/:planetId/metrics', async (req, res) => {
    try {
      const { planetId } = req.params;
      const { civilizationId = '1', days = '30' } = req.query;
      
      const government = await service.getPlanetaryGovernment(planetId, civilizationId as string);
      
      if (!government) {
        return res.status(404).json({
          success: false,
          error: 'Planetary government not found'
        });
      }

      const metrics = await service.getMetricsHistory(government.id, parseInt(days as string));
      
      res.json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Error fetching government metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch government metrics'
      });
    }
  });

  /**
   * POST /api/planetary-government/:planetId/metrics
   * Record new performance metrics
   */
  router.post('/:planetId/metrics', async (req, res) => {
    try {
      const { planetId } = req.params;
      const { civilizationId = '1' } = req.query;
      const metricsData = req.body;
      
      const government = await service.getPlanetaryGovernment(planetId, civilizationId as string);
      
      if (!government) {
        return res.status(404).json({
          success: false,
          error: 'Planetary government not found'
        });
      }

      const metrics = await service.recordMetrics({
        ...metricsData,
        planetaryGovernmentId: government.id
      });
      
      res.status(201).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Error recording government metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to record government metrics'
      });
    }
  });

  /**
   * GET /api/planetary-government/:planetId/knobs
   * Get AI knob settings for planetary government
   */
  router.get('/:planetId/knobs', async (req, res) => {
    try {
      const { planetId } = req.params;
      const { civilizationId = '1' } = req.query;
      
      const government = await service.getPlanetaryGovernment(planetId, civilizationId as string);
      
      if (!government) {
        return res.status(404).json({
          success: false,
          error: 'Planetary government not found'
        });
      }

      const result = await pool.query(
        'SELECT knob_settings, updated_at FROM planetary_government_knobs WHERE planetary_government_id = $1',
        [government.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'AI knob settings not found'
        });
      }

      res.json({
        success: true,
        data: {
          knobs: result.rows[0].knob_settings,
          lastUpdated: result.rows[0].updated_at
        }
      });
    } catch (error) {
      console.error('Error fetching planetary government knobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch AI knob settings'
      });
    }
  });

  /**
   * POST /api/planetary-government/:planetId/knobs
   * Update AI knob settings for planetary government
   */
  router.post('/:planetId/knobs', async (req, res) => {
    try {
      const { planetId } = req.params;
      const { civilizationId = '1' } = req.query;
      const { knobs } = req.body;
      
      const government = await service.getPlanetaryGovernment(planetId, civilizationId as string);
      
      if (!government) {
        return res.status(404).json({
          success: false,
          error: 'Planetary government not found'
        });
      }

      await pool.query(`
        INSERT INTO planetary_government_knobs (planetary_government_id, knob_settings)
        VALUES ($1, $2)
        ON CONFLICT (planetary_government_id) 
        DO UPDATE SET 
          knob_settings = $2,
          updated_at = CURRENT_TIMESTAMP
      `, [government.id, JSON.stringify(knobs)]);

      res.json({
        success: true,
        message: 'AI knob settings updated successfully'
      });
    } catch (error) {
      console.error('Error updating planetary government knobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update AI knob settings'
      });
    }
  });

  /**
   * POST /api/planetary-government/:planetId/simulate
   * Run AI simulation for planetary government
   */
  router.post('/:planetId/simulate', async (req, res) => {
    try {
      const { planetId } = req.params;
      const { civilizationId = '1' } = req.query;
      
      const government = await service.getPlanetaryGovernment(planetId, civilizationId as string);
      
      if (!government) {
        return res.status(404).json({
          success: false,
          error: 'Planetary government not found'
        });
      }

      // Get current AI knobs
      const knobsResult = await pool.query(
        'SELECT knob_settings FROM planetary_government_knobs WHERE planetary_government_id = $1',
        [government.id]
      );

      const knobs = knobsResult.rows.length > 0 ? knobsResult.rows[0].knob_settings : {};

      // Run simulation (placeholder - would integrate with actual AI simulation engine)
      const simulationResults = await runPlanetaryGovernmentSimulation(government, knobs);

      res.json({
        success: true,
        data: {
          simulation: simulationResults,
          timestamp: new Date(),
          government: government
        }
      });
    } catch (error) {
      console.error('Error running planetary government simulation:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to run simulation'
      });
    }
  });

  /**
   * GET /api/planetary-government/:planetId/recommendations
   * Get AI recommendations for planetary government
   */
  router.get('/:planetId/recommendations', async (req, res) => {
    try {
      const { planetId } = req.params;
      const { civilizationId = '1' } = req.query;
      
      const government = await service.getPlanetaryGovernment(planetId, civilizationId as string);
      
      if (!government) {
        return res.status(404).json({
          success: false,
          error: 'Planetary government not found'
        });
      }

      const recommendations = await generatePlanetaryGovernmentRecommendations(government);

      res.json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      console.error('Error generating planetary government recommendations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate recommendations'
      });
    }
  });

  return router;
}

/**
 * Helper function to run planetary government simulation
 */
async function runPlanetaryGovernmentSimulation(government: any, knobs: any): Promise<any> {
  // Placeholder simulation logic
  // In a real implementation, this would integrate with the AI simulation engine
  
  const simulationResults = {
    economicImpact: {
      gdpChange: (knobs.budgetAllocation?.value || 50) * 0.02 - 1,
      employmentChange: (knobs.economicDiversification?.value || 50) * 0.01 - 0.5,
      inflationChange: (knobs.taxationPolicy?.value || 50) * 0.005 - 0.25
    },
    socialImpact: {
      approvalChange: (knobs.transparencyLevel?.value || 50) * 0.03 - 1.5,
      qualityOfLifeChange: (knobs.socialServices?.value || 50) * 0.02 - 1,
      educationChange: (knobs.educationInvestment?.value || 50) * 0.015 - 0.75
    },
    environmentalImpact: {
      sustainabilityChange: (knobs.environmentalProtection?.value || 50) * 0.02 - 1,
      energyEfficiencyChange: (knobs.energyPolicy?.value || 50) * 0.01 - 0.5
    },
    infrastructureImpact: {
      developmentChange: (knobs.infrastructureInvestment?.value || 50) * 0.025 - 1.25,
      transportationChange: (knobs.transportationDevelopment?.value || 50) * 0.015 - 0.75
    },
    recommendations: [
      "Consider adjusting budget allocation based on current economic conditions",
      "Infrastructure investment could improve long-term sustainability",
      "Transparency levels affect citizen approval ratings significantly"
    ]
  };

  return simulationResults;
}

/**
 * Helper function to generate AI recommendations
 */
async function generatePlanetaryGovernmentRecommendations(government: any): Promise<any> {
  const recommendations = {
    priority: "high",
    categories: {
      economic: [
        {
          title: "Optimize Budget Allocation",
          description: "Current budget utilization could be improved for better economic growth",
          impact: "medium",
          difficulty: "low"
        }
      ],
      social: [
        {
          title: "Increase Education Investment",
          description: "Higher education investment correlates with long-term prosperity",
          impact: "high",
          difficulty: "medium"
        }
      ],
      environmental: [
        {
          title: "Enhance Sustainability Programs",
          description: "Environmental health affects citizen quality of life",
          impact: "medium",
          difficulty: "medium"
        }
      ],
      governance: [
        {
          title: "Improve Inter-City Coordination",
          description: "Better coordination between cities can optimize resource allocation",
          impact: "high",
          difficulty: "low"
        }
      ]
    },
    nextActions: [
      "Review current policy priorities",
      "Analyze city performance metrics",
      "Consider infrastructure upgrades"
    ]
  };

  return recommendations;
}
