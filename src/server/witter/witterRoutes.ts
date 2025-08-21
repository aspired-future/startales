/**
 * Witter API Routes (Galactic Twitter)
 * 
 * REST API endpoints for the Witter Social Network System
 * including posts, news, business updates, and social interactions.
 */

import express from 'express';
import { BusinessNewsService } from './BusinessNewsService.js';
import { SportsNewsService } from './SportsNewsService.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = express.Router();

// Enhanced AI Knobs for Witter Social Network System
const witterKnobsData = {
  // Content Generation & Quality
  content_generation_quality: 0.8,         // Content generation quality and post sophistication
  news_accuracy_standards: 0.9,            // News accuracy standards and fact-checking rigor
  content_diversity_promotion: 0.7,        // Content diversity promotion and varied perspectives
  
  // Social Engagement & Interaction
  user_engagement_facilitation: 0.8,       // User engagement facilitation and interaction promotion
  community_building_emphasis: 0.7,        // Community building emphasis and social cohesion
  viral_content_amplification: 0.6,        // Viral content amplification and trending mechanisms
  
  // Information Dissemination & News
  breaking_news_priority: 0.9,             // Breaking news priority and urgent information spread
  business_news_sophistication: 0.8,       // Business news sophistication and market analysis depth
  sports_coverage_comprehensiveness: 0.7,  // Sports coverage comprehensiveness and event reporting
  
  // Content Moderation & Safety
  content_moderation_strictness: 0.8,      // Content moderation strictness and safety enforcement
  misinformation_detection: 0.9,           // Misinformation detection and false information filtering
  harassment_prevention: 0.9,              // Harassment prevention and user protection
  
  // Algorithm & Feed Management
  algorithmic_feed_personalization: 0.7,   // Algorithmic feed personalization and content curation
  chronological_feed_preference: 0.6,      // Chronological feed preference vs algorithmic sorting
  echo_chamber_mitigation: 0.7,            // Echo chamber mitigation and diverse viewpoint exposure
  
  // Business & Market Integration
  market_sentiment_analysis: 0.8,          // Market sentiment analysis and financial impact tracking
  corporate_communication_facilitation: 0.7, // Corporate communication facilitation and business engagement
  advertising_integration_balance: 0.6,    // Advertising integration balance and user experience
  
  // Privacy & Data Protection
  user_privacy_protection: 0.9,            // User privacy protection and data security
  data_analytics_transparency: 0.8,        // Data analytics transparency and user awareness
  third_party_data_sharing_control: 0.8,   // Third-party data sharing control and user consent
  
  // Platform Innovation & Features
  feature_innovation_rate: 0.7,            // Feature innovation rate and platform evolution
  multimedia_content_support: 0.8,         // Multimedia content support and rich media integration
  real_time_communication_quality: 0.8,    // Real-time communication quality and instant messaging
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Witter
const witterKnobSystem = new EnhancedKnobSystem(witterKnobsData);

// Apply witter knobs to game state
function applyWitterKnobsToGameState() {
  const knobs = witterKnobSystem.knobs;
  
  // Apply content generation settings
  const contentGeneration = (knobs.content_generation_quality + knobs.news_accuracy_standards + 
    knobs.content_diversity_promotion) / 3;
  
  // Apply social engagement settings
  const socialEngagement = (knobs.user_engagement_facilitation + knobs.community_building_emphasis + 
    knobs.viral_content_amplification) / 3;
  
  // Apply information dissemination settings
  const informationDissemination = (knobs.breaking_news_priority + knobs.business_news_sophistication + 
    knobs.sports_coverage_comprehensiveness) / 3;
  
  // Apply content moderation settings
  const contentModeration = (knobs.content_moderation_strictness + knobs.misinformation_detection + 
    knobs.harassment_prevention) / 3;
  
  // Apply business integration settings
  const businessIntegration = (knobs.market_sentiment_analysis + knobs.corporate_communication_facilitation + 
    knobs.advertising_integration_balance) / 3;
  
  // Apply privacy protection settings
  const privacyProtection = (knobs.user_privacy_protection + knobs.data_analytics_transparency + 
    knobs.third_party_data_sharing_control) / 3;
  
  console.log('Applied witter knobs to game state:', {
    contentGeneration,
    socialEngagement,
    informationDissemination,
    contentModeration,
    businessIntegration,
    privacyProtection
  });
}

// Initialize services
let businessNewsService: BusinessNewsService;
let sportsNewsService: SportsNewsService;

// Service initialization function
export function initializeWitterServices(pool: any): void {
  businessNewsService = new BusinessNewsService(pool);
  sportsNewsService = new SportsNewsService(pool);
}

// ===== POSTS & CONTENT MANAGEMENT =====

/**
 * GET /api/witter/posts - Get witter posts
 */
router.get('/posts', async (req, res) => {
  try {
    const { 
      campaignId, 
      category, 
      limit = 50, 
      offset = 0,
      authorType,
      sortBy = 'timestamp'
    } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    // Get posts from appropriate service based on category
    let posts = [];
    if (category === 'business' || !category) {
      const businessPosts = await businessNewsService.getBusinessNewsPosts(
        Number(campaignId),
        Number(limit),
        Number(offset)
      );
      posts.push(...businessPosts);
    }

    if (category === 'sports' || !category) {
      const sportsPosts = await sportsNewsService.getSportsNewsPosts(
        Number(campaignId),
        Number(limit),
        Number(offset)
      );
      posts.push(...sportsPosts);
    }

    // Filter by author type if specified
    if (authorType) {
      posts = posts.filter(post => post.authorType === authorType);
    }

    // Sort posts
    posts.sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      if (sortBy === 'engagement') {
        const aEngagement = a.metrics.likes + a.metrics.shares + a.metrics.comments;
        const bEngagement = b.metrics.likes + b.metrics.shares + b.metrics.comments;
        return bEngagement - aEngagement;
      }
      return 0;
    });

    res.json({
      success: true,
      data: posts.slice(0, Number(limit)),
      count: posts.length,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: posts.length
      }
    });
  } catch (error) {
    console.error('Error fetching witter posts:', error);
    res.status(500).json({
      error: 'Failed to fetch witter posts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/witter/posts - Create new witter post
 */
router.post('/posts', async (req, res) => {
  try {
    const {
      campaignId,
      authorId,
      authorName,
      authorType,
      content,
      category,
      metadata
    } = req.body;

    if (!campaignId || !authorId || !authorName || !content) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'authorId', 'authorName', 'content']
      });
    }

    let post;
    if (category === 'business' || metadata?.category?.includes('BUSINESS')) {
      post = await businessNewsService.createBusinessNewsPost({
        campaignId: Number(campaignId),
        authorId,
        authorName,
        authorType: authorType || 'CITIZEN',
        content,
        metadata: metadata || {}
      });
    } else if (category === 'sports' || metadata?.category?.includes('SPORTS')) {
      post = await sportsNewsService.createSportsNewsPost({
        campaignId: Number(campaignId),
        authorId,
        authorName,
        authorType: authorType || 'CITIZEN',
        content,
        metadata: metadata || {}
      });
    } else {
      // Generic post creation
      post = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        authorId,
        authorName,
        authorType: authorType || 'CITIZEN',
        content,
        timestamp: new Date(),
        metadata: metadata || {},
        metrics: { likes: 0, shares: 0, comments: 0 }
      };
    }

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error creating witter post:', error);
    res.status(500).json({
      error: 'Failed to create witter post',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== TRENDING & ANALYTICS =====

/**
 * GET /api/witter/trending - Get trending topics
 */
router.get('/trending', async (req, res) => {
  try {
    const { campaignId, timeframe = '24h' } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const trending = await businessNewsService.getTrendingTopics(
      Number(campaignId),
      timeframe as string
    );

    res.json({
      success: true,
      data: trending,
      timeframe
    });
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    res.status(500).json({
      error: 'Failed to fetch trending topics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/witter/sentiment - Get market sentiment analysis
 */
router.get('/sentiment', async (req, res) => {
  try {
    const { campaignId, symbol, timeframe = '24h' } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const sentiment = await businessNewsService.getMarketSentiment(
      Number(campaignId),
      symbol as string,
      timeframe as string
    );

    res.json({
      success: true,
      data: sentiment,
      symbol,
      timeframe
    });
  } catch (error) {
    console.error('Error fetching market sentiment:', error);
    res.status(500).json({
      error: 'Failed to fetch market sentiment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== USER INTERACTIONS =====

/**
 * POST /api/witter/posts/:postId/like - Like a post
 */
router.post('/posts/:postId/like', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'Missing required parameter: userId'
      });
    }

    // Update post metrics (simplified implementation)
    const result = {
      success: true,
      postId,
      userId,
      action: 'liked',
      timestamp: new Date()
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({
      error: 'Failed to like post',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/witter/posts/:postId/share - Share a post
 */
router.post('/posts/:postId/share', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, comment } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'Missing required parameter: userId'
      });
    }

    const result = {
      success: true,
      postId,
      userId,
      comment: comment || '',
      action: 'shared',
      timestamp: new Date()
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error sharing post:', error);
    res.status(500).json({
      error: 'Failed to share post',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'witter', witterKnobSystem, applyWitterKnobsToGameState);

export default router;
