import { Pool } from 'pg';

/**
 * Initialize Media Control System Database Schema
 * Comprehensive media oversight, regulation, and control system
 */
export async function initializeMediaControlSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Media Outlets - Individual news organizations and their properties
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_outlets (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        
        -- Basic Information
        outlet_name TEXT NOT NULL,
        outlet_type TEXT NOT NULL CHECK (outlet_type IN (
          'state_owned', 'private_independent', 'corporate', 'foreign',
          'public_broadcaster', 'community', 'online_only', 'print_only',
          'broadcast_tv', 'radio', 'news_agency', 'social_media'
        )),
        
        -- Ownership and Control
        ownership_structure TEXT NOT NULL CHECK (ownership_structure IN (
          'government', 'private_individual', 'corporate', 'foreign_entity',
          'non_profit', 'public_trust', 'cooperative', 'mixed'
        )),
        primary_owner TEXT,
        government_stake DECIMAL(5,2) DEFAULT 0.00, -- 0-100%
        
        -- Media Properties
        credibility_rating DECIMAL(3,2) DEFAULT 0.75, -- 0.00-1.00
        political_bias DECIMAL(3,2) DEFAULT 0.00, -- -1.00 (left) to 1.00 (right)
        audience_reach INTEGER DEFAULT 0,
        influence_score DECIMAL(3,2) DEFAULT 0.50, -- 0.00-1.00
        
        -- Government Relations
        government_license_status TEXT DEFAULT 'active' CHECK (government_license_status IN (
          'active', 'suspended', 'revoked', 'pending', 'conditional', 'expired'
        )),
        license_expiry_date DATE,
        compliance_score DECIMAL(3,2) DEFAULT 1.00, -- 0.00-1.00
        government_funding DECIMAL(15,2) DEFAULT 0.00,
        
        -- Content Characteristics
        content_focus TEXT[] DEFAULT '{}', -- news, entertainment, sports, etc.
        target_demographics JSONB DEFAULT '{}',
        content_quality_score DECIMAL(3,2) DEFAULT 0.70,
        fact_checking_standards TEXT DEFAULT 'basic' CHECK (fact_checking_standards IN (
          'none', 'basic', 'standard', 'rigorous', 'exemplary'
        )),
        
        -- Operational Status
        status TEXT DEFAULT 'active' CHECK (status IN (
          'active', 'inactive', 'suspended', 'shutdown', 'under_review'
        )),
        employees_count INTEGER DEFAULT 0,
        journalists_count INTEGER DEFAULT 0,
        
        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        
        -- Indexes
        UNIQUE(campaign_id, outlet_name)
      )
    `);

    // Media Policies - Government media regulations and guidelines
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_policies (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        
        -- Policy Information
        policy_name TEXT NOT NULL,
        policy_type TEXT NOT NULL CHECK (policy_type IN (
          'licensing', 'content_regulation', 'censorship', 'funding',
          'ownership_limits', 'journalist_accreditation', 'emergency_powers',
          'foreign_media_restrictions', 'propaganda_guidelines', 'transparency_requirements'
        )),
        
        -- Policy Details
        description TEXT NOT NULL,
        legal_authority TEXT,
        enforcement_mechanism TEXT,
        
        -- Scope and Application
        applies_to TEXT[] DEFAULT '{}', -- outlet types this applies to
        content_categories TEXT[] DEFAULT '{}', -- what content is affected
        geographic_scope TEXT DEFAULT 'national' CHECK (geographic_scope IN (
          'national', 'regional', 'local', 'international', 'specific_outlets'
        )),
        
        -- Control Parameters
        control_intensity DECIMAL(3,2) DEFAULT 0.50, -- 0.00-1.00
        enforcement_strictness DECIMAL(3,2) DEFAULT 0.50, -- 0.00-1.00
        penalty_severity TEXT DEFAULT 'moderate' CHECK (penalty_severity IN (
          'warning', 'fine', 'moderate', 'severe', 'closure'
        )),
        
        -- Implementation
        implementation_date DATE NOT NULL,
        review_date DATE,
        status TEXT DEFAULT 'active' CHECK (status IN (
          'draft', 'active', 'suspended', 'repealed', 'under_review'
        )),
        
        -- Impact Tracking
        compliance_rate DECIMAL(5,2) DEFAULT 100.00,
        violations_count INTEGER DEFAULT 0,
        appeals_count INTEGER DEFAULT 0,
        
        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Media Licenses - Government licensing and approval system
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_licenses (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        outlet_id TEXT NOT NULL REFERENCES media_outlets(id) ON DELETE CASCADE,
        
        -- License Information
        license_type TEXT NOT NULL CHECK (license_type IN (
          'broadcast_tv', 'broadcast_radio', 'cable_tv', 'satellite',
          'internet_streaming', 'print_publication', 'news_agency',
          'journalist_accreditation', 'foreign_correspondent', 'press_access'
        )),
        license_number TEXT UNIQUE,
        
        -- License Details
        issued_date DATE NOT NULL,
        expiry_date DATE NOT NULL,
        renewal_date DATE,
        status TEXT DEFAULT 'active' CHECK (status IN (
          'active', 'expired', 'suspended', 'revoked', 'pending_renewal'
        )),
        
        -- Conditions and Restrictions
        license_conditions TEXT[] DEFAULT '{}',
        content_restrictions TEXT[] DEFAULT '{}',
        geographic_limitations TEXT[] DEFAULT '{}',
        technical_requirements JSONB DEFAULT '{}',
        
        -- Compliance and Monitoring
        compliance_checks_required BOOLEAN DEFAULT true,
        last_compliance_check DATE,
        compliance_status TEXT DEFAULT 'compliant' CHECK (compliance_status IN (
          'compliant', 'minor_violations', 'major_violations', 'non_compliant'
        )),
        
        -- Financial Obligations
        license_fee DECIMAL(15,2) DEFAULT 0.00,
        annual_fee DECIMAL(15,2) DEFAULT 0.00,
        penalty_fees DECIMAL(15,2) DEFAULT 0.00,
        
        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Censorship Logs - Track censored content and decisions
    await client.query(`
      CREATE TABLE IF NOT EXISTS censorship_logs (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        outlet_id TEXT REFERENCES media_outlets(id) ON DELETE SET NULL,
        
        -- Content Information
        content_type TEXT NOT NULL CHECK (content_type IN (
          'news_article', 'editorial', 'opinion_piece', 'investigation',
          'live_broadcast', 'interview', 'documentary', 'advertisement',
          'social_media_post', 'press_release', 'book', 'magazine'
        )),
        content_title TEXT,
        content_summary TEXT,
        content_url TEXT,
        
        -- Censorship Action
        action_type TEXT NOT NULL CHECK (action_type IN (
          'pre_publication_block', 'post_publication_removal', 'content_modification',
          'warning_issued', 'editorial_guidance', 'topic_ban', 'source_restriction'
        )),
        censorship_reason TEXT NOT NULL,
        legal_justification TEXT,
        
        -- Decision Details
        decision_maker TEXT, -- government official/department
        decision_date TIMESTAMP NOT NULL DEFAULT NOW(),
        review_status TEXT DEFAULT 'final' CHECK (review_status IN (
          'pending', 'under_review', 'appealed', 'upheld', 'overturned', 'final'
        )),
        
        -- Content Categories
        sensitive_topics TEXT[] DEFAULT '{}',
        affected_parties TEXT[] DEFAULT '{}',
        security_classification TEXT DEFAULT 'unclassified' CHECK (security_classification IN (
          'unclassified', 'restricted', 'confidential', 'secret', 'top_secret'
        )),
        
        -- Impact Assessment
        public_interest_score DECIMAL(3,2) DEFAULT 0.50,
        potential_harm_score DECIMAL(3,2) DEFAULT 0.50,
        democratic_impact DECIMAL(3,2) DEFAULT 0.50,
        
        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Propaganda Campaigns - State media campaigns and messaging
    await client.query(`
      CREATE TABLE IF NOT EXISTS propaganda_campaigns (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        
        -- Campaign Information
        campaign_name TEXT NOT NULL,
        campaign_type TEXT NOT NULL CHECK (campaign_type IN (
          'public_information', 'policy_promotion', 'patriotic_messaging',
          'counter_narrative', 'crisis_communication', 'election_support',
          'international_image', 'domestic_unity', 'economic_confidence', 'security_awareness'
        )),
        
        -- Campaign Details
        description TEXT NOT NULL,
        primary_message TEXT NOT NULL,
        key_talking_points TEXT[] DEFAULT '{}',
        target_audience TEXT[] DEFAULT '{}',
        
        -- Strategy and Channels
        media_channels TEXT[] DEFAULT '{}',
        messaging_strategy TEXT,
        content_themes TEXT[] DEFAULT '{}',
        visual_identity JSONB DEFAULT '{}',
        
        -- Timeline and Budget
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        total_budget DECIMAL(15,2) DEFAULT 0.00,
        spent_budget DECIMAL(15,2) DEFAULT 0.00,
        
        -- Performance Metrics
        target_reach INTEGER DEFAULT 0,
        actual_reach INTEGER DEFAULT 0,
        engagement_rate DECIMAL(5,2) DEFAULT 0.00,
        message_retention DECIMAL(5,2) DEFAULT 0.00,
        public_approval_change DECIMAL(5,2) DEFAULT 0.00,
        
        -- Effectiveness Tracking
        effectiveness_score DECIMAL(3,2) DEFAULT 0.50,
        credibility_impact DECIMAL(3,2) DEFAULT 0.00, -- can be negative
        opposition_response TEXT,
        international_reaction TEXT,
        
        -- Status
        status TEXT DEFAULT 'planning' CHECK (status IN (
          'planning', 'active', 'paused', 'completed', 'cancelled', 'under_review'
        )),
        
        -- Timestamps
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Press Conferences - Leader and Press Secretary managed events
    await client.query(`
      CREATE TABLE IF NOT EXISTS press_conferences (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        
        -- Basic Information
        title TEXT NOT NULL,
        description TEXT,
        scheduled_date TIMESTAMP NOT NULL,
        duration_minutes INTEGER DEFAULT 60,
        status TEXT DEFAULT 'scheduled' CHECK (status IN (
          'scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'
        )),
        
        -- Presenter Information
        presenter_type TEXT NOT NULL CHECK (presenter_type IN (
          'leader_personal', 'press_secretary', 'cabinet_member', 'spokesperson'
        )),
        presenter_character_id TEXT, -- References character system
        presenter_name TEXT NOT NULL,
        
        -- Event Details
        location TEXT DEFAULT 'Presidential Press Room',
        expected_attendees INTEGER DEFAULT 50,
        media_outlets_invited TEXT[] DEFAULT '{}',
        topics TEXT[] DEFAULT '{}',
        prepared_statements TEXT[] DEFAULT '{}',
        
        -- Interaction Metrics
        questions_asked INTEGER DEFAULT 0,
        questions_answered INTEGER DEFAULT 0,
        hostile_questions INTEGER DEFAULT 0,
        follow_up_questions INTEGER DEFAULT 0,
        
        -- Impact and Effectiveness
        media_coverage_score DECIMAL(3,2) DEFAULT 0.50, -- 0.00-1.00
        public_reception_score DECIMAL(3,2) DEFAULT 0.50, -- 0.00-1.00
        message_clarity_score DECIMAL(3,2) DEFAULT 0.50, -- 0.00-1.00
        credibility_impact DECIMAL(3,2) DEFAULT 0.00, -- -1.00 to 1.00
        approval_rating_impact DECIMAL(3,2) DEFAULT 0.00, -- -1.00 to 1.00
        
        -- Leader vs Press Secretary Effects
        leader_presence_bonus DECIMAL(3,2) DEFAULT 0.00, -- Additional impact when leader presents
        authenticity_score DECIMAL(3,2) DEFAULT 0.50, -- Higher for leader, lower for secretary
        political_risk DECIMAL(3,2) DEFAULT 0.30, -- Higher for leader presentations
        
        -- Media Relations Impact
        journalist_satisfaction DECIMAL(3,2) DEFAULT 0.50,
        transparency_perception DECIMAL(3,2) DEFAULT 0.50,
        access_quality_rating DECIMAL(3,2) DEFAULT 0.50,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Press Conference Questions - Individual questions and responses
    await client.query(`
      CREATE TABLE IF NOT EXISTS press_conference_questions (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        press_conference_id TEXT NOT NULL REFERENCES press_conferences(id) ON DELETE CASCADE,
        
        -- Question Details
        question_number INTEGER NOT NULL,
        journalist_name TEXT NOT NULL,
        media_outlet TEXT NOT NULL,
        question_text TEXT NOT NULL,
        question_category TEXT CHECK (question_category IN (
          'policy', 'personal', 'scandal', 'foreign_policy', 'economy', 
          'domestic', 'follow_up', 'hostile', 'softball', 'technical'
        )),
        
        -- Response Details
        answered BOOLEAN DEFAULT FALSE,
        response_text TEXT,
        response_quality TEXT CHECK (response_quality IN (
          'excellent', 'good', 'adequate', 'poor', 'evasive', 'no_answer'
        )),
        response_duration_seconds INTEGER DEFAULT 0,
        
        -- Impact Assessment
        question_difficulty DECIMAL(3,2) DEFAULT 0.50, -- 0.00-1.00
        public_interest_level DECIMAL(3,2) DEFAULT 0.50,
        media_follow_up_likelihood DECIMAL(3,2) DEFAULT 0.30,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Press Secretary Characters - Links to character system
    await client.query(`
      CREATE TABLE IF NOT EXISTS press_secretaries (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        character_id TEXT NOT NULL, -- References character system
        
        -- Secretary Information
        name TEXT NOT NULL,
        title TEXT DEFAULT 'Press Secretary',
        appointment_date DATE NOT NULL,
        status TEXT DEFAULT 'active' CHECK (status IN (
          'active', 'resigned', 'fired', 'on_leave', 'interim'
        )),
        
        -- Skills and Effectiveness
        communication_skill DECIMAL(3,2) DEFAULT 0.70, -- 0.00-1.00
        media_relations_skill DECIMAL(3,2) DEFAULT 0.65,
        crisis_management_skill DECIMAL(3,2) DEFAULT 0.60,
        policy_knowledge DECIMAL(3,2) DEFAULT 0.55,
        charisma DECIMAL(3,2) DEFAULT 0.60,
        
        -- Performance Metrics
        press_conferences_held INTEGER DEFAULT 0,
        average_approval_rating DECIMAL(3,2) DEFAULT 0.50,
        media_relationship_score DECIMAL(3,2) DEFAULT 0.50,
        controversy_incidents INTEGER DEFAULT 0,
        successful_crisis_responses INTEGER DEFAULT 0,
        
        -- Comparison to Leader
        effectiveness_vs_leader DECIMAL(3,2) DEFAULT 0.75, -- Secretary effectiveness relative to leader
        credibility_vs_leader DECIMAL(3,2) DEFAULT 0.65,
        media_trust_vs_leader DECIMAL(3,2) DEFAULT 0.70,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Media Control Knobs - Enhanced with 30 parameters including press conference management
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_control_knobs (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL UNIQUE,
        
        -- Press Freedom and Control (1-6)
        press_freedom_level DECIMAL(3,2) DEFAULT 0.75,
        censorship_intensity DECIMAL(3,2) DEFAULT 0.25,
        government_media_influence DECIMAL(3,2) DEFAULT 0.30,
        propaganda_effectiveness DECIMAL(3,2) DEFAULT 0.50,
        information_transparency DECIMAL(3,2) DEFAULT 0.70,
        journalist_safety_protection DECIMAL(3,2) DEFAULT 0.80,
        
        -- Content and Editorial Control (7-12)
        editorial_independence DECIMAL(3,2) DEFAULT 0.65,
        content_diversity_promotion DECIMAL(3,2) DEFAULT 0.60,
        fact_checking_enforcement DECIMAL(3,2) DEFAULT 0.70,
        misinformation_countermeasures DECIMAL(3,2) DEFAULT 0.55,
        investigative_journalism_support DECIMAL(3,2) DEFAULT 0.50,
        public_interest_prioritization DECIMAL(3,2) DEFAULT 0.60,
        
        -- Regulatory and Legal Framework (13-18)
        licensing_strictness DECIMAL(3,2) DEFAULT 0.40,
        ownership_concentration_limits DECIMAL(3,2) DEFAULT 0.50,
        foreign_media_restrictions DECIMAL(3,2) DEFAULT 0.30,
        media_funding_transparency DECIMAL(3,2) DEFAULT 0.65,
        regulatory_enforcement_consistency DECIMAL(3,2) DEFAULT 0.70,
        appeal_process_fairness DECIMAL(3,2) DEFAULT 0.75,
        
        -- Crisis and Emergency Powers (19-24)
        emergency_broadcast_authority DECIMAL(3,2) DEFAULT 0.60,
        crisis_information_control DECIMAL(3,2) DEFAULT 0.45,
        national_security_exemptions DECIMAL(3,2) DEFAULT 0.40,
        wartime_media_restrictions DECIMAL(3,2) DEFAULT 0.35,
        public_safety_override_authority DECIMAL(3,2) DEFAULT 0.50,
        international_media_coordination DECIMAL(3,2) DEFAULT 0.45,
        
        -- Press Conference Management (25-30)
        press_conference_frequency DECIMAL(3,2) DEFAULT 0.60, -- How often conferences are held
        leader_personal_appearance_rate DECIMAL(3,2) DEFAULT 0.40, -- How often leader vs secretary
        press_access_level DECIMAL(3,2) DEFAULT 0.70, -- Media access to events
        question_screening_intensity DECIMAL(3,2) DEFAULT 0.30, -- Pre-screening of questions
        hostile_question_management DECIMAL(3,2) DEFAULT 0.50, -- Handling difficult questions
        message_coordination_effectiveness DECIMAL(3,2) DEFAULT 0.65, -- Consistent messaging across events
        
        -- Timestamps
        last_updated BIGINT DEFAULT EXTRACT(epoch FROM NOW()) * 1000,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_media_outlets_campaign_id ON media_outlets(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_media_outlets_type ON media_outlets(outlet_type);
      CREATE INDEX IF NOT EXISTS idx_media_outlets_status ON media_outlets(status);
      
      CREATE INDEX IF NOT EXISTS idx_media_policies_campaign_id ON media_policies(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_media_policies_type ON media_policies(policy_type);
      CREATE INDEX IF NOT EXISTS idx_media_policies_status ON media_policies(status);
      
      CREATE INDEX IF NOT EXISTS idx_media_licenses_campaign_id ON media_licenses(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_media_licenses_outlet_id ON media_licenses(outlet_id);
      CREATE INDEX IF NOT EXISTS idx_media_licenses_status ON media_licenses(status);
      
      CREATE INDEX IF NOT EXISTS idx_censorship_logs_campaign_id ON censorship_logs(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_censorship_logs_outlet_id ON censorship_logs(outlet_id);
      CREATE INDEX IF NOT EXISTS idx_censorship_logs_date ON censorship_logs(decision_date);
      
      CREATE INDEX IF NOT EXISTS idx_propaganda_campaigns_campaign_id ON propaganda_campaigns(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_propaganda_campaigns_status ON propaganda_campaigns(status);
      CREATE INDEX IF NOT EXISTS idx_propaganda_campaigns_dates ON propaganda_campaigns(start_date, end_date);
      
      CREATE INDEX IF NOT EXISTS idx_media_control_knobs_campaign_id ON media_control_knobs(campaign_id);
    `);

    await client.query('COMMIT');
    console.log('✅ Media Control System schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Media Control System schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Insert seed data for Media Control System
 */
export async function insertMediaControlSeedData(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Get existing campaign IDs
    const campaignsResult = await client.query('SELECT id FROM campaigns LIMIT 5');
    const campaignIds = campaignsResult.rows.map(row => row.id);
    
    if (campaignIds.length === 0) {
      console.log('⚠️ No campaigns found, skipping Media Control seed data');
      await client.query('ROLLBACK');
      return;
    }

    // Insert sample media outlets for each campaign
    for (const campaignId of campaignIds) {
      // Major News Network (State-influenced)
      await client.query(`
        INSERT INTO media_outlets (
          campaign_id, outlet_name, outlet_type, ownership_structure, primary_owner,
          government_stake, credibility_rating, political_bias, audience_reach, influence_score,
          government_license_status, compliance_score, government_funding, content_focus,
          fact_checking_standards, employees_count, journalists_count
        ) VALUES (
          $1, 'Galactic News Network', 'public_broadcaster', 'public_trust', 'Public Broadcasting Authority',
          25.00, 0.85, 0.10, 50000000, 0.90,
          'active', 0.95, 500000000.00, ARRAY['news', 'politics', 'international'],
          'rigorous', 2500, 450
        ) ON CONFLICT (campaign_id, outlet_name) DO NOTHING
      `, [campaignId]);

      // Independent News Service
      await client.query(`
        INSERT INTO media_outlets (
          campaign_id, outlet_name, outlet_type, ownership_structure, primary_owner,
          government_stake, credibility_rating, political_bias, audience_reach, influence_score,
          government_license_status, compliance_score, content_focus,
          fact_checking_standards, employees_count, journalists_count
        ) VALUES (
          $1, 'Independent News Service', 'private_independent', 'private_individual', 'Marcus Chen Media Group',
          0.00, 0.78, -0.15, 25000000, 0.70,
          'active', 0.88, ARRAY['news', 'investigation', 'local'],
          'standard', 800, 150
        ) ON CONFLICT (campaign_id, outlet_name) DO NOTHING
      `, [campaignId]);

      // Corporate Media Corporation
      await client.query(`
        INSERT INTO media_outlets (
          campaign_id, outlet_name, outlet_type, ownership_structure, primary_owner,
          government_stake, credibility_rating, political_bias, audience_reach, influence_score,
          government_license_status, compliance_score, content_focus,
          fact_checking_standards, employees_count, journalists_count
        ) VALUES (
          $1, 'Stellar Communications Corp', 'corporate', 'corporate', 'Stellar Industries Ltd',
          5.00, 0.72, 0.30, 35000000, 0.75,
          'active', 0.82, ARRAY['news', 'business', 'entertainment'],
          'basic', 1200, 200
        ) ON CONFLICT (campaign_id, outlet_name) DO NOTHING
      `, [campaignId]);

      // State-Owned Propaganda Network
      await client.query(`
        INSERT INTO media_outlets (
          campaign_id, outlet_name, outlet_type, ownership_structure, primary_owner,
          government_stake, credibility_rating, political_bias, audience_reach, influence_score,
          government_license_status, compliance_score, government_funding, content_focus,
          fact_checking_standards, employees_count, journalists_count
        ) VALUES (
          $1, 'National Information Service', 'state_owned', 'government', 'Ministry of Information',
          100.00, 0.65, 0.45, 40000000, 0.80,
          'active', 1.00, 800000000.00, ARRAY['news', 'government', 'patriotic'],
          'basic', 1500, 250
        ) ON CONFLICT (campaign_id, outlet_name) DO NOTHING
      `, [campaignId]);

      // Insert sample media policies
      await client.query(`
        INSERT INTO media_policies (
          campaign_id, policy_name, policy_type, description, legal_authority,
          enforcement_mechanism, applies_to, control_intensity, enforcement_strictness,
          implementation_date, status
        ) VALUES (
          $1, 'Broadcasting Licensing Act', 'licensing', 'Mandatory licensing for all broadcast media outlets',
          'Media Regulation Authority', 'License suspension/revocation',
          ARRAY['broadcast_tv', 'broadcast_radio'], 0.60, 0.70,
          CURRENT_DATE - INTERVAL '1 year', 'active'
        )
      `, [campaignId]);

      await client.query(`
        INSERT INTO media_policies (
          campaign_id, policy_name, policy_type, description, legal_authority,
          enforcement_mechanism, applies_to, control_intensity, enforcement_strictness,
          implementation_date, status
        ) VALUES (
          $1, 'National Security Information Guidelines', 'content_regulation', 
          'Restrictions on reporting classified or sensitive national security information',
          'National Security Council', 'Content removal and penalties',
          ARRAY['state_owned', 'private_independent', 'corporate'], 0.75, 0.85,
          CURRENT_DATE - INTERVAL '6 months', 'active'
        )
      `, [campaignId]);

      // Insert sample press secretary
      await client.query(`
        INSERT INTO press_secretaries (
          campaign_id, character_id, name, title, appointment_date,
          communication_skill, media_relations_skill, crisis_management_skill,
          policy_knowledge, charisma, effectiveness_vs_leader, credibility_vs_leader, media_trust_vs_leader
        ) VALUES (
          $1, 'press_secretary_001', 'Sarah Mitchell', 'White House Press Secretary', CURRENT_DATE - INTERVAL '6 months',
          0.85, 0.80, 0.75, 0.70, 0.78, 0.75, 0.65, 0.70
        ) ON CONFLICT (campaign_id, character_id) DO NOTHING
      `, [campaignId]);

      // Insert sample press conferences
      await client.query(`
        INSERT INTO press_conferences (
          campaign_id, title, description, scheduled_date, duration_minutes, status,
          presenter_type, presenter_character_id, presenter_name, location, expected_attendees,
          topics, questions_asked, questions_answered, media_coverage_score, public_reception_score,
          message_clarity_score, authenticity_score, political_risk, journalist_satisfaction
        ) VALUES 
        (
          $1, 'Economic Policy Briefing', 'Weekly briefing on new economic initiatives and market outlook',
          NOW() + INTERVAL '2 days', 45, 'scheduled',
          'press_secretary', 'press_secretary_001', 'Sarah Mitchell', 'White House Press Room', 75,
          ARRAY['economy', 'policy', 'markets'], 0, 0, 0.50, 0.50, 0.50, 0.65, 0.25, 0.50
        ),
        (
          $1, 'Foreign Policy Address', 'Leader addresses recent diplomatic developments',
          NOW() + INTERVAL '1 week', 30, 'scheduled',
          'leader_personal', NULL, 'President', 'Oval Office', 25,
          ARRAY['foreign_policy', 'diplomacy', 'security'], 0, 0, 0.50, 0.50, 0.50, 0.90, 0.65, 0.50
        ),
        (
          $1, 'Infrastructure Update', 'Progress report on national infrastructure projects',
          NOW() - INTERVAL '3 days', 60, 'completed',
          'press_secretary', 'press_secretary_001', 'Sarah Mitchell', 'White House Press Room', 80,
          ARRAY['infrastructure', 'domestic', 'progress'], 15, 12, 0.72, 0.68, 0.75, 0.65, 0.30, 0.70
        )
        ON CONFLICT DO NOTHING
      `, [campaignId]);

      // Insert enhanced media control knobs (30 parameters including press conference management)
      await client.query(`
        INSERT INTO media_control_knobs (
          campaign_id, press_freedom_level, censorship_intensity, government_media_influence,
          propaganda_effectiveness, information_transparency, journalist_safety_protection,
          editorial_independence, content_diversity_promotion, fact_checking_enforcement,
          misinformation_countermeasures, investigative_journalism_support, public_interest_prioritization,
          licensing_strictness, ownership_concentration_limits, foreign_media_restrictions,
          media_funding_transparency, regulatory_enforcement_consistency, appeal_process_fairness,
          emergency_broadcast_authority, crisis_information_control, national_security_exemptions,
          wartime_media_restrictions, public_safety_override_authority, international_media_coordination,
          press_conference_frequency, leader_personal_appearance_rate, press_access_level,
          question_screening_intensity, hostile_question_management, message_coordination_effectiveness
        ) VALUES (
          $1, 0.75, 0.25, 0.30, 0.50, 0.70, 0.80,
          0.65, 0.60, 0.70, 0.55, 0.50, 0.60,
          0.40, 0.50, 0.30, 0.65, 0.70, 0.75,
          0.60, 0.45, 0.40, 0.35, 0.50, 0.45,
          0.60, 0.40, 0.70, 0.30, 0.50, 0.65
        ) ON CONFLICT (campaign_id) DO NOTHING
      `, [campaignId]);
    }

    await client.query('COMMIT');
    console.log('✅ Media Control System seed data inserted successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Media Control System seed data insertion failed:', error);
    throw error;
  } finally {
    client.release();
  }
}
