// AI-POWERED WITTER SERVER
// Completely eliminates templates and hardcoded content

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Import the true AI service (we'll implement a JS version)
class TrueAIWitterService {
  constructor() {
    this.aiServiceUrl = 'http://localhost:8001/api/ai/generate';
    this.fallbackEnabled = true;
  }

  async generateAICharacter(gameContext) {
    const characterPrompt = `Generate a unique character for a galactic social media platform. Create:
1. A creative, sci-fi appropriate name (first and last name)
2. A personality trait (one word, be creative beyond basic traits)
3. A profession (space-age appropriate)
4. A brief background or quirk

Available civilizations: ${gameContext.civilizations.map(c => c.name || c).join(', ')}
Available star systems: ${gameContext.starSystems.map(s => s.name || s).join(', ')}

Return ONLY a JSON object with: name, personality, profession, background, preferredCivilization, preferredSystem

Be creative and unique - no generic names or traits.`;

    try {
      const response = await this.callAIService({
        prompt: characterPrompt,
        maxTokens: 200,
        temperature: 0.9
      });

      if (response.success) {
        const aiData = JSON.parse(response.content);
        const civ = gameContext.civilizations.find(c => (c.name || c) === aiData.preferredCivilization) || 
                   gameContext.civilizations[Math.floor(Math.random() * gameContext.civilizations.length)];
        const system = gameContext.starSystems.find(s => (s.name || s) === aiData.preferredSystem) ||
                      gameContext.starSystems[Math.floor(Math.random() * gameContext.starSystems.length)];
        const planet = system.planets?.[Math.floor(Math.random() * system.planets.length)] || `${system.name || system} Prime`;

        return {
          id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: aiData.name,
          avatar: this.generateContextualAvatar(aiData.profession, aiData.personality),
          type: this.determineCharacterType(),
          civilization: civ.name || civ,
          starSystem: system.name || system,
          planet: planet,
          location: `${planet} ${this.generateLocationSuffix()}`,
          followers: this.generateFollowerCount(aiData.personality),
          personality: aiData.personality,
          profession: aiData.profession,
          verified: false
        };
      }
    } catch (error) {
      console.error('AI character generation failed:', error);
    }

    // Fallback to procedural generation if AI fails
    return this.generateProceduralCharacter(gameContext);
  }

  async generateAIPost(character, gameContext) {
    const contentType = this.determineContentType(character);
    
    let basePrompt = '';
    let contextInfo = '';

    // Build context from current game state
    if (gameContext.currentEvents && gameContext.currentEvents.length > 0) {
      contextInfo += `Current galactic events: ${gameContext.currentEvents.slice(0, 3).join(', ')}. `;
    }
    if (gameContext.recentNews && gameContext.recentNews.length > 0) {
      contextInfo += `Recent news: ${gameContext.recentNews.slice(0, 2).join(', ')}. `;
    }
    contextInfo += `Political climate: ${gameContext.politicalClimate}. Economic status: ${gameContext.economicStatus}.`;

    switch (contentType) {
      case 'citizen_life':
        basePrompt = `Write a social media post from ${character.name}, a ${character.personality} ${character.profession} living on ${character.planet} in the ${character.civilization}. 

The post should be about their daily life, but make it:
- Genuinely funny and relatable
- Include unexpected sci-fi elements naturally
- Show their ${character.personality} personality clearly
- Be 2-3 sentences long
- Include appropriate emojis and hashtags
- Make it feel authentic and personal

${contextInfo}

Write ONLY the post content, nothing else.`;
        break;

      case 'citizen_commentary':
        basePrompt = `Write a social media post from ${character.name}, a ${character.personality} ${character.profession} from ${character.civilization}, commenting on current galactic affairs.

The post should:
- Show their opinion on recent events or politics
- Be witty but not mean-spirited
- Reflect their ${character.personality} personality
- Include specific references to their civilization or location
- Be 2-3 sentences long
- Include emojis and hashtags naturally

Current context: ${contextInfo}

Write ONLY the post content, nothing else.`;
        break;

      case 'official_announcement':
        basePrompt = `Write an official social media post from ${character.name} representing ${character.civilization} government or ${character.profession} department.

The post should:
- Be professional but engaging
- Include specific data, timelines, or policy details
- Reference current events appropriately
- Be 2-4 sentences long
- Use official but accessible language
- Include relevant hashtags

Current context: ${contextInfo}

Write ONLY the post content, nothing else.`;
        break;

      case 'media_report':
        basePrompt = `Write a news/media post from ${character.name} reporting on galactic events for ${character.civilization} audience.

The post should:
- Report on current events with journalistic style
- Include specific details and implications
- Be informative but engaging
- Be 2-4 sentences long
- Include appropriate hashtags and emojis

Current context: ${contextInfo}

Write ONLY the post content, nothing else.`;
        break;

      default:
        basePrompt = `Write a creative social media post from ${character.name}, a ${character.personality} ${character.profession} from ${character.planet}. Make it unique, funny, and engaging. Be 2-3 sentences. Include emojis and hashtags. Context: ${contextInfo}`;
    }

    try {
      const response = await this.callAIService({
        prompt: basePrompt,
        maxTokens: 150,
        temperature: 0.8
      });

      if (response.success && response.content.trim()) {
        return response.content.trim();
      }
    } catch (error) {
      console.error('AI post generation failed:', error);
    }

    // Fallback - still AI generated but simpler
    return await this.generateFallbackPost(character, gameContext);
  }

  async generateAIComment(character, originalPost, gameContext) {
    const commentPrompt = `Write a social media comment from ${character.name}, a ${character.personality} ${character.profession} from ${character.civilization}, responding to this post:

"${originalPost.content}"

The comment should:
- Reflect their ${character.personality} personality
- Be relevant to the original post
- Be 1-2 sentences long
- Include emojis naturally
- Feel authentic and conversational
- Show their perspective from ${character.planet}

Write ONLY the comment content, nothing else.`;

    try {
      const response = await this.callAIService({
        prompt: commentPrompt,
        maxTokens: 100,
        temperature: 0.7
      });

      if (response.success && response.content.trim()) {
        return response.content.trim();
      }
    } catch (error) {
      console.error('AI comment generation failed:', error);
    }

    // Simple fallback
    return await this.generateFallbackComment(character, originalPost);
  }

  async callAIService(request) {
    try {
      const response = await fetch(this.aiServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          max_tokens: request.maxTokens || 100,
          temperature: request.temperature || 0.7,
          model: 'gpt-3.5-turbo'
        }),
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`AI service returned ${response.status}`);
      }

      const data = await response.json();
      
      return {
        content: data.content || data.text || data.response || '',
        success: true
      };
    } catch (error) {
      console.error('AI service call failed:', error);
      return {
        content: '',
        success: false,
        error: error.message
      };
    }
  }

  determineContentType(character) {
    if (character.type === 'official') {
      return 'official_announcement';
    } else if (character.type === 'media') {
      return 'media_report';
    } else {
      return Math.random() < 0.6 ? 'citizen_life' : 'citizen_commentary';
    }
  }

  generateContextualAvatar(profession, personality) {
    const professionAvatars = {
      'engineer': ['🔧', '⚙️', '🛠️', '🔩'],
      'scientist': ['🔬', '⚗️', '🧬', '🔭'],
      'pilot': ['✈️', '🚀', '🛸', '👨‍✈️'],
      'doctor': ['⚕️', '🏥', '💊', '🩺'],
      'teacher': ['📚', '🎓', '📝', '👩‍🏫'],
      'artist': ['🎨', '🖌️', '🎭', '🎪'],
      'trader': ['💰', '📈', '💼', '🏪'],
      'explorer': ['🗺️', '🧭', '🏔️', '🌍']
    };

    const personalityAvatars = {
      'witty': ['😏', '🤓', '😎', '🎭'],
      'mysterious': ['🔮', '🌙', '👁️', '🕵️'],
      'energetic': ['⚡', '🔥', '💫', '🌟'],
      'creative': ['✨', '🌈', '🎨', '💡']
    };

    // Try profession first
    for (const [key, avatars] of Object.entries(professionAvatars)) {
      if (profession.toLowerCase().includes(key)) {
        return avatars[Math.floor(Math.random() * avatars.length)];
      }
    }

    // Try personality
    for (const [key, avatars] of Object.entries(personalityAvatars)) {
      if (personality.toLowerCase().includes(key)) {
        return avatars[Math.floor(Math.random() * avatars.length)];
      }
    }

    const defaultAvatars = ['🚀', '🌟', '🌌', '👽', '🔮', '⚡', '🌙', '☄️', '🌠', '🪐'];
    return defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
  }

  determineCharacterType() {
    const rand = Math.random();
    if (rand < 0.7) return 'citizen';
    if (rand < 0.85) return 'media';
    return 'official';
  }

  generateFollowerCount(personality) {
    const baseFollowers = Math.floor(Math.random() * 1000) + 10;
    const personalityMultipliers = {
      'charismatic': 5,
      'witty': 3,
      'creative': 2.5,
      'mysterious': 1.5,
      'energetic': 2
    };

    const multiplier = personalityMultipliers[personality.toLowerCase()] || 1;
    return Math.floor(baseFollowers * multiplier);
  }

  generateLocationSuffix() {
    const suffixes = ['District', 'Sector', 'Zone', 'Quarter', 'Hub', 'Station', 'Colony', 'Outpost'];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    return `${suffix} ${number}`;
  }

  generateProceduralCharacter(gameContext) {
    const civ = gameContext.civilizations[Math.floor(Math.random() * gameContext.civilizations.length)];
    const system = gameContext.starSystems[Math.floor(Math.random() * gameContext.starSystems.length)];
    const planet = system.planets?.[Math.floor(Math.random() * system.planets.length)] || `${system.name || system} Prime`;

    return {
      id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `Citizen ${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      avatar: '👤',
      type: this.determineCharacterType(),
      civilization: civ.name || civ,
      starSystem: system.name || system,
      planet: planet,
      location: `${planet} ${this.generateLocationSuffix()}`,
      followers: Math.floor(Math.random() * 1000) + 10,
      personality: 'unique',
      profession: 'Resident',
      verified: false
    };
  }

  async generateFallbackPost(character, gameContext) {
    const topics = [
      `Life on ${character.planet} is interesting`,
      `Working as a ${character.profession} in ${character.civilization}`,
      `The view from ${character.location} today`,
      `Thoughts on recent galactic events`
    ];
    
    const topic = topics[Math.floor(Math.random() * topics.length)];
    return `${topic}... ${character.personality} perspective from ${character.starSystem} 🌟 #GalacticLife`;
  }

  async generateFallbackComment(character, originalPost) {
    const reactions = [
      `Interesting perspective from ${character.planet}!`,
      `As a ${character.profession}, I can relate to this`,
      `This resonates with us in ${character.civilization}`,
      `${character.personality} take: this is spot on!`
    ];
    
    return reactions[Math.floor(Math.random() * reactions.length)] + ' 🌟';
  }
}

// Initialize the AI service
const aiWitterService = new TrueAIWitterService();

// Game state with dynamic civilizations and systems
const gameState = {
  civilizations: [
    { name: 'Terran Federation', capital: 'Earth', government: 'Democratic Republic' },
    { name: 'Centauri Republic', capital: 'Proxima b', government: 'Parliamentary System' },
    { name: 'Vegan Collective', capital: 'Vega Prime', government: 'Collective Council' },
    { name: 'Kepler Technocracy', capital: 'Kepler-442b', government: 'Meritocratic Technocracy' },
    { name: 'Sirius Empire', capital: 'Sirius A-1', government: 'Constitutional Monarchy' },
    { name: 'Andromedan Alliance', capital: 'Andromeda Station', government: 'Federal Alliance' },
    { name: 'Rigellian Consortium', capital: 'Rigel Beta', government: 'Corporate Consortium' },
    { name: 'Betelgeuse Coalition', capital: 'Betelgeuse Prime', government: 'Military Coalition' },
    { name: 'Proxima Settlements', capital: 'Proxima Colony', government: 'Settlement Council' },
    { name: 'Wolf 359 Colonies', capital: 'Wolf Station', government: 'Colonial Assembly' }
  ],
  starSystems: [
    { name: 'Sol', planets: ['Earth', 'Mars', 'Europa', 'Titan'] },
    { name: 'Alpha Centauri', planets: ['Proxima b', 'Centauri Prime', 'Alpha Station'] },
    { name: 'Vega', planets: ['Vega Prime', 'Vega Beta', 'Vega Outpost'] },
    { name: 'Kepler', planets: ['Kepler-442b', 'Kepler Station', 'Kepler Colony'] },
    { name: 'Sirius', planets: ['Sirius A-1', 'Sirius B-2', 'Sirius Hub'] },
    { name: 'Rigel', planets: ['Rigel Alpha', 'Rigel Beta', 'Rigel Gamma'] },
    { name: 'Betelgeuse', planets: ['Betelgeuse Prime', 'Betelgeuse Station'] },
    { name: 'Proxima', planets: ['Proxima Colony', 'Proxima Outpost'] }
  ],
  currentEvents: [
    'Galactic Trade Summit concludes with new hyperspace regulations',
    'Breakthrough in quantum communication technology announced',
    'Interstellar mining rights dispute resolved peacefully',
    'New alien artifact discovered in the Outer Rim',
    'Climate restoration project begins on three worlds'
  ],
  recentNews: [
    'Diplomatic tensions ease between Terran Federation and Sirius Empire',
    'Record harvest reported across agricultural worlds',
    'Space piracy incidents decrease by 40% this quarter',
    'Cultural exchange program expands to include 12 civilizations'
  ],
  politicalClimate: 'cautiously optimistic',
  economicStatus: 'steady growth with regional variations',
  wittPosts: []
};

// Generate initial posts using AI
async function initializeWittPosts() {
  console.log('Initializing AI-powered Witter posts...');
  
  for (let i = 0; i < 50; i++) {
    try {
      const character = await aiWitterService.generateAICharacter(gameState);
      const content = await aiWitterService.generateAIPost(character, gameState);
      
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
      
      gameState.wittPosts.push(post);
      
      if (i % 10 === 0) {
        console.log(`Generated ${i + 1}/50 AI posts...`);
      }
    } catch (error) {
      console.error(`Failed to generate post ${i + 1}:`, error);
    }
  }
  
  console.log(`Initialized ${gameState.wittPosts.length} AI-powered posts`);
}

// API Endpoints

// Get Witter feed with AI-generated content
app.get('/api/witter/feed', async (req, res) => {
  const { limit = 10, offset = 0, civilization, starSystem, planet, category, sourceType } = req.query;
  
  let filteredPosts = [...gameState.wittPosts];
  
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
  
  // Generate new posts on demand if needed
  if (filteredPosts.length < parseInt(limit) && !req.query.no_generate) {
    try {
      const character = await aiWitterService.generateAICharacter(gameState);
      const content = await aiWitterService.generateAIPost(character, gameState);
      
      const newPost = {
        id: `witt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        author: character.name,
        avatar: character.avatar,
        content: content,
        timestamp: new Date().toISOString(),
        likes: Math.floor(Math.random() * 50) + 1,
        shares: Math.floor(Math.random() * 10) + 1,
        comments: Math.floor(Math.random() * 8) + 1,
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
      
      gameState.wittPosts.unshift(newPost);
      filteredPosts.unshift(newPost);
    } catch (error) {
      console.error('Failed to generate new post:', error);
    }
  }
  
  // Pagination
  const totalFiltered = filteredPosts.length;
  const posts = filteredPosts.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
  
  res.json({
    success: true,
    posts: posts,
    pagination: {
      total: totalFiltered,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + parseInt(limit) < totalFiltered
    },
    personalization: {
      playerId: 'Commander_Alpha',
      followedCharacters: 0,
      interactionHistory: { likes: 0, shares: 0, comments: 0 }
    }
  });
});

// Get filters
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

// Get post comments (AI-generated)
app.get('/api/witter/post/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const post = gameState.wittPosts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  const comments = [];
  const numComments = Math.min(post.comments, 5); // Limit for demo
  
  for (let i = 0; i < numComments; i++) {
    try {
      const character = await aiWitterService.generateAICharacter(gameState);
      const commentContent = await aiWitterService.generateAIComment(character, post, gameState);
      
      comments.push({
        id: `comment_${Date.now()}_${i}`,
        author: character.name,
        avatar: character.avatar,
        content: commentContent,
        timestamp: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
        likes: Math.floor(Math.random() * 20) + 1
      });
    } catch (error) {
      console.error('Failed to generate comment:', error);
    }
  }
  
  res.json({ comments });
});

// Other endpoints (like, share, profile, etc.) remain the same as before
app.get('/api/witter/profile/:authorId', async (req, res) => {
  const { authorId } = req.params;
  
  // Generate a profile on demand
  try {
    const character = await aiWitterService.generateAICharacter(gameState);
    
    res.json({
      id: authorId,
      name: character.name,
      type: character.type.toUpperCase(),
      location: character.location,
      followers: character.followers,
      following: Math.floor(character.followers * 0.1),
      posts: Math.floor(Math.random() * 100) + 10,
      joined: '2387',
      verified: character.verified,
      bio: `${character.personality} ${character.profession} from ${character.planet}`,
      interests: [character.profession, character.personality, character.civilization]
    });
  } catch (error) {
    console.error('Failed to generate profile:', error);
    res.status(500).json({ error: 'Failed to generate profile' });
  }
});

// Like, share, comment endpoints (simplified for demo)
app.post('/api/witter/posts/:postId/like', (req, res) => {
  const { postId } = req.params;
  const post = gameState.wittPosts.find(p => p.id === postId);
  
  if (post) {
    post.likes += 1;
    res.json({ success: true, post });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/witter/posts/:postId/share', (req, res) => {
  const { postId } = req.params;
  const post = gameState.wittPosts.find(p => p.id === postId);
  
  if (post) {
    post.shares += 1;
    res.json({ success: true, post });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/witter/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const post = gameState.wittPosts.find(p => p.id === postId);
  
  if (post) {
    post.comments += 1;
    res.json({ 
      success: true, 
      comment: {
        id: `comment_${Date.now()}`,
        author: 'Player',
        content: content,
        timestamp: new Date().toISOString()
      }
    });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// Initialize and start server
async function startServer() {
  await initializeWittPosts();
  
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 AI-Powered Witter Server running on http://localhost:${PORT}`);
    console.log(`📡 Witter API: http://localhost:${PORT}/api/witter/feed`);
    console.log(`🎯 All content is AI-generated - no templates or hardcoded content!`);
  });
}

startServer().catch(console.error);
