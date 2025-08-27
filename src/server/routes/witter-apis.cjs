const { 
  witterGameState, 
  createCharacter, 
  generateUniqueCharacter, 
  generateRandomPost, 
  generatePersonalizedFeed, 
  generateComment, 
  getWitterAnalytics 
} = require('../game-state/witter-state.cjs');
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const witterKnobsData = {
  // Content Moderation
  content_moderation_strictness: 0.6,    // AI can adjust content filtering (0.0-1.0)
  misinformation_detection: 0.7,         // AI can detect/flag false information (0.0-1.0)
  hate_speech_filtering: 0.8,            // AI can filter harmful content (0.0-1.0)
  political_bias_balance: 0.5,           // AI can balance political content (0.0-1.0)
  
  // Algorithm Tuning
  engagement_optimization: 0.6,          // AI can optimize for engagement (0.0-1.0)
  echo_chamber_prevention: 0.4,          // AI can diversify feeds (0.0-1.0)
  trending_topic_promotion: 0.7,         // AI can boost trending content (0.0-1.0)
  local_content_priority: 0.5,           // AI can prioritize local content (0.0-1.0)
  
  // Social Dynamics
  viral_content_amplification: 0.6,      // AI can amplify viral content (0.0-1.0)
  influencer_reach_boost: 0.5,           // AI can boost influencer content (0.0-1.0)
  citizen_voice_amplification: 0.7,      // AI can boost citizen content (0.0-1.0)
  cross_civilization_interaction: 0.4,   // AI can promote inter-civ dialogue (0.0-1.0)
  
  // Information Quality
  fact_checking_priority: 0.8,           // AI can prioritize fact-checked content (0.0-1.0)
  source_credibility_weighting: 0.7,     // AI can weight credible sources (0.0-1.0)
  educational_content_boost: 0.6,        // AI can promote educational content (0.0-1.0)
  
  // Platform Health
  toxicity_reduction: 0.8,               // AI can reduce toxic interactions (0.0-1.0)
  constructive_debate_promotion: 0.6,    // AI can promote healthy debate (0.0-1.0)
  mental_health_protection: 0.7,         // AI can protect user wellbeing (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const witterKnobSystem = new EnhancedKnobSystem(witterKnobsData);

// Backward compatibility - expose knobs directly
const witterKnobs = witterKnobSystem.knobs;

// Structured Outputs - For AI consumption, HUD display, and game state
function generateWitterStructuredOutputs() {
  const posts = witterGameState.posts;
  const characters = witterGameState.characters;
  
  // Calculate social media metrics
  const totalEngagement = posts.reduce((sum, post) => sum + (post.likes || 0) + (post.shares || 0) + (post.comments?.length || 0), 0);
  const avgEngagement = posts.length > 0 ? totalEngagement / posts.length : 0;
  const activeUsers = new Set(posts.map(p => p.authorId)).size;
  
  return {
    // High-level metrics for AI decision-making
    social_metrics: {
      total_posts: posts.length,
      active_users: activeUsers,
      average_engagement: avgEngagement,
      viral_posts: posts.filter(p => (p.likes || 0) > 1000).length,
      sentiment_distribution: calculateSentimentDistribution(),
      information_quality_index: calculateInformationQualityIndex(),
      social_cohesion_score: calculateSocialCohesionScore()
    },
    
    // Content analysis for AI strategic planning
    content_analysis: {
      trending_topics: identifyTrendingTopics(),
      sentiment_trends: analyzeSentimentTrends(),
      misinformation_levels: analyzeMisinformationLevels(),
      political_discourse_health: analyzePoliticalDiscourse(),
      cross_civilization_interactions: analyzeCrossCivInteractions()
    },
    
    // Platform health assessment for AI feedback
    platform_health: {
      toxicity_levels: assessToxicityLevels(),
      echo_chamber_strength: assessEchoChamberStrength(),
      information_diversity: assessInformationDiversity(),
      user_wellbeing_indicators: assessUserWellbeing(),
      democratic_discourse_quality: assessDemocraticDiscourse()
    },
    
    // Social alerts and recommendations for AI attention
    ai_alerts: generateWitterAIAlerts(),
    
    // Structured data for other systems
    cross_system_data: {
      public_opinion_trends: calculatePublicOpinionTrends(),
      social_movements: identifySocialMovements(),
      information_warfare_indicators: detectInformationWarfare(),
      cultural_influence_metrics: calculateCulturalInfluence(),
      political_sentiment_analysis: analyzePoliticalSentiment()
    },
    
    timestamp: Date.now(),
    knobs_applied: { ...witterKnobs }
  };
}

function setupWitterAPIs(app) {
  // Get personalized Witter feed
  app.get('/api/witter/feed', async (req, res) => {
    try {
      const { 
        limit = 10, 
        offset = 0, 
        category, 
        civilization, 
        starSystem, 
        planet, 
        sourceType, 
        playerId = 'Commander_Alpha' 
      } = req.query;

      // Ensure we have enough posts
      const targetPostCount = 500;
      if (witterGameState.posts.length < targetPostCount) {
        const postsToGenerate = Math.min(50, targetPostCount - witterGameState.posts.length);
        for (let i = 0; i < postsToGenerate; i++) {
          const newPost = generateRandomPost();
          witterGameState.posts.push(newPost);
        }
      }

      let posts;
      let filteredPosts = witterGameState.posts;

      // Apply filters
      if (category && category !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === category);
      }

      if (civilization && civilization !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.civilization === civilization);
      }

      if (starSystem && starSystem !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.starSystem === starSystem);
      }

      if (planet && planet !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.planet === planet);
      }

      if (sourceType && sourceType !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === sourceType);
      }

      if (category || civilization || starSystem || planet || sourceType) {
        // If any filters are applied, use simple filtering with pagination
        const totalFiltered = filteredPosts.length;
        posts = filteredPosts.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

        res.json({
          success: true,
          posts,
          pagination: {
            total: totalFiltered,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: parseInt(offset) + parseInt(limit) < totalFiltered
          },
          filters: { category, civilization, starSystem, planet, sourceType }
        });
        return;
      } else {
        // Use personalized feed algorithm
        posts = generatePersonalizedFeed(playerId, parseInt(limit), parseInt(offset));
      }

      // Track view interactions for personalization
      const interactions = witterGameState.interactions.get(playerId) || { views: [], likes: [], shares: [], comments: [] };
      posts.forEach(post => {
        if (!interactions.views.includes(post.authorId)) {
          interactions.views.push(post.authorId);
        }
      });
      witterGameState.interactions.set(playerId, interactions);

      res.json({
        success: true,
        posts,
        pagination: {
          total: witterGameState.posts.length,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < witterGameState.posts.length
        },
        personalization: {
          playerId,
          followedCharacters: interactions.views.length,
          interactionHistory: {
            likes: interactions.likes.length,
            shares: interactions.shares.length,
            comments: interactions.comments.length
          }
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to load Witter feed', details: error.message });
    }
  });

  // Get all posts (admin/debug endpoint)
  app.get('/api/witter/posts', (req, res) => {
    const { limit = 50, offset = 0 } = req.query;
    
    const posts = witterGameState.posts
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      posts,
      total: witterGameState.posts.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  });

  // Get Witter filters (for UI dropdowns)
  app.get('/api/witter/filters', (req, res) => {
    const civilizations = [...new Set(witterGameState.posts.map(post => post.civilization))];
    const starSystems = [...new Set(witterGameState.posts.map(post => post.starSystem))];
    const planets = [...new Set(witterGameState.posts.map(post => post.planet))];
    const sourceTypes = [...new Set(witterGameState.posts.map(post => post.category))];

    res.json({
      civilizations: civilizations.filter(Boolean).sort(),
      starSystems: starSystems.filter(Boolean).sort(),
      planets: planets.filter(Boolean).sort(),
      sourceTypes: sourceTypes.filter(Boolean).sort(),
      categories: witterGameState.contentCategories
    });
  });

  // Get comments for a specific post
  app.get('/api/witter/posts/:postId/comments', async (req, res) => {
    try {
      const { postId } = req.params;
      const { limit = 10 } = req.query;

      let comments = witterGameState.comments.get(postId) || [];

      // Generate some comments if none exist
      if (comments.length === 0) {
        const commentCount = Math.floor(Math.random() * 5) + 1; // 1-5 comments
        for (let i = 0; i < commentCount; i++) {
          const character = generateUniqueCharacter();
          const comment = generateComment(character, postId);
          if (comment) {
            comments.push(comment);
          }
        }
      }

      // Sort by timestamp (newest first) and apply limit
      comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      comments = comments.slice(0, parseInt(limit));

      res.json({
        success: true,
        comments,
        total: comments.length,
        postId
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to load comments', details: error.message });
    }
  });

  // Like a post
  app.post('/api/witter/posts/:postId/like', (req, res) => {
    try {
      const { postId } = req.params;
      const { playerId = 'Commander_Alpha' } = req.body;

      const post = witterGameState.posts.find(p => p.id === postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Track interaction for personalization
      const interactions = witterGameState.interactions.get(playerId) || { views: [], likes: [], shares: [], comments: [] };
      
      if (!interactions.likes.includes(postId)) {
        interactions.likes.push(postId);
        post.likes += 1;
        
        // Recalculate engagement
        post.engagement = ((post.likes + post.shares * 2 + post.comments * 3) / post.followers * 100).toFixed(2);
      }
      
      witterGameState.interactions.set(playerId, interactions);

      res.json({
        success: true,
        postId,
        newLikeCount: post.likes,
        engagement: post.engagement,
        message: 'Post liked successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to like post', details: error.message });
    }
  });

  // Get Witter analytics
  app.get('/api/witter/analytics', (req, res) => {
    try {
      const analytics = getWitterAnalytics();
      
      res.json({
        analytics,
        timestamp: new Date(),
        message: 'Witter analytics retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get analytics', details: error.message });
    }
  });

  // Generate new posts (for testing/admin)
  app.post('/api/witter/generate', async (req, res) => {
    try {
      const { count = 10 } = req.body;
      const newPosts = [];

      for (let i = 0; i < Math.min(count, 50); i++) { // Limit to 50 posts per request
        const post = generateRandomPost();
        witterGameState.posts.push(post);
        newPosts.push(post);
      }

      res.json({
        success: true,
        generated: newPosts.length,
        totalPosts: witterGameState.posts.length,
        newPosts: newPosts.slice(0, 5), // Return first 5 as examples
        message: `Generated ${newPosts.length} new posts`
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate posts', details: error.message });
    }
  });

  // Helper functions for witter structured outputs (streamlined)
  function calculateSentimentDistribution() {
    const posts = witterGameState.posts;
    const sentiments = { positive: 0, neutral: 0, negative: 0 };
    posts.forEach(post => {
      const sentiment = post.sentiment || 'neutral';
      sentiments[sentiment] = (sentiments[sentiment] || 0) + 1;
    });
    const total = posts.length || 1;
    return { positive: sentiments.positive / total, neutral: sentiments.neutral / total, negative: sentiments.negative / total };
  }

  function calculateInformationQualityIndex() {
    const factChecking = witterKnobs.fact_checking_priority;
    const credibility = witterKnobs.source_credibility_weighting;
    const misinfoDetection = witterKnobs.misinformation_detection;
    return (factChecking + credibility + misinfoDetection) / 3;
  }

  function calculateSocialCohesionScore() {
    const toxicityReduction = witterKnobs.toxicity_reduction;
    const constructiveDebate = witterKnobs.constructive_debate_promotion;
    const crossCivInteraction = witterKnobs.cross_civilization_interaction;
    return (toxicityReduction + constructiveDebate + crossCivInteraction) / 3;
  }

  function identifyTrendingTopics() {
    const posts = witterGameState.posts;
    const topics = {};
    posts.forEach(post => {
      const category = post.category || 'general';
      topics[category] = (topics[category] || 0) + (post.likes || 0) + (post.shares || 0);
    });
    
    const sortedTopics = Object.entries(topics).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return sortedTopics.map(([topic, engagement]) => ({ topic, engagement }));
  }

  function analyzeSentimentTrends() {
    const posts = witterGameState.posts.slice(-100); // Last 100 posts
    const recentSentiment = calculateSentimentDistribution();
    return { recent_sentiment: recentSentiment, trend: recentSentiment.positive > 0.5 ? 'positive' : recentSentiment.negative > 0.5 ? 'negative' : 'neutral' };
  }

  function analyzeMisinformationLevels() {
    const posts = witterGameState.posts;
    const flaggedPosts = posts.filter(p => p.flagged || p.misinformation).length;
    const misinfoRate = posts.length > 0 ? flaggedPosts / posts.length : 0;
    return { flagged_posts: flaggedPosts, misinformation_rate: misinfoRate, detection_effectiveness: witterKnobs.misinformation_detection };
  }

  function analyzePoliticalDiscourse() {
    const posts = witterGameState.posts.filter(p => p.category === 'politics' || p.category === 'government');
    const politicalEngagement = posts.reduce((sum, p) => sum + (p.likes || 0) + (p.comments?.length || 0), 0);
    const biasBalance = witterKnobs.political_bias_balance;
    return { political_posts: posts.length, engagement_level: politicalEngagement, bias_balance: biasBalance };
  }

  function analyzeCrossCivInteractions() {
    const posts = witterGameState.posts;
    const crossCivPosts = posts.filter(p => p.crossCivilization || p.interplanetary).length;
    const interactionRate = posts.length > 0 ? crossCivPosts / posts.length : 0;
    return { cross_civ_posts: crossCivPosts, interaction_rate: interactionRate, promotion_level: witterKnobs.cross_civilization_interaction };
  }

  function assessToxicityLevels() {
    const posts = witterGameState.posts;
    const toxicPosts = posts.filter(p => p.toxic || p.hateSpeech).length;
    const toxicityRate = posts.length > 0 ? toxicPosts / posts.length : 0;
    return { toxic_posts: toxicPosts, toxicity_rate: toxicityRate, reduction_effectiveness: witterKnobs.toxicity_reduction };
  }

  function assessEchoChamberStrength() {
    const prevention = witterKnobs.echo_chamber_prevention;
    const diversity = assessInformationDiversity().diversity_score;
    const echoChamberStrength = 1 - (prevention * diversity);
    return { echo_chamber_strength: echoChamberStrength, prevention_level: prevention };
  }

  function assessInformationDiversity() {
    const posts = witterGameState.posts;
    const sources = new Set(posts.map(p => p.authorId)).size;
    const categories = new Set(posts.map(p => p.category)).size;
    const diversityScore = Math.min(1.0, (sources + categories) / 50); // Normalized
    return { unique_sources: sources, content_categories: categories, diversity_score: diversityScore };
  }

  function assessUserWellbeing() {
    const mentalHealthProtection = witterKnobs.mental_health_protection;
    const toxicityReduction = witterKnobs.toxicity_reduction;
    const constructivePromotion = witterKnobs.constructive_debate_promotion;
    const wellbeingScore = (mentalHealthProtection + toxicityReduction + constructivePromotion) / 3;
    return { wellbeing_score: wellbeingScore, protection_measures: mentalHealthProtection };
  }

  function assessDemocraticDiscourse() {
    const posts = witterGameState.posts.filter(p => p.category === 'politics' || p.category === 'civic');
    const constructiveDebate = witterKnobs.constructive_debate_promotion;
    const biasBalance = witterKnobs.political_bias_balance;
    const discourseQuality = (constructiveDebate + biasBalance) / 2;
    return { civic_posts: posts.length, discourse_quality: discourseQuality, democratic_health: discourseQuality };
  }

  function generateWitterAIAlerts() {
    const alerts = [];
    
    // Misinformation surge alert
    const misinfoLevels = analyzeMisinformationLevels();
    if (misinfoLevels.misinformation_rate > 0.15) {
      alerts.push({ type: 'misinformation_surge', severity: 'high', message: 'High levels of misinformation detected on platform' });
    }
    
    // Toxicity alert
    const toxicity = assessToxicityLevels();
    if (toxicity.toxicity_rate > 0.1) {
      alerts.push({ type: 'toxicity_spike', severity: 'medium', message: 'Increased toxic content requires attention' });
    }
    
    // Echo chamber alert
    const echoChamber = assessEchoChamberStrength();
    if (echoChamber.echo_chamber_strength > 0.7) {
      alerts.push({ type: 'echo_chamber', severity: 'medium', message: 'Strong echo chambers detected, diversity needed' });
    }
    
    // Sentiment crisis alert
    const sentiment = calculateSentimentDistribution();
    if (sentiment.negative > 0.6) {
      alerts.push({ type: 'negative_sentiment', severity: 'high', message: 'Widespread negative sentiment across platform' });
    }
    
    return alerts;
  }

  function calculatePublicOpinionTrends() {
    const posts = witterGameState.posts.slice(-200); // Recent posts
    const sentiment = calculateSentimentDistribution();
    const politicalPosts = posts.filter(p => p.category === 'politics').length;
    return { 
      overall_sentiment: sentiment, 
      political_engagement: politicalPosts, 
      opinion_volatility: sentiment.negative + sentiment.positive // High volatility if polarized
    };
  }

  function identifySocialMovements() {
    const posts = witterGameState.posts;
    const movementPosts = posts.filter(p => p.category === 'activism' || p.category === 'social').length;
    const viralMovements = posts.filter(p => (p.likes || 0) > 500 && (p.category === 'activism' || p.category === 'social')).length;
    return { movement_posts: movementPosts, viral_movements: viralMovements, movement_strength: viralMovements / 10 };
  }

  function detectInformationWarfare() {
    const posts = witterGameState.posts;
    const suspiciousPosts = posts.filter(p => p.flagged || p.coordinated || p.bot).length;
    const warfareIndicators = suspiciousPosts / posts.length;
    return { suspicious_activity: suspiciousPosts, warfare_risk: warfareIndicators, detection_strength: witterKnobs.misinformation_detection };
  }

  function calculateCulturalInfluence() {
    const posts = witterGameState.posts.filter(p => p.category === 'culture' || p.category === 'entertainment');
    const culturalEngagement = posts.reduce((sum, p) => sum + (p.likes || 0) + (p.shares || 0), 0);
    const crossCivCultural = posts.filter(p => p.crossCivilization).length;
    return { cultural_posts: posts.length, engagement_level: culturalEngagement, cross_civ_influence: crossCivCultural };
  }

  function analyzePoliticalSentiment() {
    const politicalPosts = witterGameState.posts.filter(p => p.category === 'politics' || p.category === 'government');
    const sentiment = { positive: 0, neutral: 0, negative: 0 };
    politicalPosts.forEach(post => {
      const postSentiment = post.sentiment || 'neutral';
      sentiment[postSentiment]++;
    });
    const total = politicalPosts.length || 1;
    return { 
      political_sentiment: { 
        positive: sentiment.positive / total, 
        neutral: sentiment.neutral / total, 
        negative: sentiment.negative / total 
      },
      political_polarization: (sentiment.positive + sentiment.negative) / total
    };
  }

  // Apply AI knobs to actual witter game state
  function applyWitterKnobsToGameState() {
    const posts = witterGameState.posts;
    
    // Apply content moderation to filter posts
    const moderationStrength = witterKnobs.content_moderation_strictness;
    posts.forEach(post => {
      if (moderationStrength > 0.7 && (post.toxic || post.hateSpeech)) {
        post.visibility = 'limited';
        post.moderationApplied = true;
      }
    });
    
    // Apply misinformation detection
    const misinfoDetection = witterKnobs.misinformation_detection;
    posts.forEach(post => {
      if (misinfoDetection > 0.6 && post.misinformation) {
        post.flagged = true;
        post.warningLabel = 'This content has been flagged for fact-checking';
      }
    });
    
    // Apply engagement optimization
    const engagementOpt = witterKnobs.engagement_optimization;
    posts.forEach(post => {
      if (engagementOpt > 0.6) {
        const engagementBonus = (engagementOpt - 0.6) * 0.5; // Up to 20% boost
        post.likes = Math.floor((post.likes || 0) * (1 + engagementBonus));
        post.shares = Math.floor((post.shares || 0) * (1 + engagementBonus));
      }
    });
    
    // Apply viral content amplification
    const viralAmplification = witterKnobs.viral_content_amplification;
    posts.forEach(post => {
      if (viralAmplification > 0.5 && (post.likes || 0) > 100) {
        const viralBonus = (viralAmplification - 0.5) * 2; // Up to 100% boost for viral content
        post.reach = Math.floor((post.reach || post.likes || 0) * (1 + viralBonus));
      }
    });
    
    // Apply citizen voice amplification
    const citizenBoost = witterKnobs.citizen_voice_amplification;
    posts.forEach(post => {
      if (citizenBoost > 0.5 && post.authorType === 'citizen') {
        const citizenBonus = (citizenBoost - 0.5) * 0.3; // Up to 15% boost
        post.visibility = 'boosted';
        post.likes = Math.floor((post.likes || 0) * (1 + citizenBonus));
      }
    });
    
    // Apply educational content boost
    const educationalBoost = witterKnobs.educational_content_boost;
    posts.forEach(post => {
      if (educationalBoost > 0.5 && (post.category === 'education' || post.educational)) {
        const eduBonus = (educationalBoost - 0.5) * 0.4; // Up to 20% boost
        post.priority = 'high';
        post.reach = Math.floor((post.reach || post.likes || 0) * (1 + eduBonus));
      }
    });
    
    console.log('🎛️ Witter knobs applied to game state:', {
      content_moderation: witterKnobs.content_moderation_strictness,
      misinformation_detection: witterKnobs.misinformation_detection,
      engagement_optimization: witterKnobs.engagement_optimization,
      citizen_amplification: witterKnobs.citizen_voice_amplification
    });
  }

  // ===== AI INTEGRATION ENDPOINTS =====
  
  // Enhanced AI knob endpoints with multi-format input support
  app.get('/api/witter/knobs', (req, res) => {
    const knobData = witterKnobSystem.getKnobsWithMetadata();
    res.json({
      ...knobData,
      system: 'witter',
      description: 'AI-adjustable parameters for Witter system with enhanced input support',
      input_help: witterKnobSystem.getKnobDescriptions()
    });
  });

  app.post('/api/witter/knobs', (req, res) => {
    const { knobs, source = 'ai' } = req.body;
    
    if (!knobs || typeof knobs !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid knobs data. Expected object with knob values.',
        help: witterKnobSystem.getKnobDescriptions().examples
      });
    }
    
    // Update knobs using enhanced system
    const updateResult = witterKnobSystem.updateKnobs(knobs, source);
    
    // Apply knobs to game state
    try {
      applyWitterKnobsToGameState();
    } catch (error) {
      console.error('Error applying witter knobs to game state:', error);
    }
    
    res.json({
      success: updateResult.success,
      system: 'witter',
      ...updateResult,
      message: 'Witter knobs updated successfully using enhanced input processing'
    });
  });

  // Get knob help/documentation
  app.get('/api/witter/knobs/help', (req, res) => {
    res.json({
      system: 'witter',
      help: witterKnobSystem.getKnobDescriptions(),
      current_values: witterKnobSystem.getKnobsWithMetadata()
    });
  });

  // Get structured outputs for AI consumption
  app.get('/api/witter/ai-data', (req, res) => {
    const structuredData = generateWitterStructuredOutputs();
    res.json({
      ...structuredData,
      description: 'Structured Witter data for AI analysis and decision-making'
    });
  });

  // Get cross-system integration data
  app.get('/api/witter/cross-system', (req, res) => {
    const outputs = generateWitterStructuredOutputs();
    res.json({
      public_opinion_data: outputs.cross_system_data.public_opinion_trends,
      social_movement_data: outputs.cross_system_data.social_movements,
      information_warfare_data: outputs.cross_system_data.information_warfare_indicators,
      cultural_influence_data: outputs.cross_system_data.cultural_influence_metrics,
      political_sentiment_data: outputs.cross_system_data.political_sentiment_analysis,
      social_summary: outputs.social_metrics,
      timestamp: outputs.timestamp
    });
  });
}

module.exports = { setupWitterAPIs };