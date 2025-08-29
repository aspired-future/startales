import express, { Request, Response } from 'express';
import { aiContextService, MemoryContext, AIContextOptions, MemorySearchConfig } from './aiContextService';

export const aiContextRouter = express.Router();

// Middleware for error handling
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: Function) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation middleware
const validateMemoryRequest = (req: Request, res: Response, next: Function) => {
  const { prompt, campaignId } = req.body;
  
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Prompt is required and must be a non-empty string' 
    });
  }
  
  if (!campaignId || typeof campaignId !== 'number') {
    return res.status(400).json({ 
      error: 'Campaign ID is required and must be a number' 
    });
  }
  
  next();
};

/**
 * POST /api/memory/ai/generate
 * Generate memory-enhanced AI response with full configuration
 */
aiContextRouter.post('/ai/generate', validateMemoryRequest, asyncHandler(async (req: Request, res: Response) => {
  const { 
    prompt, 
    campaignId, 
    conversationId, 
    entities, 
    actionType, 
    gameState, 
    userId, 
    sessionId,
    
    // AI options
    provider,
    model,
    maxTokens,
    temperature,
    systemPrompt,
    
    // Context configuration
    contextConfig
  } = req.body;
  
  try {
    const memoryContext: MemoryContext = {
      campaignId,
      conversationId,
      entities,
      actionType,
      gameState,
      userId,
      sessionId
    };
    
    const aiOptions: AIContextOptions = {
      provider,
      model,
      maxTokens,
      temperature,
      systemPrompt,
      contextConfig
    };
    
    const response = await aiContextService.generateWithMemory(
      prompt,
      memoryContext,
      aiOptions
    );
    
    res.json({
      success: true,
      data: response,
      meta: {
        memoryUsed: response.contextUsed.messagesFound > 0,
        contextMessages: response.contextUsed.messagesFound,
        searchTime: response.contextUsed.searchTime,
        estimatedTokens: response.usage?.totalTokens
      }
    });
    
  } catch (error) {
    console.error('Memory-enhanced AI generation failed:', error);
    res.status(500).json({
      success: false,
      error: 'AI generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * POST /api/memory/ai/quick
 * Quick memory-enhanced response with minimal configuration
 */
aiContextRouter.post('/ai/quick', validateMemoryRequest, asyncHandler(async (req: Request, res: Response) => {
  const { prompt, campaignId, conversationId, entities, actionType, maxContext } = req.body;
  
  try {
    const response = await aiContextService.quickResponseWithMemory(
      prompt,
      campaignId,
      {
        conversationId,
        entities,
        actionType,
        maxContext
      }
    );
    
    res.json({
      success: true,
      prompt,
      response,
      campaignId,
      withMemory: true
    });
    
  } catch (error) {
    console.error('Quick memory response failed:', error);
    res.status(500).json({
      success: false,
      error: 'Quick response failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * POST /api/memory/ai/conversation
 * Generate response within conversation context
 */
aiContextRouter.post('/ai/conversation', asyncHandler(async (req: Request, res: Response) => {
  const { prompt, conversationId, campaignId, provider, model, maxTokens, temperature } = req.body;
  
  if (!prompt || !conversationId || !campaignId) {
    return res.status(400).json({ 
      error: 'prompt, conversationId, and campaignId are required' 
    });
  }
  
  try {
    const response = await aiContextService.conversationResponse(
      prompt,
      conversationId,
      campaignId,
      {
        provider,
        model,
        maxTokens,
        temperature
      }
    );
    
    res.json({
      success: true,
      conversationId,
      data: response,
      meta: {
        continuityMaintained: true,
        contextMessages: response.contextUsed.messagesFound,
        relevantEntities: response.contextUsed.relevantMessages
          .flatMap(msg => msg.entities || [])
          .filter((e, i, arr) => arr.indexOf(e) === i)
          .slice(0, 10)
      }
    });
    
  } catch (error) {
    console.error('Conversation response failed:', error);
    res.status(500).json({
      success: false,
      error: 'Conversation response failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * POST /api/memory/ai/compare-responses
 * Compare memory-enhanced vs standard AI responses
 */
aiContextRouter.post('/ai/compare-responses', validateMemoryRequest, asyncHandler(async (req: Request, res: Response) => {
  const { prompt, campaignId, conversationId, entities, actionType, provider, model } = req.body;
  
  try {
    const memoryContext: MemoryContext = {
      campaignId,
      conversationId,
      entities,
      actionType
    };
    
    const aiOptions: AIContextOptions = {
      provider,
      model,
      maxTokens: 300,
      temperature: 0.7
    };
    
    // Generate both responses in parallel
    const [memoryResponse, standardResponse] = await Promise.all([
      // Memory-enhanced response
      aiContextService.generateWithMemory(prompt, memoryContext, aiOptions),
      
      // Standard response (no memory context)
      aiContextService.generateWithMemory(prompt, memoryContext, {
        ...aiOptions,
        contextConfig: { maxContextMessages: 0 } // Disable memory
      })
    ]);
    
    res.json({
      success: true,
      comparison: {
        prompt,
        memoryEnhanced: {
          response: memoryResponse.response,
          contextUsed: memoryResponse.contextUsed.messagesFound,
          relevantMessages: memoryResponse.contextUsed.relevantMessages.length,
          enhancedPromptLength: memoryResponse.enhancedPrompt.length
        },
        standard: {
          response: standardResponse.response,
          contextUsed: 0,
          enhancedPromptLength: standardResponse.originalPrompt.length
        }
      },
      analysis: {
        memoryImpact: memoryResponse.contextUsed.messagesFound > 0,
        responseLengthDiff: memoryResponse.response.length - standardResponse.response.length,
        contextMessages: memoryResponse.contextUsed.relevantMessages.map(msg => ({
          role: msg.role,
          entities: msg.entities,
          score: msg.score
        }))
      }
    });
    
  } catch (error) {
    console.error('Response comparison failed:', error);
    res.status(500).json({
      success: false,
      error: 'Comparison failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * POST /api/memory/ai/entity-aware
 * Generate response with specific entity focus and boosting
 */
aiContextRouter.post('/ai/entity-aware', validateMemoryRequest, asyncHandler(async (req: Request, res: Response) => {
  const { prompt, campaignId, entities, boostFactors, maxContext } = req.body;
  
  if (!entities || !Array.isArray(entities) || entities.length === 0) {
    return res.status(400).json({ 
      error: 'entities array is required and must not be empty' 
    });
  }
  
  try {
    const memoryContext: MemoryContext = {
      campaignId,
      entities
    };
    
    // Create entity-specific boost configuration
    const entityBoosts: Record<string, number> = {};
    if (boostFactors && typeof boostFactors === 'object') {
      Object.assign(entityBoosts, boostFactors);
    } else {
      // Default boost for provided entities
      entities.forEach((entity: string) => {
        entityBoosts[entity] = 1.5;
      });
    }
    
    const contextConfig: MemorySearchConfig = {
      maxContextMessages: maxContext || 10,
      minRelevanceScore: 0.5,
      includeEntities: true,
      boostRecency: true
    };
    
    const aiOptions: AIContextOptions = {
      contextConfig,
      systemPrompt: `You are an expert assistant specializing in ${entities.join(', ')}. Focus your response on these key areas and reference relevant historical context when available.`
    };
    
    const response = await aiContextService.generateWithMemory(
      prompt,
      memoryContext,
      aiOptions
    );
    
    res.json({
      success: true,
      focusEntities: entities,
      data: response,
      meta: {
        entitySpecificContext: response.contextUsed.relevantMessages.filter(
          msg => msg.entities?.some(e => entities.includes(e))
        ).length,
        boostsApplied: Object.keys(entityBoosts).length
      }
    });
    
  } catch (error) {
    console.error('Entity-aware response failed:', error);
    res.status(500).json({
      success: false,
      error: 'Entity-aware response failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * POST /api/memory/ai/game-aware
 * Generate response with game state integration
 */
aiContextRouter.post('/ai/game-aware', validateMemoryRequest, asyncHandler(async (req: Request, res: Response) => {
  const { prompt, campaignId, gameState, conversationId, actionType } = req.body;
  
  if (!gameState || typeof gameState !== 'object') {
    return res.status(400).json({ 
      error: 'gameState object is required' 
    });
  }
  
  try {
    const memoryContext: MemoryContext = {
      campaignId,
      conversationId,
      gameState,
      actionType
    };
    
    const contextConfig: MemorySearchConfig = {
      maxContextMessages: 8,
      includeGameState: true,
      includeEntities: true,
      boostRecency: true,
      minRelevanceScore: 0.4
    };
    
    const gameStateDescription = Object.entries(gameState)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ');
    
    const aiOptions: AIContextOptions = {
      contextConfig,
      systemPrompt: `You are an AI advisor for a space empire game. The player's current game state includes: ${gameStateDescription}. Provide advice that considers both their current situation and relevant conversation history.`
    };
    
    const response = await aiContextService.generateWithMemory(
      prompt,
      memoryContext,
      aiOptions
    );
    
    res.json({
      success: true,
      gameState,
      data: response,
      meta: {
        gameStateIntegrated: true,
        contextualAdvice: response.contextUsed.messagesFound > 0,
        gameStateKeys: Object.keys(gameState).length
      }
    });
    
  } catch (error) {
    console.error('Game-aware response failed:', error);
    res.status(500).json({
      success: false,
      error: 'Game-aware response failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * GET /api/memory/ai/stats
 * Get AI context service statistics and capabilities
 */
aiContextRouter.get('/ai/stats', asyncHandler(async (req: Request, res: Response) => {
  try {
    const stats = aiContextService.getStats();
    
    res.json({
      success: true,
      stats,
      endpoints: [
        'POST /ai/generate - Full memory-enhanced AI generation',
        'POST /ai/quick - Quick memory-enhanced responses', 
        'POST /ai/conversation - Conversation-aware responses',
        'POST /ai/compare-responses - Compare memory vs standard responses',
        'POST /ai/entity-aware - Entity-focused responses',
        'POST /ai/game-aware - Game state integrated responses'
      ]
    });
    
  } catch (error) {
    console.error('Stats retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Stats retrieval failed'
    });
  }
}));

/**
 * POST /api/memory/ai/batch
 * Process multiple AI requests with memory context
 */
aiContextRouter.post('/ai/batch', asyncHandler(async (req: Request, res: Response) => {
  const { requests } = req.body;
  
  if (!requests || !Array.isArray(requests) || requests.length === 0) {
    return res.status(400).json({
      error: 'requests must be a non-empty array'
    });
  }
  
  if (requests.length > 5) {
    return res.status(400).json({
      error: 'Maximum 5 requests allowed per batch'
    });
  }
  
  try {
    const startTime = Date.now();
    
    const results = await Promise.all(
      requests.map(async (request: any, index: number) => {
        try {
          if (!request.prompt || !request.campaignId) {
            return {
              index,
              success: false,
              error: 'prompt and campaignId are required'
            };
          }
          
          const response = await aiContextService.quickResponseWithMemory(
            request.prompt,
            request.campaignId,
            {
              conversationId: request.conversationId,
              entities: request.entities,
              actionType: request.actionType,
              maxContext: request.maxContext || 3
            }
          );
          
          return {
            index,
            success: true,
            prompt: request.prompt,
            response,
            campaignId: request.campaignId
          };
          
        } catch (error) {
          return {
            index,
            success: false,
            prompt: request.prompt,
            error: error instanceof Error ? error.message : 'Generation failed'
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
        totalRequests: requests.length,
        successCount,
        failedCount: requests.length - successCount,
        totalTime,
        averageTimePerRequest: Math.round(totalTime / requests.length)
      }
    });
    
  } catch (error) {
    console.error('Batch AI processing failed:', error);
    res.status(500).json({
      success: false,
      error: 'Batch processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * Error handling middleware for AI context routes
 */
aiContextRouter.use((error: any, req: Request, res: Response, next: Function) => {
  console.error('AI Context API error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.message
    });
  }
  
  if (error.message && error.message.includes('not available')) {
    return res.status(503).json({
      success: false,
      error: 'AI service unavailable',
      details: error.message
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

export default aiContextRouter;
