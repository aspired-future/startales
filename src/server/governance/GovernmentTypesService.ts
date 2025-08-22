import { Pool } from 'pg';

/**
 * Government Types Service
 * Manages different government types (Monarchy, Democracy, Communist, etc.) with unique mechanics
 */

export interface GovernmentType {
  id: string;
  name: string;
  description: string;
  ideology: string;
  
  // Core Characteristics
  powerStructure: 'centralized' | 'distributed' | 'mixed';
  legitimacySource: 'divine_right' | 'popular_mandate' | 'party_ideology' | 'tradition' | 'force';
  successionMethod: 'hereditary' | 'election' | 'appointment' | 'revolution' | 'meritocracy';
  
  // Decision Making
  decisionSpeed: number; // 1-10 (1=very slow, 10=very fast)
  publicApprovalRequired: boolean;
  legislativeOverride: boolean;
  
  // Economic Control
  economicControl: number; // 0-100 (0=free market, 100=state controlled)
  resourceAllocation: 'market' | 'central_planning' | 'mixed';
  privatePropertyRights: number; // 0-100
  
  // Social Control
  mediaControl: number; // 0-100 (0=free press, 100=state controlled)
  civilLiberties: number; // 0-100
  culturalControl: number; // 0-100
  
  // Stability Factors
  stabilityFactors: {
    succession: number; // 0-100
    legitimacy: number; // 0-100
    institutionalStrength: number; // 0-100
    popularSupport: number; // 0-100
  };
  
  // Advantages and Disadvantages
  advantages: string[];
  disadvantages: string[];
  
  // Transition Mechanics
  transitionFrom: string[]; // Which government types can transition to this
  transitionTo: string[]; // Which government types this can transition to
  transitionRequirements: {
    popularSupport?: number;
    militarySupport?: number;
    economicCrisis?: boolean;
    externalPressure?: boolean;
    revolutionaryMovement?: boolean;
  };
}

export interface CivilizationGovernment {
  id: string;
  campaignId: number;
  civilizationId: string;
  governmentTypeId: string;
  
  // Current Status
  establishedDate: Date;
  currentLeader: string;
  legitimacy: number; // 0-100
  stability: number; // 0-100
  
  // Government Specific Data
  governmentData: Record<string, any>; // Type-specific data
  
  // Performance Metrics
  decisionEfficiency: number; // 0-100
  publicSatisfaction: number; // 0-100
  economicPerformance: number; // 0-100
  
  // Transition History
  previousGovernments: {
    governmentTypeId: string;
    period: { start: Date; end: Date };
    transitionReason: string;
    transitionMethod: 'peaceful' | 'revolution' | 'coup' | 'invasion' | 'reform';
  }[];
  
  // Current Challenges
  challenges: {
    type: string;
    severity: number; // 1-10
    description: string;
    timeframe: string;
  }[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export class GovernmentTypesService {
  constructor(private pool: Pool) {}

  // Get all available government types
  async getGovernmentTypes(): Promise<GovernmentType[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM government_types ORDER BY name
      `);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get specific government type
  async getGovernmentType(id: string): Promise<GovernmentType | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM government_types WHERE id = $1
      `, [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Get civilization's current government
  async getCivilizationGovernment(campaignId: number, civilizationId: string): Promise<CivilizationGovernment | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT cg.*, gt.name as government_type_name, gt.description as government_type_description
        FROM civilization_governments cg
        JOIN government_types gt ON cg.government_type_id = gt.id
        WHERE cg.campaign_id = $1 AND cg.civilization_id = $2
        ORDER BY cg.established_date DESC
        LIMIT 1
      `, [campaignId, civilizationId]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Change government type
  async changeGovernmentType(
    campaignId: number,
    civilizationId: string,
    newGovernmentTypeId: string,
    transitionMethod: 'peaceful' | 'revolution' | 'coup' | 'invasion' | 'reform',
    transitionReason: string,
    newLeader: string
  ): Promise<CivilizationGovernment> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Get current government
      const currentGov = await this.getCivilizationGovernment(campaignId, civilizationId);
      
      // Archive current government
      if (currentGov) {
        await client.query(`
          UPDATE civilization_governments 
          SET updated_at = NOW()
          WHERE id = $1
        `, [currentGov.id]);
      }

      // Create new government record
      const result = await client.query(`
        INSERT INTO civilization_governments (
          campaign_id, civilization_id, government_type_id, established_date,
          current_leader, legitimacy, stability, government_data,
          decision_efficiency, public_satisfaction, economic_performance,
          previous_governments
        ) VALUES (
          $1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9, $10, $11
        ) RETURNING *
      `, [
        campaignId,
        civilizationId,
        newGovernmentTypeId,
        newLeader,
        this.calculateInitialLegitimacy(transitionMethod),
        this.calculateInitialStability(transitionMethod),
        JSON.stringify({}),
        50, // Initial decision efficiency
        50, // Initial public satisfaction
        50, // Initial economic performance
        JSON.stringify(currentGov ? [{
          governmentTypeId: currentGov.governmentTypeId,
          period: { start: currentGov.establishedDate, end: new Date() },
          transitionReason,
          transitionMethod
        }] : [])
      ]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Calculate government effectiveness based on type and situation
  async calculateGovernmentEffectiveness(
    campaignId: number,
    civilizationId: string,
    situation: 'crisis' | 'normal' | 'prosperity'
  ): Promise<{
    decisionSpeed: number;
    publicSupport: number;
    economicImpact: number;
    stabilityImpact: number;
  }> {
    const government = await this.getCivilizationGovernment(campaignId, civilizationId);
    if (!government) throw new Error('No government found');

    const governmentType = await this.getGovernmentType(government.governmentTypeId);
    if (!governmentType) throw new Error('Government type not found');

    // Base effectiveness from government type
    let decisionSpeed = governmentType.decisionSpeed * 10;
    let publicSupport = governmentType.stabilityFactors.popularSupport;
    let economicImpact = 100 - governmentType.economicControl; // More control = less market efficiency
    let stabilityImpact = governmentType.stabilityFactors.institutionalStrength;

    // Adjust based on situation
    switch (situation) {
      case 'crisis':
        // Authoritarian systems perform better in crisis
        if (governmentType.powerStructure === 'centralized') {
          decisionSpeed *= 1.5;
          stabilityImpact *= 1.2;
        } else {
          decisionSpeed *= 0.8;
          publicSupport *= 0.9;
        }
        break;
      case 'prosperity':
        // Democratic systems perform better in prosperity
        if (governmentType.publicApprovalRequired) {
          publicSupport *= 1.3;
          economicImpact *= 1.2;
        }
        break;
      case 'normal':
        // No adjustments for normal times
        break;
    }

    return {
      decisionSpeed: Math.min(100, decisionSpeed),
      publicSupport: Math.min(100, publicSupport),
      economicImpact: Math.min(100, economicImpact),
      stabilityImpact: Math.min(100, stabilityImpact)
    };
  }

  // Check if government transition is possible
  async canTransitionTo(
    campaignId: number,
    civilizationId: string,
    targetGovernmentTypeId: string
  ): Promise<{
    possible: boolean;
    requirements: string[];
    currentStatus: Record<string, boolean>;
  }> {
    const currentGov = await this.getCivilizationGovernment(campaignId, civilizationId);
    if (!currentGov) throw new Error('No current government found');

    const currentType = await this.getGovernmentType(currentGov.governmentTypeId);
    const targetType = await this.getGovernmentType(targetGovernmentTypeId);
    
    if (!currentType || !targetType) {
      throw new Error('Government type not found');
    }

    const canTransition = currentType.transitionTo.includes(targetGovernmentTypeId);
    const requirements: string[] = [];
    const currentStatus: Record<string, boolean> = {};

    if (!canTransition) {
      return {
        possible: false,
        requirements: ['Direct transition not possible from current government type'],
        currentStatus: {}
      };
    }

    // Check transition requirements
    const reqs = targetType.transitionRequirements;
    
    if (reqs.popularSupport) {
      requirements.push(`Popular support >= ${reqs.popularSupport}%`);
      currentStatus.popularSupport = currentGov.publicSatisfaction >= reqs.popularSupport;
    }
    
    if (reqs.militarySupport) {
      requirements.push(`Military support >= ${reqs.militarySupport}%`);
      // TODO: Get actual military support data
      currentStatus.militarySupport = true; // Placeholder
    }
    
    if (reqs.economicCrisis) {
      requirements.push('Economic crisis required');
      currentStatus.economicCrisis = currentGov.economicPerformance < 30;
    }
    
    if (reqs.externalPressure) {
      requirements.push('External pressure required');
      // TODO: Check for external pressure indicators
      currentStatus.externalPressure = false; // Placeholder
    }
    
    if (reqs.revolutionaryMovement) {
      requirements.push('Revolutionary movement required');
      // TODO: Check for revolutionary movements
      currentStatus.revolutionaryMovement = false; // Placeholder
    }

    const allRequirementsMet = Object.values(currentStatus).every(status => status);

    return {
      possible: allRequirementsMet,
      requirements,
      currentStatus
    };
  }

  // Update government performance metrics
  async updateGovernmentMetrics(
    campaignId: number,
    civilizationId: string,
    metrics: {
      legitimacy?: number;
      stability?: number;
      decisionEfficiency?: number;
      publicSatisfaction?: number;
      economicPerformance?: number;
    }
  ): Promise<void> {
    const client = await this.pool.connect();
    try {
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(metrics).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });

      if (updateFields.length === 0) return;

      updateFields.push(`updated_at = NOW()`);
      values.push(campaignId, civilizationId);

      await client.query(`
        UPDATE civilization_governments 
        SET ${updateFields.join(', ')}
        WHERE campaign_id = $${paramIndex} AND civilization_id = $${paramIndex + 1}
        AND established_date = (
          SELECT MAX(established_date) 
          FROM civilization_governments 
          WHERE campaign_id = $${paramIndex} AND civilization_id = $${paramIndex + 1}
        )
      `, values);
    } finally {
      client.release();
    }
  }

  // Add government challenge
  async addGovernmentChallenge(
    campaignId: number,
    civilizationId: string,
    challenge: {
      type: string;
      severity: number;
      description: string;
      timeframe: string;
    }
  ): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        UPDATE civilization_governments 
        SET challenges = challenges || $1::jsonb,
            updated_at = NOW()
        WHERE campaign_id = $2 AND civilization_id = $3
        AND established_date = (
          SELECT MAX(established_date) 
          FROM civilization_governments 
          WHERE campaign_id = $2 AND civilization_id = $3
        )
      `, [JSON.stringify([challenge]), campaignId, civilizationId]);
    } finally {
      client.release();
    }
  }

  private calculateInitialLegitimacy(transitionMethod: string): number {
    switch (transitionMethod) {
      case 'peaceful': return 80;
      case 'reform': return 70;
      case 'revolution': return 60;
      case 'coup': return 30;
      case 'invasion': return 20;
      default: return 50;
    }
  }

  private calculateInitialStability(transitionMethod: string): number {
    switch (transitionMethod) {
      case 'peaceful': return 90;
      case 'reform': return 75;
      case 'revolution': return 40;
      case 'coup': return 35;
      case 'invasion': return 25;
      default: return 50;
    }
  }
}

