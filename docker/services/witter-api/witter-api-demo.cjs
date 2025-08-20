const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store for demo
const gameState = {
  civilizations: new Map([
    ['terran_federation', { id: 'terran_federation', name: 'Terran Federation', type: 'Democratic Republic', level: 10 }],
    ['centauri_republic', { id: 'centauri_republic', name: 'Centauri Republic', type: 'Military Alliance', level: 8 }],
    ['vegan_collective', { id: 'vegan_collective', name: 'Vegan Collective', type: 'Scientific Collective', level: 9 }],
    ['sirian_empire', { id: 'sirian_empire', name: 'Sirian Empire', type: 'Trade Consortium', level: 9 }],
    ['kepler_technocracy', { id: 'kepler_technocracy', name: 'Kepler Technocracy', type: 'Technocratic Meritocracy', level: 7 }],
    ['andromedan_alliance', { id: 'andromedan_alliance', name: 'Andromedan Alliance', type: 'Diplomatic Federation', level: 6 }]
  ]),
  starSystems: new Map([
    ['sol', { id: 'sol', name: 'Sol', starType: 'G', age: 4.6, totalPopulation: 12000000000 }],
    ['alpha_centauri', { id: 'alpha_centauri', name: 'Alpha Centauri', starType: 'G', age: 6.0, totalPopulation: 8500000000 }],
    ['vega', { id: 'vega', name: 'Vega', starType: 'A', age: 0.455, totalPopulation: 3200000000 }],
    ['sirius', { id: 'sirius', name: 'Sirius', starType: 'A', age: 0.242, totalPopulation: 6700000000 }],
    ['kepler', { id: 'kepler', name: 'Kepler-442', starType: 'K', age: 2.9, totalPopulation: 1800000000 }],
    ['andromeda', { id: 'andromeda', name: 'Andromeda Outpost', starType: 'M', age: 8.2, totalPopulation: 450000000 }]
  ]),
  planets: new Map([
    ['earth', { id: 'earth', name: 'Earth', systemId: 'sol', type: 'Terrestrial', population: 8000000000 }],
    ['mars', { id: 'mars', name: 'Mars', systemId: 'sol', type: 'Terrestrial', population: 2500000000 }],
    ['europa', { id: 'europa', name: 'Europa', systemId: 'sol', type: 'Ice Moon', population: 450000000 }],
    ['centauri_prime', { id: 'centauri_prime', name: 'Centauri Prime', systemId: 'alpha_centauri', type: 'Terrestrial', population: 6200000000 }],
    ['vega_prime', { id: 'vega_prime', name: 'Vega Prime', systemId: 'vega', type: 'Terrestrial', population: 3200000000 }],
    ['sirius_alpha', { id: 'sirius_alpha', name: 'Sirius Alpha', systemId: 'sirius', type: 'Terrestrial', population: 4100000000 }]
  ])
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'witter-ai-demo',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Generate AI-powered character
function generateAICharacter() {
  const civilizationArray = Array.from(gameState.civilizations.values());
  const starSystemArray = Array.from(gameState.starSystems.values());
  const planetArray = Array.from(gameState.planets.values());
  
  const civilization = civilizationArray[Math.floor(Math.random() * civilizationArray.length)];
  const starSystem = starSystemArray[Math.floor(Math.random() * starSystemArray.length)];
  const planet = planetArray[Math.floor(Math.random() * planetArray.length)];
  
  const characterTypes = ['citizen', 'media', 'official'];
  const type = characterTypes[Math.floor(Math.random() * characterTypes.length)];
  
  // AI-generated name components (simulated)
  const firstPrefixes = ['Zar', 'Kae', 'Nov', 'Ori', 'Lun', 'Vex', 'Ast', 'Pho', 'Sag', 'Ech'];
  const firstSuffixes = ['a', 'el', 'on', 'ia', 'us', 'ar', 'en', 'ix', 'ys', 'um'];
  const lastPrefixes = ['Star', 'Void', 'Light', 'Storm', 'Mind', 'Soul', 'Night', 'Dawn'];
  const lastSuffixes = ['weaver', 'walker', 'bringer', 'caller', 'forge', 'fire', 'fall', 'breaker'];
  
  const firstName = firstPrefixes[Math.floor(Math.random() * firstPrefixes.length)] + 
                   firstSuffixes[Math.floor(Math.random() * firstSuffixes.length)];
  const lastName = lastPrefixes[Math.floor(Math.random() * lastPrefixes.length)] + 
                  lastSuffixes[Math.floor(Math.random() * lastSuffixes.length)];
  
  const personalities = ['witty', 'sarcastic', 'optimistic', 'cynical', 'philosophical', 'dramatic', 'analytical', 'creative', 'adventurous', 'cautious'];
  const professions = {
    citizen: ['Engineer', 'Scientist', 'Pilot', 'Trader', 'Artist', 'Teacher', 'Technician'],
    media: ['Journalist', 'Broadcaster', 'Reporter', 'Editor', 'Correspondent', 'Analyst'],
    official: ['Administrator', 'Diplomat', 'Director', 'Coordinator', 'Supervisor', 'Manager']
  };
  
  const avatars = {
    citizen: ['👤', '👨‍🚀', '👩‍🚀', '🧑‍💻', '👩‍🔬', '👨‍🔧', '👩‍🎨', '🧑‍🏭'],
    media: ['📰', '📺', '🎙️', '📻', '💻', '📸', '🎥', '📡'],
    official: ['🏛️', '🚀', '🔬', '📈', '🛡️', '⚖️', '🌍', '💼']
  };
  
  const followerRanges = {
    citizen: { min: 50, max: 10000 },
    media: { min: 1000, max: 500000 },
    official: { min: 5000, max: 2000000 }
  };
  
  const range = followerRanges[type];
  const followers = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  
  return {
    id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${firstName} ${lastName}`,
    type: type.toUpperCase(),
    civilization: civilization.name,
    starSystem: starSystem.name,
    planet: planet.name,
    location: `${type === 'citizen' ? 'Residential' : type === 'media' ? 'Media' : 'Government'} District`,
    avatar: avatars[type][Math.floor(Math.random() * avatars[type].length)],
    followers: followers,
    personality: personalities[Math.floor(Math.random() * personalities.length)],
    profession: professions[type][Math.floor(Math.random() * professions[type].length)]
  };
}

// Mock AI content generation
async function generateAIContent(character, contentType) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
  
  const contentTemplates = {
    life_humor: [
      `My quantum coffee maker achieved sentience and now judges my breakfast choices ☕🤖 #${character.civilization.replace(/\s+/g, '')}Life`,
      `Tried to parallel park my hover car. Ended up in orbit around ${character.planet}. The parking meter is still running 🚗🌌 #SpaceProblems`,
      `My AI assistant just filed a complaint with HR about my work-life balance. I don't even have HR! 🤖📝 #${character.personality}Problems`,
      `Accidentally ordered 500 units of 'artisanal space cheese' because my smart fridge detected I was 'mildly peckish' 🧀💸 #SmartHomeFail`,
      `My universal translator glitched and I accidentally proposed marriage to a vending machine. It said 'affirmative.' 💍🤖 #DatingInSpace`
    ],
    citizen_commentary: [
      `Another 'emergency' tax for 'galactic defense.' Pretty sure that's code for the Chancellor's new yacht 🛥️💸 #${character.civilization.replace(/\s+/g, '')}Politics`,
      `They call it 'strategic resource reallocation' when it's literally just moving money from education to military 📚➡️💀 #BudgetReality`,
      `The 'Universal Prosperity Initiative' sure is prosperous... for someone. Spoiler: it's not us working folks 💼😤 #EconomicReality`,
      `Love how they promise 'transparency' then classify everything as 'need to know.' Guess we don't need to know 🤷‍♀️ #${character.starSystem}Politics`,
      `Remember when they said the new hyperspace tolls were 'temporary'? That was 5 years ago. Still waiting... 🛣️💸 #NeverEndingTaxes`
    ],
    official_announcement: [
      `📊 INFRASTRUCTURE UPDATE: Hyperspace Lane ${Math.floor(Math.random() * 20) + 1} maintenance completed ahead of schedule. Travel time reduced by ${Math.floor(Math.random() * 30) + 10}%. Next phase begins Q${Math.floor(Math.random() * 4) + 1} 2387. - ${character.civilization} Transportation Authority`,
      `🔬 BREAKTHROUGH: Quantum computing trials show ${Math.floor(Math.random() * 30) + 70}% success rate in ${Math.floor(Math.random() * 48) + 24}-hour testing. Commercial deployment expected by mid-2388. - ${character.civilization} Research Division`,
      `🛡️ SECURITY UPDATE: Pirate activity in ${character.starSystem} outer sectors decreased ${Math.floor(Math.random() * 40) + 20}% following joint patrol operations. Trade routes now secure. - ${character.civilization} Space Command`,
      `⚖️ POLICY UPDATE: New interstellar commerce guidelines regarding AI-driven trade algorithms take effect Stardate ${Math.floor(Math.random() * 1000) + 500}.4. All corporations must update compliance protocols. - ${character.civilization} Commerce Authority`,
      `🌌 DISCOVERY: Deep Space Observatory confirms new habitable exoplanet designated '${character.planet}-${Math.floor(Math.random() * 100) + 1}' with stable atmospheric conditions. Exploration missions being planned. - ${character.civilization} Astronomical Society`
    ]
  };
  
  const templates = contentTemplates[contentType];
  return templates[Math.floor(Math.random() * templates.length)];
}

// Generate AI comment
async function generateAIComment(character, originalPost) {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
  
  const commentTypes = ['agreement', 'disagreement', 'humor', 'question', 'personal_experience'];
  const type = commentTypes[Math.floor(Math.random() * commentTypes.length)];
  
  const responses = {
    agreement: [
      `Totally agree! Same thing happened to me on ${character.planet} 👍`,
      `This is so true! ${character.civilization} needs to address this`,
      `Finally someone said it! 💯 #${character.personality}Truth`
    ],
    disagreement: [
      `I respectfully disagree. In ${character.starSystem}, we handle this differently`,
      `Not sure about that... my experience as a ${character.profession} has been different`,
      `Interesting perspective, but I think there's more to it 🤔`
    ],
    humor: [
      `😂 This made my day! Thanks for the laugh from ${character.planet}`,
      `LMAO! Classic ${character.starSystem} problems 🤣`,
      `This is why I love this platform! Keep being ${character.personality} ✨`
    ],
    question: [
      `How did you handle this? Asking for a friend on ${character.planet}...`,
      `Is this common in your sector? We don't see this much in ${character.starSystem}`,
      `What would you recommend for someone new to ${character.civilization}?`
    ],
    personal_experience: [
      `I had something similar happen when I was working as a ${character.profession}`,
      `This reminds me of my time on ${character.planet} - exactly the same issue!`,
      `As someone from ${character.civilization}, I can totally relate to this`
    ]
  };
  
  const typeResponses = responses[type];
  return typeResponses[Math.floor(Math.random() * typeResponses.length)];
}

// Witter feed endpoint
app.get('/api/witter/feed', async (req, res) => {
  try {
    const { limit = '20', civilization, starSystem, sourceType } = req.query;
    const limitNum = Math.min(parseInt(limit) || 20, 50);
    
    const posts = [];
    
    for (let i = 0; i < limitNum; i++) {
      const character = generateAICharacter();
      
      // Apply filters
      if (civilization && civilization !== 'all' && character.civilization !== civilization) {
        i--; // Try again
        continue;
      }
      if (starSystem && starSystem !== 'all' && character.starSystem !== starSystem) {
        i--; // Try again
        continue;
      }
      if (sourceType && sourceType !== 'all' && character.type.toLowerCase() !== sourceType.toLowerCase()) {
        i--; // Try again
        continue;
      }
      
      // Determine content type (35% life, 35% commentary, 30% official)
      const rand = Math.random();
      let contentType;
      if (rand < 0.35) contentType = 'life_humor';
      else if (rand < 0.70) contentType = 'citizen_commentary';
      else contentType = 'official_announcement';
      
      const content = await generateAIContent(character, contentType);
      
      const post = {
        id: `witt_${Date.now()}_${i}`,
        authorId: character.id,
        authorName: character.name,
        authorType: character.type,
        content: content,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        likes: Math.floor(Math.random() * 1000),
        shares: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 50),
        isLiked: false,
        isShared: false,
        avatar: character.avatar,
        followers: character.followers,
        metadata: {
          gameContext: contentType === 'life_humor' ? 'Daily Life' : 
                      contentType === 'citizen_commentary' ? 'Politics/Society' : 'Official/News',
          location: character.location,
          civilization: character.civilization,
          starSystem: character.starSystem,
          planet: character.planet,
          sourceType: character.type.toLowerCase(),
          category: contentType,
          topics: [contentType, 'social'],
          personality: character.personality,
          hasImage: Math.random() < 0.15
        }
      };
      
      posts.push(post);
    }
    
    res.json({
      posts: posts,
      pagination: {
        total: posts.length,
        limit: limitNum,
        offset: 0,
        hasMore: false
      }
    });
    
  } catch (error) {
    console.error('Error generating feed:', error);
    res.status(500).json({ error: 'Failed to generate feed' });
  }
});

// Comments endpoint
app.get('/api/witter/post/:id/comments', async (req, res) => {
  try {
    const { limit = '10' } = req.query;
    const limitNum = Math.min(parseInt(limit) || 10, 20);
    
    const comments = [];
    
    for (let i = 0; i < limitNum; i++) {
      const commenter = generateAICharacter();
      const commentContent = await generateAIComment(commenter, 'Sample post content');
      
      const comment = {
        id: `comment_${Date.now()}_${i}`,
        postId: req.params.id,
        authorId: commenter.id,
        authorName: commenter.name,
        authorAvatar: commenter.avatar,
        content: commentContent,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        likes: Math.floor(Math.random() * 50),
        replies: Math.floor(Math.random() * 5),
        metadata: {
          civilization: commenter.civilization,
          starSystem: commenter.starSystem,
          planet: commenter.planet,
          personality: commenter.personality,
          profession: commenter.profession
        }
      };
      
      comments.push(comment);
    }
    
    res.json({ comments });
    
  } catch (error) {
    console.error('Error generating comments:', error);
    res.status(500).json({ error: 'Failed to generate comments' });
  }
});

// Filters endpoint
app.get('/api/witter/filters', (req, res) => {
  try {
    const filters = {
      civilizations: Array.from(gameState.civilizations.values()).map(civ => civ.name),
      starSystems: Array.from(gameState.starSystems.values()).map(system => system.name),
      planets: Array.from(gameState.planets.values()).map(planet => planet.name),
      sourceTypes: [
        { id: 'citizen', label: 'Citizens', count: '~70%' },
        { id: 'media', label: 'Media', count: '~15%' },
        { id: 'official', label: 'Official', count: '~15%' }
      ]
    };
    
    res.json(filters);
  } catch (error) {
    console.error('Error getting filters:', error);
    res.status(500).json({ error: 'Failed to get filters' });
  }
});

// AI generation endpoint
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, maxTokens = 150, temperature = 0.8 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    // Mock AI response based on prompt content
    let content = '';
    
    if (prompt.includes('funny') || prompt.includes('humor')) {
      const responses = [
        "My quantum coffee maker achieved sentience and now judges my breakfast choices ☕🤖",
        "Tried to parallel park my hover car. Ended up in orbit. The parking meter is still running 🚗🌌",
        "My AI assistant just filed a complaint with HR about my work-life balance. I don't even have HR! 🤖📝"
      ];
      content = responses[Math.floor(Math.random() * responses.length)];
    } else if (prompt.includes('political') || prompt.includes('snarky')) {
      const responses = [
        "Another 'emergency' tax for 'galactic defense.' Pretty sure that's code for the Chancellor's new yacht 🛥️💸",
        "They call it 'strategic resource reallocation' when it's literally just moving money from education to military 📚➡️💀"
      ];
      content = responses[Math.floor(Math.random() * responses.length)];
    } else {
      content = "Just another day in the galaxy! 🌌 Things are... interesting out here.";
    }
    
    res.json({
      content,
      usage: {
        prompt_tokens: Math.floor(prompt.length / 4),
        completion_tokens: Math.floor(content.length / 4),
        total_tokens: Math.floor((prompt.length + content.length) / 4)
      }
    });
    
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/witter/feed',
      'GET /api/witter/filters',
      'GET /api/witter/post/:id/comments',
      'POST /api/ai/generate'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Witter AI Demo Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🐦 Witter feed: http://localhost:${PORT}/api/witter/feed`);
  console.log(`🎯 AI generation: http://localhost:${PORT}/api/ai/generate`);
});
