/**
 * Technology & Cyber Warfare Systems - Data Types
 * Sprint 16: Technology acquisition, cyber warfare, and research acceleration
 */

// Technology Categories and Classifications
export type TechnologyCategory = 
  | 'Military' | 'Industrial' | 'Medical' | 'Agricultural' | 'Transportation'
  | 'Communication' | 'Energy' | 'Computing' | 'Materials' | 'Space'
  | 'Biotechnology' | 'Nanotechnology' | 'Quantum' | 'AI' | 'Robotics'
  | 'Psychic' | 'FTL' | 'Terraforming' | 'Megastructures' | 'Consciousness'
  | 'Dimensional' | 'Temporal' | 'Exotic Matter' | 'Galactic Engineering';

export type TechnologyLevel = 'Primitive' | 'Basic' | 'Intermediate' | 'Advanced' | 'Cutting-Edge' | 'Experimental' | 'Theoretical' | 'Transcendent';

export type TechnologyEra = 
  | 'Stone Age' | 'Bronze Age' | 'Iron Age' | 'Industrial' | 'Information' | 'Digital'
  | 'Space Age' | 'Interplanetary' | 'Interstellar' | 'Galactic' | 'Transcendent';

export type AcquisitionMethod = 
  | 'Conquest' | 'Espionage' | 'Trade' | 'Research' | 'Reverse Engineering'
  | 'Cyber Theft' | 'Defection' | 'Purchase' | 'Alliance' | 'Discovery'
  | 'Corporate Innovation' | 'Citizen Innovation' | 'Accidental Discovery'
  | 'Psychic Revelation' | 'AI Breakthrough' | 'Alien Contact';

// Dynamic Tech Tree System
export type TechTreeNodeState = 'Hidden' | 'Discovered' | 'Researching' | 'Unlocked' | 'Obsolete';

export type InnovationSource = 
  | 'Government Research' | 'Corporate R&D' | 'Independent Inventor' 
  | 'Academic Institution' | 'Military Development' | 'Alien Technology'
  | 'Psychic Discovery' | 'AI Innovation' | 'Accidental Breakthrough';

// Psychic Powers System
export type PsychicPowerCategory = 
  | 'Telepathy' | 'Telekinesis' | 'Precognition' | 'Psychometry' | 'Empathy'
  | 'Mind Control' | 'Astral Projection' | 'Energy Manipulation' | 'Healing'
  | 'Technopathy' | 'Dimensional Sight' | 'Time Perception' | 'Consciousness Transfer';

export type PsychicAcquisitionMethod = 
  | 'Natural Awakening' | 'Genetic Engineering' | 'Pharmaceutical Enhancement'
  | 'Meditation Training' | 'Technological Augmentation' | 'Alien Implant'
  | 'Consciousness Upload' | 'Dimensional Exposure' | 'Temporal Accident';

// Core Technology Interface
export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  level: TechnologyLevel;
  era: TechnologyEra;
  description: string;
  
  // Technical specifications
  complexity: number; // 1-10 scale
  researchCost: number;
  implementationCost: number;
  maintenanceCost: number;
  
  // Dynamic Tech Tree Properties
  treeState: TechTreeNodeState;
  discoveryDate?: Date;
  discoveryMethod?: InnovationSource;
  isDeadEnd: boolean;
  hiddenUntilDiscovered: boolean;
  
  // Prerequisites and dependencies
  prerequisites: string[]; // Technology IDs required
  unlocks: string[]; // Technology IDs this unlocks
  softPrerequisites: string[]; // Helpful but not required
  alternativePrerequisites: string[][]; // OR conditions for prerequisites
  
  // Economic and military impact
  economicBonus: number; // GDP multiplier
  militaryBonus: number; // Military effectiveness multiplier
  researchBonus: number; // Research speed multiplier
  
  // Acquisition tracking
  acquisitionMethod: AcquisitionMethod;
  acquisitionDate: Date;
  sourceId?: string; // ID of source civilization/entity
  acquisitionCost: number;
  
  // Implementation status
  implementationProgress: number; // 0-100%
  operationalStatus: 'Research' | 'Development' | 'Testing' | 'Deployed' | 'Obsolete';
  
  // Security and vulnerability
  securityLevel: number; // 1-10 scale
  vulnerabilityScore: number; // 1-10 scale (higher = more vulnerable)
  
  metadata: {
    discoveredBy?: string;
    patents?: string[];
    classifications?: string[];
    exportRestrictions?: boolean;
    dualUse?: boolean; // Can be used for both civilian and military purposes
    isPsychicTech?: boolean;
    requiresPsychicAbility?: boolean;
    alienOrigin?: boolean;
    theoreticalOnly?: boolean;
  };
}

// Psychic Powers System
export interface PsychicPower {
  id: string;
  name: string;
  category: PsychicPowerCategory;
  level: number; // 1-10 power level
  description: string;
  
  // Acquisition and training
  acquisitionMethod: PsychicAcquisitionMethod;
  trainingRequired: boolean;
  trainingDuration: number; // days
  trainingCost: number;
  
  // Prerequisites
  requiredTechnologies: string[]; // Technology IDs
  requiredPowers: string[]; // Other psychic power IDs
  geneticRequirements: string[];
  
  // Effects and capabilities
  mentalEnergyRequired: number;
  range: number; // meters, -1 for unlimited
  duration: number; // seconds, -1 for permanent
  cooldown: number; // seconds between uses
  
  // Risks and side effects
  burnoutRisk: number; // 0-100% chance of temporary loss
  psychicFeedbackRisk: number; // 0-100% chance of mental damage
  detectionRisk: number; // 0-100% chance of being detected when used
  
  // Applications
  militaryApplications: string[];
  civilianApplications: string[];
  researchApplications: string[];
  
  metadata: {
    discoveredBy?: string;
    firstManifestationDate?: Date;
    prevalenceInPopulation: number; // percentage who can learn this
    governmentClassification: string;
    ethicalConcerns: string[];
  };
}

// Dynamic Tech Tree System
export interface TechTreeNode {
  technologyId: string;
  position: { x: number; y: number }; // For visualization
  state: TechTreeNodeState;
  discoveryProbability: number; // 0-1 chance of discovery per research cycle
  
  // Dynamic connections
  prerequisiteConnections: TechTreeConnection[];
  unlockConnections: TechTreeConnection[];
  
  // Discovery conditions
  discoveryTriggers: DiscoveryTrigger[];
  hiddenConditions: HiddenCondition[];
  
  // Research properties
  researchPriority: number; // AI/advisor recommendation weight
  deadEndProbability: number; // 0-1 chance this leads nowhere useful
  breakthroughPotential: number; // 0-1 chance of major breakthrough
}

export interface TechTreeConnection {
  fromTechId: string;
  toTechId: string;
  connectionType: 'Hard Prerequisite' | 'Soft Prerequisite' | 'Alternative Path' | 'Synergy Bonus';
  strength: number; // 0-1, how important this connection is
  hidden: boolean; // Whether players can see this connection
}

export interface DiscoveryTrigger {
  type: 'Research Threshold' | 'Population Event' | 'Resource Discovery' | 'Alien Contact' | 'Psychic Awakening' | 'AI Breakthrough' | 'Corporate Innovation' | 'Random Event';
  conditions: Record<string, any>;
  probability: number; // 0-1 chance when conditions are met
  oneTime: boolean; // Whether this trigger can only fire once
}

export interface HiddenCondition {
  type: 'Era Requirement' | 'Population Size' | 'Psychic Population' | 'Corporate Research Level' | 'Government Type' | 'Crisis Event';
  requirement: any;
  revealsPrerequistes: boolean; // Whether meeting this reveals what's needed
}

// Innovation and Discovery System
export interface InnovationEvent {
  id: string;
  type: InnovationSource;
  targetTechnologyId?: string; // If targeting specific tech
  category?: TechnologyCategory; // If exploring category
  
  // Event details
  eventDate: Date;
  duration: number; // days
  cost: number;
  probability: number; // 0-1 chance of success
  
  // Participants
  leadResearcher?: string; // Person ID
  organization?: string; // Corporation, university, government agency
  team: InnovationTeamMember[];
  
  // Resources
  funding: number;
  equipment: string[];
  facilities: string[];
  
  // Outcomes
  outcome?: InnovationOutcome;
  discoveredTechnologies: string[];
  breakthroughs: string[];
  deadEnds: string[];
  spinoffOpportunities: string[];
}

export interface InnovationTeamMember {
  personId: string;
  role: 'Lead Researcher' | 'Specialist' | 'Assistant' | 'Theorist' | 'Engineer' | 'Psychic Consultant';
  expertise: TechnologyCategory[];
  psychicAbilities: string[]; // Psychic power IDs
  contribution: number; // 0-1 effectiveness multiplier
}

export interface InnovationOutcome {
  success: boolean;
  breakthroughLevel: 'Minor' | 'Significant' | 'Major' | 'Revolutionary' | 'Paradigm Shift';
  
  // Discoveries
  technologiesUnlocked: string[];
  psychicPowersAwakened: string[];
  newResearchDirections: string[];
  
  // Consequences
  cost: number;
  timeSpent: number; // days
  resourcesConsumed: Record<string, number>;
  
  // Side effects
  accidents: InnovationAccident[];
  ethicalConcerns: string[];
  securityRisks: string[];
  
  // Knowledge gained
  researchData: string[];
  theoreticalInsights: string[];
  practicalApplications: string[];
}

export interface InnovationAccident {
  type: 'Equipment Failure' | 'Psychic Overload' | 'Dimensional Breach' | 'AI Awakening' | 'Temporal Anomaly' | 'Consciousness Transfer' | 'Reality Distortion';
  severity: 'Minor' | 'Moderate' | 'Severe' | 'Catastrophic';
  effects: string[];
  casualties: number;
  containmentRequired: boolean;
  coverupAttempted: boolean;
}

// Civilization Technology Profile
export interface CivilizationTech {
  civilizationId: string;
  name: string;
  techLevel: TechnologyLevel;
  currentEra: TechnologyEra;
  
  // Technology inventory
  technologies: Technology[];
  psychicPowers: PsychicPower[];
  researchProjects: ResearchProject[];
  innovationEvents: InnovationEvent[];
  
  // Dynamic Tech Tree
  techTree: TechTreeNode[];
  discoveredNodes: string[]; // Technology IDs that are visible
  researchableNodes: string[]; // Technology IDs that can be researched
  
  // Capabilities
  researchCapacity: number;
  innovationRate: number;
  technologyAdoption: number; // Speed of implementing new tech
  psychicPopulation: number; // Percentage with psychic abilities
  
  // Specializations
  strengths: TechnologyCategory[]; // Areas of expertise
  weaknesses: TechnologyCategory[]; // Areas of deficiency
  psychicStrengths: PsychicPowerCategory[]; // Psychic specializations
  
  // Innovation ecosystem
  corporateInnovation: number; // 1-10 scale of corporate R&D capability
  academicResearch: number; // 1-10 scale of university research
  independentInventors: number; // 1-10 scale of citizen innovation
  governmentResearch: number; // 1-10 scale of state research
  
  // Security posture
  cyberDefense: number; // 1-10 scale
  counterIntelligence: number; // 1-10 scale
  informationSecurity: number; // 1-10 scale
  psychicDefense: number; // 1-10 scale against psychic attacks
  
  // Discovery and exploration
  explorationBudget: number;
  riskTolerance: number; // 0-1 willingness to pursue dangerous research
  ethicalConstraints: string[]; // Research areas they won't pursue
  
  // Starting conditions (for game setup)
  startingEra: TechnologyEra;
  startingTechnologies: string[];
  startingPsychicAbilities: string[];
  gameSetupSeed: number; // For deterministic tech tree generation
}

// Research and Development
export interface ResearchProject {
  id: string;
  name: string;
  targetTechnology: string; // Technology ID being researched
  category: TechnologyCategory;
  
  // Project details
  startDate: Date;
  estimatedCompletion: Date;
  actualCompletion?: Date;
  
  // Resources
  budget: number;
  budgetSpent: number;
  researchers: number;
  facilities: string[];
  
  // Progress tracking
  progress: number; // 0-100%
  milestones: ResearchMilestone[];
  
  // Collaboration and security
  collaborators: string[]; // Other civilization IDs
  securityClearance: 'Public' | 'Restricted' | 'Confidential' | 'Secret' | 'Top Secret';
  
  // Outcomes
  breakthroughs: string[];
  setbacks: string[];
  spinoffTechnologies: string[];
}

export interface ResearchMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  completionDate?: Date;
  progress: number; // 0-100%
  significance: 'Minor' | 'Major' | 'Critical' | 'Breakthrough';
}

// Cyber Warfare and Technology Theft
export type CyberOperationType = 
  | 'Data Theft' | 'Technology Theft' | 'Sabotage' | 'Surveillance'
  | 'Disruption' | 'Propaganda' | 'Infrastructure Attack' | 'Economic Warfare';

export type OperationStatus = 'Planning' | 'Active' | 'Completed' | 'Failed' | 'Compromised' | 'Aborted';

export interface CyberOperation {
  id: string;
  name: string;
  type: CyberOperationType;
  
  // Operation details
  startDate: Date;
  endDate?: Date;
  duration: number; // Planned duration in days
  
  // Participants
  operatorId: string; // Attacking civilization
  targetId: string; // Target civilization
  assets: CyberAsset[];
  
  // Objectives
  primaryObjective: string;
  secondaryObjectives: string[];
  targetTechnologies: string[]; // Technology IDs to steal
  
  // Execution
  status: OperationStatus;
  progress: number; // 0-100%
  detectionRisk: number; // 1-10 scale
  successProbability: number; // 0-100%
  
  // Resources
  budget: number;
  personnel: number;
  tools: string[];
  
  // Results
  outcome?: CyberOperationOutcome;
  intelligence: IntelligenceData[];
  stolenTechnologies: string[]; // Technology IDs successfully stolen
  
  // Security implications
  compromisedSystems: string[];
  evidenceLeft: number; // 1-10 scale (higher = more evidence)
  attribution: number; // 1-10 scale (higher = easier to attribute)
}

export interface CyberAsset {
  id: string;
  name: string;
  type: 'Human' | 'Software' | 'Hardware' | 'Network' | 'Facility';
  capability: string[];
  securityClearance?: string;
  reliability: number; // 1-10 scale
  coverStatus: 'Intact' | 'Suspected' | 'Blown' | 'Burned';
}

export interface CyberOperationOutcome {
  success: boolean;
  detectionLevel: 'Undetected' | 'Suspected' | 'Detected' | 'Attributed' | 'Exposed';
  
  // Gains
  technologiesAcquired: Technology[];
  dataAcquired: IntelligenceData[];
  economicDamage: number; // Damage to target
  militaryDamage: number; // Military capability damage
  
  // Costs
  operationalCost: number;
  assetsLost: string[]; // Asset IDs compromised/lost
  reputationDamage: number;
  
  // Consequences
  retaliation?: CyberOperation;
  diplomaticFallout: number;
  securityUpgrades: string[]; // Security improvements made by target
}

export interface IntelligenceData {
  id: string;
  type: 'Technical' | 'Economic' | 'Military' | 'Political' | 'Social';
  classification: 'Public' | 'Restricted' | 'Confidential' | 'Secret' | 'Top Secret';
  
  content: string;
  source: string;
  reliability: number; // 1-10 scale
  timeliness: number; // 1-10 scale (higher = more current)
  
  acquisitionDate: Date;
  expirationDate?: Date;
  
  // Value assessment
  strategicValue: number; // 1-10 scale
  economicValue: number;
  militaryValue: number;
  
  // Related technologies
  relatedTechnologies: string[]; // Technology IDs
  implications: string[];
}

// Technology Transfer and Reverse Engineering
export interface TechnologyTransfer {
  id: string;
  sourceId: string; // Source civilization
  recipientId: string; // Recipient civilization
  technologyId: string;
  
  // Transfer details
  transferDate: Date;
  transferMethod: 'Sale' | 'License' | 'Gift' | 'Exchange' | 'Theft' | 'Conquest';
  
  // Terms
  cost: number;
  restrictions: string[];
  duration?: number; // For licenses
  royalties?: number; // Ongoing payments
  
  // Implementation
  adaptationRequired: boolean;
  adaptationCost: number;
  adaptationTime: number; // Days
  successProbability: number; // 0-100%
  
  // Results
  implementationSuccess: boolean;
  performanceDegradation: number; // 0-100% (loss in effectiveness)
  localImprovements: string[];
  
  // Security
  securityMeasures: string[];
  leakageRisk: number; // 1-10 scale
}

export interface ReverseEngineeringProject {
  id: string;
  civilizationId: string;
  targetTechnologyId: string;
  
  // Project setup
  startDate: Date;
  estimatedCompletion: Date;
  
  // Resources
  budget: number;
  researchers: number;
  facilities: string[];
  samples: TechnologySample[];
  
  // Progress
  progress: number; // 0-100%
  understanding: number; // 0-100% (how well understood)
  reproduction: number; // 0-100% (ability to reproduce)
  
  // Challenges
  technicalChallenges: string[];
  materialChallenges: string[];
  knowledgeGaps: string[];
  
  // Results
  discoveries: string[];
  improvements: string[];
  alternativeApproaches: string[];
  
  // Outcome
  success: boolean;
  resultingTechnology?: Technology;
  performanceComparison: number; // -100% to +100% vs original
}

export interface TechnologySample {
  id: string;
  technologyId: string;
  type: 'Physical' | 'Digital' | 'Documentation' | 'Personnel';
  
  condition: 'Pristine' | 'Good' | 'Damaged' | 'Fragmentary' | 'Corrupted';
  completeness: number; // 0-100%
  
  acquisitionMethod: AcquisitionMethod;
  acquisitionDate: Date;
  
  analysisResults: AnalysisResult[];
}

export interface AnalysisResult {
  id: string;
  analysisType: 'Material' | 'Structural' | 'Functional' | 'Performance' | 'Security';
  findings: string[];
  confidence: number; // 0-100%
  analysisDate: Date;
  analyst: string;
}

// Technology Analytics and Metrics
export interface TechnologyAnalyticsData {
  // Overview metrics
  totalTechnologies: number;
  technologiesByCategory: Record<TechnologyCategory, number>;
  technologiesByLevel: Record<TechnologyLevel, number>;
  averageComplexity: number;
  
  // Research metrics
  activeResearchProjects: number;
  researchBudget: number;
  researchEfficiency: number;
  innovationRate: number;
  
  // Acquisition metrics
  acquisitionsByMethod: Record<AcquisitionMethod, number>;
  acquisitionCosts: number;
  acquisitionSuccess: number; // Success rate 0-100%
  
  // Cyber warfare metrics
  activeCyberOperations: number;
  cyberSuccessRate: number;
  technologiesStolen: number;
  cyberDefenseRating: number;
  
  // Technology transfer metrics
  transfersIn: number;
  transfersOut: number;
  reverseEngineeringProjects: number;
  reverseEngineeringSuccess: number;
  
  // Impact metrics
  economicImpact: number;
  militaryImpact: number;
  researchImpact: number;
  
  // Security metrics
  vulnerabilityScore: number;
  securityIncidents: number;
  counterIntelligenceEffectiveness: number;
  
  // Competitive analysis
  technologyGap: Record<string, number>; // Gap vs other civilizations
  competitiveAdvantages: TechnologyCategory[];
  strategicVulnerabilities: TechnologyCategory[];
  
  // Projections
  projectedGrowth: number;
  emergingTechnologies: string[];
  obsoleteTechnologies: string[];
  
  // Recommendations
  researchPriorities: string[];
  acquisitionTargets: string[];
  securityUpgrades: string[];
  collaborationOpportunities: string[];
}

export interface TechnologyRecommendation {
  type: 'Research' | 'Acquire' | 'Defend' | 'Transfer' | 'Abandon';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  technologyId?: string;
  description: string;
  rationale: string;
  estimatedCost: number;
  estimatedBenefit: number;
  timeframe: string;
  risks: string[];
  dependencies: string[];
}
