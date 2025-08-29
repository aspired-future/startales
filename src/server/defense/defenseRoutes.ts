import { Router } from 'express';
import { getPool } from '../storage/db';
import { DefenseSecretaryService } from './DefenseSecretaryService';
import { DepartmentBudgetService } from '../treasury/DepartmentBudgetService';
import { TreasuryService } from '../treasury/TreasuryService';
import { WarSimulatorService } from '../military/WarSimulatorService';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const defenseRouter = Router();

// Enhanced AI Knobs for Defense Department System
const defenseKnobsData = {
  // Defense Strategy & Policy
  national_defense_strategy_focus: 0.8,      // National defense strategy focus and strategic priorities
  military_doctrine_modernization: 0.7,      // Military doctrine modernization and tactical evolution
  defense_policy_integration: 0.8,           // Defense policy integration with national security objectives
  
  // Military Readiness & Capability
  force_readiness_maintenance: 0.9,          // Force readiness maintenance and operational preparedness
  military_capability_development: 0.8,      // Military capability development and force modernization
  training_program_intensity: 0.8,           // Training program intensity and skill development emphasis
  
  // Defense Budget & Resource Management
  defense_budget_optimization: 0.8,          // Defense budget optimization and resource allocation efficiency
  procurement_process_efficiency: 0.7,       // Procurement process efficiency and acquisition management
  cost_effectiveness_prioritization: 0.7,    // Cost-effectiveness prioritization and value optimization
  
  // Technology & Innovation
  defense_technology_advancement: 0.8,       // Defense technology advancement and R&D investment
  military_innovation_adoption: 0.7,         // Military innovation adoption and emerging technology integration
  cyber_defense_capability: 0.8,             // Cyber defense capability and digital warfare preparedness
  
  // International Defense Relations
  alliance_military_cooperation: 0.7,        // Alliance military cooperation and coalition building
  defense_diplomacy_engagement: 0.6,         // Defense diplomacy engagement and international partnerships
  arms_control_compliance: 0.8,              // Arms control compliance and treaty adherence
  
  // Homeland Security & Protection
  homeland_defense_priority: 0.8,            // Homeland defense priority and domestic security focus
  critical_infrastructure_protection: 0.8,   // Critical infrastructure protection and vulnerability mitigation
  emergency_response_coordination: 0.8,      // Emergency response coordination and disaster preparedness
  
  // Personnel & Human Resources
  military_personnel_development: 0.8,       // Military personnel development and career advancement
  veteran_affairs_support: 0.7,              // Veteran affairs support and post-service care
  diversity_inclusion_emphasis: 0.7,         // Diversity and inclusion emphasis in military ranks
  
  // Intelligence & Surveillance
  defense_intelligence_integration: 0.8,     // Defense intelligence integration and information sharing
  surveillance_capability_enhancement: 0.7,  // Surveillance capability enhancement and monitoring systems
  threat_assessment_sophistication: 0.8,     // Threat assessment sophistication and risk analysis
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Defense
const defenseKnobSystem = new EnhancedKnobSystem(defenseKnobsData);

// Apply defense knobs to game state
function applyDefenseKnobsToGameState() {
  const knobs = defenseKnobSystem.knobs;
  
  // Apply defense strategy settings
  const defenseStrategy = (knobs.national_defense_strategy_focus + knobs.military_doctrine_modernization + 
    knobs.defense_policy_integration) / 3;
  
  // Apply military readiness settings
  const militaryReadiness = (knobs.force_readiness_maintenance + knobs.military_capability_development + 
    knobs.training_program_intensity) / 3;
  
  // Apply budget management settings
  const budgetManagement = (knobs.defense_budget_optimization + knobs.procurement_process_efficiency + 
    knobs.cost_effectiveness_prioritization) / 3;
  
  // Apply technology settings
  const technology = (knobs.defense_technology_advancement + knobs.military_innovation_adoption + 
    knobs.cyber_defense_capability) / 3;
  
  // Apply homeland security settings
  const homelandSecurity = (knobs.homeland_defense_priority + knobs.critical_infrastructure_protection + 
    knobs.emergency_response_coordination) / 3;
  
  // Apply intelligence settings
  const intelligence = (knobs.defense_intelligence_integration + knobs.surveillance_capability_enhancement + 
    knobs.threat_assessment_sophistication) / 3;
  
  console.log('Applied defense knobs to game state:', {
    defenseStrategy,
    militaryReadiness,
    budgetManagement,
    technology,
    homelandSecurity,
    intelligence
  });
}

const pool = getPool();
const treasuryService = new TreasuryService(pool);
const departmentBudgetService = new DepartmentBudgetService(pool, treasuryService);
const warSimulatorService = new WarSimulatorService();
const defenseSecretaryService = new DefenseSecretaryService(pool, departmentBudgetService, warSimulatorService);

// ==================== DEFENSE SECRETARY AUTHORITY ====================

// Get Defense Secretary authority and overview
defenseRouter.get('/authority', async (req, res) => {
  try {
    const { campaignId, secretaryId = 'ai-secretary-defense' } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const authority = await defenseSecretaryService.getDefenseSecretaryAuthority(
      String(secretaryId),
      Number(campaignId)
    );

    res.json({
      success: true,
      authority
    });
  } catch (error) {
    console.error('Failed to get Defense Secretary authority:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get Defense Secretary authority'
    });
  }
});

// ==================== MILITARY OPERATIONS ====================

// Get all military operations
defenseRouter.get('/operations', async (req, res) => {
  try {
    const { campaignId, status, type, priority } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    let query = 'SELECT * FROM military_operations WHERE campaign_id = $1';
    const params: any[] = [campaignId];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${++paramCount}`;
      params.push(status);
    }

    if (type) {
      query += ` AND type = $${++paramCount}`;
      params.push(type);
    }

    if (priority) {
      query += ` AND priority = $${++paramCount}`;
      params.push(priority);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      operations: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Failed to get military operations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get military operations'
    });
  }
});

// Get specific military operation
defenseRouter.get('/operations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM military_operations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Military operation not found'
      });
    }

    res.json({
      success: true,
      operation: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to get military operation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get military operation'
    });
  }
});

// Authorize new military operation
defenseRouter.post('/operations', async (req, res) => {
  try {
    const operation = await defenseSecretaryService.authorizeOperation(req.body);

    res.status(201).json({
      success: true,
      operation,
      message: 'Military operation authorized successfully'
    });
  } catch (error) {
    console.error('Failed to authorize military operation:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to authorize military operation'
    });
  }
});

// Update military operation status
defenseRouter.put('/operations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress, results, notes } = req.body;

    const updateFields = [];
    const params = [id];
    let paramCount = 1;

    if (status) {
      updateFields.push(`status = $${++paramCount}`);
      params.push(status);
    }

    if (progress !== undefined) {
      updateFields.push(`progress = $${++paramCount}`);
      params.push(progress);
    }

    if (results) {
      updateFields.push(`current_results = $${++paramCount}`);
      params.push(JSON.stringify(results));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid updates provided'
      });
    }

    updateFields.push('updated_at = NOW()');

    const result = await pool.query(`
      UPDATE military_operations 
      SET ${updateFields.join(', ')}
      WHERE id = $1
      RETURNING *
    `, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Military operation not found'
      });
    }

    res.json({
      success: true,
      operation: result.rows[0],
      message: 'Military operation updated successfully'
    });
  } catch (error) {
    console.error('Failed to update military operation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update military operation'
    });
  }
});

// ==================== DEFENSE ORDERS ====================

// Get all defense orders
defenseRouter.get('/orders', async (req, res) => {
  try {
    const { campaignId, secretaryId, status, orderType } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    let query = 'SELECT * FROM defense_orders WHERE campaign_id = $1';
    const params: any[] = [campaignId];
    let paramCount = 1;

    if (secretaryId) {
      query += ` AND secretary_id = $${++paramCount}`;
      params.push(secretaryId);
    }

    if (status) {
      query += ` AND status = $${++paramCount}`;
      params.push(status);
    }

    if (orderType) {
      query += ` AND order_type = $${++paramCount}`;
      params.push(orderType);
    }

    query += ' ORDER BY issued_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      orders: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Failed to get defense orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get defense orders'
    });
  }
});

// Issue new defense order
defenseRouter.post('/orders', async (req, res) => {
  try {
    const order = await defenseSecretaryService.issueDefenseOrder(req.body);

    res.status(201).json({
      success: true,
      order,
      message: 'Defense order issued successfully'
    });
  } catch (error) {
    console.error('Failed to issue defense order:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to issue defense order'
    });
  }
});

// ==================== FORCE DEPLOYMENT ====================

// Get all force deployments
defenseRouter.get('/deployments', async (req, res) => {
  try {
    const { campaignId, status, operationId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    let query = 'SELECT * FROM force_deployments WHERE campaign_id = $1';
    const params: any[] = [campaignId];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${++paramCount}`;
      params.push(status);
    }

    if (operationId) {
      query += ` AND operation_id = $${++paramCount}`;
      params.push(operationId);
    }

    query += ' ORDER BY deployment_start DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      deployments: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Failed to get force deployments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get force deployments'
    });
  }
});

// Deploy forces
defenseRouter.post('/deployments', async (req, res) => {
  try {
    const deployment = await defenseSecretaryService.deployForces(req.body);

    res.status(201).json({
      success: true,
      deployment,
      message: 'Forces deployed successfully'
    });
  } catch (error) {
    console.error('Failed to deploy forces:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to deploy forces'
    });
  }
});

// ==================== MILITARY READINESS ====================

// Generate readiness report
defenseRouter.get('/readiness', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const report = await defenseSecretaryService.generateReadinessReport(Number(campaignId));

    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Failed to generate readiness report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate readiness report'
    });
  }
});

// Get readiness history
defenseRouter.get('/readiness/history', async (req, res) => {
  try {
    const { campaignId, limit = 10 } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const result = await pool.query(`
      SELECT * FROM defense_readiness_reports 
      WHERE campaign_id = $1 
      ORDER BY report_date DESC 
      LIMIT $2
    `, [campaignId, limit]);

    res.json({
      success: true,
      reports: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Failed to get readiness history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get readiness history'
    });
  }
});

// ==================== MILITARY PROCUREMENT ====================

// Get military procurement requests
defenseRouter.get('/procurement', async (req, res) => {
  try {
    const { campaignId, status, urgency } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    let query = 'SELECT * FROM military_procurement WHERE campaign_id = $1';
    const params: any[] = [campaignId];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${++paramCount}`;
      params.push(status);
    }

    if (urgency) {
      query += ` AND urgency = $${++paramCount}`;
      params.push(urgency);
    }

    query += ' ORDER BY requested_date DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      procurement: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Failed to get military procurement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get military procurement'
    });
  }
});

// Request military procurement
defenseRouter.post('/procurement', async (req, res) => {
  try {
    const procurement = await defenseSecretaryService.requestMilitaryProcurement(req.body);

    res.status(201).json({
      success: true,
      procurement,
      message: 'Military procurement request submitted successfully'
    });
  } catch (error) {
    console.error('Failed to request military procurement:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to request military procurement'
    });
  }
});

// ==================== INTELLIGENCE REPORTS ====================

// Get intelligence reports
defenseRouter.get('/intelligence', async (req, res) => {
  try {
    const { campaignId, reportType, threatLevel, classification } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    let query = 'SELECT * FROM intelligence_reports WHERE campaign_id = $1';
    const params: any[] = [campaignId];
    let paramCount = 1;

    if (reportType) {
      query += ` AND report_type = $${++paramCount}`;
      params.push(reportType);
    }

    if (threatLevel) {
      query += ` AND threat_level = $${++paramCount}`;
      params.push(threatLevel);
    }

    if (classification) {
      query += ` AND classification = $${++paramCount}`;
      params.push(classification);
    }

    query += ' ORDER BY intelligence_date DESC LIMIT 20';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      reports: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Failed to get intelligence reports:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get intelligence reports'
    });
  }
});

// ==================== DEFENSE DASHBOARD ====================

// Get comprehensive Defense Secretary dashboard
defenseRouter.get('/dashboard', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const cId = Number(campaignId);

    // Get all dashboard data in parallel
    const [
      authority,
      readinessReport,
      activeOperations,
      recentOrders,
      activeDeployments,
      procurementRequests,
      threatAssessment
    ] = await Promise.all([
      defenseSecretaryService.getDefenseSecretaryAuthority('ai-secretary-defense', cId),
      defenseSecretaryService.generateReadinessReport(cId),
      pool.query('SELECT * FROM military_operations WHERE campaign_id = $1 AND status = $2 ORDER BY created_at DESC LIMIT 5', [cId, 'active']),
      pool.query('SELECT * FROM defense_orders WHERE campaign_id = $1 ORDER BY issued_at DESC LIMIT 5', [cId]),
      pool.query('SELECT * FROM force_deployments WHERE campaign_id = $1 AND status IN ($2, $3) ORDER BY deployment_start DESC LIMIT 5', [cId, 'deploying', 'deployed']),
      pool.query('SELECT * FROM military_procurement WHERE campaign_id = $1 AND status IN ($2, $3) ORDER BY requested_date DESC LIMIT 5', [cId, 'requested', 'approved']),
      pool.query('SELECT * FROM intelligence_reports WHERE campaign_id = $1 AND report_type = $2 ORDER BY intelligence_date DESC LIMIT 1', [cId, 'threat-assessment'])
    ]);

    const dashboard = {
      authority,
      readiness: {
        overall: readinessReport.overallReadiness,
        level: readinessReport.readinessLevel,
        capabilities: readinessReport.capabilities,
        criticalIssues: readinessReport.criticalIssues,
        warnings: readinessReport.warnings
      },
      operations: {
        active: activeOperations.rows,
        totalActive: activeOperations.rows.length
      },
      orders: {
        recent: recentOrders.rows,
        totalIssued: recentOrders.rows.length
      },
      deployments: {
        active: activeDeployments.rows,
        totalActive: activeDeployments.rows.length
      },
      procurement: {
        pending: procurementRequests.rows,
        totalPending: procurementRequests.rows.length
      },
      intelligence: {
        latestThreatAssessment: threatAssessment.rows[0] || null,
        currentThreatLevel: threatAssessment.rows[0]?.threat_level || 'medium'
      },
      alerts: []
    };

    // Generate alerts based on current status
    if (readinessReport.overallReadiness < 70) {
      dashboard.alerts.push('Military readiness below optimal levels');
    }

    if (readinessReport.criticalIssues.length > 0) {
      dashboard.alerts.push(`${readinessReport.criticalIssues.length} critical issues require immediate attention`);
    }

    if (authority.budgetAuthority.availableFunds < authority.budgetAuthority.totalDefenseBudget * 0.2) {
      dashboard.alerts.push('Defense budget running low - coordinate with Treasury');
    }

    res.json({
      success: true,
      dashboard
    });
  } catch (error) {
    console.error('Failed to generate Defense Secretary dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate Defense Secretary dashboard'
    });
  }
});

// ==================== MILITARY UNITS INTEGRATION ====================

// Get military units under Defense Secretary command
defenseRouter.get('/units', async (req, res) => {
  try {
    const { campaignId, domain, type, status, readiness } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    let query = 'SELECT * FROM military_units WHERE campaign_id = $1';
    const params: any[] = [campaignId];
    let paramCount = 1;

    if (domain) {
      query += ` AND domain = $${++paramCount}`;
      params.push(domain);
    }

    if (type) {
      query += ` AND type = $${++paramCount}`;
      params.push(type);
    }

    if (status) {
      query += ` AND status->>'operational' = $${++paramCount}`;
      params.push(status);
    }

    if (readiness) {
      query += ` AND status->>'combat'->>'level' = $${++paramCount}`;
      params.push(readiness);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      units: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Failed to get military units:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get military units'
    });
  }
});

// Issue orders to specific military units
defenseRouter.post('/units/:unitId/orders', async (req, res) => {
  try {
    const { unitId } = req.params;
    const { orderType, instructions, priority = 'medium' } = req.body;

    if (!orderType || !instructions) {
      return res.status(400).json({
        success: false,
        error: 'Order type and instructions are required'
      });
    }

    // Create a unit-specific order
    const order = await defenseSecretaryService.issueDefenseOrder({
      secretaryId: 'ai-secretary-defense',
      orderType,
      title: `Direct Order to Unit ${unitId}`,
      description: instructions,
      priority,
      targetUnits: [unitId],
      instructions,
      effectiveAt: new Date()
    });

    res.status(201).json({
      success: true,
      order,
      message: `Order issued to unit ${unitId} successfully`
    });
  } catch (error) {
    console.error('Failed to issue unit order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to issue unit order'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(defenseRouter, 'defense', defenseKnobSystem, applyDefenseKnobsToGameState);

export default defenseRouter;
