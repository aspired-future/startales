/**
 * News Generation System API Routes
 * 
 * REST API endpoints for the Dynamic News Generation System,
 * providing news generation, outlet management, and analytics.
 */

import { Router, Request, Response } from 'express';
import { newsEngine } from './NewsEngine';
import { 
  NewsGenerationRequest, 
  NewsSearchQuery,
  NewsOutlet,
  NewsArticle,
  NewsAPIResponse,
  PaginatedNewsResponse
} from './types';
import { db } from '../storage/db';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = Router();

// Enhanced AI Knobs for News Generation System
const newsKnobsData = {
  // Content Generation
  article_generation_frequency: 0.7,    // Frequency of news article generation
  breaking_news_threshold: 0.8,         // Threshold for breaking news classification
  story_depth_level: 0.6,               // Depth and detail level of stories
  
  // Editorial Control
  editorial_bias_neutrality: 0.7,       // Editorial bias control (higher = more neutral)
  fact_checking_rigor: 0.8,             // Fact-checking process rigor
  source_verification_level: 0.9,       // Source verification requirements
  
  // Content Diversity
  perspective_diversity: 0.8,           // Diversity of perspectives in coverage
  topic_coverage_breadth: 0.7,          // Breadth of topic coverage
  local_vs_galactic_balance: 0.6,       // Balance between local and galactic news
  
  // Media Outlet Management
  outlet_credibility_standards: 0.8,    // Credibility standards for outlets
  sensationalism_tolerance: 0.3,        // Tolerance for sensationalized content
  investigative_journalism_support: 0.7, // Support for investigative journalism
  
  // Information Flow
  news_circulation_speed: 0.8,          // Speed of news circulation
  information_transparency: 0.7,        // Information transparency level
  government_information_access: 0.6,   // Government information access level
  
  // Public Impact
  public_opinion_influence: 0.6,        // News influence on public opinion
  social_media_integration: 0.7,        // Integration with social media platforms
  citizen_journalism_recognition: 0.5,  // Recognition of citizen journalism
  
  // Crisis Communication
  emergency_broadcast_readiness: 0.9,   // Emergency broadcast system readiness
  misinformation_countermeasures: 0.8,  // Misinformation prevention measures
  crisis_communication_protocols: 0.8,  // Crisis communication effectiveness
  
  // Technology & Innovation
  ai_content_generation: 0.4,           // AI-assisted content generation level
  real_time_reporting_capability: 0.8,  // Real-time reporting capabilities
  multimedia_content_richness: 0.7,     // Multimedia content integration
  
  // Regulatory Environment
  press_freedom_level: 0.8,             // Press freedom and independence
  censorship_resistance: 0.7,           // Resistance to censorship
  journalist_protection_measures: 0.9,  // Journalist safety and protection
  
  // Audience Engagement
  audience_feedback_integration: 0.6,   // Audience feedback incorporation
  interactive_content_level: 0.5,       // Interactive content features
  community_engagement_focus: 0.7,      // Community engagement emphasis
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for News
const newsKnobSystem = new EnhancedKnobSystem(newsKnobsData);

// Apply news knobs to game state
function applyNewsKnobsToGameState() {
  const knobs = newsKnobSystem.knobs;
  
  // Apply content generation settings
  const contentQuality = (knobs.article_generation_frequency + knobs.story_depth_level + 
    knobs.breaking_news_threshold) / 3;
  
  // Apply editorial control settings
  const editorialIntegrity = (knobs.editorial_bias_neutrality + knobs.fact_checking_rigor + 
    knobs.source_verification_level) / 3;
  
  // Apply content diversity settings
  const contentDiversity = (knobs.perspective_diversity + knobs.topic_coverage_breadth + 
    knobs.local_vs_galactic_balance) / 3;
  
  // Apply media outlet management settings
  const mediaStandards = (knobs.outlet_credibility_standards + knobs.investigative_journalism_support + 
    (1 - knobs.sensationalism_tolerance)) / 3;
  
  // Apply information flow settings
  const informationFlow = (knobs.news_circulation_speed + knobs.information_transparency + 
    knobs.government_information_access) / 3;
  
  // Apply crisis communication settings
  const crisisCommunication = (knobs.emergency_broadcast_readiness + knobs.misinformation_countermeasures + 
    knobs.crisis_communication_protocols) / 3;
  
  console.log('Applied news knobs to game state:', {
    contentQuality,
    editorialIntegrity,
    contentDiversity,
    mediaStandards,
    informationFlow,
    crisisCommunication
  });
}

/**
 * Generate news articles based on simulation results
 * POST /api/news/generate
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const request: NewsGenerationRequest = {
      campaignId: req.body.campaignId || 1,
      tickId: req.body.tickId || 1,
      scope: req.body.scope || ['civilization', 'galactic'],
      categories: req.body.categories || ['politics', 'economy', 'military', 'technology', 'social'],
      maxArticles: req.body.maxArticles || 10,
      
      simulationResults: req.body.simulationResults,
      recentEvents: req.body.recentEvents,
      civilizationMemory: req.body.civilizationMemory,
      aiAnalysisMemory: req.body.aiAnalysisMemory,
      
      includeBreaking: req.body.includeBreaking !== false,
      perspectiveDiversity: req.body.perspectiveDiversity !== false,
      factualVariation: req.body.factualVariation !== false,
      
      minPriority: req.body.minPriority,
      targetOutlets: req.body.targetOutlets,
      excludeCategories: req.body.excludeCategories
    };

    const result = await newsEngine.generateNews(request);
    
    // Store generated articles in database
    if (result.success && result.articles.length > 0) {
      await storeArticles(result.articles);
    }

    const response: NewsAPIResponse = {
      success: result.success,
      data: result,
      message: result.success 
        ? `Generated ${result.articlesGenerated} news articles`
        : 'Failed to generate news articles',
      timestamp: new Date()
    };

    res.status(result.success ? 200 : 500).json(response);
  } catch (error) {
    console.error('Error generating news:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during news generation',
      message: 'Failed to generate news articles',
      timestamp: new Date()
    });
  }
});

/**
 * Get news articles with filtering and pagination
 * GET /api/news/articles
 */
router.get('/articles', async (req: Request, res: Response) => {
  try {
    const query: NewsSearchQuery = {
      query: req.query.q as string,
      categories: req.query.categories ? (req.query.categories as string).split(',') as any[] : undefined,
      scopes: req.query.scopes ? (req.query.scopes as string).split(',') as any[] : undefined,
      priorities: req.query.priorities ? (req.query.priorities as string).split(',') as any[] : undefined,
      outletIds: req.query.outletIds ? (req.query.outletIds as string).split(',') : undefined,
      
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      tickRange: req.query.tickStart && req.query.tickEnd ? {
        start: parseInt(req.query.tickStart as string),
        end: parseInt(req.query.tickEnd as string)
      } : undefined,
      
      minCredibility: req.query.minCredibility ? parseFloat(req.query.minCredibility as string) : undefined,
      minReach: req.query.minReach ? parseFloat(req.query.minReach as string) : undefined,
      maxSensationalism: req.query.maxSensationalism ? parseFloat(req.query.maxSensationalism as string) : undefined,
      
      sortBy: (req.query.sortBy as any) || 'date',
      sortOrder: (req.query.sortOrder as any) || 'desc',
      
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };

    const result = await searchArticles(query);

    const response: PaginatedNewsResponse<NewsArticle> = {
      success: true,
      data: result.articles,
      pagination: result.pagination,
      filters: {
        category: query.categories?.[0] as any,
        scope: query.scopes?.[0] as any,
        priority: query.priorities?.[0] as any,
        outletId: query.outletIds?.[0],
        dateRange: query.startDate && query.endDate ? {
          start: query.startDate,
          end: query.endDate
        } : undefined
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during article search',
      message: 'Failed to search articles',
      timestamp: new Date()
    });
  }
});

/**
 * Get a specific news article by ID
 * GET /api/news/articles/:id
 */
router.get('/articles/:id', async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    const article = await getArticleById(articleId);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found',
        message: `No article found with ID: ${articleId}`,
        timestamp: new Date()
      });
    }

    const response: NewsAPIResponse<NewsArticle> = {
      success: true,
      data: article,
      message: 'Article retrieved successfully',
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting article:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve article',
      timestamp: new Date()
    });
  }
});

/**
 * Get all news outlets
 * GET /api/news/outlets
 */
router.get('/outlets', async (req: Request, res: Response) => {
  try {
    const outlets = newsEngine.getOutlets();

    const response: NewsAPIResponse<NewsOutlet[]> = {
      success: true,
      data: outlets,
      message: `Retrieved ${outlets.length} news outlets`,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting outlets:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve outlets',
      timestamp: new Date()
    });
  }
});

/**
 * Get a specific news outlet by ID
 * GET /api/news/outlets/:id
 */
router.get('/outlets/:id', async (req: Request, res: Response) => {
  try {
    const outletId = req.params.id;
    const outlet = newsEngine.getOutlet(outletId);

    if (!outlet) {
      return res.status(404).json({
        success: false,
        error: 'Outlet not found',
        message: `No outlet found with ID: ${outletId}`,
        timestamp: new Date()
      });
    }

    const response: NewsAPIResponse<NewsOutlet> = {
      success: true,
      data: outlet,
      message: 'Outlet retrieved successfully',
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting outlet:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve outlet',
      timestamp: new Date()
    });
  }
});

/**
 * Create or update a news outlet
 * POST /api/news/outlets
 */
router.post('/outlets', async (req: Request, res: Response) => {
  try {
    const outlet: NewsOutlet = req.body;
    
    // Validate required fields
    if (!outlet.id || !outlet.name || !outlet.type || !outlet.civilizationId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Outlet must have id, name, type, and civilizationId',
        timestamp: new Date()
      });
    }

    newsEngine.setOutlet(outlet);

    const response: NewsAPIResponse<NewsOutlet> = {
      success: true,
      data: outlet,
      message: 'Outlet created/updated successfully',
      timestamp: new Date()
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating/updating outlet:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create/update outlet',
      timestamp: new Date()
    });
  }
});

/**
 * Delete a news outlet
 * DELETE /api/news/outlets/:id
 */
router.delete('/outlets/:id', async (req: Request, res: Response) => {
  try {
    const outletId = req.params.id;
    const deleted = newsEngine.removeOutlet(outletId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Outlet not found',
        message: `No outlet found with ID: ${outletId}`,
        timestamp: new Date()
      });
    }

    const response: NewsAPIResponse = {
      success: true,
      message: 'Outlet deleted successfully',
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting outlet:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete outlet',
      timestamp: new Date()
    });
  }
});

/**
 * Get news analytics for a campaign/tick
 * GET /api/news/analytics
 */
router.get('/analytics', async (req: Request, res: Response) => {
  try {
    const campaignId = req.query.campaignId ? parseInt(req.query.campaignId as string) : 1;
    const tickId = req.query.tickId ? parseInt(req.query.tickId as string) : undefined;

    const analytics = await getNewsAnalytics(campaignId, tickId);

    const response: NewsAPIResponse = {
      success: true,
      data: analytics,
      message: 'Analytics retrieved successfully',
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve analytics',
      timestamp: new Date()
    });
  }
});

/**
 * Get trending topics and narratives
 * GET /api/news/trends
 */
router.get('/trends', async (req: Request, res: Response) => {
  try {
    const campaignId = req.query.campaignId ? parseInt(req.query.campaignId as string) : 1;
    const timeframe = req.query.timeframe as string || '24h';

    const trends = await getTrendingTopics(campaignId, timeframe);

    const response: NewsAPIResponse = {
      success: true,
      data: trends,
      message: 'Trends retrieved successfully',
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting trends:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve trends',
      timestamp: new Date()
    });
  }
});

/**
 * Generate breaking news for urgent events
 * POST /api/news/breaking
 */
router.post('/breaking', async (req: Request, res: Response) => {
  try {
    const breakingRequest: NewsGenerationRequest = {
      ...req.body,
      includeBreaking: true,
      maxArticles: req.body.maxArticles || 5,
      minPriority: 'urgent'
    };

    const result = await newsEngine.generateNews(breakingRequest);
    
    if (result.success && result.articles.length > 0) {
      await storeArticles(result.articles);
    }

    const response: NewsAPIResponse = {
      success: result.success,
      data: result,
      message: result.success 
        ? `Generated ${result.articlesGenerated} breaking news articles`
        : 'Failed to generate breaking news',
      timestamp: new Date()
    };

    res.status(result.success ? 200 : 500).json(response);
  } catch (error) {
    console.error('Error generating breaking news:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to generate breaking news',
      timestamp: new Date()
    });
  }
});

/**
 * Get news feed for a specific configuration
 * GET /api/news/feed/:feedId
 */
router.get('/feed/:feedId', async (req: Request, res: Response) => {
  try {
    const feedId = req.params.feedId;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const feed = await getNewsFeed(feedId, page, limit);

    if (!feed) {
      return res.status(404).json({
        success: false,
        error: 'Feed not found',
        message: `No feed found with ID: ${feedId}`,
        timestamp: new Date()
      });
    }

    const response: PaginatedNewsResponse<NewsArticle> = {
      success: true,
      data: feed.articles,
      pagination: feed.pagination
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting news feed:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve news feed',
      timestamp: new Date()
    });
  }
});

// Helper Functions

/**
 * Store articles in the database
 */
async function storeArticles(articles: NewsArticle[]): Promise<void> {
  try {
    const query = `
      INSERT INTO news_articles (
        id, headline, subheadline, content, summary, category, scope, priority,
        outlet_id, outlet_name, source_events, related_entities, factual_accuracy,
        estimated_reach, public_reaction, published_at, tick_id, campaign_id,
        tags, generation_context, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      ON CONFLICT (id) DO UPDATE SET
        headline = EXCLUDED.headline,
        content = EXCLUDED.content,
        updated_at = now()
    `;

    for (const article of articles) {
      await db.query(query, [
        article.id,
        article.headline,
        article.subheadline || null,
        article.content,
        article.summary,
        article.category,
        article.scope,
        article.priority,
        article.outletId,
        article.outletName,
        JSON.stringify(article.sourceEvents),
        JSON.stringify(article.relatedEntities),
        article.factualAccuracy,
        article.estimatedReach,
        JSON.stringify(article.publicReaction),
        article.publishedAt,
        article.tickId,
        article.campaignId,
        JSON.stringify(article.tags),
        JSON.stringify(article.generationContext),
        new Date()
      ]);
    }
  } catch (error) {
    console.error('Error storing articles:', error);
    throw error;
  }
}

/**
 * Search articles with filtering and pagination
 */
async function searchArticles(query: NewsSearchQuery): Promise<{
  articles: NewsArticle[];
  pagination: any;
}> {
  try {
    let whereConditions: string[] = [];
    let queryParams: any[] = [];
    let paramIndex = 1;

    // Build WHERE conditions
    if (query.categories && query.categories.length > 0) {
      whereConditions.push(`category = ANY($${paramIndex})`);
      queryParams.push(query.categories);
      paramIndex++;
    }

    if (query.scopes && query.scopes.length > 0) {
      whereConditions.push(`scope = ANY($${paramIndex})`);
      queryParams.push(query.scopes);
      paramIndex++;
    }

    if (query.priorities && query.priorities.length > 0) {
      whereConditions.push(`priority = ANY($${paramIndex})`);
      queryParams.push(query.priorities);
      paramIndex++;
    }

    if (query.outletIds && query.outletIds.length > 0) {
      whereConditions.push(`outlet_id = ANY($${paramIndex})`);
      queryParams.push(query.outletIds);
      paramIndex++;
    }

    if (query.startDate) {
      whereConditions.push(`published_at >= $${paramIndex}`);
      queryParams.push(query.startDate);
      paramIndex++;
    }

    if (query.endDate) {
      whereConditions.push(`published_at <= $${paramIndex}`);
      queryParams.push(query.endDate);
      paramIndex++;
    }

    if (query.tickRange) {
      whereConditions.push(`tick_id >= $${paramIndex} AND tick_id <= $${paramIndex + 1}`);
      queryParams.push(query.tickRange.start, query.tickRange.end);
      paramIndex += 2;
    }

    if (query.minCredibility) {
      whereConditions.push(`factual_accuracy >= $${paramIndex}`);
      queryParams.push(query.minCredibility);
      paramIndex++;
    }

    if (query.query) {
      whereConditions.push(`(headline ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`);
      queryParams.push(`%${query.query}%`);
      paramIndex++;
    }

    // Build ORDER BY clause
    const sortBy = query.sortBy || 'published_at';
    const sortOrder = query.sortOrder || 'desc';
    const orderBy = `ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    // Build final query
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const countQuery = `SELECT COUNT(*) FROM news_articles ${whereClause}`;
    const dataQuery = `
      SELECT * FROM news_articles 
      ${whereClause} 
      ${orderBy} 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    // Execute queries
    const countResult = await db.query(countQuery, queryParams.slice(0, -2));
    const dataResult = await db.query(dataQuery, queryParams);

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    return {
      articles: dataResult.rows.map(row => ({
        id: row.id,
        headline: row.headline,
        subheadline: row.subheadline,
        content: row.content,
        summary: row.summary,
        category: row.category,
        scope: row.scope,
        priority: row.priority,
        outletId: row.outlet_id,
        outletName: row.outlet_name,
        outletPerspective: {}, // Would need to join with outlets table
        sourceEvents: JSON.parse(row.source_events || '[]'),
        relatedEntities: JSON.parse(row.related_entities || '[]'),
        factualAccuracy: row.factual_accuracy,
        estimatedReach: row.estimated_reach,
        publicReaction: JSON.parse(row.public_reaction || '{}'),
        publishedAt: row.published_at,
        tickId: row.tick_id,
        campaignId: row.campaign_id,
        tags: JSON.parse(row.tags || '[]'),
        generationContext: JSON.parse(row.generation_context || '{}')
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    };
  } catch (error) {
    console.error('Error searching articles:', error);
    throw error;
  }
}

/**
 * Get article by ID
 */
async function getArticleById(id: string): Promise<NewsArticle | null> {
  try {
    const result = await db.query('SELECT * FROM news_articles WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      headline: row.headline,
      subheadline: row.subheadline,
      content: row.content,
      summary: row.summary,
      category: row.category,
      scope: row.scope,
      priority: row.priority,
      outletId: row.outlet_id,
      outletName: row.outlet_name,
      outletPerspective: {}, // Would need to join with outlets table
      sourceEvents: JSON.parse(row.source_events || '[]'),
      relatedEntities: JSON.parse(row.related_entities || '[]'),
      factualAccuracy: row.factual_accuracy,
      estimatedReach: row.estimated_reach,
      publicReaction: JSON.parse(row.public_reaction || '{}'),
      publishedAt: row.published_at,
      tickId: row.tick_id,
      campaignId: row.campaign_id,
      tags: JSON.parse(row.tags || '[]'),
      generationContext: JSON.parse(row.generation_context || '{}')
    };
  } catch (error) {
    console.error('Error getting article by ID:', error);
    throw error;
  }
}

/**
 * Get news analytics
 */
async function getNewsAnalytics(campaignId: number, tickId?: number): Promise<any> {
  try {
    let whereClause = 'WHERE campaign_id = $1';
    let queryParams = [campaignId];
    
    if (tickId) {
      whereClause += ' AND tick_id = $2';
      queryParams.push(tickId);
    }

    const query = `
      SELECT 
        COUNT(*) as total_articles,
        AVG(factual_accuracy) as avg_accuracy,
        AVG(estimated_reach) as avg_reach,
        category,
        scope,
        priority,
        outlet_id
      FROM news_articles 
      ${whereClause}
      GROUP BY category, scope, priority, outlet_id
    `;

    const result = await db.query(query, queryParams);
    
    return {
      totalArticles: result.rows.reduce((sum, row) => sum + parseInt(row.total_articles), 0),
      averageAccuracy: result.rows.reduce((sum, row) => sum + parseFloat(row.avg_accuracy), 0) / result.rows.length,
      averageReach: result.rows.reduce((sum, row) => sum + parseFloat(row.avg_reach), 0) / result.rows.length,
      breakdown: result.rows
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  }
}

/**
 * Get trending topics
 */
async function getTrendingTopics(campaignId: number, timeframe: string): Promise<any> {
  try {
    // Simple implementation - could be enhanced with more sophisticated analysis
    const query = `
      SELECT 
        unnest(tags) as tag,
        COUNT(*) as frequency,
        AVG(estimated_reach) as avg_reach
      FROM news_articles 
      WHERE campaign_id = $1 
        AND published_at >= NOW() - INTERVAL '${timeframe === '24h' ? '1 day' : '7 days'}'
      GROUP BY tag
      ORDER BY frequency DESC, avg_reach DESC
      LIMIT 10
    `;

    const result = await db.query(query, [campaignId]);
    
    return {
      timeframe,
      trendingTopics: result.rows.map(row => ({
        topic: row.tag,
        frequency: parseInt(row.frequency),
        averageReach: parseFloat(row.avg_reach)
      }))
    };
  } catch (error) {
    console.error('Error getting trending topics:', error);
    throw error;
  }
}

/**
 * Get news feed
 */
async function getNewsFeed(feedId: string, page: number, limit: number): Promise<any> {
  // Simplified implementation - would normally load feed configuration from database
  const query: NewsSearchQuery = {
    page,
    limit,
    sortBy: 'published_at',
    sortOrder: 'desc'
  };

  return await searchArticles(query);
}

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'news', newsKnobSystem, applyNewsKnobsToGameState);

export default router;
