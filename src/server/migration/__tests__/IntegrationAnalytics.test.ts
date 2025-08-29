/**
 * IntegrationAnalytics Unit Tests
 * 
 * Test suite for the Integration Analytics Engine,
 * covering integration analysis, cultural adaptation patterns,
 * and comprehensive reporting capabilities.
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { IntegrationAnalyticsEngine } from '../IntegrationAnalytics';
import { 
  IntegrationOutcome, 
  MigrationFlow, 
  ImmigrationPolicy,
  INTEGRATION_STAGES 
} from '../types';

describe('IntegrationAnalyticsEngine', () => {
  let analytics: IntegrationAnalyticsEngine;
  let sampleOutcomes: IntegrationOutcome[];
  let sampleFlows: MigrationFlow[];
  let samplePolicies: ImmigrationPolicy[];

  beforeEach(() => {
    analytics = new IntegrationAnalyticsEngine();
    
    // Create sample integration outcomes
    sampleOutcomes = [
      createSampleOutcome('outcome_1', 'flow_1', 'city_1', 24, 'adaptation', {
        economic: { employmentRate: 75, socialMobility: 60, jobSkillUtilization: 70 },
        social: { languageProficiency: 80, culturalAdaptation: 65, communityParticipation: 55 },
        civic: { civicParticipation: 45, legalKnowledge: 60, institutionalTrust: 70 },
        cultural: { culturalAdoption: 60, bilingualProficiency: 75, culturalBridging: 50 }
      }),
      createSampleOutcome('outcome_2', 'flow_2', 'city_1', 12, 'initial_settlement', {
        economic: { employmentRate: 45, socialMobility: 30, jobSkillUtilization: 40 },
        social: { languageProficiency: 50, culturalAdaptation: 35, communityParticipation: 25 },
        civic: { civicParticipation: 20, legalKnowledge: 35, institutionalTrust: 45 },
        cultural: { culturalAdoption: 30, bilingualProficiency: 45, culturalBridging: 25 }
      }),
      createSampleOutcome('outcome_3', 'flow_3', 'city_1', 48, 'integration', {
        economic: { employmentRate: 85, socialMobility: 80, jobSkillUtilization: 90 },
        social: { languageProficiency: 90, culturalAdaptation: 85, communityParticipation: 75 },
        civic: { civicParticipation: 70, legalKnowledge: 80, institutionalTrust: 85 },
        cultural: { culturalAdoption: 80, bilingualProficiency: 85, culturalBridging: 75 }
      })
    ];

    // Create sample migration flows
    sampleFlows = [
      createSampleFlow('flow_1', 'Country A', 'economic'),
      createSampleFlow('flow_2', 'Country B', 'refugee'),
      createSampleFlow('flow_3', 'Country A', 'family_reunification')
    ];

    // Create sample policies
    samplePolicies = [
      createSamplePolicy('policy_1', 'points_system', ['economic']),
      createSamplePolicy('policy_2', 'refugee', ['refugee']),
      createSamplePolicy('policy_3', 'family_reunification', ['family_reunification'])
    ];
  });

  describe('Integration Report Generation', () => {
    it('should generate comprehensive integration report', () => {
      const report = analytics.generateIntegrationReport(sampleOutcomes, sampleFlows, samplePolicies);

      expect(report).toBeDefined();
      expect(report.reportDate).toBeInstanceOf(Date);
      expect(report.totalMigrants).toBe(3);

      // Integration metrics
      expect(report.integrationMetrics).toBeDefined();
      expect(report.integrationMetrics.overallIntegrationScore).toBeGreaterThan(0);
      expect(report.integrationMetrics.integrationSuccessRate).toBeGreaterThan(0);
      expect(report.integrationMetrics.stageDistribution).toBeDefined();

      // Pathway analysis
      expect(report.pathwayAnalysis).toBeDefined();
      expect(report.pathwayAnalysis.commonPathways).toBeDefined();
      expect(report.pathwayAnalysis.successfulPathways).toBeDefined();

      // Cultural adaptation
      expect(report.culturalAdaptation).toBeDefined();

      // Economic integration
      expect(report.economicIntegration).toBeDefined();

      // Social cohesion
      expect(report.socialCohesion).toBeDefined();

      // Policy impact
      expect(report.policyImpact).toBeDefined();

      // Barrier analysis
      expect(report.barrierAnalysis).toBeDefined();

      // Success factors
      expect(report.successFactors).toBeDefined();

      // Recommendations
      expect(report.recommendations).toBeDefined();

      // Predictions
      expect(report.predictions).toBeDefined();
    });

    it('should handle empty data gracefully', () => {
      const report = analytics.generateIntegrationReport([], [], []);

      expect(report).toBeDefined();
      expect(report.totalMigrants).toBe(0);
      expect(report.integrationMetrics.overallIntegrationScore).toBe(0);
      expect(report.integrationMetrics.integrationSuccessRate).toBe(0);
    });

    it('should calculate integration metrics correctly', () => {
      const report = analytics.generateIntegrationReport(sampleOutcomes, sampleFlows, samplePolicies);
      const metrics = report.integrationMetrics;

      // Should calculate averages across all dimensions
      expect(metrics.economicIntegrationScore).toBeGreaterThan(0);
      expect(metrics.socialIntegrationScore).toBeGreaterThan(0);
      expect(metrics.civicIntegrationScore).toBeGreaterThan(0);
      expect(metrics.culturalIntegrationScore).toBeGreaterThan(0);

      // Overall score should be average of dimensions
      const expectedOverall = (
        metrics.economicIntegrationScore +
        metrics.socialIntegrationScore +
        metrics.civicIntegrationScore +
        metrics.culturalIntegrationScore
      ) / 4;
      expect(Math.abs(metrics.overallIntegrationScore - expectedOverall)).toBeLessThan(0.1);

      // Stage distribution should match sample data
      expect(metrics.stageDistribution.initial_settlement).toBe(1);
      expect(metrics.stageDistribution.adaptation).toBe(1);
      expect(metrics.stageDistribution.integration).toBe(1);

      // Success rate should be calculated correctly (integration + full_integration stages)
      const expectedSuccessRate = (1 / 3) * 100; // Only 1 out of 3 in integration stage
      expect(Math.abs(metrics.integrationSuccessRate - expectedSuccessRate)).toBeLessThan(1);
    });
  });

  describe('Individual Trajectory Analysis', () => {
    it('should analyze individual integration trajectory', () => {
      const outcome = sampleOutcomes[0]; // 24 months, adaptation stage
      const trajectory = analytics.analyzeIndividualTrajectory(outcome);

      expect(trajectory).toBeDefined();
      expect(trajectory.migrantId).toBe(outcome.id);
      expect(trajectory.currentStage).toBe('adaptation');
      expect(trajectory.timeInDestination).toBe(24);

      // Progress metrics
      expect(trajectory.progressRate).toBeGreaterThan(0);
      expect(trajectory.integrationVelocity).toBeGreaterThan(0);

      // Dimensional progress
      expect(trajectory.dimensionalProgress.economic).toBeGreaterThan(0);
      expect(trajectory.dimensionalProgress.social).toBeGreaterThan(0);
      expect(trajectory.dimensionalProgress.civic).toBeGreaterThan(0);
      expect(trajectory.dimensionalProgress.cultural).toBeGreaterThan(0);

      // Risk and protective factors
      expect(Array.isArray(trajectory.riskFactors)).toBe(true);
      expect(Array.isArray(trajectory.protectiveFactors)).toBe(true);

      // Predictions
      expect(['successful', 'challenging', 'at_risk']).toContain(trajectory.predictedOutcome);
      expect(trajectory.timeToFullIntegration).toBeGreaterThanOrEqual(-1); // -1 means cannot estimate

      // Interventions
      expect(Array.isArray(trajectory.recommendedInterventions)).toBe(true);
    });

    it('should identify risk factors correctly', () => {
      // Create outcome with high barriers
      const riskOutcome = createSampleOutcome('risk_outcome', 'flow_risk', 'city_1', 6, 'arrival', {
        economic: { employmentRate: 20, socialMobility: 15, jobSkillUtilization: 25 },
        social: { languageProficiency: 15, culturalAdaptation: 20, communityParticipation: 10 },
        civic: { civicParticipation: 5, legalKnowledge: 20, institutionalTrust: 30 },
        cultural: { culturalAdoption: 15, bilingualProficiency: 20, culturalBridging: 10 }
      });

      // Set high barriers
      riskOutcome.integrationChallenges.languageBarriers = 85;
      riskOutcome.socialIntegration.discriminationExperience = 75;
      riskOutcome.socialIntegration.socialNetworkSize = 2;

      const trajectory = analytics.analyzeIndividualTrajectory(riskOutcome);

      expect(trajectory.riskFactors.length).toBeGreaterThan(0);
      expect(trajectory.riskFactors).toContain('High language barriers');
      expect(trajectory.riskFactors).toContain('High discrimination experience');
      expect(trajectory.riskFactors).toContain('Low employment rate');
      expect(trajectory.riskFactors).toContain('Limited social networks');
    });

    it('should identify protective factors correctly', () => {
      // Create outcome with strong protective factors
      const protectedOutcome = createSampleOutcome('protected_outcome', 'flow_protected', 'city_1', 18, 'adaptation', {
        economic: { employmentRate: 80, socialMobility: 70, jobSkillUtilization: 85 },
        social: { languageProficiency: 85, culturalAdaptation: 75, communityParticipation: 70 },
        civic: { civicParticipation: 60, legalKnowledge: 75, institutionalTrust: 80 },
        cultural: { culturalAdoption: 70, bilingualProficiency: 80, culturalBridging: 65 }
      });

      // Set protective service utilization
      protectedOutcome.serviceUtilization.languageClasses = true;
      protectedOutcome.serviceUtilization.mentorshipPrograms = true;
      protectedOutcome.socialIntegration.socialNetworkSize = 20;

      const trajectory = analytics.analyzeIndividualTrajectory(protectedOutcome);

      expect(trajectory.protectiveFactors.length).toBeGreaterThan(0);
      expect(trajectory.protectiveFactors).toContain('Language class participation');
      expect(trajectory.protectiveFactors).toContain('Mentorship program participation');
      expect(trajectory.protectiveFactors).toContain('High language proficiency');
      expect(trajectory.protectiveFactors).toContain('Strong social networks');
    });
  });

  describe('Group Comparison Analysis', () => {
    it('should compare integration outcomes by groups', () => {
      const comparison = analytics.compareIntegrationByGroups(sampleOutcomes, sampleFlows);

      expect(comparison).toBeDefined();

      // Should have comparisons by different groupings
      expect(comparison.byOriginCountry).toBeDefined();
      expect(comparison.byLegalStatus).toBeDefined();
      expect(comparison.byArrivalCohort).toBeDefined();
      expect(comparison.byEducationLevel).toBeDefined();

      // Statistical analysis
      expect(comparison.significantDifferences).toBeDefined();
      expect(comparison.correlationAnalysis).toBeDefined();

      // Check group metrics structure
      Object.values(comparison.byOriginCountry).forEach(groupMetrics => {
        expect(groupMetrics.size).toBeGreaterThan(0);
        expect(groupMetrics.averageIntegrationScore).toBeGreaterThanOrEqual(0);
        expect(groupMetrics.successRate).toBeGreaterThanOrEqual(0);
        expect(groupMetrics.averageTimeToIntegration).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(groupMetrics.primaryChallenges)).toBe(true);
        expect(Array.isArray(groupMetrics.keyStrengths)).toBe(true);
      });
    });

    it('should group by origin country correctly', () => {
      const comparison = analytics.compareIntegrationByGroups(sampleOutcomes, sampleFlows);

      // Should have groups for Country A and Country B
      expect(comparison.byOriginCountry['Country A']).toBeDefined();
      expect(comparison.byOriginCountry['Country B']).toBeDefined();

      // Country A should have 2 migrants (flows 1 and 3)
      expect(comparison.byOriginCountry['Country A'].size).toBe(2);
      
      // Country B should have 1 migrant (flow 2)
      expect(comparison.byOriginCountry['Country B'].size).toBe(1);
    });

    it('should group by arrival cohort correctly', () => {
      const comparison = analytics.compareIntegrationByGroups(sampleOutcomes, sampleFlows);

      // Should categorize by time in destination
      const cohortKeys = Object.keys(comparison.byArrivalCohort);
      expect(cohortKeys.length).toBeGreaterThan(0);

      // Should have appropriate cohort names
      expect(cohortKeys.some(key => key.includes('Recent') || key.includes('Intermediate') || key.includes('Established'))).toBe(true);
    });
  });

  describe('Cultural Adaptation Analysis', () => {
    it('should analyze cultural adaptation patterns', () => {
      const culturalAnalysis = analytics.analyzeCulturalAdaptationPatterns(sampleOutcomes);

      expect(culturalAnalysis).toBeDefined();
      expect(culturalAnalysis.adaptationStrategies).toBeDefined();
      expect(culturalAnalysis.culturalRetentionPatterns).toBeDefined();
      expect(culturalAnalysis.bilingualismDevelopment).toBeDefined();
      expect(culturalAnalysis.identityFormationPatterns).toBeDefined();
      expect(culturalAnalysis.interculturalCompetence).toBeDefined();
      expect(culturalAnalysis.culturalBridgingCapacity).toBeDefined();
    });

    it('should handle diverse cultural backgrounds', () => {
      // Create outcomes with different cultural backgrounds
      const diverseOutcomes = [
        ...sampleOutcomes,
        createSampleOutcome('outcome_4', 'flow_4', 'city_1', 36, 'integration', {
          economic: { employmentRate: 70, socialMobility: 65, jobSkillUtilization: 75 },
          social: { languageProficiency: 60, culturalAdaptation: 50, communityParticipation: 55 },
          civic: { civicParticipation: 50, legalKnowledge: 65, institutionalTrust: 70 },
          cultural: { culturalAdoption: 45, bilingualProficiency: 70, culturalBridging: 80 }
        })
      ];

      // Set different cultural integration patterns
      diverseOutcomes[3].culturalIntegration.culturalRetention = 85; // High retention
      diverseOutcomes[3].culturalIntegration.identityFormation = 'bicultural';

      const culturalAnalysis = analytics.analyzeCulturalAdaptationPatterns(diverseOutcomes);

      expect(culturalAnalysis).toBeDefined();
      // Should handle the diverse patterns without errors
      expect(typeof culturalAnalysis.adaptationStrategies).toBe('object');
    });
  });

  describe('Analytics Edge Cases', () => {
    it('should handle single outcome analysis', () => {
      const singleOutcome = [sampleOutcomes[0]];
      const singleFlow = [sampleFlows[0]];
      const singlePolicy = [samplePolicies[0]];

      const report = analytics.generateIntegrationReport(singleOutcome, singleFlow, singlePolicy);

      expect(report).toBeDefined();
      expect(report.totalMigrants).toBe(1);
      expect(report.integrationMetrics.overallIntegrationScore).toBeGreaterThan(0);
    });

    it('should handle mismatched flows and outcomes', () => {
      // Outcomes without corresponding flows
      const mismatchedOutcomes = [
        createSampleOutcome('orphan_outcome', 'nonexistent_flow', 'city_1', 12, 'adaptation', {
          economic: { employmentRate: 60, socialMobility: 50, jobSkillUtilization: 55 },
          social: { languageProficiency: 65, culturalAdaptation: 55, communityParticipation: 45 },
          civic: { civicParticipation: 40, legalKnowledge: 50, institutionalTrust: 60 },
          cultural: { culturalAdoption: 50, bilingualProficiency: 60, culturalBridging: 45 }
        })
      ];

      const comparison = analytics.compareIntegrationByGroups(mismatchedOutcomes, sampleFlows);

      expect(comparison).toBeDefined();
      // Should handle gracefully with "Unknown" categories
      expect(comparison.byOriginCountry['Unknown']).toBeDefined();
      expect(comparison.byEducationLevel['Unknown']).toBeDefined();
    });

    it('should calculate progress rates correctly', () => {
      // Test outcome with known values
      const testOutcome = createSampleOutcome('test_progress', 'flow_test', 'city_1', 24, 'adaptation', {
        economic: { employmentRate: 60, socialMobility: 50, jobSkillUtilization: 65 },
        social: { languageProficiency: 70, culturalAdaptation: 60, communityParticipation: 50 },
        civic: { civicParticipation: 45, legalKnowledge: 55, institutionalTrust: 65 },
        cultural: { culturalAdoption: 55, bilingualProficiency: 65, culturalBridging: 50 }
      });

      const trajectory = analytics.analyzeIndividualTrajectory(testOutcome);

      // Progress rate should be positive for someone in adaptation stage
      expect(trajectory.progressRate).toBeGreaterThan(0);
      
      // Integration velocity should be reasonable (not too high or too low)
      expect(trajectory.integrationVelocity).toBeGreaterThan(0);
      expect(trajectory.integrationVelocity).toBeLessThan(10); // Sanity check
    });

    it('should handle extreme integration scores', () => {
      // Create outcome with very high scores
      const highScoreOutcome = createSampleOutcome('high_score', 'flow_high', 'city_1', 60, 'full_integration', {
        economic: { employmentRate: 95, socialMobility: 90, jobSkillUtilization: 98 },
        social: { languageProficiency: 98, culturalAdaptation: 95, communityParticipation: 90 },
        civic: { civicParticipation: 85, legalKnowledge: 95, institutionalTrust: 90 },
        cultural: { culturalAdoption: 90, bilingualProficiency: 95, culturalBridging: 88 }
      });

      // Create outcome with very low scores
      const lowScoreOutcome = createSampleOutcome('low_score', 'flow_low', 'city_1', 3, 'arrival', {
        economic: { employmentRate: 5, socialMobility: 10, jobSkillUtilization: 8 },
        social: { languageProficiency: 10, culturalAdaptation: 15, communityParticipation: 5 },
        civic: { civicParticipation: 2, legalKnowledge: 15, institutionalTrust: 25 },
        cultural: { culturalAdoption: 12, bilingualProficiency: 15, culturalBridging: 8 }
      });

      const extremeOutcomes = [highScoreOutcome, lowScoreOutcome];
      const report = analytics.generateIntegrationReport(extremeOutcomes, [], []);

      expect(report).toBeDefined();
      expect(report.integrationMetrics.overallIntegrationScore).toBeGreaterThan(0);
      expect(report.integrationMetrics.overallIntegrationScore).toBeLessThan(100);

      // Should handle extreme trajectories
      const highTrajectory = analytics.analyzeIndividualTrajectory(highScoreOutcome);
      const lowTrajectory = analytics.analyzeIndividualTrajectory(lowScoreOutcome);

      expect(highTrajectory.predictedOutcome).toBe('successful');
      expect(lowTrajectory.predictedOutcome).toBe('at_risk');
    });
  });

  // Helper functions for creating test data

  function createSampleOutcome(
    id: string, 
    flowId: string, 
    cityId: string, 
    timeInDestination: number, 
    stage: string,
    scores: {
      economic: { employmentRate: number; socialMobility: number; jobSkillUtilization: number };
      social: { languageProficiency: number; culturalAdaptation: number; communityParticipation: number };
      civic: { civicParticipation: number; legalKnowledge: number; institutionalTrust: number };
      cultural: { culturalAdoption: number; bilingualProficiency: number; culturalBridging: number };
    }
  ): IntegrationOutcome {
    return {
      id,
      migrationFlowId: flowId,
      cityId,
      timeInDestination,
      integrationStage: stage as any,
      
      economicIntegration: {
        employmentRate: scores.economic.employmentRate,
        averageIncome: 40000,
        incomeGrowth: 5,
        jobSkillUtilization: scores.economic.jobSkillUtilization,
        entrepreneurshipRate: 10,
        socialMobility: scores.economic.socialMobility
      },
      
      socialIntegration: {
        languageProficiency: scores.social.languageProficiency,
        socialNetworkSize: 10,
        communityParticipation: scores.social.communityParticipation,
        interculturalFriendships: 40,
        culturalAdaptation: scores.social.culturalAdaptation,
        discriminationExperience: 30
      },
      
      civicIntegration: {
        legalStatus: 'temporary',
        civicParticipation: scores.civic.civicParticipation,
        politicalEngagement: 25,
        legalKnowledge: scores.civic.legalKnowledge,
        institutionalTrust: scores.civic.institutionalTrust
      },
      
      culturalIntegration: {
        culturalRetention: 70,
        culturalAdoption: scores.cultural.culturalAdoption,
        bilingualProficiency: scores.cultural.bilingualProficiency,
        culturalBridging: scores.cultural.culturalBridging,
        identityFormation: 'bicultural'
      },
      
      integrationChallenges: {
        languageBarriers: 40,
        credentialRecognition: 50,
        discriminationLevel: 30,
        culturalBarriers: 35,
        economicBarriers: 40,
        legalBarriers: 25
      },
      
      serviceUtilization: {
        languageClasses: false,
        jobTraining: false,
        credentialRecognition: false,
        socialServices: true,
        legalAid: false,
        culturalOrientation: true,
        mentorshipPrograms: false
      },
      
      outcomes: {
        overallSatisfaction: 65,
        qualityOfLifeChange: 15,
        futureIntentions: 'stay_permanently',
        recommendationLikelihood: 70
      },
      
      lastAssessment: new Date(),
      assessmentFrequency: 3,
      dataQuality: 80
    };
  }

  function createSampleFlow(id: string, originCountry: string, subtype: string): MigrationFlow {
    return {
      id,
      type: 'immigration',
      subtype: subtype as any,
      originCountry,
      destinationCityId: 'city_1',
      populationSize: 500,
      startDate: new Date(),
      demographics: {
        ageDistribution: { '25-35': 0.6, '35-45': 0.4 },
        genderDistribution: { male: 0.5, female: 0.5, other: 0.0 },
        educationLevels: { 'university': 0.6, 'secondary': 0.4 },
        skillLevels: { 'technology': 0.7, 'healthcare': 0.3 },
        languages: ['English'],
        culturalBackground: 'Test Background'
      },
      economicProfile: {
        averageIncome: 45000,
        savings: 18000,
        jobSkills: ['programming'],
        employmentRate: 0.8,
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
      visaType: 'Work Visa',
      documentationLevel: 85,
      integrationFactors: {
        languageProficiency: 75,
        culturalSimilarity: 60,
        socialNetworks: 45,
        adaptabilityScore: 80,
        resourceAccess: 70
      },
      createdAt: new Date(),
      lastUpdated: new Date(),
      status: 'active'
    };
  }

  function createSamplePolicy(id: string, type: string, targetGroups: string[]): ImmigrationPolicy {
    return {
      id,
      name: `Test ${type} Policy`,
      description: `Test policy for ${type}`,
      type: type as any,
      parameters: {
        annualQuota: 5000
      },
      effects: {
        flowMultiplier: 1.2,
        legalPathwayStrength: 75,
        illegalFlowReduction: 25,
        integrationSupport: 65,
        economicImpact: 15,
        socialCohesion: 8
      },
      targetGroups,
      implementationDate: new Date('2024-01-01'),
      enforcementLevel: 75,
      publicSupport: 60,
      implementationCost: 2000000,
      annualOperatingCost: 1000000,
      requiredInfrastructure: [],
      createdAt: new Date(),
      lastUpdated: new Date(),
      status: 'active'
    };
  }
});
