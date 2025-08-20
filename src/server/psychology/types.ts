/**
 * Psychology & Behavioral Economics System - Core Types
 * 
 * Defines comprehensive psychological modeling including individual personality traits,
 * behavioral economics patterns, social psychology dynamics, and policy response systems.
 * Integrates with all existing systems: population, migration, business, cities, policies, trade.
 */

export interface PsychologicalProfile {
  id: string;
  citizenId?: string; // Links to Population system
  migrantId?: string; // Links to Migration system
  businessOwnerId?: string; // Links to Business system
  
  // Big Five Personality Traits (0-100 scale)
  personality: {
    openness: number;          // Openness to Experience (creativity, curiosity, adventure)
    conscientiousness: number; // Conscientiousness (organization, discipline, goal-oriented)
    extraversion: number;      // Extraversion (sociability, assertiveness, energy)
    agreeableness: number;     // Agreeableness (cooperation, trust, empathy)
    neuroticism: number;       // Neuroticism (emotional instability, anxiety, stress)
  };
  
  // Risk and Decision-Making Profile
  riskProfile: {
    riskTolerance: number;        // 0-100, willingness to take risks
    lossAversion: number;         // 0-100, sensitivity to losses vs gains
    timePreference: number;       // 0-100, present vs future orientation
    uncertaintyTolerance: number; // 0-100, comfort with ambiguity
    decisionSpeed: number;        // 0-100, fast vs deliberate decision-making
    informationSeeking: number;   // 0-100, research before decisions
  };
  
  // Motivation and Values System (Maslow's Hierarchy + Values)
  motivationSystem: {
    // Maslow's Hierarchy (0-100 satisfaction levels)
    physiologicalNeeds: number;  // Food, shelter, basic survival
    safetyNeeds: number;         // Security, stability, protection
    belongingNeeds: number;      // Social connection, love, acceptance
    esteemNeeds: number;         // Recognition, achievement, status
    selfActualization: number;   // Personal growth, creativity, purpose
    
    // Core Values (0-100 importance ratings)
    values: {
      security: number;          // Safety, stability, predictability
      achievement: number;       // Success, accomplishment, competence
      hedonism: number;         // Pleasure, enjoyment, gratification
      stimulation: number;      // Excitement, novelty, challenge
      selfDirection: number;    // Independence, autonomy, creativity
      universalism: number;     // Justice, equality, environmental protection
      benevolence: number;      // Helpfulness, loyalty, responsibility
      tradition: number;        // Respect for customs, cultural norms
      conformity: number;       // Restraint, politeness, obedience
      power: number;           // Social status, control, dominance
    };
  };
  
  // Social Psychology Factors
  socialPsychology: {
    socialInfluence: number;      // 0-100, susceptibility to peer pressure
    authorityRespect: number;     // 0-100, deference to authority figures
    groupIdentity: number;        // 0-100, importance of group membership
    socialTrust: number;          // 0-100, general trust in others
    culturalAdaptability: number; // 0-100, ability to adapt to new cultures
    leadershipTendency: number;   // 0-100, natural leadership inclination
    cooperationPreference: number; // 0-100, preference for cooperation vs competition
  };
  
  // Cognitive Biases and Heuristics
  cognitiveBiases: {
    confirmationBias: number;     // 0-100, tendency to seek confirming information
    availabilityHeuristic: number; // 0-100, judging by easily recalled examples
    anchoringBias: number;        // 0-100, over-reliance on first information
    statusQuoBias: number;        // 0-100, preference for current state
    optimismBias: number;         // 0-100, tendency to overestimate positive outcomes
    herding: number;              // 0-100, tendency to follow crowd behavior
    framingEffect: number;        // 0-100, susceptibility to how choices are presented
  };
  
  // Emotional and Stress Response
  emotionalProfile: {
    emotionalStability: number;   // 0-100, ability to manage emotions
    stressResilience: number;     // 0-100, ability to cope with stress
    adaptabilityToChange: number; // 0-100, comfort with change and uncertainty
    optimismLevel: number;        // 0-100, general optimistic outlook
    empathyLevel: number;         // 0-100, ability to understand others' emotions
    emotionalExpression: number;  // 0-100, tendency to express emotions openly
  };
  
  // Learning and Growth Patterns
  learningProfile: {
    learningSpeed: number;        // 0-100, how quickly they acquire new skills
    curiosityLevel: number;       // 0-100, drive to explore and learn
    feedbackReceptivity: number;  // 0-100, openness to criticism and feedback
    habitFormation: number;       // 0-100, tendency to form and stick to habits
    innovationTendency: number;   // 0-100, inclination toward new ideas/methods
  };
  
  // Cultural and Identity Factors
  culturalIdentity: {
    culturalBackground: string;   // Primary cultural identity
    culturalFlexibility: number;  // 0-100, ability to navigate multiple cultures
    traditionalism: number;       // 0-100, adherence to traditional values
    modernization: number;        // 0-100, embrace of modern values/technology
    religiosity: number;          // 0-100, importance of religious/spiritual beliefs
    nationalismLevel: number;     // 0-100, strength of national identity
  };
  
  // Metadata
  createdAt: Date;
  lastUpdated: Date;
  dataQuality: number;           // 0-100, confidence in profile accuracy
  profileSource: 'generated' | 'observed' | 'survey' | 'inferred';
}

export interface BehavioralResponse {
  id: string;
  profileId: string;
  stimulusType: 'policy' | 'economic' | 'social' | 'environmental' | 'cultural';
  stimulusId: string; // ID of the policy, economic event, etc.
  
  // Response Characteristics
  responseType: 'support' | 'oppose' | 'neutral' | 'adapt' | 'resist' | 'ignore';
  responseIntensity: number;     // 0-100, strength of response
  responseSpeed: number;         // 0-100, how quickly they respond
  responseConsistency: number;   // 0-100, consistency with past behavior
  
  // Psychological Drivers
  primaryDrivers: string[];      // Main psychological factors driving response
  conflictingFactors: string[];  // Psychological factors creating internal conflict
  
  // Behavioral Outcomes
  behaviorChanges: {
    economicBehavior?: {
      spendingChange: number;    // -100 to 100, change in spending patterns
      savingChange: number;      // -100 to 100, change in saving behavior
      investmentChange: number;  // -100 to 100, change in investment behavior
      workEffortChange: number;  // -100 to 100, change in work productivity
    };
    
    socialBehavior?: {
      socialEngagementChange: number; // -100 to 100, change in social participation
      trustLevelChange: number;       // -100 to 100, change in social trust
      cooperationChange: number;      // -100 to 100, change in cooperative behavior
      leadershipChange: number;       // -100 to 100, change in leadership behavior
    };
    
    politicalBehavior?: {
      supportLevelChange: number;     // -100 to 100, change in government support
      participationChange: number;   // -100 to 100, change in civic participation
      complianceChange: number;       // -100 to 100, change in rule compliance
    };
    
    culturalBehavior?: {
      culturalAdaptationChange: number; // -100 to 100, change in cultural adaptation
      traditionAdherenceChange: number; // -100 to 100, change in traditional behavior
      innovationAdoptionChange: number; // -100 to 100, change in innovation adoption
    };
  };
  
  // Response Evolution
  adaptationRate: number;        // 0-100, how quickly they adapt to new normal
  habitualizeRate: number;       // 0-100, how quickly response becomes habitual
  fatigueRate: number;          // 0-100, how quickly response intensity decreases
  
  // Metadata
  timestamp: Date;
  duration: number;             // Expected duration of response in days
  confidence: number;           // 0-100, confidence in prediction accuracy
}

export interface IncentiveStructure {
  id: string;
  name: string;
  description: string;
  type: 'economic' | 'social' | 'political' | 'cultural' | 'environmental';
  
  // Incentive Design
  incentiveComponents: {
    monetaryReward?: number;      // Direct financial incentive
    socialRecognition?: number;   // Social status/recognition component
    autonomyIncrease?: number;    // Increased freedom/choice
    securityIncrease?: number;    // Increased safety/stability
    growthOpportunity?: number;   // Learning/development opportunity
    socialConnection?: number;    // Community/belonging enhancement
    purposeAlignment?: number;    // Alignment with personal values
  };
  
  // Targeting and Effectiveness
  targetPersonalities: string[]; // Which personality types respond best
  targetValues: string[];        // Which value systems align
  targetMotivations: string[];   // Which motivation levels required
  
  // Response Patterns
  expectedResponses: {
    [personalityType: string]: {
      responseRate: number;       // 0-100, percentage who respond
      responseIntensity: number;  // 0-100, average response strength
      responseLatency: number;    // Days until response begins
      responseDuration: number;   // Days response typically lasts
    };
  };
  
  // Implementation Details
  implementationCost: number;    // Cost per person to implement
  scalabilityFactor: number;     // 0-100, how well it scales to large populations
  sustainabilityFactor: number; // 0-100, how long effects last
  
  // Side Effects and Unintended Consequences
  potentialSideEffects: {
    economicEffects: string[];   // Potential economic side effects
    socialEffects: string[];     // Potential social side effects
    psychologicalEffects: string[]; // Potential psychological effects
  };
  
  // Metadata
  createdAt: Date;
  lastUpdated: Date;
  status: 'draft' | 'active' | 'suspended' | 'archived';
}

export interface SocialDynamics {
  id: string;
  groupId: string; // City, community, or other group identifier
  groupType: 'city' | 'neighborhood' | 'workplace' | 'cultural_group' | 'economic_class';
  
  // Group Characteristics
  groupSize: number;
  groupCohesion: number;         // 0-100, how unified the group is
  groupIdentity: number;         // 0-100, strength of shared identity
  groupNorms: string[];          // Established behavioral norms
  
  // Social Influence Networks
  influenceNetworks: {
    leaders: string[];           // IDs of influential group members
    influenceStrength: { [leaderId: string]: number }; // 0-100 influence level
    influenceReach: { [leaderId: string]: string[] };  // Who they influence
  };
  
  // Group Psychology
  collectiveMood: {
    optimism: number;            // 0-100, group optimism level
    anxiety: number;             // 0-100, group anxiety level
    anger: number;               // 0-100, group anger level
    satisfaction: number;        // 0-100, group satisfaction level
    trust: number;               // 0-100, intra-group trust level
  };
  
  // Social Phenomena
  socialPhenomena: {
    conformityPressure: number;  // 0-100, pressure to conform to group norms
    polarization: number;        // 0-100, tendency toward extreme positions
    groupthink: number;          // 0-100, suppression of dissenting opinions
    socialProof: number;         // 0-100, tendency to follow others' behavior
    bystander: number;           // 0-100, tendency to not act when others present
  };
  
  // Change Dynamics
  changeDynamics: {
    changeResistance: number;    // 0-100, resistance to change
    innovationAdoption: number;  // 0-100, speed of adopting innovations
    leadershipStability: number; // 0-100, stability of leadership structure
    conflictLevel: number;       // 0-100, internal conflict level
  };
  
  // Metadata
  lastUpdated: Date;
  dataQuality: number;          // 0-100, confidence in dynamics assessment
}

export interface PolicyPsychologyResponse {
  id: string;
  policyId: string;             // Links to policy system
  profileId: string;            // Links to psychological profile
  
  // Initial Response Assessment
  initialReaction: 'positive' | 'negative' | 'neutral' | 'mixed' | 'confused';
  reactionIntensity: number;    // 0-100, strength of initial reaction
  reactionSpeed: number;        // 0-100, how quickly they formed opinion
  
  // Psychological Processing
  cognitiveProcessing: {
    comprehensionLevel: number; // 0-100, how well they understand policy
    personalRelevance: number;  // 0-100, how relevant they see it to themselves
    valueAlignment: number;     // -100 to 100, alignment with personal values
    trustInSource: number;      // 0-100, trust in policy makers
    perceivedFairness: number;  // 0-100, perceived fairness of policy
  };
  
  // Behavioral Response Prediction
  predictedBehaviors: {
    compliance: number;         // 0-100, likelihood of following policy
    support: number;            // 0-100, likelihood of supporting policy
    advocacy: number;           // 0-100, likelihood of promoting policy
    resistance: number;         // 0-100, likelihood of resisting policy
    avoidance: number;          // 0-100, likelihood of avoiding policy effects
  };
  
  // Adaptation Timeline
  adaptationPhases: {
    shock: { duration: number; intensity: number };      // Initial reaction phase
    resistance: { duration: number; intensity: number }; // Resistance phase
    exploration: { duration: number; intensity: number }; // Testing new behavior
    commitment: { duration: number; intensity: number }; // Accepting new normal
  };
  
  // Influence Factors
  influenceFactors: {
    personalExperience: number;  // 0-100, influence of personal experience
    socialPressure: number;      // 0-100, influence of social environment
    mediaInfluence: number;      // 0-100, influence of media/information
    authorityInfluence: number;  // 0-100, influence of authority figures
    peerInfluence: number;       // 0-100, influence of peers/colleagues
  };
  
  // Long-term Effects
  longTermEffects: {
    attitudeChange: number;      // -100 to 100, permanent attitude change
    behaviorChange: number;      // -100 to 100, permanent behavior change
    trustChange: number;         // -100 to 100, change in institutional trust
    engagementChange: number;    // -100 to 100, change in civic engagement
  };
  
  // Metadata
  assessmentDate: Date;
  confidence: number;           // 0-100, confidence in assessment
  dataSource: 'survey' | 'observation' | 'prediction' | 'historical';
}

export interface BehavioralEconomicsModel {
  id: string;
  modelType: 'prospect_theory' | 'social_proof' | 'anchoring' | 'framing' | 'mental_accounting' | 'hyperbolic_discounting';
  
  // Model Parameters
  parameters: {
    // Prospect Theory
    lossAversionCoefficient?: number;    // Typically 2.0-2.5
    riskAversionCoefficient?: number;    // 0-1 range
    probabilityWeighting?: number;       // How probabilities are perceived
    
    // Social Proof
    socialInfluenceStrength?: number;    // 0-100, strength of social influence
    groupSizeEffect?: number;            // How group size affects influence
    similarityBonus?: number;            // Bonus for similar others' behavior
    
    // Anchoring
    anchoringStrength?: number;          // 0-100, strength of anchoring effect
    adjustmentInsufficiency?: number;    // Tendency to under-adjust from anchor
    
    // Framing Effects
    framingSensitivity?: number;         // 0-100, sensitivity to framing
    gainFramePreference?: number;        // Preference for gain vs loss framing
    
    // Mental Accounting
    accountingSeparation?: number;       // 0-100, tendency to separate accounts
    fungibilityResistance?: number;      // Resistance to treating money as fungible
    
    // Hyperbolic Discounting
    presentBias?: number;                // 0-100, bias toward immediate rewards
    discountRate?: number;               // Rate of future discounting
  };
  
  // Application Context
  applicableContexts: string[];         // Where this model applies
  populationSegments: string[];         // Which population segments use this model
  
  // Validation Data
  validationMetrics: {
    accuracy: number;                    // 0-100, prediction accuracy
    precision: number;                   // 0-100, precision of predictions
    recall: number;                      // 0-100, recall of predictions
    sampleSize: number;                  // Size of validation sample
  };
  
  // Metadata
  createdAt: Date;
  lastValidated: Date;
  status: 'experimental' | 'validated' | 'production' | 'deprecated';
}

export interface PsychologyEngineConfig {
  // Personality Generation
  personalityVariation: number;        // 0-1, how much personality varies
  culturalPersonalityBias: { [culture: string]: Partial<PsychologicalProfile['personality']> };
  
  // Response Modeling
  responseVolatility: number;          // 0-1, randomness in responses
  adaptationSpeed: number;             // 0-1, how quickly people adapt
  socialInfluenceStrength: number;     // 0-1, strength of social influence
  
  // Behavioral Economics
  defaultLossAversion: number;         // Default loss aversion coefficient
  defaultDiscountRate: number;         // Default future discounting rate
  biasStrengthMultiplier: number;      // Multiplier for cognitive bias effects
  
  // Learning and Evolution
  learningRate: number;                // 0-1, how quickly psychology evolves
  memoryDecayRate: number;             // 0-1, how quickly memories fade
  experienceWeighting: number;         // 0-1, weight of personal experience
  
  // Social Dynamics
  groupFormationTendency: number;      // 0-1, tendency to form groups
  leadershipEmergenceRate: number;     // 0-1, rate of leadership emergence
  normEnforcementStrength: number;     // 0-1, strength of norm enforcement
  
  // Simulation Parameters
  timeStep: 'day' | 'week' | 'month';
  updateFrequency: number;             // How often to update psychology
  batchProcessing: boolean;            // Whether to batch psychology updates
}

// Predefined Personality Archetypes
export const PERSONALITY_ARCHETYPES = {
  ENTREPRENEUR: {
    personality: { openness: 85, conscientiousness: 80, extraversion: 75, agreeableness: 60, neuroticism: 40 },
    riskProfile: { riskTolerance: 80, lossAversion: 40, timePreference: 70, uncertaintyTolerance: 75 }
  },
  CONSERVATIVE: {
    personality: { openness: 30, conscientiousness: 85, extraversion: 45, agreeableness: 70, neuroticism: 35 },
    riskProfile: { riskTolerance: 25, lossAversion: 80, timePreference: 30, uncertaintyTolerance: 25 }
  },
  INNOVATOR: {
    personality: { openness: 95, conscientiousness: 70, extraversion: 60, agreeableness: 55, neuroticism: 45 },
    riskProfile: { riskTolerance: 75, lossAversion: 35, timePreference: 85, uncertaintyTolerance: 90 }
  },
  TRADITIONALIST: {
    personality: { openness: 25, conscientiousness: 80, extraversion: 50, agreeableness: 80, neuroticism: 30 },
    riskProfile: { riskTolerance: 20, lossAversion: 85, timePreference: 20, uncertaintyTolerance: 15 }
  },
  SOCIAL_LEADER: {
    personality: { openness: 70, conscientiousness: 75, extraversion: 90, agreeableness: 85, neuroticism: 25 },
    riskProfile: { riskTolerance: 60, lossAversion: 50, timePreference: 50, uncertaintyTolerance: 65 }
  }
} as const;

// Behavioral Economics Constants
export const BEHAVIORAL_CONSTANTS = {
  DEFAULT_LOSS_AVERSION: 2.25,
  DEFAULT_DISCOUNT_RATE: 0.03,
  SOCIAL_PROOF_THRESHOLD: 0.3,
  ANCHORING_STRENGTH: 0.4,
  FRAMING_EFFECT_SIZE: 0.2,
  HYPERBOLIC_BETA: 0.7
} as const;

// Psychology System Events
export const PSYCHOLOGY_EVENTS = {
  PERSONALITY_SHIFT: 'personality_shift',
  BEHAVIORAL_ADAPTATION: 'behavioral_adaptation',
  SOCIAL_INFLUENCE: 'social_influence',
  COGNITIVE_BIAS_ACTIVATION: 'cognitive_bias_activation',
  GROUP_DYNAMICS_CHANGE: 'group_dynamics_change',
  POLICY_RESPONSE: 'policy_response'
} as const;
