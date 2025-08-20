import express from 'express';
import { getIntelligenceDirectorsService } from './IntelligenceDirectorsService.js';

const router = express.Router();

/**
 * GET /api/intelligence/directors - List all intelligence directors
 */
router.get('/directors', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getIntelligenceDirectorsService();
    const directors = await service.getIntelligenceDirectors(civilizationId);

    res.json({
      success: true,
      data: directors,
      count: directors.length
    });
  } catch (error) {
    console.error('Error fetching intelligence directors:', error);
    res.status(500).json({
      error: 'Failed to fetch intelligence directors',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/directors/:id - Get specific director details
 */
router.get('/directors/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = getIntelligenceDirectorsService();
    const director = await service.getIntelligenceDirector(id);

    if (!director) {
      return res.status(404).json({
        error: 'Intelligence director not found',
        message: `No intelligence director found with ID ${id}`
      });
    }

    res.json({
      success: true,
      data: director
    });
  } catch (error) {
    console.error('Error fetching intelligence director:', error);
    res.status(500).json({
      error: 'Failed to fetch intelligence director',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/intelligence/directors - Appoint new intelligence director
 */
router.post('/directors', async (req, res) => {
  try {
    const service = getIntelligenceDirectorsService();
    const director = await service.appointIntelligenceDirector(req.body);

    res.status(201).json({
      success: true,
      data: director,
      message: 'Intelligence director appointed successfully'
    });
  } catch (error) {
    console.error('Error appointing intelligence director:', error);
    res.status(500).json({
      error: 'Failed to appoint intelligence director',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/intelligence/directors/:id - Update director information
 */
router.put('/directors/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = getIntelligenceDirectorsService();
    const director = await service.updateIntelligenceDirector(id, req.body);

    res.json({
      success: true,
      data: director,
      message: 'Intelligence director updated successfully'
    });
  } catch (error) {
    console.error('Error updating intelligence director:', error);
    res.status(500).json({
      error: 'Failed to update intelligence director',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/intelligence/directors/:id - Remove/retire director
 */
router.delete('/directors/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = getIntelligenceDirectorsService();
    await service.retireIntelligenceDirector(id);

    res.json({
      success: true,
      message: 'Intelligence director retired successfully'
    });
  } catch (error) {
    console.error('Error retiring intelligence director:', error);
    res.status(500).json({
      error: 'Failed to retire intelligence director',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/agencies - List all intelligence agencies
 */
router.get('/agencies', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getIntelligenceDirectorsService();
    const agencies = await service.getIntelligenceAgencies(civilizationId);

    res.json({
      success: true,
      data: agencies,
      count: agencies.length
    });
  } catch (error) {
    console.error('Error fetching intelligence agencies:', error);
    res.status(500).json({
      error: 'Failed to fetch intelligence agencies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/agencies/:code - Get agency details
 */
router.get('/agencies/:code', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const agencyCode = req.params.code;
    const service = getIntelligenceDirectorsService();
    const agency = await service.getIntelligenceAgency(civilizationId, agencyCode);

    if (!agency) {
      return res.status(404).json({
        error: 'Intelligence agency not found',
        message: `No intelligence agency found with code ${agencyCode}`
      });
    }

    res.json({
      success: true,
      data: agency
    });
  } catch (error) {
    console.error('Error fetching intelligence agency:', error);
    res.status(500).json({
      error: 'Failed to fetch intelligence agency',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/intelligence/agencies/:code - Update agency information
 */
router.put('/agencies/:code', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const agencyCode = req.params.code;
    const service = getIntelligenceDirectorsService();
    const agency = await service.updateIntelligenceAgency(civilizationId, agencyCode, req.body);

    res.json({
      success: true,
      data: agency,
      message: 'Intelligence agency updated successfully'
    });
  } catch (error) {
    console.error('Error updating intelligence agency:', error);
    res.status(500).json({
      error: 'Failed to update intelligence agency',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/agencies/:code/capabilities - Get agency capabilities
 */
router.get('/agencies/:code/capabilities', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const agencyCode = req.params.code;
    const service = getIntelligenceDirectorsService();
    const agency = await service.getIntelligenceAgency(civilizationId, agencyCode);

    if (!agency) {
      return res.status(404).json({
        error: 'Intelligence agency not found',
        message: `No intelligence agency found with code ${agencyCode}`
      });
    }

    const capabilities = {
      agency_name: agency.agency_name,
      agency_code: agency.agency_code,
      capabilities: agency.capabilities,
      personnel_count: agency.personnel_count,
      operational_status: agency.operational_status,
      primary_mission: agency.primary_mission,
      classification_level: agency.classification_level
    };

    res.json({
      success: true,
      data: capabilities
    });
  } catch (error) {
    console.error('Error fetching agency capabilities:', error);
    res.status(500).json({
      error: 'Failed to fetch agency capabilities',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/operations - List intelligence operations
 */
router.get('/operations', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const status = req.query.status as string;
    const classification = req.query.classification as string;
    const type = req.query.type as string;
    
    const service = getIntelligenceDirectorsService();
    const operations = await service.getIntelligenceOperations(civilizationId, { status, classification, type });

    res.json({
      success: true,
      data: operations,
      count: operations.length
    });
  } catch (error) {
    console.error('Error fetching intelligence operations:', error);
    res.status(500).json({
      error: 'Failed to fetch intelligence operations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/intelligence/operations - Create new operation
 */
router.post('/operations', async (req, res) => {
  try {
    const service = getIntelligenceDirectorsService();
    const operation = await service.createIntelligenceOperation(req.body);

    res.status(201).json({
      success: true,
      data: operation,
      message: 'Intelligence operation created successfully'
    });
  } catch (error) {
    console.error('Error creating intelligence operation:', error);
    res.status(500).json({
      error: 'Failed to create intelligence operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/operations/:id - Get operation details
 */
router.get('/operations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getIntelligenceDirectorsService();
    const operations = await service.getIntelligenceOperations(civilizationId);
    const operation = operations.find(op => op.id === id);

    if (!operation) {
      return res.status(404).json({
        error: 'Intelligence operation not found',
        message: `No intelligence operation found with ID ${id}`
      });
    }

    res.json({
      success: true,
      data: operation
    });
  } catch (error) {
    console.error('Error fetching intelligence operation:', error);
    res.status(500).json({
      error: 'Failed to fetch intelligence operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/intelligence/operations/:id - Update operation
 */
router.put('/operations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Note: This would require implementing updateIntelligenceOperation in the service
    res.status(501).json({
      error: 'Not implemented',
      message: 'Operation update functionality not yet implemented'
    });
  } catch (error) {
    console.error('Error updating intelligence operation:', error);
    res.status(500).json({
      error: 'Failed to update intelligence operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/intelligence/operations/:id/authorize - Authorize operation
 */
router.post('/operations/:id/authorize', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { authorizing_official } = req.body;
    const service = getIntelligenceDirectorsService();
    const operation = await service.authorizeIntelligenceOperation(id, authorizing_official || 'Intelligence Director');

    res.json({
      success: true,
      data: operation,
      message: 'Intelligence operation authorized successfully'
    });
  } catch (error) {
    console.error('Error authorizing intelligence operation:', error);
    res.status(500).json({
      error: 'Failed to authorize intelligence operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/intelligence/operations/:id/execute - Execute operation
 */
router.post('/operations/:id/execute', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = getIntelligenceDirectorsService();
    const operation = await service.executeIntelligenceOperation(id);

    res.json({
      success: true,
      data: operation,
      message: 'Intelligence operation execution started'
    });
  } catch (error) {
    console.error('Error executing intelligence operation:', error);
    res.status(500).json({
      error: 'Failed to execute intelligence operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/intelligence/operations/:id/complete - Complete operation
 */
router.post('/operations/:id/complete', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { operational_report, lessons_learned } = req.body;
    const service = getIntelligenceDirectorsService();
    const operation = await service.completeIntelligenceOperation(id, operational_report, lessons_learned || []);

    res.json({
      success: true,
      data: operation,
      message: 'Intelligence operation completed successfully'
    });
  } catch (error) {
    console.error('Error completing intelligence operation:', error);
    res.status(500).json({
      error: 'Failed to complete intelligence operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/threats - List threat assessments
 */
router.get('/threats', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const threat_level = req.query.threat_level as string;
    const threat_type = req.query.threat_type as string;
    
    const service = getIntelligenceDirectorsService();
    const threats = await service.getThreatAssessments(civilizationId, { threat_level, threat_type });

    res.json({
      success: true,
      data: threats,
      count: threats.length
    });
  } catch (error) {
    console.error('Error fetching threat assessments:', error);
    res.status(500).json({
      error: 'Failed to fetch threat assessments',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/intelligence/threats - Create new threat assessment
 */
router.post('/threats', async (req, res) => {
  try {
    const service = getIntelligenceDirectorsService();
    const threat = await service.createThreatAssessment(req.body);

    res.status(201).json({
      success: true,
      data: threat,
      message: 'Threat assessment created successfully'
    });
  } catch (error) {
    console.error('Error creating threat assessment:', error);
    res.status(500).json({
      error: 'Failed to create threat assessment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/threats/:id - Get threat details
 */
router.get('/threats/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getIntelligenceDirectorsService();
    const threats = await service.getThreatAssessments(civilizationId);
    const threat = threats.find(t => t.id === id);

    if (!threat) {
      return res.status(404).json({
        error: 'Threat assessment not found',
        message: `No threat assessment found with ID ${id}`
      });
    }

    res.json({
      success: true,
      data: threat
    });
  } catch (error) {
    console.error('Error fetching threat assessment:', error);
    res.status(500).json({
      error: 'Failed to fetch threat assessment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/intelligence/threats/:id - Update threat assessment
 */
router.put('/threats/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = getIntelligenceDirectorsService();
    const threat = await service.updateThreatAssessment(id, req.body);

    res.json({
      success: true,
      data: threat,
      message: 'Threat assessment updated successfully'
    });
  } catch (error) {
    console.error('Error updating threat assessment:', error);
    res.status(500).json({
      error: 'Failed to update threat assessment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/threats/current - Get current active threats
 */
router.get('/threats/current', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const threat_level = req.query.threat_level as string;
    const service = getIntelligenceDirectorsService();
    const threats = await service.getCurrentThreats(civilizationId, threat_level);

    res.json({
      success: true,
      data: threats,
      count: threats.length
    });
  } catch (error) {
    console.error('Error fetching current threats:', error);
    res.status(500).json({
      error: 'Failed to fetch current threats',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/reports - List intelligence reports
 */
router.get('/reports', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const report_type = req.query.report_type as string;
    const classification = req.query.classification as string;
    
    const service = getIntelligenceDirectorsService();
    const reports = await service.getIntelligenceReports(civilizationId, { report_type, classification });

    res.json({
      success: true,
      data: reports,
      count: reports.length
    });
  } catch (error) {
    console.error('Error fetching intelligence reports:', error);
    res.status(500).json({
      error: 'Failed to fetch intelligence reports',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/intelligence/reports - Create new report
 */
router.post('/reports', async (req, res) => {
  try {
    const service = getIntelligenceDirectorsService();
    const report = await service.createIntelligenceReport(req.body);

    res.status(201).json({
      success: true,
      data: report,
      message: 'Intelligence report created successfully'
    });
  } catch (error) {
    console.error('Error creating intelligence report:', error);
    res.status(500).json({
      error: 'Failed to create intelligence report',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/reports/:id - Get report details
 */
router.get('/reports/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getIntelligenceDirectorsService();
    const reports = await service.getIntelligenceReports(civilizationId);
    const report = reports.find(r => r.id === id);

    if (!report) {
      return res.status(404).json({
        error: 'Intelligence report not found',
        message: `No intelligence report found with ID ${id}`
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error fetching intelligence report:', error);
    res.status(500).json({
      error: 'Failed to fetch intelligence report',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/reports/daily-brief - Get daily intelligence brief
 */
router.get('/reports/daily-brief', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getIntelligenceDirectorsService();
    const dailyBrief = await service.generateDailyBrief(civilizationId);

    res.json({
      success: true,
      data: dailyBrief,
      message: 'Daily intelligence brief generated successfully'
    });
  } catch (error) {
    console.error('Error generating daily brief:', error);
    res.status(500).json({
      error: 'Failed to generate daily brief',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/intelligence/reports/:id/distribute - Distribute report
 */
router.post('/reports/:id/distribute', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { distribution_list } = req.body;
    const service = getIntelligenceDirectorsService();
    await service.distributeIntelligenceReport(id, distribution_list || []);

    res.json({
      success: true,
      message: 'Intelligence report distributed successfully'
    });
  } catch (error) {
    console.error('Error distributing intelligence report:', error);
    res.status(500).json({
      error: 'Failed to distribute intelligence report',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/oversight - List oversight activities
 */
router.get('/oversight', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const status = req.query.status as string;
    const oversight_type = req.query.oversight_type as string;
    
    const service = getIntelligenceDirectorsService();
    const oversight = await service.getIntelligenceOversight(civilizationId, { status, oversight_type });

    res.json({
      success: true,
      data: oversight,
      count: oversight.length
    });
  } catch (error) {
    console.error('Error fetching intelligence oversight:', error);
    res.status(500).json({
      error: 'Failed to fetch intelligence oversight',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/intelligence/oversight - Create oversight review
 */
router.post('/oversight', async (req, res) => {
  try {
    const service = getIntelligenceDirectorsService();
    const oversight = await service.createOversightReview(req.body);

    res.status(201).json({
      success: true,
      data: oversight,
      message: 'Oversight review created successfully'
    });
  } catch (error) {
    console.error('Error creating oversight review:', error);
    res.status(500).json({
      error: 'Failed to create oversight review',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/oversight/:id - Get oversight details
 */
router.get('/oversight/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getIntelligenceDirectorsService();
    const oversight = await service.getIntelligenceOversight(civilizationId);
    const review = oversight.find(o => o.id === id);

    if (!review) {
      return res.status(404).json({
        error: 'Oversight review not found',
        message: `No oversight review found with ID ${id}`
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error fetching oversight review:', error);
    res.status(500).json({
      error: 'Failed to fetch oversight review',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/intelligence/oversight/:id - Update oversight status
 */
router.put('/oversight/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, findings } = req.body;
    const service = getIntelligenceDirectorsService();
    const oversight = await service.updateOversightStatus(id, status, findings);

    res.json({
      success: true,
      data: oversight,
      message: 'Oversight status updated successfully'
    });
  } catch (error) {
    console.error('Error updating oversight status:', error);
    res.status(500).json({
      error: 'Failed to update oversight status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/analytics/threat-landscape - Overall threat analysis
 */
router.get('/analytics/threat-landscape', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getIntelligenceDirectorsService();
    const analysis = await service.analyzeThreatLandscape(civilizationId);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error analyzing threat landscape:', error);
    res.status(500).json({
      error: 'Failed to analyze threat landscape',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/analytics/operational-effectiveness - Operations performance
 */
router.get('/analytics/operational-effectiveness', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const timeframe = req.query.timeframe as string || '30d';
    const service = getIntelligenceDirectorsService();
    const effectiveness = await service.assessOperationalEffectiveness(civilizationId, timeframe);

    res.json({
      success: true,
      data: effectiveness
    });
  } catch (error) {
    console.error('Error assessing operational effectiveness:', error);
    res.status(500).json({
      error: 'Failed to assess operational effectiveness',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/analytics/inter-agency-coordination - Coordination metrics
 */
router.get('/analytics/inter-agency-coordination', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getIntelligenceDirectorsService();
    const coordination = await service.evaluateInterAgencyCoordination(civilizationId);

    res.json({
      success: true,
      data: coordination
    });
  } catch (error) {
    console.error('Error evaluating inter-agency coordination:', error);
    res.status(500).json({
      error: 'Failed to evaluate inter-agency coordination',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/intelligence/coordination/briefing - Prepare leadership briefing
 */
router.get('/coordination/briefing', async (req, res) => {
  try {
    const civilizationId = parseInt(req.query.civilization_id as string) || 1;
    const service = getIntelligenceDirectorsService();
    
    // Generate comprehensive briefing
    const [threats, operations, dailyBrief, threatAnalysis] = await Promise.all([
      service.getCurrentThreats(civilizationId, 'high'),
      service.getIntelligenceOperations(civilizationId, { status: 'active' }),
      service.generateDailyBrief(civilizationId),
      service.analyzeThreatLandscape(civilizationId)
    ]);

    const briefing = {
      briefing_date: new Date().toISOString(),
      classification_level: 'top_secret',
      high_priority_threats: threats,
      active_operations: operations,
      daily_brief: dailyBrief,
      threat_landscape: threatAnalysis,
      recommendations: [
        'Continue monitoring high-priority threats',
        'Maintain operational security protocols',
        'Enhance inter-agency coordination',
        'Brief senior leadership on developments'
      ]
    };

    res.json({
      success: true,
      data: briefing,
      message: 'Leadership briefing prepared successfully'
    });
  } catch (error) {
    console.error('Error preparing leadership briefing:', error);
    res.status(500).json({
      error: 'Failed to prepare leadership briefing',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;