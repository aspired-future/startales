const { migrationGameState, initializeMigrationSystem, generateIntegrationOutcomes, calculateMigrationAttractiveness, simulateMigrationEvents } = require('../game-state/migration-state.cjs');

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
}

module.exports = { setupMigrationAPIs };
