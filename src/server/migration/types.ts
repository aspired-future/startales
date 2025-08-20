/**
 * Immigration & Migration System - Core Types
 * 
 * Defines the data structures for comprehensive population movement modeling,
 * including legal/illegal immigration, internal migration, cultural integration,
 * and policy effects on migration flows.
 */

export interface MigrationFlow {
  id: string;
  type: 'immigration' | 'emigration' | 'internal_migration';
  subtype: 'legal' | 'illegal' | 'refugee' | 'economic' | 'family_reunification' | 'student' | 'temporary_worker';
  
  // Origin and Destination
  originCityId?: string; // For internal migration
  originCountry?: string; // For international migration
  destinationCityId: string;
  destinationCountry?: string;
  
  // Flow Characteristics
  populationSize: number; // Number of people in this flow
  startDate: Date;
  endDate?: Date; // For temporary flows
  duration?: number; // Expected duration in months
  
  // Demographics
  demographics: {
    ageDistribution: { [ageGroup: string]: number }; // e.g., "18-25": 0.3
    genderDistribution: { male: number; female: number; other: number };
    educationLevels: { [level: string]: number }; // e.g., "university": 0.4
    skillLevels: { [skill: string]: number }; // e.g., "technology": 0.6
    languages: string[]; // Languages spoken
    culturalBackground: string; // Cultural/ethnic background
  };
  
  // Economic Factors
  economicProfile: {
    averageIncome: number; // In origin location
    savings: number; // Average savings per person
    jobSkills: string[]; // Professional skills
    employmentRate: number; // Employment rate in group
    remittanceCapacity: number; // Ability to send money back
  };
  
  // Migration Drivers
  pushFactors: {
    economic: number; // 0-100 strength of economic push
    political: number; // Political instability/persecution
    environmental: number; // Climate change, disasters
    social: number; // Social unrest, discrimination
    conflict: number; // War, violence
  };
  
  pullFactors: {
    economic: number; // Job opportunities, higher wages
    social: number; // Family, community networks
    political: number; // Political freedom, stability
    environmental: number; // Better living conditions
    educational: number; // Education opportunities
  };
  
  // Legal Status & Documentation
  legalStatus: 'documented' | 'undocumented' | 'asylum_seeker' | 'refugee' | 'temporary_permit';
  visaType?: string; // Type of visa if applicable
  documentationLevel: number; // 0-100, completeness of documentation
  
  // Integration Potential
  integrationFactors: {
    languageProficiency: number; // 0-100 in destination language
    culturalSimilarity: number; // 0-100 cultural similarity to destination
    socialNetworks: number; // 0-100 existing social connections
    adaptabilityScore: number; // 0-100 psychological adaptability
    resourceAccess: number; // 0-100 access to integration resources
  };
  
  // Metadata
  createdAt: Date;
  lastUpdated: Date;
  status: 'active' | 'completed' | 'interrupted' | 'planned';
}

export interface ImmigrationPolicy {
  id: string;
  name: string;
  description: string;
  type: 'quota' | 'points_system' | 'family_reunification' | 'refugee' | 'temporary_worker' | 'border_control' | 'integration';
  
  // Policy Parameters
  parameters: {
    annualQuota?: number; // Maximum immigrants per year
    skillRequirements?: { [skill: string]: number }; // Required skill levels
    languageRequirements?: { language: string; proficiencyLevel: number }[];
    educationRequirements?: string[]; // Required education levels
    ageRestrictions?: { min: number; max: number };
    financialRequirements?: { minimumSavings: number; incomeThreshold: number };
    healthRequirements?: string[]; // Health screening requirements
  };
  
  // Policy Effects
  effects: {
    flowMultiplier: number; // Multiplier for migration flows (1.0 = no effect)
    legalPathwayStrength: number; // 0-100, strength of legal immigration pathways
    illegalFlowReduction: number; // 0-100, reduction in illegal immigration
    integrationSupport: number; // 0-100, level of integration support provided
    economicImpact: number; // -100 to 100, economic impact on destination
    socialCohesion: number; // -100 to 100, impact on social cohesion
  };
  
  // Targeting
  targetGroups: string[]; // Which migration types this policy affects
  targetCities?: string[]; // Specific cities (if not national)
  
  // Implementation
  implementationDate: Date;
  expiryDate?: Date;
  enforcementLevel: number; // 0-100, how strictly enforced
  publicSupport: number; // 0-100, public support for policy
  
  // Costs and Resources
  implementationCost: number; // Cost to implement
  annualOperatingCost: number; // Annual cost to maintain
  requiredInfrastructure: string[]; // Infrastructure needed
  
  // Metadata
  createdAt: Date;
  lastUpdated: Date;
  status: 'draft' | 'active' | 'suspended' | 'expired';
}

export interface IntegrationOutcome {
  id: string;
  migrationFlowId: string;
  cityId: string;
  
  // Integration Metrics
  timeInDestination: number; // Months since arrival
  integrationStage: 'arrival' | 'initial_settlement' | 'adaptation' | 'integration' | 'full_integration';
  
  // Economic Integration
  economicIntegration: {
    employmentRate: number; // 0-100
    averageIncome: number; // Current average income
    incomeGrowth: number; // Income growth since arrival
    jobSkillUtilization: number; // 0-100, how well skills are utilized
    entrepreneurshipRate: number; // 0-100, rate of business creation
    socialMobility: number; // 0-100, upward mobility achieved
  };
  
  // Social Integration
  socialIntegration: {
    languageProficiency: number; // 0-100 in destination language
    socialNetworkSize: number; // Number of local social connections
    communityParticipation: number; // 0-100, participation in community activities
    interculturalFriendships: number; // 0-100, friendships with locals
    culturalAdaptation: number; // 0-100, adaptation to local culture
    discriminationExperience: number; // 0-100, level of discrimination faced
  };
  
  // Civic Integration
  civicIntegration: {
    legalStatus: 'temporary' | 'permanent_resident' | 'citizen' | 'undocumented';
    civicParticipation: number; // 0-100, participation in civic activities
    politicalEngagement: number; // 0-100, political participation
    legalKnowledge: number; // 0-100, knowledge of legal rights and obligations
    institutionalTrust: number; // 0-100, trust in institutions
  };
  
  // Cultural Integration
  culturalIntegration: {
    culturalRetention: number; // 0-100, retention of origin culture
    culturalAdoption: number; // 0-100, adoption of destination culture
    bilingualProficiency: number; // 0-100, proficiency in both languages
    culturalBridging: number; // 0-100, ability to bridge cultures
    identityFormation: 'origin' | 'destination' | 'bicultural' | 'multicultural';
  };
  
  // Challenges and Barriers
  integrationChallenges: {
    languageBarriers: number; // 0-100, severity of language barriers
    credentialRecognition: number; // 0-100, recognition of foreign credentials
    discriminationLevel: number; // 0-100, level of discrimination faced
    culturalBarriers: number; // 0-100, cultural adaptation challenges
    economicBarriers: number; // 0-100, economic integration challenges
    legalBarriers: number; // 0-100, legal status challenges
  };
  
  // Support Services Utilization
  serviceUtilization: {
    languageClasses: boolean;
    jobTraining: boolean;
    credentialRecognition: boolean;
    socialServices: boolean;
    legalAid: boolean;
    culturalOrientation: boolean;
    mentorshipPrograms: boolean;
  };
  
  // Outcomes and Satisfaction
  outcomes: {
    overallSatisfaction: number; // 0-100, satisfaction with migration decision
    qualityOfLifeChange: number; // -100 to 100, change in quality of life
    futureIntentions: 'stay_permanently' | 'return_origin' | 'move_elsewhere' | 'undecided';
    recommendationLikelihood: number; // 0-100, likelihood to recommend migration
  };
  
  // Metadata
  lastAssessment: Date;
  assessmentFrequency: number; // Months between assessments
  dataQuality: number; // 0-100, quality of integration data
}

export interface MigrationAnalytics {
  cityId: string;
  analysisDate: Date;
  timeframe: 'monthly' | 'quarterly' | 'yearly';
  
  // Flow Analytics
  flowAnalytics: {
    totalInflows: number;
    totalOutflows: number;
    netMigration: number;
    migrationRate: number; // Per 1000 population
    
    // By Type
    flowsByType: { [type: string]: number };
    flowsBySubtype: { [subtype: string]: number };
    flowsByOrigin: { [origin: string]: number };
    
    // Trends
    flowTrends: {
      growthRate: number; // Percentage change
      seasonality: { [month: string]: number };
      volatility: number; // Measure of flow stability
    };
  };
  
  // Integration Analytics
  integrationAnalytics: {
    averageIntegrationScore: number; // 0-100 composite score
    integrationByStage: { [stage: string]: number };
    integrationSuccessRate: number; // 0-100
    
    // Integration Dimensions
    economicIntegrationAvg: number;
    socialIntegrationAvg: number;
    civicIntegrationAvg: number;
    culturalIntegrationAvg: number;
    
    // Integration Challenges
    topChallenges: string[];
    barrierSeverity: { [barrier: string]: number };
  };
  
  // Economic Impact
  economicImpact: {
    laborForceContribution: number; // Net contribution to labor force
    taxContribution: number; // Annual tax contribution
    entrepreneurshipImpact: number; // Businesses created
    skillsContribution: { [skill: string]: number };
    remittanceOutflows: number; // Money sent to origin countries
    
    // Fiscal Impact
    fiscalBalance: number; // Net fiscal contribution (taxes - services)
    servicesCost: number; // Cost of services provided
    infrastructureImpact: number; // Impact on infrastructure capacity
  };
  
  // Social Impact
  socialImpact: {
    culturalDiversity: number; // 0-100, level of cultural diversity
    socialCohesion: number; // 0-100, overall social cohesion
    interculturalContact: number; // 0-100, level of intercultural interaction
    communityVitality: number; // 0-100, community vitality and engagement
    
    // Social Challenges
    segregationLevel: number; // 0-100, residential/social segregation
    tensionLevel: number; // 0-100, social tensions
    discriminationReports: number; // Number of discrimination incidents
  };
  
  // Policy Effectiveness
  policyEffectiveness: {
    activePolicies: number;
    policyComplianceRate: number; // 0-100
    policyImpactScore: number; // 0-100, overall policy effectiveness
    
    // Policy Outcomes
    legalPathwayUtilization: number; // 0-100
    illegalFlowReduction: number; // Percentage reduction
    integrationSupportEffectiveness: number; // 0-100
  };
  
  // Projections
  projections: {
    projectedInflows: { [year: number]: number };
    projectedIntegrationOutcomes: { [metric: string]: number };
    capacityConstraints: string[]; // Potential capacity issues
    policyRecommendations: string[]; // Recommended policy adjustments
  };
}

export interface MigrationEvent {
  id: string;
  timestamp: Date;
  type: 'flow_change' | 'policy_implementation' | 'integration_milestone' | 'crisis_response' | 'capacity_limit';
  
  // Event Details
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  // Affected Entities
  affectedCities: string[];
  affectedFlows: string[];
  affectedPolicies: string[];
  
  // Impact Assessment
  impact: {
    populationImpact: number; // Number of people affected
    economicImpact: number; // Economic impact in currency
    socialImpact: number; // -100 to 100, social impact score
    policyImpact: number; // -100 to 100, policy effectiveness impact
  };
  
  // Response Actions
  responseActions: {
    actionType: string;
    description: string;
    cost: number;
    effectiveness: number; // 0-100
    implementationDate: Date;
  }[];
  
  // Metadata
  reportedBy: string; // System or user who reported
  resolved: boolean;
  resolutionDate?: Date;
}

export interface MigrationEngineConfig {
  // Flow Modeling Parameters
  baseFlowVolatility: number; // Base volatility in migration flows
  economicSensitivity: number; // Sensitivity to economic factors
  policySensitivity: number; // Sensitivity to policy changes
  networkEffectStrength: number; // Strength of network effects
  
  // Integration Parameters
  integrationTimeframe: number; // Average months for full integration
  integrationVariability: number; // Variability in integration outcomes
  supportServiceEffectiveness: number; // Effectiveness of support services
  discriminationImpact: number; // Impact of discrimination on integration
  
  // Economic Impact Parameters
  laborMarketAbsorption: number; // Labor market's ability to absorb migrants
  skillPremium: number; // Premium for high-skilled migrants
  entrepreneurshipRate: number; // Rate of migrant entrepreneurship
  remittanceRate: number; // Percentage of income sent as remittances
  
  // Social Impact Parameters
  culturalAdaptationRate: number; // Rate of cultural adaptation
  socialCohesionSensitivity: number; // Sensitivity of social cohesion to migration
  interculturalContactRate: number; // Rate of intercultural contact
  segregationTendency: number; // Tendency toward residential segregation
  
  // Policy Parameters
  policyImplementationLag: number; // Months for policy effects to manifest
  enforcementEffectiveness: number; // Effectiveness of policy enforcement
  publicOpinionInfluence: number; // Influence of public opinion on policy
  
  // Simulation Parameters
  timeStep: 'month' | 'quarter' | 'year';
  randomEventFrequency: number; // Frequency of random migration events
  capacityConstraints: boolean; // Whether to model capacity constraints
}

// Predefined Migration Policies
export const DEFAULT_MIGRATION_POLICIES: ImmigrationPolicy[] = [
  {
    id: 'skilled_worker_program',
    name: 'Skilled Worker Immigration Program',
    description: 'Points-based system prioritizing skilled workers and professionals',
    type: 'points_system',
    parameters: {
      annualQuota: 50000,
      skillRequirements: { 'technology': 70, 'healthcare': 80, 'engineering': 75 },
      languageRequirements: [{ language: 'english', proficiencyLevel: 70 }],
      educationRequirements: ['bachelor', 'master', 'doctorate'],
      ageRestrictions: { min: 18, max: 45 },
      financialRequirements: { minimumSavings: 25000, incomeThreshold: 60000 }
    },
    effects: {
      flowMultiplier: 1.5,
      legalPathwayStrength: 85,
      illegalFlowReduction: 20,
      integrationSupport: 70,
      economicImpact: 40,
      socialCohesion: 10
    },
    targetGroups: ['economic', 'student'],
    implementationDate: new Date('2024-01-01'),
    enforcementLevel: 80,
    publicSupport: 65,
    implementationCost: 50000000,
    annualOperatingCost: 25000000,
    requiredInfrastructure: ['processing_centers', 'skills_assessment', 'language_testing'],
    createdAt: new Date(),
    lastUpdated: new Date(),
    status: 'active'
  },
  {
    id: 'family_reunification',
    name: 'Family Reunification Program',
    description: 'Allows citizens and permanent residents to sponsor family members',
    type: 'family_reunification',
    parameters: {
      annualQuota: 30000,
      financialRequirements: { minimumSavings: 15000, incomeThreshold: 40000 }
    },
    effects: {
      flowMultiplier: 1.2,
      legalPathwayStrength: 90,
      illegalFlowReduction: 30,
      integrationSupport: 60,
      economicImpact: 15,
      socialCohesion: 25
    },
    targetGroups: ['family_reunification'],
    implementationDate: new Date('2023-01-01'),
    enforcementLevel: 75,
    publicSupport: 70,
    implementationCost: 20000000,
    annualOperatingCost: 15000000,
    requiredInfrastructure: ['family_verification', 'sponsor_assessment'],
    createdAt: new Date(),
    lastUpdated: new Date(),
    status: 'active'
  },
  {
    id: 'refugee_protection',
    name: 'Refugee Protection Program',
    description: 'Humanitarian protection for refugees and asylum seekers',
    type: 'refugee',
    parameters: {
      annualQuota: 20000
    },
    effects: {
      flowMultiplier: 1.0,
      legalPathwayStrength: 95,
      illegalFlowReduction: 40,
      integrationSupport: 90,
      economicImpact: -10,
      socialCohesion: 5
    },
    targetGroups: ['refugee', 'asylum_seeker'],
    implementationDate: new Date('2022-01-01'),
    enforcementLevel: 90,
    publicSupport: 55,
    implementationCost: 100000000,
    annualOperatingCost: 80000000,
    requiredInfrastructure: ['refugee_centers', 'legal_aid', 'integration_services'],
    createdAt: new Date(),
    lastUpdated: new Date(),
    status: 'active'
  }
];

// Migration Flow Types
export const MIGRATION_FLOW_TYPES = {
  IMMIGRATION: 'immigration',
  EMIGRATION: 'emigration',
  INTERNAL_MIGRATION: 'internal_migration'
} as const;

export const MIGRATION_SUBTYPES = {
  LEGAL: 'legal',
  ILLEGAL: 'illegal',
  REFUGEE: 'refugee',
  ECONOMIC: 'economic',
  FAMILY_REUNIFICATION: 'family_reunification',
  STUDENT: 'student',
  TEMPORARY_WORKER: 'temporary_worker'
} as const;

export const INTEGRATION_STAGES = {
  ARRIVAL: 'arrival',
  INITIAL_SETTLEMENT: 'initial_settlement',
  ADAPTATION: 'adaptation',
  INTEGRATION: 'integration',
  FULL_INTEGRATION: 'full_integration'
} as const;
