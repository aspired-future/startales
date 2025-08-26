-- Enhanced Treasury & Tax Management System Schema
-- This schema supports the enhanced API knobs for treasury operations

-- Tax Policy Configuration Table
CREATE TABLE IF NOT EXISTS treasury_tax_policies (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER NOT NULL,
    civilization_id INTEGER NOT NULL,
    
    -- Tax Rates (from knobs)
    income_tax_rate DECIMAL(5,2) DEFAULT 25.0,
    corporate_tax_rate DECIMAL(5,2) DEFAULT 21.0,
    sales_tax_rate DECIMAL(5,2) DEFAULT 8.5,
    property_tax_rate DECIMAL(5,2) DEFAULT 1.2,
    luxury_tax_rate DECIMAL(5,2) DEFAULT 15.0,
    import_tariff_rate DECIMAL(5,2) DEFAULT 5.0,
    
    -- Collection & Enforcement
    tax_collection_efficiency DECIMAL(5,2) DEFAULT 85.0,
    tax_evasion_enforcement INTEGER DEFAULT 6,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(campaign_id, civilization_id)
);

-- Budget Allocation Configuration Table
CREATE TABLE IF NOT EXISTS treasury_budget_allocations (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER NOT NULL,
    civilization_id INTEGER NOT NULL,
    fiscal_year INTEGER NOT NULL,
    
    -- Budget Allocations (percentages from knobs)
    defense_spending_allocation DECIMAL(5,2) DEFAULT 15.0,
    education_spending_allocation DECIMAL(5,2) DEFAULT 18.0,
    healthcare_spending_allocation DECIMAL(5,2) DEFAULT 20.0,
    infrastructure_spending_allocation DECIMAL(5,2) DEFAULT 12.0,
    social_services_allocation DECIMAL(5,2) DEFAULT 15.0,
    research_development_allocation DECIMAL(5,2) DEFAULT 5.0,
    
    -- Reserve & Debt Management
    emergency_reserves_target DECIMAL(5,2) DEFAULT 8.0,
    debt_service_priority INTEGER DEFAULT 9,
    
    -- Total Budget Amount
    total_budget_amount BIGINT DEFAULT 5000000000,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(campaign_id, civilization_id, fiscal_year)
);

-- Revenue Management Configuration Table
CREATE TABLE IF NOT EXISTS treasury_revenue_management (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER NOT NULL,
    civilization_id INTEGER NOT NULL,
    
    -- Revenue Strategy Settings (from knobs)
    revenue_diversification_target DECIMAL(5,2) DEFAULT 65.0,
    tax_incentive_aggressiveness INTEGER DEFAULT 5,
    public_asset_monetization INTEGER DEFAULT 4,
    user_fee_optimization INTEGER DEFAULT 6,
    sin_tax_strategy INTEGER DEFAULT 7,
    carbon_tax_implementation INTEGER DEFAULT 3,
    digital_economy_taxation INTEGER DEFAULT 5,
    international_tax_cooperation INTEGER DEFAULT 6,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(campaign_id, civilization_id)
);

-- Tax Collection Records Table
CREATE TABLE IF NOT EXISTS treasury_tax_collections (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER NOT NULL,
    civilization_id INTEGER NOT NULL,
    collection_date DATE NOT NULL,
    
    -- Tax Source Details
    tax_source VARCHAR(100) NOT NULL, -- 'income', 'corporate', 'sales', 'property', 'luxury', 'tariff'
    tax_rate DECIMAL(5,2) NOT NULL,
    base_amount BIGINT NOT NULL,
    collected_amount BIGINT NOT NULL,
    
    -- Collection Metrics
    collection_efficiency DECIMAL(5,2) NOT NULL,
    evasion_rate DECIMAL(5,2) NOT NULL,
    enforcement_level INTEGER NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_treasury_collections_campaign_civ (campaign_id, civilization_id),
    INDEX idx_treasury_collections_date (collection_date),
    INDEX idx_treasury_collections_source (tax_source)
);

-- Budget Expenditure Tracking Table
CREATE TABLE IF NOT EXISTS treasury_budget_expenditures (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER NOT NULL,
    civilization_id INTEGER NOT NULL,
    fiscal_year INTEGER NOT NULL,
    
    -- Expenditure Category
    category VARCHAR(100) NOT NULL, -- 'defense', 'education', 'healthcare', etc.
    allocated_amount BIGINT NOT NULL,
    spent_amount BIGINT DEFAULT 0,
    remaining_amount BIGINT NOT NULL,
    
    -- Expenditure Details
    expenditure_date DATE,
    description TEXT,
    authorized_by VARCHAR(255),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_treasury_expenditures_campaign_civ (campaign_id, civilization_id),
    INDEX idx_treasury_expenditures_category (category),
    INDEX idx_treasury_expenditures_fiscal_year (fiscal_year)
);

-- Revenue Diversification Tracking Table
CREATE TABLE IF NOT EXISTS treasury_revenue_sources (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER NOT NULL,
    civilization_id INTEGER NOT NULL,
    revenue_period DATE NOT NULL,
    
    -- Revenue Source Breakdown
    income_tax_revenue BIGINT DEFAULT 0,
    corporate_tax_revenue BIGINT DEFAULT 0,
    sales_tax_revenue BIGINT DEFAULT 0,
    property_tax_revenue BIGINT DEFAULT 0,
    luxury_tax_revenue BIGINT DEFAULT 0,
    tariff_revenue BIGINT DEFAULT 0,
    
    -- Alternative Revenue Sources
    user_fee_revenue BIGINT DEFAULT 0,
    asset_monetization_revenue BIGINT DEFAULT 0,
    carbon_tax_revenue BIGINT DEFAULT 0,
    digital_tax_revenue BIGINT DEFAULT 0,
    sin_tax_revenue BIGINT DEFAULT 0,
    
    -- Total Revenue
    total_revenue BIGINT NOT NULL,
    diversification_score DECIMAL(5,2),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(campaign_id, civilization_id, revenue_period),
    INDEX idx_treasury_revenue_sources_period (revenue_period)
);

-- Treasury Performance Metrics Table
CREATE TABLE IF NOT EXISTS treasury_performance_metrics (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER NOT NULL,
    civilization_id INTEGER NOT NULL,
    metric_date DATE NOT NULL,
    
    -- Collection Performance
    overall_collection_efficiency DECIMAL(5,2) NOT NULL,
    tax_compliance_rate DECIMAL(5,2) NOT NULL,
    enforcement_effectiveness DECIMAL(5,2) NOT NULL,
    
    -- Budget Performance
    budget_utilization_rate DECIMAL(5,2) NOT NULL,
    spending_efficiency DECIMAL(5,2) NOT NULL,
    allocation_accuracy DECIMAL(5,2) NOT NULL,
    
    -- Revenue Performance
    revenue_growth_rate DECIMAL(5,2),
    diversification_index DECIMAL(5,2),
    revenue_stability_score DECIMAL(5,2),
    
    -- Debt & Reserves
    debt_service_ratio DECIMAL(5,2),
    reserve_adequacy_ratio DECIMAL(5,2),
    fiscal_balance BIGINT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(campaign_id, civilization_id, metric_date),
    INDEX idx_treasury_performance_date (metric_date)
);

-- Treasury Knob State Tracking Table
CREATE TABLE IF NOT EXISTS treasury_knob_states (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER NOT NULL,
    civilization_id INTEGER NOT NULL,
    
    -- Knob Categories and Values (JSON for flexibility)
    tax_policy_knobs JSONB DEFAULT '{}',
    budget_allocation_knobs JSONB DEFAULT '{}',
    revenue_management_knobs JSONB DEFAULT '{}',
    
    -- Knob Change History
    last_modified_by VARCHAR(255),
    modification_reason TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(campaign_id, civilization_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_treasury_tax_policies_campaign_civ ON treasury_tax_policies(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_treasury_budget_allocations_campaign_civ ON treasury_budget_allocations(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_treasury_revenue_management_campaign_civ ON treasury_revenue_management(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_treasury_knob_states_campaign_civ ON treasury_knob_states(campaign_id, civilization_id);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_treasury_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER treasury_tax_policies_update_timestamp
    BEFORE UPDATE ON treasury_tax_policies
    FOR EACH ROW EXECUTE FUNCTION update_treasury_timestamp();

CREATE TRIGGER treasury_budget_allocations_update_timestamp
    BEFORE UPDATE ON treasury_budget_allocations
    FOR EACH ROW EXECUTE FUNCTION update_treasury_timestamp();

CREATE TRIGGER treasury_revenue_management_update_timestamp
    BEFORE UPDATE ON treasury_revenue_management
    FOR EACH ROW EXECUTE FUNCTION update_treasury_timestamp();

CREATE TRIGGER treasury_budget_expenditures_update_timestamp
    BEFORE UPDATE ON treasury_budget_expenditures
    FOR EACH ROW EXECUTE FUNCTION update_treasury_timestamp();

CREATE TRIGGER treasury_knob_states_update_timestamp
    BEFORE UPDATE ON treasury_knob_states
    FOR EACH ROW EXECUTE FUNCTION update_treasury_timestamp();
