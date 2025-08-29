/**
 * MigrationEngine Unit Tests
 * 
 * Comprehensive test suite for the Immigration & Migration Engine,
 * covering migration flow creation, policy effects, integration tracking,
 * and system simulation.
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { MigrationEngine } from '../MigrationEngine';
import { 
  MigrationFlow, 
  ImmigrationPolicy, 
  IntegrationOutcome,
  MIGRATION_FLOW_TYPES,
  MIGRATION_SUBTYPES,
  INTEGRATION_STAGES
} from '../types';

describe('MigrationEngine', () => {
  let engine: MigrationEngine;

  beforeEach(() => {
    engine = new MigrationEngine({
      baseFlowVolatility: 0.1,
      economicSensitivity: 0.8,
      policySensitivity: 0.6,
      integrationTimeframe: 48, // 4 years
      randomEventFrequency: 0.0 // Disable random events for testing
    });
  });

  describe('Migration Flow Creation', () => {
    it('should create a basic migration flow', () => {
      const flow = engine.createMigrationFlow({
        type: 'immigration',
        subtype: 'economic',
        destinationCityId: 'test_city_1',
        populationSize: 1000,
        demographics: {
          ageDistribution: { '25-35': 0.6, '35-45': 0.4 },
          genderDistribution: { male: 0.5, female: 0.5, other: 0.0 },
          educationLevels: { 'university': 0.7, 'secondary': 0.3 },
          skillLevels: { 'technology': 0.8, 'healthcare': 0.2 },
          languages: ['English'],
          culturalBackground: 'Test Background'
        },
        economicProfile: {
          averageIncome: 50000,
          savings: 20000,
          jobSkills: ['programming', 'analysis'],
          employmentRate: 0.9,
          remittanceCapacity: 0.15
        },
        pushFactors: {
          economic: 60,
          political: 30,
          environmental: 20,
          social: 25,
          conflict: 10
        },
        pullFactors: {
          economic: 80,
          social: 50,
          political: 70,
          environmental: 60,
          educational: 75
        },
        legalStatus: 'documented',
        integrationFactors: {
          languageProficiency: 80,
          culturalSimilarity: 60,
          socialNetworks: 40,
          adaptabilityScore: 85,
          resourceAccess: 70
        }
      });

      expect(flow).toBeDefined();
      expect(flow.id).toBeTruthy();
      expect(flow.type).toBe('immigration');
      expect(flow.subtype).toBe('economic');
      expect(flow.destinationCityId).toBe('test_city_1');
      expect(flow.populationSize).toBe(1000);
      expect(flow.status).toBe('active');
      expect(flow.legalStatus).toBe('documented');
      expect(flow.visaType).toBe('Work Visa');
      expect(flow.documentationLevel).toBeGreaterThan(70);
    });

    it('should create integration outcome for new flow', () => {
      const flow = engine.createMigrationFlow({
        type: 'immigration',
        subtype: 'refugee',
        destinationCityId: 'test_city_1',
        populationSize: 500,
        demographics: {
          ageDistribution: { '18-25': 0.4, '25-35': 0.6 },
          genderDistribution: { male: 0.45, female: 0.55, other: 0.0 },
          educationLevels: { 'secondary': 0.8, 'primary': 0.2 },
          skillLevels: { 'general': 1.0 },
          languages: ['Arabic'],
          culturalBackground: 'Middle Eastern'
        },
        economicProfile: {
          averageIncome: 25000,
          savings: 5000,
          jobSkills: ['construction'],
          employmentRate: 0.6,
          remittanceCapacity: 0.3
        },
        pushFactors: {
          economic: 40,
          political: 95,
          environmental: 30,
          social: 80,
          conflict: 90
        },
        pullFactors: {
          economic: 60,
          social: 70,
          political: 90,
          environmental: 70,
          educational: 50
        },
        legalStatus: 'refugee',
        integrationFactors: {
          languageProficiency: 30,
          culturalSimilarity: 20,
          socialNetworks: 70,
          adaptabilityScore: 75,
          resourceAccess: 90
        }
      });

      const outcomes = engine.getCityIntegrationOutcomes('test_city_1');
      expect(outcomes).toHaveLength(1);
      
      const outcome = outcomes[0];
      expect(outcome.migrationFlowId).toBe(flow.id);
      expect(outcome.cityId).toBe('test_city_1');
      expect(outcome.integrationStage).toBe(INTEGRATION_STAGES.ARRIVAL);
      expect(outcome.timeInDestination).toBe(0);
      expect(outcome.socialIntegration.languageProficiency).toBe(30);
      expect(outcome.civicIntegration.legalStatus).toBe('undocumented'); // Refugees start undocumented
    });

    it('should handle different migration subtypes correctly', () => {
      const subtypes = ['economic', 'refugee', 'family_reunification', 'student', 'temporary_worker'];
      
      subtypes.forEach(subtype => {
        const flow = engine.createMigrationFlow({
          type: 'immigration',
          subtype: subtype as any,
          destinationCityId: 'test_city_1',
          populationSize: 100,
          demographics: {
            ageDistribution: { '25-35': 1.0 },
            genderDistribution: { male: 0.5, female: 0.5, other: 0.0 },
            educationLevels: { 'secondary': 1.0 },
            skillLevels: { 'general': 1.0 },
            languages: ['English'],
            culturalBackground: 'Test'
          },
          economicProfile: {
            averageIncome: 40000,
            savings: 10000,
            jobSkills: ['general'],
            employmentRate: 0.7,
            remittanceCapacity: 0.2
          },
          pushFactors: { economic: 50, political: 30, environmental: 20, social: 25, conflict: 15 },
          pullFactors: { economic: 70, social: 50, political: 60, environmental: 55, educational: 65 },
          legalStatus: 'documented',
          integrationFactors: {
            languageProficiency: 60,
            culturalSimilarity: 50,
            socialNetworks: 40,
            adaptabilityScore: 70,
            resourceAccess: 60
          }
        });

        expect(flow.subtype).toBe(subtype);
        expect(flow.visaType).toBeTruthy();
      });
    });
  });

  describe('Immigration Policy Management', () => {
    it('should create immigration policy', () => {
      const policy = engine.createImmigrationPolicy({
        name: 'Test Skilled Worker Program',
        description: 'Test policy for skilled workers',
        type: 'points_system',
        parameters: {
          annualQuota: 10000,
          skillRequirements: { 'technology': 70 },
          languageRequirements: [{ language: 'english', proficiencyLevel: 70 }],
          educationRequirements: ['bachelor'],
          ageRestrictions: { min: 18, max: 45 }
        },
        effects: {
          flowMultiplier: 1.3,
          legalPathwayStrength: 80,
          illegalFlowReduction: 25,
          integrationSupport: 70,
          economicImpact: 30,
          socialCohesion: 10
        },
        targetGroups: ['economic'],
        implementationDate: new Date('2024-01-01'),
        enforcementLevel: 80,
        publicSupport: 70,
        implementationCost: 5000000,
        annualOperatingCost: 2000000,
        requiredInfrastructure: ['processing_centers'],
        status: 'active'
      });

      expect(policy).toBeDefined();
      expect(policy.id).toBeTruthy();
      expect(policy.name).toBe('Test Skilled Worker Program');
      expect(policy.type).toBe('points_system');
      expect(policy.status).toBe('active');
      expect(policy.effects.flowMultiplier).toBe(1.3);
    });

    it('should apply policy effects to applicable flows', () => {
      // Create policy first
      const policy = engine.createImmigrationPolicy({
        name: 'Economic Boost Policy',
        description: 'Increases economic migration',
        type: 'quota',
        parameters: { annualQuota: 5000 },
        effects: {
          flowMultiplier: 1.5,
          legalPathwayStrength: 85,
          illegalFlowReduction: 30,
          integrationSupport: 75,
          economicImpact: 25,
          socialCohesion: 5
        },
        targetGroups: ['economic'],
        implementationDate: new Date('2024-01-01'),
        enforcementLevel: 90,
        publicSupport: 65,
        implementationCost: 1000000,
        annualOperatingCost: 500000,
        requiredInfrastructure: [],
        status: 'active'
      });

      // Create flow that should be affected by policy
      const initialPopulation = 1000;
      const flow = engine.createMigrationFlow({
        type: 'immigration',
        subtype: 'economic',
        destinationCityId: 'test_city_1',
        populationSize: initialPopulation,
        demographics: {
          ageDistribution: { '25-35': 1.0 },
          genderDistribution: { male: 0.5, female: 0.5, other: 0.0 },
          educationLevels: { 'university': 1.0 },
          skillLevels: { 'technology': 1.0 },
          languages: ['English'],
          culturalBackground: 'Test'
        },
        economicProfile: {
          averageIncome: 60000,
          savings: 25000,
          jobSkills: ['programming'],
          employmentRate: 0.9,
          remittanceCapacity: 0.1
        },
        pushFactors: { economic: 70, political: 20, environmental: 15, social: 20, conflict: 5 },
        pullFactors: { economic: 85, social: 45, political: 65, environmental: 60, educational: 80 },
        legalStatus: 'documented',
        integrationFactors: {
          languageProficiency: 85,
          culturalSimilarity: 70,
          socialNetworks: 50,
          adaptabilityScore: 90,
          resourceAccess: 80
        }
      });

      // Policy effects should have been applied during flow creation
      // The exact population change depends on policy effectiveness and other factors
      expect(flow.populationSize).toBeGreaterThanOrEqual(initialPopulation * 0.8); // Allow for some variation
    });

    it('should not apply policy to non-target groups', () => {
      // Create policy targeting only refugees
      engine.createImmigrationPolicy({
        name: 'Refugee Support Policy',
        description: 'Supports refugee integration',
        type: 'refugee',
        parameters: {},
        effects: {
          flowMultiplier: 1.2,
          legalPathwayStrength: 95,
          illegalFlowReduction: 40,
          integrationSupport: 90,
          economicImpact: -5,
          socialCohesion: 10
        },
        targetGroups: ['refugee'],
        implementationDate: new Date('2024-01-01'),
        enforcementLevel: 85,
        publicSupport: 60,
        implementationCost: 2000000,
        annualOperatingCost: 1500000,
        requiredInfrastructure: ['refugee_centers'],
        status: 'active'
      });

      // Create economic migration flow (should not be affected)
      const flow = engine.createMigrationFlow({
        type: 'immigration',
        subtype: 'economic',
        destinationCityId: 'test_city_1',
        populationSize: 1000,
        demographics: {
          ageDistribution: { '25-35': 1.0 },
          genderDistribution: { male: 0.5, female: 0.5, other: 0.0 },
          educationLevels: { 'university': 1.0 },
          skillLevels: { 'technology': 1.0 },
          languages: ['English'],
          culturalBackground: 'Test'
        },
        economicProfile: {
          averageIncome: 50000,
          savings: 20000,
          jobSkills: ['programming'],
          employmentRate: 0.9,
          remittanceCapacity: 0.15
        },
        pushFactors: { economic: 60, political: 25, environmental: 20, social: 20, conflict: 10 },
        pullFactors: { economic: 80, social: 50, political: 70, environmental: 60, educational: 75 },
        legalStatus: 'documented',
        integrationFactors: {
          languageProficiency: 80,
          culturalSimilarity: 60,
          socialNetworks: 40,
          adaptabilityScore: 85,
          resourceAccess: 70
        }
      });

      // Economic flow should not be significantly affected by refugee policy
      expect(flow.subtype).toBe('economic');
      expect(flow.populationSize).toBe(1000); // Should remain close to original
    });
  });

  describe('Integration Simulation', () => {
    it('should progress integration over time', () => {
      const flow = engine.createMigrationFlow({
        type: 'immigration',
        subtype: 'economic',
        destinationCityId: 'test_city_1',
        populationSize: 500,
        demographics: {
          ageDistribution: { '25-35': 1.0 },
          genderDistribution: { male: 0.5, female: 0.5, other: 0.0 },
          educationLevels: { 'university': 1.0 },
          skillLevels: { 'technology': 1.0 },
          languages: ['English'],
          culturalBackground: 'Western'
        },
        economicProfile: {
          averageIncome: 55000,
          savings: 22000,
          jobSkills: ['programming', 'analysis'],
          employmentRate: 0.9,
          remittanceCapacity: 0.12
        },
        pushFactors: { economic: 50, political: 20, environmental: 15, social: 15, conflict: 5 },
        pullFactors: { economic: 85, social: 60, political: 75, environmental: 65, educational: 80 },
        legalStatus: 'documented',
        integrationFactors: {
          languageProficiency: 90,
          culturalSimilarity: 80,
          socialNetworks: 60,
          adaptabilityScore: 85,
          resourceAccess: 75
        }
      });

      const initialOutcomes = engine.getCityIntegrationOutcomes('test_city_1');
      const initialOutcome = initialOutcomes[0];
      const initialEconomicScore = initialOutcome.economicIntegration.employmentRate;
      const initialSocialScore = initialOutcome.socialIntegration.languageProficiency;

      // Simulate several time steps
      for (let i = 0; i < 12; i++) { // 12 months
        engine.simulateTimeStep();
      }

      const updatedOutcomes = engine.getCityIntegrationOutcomes('test_city_1');
      const updatedOutcome = updatedOutcomes[0];

      // Integration should have progressed
      expect(updatedOutcome.timeInDestination).toBe(12);
      expect(updatedOutcome.economicIntegration.employmentRate).toBeGreaterThanOrEqual(initialEconomicScore);
      expect(updatedOutcome.socialIntegration.languageProficiency).toBeGreaterThanOrEqual(initialSocialScore);
      
      // Integration stage should have progressed
      expect(updatedOutcome.integrationStage).not.toBe(INTEGRATION_STAGES.ARRIVAL);
    });

    it('should handle integration barriers', () => {
      // Create flow with significant barriers
      const flow = engine.createMigrationFlow({
        type: 'immigration',
        subtype: 'refugee',
        destinationCityId: 'test_city_1',
        populationSize: 300,
        demographics: {
          ageDistribution: { '18-25': 0.4, '25-35': 0.6 },
          genderDistribution: { male: 0.45, female: 0.55, other: 0.0 },
          educationLevels: { 'primary': 0.7, 'secondary': 0.3 },
          skillLevels: { 'agriculture': 0.8, 'construction': 0.2 },
          languages: ['Somali'],
          culturalBackground: 'East African'
        },
        economicProfile: {
          averageIncome: 15000,
          savings: 1000,
          jobSkills: ['agriculture'],
          employmentRate: 0.4,
          remittanceCapacity: 0.4
        },
        pushFactors: { economic: 30, political: 95, environmental: 60, social: 85, conflict: 95 },
        pullFactors: { economic: 50, social: 80, political: 95, environmental: 70, educational: 40 },
        legalStatus: 'refugee',
        integrationFactors: {
          languageProficiency: 15, // Very low
          culturalSimilarity: 10,   // Very different culture
          socialNetworks: 80,       // Strong refugee community
          adaptabilityScore: 70,
          resourceAccess: 95        // Good access to refugee services
        }
      });

      const outcomes = engine.getCityIntegrationOutcomes('test_city_1');
      const outcome = outcomes[0];

      // Should have significant barriers
      expect(outcome.integrationChallenges.languageBarriers).toBeGreaterThan(70);
      expect(outcome.integrationChallenges.culturalBarriers).toBeGreaterThan(70);
      expect(outcome.integrationChallenges.legalBarriers).toBeGreaterThan(60);

      // But should have some protective factors
      expect(outcome.socialIntegration.socialNetworkSize).toBeGreaterThan(5);
    });
  });

  describe('Migration Analytics', () => {
    beforeEach(() => {
      // Create multiple flows for analytics testing
      const flows = [
        {
          type: 'immigration' as const,
          subtype: 'economic' as const,
          destinationCityId: 'analytics_city',
          populationSize: 1000,
          originCountry: 'Country A'
        },
        {
          type: 'immigration' as const,
          subtype: 'refugee' as const,
          destinationCityId: 'analytics_city',
          populationSize: 500,
          originCountry: 'Country B'
        },
        {
          type: 'emigration' as const,
          subtype: 'economic' as const,
          originCityId: 'analytics_city',
          destinationCityId: 'other_city',
          populationSize: 200,
          originCountry: undefined
        }
      ];

      flows.forEach(flowParams => {
        engine.createMigrationFlow({
          ...flowParams,
          demographics: {
            ageDistribution: { '25-35': 1.0 },
            genderDistribution: { male: 0.5, female: 0.5, other: 0.0 },
            educationLevels: { 'secondary': 1.0 },
            skillLevels: { 'general': 1.0 },
            languages: ['English'],
            culturalBackground: 'Test'
          },
          economicProfile: {
            averageIncome: 40000,
            savings: 15000,
            jobSkills: ['general'],
            employmentRate: 0.7,
            remittanceCapacity: 0.2
          },
          pushFactors: { economic: 50, political: 30, environmental: 20, social: 25, conflict: 15 },
          pullFactors: { economic: 70, social: 50, political: 60, environmental: 55, educational: 65 },
          legalStatus: 'documented',
          integrationFactors: {
            languageProficiency: 60,
            culturalSimilarity: 50,
            socialNetworks: 40,
            adaptabilityScore: 70,
            resourceAccess: 60
          }
        });
      });
    });

    it('should generate comprehensive migration analytics', () => {
      const analytics = engine.getMigrationAnalytics('analytics_city', 'monthly');

      expect(analytics).toBeDefined();
      expect(analytics.cityId).toBe('analytics_city');
      expect(analytics.timeframe).toBe('monthly');

      // Flow analytics
      expect(analytics.flowAnalytics.totalInflows).toBe(1500); // 1000 + 500
      expect(analytics.flowAnalytics.totalOutflows).toBe(200);
      expect(analytics.flowAnalytics.netMigration).toBe(1300); // 1500 - 200

      // Should have flow breakdowns
      expect(analytics.flowAnalytics.flowsByType).toBeDefined();
      expect(analytics.flowAnalytics.flowsBySubtype).toBeDefined();
      expect(analytics.flowAnalytics.flowsByOrigin).toBeDefined();

      // Integration analytics
      expect(analytics.integrationAnalytics).toBeDefined();
      expect(analytics.integrationAnalytics.averageIntegrationScore).toBeGreaterThan(0);

      // Economic impact
      expect(analytics.economicImpact).toBeDefined();
      expect(analytics.economicImpact.laborForceContribution).toBeGreaterThan(0);
      expect(analytics.economicImpact.taxContribution).toBeGreaterThan(0);

      // Social impact
      expect(analytics.socialImpact).toBeDefined();
      expect(analytics.socialImpact.culturalDiversity).toBeGreaterThan(0);

      // Policy effectiveness
      expect(analytics.policyEffectiveness).toBeDefined();
      expect(analytics.policyEffectiveness.activePolicies).toBeGreaterThan(0);

      // Projections
      expect(analytics.projections).toBeDefined();
      expect(analytics.projections.projectedInflows).toBeDefined();
    });

    it('should track flows by city correctly', () => {
      const cityFlows = engine.getCityMigrationFlows('analytics_city');
      
      // Should include both inflows and outflows
      expect(cityFlows.length).toBe(3);
      
      const inflows = cityFlows.filter(f => f.destinationCityId === 'analytics_city');
      const outflows = cityFlows.filter(f => f.originCityId === 'analytics_city');
      
      expect(inflows.length).toBe(2);
      expect(outflows.length).toBe(1);
    });

    it('should calculate integration outcomes correctly', () => {
      const outcomes = engine.getCityIntegrationOutcomes('analytics_city');
      
      // Should have outcomes for inflow migrants only
      expect(outcomes.length).toBe(2);
      
      outcomes.forEach(outcome => {
        expect(outcome.cityId).toBe('analytics_city');
        expect(outcome.integrationStage).toBe(INTEGRATION_STAGES.ARRIVAL);
        expect(outcome.timeInDestination).toBe(0);
      });
    });
  });

  describe('System Simulation', () => {
    it('should simulate time steps without errors', () => {
      // Create some flows first
      engine.createMigrationFlow({
        type: 'immigration',
        subtype: 'economic',
        destinationCityId: 'sim_city',
        populationSize: 800,
        demographics: {
          ageDistribution: { '25-35': 1.0 },
          genderDistribution: { male: 0.5, female: 0.5, other: 0.0 },
          educationLevels: { 'university': 1.0 },
          skillLevels: { 'technology': 1.0 },
          languages: ['English'],
          culturalBackground: 'Test'
        },
        economicProfile: {
          averageIncome: 50000,
          savings: 20000,
          jobSkills: ['programming'],
          employmentRate: 0.9,
          remittanceCapacity: 0.15
        },
        pushFactors: { economic: 60, political: 25, environmental: 20, social: 20, conflict: 10 },
        pullFactors: { economic: 80, social: 50, political: 70, environmental: 60, educational: 75 },
        legalStatus: 'documented',
        integrationFactors: {
          languageProficiency: 80,
          culturalSimilarity: 60,
          socialNetworks: 40,
          adaptabilityScore: 85,
          resourceAccess: 70
        }
      });

      const initialFlows = engine.getAllMigrationFlows();
      const initialOutcomes = engine.getCityIntegrationOutcomes('sim_city');

      // Simulate multiple time steps
      for (let i = 0; i < 5; i++) {
        expect(() => engine.simulateTimeStep()).not.toThrow();
      }

      const updatedFlows = engine.getAllMigrationFlows();
      const updatedOutcomes = engine.getCityIntegrationOutcomes('sim_city');

      // Flows should still exist
      expect(updatedFlows.length).toBe(initialFlows.length);
      
      // Integration should have progressed
      expect(updatedOutcomes[0].timeInDestination).toBe(5);
      expect(updatedOutcomes[0].timeInDestination).toBeGreaterThan(initialOutcomes[0].timeInDestination);
    });

    it('should handle policy implementation lag', () => {
      // Create a policy with recent implementation date
      const recentPolicy = engine.createImmigrationPolicy({
        name: 'Recent Policy',
        description: 'Recently implemented policy',
        type: 'quota',
        parameters: { annualQuota: 1000 },
        effects: {
          flowMultiplier: 2.0, // Strong effect
          legalPathwayStrength: 90,
          illegalFlowReduction: 50,
          integrationSupport: 80,
          economicImpact: 40,
          socialCohesion: 15
        },
        targetGroups: ['economic'],
        implementationDate: new Date(), // Just implemented
        enforcementLevel: 95,
        publicSupport: 75,
        implementationCost: 3000000,
        annualOperatingCost: 1500000,
        requiredInfrastructure: [],
        status: 'active'
      });

      // Create flow immediately after policy
      const flow = engine.createMigrationFlow({
        type: 'immigration',
        subtype: 'economic',
        destinationCityId: 'policy_test_city',
        populationSize: 1000,
        demographics: {
          ageDistribution: { '25-35': 1.0 },
          genderDistribution: { male: 0.5, female: 0.5, other: 0.0 },
          educationLevels: { 'university': 1.0 },
          skillLevels: { 'technology': 1.0 },
          languages: ['English'],
          culturalBackground: 'Test'
        },
        economicProfile: {
          averageIncome: 50000,
          savings: 20000,
          jobSkills: ['programming'],
          employmentRate: 0.9,
          remittanceCapacity: 0.15
        },
        pushFactors: { economic: 60, political: 25, environmental: 20, social: 20, conflict: 10 },
        pullFactors: { economic: 80, social: 50, political: 70, environmental: 60, educational: 75 },
        legalStatus: 'documented',
        integrationFactors: {
          languageProficiency: 80,
          culturalSimilarity: 60,
          socialNetworks: 40,
          adaptabilityScore: 85,
          resourceAccess: 70
        }
      });

      // Policy effects should be minimal initially due to implementation lag
      // The exact effect depends on the implementation, but population shouldn't double immediately
      expect(flow.populationSize).toBeLessThan(2000);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty city queries gracefully', () => {
      const flows = engine.getCityMigrationFlows('nonexistent_city');
      const outcomes = engine.getCityIntegrationOutcomes('nonexistent_city');
      const analytics = engine.getMigrationAnalytics('nonexistent_city');

      expect(flows).toEqual([]);
      expect(outcomes).toEqual([]);
      expect(analytics).toBeDefined();
      expect(analytics.flowAnalytics.totalInflows).toBe(0);
      expect(analytics.flowAnalytics.totalOutflows).toBe(0);
    });

    it('should handle zero population flows', () => {
      const flow = engine.createMigrationFlow({
        type: 'immigration',
        subtype: 'economic',
        destinationCityId: 'zero_pop_city',
        populationSize: 0,
        demographics: {
          ageDistribution: { '25-35': 1.0 },
          genderDistribution: { male: 0.5, female: 0.5, other: 0.0 },
          educationLevels: { 'secondary': 1.0 },
          skillLevels: { 'general': 1.0 },
          languages: ['English'],
          culturalBackground: 'Test'
        },
        economicProfile: {
          averageIncome: 40000,
          savings: 10000,
          jobSkills: ['general'],
          employmentRate: 0.7,
          remittanceCapacity: 0.2
        },
        pushFactors: { economic: 50, political: 30, environmental: 20, social: 25, conflict: 15 },
        pullFactors: { economic: 70, social: 50, political: 60, environmental: 55, educational: 65 },
        legalStatus: 'documented',
        integrationFactors: {
          languageProficiency: 60,
          culturalSimilarity: 50,
          socialNetworks: 40,
          adaptabilityScore: 70,
          resourceAccess: 60
        }
      });

      expect(flow.populationSize).toBe(0);
      expect(() => engine.simulateTimeStep()).not.toThrow();
    });

    it('should maintain data consistency during simulation', () => {
      // Create multiple flows and policies
      for (let i = 0; i < 3; i++) {
        engine.createMigrationFlow({
          type: 'immigration',
          subtype: 'economic',
          destinationCityId: `consistency_city_${i}`,
          populationSize: 500 + i * 100,
          demographics: {
            ageDistribution: { '25-35': 1.0 },
            genderDistribution: { male: 0.5, female: 0.5, other: 0.0 },
            educationLevels: { 'secondary': 1.0 },
            skillLevels: { 'general': 1.0 },
            languages: ['English'],
            culturalBackground: 'Test'
          },
          economicProfile: {
            averageIncome: 40000,
            savings: 10000,
            jobSkills: ['general'],
            employmentRate: 0.7,
            remittanceCapacity: 0.2
          },
          pushFactors: { economic: 50, political: 30, environmental: 20, social: 25, conflict: 15 },
          pullFactors: { economic: 70, social: 50, political: 60, environmental: 55, educational: 65 },
          legalStatus: 'documented',
          integrationFactors: {
            languageProficiency: 60,
            culturalSimilarity: 50,
            socialNetworks: 40,
            adaptabilityScore: 70,
            resourceAccess: 60
          }
        });
      }

      const initialFlowCount = engine.getAllMigrationFlows().length;
      const initialPolicyCount = engine.getAllPolicies().length;

      // Simulate many time steps
      for (let i = 0; i < 20; i++) {
        engine.simulateTimeStep();
      }

      const finalFlowCount = engine.getAllMigrationFlows().length;
      const finalPolicyCount = engine.getAllPolicies().length;

      // Flow and policy counts should remain consistent
      expect(finalFlowCount).toBe(initialFlowCount);
      expect(finalPolicyCount).toBe(initialPolicyCount);

      // All flows should still be valid
      const allFlows = engine.getAllMigrationFlows();
      allFlows.forEach(flow => {
        expect(flow.id).toBeTruthy();
        expect(flow.populationSize).toBeGreaterThanOrEqual(0);
        expect(flow.status).toBeDefined();
      });
    });
  });
});
