/**
 * Economic Tier Evolution Interfaces
 * 
 * Type definitions for city economic development and tier progression
 */

export type EconomicTier = 
  | 'developing' 
  | 'industrial' 
  | 'advanced' 
  | 'post_scarcity';

export type DevelopmentStage = 
  | 'emerging' 
  | 'transitioning' 
  | 'established' 
  | 'mature' 
  | 'declining';

export type InfrastructureCategory = 
  | 'transportation' 
  | 'energy' 
  | 'communications' 
  | 'water_sanitation' 
  | 'healthcare' 
  | 'education' 
  | 'housing' 
  | 'commercial' 
  | 'industrial' 
  | 'research';

export interface CityEconomicProfile {
  city_id: number;
  civilization_id: number;
  planet_id: number;
  current_tier: EconomicTier;
  development_stage: DevelopmentStage;
  tier_progress: number; // 0-100, progress toward next tier
  economic_indicators: EconomicIndicators;
  infrastructure: InfrastructureProfile;
  industry_composition: IndustryComposition;
  innovation_metrics: InnovationMetrics;
  quality_of_life: QualityOfLifeMetrics;
  development_constraints: DevelopmentConstraint[];
  growth_opportunities: GrowthOpportunity[];
  tier_requirements: TierRequirements;
  development_history: DevelopmentEvent[];
  projections: DevelopmentProjection[];
  metadata: EconomicProfileMetadata;
}

export interface EconomicIndicators {
  gdp_per_capita: number;
  gdp_growth_rate: number; // percentage
  unemployment_rate: number; // percentage
  inflation_rate: number; // percentage
  productivity_index: number; // 0-100
  competitiveness_index: number; // 0-100
  economic_complexity_index: number; // 0-100
  income_inequality_gini: number; // 0-1
  poverty_rate: number; // percentage
  median_income: number;
  cost_of_living_index: number; // relative to baseline
  economic_diversification: number; // 0-100
  export_complexity: number; // 0-100
  foreign_investment_ratio: number; // percentage of GDP
  debt_to_gdp_ratio: number; // percentage
  fiscal_balance: number; // percentage of GDP
}

export interface InfrastructureProfile {
  overall_score: number; // 0-100
  categories: { [category in InfrastructureCategory]: InfrastructureMetrics };
  investment_needs: InvestmentNeed[];
  maintenance_backlog: number; // monetary value
  modernization_level: number; // 0-100
  resilience_score: number; // 0-100
  sustainability_score: number; // 0-100
  digital_infrastructure: DigitalInfrastructure;
}

export interface InfrastructureMetrics {
  quality_score: number; // 0-100
  coverage_percentage: number; // 0-100
  capacity_utilization: number; // 0-100
  maintenance_status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  last_major_upgrade: Date;
  investment_required: number;
  economic_impact: number; // multiplier effect on GDP
  citizen_satisfaction: number; // 0-100
}

export interface DigitalInfrastructure {
  internet_penetration: number; // percentage
  broadband_speed: number; // Mbps
  mobile_coverage: number; // percentage
  digital_government_services: number; // 0-100
  smart_city_integration: number; // 0-100
  cybersecurity_level: number; // 0-100
  data_center_capacity: number; // relative units
  fiber_optic_coverage: number; // percentage
}

export interface IndustryComposition {
  primary_sector: SectorMetrics; // agriculture, mining, raw materials
  secondary_sector: SectorMetrics; // manufacturing, construction
  tertiary_sector: SectorMetrics; // services, retail, finance
  quaternary_sector: SectorMetrics; // knowledge, research, information
  quinary_sector: SectorMetrics; // high-level decision making, advanced services
  emerging_sectors: EmergingSector[];
  dominant_industries: IndustryCluster[];
  industrial_diversity: number; // 0-100
  value_chain_integration: number; // 0-100
}

export interface SectorMetrics {
  gdp_contribution: number; // percentage
  employment_share: number; // percentage
  productivity_level: number; // 0-100
  growth_rate: number; // percentage
  competitiveness: number; // 0-100
  innovation_intensity: number; // 0-100
  export_orientation: number; // percentage
  foreign_investment: number; // percentage
  skill_requirements: SkillLevel[];
  technology_adoption: number; // 0-100
}

export interface EmergingSector {
  sector_name: string;
  description: string;
  current_size: number; // percentage of GDP
  growth_potential: number; // 0-100
  development_stage: 'nascent' | 'emerging' | 'growing' | 'maturing';
  key_players: string[];
  required_investments: InvestmentRequirement[];
  regulatory_needs: string[];
  skill_gaps: string[];
  market_opportunities: string[];
}

export interface IndustryCluster {
  cluster_name: string;
  industries: string[];
  employment: number;
  gdp_contribution: number;
  competitiveness_level: number; // 0-100
  innovation_activity: number; // 0-100
  export_performance: number; // 0-100
  cluster_density: number; // 0-100
  linkage_strength: number; // 0-100
  growth_trajectory: 'declining' | 'stable' | 'growing' | 'booming';
}

export type SkillLevel = 'basic' | 'intermediate' | 'advanced' | 'expert' | 'cutting_edge';

export interface InvestmentRequirement {
  category: string;
  amount: number;
  timeframe_years: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  expected_return: number; // percentage
  risk_level: number; // 0-100
}

export interface InnovationMetrics {
  innovation_index: number; // 0-100
  research_intensity: number; // R&D as percentage of GDP
  patent_applications: number; // per capita
  scientific_publications: number; // per capita
  high_tech_exports: number; // percentage of total exports
  startup_density: number; // per capita
  venture_capital_activity: number; // percentage of GDP
  university_research_quality: number; // 0-100
  industry_academia_collaboration: number; // 0-100
  innovation_ecosystem_maturity: number; // 0-100
  technology_transfer_efficiency: number; // 0-100
  intellectual_property_protection: number; // 0-100
  digital_transformation_level: number; // 0-100
  innovation_infrastructure: InnovationInfrastructure;
}

export interface InnovationInfrastructure {
  research_institutions: number;
  innovation_hubs: number;
  incubators_accelerators: number;
  technology_parks: number;
  research_funding: number; // per capita
  innovation_talent_pool: number; // 0-100
  collaboration_networks: number; // 0-100
  knowledge_spillovers: number; // 0-100
}

export interface QualityOfLifeMetrics {
  overall_index: number; // 0-100
  health_outcomes: HealthMetrics;
  education_quality: EducationMetrics;
  environmental_quality: EnvironmentalMetrics;
  social_cohesion: SocialMetrics;
  cultural_vitality: CulturalMetrics;
  safety_security: SafetyMetrics;
  housing_affordability: number; // 0-100
  work_life_balance: number; // 0-100
  civic_engagement: number; // 0-100
  social_mobility: number; // 0-100
}

export interface HealthMetrics {
  life_expectancy: number;
  infant_mortality_rate: number;
  healthcare_access: number; // 0-100
  healthcare_quality: number; // 0-100
  mental_health_support: number; // 0-100
  preventive_care_coverage: number; // 0-100
  health_infrastructure: number; // 0-100
  disease_burden: number; // 0-100, lower is better
}

export interface EducationMetrics {
  literacy_rate: number; // percentage
  education_attainment: number; // 0-100
  education_quality: number; // 0-100
  skill_match: number; // 0-100, alignment with job market
  lifelong_learning: number; // 0-100
  digital_literacy: number; // 0-100
  research_capacity: number; // 0-100
  education_innovation: number; // 0-100
}

export interface EnvironmentalMetrics {
  air_quality_index: number; // 0-100, higher is better
  water_quality: number; // 0-100
  waste_management: number; // 0-100
  green_space_ratio: number; // percentage
  carbon_footprint: number; // per capita
  renewable_energy_share: number; // percentage
  environmental_protection: number; // 0-100
  climate_resilience: number; // 0-100
}

export interface SocialMetrics {
  social_trust: number; // 0-100
  community_engagement: number; // 0-100
  social_capital: number; // 0-100
  income_equality: number; // 0-100
  social_inclusion: number; // 0-100
  civic_participation: number; // 0-100
  social_services_quality: number; // 0-100
  intergenerational_mobility: number; // 0-100
}

export interface CulturalMetrics {
  cultural_diversity: number; // 0-100
  cultural_institutions: number; // per capita
  creative_industries: number; // percentage of GDP
  cultural_participation: number; // 0-100
  heritage_preservation: number; // 0-100
  artistic_innovation: number; // 0-100
  cultural_exchange: number; // 0-100
  cultural_identity_strength: number; // 0-100
}

export interface SafetyMetrics {
  crime_rate: number; // per capita, lower is better
  public_safety: number; // 0-100
  emergency_preparedness: number; // 0-100
  disaster_resilience: number; // 0-100
  cybersecurity: number; // 0-100
  traffic_safety: number; // 0-100
  workplace_safety: number; // 0-100
  personal_security: number; // 0-100
}

export interface DevelopmentConstraint {
  constraint_type: 'resource' | 'infrastructure' | 'institutional' | 'human_capital' | 'financial' | 'environmental' | 'political';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact_areas: string[];
  estimated_cost_to_address: number;
  timeframe_to_resolve: number; // years
  probability_of_resolution: number; // 0-100
  mitigation_strategies: string[];
  stakeholders_involved: string[];
}

export interface GrowthOpportunity {
  opportunity_type: 'sector_development' | 'infrastructure_investment' | 'innovation_hub' | 'trade_expansion' | 'human_capital' | 'institutional_reform';
  title: string;
  description: string;
  potential_impact: number; // 0-100
  investment_required: number;
  timeframe_years: number;
  success_probability: number; // 0-100
  risk_factors: string[];
  key_enablers: string[];
  expected_outcomes: ExpectedOutcome[];
  stakeholder_alignment: number; // 0-100
}

export interface ExpectedOutcome {
  outcome_type: string;
  quantitative_target: number;
  measurement_unit: string;
  timeframe_years: number;
  confidence_level: number; // 0-100
}

export interface TierRequirements {
  target_tier: EconomicTier;
  requirements: TierRequirement[];
  overall_progress: number; // 0-100
  estimated_completion_years: number;
  critical_path_items: string[];
  resource_needs: ResourceNeed[];
}

export interface TierRequirement {
  requirement_id: string;
  category: 'economic' | 'infrastructure' | 'innovation' | 'social' | 'environmental' | 'institutional';
  description: string;
  current_value: number;
  target_value: number;
  unit: string;
  progress: number; // 0-100
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[];
  estimated_cost: number;
  timeframe_years: number;
}

export interface ResourceNeed {
  resource_type: 'financial' | 'human' | 'technological' | 'natural' | 'institutional';
  description: string;
  quantity_needed: number;
  unit: string;
  availability: number; // 0-100
  cost: number;
  acquisition_strategy: string;
  timeline_months: number;
}

export interface DevelopmentEvent {
  event_id: string;
  event_type: 'policy_change' | 'infrastructure_project' | 'economic_shock' | 'innovation_breakthrough' | 'social_change' | 'environmental_event';
  title: string;
  description: string;
  date: Date;
  impact_magnitude: number; // -100 to 100
  affected_indicators: string[];
  long_term_effects: string[];
  lessons_learned: string[];
  stakeholders_involved: string[];
}

export interface DevelopmentProjection {
  projection_id: string;
  scenario_name: string;
  probability: number; // 0-100
  timeframe_years: number;
  projected_tier: EconomicTier;
  key_assumptions: string[];
  projected_indicators: { [indicator: string]: number };
  critical_success_factors: string[];
  major_risks: string[];
  policy_recommendations: string[];
}

export interface EconomicProfileMetadata {
  last_updated: Date;
  data_sources: string[];
  confidence_score: number; // 0-100
  methodology_version: string;
  next_assessment_date: Date;
  responsible_analysts: string[];
  peer_review_status: 'pending' | 'approved' | 'needs_revision';
  data_quality_flags: string[];
}

// Tier-specific definitions

export interface TierDefinition {
  tier: EconomicTier;
  name: string;
  description: string;
  typical_characteristics: TierCharacteristics;
  advancement_criteria: AdvancementCriteria;
  common_challenges: string[];
  development_strategies: string[];
  benchmark_cities: string[];
  transition_pathways: TransitionPathway[];
}

export interface TierCharacteristics {
  gdp_per_capita_range: [number, number];
  dominant_sectors: string[];
  infrastructure_level: number; // 0-100
  innovation_intensity: number; // 0-100
  quality_of_life: number; // 0-100
  economic_complexity: number; // 0-100
  sustainability_level: number; // 0-100
  typical_population_range: [number, number];
  governance_maturity: number; // 0-100
}

export interface AdvancementCriteria {
  minimum_requirements: { [indicator: string]: number };
  weighted_scoring: { [indicator: string]: number };
  threshold_score: number;
  sustained_performance_years: number;
  qualitative_assessments: string[];
}

export interface TransitionPathway {
  pathway_name: string;
  description: string;
  typical_duration_years: number;
  key_milestones: Milestone[];
  success_rate: number; // 0-100
  common_obstacles: string[];
  enabling_factors: string[];
  resource_intensity: 'low' | 'medium' | 'high' | 'very_high';
}

export interface Milestone {
  milestone_name: string;
  description: string;
  target_indicators: { [indicator: string]: number };
  typical_timeframe_years: number;
  critical_success_factors: string[];
  measurement_criteria: string[];
}

// Economic Tier Evolution Engine

export interface TierEvolutionEngine {
  assessCurrentTier(cityProfile: CityEconomicProfile): EconomicTier;
  calculateTierProgress(cityProfile: CityEconomicProfile): number;
  identifyDevelopmentConstraints(cityProfile: CityEconomicProfile): DevelopmentConstraint[];
  recommendGrowthOpportunities(cityProfile: CityEconomicProfile): GrowthOpportunity[];
  projectDevelopmentTrajectory(cityProfile: CityEconomicProfile, years: number): DevelopmentProjection[];
  simulatePolicyImpact(cityProfile: CityEconomicProfile, policyChanges: PolicyChange[]): PolicyImpactAssessment;
  benchmarkAgainstPeers(cityProfile: CityEconomicProfile): BenchmarkAnalysis;
  generateDevelopmentPlan(cityProfile: CityEconomicProfile, targetTier: EconomicTier): DevelopmentPlan;
}

export interface PolicyChange {
  policy_area: string;
  change_description: string;
  implementation_cost: number;
  timeframe_years: number;
  expected_impact: { [indicator: string]: number };
  uncertainty_level: number; // 0-100
}

export interface PolicyImpactAssessment {
  overall_impact_score: number; // -100 to 100
  affected_indicators: { [indicator: string]: number };
  tier_advancement_probability: number; // 0-100
  cost_benefit_ratio: number;
  implementation_challenges: string[];
  unintended_consequences: string[];
  stakeholder_reactions: { [stakeholder: string]: number }; // -100 to 100
}

export interface BenchmarkAnalysis {
  peer_cities: PeerCityComparison[];
  relative_performance: { [indicator: string]: number }; // percentile ranking
  best_practices: BestPractice[];
  performance_gaps: PerformanceGap[];
  competitive_advantages: string[];
  improvement_priorities: string[];
}

export interface PeerCityComparison {
  city_name: string;
  similarity_score: number; // 0-100
  key_differences: string[];
  performance_comparison: { [indicator: string]: number };
  lessons_applicable: string[];
}

export interface BestPractice {
  practice_name: string;
  description: string;
  implementing_cities: string[];
  impact_achieved: { [indicator: string]: number };
  implementation_requirements: string[];
  adaptation_considerations: string[];
  success_factors: string[];
}

export interface PerformanceGap {
  indicator: string;
  current_value: number;
  peer_average: number;
  best_performer_value: number;
  gap_significance: 'minor' | 'moderate' | 'major' | 'critical';
  improvement_potential: number;
  recommended_actions: string[];
}

export interface DevelopmentPlan {
  plan_id: string;
  target_tier: EconomicTier;
  planning_horizon_years: number;
  strategic_objectives: StrategicObjective[];
  implementation_phases: ImplementationPhase[];
  resource_mobilization: ResourceMobilizationPlan;
  risk_management: RiskManagementPlan;
  monitoring_framework: MonitoringFramework;
  stakeholder_engagement: StakeholderEngagementPlan;
}

export interface StrategicObjective {
  objective_id: string;
  title: string;
  description: string;
  target_indicators: { [indicator: string]: number };
  timeframe_years: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  responsible_entities: string[];
  success_metrics: string[];
}

export interface ImplementationPhase {
  phase_number: number;
  phase_name: string;
  duration_years: number;
  key_initiatives: Initiative[];
  milestones: Milestone[];
  resource_requirements: ResourceRequirement[];
  success_criteria: string[];
}

export interface Initiative {
  initiative_id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  timeframe_months: number;
  expected_outcomes: ExpectedOutcome[];
  implementation_steps: string[];
  risk_factors: string[];
}

export interface ResourceRequirement {
  resource_type: string;
  quantity: number;
  unit: string;
  cost: number;
  source: string;
  availability_timeline: string;
}

export interface ResourceMobilizationPlan {
  total_investment_required: number;
  funding_sources: FundingSource[];
  financing_strategy: string;
  public_private_partnerships: PPPOpportunity[];
  international_cooperation: string[];
  capacity_building_needs: string[];
}

export interface FundingSource {
  source_name: string;
  source_type: 'public' | 'private' | 'international' | 'multilateral';
  amount: number;
  terms_conditions: string;
  probability_of_securing: number; // 0-100
  timeline_months: number;
}

export interface PPPOpportunity {
  project_name: string;
  sector: string;
  investment_size: number;
  private_sector_role: string;
  public_sector_role: string;
  risk_sharing_arrangement: string;
  expected_returns: number;
}

export interface RiskManagementPlan {
  identified_risks: DevelopmentRisk[];
  mitigation_strategies: MitigationStrategy[];
  contingency_plans: ContingencyPlan[];
  monitoring_indicators: string[];
  escalation_procedures: string[];
}

export interface DevelopmentRisk {
  risk_id: string;
  risk_category: string;
  description: string;
  probability: number; // 0-100
  impact_severity: number; // 0-100
  affected_objectives: string[];
  early_warning_signs: string[];
}

export interface MitigationStrategy {
  strategy_id: string;
  target_risks: string[];
  description: string;
  implementation_cost: number;
  effectiveness: number; // 0-100
  responsible_parties: string[];
  timeline: string;
}

export interface ContingencyPlan {
  plan_id: string;
  trigger_conditions: string[];
  alternative_actions: string[];
  resource_reallocation: string;
  timeline_adjustments: string;
  stakeholder_communication: string;
}

export interface MonitoringFramework {
  key_performance_indicators: KPI[];
  data_collection_methods: string[];
  reporting_frequency: string;
  responsible_agencies: string[];
  review_mechanisms: string[];
  adaptive_management_protocols: string[];
}

export interface KPI {
  indicator_name: string;
  measurement_unit: string;
  baseline_value: number;
  target_value: number;
  data_source: string;
  collection_frequency: string;
  responsible_party: string;
}

export interface StakeholderEngagementPlan {
  stakeholder_groups: StakeholderGroup[];
  engagement_strategies: EngagementStrategy[];
  communication_channels: string[];
  feedback_mechanisms: string[];
  conflict_resolution_procedures: string[];
  participation_frameworks: string[];
}

export interface StakeholderGroup {
  group_name: string;
  interests: string[];
  influence_level: number; // 0-100
  support_level: number; // -100 to 100
  engagement_priority: 'low' | 'medium' | 'high' | 'critical';
  preferred_communication: string[];
}

export interface EngagementStrategy {
  strategy_name: string;
  target_stakeholders: string[];
  objectives: string[];
  methods: string[];
  frequency: string;
  success_metrics: string[];
}
