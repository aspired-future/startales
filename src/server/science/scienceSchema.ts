import { Pool } from 'pg';

/**
 * Initialize Science Secretary database schema
 */
export async function initializeScienceSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Science Operations - Core operational activities
    await client.query(`
      CREATE TABLE IF NOT EXISTS science_operations (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        operation_type TEXT NOT NULL CHECK (operation_type IN (
          'policy_implementation', 'budget_allocation', 'priority_setting',
          'program_launch', 'research_review', 'technology_assessment',
          'collaboration_agreement', 'ethics_review', 'strategic_planning'
        )),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN (
          'planned', 'in_progress', 'completed', 'cancelled', 'on_hold'
        )),
        priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN (
          'low', 'medium', 'high', 'critical'
        )),
        
        -- Operation Details
        operation_data JSONB NOT NULL DEFAULT '{}',
        target_technologies TEXT[] DEFAULT '{}',
        affected_institutions TEXT[] DEFAULT '{}',
        budget_impact DECIMAL(15,2) DEFAULT 0.00,
        
        -- Timeline
        planned_start_date TIMESTAMP,
        actual_start_date TIMESTAMP,
        planned_completion_date TIMESTAMP,
        actual_completion_date TIMESTAMP,
        
        -- Results and Impact
        success_metrics JSONB DEFAULT '{}',
        actual_outcomes JSONB DEFAULT '{}',
        lessons_learned TEXT,
        
        -- Approval and Authorization
        authorized_by TEXT NOT NULL,
        approval_level TEXT NOT NULL DEFAULT 'secretary' CHECK (approval_level IN (
          'secretary', 'deputy', 'director', 'leader'
        )),
        
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Research Budgets - R&D budget allocation and tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS research_budgets (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        fiscal_year INTEGER NOT NULL,
        budget_category TEXT NOT NULL CHECK (budget_category IN (
          'basic_research', 'applied_research', 'development',
          'infrastructure', 'personnel', 'equipment', 'facilities',
          'international_collaboration', 'technology_transfer', 'innovation_programs'
        )),
        
        -- Budget Allocation
        allocated_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        committed_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        spent_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        remaining_amount DECIMAL(15,2) GENERATED ALWAYS AS (allocated_amount - spent_amount) STORED,
        
        -- Performance Metrics
        expected_outcomes JSONB DEFAULT '{}',
        actual_outcomes JSONB DEFAULT '{}',
        roi_target DECIMAL(5,2) DEFAULT 0.00,
        roi_actual DECIMAL(5,2) DEFAULT 0.00,
        
        -- Budget Constraints and Conditions
        funding_source TEXT NOT NULL DEFAULT 'general_fund',
        spending_restrictions JSONB DEFAULT '{}',
        performance_requirements JSONB DEFAULT '{}',
        reporting_requirements JSONB DEFAULT '{}',
        
        -- Multi-year Planning
        multi_year_commitment BOOLEAN DEFAULT FALSE,
        commitment_years INTEGER DEFAULT 1,
        future_year_allocations JSONB DEFAULT '{}',
        
        -- Approval and Tracking
        approved_by TEXT NOT NULL,
        approval_date TIMESTAMP NOT NULL DEFAULT NOW(),
        last_review_date TIMESTAMP,
        next_review_date TIMESTAMP,
        
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        
        UNIQUE(campaign_id, fiscal_year, budget_category)
      )
    `);

    // Research Priorities - Government research focus areas
    await client.query(`
      CREATE TABLE IF NOT EXISTS research_priorities (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        priority_name TEXT NOT NULL,
        priority_category TEXT NOT NULL CHECK (priority_category IN (
          'national_security', 'economic_development', 'health_medicine',
          'environmental', 'energy', 'space_exploration', 'basic_science',
          'emerging_technologies', 'social_challenges', 'infrastructure'
        )),
        
        -- Priority Details
        description TEXT NOT NULL,
        strategic_importance INTEGER NOT NULL CHECK (strategic_importance >= 1 AND strategic_importance <= 10),
        urgency_level TEXT NOT NULL DEFAULT 'medium' CHECK (urgency_level IN (
          'low', 'medium', 'high', 'critical'
        )),
        
        -- Resource Allocation
        budget_allocation_percentage DECIMAL(5,2) DEFAULT 0.00,
        personnel_allocation INTEGER DEFAULT 0,
        facility_requirements JSONB DEFAULT '{}',
        equipment_needs JSONB DEFAULT '{}',
        
        -- Timeline and Milestones
        target_timeline_years INTEGER DEFAULT 5,
        key_milestones JSONB DEFAULT '[]',
        success_criteria JSONB DEFAULT '{}',
        
        -- Technology Focus
        target_technologies TEXT[] DEFAULT '{}',
        related_research_areas TEXT[] DEFAULT '{}',
        international_collaboration_opportunities TEXT[] DEFAULT '{}',
        
        -- Impact Assessment
        expected_economic_impact DECIMAL(15,2) DEFAULT 0.00,
        expected_social_impact TEXT,
        expected_security_impact TEXT,
        risk_assessment JSONB DEFAULT '{}',
        
        -- Status and Review
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
          'active', 'under_review', 'completed', 'cancelled', 'on_hold'
        )),
        last_review_date TIMESTAMP,
        next_review_date TIMESTAMP,
        
        -- Authorization
        set_by TEXT NOT NULL,
        approved_by TEXT NOT NULL,
        
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Innovation Programs - Government innovation initiatives
    await client.query(`
      CREATE TABLE IF NOT EXISTS innovation_programs (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        program_name TEXT NOT NULL,
        program_type TEXT NOT NULL CHECK (program_type IN (
          'incubator', 'accelerator', 'grant_program', 'tax_incentive',
          'public_private_partnership', 'technology_transfer', 'startup_support',
          'research_collaboration', 'innovation_challenge', 'pilot_program'
        )),
        
        -- Program Details
        description TEXT NOT NULL,
        objectives JSONB NOT NULL DEFAULT '[]',
        target_sectors TEXT[] DEFAULT '{}',
        eligibility_criteria JSONB DEFAULT '{}',
        
        -- Program Resources
        total_budget DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        allocated_budget DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        spent_budget DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        participant_capacity INTEGER DEFAULT 0,
        current_participants INTEGER DEFAULT 0,
        
        -- Program Timeline
        program_duration_months INTEGER NOT NULL DEFAULT 12,
        application_deadline TIMESTAMP,
        program_start_date TIMESTAMP,
        program_end_date TIMESTAMP,
        
        -- Performance Metrics
        success_metrics JSONB DEFAULT '{}',
        current_performance JSONB DEFAULT '{}',
        participant_outcomes JSONB DEFAULT '{}',
        
        -- Program Management
        program_manager TEXT NOT NULL,
        partner_organizations TEXT[] DEFAULT '{}',
        advisory_board TEXT[] DEFAULT '{}',
        
        -- Status and Results
        status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN (
          'planning', 'recruiting', 'active', 'completed', 'cancelled', 'on_hold'
        )),
        completion_rate DECIMAL(5,2) DEFAULT 0.00,
        success_rate DECIMAL(5,2) DEFAULT 0.00,
        
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Scientific Policies - Research governance and regulations
    await client.query(`
      CREATE TABLE IF NOT EXISTS scientific_policies (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        policy_name TEXT NOT NULL,
        policy_category TEXT NOT NULL CHECK (policy_category IN (
          'research_ethics', 'data_governance', 'intellectual_property',
          'technology_export', 'international_collaboration', 'safety_standards',
          'environmental_compliance', 'human_subjects', 'animal_research',
          'dual_use_research', 'open_science', 'security_classification'
        )),
        
        -- Policy Content
        policy_description TEXT NOT NULL,
        policy_text TEXT NOT NULL,
        scope_of_application TEXT[] DEFAULT '{}',
        affected_institutions TEXT[] DEFAULT '{}',
        
        -- Implementation Details
        implementation_guidelines JSONB DEFAULT '{}',
        compliance_requirements JSONB DEFAULT '{}',
        enforcement_mechanisms JSONB DEFAULT '{}',
        violation_penalties JSONB DEFAULT '{}',
        
        -- Policy Lifecycle
        effective_date TIMESTAMP NOT NULL,
        expiration_date TIMESTAMP,
        review_frequency_months INTEGER DEFAULT 12,
        last_review_date TIMESTAMP,
        next_review_date TIMESTAMP,
        
        -- Approval and Authority
        policy_level TEXT NOT NULL DEFAULT 'departmental' CHECK (policy_level IN (
          'departmental', 'government', 'international', 'constitutional'
        )),
        approved_by TEXT NOT NULL,
        approval_date TIMESTAMP NOT NULL DEFAULT NOW(),
        
        -- Status and Compliance
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
          'draft', 'under_review', 'active', 'suspended', 'expired', 'revoked'
        )),
        compliance_rate DECIMAL(5,2) DEFAULT 0.00,
        violation_count INTEGER DEFAULT 0,
        
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Research Institutions - Government research facilities and partnerships
    await client.query(`
      CREATE TABLE IF NOT EXISTS research_institutions (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        institution_name TEXT NOT NULL,
        institution_type TEXT NOT NULL CHECK (institution_type IN (
          'government_lab', 'university_partnership', 'corporate_collaboration',
          'international_facility', 'joint_venture', 'research_center',
          'testing_facility', 'innovation_hub', 'incubator', 'think_tank'
        )),
        
        -- Institution Details
        description TEXT NOT NULL,
        location TEXT NOT NULL,
        specialization_areas TEXT[] DEFAULT '{}',
        research_capabilities JSONB DEFAULT '{}',
        
        -- Resources and Capacity
        total_personnel INTEGER DEFAULT 0,
        research_personnel INTEGER DEFAULT 0,
        support_personnel INTEGER DEFAULT 0,
        annual_budget DECIMAL(15,2) DEFAULT 0.00,
        facility_size_sqm INTEGER DEFAULT 0,
        
        -- Equipment and Infrastructure
        major_equipment JSONB DEFAULT '[]',
        specialized_facilities JSONB DEFAULT '[]',
        computing_resources JSONB DEFAULT '{}',
        safety_certifications TEXT[] DEFAULT '{}',
        
        -- Performance Metrics
        active_projects INTEGER DEFAULT 0,
        completed_projects INTEGER DEFAULT 0,
        publications_per_year INTEGER DEFAULT 0,
        patents_filed INTEGER DEFAULT 0,
        technology_transfers INTEGER DEFAULT 0,
        
        -- Partnerships and Collaboration
        partner_institutions TEXT[] DEFAULT '{}',
        international_collaborations TEXT[] DEFAULT '{}',
        industry_partnerships TEXT[] DEFAULT '{}',
        
        -- Management and Oversight
        director_name TEXT,
        oversight_committee TEXT[] DEFAULT '{}',
        reporting_structure JSONB DEFAULT '{}',
        
        -- Status and Operations
        operational_status TEXT NOT NULL DEFAULT 'operational' CHECK (operational_status IN (
          'planning', 'construction', 'operational', 'maintenance', 'upgrading', 'decommissioned'
        )),
        security_clearance_level INTEGER DEFAULT 1,
        
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Science Secretary Budget Integration
    await client.query(`
      CREATE TABLE IF NOT EXISTS science_budget_allocations (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        fiscal_year INTEGER NOT NULL,
        
        -- Budget Categories
        basic_research_budget DECIMAL(15,2) DEFAULT 0.00,
        applied_research_budget DECIMAL(15,2) DEFAULT 0.00,
        development_budget DECIMAL(15,2) DEFAULT 0.00,
        infrastructure_budget DECIMAL(15,2) DEFAULT 0.00,
        personnel_budget DECIMAL(15,2) DEFAULT 0.00,
        equipment_budget DECIMAL(15,2) DEFAULT 0.00,
        facilities_budget DECIMAL(15,2) DEFAULT 0.00,
        collaboration_budget DECIMAL(15,2) DEFAULT 0.00,
        innovation_programs_budget DECIMAL(15,2) DEFAULT 0.00,
        
        -- Total Budget
        total_allocated DECIMAL(15,2) GENERATED ALWAYS AS (
          basic_research_budget + applied_research_budget + development_budget +
          infrastructure_budget + personnel_budget + equipment_budget +
          facilities_budget + collaboration_budget + innovation_programs_budget
        ) STORED,
        
        -- Spending Tracking
        total_spent DECIMAL(15,2) DEFAULT 0.00,
        total_committed DECIMAL(15,2) DEFAULT 0.00,
        
        -- Performance Metrics
        research_output_score DECIMAL(5,2) DEFAULT 0.00,
        innovation_impact_score DECIMAL(5,2) DEFAULT 0.00,
        collaboration_effectiveness DECIMAL(5,2) DEFAULT 0.00,
        
        -- Approval and Review
        approved_by TEXT NOT NULL,
        approval_date TIMESTAMP NOT NULL DEFAULT NOW(),
        last_review_date TIMESTAMP,
        next_review_date TIMESTAMP,
        
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        
        UNIQUE(campaign_id, fiscal_year)
      )
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_science_operations_campaign ON science_operations(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_science_operations_type ON science_operations(operation_type);
      CREATE INDEX IF NOT EXISTS idx_science_operations_status ON science_operations(status);
      CREATE INDEX IF NOT EXISTS idx_science_operations_priority ON science_operations(priority);
      CREATE INDEX IF NOT EXISTS idx_science_operations_dates ON science_operations(planned_start_date, planned_completion_date);
      
      CREATE INDEX IF NOT EXISTS idx_research_budgets_campaign ON research_budgets(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_research_budgets_fiscal_year ON research_budgets(fiscal_year);
      CREATE INDEX IF NOT EXISTS idx_research_budgets_category ON research_budgets(budget_category);
      CREATE INDEX IF NOT EXISTS idx_research_budgets_performance ON research_budgets(roi_actual);
      
      CREATE INDEX IF NOT EXISTS idx_research_priorities_campaign ON research_priorities(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_research_priorities_category ON research_priorities(priority_category);
      CREATE INDEX IF NOT EXISTS idx_research_priorities_importance ON research_priorities(strategic_importance);
      CREATE INDEX IF NOT EXISTS idx_research_priorities_status ON research_priorities(status);
      
      CREATE INDEX IF NOT EXISTS idx_innovation_programs_campaign ON innovation_programs(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_innovation_programs_type ON innovation_programs(program_type);
      CREATE INDEX IF NOT EXISTS idx_innovation_programs_status ON innovation_programs(status);
      CREATE INDEX IF NOT EXISTS idx_innovation_programs_dates ON innovation_programs(program_start_date, program_end_date);
      
      CREATE INDEX IF NOT EXISTS idx_scientific_policies_campaign ON scientific_policies(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_scientific_policies_category ON scientific_policies(policy_category);
      CREATE INDEX IF NOT EXISTS idx_scientific_policies_status ON scientific_policies(status);
      CREATE INDEX IF NOT EXISTS idx_scientific_policies_effective ON scientific_policies(effective_date);
      
      CREATE INDEX IF NOT EXISTS idx_research_institutions_campaign ON research_institutions(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_research_institutions_type ON research_institutions(institution_type);
      CREATE INDEX IF NOT EXISTS idx_research_institutions_status ON research_institutions(operational_status);
      CREATE INDEX IF NOT EXISTS idx_research_institutions_specialization ON research_institutions USING GIN(specialization_areas);
      
      CREATE INDEX IF NOT EXISTS idx_science_budget_allocations_campaign ON science_budget_allocations(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_science_budget_allocations_fiscal_year ON science_budget_allocations(fiscal_year);
    `);

    await client.query('COMMIT');
    console.log('✅ Science Secretary database schema initialized successfully');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Science Secretary schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}
