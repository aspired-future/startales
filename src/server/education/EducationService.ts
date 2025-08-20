import { Pool } from 'pg';
import {
  University,
  ResearchProject,
  ResearchGrant,
  ResearchPriority,
  ResearchBudget,
  EducationSecretary,
  ResearchDashboard,
  EducationOverview
} from './educationInterfaces.js';

export class EducationService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // University Management
  async getAllUniversities(civilizationId?: number): Promise<University[]> {
    let query = 'SELECT * FROM universities';
    const params: any[] = [];

    if (civilizationId) {
      query += ' WHERE civilization_id = $1';
      params.push(civilizationId);
    }

    query += ' ORDER BY reputation_score DESC, total_students DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getUniversityById(id: number): Promise<University | null> {
    const result = await this.pool.query('SELECT * FROM universities WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createUniversity(universityData: Partial<University>): Promise<University> {
    const query = `
      INSERT INTO universities (
        civilization_id, name, location, founded_year, university_type, accreditation_level,
        total_students, faculty_count, endowment, annual_budget, research_budget, tuition_cost,
        acceptance_rate, graduation_rate, reputation_score, research_output_score, 
        teaching_quality_score, facilities_quality, campus_size_hectares,
        established_specializations, research_focus_areas, notable_alumni, partnerships
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING *
    `;

    const values = [
      universityData.civilization_id,
      universityData.name,
      universityData.location,
      universityData.founded_year,
      universityData.university_type || 'public',
      universityData.accreditation_level || 'regional',
      universityData.total_students || 0,
      universityData.faculty_count || 0,
      universityData.endowment || 0,
      universityData.annual_budget || 0,
      universityData.research_budget || 0,
      universityData.tuition_cost || 0,
      universityData.acceptance_rate || 50.0,
      universityData.graduation_rate || 75.0,
      universityData.reputation_score || 50,
      universityData.research_output_score || 50,
      universityData.teaching_quality_score || 50,
      universityData.facilities_quality || 50,
      universityData.campus_size_hectares || 100,
      JSON.stringify(universityData.established_specializations || []),
      JSON.stringify(universityData.research_focus_areas || []),
      JSON.stringify(universityData.notable_alumni || []),
      JSON.stringify(universityData.partnerships || [])
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  // Research Project Management
  async getResearchProjectsByUniversity(universityId: number): Promise<ResearchProject[]> {
    const result = await this.pool.query(
      'SELECT * FROM research_projects WHERE university_id = $1 ORDER BY total_funding DESC, start_date DESC',
      [universityId]
    );
    return result.rows;
  }

  async getResearchProjectsByArea(researchArea: string, civilizationId?: number): Promise<ResearchProject[]> {
    let query = 'SELECT * FROM research_projects WHERE research_area = $1';
    const params: any[] = [researchArea];

    if (civilizationId) {
      query += ' AND university_id IN (SELECT id FROM universities WHERE civilization_id = $2)';
      params.push(civilizationId);
    }

    query += ' ORDER BY total_funding DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async createResearchProject(projectData: Partial<ResearchProject>): Promise<ResearchProject> {
    const query = `
      INSERT INTO research_projects (
        university_id, department_id, principal_investigator_id, project_title, research_area,
        research_category, funding_source, total_funding, funding_received, project_duration_months,
        start_date, end_date, project_status, research_team_size, expected_outcomes,
        current_progress, publications_generated, patents_filed, industry_applications,
        collaboration_partners
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *
    `;

    const values = [
      projectData.university_id,
      projectData.department_id,
      projectData.principal_investigator_id,
      projectData.project_title,
      projectData.research_area,
      projectData.research_category || 'basic',
      projectData.funding_source || 'government',
      projectData.total_funding || 0,
      projectData.funding_received || 0,
      projectData.project_duration_months || 12,
      projectData.start_date,
      projectData.end_date,
      projectData.project_status || 'proposed',
      projectData.research_team_size || 1,
      JSON.stringify(projectData.expected_outcomes || []),
      projectData.current_progress || 0,
      projectData.publications_generated || 0,
      projectData.patents_filed || 0,
      JSON.stringify(projectData.industry_applications || []),
      JSON.stringify(projectData.collaboration_partners || [])
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  // Research Grant System
  async getResearchGrants(civilizationId: number): Promise<ResearchGrant[]> {
    const result = await this.pool.query(
      'SELECT * FROM research_grants WHERE civilization_id = $1 ORDER BY priority_level DESC, total_allocation DESC',
      [civilizationId]
    );
    return result.rows;
  }

  async createResearchGrant(grantData: Partial<ResearchGrant>): Promise<ResearchGrant> {
    const query = `
      INSERT INTO research_grants (
        civilization_id, grant_program, funding_agency, research_area, priority_level,
        total_allocation, allocated_amount, remaining_budget, application_deadline,
        funding_period_years, eligibility_criteria, evaluation_criteria, success_rate,
        average_grant_size, grants_awarded, applications_received
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const values = [
      grantData.civilization_id,
      grantData.grant_program,
      grantData.funding_agency,
      grantData.research_area,
      grantData.priority_level || 'medium',
      grantData.total_allocation || 0,
      grantData.allocated_amount || 0,
      grantData.remaining_budget || 0,
      grantData.application_deadline,
      grantData.funding_period_years || 3,
      JSON.stringify(grantData.eligibility_criteria || []),
      JSON.stringify(grantData.evaluation_criteria || []),
      grantData.success_rate || 25.0,
      grantData.average_grant_size || 500000,
      grantData.grants_awarded || 0,
      grantData.applications_received || 0
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  // Research Priorities Management
  async getResearchPriorities(civilizationId: number): Promise<ResearchPriority[]> {
    const result = await this.pool.query(
      'SELECT * FROM research_priorities WHERE civilization_id = $1 ORDER BY priority_level DESC, funding_percentage DESC',
      [civilizationId]
    );
    return result.rows;
  }

  async setResearchPriorities(civilizationId: number, priorities: Partial<ResearchPriority>[]): Promise<ResearchPriority[]> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Clear existing priorities
      await client.query('DELETE FROM research_priorities WHERE civilization_id = $1', [civilizationId]);

      // Insert new priorities
      const results = [];
      for (const priority of priorities) {
        const query = `
          INSERT INTO research_priorities (
            civilization_id, research_area, priority_level, funding_percentage,
            strategic_importance, expected_outcomes, timeline_years, success_metrics, leader_notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *
        `;

        const values = [
          civilizationId,
          priority.research_area,
          priority.priority_level || 5,
          priority.funding_percentage || 10.0,
          priority.strategic_importance,
          JSON.stringify(priority.expected_outcomes || []),
          priority.timeline_years || 5,
          JSON.stringify(priority.success_metrics || []),
          priority.leader_notes
        ];

        const result = await client.query(query, values);
        results.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Research Budget Management
  async getResearchBudget(civilizationId: number, fiscalYear?: number): Promise<ResearchBudget | null> {
    let query = 'SELECT * FROM research_budgets WHERE civilization_id = $1';
    const params: any[] = [civilizationId];

    if (fiscalYear) {
      query += ' AND fiscal_year = $2';
      params.push(fiscalYear);
    } else {
      query += ' ORDER BY fiscal_year DESC LIMIT 1';
    }

    const result = await this.pool.query(query, params);
    if (!result.rows[0]) return null;

    const budget = result.rows[0];

    // Get budget categories
    const categoriesResult = await this.pool.query(
      'SELECT * FROM research_budget_categories WHERE budget_id = $1 ORDER BY allocated_amount DESC',
      [budget.id]
    );

    budget.budget_categories = categoriesResult.rows;
    return budget;
  }

  async updateResearchBudget(civilizationId: number, fiscalYear: number, budgetData: Partial<ResearchBudget>): Promise<ResearchBudget> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Update or insert budget
      const budgetQuery = `
        INSERT INTO research_budgets (
          civilization_id, fiscal_year, total_research_budget, allocated_budget, spent_budget,
          emergency_reserve, international_collaboration_fund, infrastructure_investment,
          talent_development_fund, innovation_incentives
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (civilization_id, fiscal_year) 
        DO UPDATE SET
          total_research_budget = EXCLUDED.total_research_budget,
          allocated_budget = EXCLUDED.allocated_budget,
          spent_budget = EXCLUDED.spent_budget,
          emergency_reserve = EXCLUDED.emergency_reserve,
          international_collaboration_fund = EXCLUDED.international_collaboration_fund,
          infrastructure_investment = EXCLUDED.infrastructure_investment,
          talent_development_fund = EXCLUDED.talent_development_fund,
          innovation_incentives = EXCLUDED.innovation_incentives
        RETURNING *
      `;

      const budgetValues = [
        civilizationId,
        fiscalYear,
        budgetData.total_research_budget || 0,
        budgetData.allocated_budget || 0,
        budgetData.spent_budget || 0,
        budgetData.emergency_reserve || 0,
        budgetData.international_collaboration_fund || 0,
        budgetData.infrastructure_investment || 0,
        budgetData.talent_development_fund || 0,
        budgetData.innovation_incentives || 0
      ];

      const budgetResult = await client.query(budgetQuery, budgetValues);
      const budget = budgetResult.rows[0];

      // Update budget categories if provided
      if (budgetData.budget_categories) {
        // Clear existing categories
        await client.query('DELETE FROM research_budget_categories WHERE budget_id = $1', [budget.id]);

        // Insert new categories
        for (const category of budgetData.budget_categories) {
          await client.query(`
            INSERT INTO research_budget_categories (
              budget_id, research_area, allocated_amount, spent_amount, committed_amount,
              priority_level, projects_funded, success_rate
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            budget.id,
            category.research_area,
            category.allocated_amount || 0,
            category.spent_amount || 0,
            category.committed_amount || 0,
            category.priority_level || 5,
            category.projects_funded || 0,
            category.success_rate || 0
          ]);
        }

        // Get updated categories
        const categoriesResult = await client.query(
          'SELECT * FROM research_budget_categories WHERE budget_id = $1 ORDER BY allocated_amount DESC',
          [budget.id]
        );
        budget.budget_categories = categoriesResult.rows;
      }

      await client.query('COMMIT');
      return budget;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Research Dashboard
  async getResearchDashboard(civilizationId: number): Promise<ResearchDashboard> {
    const [
      projectsResult,
      grantsResult,
      prioritiesResult,
      budgetResult
    ] = await Promise.all([
      this.pool.query(`
        SELECT COUNT(*) as total_projects, SUM(total_funding) as total_funding
        FROM research_projects rp
        JOIN universities u ON rp.university_id = u.id
        WHERE u.civilization_id = $1 AND rp.project_status IN ('active', 'funded')
      `, [civilizationId]),
      this.getResearchGrants(civilizationId),
      this.getResearchPriorities(civilizationId),
      this.getResearchBudget(civilizationId)
    ]);

    const projectStats = projectsResult.rows[0];

    return {
      total_projects: parseInt(projectStats.total_projects) || 0,
      total_funding: parseFloat(projectStats.total_funding) || 0,
      active_grants: grantsResult,
      research_priorities: prioritiesResult,
      budget_allocation: budgetResult?.budget_categories || [],
      recent_outputs: [],
      collaboration_stats: {},
      innovation_metrics: {}
    };
  }

  // Education Secretary Management
  async getEducationSecretary(civilizationId: number): Promise<EducationSecretary | null> {
    const result = await this.pool.query(
      'SELECT * FROM education_secretaries WHERE civilization_id = $1 ORDER BY appointment_date DESC LIMIT 1',
      [civilizationId]
    );
    return result.rows[0] || null;
  }

  async updateEducationSecretary(civilizationId: number, updates: Partial<EducationSecretary>): Promise<EducationSecretary | null> {
    const secretary = await this.getEducationSecretary(civilizationId);
    if (!secretary) return null;

    const setClause = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (['policy_priorities', 'key_initiatives', 'achievements', 'challenges_faced'].includes(key)) {
        setClause.push(`${key} = $${paramIndex}`);
        values.push(JSON.stringify(value));
      } else {
        setClause.push(`${key} = $${paramIndex}`);
        values.push(value);
      }
      paramIndex++;
    }

    if (setClause.length === 0) return secretary;

    values.push(secretary.id);

    const query = `
      UPDATE education_secretaries 
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }
}

let educationService: EducationService;

export function initializeEducationService(pool: Pool): void {
  educationService = new EducationService(pool);
  console.log('✅ Education Service initialized');
}

export function getEducationService(): EducationService {
  if (!educationService) {
    throw new Error('Education Service not initialized. Call initializeEducationService first.');
  }
  return educationService;
}
