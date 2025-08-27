const { migrationGameState, initializeMigrationSystem, generateIntegrationOutcomes, calculateMigrationAttractiveness, simulateMigrationEvents } = require('../game-state/migration-state.cjs');
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const migrationKnobsData = {
  // Immigration Policy
  immigration_openness: 0.5,           // AI can adjust immigration levels (0.0=closed, 1.0=open)
  refugee_acceptance: 0.6,             // AI can set refugee policy (0.0-1.0)
  skilled_worker_priority: 0.7,        // AI can prioritize skilled immigration (0.0-1.0)
  family_reunification_support: 0.6,   // AI can support family immigration (0.0-1.0)
  
  // Integration Support
  integration_program_funding: 0.5,    // AI can fund integration programs (0.0-1.0)
  language_education_investment: 0.6,  // AI can invest in language training (0.0-1.0)
  cultural_adaptation_support: 0.4,    // AI can support cultural programs (0.0-1.0)
  employment_assistance: 0.7,          // AI can provide job placement help (0.0-1.0)
  
  // Border Control
  border_security_level: 0.5,          // AI can adjust border security (0.0-1.0)
  documentation_strictness: 0.6,       // AI can set documentation requirements (0.0-1.0)
  deportation_enforcement: 0.3,        // AI can adjust deportation policy (0.0-1.0)
  
  // Economic Factors
  work_visa_accessibility: 0.6,        // AI can ease/restrict work visas (0.0-1.0)
  entrepreneur_visa_support: 0.7,      // AI can support business immigration (0.0-1.0)
  minimum_wage_protection: 0.8,        // AI can protect migrant workers (0.0-1.0)
  
  // Social Cohesion
  diversity_promotion: 0.5,            // AI can promote diversity (0.0-1.0)
  anti_discrimination_enforcement: 0.7, // AI can fight discrimination (0.0-1.0)
  community_integration_events: 0.4,   // AI can fund community events (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const migrationKnobSystem = new EnhancedKnobSystem(migrationKnobsData);

// Backward compatibility - expose knobs directly
const migrationKnobs = migrationKnobSystem.knobs;

// Structured Outputs - For AI consumption, HUD display, and game state
function generateMigrationStructuredOutputs() {
  const flows = Array.from(migrationGameState.migrationFlows.values());
  const policies = Array.from(migrationGameState.migrationPolicies.values());
  
  // Calculate migration metrics
  const totalMigrants = flows.reduce((sum, flow) => sum + flow.populationSize, 0);
  const immigrationFlows = flows.filter(flow => flow.type === 'immigration');
  const emigrationFlows = flows.filter(flow => flow.type === 'emigration');
  const netMigration = immigrationFlows.reduce((sum, flow) => sum + flow.populationSize, 0) - 
                      emigrationFlows.reduce((sum, flow) => sum + flow.populationSize, 0);
  
  return {
    // High-level metrics for AI decision-making
    migration_metrics: {
      total_migration_flows: flows.length,
      total_migrants: totalMigrants,
      net_migration: netMigration,
      immigration_rate: immigrationFlows.length / flows.length,
      integration_success_rate: calculateIntegrationSuccessRate(),
      economic_impact: calculateMigrationEconomicImpact(),
      social_cohesion_index: calculateSocialCohesionIndex()
    },
    
    // Migration flow analysis for AI strategic planning
    flow_analysis: {
      migration_patterns: analyzeMigrationPatterns(),
      source_country_diversity: analyzeSourceCountryDiversity(),
      skill_level_distribution: analyzeSkillLevelDistribution(),
      integration_outcomes: analyzeIntegrationOutcomes(),
      policy_effectiveness: analyzePolicyEffectiveness()
    },
    
    // Policy impact assessment for AI feedback
    policy_effectiveness: {
      immigration_policy_impact: assessImmigrationPolicy(),
      integration_program_success: assessIntegrationPrograms(),
      border_security_effectiveness: assessBorderSecurity(),
      economic_integration_outcomes: assessEconomicIntegration(),
      social_integration_success: assessSocialIntegration()
    },
    
    // Migration alerts and recommendations for AI attention
    ai_alerts: generateMigrationAIAlerts(),
    
    // Structured data for other systems
    cross_system_data: {
      workforce_contribution: calculateWorkforceContribution(),
      demographic_impact: calculateDemographicImpact(),
      economic_contribution: calculateEconomicContribution(),
      cultural_diversity_index: calculateCulturalDiversityIndex(),
      security_considerations: calculateSecurityConsiderations()
    },
    
    timestamp: Date.now(),
    knobs_applied: { ...migrationKnobs }
  };
}

function setupMigrationAPIs(app) {
  // Initialize migration system
  initializeMigrationSystem();

  // Get all migration flows
  app.get('/api/migration/flows', (req, res) => {
    const flows = Array.from(migrationGameState.migrationFlows.values());
    res.json({
      total: flows.length,
      flows: flows
    });
  });

  // Get migration flows for a specific city
  app.get('/api/migration/flows/city/:cityId', (req, res) => {
    const { cityId } = req.params;
    const flows = Array.from(migrationGameState.migrationFlows.values());
    
    const cityFlows = flows.filter(flow => 
      flow.originCityId === cityId || flow.destinationCityId === cityId
    );
    
    const inflows = cityFlows.filter(flow => flow.destinationCityId === cityId);
    const outflows = cityFlows.filter(flow => flow.originCityId === cityId);
    
    res.json({
      cityId: cityId,
      total: cityFlows.length,
      inflows: inflows.length,
      outflows: outflows.length,
      flows: cityFlows
    });
  });

  // Create new migration flow
  app.post('/api/migration/flows', (req, res) => {
    const flowData = req.body;
    const flowId = `migration_flow_${migrationGameState.globalMigrationCounter++}`;
    
    const newFlow = {
      id: flowId,
      type: flowData.type || 'immigration',
      subtype: flowData.subtype || 'economic',
      originCountry: flowData.originCountry,
      originCityId: flowData.originCityId,
      destinationCityId: flowData.destinationCityId,
      populationSize: flowData.populationSize || 100,
      legalStatus: flowData.legalStatus || 'documented',
      startDate: new Date(),
      expectedDuration: flowData.expectedDuration || 365,
      status: 'active',
      documentationLevel: flowData.documentationLevel || 75,
      economicDrivers: flowData.economicDrivers || {
        unemployment_differential: Math.random() * 10,
        wage_differential: Math.random() * 50,
        cost_of_living_ratio: 0.5 + Math.random() * 2,
        economic_growth_rate: Math.random() * 6 - 1,
        job_availability: Math.random()
      },
      culturalCompatibility: flowData.culturalCompatibility || {
        language_similarity: Math.random() * 100,
        religious_compatibility: Math.random() * 100,
        social_customs_alignment: Math.random() * 100,
        educational_system_compatibility: Math.random() * 100,
        political_system_similarity: Math.random() * 100
      },
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    migrationGameState.migrationFlows.set(flowId, newFlow);
    generateIntegrationOutcomes(flowId, newFlow);
    
    res.json({ id: flowId, ...newFlow });
  });

  // Get migration policies
  app.get('/api/migration/policies', (req, res) => {
    const policies = Array.from(migrationGameState.migrationPolicies.values());
    res.json({
      total: policies.length,
      policies: policies
    });
  });

  // Create new migration policy
  app.post('/api/migration/policies', (req, res) => {
    const policyData = req.body;
    const policyId = `migration_policy_${migrationGameState.globalPolicyCounter++}`;
    
    const newPolicy = {
      id: policyId,
      name: policyData.name,
      description: policyData.description,
      type: policyData.type || 'quota',
      status: 'active',
      implementationDate: new Date(),
      targetGroups: policyData.targetGroups || ['economic'],
      enforcementLevel: policyData.enforcementLevel || 75,
      publicSupport: policyData.publicSupport || 60,
      implementationCost: policyData.implementationCost || 1000000,
      annualOperatingCost: policyData.annualOperatingCost || 500000,
      effects: policyData.effects || {
        flowMultiplier: 1.0,
        legalPathwayStrength: 50,
        illegalFlowReduction: 10,
        integrationSupport: 50,
        economicImpact: 0,
        socialCohesion: 0
      },
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    migrationGameState.migrationPolicies.set(policyId, newPolicy);
    res.json({ id: policyId, ...newPolicy });
  });

  // Get integration outcomes for a city
  app.get('/api/migration/integration/:cityId', (req, res) => {
    const { cityId } = req.params;
    const flows = Array.from(migrationGameState.migrationFlows.values());
    const cityFlows = flows.filter(flow => flow.destinationCityId === cityId);
    
    let allOutcomes = [];
    cityFlows.forEach(flow => {
      const outcomes = migrationGameState.integrationOutcomes.get(flow.id) || [];
      allOutcomes = allOutcomes.concat(outcomes);
    });
    
    // Calculate summary statistics
    const summary = {
      totalMigrants: allOutcomes.length,
      averageIntegrationScore: allOutcomes.reduce((sum, o) => sum + o.integrationScore, 0) / allOutcomes.length || 0,
      successRate: (allOutcomes.filter(o => o.integrationScore >= 70).length / allOutcomes.length * 100) || 0,
      stageDistribution: {}
    };
    
    // Calculate stage distribution
    migrationGameState.integrationStages.forEach(stage => {
      summary.stageDistribution[stage] = allOutcomes.filter(o => o.integrationStage === stage).length;
    });
    
    res.json({
      cityId: cityId,
      summary: summary,
      outcomes: allOutcomes
    });
  });

  // Get migration analytics for a city
  app.get('/api/migration/analytics/:cityId', (req, res) => {
    const { cityId } = req.params;
    const { timeframe = 'monthly' } = req.query;
    
    const flows = Array.from(migrationGameState.migrationFlows.values());
    const cityFlows = flows.filter(flow => 
      flow.originCityId === cityId || flow.destinationCityId === cityId
    );
    
    const inflows = cityFlows.filter(flow => flow.destinationCityId === cityId);
    const outflows = cityFlows.filter(flow => flow.originCityId === cityId);
    
    // Flow analytics
    const flowAnalytics = {
      totalInflows: inflows.reduce((sum, flow) => sum + flow.populationSize, 0),
      totalOutflows: outflows.reduce((sum, flow) => sum + flow.populationSize, 0),
      netMigration: inflows.reduce((sum, flow) => sum + flow.populationSize, 0) - 
                    outflows.reduce((sum, flow) => sum + flow.populationSize, 0),
      migrationRate: 0, // Would calculate based on city population
      flowsByType: {},
      flowsByLegalStatus: {}
    };
    
    // Calculate flows by type and legal status
    cityFlows.forEach(flow => {
      flowAnalytics.flowsByType[flow.type] = (flowAnalytics.flowsByType[flow.type] || 0) + 1;
      flowAnalytics.flowsByLegalStatus[flow.legalStatus] = (flowAnalytics.flowsByLegalStatus[flow.legalStatus] || 0) + 1;
    });
    
    // Integration analytics
    let allOutcomes = [];
    inflows.forEach(flow => {
      const outcomes = migrationGameState.integrationOutcomes.get(flow.id) || [];
      allOutcomes = allOutcomes.concat(outcomes);
    });
    
    const integrationAnalytics = {
      averageIntegrationScore: allOutcomes.reduce((sum, o) => sum + o.integrationScore, 0) / allOutcomes.length || 0,
      integrationSuccessRate: (allOutcomes.filter(o => o.integrationScore >= 70).length / allOutcomes.length * 100) || 0,
      economicIntegrationAvg: allOutcomes.reduce((sum, o) => sum + o.economicIntegration.employmentRate, 0) / allOutcomes.length || 0,
      socialIntegrationAvg: allOutcomes.reduce((sum, o) => sum + o.socialIntegration.languageProficiency, 0) / allOutcomes.length || 0,
      integrationByStage: {}
    };
    
    migrationGameState.integrationStages.forEach(stage => {
      integrationAnalytics.integrationByStage[stage] = allOutcomes.filter(o => o.integrationStage === stage).length;
    });
    
    // Economic impact
    const economicImpact = {
      laborForceContribution: allOutcomes.reduce((sum, o) => sum + (o.economicIntegration.employmentRate > 50 ? 1 : 0), 0),
      taxContribution: allOutcomes.reduce((sum, o) => sum + (o.economicIntegration.averageIncome * 0.25), 0),
      entrepreneurshipImpact: allOutcomes.reduce((sum, o) => sum + o.economicIntegration.entrepreneurshipRate, 0) / allOutcomes.length || 0,
      remittanceOutflows: allOutcomes.reduce((sum, o) => sum + (o.economicIntegration.averageIncome * 0.1), 0),
      servicesCost: allOutcomes.length * 5000 // Estimated cost per migrant
    };
    
    // Social impact
    const socialImpact = {
      culturalDiversity: Math.min(100, allOutcomes.length * 2),
      socialCohesion: 100 - (allOutcomes.filter(o => o.challenges.length > 3).length / allOutcomes.length * 50),
      communityVitality: allOutcomes.reduce((sum, o) => sum + o.socialIntegration.communityParticipation, 0) / allOutcomes.length || 0,
      discriminationReports: Math.floor(allOutcomes.length * 0.05)
    };
    
    // Policy effectiveness
    const policies = Array.from(migrationGameState.migrationPolicies.values());
    const activePolicies = policies.filter(p => p.status === 'active');
    const policyEffectiveness = {
      activePolicies: activePolicies.length,
      policyComplianceRate: activePolicies.reduce((sum, p) => sum + p.enforcementLevel, 0) / activePolicies.length || 0,
      policyImpactScore: activePolicies.reduce((sum, p) => sum + p.effects.integrationSupport, 0) / activePolicies.length || 0
    };
    
    res.json({
      cityId: cityId,
      timeframe: timeframe,
      flowAnalytics: flowAnalytics,
      integrationAnalytics: integrationAnalytics,
      economicImpact: economicImpact,
      socialImpact: socialImpact,
      policyEffectiveness: policyEffectiveness
    });
  });

  // Get migration events
  app.get('/api/migration/events', (req, res) => {
    const { limit = 50 } = req.query;
    const events = migrationGameState.migrationEvents.slice(-parseInt(limit));
    
    res.json({
      total: migrationGameState.migrationEvents.length,
      events: events.reverse() // Most recent first
    });
  });

  // Simulate migration system
  app.post('/api/migration/simulate', (req, res) => {
    try {
      // Generate new migration event
      const newEvent = simulateMigrationEvents();
      
      // Update existing flows based on events
      let updatedFlows = 0;
      migrationGameState.migrationFlows.forEach((flow, flowId) => {
        if (newEvent.affectedCities.includes(flow.originCityId) || 
            newEvent.affectedCities.includes(flow.destinationCityId)) {
          
          // Apply event effects
          flow.populationSize = Math.floor(flow.populationSize * newEvent.migrationImpact.flowMultiplier);
          flow.expectedDuration += newEvent.migrationImpact.durationExtension;
          flow.lastUpdated = new Date();
          
          updatedFlows++;
        }
      });
      
      // Update integration outcomes
      let updatedOutcomes = 0;
      migrationGameState.integrationOutcomes.forEach((outcomes, flowId) => {
        outcomes.forEach(outcome => {
          // Simulate progression through integration stages
          if (Math.random() < 0.1) { // 10% chance of stage progression
            const currentStageIndex = migrationGameState.integrationStages.indexOf(outcome.integrationStage);
            if (currentStageIndex < migrationGameState.integrationStages.length - 1) {
              outcome.integrationStage = migrationGameState.integrationStages[currentStageIndex + 1];
              const { calculateIntegrationScore } = require('../game-state/migration-state.cjs');
              outcome.integrationScore = calculateIntegrationScore(
                outcome.integrationStage, 
                migrationGameState.migrationFlows.get(flowId)?.culturalCompatibility || {},
                outcome.timeInDestination
              );
              outcome.timeInDestination += 1;
              outcome.lastUpdated = new Date();
              updatedOutcomes++;
            }
          }
        });
      });
      
      res.json({
        success: true,
        timestamp: new Date(),
        newEvent: newEvent,
        updatedFlows: updatedFlows,
        updatedOutcomes: updatedOutcomes,
        activeFlows: migrationGameState.migrationFlows.size,
        recentEvents: migrationGameState.migrationEvents.slice(-5)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Helper functions for migration structured outputs (streamlined)
  function calculateIntegrationSuccessRate() {
    const outcomes = Array.from(migrationGameState.integrationOutcomes.values());
    const successful = outcomes.filter(outcome => outcome.overallIntegrationScore > 0.7).length;
    return outcomes.length > 0 ? successful / outcomes.length : 0.5;
  }

  function calculateMigrationEconomicImpact() {
    const flows = Array.from(migrationGameState.migrationFlows.values());
    const economicContribution = flows.reduce((sum, flow) => sum + (flow.economicContribution || 0), 0);
    return economicContribution / flows.length || 0;
  }

  function calculateSocialCohesionIndex() {
    const diversity = migrationKnobs.diversity_promotion;
    const antiDiscrimination = migrationKnobs.anti_discrimination_enforcement;
    const integration = migrationKnobs.integration_program_funding;
    return (diversity + antiDiscrimination + integration) / 3;
  }

  function analyzeMigrationPatterns() {
    const flows = Array.from(migrationGameState.migrationFlows.values());
    const patterns = {
      economic_migration: flows.filter(f => f.subtype === 'economic').length,
      refugee_migration: flows.filter(f => f.subtype === 'refugee').length,
      family_migration: flows.filter(f => f.subtype === 'family').length,
      skilled_migration: flows.filter(f => f.subtype === 'skilled').length
    };
    return patterns;
  }

  function analyzeSourceCountryDiversity() {
    const flows = Array.from(migrationGameState.migrationFlows.values());
    const countries = new Set(flows.map(f => f.originCountry));
    return { unique_countries: countries.size, diversity_index: Math.min(1.0, countries.size / 20) };
  }

  function analyzeSkillLevelDistribution() {
    const flows = Array.from(migrationGameState.migrationFlows.values());
    const skilled = flows.filter(f => f.skillLevel === 'high' || f.skillLevel === 'specialized').length;
    return { skilled_ratio: flows.length > 0 ? skilled / flows.length : 0.5 };
  }

  function analyzeIntegrationOutcomes() {
    const outcomes = Array.from(migrationGameState.integrationOutcomes.values());
    const avgScore = outcomes.reduce((sum, o) => sum + o.overallIntegrationScore, 0) / outcomes.length || 0.5;
    return { average_integration_score: avgScore, successful_integrations: outcomes.filter(o => o.overallIntegrationScore > 0.7).length };
  }

  function analyzePolicyEffectiveness() {
    const policies = Array.from(migrationGameState.migrationPolicies.values());
    const effective = policies.filter(p => p.effects?.integrationSupport > 0.6).length;
    return { effective_policies: effective, total_policies: policies.length };
  }

  function assessImmigrationPolicy() {
    const openness = migrationKnobs.immigration_openness;
    const flows = Array.from(migrationGameState.migrationFlows.values());
    const immigrationFlows = flows.filter(f => f.type === 'immigration').length;
    return { policy_openness: openness, immigration_volume: immigrationFlows, policy_impact: openness * immigrationFlows };
  }

  function assessIntegrationPrograms() {
    const funding = migrationKnobs.integration_program_funding;
    const language = migrationKnobs.language_education_investment;
    const employment = migrationKnobs.employment_assistance;
    const success = calculateIntegrationSuccessRate();
    return { program_strength: (funding + language + employment) / 3, success_rate: success };
  }

  function assessBorderSecurity() {
    const security = migrationKnobs.border_security_level;
    const documentation = migrationKnobs.documentation_strictness;
    const flows = Array.from(migrationGameState.migrationFlows.values());
    const documentedFlows = flows.filter(f => f.legalStatus === 'documented').length;
    return { security_level: security, documentation_rate: flows.length > 0 ? documentedFlows / flows.length : 0.8 };
  }

  function assessEconomicIntegration() {
    const workVisa = migrationKnobs.work_visa_accessibility;
    const entrepreneur = migrationKnobs.entrepreneur_visa_support;
    const wageProtection = migrationKnobs.minimum_wage_protection;
    const economicImpact = calculateMigrationEconomicImpact();
    return { policy_support: (workVisa + entrepreneur + wageProtection) / 3, economic_outcome: economicImpact };
  }

  function assessSocialIntegration() {
    const diversity = migrationKnobs.diversity_promotion;
    const antiDiscrimination = migrationKnobs.anti_discrimination_enforcement;
    const community = migrationKnobs.community_integration_events;
    const cohesion = calculateSocialCohesionIndex();
    return { social_policies: (diversity + antiDiscrimination + community) / 3, cohesion_index: cohesion };
  }

  function generateMigrationAIAlerts() {
    const alerts = [];
    const flows = Array.from(migrationGameState.migrationFlows.values());
    
    // Immigration surge alert
    const recentFlows = flows.filter(f => Date.now() - new Date(f.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000); // Last 30 days
    if (recentFlows.length > flows.length * 0.3) {
      alerts.push({ type: 'immigration_surge', severity: 'medium', message: 'Significant increase in immigration flows detected' });
    }
    
    // Integration crisis alert
    const integrationRate = calculateIntegrationSuccessRate();
    if (integrationRate < 0.4) {
      alerts.push({ type: 'integration_crisis', severity: 'high', message: 'Low integration success rate requires immediate attention' });
    }
    
    // Border security alert
    const undocumentedFlows = flows.filter(f => f.legalStatus === 'undocumented').length;
    if (undocumentedFlows > flows.length * 0.2) {
      alerts.push({ type: 'border_security', severity: 'medium', message: 'High rate of undocumented migration detected' });
    }
    
    return alerts;
  }

  function calculateWorkforceContribution() {
    const flows = Array.from(migrationGameState.migrationFlows.values());
    const workingAge = flows.filter(f => f.ageDistribution?.working_age > 0.6).length;
    const skilled = flows.filter(f => f.skillLevel === 'high' || f.skillLevel === 'specialized').length;
    return { working_age_migrants: workingAge, skilled_migrants: skilled, workforce_impact: workingAge + skilled * 1.5 };
  }

  function calculateDemographicImpact() {
    const flows = Array.from(migrationGameState.migrationFlows.values());
    const totalMigrants = flows.reduce((sum, f) => sum + f.populationSize, 0);
    const youngMigrants = flows.filter(f => f.ageDistribution?.young_adults > 0.4).length;
    return { total_population_change: totalMigrants, demographic_rejuvenation: youngMigrants };
  }

  function calculateEconomicContribution() {
    const flows = Array.from(migrationGameState.migrationFlows.values());
    const entrepreneurs = flows.filter(f => f.subtype === 'entrepreneur').length;
    const economicImpact = calculateMigrationEconomicImpact();
    return { entrepreneur_migrants: entrepreneurs, economic_multiplier: economicImpact };
  }

  function calculateCulturalDiversityIndex() {
    const flows = Array.from(migrationGameState.migrationFlows.values());
    const countries = new Set(flows.map(f => f.originCountry));
    const cultures = new Set(flows.map(f => f.culturalBackground));
    return { country_diversity: countries.size, cultural_diversity: cultures.size, diversity_index: (countries.size + cultures.size) / 40 };
  }

  function calculateSecurityConsiderations() {
    const flows = Array.from(migrationGameState.migrationFlows.values());
    const securityScreened = flows.filter(f => f.securityScreening === 'completed').length;
    const riskLevel = migrationKnobs.border_security_level;
    return { screening_rate: flows.length > 0 ? securityScreened / flows.length : 0.8, security_posture: riskLevel };
  }

  // Apply AI knobs to actual migration game state
  function applyMigrationKnobsToGameState() {
    const flows = Array.from(migrationGameState.migrationFlows.values());
    const policies = Array.from(migrationGameState.migrationPolicies.values());
    
    // Apply immigration openness to flow acceptance rates
    flows.forEach(flow => {
      if (flow.type === 'immigration') {
        const openness = migrationKnobs.immigration_openness;
        flow.approvalProbability = Math.min(1.0, (flow.approvalProbability || 0.7) + (openness - 0.5) * 0.4);
        
        // Apply skilled worker priority
        if (flow.skillLevel === 'high' || flow.skillLevel === 'specialized') {
          const skillBonus = migrationKnobs.skilled_worker_priority * 0.2;
          flow.approvalProbability = Math.min(1.0, flow.approvalProbability + skillBonus);
        }
        
        // Apply refugee acceptance
        if (flow.subtype === 'refugee') {
          const refugeePolicy = migrationKnobs.refugee_acceptance;
          flow.approvalProbability = Math.min(1.0, (flow.approvalProbability || 0.5) + (refugeePolicy - 0.5) * 0.6);
        }
      }
    });
    
    // Apply integration support to outcomes
    const outcomes = Array.from(migrationGameState.integrationOutcomes.values());
    outcomes.forEach(outcome => {
      const integrationBonus = migrationKnobs.integration_program_funding * 0.3;
      const languageBonus = migrationKnobs.language_education_investment * 0.2;
      const employmentBonus = migrationKnobs.employment_assistance * 0.25;
      
      outcome.overallIntegrationScore = Math.min(1.0, 
        outcome.overallIntegrationScore + integrationBonus + languageBonus + employmentBonus);
      
      // Apply cultural adaptation support
      if (outcome.culturalIntegration) {
        const culturalBonus = migrationKnobs.cultural_adaptation_support * 0.15;
        outcome.culturalIntegration.adaptationScore = Math.min(1.0, 
          outcome.culturalIntegration.adaptationScore + culturalBonus);
      }
    });
    
    // Apply border security to documentation rates
    const securityLevel = migrationKnobs.border_security_level;
    flows.forEach(flow => {
      if (securityLevel > 0.7 && flow.legalStatus === 'undocumented') {
        // High security reduces undocumented flows
        flow.populationSize = Math.floor(flow.populationSize * (1 - (securityLevel - 0.7) * 0.5));
      }
    });
    
    console.log('🎛️ Migration knobs applied to game state:', {
      immigration_openness: migrationKnobs.immigration_openness,
      integration_funding: migrationKnobs.integration_program_funding,
      border_security: migrationKnobs.border_security_level,
      skilled_worker_priority: migrationKnobs.skilled_worker_priority
    });
  }

  // ===== AI INTEGRATION ENDPOINTS =====
  
  // Enhanced AI knob endpoints with multi-format input support
  app.get('/api/migration/knobs', (req, res) => {
    const knobData = migrationKnobSystem.getKnobsWithMetadata();
    res.json({
      ...knobData,
      system: 'migration',
      description: 'AI-adjustable parameters for migration system with enhanced input support',
      input_help: migrationKnobSystem.getKnobDescriptions()
    });
  });

  app.post('/api/migration/knobs', (req, res) => {
    const { knobs, source = 'ai' } = req.body;
    
    if (!knobs || typeof knobs !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid knobs data. Expected object with knob values.',
        help: migrationKnobSystem.getKnobDescriptions().examples
      });
    }
    
    // Update knobs using enhanced system
    const updateResult = migrationKnobSystem.updateKnobs(knobs, source);
    
    // Apply knobs to game state
    try {
      applyMigrationKnobsToGameState();
    } catch (error) {
      console.error('Error applying migration knobs to game state:', error);
    }
    
    res.json({
      success: updateResult.success,
      system: 'migration',
      ...updateResult,
      message: 'Migration knobs updated successfully using enhanced input processing'
    });
  });

  // Get knob help/documentation
  app.get('/api/migration/knobs/help', (req, res) => {
    res.json({
      system: 'migration',
      help: migrationKnobSystem.getKnobDescriptions(),
      current_values: migrationKnobSystem.getKnobsWithMetadata()
    });
  });

  // Get structured outputs for AI consumption
  app.get('/api/migration/ai-data', (req, res) => {
    const structuredData = generateMigrationStructuredOutputs();
    res.json({
      ...structuredData,
      description: 'Structured migration data for AI analysis and decision-making'
    });
  });

  // Get cross-system integration data
  app.get('/api/migration/cross-system', (req, res) => {
    const outputs = generateMigrationStructuredOutputs();
    res.json({
      workforce_data: outputs.cross_system_data.workforce_contribution,
      demographic_data: outputs.cross_system_data.demographic_impact,
      economic_data: outputs.cross_system_data.economic_contribution,
      cultural_data: outputs.cross_system_data.cultural_diversity_index,
      security_data: outputs.cross_system_data.security_considerations,
      migration_summary: outputs.migration_metrics,
      timestamp: outputs.timestamp
    });
  });
}

module.exports = { setupMigrationAPIs };
