import express, { Request, Response } from 'express';
import { semanticSearchService, SemanticSearchQuery } from './semanticSearch.js';
import { conversationStorage } from './conversationStorage.js';
import { qdrantClient } from './qdrantClient.js';

export const semanticSearchRouter = express.Router();

// Middleware for error handling
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: Function) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation middleware
const validateSearchQuery = (req: Request, res: Response, next: Function) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Query is required and must be a non-empty string' 
    });
  }
  next();
};

/**
 * POST /api/memory/search
 * Advanced semantic search with full filtering capabilities
 */
semanticSearchRouter.post('/search', validateSearchQuery, asyncHandler(async (req: Request, res: Response) => {
  const searchQuery: SemanticSearchQuery = {
    query: req.body.query,
    campaignId: req.body.campaignId,
    conversationIds: req.body.conversationIds,
    
    // Time filtering
    timeframe: req.body.timeframe ? {
      start: new Date(req.body.timeframe.start),
      end: new Date(req.body.timeframe.end)
    } : undefined,
    
    // Content filtering  
    entities: req.body.entities,
    actionTypes: req.body.actionTypes,
    roles: req.body.roles,
    
    // Search behavior
    limit: Math.min(req.body.limit || 10, 50),
    offset: req.body.offset || 0,
    minScore: req.body.minScore,
    maxScore: req.body.maxScore,
    
    // Advanced options
    boost: req.body.boost,
    
    // Query expansion
    expandQuery: req.body.expandQuery,
    synonyms: req.body.synonyms,
    
    // Result grouping
    groupBy: req.body.groupBy,
    groupLimit: req.body.groupLimit
  };
  
  try {
    const response = await semanticSearchService.search(searchQuery);
    
    res.json({
      success: true,
      data: response,
      meta: {
        searchTime: response.searchTime,
        totalResults: response.totalCount,
        page: {
          offset: searchQuery.offset || 0,
          limit: searchQuery.limit || 10,
          hasMore: (searchQuery.offset || 0) + response.results.length < response.totalCount
        }
      }
    });
    
  } catch (error) {
    console.error('Search failed:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * GET /api/memory/search/quick
 * Quick search with minimal parameters
 */
semanticSearchRouter.get('/search/quick', asyncHandler(async (req: Request, res: Response) => {
  const { q: query, campaignId, limit } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }
  
  try {
    const results = await semanticSearchService.quickSearch(
      query,
      campaignId ? parseInt(campaignId as string) : undefined,
      limit ? parseInt(limit as string) : 10
    );
    
    res.json({
      success: true,
      query,
      results,
      count: results.length
    });
    
  } catch (error) {
    console.error('Quick search failed:', error);
    res.status(500).json({
      success: false,
      error: 'Quick search failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * POST /api/memory/search/conversation
 * Search within specific conversations
 */
semanticSearchRouter.post('/search/conversation', validateSearchQuery, asyncHandler(async (req: Request, res: Response) => {
  const { query, conversationIds, limit } = req.body;
  
  if (!conversationIds || !Array.isArray(conversationIds) || conversationIds.length === 0) {
    return res.status(400).json({ 
      error: 'conversationIds must be a non-empty array' 
    });
  }
  
  try {
    const results = await semanticSearchService.searchConversation(
      query,
      conversationIds,
      limit || 20
    );
    
    res.json({
      success: true,
      query,
      conversationIds,
      results,
      count: results.length
    });
    
  } catch (error) {
    console.error('Conversation search failed:', error);
    res.status(500).json({
      success: false,
      error: 'Conversation search failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * POST /api/memory/search/entity
 * Entity-focused search with entity boosting
 */
semanticSearchRouter.post('/search/entity', validateSearchQuery, asyncHandler(async (req: Request, res: Response) => {
  const { query, entity, campaignId, limit } = req.body;
  
  if (!entity || typeof entity !== 'string') {
    return res.status(400).json({ 
      error: 'Entity parameter is required' 
    });
  }
  
  const searchQuery: SemanticSearchQuery = {
    query,
    campaignId,
    limit: limit || 15,
    entities: {
      require: [entity]
    },
    boost: {
      entities: { [entity]: 1.5 }
    },
    expandQuery: true
  };
  
  try {
    const response = await semanticSearchService.search(searchQuery);
    
    res.json({
      success: true,
      entity,
      data: response,
      meta: {
        searchTime: response.searchTime,
        entityFocus: entity
      }
    });
    
  } catch (error) {
    console.error('Entity search failed:', error);
    res.status(500).json({
      success: false,
      error: 'Entity search failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * POST /api/memory/search/recent
 * Recent conversation search with recency boost
 */
semanticSearchRouter.post('/search/recent', validateSearchQuery, asyncHandler(async (req: Request, res: Response) => {
  const { query, campaignId, hours } = req.body;
  
  const hoursBack = hours || 24; // Default to last 24 hours
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - (hoursBack * 60 * 60 * 1000));
  
  const searchQuery: SemanticSearchQuery = {
    query,
    campaignId,
    limit: 20,
    timeframe: {
      start: startTime,
      end: endTime
    },
    boost: {
      recency: 0.3 // 30% recency boost
    },
    expandQuery: true
  };
  
  try {
    const response = await semanticSearchService.search(searchQuery);
    
    res.json({
      success: true,
      query,
      timeframe: {
        hours: hoursBack,
        start: startTime.toISOString(),
        end: endTime.toISOString()
      },
      data: response,
      meta: {
        searchTime: response.searchTime,
        recencyBoost: true
      }
    });
    
  } catch (error) {
    console.error('Recent search failed:', error);
    res.status(500).json({
      success: false,
      error: 'Recent search failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * POST /api/memory/search/similar
 * Find messages similar to a given message ID
 */
semanticSearchRouter.post('/search/similar', asyncHandler(async (req: Request, res: Response) => {
  const { messageId, campaignId, limit } = req.body;
  
  if (!messageId) {
    return res.status(400).json({ 
      error: 'messageId is required' 
    });
  }
  
  try {
    // First, get the content of the reference message from Qdrant
    const referenceMessage = await qdrantClient.getConversation(messageId);
    
    if (!referenceMessage) {
      return res.status(404).json({
        success: false,
        error: 'Reference message not found'
      });
    }
    
    // Use the reference message content as query
    const searchQuery: SemanticSearchQuery = {
      query: referenceMessage.payload.content,
      campaignId,
      limit: limit || 10,
      minScore: 0.6 // Higher threshold for similarity
    };
    
    const response = await semanticSearchService.search(searchQuery);
    
    // Filter out the original message
    const filteredResults = response.results.filter(r => r.id !== messageId);
    
    res.json({
      success: true,
      referenceMessage: {
        id: messageId,
        content: referenceMessage.payload.content.substring(0, 100) + '...',
        role: referenceMessage.payload.role
      },
      results: filteredResults,
      count: filteredResults.length,
      searchTime: response.searchTime
    });
    
  } catch (error) {
    console.error('Similar search failed:', error);
    res.status(500).json({
      success: false,
      error: 'Similar search failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * GET /api/memory/search/suggestions
 * Get search suggestions based on campaign history
 */
semanticSearchRouter.get('/search/suggestions', asyncHandler(async (req: Request, res: Response) => {
  const { campaignId, limit } = req.query;
  
  if (!campaignId) {
    return res.status(400).json({ 
      error: 'campaignId is required' 
    });
  }
  
  try {
    // Get recent popular entities and action types for suggestions
    const recentMessages = await conversationStorage.getMessages({
      campaignId: parseInt(campaignId as string),
      limit: 100
    });
    
    // Generate suggestions based on message patterns
    const entityCounts = new Map<string, number>();
    const actionTypeCounts = new Map<string, number>();
    
    for (const message of recentMessages) {
      if (message.entities) {
        for (const entity of message.entities) {
          entityCounts.set(entity, (entityCounts.get(entity) || 0) + 1);
        }
      }
      
      if (message.actionType) {
        actionTypeCounts.set(message.actionType, (actionTypeCounts.get(message.actionType) || 0) + 1);
      }
    }
    
    // Create search suggestions
    const suggestions = [];
    
    // Top entities
    const topEntities = Array.from(entityCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([entity]) => ({
        type: 'entity',
        text: `Search for ${entity}`,
        query: entity,
        count: entityCounts.get(entity)
      }));
    
    // Top action types  
    const topActions = Array.from(actionTypeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([action]) => ({
        type: 'action',
        text: `Search ${action.replace('_', ' ')} activities`,
        query: action.replace('_', ' '),
        count: actionTypeCounts.get(action)
      }));
    
    // Common search patterns
    const commonPatterns = [
      { type: 'pattern', text: 'Recent trade opportunities', query: 'trade opportunities' },
      { type: 'pattern', text: 'Strategic planning discussions', query: 'strategy planning' },
      { type: 'pattern', text: 'Resource management advice', query: 'resource management' }
    ];
    
    suggestions.push(...topEntities, ...topActions, ...commonPatterns);
    
    res.json({
      success: true,
      campaignId: parseInt(campaignId as string),
      suggestions: suggestions.slice(0, parseInt(limit as string) || 10),
      generated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Suggestions failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate suggestions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * POST /api/memory/search/batch
 * Execute multiple searches in batch
 */
semanticSearchRouter.post('/search/batch', asyncHandler(async (req: Request, res: Response) => {
  const { searches } = req.body;
  
  if (!searches || !Array.isArray(searches) || searches.length === 0) {
    return res.status(400).json({
      error: 'searches must be a non-empty array of search queries'
    });
  }
  
  if (searches.length > 10) {
    return res.status(400).json({
      error: 'Maximum 10 searches allowed per batch'
    });
  }
  
  try {
    const startTime = Date.now();
    
    const results = await Promise.all(
      searches.map(async (searchQuery: SemanticSearchQuery, index: number) => {
        try {
          // Validate each search query
          if (!searchQuery.query || typeof searchQuery.query !== 'string') {
            return {
              index,
              success: false,
              error: 'Query is required and must be a string'
            };
          }
          
          const response = await semanticSearchService.search(searchQuery);
          
          return {
            index,
            success: true,
            query: searchQuery.query,
            data: response
          };
          
        } catch (error) {
          return {
            index,
            success: false,
            query: searchQuery.query,
            error: error instanceof Error ? error.message : 'Search failed'
          };
        }
      })
    );
    
    const totalTime = Date.now() - startTime;
    const successCount = results.filter(r => r.success).length;
    
    res.json({
      success: true,
      results,
      meta: {
        totalSearches: searches.length,
        successCount,
        failedCount: searches.length - successCount,
        totalTime,
        averageTimePerSearch: Math.round(totalTime / searches.length)
      }
    });
    
  } catch (error) {
    console.error('Batch search failed:', error);
    res.status(500).json({
      success: false,
      error: 'Batch search failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * Error handling middleware for semantic search routes
 */
semanticSearchRouter.use((error: any, req: Request, res: Response, next: Function) => {
  console.error('Semantic Search API error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.message
    });
  }
  
  if (error.message && error.message.includes('not found')) {
    return res.status(404).json({
      success: false,
      error: 'Resource not found',
      details: error.message
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

export default semanticSearchRouter;
