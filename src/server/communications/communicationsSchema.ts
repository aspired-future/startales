import { Pool } from 'pg';

/**
 * Initialize Communications Secretary database schema
 */
export async function initializeCommunicationsSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Communications Operations - Core operational activities
    await client.query(`
      CREATE TABLE IF NOT EXISTS communications_operations (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        operation_type TEXT NOT NULL CHECK (operation_type IN (
          'media_strategy', 'press_conference', 'public_messaging',
          'propaganda_campaign', 'crisis_communication', 'media_relations',
          'information_policy', 'coverage_monitoring', 'message_coordination'
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
        target_audiences TEXT[] DEFAULT '{}',
        media_channels TEXT[] DEFAULT '{}',
        expected_reach INTEGER DEFAULT 0,
        
        -- Timeline
        planned_start_date TIMESTAMP,
        actual_start_date TIMESTAMP,
        planned_completion_date TIMESTAMP,
        actual_completion_date TIMESTAMP,
        
        -- Results and Impact
        success_metrics JSONB DEFAULT '{}',
        actual_outcomes JSONB DEFAULT '{}',
        public_response JSONB DEFAULT '{}',
        media_coverage_analysis JSONB DEFAULT '{}',
        
        -- Approval and Authorization
        authorized_by TEXT NOT NULL,
        approval_level TEXT NOT NULL DEFAULT 'secretary' CHECK (approval_level IN (
          'secretary', 'deputy', 'director', 'leader'
        )),
        
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Media Strategies - Government media campaigns and strategies
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_strategies (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        strategy_name TEXT NOT NULL,
        strategy_type TEXT NOT NULL CHECK (strategy_type IN (
          'public_relations', 'propaganda', 'crisis_management', 'policy_promotion',
          'reputation_management', 'counter_messaging', 'international_outreach',
          'domestic_engagement', 'election_campaign', 'emergency_response'
        )),
        
        -- Strategy Details
        description TEXT NOT NULL,
        objectives JSONB NOT NULL DEFAULT '[]',
        target_demographics JSONB NOT NULL DEFAULT '{}',
        key_messages TEXT[] DEFAULT '{}',
        
        -- Channel Strategy
        primary_channels TEXT[] DEFAULT '{}',
        secondary_channels TEXT[] DEFAULT '{}',
        channel_priorities JSONB DEFAULT '{}',
        
        -- Timeline and Budget
        strategy_duration_days INTEGER NOT NULL DEFAULT 30,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        allocated_budget DECIMAL(15,2) DEFAULT 0.00,
        spent_budget DECIMAL(15,2) DEFAULT 0.00,
        
        -- Performance Metrics
        target_reach INTEGER DEFAULT 0,
        actual_reach INTEGER DEFAULT 0,
        engagement_target DECIMAL(5,2) DEFAULT 0.00,
        actual_engagement DECIMAL(5,2) DEFAULT 0.00,
        sentiment_target DECIMAL(5,2) DEFAULT 0.00,
        actual_sentiment DECIMAL(5,2) DEFAULT 0.00,
        
        -- Strategy Management
        strategy_manager TEXT NOT NULL,
        team_members TEXT[] DEFAULT '{}',
        external_partners TEXT[] DEFAULT '{}',
        
        -- Status and Results
        status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN (
          'planning', 'approved', 'active', 'paused', 'completed', 'cancelled'
        )),
        effectiveness_score DECIMAL(5,2) DEFAULT 0.00,
        lessons_learned TEXT,
        
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Press Conferences - Press conference management
    await client.query(`
      CREATE TABLE IF NOT EXISTS press_conferences (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        conference_title TEXT NOT NULL,
        conference_type TEXT NOT NULL CHECK (conference_type IN (
          'regular_briefing', 'policy_announcement', 'crisis_response',
          'exclusive_interview', 'joint_conference', 'emergency_briefing',
          'campaign_event', 'international_address', 'cabinet_briefing'
        )),
        
        -- Conference Details
        description TEXT NOT NULL,
        main_topics TEXT[] DEFAULT '{}',
        key_speakers TEXT[] DEFAULT '{}',
        expected_announcements TEXT[] DEFAULT '{}',
        
        -- Scheduling
        scheduled_date TIMESTAMP NOT NULL,
        duration_minutes INTEGER NOT NULL DEFAULT 60,
        location TEXT NOT NULL,
        venue_capacity INTEGER DEFAULT 0,
        
        -- Attendee Management
        accredited_journalists TEXT[] DEFAULT '{}',
        media_outlets_invited TEXT[] DEFAULT '{}',
        special_guests TEXT[] DEFAULT '{}',
        security_clearance_required TEXT DEFAULT 'public',
        
        -- Conference Content
        opening_statement TEXT,
        prepared_qa JSONB DEFAULT '[]',
        talking_points TEXT[] DEFAULT '{}',
        restricted_topics TEXT[] DEFAULT '{}',
        
        -- Live Management
        actual_start_time TIMESTAMP,
        actual_end_time TIMESTAMP,
        actual_attendees INTEGER DEFAULT 0,
        questions_asked INTEGER DEFAULT 0,
        
        -- Results and Coverage
        media_coverage_count INTEGER DEFAULT 0,
        coverage_sentiment DECIMAL(5,2) DEFAULT 0.00,
        key_quotes TEXT[] DEFAULT '{}',
        follow_up_required BOOLEAN DEFAULT FALSE,
        
        -- Status and Management
        status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN (
          'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'postponed'
        )),
        organized_by TEXT NOT NULL,
        
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Public Messaging - Official government messages
    await client.query(`
      CREATE TABLE IF NOT EXISTS public_messages (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        message_title TEXT NOT NULL,
        message_type TEXT NOT NULL CHECK (message_type IN (
          'official_statement', 'policy_announcement', 'crisis_update',
          'public_service', 'campaign_message', 'international_statement',
          'emergency_alert', 'celebration_message', 'condolence_message'
        )),
        
        -- Message Content
        message_content TEXT NOT NULL,
        key_points TEXT[] DEFAULT '{}',
        call_to_action TEXT,
        supporting_materials JSONB DEFAULT '[]',
        
        -- Targeting and Distribution
        target_audiences TEXT[] DEFAULT '{}',
        distribution_channels TEXT[] DEFAULT '{}',
        geographic_targeting TEXT[] DEFAULT '{}',
        demographic_targeting JSONB DEFAULT '{}',
        
        -- Timing and Scheduling
        scheduled_release TIMESTAMP,
        actual_release TIMESTAMP,
        message_urgency TEXT NOT NULL DEFAULT 'normal' CHECK (message_urgency IN (
          'low', 'normal', 'high', 'urgent', 'emergency'
        )),
        
        -- Performance Tracking
        estimated_reach INTEGER DEFAULT 0,
        actual_reach INTEGER DEFAULT 0,
        engagement_count INTEGER DEFAULT 0,
        share_count INTEGER DEFAULT 0,
        sentiment_score DECIMAL(5,2) DEFAULT 0.00,
        
        -- Message Coordination
        coordinated_with TEXT[] DEFAULT '{}',
        related_messages TEXT[] DEFAULT '{}',
        translation_required BOOLEAN DEFAULT FALSE,
        translations JSONB DEFAULT '{}',
        
        -- Approval and Status
        approval_status TEXT NOT NULL DEFAULT 'draft' CHECK (approval_status IN (
          'draft', 'review', 'approved', 'released', 'recalled'
        )),
        approved_by TEXT,
        created_by TEXT NOT NULL,
        
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Media Relationships - Government-media outlet relationships
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_relationships (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        outlet_name TEXT NOT NULL,
        outlet_type TEXT NOT NULL CHECK (outlet_type IN (
          'newspaper', 'television', 'radio', 'online_news', 'magazine',
          'social_media', 'news_agency', 'international_media', 'local_media'
        )),
        
        -- Outlet Details
        outlet_description TEXT,
        primary_audience TEXT,
        political_leaning TEXT CHECK (political_leaning IN (
          'left', 'center_left', 'center', 'center_right', 'right', 'neutral'
        )),
        credibility_rating INTEGER CHECK (credibility_rating >= 1 AND credibility_rating <= 10),
        reach_estimate INTEGER DEFAULT 0,
        
        -- Relationship Status
        relationship_status TEXT NOT NULL DEFAULT 'neutral' CHECK (relationship_status IN (
          'hostile', 'unfavorable', 'neutral', 'favorable', 'allied'
        )),
        access_level TEXT NOT NULL DEFAULT 'standard' CHECK (access_level IN (
          'restricted', 'standard', 'preferred', 'exclusive', 'blacklisted'
        )),
        
        -- Contact Information
        primary_contacts JSONB DEFAULT '[]',
        key_journalists TEXT[] DEFAULT '{}',
        editorial_contacts JSONB DEFAULT '[]',
        
        -- Interaction History
        last_interaction_date TIMESTAMP,
        interaction_frequency TEXT DEFAULT 'monthly',
        exclusive_interviews_granted INTEGER DEFAULT 0,
        press_conferences_attended INTEGER DEFAULT 0,
        
        -- Coverage Analysis
        coverage_sentiment_avg DECIMAL(5,2) DEFAULT 0.00,
        positive_coverage_count INTEGER DEFAULT 0,
        negative_coverage_count INTEGER DEFAULT 0,
        neutral_coverage_count INTEGER DEFAULT 0,
        
        -- Partnership Details
        partnership_agreements JSONB DEFAULT '[]',
        content_sharing_agreements BOOLEAN DEFAULT FALSE,
        advertising_partnerships BOOLEAN DEFAULT FALSE,
        
        -- Management
        relationship_manager TEXT NOT NULL,
        last_review_date TIMESTAMP,
        next_review_date TIMESTAMP,
        
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        
        UNIQUE(campaign_id, outlet_name)
      )
    `);

    // Propaganda Campaigns - Strategic influence operations
    await client.query(`
      CREATE TABLE IF NOT EXISTS propaganda_campaigns (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        campaign_name TEXT NOT NULL,
        campaign_type TEXT NOT NULL CHECK (campaign_type IN (
          'public_opinion', 'policy_support', 'opposition_counter',
          'international_image', 'crisis_narrative', 'election_influence',
          'social_cohesion', 'economic_confidence', 'security_awareness'
        )),
        
        -- Campaign Objectives
        description TEXT NOT NULL,
        primary_objectives TEXT[] DEFAULT '{}',
        target_outcomes JSONB DEFAULT '{}',
        success_criteria JSONB DEFAULT '{}',
        
        -- Target Analysis
        target_demographics JSONB NOT NULL DEFAULT '{}',
        geographic_focus TEXT[] DEFAULT '{}',
        psychographic_profiles JSONB DEFAULT '{}',
        influence_networks JSONB DEFAULT '{}',
        
        -- Campaign Strategy
        key_narratives TEXT[] DEFAULT '{}',
        messaging_themes TEXT[] DEFAULT '{}',
        emotional_appeals TEXT[] DEFAULT '{}',
        evidence_base JSONB DEFAULT '{}',
        
        -- Channel Strategy
        primary_channels TEXT[] DEFAULT '{}',
        channel_allocation JSONB DEFAULT '{}',
        content_types TEXT[] DEFAULT '{}',
        frequency_schedule JSONB DEFAULT '{}',
        
        -- Timeline and Resources
        campaign_duration_days INTEGER NOT NULL DEFAULT 30,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        allocated_budget DECIMAL(15,2) DEFAULT 0.00,
        personnel_assigned INTEGER DEFAULT 0,
        
        -- Performance Metrics
        target_reach INTEGER DEFAULT 0,
        actual_reach INTEGER DEFAULT 0,
        engagement_target DECIMAL(5,2) DEFAULT 0.00,
        actual_engagement DECIMAL(5,2) DEFAULT 0.00,
        persuasion_rate DECIMAL(5,2) DEFAULT 0.00,
        
        -- Impact Assessment
        opinion_shift_measured DECIMAL(5,2) DEFAULT 0.00,
        behavioral_change_indicators JSONB DEFAULT '{}',
        counter_narrative_effectiveness DECIMAL(5,2) DEFAULT 0.00,
        
        -- Campaign Management
        campaign_manager TEXT NOT NULL,
        team_size INTEGER DEFAULT 0,
        external_contractors TEXT[] DEFAULT '{}',
        
        -- Security and Ethics
        classification_level TEXT NOT NULL DEFAULT 'internal' CHECK (classification_level IN (
          'public', 'internal', 'confidential', 'secret'
        )),
        ethical_review_completed BOOLEAN DEFAULT FALSE,
        legal_compliance_verified BOOLEAN DEFAULT FALSE,
        
        -- Status and Results
        status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN (
          'planning', 'approved', 'active', 'paused', 'completed', 'terminated'
        )),
        effectiveness_score DECIMAL(5,2) DEFAULT 0.00,
        
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Information Policies - Government information management policies
    await client.query(`
      CREATE TABLE IF NOT EXISTS information_policies (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        policy_name TEXT NOT NULL,
        policy_category TEXT NOT NULL CHECK (policy_category IN (
          'information_disclosure', 'media_regulation', 'classification_rules',
          'public_access', 'journalist_accreditation', 'content_standards',
          'emergency_protocols', 'international_communication', 'social_media_policy'
        )),
        
        -- Policy Content
        policy_description TEXT NOT NULL,
        policy_text TEXT NOT NULL,
        scope_of_application TEXT[] DEFAULT '{}',
        affected_entities TEXT[] DEFAULT '{}',
        
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
          'departmental', 'government', 'constitutional', 'international'
        )),
        approved_by TEXT NOT NULL,
        approval_date TIMESTAMP NOT NULL DEFAULT NOW(),
        
        -- Status and Compliance
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
          'draft', 'under_review', 'active', 'suspended', 'expired', 'revoked'
        )),
        compliance_rate DECIMAL(5,2) DEFAULT 0.00,
        violation_count INTEGER DEFAULT 0,
        
        -- Related Policies
        supersedes_policy_ids TEXT[] DEFAULT '{}',
        related_policy_ids TEXT[] DEFAULT '{}',
        
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Communications Budget Allocations
    await client.query(`
      CREATE TABLE IF NOT EXISTS communications_budget_allocations (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id INTEGER NOT NULL,
        fiscal_year INTEGER NOT NULL,
        
        -- Budget Categories
        media_relations_budget DECIMAL(15,2) DEFAULT 0.00,
        public_messaging_budget DECIMAL(15,2) DEFAULT 0.00,
        propaganda_campaigns_budget DECIMAL(15,2) DEFAULT 0.00,
        press_operations_budget DECIMAL(15,2) DEFAULT 0.00,
        crisis_communications_budget DECIMAL(15,2) DEFAULT 0.00,
        international_outreach_budget DECIMAL(15,2) DEFAULT 0.00,
        technology_infrastructure_budget DECIMAL(15,2) DEFAULT 0.00,
        personnel_training_budget DECIMAL(15,2) DEFAULT 0.00,
        
        -- Total Budget
        total_allocated DECIMAL(15,2) GENERATED ALWAYS AS (
          media_relations_budget + public_messaging_budget + propaganda_campaigns_budget +
          press_operations_budget + crisis_communications_budget + international_outreach_budget +
          technology_infrastructure_budget + personnel_training_budget
        ) STORED,
        
        -- Spending Tracking
        total_spent DECIMAL(15,2) DEFAULT 0.00,
        total_committed DECIMAL(15,2) DEFAULT 0.00,
        
        -- Performance Metrics
        media_effectiveness_score DECIMAL(5,2) DEFAULT 0.00,
        public_sentiment_improvement DECIMAL(5,2) DEFAULT 0.00,
        message_penetration_rate DECIMAL(5,2) DEFAULT 0.00,
        
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
      CREATE INDEX IF NOT EXISTS idx_communications_operations_campaign ON communications_operations(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_communications_operations_type ON communications_operations(operation_type);
      CREATE INDEX IF NOT EXISTS idx_communications_operations_status ON communications_operations(status);
      CREATE INDEX IF NOT EXISTS idx_communications_operations_priority ON communications_operations(priority);
      CREATE INDEX IF NOT EXISTS idx_communications_operations_dates ON communications_operations(planned_start_date, planned_completion_date);
      
      CREATE INDEX IF NOT EXISTS idx_media_strategies_campaign ON media_strategies(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_media_strategies_type ON media_strategies(strategy_type);
      CREATE INDEX IF NOT EXISTS idx_media_strategies_status ON media_strategies(status);
      CREATE INDEX IF NOT EXISTS idx_media_strategies_dates ON media_strategies(start_date, end_date);
      
      CREATE INDEX IF NOT EXISTS idx_press_conferences_campaign ON press_conferences(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_press_conferences_type ON press_conferences(conference_type);
      CREATE INDEX IF NOT EXISTS idx_press_conferences_status ON press_conferences(status);
      CREATE INDEX IF NOT EXISTS idx_press_conferences_scheduled ON press_conferences(scheduled_date);
      
      CREATE INDEX IF NOT EXISTS idx_public_messages_campaign ON public_messages(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_public_messages_type ON public_messages(message_type);
      CREATE INDEX IF NOT EXISTS idx_public_messages_status ON public_messages(approval_status);
      CREATE INDEX IF NOT EXISTS idx_public_messages_urgency ON public_messages(message_urgency);
      CREATE INDEX IF NOT EXISTS idx_public_messages_release ON public_messages(scheduled_release);
      
      CREATE INDEX IF NOT EXISTS idx_media_relationships_campaign ON media_relationships(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_media_relationships_type ON media_relationships(outlet_type);
      CREATE INDEX IF NOT EXISTS idx_media_relationships_status ON media_relationships(relationship_status);
      CREATE INDEX IF NOT EXISTS idx_media_relationships_access ON media_relationships(access_level);
      
      CREATE INDEX IF NOT EXISTS idx_propaganda_campaigns_campaign ON propaganda_campaigns(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_propaganda_campaigns_type ON propaganda_campaigns(campaign_type);
      CREATE INDEX IF NOT EXISTS idx_propaganda_campaigns_status ON propaganda_campaigns(status);
      CREATE INDEX IF NOT EXISTS idx_propaganda_campaigns_dates ON propaganda_campaigns(start_date, end_date);
      CREATE INDEX IF NOT EXISTS idx_propaganda_campaigns_classification ON propaganda_campaigns(classification_level);
      
      CREATE INDEX IF NOT EXISTS idx_information_policies_campaign ON information_policies(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_information_policies_category ON information_policies(policy_category);
      CREATE INDEX IF NOT EXISTS idx_information_policies_status ON information_policies(status);
      CREATE INDEX IF NOT EXISTS idx_information_policies_effective ON information_policies(effective_date);
      
      CREATE INDEX IF NOT EXISTS idx_communications_budget_allocations_campaign ON communications_budget_allocations(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_communications_budget_allocations_fiscal_year ON communications_budget_allocations(fiscal_year);
    `);

    await client.query('COMMIT');
    console.log('✅ Communications Secretary database schema initialized successfully');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Communications Secretary schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}
