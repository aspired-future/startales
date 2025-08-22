/**
 * Missions Service
 * Manages missions integrated with Game Master AI and story system
 */

import { Pool } from 'pg';

export interface Mission {
  id: string;
  campaignId: string;
  civilizationId: string;
  title: string;
  description: string;
  type: 'exploration' | 'diplomatic' | 'military' | 'economic' | 'research' | 'espionage' | 'humanitarian' | 'cultural';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'available' | 'active' | 'completed' | 'failed' | 'cancelled' | 'on_hold';
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 = Easy, 5 = Legendary
  
  // Story Integration
  storyArc: string;
  gameMasterGenerated: boolean;
  storyContext: any;
  narrativeImpact: 'minor' | 'moderate' | 'major' | 'pivotal';
  
  // Mission Details
  objectives: MissionObjective[];
  rewards: MissionReward[];
  risks: MissionRisk[];
  requirements: MissionRequirement[];
  
  // Timing
  timeLimit?: number; // in game days
  estimatedDuration: number; // in game days
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  expiresAt?: Date;
  
  // Progress
  progress: number; // 0-100
  currentPhase: string;
  assignedCharacters: string[];
  assignedFleets: string[];
  assignedResources: any;
  
  // AI Integration
  aiAnalysis?: any;
  successProbability: number; // 0-100
  gameMasterNotes: string;
}

export interface MissionObjective {
  id: string;
  description: string;
  type: 'primary' | 'secondary' | 'bonus';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number; // 0-100
  requirements?: any;
  rewards?: any;
}

export interface MissionReward {
  type: 'resources' | 'technology' | 'reputation' | 'territory' | 'characters' | 'story_unlock' | 'special';
  amount?: number;
  description: string;
  storySignificance?: string;
}

export interface MissionRisk {
  type: 'military' | 'diplomatic' | 'economic' | 'technological' | 'environmental' | 'political';
  severity: 'low' | 'medium' | 'high' | 'extreme';
  probability: number; // 0-100
  description: string;
  mitigation?: string;
}

export interface MissionRequirement {
  type: 'technology' | 'resources' | 'characters' | 'fleets' | 'reputation' | 'story_progress';
  description: string;
  met: boolean;
  details?: any;
}

export interface MissionTemplate {
  id: string;
  name: string;
  type: Mission['type'];
  difficulty: Mission['difficulty'];
  template: Partial<Mission>;
  storyTriggers: string[];
  gameMasterPrompts: string[];
}

export class MissionsService {
  constructor(private pool: Pool) {}

  /**
   * Get all missions for a civilization
   */
  async getMissions(campaignId: string, civilizationId: string, status?: Mission['status']): Promise<Mission[]> {
    try {
      let query = `
        SELECT * FROM missions 
        WHERE campaign_id = $1 AND civilization_id = $2
      `;
      const params: any[] = [campaignId, civilizationId];

      if (status) {
        query += ` AND status = $3`;
        params.push(status);
      }

      query += ` ORDER BY priority DESC, created_at DESC`;

      const result = await this.pool.query(query, params);
      return result.rows.map(row => this.mapRowToMission(row));
    } catch (error) {
      console.error('Error getting missions:', error);
      throw error;
    }
  }

  /**
   * Get a specific mission by ID
   */
  async getMission(missionId: string): Promise<Mission | null> {
    try {
      const result = await this.pool.query(
        'SELECT * FROM missions WHERE id = $1',
        [missionId]
      );

      if (result.rows.length === 0) return null;
      return this.mapRowToMission(result.rows[0]);
    } catch (error) {
      console.error('Error getting mission:', error);
      throw error;
    }
  }

  /**
   * Create a new mission
   */
  async createMission(mission: Omit<Mission, 'id' | 'createdAt'>): Promise<Mission> {
    try {
      const id = `mission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const createdAt = new Date();

      const result = await this.pool.query(`
        INSERT INTO missions (
          id, campaign_id, civilization_id, title, description, type, priority, 
          status, difficulty, story_arc, game_master_generated, story_context,
          narrative_impact, objectives, rewards, risks, requirements, time_limit,
          estimated_duration, created_at, expires_at, progress, current_phase,
          assigned_characters, assigned_fleets, assigned_resources, ai_analysis,
          success_probability, game_master_notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29
        ) RETURNING *
      `, [
        id, mission.campaignId, mission.civilizationId, mission.title,
        mission.description, mission.type, mission.priority, mission.status,
        mission.difficulty, mission.storyArc, mission.gameMasterGenerated,
        JSON.stringify(mission.storyContext), mission.narrativeImpact,
        JSON.stringify(mission.objectives), JSON.stringify(mission.rewards),
        JSON.stringify(mission.risks), JSON.stringify(mission.requirements),
        mission.timeLimit, mission.estimatedDuration, createdAt,
        mission.expiresAt, mission.progress, mission.currentPhase,
        JSON.stringify(mission.assignedCharacters), JSON.stringify(mission.assignedFleets),
        JSON.stringify(mission.assignedResources), JSON.stringify(mission.aiAnalysis),
        mission.successProbability, mission.gameMasterNotes
      ]);

      return this.mapRowToMission(result.rows[0]);
    } catch (error) {
      console.error('Error creating mission:', error);
      throw error;
    }
  }

  /**
   * Update mission status and progress
   */
  async updateMission(missionId: string, updates: Partial<Mission>): Promise<Mission> {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      // Build dynamic update query
      Object.entries(updates).forEach(([key, value]) => {
        if (key === 'id') return; // Don't update ID
        
        const dbKey = this.camelToSnake(key);
        setClause.push(`${dbKey} = $${paramIndex}`);
        
        if (typeof value === 'object' && value !== null) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
        paramIndex++;
      });

      values.push(missionId);

      const result = await this.pool.query(`
        UPDATE missions 
        SET ${setClause.join(', ')}, updated_at = NOW()
        WHERE id = $${paramIndex}
        RETURNING *
      `, values);

      if (result.rows.length === 0) {
        throw new Error('Mission not found');
      }

      return this.mapRowToMission(result.rows[0]);
    } catch (error) {
      console.error('Error updating mission:', error);
      throw error;
    }
  }

  /**
   * Start a mission
   */
  async startMission(missionId: string, assignedCharacters: string[], assignedFleets: string[] = []): Promise<Mission> {
    try {
      const mission = await this.getMission(missionId);
      if (!mission) throw new Error('Mission not found');

      if (mission.status !== 'available') {
        throw new Error('Mission is not available to start');
      }

      // Check requirements
      const requirementsMet = await this.checkMissionRequirements(mission);
      if (!requirementsMet) {
        throw new Error('Mission requirements not met');
      }

      return await this.updateMission(missionId, {
        status: 'active',
        startedAt: new Date(),
        assignedCharacters,
        assignedFleets,
        currentPhase: 'preparation'
      });
    } catch (error) {
      console.error('Error starting mission:', error);
      throw error;
    }
  }

  /**
   * Complete a mission
   */
  async completeMission(missionId: string, success: boolean, results?: any): Promise<Mission> {
    try {
      const mission = await this.getMission(missionId);
      if (!mission) throw new Error('Mission not found');

      const status = success ? 'completed' : 'failed';
      const completedAt = new Date();

      // Apply rewards if successful
      if (success && mission.rewards.length > 0) {
        await this.applyMissionRewards(mission);
      }

      // Update story context if this was a story mission
      if (mission.gameMasterGenerated && mission.narrativeImpact !== 'minor') {
        await this.updateStoryProgress(mission, success, results);
      }

      return await this.updateMission(missionId, {
        status,
        completedAt,
        progress: success ? 100 : mission.progress,
        currentPhase: success ? 'completed' : 'failed'
      });
    } catch (error) {
      console.error('Error completing mission:', error);
      throw error;
    }
  }

  /**
   * Generate AI-driven mission based on current game state
   */
  async generateGameMasterMission(
    campaignId: string, 
    civilizationId: string, 
    gameState: any,
    storyContext?: any
  ): Promise<Mission> {
    try {
      // This would integrate with your AI system to generate contextual missions
      const aiPrompt = this.buildMissionGenerationPrompt(gameState, storyContext);
      
      // Mock AI response for now - replace with actual AI integration
      const aiResponse = await this.callGameMasterAI(aiPrompt);
      
      const mission = this.parseMissionFromAI(aiResponse, campaignId, civilizationId);
      
      return await this.createMission(mission);
    } catch (error) {
      console.error('Error generating Game Master mission:', error);
      throw error;
    }
  }

  /**
   * Get available mission templates
   */
  async getMissionTemplates(type?: Mission['type']): Promise<MissionTemplate[]> {
    try {
      let query = 'SELECT * FROM mission_templates';
      const params: any[] = [];

      if (type) {
        query += ' WHERE type = $1';
        params.push(type);
      }

      query += ' ORDER BY difficulty ASC, name ASC';

      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting mission templates:', error);
      throw error;
    }
  }

  /**
   * Private helper methods
   */
  private mapRowToMission(row: any): Mission {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      civilizationId: row.civilization_id,
      title: row.title,
      description: row.description,
      type: row.type,
      priority: row.priority,
      status: row.status,
      difficulty: row.difficulty,
      storyArc: row.story_arc,
      gameMasterGenerated: row.game_master_generated,
      storyContext: row.story_context ? JSON.parse(row.story_context) : {},
      narrativeImpact: row.narrative_impact,
      objectives: row.objectives ? JSON.parse(row.objectives) : [],
      rewards: row.rewards ? JSON.parse(row.rewards) : [],
      risks: row.risks ? JSON.parse(row.risks) : [],
      requirements: row.requirements ? JSON.parse(row.requirements) : [],
      timeLimit: row.time_limit,
      estimatedDuration: row.estimated_duration,
      createdAt: row.created_at,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      expiresAt: row.expires_at,
      progress: row.progress || 0,
      currentPhase: row.current_phase || 'available',
      assignedCharacters: row.assigned_characters ? JSON.parse(row.assigned_characters) : [],
      assignedFleets: row.assigned_fleets ? JSON.parse(row.assigned_fleets) : [],
      assignedResources: row.assigned_resources ? JSON.parse(row.assigned_resources) : {},
      aiAnalysis: row.ai_analysis ? JSON.parse(row.ai_analysis) : null,
      successProbability: row.success_probability || 50,
      gameMasterNotes: row.game_master_notes || ''
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  private async checkMissionRequirements(mission: Mission): Promise<boolean> {
    // Implementation would check actual game state against requirements
    // For now, return true
    return true;
  }

  private async applyMissionRewards(mission: Mission): Promise<void> {
    // Implementation would apply rewards to civilization
    console.log(`Applying rewards for mission ${mission.id}:`, mission.rewards);
  }

  private async updateStoryProgress(mission: Mission, success: boolean, results?: any): Promise<void> {
    // Implementation would update story state based on mission outcome
    console.log(`Updating story progress for mission ${mission.id}:`, { success, results });
  }

  private buildMissionGenerationPrompt(gameState: any, storyContext?: any): string {
    return `
      Generate a mission for the galactic civilization based on current game state:
      
      Game State: ${JSON.stringify(gameState, null, 2)}
      Story Context: ${JSON.stringify(storyContext, null, 2)}
      
      Create a mission that:
      1. Fits the current story arc and civilization state
      2. Provides meaningful choices and consequences
      3. Advances the narrative in an interesting direction
      4. Balances risk and reward appropriately
      5. Considers the civilization's current capabilities
      
      Return a structured mission with objectives, rewards, risks, and requirements.
    `;
  }

  private async callGameMasterAI(prompt: string): Promise<any> {
    // Mock AI response - replace with actual AI integration
    return {
      title: "Mysterious Signal from the Void",
      description: "Long-range sensors have detected an unusual signal emanating from an unexplored sector. The pattern suggests artificial origin, but the technology is unlike anything in our databases.",
      type: "exploration",
      difficulty: 3,
      objectives: [
        {
          id: "obj_1",
          description: "Investigate the source of the mysterious signal",
          type: "primary",
          status: "pending",
          progress: 0
        }
      ],
      rewards: [
        {
          type: "technology",
          description: "Potential access to unknown alien technology",
          storySignificance: "Could unlock new research paths"
        }
      ],
      risks: [
        {
          type: "military",
          severity: "medium",
          probability: 40,
          description: "Unknown alien entities may be hostile"
        }
      ]
    };
  }

  private parseMissionFromAI(aiResponse: any, campaignId: string, civilizationId: string): Omit<Mission, 'id' | 'createdAt'> {
    return {
      campaignId,
      civilizationId,
      title: aiResponse.title,
      description: aiResponse.description,
      type: aiResponse.type,
      priority: 'medium',
      status: 'available',
      difficulty: aiResponse.difficulty,
      storyArc: 'main_story',
      gameMasterGenerated: true,
      storyContext: aiResponse,
      narrativeImpact: 'moderate',
      objectives: aiResponse.objectives || [],
      rewards: aiResponse.rewards || [],
      risks: aiResponse.risks || [],
      requirements: aiResponse.requirements || [],
      estimatedDuration: 30,
      progress: 0,
      currentPhase: 'available',
      assignedCharacters: [],
      assignedFleets: [],
      assignedResources: {},
      successProbability: 60,
      gameMasterNotes: 'Generated by Game Master AI based on current game state'
    };
  }
}

export default MissionsService;

