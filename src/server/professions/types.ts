/**
 * Profession & Industry System Types
 * Sprint 6: Comprehensive profession modeling with labor market dynamics
 */

export interface Profession {
  id: string;
  name: string;
  category: ProfessionCategory;
  description: string;
  
  // Skill Requirements
  requiredSkills: SkillRequirement[];
  optionalSkills: SkillRequirement[];
  educationLevel: EducationLevel;
  experienceRequired: number; // years
  
  // Compensation
  baseSalary: SalaryRange;
  salaryProgression: SalaryProgression;
  benefits: ProfessionBenefits;
  
  // Career Path
  careerLevels: CareerLevel[];
  promotionCriteria: PromotionCriteria;
  lateralMoves: string[]; // profession IDs
  
  // Market Dynamics
  demandLevel: DemandLevel;
  growthProjection: GrowthProjection;
  automationRisk: AutomationRisk;
  
  // Location Factors
  urbanPreference: number; // 0-1, preference for urban vs rural
  remoteWorkCompatible: boolean;
  travelRequirement: TravelRequirement;
}

export interface SkillRequirement {
  skillId: string;
  skillName: string;
  minimumLevel: number; // 1-10
  importance: SkillImportance;
}

export interface SalaryRange {
  minimum: number;
  median: number;
  maximum: number;
  currency: string;
}

export interface SalaryProgression {
  entryLevel: SalaryRange;
  midLevel: SalaryRange;
  seniorLevel: SalaryRange;
  executiveLevel?: SalaryRange;
}

export interface ProfessionBenefits {
  healthInsurance: boolean;
  retirement: boolean;
  paidTimeOff: number; // days per year
  flexibleSchedule: boolean;
  professionalDevelopment: boolean;
  stockOptions: boolean;
}

export interface CareerLevel {
  level: number;
  title: string;
  salaryMultiplier: number;
  requiredExperience: number; // years
  requiredSkills: SkillRequirement[];
  responsibilities: string[];
}

export interface PromotionCriteria {
  performanceThreshold: number; // 0-1
  skillRequirements: SkillRequirement[];
  experienceRequired: number; // years
  availabilityRate: number; // 0-1, how often positions open up
}

export interface LaborMarket {
  professionId: string;
  cityId: string;
  
  // Supply & Demand
  totalPositions: number;
  filledPositions: number;
  openPositions: number;
  qualifiedCandidates: number;
  
  // Market Dynamics
  competitionLevel: CompetitionLevel;
  salaryTrend: SalaryTrend;
  demandTrend: DemandTrend;
  
  // Analytics
  averageSalary: number;
  medianSalary: number;
  salaryGrowthRate: number; // annual %
  turnoverRate: number; // annual %
  timeToFill: number; // days
}

export interface Employment {
  citizenId: string;
  professionId: string;
  employerId?: string;
  
  // Position Details
  title: string;
  level: number;
  salary: number;
  startDate: Date;
  
  // Performance
  performanceRating: number; // 0-1
  skillProficiency: Record<string, number>; // skillId -> level
  experienceYears: number;
  
  // Status
  employmentStatus: EmploymentStatus;
  workSchedule: WorkSchedule;
  satisfactionLevel: number; // 0-1
  
  // Career Development
  promotionEligible: boolean;
  nextPromotionDate?: Date;
  trainingPrograms: string[];
  mentorshipStatus?: MentorshipStatus;
}

export interface UnemploymentRecord {
  citizenId: string;
  
  // Unemployment Details
  unemploymentStart: Date;
  unemploymentDuration: number; // days
  previousProfession?: string;
  reason: UnemploymentReason;
  
  // Job Search
  activelySearching: boolean;
  applicationsSubmitted: number;
  interviewsReceived: number;
  jobOffersReceived: number;
  
  // Support
  unemploymentBenefits: boolean;
  retrainingPrograms: string[];
  jobSearchAssistance: boolean;
  
  // Barriers
  skillsGap: SkillRequirement[];
  locationConstraints: boolean;
  transportationIssues: boolean;
  childcareNeeds: boolean;
}

export interface CareerTransition {
  citizenId: string;
  fromProfession: string;
  toProfession: string;
  transitionDate: Date;
  
  // Transition Details
  transitionType: TransitionType;
  retrainingRequired: boolean;
  salaryChange: number; // percentage
  satisfactionChange: number;
  
  // Support Systems
  mentorshipReceived: boolean;
  formalTraining: boolean;
  networkingSupport: boolean;
  financialSupport: number;
}

export interface ProfessionMetrics {
  professionId: string;
  cityId: string;
  timestamp: Date;
  
  // Employment Metrics
  totalEmployed: number;
  unemploymentRate: number;
  jobOpeningRate: number;
  
  // Compensation Metrics
  averageSalary: number;
  salaryGrowth: number;
  benefitsScore: number;
  
  // Career Metrics
  promotionRate: number;
  retentionRate: number;
  satisfactionScore: number;
  
  // Market Metrics
  demandScore: number;
  competitionLevel: number;
  growthProjection: number;
}

// Enums
export enum ProfessionCategory {
  TECHNOLOGY = 'technology',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  FINANCE = 'finance',
  MANUFACTURING = 'manufacturing',
  RETAIL = 'retail',
  HOSPITALITY = 'hospitality',
  CONSTRUCTION = 'construction',
  TRANSPORTATION = 'transportation',
  GOVERNMENT = 'government',
  AGRICULTURE = 'agriculture',
  ARTS_ENTERTAINMENT = 'arts_entertainment',
  PROFESSIONAL_SERVICES = 'professional_services',
  UTILITIES = 'utilities',
  REAL_ESTATE = 'real_estate'
}

export enum EducationLevel {
  NO_FORMAL = 'no_formal',
  HIGH_SCHOOL = 'high_school',
  TRADE_SCHOOL = 'trade_school',
  ASSOCIATES = 'associates',
  BACHELORS = 'bachelors',
  MASTERS = 'masters',
  DOCTORATE = 'doctorate',
  PROFESSIONAL = 'professional'
}

export enum SkillImportance {
  CRITICAL = 'critical',
  IMPORTANT = 'important',
  PREFERRED = 'preferred',
  NICE_TO_HAVE = 'nice_to_have'
}

export enum DemandLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum GrowthProjection {
  DECLINING = 'declining',
  STABLE = 'stable',
  GROWING = 'growing',
  RAPIDLY_GROWING = 'rapidly_growing'
}

export enum AutomationRisk {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum TravelRequirement {
  NONE = 'none',
  OCCASIONAL = 'occasional',
  FREQUENT = 'frequent',
  EXTENSIVE = 'extensive'
}

export enum CompetitionLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum SalaryTrend {
  DECLINING = 'declining',
  STABLE = 'stable',
  GROWING = 'growing',
  RAPIDLY_GROWING = 'rapidly_growing'
}

export enum DemandTrend {
  DECLINING = 'declining',
  STABLE = 'stable',
  GROWING = 'growing',
  RAPIDLY_GROWING = 'rapidly_growing'
}

export enum EmploymentStatus {
  EMPLOYED = 'employed',
  UNEMPLOYED = 'unemployed',
  UNDEREMPLOYED = 'underemployed',
  SELF_EMPLOYED = 'self_employed',
  RETIRED = 'retired',
  STUDENT = 'student',
  DISABLED = 'disabled'
}

export enum WorkSchedule {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  SEASONAL = 'seasonal',
  TEMPORARY = 'temporary'
}

export enum MentorshipStatus {
  NONE = 'none',
  SEEKING_MENTOR = 'seeking_mentor',
  HAS_MENTOR = 'has_mentor',
  IS_MENTOR = 'is_mentor',
  BOTH = 'both'
}

export enum UnemploymentReason {
  LAYOFF = 'layoff',
  QUIT = 'quit',
  FIRED = 'fired',
  COMPANY_CLOSURE = 'company_closure',
  SEASONAL_END = 'seasonal_end',
  NEW_GRADUATE = 'new_graduate',
  CAREER_CHANGE = 'career_change',
  RELOCATION = 'relocation',
  HEALTH_ISSUES = 'health_issues',
  FAMILY_REASONS = 'family_reasons'
}

export enum TransitionType {
  PROMOTION = 'promotion',
  LATERAL_MOVE = 'lateral_move',
  CAREER_CHANGE = 'career_change',
  INDUSTRY_SWITCH = 'industry_switch',
  RETURN_TO_WORK = 'return_to_work',
  ENTREPRENEURSHIP = 'entrepreneurship'
}
