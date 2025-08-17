import { Pool } from 'pg';

export interface HouseholdTier {
  id: string;
  campaign_id: number;
  tier_name: HouseholdTierType;
  household_count: number;
  population_percentage: number;
  average_income: number;
  consumption_power: number;
  luxury_demand_multiplier: number;
  basic_goods_demand_multiplier: number;
  savings_rate: number;
  investment_capacity: number;
  education_access: number; // 0-100 scale
  business_opportunity_access: number; // 0-100 scale
  social_mobility_rate: number;
  created_at: Date;
  updated_at: Date;
}

export interface HouseholdConsumption {
  id: string;
  campaign_id: number;
  tier_name: HouseholdTierType;
  resource_type: string;
  resource_name: string;
  base_demand: number;
  seasonal_multiplier: number;
  cultural_influence_multiplier: number;
  price_elasticity: number; // How demand changes with price (-2.0 to 0.5)
  luxury_factor: number; // 0-1, higher = more luxury
  necessity_factor: number; // 0-1, higher = more necessary
  created_at: Date;
  updated_at: Date;
}

export interface SocialMobilityEvent {
  id: string;
  campaign_id: number;
  campaign_step: number;
  household_id: string;
  event_type: SocialMobilityEventType;
  from_tier: HouseholdTierType;
  to_tier: HouseholdTierType;
  trigger_reason: string;
  success_probability: number;
  resource_cost: SocialMobilityResourceCost;
  outcome: 'success' | 'failure' | 'pending';
  created_at: Date;
}

export interface HouseholdDemandProjection {
  campaign_id: number;
  campaign_step: number;
  tier_name: HouseholdTierType;
  resource_type: string;
  projected_demand: number;
  current_price: number;
  demand_elasticity_impact: number;
  cultural_influence_impact: number;
  seasonal_impact: number;
  total_adjusted_demand: number;
  created_at: Date;
}

export interface SocialMobilityResourceCost {
  [resource: string]: number;
}

export enum HouseholdTierType {
  POOR = 'poor',
  MEDIAN = 'median', 
  RICH = 'rich'
}

export enum SocialMobilityEventType {
  EDUCATION_INVESTMENT = 'education_investment',
  BUSINESS_START = 'business_start',
  BUSINESS_SUCCESS = 'business_success',
  BUSINESS_FAILURE = 'business_failure',
  INHERITANCE = 'inheritance',
  MARRIAGE = 'marriage',
  ECONOMIC_POLICY_IMPACT = 'economic_policy_impact',
  CULTURAL_SHIFT = 'cultural_shift',
  NATURAL_PROGRESSION = 'natural_progression'
}

export class HouseholdSchema {
  constructor(private pool: Pool) {}

  async initializeTables(): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Household Tiers main table
      await client.query(`
        CREATE TABLE IF NOT EXISTS household_tiers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          campaign_id INTEGER NOT NULL,
          tier_name VARCHAR(20) NOT NULL,
          household_count INTEGER NOT NULL DEFAULT 0,
          population_percentage DECIMAL(5,2) NOT NULL,
          average_income DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          consumption_power DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          luxury_demand_multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.00,
          basic_goods_demand_multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.00,
          savings_rate DECIMAL(5,2) NOT NULL DEFAULT 0.10,
          investment_capacity DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          education_access INTEGER NOT NULL DEFAULT 50,
          business_opportunity_access INTEGER NOT NULL DEFAULT 50,
          social_mobility_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0100,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          
          UNIQUE(campaign_id, tier_name),
          CONSTRAINT valid_tier_name 
            CHECK (tier_name IN ('poor', 'median', 'rich')),
          CONSTRAINT valid_population_percentage 
            CHECK (population_percentage >= 0 AND population_percentage <= 100),
          CONSTRAINT valid_education_access 
            CHECK (education_access >= 0 AND education_access <= 100),
          CONSTRAINT valid_business_access 
            CHECK (business_opportunity_access >= 0 AND business_opportunity_access <= 100)
        );
      `);

      // Household Consumption patterns
      await client.query(`
        CREATE TABLE IF NOT EXISTS household_consumption (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          campaign_id INTEGER NOT NULL,
          tier_name VARCHAR(20) NOT NULL,
          resource_type VARCHAR(50) NOT NULL,
          resource_name VARCHAR(100) NOT NULL,
          base_demand DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          seasonal_multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.00,
          cultural_influence_multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.00,
          price_elasticity DECIMAL(5,2) NOT NULL DEFAULT -1.00,
          luxury_factor DECIMAL(3,2) NOT NULL DEFAULT 0.00,
          necessity_factor DECIMAL(3,2) NOT NULL DEFAULT 0.50,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          
          UNIQUE(campaign_id, tier_name, resource_type),
          CONSTRAINT valid_tier_name_consumption 
            CHECK (tier_name IN ('poor', 'median', 'rich')),
          CONSTRAINT valid_price_elasticity 
            CHECK (price_elasticity >= -5.0 AND price_elasticity <= 1.0),
          CONSTRAINT valid_luxury_factor 
            CHECK (luxury_factor >= 0.0 AND luxury_factor <= 1.0),
          CONSTRAINT valid_necessity_factor 
            CHECK (necessity_factor >= 0.0 AND necessity_factor <= 1.0)
        );
      `);

      // Social Mobility Events tracking
      await client.query(`
        CREATE TABLE IF NOT EXISTS social_mobility_events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          campaign_id INTEGER NOT NULL,
          campaign_step INTEGER NOT NULL,
          household_id UUID NOT NULL,
          event_type VARCHAR(50) NOT NULL,
          from_tier VARCHAR(20) NOT NULL,
          to_tier VARCHAR(20) NOT NULL,
          trigger_reason TEXT NOT NULL,
          success_probability DECIMAL(5,2) NOT NULL DEFAULT 0.50,
          resource_cost JSONB NOT NULL DEFAULT '{}',
          outcome VARCHAR(20) NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          
          CONSTRAINT valid_from_tier 
            CHECK (from_tier IN ('poor', 'median', 'rich')),
          CONSTRAINT valid_to_tier 
            CHECK (to_tier IN ('poor', 'median', 'rich')),
          CONSTRAINT valid_event_type 
            CHECK (event_type IN ('education_investment', 'business_start', 'business_success', 
                                 'business_failure', 'inheritance', 'marriage', 
                                 'economic_policy_impact', 'cultural_shift', 'natural_progression')),
          CONSTRAINT valid_outcome 
            CHECK (outcome IN ('success', 'failure', 'pending')),
          CONSTRAINT valid_success_probability 
            CHECK (success_probability >= 0.0 AND success_probability <= 1.0)
        );
      `);

      // Household Demand Projections (for trade integration)
      await client.query(`
        CREATE TABLE IF NOT EXISTS household_demand_projections (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          campaign_id INTEGER NOT NULL,
          campaign_step INTEGER NOT NULL,
          tier_name VARCHAR(20) NOT NULL,
          resource_type VARCHAR(50) NOT NULL,
          projected_demand DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          current_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
          demand_elasticity_impact DECIMAL(5,2) NOT NULL DEFAULT 1.00,
          cultural_influence_impact DECIMAL(5,2) NOT NULL DEFAULT 1.00,
          seasonal_impact DECIMAL(5,2) NOT NULL DEFAULT 1.00,
          total_adjusted_demand DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          
          UNIQUE(campaign_id, campaign_step, tier_name, resource_type),
          CONSTRAINT valid_tier_name_projections 
            CHECK (tier_name IN ('poor', 'median', 'rich'))
        );
      `);

      // Indexes for performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_household_tiers_campaign 
          ON household_tiers(campaign_id);
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_household_consumption_campaign_tier 
          ON household_consumption(campaign_id, tier_name);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_social_mobility_campaign_step 
          ON social_mobility_events(campaign_id, campaign_step);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_demand_projections_campaign_step 
          ON household_demand_projections(campaign_id, campaign_step);
      `);

      // Update triggers
      await client.query(`
        CREATE OR REPLACE FUNCTION update_household_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS trigger_update_household_tiers_updated_at ON household_tiers;
        CREATE TRIGGER trigger_update_household_tiers_updated_at
          BEFORE UPDATE ON household_tiers
          FOR EACH ROW
          EXECUTE FUNCTION update_household_updated_at();

        DROP TRIGGER IF EXISTS trigger_update_household_consumption_updated_at ON household_consumption;
        CREATE TRIGGER trigger_update_household_consumption_updated_at
          BEFORE UPDATE ON household_consumption
          FOR EACH ROW
          EXECUTE FUNCTION update_household_updated_at();
      `);

      await client.query('COMMIT');
      console.log('✅ Household Economic system database schema initialized');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Failed to initialize Household Economic schema:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async seedHouseholdEconomicSystem(): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Default household tier configurations for any campaign
      const defaultTierConfigs = [
        {
          tier_name: 'poor',
          population_percentage: 40.0,
          average_income: 25000,
          consumption_power: 20000,
          luxury_demand_multiplier: 0.2,
          basic_goods_demand_multiplier: 2.5,
          savings_rate: 0.02,
          investment_capacity: 500,
          education_access: 30,
          business_opportunity_access: 15,
          social_mobility_rate: 0.005
        },
        {
          tier_name: 'median',
          population_percentage: 50.0,
          average_income: 75000,
          consumption_power: 65000,
          luxury_demand_multiplier: 1.0,
          basic_goods_demand_multiplier: 1.5,
          savings_rate: 0.15,
          investment_capacity: 10000,
          education_access: 70,
          business_opportunity_access: 50,
          social_mobility_rate: 0.015
        },
        {
          tier_name: 'rich',
          population_percentage: 10.0,
          average_income: 300000,
          consumption_power: 200000,
          luxury_demand_multiplier: 5.0,
          basic_goods_demand_multiplier: 0.8,
          savings_rate: 0.30,
          investment_capacity: 100000,
          education_access: 95,
          business_opportunity_access: 85,
          social_mobility_rate: 0.002
        }
      ];

      // Default consumption patterns by tier and resource type
      const defaultConsumptionPatterns = [
        // Poor tier - Focus on necessities
        { tier: 'poor', resource_type: 'food', base_demand: 1000, price_elasticity: -0.3, luxury_factor: 0.0, necessity_factor: 1.0 },
        { tier: 'poor', resource_type: 'water', base_demand: 800, price_elasticity: -0.2, luxury_factor: 0.0, necessity_factor: 1.0 },
        { tier: 'poor', resource_type: 'energy', base_demand: 300, price_elasticity: -0.8, luxury_factor: 0.1, necessity_factor: 0.9 },
        { tier: 'poor', resource_type: 'housing', base_demand: 150, price_elasticity: -1.2, luxury_factor: 0.0, necessity_factor: 1.0 },
        { tier: 'poor', resource_type: 'clothing', base_demand: 200, price_elasticity: -1.0, luxury_factor: 0.2, necessity_factor: 0.8 },
        { tier: 'poor', resource_type: 'healthcare', base_demand: 100, price_elasticity: -1.5, luxury_factor: 0.1, necessity_factor: 0.9 },
        { tier: 'poor', resource_type: 'education', base_demand: 50, price_elasticity: -2.0, luxury_factor: 0.3, necessity_factor: 0.7 },
        { tier: 'poor', resource_type: 'entertainment', base_demand: 25, price_elasticity: -2.5, luxury_factor: 0.8, necessity_factor: 0.2 },
        { tier: 'poor', resource_type: 'luxury_goods', base_demand: 5, price_elasticity: -3.0, luxury_factor: 1.0, necessity_factor: 0.0 },

        // Median tier - Balanced consumption
        { tier: 'median', resource_type: 'food', base_demand: 1200, price_elasticity: -0.5, luxury_factor: 0.1, necessity_factor: 0.9 },
        { tier: 'median', resource_type: 'water', base_demand: 900, price_elasticity: -0.3, luxury_factor: 0.0, necessity_factor: 1.0 },
        { tier: 'median', resource_type: 'energy', base_demand: 600, price_elasticity: -1.0, luxury_factor: 0.2, necessity_factor: 0.8 },
        { tier: 'median', resource_type: 'housing', base_demand: 400, price_elasticity: -1.0, luxury_factor: 0.3, necessity_factor: 0.7 },
        { tier: 'median', resource_type: 'clothing', base_demand: 500, price_elasticity: -1.2, luxury_factor: 0.4, necessity_factor: 0.6 },
        { tier: 'median', resource_type: 'healthcare', base_demand: 300, price_elasticity: -1.0, luxury_factor: 0.2, necessity_factor: 0.8 },
        { tier: 'median', resource_type: 'education', base_demand: 200, price_elasticity: -1.5, luxury_factor: 0.5, necessity_factor: 0.5 },
        { tier: 'median', resource_type: 'entertainment', base_demand: 150, price_elasticity: -1.8, luxury_factor: 0.7, necessity_factor: 0.3 },
        { tier: 'median', resource_type: 'luxury_goods', base_demand: 75, price_elasticity: -2.2, luxury_factor: 0.9, necessity_factor: 0.1 },

        // Rich tier - High consumption, especially luxury
        { tier: 'rich', resource_type: 'food', base_demand: 1500, price_elasticity: -0.1, luxury_factor: 0.3, necessity_factor: 0.7 },
        { tier: 'rich', resource_type: 'water', base_demand: 1000, price_elasticity: -0.1, luxury_factor: 0.0, necessity_factor: 1.0 },
        { tier: 'rich', resource_type: 'energy', base_demand: 1200, price_elasticity: -0.3, luxury_factor: 0.4, necessity_factor: 0.6 },
        { tier: 'rich', resource_type: 'housing', base_demand: 1000, price_elasticity: -0.5, luxury_factor: 0.7, necessity_factor: 0.3 },
        { tier: 'rich', resource_type: 'clothing', base_demand: 1200, price_elasticity: -0.8, luxury_factor: 0.8, necessity_factor: 0.2 },
        { tier: 'rich', resource_type: 'healthcare', base_demand: 800, price_elasticity: -0.4, luxury_factor: 0.5, necessity_factor: 0.5 },
        { tier: 'rich', resource_type: 'education', base_demand: 600, price_elasticity: -0.6, luxury_factor: 0.6, necessity_factor: 0.4 },
        { tier: 'rich', resource_type: 'entertainment', base_demand: 800, price_elasticity: -1.0, luxury_factor: 0.8, necessity_factor: 0.2 },
        { tier: 'rich', resource_type: 'luxury_goods', base_demand: 2000, price_elasticity: -1.2, luxury_factor: 1.0, necessity_factor: 0.0 },
      ];

      console.log('✅ Household Economic system seeded successfully');
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Failed to seed household economic system:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
