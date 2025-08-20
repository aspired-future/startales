import { Pool } from 'pg';

// Fiscal Policy Simulation Integration Types
export interface FiscalPolicyEffect {
  id: number;
  civilization_id: number;
  policy_type: 'spending' | 'taxation' | 'transfer';
  policy_category: string;
  policy_amount: number;
  effect_type: string;
  base_effect_size: number;
  current_effect_size: number;
  implementation_progress: number;
  time_to_full_effect: number;
  created_at: Date;
  last_updated: Date;
  expires_at?: Date;
}

export interface SimulationStateModifier {
  id: number;
  civilization_id: number;
  modifier_type: 'infrastructure' | 'military' | 'research' | 'social' | 'economic';
  modifier_category: string;
  base_value: number;
  fiscal_modifier: number;
  other_modifiers: number;
  total_value: number;
  last_updated: Date;
}

export interface FiscalMultiplier {
  id: number;
  policy_category: string;
  effect_type: string;
  base_multiplier: number;
  economic_condition_modifier: number;
  time_profile: {
    duration_months: number;
    initial_intensity: number;
    peak_intensity: number;
    peak_time_months: number;
    decay_rate: number;
  };
  diminishing_returns_factor: number;
  crowding_out_threshold?: number;
  created_at: Date;
  updated_at: Date;
}

export interface EconomicBehavioralEffect {
  id: number;
  civilization_id: number;
  tax_type: 'income' | 'corporate' | 'sales' | 'property' | 'capital_gains';
  tax_rate: number;
  behavioral_effect: 'work_incentive' | 'investment_incentive' | 'consumption_pattern' | 'savings_rate';
  effect_magnitude: number;
  laffer_curve_position?: number;
  deadweight_loss: number;
  recorded_at: Date;
}

export interface InflationImpactTracking {
  id: number;
  civilization_id: number;
  inflation_rate: number;
  purchasing_power_index: number;
  competitiveness_index: number;
  real_wage_effect: number;
  investment_effect: number;
  social_stability_effect: number;
  recorded_at: Date;
}

export interface NarrativeGenerationInput {
  id: number;
  civilization_id: number;
  input_type: 'fiscal_achievement' | 'economic_consequence' | 'social_impact' | 'policy_change';
  input_category: string;
  narrative_weight: number;
  narrative_data: {
    title: string;
    description: string;
    impact_magnitude: number;
    affected_systems: string[];
    time_frame: string;
    citizen_reaction: string;
  };
  emotional_valence: number;
  magnitude: number;
  created_at: Date;
  processed_at?: Date;
}

// Initialize Fiscal Policy Simulation Integration Schema
export async function initializeFiscalSimulationSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create fiscal_policy_effects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS fiscal_policy_effects (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        policy_type VARCHAR(50) NOT NULL CHECK (policy_type IN ('spending', 'taxation', 'transfer')),
        policy_category VARCHAR(50) NOT NULL,
        policy_amount DECIMAL(15,2) NOT NULL,
        effect_type VARCHAR(50) NOT NULL,
        base_effect_size DECIMAL(10,6) NOT NULL,
        current_effect_size DECIMAL(10,6) NOT NULL,
        implementation_progress DECIMAL(5,4) DEFAULT 0 CHECK (implementation_progress >= 0 AND implementation_progress <= 1),
        time_to_full_effect INTEGER DEFAULT 12,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP
      )
    `);

    // Create simulation_state_modifiers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS simulation_state_modifiers (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        modifier_type VARCHAR(50) NOT NULL CHECK (modifier_type IN ('infrastructure', 'military', 'research', 'social', 'economic')),
        modifier_category VARCHAR(50) NOT NULL,
        base_value DECIMAL(10,6) DEFAULT 0,
        fiscal_modifier DECIMAL(10,6) DEFAULT 0,
        other_modifiers DECIMAL(10,6) DEFAULT 0,
        total_value DECIMAL(10,6) DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(civilization_id, modifier_type, modifier_category)
      )
    `);

    // Create fiscal_multipliers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS fiscal_multipliers (
        id SERIAL PRIMARY KEY,
        policy_category VARCHAR(50) NOT NULL,
        effect_type VARCHAR(50) NOT NULL,
        base_multiplier DECIMAL(8,6) NOT NULL,
        economic_condition_modifier DECIMAL(6,4) DEFAULT 1.0,
        time_profile JSONB,
        diminishing_returns_factor DECIMAL(6,4) DEFAULT 0.95,
        crowding_out_threshold DECIMAL(15,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(policy_category, effect_type)
      )
    `);

    // Create economic_behavioral_effects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS economic_behavioral_effects (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        tax_type VARCHAR(50) NOT NULL CHECK (tax_type IN ('income', 'corporate', 'sales', 'property', 'capital_gains')),
        tax_rate DECIMAL(8,6) NOT NULL,
        behavioral_effect VARCHAR(50) NOT NULL CHECK (behavioral_effect IN ('work_incentive', 'investment_incentive', 'consumption_pattern', 'savings_rate')),
        effect_magnitude DECIMAL(8,6) NOT NULL,
        laffer_curve_position DECIMAL(5,4) CHECK (laffer_curve_position >= 0 AND laffer_curve_position <= 1),
        deadweight_loss DECIMAL(8,6) DEFAULT 0,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create inflation_impact_tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inflation_impact_tracking (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        inflation_rate DECIMAL(8,6) NOT NULL,
        purchasing_power_index DECIMAL(10,6) NOT NULL,
        competitiveness_index DECIMAL(10,6) NOT NULL,
        real_wage_effect DECIMAL(8,6) NOT NULL,
        investment_effect DECIMAL(8,6) NOT NULL,
        social_stability_effect DECIMAL(8,6) NOT NULL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create narrative_generation_inputs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS narrative_generation_inputs (
        id SERIAL PRIMARY KEY,
        civilization_id INTEGER NOT NULL,
        input_type VARCHAR(50) NOT NULL CHECK (input_type IN ('fiscal_achievement', 'economic_consequence', 'social_impact', 'policy_change')),
        input_category VARCHAR(50) NOT NULL,
        narrative_weight DECIMAL(5,4) DEFAULT 1.0,
        narrative_data JSONB NOT NULL,
        emotional_valence DECIMAL(4,2) DEFAULT 0 CHECK (emotional_valence >= -1 AND emotional_valence <= 1),
        magnitude DECIMAL(8,6) DEFAULT 1.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP
      )
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_fiscal_policy_effects_civ ON fiscal_policy_effects(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_fiscal_policy_effects_type ON fiscal_policy_effects(policy_type, policy_category);
      CREATE INDEX IF NOT EXISTS idx_fiscal_policy_effects_created ON fiscal_policy_effects(created_at);
      
      CREATE INDEX IF NOT EXISTS idx_simulation_state_modifiers_civ ON simulation_state_modifiers(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_simulation_state_modifiers_type ON simulation_state_modifiers(modifier_type, modifier_category);
      
      CREATE INDEX IF NOT EXISTS idx_fiscal_multipliers_category ON fiscal_multipliers(policy_category);
      CREATE INDEX IF NOT EXISTS idx_fiscal_multipliers_effect ON fiscal_multipliers(effect_type);
      
      CREATE INDEX IF NOT EXISTS idx_economic_behavioral_effects_civ ON economic_behavioral_effects(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_economic_behavioral_effects_tax ON economic_behavioral_effects(tax_type);
      CREATE INDEX IF NOT EXISTS idx_economic_behavioral_effects_recorded ON economic_behavioral_effects(recorded_at);
      
      CREATE INDEX IF NOT EXISTS idx_inflation_impact_tracking_civ ON inflation_impact_tracking(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_inflation_impact_tracking_recorded ON inflation_impact_tracking(recorded_at);
      
      CREATE INDEX IF NOT EXISTS idx_narrative_generation_inputs_civ ON narrative_generation_inputs(civilization_id);
      CREATE INDEX IF NOT EXISTS idx_narrative_generation_inputs_type ON narrative_generation_inputs(input_type);
      CREATE INDEX IF NOT EXISTS idx_narrative_generation_inputs_processed ON narrative_generation_inputs(processed_at);
    `);

    // Insert seed data for demonstration
    await insertFiscalSimulationSeedData(client);

    await client.query('COMMIT');
    console.log('✅ Fiscal Policy Simulation Integration schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Fiscal Policy Simulation Integration schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function insertFiscalSimulationSeedData(client: any): Promise<void> {
  // Insert fiscal multipliers for different policy categories
  await client.query(`
    INSERT INTO fiscal_multipliers (policy_category, effect_type, base_multiplier, time_profile, diminishing_returns_factor, crowding_out_threshold) VALUES
    ('infrastructure_transport', 'economic_growth', 1.5, '{"duration_months": 24, "initial_intensity": 0.2, "peak_intensity": 1.0, "peak_time_months": 12, "decay_rate": 0.05}', 0.92, 50000000),
    ('infrastructure_transport', 'trade_efficiency', 2.2, '{"duration_months": 18, "initial_intensity": 0.3, "peak_intensity": 1.0, "peak_time_months": 9, "decay_rate": 0.03}', 0.90, 30000000),
    ('infrastructure_utilities', 'industrial_capacity', 1.8, '{"duration_months": 30, "initial_intensity": 0.1, "peak_intensity": 1.0, "peak_time_months": 18, "decay_rate": 0.02}', 0.88, 40000000),
    ('infrastructure_digital', 'productivity_growth', 2.5, '{"duration_months": 36, "initial_intensity": 0.4, "peak_intensity": 1.0, "peak_time_months": 15, "decay_rate": 0.01}', 0.85, 20000000),
    ('defense_personnel', 'military_readiness', 1.2, '{"duration_months": 12, "initial_intensity": 0.8, "peak_intensity": 1.0, "peak_time_months": 6, "decay_rate": 0.08}', 0.95, 15000000),
    ('defense_equipment', 'military_capability', 1.8, '{"duration_months": 48, "initial_intensity": 0.2, "peak_intensity": 1.0, "peak_time_months": 24, "decay_rate": 0.02}', 0.90, 25000000),
    ('defense_research', 'technological_advancement', 2.0, '{"duration_months": 60, "initial_intensity": 0.1, "peak_intensity": 1.0, "peak_time_months": 30, "decay_rate": 0.01}', 0.80, 10000000),
    ('research_basic', 'knowledge_base', 3.0, '{"duration_months": 72, "initial_intensity": 0.05, "peak_intensity": 1.0, "peak_time_months": 36, "decay_rate": 0.005}', 0.75, 5000000),
    ('research_applied', 'innovation_rate', 2.2, '{"duration_months": 36, "initial_intensity": 0.2, "peak_intensity": 1.0, "peak_time_months": 18, "decay_rate": 0.02}', 0.82, 8000000),
    ('social_education', 'human_capital', 2.8, '{"duration_months": 120, "initial_intensity": 0.1, "peak_intensity": 1.0, "peak_time_months": 60, "decay_rate": 0.001}', 0.70, 12000000),
    ('social_healthcare', 'population_health', 1.6, '{"duration_months": 24, "initial_intensity": 0.3, "peak_intensity": 1.0, "peak_time_months": 12, "decay_rate": 0.03}', 0.88, 18000000),
    ('social_welfare', 'social_stability', 1.3, '{"duration_months": 6, "initial_intensity": 0.9, "peak_intensity": 1.0, "peak_time_months": 2, "decay_rate": 0.15}', 0.92, 20000000)
    ON CONFLICT (policy_category, effect_type) DO NOTHING
  `);

  // Insert sample simulation state modifiers for each civilization
  await client.query(`
    INSERT INTO simulation_state_modifiers (civilization_id, modifier_type, modifier_category, base_value, fiscal_modifier, other_modifiers, total_value) 
    SELECT 
      civ_id,
      modifier_type,
      modifier_category,
      base_value,
      0 as fiscal_modifier,
      RANDOM() * 0.2 - 0.1 as other_modifiers,
      base_value + (RANDOM() * 0.2 - 0.1) as total_value
    FROM (VALUES (1), (2), (3), (4), (5)) AS civs(civ_id)
    CROSS JOIN (VALUES 
      ('infrastructure', 'transport_quality', 0.5),
      ('infrastructure', 'utilities_reliability', 0.6),
      ('infrastructure', 'digital_connectivity', 0.4),
      ('military', 'readiness_level', 0.7),
      ('military', 'equipment_quality', 0.6),
      ('military', 'technological_edge', 0.5),
      ('research', 'innovation_capacity', 0.4),
      ('research', 'knowledge_accumulation', 0.3),
      ('research', 'technology_transfer', 0.5),
      ('social', 'education_quality', 0.6),
      ('social', 'healthcare_access', 0.7),
      ('social', 'social_cohesion', 0.8),
      ('economic', 'productivity_index', 0.5),
      ('economic', 'competitiveness', 0.6),
      ('economic', 'growth_potential', 0.4)
    ) AS modifiers(modifier_type, modifier_category, base_value)
    ON CONFLICT (civilization_id, modifier_type, modifier_category) DO NOTHING
  `);

  // Insert sample fiscal policy effects
  await client.query(`
    INSERT INTO fiscal_policy_effects (civilization_id, policy_type, policy_category, policy_amount, effect_type, base_effect_size, current_effect_size, implementation_progress, time_to_full_effect) 
    VALUES 
    (1, 'spending', 'infrastructure_transport', 25000000, 'economic_growth', 0.15, 0.08, 0.6, 18),
    (1, 'spending', 'defense_equipment', 18000000, 'military_capability', 0.12, 0.10, 0.8, 12),
    (1, 'spending', 'research_basic', 8000000, 'knowledge_base', 0.20, 0.05, 0.3, 36),
    (2, 'spending', 'social_education', 15000000, 'human_capital', 0.18, 0.12, 0.7, 24),
    (2, 'spending', 'infrastructure_digital', 12000000, 'productivity_growth', 0.22, 0.15, 0.8, 15),
    (3, 'spending', 'defense_research', 10000000, 'technological_advancement', 0.16, 0.08, 0.5, 30),
    (3, 'spending', 'social_healthcare', 20000000, 'population_health', 0.14, 0.11, 0.8, 18),
    (4, 'spending', 'infrastructure_utilities', 30000000, 'industrial_capacity', 0.19, 0.14, 0.7, 24),
    (5, 'spending', 'research_applied', 12000000, 'innovation_rate', 0.17, 0.13, 0.8, 20)
  `);

  // Insert sample economic behavioral effects
  await client.query(`
    INSERT INTO economic_behavioral_effects (civilization_id, tax_type, tax_rate, behavioral_effect, effect_magnitude, laffer_curve_position, deadweight_loss) 
    VALUES 
    (1, 'income', 0.25, 'work_incentive', -0.08, 0.45, 0.02),
    (1, 'corporate', 0.20, 'investment_incentive', -0.12, 0.40, 0.03),
    (2, 'income', 0.35, 'work_incentive', -0.15, 0.65, 0.05),
    (2, 'sales', 0.08, 'consumption_pattern', -0.05, 0.25, 0.01),
    (3, 'corporate', 0.15, 'investment_incentive', -0.06, 0.30, 0.01),
    (3, 'capital_gains', 0.12, 'investment_incentive', -0.04, 0.28, 0.008),
    (4, 'income', 0.30, 'work_incentive', -0.11, 0.55, 0.04),
    (4, 'property', 0.02, 'savings_rate', -0.03, 0.20, 0.005),
    (5, 'corporate', 0.25, 'investment_incentive', -0.14, 0.50, 0.04)
  `);

  // Insert sample inflation impact tracking
  await client.query(`
    INSERT INTO inflation_impact_tracking (civilization_id, inflation_rate, purchasing_power_index, competitiveness_index, real_wage_effect, investment_effect, social_stability_effect) 
    VALUES 
    (1, 0.025, 0.975, 1.02, -0.01, 0.005, -0.02),
    (2, 0.018, 0.982, 1.015, -0.005, 0.008, -0.01),
    (3, 0.032, 0.968, 0.98, -0.015, -0.002, -0.03),
    (4, 0.021, 0.979, 1.018, -0.008, 0.006, -0.015),
    (5, 0.028, 0.972, 0.985, -0.012, 0.001, -0.025)
  `);

  // Insert sample narrative generation inputs
  await client.query(`
    INSERT INTO narrative_generation_inputs (civilization_id, input_type, input_category, narrative_weight, narrative_data, emotional_valence, magnitude) 
    VALUES 
    (1, 'fiscal_achievement', 'infrastructure_completion', 1.2, 
     '{"title": "Major Highway Project Completed", "description": "The new interplanetary highway system has reduced transport costs by 15% and improved trade efficiency", "impact_magnitude": 0.15, "affected_systems": ["trade", "economic_growth"], "time_frame": "immediate", "citizen_reaction": "positive"}', 
     0.7, 1.5),
    (2, 'economic_consequence', 'tax_policy_impact', 0.9, 
     '{"title": "Income Tax Increase Effects", "description": "Higher income taxes have reduced work incentives but increased government revenue for social programs", "impact_magnitude": 0.12, "affected_systems": ["labor_market", "social_services"], "time_frame": "medium_term", "citizen_reaction": "mixed"}', 
     -0.2, 1.1),
    (3, 'social_impact', 'healthcare_improvement', 1.1, 
     '{"title": "Healthcare System Expansion", "description": "Increased healthcare spending has improved population health metrics and reduced medical costs", "impact_magnitude": 0.18, "affected_systems": ["population_health", "productivity"], "time_frame": "long_term", "citizen_reaction": "very_positive"}', 
     0.8, 1.3)
  `);

  console.log('✅ Fiscal Policy Simulation Integration seed data inserted successfully');
}
