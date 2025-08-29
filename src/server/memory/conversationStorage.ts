import { db } from '../storage/db';
import { v4 as uuidv4 } from 'uuid';

export interface Conversation {
  id: string;
  campaignId: number;
  title?: string;
  startedAt: Date;
  lastMessageAt: Date;
  messageCount: number;
  status: 'active' | 'archived' | 'deleted';
  metadata?: Record<string, any>;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  messageIndex: number;
  entities?: string[];
  actionType?: string;
  gameState?: Record<string, any>;
  vectorId?: string; // Reference to Qdrant vector ID
}

export interface ConversationQuery {
  campaignId?: number;
  status?: 'active' | 'archived' | 'deleted';
  limit?: number;
  offset?: number;
  since?: Date;
  until?: Date;
  search?: string;
}

export interface MessageQuery {
  conversationId?: string;
  campaignId?: number;
  role?: 'user' | 'assistant' | 'system';
  entities?: string[];
  actionType?: string;
  limit?: number;
  offset?: number;
  since?: Date;
  until?: Date;
}

/**
 * Conversation Storage Service for Vector Memory system
 * Handles conversation and message persistence in PostgreSQL
 */
export class ConversationStorage {
  
  /**
   * Initialize conversation storage tables
   */
  async initializeTables(): Promise<void> {
    try {
      // Create conversations table
      await db.query(`
        CREATE TABLE IF NOT EXISTS conversations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          campaign_id INTEGER NOT NULL,
          title TEXT,
          started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          message_count INTEGER NOT NULL DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
          metadata JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      // Create conversation_messages table
      await db.query(`
        CREATE TABLE IF NOT EXISTS conversation_messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
          role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
          content TEXT NOT NULL,
          timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          message_index INTEGER NOT NULL,
          entities TEXT[],
          action_type TEXT,
          game_state JSONB,
          vector_id UUID,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE(conversation_id, message_index)
        )
      `);

      // Create indexes for performance
      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_conversations_campaign_status 
        ON conversations(campaign_id, status, last_message_at DESC)
      `);

      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_conversations_last_message 
        ON conversations(last_message_at DESC)
      `);

      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_messages_conversation_index 
        ON conversation_messages(conversation_id, message_index)
      `);

      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_messages_role_timestamp 
        ON conversation_messages(role, timestamp DESC)
      `);

      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_messages_entities 
        ON conversation_messages USING GIN(entities)
      `);

      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_messages_action_type 
        ON conversation_messages(action_type, timestamp DESC)
      `);

      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_messages_vector_id 
        ON conversation_messages(vector_id) WHERE vector_id IS NOT NULL
      `);

      // Create trigger to update conversation stats
      await db.query(`
        CREATE OR REPLACE FUNCTION update_conversation_stats()
        RETURNS TRIGGER AS $$
        BEGIN
          IF TG_OP = 'INSERT' THEN
            UPDATE conversations SET 
              message_count = message_count + 1,
              last_message_at = NEW.timestamp,
              updated_at = NOW()
            WHERE id = NEW.conversation_id;
            RETURN NEW;
          ELSIF TG_OP = 'DELETE' THEN
            UPDATE conversations SET 
              message_count = message_count - 1,
              updated_at = NOW()
            WHERE id = OLD.conversation_id;
            RETURN OLD;
          END IF;
          RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
      `);

      await db.query(`
        DROP TRIGGER IF EXISTS trigger_update_conversation_stats 
        ON conversation_messages
      `);

      await db.query(`
        CREATE TRIGGER trigger_update_conversation_stats
        AFTER INSERT OR DELETE ON conversation_messages
        FOR EACH ROW EXECUTE FUNCTION update_conversation_stats()
      `);

      console.log('✅ Conversation storage tables initialized');
    } catch (error) {
      console.error('❌ Failed to initialize conversation storage tables:', error);
      throw error;
    }
  }

  /**
   * Create a new conversation
   */
  async createConversation(campaignId: number, title?: string): Promise<string> {
    try {
      const conversationId = uuidv4();
      
      await db.query(`
        INSERT INTO conversations (id, campaign_id, title)
        VALUES ($1, $2, $3)
      `, [conversationId, campaignId, title]);

      console.log(`💬 Created conversation: ${conversationId} for campaign ${campaignId}`);
      return conversationId;
    } catch (error) {
      console.error('❌ Failed to create conversation:', error);
      throw error;
    }
  }

  /**
   * Add a message to a conversation
   */
  async addMessage(message: Omit<ConversationMessage, 'id' | 'timestamp' | 'messageIndex'>): Promise<string> {
    try {
      const messageId = uuidv4();
      
      // Get next message index
      const indexResult = await db.query(`
        SELECT COALESCE(MAX(message_index), -1) + 1 as next_index
        FROM conversation_messages WHERE conversation_id = $1
      `, [message.conversationId]);
      
      const messageIndex = indexResult.rows[0].next_index;

      await db.query(`
        INSERT INTO conversation_messages (
          id, conversation_id, role, content, message_index,
          entities, action_type, game_state, vector_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        messageId,
        message.conversationId,
        message.role,
        message.content,
        messageIndex,
        message.entities || null,
        message.actionType || null,
        message.gameState ? JSON.stringify(message.gameState) : null,
        message.vectorId || null
      ]);

      console.log(`📝 Added message ${messageIndex} to conversation ${message.conversationId}`);
      return messageId;
    } catch (error) {
      console.error('❌ Failed to add message:', error);
      throw error;
    }
  }

  /**
   * Update message with vector ID after embedding
   */
  async updateMessageVectorId(messageId: string, vectorId: string): Promise<void> {
    try {
      await db.query(`
        UPDATE conversation_messages 
        SET vector_id = $1
        WHERE id = $2
      `, [vectorId, messageId]);

      console.log(`🔗 Linked message ${messageId} to vector ${vectorId}`);
    } catch (error) {
      console.error('❌ Failed to update message vector ID:', error);
      throw error;
    }
  }

  /**
   * Get conversations with optional filtering
   */
  async getConversations(query: ConversationQuery = {}): Promise<Conversation[]> {
    try {
      let sql = `
        SELECT id, campaign_id, title, started_at, last_message_at, 
               message_count, status, metadata
        FROM conversations
        WHERE 1=1
      `;
      
      const params: any[] = [];
      let paramIndex = 1;

      if (query.campaignId !== undefined) {
        sql += ` AND campaign_id = $${paramIndex++}`;
        params.push(query.campaignId);
      }

      if (query.status) {
        sql += ` AND status = $${paramIndex++}`;
        params.push(query.status);
      }

      if (query.since) {
        sql += ` AND last_message_at >= $${paramIndex++}`;
        params.push(query.since);
      }

      if (query.until) {
        sql += ` AND last_message_at <= $${paramIndex++}`;
        params.push(query.until);
      }

      if (query.search) {
        const searchParam = `%${query.search}%`;
        sql += ` AND title ILIKE $${paramIndex++}`;
        params.push(searchParam);
      }

      sql += ` ORDER BY last_message_at DESC`;

      if (query.limit) {
        sql += ` LIMIT $${paramIndex++}`;
        params.push(query.limit);
      }

      if (query.offset) {
        sql += ` OFFSET $${paramIndex++}`;
        params.push(query.offset);
      }

      const result = await db.query(sql, params);

      return result.rows.map(row => ({
        id: row.id,
        campaignId: row.campaign_id,
        title: row.title,
        startedAt: new Date(row.started_at),
        lastMessageAt: new Date(row.last_message_at),
        messageCount: row.message_count,
        status: row.status,
        metadata: row.metadata
      }));
    } catch (error) {
      console.error('❌ Failed to get conversations:', error);
      throw error;
    }
  }

  /**
   * Get messages with optional filtering
   */
  async getMessages(query: MessageQuery = {}): Promise<ConversationMessage[]> {
    try {
      let sql = `
        SELECT m.id, m.conversation_id, m.role, m.content, m.timestamp,
               m.message_index, m.entities, m.action_type, m.game_state, m.vector_id
        FROM conversation_messages m
      `;
      
      const params: any[] = [];
      let paramIndex = 1;
      const conditions: string[] = [];

      if (query.conversationId) {
        conditions.push(`m.conversation_id = $${paramIndex++}`);
        params.push(query.conversationId);
      }

      if (query.campaignId !== undefined) {
        sql += ` JOIN conversations c ON m.conversation_id = c.id`;
        conditions.push(`c.campaign_id = $${paramIndex++}`);
        params.push(query.campaignId);
      }

      if (query.role) {
        conditions.push(`m.role = $${paramIndex++}`);
        params.push(query.role);
      }

      if (query.entities && query.entities.length > 0) {
        conditions.push(`m.entities && $${paramIndex++}`);
        params.push(query.entities);
      }

      if (query.actionType) {
        conditions.push(`m.action_type = $${paramIndex++}`);
        params.push(query.actionType);
      }

      if (query.since) {
        conditions.push(`m.timestamp >= $${paramIndex++}`);
        params.push(query.since);
      }

      if (query.until) {
        conditions.push(`m.timestamp <= $${paramIndex++}`);
        params.push(query.until);
      }

      if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(' AND ')}`;
      }

      sql += ` ORDER BY m.timestamp DESC`;

      if (query.limit) {
        sql += ` LIMIT $${paramIndex++}`;
        params.push(query.limit);
      }

      if (query.offset) {
        sql += ` OFFSET $${paramIndex++}`;
        params.push(query.offset);
      }

      const result = await db.query(sql, params);

      return result.rows.map(row => ({
        id: row.id,
        conversationId: row.conversation_id,
        role: row.role,
        content: row.content,
        timestamp: new Date(row.timestamp),
        messageIndex: row.message_index,
        entities: row.entities || [],
        actionType: row.action_type,
        gameState: row.game_state,
        vectorId: row.vector_id
      }));
    } catch (error) {
      console.error('❌ Failed to get messages:', error);
      throw error;
    }
  }

  /**
   * Get a conversation by ID
   */
  async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      const result = await db.query(`
        SELECT id, campaign_id, title, started_at, last_message_at,
               message_count, status, metadata
        FROM conversations WHERE id = $1
      `, [conversationId]);

      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return {
        id: row.id,
        campaignId: row.campaign_id,
        title: row.title,
        startedAt: new Date(row.started_at),
        lastMessageAt: new Date(row.last_message_at),
        messageCount: row.message_count,
        status: row.status,
        metadata: row.metadata
      };
    } catch (error) {
      console.error('❌ Failed to get conversation:', error);
      throw error;
    }
  }

  /**
   * Archive a conversation
   */
  async archiveConversation(conversationId: string): Promise<void> {
    try {
      await db.query(`
        UPDATE conversations 
        SET status = 'archived', updated_at = NOW()
        WHERE id = $1
      `, [conversationId]);

      console.log(`📁 Archived conversation: ${conversationId}`);
    } catch (error) {
      console.error('❌ Failed to archive conversation:', error);
      throw error;
    }
  }

  /**
   * Delete a conversation and all its messages
   */
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await db.query(`
        UPDATE conversations 
        SET status = 'deleted', updated_at = NOW()
        WHERE id = $1
      `, [conversationId]);

      console.log(`🗑️ Deleted conversation: ${conversationId}`);
    } catch (error) {
      console.error('❌ Failed to delete conversation:', error);
      throw error;
    }
  }

  /**
   * Get conversation statistics
   */
  async getStats(campaignId?: number): Promise<{
    totalConversations: number;
    totalMessages: number;
    activeConversations: number;
    avgMessagesPerConversation: number;
    latestConversation?: Date;
  }> {
    try {
      let whereClause = '';
      const params: any[] = [];
      
      if (campaignId !== undefined) {
        whereClause = 'WHERE campaign_id = $1';
        params.push(campaignId);
      }

      const result = await db.query(`
        SELECT 
          COUNT(*) as total_conversations,
          SUM(message_count) as total_messages,
          COUNT(*) FILTER (WHERE status = 'active') as active_conversations,
          AVG(message_count) as avg_messages,
          MAX(last_message_at) as latest_conversation
        FROM conversations
        ${whereClause}
      `, params);

      const row = result.rows[0];
      
      return {
        totalConversations: parseInt(row.total_conversations) || 0,
        totalMessages: parseInt(row.total_messages) || 0,
        activeConversations: parseInt(row.active_conversations) || 0,
        avgMessagesPerConversation: parseFloat(row.avg_messages) || 0,
        latestConversation: row.latest_conversation ? new Date(row.latest_conversation) : undefined
      };
    } catch (error) {
      console.error('❌ Failed to get conversation stats:', error);
      throw error;
    }
  }

  /**
   * Health check for conversation storage
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    database: boolean;
    tablesExist: boolean;
    stats?: ReturnType<ConversationStorage['getStats']>;
  }> {
    try {
      // Test database connection
      await db.query('SELECT 1');
      
      // Check if tables exist
      const tablesResult = await db.query(`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('conversations', 'conversation_messages')
      `);
      
      const tablesExist = tablesResult.rows.length === 2;
      let stats = undefined;
      
      if (tablesExist) {
        try {
          stats = await this.getStats();
        } catch {
          // Stats collection failed, but tables exist
        }
      }

      const status: 'healthy' | 'degraded' | 'unhealthy' = 
        tablesExist && stats ? 'healthy' : 
        tablesExist ? 'degraded' : 
        'unhealthy';

      return {
        status,
        database: true,
        tablesExist,
        stats
      };
    } catch (error) {
      console.error('❌ Conversation storage health check failed:', error);
      return {
        status: 'unhealthy',
        database: false,
        tablesExist: false
      };
    }
  }
}

// Export singleton instance
export const conversationStorage = new ConversationStorage();
