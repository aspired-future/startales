import { Pool } from 'pg';
import { DepartmentBudgetService } from '../treasury/DepartmentBudgetService';
import { WarSimulatorService } from '../military/WarSimulatorService';
import { MilitaryUnit, UnitType, CombatDomain, MissionType, OrderType } from '../military/types';

export interface DefenseSecretaryAuthority {
  secretaryId: string;
  campaignId: number;
  
  // Command Authority
  commandAuthority: {
    totalUnits: number;
    activeUnits: number;
    readyUnits: number;
    deployedUnits: number;
    reserveUnits: number;
  };
  
  // Budget Authority (from Treasury integration)
  budgetAuthority: {
    totalDefenseBudget: number;
    availableFunds: number;
    personnelCosts: number;
    operationalCosts: number;
    procurementBudget: number;
    infrastructureBudget: number;
  };
  
  // Strategic Oversight
  strategicStatus: {
    overallReadiness: number; // 0-100
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    activeOperations: number;
    pendingOperations: number;
    militaryPosture: 'defensive' | 'neutral' | 'aggressive' | 'mobilized';
  };
  
  // Decision-Making Powers
  decisionPowers: {
    canAuthorizeOperations: boolean;
    canDeployForces: boolean;
    canChangeMilitaryPosture: boolean;
    canApproveProcurement: boolean;
    maxOperationBudget: number;
    requiresApprovalAbove: number;
  };
}

export interface MilitaryOperation {
  id: string;
  name: string;
  type: 'defensive' | 'offensive' | 'peacekeeping' | 'humanitarian' | 'training' | 'intelligence';
  classification: 'routine' | 'sensitive' | 'classified' | 'top-secret';
  
  // Operation Details
  objective: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  urgency: 'routine' | 'urgent' | 'immediate' | 'emergency';
  
  // Forces & Resources
  assignedUnits: string[]; // Military unit IDs
  commanderAssigned: string;
  estimatedDuration: number; // hours
  budgetAllocated: number;
  resourceRequirements: OperationResource[];
  
  // Authorization Chain
  requestedBy: string;
  authorizedBy: string;
  approvedBy: string;
  secretaryApproval: boolean;
  leaderApproval: boolean;
  
  // Timeline
  plannedStart: Date;
  actualStart?: Date;
  plannedEnd: Date;
  actualEnd?: Date;
  
  // Status & Progress
  status: 'planned' | 'authorized' | 'active' | 'completed' | 'cancelled' | 'suspended';
  progress: number; // 0-100
  
  // Risk Assessment
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  riskFactors: string[];
  contingencyPlans: string[];
  
  // Success Metrics
  successCriteria: OperationSuccessCriterion[];
  currentResults?: OperationResults;
}

export interface OperationResource {
  type: 'personnel' | 'equipment' | 'supplies' | 'fuel' | 'ammunition' | 'intelligence' | 'logistics';
  description: string;
  quantity: number;
  cost: number;
  availability: 'available' | 'limited' | 'unavailable';
  source: string;
}

export interface OperationSuccessCriterion {
  id: string;
  description: string;
  type: 'primary' | 'secondary' | 'bonus';
  measurable: boolean;
  target?: number;
  achieved: boolean;
  progress: number; // 0-100
}

export interface OperationResults {
  success: boolean;
  completionPercentage: number;
  objectivesAchieved: string[];
  casualties: number;
  equipmentLosses: number;
  budgetUsed: number;
  lessonsLearned: string[];
  strategicImpact: string;
}

export interface DefenseSecretaryOrder {
  id: string;
  secretaryId: string;
  orderType: 'deployment' | 'mission' | 'readiness-change' | 'procurement' | 'training' | 'strategic-directive';
  
  // Order Details
  title: string;
  description: string;
  priority: 'routine' | 'urgent' | 'immediate' | 'emergency';
  classification: 'unclassified' | 'confidential' | 'secret' | 'top-secret';
  
  // Recipients
  targetUnits: string[]; // Unit IDs
  targetCommanders: string[]; // Commander IDs
  targetDepartments: string[]; // Department names
  
  // Order Content
  instructions: string;
  parameters: Record<string, any>;
  constraints: string[];
  successCriteria: string[];
  
  // Timeline
  issuedAt: Date;
  effectiveAt: Date;
  expiresAt?: Date;
  
  // Status Tracking
  status: 'draft' | 'issued' | 'acknowledged' | 'in-progress' | 'completed' | 'cancelled';
  acknowledgments: OrderAcknowledgment[];
  
  // Budget Impact
  budgetImpact: number;
  budgetApproved: boolean;
}

export interface OrderAcknowledgment {
  unitId: string;
  commanderId: string;
  acknowledgedAt: Date;
  estimatedCompletion: Date;
  notes?: string;
}

export interface MilitaryReadinessReport {
  campaignId: number;
  reportDate: Date;
  
  // Overall Readiness
  overallReadiness: number; // 0-100
  readinessLevel: 'not-ready' | 'limited' | 'ready' | 'high-ready' | 'maximum';
  
  // Force Breakdown
  forceStructure: {
    totalUnits: number;
    unitsByDomain: Record<CombatDomain, number>;
    unitsByType: Record<UnitType, number>;
    unitsByReadiness: Record<string, number>;
  };
  
  // Capability Assessment
  capabilities: {
    offensiveCapability: number; // 0-100
    defensiveCapability: number; // 0-100
    mobilityCapability: number; // 0-100
    sustainmentCapability: number; // 0-100
    commandCapability: number; // 0-100
  };
  
  // Resource Status
  resources: {
    personnelStrength: number; // percentage of authorized
    equipmentReadiness: number; // percentage operational
    supplyLevels: number; // percentage of required supplies
    fuelReserves: number; // days of fuel available
    ammunitionStocks: number; // days of ammunition available
  };
  
  // Strategic Assessment
  strategic: {
    threatAssessment: string;
    strategicPosture: string;
    allianceStatus: string;
    deploymentStatus: string;
    operationalTempo: string;
  };
  
  // Recommendations
  recommendations: DefenseRecommendation[];
  
  // Alerts & Issues
  criticalIssues: string[];
  warnings: string[];
  
  // Budget Implications
  budgetStatus: {
    currentUtilization: number; // percentage
    projectedNeeds: number;
    shortfalls: string[];
    surpluses: string[];
  };
}

export interface DefenseRecommendation {
  id: string;
  type: 'readiness' | 'deployment' | 'procurement' | 'training' | 'strategic';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  
  // Implementation
  estimatedCost: number;
  timeToImplement: number; // days
  resourcesRequired: string[];
  
  // Impact Assessment
  expectedBenefit: string;
  riskMitigation: string[];
  
  // Decision Support
  alternatives: string[];
  consequences: string[];
}

export class DefenseSecretaryService {
  constructor(
    private pool: Pool,
    private departmentBudgetService: DepartmentBudgetService,
    private warSimulatorService: WarSimulatorService
  ) {}

  // ==================== COMMAND AUTHORITY ====================

  async getDefenseSecretaryAuthority(secretaryId: string, campaignId: number): Promise<DefenseSecretaryAuthority> {
    const client = await this.pool.connect();
    
    try {
      // Get military unit counts
      const unitsResult = await client.query(`
        SELECT 
          COUNT(*) as total_units,
          COUNT(CASE WHEN status->>'operational' = 'fully-operational' THEN 1 END) as active_units,
          COUNT(CASE WHEN status->>'combat'->>'level' IN ('ready', 'high-ready', 'immediate') THEN 1 END) as ready_units,
          COUNT(CASE WHEN status->>'mission'->>'currentMission' IS NOT NULL THEN 1 END) as deployed_units,
          COUNT(CASE WHEN status->>'mission'->>'currentMission' IS NULL THEN 1 END) as reserve_units
        FROM military_units 
        WHERE campaign_id = $1
      `, [campaignId]);

      const unitStats = unitsResult.rows[0];

      // Get defense budget from Treasury system
      const defenseBudget = await this.departmentBudgetService.getDepartmentBudget(
        campaignId, 
        'Defense', 
        new Date().getFullYear()
      );

      // Calculate strategic status
      const readinessResult = await client.query(`
        SELECT AVG(
          CASE 
            WHEN status->>'combat'->>'percentage' IS NOT NULL 
            THEN (status->>'combat'->>'percentage')::numeric 
            ELSE 50 
          END
        ) as avg_readiness
        FROM military_units 
        WHERE campaign_id = $1
      `, [campaignId]);

      const overallReadiness = Number(readinessResult.rows[0]?.avg_readiness || 50);

      // Get active operations count
      const operationsResult = await client.query(`
        SELECT 
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_operations,
          COUNT(CASE WHEN status IN ('planned', 'authorized') THEN 1 END) as pending_operations
        FROM military_operations 
        WHERE campaign_id = $1
      `, [campaignId]);

      const operations = operationsResult.rows[0];

      // Determine threat level based on recent intelligence
      const threatLevel = await this.assessCurrentThreatLevel(campaignId);

      return {
        secretaryId,
        campaignId,
        commandAuthority: {
          totalUnits: Number(unitStats.total_units),
          activeUnits: Number(unitStats.active_units),
          readyUnits: Number(unitStats.ready_units),
          deployedUnits: Number(unitStats.deployed_units),
          reserveUnits: Number(unitStats.reserve_units)
        },
        budgetAuthority: {
          totalDefenseBudget: defenseBudget?.totalAllocated || 300000,
          availableFunds: defenseBudget?.remainingBalance || 300000,
          personnelCosts: defenseBudget?.categories?.Personnel?.spent || 0,
          operationalCosts: defenseBudget?.categories?.Operations?.spent || 0,
          procurementBudget: defenseBudget?.categories?.Procurement?.remaining || 0,
          infrastructureBudget: defenseBudget?.categories?.Infrastructure?.remaining || 0
        },
        strategicStatus: {
          overallReadiness,
          threatLevel,
          activeOperations: Number(operations?.active_operations || 0),
          pendingOperations: Number(operations?.pending_operations || 0),
          militaryPosture: this.determineMilitaryPosture(overallReadiness, threatLevel)
        },
        decisionPowers: {
          canAuthorizeOperations: true,
          canDeployForces: true,
          canChangeMilitaryPosture: true,
          canApproveProcurement: true,
          maxOperationBudget: 100000, // $100k without Treasury approval
          requiresApprovalAbove: 500000 // $500k requires leader approval
        }
      };
      
    } finally {
      client.release();
    }
  }

  // ==================== MILITARY OPERATIONS MANAGEMENT ====================

  async authorizeOperation(operation: Partial<MilitaryOperation>): Promise<MilitaryOperation> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const operationId = `op-defense-${Date.now()}`;
      
      // Validate budget availability
      if (operation.budgetAllocated && operation.budgetAllocated > 0) {
        const budgetCheck = await this.validateOperationBudget(
          operation.budgetAllocated,
          'Defense',
          1 // TODO: Get from context
        );
        
        if (!budgetCheck.approved) {
          throw new Error(`Insufficient budget: ${budgetCheck.reason}`);
        }
      }

      // Create operation record
      const result = await client.query(`
        INSERT INTO military_operations (
          id, name, type, classification, objective, description,
          priority, urgency, assigned_units, commander_assigned,
          estimated_duration, budget_allocated, resource_requirements,
          requested_by, authorized_by, secretary_approval,
          planned_start, planned_end, status, risk_level, risk_factors,
          success_criteria, campaign_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
          $14, $15, true, $16, $17, 'authorized', $18, $19, $20, $21
        ) RETURNING *
      `, [
        operationId,
        operation.name,
        operation.type,
        operation.classification || 'routine',
        operation.objective,
        operation.description,
        operation.priority || 'medium',
        operation.urgency || 'routine',
        JSON.stringify(operation.assignedUnits || []),
        operation.commanderAssigned,
        operation.estimatedDuration || 24,
        operation.budgetAllocated || 0,
        JSON.stringify(operation.resourceRequirements || []),
        operation.requestedBy,
        operation.authorizedBy,
        operation.plannedStart || new Date(),
        operation.plannedEnd || new Date(Date.now() + 24 * 60 * 60 * 1000),
        operation.riskLevel || 'medium',
        JSON.stringify(operation.riskFactors || []),
        JSON.stringify(operation.successCriteria || []),
        1 // TODO: Get from context
      ]);

      // Reserve budget if needed
      if (operation.budgetAllocated && operation.budgetAllocated > 0) {
        await this.reserveOperationBudget(operationId, operation.budgetAllocated, 'Defense');
      }

      // Update unit assignments
      if (operation.assignedUnits && operation.assignedUnits.length > 0) {
        await this.assignUnitsToOperation(operationId, operation.assignedUnits);
      }

      await client.query('COMMIT');
      return this.mapOperationFromRow(result.rows[0]);
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async issueDefenseOrder(order: Partial<DefenseSecretaryOrder>): Promise<DefenseSecretaryOrder> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const orderId = `order-defense-${Date.now()}`;
      
      // Create order record
      const result = await client.query(`
        INSERT INTO defense_orders (
          id, secretary_id, order_type, title, description, priority,
          classification, target_units, target_commanders, target_departments,
          instructions, parameters, constraints, success_criteria,
          issued_at, effective_at, expires_at, status, budget_impact, budget_approved
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
          NOW(), $15, $16, 'issued', $17, $18
        ) RETURNING *
      `, [
        orderId,
        order.secretaryId,
        order.orderType,
        order.title,
        order.description,
        order.priority || 'routine',
        order.classification || 'unclassified',
        JSON.stringify(order.targetUnits || []),
        JSON.stringify(order.targetCommanders || []),
        JSON.stringify(order.targetDepartments || []),
        order.instructions,
        JSON.stringify(order.parameters || {}),
        JSON.stringify(order.constraints || []),
        JSON.stringify(order.successCriteria || []),
        order.effectiveAt || new Date(),
        order.expiresAt,
        order.budgetImpact || 0,
        order.budgetApproved || false
      ]);

      // Send order to target units
      if (order.targetUnits && order.targetUnits.length > 0) {
        await this.distributeOrderToUnits(orderId, order.targetUnits);
      }

      await client.query('COMMIT');
      return this.mapOrderFromRow(result.rows[0]);
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // ==================== MILITARY READINESS MANAGEMENT ====================

  async generateReadinessReport(campaignId: number): Promise<MilitaryReadinessReport> {
    const client = await this.pool.connect();
    
    try {
      // Get comprehensive unit data
      const unitsResult = await client.query(`
        SELECT 
          domain,
          type,
          status,
          condition,
          supply,
          morale,
          training
        FROM military_units 
        WHERE campaign_id = $1
      `, [campaignId]);

      const units = unitsResult.rows;
      
      // Calculate overall readiness
      let totalReadiness = 0;
      let readyUnits = 0;
      const unitsByDomain: Record<CombatDomain, number> = {
        land: 0, sea: 0, air: 0, space: 0, cyber: 0, 'multi-domain': 0
      };
      const unitsByType: Record<string, number> = {};
      const unitsByReadiness: Record<string, number> = {};

      for (const unit of units) {
        const status = unit.status || {};
        const combat = status.combat || {};
        const readinessPercent = Number(combat.percentage || 50);
        
        totalReadiness += readinessPercent;
        if (readinessPercent >= 75) readyUnits++;
        
        // Count by domain
        if (unit.domain && unitsByDomain[unit.domain as CombatDomain] !== undefined) {
          unitsByDomain[unit.domain as CombatDomain]++;
        }
        
        // Count by type
        unitsByType[unit.type] = (unitsByType[unit.type] || 0) + 1;
        
        // Count by readiness level
        const readinessLevel = combat.level || 'limited';
        unitsByReadiness[readinessLevel] = (unitsByReadiness[readinessLevel] || 0) + 1;
      }

      const overallReadiness = units.length > 0 ? totalReadiness / units.length : 0;
      const readinessLevel = this.determineReadinessLevel(overallReadiness);

      // Calculate capabilities
      const capabilities = {
        offensiveCapability: Math.min(100, overallReadiness * 0.8 + (readyUnits / units.length) * 20),
        defensiveCapability: Math.min(100, overallReadiness * 0.9 + 10),
        mobilityCapability: Math.min(100, overallReadiness * 0.7 + 30),
        sustainmentCapability: Math.min(100, overallReadiness * 0.6 + 40),
        commandCapability: Math.min(100, overallReadiness * 0.85 + 15)
      };

      // Get budget status
      const defenseBudget = await this.departmentBudgetService.getDepartmentBudget(
        campaignId, 
        'Defense', 
        new Date().getFullYear()
      );

      // Generate recommendations
      const recommendations = await this.generateDefenseRecommendations(
        overallReadiness,
        capabilities,
        defenseBudget
      );

      return {
        campaignId,
        reportDate: new Date(),
        overallReadiness,
        readinessLevel,
        forceStructure: {
          totalUnits: units.length,
          unitsByDomain,
          unitsByType,
          unitsByReadiness
        },
        capabilities,
        resources: {
          personnelStrength: 85, // TODO: Calculate from actual data
          equipmentReadiness: overallReadiness * 0.9,
          supplyLevels: 75, // TODO: Calculate from supply data
          fuelReserves: 30, // TODO: Calculate from supply data
          ammunitionStocks: 45 // TODO: Calculate from supply data
        },
        strategic: {
          threatAssessment: await this.assessCurrentThreatLevel(campaignId),
          strategicPosture: this.determineMilitaryPosture(overallReadiness, await this.assessCurrentThreatLevel(campaignId)),
          allianceStatus: 'Stable', // TODO: Get from alliance system
          deploymentStatus: `${readyUnits}/${units.length} units ready`,
          operationalTempo: overallReadiness > 80 ? 'High' : overallReadiness > 60 ? 'Medium' : 'Low'
        },
        recommendations,
        criticalIssues: await this.identifyCriticalIssues(campaignId),
        warnings: await this.identifyWarnings(campaignId),
        budgetStatus: {
          currentUtilization: defenseBudget?.utilizationRate || 0,
          projectedNeeds: defenseBudget?.totalAllocated || 300000,
          shortfalls: overallReadiness < 70 ? ['Equipment maintenance', 'Training resources'] : [],
          surpluses: defenseBudget?.utilizationRate < 0.5 ? ['Underutilized procurement budget'] : []
        }
      };
      
    } finally {
      client.release();
    }
  }

  // ==================== FORCE DEPLOYMENT ====================

  async deployForces(deploymentRequest: {
    operationId: string;
    unitIds: string[];
    destination: string;
    mission: MissionType;
    duration: number;
    rules: string[];
  }): Promise<{ success: boolean; deploymentId: string; estimatedArrival: Date }> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const deploymentId = `deploy-${deploymentRequest.operationId}-${Date.now()}`;
      
      // Validate units are available
      const unitsResult = await client.query(`
        SELECT id, name, status, location
        FROM military_units 
        WHERE id = ANY($1) AND campaign_id = $2
      `, [deploymentRequest.unitIds, 1]); // TODO: Get campaign from context

      if (unitsResult.rows.length !== deploymentRequest.unitIds.length) {
        throw new Error('Some units are not available for deployment');
      }

      // Calculate deployment logistics
      const estimatedArrival = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours default

      // Create deployment record
      await client.query(`
        INSERT INTO force_deployments (
          id, operation_id, unit_ids, destination, mission_type,
          duration_hours, rules_of_engagement, deployment_start,
          estimated_arrival, status, authorized_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, 'deploying', $9)
      `, [
        deploymentId,
        deploymentRequest.operationId,
        JSON.stringify(deploymentRequest.unitIds),
        deploymentRequest.destination,
        deploymentRequest.mission,
        deploymentRequest.duration,
        JSON.stringify(deploymentRequest.rules),
        estimatedArrival,
        'ai-secretary-defense'
      ]);

      // Update unit status to deploying
      for (const unitId of deploymentRequest.unitIds) {
        await client.query(`
          UPDATE military_units 
          SET status = jsonb_set(
            status, 
            '{mission}', 
            jsonb_build_object(
              'currentMission', $2,
              'missionStatus', 'deploying',
              'deploymentId', $3
            )
          ),
          updated_at = NOW()
          WHERE id = $1
        `, [unitId, deploymentRequest.mission, deploymentId]);
      }

      await client.query('COMMIT');

      return {
        success: true,
        deploymentId,
        estimatedArrival
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // ==================== PROCUREMENT & EQUIPMENT ====================

  async requestMilitaryProcurement(procurementRequest: {
    equipmentType: string;
    quantity: number;
    unitPrice: number;
    vendor: string;
    justification: string;
    urgency: 'routine' | 'urgent' | 'emergency';
    deliveryDate: Date;
  }): Promise<{ approved: boolean; procurementId: string; budgetReserved: number }> {
    const totalCost = procurementRequest.quantity * procurementRequest.unitPrice;
    
    // Submit spending request through Treasury system
    const spendingRequest = await this.departmentBudgetService.submitSpendingRequest({
      secretaryId: 'ai-secretary-defense',
      department: 'Defense',
      category: 'Procurement',
      amount: totalCost,
      purpose: `Military procurement: ${procurementRequest.equipmentType}`,
      description: `${procurementRequest.quantity}x ${procurementRequest.equipmentType} from ${procurementRequest.vendor}`,
      justification: procurementRequest.justification,
      urgency: procurementRequest.urgency,
      vendor: procurementRequest.vendor
    });

    const procurementId = `proc-defense-${Date.now()}`;
    
    // Create procurement record
    const client = await this.pool.connect();
    try {
      await client.query(`
        INSERT INTO military_procurement (
          id, equipment_type, quantity, unit_price, total_cost,
          vendor, justification, urgency, delivery_date,
          line_item_id, status, requested_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'approved', $11)
      `, [
        procurementId,
        procurementRequest.equipmentType,
        procurementRequest.quantity,
        procurementRequest.unitPrice,
        totalCost,
        procurementRequest.vendor,
        procurementRequest.justification,
        procurementRequest.urgency,
        procurementRequest.deliveryDate,
        spendingRequest.id,
        'ai-secretary-defense'
      ]);
    } finally {
      client.release();
    }

    return {
      approved: true,
      procurementId,
      budgetReserved: totalCost
    };
  }

  // ==================== PRIVATE HELPER METHODS ====================

  private async assessCurrentThreatLevel(campaignId: number): Promise<'low' | 'medium' | 'high' | 'critical'> {
    const client = await this.pool.connect();
    
    try {
      // Check recent intelligence reports
      const intelResult = await client.query(`
        SELECT threat_level, confidence
        FROM intelligence_reports 
        WHERE campaign_id = $1 
        AND report_type = 'threat-assessment'
        AND created_at >= NOW() - INTERVAL '7 days'
        ORDER BY created_at DESC
        LIMIT 1
      `, [campaignId]);

      if (intelResult.rows.length > 0) {
        return intelResult.rows[0].threat_level || 'medium';
      }

      // Default assessment based on recent battles
      const battleResult = await client.query(`
        SELECT COUNT(*) as recent_battles
        FROM battle_history 
        WHERE campaign_id = $1 
        AND created_at >= NOW() - INTERVAL '30 days'
      `, [campaignId]);

      const recentBattles = Number(battleResult.rows[0]?.recent_battles || 0);
      
      if (recentBattles > 10) return 'high';
      if (recentBattles > 5) return 'medium';
      return 'low';
      
    } finally {
      client.release();
    }
  }

  private determineMilitaryPosture(readiness: number, threatLevel: string): 'defensive' | 'neutral' | 'aggressive' | 'mobilized' {
    if (threatLevel === 'critical') return 'mobilized';
    if (threatLevel === 'high' && readiness > 80) return 'aggressive';
    if (threatLevel === 'high') return 'defensive';
    if (readiness > 90) return 'aggressive';
    if (readiness > 70) return 'neutral';
    return 'defensive';
  }

  private determineReadinessLevel(readiness: number): 'not-ready' | 'limited' | 'ready' | 'high-ready' | 'maximum' {
    if (readiness >= 95) return 'maximum';
    if (readiness >= 85) return 'high-ready';
    if (readiness >= 70) return 'ready';
    if (readiness >= 50) return 'limited';
    return 'not-ready';
  }

  private async validateOperationBudget(amount: number, department: string, campaignId: number): Promise<{
    approved: boolean;
    reason?: string;
  }> {
    const budget = await this.departmentBudgetService.getDepartmentBudget(
      campaignId, 
      department, 
      new Date().getFullYear()
    );

    if (!budget) {
      return { approved: false, reason: 'Department budget not found' };
    }

    if (amount > budget.remainingBalance) {
      return { approved: false, reason: 'Insufficient remaining budget' };
    }

    if (amount > budget.spendingLimits.transactionLimit) {
      return { approved: false, reason: 'Exceeds transaction limit - Treasury approval required' };
    }

    return { approved: true };
  }

  private async reserveOperationBudget(operationId: string, amount: number, department: string): Promise<void> {
    // This would integrate with the Treasury system to reserve budget
    // Implementation would create a budget reservation record
  }

  private async assignUnitsToOperation(operationId: string, unitIds: string[]): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      for (const unitId of unitIds) {
        await client.query(`
          UPDATE military_units 
          SET status = jsonb_set(
            status, 
            '{mission,currentMission}', 
            to_jsonb($2::text)
          ),
          updated_at = NOW()
          WHERE id = $1
        `, [unitId, operationId]);
      }
    } finally {
      client.release();
    }
  }

  private async distributeOrderToUnits(orderId: string, unitIds: string[]): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      for (const unitId of unitIds) {
        await client.query(`
          INSERT INTO unit_orders (
            id, unit_id, order_id, status, received_at
          ) VALUES ($1, $2, $3, 'received', NOW())
        `, [`unit-order-${unitId}-${orderId}`, unitId, orderId]);
      }
    } finally {
      client.release();
    }
  }

  private async generateDefenseRecommendations(
    readiness: number, 
    capabilities: any, 
    budget: any
  ): Promise<DefenseRecommendation[]> {
    const recommendations: DefenseRecommendation[] = [];

    // Readiness-based recommendations
    if (readiness < 70) {
      recommendations.push({
        id: 'improve-readiness',
        type: 'readiness',
        priority: 'high',
        title: 'Improve Overall Military Readiness',
        description: 'Current readiness below optimal levels. Increase training and equipment maintenance.',
        estimatedCost: 50000,
        timeToImplement: 30,
        resourcesRequired: ['Training facilities', 'Maintenance personnel', 'Equipment parts'],
        expectedBenefit: 'Increase readiness by 15-20%',
        riskMitigation: ['Reduced combat effectiveness', 'Slower response times'],
        alternatives: ['Focused unit training', 'Equipment upgrades', 'Personnel reinforcement'],
        consequences: ['Continued low readiness', 'Increased vulnerability']
      });
    }

    // Budget-based recommendations
    if (budget && budget.utilizationRate < 0.6) {
      recommendations.push({
        id: 'increase-procurement',
        type: 'procurement',
        priority: 'medium',
        title: 'Accelerate Equipment Procurement',
        description: 'Defense budget underutilized. Opportunity to modernize equipment.',
        estimatedCost: budget.remainingBalance * 0.5,
        timeToImplement: 60,
        resourcesRequired: ['Procurement staff', 'Vendor relationships', 'Logistics support'],
        expectedBenefit: 'Modernized equipment, improved capabilities',
        riskMitigation: ['Technology obsolescence', 'Equipment shortages'],
        alternatives: ['Gradual modernization', 'Focused upgrades', 'Training investment'],
        consequences: ['Continued equipment aging', 'Capability gaps']
      });
    }

    return recommendations;
  }

  private async identifyCriticalIssues(campaignId: number): Promise<string[]> {
    const issues: string[] = [];
    
    const client = await this.pool.connect();
    try {
      // Check for units with critical readiness issues
      const criticalUnitsResult = await client.query(`
        SELECT COUNT(*) as critical_count
        FROM military_units 
        WHERE campaign_id = $1 
        AND (status->>'combat'->>'percentage')::numeric < 30
      `, [campaignId]);

      const criticalUnits = Number(criticalUnitsResult.rows[0]?.critical_count || 0);
      if (criticalUnits > 0) {
        issues.push(`${criticalUnits} units below critical readiness threshold`);
      }

      // Check for supply shortages
      const supplyIssuesResult = await client.query(`
        SELECT COUNT(*) as supply_issues
        FROM military_units 
        WHERE campaign_id = $1 
        AND (
          (supply->>'ammunition'->>'status' = 'critical') OR
          (supply->>'fuel'->>'status' = 'critical') OR
          (supply->>'food'->>'status' = 'critical')
        )
      `, [campaignId]);

      const supplyIssues = Number(supplyIssuesResult.rows[0]?.supply_issues || 0);
      if (supplyIssues > 0) {
        issues.push(`${supplyIssues} units experiencing critical supply shortages`);
      }

    } finally {
      client.release();
    }

    return issues;
  }

  private async identifyWarnings(campaignId: number): Promise<string[]> {
    const warnings: string[] = [];
    
    // This would analyze various military metrics and generate warnings
    // For now, return sample warnings based on common military concerns
    
    return [
      'Equipment maintenance schedules require attention',
      'Training exercises behind schedule',
      'Intelligence reports indicate increased enemy activity'
    ];
  }

  private mapOperationFromRow(row: any): MilitaryOperation {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      classification: row.classification,
      objective: row.objective,
      description: row.description,
      priority: row.priority,
      urgency: row.urgency,
      assignedUnits: row.assigned_units || [],
      commanderAssigned: row.commander_assigned,
      estimatedDuration: Number(row.estimated_duration),
      budgetAllocated: Number(row.budget_allocated),
      resourceRequirements: row.resource_requirements || [],
      requestedBy: row.requested_by,
      authorizedBy: row.authorized_by,
      approvedBy: row.approved_by,
      secretaryApproval: row.secretary_approval,
      leaderApproval: row.leader_approval,
      plannedStart: row.planned_start,
      actualStart: row.actual_start,
      plannedEnd: row.planned_end,
      actualEnd: row.actual_end,
      status: row.status,
      progress: Number(row.progress || 0),
      riskLevel: row.risk_level,
      riskFactors: row.risk_factors || [],
      contingencyPlans: row.contingency_plans || [],
      successCriteria: row.success_criteria || []
    };
  }

  private mapOrderFromRow(row: any): DefenseSecretaryOrder {
    return {
      id: row.id,
      secretaryId: row.secretary_id,
      orderType: row.order_type,
      title: row.title,
      description: row.description,
      priority: row.priority,
      classification: row.classification,
      targetUnits: row.target_units || [],
      targetCommanders: row.target_commanders || [],
      targetDepartments: row.target_departments || [],
      instructions: row.instructions,
      parameters: row.parameters || {},
      constraints: row.constraints || [],
      successCriteria: row.success_criteria || [],
      issuedAt: row.issued_at,
      effectiveAt: row.effective_at,
      expiresAt: row.expires_at,
      status: row.status,
      acknowledgments: [], // TODO: Load from acknowledgments table
      budgetImpact: Number(row.budget_impact),
      budgetApproved: row.budget_approved
    };
  }
}
