import { Pool } from 'pg';

/**
 * Initialize Commerce Department database schema
 */
export async function initializeCommerceSchema(pool: Pool): Promise<void> {
  try {
    await pool.query(`
      -- Commerce Department Operations
      CREATE TABLE IF NOT EXISTS commerce_operations (
        id TEXT PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        operation_type TEXT NOT NULL CHECK (operation_type IN ('tariff_adjustment', 'trade_agreement', 'business_license', 'market_analysis', 'economic_development')),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'suspended', 'cancelled')),
        parameters JSONB NOT NULL DEFAULT '{}',
        results JSONB NOT NULL DEFAULT '{}',
        priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        assigned_to TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMP
      );

      -- Trade Policy Management
      CREATE TABLE IF NOT EXISTS trade_policies (
        id TEXT PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        policy_type TEXT NOT NULL CHECK (policy_type IN ('tariff', 'quota', 'embargo', 'preference', 'subsidy')),
        target_resource TEXT,
        target_partner TEXT,
        target_route TEXT,
        policy_value REAL NOT NULL,
        effective_date TIMESTAMP NOT NULL,
        expiration_date TIMESTAMP,
        justification TEXT,
        economic_impact JSONB NOT NULL DEFAULT '{}',
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'repealed')),
        created_by TEXT NOT NULL,
        approved_by TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Business Registry
      CREATE TABLE IF NOT EXISTS business_registry (
        id TEXT PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        business_name TEXT NOT NULL,
        business_type TEXT NOT NULL CHECK (business_type IN ('corporation', 'partnership', 'sole_proprietorship', 'cooperative', 'state_enterprise')),
        industry_sector TEXT NOT NULL,
        registration_date TIMESTAMP NOT NULL DEFAULT NOW(),
        license_status TEXT NOT NULL DEFAULT 'active' CHECK (license_status IN ('active', 'suspended', 'revoked', 'expired', 'pending')),
        compliance_score REAL NOT NULL DEFAULT 1.0 CHECK (compliance_score >= 0 AND compliance_score <= 1),
        annual_revenue REAL DEFAULT 0,
        employee_count INTEGER DEFAULT 0,
        regulatory_flags JSONB NOT NULL DEFAULT '[]',
        contact_info JSONB NOT NULL DEFAULT '{}',
        business_address TEXT,
        tax_id TEXT UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Market Intelligence
      CREATE TABLE IF NOT EXISTS market_intelligence (
        id TEXT PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        intelligence_type TEXT NOT NULL CHECK (intelligence_type IN ('price_analysis', 'demand_forecast', 'competitor_analysis', 'trade_flow_analysis', 'market_opportunity')),
        target_market TEXT NOT NULL,
        data_points JSONB NOT NULL DEFAULT '{}',
        analysis_results JSONB NOT NULL DEFAULT '{}',
        confidence_level REAL NOT NULL DEFAULT 0.5 CHECK (confidence_level >= 0 AND confidence_level <= 1),
        collection_date TIMESTAMP NOT NULL DEFAULT NOW(),
        analyst_notes TEXT,
        actionable_insights JSONB NOT NULL DEFAULT '[]',
        classification TEXT NOT NULL DEFAULT 'internal' CHECK (classification IN ('public', 'internal', 'confidential', 'restricted')),
        source_reliability TEXT NOT NULL DEFAULT 'medium' CHECK (source_reliability IN ('low', 'medium', 'high', 'verified')),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Economic Development Projects
      CREATE TABLE IF NOT EXISTS economic_development_projects (
        id TEXT PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        project_name TEXT NOT NULL,
        project_type TEXT NOT NULL CHECK (project_type IN ('investment_promotion', 'export_development', 'industrial_development', 'infrastructure', 'innovation_hub')),
        target_sector TEXT,
        budget_allocated REAL NOT NULL DEFAULT 0,
        budget_spent REAL NOT NULL DEFAULT 0,
        expected_outcomes JSONB NOT NULL DEFAULT '{}',
        actual_outcomes JSONB NOT NULL DEFAULT '{}',
        status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'approved', 'active', 'completed', 'cancelled', 'on_hold')),
        start_date TIMESTAMP NOT NULL,
        target_completion TIMESTAMP NOT NULL,
        actual_completion TIMESTAMP,
        project_manager TEXT,
        stakeholders JSONB NOT NULL DEFAULT '[]',
        risk_assessment JSONB NOT NULL DEFAULT '{}',
        success_metrics JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Commerce Department Budget
      CREATE TABLE IF NOT EXISTS commerce_budget (
        id TEXT PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        fiscal_period TEXT NOT NULL,
        total_budget REAL NOT NULL,
        allocated_amounts JSONB NOT NULL DEFAULT '{}',
        spent_amounts JSONB NOT NULL DEFAULT '{}',
        budget_categories JSONB NOT NULL DEFAULT '{}',
        budget_status TEXT NOT NULL DEFAULT 'active' CHECK (budget_status IN ('draft', 'active', 'amended', 'closed')),
        approval_date TIMESTAMP,
        approved_by TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Trade Agreements
      CREATE TABLE IF NOT EXISTS trade_agreements (
        id TEXT PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        agreement_name TEXT NOT NULL,
        agreement_type TEXT NOT NULL CHECK (agreement_type IN ('bilateral', 'multilateral', 'preferential', 'free_trade', 'customs_union')),
        parties JSONB NOT NULL DEFAULT '[]',
        terms JSONB NOT NULL DEFAULT '{}',
        trade_benefits JSONB NOT NULL DEFAULT '{}',
        status TEXT NOT NULL DEFAULT 'negotiating' CHECK (status IN ('negotiating', 'signed', 'ratified', 'active', 'suspended', 'terminated')),
        effective_date TIMESTAMP,
        expiration_date TIMESTAMP,
        negotiator TEXT,
        economic_impact JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Business Compliance Audits
      CREATE TABLE IF NOT EXISTS business_compliance_audits (
        id TEXT PRIMARY KEY,
        business_id TEXT NOT NULL REFERENCES business_registry(id) ON DELETE CASCADE,
        audit_type TEXT NOT NULL CHECK (audit_type IN ('routine', 'targeted', 'complaint_based', 'random')),
        audit_date TIMESTAMP NOT NULL DEFAULT NOW(),
        auditor TEXT NOT NULL,
        findings JSONB NOT NULL DEFAULT '[]',
        compliance_score REAL NOT NULL CHECK (compliance_score >= 0 AND compliance_score <= 1),
        violations JSONB NOT NULL DEFAULT '[]',
        recommendations JSONB NOT NULL DEFAULT '[]',
        follow_up_required BOOLEAN NOT NULL DEFAULT FALSE,
        follow_up_date TIMESTAMP,
        status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_commerce_operations_campaign ON commerce_operations(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_commerce_operations_type ON commerce_operations(operation_type);
      CREATE INDEX IF NOT EXISTS idx_commerce_operations_status ON commerce_operations(status);
      CREATE INDEX IF NOT EXISTS idx_commerce_operations_created ON commerce_operations(created_at);

      CREATE INDEX IF NOT EXISTS idx_trade_policies_campaign ON trade_policies(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_trade_policies_type ON trade_policies(policy_type);
      CREATE INDEX IF NOT EXISTS idx_trade_policies_status ON trade_policies(status);
      CREATE INDEX IF NOT EXISTS idx_trade_policies_resource ON trade_policies(target_resource);
      CREATE INDEX IF NOT EXISTS idx_trade_policies_partner ON trade_policies(target_partner);

      CREATE INDEX IF NOT EXISTS idx_business_registry_campaign ON business_registry(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_business_registry_type ON business_registry(business_type);
      CREATE INDEX IF NOT EXISTS idx_business_registry_sector ON business_registry(industry_sector);
      CREATE INDEX IF NOT EXISTS idx_business_registry_status ON business_registry(license_status);
      CREATE INDEX IF NOT EXISTS idx_business_registry_name ON business_registry(business_name);

      CREATE INDEX IF NOT EXISTS idx_market_intelligence_campaign ON market_intelligence(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_market_intelligence_type ON market_intelligence(intelligence_type);
      CREATE INDEX IF NOT EXISTS idx_market_intelligence_market ON market_intelligence(target_market);
      CREATE INDEX IF NOT EXISTS idx_market_intelligence_date ON market_intelligence(collection_date);

      CREATE INDEX IF NOT EXISTS idx_economic_development_campaign ON economic_development_projects(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_economic_development_type ON economic_development_projects(project_type);
      CREATE INDEX IF NOT EXISTS idx_economic_development_status ON economic_development_projects(status);
      CREATE INDEX IF NOT EXISTS idx_economic_development_sector ON economic_development_projects(target_sector);

      CREATE INDEX IF NOT EXISTS idx_commerce_budget_campaign ON commerce_budget(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_commerce_budget_period ON commerce_budget(fiscal_period);
      CREATE INDEX IF NOT EXISTS idx_commerce_budget_status ON commerce_budget(budget_status);

      CREATE INDEX IF NOT EXISTS idx_trade_agreements_campaign ON trade_agreements(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_trade_agreements_type ON trade_agreements(agreement_type);
      CREATE INDEX IF NOT EXISTS idx_trade_agreements_status ON trade_agreements(status);

      CREATE INDEX IF NOT EXISTS idx_business_audits_business ON business_compliance_audits(business_id);
      CREATE INDEX IF NOT EXISTS idx_business_audits_type ON business_compliance_audits(audit_type);
      CREATE INDEX IF NOT EXISTS idx_business_audits_date ON business_compliance_audits(audit_date);
    `);

    console.log('✅ Commerce Department schema initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Commerce Department schema:', error);
    throw error;
  }
}
