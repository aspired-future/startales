/**
 * Behavioral Analytics Unit Tests
 * 
 * Comprehensive tests for the Behavioral Analytics system including:
 * - Population psychology analysis
 * - Behavioral pattern recognition
 * - Social dynamics analytics
 * - Policy response effectiveness
 * - Incentive system performance
 * - Behavioral economics insights
 * - Predictive analytics
 */

import { BehavioralAnalytics, PsychologyAnalyticsData } from '../BehavioralAnalytics';
import { PsychologyEngine } from '../PsychologyEngine';
import { 
  PsychologicalProfile, 
  BehavioralResponse,
  IncentiveStructure,
  SocialDynamics,
  PolicyPsychologyResponse
} from '../types';

describe('BehavioralAnalytics', () => {
  let analytics: BehavioralAnalytics;
  let engine: PsychologyEngine;
  let profiles: PsychologicalProfile[];
  let responses: BehavioralResponse[];
  let incentives: IncentiveStructure[];

  beforeEach(() => {
    analytics = new BehavioralAnalytics();
    engine = new PsychologyEngine();

    // Create test data
    profiles = [
      engine.generatePsychologicalProfile({ 
        citizenId: 'analytics_test_1', 
        archetype: 'ENTREPRENEUR',
        culturalBackground: 'American'
      }),
      engine.generatePsychologicalProfile({ 
        citizenId: 'analytics_test_2', 
        archetype: 'CONSERVATIVE',
        culturalBackground: 'European'
      }),
      engine.generatePsychologicalProfile({ 
        citizenId: 'analytics_test_3', 
        archetype: 'INNOVATOR',
        culturalBackground: 'Asian'
      }),
      engine.generatePsychologicalProfile({ 
        citizenId: 'analytics_test_4', 
        archetype: 'SOCIAL_LEADER',
        culturalBackground: 'American'
      }),
      engine.generatePsychologicalProfile({ 
        citizenId: 'analytics_test_5', 
        archetype: 'TRADITIONALIST',
        culturalBackground: 'Mixed'
      })
    ];

    // Generate behavioral responses
    responses = profiles.flatMap(profile => [
      engine.predictBehavioralResponse(profile.id, 'policy', 'healthcare_reform', { type: 'social' }),
      engine.predictBehavioralResponse(profile.id, 'economic', 'tax_change', { type: 'fiscal' }),
      engine.predictBehavioralResponse(profile.id, 'social', 'community_event', { type: 'cultural' })
    ]);

    // Create incentive structures
    incentives = [
      engine.createIncentiveStructure({
        name: 'Green Energy Incentive',
        description: 'Promote renewable energy adoption',
        type: 'environmental',
        incentiveComponents: {
          monetaryReward: 3000,
          socialRecognition: 70,
          purposeAlignment: 85
        }
      }),
      engine.createIncentiveStructure({
        name: 'Education Incentive',
        description: 'Encourage skill development',
        type: 'social',
        incentiveComponents: {
          growthOpportunity: 90,
          socialRecognition: 60,
          autonomyIncrease: 50
        }
      })
    ];

    // Update analytics with test data
    analytics.updateData({
      profiles,
      responses,
      incentives
    });
  });

  describe('Data Management', () => {
    test('should update analytics data correctly', () => {
      const newProfiles = [
        engine.generatePsychologicalProfile({ citizenId: 'new_test_1' })
      ];

      analytics.updateData({ profiles: newProfiles });

      const analyticsData = analytics.generateAnalytics();
      expect(analyticsData.populationPsychology.totalProfiles).toBe(1);
    });

    test('should handle partial data updates', () => {
      const newResponses = [
        engine.predictBehavioralResponse(profiles[0].id, 'environmental', 'climate_policy', {})
      ];

      analytics.updateData({ responses: newResponses });

      const analyticsData = analytics.generateAnalytics();
      expect(analyticsData).toBeDefined();
    });

    test('should handle empty data gracefully', () => {
      const emptyAnalytics = new BehavioralAnalytics();
      const analyticsData = emptyAnalytics.generateAnalytics();

      expect(analyticsData).toBeDefined();
      expect(analyticsData.populationPsychology.totalProfiles).toBe(0);
      expect(analyticsData.sampleSize).toBe(0);
    });
  });

  describe('Population Psychology Analysis', () => {
    test('should analyze population psychology correctly', () => {
      const analyticsData = analytics.generateAnalytics();
      const popPsych = analyticsData.populationPsychology;

      expect(popPsych.totalProfiles).toBe(profiles.length);
      expect(popPsych.averagePersonality).toBeDefined();
      expect(popPsych.averagePersonality.openness).toBeGreaterThanOrEqual(0);
      expect(popPsych.averagePersonality.openness).toBeLessThanOrEqual(100);
      expect(popPsych.averagePersonality.conscientiousness).toBeGreaterThanOrEqual(0);
      expect(popPsych.averagePersonality.conscientiousness).toBeLessThanOrEqual(100);
    });

    test('should calculate personality distributions', () => {
      const analyticsData = analytics.generateAnalytics();
      const distributions = analyticsData.populationPsychology.personalityDistribution;

      expect(distributions.openness).toBeDefined();
      expect(distributions.openness.min).toBeGreaterThanOrEqual(0);
      expect(distributions.openness.max).toBeLessThanOrEqual(100);
      expect(distributions.openness.mean).toBeGreaterThanOrEqual(0);
      expect(distributions.openness.mean).toBeLessThanOrEqual(100);
      expect(distributions.openness.stdDev).toBeGreaterThanOrEqual(0);

      expect(distributions.conscientiousness).toBeDefined();
      expect(distributions.extraversion).toBeDefined();
      expect(distributions.agreeableness).toBeDefined();
      expect(distributions.neuroticism).toBeDefined();
    });

    test('should calculate risk profile distributions', () => {
      const analyticsData = analytics.generateAnalytics();
      const riskDistributions = analyticsData.populationPsychology.riskProfileDistribution;

      expect(riskDistributions.riskTolerance).toBeDefined();
      expect(riskDistributions.riskTolerance.min).toBeGreaterThanOrEqual(0);
      expect(riskDistributions.riskTolerance.max).toBeLessThanOrEqual(100);
      expect(riskDistributions.lossAversion).toBeDefined();
      expect(riskDistributions.timePreference).toBeDefined();
      expect(riskDistributions.uncertaintyTolerance).toBeDefined();
    });

    test('should analyze cultural diversity', () => {
      const analyticsData = analytics.generateAnalytics();
      const culturalDiversity = analyticsData.populationPsychology.culturalDiversity;

      expect(culturalDiversity).toBeDefined();
      expect(typeof culturalDiversity).toBe('object');
      
      // Should have American, European, Asian, Mixed cultures from test data
      expect(culturalDiversity['American']).toBeDefined();
      expect(culturalDiversity['European']).toBeDefined();
      expect(culturalDiversity['Asian']).toBeDefined();
      expect(culturalDiversity['Mixed']).toBeDefined();

      // Percentages should sum to 100
      const totalPercentage = Object.values(culturalDiversity).reduce((sum, pct) => sum + pct, 0);
      expect(totalPercentage).toBeCloseTo(100, 1);
    });

    test('should calculate psychological health metrics', () => {
      const analyticsData = analytics.generateAnalytics();
      const psychHealth = analyticsData.populationPsychology.psychologicalHealth;

      expect(psychHealth.emotionalStability).toBeGreaterThanOrEqual(0);
      expect(psychHealth.emotionalStability).toBeLessThanOrEqual(100);
      expect(psychHealth.stressResilience).toBeGreaterThanOrEqual(0);
      expect(psychHealth.stressResilience).toBeLessThanOrEqual(100);
      expect(psychHealth.adaptability).toBeGreaterThanOrEqual(0);
      expect(psychHealth.adaptability).toBeLessThanOrEqual(100);
      expect(psychHealth.socialCohesion).toBeGreaterThanOrEqual(0);
      expect(psychHealth.socialCohesion).toBeLessThanOrEqual(100);
    });
  });

  describe('Behavioral Pattern Analysis', () => {
    test('should analyze response frequency patterns', () => {
      const analyticsData = analytics.generateAnalytics();
      const patterns = analyticsData.behavioralPatterns;

      expect(patterns.responseFrequency).toBeDefined();
      expect(typeof patterns.responseFrequency).toBe('object');

      // Should have response types from test data
      const responseTypes = Object.keys(patterns.responseFrequency);
      expect(responseTypes.length).toBeGreaterThan(0);
      
      Object.values(patterns.responseFrequency).forEach(frequency => {
        expect(frequency).toBeGreaterThanOrEqual(0);
      });
    });

    test('should calculate adaptation rates by stimulus type', () => {
      const analyticsData = analytics.generateAnalytics();
      const adaptationRates = analyticsData.behavioralPatterns.adaptationRates;

      expect(adaptationRates).toBeDefined();
      expect(adaptationRates.policy).toBeDefined();
      expect(adaptationRates.economic).toBeDefined();
      expect(adaptationRates.social).toBeDefined();

      Object.values(adaptationRates).forEach(rate => {
        expect(rate).toBeGreaterThanOrEqual(0);
        expect(rate).toBeLessThanOrEqual(100);
      });
    });

    test('should analyze behavior change patterns', () => {
      const analyticsData = analytics.generateAnalytics();
      const changePatterns = analyticsData.behavioralPatterns.behaviorChangePatterns;

      expect(changePatterns.economic).toBeDefined();
      expect(changePatterns.social).toBeDefined();
      expect(changePatterns.political).toBeDefined();
      expect(changePatterns.cultural).toBeDefined();

      // Validate structure of change patterns
      Object.values(changePatterns).forEach(category => {
        expect(typeof category).toBe('object');
        Object.values(category).forEach((pattern: any) => {
          expect(pattern.frequency).toBeDefined();
          expect(pattern.averageChange).toBeDefined();
          expect(typeof pattern.frequency).toBe('number');
          expect(typeof pattern.averageChange).toBe('number');
        });
      });
    });
  });

  describe('Social Dynamics Analysis', () => {
    test('should handle empty social dynamics gracefully', () => {
      const analyticsData = analytics.generateAnalytics();
      const socialAnalysis = analyticsData.socialDynamicsAnalysis;

      expect(socialAnalysis).toBeDefined();
      expect(socialAnalysis.groupCohesionTrends).toBeDefined();
      expect(socialAnalysis.leadershipPatterns).toBeDefined();
      expect(socialAnalysis.influenceNetworkMetrics).toBeDefined();
    });

    test('should analyze influence network metrics', () => {
      const analyticsData = analytics.generateAnalytics();
      const networkMetrics = analyticsData.socialDynamicsAnalysis.influenceNetworkMetrics;

      expect(networkMetrics.networkDensity).toBeGreaterThanOrEqual(0);
      expect(networkMetrics.networkDensity).toBeLessThanOrEqual(100);
      expect(Array.isArray(networkMetrics.centralityDistribution)).toBe(true);
      expect(networkMetrics.influenceConcentration).toBeGreaterThanOrEqual(0);
      expect(networkMetrics.influenceConcentration).toBeLessThanOrEqual(100);
    });

    test('should track collective mood trends', () => {
      const analyticsData = analytics.generateAnalytics();
      const moodTrends = analyticsData.socialDynamicsAnalysis.collectiveMoodTrends;

      expect(Array.isArray(moodTrends.optimism)).toBe(true);
      expect(Array.isArray(moodTrends.anxiety)).toBe(true);
      expect(Array.isArray(moodTrends.satisfaction)).toBe(true);
      expect(Array.isArray(moodTrends.trust)).toBe(true);
    });
  });

  describe('Policy Response Analysis', () => {
    test('should handle empty policy responses', () => {
      const analyticsData = analytics.generateAnalytics();
      const policyAnalysis = analyticsData.policyResponseAnalysis;

      expect(policyAnalysis).toBeDefined();
      expect(policyAnalysis.overallEffectiveness).toBe(0);
      expect(typeof policyAnalysis.responseRateByPersonality).toBe('object');
      expect(typeof policyAnalysis.complianceRates).toBe('object');
    });

    test('should validate policy analysis structure', () => {
      const analyticsData = analytics.generateAnalytics();
      const policyAnalysis = analyticsData.policyResponseAnalysis;

      expect(policyAnalysis.adaptationTimelines).toBeDefined();
      expect(typeof policyAnalysis.adaptationTimelines).toBe('object');
      expect(policyAnalysis.longTermEffectiveness).toBeDefined();
      expect(typeof policyAnalysis.longTermEffectiveness).toBe('object');
      expect(policyAnalysis.unintendedConsequences).toBeDefined();
      expect(typeof policyAnalysis.unintendedConsequences).toBe('object');
    });
  });

  describe('Incentive Analysis', () => {
    test('should analyze incentive effectiveness', () => {
      const analyticsData = analytics.generateAnalytics();
      const incentiveAnalysis = analyticsData.incentiveAnalysis;

      expect(incentiveAnalysis).toBeDefined();
      expect(incentiveAnalysis.incentiveEffectiveness).toBeDefined();
      expect(typeof incentiveAnalysis.incentiveEffectiveness).toBe('object');
      expect(incentiveAnalysis.targetingAccuracy).toBeDefined();
      expect(typeof incentiveAnalysis.targetingAccuracy).toBe('object');
      expect(incentiveAnalysis.costEffectiveness).toBeDefined();
      expect(typeof incentiveAnalysis.costEffectiveness).toBe('object');
    });

    test('should provide optimal incentive design insights', () => {
      const analyticsData = analytics.generateAnalytics();
      const optimalDesign = analyticsData.incentiveAnalysis.optimalIncentiveDesign;

      expect(optimalDesign).toBeDefined();
      expect(Array.isArray(optimalDesign.mostEffectiveComponents)).toBe(true);
      expect(typeof optimalDesign.personalityTargeting).toBe('object');
      expect(typeof optimalDesign.valueAlignment).toBe('object');
    });

    test('should track sustainability metrics', () => {
      const analyticsData = analytics.generateAnalytics();
      const sustainabilityMetrics = analyticsData.incentiveAnalysis.sustainabilityMetrics;

      expect(sustainabilityMetrics).toBeDefined();
      expect(typeof sustainabilityMetrics).toBe('object');
    });
  });

  describe('Behavioral Economics Insights', () => {
    test('should analyze bias activation patterns', () => {
      const analyticsData = analytics.generateAnalytics();
      const behavioralInsights = analyticsData.behavioralEconomicsInsights;

      expect(behavioralInsights.biasActivationFrequency).toBeDefined();
      expect(typeof behavioralInsights.biasActivationFrequency).toBe('object');
      expect(behavioralInsights.decisionMakingPatterns).toBeDefined();
      expect(typeof behavioralInsights.decisionMakingPatterns).toBe('object');
    });

    test('should validate prospect theory metrics', () => {
      const analyticsData = analytics.generateAnalytics();
      const prospectValidation = analyticsData.behavioralEconomicsInsights.prospectTheoryValidation;

      expect(prospectValidation.lossAversionAccuracy).toBeGreaterThanOrEqual(0);
      expect(prospectValidation.lossAversionAccuracy).toBeLessThanOrEqual(100);
      expect(prospectValidation.riskAversionAccuracy).toBeGreaterThanOrEqual(0);
      expect(prospectValidation.riskAversionAccuracy).toBeLessThanOrEqual(100);
      expect(prospectValidation.probabilityWeightingAccuracy).toBeGreaterThanOrEqual(0);
      expect(prospectValidation.probabilityWeightingAccuracy).toBeLessThanOrEqual(100);
    });

    test('should analyze social influence effects', () => {
      const analyticsData = analytics.generateAnalytics();
      const socialInfluence = analyticsData.behavioralEconomicsInsights.socialInfluenceEffects;

      expect(socialInfluence).toBeDefined();
      expect(typeof socialInfluence).toBe('object');
    });
  });

  describe('Predictive Insights', () => {
    test('should generate behavior prediction accuracy metrics', () => {
      const analyticsData = analytics.generateAnalytics();
      const predictiveInsights = analyticsData.predictiveInsights;

      expect(predictiveInsights.behaviorPredictionAccuracy).toBeGreaterThanOrEqual(0);
      expect(predictiveInsights.behaviorPredictionAccuracy).toBeLessThanOrEqual(100);
    });

    test('should provide policy outcome predictions', () => {
      const analyticsData = analytics.generateAnalytics();
      const policyPredictions = analyticsData.predictiveInsights.policyOutcomePredictions;

      expect(policyPredictions).toBeDefined();
      expect(typeof policyPredictions).toBe('object');
    });

    test('should generate social trend predictions', () => {
      const analyticsData = analytics.generateAnalytics();
      const trendPredictions = analyticsData.predictiveInsights.socialTrendPredictions;

      expect(trendPredictions).toBeDefined();
      expect(typeof trendPredictions).toBe('object');
    });

    test('should assess risks', () => {
      const analyticsData = analytics.generateAnalytics();
      const riskAssessments = analyticsData.predictiveInsights.riskAssessments;

      expect(riskAssessments).toBeDefined();
      expect(typeof riskAssessments).toBe('object');
    });
  });

  describe('Integration Metrics', () => {
    test('should analyze system integration health', () => {
      const analyticsData = analytics.generateAnalytics();
      const integrationMetrics = analyticsData.integrationMetrics;

      expect(integrationMetrics.systemIntegrationHealth).toBeDefined();
      expect(typeof integrationMetrics.systemIntegrationHealth).toBe('object');
      expect(integrationMetrics.dataQualityMetrics).toBeDefined();
      expect(typeof integrationMetrics.dataQualityMetrics).toBe('object');
    });

    test('should track processing performance', () => {
      const analyticsData = analytics.generateAnalytics();
      const performance = analyticsData.integrationMetrics.processingPerformance;

      expect(performance.averageProcessingTime).toBeGreaterThanOrEqual(0);
      expect(performance.throughput).toBeGreaterThanOrEqual(0);
      expect(performance.errorRate).toBeGreaterThanOrEqual(0);
      expect(performance.errorRate).toBeLessThanOrEqual(100);
    });
  });

  describe('Analytics Metadata', () => {
    test('should include proper metadata', () => {
      const analyticsData = analytics.generateAnalytics();

      expect(analyticsData.analysisTimestamp).toBeInstanceOf(Date);
      expect(analyticsData.dataTimeRange).toBeDefined();
      expect(analyticsData.dataTimeRange.start).toBeInstanceOf(Date);
      expect(analyticsData.dataTimeRange.end).toBeInstanceOf(Date);
      expect(analyticsData.analysisConfidence).toBeGreaterThanOrEqual(0);
      expect(analyticsData.analysisConfidence).toBeLessThanOrEqual(100);
      expect(analyticsData.sampleSize).toBe(profiles.length);
    });

    test('should calculate analysis confidence based on sample size and data quality', () => {
      const analyticsData = analytics.generateAnalytics();
      
      expect(analyticsData.analysisConfidence).toBeGreaterThan(0);
      
      // With 5 profiles, confidence should be reasonable but not maximum
      expect(analyticsData.analysisConfidence).toBeLessThan(100);
    });

    test('should handle time range calculation', () => {
      const analyticsData = analytics.generateAnalytics();
      const timeRange = analyticsData.dataTimeRange;

      expect(timeRange.start.getTime()).toBeLessThan(timeRange.end.getTime());
      
      // Should be approximately 30 days apart
      const daysDiff = (timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60 * 24);
      expect(daysDiff).toBeCloseTo(30, 1);
    });
  });

  describe('Statistical Calculations', () => {
    test('should calculate statistics correctly for valid data', () => {
      const testValues = [10, 20, 30, 40, 50];
      
      // Access private method through analytics instance
      const stats = (analytics as any).calculateStatistics(testValues);

      expect(stats.min).toBe(10);
      expect(stats.max).toBe(50);
      expect(stats.mean).toBe(30);
      expect(stats.stdDev).toBeCloseTo(15.81, 1);
    });

    test('should handle empty arrays gracefully', () => {
      const stats = (analytics as any).calculateStatistics([]);

      expect(stats.min).toBe(0);
      expect(stats.max).toBe(0);
      expect(stats.mean).toBe(0);
      expect(stats.stdDev).toBe(0);
    });

    test('should handle single value arrays', () => {
      const stats = (analytics as any).calculateStatistics([42]);

      expect(stats.min).toBe(42);
      expect(stats.max).toBe(42);
      expect(stats.mean).toBe(42);
      expect(stats.stdDev).toBe(0);
    });
  });

  describe('Performance and Scalability', () => {
    test('should handle large datasets efficiently', () => {
      // Create a larger dataset
      const largeProfiles: PsychologicalProfile[] = [];
      const largeResponses: BehavioralResponse[] = [];

      for (let i = 0; i < 100; i++) {
        const profile = engine.generatePsychologicalProfile({ 
          citizenId: `perf_test_${i}`,
          archetype: ['ENTREPRENEUR', 'CONSERVATIVE', 'INNOVATOR'][i % 3] as any
        });
        largeProfiles.push(profile);
        
        largeResponses.push(
          engine.predictBehavioralResponse(profile.id, 'policy', `policy_${i}`, {}),
          engine.predictBehavioralResponse(profile.id, 'economic', `economic_${i}`, {})
        );
      }

      analytics.updateData({
        profiles: largeProfiles,
        responses: largeResponses
      });

      const startTime = Date.now();
      const analyticsData = analytics.generateAnalytics();
      const endTime = Date.now();

      expect(analyticsData).toBeDefined();
      expect(analyticsData.populationPsychology.totalProfiles).toBe(100);
      
      // Should complete within reasonable time (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
    });

    test('should maintain accuracy with diverse data', () => {
      // Create profiles with extreme values
      const extremeProfiles = [
        engine.generatePsychologicalProfile({ 
          citizenId: 'extreme_1',
          baseTraits: { openness: 100, conscientiousness: 0, extraversion: 100, agreeableness: 0, neuroticism: 100 }
        }),
        engine.generatePsychologicalProfile({ 
          citizenId: 'extreme_2',
          baseTraits: { openness: 0, conscientiousness: 100, extraversion: 0, agreeableness: 100, neuroticism: 0 }
        })
      ];

      analytics.updateData({ profiles: extremeProfiles });
      const analyticsData = analytics.generateAnalytics();

      expect(analyticsData).toBeDefined();
      expect(analyticsData.populationPsychology.totalProfiles).toBe(2);
      
      // Should handle extreme values without errors
      const personalityDist = analyticsData.populationPsychology.personalityDistribution;
      expect(personalityDist.openness.min).toBeLessThanOrEqual(personalityDist.openness.max);
      expect(personalityDist.conscientiousness.min).toBeLessThanOrEqual(personalityDist.conscientiousness.max);
    });
  });

  describe('Data Validation and Integrity', () => {
    test('should validate data consistency across analytics', () => {
      const analyticsData = analytics.generateAnalytics();

      // Sample size should be consistent across all analyses
      expect(analyticsData.sampleSize).toBe(profiles.length);
      expect(analyticsData.populationPsychology.totalProfiles).toBe(profiles.length);

      // Cultural diversity percentages should sum to 100
      const culturalPercentages = Object.values(analyticsData.populationPsychology.culturalDiversity);
      const totalCultural = culturalPercentages.reduce((sum, pct) => sum + pct, 0);
      expect(totalCultural).toBeCloseTo(100, 1);
    });

    test('should maintain data integrity with partial updates', () => {
      // Update only profiles
      const newProfile = engine.generatePsychologicalProfile({ citizenId: 'integrity_test' });
      analytics.updateData({ profiles: [newProfile] });

      const analyticsData = analytics.generateAnalytics();
      
      // Should reflect the new profile count
      expect(analyticsData.populationPsychology.totalProfiles).toBe(1);
      
      // Should handle missing responses gracefully
      expect(analyticsData.behavioralPatterns.responseFrequency).toBeDefined();
    });

    test('should handle mixed data types gracefully', () => {
      // Mix of different profile types
      const mixedProfiles = [
        engine.generatePsychologicalProfile({ citizenId: 'citizen_mix' }),
        engine.generatePsychologicalProfile({ migrantId: 'migrant_mix' }),
        engine.generatePsychologicalProfile({ businessOwnerId: 'business_mix' })
      ];

      analytics.updateData({ profiles: mixedProfiles });
      const analyticsData = analytics.generateAnalytics();

      expect(analyticsData).toBeDefined();
      expect(analyticsData.populationPsychology.totalProfiles).toBe(3);
    });
  });
});
