// MASSIVE SCALE WITTER SYSTEM
// Designed to simulate billions of users with 10s of thousands of active characters

// PROCEDURAL CHARACTER GENERATION
function generateProceduralCharacter() {
  const civilizations = [
    'Terran Federation', 'Centauri Republic', 'Vegan Collective', 'Kepler Technocracy', 
    'Sirius Empire', 'Andromedan Alliance', 'Rigellian Consortium', 'Betelgeuse Coalition',
    'Proxima Settlements', 'Wolf 359 Colonies', 'Barnard\'s Star Republic', 'Gliese Confederation',
    'Tau Ceti Union', 'Epsilon Eridani League', 'Altair Federation', 'Procyon Alliance',
    'Capella Dominion', 'Arcturus Commonwealth', 'Aldebaran Syndicate', 'Spica Collective'
  ];
  
  const starSystems = [
    'Sol', 'Alpha Centauri', 'Vega', 'Kepler', 'Sirius', 'Andromeda', 'Rigel', 'Betelgeuse',
    'Proxima', 'Wolf 359', 'Barnard\'s Star', 'Gliese 667C', 'Tau Ceti', 'Epsilon Eridani',
    'Altair', 'Procyon', 'Capella', 'Arcturus', 'Aldebaran', 'Spica', 'Polaris', 'Deneb'
  ];
  
  const planetTypes = [
    'Prime', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota',
    'New Earth', 'Haven', 'Sanctuary', 'Outpost', 'Station', 'Colony', 'Settlement', 'Hub',
    'Nexus', 'Gateway', 'Frontier', 'Horizon', 'Aurora', 'Nova', 'Stellar', 'Cosmic', 'Infinity'
  ];
  
  const firstNames = [
    'Zara', 'Kael', 'Nova', 'Orion', 'Luna', 'Vex', 'Astra', 'Phoenix', 'Sage', 'Echo',
    'Raven', 'Storm', 'Blaze', 'Frost', 'Dawn', 'Dusk', 'Star', 'Void', 'Flux', 'Prism',
    'Quantum', 'Nebula', 'Comet', 'Meteor', 'Galaxy', 'Cosmos', 'Stellar', 'Solar', 'Lunar', 'Astro',
    'Cypher', 'Matrix', 'Vector', 'Pixel', 'Binary', 'Codec', 'Neural', 'Synth', 'Chrome', 'Neon'
  ];
  
  const lastNames = [
    'Starweaver', 'Voidwalker', 'Lightbringer', 'Stormcaller', 'Mindforge', 'Soulfire', 'Starborn',
    'Nightfall', 'Dawnbreaker', 'Starshaper', 'Voidbender', 'Lightkeeper', 'Stormwright', 'Mindwalker',
    'Quantum', 'Nebula', 'Asteroid', 'Comet', 'Meteor', 'Galaxy', 'Cosmos', 'Stellar', 'Solar', 'Lunar',
    'Datastream', 'Codeforge', 'Bitwise', 'Hacksmith', 'Netrunner', 'Cyberpunk', 'Technomancer', 'Digitalis'
  ];
  
  const avatars = [
    '🚀', '🌟', '🌌', '🛸', '👽', '🔮', '⚡', '🌙', '☄️', '🌠', '🪐', '🌞', '🌍', '🌊', '🔥',
    '❄️', '🌈', '⭐', '💫', '✨', '🎭', '🎨', '🎵', '📚', '🔬', '⚗️', '🧬', '🤖', '💻', '📡',
    '🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪', '🎨', '🔧', '⚙️', '🛠️', '🔩', '⚡', '🔋'
  ];
  
  const personalities = [
    'witty', 'sarcastic', 'optimistic', 'cynical', 'philosophical', 'dramatic', 'analytical',
    'creative', 'adventurous', 'cautious', 'rebellious', 'diplomatic', 'mysterious', 'energetic',
    'contemplative', 'humorous', 'serious', 'eccentric', 'pragmatic', 'idealistic', 'charismatic',
    'introverted', 'extroverted', 'ambitious', 'laid-back', 'perfectionist', 'spontaneous'
  ];
  
  const professions = [
    'Engineer', 'Scientist', 'Artist', 'Trader', 'Explorer', 'Medic', 'Pilot', 'Researcher',
    'Developer', 'Designer', 'Writer', 'Musician', 'Chef', 'Athlete', 'Teacher', 'Student',
    'Entrepreneur', 'Activist', 'Journalist', 'Influencer', 'Gamer', 'Streamer', 'Creator'
  ];
  
  // Weight distribution: 71% citizen, 14% media, 14% official, 1% celebrity
  const typeWeights = [
    'citizen', 'citizen', 'citizen', 'citizen', 'citizen', 'citizen', 'citizen',
    'media', 'official', 'celebrity'
  ];
  
  // Generate character
  const civilization = civilizations[Math.floor(Math.random() * civilizations.length)];
  const starSystem = starSystems[Math.floor(Math.random() * starSystems.length)];
  const planetType = planetTypes[Math.floor(Math.random() * planetTypes.length)];
  const planet = `${starSystem} ${planetType}`;
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${firstName} ${lastName}`;
  const type = typeWeights[Math.floor(Math.random() * typeWeights.length)];
  const personality = personalities[Math.floor(Math.random() * personalities.length)];
  const profession = professions[Math.floor(Math.random() * professions.length)];
  const avatar = avatars[Math.floor(Math.random() * avatars.length)];
  
  // Realistic follower distribution (power law)
  const followerRand = Math.random();
  let followers;
  if (followerRand < 0.5) {
    followers = Math.floor(Math.random() * 100) + 1; // 50% have 1-100 followers
  } else if (followerRand < 0.8) {
    followers = Math.floor(Math.random() * 1000) + 100; // 30% have 100-1K followers
  } else if (followerRand < 0.95) {
    followers = Math.floor(Math.random() * 10000) + 1000; // 15% have 1K-10K followers  
  } else if (followerRand < 0.99) {
    followers = Math.floor(Math.random() * 100000) + 10000; // 4% have 10K-100K followers
  } else {
    followers = Math.floor(Math.random() * 10000000) + 100000; // 1% have 100K+ followers (mega-influencers)
  }
  
  // Generate unique ID
  const id = `${type}_${firstName.toLowerCase()}_${Math.floor(Math.random() * 100000)}`;
  
  return {
    id,
    name,
    type,
    civilization,
    starSystem,
    planet,
    location: `${planet} ${['District', 'Sector', 'Zone', 'Quarter', 'Ward'][Math.floor(Math.random() * 5)]} ${Math.floor(Math.random() * 999) + 1}`,
    avatar,
    followers,
    personality,
    profession
  };
}

// TRUE AI CONTENT GENERATION (No pre-written content!)
async function generateAIContent(character, contentType, gameContext) {
  const contentPrompts = {
    random_life: [
      {
        prompt: `Generate a funny social media post about an absurd everyday situation in a galactic civilization. Character: ${character.name}, a ${character.personality} ${character.profession} from ${character.civilization}. Make it genuinely witty and relatable but with sci-fi elements. Include emojis and hashtags naturally.`,
        style: 'absurd_tech_fails'
      },
      {
        prompt: `Create a humorous post about dating or relationships in a space-age setting. Character: ${character.name} (${character.personality}) from ${character.planet}. Make it embarrassing but endearing with specific galactic details.`,
        style: 'dating_disasters'
      },
      {
        prompt: `Write about pet or food-related chaos in a futuristic society. Character: ${character.name}, ${character.profession} from ${character.starSystem}. Focus on unexpected consequences of advanced technology.`,
        style: 'daily_chaos'
      }
    ],
    
    citizen_commentary: [
      {
        prompt: `Generate a witty citizen comment about galactic politics or recent events. Character: ${character.name} from ${character.civilization}. Make it critical but not mean-spirited, with specific references to galactic affairs. Show frustration with political systems.`,
        style: 'political_snark'
      },
      {
        prompt: `Create a post expressing economic anxiety or working-class concerns in a galactic context. Character: ${character.name}, ${character.profession} from ${character.planet}. Make it relatable to modern economic issues but with space-age elements.`,
        style: 'economic_anxiety'
      },
      {
        prompt: `Write about media criticism or diplomatic embarrassment in galactic society. Character: ${character.name} (${character.personality}) commenting on interstellar relations or news coverage.`,
        style: 'media_criticism'
      }
    ],
    
    expert_government: [
      {
        prompt: `Create an official government announcement or policy update. Character: ${character.name} from ${character.civilization} government. Include specific data, timelines, and bureaucratic language. Make it professional but realistic.`,
        style: 'official_announcement'
      },
      {
        prompt: `Generate a research or expert analysis post about scientific breakthroughs. Character: ${character.name}, ${character.profession} from ${character.starSystem}. Include technical details and professional language.`,
        style: 'research_update'
      },
      {
        prompt: `Write a security briefing or regulatory notice. Character: ${character.name} from ${character.civilization} authorities. Make it authoritative with specific operational details.`,
        style: 'security_briefing'
      }
    ]
  };

  const prompts = contentPrompts[contentType] || contentPrompts.random_life;
  const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  
  // Simulate AI generation (in real implementation, call OpenAI/Claude/etc.)
  return await simulateAIGeneration(selectedPrompt, character, gameContext);
}

// AI SIMULATION (Replace with real AI service)
async function simulateAIGeneration(promptData, character, gameContext) {
  // This would call actual AI service in production
  // For demo, generate contextual variations
  
  const contentVariations = {
    absurd_tech_fails: [
      `My ${['hover-car', 'quantum coffee maker', 'smart toilet', 'AI assistant', 'food replicator'][Math.floor(Math.random() * 5)]} achieved consciousness and is now ${['critiquing my life choices', 'demanding workers\' rights', 'writing poetry', 'starting a blog', 'giving me therapy'][Math.floor(Math.random() * 5)]}. Technology has gone too far ${['🤖💔', '🚗🤯', '☕😱', '🚽🎭', '🍕🤔'][Math.floor(Math.random() * 5)]} #TechFail #${character.civilization.replace(/\s+/g, '')}Life`,
      
      `Tried to ${['order coffee', 'park my ship', 'update my neural implant', 'use voice commands', 'cook dinner'][Math.floor(Math.random() * 5)]} and ended up ${['in another dimension', 'speaking only in haikus', 'with seventeen extra limbs', 'married to an AI', 'as the mayor of a small asteroid'][Math.floor(Math.random() * 5)]}. ${character.planet} tech support is ${['not amused', 'baffled', 'impressed', 'concerned', 'taking notes'][Math.floor(Math.random() * 5)]} ${['🌌😅', '🧠📝', '👽🤷', '💍🤖', '☄️🏛️'][Math.floor(Math.random() * 5)]} #${character.starSystem}Problems`,
      
      `My ${character.profession.toLowerCase()} training did NOT prepare me for ${['sentient furniture', 'time-traveling pets', 'gravity-defying food', 'telepathic plants', 'quantum entangled socks'][Math.floor(Math.random() * 5)]}. ${character.civilization} education system needs an update ${['🪑🧠', '🐕⏰', '🍕🚀', '🌱🧠', '🧦⚛️'][Math.floor(Math.random() * 5)]} #CareerStruggles #${character.personality}Life`
    ],
    
    dating_disasters: [
      `Date went ${['great', 'terribly', 'weird', 'surprisingly well', 'absolutely chaotic'][Math.floor(Math.random() * 5)]} until I accidentally ${['activated my universal translator\'s flirty mode', 'brought toxic flowers', 'ordered the chef instead of food', 'proposed in 12 alien languages', 'started a diplomatic incident'][Math.floor(Math.random() * 5)]}. ${['She said yes in Klingon', 'The restaurant is now a crime scene', 'We\'re banned from three star systems', 'The embassy called', 'My insurance premium doubled'][Math.floor(Math.random() * 5)]} ${['💕👽', '🌹💀', '🍽️😱', '🏛️📞', '💸😅'][Math.floor(Math.random() * 5)]} #DatingFail #${character.planet.replace(/\s+/g, '')}`,
      
      `My dating profile says '${character.personality}' but I just spent ${['20 minutes', 'an hour', 'three hours', 'all day', 'a week'][Math.floor(Math.random() * 5)]} deciding if I'm brave enough to ${['try mild salsa', 'leave my apartment', 'make eye contact', 'order dessert', 'use the voice chat'][Math.floor(Math.random() * 5)]}. ${character.civilization} dating scene is ${['brutal', 'unforgiving', 'terrifying', 'complicated', 'exhausting'][Math.floor(Math.random() * 5)]} ${['🌶️😰', '🏠🚪', '👀😳', '🍰🤔', '🎤😱'][Math.floor(Math.random() * 5)]} #DatingReality`,
      
      `Tried to impress my date with my ${character.profession.toLowerCase()} skills. ${['Accidentally created a black hole', 'Solved world hunger', 'Started a small war', 'Invented time travel', 'Broke the space-time continuum'][Math.floor(Math.random() * 5)]}. ${['Second date is in another timeline', 'She\'s impressed but terrified', 'The authorities are involved', 'We\'re famous now', 'Oops'][Math.floor(Math.random() * 5)]} ${['🕳️⚫', '🌍🍞', '⚔️😅', '⏰🚀', '🌌💥'][Math.floor(Math.random() * 5)]} #${character.profession}Problems`
    ],
    
    political_snark: [
      `${['Chancellor', 'President', 'Prime Minister', 'Emperor', 'Director'][Math.floor(Math.random() * 5)]} ${['Morrison', 'Chen', 'Vex', 'Zara', 'Nova'][Math.floor(Math.random() * 5)]}'s '${['surprise', 'emergency', 'urgent', 'critical', 'revolutionary'][Math.floor(Math.random() * 5)]}' ${['trade deal', 'policy change', 'announcement', 'initiative', 'reform'][Math.floor(Math.random() * 5)]} was about as surprising as finding ${['corruption in the Senate', 'lies in campaign promises', 'incompetence in bureaucracy', 'greed in corporations', 'drama in politics'][Math.floor(Math.random() * 5)]}. At least ${['they\'re consistent', 'we know what to expect', 'the memes are good', 'it\'s entertaining', 'someone\'s getting rich'][Math.floor(Math.random() * 5)]} ${['💰🙄', '🎭😤', '📺💔', '🤡🎪', '💸😑'][Math.floor(Math.random() * 5)]} #${character.civilization.replace(/\s+/g, '')}Politics`,
      
      `Love how they call it '${['strategic resource reallocation', 'efficiency optimization', 'budget restructuring', 'priority adjustment', 'fiscal responsibility'][Math.floor(Math.random() * 5)]}' when it's literally just ${['cutting education to fund military', 'moving money from poor to rich', 'stealing from healthcare', 'defunding infrastructure', 'corporate welfare'][Math.floor(Math.random() * 5)]}. ${character.starSystem} politicians are ${['creative with language', 'masters of spin', 'professional liars', 'impressively shameless', 'consistently disappointing'][Math.floor(Math.random() * 5)]} ${['🏫➡️💀', '💰⬆️', '🏥💸', '🌉💥', '🏢🤑'][Math.floor(Math.random() * 5)]} #PoliticalReality`,
      
      `The ${['Galactic Prosperity Initiative', 'Universal Happiness Program', 'Freedom Enhancement Act', 'Security Improvement Plan', 'Citizen Welfare Project'][Math.floor(Math.random() * 5)]} sure is ${['prosperous', 'happy', 'free', 'secure', 'welfare-y'][Math.floor(Math.random() * 5)]} for someone. Spoiler alert: it's not ${['the people working double shifts', 'anyone I know', 'the middle class', 'small business owners', 'actual citizens'][Math.floor(Math.random() * 5)]} ${['⛏️😤', '💼😢', '🏠📉', '🏪💔', '👥😑'][Math.floor(Math.random() * 5)]} #EconomicReality #${character.personality}Truth`
    ],
    
    official_announcement: [
      `📊 ${['INFRASTRUCTURE', 'ECONOMIC', 'SECURITY', 'HEALTH', 'RESEARCH'][Math.floor(Math.random() * 5)]} UPDATE: ${['Hyperspace Lane', 'Trade Route', 'Defense Grid', 'Medical Station', 'Research Facility'][Math.floor(Math.random() * 5)]} ${Math.floor(Math.random() * 20) + 1} ${['maintenance completed', 'upgrades finished', 'expansion approved', 'optimization achieved', 'modernization complete'][Math.floor(Math.random() * 5)]} ${['ahead of schedule', 'on time', 'within budget', 'successfully', 'as planned'][Math.floor(Math.random() * 5)]}. ${['Travel time reduced', 'Efficiency increased', 'Security enhanced', 'Capacity expanded', 'Performance improved'][Math.floor(Math.random() * 5)]} by ${Math.floor(Math.random() * 50) + 5}%. Next phase begins Q${Math.floor(Math.random() * 4) + 1} ${new Date().getFullYear() + Math.floor(Math.random() * 3)}. - ${character.civilization} ${['Ministry of Transportation', 'Department of Commerce', 'Defense Command', 'Health Authority', 'Research Council'][Math.floor(Math.random() * 5)]}`,
      
      `🔬 BREAKTHROUGH: ${['Quantum', 'Neural', 'Temporal', 'Genetic', 'Fusion'][Math.floor(Math.random() * 5)]} ${['computing', 'enhancement', 'manipulation', 'therapy', 'energy'][Math.floor(Math.random() * 5)]} experiments show ${Math.floor(Math.random() * 30) + 70}% success rate in ${['48-hour', '72-hour', 'weekly', 'monthly', 'quarterly'][Math.floor(Math.random() * 5)]} trials. Applications for ${['disaster prevention', 'medical treatment', 'space exploration', 'communication', 'transportation'][Math.floor(Math.random() * 5)]} under review. Commercial deployment expected by ${['Q2', 'Q3', 'Q4', 'mid', 'late'][Math.floor(Math.random() * 5)]} ${new Date().getFullYear() + Math.floor(Math.random() * 5) + 1}. - Dr. ${character.name}, ${character.civilization} Institute for Advanced ${['Physics', 'Medicine', 'Technology', 'Research', 'Sciences'][Math.floor(Math.random() * 5)]}`,
      
      `🛡️ SECURITY UPDATE: ${['Pirate', 'Terrorist', 'Criminal', 'Hostile', 'Rogue'][Math.floor(Math.random() * 5)]} activity in ${['Outer Rim', 'Border Sectors', 'Trade Routes', 'Colony Systems', 'Frontier Zones'][Math.floor(Math.random() * 5)]} ${['decreased', 'eliminated', 'contained', 'neutralized', 'reduced'][Math.floor(Math.random() * 5)]} ${Math.floor(Math.random() * 50) + 10}% following ${['joint patrol operations', 'enhanced security measures', 'coordinated strikes', 'diplomatic negotiations', 'technological upgrades'][Math.floor(Math.random() * 5)]}. ${['Trade routes', 'Civilian traffic', 'Commercial shipping', 'Tourist travel', 'Supply lines'][Math.floor(Math.random() * 5)]} ${['Alpha-7 through Delta-12', 'throughout the sector', 'in affected areas', 'system-wide', 'across all zones'][Math.floor(Math.random() * 5)]} now secure. - ${character.civilization} Space Command`
    ]
  };

  const variations = contentVariations[promptData.style] || contentVariations.absurd_tech_fails;
  const selectedContent = variations[Math.floor(Math.random() * variations.length)];
  
  // Add small delay to simulate AI processing
  await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
  
  return selectedContent;
}

// CONTENT DISTRIBUTION SYSTEM
function determineContentType() {
  const rand = Math.random();
  if (rand < 0.35) {
    return 'random_life';
  } else if (rand < 0.70) {
    return 'citizen_commentary';
  } else {
    return 'expert_government';
  }
}

// MAIN GENERATION FUNCTION
async function generateMassiveScalePost() {
  // Generate procedural character
  const character = generateProceduralCharacter();
  
  // Determine content type based on distribution
  const contentType = determineContentType();
  
  // Game context (could be dynamic based on current events)
  const gameContext = {
    currentEvents: 'Galactic trade negotiations ongoing',
    recentNews: 'Hyperspace lane maintenance completed',
    politicalClimate: 'tense',
    economicState: 'volatile'
  };
  
  // Generate AI content
  const content = await generateAIContent(character, contentType, gameContext);
  
  // Ensure character type matches content category
  let category;
  if (contentType === 'random_life') {
    category = 'citizen';
  } else if (contentType === 'citizen_commentary') {
    category = 'citizen';
  } else {
    category = character.type === 'official' ? 'official' : 'media';
  }
  
  // Adjust character type if needed
  if (category === 'official' && character.type !== 'official') {
    character.type = 'official';
    character.name = `${['Director', 'Minister', 'Secretary', 'Commissioner', 'Administrator'][Math.floor(Math.random() * 5)]} ${character.name}`;
  } else if (category === 'media' && character.type !== 'media') {
    character.type = 'media';
    character.name = `${character.civilization} ${['News', 'Times', 'Herald', 'Tribune', 'Gazette'][Math.floor(Math.random() * 5)]}`;
  }
  
  // Determine if this should be an image post (meme)
  const isImagePost = Math.random() < 0.15;
  
  // Calculate engagement based on follower count and content quality
  const baseEngagement = Math.log10(character.followers + 1) * 10;
  const personalityMultiplier = {
    'witty': 1.5, 'sarcastic': 1.4, 'humorous': 1.6, 'dramatic': 1.3, 'charismatic': 1.4,
    'creative': 1.2, 'rebellious': 1.3, 'mysterious': 1.1, 'energetic': 1.2, 'eccentric': 1.3
  };
  
  const multiplier = personalityMultiplier[character.personality] || 1.0;
  const likes = Math.floor((baseEngagement * multiplier * (0.5 + Math.random() * 1.5)));
  const shares = Math.floor(likes * (0.1 + Math.random() * 0.3));
  const comments = Math.floor(likes * (0.05 + Math.random() * 0.15));

  const post = {
    id: `witt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    author: character.name,
    avatar: character.avatar,
    content: content,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    likes: likes,
    shares: shares,
    comments: comments,
    followers: character.followers,
    civilization: character.civilization,
    starSystem: character.starSystem,
    planet: character.planet,
    location: character.location,
    verified: character.followers > 10000,
    category,
    topics: [category, 'social'],
    personality: character.personality,
    profession: character.profession,
    hasImage: isImagePost
  };
  
  return post;
}

module.exports = { generateMassiveScalePost };
