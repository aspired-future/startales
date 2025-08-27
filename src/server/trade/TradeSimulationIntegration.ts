/**
 * Trade Simulation Integration
 * 
 * Integrates the enhanced trade system with the simulation engine,
 * providing real-time trade dynamics, market fluctuations, and economic impacts.
 */

import { Pool } from 'pg';
import { EventEmitter } from 'events';
import { TradeEngine, TradeResource, TradePrice, TradeRoute, TradeContract, TradeAnalytics } from './tradeEngine.js';

export interface TradeKnobs {
  // Trade Route Efficiency & Management
  trade_route_efficiency: number;             // Trade route efficiency and logistics optimization
  transportation_cost_optimization: number;   // Transportation cost optimization and route planning
  trade_volume_capacity: number;              // Trade volume capacity and throughput management
  
  // Market Dynamics & Pricing
  market_price_volatility: number;            // Market price volatility and price fluctuation intensity
  supply_demand_responsiveness: number;       // Supply and demand responsiveness and market equilibrium
  price_discovery_efficiency: number;         // Price discovery efficiency and market transparency
  
  // Resource Management & Availability
  resource_availability_stability: number;    // Resource availability stability and supply consistency
  resource_quality_standards: number;         // Resource quality standards and product certification
  strategic_resource_prioritization: number;  // Strategic resource prioritization and national security
  
  // International Trade & Relations
  international_trade_facilitation: number;   // International trade facilitation and diplomatic commerce
  trade_agreement_negotiation: number;        // Trade agreement negotiation and bilateral relations
  customs_efficiency: number;                 // Customs efficiency and border processing speed
  
  // Trade Security & Risk Management
  trade_route_security: number;               // Trade route security and piracy prevention
  cargo_insurance_coverage: number;           // Cargo insurance coverage and risk mitigation
  trade_dispute_resolution: number;           // Trade dispute resolution and conflict mediation
  
  // Economic Integration & Development
  economic_integration_depth: number;         // Economic integration depth and market unification
  trade_infrastructure_investment: number;    // Trade infrastructure investment and development
  small_trader_support: number;               // Small trader support and market accessibility
  
  // Innovation & Technology Adoption
  trade_technology_adoption: number;          // Trade technology adoption and digital transformation
  automated_trading_systems: number;          // Automated trading systems and algorithmic commerce
  blockchain_trade_verification: number;      // Blockchain trade verification and transparency
}

export interface TradeState {
  campaignId: string;
  civilizationId: string;
  currentStep: number;
  
  // Market State
  marketIndices: {
    galacticTradeIndex: number;
    commodityIndex: number;
    shippingIndex: number;
    volatilityIndex: number;
    volumeIndex: number;
  };
  
  // Trade Infrastructure
  tradeRoutes: TradeRoute[];
  activeContracts: TradeContract[];
  tradingPartners: string[];
  
  // Economic Metrics
  tradeBalance: number;
  totalTradeVolume: number;
  averageTransactionValue: number;
  
  // Performance Indicators
  routeEfficiency: number;
  marketStability: number;
  tradingReputation: number;
  
  lastUpdated: Date;
}

export class TradeSimulationIntegration extends EventEmitter {
  private pool: Pool;
  private tradeEngine: TradeEngine;
  private activeSimulations: Map<string, TradeState> = new Map();
  private knobStates: Map<string, TradeKnobs> = new Map();
  private simulationHistory: Map<string, TradeState[]> = new Map();

  constructor(pool: Pool) {
    super();
    this.pool = pool;
    this.tradeEngine = new TradeEngine();
  }

  /**
   * Register a civilization for trade simulation
   */
  async registerCivilization(campaignId: string, civilizationId: string): Promise<void> {
    const key = `campaign-${campaignId}-civ-${civilizationId}`;
    
    // Initialize trade state
    const initialState: TradeState = {
      campaignId,
      civilizationId,
      currentStep: 0,
      marketIndices: {
        galacticTradeIndex: 2500 + Math.random() * 1000,
        commodityIndex: 1200 + Math.random() * 600,
        shippingIndex: 800 + Math.random() * 400,
        volatilityIndex: 0.15 + Math.random() * 0.2,
        volumeIndex: 100000 + Math.random() * 50000
      },
      tradeRoutes: [],
      activeContracts: [],
      tradingPartners: [
        'Terran Federation',
        'Vega Alliance', 
        'Centauri Republic',
        'Andromeda Empire',
        'Orion Collective'
      ],
      tradeBalance: 0,
      totalTradeVolume: 0,
      averageTransactionValue: 0,
      routeEfficiency: 0.75 + Math.random() * 0.2,
      marketStability: 0.8 + Math.random() * 0.15,
      tradingReputation: 0.7 + Math.random() * 0.25,
      lastUpdated: new Date()
    };

    this.activeSimulations.set(key, initialState);

    // Initialize default knob states
    const defaultKnobs: TradeKnobs = {
      trade_route_efficiency: 0.8,
      transportation_cost_optimization: 0.7,
      trade_volume_capacity: 0.8,
      market_price_volatility: 0.6,
      supply_demand_responsiveness: 0.8,
      price_discovery_efficiency: 0.7,
      resource_availability_stability: 0.7,
      resource_quality_standards: 0.8,
      strategic_resource_prioritization: 0.8,
      international_trade_facilitation: 0.7,
      trade_agreement_negotiation: 0.7,
      customs_efficiency: 0.8,
      trade_route_security: 0.8,
      cargo_insurance_coverage: 0.7,
      trade_dispute_resolution: 0.7,
      economic_integration_depth: 0.7,
      trade_infrastructure_investment: 0.8,
      small_trader_support: 0.6,
      trade_technology_adoption: 0.7,
      automated_trading_systems: 0.6,
      blockchain_trade_verification: 0.6
    };

    this.knobStates.set(civilizationId, defaultKnobs);

    console.log(`🚀 Trade simulation registered for campaign ${campaignId}, civilization ${civilizationId}`);
  }

  /**
   * Get current simulation state
   */
  getSimulationState(civilizationId: string): TradeState | undefined {
    const key = Object.keys(this.activeSimulations).find(k => k.includes(`civ-${civilizationId}`));
    return key ? this.activeSimulations.get(key) : undefined;
  }

  /**
   * Run orchestrator simulation for trade
   */
  async runOrchestratorSimulation(data: {
    civilization_id: string;
    knobs: TradeKnobs;
  }): Promise<{
    market_dynamics: any;
    trade_performance: any;
    route_efficiency: any;
    economic_impact: any;
    risk_assessment: any;
    growth_opportunities: any;
    recommendations: string[];
  }> {
    const { civilization_id, knobs } = data;
    const state = this.getSimulationState(civilization_id);
    
    if (!state) {
      throw new Error(`No trade simulation state found for civilization ${civilization_id}`);
    }

    // Update knob states
    this.knobStates.set(civilization_id, knobs);

    // Run market dynamics simulation
    const marketDynamics = this.simulateMarketDynamics(state, knobs);
    
    // Run trade performance simulation
    const tradePerformance = this.simulateTradePerformance(state, knobs);
    
    // Run route efficiency simulation
    const routeEfficiency = this.simulateRouteEfficiency(state, knobs);
    
    // Calculate economic impact
    const economicImpact = this.calculateEconomicImpact(state, knobs);
    
    // Calculate risk assessment
    const riskAssessment = this.calculateRiskAssessment(state, knobs);
    
    // Identify growth opportunities
    const growthOpportunities = this.identifyGrowthOpportunities(state, knobs);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(state, knobs);

    // Update state
    state.currentStep++;
    state.lastUpdated = new Date();
    this.activeSimulations.set(`campaign-${state.campaignId}-civ-${state.civilizationId}`, state);

    return {
      market_dynamics: marketDynamics,
      trade_performance: tradePerformance,
      route_efficiency: routeEfficiency,
      economic_impact: economicImpact,
      risk_assessment: riskAssessment,
      growth_opportunities: growthOpportunities,
      recommendations
    };
  }

  /**
   * Simulate market dynamics
   */
  private simulateMarketDynamics(state: TradeState, knobs: TradeKnobs): any {
    const volatilityFactor = knobs.market_price_volatility;
    const stabilityFactor = knobs.resource_availability_stability;
    const efficiencyFactor = knobs.price_discovery_efficiency;

    // Update market indices based on knobs
    const marketChange = (Math.random() - 0.5) * volatilityFactor * 0.1;
    state.marketIndices.galacticTradeIndex *= (1 + marketChange);
    state.marketIndices.commodityIndex *= (1 + marketChange * 0.8);
    state.marketIndices.shippingIndex *= (1 + marketChange * 0.6);
    state.marketIndices.volatilityIndex = Math.max(0.05, Math.min(0.5, 
      state.marketIndices.volatilityIndex + (Math.random() - 0.5) * 0.05));

    return {
      indices: state.marketIndices,
      stability_score: stabilityFactor * 100,
      efficiency_score: efficiencyFactor * 100,
      market_sentiment: marketChange > 0 ? 'bullish' : marketChange < -0.02 ? 'bearish' : 'neutral',
      trading_volume_trend: knobs.trade_volume_capacity * 100,
      price_discovery_rating: efficiencyFactor * 100
    };
  }

  /**
   * Simulate trade performance
   */
  private simulateTradePerformance(state: TradeState, knobs: TradeKnobs): any {
    const routeEfficiency = knobs.trade_route_efficiency;
    const volumeCapacity = knobs.trade_volume_capacity;
    const facilitation = knobs.international_trade_facilitation;

    // Calculate performance metrics
    const baseVolume = 1000000;
    state.totalTradeVolume = baseVolume * volumeCapacity * (0.8 + Math.random() * 0.4);
    state.averageTransactionValue = 50000 * (0.7 + routeEfficiency * 0.6);
    state.tradeBalance = state.totalTradeVolume * (Math.random() - 0.4) * 0.1;

    return {
      total_volume: state.totalTradeVolume,
      average_transaction: state.averageTransactionValue,
      trade_balance: state.tradeBalance,
      route_utilization: routeEfficiency * 100,
      facilitation_score: facilitation * 100,
      growth_rate: (volumeCapacity - 0.5) * 20,
      partner_satisfaction: (facilitation + routeEfficiency) * 50
    };
  }

  /**
   * Simulate route efficiency
   */
  private simulateRouteEfficiency(state: TradeState, knobs: TradeKnobs): any {
    const routeEfficiency = knobs.trade_route_efficiency;
    const costOptimization = knobs.transportation_cost_optimization;
    const security = knobs.trade_route_security;

    state.routeEfficiency = routeEfficiency * (0.8 + Math.random() * 0.4);

    return {
      overall_efficiency: state.routeEfficiency * 100,
      cost_optimization: costOptimization * 100,
      security_rating: security * 100,
      delivery_reliability: (routeEfficiency + security) * 50,
      transit_time_reduction: costOptimization * 30,
      route_coverage: Math.min(100, state.tradingPartners.length * 20)
    };
  }

  /**
   * Calculate economic impact
   */
  private calculateEconomicImpact(state: TradeState, knobs: TradeKnobs): any {
    const integrationDepth = knobs.economic_integration_depth;
    const infrastructureInvestment = knobs.trade_infrastructure_investment;
    const smallTraderSupport = knobs.small_trader_support;

    const gdpImpact = (state.totalTradeVolume / 10000000) * integrationDepth;
    const employmentImpact = infrastructureInvestment * 50000;
    const innovationIndex = (knobs.trade_technology_adoption + knobs.automated_trading_systems) * 50;

    return {
      gdp_contribution: gdpImpact,
      employment_created: employmentImpact,
      innovation_index: innovationIndex,
      infrastructure_score: infrastructureInvestment * 100,
      sme_participation: smallTraderSupport * 100,
      economic_multiplier: integrationDepth * 2.5
    };
  }

  /**
   * Calculate risk assessment
   */
  private calculateRiskAssessment(state: TradeState, knobs: TradeKnobs): any {
    const security = knobs.trade_route_security;
    const insurance = knobs.cargo_insurance_coverage;
    const disputeResolution = knobs.trade_dispute_resolution;
    const volatility = state.marketIndices.volatilityIndex;

    return {
      overall_risk_score: Math.max(0, 100 - (security + insurance + disputeResolution) * 33.33),
      security_risk: Math.max(0, 100 - security * 100),
      market_volatility_risk: volatility * 100,
      insurance_coverage: insurance * 100,
      dispute_resolution_capability: disputeResolution * 100,
      risk_mitigation_score: (security + insurance + disputeResolution) * 33.33
    };
  }

  /**
   * Identify growth opportunities
   */
  private identifyGrowthOpportunities(state: TradeState, knobs: TradeKnobs): any {
    const technologyAdoption = knobs.trade_technology_adoption;
    const automatedSystems = knobs.automated_trading_systems;
    const blockchainVerification = knobs.blockchain_trade_verification;

    return {
      technology_opportunities: technologyAdoption * 100,
      automation_potential: automatedSystems * 100,
      blockchain_adoption: blockchainVerification * 100,
      new_market_potential: Math.min(100, (5 - state.tradingPartners.length) * 25),
      efficiency_gains: (1 - state.routeEfficiency) * 100,
      volume_expansion: (1 - knobs.trade_volume_capacity) * 100
    };
  }

  /**
   * Generate AI-powered recommendations
   */
  private generateRecommendations(state: TradeState, knobs: TradeKnobs): string[] {
    const recommendations: string[] = [];

    // Route efficiency recommendations
    if (knobs.trade_route_efficiency < 0.7) {
      recommendations.push("🚀 Optimize trade routes by implementing advanced logistics algorithms and real-time traffic management systems.");
    }

    // Market volatility recommendations
    if (state.marketIndices.volatilityIndex > 0.3) {
      recommendations.push("📊 Implement market stabilization mechanisms and diversify trading portfolios to reduce volatility exposure.");
    }

    // Technology adoption recommendations
    if (knobs.trade_technology_adoption < 0.6) {
      recommendations.push("🤖 Accelerate digital transformation with AI-powered trading platforms and automated contract management.");
    }

    // Security recommendations
    if (knobs.trade_route_security < 0.8) {
      recommendations.push("🛡️ Strengthen trade route security with enhanced patrol fleets and advanced threat detection systems.");
    }

    // Infrastructure recommendations
    if (knobs.trade_infrastructure_investment < 0.7) {
      recommendations.push("🏗️ Increase investment in trade infrastructure including spaceports, cargo facilities, and communication networks.");
    }

    // Small trader support recommendations
    if (knobs.small_trader_support < 0.7) {
      recommendations.push("🤝 Develop programs to support small and medium traders with financing, training, and market access initiatives.");
    }

    return recommendations;
  }

  /**
   * Process simulation tick
   */
  async processTick(campaignId: string, civilizationId: string): Promise<void> {
    const state = this.getSimulationState(civilizationId);
    const knobs = this.knobStates.get(civilizationId);

    if (!state || !knobs) {
      return;
    }

    try {
      const results = await this.runOrchestratorSimulation({
        civilization_id: civilizationId,
        knobs
      });

      // Store historical data
      const history = this.simulationHistory.get(civilizationId) || [];
      history.push({ ...state });
      if (history.length > 100) { // Keep last 100 ticks
        history.shift();
      }
      this.simulationHistory.set(civilizationId, history);

      // Emit events for other systems
      this.emit('tradeSimulationUpdate', {
        campaignId,
        civilizationId,
        results,
        state
      });

    } catch (error) {
      console.error(`Trade simulation tick failed for civilization ${civilizationId}:`, error);
    }
  }

  /**
   * Get historical data for analytics
   */
  getHistoricalData(civilizationId: string, steps: number = 50): TradeState[] {
    const history = this.simulationHistory.get(civilizationId) || [];
    return history.slice(-steps);
  }

  /**
   * Update knob values
   */
  updateKnobs(civilizationId: string, knobUpdates: Partial<TradeKnobs>): void {
    const currentKnobs = this.knobStates.get(civilizationId);
    if (currentKnobs) {
      const updatedKnobs = { ...currentKnobs, ...knobUpdates };
      this.knobStates.set(civilizationId, updatedKnobs);
      
      console.log(`🔧 Trade knobs updated for civilization ${civilizationId}:`, knobUpdates);
    }
  }

  /**
   * Get current knob states
   */
  getKnobStates(civilizationId: string): TradeKnobs | undefined {
    return this.knobStates.get(civilizationId);
  }
}
