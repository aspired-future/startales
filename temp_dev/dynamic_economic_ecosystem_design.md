# Dynamic Economic Ecosystem - Design Document

## Overview
Transform the static Financial Markets System into a comprehensive, living economic ecosystem with procedurally generated corporations, dynamic supply chains, trade policies, and location-based supply/demand markets. This system creates a realistic economy where corporations produce specific products, require materials and talent, and operate within complex trade relationships.

## Core Architecture

### 🏭 **Production & Supply Chain System**

#### Product Categories
```typescript
enum ProductCategory {
  // Strategic Products (tracked individually)
  WEAPONS = 'weapons',
  SPACECRAFT = 'spacecraft', 
  QUANTUM_COMPUTERS = 'quantum_computers',
  FUSION_REACTORS = 'fusion_reactors',
  AI_SYSTEMS = 'ai_systems',
  MEDICAL_DEVICES = 'medical_devices',
  
  // Bulk Products (tracked in aggregate)
  FOOD = 'food',
  CONSUMER_ELECTRONICS = 'consumer_electronics',
  CLOTHING = 'clothing',
  CONSTRUCTION_MATERIALS = 'construction_materials',
  ENERGY = 'energy',
  TRANSPORTATION = 'transportation',
  SOFTWARE = 'software',
  ENTERTAINMENT = 'entertainment'
}

enum MaterialCategory {
  RAW_MATERIALS = 'raw_materials',      // Metals, minerals, gases
  COMPONENTS = 'components',            // Processors, sensors, parts
  ENERGY_SOURCES = 'energy_sources',    // Fuel, power cells
  BIOLOGICAL = 'biological',           // Food, pharmaceuticals
  INFORMATION = 'information'           // Data, software, IP
}
```

#### Supply Chain Structure
```typescript
interface ProductionChain {
  id: string;
  product_id: string;
  inputs: MaterialRequirement[];
  output_quantity: number;
  production_time: number;
  skill_requirements: SkillRequirement[];
  location_requirements: LocationRequirement[];
}

interface MaterialRequirement {
  material_category: MaterialCategory;
  specific_material?: string;
  quantity_per_unit: number;
  quality_grade: 'low' | 'medium' | 'high' | 'military';
  source_preference: 'domestic' | 'import' | 'either';
}
```

### 🌍 **Location-Based Supply & Demand**

#### Market Structure
```typescript
interface CityMarket {
  city_id: string;
  planet_id: string;
  civilization_id: number;
  population: number;
  economic_tier: 'developing' | 'industrial' | 'advanced' | 'post_scarcity';
  
  demand: ProductDemand[];
  supply: ProductSupply[];
  prices: MarketPrice[];
  trade_routes: TradeRoute[];
}

interface ProductDemand {
  product_category: ProductCategory;
  specific_product?: string;
  base_demand: number;
  price_elasticity: number;
  seasonal_factors: SeasonalFactor[];
  growth_rate: number;
}

interface ProductSupply {
  product_category: ProductCategory;
  specific_product?: string;
  domestic_production: number;
  import_quantity: number;
  inventory_level: number;
  production_capacity: number;
}
```

### 🏢 **Dynamic Corporation System**

#### Procedural Corporation Generation
```typescript
interface CorporationTemplate {
  sector: IndustrySector;
  size_category: 'startup' | 'small' | 'medium' | 'large' | 'mega_corp';
  business_model: BusinessModel;
  geographic_scope: 'local' | 'planetary' | 'system' | 'galactic';
  
  name_patterns: NamePattern[];
  product_categories: ProductCategory[];
  required_materials: MaterialCategory[];
  skill_requirements: SkillCategory[];
}

interface BusinessModel {
  type: 'manufacturer' | 'retailer' | 'service' | 'technology' | 'resource_extraction';
  revenue_streams: RevenueStream[];
  cost_structure: CostStructure;
  competitive_advantages: string[];
}

enum IndustrySector {
  DEFENSE_AEROSPACE = 'defense_aerospace',
  TECHNOLOGY = 'technology',
  HEALTHCARE_BIOTECH = 'healthcare_biotech',
  ENERGY = 'energy',
  MANUFACTURING = 'manufacturing',
  RETAIL_CONSUMER = 'retail_consumer',
  TRANSPORTATION_LOGISTICS = 'transportation_logistics',
  FINANCIAL_SERVICES = 'financial_services',
  AGRICULTURE_FOOD = 'agriculture_food',
  CONSTRUCTION_REAL_ESTATE = 'construction_real_estate',
  ENTERTAINMENT_MEDIA = 'entertainment_media',
  SOFTWARE_SERVICES = 'software_services'
}
```

#### Dynamic Leader Generation
```typescript
interface LeaderTemplate {
  background_categories: BackgroundCategory[];
  personality_archetypes: PersonalityArchetype[];
  leadership_styles: LeadershipStyle[];
  expertise_areas: ExpertiseArea[];
  
  name_generators: NameGenerator[];
  backstory_templates: BackstoryTemplate[];
  communication_patterns: CommunicationPattern[];
}

enum PersonalityArchetype {
  VISIONARY_INNOVATOR = 'visionary_innovator',
  PRAGMATIC_OPERATOR = 'pragmatic_operator',
  AGGRESSIVE_COMPETITOR = 'aggressive_competitor',
  COLLABORATIVE_BUILDER = 'collaborative_builder',
  ANALYTICAL_STRATEGIST = 'analytical_strategist',
  CHARISMATIC_LEADER = 'charismatic_leader'
}
```

### 🛡️ **Trade Policy & Government Control**

#### Trade Policy Framework
```typescript
interface TradePolicy {
  civilization_id: number;
  target_civilization_id: number;
  
  product_policies: ProductTradePolicy[];
  general_tariff_rate: number;
  strategic_export_controls: ExportControl[];
  import_quotas: ImportQuota[];
  
  diplomatic_modifier: number;
  economic_relationship: 'ally' | 'neutral' | 'competitor' | 'hostile';
}

interface ProductTradePolicy {
  product_category: ProductCategory;
  specific_products?: string[];
  
  import_policy: 'allowed' | 'restricted' | 'banned';
  export_policy: 'allowed' | 'license_required' | 'banned';
  tariff_rate: number;
  
  strategic_importance: 'low' | 'medium' | 'high' | 'critical';
  domestic_protection_level: number;
}

interface ExportControl {
  product_category: ProductCategory;
  technology_level: 'civilian' | 'dual_use' | 'military' | 'classified';
  license_requirements: LicenseRequirement[];
  prohibited_destinations: number[];
}
```

#### Government Procurement
```typescript
interface GovernmentContract {
  id: string;
  issuing_department: string;
  contract_type: 'weapons' | 'infrastructure' | 'services' | 'research';
  
  requirements: ContractRequirement[];
  domestic_preference: boolean;
  security_clearance_required: boolean;
  
  bidding_corporations: number[];
  awarded_corporation?: number;
  contract_value: number;
  delivery_timeline: number;
}

interface ContractRequirement {
  product_category: ProductCategory;
  specific_product: string;
  quantity: number;
  quality_standards: QualityStandard[];
  delivery_schedule: DeliveryMilestone[];
}
```

### 👥 **Talent & Expertise System**

#### Skill Ecosystem
```typescript
interface LocationSkills {
  city_id: string;
  available_skills: SkillAvailability[];
  education_institutions: EducationInstitution[];
  research_facilities: ResearchFacility[];
  
  brain_drain_rate: number;
  skill_development_rate: number;
  immigration_attraction: number;
}

interface SkillAvailability {
  skill_category: SkillCategory;
  specific_skill: string;
  availability_level: 'scarce' | 'limited' | 'adequate' | 'abundant';
  average_cost: number;
  quality_level: number;
}

enum SkillCategory {
  ENGINEERING = 'engineering',
  RESEARCH_DEVELOPMENT = 'research_development',
  MANUFACTURING = 'manufacturing',
  MANAGEMENT = 'management',
  SALES_MARKETING = 'sales_marketing',
  FINANCE = 'finance',
  LOGISTICS = 'logistics',
  CYBERSECURITY = 'cybersecurity',
  AI_MACHINE_LEARNING = 'ai_machine_learning',
  BIOTECHNOLOGY = 'biotechnology'
}
```

### 📊 **Industry Statistics & Tracking**

#### Economic Metrics
```typescript
interface IndustryStatistics {
  civilization_id: number;
  reporting_period: Date;
  
  industry_metrics: IndustryMetric[];
  trade_balance: TradeBalance;
  employment_data: EmploymentData[];
  productivity_metrics: ProductivityMetric[];
}

interface IndustryMetric {
  sector: IndustrySector;
  total_revenue: number;
  employment: number;
  number_of_companies: number;
  production_volume: ProductionVolume[];
  export_value: number;
  import_value: number;
  
  growth_rate: number;
  productivity_index: number;
  competitiveness_score: number;
}

interface TradeBalance {
  total_exports: number;
  total_imports: number;
  trade_surplus_deficit: number;
  
  by_civilization: CivilizationTrade[];
  by_product_category: ProductCategoryTrade[];
  strategic_dependencies: StrategicDependency[];
}
```

## Implementation Strategy

### Phase 1: Core Supply Chain System
1. **Product & Material Database**: Define product categories and material requirements
2. **Production Chain Engine**: Model manufacturing processes and requirements
3. **Supply/Demand Markets**: City-level market simulation
4. **Basic Trade Routes**: Inter-city and inter-civilization commerce

### Phase 2: Dynamic Corporation Generation
1. **Corporation Templates**: Industry-specific business models and characteristics
2. **Procedural Name Generation**: AI-powered company and leader name creation
3. **Business Model Engine**: Revenue streams, cost structures, competitive positioning
4. **Corporate Lifecycle**: Birth, growth, merger, bankruptcy mechanics

### Phase 3: Trade Policy Integration
1. **Policy Framework**: Tariffs, export controls, strategic restrictions
2. **Government Procurement**: Military contracts and domestic preferences
3. **Diplomatic Integration**: Trade relationships affecting policy
4. **Economic Warfare**: Trade sanctions and strategic competition

### Phase 4: Advanced Features
1. **Talent Mobility**: Brain drain/gain between locations
2. **Technology Transfer**: IP licensing and technology diffusion
3. **Market Disruption**: New technologies changing entire industries
4. **Economic Intelligence**: Corporate espionage and competitive intelligence

## Database Schema Extensions

### New Core Tables
```sql
-- Products and Materials
CREATE TABLE product_categories (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  strategic_importance VARCHAR(20) DEFAULT 'low',
  track_individually BOOLEAN DEFAULT false
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES product_categories(id),
  product_name VARCHAR(200) NOT NULL,
  description TEXT,
  technology_level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  material_name VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  extraction_difficulty INTEGER DEFAULT 1,
  strategic_value INTEGER DEFAULT 1
);

-- Production and Supply Chains
CREATE TABLE production_chains (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  corporation_id INTEGER REFERENCES listed_companies(id),
  location_id INTEGER NOT NULL,
  
  input_materials JSONB NOT NULL,
  output_quantity INTEGER NOT NULL,
  production_time INTEGER NOT NULL,
  skill_requirements JSONB,
  
  efficiency_rating DECIMAL(4,2) DEFAULT 1.0,
  capacity_utilization DECIMAL(4,2) DEFAULT 0.8,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market Supply and Demand
CREATE TABLE city_markets (
  id SERIAL PRIMARY KEY,
  city_id INTEGER NOT NULL,
  planet_id INTEGER NOT NULL,
  civilization_id INTEGER NOT NULL,
  
  population INTEGER NOT NULL,
  economic_tier VARCHAR(20) DEFAULT 'industrial',
  gdp_per_capita DECIMAL(12,2),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(city_id, planet_id, civilization_id)
);

CREATE TABLE market_demand (
  id SERIAL PRIMARY KEY,
  market_id INTEGER REFERENCES city_markets(id),
  product_id INTEGER REFERENCES products(id),
  
  base_demand INTEGER NOT NULL,
  current_price DECIMAL(12,4),
  price_elasticity DECIMAL(6,4) DEFAULT -1.0,
  
  seasonal_factors JSONB,
  growth_rate DECIMAL(6,4) DEFAULT 0.02,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE market_supply (
  id SERIAL PRIMARY KEY,
  market_id INTEGER REFERENCES city_markets(id),
  product_id INTEGER REFERENCES products(id),
  
  domestic_production INTEGER DEFAULT 0,
  import_quantity INTEGER DEFAULT 0,
  inventory_level INTEGER DEFAULT 0,
  
  production_capacity INTEGER DEFAULT 0,
  supply_elasticity DECIMAL(6,4) DEFAULT 1.0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trade Policies
CREATE TABLE trade_policies (
  id SERIAL PRIMARY KEY,
  source_civilization_id INTEGER NOT NULL,
  target_civilization_id INTEGER NOT NULL,
  
  general_tariff_rate DECIMAL(6,4) DEFAULT 0.0,
  diplomatic_modifier DECIMAL(4,2) DEFAULT 1.0,
  economic_relationship VARCHAR(20) DEFAULT 'neutral',
  
  effective_date DATE NOT NULL,
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_trade_policies (
  id SERIAL PRIMARY KEY,
  trade_policy_id INTEGER REFERENCES trade_policies(id),
  product_category_id INTEGER REFERENCES product_categories(id),
  
  import_policy VARCHAR(20) DEFAULT 'allowed',
  export_policy VARCHAR(20) DEFAULT 'allowed',
  tariff_rate DECIMAL(6,4) DEFAULT 0.0,
  
  strategic_importance VARCHAR(20) DEFAULT 'low',
  domestic_protection_level DECIMAL(4,2) DEFAULT 0.0
);

-- Dynamic Corporation Generation
CREATE TABLE corporation_templates (
  id SERIAL PRIMARY KEY,
  sector VARCHAR(50) NOT NULL,
  size_category VARCHAR(20) NOT NULL,
  business_model VARCHAR(50) NOT NULL,
  
  name_patterns JSONB NOT NULL,
  product_categories JSONB NOT NULL,
  skill_requirements JSONB NOT NULL,
  
  success_probability DECIMAL(4,2) DEFAULT 0.5,
  growth_potential DECIMAL(4,2) DEFAULT 1.0
);

CREATE TABLE leader_templates (
  id SERIAL PRIMARY KEY,
  personality_archetype VARCHAR(50) NOT NULL,
  leadership_style VARCHAR(50) NOT NULL,
  background_category VARCHAR(50) NOT NULL,
  
  name_generators JSONB NOT NULL,
  backstory_templates JSONB NOT NULL,
  communication_patterns JSONB NOT NULL,
  
  influence_potential DECIMAL(4,2) DEFAULT 5.0
);

-- Skills and Talent
CREATE TABLE location_skills (
  id SERIAL PRIMARY KEY,
  city_id INTEGER NOT NULL,
  skill_category VARCHAR(50) NOT NULL,
  specific_skill VARCHAR(100) NOT NULL,
  
  availability_level VARCHAR(20) DEFAULT 'adequate',
  average_cost DECIMAL(12,2),
  quality_level DECIMAL(4,2) DEFAULT 5.0,
  
  brain_drain_rate DECIMAL(6,4) DEFAULT 0.0,
  development_rate DECIMAL(6,4) DEFAULT 0.02,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Government Procurement
CREATE TABLE government_contracts (
  id SERIAL PRIMARY KEY,
  civilization_id INTEGER NOT NULL,
  issuing_department VARCHAR(100) NOT NULL,
  contract_type VARCHAR(50) NOT NULL,
  
  requirements JSONB NOT NULL,
  domestic_preference BOOLEAN DEFAULT true,
  security_clearance_required BOOLEAN DEFAULT false,
  
  contract_value DECIMAL(20,2) NOT NULL,
  bidding_deadline DATE NOT NULL,
  delivery_deadline DATE NOT NULL,
  
  awarded_corporation_id INTEGER REFERENCES listed_companies(id),
  contract_status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Industry Statistics
CREATE TABLE industry_statistics (
  id SERIAL PRIMARY KEY,
  civilization_id INTEGER NOT NULL,
  sector VARCHAR(50) NOT NULL,
  reporting_period DATE NOT NULL,
  
  total_revenue DECIMAL(20,2) NOT NULL,
  employment INTEGER NOT NULL,
  number_of_companies INTEGER NOT NULL,
  
  export_value DECIMAL(20,2) DEFAULT 0,
  import_value DECIMAL(20,2) DEFAULT 0,
  
  growth_rate DECIMAL(6,4),
  productivity_index DECIMAL(6,2),
  competitiveness_score DECIMAL(4,2),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(civilization_id, sector, reporting_period)
);
```

This comprehensive system will create a living, breathing economy where:
- **Corporations dynamically emerge** with AI-generated names and leaders
- **Supply chains connect** raw materials to finished products
- **Cities have realistic** supply and demand for different products
- **Trade policies shape** economic relationships between civilizations
- **Government procurement** drives domestic industry development
- **Talent and expertise** create location-based competitive advantages

The system will be fully procedural and dynamic, allowing for emergent economic stories and realistic business cycles!
