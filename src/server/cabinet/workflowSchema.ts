import { Pool } from 'pg';

/**
 * Initialize Cabinet Workflow Automation database schema
 */
export async function initializeWorkflowSchema(pool: Pool): Promise<void> {
  try {
    await pool.query(`
      -- Workflow Definitions
      CREATE TABLE IF NOT EXISTS workflow_definitions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL CHECK (category IN ('policy_implementation', 'crisis_response', 'routine_operations', 'inter_department_coordination')),
        trigger_conditions JSONB NOT NULL DEFAULT '{}',
        workflow_steps JSONB NOT NULL DEFAULT '[]',
        required_departments JSONB NOT NULL DEFAULT '[]',
        approval_requirements JSONB NOT NULL DEFAULT '{}',
        automation_level TEXT NOT NULL DEFAULT 'semi_automated' CHECK (automation_level IN ('manual', 'semi_automated', 'fully_automated')),
        priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        estimated_duration INTEGER NOT NULL DEFAULT 0, -- minutes
        success_criteria JSONB NOT NULL DEFAULT '{}',
        failure_conditions JSONB NOT NULL DEFAULT '{}',
        rollback_procedures JSONB NOT NULL DEFAULT '[]',
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),
        created_by TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Workflow Instances
      CREATE TABLE IF NOT EXISTS workflow_instances (
        id TEXT PRIMARY KEY,
        workflow_definition_id TEXT NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
        campaign_id INTEGER NOT NULL,
        instance_name TEXT NOT NULL,
        trigger_event JSONB NOT NULL DEFAULT '{}',
        current_step INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled', 'paused')),
        priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        assigned_departments JSONB NOT NULL DEFAULT '[]',
        step_history JSONB NOT NULL DEFAULT '[]',
        execution_context JSONB NOT NULL DEFAULT '{}',
        results JSONB NOT NULL DEFAULT '{}',
        error_log JSONB NOT NULL DEFAULT '[]',
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        estimated_completion TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Department Coordination
      CREATE TABLE IF NOT EXISTS department_coordination (
        id TEXT PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        coordination_type TEXT NOT NULL CHECK (coordination_type IN ('information_sharing', 'resource_request', 'policy_sync', 'crisis_response', 'budget_coordination', 'joint_operation')),
        initiating_department TEXT NOT NULL,
        target_departments JSONB NOT NULL DEFAULT '[]',
        coordination_data JSONB NOT NULL DEFAULT '{}',
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')),
        priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        response_deadline TIMESTAMP,
        responses JSONB NOT NULL DEFAULT '{}',
        resolution JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Automated Decisions
      CREATE TABLE IF NOT EXISTS automated_decisions (
        id TEXT PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        decision_type TEXT NOT NULL,
        decision_context JSONB NOT NULL DEFAULT '{}',
        decision_criteria JSONB NOT NULL DEFAULT '{}',
        decision_result JSONB NOT NULL DEFAULT '{}',
        confidence_score REAL NOT NULL DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
        automation_rule_id TEXT,
        affected_departments JSONB NOT NULL DEFAULT '[]',
        implementation_status TEXT NOT NULL DEFAULT 'pending' CHECK (implementation_status IN ('pending', 'approved', 'implemented', 'rejected', 'failed')),
        human_review_required BOOLEAN NOT NULL DEFAULT FALSE,
        reviewed_by TEXT,
        reviewed_at TIMESTAMP,
        implementation_date TIMESTAMP,
        impact_assessment JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Automation Rules
      CREATE TABLE IF NOT EXISTS automation_rules (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        rule_type TEXT NOT NULL CHECK (rule_type IN ('decision_rule', 'escalation_rule', 'coordination_rule', 'notification_rule')),
        conditions JSONB NOT NULL DEFAULT '{}',
        actions JSONB NOT NULL DEFAULT '[]',
        priority INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        success_rate REAL NOT NULL DEFAULT 0.0 CHECK (success_rate >= 0 AND success_rate <= 1),
        usage_count INTEGER NOT NULL DEFAULT 0,
        last_used TIMESTAMP,
        effectiveness_score REAL NOT NULL DEFAULT 0.0 CHECK (effectiveness_score >= 0 AND effectiveness_score <= 1),
        created_by TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Performance Metrics
      CREATE TABLE IF NOT EXISTS workflow_performance (
        id TEXT PRIMARY KEY,
        workflow_definition_id TEXT NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
        campaign_id INTEGER NOT NULL,
        measurement_period_start TIMESTAMP NOT NULL,
        measurement_period_end TIMESTAMP NOT NULL,
        total_executions INTEGER NOT NULL DEFAULT 0,
        successful_executions INTEGER NOT NULL DEFAULT 0,
        failed_executions INTEGER NOT NULL DEFAULT 0,
        average_duration REAL NOT NULL DEFAULT 0,
        average_cost REAL NOT NULL DEFAULT 0,
        bottleneck_steps JSONB NOT NULL DEFAULT '[]',
        performance_score REAL NOT NULL DEFAULT 0.0 CHECK (performance_score >= 0 AND performance_score <= 1),
        improvement_recommendations JSONB NOT NULL DEFAULT '[]',
        efficiency_trend REAL NOT NULL DEFAULT 0.0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Inter-Department Messages
      CREATE TABLE IF NOT EXISTS inter_department_messages (
        id TEXT PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        sender_department TEXT NOT NULL,
        recipient_departments JSONB NOT NULL DEFAULT '[]',
        message_type TEXT NOT NULL CHECK (message_type IN ('information', 'request', 'directive', 'alert', 'notification', 'coordination')),
        subject TEXT NOT NULL,
        content TEXT NOT NULL,
        priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        requires_response BOOLEAN NOT NULL DEFAULT FALSE,
        response_deadline TIMESTAMP,
        attachments JSONB NOT NULL DEFAULT '[]',
        responses JSONB NOT NULL DEFAULT '{}',
        status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read', 'responded', 'archived')),
        sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
        read_receipts JSONB NOT NULL DEFAULT '{}',
        thread_id TEXT, -- For message threading
        parent_message_id TEXT REFERENCES inter_department_messages(id) ON DELETE SET NULL
      );

      -- Workflow Step Executions (for detailed tracking)
      CREATE TABLE IF NOT EXISTS workflow_step_executions (
        id TEXT PRIMARY KEY,
        workflow_instance_id TEXT NOT NULL REFERENCES workflow_instances(id) ON DELETE CASCADE,
        step_index INTEGER NOT NULL,
        step_name TEXT NOT NULL,
        step_type TEXT NOT NULL,
        assigned_department TEXT,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped')),
        input_data JSONB NOT NULL DEFAULT '{}',
        output_data JSONB NOT NULL DEFAULT '{}',
        error_details JSONB NOT NULL DEFAULT '{}',
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        duration_seconds INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Department Performance Metrics
      CREATE TABLE IF NOT EXISTS department_performance_metrics (
        id TEXT PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        department_name TEXT NOT NULL,
        measurement_period_start TIMESTAMP NOT NULL,
        measurement_period_end TIMESTAMP NOT NULL,
        workflows_participated INTEGER NOT NULL DEFAULT 0,
        workflows_initiated INTEGER NOT NULL DEFAULT 0,
        average_response_time REAL NOT NULL DEFAULT 0, -- minutes
        coordination_success_rate REAL NOT NULL DEFAULT 0.0 CHECK (coordination_success_rate >= 0 AND coordination_success_rate <= 1),
        decision_accuracy REAL NOT NULL DEFAULT 0.0 CHECK (decision_accuracy >= 0 AND decision_accuracy <= 1),
        resource_utilization REAL NOT NULL DEFAULT 0.0 CHECK (resource_utilization >= 0 AND resource_utilization <= 1),
        collaboration_score REAL NOT NULL DEFAULT 0.0 CHECK (collaboration_score >= 0 AND collaboration_score <= 1),
        efficiency_score REAL NOT NULL DEFAULT 0.0 CHECK (efficiency_score >= 0 AND efficiency_score <= 1),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- System Configuration
      CREATE TABLE IF NOT EXISTS workflow_system_config (
        id TEXT PRIMARY KEY,
        campaign_id INTEGER NOT NULL UNIQUE,
        automation_settings JSONB NOT NULL DEFAULT '{}',
        coordination_settings JSONB NOT NULL DEFAULT '{}',
        notification_settings JSONB NOT NULL DEFAULT '{}',
        performance_thresholds JSONB NOT NULL DEFAULT '{}',
        escalation_rules JSONB NOT NULL DEFAULT '[]',
        department_priorities JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_workflow_definitions_category ON workflow_definitions(category);
      CREATE INDEX IF NOT EXISTS idx_workflow_definitions_status ON workflow_definitions(status);
      CREATE INDEX IF NOT EXISTS idx_workflow_definitions_priority ON workflow_definitions(priority);

      CREATE INDEX IF NOT EXISTS idx_workflow_instances_campaign ON workflow_instances(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_workflow_instances_status ON workflow_instances(status);
      CREATE INDEX IF NOT EXISTS idx_workflow_instances_priority ON workflow_instances(priority);
      CREATE INDEX IF NOT EXISTS idx_workflow_instances_definition ON workflow_instances(workflow_definition_id);
      CREATE INDEX IF NOT EXISTS idx_workflow_instances_created ON workflow_instances(created_at);

      CREATE INDEX IF NOT EXISTS idx_department_coordination_campaign ON department_coordination(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_department_coordination_type ON department_coordination(coordination_type);
      CREATE INDEX IF NOT EXISTS idx_department_coordination_status ON department_coordination(status);
      CREATE INDEX IF NOT EXISTS idx_department_coordination_initiating ON department_coordination(initiating_department);
      CREATE INDEX IF NOT EXISTS idx_department_coordination_created ON department_coordination(created_at);

      CREATE INDEX IF NOT EXISTS idx_automated_decisions_campaign ON automated_decisions(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_automated_decisions_type ON automated_decisions(decision_type);
      CREATE INDEX IF NOT EXISTS idx_automated_decisions_status ON automated_decisions(implementation_status);
      CREATE INDEX IF NOT EXISTS idx_automated_decisions_rule ON automated_decisions(automation_rule_id);
      CREATE INDEX IF NOT EXISTS idx_automated_decisions_created ON automated_decisions(created_at);

      CREATE INDEX IF NOT EXISTS idx_automation_rules_type ON automation_rules(rule_type);
      CREATE INDEX IF NOT EXISTS idx_automation_rules_active ON automation_rules(is_active);
      CREATE INDEX IF NOT EXISTS idx_automation_rules_priority ON automation_rules(priority);

      CREATE INDEX IF NOT EXISTS idx_workflow_performance_definition ON workflow_performance(workflow_definition_id);
      CREATE INDEX IF NOT EXISTS idx_workflow_performance_campaign ON workflow_performance(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_workflow_performance_period ON workflow_performance(measurement_period_start, measurement_period_end);

      CREATE INDEX IF NOT EXISTS idx_inter_department_messages_campaign ON inter_department_messages(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_inter_department_messages_sender ON inter_department_messages(sender_department);
      CREATE INDEX IF NOT EXISTS idx_inter_department_messages_type ON inter_department_messages(message_type);
      CREATE INDEX IF NOT EXISTS idx_inter_department_messages_status ON inter_department_messages(status);
      CREATE INDEX IF NOT EXISTS idx_inter_department_messages_priority ON inter_department_messages(priority);
      CREATE INDEX IF NOT EXISTS idx_inter_department_messages_sent ON inter_department_messages(sent_at);
      CREATE INDEX IF NOT EXISTS idx_inter_department_messages_thread ON inter_department_messages(thread_id);

      CREATE INDEX IF NOT EXISTS idx_workflow_step_executions_instance ON workflow_step_executions(workflow_instance_id);
      CREATE INDEX IF NOT EXISTS idx_workflow_step_executions_status ON workflow_step_executions(status);
      CREATE INDEX IF NOT EXISTS idx_workflow_step_executions_department ON workflow_step_executions(assigned_department);

      CREATE INDEX IF NOT EXISTS idx_department_performance_campaign ON department_performance_metrics(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_department_performance_department ON department_performance_metrics(department_name);
      CREATE INDEX IF NOT EXISTS idx_department_performance_period ON department_performance_metrics(measurement_period_start, measurement_period_end);

      CREATE INDEX IF NOT EXISTS idx_workflow_system_config_campaign ON workflow_system_config(campaign_id);
    `);

    console.log('✅ Cabinet Workflow Automation schema initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Cabinet Workflow Automation schema:', error);
    throw error;
  }
}
