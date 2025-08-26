/**
 * WhoseApp Action Item Database Schema
 * Tables for action items, status updates, milestones, and character integration
 */

import { Pool } from 'pg';

export async function initializeActionItemSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Main Action Items Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS whoseapp_action_items (
        id VARCHAR(50) PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        assigned_character_id VARCHAR(50) NOT NULL,
        assigned_character_name VARCHAR(200),
        assigned_character_title VARCHAR(200),
        assigned_character_avatar TEXT,
        
        -- Action Classification
        action_type VARCHAR(50) NOT NULL DEFAULT 'other',
        priority VARCHAR(20) NOT NULL DEFAULT 'medium',
        status VARCHAR(50) NOT NULL DEFAULT 'assigned',
        
        -- Timeline
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        due_date TIMESTAMP,
        completed_at TIMESTAMP,
        estimated_duration INTEGER, -- in hours
        
        -- Progress
        progress_percentage INTEGER DEFAULT 0,
        
        -- Game Integration
        game_state_impact JSONB DEFAULT '[]'::jsonb,
        simulation_effects JSONB DEFAULT '[]'::jsonb,
        consequences JSONB DEFAULT '[]'::jsonb,
        
        -- Source Information
        source_type VARCHAR(50) NOT NULL DEFAULT 'leader_command',
        source_id VARCHAR(50), -- Cabinet decision ID, delegation rule ID, etc.
        
        -- Dependencies
        dependencies JSONB DEFAULT '[]'::jsonb, -- Array of action IDs
        blocked_by JSONB DEFAULT '[]'::jsonb, -- Array of action IDs
        
        -- Metadata
        tags JSONB DEFAULT '[]'::jsonb,
        confidentiality_level VARCHAR(20) DEFAULT 'public',
        department_ids JSONB DEFAULT '[]'::jsonb,
        related_mission_ids JSONB DEFAULT '[]'::jsonb,
        
        -- Audit
        created_by VARCHAR(50),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by VARCHAR(50)
      )
    `);

    // Action Status Updates Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS whoseapp_action_status_updates (
        id VARCHAR(50) PRIMARY KEY,
        action_id VARCHAR(50) NOT NULL REFERENCES whoseapp_action_items(id) ON DELETE CASCADE,
        character_id VARCHAR(50) NOT NULL,
        character_name VARCHAR(200) NOT NULL,
        update_type VARCHAR(50) NOT NULL DEFAULT 'progress',
        message TEXT NOT NULL,
        progress_percentage INTEGER,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        attachments JSONB DEFAULT '[]'::jsonb,
        game_state_changes JSONB DEFAULT '[]'::jsonb,
        
        -- Metadata
        is_automated BOOLEAN DEFAULT false,
        source_system VARCHAR(50),
        metadata JSONB DEFAULT '{}'::jsonb
      )
    `);

    // Action Milestones Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS whoseapp_action_milestones (
        id VARCHAR(50) PRIMARY KEY,
        action_id VARCHAR(50) NOT NULL REFERENCES whoseapp_action_items(id) ON DELETE CASCADE,
        title VARCHAR(300) NOT NULL,
        description TEXT,
        target_date TIMESTAMP NOT NULL,
        completed_date TIMESTAMP,
        is_completed BOOLEAN DEFAULT false,
        progress_percentage INTEGER DEFAULT 0,
        requirements JSONB DEFAULT '[]'::jsonb,
        
        -- Ordering and Dependencies
        sequence_order INTEGER DEFAULT 0,
        depends_on_milestone_ids JSONB DEFAULT '[]'::jsonb,
        
        -- Metadata
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Clarification Requests Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS whoseapp_clarification_requests (
        id VARCHAR(50) PRIMARY KEY,
        action_id VARCHAR(50) NOT NULL REFERENCES whoseapp_action_items(id) ON DELETE CASCADE,
        character_id VARCHAR(50) NOT NULL,
        character_name VARCHAR(200) NOT NULL,
        question TEXT NOT NULL,
        context TEXT,
        urgency VARCHAR(20) DEFAULT 'medium',
        requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Response
        response TEXT,
        responded_at TIMESTAMP,
        responded_by VARCHAR(50),
        response_method VARCHAR(50), -- 'whoseapp', 'direct', 'meeting', etc.
        
        -- Status
        status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'answered', 'escalated'
        escalated_to VARCHAR(50),
        escalated_at TIMESTAMP,
        
        -- Metadata
        is_urgent BOOLEAN DEFAULT false,
        auto_escalation_time TIMESTAMP,
        metadata JSONB DEFAULT '{}'::jsonb
      )
    `);

    // Action Report Backs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS whoseapp_action_report_backs (
        id VARCHAR(50) PRIMARY KEY,
        action_id VARCHAR(50) NOT NULL REFERENCES whoseapp_action_items(id) ON DELETE CASCADE,
        character_id VARCHAR(50) NOT NULL,
        character_name VARCHAR(200) NOT NULL,
        report_type VARCHAR(50) NOT NULL,
        summary TEXT NOT NULL,
        details TEXT NOT NULL,
        outcomes JSONB DEFAULT '[]'::jsonb,
        recommendations JSONB DEFAULT '[]'::jsonb,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        attachments JSONB DEFAULT '[]'::jsonb,
        game_state_changes JSONB DEFAULT '[]'::jsonb,
        
        -- Approval and Review
        requires_approval BOOLEAN DEFAULT false,
        approved_by VARCHAR(50),
        approved_at TIMESTAMP,
        approval_status VARCHAR(20) DEFAULT 'pending',
        
        -- Impact Assessment
        success_rating INTEGER, -- 1-10 scale
        impact_assessment TEXT,
        lessons_learned TEXT,
        
        -- Metadata
        is_final_report BOOLEAN DEFAULT false,
        follow_up_required BOOLEAN DEFAULT false,
        follow_up_actions JSONB DEFAULT '[]'::jsonb
      )
    `);

    // Action Attachments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS whoseapp_action_attachments (
        id VARCHAR(50) PRIMARY KEY,
        action_id VARCHAR(50) REFERENCES whoseapp_action_items(id) ON DELETE CASCADE,
        status_update_id VARCHAR(50) REFERENCES whoseapp_action_status_updates(id) ON DELETE CASCADE,
        report_back_id VARCHAR(50) REFERENCES whoseapp_action_report_backs(id) ON DELETE CASCADE,
        
        filename VARCHAR(500) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size INTEGER,
        url TEXT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        uploaded_by VARCHAR(50) NOT NULL,
        description TEXT,
        
        -- Security and Access
        confidentiality_level VARCHAR(20) DEFAULT 'public',
        access_list JSONB DEFAULT '[]'::jsonb,
        encryption_status VARCHAR(20) DEFAULT 'none',
        
        -- File Metadata
        mime_type VARCHAR(100),
        checksum VARCHAR(100),
        virus_scan_status VARCHAR(20) DEFAULT 'pending',
        virus_scan_date TIMESTAMP,
        
        -- Lifecycle
        is_active BOOLEAN DEFAULT true,
        archived_at TIMESTAMP,
        retention_date TIMESTAMP
      )
    `);

    // Action Dependencies Table (for complex dependency tracking)
    await client.query(`
      CREATE TABLE IF NOT EXISTS whoseapp_action_dependencies (
        id VARCHAR(50) PRIMARY KEY,
        dependent_action_id VARCHAR(50) NOT NULL REFERENCES whoseapp_action_items(id) ON DELETE CASCADE,
        prerequisite_action_id VARCHAR(50) NOT NULL REFERENCES whoseapp_action_items(id) ON DELETE CASCADE,
        dependency_type VARCHAR(50) DEFAULT 'completion', -- 'completion', 'milestone', 'approval'
        specific_milestone_id VARCHAR(50) REFERENCES whoseapp_action_milestones(id),
        
        -- Dependency Rules
        is_blocking BOOLEAN DEFAULT true,
        can_start_parallel BOOLEAN DEFAULT false,
        minimum_progress_required INTEGER DEFAULT 100, -- percentage
        
        -- Status
        is_satisfied BOOLEAN DEFAULT false,
        satisfied_at TIMESTAMP,
        
        -- Metadata
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
      )
    `);

    // Game State Integration Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS whoseapp_game_state_changes (
        id VARCHAR(50) PRIMARY KEY,
        action_id VARCHAR(50) REFERENCES whoseapp_action_items(id) ON DELETE CASCADE,
        status_update_id VARCHAR(50) REFERENCES whoseapp_action_status_updates(id) ON DELETE CASCADE,
        report_back_id VARCHAR(50) REFERENCES whoseapp_action_report_backs(id) ON DELETE CASCADE,
        
        -- Change Details
        category VARCHAR(100) NOT NULL,
        subcategory VARCHAR(100) NOT NULL,
        previous_value DECIMAL(15,2),
        new_value DECIMAL(15,2),
        change_amount DECIMAL(15,2),
        change_percentage DECIMAL(8,4),
        
        -- Timing
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        effective_date TIMESTAMP,
        expiration_date TIMESTAMP,
        
        -- Description and Context
        description TEXT NOT NULL,
        change_reason TEXT,
        triggered_by VARCHAR(50), -- character_id or system
        
        -- Validation and Approval
        is_validated BOOLEAN DEFAULT false,
        validated_by VARCHAR(50),
        validated_at TIMESTAMP,
        
        -- Simulation Integration
        simulation_run_id VARCHAR(50),
        ai_confidence_score DECIMAL(3,2), -- 0.00 to 1.00
        
        -- Rollback Support
        is_reversible BOOLEAN DEFAULT true,
        rollback_action_id VARCHAR(50),
        rollback_data JSONB
      )
    `);

    // Auto-Delegation Rules Table (for Cabinet integration)
    await client.query(`
      CREATE TABLE IF NOT EXISTS whoseapp_auto_delegation_rules (
        id VARCHAR(50) PRIMARY KEY,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        name VARCHAR(200) NOT NULL,
        description TEXT,
        
        -- Rule Conditions
        decision_categories JSONB DEFAULT '[]'::jsonb, -- Array of cabinet decision categories
        priority_levels JSONB DEFAULT '[]'::jsonb, -- Array of priority levels
        department_ids JSONB DEFAULT '[]'::jsonb, -- Array of department IDs
        value_thresholds JSONB DEFAULT '{}'::jsonb, -- Min/max values for auto-approval
        
        -- Delegation Target
        target_character_id VARCHAR(50) NOT NULL,
        target_character_name VARCHAR(200),
        target_department_id VARCHAR(50),
        delegation_level VARCHAR(50) DEFAULT 'operational', -- 'operational', 'tactical', 'strategic'
        
        -- Rule Behavior
        auto_start BOOLEAN DEFAULT false,
        requires_confirmation BOOLEAN DEFAULT true,
        escalation_threshold INTEGER DEFAULT 48, -- hours before escalation
        
        -- Approval Limits
        max_budget_amount DECIMAL(15,2),
        max_duration_hours INTEGER,
        max_personnel_count INTEGER,
        
        -- Status and Control
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(50),
        last_used_at TIMESTAMP,
        usage_count INTEGER DEFAULT 0,
        
        -- Review and Audit
        review_required_at TIMESTAMP,
        last_reviewed_at TIMESTAMP,
        last_reviewed_by VARCHAR(50),
        success_rate DECIMAL(5,2) DEFAULT 0.00, -- percentage
        
        -- Metadata
        tags JSONB DEFAULT '[]'::jsonb,
        metadata JSONB DEFAULT '{}'::jsonb
      )
    `);

    // Character Workload Tracking Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS whoseapp_character_workloads (
        id VARCHAR(50) PRIMARY KEY,
        character_id VARCHAR(50) NOT NULL,
        civilization_id TEXT NOT NULL REFERENCES civilizations(id),
        
        -- Current Workload
        active_actions_count INTEGER DEFAULT 0,
        total_estimated_hours DECIMAL(8,2) DEFAULT 0.00,
        overdue_actions_count INTEGER DEFAULT 0,
        high_priority_actions_count INTEGER DEFAULT 0,
        
        -- Capacity and Availability
        max_concurrent_actions INTEGER DEFAULT 5,
        working_hours_per_day DECIMAL(4,2) DEFAULT 8.00,
        availability_percentage DECIMAL(5,2) DEFAULT 100.00,
        
        -- Performance Metrics
        completion_rate DECIMAL(5,2) DEFAULT 0.00, -- percentage
        average_completion_time DECIMAL(8,2) DEFAULT 0.00, -- hours
        quality_score DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 1.00
        
        -- Status
        current_status VARCHAR(50) DEFAULT 'available', -- 'available', 'busy', 'overloaded', 'unavailable'
        last_action_assigned_at TIMESTAMP,
        last_action_completed_at TIMESTAMP,
        
        -- Timestamps
        calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Metadata
        notes TEXT,
        metadata JSONB DEFAULT '{}'::jsonb,
        
        UNIQUE(character_id, civilization_id)
      )
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_action_items_civilization_status 
      ON whoseapp_action_items(civilization_id, status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_action_items_assigned_character 
      ON whoseapp_action_items(assigned_character_id, status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_action_items_due_date 
      ON whoseapp_action_items(due_date) WHERE due_date IS NOT NULL;
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_action_items_priority_status 
      ON whoseapp_action_items(priority, status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_action_items_source 
      ON whoseapp_action_items(source_type, source_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_status_updates_action_timestamp 
      ON whoseapp_action_status_updates(action_id, timestamp DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_clarification_requests_status 
      ON whoseapp_clarification_requests(status, urgency);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_game_state_changes_action 
      ON whoseapp_game_state_changes(action_id, timestamp DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_auto_delegation_rules_active 
      ON whoseapp_auto_delegation_rules(is_active, civilization_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_character_workloads_character 
      ON whoseapp_character_workloads(character_id, updated_at DESC);
    `);

    // Create triggers for automatic updates
    await client.query(`
      CREATE OR REPLACE FUNCTION update_action_item_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      CREATE TRIGGER trigger_update_action_item_timestamp
      BEFORE UPDATE ON whoseapp_action_items
      FOR EACH ROW EXECUTE FUNCTION update_action_item_timestamp();
    `);

    // Function to automatically update character workloads
    await client.query(`
      CREATE OR REPLACE FUNCTION update_character_workload()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Update workload when action status changes
        INSERT INTO whoseapp_character_workloads (
          character_id, civilization_id, active_actions_count, 
          total_estimated_hours, overdue_actions_count, high_priority_actions_count,
          calculated_at, updated_at
        )
        SELECT 
          NEW.assigned_character_id,
          NEW.civilization_id,
          COUNT(*) FILTER (WHERE status IN ('assigned', 'in_progress', 'awaiting_clarification')),
          COALESCE(SUM(estimated_duration) FILTER (WHERE status IN ('assigned', 'in_progress', 'awaiting_clarification')), 0),
          COUNT(*) FILTER (WHERE status IN ('assigned', 'in_progress', 'awaiting_clarification') AND due_date < CURRENT_TIMESTAMP),
          COUNT(*) FILTER (WHERE status IN ('assigned', 'in_progress', 'awaiting_clarification') AND priority IN ('high', 'critical', 'urgent')),
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        FROM whoseapp_action_items 
        WHERE assigned_character_id = NEW.assigned_character_id 
          AND civilization_id = NEW.civilization_id
        ON CONFLICT (character_id, civilization_id) 
        DO UPDATE SET
          active_actions_count = EXCLUDED.active_actions_count,
          total_estimated_hours = EXCLUDED.total_estimated_hours,
          overdue_actions_count = EXCLUDED.overdue_actions_count,
          high_priority_actions_count = EXCLUDED.high_priority_actions_count,
          updated_at = CURRENT_TIMESTAMP;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      CREATE TRIGGER trigger_update_character_workload
      AFTER INSERT OR UPDATE ON whoseapp_action_items
      FOR EACH ROW EXECUTE FUNCTION update_character_workload();
    `);

    await client.query('COMMIT');
    console.log('✅ WhoseApp Action Item schema initialized successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to initialize WhoseApp Action Item schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Helper function to create sample data for development
export async function createSampleActionItems(pool: Pool, civilizationId: string): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Sample action items
    const sampleActions = [
      {
        id: 'action_001',
        title: 'Negotiate Trade Agreement with Zephyrian Empire',
        description: 'Establish comprehensive trade relations focusing on rare minerals and advanced technology exchange',
        assignedCharacterId: 'char_diplomat_001',
        actionType: 'diplomatic_mission',
        priority: 'high',
        status: 'in_progress',
        estimatedDuration: 120,
        progressPercentage: 65,
        sourceType: 'leader_command',
        tags: ['diplomacy', 'trade', 'zephyrian'],
        confidentialityLevel: 'restricted',
        departmentIds: ['dept_foreign_affairs']
      },
      {
        id: 'action_002',
        title: 'Implement Emergency Economic Stimulus Package',
        description: 'Deploy immediate financial relief measures to counter recent market volatility',
        assignedCharacterId: 'char_economist_001',
        actionType: 'economic_policy',
        priority: 'critical',
        status: 'awaiting_clarification',
        estimatedDuration: 48,
        progressPercentage: 30,
        sourceType: 'cabinet_decision',
        sourceId: 'cabinet_decision_045',
        tags: ['economy', 'stimulus', 'emergency'],
        confidentialityLevel: 'classified',
        departmentIds: ['dept_treasury', 'dept_economic_affairs']
      }
    ];

    for (const action of sampleActions) {
      await client.query(`
        INSERT INTO whoseapp_action_items (
          id, civilization_id, title, description, assigned_character_id,
          action_type, priority, status, estimated_duration, progress_percentage,
          source_type, source_id, tags, confidentiality_level, department_ids,
          created_at, assigned_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (id) DO NOTHING
      `, [
        action.id, civilizationId, action.title, action.description, action.assignedCharacterId,
        action.actionType, action.priority, action.status, action.estimatedDuration, action.progressPercentage,
        action.sourceType, action.sourceId || null, JSON.stringify(action.tags), 
        action.confidentialityLevel, JSON.stringify(action.departmentIds),
        new Date(), new Date()
      ]);
    }

    // Sample status updates
    await client.query(`
      INSERT INTO whoseapp_action_status_updates (
        id, action_id, character_id, character_name, update_type, message, progress_percentage
      ) VALUES 
      ('update_001', 'action_001', 'char_diplomat_001', 'Ambassador Elena Vasquez', 'progress', 
       'Initial negotiations completed. Zephyrian delegation is receptive to our proposals.', 65),
      ('update_002', 'action_002', 'char_economist_001', 'Dr. Marcus Chen', 'obstacle_encountered',
       'Need clarification on budget allocation limits before proceeding with stimulus design.', 30)
      ON CONFLICT (id) DO NOTHING
    `);

    // Sample clarification request
    await client.query(`
      INSERT INTO whoseapp_clarification_requests (
        id, action_id, character_id, character_name, question, context, urgency
      ) VALUES (
        'clarif_001', 'action_002', 'char_economist_001', 'Dr. Marcus Chen',
        'What is the maximum budget allocation approved for this stimulus package?',
        'Need to determine scope of relief measures and target demographics', 'high'
      )
      ON CONFLICT (id) DO NOTHING
    `);

    // Sample auto-delegation rule
    await client.query(`
      INSERT INTO whoseapp_auto_delegation_rules (
        id, civilization_id, name, description, decision_categories, priority_levels,
        target_character_id, target_character_name, delegation_level, auto_start,
        max_budget_amount, max_duration_hours
      ) VALUES (
        'rule_001', $1, 'Economic Emergency Response', 
        'Auto-delegate economic emergency responses to Economic Policy Director',
        '["economic_policy", "emergency_response"]', '["high", "critical", "urgent"]',
        'char_economist_001', 'Dr. Marcus Chen', 'operational', true,
        1000000.00, 72
      )
      ON CONFLICT (id) DO NOTHING
    `, [civilizationId]);

    await client.query('COMMIT');
    console.log('✅ Sample action items created successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to create sample action items:', error);
    throw error;
  } finally {
    client.release();
  }
}

export default { initializeActionItemSchema, createSampleActionItems };

