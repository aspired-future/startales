import { Pool } from 'pg';

// Core Economic Ecosystem Types
export interface ProductCategory {
  id: number;
  category_name: string;
  strategic_importance: 'low' | 'medium' | 'high' | 'critical';
  track_individually: boolean;
  description?: string;
  technology_level: number;
  created_at: Date;
}

export interface Product {
  id: number;
  category_id: number;
  product_name: string;
  description: string;
  technology_level: number;
  unit_price: number;
  complexity_score: number;
  created_at: Date;
}

export interface Material {
  id: number;
  material_name: string;
  category: 'raw_materials' | 'components' | 'energy_sources' | 'biological' | 'information';
  extraction_difficulty: number;
  strategic_value: number;
  base_price: number;
  availability_score: number;
  created_at: Date;
}

export interface ProductionChain {
  id: number;
  product_id: number;
  corporation_id: number;
  location_id: number;
  input_materials: MaterialRequirement[];
  output_quantity: number;
  production_time: number;
  skill_requirements: SkillRequirement[];
  efficiency_rating: number;
  capacity_utilization: number;
  created_at: Date;
}

export interface MaterialRequirement {
  material_id: number;
  quantity_per_unit: number;
  quality_grade: 'low' | 'medium' | 'high' | 'military';
  source_preference: 'domestic' | 'import' | 'either';
}

export interface SkillRequirement {
  skill_category: string;
  specific_skill: string;
  proficiency_level: number;
  workers_needed: number;
}

export interface CityMarket {
  id: number;
  city_id: number;
  planet_id: number;
  civilization_id: number;
  city_name: string;
  population: number;
  economic_tier: 'developing' | 'industrial' | 'advanced' | 'post_scarcity';
  gdp_per_capita: number;
  infrastructure_level: number;
  created_at: Date;
}

export interface MarketDemand {
  id: number;
  market_id: number;
  product_id: number;
  base_demand: number;
  current_price: number;
  price_elasticity: number;
  seasonal_factors: SeasonalFactor[];
  growth_rate: number;
  satisfaction_level: number;
  last_updated: Date;
}

export interface MarketSupply {
  id: number;
  market_id: number;
  product_id: number;
  domestic_production: number;
  import_quantity: number;
  inventory_level: number;
  production_capacity: number;
  supply_elasticity: number;
  quality_average: number;
  last_updated: Date;
}

export interface SeasonalFactor {
  month: number;
  demand_multiplier: number;
  reason: string;
}

export interface TradePolicy {
  id: number;
  source_civilization_id: number;
  target_civilization_id: number;
  general_tariff_rate: number;
  diplomatic_modifier: number;
  economic_relationship: 'ally' | 'neutral' | 'competitor' | 'hostile';
  effective_date: Date;
  expiry_date?: Date;
  created_at: Date;
}

export interface ProductTradePolicy {
  id: number;
  trade_policy_id: number;
  product_category_id: number;
  import_policy: 'allowed' | 'restricted' | 'banned';
  export_policy: 'allowed' | 'license_required' | 'banned';
  tariff_rate: number;
  strategic_importance: 'low' | 'medium' | 'high' | 'critical';
  domestic_protection_level: number;
}

export interface CorporationTemplate {
  id: number;
  sector: string;
  size_category: 'startup' | 'small' | 'medium' | 'large' | 'mega_corp';
  business_model: string;
  geographic_scope: 'local' | 'planetary' | 'system' | 'galactic';
  name_patterns: NamePattern[];
  product_categories: number[];
  skill_requirements: string[];
  success_probability: number;
  growth_potential: number;
}

export interface NamePattern {
  type: 'prefix' | 'suffix' | 'descriptor' | 'tech_term';
  values: string[];
  weight: number;
}

export interface LeaderTemplate {
  id: number;
  personality_archetype: string;
  leadership_style: string;
  background_category: string;
  name_generators: NameGenerator[];
  backstory_templates: BackstoryTemplate[];
  communication_patterns: CommunicationPattern[];
  influence_potential: number;
}

export interface NameGenerator {
  type: 'first_name' | 'last_name' | 'title';
  cultural_origin: string;
  values: string[];
}

export interface BackstoryTemplate {
  template: string;
  variables: string[];
  personality_fit: number;
}

export interface CommunicationPattern {
  style: string;
  typical_phrases: string[];
  response_patterns: string[];
}

export interface LocationSkills {
  id: number;
  city_id: number;
  skill_category: string;
  specific_skill: string;
  availability_level: 'scarce' | 'limited' | 'adequate' | 'abundant';
  average_cost: number;
  quality_level: number;
  brain_drain_rate: number;
  development_rate: number;
  last_updated: Date;
}

export interface GovernmentContract {
  id: number;
  civilization_id: number;
  issuing_department: string;
  contract_type: 'weapons' | 'infrastructure' | 'services' | 'research';
  requirements: ContractRequirement[];
  domestic_preference: boolean;
  security_clearance_required: boolean;
  contract_value: number;
  bidding_deadline: Date;
  delivery_deadline: Date;
  awarded_corporation_id?: number;
  contract_status: 'open' | 'bidding' | 'awarded' | 'completed' | 'cancelled';
  created_at: Date;
}

export interface ContractRequirement {
  product_id: number;
  quantity: number;
  quality_standards: string[];
  delivery_milestones: DeliveryMilestone[];
}

export interface DeliveryMilestone {
  milestone_name: string;
  delivery_date: Date;
  quantity: number;
  payment_percentage: number;
}

export interface IndustryStatistics {
  id: number;
  civilization_id: number;
  sector: string;
  reporting_period: Date;
  total_revenue: number;
  employment: number;
  number_of_companies: number;
  export_value: number;
  import_value: number;
  growth_rate: number;
  productivity_index: number;
  competitiveness_score: number;
  created_at: Date;
}

export interface TradePact {
  id: number;
  pact_name: string;
  pact_type: 'free_trade' | 'customs_union' | 'economic_partnership' | 'strategic_alliance' | 'bilateral_investment' | 'technology_sharing';
  member_civilizations: number[];
  lead_negotiator_civilization: number;
  status: 'negotiating' | 'pending_ratification' | 'active' | 'suspended' | 'terminated';
  negotiation_start_date: Date;
  ratification_date?: Date;
  effective_date?: Date;
  expiry_date?: Date;
  terms_and_conditions: TradePactTerms;
  economic_benefits: EconomicBenefits;
  obligations: TradePactObligations;
  dispute_resolution: DisputeResolution;
  created_at: Date;
}

export interface TradePactTerms {
  tariff_reductions: TariffReduction[];
  market_access_provisions: MarketAccess[];
  investment_protections: InvestmentProtection[];
  intellectual_property_rules: IPProtection[];
  labor_mobility: LaborMobility[];
  environmental_standards: EnvironmentalStandard[];
  dispute_mechanisms: string[];
}

export interface TariffReduction {
  product_category: string;
  current_tariff: number;
  target_tariff: number;
  reduction_timeline: number; // months
  exceptions: string[];
}

export interface MarketAccess {
  sector: string;
  access_level: 'full' | 'limited' | 'restricted';
  quotas: number;
  licensing_requirements: string[];
  local_content_requirements: number;
}

export interface InvestmentProtection {
  protection_type: 'national_treatment' | 'most_favored_nation' | 'fair_equitable_treatment' | 'expropriation_protection';
  coverage_sectors: string[];
  exceptions: string[];
  dispute_resolution: string;
}

export interface IPProtection {
  ip_type: 'patents' | 'trademarks' | 'copyrights' | 'trade_secrets' | 'industrial_designs';
  protection_level: 'basic' | 'enhanced' | 'comprehensive';
  enforcement_mechanisms: string[];
  technology_transfer_rules: string[];
}

export interface LaborMobility {
  skill_category: string;
  mobility_level: 'visa_free' | 'simplified_visa' | 'work_permits' | 'restricted';
  quota_limits: number;
  qualification_recognition: boolean;
}

export interface EnvironmentalStandard {
  standard_type: 'emissions' | 'waste_management' | 'resource_conservation' | 'biodiversity';
  compliance_level: 'basic' | 'intermediate' | 'advanced';
  monitoring_mechanisms: string[];
  penalties: string[];
}

export interface EconomicBenefits {
  estimated_trade_increase: number; // percentage
  gdp_impact: number; // percentage
  employment_impact: number; // jobs created/lost
  investment_flows: number; // expected investment increase
  cost_savings: number; // reduced trade costs
  market_expansion: MarketExpansion[];
}

export interface MarketExpansion {
  sector: string;
  market_size_increase: number;
  new_opportunities: string[];
  competitive_advantages: string[];
}

export interface TradePactObligations {
  regulatory_harmonization: RegulatoryHarmonization[];
  compliance_requirements: ComplianceRequirement[];
  reporting_obligations: ReportingObligation[];
  financial_contributions: FinancialContribution[];
  policy_constraints: PolicyConstraint[];
}

export interface RegulatoryHarmonization {
  regulation_area: string;
  harmonization_level: 'full' | 'partial' | 'mutual_recognition';
  implementation_timeline: number; // months
  compliance_cost: number;
}

export interface ComplianceRequirement {
  requirement_type: string;
  compliance_deadline: Date;
  monitoring_frequency: 'monthly' | 'quarterly' | 'annually';
  penalties_for_non_compliance: string[];
}

export interface ReportingObligation {
  report_type: string;
  reporting_frequency: 'monthly' | 'quarterly' | 'annually';
  data_requirements: string[];
  submission_deadline: string;
}

export interface FinancialContribution {
  contribution_type: 'membership_fee' | 'development_fund' | 'dispute_resolution' | 'administrative_costs';
  amount: number;
  payment_frequency: 'one_time' | 'annual' | 'quarterly';
  calculation_method: string;
}

export interface PolicyConstraint {
  policy_area: string;
  constraint_type: 'prohibition' | 'limitation' | 'notification_requirement';
  description: string;
  exceptions: string[];
}

export interface DisputeResolution {
  mechanism_type: 'arbitration' | 'mediation' | 'judicial' | 'diplomatic';
  governing_body: string;
  resolution_timeline: number; // days
  appeal_process: boolean;
  enforcement_mechanisms: string[];
}

export interface TradePactNegotiation {
  id: number;
  pact_id: number;
  negotiation_round: number;
  participating_civilizations: number[];
  negotiation_status: 'preparing' | 'active' | 'paused' | 'concluded' | 'failed';
  current_issues: NegotiationIssue[];
  proposed_terms: TradePactTerms;
  negotiator_positions: NegotiatorPosition[];
  deadlines: NegotiationDeadline[];
  created_at: Date;
}

export interface NegotiationIssue {
  issue_type: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'unresolved' | 'under_discussion' | 'tentative_agreement' | 'resolved';
  positions: { [civilization_id: number]: string };
}

export interface NegotiatorPosition {
  civilization_id: number;
  negotiator_name: string;
  position_title: string;
  negotiation_style: 'cooperative' | 'competitive' | 'accommodating' | 'compromising' | 'avoiding';
  key_priorities: string[];
  red_lines: string[];
}

export interface NegotiationDeadline {
  milestone: string;
  deadline_date: Date;
  status: 'upcoming' | 'met' | 'missed' | 'extended';
  consequences: string[];
}

// Initialize Economic Ecosystem Schema
export async function initializeEconomicEcosystemSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create product_categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_categories (
        id SERIAL PRIMARY KEY,
        category_name VARCHAR(100) NOT NULL UNIQUE,
        strategic_importance VARCHAR(20) DEFAULT 'low' CHECK (strategic_importance IN ('low', 'medium', 'high', 'critical')),
        track_individually BOOLEAN DEFAULT false,
        description TEXT,
        technology_level INTEGER DEFAULT 1 CHECK (technology_level >= 1 AND technology_level <= 10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES product_categories(id),
        product_name VARCHAR(200) NOT NULL,
        description TEXT,
        technology_level INTEGER DEFAULT 1 CHECK (technology_level >= 1 AND technology_level <= 10),
        unit_price DECIMAL(12,4) DEFAULT 0,
        complexity_score INTEGER DEFAULT 1 CHECK (complexity_score >= 1 AND complexity_score <= 10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(category_id, product_name)
      )
    `);

    // Create materials table
    await client.query(`
      CREATE TABLE IF NOT EXISTS materials (
        id SERIAL PRIMARY KEY,
        material_name VARCHAR(200) NOT NULL UNIQUE,
        category VARCHAR(50) NOT NULL CHECK (category IN ('raw_materials', 'components', 'energy_sources', 'biological', 'information')),
        extraction_difficulty INTEGER DEFAULT 1 CHECK (extraction_difficulty >= 1 AND extraction_difficulty <= 10),
        strategic_value INTEGER DEFAULT 1 CHECK (strategic_value >= 1 AND strategic_value <= 10),
        base_price DECIMAL(12,4) DEFAULT 0,
        availability_score INTEGER DEFAULT 5 CHECK (availability_score >= 1 AND availability_score <= 10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create production_chains table
    await client.query(`
      CREATE TABLE IF NOT EXISTS production_chains (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id),
        corporation_id INTEGER REFERENCES listed_companies(id),
        location_id INTEGER NOT NULL,
        
        input_materials JSONB NOT NULL,
        output_quantity INTEGER NOT NULL CHECK (output_quantity > 0),
        production_time INTEGER NOT NULL CHECK (production_time > 0),
        skill_requirements JSONB,
        
        efficiency_rating DECIMAL(4,2) DEFAULT 1.0 CHECK (efficiency_rating > 0 AND efficiency_rating <= 2.0),
        capacity_utilization DECIMAL(4,2) DEFAULT 0.8 CHECK (capacity_utilization >= 0 AND capacity_utilization <= 1.0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create city_markets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS economic_city_markets (
        id SERIAL PRIMARY KEY,
        city_id INTEGER NOT NULL,
        planet_id INTEGER NOT NULL,
        civilization_id TEXT NOT NULL,
        city_name VARCHAR(200) NOT NULL,
        
        population INTEGER NOT NULL CHECK (population > 0),
        economic_tier VARCHAR(20) DEFAULT 'industrial' CHECK (economic_tier IN ('developing', 'industrial', 'advanced', 'post_scarcity')),
        gdp_per_capita DECIMAL(12,2) DEFAULT 50000,
        infrastructure_level INTEGER DEFAULT 5 CHECK (infrastructure_level >= 1 AND infrastructure_level <= 10),
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(city_id, planet_id, civilization_id)
      )
    `);

    // Create market_demand table
    await client.query(`
      CREATE TABLE IF NOT EXISTS market_demand (
        id SERIAL PRIMARY KEY,
        market_id INTEGER REFERENCES economic_city_markets(id),
        product_id INTEGER REFERENCES products(id),
        
        base_demand INTEGER NOT NULL CHECK (base_demand >= 0),
        current_price DECIMAL(12,4) DEFAULT 0,
        price_elasticity DECIMAL(6,4) DEFAULT -1.0,
        
        seasonal_factors JSONB,
        growth_rate DECIMAL(6,4) DEFAULT 0.02,
        satisfaction_level DECIMAL(4,2) DEFAULT 0.5 CHECK (satisfaction_level >= 0 AND satisfaction_level <= 1.0),
        
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(market_id, product_id)
      )
    `);

    // Create market_supply table
    await client.query(`
      CREATE TABLE IF NOT EXISTS market_supply (
        id SERIAL PRIMARY KEY,
        market_id INTEGER REFERENCES economic_city_markets(id),
        product_id INTEGER REFERENCES products(id),
        
        domestic_production INTEGER DEFAULT 0 CHECK (domestic_production >= 0),
        import_quantity INTEGER DEFAULT 0 CHECK (import_quantity >= 0),
        inventory_level INTEGER DEFAULT 0 CHECK (inventory_level >= 0),
        
        production_capacity INTEGER DEFAULT 0 CHECK (production_capacity >= 0),
        supply_elasticity DECIMAL(6,4) DEFAULT 1.0,
        quality_average DECIMAL(4,2) DEFAULT 5.0 CHECK (quality_average >= 1.0 AND quality_average <= 10.0),
        
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(market_id, product_id)
      )
    `);

    // Create trade_policies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trade_policies (
        id SERIAL PRIMARY KEY,
        source_civilization_id TEXT NOT NULL,
        target_civilization_id TEXT NOT NULL,
        
        general_tariff_rate DECIMAL(6,4) DEFAULT 0.0 CHECK (general_tariff_rate >= 0),
        diplomatic_modifier DECIMAL(4,2) DEFAULT 1.0 CHECK (diplomatic_modifier > 0),
        economic_relationship VARCHAR(20) DEFAULT 'neutral' CHECK (economic_relationship IN ('ally', 'neutral', 'competitor', 'hostile')),
        
        effective_date DATE NOT NULL,
        expiry_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        CHECK (expiry_date IS NULL OR expiry_date > effective_date),
        UNIQUE(source_civilization_id, target_civilization_id, effective_date)
      )
    `);

    // Create product_trade_policies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_trade_policies (
        id SERIAL PRIMARY KEY,
        trade_policy_id INTEGER REFERENCES trade_policies(id),
        product_category_id INTEGER REFERENCES product_categories(id),
        
        import_policy VARCHAR(20) DEFAULT 'allowed' CHECK (import_policy IN ('allowed', 'restricted', 'banned')),
        export_policy VARCHAR(20) DEFAULT 'allowed' CHECK (export_policy IN ('allowed', 'license_required', 'banned')),
        tariff_rate DECIMAL(6,4) DEFAULT 0.0 CHECK (tariff_rate >= 0),
        
        strategic_importance VARCHAR(20) DEFAULT 'low' CHECK (strategic_importance IN ('low', 'medium', 'high', 'critical')),
        domestic_protection_level DECIMAL(4,2) DEFAULT 0.0 CHECK (domestic_protection_level >= 0 AND domestic_protection_level <= 1.0),
        
        UNIQUE(trade_policy_id, product_category_id)
      )
    `);

    // Create corporation_templates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS corporation_templates (
        id SERIAL PRIMARY KEY,
        sector VARCHAR(50) NOT NULL,
        size_category VARCHAR(20) NOT NULL CHECK (size_category IN ('startup', 'small', 'medium', 'large', 'mega_corp')),
        business_model VARCHAR(50) NOT NULL,
        geographic_scope VARCHAR(20) DEFAULT 'planetary' CHECK (geographic_scope IN ('local', 'planetary', 'system', 'galactic')),
        
        name_patterns JSONB NOT NULL,
        product_categories JSONB NOT NULL,
        skill_requirements JSONB NOT NULL,
        
        success_probability DECIMAL(4,2) DEFAULT 0.5 CHECK (success_probability >= 0 AND success_probability <= 1.0),
        growth_potential DECIMAL(4,2) DEFAULT 1.0 CHECK (growth_potential > 0)
      )
    `);

    // Create leader_templates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leader_templates (
        id SERIAL PRIMARY KEY,
        personality_archetype VARCHAR(50) NOT NULL,
        leadership_style VARCHAR(50) NOT NULL,
        background_category VARCHAR(50) NOT NULL,
        
        name_generators JSONB NOT NULL,
        backstory_templates JSONB NOT NULL,
        communication_patterns JSONB NOT NULL,
        
        influence_potential DECIMAL(4,2) DEFAULT 5.0 CHECK (influence_potential >= 1.0 AND influence_potential <= 10.0)
      )
    `);

    // Create location_skills table
    await client.query(`
      CREATE TABLE IF NOT EXISTS location_skills (
        id SERIAL PRIMARY KEY,
        city_id INTEGER NOT NULL,
        skill_category VARCHAR(50) NOT NULL,
        specific_skill VARCHAR(100) NOT NULL,
        
        availability_level VARCHAR(20) DEFAULT 'adequate' CHECK (availability_level IN ('scarce', 'limited', 'adequate', 'abundant')),
        average_cost DECIMAL(12,2) DEFAULT 50000,
        quality_level DECIMAL(4,2) DEFAULT 5.0 CHECK (quality_level >= 1.0 AND quality_level <= 10.0),
        
        brain_drain_rate DECIMAL(6,4) DEFAULT 0.0 CHECK (brain_drain_rate >= -1.0 AND brain_drain_rate <= 1.0),
        development_rate DECIMAL(6,4) DEFAULT 0.02 CHECK (development_rate >= -0.5 AND development_rate <= 0.5),
        
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(city_id, skill_category, specific_skill)
      )
    `);

    // Create government_contracts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS government_contracts (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL,
        issuing_department VARCHAR(100) NOT NULL,
        contract_type VARCHAR(50) NOT NULL CHECK (contract_type IN ('weapons', 'infrastructure', 'services', 'research')),
        
        requirements JSONB NOT NULL,
        domestic_preference BOOLEAN DEFAULT true,
        security_clearance_required BOOLEAN DEFAULT false,
        
        contract_value DECIMAL(20,2) NOT NULL CHECK (contract_value > 0),
        bidding_deadline DATE NOT NULL,
        delivery_deadline DATE NOT NULL,
        
        awarded_corporation_id INTEGER REFERENCES listed_companies(id),
        contract_status VARCHAR(20) DEFAULT 'open' CHECK (contract_status IN ('open', 'bidding', 'awarded', 'completed', 'cancelled')),
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (delivery_deadline > bidding_deadline)
      )
    `);

    // Create industry_statistics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS industry_statistics (
        id SERIAL PRIMARY KEY,
        civilization_id TEXT NOT NULL,
        sector VARCHAR(50) NOT NULL,
        reporting_period DATE NOT NULL,
        
        total_revenue DECIMAL(20,2) NOT NULL CHECK (total_revenue >= 0),
        employment INTEGER NOT NULL CHECK (employment >= 0),
        number_of_companies INTEGER NOT NULL CHECK (number_of_companies >= 0),
        
        export_value DECIMAL(20,2) DEFAULT 0 CHECK (export_value >= 0),
        import_value DECIMAL(20,2) DEFAULT 0 CHECK (import_value >= 0),
        
        growth_rate DECIMAL(6,4),
        productivity_index DECIMAL(6,2) DEFAULT 100.0,
        competitiveness_score DECIMAL(4,2) DEFAULT 5.0 CHECK (competitiveness_score >= 1.0 AND competitiveness_score <= 10.0),
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(civilization_id, sector, reporting_period)
      )
    `);

    // Create trade_pacts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trade_pacts (
        id SERIAL PRIMARY KEY,
        pact_name VARCHAR(200) NOT NULL,
        pact_type VARCHAR(50) NOT NULL CHECK (pact_type IN ('free_trade', 'customs_union', 'economic_partnership', 'strategic_alliance', 'bilateral_investment', 'technology_sharing')),
        member_civilizations JSONB NOT NULL,
        lead_negotiator_civilization INTEGER NOT NULL,
        
        status VARCHAR(30) DEFAULT 'negotiating' CHECK (status IN ('negotiating', 'pending_ratification', 'active', 'suspended', 'terminated')),
        negotiation_start_date DATE NOT NULL,
        ratification_date DATE,
        effective_date DATE,
        expiry_date DATE,
        
        terms_and_conditions JSONB NOT NULL,
        economic_benefits JSONB NOT NULL,
        obligations JSONB NOT NULL,
        dispute_resolution JSONB NOT NULL,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        CHECK (ratification_date IS NULL OR ratification_date >= negotiation_start_date),
        CHECK (effective_date IS NULL OR effective_date >= ratification_date),
        CHECK (expiry_date IS NULL OR expiry_date > effective_date)
      )
    `);

    // Create trade_pact_negotiations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trade_pact_negotiations (
        id SERIAL PRIMARY KEY,
        pact_id INTEGER REFERENCES trade_pacts(id),
        negotiation_round INTEGER NOT NULL DEFAULT 1,
        participating_civilizations JSONB NOT NULL,
        
        negotiation_status VARCHAR(30) DEFAULT 'preparing' CHECK (negotiation_status IN ('preparing', 'active', 'paused', 'concluded', 'failed')),
        current_issues JSONB,
        proposed_terms JSONB,
        negotiator_positions JSONB,
        deadlines JSONB,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create trade_pact_compliance table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trade_pact_compliance (
        id SERIAL PRIMARY KEY,
        pact_id INTEGER REFERENCES trade_pacts(id),
        civilization_id TEXT NOT NULL,
        compliance_period DATE NOT NULL,
        
        overall_compliance_score DECIMAL(4,2) DEFAULT 0.0 CHECK (overall_compliance_score >= 0.0 AND overall_compliance_score <= 10.0),
        tariff_compliance DECIMAL(4,2) DEFAULT 0.0,
        market_access_compliance DECIMAL(4,2) DEFAULT 0.0,
        regulatory_compliance DECIMAL(4,2) DEFAULT 0.0,
        reporting_compliance DECIMAL(4,2) DEFAULT 0.0,
        
        violations JSONB,
        penalties_applied JSONB,
        corrective_actions JSONB,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(pact_id, civilization_id, compliance_period)
      )
    `);

    // Create trade_pact_disputes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trade_pact_disputes (
        id SERIAL PRIMARY KEY,
        pact_id INTEGER REFERENCES trade_pacts(id),
        complainant_civilization INTEGER NOT NULL,
        respondent_civilization INTEGER NOT NULL,
        
        dispute_type VARCHAR(100) NOT NULL,
        dispute_description TEXT NOT NULL,
        dispute_status VARCHAR(30) DEFAULT 'filed' CHECK (dispute_status IN ('filed', 'under_review', 'mediation', 'arbitration', 'resolved', 'dismissed')),
        
        filing_date DATE NOT NULL,
        resolution_deadline DATE,
        resolution_date DATE,
        resolution_outcome TEXT,
        
        economic_impact DECIMAL(20,2) DEFAULT 0,
        penalties_imposed JSONB,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for performance - split into smaller chunks to identify failures
    try {
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
        CREATE INDEX IF NOT EXISTS idx_production_chains_product ON production_chains(product_id);
        CREATE INDEX IF NOT EXISTS idx_production_chains_corporation ON production_chains(corporation_id);
        CREATE INDEX IF NOT EXISTS idx_production_chains_location ON production_chains(location_id);
      `);
    } catch (error) {
      console.warn('Failed to create product/production chain indexes:', error.message);
    }

    try {
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_economic_city_markets_civilization ON economic_city_markets(civilization_id);
        CREATE INDEX IF NOT EXISTS idx_economic_city_markets_planet ON economic_city_markets(planet_id);
        CREATE INDEX IF NOT EXISTS idx_market_demand_market ON market_demand(market_id);
        CREATE INDEX IF NOT EXISTS idx_market_demand_product ON market_demand(product_id);
        CREATE INDEX IF NOT EXISTS idx_market_supply_market ON market_supply(market_id);
        CREATE INDEX IF NOT EXISTS idx_market_supply_product ON market_supply(product_id);
      `);
    } catch (error) {
      console.warn('Failed to create market indexes:', error.message);
    }

    try {
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_trade_policies_source ON trade_policies(source_civilization_id);
        CREATE INDEX IF NOT EXISTS idx_trade_policies_target ON trade_policies(target_civilization_id);
        CREATE INDEX IF NOT EXISTS idx_product_trade_policies_policy ON product_trade_policies(trade_policy_id);
        CREATE INDEX IF NOT EXISTS idx_product_trade_policies_category ON product_trade_policies(product_category_id);
      `);
    } catch (error) {
      console.warn('Failed to create trade policy indexes:', error.message);
    }

    try {
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_location_skills_city ON location_skills(city_id);
        CREATE INDEX IF NOT EXISTS idx_location_skills_category ON location_skills(skill_category);
      `);
    } catch (error) {
      console.warn('Failed to create location skills indexes:', error.message);
    }

    try {
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_government_contracts_civilization ON government_contracts(civilization_id);
        CREATE INDEX IF NOT EXISTS idx_government_contracts_status ON government_contracts(contract_status);
        CREATE INDEX IF NOT EXISTS idx_government_contracts_type ON government_contracts(contract_type);
      `);
    } catch (error) {
      console.warn('Failed to create government contracts indexes:', error.message);
    }

    try {
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_industry_statistics_civilization ON industry_statistics(civilization_id);
        CREATE INDEX IF NOT EXISTS idx_industry_statistics_sector ON industry_statistics(sector);
        CREATE INDEX IF NOT EXISTS idx_industry_statistics_period ON industry_statistics(reporting_period);
      `);
    } catch (error) {
      console.warn('Failed to create industry statistics indexes:', error.message);
    }

    try {
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_trade_pacts_status ON trade_pacts(status);
        CREATE INDEX IF NOT EXISTS idx_trade_pacts_type ON trade_pacts(pact_type);
        CREATE INDEX IF NOT EXISTS idx_trade_pacts_lead_negotiator ON trade_pacts(lead_negotiator_civilization);
        CREATE INDEX IF NOT EXISTS idx_trade_pacts_effective_date ON trade_pacts(effective_date);
      `);
    } catch (error) {
      console.warn('Failed to create trade pacts indexes:', error.message);
    }

    try {
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_trade_pact_negotiations_pact ON trade_pact_negotiations(pact_id);
        CREATE INDEX IF NOT EXISTS idx_trade_pact_negotiations_status ON trade_pact_negotiations(negotiation_status);
        CREATE INDEX IF NOT EXISTS idx_trade_pact_compliance_pact ON trade_pact_compliance(pact_id);
        CREATE INDEX IF NOT EXISTS idx_trade_pact_compliance_civilization ON trade_pact_compliance(civilization_id);
        CREATE INDEX IF NOT EXISTS idx_trade_pact_compliance_period ON trade_pact_compliance(compliance_period);
        CREATE INDEX IF NOT EXISTS idx_trade_pact_disputes_pact ON trade_pact_disputes(pact_id);
        CREATE INDEX IF NOT EXISTS idx_trade_pact_disputes_complainant ON trade_pact_disputes(complainant_civilization);
        CREATE INDEX IF NOT EXISTS idx_trade_pact_disputes_respondent ON trade_pact_disputes(respondent_civilization);
        CREATE INDEX IF NOT EXISTS idx_trade_pact_disputes_status ON trade_pact_disputes(dispute_status);
      `);
    } catch (error) {
      console.warn('Failed to create trade pact negotiation/compliance/dispute indexes:', error.message);
    }

    // Insert seed data for demonstration
    await insertEconomicEcosystemSeedData(client);

    await client.query('COMMIT');
    console.log('✅ Economic Ecosystem schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Economic Ecosystem schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function insertEconomicEcosystemSeedData(client: any): Promise<void> {
  // Insert product categories
  await client.query(`
    INSERT INTO product_categories (category_name, strategic_importance, track_individually, description, technology_level) 
    VALUES 
    -- Strategic Products (tracked individually)
    ('Weapons', 'critical', true, 'Military weapons and defense systems', 8),
    ('Spacecraft', 'high', true, 'Civilian and military spacecraft', 9),
    ('Quantum Computers', 'critical', true, 'Advanced quantum computing systems', 10),
    ('Fusion Reactors', 'critical', true, 'Nuclear fusion power generation systems', 9),
    ('AI Systems', 'high', true, 'Artificial intelligence and machine learning systems', 9),
    ('Medical Devices', 'high', true, 'Advanced medical and biotechnology devices', 8),
    
    -- Bulk Products (tracked in aggregate)
    ('Food', 'medium', false, 'Agricultural products and processed food', 3),
    ('Consumer Electronics', 'low', false, 'Personal electronics and entertainment devices', 6),
    ('Clothing', 'low', false, 'Textiles and fashion products', 2),
    ('Construction Materials', 'medium', false, 'Building materials and infrastructure components', 4),
    ('Energy', 'high', false, 'Power generation and energy storage', 7),
    ('Transportation', 'medium', false, 'Vehicles and transportation systems', 6),
    ('Software', 'medium', false, 'Software applications and digital services', 7),
    ('Entertainment', 'low', false, 'Media, games, and entertainment content', 5)
  `);

  // Insert materials
  await client.query(`
    INSERT INTO materials (material_name, category, extraction_difficulty, strategic_value, base_price, availability_score) 
    VALUES 
    -- Raw Materials
    ('Titanium Ore', 'raw_materials', 6, 7, 1250.00, 4),
    ('Rare Earth Elements', 'raw_materials', 8, 9, 5000.00, 3),
    ('Helium-3', 'raw_materials', 10, 10, 50000.00, 2),
    ('Quantum Crystals', 'raw_materials', 9, 10, 25000.00, 2),
    ('Biomass', 'raw_materials', 2, 3, 50.00, 8),
    
    -- Components
    ('Quantum Processors', 'components', 9, 9, 100000.00, 3),
    ('Neural Interface Chips', 'components', 8, 8, 75000.00, 4),
    ('Fusion Containment Fields', 'components', 10, 10, 500000.00, 2),
    ('Advanced Sensors', 'components', 7, 6, 15000.00, 5),
    ('Power Cells', 'components', 5, 5, 2500.00, 6),
    
    -- Energy Sources
    ('Antimatter', 'energy_sources', 10, 10, 1000000.00, 1),
    ('Fusion Fuel', 'energy_sources', 8, 8, 10000.00, 3),
    ('Solar Collectors', 'energy_sources', 4, 4, 5000.00, 7),
    
    -- Biological
    ('Genetic Templates', 'biological', 9, 8, 50000.00, 3),
    ('Pharmaceutical Compounds', 'biological', 7, 7, 25000.00, 4),
    
    -- Information
    ('AI Algorithms', 'information', 8, 9, 100000.00, 4),
    ('Quantum Encryption Keys', 'information', 9, 10, 75000.00, 3),
    ('Technical Blueprints', 'information', 6, 6, 10000.00, 5)
  `);

  // Note: City markets are now dynamically generated using DynamicCityGenerator
  // No hardcoded cities - use POST /api/economic-ecosystem/generate-all-cities to populate

  // Insert sample products for key categories
  await client.query(`
    INSERT INTO products (category_id, product_name, description, technology_level, unit_price, complexity_score) 
    VALUES 
    -- Weapons (category_id: 1)
    (1, 'Plasma Rifle MK-VII', 'Advanced infantry plasma weapon system', 8, 25000, 7),
    (1, 'Quantum Torpedo', 'Ship-to-ship quantum explosive device', 9, 500000, 9),
    (1, 'Defense Grid Array', 'Planetary defense system component', 8, 5000000, 8),
    
    -- Spacecraft (category_id: 2)
    (2, 'Interceptor-Class Fighter', 'Single-pilot combat spacecraft', 8, 15000000, 8),
    (2, 'Cargo Hauler Heavy', 'Large capacity freight vessel', 7, 50000000, 6),
    (2, 'Explorer-Class Survey Ship', 'Long-range exploration vessel', 9, 100000000, 9),
    
    -- Quantum Computers (category_id: 3)
    (3, 'QuantumCore Q-1000', 'Enterprise quantum computing system', 10, 10000000, 10),
    (3, 'Quantum Encryption Module', 'Secure communication quantum processor', 9, 2000000, 9),
    
    -- AI Systems (category_id: 5)
    (5, 'NeuralGen AGI Assistant', 'Advanced general intelligence system', 9, 5000000, 9),
    (5, 'Tactical AI Commander', 'Military strategic AI system', 9, 25000000, 10),
    
    -- Food (category_id: 7)
    (7, 'Synthetic Protein', 'Lab-grown protein substitute', 4, 15, 3),
    (7, 'Hydroponic Vegetables', 'Space-grown fresh produce', 3, 8, 2),
    (7, 'Nutrient Paste', 'Complete nutrition in paste form', 2, 3, 1),
    
    -- Software (category_id: 13)
    (13, 'Quantum OS', 'Operating system for quantum computers', 9, 1000000, 8),
    (13, 'Neural Interface SDK', 'Brain-computer interface development kit', 8, 500000, 7),
    (13, 'Starship Navigation AI', 'Autonomous navigation software', 8, 2000000, 8)
  `);

  console.log('✅ Economic Ecosystem seed data inserted successfully');
}
