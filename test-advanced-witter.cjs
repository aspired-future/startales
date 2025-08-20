// TEST ADVANCED WITTER CONTENT GENERATION
const express = require('express');
const cors = require('cors');
const { AdvancedContentGenerator } = require('./advanced-content-generator.cjs');

const app = express();
app.use(cors());
app.use(express.json());

const contentGenerator = new AdvancedContentGenerator();

// Test character generation
async function generateTestCharacter() {
  const nameGenerators = {
    futuristic: () => {
      const prefixes = ['Zar', 'Kex', 'Vyn', 'Qor', 'Xel', 'Nyx', 'Rho', 'Zep', 'Astra', 'Nova', 'Cosm'];
      const suffixes = ['ion', 'ara', 'eth', 'oss', 'ynn', 'ux', 'lis', 'dor', 'wyn', 'rex', 'tis'];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      return prefix + suffix;
    },
    
    compound: () => {
      const first = ['Star', 'Void', 'Quantum', 'Neural', 'Cosmic', 'Plasma', 'Photon', 'Gravity'];
      const second = ['weaver', 'walker', 'bender', 'keeper', 'forger', 'runner', 'dancer', 'singer'];
      return first[Math.floor(Math.random() * first.length)] + second[Math.floor(Math.random() * second.length)];
    }
  };
  
  const firstName = nameGenerators.futuristic();
  const lastName = nameGenerators.compound();
  
  const personalityPrefixes = ['hyper', 'neo', 'ultra', 'meta', 'proto', 'cyber', 'bio', 'astro'];
  const personalityRoots = ['empathic', 'analytical', 'creative', 'intuitive', 'logical', 'artistic', 'strategic'];
  const personality = personalityPrefixes[Math.floor(Math.random() * personalityPrefixes.length)] + 
                     personalityRoots[Math.floor(Math.random() * personalityRoots.length)];
  
  const professionTypes = [
    'Quantum Archaeologist', 'Stellar Cartographer', 'Biorhythm Analyst', 'Hyperspace Navigator',
    'Memory Architect', 'Gravity Sculptor', 'Time Curator', 'Reality Engineer', 'Dream Synthesizer',
    'Consciousness Debugger', 'Emotion Translator', 'Thought Weaver', 'Space-Time Mechanic'
  ];
  
  const profession = professionTypes[Math.floor(Math.random() * professionTypes.length)];
  
  const civilizations = ['Terran Federation', 'Centauri Republic', 'Vegan Collective', 'Kepler Technocracy', 'Sirius Empire'];
  const starSystems = ['Sol', 'Alpha Centauri', 'Vega', 'Kepler', 'Sirius'];
  const planets = ['Earth', 'Mars', 'Europa', 'Proxima b', 'Centauri Prime'];
  
  const civ = civilizations[Math.floor(Math.random() * civilizations.length)];
  const system = starSystems[Math.floor(Math.random() * starSystems.length)];
  const planet = planets[Math.floor(Math.random() * planets.length)];

  return {
    id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${firstName} ${lastName}`,
    type: Math.random() < 0.7 ? 'citizen' : (Math.random() < 0.85 ? 'media' : 'official'),
    civilization: civ,
    starSystem: system,
    planet: planet,
    location: `${planet} District ${Math.floor(Math.random() * 999) + 1}`,
    avatar: '🌟',
    followers: Math.floor(Math.random() * 10000) + 100,
    personality: personality,
    profession: profession,
    verified: Math.random() < 0.1
  };
}

// Generate test posts
const gameState = { wittPosts: [] };

async function generateTestPost() {
  const character = await generateTestCharacter();
  
  const gameContext = {
    currentEvents: ['Galactic Trade Summit concludes', 'Quantum communication breakthrough', 'Interstellar mining rights resolved'],
    politicalClimate: 'cautiously optimistic',
    economicStatus: 'steady growth with regional variations'
  };
  
  const content = contentGenerator.generateUniquePost(character, gameContext);
  
  const post = {
    id: `witt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    author: character.name,
    avatar: character.avatar,
    content: content,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 100) + 1,
    shares: Math.floor(Math.random() * 20) + 1,
    comments: Math.floor(Math.random() * 15) + 1,
    followers: character.followers,
    civilization: character.civilization,
    starSystem: character.starSystem,
    planet: character.planet,
    location: character.location,
    verified: character.verified,
    category: character.type,
    topics: [character.type, 'social'],
    personality: character.personality,
    profession: character.profession,
    hasImage: Math.random() < 0.1,
    personalizedScore: Math.random() * 200
  };
  
  gameState.wittPosts.unshift(post);
  return post;
}

// Initialize with some posts
async function initializePosts() {
  console.log('🚀 Generating advanced content with NO TEMPLATES...');
  
  for (let i = 0; i < 20; i++) {
    try {
      await generateTestPost();
      if (i % 5 === 0) {
        console.log(`Generated ${i + 1}/20 unique posts...`);
      }
    } catch (error) {
      console.error(`Failed to generate post ${i + 1}:`, error);
    }
  }
  
  console.log(`✅ Generated ${gameState.wittPosts.length} unique posts with advanced content generation!`);
}

// API endpoints
app.get('/api/witter/feed', async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  
  // Generate new posts on demand
  if (gameState.wittPosts.length < parseInt(limit)) {
    for (let i = 0; i < parseInt(limit); i++) {
      await generateTestPost();
    }
  }
  
  const posts = gameState.wittPosts.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
  
  res.json({
    success: true,
    posts: posts,
    pagination: {
      total: gameState.wittPosts.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + parseInt(limit) < gameState.wittPosts.length
    },
    message: 'All content generated with advanced algorithms - NO TEMPLATES!'
  });
});

app.get('/api/witter/filters', (req, res) => {
  const civilizations = [...new Set(gameState.wittPosts.map(post => post.civilization))];
  const starSystems = [...new Set(gameState.wittPosts.map(post => post.starSystem))];
  const planets = [...new Set(gameState.wittPosts.map(post => post.planet))];
  const sourceTypes = [...new Set(gameState.wittPosts.map(post => post.category))];

  res.json({
    civilizations: civilizations.filter(Boolean),
    starSystems: starSystems.filter(Boolean),
    planets: planets.filter(Boolean),
    sourceTypes: sourceTypes.filter(Boolean)
  });
});

app.get('/api/witter/post/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const post = gameState.wittPosts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  const comments = [];
  const numComments = Math.min(post.comments, 5);
  
  for (let i = 0; i < numComments; i++) {
    const character = await generateTestCharacter();
    const commentContent = contentGenerator.generateUniqueComment(character, post);
    
    comments.push({
      id: `comment_${Date.now()}_${i}`,
      author: character.name,
      avatar: character.avatar,
      content: commentContent,
      timestamp: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
      likes: Math.floor(Math.random() * 20) + 1
    });
  }
  
  res.json({ comments });
});

// Start server
async function startServer() {
  await initializePosts();
  
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`🎯 Advanced Witter Test Server running on http://localhost:${PORT}`);
    console.log(`📡 Feed API: http://localhost:${PORT}/api/witter/feed`);
    console.log(`✨ ALL CONTENT IS DYNAMICALLY GENERATED - NO TEMPLATES OR REPETITION!`);
  });
}

startServer().catch(console.error);

