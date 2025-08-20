/**
 * City Specialization & Geography Engine - Core Types
 * 
 * Defines the data structures for realistic city development with economic
 * specializations, infrastructure systems, and geographic advantages.
 */

export interface GeographicAdvantage {
  id: string;
  name: string;
  description: string;
  economicBonus: number; // Multiplier for relevant industries (1.0 = no bonus, 1.5 = 50% bonus)
  applicableIndustries: string[]; // Industries that benefit from this advantage
  resourceYield?: number; // For resource-based advantages
  maintenanceCost: number; // Annual cost to maintain advantage
}

export interface NaturalResource {
  id: string;
  name: string;
  type: 'mineral' | 'energy' | 'agricultural' | 'water' | 'forest';
  abundance: number; // 0-100, how much is available
  extractionRate: number; // Units per year that can be extracted
  marketValue: number; // Value per unit
  depletionRate: number; // How fast it depletes with extraction
  renewalRate?: number; // For renewable resources
}

export interface Infrastructure {
  id: string;
  name: string;
  type: 'transport' | 'utilities' | 'education' | 'healthcare' | 'recreation' | 'commercial';
  level: number; // 0-10 development level
  capacity: number; // How many people/businesses it can serve
  maintenanceCost: number; // Annual cost to maintain
  constructionCost: number; // Cost to build or upgrade
  constructionTime: number; // Months to build/upgrade
  qualityOfLifeImpact: number; // Impact on citizen satisfaction
  economicImpact: number; // Impact on business productivity
  prerequisites?: string[]; // Required infrastructure IDs
}

export interface CitySpecialization {
  id: string;
  name: string;
  description: string;
  primaryIndustries: string[]; // Main industries this specialization focuses on
  requiredPopulation: number; // Minimum population to develop this specialization
  requiredInfrastructure: string[]; // Infrastructure needed for this specialization
  economicBonuses: {
    industryId: string;
    productivityBonus: number;
    costReduction: number;
    qualityBonus: number;
  }[];
  developmentStages: {
    stage: number;
    name: string;
    requirements: {
      population?: number;
      infrastructure?: { id: string; minLevel: number }[];
      businesses?: number;
      timeInSpecialization?: number; // Months
    };
    benefits: {
      economicMultiplier: number;
      qualityOfLifeBonus: number;
      attractivenessBonus: number;
    };
  }[];
}

export interface City {
  id: string;
  name: string;
  founded: Date;
  
  // Geographic Properties
  coordinates: { x: number; y: number };
  climate: 'temperate' | 'tropical' | 'arid' | 'arctic' | 'mediterranean';
  terrain: 'plains' | 'hills' | 'mountains' | 'coastal' | 'river' | 'desert';
  size: number; // Square kilometers
  
  // Population & Economy
  population: number;
  populationGrowthRate: number; // Annual percentage
  economicOutput: number; // Total GDP
  unemploymentRate: number;
  averageIncome: number;
  costOfLiving: number;
  
  // Specialization & Development
  currentSpecialization?: string; // Current specialization ID
  specializationProgress: number; // 0-100, progress toward current specialization
  specializationHistory: {
    specializationId: string;
    startDate: Date;
    endDate?: Date;
    maxStageReached: number;
  }[];
  
  // Infrastructure
  infrastructure: { [infrastructureId: string]: Infrastructure };
  infrastructureBudget: number; // Annual budget for infrastructure
  
  // Geographic Advantages & Resources
  geographicAdvantages: string[]; // IDs of advantages this city has
  naturalResources: { [resourceId: string]: NaturalResource };
  
  // Quality of Life
  qualityOfLife: number; // 0-100 composite score
  attractiveness: number; // 0-100, how attractive city is for new residents/businesses
  sustainability: number; // 0-100, environmental sustainability score
  
  // Inter-City Relationships
  tradePartners: {
    cityId: string;
    tradeVolume: number; // Annual trade value
    primaryExports: string[]; // What this city exports to partner
    primaryImports: string[]; // What this city imports from partner
    relationshipStrength: number; // 0-100
  }[];
  
  // Government & Policy
  taxRate: number; // Local tax rate percentage
  governmentBudget: number; // Annual budget
  governmentDebt: number;
  policyModifiers: {
    policyId: string;
    effect: number;
    expiryDate?: Date;
  }[];
  
  // Analytics & Tracking
  monthlyMetrics: {
    date: Date;
    population: number;
    economicOutput: number;
    qualityOfLife: number;
    unemploymentRate: number;
    infrastructureSpending: number;
    businessCount: number;
  }[];
  
  // Metadata
  lastUpdated: Date;
  version: number;
}

export interface CityDevelopmentEvent {
  id: string;
  cityId: string;
  timestamp: Date;
  type: 'specialization_change' | 'infrastructure_built' | 'resource_discovered' | 
        'disaster' | 'policy_change' | 'trade_agreement' | 'population_milestone';
  description: string;
  impact: {
    economicImpact?: number;
    populationImpact?: number;
    qualityOfLifeImpact?: number;
    infrastructureImpact?: { id: string; levelChange: number }[];
  };
  metadata: Record<string, any>;
}

export interface CityAnalytics {
  cityId: string;
  analysisDate: Date;
  
  // Economic Analysis
  economicHealth: {
    gdpPerCapita: number;
    economicGrowthRate: number; // Annual percentage
    industrialDiversification: number; // 0-100, how diversified the economy is
    competitiveAdvantages: string[]; // List of key advantages
    economicVulnerabilities: string[]; // List of economic risks
  };
  
  // Infrastructure Analysis
  infrastructureHealth: {
    overallLevel: number; // 0-100 composite score
    maintenanceBacklog: number; // Cost of deferred maintenance
    capacityUtilization: number; // 0-100, how much infrastructure is being used
    priorityUpgrades: { infrastructureId: string; urgency: number }[];
  };
  
  // Social Analysis
  socialHealth: {
    qualityOfLife: number;
    socialMobility: number; // 0-100
    culturalVitality: number; // 0-100
    communityEngagement: number; // 0-100
  };
  
  // Comparative Analysis
  regionalRanking: {
    economicOutput: number; // Rank among regional cities
    qualityOfLife: number;
    growth: number;
    innovation: number;
  };
  
  // Projections
  fiveYearProjection: {
    projectedPopulation: number;
    projectedGDP: number;
    projectedQualityOfLife: number;
    keyRisks: string[];
    keyOpportunities: string[];
  };
}

export interface InterCityRelationship {
  cityAId: string;
  cityBId: string;
  relationshipType: 'trade' | 'competition' | 'cooperation' | 'sister_city';
  strength: number; // 0-100
  
  // Trade Relationship
  tradeData?: {
    annualTradeVolume: number;
    tradeBalance: number; // Positive = A exports more to B
    primaryTradeGoods: string[];
    tradeAgreements: {
      agreementId: string;
      type: string;
      benefits: Record<string, number>;
      expiryDate?: Date;
    }[];
  };
  
  // Competition Relationship
  competitionData?: {
    competingIndustries: string[];
    marketShareBattle: { industry: string; cityAShare: number; cityBShare: number }[];
    competitiveAdvantages: { cityId: string; advantages: string[] }[];
  };
  
  // Cooperation Relationship
  cooperationData?: {
    jointProjects: {
      projectId: string;
      name: string;
      type: string;
      investmentByCity: { cityId: string; amount: number }[];
      expectedBenefits: Record<string, number>;
    }[];
    sharedInfrastructure: string[]; // Infrastructure IDs shared between cities
  };
  
  establishedDate: Date;
  lastInteraction: Date;
}

// Configuration and Constants
export interface CityEngineConfig {
  // Development Parameters
  basePopulationGrowthRate: number;
  economicGrowthVolatility: number;
  infrastructureDecayRate: number;
  specializationDevelopmentRate: number;
  
  // Geographic Influence
  geographicAdvantageStrength: number; // How much geographic advantages matter
  resourceDepletionRate: number;
  climateImpactStrength: number;
  
  // Inter-City Dynamics
  tradeDistanceDecay: number; // How distance affects trade
  competitionRadius: number; // Distance within which cities compete
  cooperationIncentive: number; // Bonus for cooperation
  
  // Quality of Life Factors
  infrastructureQoLWeight: number;
  economicQoLWeight: number;
  environmentalQoLWeight: number;
  socialQoLWeight: number;
  
  // Time and Simulation
  timeStep: 'month' | 'quarter' | 'year';
  simulationSpeed: number;
  randomEventFrequency: number;
}

// Predefined Specializations
export const DEFAULT_SPECIALIZATIONS: CitySpecialization[] = [
  {
    id: 'tech_hub',
    name: 'Technology Hub',
    description: 'Specialized in software development, research, and innovation',
    primaryIndustries: ['software', 'research', 'telecommunications'],
    requiredPopulation: 50000,
    requiredInfrastructure: ['university', 'high_speed_internet', 'business_parks'],
    economicBonuses: [
      { industryId: 'software', productivityBonus: 1.5, costReduction: 0.2, qualityBonus: 1.3 },
      { industryId: 'research', productivityBonus: 1.4, costReduction: 0.15, qualityBonus: 1.4 }
    ],
    developmentStages: [
      {
        stage: 1,
        name: 'Emerging Tech Scene',
        requirements: { population: 50000, infrastructure: [{ id: 'university', minLevel: 3 }] },
        benefits: { economicMultiplier: 1.1, qualityOfLifeBonus: 5, attractivenessBonus: 10 }
      },
      {
        stage: 2,
        name: 'Innovation District',
        requirements: { population: 100000, businesses: 50, timeInSpecialization: 24 },
        benefits: { economicMultiplier: 1.25, qualityOfLifeBonus: 10, attractivenessBonus: 20 }
      },
      {
        stage: 3,
        name: 'Silicon Valley',
        requirements: { population: 250000, businesses: 150, timeInSpecialization: 60 },
        benefits: { economicMultiplier: 1.5, qualityOfLifeBonus: 15, attractivenessBonus: 35 }
      }
    ]
  },
  {
    id: 'manufacturing_center',
    name: 'Manufacturing Center',
    description: 'Industrial production and heavy manufacturing',
    primaryIndustries: ['manufacturing', 'automotive', 'steel'],
    requiredPopulation: 75000,
    requiredInfrastructure: ['industrial_zone', 'freight_rail', 'power_plant'],
    economicBonuses: [
      { industryId: 'manufacturing', productivityBonus: 1.4, costReduction: 0.25, qualityBonus: 1.2 },
      { industryId: 'automotive', productivityBonus: 1.3, costReduction: 0.2, qualityBonus: 1.1 }
    ],
    developmentStages: [
      {
        stage: 1,
        name: 'Industrial Base',
        requirements: { population: 75000, infrastructure: [{ id: 'industrial_zone', minLevel: 4 }] },
        benefits: { economicMultiplier: 1.15, qualityOfLifeBonus: -5, attractivenessBonus: 5 }
      },
      {
        stage: 2,
        name: 'Manufacturing Hub',
        requirements: { population: 150000, businesses: 75, timeInSpecialization: 36 },
        benefits: { economicMultiplier: 1.3, qualityOfLifeBonus: 0, attractivenessBonus: 15 }
      }
    ]
  },
  {
    id: 'financial_district',
    name: 'Financial District',
    description: 'Banking, finance, and business services',
    primaryIndustries: ['banking', 'insurance', 'consulting'],
    requiredPopulation: 100000,
    requiredInfrastructure: ['business_district', 'airport', 'conference_center'],
    economicBonuses: [
      { industryId: 'banking', productivityBonus: 1.6, costReduction: 0.1, qualityBonus: 1.5 },
      { industryId: 'insurance', productivityBonus: 1.4, costReduction: 0.15, qualityBonus: 1.3 }
    ],
    developmentStages: [
      {
        stage: 1,
        name: 'Regional Banking',
        requirements: { population: 100000, infrastructure: [{ id: 'business_district', minLevel: 5 }] },
        benefits: { economicMultiplier: 1.2, qualityOfLifeBonus: 8, attractivenessBonus: 15 }
      },
      {
        stage: 2,
        name: 'Financial Center',
        requirements: { population: 200000, businesses: 100, timeInSpecialization: 48 },
        benefits: { economicMultiplier: 1.4, qualityOfLifeBonus: 12, attractivenessBonus: 25 }
      }
    ]
  }
];

// Predefined Geographic Advantages
export const DEFAULT_GEOGRAPHIC_ADVANTAGES: GeographicAdvantage[] = [
  {
    id: 'coastal_access',
    name: 'Coastal Access',
    description: 'Access to ocean for shipping and trade',
    economicBonus: 1.3,
    applicableIndustries: ['shipping', 'fishing', 'tourism', 'trade'],
    maintenanceCost: 50000
  },
  {
    id: 'river_access',
    name: 'River Access',
    description: 'Major river for transportation and water supply',
    economicBonus: 1.2,
    applicableIndustries: ['shipping', 'manufacturing', 'agriculture'],
    maintenanceCost: 25000
  },
  {
    id: 'mountain_resources',
    name: 'Mountain Resources',
    description: 'Access to mineral deposits and mining',
    economicBonus: 1.4,
    applicableIndustries: ['mining', 'steel', 'construction'],
    resourceYield: 1000000,
    maintenanceCost: 75000
  },
  {
    id: 'fertile_plains',
    name: 'Fertile Plains',
    description: 'Rich agricultural land for farming',
    economicBonus: 1.5,
    applicableIndustries: ['agriculture', 'food_processing'],
    maintenanceCost: 30000
  },
  {
    id: 'strategic_crossroads',
    name: 'Strategic Crossroads',
    description: 'Major transportation hub location',
    economicBonus: 1.25,
    applicableIndustries: ['logistics', 'trade', 'tourism'],
    maintenanceCost: 40000
  }
];
