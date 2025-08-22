/**
 * Government Types Enhanced Knob System
 * 24 AI-controllable knobs for government type management
 */

export interface GovernmentTypesKnobs {
  // Government Stability Knobs (1-8)
  legitimacyDecayRate: number;           // 0-100: How fast legitimacy decreases over time
  stabilityVolatility: number;           // 0-100: How much stability fluctuates
  successionStability: number;           // 0-100: Stability during leadership transitions
  crisisResponseBonus: number;          // 0-100: Performance boost during crises
  popularSupportWeight: number;         // 0-100: How much public opinion matters
  institutionalInertia: number;         // 0-100: Resistance to change
  corruptionTolerance: number;          // 0-100: How much corruption is tolerated
  revolutionThreshold: number;          // 0-100: Point at which revolution becomes likely

  // Economic Control Knobs (9-16)
  marketInterventionLevel: number;      // 0-100: Government intervention in markets
  resourceAllocationEfficiency: number; // 0-100: How efficiently resources are allocated
  privatePropertyProtection: number;    // 0-100: Strength of property rights
  economicPlanningHorizon: number;      // 0-100: Long-term vs short-term focus
  inflationControlCapacity: number;     // 0-100: Ability to control inflation
  tradeRegulationStrength: number;      // 0-100: Level of trade restrictions
  laborMarketFlexibility: number;       // 0-100: Ease of hiring/firing workers
  innovationIncentives: number;         // 0-100: Support for innovation and R&D

  // Social Control Knobs (17-24)
  mediaControlStrength: number;         // 0-100: Level of media censorship
  civilLibertiesProtection: number;     // 0-100: Protection of individual rights
  culturalHomogenization: number;       // 0-100: Pressure for cultural conformity
  educationIndoctrination: number;      // 0-100: Level of ideological education
  surveillanceCapacity: number;         // 0-100: Government monitoring capabilities
  dissidentSuppression: number;         // 0-100: Crackdown on opposition
  religiousFreedom: number;             // 0-100: Freedom of religious practice
  socialMobilityRate: number;           // 0-100: Ease of changing social class
}

export const DEFAULT_GOVERNMENT_TYPES_KNOBS: GovernmentTypesKnobs = {
  // Government Stability Knobs
  legitimacyDecayRate: 5,
  stabilityVolatility: 15,
  successionStability: 70,
  crisisResponseBonus: 25,
  popularSupportWeight: 60,
  institutionalInertia: 40,
  corruptionTolerance: 30,
  revolutionThreshold: 25,

  // Economic Control Knobs
  marketInterventionLevel: 50,
  resourceAllocationEfficiency: 60,
  privatePropertyProtection: 75,
  economicPlanningHorizon: 50,
  inflationControlCapacity: 65,
  tradeRegulationStrength: 40,
  laborMarketFlexibility: 60,
  innovationIncentives: 55,

  // Social Control Knobs
  mediaControlStrength: 30,
  civilLibertiesProtection: 70,
  culturalHomogenization: 35,
  educationIndoctrination: 25,
  surveillanceCapacity: 40,
  dissidentSuppression: 20,
  religiousFreedom: 80,
  socialMobilityRate: 55
};

export const GOVERNMENT_TYPE_KNOB_PRESETS: Record<string, Partial<GovernmentTypesKnobs>> = {
  'absolute_monarchy': {
    legitimacyDecayRate: 15,
    stabilityVolatility: 25,
    successionStability: 40,
    institutionalInertia: 80,
    marketInterventionLevel: 70,
    privatePropertyProtection: 60,
    mediaControlStrength: 80,
    civilLibertiesProtection: 30,
    culturalHomogenization: 90,
    dissidentSuppression: 70
  },
  'parliamentary_democracy': {
    legitimacyDecayRate: 3,
    stabilityVolatility: 10,
    successionStability: 95,
    popularSupportWeight: 85,
    institutionalInertia: 30,
    marketInterventionLevel: 25,
    privatePropertyProtection: 90,
    mediaControlStrength: 15,
    civilLibertiesProtection: 90,
    socialMobilityRate: 75
  },
  'communist_state': {
    legitimacyDecayRate: 8,
    stabilityVolatility: 20,
    institutionalInertia: 90,
    marketInterventionLevel: 95,
    resourceAllocationEfficiency: 40,
    privatePropertyProtection: 10,
    economicPlanningHorizon: 90,
    mediaControlStrength: 90,
    civilLibertiesProtection: 20,
    educationIndoctrination: 85
  },
  'military_dictatorship': {
    legitimacyDecayRate: 12,
    stabilityVolatility: 35,
    crisisResponseBonus: 60,
    institutionalInertia: 60,
    corruptionTolerance: 50,
    marketInterventionLevel: 60,
    mediaControlStrength: 85,
    civilLibertiesProtection: 25,
    surveillanceCapacity: 80,
    dissidentSuppression: 85
  }
};

/**
 * AI Prompts for Government Types System
 */
export const GOVERNMENT_TYPES_AI_PROMPTS = {
  STABILITY_ANALYSIS: `
    Analyze the current government stability based on:
    - Legitimacy: {legitimacy}%
    - Popular Support: {popularSupport}%
    - Recent Events: {recentEvents}
    - Economic Performance: {economicPerformance}%
    
    Consider the government type ({governmentType}) characteristics and current knob settings.
    Provide insights on stability trends and potential risks.
  `,

  TRANSITION_ASSESSMENT: `
    Assess the possibility of government transition from {currentType} to {targetType}:
    
    Current Conditions:
    - Popular Support: {popularSupport}%
    - Military Support: {militarySupport}%
    - Economic Crisis: {economicCrisis}
    - External Pressure: {externalPressure}
    
    Knob Settings:
    - Revolution Threshold: {revolutionThreshold}
    - Institutional Inertia: {institutionalInertia}
    - Legitimacy Decay Rate: {legitimacyDecayRate}
    
    Evaluate transition probability and recommend actions.
  `,

  CRISIS_RESPONSE: `
    The civilization is facing a {crisisType} crisis. 
    
    Government Type: {governmentType}
    Current Metrics:
    - Decision Speed: {decisionSpeed}/10
    - Crisis Response Bonus: {crisisResponseBonus}%
    - Institutional Strength: {institutionalStrength}%
    
    Recommend government response strategies and predict outcomes.
  `,

  POLICY_EFFECTIVENESS: `
    Evaluate policy effectiveness for {governmentType}:
    
    Policy Area: {policyArea}
    Current Settings:
    - Market Intervention: {marketInterventionLevel}%
    - Civil Liberties: {civilLibertiesProtection}%
    - Media Control: {mediaControlStrength}%
    
    Situation: {currentSituation}
    
    Predict policy outcomes and suggest adjustments.
  `,

  KNOB_OPTIMIZATION: `
    Optimize knob settings for {governmentType} to achieve:
    Goal: {optimizationGoal}
    
    Current Performance:
    - Stability: {stability}%
    - Economic Performance: {economicPerformance}%
    - Public Satisfaction: {publicSatisfaction}%
    
    Current Knob Settings: {currentKnobs}
    
    Recommend specific knob adjustments with reasoning.
  `
};

/**
 * Knob Descriptions for UI
 */
export const GOVERNMENT_TYPES_KNOB_DESCRIPTIONS = {
  legitimacyDecayRate: "Rate at which government legitimacy naturally decreases over time",
  stabilityVolatility: "How much government stability fluctuates due to events",
  successionStability: "Government stability during leadership transitions",
  crisisResponseBonus: "Performance improvement during crisis situations",
  popularSupportWeight: "How much public opinion influences government decisions",
  institutionalInertia: "Resistance to governmental and policy changes",
  corruptionTolerance: "Level of corruption the system tolerates before instability",
  revolutionThreshold: "Point at which revolutionary movements become likely",
  
  marketInterventionLevel: "Degree of government intervention in free markets",
  resourceAllocationEfficiency: "Efficiency of government resource distribution",
  privatePropertyProtection: "Strength of private property rights enforcement",
  economicPlanningHorizon: "Focus on long-term vs short-term economic planning",
  inflationControlCapacity: "Government's ability to control inflation",
  tradeRegulationStrength: "Level of international trade restrictions",
  laborMarketFlexibility: "Ease of hiring, firing, and labor mobility",
  innovationIncentives: "Government support for research and innovation",
  
  mediaControlStrength: "Level of government media censorship and control",
  civilLibertiesProtection: "Protection of individual rights and freedoms",
  culturalHomogenization: "Pressure for cultural conformity and unity",
  educationIndoctrination: "Level of ideological content in education",
  surveillanceCapacity: "Government monitoring and surveillance capabilities",
  dissidentSuppression: "Crackdown intensity on political opposition",
  religiousFreedom: "Freedom of religious practice and expression",
  socialMobilityRate: "Ease of changing social and economic class"
};

