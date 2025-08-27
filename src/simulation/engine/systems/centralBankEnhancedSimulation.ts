import { Pool } from 'pg';

export interface CentralBankEnhancedSimulationParams {
  civilization_id: string;
  knobs: {
    // Gold Reserve Management
    gold_reserve_target_ratio: number;
    gold_acquisition_rate: number;
    gold_price_volatility_buffer: number;
    gold_storage_diversification: number;
    gold_quality_standard: number;
    gold_liquidity_reserve: number;
    
    // Multi-Currency Management
    foreign_currency_exposure_limit: number;
    currency_diversification_target: number;
    exchange_rate_intervention_threshold: number;
    currency_swap_utilization: number;
    foreign_reserve_rebalancing_frequency: number;
    currency_hedging_ratio: number;
    
    // Quantitative Easing
    qe_bond_purchase_rate: number;
    qe_duration_target: number;
    qe_asset_class_diversification: number;
    qe_yield_curve_targeting: number;
    qe_market_impact_threshold: number;
    qe_exit_strategy_trigger: number;
    
    // Money Supply & Interest Rates
    money_supply_growth_target: number;
    interest_rate_corridor_width: number;
    reserve_requirement_ratio: number;
    discount_window_penalty_rate: number;
    monetary_base_expansion_limit: number;
    inflation_targeting_tolerance: number;
  };
}

export interface CentralBankEnhancedSimulationResult {
  monetary_policy_effectiveness: {
    inflation_control_score: number;
    currency_stability_score: number;
    financial_stability_score: number;
    economic_growth_impact: number;
  };
  reserve_management: {
    gold_reserve_adequacy: number;
    currency_diversification_score: number;
    reserve_liquidity_ratio: number;
    total_reserve_value: number;
  };
  quantitative_easing_impact: {
    market_liquidity_improvement: number;
    yield_curve_effectiveness: number;
    asset_price_impact: number;
    economic_stimulus_effect: number;
  };
  risk_metrics: {
    currency_risk: number;
    interest_rate_risk: number;
    credit_risk: number;
    operational_risk: number;
  };
  economic_indicators: {
    money_supply_growth: number;
    inflation_rate: number;
    exchange_rate_stability: number;
    financial_market_confidence: number;
  };
  recommendations: string[];
}

export class CentralBankEnhancedSimulation {
  constructor(private pool: Pool) {}

  async simulate(params: CentralBankEnhancedSimulationParams): Promise<CentralBankEnhancedSimulationResult> {
    const { civilization_id, knobs } = params;

    // Get current central bank data
    const cbData = await this.getCentralBankData(civilization_id);
    
    // Simulate monetary policy effectiveness
    const policyEffectiveness = this.simulateMonetaryPolicyEffectiveness(cbData, knobs);
    
    // Assess reserve management
    const reserveManagement = this.assessReserveManagement(cbData, knobs);
    
    // Evaluate QE impact
    const qeImpact = this.evaluateQuantitativeEasingImpact(cbData, knobs);
    
    // Calculate risk metrics
    const riskMetrics = this.calculateRiskMetrics(cbData, knobs);
    
    // Simulate economic indicators
    const economicIndicators = this.simulateEconomicIndicators(cbData, knobs);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(cbData, knobs, policyEffectiveness, riskMetrics);

    return {
      monetary_policy_effectiveness: policyEffectiveness,
      reserve_management: reserveManagement,
      quantitative_easing_impact: qeImpact,
      risk_metrics: riskMetrics,
      economic_indicators: economicIndicators,
      recommendations
    };
  }

  private async getCentralBankData(civilization_id: string) {
    const [reserves, currencies, qeOperations, moneySupply, interestRates] = await Promise.all([
      this.pool.query(`
        SELECT * FROM cb_reserves 
        WHERE civilization_id = $1
      `, [civilization_id]),
      
      this.pool.query(`
        SELECT * FROM cb_currency_holdings 
        WHERE civilization_id = $1
      `, [civilization_id]),
      
      this.pool.query(`
        SELECT * FROM cb_quantitative_easing 
        WHERE civilization_id = $1 AND status = 'active'
      `, [civilization_id]),
      
      this.pool.query(`
        SELECT * FROM cb_money_supply 
        WHERE civilization_id = $1 
        ORDER BY measurement_date DESC 
        LIMIT 1
      `, [civilization_id]),
      
      this.pool.query(`
        SELECT * FROM cb_interest_rate_corridor 
        WHERE civilization_id = $1 
        ORDER BY effective_date DESC 
        LIMIT 1
      `, [civilization_id])
    ]);

    return {
      reserves: reserves.rows,
      currencies: currencies.rows,
      qeOperations: qeOperations.rows,
      moneySupply: moneySupply.rows[0] || {},
      interestRates: interestRates.rows[0] || {}
    };
  }

  private simulateMonetaryPolicyEffectiveness(cbData: any, knobs: any) {
    // Inflation control effectiveness
    const inflationControl = this.calculateInflationControlScore(knobs);
    
    // Currency stability based on intervention thresholds and hedging
    const currencyStability = this.calculateCurrencyStabilityScore(knobs);
    
    // Financial stability from reserve requirements and interest rate management
    const financialStability = this.calculateFinancialStabilityScore(knobs);
    
    // Economic growth impact from monetary policy stance
    const growthImpact = this.calculateEconomicGrowthImpact(knobs);

    return {
      inflation_control_score: inflationControl,
      currency_stability_score: currencyStability,
      financial_stability_score: financialStability,
      economic_growth_impact: growthImpact
    };
  }

  private calculateInflationControlScore(knobs: any): number {
    // Higher tolerance and wider corridors = lower control
    const toleranceScore = Math.max(0, 100 - (knobs.inflation_targeting_tolerance * 20));
    const corridorScore = Math.max(0, 100 - (knobs.interest_rate_corridor_width * 30));
    const moneySupplyScore = Math.max(0, 100 - Math.abs(knobs.money_supply_growth_target - 4) * 10);
    
    return (toleranceScore + corridorScore + moneySupplyScore) / 3;
  }

  private calculateCurrencyStabilityScore(knobs: any): number {
    // Lower intervention threshold = more active management = higher stability
    const interventionScore = Math.max(0, 100 - (knobs.exchange_rate_intervention_threshold * 5));
    const hedgingScore = knobs.currency_hedging_ratio * 0.8;
    const diversificationScore = Math.min(100, knobs.currency_diversification_target * 12);
    
    return (interventionScore + hedgingScore + diversificationScore) / 3;
  }

  private calculateFinancialStabilityScore(knobs: any): number {
    // Optimal reserve requirement around 12%
    const reserveScore = Math.max(0, 100 - Math.abs(knobs.reserve_requirement_ratio - 12) * 5);
    const penaltyScore = Math.min(100, knobs.discount_window_penalty_rate * 30);
    const expansionScore = Math.max(0, 100 - Math.abs(knobs.monetary_base_expansion_limit - 15) * 3);
    
    return (reserveScore + penaltyScore + expansionScore) / 3;
  }

  private calculateEconomicGrowthImpact(knobs: any): number {
    // Moderate money supply growth supports growth
    const moneySupplyImpact = Math.max(0, 100 - Math.abs(knobs.money_supply_growth_target - 6) * 8);
    const qeImpact = Math.min(100, knobs.qe_bond_purchase_rate * 8);
    const rateImpact = Math.max(0, 100 - knobs.interest_rate_corridor_width * 40);
    
    return (moneySupplyImpact + qeImpact + rateImpact) / 3;
  }

  private assessReserveManagement(cbData: any, knobs: any) {
    // Gold reserve adequacy
    const goldAdequacy = Math.min(100, knobs.gold_reserve_target_ratio * 4);
    
    // Currency diversification score
    const diversificationScore = Math.min(100, knobs.currency_diversification_target * 10);
    
    // Reserve liquidity
    const liquidityRatio = knobs.gold_liquidity_reserve + (knobs.foreign_currency_exposure_limit * 0.5);
    
    // Total reserve value (simulated)
    const totalReserveValue = this.estimateTotalReserveValue(cbData, knobs);

    return {
      gold_reserve_adequacy: goldAdequacy,
      currency_diversification_score: diversificationScore,
      reserve_liquidity_ratio: Math.min(100, liquidityRatio),
      total_reserve_value: totalReserveValue
    };
  }

  private estimateTotalReserveValue(cbData: any, knobs: any): number {
    // Simulate total reserve value based on knobs and existing data
    const baseValue = 50000000; // 50B base
    const goldMultiplier = knobs.gold_reserve_target_ratio / 15; // Relative to 15% target
    const currencyMultiplier = knobs.foreign_currency_exposure_limit / 35; // Relative to 35% target
    
    return baseValue * (goldMultiplier + currencyMultiplier);
  }

  private evaluateQuantitativeEasingImpact(cbData: any, knobs: any) {
    // Market liquidity improvement
    const liquidityImprovement = Math.min(100, knobs.qe_bond_purchase_rate * 8);
    
    // Yield curve effectiveness
    const yieldEffectiveness = Math.min(100, (5 - Math.abs(knobs.qe_yield_curve_targeting - 2.5)) * 30);
    
    // Asset price impact
    const assetPriceImpact = Math.min(100, knobs.qe_asset_class_diversification * 15);
    
    // Economic stimulus effect
    const stimulusEffect = Math.min(100, (knobs.qe_duration_target / 24) * 80);

    return {
      market_liquidity_improvement: liquidityImprovement,
      yield_curve_effectiveness: yieldEffectiveness,
      asset_price_impact: assetPriceImpact,
      economic_stimulus_effect: stimulusEffect
    };
  }

  private calculateRiskMetrics(cbData: any, knobs: any) {
    // Currency risk from foreign exposure
    const currencyRisk = knobs.foreign_currency_exposure_limit - knobs.currency_hedging_ratio;
    
    // Interest rate risk from corridor width and QE duration
    const interestRateRisk = (knobs.interest_rate_corridor_width * 20) + (knobs.qe_duration_target / 60 * 30);
    
    // Credit risk from QE asset diversification (lower diversification = higher risk)
    const creditRisk = Math.max(0, 80 - (knobs.qe_asset_class_diversification * 10));
    
    // Operational risk from complexity
    const operationalRisk = (knobs.currency_diversification_target * 5) + (knobs.gold_storage_diversification * 8);

    return {
      currency_risk: Math.max(0, Math.min(100, currencyRisk)),
      interest_rate_risk: Math.max(0, Math.min(100, interestRateRisk)),
      credit_risk: Math.max(0, Math.min(100, creditRisk)),
      operational_risk: Math.max(0, Math.min(100, operationalRisk))
    };
  }

  private simulateEconomicIndicators(cbData: any, knobs: any) {
    // Money supply growth (directly from knob)
    const moneySupplyGrowth = knobs.money_supply_growth_target;
    
    // Inflation rate simulation
    const inflationRate = this.simulateInflationRate(knobs);
    
    // Exchange rate stability
    const exchangeRateStability = 100 - (knobs.exchange_rate_intervention_threshold * 4);
    
    // Financial market confidence
    const marketConfidence = this.calculateMarketConfidence(knobs);

    return {
      money_supply_growth: moneySupplyGrowth,
      inflation_rate: inflationRate,
      exchange_rate_stability: Math.max(0, Math.min(100, exchangeRateStability)),
      financial_market_confidence: marketConfidence
    };
  }

  private simulateInflationRate(knobs: any): number {
    // Base inflation influenced by money supply growth and QE
    const baseInflation = 2.5;
    const moneySupplyEffect = (knobs.money_supply_growth_target - 4) * 0.3;
    const qeEffect = knobs.qe_bond_purchase_rate * 0.1;
    const randomFactor = (Math.random() - 0.5) * 1.5;
    
    return Math.max(0, baseInflation + moneySupplyEffect + qeEffect + randomFactor);
  }

  private calculateMarketConfidence(knobs: any): number {
    // Confidence from stable policy parameters
    const stabilityScore = 100 - (knobs.interest_rate_corridor_width * 25);
    const credibilityScore = Math.min(100, knobs.inflation_targeting_tolerance * 40);
    const reserveScore = Math.min(100, knobs.gold_reserve_target_ratio * 3);
    
    return Math.max(0, (stabilityScore + credibilityScore + reserveScore) / 3);
  }

  private generateRecommendations(cbData: any, knobs: any, policyEffectiveness: any, riskMetrics: any): string[] {
    const recommendations: string[] = [];

    // Inflation control recommendations
    if (policyEffectiveness.inflation_control_score < 70) {
      recommendations.push("Consider tightening inflation targeting tolerance to improve price stability");
    }

    // Currency stability recommendations
    if (policyEffectiveness.currency_stability_score < 60) {
      recommendations.push("Increase currency hedging ratio to reduce exchange rate volatility");
    }

    // Risk management recommendations
    if (riskMetrics.currency_risk > 70) {
      recommendations.push("High currency risk detected; consider reducing foreign exposure or increasing hedging");
    }

    if (riskMetrics.interest_rate_risk > 60) {
      recommendations.push("Interest rate risk is elevated; consider narrowing the corridor width");
    }

    // QE recommendations
    if (knobs.qe_bond_purchase_rate > 15) {
      recommendations.push("QE purchase rate is very high; monitor for asset bubble formation");
    }

    // Reserve management recommendations
    if (knobs.gold_reserve_target_ratio < 10) {
      recommendations.push("Gold reserves are low; consider increasing allocation for crisis resilience");
    }

    if (knobs.currency_diversification_target < 4) {
      recommendations.push("Limited currency diversification may increase concentration risk");
    }

    // Default recommendation
    if (recommendations.length === 0) {
      recommendations.push("Central bank policy parameters are well-balanced; maintain current approach");
    }

    return recommendations;
  }
}

