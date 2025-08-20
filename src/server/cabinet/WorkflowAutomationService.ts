import { Pool } from 'pg';
import { nanoid } from 'nanoid';

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  category: 'policy_implementation' | 'crisis_response' | 'routine_operations' | 'inter_department_coordination';
  triggerConditions: Record<string, any>;
  workflowSteps: WorkflowStep[];
  requiredDepartments: string[];
  approvalRequirements: Record<string, any>;
  automationLevel: 'manual' | 'semi_automated' | 'fully_automated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedDuration: number;
  successCriteria: Record<string, any>;
  failureConditions: Record<string, any>;
  rollbackProcedures: any[];
  status: 'active' | 'inactive' | 'deprecated';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  stepType: 'manual' | 'automated' | 'approval' | 'notification' | 'decision';
  assignedDepartment?: string;
  requiredInputs: string[];
  expectedOutputs: string[];
  estimatedDuration: number;
  conditions?: Record<string, any>;
  actions: any[];
  rollbackActions?: any[];
}

export interface WorkflowInstance {
  id: string;
  workflowDefinitionId: string;
  campaignId: number;
  instanceName: string;
  triggerEvent: Record<string, any>;
  currentStep: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedDepartments: string[];
  stepHistory: WorkflowStepExecution[];
  executionContext: Record<string, any>;
  results: Record<string, any>;
  errorLog: any[];
  startedAt?: Date;
  completedAt?: Date;
  estimatedCompletion?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStepExecution {
  id: string;
  workflowInstanceId: string;
  stepIndex: number;
  stepName: string;
  stepType: string;
  assignedDepartment?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  inputData: Record<string, any>;
  outputData: Record<string, any>;
  errorDetails: Record<string, any>;
  startedAt?: Date;
  completedAt?: Date;
  durationSeconds?: number;
  createdAt: Date;
}

export interface DepartmentCoordination {
  id: string;
  campaignId: number;
  coordinationType: 'information_sharing' | 'resource_request' | 'policy_sync' | 'crisis_response' | 'budget_coordination' | 'joint_operation';
  initiatingDepartment: string;
  targetDepartments: string[];
  coordinationData: Record<string, any>;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  responseDeadline?: Date;
  responses: Record<string, any>;
  resolution: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomatedDecision {
  id: string;
  campaignId: number;
  decisionType: string;
  decisionContext: Record<string, any>;
  decisionCriteria: Record<string, any>;
  decisionResult: Record<string, any>;
  confidenceScore: number;
  automationRuleId?: string;
  affectedDepartments: string[];
  implementationStatus: 'pending' | 'approved' | 'implemented' | 'rejected' | 'failed';
  humanReviewRequired: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
  implementationDate?: Date;
  impactAssessment: Record<string, any>;
  createdAt: Date;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  ruleType: 'decision_rule' | 'escalation_rule' | 'coordination_rule' | 'notification_rule';
  conditions: Record<string, any>;
  actions: any[];
  priority: number;
  isActive: boolean;
  successRate: number;
  usageCount: number;
  lastUsed?: Date;
  effectivenessScore: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterDepartmentMessage {
  id: string;
  campaignId: number;
  senderDepartment: string;
  recipientDepartments: string[];
  messageType: 'information' | 'request' | 'directive' | 'alert' | 'notification' | 'coordination';
  subject: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  requiresResponse: boolean;
  responseDeadline?: Date;
  attachments: any[];
  responses: Record<string, any>;
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'responded' | 'archived';
  sentAt: Date;
  readReceipts: Record<string, Date>;
  threadId?: string;
  parentMessageId?: string;
}

/**
 * Cabinet Workflow Automation Service
 * Manages automated workflows, department coordination, and decision-making
 */
export class WorkflowAutomationService {
  constructor(private pool: Pool) {}

  // ===== WORKFLOW DEFINITION MANAGEMENT =====

  /**
   * Create a new workflow definition
   */
  async createWorkflowDefinition(
    workflowData: Omit<WorkflowDefinition, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<WorkflowDefinition> {
    const id = nanoid();
    const now = new Date();

    const result = await this.pool.query(`
      INSERT INTO workflow_definitions (
        id, name, description, category, trigger_conditions, workflow_steps,
        required_departments, approval_requirements, automation_level, priority,
        estimated_duration, success_criteria, failure_conditions, rollback_procedures,
        status, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `, [
      id, workflowData.name, workflowData.description, workflowData.category,
      JSON.stringify(workflowData.triggerConditions), JSON.stringify(workflowData.workflowSteps),
      JSON.stringify(workflowData.requiredDepartments), JSON.stringify(workflowData.approvalRequirements),
      workflowData.automationLevel, workflowData.priority, workflowData.estimatedDuration,
      JSON.stringify(workflowData.successCriteria), JSON.stringify(workflowData.failureConditions),
      JSON.stringify(workflowData.rollbackProcedures), workflowData.status, workflowData.createdBy
    ]);

    return this.mapWorkflowDefinition(result.rows[0]);
  }

  /**
   * Get workflow definitions
   */
  async getWorkflowDefinitions(
    filters?: {
      category?: string;
      status?: string;
      priority?: string;
    }
  ): Promise<WorkflowDefinition[]> {
    let query = 'SELECT * FROM workflow_definitions WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.category) {
      query += ` AND category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.priority) {
      query += ` AND priority = $${paramIndex}`;
      params.push(filters.priority);
      paramIndex++;
    }

    query += ' ORDER BY priority DESC, created_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapWorkflowDefinition(row));
  }

  // ===== WORKFLOW INSTANCE MANAGEMENT =====

  /**
   * Start a new workflow instance
   */
  async startWorkflowInstance(
    campaignId: number,
    workflowDefinitionId: string,
    instanceName: string,
    triggerEvent: Record<string, any>,
    priority?: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<WorkflowInstance> {
    const id = nanoid();
    const now = new Date();

    // Get workflow definition
    const workflowDef = await this.getWorkflowDefinitionById(workflowDefinitionId);
    if (!workflowDef) {
      throw new Error(`Workflow definition ${workflowDefinitionId} not found`);
    }

    // Calculate estimated completion
    const estimatedCompletion = new Date(now.getTime() + workflowDef.estimatedDuration * 60000);

    const result = await this.pool.query(`
      INSERT INTO workflow_instances (
        id, workflow_definition_id, campaign_id, instance_name, trigger_event,
        current_step, status, priority, assigned_departments, step_history,
        execution_context, results, error_log, started_at, estimated_completion
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      id, workflowDefinitionId, campaignId, instanceName, JSON.stringify(triggerEvent),
      0, 'running', priority || workflowDef.priority, JSON.stringify(workflowDef.requiredDepartments),
      JSON.stringify([]), JSON.stringify({ triggerEvent }), JSON.stringify({}),
      JSON.stringify([]), now, estimatedCompletion
    ]);

    const instance = this.mapWorkflowInstance(result.rows[0]);

    // Start first step if automation level allows
    if (workflowDef.automationLevel !== 'manual') {
      await this.executeNextStep(instance.id);
    }

    return instance;
  }

  /**
   * Execute the next step in a workflow instance
   */
  async executeNextStep(instanceId: string): Promise<WorkflowStepExecution> {
    const instance = await this.getWorkflowInstanceById(instanceId);
    if (!instance) {
      throw new Error(`Workflow instance ${instanceId} not found`);
    }

    const workflowDef = await this.getWorkflowDefinitionById(instance.workflowDefinitionId);
    if (!workflowDef) {
      throw new Error(`Workflow definition ${instance.workflowDefinitionId} not found`);
    }

    if (instance.currentStep >= workflowDef.workflowSteps.length) {
      // Workflow completed
      await this.completeWorkflowInstance(instanceId);
      throw new Error('Workflow already completed');
    }

    const currentStep = workflowDef.workflowSteps[instance.currentStep];
    const stepExecutionId = nanoid();
    const now = new Date();

    // Create step execution record
    const stepResult = await this.pool.query(`
      INSERT INTO workflow_step_executions (
        id, workflow_instance_id, step_index, step_name, step_type,
        assigned_department, status, input_data, output_data, error_details, started_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      stepExecutionId, instanceId, instance.currentStep, currentStep.name, currentStep.stepType,
      currentStep.assignedDepartment, 'running', JSON.stringify(instance.executionContext),
      JSON.stringify({}), JSON.stringify({}), now
    ]);

    // Execute step based on type
    let stepOutput: Record<string, any> = {};
    let stepStatus: 'completed' | 'failed' = 'completed';
    let errorDetails: Record<string, any> = {};

    try {
      stepOutput = await this.executeStep(currentStep, instance.executionContext);
    } catch (error) {
      stepStatus = 'failed';
      errorDetails = {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }

    // Update step execution
    const completedAt = new Date();
    const durationSeconds = Math.floor((completedAt.getTime() - now.getTime()) / 1000);

    await this.pool.query(`
      UPDATE workflow_step_executions 
      SET status = $1, output_data = $2, error_details = $3, completed_at = $4, duration_seconds = $5
      WHERE id = $6
    `, [stepStatus, JSON.stringify(stepOutput), JSON.stringify(errorDetails), completedAt, durationSeconds, stepExecutionId]);

    // Update workflow instance
    if (stepStatus === 'completed') {
      const nextStep = instance.currentStep + 1;
      const newContext = { ...instance.executionContext, ...stepOutput };

      await this.pool.query(`
        UPDATE workflow_instances 
        SET current_step = $1, execution_context = $2, updated_at = NOW()
        WHERE id = $3
      `, [nextStep, JSON.stringify(newContext), instanceId]);

      // Check if workflow is complete
      if (nextStep >= workflowDef.workflowSteps.length) {
        await this.completeWorkflowInstance(instanceId);
      }
    } else {
      // Mark workflow as failed
      await this.pool.query(`
        UPDATE workflow_instances 
        SET status = 'failed', updated_at = NOW()
        WHERE id = $1
      `, [instanceId]);
    }

    return this.mapWorkflowStepExecution(stepResult.rows[0]);
  }

  /**
   * Execute a single workflow step
   */
  private async executeStep(step: WorkflowStep, context: Record<string, any>): Promise<Record<string, any>> {
    const output: Record<string, any> = {};

    switch (step.stepType) {
      case 'automated':
        // Execute automated actions
        for (const action of step.actions) {
          const actionResult = await this.executeAction(action, context);
          Object.assign(output, actionResult);
        }
        break;

      case 'notification':
        // Send notifications
        for (const action of step.actions) {
          if (action.type === 'send_message' && step.assignedDepartment) {
            await this.sendInterDepartmentMessage(
              context.campaignId || 1,
              'System',
              [step.assignedDepartment],
              'notification',
              action.subject || step.name,
              action.content || step.description,
              'medium'
            );
          }
        }
        output.notificationsSent = step.actions.length;
        break;

      case 'decision':
        // Make automated decision if criteria met
        const decision = await this.makeAutomatedDecision(step, context);
        output.decision = decision;
        break;

      case 'manual':
      case 'approval':
        // These require human intervention - mark as pending
        output.requiresHumanAction = true;
        output.assignedDepartment = step.assignedDepartment;
        break;

      default:
        output.stepCompleted = true;
    }

    return output;
  }

  /**
   * Execute a workflow action
   */
  private async executeAction(action: any, context: Record<string, any>): Promise<Record<string, any>> {
    const result: Record<string, any> = {};

    switch (action.type) {
      case 'update_context':
        result[action.key] = action.value;
        break;

      case 'calculate':
        // Simple calculation support
        if (action.formula && context[action.input]) {
          result[action.output] = this.evaluateFormula(action.formula, context);
        }
        break;

      case 'api_call':
        // Make API call to department system
        try {
          const apiResult = await this.makeDepartmentAPICall(action.endpoint, action.method, action.data);
          result[action.output || 'apiResult'] = apiResult;
        } catch (error) {
          result.error = error instanceof Error ? error.message : 'API call failed';
        }
        break;

      default:
        result.actionExecuted = action.type;
    }

    return result;
  }

  // ===== DEPARTMENT COORDINATION =====

  /**
   * Initiate department coordination
   */
  async initiateDepartmentCoordination(
    campaignId: number,
    coordinationType: DepartmentCoordination['coordinationType'],
    initiatingDepartment: string,
    targetDepartments: string[],
    coordinationData: Record<string, any>,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    responseDeadline?: Date
  ): Promise<DepartmentCoordination> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO department_coordination (
        id, campaign_id, coordination_type, initiating_department, target_departments,
        coordination_data, status, priority, response_deadline, responses, resolution
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      id, campaignId, coordinationType, initiatingDepartment, JSON.stringify(targetDepartments),
      JSON.stringify(coordinationData), 'pending', priority, responseDeadline,
      JSON.stringify({}), JSON.stringify({})
    ]);

    const coordination = this.mapDepartmentCoordination(result.rows[0]);

    // Send coordination messages to target departments
    await this.sendInterDepartmentMessage(
      campaignId,
      initiatingDepartment,
      targetDepartments,
      'coordination',
      `Coordination Request: ${coordinationType}`,
      `A coordination request has been initiated. Please review and respond.`,
      priority,
      true,
      responseDeadline
    );

    return coordination;
  }

  /**
   * Respond to department coordination
   */
  async respondToDepartmentCoordination(
    coordinationId: string,
    respondingDepartment: string,
    response: Record<string, any>
  ): Promise<DepartmentCoordination> {
    const coordination = await this.getDepartmentCoordinationById(coordinationId);
    if (!coordination) {
      throw new Error(`Coordination ${coordinationId} not found`);
    }

    const updatedResponses = {
      ...coordination.responses,
      [respondingDepartment]: {
        ...response,
        respondedAt: new Date().toISOString()
      }
    };

    // Check if all departments have responded
    const allResponded = coordination.targetDepartments.every(dept => 
      updatedResponses[dept] !== undefined
    );

    const newStatus = allResponded ? 'completed' : 'in_progress';

    await this.pool.query(`
      UPDATE department_coordination 
      SET responses = $1, status = $2, updated_at = NOW()
      WHERE id = $3
    `, [JSON.stringify(updatedResponses), newStatus, coordinationId]);

    return await this.getDepartmentCoordinationById(coordinationId) as DepartmentCoordination;
  }

  // ===== INTER-DEPARTMENT MESSAGING =====

  /**
   * Send inter-department message
   */
  async sendInterDepartmentMessage(
    campaignId: number,
    senderDepartment: string,
    recipientDepartments: string[],
    messageType: InterDepartmentMessage['messageType'],
    subject: string,
    content: string,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    requiresResponse: boolean = false,
    responseDeadline?: Date,
    attachments: any[] = [],
    threadId?: string,
    parentMessageId?: string
  ): Promise<InterDepartmentMessage> {
    const id = nanoid();

    const result = await this.pool.query(`
      INSERT INTO inter_department_messages (
        id, campaign_id, sender_department, recipient_departments, message_type,
        subject, content, priority, requires_response, response_deadline,
        attachments, responses, status, sent_at, read_receipts, thread_id, parent_message_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      id, campaignId, senderDepartment, JSON.stringify(recipientDepartments), messageType,
      subject, content, priority, requiresResponse, responseDeadline,
      JSON.stringify(attachments), JSON.stringify({}), 'sent', new Date(),
      JSON.stringify({}), threadId, parentMessageId
    ]);

    return this.mapInterDepartmentMessage(result.rows[0]);
  }

  // ===== AUTOMATED DECISIONS =====

  /**
   * Make automated decision
   */
  private async makeAutomatedDecision(
    step: WorkflowStep,
    context: Record<string, any>
  ): Promise<AutomatedDecision> {
    const id = nanoid();
    const decisionType = step.name;
    const decisionCriteria = step.conditions || {};
    
    // Simple decision logic - can be enhanced with ML
    let decisionResult: Record<string, any> = {};
    let confidenceScore = 0.5;

    // Evaluate decision criteria
    if (decisionCriteria.threshold && context[decisionCriteria.field]) {
      const value = context[decisionCriteria.field];
      const threshold = decisionCriteria.threshold;
      
      if (value > threshold) {
        decisionResult = { decision: 'approve', value, threshold };
        confidenceScore = 0.8;
      } else {
        decisionResult = { decision: 'reject', value, threshold };
        confidenceScore = 0.7;
      }
    } else {
      decisionResult = { decision: 'pending', reason: 'insufficient_data' };
      confidenceScore = 0.3;
    }

    const result = await this.pool.query(`
      INSERT INTO automated_decisions (
        id, campaign_id, decision_type, decision_context, decision_criteria,
        decision_result, confidence_score, affected_departments, implementation_status,
        human_review_required, impact_assessment
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      id, context.campaignId || 1, decisionType, JSON.stringify(context),
      JSON.stringify(decisionCriteria), JSON.stringify(decisionResult), confidenceScore,
      JSON.stringify(step.assignedDepartment ? [step.assignedDepartment] : []),
      confidenceScore > 0.7 ? 'approved' : 'pending', confidenceScore < 0.6,
      JSON.stringify({ estimatedImpact: 'medium', riskLevel: 'low' })
    ]);

    return this.mapAutomatedDecision(result.rows[0]);
  }

  // ===== HELPER METHODS =====

  private async getWorkflowDefinitionById(id: string): Promise<WorkflowDefinition | null> {
    const result = await this.pool.query('SELECT * FROM workflow_definitions WHERE id = $1', [id]);
    return result.rows[0] ? this.mapWorkflowDefinition(result.rows[0]) : null;
  }

  private async getWorkflowInstanceById(id: string): Promise<WorkflowInstance | null> {
    const result = await this.pool.query('SELECT * FROM workflow_instances WHERE id = $1', [id]);
    return result.rows[0] ? this.mapWorkflowInstance(result.rows[0]) : null;
  }

  private async getDepartmentCoordinationById(id: string): Promise<DepartmentCoordination | null> {
    const result = await this.pool.query('SELECT * FROM department_coordination WHERE id = $1', [id]);
    return result.rows[0] ? this.mapDepartmentCoordination(result.rows[0]) : null;
  }

  private async completeWorkflowInstance(instanceId: string): Promise<void> {
    await this.pool.query(`
      UPDATE workflow_instances 
      SET status = 'completed', completed_at = NOW(), updated_at = NOW()
      WHERE id = $1
    `, [instanceId]);
  }

  private evaluateFormula(formula: string, context: Record<string, any>): number {
    // Simple formula evaluation - can be enhanced
    try {
      // Replace variables in formula with context values
      let evaluatedFormula = formula;
      for (const [key, value] of Object.entries(context)) {
        if (typeof value === 'number') {
          evaluatedFormula = evaluatedFormula.replace(new RegExp(`\\b${key}\\b`, 'g'), value.toString());
        }
      }
      
      // Basic arithmetic evaluation (unsafe - should use a proper expression evaluator)
      return eval(evaluatedFormula);
    } catch (error) {
      return 0;
    }
  }

  private async makeDepartmentAPICall(endpoint: string, method: string, data?: any): Promise<any> {
    // Placeholder for department API calls
    // In a real implementation, this would make HTTP calls to department APIs
    return {
      success: true,
      endpoint,
      method,
      data,
      timestamp: new Date().toISOString()
    };
  }

  // ===== MAPPING METHODS =====

  private mapWorkflowDefinition(row: any): WorkflowDefinition {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      triggerConditions: row.trigger_conditions,
      workflowSteps: row.workflow_steps,
      requiredDepartments: row.required_departments,
      approvalRequirements: row.approval_requirements,
      automationLevel: row.automation_level,
      priority: row.priority,
      estimatedDuration: row.estimated_duration,
      successCriteria: row.success_criteria,
      failureConditions: row.failure_conditions,
      rollbackProcedures: row.rollback_procedures,
      status: row.status,
      createdBy: row.created_by,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapWorkflowInstance(row: any): WorkflowInstance {
    return {
      id: row.id,
      workflowDefinitionId: row.workflow_definition_id,
      campaignId: row.campaign_id,
      instanceName: row.instance_name,
      triggerEvent: row.trigger_event,
      currentStep: row.current_step,
      status: row.status,
      priority: row.priority,
      assignedDepartments: row.assigned_departments,
      stepHistory: row.step_history,
      executionContext: row.execution_context,
      results: row.results,
      errorLog: row.error_log,
      startedAt: row.started_at ? new Date(row.started_at) : undefined,
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      estimatedCompletion: row.estimated_completion ? new Date(row.estimated_completion) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapDepartmentCoordination(row: any): DepartmentCoordination {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      coordinationType: row.coordination_type,
      initiatingDepartment: row.initiating_department,
      targetDepartments: row.target_departments,
      coordinationData: row.coordination_data,
      status: row.status,
      priority: row.priority,
      responseDeadline: row.response_deadline ? new Date(row.response_deadline) : undefined,
      responses: row.responses,
      resolution: row.resolution,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapWorkflowStepExecution(row: any): WorkflowStepExecution {
    return {
      id: row.id,
      workflowInstanceId: row.workflow_instance_id,
      stepIndex: row.step_index,
      stepName: row.step_name,
      stepType: row.step_type,
      assignedDepartment: row.assigned_department,
      status: row.status,
      inputData: row.input_data,
      outputData: row.output_data,
      errorDetails: row.error_details,
      startedAt: row.started_at ? new Date(row.started_at) : undefined,
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      durationSeconds: row.duration_seconds,
      createdAt: new Date(row.created_at)
    };
  }

  private mapAutomatedDecision(row: any): AutomatedDecision {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      decisionType: row.decision_type,
      decisionContext: row.decision_context,
      decisionCriteria: row.decision_criteria,
      decisionResult: row.decision_result,
      confidenceScore: row.confidence_score,
      automationRuleId: row.automation_rule_id,
      affectedDepartments: row.affected_departments,
      implementationStatus: row.implementation_status,
      humanReviewRequired: row.human_review_required,
      reviewedBy: row.reviewed_by,
      reviewedAt: row.reviewed_at ? new Date(row.reviewed_at) : undefined,
      implementationDate: row.implementation_date ? new Date(row.implementation_date) : undefined,
      impactAssessment: row.impact_assessment,
      createdAt: new Date(row.created_at)
    };
  }

  private mapInterDepartmentMessage(row: any): InterDepartmentMessage {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      senderDepartment: row.sender_department,
      recipientDepartments: row.recipient_departments,
      messageType: row.message_type,
      subject: row.subject,
      content: row.content,
      priority: row.priority,
      requiresResponse: row.requires_response,
      responseDeadline: row.response_deadline ? new Date(row.response_deadline) : undefined,
      attachments: row.attachments,
      responses: row.responses,
      status: row.status,
      sentAt: new Date(row.sent_at),
      readReceipts: row.read_receipts,
      threadId: row.thread_id,
      parentMessageId: row.parent_message_id
    };
  }

  /**
   * Get predefined workflow definitions for new departments
   */
  async getPreDefinedWorkflowsForNewDepartments(): Promise<Partial<WorkflowDefinition>[]> {
    return [
      // Science Department Workflows
      {
        name: 'Research Project Coordination',
        description: 'Coordinate multi-department research initiatives with budget and security oversight',
        category: 'inter_department_coordination',
        triggerConditions: { event_type: 'research_project_initiated', priority: 'high' },
        requiredDepartments: ['science', 'treasury', 'defense', 'communications'],
        workflowSteps: [
          {
            id: 'step-1',
            name: 'Research Proposal Review',
            description: 'Science Secretary reviews and validates research proposal',
            stepType: 'manual',
            assignedDepartment: 'science',
            requiredInputs: ['research_proposal', 'budget_estimate'],
            expectedOutputs: ['approval_status', 'technical_assessment'],
            estimatedDuration: 120,
            actions: [
              { type: 'api_call', endpoint: '/api/science/research/review', method: 'POST' }
            ]
          },
          {
            id: 'step-2',
            name: 'Budget Allocation',
            description: 'Treasury Secretary allocates research funding',
            stepType: 'approval',
            assignedDepartment: 'treasury',
            requiredInputs: ['approved_proposal', 'budget_estimate'],
            expectedOutputs: ['funding_approval', 'budget_allocation'],
            estimatedDuration: 60,
            actions: [
              { type: 'api_call', endpoint: '/api/treasury/allocate-research-budget', method: 'POST' }
            ]
          },
          {
            id: 'step-3',
            name: 'Security Clearance',
            description: 'Defense Secretary reviews security implications',
            stepType: 'automated',
            assignedDepartment: 'defense',
            requiredInputs: ['research_details', 'security_classification'],
            expectedOutputs: ['security_clearance', 'classification_level'],
            estimatedDuration: 30,
            actions: [
              { type: 'api_call', endpoint: '/api/defense/security/classify-research', method: 'POST' }
            ]
          },
          {
            id: 'step-4',
            name: 'Public Communication Strategy',
            description: 'Communications Secretary develops public messaging',
            stepType: 'manual',
            assignedDepartment: 'communications',
            requiredInputs: ['approved_research', 'classification_level'],
            expectedOutputs: ['communication_plan', 'media_strategy'],
            estimatedDuration: 90,
            actions: [
              { type: 'api_call', endpoint: '/api/communications/create-research-strategy', method: 'POST' }
            ]
          }
        ],
        automationLevel: 'semi_automated',
        priority: 'high',
        estimatedDuration: 300
      },
      
      // Communications Department Workflows  
      {
        name: 'Crisis Communication Response',
        description: 'Coordinate government-wide crisis communication across all departments',
        category: 'crisis_response',
        triggerConditions: { event_type: 'crisis_detected', severity: 'high' },
        requiredDepartments: ['communications', 'defense', 'state', 'interior', 'science'],
        workflowSteps: [
          {
            id: 'step-1',
            name: 'Crisis Assessment',
            description: 'Communications Secretary assesses crisis communication needs',
            stepType: 'automated',
            assignedDepartment: 'communications',
            requiredInputs: ['crisis_details', 'severity_level'],
            expectedOutputs: ['communication_assessment', 'response_strategy'],
            estimatedDuration: 15,
            actions: [
              { type: 'api_call', endpoint: '/api/communications/assess-crisis', method: 'POST' }
            ]
          },
          {
            id: 'step-2',
            name: 'Security Briefing',
            description: 'Defense Secretary provides security status',
            stepType: 'automated',
            assignedDepartment: 'defense',
            requiredInputs: ['crisis_details'],
            expectedOutputs: ['security_status', 'threat_assessment'],
            estimatedDuration: 10,
            actions: [
              { type: 'api_call', endpoint: '/api/defense/crisis/assess-security', method: 'POST' }
            ]
          },
          {
            id: 'step-3',
            name: 'Diplomatic Coordination',
            description: 'State Secretary coordinates international messaging',
            stepType: 'manual',
            assignedDepartment: 'state',
            requiredInputs: ['crisis_details', 'communication_strategy'],
            expectedOutputs: ['diplomatic_messaging', 'international_coordination'],
            estimatedDuration: 30,
            actions: [
              { type: 'api_call', endpoint: '/api/state/coordinate-crisis-diplomacy', method: 'POST' }
            ]
          },
          {
            id: 'step-4',
            name: 'Public Safety Messaging',
            description: 'Interior Secretary coordinates public safety communications',
            stepType: 'automated',
            assignedDepartment: 'interior',
            requiredInputs: ['crisis_details', 'safety_protocols'],
            expectedOutputs: ['safety_messaging', 'emergency_protocols'],
            estimatedDuration: 20,
            actions: [
              { type: 'api_call', endpoint: '/api/interior/emergency/coordinate-messaging', method: 'POST' }
            ]
          },
          {
            id: 'step-5',
            name: 'Technical Information Release',
            description: 'Science Secretary coordinates technical information release',
            stepType: 'approval',
            assignedDepartment: 'science',
            requiredInputs: ['technical_details', 'classification_level'],
            expectedOutputs: ['approved_technical_info', 'public_explanation'],
            estimatedDuration: 45,
            actions: [
              { type: 'api_call', endpoint: '/api/science/coordinate-technical-release', method: 'POST' }
            ]
          },
          {
            id: 'step-6',
            name: 'Unified Message Deployment',
            description: 'Communications Secretary deploys coordinated response',
            stepType: 'automated',
            assignedDepartment: 'communications',
            requiredInputs: ['all_department_inputs'],
            expectedOutputs: ['unified_message', 'deployment_confirmation'],
            estimatedDuration: 15,
            actions: [
              { type: 'api_call', endpoint: '/api/communications/deploy-crisis-response', method: 'POST' }
            ]
          }
        ],
        automationLevel: 'semi_automated',
        priority: 'critical',
        estimatedDuration: 135
      },

      // Science-Communications Integration Workflow
      {
        name: 'Scientific Discovery Announcement',
        description: 'Coordinate announcement of major scientific discoveries with appropriate messaging',
        category: 'policy_implementation',
        triggerConditions: { event_type: 'major_discovery', significance: 'high' },
        requiredDepartments: ['science', 'communications', 'state', 'commerce'],
        workflowSteps: [
          {
            id: 'step-1',
            name: 'Discovery Validation',
            description: 'Science Secretary validates and classifies discovery',
            stepType: 'manual',
            assignedDepartment: 'science',
            requiredInputs: ['discovery_data', 'research_validation'],
            expectedOutputs: ['validated_discovery', 'significance_assessment'],
            estimatedDuration: 180,
            actions: [
              { type: 'api_call', endpoint: '/api/science/validate-discovery', method: 'POST' }
            ]
          },
          {
            id: 'step-2',
            name: 'Commercial Impact Assessment',
            description: 'Commerce Secretary assesses economic implications',
            stepType: 'automated',
            assignedDepartment: 'commerce',
            requiredInputs: ['validated_discovery'],
            expectedOutputs: ['economic_impact', 'commercialization_potential'],
            estimatedDuration: 60,
            actions: [
              { type: 'api_call', endpoint: '/api/commerce/assess-discovery-impact', method: 'POST' }
            ]
          },
          {
            id: 'step-3',
            name: 'International Coordination',
            description: 'State Secretary coordinates international scientific cooperation',
            stepType: 'manual',
            assignedDepartment: 'state',
            requiredInputs: ['discovery_details', 'significance_level'],
            expectedOutputs: ['international_strategy', 'cooperation_agreements'],
            estimatedDuration: 120,
            actions: [
              { type: 'api_call', endpoint: '/api/state/coordinate-scientific-diplomacy', method: 'POST' }
            ]
          },
          {
            id: 'step-4',
            name: 'Public Announcement Strategy',
            description: 'Communications Secretary develops comprehensive announcement plan',
            stepType: 'manual',
            assignedDepartment: 'communications',
            requiredInputs: ['all_assessments', 'coordination_plans'],
            expectedOutputs: ['announcement_strategy', 'media_campaign'],
            estimatedDuration: 90,
            actions: [
              { type: 'api_call', endpoint: '/api/communications/plan-discovery-announcement', method: 'POST' }
            ]
          }
        ],
        automationLevel: 'semi_automated',
        priority: 'medium',
        estimatedDuration: 450
      }
    ];
  }
}
