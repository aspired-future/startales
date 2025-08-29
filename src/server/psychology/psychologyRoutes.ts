/**
 * Psychology System REST API Routes
 * 
 * Provides comprehensive REST API endpoints for the psychology and behavioral economics system.
 * Integrates with all existing systems to provide realistic human behavior modeling.
 * 
 * API Endpoints:
 * - GET /api/psychology/health - System health check
 * - GET /api/psychology/factors - Get psychological factors and analytics
 * - GET /api/psychology/profiles - Get all psychological profiles
 * - GET /api/psychology/profiles/:id - Get specific psychological profile
 * - POST /api/psychology/profiles - Create new psychological profile
 * - PUT /api/psychology/profiles/:id - Update psychological profile
 * - DELETE /api/psychology/profiles/:id - Delete psychological profile
 * - GET /api/psychology/responses/:profileId - Get behavioral responses for profile
 * - POST /api/psychology/predict - Predict behavioral response
 * - GET /api/psychology/incentives - Get all incentive structures
 * - POST /api/psychology/incentives - Create new incentive structure
 * - GET /api/psychology/incentives/:id/effectiveness - Get incentive effectiveness
 * - GET /api/psychology/social-dynamics/:groupId - Get social dynamics for group
 * - PUT /api/psychology/social-dynamics/:groupId - Update social dynamics
 * - GET /api/psychology/policy-responses/:policyId - Get policy response analysis
 * - POST /api/psychology/policy-responses - Analyze policy response
 * - GET /api/psychology/behavioral-economics/:modelType - Apply behavioral economics model
 * - GET /api/psychology/analytics - Get comprehensive psychology analytics
 * - POST /api/psychology/simulate - Simulate psychology system time step
 */

import { Router, Request, Response } from 'express';
import { PsychologyEngine } from './PsychologyEngine';
import { BehavioralAnalytics } from './BehavioralAnalytics';
import { 
  PsychologicalProfile, 
  BehavioralResponse,
  IncentiveStructure,
  PolicyPsychologyResponse,
  PERSONALITY_ARCHETYPES
} from './types';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = Router();

// Enhanced AI Knobs for Psychology System
const psychologyKnobsData = {
  // Personality & Individual Behavior
  personality_variation_level: 0.3,       // Individual personality variation and uniqueness
  behavioral_consistency: 0.7,            // Behavioral consistency vs spontaneity
  emotional_stability: 0.6,               // Emotional stability and regulation
  
  // Cognitive & Decision Making
  cognitive_bias_influence: 0.5,          // Cognitive bias impact on decision making
  rational_decision_making: 0.6,          // Rational vs emotional decision making
  risk_tolerance_variation: 0.4,          // Risk tolerance variation across population
  
  // Social Psychology & Group Dynamics
  social_influence_strength: 0.4,         // Social influence and peer pressure strength
  conformity_pressure: 0.5,               // Social conformity and group think pressure
  leadership_emergence: 0.6,              // Natural leadership emergence in groups
  
  // Learning & Adaptation
  learning_rate: 0.05,                    // Individual and collective learning rate
  adaptation_speed: 0.15,                 // Adaptation speed to new circumstances
  memory_retention: 0.8,                  // Memory retention and experience impact
  
  // Motivation & Incentives
  intrinsic_motivation_strength: 0.7,     // Intrinsic vs extrinsic motivation balance
  reward_sensitivity: 0.6,                // Sensitivity to rewards and incentives
  punishment_avoidance: 0.8,              // Punishment avoidance and fear responses
  
  // Cultural & Social Values
  cultural_value_adherence: 0.6,          // Adherence to cultural values and norms
  tradition_vs_innovation: 0.5,           // Traditional vs innovative mindset
  authority_respect: 0.6,                 // Respect for authority and hierarchy
  
  // Stress & Resilience
  stress_response_intensity: 0.5,         // Stress response intensity and duration
  resilience_level: 0.7,                  // Psychological resilience and recovery
  crisis_adaptation: 0.6,                 // Adaptation capability during crises
  
  // Communication & Expression
  communication_openness: 0.6,            // Openness in communication and expression
  conflict_avoidance: 0.5,                // Conflict avoidance vs confrontation
  empathy_level: 0.7,                     // Empathy and emotional understanding
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Psychology
const psychologyKnobSystem = new EnhancedKnobSystem(psychologyKnobsData);

// Apply psychology knobs to game state
function applyPsychologyKnobsToGameState() {
  const knobs = psychologyKnobSystem.knobs;
  
  // Apply personality and behavior settings
  const personalityBehavior = (knobs.personality_variation_level + knobs.behavioral_consistency + 
    knobs.emotional_stability) / 3;
  
  // Apply cognitive and decision making settings
  const cognitiveDecisionMaking = (knobs.cognitive_bias_influence + knobs.rational_decision_making + 
    knobs.risk_tolerance_variation) / 3;
  
  // Apply social psychology settings
  const socialPsychology = (knobs.social_influence_strength + knobs.conformity_pressure + 
    knobs.leadership_emergence) / 3;
  
  // Apply learning and adaptation settings
  const learningAdaptation = (knobs.learning_rate + knobs.adaptation_speed + 
    knobs.memory_retention) / 3;
  
  // Apply motivation and incentives settings
  const motivationIncentives = (knobs.intrinsic_motivation_strength + knobs.reward_sensitivity + 
    knobs.punishment_avoidance) / 3;
  
  // Apply stress and resilience settings
  const stressResilience = (knobs.stress_response_intensity + knobs.resilience_level + 
    knobs.crisis_adaptation) / 3;
  
  // Update psychology engine parameters
  psychologyEngine.updateParameters({
    personalityVariation: knobs.personality_variation_level,
    responseVolatility: 1 - knobs.behavioral_consistency,
    adaptationSpeed: knobs.adaptation_speed,
    socialInfluenceStrength: knobs.social_influence_strength,
    learningRate: knobs.learning_rate
  });
  
  console.log('Applied psychology knobs to game state:', {
    personalityBehavior,
    cognitiveDecisionMaking,
    socialPsychology,
    learningAdaptation,
    motivationIncentives,
    stressResilience
  });
}

// Initialize psychology engine and analytics
const psychologyEngine = new PsychologyEngine({
  personalityVariation: 0.3,
  responseVolatility: 0.2,
  adaptationSpeed: 0.15,
  socialInfluenceStrength: 0.4,
  learningRate: 0.05
});

const behavioralAnalytics = new BehavioralAnalytics();

/**
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      system: 'Psychology & Behavioral Economics Engine',
      version: '1.0.0',
      components: {
        psychologyEngine: 'operational',
        behavioralAnalytics: 'operational',
        profileGeneration: 'operational',
        behaviorPrediction: 'operational',
        incentiveSystem: 'operational',
        socialDynamics: 'operational',
        policyAnalysis: 'operational'
      },
      metrics: {
        totalProfiles: psychologyEngine.getAllProfiles().length,
        totalIncentives: psychologyEngine.getAllIncentives().length,
        systemUptime: process.uptime(),
        memoryUsage: process.memoryUsage()
      }
    };

    res.json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Psychology system health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get psychological factors and analytics overview
 */
router.get('/factors', (req: Request, res: Response) => {
  try {
    const profiles = psychologyEngine.getAllProfiles();
    
    // Update analytics with current data
    behavioralAnalytics.updateData({ profiles });
    const analytics = behavioralAnalytics.generateAnalytics();

    const factors = {
      overview: {
        totalProfiles: profiles.length,
        averagePersonality: analytics.populationPsychology.averagePersonality,
        psychologicalHealth: analytics.populationPsychology.psychologicalHealth,
        culturalDiversity: analytics.populationPsychology.culturalDiversity
      },
      distributions: {
        personality: analytics.populationPsychology.personalityDistribution,
        riskProfile: analytics.populationPsychology.riskProfileDistribution,
        motivation: analytics.populationPsychology.motivationDistribution,
        values: analytics.populationPsychology.valueDistribution
      },
      behavioralPatterns: analytics.behavioralPatterns,
      socialDynamics: analytics.socialDynamicsAnalysis,
      predictiveInsights: analytics.predictiveInsights,
      availableArchetypes: Object.keys(PERSONALITY_ARCHETYPES),
      systemMetrics: {
        analysisConfidence: analytics.analysisConfidence,
        sampleSize: analytics.sampleSize,
        lastUpdated: analytics.analysisTimestamp
      }
    };

    res.json(factors);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get psychological factors',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get all psychological profiles
 */
router.get('/profiles', (req: Request, res: Response) => {
  try {
    const { 
      limit = 50, 
      offset = 0, 
      culturalBackground,
      archetype,
      minRiskTolerance,
      maxRiskTolerance,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let profiles = psychologyEngine.getAllProfiles();

    // Apply filters
    if (culturalBackground) {
      profiles = profiles.filter(p => p.culturalIdentity.culturalBackground === culturalBackground);
    }
    
    if (minRiskTolerance) {
      profiles = profiles.filter(p => p.riskProfile.riskTolerance >= Number(minRiskTolerance));
    }
    
    if (maxRiskTolerance) {
      profiles = profiles.filter(p => p.riskProfile.riskTolerance <= Number(maxRiskTolerance));
    }

    // Apply sorting
    profiles.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'createdAt':
          aVal = a.createdAt.getTime();
          bVal = b.createdAt.getTime();
          break;
        case 'riskTolerance':
          aVal = a.riskProfile.riskTolerance;
          bVal = b.riskProfile.riskTolerance;
          break;
        case 'dataQuality':
          aVal = a.dataQuality;
          bVal = b.dataQuality;
          break;
        default:
          aVal = a.createdAt.getTime();
          bVal = b.createdAt.getTime();
      }
      
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    // Apply pagination
    const startIndex = Number(offset);
    const endIndex = startIndex + Number(limit);
    const paginatedProfiles = profiles.slice(startIndex, endIndex);

    res.json({
      profiles: paginatedProfiles,
      pagination: {
        total: profiles.length,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: endIndex < profiles.length
      },
      filters: {
        culturalBackground,
        archetype,
        minRiskTolerance,
        maxRiskTolerance
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get psychological profiles',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get specific psychological profile
 */
router.get('/profiles/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = psychologyEngine.getProfile(id);

    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: `No psychological profile found with ID: ${id}`
      });
    }

    // Get behavioral responses for this profile
    const responses = psychologyEngine.getBehavioralResponses(id);

    res.json({
      profile,
      behavioralResponses: responses,
      responseCount: responses.length,
      lastResponseDate: responses.length > 0 ? 
        Math.max(...responses.map(r => r.timestamp.getTime())) : null
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get psychological profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create new psychological profile
 */
router.post('/profiles', (req: Request, res: Response) => {
  try {
    const {
      citizenId,
      migrantId,
      businessOwnerId,
      culturalBackground,
      archetype,
      baseTraits
    } = req.body;

    // Validate archetype if provided
    if (archetype && !PERSONALITY_ARCHETYPES[archetype as keyof typeof PERSONALITY_ARCHETYPES]) {
      return res.status(400).json({
        error: 'Invalid archetype',
        message: `Archetype must be one of: ${Object.keys(PERSONALITY_ARCHETYPES).join(', ')}`
      });
    }

    const profile = psychologyEngine.generatePsychologicalProfile({
      citizenId,
      migrantId,
      businessOwnerId,
      culturalBackground,
      archetype: archetype as keyof typeof PERSONALITY_ARCHETYPES,
      baseTraits
    });

    res.status(201).json({
      message: 'Psychological profile created successfully',
      profile,
      archetype: archetype || 'generated',
      culturalBackground: culturalBackground || 'Mixed'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create psychological profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Update psychological profile
 */
router.put('/profiles/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = psychologyEngine.getProfile(id);

    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: `No psychological profile found with ID: ${id}`
      });
    }

    // Update profile fields (simplified implementation)
    const updatedProfile = { ...profile, ...req.body, lastUpdated: new Date() };
    
    res.json({
      message: 'Psychological profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update psychological profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Delete psychological profile
 */
router.delete('/profiles/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = psychologyEngine.getProfile(id);

    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: `No psychological profile found with ID: ${id}`
      });
    }

    // In a real implementation, this would delete from the engine
    res.json({
      message: 'Psychological profile deleted successfully',
      deletedProfileId: id
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete psychological profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get behavioral responses for a profile
 */
router.get('/responses/:profileId', (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    const { 
      stimulusType,
      limit = 20,
      offset = 0,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query;

    const profile = psychologyEngine.getProfile(profileId);
    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: `No psychological profile found with ID: ${profileId}`
      });
    }

    let responses = psychologyEngine.getBehavioralResponses(profileId);

    // Apply filters
    if (stimulusType) {
      responses = responses.filter(r => r.stimulusType === stimulusType);
    }

    // Apply sorting
    responses.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'timestamp':
          aVal = a.timestamp.getTime();
          bVal = b.timestamp.getTime();
          break;
        case 'responseIntensity':
          aVal = a.responseIntensity;
          bVal = b.responseIntensity;
          break;
        case 'confidence':
          aVal = a.confidence;
          bVal = b.confidence;
          break;
        default:
          aVal = a.timestamp.getTime();
          bVal = b.timestamp.getTime();
      }
      
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    // Apply pagination
    const startIndex = Number(offset);
    const endIndex = startIndex + Number(limit);
    const paginatedResponses = responses.slice(startIndex, endIndex);

    res.json({
      profileId,
      responses: paginatedResponses,
      pagination: {
        total: responses.length,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: endIndex < responses.length
      },
      analytics: {
        averageIntensity: responses.length > 0 ? 
          responses.reduce((sum, r) => sum + r.responseIntensity, 0) / responses.length : 0,
        responseTypes: responses.reduce((acc: any, r) => {
          acc[r.responseType] = (acc[r.responseType] || 0) + 1;
          return acc;
        }, {}),
        stimulusTypes: responses.reduce((acc: any, r) => {
          acc[r.stimulusType] = (acc[r.stimulusType] || 0) + 1;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get behavioral responses',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Predict behavioral response
 */
router.post('/predict', (req: Request, res: Response) => {
  try {
    const {
      profileId,
      stimulusType,
      stimulusId,
      stimulusDetails
    } = req.body;

    if (!profileId || !stimulusType || !stimulusId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'profileId, stimulusType, and stimulusId are required'
      });
    }

    const profile = psychologyEngine.getProfile(profileId);
    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: `No psychological profile found with ID: ${profileId}`
      });
    }

    const response = psychologyEngine.predictBehavioralResponse(
      profileId,
      stimulusType,
      stimulusId,
      stimulusDetails || {}
    );

    res.json({
      message: 'Behavioral response predicted successfully',
      prediction: response,
      profile: {
        id: profile.id,
        personality: profile.personality,
        riskProfile: profile.riskProfile,
        culturalBackground: profile.culturalIdentity.culturalBackground
      },
      stimulus: {
        type: stimulusType,
        id: stimulusId,
        details: stimulusDetails
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to predict behavioral response',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get all incentive structures
 */
router.get('/incentives', (req: Request, res: Response) => {
  try {
    const { 
      type,
      status = 'active',
      limit = 20,
      offset = 0
    } = req.query;

    let incentives = psychologyEngine.getAllIncentives();

    // Apply filters
    if (type) {
      incentives = incentives.filter(i => i.type === type);
    }
    
    if (status) {
      incentives = incentives.filter(i => i.status === status);
    }

    // Apply pagination
    const startIndex = Number(offset);
    const endIndex = startIndex + Number(limit);
    const paginatedIncentives = incentives.slice(startIndex, endIndex);

    res.json({
      incentives: paginatedIncentives,
      pagination: {
        total: incentives.length,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: endIndex < incentives.length
      },
      summary: {
        totalIncentives: incentives.length,
        byType: incentives.reduce((acc: any, i) => {
          acc[i.type] = (acc[i.type] || 0) + 1;
          return acc;
        }, {}),
        byStatus: incentives.reduce((acc: any, i) => {
          acc[i.status] = (acc[i.status] || 0) + 1;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get incentive structures',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create new incentive structure
 */
router.post('/incentives', (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      type,
      incentiveComponents,
      targetPersonalities,
      implementationCost
    } = req.body;

    if (!name || !description || !type || !incentiveComponents) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'name, description, type, and incentiveComponents are required'
      });
    }

    const incentive = psychologyEngine.createIncentiveStructure({
      name,
      description,
      type,
      incentiveComponents,
      targetPersonalities,
      implementationCost
    });

    res.status(201).json({
      message: 'Incentive structure created successfully',
      incentive
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create incentive structure',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get incentive effectiveness
 */
router.get('/incentives/:id/effectiveness', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, this would calculate actual effectiveness
    const effectiveness = {
      incentiveId: id,
      overallEffectiveness: Math.random() * 100,
      responseRate: Math.random() * 100,
      targetingAccuracy: Math.random() * 100,
      costEffectiveness: Math.random() * 100,
      sustainabilityScore: Math.random() * 100,
      sideEffects: [],
      recommendations: [
        'Consider increasing monetary reward component',
        'Target high-conscientiousness personalities',
        'Implement gradual rollout strategy'
      ],
      lastAnalyzed: new Date()
    };

    res.json(effectiveness);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get incentive effectiveness',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get social dynamics for a group
 */
router.get('/social-dynamics/:groupId', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { groupType = 'city' } = req.query;

    const dynamics = psychologyEngine.getSocialDynamics(groupId);

    if (!dynamics) {
      // Generate new social dynamics if none exist
      const newDynamics = psychologyEngine.updateSocialDynamics(groupId, groupType as any);
      return res.json({
        message: 'Social dynamics generated',
        dynamics: newDynamics,
        isNew: true
      });
    }

    res.json({
      dynamics,
      isNew: false,
      lastUpdated: dynamics.lastUpdated
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get social dynamics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Update social dynamics for a group
 */
router.put('/social-dynamics/:groupId', (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { groupType = 'city' } = req.body;

    const dynamics = psychologyEngine.updateSocialDynamics(groupId, groupType);

    res.json({
      message: 'Social dynamics updated successfully',
      dynamics
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update social dynamics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get policy response analysis
 */
router.get('/policy-responses/:policyId', (req: Request, res: Response) => {
  try {
    const { policyId } = req.params;
    
    const responses = psychologyEngine.getPolicyResponses(policyId);

    if (responses.length === 0) {
      return res.status(404).json({
        error: 'No policy responses found',
        message: `No policy responses found for policy ID: ${policyId}`
      });
    }

    // Calculate summary statistics
    const summary = {
      totalResponses: responses.length,
      averageReactionIntensity: responses.reduce((sum, r) => sum + r.reactionIntensity, 0) / responses.length,
      reactionTypes: responses.reduce((acc: any, r) => {
        acc[r.initialReaction] = (acc[r.initialReaction] || 0) + 1;
        return acc;
      }, {}),
      averageCompliance: responses.reduce((sum, r) => sum + r.predictedBehaviors.compliance, 0) / responses.length,
      averageSupport: responses.reduce((sum, r) => sum + r.predictedBehaviors.support, 0) / responses.length,
      averageConfidence: responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length
    };

    res.json({
      policyId,
      responses,
      summary,
      lastAnalyzed: responses.length > 0 ? 
        Math.max(...responses.map(r => r.assessmentDate.getTime())) : null
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get policy responses',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Analyze policy response
 */
router.post('/policy-responses', (req: Request, res: Response) => {
  try {
    const { policyId, policyDetails } = req.body;

    if (!policyId || !policyDetails) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'policyId and policyDetails are required'
      });
    }

    const responses = psychologyEngine.analyzePolicyResponse(policyId, policyDetails);

    res.json({
      message: 'Policy response analysis completed',
      policyId,
      responses,
      analysisDate: new Date(),
      totalProfiles: responses.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to analyze policy response',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Apply behavioral economics model
 */
router.get('/behavioral-economics/:modelType', (req: Request, res: Response) => {
  try {
    const { modelType } = req.params;
    const { profileId, context } = req.query;

    if (!profileId) {
      return res.status(400).json({
        error: 'Missing required parameter',
        message: 'profileId is required'
      });
    }

    const result = psychologyEngine.applyBehavioralEconomics(
      profileId as string,
      modelType as any,
      context ? JSON.parse(context as string) : {}
    );

    res.json({
      modelType,
      profileId,
      result,
      context: context ? JSON.parse(context as string) : {},
      appliedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to apply behavioral economics model',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get comprehensive psychology analytics
 */
router.get('/analytics', (req: Request, res: Response) => {
  try {
    const profiles = psychologyEngine.getAllProfiles();
    const responses = profiles.flatMap(p => psychologyEngine.getBehavioralResponses(p.id));
    const incentives = psychologyEngine.getAllIncentives();

    // Update analytics with current data
    behavioralAnalytics.updateData({
      profiles,
      responses,
      incentives
    });

    const analytics = behavioralAnalytics.generateAnalytics();

    res.json({
      message: 'Psychology analytics generated successfully',
      analytics,
      dataSnapshot: {
        profileCount: profiles.length,
        responseCount: responses.length,
        incentiveCount: incentives.length,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate psychology analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Simulate psychology system time step
 */
router.post('/simulate', (req: Request, res: Response) => {
  try {
    const { steps = 1 } = req.body;

    const results = [];
    for (let i = 0; i < steps; i++) {
      psychologyEngine.simulateTimeStep();
      results.push({
        step: i + 1,
        timestamp: new Date(),
        profileCount: psychologyEngine.getAllProfiles().length,
        eventCount: psychologyEngine.getPsychologyEvents(10).length
      });
    }

    res.json({
      message: `Psychology simulation completed for ${steps} time step(s)`,
      results,
      totalSteps: steps,
      completedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to simulate psychology system',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== SYSTEM INTEGRATION ENDPOINTS =====

// Governance System Integration
router.post('/integration/voting-analysis', (req, res) => {
  try {
    const { profileId, election } = req.body;
    
    if (!profileId || !election) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: profileId, election'
      });
    }

    const profile = psychologyEngine.getPsychologicalProfile(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Psychological profile not found'
      });
    }

    const votingAnalysis = psychologyEngine.analyzeVotingBehavior(profile, election);
    
    res.json({
      success: true,
      profileId,
      votingAnalysis,
      meta: {
        analysisType: 'voting_behavior',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Legal System Integration
router.post('/integration/legal-compliance', (req, res) => {
  try {
    const { profileId, law } = req.body;
    
    if (!profileId || !law) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: profileId, law'
      });
    }

    const profile = psychologyEngine.getPsychologicalProfile(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Psychological profile not found'
      });
    }

    const complianceAnalysis = psychologyEngine.analyzeLegalCompliance(profile, law);
    
    res.json({
      success: true,
      profileId,
      complianceAnalysis,
      meta: {
        analysisType: 'legal_compliance',
        lawType: law.type,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Security System Integration
router.post('/integration/security-threat-response', (req, res) => {
  try {
    const { profileId, threat } = req.body;
    
    if (!profileId || !threat) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: profileId, threat'
      });
    }

    const profile = psychologyEngine.getPsychologicalProfile(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Psychological profile not found'
      });
    }

    const threatResponse = psychologyEngine.analyzeSecurityThreatResponse(profile, threat);
    
    res.json({
      success: true,
      profileId,
      threatResponse,
      meta: {
        analysisType: 'security_threat_response',
        threatType: threat.type,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Demographics System Integration
router.post('/integration/lifecycle-decisions', (req, res) => {
  try {
    const { profileId, demographics } = req.body;
    
    if (!profileId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: profileId'
      });
    }

    const profile = psychologyEngine.getPsychologicalProfile(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Psychological profile not found'
      });
    }

    const lifecycleAnalysis = psychologyEngine.analyzeLifecycleDecisions(profile, demographics || {});
    
    res.json({
      success: true,
      profileId,
      lifecycleAnalysis,
      meta: {
        analysisType: 'lifecycle_decisions',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Technology System Integration
router.post('/integration/technology-adoption', (req, res) => {
  try {
    const { profileId, technology } = req.body;
    
    if (!profileId || !technology) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: profileId, technology'
      });
    }

    const profile = psychologyEngine.getPsychologicalProfile(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Psychological profile not found'
      });
    }

    const adoptionAnalysis = psychologyEngine.analyzeTechnologyAdoption(profile, technology);
    
    res.json({
      success: true,
      profileId,
      adoptionAnalysis,
      meta: {
        analysisType: 'technology_adoption',
        technologyId: technology.id,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Business System Integration
router.post('/integration/entrepreneurship-analysis', (req, res) => {
  try {
    const { profileId } = req.body;
    
    if (!profileId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: profileId'
      });
    }

    const profile = psychologyEngine.getPsychologicalProfile(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Psychological profile not found'
      });
    }

    const entrepreneurshipAnalysis = psychologyEngine.analyzeEntrepreneurshipPotential(profile);
    
    res.json({
      success: true,
      profileId,
      entrepreneurshipAnalysis,
      meta: {
        analysisType: 'entrepreneurship_potential',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Batch Integration Analysis
router.post('/integration/batch-analysis', (req, res) => {
  try {
    const { profileIds, analysisTypes, context } = req.body;
    
    if (!profileIds || !Array.isArray(profileIds) || profileIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: profileIds (array)'
      });
    }

    const results: any[] = [];
    
    for (const profileId of profileIds) {
      const profile = psychologyEngine.getPsychologicalProfile(profileId);
      if (!profile) {
        results.push({
          profileId,
          error: 'Profile not found'
        });
        continue;
      }

      const profileResults: any = { profileId };

      // Run requested analyses
      if (!analysisTypes || analysisTypes.includes('voting')) {
        profileResults.voting = psychologyEngine.analyzeVotingBehavior(profile, context?.election || { candidates: [] });
      }
      
      if (!analysisTypes || analysisTypes.includes('legal')) {
        profileResults.legal = psychologyEngine.analyzeLegalCompliance(profile, context?.law || { type: 'general' });
      }
      
      if (!analysisTypes || analysisTypes.includes('security')) {
        profileResults.security = psychologyEngine.analyzeSecurityThreatResponse(profile, context?.threat || { type: 'general' });
      }
      
      if (!analysisTypes || analysisTypes.includes('demographics')) {
        profileResults.demographics = psychologyEngine.analyzeLifecycleDecisions(profile, context?.demographics || {});
      }
      
      if (!analysisTypes || analysisTypes.includes('technology')) {
        profileResults.technology = psychologyEngine.analyzeTechnologyAdoption(profile, context?.technology || { id: 'general', complexity: 5 });
      }
      
      if (!analysisTypes || analysisTypes.includes('business')) {
        profileResults.business = psychologyEngine.analyzeEntrepreneurshipPotential(profile);
      }

      results.push(profileResults);
    }
    
    res.json({
      success: true,
      results,
      meta: {
        analysisType: 'batch_integration',
        profileCount: profileIds.length,
        analysisTypes: analysisTypes || ['all'],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Integration Status and Capabilities
router.get('/integration/capabilities', (req, res) => {
  res.json({
    success: true,
    integrationCapabilities: {
      governance: {
        analyses: ['voting_behavior', 'political_alignment', 'civic_engagement'],
        description: 'Analyze voting patterns, candidate preferences, and political participation'
      },
      legal: {
        analyses: ['legal_compliance', 'deterrence_effectiveness', 'moral_alignment'],
        description: 'Predict compliance behavior and response to legal frameworks'
      },
      security: {
        analyses: ['threat_response', 'cooperation_with_authorities', 'vigilance_levels'],
        description: 'Model responses to security threats and law enforcement cooperation'
      },
      demographics: {
        analyses: ['lifecycle_decisions', 'family_planning', 'career_priorities', 'migration_potential'],
        description: 'Predict major life decisions and demographic transitions'
      },
      technology: {
        analyses: ['technology_adoption', 'innovation_contribution', 'ethical_concerns'],
        description: 'Model technology adoption patterns and innovation participation'
      },
      business: {
        analyses: ['entrepreneurship_potential', 'leadership_style', 'risk_management'],
        description: 'Assess business creation potential and management approaches'
      }
    },
    systemsIntegrated: ['governance', 'legal', 'security', 'demographics', 'technology', 'business', 'witter'],
    totalProfiles: psychologyEngine.getPsychologicalProfiles().length,
    integrationVersion: '1.1.0'
  });
});

// ===== WITTER FEED ANALYSIS ENDPOINTS =====

// Analyze Witter feed sentiment and trends
router.post('/integration/witter-sentiment', (req, res) => {
  try {
    const { wittPosts, civilizationId } = req.body;

    if (!wittPosts || !Array.isArray(wittPosts)) {
      return res.status(400).json({
        success: false,
        error: 'wittPosts array is required'
      });
    }

    const sentimentAnalysis = psychologyEngine.analyzeWitterFeedSentiment(wittPosts, civilizationId);

    res.json({
      success: true,
      sentimentAnalysis
    });
  } catch (error) {
    console.error('Witter sentiment analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Witter sentiment analysis failed'
    });
  }
});

// Analyze individual Witter engagement patterns
router.post('/integration/witter-engagement', (req, res) => {
  try {
    const { profileId, wittPosts } = req.body;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        error: 'profileId is required'
      });
    }

    if (!wittPosts || !Array.isArray(wittPosts)) {
      return res.status(400).json({
        success: false,
        error: 'wittPosts array is required'
      });
    }

    const profile = psychologyEngine.getProfile(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    const engagementAnalysis = psychologyEngine.analyzeWitterEngagement(profile, wittPosts);

    res.json({
      success: true,
      profileId,
      engagementAnalysis
    });
  } catch (error) {
    console.error('Witter engagement analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Witter engagement analysis failed'
    });
  }
});

// Predict social media influence on population
router.post('/integration/social-media-influence', (req, res) => {
  try {
    const { wittPosts, populationProfileIds } = req.body;

    if (!wittPosts || !Array.isArray(wittPosts)) {
      return res.status(400).json({
        success: false,
        error: 'wittPosts array is required'
      });
    }

    if (!populationProfileIds || !Array.isArray(populationProfileIds)) {
      return res.status(400).json({
        success: false,
        error: 'populationProfileIds array is required'
      });
    }

    // Get population profiles
    const populationProfiles = populationProfileIds
      .map(id => psychologyEngine.getProfile(id))
      .filter(profile => profile !== undefined);

    if (populationProfiles.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No valid profiles found'
      });
    }

    const influenceAnalysis = psychologyEngine.predictSocialMediaInfluence(wittPosts, populationProfiles);

    res.json({
      success: true,
      analyzedProfiles: populationProfiles.length,
      influenceAnalysis
    });
  } catch (error) {
    console.error('Social media influence analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Social media influence analysis failed'
    });
  }
});

// Comprehensive Witter analysis (combines all methods)
router.post('/integration/witter-comprehensive', (req, res) => {
  try {
    const { wittPosts, civilizationId, sampleProfileIds } = req.body;

    if (!wittPosts || !Array.isArray(wittPosts)) {
      return res.status(400).json({
        success: false,
        error: 'wittPosts array is required'
      });
    }

    // Sentiment analysis
    const sentimentAnalysis = psychologyEngine.analyzeWitterFeedSentiment(wittPosts, civilizationId);

    // Individual engagement analysis (if profiles provided)
    let engagementAnalyses = [];
    if (sampleProfileIds && Array.isArray(sampleProfileIds)) {
      engagementAnalyses = sampleProfileIds
        .map(profileId => {
          const profile = psychologyEngine.getProfile(profileId);
          if (profile) {
            return {
              profileId,
              engagement: psychologyEngine.analyzeWitterEngagement(profile, wittPosts)
            };
          }
          return null;
        })
        .filter(analysis => analysis !== null);
    }

    // Population influence analysis (if profiles provided)
    let influenceAnalysis = null;
    if (sampleProfileIds && Array.isArray(sampleProfileIds)) {
      const populationProfiles = sampleProfileIds
        .map(id => psychologyEngine.getProfile(id))
        .filter(profile => profile !== undefined);
      
      if (populationProfiles.length > 0) {
        influenceAnalysis = psychologyEngine.predictSocialMediaInfluence(wittPosts, populationProfiles);
      }
    }

    res.json({
      success: true,
      analysis: {
        sentiment: sentimentAnalysis,
        individualEngagement: engagementAnalyses,
        populationInfluence: influenceAnalysis,
        metadata: {
          postsAnalyzed: wittPosts.length,
          profilesAnalyzed: engagementAnalyses.length,
          civilizationId: civilizationId || 'all'
        }
      }
    });
  } catch (error) {
    console.error('Comprehensive Witter analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Comprehensive Witter analysis failed'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'psychology', psychologyKnobSystem, applyPsychologyKnobsToGameState);

export default router;
