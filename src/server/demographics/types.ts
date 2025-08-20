/**
 * Demographics & Lifecycle Systems - Core Types
 * 
 * Comprehensive lifespan tracking, casualty management, and demographic lifecycle modeling
 * for realistic population dynamics in the economic simulation.
 */

// ===== CORE LIFECYCLE TYPES =====

export interface LifespanProfile {
  citizenId: string;
  birthDate: Date;
  currentAge: number;
  lifeExpectancy: number;
  healthStatus: HealthStatus;
  mortalityRisk: number; // 0-1 probability
  lifeStage: LifeStage;
  dependents: string[]; // Dependent citizen IDs
  caregivers: string[]; // Caregiver citizen IDs
}

export interface HealthStatus {
  physicalHealth: number; // 0-100
  mentalHealth: number; // 0-100
  chronicConditions: ChronicCondition[];
  healthcareAccess: number; // 0-100
  lastCheckup: Date;
  medicalHistory: MedicalEvent[];
}

export interface ChronicCondition {
  conditionId: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  diagnosisDate: Date;
  treatmentStatus: 'untreated' | 'managed' | 'controlled' | 'deteriorating';
  mortalityImpact: number; // Additional mortality risk
}

export interface MedicalEvent {
  eventId: string;
  date: Date;
  type: MedicalEventType;
  description: string;
  outcome: 'recovered' | 'ongoing' | 'chronic' | 'fatal';
  cost: number;
}

export type MedicalEventType = 
  | 'routine_checkup' 
  | 'emergency' 
  | 'surgery' 
  | 'diagnosis' 
  | 'treatment' 
  | 'vaccination' 
  | 'injury' 
  | 'illness';

export type LifeStage = 
  | 'infant' 
  | 'child' 
  | 'adolescent' 
  | 'young_adult' 
  | 'adult' 
  | 'middle_aged' 
  | 'senior' 
  | 'elderly';

// ===== CASUALTY TRACKING TYPES =====

export interface CasualtyEvent {
  eventId: string;
  timestamp: Date;
  type: CasualtyType;
  cause: CasualtyCause;
  location: string;
  casualties: CasualtyRecord[];
  severity: CasualtySeverity;
  responseTime: number; // minutes
  economicImpact: number;
  socialImpact: number;
}

export interface CasualtyRecord {
  citizenId: string;
  outcome: CasualtyOutcome;
  injuryType?: InjuryType;
  severity?: InjurySeverity;
  treatmentRequired?: boolean;
  recoveryTime?: number; // days
  permanentDisability?: boolean;
  economicLoss: number;
}

export type CasualtyType = 
  | 'warfare' 
  | 'crime' 
  | 'accident' 
  | 'disaster' 
  | 'disease' 
  | 'terrorism' 
  | 'civil_unrest' 
  | 'industrial';

export type CasualtyCause = 
  | 'combat' 
  | 'bombing' 
  | 'shooting' 
  | 'stabbing' 
  | 'vehicle_accident' 
  | 'workplace_accident' 
  | 'natural_disaster' 
  | 'fire' 
  | 'drowning' 
  | 'poisoning' 
  | 'epidemic' 
  | 'starvation' 
  | 'exposure';

export type CasualtySeverity = 'minor' | 'moderate' | 'major' | 'catastrophic';

export type CasualtyOutcome = 'death' | 'critical_injury' | 'serious_injury' | 'minor_injury' | 'unharmed';

export type InjuryType = 
  | 'trauma' 
  | 'burn' 
  | 'fracture' 
  | 'laceration' 
  | 'internal' 
  | 'neurological' 
  | 'psychological';

export type InjurySeverity = 'minor' | 'moderate' | 'severe' | 'life_threatening';

// ===== PLUNDER & CONQUEST TYPES =====

export interface PlunderEvent {
  eventId: string;
  timestamp: Date;
  type: PlunderType;
  source: string; // Conquered territory/enemy
  target: string; // Receiving city/faction
  resources: ResourceCapture[];
  population: PopulationCapture;
  infrastructure: InfrastructureCapture;
  totalValue: number;
  distributionPlan: PlunderDistribution;
}

export interface ResourceCapture {
  resourceType: string;
  quantity: number;
  quality: number; // 0-100
  value: number;
  condition: 'pristine' | 'good' | 'damaged' | 'destroyed';
}

export interface PopulationCapture {
  totalCaptured: number;
  demographics: CapturedDemographic[];
  slaves: number;
  prisoners: number;
  refugees: number;
  collaborators: number;
}

export interface CapturedDemographic {
  ageGroup: string;
  gender: 'male' | 'female';
  profession: string;
  skillLevel: number;
  count: number;
  disposition: 'hostile' | 'neutral' | 'cooperative' | 'loyal';
}

export interface InfrastructureCapture {
  buildings: BuildingCapture[];
  technology: TechnologyCapture[];
  knowledge: KnowledgeCapture[];
  culturalAssets: CulturalCapture[];
}

export interface BuildingCapture {
  buildingType: string;
  condition: number; // 0-100
  functionality: number; // 0-100
  value: number;
  canRelocate: boolean;
}

export interface TechnologyCapture {
  technologyId: string;
  name: string;
  level: number;
  completeness: number; // 0-100
  researchValue: number;
  militaryValue: number;
  economicValue: number;
}

export interface KnowledgeCapture {
  domain: string;
  expertise: string[];
  specialists: number;
  documentation: number; // 0-100
  transferability: number; // 0-100
}

export interface CulturalCapture {
  artworks: number;
  historicalArtifacts: number;
  culturalKnowledge: string[];
  languages: string[];
  traditions: string[];
  value: number;
}

export interface PlunderDistribution {
  government: number; // Percentage
  military: number;
  nobles: number;
  merchants: number;
  citizens: number;
  infrastructure: number;
  reserves: number;
}

export type PlunderType = 
  | 'conquest' 
  | 'raid' 
  | 'tribute' 
  | 'piracy' 
  | 'banditry' 
  | 'taxation' 
  | 'confiscation';

// ===== DEMOGRAPHIC EVOLUTION TYPES =====

export interface DemographicTransition {
  transitionId: string;
  startDate: Date;
  endDate?: Date;
  type: TransitionType;
  cause: TransitionCause;
  affectedPopulation: number;
  demographicChanges: DemographicChange[];
  economicImpact: EconomicImpact;
  socialImpact: SocialImpact;
}

export interface DemographicChange {
  ageGroup: string;
  gender: 'male' | 'female';
  beforeCount: number;
  afterCount: number;
  changeRate: number; // Percentage change
  migrationIn: number;
  migrationOut: number;
  births: number;
  deaths: number;
}

export interface EconomicImpact {
  gdpChange: number;
  laborForceChange: number;
  dependencyRatioChange: number;
  productivityChange: number;
  consumptionChange: number;
  savingsChange: number;
}

export interface SocialImpact {
  familyStructureChange: number;
  educationDemandChange: number;
  healthcareDemandChange: number;
  housingDemandChange: number;
  socialCohesionChange: number;
  culturalDiversityChange: number;
}

export type TransitionType = 
  | 'demographic_transition' 
  | 'population_boom' 
  | 'population_decline' 
  | 'aging_society' 
  | 'youth_bulge' 
  | 'migration_wave' 
  | 'urbanization' 
  | 'rural_exodus';

export type TransitionCause = 
  | 'economic_development' 
  | 'healthcare_improvement' 
  | 'education_expansion' 
  | 'war' 
  | 'disease' 
  | 'famine' 
  | 'policy_change' 
  | 'cultural_shift' 
  | 'technological_advancement';

// ===== MORTALITY & BIRTH RATE TYPES =====

export interface MortalityData {
  year: number;
  totalDeaths: number;
  mortalityRate: number; // Per 1000
  infantMortalityRate: number;
  lifeExpectancy: LifeExpectancyData;
  causesOfDeath: CauseOfDeath[];
  ageSpecificRates: AgeSpecificMortality[];
}

export interface LifeExpectancyData {
  overall: number;
  male: number;
  female: number;
  byEducation: Record<string, number>;
  byIncome: Record<string, number>;
  byOccupation: Record<string, number>;
}

export interface CauseOfDeath {
  cause: string;
  deaths: number;
  percentage: number;
  ageDistribution: Record<string, number>;
  preventable: boolean;
  treatmentCost: number;
}

export interface AgeSpecificMortality {
  ageGroup: string;
  mortalityRate: number;
  leadingCauses: string[];
  riskFactors: string[];
}

export interface BirthData {
  year: number;
  totalBirths: number;
  birthRate: number; // Per 1000
  fertilityRate: number;
  maternalMortality: number;
  infantMortality: number;
  birthsByAge: Record<string, number>;
  plannedPregnancies: number;
  healthcareCoverage: number;
}

// ===== ANALYTICS TYPES =====

export interface DemographicsAnalyticsData {
  populationGrowth: PopulationGrowthMetrics;
  mortalityAnalysis: MortalityAnalysis;
  casualtyAnalysis: CasualtyAnalysis;
  plunderAnalysis: PlunderAnalysis;
  demographicProjections: DemographicProjections;
  healthMetrics: HealthMetrics;
  recommendations: DemographicsRecommendation[];
}

export interface PopulationGrowthMetrics {
  currentGrowthRate: number;
  naturalIncrease: number;
  netMigration: number;
  doubleTime: number; // Years to double population
  peakPopulation: number;
  peakYear: number;
}

export interface MortalityAnalysis {
  overallTrends: MortalityTrend[];
  riskFactors: RiskFactorAnalysis[];
  preventableDeaths: number;
  healthcareGaps: HealthcareGap[];
  interventionOpportunities: InterventionOpportunity[];
}

export interface MortalityTrend {
  period: string;
  mortalityRate: number;
  change: number;
  primaryCauses: string[];
  affectedGroups: string[];
}

export interface RiskFactorAnalysis {
  factor: string;
  prevalence: number;
  mortalityImpact: number;
  economicCost: number;
  interventionCost: number;
  preventionPotential: number;
}

export interface HealthcareGap {
  service: string;
  coverage: number;
  demand: number;
  gap: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface InterventionOpportunity {
  intervention: string;
  targetPopulation: number;
  costPerPerson: number;
  livesaved: number;
  costPerLifeSaved: number;
  feasibility: number; // 0-100
}

export interface CasualtyAnalysis {
  totalCasualties: number;
  casualtyRate: number;
  byType: Record<CasualtyType, number>;
  byCause: Record<CasualtyCause, number>;
  trends: CasualtyTrend[];
  hotspots: CasualtyHotspot[];
  preventionOpportunities: PreventionOpportunity[];
}

export interface CasualtyTrend {
  period: string;
  casualties: number;
  change: number;
  primaryTypes: CasualtyType[];
  emergingThreats: string[];
}

export interface CasualtyHotspot {
  location: string;
  casualtyRate: number;
  primaryCauses: CasualtyCause[];
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  interventionNeeded: boolean;
}

export interface PreventionOpportunity {
  measure: string;
  targetCasualties: CasualtyType[];
  effectiveness: number; // 0-100
  cost: number;
  implementation: string;
  timeframe: string;
}

export interface PlunderAnalysis {
  totalValue: number;
  byType: Record<PlunderType, number>;
  efficiency: number; // Value captured vs. cost
  distribution: PlunderDistributionAnalysis;
  economicImpact: PlunderEconomicImpact;
  sustainabilityMetrics: PlunderSustainability;
}

export interface PlunderDistributionAnalysis {
  inequality: number; // Gini coefficient
  concentrationRatio: number;
  beneficiaryGroups: string[];
  socialTension: number;
}

export interface PlunderEconomicImpact {
  gdpBoost: number;
  inflationPressure: number;
  tradeBalance: number;
  investmentIncrease: number;
  consumptionIncrease: number;
}

export interface PlunderSustainability {
  renewabilityRate: number;
  depletionRisk: number;
  alternativeSources: number;
  longTermViability: number;
}

export interface DemographicProjections {
  timeHorizon: number; // Years
  populationProjection: PopulationProjection[];
  ageStructureEvolution: AgeStructureProjection[];
  dependencyRatioProjection: DependencyRatioProjection[];
  laborForceProjection: LaborForceProjection[];
}

export interface PopulationProjection {
  year: number;
  totalPopulation: number;
  growthRate: number;
  births: number;
  deaths: number;
  netMigration: number;
}

export interface AgeStructureProjection {
  year: number;
  ageGroups: Record<string, number>;
  medianAge: number;
  youthRatio: number;
  elderlyRatio: number;
}

export interface DependencyRatioProjection {
  year: number;
  totalDependencyRatio: number;
  youthDependencyRatio: number;
  elderlyDependencyRatio: number;
  economicImpact: number;
}

export interface LaborForceProjection {
  year: number;
  laborForceSize: number;
  participationRate: number;
  skillDistribution: Record<string, number>;
  productivityIndex: number;
}

export interface HealthMetrics {
  overallHealthIndex: number;
  lifeExpectancyTrend: number;
  healthcareAccessibility: number;
  diseasePrevalence: DiseasePrevalence[];
  healthInequality: number;
  preventiveCareUtilization: number;
}

export interface DiseasePrevalence {
  disease: string;
  prevalence: number;
  incidence: number;
  mortality: number;
  cost: number;
  preventable: boolean;
}

export interface DemographicsRecommendation {
  category: DemographicsRecommendationCategory;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  expectedImpact: string;
  cost: number;
  timeframe: string;
  feasibility: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
}

export type DemographicsRecommendationCategory = 
  | 'healthcare' 
  | 'mortality_reduction' 
  | 'casualty_prevention' 
  | 'population_growth' 
  | 'aging_society' 
  | 'public_health' 
  | 'emergency_preparedness' 
  | 'social_services';
