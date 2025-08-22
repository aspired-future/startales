import { Pool } from 'pg';

/**
 * Initialize Government Contracts database schema
 */
export async function initializeGovernmentContractsSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Contract Types table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contract_types (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(20) CHECK (category IN ('defense', 'infrastructure', 'research', 'social', 'custom')),
        
        -- Contract Characteristics
        typical_duration INTEGER NOT NULL, -- in months
        complexity_level INTEGER CHECK (complexity_level BETWEEN 1 AND 10),
        risk_level INTEGER CHECK (risk_level BETWEEN 1 AND 10),
        
        -- Requirements
        required_capabilities JSONB NOT NULL DEFAULT '[]',
        security_clearance_required BOOLEAN DEFAULT FALSE,
        minimum_company_size VARCHAR(10) CHECK (minimum_company_size IN ('small', 'medium', 'large', 'any')),
        
        -- Evaluation Criteria
        evaluation_criteria JSONB NOT NULL DEFAULT '{}',
        
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Government Contracts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS government_contracts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        civilization_id VARCHAR(50) NOT NULL,
        
        -- Contract Details
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        contract_type_id VARCHAR(50) REFERENCES contract_types(id),
        category VARCHAR(20) CHECK (category IN ('defense', 'infrastructure', 'research', 'social', 'custom')),
        
        -- Financial Information
        total_value BIGINT NOT NULL,
        budget_allocated BIGINT NOT NULL,
        funding_source VARCHAR(100) NOT NULL,
        payment_schedule VARCHAR(20) CHECK (payment_schedule IN ('milestone', 'monthly', 'completion', 'custom')),
        
        -- Timeline
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        duration INTEGER NOT NULL, -- in months
        
        -- Priority and Status
        priority VARCHAR(10) CHECK (priority IN ('critical', 'high', 'medium', 'low')),
        status VARCHAR(20) CHECK (status IN ('planning', 'bidding', 'awarded', 'active', 'completed', 'cancelled', 'disputed')),
        
        -- Requirements
        requirements JSONB NOT NULL DEFAULT '{}',
        
        -- Bidding Information
        bidding_process JSONB NOT NULL DEFAULT '{}',
        
        -- Award Information
        awarded_to JSONB DEFAULT NULL,
        
        -- Performance Tracking
        performance JSONB DEFAULT NULL,
        
        -- Metadata
        created_by VARCHAR(100) NOT NULL,
        approved_by VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Contract Bids table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contract_bids (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        contract_id UUID REFERENCES government_contracts(id) ON DELETE CASCADE,
        
        -- Bidder Information
        bidder_id VARCHAR(50) NOT NULL,
        bidder_name VARCHAR(100) NOT NULL,
        bidder_type VARCHAR(20) CHECK (bidder_type IN ('corporation', 'small_business', 'nonprofit', 'individual')),
        
        -- Bid Details
        bid_amount BIGINT NOT NULL,
        proposed_duration INTEGER NOT NULL, -- in months
        proposed_start_date TIMESTAMP NOT NULL,
        
        -- Technical Proposal
        technical_approach TEXT NOT NULL,
        key_personnel JSONB NOT NULL DEFAULT '[]',
        subcontractors JSONB NOT NULL DEFAULT '[]',
        past_performance JSONB NOT NULL DEFAULT '[]',
        
        -- Evaluation Scores
        evaluation_scores JSONB DEFAULT NULL,
        
        -- Status
        status VARCHAR(20) CHECK (status IN ('submitted', 'under_review', 'accepted', 'rejected', 'withdrawn')),
        submitted_at TIMESTAMP DEFAULT NOW(),
        reviewed_at TIMESTAMP,
        reviewed_by VARCHAR(100),
        rejection_reason TEXT
      )
    `);

    // Contract Funding table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contract_funding (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        contract_id UUID REFERENCES government_contracts(id) ON DELETE CASCADE,
        
        -- Funding Details
        funding_source VARCHAR(100) NOT NULL,
        amount BIGINT NOT NULL,
        fiscal_year INTEGER NOT NULL,
        
        -- Allocation
        allocation_type VARCHAR(20) CHECK (allocation_type IN ('initial', 'supplemental', 'modification', 'emergency')),
        allocation_date TIMESTAMP NOT NULL,
        available_until TIMESTAMP NOT NULL,
        
        -- Status
        status VARCHAR(20) CHECK (status IN ('allocated', 'obligated', 'disbursed', 'expired')),
        amount_obligated BIGINT DEFAULT 0,
        amount_disbursed BIGINT DEFAULT 0,
        
        -- Metadata
        authorized_by VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Contract Milestones table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contract_milestones (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        contract_id UUID REFERENCES government_contracts(id) ON DELETE CASCADE,
        
        -- Milestone Details
        milestone_name VARCHAR(200) NOT NULL,
        description TEXT,
        sequence_number INTEGER NOT NULL,
        
        -- Timeline
        planned_date TIMESTAMP NOT NULL,
        actual_date TIMESTAMP,
        
        -- Financial
        payment_amount BIGINT DEFAULT 0,
        payment_percentage DECIMAL(5,2) DEFAULT 0,
        
        -- Status
        status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed', 'cancelled')),
        completion_percentage INTEGER CHECK (completion_percentage BETWEEN 0 AND 100) DEFAULT 0,
        
        -- Deliverables
        deliverables JSONB NOT NULL DEFAULT '[]',
        acceptance_criteria JSONB NOT NULL DEFAULT '[]',
        
        -- Metadata
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Contract Modifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contract_modifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        contract_id UUID REFERENCES government_contracts(id) ON DELETE CASCADE,
        
        -- Modification Details
        modification_number INTEGER NOT NULL,
        modification_type VARCHAR(30) CHECK (modification_type IN ('scope_change', 'time_extension', 'budget_change', 'terms_change', 'termination')),
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        justification TEXT NOT NULL,
        
        -- Changes
        original_values JSONB NOT NULL DEFAULT '{}',
        new_values JSONB NOT NULL DEFAULT '{}',
        
        -- Financial Impact
        cost_impact BIGINT DEFAULT 0,
        schedule_impact INTEGER DEFAULT 0, -- in days
        
        -- Approval
        status VARCHAR(20) CHECK (status IN ('proposed', 'under_review', 'approved', 'rejected', 'implemented')),
        requested_by VARCHAR(100) NOT NULL,
        approved_by VARCHAR(100),
        
        -- Timeline
        requested_date TIMESTAMP DEFAULT NOW(),
        approved_date TIMESTAMP,
        effective_date TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_government_contracts_campaign_civ 
      ON government_contracts(campaign_id, civilization_id, status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_government_contracts_category_priority 
      ON government_contracts(category, priority, created_at DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_contract_bids_contract_status 
      ON contract_bids(contract_id, status, submitted_at DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_contract_funding_contract_fiscal 
      ON contract_funding(contract_id, fiscal_year, status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_contract_milestones_contract_sequence 
      ON contract_milestones(contract_id, sequence_number);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_contract_modifications_contract_date 
      ON contract_modifications(contract_id, requested_date DESC);
    `);

    // Insert predefined contract types
    await client.query(`
      INSERT INTO contract_types (
        id, name, description, category, typical_duration, complexity_level, risk_level,
        required_capabilities, security_clearance_required, minimum_company_size, evaluation_criteria
      ) VALUES 
      (
        'defense_weapons_systems',
        'Defense Weapons Systems',
        'Development, manufacturing, or maintenance of military weapons systems including spacecraft weapons, planetary defense systems, and personal armaments.',
        'defense',
        36,
        9,
        8,
        '["Military Engineering", "Weapons Technology", "Systems Integration", "Quality Assurance", "Security Protocols"]',
        true,
        'medium',
        '{"technical": 40, "cost": 20, "schedule": 15, "experience": 20, "innovation": 5}'
      ),
      (
        'defense_intelligence_systems',
        'Defense Intelligence Systems',
        'Intelligence gathering, analysis systems, surveillance technology, and cybersecurity infrastructure for military and national security purposes.',
        'defense',
        24,
        8,
        9,
        '["Cybersecurity", "Data Analytics", "Surveillance Technology", "Intelligence Analysis", "Secure Communications"]',
        true,
        'large',
        '{"technical": 45, "cost": 15, "schedule": 15, "experience": 20, "innovation": 5}'
      ),
      (
        'infrastructure_transportation',
        'Transportation Infrastructure',
        'Construction and maintenance of transportation systems including spaceports, hyperloop networks, planetary transit systems, and interplanetary shipping facilities.',
        'infrastructure',
        48,
        7,
        6,
        '["Civil Engineering", "Transportation Planning", "Construction Management", "Environmental Compliance", "Safety Systems"]',
        false,
        'large',
        '{"technical": 30, "cost": 35, "schedule": 20, "experience": 15, "innovation": 0}'
      ),
      (
        'infrastructure_energy',
        'Energy Infrastructure',
        'Power generation, distribution, and storage systems including fusion reactors, solar arrays, energy storage facilities, and planetary power grids.',
        'infrastructure',
        60,
        8,
        7,
        '["Energy Engineering", "Power Systems", "Grid Management", "Environmental Engineering", "Safety Protocols"]',
        false,
        'large',
        '{"technical": 35, "cost": 30, "schedule": 20, "experience": 15, "innovation": 0}'
      ),
      (
        'infrastructure_communications',
        'Communications Infrastructure',
        'Communication networks, data centers, quantum communication systems, and interplanetary communication relays.',
        'infrastructure',
        36,
        7,
        5,
        '["Network Engineering", "Telecommunications", "Data Center Management", "Quantum Communications", "Cybersecurity"]',
        false,
        'medium',
        '{"technical": 40, "cost": 25, "schedule": 20, "experience": 15, "innovation": 0}'
      ),
      (
        'research_scientific',
        'Scientific Research',
        'Basic and applied research in various scientific fields including physics, chemistry, biology, materials science, and space exploration.',
        'research',
        24,
        6,
        4,
        '["Research Methodology", "Scientific Analysis", "Laboratory Management", "Data Analysis", "Publication"]',
        false,
        'any',
        '{"technical": 50, "cost": 15, "schedule": 10, "experience": 15, "innovation": 10}'
      ),
      (
        'research_technology_development',
        'Technology Development',
        'Development of new technologies, prototyping, testing, and technology transfer for civilian and military applications.',
        'research',
        36,
        8,
        6,
        '["Technology Development", "Prototyping", "Testing", "Systems Engineering", "Innovation Management"]',
        false,
        'medium',
        '{"technical": 45, "cost": 20, "schedule": 15, "experience": 10, "innovation": 10}'
      ),
      (
        'social_healthcare',
        'Healthcare Services',
        'Medical services, healthcare facility management, medical research, pharmaceutical development, and public health programs.',
        'social',
        12,
        5,
        3,
        '["Medical Services", "Healthcare Management", "Medical Research", "Regulatory Compliance", "Patient Care"]',
        false,
        'any',
        '{"technical": 35, "cost": 30, "schedule": 15, "experience": 20, "innovation": 0}'
      ),
      (
        'social_education',
        'Education Services',
        'Educational programs, training services, curriculum development, educational technology, and skills development programs.',
        'social',
        12,
        4,
        2,
        '["Education", "Curriculum Development", "Training", "Educational Technology", "Assessment"]',
        false,
        'any',
        '{"technical": 25, "cost": 35, "schedule": 15, "experience": 25, "innovation": 0}'
      ),
      (
        'social_welfare',
        'Social Welfare Programs',
        'Social services, welfare administration, community development programs, and social support systems.',
        'social',
        12,
        3,
        2,
        '["Social Services", "Program Management", "Community Development", "Case Management", "Data Management"]',
        false,
        'any',
        '{"technical": 20, "cost": 40, "schedule": 15, "experience": 25, "innovation": 0}'
      )
      ON CONFLICT (id) DO NOTHING
    `);

    await client.query('COMMIT');
    console.log('✅ Government Contracts schema initialized successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Government Contracts schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

