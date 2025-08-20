/**
 * Population & Demographics Engine - Core Types
 * 
 * Individual citizen modeling with psychological profiles and incentive responses
 * for realistic behavioral economics simulation.
 */

export interface CitizenId {
  readonly value: string;
}

export interface PsychologicalProfile {
  // Big Five personality traits (0-1 scale)
  openness: number;        // Openness to experience
  conscientiousness: number; // Self-discipline and organization
  extraversion: number;    // Social energy and assertiveness
  agreeableness: number;   // Cooperation and trust
  neuroticism: number;     // Emotional stability (inverted)
  
  // Economic behavior traits
  riskTolerance: number;   // Willingness to take financial risks (0-1)
  spendingImpulsiveness: number; // Tendency for impulse purchases (0-1)
  savingsOrientation: number;    // Preference for saving vs spending (0-1)
  
  // Social and political traits
  authorityRespect: number;      // Respect for authority and rules (0-1)
  changeAdaptability: number;    // Adaptability to change (0-1)
  socialInfluence: number;       // Susceptibility to social pressure (0-1)
}

export interface Demographics {
  age: number;
  gender: 'male' | 'female' | 'other';
  educationLevel: 'none' | 'primary' | 'secondary' | 'tertiary' | 'advanced';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  householdSize: number;
  dependents: number;
  
  // Location and mobility
  cityId: string;
  residenceType: 'rural' | 'suburban' | 'urban' | 'metropolitan';
  mobilityWillingness: number; // Willingness to relocate (0-1)
}

export interface CareerProfile {
  currentProfession: string;
  skillLevel: number;        // 0-100 skill in current profession
  experience: number;        // Years of experience
  careerAmbition: number;    // Drive for advancement (0-1)
  
  // Skills and capabilities
  skills: Record<string, number>; // Skill name -> proficiency (0-100)
  learningRate: number;      // How quickly they acquire new skills (0-1)
  
  // Employment status
  employmentStatus: 'employed' | 'unemployed' | 'student' | 'retired' | 'disabled';
  currentEmployer?: string;
  salary: number;
  jobSatisfaction: number;   // 0-1 scale
}

export interface FinancialStatus {
  income: number;            // Monthly income
  expenses: number;          // Monthly expenses
  savings: number;           // Total savings
  debt: number;              // Total debt
  creditScore: number;       // 300-850 credit score
  
  // Spending patterns
  spendingCategories: {
    housing: number;
    food: number;
    transportation: number;
    healthcare: number;
    education: number;
    entertainment: number;
    savings: number;
    other: number;
  };
}

export interface SocialConnections {
  familyTies: number;        // Strength of family connections (0-1)
  friendshipNetwork: number; // Size and strength of social network (0-1)
  communityInvolvement: number; // Participation in community activities (0-1)
  politicalEngagement: number;  // Political awareness and participation (0-1)
}

export interface LifeGoals {
  careerAdvancement: number;    // Importance of career success (0-1)
  familyFormation: number;      // Desire for family/children (0-1)
  wealthAccumulation: number;   // Importance of financial success (0-1)
  socialStatus: number;         // Desire for social recognition (0-1)
  personalFulfillment: number;  // Importance of personal happiness (0-1)
  securityStability: number;    // Preference for stability over risk (0-1)
}

export interface Citizen {
  id: CitizenId;
  
  // Core attributes
  demographics: Demographics;
  psychology: PsychologicalProfile;
  career: CareerProfile;
  finances: FinancialStatus;
  social: SocialConnections;
  goals: LifeGoals;
  
  // Dynamic state
  happiness: number;         // Current happiness level (0-1)
  stress: number;           // Current stress level (0-1)
  health: number;           // Physical health (0-1)
  
  // Life events and history
  lifeEvents: LifeEvent[];
  decisionHistory: Decision[];
  
  // Simulation metadata
  createdAt: Date;
  lastUpdated: Date;
  version: number;
}

export interface LifeEvent {
  id: string;
  type: LifeEventType;
  timestamp: Date;
  impact: {
    happiness: number;
    stress: number;
    finances: number;
    career: number;
    social: number;
  };
  description: string;
}

export type LifeEventType = 
  | 'birth' | 'education' | 'graduation' | 'job_start' | 'job_loss' | 'promotion'
  | 'marriage' | 'divorce' | 'child_birth' | 'death_family' | 'illness' | 'recovery'
  | 'home_purchase' | 'home_sale' | 'debt_default' | 'windfall' | 'retirement'
  | 'relocation' | 'skill_acquisition' | 'social_connection' | 'political_event';

export interface Decision {
  id: string;
  timestamp: Date;
  type: DecisionType;
  context: Record<string, any>;
  options: DecisionOption[];
  chosenOption: string;
  reasoning: string;
  outcome?: DecisionOutcome;
}

export type DecisionType =
  | 'career_change' | 'education_investment' | 'spending_choice' | 'savings_decision'
  | 'relocation' | 'family_planning' | 'investment' | 'political_participation'
  | 'social_activity' | 'health_choice' | 'consumption_preference';

export interface DecisionOption {
  id: string;
  description: string;
  expectedUtility: number;
  riskLevel: number;
  cost: number;
  timeCommitment: number;
}

export interface DecisionOutcome {
  actualUtility: number;
  actualCost: number;
  sideEffects: Record<string, number>;
  satisfaction: number; // How satisfied the citizen is with the outcome (0-1)
}

// Population-level aggregates
export interface PopulationMetrics {
  totalPopulation: number;
  averageAge: number;
  averageIncome: number;
  unemploymentRate: number;
  educationDistribution: Record<string, number>;
  happinessIndex: number;
  stressIndex: number;
  socialMobility: number;
  
  // Demographic breakdowns
  ageDistribution: Record<string, number>;
  genderDistribution: Record<string, number>;
  professionDistribution: Record<string, number>;
  incomeDistribution: Record<string, number>;
  
  // Economic indicators
  consumerConfidence: number;
  spendingPropensity: number;
  savingsRate: number;
  debtToIncomeRatio: number;
}

export interface IncentiveResponse {
  citizenId: CitizenId;
  incentiveType: IncentiveType;
  responseStrength: number;  // How strongly they respond (0-1)
  behaviorChange: Record<string, number>; // What behaviors change and by how much
  adaptationRate: number;    // How quickly they adapt to the incentive
  saturationPoint: number;   // Point at which additional incentive has no effect
}

export type IncentiveType =
  | 'tax_reduction' | 'tax_increase' | 'subsidy' | 'regulation' | 'social_program'
  | 'education_opportunity' | 'job_training' | 'healthcare_access' | 'housing_assistance'
  | 'public_transport' | 'environmental_policy' | 'cultural_program' | 'infrastructure';

// Configuration and parameters
export interface PopulationConfig {
  initialPopulationSize: number;
  birthRate: number;
  deathRate: number;
  immigrationRate: number;
  emigrationRate: number;
  
  // Simulation parameters
  timeStep: 'day' | 'week' | 'month' | 'year';
  agingRate: number;
  skillDecayRate: number;
  memoryDecayRate: number;
  
  // Behavioral parameters
  decisionFrequency: number;     // How often citizens make major decisions
  socialInfluenceStrength: number; // How much citizens influence each other
  adaptationSpeed: number;       // How quickly citizens adapt to changes
  
  // Economic parameters
  baseConsumption: number;       // Baseline consumption level
  incomeVolatility: number;      // Variability in income changes
  jobMobilityRate: number;       // Rate of job changes
}
