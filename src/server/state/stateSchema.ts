/**
 * State Department Database Schema
 * 
 * Database schema for the State Department & Diplomacy System
 * Handles foreign relations, treaties, trade agreements, embassy operations, and diplomatic communications
 */

import { Pool } from 'pg';

export async function initializeStateSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Diplomatic Relations Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS diplomatic_relations (
        id VARCHAR(255) PRIMARY KEY,
        civilization_id VARCHAR(255) NOT NULL,
        target_civilization_id VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'neutral',
        trust_level INTEGER DEFAULT 0 CHECK (trust_level >= -100 AND trust_level <= 100),
        trade_level INTEGER DEFAULT 0 CHECK (trade_level >= 0 AND trade_level <= 100),
        military_cooperation INTEGER DEFAULT 0 CHECK (military_cooperation >= 0 AND military_cooperation <= 100),
        cultural_exchange INTEGER DEFAULT 0 CHECK (cultural_exchange >= 0 AND cultural_exchange <= 100),
        last_contact TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        relationship_history JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(civilization_id, target_civilization_id)
      );
    `);

    // Treaties Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS treaties (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'draft',
        parties JSONB NOT NULL DEFAULT '[]',
        terms JSONB NOT NULL DEFAULT '{}',
        economic_provisions JSONB DEFAULT '{}',
        military_provisions JSONB DEFAULT '{}',
        cultural_provisions JSONB DEFAULT '{}',
        trade_provisions JSONB DEFAULT '{}',
        duration_years INTEGER,
        auto_renewal BOOLEAN DEFAULT false,
        negotiation_start_date TIMESTAMP,
        signed_date TIMESTAMP,
        ratified_date TIMESTAMP,
        effective_date TIMESTAMP,
        expiration_date TIMESTAMP,
        termination_date TIMESTAMP,
        termination_reason TEXT,
        negotiated_by VARCHAR(255),
        signed_by JSONB DEFAULT '{}',
        ratified_by JSONB DEFAULT '{}',
        amendments JSONB DEFAULT '[]',
        compliance_status JSONB DEFAULT '{}',
        violation_reports JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Embassies Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS embassies (
        id VARCHAR(255) PRIMARY KEY,
        host_civilization_id VARCHAR(255) NOT NULL,
        guest_civilization_id VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'operational',
        embassy_type VARCHAR(50) NOT NULL DEFAULT 'full',
        staff_count INTEGER DEFAULT 0,
        security_level INTEGER DEFAULT 1 CHECK (security_level >= 1 AND security_level <= 5),
        diplomatic_immunity BOOLEAN DEFAULT true,
        consular_services JSONB DEFAULT '[]',
        trade_office BOOLEAN DEFAULT false,
        cultural_center BOOLEAN DEFAULT false,
        intelligence_operations BOOLEAN DEFAULT false,
        established_date TIMESTAMP,
        closed_date TIMESTAMP,
        ambassador_id VARCHAR(255),
        deputy_chief_id VARCHAR(255),
        staff_roster JSONB DEFAULT '[]',
        security_incidents JSONB DEFAULT '[]',
        diplomatic_pouches JSONB DEFAULT '[]',
        budget_allocation DECIMAL(15,2) DEFAULT 0,
        operational_costs JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(host_civilization_id, guest_civilization_id)
      );
    `);

    // Diplomatic Communications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS diplomatic_communications (
        id VARCHAR(255) PRIMARY KEY,
        sender_civilization_id VARCHAR(255) NOT NULL,
        receiver_civilization_id VARCHAR(255) NOT NULL,
        sender_official_id VARCHAR(255),
        receiver_official_id VARCHAR(255),
        communication_type VARCHAR(50) NOT NULL,
        channel VARCHAR(50) NOT NULL DEFAULT 'official',
        classification VARCHAR(50) NOT NULL DEFAULT 'unclassified',
        subject VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        attachments JSONB DEFAULT '[]',
        delivery_method VARCHAR(50) DEFAULT 'diplomatic_pouch',
        sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        received_date TIMESTAMP,
        acknowledged_date TIMESTAMP,
        response_required BOOLEAN DEFAULT false,
        response_deadline TIMESTAMP,
        response_id VARCHAR(255),
        urgency VARCHAR(20) DEFAULT 'normal',
        diplomatic_protocol JSONB DEFAULT '{}',
        translation_required BOOLEAN DEFAULT false,
        translated_content JSONB DEFAULT '{}',
        encryption_level INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Trade Agreements Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trade_agreements (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'negotiating',
        parties JSONB NOT NULL DEFAULT '[]',
        commodities JSONB NOT NULL DEFAULT '[]',
        tariff_schedules JSONB DEFAULT '{}',
        quotas JSONB DEFAULT '{}',
        trade_routes JSONB DEFAULT '[]',
        payment_terms JSONB DEFAULT '{}',
        currency_provisions JSONB DEFAULT '{}',
        dispute_resolution JSONB DEFAULT '{}',
        intellectual_property JSONB DEFAULT '{}',
        environmental_standards JSONB DEFAULT '{}',
        labor_standards JSONB DEFAULT '{}',
        volume_commitments JSONB DEFAULT '{}',
        price_mechanisms JSONB DEFAULT '{}',
        force_majeure_clauses JSONB DEFAULT '{}',
        negotiation_start_date TIMESTAMP,
        signed_date TIMESTAMP,
        effective_date TIMESTAMP,
        expiration_date TIMESTAMP,
        review_date TIMESTAMP,
        performance_metrics JSONB DEFAULT '{}',
        compliance_reports JSONB DEFAULT '[]',
        trade_statistics JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Diplomatic Personnel Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS diplomatic_personnel (
        id VARCHAR(255) PRIMARY KEY,
        civilization_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        rank VARCHAR(100) NOT NULL,
        position VARCHAR(100) NOT NULL,
        assignment_location VARCHAR(255),
        embassy_id VARCHAR(255),
        security_clearance INTEGER DEFAULT 1 CHECK (security_clearance >= 1 AND security_clearance <= 5),
        languages JSONB DEFAULT '[]',
        specializations JSONB DEFAULT '[]',
        diplomatic_immunity BOOLEAN DEFAULT true,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        appointment_date TIMESTAMP,
        tour_end_date TIMESTAMP,
        previous_assignments JSONB DEFAULT '[]',
        performance_ratings JSONB DEFAULT '[]',
        commendations JSONB DEFAULT '[]',
        disciplinary_actions JSONB DEFAULT '[]',
        contact_information JSONB DEFAULT '{}',
        emergency_contacts JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Diplomatic Incidents Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS diplomatic_incidents (
        id VARCHAR(255) PRIMARY KEY,
        incident_type VARCHAR(100) NOT NULL,
        severity VARCHAR(20) NOT NULL DEFAULT 'low',
        status VARCHAR(50) NOT NULL DEFAULT 'reported',
        involved_civilizations JSONB NOT NULL DEFAULT '[]',
        location VARCHAR(255),
        embassy_id VARCHAR(255),
        incident_date TIMESTAMP NOT NULL,
        reported_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_date TIMESTAMP,
        description TEXT NOT NULL,
        immediate_actions JSONB DEFAULT '[]',
        investigation_findings JSONB DEFAULT '{}',
        diplomatic_consequences JSONB DEFAULT '{}',
        compensation_required JSONB DEFAULT '{}',
        apologies_issued JSONB DEFAULT '[]',
        protocol_violations JSONB DEFAULT '[]',
        media_coverage JSONB DEFAULT '{}',
        public_statements JSONB DEFAULT '[]',
        follow_up_actions JSONB DEFAULT '[]',
        lessons_learned TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // International Organizations Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS international_organizations (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        purpose TEXT NOT NULL,
        headquarters_location VARCHAR(255),
        founded_date TIMESTAMP,
        charter JSONB DEFAULT '{}',
        membership_criteria JSONB DEFAULT '{}',
        member_civilizations JSONB DEFAULT '[]',
        observer_civilizations JSONB DEFAULT '[]',
        suspended_members JSONB DEFAULT '[]',
        leadership_structure JSONB DEFAULT '{}',
        voting_procedures JSONB DEFAULT '{}',
        budget DECIMAL(15,2) DEFAULT 0,
        funding_sources JSONB DEFAULT '{}',
        programs JSONB DEFAULT '[]',
        resolutions JSONB DEFAULT '[]',
        sanctions JSONB DEFAULT '[]',
        peacekeeping_operations JSONB DEFAULT '[]',
        humanitarian_missions JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Diplomatic Negotiations Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS diplomatic_negotiations (
        id VARCHAR(255) PRIMARY KEY,
        negotiation_type VARCHAR(100) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'initiated',
        parties JSONB NOT NULL DEFAULT '[]',
        mediators JSONB DEFAULT '[]',
        venue VARCHAR(255),
        start_date TIMESTAMP,
        target_completion_date TIMESTAMP,
        actual_completion_date TIMESTAMP,
        rounds_completed INTEGER DEFAULT 0,
        current_round INTEGER DEFAULT 1,
        negotiation_positions JSONB DEFAULT '{}',
        concessions_made JSONB DEFAULT '{}',
        sticking_points JSONB DEFAULT '[]',
        breakthrough_moments JSONB DEFAULT '[]',
        deadlock_periods JSONB DEFAULT '[]',
        external_pressures JSONB DEFAULT '{}',
        public_statements JSONB DEFAULT '[]',
        media_strategy JSONB DEFAULT '{}',
        confidentiality_agreements JSONB DEFAULT '{}',
        preliminary_agreements JSONB DEFAULT '[]',
        final_agreement_id VARCHAR(255),
        negotiation_notes JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Synchronized Diplomatic Messages Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS synchronized_diplomatic_messages (
        id VARCHAR(255) PRIMARY KEY,
        message_type VARCHAR(100) NOT NULL,
        sender_civilization_id VARCHAR(255) NOT NULL,
        receiver_civilization_id VARCHAR(255) NOT NULL,
        core_content JSONB NOT NULL DEFAULT '{}',
        sender_perspective JSONB NOT NULL DEFAULT '{}',
        receiver_perspective JSONB DEFAULT '{}',
        status VARCHAR(50) NOT NULL DEFAULT 'sent',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        response_deadline TIMESTAMP,
        linked_message_id VARCHAR(255),
        attachments JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (linked_message_id) REFERENCES synchronized_diplomatic_messages(id) ON DELETE SET NULL
      );
    `);

    // Diplomatic Exchanges Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS diplomatic_exchanges (
        id VARCHAR(255) PRIMARY KEY,
        participants JSONB NOT NULL DEFAULT '[]',
        topic VARCHAR(500) NOT NULL,
        exchange_type VARCHAR(50) NOT NULL DEFAULT 'bilateral',
        current_status VARCHAR(50) NOT NULL DEFAULT 'active',
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        conclusion JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_diplomatic_relations_civilization 
      ON diplomatic_relations(civilization_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_diplomatic_relations_target 
      ON diplomatic_relations(target_civilization_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_treaties_status 
      ON treaties(status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_treaties_type 
      ON treaties(type);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_embassies_host 
      ON embassies(host_civilization_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_embassies_guest 
      ON embassies(guest_civilization_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_diplomatic_communications_sender 
      ON diplomatic_communications(sender_civilization_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_diplomatic_communications_receiver 
      ON diplomatic_communications(receiver_civilization_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_trade_agreements_status 
      ON trade_agreements(status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_diplomatic_personnel_civilization 
      ON diplomatic_personnel(civilization_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_diplomatic_personnel_embassy 
      ON diplomatic_personnel(embassy_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_diplomatic_incidents_date 
      ON diplomatic_incidents(incident_date);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_diplomatic_negotiations_status 
      ON diplomatic_negotiations(status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_synchronized_messages_sender 
      ON synchronized_diplomatic_messages(sender_civilization_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_synchronized_messages_receiver 
      ON synchronized_diplomatic_messages(receiver_civilization_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_synchronized_messages_timestamp 
      ON synchronized_diplomatic_messages(timestamp);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_synchronized_messages_status 
      ON synchronized_diplomatic_messages(status);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_diplomatic_exchanges_participants 
      ON diplomatic_exchanges USING GIN(participants);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_diplomatic_exchanges_status 
      ON diplomatic_exchanges(current_status);
    `);

    await client.query('COMMIT');
    console.log('✅ State Department schema initialized successfully');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to initialize State Department schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Export schema initialization function
export default initializeStateSchema;
