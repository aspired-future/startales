import { Pool } from 'pg';

/**
 * Initialize Central Bank Advisory System database schema
 */
export async function initializeCentralBankSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Central Bank Policy Recommendations
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_policy_recommendations (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        recommendation_type VARCHAR(50) NOT NULL, -- 'interest_rate', 'inflation_target', 'liquidity_support', etc.
        recommendation_title VARCHAR(200) NOT NULL,
        recommendation_summary TEXT NOT NULL,
        detailed_analysis TEXT NOT NULL,
        recommended_action TEXT NOT NULL,
        economic_rationale TEXT NOT NULL,
        risk_assessment TEXT NOT NULL,
        implementation_timeline VARCHAR(100),
        confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 10),
        urgency_level VARCHAR(20) CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),
        supporting_data JSONB NOT NULL DEFAULT '{}',
        alternative_options JSONB NOT NULL DEFAULT '[]',
        international_precedents JSONB NOT NULL DEFAULT '[]',
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'modified', 'rejected')),
        leader_response TEXT,
        leader_decision VARCHAR(20) CHECK (leader_decision IN ('accept', 'modify', 'reject', 'defer')),
        implementation_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        reviewed_at TIMESTAMP,
        decided_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Monetary Policy Settings (Leader Decisions)
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_monetary_policy (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        policy_rate DECIMAL(5,2) NOT NULL,
        deposit_rate DECIMAL(5,2) NOT NULL,
        lending_rate DECIMAL(5,2) NOT NULL,
        inflation_target DECIMAL(4,2) NOT NULL,
        inflation_tolerance DECIMAL(4,2) NOT NULL,
        reserve_requirement DECIMAL(4,2) NOT NULL,
        policy_stance VARCHAR(20) CHECK (policy_stance IN ('accommodative', 'neutral', 'restrictive')),
        forward_guidance TEXT,
        last_change_date TIMESTAMP NOT NULL,
        last_change_rationale TEXT,
        next_review_date TIMESTAMP,
        decided_by VARCHAR(100) NOT NULL, -- 'leader', 'central_bank', 'emergency_protocol'
        recommendation_id INTEGER REFERENCES cb_policy_recommendations(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Financial Stability Assessments
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_stability_assessments (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        assessment_type VARCHAR(50) NOT NULL, -- 'banking_health', 'market_stability', 'systemic_risk', etc.
        assessment_title VARCHAR(200) NOT NULL,
        overall_rating VARCHAR(20) CHECK (overall_rating IN ('stable', 'watch', 'concern', 'critical')),
        key_findings TEXT NOT NULL,
        risk_factors JSONB NOT NULL DEFAULT '[]',
        stability_indicators JSONB NOT NULL DEFAULT '{}',
        trend_analysis TEXT NOT NULL,
        recommendations TEXT NOT NULL,
        monitoring_priorities JSONB NOT NULL DEFAULT '[]',
        international_comparison JSONB NOT NULL DEFAULT '{}',
        assessment_date TIMESTAMP NOT NULL,
        next_assessment_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Crisis Response Protocols
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_crisis_protocols (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        crisis_type VARCHAR(50) NOT NULL, -- 'banking_crisis', 'currency_crisis', 'liquidity_crisis', etc.
        protocol_name VARCHAR(200) NOT NULL,
        trigger_conditions JSONB NOT NULL DEFAULT '{}',
        response_steps JSONB NOT NULL DEFAULT '[]',
        authority_levels JSONB NOT NULL DEFAULT '{}', -- What CB can do vs. what requires leader approval
        coordination_requirements JSONB NOT NULL DEFAULT '{}',
        communication_strategy TEXT NOT NULL,
        success_criteria JSONB NOT NULL DEFAULT '{}',
        rollback_procedures JSONB NOT NULL DEFAULT '[]',
        last_updated TIMESTAMP DEFAULT NOW(),
        created_by VARCHAR(100) NOT NULL,
        approved_by VARCHAR(100),
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'active', 'deprecated'))
      )
    `);

    // Economic Research & Forecasts
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_economic_research (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        research_type VARCHAR(50) NOT NULL, -- 'forecast', 'policy_analysis', 'market_study', etc.
        research_title VARCHAR(200) NOT NULL,
        executive_summary TEXT NOT NULL,
        methodology TEXT NOT NULL,
        key_findings TEXT NOT NULL,
        policy_implications TEXT NOT NULL,
        forecast_data JSONB NOT NULL DEFAULT '{}',
        confidence_intervals JSONB NOT NULL DEFAULT '{}',
        assumptions JSONB NOT NULL DEFAULT '[]',
        limitations TEXT,
        publication_status VARCHAR(20) DEFAULT 'internal' CHECK (publication_status IN ('internal', 'restricted', 'public')),
        research_date TIMESTAMP NOT NULL,
        publication_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Leader-Central Bank Interactions
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_leader_interactions (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        interaction_type VARCHAR(50) NOT NULL, -- 'consultation', 'directive', 'override', 'approval', etc.
        interaction_summary TEXT NOT NULL,
        leader_position TEXT NOT NULL,
        cb_position TEXT,
        discussion_points JSONB NOT NULL DEFAULT '[]',
        agreements_reached JSONB NOT NULL DEFAULT '[]',
        disagreements JSONB NOT NULL DEFAULT '[]',
        follow_up_actions JSONB NOT NULL DEFAULT '[]',
        interaction_outcome VARCHAR(50) NOT NULL,
        confidentiality_level VARCHAR(20) DEFAULT 'internal' CHECK (confidentiality_level IN ('public', 'restricted', 'internal', 'classified')),
        interaction_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Central Bank Independence Metrics
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_independence_metrics (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        metric_date TIMESTAMP NOT NULL,
        analytical_independence_score INTEGER CHECK (analytical_independence_score BETWEEN 0 AND 100),
        policy_influence_score INTEGER CHECK (policy_influence_score BETWEEN 0 AND 100),
        public_credibility_score INTEGER CHECK (public_credibility_score BETWEEN 0 AND 100),
        international_reputation_score INTEGER CHECK (international_reputation_score BETWEEN 0 AND 100),
        recommendations_accepted INTEGER DEFAULT 0,
        recommendations_modified INTEGER DEFAULT 0,
        recommendations_rejected INTEGER DEFAULT 0,
        leader_overrides INTEGER DEFAULT 0,
        crisis_responses INTEGER DEFAULT 0,
        public_statements INTEGER DEFAULT 0,
        market_confidence_indicator DECIMAL(4,2),
        independence_factors JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Central Bank Communication Log
    await client.query(`
      CREATE TABLE IF NOT EXISTS cb_communications (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        communication_type VARCHAR(50) NOT NULL, -- 'policy_statement', 'press_release', 'speech', 'report', etc.
        communication_title VARCHAR(200) NOT NULL,
        communication_content TEXT NOT NULL,
        target_audience VARCHAR(100) NOT NULL, -- 'public', 'markets', 'government', 'international', etc.
        key_messages JSONB NOT NULL DEFAULT '[]',
        market_impact_expected VARCHAR(20) CHECK (market_impact_expected IN ('minimal', 'moderate', 'significant', 'major')),
        coordination_with_government BOOLEAN DEFAULT FALSE,
        leader_approval_required BOOLEAN DEFAULT FALSE,
        leader_approved BOOLEAN DEFAULT NULL,
        publication_date TIMESTAMP,
        communication_channels JSONB NOT NULL DEFAULT '[]',
        market_reaction JSONB NOT NULL DEFAULT '{}',
        effectiveness_score INTEGER CHECK (effectiveness_score BETWEEN 1 AND 10),
        created_at TIMESTAMP DEFAULT NOW(),
        published_at TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_cb_policy_recommendations_campaign_status 
      ON cb_policy_recommendations(campaign_id, status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_cb_monetary_policy_campaign_date 
      ON cb_monetary_policy(campaign_id, last_change_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_cb_stability_assessments_campaign_date 
      ON cb_stability_assessments(campaign_id, assessment_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_cb_crisis_protocols_campaign_type 
      ON cb_crisis_protocols(campaign_id, crisis_type, status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_cb_economic_research_campaign_type 
      ON cb_economic_research(campaign_id, research_type, research_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_cb_leader_interactions_campaign_date 
      ON cb_leader_interactions(campaign_id, interaction_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_cb_independence_metrics_campaign_date 
      ON cb_independence_metrics(campaign_id, metric_date DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_cb_communications_campaign_date 
      ON cb_communications(campaign_id, publication_date DESC);
    `);

    // Insert default monetary policy settings
    await client.query(`
      INSERT INTO cb_monetary_policy (
        campaign_id, policy_rate, deposit_rate, lending_rate, inflation_target, 
        inflation_tolerance, reserve_requirement, policy_stance, forward_guidance,
        last_change_date, last_change_rationale, decided_by
      ) VALUES (
        1, 2.50, 1.50, 3.50, 2.00, 0.50, 10.00, 'neutral',
        'The Central Bank will maintain current policy stance while monitoring economic developments.',
        NOW(), 'Initial policy settings established', 'central_bank'
      ) ON CONFLICT DO NOTHING
    `);

    // Insert default crisis protocols
    await client.query(`
      INSERT INTO cb_crisis_protocols (
        campaign_id, crisis_type, protocol_name, trigger_conditions, response_steps,
        authority_levels, coordination_requirements, communication_strategy,
        success_criteria, created_by, status
      ) VALUES 
      (
        1, 'banking_crisis', 'Banking System Crisis Response',
        '{"bank_failures": 2, "liquidity_shortage": "severe", "market_panic": true}',
        '[
          {"step": 1, "action": "Assess system-wide impact", "authority": "central_bank", "duration": "immediate"},
          {"step": 2, "action": "Recommend emergency liquidity support", "authority": "central_bank", "duration": "1 hour"},
          {"step": 3, "action": "Coordinate with Treasury on fiscal response", "authority": "joint", "duration": "2 hours"},
          {"step": 4, "action": "Implement market stabilization measures", "authority": "leader_approval", "duration": "4 hours"}
        ]',
        '{"emergency_lending": "central_bank", "interest_rate_changes": "leader_approval", "market_intervention": "leader_approval"}',
        '{"treasury": "fiscal_support", "communications": "public_messaging", "defense": "security_assessment"}',
        'Immediate public communication emphasizing Central Bank readiness to provide liquidity support and maintain financial stability.',
        '{"banking_system_stability": "restored", "market_confidence": "stabilized", "liquidity_conditions": "normalized"}',
        'central_bank', 'approved'
      ),
      (
        1, 'currency_crisis', 'Currency Crisis Management Protocol',
        '{"exchange_rate_volatility": "extreme", "capital_outflows": "massive", "foreign_reserves": "critical"}',
        '[
          {"step": 1, "action": "Emergency assessment of currency pressures", "authority": "central_bank", "duration": "immediate"},
          {"step": 2, "action": "Recommend interest rate response", "authority": "central_bank", "duration": "30 minutes"},
          {"step": 3, "action": "Coordinate international support", "authority": "joint", "duration": "2 hours"},
          {"step": 4, "action": "Implement currency stabilization measures", "authority": "leader_approval", "duration": "6 hours"}
        ]',
        '{"market_intervention": "leader_approval", "international_coordination": "joint", "emergency_rates": "central_bank"}',
        '{"treasury": "fiscal_coordination", "state": "international_support", "communications": "market_messaging"}',
        'Coordinated communication strategy emphasizing government commitment to currency stability and available policy tools.',
        '{"exchange_rate_stability": "achieved", "capital_flows": "stabilized", "market_confidence": "restored"}',
        'central_bank', 'approved'
      ),
      (
        1, 'inflation_crisis', 'Inflation Crisis Response Protocol',
        '{"inflation_rate": ">5%", "inflation_expectations": "unanchored", "wage_price_spiral": "emerging"}',
        '[
          {"step": 1, "action": "Comprehensive inflation analysis", "authority": "central_bank", "duration": "2 hours"},
          {"step": 2, "action": "Recommend aggressive policy tightening", "authority": "central_bank", "duration": "4 hours"},
          {"step": 3, "action": "Coordinate with fiscal authorities", "authority": "joint", "duration": "6 hours"},
          {"step": 4, "action": "Implement anti-inflation measures", "authority": "leader_approval", "duration": "24 hours"}
        ]',
        '{"interest_rate_increases": "central_bank", "reserve_requirements": "central_bank", "fiscal_coordination": "joint"}',
        '{"treasury": "fiscal_restraint", "communications": "expectation_management", "commerce": "price_monitoring"}',
        'Strong communication emphasizing Central Bank commitment to price stability and willingness to take necessary measures.',
        '{"inflation_rate": "<3%", "inflation_expectations": "anchored", "price_stability": "restored"}',
        'central_bank', 'approved'
      ) ON CONFLICT DO NOTHING
    `);

    // Insert initial independence metrics
    await client.query(`
      INSERT INTO cb_independence_metrics (
        campaign_id, metric_date, analytical_independence_score, policy_influence_score,
        public_credibility_score, international_reputation_score, market_confidence_indicator,
        independence_factors
      ) VALUES (
        1, NOW(), 85, 70, 78, 82, 7.5,
        '{
          "legal_framework": "strong",
          "appointment_process": "merit_based",
          "term_security": "protected",
          "budget_autonomy": "partial",
          "policy_transparency": "high",
          "international_cooperation": "active"
        }'
      ) ON CONFLICT DO NOTHING
    `);

    await client.query('COMMIT');
    console.log('✅ Central Bank Advisory System schema initialized successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Central Bank schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}
