/**
 * Enhanced Conversation Storage Service
 * Handles database operations for conversations with privacy-aware classification
 */

import { Pool } from 'pg';
import { getPool } from '../storage/db.js';
import {
  Conversation,
  ConversationMessage,
  ConversationType,
  SenderType,
  CreateConversationData,
  CreateMessageData,
  PrivacyRule
} from './types.js';

export class EnhancedConversationStorage {
  private pool: Pool;
  private privacyRules: Map<ConversationType, PrivacyRule>;

  constructor() {
    this.pool = getPool();
    this.initializePrivacyRules();
  }

  /**
   * Initialize privacy rules for different conversation types
   */
  private initializePrivacyRules(): void {
    this.privacyRules = new Map([
      ['character-player', {
        conversationType: 'character-player',
        isStorable: true,
        requiresConsent: false,
        retentionPeriod: 365, // 1 year
        description: 'Character-player conversations are stored for character memory enhancement'
      }],
      ['player-player', {
        conversationType: 'player-player',
        isStorable: false,
        requiresConsent: true,
        description: 'Player-to-player conversations are private and not stored'
      }],
      ['alliance', {
        conversationType: 'alliance',
        isStorable: false,
        requiresConsent: true,
        description: 'Alliance communications remain private between alliance members'
      }],
      ['party', {
        conversationType: 'party',
        isStorable: false,
        requiresConsent: true,
        description: 'Party communications remain private between party members'
      }],
      ['system', {
        conversationType: 'system',
        isStorable: true,
        requiresConsent: false,
        retentionPeriod: 90, // 3 months
        description: 'System messages are stored for debugging and analytics'
      }]
    ]);
  }

  /**
   * Create a new conversation
   */
  async createConversation(data: CreateConversationData): Promise<string> {
    const query = `
      INSERT INTO conversations (
        id, campaign_id, participant_ids, conversation_type, 
        is_private, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const values = [
      data.id,
      data.campaignId,
      data.participantIds,
      data.conversationType,
      data.isPrivate ?? true,
      data.metadata ? JSON.stringify(data.metadata) : null
    ];

    try {
      const result = await this.pool.query(query, values);
      return result.rows[0].id;
    } catch (error) {
      console.error('❌ Failed to create conversation:', error);
      throw error;
    }
  }

  /**
   * Add a message to a conversation with privacy checking
   */
  async addMessage(data: CreateMessageData): Promise<string> {
    // Get conversation to check privacy rules
    const conversation = await this.getConversation(data.conversationId);
    if (!conversation) {
      throw new Error(`Conversation ${data.conversationId} not found`);
    }

    const privacyRule = this.privacyRules.get(conversation.conversationType);
    const shouldStore = privacyRule?.isStorable ?? false;

    const query = `
      INSERT INTO conversation_messages (
        id, conversation_id, sender_id, sender_type, content, 
        timestamp, message_index, entities, action_type, 
        game_state, is_stored_in_memory, campaign_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `;

    const values = [
      data.id,
      data.conversationId,
      data.senderId,
      data.senderType,
      data.content,
      data.timestamp || new Date(),
      data.messageIndex,
      data.entities,
      data.actionType,
      data.gameState ? JSON.stringify(data.gameState) : null,
      shouldStore,
      data.campaignId
    ];

    try {
      const result = await this.pool.query(query, values);
      
      // Update conversation timestamp
      await this.pool.query(
        'UPDATE conversations SET updated_at = NOW() WHERE id = $1',
        [data.conversationId]
      );

      return result.rows[0].id;
    } catch (error) {
      console.error('❌ Failed to add message:', error);
      throw error;
    }
  }

  /**
   * Get conversation by ID
   */
  async getConversation(conversationId: string): Promise<Conversation | null> {
    const query = `
      SELECT * FROM conversations WHERE id = $1
    `;

    try {
      const result = await this.pool.query(query, [conversationId]);
      if (result.rows.length === 0) return null;
      
      return this.mapRowToConversation(result.rows[0]);
    } catch (error) {
      console.error('❌ Failed to get conversation:', error);
      throw error;
    }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(
    conversationId: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<ConversationMessage[]> {
    const query = `
      SELECT * FROM conversation_messages 
      WHERE conversation_id = $1 
      ORDER BY message_index ASC 
      LIMIT $2 OFFSET $3
    `;

    try {
      const result = await this.pool.query(query, [conversationId, limit, offset]);
      return result.rows.map(this.mapRowToMessage);
    } catch (error) {
      console.error('❌ Failed to get messages:', error);
      throw error;
    }
  }

  /**
   * Get storable messages for character memory (only character-player conversations)
   */
  async getStorableMessagesByCharacter(
    characterId: string, 
    limit: number = 100
  ): Promise<ConversationMessage[]> {
    const query = `
      SELECT cm.* FROM conversation_messages cm
      JOIN conversations c ON cm.conversation_id = c.id
      WHERE (cm.sender_id = $1 OR $1 = ANY(c.participant_ids))
        AND cm.is_stored_in_memory = true
        AND c.conversation_type = 'character-player'
      ORDER BY cm.timestamp DESC
      LIMIT $2
    `;

    try {
      const result = await this.pool.query(query, [characterId, limit]);
      return result.rows.map(this.mapRowToMessage);
    } catch (error) {
      console.error('❌ Failed to get storable messages:', error);
      throw error;
    }
  }

  /**
   * Get conversations by participant
   */
  async getConversationsByParticipant(
    participantId: string, 
    conversationType?: ConversationType,
    limit: number = 50
  ): Promise<Conversation[]> {
    let query = `
      SELECT * FROM conversations 
      WHERE $1 = ANY(participant_ids)
    `;
    const values: any[] = [participantId];

    if (conversationType) {
      query += ` AND conversation_type = $2`;
      values.push(conversationType);
    }

    query += ` ORDER BY updated_at DESC LIMIT $${values.length + 1}`;
    values.push(limit);

    try {
      const result = await this.pool.query(query, values);
      return result.rows.map(this.mapRowToConversation);
    } catch (error) {
      console.error('❌ Failed to get conversations by participant:', error);
      throw error;
    }
  }

  /**
   * Update message vector ID after vectorization
   */
  async updateMessageVectorId(messageId: string, vectorId: string): Promise<void> {
    const query = `
      UPDATE conversation_messages 
      SET vector_id = $1 
      WHERE id = $2
    `;

    try {
      await this.pool.query(query, [vectorId, messageId]);
    } catch (error) {
      console.error('❌ Failed to update message vector ID:', error);
      throw error;
    }
  }

  /**
   * Get privacy rule for conversation type
   */
  getPrivacyRule(conversationType: ConversationType): PrivacyRule | undefined {
    return this.privacyRules.get(conversationType);
  }

  /**
   * Get all privacy rules
   */
  getAllPrivacyRules(): PrivacyRule[] {
    return Array.from(this.privacyRules.values());
  }

  /**
   * Check if a conversation type allows storage
   */
  isConversationStorable(conversationType: ConversationType): boolean {
    const rule = this.privacyRules.get(conversationType);
    return rule?.isStorable ?? false;
  }

  /**
   * Get conversation statistics
   */
  async getConversationStats(): Promise<{
    totalConversations: number;
    totalMessages: number;
    storableMessages: number;
    conversationsByType: Record<ConversationType, number>;
    messagesByType: Record<ConversationType, number>;
  }> {
    try {
      const [conversationsResult, messagesResult, storableResult, typeStatsResult, messageTypeStatsResult] = await Promise.all([
        this.pool.query('SELECT COUNT(*) as count FROM conversations'),
        this.pool.query('SELECT COUNT(*) as count FROM conversation_messages'),
        this.pool.query('SELECT COUNT(*) as count FROM conversation_messages WHERE is_stored_in_memory = true'),
        this.pool.query(`
          SELECT conversation_type, COUNT(*) as count 
          FROM conversations 
          GROUP BY conversation_type
        `),
        this.pool.query(`
          SELECT c.conversation_type, COUNT(cm.*) as count 
          FROM conversations c
          JOIN conversation_messages cm ON c.id = cm.conversation_id
          GROUP BY c.conversation_type
        `)
      ]);

      const conversationsByType: Record<string, number> = {};
      typeStatsResult.rows.forEach(row => {
        conversationsByType[row.conversation_type] = parseInt(row.count);
      });

      const messagesByType: Record<string, number> = {};
      messageTypeStatsResult.rows.forEach(row => {
        messagesByType[row.conversation_type] = parseInt(row.count);
      });

      return {
        totalConversations: parseInt(conversationsResult.rows[0].count),
        totalMessages: parseInt(messagesResult.rows[0].count),
        storableMessages: parseInt(storableResult.rows[0].count),
        conversationsByType: conversationsByType as Record<ConversationType, number>,
        messagesByType: messagesByType as Record<ConversationType, number>
      };
    } catch (error) {
      console.error('❌ Failed to get conversation stats:', error);
      throw error;
    }
  }

  /**
   * Clean up old messages based on retention policies
   */
  async cleanupOldMessages(): Promise<{
    deletedMessages: number;
    deletedConversations: number;
  }> {
    let deletedMessages = 0;
    let deletedConversations = 0;

    try {
      for (const [conversationType, rule] of this.privacyRules.entries()) {
        if (rule.retentionPeriod) {
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - rule.retentionPeriod);

          // Delete old messages
          const deleteMessagesResult = await this.pool.query(`
            DELETE FROM conversation_messages 
            WHERE conversation_id IN (
              SELECT id FROM conversations 
              WHERE conversation_type = $1 AND updated_at < $2
            )
          `, [conversationType, cutoffDate]);

          // Delete old conversations
          const deleteConversationsResult = await this.pool.query(`
            DELETE FROM conversations 
            WHERE conversation_type = $1 AND updated_at < $2
          `, [conversationType, cutoffDate]);

          deletedMessages += deleteMessagesResult.rowCount || 0;
          deletedConversations += deleteConversationsResult.rowCount || 0;
        }
      }

      return { deletedMessages, deletedConversations };
    } catch (error) {
      console.error('❌ Failed to cleanup old messages:', error);
      throw error;
    }
  }

  /**
   * Map database row to Conversation object
   */
  private mapRowToConversation(row: any): Conversation {
    return {
      id: row.id,
      campaignId: row.campaign_id,
      participantIds: row.participant_ids,
      conversationType: row.conversation_type,
      isPrivate: row.is_private,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  /**
   * Map database row to ConversationMessage object
   */
  private mapRowToMessage(row: any): ConversationMessage {
    return {
      id: row.id,
      conversationId: row.conversation_id,
      senderId: row.sender_id,
      senderType: row.sender_type,
      content: row.content,
      timestamp: row.timestamp,
      messageIndex: row.message_index,
      entities: row.entities,
      actionType: row.action_type,
      gameState: row.game_state ? JSON.parse(row.game_state) : undefined,
      vectorId: row.vector_id,
      isStoredInMemory: row.is_stored_in_memory,
      campaignId: row.campaign_id,
      createdAt: row.created_at
    };
  }
}

// Export singleton instance
export const enhancedConversationStorage = new EnhancedConversationStorage();
