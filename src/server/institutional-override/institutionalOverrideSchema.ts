import { Pool } from 'pg';

export async function initializeInstitutionalOverrideSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Institutional Overrides - Comprehensive override system for all three institutions
    await client.query(`
      CREATE TABLE IF NOT EXISTS institutional_overrides (
        id SERIAL PRIMARY KEY,
        institution_type VARCHAR(20) NOT NULL CHECK (institution_type IN ('legislature', 'central_bank', 'supreme_court')),
        target_decision_id VARCHAR(50) NOT NULL,
        target_decision_title TEXT NOT NULL,
        campaign_id INTEGER NOT NULL,
        leader_character_id VARCHAR(50) NOT NULL,
        original_decision VARCHAR(50) NOT NULL,
        original_reasoning TEXT,
        override_decision VARCHAR(20) NOT NULL CHECK (override_decision IN ('approve', 'reject', 'modify', 'suspend')),
        override_reason TEXT NOT NULL,
        override_justification TEXT NOT NULL,
        constitutional_basis TEXT NOT NULL,
        legal_precedent TEXT,
        modifications TEXT,
        implementation_notes TEXT,
        
        -- Political Consequences
        political_cost DECIMAL(5,2) NOT NULL DEFAULT 0.0,
        public_approval_impact DECIMAL(5,2) NOT NULL DEFAULT 0.0,
        institutional_trust_impact DECIMAL(5,2) NOT NULL DEFAULT 0.0,
        party_relations_impact JSONB NOT NULL DEFAULT '{}',
        
        -- Constitutional & Legal Impact
        constitutionality_score DECIMAL(5,2) NOT NULL DEFAULT 0.0,
        separation_of_powers_impact DECIMAL(5,2) NOT NULL DEFAULT 0.0,
        judicial_independence_impact DECIMAL(5,2), -- Only for Supreme Court overrides
        monetary_authority_impact DECIMAL(5,2), -- Only for Central Bank overrides
        
        -- Status & Timeline
        effective_date TIMESTAMP NOT NULL DEFAULT NOW(),
        expiration_date TIMESTAMP, -- For temporary overrides
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'challenged', 'upheld', 'reversed', 'expired')),
        challenge_details JSONB,
        
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Enhanced Leader Action Log - Track all institutional override actions
    await client.query(`
      CREATE TABLE IF NOT EXISTS institutional_trust_metrics (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        institution_type VARCHAR(20) NOT NULL CHECK (institution_type IN ('legislature', 'central_bank', 'supreme_court')),
        public_trust_rating DECIMAL(4,1) CHECK (public_trust_rating BETWEEN 0 AND 100),
        expert_trust_rating DECIMAL(4,1) CHECK (expert_trust_rating BETWEEN 0 AND 100),
        international_trust_rating DECIMAL(4,1) CHECK (international_trust_rating BETWEEN 0 AND 100),
        independence_perception DECIMAL(4,1) CHECK (independence_perception BETWEEN 0 AND 100),
        effectiveness_rating DECIMAL(4,1) CHECK (effectiveness_rating BETWEEN 0 AND 100),
        override_impact_cumulative DECIMAL(5,2) DEFAULT 0.0,
        last_override_date TIMESTAMP,
        total_overrides INTEGER DEFAULT 0,
        successful_challenges INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Separation of Powers Tracking - Monitor constitutional balance
    await client.query(`
      CREATE TABLE IF NOT EXISTS separation_of_powers_metrics (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        executive_power_index DECIMAL(4,1) CHECK (executive_power_index BETWEEN 0 AND 100),
        legislative_independence_index DECIMAL(4,1) CHECK (legislative_independence_index BETWEEN 0 AND 100),
        judicial_independence_index DECIMAL(4,1) CHECK (judicial_independence_index BETWEEN 0 AND 100),
        monetary_independence_index DECIMAL(4,1) CHECK (monetary_independence_index BETWEEN 0 AND 100),
        constitutional_balance_score DECIMAL(4,1) CHECK (constitutional_balance_score BETWEEN 0 AND 100),
        democratic_health_index DECIMAL(4,1) CHECK (democratic_health_index BETWEEN 0 AND 100),
        total_institutional_overrides INTEGER DEFAULT 0,
        override_frequency_30d INTEGER DEFAULT 0,
        last_constitutional_crisis TIMESTAMP,
        crisis_severity_level VARCHAR(20) CHECK (crisis_severity_level IN ('none', 'low', 'medium', 'high', 'critical')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Override Challenge History - Track legal challenges to overrides
    await client.query(`
      CREATE TABLE IF NOT EXISTS override_challenge_history (
        id SERIAL PRIMARY KEY,
        override_id INTEGER REFERENCES institutional_overrides(id),
        challenger_type VARCHAR(30) NOT NULL, -- 'opposition_party', 'judicial_review', 'civil_society', 'international'
        challenger_name VARCHAR(100) NOT NULL,
        challenge_reason TEXT NOT NULL,
        legal_basis TEXT,
        challenge_date TIMESTAMP NOT NULL,
        resolution_date TIMESTAMP,
        resolution_outcome VARCHAR(20) CHECK (resolution_outcome IN ('upheld', 'reversed', 'modified', 'dismissed')),
        resolution_details TEXT,
        constitutional_impact DECIMAL(5,2) DEFAULT 0.0,
        precedent_set BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Constitutional Crisis Events - Track severe constitutional issues
    await client.query(`
      CREATE TABLE IF NOT EXISTS constitutional_crisis_events (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        crisis_type VARCHAR(50) NOT NULL, -- 'institutional_override', 'separation_of_powers', 'rule_of_law'
        severity_level VARCHAR(20) NOT NULL CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
        triggering_override_id INTEGER REFERENCES institutional_overrides(id),
        crisis_description TEXT NOT NULL,
        institutions_involved JSONB NOT NULL DEFAULT '[]',
        public_response_level DECIMAL(4,1) CHECK (public_response_level BETWEEN 0 AND 100),
        international_response JSONB DEFAULT '{}',
        resolution_status VARCHAR(20) CHECK (resolution_status IN ('ongoing', 'resolved', 'escalated')),
        resolution_date TIMESTAMP,
        long_term_impact JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_institutional_overrides_institution 
      ON institutional_overrides(institution_type, campaign_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_institutional_overrides_leader 
      ON institutional_overrides(leader_character_id, campaign_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_institutional_overrides_status 
      ON institutional_overrides(status, created_at DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_institutional_trust_metrics_campaign 
      ON institutional_trust_metrics(campaign_id, institution_type);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_separation_powers_campaign 
      ON separation_of_powers_metrics(campaign_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_override_challenges_override 
      ON override_challenge_history(override_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_constitutional_crisis_campaign 
      ON constitutional_crisis_events(campaign_id, severity_level);
    `);

    await client.query('COMMIT');
    console.log('✅ Institutional Override schema initialized successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Institutional Override schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function insertInstitutionalOverrideSeedData(pool: Pool): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if we have any civilizations to reference
    const civilizationsResult = await client.query('SELECT id FROM civilizations LIMIT 1');
    if (civilizationsResult.rows.length === 0) {
      console.log('⚠️ No civilizations found, skipping Institutional Override seed data');
      await client.query('COMMIT');
      return;
    }

    const campaignId = 1; // Default campaign

    // Insert initial institutional trust metrics
    await client.query(`
      INSERT INTO institutional_trust_metrics (
        campaign_id, institution_type, public_trust_rating, expert_trust_rating, 
        international_trust_rating, independence_perception, effectiveness_rating
      ) VALUES 
        ($1, 'legislature', 65.5, 70.2, 68.8, 72.1, 69.3),
        ($1, 'central_bank', 78.9, 85.4, 82.1, 88.7, 81.5),
        ($1, 'supreme_court', 71.2, 82.8, 75.6, 85.9, 77.4)
      ON CONFLICT DO NOTHING
    `, [campaignId]);

    // Insert initial separation of powers metrics
    await client.query(`
      INSERT INTO separation_of_powers_metrics (
        campaign_id, executive_power_index, legislative_independence_index, 
        judicial_independence_index, monetary_independence_index, 
        constitutional_balance_score, democratic_health_index, crisis_severity_level
      ) VALUES ($1, 68.5, 72.3, 81.7, 85.2, 76.9, 78.1, 'none')
      ON CONFLICT DO NOTHING
    `, [campaignId]);

    // Insert sample institutional override (historical example)
    await client.query(`
      INSERT INTO institutional_overrides (
        institution_type, target_decision_id, target_decision_title, campaign_id,
        leader_character_id, original_decision, original_reasoning, override_decision,
        override_reason, override_justification, constitutional_basis,
        political_cost, public_approval_impact, institutional_trust_impact,
        party_relations_impact, constitutionality_score, separation_of_powers_impact,
        status
      ) VALUES (
        'legislature', 'prop-historical-1', 'Emergency Economic Stabilization Act',
        $1, 'leader-1', 'failed', 'Insufficient legislative support due to partisan divisions',
        'approve', 'National economic emergency requires immediate action',
        'Executive responsibility for economic stability during crisis periods',
        'Article II executive powers during national emergencies',
        28.5, -4.2, -8.1, '{"Progressive Alliance": -5, "Conservative Coalition": 3, "Centrist Party": -2}',
        75.8, 15.3, 'active'
      )
      ON CONFLICT DO NOTHING
    `, [campaignId]);

    await client.query('COMMIT');
    console.log('✅ Institutional Override seed data inserted successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Institutional Override seed data insertion failed:', error);
    // Don't throw - allow system to continue without seed data
  } finally {
    client.release();
  }
}
