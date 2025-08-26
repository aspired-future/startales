-- Entertainment, Culture & Tourism Industry Database Schema

-- Cultural Heritage Sites
CREATE TABLE IF NOT EXISTS cultural_heritage_sites (
    id SERIAL PRIMARY KEY,
    civilization_id INTEGER NOT NULL,
    site_name VARCHAR(255) NOT NULL,
    site_type VARCHAR(100) NOT NULL, -- historical, cultural, natural, archaeological
    significance_level VARCHAR(50) NOT NULL, -- low, medium, high, world_heritage
    condition_rating INTEGER CHECK (condition_rating >= 0 AND condition_rating <= 100),
    visitor_capacity INTEGER DEFAULT 0,
    annual_visitors INTEGER DEFAULT 0,
    maintenance_cost DECIMAL(15,2) DEFAULT 0,
    tourist_rating DECIMAL(3,2) CHECK (tourist_rating >= 0 AND tourist_rating <= 5),
    coordinates JSONB, -- {x, y, z} galactic coordinates
    description TEXT,
    preservation_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cultural Events and Festivals
CREATE TABLE IF NOT EXISTS cultural_events (
    id SERIAL PRIMARY KEY,
    civilization_id INTEGER NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- festival, ceremony, exhibition, performance
    duration_days INTEGER DEFAULT 1,
    budget DECIMAL(15,2) DEFAULT 0,
    expected_attendance INTEGER DEFAULT 0,
    actual_attendance INTEGER,
    cultural_impact_score INTEGER CHECK (cultural_impact_score >= 0 AND cultural_impact_score <= 100),
    economic_impact DECIMAL(15,2) DEFAULT 0,
    social_impact_score INTEGER CHECK (social_impact_score >= 0 AND social_impact_score <= 100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'planned', -- planned, active, completed, cancelled
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entertainment Venues
CREATE TABLE IF NOT EXISTS entertainment_venues (
    id SERIAL PRIMARY KEY,
    civilization_id INTEGER NOT NULL,
    venue_name VARCHAR(255) NOT NULL,
    venue_type VARCHAR(100) NOT NULL, -- theater, stadium, arena, cinema, club, casino
    capacity INTEGER DEFAULT 0,
    utilization_rate DECIMAL(5,2) CHECK (utilization_rate >= 0 AND utilization_rate <= 100),
    annual_events INTEGER DEFAULT 0,
    average_ticket_price DECIMAL(10,2) DEFAULT 0,
    annual_revenue DECIMAL(15,2) DEFAULT 0,
    employee_count INTEGER DEFAULT 0,
    operating_costs DECIMAL(15,2) DEFAULT 0,
    profit_margin DECIMAL(5,2),
    coordinates JSONB, -- {x, y, z} galactic coordinates
    amenities JSONB, -- array of amenities
    accessibility_rating INTEGER CHECK (accessibility_rating >= 0 AND accessibility_rating <= 100),
    safety_rating INTEGER CHECK (safety_rating >= 0 AND safety_rating <= 100),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entertainment Content Productions
CREATE TABLE IF NOT EXISTS entertainment_content (
    id SERIAL PRIMARY KEY,
    civilization_id INTEGER NOT NULL,
    content_title VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL, -- film, tv_series, game, music_album, book, podcast
    genre VARCHAR(100),
    production_budget DECIMAL(15,2) DEFAULT 0,
    marketing_budget DECIMAL(15,2) DEFAULT 0,
    target_audience VARCHAR(100),
    production_status VARCHAR(50) DEFAULT 'development', -- development, production, post_production, released, cancelled
    expected_revenue DECIMAL(15,2),
    actual_revenue DECIMAL(15,2),
    production_time_months INTEGER,
    release_date TIMESTAMP,
    critical_rating DECIMAL(3,2) CHECK (critical_rating >= 0 AND critical_rating <= 5),
    audience_rating DECIMAL(3,2) CHECK (audience_rating >= 0 AND audience_rating <= 5),
    cultural_impact_score INTEGER CHECK (cultural_impact_score >= 0 AND cultural_impact_score <= 100),
    export_potential INTEGER CHECK (export_potential >= 0 AND export_potential <= 100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tourist Attractions
CREATE TABLE IF NOT EXISTS tourist_attractions (
    id SERIAL PRIMARY KEY,
    civilization_id INTEGER NOT NULL,
    attraction_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- natural, cultural, scientific, recreational, adventure, historical
    attraction_type VARCHAR(100) NOT NULL,
    popularity_rating DECIMAL(3,2) CHECK (popularity_rating >= 0 AND popularity_rating <= 5),
    annual_visitors INTEGER DEFAULT 0,
    ticket_price DECIMAL(10,2) DEFAULT 0,
    operating_costs DECIMAL(15,2) DEFAULT 0,
    profit_margin DECIMAL(5,2),
    seasonal_variation DECIMAL(5,2) CHECK (seasonal_variation >= 0 AND seasonal_variation <= 1),
    accessibility_rating INTEGER CHECK (accessibility_rating >= 0 AND accessibility_rating <= 100),
    safety_rating INTEGER CHECK (safety_rating >= 0 AND safety_rating <= 100),
    environmental_impact_score INTEGER CHECK (environmental_impact_score >= 0 AND environmental_impact_score <= 100),
    coordinates JSONB, -- {x, y, z} galactic coordinates
    facilities JSONB, -- array of available facilities
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tourism Marketing Campaigns
CREATE TABLE IF NOT EXISTS tourism_marketing_campaigns (
    id SERIAL PRIMARY KEY,
    civilization_id INTEGER NOT NULL,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(100) NOT NULL, -- digital, traditional, social_media, influencer, trade_show
    budget DECIMAL(15,2) DEFAULT 0,
    duration_days INTEGER DEFAULT 30,
    target_markets JSONB, -- array of target market segments
    message TEXT,
    expected_reach INTEGER DEFAULT 0,
    actual_reach INTEGER,
    expected_conversion_rate DECIMAL(5,4),
    actual_conversion_rate DECIMAL(5,4),
    expected_new_visitors INTEGER,
    actual_new_visitors INTEGER,
    roi_percentage DECIMAL(7,2),
    status VARCHAR(50) DEFAULT 'planned', -- planned, active, completed, cancelled
    launch_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tourism Infrastructure
CREATE TABLE IF NOT EXISTS tourism_infrastructure (
    id SERIAL PRIMARY KEY,
    civilization_id INTEGER NOT NULL,
    infrastructure_name VARCHAR(255) NOT NULL,
    infrastructure_type VARCHAR(100) NOT NULL, -- hotel, restaurant, transport_hub, visitor_center, guide_service
    capacity INTEGER DEFAULT 0,
    quality_rating INTEGER CHECK (quality_rating >= 0 AND quality_rating <= 100),
    utilization_rate DECIMAL(5,2) CHECK (utilization_rate >= 0 AND utilization_rate <= 100),
    annual_revenue DECIMAL(15,2) DEFAULT 0,
    operating_costs DECIMAL(15,2) DEFAULT 0,
    employee_count INTEGER DEFAULT 0,
    sustainability_rating INTEGER CHECK (sustainability_rating >= 0 AND sustainability_rating <= 100),
    accessibility_features JSONB, -- array of accessibility features
    coordinates JSONB, -- {x, y, z} galactic coordinates
    services JSONB, -- array of services offered
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entertainment Tourism Employment
CREATE TABLE IF NOT EXISTS entertainment_tourism_employment (
    id SERIAL PRIMARY KEY,
    civilization_id INTEGER NOT NULL,
    sector VARCHAR(100) NOT NULL, -- entertainment, tourism, cultural
    subsector VARCHAR(100) NOT NULL, -- performing_arts, sports, hospitality, attractions, etc.
    job_category VARCHAR(100) NOT NULL, -- entry, mid, senior, management
    total_jobs INTEGER DEFAULT 0,
    average_salary DECIMAL(12,2) DEFAULT 0,
    job_growth_rate DECIMAL(5,4) DEFAULT 0,
    skill_requirements JSONB, -- array of required skills
    training_programs_available INTEGER DEFAULT 0,
    job_satisfaction_score INTEGER CHECK (job_satisfaction_score >= 0 AND job_satisfaction_score <= 100),
    career_advancement_opportunities INTEGER CHECK (career_advancement_opportunities >= 0 AND career_advancement_opportunities <= 100),
    seasonal_employment_variation DECIMAL(5,2) CHECK (seasonal_employment_variation >= 0 AND seasonal_employment_variation <= 1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entertainment Tourism Economic Impact
CREATE TABLE IF NOT EXISTS entertainment_tourism_economic_impact (
    id SERIAL PRIMARY KEY,
    civilization_id INTEGER NOT NULL,
    reporting_period VARCHAR(50) NOT NULL, -- monthly, quarterly, annual
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    
    -- Entertainment Industry Metrics
    entertainment_industry_size DECIMAL(18,2) DEFAULT 0,
    entertainment_gdp_contribution DECIMAL(5,2) DEFAULT 0,
    entertainment_employment INTEGER DEFAULT 0,
    entertainment_tax_revenue DECIMAL(15,2) DEFAULT 0,
    entertainment_exports DECIMAL(15,2) DEFAULT 0,
    
    -- Tourism Sector Metrics
    tourist_arrivals INTEGER DEFAULT 0,
    tourism_revenue DECIMAL(18,2) DEFAULT 0,
    tourism_gdp_contribution DECIMAL(5,2) DEFAULT 0,
    tourism_employment INTEGER DEFAULT 0,
    tourism_tax_revenue DECIMAL(15,2) DEFAULT 0,
    foreign_exchange_earnings DECIMAL(15,2) DEFAULT 0,
    
    -- Combined Metrics
    total_sector_gdp_contribution DECIMAL(5,2) DEFAULT 0,
    total_employment INTEGER DEFAULT 0,
    total_tax_revenue DECIMAL(15,2) DEFAULT 0,
    economic_multiplier DECIMAL(4,2) DEFAULT 1.0,
    investment_attraction DECIMAL(15,2) DEFAULT 0,
    competitiveness_rating INTEGER CHECK (competitiveness_rating >= 0 AND competitiveness_rating <= 100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entertainment Tourism Social Impact
CREATE TABLE IF NOT EXISTS entertainment_tourism_social_impact (
    id SERIAL PRIMARY KEY,
    civilization_id INTEGER NOT NULL,
    reporting_period VARCHAR(50) NOT NULL,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    
    cultural_participation_rate DECIMAL(5,2) CHECK (cultural_participation_rate >= 0 AND cultural_participation_rate <= 100),
    cultural_identity_strength INTEGER CHECK (cultural_identity_strength >= 0 AND cultural_identity_strength <= 100),
    intercultural_exchange_level INTEGER CHECK (intercultural_exchange_level >= 0 AND intercultural_exchange_level <= 100),
    entertainment_accessibility INTEGER CHECK (entertainment_accessibility >= 0 AND entertainment_accessibility <= 100),
    community_engagement INTEGER CHECK (community_engagement >= 0 AND community_engagement <= 100),
    cultural_authenticity_index INTEGER CHECK (cultural_authenticity_index >= 0 AND cultural_authenticity_index <= 100),
    social_cohesion_impact INTEGER CHECK (social_cohesion_impact >= -100 AND social_cohesion_impact <= 100),
    quality_of_life_contribution INTEGER CHECK (quality_of_life_contribution >= 0 AND quality_of_life_contribution <= 100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entertainment Tourism Events Log
CREATE TABLE IF NOT EXISTS entertainment_tourism_events (
    id SERIAL PRIMARY KEY,
    civilization_id INTEGER NOT NULL,
    event_id VARCHAR(255) NOT NULL UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    cultural_impact INTEGER CHECK (cultural_impact >= -100 AND cultural_impact <= 100),
    economic_impact INTEGER CHECK (economic_impact >= -100 AND economic_impact <= 100),
    social_impact INTEGER CHECK (social_impact >= -100 AND social_impact <= 100),
    environmental_impact INTEGER CHECK (environmental_impact >= -100 AND environmental_impact <= 100),
    duration_ticks INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active', -- active, resolved, expired
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Entertainment Tourism Knob Settings
CREATE TABLE IF NOT EXISTS entertainment_tourism_knobs (
    id SERIAL PRIMARY KEY,
    civilization_id INTEGER NOT NULL UNIQUE,
    
    -- Cultural Development Knobs
    cultural_heritage_preservation INTEGER CHECK (cultural_heritage_preservation >= 0 AND cultural_heritage_preservation <= 100) DEFAULT 70,
    artistic_expression_freedom INTEGER CHECK (artistic_expression_freedom >= 0 AND artistic_expression_freedom <= 100) DEFAULT 75,
    cultural_diversity_promotion INTEGER CHECK (cultural_diversity_promotion >= 0 AND cultural_diversity_promotion <= 100) DEFAULT 65,
    traditional_arts_funding INTEGER CHECK (traditional_arts_funding >= 0 AND traditional_arts_funding <= 100) DEFAULT 60,
    modern_arts_innovation INTEGER CHECK (modern_arts_innovation >= 0 AND modern_arts_innovation <= 100) DEFAULT 55,
    cultural_education_emphasis INTEGER CHECK (cultural_education_emphasis >= 0 AND cultural_education_emphasis <= 100) DEFAULT 65,
    
    -- Entertainment Industry Knobs
    entertainment_venue_development INTEGER CHECK (entertainment_venue_development >= 0 AND entertainment_venue_development <= 100) DEFAULT 60,
    entertainment_content_regulation INTEGER CHECK (entertainment_content_regulation >= 0 AND entertainment_content_regulation <= 100) DEFAULT 40,
    celebrity_culture_influence INTEGER CHECK (celebrity_culture_influence >= 0 AND celebrity_culture_influence <= 100) DEFAULT 50,
    sports_industry_investment INTEGER CHECK (sports_industry_investment >= 0 AND sports_industry_investment <= 100) DEFAULT 55,
    gaming_industry_support INTEGER CHECK (gaming_industry_support >= 0 AND gaming_industry_support <= 100) DEFAULT 45,
    live_performance_promotion INTEGER CHECK (live_performance_promotion >= 0 AND live_performance_promotion <= 100) DEFAULT 60,
    
    -- Tourism Infrastructure Knobs
    tourism_infrastructure_investment INTEGER CHECK (tourism_infrastructure_investment >= 0 AND tourism_infrastructure_investment <= 100) DEFAULT 65,
    natural_attraction_conservation INTEGER CHECK (natural_attraction_conservation >= 0 AND natural_attraction_conservation <= 100) DEFAULT 75,
    historical_site_maintenance INTEGER CHECK (historical_site_maintenance >= 0 AND historical_site_maintenance <= 100) DEFAULT 70,
    tourist_safety_measures INTEGER CHECK (tourist_safety_measures >= 0 AND tourist_safety_measures <= 100) DEFAULT 80,
    tourism_marketing_budget INTEGER CHECK (tourism_marketing_budget >= 0 AND tourism_marketing_budget <= 100) DEFAULT 50,
    sustainable_tourism_practices INTEGER CHECK (sustainable_tourism_practices >= 0 AND sustainable_tourism_practices <= 100) DEFAULT 60,
    
    -- Economic Integration Knobs
    entertainment_tax_incentives INTEGER CHECK (entertainment_tax_incentives >= 0 AND entertainment_tax_incentives <= 100) DEFAULT 45,
    tourism_visa_accessibility INTEGER CHECK (tourism_visa_accessibility >= 0 AND tourism_visa_accessibility <= 100) DEFAULT 60,
    cultural_export_promotion INTEGER CHECK (cultural_export_promotion >= 0 AND cultural_export_promotion <= 100) DEFAULT 50,
    entertainment_employment_programs INTEGER CHECK (entertainment_employment_programs >= 0 AND entertainment_employment_programs <= 100) DEFAULT 55,
    tourism_revenue_reinvestment INTEGER CHECK (tourism_revenue_reinvestment >= 0 AND tourism_revenue_reinvestment <= 100) DEFAULT 65,
    cultural_intellectual_property INTEGER CHECK (cultural_intellectual_property >= 0 AND cultural_intellectual_property <= 100) DEFAULT 70,
    
    -- Social Impact Knobs
    community_cultural_participation INTEGER CHECK (community_cultural_participation >= 0 AND community_cultural_participation <= 100) DEFAULT 60,
    cultural_identity_strengthening INTEGER CHECK (cultural_identity_strengthening >= 0 AND cultural_identity_strengthening <= 100) DEFAULT 65,
    intercultural_exchange_programs INTEGER CHECK (intercultural_exchange_programs >= 0 AND intercultural_exchange_programs <= 100) DEFAULT 55,
    entertainment_accessibility INTEGER CHECK (entertainment_accessibility >= 0 AND entertainment_accessibility <= 100) DEFAULT 60,
    cultural_tourism_authenticity INTEGER CHECK (cultural_tourism_authenticity >= 0 AND cultural_tourism_authenticity <= 100) DEFAULT 70,
    entertainment_industry_ethics INTEGER CHECK (entertainment_industry_ethics >= 0 AND entertainment_industry_ethics <= 100) DEFAULT 65,
    
    -- Innovation & Technology Knobs
    digital_entertainment_platforms INTEGER CHECK (digital_entertainment_platforms >= 0 AND digital_entertainment_platforms <= 100) DEFAULT 50,
    cultural_technology_integration INTEGER CHECK (cultural_technology_integration >= 0 AND cultural_technology_integration <= 100) DEFAULT 45,
    virtual_tourism_development INTEGER CHECK (virtual_tourism_development >= 0 AND virtual_tourism_development <= 100) DEFAULT 35,
    entertainment_data_analytics INTEGER CHECK (entertainment_data_analytics >= 0 AND entertainment_data_analytics <= 100) DEFAULT 40,
    cultural_ai_applications INTEGER CHECK (cultural_ai_applications >= 0 AND cultural_ai_applications <= 100) DEFAULT 30,
    smart_tourism_systems INTEGER CHECK (smart_tourism_systems >= 0 AND smart_tourism_systems <= 100) DEFAULT 40,
    
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cultural_heritage_sites_civilization ON cultural_heritage_sites(civilization_id);
CREATE INDEX IF NOT EXISTS idx_cultural_events_civilization ON cultural_events(civilization_id);
CREATE INDEX IF NOT EXISTS idx_entertainment_venues_civilization ON entertainment_venues(civilization_id);
CREATE INDEX IF NOT EXISTS idx_entertainment_content_civilization ON entertainment_content(civilization_id);
CREATE INDEX IF NOT EXISTS idx_tourist_attractions_civilization ON tourist_attractions(civilization_id);
CREATE INDEX IF NOT EXISTS idx_tourism_marketing_campaigns_civilization ON tourism_marketing_campaigns(civilization_id);
CREATE INDEX IF NOT EXISTS idx_tourism_infrastructure_civilization ON tourism_infrastructure(civilization_id);
CREATE INDEX IF NOT EXISTS idx_entertainment_tourism_employment_civilization ON entertainment_tourism_employment(civilization_id);
CREATE INDEX IF NOT EXISTS idx_entertainment_tourism_economic_impact_civilization ON entertainment_tourism_economic_impact(civilization_id);
CREATE INDEX IF NOT EXISTS idx_entertainment_tourism_social_impact_civilization ON entertainment_tourism_social_impact(civilization_id);
CREATE INDEX IF NOT EXISTS idx_entertainment_tourism_events_civilization ON entertainment_tourism_events(civilization_id);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cultural_heritage_sites_updated_at BEFORE UPDATE ON cultural_heritage_sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cultural_events_updated_at BEFORE UPDATE ON cultural_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_entertainment_venues_updated_at BEFORE UPDATE ON entertainment_venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_entertainment_content_updated_at BEFORE UPDATE ON entertainment_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tourist_attractions_updated_at BEFORE UPDATE ON tourist_attractions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tourism_marketing_campaigns_updated_at BEFORE UPDATE ON tourism_marketing_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tourism_infrastructure_updated_at BEFORE UPDATE ON tourism_infrastructure FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_entertainment_tourism_employment_updated_at BEFORE UPDATE ON entertainment_tourism_employment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_entertainment_tourism_knobs_updated_at BEFORE UPDATE ON entertainment_tourism_knobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
