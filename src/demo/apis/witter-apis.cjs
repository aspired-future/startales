const { 
  witterGameState, 
  createCharacter, 
  generateUniqueCharacter, 
  generateRandomPost, 
  generatePersonalizedFeed, 
  generateComment, 
  getWitterAnalytics 
} = require('../game-state/witter-state.cjs');

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
}

module.exports = { setupWitterAPIs };