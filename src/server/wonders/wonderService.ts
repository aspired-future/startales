import { Pool } from 'pg';
import { 
  WorldWonder, 
  WonderConstruction, 
  WonderType, 
  ConstructionStatus, 
  ConstructionPhase, 
  ResourceCost, 
  WonderBenefits,
  ConstructionEvent
} from '../storage/wondersSchema';

export interface WonderTemplate {
  wonder_type: string;
  wonder_category: string;
  display_name: string;
  description: string;
  base_cost: ResourceCost;
  construction_time_steps: number;
  strategic_benefits: WonderBenefits;
  tourism_base_value: number;
  cultural_base_value: number;
}

export interface ConstructionProgress {
  phase: ConstructionPhase;
  progress_percentage: number;
  resources_needed: ResourceCost;
  estimated_completion_steps: number;
}

export interface WonderConstructionOptions {
  rush: boolean;
  resource_efficiency?: number;
  construction_focus?: 'speed' | 'efficiency' | 'quality';
}

export class WonderService {
  constructor(private pool: Pool) {}

  // Get all available wonder templates
  async getAvailableWonders(): Promise<WonderTemplate[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT 
          wonder_type,
          wonder_category,
          display_name,
          description,
          base_cost,
          construction_time_steps,
          strategic_benefits,
          tourism_base_value,
          cultural_base_value
        FROM wonder_templates
        ORDER BY wonder_category, display_name
      `);

      return result.rows.map(row => ({
        ...row,
        base_cost: typeof row.base_cost === 'string' ? JSON.parse(row.base_cost) : row.base_cost,
        strategic_benefits: typeof row.strategic_benefits === 'string' ? JSON.parse(row.strategic_benefits) : row.strategic_benefits
      }));
    } finally {
      client.release();
    }
  }

  // Get wonders for a specific campaign
  async getCampaignWonders(campaignId: number): Promise<WorldWonder[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT * FROM world_wonders 
        WHERE campaign_id = $1 
        ORDER BY created_at DESC
      `, [campaignId]);

      return result.rows.map(this.mapWonderFromDB);
    } finally {
      client.release();
    }
  }

  // Start construction of a new wonder
  async startWonderConstruction(
    campaignId: number, 
    wonderType: WonderType, 
    customName?: string
  ): Promise<WorldWonder> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get wonder template
      const templateResult = await client.query(`
        SELECT * FROM wonder_templates WHERE wonder_type = $1
      `, [wonderType]);

      if (templateResult.rows.length === 0) {
        throw new Error(`Wonder template not found: ${wonderType}`);
      }

      const template = templateResult.rows[0];
      const wonderName = customName || template.display_name;

      // Check if wonder already exists for this campaign
      const existingResult = await client.query(`
        SELECT id FROM world_wonders 
        WHERE campaign_id = $1 AND wonder_type = $2
      `, [campaignId, wonderType]);

      if (existingResult.rows.length > 0) {
        throw new Error(`Wonder ${wonderType} already exists for this campaign`);
      }

      // Create new wonder
      const insertResult = await client.query(`
        INSERT INTO world_wonders (
          campaign_id,
          wonder_type,
          wonder_name,
          construction_status,
          construction_phase,
          total_cost,
          construction_time_remaining,
          strategic_benefits,
          tourism_attraction_level,
          cultural_significance,
          started_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        RETURNING *
      `, [
        campaignId,
        wonderType,
        wonderName,
        ConstructionStatus.IN_PROGRESS,
        ConstructionPhase.PLANNING,
        JSON.stringify(template.base_cost),
        template.construction_time_steps,
        JSON.stringify(template.strategic_benefits),
        template.tourism_base_value,
        template.cultural_base_value
      ]);

      const wonder = this.mapWonderFromDB(insertResult.rows[0]);

      // Create initial construction progress record
      await client.query(`
        INSERT INTO wonder_construction_progress (
          wonder_id,
          campaign_step,
          phase,
          construction_events
        ) VALUES ($1, $2, $3, $4)
      `, [
        wonder.id,
        0, // Initial step
        ConstructionPhase.PLANNING,
        JSON.stringify([{
          event_type: 'construction_start',
          timestamp: new Date()
        }])
      ]);

      await client.query('COMMIT');
      console.log(`✅ Started construction of ${wonderName} for campaign ${campaignId}`);
      
      return wonder;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Failed to start wonder construction:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Invest resources in wonder construction
  async investResources(
    wonderId: string, 
    resources: ResourceCost, 
    campaignStep: number,
    options: WonderConstructionOptions = { rush: false }
  ): Promise<{ wonder: WorldWonder; progress: ConstructionProgress }> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get current wonder state
      const wonderResult = await client.query(`
        SELECT * FROM world_wonders WHERE id = $1
      `, [wonderId]);

      if (wonderResult.rows.length === 0) {
        throw new Error(`Wonder not found: ${wonderId}`);
      }

      const wonder = this.mapWonderFromDB(wonderResult.rows[0]);
      
      if (wonder.construction_status !== ConstructionStatus.IN_PROGRESS) {
        throw new Error(`Cannot invest in wonder with status: ${wonder.construction_status}`);
      }

      // Calculate progress based on resources invested
      const progressResult = this.calculateConstructionProgress(wonder, resources, options);
      
      // Update wonder with new progress
      const updatedInvested = this.combineResources(wonder.invested_resources, resources);
      const newCompletionPercentage = Math.min(100, Math.max(0, Number(wonder.completion_percentage) + Number(progressResult.progress_gain)));
      
      // Validate completion percentage is a finite number
      if (!isFinite(newCompletionPercentage)) {
        throw new Error('Invalid completion percentage calculated');
      }

      // Determine new phase and status
      let newPhase = wonder.construction_phase;
      let newStatus = wonder.construction_status;
      let completedAt: Date | null = null;

      if (newCompletionPercentage >= 100) {
        newPhase = ConstructionPhase.COMPLETION;
        newStatus = ConstructionStatus.COMPLETED;
        completedAt = new Date();
      } else {
        newPhase = this.determineConstructionPhase(newCompletionPercentage);
      }

      // Update wonder
      await client.query(`
        UPDATE world_wonders SET
          completion_percentage = $1,
          invested_resources = $2,
          construction_phase = $3,
          construction_status = $4,
          construction_time_remaining = $5,
          completed_at = $6
        WHERE id = $7
      `, [
        newCompletionPercentage,
        JSON.stringify(updatedInvested),
        newPhase,
        newStatus,
        Math.max(0, wonder.construction_time_remaining - progressResult.time_saved),
        completedAt,
        wonderId
      ]);

      // Record construction progress
      const constructionEvents: ConstructionEvent[] = [
        {
          event_type: 'resource_investment',
          resources,
          efficiency_modifier: options.resource_efficiency || 1.0,
          timestamp: new Date()
        }
      ];

      if (options.rush) {
        constructionEvents.push({
          event_type: 'rush_construction',
          efficiency_modifier: 1.5,
          timestamp: new Date()
        });
      }

      if (newPhase !== wonder.construction_phase) {
        constructionEvents.push({
          event_type: 'phase_completion',
          timestamp: new Date()
        });
      }

      await client.query(`
        INSERT INTO wonder_construction_progress (
          wonder_id,
          campaign_step,
          phase,
          resources_invested,
          progress_made,
          construction_events
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (wonder_id, campaign_step) DO UPDATE SET
          resources_invested = EXCLUDED.resources_invested,
          progress_made = EXCLUDED.progress_made,
          construction_events = EXCLUDED.construction_events
      `, [
        wonderId,
        campaignStep,
        newPhase,
        JSON.stringify(resources),
        progressResult.progress_gain,
        JSON.stringify(constructionEvents)
      ]);

      const updatedWonder = await this.getWonderById(wonderId);
      const progress = this.calculateRemainingProgress(updatedWonder);

      await client.query('COMMIT');
      console.log(`✅ Invested resources in wonder ${wonder.wonder_name}: ${progressResult.progress_gain}% progress`);
      
      return { wonder: updatedWonder, progress };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Failed to invest resources in wonder:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Get wonder by ID
  async getWonderById(wonderId: string): Promise<WorldWonder> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT * FROM world_wonders WHERE id = $1
      `, [wonderId]);

      if (result.rows.length === 0) {
        throw new Error(`Wonder not found: ${wonderId}`);
      }

      return this.mapWonderFromDB(result.rows[0]);
    } finally {
      client.release();
    }
  }

  // Pause wonder construction
  async pauseConstruction(wonderId: string): Promise<WorldWonder> {
    return this.updateWonderStatus(wonderId, ConstructionStatus.PAUSED);
  }

  // Resume wonder construction
  async resumeConstruction(wonderId: string): Promise<WorldWonder> {
    return this.updateWonderStatus(wonderId, ConstructionStatus.IN_PROGRESS);
  }

  // Cancel wonder construction (with partial resource recovery)
  async cancelConstruction(wonderId: string, recoveryRate: number = 0.5): Promise<{ recoveredResources: ResourceCost }> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const wonder = await this.getWonderById(wonderId);
      
      if (wonder.construction_status === ConstructionStatus.COMPLETED) {
        throw new Error('Cannot cancel completed wonder');
      }

      // Calculate recovered resources
      const recoveredResources: ResourceCost = {};
      for (const [resource, amount] of Object.entries(wonder.invested_resources)) {
        recoveredResources[resource] = Math.floor(amount * recoveryRate);
      }

      // Update wonder status
      await client.query(`
        UPDATE world_wonders SET
          construction_status = $1
        WHERE id = $2
      `, [ConstructionStatus.CANCELLED, wonderId]);

      await client.query('COMMIT');
      console.log(`✅ Cancelled wonder construction: ${wonder.wonder_name}`);
      
      return { recoveredResources };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Failed to cancel wonder construction:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Get wonder construction history
  async getConstructionHistory(wonderId: string): Promise<WonderConstruction[]> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT * FROM wonder_construction_progress 
        WHERE wonder_id = $1 
        ORDER BY campaign_step ASC
      `, [wonderId]);

      return result.rows.map(row => ({
        ...row,
        resources_invested: typeof row.resources_invested === 'string' 
          ? JSON.parse(row.resources_invested) 
          : row.resources_invested,
        construction_events: typeof row.construction_events === 'string'
          ? JSON.parse(row.construction_events)
          : row.construction_events
      }));
    } finally {
      client.release();
    }
  }

  // Private helper methods
  
  private async updateWonderStatus(wonderId: string, status: ConstructionStatus): Promise<WorldWonder> {
    const client = await this.pool.connect();
    
    try {
      await client.query(`
        UPDATE world_wonders SET
          construction_status = $1
        WHERE id = $2
      `, [status, wonderId]);

      return await this.getWonderById(wonderId);
    } finally {
      client.release();
    }
  }

  private mapWonderFromDB(row: any): WorldWonder {
    return {
      ...row,
      completion_percentage: Number(row.completion_percentage) || 0,
      construction_time_remaining: Number(row.construction_time_remaining) || 0,
      tourism_attraction_level: Number(row.tourism_attraction_level) || 0,
      cultural_significance: Number(row.cultural_significance) || 0,
      campaign_id: Number(row.campaign_id) || 0,
      total_cost: typeof row.total_cost === 'string' ? JSON.parse(row.total_cost) : row.total_cost,
      invested_resources: typeof row.invested_resources === 'string' ? JSON.parse(row.invested_resources) : row.invested_resources,
      strategic_benefits: typeof row.strategic_benefits === 'string' ? JSON.parse(row.strategic_benefits) : row.strategic_benefits,
    };
  }

  private calculateConstructionProgress(
    wonder: WorldWonder, 
    resources: ResourceCost, 
    options: WonderConstructionOptions
  ): { progress_gain: number; time_saved: number } {
    let baseProgress = 0;
    let totalCostValue = 0;
    let investedValue = 0;

    // Calculate total value of wonder - ensure numbers are valid
    for (const [resource, amount] of Object.entries(wonder.total_cost)) {
      const resourceValue = this.getResourceValue(resource);
      const validAmount = Number(amount) || 0;
      totalCostValue += validAmount * resourceValue;
    }

    // Calculate value of resources being invested - ensure numbers are valid
    for (const [resource, amount] of Object.entries(resources)) {
      const resourceAmount = Number(amount) || 0;
      if (wonder.total_cost[resource] && resourceAmount > 0) {
        const resourceValue = this.getResourceValue(resource);
        const totalNeeded = Number(wonder.total_cost[resource]) || 0;
        const alreadyInvested = Number(wonder.invested_resources[resource]) || 0;
        const remainingNeeded = Math.max(0, totalNeeded - alreadyInvested);
        const actualInvestment = Math.min(resourceAmount, remainingNeeded);
        
        investedValue += actualInvestment * resourceValue;
      }
    }

    // Base progress calculation with safety checks
    if (totalCostValue > 0 && investedValue > 0) {
      baseProgress = (investedValue / totalCostValue) * 100;
    }

    // Ensure baseProgress is a valid number
    if (!isFinite(baseProgress) || baseProgress < 0) {
      baseProgress = 0;
    }

    // Apply modifiers
    let efficiency = Number(options.resource_efficiency) || 1.0;
    
    if (options.rush) {
      efficiency *= 1.5; // Rush construction bonus
    }

    if (options.construction_focus === 'speed') {
      efficiency *= 1.2;
    } else if (options.construction_focus === 'efficiency') {
      efficiency *= 1.1;
    }

    const finalProgress = baseProgress * efficiency;
    const timeSaved = options.rush ? 2 : 1;

    // Ensure all return values are valid numbers
    const currentCompletion = Number(wonder.completion_percentage) || 0;
    const progressGain = Math.min(Math.max(0, finalProgress), 100 - currentCompletion);

    return {
      progress_gain: Number(progressGain.toFixed(2)) || 0,
      time_saved: Number(timeSaved) || 1
    };
  }

  private determineConstructionPhase(completionPercentage: number): ConstructionPhase {
    if (completionPercentage < 20) return ConstructionPhase.PLANNING;
    if (completionPercentage < 40) return ConstructionPhase.FOUNDATION;
    if (completionPercentage < 70) return ConstructionPhase.STRUCTURE;
    if (completionPercentage < 95) return ConstructionPhase.DETAILS;
    return ConstructionPhase.COMPLETION;
  }

  private calculateRemainingProgress(wonder: WorldWonder): ConstructionProgress {
    const remainingPercentage = 100 - wonder.completion_percentage;
    const remainingResources: ResourceCost = {};

    // Calculate remaining resources needed
    for (const [resource, totalNeeded] of Object.entries(wonder.total_cost)) {
      const invested = wonder.invested_resources[resource] || 0;
      const remaining = Math.max(0, totalNeeded - invested);
      if (remaining > 0) {
        remainingResources[resource] = remaining;
      }
    }

    return {
      phase: wonder.construction_phase,
      progress_percentage: wonder.completion_percentage,
      resources_needed: remainingResources,
      estimated_completion_steps: Math.ceil(remainingPercentage / 5) // Rough estimate
    };
  }

  private combineResources(existing: ResourceCost, additional: ResourceCost): ResourceCost {
    const combined = { ...existing };
    
    for (const [resource, amount] of Object.entries(additional)) {
      combined[resource] = (combined[resource] || 0) + amount;
    }

    return combined;
  }

  private getResourceValue(resource: string): number {
    // Basic resource values for calculation purposes
    const resourceValues: { [key: string]: number } = {
      'stone': 1,
      'metal': 2,
      'concrete': 1.5,
      'gold': 5,
      'crystals': 8,
      'technology': 10,
      'energy': 3,
      'labor': 1
    };

    return resourceValues[resource] || 1;
  }
}
