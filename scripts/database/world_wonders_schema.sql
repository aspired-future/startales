-- World Wonders & Household Economics Database Schema
-- Manages world wonders construction and household economic dynamics

-- World wonders master table
CREATE TABLE IF NOT EXISTS world_wonders (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('cultural', 'economic', 'military', 'scientific', 'religious', 'natural')),
    construction_cost BIGINT NOT NULL,
    construction_time INTEGER NOT NULL, -- months
    maintenance_cost BIGINT NOT NULL DEFAULT 0,
    cultural_impact DECIMAL(8,4) NOT NULL DEFAULT 0,
    economic_impact DECIMAL(8,4) NOT NULL DEFAULT 0,
    prestige_value INTEGER NOT NULL DEFAULT 0,
    requirements JSONB DEFAULT '[]',
    effects JSONB DEFAULT '[]',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Civilization-specific wonder construction tracking
CREATE TABLE IF NOT EXISTS civilization_wonders (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    wonder_id VARCHAR(100) NOT NULL REFERENCES world_wonders(id),
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'under_construction', 'completed', 'destroyed')),
    construction_progress DECIMAL(5,2) DEFAULT 0.0,
    location VARCHAR(200),
    started_at TIMESTAMP WITH TIME ZONE,
    completion_date TIMESTAMP WITH TIME ZONE,
    total_cost_spent BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, civilization_id, wonder_id)
);

-- Household economics main table
CREATE TABLE IF NOT EXISTS household_economics (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    average_income DECIMAL(12,2) NOT NULL,
    median_income DECIMAL(12,2) NOT NULL,
    gini_coefficient DECIMAL(6,4) NOT NULL, -- Income inequality measure
    savings_rate DECIMAL(6,4) NOT NULL,
    consumer_spending JSONB NOT NULL,
    housing_data JSONB NOT NULL,
    debt_data JSONB NOT NULL,
    mobility_data JSONB NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, civilization_id)
);

-- Income distribution tracking
CREATE TABLE IF NOT EXISTS income_distribution (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    income_bracket VARCHAR(50) NOT NULL,
    population_percentage DECIMAL(6,4) NOT NULL,
    average_income DECIMAL(12,2) NOT NULL,
    wealth_share DECIMAL(6,4) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consumer spending categories tracking
CREATE TABLE IF NOT EXISTS consumer_spending_categories (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    spending_amount DECIMAL(12,2) NOT NULL,
    percentage_of_income DECIMAL(6,4) NOT NULL,
    trend VARCHAR(20) CHECK (trend IN ('increasing', 'decreasing', 'stable')),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Housing market data
CREATE TABLE IF NOT EXISTS housing_market_data (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    average_home_price DECIMAL(12,2) NOT NULL,
    median_home_price DECIMAL(12,2) NOT NULL,
    home_ownership_rate DECIMAL(6,4) NOT NULL,
    rent_to_income_ratio DECIMAL(6,4) NOT NULL,
    housing_affordability_index DECIMAL(6,4) NOT NULL,
    construction_permits INTEGER DEFAULT 0,
    mortgage_rates DECIMAL(6,4) NOT NULL,
    foreclosure_rate DECIMAL(6,4) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Economic mobility tracking
CREATE TABLE IF NOT EXISTS economic_mobility_metrics (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    intergenerational_mobility DECIMAL(6,4) NOT NULL,
    social_mobility_index DECIMAL(6,4) NOT NULL,
    education_access_index DECIMAL(6,4) NOT NULL,
    entrepreneurship_rate DECIMAL(6,4) NOT NULL,
    job_market_flexibility DECIMAL(6,4) NOT NULL,
    upward_mobility_rate DECIMAL(6,4) DEFAULT 0,
    downward_mobility_rate DECIMAL(6,4) DEFAULT 0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wonder effects tracking
CREATE TABLE IF NOT EXISTS wonder_effects_log (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    wonder_id VARCHAR(100) NOT NULL,
    effect_type VARCHAR(100) NOT NULL,
    effect_magnitude DECIMAL(8,4) NOT NULL,
    effect_duration VARCHAR(50),
    effect_scope VARCHAR(50),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- World wonders knobs configuration
CREATE TABLE IF NOT EXISTS world_wonders_knobs (
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
CREATE INDEX IF NOT EXISTS idx_civilization_wonders_campaign_civ ON civilization_wonders(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_civilization_wonders_status ON civilization_wonders(status);
CREATE INDEX IF NOT EXISTS idx_household_economics_campaign_civ ON household_economics(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_income_distribution_campaign_civ ON income_distribution(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_consumer_spending_campaign_civ ON consumer_spending_categories(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_housing_market_campaign_civ ON housing_market_data(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_economic_mobility_campaign_civ ON economic_mobility_metrics(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_wonder_effects_campaign_civ ON wonder_effects_log(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_world_wonders_knobs_campaign_civ ON world_wonders_knobs(campaign_id, civilization_id);

-- Sample world wonders data
INSERT INTO world_wonders (id, name, type, construction_cost, construction_time, maintenance_cost, cultural_impact, economic_impact, prestige_value, description)
VALUES 
    ('great_library', 'Great Library', 'cultural', 500000000, 36, 5000000, 0.15, 0.05, 100, 'A magnificent repository of knowledge and learning'),
    ('colossus_harbor', 'Colossus of the Harbor', 'economic', 750000000, 48, 8000000, 0.08, 0.20, 120, 'A massive statue guarding the main harbor, boosting trade'),
    ('hanging_gardens', 'Hanging Gardens', 'cultural', 600000000, 42, 6000000, 0.18, 0.08, 110, 'Terraced gardens of extraordinary beauty and engineering'),
    ('great_wall', 'Great Wall', 'military', 1200000000, 60, 12000000, 0.10, 0.05, 150, 'Massive fortification protecting civilization borders'),
    ('oracle_temple', 'Oracle Temple', 'religious', 400000000, 30, 4000000, 0.20, 0.03, 90, 'Sacred temple providing divine guidance and wisdom'),
    ('lighthouse', 'Great Lighthouse', 'economic', 350000000, 24, 3500000, 0.05, 0.15, 80, 'Towering beacon guiding ships safely to port'),
    ('academy_sciences', 'Academy of Sciences', 'scientific', 800000000, 54, 10000000, 0.12, 0.12, 130, 'Premier institution for scientific research and discovery'),
    ('grand_amphitheater', 'Grand Amphitheater', 'cultural', 450000000, 36, 4500000, 0.25, 0.10, 95, 'Massive venue for cultural performances and gatherings')
ON CONFLICT (id) DO NOTHING;

-- Sample household economics data
INSERT INTO household_economics (campaign_id, civilization_id, average_income, median_income, gini_coefficient, savings_rate, consumer_spending, housing_data, debt_data, mobility_data)
VALUES 
    ('campaign_1', 'player_1', 45000.00, 38000.00, 0.35, 0.15, 
     '{"totalSpending": 38250, "categories": {"housing": 0.28, "food": 0.15, "transportation": 0.12, "healthcare": 0.08, "education": 0.06, "entertainment": 0.05, "savings": 0.15, "other": 0.11}, "spendingConfidence": 0.7}',
     '{"averageHomePrice": 285000, "homeOwnershipRate": 0.65, "rentToIncomeRatio": 0.25, "housingAffordabilityIndex": 0.6, "constructionActivity": 0.4, "mortgageRates": 0.045}',
     '{"totalHouseholdDebt": 95000, "debtToIncomeRatio": 2.1, "mortgageDebt": 65000, "consumerDebt": 18000, "studentDebt": 12000, "defaultRates": 0.03}',
     '{"intergenerationalMobility": 0.6, "socialMobilityIndex": 0.65, "educationAccessIndex": 0.8, "entrepreneurshipRate": 0.08, "jobMarketFlexibility": 0.7}'),
    ('campaign_1', 'ai_civ_1', 52000.00, 44000.00, 0.28, 0.18,
     '{"totalSpending": 42640, "categories": {"housing": 0.25, "food": 0.14, "transportation": 0.13, "healthcare": 0.09, "education": 0.08, "entertainment": 0.06, "savings": 0.18, "other": 0.07}, "spendingConfidence": 0.8}',
     '{"averageHomePrice": 310000, "homeOwnershipRate": 0.72, "rentToIncomeRatio": 0.22, "housingAffordabilityIndex": 0.7, "constructionActivity": 0.5, "mortgageRates": 0.042}',
     '{"totalHouseholdDebt": 88000, "debtToIncomeRatio": 1.9, "mortgageDebt": 62000, "consumerDebt": 15000, "studentDebt": 11000, "defaultRates": 0.025}',
     '{"intergenerationalMobility": 0.7, "socialMobilityIndex": 0.75, "educationAccessIndex": 0.85, "entrepreneurshipRate": 0.09, "jobMarketFlexibility": 0.8}')
ON CONFLICT (campaign_id, civilization_id) DO NOTHING;

-- Sample income distribution data
INSERT INTO income_distribution (campaign_id, civilization_id, income_bracket, population_percentage, average_income, wealth_share)
VALUES 
    ('campaign_1', 'player_1', 'bottom_quintile', 0.20, 18000, 0.08),
    ('campaign_1', 'player_1', 'second_quintile', 0.20, 28000, 0.14),
    ('campaign_1', 'player_1', 'middle_quintile', 0.20, 38000, 0.18),
    ('campaign_1', 'player_1', 'fourth_quintile', 0.20, 52000, 0.24),
    ('campaign_1', 'player_1', 'top_quintile', 0.20, 89000, 0.36)
ON CONFLICT DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE world_wonders IS 'Master table of all available world wonders with their properties and effects';
COMMENT ON TABLE civilization_wonders IS 'Tracks world wonder construction progress for each civilization';
COMMENT ON TABLE household_economics IS 'Main household economic indicators and metrics for each civilization';
COMMENT ON TABLE income_distribution IS 'Income distribution data across population segments';
COMMENT ON TABLE consumer_spending_categories IS 'Detailed consumer spending breakdown by category';
COMMENT ON TABLE housing_market_data IS 'Housing market conditions and affordability metrics';
COMMENT ON TABLE economic_mobility_metrics IS 'Social and economic mobility indicators';
COMMENT ON TABLE wonder_effects_log IS 'Log of wonder effects applied to civilizations';
COMMENT ON TABLE world_wonders_knobs IS 'AI-controllable parameters for world wonders and household economics';

COMMENT ON COLUMN world_wonders.type IS 'Wonder category: cultural, economic, military, scientific, religious, or natural';
COMMENT ON COLUMN civilization_wonders.status IS 'Construction status: available, under_construction, completed, or destroyed';
COMMENT ON COLUMN household_economics.gini_coefficient IS 'Income inequality measure (0 = perfect equality, 1 = perfect inequality)';
COMMENT ON COLUMN housing_market_data.housing_affordability_index IS 'Housing affordability index (1.0 = perfectly affordable)';
