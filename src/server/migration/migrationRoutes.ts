/**
 * Immigration & Migration System API Routes
 * 
 * RESTful API endpoints for migration flow management, immigration policy administration,
 * integration tracking, and comprehensive migration analytics.
 */

import express from 'express';
import { MigrationEngine } from './MigrationEngine.js';
import { IntegrationAnalyticsEngine } from './IntegrationAnalytics.js';
import { 
  MigrationFlow, 
  ImmigrationPolicy, 
  IntegrationOutcome,
  MIGRATION_FLOW_TYPES,
  MIGRATION_SUBTYPES,
  INTEGRATION_STAGES
} from './types.js';

const router = express.Router();

// Initialize engines
const migrationEngine = new MigrationEngine();
const analyticsEngine = new IntegrationAnalyticsEngine();

// Initialize with sample data for demonstration
initializeSampleData();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  const flows = migrationEngine.getAllMigrationFlows();
  const policies = migrationEngine.getAllPolicies();
  
  res.json({
    status: 'healthy',
    service: 'migration-system',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    totalFlows: flows.length,
    activeFlows: flows.filter(f => f.status === 'active').length,
    activePolicies: policies.filter(p => p.status === 'active').length
  });
});

/**
 * Get all migration flows with optional filtering
 */
router.get('/flows', (req, res) => {
  try {
    const flows = migrationEngine.getAllMigrationFlows();
    
    // Apply filters
    let filteredFlows = flows;
    
    const { type, subtype, destinationCity, originCountry, status, legalStatus } = req.query;
    
    if (type) {
      filteredFlows = filteredFlows.filter(flow => flow.type === type);
    }
    
    if (subtype) {
      filteredFlows = filteredFlows.filter(flow => flow.subtype === subtype);
    }
    
    if (destinationCity) {
      filteredFlows = filteredFlows.filter(flow => flow.destinationCityId === destinationCity);
    }
    
    if (originCountry) {
      filteredFlows = filteredFlows.filter(flow => flow.originCountry === originCountry);
    }
    
    if (status) {
      filteredFlows = filteredFlows.filter(flow => flow.status === status);
    }
    
    if (legalStatus) {
      filteredFlows = filteredFlows.filter(flow => flow.legalStatus === legalStatus);
    }

    // Sort by population size by default
    filteredFlows.sort((a, b) => b.populationSize - a.populationSize);

    res.json({
      flows: filteredFlows,
      total: filteredFlows.length,
      filters: { type, subtype, destinationCity, originCountry, status, legalStatus }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch migration flows', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get migration flows for specific city
 */
router.get('/flows/city/:cityId', (req, res) => {
  try {
    const { cityId } = req.params;
    const flows = migrationEngine.getCityMigrationFlows(cityId);
    
    res.json({
      cityId,
      flows,
      total: flows.length,
      inflows: flows.filter(f => f.destinationCityId === cityId).length,
      outflows: flows.filter(f => f.originCityId === cityId).length
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch city migration flows', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Create new migration flow
 */
router.post('/flows', (req, res) => {
  try {
    const {
      type,
      subtype,
      originCityId,
      originCountry,
      destinationCityId,
      populationSize,
      demographics,
      economicProfile,
      pushFactors,
      pullFactors,
      legalStatus,
      integrationFactors,
      duration
    } = req.body;

    // Validate required fields
    if (!type || !subtype || !destinationCityId || !populationSize) {
      return res.status(400).json({ 
        error: 'Missing required fields: type, subtype, destinationCityId, populationSize' 
      });
    }

    const flow = migrationEngine.createMigrationFlow({
      type,
      subtype,
      originCityId,
      originCountry,
      destinationCityId,
      populationSize,
      demographics: demographics || generateDefaultDemographics(),
      economicProfile: economicProfile || generateDefaultEconomicProfile(),
      pushFactors: pushFactors || generateDefaultPushFactors(),
      pullFactors: pullFactors || generateDefaultPullFactors(),
      legalStatus: legalStatus || 'documented',
      integrationFactors: integrationFactors || generateDefaultIntegrationFactors(),
      duration
    });

    res.status(201).json(flow);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create migration flow', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get all immigration policies
 */
router.get('/policies', (req, res) => {
  try {
    const policies = migrationEngine.getAllPolicies();
    
    // Apply filters
    let filteredPolicies = policies;
    
    const { type, status, targetCity } = req.query;
    
    if (type) {
      filteredPolicies = filteredPolicies.filter(policy => policy.type === type);
    }
    
    if (status) {
      filteredPolicies = filteredPolicies.filter(policy => policy.status === status);
    }
    
    if (targetCity) {
      filteredPolicies = filteredPolicies.filter(policy => 
        !policy.targetCities || policy.targetCities.includes(targetCity as string)
      );
    }

    res.json({
      policies: filteredPolicies,
      total: filteredPolicies.length,
      filters: { type, status, targetCity }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch immigration policies', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Create new immigration policy
 */
router.post('/policies', (req, res) => {
  try {
    const {
      name,
      description,
      type,
      parameters,
      effects,
      targetGroups,
      targetCities,
      implementationDate,
      expiryDate,
      enforcementLevel,
      publicSupport,
      implementationCost,
      annualOperatingCost,
      requiredInfrastructure
    } = req.body;

    // Validate required fields
    if (!name || !description || !type || !effects || !targetGroups) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, description, type, effects, targetGroups' 
      });
    }

    const policy = migrationEngine.createImmigrationPolicy({
      name,
      description,
      type,
      parameters: parameters || {},
      effects,
      targetGroups,
      targetCities,
      implementationDate: implementationDate ? new Date(implementationDate) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      enforcementLevel: enforcementLevel || 75,
      publicSupport: publicSupport || 50,
      implementationCost: implementationCost || 0,
      annualOperatingCost: annualOperatingCost || 0,
      requiredInfrastructure: requiredInfrastructure || [],
      status: 'active'
    });

    res.status(201).json(policy);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create immigration policy', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get integration outcomes for city
 */
router.get('/integration/:cityId', (req, res) => {
  try {
    const { cityId } = req.params;
    const outcomes = migrationEngine.getCityIntegrationOutcomes(cityId);
    
    // Calculate summary statistics
    const totalMigrants = outcomes.length;
    const avgIntegrationScore = outcomes.length > 0 
      ? outcomes.reduce((sum, o) => {
          const economic = (o.economicIntegration.employmentRate + o.economicIntegration.socialMobility) / 2;
          const social = (o.socialIntegration.languageProficiency + o.socialIntegration.culturalAdaptation) / 2;
          const civic = (o.civicIntegration.civicParticipation + o.civicIntegration.legalKnowledge) / 2;
          const cultural = (o.culturalIntegration.culturalAdoption + o.culturalIntegration.bilingualProficiency) / 2;
          return sum + (economic + social + civic + cultural) / 4;
        }, 0) / outcomes.length
      : 0;
    
    const stageDistribution = outcomes.reduce((dist, o) => {
      dist[o.integrationStage] = (dist[o.integrationStage] || 0) + 1;
      return dist;
    }, {} as { [stage: string]: number });

    res.json({
      cityId,
      outcomes,
      summary: {
        totalMigrants,
        averageIntegrationScore,
        stageDistribution,
        successRate: totalMigrants > 0 
          ? ((stageDistribution.integration || 0) + (stageDistribution.full_integration || 0)) / totalMigrants * 100
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch integration outcomes', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get comprehensive migration analytics for city
 */
router.get('/analytics/:cityId', (req, res) => {
  try {
    const { cityId } = req.params;
    const { timeframe } = req.query;
    
    const analytics = migrationEngine.getMigrationAnalytics(
      cityId, 
      (timeframe as any) || 'monthly'
    );
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to generate migration analytics', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get integration analytics report
 */
router.get('/integration/analytics/:cityId', (req, res) => {
  try {
    const { cityId } = req.params;
    
    const outcomes = migrationEngine.getCityIntegrationOutcomes(cityId);
    const flows = migrationEngine.getCityMigrationFlows(cityId);
    const policies = migrationEngine.getAllPolicies();
    
    const report = analyticsEngine.generateIntegrationReport(outcomes, flows, policies);
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to generate integration analytics', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get individual integration trajectory
 */
router.get('/integration/trajectory/:outcomeId', (req, res) => {
  try {
    const { outcomeId } = req.params;
    
    const outcomes = migrationEngine.getAllMigrationFlows()
      .map(flow => migrationEngine.getCityIntegrationOutcomes(flow.destinationCityId))
      .flat();
    
    const outcome = outcomes.find(o => o.id === outcomeId);
    
    if (!outcome) {
      return res.status(404).json({ error: 'Integration outcome not found' });
    }
    
    const trajectory = analyticsEngine.analyzeIndividualTrajectory(outcome);
    
    res.json(trajectory);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to analyze integration trajectory', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Compare integration outcomes by groups
 */
router.get('/integration/comparison/:cityId', (req, res) => {
  try {
    const { cityId } = req.params;
    
    const outcomes = migrationEngine.getCityIntegrationOutcomes(cityId);
    const flows = migrationEngine.getCityMigrationFlows(cityId);
    
    const comparison = analyticsEngine.compareIntegrationByGroups(outcomes, flows);
    
    res.json(comparison);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to compare integration outcomes', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get cultural adaptation analysis
 */
router.get('/integration/cultural/:cityId', (req, res) => {
  try {
    const { cityId } = req.params;
    
    const outcomes = migrationEngine.getCityIntegrationOutcomes(cityId);
    
    const culturalAnalysis = analyticsEngine.analyzeCulturalAdaptationPatterns(outcomes);
    
    res.json(culturalAnalysis);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to analyze cultural adaptation', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Simulate migration system for one time step
 */
router.post('/simulate', (req, res) => {
  try {
    migrationEngine.simulateTimeStep();
    
    const flows = migrationEngine.getAllMigrationFlows();
    const events = migrationEngine.getMigrationEvents(5); // Last 5 events
    
    res.json({
      message: 'Migration simulation step completed',
      timestamp: new Date().toISOString(),
      activeFlows: flows.filter(f => f.status === 'active').length,
      recentEvents: events
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to simulate migration system', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get migration events
 */
router.get('/events', (req, res) => {
  try {
    const { limit, cityId, type, severity } = req.query;
    
    let events = migrationEngine.getMigrationEvents(
      limit ? parseInt(limit as string) : undefined
    );
    
    // Apply filters
    if (cityId) {
      events = events.filter(event => 
        event.affectedCities.includes(cityId as string)
      );
    }
    
    if (type) {
      events = events.filter(event => event.type === type);
    }
    
    if (severity) {
      events = events.filter(event => event.severity === severity);
    }
    
    res.json({
      events,
      total: events.length,
      filters: { limit, cityId, type, severity }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch migration events', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get migration system constants and enums
 */
router.get('/constants', (req, res) => {
  try {
    res.json({
      flowTypes: Object.values(MIGRATION_FLOW_TYPES),
      subtypes: Object.values(MIGRATION_SUBTYPES),
      integrationStages: Object.values(INTEGRATION_STAGES),
      legalStatuses: ['documented', 'undocumented', 'asylum_seeker', 'refugee', 'temporary_permit'],
      policyTypes: ['quota', 'points_system', 'family_reunification', 'refugee', 'temporary_worker', 'border_control', 'integration']
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch constants', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Initialize sample migration data for demonstration
 */
function initializeSampleData() {
  // Create sample migration flows
  const sampleFlows = [
    {
      type: 'immigration' as const,
      subtype: 'economic' as const,
      originCountry: 'Country A',
      destinationCityId: 'city_new_metropolis_1755561175494',
      populationSize: 2500,
      demographics: {
        ageDistribution: { '25-35': 0.4, '35-45': 0.3, '18-25': 0.2, '45-65': 0.1 },
        genderDistribution: { male: 0.55, female: 0.43, other: 0.02 },
        educationLevels: { 'university': 0.6, 'secondary': 0.3, 'primary': 0.1 },
        skillLevels: { 'technology': 0.7, 'healthcare': 0.2, 'engineering': 0.1 },
        languages: ['English', 'Spanish'],
        culturalBackground: 'Latin American'
      },
      economicProfile: {
        averageIncome: 45000,
        savings: 15000,
        jobSkills: ['software_development', 'data_analysis'],
        employmentRate: 0.85,
        remittanceCapacity: 0.15
      },
      pushFactors: {
        economic: 70,
        political: 30,
        environmental: 20,
        social: 25,
        conflict: 10
      },
      pullFactors: {
        economic: 85,
        social: 40,
        political: 60,
        environmental: 50,
        educational: 70
      },
      legalStatus: 'documented' as const,
      integrationFactors: {
        languageProficiency: 75,
        culturalSimilarity: 60,
        socialNetworks: 30,
        adaptabilityScore: 80,
        resourceAccess: 70
      }
    },
    {
      type: 'immigration' as const,
      subtype: 'refugee' as const,
      originCountry: 'Country B',
      destinationCityId: 'city_coastal_harbor_1755561175495',
      populationSize: 800,
      demographics: {
        ageDistribution: { '18-25': 0.3, '25-35': 0.25, '35-45': 0.2, '0-18': 0.25 },
        genderDistribution: { male: 0.48, female: 0.50, other: 0.02 },
        educationLevels: { 'secondary': 0.5, 'primary': 0.4, 'university': 0.1 },
        skillLevels: { 'agriculture': 0.4, 'construction': 0.3, 'services': 0.3 },
        languages: ['Arabic', 'French'],
        culturalBackground: 'Middle Eastern'
      },
      economicProfile: {
        averageIncome: 25000,
        savings: 3000,
        jobSkills: ['agriculture', 'construction'],
        employmentRate: 0.60,
        remittanceCapacity: 0.25
      },
      pushFactors: {
        economic: 40,
        political: 90,
        environmental: 30,
        social: 80,
        conflict: 95
      },
      pullFactors: {
        economic: 60,
        social: 70,
        political: 90,
        environmental: 70,
        educational: 50
      },
      legalStatus: 'refugee' as const,
      integrationFactors: {
        languageProficiency: 35,
        culturalSimilarity: 25,
        socialNetworks: 60,
        adaptabilityScore: 70,
        resourceAccess: 85
      }
    },
    {
      type: 'immigration' as const,
      subtype: 'family_reunification' as const,
      originCountry: 'Country C',
      destinationCityId: 'city_river_valley_1755561175496',
      populationSize: 1200,
      demographics: {
        ageDistribution: { '0-18': 0.3, '25-35': 0.25, '35-45': 0.25, '65+': 0.2 },
        genderDistribution: { male: 0.45, female: 0.53, other: 0.02 },
        educationLevels: { 'secondary': 0.6, 'university': 0.25, 'primary': 0.15 },
        skillLevels: { 'healthcare': 0.3, 'education': 0.4, 'services': 0.3 },
        languages: ['English', 'Mandarin'],
        culturalBackground: 'East Asian'
      },
      economicProfile: {
        averageIncome: 38000,
        savings: 12000,
        jobSkills: ['healthcare', 'education'],
        employmentRate: 0.75,
        remittanceCapacity: 0.10
      },
      pushFactors: {
        economic: 50,
        political: 20,
        environmental: 15,
        social: 85,
        conflict: 5
      },
      pullFactors: {
        economic: 70,
        social: 95,
        political: 50,
        environmental: 60,
        educational: 80
      },
      legalStatus: 'documented' as const,
      integrationFactors: {
        languageProficiency: 85,
        culturalSimilarity: 40,
        socialNetworks: 90,
        adaptabilityScore: 75,
        resourceAccess: 80
      }
    }
  ];

  // Create the migration flows
  sampleFlows.forEach(flowParams => {
    try {
      migrationEngine.createMigrationFlow(flowParams);
    } catch (error) {
      console.error(`Failed to create sample migration flow:`, error);
    }
  });

  // Simulate some time steps to generate integration data
  for (let i = 0; i < 6; i++) {
    migrationEngine.simulateTimeStep();
  }
}

// Helper functions for generating default values

function generateDefaultDemographics() {
  return {
    ageDistribution: { '25-35': 0.4, '35-45': 0.3, '18-25': 0.2, '45-65': 0.1 },
    genderDistribution: { male: 0.5, female: 0.48, other: 0.02 },
    educationLevels: { 'secondary': 0.6, 'university': 0.3, 'primary': 0.1 },
    skillLevels: { 'general': 1.0 },
    languages: ['English'],
    culturalBackground: 'Mixed'
  };
}

function generateDefaultEconomicProfile() {
  return {
    averageIncome: 35000,
    savings: 10000,
    jobSkills: ['general'],
    employmentRate: 0.7,
    remittanceCapacity: 0.15
  };
}

function generateDefaultPushFactors() {
  return {
    economic: 60,
    political: 30,
    environmental: 20,
    social: 25,
    conflict: 15
  };
}

function generateDefaultPullFactors() {
  return {
    economic: 75,
    social: 50,
    political: 60,
    environmental: 55,
    educational: 65
  };
}

function generateDefaultIntegrationFactors() {
  return {
    languageProficiency: 60,
    culturalSimilarity: 50,
    socialNetworks: 40,
    adaptabilityScore: 70,
    resourceAccess: 60
  };
}

export default router;
