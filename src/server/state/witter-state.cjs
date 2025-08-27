// ===== WITTER SOCIAL NETWORK SYSTEM =====
const witterGameState = {
  posts: [],
  characters: new Map(),
  interactions: new Map(), // Player interactions for personalization
  comments: new Map(), // Post ID -> comments array
  follows: new Map(), // User ID -> followed user IDs
  globalPostCounter: 1,
  globalCharacterCounter: 1,
  globalCommentCounter: 1,

  // Character types and categories
  characterTypes: [
    'citizen', 'official', 'media', 'expert', 'celebrity', 'influencer', 'trader', 'explorer'
  ],

  // Civilizations in the galaxy
  civilizations: [
    'Terran Federation', 'Centauri Republic', 'Vegan Collective', 
    'Kepler Technocracy', 'Sirius Trade Consortium', 'Andromeda Alliance'
  ],

  // Star systems
  starSystems: [
    'Sol', 'Alpha Centauri', 'Vega', 'Kepler', 'Sirius', 'Proxima', 'Arcturus'
  ],

  // Planets by star system
  planets: {
    'Sol': ['Earth', 'Mars', 'Europa', 'Titan'],
    'Alpha Centauri': ['Proxima b', 'Centauri Prime', 'New Geneva'],
    'Vega': ['Vega Prime', 'Lyra Station', 'Crystal World'],
    'Kepler': ['Kepler-442b', 'New Kepler', 'Research Station Alpha'],
    'Sirius': ['Sirius A-1', 'Sirius A-2', 'Trade Hub Central'],
    'Proxima': ['Proxima Colony', 'Red Dwarf Station'],
    'Arcturus': ['Arcturus Prime', 'Golden Sphere']
  },

  // Professions
  professions: [
    'Engineer', 'Scientist', 'Trader', 'Artist', 'Explorer', 'Teacher', 
    'Medic', 'Pilot', 'Miner', 'Diplomat', 'Chef', 'Architect', 'Journalist'
  ],

  // Personality types
  personalities: [
    'optimistic', 'cynical', 'humorous', 'serious', 'adventurous', 'cautious',
    'analytical', 'creative', 'pragmatic', 'idealistic', 'rebellious', 'diplomatic'
  ],

  // Content categories
  contentCategories: [
    'citizen_life', 'citizen_commentary', 'official_announcement', 'media_report',
    'expert_analysis', 'entertainment', 'trade_update', 'exploration_news'
  ],

  // Current galactic events (for context)
  currentEvents: [
    'Galactic Trade Summit concludes with new agreements',
    'Quantum communication breakthrough enables instant messaging',
    'Interstellar mining rights dispute resolved peacefully',
    'New hyperspace route discovered between Vega and Kepler',
    'Diplomatic tensions ease between Terran Federation and Centauri Republic'
  ]
};

function initializeWitterSystem() {
  // Initialize with some sample characters
  const sampleCharacters = [
    {
      name: 'Commander Sarah Chen',
      type: 'official',
      civilization: 'Terran Federation',
      starSystem: 'Sol',
      planet: 'Earth',
      location: 'Geneva Spaceport',
      profession: 'Diplomat',
      personality: 'diplomatic',
      followers: 125000,
      verified: true
    },
    {
      name: 'Dr. Zara Okafor',
      type: 'expert',
      civilization: 'Kepler Technocracy',
      starSystem: 'Kepler',
      planet: 'Kepler-442b',
      location: 'Research Station Alpha',
      profession: 'Scientist',
      personality: 'analytical',
      followers: 89000,
      verified: true
    },
    {
      name: 'Captain Rex Goldbeard',
      type: 'citizen',
      civilization: 'Sirius Trade Consortium',
      starSystem: 'Sirius',
      planet: 'Trade Hub Central',
      location: 'Merchant Quarter',
      profession: 'Trader',
      personality: 'humorous',
      followers: 45000,
      verified: false
    },
    {
      name: 'Luna Starweaver',
      type: 'celebrity',
      civilization: 'Vegan Collective',
      starSystem: 'Vega',
      planet: 'Crystal World',
      location: 'Arts District',
      profession: 'Artist',
      personality: 'creative',
      followers: 234000,
      verified: true
    },
    {
      name: 'Marcus Ironforge',
      type: 'citizen',
      civilization: 'Centauri Republic',
      starSystem: 'Alpha Centauri',
      planet: 'Centauri Prime',
      location: 'Industrial Sector 7',
      profession: 'Engineer',
      personality: 'pragmatic',
      followers: 12000,
      verified: false
    }
  ];

  sampleCharacters.forEach(charData => {
    const character = createCharacter(charData);
    witterGameState.characters.set(character.id, character);
  });

  // Generate initial posts
  generateInitialPosts(20);

  console.log(`Witter system initialized with ${witterGameState.characters.size} characters and ${witterGameState.posts.length} posts`);
}

function createCharacter(charData) {
  const character = {
    id: `char_${witterGameState.globalCharacterCounter++}`,
    name: charData.name,
    type: charData.type || 'citizen',
    civilization: charData.civilization,
    starSystem: charData.starSystem,
    planet: charData.planet,
    location: charData.location,
    profession: charData.profession,
    personality: charData.personality,
    followers: charData.followers || Math.floor(Math.random() * 50000) + 1000,
    following: Math.floor(Math.random() * 500) + 50,
    verified: charData.verified || false,
    avatar: generateAvatar(charData.type, charData.profession),
    joinDate: charData.joinDate || new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    bio: generateBio(charData),
    postCount: 0,
    lastActive: new Date()
  };

  return character;
}

function generateAvatar(type, profession) {
  const avatars = {
    official: ['👨‍💼', '👩‍💼', '🎖️', '⭐', '🏛️'],
    expert: ['👨‍🔬', '👩‍🔬', '🧠', '🔬', '📊'],
    media: ['📺', '📰', '🎤', '📻', '🎬'],
    celebrity: ['⭐', '🌟', '✨', '🎭', '🎨'],
    citizen: ['👨', '👩', '🧑', '👤', '😊'],
    trader: ['💰', '📈', '💼', '🏪', '⚖️'],
    explorer: ['🚀', '🔭', '🌌', '🗺️', '⛰️']
  };

  const professionAvatars = {
    Engineer: ['⚙️', '🔧', '🛠️', '⚡', '🏗️'],
    Scientist: ['🧪', '🔬', '🧬', '⚗️', '🔭'],
    Pilot: ['✈️', '🚁', '🛸', '🚀', '👨‍✈️'],
    Artist: ['🎨', '🖌️', '🎭', '🖼️', '✨'],
    Medic: ['⚕️', '🏥', '💊', '🩺', '❤️']
  };

  const typeAvatars = avatars[type] || avatars.citizen;
  const profAvatars = professionAvatars[profession] || [];
  
  const allAvatars = [...typeAvatars, ...profAvatars];
  return allAvatars[Math.floor(Math.random() * allAvatars.length)];
}

function generateBio(charData) {
  const templates = [
    `${charData.profession} living on ${charData.planet}. ${charData.personality} by nature.`,
    `Proud citizen of ${charData.civilization}. ${charData.profession} with a ${charData.personality} outlook.`,
    `From ${charData.location}, ${charData.planet}. ${charData.profession} who believes in progress.`,
    `${charData.personality.charAt(0).toUpperCase() + charData.personality.slice(1)} ${charData.profession} exploring the galaxy one day at a time.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateUniqueCharacter() {
  // Generate a completely unique character
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
  const name = `${firstName} ${lastName}`;

  const civilization = witterGameState.civilizations[Math.floor(Math.random() * witterGameState.civilizations.length)];
  const starSystem = witterGameState.starSystems[Math.floor(Math.random() * witterGameState.starSystems.length)];
  const planets = witterGameState.planets[starSystem] || ['Unknown Planet'];
  const planet = planets[Math.floor(Math.random() * planets.length)];
  
  const locations = [
    'Downtown District', 'Spaceport Terminal', 'Research Quarter', 'Trade Center',
    'Residential Zone', 'Industrial Sector', 'Cultural District', 'Government Plaza'
  ];
  const location = locations[Math.floor(Math.random() * locations.length)];

  const charData = {
    name,
    type: witterGameState.characterTypes[Math.floor(Math.random() * witterGameState.characterTypes.length)],
    civilization,
    starSystem,
    planet,
    location,
    profession: witterGameState.professions[Math.floor(Math.random() * witterGameState.professions.length)],
    personality: witterGameState.personalities[Math.floor(Math.random() * witterGameState.personalities.length)],
    followers: Math.floor(Math.random() * 100000) + 500,
    verified: Math.random() < 0.1 // 10% chance of being verified
  };

  return createCharacter(charData);
}

function generateAIPostContent(character, gameContext) {
  // Generate AI-powered content based on character and context
  const contentType = character.type === 'official' ? 'official_announcement' : 
                     character.type === 'media' ? 'media_report' : 
                     character.type === 'expert' ? 'expert_analysis' :
                     (Math.random() < 0.6 ? 'citizen_life' : 'citizen_commentary');

  const templates = {
    citizen_life: [
      `Just finished my shift at the ${character.profession.toLowerCase()} facility on ${character.planet}. The view of ${character.starSystem} from here never gets old! 🌌`,
      `Living the ${character.personality} life on ${character.planet}! Today's ${character.profession.toLowerCase()} work had some interesting challenges. #GalacticLife`,
      `Another day in ${character.location}, ${character.planet}. Being a ${character.profession.toLowerCase()} in the ${character.civilization} has its perks! ✨`,
      `${character.personality.charAt(0).toUpperCase() + character.personality.slice(1)} mood today! Working as a ${character.profession.toLowerCase()} on ${character.planet} keeps life interesting. 🚀`
    ],
    
    citizen_commentary: [
      `As a ${character.profession.toLowerCase()} on ${character.planet}, I think the recent ${gameContext.currentEvents[0]} will impact our daily lives significantly. Thoughts? 🤔`,
      `From my ${character.personality} perspective here in ${character.civilization}, the galactic situation is ${Math.random() < 0.5 ? 'improving' : 'concerning'}. What do you think?`,
      `Working in ${character.location} gives me a unique view of how ${gameContext.currentEvents[1]} affects regular citizens. We need more transparency! 📢`,
      `The ${character.personality} in me says we should ${Math.random() < 0.5 ? 'embrace' : 'carefully consider'} these recent changes. #GalacticPolitics`
    ],
    
    official_announcement: [
      `🏛️ OFFICIAL UPDATE: The ${character.civilization} is pleased to announce progress on ${gameContext.currentEvents[0]}. More details to follow.`,
      `📢 From ${character.location}: We're monitoring the situation regarding ${gameContext.currentEvents[1]} and will provide updates as needed.`,
      `⭐ As your representative from ${character.planet}, I want to assure citizens that ${gameContext.currentEvents[2]} is being handled with utmost care.`,
      `🎖️ Official statement: The recent developments in ${gameContext.currentEvents[Math.floor(Math.random() * gameContext.currentEvents.length)]} align with our long-term strategic goals.`
    ],
    
    media_report: [
      `📰 BREAKING: Sources from ${character.starSystem} confirm that ${gameContext.currentEvents[0]} has broader implications than initially reported. Investigating...`,
      `🎤 EXCLUSIVE: Our investigation into ${gameContext.currentEvents[1]} reveals interesting connections to ${character.civilization} policies. Story developing.`,
      `📺 LIVE from ${character.planet}: The impact of ${gameContext.currentEvents[2]} on local communities is becoming clearer. Full report tonight.`,
      `📻 UPDATE: New information about ${gameContext.currentEvents[Math.floor(Math.random() * gameContext.currentEvents.length)]} suggests this story is far from over.`
    ],
    
    expert_analysis: [
      `🧠 ANALYSIS: As a ${character.profession.toLowerCase()}, I believe ${gameContext.currentEvents[0]} represents a significant shift in galactic dynamics. Here's why... [Thread 1/3]`,
      `📊 DATA INSIGHT: My research on ${character.planet} shows that ${gameContext.currentEvents[1]} correlates with trends we've been tracking for months.`,
      `🔬 EXPERT OPINION: The ${character.personality} approach to ${gameContext.currentEvents[2]} might be exactly what the galaxy needs right now.`,
      `⚗️ RESEARCH UPDATE: Our findings from ${character.location} suggest that ${gameContext.currentEvents[Math.floor(Math.random() * gameContext.currentEvents.length)]} could have long-term benefits.`
    ]
  };

  const contentOptions = templates[contentType] || templates.citizen_life;
  return contentOptions[Math.floor(Math.random() * contentOptions.length)];
}

function generateRandomPost() {
  const character = generateUniqueCharacter();
  const gameContext = {
    currentEvents: witterGameState.currentEvents,
    politicalClimate: 'cautiously optimistic',
    economicStatus: 'steady growth with regional variations'
  };

  const content = generateAIPostContent(character, gameContext);

  const post = {
    id: `witt_${witterGameState.globalPostCounter++}`,
    authorId: character.id,
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
    engagement: 0 // Will be calculated
  };

  // Calculate engagement rate
  post.engagement = ((post.likes + post.shares * 2 + post.comments * 3) / post.followers * 100).toFixed(2);

  // Store character for future reference
  witterGameState.characters.set(character.id, character);
  
  return post;
}

function generateInitialPosts(count) {
  for (let i = 0; i < count; i++) {
    const post = generateRandomPost();
    witterGameState.posts.push(post);
  }
}

function generatePersonalizedFeed(playerId, limit, offset) {
  const playerInteractions = witterGameState.interactions.get(playerId) || { 
    views: [], likes: [], shares: [], comments: [] 
  };
  
  // Ensure we have enough posts
  const targetPostCount = 500;
  if (witterGameState.posts.length < targetPostCount) {
    const postsToGenerate = Math.min(50, targetPostCount - witterGameState.posts.length);
    for (let i = 0; i < postsToGenerate; i++) {
      const newPost = generateRandomPost();
      witterGameState.posts.push(newPost);
    }
  }

  // Score posts based on player interactions
  const scoredPosts = witterGameState.posts.map(post => {
    let score = Math.random() * 100; // Base randomness

    // Boost posts from characters the player has interacted with
    const hasInteracted = playerInteractions.views.includes(post.authorId) ||
                         playerInteractions.likes.includes(post.id) ||
                         playerInteractions.shares.includes(post.id) ||
                         playerInteractions.comments.some(c => c.postId === post.id);

    if (hasInteracted) score += 50;

    // Boost recent posts
    const age = Date.now() - new Date(post.timestamp).getTime();
    const ageHours = age / (1000 * 60 * 60);
    if (ageHours < 24) score += 30;
    if (ageHours < 6) score += 20;

    // Boost posts with high engagement
    score += (post.likes + post.shares * 2 + post.comments * 3) * 0.1;

    // Boost posts from popular accounts
    score += Math.log10(post.followers + 1) * 2;

    return { ...post, personalizedScore: score };
  });

  // Sort by score and return requested slice
  scoredPosts.sort((a, b) => b.personalizedScore - a.personalizedScore);
  return scoredPosts.slice(offset, offset + limit);
}

function generateComment(character, postId) {
  const originalPost = witterGameState.posts.find(p => p.id === postId);
  if (!originalPost) return null;

  const reactions = [
    `Interesting perspective from ${character.planet}! 🌟`,
    `As a ${character.profession}, I can relate to this`,
    `This resonates with us in ${character.civilization}`,
    `${character.personality.charAt(0).toUpperCase() + character.personality.slice(1)} take: this is spot on!`,
    `From ${character.location}, we see this differently`,
    `My experience as a ${character.profession} says otherwise`,
    `Classic ${character.starSystem} situation right here 😄`,
    `Great point! We're dealing with similar issues on ${character.planet}`,
    `The ${character.personality} in me agrees completely! 👍`,
    `This is why I love the diversity of the ${character.civilization}! ✨`
  ];

  const comment = {
    id: `comment_${witterGameState.globalCommentCounter++}`,
    postId: postId,
    authorId: character.id,
    author: character.name,
    avatar: character.avatar,
    content: reactions[Math.floor(Math.random() * reactions.length)],
    timestamp: new Date().toISOString(),
    likes: Math.floor(Math.random() * 20) + 1,
    verified: character.verified
  };

  // Store comment
  if (!witterGameState.comments.has(postId)) {
    witterGameState.comments.set(postId, []);
  }
  witterGameState.comments.get(postId).push(comment);

  return comment;
}

function getWitterAnalytics() {
  const analytics = {
    totalPosts: witterGameState.posts.length,
    totalCharacters: witterGameState.characters.size,
    totalInteractions: Array.from(witterGameState.interactions.values()).reduce(
      (sum, interactions) => sum + interactions.likes.length + interactions.shares.length + interactions.comments.length, 0
    ),
    averageEngagement: witterGameState.posts.reduce((sum, post) => sum + parseFloat(post.engagement), 0) / witterGameState.posts.length,
    topCivilizations: getTopCivilizations(),
    topCharacters: getTopCharacters(),
    contentDistribution: getContentDistribution(),
    recentActivity: witterGameState.posts.slice(-10).reverse()
  };

  return analytics;
}

function getTopCivilizations() {
  const civCounts = {};
  witterGameState.posts.forEach(post => {
    civCounts[post.civilization] = (civCounts[post.civilization] || 0) + 1;
  });
  
  return Object.entries(civCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([civ, count]) => ({ civilization: civ, posts: count }));
}

function getTopCharacters() {
  const charEngagement = {};
  witterGameState.posts.forEach(post => {
    const key = post.authorId;
    if (!charEngagement[key]) {
      charEngagement[key] = {
        id: post.authorId,
        name: post.author,
        avatar: post.avatar,
        totalEngagement: 0,
        posts: 0
      };
    }
    charEngagement[key].totalEngagement += post.likes + post.shares + post.comments;
    charEngagement[key].posts += 1;
  });
  
  return Object.values(charEngagement)
    .sort((a, b) => b.totalEngagement - a.totalEngagement)
    .slice(0, 5);
}

function getContentDistribution() {
  const categories = {};
  witterGameState.posts.forEach(post => {
    categories[post.category] = (categories[post.category] || 0) + 1;
  });
  
  return categories;
}

// Initialize the Witter system
initializeWitterSystem();

module.exports = {
  witterGameState,
  createCharacter,
  generateUniqueCharacter,
  generateRandomPost,
  generatePersonalizedFeed,
  generateComment,
  getWitterAnalytics,
  initializeWitterSystem
};

