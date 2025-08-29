/**
 * Justice Secretary Service - Attorney General Operations
 * 
 * Provides operational control over the justice system including law enforcement oversight,
 * judicial administration, legal policy implementation, and justice system performance management.
 * Integrates with existing legal system infrastructure while providing cabinet-level authority.
 */

import { Pool } from 'pg';
import { LegalEngine } from '../legal/LegalEngine';
import { LegalAnalytics } from '../legal/LegalAnalytics';
import {
  JusticeOperation,
  JudicialAppointment,
  JusticePolicy,
  AgencyOversight,
  JusticePerformanceMetrics,
  JusticeBudgetAllocation
} from './justiceSchema';

export class JusticeSecretaryService {
  private pool: Pool;
  private legalEngine: LegalEngine;
  private legalAnalytics: LegalAnalytics;

  constructor(pool: Pool) {
    this.pool = pool;
    this.legalEngine = new LegalEngine();
    this.legalAnalytics = new LegalAnalytics();
  }

  /**
   * Get comprehensive justice system status
   */
  async getJusticeSystemStatus(civilizationId: string): Promise<{
    systemHealth: any;
    activeOperations: JusticeOperation[];
    performanceMetrics: JusticePerformanceMetrics | null;
    budgetStatus: any;
    recentActivity: any[];
  }> {
    const client = await this.pool.connect();
    
    try {
      // Get system health from legal analytics
      const legalCases = this.legalEngine.getAllLegalCases();
      const courts = this.legalEngine.getAllCourts();
      const crimes = this.legalEngine.getAllCrimes();
      const corruptionCases = this.legalEngine.getAllCorruptionCases();
      const agencies = this.legalEngine.getAllLawEnforcementAgencies();

      const systemHealth = this.legalAnalytics.generateComprehensiveAnalytics(
        civilizationId,
        legalCases,
        courts,
        crimes,
        corruptionCases,
        agencies
      );

      // Get active operations
      const operationsResult = await client.query(`
        SELECT * FROM justice_operations 
        WHERE civilization_id = $1 AND status IN ('planned', 'in_progress')
        ORDER BY priority DESC, created_at DESC
        LIMIT 10
      `, [civilizationId]);

      // Get latest performance metrics
      const metricsResult = await client.query(`
        SELECT * FROM justice_performance_metrics 
        WHERE civilization_id = $1 
        ORDER BY metric_date DESC 
        LIMIT 1
      `, [civilizationId]);

      // Get budget status
      const budgetResult = await client.query(`
        SELECT 
          category,
          SUM(allocated_amount) as total_allocated,
          SUM(spent_amount) as total_spent,
          SUM(remaining_amount) as total_remaining,
          AVG(effectiveness_score) as avg_effectiveness
        FROM justice_budget_allocations 
        WHERE civilization_id = $1 AND fiscal_year = $2
        GROUP BY category
      `, [civilizationId, new Date().getFullYear()]);

      // Get recent activity
      const activityResult = await client.query(`
        (SELECT 'operation' as type, title, created_at, status as activity_status FROM justice_operations WHERE civilization_id = $1)
        UNION ALL
        (SELECT 'appointment' as type, position_title as title, created_at, confirmation_status as activity_status FROM judicial_appointments WHERE civilization_id = $1)
        UNION ALL
        (SELECT 'policy' as type, policy_name as title, created_at, implementation_status as activity_status FROM justice_policies WHERE civilization_id = $1)
        ORDER BY created_at DESC
        LIMIT 20
      `, [civilizationId]);

      return {
        systemHealth,
        activeOperations: operationsResult.rows,
        performanceMetrics: metricsResult.rows[0] || null,
        budgetStatus: budgetResult.rows,
        recentActivity: activityResult.rows
      };

    } finally {
      client.release();
    }
  }

  /**
   * Create new justice operation
   */
  async createOperation(
    civilizationId: string,
    operationData: Partial<JusticeOperation>
  ): Promise<JusticeOperation> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO justice_operations (
          civilization_id, operation_type, title, description, target_entity,
          priority, budget_allocated, expected_outcome
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        civilizationId,
        operationData.operation_type,
        operationData.title,
        operationData.description,
        operationData.target_entity,
        operationData.priority || 5,
        operationData.budget_allocated || 0,
        operationData.expected_outcome
      ]);

      const operation = result.rows[0];

      // If this is a policy implementation, create corresponding policy record
      if (operation.operation_type === 'policy_implementation') {
        await this.createPolicyFromOperation(civilizationId, operation);
      }

      return operation;

    } finally {
      client.release();
    }
  }

  /**
   * Update operation status and outcomes
   */
  async updateOperation(
    operationId: string,
    updates: Partial<JusticeOperation>
  ): Promise<JusticeOperation> {
    const client = await this.pool.connect();
    
    try {
      const setClause = [];
      const values = [];
      let paramCount = 1;

      if (updates.status !== undefined) {
        setClause.push(`status = $${paramCount++}`);
        values.push(updates.status);
      }
      if (updates.actual_outcome !== undefined) {
        setClause.push(`actual_outcome = $${paramCount++}`);
        values.push(updates.actual_outcome);
      }
      if (updates.effectiveness_score !== undefined) {
        setClause.push(`effectiveness_score = $${paramCount++}`);
        values.push(updates.effectiveness_score);
      }
      if (updates.status === 'completed') {
        setClause.push(`completed_at = CURRENT_TIMESTAMP`);
      }

      values.push(operationId);

      const result = await client.query(`
        UPDATE justice_operations 
        SET ${setClause.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `, values);

      return result.rows[0];

    } finally {
      client.release();
    }
  }

  /**
   * Nominate judge for judicial appointment
   */
  async nominateJudge(
    civilizationId: string,
    appointmentData: Partial<JudicialAppointment>
  ): Promise<JudicialAppointment> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO judicial_appointments (
          civilization_id, court_id, position_title, nominee_name, nominee_background,
          specialization, philosophy, approval_rating
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        civilizationId,
        appointmentData.court_id,
        appointmentData.position_title,
        appointmentData.nominee_name,
        appointmentData.nominee_background,
        appointmentData.specialization || [],
        appointmentData.philosophy || 'moderate',
        appointmentData.approval_rating || 70
      ]);

      const appointment = result.rows[0];

      // Create corresponding operation record
      await this.createOperation(civilizationId, {
        operation_type: 'appointment',
        title: `Judicial Appointment: ${appointment.nominee_name}`,
        description: `Nomination of ${appointment.nominee_name} for ${appointment.position_title}`,
        target_entity: appointment.court_id,
        priority: 7,
        expected_outcome: 'Confirmed judicial appointment enhancing court capacity'
      });

      return appointment;

    } finally {
      client.release();
    }
  }

  /**
   * Confirm judicial appointment
   */
  async confirmAppointment(
    appointmentId: string,
    voteFor: number,
    voteAgainst: number
  ): Promise<JudicialAppointment> {
    const client = await this.pool.connect();
    
    try {
      const status = voteFor > voteAgainst ? 'confirmed' : 'rejected';
      
      const result = await client.query(`
        UPDATE judicial_appointments 
        SET 
          confirmation_status = $1,
          confirmation_vote_for = $2,
          confirmation_vote_against = $3,
          confirmed_at = CASE WHEN $1 = 'confirmed' THEN CURRENT_TIMESTAMP ELSE NULL END
        WHERE id = $4
        RETURNING *
      `, [status, voteFor, voteAgainst, appointmentId]);

      const appointment = result.rows[0];

      // If confirmed, integrate with legal system
      if (status === 'confirmed') {
        await this.integrateJudgeWithLegalSystem(appointment);
      }

      return appointment;

    } finally {
      client.release();
    }
  }

  /**
   * Create and implement justice policy
   */
  async createPolicy(
    civilizationId: string,
    policyData: Partial<JusticePolicy>
  ): Promise<JusticePolicy> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO justice_policies (
          civilization_id, policy_name, policy_type, description, target_agencies,
          budget_required, expected_impact, public_support
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        civilizationId,
        policyData.policy_name,
        policyData.policy_type,
        policyData.description,
        policyData.target_agencies || [],
        policyData.budget_required || 0,
        policyData.expected_impact,
        policyData.public_support || 50
      ]);

      return result.rows[0];

    } finally {
      client.release();
    }
  }

  /**
   * Implement justice policy
   */
  async implementPolicy(policyId: string): Promise<{
    policy: JusticePolicy;
    operation: JusticeOperation;
  }> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update policy status
      const policyResult = await client.query(`
        UPDATE justice_policies 
        SET implementation_status = 'implementing', implemented_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `, [policyId]);

      const policy = policyResult.rows[0];

      // Create implementation operation
      const operationResult = await client.query(`
        INSERT INTO justice_operations (
          civilization_id, operation_type, title, description, 
          priority, budget_allocated, expected_outcome
        ) VALUES ($1, 'policy_implementation', $2, $3, $4, $5, $6)
        RETURNING *
      `, [
        policy.civilization_id,
        `Implement ${policy.policy_name}`,
        `Implementation of ${policy.policy_name} policy`,
        8,
        policy.budget_required,
        policy.expected_impact
      ]);

      await client.query('COMMIT');

      return {
        policy,
        operation: operationResult.rows[0]
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Initiate agency oversight
   */
  async initiateOversight(
    civilizationId: string,
    oversightData: Partial<AgencyOversight>
  ): Promise<AgencyOversight> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO agency_oversight (
          civilization_id, agency_id, oversight_type, title, description,
          severity, public_disclosure, budget_impact
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        civilizationId,
        oversightData.agency_id,
        oversightData.oversight_type,
        oversightData.title,
        oversightData.description,
        oversightData.severity || 'routine',
        oversightData.public_disclosure || false,
        oversightData.budget_impact || 0
      ]);

      const oversight = result.rows[0];

      // Create corresponding operation
      await this.createOperation(civilizationId, {
        operation_type: 'oversight',
        title: oversight.title,
        description: oversight.description,
        target_entity: oversight.agency_id,
        priority: oversight.severity === 'critical' ? 10 : oversight.severity === 'serious' ? 8 : 6,
        expected_outcome: 'Improved agency performance and accountability'
      });

      return oversight;

    } finally {
      client.release();
    }
  }

  /**
   * Complete oversight with findings and recommendations
   */
  async completeOversight(
    oversightId: string,
    findings: string,
    recommendations: string[],
    correctiveActions: string[]
  ): Promise<AgencyOversight> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        UPDATE agency_oversight 
        SET 
          status = 'completed',
          findings = $1,
          recommendations = $2,
          corrective_actions = $3,
          completed_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *
      `, [findings, recommendations, correctiveActions, oversightId]);

      const oversight = result.rows[0];

      // Apply corrective actions to legal system if needed
      await this.applyCorrectiveActions(oversight);

      return oversight;

    } finally {
      client.release();
    }
  }

  /**
   * Generate comprehensive justice analytics
   */
  async generateJusticeAnalytics(civilizationId: string): Promise<{
    systemAnalytics: any;
    performanceTrends: any;
    budgetAnalysis: any;
    recommendations: string[];
    insights: string[];
  }> {
    const client = await this.pool.connect();
    
    try {
      // Get legal system analytics
      const legalCases = this.legalEngine.getAllLegalCases();
      const courts = this.legalEngine.getAllCourts();
      const crimes = this.legalEngine.getAllCrimes();
      const corruptionCases = this.legalEngine.getAllCorruptionCases();
      const agencies = this.legalEngine.getAllLawEnforcementAgencies();

      const systemAnalytics = this.legalAnalytics.generateComprehensiveAnalytics(
        civilizationId,
        legalCases,
        courts,
        crimes,
        corruptionCases,
        agencies
      );

      // Get performance trends
      const trendsResult = await client.query(`
        SELECT 
          metric_date,
          overall_justice_health,
          crime_clearance_rate,
          court_efficiency,
          public_trust,
          corruption_level
        FROM justice_performance_metrics 
        WHERE civilization_id = $1 
        ORDER BY metric_date DESC 
        LIMIT 12
      `, [civilizationId]);

      // Get budget analysis
      const budgetResult = await client.query(`
        SELECT 
          category,
          SUM(allocated_amount) as allocated,
          SUM(spent_amount) as spent,
          AVG(effectiveness_score) as effectiveness
        FROM justice_budget_allocations 
        WHERE civilization_id = $1 AND fiscal_year = $2
        GROUP BY category
      `, [civilizationId, new Date().getFullYear()]);

      const recommendations = this.legalAnalytics.generateRecommendations(systemAnalytics);
      const insights = this.legalAnalytics.generateInsights(systemAnalytics);

      return {
        systemAnalytics,
        performanceTrends: trendsResult.rows,
        budgetAnalysis: budgetResult.rows,
        recommendations,
        insights
      };

    } finally {
      client.release();
    }
  }

  /**
   * Allocate justice department budget
   */
  async allocateBudget(
    civilizationId: string,
    allocations: Array<{
      category: string;
      subcategory?: string;
      amount: number;
      justification?: string;
    }>
  ): Promise<JusticeBudgetAllocation[]> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const results = [];
      const currentYear = new Date().getFullYear();

      for (const allocation of allocations) {
        const result = await client.query(`
          INSERT INTO justice_budget_allocations (
            civilization_id, fiscal_year, category, subcategory,
            allocated_amount, remaining_amount, justification
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `, [
          civilizationId,
          currentYear,
          allocation.category,
          allocation.subcategory,
          allocation.amount,
          allocation.amount,
          allocation.justification
        ]);

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

  /**
   * Record performance metrics
   */
  async recordPerformanceMetrics(
    civilizationId: string,
    metrics: Partial<JusticePerformanceMetrics>
  ): Promise<JusticePerformanceMetrics> {
    const client = await this.pool.connect();
    
    try {
      // Get current metrics from legal system
      const legalCases = this.legalEngine.getAllLegalCases();
      const courts = this.legalEngine.getAllCourts();
      const crimes = this.legalEngine.getAllCrimes();
      const corruptionCases = this.legalEngine.getAllCorruptionCases();
      const agencies = this.legalEngine.getAllLawEnforcementAgencies();

      const analytics = this.legalAnalytics.generateComprehensiveAnalytics(
        civilizationId,
        legalCases,
        courts,
        crimes,
        corruptionCases,
        agencies
      );

      const result = await client.query(`
        INSERT INTO justice_performance_metrics (
          civilization_id, metric_date, overall_justice_health, crime_clearance_rate,
          court_efficiency, public_trust, corruption_level, law_enforcement_effectiveness,
          case_backlog, average_case_processing_days, victim_satisfaction,
          community_safety_index, constitutional_compliance
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `, [
        civilizationId,
        new Date().toISOString().split('T')[0],
        Math.round(analytics.justiceHealth.overallScore),
        analytics.crimeStatistics.clearanceRate,
        Math.round(analytics.courtPerformance.clearanceRate),
        Math.round(analytics.lawEnforcement.performance.communityTrust),
        Math.round(analytics.corruptionMetrics.reportedCases / 10), // Scale to 0-100
        Math.round(analytics.lawEnforcement.performance.publicSafety),
        analytics.courtPerformance.caseBacklog,
        Math.round(analytics.courtPerformance.averageProcessingTime),
        metrics.victim_satisfaction || 70,
        metrics.community_safety_index || 75,
        metrics.constitutional_compliance || 90
      ]);

      return result.rows[0];

    } finally {
      client.release();
    }
  }

  // Private helper methods

  private async createPolicyFromOperation(
    civilizationId: string,
    operation: JusticeOperation
  ): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query(`
        INSERT INTO justice_policies (
          civilization_id, policy_name, policy_type, description,
          implementation_status, expected_impact, public_support
        ) VALUES ($1, $2, 'law_enforcement', $3, 'implementing', $4, 60)
      `, [
        civilizationId,
        operation.title,
        operation.description,
        operation.expected_outcome
      ]);
    } finally {
      client.release();
    }
  }

  private async integrateJudgeWithLegalSystem(appointment: JudicialAppointment): Promise<void> {
    // Find the court and add the judge
    const court = this.legalEngine.getCourt(appointment.court_id);
    if (court) {
      court.judges.push({
        id: `judge_${appointment.id}`,
        name: appointment.nominee_name,
        title: appointment.position_title,
        appointmentDate: appointment.appointment_date || new Date(),
        experience: 0, // New appointment
        specialization: appointment.specialization,
        philosophy: appointment.philosophy,
        approval: appointment.approval_rating
      });
    }
  }

  private async applyCorrectiveActions(oversight: AgencyOversight): Promise<void> {
    // Apply corrective actions to the legal system
    const agency = this.legalEngine.getLawEnforcementAgency(oversight.agency_id);
    if (agency && oversight.corrective_actions.length > 0) {
      // Simulate improvement in agency metrics
      agency.performance.communityTrust = Math.min(100, agency.performance.communityTrust + 5);
      agency.performance.publicSafety = Math.min(100, agency.performance.publicSafety + 3);
      
      // Add oversight to agency record
      if (!agency.oversight.externalOversight.includes('Justice Department')) {
        agency.oversight.externalOversight.push('Justice Department');
      }
    }
  }

  /**
   * Get all operations for a civilization
   */
  async getOperations(
    civilizationId: string,
    filters?: {
      type?: string;
      status?: string;
      limit?: number;
    }
  ): Promise<JusticeOperation[]> {
    const client = await this.pool.connect();
    
    try {
      let query = 'SELECT * FROM justice_operations WHERE civilization_id = $1';
      const params = [civilizationId];
      let paramCount = 2;

      if (filters?.type) {
        query += ` AND operation_type = $${paramCount++}`;
        params.push(filters.type);
      }

      if (filters?.status) {
        query += ` AND status = $${paramCount++}`;
        params.push(filters.status);
      }

      query += ' ORDER BY priority DESC, created_at DESC';

      if (filters?.limit) {
        query += ` LIMIT $${paramCount}`;
        params.push(filters.limit.toString());
      }

      const result = await client.query(query, params);
      return result.rows;

    } finally {
      client.release();
    }
  }

  /**
   * Get all judicial appointments for a civilization
   */
  async getAppointments(civilizationId: string): Promise<JudicialAppointment[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT * FROM judicial_appointments 
        WHERE civilization_id = $1 
        ORDER BY created_at DESC
      `, [civilizationId]);

      return result.rows;

    } finally {
      client.release();
    }
  }

  /**
   * Get all justice policies for a civilization
   */
  async getPolicies(civilizationId: string): Promise<JusticePolicy[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT * FROM justice_policies 
        WHERE civilization_id = $1 
        ORDER BY created_at DESC
      `, [civilizationId]);

      return result.rows;

    } finally {
      client.release();
    }
  }

  /**
   * Get all oversight activities for a civilization
   */
  async getOversightActivities(civilizationId: string): Promise<AgencyOversight[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT * FROM agency_oversight 
        WHERE civilization_id = $1 
        ORDER BY created_at DESC
      `, [civilizationId]);

      return result.rows;

    } finally {
      client.release();
    }
  }
}
