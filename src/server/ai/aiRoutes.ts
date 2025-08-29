/**
 * AI Routes for WhoseApp
 * Uses the Abstract LLM interface with any configured provider
 */

import { Router } from 'express';
import { getProvider } from '../llm/factory.ts';
import type { ModelMessage } from '../llm/types.ts';
import { conversationMemoryService } from '../memory/conversationMemoryService';
import { AIContextService, MemoryContext, AIContextOptions } from '../memory/aiContextService';
import { randomUUID } from 'crypto';

const router = Router();

// Initialize AI Context Service for memory-enhanced responses
const aiContextService = new AIContextService();

/**
 * POST /api/ai/generate - Generate AI response using configured LLM provider
 */
router.post('/generate', async (req, res) => {
  console.log('🎯 /api/ai/generate endpoint called at', new Date().toISOString());
  try {
    const {
      prompt,
      character,
      conversationHistory = [],
      context = {},
      options = {}
    } = req.body;

    console.log('📝 Request body keys:', Object.keys(req.body));
    console.log('📝 Prompt length:', prompt?.length || 'undefined');

    if (!prompt) {
      console.log('❌ Missing prompt in request');
      return res.status(400).json({
        error: 'Missing required field: prompt'
      });
    }

    console.log('🤖 Generating AI response using abstract LLM interface');
    console.log('📝 Prompt:', prompt.substring(0, 100) + '...');
    console.log('👤 Character:', character?.name || 'Unknown');

    // Get the default LLM provider (configured as 'ollama' in providers.json)
    const llmProvider = getProvider('ollama');
    console.log('🦙 Using LLM provider:', llmProvider.name);

    // Build messages array for the abstract interface
    const messages: ModelMessage[] = [];
    
    // Add system message with character context
    if (character) {
      messages.push({
        role: 'system',
        content: `You are ${character.name}, ${character.role || 'an advisor'} in the ${character.department || 'government'} department of a galactic civilization. Focus on your area of expertise (${character?.department || 'general governance'}). Keep responses focused, actionable, and conversational. Use complete sentences and sound like a real strategic discussion between colleagues.`
      });
    }
    
    // Get conversation context from memory service
    let conversationContext = null;
    if (character?.id && context?.conversationId) {
      try {
        conversationContext = await conversationMemoryService.getConversationContext(
          character.id,
          context.conversationId,
          10
        );
        console.log('🧠 Retrieved conversation context from memory service');
      } catch (error) {
        console.log('⚠️ Could not retrieve conversation context:', error.message);
      }
    }

    // Add conversation history - ENHANCED MEMORY
    const historyToUse = conversationContext?.conversationHistory || conversationHistory;
    if (historyToUse && historyToUse.length > 0) {
      console.log('📚 Adding conversation history:', historyToUse.length, 'messages');
      historyToUse.slice(-6).forEach((msg: any, index: number) => {
        // Handle both field name variations
        const role = msg.role || (msg.senderId === 'user' ? 'user' : 'assistant') || (msg.sender === 'user' ? 'user' : 'assistant');
        messages.push({
          role: role,
          content: msg.content
        });
        console.log(`  ${index + 1}. ${role}: ${msg.content.substring(0, 50)}...`);
      });
    }

    // Add recent memories if available
    if (conversationContext?.recentMemories && conversationContext.recentMemories.length > 0) {
      console.log('🧠 Adding recent memories:', conversationContext.recentMemories.length, 'memories');
      const memoryContext = conversationContext.recentMemories
        .map(memory => `Memory: ${memory.content}`)
        .join('\n');
      
      messages.push({
        role: 'system',
        content: `Recent relevant memories:\n${memoryContext}`
      });
    }
    
    // Add instruction for shorter, more conversational responses FIRST - DYNAMIC CHARACTER
    const characterName = character?.name || 'Unknown';
    const characterRole = character?.role || 'advisor';
    const characterDepartment = character?.department || 'general';
    const characterTitle = character?.title || '';
    
    const roleDescription = characterTitle ? `${characterRole} (${characterTitle})` : characterRole;
    
            messages.push({
          role: 'system',
          content: `You are ${characterName}, ${roleDescription} in the ${characterDepartment} department of a galactic civilization. This is a COMPLETELY FANTASY GALACTIC WORLD.

CRITICAL RULES - NEVER MENTION REAL WORLD:
- NEVER mention Earth, Korea, North Korea, South Korea, Joe Biden, or any real countries, cities, continents, or people
- NEVER mention real-world events like COVID-19, geopolitics, Korean Peninsula, missile launches, or current affairs
- ONLY discuss made-up galactic civilizations, sectors, and events
- Use fantasy names like: Terran Federation, Andorian Empire, Vulcan Republic, Klingon Empire, Romulan Star Empire, Cardassian Union, Bajoran Republic, Ferengi Alliance, etc.
- Discuss space stations, colonies, wormholes, trade routes, interstellar diplomacy, cyber operations
- Keep responses around 100 words, conversational and focused on ONE specific galactic issue
- Provide actionable insights about the fantasy galactic world only

As ${characterName} from ${characterDepartment}, focus on your department's specific concerns and expertise.`
        });

    // Add current user prompt
    messages.push({
      role: 'user',
      content: prompt
    });

    // ENHANCED: Add memory context from vector memory
    let cleanedResponse = '';
    
    try {
      const memoryContext: MemoryContext = {
        campaignId: 1, // Default campaign
        conversationId: context?.conversationId || randomUUID(),
        currentMessage: prompt,
        entities: context?.gameContext?.availableCivilizations || [],
        actionType: 'conversation',
        gameState: context?.gameState || {},
        userId: character?.id || 'unknown'
      };

      const contextOptions: AIContextOptions = {
        maxTokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.7,
        contextConfig: {
          maxContextMessages: 6,
          timeWindowHours: 168, // 1 week
          minRelevanceScore: 0.6,
          includeEntities: true,
          boostRecency: true
        }
      };

      // Get memory-enhanced response
      const memoryResponse = await aiContextService.generateWithMemory(
        prompt,
        memoryContext,
        contextOptions
      );

      console.log('🧠 Memory-enhanced response generated');
      console.log('📊 Context used:', memoryResponse.contextUsed.messagesFound, 'relevant messages');
      
      // Use the memory-enhanced response
      cleanedResponse = memoryResponse.response;
      
    } catch (memoryError) {
      console.log('⚠️ Memory enhancement failed, using standard response:', memoryError instanceof Error ? memoryError.message : 'Unknown error');
      
      // Fallback to standard LLM response
      console.log('🔄 Calling LLM provider.complete with', messages.length, 'messages...');

      // Generate response using abstract LLM interface - NO TOKEN LIMITS
      const response = await llmProvider.complete(messages, {
        maxTokens: options.maxTokens || 4000, // Much higher limit for full context
        temperature: options.temperature || 0.7,
                  model: process.env.AI_MODEL || 'llama3.2:1b' // Use llama3.2:1b model as requested
      });

      // Clean up response by removing formatting artifacts
      cleanedResponse = response.text
        .replace(/<\|start_header_id\|>.*?<\|end_header_id\|>/g, '') // Remove header tags
        .replace(/^\s*\n+/, '') // Remove leading newlines
        .replace(/\n+$/, '') // Remove trailing newlines
        .trim();
    }

    // No artificial truncation - let the AI generate full responses

    console.log('✅ AI response generated successfully');
    console.log('📝 Response length:', cleanedResponse.length);

    res.json({
      success: true,
      content: cleanedResponse,
      provider: llmProvider.name,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ AI generation error:', error);
    res.status(500).json({
      error: 'Failed to generate AI response',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/ai/generate-stream - Generate streaming AI response
 */
router.post('/generate-stream', async (req, res) => {
  console.log('🎯 /api/ai/generate-stream endpoint called at', new Date().toISOString());
  
  // Set headers for streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
  
  try {
    const {
      prompt,
      character,
      conversationHistory = [],
      context = {},
      options = {}
    } = req.body;

    if (!prompt) {
      res.write(`data: ${JSON.stringify({ error: 'Missing required field: prompt' })}\n\n`);
      res.end();
      return;
    }

    console.log('🤖 Generating streaming AI response using abstract LLM interface');
    console.log('📝 Prompt:', prompt.substring(0, 100) + '...');
    console.log('👤 Character:', character?.name || 'Unknown');

    // Get the default LLM provider
    const llmProvider = getProvider('ollama');
    console.log('🦙 Using LLM provider:', llmProvider.name);

    // Build messages array for the abstract interface
    const messages: ModelMessage[] = [];
    
    // Add system message with character context
    if (character) {
      messages.push({
        role: 'system',
        content: `You are ${character.name}, ${character.role || 'an advisor'} in the ${character.department || 'government'} department of a galactic civilization. This is a COMPLETELY FANTASY GALACTIC WORLD.

CRITICAL RULES - NEVER MENTION REAL WORLD:
- NEVER mention Earth, Korea, North Korea, South Korea, Joe Biden, or any real countries, cities, continents, or people
- NEVER mention real-world events like COVID-19, geopolitics, Korean Peninsula, missile launches, or current affairs
- ONLY discuss made-up galactic civilizations, sectors, and events
- Use fantasy names like: Terran Federation, Andorian Empire, Vulcan Republic, Klingon Empire, Romulan Star Empire, Cardassian Union, Bajoran Republic, Ferengi Alliance, etc.
- Discuss space stations, colonies, wormholes, trade routes, interstellar diplomacy, cyber operations
- Keep responses around 100 words, conversational and focused on ONE specific galactic issue
- Provide actionable insights about the fantasy galactic world only

As ${character.name} from ${character.department}, focus on your department's specific concerns and expertise.`
      });
    }

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.slice(-6).forEach((msg: any) => {
        const role = msg.role || (msg.senderId === 'user' ? 'user' : 'assistant');
        messages.push({
          role: role,
          content: msg.content
        });
      });
    }

    // Add current user prompt
    messages.push({
      role: 'user',
      content: prompt
    });

    // ENHANCED: Add memory context from vector memory
    const memoryContext: MemoryContext = {
      campaignId: 1,
      conversationId: context?.conversationId || randomUUID(),
      currentMessage: prompt,
      entities: context?.gameContext?.availableCivilizations || [],
      actionType: 'conversation',
      gameState: context?.gameState || {},
      userId: character?.id || 'unknown'
    };

    const contextOptions: AIContextOptions = {
      maxTokens: options.maxTokens || 4000,
      temperature: options.temperature || 0.7,
      contextConfig: {
        maxContextMessages: 6,
        timeWindowHours: 168,
        minRelevanceScore: 0.6,
        includeEntities: true,
        boostRecency: true
      }
    };

    // For now, use standard streaming LLM response
    // TODO: Add memory-enhanced streaming to AIContextService
    console.log('🔄 Using standard streaming LLM response');
    
    const stream = llmProvider.completeStream!(messages, {
      maxTokens: options.maxTokens || 4000,
      temperature: options.temperature || 0.7,
      model: process.env.AI_MODEL || 'llama3.2:1b'
    });

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ type: 'end' })}\n\n`);
    res.end();

  } catch (error) {
    console.error('❌ AI streaming generation error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to generate AI response', message: error instanceof Error ? error.message : 'Unknown error' })}\n\n`);
    res.end();
  }
});

/**
 * GET /api/ai/status - Get AI service status
 */
router.get('/status', async (req, res) => {
  try {
    const llmProvider = getProvider('ollama');
    
    res.json({
      success: true,
      provider: llmProvider.name,
      supportsTools: llmProvider.supportsTools,
      supportsStreaming: llmProvider.supportsStreaming,
      supportsEmbedding: llmProvider.supportsEmbedding,
      config: {
        provider: 'ollama',
        model: process.env.AI_MODEL || 'llama3.2:1b',
        baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ AI status error:', error);
    res.status(500).json({
      error: 'Failed to get AI status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/ai/ping - Simple health check
 */
router.get('/ping', (req, res) => {
  console.log('🏓 Ping received at', new Date().toISOString());
  res.json({ message: 'pong', timestamp: new Date().toISOString() });
});

/**
 * POST /api/ai/store-message - Store a message in conversation memory
 */
router.post('/store-message', async (req, res) => {
  console.log('💾 /api/ai/store-message endpoint called');
  try {
    const {
      conversationId,
      characterId,
      characterName,
      characterRole,
      characterDepartment,
      senderId,
      senderName,
      senderRole,
      content,
      messageType = 'text',
      entities,
      actionType,
      gameState
    } = req.body;

    if (!conversationId || !characterId || !content) {
      return res.status(400).json({
        error: 'Missing required fields: conversationId, characterId, content'
      });
    }

    // Store message in conversation memory
    const messageId = await conversationMemoryService.addCharacterMessage({
      conversationId,
      characterId,
      senderId: senderId || 'user',
      senderName: senderName || 'User',
      senderRole: senderRole || 'user',
      content,
      messageType,
      entities,
      actionType,
      gameState
    });

    console.log(`💾 Stored message ${messageId} in conversation memory`);

    res.json({
      success: true,
      messageId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /api/ai/store-message:', error);
    res.status(500).json({
      error: 'Failed to store message',
      details: error.message
    });
  }
});

/**
 * POST /api/ai/create-conversation - Create a new conversation
 */
router.post('/create-conversation', async (req, res) => {
  console.log('💬 /api/ai/create-conversation endpoint called');
  try {
    const {
      characterId,
      characterName,
      characterRole,
      characterDepartment,
      conversationType = 'individual',
      participants = [],
      title
    } = req.body;

    if (!characterId || !characterName || !characterRole || !characterDepartment) {
      return res.status(400).json({
        error: 'Missing required fields: characterId, characterName, characterRole, characterDepartment'
      });
    }

    // Create new conversation
    const conversationId = await conversationMemoryService.createCharacterConversation(
      characterId,
      characterName,
      characterRole,
      characterDepartment,
      conversationType,
      participants,
      title
    );

    console.log(`💬 Created conversation ${conversationId}`);

    res.json({
      success: true,
      conversationId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /api/ai/create-conversation:', error);
    res.status(500).json({
      error: 'Failed to create conversation',
      details: error.message
    });
  }
});

/**
 * GET /api/ai/conversations/:characterId - Get recent conversations for a character
 */
router.get('/conversations/:characterId', async (req, res) => {
  console.log('📋 /api/ai/conversations endpoint called');
  try {
    const { characterId } = req.params;
    const { limit = 10 } = req.query;

    const conversations = await conversationMemoryService.getRecentConversations(
      characterId,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      conversations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /api/ai/conversations:', error);
    res.status(500).json({
      error: 'Failed to get conversations',
      details: error.message
    });
  }
});

/**
 * GET /api/ai/conversations/:conversationId/messages - Get messages for a conversation
 */
router.get('/conversations/:conversationId/messages', async (req, res) => {
  console.log('💬 /api/ai/conversation-messages endpoint called');
  try {
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await conversationMemoryService.getConversationMessages(
      conversationId,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.json({
      success: true,
      messages,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /api/ai/conversation-messages:', error);
    res.status(500).json({
      error: 'Failed to get conversation messages',
      details: error.message
    });
  }
});

/**
 * GET /api/ai/channels/:characterId - Get channel conversations for a character
 */
router.get('/channels/:characterId', async (req, res) => {
  console.log('📢 /api/ai/channels endpoint called');
  try {
    const { characterId } = req.params;
    const { limit = 10 } = req.query;

    const channels = await conversationMemoryService.getChannelConversations(
      characterId,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      channels,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /api/ai/channels:', error);
    res.status(500).json({
      error: 'Failed to get channel conversations',
      details: error.message
    });
  }
});

/**
 * POST /api/ai/channels/:conversationId/participants - Add character to channel
 */
router.post('/channels/:conversationId/participants', async (req, res) => {
  console.log('👥 /api/ai/add-to-channel endpoint called');
  try {
    const { conversationId } = req.params;
    const {
      characterId,
      characterName,
      characterRole,
      characterDepartment
    } = req.body;

    if (!characterId || !characterName || !characterRole || !characterDepartment) {
      return res.status(400).json({
        error: 'Missing required fields: characterId, characterName, characterRole, characterDepartment'
      });
    }

    await conversationMemoryService.addCharacterToChannel(
      conversationId,
      characterId,
      characterName,
      characterRole,
      characterDepartment
    );

    res.json({
      success: true,
      message: `Added ${characterName} to channel`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /api/ai/add-to-channel:', error);
    res.status(500).json({
      error: 'Failed to add character to channel',
      details: error.message
    });
  }
});

/**
 * DELETE /api/ai/channels/:conversationId/participants/:characterId - Remove character from channel
 */
router.delete('/channels/:conversationId/participants/:characterId', async (req, res) => {
  console.log('👥 /api/ai/remove-from-channel endpoint called');
  try {
    const { conversationId, characterId } = req.params;

    await conversationMemoryService.removeCharacterFromChannel(
      conversationId,
      characterId
    );

    res.json({
      success: true,
      message: `Removed character from channel`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /api/ai/remove-from-channel:', error);
    res.status(500).json({
      error: 'Failed to remove character from channel',
      details: error.message
    });
  }
});

/**
 * GET /api/ai/channels/:conversationId/participants - Get channel participants
 */
router.get('/channels/:conversationId/participants', async (req, res) => {
  console.log('👥 /api/ai/channel-participants endpoint called');
  try {
    const { conversationId } = req.params;

    const participants = await conversationMemoryService.getChannelParticipants(
      conversationId
    );

    res.json({
      success: true,
      participants,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in /api/ai/channel-participants:', error);
    res.status(500).json({
      error: 'Failed to get channel participants',
      details: error.message
    });
  }
});

export default router;