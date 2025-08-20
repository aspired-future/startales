import { Pool } from 'pg';
import { 
  JointChief, 
  MilitaryService, 
  StrategicPlan, 
  JointOperation, 
  CommandRecommendation 
} from './jointChiefsSchema.js';

export class JointChiefsService {
  constructor(private pool: Pool) {}

  // Joint Chiefs Management
  async getJointChiefs(civilizationId: number): Promise<JointChief[]> {
    const query = `
      SELECT * FROM joint_chiefs 
      WHERE civilization_id = $1 
      ORDER BY 
        CASE position 
          WHEN 'chairman' THEN 1 
          WHEN 'vice_chairman' THEN 2 
          WHEN 'service_chief' THEN 3 
        END,
        service_branch
    `;
    const result = await this.pool.query(query, [civilizationId]);
    return result.rows;
  }

  async getJointChief(id: number): Promise<JointChief | null> {
    const query = 'SELECT * FROM joint_chiefs WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async appointJointChief(appointment: Partial<JointChief>): Promise<JointChief> {
    const query = `
      INSERT INTO joint_chiefs (
        civilization_id, position, service_branch, name, rank,
        years_of_service, specializations, background
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      appointment.civilization_id,
      appointment.position,
      appointment.service_branch,
      appointment.name,
      appointment.rank,
      appointment.years_of_service || 0,
      appointment.specializations || [],
      appointment.background
    ]);
    return result.rows[0];
  }

  async updateJointChief(id: number, updates: Partial<JointChief>): Promise<JointChief> {
    const setClause = Object.keys(updates)
      .filter(key => key !== 'id' && updates[key as keyof JointChief] !== undefined)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.keys(updates)
      .filter(key => key !== 'id' && updates[key as keyof JointChief] !== undefined)
      .map(key => updates[key as keyof JointChief]);

    const query = `
      UPDATE joint_chiefs 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await this.pool.query(query, [id, ...values]);
    return result.rows[0];
  }

  async retireJointChief(id: number): Promise<void> {
    const query = `
      UPDATE joint_chiefs 
      SET status = 'retired', updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1
    `;
    await this.pool.query(query, [id]);
  }

  // Military Services Management
  async getMilitaryServices(civilizationId: number): Promise<MilitaryService[]> {
    const query = `
      SELECT ms.*, jc.name as chief_name, jc.rank as chief_rank
      FROM military_services ms
      LEFT JOIN joint_chiefs jc ON ms.chief_id = jc.id
      WHERE ms.civilization_id = $1
      ORDER BY ms.service_name
    `;
    const result = await this.pool.query(query, [civilizationId]);
    return result.rows;
  }

  async getMilitaryService(civilizationId: number, serviceCode: string): Promise<MilitaryService | null> {
    const query = `
      SELECT ms.*, jc.name as chief_name, jc.rank as chief_rank
      FROM military_services ms
      LEFT JOIN joint_chiefs jc ON ms.chief_id = jc.id
      WHERE ms.civilization_id = $1 AND ms.service_code = $2
    `;
    const result = await this.pool.query(query, [civilizationId, serviceCode]);
    return result.rows[0] || null;
  }

  async updateMilitaryService(civilizationId: number, serviceCode: string, updates: Partial<MilitaryService>): Promise<MilitaryService> {
    const setClause = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'civilization_id' && key !== 'service_code' && updates[key as keyof MilitaryService] !== undefined)
      .map((key, index) => `${key} = $${index + 3}`)
      .join(', ');
    
    const values = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'civilization_id' && key !== 'service_code' && updates[key as keyof MilitaryService] !== undefined)
      .map(key => updates[key as keyof MilitaryService]);

    const query = `
      UPDATE military_services 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE civilization_id = $1 AND service_code = $2 
      RETURNING *
    `;
    const result = await this.pool.query(query, [civilizationId, serviceCode, ...values]);
    return result.rows[0];
  }

  // Strategic Planning
  async getStrategicPlans(civilizationId: number, filters?: { status?: string; priority?: string }): Promise<StrategicPlan[]> {
    let query = `
      SELECT sp.*, jc.name as created_by_name, jc.rank as created_by_rank
      FROM strategic_plans sp
      LEFT JOIN joint_chiefs jc ON sp.created_by = jc.id
      WHERE sp.civilization_id = $1
    `;
    const params = [civilizationId];
    let paramIndex = 2;

    if (filters?.status) {
      query += ` AND sp.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.priority) {
      query += ` AND sp.priority_level = $${paramIndex}`;
      params.push(filters.priority);
      paramIndex++;
    }

    query += ' ORDER BY sp.priority_level DESC, sp.created_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async createStrategicPlan(plan: Partial<StrategicPlan>): Promise<StrategicPlan> {
    const query = `
      INSERT INTO strategic_plans (
        civilization_id, plan_name, plan_type, priority_level,
        lead_service, participating_services, objectives, timeline_months,
        resource_requirements, risk_assessment, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      plan.civilization_id,
      plan.plan_name,
      plan.plan_type,
      plan.priority_level || 'medium',
      plan.lead_service,
      plan.participating_services || [],
      plan.objectives || [],
      plan.timeline_months,
      JSON.stringify(plan.resource_requirements || {}),
      plan.risk_assessment,
      plan.created_by
    ]);
    return result.rows[0];
  }

  async approveStrategicPlan(planId: number, approverId: string): Promise<StrategicPlan> {
    const query = `
      UPDATE strategic_plans 
      SET 
        status = 'approved',
        approved_by = array_append(approved_by, $2),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *
    `;
    const result = await this.pool.query(query, [planId, approverId]);
    return result.rows[0];
  }

  async updateStrategicPlan(planId: number, updates: Partial<StrategicPlan>): Promise<StrategicPlan> {
    const setClause = Object.keys(updates)
      .filter(key => key !== 'id' && updates[key as keyof StrategicPlan] !== undefined)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.keys(updates)
      .filter(key => key !== 'id' && updates[key as keyof StrategicPlan] !== undefined)
      .map(key => {
        const value = updates[key as keyof StrategicPlan];
        return key === 'resource_requirements' ? JSON.stringify(value) : value;
      });

    const query = `
      UPDATE strategic_plans 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await this.pool.query(query, [planId, ...values]);
    return result.rows[0];
  }

  // Joint Operations
  async getJointOperations(civilizationId: number, filters?: { status?: string; type?: string }): Promise<JointOperation[]> {
    let query = `
      SELECT * FROM joint_operations 
      WHERE civilization_id = $1
    `;
    const params = [civilizationId];
    let paramIndex = 2;

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.type) {
      query += ` AND operation_type = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }

    query += ' ORDER BY start_date DESC, created_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async createJointOperation(operation: Partial<JointOperation>): Promise<JointOperation> {
    const query = `
      INSERT INTO joint_operations (
        civilization_id, operation_name, operation_type, commanding_service,
        participating_services, start_date, end_date, location, objectives,
        personnel_assigned, units_involved
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      operation.civilization_id,
      operation.operation_name,
      operation.operation_type,
      operation.commanding_service,
      operation.participating_services || [],
      operation.start_date,
      operation.end_date,
      operation.location,
      operation.objectives || [],
      operation.personnel_assigned || 0,
      operation.units_involved || []
    ]);
    return result.rows[0];
  }

  async executeJointOperation(operationId: number): Promise<JointOperation> {
    const query = `
      UPDATE joint_operations 
      SET status = 'active', updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await this.pool.query(query, [operationId]);
    return result.rows[0];
  }

  async completeJointOperation(operationId: number, afterActionReport: string, lessonsLearned: string[]): Promise<JointOperation> {
    const query = `
      UPDATE joint_operations 
      SET 
        status = 'completed',
        after_action_report = $2,
        lessons_learned = $3,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await this.pool.query(query, [operationId, afterActionReport, lessonsLearned]);
    return result.rows[0];
  }

  // Command Recommendations
  async getCommandRecommendations(civilizationId: number, filters?: { status?: string; urgency?: string }): Promise<CommandRecommendation[]> {
    let query = `
      SELECT cr.*, jc.name as recommending_officer_name, jc.rank as recommending_officer_rank
      FROM command_recommendations cr
      LEFT JOIN joint_chiefs jc ON cr.recommending_officer = jc.id
      WHERE cr.civilization_id = $1
    `;
    const params = [civilizationId];
    let paramIndex = 2;

    if (filters?.status) {
      query += ` AND cr.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.urgency) {
      query += ` AND cr.urgency = $${paramIndex}`;
      params.push(filters.urgency);
      paramIndex++;
    }

    query += ' ORDER BY cr.urgency DESC, cr.created_at DESC';

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async submitRecommendation(recommendation: Partial<CommandRecommendation>): Promise<CommandRecommendation> {
    const query = `
      INSERT INTO command_recommendations (
        civilization_id, recommending_officer, recommendation_type, title,
        description, rationale, urgency, target_audience, implementation_timeline,
        resource_impact
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      recommendation.civilization_id,
      recommendation.recommending_officer,
      recommendation.recommendation_type,
      recommendation.title,
      recommendation.description,
      recommendation.rationale,
      recommendation.urgency || 'medium',
      recommendation.target_audience || [],
      recommendation.implementation_timeline,
      recommendation.resource_impact
    ]);
    return result.rows[0];
  }

  async respondToRecommendation(id: number, responseFrom: string, responseNotes: string, newStatus: string): Promise<CommandRecommendation> {
    const query = `
      UPDATE command_recommendations 
      SET 
        status = $2,
        response_from = $3,
        response_notes = $4,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await this.pool.query(query, [id, newStatus, responseFrom, responseNotes]);
    return result.rows[0];
  }

  async getPendingRecommendations(civilizationId: number): Promise<CommandRecommendation[]> {
    return this.getCommandRecommendations(civilizationId, { status: 'pending' });
  }

  // Analytics and Reporting
  async calculateMilitaryReadiness(civilizationId: number): Promise<any> {
    const servicesQuery = `
      SELECT 
        service_name,
        readiness_level,
        personnel_count,
        active_units,
        budget_allocation
      FROM military_services 
      WHERE civilization_id = $1
    `;
    const services = await this.pool.query(servicesQuery, [civilizationId]);

    const operationsQuery = `
      SELECT 
        COUNT(*) as total_operations,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_operations,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_operations
      FROM joint_operations 
      WHERE civilization_id = $1
    `;
    const operations = await this.pool.query(operationsQuery, [civilizationId]);

    const plansQuery = `
      SELECT 
        COUNT(*) as total_plans,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_plans,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_plans
      FROM strategic_plans 
      WHERE civilization_id = $1
    `;
    const plans = await this.pool.query(plansQuery, [civilizationId]);

    // Calculate overall readiness score
    const readinessScores = {
      'low': 1,
      'moderate': 2,
      'high': 3,
      'critical': 4
    };

    const totalPersonnel = services.rows.reduce((sum, service) => sum + service.personnel_count, 0);
    const totalUnits = services.rows.reduce((sum, service) => sum + service.active_units, 0);
    const totalBudget = services.rows.reduce((sum, service) => sum + parseFloat(service.budget_allocation), 0);
    
    const avgReadiness = services.rows.reduce((sum, service) => 
      sum + readinessScores[service.readiness_level as keyof typeof readinessScores], 0
    ) / services.rows.length;

    return {
      overall_readiness: avgReadiness >= 3 ? 'high' : avgReadiness >= 2 ? 'moderate' : 'low',
      readiness_score: Math.round(avgReadiness * 100) / 100,
      services: services.rows,
      operations_summary: operations.rows[0],
      strategic_plans_summary: plans.rows[0],
      totals: {
        personnel: totalPersonnel,
        units: totalUnits,
        budget: totalBudget
      },
      generated_at: new Date()
    };
  }

  async generateOperationsReport(civilizationId: number, timeframe: string = '30d'): Promise<any> {
    const timeCondition = timeframe === '30d' ? "created_at >= NOW() - INTERVAL '30 days'" :
                         timeframe === '90d' ? "created_at >= NOW() - INTERVAL '90 days'" :
                         timeframe === '1y' ? "created_at >= NOW() - INTERVAL '1 year'" :
                         "TRUE";

    const query = `
      SELECT 
        operation_type,
        status,
        COUNT(*) as count,
        AVG(personnel_assigned) as avg_personnel,
        AVG(EXTRACT(EPOCH FROM (end_date - start_date))/86400) as avg_duration_days
      FROM joint_operations 
      WHERE civilization_id = $1 AND ${timeCondition}
      GROUP BY operation_type, status
      ORDER BY operation_type, status
    `;
    const result = await this.pool.query(query, [civilizationId]);

    const successQuery = `
      SELECT 
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
        COUNT(*) as total
      FROM joint_operations 
      WHERE civilization_id = $1 AND ${timeCondition}
    `;
    const success = await this.pool.query(successQuery, [civilizationId]);

    return {
      timeframe,
      operations_by_type_status: result.rows,
      success_metrics: success.rows[0],
      generated_at: new Date()
    };
  }

  async assessInterServiceCoordination(civilizationId: number): Promise<any> {
    const jointOpsQuery = `
      SELECT 
        array_length(participating_services, 1) as service_count,
        COUNT(*) as operation_count
      FROM joint_operations 
      WHERE civilization_id = $1 AND status IN ('completed', 'active')
      GROUP BY array_length(participating_services, 1)
      ORDER BY service_count
    `;
    const jointOps = await this.pool.query(jointOpsQuery, [civilizationId]);

    const plansQuery = `
      SELECT 
        array_length(participating_services, 1) as service_count,
        COUNT(*) as plan_count
      FROM strategic_plans 
      WHERE civilization_id = $1 AND status IN ('approved', 'active')
      GROUP BY array_length(participating_services, 1)
      ORDER BY service_count
    `;
    const plans = await this.pool.query(plansQuery, [civilizationId]);

    const recommendationsQuery = `
      SELECT 
        recommendation_type,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved
      FROM command_recommendations 
      WHERE civilization_id = $1
      GROUP BY recommendation_type
    `;
    const recommendations = await this.pool.query(recommendationsQuery, [civilizationId]);

    return {
      joint_operations_coordination: jointOps.rows,
      strategic_plans_coordination: plans.rows,
      recommendations_by_type: recommendations.rows,
      coordination_score: this.calculateCoordinationScore(jointOps.rows, plans.rows),
      generated_at: new Date()
    };
  }

  private calculateCoordinationScore(jointOps: any[], plans: any[]): number {
    // Higher scores for more multi-service operations
    const opsScore = jointOps.reduce((score, op) => {
      return score + (op.service_count > 1 ? op.operation_count * op.service_count : 0);
    }, 0);

    const plansScore = plans.reduce((score, plan) => {
      return score + (plan.service_count > 1 ? plan.plan_count * plan.service_count : 0);
    }, 0);

    const totalOps = jointOps.reduce((sum, op) => sum + op.operation_count, 0);
    const totalPlans = plans.reduce((sum, plan) => sum + plan.plan_count, 0);

    if (totalOps === 0 && totalPlans === 0) return 0;

    return Math.round(((opsScore + plansScore) / (totalOps + totalPlans)) * 100) / 100;
  }
}

// Service instance
let jointChiefsService: JointChiefsService | null = null;

export function getJointChiefsService(): JointChiefsService {
  if (!jointChiefsService) {
    throw new Error('JointChiefsService not initialized. Call initializeJointChiefsService first.');
  }
  return jointChiefsService;
}

export function initializeJointChiefsService(pool: Pool): void {
  jointChiefsService = new JointChiefsService(pool);
}
