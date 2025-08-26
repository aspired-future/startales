import express from 'express';
import WitterAIService from '../../services/WitterAIService.js';
import DefaultGameStateProvider from '../../services/GameStateProvider.js';
import { getBusinessNewsService } from '../witter/BusinessNewsService.js';
import { getSportsNewsService } from '../witter/SportsNewsService.js';
import { getEnhancedAIContentService } from '../witter/EnhancedAIContentService.js';
import { getCharacterDrivenContentService } from '../witter/CharacterDrivenContentService.js';

const router = express.Router();
const gameStateProvider = new DefaultGameStateProvider();
const witterService = new WitterAIService(gameStateProvider);

/**
 * GET /api/witter/feed
 * Generate AI-powered Witter feed
 */
router.get('/feed', async (req, res) => {
  try {
    const {
      limit = '20',
      offset = '0',
      civilization,
      starSystem,
      planet,
      sourceType
    } = req.query;

    const limitNum = Math.min(parseInt(limit as string) || 20, 50); // Max 50 posts per request for infinite scroll
    const offsetNum = parseInt(offset as string) || 0;

    // Temporary mock data while fixing AI service
    const mockPosts = [
      {
        id: `witt-${Date.now()}-1`,
        author: "Dr. Elena Vasquez",
        handle: "@DrElenaV",
        content: "🧬 Breakthrough in quantum genetics! Our team just discovered how to enhance crop yields by 300% using quantum-entangled DNA sequences. The future of galactic agriculture is here! #QuantumScience #GalacticAgriculture",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        likes: 1247,
        reposts: 89,
        replies: 34,
        category: 'SCIENCE',
        avatar: "🧬",
        verified: true,
        location: "Kepler Research Station"
      },
      {
        id: `witt-${Date.now()}-2`,
        author: "Marcus Chen",
        handle: "@MarcusReports",
        content: "📈 BREAKING: Galactic Trade Federation announces new interstellar commerce routes! Expected to boost GDP by 15% across all member civilizations. The Andromeda-Milky Way Express is officially operational! 🚀✨ #GalacticEconomy #Trade",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        likes: 892,
        reposts: 156,
        replies: 67,
        category: 'BUSINESS',
        avatar: "📊",
        verified: true,
        location: "Central Trade Hub"
      },
      {
        id: `witt-${Date.now()}-3`,
        author: "Captain Sarah Nova",
        handle: "@CaptainNova",
        content: "🏆 What a match! The Centauri Comets just defeated the Vega Vipers 4-2 in the most intense zero-gravity soccer final I've ever witnessed! That last-minute goal by Rodriguez was INSANE! 🥅⚽ #ZeroGSoccer #GalacticSports",
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        likes: 2156,
        reposts: 234,
        replies: 89,
        category: 'SPORTS',
        avatar: "⚽",
        verified: false,
        location: "Orbital Sports Complex"
      }
    ];

    const posts = mockPosts.slice(offsetNum, offsetNum + limitNum);

    // Apply source type filter if specified
    let filteredPosts = posts;
    if (sourceType && sourceType !== 'all') {
      const sourceTypes = (sourceType as string).toLowerCase().split(',');
      filteredPosts = posts.filter(post => 
        sourceTypes.includes(post.authorType.toLowerCase()) ||
        sourceTypes.includes(post.metadata.sourceType)
      );
    }

    // Apply pagination
    const paginatedPosts = filteredPosts.slice(offsetNum, offsetNum + limitNum);

    res.json({
      posts: paginatedPosts,
      pagination: {
        total: filteredPosts.length,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < filteredPosts.length
      },
      filters: {
        civilization: civilization || 'all',
        starSystem: starSystem || 'all',
        planet: planet || 'all',
        sourceType: sourceType || 'all'
      }
    });

  } catch (error) {
    console.error('Error generating Witter feed:', error);
    res.status(500).json({
      error: 'Failed to generate feed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/witter/post/:id
 * Get a specific post (generate fresh AI content)
 */
router.get('/post/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // For demo purposes, generate a fresh post
    // In production, you'd retrieve from database
    const post = await witterService.generatePost();
    post.id = id; // Use the requested ID
    
    res.json({ post });
  } catch (error) {
    console.error('Error generating post:', error);
    res.status(500).json({
      error: 'Failed to generate post',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/witter/post/:id/like
 * Like/unlike a post
 */
router.post('/post/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { liked } = req.body;
    
    // In production, update database
    // For demo, return success
    res.json({
      success: true,
      postId: id,
      liked: liked,
      newLikeCount: Math.floor(Math.random() * 1000) + (liked ? 1 : -1)
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
 * POST /api/witter/post/:id/share
 * Share/unshare a post
 */
router.post('/post/:id/share', async (req, res) => {
  try {
    const { id } = req.params;
    const { shared } = req.body;
    
    // In production, update database and create share record
    res.json({
      success: true,
      postId: id,
      shared: shared,
      newShareCount: Math.floor(Math.random() * 100) + (shared ? 1 : -1)
    });
  } catch (error) {
    console.error('Error sharing post:', error);
    res.status(500).json({
      error: 'Failed to share post',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/witter/post/:id/comments
 * Get AI-generated comments for a post
 */
router.get('/post/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = '10' } = req.query;
    
    const limitNum = Math.min(parseInt(limit as string) || 10, 50);
    
    // First, try to get the original post for context
    let originalPost: any = null;
    try {
      const postResponse = await witterService.generatePost();
      originalPost = postResponse;
    } catch (error) {
      console.error('Could not get original post for comment context:', error);
    }

    // Generate AI-powered comments using the service
    const comments = [];
    for (let i = 0; i < limitNum; i++) {
      try {
        const comment = await witterService.generateComment(originalPost);
        comment.postId = id; // Ensure correct post ID
        comments.push(comment);
      } catch (error) {
        console.error(`Failed to generate comment ${i}:`, error);
        // Fallback to simple comment generation
        const commenter = await witterService.generateProceduralCharacter();
        const fallbackComment = {
          id: `comment_${Date.now()}_${i}`,
          postId: id,
          authorId: commenter.id,
          authorName: commenter.name,
          authorAvatar: commenter.avatar,
          content: generateFallbackComment(commenter, originalPost?.content),
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          likes: Math.floor(Math.random() * 50),
          replies: Math.floor(Math.random() * 5)
        };
        comments.push(fallbackComment);
      }
    }
    
    res.json({ comments });
  } catch (error) {
    console.error('Error generating comments:', error);
    res.status(500).json({
      error: 'Failed to generate comments',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/witter/post/:id/comment
 * Add a comment to a post
 */
router.post('/post/:id/comment', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, authorName = 'Player' } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }
    
    const comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postId: id,
      authorId: 'player_1', // In production, get from auth
      authorName,
      authorAvatar: '👤',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: 0
    };
    
    // In production, save to database
    res.json({ comment, success: true });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      error: 'Failed to add comment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/witter/profile/:id
 * Get user profile information
 */
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Generate a character profile
    const character = await witterService.generateProceduralCharacter();
    character.id = id;
    
    const profile = {
      ...character,
      bio: `${character.personality} ${character.profession} from ${character.planet}`,
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      postCount: Math.floor(Math.random() * 1000) + 50,
      following: Math.floor(Math.random() * 500) + 10,
      isFollowing: false
    };
    
    res.json({ profile });
  } catch (error) {
    console.error('Error generating profile:', error);
    res.status(500).json({
      error: 'Failed to generate profile',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/witter/profile/:id/follow
 * Follow/unfollow a user
 */
router.post('/profile/:id/follow', async (req, res) => {
  try {
    const { id } = req.params;
    const { following } = req.body;
    
    // In production, update database
    res.json({
      success: true,
      profileId: id,
      following: following,
      newFollowerCount: Math.floor(Math.random() * 10000) + (following ? 1 : -1)
    });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({
      error: 'Failed to follow user',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/witter/business-news/:civilizationId
 * Get business news and market commentary for a civilization
 */
router.get('/business-news/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    const { limit = '10' } = req.query;
    
    if (isNaN(civilizationId)) {
      return res.status(400).json({ error: 'Invalid civilization ID' });
    }
    
    const limitNum = Math.min(parseInt(limit as string) || 10, 50);
    
    const businessNewsService = getBusinessNewsService();
    const businessNews = await businessNewsService.getBusinessNewsForFeed(civilizationId, limitNum);
    
    // Generate market commentary for each news item
    const newsWithCommentary = await Promise.all(
      businessNews.map(async (news) => {
        const commentary = await businessNewsService.generateMarketCommentary(news, 3);
        return {
          ...news,
          marketCommentary: commentary
        };
      })
    );
    
    res.json({
      businessNews: newsWithCommentary,
      pagination: {
        total: newsWithCommentary.length,
        limit: limitNum,
        hasMore: false // For now, since we're generating fresh content
      }
    });
  } catch (error) {
    console.error('Error getting business news:', error);
    res.status(500).json({
      error: 'Failed to get business news',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/witter/market-commentary/:postId
 * Get market commentary for a specific business news post
 */
router.get('/market-commentary/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { limit = '5' } = req.query;
    
    const limitNum = Math.min(parseInt(limit as string) || 5, 20);
    
    const businessNewsService = getBusinessNewsService();
    const commentary = await businessNewsService.getMarketCommentaryForPost(postId, limitNum);
    
    res.json({ commentary });
  } catch (error) {
    console.error('Error getting market commentary:', error);
    res.status(500).json({
      error: 'Failed to get market commentary',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/witter/sports-news/:civilizationId
 * Get sports news and fan commentary for a civilization
 */
router.get('/sports-news/:civilizationId', async (req, res) => {
  try {
    const civilizationId = parseInt(req.params.civilizationId);
    const { limit = '8' } = req.query;
    
    if (isNaN(civilizationId)) {
      return res.status(400).json({ error: 'Invalid civilization ID' });
    }
    
    const limitNum = Math.min(parseInt(limit as string) || 8, 30);
    
    const sportsNewsService = getSportsNewsService();
    const sportsNews = await sportsNewsService.getSportsNewsForFeed(civilizationId, limitNum);
    
    // Generate fan commentary for each sports item
    const newsWithCommentary = await Promise.all(
      sportsNews.map(async (news) => {
        const commentary = await sportsNewsService.generateSportsCommentary(news, 4);
        return {
          ...news,
          fanCommentary: commentary
        };
      })
    );
    
    res.json({
      sportsNews: newsWithCommentary,
      pagination: {
        total: newsWithCommentary.length,
        limit: limitNum,
        hasMore: false
      }
    });
  } catch (error) {
    console.error('Error getting sports news:', error);
    res.status(500).json({
      error: 'Failed to get sports news',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/witter/enhanced-feed
 * Get enhanced Witter feed with integrated business news, sports, and market commentary
 */
router.get('/enhanced-feed', async (req, res) => {
  try {
    const {
      limit = '20',
      offset = '0',
      civilization = '1',
      starSystem,
      planet,
      sourceType,
      includeBusinessNews = 'true',
      includeSportsNews = 'true'
    } = req.query;

    const limitNum = Math.min(parseInt(limit as string) || 20, 50); // Max 50 posts per request for infinite scroll
    const offsetNum = parseInt(offset as string) || 0;
    const civilizationId = parseInt(civilization as string) || 1;

    // Temporary mock enhanced data
    const enhancedMockPosts = [
      {
        id: `enhanced-${Date.now()}-1`,
        author: "Dr. Elena Vasquez",
        handle: "@DrElenaV",
        content: "🧬 Breakthrough in quantum genetics! Our team just discovered how to enhance crop yields by 300% using quantum-entangled DNA sequences. The future of galactic agriculture is here! #QuantumScience #GalacticAgriculture",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        likes: 1247,
        reposts: 89,
        replies: 34,
        category: 'SCIENCE',
        avatar: "🧬",
        verified: true,
        location: "Kepler Research Station"
      },
      {
        id: `enhanced-${Date.now()}-2`,
        author: "Marcus Chen",
        handle: "@MarcusReports",
        content: "📈 BREAKING: Galactic Trade Federation announces new interstellar commerce routes! Expected to boost GDP by 15% across all member civilizations. The Andromeda-Milky Way Express is officially operational! 🚀✨ #GalacticEconomy #Trade",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        likes: 892,
        reposts: 156,
        replies: 67,
        category: 'BUSINESS',
        avatar: "📊",
        verified: true,
        location: "Central Trade Hub"
      },
      {
        id: `enhanced-${Date.now()}-3`,
        author: "Captain Sarah Nova",
        handle: "@CaptainNova",
        content: "🏆 What a match! The Centauri Comets just defeated the Vega Vipers 4-2 in the most intense zero-gravity soccer final I've ever witnessed! That last-minute goal by Rodriguez was INSANE! 🥅⚽ #ZeroGSoccer #GalacticSports",
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        likes: 2156,
        reposts: 234,
        replies: 89,
        category: 'SPORTS',
        avatar: "⚽",
        verified: false,
        location: "Orbital Sports Complex"
      },
      {
        id: `enhanced-${Date.now()}-4`,
        author: "Ambassador Zara Kim",
        handle: "@AmbassadorZara",
        content: "🌟 Honored to represent our civilization at the Intergalactic Peace Summit. Today we signed historic agreements on resource sharing and cultural exchange. Together, we build a brighter future among the stars! 🤝✨ #Diplomacy #Peace",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        likes: 3421,
        reposts: 445,
        replies: 123,
        category: 'POLITICS',
        avatar: "🌟",
        verified: true,
        location: "Diplomatic Quarter"
      },
      {
        id: `enhanced-${Date.now()}-5`,
        author: "Tech Innovator Alex",
        handle: "@TechAlexInnovates",
        content: "🤖 Just finished beta testing the new AI-powered personal assistants! These little guys can manage your entire household, optimize your daily schedule, AND they make the best synthetic coffee in the galaxy! ☕🤖 #AITech #Innovation",
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        likes: 1876,
        reposts: 298,
        replies: 156,
        category: 'TECHNOLOGY',
        avatar: "🤖",
        verified: false,
        location: "Innovation District"
      }
    ];

    // Return mock data in the expected format
    res.json({
      witts: enhancedMockPosts.slice(offsetNum, offsetNum + limitNum),
      hasMore: offsetNum + limitNum < enhancedMockPosts.length,
      total: enhancedMockPosts.length,
      offset: offsetNum,
      limit: limitNum
    });
    return;

    // Build filters for regular content
    const filters: any = {};
    if (civilization && civilization !== 'all') filters.civilization = civilization as string;
    if (starSystem && starSystem !== 'all') filters.starSystem = starSystem as string;
    if (planet && planet !== 'all') filters.planet = planet as string;

    // Calculate diverse content distribution for maximum entertainment
    const businessCount = Math.floor(limitNum * 0.15);  // 15% business
    const sportsCount = Math.floor(limitNum * 0.15);    // 15% sports
    const entertainmentCount = Math.floor(limitNum * 0.15); // 15% entertainment
    const cultureCount = Math.floor(limitNum * 0.10);   // 10% culture
    const technologyCount = Math.floor(limitNum * 0.10); // 10% technology
    const politicsCount = Math.floor(limitNum * 0.10);  // 10% politics
    const scienceCount = Math.floor(limitNum * 0.10);   // 10% science
    const citizenCount = limitNum - (businessCount + sportsCount + entertainmentCount + cultureCount + technologyCount + politicsCount + scienceCount); // 15% citizen

    // Generate regular citizen content
    const regularPosts = await witterService.generateFeed(citizenCount, filters);
    let allPosts = [...regularPosts];

    // Generate enhanced AI content for diverse categories
    try {
      const enhancedAIService = getEnhancedAIContentService();
      const gameContext = {
        currentEvents: [
          'Inter-civilization diplomatic summit scheduled',
          'New quantum technology breakthrough announced',
          'Galactic entertainment awards ceremony approaching'
        ],
        economicStatus: 'Mixed signals across galactic markets',
        politicalClimate: 'Tensions rising between core worlds and outer rim',
        recentNews: [
          'Celebrity scandal rocks entertainment industry',
          'Scientific discovery challenges existing theories',
          'Cultural exchange program launches between civilizations'
        ]
      };

      // Generate entertainment content
      if (entertainmentCount > 0) {
        const entertainmentPosts = await enhancedAIService.generateEnhancedContent({
          contentType: 'entertainment',
          civilizationId,
          gameContext
        }, entertainmentCount);
        
        const formattedEntertainment = entertainmentPosts.map(post => ({
          ...post,
          authorType: post.authorType.toLowerCase(),
          metadata: {
            ...post.metadata,
            sourceType: 'entertainment_news'
          }
        }));
        allPosts = [...allPosts, ...formattedEntertainment];
      }

      // Generate culture content
      if (cultureCount > 0) {
        const culturePosts = await enhancedAIService.generateEnhancedContent({
          contentType: 'culture',
          civilizationId,
          gameContext
        }, cultureCount);
        
        const formattedCulture = culturePosts.map(post => ({
          ...post,
          authorType: post.authorType.toLowerCase(),
          metadata: {
            ...post.metadata,
            sourceType: 'culture_news'
          }
        }));
        allPosts = [...allPosts, ...formattedCulture];
      }

      // Generate technology content
      if (technologyCount > 0) {
        const technologyPosts = await enhancedAIService.generateEnhancedContent({
          contentType: 'technology',
          civilizationId,
          gameContext
        }, technologyCount);
        
        const formattedTechnology = technologyPosts.map(post => ({
          ...post,
          authorType: post.authorType.toLowerCase(),
          metadata: {
            ...post.metadata,
            sourceType: 'technology_news'
          }
        }));
        allPosts = [...allPosts, ...formattedTechnology];
      }

      // Generate politics content
      if (politicsCount > 0) {
        const politicsPosts = await enhancedAIService.generateEnhancedContent({
          contentType: 'politics',
          civilizationId,
          gameContext
        }, politicsCount);
        
        const formattedPolitics = politicsPosts.map(post => ({
          ...post,
          authorType: post.authorType.toLowerCase(),
          metadata: {
            ...post.metadata,
            sourceType: 'politics_news'
          }
        }));
        allPosts = [...allPosts, ...formattedPolitics];
      }

      // Generate science content
      if (scienceCount > 0) {
        const sciencePosts = await enhancedAIService.generateEnhancedContent({
          contentType: 'science',
          civilizationId,
          gameContext
        }, scienceCount);
        
        const formattedScience = sciencePosts.map(post => ({
          ...post,
          authorType: post.authorType.toLowerCase(),
          metadata: {
            ...post.metadata,
            sourceType: 'science_news'
          }
        }));
        allPosts = [...allPosts, ...formattedScience];
      }

    } catch (enhancedError) {
      console.error('Failed to generate enhanced AI content, continuing with regular feed:', enhancedError);
    }

    // Generate character-driven story content (20% of total content)
    try {
      const characterService = getCharacterDrivenContentService();
      const characterCount = Math.floor(limitNum * 0.20); // 20% character-driven content
      
      if (characterCount > 0) {
        // Create mock game events for character context
        const mockGameEvents = [
          {
            id: 'event-001',
            type: 'political' as const,
            title: 'Inter-civilization diplomatic summit scheduled',
            description: 'Major diplomatic negotiations between core civilizations',
            civilizationsInvolved: ['Terran Republic', 'Alpha Centauri Alliance'],
            charactersAffected: [],
            timestamp: new Date(),
            impact: 'major' as const,
            ongoingStoryline: 'diplomatic-crisis'
          },
          {
            id: 'event-002',
            type: 'scientific' as const,
            title: 'Quantum technology breakthrough announced',
            description: 'Revolutionary quantum computing advancement',
            civilizationsInvolved: ['Vega Federation'],
            charactersAffected: [],
            timestamp: new Date(),
            impact: 'moderate' as const,
            ongoingStoryline: 'tech-revolution'
          },
          {
            id: 'event-003',
            type: 'cultural' as const,
            title: 'Galactic entertainment awards ceremony approaching',
            description: 'Annual celebration of inter-civilization entertainment',
            civilizationsInvolved: ['Sirius Empire', 'Kepler Union'],
            charactersAffected: [],
            timestamp: new Date(),
            impact: 'minor' as const,
            ongoingStoryline: 'celebrity-drama'
          }
        ];

        const characterPosts = await characterService.generateCharacterDrivenContent(
          civilizationId,
          mockGameEvents,
          characterCount
        );
        
        // Convert character posts to Witter format
        const formattedCharacterPosts = characterService.convertToWitterPosts(characterPosts);
        allPosts = [...allPosts, ...formattedCharacterPosts];
      }
    } catch (characterError) {
      console.error('Character-driven content generation failed:', characterError);
      // Continue without character content
    }

    // Add business news if requested
    if (includeBusinessNews === 'true') {
      try {
        const businessNewsService = getBusinessNewsService();
        const businessNews = await businessNewsService.getBusinessNewsForFeed(civilizationId, businessCount);
        
        // Convert business news to Witter post format
        const businessPosts = businessNews.map(news => ({
          id: news.id,
          authorId: news.authorId,
          authorName: news.authorName,
          authorType: news.authorType,
          authorAvatar: news.authorAvatar,
          content: news.content,
          timestamp: news.timestamp.toISOString(),
          likes: news.metrics.likes,
          shares: news.metrics.shares,
          comments: news.metrics.comments,
          metadata: {
            ...news.metadata,
            sourceType: 'business_news'
          }
        }));

        allPosts = [...allPosts, ...businessPosts];
      } catch (businessError) {
        console.error('Failed to load business news, continuing with regular feed:', businessError);
      }
    }

    // Add sports news if requested
    if (includeSportsNews === 'true') {
      try {
        const sportsNewsService = getSportsNewsService();
        const sportsNews = await sportsNewsService.getSportsNewsForFeed(civilizationId, sportsCount);
        
        // Convert sports news to Witter post format
        const sportsPosts = sportsNews.map(news => ({
          id: news.id,
          authorId: news.authorId,
          authorName: news.authorName,
          authorType: news.authorType,
          authorAvatar: news.authorAvatar,
          content: news.content,
          timestamp: news.timestamp.toISOString(),
          likes: news.metrics.likes,
          shares: news.metrics.shares,
          comments: news.metrics.comments,
          metadata: {
            ...news.metadata,
            sourceType: 'sports_news'
          }
        }));

        allPosts = [...allPosts, ...sportsPosts];
      } catch (sportsError) {
        console.error('Failed to load sports news, continuing with regular feed:', sportsError);
      }
    }

    // Apply source type filter if specified
    let filteredPosts = allPosts;
    if (sourceType && sourceType !== 'all') {
      const sourceTypes = (sourceType as string).toLowerCase().split(',');
      filteredPosts = allPosts.filter(post => 
        sourceTypes.includes(post.authorType.toLowerCase()) ||
        sourceTypes.includes(post.metadata?.sourceType) ||
        (sourceTypes.includes('business_news') && post.metadata?.category?.includes('BUSINESS')) ||
        (sourceTypes.includes('sports_news') && post.metadata?.category?.includes('SPORTS'))
      );
    }

    // Sort by timestamp (newest first) and apply pagination
    filteredPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const paginatedPosts = filteredPosts.slice(offsetNum, offsetNum + limitNum);

    res.json({
      posts: paginatedPosts,
      pagination: {
        total: filteredPosts.length,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < filteredPosts.length
      },
      filters: {
        civilization: civilization || 'all',
        starSystem: starSystem || 'all',
        planet: planet || 'all',
        sourceType: sourceType || 'all',
        includeBusinessNews: includeBusinessNews === 'true',
        includeSportsNews: includeSportsNews === 'true'
      },
      contentBreakdown: {
        citizenPosts: regularPosts.length,
        businessNews: businessCount,
        sportsNews: sportsCount,
        total: allPosts.length
      }
    });

  } catch (error) {
    console.error('Error generating enhanced Witter feed:', error);
    res.status(500).json({
      error: 'Failed to generate enhanced feed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/witter/filters
 * Get available filter options from actual game data
 */
router.get('/filters', async (req, res) => {
  try {
    // Get actual game data
    const civilizations = await gameStateProvider.getCivilizations();
    const starSystems = await gameStateProvider.getStarSystems();
    const planets = await gameStateProvider.getPlanets();
    
    const filters = {
      civilizations: Array.from(civilizations.values()).map(civ => civ.name || civ.id),
      starSystems: Array.from(starSystems.values()).map(system => system.name || system.id),
      planets: Array.from(planets.values()).map(planet => planet.name || planet.id),
      sourceTypes: [
        { id: 'citizen', label: 'Citizens', count: '~35%' },
        { id: 'media', label: 'Media', count: '~25%' },
        { id: 'official', label: 'Official', count: '~15%' },
        { id: 'business_news', label: 'Business News', count: '~20%' },
        { id: 'sports_news', label: 'Sports News', count: '~18%' },
        { id: 'analyst', label: 'Market Analysis', count: '~10%' },
        { id: 'sports_media', label: 'Sports Media', count: '~12%' },
        { id: 'fan', label: 'Sports Fans', count: '~8%' }
      ],
      contentCategories: [
        { id: 'all', label: 'All Content' },
        { id: 'social', label: 'Social Posts' },
        { id: 'business_news', label: 'Business News' },
        { id: 'market_analysis', label: 'Market Analysis' },
        { id: 'earnings', label: 'Earnings Reports' },
        { id: 'economic_policy', label: 'Economic Policy' },
        { id: 'company_news', label: 'Company News' },
        { id: 'sports_news', label: 'Sports News' },
        { id: 'game_results', label: 'Game Results' },
        { id: 'athlete_news', label: 'Athlete News' },
        { id: 'olympics', label: 'Olympics' },
        { id: 'league_news', label: 'League News' }
      ]
    };
    
    res.json(filters);
  } catch (error) {
    console.error('Error getting filters:', error);
    res.status(500).json({
      error: 'Failed to get filters',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper function to generate AI comments
async function generateAIComment(character: any, originalPost?: string): Promise<string> {
  try {
    // Determine comment type/tone
    const commentTypes = ['agreement', 'disagreement', 'humor', 'question', 'personal_experience'];
    const commentType = commentTypes[Math.floor(Math.random() * commentTypes.length)];
    
    // Build AI prompt for comment generation
    let prompt = `You are ${character.name}, a ${character.personality} ${character.profession} from ${character.civilization} living on ${character.planet} in the ${character.starSystem} system.

Write a social media comment that is ${commentType === 'agreement' ? 'supportive and agreeing' : 
                                      commentType === 'disagreement' ? 'respectfully disagreeing' :
                                      commentType === 'humor' ? 'funny and lighthearted' :
                                      commentType === 'question' ? 'asking a thoughtful question' :
                                      'sharing a personal experience'}.

The comment should:
- Be 1-2 sentences (under 200 characters)
- Reflect your ${character.personality} personality
- Reference your background from ${character.civilization}
- Include relevant emojis
- Sound natural and conversational`;

    // Add context about the original post if available
    if (originalPost) {
      prompt += `\n\nYou are commenting on this post: "${originalPost.substring(0, 200)}..."`;
    }

    prompt += `\n\nWrite only the comment, nothing else:`;

    // Make AI API call
    const response = await fetch('http://localhost:4001/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        maxTokens: 50,
        temperature: 0.8
      })
    });

    if (response.ok) {
      const result = await response.json();
      const comment = result.content?.trim();
      if (comment && comment.length > 0) {
        return comment;
      }
    }
  } catch (error) {
    console.error('AI comment generation failed:', error);
  }

  // Fallback to simple contextual comment
  return generateFallbackComment(character, originalPost);
}

// Fallback comment generation when AI fails
function generateFallbackComment(character: any, originalPost?: string): string {
  const reactions = [
    `Interesting perspective from ${character.planet}! 🤔`,
    `As someone from ${character.civilization}, I can relate 👍`,
    `This reminds me of my work as a ${character.profession} 💼`,
    `We see this differently in the ${character.starSystem} system 🌌`,
    `Thanks for sharing! Always learning something new 📚`,
    `Great point! The ${character.personality} in me appreciates this ✨`
  ];
  
  return reactions[Math.floor(Math.random() * reactions.length)];
}

export default router;
