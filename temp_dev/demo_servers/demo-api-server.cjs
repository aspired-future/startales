const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// In-memory data store for demo
const gameState = {
  civilizations: new Map(),
  characters: new Map(),
  starSystems: new Map(),
  planets: new Map(),
  wittPosts: [],
  comments: new Map(), // postId -> comments array
  players: new Map(), // playerId -> player data
  follows: new Map(), // playerId -> Set of followed userIds
  interactions: new Map(), // playerId -> interaction history
  sharedMemes: new Map(), // memeId -> { imageUrl, prompt, usageCount, createdAt }
  memeGenerationQueue: [], // Queue for pending meme generations
  lastMemeGeneration: 0, // Timestamp of last meme generation
  explorationData: {
    playerLevel: 3,
    discoveryPoints: 1250,
    knownSystems: 12,
    knownRaces: 5,
    activeExpeditions: 2
  },
  gameSettings: {
    gameMode: 'hero',
    resolutionMode: 'outcome',
    visualLevel: 'everything'
  }
};

// Initialize demo data
function initializeDemoData() {
  // Star Systems
  const starSystems = [
    { id: 'sol', name: 'Sol System', sector: 'Core', x: 0, y: 0, starType: 'G-class', planets: 8, inhabited: true },
    { id: 'alpha_centauri', name: 'Alpha Centauri', sector: 'Core', x: 4.37, y: 0, starType: 'G-class', planets: 3, inhabited: true },
    { id: 'vega', name: 'Vega System', sector: 'Outer', x: 25, y: 15, starType: 'A-class', planets: 5, inhabited: true },
    { id: 'kepler_442', name: 'Kepler-442', sector: 'Frontier', x: 120, y: 45, starType: 'K-class', planets: 4, inhabited: false },
    { id: 'sirius', name: 'Sirius System', sector: 'Core', x: 8.6, y: -5, starType: 'A-class', planets: 2, inhabited: true }
  ];

  starSystems.forEach(system => gameState.starSystems.set(system.id, system));

  // Civilizations
  const civilizations = [
    {
      id: 'terran_federation',
      name: 'Terran Federation',
      race: 'Human',
      population: 12500000000,
      technology: 'Advanced',
      government: 'Democratic Federation',
      homeSystem: 'sol',
      culture: 'Diverse and adaptable',
      history: 'Founded in 2157 after the unification of Earth nations',
      militaryStrength: 'High',
      economicPower: 'Very High',
      diplomaticStatus: 'Allied'
    },
    {
      id: 'zephyrian_collective',
      name: 'Zephyrian Collective',
      race: 'Zephyrian',
      population: 8900000000,
      technology: 'Highly Advanced',
      government: 'Collective Consciousness',
      homeSystem: 'alpha_centauri',
      culture: 'Unified telepathic society',
      history: 'Ancient civilization with 10,000 years of recorded history',
      militaryStrength: 'Medium',
      economicPower: 'High',
      diplomaticStatus: 'Friendly'
    },
    {
      id: 'vegan_republic',
      name: 'Vegan Republic',
      race: 'Vegan',
      population: 6200000000,
      technology: 'Advanced',
      government: 'Parliamentary Republic',
      homeSystem: 'vega',
      culture: 'Artistic and philosophical',
      history: 'Known for their contributions to galactic art and philosophy',
      militaryStrength: 'Medium',
      economicPower: 'Medium',
      diplomaticStatus: 'Neutral'
    },
    {
      id: 'sirian_empire',
      name: 'Sirian Empire',
      race: 'Sirian',
      population: 15600000000,
      technology: 'Very Advanced',
      government: 'Imperial Monarchy',
      homeSystem: 'sirius',
      culture: 'Honor-based warrior society',
      history: 'Expansionist empire with a strong military tradition',
      militaryStrength: 'Very High',
      economicPower: 'High',
      diplomaticStatus: 'Tense'
    }
  ];

  civilizations.forEach(civ => gameState.civilizations.set(civ.id, civ));

  // Characters
  const characters = [
    {
      id: 'npc_scientist_zara',
      name: 'Dr. Zara Chen',
      title: 'Xenobiologist',
      location: 'Mars Research Station',
      personality: 'Curious and methodical',
      civilization: 'terran_federation',
      backstory: 'Leading researcher in xenobiology with 15 years of experience',
      motivations: 'Discovering new forms of life',
      relationships: ['npc_trader_kex'],
      avatar: '🧬'
    },
    {
      id: 'npc_trader_kex',
      name: 'Captain Kex Vorthan',
      title: 'Trade Captain',
      location: 'Alpha Centauri Hub',
      personality: 'Adventurous and shrewd',
      civilization: 'zephyrian_collective',
      backstory: 'Veteran trader with connections across the galaxy',
      motivations: 'Building trade networks and wealth',
      relationships: ['npc_scientist_zara', 'npc_diplomat_aria'],
      avatar: '🚀'
    },
    {
      id: 'npc_diplomat_aria',
      name: 'Ambassador Aria Sol',
      title: 'Diplomatic Envoy',
      location: 'Earth Embassy',
      personality: 'Charismatic and diplomatic',
      civilization: 'terran_federation',
      backstory: 'Career diplomat specializing in interspecies relations',
      motivations: 'Maintaining galactic peace',
      relationships: ['npc_trader_kex', 'npc_commander_thane'],
      avatar: '🌟'
    },
    {
      id: 'npc_commander_thane',
      name: 'Commander Thane Korrath',
      title: 'Military Commander',
      location: 'Sirius Command',
      personality: 'Strategic and honorable',
      civilization: 'sirian_empire',
      backstory: 'Decorated military officer with a strong sense of honor',
      motivations: 'Protecting the empire and maintaining order',
      relationships: ['npc_diplomat_aria'],
      avatar: '⚔️'
    }
  ];

  characters.forEach(char => gameState.characters.set(char.id, char));

  // Witter Posts
  const wittPosts = [
    {
      id: 'witt_001',
      authorId: 'npc_scientist_zara',
      authorName: 'Dr. Zara Chen',
      authorType: 'PERSONALITY',
      content: 'Fascinating xenobiology discoveries in the Alpha Centauri system! The diversity of life never ceases to amaze me. #Science #Discovery',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      likes: 42,
      shares: 12,
      comments: 8,
      isLiked: false,
      isShared: false,
      metadata: {
        gameContext: 'Research Discovery',
        location: 'Mars Research Station',
        category: 'science',
        topics: ['xenobiology', 'discovery'],
        personality: 'curious'
      }
    },
    {
      id: 'witt_002',
      authorId: 'npc_trader_kex',
      authorName: 'Captain Kex Vorthan',
      authorType: 'PERSONALITY',
      content: 'Excellent trade negotiations completed in the Vega sector! New rare mineral resources secured. Prosperity for all! #Trade #Success',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      likes: 28,
      shares: 15,
      comments: 5,
      isLiked: false,
      isShared: false,
      metadata: {
        gameContext: 'Trade Success',
        location: 'Alpha Centauri Hub',
        category: 'trade',
        topics: ['trade', 'resources'],
        personality: 'shrewd'
      }
    },
    {
      id: 'witt_003',
      authorId: 'npc_diplomat_aria',
      authorName: 'Ambassador Aria Sol',
      authorType: 'PERSONALITY',
      content: 'Productive diplomatic meeting with Zephyrian representatives. Cultural exchange programs are the key to galactic harmony! #Diplomacy #Unity',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      likes: 67,
      shares: 23,
      comments: 12,
      isLiked: false,
      isShared: false,
      metadata: {
        gameContext: 'Diplomatic Success',
        location: 'Earth Embassy',
        category: 'politics',
        topics: ['diplomacy', 'culture'],
        personality: 'diplomatic'
      }
    }
  ];

  gameState.wittPosts = wittPosts;
  
  // Initialize player profiles
  initializePlayerProfiles();
  
  // Initialize some follows and interactions for demo
  initializeDemoSocialData();
}

// Initialize player profiles with interests and preferences
function initializePlayerProfiles() {
  const players = [
    {
      id: 'Commander_Alpha',
      name: 'Commander Alpha',
      avatar: '👨‍🚀',
      interests: ['exploration', 'military', 'science'],
      personality: 'adventurous',
      location: 'Sol System',
      joinDate: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
      level: 15,
      reputation: 850
    },
    {
      id: 'Captain_Beta',
      name: 'Captain Beta',
      avatar: '👩‍🚀',
      interests: ['trade', 'diplomacy', 'exploration'],
      personality: 'diplomatic',
      location: 'Alpha Centauri',
      joinDate: new Date(Date.now() - 86400000 * 45).toISOString(),
      level: 12,
      reputation: 720
    },
    {
      id: 'Admiral_Gamma',
      name: 'Admiral Gamma',
      avatar: '🛡️',
      interests: ['military', 'politics', 'science'],
      personality: 'strategic',
      location: 'Luna Command',
      joinDate: new Date(Date.now() - 86400000 * 60).toISOString(),
      level: 18,
      reputation: 950
    }
  ];
  
  players.forEach(player => {
    gameState.players.set(player.id, player);
    gameState.follows.set(player.id, new Set());
    gameState.interactions.set(player.id, {
      likes: new Set(),
      shares: new Set(),
      comments: new Set(),
      views: new Set(),
      engagementScore: {},
      categoryPreferences: {}
    });
  });
}

// Initialize demo social connections
function initializeDemoSocialData() {
  // Commander Alpha follows some characters
  gameState.follows.get('Commander_Alpha').add('zara_chen');
  gameState.follows.get('Commander_Alpha').add('nova_starwind');
  gameState.follows.get('Commander_Alpha').add('marcus_steel');
  
  // Captain Beta follows different characters
  gameState.follows.get('Captain_Beta').add('kex_vorthan');
  gameState.follows.get('Captain_Beta').add('aria_sol');
  gameState.follows.get('Captain_Beta').add('serenity_moon');
  
  // Some cross-player follows
  gameState.follows.get('Commander_Alpha').add('Captain_Beta');
  gameState.follows.get('Captain_Beta').add('Admiral_Gamma');
}

// Generate dynamic comments for a post
function generateCommentsForPost(postId, count = 3) {
  const commentTemplates = {
    science: [
      "Fascinating research! Have you considered the implications for {field}?",
      "This could revolutionize our understanding of {topic}. Great work!",
      "I've seen similar results in my lab. The {element} readings are consistent.",
      "Incredible discovery! This opens up so many new research possibilities.",
      "The methodology here is sound. Looking forward to peer review results."
    ],
    trade: [
      "Excellent deal! The market for {resource} has been volatile lately.",
      "Smart move! I've been tracking these price trends too.",
      "This trade route will benefit both systems. Well negotiated!",
      "The profit margins on {commodity} are impressive right now.",
      "Great business sense! This partnership will be profitable for years."
    ],
    politics: [
      "Diplomacy at its finest! This agreement benefits everyone involved.",
      "A historic moment for galactic relations. Congratulations!",
      "This alliance will strengthen our position in the sector.",
      "Peaceful solutions are always preferable. Well done!",
      "The negotiations must have been challenging. Impressive outcome."
    ],
    military: [
      "Our defenses are stronger than ever. Excellent strategic planning!",
      "The fleet readiness reports are impressive. Good work, Admiral!",
      "These exercises demonstrate our commitment to galactic security.",
      "Tactical superiority through preparation. Outstanding!",
      "The coordination between fleets was flawless during the exercises."
    ],
    exploration: [
      "What an incredible discovery! The universe never ceases to amaze.",
      "First contact protocols were handled perfectly. Historic moment!",
      "The exploration data will be invaluable for future missions.",
      "These findings will reshape our star charts. Amazing work!",
      "The courage to venture into unknown space is commendable."
    ]
  };
  
  const characters = [
    { id: 'zara_chen', name: 'Dr. Zara Chen', avatar: '🧬' },
    { id: 'kex_vorthan', name: 'Captain Kex Vorthan', avatar: '💰' },
    { id: 'aria_sol', name: 'Ambassador Aria Sol', avatar: '🕊️' },
    { id: 'marcus_steel', name: 'Admiral Marcus Steel', avatar: '⚔️' },
    { id: 'nova_starwind', name: 'Captain Nova Starwind', avatar: '🚀' },
    { id: 'zyx_quantum', name: 'Dr. Zyx Quantum', avatar: '🔬' },
    { id: 'rex_goldbeard', name: 'Rex Goldbeard', avatar: '🏴‍☠️' },
    { id: 'serenity_moon', name: 'Serenity Moon', avatar: '🌙' }
  ];
  
  // Get the original post to determine category
  const post = gameState.wittPosts.find(p => p.id === postId);
  if (!post) return [];
  
  const category = post.metadata.category;
  const templates = commentTemplates[category] || commentTemplates.science;
  
  const comments = [];
  for (let i = 0; i < count; i++) {
    const character = characters[Math.floor(Math.random() * characters.length)];
    let content = templates[Math.floor(Math.random() * templates.length)];
    
    // Replace placeholders
    const replacements = {
      field: ['quantum mechanics', 'xenobiology', 'astrophysics', 'temporal studies'],
      topic: ['dark matter', 'wormhole theory', 'alien biology', 'space-time'],
      element: ['neutronium', 'exotic matter', 'quantum crystals', 'dark energy'],
      resource: ['rare minerals', 'energy crystals', 'bio-materials', 'quantum cores'],
      commodity: ['tritium', 'dilithium', 'antimatter', 'plasma conduits']
    };
    
    Object.keys(replacements).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      content = content.replace(regex, replacements[key][Math.floor(Math.random() * replacements[key].length)]);
    });
    
    comments.push({
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postId,
      authorId: character.id,
      authorName: character.name,
      authorType: 'PERSONALITY',
      avatar: character.avatar,
      content,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Random time in last hour
      likes: Math.floor(Math.random() * 25),
      replies: Math.floor(Math.random() * 5),
      isLiked: false
    });
  }
  
  return comments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// Personalized feed algorithm
function generatePersonalizedFeed(playerId, limit = 10, offset = 0) {
  const player = gameState.players.get(playerId);
  const follows = gameState.follows.get(playerId) || new Set();
  const interactions = gameState.interactions.get(playerId) || { engagementScore: {}, categoryPreferences: {} };
  
  if (!player) {
    // Return general feed for unknown players
    return gameState.wittPosts.slice(offset, offset + limit);
  }
  
  // Score posts based on personalization factors
  const scoredPosts = gameState.wittPosts.map(post => {
    let score = 0;
    
    // Base recency score (newer posts get higher scores)
    const ageHours = (Date.now() - new Date(post.timestamp).getTime()) / (1000 * 60 * 60);
    score += Math.max(0, 100 - ageHours); // Decay over time
    
    // Interest alignment
    if (player.interests.includes(post.metadata.category)) {
      score += 50;
    }
    
    // Following bonus
    if (follows.has(post.authorId)) {
      score += 75;
    }
    
    // Engagement history
    const categoryPref = interactions.categoryPreferences[post.metadata.category] || 0;
    score += categoryPref * 10;
    
    // Personality match
    if (player.personality === post.metadata.personality) {
      score += 25;
    }
    
    // Location relevance
    if (post.metadata.location.includes(player.location.split(' ')[0])) {
      score += 30;
    }
    
    // Engagement metrics (popular posts get slight boost)
    score += (post.likes * 0.1) + (post.shares * 0.2) + (post.comments * 0.3);
    
    // Add some randomness to prevent feed staleness
    score += Math.random() * 20;
    
    return { ...post, personalizedScore: score };
  });
  
  // Sort by personalized score and apply pagination
  return scoredPosts
    .sort((a, b) => b.personalizedScore - a.personalizedScore)
    .slice(offset, offset + limit);
}

// Initialize data on startup
initializeDemoData();

// WebSocket handling for real-time updates
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
      
      // Echo back for demo purposes
      ws.send(JSON.stringify({ type: 'echo', data }));
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    ok: true, 
    message: 'StarTales Demo API server running',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/health',
      '/api/civilizations',
      '/api/characters',
      '/api/star-systems',
      '/api/witter/feed',
      '/api/exploration/status',
      '/api/settings'
    ]
  });
});

// Civilizations
app.get('/api/civilizations', (req, res) => {
  const civilizations = Array.from(gameState.civilizations.values());
  res.json({
    success: true,
    count: civilizations.length,
    civilizations
  });
});

app.get('/api/civilizations/:id', (req, res) => {
  const civilization = gameState.civilizations.get(req.params.id);
  if (!civilization) {
    return res.status(404).json({ error: 'Civilization not found' });
  }
  res.json({ success: true, civilization });
});

// Characters
app.get('/api/characters', (req, res) => {
  const characters = Array.from(gameState.characters.values());
  res.json({
    success: true,
    count: characters.length,
    characters
  });
});

app.get('/api/characters/:id', (req, res) => {
  const character = gameState.characters.get(req.params.id);
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }
  res.json({ success: true, character });
});

// Star Systems
app.get('/api/star-systems', (req, res) => {
  const starSystems = Array.from(gameState.starSystems.values());
  res.json({
    success: true,
    count: starSystems.length,
    starSystems
  });
});

app.get('/api/star-systems/:id', (req, res) => {
  const starSystem = gameState.starSystems.get(req.params.id);
  if (!starSystem) {
    return res.status(404).json({ error: 'Star system not found' });
  }
  res.json({ success: true, starSystem });
});

// Meme generation with cost control
const MEME_GENERATION_COOLDOWN = 5 * 60 * 1000; // 5 minutes between generations
const MAX_SHARED_MEMES = 50; // Maximum number of shared memes to keep

function generateMemeImagePrompt(content) {
  // Convert text content to image generation prompt
  const memePrompts = [
    "A hilarious space fantasy meme with mystical energy text overlay showing a confused crystal-tech mystic",
    "A galactic civilization meme with ethereal alien beings looking bewildered in floating crystal chambers",
    "A cosmic citadel meme with levitating magical objects and funny expressions on energy-beings",
    "A mystical meme showing sentient planets with glowing faces and cosmic expressions",
    "A zero-gravity magic meme with floating enchanted food and surprised crystal-armored characters",
    "A interdimensional travel meme with ethereal starships and humorous cosmic situations",
    "A magical alien companion meme with adorable energy creatures causing mystical chaos",
    "A cosmic energy brew meme with floating liquid starlight and tired space-mystics"
  ];
  
  return memePrompts[Math.floor(Math.random() * memePrompts.length)];
}

async function getOrCreateSharedMeme(content) {
  // Check if we can reuse an existing meme
  const existingMemes = Array.from(gameState.sharedMemes.values());
  if (existingMemes.length > 0 && Math.random() < 0.7) {
    // 70% chance to reuse existing meme
    const meme = existingMemes[Math.floor(Math.random() * existingMemes.length)];
    meme.usageCount++;
    return meme;
  }
  
  // Check rate limiting
  const now = Date.now();
  if (now - gameState.lastMemeGeneration < MEME_GENERATION_COOLDOWN) {
    // Use placeholder image if rate limited
    return {
      imageUrl: `https://via.placeholder.com/400x300/4ecdc4/0f0f23?text=Meme+Loading...`,
      prompt: "Rate limited - using placeholder",
      usageCount: 1,
      createdAt: now
    };
  }
  
  // Generate new meme (simulated - in real implementation would call image generation API)
  const prompt = generateMemeImagePrompt(content);
  const memeId = `meme_${now}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Simulate image generation with placeholder
  const imageUrl = `https://via.placeholder.com/400x300/4ecdc4/0f0f23?text=${encodeURIComponent(prompt.substring(0, 20))}`;
  
  const newMeme = {
    imageUrl,
    prompt,
    usageCount: 1,
    createdAt: now
  };
  
  // Store the meme
  gameState.sharedMemes.set(memeId, newMeme);
  gameState.lastMemeGeneration = now;
  
  // Clean up old memes if we have too many
  if (gameState.sharedMemes.size > MAX_SHARED_MEMES) {
    const oldestMemes = Array.from(gameState.sharedMemes.entries())
      .sort((a, b) => a[1].createdAt - b[1].createdAt)
      .slice(0, gameState.sharedMemes.size - MAX_SHARED_MEMES);
    
    oldestMemes.forEach(([id]) => gameState.sharedMemes.delete(id));
  }
  
  return newMeme;
}

// Dynamic post generation function
async function generateRandomPost() {
  const characters = [
    // Terran Federation (Sol System)
    { id: 'space_karen', name: 'Karen Stardust', type: 'citizen', civilization: 'Terran Federation', starSystem: 'Sol', planet: 'Mars', location: 'Mars Colony District 7', avatar: '😤', followers: 2847, personality: 'dramatic' },
    { id: 'coffee_addict_sarah', name: 'Sarah Nebula', type: 'citizen', civilization: 'Terran Federation', starSystem: 'Sol', planet: 'Europa', location: 'Europa Station', avatar: '☕', followers: 156, personality: 'relatable' },
    { id: 'dad_jokes_mike', name: 'Mike Asteroid', type: 'citizen', civilization: 'Terran Federation', starSystem: 'Sol', planet: 'Titan', location: 'Titan Outpost', avatar: '👨‍🚀', followers: 3421, personality: 'punny' },
    { id: 'workout_warrior', name: 'Flex Armstrong', type: 'citizen', civilization: 'Terran Federation', starSystem: 'Sol', planet: 'Mars', location: 'Mars Gym Complex', avatar: '💪', followers: 8934, personality: 'motivational' },
    { id: 'pet_lover_zoe', name: 'Zoe Starpaws', type: 'citizen', civilization: 'Terran Federation', starSystem: 'Sol', planet: 'Earth', location: 'Earth Pet Sanctuary', avatar: '🐱', followers: 12456, personality: 'wholesome' },
    { id: 'meme_lord_42', name: 'Jake "MemeLord" Cosmos', type: 'citizen', civilization: 'Terran Federation', starSystem: 'Sol', planet: 'Luna', location: 'Luna City', avatar: '😎', followers: 89234, personality: 'funny' },
    
    // Centauri Republic (Alpha Centauri System)
    { id: 'galactic_gossip', name: 'Stella Whispers', type: 'citizen', civilization: 'Centauri Republic', starSystem: 'Alpha Centauri', planet: 'Proxima b', location: 'Proxima Mall', avatar: '💅', followers: 156789, personality: 'gossipy' },
    { id: 'conspiracy_carl', name: 'Carl Truthseeker', type: 'citizen', civilization: 'Centauri Republic', starSystem: 'Alpha Centauri', planet: 'Proxima b', location: 'Underground Bunker X7', avatar: '🕵️', followers: 5678, personality: 'suspicious' },
    { id: 'alpha_artist', name: 'Nova Paintbrush', type: 'citizen', civilization: 'Centauri Republic', starSystem: 'Alpha Centauri', planet: 'Centauri Prime', location: 'Arts District', avatar: '🎨', followers: 23456, personality: 'creative' },
    
    // Vegan Collective (Vega System)
    { id: 'space_foodie', name: 'Chef Rocket Romano', type: 'citizen', civilization: 'Vegan Collective', starSystem: 'Vega', planet: 'Vega Prime', location: 'Culinary Station', avatar: '👨‍🍳', followers: 67432, personality: 'foodie' },
    { id: 'vega_musician', name: 'Harmony Starlight', type: 'citizen', civilization: 'Vegan Collective', starSystem: 'Vega', planet: 'Vega Prime', location: 'Concert Hall', avatar: '🎵', followers: 45678, personality: 'artistic' },
    
    // Kepler Technocracy (Kepler System)
    { id: 'tech_reviewer', name: 'Gadget Gary Galaxy', type: 'citizen', civilization: 'Kepler Technocracy', starSystem: 'Kepler', planet: 'Kepler-442b', location: 'Tech Hub', avatar: '🤖', followers: 234567, personality: 'techy' },
    { id: 'kepler_gamer', name: 'Pixel Pete', type: 'citizen', civilization: 'Kepler Technocracy', starSystem: 'Kepler', planet: 'Kepler-442b', location: 'VR Center', avatar: '🎮', followers: 87654, personality: 'gamer' },
    
    // Sirius Trade Consortium (Sirius System)
    { id: 'sirius_trader', name: 'Rex Goldbeard', type: 'citizen', civilization: 'Sirius Trade Consortium', starSystem: 'Sirius', planet: 'Sirius A-1', location: 'Trade Hub', avatar: '🏴‍☠️', followers: 34567, personality: 'entrepreneurial' },
    { id: 'sirius_explorer', name: 'Scout Nebula', type: 'citizen', civilization: 'Sirius Trade Consortium', starSystem: 'Sirius', planet: 'Sirius A-2', location: 'Deep Space Outpost', avatar: '🔭', followers: 12345, personality: 'adventurous' },
    
    // Media Organizations
    { id: 'galactic_news', name: 'Galactic News Network', type: 'media', civilization: 'Terran Federation', starSystem: 'Sol', planet: 'Earth', location: 'Broadcasting Center', avatar: '📺', followers: 2340000, personality: 'professional' },
    { id: 'space_times', name: 'The Space Times', type: 'media', civilization: 'Centauri Republic', starSystem: 'Alpha Centauri', planet: 'Centauri Prime', location: 'News Hub', avatar: '📰', followers: 1890000, personality: 'journalistic' },
    { id: 'cosmic_daily', name: 'Cosmic Daily Report', type: 'media', civilization: 'Vegan Collective', starSystem: 'Vega', planet: 'Vega Prime', location: 'Media Center', avatar: '🌌', followers: 1567000, personality: 'informative' },
    { id: 'kepler_tech_news', name: 'Kepler Tech Today', type: 'media', civilization: 'Kepler Technocracy', starSystem: 'Kepler', planet: 'Kepler-442b', location: 'News Station', avatar: '💻', followers: 890000, personality: 'technical' },
    
    // Officials
    { id: 'mayor_jenny', name: 'Mayor Jenny Starlight', type: 'official', civilization: 'Terran Federation', starSystem: 'Sol', planet: 'Mars', location: 'New Tokyo', avatar: '🏛️', followers: 45678, personality: 'approachable' },
    { id: 'dr_zara_chen', name: 'Dr. Zara Chen', type: 'official', civilization: 'Terran Federation', starSystem: 'Sol', planet: 'Mars', location: 'Research Station', avatar: '🧬', followers: 23456, personality: 'curious' },
    { id: 'captain_nova', name: 'Captain Nova Starwind', type: 'official', civilization: 'Terran Federation', starSystem: 'Sol', planet: 'Earth', location: 'Space Command', avatar: '🚀', followers: 78901, personality: 'adventurous' },
    { id: 'centauri_governor', name: 'Governor Aria Sol', type: 'official', civilization: 'Centauri Republic', starSystem: 'Alpha Centauri', planet: 'Centauri Prime', location: 'Capitol', avatar: '🕊️', followers: 156789, personality: 'diplomatic' },
    { id: 'vega_minister', name: 'Minister Zyx Quantum', type: 'official', civilization: 'Vegan Collective', starSystem: 'Vega', planet: 'Vega Prime', location: 'Science Ministry', avatar: '🔬', followers: 67890, personality: 'scientific' }
  ];

  const postTemplates = {
    citizen: [
      "Just spilled {drink} all over my space suit AGAIN 🤦‍♀️ Why do they make these cups so flimsy in zero-g? #SpaceProblems #MondayMood",
      "My neighbor's pet {alien_pet} got loose and ate my entire hydroponic garden 😭 Insurance better cover this! #NeighborProblems #PetLife",
      "Anyone else think the new {transport} routes are absolutely ridiculous? Takes 3 hours to get to {location} now! #PublicTransport #Rant",
      "Found the BEST {food} place on {planet}! Hidden gem, no tourists, authentic {cuisine}. DM me for location 😉 #FoodieFinds #LocalEats",
      "Why does my apartment's artificial gravity keep glitching? I'm tired of floating to the ceiling at 3am 😴 #TechFail #RentTooHigh",
      "Relationship status: In love with the barista at {coffee_shop} who draws little rockets in my foam ☕💕 #CrushAlert #CoffeeArt",
      "Just saw three shooting stars and made the same wish three times. That's how it works, right? 🌟 #WishUponAStar #Hopeful",
      "My mom called asking if I'm eating enough vegetables. Ma, I live on a space station, the lettuce costs 50 credits! 🥬💸 #MomProblems #SpaceLife"
    ],
    influencer: [
      "GUYS! Just tried the new {product} and I'm OBSESSED! 😍 Use my code SPACE20 for 20% off! #Sponsored #NotSponsored #JustKidding #Ad",
      "Day 47 of asking {company} to sponsor me. I have {followers} followers and I'm not giving up! 💪 #InfluencerLife #PersistencePaysOff",
      "Unpopular opinion: {controversial_topic} is actually overrated. Fight me in the comments! 🔥 #HotTake #ControversialOpinion",
      "Behind the scenes of my 'perfect' life: I haven't showered in 3 days and I'm eating cereal for dinner 🥣 #RealTalk #Authentic",
      "Collab with @{other_influencer} coming soon! Can't wait to show you what we've been working on 👀 #Collaboration #ComingSoon",
      "Remember when {old_trend} was a thing? Feeling nostalgic today 😌 Who else misses the good old days? #Nostalgia #ThrowbackThursday",
      "PSA: Stop asking me about my skincare routine. It's called good lighting and filters, people! 📸✨ #InfluencerSecrets #KeepingItReal",
      "Just hit {milestone} followers! Doing a giveaway to celebrate! Rules in my bio 🎉 #Giveaway #Grateful #Milestone"
    ],
    news: [
      "BREAKING: {event} reported in {location}. Authorities investigating. More details as they develop. #Breaking #News",
      "EXCLUSIVE: Sources confirm {celebrity} spotted at {location} with mysterious companion. Details inside. #Celebrity #Exclusive",
      "MARKET UPDATE: {commodity} prices surge 15% following {event}. Analysts predict continued volatility. #Markets #Economy",
      "WEATHER ALERT: Solar storm expected to affect {region} communications for next 48 hours. #Weather #SolarStorm",
      "POLITICS: {politician} announces new initiative for {cause}. Opposition calls it 'political theater.' #Politics #Policy",
      "TECH: New {technology} promises to revolutionize {industry}. Beta testing begins next month. #Technology #Innovation",
      "SPORTS: {team} defeats {opponent} in stunning upset. Fans celebrate across {location}. #Sports #Victory",
      "CULTURE: {event} festival draws record crowds to {location}. Economic impact estimated at {amount} credits. #Culture #Festival"
    ],
    gossip: [
      "Tea time! 🍵 Heard through the grapevine that {celebrity1} and {celebrity2} were seen together at {location}... 👀 #Tea #Gossip",
      "Not me refreshing {celebrity}'s profile every 5 minutes waiting for them to address the {scandal} 🍿 #Drama #PopcornReady",
      "The AUDACITY of {person} to post that after what happened at {event}! We all saw the footage! 📹 #Exposed #Receipts",
      "Okay but can we talk about {celebrity}'s outfit at {event}? I have THOUGHTS and they're not all positive... 👗 #Fashion #Critique",
      "Plot twist: {rumor} was actually true this whole time! I called it 3 months ago, check my posts! 🔮 #CalledIt #Vindicated",
      "Someone needs to tell {celebrity} that their PR team is NOT doing them any favors right now 💀 #PRDisaster #Yikes",
      "The way {person1} unfollowed {person2} right after {event}... the pettiness is SENDING me! 😂 #SocialMediaDrama #Petty",
      "I'm not saying {theory} but I'm also not NOT saying it... connect the dots, people! 🧩 #Conspiracy #ConnectTheDots"
    ],
    food: [
      "Just made {dish} with {ingredient} from {planet} and it's INCREDIBLE! Recipe in comments 👇 #Cooking #Foodie #Recipe",
      "Unpopular opinion: {food} is overrated and I will die on this hill! 🏔️ #FoodTake #Controversial #SorryNotSorry",
      "Found a {restaurant} that serves {cuisine} and now I'm questioning everything I thought I knew about flavor 🤯 #FoodDiscovery #MindBlown",
      "Day 12 of trying to recreate my grandmother's {dish} recipe. Still tastes like sadness and regret 😭 #CookingFail #GrandmasRecipe",
      "PSA: If you put {topping} on {food}, we can't be friends. I don't make the rules 🤷‍♀️ #FoodRules #Boundaries",
      "The {restaurant} on {street} has the BEST {dish} in the galaxy and I will fight anyone who disagrees! ⚔️ #FoodFight #BestInGalaxy",
      "Trying to eat healthy but the vending machine keeps calling my name... Send help 🆘 #HealthyEating #Struggle #VendingMachineProblems",
      "Made {drink} with {ingredient} and accidentally created rocket fuel. My kitchen may never recover 🚀💥 #CookingDisaster #AccidentalRocketFuel"
    ],
    meme: [
      "When someone asks me to explain {current_event}: *confused screaming* 😵‍💫 #Mood #CurrentEvents #Confused",
      "Me: I'll just check social media for 5 minutes. Also me, 3 hours later: How did I end up watching videos of {random_topic}? 🕳️ #SocialMediaHole #Relatable",
      "Plot twist: {everyday_object} was the villain all along! 🦹‍♀️ #PlotTwist #Villain #Unexpected",
      "Nobody: Absolutely nobody: Me at 3am: What if {random_thought}? 🤔 #3amThoughts #RandomThoughts #Insomnia",
      "Life hack: If you pretend {problem} doesn't exist, it will... still exist but at least you had a moment of peace ✌️ #LifeHack #Denial #Peace",
      "Current mood: {emotion} with a side of {other_emotion} and a sprinkle of existential dread ✨ #Mood #Existential #Relatable",
      "Breaking: Local person discovers {obvious_thing}, more at 11 📺 #Breaking #Obvious #LocalNews",
      "Update: Still {status}, will report back if anything changes (spoiler: it won't) 📊 #Update #Status #Spoiler"
    ],
    official: [
      "Pleased to announce the successful completion of {project} in {location}. This initiative will benefit all citizens. #Progress #Community",
      "New safety protocols have been implemented for {transport} systems. Your safety is our priority. #Safety #PublicService",
      "Exciting developments in {technology} research at our facilities. The future is bright! #Innovation #Science",
      "Reminder: {event} registration closes tomorrow. Don't miss this opportunity for civic engagement. #CivicDuty #Community",
      "Infrastructure improvements to {location} are ahead of schedule. Thank you for your patience during construction. #Infrastructure #Progress",
      "Honored to meet with {delegation} representatives today. Strengthening inter-system cooperation. #Diplomacy #Unity",
      "Budget allocation for {cause} has been approved. Investing in our shared future. #Budget #Investment #Future",
      "Emergency response drill scheduled for {date}. Preparedness keeps us all safe. #Emergency #Preparedness #Safety"
    ]
  };

  const character = characters[Math.floor(Math.random() * characters.length)];
  
  // Map character types to content categories
  let category;
  let isImagePost = false;
  
  if (character.type === 'citizen') {
    const rand = Math.random();
    if (rand < 0.4) category = 'citizen';
    else if (rand < 0.6) category = 'food';
    else if (rand < 0.8) category = 'gossip';
    else {
      // 20% chance for citizens to post memes (with images)
      category = 'citizen';
      isImagePost = Math.random() < 0.3; // 30% of citizen posts are image memes
    }
  } else if (character.type === 'media') {
    category = 'news';
  } else if (character.type === 'official') {
    // Officials post more formal content but occasionally citizen-like posts
    const rand = Math.random();
    if (rand < 0.7) category = 'official';
    else category = 'citizen';
  } else {
    // Fallback
    category = 'citizen';
  }
  
  const templates = postTemplates[category] || postTemplates['citizen'];
  let content = templates[Math.floor(Math.random() * templates.length)];
  
  // Replacement data for funny content
  const replacements = {
    // Locations
    location: ['Mars Mall', 'Luna City', 'Europa Station', 'Titan Outpost', 'Alpha Centauri Hub', 'Vega Plaza', 'Earth District 9'],
    planet: ['Mars', 'Europa', 'Titan', 'Luna', 'Kepler-442b', 'Proxima b', 'Earth'],
    
    // Food & Drinks
    drink: ['space coffee', 'quantum tea', 'nebula smoothie', 'asteroid juice', 'cosmic latte', 'zero-g cola'],
    food: ['space pizza', 'lunar burgers', 'martian tacos', 'asteroid soup', 'cosmic noodles', 'galaxy wraps'],
    dish: ['quantum pasta', 'nebula stir-fry', 'cosmic curry', 'stellar soup', 'galactic goulash', 'space spaghetti'],
    ingredient: ['moon cheese', 'star fruit', 'cosmic herbs', 'nebula spices', 'asteroid salt', 'quantum pepper'],
    cuisine: ['Martian', 'Lunar', 'Europan', 'Titanian', 'Centauri', 'Vegan'],
    restaurant: ['Rocket Burger', 'The Cosmic Cafe', 'Nebula Noodles', 'Stellar Steakhouse', 'Galaxy Grill'],
    
    // Everyday items
    alien_pet: ['space hamster', 'quantum cat', 'nebula fish', 'cosmic gecko', 'stellar snake', 'galactic guinea pig'],
    transport: ['hover-bus', 'space-tube', 'quantum-rail', 'teleporter', 'rocket-taxi', 'warp-shuttle'],
    product: ['HoloPhone X', 'Quantum Cleaner', 'Anti-Grav Shoes', 'Neural Headset', 'Space Suit 3000'],
    
    // Social media stuff
    celebrity: ['Jake Cosmos', 'Stella Whispers', 'Rocket Romano', 'Nova Starwind', 'Zara Chen'],
    company: ['SpaceX-tra', 'Quantum Corp', 'Nebula Industries', 'Cosmic Enterprises', 'Stellar Systems'],
    followers: ['50K', '100K', '500K', '1M', '2.5M'],
    milestone: ['10K', '50K', '100K', '500K', '1M'],
    
    // Emotions & moods
    emotion: ['tired', 'confused', 'excited', 'overwhelmed', 'caffeinated', 'existential'],
    other_emotion: ['anxiety', 'hope', 'chaos', 'determination', 'procrastination', 'hunger'],
    
    // Random stuff
    random_topic: ['dancing aliens', 'quantum cooking', 'space cats', 'cosmic conspiracy theories', 'zero-g yoga'],
    random_thought: ['aliens invented pizza', 'gravity is overrated', 'space is just really big water', 'time is a social construct'],
    problem: ['Monday', 'adulting', 'gravity', 'my responsibilities', 'the void', 'my bank account'],
    status: ['confused', 'caffeinated', 'procrastinating', 'existing', 'vibing', 'questioning reality'],
    
    // News stuff
    event: ['Solar Flare Disruption', 'Asteroid Mining Strike', 'Space Station Malfunction', 'Alien Contact Signal'],
    politician: ['Mayor Starlight', 'Senator Cosmos', 'Governor Nebula', 'President Galaxy'],
    technology: ['Quantum Computing', 'Neural Interface', 'Teleportation Device', 'Time Dilator'],
    industry: ['space travel', 'asteroid mining', 'terraforming', 'quantum communication']
  };
  
  // Replace placeholders with appropriate content
  Object.keys(replacements).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g');
    content = content.replace(regex, () => {
      const options = replacements[key];
      return options[Math.floor(Math.random() * options.length)];
    });
  });
  
  // Engagement based on follower count and content type
  const baseEngagement = Math.log10(character.followers || 1000) * 10;
  const viralBonus = (isImagePost || category === 'gossip') ? 2 : 1; // Image posts get viral bonus
  const newsBonus = category === 'news' ? 3 : 1;
  
  const post = {
    id: `witt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    authorId: character.id,
    authorName: character.name,
    authorType: character.type.toUpperCase(),
    content,
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(), // Random time in last 2 days
    likes: Math.floor((Math.random() * baseEngagement * viralBonus * newsBonus) + 1),
    shares: Math.floor((Math.random() * baseEngagement * viralBonus * 0.3) + 1),
    comments: Math.floor((Math.random() * baseEngagement * 0.4) + 1),
    isLiked: false,
    isShared: false,
    avatar: character.avatar,
    followers: character.followers,
    metadata: {
      gameContext: category.charAt(0).toUpperCase() + category.slice(1),
      location: character.location,
      civilization: character.civilization,
      starSystem: character.starSystem,
      planet: character.planet,
      sourceType: character.type, // citizen, media, official
      category,
      topics: [category, 'social'],
      personality: character.personality,
      hasImage: isImagePost
    }
  };
  
  // Add image data for meme posts
  if (isImagePost) {
    const meme = await getOrCreateSharedMeme(content);
    post.image = {
      url: meme.imageUrl,
      alt: meme.prompt,
      type: 'meme'
    };
    // Boost engagement for image posts
    post.likes = Math.floor(post.likes * 1.5);
    post.shares = Math.floor(post.shares * 2);
    post.comments = Math.floor(post.comments * 1.3);
  }
  
  return post;
}

// Personalized Witter Feed
app.get('/api/witter/feed', async (req, res) => {
  const { limit = 10, offset = 0, category, civilization, starSystem, planet, sourceType, playerId = 'Commander_Alpha' } = req.query;
  
  // Generate posts to ensure we have hundreds per location/civilization
  const targetPostCount = 500; // Target 500 posts total
  if (gameState.wittPosts.length < targetPostCount) {
    const postsToGenerate = Math.min(50, targetPostCount - gameState.wittPosts.length); // Generate up to 50 at a time
    for (let i = 0; i < postsToGenerate; i++) {
      const newPost = await generateRandomPost();
      gameState.wittPosts.push(newPost);
    }
  }
  
  let posts;
  
  // Apply filters
  let filteredPosts = gameState.wittPosts;
  
  if (category && category !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.metadata.category === category);
  }
  
  if (civilization && civilization !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.metadata.civilization === civilization);
  }
  
  if (starSystem && starSystem !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.metadata.starSystem === starSystem);
  }
  
  if (planet && planet !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.metadata.planet === planet);
  }
  
  if (sourceType && sourceType !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.metadata.sourceType === sourceType);
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
  const interactions = gameState.interactions.get(playerId);
  if (interactions) {
    posts.forEach(post => {
      interactions.views.add(post.id);
      // Update category preferences based on views
      const category = post.metadata.category;
      interactions.categoryPreferences[category] = (interactions.categoryPreferences[category] || 0) + 0.1;
    });
  }
  
  res.json({
    success: true,
    posts,
    pagination: {
      total: gameState.wittPosts.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: parseInt(offset) + parseInt(limit) < gameState.wittPosts.length
    },
    personalization: {
      playerId,
      followsCount: gameState.follows.get(playerId)?.size || 0,
      interactionCount: interactions?.views.size || 0
    }
  });
});

app.post('/api/witter/posts', (req, res) => {
  const { content, authorId = 'player', authorName = 'Commander Alpha' } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  const newPost = {
    id: `witt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    authorId,
    authorName,
    authorType: 'PLAYER',
    content,
    timestamp: new Date().toISOString(),
    likes: 0,
    shares: 0,
    comments: 0,
    isLiked: false,
    isShared: false,
    metadata: {
      gameContext: 'Player Post',
      location: 'Sol System - Earth Orbit',
      category: 'social',
      topics: ['general'],
      personality: 'player'
    }
  };
  
  gameState.wittPosts.unshift(newPost);
  
  // Broadcast to WebSocket clients
  const message = JSON.stringify({
    type: 'new_witt_post',
    post: newPost
  });
  
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
  
  res.json({ success: true, post: newPost });
});

app.post('/api/witter/posts/:id/like', (req, res) => {
  const post = gameState.wittPosts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  post.isLiked = !post.isLiked;
  post.likes += post.isLiked ? 1 : -1;
  
  res.json({ success: true, post });
});

app.post('/api/witter/posts/:id/share', (req, res) => {
  const { playerId = 'Commander_Alpha' } = req.body;
  const post = gameState.wittPosts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  // Track interaction for personalization
  const interactions = gameState.interactions.get(playerId);
  if (interactions) {
    if (post.isShared) {
      interactions.shares.delete(post.id);
    } else {
      interactions.shares.add(post.id);
    }
    // Boost category preference for shared content
    const category = post.metadata.category;
    interactions.categoryPreferences[category] = (interactions.categoryPreferences[category] || 0) + 0.5;
  }
  
  post.isShared = !post.isShared;
  post.shares += post.isShared ? 1 : -1;
  
  res.json({ success: true, post });
});

// Get comments for a post
app.get('/api/witter/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  
  // Generate comments if they don't exist yet
  if (!gameState.comments.has(postId)) {
    const commentCount = Math.floor(Math.random() * 8) + 2; // 2-9 comments
    const comments = generateCommentsForPost(postId, commentCount);
    gameState.comments.set(postId, comments);
  }
  
  const comments = gameState.comments.get(postId) || [];
  
  res.json({
    success: true,
    comments,
    total: comments.length
  });
});

// Add a comment to a post
app.post('/api/witter/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const { content, authorId = 'Commander_Alpha', authorName = 'Commander Alpha' } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Comment content is required' });
  }
  
  const post = gameState.wittPosts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  // Get player info for avatar
  const player = gameState.players.get(authorId);
  const avatar = player?.avatar || '👤';
  
  const newComment = {
    id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    postId,
    authorId,
    authorName,
    authorType: 'PLAYER',
    avatar,
    content,
    timestamp: new Date().toISOString(),
    likes: 0,
    replies: 0,
    isLiked: false
  };
  
  // Add comment to post's comment list
  if (!gameState.comments.has(postId)) {
    gameState.comments.set(postId, []);
  }
  gameState.comments.get(postId).push(newComment);
  
  // Update post comment count
  post.comments += 1;
  
  // Track interaction for personalization
  const interactions = gameState.interactions.get(authorId);
  if (interactions) {
    interactions.comments.add(postId);
    // Strong boost for commented content category
    const category = post.metadata.category;
    interactions.categoryPreferences[category] = (interactions.categoryPreferences[category] || 0) + 1.0;
  }
  
  // Broadcast to WebSocket clients
  const message = JSON.stringify({
    type: 'new_comment',
    postId,
    comment: newComment
  });
  
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
  
  res.json({ success: true, comment: newComment });
});

// Follow/Unfollow a user
app.post('/api/witter/follow', (req, res) => {
  const { playerId, targetId } = req.body;
  
  if (!playerId || !targetId) {
    return res.status(400).json({ error: 'playerId and targetId are required' });
  }
  
  if (!gameState.follows.has(playerId)) {
    gameState.follows.set(playerId, new Set());
  }
  
  const follows = gameState.follows.get(playerId);
  const isFollowing = follows.has(targetId);
  
  if (isFollowing) {
    follows.delete(targetId);
  } else {
    follows.add(targetId);
  }
  
  res.json({
    success: true,
    following: !isFollowing,
    followsCount: follows.size
  });
});

// Get follow status
app.get('/api/witter/follow/:playerId/:targetId', (req, res) => {
  const { playerId, targetId } = req.params;
  
  const follows = gameState.follows.get(playerId) || new Set();
  const isFollowing = follows.has(targetId);
  
  res.json({
    success: true,
    following: isFollowing,
    followsCount: follows.size
  });
});

// Get player profile
app.get('/api/witter/profile/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  const player = gameState.players.get(playerId);
  
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  
  const follows = gameState.follows.get(playerId) || new Set();
  const interactions = gameState.interactions.get(playerId) || {};
  
  res.json({
    success: true,
    profile: {
      ...player,
      followsCount: follows.size,
      followsList: Array.from(follows),
      stats: {
        postsViewed: interactions.views?.size || 0,
        postsLiked: interactions.likes?.size || 0,
        postsShared: interactions.shares?.size || 0,
        commentsPosted: interactions.comments?.size || 0
      },
      preferences: interactions.categoryPreferences || {}
    }
  });
});

// Exploration
app.get('/api/exploration/status', (req, res) => {
  res.json({
    success: true,
    ...gameState.explorationData,
    recentDiscoveries: [
      {
        id: 'discovery_001',
        type: 'system',
        name: 'Kepler-442 System',
        description: 'Discovered habitable planets with unique crystalline formations',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        discoveryPoints: 150
      },
      {
        id: 'discovery_002',
        type: 'race',
        name: 'Crystalline Entities',
        description: 'Silicon-based lifeforms with collective intelligence',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        discoveryPoints: 200
      }
    ]
  });
});

app.post('/api/exploration/expeditions', (req, res) => {
  const { target, duration = 3600, crewSize = 5 } = req.body;
  
  if (!target) {
    return res.status(400).json({ error: 'Target is required' });
  }
  
  const expedition = {
    id: `exp_${Date.now()}`,
    target,
    duration,
    crewSize,
    status: 'active',
    startTime: new Date().toISOString(),
    estimatedCompletion: new Date(Date.now() + duration * 1000).toISOString(),
    risk: Math.random() * 0.3 + 0.1, // 10-40% risk
    expectedReward: Math.floor(Math.random() * 100) + 50
  };
  
  gameState.explorationData.activeExpeditions++;
  
  res.json({ success: true, expedition });
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json({
    success: true,
    settings: gameState.gameSettings
  });
});

app.post('/api/settings', (req, res) => {
  const { gameMode, resolutionMode, visualLevel } = req.body;
  
  if (gameMode) gameState.gameSettings.gameMode = gameMode;
  if (resolutionMode) gameState.gameSettings.resolutionMode = resolutionMode;
  if (visualLevel) gameState.gameSettings.visualLevel = visualLevel;
  
  res.json({ 
    success: true, 
    message: 'Settings updated',
    settings: gameState.gameSettings 
  });
});

// Galaxy Statistics
app.get('/api/galaxy/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalSystems: gameState.starSystems.size,
      totalCivilizations: gameState.civilizations.size,
      totalCharacters: gameState.characters.size,
      totalPosts: gameState.wittPosts.length,
      playerLevel: gameState.explorationData.playerLevel,
      discoveryPoints: gameState.explorationData.discoveryPoints,
      knownRaces: gameState.explorationData.knownRaces,
      activeExpeditions: gameState.explorationData.activeExpeditions
    }
  });
});

// Provider Settings (mock for compatibility)
app.get('/api/providers', (req, res) => {
  res.json({
    success: true,
    providers: [
      { id: 'demo', name: 'Demo Provider', status: 'active', type: 'mock' },
      { id: 'ollama', name: 'Ollama', status: 'available', type: 'llm' },
      { id: 'openai', name: 'OpenAI', status: 'configured', type: 'llm' }
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

const port = process.env.PORT || 4000;
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 StarTales Demo API server running on http://localhost:${port}`);
  console.log(`📡 Health check: http://localhost:${port}/api/health`);
  console.log(`🌐 WebSocket server ready for real-time updates`);
  console.log(`📊 Demo data initialized:`);
  console.log(`   - ${gameState.starSystems.size} star systems`);
  console.log(`   - ${gameState.civilizations.size} civilizations`);
  console.log(`   - ${gameState.characters.size} characters`);
  console.log(`   - ${gameState.wittPosts.length} witter posts`);
});
