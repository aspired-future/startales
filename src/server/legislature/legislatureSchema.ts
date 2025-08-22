import { Pool } from 'pg';

/**
 * Initialize Legislative Bodies Advisory System database schema
 */
export async function initializeLegislatureSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Legislative Proposals (Bills/Laws)
    await client.query(`
      CREATE TABLE IF NOT EXISTS legislative_proposals (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        proposal_type VARCHAR(50) NOT NULL, -- 'bill', 'resolution', 'amendment', 'treaty', etc.
        proposal_title VARCHAR(200) NOT NULL,
        proposal_summary TEXT NOT NULL,
        full_text TEXT NOT NULL,
        policy_category VARCHAR(50) NOT NULL, -- 'economic', 'social', 'security', etc.
        sponsor_party VARCHAR(50) NOT NULL,
        co_sponsors JSONB NOT NULL DEFAULT '[]',
        committee_assignment VARCHAR(100),
        constitutional_analysis TEXT,
        impact_assessment TEXT NOT NULL,
        fiscal_impact JSONB NOT NULL DEFAULT '{}',
        implementation_timeline VARCHAR(200),
        public_support_estimate INTEGER CHECK (public_support_estimate BETWEEN 0 AND 100),
        status VARCHAR(30) DEFAULT 'drafted' CHECK (status IN ('drafted', 'committee_review', 'floor_debate', 'voting', 'passed', 'failed', 'leader_review', 'approved', 'vetoed', 'implemented')),
        urgency_level VARCHAR(20) CHECK (urgency_level IN ('routine', 'important', 'urgent', 'emergency')),
        leader_position VARCHAR(20) CHECK (leader_position IN ('support', 'neutral', 'oppose', 'undecided')),
        leader_response TEXT,
        leader_decision VARCHAR(20) CHECK (leader_decision IN ('approve', 'modify', 'veto', 'defer')),
        leader_modifications TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        voted_at TIMESTAMP,
        decided_at TIMESTAMP
      )
    `);

    // Political Parties
    await client.query(`
      CREATE TABLE IF NOT EXISTS political_parties (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        party_name VARCHAR(100) NOT NULL,
        party_abbreviation VARCHAR(10) NOT NULL,
        ideology VARCHAR(50) NOT NULL, -- 'progressive', 'conservative', 'centrist', 'libertarian', 'nationalist'
        party_description TEXT NOT NULL,
        founding_principles JSONB NOT NULL DEFAULT '[]',
        policy_positions JSONB NOT NULL DEFAULT '{}',
        leadership JSONB NOT NULL DEFAULT '{}',
        member_count INTEGER DEFAULT 0,
        approval_rating DECIMAL(4,1) CHECK (approval_rating BETWEEN 0 AND 100),
        electoral_strength DECIMAL(4,1) CHECK (electoral_strength BETWEEN 0 AND 100),
        coalition_partners JSONB NOT NULL DEFAULT '[]',
        opposition_parties JSONB NOT NULL DEFAULT '[]',
        recent_positions JSONB NOT NULL DEFAULT '[]',
        witter_handle VARCHAR(50),
        public_statements INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Legislative Votes
    await client.query(`
      CREATE TABLE IF NOT EXISTS legislative_votes (
        id SERIAL PRIMARY KEY,
        proposal_id INTEGER REFERENCES legislative_proposals(id),
        campaign_id INTEGER NOT NULL,
        vote_type VARCHAR(20) NOT NULL, -- 'committee', 'floor', 'final', 'override'
        vote_date TIMESTAMP NOT NULL,
        total_votes INTEGER NOT NULL,
        votes_for INTEGER NOT NULL,
        votes_against INTEGER NOT NULL,
        abstentions INTEGER NOT NULL,
        party_breakdown JSONB NOT NULL DEFAULT '{}',
        vote_result VARCHAR(20) NOT NULL CHECK (vote_result IN ('passed', 'failed', 'tied')),
        required_majority VARCHAR(20) NOT NULL, -- 'simple', 'absolute', 'two_thirds', 'three_quarters'
        vote_details JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Legislative Committees
    await client.query(`
      CREATE TABLE IF NOT EXISTS legislative_committees (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        committee_name VARCHAR(100) NOT NULL,
        committee_type VARCHAR(50) NOT NULL, -- 'standing', 'select', 'joint', 'special'
        jurisdiction TEXT NOT NULL,
        chair_party VARCHAR(50) NOT NULL,
        ranking_member_party VARCHAR(50),
        member_composition JSONB NOT NULL DEFAULT '{}',
        active_proposals INTEGER DEFAULT 0,
        meetings_held INTEGER DEFAULT 0,
        reports_issued INTEGER DEFAULT 0,
        committee_authority VARCHAR(50) NOT NULL, -- 'advisory', 'investigative', 'oversight'
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Legislative Sessions
    await client.query(`
      CREATE TABLE IF NOT EXISTS legislative_sessions (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        session_type VARCHAR(30) NOT NULL, -- 'regular', 'special', 'emergency', 'committee'
        session_title VARCHAR(200) NOT NULL,
        session_description TEXT,
        scheduled_date TIMESTAMP NOT NULL,
        duration_minutes INTEGER,
        agenda_items JSONB NOT NULL DEFAULT '[]',
        attendees JSONB NOT NULL DEFAULT '{}',
        session_outcomes JSONB NOT NULL DEFAULT '{}',
        proposals_discussed JSONB NOT NULL DEFAULT '[]',
        votes_conducted JSONB NOT NULL DEFAULT '[]',
        status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed')),
        session_notes TEXT,
        public_access BOOLEAN DEFAULT TRUE,
        media_coverage BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Leader-Legislative Interactions
    await client.query(`
      CREATE TABLE IF NOT EXISTS leader_legislative_interactions (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        interaction_type VARCHAR(50) NOT NULL, -- 'consultation', 'veto', 'approval', 'amendment_request', 'policy_directive'
        interaction_summary TEXT NOT NULL,
        proposal_id INTEGER REFERENCES legislative_proposals(id),
        leader_position TEXT NOT NULL,
        legislative_response TEXT,
        discussion_points JSONB NOT NULL DEFAULT '[]',
        agreements_reached JSONB NOT NULL DEFAULT '[]',
        disagreements JSONB NOT NULL DEFAULT '[]',
        compromise_solutions JSONB NOT NULL DEFAULT '[]',
        interaction_outcome VARCHAR(50) NOT NULL,
        public_disclosure BOOLEAN DEFAULT FALSE,
        interaction_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Legislative Analytics
    await client.query(`
      CREATE TABLE IF NOT EXISTS legislative_analytics (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        analytics_date TIMESTAMP NOT NULL,
        total_proposals INTEGER DEFAULT 0,
        proposals_passed INTEGER DEFAULT 0,
        proposals_vetoed INTEGER DEFAULT 0,
        leader_approval_rate DECIMAL(4,1) CHECK (leader_approval_rate BETWEEN 0 AND 100),
        legislative_productivity_score INTEGER CHECK (legislative_productivity_score BETWEEN 0 AND 100),
        bipartisan_cooperation_score INTEGER CHECK (bipartisan_cooperation_score BETWEEN 0 AND 100),
        public_confidence_in_legislature DECIMAL(4,1) CHECK (public_confidence_in_legislature BETWEEN 0 AND 100),
        party_performance JSONB NOT NULL DEFAULT '{}',
        policy_area_activity JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Legislative Overrides - Leader's ability to override legislative votes
    await client.query(`
      CREATE TABLE IF NOT EXISTS legislative_overrides (
        id SERIAL PRIMARY KEY,
        proposal_id INTEGER REFERENCES legislative_proposals(id),
        campaign_id INTEGER NOT NULL,
        leader_character_id VARCHAR(50) NOT NULL,
        original_vote_result VARCHAR(20) NOT NULL CHECK (original_vote_result IN ('passed', 'failed', 'tied')),
        override_decision VARCHAR(20) NOT NULL CHECK (override_decision IN ('approve', 'veto', 'modify')),
        override_reason TEXT NOT NULL,
        override_justification TEXT NOT NULL,
        political_cost DECIMAL(5,2) NOT NULL DEFAULT 0.0,
        public_approval_impact DECIMAL(5,2) NOT NULL DEFAULT 0.0,
        party_relations_impact JSONB NOT NULL DEFAULT '{}',
        constitutional_basis TEXT NOT NULL,
        legal_precedent TEXT,
        modifications TEXT,
        implementation_notes TEXT,
        effective_date TIMESTAMP NOT NULL DEFAULT NOW(),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'challenged', 'upheld', 'reversed')),
        challenge_details JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Leader Action Log - Track all leader actions for historical analysis
    await client.query(`
      CREATE TABLE IF NOT EXISTS leader_action_log (
        id SERIAL PRIMARY KEY,
        leader_character_id VARCHAR(50) NOT NULL,
        campaign_id INTEGER NOT NULL,
        action_type VARCHAR(50) NOT NULL, -- 'legislative_override', 'executive_order', 'veto', etc.
        action_description TEXT NOT NULL,
        target_id VARCHAR(50), -- ID of the target (proposal, bill, etc.)
        political_cost DECIMAL(5,2) DEFAULT 0.0,
        approval_impact DECIMAL(5,2) DEFAULT 0.0,
        additional_data JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_legislative_proposals_campaign_status 
      ON legislative_proposals(campaign_id, status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_legislative_proposals_category_urgency 
      ON legislative_proposals(policy_category, urgency_level);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_political_parties_campaign_ideology 
      ON political_parties(campaign_id, ideology);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_legislative_votes_proposal_date 
      ON legislative_votes(proposal_id, vote_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_legislative_sessions_campaign_date 
      ON legislative_sessions(campaign_id, scheduled_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_leader_legislative_interactions_campaign_date 
      ON leader_legislative_interactions(campaign_id, interaction_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_legislative_overrides_proposal 
      ON legislative_overrides(proposal_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_legislative_overrides_leader 
      ON legislative_overrides(leader_character_id, campaign_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_leader_action_log_leader 
      ON leader_action_log(leader_character_id, campaign_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_leader_action_log_type 
      ON leader_action_log(action_type, created_at DESC);
    `);

    // Insert default political parties
    await client.query(`
      INSERT INTO political_parties (
        campaign_id, party_name, party_abbreviation, ideology, party_description,
        founding_principles, policy_positions, leadership, member_count, approval_rating,
        electoral_strength, witter_handle
      ) VALUES 
      (
        1, 'Progressive Alliance', 'PA', 'progressive',
        'A coalition focused on social justice, environmental protection, and economic equality.',
        '["Social Justice", "Environmental Sustainability", "Economic Equality", "Universal Rights"]',
        '{"healthcare": "universal", "environment": "aggressive_action", "economy": "regulated_capitalism", "taxation": "progressive"}',
        '{"party_leader": "Dr. Elena Vasquez", "deputy_leader": "Marcus Chen", "whip": "Sarah Johnson"}',
        45, 42.5, 28.3, '@ProgressiveAlliance'
      ),
      (
        1, 'Conservative Coalition', 'CC', 'conservative',
        'A party emphasizing traditional values, fiscal responsibility, and strong defense.',
        '["Fiscal Responsibility", "Traditional Values", "Strong Defense", "Limited Government"]',
        '{"economy": "free_market", "defense": "strong_military", "taxation": "low_taxes", "regulation": "minimal"}',
        '{"party_leader": "Admiral James Morrison", "deputy_leader": "Victoria Sterling", "whip": "Robert Hayes"}',
        52, 38.7, 31.2, '@ConservativeCoalition'
      ),
      (
        1, 'Centrist Party', 'CP', 'centrist',
        'A moderate party focused on pragmatic solutions and bipartisan cooperation.',
        '["Pragmatic Governance", "Bipartisan Cooperation", "Evidence-Based Policy", "Moderate Reform"]',
        '{"governance": "pragmatic", "cooperation": "bipartisan", "policy": "evidence_based", "reform": "gradual"}',
        '{"party_leader": "Dr. Michael Rodriguez", "deputy_leader": "Lisa Park", "whip": "David Kim"}',
        38, 51.2, 22.8, '@CentristParty'
      ),
      (
        1, 'Libertarian Movement', 'LM', 'libertarian',
        'A party advocating for individual freedom, minimal government, and free market economics.',
        '["Individual Liberty", "Minimal Government", "Free Markets", "Personal Responsibility"]',
        '{"government": "minimal", "markets": "free", "liberty": "maximum", "intervention": "minimal"}',
        '{"party_leader": "Dr. Rachel Freeman", "deputy_leader": "Alex Thompson", "whip": "Jordan Miller"}',
        28, 35.8, 12.4, '@LibertarianMovement'
      ),
      (
        1, 'Nationalist Party', 'NP', 'nationalist',
        'A party promoting civilization-first policies, protectionism, and cultural preservation.',
        '["Civilization First", "Cultural Preservation", "Economic Protectionism", "National Sovereignty"]',
        '{"trade": "protectionist", "culture": "preservation", "sovereignty": "absolute", "immigration": "controlled"}',
        '{"party_leader": "General Patricia Stone", "deputy_leader": "Thomas Wright", "whip": "Maria Santos"}',
        22, 29.4, 5.3, '@NationalistParty'
      ) ON CONFLICT DO NOTHING
    `);

    // Insert default legislative committees
    await client.query(`
      INSERT INTO legislative_committees (
        campaign_id, committee_name, committee_type, jurisdiction, chair_party,
        ranking_member_party, member_composition, committee_authority
      ) VALUES 
      (
        1, 'Budget Committee', 'standing',
        'Government spending, taxation, fiscal policy oversight, and budget authorization',
        'Conservative Coalition', 'Progressive Alliance',
        '{"Conservative Coalition": 5, "Progressive Alliance": 4, "Centrist Party": 3, "Libertarian Movement": 1, "Nationalist Party": 1}',
        'advisory'
      ),
      (
        1, 'Defense Committee', 'standing',
        'Military policy, security legislation, defense spending, and national security oversight',
        'Conservative Coalition', 'Centrist Party',
        '{"Conservative Coalition": 6, "Centrist Party": 3, "Nationalist Party": 2, "Progressive Alliance": 2, "Libertarian Movement": 1}',
        'advisory'
      ),
      (
        1, 'Foreign Relations Committee', 'standing',
        'International treaties, diplomatic policy, trade agreements, and foreign affairs',
        'Centrist Party', 'Progressive Alliance',
        '{"Centrist Party": 4, "Progressive Alliance": 4, "Conservative Coalition": 3, "Nationalist Party": 2, "Libertarian Movement": 1}',
        'advisory'
      ),
      (
        1, 'Judiciary Committee', 'standing',
        'Legal system oversight, judicial appointments, law enforcement, and constitutional matters',
        'Progressive Alliance', 'Conservative Coalition',
        '{"Progressive Alliance": 5, "Conservative Coalition": 4, "Centrist Party": 3, "Libertarian Movement": 2, "Nationalist Party": 1}',
        'advisory'
      ),
      (
        1, 'Commerce Committee', 'standing',
        'Business regulation, trade policy, economic development, and market oversight',
        'Conservative Coalition', 'Centrist Party',
        '{"Conservative Coalition": 5, "Centrist Party": 4, "Progressive Alliance": 3, "Libertarian Movement": 2, "Nationalist Party": 1}',
        'advisory'
      ),
      (
        1, 'Science & Technology Committee', 'standing',
        'Research funding, innovation policy, technology regulation, and scientific advancement',
        'Progressive Alliance', 'Centrist Party',
        '{"Progressive Alliance": 4, "Centrist Party": 4, "Conservative Coalition": 3, "Libertarian Movement": 2, "Nationalist Party": 1}',
        'advisory'
      ),
      (
        1, 'Infrastructure Committee', 'standing',
        'Public works, transportation, utilities, urban planning, and infrastructure development',
        'Centrist Party', 'Progressive Alliance',
        '{"Centrist Party": 5, "Progressive Alliance": 4, "Conservative Coalition": 3, "Nationalist Party": 2, "Libertarian Movement": 1}',
        'advisory'
      ) ON CONFLICT DO NOTHING
    `);

    // Insert sample legislative proposals
    await client.query(`
      INSERT INTO legislative_proposals (
        campaign_id, proposal_type, proposal_title, proposal_summary, full_text,
        policy_category, sponsor_party, co_sponsors, committee_assignment,
        constitutional_analysis, impact_assessment, fiscal_impact,
        implementation_timeline, public_support_estimate, urgency_level
      ) VALUES 
      (
        1, 'bill', 'Interstellar Infrastructure Investment Act',
        'Comprehensive infrastructure investment program focusing on transportation networks, energy systems, and communication infrastructure across all planetary systems.',
        'A comprehensive bill authorizing 500 billion credits over 5 years for critical infrastructure development including: hyperspace transportation networks, quantum communication systems, renewable energy installations, and urban development projects.',
        'infrastructure', 'Progressive Alliance',
        '["Centrist Party", "Nationalist Party"]', 'Infrastructure Committee',
        'Constitutional analysis indicates full compliance with infrastructure development clauses. No constitutional concerns identified.',
        'Economic impact: +2.3% GDP growth over 5 years. Employment: +450,000 jobs. Infrastructure quality improvement: +35%. Regional development acceleration in outer systems.',
        '{"total_cost": 500000000000, "annual_cost": 100000000000, "revenue_sources": ["infrastructure_bonds", "carbon_tax", "corporate_tax_increase"], "roi_estimate": "3.2x over 10 years"}',
        '5 years phased implementation: Year 1-2 planning and design, Year 3-4 major construction, Year 5 completion and integration',
        72, 'important'
      ),
      (
        1, 'bill', 'Galactic Trade Enhancement Act',
        'Modernization of interstellar trade regulations to promote commerce while protecting domestic industries and workers.',
        'Legislation to streamline trade procedures, reduce bureaucratic barriers, establish new trade partnerships, while maintaining strategic protections for key domestic industries and implementing worker retraining programs.',
        'economic', 'Conservative Coalition',
        '["Centrist Party"]', 'Commerce Committee',
        'Constitutional trade regulation authority confirmed. Interstate commerce clause provides clear authorization.',
        'Trade volume increase: +18%. Domestic industry protection maintained. Worker displacement: -12% through retraining programs. International competitiveness: +25%.',
        '{"implementation_cost": 25000000000, "revenue_impact": "+45000000000 over 3 years", "trade_volume_increase": "18%"}',
        '3 years: Year 1 regulatory framework, Year 2 trade agreement negotiations, Year 3 full implementation',
        58, 'important'
      ),
      (
        1, 'resolution', 'Climate Emergency Response Resolution',
        'Declaration of climate emergency with immediate action plan for carbon neutrality and environmental protection.',
        'Non-binding resolution declaring climate emergency and establishing framework for immediate environmental action including carbon pricing, renewable energy mandates, and conservation programs.',
        'environmental', 'Progressive Alliance',
        '[]', 'Science & Technology Committee',
        'Resolution format appropriate for policy declaration. No constitutional implementation concerns.',
        'Environmental impact: -40% carbon emissions over 10 years. Economic transition cost: 200B credits. Green job creation: +300,000. Energy independence: +60%.',
        '{"transition_cost": 200000000000, "carbon_reduction": "40%", "renewable_target": "80%", "job_creation": 300000}',
        '10 years: Immediate action plan, 5-year major transitions, 10-year carbon neutrality target',
        65, 'urgent'
      ) ON CONFLICT DO NOTHING
    `);

    // Insert initial legislative analytics
    await client.query(`
      INSERT INTO legislative_analytics (
        campaign_id, analytics_date, total_proposals, proposals_passed, proposals_vetoed,
        leader_approval_rate, legislative_productivity_score, bipartisan_cooperation_score,
        public_confidence_in_legislature, party_performance, policy_area_activity
      ) VALUES (
        1, NOW(), 3, 0, 0, 0.0, 75, 68, 62.5,
        '{
          "Progressive Alliance": {"proposals_sponsored": 2, "success_rate": 0, "cooperation_score": 72},
          "Conservative Coalition": {"proposals_sponsored": 1, "success_rate": 0, "cooperation_score": 65},
          "Centrist Party": {"proposals_sponsored": 0, "success_rate": 0, "cooperation_score": 85},
          "Libertarian Movement": {"proposals_sponsored": 0, "success_rate": 0, "cooperation_score": 45},
          "Nationalist Party": {"proposals_sponsored": 0, "success_rate": 0, "cooperation_score": 38}
        }',
        '{
          "infrastructure": 1,
          "economic": 1,
          "environmental": 1,
          "social": 0,
          "security": 0,
          "international": 0
        }'
      ) ON CONFLICT DO NOTHING
    `);

    await client.query('COMMIT');
    console.log('✅ Legislative Bodies Advisory System schema initialized successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Legislative Bodies schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}
