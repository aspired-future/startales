-- Business Cycle System Database Schema
-- Manages economic cycles, growth periods, and recession dynamics

-- Main business cycles table
CREATE TABLE IF NOT EXISTS business_cycles (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    current_phase VARCHAR(50) NOT NULL CHECK (current_phase IN ('expansion', 'peak', 'contraction', 'trough')),
    cycle_length INTEGER NOT NULL DEFAULT 84, -- months
    gdp_growth_rate DECIMAL(8,6) NOT NULL DEFAULT 0.025,
    unemployment_rate DECIMAL(8,6) NOT NULL DEFAULT 0.05,
    inflation_rate DECIMAL(8,6) NOT NULL DEFAULT 0.02,
    consumer_confidence DECIMAL(8,6) NOT NULL DEFAULT 0.7,
    business_investment DECIMAL(8,6) NOT NULL DEFAULT 0.15,
    government_spending DECIMAL(8,6) NOT NULL DEFAULT 0.2,
    trade_balance DECIMAL(8,6) NOT NULL DEFAULT 0.02,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, civilization_id)
);

-- Business cycle history tracking
CREATE TABLE IF NOT EXISTS business_cycle_history (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    phase VARCHAR(50) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- months
    peak_gdp DECIMAL(12,2),
    trough_gdp DECIMAL(12,2),
    severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe')),
    trigger_event TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Economic indicators tracking
CREATE TABLE IF NOT EXISTS economic_indicators (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    indicator_name VARCHAR(100) NOT NULL,
    indicator_value DECIMAL(12,6) NOT NULL,
    trend VARCHAR(20) CHECK (trend IN ('rising', 'falling', 'stable')),
    significance VARCHAR(20) CHECK (significance IN ('high', 'medium', 'low')),
    category VARCHAR(50),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Economic shocks and events
CREATE TABLE IF NOT EXISTS economic_shocks (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    shock_type VARCHAR(100) NOT NULL,
    severity DECIMAL(4,2) NOT NULL,
    duration INTEGER NOT NULL, -- months
    gdp_impact DECIMAL(8,6),
    unemployment_impact DECIMAL(8,6),
    inflation_impact DECIMAL(8,6),
    recovery_time INTEGER, -- months
    description TEXT,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Business cycle knobs configuration
CREATE TABLE IF NOT EXISTS business_cycle_knobs (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    knob_name VARCHAR(100) NOT NULL,
    knob_value DECIMAL(8,6) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by VARCHAR(100) DEFAULT 'system',
    UNIQUE(campaign_id, civilization_id, knob_name)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_cycles_campaign_civ ON business_cycles(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_business_cycle_history_campaign_civ ON business_cycle_history(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_business_cycle_history_dates ON business_cycle_history(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_economic_indicators_campaign_civ ON economic_indicators(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_economic_indicators_name ON economic_indicators(indicator_name);
CREATE INDEX IF NOT EXISTS idx_economic_shocks_campaign_civ ON economic_shocks(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_business_cycle_knobs_campaign_civ ON business_cycle_knobs(campaign_id, civilization_id);

-- Sample data for testing
INSERT INTO business_cycles (campaign_id, civilization_id, current_phase, gdp_growth_rate, unemployment_rate, inflation_rate)
VALUES 
    ('campaign_1', 'player_1', 'expansion', 0.035, 0.045, 0.025),
    ('campaign_1', 'ai_civ_1', 'peak', 0.015, 0.038, 0.032)
ON CONFLICT (campaign_id, civilization_id) DO NOTHING;

INSERT INTO economic_indicators (campaign_id, civilization_id, indicator_name, indicator_value, trend, significance, category)
VALUES 
    ('campaign_1', 'player_1', 'GDP Growth Rate', 0.035, 'rising', 'high', 'growth'),
    ('campaign_1', 'player_1', 'Unemployment Rate', 0.045, 'falling', 'high', 'labor'),
    ('campaign_1', 'player_1', 'Inflation Rate', 0.025, 'stable', 'medium', 'prices'),
    ('campaign_1', 'player_1', 'Consumer Confidence Index', 78.5, 'rising', 'medium', 'sentiment'),
    ('campaign_1', 'player_1', 'Business Investment Rate', 0.18, 'rising', 'high', 'investment')
ON CONFLICT DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE business_cycles IS 'Main table tracking current business cycle status for each civilization';
COMMENT ON TABLE business_cycle_history IS 'Historical record of business cycle phases and transitions';
COMMENT ON TABLE economic_indicators IS 'Real-time economic indicators and metrics';
COMMENT ON TABLE economic_shocks IS 'Record of economic shocks and their impacts';
COMMENT ON TABLE business_cycle_knobs IS 'AI-controllable parameters for business cycle simulation';

COMMENT ON COLUMN business_cycles.current_phase IS 'Current phase: expansion, peak, contraction, or trough';
COMMENT ON COLUMN business_cycles.cycle_length IS 'Typical length of full business cycle in months';
COMMENT ON COLUMN business_cycle_history.severity IS 'Severity of recession/expansion: mild, moderate, or severe';
COMMENT ON COLUMN economic_shocks.severity IS 'Shock severity from 0.0 (minimal) to 10.0 (catastrophic)';
