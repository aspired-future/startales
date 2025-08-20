import { Pool } from 'pg';

export interface ScienceOperation {
  id: string;
  campaignId: number;
  operationType: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  operationData: any;
  targetTechnologies: string[];
  affectedInstitutions: string[];
  budgetImpact: number;
  plannedStartDate?: Date;
  actualStartDate?: Date;
  plannedCompletionDate?: Date;
  actualCompletionDate?: Date;
  successMetrics: any;
  actualOutcomes: any;
  lessonsLearned?: string;
  authorizedBy: string;
  approvalLevel: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResearchBudget {
  id: string;
  campaignId: number;
  fiscalYear: number;
  budgetCategory: string;
  allocatedAmount: number;
  committedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  expectedOutcomes: any;
  actualOutcomes: any;
  roiTarget: number;
  roiActual: number;
  fundingSource: string;
  spendingRestrictions: any;
  performanceRequirements: any;
  reportingRequirements: any;
  multiYearCommitment: boolean;
  commitmentYears: number;
  futureYearAllocations: any;
  approvedBy: string;
  approvalDate: Date;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResearchPriority {
  id: string;
  campaignId: number;
  priorityName: string;
  priorityCategory: string;
  description: string;
  strategicImportance: number;
  urgencyLevel: string;
  budgetAllocationPercentage: number;
  personnelAllocation: number;
  facilityRequirements: any;
  equipmentNeeds: any;
  targetTimelineYears: number;
  keyMilestones: any[];
  successCriteria: any;
  targetTechnologies: string[];
  relatedResearchAreas: string[];
  internationalCollaborationOpportunities: string[];
  expectedEconomicImpact: number;
  expectedSocialImpact?: string;
  expectedSecurityImpact?: string;
  riskAssessment: any;
  status: string;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  setBy: string;
  approvedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InnovationProgram {
  id: string;
  campaignId: number;
  programName: string;
  programType: string;
  description: string;
  objectives: any[];
  targetSectors: string[];
  eligibilityCriteria: any;
  totalBudget: number;
  allocatedBudget: number;
  spentBudget: number;
  participantCapacity: number;
  currentParticipants: number;
  programDurationMonths: number;
  applicationDeadline?: Date;
  programStartDate?: Date;
  programEndDate?: Date;
  successMetrics: any;
  currentPerformance: any;
  participantOutcomes: any;
  programManager: string;
  partnerOrganizations: string[];
  advisoryBoard: string[];
  status: string;
  completionRate: number;
  successRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScientificPolicy {
  id: string;
  campaignId: number;
  policyName: string;
  policyCategory: string;
  policyDescription: string;
  policyText: string;
  scopeOfApplication: string[];
  affectedInstitutions: string[];
  implementationGuidelines: any;
  complianceRequirements: any;
  enforcementMechanisms: any;
  violationPenalties: any;
  effectiveDate: Date;
  expirationDate?: Date;
  reviewFrequencyMonths: number;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  policyLevel: string;
  approvedBy: string;
  approvalDate: Date;
  status: string;
  complianceRate: number;
  violationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResearchInstitution {
  id: string;
  campaignId: number;
  institutionName: string;
  institutionType: string;
  description: string;
  location: string;
  specializationAreas: string[];
  researchCapabilities: any;
  totalPersonnel: number;
  researchPersonnel: number;
  supportPersonnel: number;
  annualBudget: number;
  facilitySizeSqm: number;
  majorEquipment: any[];
  specializedFacilities: any[];
  computingResources: any;
  safetyCertifications: string[];
  activeProjects: number;
  completedProjects: number;
  publicationsPerYear: number;
  patentsFiled: number;
  technologyTransfers: number;
  partnerInstitutions: string[];
  internationalCollaborations: string[];
  industryPartnerships: string[];
  directorName?: string;
  oversightCommittee: string[];
  reportingStructure: any;
  operationalStatus: string;
  securityClearanceLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScienceBudgetAllocation {
  id: string;
  campaignId: number;
  fiscalYear: number;
  basicResearchBudget: number;
  appliedResearchBudget: number;
  developmentBudget: number;
  infrastructureBudget: number;
  personnelBudget: number;
  equipmentBudget: number;
  facilitiesBudget: number;
  collaborationBudget: number;
  innovationProgramsBudget: number;
  totalAllocated: number;
  totalSpent: number;
  totalCommitted: number;
  researchOutputScore: number;
  innovationImpactScore: number;
  collaborationEffectiveness: number;
  approvedBy: string;
  approvalDate: Date;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Science Secretary Service - Manages research policy, innovation, and R&D oversight
 */
export class ScienceSecretaryService {
  constructor(private pool: Pool) {}

  // ===== SCIENCE OPERATIONS MANAGEMENT =====

  async createScienceOperation(params: {
    campaignId: number;
    operationType: string;
    title: string;
    description: string;
    priority?: string;
    operationData?: any;
    targetTechnologies?: string[];
    affectedInstitutions?: string[];
    budgetImpact?: number;
    plannedStartDate?: Date;
    plannedCompletionDate?: Date;
    successMetrics?: any;
    authorizedBy: string;
    approvalLevel?: string;
  }): Promise<ScienceOperation> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO science_operations (
          campaign_id, operation_type, title, description, priority,
          operation_data, target_technologies, affected_institutions,
          budget_impact, planned_start_date, planned_completion_date,
          success_metrics, authorized_by, approval_level
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `, [
        params.campaignId,
        params.operationType,
        params.title,
        params.description,
        params.priority || 'medium',
        JSON.stringify(params.operationData || {}),
        params.targetTechnologies || [],
        params.affectedInstitutions || [],
        params.budgetImpact || 0,
        params.plannedStartDate,
        params.plannedCompletionDate,
        JSON.stringify(params.successMetrics || {}),
        params.authorizedBy,
        params.approvalLevel || 'secretary'
      ]);

      return this.mapScienceOperation(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getScienceOperations(campaignId: number, filters?: {
    operationType?: string;
    status?: string;
    priority?: string;
    limit?: number;
  }): Promise<ScienceOperation[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM science_operations WHERE campaign_id = $1';
      const params: any[] = [campaignId];
      let paramIndex = 2;

      if (filters?.operationType) {
        query += ` AND operation_type = $${paramIndex}`;
        params.push(filters.operationType);
        paramIndex++;
      }

      if (filters?.status) {
        query += ` AND status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      if (filters?.priority) {
        query += ` AND priority = $${paramIndex}`;
        params.push(filters.priority);
        paramIndex++;
      }

      query += ' ORDER BY created_at DESC';

      if (filters?.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(filters.limit);
      }

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapScienceOperation(row));
    } finally {
      client.release();
    }
  }

  async updateScienceOperation(id: string, updates: {
    status?: string;
    actualStartDate?: Date;
    actualCompletionDate?: Date;
    actualOutcomes?: any;
    lessonsLearned?: string;
  }): Promise<ScienceOperation> {
    const client = await this.pool.connect();
    
    try {
      const setParts: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (updates.status !== undefined) {
        setParts.push(`status = $${paramIndex}`);
        params.push(updates.status);
        paramIndex++;
      }

      if (updates.actualStartDate !== undefined) {
        setParts.push(`actual_start_date = $${paramIndex}`);
        params.push(updates.actualStartDate);
        paramIndex++;
      }

      if (updates.actualCompletionDate !== undefined) {
        setParts.push(`actual_completion_date = $${paramIndex}`);
        params.push(updates.actualCompletionDate);
        paramIndex++;
      }

      if (updates.actualOutcomes !== undefined) {
        setParts.push(`actual_outcomes = $${paramIndex}`);
        params.push(JSON.stringify(updates.actualOutcomes));
        paramIndex++;
      }

      if (updates.lessonsLearned !== undefined) {
        setParts.push(`lessons_learned = $${paramIndex}`);
        params.push(updates.lessonsLearned);
        paramIndex++;
      }

      setParts.push(`updated_at = NOW()`);
      params.push(id);

      const result = await client.query(`
        UPDATE science_operations 
        SET ${setParts.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `, params);

      if (result.rows.length === 0) {
        throw new Error(`Science operation with ID ${id} not found`);
      }

      return this.mapScienceOperation(result.rows[0]);
    } finally {
      client.release();
    }
  }

  // ===== RESEARCH BUDGET MANAGEMENT =====

  async allocateResearchBudget(params: {
    campaignId: number;
    fiscalYear: number;
    budgetCategory: string;
    allocatedAmount: number;
    expectedOutcomes?: any;
    fundingSource?: string;
    spendingRestrictions?: any;
    performanceRequirements?: any;
    multiYearCommitment?: boolean;
    commitmentYears?: number;
    approvedBy: string;
  }): Promise<ResearchBudget> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO research_budgets (
          campaign_id, fiscal_year, budget_category, allocated_amount,
          expected_outcomes, funding_source, spending_restrictions,
          performance_requirements, multi_year_commitment, commitment_years,
          approved_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (campaign_id, fiscal_year, budget_category)
        DO UPDATE SET
          allocated_amount = EXCLUDED.allocated_amount,
          expected_outcomes = EXCLUDED.expected_outcomes,
          funding_source = EXCLUDED.funding_source,
          spending_restrictions = EXCLUDED.spending_restrictions,
          performance_requirements = EXCLUDED.performance_requirements,
          multi_year_commitment = EXCLUDED.multi_year_commitment,
          commitment_years = EXCLUDED.commitment_years,
          approved_by = EXCLUDED.approved_by,
          updated_at = NOW()
        RETURNING *
      `, [
        params.campaignId,
        params.fiscalYear,
        params.budgetCategory,
        params.allocatedAmount,
        JSON.stringify(params.expectedOutcomes || {}),
        params.fundingSource || 'general_fund',
        JSON.stringify(params.spendingRestrictions || {}),
        JSON.stringify(params.performanceRequirements || {}),
        params.multiYearCommitment || false,
        params.commitmentYears || 1,
        params.approvedBy
      ]);

      return this.mapResearchBudget(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getResearchBudgets(campaignId: number, fiscalYear?: number): Promise<ResearchBudget[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM research_budgets WHERE campaign_id = $1';
      const params: any[] = [campaignId];

      if (fiscalYear) {
        query += ' AND fiscal_year = $2';
        params.push(fiscalYear);
      }

      query += ' ORDER BY fiscal_year DESC, budget_category';

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapResearchBudget(row));
    } finally {
      client.release();
    }
  }

  // ===== RESEARCH PRIORITIES MANAGEMENT =====

  async setResearchPriority(params: {
    campaignId: number;
    priorityName: string;
    priorityCategory: string;
    description: string;
    strategicImportance: number;
    urgencyLevel?: string;
    budgetAllocationPercentage?: number;
    targetTimelineYears?: number;
    targetTechnologies?: string[];
    expectedEconomicImpact?: number;
    setBy: string;
    approvedBy: string;
  }): Promise<ResearchPriority> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO research_priorities (
          campaign_id, priority_name, priority_category, description,
          strategic_importance, urgency_level, budget_allocation_percentage,
          target_timeline_years, target_technologies, expected_economic_impact,
          set_by, approved_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `, [
        params.campaignId,
        params.priorityName,
        params.priorityCategory,
        params.description,
        params.strategicImportance,
        params.urgencyLevel || 'medium',
        params.budgetAllocationPercentage || 0,
        params.targetTimelineYears || 5,
        params.targetTechnologies || [],
        params.expectedEconomicImpact || 0,
        params.setBy,
        params.approvedBy
      ]);

      return this.mapResearchPriority(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getResearchPriorities(campaignId: number, filters?: {
    category?: string;
    status?: string;
    urgencyLevel?: string;
  }): Promise<ResearchPriority[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM research_priorities WHERE campaign_id = $1';
      const params: any[] = [campaignId];
      let paramIndex = 2;

      if (filters?.category) {
        query += ` AND priority_category = $${paramIndex}`;
        params.push(filters.category);
        paramIndex++;
      }

      if (filters?.status) {
        query += ` AND status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      if (filters?.urgencyLevel) {
        query += ` AND urgency_level = $${paramIndex}`;
        params.push(filters.urgencyLevel);
        paramIndex++;
      }

      query += ' ORDER BY strategic_importance DESC, created_at DESC';

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapResearchPriority(row));
    } finally {
      client.release();
    }
  }

  // ===== INNOVATION PROGRAMS MANAGEMENT =====

  async createInnovationProgram(params: {
    campaignId: number;
    programName: string;
    programType: string;
    description: string;
    objectives?: any[];
    totalBudget: number;
    participantCapacity?: number;
    programDurationMonths?: number;
    programManager: string;
  }): Promise<InnovationProgram> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO innovation_programs (
          campaign_id, program_name, program_type, description,
          objectives, total_budget, participant_capacity,
          program_duration_months, program_manager
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        params.campaignId,
        params.programName,
        params.programType,
        params.description,
        JSON.stringify(params.objectives || []),
        params.totalBudget,
        params.participantCapacity || 0,
        params.programDurationMonths || 12,
        params.programManager
      ]);

      return this.mapInnovationProgram(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getInnovationPrograms(campaignId: number, filters?: {
    programType?: string;
    status?: string;
  }): Promise<InnovationProgram[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM innovation_programs WHERE campaign_id = $1';
      const params: any[] = [campaignId];
      let paramIndex = 2;

      if (filters?.programType) {
        query += ` AND program_type = $${paramIndex}`;
        params.push(filters.programType);
        paramIndex++;
      }

      if (filters?.status) {
        query += ` AND status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      query += ' ORDER BY created_at DESC';

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapInnovationProgram(row));
    } finally {
      client.release();
    }
  }

  // ===== SCIENTIFIC POLICIES MANAGEMENT =====

  async createScientificPolicy(params: {
    campaignId: number;
    policyName: string;
    policyCategory: string;
    policyDescription: string;
    policyText: string;
    effectiveDate: Date;
    approvedBy: string;
    scopeOfApplication?: string[];
    policyLevel?: string;
  }): Promise<ScientificPolicy> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO scientific_policies (
          campaign_id, policy_name, policy_category, policy_description,
          policy_text, effective_date, approved_by, scope_of_application,
          policy_level
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        params.campaignId,
        params.policyName,
        params.policyCategory,
        params.policyDescription,
        params.policyText,
        params.effectiveDate,
        params.approvedBy,
        params.scopeOfApplication || [],
        params.policyLevel || 'departmental'
      ]);

      return this.mapScientificPolicy(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getScientificPolicies(campaignId: number, filters?: {
    category?: string;
    status?: string;
  }): Promise<ScientificPolicy[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM scientific_policies WHERE campaign_id = $1';
      const params: any[] = [campaignId];
      let paramIndex = 2;

      if (filters?.category) {
        query += ` AND policy_category = $${paramIndex}`;
        params.push(filters.category);
        paramIndex++;
      }

      if (filters?.status) {
        query += ` AND status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      query += ' ORDER BY effective_date DESC';

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapScientificPolicy(row));
    } finally {
      client.release();
    }
  }

  // ===== RESEARCH INSTITUTIONS MANAGEMENT =====

  async registerResearchInstitution(params: {
    campaignId: number;
    institutionName: string;
    institutionType: string;
    description: string;
    location: string;
    specializationAreas?: string[];
    annualBudget?: number;
    directorName?: string;
  }): Promise<ResearchInstitution> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO research_institutions (
          campaign_id, institution_name, institution_type, description,
          location, specialization_areas, annual_budget, director_name
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        params.campaignId,
        params.institutionName,
        params.institutionType,
        params.description,
        params.location,
        params.specializationAreas || [],
        params.annualBudget || 0,
        params.directorName
      ]);

      return this.mapResearchInstitution(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getResearchInstitutions(campaignId: number, filters?: {
    institutionType?: string;
    operationalStatus?: string;
  }): Promise<ResearchInstitution[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM research_institutions WHERE campaign_id = $1';
      const params: any[] = [campaignId];
      let paramIndex = 2;

      if (filters?.institutionType) {
        query += ` AND institution_type = $${paramIndex}`;
        params.push(filters.institutionType);
        paramIndex++;
      }

      if (filters?.operationalStatus) {
        query += ` AND operational_status = $${paramIndex}`;
        params.push(filters.operationalStatus);
        paramIndex++;
      }

      query += ' ORDER BY institution_name';

      const result = await client.query(query, params);
      return result.rows.map(row => this.mapResearchInstitution(row));
    } finally {
      client.release();
    }
  }

  // ===== ANALYTICS AND REPORTING =====

  async getScienceAnalytics(campaignId: number): Promise<{
    totalRnDBudget: number;
    activeProjects: number;
    completedProjects: number;
    innovationPrograms: number;
    researchInstitutions: number;
    activePolicies: number;
    budgetUtilization: number;
    researchOutputScore: number;
    innovationImpactScore: number;
    collaborationEffectiveness: number;
  }> {
    const client = await this.pool.connect();
    
    try {
      const [budgetResult, operationsResult, programsResult, institutionsResult, policiesResult] = await Promise.all([
        client.query(`
          SELECT 
            COALESCE(SUM(total_allocated), 0) as total_budget,
            COALESCE(SUM(total_spent), 0) as total_spent,
            COALESCE(AVG(research_output_score), 0) as avg_research_score,
            COALESCE(AVG(innovation_impact_score), 0) as avg_innovation_score,
            COALESCE(AVG(collaboration_effectiveness), 0) as avg_collaboration
          FROM science_budget_allocations 
          WHERE campaign_id = $1
        `, [campaignId]),
        
        client.query(`
          SELECT 
            COUNT(*) FILTER (WHERE status IN ('in_progress', 'planned')) as active_projects,
            COUNT(*) FILTER (WHERE status = 'completed') as completed_projects
          FROM science_operations 
          WHERE campaign_id = $1
        `, [campaignId]),
        
        client.query(`
          SELECT COUNT(*) as innovation_programs
          FROM innovation_programs 
          WHERE campaign_id = $1 AND status IN ('active', 'recruiting')
        `, [campaignId]),
        
        client.query(`
          SELECT COUNT(*) as research_institutions
          FROM research_institutions 
          WHERE campaign_id = $1 AND operational_status = 'operational'
        `, [campaignId]),
        
        client.query(`
          SELECT COUNT(*) as active_policies
          FROM scientific_policies 
          WHERE campaign_id = $1 AND status = 'active'
        `, [campaignId])
      ]);

      const budget = budgetResult.rows[0];
      const operations = operationsResult.rows[0];
      const programs = programsResult.rows[0];
      const institutions = institutionsResult.rows[0];
      const policies = policiesResult.rows[0];

      return {
        totalRnDBudget: parseFloat(budget.total_budget) || 0,
        activeProjects: parseInt(operations.active_projects) || 0,
        completedProjects: parseInt(operations.completed_projects) || 0,
        innovationPrograms: parseInt(programs.innovation_programs) || 0,
        researchInstitutions: parseInt(institutions.research_institutions) || 0,
        activePolicies: parseInt(policies.active_policies) || 0,
        budgetUtilization: budget.total_budget > 0 ? (parseFloat(budget.total_spent) / parseFloat(budget.total_budget)) * 100 : 0,
        researchOutputScore: parseFloat(budget.avg_research_score) || 0,
        innovationImpactScore: parseFloat(budget.avg_innovation_score) || 0,
        collaborationEffectiveness: parseFloat(budget.avg_collaboration) || 0
      };
    } finally {
      client.release();
    }
  }

  // ===== PRIVATE HELPER METHODS =====

  private mapScienceOperation(row: any): ScienceOperation {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      operationType: row.operation_type,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      operationData: row.operation_data,
      targetTechnologies: row.target_technologies,
      affectedInstitutions: row.affected_institutions,
      budgetImpact: parseFloat(row.budget_impact),
      plannedStartDate: row.planned_start_date,
      actualStartDate: row.actual_start_date,
      plannedCompletionDate: row.planned_completion_date,
      actualCompletionDate: row.actual_completion_date,
      successMetrics: row.success_metrics,
      actualOutcomes: row.actual_outcomes,
      lessonsLearned: row.lessons_learned,
      authorizedBy: row.authorized_by,
      approvalLevel: row.approval_level,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapResearchBudget(row: any): ResearchBudget {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      fiscalYear: row.fiscal_year,
      budgetCategory: row.budget_category,
      allocatedAmount: parseFloat(row.allocated_amount),
      committedAmount: parseFloat(row.committed_amount),
      spentAmount: parseFloat(row.spent_amount),
      remainingAmount: parseFloat(row.remaining_amount),
      expectedOutcomes: row.expected_outcomes,
      actualOutcomes: row.actual_outcomes,
      roiTarget: parseFloat(row.roi_target),
      roiActual: parseFloat(row.roi_actual),
      fundingSource: row.funding_source,
      spendingRestrictions: row.spending_restrictions,
      performanceRequirements: row.performance_requirements,
      reportingRequirements: row.reporting_requirements,
      multiYearCommitment: row.multi_year_commitment,
      commitmentYears: row.commitment_years,
      futureYearAllocations: row.future_year_allocations,
      approvedBy: row.approved_by,
      approvalDate: row.approval_date,
      lastReviewDate: row.last_review_date,
      nextReviewDate: row.next_review_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapResearchPriority(row: any): ResearchPriority {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      priorityName: row.priority_name,
      priorityCategory: row.priority_category,
      description: row.description,
      strategicImportance: row.strategic_importance,
      urgencyLevel: row.urgency_level,
      budgetAllocationPercentage: parseFloat(row.budget_allocation_percentage),
      personnelAllocation: row.personnel_allocation,
      facilityRequirements: row.facility_requirements,
      equipmentNeeds: row.equipment_needs,
      targetTimelineYears: row.target_timeline_years,
      keyMilestones: row.key_milestones,
      successCriteria: row.success_criteria,
      targetTechnologies: row.target_technologies,
      relatedResearchAreas: row.related_research_areas,
      internationalCollaborationOpportunities: row.international_collaboration_opportunities,
      expectedEconomicImpact: parseFloat(row.expected_economic_impact),
      expectedSocialImpact: row.expected_social_impact,
      expectedSecurityImpact: row.expected_security_impact,
      riskAssessment: row.risk_assessment,
      status: row.status,
      lastReviewDate: row.last_review_date,
      nextReviewDate: row.next_review_date,
      setBy: row.set_by,
      approvedBy: row.approved_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapInnovationProgram(row: any): InnovationProgram {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      programName: row.program_name,
      programType: row.program_type,
      description: row.description,
      objectives: row.objectives,
      targetSectors: row.target_sectors,
      eligibilityCriteria: row.eligibility_criteria,
      totalBudget: parseFloat(row.total_budget),
      allocatedBudget: parseFloat(row.allocated_budget),
      spentBudget: parseFloat(row.spent_budget),
      participantCapacity: row.participant_capacity,
      currentParticipants: row.current_participants,
      programDurationMonths: row.program_duration_months,
      applicationDeadline: row.application_deadline,
      programStartDate: row.program_start_date,
      programEndDate: row.program_end_date,
      successMetrics: row.success_metrics,
      currentPerformance: row.current_performance,
      participantOutcomes: row.participant_outcomes,
      programManager: row.program_manager,
      partnerOrganizations: row.partner_organizations,
      advisoryBoard: row.advisory_board,
      status: row.status,
      completionRate: parseFloat(row.completion_rate),
      successRate: parseFloat(row.success_rate),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapScientificPolicy(row: any): ScientificPolicy {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      policyName: row.policy_name,
      policyCategory: row.policy_category,
      policyDescription: row.policy_description,
      policyText: row.policy_text,
      scopeOfApplication: row.scope_of_application,
      affectedInstitutions: row.affected_institutions,
      implementationGuidelines: row.implementation_guidelines,
      complianceRequirements: row.compliance_requirements,
      enforcementMechanisms: row.enforcement_mechanisms,
      violationPenalties: row.violation_penalties,
      effectiveDate: row.effective_date,
      expirationDate: row.expiration_date,
      reviewFrequencyMonths: row.review_frequency_months,
      lastReviewDate: row.last_review_date,
      nextReviewDate: row.next_review_date,
      policyLevel: row.policy_level,
      approvedBy: row.approved_by,
      approvalDate: row.approval_date,
      status: row.status,
      complianceRate: parseFloat(row.compliance_rate),
      violationCount: row.violation_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapResearchInstitution(row: any): ResearchInstitution {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      institutionName: row.institution_name,
      institutionType: row.institution_type,
      description: row.description,
      location: row.location,
      specializationAreas: row.specialization_areas,
      researchCapabilities: row.research_capabilities,
      totalPersonnel: row.total_personnel,
      researchPersonnel: row.research_personnel,
      supportPersonnel: row.support_personnel,
      annualBudget: parseFloat(row.annual_budget),
      facilitySizeSqm: row.facility_size_sqm,
      majorEquipment: row.major_equipment,
      specializedFacilities: row.specialized_facilities,
      computingResources: row.computing_resources,
      safetyCertifications: row.safety_certifications,
      activeProjects: row.active_projects,
      completedProjects: row.completed_projects,
      publicationsPerYear: row.publications_per_year,
      patentsFiled: row.patents_filed,
      technologyTransfers: row.technology_transfers,
      partnerInstitutions: row.partner_institutions,
      internationalCollaborations: row.international_collaborations,
      industryPartnerships: row.industry_partnerships,
      directorName: row.director_name,
      oversightCommittee: row.oversight_committee,
      reportingStructure: row.reporting_structure,
      operationalStatus: row.operational_status,
      securityClearanceLevel: row.security_clearance_level,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}
