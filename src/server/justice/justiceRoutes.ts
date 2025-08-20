/**
 * Justice Department API Routes
 * 
 * RESTful API endpoints for Justice Department operations including law enforcement oversight,
 * judicial administration, legal policy implementation, and justice system performance management.
 */

import express from 'express';
import { Pool } from 'pg';
import { JusticeSecretaryService } from './JusticeSecretaryService.js';

const router = express.Router();

// Initialize service (will be properly injected in production)
let justiceService: JusticeSecretaryService;

// Middleware to ensure service is initialized
router.use((req, res, next) => {
  if (!justiceService && req.app.locals.pool) {
    justiceService = new JusticeSecretaryService(req.app.locals.pool as Pool);
  }
  next();
});

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Justice Department',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    capabilities: [
      'law_enforcement_oversight',
      'judicial_administration',
      'policy_implementation',
      'performance_monitoring',
      'budget_management'
    ]
  });
});

/**
 * Get comprehensive justice system status
 */
router.get('/status/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const status = await justiceService.getJusticeSystemStatus(civilizationId);
    
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get justice system status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get all justice operations
 */
router.get('/operations/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const { type, status, limit } = req.query;
    
    const operations = await justiceService.getOperations(civilizationId, {
      type: type as string,
      status: status as string,
      limit: limit ? parseInt(limit as string) : undefined
    });
    
    res.json({
      success: true,
      data: operations,
      count: operations.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get justice operations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create new justice operation
 */
router.post('/operations/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const operationData = req.body;
    
    if (!operationData.operation_type || !operationData.title) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['operation_type', 'title']
      });
    }
    
    const operation = await justiceService.createOperation(civilizationId, operationData);
    
    res.status(201).json({
      success: true,
      data: operation,
      message: 'Justice operation created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create justice operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Update justice operation
 */
router.put('/operations/:operationId', async (req, res) => {
  try {
    const { operationId } = req.params;
    const updates = req.body;
    
    const operation = await justiceService.updateOperation(operationId, updates);
    
    res.json({
      success: true,
      data: operation,
      message: 'Justice operation updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update justice operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get all judicial appointments
 */
router.get('/appointments/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const appointments = await justiceService.getAppointments(civilizationId);
    
    res.json({
      success: true,
      data: appointments,
      count: appointments.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get judicial appointments',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Nominate judge for appointment
 */
router.post('/appointments/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const appointmentData = req.body;
    
    if (!appointmentData.court_id || !appointmentData.position_title || !appointmentData.nominee_name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['court_id', 'position_title', 'nominee_name']
      });
    }
    
    const appointment = await justiceService.nominateJudge(civilizationId, appointmentData);
    
    res.status(201).json({
      success: true,
      data: appointment,
      message: 'Judge nominated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to nominate judge',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Confirm judicial appointment
 */
router.put('/appointments/:appointmentId/confirm', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { voteFor, voteAgainst } = req.body;
    
    if (voteFor === undefined || voteAgainst === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['voteFor', 'voteAgainst']
      });
    }
    
    const appointment = await justiceService.confirmAppointment(appointmentId, voteFor, voteAgainst);
    
    res.json({
      success: true,
      data: appointment,
      message: `Appointment ${appointment.confirmation_status}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to confirm appointment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get all justice policies
 */
router.get('/policies/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const policies = await justiceService.getPolicies(civilizationId);
    
    res.json({
      success: true,
      data: policies,
      count: policies.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get justice policies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create new justice policy
 */
router.post('/policies/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const policyData = req.body;
    
    if (!policyData.policy_name || !policyData.policy_type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['policy_name', 'policy_type']
      });
    }
    
    const policy = await justiceService.createPolicy(civilizationId, policyData);
    
    res.status(201).json({
      success: true,
      data: policy,
      message: 'Justice policy created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create justice policy',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Implement justice policy
 */
router.post('/policies/:policyId/implement', async (req, res) => {
  try {
    const { policyId } = req.params;
    const result = await justiceService.implementPolicy(policyId);
    
    res.json({
      success: true,
      data: result,
      message: 'Policy implementation initiated',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to implement policy',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get all oversight activities
 */
router.get('/oversight/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const oversight = await justiceService.getOversightActivities(civilizationId);
    
    res.json({
      success: true,
      data: oversight,
      count: oversight.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get oversight activities',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Initiate agency oversight
 */
router.post('/oversight/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const oversightData = req.body;
    
    if (!oversightData.agency_id || !oversightData.oversight_type || !oversightData.title) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['agency_id', 'oversight_type', 'title']
      });
    }
    
    const oversight = await justiceService.initiateOversight(civilizationId, oversightData);
    
    res.status(201).json({
      success: true,
      data: oversight,
      message: 'Oversight initiated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to initiate oversight',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Complete oversight with findings
 */
router.put('/oversight/:oversightId/complete', async (req, res) => {
  try {
    const { oversightId } = req.params;
    const { findings, recommendations, correctiveActions } = req.body;
    
    if (!findings || !recommendations || !correctiveActions) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['findings', 'recommendations', 'correctiveActions']
      });
    }
    
    const oversight = await justiceService.completeOversight(
      oversightId,
      findings,
      recommendations,
      correctiveActions
    );
    
    res.json({
      success: true,
      data: oversight,
      message: 'Oversight completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to complete oversight',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get comprehensive justice analytics
 */
router.get('/analytics/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const analytics = await justiceService.generateJusticeAnalytics(civilizationId);
    
    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate justice analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Allocate justice department budget
 */
router.post('/budget/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const { allocations } = req.body;
    
    if (!allocations || !Array.isArray(allocations)) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid allocations array'
      });
    }
    
    const result = await justiceService.allocateBudget(civilizationId, allocations);
    
    res.json({
      success: true,
      data: result,
      message: 'Budget allocated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to allocate budget',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Record performance metrics
 */
router.post('/metrics/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const metrics = req.body;
    
    const result = await justiceService.recordPerformanceMetrics(civilizationId, metrics);
    
    res.json({
      success: true,
      data: result,
      message: 'Performance metrics recorded successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to record performance metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get legal system integration endpoints
 */
router.get('/legal/cases', (req, res) => {
  try {
    // Redirect to legal system routes
    res.redirect('/api/legal/cases');
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to access legal cases',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/legal/crimes', (req, res) => {
  try {
    // Redirect to legal system routes
    res.redirect('/api/legal/crimes');
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to access crimes',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/legal/corruption', (req, res) => {
  try {
    // Redirect to legal system routes
    res.redirect('/api/legal/corruption');
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to access corruption cases',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/legal/agencies', (req, res) => {
  try {
    // Redirect to legal system routes
    res.redirect('/api/legal/agencies');
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to access law enforcement agencies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/legal/courts', (req, res) => {
  try {
    // Redirect to legal system routes
    res.redirect('/api/legal/courts');
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to access courts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Simulate justice system time step
 */
router.post('/simulate/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    
    // Record current performance metrics
    await justiceService.recordPerformanceMetrics(civilizationId, {});
    
    // Get updated status
    const status = await justiceService.getJusticeSystemStatus(civilizationId);
    
    res.json({
      success: true,
      message: 'Justice system simulation step completed',
      data: {
        systemHealth: status.systemHealth.justiceHealth.overallScore,
        activeOperations: status.activeOperations.length,
        performanceMetrics: status.performanceMetrics
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to simulate justice system',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
