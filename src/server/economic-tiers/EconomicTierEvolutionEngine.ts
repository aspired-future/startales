/**
 * Economic Tier Evolution Engine
 * 
 * Core logic for assessing, projecting, and managing city economic tier evolution
 */

import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { 
  CityEconomicProfile, 
  EconomicTier, 
  DevelopmentStage,
  TierEvolutionEngine,
  DevelopmentConstraint,
  GrowthOpportunity,
  DevelopmentProjection,
  PolicyChange,
  PolicyImpactAssessment,
  BenchmarkAnalysis,
  DevelopmentPlan,
  TierDefinition
} from './economicTierInterfaces';

export interface CityGenerationContext {
  civilization_id: number;
  planet_id: number;
  city_id: number;
  population: number;
  founding_date: Date;
  geographic_advantages: string[];
  natural_resources: string[];
  climate_conditions: string;
  strategic_location: boolean;
  initial_specialization: string;
}

export class EconomicTierEvolutionEngine implements TierEvolutionEngine {
  private pool: Pool;
  private tierDefinitions: Map<EconomicTier, TierDefinition> = new Map();

  constructor(pool: Pool) {
    this.pool = pool;
    this.initializeTierDefinitions();
  }

  /**
   * Generate a complete economic profile for a new city
   */
  async generateCityEconomicProfile(context: CityGenerationContext): Promise<CityEconomicProfile> {
    console.log(`📈 Generating economic profile for city ${context.city_id}`);

    // Determine initial tier based on context
    const initialTier = this.determineInitialTier(context);
    const developmentStage = this.determineDevelopmentStage(context, initialTier);
    
    // Generate economic indicators
    const economicIndicators = this.generateEconomicIndicators(context, initialTier);
    
    // Generate infrastructure profile
    const infrastructure = this.generateInfrastructureProfile(context, initialTier);
    
    // Generate industry composition
    const industryComposition = this.generateIndustryComposition(context, initialTier);
    
    // Generate innovation metrics
    const innovationMetrics = this.generateInnovationMetrics(context, initialTier);
    
    // Generate quality of life metrics
    const qualityOfLife = this.generateQualityOfLifeMetrics(context, initialTier);
    
    // Calculate tier progress
    const tierProgress = this.calculateInitialTierProgress(economicIndicators, infrastructure, innovationMetrics);
    
    // Generate development constraints
    const developmentConstraints = this.generateDevelopmentConstraints(context, initialTier);
    
    // Generate growth opportunities
    const growthOpportunities = this.generateGrowthOpportunities(context, initialTier);
    
    // Generate tier requirements for next level
    const tierRequirements = this.generateTierRequirements(initialTier);
    
    const profile: CityEconomicProfile = {
      city_id: context.city_id,
      civilization_id: context.civilization_id,
      planet_id: context.planet_id,
      current_tier: initialTier,
      development_stage: developmentStage,
      tier_progress: tierProgress,
      economic_indicators: economicIndicators,
      infrastructure,
      industry_composition: industryComposition,
      innovation_metrics: innovationMetrics,
      quality_of_life: qualityOfLife,
      development_constraints: developmentConstraints,
      growth_opportunities: growthOpportunities,
      tier_requirements: tierRequirements,
      development_history: [],
      projections: [],
      metadata: {
        last_updated: new Date(),
        data_sources: ['procedural_generation'],
        confidence_score: 85,
        methodology_version: '1.0',
        next_assessment_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        responsible_analysts: ['Economic Tier Engine'],
        peer_review_status: 'approved',
        data_quality_flags: []
      }
    };

    return profile;
  }

  /**
   * Assess current tier based on comprehensive metrics
   */
  assessCurrentTier(cityProfile: CityEconomicProfile): EconomicTier {
    const scores = this.calculateTierScores(cityProfile);
    
    // Check if city meets criteria for higher tiers
    for (const tier of ['post_scarcity', 'advanced', 'industrial', 'developing'] as EconomicTier[]) {
      const definition = this.tierDefinitions.get(tier);
      if (definition && this.meetsTierCriteria(cityProfile, definition)) {
        return tier;
      }
    }
    
    return 'developing'; // Default fallback
  }

  /**
   * Calculate progress toward next tier (0-100)
   */
  calculateTierProgress(cityProfile: CityEconomicProfile): number {
    const currentTier = cityProfile.current_tier;
    const nextTier = this.getNextTier(currentTier);
    
    if (!nextTier) {
      return 100; // Already at highest tier
    }
    
    const nextTierDefinition = this.tierDefinitions.get(nextTier);
    if (!nextTierDefinition) {
      return 0;
    }
    
    const requirements = nextTierDefinition.advancement_criteria.minimum_requirements;
    const weights = nextTierDefinition.advancement_criteria.weighted_scoring;
    
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const [indicator, targetValue] of Object.entries(requirements)) {
      const currentValue = this.getIndicatorValue(cityProfile, indicator);
      const weight = weights[indicator] || 0.1;
      const progress = Math.min(100, (currentValue / targetValue) * 100);
      
      totalScore += progress * weight;
      totalWeight += weight;
    }
    
    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }

  /**
   * Identify development constraints limiting growth
   */
  identifyDevelopmentConstraints(cityProfile: CityEconomicProfile): DevelopmentConstraint[] {
    const constraints: DevelopmentConstraint[] = [];
    
    // Infrastructure constraints
    if (cityProfile.infrastructure.overall_score < 60) {
      constraints.push({
        constraint_type: 'infrastructure',
        description: 'Inadequate infrastructure limiting economic growth and quality of life',
        severity: cityProfile.infrastructure.overall_score < 40 ? 'critical' : 'high',
        impact_areas: ['economic_growth', 'business_development', 'quality_of_life'],
        estimated_cost_to_address: cityProfile.economic_indicators.gdp_per_capita * cityProfile.infrastructure.investment_needs.length * 1000,
        timeframe_to_resolve: 5,
        probability_of_resolution: 70,
        mitigation_strategies: ['Public-private partnerships', 'Infrastructure bonds', 'International development aid'],
        stakeholders_involved: ['government', 'private_sector', 'international_organizations']
      });
    }
    
    // Human capital constraints
    if (cityProfile.quality_of_life.education_quality.education_attainment < 70) {
      constraints.push({
        constraint_type: 'human_capital',
        description: 'Skills gap and low education levels limiting economic advancement',
        severity: 'high',
        impact_areas: ['productivity', 'innovation', 'competitiveness'],
        estimated_cost_to_address: cityProfile.economic_indicators.gdp_per_capita * 500,
        timeframe_to_resolve: 8,
        probability_of_resolution: 80,
        mitigation_strategies: ['Education reform', 'Vocational training', 'University partnerships'],
        stakeholders_involved: ['education_sector', 'employers', 'government']
      });
    }
    
    // Innovation constraints
    if (cityProfile.innovation_metrics.innovation_index < 50) {
      constraints.push({
        constraint_type: 'institutional',
        description: 'Weak innovation ecosystem limiting technological advancement',
        severity: 'medium',
        impact_areas: ['competitiveness', 'economic_complexity', 'future_growth'],
        estimated_cost_to_address: cityProfile.economic_indicators.gdp_per_capita * 300,
        timeframe_to_resolve: 6,
        probability_of_resolution: 65,
        mitigation_strategies: ['Innovation hubs', 'R&D incentives', 'University-industry collaboration'],
        stakeholders_involved: ['research_institutions', 'private_sector', 'government']
      });
    }
    
    // Environmental constraints
    if (cityProfile.quality_of_life.environmental_quality.air_quality_index < 60) {
      constraints.push({
        constraint_type: 'environmental',
        description: 'Environmental degradation affecting health and sustainability',
        severity: 'high',
        impact_areas: ['health_outcomes', 'sustainability', 'investment_attractiveness'],
        estimated_cost_to_address: cityProfile.economic_indicators.gdp_per_capita * 800,
        timeframe_to_resolve: 10,
        probability_of_resolution: 60,
        mitigation_strategies: ['Green technology adoption', 'Environmental regulations', 'Clean energy transition'],
        stakeholders_involved: ['environmental_agencies', 'industry', 'citizens']
      });
    }
    
    // Financial constraints
    if (cityProfile.economic_indicators.debt_to_gdp_ratio > 80) {
      constraints.push({
        constraint_type: 'financial',
        description: 'High debt levels limiting investment capacity',
        severity: 'high',
        impact_areas: ['public_investment', 'fiscal_flexibility', 'economic_stability'],
        estimated_cost_to_address: 0, // Requires fiscal management, not direct cost
        timeframe_to_resolve: 7,
        probability_of_resolution: 55,
        mitigation_strategies: ['Fiscal consolidation', 'Revenue enhancement', 'Debt restructuring'],
        stakeholders_involved: ['government', 'financial_institutions', 'international_creditors']
      });
    }
    
    return constraints;
  }

  /**
   * Recommend growth opportunities
   */
  recommendGrowthOpportunities(cityProfile: CityEconomicProfile): GrowthOpportunity[] {
    const opportunities: GrowthOpportunity[] = [];
    
    // Infrastructure investment opportunities
    if (cityProfile.infrastructure.overall_score < 80) {
      opportunities.push({
        opportunity_type: 'infrastructure_investment',
        title: 'Smart Infrastructure Development',
        description: 'Modernize infrastructure with smart technologies to improve efficiency and attract investment',
        potential_impact: 85,
        investment_required: cityProfile.economic_indicators.gdp_per_capita * 1200,
        timeframe_years: 5,
        success_probability: 75,
        risk_factors: ['Funding availability', 'Technical complexity', 'Regulatory approval'],
        key_enablers: ['Government commitment', 'Private sector participation', 'Technical expertise'],
        expected_outcomes: [
          {
            outcome_type: 'infrastructure_score_improvement',
            quantitative_target: 20,
            measurement_unit: 'points',
            timeframe_years: 5,
            confidence_level: 80
          }
        ],
        stakeholder_alignment: 70
      });
    }
    
    // Innovation hub development
    if (cityProfile.innovation_metrics.innovation_index < 70) {
      opportunities.push({
        opportunity_type: 'innovation_hub',
        title: 'Technology Innovation District',
        description: 'Establish a dedicated innovation district to foster startups and R&D activities',
        potential_impact: 75,
        investment_required: cityProfile.economic_indicators.gdp_per_capita * 800,
        timeframe_years: 4,
        success_probability: 65,
        risk_factors: ['Talent availability', 'Market demand', 'Competition from other cities'],
        key_enablers: ['University partnerships', 'Venture capital access', 'Regulatory support'],
        expected_outcomes: [
          {
            outcome_type: 'innovation_index_improvement',
            quantitative_target: 25,
            measurement_unit: 'points',
            timeframe_years: 4,
            confidence_level: 70
          }
        ],
        stakeholder_alignment: 60
      });
    }
    
    // Sector development opportunities
    const dominantSector = this.getDominantSector(cityProfile.industry_composition);
    if (dominantSector && dominantSector.growth_rate > 5) {
      opportunities.push({
        opportunity_type: 'sector_development',
        title: `${dominantSector.name} Sector Expansion`,
        description: `Leverage existing strengths in ${dominantSector.name} to build competitive advantage`,
        potential_impact: 70,
        investment_required: cityProfile.economic_indicators.gdp_per_capita * 600,
        timeframe_years: 3,
        success_probability: 80,
        risk_factors: ['Market saturation', 'Global competition', 'Technology disruption'],
        key_enablers: ['Industry clusters', 'Skills development', 'Export promotion'],
        expected_outcomes: [
          {
            outcome_type: 'sector_gdp_contribution',
            quantitative_target: 15,
            measurement_unit: 'percentage_increase',
            timeframe_years: 3,
            confidence_level: 75
          }
        ],
        stakeholder_alignment: 85
      });
    }
    
    // Trade expansion opportunities
    if (cityProfile.economic_indicators.export_complexity < 60) {
      opportunities.push({
        opportunity_type: 'trade_expansion',
        title: 'Export Market Development',
        description: 'Develop new export markets and improve product sophistication',
        potential_impact: 60,
        investment_required: cityProfile.economic_indicators.gdp_per_capita * 400,
        timeframe_years: 3,
        success_probability: 70,
        risk_factors: ['Trade barriers', 'Currency fluctuations', 'Quality standards'],
        key_enablers: ['Trade agreements', 'Export financing', 'Market intelligence'],
        expected_outcomes: [
          {
            outcome_type: 'export_growth',
            quantitative_target: 30,
            measurement_unit: 'percentage_increase',
            timeframe_years: 3,
            confidence_level: 65
          }
        ],
        stakeholder_alignment: 75
      });
    }
    
    // Human capital development
    if (cityProfile.quality_of_life.education_quality.skill_match < 70) {
      opportunities.push({
        opportunity_type: 'human_capital',
        title: 'Skills Development Initiative',
        description: 'Comprehensive program to align skills with economic needs',
        potential_impact: 80,
        investment_required: cityProfile.economic_indicators.gdp_per_capita * 300,
        timeframe_years: 6,
        success_probability: 85,
        risk_factors: ['Participation rates', 'Industry engagement', 'Technology changes'],
        key_enablers: ['Education partnerships', 'Industry collaboration', 'Government support'],
        expected_outcomes: [
          {
            outcome_type: 'skill_match_improvement',
            quantitative_target: 20,
            measurement_unit: 'points',
            timeframe_years: 6,
            confidence_level: 80
          }
        ],
        stakeholder_alignment: 90
      });
    }
    
    return opportunities;
  }

  /**
   * Project development trajectory over time
   */
  projectDevelopmentTrajectory(cityProfile: CityEconomicProfile, years: number): DevelopmentProjection[] {
    const projections: DevelopmentProjection[] = [];
    
    // Base case scenario
    projections.push({
      projection_id: uuidv4(),
      scenario_name: 'Business as Usual',
      probability: 60,
      timeframe_years: years,
      projected_tier: this.projectTierProgression(cityProfile, years, 1.0),
      key_assumptions: [
        'Current growth trends continue',
        'No major policy changes',
        'Stable external environment',
        'Moderate investment levels'
      ],
      projected_indicators: this.projectIndicators(cityProfile, years, 1.0),
      critical_success_factors: [
        'Maintaining current performance',
        'Avoiding major setbacks',
        'Gradual infrastructure improvement'
      ],
      major_risks: [
        'Economic downturns',
        'Infrastructure deterioration',
        'Brain drain',
        'Environmental challenges'
      ],
      policy_recommendations: [
        'Maintain current development programs',
        'Gradual infrastructure investment',
        'Skills development focus'
      ]
    });
    
    // Optimistic scenario
    projections.push({
      projection_id: uuidv4(),
      scenario_name: 'Accelerated Development',
      probability: 25,
      timeframe_years: years,
      projected_tier: this.projectTierProgression(cityProfile, years, 1.5),
      key_assumptions: [
        'Significant policy reforms',
        'Major infrastructure investment',
        'Strong international partnerships',
        'Favorable external conditions'
      ],
      projected_indicators: this.projectIndicators(cityProfile, years, 1.5),
      critical_success_factors: [
        'Sustained political commitment',
        'Adequate financing',
        'Effective implementation',
        'Stakeholder alignment'
      ],
      major_risks: [
        'Implementation challenges',
        'Financing constraints',
        'Political instability',
        'External shocks'
      ],
      policy_recommendations: [
        'Comprehensive development strategy',
        'Major infrastructure program',
        'Innovation ecosystem development',
        'International cooperation'
      ]
    });
    
    // Pessimistic scenario
    projections.push({
      projection_id: uuidv4(),
      scenario_name: 'Constrained Growth',
      probability: 15,
      timeframe_years: years,
      projected_tier: this.projectTierProgression(cityProfile, years, 0.5),
      key_assumptions: [
        'Limited resources',
        'Policy constraints',
        'External challenges',
        'Slow institutional development'
      ],
      projected_indicators: this.projectIndicators(cityProfile, years, 0.5),
      critical_success_factors: [
        'Efficient resource use',
        'Targeted interventions',
        'Risk mitigation',
        'Adaptive management'
      ],
      major_risks: [
        'Further deterioration',
        'Social unrest',
        'Economic stagnation',
        'Infrastructure collapse'
      ],
      policy_recommendations: [
        'Focus on essential services',
        'Risk management priority',
        'Gradual improvement strategy',
        'External assistance seeking'
      ]
    });
    
    return projections;
  }

  /**
   * Simulate policy impact
   */
  simulatePolicyImpact(cityProfile: CityEconomicProfile, policyChanges: PolicyChange[]): PolicyImpactAssessment {
    let overallImpact = 0;
    const affectedIndicators: { [indicator: string]: number } = {};
    const implementationChallenges: string[] = [];
    const unintendedConsequences: string[] = [];
    const stakeholderReactions: { [stakeholder: string]: number } = {};
    
    for (const policy of policyChanges) {
      // Calculate impact based on policy area and current city conditions
      const policyImpact = this.calculatePolicyImpact(cityProfile, policy);
      overallImpact += policyImpact.impact_score;
      
      // Aggregate affected indicators
      for (const [indicator, impact] of Object.entries(policyImpact.indicator_changes)) {
        affectedIndicators[indicator] = (affectedIndicators[indicator] || 0) + impact;
      }
      
      // Add implementation challenges
      implementationChallenges.push(...policyImpact.challenges);
      
      // Add unintended consequences
      unintendedConsequences.push(...policyImpact.unintended_effects);
      
      // Add stakeholder reactions
      for (const [stakeholder, reaction] of Object.entries(policyImpact.stakeholder_reactions)) {
        stakeholderReactions[stakeholder] = (stakeholderReactions[stakeholder] || 0) + reaction;
      }
    }
    
    // Calculate tier advancement probability
    const tierAdvancementProbability = this.calculateTierAdvancementProbability(
      cityProfile, 
      affectedIndicators
    );
    
    // Calculate cost-benefit ratio
    const totalCost = policyChanges.reduce((sum, policy) => sum + policy.implementation_cost, 0);
    const totalBenefit = overallImpact * cityProfile.economic_indicators.gdp_per_capita * 0.01;
    const costBenefitRatio = totalCost > 0 ? totalBenefit / totalCost : 0;
    
    return {
      overall_impact_score: Math.round(overallImpact),
      affected_indicators: affectedIndicators,
      tier_advancement_probability: Math.round(tierAdvancementProbability),
      cost_benefit_ratio: Math.round(costBenefitRatio * 100) / 100,
      implementation_challenges: [...new Set(implementationChallenges)],
      unintended_consequences: [...new Set(unintendedConsequences)],
      stakeholder_reactions: stakeholderReactions
    };
  }

  /**
   * Benchmark against peer cities
   */
  benchmarkAgainstPeers(cityProfile: CityEconomicProfile): BenchmarkAnalysis {
    // This would typically involve comparing with actual peer cities
    // For now, we'll generate representative benchmark data
    
    const peerCities = [
      {
        city_name: 'Benchmark City Alpha',
        similarity_score: 85,
        key_differences: ['Higher innovation index', 'Better infrastructure'],
        performance_comparison: {
          gdp_per_capita: 1.2,
          innovation_index: 1.4,
          infrastructure_score: 1.3,
          quality_of_life: 1.1
        },
        lessons_applicable: ['Innovation hub development', 'Smart city initiatives']
      },
      {
        city_name: 'Benchmark City Beta',
        similarity_score: 78,
        key_differences: ['Stronger manufacturing base', 'Lower service sector'],
        performance_comparison: {
          gdp_per_capita: 0.9,
          manufacturing_output: 1.6,
          service_sector: 0.7,
          export_performance: 1.3
        },
        lessons_applicable: ['Manufacturing cluster development', 'Export promotion']
      }
    ];
    
    const relativePerformance = {
      gdp_per_capita: 65, // Percentile ranking
      innovation_index: 45,
      infrastructure_score: 55,
      quality_of_life: 70,
      competitiveness_index: 60
    };
    
    const bestPractices = [
      {
        practice_name: 'Innovation District Development',
        description: 'Concentrated innovation zones with mixed-use development',
        implementing_cities: ['Benchmark City Alpha', 'Innovation Hub Gamma'],
        impact_achieved: { innovation_index: 25, startup_density: 40 },
        implementation_requirements: ['Zoning changes', 'Infrastructure investment', 'Incentive programs'],
        adaptation_considerations: ['Local context', 'Available resources', 'Stakeholder buy-in'],
        success_factors: ['Strong governance', 'Private sector engagement', 'University partnerships']
      }
    ];
    
    const performanceGaps = [
      {
        indicator: 'innovation_index',
        current_value: cityProfile.innovation_metrics.innovation_index,
        peer_average: 65,
        best_performer_value: 85,
        gap_significance: 'major' as const,
        improvement_potential: 40,
        recommended_actions: ['Establish innovation hubs', 'Increase R&D funding', 'Improve university-industry links']
      }
    ];
    
    return {
      peer_cities: peerCities,
      relative_performance: relativePerformance,
      best_practices: bestPractices,
      performance_gaps: performanceGaps,
      competitive_advantages: ['Strategic location', 'Natural resources', 'Cultural heritage'],
      improvement_priorities: ['Innovation capacity', 'Infrastructure quality', 'Skills development']
    };
  }

  /**
   * Generate comprehensive development plan
   */
  generateDevelopmentPlan(cityProfile: CityEconomicProfile, targetTier: EconomicTier): DevelopmentPlan {
    const planId = uuidv4();
    const planningHorizon = this.calculatePlanningHorizon(cityProfile.current_tier, targetTier);
    
    return {
      plan_id: planId,
      target_tier: targetTier,
      planning_horizon_years: planningHorizon,
      strategic_objectives: this.generateStrategicObjectives(cityProfile, targetTier),
      implementation_phases: this.generateImplementationPhases(cityProfile, targetTier, planningHorizon),
      resource_mobilization: this.generateResourceMobilizationPlan(cityProfile, targetTier),
      risk_management: this.generateRiskManagementPlan(cityProfile, targetTier),
      monitoring_framework: this.generateMonitoringFramework(cityProfile, targetTier),
      stakeholder_engagement: this.generateStakeholderEngagementPlan(cityProfile, targetTier)
    };
  }

  // Private helper methods

  private async initializeTierDefinitions(): Promise<void> {
    // This would load tier definitions from database
    // For now, we'll use hardcoded definitions
    console.log('📋 Initializing tier definitions...');
  }

  private determineInitialTier(context: CityGenerationContext): EconomicTier {
    // Base tier on population, resources, and other factors
    if (context.population > 5000000 && context.strategic_location) {
      return 'industrial';
    } else if (context.population > 1000000) {
      return Math.random() < 0.3 ? 'industrial' : 'developing';
    } else {
      return 'developing';
    }
  }

  private determineDevelopmentStage(context: CityGenerationContext, tier: EconomicTier): DevelopmentStage {
    const cityAge = (Date.now() - context.founding_date.getTime()) / (365 * 24 * 60 * 60 * 1000);
    
    if (cityAge < 10) return 'emerging';
    if (cityAge < 30) return 'transitioning';
    if (cityAge < 100) return 'established';
    return 'mature';
  }

  private generateEconomicIndicators(context: CityGenerationContext, tier: EconomicTier): any {
    const tierDefinition = this.tierDefinitions.get(tier);
    const baseGdp = tierDefinition ? 
      (tierDefinition.typical_characteristics.gdp_per_capita_range[0] + tierDefinition.typical_characteristics.gdp_per_capita_range[1]) / 2 :
      15000;
    
    return {
      gdp_per_capita: baseGdp * (0.8 + Math.random() * 0.4),
      gdp_growth_rate: 2 + Math.random() * 6,
      unemployment_rate: 3 + Math.random() * 12,
      inflation_rate: 1 + Math.random() * 8,
      productivity_index: 40 + Math.random() * 40,
      competitiveness_index: 35 + Math.random() * 45,
      economic_complexity_index: 20 + Math.random() * 50,
      income_inequality_gini: 0.25 + Math.random() * 0.4,
      poverty_rate: Math.random() * 25,
      median_income: baseGdp * 0.7,
      cost_of_living_index: 80 + Math.random() * 40,
      economic_diversification: 30 + Math.random() * 50,
      export_complexity: 25 + Math.random() * 45,
      foreign_investment_ratio: Math.random() * 15,
      debt_to_gdp_ratio: 20 + Math.random() * 60,
      fiscal_balance: -5 + Math.random() * 10
    };
  }

  private generateInfrastructureProfile(context: CityGenerationContext, tier: EconomicTier): any {
    const baseScore = tier === 'developing' ? 40 : tier === 'industrial' ? 65 : 85;
    
    return {
      overall_score: baseScore + Math.random() * 20 - 10,
      categories: {
        transportation: {
          quality_score: baseScore + Math.random() * 15 - 7,
          coverage_percentage: 60 + Math.random() * 35,
          capacity_utilization: 50 + Math.random() * 40,
          maintenance_status: 'fair',
          last_major_upgrade: new Date(Date.now() - Math.random() * 10 * 365 * 24 * 60 * 60 * 1000),
          investment_required: context.population * (50 + Math.random() * 100),
          economic_impact: 1.2 + Math.random() * 0.8,
          citizen_satisfaction: 50 + Math.random() * 30
        }
        // Add other infrastructure categories...
      },
      investment_needs: [],
      maintenance_backlog: context.population * (100 + Math.random() * 200),
      modernization_level: baseScore,
      resilience_score: 40 + Math.random() * 40,
      sustainability_score: 35 + Math.random() * 45,
      digital_infrastructure: {
        internet_penetration: 60 + Math.random() * 35,
        broadband_speed: 10 + Math.random() * 90,
        mobile_coverage: 80 + Math.random() * 18,
        digital_government_services: 30 + Math.random() * 50,
        smart_city_integration: 20 + Math.random() * 40,
        cybersecurity_level: 40 + Math.random() * 40,
        data_center_capacity: Math.random() * 100,
        fiber_optic_coverage: 30 + Math.random() * 60
      }
    };
  }

  private generateIndustryComposition(context: CityGenerationContext, tier: EconomicTier): any {
    // Generate realistic industry composition based on tier
    const compositions = {
      developing: { primary: 35, secondary: 25, tertiary: 35, quaternary: 4, quinary: 1 },
      industrial: { primary: 15, secondary: 40, tertiary: 35, quaternary: 8, quinary: 2 },
      advanced: { primary: 5, secondary: 25, tertiary: 45, quaternary: 20, quinary: 5 },
      post_scarcity: { primary: 2, secondary: 10, tertiary: 30, quaternary: 35, quinary: 23 }
    };
    
    const composition = compositions[tier];
    
    return {
      primary_sector: {
        gdp_contribution: composition.primary,
        employment_share: composition.primary * 1.2,
        productivity_level: 40 + Math.random() * 30,
        growth_rate: -2 + Math.random() * 6,
        competitiveness: 50 + Math.random() * 30,
        innovation_intensity: 10 + Math.random() * 20,
        export_orientation: 30 + Math.random() * 40,
        foreign_investment: Math.random() * 10,
        skill_requirements: ['basic', 'intermediate'],
        technology_adoption: 20 + Math.random() * 30
      },
      secondary_sector: {
        gdp_contribution: composition.secondary,
        employment_share: composition.secondary * 1.1,
        productivity_level: 50 + Math.random() * 35,
        growth_rate: 1 + Math.random() * 8,
        competitiveness: 55 + Math.random() * 35,
        innovation_intensity: 25 + Math.random() * 35,
        export_orientation: 40 + Math.random() * 35,
        foreign_investment: 5 + Math.random() * 15,
        skill_requirements: ['intermediate', 'advanced'],
        technology_adoption: 40 + Math.random() * 40
      },
      tertiary_sector: {
        gdp_contribution: composition.tertiary,
        employment_share: composition.tertiary * 0.9,
        productivity_level: 60 + Math.random() * 30,
        growth_rate: 3 + Math.random() * 7,
        competitiveness: 60 + Math.random() * 30,
        innovation_intensity: 35 + Math.random() * 30,
        export_orientation: 20 + Math.random() * 30,
        foreign_investment: 10 + Math.random() * 20,
        skill_requirements: ['intermediate', 'advanced', 'expert'],
        technology_adoption: 60 + Math.random() * 35
      },
      quaternary_sector: {
        gdp_contribution: composition.quaternary,
        employment_share: composition.quaternary * 0.8,
        productivity_level: 70 + Math.random() * 25,
        growth_rate: 5 + Math.random() * 10,
        competitiveness: 65 + Math.random() * 30,
        innovation_intensity: 70 + Math.random() * 25,
        export_orientation: 50 + Math.random() * 40,
        foreign_investment: 15 + Math.random() * 25,
        skill_requirements: ['advanced', 'expert', 'cutting_edge'],
        technology_adoption: 80 + Math.random() * 20
      },
      quinary_sector: {
        gdp_contribution: composition.quinary,
        employment_share: composition.quinary * 0.7,
        productivity_level: 80 + Math.random() * 20,
        growth_rate: 7 + Math.random() * 8,
        competitiveness: 75 + Math.random() * 20,
        innovation_intensity: 85 + Math.random() * 15,
        export_orientation: 60 + Math.random() * 30,
        foreign_investment: 20 + Math.random() * 20,
        skill_requirements: ['expert', 'cutting_edge'],
        technology_adoption: 90 + Math.random() * 10
      },
      emerging_sectors: [],
      dominant_industries: [],
      industrial_diversity: 40 + Math.random() * 40,
      value_chain_integration: 35 + Math.random() * 45
    };
  }

  private generateInnovationMetrics(context: CityGenerationContext, tier: EconomicTier): any {
    const baseInnovation = tier === 'developing' ? 25 : tier === 'industrial' ? 45 : tier === 'advanced' ? 75 : 90;
    
    return {
      innovation_index: baseInnovation + Math.random() * 20 - 10,
      research_intensity: (baseInnovation / 100) * 3 + Math.random() * 2,
      patent_applications: (baseInnovation / 10) + Math.random() * 20,
      scientific_publications: (baseInnovation / 5) + Math.random() * 40,
      high_tech_exports: (baseInnovation / 2) + Math.random() * 30,
      startup_density: (baseInnovation / 20) + Math.random() * 5,
      venture_capital_activity: (baseInnovation / 50) + Math.random() * 3,
      university_research_quality: baseInnovation + Math.random() * 15 - 7,
      industry_academia_collaboration: baseInnovation + Math.random() * 20 - 10,
      innovation_ecosystem_maturity: baseInnovation + Math.random() * 15 - 7,
      technology_transfer_efficiency: baseInnovation + Math.random() * 20 - 10,
      intellectual_property_protection: 50 + Math.random() * 40,
      digital_transformation_level: baseInnovation + Math.random() * 25 - 12,
      innovation_infrastructure: {
        research_institutions: Math.floor((baseInnovation / 10) + Math.random() * 10),
        innovation_hubs: Math.floor((baseInnovation / 20) + Math.random() * 5),
        incubators_accelerators: Math.floor((baseInnovation / 15) + Math.random() * 8),
        technology_parks: Math.floor((baseInnovation / 25) + Math.random() * 4),
        research_funding: context.population * (baseInnovation / 100) * (10 + Math.random() * 20),
        innovation_talent_pool: baseInnovation + Math.random() * 20 - 10,
        collaboration_networks: baseInnovation + Math.random() * 15 - 7,
        knowledge_spillovers: baseInnovation + Math.random() * 25 - 12
      }
    };
  }

  private generateQualityOfLifeMetrics(context: CityGenerationContext, tier: EconomicTier): any {
    const baseQoL = tier === 'developing' ? 50 : tier === 'industrial' ? 65 : tier === 'advanced' ? 80 : 92;
    
    return {
      overall_index: baseQoL + Math.random() * 15 - 7,
      health_outcomes: {
        life_expectancy: 65 + (baseQoL / 5) + Math.random() * 10,
        infant_mortality_rate: Math.max(1, 50 - baseQoL + Math.random() * 20),
        healthcare_access: baseQoL + Math.random() * 20 - 10,
        healthcare_quality: baseQoL + Math.random() * 15 - 7,
        mental_health_support: baseQoL + Math.random() * 25 - 12,
        preventive_care_coverage: baseQoL + Math.random() * 20 - 10,
        health_infrastructure: baseQoL + Math.random() * 15 - 7,
        disease_burden: Math.max(5, 100 - baseQoL + Math.random() * 20)
      },
      education_quality: {
        literacy_rate: Math.min(99, 70 + baseQoL / 2 + Math.random() * 10),
        education_attainment: baseQoL + Math.random() * 20 - 10,
        education_quality: baseQoL + Math.random() * 15 - 7,
        skill_match: baseQoL + Math.random() * 25 - 12,
        lifelong_learning: baseQoL + Math.random() * 20 - 10,
        digital_literacy: baseQoL + Math.random() * 25 - 12,
        research_capacity: baseQoL + Math.random() * 30 - 15,
        education_innovation: baseQoL + Math.random() * 20 - 10
      },
      environmental_quality: {
        air_quality_index: baseQoL + Math.random() * 20 - 10,
        water_quality: baseQoL + Math.random() * 15 - 7,
        waste_management: baseQoL + Math.random() * 25 - 12,
        green_space_ratio: 10 + (baseQoL / 3) + Math.random() * 15,
        carbon_footprint: Math.max(2, 20 - baseQoL / 5 + Math.random() * 10),
        renewable_energy_share: (baseQoL / 2) + Math.random() * 30,
        environmental_protection: baseQoL + Math.random() * 20 - 10,
        climate_resilience: baseQoL + Math.random() * 25 - 12
      },
      social_cohesion: {
        social_trust: baseQoL + Math.random() * 20 - 10,
        community_engagement: baseQoL + Math.random() * 25 - 12,
        social_capital: baseQoL + Math.random() * 15 - 7,
        income_equality: Math.max(20, baseQoL + Math.random() * 30 - 15),
        social_inclusion: baseQoL + Math.random() * 20 - 10,
        civic_participation: baseQoL + Math.random() * 25 - 12,
        social_services_quality: baseQoL + Math.random() * 15 - 7,
        intergenerational_mobility: baseQoL + Math.random() * 30 - 15
      },
      cultural_vitality: {
        cultural_diversity: 50 + Math.random() * 40,
        cultural_institutions: (context.population / 100000) * (1 + Math.random()),
        creative_industries: (baseQoL / 10) + Math.random() * 8,
        cultural_participation: baseQoL + Math.random() * 20 - 10,
        heritage_preservation: baseQoL + Math.random() * 25 - 12,
        artistic_innovation: baseQoL + Math.random() * 30 - 15,
        cultural_exchange: baseQoL + Math.random() * 20 - 10,
        cultural_identity_strength: 60 + Math.random() * 30
      },
      safety_security: {
        crime_rate: Math.max(0.1, 10 - baseQoL / 10 + Math.random() * 5),
        public_safety: baseQoL + Math.random() * 15 - 7,
        emergency_preparedness: baseQoL + Math.random() * 20 - 10,
        disaster_resilience: baseQoL + Math.random() * 25 - 12,
        cybersecurity: baseQoL + Math.random() * 30 - 15,
        traffic_safety: baseQoL + Math.random() * 20 - 10,
        workplace_safety: baseQoL + Math.random() * 15 - 7,
        personal_security: baseQoL + Math.random() * 20 - 10
      },
      housing_affordability: Math.max(20, 100 - (baseQoL / 2) + Math.random() * 30),
      work_life_balance: baseQoL + Math.random() * 20 - 10,
      civic_engagement: baseQoL + Math.random() * 25 - 12,
      social_mobility: baseQoL + Math.random() * 30 - 15
    };
  }

  private calculateInitialTierProgress(economicIndicators: any, infrastructure: any, innovationMetrics: any): number {
    // Simple calculation based on key metrics
    const avgScore = (
      (economicIndicators.productivity_index || 50) +
      (infrastructure.overall_score || 50) +
      (innovationMetrics.innovation_index || 50)
    ) / 3;
    
    return Math.min(95, Math.max(5, avgScore + Math.random() * 20 - 10));
  }

  private generateDevelopmentConstraints(context: CityGenerationContext, tier: EconomicTier): DevelopmentConstraint[] {
    // Generate realistic constraints based on tier and context
    return []; // Simplified for now
  }

  private generateGrowthOpportunities(context: CityGenerationContext, tier: EconomicTier): GrowthOpportunity[] {
    // Generate realistic opportunities based on tier and context
    return []; // Simplified for now
  }

  private generateTierRequirements(currentTier: EconomicTier): any {
    const nextTier = this.getNextTier(currentTier);
    if (!nextTier) {
      return {
        target_tier: currentTier,
        requirements: [],
        overall_progress: 100,
        estimated_completion_years: 0,
        critical_path_items: [],
        resource_needs: []
      };
    }
    
    return {
      target_tier: nextTier,
      requirements: [
        {
          requirement_id: 'gdp_per_capita',
          category: 'economic',
          description: 'Achieve minimum GDP per capita threshold',
          current_value: 25000,
          target_value: 50000,
          unit: 'currency_units',
          progress: 50,
          priority: 'critical',
          dependencies: ['productivity_improvement', 'economic_diversification'],
          estimated_cost: 1000000,
          timeframe_years: 5
        }
      ],
      overall_progress: 45,
      estimated_completion_years: 8,
      critical_path_items: ['Infrastructure development', 'Human capital enhancement'],
      resource_needs: []
    };
  }

  private getNextTier(currentTier: EconomicTier): EconomicTier | null {
    const progression: EconomicTier[] = ['developing', 'industrial', 'advanced', 'post_scarcity'];
    const currentIndex = progression.indexOf(currentTier);
    return currentIndex < progression.length - 1 ? progression[currentIndex + 1] : null;
  }

  private calculateTierScores(cityProfile: CityEconomicProfile): any {
    return {
      economic: (cityProfile.economic_indicators.gdp_per_capita / 100000) * 100,
      infrastructure: cityProfile.infrastructure.overall_score,
      innovation: cityProfile.innovation_metrics.innovation_index,
      quality_of_life: cityProfile.quality_of_life.overall_index
    };
  }

  private meetsTierCriteria(cityProfile: CityEconomicProfile, tierDefinition: TierDefinition): boolean {
    const requirements = tierDefinition.advancement_criteria.minimum_requirements;
    
    for (const [indicator, threshold] of Object.entries(requirements)) {
      const currentValue = this.getIndicatorValue(cityProfile, indicator);
      if (currentValue < threshold) {
        return false;
      }
    }
    
    return true;
  }

  private getIndicatorValue(cityProfile: CityEconomicProfile, indicator: string): number {
    // Map indicator names to actual values in city profile
    switch (indicator) {
      case 'gdp_per_capita':
        return cityProfile.economic_indicators.gdp_per_capita;
      case 'infrastructure_score':
        return cityProfile.infrastructure.overall_score;
      case 'innovation_index':
        return cityProfile.innovation_metrics.innovation_index;
      case 'quality_of_life':
        return cityProfile.quality_of_life.overall_index;
      default:
        return 0;
    }
  }

  private getDominantSector(industryComposition: any): any {
    const sectors = [
      { name: 'Primary', ...industryComposition.primary_sector },
      { name: 'Secondary', ...industryComposition.secondary_sector },
      { name: 'Tertiary', ...industryComposition.tertiary_sector },
      { name: 'Quaternary', ...industryComposition.quaternary_sector },
      { name: 'Quinary', ...industryComposition.quinary_sector }
    ];
    
    return sectors.reduce((max, sector) => 
      sector.gdp_contribution > max.gdp_contribution ? sector : max
    );
  }

  private projectTierProgression(cityProfile: CityEconomicProfile, years: number, multiplier: number): EconomicTier {
    const currentProgress = cityProfile.tier_progress;
    const projectedProgress = Math.min(100, currentProgress + (years * 10 * multiplier));
    
    if (projectedProgress >= 100) {
      const nextTier = this.getNextTier(cityProfile.current_tier);
      return nextTier || cityProfile.current_tier;
    }
    
    return cityProfile.current_tier;
  }

  private projectIndicators(cityProfile: CityEconomicProfile, years: number, multiplier: number): any {
    const growthRate = 0.03 * multiplier; // 3% base growth rate
    
    return {
      gdp_per_capita: cityProfile.economic_indicators.gdp_per_capita * Math.pow(1 + growthRate, years),
      infrastructure_score: Math.min(100, cityProfile.infrastructure.overall_score + (years * 2 * multiplier)),
      innovation_index: Math.min(100, cityProfile.innovation_metrics.innovation_index + (years * 3 * multiplier)),
      quality_of_life: Math.min(100, cityProfile.quality_of_life.overall_index + (years * 1.5 * multiplier))
    };
  }

  private calculatePolicyImpact(cityProfile: CityEconomicProfile, policy: PolicyChange): any {
    // Simplified policy impact calculation
    return {
      impact_score: Math.random() * 20 - 10,
      indicator_changes: {
        gdp_per_capita: Math.random() * 1000 - 500,
        infrastructure_score: Math.random() * 10 - 5
      },
      challenges: ['Implementation complexity', 'Stakeholder resistance'],
      unintended_effects: ['Increased inequality', 'Environmental impact'],
      stakeholder_reactions: {
        government: 50 + Math.random() * 40,
        private_sector: 30 + Math.random() * 60,
        citizens: 40 + Math.random() * 50
      }
    };
  }

  private calculateTierAdvancementProbability(cityProfile: CityEconomicProfile, indicatorChanges: any): number {
    const currentProgress = cityProfile.tier_progress;
    const improvementScore = Object.values(indicatorChanges).reduce((sum: number, change: any) => sum + (change > 0 ? change : 0), 0);
    
    return Math.min(95, currentProgress + (improvementScore / 100) * 30);
  }

  private calculatePlanningHorizon(currentTier: EconomicTier, targetTier: EconomicTier): number {
    const tierOrder = ['developing', 'industrial', 'advanced', 'post_scarcity'];
    const currentIndex = tierOrder.indexOf(currentTier);
    const targetIndex = tierOrder.indexOf(targetTier);
    const tierDifference = targetIndex - currentIndex;
    
    return Math.max(5, tierDifference * 8); // 8 years per tier advancement
  }

  private generateStrategicObjectives(cityProfile: CityEconomicProfile, targetTier: EconomicTier): any[] {
    return [
      {
        objective_id: 'economic_growth',
        title: 'Accelerate Economic Growth',
        description: 'Achieve sustained GDP growth and productivity improvements',
        target_indicators: { gdp_growth_rate: 6, productivity_index: 80 },
        timeframe_years: 5,
        priority: 'critical',
        responsible_entities: ['Economic Development Agency', 'Private Sector'],
        success_metrics: ['GDP per capita growth', 'Productivity index improvement']
      }
    ];
  }

  private generateImplementationPhases(cityProfile: CityEconomicProfile, targetTier: EconomicTier, horizonYears: number): any[] {
    const phaseDuration = Math.ceil(horizonYears / 3);
    
    return [
      {
        phase_number: 1,
        phase_name: 'Foundation Building',
        duration_years: phaseDuration,
        key_initiatives: [],
        milestones: [],
        resource_requirements: [],
        success_criteria: ['Infrastructure improvements', 'Institutional strengthening']
      }
    ];
  }

  private generateResourceMobilizationPlan(cityProfile: CityEconomicProfile, targetTier: EconomicTier): any {
    return {
      total_investment_required: cityProfile.economic_indicators.gdp_per_capita * 10000,
      funding_sources: [],
      financing_strategy: 'Mixed public-private financing approach',
      public_private_partnerships: [],
      international_cooperation: ['World Bank', 'Regional Development Banks'],
      capacity_building_needs: ['Project management', 'Technical expertise']
    };
  }

  private generateRiskManagementPlan(cityProfile: CityEconomicProfile, targetTier: EconomicTier): any {
    return {
      identified_risks: [],
      mitigation_strategies: [],
      contingency_plans: [],
      monitoring_indicators: ['Economic volatility', 'Political stability'],
      escalation_procedures: ['Risk assessment committee', 'Emergency response protocols']
    };
  }

  private generateMonitoringFramework(cityProfile: CityEconomicProfile, targetTier: EconomicTier): any {
    return {
      key_performance_indicators: [],
      data_collection_methods: ['Statistical surveys', 'Administrative data', 'Satellite imagery'],
      reporting_frequency: 'Quarterly',
      responsible_agencies: ['Statistics Office', 'Planning Ministry'],
      review_mechanisms: ['Annual reviews', 'Mid-term evaluations'],
      adaptive_management_protocols: ['Performance-based adjustments', 'Stakeholder feedback integration']
    };
  }

  private generateStakeholderEngagementPlan(cityProfile: CityEconomicProfile, targetTier: EconomicTier): any {
    return {
      stakeholder_groups: [],
      engagement_strategies: [],
      communication_channels: ['Public meetings', 'Digital platforms', 'Media campaigns'],
      feedback_mechanisms: ['Surveys', 'Focus groups', 'Online portals'],
      conflict_resolution_procedures: ['Mediation', 'Arbitration', 'Appeals process'],
      participation_frameworks: ['Citizen committees', 'Business councils', 'Academic advisory groups']
    };
  }
}
