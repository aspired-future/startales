/**
 * Character Action Service
 * Handles character-initiated actions and their execution through game APIs
 */

import { Pool } from 'pg';

export interface CharacterAction {
  id: string;
  conversationId: string;
  characterId: string;
  characterName: string;
  actionType: 'diplomatic' | 'military' | 'economic' | 'research' | 'intelligence' | 'infrastructure' | 'policy';
  title: string;
  description: string;
  targetAPI: string; // Which game API to call
  parameters: any; // Parameters for the API call
  status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  startTime?: Date;
  completionTime?: Date;
  progress: number; // 0-100
  progressMessages: Array<{
    timestamp: Date;
    message: string;
    progress: number;
  }>;
  result?: {
    success: boolean;
    outcome: string;
    data?: any;
    impact?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionCapability {
  characterId: string;
  department: string;
  capabilities: Array<{
    actionType: string;
    apiEndpoints: string[];
    description: string;
    requiredPermissions: string[];
  }>;
}

export class CharacterActionService {
  private pool: Pool;
  private activeActions: Map<string, NodeJS.Timeout> = new Map();

  constructor(pool: Pool) {
    this.pool = pool;
    this.initializeSchema();
  }

  private async initializeSchema(): Promise<void> {
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS character_actions (
          id VARCHAR(255) PRIMARY KEY,
          conversation_id VARCHAR(255) NOT NULL,
          character_id VARCHAR(255) NOT NULL,
          character_name VARCHAR(255) NOT NULL,
          action_type VARCHAR(50) NOT NULL,
          title VARCHAR(500) NOT NULL,
          description TEXT,
          target_api VARCHAR(255) NOT NULL,
          parameters JSONB,
          status VARCHAR(50) DEFAULT 'proposed',
          priority VARCHAR(20) DEFAULT 'medium',
          estimated_duration INTEGER DEFAULT 30,
          actual_duration INTEGER,
          start_time TIMESTAMP,
          completion_time TIMESTAMP,
          progress INTEGER DEFAULT 0,
          progress_messages JSONB DEFAULT '[]',
          result JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_character_actions_conversation ON character_actions(conversation_id);
        CREATE INDEX IF NOT EXISTS idx_character_actions_character ON character_actions(character_id);
        CREATE INDEX IF NOT EXISTS idx_character_actions_status ON character_actions(status);
        CREATE INDEX IF NOT EXISTS idx_character_actions_created ON character_actions(created_at);

        CREATE TABLE IF NOT EXISTS character_capabilities (
          character_id VARCHAR(255) PRIMARY KEY,
          department VARCHAR(100) NOT NULL,
          capabilities JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Initialize default capabilities for cabinet members
      await this.initializeDefaultCapabilities();
      
      console.log('✅ Character Action Service schema initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Character Action Service schema:', error);
    }
  }

  private async initializeDefaultCapabilities(): Promise<void> {
    const defaultCapabilities = [
      {
        characterId: 'char_defense_001',
        department: 'Defense',
        capabilities: [
          {
            actionType: 'military',
            apiEndpoints: ['/api/military/deploy-fleet', '/api/military/set-readiness', '/api/military/patrol-sector'],
            description: 'Military operations and fleet management',
            requiredPermissions: ['military_command', 'fleet_deployment']
          },
          {
            actionType: 'intelligence',
            apiEndpoints: ['/api/intelligence/gather', '/api/intelligence/analyze-threat'],
            description: 'Intelligence gathering and threat analysis',
            requiredPermissions: ['intelligence_access', 'threat_analysis']
          }
        ]
      },
      {
        characterId: 'char_economic_001',
        department: 'Economic Affairs',
        capabilities: [
          {
            actionType: 'economic',
            apiEndpoints: ['/api/economy/adjust-budget', '/api/economy/trade-agreement', '/api/economy/resource-allocation'],
            description: 'Economic policy and resource management',
            requiredPermissions: ['budget_control', 'trade_authority']
          },
          {
            actionType: 'infrastructure',
            apiEndpoints: ['/api/infrastructure/build', '/api/infrastructure/upgrade'],
            description: 'Infrastructure development and upgrades',
            requiredPermissions: ['infrastructure_planning', 'construction_authority']
          }
        ]
      },
      {
        characterId: 'char_foreign_001',
        department: 'Foreign Affairs',
        capabilities: [
          {
            actionType: 'diplomatic',
            apiEndpoints: ['/api/diplomacy/send-envoy', '/api/diplomacy/negotiate', '/api/diplomacy/treaty'],
            description: 'Diplomatic relations and negotiations',
            requiredPermissions: ['diplomatic_authority', 'treaty_negotiation']
          },
          {
            actionType: 'intelligence',
            apiEndpoints: ['/api/intelligence/foreign-analysis', '/api/intelligence/embassy-reports'],
            description: 'Foreign intelligence and diplomatic intelligence',
            requiredPermissions: ['diplomatic_intelligence', 'foreign_analysis']
          }
        ]
      }
    ];

    for (const capability of defaultCapabilities) {
      await this.pool.query(`
        INSERT INTO character_capabilities (character_id, department, capabilities)
        VALUES ($1, $2, $3)
        ON CONFLICT (character_id) DO UPDATE SET
          capabilities = $3,
          updated_at = CURRENT_TIMESTAMP
      `, [capability.characterId, capability.department, JSON.stringify(capability.capabilities)]);
    }
  }

  async proposeAction(
    conversationId: string,
    characterId: string,
    characterName: string,
    actionType: string,
    title: string,
    description: string,
    targetAPI: string,
    parameters: any,
    estimatedDuration: number = 30,
    priority: string = 'medium'
  ): Promise<CharacterAction> {
    const actionId = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const action: CharacterAction = {
      id: actionId,
      conversationId,
      characterId,
      characterName,
      actionType: actionType as any,
      title,
      description,
      targetAPI,
      parameters,
      status: 'proposed',
      priority: priority as any,
      estimatedDuration,
      progress: 0,
      progressMessages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.pool.query(`
      INSERT INTO character_actions 
      (id, conversation_id, character_id, character_name, action_type, title, description, 
       target_api, parameters, status, priority, estimated_duration, progress, progress_messages)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `, [
      action.id, action.conversationId, action.characterId, action.characterName,
      action.actionType, action.title, action.description, action.targetAPI,
      JSON.stringify(action.parameters), action.status, action.priority,
      action.estimatedDuration, action.progress, JSON.stringify(action.progressMessages)
    ]);

    return action;
  }

  async approveAndExecuteAction(actionId: string): Promise<void> {
    // Update status to approved and in_progress
    await this.pool.query(`
      UPDATE character_actions 
      SET status = 'in_progress', start_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [actionId]);

    // Start the action execution
    this.executeAction(actionId);
  }

  private async executeAction(actionId: string): Promise<void> {
    try {
      const result = await this.pool.query('SELECT * FROM character_actions WHERE id = $1', [actionId]);
      const action = result.rows[0];
      
      if (!action) {
        console.error('Action not found:', actionId);
        return;
      }

      console.log(`🎬 Executing action: ${action.title} by ${action.character_name}`);

      // Simulate action execution with progress updates
      const totalSteps = Math.floor(action.estimated_duration / 5); // Update every 5 minutes
      let currentStep = 0;

      const progressInterval = setInterval(async () => {
        currentStep++;
        const progress = Math.min(Math.floor((currentStep / totalSteps) * 100), 100);
        
        // Generate progress message
        const progressMessage = this.generateProgressMessage(action, progress);
        
        // Update progress in database
        await this.updateActionProgress(actionId, progress, progressMessage);
        
        // Send progress message to conversation
        await this.sendProgressMessage(action.conversation_id, action.character_name, progressMessage);
        
        // Complete action when done
        if (progress >= 100) {
          clearInterval(progressInterval);
          this.activeActions.delete(actionId);
          await this.completeAction(actionId);
        }
      }, 5000); // Update every 5 seconds for demo (would be minutes in real game)

      this.activeActions.set(actionId, progressInterval);
      
    } catch (error) {
      console.error('Failed to execute action:', error);
      await this.failAction(actionId, error.message);
    }
  }

  private generateProgressMessage(action: any, progress: number): string {
    const messages = {
      diplomatic: [
        "Initiating diplomatic contact...",
        "Establishing secure communication channels...",
        "Presenting our position to foreign delegates...",
        "Negotiating terms and conditions...",
        "Finalizing diplomatic agreements...",
        "Diplomatic mission completed successfully."
      ],
      military: [
        "Mobilizing fleet assets...",
        "Coordinating with sector commanders...",
        "Deploying forces to target coordinates...",
        "Establishing tactical positions...",
        "Monitoring operational status...",
        "Military operation completed."
      ],
      economic: [
        "Analyzing current economic indicators...",
        "Preparing budget adjustments...",
        "Coordinating with financial institutions...",
        "Implementing policy changes...",
        "Monitoring economic impact...",
        "Economic measures successfully implemented."
      ]
    };

    const typeMessages = messages[action.action_type] || [
      "Initiating action...",
      "Processing requirements...",
      "Coordinating resources...",
      "Implementing changes...",
      "Finalizing procedures...",
      "Action completed successfully."
    ];

    const messageIndex = Math.min(Math.floor(progress / 20), typeMessages.length - 1);
    return typeMessages[messageIndex];
  }

  private async updateActionProgress(actionId: string, progress: number, message: string): Promise<void> {
    const progressEntry = {
      timestamp: new Date(),
      message,
      progress
    };

    await this.pool.query(`
      UPDATE character_actions 
      SET progress = $1, 
          progress_messages = progress_messages || $2::jsonb,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [progress, JSON.stringify(progressEntry), actionId]);
  }

  private async sendProgressMessage(conversationId: string, characterName: string, message: string): Promise<void> {
    try {
      // Send message to WhoseApp conversation
      await fetch('http://localhost:4000/api/whoseapp/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          senderId: 'system',
          senderName: characterName,
          senderType: 'character',
          content: `📋 ${message}`,
          messageType: 'system',
          civilizationId: 'terran_federation'
        })
      });
    } catch (error) {
      console.error('Failed to send progress message:', error);
    }
  }

  private async completeAction(actionId: string): Promise<void> {
    const result = {
      success: true,
      outcome: "Action completed successfully",
      impact: "Positive impact on civilization metrics"
    };

    await this.pool.query(`
      UPDATE character_actions 
      SET status = 'completed', 
          completion_time = CURRENT_TIMESTAMP,
          result = $1,
          actual_duration = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - start_time))/60,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [JSON.stringify(result), actionId]);

    // Send completion message
    const actionResult = await this.pool.query('SELECT * FROM character_actions WHERE id = $1', [actionId]);
    const action = actionResult.rows[0];
    
    if (action) {
      await this.sendProgressMessage(
        action.conversation_id,
        action.character_name,
        `✅ ${action.title} has been completed successfully. ${result.outcome}`
      );
    }
  }

  private async failAction(actionId: string, errorMessage: string): Promise<void> {
    const result = {
      success: false,
      outcome: `Action failed: ${errorMessage}`,
      impact: "No changes made to civilization status"
    };

    await this.pool.query(`
      UPDATE character_actions 
      SET status = 'failed', 
          completion_time = CURRENT_TIMESTAMP,
          result = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [JSON.stringify(result), actionId]);
  }

  async getActionsByConversation(conversationId: string): Promise<CharacterAction[]> {
    const result = await this.pool.query(`
      SELECT * FROM character_actions 
      WHERE conversation_id = $1 
      ORDER BY created_at DESC
    `, [conversationId]);

    return result.rows.map(row => ({
      ...row,
      parameters: row.parameters || {},
      progressMessages: row.progress_messages || [],
      result: row.result || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      startTime: row.start_time,
      completionTime: row.completion_time
    }));
  }

  async getCharacterCapabilities(characterId: string): Promise<ActionCapability | null> {
    const result = await this.pool.query(`
      SELECT * FROM character_capabilities WHERE character_id = $1
    `, [characterId]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      characterId: row.character_id,
      department: row.department,
      capabilities: row.capabilities || []
    };
  }

  async getAllActiveActions(): Promise<CharacterAction[]> {
    const result = await this.pool.query(`
      SELECT * FROM character_actions 
      WHERE status IN ('proposed', 'approved', 'in_progress')
      ORDER BY priority DESC, created_at ASC
    `);

    return result.rows.map(row => ({
      ...row,
      parameters: row.parameters || {},
      progressMessages: row.progress_messages || [],
      result: row.result || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      startTime: row.start_time,
      completionTime: row.completion_time
    }));
  }
}
