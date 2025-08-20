import { Pool } from 'pg';
import { 
  FiscalPolicyEffect, 
  SimulationStateModifier, 
  FiscalMultiplier, 
  EconomicBehavioralEffect, 
  InflationImpactTracking, 
  NarrativeGenerationInput 
} from './fiscalSimulationSchema.js';

export class FiscalSimulationService {
  constructor(private pool: Pool) {}

  // Fiscal Policy Effects Management
  async calculateFiscalEffect(
    civilizationId: number, 
    policyType: 'spending' | 'taxation' | 'transfer',
    policyCategory: string, 
    amount: number
  ): Promise<FiscalPolicyEffect> {
    // Get fiscal multiplier for this policy category
    const multiplier = await this.getFiscalMultiplier(policyCategory);
    if (!multiplier) {
      throw new Error(`No fiscal multiplier found for category: ${policyCategory}`);
    }

    // Get current spending in this category to calculate diminishing returns
    const currentSpending = await this.getCurrentSpending(civilizationId, policyCategory);
    
    // Calculate diminishing returns effect
    const diminishingFactor = this.calculateDiminishingReturns(
      currentSpending, 
      amount, 
      multiplier.diminishing_returns_factor
    );

    // Calculate base effect size
    const baseEffectSize = amount * multiplier.base_multiplier * diminishingFactor * multiplier.economic_condition_modifier;
    
    // Calculate initial effect based on time profile
    const timeProfile = multiplier.time_profile;
    const currentEffectSize = baseEffectSize * timeProfile.initial_intensity;

    // Create fiscal policy effect record
    const query = `
      INSERT INTO fiscal_policy_effects (
        civilization_id, policy_type, policy_category, policy_amount,
        effect_type, base_effect_size, current_effect_size, 
        implementation_progress, time_to_full_effect
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [
      civilizationId,
      policyType,
      policyCategory,
      amount,
      multiplier.effect_type,
      baseEffectSize,
      currentEffectSize,
      timeProfile.initial_intensity,
      timeProfile.duration_months
    ]);

    return result.rows[0];
  }

  async applyFiscalEffect(effectId: number): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get the fiscal effect
      const effectQuery = 'SELECT * FROM fiscal_policy_effects WHERE id = $1';
      const effectResult = await client.query(effectQuery, [effectId]);
      const effect = effectResult.rows[0];

      if (!effect) {
        throw new Error(`Fiscal effect not found: ${effectId}`);
      }

      // Update simulation state modifier
      await this.updateSimulationState(client, effect);

      // Generate narrative input if significant
      if (Math.abs(effect.current_effect_size) > 0.1) {
        await this.generateNarrativeInput(client, effect);
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async updateSimulationState(client: any, effect: FiscalPolicyEffect): Promise<void> {
    // Map policy categories to simulation modifier types
    const modifierMapping = this.getModifierMapping(effect.policy_category, effect.effect_type);
    
    const query = `
      INSERT INTO simulation_state_modifiers (
        civilization_id, modifier_type, modifier_category, 
        base_value, fiscal_modifier, other_modifiers, total_value
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (civilization_id, modifier_type, modifier_category)
      DO UPDATE SET 
        fiscal_modifier = simulation_state_modifiers.fiscal_modifier + $5,
        total_value = simulation_state_modifiers.base_value + 
                     (simulation_state_modifiers.fiscal_modifier + $5) + 
                     simulation_state_modifiers.other_modifiers,
        last_updated = CURRENT_TIMESTAMP
    `;

    await client.query(query, [
      effect.civilization_id,
      modifierMapping.type,
      modifierMapping.category,
      0, // base_value (will be preserved if exists)
      effect.current_effect_size,
      0, // other_modifiers (will be preserved if exists)
      effect.current_effect_size // total_value (will be recalculated)
    ]);
  }

  private getModifierMapping(policyCategory: string, effectType: string): { type: string; category: string } {
    const mappings: Record<string, { type: string; category: string }> = {
      'infrastructure_transport': { type: 'infrastructure', category: 'transport_quality' },
      'infrastructure_utilities': { type: 'infrastructure', category: 'utilities_reliability' },
      'infrastructure_digital': { type: 'infrastructure', category: 'digital_connectivity' },
      'defense_personnel': { type: 'military', category: 'readiness_level' },
      'defense_equipment': { type: 'military', category: 'equipment_quality' },
      'defense_research': { type: 'military', category: 'technological_edge' },
      'research_basic': { type: 'research', category: 'knowledge_accumulation' },
      'research_applied': { type: 'research', category: 'innovation_capacity' },
      'social_education': { type: 'social', category: 'education_quality' },
      'social_healthcare': { type: 'social', category: 'healthcare_access' },
      'social_welfare': { type: 'social', category: 'social_cohesion' }
    };

    return mappings[policyCategory] || { type: 'economic', category: 'general_effect' };
  }

  private async generateNarrativeInput(client: any, effect: FiscalPolicyEffect): Promise<void> {
    const narrativeData = this.createNarrativeData(effect);
    
    const query = `
      INSERT INTO narrative_generation_inputs (
        civilization_id, input_type, input_category, 
        narrative_weight, narrative_data, emotional_valence, magnitude
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    await client.query(query, [
      effect.civilization_id,
      this.determineInputType(effect),
      effect.policy_category,
      this.calculateNarrativeWeight(effect),
      JSON.stringify(narrativeData),
      this.calculateEmotionalValence(effect),
      Math.abs(effect.current_effect_size)
    ]);
  }

  private createNarrativeData(effect: FiscalPolicyEffect): any {
    const categoryNames: Record<string, string> = {
      'infrastructure_transport': 'Transportation Infrastructure',
      'infrastructure_utilities': 'Utilities Infrastructure',
      'infrastructure_digital': 'Digital Infrastructure',
      'defense_personnel': 'Military Personnel',
      'defense_equipment': 'Defense Equipment',
      'defense_research': 'Military Research',
      'research_basic': 'Basic Research',
      'research_applied': 'Applied Research',
      'social_education': 'Education System',
      'social_healthcare': 'Healthcare System',
      'social_welfare': 'Social Welfare'
    };

    const categoryName = categoryNames[effect.policy_category] || effect.policy_category;
    const isPositive = effect.current_effect_size > 0;
    
    return {
      title: `${categoryName} ${isPositive ? 'Investment' : 'Reduction'} Shows Results`,
      description: `${isPositive ? 'Increased' : 'Decreased'} spending on ${categoryName.toLowerCase()} has ${isPositive ? 'improved' : 'reduced'} system performance by ${Math.abs(effect.current_effect_size * 100).toFixed(1)}%`,
      impact_magnitude: Math.abs(effect.current_effect_size),
      affected_systems: [effect.effect_type],
      time_frame: effect.time_to_full_effect > 24 ? 'long_term' : effect.time_to_full_effect > 12 ? 'medium_term' : 'short_term',
      citizen_reaction: isPositive ? 'positive' : 'concerned'
    };
  }

  private determineInputType(effect: FiscalPolicyEffect): string {
    if (effect.policy_type === 'spending' && effect.current_effect_size > 0.1) {
      return 'fiscal_achievement';
    } else if (Math.abs(effect.current_effect_size) > 0.05) {
      return 'economic_consequence';
    } else {
      return 'policy_change';
    }
  }

  private calculateNarrativeWeight(effect: FiscalPolicyEffect): number {
    const baseWeight = Math.abs(effect.current_effect_size) * 2;
    const amountWeight = Math.log10(effect.policy_amount / 1000000) * 0.1;
    return Math.min(2.0, Math.max(0.1, baseWeight + amountWeight));
  }

  private calculateEmotionalValence(effect: FiscalPolicyEffect): number {
    const magnitude = Math.abs(effect.current_effect_size);
    const direction = effect.current_effect_size > 0 ? 1 : -1;
    
    // Social spending generally more positive, defense spending more neutral
    const categoryMultiplier = effect.policy_category.startsWith('social') ? 1.2 : 
                              effect.policy_category.startsWith('defense') ? 0.8 : 1.0;
    
    return Math.max(-1, Math.min(1, direction * magnitude * 2 * categoryMultiplier));
  }

  async getFiscalPolicyEffects(civilizationId: number, filters?: { 
    policy_type?: string; 
    policy_category?: string; 
    active_only?: boolean 
  }): Promise<FiscalPolicyEffect[]> {
    let query = 'SELECT * FROM fiscal_policy_effects WHERE civilization_id = $1';
    const params = [civilizationId];
    let paramIndex = 2;

    if (filters?.policy_type) {
      query += ` AND policy_type = $${paramIndex}`;
      params.push(filters.policy_type);
      paramIndex++;
    }

    if (filters?.policy_category) {
      query += ` AND policy_category = $${paramIndex}`;
      params.push(filters.policy_category);
      paramIndex++;
    }

    if (filters?.active_only) {
      query += ` AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async updateFiscalEffectProgress(): Promise<void> {
    // Update implementation progress for all active fiscal effects
    const query = `
      UPDATE fiscal_policy_effects 
      SET 
        implementation_progress = LEAST(1.0, 
          implementation_progress + (1.0 / time_to_full_effect)
        ),
        current_effect_size = base_effect_size * LEAST(1.0, 
          implementation_progress + (1.0 / time_to_full_effect)
        ),
        last_updated = CURRENT_TIMESTAMP
      WHERE (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
        AND implementation_progress < 1.0
      RETURNING *
    `;

    const result = await this.pool.query(query);
    
    // Update simulation states for all updated effects
    for (const effect of result.rows) {
      await this.applyFiscalEffect(effect.id);
    }
  }

  // Simulation State Management
  async getSimulationState(civilizationId: number, modifierType?: string): Promise<SimulationStateModifier[]> {
    let query = 'SELECT * FROM simulation_state_modifiers WHERE civilization_id = $1';
    const params = [civilizationId];

    if (modifierType) {
      query += ' AND modifier_type = $2';
      params.push(modifierType);
    }

    query += ' ORDER BY modifier_type, modifier_category';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getSimulationModifier(civilizationId: number, modifierType: string, modifierCategory: string): Promise<SimulationStateModifier | null> {
    const query = `
      SELECT * FROM simulation_state_modifiers 
      WHERE civilization_id = $1 AND modifier_type = $2 AND modifier_category = $3
    `;
    const result = await this.pool.query(query, [civilizationId, modifierType, modifierCategory]);
    return result.rows[0] || null;
  }

  async updateSimulationModifier(
    civilizationId: number, 
    modifierType: string, 
    modifierCategory: string, 
    updates: Partial<SimulationStateModifier>
  ): Promise<SimulationStateModifier> {
    const setClause = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'civilization_id' && key !== 'modifier_type' && key !== 'modifier_category')
      .map((key, index) => `${key} = $${index + 4}`)
      .join(', ');
    
    const values = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'civilization_id' && key !== 'modifier_type' && key !== 'modifier_category')
      .map(key => updates[key as keyof SimulationStateModifier]);

    const query = `
      UPDATE simulation_state_modifiers 
      SET ${setClause}, 
          total_value = base_value + fiscal_modifier + other_modifiers,
          last_updated = CURRENT_TIMESTAMP 
      WHERE civilization_id = $1 AND modifier_type = $2 AND modifier_category = $3
      RETURNING *
    `;
    const result = await this.pool.query(query, [civilizationId, modifierType, modifierCategory, ...values]);
    return result.rows[0];
  }

  // Economic Behavioral Effects
  async calculateTaxBehavioralEffect(
    civilizationId: number, 
    taxType: 'income' | 'corporate' | 'sales' | 'property' | 'capital_gains',
    oldRate: number, 
    newRate: number
  ): Promise<EconomicBehavioralEffect> {
    // Get tax elasticity for this tax type
    const elasticity = this.getTaxElasticity(taxType);
    
    // Calculate rate change
    const rateChange = (newRate - oldRate) / Math.max(oldRate, 0.001);
    
    // Calculate behavioral response
    const behavioralResponse = elasticity * rateChange;
    
    // Calculate Laffer curve position
    const lafferPosition = this.calculateLafferPosition(newRate, taxType);
    
    // Calculate deadweight loss
    const deadweightLoss = this.calculateDeadweightLoss(newRate, elasticity);
    
    // Determine behavioral effect type
    const behavioralEffect = this.getBehavioralEffectType(taxType);

    const query = `
      INSERT INTO economic_behavioral_effects (
        civilization_id, tax_type, tax_rate, behavioral_effect,
        effect_magnitude, laffer_curve_position, deadweight_loss
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      civilizationId,
      taxType,
      newRate,
      behavioralEffect,
      behavioralResponse,
      lafferPosition,
      deadweightLoss
    ]);

    return result.rows[0];
  }

  private getTaxElasticity(taxType: string): number {
    const elasticities: Record<string, number> = {
      'income': -0.25,        // Work disincentive
      'corporate': -0.40,     // Investment disincentive
      'sales': -0.15,         // Consumption reduction
      'property': -0.10,      // Savings disincentive
      'capital_gains': -0.35  // Investment disincentive
    };
    return elasticities[taxType] || -0.20;
  }

  private calculateLafferPosition(taxRate: number, taxType: string): number {
    // Optimal tax rates for different tax types (simplified)
    const optimalRates: Record<string, number> = {
      'income': 0.35,
      'corporate': 0.25,
      'sales': 0.12,
      'property': 0.03,
      'capital_gains': 0.20
    };
    
    const optimalRate = optimalRates[taxType] || 0.25;
    return Math.min(1.0, taxRate / optimalRate);
  }

  private calculateDeadweightLoss(taxRate: number, elasticity: number): number {
    // Simplified deadweight loss calculation: 0.5 * elasticity * rate^2
    return 0.5 * Math.abs(elasticity) * Math.pow(taxRate, 2);
  }

  private getBehavioralEffectType(taxType: string): string {
    const effectTypes: Record<string, string> = {
      'income': 'work_incentive',
      'corporate': 'investment_incentive',
      'sales': 'consumption_pattern',
      'property': 'savings_rate',
      'capital_gains': 'investment_incentive'
    };
    return effectTypes[taxType] || 'work_incentive';
  }

  async getBehavioralEffects(civilizationId: number, taxType?: string): Promise<EconomicBehavioralEffect[]> {
    let query = 'SELECT * FROM economic_behavioral_effects WHERE civilization_id = $1';
    const params = [civilizationId];

    if (taxType) {
      query += ' AND tax_type = $2';
      params.push(taxType);
    }

    query += ' ORDER BY recorded_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  // Inflation Impact Tracking
  async updateInflationImpact(civilizationId: number, inflationRate: number): Promise<InflationImpactTracking> {
    // Calculate various inflation effects
    const purchasingPowerIndex = 1 / (1 + inflationRate);
    const competitivenessIndex = 1 - (inflationRate * 0.5); // Simplified relationship
    const realWageEffect = -inflationRate * 0.8; // Real wages typically don't keep up
    const investmentEffect = inflationRate > 0.03 ? -inflationRate * 0.3 : inflationRate * 0.2;
    const socialStabilityEffect = -Math.pow(inflationRate, 1.5) * 2; // Non-linear negative effect

    const query = `
      INSERT INTO inflation_impact_tracking (
        civilization_id, inflation_rate, purchasing_power_index,
        competitiveness_index, real_wage_effect, investment_effect, social_stability_effect
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await this.pool.query(query, [
      civilizationId,
      inflationRate,
      purchasingPowerIndex,
      competitivenessIndex,
      realWageEffect,
      investmentEffect,
      socialStabilityEffect
    ]);

    return result.rows[0];
  }

  async getInflationImpacts(civilizationId: number, days?: number): Promise<InflationImpactTracking[]> {
    let query = 'SELECT * FROM inflation_impact_tracking WHERE civilization_id = $1';
    const params = [civilizationId];

    if (days) {
      query += ` AND recorded_at >= NOW() - INTERVAL '${days} days'`;
    }

    query += ' ORDER BY recorded_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  // Narrative Generation
  async getNarrativeInputs(civilizationId: number, unprocessedOnly: boolean = false): Promise<NarrativeGenerationInput[]> {
    let query = 'SELECT * FROM narrative_generation_inputs WHERE civilization_id = $1';
    const params = [civilizationId];

    if (unprocessedOnly) {
      query += ' AND processed_at IS NULL';
    }

    query += ' ORDER BY created_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async markNarrativeInputsProcessed(inputIds: number[]): Promise<void> {
    if (inputIds.length === 0) return;

    const query = `
      UPDATE narrative_generation_inputs 
      SET processed_at = CURRENT_TIMESTAMP 
      WHERE id = ANY($1)
    `;
    await this.pool.query(query, [inputIds]);
  }

  // Utility Methods
  private async getFiscalMultiplier(policyCategory: string): Promise<FiscalMultiplier | null> {
    const query = 'SELECT * FROM fiscal_multipliers WHERE policy_category = $1';
    const result = await this.pool.query(query, [policyCategory]);
    return result.rows[0] || null;
  }

  private async getCurrentSpending(civilizationId: number, policyCategory: string): Promise<number> {
    const query = `
      SELECT COALESCE(SUM(policy_amount), 0) as total_spending
      FROM fiscal_policy_effects 
      WHERE civilization_id = $1 AND policy_category = $2 
        AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
    `;
    const result = await this.pool.query(query, [civilizationId, policyCategory]);
    return parseFloat(result.rows[0].total_spending) || 0;
  }

  private calculateDiminishingReturns(currentSpending: number, additionalSpending: number, factor: number): number {
    const totalSpending = currentSpending + additionalSpending;
    const diminishingEffect = Math.pow(factor, totalSpending / 10000000); // Diminishing returns per 10M spending
    return Math.max(0.1, diminishingEffect); // Minimum 10% effectiveness
  }

  // Analytics and Reporting
  async getFiscalImpactSummary(civilizationId: number): Promise<any> {
    const query = `
      SELECT 
        policy_type,
        policy_category,
        COUNT(*) as policy_count,
        SUM(policy_amount) as total_amount,
        AVG(current_effect_size) as avg_effect_size,
        SUM(current_effect_size * policy_amount) as weighted_impact
      FROM fiscal_policy_effects 
      WHERE civilization_id = $1 
        AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
      GROUP BY policy_type, policy_category
      ORDER BY weighted_impact DESC
    `;
    const result = await this.pool.query(query, [civilizationId]);
    return result.rows;
  }

  async getSimulationStateSummary(civilizationId: number): Promise<any> {
    const query = `
      SELECT 
        modifier_type,
        COUNT(*) as modifier_count,
        AVG(base_value) as avg_base_value,
        AVG(fiscal_modifier) as avg_fiscal_modifier,
        AVG(total_value) as avg_total_value,
        AVG(fiscal_modifier / NULLIF(total_value, 0)) as fiscal_contribution_ratio
      FROM simulation_state_modifiers 
      WHERE civilization_id = $1
      GROUP BY modifier_type
      ORDER BY avg_total_value DESC
    `;
    const result = await this.pool.query(query, [civilizationId]);
    return result.rows;
  }
}

// Service instance
let fiscalSimulationService: FiscalSimulationService | null = null;

export function getFiscalSimulationService(): FiscalSimulationService {
  if (!fiscalSimulationService) {
    throw new Error('FiscalSimulationService not initialized. Call initializeFiscalSimulationService first.');
  }
  return fiscalSimulationService;
}

export function initializeFiscalSimulationService(pool: Pool): void {
  fiscalSimulationService = new FiscalSimulationService(pool);
}
