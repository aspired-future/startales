import express from 'express';
import { getJointChiefsService } from './JointChiefsService.js';

const router = express.Router();

/**
 * GET /api/joint-chiefs/ - List all joint chiefs for a civilization
 */
router.get('/', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getJointChiefsService();
    const jointChiefs = await service.getJointChiefs(civilizationId);

    res.json({
      success: true,
      data: jointChiefs,
      count: jointChiefs.length
    });
  } catch (error) {
    console.error('Error fetching joint chiefs:', error);
    res.status(500).json({
      error: 'Failed to fetch joint chiefs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/joint-chiefs/:id - Get specific joint chief details
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = getJointChiefsService();
    const jointChief = await service.getJointChief(id);

    if (!jointChief) {
      return res.status(404).json({
        error: 'Joint chief not found',
        message: `No joint chief found with ID ${id}`
      });
    }

    res.json({
      success: true,
      data: jointChief
    });
  } catch (error) {
    console.error('Error fetching joint chief:', error);
    res.status(500).json({
      error: 'Failed to fetch joint chief',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/joint-chiefs/ - Appoint new joint chief
 */
router.post('/', async (req, res) => {
  try {
    const service = getJointChiefsService();
    const jointChief = await service.appointJointChief(req.body);

    res.status(201).json({
      success: true,
      data: jointChief,
      message: 'Joint chief appointed successfully'
    });
  } catch (error) {
    console.error('Error appointing joint chief:', error);
    res.status(500).json({
      error: 'Failed to appoint joint chief',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/joint-chiefs/:id - Update joint chief information
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = getJointChiefsService();
    const jointChief = await service.updateJointChief(id, req.body);

    res.json({
      success: true,
      data: jointChief,
      message: 'Joint chief updated successfully'
    });
  } catch (error) {
    console.error('Error updating joint chief:', error);
    res.status(500).json({
      error: 'Failed to update joint chief',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/joint-chiefs/:id - Remove/retire joint chief
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = getJointChiefsService();
    await service.retireJointChief(id);

    res.json({
      success: true,
      message: 'Joint chief retired successfully'
    });
  } catch (error) {
    console.error('Error retiring joint chief:', error);
    res.status(500).json({
      error: 'Failed to retire joint chief',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/joint-chiefs/services - List all military services
 */
router.get('/services', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getJointChiefsService();
    const services = await service.getMilitaryServices(civilizationId);

    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Error fetching military services:', error);
    res.status(500).json({
      error: 'Failed to fetch military services',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/joint-chiefs/services/:serviceCode - Get service details
 */
router.get('/services/:serviceCode', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const serviceCode = req.params.serviceCode;
    const service = getJointChiefsService();
    const militaryService = await service.getMilitaryService(civilizationId, serviceCode);

    if (!militaryService) {
      return res.status(404).json({
        error: 'Military service not found',
        message: `No service found with code ${serviceCode}`
      });
    }

    res.json({
      success: true,
      data: militaryService
    });
  } catch (error) {
    console.error('Error fetching military service:', error);
    res.status(500).json({
      error: 'Failed to fetch military service',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/joint-chiefs/services/:serviceCode - Update service information
 */
router.put('/services/:serviceCode', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const serviceCode = req.params.serviceCode;
    const service = getJointChiefsService();
    const militaryService = await service.updateMilitaryService(civilizationId, serviceCode, req.body);

    res.json({
      success: true,
      data: militaryService,
      message: 'Military service updated successfully'
    });
  } catch (error) {
    console.error('Error updating military service:', error);
    res.status(500).json({
      error: 'Failed to update military service',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/joint-chiefs/services/:serviceCode/readiness - Get service readiness status
 */
router.get('/services/:serviceCode/readiness', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const serviceCode = req.params.serviceCode;
    const service = getJointChiefsService();
    const militaryService = await service.getMilitaryService(civilizationId, serviceCode);

    if (!militaryService) {
      return res.status(404).json({
        error: 'Military service not found',
        message: `No service found with code ${serviceCode}`
      });
    }

    const readinessData = {
      service_name: militaryService.service_name,
      service_code: militaryService.service_code,
      readiness_level: militaryService.readiness_level,
      personnel_count: militaryService.personnel_count,
      active_units: militaryService.active_units,
      budget_allocation: militaryService.budget_allocation,
      capabilities: militaryService.capabilities,
      last_updated: militaryService.updated_at
    };

    res.json({
      success: true,
      data: readinessData
    });
  } catch (error) {
    console.error('Error fetching service readiness:', error);
    res.status(500).json({
      error: 'Failed to fetch service readiness',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/joint-chiefs/strategic-plans - List strategic plans
 */
router.get('/strategic-plans', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const status = req.query.status as string;
    const priority = req.query.priority as string;
    
    const service = getJointChiefsService();
    const plans = await service.getStrategicPlans(civilizationId, { status, priority });

    res.json({
      success: true,
      data: plans,
      count: plans.length
    });
  } catch (error) {
    console.error('Error fetching strategic plans:', error);
    res.status(500).json({
      error: 'Failed to fetch strategic plans',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/joint-chiefs/strategic-plans - Create new strategic plan
 */
router.post('/strategic-plans', async (req, res) => {
  try {
    const service = getJointChiefsService();
    const plan = await service.createStrategicPlan(req.body);

    res.status(201).json({
      success: true,
      data: plan,
      message: 'Strategic plan created successfully'
    });
  } catch (error) {
    console.error('Error creating strategic plan:', error);
    res.status(500).json({
      error: 'Failed to create strategic plan',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/joint-chiefs/strategic-plans/:id - Get plan details
 */
router.get('/strategic-plans/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getJointChiefsService();
    const plans = await service.getStrategicPlans(civilizationId);
    const plan = plans.find(p => p.id === id);

    if (!plan) {
      return res.status(404).json({
        error: 'Strategic plan not found',
        message: `No strategic plan found with ID ${id}`
      });
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Error fetching strategic plan:', error);
    res.status(500).json({
      error: 'Failed to fetch strategic plan',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/joint-chiefs/strategic-plans/:id - Update strategic plan
 */
router.put('/strategic-plans/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = getJointChiefsService();
    const plan = await service.updateStrategicPlan(id, req.body);

    res.json({
      success: true,
      data: plan,
      message: 'Strategic plan updated successfully'
    });
  } catch (error) {
    console.error('Error updating strategic plan:', error);
    res.status(500).json({
      error: 'Failed to update strategic plan',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/joint-chiefs/strategic-plans/:id/approve - Approve strategic plan
 */
router.post('/strategic-plans/:id/approve', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const approverId = req.body.approver_id || 'defense_secretary';
    const service = getJointChiefsService();
    const plan = await service.approveStrategicPlan(id, approverId);

    res.json({
      success: true,
      data: plan,
      message: 'Strategic plan approved successfully'
    });
  } catch (error) {
    console.error('Error approving strategic plan:', error);
    res.status(500).json({
      error: 'Failed to approve strategic plan',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/joint-chiefs/strategic-plans/:id - Cancel strategic plan
 */
router.delete('/strategic-plans/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = getJointChiefsService();
    await service.updateStrategicPlan(id, { status: 'cancelled' });

    res.json({
      success: true,
      message: 'Strategic plan cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling strategic plan:', error);
    res.status(500).json({
      error: 'Failed to cancel strategic plan',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/joint-chiefs/operations - List joint operations
 */
router.get('/operations', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const status = req.query.status as string;
    const type = req.query.type as string;
    
    const service = getJointChiefsService();
    const operations = await service.getJointOperations(civilizationId, { status, type });

    res.json({
      success: true,
      data: operations,
      count: operations.length
    });
  } catch (error) {
    console.error('Error fetching joint operations:', error);
    res.status(500).json({
      error: 'Failed to fetch joint operations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/joint-chiefs/operations - Create new joint operation
 */
router.post('/operations', async (req, res) => {
  try {
    const service = getJointChiefsService();
    const operation = await service.createJointOperation(req.body);

    res.status(201).json({
      success: true,
      data: operation,
      message: 'Joint operation created successfully'
    });
  } catch (error) {
    console.error('Error creating joint operation:', error);
    res.status(500).json({
      error: 'Failed to create joint operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/joint-chiefs/operations/:id - Get operation details
 */
router.get('/operations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getJointChiefsService();
    const operations = await service.getJointOperations(civilizationId);
    const operation = operations.find(op => op.id === id);

    if (!operation) {
      return res.status(404).json({
        error: 'Joint operation not found',
        message: `No joint operation found with ID ${id}`
      });
    }

    res.json({
      success: true,
      data: operation
    });
  } catch (error) {
    console.error('Error fetching joint operation:', error);
    res.status(500).json({
      error: 'Failed to fetch joint operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/joint-chiefs/operations/:id - Update operation
 */
router.put('/operations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Note: This would require implementing updateJointOperation in the service
    res.status(501).json({
      error: 'Not implemented',
      message: 'Operation update functionality not yet implemented'
    });
  } catch (error) {
    console.error('Error updating joint operation:', error);
    res.status(500).json({
      error: 'Failed to update joint operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/joint-chiefs/operations/:id/execute - Begin operation execution
 */
router.post('/operations/:id/execute', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = getJointChiefsService();
    const operation = await service.executeJointOperation(id);

    res.json({
      success: true,
      data: operation,
      message: 'Joint operation execution started'
    });
  } catch (error) {
    console.error('Error executing joint operation:', error);
    res.status(500).json({
      error: 'Failed to execute joint operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/joint-chiefs/operations/:id/complete - Mark operation complete
 */
router.post('/operations/:id/complete', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { after_action_report, lessons_learned } = req.body;
    const service = getJointChiefsService();
    const operation = await service.completeJointOperation(id, after_action_report, lessons_learned || []);

    res.json({
      success: true,
      data: operation,
      message: 'Joint operation completed successfully'
    });
  } catch (error) {
    console.error('Error completing joint operation:', error);
    res.status(500).json({
      error: 'Failed to complete joint operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/joint-chiefs/recommendations - List recommendations
 */
router.get('/recommendations', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const status = req.query.status as string;
    const urgency = req.query.urgency as string;
    
    const service = getJointChiefsService();
    const recommendations = await service.getCommandRecommendations(civilizationId, { status, urgency });

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      error: 'Failed to fetch recommendations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/joint-chiefs/recommendations - Submit new recommendation
 */
router.post('/recommendations', async (req, res) => {
  try {
    const service = getJointChiefsService();
    const recommendation = await service.submitRecommendation(req.body);

    res.status(201).json({
      success: true,
      data: recommendation,
      message: 'Recommendation submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting recommendation:', error);
    res.status(500).json({
      error: 'Failed to submit recommendation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/joint-chiefs/recommendations/:id - Get recommendation details
 */
router.get('/recommendations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getJointChiefsService();
    const recommendations = await service.getCommandRecommendations(civilizationId);
    const recommendation = recommendations.find(r => r.id === id);

    if (!recommendation) {
      return res.status(404).json({
        error: 'Recommendation not found',
        message: `No recommendation found with ID ${id}`
      });
    }

    res.json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    res.status(500).json({
      error: 'Failed to fetch recommendation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/joint-chiefs/recommendations/:id/respond - Respond to recommendation
 */
router.put('/recommendations/:id/respond', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { response_from, response_notes, status } = req.body;
    const service = getJointChiefsService();
    const recommendation = await service.respondToRecommendation(id, response_from, response_notes, status);

    res.json({
      success: true,
      data: recommendation,
      message: 'Response recorded successfully'
    });
  } catch (error) {
    console.error('Error responding to recommendation:', error);
    res.status(500).json({
      error: 'Failed to respond to recommendation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/joint-chiefs/recommendations/pending - Get pending recommendations
 */
router.get('/recommendations/pending', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getJointChiefsService();
    const recommendations = await service.getPendingRecommendations(civilizationId);

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length
    });
  } catch (error) {
    console.error('Error fetching pending recommendations:', error);
    res.status(500).json({
      error: 'Failed to fetch pending recommendations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/joint-chiefs/analytics/readiness - Overall military readiness
 */
router.get('/analytics/readiness', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getJointChiefsService();
    const readiness = await service.calculateMilitaryReadiness(civilizationId);

    res.json({
      success: true,
      data: readiness
    });
  } catch (error) {
    console.error('Error calculating military readiness:', error);
    res.status(500).json({
      error: 'Failed to calculate military readiness',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/joint-chiefs/analytics/operations-summary - Operations performance
 */
router.get('/analytics/operations-summary', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const timeframe = req.query.timeframe as string || '30d';
    const service = getJointChiefsService();
    const report = await service.generateOperationsReport(civilizationId, timeframe);

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating operations report:', error);
    res.status(500).json({
      error: 'Failed to generate operations report',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/joint-chiefs/analytics/strategic-planning - Strategic planning metrics
 */
router.get('/analytics/strategic-planning', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getJointChiefsService();
    const plans = await service.getStrategicPlans(civilizationId);

    const metrics = {
      total_plans: plans.length,
      by_status: plans.reduce((acc, plan) => {
        acc[plan.status] = (acc[plan.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      by_priority: plans.reduce((acc, plan) => {
        acc[plan.priority_level] = (acc[plan.priority_level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      by_type: plans.reduce((acc, plan) => {
        acc[plan.plan_type] = (acc[plan.plan_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      avg_timeline_months: plans.reduce((sum, plan) => sum + (plan.timeline_months || 0), 0) / plans.length || 0,
      generated_at: new Date()
    };

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error generating strategic planning metrics:', error);
    res.status(500).json({
      error: 'Failed to generate strategic planning metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/joint-chiefs/analytics/inter-service-coordination - Coordination effectiveness
 */
router.get('/analytics/inter-service-coordination', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getJointChiefsService();
    const coordination = await service.assessInterServiceCoordination(civilizationId);

    res.json({
      success: true,
      data: coordination
    });
  } catch (error) {
    console.error('Error assessing inter-service coordination:', error);
    res.status(500).json({
      error: 'Failed to assess inter-service coordination',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
