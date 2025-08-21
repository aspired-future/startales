/**
 * Economic Tier Evolution API Routes
 *
 * RESTful API endpoints for the Economic Tier System
 */

import express from 'express';
import { Pool } from 'pg';
import { EconomicTierService } from './EconomicTierService.js';
import { EconomicTierEvolutionEngine } from './EconomicTierEvolutionEngine.js';
import { initializeEconomicTierSchema } from './economicTierSchema.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = express.Router();

// Enhanced AI Knobs for Economic Tiers System
const economicTiersKnobsData = {
  // Economic Development & Growth
  economic_development_speed: 0.7,        // Economic development and growth speed
  innovation_investment_priority: 0.8,    // Innovation and R&D investment priority
  infrastructure_development_focus: 0.7,  // Infrastructure development focus and investment
  
  // Market Structure & Competition
  market_competition_level: 0.7,          // Market competition and antitrust enforcement
  monopoly_prevention_strictness: 0.8,    // Monopoly prevention and market regulation
  small_business_support: 0.7,            // Small business support and development programs
  
  // Economic Tier Progression
  tier_advancement_criteria: 0.7,         // Economic tier advancement criteria and standards
  tier_transition_support: 0.8,           // Support for businesses transitioning between tiers
  economic_mobility_promotion: 0.7,       // Economic mobility and opportunity promotion
  
  // Industry Specialization & Diversification
  industry_specialization_focus: 0.6,     // Industry specialization vs diversification focus
  emerging_sector_development: 0.8,       // Emerging sector development and support
  traditional_industry_modernization: 0.6, // Traditional industry modernization and upgrade
  
  // Labor Market & Skills Development
  workforce_skill_development: 0.8,       // Workforce skill development and training
  labor_market_flexibility: 0.6,          // Labor market flexibility and mobility
  education_industry_alignment: 0.8,      // Education-industry alignment and coordination
  
  // Capital Markets & Investment
  capital_market_development: 0.7,        // Capital market development and accessibility
  venture_capital_ecosystem: 0.7,         // Venture capital and startup ecosystem support
  foreign_investment_openness: 0.6,       // Foreign investment openness and regulation
  
  // Regional Economic Balance
  regional_development_balance: 0.6,      // Regional economic development balance
  urban_rural_economic_integration: 0.6,  // Urban-rural economic integration and development
  economic_cluster_development: 0.7,      // Economic cluster and hub development
  
  // Sustainability & Environmental Integration
  sustainable_development_priority: 0.8,  // Sustainable development and green economy priority
  circular_economy_promotion: 0.7,        // Circular economy and resource efficiency promotion
  environmental_economic_integration: 0.7, // Environmental and economic policy integration
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Economic Tiers
const economicTiersKnobSystem = new EnhancedKnobSystem(economicTiersKnobsData);

// Apply economic tiers knobs to game state
function applyEconomicTiersKnobsToGameState() {
  const knobs = economicTiersKnobSystem.knobs;
  
  // Apply economic development settings
  const economicDevelopment = (knobs.economic_development_speed + knobs.innovation_investment_priority + 
    knobs.infrastructure_development_focus) / 3;
  
  // Apply market structure settings
  const marketStructure = (knobs.market_competition_level + knobs.monopoly_prevention_strictness + 
    knobs.small_business_support) / 3;
  
  // Apply tier progression settings
  const tierProgression = (knobs.tier_advancement_criteria + knobs.tier_transition_support + 
    knobs.economic_mobility_promotion) / 3;
  
  // Apply industry development settings
  const industryDevelopment = (knobs.industry_specialization_focus + knobs.emerging_sector_development + 
    knobs.traditional_industry_modernization) / 3;
  
  // Apply labor market settings
  const laborMarket = (knobs.workforce_skill_development + knobs.labor_market_flexibility + 
    knobs.education_industry_alignment) / 3;
  
  // Apply sustainability settings
  const sustainability = (knobs.sustainable_development_priority + knobs.circular_economy_promotion + 
    knobs.environmental_economic_integration) / 3;
  
  console.log('Applied economic tiers knobs to game state:', {
    economicDevelopment,
    marketStructure,
    tierProgression,
    industryDevelopment,
    laborMarket,
    sustainability
  });
}

let tierService: EconomicTierService;
let evolutionEngine: EconomicTierEvolutionEngine;

export function initializeEconomicTierService(pool: Pool): void {
  tierService = new EconomicTierService(pool);
  evolutionEngine = new EconomicTierEvolutionEngine(pool);
  
  // Initialize database schema
  initializeEconomicTierSchema(pool).catch(error => {
    console.error('❌ Failed to initialize economic tier schema:', error);
  });
  
  console.log('✅ Economic Tier Service initialized');
}

export function getEconomicTierService(): EconomicTierService {
  if (!tierService) {
    throw new Error('Economic tier service not initialized. Call initializeEconomicTierService first.');
  }
  return tierService;
}

export function getEconomicTierEvolutionEngine(): EconomicTierEvolutionEngine {
  if (!evolutionEngine) {
    throw new Error('Economic tier evolution engine not initialized. Call initializeEconomicTierService first.');
  }
  return evolutionEngine;
}

// Generate economic profile for a city
router.post('/generate-profile', async (req, res) => {
  try {
    const { 
      civilizationId, 
      planetId, 
      cityId, 
      population,
      foundingDate,
      geographicAdvantages = [],
      naturalResources = [],
      climateConditions = 'temperate',
      strategicLocation = false,
      initialSpecialization = 'general'
    } = req.body;

    if (!civilizationId || !planetId || !cityId || !population) {
      return res.status(400).json({
        error: 'Missing required parameters: civilizationId, planetId, cityId, population'
      });
    }

    const context = {
      civilization_id: civilizationId,
      planet_id: planetId,
      city_id: cityId,
      population: population,
      founding_date: foundingDate ? new Date(foundingDate) : new Date(),
      geographic_advantages: geographicAdvantages,
      natural_resources: naturalResources,
      climate_conditions: climateConditions,
      strategic_location: strategicLocation,
      initial_specialization: initialSpecialization
    };

    const profile = await evolutionEngine.generateCityEconomicProfile(context);
    const cityId_result = await tierService.createCityProfile(profile);

    res.json({
      success: true,
      city_id: cityId_result,
      profile: {
        current_tier: profile.current_tier,
        development_stage: profile.development_stage,
        tier_progress: profile.tier_progress,
        economic_indicators: profile.economic_indicators,
        infrastructure_score: profile.infrastructure.overall_score,
        innovation_index: profile.innovation_metrics.innovation_index,
        quality_of_life: profile.quality_of_life.overall_index
      },
      message: `Generated economic profile for city ${cityId}`
    });

  } catch (error) {
    console.error('❌ Error generating economic profile:', error);
    res.status(500).json({
      error: 'Failed to generate economic profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get city economic profile
router.get('/profile/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const profile = await tierService.getCityProfile(parseInt(cityId));

    if (!profile) {
      return res.status(404).json({
        error: `Economic profile not found for city: ${cityId}`
      });
    }

    res.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('❌ Error getting economic profile:', error);
    res.status(500).json({
      error: 'Failed to get economic profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get cities by tier
router.get('/tier/:tier', async (req, res) => {
  try {
    const { tier } = req.params;
    const { civilizationId, limit = 50 } = req.query;

    const validTiers = ['developing', 'industrial', 'advanced', 'post_scarcity'];
    if (!validTiers.includes(tier)) {
      return res.status(400).json({
        error: `Invalid tier: ${tier}. Must be one of: ${validTiers.join(', ')}`
      });
    }

    const cities = await tierService.getCitiesByTier(
      tier as any,
      civilizationId ? parseInt(civilizationId as string) : undefined,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      tier,
      civilization_id: civilizationId ? parseInt(civilizationId as string) : 'all',
      count: cities.length,
      cities: cities.map(city => ({
        city_id: city.city_id,
        current_tier: city.current_tier,
        development_stage: city.development_stage,
        tier_progress: city.tier_progress,
        gdp_per_capita: city.economic_indicators.gdp_per_capita,
        infrastructure_score: city.infrastructure.overall_score,
        innovation_index: city.innovation_metrics.innovation_index,
        quality_of_life: city.quality_of_life.overall_index,
        constraints_count: city.development_constraints.length,
        opportunities_count: city.growth_opportunities.length
      }))
    });

  } catch (error) {
    console.error('❌ Error getting cities by tier:', error);
    res.status(500).json({
      error: 'Failed to get cities by tier',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get tier definitions
router.get('/definitions', async (req, res) => {
  try {
    const definitions = await tierService.getTierDefinitions();

    res.json({
      success: true,
      definitions: definitions.map(def => ({
        tier: def.tier,
        name: def.name,
        description: def.description,
        characteristics: def.typical_characteristics,
        advancement_criteria: def.advancement_criteria,
        common_challenges: def.common_challenges,
        development_strategies: def.development_strategies,
        transition_pathways: def.transition_pathways
      }))
    });

  } catch (error) {
    console.error('❌ Error getting tier definitions:', error);
    res.status(500).json({
      error: 'Failed to get tier definitions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Assess current tier for a city
router.post('/assess/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const profile = await tierService.getCityProfile(parseInt(cityId));

    if (!profile) {
      return res.status(404).json({
        error: `Economic profile not found for city: ${cityId}`
      });
    }

    const assessedTier = evolutionEngine.assessCurrentTier(profile);
    const tierProgress = evolutionEngine.calculateTierProgress(profile);

    // Update profile if tier has changed
    if (assessedTier !== profile.current_tier) {
      await tierService.updateCityProfile(parseInt(cityId), {
        current_tier: assessedTier,
        tier_progress: tierProgress
      });

      // Record tier transition
      await tierService.recordTierTransition(
        parseInt(cityId),
        profile.current_tier,
        assessedTier,
        {
          duration_years: 0,
          key_factors: ['Assessment update'],
          catalyst_events: ['Tier reassessment'],
          challenges_overcome: [],
          lessons_learned: 'Tier updated based on current indicators'
        }
      );
    }

    res.json({
      success: true,
      city_id: parseInt(cityId),
      previous_tier: profile.current_tier,
      assessed_tier: assessedTier,
      tier_changed: assessedTier !== profile.current_tier,
      tier_progress: tierProgress,
      assessment_date: new Date()
    });

  } catch (error) {
    console.error('❌ Error assessing city tier:', error);
    res.status(500).json({
      error: 'Failed to assess city tier',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get development constraints
router.get('/constraints/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const profile = await tierService.getCityProfile(parseInt(cityId));

    if (!profile) {
      return res.status(404).json({
        error: `Economic profile not found for city: ${cityId}`
      });
    }

    const constraints = evolutionEngine.identifyDevelopmentConstraints(profile);

    res.json({
      success: true,
      city_id: parseInt(cityId),
      constraints_count: constraints.length,
      constraints: constraints.map(constraint => ({
        type: constraint.constraint_type,
        description: constraint.description,
        severity: constraint.severity,
        impact_areas: constraint.impact_areas,
        estimated_cost: constraint.estimated_cost_to_address,
        timeframe_years: constraint.timeframe_to_resolve,
        resolution_probability: constraint.probability_of_resolution,
        mitigation_strategies: constraint.mitigation_strategies
      }))
    });

  } catch (error) {
    console.error('❌ Error getting development constraints:', error);
    res.status(500).json({
      error: 'Failed to get development constraints',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get growth opportunities
router.get('/opportunities/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const profile = await tierService.getCityProfile(parseInt(cityId));

    if (!profile) {
      return res.status(404).json({
        error: `Economic profile not found for city: ${cityId}`
      });
    }

    const opportunities = evolutionEngine.recommendGrowthOpportunities(profile);

    res.json({
      success: true,
      city_id: parseInt(cityId),
      opportunities_count: opportunities.length,
      opportunities: opportunities.map(opp => ({
        type: opp.opportunity_type,
        title: opp.title,
        description: opp.description,
        potential_impact: opp.potential_impact,
        investment_required: opp.investment_required,
        timeframe_years: opp.timeframe_years,
        success_probability: opp.success_probability,
        risk_factors: opp.risk_factors,
        key_enablers: opp.key_enablers,
        expected_outcomes: opp.expected_outcomes
      }))
    });

  } catch (error) {
    console.error('❌ Error getting growth opportunities:', error);
    res.status(500).json({
      error: 'Failed to get growth opportunities',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Project development trajectory
router.post('/project/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const { years = 10 } = req.body;

    const profile = await tierService.getCityProfile(parseInt(cityId));

    if (!profile) {
      return res.status(404).json({
        error: `Economic profile not found for city: ${cityId}`
      });
    }

    const projections = evolutionEngine.projectDevelopmentTrajectory(profile, years);

    res.json({
      success: true,
      city_id: parseInt(cityId),
      projection_years: years,
      current_tier: profile.current_tier,
      projections: projections.map(proj => ({
        scenario_name: proj.scenario_name,
        probability: proj.probability,
        projected_tier: proj.projected_tier,
        key_assumptions: proj.key_assumptions,
        projected_indicators: proj.projected_indicators,
        critical_success_factors: proj.critical_success_factors,
        major_risks: proj.major_risks,
        policy_recommendations: proj.policy_recommendations
      }))
    });

  } catch (error) {
    console.error('❌ Error projecting development trajectory:', error);
    res.status(500).json({
      error: 'Failed to project development trajectory',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Simulate policy impact
router.post('/simulate-policy/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const { policyChanges } = req.body;

    if (!policyChanges || !Array.isArray(policyChanges)) {
      return res.status(400).json({
        error: 'Missing or invalid policyChanges array'
      });
    }

    const profile = await tierService.getCityProfile(parseInt(cityId));

    if (!profile) {
      return res.status(404).json({
        error: `Economic profile not found for city: ${cityId}`
      });
    }

    const impact = evolutionEngine.simulatePolicyImpact(profile, policyChanges);

    res.json({
      success: true,
      city_id: parseInt(cityId),
      policy_count: policyChanges.length,
      impact_assessment: {
        overall_impact_score: impact.overall_impact_score,
        affected_indicators: impact.affected_indicators,
        tier_advancement_probability: impact.tier_advancement_probability,
        cost_benefit_ratio: impact.cost_benefit_ratio,
        implementation_challenges: impact.implementation_challenges,
        unintended_consequences: impact.unintended_consequences,
        stakeholder_reactions: impact.stakeholder_reactions
      }
    });

  } catch (error) {
    console.error('❌ Error simulating policy impact:', error);
    res.status(500).json({
      error: 'Failed to simulate policy impact',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Benchmark against peers
router.get('/benchmark/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const profile = await tierService.getCityProfile(parseInt(cityId));

    if (!profile) {
      return res.status(404).json({
        error: `Economic profile not found for city: ${cityId}`
      });
    }

    const benchmark = evolutionEngine.benchmarkAgainstPeers(profile);

    res.json({
      success: true,
      city_id: parseInt(cityId),
      benchmark_analysis: {
        peer_cities: benchmark.peer_cities,
        relative_performance: benchmark.relative_performance,
        best_practices: benchmark.best_practices,
        performance_gaps: benchmark.performance_gaps,
        competitive_advantages: benchmark.competitive_advantages,
        improvement_priorities: benchmark.improvement_priorities
      }
    });

  } catch (error) {
    console.error('❌ Error benchmarking city:', error);
    res.status(500).json({
      error: 'Failed to benchmark city',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Generate development plan
router.post('/development-plan/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const { targetTier } = req.body;

    const validTiers = ['developing', 'industrial', 'advanced', 'post_scarcity'];
    if (!validTiers.includes(targetTier)) {
      return res.status(400).json({
        error: `Invalid target tier: ${targetTier}. Must be one of: ${validTiers.join(', ')}`
      });
    }

    const profile = await tierService.getCityProfile(parseInt(cityId));

    if (!profile) {
      return res.status(404).json({
        error: `Economic profile not found for city: ${cityId}`
      });
    }

    const plan = evolutionEngine.generateDevelopmentPlan(profile, targetTier);
    const planId = await tierService.createDevelopmentPlan(plan);

    res.json({
      success: true,
      city_id: parseInt(cityId),
      plan_id: planId,
      target_tier: targetTier,
      planning_horizon_years: plan.planning_horizon_years,
      strategic_objectives_count: plan.strategic_objectives.length,
      implementation_phases_count: plan.implementation_phases.length,
      total_investment_required: plan.resource_mobilization.total_investment_required,
      message: `Development plan created for city ${cityId} targeting ${targetTier} tier`
    });

  } catch (error) {
    console.error('❌ Error generating development plan:', error);
    res.status(500).json({
      error: 'Failed to generate development plan',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get economic indicators history
router.get('/history/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const { days = 365 } = req.query;

    const history = await tierService.getEconomicIndicatorsHistory(
      parseInt(cityId),
      parseInt(days as string)
    );

    res.json({
      success: true,
      city_id: parseInt(cityId),
      history_days: parseInt(days as string),
      data_points: history.length,
      history
    });

  } catch (error) {
    console.error('❌ Error getting economic indicators history:', error);
    res.status(500).json({
      error: 'Failed to get economic indicators history',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get tier transition history
router.get('/transitions/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const transitions = await tierService.getTierTransitionHistory(parseInt(cityId));

    res.json({
      success: true,
      city_id: parseInt(cityId),
      transitions_count: transitions.length,
      transitions
    });

  } catch (error) {
    console.error('❌ Error getting tier transition history:', error);
    res.status(500).json({
      error: 'Failed to get tier transition history',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get civilization tier statistics
router.get('/statistics/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const statistics = await tierService.getCivilizationTierStatistics(parseInt(civilizationId));

    res.json({
      success: true,
      statistics
    });

  } catch (error) {
    console.error('❌ Error getting civilization tier statistics:', error);
    res.status(500).json({
      error: 'Failed to get civilization tier statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get development plans for a city
router.get('/plans/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const plans = await tierService.getDevelopmentPlans(parseInt(cityId));

    res.json({
      success: true,
      city_id: parseInt(cityId),
      plans_count: plans.length,
      plans
    });

  } catch (error) {
    console.error('❌ Error getting development plans:', error);
    res.status(500).json({
      error: 'Failed to get development plans',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'economic-tiers', economicTiersKnobSystem, applyEconomicTiersKnobsToGameState);

export default router;
