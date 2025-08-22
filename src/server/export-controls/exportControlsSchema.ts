/**
 * Database schema for Export Controls system
 */

import { Pool } from 'pg';

export async function initializeExportControlsSchema(pool: Pool): Promise<void> {
  try {
    console.log('🛡️ Initializing Export Controls schema...');

    // Create export control policies table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS export_control_policies (
        id VARCHAR(255) PRIMARY KEY,
        campaign_id VARCHAR(255) NOT NULL,
        civilization_id VARCHAR(255) NOT NULL,
        name VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN (
          'technology', 'resource', 'military', 'dual_use', 'strategic', 'cultural'
        )),
        status VARCHAR(20) NOT NULL CHECK (status IN (
          'active', 'suspended', 'under_review', 'expired'
        )),
        
        -- Target Specifications
        target_civilizations JSONB DEFAULT '[]',
        target_technologies JSONB DEFAULT '[]',
        target_resources JSONB DEFAULT '[]',
        target_categories JSONB DEFAULT '[]',
        
        -- Control Level
        control_level VARCHAR(20) NOT NULL CHECK (control_level IN (
          'prohibited', 'restricted', 'licensed', 'monitored', 'unrestricted'
        )),
        requires_approval BOOLEAN DEFAULT true,
        approval_authority VARCHAR(20) CHECK (approval_authority IN (
          'leader', 'cabinet', 'legislature', 'intelligence', 'military'
        )),
        
        -- Conditions and Exceptions
        conditions JSONB DEFAULT '[]',
        exceptions JSONB DEFAULT '[]',
        
        -- Timing
        effective_date TIMESTAMP WITH TIME ZONE NOT NULL,
        expiration_date TIMESTAMP WITH TIME ZONE,
        review_date TIMESTAMP WITH TIME ZONE,
        
        -- Metadata
        created_by VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        rationale TEXT,
        security_classification VARCHAR(20) DEFAULT 'public' CHECK (security_classification IN (
          'public', 'restricted', 'confidential', 'secret', 'top_secret'
        ))
      );
    `);

    // Create export licenses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS export_licenses (
        id VARCHAR(255) PRIMARY KEY,
        campaign_id VARCHAR(255) NOT NULL,
        civilization_id VARCHAR(255) NOT NULL,
        applicant_id VARCHAR(255) NOT NULL,
        
        -- Application Details
        application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        requested_items JSONB NOT NULL DEFAULT '[]',
        destination_civilization VARCHAR(255) NOT NULL,
        end_use TEXT NOT NULL,
        end_user VARCHAR(500) NOT NULL,
        
        -- Status
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
          'pending', 'under_review', 'approved', 'denied', 'suspended', 'expired'
        )),
        reviewed_by JSONB DEFAULT '[]',
        approved_by VARCHAR(255),
        
        -- License Terms
        license_number VARCHAR(100),
        issued_date TIMESTAMP WITH TIME ZONE,
        expiration_date TIMESTAMP WITH TIME ZONE,
        conditions JSONB DEFAULT '[]',
        restrictions JSONB DEFAULT '[]',
        
        -- Compliance
        compliance_reports JSONB DEFAULT '[]',
        violations JSONB DEFAULT '[]',
        
        -- AI Analysis
        risk_assessment JSONB,
        ai_recommendation VARCHAR(20) CHECK (ai_recommendation IN (
          'approve', 'deny', 'conditional', 'investigate'
        )),
        confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
        
        -- Metadata
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create export transactions table for tracking actual exports
    await pool.query(`
      CREATE TABLE IF NOT EXISTS export_transactions (
        id VARCHAR(255) PRIMARY KEY,
        campaign_id VARCHAR(255) NOT NULL,
        civilization_id VARCHAR(255) NOT NULL,
        license_id VARCHAR(255) REFERENCES export_licenses(id),
        
        -- Transaction Details
        transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        exported_items JSONB NOT NULL DEFAULT '[]',
        destination_civilization VARCHAR(255) NOT NULL,
        total_value DECIMAL(15,2) NOT NULL,
        
        -- Compliance
        compliance_status VARCHAR(20) DEFAULT 'compliant' CHECK (compliance_status IN (
          'compliant', 'under_review', 'violation', 'resolved'
        )),
        verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN (
          'pending', 'verified', 'failed', 'not_required'
        )),
        
        -- Metadata
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        notes TEXT
      );
    `);

    // Create export control violations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS export_control_violations (
        id VARCHAR(255) PRIMARY KEY,
        campaign_id VARCHAR(255) NOT NULL,
        civilization_id VARCHAR(255) NOT NULL,
        license_id VARCHAR(255) REFERENCES export_licenses(id),
        transaction_id VARCHAR(255) REFERENCES export_transactions(id),
        
        -- Violation Details
        violation_type VARCHAR(50) NOT NULL CHECK (violation_type IN (
          'unauthorized_export', 'end_use_violation', 'quantity_exceeded', 
          'destination_violation', 'reporting_failure'
        )),
        severity VARCHAR(20) NOT NULL CHECK (severity IN (
          'minor', 'moderate', 'serious', 'critical'
        )),
        description TEXT NOT NULL,
        discovered_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        -- Investigation
        investigation_status VARCHAR(20) DEFAULT 'open' CHECK (investigation_status IN (
          'open', 'closed', 'pending'
        )),
        investigated_by VARCHAR(255),
        investigation_notes TEXT,
        
        -- Penalties
        penalties JSONB DEFAULT '[]',
        penalty_amount DECIMAL(15,2),
        penalty_applied BOOLEAN DEFAULT false,
        
        -- Resolution
        resolved_date TIMESTAMP WITH TIME ZONE,
        resolution_notes TEXT,
        
        -- Metadata
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create export control audit log table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS export_control_audit_log (
        id SERIAL PRIMARY KEY,
        campaign_id VARCHAR(255) NOT NULL,
        civilization_id VARCHAR(255) NOT NULL,
        
        -- Audit Details
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN (
          'policy', 'license', 'transaction', 'violation'
        )),
        entity_id VARCHAR(255) NOT NULL,
        
        -- Change Details
        old_values JSONB,
        new_values JSONB,
        changes_summary TEXT,
        
        -- Actor
        performed_by VARCHAR(255) NOT NULL,
        performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        -- Context
        reason TEXT,
        ip_address INET,
        user_agent TEXT
      );
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_policies_campaign_civ 
      ON export_control_policies(campaign_id, civilization_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_policies_status 
      ON export_control_policies(status);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_policies_type 
      ON export_control_policies(type);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_policies_effective_date 
      ON export_control_policies(effective_date);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_licenses_campaign_civ 
      ON export_licenses(campaign_id, civilization_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_licenses_status 
      ON export_licenses(status);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_licenses_applicant 
      ON export_licenses(applicant_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_licenses_destination 
      ON export_licenses(destination_civilization);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_transactions_campaign_civ 
      ON export_transactions(campaign_id, civilization_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_transactions_license 
      ON export_transactions(license_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_transactions_date 
      ON export_transactions(transaction_date);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_violations_campaign_civ 
      ON export_control_violations(campaign_id, civilization_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_violations_severity 
      ON export_control_violations(severity);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_violations_status 
      ON export_control_violations(investigation_status);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_audit_campaign_civ 
      ON export_control_audit_log(campaign_id, civilization_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_audit_entity 
      ON export_control_audit_log(entity_type, entity_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_export_audit_date 
      ON export_control_audit_log(performed_at);
    `);

    // Insert default export control policies
    await insertDefaultExportControlPolicies(pool);

    console.log('✅ Export Controls schema initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Export Controls schema:', error);
    throw error;
  }
}

async function insertDefaultExportControlPolicies(pool: Pool): Promise<void> {
  const defaultPolicies = [
    {
      id: 'military_tech_restriction',
      name: 'Military Technology Export Restriction',
      description: 'Restricts export of military technologies to non-allied civilizations',
      type: 'military',
      status: 'active',
      targetCivilizations: [],
      targetTechnologies: ['weapons_systems', 'defense_shields', 'military_ai'],
      targetCategories: ['military', 'defense'],
      controlLevel: 'restricted',
      requiresApproval: true,
      approvalAuthority: 'military',
      rationale: 'Protect military technological advantages and prevent arms proliferation',
      securityClassification: 'confidential'
    },
    {
      id: 'strategic_resource_control',
      name: 'Strategic Resource Export Control',
      description: 'Controls export of strategic resources critical to civilization security',
      type: 'strategic',
      status: 'active',
      targetResources: ['rare_minerals', 'energy_crystals', 'quantum_materials'],
      targetCategories: ['strategic_materials'],
      controlLevel: 'licensed',
      requiresApproval: true,
      approvalAuthority: 'cabinet',
      rationale: 'Ensure domestic supply security and prevent resource dependency',
      securityClassification: 'restricted'
    },
    {
      id: 'dual_use_technology',
      name: 'Dual-Use Technology Monitoring',
      description: 'Monitors export of technologies with both civilian and military applications',
      type: 'dual_use',
      status: 'active',
      targetTechnologies: ['advanced_computing', 'biotechnology', 'nanotechnology'],
      targetCategories: ['dual_use'],
      controlLevel: 'monitored',
      requiresApproval: false,
      approvalAuthority: 'intelligence',
      rationale: 'Track potential military applications of civilian technologies',
      securityClassification: 'restricted'
    },
    {
      id: 'cultural_heritage_protection',
      name: 'Cultural Heritage Protection',
      description: 'Protects export of culturally significant items and knowledge',
      type: 'cultural',
      status: 'active',
      targetCategories: ['cultural_artifacts', 'traditional_knowledge'],
      controlLevel: 'licensed',
      requiresApproval: true,
      approvalAuthority: 'cabinet',
      rationale: 'Preserve cultural heritage and prevent exploitation',
      securityClassification: 'public'
    },
    {
      id: 'emergency_humanitarian_exception',
      name: 'Emergency Humanitarian Exception',
      description: 'Allows expedited export of humanitarian supplies during emergencies',
      type: 'strategic',
      status: 'active',
      targetCategories: ['medical_supplies', 'food_aid', 'disaster_relief'],
      controlLevel: 'unrestricted',
      requiresApproval: false,
      approvalAuthority: 'cabinet',
      rationale: 'Enable rapid humanitarian response during crises',
      securityClassification: 'public'
    }
  ];

  for (const policy of defaultPolicies) {
    const id = policy.id;
    const campaignId = 'default';
    const civilizationId = 'template';
    const now = new Date();

    await pool.query(`
      INSERT INTO export_control_policies (
        id, campaign_id, civilization_id, name, description, type, status,
        target_civilizations, target_technologies, target_resources, target_categories,
        control_level, requires_approval, approval_authority, conditions, exceptions,
        effective_date, created_by, created_at, last_modified, rationale, security_classification
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
      ) ON CONFLICT (id) DO NOTHING
    `, [
      id, campaignId, civilizationId, policy.name, policy.description, policy.type, policy.status,
      JSON.stringify(policy.targetCivilizations || []), JSON.stringify(policy.targetTechnologies || []),
      JSON.stringify(policy.targetResources || []), JSON.stringify(policy.targetCategories || []),
      policy.controlLevel, policy.requiresApproval, policy.approvalAuthority, JSON.stringify([]),
      JSON.stringify([]), now, 'system', now, now, policy.rationale, policy.securityClassification
    ]);
  }

  console.log('✅ Default export control policies inserted');
}

export default initializeExportControlsSchema;
