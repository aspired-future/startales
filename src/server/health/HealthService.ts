import { Pool } from 'pg';
import {
  HealthSecretary,
  SurgeonGeneral,
  PopulationHealth,
  ChronicDiseaseTracking,
  HealthcareInfrastructure,
  HealthPolicy,
  HealthEmergency,
  HealthBudget,
  HealthWorkflow
} from './healthSchema.js';

class HealthService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Health Secretary Management
  async createHealthSecretary(campaignId: number, secretaryData: Partial<HealthSecretary>): Promise<HealthSecretary> {
    const client = await this.pool.connect();
    try {
      // Deactivate current secretary if exists
      await client.query(
        'UPDATE health_secretaries SET is_active = false WHERE campaign_id = $1 AND is_active = true',
        [campaignId]
      );

      const result = await client.query(`
        INSERT INTO health_secretaries (
          campaign_id, full_name, background, personality_traits, leadership_style,
          policy_priorities, management_approach, public_health_philosophy,
          previous_experience, education, approval_rating
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        campaignId,
        secretaryData.full_name,
        secretaryData.background,
        JSON.stringify(secretaryData.personality_traits || []),
        secretaryData.leadership_style,
        JSON.stringify(secretaryData.policy_priorities || []),
        secretaryData.management_approach,
        secretaryData.public_health_philosophy,
        secretaryData.previous_experience,
        secretaryData.education,
        secretaryData.approval_rating || 50
      ]);

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getCurrentHealthSecretary(campaignId: number): Promise<HealthSecretary | null> {
    const result = await this.pool.query(
      'SELECT * FROM health_secretaries WHERE campaign_id = $1 AND is_active = true',
      [campaignId]
    );
    return result.rows[0] || null;
  }

  async fireHealthSecretary(campaignId: number): Promise<void> {
    await this.pool.query(
      'UPDATE health_secretaries SET is_active = false WHERE campaign_id = $1 AND is_active = true',
      [campaignId]
    );
  }

  // Surgeon General Management
  async createSurgeonGeneral(campaignId: number, surgeonData: Partial<SurgeonGeneral>): Promise<SurgeonGeneral> {
    const client = await this.pool.connect();
    try {
      // Deactivate current surgeon general if exists
      await client.query(
        'UPDATE surgeon_generals SET is_active = false WHERE campaign_id = $1 AND is_active = true',
        [campaignId]
      );

      const result = await client.query(`
        INSERT INTO surgeon_generals (
          campaign_id, health_secretary_id, full_name, medical_degree, specialization,
          background, personality_traits, communication_style, medical_expertise,
          policy_positions, public_health_focus, previous_roles, education,
          witter_handle, contact_availability, approval_rating
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
      `, [
        campaignId,
        surgeonData.health_secretary_id,
        surgeonData.full_name,
        surgeonData.medical_degree,
        surgeonData.specialization,
        surgeonData.background,
        JSON.stringify(surgeonData.personality_traits || []),
        surgeonData.communication_style,
        JSON.stringify(surgeonData.medical_expertise || []),
        JSON.stringify(surgeonData.policy_positions || []),
        JSON.stringify(surgeonData.public_health_focus || []),
        JSON.stringify(surgeonData.previous_roles || []),
        surgeonData.education,
        surgeonData.witter_handle,
        surgeonData.contact_availability || 'medium',
        surgeonData.approval_rating || 50
      ]);

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getCurrentSurgeonGeneral(campaignId: number): Promise<SurgeonGeneral | null> {
    const result = await this.pool.query(
      'SELECT * FROM surgeon_generals WHERE campaign_id = $1 AND is_active = true',
      [campaignId]
    );
    return result.rows[0] || null;
  }

  async fireSurgeonGeneral(campaignId: number): Promise<void> {
    await this.pool.query(
      'UPDATE surgeon_generals SET is_active = false WHERE campaign_id = $1 AND is_active = true',
      [campaignId]
    );
  }

  // Population Health Management
  async getPopulationHealth(campaignId: number, civilizationId: number, cityId?: number): Promise<PopulationHealth[]> {
    let query = 'SELECT * FROM population_health WHERE campaign_id = $1 AND civilization_id = $2';
    const params = [campaignId, civilizationId];

    if (cityId !== undefined) {
      query += ' AND city_id = $3';
      params.push(cityId);
    }

    query += ' ORDER BY created_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async updatePopulationHealth(campaignId: number, civilizationId: number, healthData: Partial<PopulationHealth>): Promise<PopulationHealth> {
    const result = await this.pool.query(`
      INSERT INTO population_health (
        campaign_id, civilization_id, city_id, total_population, life_expectancy,
        infant_mortality_rate, chronic_disease_prevalence, mental_health_index,
        vaccination_rate, healthcare_access_score, nutrition_index, fitness_level,
        air_quality_index, water_quality_index, disease_outbreak_risk,
        elder_care_coverage, healthcare_satisfaction
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      ON CONFLICT (campaign_id, civilization_id, city_id)
      DO UPDATE SET
        total_population = EXCLUDED.total_population,
        life_expectancy = EXCLUDED.life_expectancy,
        infant_mortality_rate = EXCLUDED.infant_mortality_rate,
        chronic_disease_prevalence = EXCLUDED.chronic_disease_prevalence,
        mental_health_index = EXCLUDED.mental_health_index,
        vaccination_rate = EXCLUDED.vaccination_rate,
        healthcare_access_score = EXCLUDED.healthcare_access_score,
        nutrition_index = EXCLUDED.nutrition_index,
        fitness_level = EXCLUDED.fitness_level,
        air_quality_index = EXCLUDED.air_quality_index,
        water_quality_index = EXCLUDED.water_quality_index,
        disease_outbreak_risk = EXCLUDED.disease_outbreak_risk,
        elder_care_coverage = EXCLUDED.elder_care_coverage,
        healthcare_satisfaction = EXCLUDED.healthcare_satisfaction,
        last_updated = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      campaignId, civilizationId, healthData.city_id || null,
      healthData.total_population, healthData.life_expectancy,
      healthData.infant_mortality_rate, healthData.chronic_disease_prevalence,
      healthData.mental_health_index, healthData.vaccination_rate,
      healthData.healthcare_access_score, healthData.nutrition_index,
      healthData.fitness_level, healthData.air_quality_index,
      healthData.water_quality_index, healthData.disease_outbreak_risk,
      healthData.elder_care_coverage, healthData.healthcare_satisfaction
    ]);

    return result.rows[0];
  }

  // Chronic Disease Management
  async getChronicDiseases(campaignId: number, civilizationId: number): Promise<ChronicDiseaseTracking[]> {
    const result = await this.pool.query(
      'SELECT * FROM chronic_disease_tracking WHERE campaign_id = $1 AND civilization_id = $2 ORDER BY prevalence_rate DESC',
      [campaignId, civilizationId]
    );
    return result.rows;
  }

  async updateChronicDisease(campaignId: number, civilizationId: number, diseaseType: string, diseaseData: Partial<ChronicDiseaseTracking>): Promise<ChronicDiseaseTracking> {
    const result = await this.pool.query(`
      INSERT INTO chronic_disease_tracking (
        campaign_id, civilization_id, disease_type, prevalence_rate, incidence_rate,
        mortality_rate, treatment_success_rate, prevention_program_effectiveness,
        cost_per_case, total_cases, new_cases_monthly, demographic_breakdown,
        risk_factors, treatment_protocols, prevention_strategies, research_funding
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT (campaign_id, civilization_id, disease_type)
      DO UPDATE SET
        prevalence_rate = EXCLUDED.prevalence_rate,
        incidence_rate = EXCLUDED.incidence_rate,
        mortality_rate = EXCLUDED.mortality_rate,
        treatment_success_rate = EXCLUDED.treatment_success_rate,
        prevention_program_effectiveness = EXCLUDED.prevention_program_effectiveness,
        cost_per_case = EXCLUDED.cost_per_case,
        total_cases = EXCLUDED.total_cases,
        new_cases_monthly = EXCLUDED.new_cases_monthly,
        demographic_breakdown = EXCLUDED.demographic_breakdown,
        risk_factors = EXCLUDED.risk_factors,
        treatment_protocols = EXCLUDED.treatment_protocols,
        prevention_strategies = EXCLUDED.prevention_strategies,
        research_funding = EXCLUDED.research_funding,
        last_updated = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      campaignId, civilizationId, diseaseType,
      diseaseData.prevalence_rate, diseaseData.incidence_rate,
      diseaseData.mortality_rate, diseaseData.treatment_success_rate,
      diseaseData.prevention_program_effectiveness, diseaseData.cost_per_case,
      diseaseData.total_cases, diseaseData.new_cases_monthly,
      JSON.stringify(diseaseData.demographic_breakdown || {}),
      JSON.stringify(diseaseData.risk_factors || []),
      JSON.stringify(diseaseData.treatment_protocols || []),
      JSON.stringify(diseaseData.prevention_strategies || []),
      diseaseData.research_funding
    ]);

    return result.rows[0];
  }

  // Healthcare Infrastructure Management
  async getHealthcareInfrastructure(campaignId: number, civilizationId: number, cityId?: number): Promise<HealthcareInfrastructure[]> {
    let query = 'SELECT * FROM healthcare_infrastructure WHERE campaign_id = $1 AND civilization_id = $2';
    const params = [campaignId, civilizationId];

    if (cityId !== undefined) {
      query += ' AND city_id = $3';
      params.push(cityId);
    }

    query += ' ORDER BY facility_type, facility_name';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async createHealthcareFacility(facilityData: Partial<HealthcareInfrastructure>): Promise<HealthcareInfrastructure> {
    const result = await this.pool.query(`
      INSERT INTO healthcare_infrastructure (
        campaign_id, civilization_id, city_id, facility_type, facility_name,
        capacity, current_utilization, staffing_level, equipment_quality,
        technology_level, specializations, emergency_preparedness,
        patient_satisfaction, operational_efficiency, annual_budget,
        maintenance_status, expansion_plans
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      facilityData.campaign_id, facilityData.civilization_id, facilityData.city_id,
      facilityData.facility_type, facilityData.facility_name, facilityData.capacity,
      facilityData.current_utilization, facilityData.staffing_level,
      facilityData.equipment_quality, facilityData.technology_level,
      JSON.stringify(facilityData.specializations || []),
      facilityData.emergency_preparedness, facilityData.patient_satisfaction,
      facilityData.operational_efficiency, facilityData.annual_budget,
      facilityData.maintenance_status, JSON.stringify(facilityData.expansion_plans || {})
    ]);

    return result.rows[0];
  }

  // Health Policy Management
  async getHealthPolicies(campaignId: number): Promise<HealthPolicy[]> {
    const result = await this.pool.query(
      'SELECT * FROM health_policies WHERE campaign_id = $1 ORDER BY created_at DESC',
      [campaignId]
    );
    return result.rows;
  }

  async createHealthPolicy(policyData: Partial<HealthPolicy>): Promise<HealthPolicy> {
    const result = await this.pool.query(`
      INSERT INTO health_policies (
        campaign_id, policy_name, policy_type, description, objectives,
        target_population, implementation_status, budget_allocated,
        effectiveness_score, public_support, health_outcomes,
        implementation_timeline, success_metrics, challenges,
        secretary_approval, surgeon_general_endorsement, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      policyData.campaign_id, policyData.policy_name, policyData.policy_type,
      policyData.description, JSON.stringify(policyData.objectives || []),
      policyData.target_population, policyData.implementation_status,
      policyData.budget_allocated, policyData.effectiveness_score,
      policyData.public_support, JSON.stringify(policyData.health_outcomes || {}),
      JSON.stringify(policyData.implementation_timeline || {}),
      JSON.stringify(policyData.success_metrics || []),
      JSON.stringify(policyData.challenges || []),
      policyData.secretary_approval, policyData.surgeon_general_endorsement,
      policyData.created_by
    ]);

    return result.rows[0];
  }

  async approveHealthPolicy(policyId: number, approverType: 'secretary' | 'surgeon_general' | 'leader'): Promise<HealthPolicy> {
    let updateField: string;
    switch (approverType) {
      case 'secretary':
        updateField = 'secretary_approval = true';
        break;
      case 'surgeon_general':
        updateField = 'surgeon_general_endorsement = true';
        break;
      case 'leader':
        updateField = 'leader_approval = true, approved_date = CURRENT_TIMESTAMP';
        break;
      default:
        throw new Error('Invalid approver type');
    }

    const result = await this.pool.query(`
      UPDATE health_policies SET ${updateField} WHERE id = $1 RETURNING *
    `, [policyId]);

    return result.rows[0];
  }

  // Health Emergency Management
  async getHealthEmergencies(campaignId: number, activeOnly: boolean = false): Promise<HealthEmergency[]> {
    let query = 'SELECT * FROM health_emergencies WHERE campaign_id = $1';
    if (activeOnly) {
      query += ' AND is_active = true';
    }
    query += ' ORDER BY severity_level DESC, declared_date DESC';

    const result = await this.pool.query(query, [campaignId]);
    return result.rows;
  }

  async declareHealthEmergency(emergencyData: Partial<HealthEmergency>): Promise<HealthEmergency> {
    const result = await this.pool.query(`
      INSERT INTO health_emergencies (
        campaign_id, civilization_id, emergency_type, severity_level,
        affected_population, geographic_scope, description, response_status,
        response_coordinator, resources_deployed, timeline,
        public_communications, economic_impact, health_impact_assessment
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      emergencyData.campaign_id, emergencyData.civilization_id,
      emergencyData.emergency_type, emergencyData.severity_level,
      emergencyData.affected_population, emergencyData.geographic_scope,
      emergencyData.description, emergencyData.response_status,
      emergencyData.response_coordinator,
      JSON.stringify(emergencyData.resources_deployed || {}),
      JSON.stringify(emergencyData.timeline || {}),
      JSON.stringify(emergencyData.public_communications || {}),
      emergencyData.economic_impact,
      JSON.stringify(emergencyData.health_impact_assessment || {})
    ]);

    return result.rows[0];
  }

  async resolveHealthEmergency(emergencyId: number, lessonsLearned: string[]): Promise<HealthEmergency> {
    const result = await this.pool.query(`
      UPDATE health_emergencies 
      SET is_active = false, resolved_date = CURRENT_TIMESTAMP, lessons_learned = $1
      WHERE id = $2 RETURNING *
    `, [JSON.stringify(lessonsLearned), emergencyId]);

    return result.rows[0];
  }

  // Health Budget Management
  async getHealthBudget(campaignId: number, fiscalYear: number): Promise<HealthBudget[]> {
    const result = await this.pool.query(
      'SELECT * FROM health_budget WHERE campaign_id = $1 AND fiscal_year = $2 ORDER BY category, subcategory',
      [campaignId, fiscalYear]
    );
    return result.rows;
  }

  async allocateHealthBudget(budgetData: Partial<HealthBudget>): Promise<HealthBudget> {
    const result = await this.pool.query(`
      INSERT INTO health_budget (
        campaign_id, fiscal_year, category, subcategory, allocated_amount,
        priority_level, quarterly_targets, spending_milestones, approved_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (campaign_id, fiscal_year, category, subcategory)
      DO UPDATE SET
        allocated_amount = EXCLUDED.allocated_amount,
        remaining_balance = EXCLUDED.allocated_amount - health_budget.spent_amount,
        priority_level = EXCLUDED.priority_level,
        quarterly_targets = EXCLUDED.quarterly_targets,
        spending_milestones = EXCLUDED.spending_milestones,
        approved_by = EXCLUDED.approved_by,
        last_updated = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      budgetData.campaign_id, budgetData.fiscal_year, budgetData.category,
      budgetData.subcategory, budgetData.allocated_amount, budgetData.priority_level,
      JSON.stringify(budgetData.quarterly_targets || {}),
      JSON.stringify(budgetData.spending_milestones || {}), budgetData.approved_by
    ]);

    return result.rows[0];
  }

  async spendHealthBudget(campaignId: number, fiscalYear: number, category: string, subcategory: string, amount: number): Promise<HealthBudget> {
    const result = await this.pool.query(`
      UPDATE health_budget 
      SET 
        spent_amount = spent_amount + $5,
        remaining_balance = allocated_amount - (spent_amount + $5),
        utilization_rate = ((spent_amount + $5) / NULLIF(allocated_amount, 0)) * 100,
        last_updated = CURRENT_TIMESTAMP
      WHERE campaign_id = $1 AND fiscal_year = $2 AND category = $3 AND subcategory = $4
      RETURNING *
    `, [campaignId, fiscalYear, category, subcategory, amount]);

    return result.rows[0];
  }

  // Health Workflow Management
  async getHealthWorkflows(campaignId: number, status?: string): Promise<HealthWorkflow[]> {
    let query = 'SELECT * FROM health_workflows WHERE campaign_id = $1';
    const params = [campaignId];

    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }

    query += ' ORDER BY priority DESC, created_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async createHealthWorkflow(workflowData: Partial<HealthWorkflow>): Promise<HealthWorkflow> {
    const result = await this.pool.query(`
      INSERT INTO health_workflows (
        campaign_id, workflow_type, title, description, priority, status,
        assigned_to, department_involved, health_impact_assessment,
        budget_implications, timeline, approval_chain, public_health_considerations,
        stakeholder_input, implementation_plan, success_criteria,
        risk_assessment, created_by, due_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `, [
      workflowData.campaign_id, workflowData.workflow_type, workflowData.title,
      workflowData.description, workflowData.priority, workflowData.status,
      workflowData.assigned_to, JSON.stringify(workflowData.department_involved || []),
      JSON.stringify(workflowData.health_impact_assessment || {}),
      workflowData.budget_implications, JSON.stringify(workflowData.timeline || {}),
      JSON.stringify(workflowData.approval_chain || {}),
      JSON.stringify(workflowData.public_health_considerations || []),
      JSON.stringify(workflowData.stakeholder_input || {}),
      JSON.stringify(workflowData.implementation_plan || {}),
      JSON.stringify(workflowData.success_criteria || []),
      JSON.stringify(workflowData.risk_assessment || {}),
      workflowData.created_by, workflowData.due_date
    ]);

    return result.rows[0];
  }

  async updateWorkflowStatus(workflowId: number, status: string, completedDate?: Date): Promise<HealthWorkflow> {
    const result = await this.pool.query(`
      UPDATE health_workflows 
      SET status = $2, completed_date = $3
      WHERE id = $1 RETURNING *
    `, [workflowId, status, completedDate]);

    return result.rows[0];
  }

  // Analytics and Reporting
  async getHealthDashboard(campaignId: number, civilizationId: number): Promise<any> {
    const [
      populationHealth,
      chronicDiseases,
      infrastructure,
      emergencies,
      policies,
      budget
    ] = await Promise.all([
      this.getPopulationHealth(campaignId, civilizationId),
      this.getChronicDiseases(campaignId, civilizationId),
      this.getHealthcareInfrastructure(campaignId, civilizationId),
      this.getHealthEmergencies(campaignId, true),
      this.getHealthPolicies(campaignId),
      this.getHealthBudget(campaignId, new Date().getFullYear())
    ]);

    const totalBudget = budget.reduce((sum, item) => sum + Number(item.allocated_amount), 0);
    const totalSpent = budget.reduce((sum, item) => sum + Number(item.spent_amount), 0);

    return {
      populationHealth: populationHealth[0] || {},
      chronicDiseases: chronicDiseases.slice(0, 5),
      infrastructure: {
        totalFacilities: infrastructure.length,
        averageUtilization: infrastructure.reduce((sum, f) => sum + Number(f.current_utilization), 0) / infrastructure.length || 0,
        averageSatisfaction: infrastructure.reduce((sum, f) => sum + Number(f.patient_satisfaction), 0) / infrastructure.length || 0
      },
      activeEmergencies: emergencies.length,
      activePolicies: policies.filter(p => p.implementation_status === 'active').length,
      budget: {
        totalAllocated: totalBudget,
        totalSpent: totalSpent,
        utilizationRate: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
      }
    };
  }
}

let healthService: HealthService;

export function initializeHealthService(pool: Pool): void {
  healthService = new HealthService(pool);
  console.log('✅ Health Service initialized');
}

export function getHealthService(): HealthService {
  if (!healthService) {
    throw new Error('Health Service not initialized');
  }
  return healthService;
}

export default HealthService;
