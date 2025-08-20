/**
 * Psychology Engine Unit Tests
 * 
 * Comprehensive tests for the Psychology Engine including:
 * - Psychological profile generation
 * - Behavioral response prediction
 * - Incentive structure creation
 * - Social dynamics modeling
 * - Policy response analysis
 * - Behavioral economics applications
 */

import { PsychologyEngine } from '../PsychologyEngine.js';
import { 
  PsychologicalProfile, 
  BehavioralResponse,
  IncentiveStructure,
  SocialDynamics,
  PolicyPsychologyResponse,
  PERSONALITY_ARCHETYPES,
  BEHAVIORAL_CONSTANTS
} from '../types.js';

describe('PsychologyEngine', () => {
  let engine: PsychologyEngine;

  beforeEach(() => {
    engine = new PsychologyEngine({
      personalityVariation: 0.3,
      responseVolatility: 0.2,
      adaptationSpeed: 0.15,
      socialInfluenceStrength: 0.4,
      learningRate: 0.05
    });
  });

  describe('Psychological Profile Generation', () => {
    test('should generate a valid psychological profile', () => {
      const profile = engine.generatePsychologicalProfile({
        citizenId: 'test_citizen_1',
        culturalBackground: 'American'
      });

      expect(profile).toBeDefined();
      expect(profile.id).toMatch(/^psych_/);
      expect(profile.citizenId).toBe('test_citizen_1');
      expect(profile.culturalIdentity.culturalBackground).toBe('American');
      
      // Validate personality traits are within valid range
      expect(profile.personality.openness).toBeGreaterThanOrEqual(0);
      expect(profile.personality.openness).toBeLessThanOrEqual(100);
      expect(profile.personality.conscientiousness).toBeGreaterThanOrEqual(0);
      expect(profile.personality.conscientiousness).toBeLessThanOrEqual(100);
      expect(profile.personality.extraversion).toBeGreaterThanOrEqual(0);
      expect(profile.personality.extraversion).toBeLessThanOrEqual(100);
      expect(profile.personality.agreeableness).toBeGreaterThanOrEqual(0);
      expect(profile.personality.agreeableness).toBeLessThanOrEqual(100);
      expect(profile.personality.neuroticism).toBeGreaterThanOrEqual(0);
      expect(profile.personality.neuroticism).toBeLessThanOrEqual(100);
    });

    test('should generate profile with specific archetype', () => {
      const profile = engine.generatePsychologicalProfile({
        citizenId: 'test_citizen_2',
        archetype: 'ENTREPRENEUR'
      });

      expect(profile).toBeDefined();
      expect(profile.citizenId).toBe('test_citizen_2');
      
      // Entrepreneur archetype should have high openness and conscientiousness
      expect(profile.personality.openness).toBeGreaterThan(70);
      expect(profile.personality.conscientiousness).toBeGreaterThan(70);
      expect(profile.riskProfile.riskTolerance).toBeGreaterThan(60);
    });

    test('should generate profile for migrant', () => {
      const profile = engine.generatePsychologicalProfile({
        migrantId: 'migrant_123',
        culturalBackground: 'European'
      });

      expect(profile).toBeDefined();
      expect(profile.migrantId).toBe('migrant_123');
      expect(profile.culturalIdentity.culturalBackground).toBe('European');
    });

    test('should generate profile for business owner', () => {
      const profile = engine.generatePsychologicalProfile({
        businessOwnerId: 'business_owner_456',
        archetype: 'ENTREPRENEUR'
      });

      expect(profile).toBeDefined();
      expect(profile.businessOwnerId).toBe('business_owner_456');
    });

    test('should validate risk profile correlations', () => {
      const profile = engine.generatePsychologicalProfile({
        citizenId: 'test_citizen_3'
      });

      // Risk tolerance should correlate with openness and low neuroticism
      if (profile.personality.openness > 80 && profile.personality.neuroticism < 20) {
        expect(profile.riskProfile.riskTolerance).toBeGreaterThan(50);
      }
      
      // Loss aversion should correlate with neuroticism
      if (profile.personality.neuroticism > 80) {
        expect(profile.riskProfile.lossAversion).toBeGreaterThan(50);
      }
    });

    test('should validate motivation system structure', () => {
      const profile = engine.generatePsychologicalProfile({
        citizenId: 'test_citizen_4'
      });

      // Validate Maslow's hierarchy levels
      expect(profile.motivationSystem.physiologicalNeeds).toBeGreaterThanOrEqual(0);
      expect(profile.motivationSystem.physiologicalNeeds).toBeLessThanOrEqual(100);
      expect(profile.motivationSystem.safetyNeeds).toBeGreaterThanOrEqual(0);
      expect(profile.motivationSystem.safetyNeeds).toBeLessThanOrEqual(100);
      expect(profile.motivationSystem.belongingNeeds).toBeGreaterThanOrEqual(0);
      expect(profile.motivationSystem.belongingNeeds).toBeLessThanOrEqual(100);
      expect(profile.motivationSystem.esteemNeeds).toBeGreaterThanOrEqual(0);
      expect(profile.motivationSystem.esteemNeeds).toBeLessThanOrEqual(100);
      expect(profile.motivationSystem.selfActualization).toBeGreaterThanOrEqual(0);
      expect(profile.motivationSystem.selfActualization).toBeLessThanOrEqual(100);

      // Validate values structure
      expect(Object.keys(profile.motivationSystem.values)).toHaveLength(10);
      Object.values(profile.motivationSystem.values).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Behavioral Response Prediction', () => {
    let profile: PsychologicalProfile;

    beforeEach(() => {
      profile = engine.generatePsychologicalProfile({
        citizenId: 'test_citizen_behavior',
        archetype: 'CONSERVATIVE'
      });
    });

    test('should predict behavioral response to policy stimulus', () => {
      const response = engine.predictBehavioralResponse(
        profile.id,
        'policy',
        'universal_healthcare',
        {
          type: 'social',
          impact: 'high',
          cost: 1000,
          beneficiaries: 'all_citizens'
        }
      );

      expect(response).toBeDefined();
      expect(response.id).toMatch(/^response_/);
      expect(response.profileId).toBe(profile.id);
      expect(response.stimulusType).toBe('policy');
      expect(response.stimulusId).toBe('universal_healthcare');
      expect(['support', 'oppose', 'neutral', 'adapt', 'resist', 'ignore']).toContain(response.responseType);
      expect(response.responseIntensity).toBeGreaterThanOrEqual(0);
      expect(response.responseIntensity).toBeLessThanOrEqual(100);
      expect(response.confidence).toBeGreaterThanOrEqual(0);
      expect(response.confidence).toBeLessThanOrEqual(100);
    });

    test('should predict response to economic stimulus', () => {
      const response = engine.predictBehavioralResponse(
        profile.id,
        'economic',
        'interest_rate_change',
        {
          type: 'monetary_policy',
          direction: 'increase',
          magnitude: 0.5
        }
      );

      expect(response).toBeDefined();
      expect(response.stimulusType).toBe('economic');
      expect(response.behaviorChanges.economicBehavior).toBeDefined();
      expect(response.behaviorChanges.economicBehavior?.spendingChange).toBeDefined();
      expect(response.behaviorChanges.economicBehavior?.savingChange).toBeDefined();
      expect(response.behaviorChanges.economicBehavior?.investmentChange).toBeDefined();
    });

    test('should predict response to social stimulus', () => {
      const response = engine.predictBehavioralResponse(
        profile.id,
        'social',
        'cultural_event',
        {
          type: 'festival',
          participation: 'voluntary',
          cultural_significance: 'high'
        }
      );

      expect(response).toBeDefined();
      expect(response.stimulusType).toBe('social');
      expect(response.behaviorChanges.socialBehavior).toBeDefined();
      expect(response.behaviorChanges.socialBehavior?.socialEngagementChange).toBeDefined();
      expect(response.behaviorChanges.socialBehavior?.trustLevelChange).toBeDefined();
    });

    test('should include primary drivers and conflicting factors', () => {
      const response = engine.predictBehavioralResponse(
        profile.id,
        'environmental',
        'carbon_tax',
        {
          type: 'tax_policy',
          rate: 50,
          scope: 'all_emissions'
        }
      );

      expect(response.primaryDrivers).toBeDefined();
      expect(Array.isArray(response.primaryDrivers)).toBe(true);
      expect(response.primaryDrivers.length).toBeGreaterThan(0);
      expect(response.conflictingFactors).toBeDefined();
      expect(Array.isArray(response.conflictingFactors)).toBe(true);
    });

    test('should calculate adaptation metrics', () => {
      const response = engine.predictBehavioralResponse(
        profile.id,
        'cultural',
        'language_policy',
        {
          type: 'official_language_change',
          languages: ['English', 'Spanish'],
          implementation_period: 24
        }
      );

      expect(response.adaptationRate).toBeGreaterThanOrEqual(0);
      expect(response.adaptationRate).toBeLessThanOrEqual(100);
      expect(response.habitualizeRate).toBeGreaterThanOrEqual(0);
      expect(response.habitualizeRate).toBeLessThanOrEqual(100);
      expect(response.fatigueRate).toBeGreaterThanOrEqual(0);
      expect(response.fatigueRate).toBeLessThanOrEqual(100);
      expect(response.duration).toBeGreaterThan(0);
    });

    test('should handle invalid profile ID', () => {
      expect(() => {
        engine.predictBehavioralResponse(
          'invalid_profile_id',
          'policy',
          'test_policy',
          {}
        );
      }).toThrow('Psychological profile not found');
    });
  });

  describe('Incentive Structure Creation', () => {
    test('should create valid incentive structure', () => {
      const incentive = engine.createIncentiveStructure({
        name: 'Energy Efficiency Incentive',
        description: 'Encourage home energy efficiency improvements',
        type: 'environmental',
        incentiveComponents: {
          monetaryReward: 2000,
          socialRecognition: 60,
          autonomyIncrease: 40,
          securityIncrease: 30,
          purposeAlignment: 80
        },
        implementationCost: 2500
      });

      expect(incentive).toBeDefined();
      expect(incentive.id).toMatch(/^incentive_/);
      expect(incentive.name).toBe('Energy Efficiency Incentive');
      expect(incentive.type).toBe('environmental');
      expect(incentive.incentiveComponents.monetaryReward).toBe(2000);
      expect(incentive.implementationCost).toBe(2500);
      expect(incentive.status).toBe('draft');
    });

    test('should analyze targeting effectiveness', () => {
      const incentive = engine.createIncentiveStructure({
        name: 'Innovation Incentive',
        description: 'Encourage technological innovation',
        type: 'economic',
        incentiveComponents: {
          monetaryReward: 5000,
          socialRecognition: 80,
          autonomyIncrease: 90,
          growthOpportunity: 95
        }
      });

      expect(incentive.targetPersonalities).toBeDefined();
      expect(Array.isArray(incentive.targetPersonalities)).toBe(true);
      expect(incentive.targetValues).toBeDefined();
      expect(Array.isArray(incentive.targetValues)).toBe(true);
      expect(incentive.targetMotivations).toBeDefined();
      expect(Array.isArray(incentive.targetMotivations)).toBe(true);
    });

    test('should calculate scalability and sustainability factors', () => {
      const incentive = engine.createIncentiveStructure({
        name: 'Community Service Incentive',
        description: 'Encourage volunteer community service',
        type: 'social',
        incentiveComponents: {
          socialRecognition: 90,
          purposeAlignment: 85,
          socialConnection: 80
        }
      });

      expect(incentive.scalabilityFactor).toBeGreaterThanOrEqual(0);
      expect(incentive.scalabilityFactor).toBeLessThanOrEqual(100);
      expect(incentive.sustainabilityFactor).toBeGreaterThanOrEqual(0);
      expect(incentive.sustainabilityFactor).toBeLessThanOrEqual(100);
    });

    test('should identify potential side effects', () => {
      const incentive = engine.createIncentiveStructure({
        name: 'High-Risk Investment Incentive',
        description: 'Encourage high-risk, high-reward investments',
        type: 'economic',
        incentiveComponents: {
          monetaryReward: 10000,
          autonomyIncrease: 70
        }
      });

      expect(incentive.potentialSideEffects).toBeDefined();
      expect(incentive.potentialSideEffects.economicEffects).toBeDefined();
      expect(Array.isArray(incentive.potentialSideEffects.economicEffects)).toBe(true);
      expect(incentive.potentialSideEffects.socialEffects).toBeDefined();
      expect(Array.isArray(incentive.potentialSideEffects.socialEffects)).toBe(true);
      expect(incentive.potentialSideEffects.psychologicalEffects).toBeDefined();
      expect(Array.isArray(incentive.potentialSideEffects.psychologicalEffects)).toBe(true);
    });
  });

  describe('Social Dynamics Modeling', () => {
    test('should create social dynamics for city group', () => {
      // First create some profiles for the group
      const profiles = [
        engine.generatePsychologicalProfile({ citizenId: 'citizen_1' }),
        engine.generatePsychologicalProfile({ citizenId: 'citizen_2' }),
        engine.generatePsychologicalProfile({ citizenId: 'citizen_3' })
      ];

      const dynamics = engine.updateSocialDynamics('test_city_1', 'city');

      expect(dynamics).toBeDefined();
      expect(dynamics.id).toMatch(/^dynamics_/);
      expect(dynamics.groupId).toBe('test_city_1');
      expect(dynamics.groupType).toBe('city');
      expect(dynamics.groupCohesion).toBeGreaterThanOrEqual(0);
      expect(dynamics.groupCohesion).toBeLessThanOrEqual(100);
      expect(dynamics.groupIdentity).toBeGreaterThanOrEqual(0);
      expect(dynamics.groupIdentity).toBeLessThanOrEqual(100);
    });

    test('should analyze influence networks', () => {
      const dynamics = engine.updateSocialDynamics('test_workplace_1', 'workplace');

      expect(dynamics.influenceNetworks).toBeDefined();
      expect(dynamics.influenceNetworks.leaders).toBeDefined();
      expect(Array.isArray(dynamics.influenceNetworks.leaders)).toBe(true);
      expect(dynamics.influenceNetworks.influenceStrength).toBeDefined();
      expect(typeof dynamics.influenceNetworks.influenceStrength).toBe('object');
      expect(dynamics.influenceNetworks.influenceReach).toBeDefined();
      expect(typeof dynamics.influenceNetworks.influenceReach).toBe('object');
    });

    test('should assess collective mood', () => {
      const dynamics = engine.updateSocialDynamics('test_neighborhood_1', 'neighborhood');

      expect(dynamics.collectiveMood).toBeDefined();
      expect(dynamics.collectiveMood.optimism).toBeGreaterThanOrEqual(0);
      expect(dynamics.collectiveMood.optimism).toBeLessThanOrEqual(100);
      expect(dynamics.collectiveMood.anxiety).toBeGreaterThanOrEqual(0);
      expect(dynamics.collectiveMood.anxiety).toBeLessThanOrEqual(100);
      expect(dynamics.collectiveMood.satisfaction).toBeGreaterThanOrEqual(0);
      expect(dynamics.collectiveMood.satisfaction).toBeLessThanOrEqual(100);
      expect(dynamics.collectiveMood.trust).toBeGreaterThanOrEqual(0);
      expect(dynamics.collectiveMood.trust).toBeLessThanOrEqual(100);
    });

    test('should identify social phenomena', () => {
      const dynamics = engine.updateSocialDynamics('test_cultural_group_1', 'cultural_group');

      expect(dynamics.socialPhenomena).toBeDefined();
      expect(dynamics.socialPhenomena.conformityPressure).toBeGreaterThanOrEqual(0);
      expect(dynamics.socialPhenomena.conformityPressure).toBeLessThanOrEqual(100);
      expect(dynamics.socialPhenomena.polarization).toBeGreaterThanOrEqual(0);
      expect(dynamics.socialPhenomena.polarization).toBeLessThanOrEqual(100);
      expect(dynamics.socialPhenomena.groupthink).toBeGreaterThanOrEqual(0);
      expect(dynamics.socialPhenomena.groupthink).toBeLessThanOrEqual(100);
    });
  });

  describe('Policy Response Analysis', () => {
    let profiles: PsychologicalProfile[];

    beforeEach(() => {
      profiles = [
        engine.generatePsychologicalProfile({ citizenId: 'policy_test_1', archetype: 'CONSERVATIVE' }),
        engine.generatePsychologicalProfile({ citizenId: 'policy_test_2', archetype: 'INNOVATOR' }),
        engine.generatePsychologicalProfile({ citizenId: 'policy_test_3', archetype: 'SOCIAL_LEADER' })
      ];
    });

    test('should analyze policy responses for all profiles', () => {
      const policyDetails = {
        name: 'Digital Privacy Act',
        type: 'regulatory',
        scope: 'technology',
        impact: 'medium',
        enforcement: 'strict'
      };

      const responses = engine.analyzePolicyResponse('privacy_policy_123', policyDetails);

      expect(responses).toBeDefined();
      expect(Array.isArray(responses)).toBe(true);
      expect(responses.length).toBeGreaterThan(0);

      responses.forEach(response => {
        expect(response.id).toMatch(/^policy_response_/);
        expect(response.policyId).toBe('privacy_policy_123');
        expect(['positive', 'negative', 'neutral', 'mixed', 'confused']).toContain(response.initialReaction);
        expect(response.reactionIntensity).toBeGreaterThanOrEqual(0);
        expect(response.reactionIntensity).toBeLessThanOrEqual(100);
        expect(response.confidence).toBeGreaterThanOrEqual(0);
        expect(response.confidence).toBeLessThanOrEqual(100);
      });
    });

    test('should predict behavioral compliance', () => {
      const policyDetails = {
        name: 'Mask Mandate',
        type: 'health',
        scope: 'public_spaces',
        enforcement: 'moderate'
      };

      const responses = engine.analyzePolicyResponse('mask_policy_456', policyDetails);

      responses.forEach(response => {
        expect(response.predictedBehaviors).toBeDefined();
        expect(response.predictedBehaviors.compliance).toBeGreaterThanOrEqual(0);
        expect(response.predictedBehaviors.compliance).toBeLessThanOrEqual(100);
        expect(response.predictedBehaviors.support).toBeGreaterThanOrEqual(0);
        expect(response.predictedBehaviors.support).toBeLessThanOrEqual(100);
        expect(response.predictedBehaviors.resistance).toBeGreaterThanOrEqual(0);
        expect(response.predictedBehaviors.resistance).toBeLessThanOrEqual(100);
      });
    });

    test('should calculate adaptation phases', () => {
      const policyDetails = {
        name: 'Remote Work Policy',
        type: 'workplace',
        scope: 'government_employees',
        transition_period: 90
      };

      const responses = engine.analyzePolicyResponse('remote_work_789', policyDetails);

      responses.forEach(response => {
        expect(response.adaptationPhases).toBeDefined();
        expect(response.adaptationPhases.shock).toBeDefined();
        expect(response.adaptationPhases.shock.duration).toBeGreaterThan(0);
        expect(response.adaptationPhases.resistance).toBeDefined();
        expect(response.adaptationPhases.exploration).toBeDefined();
        expect(response.adaptationPhases.commitment).toBeDefined();
      });
    });

    test('should assess influence factors', () => {
      const policyDetails = {
        name: 'Education Reform',
        type: 'social',
        scope: 'public_schools',
        stakeholders: ['parents', 'teachers', 'students']
      };

      const responses = engine.analyzePolicyResponse('education_reform_101', policyDetails);

      responses.forEach(response => {
        expect(response.influenceFactors).toBeDefined();
        expect(response.influenceFactors.personalExperience).toBeGreaterThanOrEqual(0);
        expect(response.influenceFactors.personalExperience).toBeLessThanOrEqual(100);
        expect(response.influenceFactors.socialPressure).toBeGreaterThanOrEqual(0);
        expect(response.influenceFactors.socialPressure).toBeLessThanOrEqual(100);
        expect(response.influenceFactors.authorityInfluence).toBeGreaterThanOrEqual(0);
        expect(response.influenceFactors.authorityInfluence).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Behavioral Economics Applications', () => {
    let profile: PsychologicalProfile;

    beforeEach(() => {
      profile = engine.generatePsychologicalProfile({
        citizenId: 'behavioral_econ_test',
        archetype: 'ENTREPRENEUR'
      });
    });

    test('should apply prospect theory model', () => {
      const context = {
        gains: [100, 200],
        losses: [-50, -100],
        probabilities: [0.5, 0.3]
      };

      const result = engine.applyBehavioralEconomics(profile.id, 'prospect_theory', context);

      expect(typeof result).toBe('number');
    });

    test('should apply social proof model', () => {
      const context = {
        groupSize: 10,
        conformingBehavior: 0.8,
        similarity: 0.7
      };

      const result = engine.applyBehavioralEconomics(profile.id, 'social_proof', context);

      expect(typeof result).toBe('number');
    });

    test('should apply anchoring model', () => {
      const context = {
        anchor: 1000,
        actualValue: 800,
        adjustmentDirection: 'down'
      };

      const result = engine.applyBehavioralEconomics(profile.id, 'anchoring', context);

      expect(typeof result).toBe('number');
    });

    test('should apply framing model', () => {
      const context = {
        frameType: 'gain',
        outcome: 'positive',
        certainty: 0.9
      };

      const result = engine.applyBehavioralEconomics(profile.id, 'framing', context);

      expect(typeof result).toBe('number');
    });

    test('should handle invalid model type', () => {
      const result = engine.applyBehavioralEconomics(profile.id, 'invalid_model' as any, {});

      expect(result).toBe(0);
    });

    test('should handle invalid profile ID', () => {
      const result = engine.applyBehavioralEconomics('invalid_profile', 'prospect_theory', {});

      expect(result).toBe(0);
    });
  });

  describe('System Simulation', () => {
    test('should simulate time step without errors', () => {
      // Create some profiles and responses first
      const profile1 = engine.generatePsychologicalProfile({ citizenId: 'sim_test_1' });
      const profile2 = engine.generatePsychologicalProfile({ citizenId: 'sim_test_2' });
      
      engine.predictBehavioralResponse(profile1.id, 'economic', 'interest_rate', {});
      engine.predictBehavioralResponse(profile2.id, 'social', 'community_event', {});

      expect(() => {
        engine.simulateTimeStep();
      }).not.toThrow();
    });

    test('should track psychology events', () => {
      const profile = engine.generatePsychologicalProfile({ citizenId: 'event_test' });
      engine.predictBehavioralResponse(profile.id, 'policy', 'test_policy', {});

      const events = engine.getPsychologyEvents(5);
      expect(Array.isArray(events)).toBe(true);
    });
  });

  describe('Data Retrieval Methods', () => {
    test('should retrieve all profiles', () => {
      const profile1 = engine.generatePsychologicalProfile({ citizenId: 'retrieve_test_1' });
      const profile2 = engine.generatePsychologicalProfile({ citizenId: 'retrieve_test_2' });

      const allProfiles = engine.getAllProfiles();
      expect(Array.isArray(allProfiles)).toBe(true);
      expect(allProfiles.length).toBeGreaterThanOrEqual(2);
      expect(allProfiles.some(p => p.id === profile1.id)).toBe(true);
      expect(allProfiles.some(p => p.id === profile2.id)).toBe(true);
    });

    test('should retrieve specific profile', () => {
      const profile = engine.generatePsychologicalProfile({ citizenId: 'specific_test' });
      
      const retrieved = engine.getProfile(profile.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(profile.id);
      expect(retrieved?.citizenId).toBe('specific_test');
    });

    test('should return undefined for non-existent profile', () => {
      const retrieved = engine.getProfile('non_existent_id');
      expect(retrieved).toBeUndefined();
    });

    test('should retrieve behavioral responses for profile', () => {
      const profile = engine.generatePsychologicalProfile({ citizenId: 'response_test' });
      engine.predictBehavioralResponse(profile.id, 'economic', 'test_stimulus', {});
      engine.predictBehavioralResponse(profile.id, 'social', 'test_stimulus_2', {});

      const responses = engine.getBehavioralResponses(profile.id);
      expect(Array.isArray(responses)).toBe(true);
      expect(responses.length).toBe(2);
      expect(responses.every(r => r.profileId === profile.id)).toBe(true);
    });

    test('should retrieve all incentives', () => {
      engine.createIncentiveStructure({
        name: 'Test Incentive 1',
        description: 'Test description',
        type: 'economic',
        incentiveComponents: { monetaryReward: 100 }
      });

      const incentives = engine.getAllIncentives();
      expect(Array.isArray(incentives)).toBe(true);
      expect(incentives.length).toBeGreaterThanOrEqual(1);
    });

    test('should retrieve social dynamics', () => {
      const dynamics = engine.updateSocialDynamics('test_group', 'city');
      
      const retrieved = engine.getSocialDynamics('test_group');
      expect(retrieved).toBeDefined();
      expect(retrieved?.groupId).toBe('test_group');
    });

    test('should retrieve policy responses', () => {
      const profile = engine.generatePsychologicalProfile({ citizenId: 'policy_retrieve_test' });
      const responses = engine.analyzePolicyResponse('test_policy', { type: 'test' });

      const retrieved = engine.getPolicyResponses('test_policy');
      expect(Array.isArray(retrieved)).toBe(true);
      expect(retrieved.length).toBeGreaterThanOrEqual(1);
      expect(retrieved.every(r => r.policyId === 'test_policy')).toBe(true);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle empty behavioral responses gracefully', () => {
      const responses = engine.getBehavioralResponses('non_existent_profile');
      expect(Array.isArray(responses)).toBe(true);
      expect(responses.length).toBe(0);
    });

    test('should handle empty policy responses gracefully', () => {
      const responses = engine.getPolicyResponses('non_existent_policy');
      expect(Array.isArray(responses)).toBe(true);
      expect(responses.length).toBe(0);
    });

    test('should handle undefined social dynamics gracefully', () => {
      const dynamics = engine.getSocialDynamics('non_existent_group');
      expect(dynamics).toBeUndefined();
    });

    test('should limit psychology events to reasonable number', () => {
      // Generate many events
      for (let i = 0; i < 1200; i++) {
        const profile = engine.generatePsychologicalProfile({ citizenId: `stress_test_${i}` });
        engine.predictBehavioralResponse(profile.id, 'policy', `policy_${i}`, {});
      }

      const events = engine.getPsychologyEvents();
      expect(events.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('Configuration and Constants', () => {
    test('should use behavioral constants correctly', () => {
      expect(BEHAVIORAL_CONSTANTS.DEFAULT_LOSS_AVERSION).toBe(2.25);
      expect(BEHAVIORAL_CONSTANTS.DEFAULT_DISCOUNT_RATE).toBe(0.03);
      expect(BEHAVIORAL_CONSTANTS.SOCIAL_PROOF_THRESHOLD).toBe(0.3);
      expect(BEHAVIORAL_CONSTANTS.ANCHORING_STRENGTH).toBe(0.4);
      expect(BEHAVIORAL_CONSTANTS.FRAMING_EFFECT_SIZE).toBe(0.2);
      expect(BEHAVIORAL_CONSTANTS.HYPERBOLIC_BETA).toBe(0.7);
    });

    test('should validate personality archetypes', () => {
      expect(PERSONALITY_ARCHETYPES.ENTREPRENEUR).toBeDefined();
      expect(PERSONALITY_ARCHETYPES.CONSERVATIVE).toBeDefined();
      expect(PERSONALITY_ARCHETYPES.INNOVATOR).toBeDefined();
      expect(PERSONALITY_ARCHETYPES.TRADITIONALIST).toBeDefined();
      expect(PERSONALITY_ARCHETYPES.SOCIAL_LEADER).toBeDefined();

      // Validate archetype structure
      Object.values(PERSONALITY_ARCHETYPES).forEach(archetype => {
        expect(archetype.personality).toBeDefined();
        expect(archetype.riskProfile).toBeDefined();
        
        Object.values(archetype.personality).forEach(trait => {
          expect(trait).toBeGreaterThanOrEqual(0);
          expect(trait).toBeLessThanOrEqual(100);
        });
        
        Object.values(archetype.riskProfile).forEach(risk => {
          expect(risk).toBeGreaterThanOrEqual(0);
          expect(risk).toBeLessThanOrEqual(100);
        });
      });
    });

    test('should create engine with custom configuration', () => {
      const customEngine = new PsychologyEngine({
        personalityVariation: 0.5,
        responseVolatility: 0.3,
        adaptationSpeed: 0.2,
        socialInfluenceStrength: 0.6,
        defaultLossAversion: 2.5,
        learningRate: 0.08
      });

      expect(customEngine).toBeDefined();
      
      // Test that custom configuration affects behavior
      const profile = customEngine.generatePsychologicalProfile({ citizenId: 'config_test' });
      expect(profile).toBeDefined();
    });
  });
});
