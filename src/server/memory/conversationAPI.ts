import express, { Request, Response } from 'express';
import { conversationStorage, ConversationQuery, MessageQuery } from './conversationStorage.js';
import { embeddingService } from './embeddingService.js';
import { qdrantClient } from './qdrantClient.js';
import { semanticSearchRouter } from './semanticSearchAPI.js';
import { aiContextRouter } from './aiContextAPI.js';
import { adminRouter } from './adminAPI.js';

export const conversationRouter = express.Router();

// Middleware for error handling
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: Function) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware for request validation
const validateCampaignId = (req: Request, res: Response, next: Function) => {
  const campaignId = parseInt(req.params.campaignId || req.body.campaignId);
  if (isNaN(campaignId) || campaignId < 1) {
    return res.status(400).json({ error: 'Invalid campaign ID' });
  }
  req.body.campaignId = campaignId;
  next();
};

/**
 * GET /api/memory/health
 * Get system health status
 */
conversationRouter.get('/health', asyncHandler(async (req: Request, res: Response) => {
  const [storageHealth, embeddingHealth, vectorHealth] = await Promise.all([
    conversationStorage.healthCheck(),
    embeddingService.healthCheck(),
    qdrantClient.healthCheck()
  ]);

  const overallStatus = 
    storageHealth.status === 'healthy' && 
    embeddingHealth.status === 'healthy' && 
    vectorHealth.qdrant && vectorHealth.collection
      ? 'healthy' 
      : 'degraded';

  res.json({
    status: overallStatus,
    components: {
      storage: storageHealth,
      embedding: embeddingHealth,
      vector: vectorHealth
    },
    timestamp: new Date().toISOString()
  });
}));

/**
 * POST /api/memory/conversations
 * Create a new conversation
 */
conversationRouter.post('/conversations', validateCampaignId, asyncHandler(async (req: Request, res: Response) => {
  const { campaignId, title } = req.body;
  
  const conversationId = await conversationStorage.createConversation(campaignId, title);
  
  res.status(201).json({
    id: conversationId,
    campaignId,
    title: title || null,
    createdAt: new Date().toISOString()
  });
}));

/**
 * GET /api/memory/conversations
 * Get conversations with optional filtering
 */
conversationRouter.get('/conversations', asyncHandler(async (req: Request, res: Response) => {
  const query: ConversationQuery = {};
  
  if (req.query.campaignId) {
    const campaignId = parseInt(req.query.campaignId as string);
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }
    query.campaignId = campaignId;
  }
  
  if (req.query.status) {
    const status = req.query.status as string;
    if (!['active', 'archived', 'deleted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    query.status = status as 'active' | 'archived' | 'deleted';
  }
  
  if (req.query.limit) {
    query.limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
  }
  
  if (req.query.offset) {
    query.offset = parseInt(req.query.offset as string) || 0;
  }
  
  if (req.query.since) {
    query.since = new Date(req.query.since as string);
  }
  
  if (req.query.until) {
    query.until = new Date(req.query.until as string);
  }
  
  if (req.query.search) {
    query.search = req.query.search as string;
  }
  
  const conversations = await conversationStorage.getConversations(query);
  
  res.json({
    conversations,
    count: conversations.length,
    query
  });
}));

/**
 * GET /api/memory/conversations/:conversationId
 * Get a specific conversation
 */
conversationRouter.get('/conversations/:conversationId', asyncHandler(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  
  const conversation = await conversationStorage.getConversation(conversationId);
  
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  
  res.json(conversation);
}));

/**
 * PUT /api/memory/conversations/:conversationId/archive
 * Archive a conversation
 */
conversationRouter.put('/conversations/:conversationId/archive', asyncHandler(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  
  // Check if conversation exists
  const conversation = await conversationStorage.getConversation(conversationId);
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  
  await conversationStorage.archiveConversation(conversationId);
  
  res.json({ 
    message: 'Conversation archived successfully',
    conversationId
  });
}));

/**
 * DELETE /api/memory/conversations/:conversationId
 * Delete a conversation
 */
conversationRouter.delete('/conversations/:conversationId', asyncHandler(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  
  // Check if conversation exists
  const conversation = await conversationStorage.getConversation(conversationId);
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  
  await conversationStorage.deleteConversation(conversationId);
  
  res.json({ 
    message: 'Conversation deleted successfully',
    conversationId
  });
}));

/**
 * POST /api/memory/conversations/:conversationId/messages
 * Add a message to a conversation with automatic vectorization
 */
conversationRouter.post('/conversations/:conversationId/messages', asyncHandler(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const { role, content, entities, actionType, gameState } = req.body;
  
  // Validate required fields
  if (!role || !content) {
    return res.status(400).json({ error: 'Role and content are required' });
  }
  
  if (!['user', 'assistant', 'system'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  
  // Check if conversation exists
  const conversation = await conversationStorage.getConversation(conversationId);
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  
  // Add message to storage
  const messageId = await conversationStorage.addMessage({
    conversationId,
    role,
    content,
    entities,
    actionType,
    gameState
  });
  
  // Generate embedding and store in vector database (async)
  try {
    const embedding = await embeddingService.embedSingle(content);
    
    const vectorData = {
      id: messageId,
      vector: embedding,
      payload: {
        campaignId: conversation.campaignId,
        timestamp: new Date().toISOString(),
        role,
        content,
        entities: entities || [],
        gameState,
        actionType
      }
    };
    
    await qdrantClient.storeConversation(vectorData);
    await conversationStorage.updateMessageVectorId(messageId, messageId);
    
  } catch (vectorError) {
    console.warn('⚠️ Failed to create vector for message, continuing without vectorization:', vectorError);
  }
  
  res.status(201).json({
    id: messageId,
    conversationId,
    role,
    content,
    createdAt: new Date().toISOString()
  });
}));

/**
 * GET /api/memory/conversations/:conversationId/messages
 * Get messages for a conversation
 */
conversationRouter.get('/conversations/:conversationId/messages', asyncHandler(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  
  // Check if conversation exists
  const conversation = await conversationStorage.getConversation(conversationId);
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  
  const query: MessageQuery = { conversationId };
  
  if (req.query.limit) {
    query.limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
  }
  
  if (req.query.offset) {
    query.offset = parseInt(req.query.offset as string) || 0;
  }
  
  if (req.query.role) {
    const role = req.query.role as string;
    if (!['user', 'assistant', 'system'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    query.role = role as 'user' | 'assistant' | 'system';
  }
  
  const messages = await conversationStorage.getMessages(query);
  
  res.json({
    messages,
    count: messages.length,
    conversationId
  });
}));

/**
 * GET /api/memory/messages
 * Search messages across conversations
 */
conversationRouter.get('/messages', asyncHandler(async (req: Request, res: Response) => {
  const query: MessageQuery = {};
  
  if (req.query.campaignId) {
    const campaignId = parseInt(req.query.campaignId as string);
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }
    query.campaignId = campaignId;
  }
  
  if (req.query.role) {
    const role = req.query.role as string;
    if (!['user', 'assistant', 'system'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    query.role = role as 'user' | 'assistant' | 'system';
  }
  
  if (req.query.actionType) {
    query.actionType = req.query.actionType as string;
  }
  
  if (req.query.entities) {
    const entitiesStr = req.query.entities as string;
    query.entities = entitiesStr.split(',').map(e => e.trim());
  }
  
  if (req.query.limit) {
    query.limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
  }
  
  if (req.query.offset) {
    query.offset = parseInt(req.query.offset as string) || 0;
  }
  
  if (req.query.since) {
    query.since = new Date(req.query.since as string);
  }
  
  if (req.query.until) {
    query.until = new Date(req.query.until as string);
  }
  
  const messages = await conversationStorage.getMessages(query);
  
  res.json({
    messages,
    count: messages.length,
    query
  });
}));

/**
 * POST /api/memory/search
 * Semantic search for similar conversations/messages
 */
conversationRouter.post('/search', asyncHandler(async (req: Request, res: Response) => {
  const { query, campaignId, limit = 10, minScore = 0.7, entities } = req.body;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query string is required' });
  }
  
  try {
    // Generate embedding for search query
    const queryEmbedding = await embeddingService.embedSingle(query);
    
    // Search similar vectors
    const searchOptions: any = {
      campaignId,
      limit: Math.min(limit, 50),
      minScore,
      entities
    };
    
    const similarVectors = await qdrantClient.searchSimilar(queryEmbedding, searchOptions);
    
    // Get corresponding messages from storage
    const messageIds = similarVectors.map(result => result.id);
    const messages = await Promise.all(
      messageIds.map(async (id) => {
        try {
          return await conversationStorage.getMessages({ conversationId: id });
        } catch {
          return null;
        }
      })
    );
    
    const results = similarVectors.map((vector, index) => ({
      score: vector.score,
      message: {
        id: vector.id,
        content: vector.payload.content,
        role: vector.payload.role,
        timestamp: vector.payload.timestamp,
        entities: vector.payload.entities || [],
        actionType: vector.payload.actionType
      }
    })).filter(result => result.message);
    
    res.json({
      query,
      results,
      count: results.length,
      searchOptions
    });
    
  } catch (error) {
    console.error('Search failed:', error);
    res.status(500).json({ error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}));

/**
 * GET /api/memory/stats
 * Get memory system statistics
 */
conversationRouter.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  let campaignId: number | undefined;
  
  if (req.query.campaignId) {
    campaignId = parseInt(req.query.campaignId as string);
    if (isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }
  }
  
  const [storageStats, embeddingStats, vectorStats] = await Promise.all([
    conversationStorage.getStats(campaignId),
    embeddingService.getCacheStats(),
    qdrantClient.getStats()
  ]);
  
  res.json({
    storage: storageStats,
    embedding: embeddingStats,
    vector: vectorStats,
    timestamp: new Date().toISOString()
  });
}));

/**
 * Semantic Search API Routes
 * Mount all advanced search endpoints under the memory API
 */
conversationRouter.use('/', semanticSearchRouter);

/**
 * AI Context API Routes
 * Mount all memory-enhanced AI endpoints under the memory API
 */
conversationRouter.use('/', aiContextRouter);

/**
 * Admin API Routes
 * Mount all admin interface endpoints under the memory API
 */
conversationRouter.use('/', adminRouter);

/**
 * Error handling middleware
 */
conversationRouter.use((error: any, req: Request, res: Response, next: Function) => {
  console.error('Memory API error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation error', details: error.message });
  }
  
  if (error.code === '23503') { // PostgreSQL foreign key violation
    return res.status(400).json({ error: 'Invalid reference', details: 'Referenced entity does not exist' });
  }
  
  if (error.code === '23505') { // PostgreSQL unique violation
    return res.status(409).json({ error: 'Duplicate entry', details: error.message });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

export default conversationRouter;
