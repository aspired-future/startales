import { Pool } from 'pg';

export interface SWFSimulationParams {
  civilization_id: string;
  knobs: {
    equity_allocation_target: number;
    fixed_income_allocation: number;
    infrastructure_allocation: number;
    alternative_investments: number;
    domestic_investment_bias: number;
    foreign_investment_limit: number;
    currency_hedging_ratio: number;
    esg_investment_minimum: number;
    maximum_single_holding: number;
    liquidity_reserve_ratio: number;
    volatility_tolerance: number;
    credit_rating_minimum: number;
    sector_concentration_limit: number;
    geographic_diversification: number;
    currency_exposure_limit: number;
    leverage_ratio_maximum: number;
    target_annual_return: number;
    benchmark_tracking_error: number;
    rebalancing_frequency: number;
    tax_revenue_allocation: number;
    resource_revenue_allocation: number;
    central_bank_funding: number;
    bond_issuance_funding: number;
    withdrawal_rate_limit: number;
  };
}

export interface SWFSimulationResult {
  fund_performance: {
    total_return: number;
    risk_adjusted_return: number;
    volatility: number;
    sharpe_ratio: number;
    max_drawdown: number;
  };
  portfolio_metrics: {
    total_assets: number;
    asset_allocation: Record<string, number>;
    geographic_allocation: Record<string, number>;
    currency_exposure: Record<string, number>;
  };
  risk_metrics: {
    var_95: number; // Value at Risk 95%
    concentration_risk: number;
    liquidity_risk: number;
    currency_risk: number;
  };
  economic_impact: {
    fiscal_contribution: number;
    market_stabilization: number;
    foreign_investment_flow: number;
    domestic_capital_formation: number;
  };
  recommendations: string[];
}

export class SovereignWealthFundSimulation {
  constructor(private pool: Pool) {}

  async simulate(params: SWFSimulationParams): Promise<SWFSimulationResult> {
    const { civilization_id, knobs } = params;

    // Get current fund data
    const fundData = await this.getFundData(civilization_id);
    
    // Simulate portfolio performance based on knobs
    const performance = await this.simulatePerformance(fundData, knobs);
    
    // Calculate risk metrics
    const riskMetrics = this.calculateRiskMetrics(fundData, knobs);
    
    // Assess economic impact
    const economicImpact = await this.assessEconomicImpact(civilization_id, fundData, knobs);
    
    // Generate AI recommendations
    const recommendations = this.generateRecommendations(fundData, knobs, performance, riskMetrics);

    return {
      fund_performance: performance,
      portfolio_metrics: {
        total_assets: fundData.total_assets,
        asset_allocation: this.calculateAssetAllocation(fundData, knobs),
        geographic_allocation: this.calculateGeographicAllocation(fundData),
        currency_exposure: this.calculateCurrencyExposure(fundData)
      },
      risk_metrics: riskMetrics,
      economic_impact: economicImpact,
      recommendations
    };
  }

  private async getFundData(civilization_id: string) {
    const [funds, holdings, currencies] = await Promise.all([
      this.pool.query(`
        SELECT * FROM sovereign_wealth_funds 
        WHERE civilization_id = $1 AND status = 'active'
      `, [civilization_id]),
      
      this.pool.query(`
        SELECT h.*, swf.civilization_id
        FROM swf_holdings h
        JOIN sovereign_wealth_funds swf ON h.fund_id = swf.id
        WHERE swf.civilization_id = $1
      `, [civilization_id]),
      
      this.pool.query(`
        SELECT ca.*, swf.civilization_id
        FROM swf_currency_access ca
        JOIN sovereign_wealth_funds swf ON ca.fund_id = swf.id
        WHERE swf.civilization_id = $1
      `, [civilization_id])
    ]);

    return {
      funds: funds.rows,
      holdings: holdings.rows,
      currencies: currencies.rows,
      total_assets: funds.rows.reduce((sum, f) => sum + parseFloat(f.total_assets), 0)
    };
  }

  private async simulatePerformance(fundData: any, knobs: any) {
    // Market simulation based on allocation targets
    const equityReturn = this.simulateEquityReturn(knobs.equity_allocation_target, knobs.volatility_tolerance);
    const bondReturn = this.simulateBondReturn(knobs.fixed_income_allocation, knobs.credit_rating_minimum);
    const infraReturn = this.simulateInfrastructureReturn(knobs.infrastructure_allocation);
    const altReturn = this.simulateAlternativeReturn(knobs.alternative_investments);

    // Weighted portfolio return
    const totalReturn = (
      (equityReturn * knobs.equity_allocation_target / 100) +
      (bondReturn * knobs.fixed_income_allocation / 100) +
      (infraReturn * knobs.infrastructure_allocation / 100) +
      (altReturn * knobs.alternative_investments / 100)
    );

    // Risk-adjusted metrics
    const volatility = this.calculatePortfolioVolatility(knobs);
    const sharpe_ratio = volatility > 0 ? (totalReturn - 2.5) / volatility : 0; // Assuming 2.5% risk-free rate
    const max_drawdown = this.estimateMaxDrawdown(knobs.volatility_tolerance);

    return {
      total_return: totalReturn,
      risk_adjusted_return: totalReturn - (volatility * 0.5), // Risk penalty
      volatility,
      sharpe_ratio,
      max_drawdown
    };
  }

  private simulateEquityReturn(allocation: number, volatility_tolerance: number): number {
    // Base equity return with volatility adjustment
    const baseReturn = 8.5; // Historical average
    const volatilityAdjustment = (volatility_tolerance - 5) * 0.5; // -2.5% to +2.5%
    const randomFactor = (Math.random() - 0.5) * 4; // ±2% random variation
    return baseReturn + volatilityAdjustment + randomFactor;
  }

  private simulateBondReturn(allocation: number, credit_rating: number): number {
    const baseReturn = 4.2;
    const creditSpread = (10 - credit_rating) * 0.3; // Higher spread for lower ratings
    const randomFactor = (Math.random() - 0.5) * 2; // ±1% random variation
    return baseReturn + creditSpread + randomFactor;
  }

  private simulateInfrastructureReturn(allocation: number): number {
    const baseReturn = 6.8;
    const randomFactor = (Math.random() - 0.5) * 3; // ±1.5% random variation
    return baseReturn + randomFactor;
  }

  private simulateAlternativeReturn(allocation: number): number {
    const baseReturn = 9.2;
    const randomFactor = (Math.random() - 0.5) * 6; // ±3% random variation (higher volatility)
    return baseReturn + randomFactor;
  }

  private calculatePortfolioVolatility(knobs: any): number {
    // Simplified volatility calculation based on asset mix
    const equityVol = 16 * (knobs.equity_allocation_target / 100);
    const bondVol = 4 * (knobs.fixed_income_allocation / 100);
    const infraVol = 8 * (knobs.infrastructure_allocation / 100);
    const altVol = 20 * (knobs.alternative_investments / 100);
    
    // Portfolio volatility (simplified, ignoring correlations)
    return Math.sqrt(equityVol**2 + bondVol**2 + infraVol**2 + altVol**2);
  }

  private calculateRiskMetrics(fundData: any, knobs: any) {
    const portfolioVol = this.calculatePortfolioVolatility(knobs);
    
    return {
      var_95: portfolioVol * 1.65 * Math.sqrt(252/12), // 95% VaR (monthly)
      concentration_risk: this.assessConcentrationRisk(fundData, knobs),
      liquidity_risk: this.assessLiquidityRisk(fundData, knobs),
      currency_risk: this.assessCurrencyRisk(fundData, knobs)
    };
  }

  private assessConcentrationRisk(fundData: any, knobs: any): number {
    // Risk from concentration in single holdings or sectors
    const maxSingleHolding = knobs.maximum_single_holding;
    const sectorLimit = knobs.sector_concentration_limit;
    
    // Higher concentration = higher risk score
    return (maxSingleHolding / 20) * 50 + (sectorLimit / 40) * 50;
  }

  private assessLiquidityRisk(fundData: any, knobs: any): number {
    // Risk from illiquid investments
    const liquidityReserve = knobs.liquidity_reserve_ratio;
    const infraAllocation = knobs.infrastructure_allocation;
    const altAllocation = knobs.alternative_investments;
    
    // Lower liquidity reserves + higher illiquid allocations = higher risk
    return Math.max(0, 100 - liquidityReserve * 2) + (infraAllocation + altAllocation) * 0.5;
  }

  private assessCurrencyRisk(fundData: any, knobs: any): number {
    // Risk from foreign currency exposure
    const foreignLimit = knobs.foreign_investment_limit;
    const hedgingRatio = knobs.currency_hedging_ratio;
    
    // Higher foreign exposure with lower hedging = higher risk
    return (foreignLimit * (100 - hedgingRatio)) / 100;
  }

  private async assessEconomicImpact(civilization_id: string, fundData: any, knobs: any) {
    // Get economic data for the civilization
    const economicData = await this.pool.query(`
      SELECT gdp, government_revenue, total_debt
      FROM civilizations 
      WHERE id = $1
    `, [civilization_id]);

    const gdp = economicData.rows[0]?.gdp || 1000000;
    const totalAssets = fundData.total_assets;

    return {
      fiscal_contribution: totalAssets * (knobs.target_annual_return / 100) * 0.3, // 30% goes to government
      market_stabilization: this.calculateMarketStabilization(totalAssets, knobs),
      foreign_investment_flow: totalAssets * (knobs.foreign_investment_limit / 100),
      domestic_capital_formation: totalAssets * (knobs.domestic_investment_bias / 100)
    };
  }

  private calculateMarketStabilization(totalAssets: number, knobs: any): number {
    // SWF's stabilizing effect on markets
    const liquidityProvision = totalAssets * (knobs.liquidity_reserve_ratio / 100);
    const counterCyclicalCapacity = totalAssets * 0.1; // 10% available for counter-cyclical investing
    return liquidityProvision + counterCyclicalCapacity;
  }

  private calculateAssetAllocation(fundData: any, knobs: any): Record<string, number> {
    return {
      equities: knobs.equity_allocation_target,
      fixed_income: knobs.fixed_income_allocation,
      infrastructure: knobs.infrastructure_allocation,
      alternatives: knobs.alternative_investments,
      cash: Math.max(0, 100 - knobs.equity_allocation_target - knobs.fixed_income_allocation - 
                     knobs.infrastructure_allocation - knobs.alternative_investments)
    };
  }

  private calculateGeographicAllocation(fundData: any): Record<string, number> {
    // Analyze holdings by issuing civilization
    const allocations: Record<string, number> = {};
    let totalValue = 0;

    fundData.holdings.forEach((holding: any) => {
      const civ = holding.issuing_civilization_id || 'domestic';
      allocations[civ] = (allocations[civ] || 0) + parseFloat(holding.market_value);
      totalValue += parseFloat(holding.market_value);
    });

    // Convert to percentages
    Object.keys(allocations).forEach(civ => {
      allocations[civ] = totalValue > 0 ? (allocations[civ] / totalValue) * 100 : 0;
    });

    return allocations;
  }

  private calculateCurrencyExposure(fundData: any): Record<string, number> {
    // Analyze currency exposure from holdings
    const exposures: Record<string, number> = {};
    let totalValue = 0;

    fundData.holdings.forEach((holding: any) => {
      const currency = holding.currency_code || 'TER';
      exposures[currency] = (exposures[currency] || 0) + parseFloat(holding.market_value);
      totalValue += parseFloat(holding.market_value);
    });

    // Convert to percentages
    Object.keys(exposures).forEach(currency => {
      exposures[currency] = totalValue > 0 ? (exposures[currency] / totalValue) * 100 : 0;
    });

    return exposures;
  }

  private estimateMaxDrawdown(volatility_tolerance: number): number {
    // Estimate maximum drawdown based on volatility tolerance
    const baseDrawdown = 15; // 15% base drawdown
    const volatilityAdjustment = (volatility_tolerance - 5) * 2; // ±4% adjustment
    return Math.max(5, baseDrawdown + volatilityAdjustment);
  }

  private generateRecommendations(fundData: any, knobs: any, performance: any, riskMetrics: any): string[] {
    const recommendations: string[] = [];

    // Performance-based recommendations
    if (performance.total_return < knobs.target_annual_return) {
      recommendations.push("Consider increasing equity allocation to meet return targets");
    }

    if (performance.sharpe_ratio < 0.5) {
      recommendations.push("Risk-adjusted returns are low; review asset allocation strategy");
    }

    // Risk-based recommendations
    if (riskMetrics.concentration_risk > 70) {
      recommendations.push("High concentration risk detected; increase diversification");
    }

    if (riskMetrics.liquidity_risk > 60) {
      recommendations.push("Liquidity risk is elevated; consider increasing cash reserves");
    }

    if (riskMetrics.currency_risk > 50) {
      recommendations.push("Significant currency exposure; consider increasing hedging ratio");
    }

    // Allocation-based recommendations
    if (knobs.domestic_investment_bias > 80) {
      recommendations.push("High domestic bias may limit diversification benefits");
    }

    if (knobs.esg_investment_minimum < 30) {
      recommendations.push("Consider increasing ESG investments for sustainable returns");
    }

    // Default recommendation if none triggered
    if (recommendations.length === 0) {
      recommendations.push("Portfolio is well-balanced; maintain current strategy");
    }

    return recommendations;
  }
}

