import { Pool } from 'pg';
import { 
  HouseholdTier, 
  HouseholdConsumption, 
  SocialMobilityEvent, 
  HouseholdDemandProjection,
  HouseholdTierType, 
  SocialMobilityEventType,
  SocialMobilityResourceCost
} from '../storage/householdSchema.js';

export interface HouseholdEconomicStatus {
  campaign_id: number;
  total_population: number;
  tier_distribution: {
    poor: { count: number; percentage: number; total_income: number };
    median: { count: number; percentage: number; total_income: number };
    rich: { count: number; percentage: number; total_income: number };
  };
  gini_coefficient: number; // Measure of income inequality
  social_mobility_rate: number;
  economic_health_score: number;
}

export interface DemandCalculation {
  tier: HouseholdTierType;
  resource_type: string;
  base_demand: number;
  price_adjusted_demand: number;
  cultural_adjusted_demand: number;
  seasonal_adjusted_demand: number;
  final_demand: number;
  elasticity_impact: number;
}

export interface SocialMobilityOpportunity {
  event_type: SocialMobilityEventType;
  from_tier: HouseholdTierType;
  to_tier: HouseholdTierType;
  success_probability: number;
  resource_cost: SocialMobilityResourceCost;
  expected_income_change: number;
  required_conditions: string[];
}

export interface TierConsumptionProfile {
  tier: HouseholdTierType;
  population_size: number;
  consumption_patterns: {
    necessities: { [resource: string]: number };
    comfort_goods: { [resource: string]: number };
    luxury_goods: { [resource: string]: number };
  };
  price_sensitivity: {
    necessities: number; // Low elasticity
    comfort_goods: number; // Medium elasticity
    luxury_goods: number; // High elasticity
  };
}

export class HouseholdService {
  constructor(private pool: Pool) {}

  // Initialize household economic system for a campaign
  async initializeCampaignHouseholds(campaignId: number, totalPopulation: number = 100000): Promise<HouseholdEconomicStatus> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Create household tiers for the campaign
      const tierConfigs = [
        { tier: 'poor', percentage: 40, avgIncome: 25000 },
        { tier: 'median', percentage: 50, avgIncome: 75000 },
        { tier: 'rich', percentage: 10, avgIncome: 300000 }
      ];

      for (const config of tierConfigs) {
        const householdCount = Math.floor((totalPopulation * config.percentage) / 100 / 3.5); // Avg 3.5 people per household
        
        await client.query(`
          INSERT INTO household_tiers (
            campaign_id, tier_name, household_count, population_percentage,
            average_income, consumption_power, luxury_demand_multiplier,
            basic_goods_demand_multiplier, savings_rate, investment_capacity,
            education_access, business_opportunity_access, social_mobility_rate
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (campaign_id, tier_name) DO UPDATE SET
            household_count = EXCLUDED.household_count,
            population_percentage = EXCLUDED.population_percentage,
            average_income = EXCLUDED.average_income,
            consumption_power = EXCLUDED.consumption_power
        `, [
          campaignId,
          config.tier,
          householdCount,
          config.percentage,
          config.avgIncome,
          config.avgIncome * 0.8, // 80% of income goes to consumption
          config.tier === 'rich' ? 5.0 : config.tier === 'median' ? 1.0 : 0.2,
          config.tier === 'poor' ? 2.5 : config.tier === 'median' ? 1.5 : 0.8,
          config.tier === 'rich' ? 0.30 : config.tier === 'median' ? 0.15 : 0.02,
          config.avgIncome * (config.tier === 'rich' ? 0.33 : config.tier === 'median' ? 0.13 : 0.02),
          config.tier === 'rich' ? 95 : config.tier === 'median' ? 70 : 30,
          config.tier === 'rich' ? 85 : config.tier === 'median' ? 50 : 15,
          config.tier === 'poor' ? 0.005 : config.tier === 'median' ? 0.015 : 0.002
        ]);
      }

      // Initialize consumption patterns for each tier and resource type
      const resourceTypes = ['food', 'water', 'energy', 'housing', 'clothing', 'healthcare', 'education', 'entertainment', 'luxury_goods'];
      
      const consumptionPatterns = {
        poor: [
          { type: 'food', demand: 1000, elasticity: -0.3, luxury: 0.0, necessity: 1.0 },
          { type: 'water', demand: 800, elasticity: -0.2, luxury: 0.0, necessity: 1.0 },
          { type: 'energy', demand: 300, elasticity: -0.8, luxury: 0.1, necessity: 0.9 },
          { type: 'housing', demand: 150, elasticity: -1.2, luxury: 0.0, necessity: 1.0 },
          { type: 'clothing', demand: 200, elasticity: -1.0, luxury: 0.2, necessity: 0.8 },
          { type: 'healthcare', demand: 100, elasticity: -1.5, luxury: 0.1, necessity: 0.9 },
          { type: 'education', demand: 50, elasticity: -2.0, luxury: 0.3, necessity: 0.7 },
          { type: 'entertainment', demand: 25, elasticity: -2.5, luxury: 0.8, necessity: 0.2 },
          { type: 'luxury_goods', demand: 5, elasticity: -3.0, luxury: 1.0, necessity: 0.0 }
        ],
        median: [
          { type: 'food', demand: 1200, elasticity: -0.5, luxury: 0.1, necessity: 0.9 },
          { type: 'water', demand: 900, elasticity: -0.3, luxury: 0.0, necessity: 1.0 },
          { type: 'energy', demand: 600, elasticity: -1.0, luxury: 0.2, necessity: 0.8 },
          { type: 'housing', demand: 400, elasticity: -1.0, luxury: 0.3, necessity: 0.7 },
          { type: 'clothing', demand: 500, elasticity: -1.2, luxury: 0.4, necessity: 0.6 },
          { type: 'healthcare', demand: 300, elasticity: -1.0, luxury: 0.2, necessity: 0.8 },
          { type: 'education', demand: 200, elasticity: -1.5, luxury: 0.5, necessity: 0.5 },
          { type: 'entertainment', demand: 150, elasticity: -1.8, luxury: 0.7, necessity: 0.3 },
          { type: 'luxury_goods', demand: 75, elasticity: -2.2, luxury: 0.9, necessity: 0.1 }
        ],
        rich: [
          { type: 'food', demand: 1500, elasticity: -0.1, luxury: 0.3, necessity: 0.7 },
          { type: 'water', demand: 1000, elasticity: -0.1, luxury: 0.0, necessity: 1.0 },
          { type: 'energy', demand: 1200, elasticity: -0.3, luxury: 0.4, necessity: 0.6 },
          { type: 'housing', demand: 1000, elasticity: -0.5, luxury: 0.7, necessity: 0.3 },
          { type: 'clothing', demand: 1200, elasticity: -0.8, luxury: 0.8, necessity: 0.2 },
          { type: 'healthcare', demand: 800, elasticity: -0.4, luxury: 0.5, necessity: 0.5 },
          { type: 'education', demand: 600, elasticity: -0.6, luxury: 0.6, necessity: 0.4 },
          { type: 'entertainment', demand: 800, elasticity: -1.0, luxury: 0.8, necessity: 0.2 },
          { type: 'luxury_goods', demand: 2000, elasticity: -1.2, luxury: 1.0, necessity: 0.0 }
        ]
      };

      for (const [tier, patterns] of Object.entries(consumptionPatterns)) {
        for (const pattern of patterns) {
          await client.query(`
            INSERT INTO household_consumption (
              campaign_id, tier_name, resource_type, resource_name,
              base_demand, price_elasticity, luxury_factor, necessity_factor
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (campaign_id, tier_name, resource_type) DO UPDATE SET
              base_demand = EXCLUDED.base_demand,
              price_elasticity = EXCLUDED.price_elasticity,
              luxury_factor = EXCLUDED.luxury_factor,
              necessity_factor = EXCLUDED.necessity_factor
          `, [
            campaignId, tier, pattern.type, pattern.type.replace('_', ' '),
            pattern.demand, pattern.elasticity, pattern.luxury, pattern.necessity
          ]);
        }
      }

      await client.query('COMMIT');
      console.log(`✅ Initialized household economic system for campaign ${campaignId}`);
      
      return await this.getHouseholdEconomicStatus(campaignId);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Failed to initialize campaign households:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Get comprehensive economic status for a campaign
  async getHouseholdEconomicStatus(campaignId: number): Promise<HouseholdEconomicStatus> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT 
          tier_name,
          household_count,
          population_percentage,
          average_income,
          consumption_power,
          social_mobility_rate
        FROM household_tiers
        WHERE campaign_id = $1
        ORDER BY average_income ASC
      `, [campaignId]);

      if (result.rows.length === 0) {
        throw new Error(`No household data found for campaign ${campaignId}`);
      }

      const tiers = result.rows;
      const totalPopulation = tiers.reduce((sum, tier) => sum + Number(tier.household_count) * 3.5, 0);
      
      // Calculate Gini coefficient (measure of inequality)
      const giniCoeff = this.calculateGiniCoefficient(tiers);
      
      // Calculate overall social mobility
      const avgMobilityRate = tiers.reduce((sum, tier) => sum + Number(tier.social_mobility_rate), 0) / tiers.length;
      
      // Calculate economic health score
      const economicHealthScore = this.calculateEconomicHealthScore(tiers, giniCoeff);

      const tierDistribution: any = {};
      
      for (const tier of tiers) {
        tierDistribution[tier.tier_name] = {
          count: Number(tier.household_count),
          percentage: Number(tier.population_percentage),
          total_income: Number(tier.household_count) * Number(tier.average_income)
        };
      }

      return {
        campaign_id: campaignId,
        total_population: Math.floor(totalPopulation),
        tier_distribution: tierDistribution,
        gini_coefficient: Number(giniCoeff.toFixed(3)),
        social_mobility_rate: Number(avgMobilityRate.toFixed(4)),
        economic_health_score: Number(economicHealthScore.toFixed(1))
      };
    } finally {
      client.release();
    }
  }

  // Calculate demand for resources based on household tiers and current market conditions
  async calculateTierDemand(
    campaignId: number, 
    resourceType: string, 
    currentPrice: number,
    culturalMultiplier: number = 1.0,
    seasonalMultiplier: number = 1.0
  ): Promise<DemandCalculation[]> {
    const client = await this.pool.connect();
    
    try {
      // Get consumption patterns for all tiers
      const result = await client.query(`
        SELECT 
          hc.tier_name,
          hc.base_demand,
          hc.price_elasticity,
          hc.luxury_factor,
          hc.necessity_factor,
          ht.household_count,
          ht.consumption_power
        FROM household_consumption hc
        JOIN household_tiers ht ON hc.campaign_id = ht.campaign_id AND hc.tier_name = ht.tier_name
        WHERE hc.campaign_id = $1 AND hc.resource_type = $2
      `, [campaignId, resourceType]);

      const calculations: DemandCalculation[] = [];

      for (const row of result.rows) {
        const baseDemand = Number(row.base_demand) * Number(row.household_count);
        const priceElasticity = Number(row.price_elasticity);
        
        // Price elasticity calculation: Q = Q0 * (P/P0)^e
        // Assuming base price of 100 for calculation
        const basePrice = 100;
        const priceRatio = currentPrice / basePrice;
        const elasticityImpact = Math.pow(priceRatio, priceElasticity);
        
        const priceAdjustedDemand = baseDemand * elasticityImpact;
        const culturalAdjustedDemand = priceAdjustedDemand * culturalMultiplier;
        const finalDemand = culturalAdjustedDemand * seasonalMultiplier;

        calculations.push({
          tier: row.tier_name as HouseholdTierType,
          resource_type: resourceType,
          base_demand: baseDemand,
          price_adjusted_demand: Math.max(0, priceAdjustedDemand),
          cultural_adjusted_demand: Math.max(0, culturalAdjustedDemand),
          seasonal_adjusted_demand: Math.max(0, finalDemand),
          final_demand: Math.max(0, finalDemand),
          elasticity_impact: elasticityImpact
        });
      }

      return calculations;
    } finally {
      client.release();
    }
  }

  // Create social mobility opportunity for a household
  async createSocialMobilityOpportunity(
    campaignId: number,
    campaignStep: number,
    householdId: string,
    eventType: SocialMobilityEventType,
    fromTier: HouseholdTierType,
    toTier: HouseholdTierType,
    resourceCost: SocialMobilityResourceCost = {}
  ): Promise<SocialMobilityEvent> {
    const client = await this.pool.connect();
    
    try {
      // Calculate success probability based on tier transition and event type
      const successProbability = this.calculateMobilitySuccessProbability(eventType, fromTier, toTier);
      
      const triggerReason = this.getMobilityEventDescription(eventType, fromTier, toTier);

      const result = await client.query(`
        INSERT INTO social_mobility_events (
          campaign_id, campaign_step, household_id, event_type,
          from_tier, to_tier, trigger_reason, success_probability, resource_cost
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        campaignId, campaignStep, householdId, eventType,
        fromTier, toTier, triggerReason, successProbability,
        JSON.stringify(resourceCost)
      ]);

      return this.mapSocialMobilityEventFromDB(result.rows[0]);
    } finally {
      client.release();
    }
  }

  // Process social mobility event (success/failure)
  async processSocialMobilityEvent(eventId: string, resourcesProvided: SocialMobilityResourceCost): Promise<{ success: boolean; outcome: SocialMobilityEvent }> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get the event
      const eventResult = await client.query(`
        SELECT * FROM social_mobility_events WHERE id = $1 AND outcome = 'pending'
      `, [eventId]);

      if (eventResult.rows.length === 0) {
        throw new Error(`Social mobility event not found or already processed: ${eventId}`);
      }

      const event = this.mapSocialMobilityEventFromDB(eventResult.rows[0]);
      
      // Check if provided resources meet requirements
      const resourceRequirementsMet = this.checkResourceRequirements(event.resource_cost, resourcesProvided);
      
      if (!resourceRequirementsMet) {
        // Mark as failure due to insufficient resources
        await client.query(`
          UPDATE social_mobility_events SET outcome = 'failure' WHERE id = $1
        `, [eventId]);

        await client.query('COMMIT');
        return { success: false, outcome: { ...event, outcome: 'failure' } };
      }

      // Determine success based on probability
      const randomRoll = Math.random();
      const success = randomRoll <= event.success_probability;

      const outcome = success ? 'success' : 'failure';
      
      // Update the event
      await client.query(`
        UPDATE social_mobility_events SET outcome = $1 WHERE id = $2
      `, [outcome, eventId]);

      // If successful, update household tier statistics
      if (success) {
        await this.updateHouseholdTierCounts(event.campaign_id, event.from_tier, event.to_tier);
      }

      await client.query('COMMIT');
      console.log(`✅ Processed social mobility event ${eventId}: ${outcome}`);
      
      return { success, outcome: { ...event, outcome } };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Failed to process social mobility event:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Get available social mobility opportunities for a tier
  async getAvailableMobilityOpportunities(campaignId: number, fromTier: HouseholdTierType): Promise<SocialMobilityOpportunity[]> {
    const opportunities: SocialMobilityOpportunity[] = [];

    // Education investment (can move up one tier)
    if (fromTier !== HouseholdTierType.RICH) {
      const targetTier = fromTier === HouseholdTierType.POOR ? HouseholdTierType.MEDIAN : HouseholdTierType.RICH;
      opportunities.push({
        event_type: SocialMobilityEventType.EDUCATION_INVESTMENT,
        from_tier: fromTier,
        to_tier: targetTier,
        success_probability: fromTier === HouseholdTierType.POOR ? 0.15 : 0.25,
        resource_cost: { education: fromTier === HouseholdTierType.POOR ? 5000 : 15000, gold: fromTier === HouseholdTierType.POOR ? 2000 : 8000 },
        expected_income_change: fromTier === HouseholdTierType.POOR ? 50000 : 225000,
        required_conditions: ['Available education resources', 'Campaign duration > 5 steps']
      });
    }

    // Business opportunities
    if (fromTier !== HouseholdTierType.RICH) {
      const targetTier = fromTier === HouseholdTierType.POOR ? HouseholdTierType.MEDIAN : HouseholdTierType.RICH;
      opportunities.push({
        event_type: SocialMobilityEventType.BUSINESS_START,
        from_tier: fromTier,
        to_tier: targetTier,
        success_probability: fromTier === HouseholdTierType.POOR ? 0.08 : 0.18,
        resource_cost: { gold: fromTier === HouseholdTierType.POOR ? 10000 : 50000, energy: fromTier === HouseholdTierType.POOR ? 500 : 2000 },
        expected_income_change: fromTier === HouseholdTierType.POOR ? 50000 : 225000,
        required_conditions: ['Stable economic environment', 'Business opportunity access > 20']
      });
    }

    return opportunities;
  }

  // Private helper methods
  
  private calculateGiniCoefficient(tiers: any[]): number {
    // Simplified Gini calculation based on tier distribution
    const totalIncome = tiers.reduce((sum, tier) => sum + (Number(tier.household_count) * Number(tier.average_income)), 0);
    const poorIncome = tiers.find(t => t.tier_name === 'poor');
    const medianIncome = tiers.find(t => t.tier_name === 'median');
    const richIncome = tiers.find(t => t.tier_name === 'rich');

    if (!poorIncome || !medianIncome || !richIncome) return 0;

    const poorShare = (Number(poorIncome.household_count) * Number(poorIncome.average_income)) / totalIncome;
    const richShare = (Number(richIncome.household_count) * Number(richIncome.average_income)) / totalIncome;
    
    // Approximate Gini: higher when rich have disproportionate share
    return Math.max(0, Math.min(1, (richShare - poorShare) * 1.5));
  }

  private calculateEconomicHealthScore(tiers: any[], gini: number): number {
    // Health score: 0-100, higher is better
    // Factors: inequality (lower gini is better), social mobility, income levels
    const inequalityScore = (1 - gini) * 40; // 40 points max
    const mobilityScore = tiers.reduce((sum, tier) => sum + Number(tier.social_mobility_rate), 0) * 1000; // 30 points max typical
    const incomeScore = Math.min(30, (tiers.reduce((sum, tier) => sum + Number(tier.average_income), 0) / 3) / 5000); // 30 points max
    
    return Math.max(0, Math.min(100, inequalityScore + Math.min(30, mobilityScore) + incomeScore));
  }

  private calculateMobilitySuccessProbability(
    eventType: SocialMobilityEventType, 
    fromTier: HouseholdTierType, 
    toTier: HouseholdTierType
  ): number {
    const baseProbabilities = {
      [SocialMobilityEventType.EDUCATION_INVESTMENT]: fromTier === HouseholdTierType.POOR ? 0.15 : 0.25,
      [SocialMobilityEventType.BUSINESS_START]: fromTier === HouseholdTierType.POOR ? 0.08 : 0.18,
      [SocialMobilityEventType.BUSINESS_SUCCESS]: 0.30,
      [SocialMobilityEventType.BUSINESS_FAILURE]: 0.85,
      [SocialMobilityEventType.INHERITANCE]: 0.95,
      [SocialMobilityEventType.MARRIAGE]: 0.20,
      [SocialMobilityEventType.ECONOMIC_POLICY_IMPACT]: 0.10,
      [SocialMobilityEventType.CULTURAL_SHIFT]: 0.05,
      [SocialMobilityEventType.NATURAL_PROGRESSION]: 0.02
    };

    return baseProbabilities[eventType] || 0.10;
  }

  private getMobilityEventDescription(
    eventType: SocialMobilityEventType,
    fromTier: HouseholdTierType,
    toTier: HouseholdTierType
  ): string {
    const descriptions = {
      [SocialMobilityEventType.EDUCATION_INVESTMENT]: `Education investment to advance from ${fromTier} to ${toTier} tier`,
      [SocialMobilityEventType.BUSINESS_START]: `Starting new business venture to improve economic status`,
      [SocialMobilityEventType.BUSINESS_SUCCESS]: `Successful business venture resulting in tier advancement`,
      [SocialMobilityEventType.BUSINESS_FAILURE]: `Business failure causing economic decline`,
      [SocialMobilityEventType.INHERITANCE]: `Inheritance received boosting economic status`,
      [SocialMobilityEventType.MARRIAGE]: `Marriage affecting household economic tier`,
      [SocialMobilityEventType.ECONOMIC_POLICY_IMPACT]: `Government economic policy impact on household`,
      [SocialMobilityEventType.CULTURAL_SHIFT]: `Cultural change affecting economic opportunities`,
      [SocialMobilityEventType.NATURAL_PROGRESSION]: `Natural economic progression over time`
    };

    return descriptions[eventType] || `Social mobility event: ${fromTier} to ${toTier}`;
  }

  private checkResourceRequirements(required: SocialMobilityResourceCost, provided: SocialMobilityResourceCost): boolean {
    for (const [resource, amount] of Object.entries(required)) {
      if ((provided[resource] || 0) < amount) {
        return false;
      }
    }
    return true;
  }

  private async updateHouseholdTierCounts(campaignId: number, fromTier: HouseholdTierType, toTier: HouseholdTierType): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      // Decrease from tier
      await client.query(`
        UPDATE household_tiers 
        SET household_count = GREATEST(0, household_count - 1)
        WHERE campaign_id = $1 AND tier_name = $2
      `, [campaignId, fromTier]);

      // Increase to tier
      await client.query(`
        UPDATE household_tiers 
        SET household_count = household_count + 1
        WHERE campaign_id = $1 AND tier_name = $2
      `, [campaignId, toTier]);
    } finally {
      client.release();
    }
  }

  private mapSocialMobilityEventFromDB(row: any): SocialMobilityEvent {
    return {
      ...row,
      success_probability: Number(row.success_probability),
      campaign_step: Number(row.campaign_step),
      resource_cost: typeof row.resource_cost === 'string' ? JSON.parse(row.resource_cost) : row.resource_cost
    };
  }
}
