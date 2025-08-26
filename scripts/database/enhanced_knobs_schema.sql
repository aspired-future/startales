-- Enhanced Knobs Integration Database Schema
-- Manages all enhanced API knobs state and simulation integration

-- Enhanced knobs state table
CREATE TABLE IF NOT EXISTS enhanced_knobs_state (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    system_name VARCHAR(100) NOT NULL,
    knob_name VARCHAR(100) NOT NULL,
    knob_value DECIMAL(10,6) NOT NULL,
    updated_by VARCHAR(50) DEFAULT 'system' CHECK (updated_by IN ('ai', 'player', 'system')),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, civilization_id, system_name, knob_name)
);

-- Knob update history for tracking changes
CREATE TABLE IF NOT EXISTS knob_update_history (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    system_name VARCHAR(100) NOT NULL,
    knob_name VARCHAR(100) NOT NULL,
    old_value DECIMAL(10,6),
    new_value DECIMAL(10,6) NOT NULL,
    updated_by VARCHAR(50) NOT NULL,
    update_reason TEXT,
    update_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simulation state snapshots
CREATE TABLE IF NOT EXISTS simulation_state_snapshots (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    state_data JSONB NOT NULL,
    performance_metrics JSONB,
    snapshot_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    snapshot_type VARCHAR(50) DEFAULT 'periodic' CHECK (snapshot_type IN ('periodic', 'event_triggered', 'manual'))
);

-- AI knob recommendations tracking
CREATE TABLE IF NOT EXISTS ai_knob_recommendations (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    system_name VARCHAR(100) NOT NULL,
    recommended_knobs JSONB NOT NULL,
    recommendation_context JSONB,
    confidence_score DECIMAL(4,3),
    applied BOOLEAN DEFAULT false,
    recommendation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    applied_timestamp TIMESTAMP WITH TIME ZONE
);

-- System performance metrics
CREATE TABLE IF NOT EXISTS system_performance_metrics (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    system_name VARCHAR(100) NOT NULL,
    performance_score DECIMAL(6,4) NOT NULL,
    efficiency_rating DECIMAL(6,4) NOT NULL,
    stability_index DECIMAL(6,4) NOT NULL,
    user_satisfaction DECIMAL(6,4),
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cross-system interaction effects
CREATE TABLE IF NOT EXISTS cross_system_effects (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    source_system VARCHAR(100) NOT NULL,
    target_system VARCHAR(100) NOT NULL,
    effect_type VARCHAR(100) NOT NULL,
    effect_magnitude DECIMAL(8,6) NOT NULL,
    effect_duration INTEGER, -- in simulation ticks
    effect_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    effect_end TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Knob automation rules
CREATE TABLE IF NOT EXISTS knob_automation_rules (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    civilization_id VARCHAR(255) NOT NULL,
    rule_name VARCHAR(200) NOT NULL,
    system_name VARCHAR(100) NOT NULL,
    knob_name VARCHAR(100) NOT NULL,
    trigger_conditions JSONB NOT NULL,
    target_value DECIMAL(10,6) NOT NULL,
    adjustment_speed DECIMAL(6,4) DEFAULT 0.1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_triggered TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_enhanced_knobs_state_campaign_civ ON enhanced_knobs_state(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_knobs_state_system ON enhanced_knobs_state(system_name);
CREATE INDEX IF NOT EXISTS idx_knob_update_history_campaign_civ ON knob_update_history(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_knob_update_history_timestamp ON knob_update_history(update_timestamp);
CREATE INDEX IF NOT EXISTS idx_simulation_state_snapshots_campaign_civ ON simulation_state_snapshots(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_simulation_state_snapshots_timestamp ON simulation_state_snapshots(snapshot_timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_knob_recommendations_campaign_civ ON ai_knob_recommendations(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_ai_knob_recommendations_timestamp ON ai_knob_recommendations(recommendation_timestamp);
CREATE INDEX IF NOT EXISTS idx_system_performance_metrics_campaign_civ ON system_performance_metrics(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_cross_system_effects_campaign_civ ON cross_system_effects(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_cross_system_effects_active ON cross_system_effects(is_active);
CREATE INDEX IF NOT EXISTS idx_knob_automation_rules_campaign_civ ON knob_automation_rules(campaign_id, civilization_id);
CREATE INDEX IF NOT EXISTS idx_knob_automation_rules_active ON knob_automation_rules(is_active);

-- Sample enhanced knobs data for testing
INSERT INTO enhanced_knobs_state (campaign_id, civilization_id, system_name, knob_name, knob_value, updated_by)
VALUES 
    -- Business Cycle knobs
    ('campaign_1', 'player_1', 'business_cycle', 'cycle_volatility', 0.5, 'system'),
    ('campaign_1', 'player_1', 'business_cycle', 'expansion_duration', 1.0, 'system'),
    ('campaign_1', 'player_1', 'business_cycle', 'recession_severity', 1.0, 'system'),
    ('campaign_1', 'player_1', 'business_cycle', 'recovery_speed', 1.0, 'system'),
    
    -- World Wonders knobs
    ('campaign_1', 'player_1', 'world_wonders', 'construction_speed', 1.0, 'system'),
    ('campaign_1', 'player_1', 'world_wonders', 'availability_rate', 0.6, 'system'),
    ('campaign_1', 'player_1', 'world_wonders', 'cultural_impact', 1.0, 'system'),
    ('campaign_1', 'player_1', 'world_wonders', 'maintenance_cost', 1.0, 'system'),
    
    -- Political Systems knobs
    ('campaign_1', 'player_1', 'political_systems', 'multiparty_stability', 0.7, 'system'),
    ('campaign_1', 'player_1', 'political_systems', 'polarization_tendency', 0.4, 'system'),
    ('campaign_1', 'player_1', 'political_systems', 'voter_turnout', 0.65, 'system'),
    ('campaign_1', 'player_1', 'political_systems', 'democratic_health', 0.7, 'system'),
    
    -- Culture knobs
    ('campaign_1', 'player_1', 'culture', 'cultural_diversity', 0.6, 'system'),
    ('campaign_1', 'player_1', 'culture', 'social_cohesion', 0.7, 'system'),
    ('campaign_1', 'player_1', 'culture', 'tradition_preservation', 0.5, 'system'),
    ('campaign_1', 'player_1', 'culture', 'innovation_acceptance', 0.6, 'system'),
    
    -- Treasury knobs
    ('campaign_1', 'player_1', 'treasury', 'tax_efficiency', 0.7, 'system'),
    ('campaign_1', 'player_1', 'treasury', 'spending_transparency', 0.6, 'system'),
    ('campaign_1', 'player_1', 'treasury', 'budget_discipline', 0.5, 'system'),
    ('campaign_1', 'player_1', 'treasury', 'revenue_diversification', 0.4, 'system')
ON CONFLICT (campaign_id, civilization_id, system_name, knob_name) DO NOTHING;

-- Sample simulation state snapshot
INSERT INTO simulation_state_snapshots (campaign_id, civilization_id, state_data, performance_metrics)
VALUES 
    ('campaign_1', 'player_1', 
     '{"businessCycle": {"currentPhase": "expansion", "volatility": 0.5, "growthRate": 0.025}, "worldWonders": {"constructionSpeed": 1.0, "availabilityRate": 0.6, "culturalImpact": 1.0}, "politicalSystems": {"stability": 0.7, "democraticHealth": 0.7, "polarization": 0.4}}',
     '{"overallPerformance": 0.75, "systemEfficiency": 0.68, "playerSatisfaction": 0.82, "aiResponseTime": 0.15}')
ON CONFLICT DO NOTHING;

-- Sample AI knob recommendations
INSERT INTO ai_knob_recommendations (campaign_id, civilization_id, system_name, recommended_knobs, recommendation_context, confidence_score)
VALUES 
    ('campaign_1', 'player_1', 'business_cycle', 
     '{"cycle_volatility": 0.3, "recovery_speed": 1.2}',
     '{"economicStress": 0.3, "policySupport": 0.4, "externalFactors": ["stable_trade", "low_inflation"]}',
     0.85),
    ('campaign_1', 'player_1', 'political_systems',
     '{"polarization_tendency": 0.2, "democratic_health": 0.8}',
     '{"socialTension": 0.2, "institutionalStrength": 0.8, "recentEvents": ["successful_election", "peaceful_transition"]}',
     0.78)
ON CONFLICT DO NOTHING;

-- Sample system performance metrics
INSERT INTO system_performance_metrics (campaign_id, civilization_id, system_name, performance_score, efficiency_rating, stability_index, user_satisfaction)
VALUES 
    ('campaign_1', 'player_1', 'business_cycle', 0.75, 0.68, 0.82, 0.70),
    ('campaign_1', 'player_1', 'world_wonders', 0.80, 0.75, 0.85, 0.78),
    ('campaign_1', 'player_1', 'political_systems', 0.72, 0.65, 0.79, 0.74),
    ('campaign_1', 'player_1', 'culture', 0.78, 0.72, 0.81, 0.76),
    ('campaign_1', 'player_1', 'treasury', 0.69, 0.62, 0.75, 0.68)
ON CONFLICT DO NOTHING;

-- Sample cross-system effects
INSERT INTO cross_system_effects (campaign_id, civilization_id, source_system, target_system, effect_type, effect_magnitude, effect_duration)
VALUES 
    ('campaign_1', 'player_1', 'world_wonders', 'culture', 'cultural_boost', 0.15, 1440), -- 24 hours
    ('campaign_1', 'player_1', 'political_systems', 'business_cycle', 'stability_influence', 0.08, 2880), -- 48 hours
    ('campaign_1', 'player_1', 'treasury', 'world_wonders', 'funding_efficiency', 0.12, 4320), -- 72 hours
    ('campaign_1', 'player_1', 'business_cycle', 'political_systems', 'economic_pressure', -0.05, 1800) -- 30 hours
ON CONFLICT DO NOTHING;

-- Sample knob automation rules
INSERT INTO knob_automation_rules (campaign_id, civilization_id, rule_name, system_name, knob_name, trigger_conditions, target_value, adjustment_speed)
VALUES 
    ('campaign_1', 'player_1', 'Economic Crisis Response', 'business_cycle', 'recovery_speed', 
     '{"conditions": [{"metric": "gdp_growth", "operator": "less_than", "value": -0.02}]}', 
     1.5, 0.2),
    ('campaign_1', 'player_1', 'Political Stability Maintenance', 'political_systems', 'polarization_tendency',
     '{"conditions": [{"metric": "social_unrest", "operator": "greater_than", "value": 0.7}]}',
     0.2, 0.15),
    ('campaign_1', 'player_1', 'Cultural Preservation', 'culture', 'tradition_preservation',
     '{"conditions": [{"metric": "cultural_diversity", "operator": "greater_than", "value": 0.8}]}',
     0.7, 0.1)
ON CONFLICT DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE enhanced_knobs_state IS 'Current state of all enhanced API knobs for each civilization';
COMMENT ON TABLE knob_update_history IS 'Historical record of all knob value changes with reasons';
COMMENT ON TABLE simulation_state_snapshots IS 'Periodic snapshots of complete simulation state for analysis';
COMMENT ON TABLE ai_knob_recommendations IS 'AI-generated recommendations for knob adjustments';
COMMENT ON TABLE system_performance_metrics IS 'Performance metrics for each system to guide optimization';
COMMENT ON TABLE cross_system_effects IS 'Effects between different systems based on knob interactions';
COMMENT ON TABLE knob_automation_rules IS 'Automated rules for adjusting knobs based on conditions';

COMMENT ON COLUMN enhanced_knobs_state.updated_by IS 'Source of the update: ai, player, or system';
COMMENT ON COLUMN knob_update_history.update_reason IS 'Explanation for why the knob value was changed';
COMMENT ON COLUMN simulation_state_snapshots.snapshot_type IS 'Type of snapshot: periodic, event_triggered, or manual';
COMMENT ON COLUMN ai_knob_recommendations.confidence_score IS 'AI confidence in the recommendation (0.0 to 1.0)';
COMMENT ON COLUMN cross_system_effects.effect_magnitude IS 'Magnitude of effect (positive or negative)';
COMMENT ON COLUMN knob_automation_rules.adjustment_speed IS 'Speed of automatic adjustment (0.0 to 1.0)';
