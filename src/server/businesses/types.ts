/**
 * Small Business & Entrepreneurship System Types
 * Sprint 7: Comprehensive small business ecosystem with financial tracking and market dynamics
 */

export interface Business {
  id: string;
  name: string;
  businessType: BusinessType;
  industry: BusinessIndustry;
  description: string;
  
  // Ownership & Management
  ownerId: string; // citizen ID
  foundedDate: Date;
  legalStructure: LegalStructure;
  
  // Location & Operations
  cityId: string;
  address?: string;
  operatingHours: OperatingHours;
  businessModel: BusinessModel;
  
  // Financial Information
  initialCapital: number;
  currentCapital: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  profitMargin: number;
  
  // Business Metrics
  employeeCount: number;
  customerBase: number;
  marketShare: number; // 0-1 within industry/city
  reputation: number; // 0-1
  
  // Business Status
  status: BusinessStatus;
  riskLevel: RiskLevel;
  growthStage: GrowthStage;
  
  // Operational Details
  products: Product[];
  services: Service[];
  employees: BusinessEmployee[];
  
  // Market Position
  competitorIds: string[];
  targetMarket: TargetMarket;
  pricingStrategy: PricingStrategy;
  
  // Performance History
  monthlyMetrics: MonthlyBusinessMetrics[];
  
  // Timestamps
  createdAt: Date;
  lastUpdated: Date;
}

export interface BusinessEmployee {
  citizenId: string;
  position: string;
  salary: number;
  hireDate: Date;
  performanceRating: number; // 0-1
  responsibilities: string[];
  employmentType: EmploymentType;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  cost: number;
  margin: number;
  demand: number; // 0-1
  quality: number; // 0-1
  description: string;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  hourlyRate: number;
  cost: number;
  margin: number;
  demand: number; // 0-1
  quality: number; // 0-1
  description: string;
}

export interface MonthlyBusinessMetrics {
  month: Date;
  revenue: number;
  expenses: number;
  profit: number;
  employeeCount: number;
  customerCount: number;
  marketShare: number;
  reputation: number;
  cashFlow: number;
}

export interface BusinessFinancials {
  businessId: string;
  
  // Income Statement
  revenue: Revenue;
  expenses: Expenses;
  netIncome: number;
  
  // Balance Sheet
  assets: Assets;
  liabilities: Liabilities;
  equity: number;
  
  // Cash Flow
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
  
  // Financial Ratios
  profitMargin: number;
  returnOnAssets: number;
  debtToEquity: number;
  currentRatio: number;
  
  // Period
  period: Date;
}

export interface Revenue {
  productSales: number;
  serviceSales: number;
  otherRevenue: number;
  totalRevenue: number;
}

export interface Expenses {
  salaries: number;
  rent: number;
  utilities: number;
  supplies: number;
  marketing: number;
  insurance: number;
  taxes: number;
  otherExpenses: number;
  totalExpenses: number;
}

export interface Assets {
  cash: number;
  inventory: number;
  equipment: number;
  realEstate: number;
  intangibleAssets: number;
  totalAssets: number;
}

export interface Liabilities {
  accountsPayable: number;
  loans: number;
  creditCards: number;
  otherLiabilities: number;
  totalLiabilities: number;
}

export interface BusinessOpportunity {
  id: string;
  businessType: BusinessType;
  industry: BusinessIndustry;
  
  // Market Analysis
  marketSize: number;
  competition: CompetitionLevel;
  barriers: BarrierToEntry[];
  
  // Requirements
  minimumCapital: number;
  requiredSkills: string[];
  timeToBreakeven: number; // months
  
  // Projections
  projectedRevenue: number;
  projectedProfit: number;
  successProbability: number; // 0-1
  riskFactors: string[];
}

export interface MarketAnalysis {
  industry: BusinessIndustry;
  cityId: string;
  
  // Market Size
  totalMarketSize: number;
  addressableMarket: number;
  marketGrowthRate: number;
  
  // Competition
  numberOfCompetitors: number;
  marketConcentration: number; // 0-1 (1 = monopoly)
  averageMarketShare: number;
  
  // Customer Analysis
  targetDemographics: Demographics;
  customerSpending: number;
  customerLoyalty: number; // 0-1
  
  // Trends
  industryTrends: IndustryTrend[];
  seasonality: SeasonalityPattern;
  
  // Barriers
  barrierToEntry: BarrierToEntry[];
  regulatoryRequirements: string[];
}

export interface Demographics {
  ageGroups: Record<string, number>;
  incomeGroups: Record<string, number>;
  educationLevels: Record<string, number>;
  occupations: Record<string, number>;
}

export interface IndustryTrend {
  name: string;
  impact: TrendImpact;
  timeframe: TrendTimeframe;
  description: string;
}

export interface SeasonalityPattern {
  q1Multiplier: number;
  q2Multiplier: number;
  q3Multiplier: number;
  q4Multiplier: number;
}

export interface BusinessLoan {
  id: string;
  businessId: string;
  lenderId: string;
  
  // Loan Terms
  principal: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  
  // Status
  currentBalance: number;
  paymentsRemaining: number;
  status: LoanStatus;
  
  // Requirements
  collateral?: string;
  personalGuarantee: boolean;
  creditScore: number;
  
  // Dates
  originationDate: Date;
  maturityDate: Date;
  lastPaymentDate?: Date;
}

export interface BusinessEvent {
  id: string;
  businessId: string;
  eventType: BusinessEventType;
  description: string;
  impact: BusinessImpact;
  timestamp: Date;
  
  // Financial Impact
  revenueImpact?: number;
  expenseImpact?: number;
  reputationImpact?: number;
  
  // Duration
  isOngoing: boolean;
  endDate?: Date;
}

export interface BusinessImpact {
  financial: number; // -1 to 1
  operational: number; // -1 to 1
  reputation: number; // -1 to 1
  strategic: number; // -1 to 1
}

// Enums
export enum BusinessType {
  SOLE_PROPRIETORSHIP = 'sole_proprietorship',
  PARTNERSHIP = 'partnership',
  LLC = 'llc',
  CORPORATION = 'corporation',
  FRANCHISE = 'franchise',
  COOPERATIVE = 'cooperative'
}

export enum BusinessIndustry {
  RETAIL = 'retail',
  FOOD_SERVICE = 'food_service',
  PROFESSIONAL_SERVICES = 'professional_services',
  HEALTHCARE = 'healthcare',
  TECHNOLOGY = 'technology',
  MANUFACTURING = 'manufacturing',
  CONSTRUCTION = 'construction',
  TRANSPORTATION = 'transportation',
  REAL_ESTATE = 'real_estate',
  FINANCE = 'finance',
  EDUCATION = 'education',
  ENTERTAINMENT = 'entertainment',
  AGRICULTURE = 'agriculture',
  ENERGY = 'energy',
  TELECOMMUNICATIONS = 'telecommunications'
}

export enum LegalStructure {
  SOLE_PROPRIETORSHIP = 'sole_proprietorship',
  GENERAL_PARTNERSHIP = 'general_partnership',
  LIMITED_PARTNERSHIP = 'limited_partnership',
  LLC = 'llc',
  S_CORP = 's_corp',
  C_CORP = 'c_corp',
  NONPROFIT = 'nonprofit',
  COOPERATIVE = 'cooperative'
}

export enum BusinessModel {
  B2C_RETAIL = 'b2c_retail',
  B2B_SERVICES = 'b2b_services',
  SUBSCRIPTION = 'subscription',
  MARKETPLACE = 'marketplace',
  FRANCHISE = 'franchise',
  MANUFACTURING = 'manufacturing',
  CONSULTING = 'consulting',
  E_COMMERCE = 'e_commerce',
  FREEMIUM = 'freemium',
  ADVERTISING = 'advertising'
}

export enum BusinessStatus {
  PLANNING = 'planning',
  STARTUP = 'startup',
  OPERATING = 'operating',
  GROWING = 'growing',
  MATURE = 'mature',
  DECLINING = 'declining',
  RESTRUCTURING = 'restructuring',
  CLOSING = 'closing',
  CLOSED = 'closed',
  SOLD = 'sold'
}

export enum RiskLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
  CRITICAL = 'critical'
}

export enum GrowthStage {
  SEED = 'seed',
  STARTUP = 'startup',
  GROWTH = 'growth',
  EXPANSION = 'expansion',
  MATURITY = 'maturity',
  DECLINE = 'decline'
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERN = 'intern',
  CONSULTANT = 'consultant'
}

export enum ProductCategory {
  CONSUMER_GOODS = 'consumer_goods',
  INDUSTRIAL_GOODS = 'industrial_goods',
  LUXURY_GOODS = 'luxury_goods',
  NECESSITIES = 'necessities',
  TECHNOLOGY = 'technology',
  FOOD_BEVERAGE = 'food_beverage',
  CLOTHING = 'clothing',
  HOME_GARDEN = 'home_garden',
  AUTOMOTIVE = 'automotive',
  HEALTH_BEAUTY = 'health_beauty'
}

export enum ServiceCategory {
  PROFESSIONAL = 'professional',
  PERSONAL = 'personal',
  BUSINESS = 'business',
  FINANCIAL = 'financial',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  ENTERTAINMENT = 'entertainment',
  TRANSPORTATION = 'transportation',
  MAINTENANCE = 'maintenance',
  CONSULTING = 'consulting'
}

export enum CompetitionLevel {
  NONE = 'none',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  INTENSE = 'intense'
}

export enum BarrierToEntry {
  HIGH_CAPITAL_REQUIREMENTS = 'high_capital_requirements',
  REGULATORY_APPROVAL = 'regulatory_approval',
  SPECIALIZED_KNOWLEDGE = 'specialized_knowledge',
  ESTABLISHED_COMPETITION = 'established_competition',
  BRAND_LOYALTY = 'brand_loyalty',
  ECONOMIES_OF_SCALE = 'economies_of_scale',
  NETWORK_EFFECTS = 'network_effects',
  SWITCHING_COSTS = 'switching_costs',
  LOCATION_ADVANTAGES = 'location_advantages',
  INTELLECTUAL_PROPERTY = 'intellectual_property'
}

export enum TrendImpact {
  VERY_NEGATIVE = 'very_negative',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
  POSITIVE = 'positive',
  VERY_POSITIVE = 'very_positive'
}

export enum TrendTimeframe {
  SHORT_TERM = 'short_term', // < 1 year
  MEDIUM_TERM = 'medium_term', // 1-3 years
  LONG_TERM = 'long_term' // > 3 years
}

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  ACTIVE = 'active',
  DELINQUENT = 'delinquent',
  DEFAULT = 'default',
  PAID_OFF = 'paid_off',
  CHARGED_OFF = 'charged_off'
}

export enum BusinessEventType {
  FOUNDED = 'founded',
  FIRST_SALE = 'first_sale',
  HIRED_EMPLOYEE = 'hired_employee',
  FIRED_EMPLOYEE = 'fired_employee',
  LOAN_RECEIVED = 'loan_received',
  LOAN_PAID_OFF = 'loan_paid_off',
  MAJOR_CONTRACT = 'major_contract',
  LOST_CONTRACT = 'lost_contract',
  EXPANSION = 'expansion',
  DOWNSIZING = 'downsizing',
  PRODUCT_LAUNCH = 'product_launch',
  PRODUCT_DISCONTINUED = 'product_discontinued',
  COMPETITOR_ENTERED = 'competitor_entered',
  COMPETITOR_EXITED = 'competitor_exited',
  REGULATORY_CHANGE = 'regulatory_change',
  ECONOMIC_SHOCK = 'economic_shock',
  NATURAL_DISASTER = 'natural_disaster',
  TECHNOLOGY_DISRUPTION = 'technology_disruption',
  MERGER_ACQUISITION = 'merger_acquisition',
  BANKRUPTCY = 'bankruptcy',
  CLOSURE = 'closure'
}

export interface OperatingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  open: string; // HH:MM format
  close: string; // HH:MM format
  closed: boolean;
}

export interface TargetMarket {
  demographics: Demographics;
  psychographics: string[];
  geographicScope: GeographicScope;
  marketSize: number;
  averageSpending: number;
}

export enum GeographicScope {
  NEIGHBORHOOD = 'neighborhood',
  CITY = 'city',
  REGIONAL = 'regional',
  NATIONAL = 'national',
  INTERNATIONAL = 'international'
}

export interface PricingStrategy {
  strategy: PricingType;
  markup: number; // percentage
  competitiveFactor: number; // 0-1, how much to consider competitor pricing
  demandElasticity: number; // how sensitive customers are to price changes
}

export enum PricingType {
  COST_PLUS = 'cost_plus',
  COMPETITIVE = 'competitive',
  VALUE_BASED = 'value_based',
  PENETRATION = 'penetration',
  PREMIUM = 'premium',
  DYNAMIC = 'dynamic'
}
