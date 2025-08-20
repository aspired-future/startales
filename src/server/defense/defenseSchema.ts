import { Pool } from 'pg';

export async function initializeDefenseSchema(client: Pool): Promise<void> {
  console.log('🛡️ Initializing Defense Secretary schema...');

  try {
    // Military Operations Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS military_operations (
        id TEXT PRIMARY KEY,
        campaign_id INT NOT NULL,
        
        -- Operation Details
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('defensive', 'offensive', 'peacekeeping', 'humanitarian', 'training', 'intelligence')),
        classification TEXT NOT NULL DEFAULT 'routine' CHECK (classification IN ('routine', 'sensitive', 'classified', 'top-secret')),
        objective TEXT NOT NULL,
        description TEXT,
        
        -- Priority & Urgency
        priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        urgency TEXT NOT NULL DEFAULT 'routine' CHECK (urgency IN ('routine', 'urgent', 'immediate', 'emergency')),
        
        -- Forces & Resources
        assigned_units JSONB NOT NULL DEFAULT '[]',
        commander_assigned TEXT,
        estimated_duration NUMERIC NOT NULL DEFAULT 24, -- hours
        budget_allocated NUMERIC NOT NULL DEFAULT 0,
        resource_requirements JSONB NOT NULL DEFAULT '[]',
        
        -- Authorization Chain
        requested_by TEXT NOT NULL,
        authorized_by TEXT,
        approved_by TEXT,
        secretary_approval BOOLEAN NOT NULL DEFAULT false,
        leader_approval BOOLEAN NOT NULL DEFAULT false,
        
        -- Timeline
        planned_start TIMESTAMP NOT NULL DEFAULT NOW(),
        actual_start TIMESTAMP,
        planned_end TIMESTAMP NOT NULL,
        actual_end TIMESTAMP,
        
        -- Status & Progress
        status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'authorized', 'active', 'completed', 'cancelled', 'suspended')),
        progress NUMERIC NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
        
        -- Risk Assessment
        risk_level TEXT NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'extreme')),
        risk_factors JSONB NOT NULL DEFAULT '[]',
        contingency_plans JSONB NOT NULL DEFAULT '[]',
        
        -- Success Metrics
        success_criteria JSONB NOT NULL DEFAULT '[]',
        current_results JSONB,
        
        -- Metadata
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Defense Orders Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS defense_orders (
        id TEXT PRIMARY KEY,
        campaign_id INT NOT NULL,
        secretary_id TEXT NOT NULL,
        
        -- Order Details
        order_type TEXT NOT NULL CHECK (order_type IN ('deployment', 'mission', 'readiness-change', 'procurement', 'training', 'strategic-directive')),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        priority TEXT NOT NULL DEFAULT 'routine' CHECK (priority IN ('routine', 'urgent', 'immediate', 'emergency')),
        classification TEXT NOT NULL DEFAULT 'unclassified' CHECK (classification IN ('unclassified', 'confidential', 'secret', 'top-secret')),
        
        -- Recipients
        target_units JSONB NOT NULL DEFAULT '[]',
        target_commanders JSONB NOT NULL DEFAULT '[]',
        target_departments JSONB NOT NULL DEFAULT '[]',
        
        -- Order Content
        instructions TEXT NOT NULL,
        parameters JSONB NOT NULL DEFAULT '{}',
        constraints JSONB NOT NULL DEFAULT '[]',
        success_criteria JSONB NOT NULL DEFAULT '[]',
        
        -- Timeline
        issued_at TIMESTAMP NOT NULL DEFAULT NOW(),
        effective_at TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP,
        
        -- Status Tracking
        status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('draft', 'issued', 'acknowledged', 'in-progress', 'completed', 'cancelled')),
        
        -- Budget Impact
        budget_impact NUMERIC NOT NULL DEFAULT 0,
        budget_approved BOOLEAN NOT NULL DEFAULT false,
        
        -- Metadata
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Order Acknowledgments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_acknowledgments (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL REFERENCES defense_orders(id) ON DELETE CASCADE,
        unit_id TEXT NOT NULL,
        commander_id TEXT NOT NULL,
        
        -- Acknowledgment Details
        acknowledged_at TIMESTAMP NOT NULL DEFAULT NOW(),
        estimated_completion TIMESTAMP,
        notes TEXT,
        
        -- Status
        status TEXT NOT NULL DEFAULT 'acknowledged' CHECK (status IN ('acknowledged', 'in-progress', 'completed', 'delayed')),
        
        -- Metadata
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        
        UNIQUE(order_id, unit_id)
      );
    `);

    // Force Deployments Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS force_deployments (
        id TEXT PRIMARY KEY,
        campaign_id INT NOT NULL,
        operation_id TEXT REFERENCES military_operations(id),
        
        -- Deployment Details
        unit_ids JSONB NOT NULL DEFAULT '[]',
        destination TEXT NOT NULL,
        mission_type TEXT NOT NULL,
        duration_hours NUMERIC NOT NULL DEFAULT 24,
        rules_of_engagement JSONB NOT NULL DEFAULT '[]',
        
        -- Timeline
        deployment_start TIMESTAMP NOT NULL DEFAULT NOW(),
        estimated_arrival TIMESTAMP NOT NULL,
        actual_arrival TIMESTAMP,
        deployment_end TIMESTAMP,
        
        -- Status
        status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'deploying', 'deployed', 'returning', 'completed', 'cancelled')),
        
        -- Authorization
        authorized_by TEXT NOT NULL,
        
        -- Metadata
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Military Procurement Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS military_procurement (
        id TEXT PRIMARY KEY,
        campaign_id INT NOT NULL,
        
        -- Procurement Details
        equipment_type TEXT NOT NULL,
        quantity NUMERIC NOT NULL,
        unit_price NUMERIC NOT NULL,
        total_cost NUMERIC NOT NULL,
        vendor TEXT NOT NULL,
        
        -- Justification & Priority
        justification TEXT NOT NULL,
        urgency TEXT NOT NULL DEFAULT 'routine' CHECK (urgency IN ('routine', 'urgent', 'emergency')),
        
        -- Timeline
        requested_date TIMESTAMP NOT NULL DEFAULT NOW(),
        approved_date TIMESTAMP,
        delivery_date TIMESTAMP,
        received_date TIMESTAMP,
        
        -- Budget Integration
        line_item_id TEXT, -- Links to Treasury line item
        budget_reserved NUMERIC NOT NULL DEFAULT 0,
        
        -- Status
        status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'ordered', 'delivered', 'received', 'cancelled')),
        
        -- Authorization
        requested_by TEXT NOT NULL,
        approved_by TEXT,
        
        -- Metadata
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Unit Orders Tracking Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS unit_orders (
        id TEXT PRIMARY KEY,
        unit_id TEXT NOT NULL,
        order_id TEXT NOT NULL REFERENCES defense_orders(id) ON DELETE CASCADE,
        
        -- Order Status for this Unit
        status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'acknowledged', 'in-progress', 'completed', 'failed')),
        
        -- Timeline
        received_at TIMESTAMP NOT NULL DEFAULT NOW(),
        acknowledged_at TIMESTAMP,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        
        -- Progress & Results
        progress NUMERIC NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
        results JSONB,
        notes TEXT,
        
        -- Metadata
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        
        UNIQUE(unit_id, order_id)
      );
    `);

    // Defense Readiness Reports Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS defense_readiness_reports (
        id TEXT PRIMARY KEY,
        campaign_id INT NOT NULL,
        
        -- Report Details
        report_date TIMESTAMP NOT NULL DEFAULT NOW(),
        report_type TEXT NOT NULL DEFAULT 'standard' CHECK (report_type IN ('standard', 'emergency', 'detailed', 'summary')),
        
        -- Overall Assessment
        overall_readiness NUMERIC NOT NULL CHECK (overall_readiness >= 0 AND overall_readiness <= 100),
        readiness_level TEXT NOT NULL CHECK (readiness_level IN ('not-ready', 'limited', 'ready', 'high-ready', 'maximum')),
        
        -- Force Structure
        force_structure JSONB NOT NULL DEFAULT '{}',
        
        -- Capabilities Assessment
        capabilities JSONB NOT NULL DEFAULT '{}',
        
        -- Resource Status
        resources JSONB NOT NULL DEFAULT '{}',
        
        -- Strategic Assessment
        strategic JSONB NOT NULL DEFAULT '{}',
        
        -- Recommendations & Issues
        recommendations JSONB NOT NULL DEFAULT '[]',
        critical_issues JSONB NOT NULL DEFAULT '[]',
        warnings JSONB NOT NULL DEFAULT '[]',
        
        -- Budget Status
        budget_status JSONB NOT NULL DEFAULT '{}',
        
        -- Report Metadata
        generated_by TEXT NOT NULL,
        classification TEXT NOT NULL DEFAULT 'confidential' CHECK (classification IN ('unclassified', 'confidential', 'secret', 'top-secret')),
        
        -- Metadata
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Intelligence Reports Table (Defense-specific)
    await client.query(`
      CREATE TABLE IF NOT EXISTS intelligence_reports (
        id TEXT PRIMARY KEY,
        campaign_id INT NOT NULL,
        
        -- Report Details
        report_type TEXT NOT NULL CHECK (report_type IN ('threat-assessment', 'enemy-analysis', 'capability-assessment', 'strategic-intelligence')),
        classification TEXT NOT NULL DEFAULT 'secret' CHECK (classification IN ('confidential', 'secret', 'top-secret')),
        
        -- Intelligence Content
        threat_level TEXT CHECK (threat_level IN ('low', 'medium', 'high', 'critical')),
        confidence NUMERIC CHECK (confidence >= 0 AND confidence <= 1),
        summary TEXT NOT NULL,
        details JSONB NOT NULL DEFAULT '{}',
        
        -- Source Information
        source_type TEXT NOT NULL CHECK (source_type IN ('human', 'signals', 'imagery', 'technical', 'open-source')),
        source_reliability NUMERIC CHECK (source_reliability >= 0 AND source_reliability <= 1),
        
        -- Analysis
        key_findings JSONB NOT NULL DEFAULT '[]',
        implications JSONB NOT NULL DEFAULT '[]',
        recommendations JSONB NOT NULL DEFAULT '[]',
        
        -- Timeline
        intelligence_date TIMESTAMP NOT NULL,
        report_date TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP,
        
        -- Authorization
        analyst_id TEXT NOT NULL,
        reviewed_by TEXT,
        approved_by TEXT,
        
        -- Metadata
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Defense Secretary Authority Log Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS defense_authority_log (
        id TEXT PRIMARY KEY,
        campaign_id INT NOT NULL,
        secretary_id TEXT NOT NULL,
        
        -- Action Details
        action_type TEXT NOT NULL CHECK (action_type IN ('operation-authorization', 'force-deployment', 'order-issuance', 'procurement-approval', 'readiness-change')),
        action_description TEXT NOT NULL,
        
        -- Target Information
        target_type TEXT CHECK (target_type IN ('unit', 'operation', 'order', 'procurement', 'system')),
        target_id TEXT,
        
        -- Authorization Details
        authorization_level TEXT NOT NULL CHECK (authorization_level IN ('secretary', 'treasury-approved', 'leader-approved')),
        budget_impact NUMERIC NOT NULL DEFAULT 0,
        
        -- Decision Context
        justification TEXT,
        risk_assessment TEXT,
        expected_outcome TEXT,
        
        -- Results (filled in later)
        actual_outcome TEXT,
        success_rating NUMERIC CHECK (success_rating >= 0 AND success_rating <= 100),
        
        -- Metadata
        action_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_military_operations_campaign ON military_operations(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_military_operations_status ON military_operations(status);
      CREATE INDEX IF NOT EXISTS idx_military_operations_priority ON military_operations(priority);
      
      CREATE INDEX IF NOT EXISTS idx_defense_orders_campaign ON defense_orders(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_defense_orders_secretary ON defense_orders(secretary_id);
      CREATE INDEX IF NOT EXISTS idx_defense_orders_status ON defense_orders(status);
      
      CREATE INDEX IF NOT EXISTS idx_force_deployments_campaign ON force_deployments(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_force_deployments_operation ON force_deployments(operation_id);
      CREATE INDEX IF NOT EXISTS idx_force_deployments_status ON force_deployments(status);
      
      CREATE INDEX IF NOT EXISTS idx_military_procurement_campaign ON military_procurement(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_military_procurement_status ON military_procurement(status);
      
      CREATE INDEX IF NOT EXISTS idx_unit_orders_unit ON unit_orders(unit_id);
      CREATE INDEX IF NOT EXISTS idx_unit_orders_order ON unit_orders(order_id);
      
      CREATE INDEX IF NOT EXISTS idx_readiness_reports_campaign ON defense_readiness_reports(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_readiness_reports_date ON defense_readiness_reports(report_date);
      
      CREATE INDEX IF NOT EXISTS idx_intelligence_reports_campaign ON intelligence_reports(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_intelligence_reports_type ON intelligence_reports(report_type);
      CREATE INDEX IF NOT EXISTS idx_intelligence_reports_threat ON intelligence_reports(threat_level);
      
      CREATE INDEX IF NOT EXISTS idx_authority_log_campaign ON defense_authority_log(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_authority_log_secretary ON defense_authority_log(secretary_id);
      CREATE INDEX IF NOT EXISTS idx_authority_log_action ON defense_authority_log(action_type);
    `);

    console.log('✅ Defense Secretary schema initialized successfully');

  } catch (error) {
    console.error('❌ Failed to initialize Defense Secretary schema:', error);
    throw error;
  }
}

// Seed initial Defense Secretary data
export async function seedDefenseSecretaryData(client: Pool, campaignId: number): Promise<void> {
  console.log('🌱 Seeding Defense Secretary data...');

  try {
    // Create sample military operations
    const operations = [
      {
        id: 'op-defense-border-patrol',
        name: 'Border Security Patrol',
        type: 'defensive',
        classification: 'routine',
        objective: 'Maintain border security and monitor for threats',
        description: 'Regular patrol operations along territorial borders',
        priority: 'medium',
        urgency: 'routine',
        estimatedDuration: 168, // 1 week
        budgetAllocated: 25000,
        requestedBy: 'ai-commander-border',
        authorizedBy: 'ai-secretary-defense'
      },
      {
        id: 'op-defense-training-exercise',
        name: 'Joint Training Exercise Alpha',
        type: 'training',
        classification: 'routine',
        objective: 'Enhance inter-unit coordination and combat readiness',
        description: 'Multi-domain training exercise involving land, air, and space units',
        priority: 'high',
        urgency: 'routine',
        estimatedDuration: 72, // 3 days
        budgetAllocated: 45000,
        requestedBy: 'ai-commander-training',
        authorizedBy: 'ai-secretary-defense'
      },
      {
        id: 'op-defense-intelligence-gathering',
        name: 'Strategic Intelligence Collection',
        type: 'intelligence',
        classification: 'classified',
        objective: 'Gather intelligence on potential threats and enemy capabilities',
        description: 'Coordinated intelligence gathering operation using multiple assets',
        priority: 'high',
        urgency: 'urgent',
        estimatedDuration: 240, // 10 days
        budgetAllocated: 75000,
        requestedBy: 'ai-commander-intelligence',
        authorizedBy: 'ai-secretary-defense'
      }
    ];

    for (const op of operations) {
      await client.query(`
        INSERT INTO military_operations (
          id, campaign_id, name, type, classification, objective, description,
          priority, urgency, estimated_duration, budget_allocated, 
          requested_by, authorized_by, secretary_approval, status,
          planned_start, planned_end
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true, 'authorized',
          NOW(), NOW() + INTERVAL '${op.estimatedDuration} hours'
        )
        ON CONFLICT (id) DO NOTHING
      `, [
        op.id, campaignId, op.name, op.type, op.classification, op.objective,
        op.description, op.priority, op.urgency, op.estimatedDuration,
        op.budgetAllocated, op.requestedBy, op.authorizedBy
      ]);
    }

    // Create sample defense orders
    const orders = [
      {
        id: 'order-defense-readiness-increase',
        secretaryId: 'ai-secretary-defense',
        orderType: 'readiness-change',
        title: 'Increase Military Readiness to DEFCON 3',
        description: 'All units increase readiness posture due to elevated threat assessment',
        priority: 'urgent',
        classification: 'confidential',
        instructions: 'Increase readiness level, conduct equipment checks, prepare for potential deployment',
        budgetImpact: 15000
      },
      {
        id: 'order-defense-equipment-maintenance',
        secretaryId: 'ai-secretary-defense',
        orderType: 'training',
        title: 'Accelerated Equipment Maintenance Schedule',
        description: 'Implement enhanced maintenance protocols for all critical systems',
        priority: 'medium',
        classification: 'unclassified',
        instructions: 'Conduct comprehensive maintenance checks on all primary systems within 48 hours',
        budgetImpact: 8000
      }
    ];

    for (const order of orders) {
      await client.query(`
        INSERT INTO defense_orders (
          id, campaign_id, secretary_id, order_type, title, description,
          priority, classification, instructions, budget_impact, status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'issued'
        )
        ON CONFLICT (id) DO NOTHING
      `, [
        order.id, campaignId, order.secretaryId, order.orderType, order.title,
        order.description, order.priority, order.classification, 
        order.instructions, order.budgetImpact
      ]);
    }

    // Create sample intelligence report
    await client.query(`
      INSERT INTO intelligence_reports (
        id, campaign_id, report_type, classification, threat_level, confidence,
        summary, source_type, source_reliability, intelligence_date, analyst_id
      ) VALUES (
        'intel-defense-threat-assessment-001', $1, 'threat-assessment', 'secret', 'medium', 0.75,
        'Regional threat assessment indicates moderate increase in hostile activity along eastern borders. Recommend increased patrol frequency and intelligence gathering.',
        'signals', 0.8, NOW() - INTERVAL '2 hours', 'ai-analyst-defense'
      )
      ON CONFLICT (id) DO NOTHING
    `, [campaignId]);

    // Create initial readiness report
    await client.query(`
      INSERT INTO defense_readiness_reports (
        id, campaign_id, overall_readiness, readiness_level,
        force_structure, capabilities, resources, strategic,
        generated_by, classification
      ) VALUES (
        'readiness-report-001', $1, 78, 'ready',
        '{"totalUnits": 24, "readyUnits": 19, "deployedUnits": 3}',
        '{"offensiveCapability": 75, "defensiveCapability": 82, "mobilityCapability": 70}',
        '{"personnelStrength": 85, "equipmentReadiness": 78, "supplyLevels": 72}',
        '{"threatLevel": "medium", "militaryPosture": "defensive", "operationalTempo": "Medium"}',
        'ai-secretary-defense', 'confidential'
      )
      ON CONFLICT (id) DO NOTHING
    `, [campaignId]);

    console.log('✅ Defense Secretary data seeded successfully');

  } catch (error) {
    console.error('❌ Failed to seed Defense Secretary data:', error);
    throw error;
  }
}
