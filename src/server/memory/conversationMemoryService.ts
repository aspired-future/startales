/**
 * Conversation Memory Service
 * Integrates PostgreSQL conversation storage with vector memory for character conversations
 */

import { ConversationStorage, Conversation, ConversationMessage } from './conversationStorage';
import { CharacterVectorMemory } from './characterVectorMemory';
import { embeddingService } from './embeddingService';
import { db } from '../storage/db';
import { v4 as uuidv4 } from 'uuid';

export interface CharacterConversation {
  id: string;
  characterId: string;
  characterName: string;
  characterRole: string;
  characterDepartment: string;
  conversationType: 'individual' | 'group' | 'channel';
  participants: string[];
  title?: string;
  startedAt: Date;
  lastMessageAt: Date;
  messageCount: number;
  status: 'active' | 'archived' | 'deleted';
  metadata?: Record<string, any>;
}

export interface CharacterMessage {
  id: string;
  conversationId: string;
  characterId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: Date;
  messageIndex: number;
  messageType: 'text' | 'voice' | 'system';
  entities?: string[];
  actionType?: string;
  gameState?: Record<string, any>;
  vectorId?: string;
  embedding?: number[];
}

export interface ConversationContext {
  characterId: string;
  characterName: string;
  characterRole: string;
  characterDepartment: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  gameContext?: Record<string, any>;
  recentMemories?: Array<{
    content: string;
    relevance: number;
    timestamp: Date;
  }>;
}

export class ConversationMemoryService {
  private conversationStorage: ConversationStorage;
  private characterVectorMemory: CharacterVectorMemory;

  constructor() {
    this.conversationStorage = new ConversationStorage();
    this.characterVectorMemory = new CharacterVectorMemory();
  }

  /**
   * Initialize conversation memory system
   */
  async initialize(): Promise<void> {
    try {
      await this.conversationStorage.initializeTables();
      await this.initializeCharacterConversationTables();
      console.log('✅ Conversation memory service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize conversation memory service:', error);
      throw error;
    }
  }

  /**
   * Initialize character conversation tables
   */
  private async initializeCharacterConversationTables(): Promise<void> {
    try {
      // Create character conversations table
      await db.query(`
        CREATE TABLE IF NOT EXISTS character_conversations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          character_id TEXT NOT NULL,
          character_name TEXT NOT NULL,
          character_role TEXT NOT NULL,
          character_department TEXT NOT NULL,
          conversation_type TEXT NOT NULL DEFAULT 'individual' CHECK (conversation_type IN ('individual', 'group', 'channel')),
          participants TEXT[] NOT NULL DEFAULT '{}',
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

      // Create character messages table
      await db.query(`
        CREATE TABLE IF NOT EXISTS character_messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          conversation_id UUID NOT NULL REFERENCES character_conversations(id) ON DELETE CASCADE,
          character_id TEXT NOT NULL,
          sender_id TEXT NOT NULL,
          sender_name TEXT NOT NULL,
          sender_role TEXT NOT NULL,
          content TEXT NOT NULL,
          timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          message_index INTEGER NOT NULL,
          message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'system')),
          entities TEXT[],
          action_type TEXT,
          game_state JSONB,
          vector_id UUID,
          embedding TEXT, -- Store as TEXT for now, can be converted to VECTOR later when extension is available
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE(conversation_id, message_index)
        )
      `);

      // Create indexes
      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_character_conversations_character 
        ON character_conversations(character_id, status, last_message_at DESC)
      `);

      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_character_conversations_type 
        ON character_conversations(conversation_type, status, last_message_at DESC)
      `);

      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_character_messages_conversation 
        ON character_messages(conversation_id, message_index)
      `);

      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_character_messages_character 
        ON character_messages(character_id, timestamp DESC)
      `);

      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_character_messages_sender 
        ON character_messages(sender_id, timestamp DESC)
      `);

      await db.query(`
        CREATE INDEX IF NOT EXISTS idx_character_messages_vector 
        ON character_messages(vector_id) WHERE vector_id IS NOT NULL
      `);

      // Create trigger to update conversation stats
      await db.query(`
        CREATE OR REPLACE FUNCTION update_character_conversation_stats()
        RETURNS TRIGGER AS $$
        BEGIN
          IF TG_OP = 'INSERT' THEN
            UPDATE character_conversations SET 
              message_count = message_count + 1,
              last_message_at = NEW.timestamp,
              updated_at = NOW()
            WHERE id = NEW.conversation_id;
            RETURN NEW;
          ELSIF TG_OP = 'DELETE' THEN
            UPDATE character_conversations SET 
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
        DROP TRIGGER IF EXISTS trigger_update_character_conversation_stats 
        ON character_messages
      `);

      await db.query(`
        CREATE TRIGGER trigger_update_character_conversation_stats
        AFTER INSERT OR DELETE ON character_messages
        FOR EACH ROW EXECUTE FUNCTION update_character_conversation_stats()
      `);

      console.log('✅ Character conversation tables initialized');
    } catch (error) {
      console.error('❌ Failed to initialize character conversation tables:', error);
      throw error;
    }
  }

  /**
   * Create a new character conversation
   */
  async createCharacterConversation(
    characterId: string,
    characterName: string,
    characterRole: string,
    characterDepartment: string,
    conversationType: 'individual' | 'group' | 'channel' = 'individual',
    participants: string[] = [],
    title?: string
  ): Promise<string> {
    try {
      const conversationId = uuidv4();
      
      await db.query(`
        INSERT INTO character_conversations (
          id, character_id, character_name, character_role, character_department,
          conversation_type, participants, title
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [conversationId, characterId, characterName, characterRole, characterDepartment, 
          conversationType, participants, title]);

      console.log(`💬 Created character conversation: ${conversationId} for ${characterName}`);
      return conversationId;
    } catch (error) {
      console.error('❌ Failed to create character conversation:', error);
      throw error;
    }
  }

  /**
   * Add a message to a character conversation with vector storage
   */
  async addCharacterMessage(message: Omit<CharacterMessage, 'id' | 'timestamp' | 'messageIndex'>): Promise<string> {
    try {
      const messageId = uuidv4();
      
      // Get next message index
      const indexResult = await db.query(`
        SELECT COALESCE(MAX(message_index), -1) + 1 as next_index
        FROM character_messages 
        WHERE conversation_id = $1
      `, [message.conversationId]);
      
      const messageIndex = indexResult.rows[0].next_index;

      // Generate embedding for the message content
      const embedding = await embeddingService.embedSingle(message.content);
      
      // Get conversation details to determine if it's a channel
      const conversationResult = await db.query(`
        SELECT conversation_type, participants
        FROM character_conversations
        WHERE id = $1
      `, [message.conversationId]);
      
      const conversation = conversationResult.rows[0];
      const isChannel = conversation?.conversation_type === 'channel';
      const participants = conversation?.participants || [];
      
      // Store in vector memory for the sender character (with fallback)
      let vectorId = null;
      try {
        vectorId = await this.characterVectorMemory.storeCharacterMemory(
          message.characterId,
          {
            content: message.content,
            messageType: 'conversation',
            timestamp: new Date(),
            metadata: {
              conversationId: message.conversationId,
              messageId: messageId,
              senderId: message.senderId,
              senderRole: message.senderRole,
              messageType: message.messageType,
              entities: message.entities,
              actionType: message.actionType,
              gameState: message.gameState,
              isChannel,
              participants
            }
          }
        );
      } catch (error) {
        console.warn(`⚠️ Failed to store in vector memory for character ${message.characterId}:`, error.message);
        // Continue without vector memory - message will still be stored in PostgreSQL
      }

      // If it's a channel conversation, store the memory for ALL participants
      if (isChannel && participants.length > 0) {
        console.log(`📢 Channel message - storing for ${participants.length} participants`);
        
        for (const participantId of participants) {
          if (participantId !== message.characterId) { // Don't duplicate for sender
            try {
              await this.characterVectorMemory.storeCharacterMemory(
                participantId,
                {
                  content: message.content,
                  messageType: 'channel_conversation',
                  timestamp: new Date(),
                  metadata: {
                    conversationId: message.conversationId,
                    messageId: messageId,
                    senderId: message.senderId,
                    senderName: message.senderName,
                    senderRole: message.senderRole,
                    messageType: message.messageType,
                    entities: message.entities,
                    actionType: message.actionType,
                    gameState: message.gameState,
                    isChannel: true,
                    participants,
                    receivedAs: 'channel_participant'
                  }
                }
              );
              console.log(`🧠 Stored channel memory for participant: ${participantId}`);
            } catch (error) {
              console.warn(`⚠️ Failed to store channel memory for participant ${participantId}:`, error.message);
              // Continue without vector memory for this participant
            }
          }
        }
      }

      // Store in PostgreSQL
      await db.query(`
        INSERT INTO character_messages (
          id, conversation_id, character_id, sender_id, sender_name, sender_role,
          content, message_index, message_type, entities, action_type, game_state,
          vector_id, embedding
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [
        messageId, message.conversationId, message.characterId, message.senderId,
        message.senderName, message.senderRole, message.content, messageIndex,
        message.messageType, message.entities, message.actionType, message.gameState,
        vectorId, embedding
      ]);

      console.log(`💬 Added message ${messageId} to conversation ${message.conversationId}${isChannel ? ' (channel)' : ''}`);
      return messageId;
    } catch (error) {
      console.error('❌ Failed to add character message:', error);
      throw error;
    }
  }

  /**
   * Get conversation context for AI generation
   */
  async getConversationContext(
    characterId: string,
    conversationId: string,
    maxHistory: number = 10
  ): Promise<ConversationContext> {
    try {
      // Get conversation details
      const conversationResult = await db.query(`
        SELECT character_name, character_role, character_department, conversation_type, participants
        FROM character_conversations
        WHERE id = $1
      `, [conversationId]);

      if (conversationResult.rows.length === 0) {
        throw new Error(`Conversation ${conversationId} not found`);
      }

      const conversation = conversationResult.rows[0];
      const isChannel = conversation.conversation_type === 'channel';
      const participants = conversation.participants || [];

      // For channel conversations, verify the character is a participant
      if (isChannel && !participants.includes(characterId)) {
        throw new Error(`Character ${characterId} is not a participant in channel conversation ${conversationId}`);
      }

      // Get recent messages
      const messagesResult = await db.query(`
        SELECT sender_id, sender_name, sender_role, content, timestamp
        FROM character_messages
        WHERE conversation_id = $1
        ORDER BY message_index DESC
        LIMIT $2
      `, [conversationId, maxHistory]);

      const conversationHistory = messagesResult.rows
        .reverse()
        .map(msg => ({
          role: msg.sender_id === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
          content: msg.content,
          timestamp: msg.timestamp
        }));

      // Get relevant memories from vector storage
      const recentMemories = await this.characterVectorMemory.searchCharacterMemories(
        characterId,
        {
          query: conversationHistory.map(msg => msg.content).join(' '),
          limit: 5,
          minRelevance: 0.7
        }
      );

      // For channel conversations, also get memories from other participants
      let channelMemories: any[] = [];
      if (isChannel && participants.length > 1) {
        console.log(`📢 Getting channel memories from ${participants.length} participants`);
        
        for (const participantId of participants) {
          if (participantId !== characterId) {
            try {
              const participantMemories = await this.characterVectorMemory.searchCharacterMemories(
                participantId,
                {
                  query: conversationHistory.map(msg => msg.content).join(' '),
                  limit: 3,
                  minRelevance: 0.6
                }
              );
              
              channelMemories.push(...participantMemories.map(memory => ({
                ...memory,
                source: `channel_participant_${participantId}`
              })));
            } catch (error) {
              console.warn(`⚠️ Failed to get memories for channel participant ${participantId}:`, error.message);
            }
          }
        }
      }

      return {
        characterId,
        characterName: conversation.character_name,
        characterRole: conversation.character_role,
        characterDepartment: conversation.character_department,
        conversationHistory,
        recentMemories: [...recentMemories, ...channelMemories].map(memory => ({
          content: memory.content,
          relevance: memory.relevance,
          timestamp: memory.timestamp,
          source: memory.source || 'self'
        }))
      };
    } catch (error) {
      console.error('❌ Failed to get conversation context:', error);
      throw error;
    }
  }

  /**
   * Search conversations by content
   */
  async searchConversations(
    characterId: string,
    query: string,
    limit: number = 10
  ): Promise<Array<{ conversationId: string; relevance: number; snippet: string }>> {
    try {
      // Search in vector memory
      const memories = await this.characterVectorMemory.searchCharacterMemories(
        characterId,
        { query, limit }
      );

      // Get conversation details for relevant memories
      const conversationIds = [...new Set(memories.map(m => m.metadata?.conversationId).filter(Boolean))];
      
      if (conversationIds.length === 0) {
        return [];
      }

      const conversationsResult = await db.query(`
        SELECT id, title, character_name, last_message_at
        FROM character_conversations
        WHERE id = ANY($1)
      `, [conversationIds]);

      return memories
        .filter(m => m.metadata?.conversationId)
        .map(memory => {
          const conversation = conversationsResult.rows.find(c => c.id === memory.metadata.conversationId);
          return {
            conversationId: memory.metadata.conversationId,
            relevance: memory.relevance,
            snippet: memory.content.substring(0, 100) + '...',
            title: conversation?.title,
            characterName: conversation?.character_name,
            lastMessageAt: conversation?.last_message_at
          };
        })
        .sort((a, b) => b.relevance - a.relevance);
    } catch (error) {
      console.error('❌ Failed to search conversations:', error);
      throw error;
    }
  }

  /**
   * Get recent conversations for a character
   */
  async getRecentConversations(
    characterId: string,
    limit: number = 10
  ): Promise<CharacterConversation[]> {
    try {
      const result = await db.query(`
        SELECT id, character_id, character_name, character_role, character_department,
               conversation_type, participants, title, started_at, last_message_at,
               message_count, status, metadata
        FROM character_conversations
        WHERE character_id = $1 AND status = 'active'
        ORDER BY last_message_at DESC
        LIMIT $2
      `, [characterId, limit]);

      return result.rows.map(row => ({
        id: row.id,
        characterId: row.character_id,
        characterName: row.character_name,
        characterRole: row.character_role,
        characterDepartment: row.character_department,
        conversationType: row.conversation_type,
        participants: row.participants,
        title: row.title,
        startedAt: row.started_at,
        lastMessageAt: row.last_message_at,
        messageCount: row.message_count,
        status: row.status,
        metadata: row.metadata
      }));
    } catch (error) {
      console.error('❌ Failed to get recent conversations:', error);
      throw error;
    }
  }

  /**
   * Get conversation messages
   */
  async getConversationMessages(
    conversationId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<CharacterMessage[]> {
    try {
      const result = await db.query(`
        SELECT id, conversation_id, character_id, sender_id, sender_name, sender_role,
               content, timestamp, message_index, message_type, entities, action_type,
               game_state, vector_id
        FROM character_messages
        WHERE conversation_id = $1
        ORDER BY message_index DESC
        LIMIT $2 OFFSET $3
      `, [conversationId, limit, offset]);

      return result.rows.map(row => ({
        id: row.id,
        conversationId: row.conversation_id,
        characterId: row.character_id,
        senderId: row.sender_id,
        senderName: row.sender_name,
        senderRole: row.sender_role,
        content: row.content,
        timestamp: row.timestamp,
        messageIndex: row.message_index,
        messageType: row.message_type,
        entities: row.entities,
        actionType: row.action_type,
        gameState: row.game_state,
        vectorId: row.vector_id
      }));
    } catch (error) {
      console.error('❌ Failed to get conversation messages:', error);
      throw error;
    }
  }

  /**
   * Get channel conversations for a character
   */
  async getChannelConversations(
    characterId: string,
    limit: number = 10
  ): Promise<CharacterConversation[]> {
    try {
      const result = await db.query(`
        SELECT id, character_id, character_name, character_role, character_department,
               conversation_type, participants, title, started_at, last_message_at,
               message_count, status, metadata
        FROM character_conversations
        WHERE conversation_type = 'channel' 
        AND $1 = ANY(participants)
        AND status = 'active'
        ORDER BY last_message_at DESC
        LIMIT $2
      `, [characterId, limit]);

      return result.rows.map(row => ({
        id: row.id,
        characterId: row.character_id,
        characterName: row.character_name,
        characterRole: row.character_role,
        characterDepartment: row.character_department,
        conversationType: row.conversation_type,
        participants: row.participants,
        title: row.title,
        startedAt: row.started_at,
        lastMessageAt: row.last_message_at,
        messageCount: row.message_count,
        status: row.status,
        metadata: row.metadata
      }));
    } catch (error) {
      console.error('❌ Failed to get channel conversations:', error);
      throw error;
    }
  }

  /**
   * Add character to channel
   */
  async addCharacterToChannel(
    conversationId: string,
    characterId: string,
    characterName: string,
    characterRole: string,
    characterDepartment: string
  ): Promise<void> {
    try {
      // Verify it's a channel conversation
      const conversationResult = await db.query(`
        SELECT conversation_type, participants
        FROM character_conversations
        WHERE id = $1
      `, [conversationId]);

      if (conversationResult.rows.length === 0) {
        throw new Error(`Conversation ${conversationId} not found`);
      }

      const conversation = conversationResult.rows[0];
      if (conversation.conversation_type !== 'channel') {
        throw new Error(`Conversation ${conversationId} is not a channel`);
      }

      // Add character to participants if not already present
      const participants = conversation.participants || [];
      if (!participants.includes(characterId)) {
        await db.query(`
          UPDATE character_conversations
          SET participants = array_append(participants, $2)
          WHERE id = $1
        `, [conversationId, characterId]);

        console.log(`👥 Added ${characterName} to channel ${conversationId}`);
      } else {
        console.log(`👥 ${characterName} is already a participant in channel ${conversationId}`);
      }
    } catch (error) {
      console.error('❌ Failed to add character to channel:', error);
      throw error;
    }
  }

  /**
   * Remove character from channel
   */
  async removeCharacterFromChannel(
    conversationId: string,
    characterId: string
  ): Promise<void> {
    try {
      await db.query(`
        UPDATE character_conversations
        SET participants = array_remove(participants, $2)
        WHERE id = $1 AND conversation_type = 'channel'
      `, [conversationId, characterId]);

      console.log(`👥 Removed character ${characterId} from channel ${conversationId}`);
    } catch (error) {
      console.error('❌ Failed to remove character from channel:', error);
      throw error;
    }
  }

  /**
   * Get all participants in a channel
   */
  async getChannelParticipants(conversationId: string): Promise<string[]> {
    try {
      const result = await db.query(`
        SELECT participants
        FROM character_conversations
        WHERE id = $1 AND conversation_type = 'channel'
      `, [conversationId]);

      if (result.rows.length === 0) {
        throw new Error(`Channel conversation ${conversationId} not found`);
      }

      return result.rows[0].participants || [];
    } catch (error) {
      console.error('❌ Failed to get channel participants:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const conversationMemoryService = new ConversationMemoryService();
