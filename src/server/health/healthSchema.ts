import { Pool } from 'pg';

// Health & Human Services Department Interfaces
export interface HealthSecretary {
  id: number;
  campaign_id: number;
  full_name: string;
  background: string;
  personality_traits: string[];
  leadership_style: string;
  policy_priorities: string[];
  management_approach: string;
  public_health_philosophy: string;
  previous_experience: string;
  education: string;
  appointment_date: Date;
  approval_rating: number;
  is_active: boolean;
  created_at: Date;
}

export interface SurgeonGeneral {
  id: number;
  campaign_id: number;
  health_secretary_id: number;
  full_name: string;
  medical_degree: string;
  specialization: string;
  background: string;
  personality_traits: string[];
  communication_style: string;
  medical_expertise: string[];
  policy_positions: string[];
  public_health_focus: string[];
  previous_roles: string[];
  education: string;
  witter_handle: string;
  contact_availability: 'high' | 'medium' | 'low';
  appointment_date: Date;
  approval_rating: number;
  is_active: boolean;
  created_at: Date;
}

export interface PopulationHealth {
  id: number;
  campaign_id: number;
  civilization_id: number;
  city_id?: number;
  total_population: number;
  life_expectancy: number;
  infant_mortality_rate: number;
  chronic_disease_prevalence: number;
  mental_health_index: number;
  vaccination_rate: number;
  healthcare_access_score: number;
  nutrition_index: number;
  fitness_level: number;
  air_quality_index: number;
  water_quality_index: number;
  disease_outbreak_risk: number;
  elder_care_coverage: number;
  healthcare_satisfaction: number;
  last_updated: Date;
  created_at: Date;
}

export interface ChronicDiseaseTracking {
  id: number;
  campaign_id: number;
  civilization_id: number;
  disease_type: string;
  prevalence_rate: number;
  incidence_rate: number;
  mortality_rate: number;
  treatment_success_rate: number;
  prevention_program_effectiveness: number;
  cost_per_case: number;
  total_cases: number;
  new_cases_monthly: number;
  demographic_breakdown: any; // JSON
  risk_factors: string[];
  treatment_protocols: string[];
  prevention_strategies: string[];
  research_funding: number;
  last_updated: Date;
  created_at: Date;
}

export interface HealthcareInfrastructure {
  id: number;
  campaign_id: number;
  civilization_id: number;
  city_id?: number;
  facility_type: string;
  facility_name: string;
  capacity: number;
  current_utilization: number;
  staffing_level: number;
  equipment_quality: number;
  technology_level: number;
  specializations: string[];
  emergency_preparedness: number;
  patient_satisfaction: number;
  operational_efficiency: number;
  annual_budget: number;
  maintenance_status: string;
  expansion_plans: any; // JSON
  last_inspection: Date;
  created_at: Date;
}

export interface HealthPolicy {
  id: number;
  campaign_id: number;
  policy_name: string;
  policy_type: string;
  description: string;
  objectives: string[];
  target_population: string;
  implementation_status: string;
  budget_allocated: number;
  budget_spent: number;
  effectiveness_score: number;
  public_support: number;
  health_outcomes: any; // JSON
  implementation_timeline: any; // JSON
  success_metrics: string[];
  challenges: string[];
  secretary_approval: boolean;
  surgeon_general_endorsement: boolean;
  leader_approval: boolean;
  created_by: string;
  approved_date?: Date;
  created_at: Date;
}

export interface HealthEmergency {
  id: number;
  campaign_id: number;
  civilization_id: number;
  emergency_type: string;
  severity_level: number;
  affected_population: number;
  geographic_scope: string;
  description: string;
  response_status: string;
  response_coordinator: string;
  resources_deployed: any; // JSON
  timeline: any; // JSON
  public_communications: any; // JSON
  economic_impact: number;
  health_impact_assessment: any; // JSON
  lessons_learned: string[];
  is_active: boolean;
  declared_date: Date;
  resolved_date?: Date;
  created_at: Date;
}

export interface HealthBudget {
  id: number;
  campaign_id: number;
  fiscal_year: number;
  category: string;
  subcategory: string;
  allocated_amount: number;
  spent_amount: number;
  committed_amount: number;
  remaining_balance: number;
  utilization_rate: number;
  priority_level: string;
  program_effectiveness: number;
  population_impact: number;
  cost_per_beneficiary: number;
  quarterly_targets: any; // JSON
  spending_milestones: any; // JSON
  approval_status: string;
  approved_by: string;
  last_updated: Date;
  created_at: Date;
}

export interface HealthWorkflow {
  id: number;
  campaign_id: number;
  workflow_type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assigned_to: string;
  department_involved: string[];
  health_impact_assessment: any; // JSON
  budget_implications: number;
  timeline: any; // JSON
  approval_chain: any; // JSON
  public_health_considerations: string[];
  stakeholder_input: any; // JSON
  implementation_plan: any; // JSON
  success_criteria: string[];
  risk_assessment: any; // JSON
  created_by: string;
  due_date?: Date;
  completed_date?: Date;
  created_at: Date;
}

export async function initializeHealthSchema(pool: Pool): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Health Secretaries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS health_secretaries (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        full_name VARCHAR(200) NOT NULL,
        background TEXT,
        personality_traits JSONB,
        leadership_style VARCHAR(100),
        policy_priorities JSONB,
        management_approach TEXT,
        public_health_philosophy TEXT,
        previous_experience TEXT,
        education TEXT,
        appointment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approval_rating INTEGER DEFAULT 50 CHECK (approval_rating >= 0 AND approval_rating <= 100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(campaign_id, is_active) DEFERRABLE INITIALLY DEFERRED
      );
    `);

    // Surgeon Generals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS surgeon_generals (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        health_secretary_id INTEGER REFERENCES health_secretaries(id),
        full_name VARCHAR(200) NOT NULL,
        medical_degree VARCHAR(100),
        specialization VARCHAR(100),
        background TEXT,
        personality_traits JSONB,
        communication_style VARCHAR(100),
        medical_expertise JSONB,
        policy_positions JSONB,
        public_health_focus JSONB,
        previous_roles JSONB,
        education TEXT,
        witter_handle VARCHAR(50),
        contact_availability VARCHAR(20) DEFAULT 'medium' CHECK (contact_availability IN ('high', 'medium', 'low')),
        appointment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approval_rating INTEGER DEFAULT 50 CHECK (approval_rating >= 0 AND approval_rating <= 100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(campaign_id, is_active) DEFERRABLE INITIALLY DEFERRED
      );
    `);

    // Population Health table
    await client.query(`
      CREATE TABLE IF NOT EXISTS population_health (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        civilization_id INTEGER NOT NULL,
        city_id INTEGER,
        total_population BIGINT DEFAULT 0,
        life_expectancy DECIMAL(5,2) DEFAULT 75.0,
        infant_mortality_rate DECIMAL(6,3) DEFAULT 5.0,
        chronic_disease_prevalence DECIMAL(5,2) DEFAULT 25.0,
        mental_health_index DECIMAL(5,2) DEFAULT 70.0,
        vaccination_rate DECIMAL(5,2) DEFAULT 85.0,
        healthcare_access_score DECIMAL(5,2) DEFAULT 75.0,
        nutrition_index DECIMAL(5,2) DEFAULT 70.0,
        fitness_level DECIMAL(5,2) DEFAULT 65.0,
        air_quality_index DECIMAL(5,2) DEFAULT 80.0,
        water_quality_index DECIMAL(5,2) DEFAULT 90.0,
        disease_outbreak_risk DECIMAL(5,2) DEFAULT 10.0,
        elder_care_coverage DECIMAL(5,2) DEFAULT 60.0,
        healthcare_satisfaction DECIMAL(5,2) DEFAULT 70.0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(campaign_id, civilization_id, city_id)
      );
    `);

    // Chronic Disease Tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chronic_disease_tracking (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        civilization_id INTEGER NOT NULL,
        disease_type VARCHAR(100) NOT NULL,
        prevalence_rate DECIMAL(6,3) DEFAULT 0,
        incidence_rate DECIMAL(6,3) DEFAULT 0,
        mortality_rate DECIMAL(6,3) DEFAULT 0,
        treatment_success_rate DECIMAL(5,2) DEFAULT 0,
        prevention_program_effectiveness DECIMAL(5,2) DEFAULT 0,
        cost_per_case DECIMAL(12,2) DEFAULT 0,
        total_cases INTEGER DEFAULT 0,
        new_cases_monthly INTEGER DEFAULT 0,
        demographic_breakdown JSONB,
        risk_factors JSONB,
        treatment_protocols JSONB,
        prevention_strategies JSONB,
        research_funding DECIMAL(15,2) DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(campaign_id, civilization_id, disease_type)
      );
    `);

    // Healthcare Infrastructure table
    await client.query(`
      CREATE TABLE IF NOT EXISTS healthcare_infrastructure (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        civilization_id INTEGER NOT NULL,
        city_id INTEGER,
        facility_type VARCHAR(100) NOT NULL,
        facility_name VARCHAR(200) NOT NULL,
        capacity INTEGER DEFAULT 0,
        current_utilization DECIMAL(5,2) DEFAULT 0,
        staffing_level DECIMAL(5,2) DEFAULT 100,
        equipment_quality DECIMAL(5,2) DEFAULT 75,
        technology_level DECIMAL(5,2) DEFAULT 70,
        specializations JSONB,
        emergency_preparedness DECIMAL(5,2) DEFAULT 60,
        patient_satisfaction DECIMAL(5,2) DEFAULT 70,
        operational_efficiency DECIMAL(5,2) DEFAULT 75,
        annual_budget DECIMAL(15,2) DEFAULT 0,
        maintenance_status VARCHAR(50) DEFAULT 'good',
        expansion_plans JSONB,
        last_inspection TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Health Policies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS health_policies (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        policy_name VARCHAR(200) NOT NULL,
        policy_type VARCHAR(100) NOT NULL,
        description TEXT,
        objectives JSONB,
        target_population VARCHAR(200),
        implementation_status VARCHAR(50) DEFAULT 'proposed',
        budget_allocated DECIMAL(15,2) DEFAULT 0,
        budget_spent DECIMAL(15,2) DEFAULT 0,
        effectiveness_score DECIMAL(5,2) DEFAULT 0,
        public_support DECIMAL(5,2) DEFAULT 50,
        health_outcomes JSONB,
        implementation_timeline JSONB,
        success_metrics JSONB,
        challenges JSONB,
        secretary_approval BOOLEAN DEFAULT false,
        surgeon_general_endorsement BOOLEAN DEFAULT false,
        leader_approval BOOLEAN DEFAULT false,
        created_by VARCHAR(100),
        approved_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Health Emergencies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS health_emergencies (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        civilization_id INTEGER NOT NULL,
        emergency_type VARCHAR(100) NOT NULL,
        severity_level INTEGER DEFAULT 1 CHECK (severity_level >= 1 AND severity_level <= 5),
        affected_population INTEGER DEFAULT 0,
        geographic_scope VARCHAR(200),
        description TEXT,
        response_status VARCHAR(50) DEFAULT 'monitoring',
        response_coordinator VARCHAR(100),
        resources_deployed JSONB,
        timeline JSONB,
        public_communications JSONB,
        economic_impact DECIMAL(15,2) DEFAULT 0,
        health_impact_assessment JSONB,
        lessons_learned JSONB,
        is_active BOOLEAN DEFAULT true,
        declared_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Health Budget table
    await client.query(`
      CREATE TABLE IF NOT EXISTS health_budget (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        fiscal_year INTEGER NOT NULL,
        category VARCHAR(100) NOT NULL,
        subcategory VARCHAR(100),
        allocated_amount DECIMAL(15,2) DEFAULT 0,
        spent_amount DECIMAL(15,2) DEFAULT 0,
        committed_amount DECIMAL(15,2) DEFAULT 0,
        remaining_balance DECIMAL(15,2) DEFAULT 0,
        utilization_rate DECIMAL(5,2) DEFAULT 0,
        priority_level VARCHAR(20) DEFAULT 'medium',
        program_effectiveness DECIMAL(5,2) DEFAULT 0,
        population_impact DECIMAL(5,2) DEFAULT 0,
        cost_per_beneficiary DECIMAL(10,2) DEFAULT 0,
        quarterly_targets JSONB,
        spending_milestones JSONB,
        approval_status VARCHAR(50) DEFAULT 'pending',
        approved_by VARCHAR(100),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(campaign_id, fiscal_year, category, subcategory)
      );
    `);

    // Health Workflows table
    await client.query(`
      CREATE TABLE IF NOT EXISTS health_workflows (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        workflow_type VARCHAR(100) NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        priority VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(50) DEFAULT 'pending',
        assigned_to VARCHAR(100),
        department_involved JSONB,
        health_impact_assessment JSONB,
        budget_implications DECIMAL(15,2) DEFAULT 0,
        timeline JSONB,
        approval_chain JSONB,
        public_health_considerations JSONB,
        stakeholder_input JSONB,
        implementation_plan JSONB,
        success_criteria JSONB,
        risk_assessment JSONB,
        created_by VARCHAR(100),
        due_date TIMESTAMP,
        completed_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_health_secretaries_campaign ON health_secretaries(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_surgeon_generals_campaign ON surgeon_generals(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_surgeon_generals_secretary ON surgeon_generals(health_secretary_id);
      CREATE INDEX IF NOT EXISTS idx_population_health_campaign_civ ON population_health(campaign_id, civilization_id);
      CREATE INDEX IF NOT EXISTS idx_chronic_disease_campaign_civ ON chronic_disease_tracking(campaign_id, civilization_id);
      CREATE INDEX IF NOT EXISTS idx_healthcare_infrastructure_campaign_civ ON healthcare_infrastructure(campaign_id, civilization_id);
      CREATE INDEX IF NOT EXISTS idx_health_policies_campaign ON health_policies(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_health_emergencies_campaign ON health_emergencies(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_health_budget_campaign_year ON health_budget(campaign_id, fiscal_year);
      CREATE INDEX IF NOT EXISTS idx_health_workflows_campaign ON health_workflows(campaign_id);
    `);

    await client.query('COMMIT');
    console.log('✅ Health & Human Services schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Health & Human Services schema initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}
