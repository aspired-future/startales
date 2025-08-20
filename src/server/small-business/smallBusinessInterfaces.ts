/**
 * Small Business Ecosystem Interfaces
 * 
 * Type definitions for the comprehensive small business system
 */

export interface SmallBusiness {
  id: string;
  name: string;
  business_type: BusinessType;
  category: BusinessCategory;
  subcategory: string;
  civilization_id: number;
  planet_id: number;
  city_id: number;
  location: BusinessLocation;
  owner: BusinessOwner;
  employees: BusinessEmployee[];
  financial_info: BusinessFinancials;
  operations: BusinessOperations;
  products_services: ProductService[];
  suppliers: SupplierRelationship[];
  customers: CustomerBase;
  market_presence: MarketPresence;
  business_health: BusinessHealth;
  growth_metrics: GrowthMetrics;
  compliance: ComplianceStatus;
  lifecycle: BusinessLifecycle;
  metadata: BusinessMetadata;
}

export type BusinessType = 
  | 'sole_proprietorship' 
  | 'partnership' 
  | 'llc' 
  | 'corporation' 
  | 'cooperative' 
  | 'franchise';

export type BusinessCategory = 
  | 'retail' 
  | 'food_service' 
  | 'professional_services' 
  | 'personal_services' 
  | 'manufacturing' 
  | 'wholesale' 
  | 'import_export' 
  | 'technology' 
  | 'healthcare' 
  | 'education' 
  | 'entertainment' 
  | 'transportation' 
  | 'construction' 
  | 'agriculture' 
  | 'energy';

export interface BusinessLocation {
  address: string;
  district: string;
  coordinates: { x: number; y: number };
  property_type: 'owned' | 'leased' | 'shared' | 'mobile' | 'online_only';
  square_footage: number;
  monthly_rent?: number;
  foot_traffic_score: number; // 0-100
  accessibility_rating: number; // 0-100
  parking_availability: boolean;
  public_transport_access: boolean;
}

export interface BusinessOwner {
  character_id?: string; // Links to character system
  name: string;
  age: number;
  experience_years: number;
  education_level: string;
  previous_businesses: number;
  management_skill: number; // 0-100
  financial_literacy: number; // 0-100
  industry_knowledge: number; // 0-100
  networking_ability: number; // 0-100
  risk_tolerance: number; // 0-100
  work_life_balance: number; // 0-100
}

export interface BusinessEmployee {
  id: string;
  character_id?: string; // Links to character system
  name: string;
  position: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'seasonal';
  hourly_wage: number;
  hours_per_week: number;
  skill_level: number; // 0-100
  productivity: number; // 0-100
  job_satisfaction: number; // 0-100
  tenure_months: number;
  benefits_package: string[];
}

export interface BusinessFinancials {
  startup_capital: number;
  current_cash: number;
  monthly_revenue: number;
  monthly_expenses: number;
  monthly_profit: number;
  outstanding_loans: Loan[];
  credit_rating: number; // 0-100
  tax_obligations: TaxObligation[];
  insurance_policies: InsurancePolicy[];
  financial_projections: FinancialProjection[];
}

export interface Loan {
  id: string;
  lender: string;
  principal_amount: number;
  remaining_balance: number;
  interest_rate: number;
  monthly_payment: number;
  term_months: number;
  remaining_months: number;
  loan_type: 'startup' | 'equipment' | 'working_capital' | 'expansion' | 'emergency';
  collateral?: string;
}

export interface TaxObligation {
  tax_type: string;
  amount_owed: number;
  due_date: Date;
  payment_status: 'pending' | 'paid' | 'overdue';
  penalty_amount?: number;
}

export interface InsurancePolicy {
  policy_type: string;
  provider: string;
  monthly_premium: number;
  coverage_amount: number;
  deductible: number;
  expiration_date: Date;
}

export interface FinancialProjection {
  period: string;
  projected_revenue: number;
  projected_expenses: number;
  projected_profit: number;
  confidence_level: number; // 0-100
}

export interface BusinessOperations {
  operating_hours: OperatingHours;
  capacity: OperationalCapacity;
  efficiency_rating: number; // 0-100
  quality_rating: number; // 0-100
  customer_service_rating: number; // 0-100
  technology_adoption: TechnologyAdoption;
  supply_chain: SupplyChainInfo;
  inventory: InventoryInfo;
  seasonal_patterns: SeasonalPattern[];
}

export interface OperatingHours {
  monday: { open: string; close: string; closed?: boolean };
  tuesday: { open: string; close: string; closed?: boolean };
  wednesday: { open: string; close: string; closed?: boolean };
  thursday: { open: string; close: string; closed?: boolean };
  friday: { open: string; close: string; closed?: boolean };
  saturday: { open: string; close: string; closed?: boolean };
  sunday: { open: string; close: string; closed?: boolean };
  holidays_closed: boolean;
  seasonal_adjustments: boolean;
}

export interface OperationalCapacity {
  max_customers_per_hour: number;
  max_orders_per_day: number;
  production_capacity: number;
  storage_capacity: number;
  current_utilization: number; // 0-100
}

export interface TechnologyAdoption {
  pos_system: boolean;
  online_presence: boolean;
  e_commerce: boolean;
  digital_payments: boolean;
  inventory_management: boolean;
  customer_relationship_management: boolean;
  social_media_marketing: boolean;
  automation_level: number; // 0-100
}

export interface SupplyChainInfo {
  primary_suppliers: number;
  backup_suppliers: number;
  local_sourcing_percentage: number;
  supply_chain_reliability: number; // 0-100
  average_delivery_time: number; // days
  inventory_turnover_rate: number;
}

export interface InventoryInfo {
  total_value: number;
  items_count: number;
  fast_moving_items: string[];
  slow_moving_items: string[];
  stockout_frequency: number; // per month
  waste_percentage: number;
}

export interface SeasonalPattern {
  season: string;
  revenue_multiplier: number;
  demand_pattern: string;
  staffing_adjustments: number;
  inventory_adjustments: number;
}

export interface ProductService {
  id: string;
  name: string;
  type: 'product' | 'service';
  category: string;
  description: string;
  price: number;
  cost_to_produce: number;
  profit_margin: number;
  popularity_score: number; // 0-100
  quality_rating: number; // 0-100
  seasonal_demand: boolean;
  customizable: boolean;
  delivery_options: string[];
  warranty_period?: number;
  certifications: string[];
}

export interface SupplierRelationship {
  supplier_id: string;
  supplier_name: string;
  supplier_type: 'manufacturer' | 'wholesaler' | 'distributor' | 'service_provider';
  products_services: string[];
  relationship_strength: number; // 0-100
  payment_terms: string;
  delivery_reliability: number; // 0-100
  quality_consistency: number; // 0-100
  price_competitiveness: number; // 0-100
  contract_end_date?: Date;
  exclusive_agreement: boolean;
}

export interface CustomerBase {
  total_customers: number;
  active_customers: number;
  new_customers_monthly: number;
  customer_retention_rate: number; // 0-100
  average_transaction_value: number;
  customer_lifetime_value: number;
  demographics: CustomerDemographics;
  satisfaction_score: number; // 0-100
  loyalty_program_members: number;
  referral_rate: number; // 0-100
}

export interface CustomerDemographics {
  age_groups: { [range: string]: number };
  income_levels: { [level: string]: number };
  geographic_distribution: { [area: string]: number };
  customer_types: { [type: string]: number };
}

export interface MarketPresence {
  market_share: number; // 0-100
  brand_recognition: number; // 0-100
  online_reviews: OnlineReviews;
  marketing_channels: MarketingChannel[];
  competitive_position: CompetitivePosition;
  growth_opportunities: GrowthOpportunity[];
}

export interface OnlineReviews {
  average_rating: number; // 0-5
  total_reviews: number;
  recent_reviews_trend: 'improving' | 'stable' | 'declining';
  response_rate: number; // 0-100
  sentiment_analysis: 'positive' | 'neutral' | 'negative';
}

export interface MarketingChannel {
  channel_type: string;
  monthly_spend: number;
  reach: number;
  conversion_rate: number; // 0-100
  roi: number;
  effectiveness_score: number; // 0-100
}

export interface CompetitivePosition {
  direct_competitors: number;
  competitive_advantage: string[];
  market_threats: string[];
  differentiation_factors: string[];
  price_positioning: 'premium' | 'competitive' | 'budget';
}

export interface GrowthOpportunity {
  opportunity_type: string;
  description: string;
  potential_revenue: number;
  investment_required: number;
  timeline_months: number;
  success_probability: number; // 0-100
  risk_level: 'low' | 'medium' | 'high';
}

export interface BusinessHealth {
  overall_score: number; // 0-100
  financial_health: number; // 0-100
  operational_health: number; // 0-100
  market_health: number; // 0-100
  owner_satisfaction: number; // 0-100
  employee_satisfaction: number; // 0-100
  customer_satisfaction: number; // 0-100
  sustainability_score: number; // 0-100
  risk_factors: RiskFactor[];
  warning_indicators: string[];
}

export interface RiskFactor {
  risk_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-100
  potential_impact: string;
  mitigation_strategies: string[];
}

export interface GrowthMetrics {
  revenue_growth_rate: number; // percentage
  customer_growth_rate: number; // percentage
  employee_growth_rate: number; // percentage
  market_share_growth: number; // percentage
  profit_margin_trend: 'improving' | 'stable' | 'declining';
  expansion_plans: ExpansionPlan[];
  scalability_score: number; // 0-100
}

export interface ExpansionPlan {
  plan_type: 'new_location' | 'new_product' | 'new_market' | 'franchise' | 'online_expansion';
  description: string;
  investment_required: number;
  timeline_months: number;
  expected_roi: number;
  feasibility_score: number; // 0-100
  status: 'planning' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
}

export interface ComplianceStatus {
  business_license: LicenseStatus;
  tax_compliance: ComplianceItem;
  health_safety: ComplianceItem;
  employment_law: ComplianceItem;
  environmental_regulations: ComplianceItem;
  industry_specific: ComplianceItem[];
  overall_compliance_score: number; // 0-100
  recent_violations: Violation[];
}

export interface LicenseStatus {
  license_number: string;
  issue_date: Date;
  expiration_date: Date;
  renewal_required: boolean;
  status: 'active' | 'expired' | 'suspended' | 'pending_renewal';
}

export interface ComplianceItem {
  area: string;
  status: 'compliant' | 'non_compliant' | 'pending_review';
  last_inspection: Date;
  next_inspection: Date;
  violations: number;
  corrective_actions: string[];
}

export interface Violation {
  violation_type: string;
  date: Date;
  severity: 'minor' | 'major' | 'critical';
  fine_amount: number;
  status: 'open' | 'resolved' | 'appealing';
  resolution_deadline: Date;
}

export interface BusinessLifecycle {
  founded_date: Date;
  current_stage: BusinessStage;
  stage_duration_months: number;
  previous_stages: StageHistory[];
  projected_next_stage: BusinessStage;
  stage_transition_probability: number; // 0-100
  lifecycle_events: LifecycleEvent[];
}

export type BusinessStage = 
  | 'startup' 
  | 'growth' 
  | 'maturity' 
  | 'expansion' 
  | 'decline' 
  | 'turnaround' 
  | 'exit';

export interface StageHistory {
  stage: BusinessStage;
  start_date: Date;
  end_date: Date;
  duration_months: number;
  key_achievements: string[];
  challenges_faced: string[];
}

export interface LifecycleEvent {
  event_type: string;
  date: Date;
  description: string;
  impact_level: 'low' | 'medium' | 'high';
  financial_impact: number;
  operational_impact: string;
  lessons_learned: string[];
}

export interface BusinessMetadata {
  created_at: Date;
  last_updated: Date;
  data_sources: string[];
  confidence_score: number; // 0-100
  update_frequency: 'real_time' | 'daily' | 'weekly' | 'monthly';
  tags: string[];
  notes: string[];
}

// Distribution Network Interfaces

export interface DistributionNetwork {
  id: string;
  name: string;
  network_type: 'local' | 'regional' | 'inter_city' | 'inter_planetary';
  coverage_area: CoverageArea;
  participants: NetworkParticipant[];
  logistics: LogisticsInfo;
  performance_metrics: NetworkMetrics;
  cost_structure: CostStructure;
  technology_integration: NetworkTechnology;
  sustainability: SustainabilityMetrics;
}

export interface CoverageArea {
  civilization_id: number;
  planets: number[];
  cities: number[];
  districts: string[];
  population_served: number;
  business_density: number;
  geographic_challenges: string[];
}

export interface NetworkParticipant {
  business_id: string;
  business_name: string;
  role: 'supplier' | 'distributor' | 'retailer' | 'logistics_provider' | 'service_provider';
  participation_level: 'core' | 'regular' | 'occasional';
  contribution_score: number; // 0-100
  reliability_rating: number; // 0-100
  joined_date: Date;
  benefits_received: string[];
  obligations: string[];
}

export interface LogisticsInfo {
  transportation_modes: TransportationMode[];
  warehouse_facilities: WarehouseFacility[];
  delivery_options: DeliveryOption[];
  average_delivery_time: number; // hours
  delivery_success_rate: number; // 0-100
  tracking_capability: boolean;
  cold_chain_capability: boolean;
  hazardous_materials_capability: boolean;
}

export interface TransportationMode {
  mode_type: 'ground' | 'air' | 'space' | 'pipeline' | 'digital';
  capacity: number;
  speed: number;
  cost_per_unit: number;
  environmental_impact: number; // 0-100
  reliability: number; // 0-100
  availability: number; // 0-100
}

export interface WarehouseFacility {
  facility_id: string;
  location: string;
  storage_capacity: number;
  current_utilization: number; // 0-100
  automation_level: number; // 0-100
  temperature_controlled: boolean;
  security_level: number; // 0-100
  operating_costs: number;
}

export interface DeliveryOption {
  option_name: string;
  delivery_time: number; // hours
  cost: number;
  reliability: number; // 0-100
  tracking_available: boolean;
  special_handling: string[];
  customer_rating: number; // 0-5
}

export interface NetworkMetrics {
  total_volume: number;
  revenue_generated: number;
  cost_efficiency: number; // 0-100
  customer_satisfaction: number; // 0-100
  on_time_delivery_rate: number; // 0-100
  damage_rate: number; // 0-100
  network_utilization: number; // 0-100
  growth_rate: number; // percentage
}

export interface CostStructure {
  transportation_costs: number;
  warehousing_costs: number;
  technology_costs: number;
  administrative_costs: number;
  insurance_costs: number;
  regulatory_costs: number;
  total_operating_costs: number;
  cost_per_transaction: number;
  profit_margin: number;
}

export interface NetworkTechnology {
  tracking_systems: boolean;
  inventory_management: boolean;
  route_optimization: boolean;
  predictive_analytics: boolean;
  automated_sorting: boolean;
  digital_payments: boolean;
  customer_portal: boolean;
  api_integration: boolean;
  blockchain_verification: boolean;
  ai_demand_forecasting: boolean;
}

export interface SustainabilityMetrics {
  carbon_footprint: number;
  energy_efficiency: number; // 0-100
  waste_reduction: number; // percentage
  renewable_energy_usage: number; // percentage
  local_sourcing_preference: number; // 0-100
  sustainability_certifications: string[];
  environmental_impact_score: number; // 0-100
}

// Business Analytics Interfaces

export interface BusinessAnalytics {
  business_id: string;
  analysis_date: Date;
  performance_indicators: PerformanceIndicator[];
  market_analysis: MarketAnalysis;
  financial_analysis: FinancialAnalysis;
  operational_analysis: OperationalAnalysis;
  competitive_analysis: CompetitiveAnalysis;
  risk_analysis: RiskAnalysis;
  recommendations: BusinessRecommendation[];
}

export interface PerformanceIndicator {
  metric_name: string;
  current_value: number;
  previous_value: number;
  target_value: number;
  trend: 'improving' | 'stable' | 'declining';
  benchmark_comparison: number; // percentage vs industry average
  importance_weight: number; // 0-100
}

export interface MarketAnalysis {
  market_size: number;
  market_growth_rate: number;
  market_trends: string[];
  customer_behavior_changes: string[];
  seasonal_factors: string[];
  economic_indicators: EconomicIndicator[];
}

export interface EconomicIndicator {
  indicator_name: string;
  current_value: number;
  impact_on_business: 'positive' | 'negative' | 'neutral';
  confidence_level: number; // 0-100
}

export interface FinancialAnalysis {
  profitability_ratios: { [ratio: string]: number };
  liquidity_ratios: { [ratio: string]: number };
  efficiency_ratios: { [ratio: string]: number };
  cash_flow_analysis: CashFlowAnalysis;
  break_even_analysis: BreakEvenAnalysis;
  financial_health_score: number; // 0-100
}

export interface CashFlowAnalysis {
  operating_cash_flow: number;
  investing_cash_flow: number;
  financing_cash_flow: number;
  net_cash_flow: number;
  cash_flow_trend: 'improving' | 'stable' | 'declining';
  cash_runway_months: number;
}

export interface BreakEvenAnalysis {
  break_even_point: number;
  current_sales_vs_breakeven: number;
  margin_of_safety: number;
  break_even_timeline: number; // months
}

export interface OperationalAnalysis {
  efficiency_metrics: { [metric: string]: number };
  capacity_utilization: number;
  quality_metrics: { [metric: string]: number };
  productivity_trends: string[];
  bottlenecks_identified: string[];
  improvement_opportunities: string[];
}

export interface CompetitiveAnalysis {
  market_position: number; // 1-10 ranking
  competitive_advantages: string[];
  competitive_disadvantages: string[];
  competitor_movements: string[];
  market_share_changes: number;
  differentiation_score: number; // 0-100
}

export interface RiskAnalysis {
  risk_categories: RiskCategory[];
  overall_risk_score: number; // 0-100
  risk_mitigation_strategies: string[];
  insurance_adequacy: number; // 0-100
  contingency_planning: number; // 0-100
}

export interface RiskCategory {
  category_name: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-100
  potential_impact: number;
  current_mitigation: string[];
  recommended_actions: string[];
}

export interface BusinessRecommendation {
  recommendation_type: 'operational' | 'financial' | 'marketing' | 'strategic' | 'compliance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  expected_benefit: string;
  implementation_cost: number;
  timeline_months: number;
  success_probability: number; // 0-100
  dependencies: string[];
  kpis_to_track: string[];
}
