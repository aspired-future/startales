import express, { Request, Response } from 'express';
import { memoryAdminService, ConversationManagementOptions } from './memoryAdminService.js';

export const adminRouter = express.Router();

// Middleware for error handling
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: Function) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Simple admin authentication middleware (in production, use proper auth)
const requireAuth = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  
  // Simple token check - in production, use proper JWT/OAuth
  if (authHeader !== 'Bearer admin-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

/**
 * GET /api/memory/admin/health
 * Get comprehensive system health report
 */
adminRouter.get('/admin/health', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const healthReport = await memoryAdminService.getSystemHealth();
    
    res.json({
      success: true,
      data: healthReport
    });
    
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * GET /api/memory/admin/analytics
 * Get comprehensive memory analytics and statistics
 */
adminRouter.get('/admin/analytics', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const analytics = await memoryAdminService.getMemoryAnalytics();
    
    res.json({
      success: true,
      data: analytics,
      generated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Analytics generation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Analytics generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * GET /api/memory/admin/conversations
 * Get conversations with management metadata
 */
adminRouter.get('/admin/conversations', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const {
      campaignIds,
      entities,
      actionTypes,
      minMessages,
      maxMessages,
      hasVectors,
      archived,
      limit = 25,
      offset = 0
    } = req.query;

    const options: ConversationManagementOptions = {};
    
    if (campaignIds) {
      options.campaignIds = (campaignIds as string).split(',').map(id => parseInt(id));
    }
    
    if (entities) {
      options.entities = (entities as string).split(',');
    }
    
    if (actionTypes) {
      options.actionTypes = (actionTypes as string).split(',');
    }
    
    if (minMessages) {
      options.minMessageCount = parseInt(minMessages as string);
    }
    
    if (maxMessages) {
      options.maxMessageCount = parseInt(maxMessages as string);
    }
    
    if (hasVectors !== undefined) {
      options.hasVectorData = hasVectors === 'true';
    }
    
    if (archived !== undefined) {
      options.isArchived = archived === 'true';
    }

    const result = await memoryAdminService.manageConversations(
      options,
      parseInt(limit as string),
      parseInt(offset as string)
    );
    
    res.json({
      success: true,
      data: result.conversations,
      meta: {
        total: result.total,
        hasMore: result.hasMore,
        offset: parseInt(offset as string),
        limit: parseInt(limit as string)
      }
    });
    
  } catch (error) {
    console.error('Conversation management failed:', error);
    res.status(500).json({
      success: false,
      error: 'Conversation management failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * POST /api/memory/admin/conversations/bulk
 * Perform bulk operations on conversations
 */
adminRouter.post('/admin/conversations/bulk', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const { operation, conversationIds, options = {} } = req.body;
    
    if (!operation || !conversationIds || !Array.isArray(conversationIds)) {
      return res.status(400).json({
        error: 'operation and conversationIds array are required'
      });
    }
    
    if (!['archive', 'delete', 'reprocess', 'export'].includes(operation)) {
      return res.status(400).json({
        error: 'Invalid operation. Must be: archive, delete, reprocess, or export'
      });
    }
    
    const result = await memoryAdminService.bulkOperateConversations(
      operation,
      conversationIds,
      options
    );
    
    res.json({
      success: true,
      operation,
      data: result
    });
    
  } catch (error) {
    console.error('Bulk operation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Bulk operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * GET /api/memory/admin/vector-stats
 * Get detailed vector database statistics
 */
adminRouter.get('/admin/vector-stats', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const stats = await memoryAdminService.getVectorDatabaseStats();
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Vector stats retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Vector stats retrieval failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * POST /api/memory/admin/maintenance
 * Perform system maintenance operations
 */
adminRouter.post('/admin/maintenance', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const { operations } = req.body;
    
    if (!operations || !Array.isArray(operations)) {
      return res.status(400).json({
        error: 'operations array is required'
      });
    }
    
    const validOperations = [
      'cleanup_orphaned_vectors',
      'rebuild_missing_vectors', 
      'optimize_vector_storage',
      'cleanup_old_conversations',
      'refresh_statistics'
    ];
    
    const invalidOps = operations.filter(op => !validOperations.includes(op));
    if (invalidOps.length > 0) {
      return res.status(400).json({
        error: `Invalid operations: ${invalidOps.join(', ')}`,
        validOperations
      });
    }
    
    const results = await memoryAdminService.performMaintenance(operations);
    
    res.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Maintenance operation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Maintenance operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * POST /api/memory/admin/export
 * Export conversation data
 */
adminRouter.post('/admin/export', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const { conversationIds, format = 'json', includeVectors = false } = req.body;
    
    if (!conversationIds || !Array.isArray(conversationIds)) {
      return res.status(400).json({
        error: 'conversationIds array is required'
      });
    }
    
    if (!['json', 'csv', 'txt'].includes(format)) {
      return res.status(400).json({
        error: 'Invalid format. Must be: json, csv, or txt'
      });
    }
    
    const result = await memoryAdminService.exportConversations(
      conversationIds,
      format,
      includeVectors
    );
    
    // Set appropriate headers for file download
    res.set({
      'Content-Type': result.mimeType,
      'Content-Disposition': `attachment; filename="${result.filename}"`
    });
    
    res.send(result.data);
    
  } catch (error) {
    console.error('Export operation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Export operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * GET /api/memory/admin/config
 * Get current memory management configuration
 */
adminRouter.get('/admin/config', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const config = memoryAdminService.getConfiguration();
    
    res.json({
      success: true,
      data: config,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Config retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Config retrieval failed'
    });
  }
}));

/**
 * GET /api/memory/admin/dashboard
 * Get dashboard data (combines multiple endpoints for convenience)
 */
adminRouter.get('/admin/dashboard', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  try {
    const [health, analytics, vectorStats] = await Promise.all([
      memoryAdminService.getSystemHealth(),
      memoryAdminService.getMemoryAnalytics(),
      memoryAdminService.getVectorDatabaseStats()
    ]);
    
    const recentConversations = await memoryAdminService.manageConversations({}, 10, 0);
    
    res.json({
      success: true,
      dashboard: {
        health,
        analytics,
        vectorStats,
        recentConversations: recentConversations.conversations,
        lastUpdated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Dashboard data retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Dashboard data retrieval failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * GET /api/memory/admin/search-logs
 * Get recent search and AI generation logs (simulated)
 */
adminRouter.get('/admin/search-logs', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const { limit = 50, type = 'all' } = req.query;
  
  // Simulated logs - in production, these would come from actual log storage
  const logs = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      type: 'semantic_search',
      query: 'mining operations profit',
      campaignId: 1,
      resultsCount: 8,
      searchTime: 245,
      success: true
    },
    {
      id: '2', 
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      type: 'ai_generation',
      query: 'strategic expansion advice',
      campaignId: 1,
      contextMessages: 6,
      responseLength: 342,
      generationTime: 1850,
      success: true
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      type: 'embedding',
      operation: 'batch_embed',
      itemCount: 3,
      processingTime: 890,
      success: true
    }
  ];
  
  const filteredLogs = type === 'all' ? logs : logs.filter(log => log.type === type);
  
  res.json({
    success: true,
    data: filteredLogs.slice(0, parseInt(limit as string)),
    total: filteredLogs.length,
    types: ['all', 'semantic_search', 'ai_generation', 'embedding']
  });
}));

/**
 * Error handling middleware for admin routes
 */
adminRouter.use((error: any, req: Request, res: Response, next: Function) => {
  console.error('Admin API error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.message
    });
  }
  
  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      error: 'Service unavailable',
      details: 'Could not connect to required services'
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

export default adminRouter;
