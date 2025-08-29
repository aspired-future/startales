/**
 * Comprehensive Memory System API
 * Provides REST endpoints for Witter, character memory, civilization memory, and migration
 */

import { Router, Request, Response } from 'express';
import { witterStorage } from './witterStorage';
import { characterVectorMemory } from './characterVectorMemory';
import { civilizationVectorMemory } from './civilizationVectorMemory';
import { enhancedConversationStorage } from './conversationStorageNew';
import { memoryMigrationService } from './migrationService';

const router = Router();

// Helper function for async error handling
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: Function) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ============================================================================
// WITTER SYSTEM ENDPOINTS
// ============================================================================

/**
 * POST /api/memory/witter/posts
 * Create a new Witter post
 */
router.post('/witter/posts', asyncHandler(async (req: Request, res: Response) => {
  const { characterId, authorName, content, metadata, campaignId } = req.body;
  
  if (!characterId || !authorName || !content) {
    return res.status(400).json({ error: 'characterId, authorName, and content are required' });
  }

  const postId = `witt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    await witterStorage.createPost({
      id: postId,
      characterId,
      authorName,
      content,
      metadata,
      campaignId
    });

    // Also store in character memory
    await characterVectorMemory.storeCharacterMemory(
      characterId,
      content,
      'witter_post',
      { ...metadata, authorName },
      campaignId,
      postId
    );

    res.status(201).json({
      id: postId,
      characterId,
      authorName,
      content,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Failed to create Witter post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
}));

/**
 * GET /api/memory/witter/posts/character/:characterId
 * Get posts by character
 */
router.get('/witter/posts/character/:characterId', asyncHandler(async (req: Request, res: Response) => {
  const { characterId } = req.params;
  const limit = parseInt(req.query.limit as string) || 50;

  try {
    const posts = await witterStorage.getPostsByCharacter(characterId, limit);
    res.json({ posts, count: posts.length });
  } catch (error) {
    console.error('❌ Failed to get posts by character:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
}));

/**
 * GET /api/memory/witter/posts/campaign/:campaignId
 * Get posts by campaign
 */
router.get('/witter/posts/campaign/:campaignId', asyncHandler(async (req: Request, res: Response) => {
  const campaignId = parseInt(req.params.campaignId);
  const limit = parseInt(req.query.limit as string) || 100;

  try {
    const posts = await witterStorage.getPostsByCampaign(campaignId, limit);
    res.json({ posts, count: posts.length });
  } catch (error) {
    console.error('❌ Failed to get posts by campaign:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
}));

/**
 * POST /api/memory/witter/posts/:postId/comments
 * Add a comment to a post
 */
router.post('/witter/posts/:postId/comments', asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { characterId, authorName, content, campaignId } = req.body;

  if (!characterId || !authorName || !content) {
    return res.status(400).json({ error: 'characterId, authorName, and content are required' });
  }

  const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    await witterStorage.createComment({
      id: commentId,
      postId,
      characterId,
      authorName,
      content,
      campaignId
    });

    res.status(201).json({
      id: commentId,
      postId,
      characterId,
      authorName,
      content,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Failed to create comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
}));

/**
 * GET /api/memory/witter/stats
 * Get Witter system statistics
 */
router.get('/witter/stats', asyncHandler(async (req: Request, res: Response) => {
  try {
    const stats = await witterStorage.getPostStats();
    res.json(stats);
  } catch (error) {
    console.error('❌ Failed to get Witter stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
}));

// ============================================================================
// CHARACTER MEMORY ENDPOINTS
// ============================================================================

/**
 * POST /api/memory/character/:characterId/memories
 * Store a memory for a character
 */
router.post('/character/:characterId/memories', asyncHandler(async (req: Request, res: Response) => {
  const { characterId } = req.params;
  const { content, contentType, metadata, campaignId, originalId } = req.body;

  if (!content || !contentType) {
    return res.status(400).json({ error: 'content and contentType are required' });
  }

  try {
    const memoryId = await characterVectorMemory.storeCharacterMemory(
      characterId,
      content,
      contentType,
      metadata,
      campaignId,
      originalId
    );

    res.status(201).json({
      id: memoryId,
      characterId,
      contentType,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Failed to store character memory:', error);
    res.status(500).json({ error: 'Failed to store memory' });
  }
}));

/**
 * POST /api/memory/character/:characterId/search
 * Search character memories
 */
router.post('/character/:characterId/search', asyncHandler(async (req: Request, res: Response) => {
  const { characterId } = req.params;
  const { query, contentType, timeRange, limit, threshold } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'query is required' });
  }

  try {
    const results = await characterVectorMemory.searchCharacterMemories(characterId, query, {
      contentType,
      timeRange,
      limit,
      threshold
    });

    res.json({ results, count: results.length });
  } catch (error) {
    console.error('❌ Failed to search character memories:', error);
    res.status(500).json({ error: 'Failed to search memories' });
  }
}));

/**
 * GET /api/memory/character/:characterId/recent
 * Get recent memories for a character
 */
router.get('/character/:characterId/recent', asyncHandler(async (req: Request, res: Response) => {
  const { characterId } = req.params;
  const limit = parseInt(req.query.limit as string) || 20;
  const contentType = req.query.contentType as string;

  try {
    const memories = await characterVectorMemory.getRecentMemories(
      characterId,
      limit,
      contentType ? [contentType] : undefined
    );

    res.json({ memories, count: memories.length });
  } catch (error) {
    console.error('❌ Failed to get recent character memories:', error);
    res.status(500).json({ error: 'Failed to get memories' });
  }
}));

/**
 * GET /api/memory/character/:characterId/stats
 * Get character memory statistics
 */
router.get('/character/:characterId/stats', asyncHandler(async (req: Request, res: Response) => {
  const { characterId } = req.params;

  try {
    const stats = await characterVectorMemory.getCharacterMemoryStats(characterId);
    res.json(stats);
  } catch (error) {
    console.error('❌ Failed to get character memory stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
}));

// ============================================================================
// CIVILIZATION MEMORY ENDPOINTS
// ============================================================================

/**
 * POST /api/memory/civilization/:civilizationId/memories
 * Store a memory for a civilization
 */
router.post('/civilization/:civilizationId/memories', asyncHandler(async (req: Request, res: Response) => {
  const { civilizationId } = req.params;
  const { content, contentType, classification, metadata, campaignId, originalId } = req.body;

  if (!content || !contentType) {
    return res.status(400).json({ error: 'content and contentType are required' });
  }

  try {
    const memoryId = await civilizationVectorMemory.storeCivilizationMemory(
      civilizationId,
      content,
      contentType,
      classification,
      metadata,
      campaignId,
      originalId
    );

    res.status(201).json({
      id: memoryId,
      civilizationId,
      contentType,
      classification: classification || 'PUBLIC',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Failed to store civilization memory:', error);
    res.status(500).json({ error: 'Failed to store memory' });
  }
}));

/**
 * POST /api/memory/civilization/:civilizationId/search
 * Search civilization memories
 */
router.post('/civilization/:civilizationId/search', asyncHandler(async (req: Request, res: Response) => {
  const { civilizationId } = req.params;
  const { query, contentType, classification, timeRange, limit, threshold } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'query is required' });
  }

  try {
    const results = await civilizationVectorMemory.searchCivilizationMemories(civilizationId, query, {
      contentType,
      classification,
      timeRange,
      limit,
      threshold
    });

    res.json({ results, count: results.length });
  } catch (error) {
    console.error('❌ Failed to search civilization memories:', error);
    res.status(500).json({ error: 'Failed to search memories' });
  }
}));

/**
 * GET /api/memory/civilization/:civilizationId/intelligence
 * Get intelligence reports for a civilization
 */
router.get('/civilization/:civilizationId/intelligence', asyncHandler(async (req: Request, res: Response) => {
  const { civilizationId } = req.params;
  const classification = req.query.classification as string;
  const limit = parseInt(req.query.limit as string) || 20;

  try {
    const reports = await civilizationVectorMemory.getIntelligenceReports(
      civilizationId,
      classification ? [classification] : undefined,
      undefined,
      limit
    );

    res.json({ reports, count: reports.length });
  } catch (error) {
    console.error('❌ Failed to get intelligence reports:', error);
    res.status(500).json({ error: 'Failed to get intelligence reports' });
  }
}));

/**
 * GET /api/memory/civilization/:civilizationId/speeches
 * Get leader speeches for a civilization
 */
router.get('/civilization/:civilizationId/speeches', asyncHandler(async (req: Request, res: Response) => {
  const { civilizationId } = req.params;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const speeches = await civilizationVectorMemory.getLeaderSpeeches(civilizationId, undefined, limit);
    res.json({ speeches, count: speeches.length });
  } catch (error) {
    console.error('❌ Failed to get leader speeches:', error);
    res.status(500).json({ error: 'Failed to get speeches' });
  }
}));

/**
 * GET /api/memory/civilization/:civilizationId/news
 * Get galactic news for a civilization
 */
router.get('/civilization/:civilizationId/news', asyncHandler(async (req: Request, res: Response) => {
  const { civilizationId } = req.params;
  const limit = parseInt(req.query.limit as string) || 30;

  try {
    const news = await civilizationVectorMemory.getGalacticNews(civilizationId, undefined, limit);
    res.json({ news, count: news.length });
  } catch (error) {
    console.error('❌ Failed to get galactic news:', error);
    res.status(500).json({ error: 'Failed to get news' });
  }
}));

/**
 * GET /api/memory/civilization/:civilizationId/stats
 * Get civilization memory statistics
 */
router.get('/civilization/:civilizationId/stats', asyncHandler(async (req: Request, res: Response) => {
  const { civilizationId } = req.params;

  try {
    const stats = await civilizationVectorMemory.getCivilizationMemoryStats(civilizationId);
    res.json(stats);
  } catch (error) {
    console.error('❌ Failed to get civilization memory stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
}));

// ============================================================================
// CONVERSATION ENDPOINTS
// ============================================================================

/**
 * POST /api/memory/conversations
 * Create a new conversation
 */
router.post('/conversations', asyncHandler(async (req: Request, res: Response) => {
  const { campaignId, participantIds, conversationType, metadata } = req.body;

  if (!campaignId || !participantIds || !conversationType) {
    return res.status(400).json({ error: 'campaignId, participantIds, and conversationType are required' });
  }

  const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    await enhancedConversationStorage.createConversation({
      id: conversationId,
      campaignId,
      participantIds,
      conversationType,
      metadata
    });

    res.status(201).json({
      id: conversationId,
      campaignId,
      participantIds,
      conversationType,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Failed to create conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
}));

/**
 * POST /api/memory/conversations/:conversationId/messages
 * Add a message to a conversation
 */
router.post('/conversations/:conversationId/messages', asyncHandler(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const { senderId, senderType, content, entities, actionType, gameState, campaignId } = req.body;

  if (!senderId || !senderType || !content) {
    return res.status(400).json({ error: 'senderId, senderType, and content are required' });
  }

  // Get current message count to determine index
  const existingMessages = await enhancedConversationStorage.getMessages(conversationId, 1000);
  const messageIndex = existingMessages.length;

  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    await enhancedConversationStorage.addMessage({
      id: messageId,
      conversationId,
      senderId,
      senderType,
      content,
      messageIndex,
      entities,
      actionType,
      gameState,
      campaignId
    });

    res.status(201).json({
      id: messageId,
      conversationId,
      senderId,
      senderType,
      content,
      messageIndex,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Failed to add message:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
}));

/**
 * GET /api/memory/conversations/:conversationId/messages
 * Get messages for a conversation
 */
router.get('/conversations/:conversationId/messages', asyncHandler(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;

  try {
    const messages = await enhancedConversationStorage.getMessages(conversationId, limit, offset);
    res.json({ messages, count: messages.length });
  } catch (error) {
    console.error('❌ Failed to get messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}));

/**
 * GET /api/memory/conversations/stats
 * Get conversation statistics
 */
router.get('/conversations/stats', asyncHandler(async (req: Request, res: Response) => {
  try {
    const stats = await enhancedConversationStorage.getConversationStats();
    res.json(stats);
  } catch (error) {
    console.error('❌ Failed to get conversation stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
}));

// ============================================================================
// MIGRATION ENDPOINTS
// ============================================================================

/**
 * POST /api/memory/migration/witter
 * Migrate legacy Witter posts
 */
router.post('/migration/witter', asyncHandler(async (req: Request, res: Response) => {
  const { posts, options } = req.body;

  if (!posts || !Array.isArray(posts)) {
    return res.status(400).json({ error: 'posts array is required' });
  }

  try {
    const result = await memoryMigrationService.migrateLegacyWitterPosts(posts, options);
    res.json(result);
  } catch (error) {
    console.error('❌ Failed to migrate Witter posts:', error);
    res.status(500).json({ error: 'Migration failed' });
  }
}));

/**
 * POST /api/memory/migration/validate
 * Validate migration results
 */
router.post('/migration/validate', asyncHandler(async (req: Request, res: Response) => {
  const options = req.body;

  try {
    const result = await memoryMigrationService.validateMigration(options);
    res.json(result);
  } catch (error) {
    console.error('❌ Failed to validate migration:', error);
    res.status(500).json({ error: 'Validation failed' });
  }
}));

// ============================================================================
// HEALTH CHECK ENDPOINTS
// ============================================================================

/**
 * GET /api/memory/health
 * Health check for all memory systems
 */
router.get('/health', asyncHandler(async (req: Request, res: Response) => {
  try {
    const [characterHealth, civilizationHealth] = await Promise.all([
      characterVectorMemory.healthCheck(),
      civilizationVectorMemory.healthCheck()
    ]);

    const overallHealth = {
      status: characterHealth.qdrantConnected && civilizationHealth.qdrantConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        characterMemory: characterHealth,
        civilizationMemory: civilizationHealth,
        database: true, // Assume healthy if we got this far
        embeddingService: characterHealth.embeddingServiceConfigured
      }
    };

    res.json(overallHealth);
  } catch (error) {
    console.error('❌ Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
}));

export { router as memoryRouter };
