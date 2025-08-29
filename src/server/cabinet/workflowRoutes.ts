import express from 'express';
import { getPool } from '../storage/db';
import { WorkflowAutomationService } from './WorkflowAutomationService';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = express.Router();

// Enhanced AI Knobs for Cabinet Workflow System
const workflowKnobsData = {
  // Workflow Automation & Efficiency
  workflow_automation_level: 0.7,         // Overall workflow automation and digitization level
  process_standardization: 0.8,           // Process standardization and consistency enforcement
  workflow_optimization_frequency: 0.6,   // Frequency of workflow optimization and improvement
  
  // Approval & Decision Processes
  approval_hierarchy_strictness: 0.7,     // Approval hierarchy strictness and bypass flexibility
  decision_delegation_level: 0.6,         // Decision delegation and empowerment level
  emergency_bypass_threshold: 0.8,        // Emergency bypass threshold and criteria
  
  // Inter-Department Coordination
  cross_department_collaboration: 0.7,    // Cross-department collaboration and coordination
  information_sharing_openness: 0.8,      // Information sharing openness between departments
  workflow_integration_priority: 0.7,     // Workflow integration and seamless handoffs
  
  // Quality Control & Compliance
  quality_assurance_rigor: 0.8,           // Quality assurance and review rigor
  compliance_monitoring_strictness: 0.9,  // Compliance monitoring and enforcement strictness
  audit_trail_completeness: 0.9,          // Audit trail completeness and documentation
  
  // Performance & Efficiency Metrics
  workflow_performance_tracking: 0.8,     // Workflow performance tracking and analytics
  bottleneck_identification_speed: 0.7,   // Bottleneck identification and resolution speed
  efficiency_improvement_priority: 0.7,   // Efficiency improvement and optimization priority
  
  // Technology & Digital Integration
  digital_transformation_pace: 0.6,       // Digital transformation and modernization pace
  system_integration_level: 0.7,          // System integration and interoperability level
  automation_tool_adoption: 0.6,          // Automation tool adoption and implementation
  
  // Change Management & Adaptability
  workflow_change_agility: 0.6,           // Workflow change management and adaptability
  process_innovation_encouragement: 0.7,  // Process innovation and creative improvement
  change_resistance_management: 0.7,      // Change resistance management and training
  
  // Risk Management & Contingency
  workflow_risk_assessment: 0.8,          // Workflow risk assessment and mitigation
  contingency_planning_thoroughness: 0.8, // Contingency planning and backup procedures
  failure_recovery_speed: 0.7,            // Failure recovery and business continuity speed
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Cabinet Workflow
const workflowKnobSystem = new EnhancedKnobSystem(workflowKnobsData);

// Apply workflow knobs to game state
function applyWorkflowKnobsToGameState() {
  const knobs = workflowKnobSystem.knobs;
  
  // Apply automation and efficiency settings
  const automationEfficiency = (knobs.workflow_automation_level + knobs.process_standardization + 
    knobs.workflow_optimization_frequency) / 3;
  
  // Apply approval processes settings
  const approvalProcesses = (knobs.approval_hierarchy_strictness + knobs.decision_delegation_level + 
    knobs.emergency_bypass_threshold) / 3;
  
  // Apply coordination settings
  const departmentCoordination = (knobs.cross_department_collaboration + knobs.information_sharing_openness + 
    knobs.workflow_integration_priority) / 3;
  
  // Apply quality control settings
  const qualityControl = (knobs.quality_assurance_rigor + knobs.compliance_monitoring_strictness + 
    knobs.audit_trail_completeness) / 3;
  
  // Apply performance tracking settings
  const performanceTracking = (knobs.workflow_performance_tracking + knobs.bottleneck_identification_speed + 
    knobs.efficiency_improvement_priority) / 3;
  
  // Apply risk management settings
  const riskManagement = (knobs.workflow_risk_assessment + knobs.contingency_planning_thoroughness + 
    knobs.failure_recovery_speed) / 3;
  
  console.log('Applied workflow knobs to game state:', {
    automationEfficiency,
    approvalProcesses,
    departmentCoordination,
    qualityControl,
    performanceTracking,
    riskManagement
  });
}

// Initialize service
const getWorkflowService = () => new WorkflowAutomationService(getPool());

// ===== WORKFLOW DEFINITION MANAGEMENT =====

/**
 * POST /api/cabinet/workflows/definitions - Create workflow definition
 */
router.post('/workflows/definitions', async (req, res) => {
  try {
    const service = getWorkflowService();
    const {
      name,
      description,
      category,
      triggerConditions,
      workflowSteps,
      requiredDepartments,
      approvalRequirements,
      automationLevel,
      priority,
      estimatedDuration,
      successCriteria,
      failureConditions,
      rollbackProcedures,
      createdBy
    } = req.body;

    if (!name || !description || !category || !createdBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'description', 'category', 'createdBy']
      });
    }

    const workflow = await service.createWorkflowDefinition({
      name,
      description,
      category,
      triggerConditions: triggerConditions || {},
      workflowSteps: workflowSteps || [],
      requiredDepartments: requiredDepartments || [],
      approvalRequirements: approvalRequirements || {},
      automationLevel: automationLevel || 'semi_automated',
      priority: priority || 'medium',
      estimatedDuration: estimatedDuration || 60,
      successCriteria: successCriteria || {},
      failureConditions: failureConditions || {},
      rollbackProcedures: rollbackProcedures || [],
      status: 'active',
      createdBy
    });

    res.json({
      success: true,
      workflow,
      message: `Workflow definition "${name}" created successfully`
    });
  } catch (error) {
    console.error('Error creating workflow definition:', error);
    res.status(500).json({
      error: 'Failed to create workflow definition',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/cabinet/workflows/definitions - List workflow definitions
 */
router.get('/workflows/definitions', async (req, res) => {
  try {
    const service = getWorkflowService();
    const { category, status, priority } = req.query;

    const workflows = await service.getWorkflowDefinitions({
      category: category as string,
      status: status as string,
      priority: priority as string
    });

    res.json({
      success: true,
      workflows,
      count: workflows.length
    });
  } catch (error) {
    console.error('Error fetching workflow definitions:', error);
    res.status(500).json({
      error: 'Failed to fetch workflow definitions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/cabinet/new-department-workflows - Get predefined workflows for Science & Communications
 */
router.get('/new-department-workflows', async (req, res) => {
  try {
    const service = getWorkflowService();
    const workflows = await service.getPreDefinedWorkflowsForNewDepartments();

    res.json({
      success: true,
      workflows,
      count: workflows.length,
      message: 'Predefined workflows for Science and Communications departments retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching new department workflows:', error);
    res.status(500).json({
      error: 'Failed to fetch new department workflows',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== WORKFLOW INSTANCE MANAGEMENT =====

/**
 * POST /api/cabinet/workflows/instances - Start workflow instance
 */
router.post('/workflows/instances', async (req, res) => {
  try {
    const service = getWorkflowService();
    const {
      campaignId,
      workflowDefinitionId,
      instanceName,
      triggerEvent,
      priority
    } = req.body;

    if (!campaignId || !workflowDefinitionId || !instanceName) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'workflowDefinitionId', 'instanceName']
      });
    }

    const instance = await service.startWorkflowInstance(
      Number(campaignId),
      workflowDefinitionId,
      instanceName,
      triggerEvent || {},
      priority
    );

    res.json({
      success: true,
      instance,
      message: `Workflow instance "${instanceName}" started successfully`
    });
  } catch (error) {
    console.error('Error starting workflow instance:', error);
    res.status(500).json({
      error: 'Failed to start workflow instance',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/cabinet/workflows/instances/:id/step - Execute next workflow step
 */
router.put('/workflows/instances/:id/step', async (req, res) => {
  try {
    const service = getWorkflowService();
    const { id } = req.params;

    const stepExecution = await service.executeNextStep(id);

    res.json({
      success: true,
      stepExecution,
      message: 'Workflow step executed successfully'
    });
  } catch (error) {
    console.error('Error executing workflow step:', error);
    res.status(500).json({
      error: 'Failed to execute workflow step',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== DEPARTMENT COORDINATION =====

/**
 * POST /api/cabinet/coordination - Initiate department coordination
 */
router.post('/coordination', async (req, res) => {
  try {
    const service = getWorkflowService();
    const {
      campaignId,
      coordinationType,
      initiatingDepartment,
      targetDepartments,
      coordinationData,
      priority,
      responseDeadline
    } = req.body;

    if (!campaignId || !coordinationType || !initiatingDepartment || !targetDepartments) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'coordinationType', 'initiatingDepartment', 'targetDepartments']
      });
    }

    const coordination = await service.initiateDepartmentCoordination(
      Number(campaignId),
      coordinationType,
      initiatingDepartment,
      targetDepartments,
      coordinationData || {},
      priority || 'medium',
      responseDeadline ? new Date(responseDeadline) : undefined
    );

    res.json({
      success: true,
      coordination,
      message: `Department coordination initiated: ${coordinationType}`
    });
  } catch (error) {
    console.error('Error initiating department coordination:', error);
    res.status(500).json({
      error: 'Failed to initiate department coordination',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/cabinet/coordination/:id/respond - Respond to coordination request
 */
router.put('/coordination/:id/respond', async (req, res) => {
  try {
    const service = getWorkflowService();
    const { id } = req.params;
    const { respondingDepartment, response } = req.body;

    if (!respondingDepartment || !response) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['respondingDepartment', 'response']
      });
    }

    const coordination = await service.respondToDepartmentCoordination(
      id,
      respondingDepartment,
      response
    );

    res.json({
      success: true,
      coordination,
      message: `Response recorded from ${respondingDepartment}`
    });
  } catch (error) {
    console.error('Error responding to coordination:', error);
    res.status(500).json({
      error: 'Failed to respond to coordination',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== INTER-DEPARTMENT MESSAGING =====

/**
 * POST /api/cabinet/messages - Send inter-department message
 */
router.post('/messages', async (req, res) => {
  try {
    const service = getWorkflowService();
    const {
      campaignId,
      senderDepartment,
      recipientDepartments,
      messageType,
      subject,
      content,
      priority,
      requiresResponse,
      responseDeadline,
      attachments
    } = req.body;

    if (!campaignId || !senderDepartment || !recipientDepartments || !subject || !content) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'senderDepartment', 'recipientDepartments', 'subject', 'content']
      });
    }

    const message = await service.sendInterDepartmentMessage(
      Number(campaignId),
      senderDepartment,
      recipientDepartments,
      messageType || 'information',
      subject,
      content,
      priority || 'medium',
      requiresResponse || false,
      responseDeadline ? new Date(responseDeadline) : undefined,
      attachments || []
    );

    res.json({
      success: true,
      message,
      messageText: `Message sent from ${senderDepartment} to ${recipientDepartments.join(', ')}`
    });
  } catch (error) {
    console.error('Error sending inter-department message:', error);
    res.status(500).json({
      error: 'Failed to send inter-department message',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== PREDEFINED WORKFLOW TEMPLATES =====

/**
 * POST /api/cabinet/workflows/templates/crisis-response - Create crisis response workflow
 */
router.post('/workflows/templates/crisis-response', async (req, res) => {
  try {
    const service = getWorkflowService();
    const { campaignId, crisisType, severity, affectedAreas } = req.body;

    if (!campaignId || !crisisType || !severity) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'crisisType', 'severity']
      });
    }

    // Create crisis response workflow definition
    const crisisWorkflow = await service.createWorkflowDefinition({
      name: `Crisis Response: ${crisisType}`,
      description: `Automated crisis response workflow for ${crisisType} events`,
      category: 'crisis_response',
      triggerConditions: {
        crisisType,
        severity,
        affectedAreas: affectedAreas || []
      },
      workflowSteps: [
        {
          id: 'assess-situation',
          name: 'Assess Situation',
          description: 'Initial situation assessment and threat evaluation',
          stepType: 'automated',
          assignedDepartment: 'Defense',
          requiredInputs: ['crisisType', 'severity', 'affectedAreas'],
          expectedOutputs: ['threatLevel', 'resourcesNeeded', 'timeframe'],
          estimatedDuration: 15,
          actions: [
            {
              type: 'api_call',
              endpoint: '/api/defense/threat-assessment',
              method: 'POST',
              data: { crisisType, severity, affectedAreas },
              output: 'threatAssessment'
            }
          ]
        },
        {
          id: 'coordinate-response',
          name: 'Coordinate Response',
          description: 'Coordinate response across all relevant departments',
          stepType: 'automated',
          requiredInputs: ['threatAssessment'],
          expectedOutputs: ['responseCoordination'],
          estimatedDuration: 10,
          actions: [
            {
              type: 'initiate_coordination',
              coordinationType: 'crisis_response',
              targetDepartments: ['Treasury', 'Interior', 'Justice', 'State', 'Commerce'],
              priority: 'critical'
            }
          ]
        },
        {
          id: 'implement-response',
          name: 'Implement Response',
          description: 'Execute crisis response measures',
          stepType: 'manual',
          assignedDepartment: 'Defense',
          requiredInputs: ['responseCoordination'],
          expectedOutputs: ['responseImplemented'],
          estimatedDuration: 60
        },
        {
          id: 'monitor-situation',
          name: 'Monitor Situation',
          description: 'Continuous monitoring and adjustment',
          stepType: 'automated',
          requiredInputs: ['responseImplemented'],
          expectedOutputs: ['situationStatus'],
          estimatedDuration: 30,
          actions: [
            {
              type: 'monitor',
              interval: 300, // 5 minutes
              conditions: ['situationResolved', 'escalationNeeded']
            }
          ]
        }
      ],
      requiredDepartments: ['Defense', 'Treasury', 'Interior', 'Justice', 'State', 'Commerce'],
      approvalRequirements: {
        highSeverity: ['Defense Secretary', 'Chief of Staff'],
        criticalSeverity: ['Defense Secretary', 'Chief of Staff', 'Leader']
      },
      automationLevel: 'semi_automated',
      priority: 'critical',
      estimatedDuration: 115,
      successCriteria: {
        situationResolved: true,
        allDepartmentsCoordinated: true,
        responseImplemented: true
      },
      failureConditions: {
        timeoutExceeded: true,
        criticalError: true,
        coordinationFailed: true
      },
      rollbackProcedures: [
        {
          step: 'notify-departments',
          action: 'send-rollback-notification'
        },
        {
          step: 'restore-state',
          action: 'restore-previous-configuration'
        }
      ],
      status: 'active',
      createdBy: 'System'
    });

    // Start the workflow instance immediately
    const instance = await service.startWorkflowInstance(
      Number(campaignId),
      crisisWorkflow.id,
      `Crisis Response: ${crisisType} - ${new Date().toISOString()}`,
      {
        crisisType,
        severity,
        affectedAreas: affectedAreas || [],
        initiatedAt: new Date().toISOString()
      },
      'critical'
    );

    res.json({
      success: true,
      workflow: crisisWorkflow,
      instance,
      message: `Crisis response workflow initiated for ${crisisType}`
    });
  } catch (error) {
    console.error('Error creating crisis response workflow:', error);
    res.status(500).json({
      error: 'Failed to create crisis response workflow',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/cabinet/workflows/templates/policy-implementation - Create policy implementation workflow
 */
router.post('/workflows/templates/policy-implementation', async (req, res) => {
  try {
    const service = getWorkflowService();
    const { campaignId, policyType, policyTitle, affectedDepartments, implementationDeadline } = req.body;

    if (!campaignId || !policyType || !policyTitle || !affectedDepartments) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'policyType', 'policyTitle', 'affectedDepartments']
      });
    }

    const policyWorkflow = await service.createWorkflowDefinition({
      name: `Policy Implementation: ${policyTitle}`,
      description: `Automated workflow for implementing ${policyType} policy`,
      category: 'policy_implementation',
      triggerConditions: {
        policyType,
        policyTitle,
        affectedDepartments
      },
      workflowSteps: [
        {
          id: 'policy-analysis',
          name: 'Policy Analysis',
          description: 'Analyze policy requirements and impact',
          stepType: 'automated',
          assignedDepartment: 'Treasury',
          requiredInputs: ['policyDetails'],
          expectedOutputs: ['impactAnalysis', 'budgetRequirements'],
          estimatedDuration: 30,
          actions: [
            {
              type: 'api_call',
              endpoint: '/api/treasury/policies/analyze',
              method: 'POST',
              data: { policyType, policyTitle },
              output: 'policyAnalysis'
            }
          ]
        },
        {
          id: 'department-coordination',
          name: 'Department Coordination',
          description: 'Coordinate implementation across affected departments',
          stepType: 'automated',
          requiredInputs: ['impactAnalysis'],
          expectedOutputs: ['coordinationPlan'],
          estimatedDuration: 20,
          actions: [
            {
              type: 'initiate_coordination',
              coordinationType: 'policy_sync',
              targetDepartments: affectedDepartments,
              priority: 'high'
            }
          ]
        },
        {
          id: 'implementation',
          name: 'Policy Implementation',
          description: 'Execute policy implementation across departments',
          stepType: 'manual',
          requiredInputs: ['coordinationPlan'],
          expectedOutputs: ['implementationResults'],
          estimatedDuration: 120
        },
        {
          id: 'verification',
          name: 'Implementation Verification',
          description: 'Verify policy has been implemented correctly',
          stepType: 'automated',
          requiredInputs: ['implementationResults'],
          expectedOutputs: ['verificationReport'],
          estimatedDuration: 15,
          actions: [
            {
              type: 'verify_implementation',
              checkpoints: ['policy_active', 'departments_updated', 'systems_configured']
            }
          ]
        }
      ],
      requiredDepartments: affectedDepartments,
      approvalRequirements: {
        budgetImpact: ['Treasury Secretary'],
        majorPolicy: ['Chief of Staff']
      },
      automationLevel: 'semi_automated',
      priority: 'high',
      estimatedDuration: 185,
      successCriteria: {
        policyImplemented: true,
        allDepartmentsUpdated: true,
        verificationPassed: true
      },
      failureConditions: {
        implementationFailed: true,
        coordinationTimeout: true,
        verificationFailed: true
      },
      rollbackProcedures: [
        {
          step: 'revert-changes',
          action: 'restore-previous-policy-state'
        }
      ],
      status: 'active',
      createdBy: 'System'
    });

    const instance = await service.startWorkflowInstance(
      Number(campaignId),
      policyWorkflow.id,
      `Policy Implementation: ${policyTitle} - ${new Date().toISOString()}`,
      {
        policyType,
        policyTitle,
        affectedDepartments,
        implementationDeadline: implementationDeadline || null,
        initiatedAt: new Date().toISOString()
      },
      'high'
    );

    res.json({
      success: true,
      workflow: policyWorkflow,
      instance,
      message: `Policy implementation workflow started for "${policyTitle}"`
    });
  } catch (error) {
    console.error('Error creating policy implementation workflow:', error);
    res.status(500).json({
      error: 'Failed to create policy implementation workflow',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/cabinet/workflows/templates/budget-coordination - Create budget coordination workflow
 */
router.post('/workflows/templates/budget-coordination', async (req, res) => {
  try {
    const service = getWorkflowService();
    const { campaignId, fiscalPeriod, budgetType } = req.body;

    if (!campaignId || !fiscalPeriod) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'fiscalPeriod']
      });
    }

    const budgetWorkflow = await service.createWorkflowDefinition({
      name: `Budget Coordination: ${fiscalPeriod}`,
      description: `Automated budget coordination workflow for ${fiscalPeriod}`,
      category: 'routine_operations',
      triggerConditions: {
        fiscalPeriod,
        budgetType: budgetType || 'annual'
      },
      workflowSteps: [
        {
          id: 'collect-requests',
          name: 'Collect Budget Requests',
          description: 'Collect budget requests from all departments',
          stepType: 'automated',
          assignedDepartment: 'Treasury',
          requiredInputs: ['fiscalPeriod'],
          expectedOutputs: ['budgetRequests'],
          estimatedDuration: 60,
          actions: [
            {
              type: 'initiate_coordination',
              coordinationType: 'budget_coordination',
              targetDepartments: ['Defense', 'State', 'Interior', 'Justice', 'Commerce'],
              priority: 'high'
            }
          ]
        },
        {
          id: 'analyze-requests',
          name: 'Analyze Budget Requests',
          description: 'Analyze and prioritize budget requests',
          stepType: 'automated',
          assignedDepartment: 'Treasury',
          requiredInputs: ['budgetRequests'],
          expectedOutputs: ['budgetAnalysis'],
          estimatedDuration: 45,
          actions: [
            {
              type: 'api_call',
              endpoint: '/api/treasury/budget/analyze',
              method: 'POST',
              data: { fiscalPeriod },
              output: 'budgetAnalysis'
            }
          ]
        },
        {
          id: 'approve-budget',
          name: 'Budget Approval',
          description: 'Review and approve final budget allocation',
          stepType: 'approval',
          assignedDepartment: 'Treasury',
          requiredInputs: ['budgetAnalysis'],
          expectedOutputs: ['approvedBudget'],
          estimatedDuration: 30
        },
        {
          id: 'distribute-budget',
          name: 'Distribute Budget',
          description: 'Distribute approved budget to departments',
          stepType: 'automated',
          assignedDepartment: 'Treasury',
          requiredInputs: ['approvedBudget'],
          expectedOutputs: ['budgetDistributed'],
          estimatedDuration: 15,
          actions: [
            {
              type: 'api_call',
              endpoint: '/api/treasury/budget/distribute',
              method: 'POST',
              output: 'distributionResults'
            }
          ]
        }
      ],
      requiredDepartments: ['Treasury', 'Defense', 'State', 'Interior', 'Justice', 'Commerce'],
      approvalRequirements: {
        budgetApproval: ['Treasury Secretary', 'Chief of Staff']
      },
      automationLevel: 'semi_automated',
      priority: 'high',
      estimatedDuration: 150,
      successCriteria: {
        budgetApproved: true,
        budgetDistributed: true,
        allDepartmentsNotified: true
      },
      failureConditions: {
        budgetRejected: true,
        coordinationFailed: true,
        distributionFailed: true
      },
      rollbackProcedures: [],
      status: 'active',
      createdBy: 'System'
    });

    const instance = await service.startWorkflowInstance(
      Number(campaignId),
      budgetWorkflow.id,
      `Budget Coordination: ${fiscalPeriod} - ${new Date().toISOString()}`,
      {
        fiscalPeriod,
        budgetType: budgetType || 'annual',
        initiatedAt: new Date().toISOString()
      },
      'high'
    );

    res.json({
      success: true,
      workflow: budgetWorkflow,
      instance,
      message: `Budget coordination workflow started for ${fiscalPeriod}`
    });
  } catch (error) {
    console.error('Error creating budget coordination workflow:', error);
    res.status(500).json({
      error: 'Failed to create budget coordination workflow',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'cabinet-workflow', workflowKnobSystem, applyWorkflowKnobsToGameState);

export default router;
