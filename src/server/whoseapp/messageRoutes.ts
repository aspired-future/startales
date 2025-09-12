/**
 * WhoseApp Message Routes
 * 
 * API endpoints for managing conversations, messages, channels,
 * and real-time communication in WhoseApp
 */

import express from 'express';
import { Pool } from 'pg';
import { getAIService } from '../ai/AIService';

const router = express.Router();
let pool: Pool;

// Message interface
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'character' | 'system';
  content: string;
  messageType: 'text' | 'voice' | 'system' | 'action';
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  replyToId?: string;
  metadata: any;
}

// Conversation interface
interface Conversation {
  id: string;
  title?: string;
  conversationType: 'direct' | 'group' | 'channel';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
  isPinned: boolean;
  metadata: any;
  participants?: ConversationParticipant[];
  lastMessage?: string;
  unreadCount?: number;
}

interface ConversationParticipant {
  participantId: string;
  participantType: 'user' | 'character' | 'system';
  participantName: string;
  joinedAt: Date;
  isActive: boolean;
  role: 'admin' | 'moderator' | 'member';
  unreadCount: number;
  lastReadAt: Date;
}

/**
 * Get conversations for a user
 */
router.get('/conversations', async (req, res) => {
  try {
    const { userId = 'current-user-id', limit = 50, offset = 0 } = req.query;

    const query = `
      SELECT 
        c.*,
        cp.unread_count,
        cp.last_read_at,
        (
          SELECT content 
          FROM whoseapp_messages m 
          WHERE m.conversation_id = c.id 
          ORDER BY m.timestamp DESC 
          LIMIT 1
        ) as last_message,
        (
          SELECT COUNT(*) 
          FROM whoseapp_participants cp2 
          WHERE cp2.conversation_id = c.id 
            AND cp2.is_active = true
        ) as participant_count
      FROM whoseapp_conversations c
      LEFT JOIN whoseapp_participants cp ON c.id = cp.conversation_id AND cp.participant_id = $1
      WHERE cp.participant_id = $1 AND cp.is_active = true
      ORDER BY c.last_message_time DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [userId, limit, offset]);
    
    // Get participants for each conversation
    const conversations = await Promise.all(
      result.rows.map(async (row) => {
        const participantsQuery = `
          SELECT participant_id, participant_type, participant_name, joined_at, 
                 is_active, role, unread_count, last_read_at
          FROM whoseapp_participants
          WHERE conversation_id = $1 AND is_active = true
          ORDER BY joined_at ASC
        `;
        
        const participantsResult = await pool.query(participantsQuery, [row.id]);
        
        return {
          id: row.id,
          title: row.title,
          conversationType: row.conversation_type,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          createdBy: row.created_by,
          isActive: row.is_active,
          isPinned: row.is_pinned,
          metadata: row.metadata,
          participants: participantsResult.rows,
          lastMessage: row.last_message,
          unreadCount: row.unread_count || 0,
          participantCount: parseInt(row.participant_count) || 0
        };
      })
    );

    res.json({
      success: true,
      data: conversations,
      total: conversations.length
    });
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get conversations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Create a new conversation
 */
router.post('/conversations', async (req, res) => {
  try {
    const {
      title,
      conversationType = 'direct',
      participants = [],
      createdBy,
      civilizationId = 'default-civ',
      metadata = {}
    } = req.body;

    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Start transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Create conversation
      const conversationQuery = `
        INSERT INTO whoseapp_conversations (id, title, conversation_type, created_by, civilization_id, participants, metadata)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const conversationResult = await client.query(conversationQuery, [
        conversationId, title, conversationType, createdBy, civilizationId, participants, JSON.stringify(metadata)
      ]);

      // Add participants
      for (const participant of participants) {
        const participantQuery = `
          INSERT INTO whoseapp_participants 
          (conversation_id, participant_id, participant_type, participant_name, role)
          VALUES ($1, $2, $3, $4, $5)
        `;
        
        // Handle both string and object formats for participants
        const participantId = typeof participant === 'string' ? participant : participant.id;
        const participantType = typeof participant === 'string' ? 'character' : (participant.type || 'character');
        const participantName = typeof participant === 'string' ? participant : (participant.name || participant.id);
        const participantRole = typeof participant === 'string' ? 'member' : (participant.role || 'member');
        
        await client.query(participantQuery, [
          conversationId,
          participantId,
          participantType,
          participantName,
          participantRole
        ]);
      }

      await client.query('COMMIT');

      const conversation = conversationResult.rows[0];
      res.json({
        success: true,
        data: {
          ...conversation,
          participants
        }
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create conversation',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get messages for a conversation
 */
router.get('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, offset = 0, before } = req.query;

    let query = `
      SELECT id, conversation_id, sender_id, content, message_type, timestamp, is_read, reply_to, metadata
      FROM whoseapp_messages
      WHERE conversation_id = $1
    `;
    
    const params = [conversationId];
    let paramIndex = 2;

    if (before) {
      query += ` AND timestamp < $${paramIndex}`;
      params.push(before);
      paramIndex++;
    }

    query += ` ORDER BY timestamp DESC LIMIT $${paramIndex}`;
    params.push(limit);
    paramIndex++;

    if (offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(offset);
    }

    const result = await pool.query(query, params);
    
    // Reverse to get chronological order
    const messages = result.rows.reverse();

    res.json({
      success: true,
      data: messages,
      total: messages.length
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Send a new message
 */
router.post('/messages', async (req, res) => {
  try {
    const {
      conversationId,
      senderId,
      senderName,
      senderType = 'user',
      content,
      messageType = 'text',
      replyToId,
      metadata = {},
      civilizationId
    } = req.body;

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Insert message
    const messageQuery = `
      INSERT INTO whoseapp_messages 
      (id, conversation_id, sender_id, content, message_type, reply_to, metadata, civilization_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const messageResult = await pool.query(messageQuery, [
      messageId, conversationId, senderId, content, messageType, replyToId, JSON.stringify(metadata), civilizationId
    ]);

    const message = messageResult.rows[0];

    // If this is a user message, generate AI response
    if (senderType === 'user' || senderType === 'player') {
      // Get conversation participants to determine who should respond
      const participantsQuery = `
        SELECT participant_id, participant_name, participant_type
        FROM whoseapp_participants
        WHERE conversation_id = $1 AND is_active = true AND participant_type = 'character'
      `;
      
      const participantsResult = await pool.query(participantsQuery, [conversationId]);
      
      // For now, have the first character respond (in the future, implement multi-character logic)
      if (participantsResult.rows.length > 0) {
        const respondingCharacter = participantsResult.rows[0];
        
        try {
          // Generate AI response
          const aiResponse = await generateAIResponse(
            content,
            conversationId,
            respondingCharacter,
            civilizationId,
            messageId
          );

          if (aiResponse) {
            // Insert AI response message
            const aiMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const aiMessageQuery = `
              INSERT INTO whoseapp_messages 
              (id, conversation_id, sender_id, content, message_type, reply_to, metadata, civilization_id)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
              RETURNING *
            `;

            const aiMessageResult = await pool.query(aiMessageQuery, [
              aiMessageId, conversationId, respondingCharacter.participant_id, 
              aiResponse.content, 'text', messageId, JSON.stringify(aiResponse.metadata || {}), civilizationId
            ]);

            // Return both messages
            res.json({
              success: true,
              data: {
                userMessage: message,
                aiResponse: aiMessageResult.rows[0]
              }
            });
            return;
          }
        } catch (aiError) {
          console.error('AI response generation failed:', aiError);
          // Continue with just the user message
        }
      }
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Mark conversation as read
 */
router.post('/conversations/:conversationId/mark-read', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId = 'current-user-id' } = req.body;

    const query = `
      UPDATE whoseapp_participants
      SET unread_count = 0, last_read_at = CURRENT_TIMESTAMP
      WHERE conversation_id = $1 AND participant_id = $2
    `;

    await pool.query(query, [conversationId, userId]);

    res.json({
      success: true,
      message: 'Conversation marked as read'
    });
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark conversation as read',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get channels
 */
router.get('/channels', async (req, res) => {
  try {
    const { userId = 'current-user-id', type, confidentialityLevel } = req.query;

    let query = `
      SELECT 
        c.*,
        ch.name, ch.description, ch.channel_type, ch.confidentiality_level,
        ch.department_id, ch.project_id, ch.mission_id,
        cp.unread_count,
        (
          SELECT content 
          FROM whoseapp_messages m 
          WHERE m.conversation_id = c.id 
            AND m.is_deleted = false 
          ORDER BY m.timestamp DESC 
          LIMIT 1
        ) as last_message,
        (
          SELECT COUNT(*) 
          FROM whoseapp_participants cp2 
          WHERE cp2.conversation_id = c.id 
            AND cp2.is_active = true
        ) as participant_count
      FROM whoseapp_conversations c
      JOIN channels ch ON c.id = ch.id
      LEFT JOIN conversation_participants cp ON c.id = cp.conversation_id AND cp.participant_id = $1
      WHERE cp.participant_id = $1 AND cp.is_active = true
    `;

    const params = [userId];
    let paramIndex = 2;

    if (type) {
      query += ` AND ch.channel_type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (confidentialityLevel) {
      query += ` AND ch.confidentiality_level = $${paramIndex}`;
      params.push(confidentialityLevel);
      paramIndex++;
    }

    query += ` ORDER BY c.updated_at DESC`;

    const result = await pool.query(query, params);

    // Get participants for each channel
    const channels = await Promise.all(
      result.rows.map(async (row) => {
        const participantsQuery = `
          SELECT participant_id, participant_type, participant_name, joined_at, 
                 is_active, role, unread_count, last_read_at
          FROM whoseapp_participants
          WHERE conversation_id = $1 AND is_active = true
          ORDER BY joined_at ASC
        `;
        
        const participantsResult = await pool.query(participantsQuery, [row.id]);
        
        return {
          id: row.id,
          name: row.name,
          description: row.description,
          type: row.channel_type,
          confidentialityLevel: row.confidentiality_level,
          departmentId: row.department_id,
          projectId: row.project_id,
          missionId: row.mission_id,
          participantCount: parseInt(row.participant_count) || 0,
          participants: participantsResult.rows.map(p => p.participant_id),
          participantNames: participantsResult.rows.map(p => p.participant_name),
          lastMessage: row.last_message,
          lastMessageTime: row.updated_at,
          unreadCount: row.unread_count || 0,
          isActive: row.is_active,
          isPinned: row.is_pinned,
          createdAt: row.created_at,
          createdBy: row.created_by,
          metadata: row.metadata
        };
      })
    );

    res.json({
      success: true,
      data: channels,
      total: channels.length
    });
  } catch (error) {
    console.error('Error getting channels:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get channels',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Generate AI response for a message
 */
async function generateAIResponse(
  userMessage: string,
  conversationId: string,
  character: any,
  civilizationId: string,
  replyToMessageId: string
): Promise<{ content: string; metadata: any } | null> {
  try {
    const aiService = getAIService();
    
    // Get recent conversation history for context
    const historyQuery = `
      SELECT sender_id, content, timestamp
      FROM whoseapp_messages
      WHERE conversation_id = $1
      ORDER BY timestamp DESC
      LIMIT 10
    `;
    
    const historyResult = await pool.query(historyQuery, [conversationId]);
    const messageHistory = historyResult.rows.reverse(); // Chronological order

    // Build context for AI
    const context = {
      character: {
        name: character.participant_name,
        id: character.participant_id
      },
      conversation: {
        id: conversationId,
        history: messageHistory
      },
      civilization: {
        id: civilizationId
      },
      userMessage,
      replyToMessageId
    };

    // Generate AI response
    const prompt = `You are ${character.participant_name}, responding in a conversation.

Recent conversation history:
${messageHistory.map(msg => `${msg.sender_name}: ${msg.content}`).join('\n')}

User just said: "${userMessage}"

Respond as ${character.participant_name} in character. Keep it conversational and contextual. Provide a concise, informative response. Use 1-2 sentences to give key information. Be conversational and direct while remaining clear and engaging.`;

    const response = await aiService.generateText(prompt, {
      maxTokens: 100,
      temperature: 0.7
    });

    if (response && response.content) {
      return {
        content: response.content.trim(),
        metadata: {
          aiGenerated: true,
          characterId: character.participant_id,
          replyTo: replyToMessageId,
          generatedAt: new Date().toISOString()
        }
      };
    }

    return null;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return null;
  }
}

// Initialize function
export function initializeMessageRoutes(dbPool: Pool): void {
  pool = dbPool;
  console.log('📨 WhoseApp Message Routes initialized');
}

export default router;
