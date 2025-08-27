// ===== ENHANCED MIGRATION SYSTEM =====
const migrationGameState = {
  migrationFlows: new Map(),
  migrationPolicies: new Map(),
  integrationOutcomes: new Map(),
  migrationEvents: [],
  globalMigrationCounter: 1,
  globalPolicyCounter: 1,
  globalEventCounter: 1,
  
  // Migration flow types and subtypes
  migrationTypes: {
    immigration: ['economic', 'family_reunification', 'refugee', 'skilled_worker', 'student', 'retirement'],
    internal: ['urban_rural', 'rural_urban', 'intercity', 'interplanetary', 'climate_driven', 'resource_driven'],
    emigration: ['economic_opportunity', 'political', 'environmental', 'education', 'retirement', 'family']
  },
  
  // Legal status categories
  legalStatuses: ['documented', 'undocumented', 'refugee', 'asylum_seeker', 'temporary_worker', 'permanent_resident'],
  
  // Integration stages
  integrationStages: ['arrival', 'initial_settlement', 'adaptation', 'integration', 'full_integration'],
  
  // Economic drivers for migration
  economicDrivers: {
    unemployment_differential: { weight: 0.3, threshold: 5.0 },
    wage_differential: { weight: 0.25, threshold: 20.0 },
    cost_of_living_ratio: { weight: 0.2, threshold: 1.5 },
    economic_growth_rate: { weight: 0.15, threshold: 3.0 },
    job_availability: { weight: 0.1, threshold: 0.8 }
  },
  
  // Cultural factors affecting integration
  culturalFactors: {
    language_similarity: { weight: 0.3, max_score: 100 },
    religious_compatibility: { weight: 0.2, max_score: 100 },
    social_customs_alignment: { weight: 0.25, max_score: 100 },
    educational_system_compatibility: { weight: 0.15, max_score: 100 },
    political_system_similarity: { weight: 0.1, max_score: 100 }
  }
};

// Initialize migration system with sample data
function initializeMigrationSystem() {
  const { citiesGameState } = require('./cities-state.cjs');
  
  // Create sample migration flows
  const sampleFlows = [
    {
      type: 'immigration',
      subtype: 'economic',
      originCountry: 'Terra Prime',
      originCityId: 'city_1',
      destinationCityId: 'city_2',
      populationSize: 15000,
      legalStatus: 'documented',
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      expectedDuration: 365, // days
      status: 'active',
      documentationLevel: 85,
      economicDrivers: {
        unemployment_differential: 8.5,
        wage_differential: 35.0,
        cost_of_living_ratio: 1.2,
        economic_growth_rate: 4.2,
        job_availability: 0.92
      },
      culturalCompatibility: {
        language_similarity: 75,
        religious_compatibility: 60,
        social_customs_alignment: 70,
        educational_system_compatibility: 85,
        political_system_similarity: 80
      }
    },
    {
      type: 'internal',
      subtype: 'interplanetary',
      originCityId: 'city_3',
      destinationCityId: 'city_1',
      populationSize: 8000,
      legalStatus: 'documented',
      startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      expectedDuration: 180,
      status: 'active',
      documentationLevel: 95,
      economicDrivers: {
        unemployment_differential: 3.2,
        wage_differential: 15.0,
        cost_of_living_ratio: 0.8,
        economic_growth_rate: 2.8,
        job_availability: 0.88
      },
      culturalCompatibility: {
        language_similarity: 95,
        religious_compatibility: 90,
        social_customs_alignment: 85,
        educational_system_compatibility: 95,
        political_system_similarity: 100
      }
    },
    {
      type: 'immigration',
      subtype: 'refugee',
      originCountry: 'Outer Rim Territories',
      destinationCityId: 'city_2',
      populationSize: 12000,
      legalStatus: 'refugee',
      startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      expectedDuration: 730,
      status: 'active',
      documentationLevel: 70,
      economicDrivers: {
        unemployment_differential: 25.0,
        wage_differential: 60.0,
        cost_of_living_ratio: 2.1,
        economic_growth_rate: -1.5,
        job_availability: 0.45
      },
      culturalCompatibility: {
        language_similarity: 40,
        religious_compatibility: 30,
        social_customs_alignment: 35,
        educational_system_compatibility: 55,
        political_system_similarity: 25
      }
    }
  ];

  sampleFlows.forEach(flow => {
    const flowId = `migration_flow_${migrationGameState.globalMigrationCounter++}`;
    flow.id = flowId;
    flow.createdAt = flow.startDate;
    flow.lastUpdated = new Date();
    migrationGameState.migrationFlows.set(flowId, flow);
  });

  // Create sample migration policies
  const samplePolicies = [
    {
      name: 'Skilled Worker Acceleration Program',
      description: 'Fast-track immigration for high-skilled workers in technology and research sectors',
      type: 'points_system',
      status: 'active',
      implementationDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      targetGroups: ['skilled_worker', 'student'],
      enforcementLevel: 85,
      publicSupport: 72,
      implementationCost: 2500000,
      annualOperatingCost: 800000,
      effects: {
        flowMultiplier: 1.4,
        legalPathwayStrength: 85,
        illegalFlowReduction: 15,
        integrationSupport: 75,
        economicImpact: 25,
        socialCohesion: 10
      }
    },
    {
      name: 'Inter-Civilization Cultural Exchange',
      description: 'Promotes cultural integration through education and community programs',
      type: 'integration_support',
      status: 'active',
      implementationDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      targetGroups: ['economic', 'family_reunification', 'refugee'],
      enforcementLevel: 70,
      publicSupport: 68,
      implementationCost: 1800000,
      annualOperatingCost: 1200000,
      effects: {
        flowMultiplier: 1.0,
        legalPathwayStrength: 60,
        illegalFlowReduction: 5,
        integrationSupport: 90,
        economicImpact: 15,
        socialCohesion: 35
      }
    },
    {
      name: 'Refugee Protection Initiative',
      description: 'Comprehensive support system for refugees and asylum seekers',
      type: 'refugee',
      status: 'active',
      implementationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      targetGroups: ['refugee'],
      enforcementLevel: 95,
      publicSupport: 55,
      implementationCost: 5000000,
      annualOperatingCost: 3200000,
      effects: {
        flowMultiplier: 1.8,
        legalPathwayStrength: 95,
        illegalFlowReduction: 40,
        integrationSupport: 85,
        economicImpact: -5,
        socialCohesion: -10
      }
    }
  ];

  samplePolicies.forEach(policy => {
    const policyId = `migration_policy_${migrationGameState.globalPolicyCounter++}`;
    policy.id = policyId;
    policy.createdAt = policy.implementationDate;
    policy.lastUpdated = new Date();
    migrationGameState.migrationPolicies.set(policyId, policy);
  });

  // Generate integration outcomes for existing flows
  migrationGameState.migrationFlows.forEach((flow, flowId) => {
    generateIntegrationOutcomes(flowId, flow);
  });

  console.log(`Migration system initialized with ${migrationGameState.migrationFlows.size} flows and ${migrationGameState.migrationPolicies.size} policies`);
}

// Generate integration outcomes for a migration flow
function generateIntegrationOutcomes(flowId, flow) {
  const numOutcomes = Math.min(flow.populationSize, 50); // Limit for performance
  const outcomes = [];

  for (let i = 0; i < numOutcomes; i++) {
    const timeInDestination = Math.floor(Math.random() * 24) + 1; // 1-24 months
    const integrationStage = determineIntegrationStage(timeInDestination, flow.culturalCompatibility);
    
    const outcome = {
      id: `integration_${flowId}_${i + 1}`,
      flowId: flowId,
      migrantId: `migrant_${flowId}_${i + 1}`,
      timeInDestination: timeInDestination,
      integrationStage: integrationStage,
      integrationScore: calculateIntegrationScore(integrationStage, flow.culturalCompatibility, timeInDestination),
      economicIntegration: {
        employmentRate: Math.random() * 100,
        averageIncome: 35000 + Math.random() * 40000,
        socialMobility: Math.random() * 100,
        entrepreneurshipRate: Math.random() * 15
      },
      socialIntegration: {
        languageProficiency: Math.random() * 100,
        culturalAdaptation: Math.random() * 100,
        socialNetworkSize: Math.floor(Math.random() * 50) + 5,
        communityParticipation: Math.random() * 100
      },
      challenges: generateIntegrationChallenges(),
      supportServices: generateSupportServices(),
      lastUpdated: new Date()
    };

    outcomes.push(outcome);
  }

  migrationGameState.integrationOutcomes.set(flowId, outcomes);
}

// Determine integration stage based on time and cultural compatibility
function determineIntegrationStage(timeInDestination, culturalCompatibility) {
  const avgCompatibility = Object.values(culturalCompatibility).reduce((sum, val) => sum + val, 0) / Object.keys(culturalCompatibility).length;
  
  // Higher cultural compatibility accelerates integration
  const compatibilityMultiplier = avgCompatibility / 100;
  const adjustedTime = timeInDestination * compatibilityMultiplier;

  if (adjustedTime < 3) return 'arrival';
  if (adjustedTime < 8) return 'initial_settlement';
  if (adjustedTime < 15) return 'adaptation';
  if (adjustedTime < 24) return 'integration';
  return 'full_integration';
}

// Calculate overall integration score
function calculateIntegrationScore(stage, culturalCompatibility, timeInDestination) {
  const stageScores = {
    arrival: 20,
    initial_settlement: 35,
    adaptation: 55,
    integration: 75,
    full_integration: 90
  };

  const baseScore = stageScores[stage] || 20;
  const avgCompatibility = Object.values(culturalCompatibility).reduce((sum, val) => sum + val, 0) / Object.keys(culturalCompatibility).length;
  const timeBonus = Math.min(timeInDestination * 2, 20);
  
  return Math.min(baseScore + (avgCompatibility * 0.3) + timeBonus, 100);
}

// Generate integration challenges
function generateIntegrationChallenges() {
  const allChallenges = [
    'Language barriers', 'Cultural differences', 'Employment discrimination', 
    'Housing access', 'Educational credential recognition', 'Social isolation',
    'Legal documentation issues', 'Healthcare access', 'Financial services access'
  ];
  
  const numChallenges = Math.floor(Math.random() * 4) + 1;
  const challenges = [];
  
  for (let i = 0; i < numChallenges; i++) {
    const challenge = allChallenges[Math.floor(Math.random() * allChallenges.length)];
    if (!challenges.includes(challenge)) {
      challenges.push(challenge);
    }
  }
  
  return challenges;
}

// Generate support services
function generateSupportServices() {
  const allServices = [
    'Language classes', 'Job placement assistance', 'Cultural orientation',
    'Legal aid', 'Housing assistance', 'Healthcare navigation',
    'Educational support', 'Mental health services', 'Community integration programs'
  ];
  
  const numServices = Math.floor(Math.random() * 5) + 2;
  const services = [];
  
  for (let i = 0; i < numServices; i++) {
    const service = allServices[Math.floor(Math.random() * allServices.length)];
    if (!services.includes(service)) {
      services.push(service);
    }
  }
  
  return services;
}

// Calculate migration attractiveness between cities
function calculateMigrationAttractiveness(originCityId, destinationCityId) {
  const { citiesGameState } = require('./cities-state.cjs');
  const originCity = citiesGameState.cities.get(originCityId);
  const destinationCity = citiesGameState.cities.get(destinationCityId);
  
  if (!originCity || !destinationCity) return 0;

  // Economic factors
  const economicScore = (
    (destinationCity.averageIncome - originCity.averageIncome) * 0.3 +
    (destinationCity.qualityOfLife - originCity.qualityOfLife) * 0.25
  );

  // Infrastructure and services
  const infrastructureScore = (
    (destinationCity.averageInfrastructureLevel - originCity.averageInfrastructureLevel) * 10
  );

  return Math.max(0, economicScore + infrastructureScore);
}

// Simulate migration events
function simulateMigrationEvents() {
  const { citiesGameState } = require('./cities-state.cjs');
  const eventTypes = [
    'economic_crisis', 'natural_disaster', 'political_instability', 
    'technological_breakthrough', 'resource_discovery', 'pandemic',
    'trade_agreement', 'cultural_festival', 'infrastructure_completion'
  ];

  const event = {
    id: `migration_event_${migrationGameState.globalEventCounter++}`,
    type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
    severity: Math.random() * 10 + 1,
    timestamp: new Date(),
    affectedCities: [],
    description: '',
    migrationImpact: {
      flowMultiplier: 1.0,
      durationExtension: 0,
      legalStatusChanges: [],
      integrationEffects: {}
    }
  };

  // Select affected cities
  const cityIds = Array.from(citiesGameState.cities.keys());
  const numAffectedCities = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < numAffectedCities; i++) {
    const cityId = cityIds[Math.floor(Math.random() * cityIds.length)];
    if (!event.affectedCities.includes(cityId)) {
      event.affectedCities.push(cityId);
    }
  }

  // Generate event-specific effects
  switch (event.type) {
    case 'economic_crisis':
      event.description = `Economic downturn affecting ${event.affectedCities.length} cities, increasing emigration pressure`;
      event.migrationImpact.flowMultiplier = 1.5 + (event.severity * 0.1);
      break;
    case 'natural_disaster':
      event.description = `Natural disaster forces population displacement from affected regions`;
      event.migrationImpact.flowMultiplier = 2.0 + (event.severity * 0.2);
      event.migrationImpact.legalStatusChanges = ['refugee'];
      break;
    case 'technological_breakthrough':
      event.description = `Major technological advancement creates new job opportunities and attracts skilled workers`;
      event.migrationImpact.flowMultiplier = 1.3 + (event.severity * 0.05);
      event.migrationImpact.integrationEffects = { economicIntegration: 15 };
      break;
    default:
      event.description = `${event.type.replace(/_/g, ' ')} event affecting migration patterns`;
      event.migrationImpact.flowMultiplier = 1.0 + (event.severity * 0.05);
  }

  migrationGameState.migrationEvents.push(event);
  
  // Keep only recent events (last 100)
  if (migrationGameState.migrationEvents.length > 100) {
    migrationGameState.migrationEvents = migrationGameState.migrationEvents.slice(-100);
  }

  return event;
}

// Calculate overall integration score (needed by APIs)
function calculateIntegrationScore(stage, culturalCompatibility, timeInDestination) {
  const stageScores = {
    arrival: 20,
    initial_settlement: 35,
    adaptation: 55,
    integration: 75,
    full_integration: 90
  };

  const baseScore = stageScores[stage] || 20;
  const avgCompatibility = Object.values(culturalCompatibility).reduce((sum, val) => sum + val, 0) / Object.keys(culturalCompatibility).length;
  const timeBonus = Math.min(timeInDestination * 2, 20);
  
  return Math.min(baseScore + (avgCompatibility * 0.3) + timeBonus, 100);
}

module.exports = {
  migrationGameState,
  initializeMigrationSystem,
  generateIntegrationOutcomes,
  calculateMigrationAttractiveness,
  simulateMigrationEvents,
  calculateIntegrationScore
};
