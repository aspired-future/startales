/**
 * WhoseApp Action Item API
 * Backend service for managing action items, character assignments, and game state integration
 */

import express from 'express';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Action Item Interfaces (matching frontend)
export interface ActionItem {
  id: string;
  title: string;
  description: string;
  assignedCharacterId: string;
  assignedCharacterName: string;
  assignedCharacterTitle: string;
  assignedCharacterAvatar?: string;
  
  actionType: 'cabinet_decision' | 'diplomatic_mission' | 'research_project' | 'military_operation' | 'economic_policy' | 'social_initiative' | 'emergency_response' | 'investigation' | 'negotiation' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent';
  status: 'assigned' | 'in_progress' | 'awaiting_clarification' | 'blocked' | 'completed' | 'failed' | 'cancelled';
  
  createdAt: Date;
  assignedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  estimatedDuration?: number;
  
  progressPercentage: number;
  statusUpdates: ActionStatusUpdate[];
  milestones: ActionMilestone[];
  clarificationRequests: ClarificationRequest[];
  reportBacks: ActionReportBack[];
  
  gameStateImpact: GameStateImpact[];
  simulationEffects: SimulationEffect[];
  consequences: ActionConsequence[];
  
  sourceType: 'leader_command' | 'cabinet_decision' | 'delegation_auto' | 'emergency_protocol' | 'ai_recommendation' | 'character_initiative';
  sourceId?: string;
  
  dependencies: string[];
  blockedBy: string[];
  
  tags: string[];
  confidentialityLevel: 'public' | 'restricted' | 'classified' | 'top_secret';
  departmentIds: string[];
  relatedMissionIds?: string[];
}

export interface ActionStatusUpdate {
  id: string;
  actionId: string;
  characterId: string;
  characterName: string;
  updateType: 'progress' | 'milestone_reached' | 'obstacle_encountered' | 'resource_needed' | 'timeline_change' | 'status_change';
  message: string;
  progressPercentage?: number;
  timestamp: Date;
  attachments?: ActionAttachment[];
  gameStateChanges?: GameStateChange[];
}

export interface ActionMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  isCompleted: boolean;
  progressPercentage: number;
  requirements: string[];
}

export interface ClarificationRequest {
  id: string;
  actionId: string;
  characterId: string;
  characterName: string;
  question: string;
  context: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  requestedAt: Date;
  response?: string;
  respondedAt?: Date;
  respondedBy?: string;
}

export interface ActionReportBack {
  id: string;
  actionId: string;
  characterId: string;
  characterName: string;
  reportType: 'completion' | 'failure' | 'partial_completion' | 'status_update' | 'obstacle_report';
  summary: string;
  details: string;
  outcomes: string[];
  recommendations?: string[];
  timestamp: Date;
  attachments?: ActionAttachment[];
  gameStateChanges: GameStateChange[];
}

export interface ActionAttachment {
  id: string;
  filename: string;
  fileType: 'document' | 'image' | 'video' | 'audio' | 'data' | 'report';
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
}

export interface GameStateImpact {
  category: 'economy' | 'military' | 'diplomacy' | 'research' | 'population' | 'environment' | 'politics' | 'infrastructure';
  subcategory: string;
  expectedChange: number;
  actualChange?: number;
  description: string;
}

export interface SimulationEffect {
  systemType: 'economic' | 'military' | 'diplomatic' | 'research' | 'social' | 'environmental';
  effectType: 'immediate' | 'short_term' | 'long_term' | 'permanent';
  magnitude: number;
  description: string;
  triggerConditions?: string[];
}

export interface ActionConsequence {
  type: 'positive' | 'negative' | 'neutral' | 'mixed';
  category: 'political' | 'economic' | 'social' | 'military' | 'diplomatic' | 'environmental';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  affectedPopulations?: string[];
  longTermEffects?: string[];
}

export interface GameStateChange {
  category: string;
  subcategory: string;
  previousValue: number;
  newValue: number;
  changeAmount: number;
  changePercentage: number;
  timestamp: Date;
  description: string;
}

// Cabinet Action Integration Interface
export interface CabinetActionIntegration {
  cabinetDecisionId: string;
  actionItems: ActionItem[];
  delegationRules: any[];
  autoApprovalSettings: any;
}

export class ActionItemService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Get all action items for a civilization
  async getActionItems(civilizationId: string, filters?: {
    status?: string;
    priority?: string;
    characterId?: string;
    departmentId?: string;
  }): Promise<ActionItem[]> {
    try {
      let query = `
        SELECT ai.*, 
               c.name as assigned_character_name,
               c.title as assigned_character_title,
               c.avatar as assigned_character_avatar
        FROM whoseapp_action_items ai
        LEFT JOIN characters c ON ai.assigned_character_id = c.id
        WHERE ai.civilization_id = $1
      `;
      
      const params: any[] = [civilizationId];
      let paramIndex = 2;

      if (filters?.status && filters.status !== 'all') {
        query += ` AND ai.status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      if (filters?.priority && filters.priority !== 'all') {
        query += ` AND ai.priority = $${paramIndex}`;
        params.push(filters.priority);
        paramIndex++;
      }

      if (filters?.characterId && filters.characterId !== 'all') {
        query += ` AND ai.assigned_character_id = $${paramIndex}`;
        params.push(filters.characterId);
        paramIndex++;
      }

      query += ` ORDER BY ai.created_at DESC`;

      const result = await this.pool.query(query, params);
      
      // Process results and fetch related data
      const actionItems: ActionItem[] = [];
      
      for (const row of result.rows) {
        const actionItem: ActionItem = {
          id: row.id,
          title: row.title,
          description: row.description,
          assignedCharacterId: row.assigned_character_id,
          assignedCharacterName: row.assigned_character_name || 'Unknown',
          assignedCharacterTitle: row.assigned_character_title || 'Unknown',
          assignedCharacterAvatar: row.assigned_character_avatar,
          actionType: row.action_type,
          priority: row.priority,
          status: row.status,
          createdAt: new Date(row.created_at),
          assignedAt: new Date(row.assigned_at),
          dueDate: row.due_date ? new Date(row.due_date) : undefined,
          completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
          estimatedDuration: row.estimated_duration,
          progressPercentage: row.progress_percentage || 0,
          statusUpdates: await this.getStatusUpdates(row.id),
          milestones: await this.getMilestones(row.id),
          clarificationRequests: await this.getClarificationRequests(row.id),
          reportBacks: await this.getReportBacks(row.id),
          gameStateImpact: JSON.parse(row.game_state_impact || '[]'),
          simulationEffects: JSON.parse(row.simulation_effects || '[]'),
          consequences: JSON.parse(row.consequences || '[]'),
          sourceType: row.source_type,
          sourceId: row.source_id,
          dependencies: JSON.parse(row.dependencies || '[]'),
          blockedBy: JSON.parse(row.blocked_by || '[]'),
          tags: JSON.parse(row.tags || '[]'),
          confidentialityLevel: row.confidentiality_level,
          departmentIds: JSON.parse(row.department_ids || '[]'),
          relatedMissionIds: JSON.parse(row.related_mission_ids || '[]')
        };
        
        actionItems.push(actionItem);
      }

      return actionItems;
    } catch (error) {
      console.error('Error fetching action items:', error);
      return this.generateMockActionItems(civilizationId);
    }
  }

  // Create new action item
  async createActionItem(actionItem: Partial<ActionItem>): Promise<ActionItem> {
    try {
      const id = uuidv4();
      const now = new Date();

      const query = `
        INSERT INTO whoseapp_action_items (
          id, title, description, assigned_character_id, action_type, priority, status,
          created_at, assigned_at, due_date, estimated_duration, progress_percentage,
          game_state_impact, simulation_effects, consequences, source_type, source_id,
          dependencies, blocked_by, tags, confidentiality_level, department_ids,
          related_mission_ids, civilization_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
          $18, $19, $20, $21, $22, $23, $24
        ) RETURNING *
      `;

      const values = [
        id,
        actionItem.title,
        actionItem.description,
        actionItem.assignedCharacterId,
        actionItem.actionType || 'other',
        actionItem.priority || 'medium',
        actionItem.status || 'assigned',
        now,
        actionItem.assignedAt || now,
        actionItem.dueDate,
        actionItem.estimatedDuration,
        actionItem.progressPercentage || 0,
        JSON.stringify(actionItem.gameStateImpact || []),
        JSON.stringify(actionItem.simulationEffects || []),
        JSON.stringify(actionItem.consequences || []),
        actionItem.sourceType || 'leader_command',
        actionItem.sourceId,
        JSON.stringify(actionItem.dependencies || []),
        JSON.stringify(actionItem.blockedBy || []),
        JSON.stringify(actionItem.tags || []),
        actionItem.confidentialityLevel || 'public',
        JSON.stringify(actionItem.departmentIds || []),
        JSON.stringify(actionItem.relatedMissionIds || []),
        actionItem.civilizationId
      ];

      const result = await this.pool.query(query, values);
      
      // Trigger game state integration
      await this.integrateWithGameState(id, actionItem);
      
      // Notify via WebSocket
      await this.notifyActionCreated(id);

      return await this.getActionItemById(id);
    } catch (error) {
      console.error('Error creating action item:', error);
      throw new Error('Failed to create action item');
    }
  }

  // Update action item status
  async updateActionStatus(actionId: string, update: Partial<ActionStatusUpdate>): Promise<ActionItem> {
    try {
      // Create status update record
      const updateId = uuidv4();
      const now = new Date();

      const statusUpdateQuery = `
        INSERT INTO whoseapp_action_status_updates (
          id, action_id, character_id, character_name, update_type, message,
          progress_percentage, timestamp, game_state_changes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;

      await this.pool.query(statusUpdateQuery, [
        updateId,
        actionId,
        update.characterId,
        update.characterName,
        update.updateType || 'progress',
        update.message,
        update.progressPercentage,
        now,
        JSON.stringify(update.gameStateChanges || [])
      ]);

      // Update main action item
      if (update.progressPercentage !== undefined) {
        await this.pool.query(
          'UPDATE whoseapp_action_items SET progress_percentage = $1 WHERE id = $2',
          [update.progressPercentage, actionId]
        );
      }

      // Apply game state changes if any
      if (update.gameStateChanges && update.gameStateChanges.length > 0) {
        await this.applyGameStateChanges(actionId, update.gameStateChanges);
      }

      // Notify via WebSocket
      await this.notifyActionUpdated(actionId);

      return await this.getActionItemById(actionId);
    } catch (error) {
      console.error('Error updating action status:', error);
      throw new Error('Failed to update action status');
    }
  }

  // Handle clarification requests
  async createClarificationRequest(actionId: string, request: Partial<ClarificationRequest>): Promise<ActionItem> {
    try {
      const requestId = uuidv4();
      const now = new Date();

      const query = `
        INSERT INTO whoseapp_clarification_requests (
          id, action_id, character_id, character_name, question, context,
          urgency, requested_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;

      await this.pool.query(query, [
        requestId,
        actionId,
        request.characterId,
        request.characterName,
        request.question,
        request.context,
        request.urgency || 'medium',
        now
      ]);

      // Update action status to awaiting clarification
      await this.pool.query(
        'UPDATE whoseapp_action_items SET status = $1 WHERE id = $2',
        ['awaiting_clarification', actionId]
      );

      // Notify via WebSocket
      await this.notifyActionUpdated(actionId);
      await this.notifyClarificationRequested(actionId, requestId);

      return await this.getActionItemById(actionId);
    } catch (error) {
      console.error('Error creating clarification request:', error);
      throw new Error('Failed to create clarification request');
    }
  }

  // Integration with Cabinet Actions
  async createActionFromCabinetDecision(cabinetDecisionId: string, decision: any): Promise<ActionItem[]> {
    try {
      const actionItems: ActionItem[] = [];

      // Parse cabinet decision and create corresponding action items
      if (decision.delegations && decision.delegations.length > 0) {
        for (const delegation of decision.delegations) {
          const actionItem: Partial<ActionItem> = {
            title: `Execute Cabinet Decision: ${decision.title}`,
            description: `Implement cabinet decision regarding ${decision.description}. Delegation level: ${delegation.level}`,
            assignedCharacterId: delegation.delegateId,
            actionType: 'cabinet_decision',
            priority: this.mapCabinetPriorityToActionPriority(decision.priority),
            sourceType: 'cabinet_decision',
            sourceId: cabinetDecisionId,
            departmentIds: [delegation.departmentId],
            gameStateImpact: this.extractGameStateImpact(decision),
            simulationEffects: this.extractSimulationEffects(decision),
            tags: ['cabinet', 'delegation', decision.category],
            confidentialityLevel: decision.confidentialityLevel || 'restricted',
            dueDate: decision.deadline ? new Date(decision.deadline) : undefined,
            estimatedDuration: decision.estimatedDuration || 48
          };

          const createdAction = await this.createActionItem(actionItem);
          actionItems.push(createdAction);
        }
      }

      // Handle auto-delegation rules
      if (decision.autoApproval) {
        await this.processAutoDelegation(cabinetDecisionId, decision);
      }

      return actionItems;
    } catch (error) {
      console.error('Error creating actions from cabinet decision:', error);
      throw new Error('Failed to create actions from cabinet decision');
    }
  }

  // Process auto-delegation based on cabinet rules
  async processAutoDelegation(cabinetDecisionId: string, decision: any): Promise<void> {
    try {
      // Get auto-delegation rules for the decision type
      const rules = await this.getAutoDelegationRules(decision.category, decision.priority);

      for (const rule of rules) {
        if (this.shouldAutoDelegate(decision, rule)) {
          const actionItem: Partial<ActionItem> = {
            title: `Auto-Delegated: ${decision.title}`,
            description: `Automatically delegated based on rule: ${rule.name}. ${decision.description}`,
            assignedCharacterId: rule.targetCharacterId,
            actionType: 'cabinet_decision',
            priority: decision.priority,
            status: 'in_progress', // Auto-start if rule allows
            sourceType: 'delegation_auto',
            sourceId: rule.id,
            departmentIds: rule.departmentIds,
            tags: ['auto-delegated', 'cabinet', decision.category],
            confidentialityLevel: decision.confidentialityLevel || 'restricted'
          };

          await this.createActionItem(actionItem);
        }
      }
    } catch (error) {
      console.error('Error processing auto-delegation:', error);
    }
  }

  // Helper methods
  private async getStatusUpdates(actionId: string): Promise<ActionStatusUpdate[]> {
    try {
      const result = await this.pool.query(
        'SELECT * FROM whoseapp_action_status_updates WHERE action_id = $1 ORDER BY timestamp DESC',
        [actionId]
      );

      return result.rows.map(row => ({
        id: row.id,
        actionId: row.action_id,
        characterId: row.character_id,
        characterName: row.character_name,
        updateType: row.update_type,
        message: row.message,
        progressPercentage: row.progress_percentage,
        timestamp: new Date(row.timestamp),
        attachments: JSON.parse(row.attachments || '[]'),
        gameStateChanges: JSON.parse(row.game_state_changes || '[]')
      }));
    } catch (error) {
      console.error('Error fetching status updates:', error);
      return [];
    }
  }

  private async getMilestones(actionId: string): Promise<ActionMilestone[]> {
    try {
      const result = await this.pool.query(
        'SELECT * FROM whoseapp_action_milestones WHERE action_id = $1 ORDER BY target_date ASC',
        [actionId]
      );

      return result.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        targetDate: new Date(row.target_date),
        completedDate: row.completed_date ? new Date(row.completed_date) : undefined,
        isCompleted: row.is_completed,
        progressPercentage: row.progress_percentage,
        requirements: JSON.parse(row.requirements || '[]')
      }));
    } catch (error) {
      console.error('Error fetching milestones:', error);
      return [];
    }
  }

  private async getClarificationRequests(actionId: string): Promise<ClarificationRequest[]> {
    try {
      const result = await this.pool.query(
        'SELECT * FROM whoseapp_clarification_requests WHERE action_id = $1 ORDER BY requested_at DESC',
        [actionId]
      );

      return result.rows.map(row => ({
        id: row.id,
        actionId: row.action_id,
        characterId: row.character_id,
        characterName: row.character_name,
        question: row.question,
        context: row.context,
        urgency: row.urgency,
        requestedAt: new Date(row.requested_at),
        response: row.response,
        respondedAt: row.responded_at ? new Date(row.responded_at) : undefined,
        respondedBy: row.responded_by
      }));
    } catch (error) {
      console.error('Error fetching clarification requests:', error);
      return [];
    }
  }

  private async getReportBacks(actionId: string): Promise<ActionReportBack[]> {
    try {
      const result = await this.pool.query(
        'SELECT * FROM whoseapp_action_report_backs WHERE action_id = $1 ORDER BY timestamp DESC',
        [actionId]
      );

      return result.rows.map(row => ({
        id: row.id,
        actionId: row.action_id,
        characterId: row.character_id,
        characterName: row.character_name,
        reportType: row.report_type,
        summary: row.summary,
        details: row.details,
        outcomes: JSON.parse(row.outcomes || '[]'),
        recommendations: JSON.parse(row.recommendations || '[]'),
        timestamp: new Date(row.timestamp),
        attachments: JSON.parse(row.attachments || '[]'),
        gameStateChanges: JSON.parse(row.game_state_changes || '[]')
      }));
    } catch (error) {
      console.error('Error fetching report backs:', error);
      return [];
    }
  }

  private async getActionItemById(actionId: string): Promise<ActionItem> {
    const result = await this.pool.query(
      'SELECT * FROM whoseapp_action_items WHERE id = $1',
      [actionId]
    );

    if (result.rows.length === 0) {
      throw new Error('Action item not found');
    }

    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      assignedCharacterId: row.assigned_character_id,
      assignedCharacterName: row.assigned_character_name || 'Unknown',
      assignedCharacterTitle: row.assigned_character_title || 'Unknown',
      assignedCharacterAvatar: row.assigned_character_avatar,
      actionType: row.action_type,
      priority: row.priority,
      status: row.status,
      createdAt: new Date(row.created_at),
      assignedAt: new Date(row.assigned_at),
      dueDate: row.due_date ? new Date(row.due_date) : undefined,
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      estimatedDuration: row.estimated_duration,
      progressPercentage: row.progress_percentage || 0,
      statusUpdates: await this.getStatusUpdates(row.id),
      milestones: await this.getMilestones(row.id),
      clarificationRequests: await this.getClarificationRequests(row.id),
      reportBacks: await this.getReportBacks(row.id),
      gameStateImpact: JSON.parse(row.game_state_impact || '[]'),
      simulationEffects: JSON.parse(row.simulation_effects || '[]'),
      consequences: JSON.parse(row.consequences || '[]'),
      sourceType: row.source_type,
      sourceId: row.source_id,
      dependencies: JSON.parse(row.dependencies || '[]'),
      blockedBy: JSON.parse(row.blocked_by || '[]'),
      tags: JSON.parse(row.tags || '[]'),
      confidentialityLevel: row.confidentiality_level,
      departmentIds: JSON.parse(row.department_ids || '[]'),
      relatedMissionIds: JSON.parse(row.related_mission_ids || '[]')
    };
  }

  private async integrateWithGameState(actionId: string, actionItem: Partial<ActionItem>): Promise<void> {
    // Integrate with simulation engine
    // Apply immediate game state changes
    // Trigger AI responses
    // Update character workloads
  }

  private async applyGameStateChanges(actionId: string, changes: GameStateChange[]): Promise<void> {
    // Apply changes to game state database
    // Trigger simulation updates
    // Notify other systems
  }

  private async notifyActionCreated(actionId: string): Promise<void> {
    // Send WebSocket notification
  }

  private async notifyActionUpdated(actionId: string): Promise<void> {
    // Send WebSocket notification
  }

  private async notifyClarificationRequested(actionId: string, requestId: string): Promise<void> {
    // Send WebSocket notification
  }

  private mapCabinetPriorityToActionPriority(cabinetPriority: string): 'low' | 'medium' | 'high' | 'critical' | 'urgent' {
    const mapping: { [key: string]: 'low' | 'medium' | 'high' | 'critical' | 'urgent' } = {
      'low': 'low',
      'medium': 'medium',
      'high': 'high',
      'critical': 'critical',
      'urgent': 'urgent'
    };
    return mapping[cabinetPriority] || 'medium';
  }

  private extractGameStateImpact(decision: any): GameStateImpact[] {
    // Extract expected game state impacts from cabinet decision
    return [];
  }

  private extractSimulationEffects(decision: any): SimulationEffect[] {
    // Extract simulation effects from cabinet decision
    return [];
  }

  private async getAutoDelegationRules(category: string, priority: string): Promise<any[]> {
    // Get auto-delegation rules from database
    return [];
  }

  private shouldAutoDelegate(decision: any, rule: any): boolean {
    // Check if decision meets auto-delegation criteria
    return false;
  }

  // Mock data for development
  private generateMockActionItems(civilizationId: string): ActionItem[] {
    return [
      {
        id: 'action_001',
        title: 'Negotiate Trade Agreement with Zephyrian Empire',
        description: 'Establish comprehensive trade relations focusing on rare minerals and advanced technology exchange',
        assignedCharacterId: 'char_diplomat_001',
        assignedCharacterName: 'Ambassador Elena Vasquez',
        assignedCharacterTitle: 'Chief Diplomatic Officer',
        assignedCharacterAvatar: '/api/characters/avatars/elena_vasquez.jpg',
        actionType: 'diplomatic_mission',
        priority: 'high',
        status: 'in_progress',
        createdAt: new Date(Date.now() - 86400000 * 3),
        assignedAt: new Date(Date.now() - 86400000 * 2),
        dueDate: new Date(Date.now() + 86400000 * 7),
        estimatedDuration: 120,
        progressPercentage: 65,
        statusUpdates: [],
        milestones: [],
        clarificationRequests: [],
        reportBacks: [],
        gameStateImpact: [
          {
            category: 'economy',
            subcategory: 'trade_volume',
            expectedChange: 25,
            description: 'Expected 25% increase in trade volume'
          }
        ],
        simulationEffects: [],
        consequences: [],
        sourceType: 'leader_command',
        dependencies: [],
        blockedBy: [],
        tags: ['diplomacy', 'trade', 'zephyrian'],
        confidentialityLevel: 'restricted',
        departmentIds: ['dept_foreign_affairs']
      }
    ];
  }
}

// API Routes
export function createActionItemRoutes(pool: Pool): express.Router {
  const actionService = new ActionItemService(pool);

  // Get action items
  router.get('/actions', async (req, res) => {
    try {
      const { civilizationId, status, priority, characterId, departmentId } = req.query;
      
      if (!civilizationId) {
        return res.status(400).json({ error: 'civilizationId is required' });
      }

      const filters = {
        status: status as string,
        priority: priority as string,
        characterId: characterId as string,
        departmentId: departmentId as string
      };

      const actions = await actionService.getActionItems(civilizationId as string, filters);
      res.json({ actions });
    } catch (error) {
      console.error('Error fetching actions:', error);
      res.status(500).json({ error: 'Failed to fetch actions' });
    }
  });

  // Create action item
  router.post('/actions', async (req, res) => {
    try {
      const actionItem = req.body;
      const createdAction = await actionService.createActionItem(actionItem);
      res.status(201).json(createdAction);
    } catch (error) {
      console.error('Error creating action:', error);
      res.status(500).json({ error: 'Failed to create action' });
    }
  });

  // Update action status
  router.post('/actions/:actionId/status', async (req, res) => {
    try {
      const { actionId } = req.params;
      const update = req.body;
      const updatedAction = await actionService.updateActionStatus(actionId, update);
      res.json(updatedAction);
    } catch (error) {
      console.error('Error updating action status:', error);
      res.status(500).json({ error: 'Failed to update action status' });
    }
  });

  // Create clarification request
  router.post('/actions/:actionId/clarification', async (req, res) => {
    try {
      const { actionId } = req.params;
      const request = req.body;
      const updatedAction = await actionService.createClarificationRequest(actionId, request);
      res.json(updatedAction);
    } catch (error) {
      console.error('Error creating clarification request:', error);
      res.status(500).json({ error: 'Failed to create clarification request' });
    }
  });

  // Create actions from cabinet decision
  router.post('/actions/from-cabinet/:cabinetDecisionId', async (req, res) => {
    try {
      const { cabinetDecisionId } = req.params;
      const decision = req.body;
      const actions = await actionService.createActionFromCabinetDecision(cabinetDecisionId, decision);
      res.status(201).json({ actions });
    } catch (error) {
      console.error('Error creating actions from cabinet decision:', error);
      res.status(500).json({ error: 'Failed to create actions from cabinet decision' });
    }
  });

  return router;
}

export default createActionItemRoutes;

