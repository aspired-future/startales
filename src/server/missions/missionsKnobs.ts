/**
 * Missions System AI Knobs Configuration
 * 24 AI-controllable parameters for mission generation and management
 */

export interface MissionsKnobs {
  // Mission Generation (6 knobs)
  missionGenerationRate: number;          // 0-100: Frequency of new mission generation
  difficultyScaling: number;              // 0-100: How difficulty scales with progress
  storyIntegrationDepth: number;          // 0-100: Story integration level
  emergencyMissionFrequency: number;      // 0-100: Urgent mission frequency
  seasonalMissionVariation: number;       // 0-100: Seasonal mission variety
  legacyMissionInfluence: number;         // 0-100: Past mission influence on new ones

  // Mission Types & Complexity (6 knobs)
  diplomaticMissionComplexity: number;    // 0-100: Diplomatic mission complexity
  militaryMissionIntensity: number;       // 0-100: Military mission intensity
  explorationMissionScope: number;        // 0-100: Exploration mission scope
  researchMissionDepth: number;           // 0-100: Research mission depth
  economicMissionImpact: number;          // 0-100: Economic mission impact
  espionageMissionRisk: number;           // 0-100: Espionage mission risk level

  // Mission Mechanics (6 knobs)
  timeConstraintStrictness: number;       // 0-100: Time limit enforcement
  resourceRequirementFlexibility: number; // 0-100: Resource requirement flexibility
  missionChainComplexity: number;         // 0-100: Multi-part mission complexity
  collaborativeMissionFrequency: number;  // 0-100: Multi-civ mission frequency
  riskAssessmentAccuracy: number;         // 0-100: Risk prediction accuracy
  aiAnalysisDetail: number;               // 0-100: AI analysis depth

  // Rewards & Consequences (6 knobs)
  rewardGenerosity: number;               // 0-100: Base reward amounts
  successBonusMultiplier: number;         // 0-100: Bonus for exceptional success
  failureConsequenceSeverity: number;     // 0-100: Failure consequence severity
  characterInvolvementLevel: number;      // 0-100: Character involvement degree
  culturalMissionSignificance: number;    // 0-100: Cultural mission significance
  playerChoiceImpact: number;             // 0-100: Player choice influence on outcomes
}

/**
 * Default knob settings for balanced gameplay
 */
export const MISSIONS_KNOBS: MissionsKnobs = {
  // Mission Generation
  missionGenerationRate: 50,
  difficultyScaling: 60,
  storyIntegrationDepth: 70,
  emergencyMissionFrequency: 25,
  seasonalMissionVariation: 40,
  legacyMissionInfluence: 55,

  // Mission Types & Complexity
  diplomaticMissionComplexity: 65,
  militaryMissionIntensity: 60,
  explorationMissionScope: 70,
  researchMissionDepth: 65,
  economicMissionImpact: 55,
  espionageMissionRisk: 70,

  // Mission Mechanics
  timeConstraintStrictness: 50,
  resourceRequirementFlexibility: 60,
  missionChainComplexity: 45,
  collaborativeMissionFrequency: 30,
  riskAssessmentAccuracy: 75,
  aiAnalysisDetail: 65,

  // Rewards & Consequences
  rewardGenerosity: 60,
  successBonusMultiplier: 50,
  failureConsequenceSeverity: 45,
  characterInvolvementLevel: 70,
  culturalMissionSignificance: 55,
  playerChoiceImpact: 80
};

/**
 * AI Prompts for Missions System Analysis
 */
export const MISSIONS_AI_PROMPTS = {
  MISSION_GENERATION: `
    Generate a new mission for civilization {civilizationId} based on current game state:
    
    Current Situation:
    - Civilization Progress: {civilizationProgress}
    - Available Resources: {availableResources}
    - Active Conflicts: {activeConflicts}
    - Story Arc: {currentStoryArc}
    - Recent Events: {recentEvents}
    
    Mission Parameters:
    - Generation Rate: {missionGenerationRate}%
    - Difficulty Scaling: {difficultyScaling}%
    - Story Integration: {storyIntegrationDepth}%
    - Emergency Frequency: {emergencyMissionFrequency}%
    
    Create a mission that fits the current context and advances the narrative.
  `,

  MISSION_ANALYSIS: `
    Analyze mission success probability and provide strategic recommendations:
    
    Mission: {missionTitle}
    Type: {missionType}
    Difficulty: {missionDifficulty}/5
    
    Assigned Assets:
    - Characters: {assignedCharacters}
    - Fleets: {assignedFleets}
    - Resources: {assignedResources}
    
    Risk Factors:
    - Military Risk: {militaryRisk}%
    - Diplomatic Risk: {diplomaticRisk}%
    - Economic Risk: {economicRisk}%
    
    Analysis Parameters:
    - Risk Assessment Accuracy: {riskAssessmentAccuracy}%
    - AI Analysis Detail: {aiAnalysisDetail}%
    
    Provide success probability and strategic recommendations.
  `,

  MISSION_OPTIMIZATION: `
    Optimize mission parameters for better outcomes:
    
    Current Mission Performance:
    - Success Rate: {currentSuccessRate}%
    - Average Completion Time: {averageCompletionTime} days
    - Resource Efficiency: {resourceEfficiency}%
    - Player Satisfaction: {playerSatisfaction}%
    
    Current Settings:
    - Difficulty Scaling: {difficultyScaling}%
    - Reward Generosity: {rewardGenerosity}%
    - Time Constraint Strictness: {timeConstraintStrictness}%
    - Resource Flexibility: {resourceRequirementFlexibility}%
    
    Recommend knob adjustments to improve mission system performance.
  `,

  STORY_INTEGRATION: `
    Evaluate mission integration with main story arc:
    
    Current Story Context:
    - Main Arc: {mainStoryArc}
    - Story Progress: {storyProgress}%
    - Key Characters: {keyCharacters}
    - Recent Story Events: {recentStoryEvents}
    
    Mission Details:
    - Title: {missionTitle}
    - Type: {missionType}
    - Narrative Impact: {narrativeImpact}
    - Story Integration Depth: {storyIntegrationDepth}%
    
    Assess how well this mission advances the story and recommend improvements.
  `,

  DIFFICULTY_BALANCING: `
    Balance mission difficulty for optimal player experience:
    
    Player Performance Data:
    - Recent Success Rate: {recentSuccessRate}%
    - Average Mission Duration: {averageDuration} days
    - Preferred Mission Types: {preferredTypes}
    - Skill Level Assessment: {skillLevel}/10
    
    Current Difficulty Settings:
    - Difficulty Scaling: {difficultyScaling}%
    - Military Intensity: {militaryMissionIntensity}%
    - Diplomatic Complexity: {diplomaticMissionComplexity}%
    - Failure Consequence Severity: {failureConsequenceSeverity}%
    
    Recommend difficulty adjustments to maintain engagement without frustration.
  `,

  REWARD_OPTIMIZATION: `
    Optimize mission rewards for player motivation:
    
    Current Reward Performance:
    - Player Satisfaction: {playerSatisfaction}%
    - Mission Completion Rate: {completionRate}%
    - Reward Value Perception: {rewardPerception}%
    - Economic Balance: {economicBalance}%
    
    Reward Settings:
    - Reward Generosity: {rewardGenerosity}%
    - Success Bonus Multiplier: {successBonusMultiplier}%
    - Cultural Significance: {culturalMissionSignificance}%
    - Character Involvement: {characterInvolvementLevel}%
    
    Recommend reward adjustments to improve motivation and game balance.
  `,

  MISSION_CHAIN_DESIGN: `
    Design interconnected mission chains for epic storytelling:
    
    Chain Context:
    - Theme: {chainTheme}
    - Expected Length: {expectedChainLength} missions
    - Difficulty Progression: {difficultyProgression}
    - Story Significance: {storySignificance}
    
    Chain Parameters:
    - Mission Chain Complexity: {missionChainComplexity}%
    - Story Integration Depth: {storyIntegrationDepth}%
    - Character Involvement: {characterInvolvementLevel}%
    - Player Choice Impact: {playerChoiceImpact}%
    
    Create a compelling mission chain with meaningful choices and consequences.
  `,

  COLLABORATIVE_MISSIONS: `
    Design multi-civilization collaborative missions:
    
    Participating Civilizations:
    - Primary: {primaryCivilization}
    - Partners: {partnerCivilizations}
    - Relationships: {civilizationRelationships}
    
    Collaboration Context:
    - Shared Threat: {sharedThreat}
    - Common Goal: {commonGoal}
    - Resource Contributions: {resourceContributions}
    
    Collaboration Settings:
    - Collaborative Frequency: {collaborativeMissionFrequency}%
    - Diplomatic Complexity: {diplomaticMissionComplexity}%
    - Player Choice Impact: {playerChoiceImpact}%
    
    Design a mission requiring meaningful cooperation between civilizations.
  `,

  EMERGENCY_RESPONSE: `
    Generate urgent emergency missions based on crisis events:
    
    Crisis Context:
    - Crisis Type: {crisisType}
    - Severity Level: {severityLevel}/10
    - Time Sensitivity: {timeSensitivity}
    - Affected Systems: {affectedSystems}
    
    Emergency Parameters:
    - Emergency Frequency: {emergencyMissionFrequency}%
    - Time Constraint Strictness: {timeConstraintStrictness}%
    - Failure Consequence Severity: {failureConsequenceSeverity}%
    - Resource Flexibility: {resourceRequirementFlexibility}%
    
    Create an urgent mission that responds to the crisis with appropriate stakes.
  `,

  SEASONAL_ADAPTATION: `
    Adapt mission generation for galactic seasonal events:
    
    Seasonal Context:
    - Current Season: {currentSeason}
    - Seasonal Events: {seasonalEvents}
    - Environmental Factors: {environmentalFactors}
    - Cultural Celebrations: {culturalCelebrations}
    
    Seasonal Settings:
    - Seasonal Variation: {seasonalMissionVariation}%
    - Cultural Significance: {culturalMissionSignificance}%
    - Exploration Scope: {explorationMissionScope}%
    - Story Integration: {storyIntegrationDepth}%
    
    Generate missions that reflect and enhance the current galactic season.
  `
};

export default { MISSIONS_KNOBS, MISSIONS_AI_PROMPTS };

