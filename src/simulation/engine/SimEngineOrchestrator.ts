/**
 * Sim Engine Orchestrator
 * Central coordination system for AI-driven simulation with knob integration
 */

import { Pool } from 'pg';
import { EventEmitter } from 'events';
import { GovernmentTypesKnobs, GOVERNMENT_TYPES_AI_PROMPTS } from '../governance/governmentTypesKnobs';
import { GovernmentContractsKnobs, GOVERNMENT_CONTRACTS_AI_PROMPTS } from '../governance/governmentContractsKnobs';
import { SovereignWealthFundSimulation } from './systems/sovereignWealthFundSimulation.js';
import { CentralBankEnhancedSimulation } from './systems/centralBankEnhancedSimulation.js';
// import { GovernmentBondsSimulationIntegration } from '../government-bonds/GovernmentBondsSimulationIntegration.js';
// import { PlanetaryGovernmentSimulationIntegration } from '../planetary-government/PlanetaryGovernmentSimulationIntegration.js';
// import { InstitutionalOverrideSimulationIntegration } from '../institutional-override/InstitutionalOverrideSimulationIntegration.js';
import { MediaControlService } from '../media-control/MediaControlService.js';
import { GalaxySimulationIntegration } from '../galaxy/GalaxySimulationIntegration.js';
import { SpatialIntelligenceIntegration } from '../characters/SpatialIntelligenceIntegration.js';
import { EntertainmentTourismSimulationIntegration } from '../entertainment-tourism/EntertainmentTourismSimulationIntegration.js';
import { TradeSimulationIntegration } from '../trade/TradeSimulationIntegration.js';
import { EnhancedKnobsIntegration } from './EnhancedKnobsIntegration.js';

export interface SimulationContext {
  campaignId: string;
  civilizationId: string;
  playerId: string;
  gameState: any;
  timestamp: Date;
}

export interface KnobAdjustment {
  apiName: string;
  knobName: string;
  oldValue: number;
  newValue: number;
  reason: string;
  confidence: number; // 0-1
  expectedImpact: string;
}

export interface SimulationEvent {
  id: string;
  type: 'government_crisis' | 'economic_shift' | 'contract_performance' | 'stability_change' | 'media_event' | 'press_conference' | 'custom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedSystems: string[];
  recommendedKnobAdjustments: KnobAdjustment[];
  timestamp: Date;
}

export interface PerformanceMetrics {
  apiName: string;
  knobName: string;
  effectiveness: number; // 0-1
  stabilityImpact: number; // -1 to 1
  economicImpact: number; // -1 to 1
  socialImpact: number; // -1 to 1
  lastUpdated: Date;
  sampleSize: number;
}

export class SimEngineOrchestrator extends EventEmitter {
  private pool: Pool;
  private activeSimulations: Map<string, SimulationContext> = new Map();
  private knobStates: Map<string, Map<string, number>> = new Map(); // civilizationId -> knobName -> value
  private performanceHistory: Map<string, PerformanceMetrics[]> = new Map();
  private simulationInterval: NodeJS.Timeout | null = null;
  private swfSimulation: SovereignWealthFundSimulation;
  private cbEnhancedSimulation: CentralBankEnhancedSimulation;
  // private bondsSimulation: GovernmentBondsSimulationIntegration;
  // private planetaryGovernmentSimulation: PlanetaryGovernmentSimulationIntegration;
  // private institutionalOverrideSimulation: InstitutionalOverrideSimulationIntegration;
  private mediaControlService: MediaControlService;
  private galaxySimulation: GalaxySimulationIntegration;
  private spatialIntelligence: SpatialIntelligenceIntegration;
  private entertainmentTourismSimulation: EntertainmentTourismSimulationIntegration;
  private tradeSimulation: TradeSimulationIntegration;
  private enhancedKnobsIntegration: EnhancedKnobsIntegration;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
    this.swfSimulation = new SovereignWealthFundSimulation(pool);
    this.cbEnhancedSimulation = new CentralBankEnhancedSimulation(pool);
    // this.bondsSimulation = new GovernmentBondsSimulationIntegration(pool);
    // this.planetaryGovernmentSimulation = new PlanetaryGovernmentSimulationIntegration(pool);
    // this.institutionalOverrideSimulation = new InstitutionalOverrideSimulationIntegration(pool);
    this.mediaControlService = new MediaControlService(pool);
    this.galaxySimulation = new GalaxySimulationIntegration(pool);
    this.spatialIntelligence = new SpatialIntelligenceIntegration(pool);
    this.entertainmentTourismSimulation = new EntertainmentTourismSimulationIntegration(pool);
    this.tradeSimulation = new TradeSimulationIntegration(pool);
    this.enhancedKnobsIntegration = new EnhancedKnobsIntegration(pool);
    this.startSimulationLoop();
  }

  /**
   * Register a civilization for AI simulation
   */
  async registerCivilization(context: SimulationContext): Promise<void> {
    const key = `${context.campaignId}-${context.civilizationId}`;
    this.activeSimulations.set(key, context);
    
    // Initialize knob states if not exists
    if (!this.knobStates.has(context.civilizationId)) {
      await this.initializeKnobStates(context.civilizationId);
    }

    // Register with galaxy simulation
    await this.galaxySimulation.registerCivilization(context.campaignId, context.civilizationId);

    // Register key characters for spatial intelligence
    await this.registerCivilizationCharacters(context.civilizationId);

    // Register with entertainment/tourism simulation
    await this.entertainmentTourismSimulation.registerCivilization(context.campaignId, context.civilizationId);

    // Register with trade simulation
    await this.tradeSimulation.registerCivilization(context.campaignId, context.civilizationId);

    // Initialize enhanced knobs for this civilization
    await this.enhancedKnobsIntegration.initializeCivilizationKnobs(context.campaignId, context.civilizationId);

    console.log(`🤖 Registered civilization ${context.civilizationId} for AI simulation`);
    this.emit('civilizationRegistered', context);
  }

  /**
   * Register key characters for a civilization
   */
  private async registerCivilizationCharacters(civilizationId: string): Promise<void> {
    const basePosition = {
      systemId: `${civilizationId}_home_system`,
      coordinates: {
        x: Math.floor(Math.random() * 1000),
        y: Math.floor(Math.random() * 1000),
        z: Math.floor(Math.random() * 100)
      }
    };

    // Register key character roles for spatial intelligence
    const characterRoles = [
      'military_commander',
      'intelligence_officer',
      'trade_executive',
      'explorer',
      'diplomat',
      'scientist'
    ];

    for (const role of characterRoles) {
      const characterId = `${civilizationId}_${role}`;
      const position = {
        ...basePosition,
        coordinates: {
          x: basePosition.coordinates.x + (Math.random() - 0.5) * 50,
          y: basePosition.coordinates.y + (Math.random() - 0.5) * 50,
          z: basePosition.coordinates.z + (Math.random() - 0.5) * 10
        }
      };

      await this.spatialIntelligence.registerCharacter(characterId, role, position);
    }

    console.log(`👥 Registered ${characterRoles.length} characters for civilization ${civilizationId}`);
  }

  /**
   * Initialize default knob states for a civilization
   */
  private async initializeKnobStates(civilizationId: string): Promise<void> {
    const knobStates = new Map<string, number>();
    
    // Initialize Government Types knobs
    const govKnobs = await this.getDefaultGovernmentKnobs(civilizationId);
    Object.entries(govKnobs).forEach(([knobName, value]) => {
      knobStates.set(`government-types.${knobName}`, value);
    });

    // Initialize Government Contracts knobs
    const contractKnobs = await this.getDefaultContractKnobs(civilizationId);
    Object.entries(contractKnobs).forEach(([knobName, value]) => {
      knobStates.set(`government-contracts.${knobName}`, value);
    });

    // Initialize Media Control knobs
    const mediaKnobs = await this.getDefaultMediaControlKnobs(civilizationId);
    Object.entries(mediaKnobs).forEach(([knobName, value]) => {
      knobStates.set(`media-control.${knobName}`, value);
    });

    this.knobStates.set(civilizationId, knobStates);
    console.log(`🎛️ Initialized ${knobStates.size} knobs for civilization ${civilizationId}`);
  }

  /**
   * Get default government knobs based on current government type
   */
  private async getDefaultGovernmentKnobs(civilizationId: string): Promise<GovernmentTypesKnobs> {
    try {
      // In a real implementation, fetch from database
      // For now, return defaults
      const { DEFAULT_GOVERNMENT_TYPES_KNOBS } = await import('../governance/governmentTypesKnobs');
      return DEFAULT_GOVERNMENT_TYPES_KNOBS;
    } catch (error) {
      console.error('Error getting default government knobs:', error);
      return {} as GovernmentTypesKnobs;
    }
  }

  /**
   * Get default contract knobs
   */
  private async getDefaultContractKnobs(civilizationId: string): Promise<GovernmentContractsKnobs> {
    try {
      const { DEFAULT_GOVERNMENT_CONTRACTS_KNOBS } = await import('../governance/governmentContractsKnobs');
      return DEFAULT_GOVERNMENT_CONTRACTS_KNOBS;
    } catch (error) {
      console.error('Error getting default contract knobs:', error);
      return {} as GovernmentContractsKnobs;
    }
  }

  /**
   * Get default media control knobs
   */
  private async getDefaultMediaControlKnobs(civilizationId: string): Promise<any> {
    try {
      // Get knobs from the media control service
      const knobs = await this.mediaControlService.getMediaControlKnobs(parseInt(civilizationId));
      return {
        press_freedom_level: knobs.pressFreedomLevel || 0.75,
        censorship_intensity: knobs.censorshipIntensity || 0.25,
        government_media_influence: knobs.governmentMediaInfluence || 0.30,
        propaganda_effectiveness: knobs.propagandaEffectiveness || 0.50,
        information_transparency: knobs.informationTransparency || 0.70,
        journalist_safety_protection: knobs.journalistSafetyProtection || 0.80,
        editorial_independence: knobs.editorialIndependence || 0.65,
        content_diversity_promotion: knobs.contentDiversityPromotion || 0.60,
        fact_checking_enforcement: knobs.factCheckingEnforcement || 0.70,
        misinformation_countermeasures: knobs.misinformationCountermeasures || 0.55,
        investigative_journalism_support: knobs.investigativeJournalismSupport || 0.50,
        public_interest_prioritization: knobs.publicInterestPrioritization || 0.60,
        licensing_strictness: knobs.licensingStrictness || 0.40,
        ownership_concentration_limits: knobs.ownershipConcentrationLimits || 0.50,
        foreign_media_restrictions: knobs.foreignMediaRestrictions || 0.30,
        media_funding_transparency: knobs.mediaFundingTransparency || 0.65,
        regulatory_enforcement_consistency: knobs.regulatoryEnforcementConsistency || 0.70,
        appeal_process_fairness: knobs.appealProcessFairness || 0.75,
        emergency_broadcast_authority: knobs.emergencyBroadcastAuthority || 0.60,
        crisis_information_control: knobs.crisisInformationControl || 0.45,
        national_security_exemptions: knobs.nationalSecurityExemptions || 0.40,
        wartime_media_restrictions: knobs.wartimeMediaRestrictions || 0.35,
        public_safety_override_authority: knobs.publicSafetyOverrideAuthority || 0.50,
        international_media_coordination: knobs.internationalMediaCoordination || 0.45,
        press_conference_frequency: knobs.pressConferenceFrequency || 0.60,
        leader_personal_appearance_rate: knobs.leaderPersonalAppearanceRate || 0.40,
        press_access_level: knobs.pressAccessLevel || 0.70,
        question_screening_intensity: knobs.questionScreeningIntensity || 0.30,
        hostile_question_management: knobs.hostileQuestionManagement || 0.50,
        message_coordination_effectiveness: knobs.messageCoordinationEffectiveness || 0.65
      };
    } catch (error) {
      console.error('Error getting default media control knobs:', error);
      // Return default values
      return {
        press_freedom_level: 0.75,
        censorship_intensity: 0.25,
        government_media_influence: 0.30,
        propaganda_effectiveness: 0.50,
        information_transparency: 0.70,
        journalist_safety_protection: 0.80,
        editorial_independence: 0.65,
        content_diversity_promotion: 0.60,
        fact_checking_enforcement: 0.70,
        misinformation_countermeasures: 0.55,
        investigative_journalism_support: 0.50,
        public_interest_prioritization: 0.60,
        licensing_strictness: 0.40,
        ownership_concentration_limits: 0.50,
        foreign_media_restrictions: 0.30,
        media_funding_transparency: 0.65,
        regulatory_enforcement_consistency: 0.70,
        appeal_process_fairness: 0.75,
        emergency_broadcast_authority: 0.60,
        crisis_information_control: 0.45,
        national_security_exemptions: 0.40,
        wartime_media_restrictions: 0.35,
        public_safety_override_authority: 0.50,
        international_media_coordination: 0.45,
        press_conference_frequency: 0.60,
        leader_personal_appearance_rate: 0.40,
        press_access_level: 0.70,
        question_screening_intensity: 0.30,
        hostile_question_management: 0.50,
        message_coordination_effectiveness: 0.65
      };
    }
  }

  /**
   * Adjust knob values based on AI analysis
   */
  async adjustKnob(
    civilizationId: string,
    apiName: string,
    knobName: string,
    newValue: number,
    reason: string,
    confidence: number = 0.8
  ): Promise<KnobAdjustment> {
    const knobKey = `${apiName}.${knobName}`;
    const civilizationKnobs = this.knobStates.get(civilizationId);
    
    if (!civilizationKnobs) {
      throw new Error(`Civilization ${civilizationId} not registered for simulation`);
    }

    const oldValue = civilizationKnobs.get(knobKey) || 0;
    
    // Validate new value
    const clampedValue = Math.max(0, Math.min(100, newValue));
    
    // Create adjustment record
    const adjustment: KnobAdjustment = {
      apiName,
      knobName,
      oldValue,
      newValue: clampedValue,
      reason,
      confidence,
      expectedImpact: this.predictImpact(apiName, knobName, oldValue, clampedValue)
    };

    // Apply the change
    civilizationKnobs.set(knobKey, clampedValue);
    
    // Log the adjustment
    console.log(`🎛️ Knob adjusted: ${knobKey} ${oldValue} → ${clampedValue} (${reason})`);
    
    // Emit event for real-time updates
    this.emit('knobAdjusted', {
      civilizationId,
      adjustment,
      timestamp: new Date()
    });

    // Store in database for persistence
    await this.storeKnobAdjustment(civilizationId, adjustment);

    return adjustment;
  }

  /**
   * Predict the impact of a knob adjustment
   */
  private predictImpact(apiName: string, knobName: string, oldValue: number, newValue: number): string {
    const delta = newValue - oldValue;
    const magnitude = Math.abs(delta);
    
    if (magnitude < 5) return 'Minimal impact expected';
    if (magnitude < 15) return 'Moderate impact expected';
    if (magnitude < 30) return 'Significant impact expected';
    return 'Major impact expected';
  }

  /**
   * Analyze current situation and recommend knob adjustments
   */
  async analyzeAndRecommend(civilizationId: string): Promise<KnobAdjustment[]> {
    const context = Array.from(this.activeSimulations.values())
      .find(ctx => ctx.civilizationId === civilizationId);
    
    if (!context) {
      throw new Error(`Civilization ${civilizationId} not found in active simulations`);
    }

    const recommendations: KnobAdjustment[] = [];
    
    // Analyze government stability
    const govRecommendations = await this.analyzeGovernmentStability(context);
    recommendations.push(...govRecommendations);
    
    // Analyze contract performance
    const contractRecommendations = await this.analyzeContractPerformance(context);
    recommendations.push(...contractRecommendations);
    
    // Analyze sovereign wealth fund performance
    const swfRecommendations = await this.analyzeSovereignWealthFund(context);
    recommendations.push(...swfRecommendations);
    
    // Analyze central bank enhanced operations
    const cbEnhancedRecommendations = await this.analyzeCentralBankEnhanced(context);
    recommendations.push(...cbEnhancedRecommendations);

    return recommendations;
  }

  /**
   * Analyze government stability and recommend adjustments
   */
  private async analyzeGovernmentStability(context: SimulationContext): Promise<KnobAdjustment[]> {
    const recommendations: KnobAdjustment[] = [];
    
    try {
      // Get current government metrics (mock data for now)
      const legitimacy = 75;
      const stability = 68;
      const publicSatisfaction = 72;
      
      // Check for instability
      if (legitimacy < 70) {
        recommendations.push({
          apiName: 'government-types',
          knobName: 'legitimacyDecayRate',
          oldValue: this.getKnobValue(context.civilizationId, 'government-types', 'legitimacyDecayRate'),
          newValue: Math.max(1, this.getKnobValue(context.civilizationId, 'government-types', 'legitimacyDecayRate') - 10),
          reason: 'Reducing legitimacy decay due to low legitimacy score',
          confidence: 0.85,
          expectedImpact: 'Should help stabilize government legitimacy'
        });
      }

      if (stability < 70) {
        recommendations.push({
          apiName: 'government-types',
          knobName: 'stabilityVolatility',
          oldValue: this.getKnobValue(context.civilizationId, 'government-types', 'stabilityVolatility'),
          newValue: Math.max(5, this.getKnobValue(context.civilizationId, 'government-types', 'stabilityVolatility') - 5),
          reason: 'Reducing stability volatility due to low stability',
          confidence: 0.75,
          expectedImpact: 'Should reduce government instability'
        });
      }

      if (publicSatisfaction < 65) {
        recommendations.push({
          apiName: 'government-types',
          knobName: 'popularSupportWeight',
          oldValue: this.getKnobValue(context.civilizationId, 'government-types', 'popularSupportWeight'),
          newValue: Math.min(90, this.getKnobValue(context.civilizationId, 'government-types', 'popularSupportWeight') + 10),
          reason: 'Increasing popular support weight due to low satisfaction',
          confidence: 0.70,
          expectedImpact: 'Should make government more responsive to public opinion'
        });
      }

    } catch (error) {
      console.error('Error analyzing government stability:', error);
    }

    return recommendations;
  }

  /**
   * Analyze contract performance and recommend adjustments
   */
  private async analyzeContractPerformance(context: SimulationContext): Promise<KnobAdjustment[]> {
    const recommendations: KnobAdjustment[] = [];
    
    try {
      // Get current contract metrics (mock data for now)
      const avgSchedulePerformance = 78;
      const avgCostPerformance = 82;
      const avgQualityRating = 75;
      
      // Check for poor performance
      if (avgSchedulePerformance < 80) {
        recommendations.push({
          apiName: 'government-contracts',
          knobName: 'scheduleComplianceWeight',
          oldValue: this.getKnobValue(context.civilizationId, 'government-contracts', 'scheduleComplianceWeight'),
          newValue: Math.min(90, this.getKnobValue(context.civilizationId, 'government-contracts', 'scheduleComplianceWeight') + 10),
          reason: 'Increasing schedule compliance weight due to poor performance',
          confidence: 0.80,
          expectedImpact: 'Should improve contract schedule adherence'
        });
      }

      if (avgCostPerformance < 85) {
        recommendations.push({
          apiName: 'government-contracts',
          knobName: 'costOverrunTolerance',
          oldValue: this.getKnobValue(context.civilizationId, 'government-contracts', 'costOverrunTolerance'),
          newValue: Math.max(10, this.getKnobValue(context.civilizationId, 'government-contracts', 'costOverrunTolerance') - 5),
          reason: 'Reducing cost overrun tolerance due to budget issues',
          confidence: 0.75,
          expectedImpact: 'Should tighten budget control'
        });
      }

      if (avgQualityRating < 80) {
        recommendations.push({
          apiName: 'government-contracts',
          knobName: 'qualityStandardStrictness',
          oldValue: this.getKnobValue(context.civilizationId, 'government-contracts', 'qualityStandardStrictness'),
          newValue: Math.min(95, this.getKnobValue(context.civilizationId, 'government-contracts', 'qualityStandardStrictness') + 10),
          reason: 'Increasing quality standards due to poor ratings',
          confidence: 0.85,
          expectedImpact: 'Should improve contract quality outcomes'
        });
      }

    } catch (error) {
      console.error('Error analyzing contract performance:', error);
    }

    return recommendations;
  }

  /**
   * Analyze sovereign wealth fund performance and recommend adjustments
   */
  private async analyzeSovereignWealthFund(context: SimulationContext): Promise<KnobAdjustment[]> {
    const recommendations: KnobAdjustment[] = [];
    
    try {
      // Get current SWF knob values
      const knobs = {
        equity_allocation_target: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'equity_allocation_target') || 40,
        fixed_income_allocation: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'fixed_income_allocation') || 30,
        infrastructure_allocation: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'infrastructure_allocation') || 20,
        alternative_investments: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'alternative_investments') || 10,
        domestic_investment_bias: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'domestic_investment_bias') || 70,
        foreign_investment_limit: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'foreign_investment_limit') || 30,
        currency_hedging_ratio: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'currency_hedging_ratio') || 50,
        esg_investment_minimum: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'esg_investment_minimum') || 25,
        maximum_single_holding: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'maximum_single_holding') || 5,
        liquidity_reserve_ratio: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'liquidity_reserve_ratio') || 15,
        volatility_tolerance: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'volatility_tolerance') || 6,
        credit_rating_minimum: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'credit_rating_minimum') || 6,
        sector_concentration_limit: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'sector_concentration_limit') || 20,
        geographic_diversification: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'geographic_diversification') || 5,
        currency_exposure_limit: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'currency_exposure_limit') || 40,
        leverage_ratio_maximum: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'leverage_ratio_maximum') || 10,
        target_annual_return: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'target_annual_return') || 7,
        benchmark_tracking_error: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'benchmark_tracking_error') || 2,
        rebalancing_frequency: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'rebalancing_frequency') || 4,
        tax_revenue_allocation: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'tax_revenue_allocation') || 15,
        resource_revenue_allocation: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'resource_revenue_allocation') || 40,
        central_bank_funding: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'central_bank_funding') || 10,
        bond_issuance_funding: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'bond_issuance_funding') || 20,
        withdrawal_rate_limit: this.getKnobValue(context.civilizationId, 'sovereign-wealth-fund', 'withdrawal_rate_limit') || 3
      };

      // Run SWF simulation
      const simulationResult = await this.swfSimulation.simulate({
        civilization_id: context.civilizationId,
        knobs
      });

      // Run Government Bonds simulation
      const bondsData = {
        civilizationId: context.civilizationId,
        knobSettings: knobs,
        marketConditions: {
          interestRates: 0.035,
          creditSpread: 0.002,
          demandLevel: 1.0,
          volatility: 0.1
        },
        bondPortfolio: {
          totalOutstanding: 1000000000,
          averageYield: 0.04,
          averageMaturity: 10,
          currencyExposure: { USC: 0.7, EUR: 0.2, GBP: 0.1 }
        }
      };
      
      const bondsSimulationResult = await this.bondsSimulation.runOrchestratorSimulation(bondsData);

      // Analyze results and generate recommendations
      if (simulationResult.fund_performance.total_return < knobs.target_annual_return) {
        recommendations.push({
          apiName: 'sovereign-wealth-fund',
          knobName: 'equity_allocation_target',
          oldValue: knobs.equity_allocation_target,
          newValue: Math.min(60, knobs.equity_allocation_target + 5),
          reason: 'Increasing equity allocation to meet return targets',
          confidence: 0.75,
          expectedImpact: 'Should increase expected returns but with higher volatility'
        });
      }

      if (simulationResult.risk_metrics.concentration_risk > 70) {
        recommendations.push({
          apiName: 'sovereign-wealth-fund',
          knobName: 'maximum_single_holding',
          oldValue: knobs.maximum_single_holding,
          newValue: Math.max(2, knobs.maximum_single_holding - 1),
          reason: 'Reducing concentration risk by limiting single holdings',
          confidence: 0.85,
          expectedImpact: 'Should improve portfolio diversification and reduce risk'
        });
      }

      if (simulationResult.risk_metrics.liquidity_risk > 60) {
        recommendations.push({
          apiName: 'sovereign-wealth-fund',
          knobName: 'liquidity_reserve_ratio',
          oldValue: knobs.liquidity_reserve_ratio,
          newValue: Math.min(30, knobs.liquidity_reserve_ratio + 5),
          reason: 'Increasing liquidity reserves due to elevated liquidity risk',
          confidence: 0.80,
          expectedImpact: 'Should improve fund liquidity but may reduce returns'
        });
      }

      if (simulationResult.fund_performance.sharpe_ratio < 0.5) {
        recommendations.push({
          apiName: 'sovereign-wealth-fund',
          knobName: 'volatility_tolerance',
          oldValue: knobs.volatility_tolerance,
          newValue: Math.max(3, knobs.volatility_tolerance - 1),
          reason: 'Reducing volatility tolerance due to poor risk-adjusted returns',
          confidence: 0.70,
          expectedImpact: 'Should improve risk-adjusted returns'
        });
      }

      // Currency risk management
      if (simulationResult.risk_metrics.currency_risk > 50) {
        recommendations.push({
          apiName: 'sovereign-wealth-fund',
          knobName: 'currency_hedging_ratio',
          oldValue: knobs.currency_hedging_ratio,
          newValue: Math.min(90, knobs.currency_hedging_ratio + 10),
          reason: 'Increasing currency hedging due to high foreign exposure',
          confidence: 0.75,
          expectedImpact: 'Should reduce currency risk but may increase hedging costs'
        });
      }

    } catch (error) {
      console.error('Error analyzing sovereign wealth fund:', error);
    }

    return recommendations;
  }

  /**
   * Analyze central bank enhanced operations and recommend adjustments
   */
  private async analyzeCentralBankEnhanced(context: SimulationContext): Promise<KnobAdjustment[]> {
    const recommendations: KnobAdjustment[] = [];
    
    try {
      // Get current Central Bank Enhanced knob values
      const knobs = {
        // Gold Reserve Management
        gold_reserve_target_ratio: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'gold_reserve_target_ratio') || 15,
        gold_acquisition_rate: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'gold_acquisition_rate') || 1.5,
        gold_price_volatility_buffer: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'gold_price_volatility_buffer') || 12,
        gold_storage_diversification: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'gold_storage_diversification') || 4,
        gold_quality_standard: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'gold_quality_standard') || 99.5,
        gold_liquidity_reserve: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'gold_liquidity_reserve') || 20,
        
        // Multi-Currency Management
        foreign_currency_exposure_limit: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'foreign_currency_exposure_limit') || 35,
        currency_diversification_target: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'currency_diversification_target') || 6,
        exchange_rate_intervention_threshold: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'exchange_rate_intervention_threshold') || 8,
        currency_swap_utilization: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'currency_swap_utilization') || 25,
        foreign_reserve_rebalancing_frequency: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'foreign_reserve_rebalancing_frequency') || 3,
        currency_hedging_ratio: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'currency_hedging_ratio') || 60,
        
        // Quantitative Easing
        qe_bond_purchase_rate: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'qe_bond_purchase_rate') || 5,
        qe_duration_target: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'qe_duration_target') || 24,
        qe_asset_class_diversification: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'qe_asset_class_diversification') || 4,
        qe_yield_curve_targeting: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'qe_yield_curve_targeting') || 2.5,
        qe_market_impact_threshold: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'qe_market_impact_threshold') || 15,
        qe_exit_strategy_trigger: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'qe_exit_strategy_trigger') || 4,
        
        // Money Supply & Interest Rates
        money_supply_growth_target: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'money_supply_growth_target') || 6,
        interest_rate_corridor_width: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'interest_rate_corridor_width') || 0.75,
        reserve_requirement_ratio: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'reserve_requirement_ratio') || 12,
        discount_window_penalty_rate: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'discount_window_penalty_rate') || 1.5,
        monetary_base_expansion_limit: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'monetary_base_expansion_limit') || 20,
        inflation_targeting_tolerance: this.getKnobValue(context.civilizationId, 'central-bank-enhanced', 'inflation_targeting_tolerance') || 1.5
      };

      // Run Central Bank Enhanced simulation
      const simulationResult = await this.cbEnhancedSimulation.simulate({
        civilization_id: context.civilizationId,
        knobs
      });

      // Analyze results and generate recommendations
      if (simulationResult.monetary_policy_effectiveness.inflation_control_score < 70) {
        recommendations.push({
          apiName: 'central-bank-enhanced',
          knobName: 'inflation_targeting_tolerance',
          oldValue: knobs.inflation_targeting_tolerance,
          newValue: Math.max(0.5, knobs.inflation_targeting_tolerance - 0.25),
          reason: 'Tightening inflation targeting to improve price stability',
          confidence: 0.80,
          expectedImpact: 'Should improve inflation control effectiveness'
        });
      }

      if (simulationResult.risk_metrics.currency_risk > 70) {
        recommendations.push({
          apiName: 'central-bank-enhanced',
          knobName: 'currency_hedging_ratio',
          oldValue: knobs.currency_hedging_ratio,
          newValue: Math.min(100, knobs.currency_hedging_ratio + 10),
          reason: 'Increasing currency hedging due to high foreign exchange risk',
          confidence: 0.85,
          expectedImpact: 'Should reduce currency volatility and risk exposure'
        });
      }

      if (simulationResult.reserve_management.gold_reserve_adequacy < 60) {
        recommendations.push({
          apiName: 'central-bank-enhanced',
          knobName: 'gold_reserve_target_ratio',
          oldValue: knobs.gold_reserve_target_ratio,
          newValue: Math.min(30, knobs.gold_reserve_target_ratio + 2),
          reason: 'Increasing gold reserves for better crisis resilience',
          confidence: 0.75,
          expectedImpact: 'Should improve reserve adequacy and financial stability'
        });
      }

      if (simulationResult.quantitative_easing_impact.market_liquidity_improvement > 90) {
        recommendations.push({
          apiName: 'central-bank-enhanced',
          knobName: 'qe_bond_purchase_rate',
          oldValue: knobs.qe_bond_purchase_rate,
          newValue: Math.max(1, knobs.qe_bond_purchase_rate - 1),
          reason: 'Reducing QE intensity to prevent asset bubble formation',
          confidence: 0.70,
          expectedImpact: 'Should moderate market liquidity and reduce bubble risk'
        });
      }

      if (simulationResult.monetary_policy_effectiveness.financial_stability_score < 65) {
        recommendations.push({
          apiName: 'central-bank-enhanced',
          knobName: 'reserve_requirement_ratio',
          oldValue: knobs.reserve_requirement_ratio,
          newValue: Math.min(20, knobs.reserve_requirement_ratio + 1),
          reason: 'Increasing reserve requirements to enhance financial stability',
          confidence: 0.75,
          expectedImpact: 'Should improve banking sector stability'
        });
      }

      // Interest rate corridor optimization
      if (simulationResult.risk_metrics.interest_rate_risk > 60) {
        recommendations.push({
          apiName: 'central-bank-enhanced',
          knobName: 'interest_rate_corridor_width',
          oldValue: knobs.interest_rate_corridor_width,
          newValue: Math.max(0.25, knobs.interest_rate_corridor_width - 0.1),
          reason: 'Narrowing interest rate corridor to reduce rate volatility',
          confidence: 0.80,
          expectedImpact: 'Should improve interest rate stability and predictability'
        });
      }

    } catch (error) {
      console.error('Error analyzing central bank enhanced operations:', error);
    }

    return recommendations;
  }

  /**
   * Get current knob value
   */
  private getKnobValue(civilizationId: string, apiName: string, knobName: string): number {
    const knobKey = `${apiName}.${knobName}`;
    const civilizationKnobs = this.knobStates.get(civilizationId);
    return civilizationKnobs?.get(knobKey) || 50; // Default to 50 if not found
  }

  /**
   * Main simulation loop - runs every 30 seconds
   */
  private startSimulationLoop(): void {
    this.simulationInterval = setInterval(async () => {
      try {
        await this.runSimulationCycle();
      } catch (error) {
        console.error('Error in simulation cycle:', error);
      }
    }, 120000); // 2 minutes (was 30 seconds)

    console.log('🤖 Sim Engine simulation loop started (2min intervals)');
  }

  /**
   * Run one simulation cycle for all active civilizations
   */
  private async runSimulationCycle(): Promise<void> {
    for (const [key, context] of this.activeSimulations) {
      try {
        // Analyze current situation
        const recommendations = await this.analyzeAndRecommend(context.civilizationId);
        
        if (recommendations.length > 0) {
          console.log(`🤖 Generated ${recommendations.length} recommendations for civilization ${context.civilizationId}`);
          
          // Apply high-confidence recommendations automatically
          for (const rec of recommendations) {
            if (rec.confidence > 0.8) {
              await this.adjustKnob(
                context.civilizationId,
                rec.apiName,
                rec.knobName,
                rec.newValue,
                `Auto-adjustment: ${rec.reason}`,
                rec.confidence
              );
            }
          }
          
          // Emit recommendations for manual review
          this.emit('recommendationsGenerated', {
            civilizationId: context.civilizationId,
            recommendations,
            timestamp: new Date()
          });
        }

        // Update performance metrics
        await this.updatePerformanceMetrics(context.civilizationId);

        // Run Planetary Government simulations for all planets in this civilization
        await this.runPlanetaryGovernmentSimulations(context.civilizationId);
        
        // Run Institutional Override simulations for pending overrides
        await this.runInstitutionalOverrideSimulations(context.civilizationId);

        // Run Media Control simulations
        await this.runMediaControlSimulations(context.civilizationId);

        // Run Entertainment/Tourism simulations
        await this.runEntertainmentTourismSimulations(context.civilizationId);

        // Run Trade simulations
        await this.runTradeSimulations(context.civilizationId);

      } catch (error) {
        console.error(`Error in simulation cycle for ${context.civilizationId}:`, error);
      }
    }
  }

  /**
   * Run Planetary Government simulations for all planets in a civilization
   */
  private async runPlanetaryGovernmentSimulations(civilizationId: string): Promise<void> {
    try {
      // Get all planetary governments for this civilization
      const result = await this.pool.query(
        'SELECT id FROM planetary_governments WHERE civilization_id = $1 AND government_status = $2',
        [civilizationId, 'active']
      );

      // Run orchestrator simulation for each planetary government
      for (const row of result.rows) {
        await this.planetaryGovernmentSimulation.runOrchestratorSimulation(row.id);
      }

      if (result.rows.length > 0) {
        console.log(`🌍 Completed planetary government simulations for ${result.rows.length} planets in civilization ${civilizationId}`);
      }
    } catch (error) {
      console.error(`❌ Error running planetary government simulations for civilization ${civilizationId}:`, error);
    }
  }

  /**
   * Run Institutional Override simulations for pending overrides in a civilization
   */
  private async runInstitutionalOverrideSimulations(civilizationId: string): Promise<void> {
    try {
      // Get all pending institutional overrides for this civilization
      const result = await this.pool.query(
        'SELECT id FROM institutional_overrides WHERE campaign_id IN (SELECT id FROM campaigns WHERE civilization_id = $1) AND status = $2',
        [civilizationId, 'pending']
      );

      // Run orchestrator simulation for each pending override
      for (const row of result.rows) {
        await this.institutionalOverrideSimulation.runOrchestratorSimulation(row.id);
      }

      if (result.rows.length > 0) {
        console.log(`⚖️ Completed institutional override simulations for ${result.rows.length} overrides in civilization ${civilizationId}`);
      }
    } catch (error) {
      console.error(`❌ Error running institutional override simulations for civilization ${civilizationId}:`, error);
    }
  }

  /**
   * Update performance metrics for knobs
   */
  private async updatePerformanceMetrics(civilizationId: string): Promise<void> {
    // This would calculate effectiveness based on game outcomes
    // For now, we'll use mock calculations
    const knobs = this.knobStates.get(civilizationId);
    if (!knobs) return;

    const metrics: PerformanceMetrics[] = [];
    
    for (const [knobKey, value] of knobs) {
      const [apiName, knobName] = knobKey.split('.');
      
      // Mock effectiveness calculation
      const effectiveness = Math.random() * 0.4 + 0.6; // 0.6-1.0
      const stabilityImpact = (Math.random() - 0.5) * 0.4; // -0.2 to 0.2
      const economicImpact = (Math.random() - 0.5) * 0.3; // -0.15 to 0.15
      const socialImpact = (Math.random() - 0.5) * 0.3; // -0.15 to 0.15
      
      metrics.push({
        apiName,
        knobName,
        effectiveness,
        stabilityImpact,
        economicImpact,
        socialImpact,
        lastUpdated: new Date(),
        sampleSize: Math.floor(Math.random() * 100) + 50
      });
    }

    this.performanceHistory.set(civilizationId, metrics);
  }

  /**
   * Store knob adjustment in database
   */
  private async storeKnobAdjustment(civilizationId: string, adjustment: KnobAdjustment): Promise<void> {
    try {
      await this.pool.query(`
        INSERT INTO knob_adjustments (
          civilization_id, api_name, knob_name, old_value, new_value, 
          reason, confidence, expected_impact, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT DO NOTHING
      `, [
        civilizationId,
        adjustment.apiName,
        adjustment.knobName,
        adjustment.oldValue,
        adjustment.newValue,
        adjustment.reason,
        adjustment.confidence,
        adjustment.expectedImpact,
        new Date()
      ]);
    } catch (error) {
      // Table might not exist yet, that's okay
      console.log('Note: knob_adjustments table not found (will be created later)');
    }
  }

  /**
   * Get performance metrics for a civilization
   */
  getPerformanceMetrics(civilizationId: string): PerformanceMetrics[] {
    return this.performanceHistory.get(civilizationId) || [];
  }

  /**
   * Get current knob states for a civilization
   */
  getKnobStates(civilizationId: string): Map<string, number> {
    return this.knobStates.get(civilizationId) || new Map();
  }

  /**
   * Run Media Control simulations
   */
  private async runMediaControlSimulations(civilizationId: string): Promise<void> {
    try {
      const campaignId = parseInt(civilizationId);
      
      // Get current media control knobs
      const knobStates = this.getKnobStates(civilizationId);
      const mediaKnobs: any = {};
      
      // Extract media control knobs
      for (const [knobKey, value] of knobStates) {
        if (knobKey.startsWith('media-control.')) {
          const knobName = knobKey.replace('media-control.', '');
          mediaKnobs[knobName] = value;
        }
      }
      
      // Update media control knobs in the service
      if (Object.keys(mediaKnobs).length > 0) {
        await this.mediaControlService.updateMediaControlKnobs(campaignId, mediaKnobs);
      }
      
      // Get press conferences and check for events
      const pressConferences = await this.mediaControlService.getPressConferences(campaignId);
      const recentConferences = pressConferences.filter(conf => 
        conf.status === 'completed' && 
        Date.now() - new Date(conf.updatedAt).getTime() < 300000 // Last 5 minutes
      );
      
      // Generate events for recent press conferences
      for (const conference of recentConferences) {
        const event: SimulationEvent = {
          id: `media_${conference.id}_${Date.now()}`,
          type: 'press_conference',
          severity: conference.politicalRisk > 0.6 ? 'high' : conference.politicalRisk > 0.3 ? 'medium' : 'low',
          description: `${conference.presenterType === 'leader_personal' ? 'Leader' : 'Press Secretary'} held press conference: ${conference.title}`,
          affectedSystems: ['media-control', 'government-approval', 'public-opinion'],
          recommendedKnobAdjustments: this.generateMediaKnobAdjustments(conference, mediaKnobs),
          timestamp: new Date()
        };
        
        this.emit('simulationEvent', event);
      }
      
      // Check for media freedom changes
      const pressFreedomLevel = mediaKnobs.press_freedom_level || 0.75;
      const censorshipIntensity = mediaKnobs.censorship_intensity || 0.25;
      
      if (pressFreedomLevel < 0.4 || censorshipIntensity > 0.7) {
        const event: SimulationEvent = {
          id: `media_freedom_${Date.now()}`,
          type: 'media_event',
          severity: pressFreedomLevel < 0.2 ? 'critical' : 'high',
          description: `Press freedom concerns: ${pressFreedomLevel < 0.4 ? 'Low press freedom' : ''} ${censorshipIntensity > 0.7 ? 'High censorship' : ''}`,
          affectedSystems: ['media-control', 'international-relations', 'public-trust'],
          recommendedKnobAdjustments: [{
            apiName: 'media-control',
            knobName: 'press_freedom_level',
            oldValue: pressFreedomLevel,
            newValue: Math.min(1.0, pressFreedomLevel + 0.1),
            reason: 'Improve international reputation and public trust',
            confidence: 0.7,
            expectedImpact: 'Positive international relations, improved media credibility'
          }],
          timestamp: new Date()
        };
        
        this.emit('simulationEvent', event);
      }
      
      console.log(`📺 Media control simulation completed for civilization ${civilizationId}`);
      
    } catch (error) {
      console.error(`Error in media control simulation for ${civilizationId}:`, error);
    }
  }

  /**
   * Generate knob adjustments based on press conference performance
   */
  private generateMediaKnobAdjustments(conference: any, currentKnobs: any): KnobAdjustment[] {
    const adjustments: KnobAdjustment[] = [];
    
    // If press conference had poor reception, suggest improvements
    if (conference.publicReceptionScore < 0.4) {
      adjustments.push({
        apiName: 'media-control',
        knobName: 'message_coordination_effectiveness',
        oldValue: currentKnobs.message_coordination_effectiveness || 0.65,
        newValue: Math.min(1.0, (currentKnobs.message_coordination_effectiveness || 0.65) + 0.1),
        reason: 'Improve message coordination after poor press conference reception',
        confidence: 0.8,
        expectedImpact: 'Better coordinated government messaging'
      });
    }
    
    // If too many hostile questions, suggest better screening
    if (conference.hostileQuestions > conference.questionsAsked * 0.4) {
      adjustments.push({
        apiName: 'media-control',
        knobName: 'question_screening_intensity',
        oldValue: currentKnobs.question_screening_intensity || 0.30,
        newValue: Math.min(1.0, (currentKnobs.question_screening_intensity || 0.30) + 0.15),
        reason: 'Increase question screening after hostile press conference',
        confidence: 0.7,
        expectedImpact: 'Reduced hostile questioning in future conferences'
      });
    }
    
    // If leader conference was very successful, suggest more leader appearances
    if (conference.presenterType === 'leader_personal' && conference.publicReceptionScore > 0.8) {
      adjustments.push({
        apiName: 'media-control',
        knobName: 'leader_personal_appearance_rate',
        oldValue: currentKnobs.leader_personal_appearance_rate || 0.40,
        newValue: Math.min(1.0, (currentKnobs.leader_personal_appearance_rate || 0.40) + 0.1),
        reason: 'Increase leader appearances after successful press conference',
        confidence: 0.9,
        expectedImpact: 'Higher impact government communications'
      });
    }
    
    return adjustments;
  }

  /**
   * Run Entertainment/Tourism simulations
   */
  private async runEntertainmentTourismSimulations(civilizationId: string): Promise<void> {
    try {
      // Get current entertainment/tourism knobs
      const knobStates = this.getKnobStates(civilizationId);
      const entertainmentTourismKnobs: any = {};
      
      // Extract entertainment/tourism knobs
      for (const [knobKey, value] of knobStates) {
        if (knobKey.startsWith('entertainment-tourism.')) {
          const knobName = knobKey.replace('entertainment-tourism.', '');
          entertainmentTourismKnobs[knobName] = value;
        }
      }
      
      // If no specific knobs found, use defaults
      if (Object.keys(entertainmentTourismKnobs).length === 0) {
        const { DEFAULT_ENTERTAINMENT_TOURISM_KNOBS } = await import('../entertainment-tourism/entertainmentTourismKnobs.js');
        Object.assign(entertainmentTourismKnobs, DEFAULT_ENTERTAINMENT_TOURISM_KNOBS);
      }
      
      // Run entertainment/tourism simulation
      const simulationResult = await this.entertainmentTourismSimulation.runOrchestratorSimulation({
        civilization_id: civilizationId,
        knobs: entertainmentTourismKnobs
      });
      
      // Generate events based on simulation results
      const events = this.entertainmentTourismSimulation.generateEvents(civilizationId);
      
      // Emit events for real-time updates
      for (const event of events) {
        const simulationEvent: SimulationEvent = {
          id: event.id,
          type: 'custom',
          severity: event.severity,
          description: event.description,
          affectedSystems: ['entertainment-tourism', 'economy', 'culture'],
          recommendedKnobAdjustments: [],
          timestamp: event.timestamp
        };
        
        this.emit('simulationEvent', simulationEvent);
      }
      
      console.log(`🎭 Entertainment/Tourism simulation completed for civilization ${civilizationId}`);
      
    } catch (error) {
      console.error(`Error in entertainment/tourism simulation for ${civilizationId}:`, error);
    }
  }

  /**
   * Run Trade simulations
   */
  private async runTradeSimulations(civilizationId: string): Promise<void> {
    try {
      // Get current trade knobs
      const knobStates = this.getKnobStates(civilizationId);
      const tradeKnobs: any = {};
      
      // Extract trade knobs
      for (const [knobKey, value] of knobStates) {
        if (knobKey.startsWith('trade.')) {
          const knobName = knobKey.replace('trade.', '');
          tradeKnobs[knobName] = value;
        }
      }
      
      // If no specific knobs found, use defaults from TradeSimulationIntegration
      if (Object.keys(tradeKnobs).length === 0) {
        tradeKnobs.trade_route_efficiency = 0.8;
        tradeKnobs.transportation_cost_optimization = 0.7;
        tradeKnobs.trade_volume_capacity = 0.8;
        tradeKnobs.market_price_volatility = 0.6;
        tradeKnobs.supply_demand_responsiveness = 0.8;
        tradeKnobs.price_discovery_efficiency = 0.7;
        tradeKnobs.resource_availability_stability = 0.7;
        tradeKnobs.resource_quality_standards = 0.8;
        tradeKnobs.strategic_resource_prioritization = 0.8;
        tradeKnobs.international_trade_facilitation = 0.7;
        tradeKnobs.trade_agreement_negotiation = 0.7;
        tradeKnobs.customs_efficiency = 0.8;
        tradeKnobs.trade_route_security = 0.8;
        tradeKnobs.cargo_insurance_coverage = 0.7;
        tradeKnobs.trade_dispute_resolution = 0.7;
        tradeKnobs.economic_integration_depth = 0.7;
        tradeKnobs.trade_infrastructure_investment = 0.8;
        tradeKnobs.small_trader_support = 0.6;
        tradeKnobs.trade_technology_adoption = 0.7;
        tradeKnobs.automated_trading_systems = 0.6;
        tradeKnobs.blockchain_trade_verification = 0.6;
      }
      
      // Run trade simulation
      const simulationResult = await this.tradeSimulation.runOrchestratorSimulation({
        civilization_id: civilizationId,
        knobs: tradeKnobs
      });
      
      // Process trade tick for continuous simulation
      await this.tradeSimulation.processTick('1', civilizationId);
      
      // Generate simulation event for trade updates
      const tradeEvent: SimulationEvent = {
        id: `trade-${civilizationId}-${Date.now()}`,
        type: 'custom',
        severity: 'low',
        description: `Trade simulation updated: Market indices, route efficiency, and economic impact calculated`,
        affectedSystems: ['trade', 'economy', 'transportation'],
        recommendedKnobAdjustments: [],
        timestamp: new Date()
      };
      
      this.emit('simulationEvent', tradeEvent);
      this.emit('tradeSimulationUpdate', {
        civilizationId,
        results: simulationResult,
        timestamp: new Date()
      });
      
      console.log(`🚀 Trade simulation completed for civilization ${civilizationId}`);
      
    } catch (error) {
      console.error(`Error in trade simulation for ${civilizationId}:`, error);
    }
  }

  /**
   * Update enhanced knobs for a civilization
   */
  async updateEnhancedKnobs(
    campaignId: string,
    civilizationId: string,
    system: string,
    knobs: Record<string, number>,
    source: 'ai' | 'player' | 'system' = 'system'
  ): Promise<void> {
    await this.enhancedKnobsIntegration.updateKnobs(campaignId, civilizationId, system, knobs, source);
    
    // Emit knob update event
    this.emit('knobsUpdated', {
      campaignId,
      civilizationId,
      system,
      knobs,
      source,
      timestamp: new Date()
    });
  }

  /**
   * Get enhanced knob values for a civilization
   */
  async getEnhancedKnobValues(campaignId: string, civilizationId: string): Promise<Record<string, Record<string, number>>> {
    return await this.enhancedKnobsIntegration.getKnobValues(campaignId, civilizationId);
  }

  /**
   * Get simulation state for a civilization
   */
  getSimulationState(campaignId: string, civilizationId: string): any {
    return this.enhancedKnobsIntegration.getSimulationState(campaignId, civilizationId);
  }

  /**
   * Get AI knob recommendations
   */
  async getAIKnobRecommendations(
    campaignId: string,
    civilizationId: string,
    context: Record<string, any>
  ): Promise<Record<string, Record<string, number>>> {
    return await this.enhancedKnobsIntegration.getAIKnobRecommendations(campaignId, civilizationId, context);
  }

  /**
   * Stop the simulation engine
   */
  stop(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    
    // Stop enhanced knobs integration
    this.enhancedKnobsIntegration.destroy();
    
    console.log('🤖 Sim Engine stopped');
  }
}

export default SimEngineOrchestrator;
