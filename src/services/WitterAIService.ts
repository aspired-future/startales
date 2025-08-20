import { v4 as uuidv4 } from 'uuid';

export interface WitterCharacter {
  id: string;
  name: string;
  type: 'citizen' | 'media' | 'official';
  civilization: string;
  starSystem: string;
  planet: string;
  location: string;
  avatar: string;
  followers: number;
  personality: string;
  profession?: string;
  background?: string;
}

export interface WitterPost {
  id: string;
  authorId: string;
  authorName: string;
  authorType: string;
  content: string;
  timestamp: string;
  likes: number;
  shares: number;
  comments: number;
  isLiked: boolean;
  isShared: boolean;
  avatar: string;
  followers: number;
  metadata: {
    gameContext: string;
    location: string;
    civilization: string;
    starSystem: string;
    planet: string;
    sourceType: string;
    category: string;
    topics: string[];
    personality: string;
    hasImage: boolean;
  };
  image?: {
    url: string;
    alt: string;
    type: string;
  };
}

export interface ContentGenerationRequest {
  contentType: 'life_humor' | 'citizen_commentary' | 'official_announcement';
  character: WitterCharacter;
  gameContext: {
    currentEvents?: string[];
    politicalClimate?: string;
    economicStatus?: string;
    recentNews?: string[];
  };
}

export interface GameStateProvider {
  getCivilizations(): Promise<Map<string, any>>;
  getStarSystems(): Promise<Map<string, any>>;
  getPlanets(): Promise<Map<string, any>>;
  getRaces(): Promise<Map<string, any>>;
  getCurrentEvents(): Promise<string[]>;
  getPoliticalClimate(): Promise<string>;
  getEconomicStatus(): Promise<string>;
  getExistingNPCs?(): Promise<Map<string, any>>; // Optional: pull from actual game NPCs
  getKnownPersonalities?(): Promise<string[]>; // Optional: pull from game personality system
  getLocationNames?(planetId: string): Promise<string[]>; // Optional: pull actual location names
}

export class WitterAIService {
  private aiServiceUrl: string;
  private characterCache: Map<string, WitterCharacter> = new Map();
  private gameStateProvider: GameStateProvider;
  
  constructor(
    gameStateProvider: GameStateProvider,
    aiServiceUrl: string = process.env.AI_SERVICE_URL || 'http://localhost:8001'
  ) {
    this.gameStateProvider = gameStateProvider;
    this.aiServiceUrl = aiServiceUrl;
  }

  /**
   * Generate a procedural character using actual game civilizations and systems
   */
  async generateProceduralCharacter(type?: 'citizen' | 'media' | 'official'): Promise<WitterCharacter> {
    // Get actual game data
    const civilizations = await this.gameStateProvider.getCivilizations();
    const starSystems = await this.gameStateProvider.getStarSystems();
    const planets = await this.gameStateProvider.getPlanets();
    
    // Convert Maps to arrays for random selection
    const civilizationArray = Array.from(civilizations.values());
    const starSystemArray = Array.from(starSystems.values());
    const planetArray = Array.from(planets.values());

    // Determine character type based on distribution
    const characterType = type || this.determineCharacterType();
    
    // Select random civilization, star system, and planet from actual game data
    const civilization = civilizationArray.length > 0 
      ? civilizationArray[Math.floor(Math.random() * civilizationArray.length)]
      : { name: 'Unknown Civilization', id: 'unknown' };
      
    const starSystem = starSystemArray.length > 0
      ? starSystemArray[Math.floor(Math.random() * starSystemArray.length)]
      : { name: 'Unknown System', id: 'unknown' };
      
    const planet = planetArray.length > 0
      ? planetArray[Math.floor(Math.random() * planetArray.length)]
      : { name: 'Unknown Planet', id: 'unknown' };

    // Try to use existing game NPCs first, then generate AI-powered attributes
    const existingNPC = await this.tryGetExistingNPC(characterType, civilization, starSystem, planet);
    
    let characterName: string;
    let characterAvatar: string;
    let characterPersonality: string;
    let characterProfession: string;
    let characterLocation: string;
    
    if (existingNPC) {
      // Use existing NPC data
      characterName = existingNPC.name || await this.generateAICharacterName(civilization, starSystem, planet);
      characterAvatar = existingNPC.avatar || await this.generateAIAvatar(characterType);
      characterPersonality = existingNPC.personality || await this.generateAIPersonality();
      characterProfession = existingNPC.profession || await this.generateAIProfession(characterType, civilization);
      characterLocation = existingNPC.location || await this.generateAILocation(characterType, planet, starSystem);
    } else {
      // Generate fresh AI-powered attributes
      characterName = await this.generateAICharacterName(civilization, starSystem, planet);
      characterAvatar = await this.generateAIAvatar(characterType);
      characterPersonality = await this.generateAIPersonality();
      characterProfession = await this.generateAIProfession(characterType, civilization);
      characterLocation = await this.generateAILocation(characterType, planet, starSystem);
    }
    
    const character: WitterCharacter = {
      id: uuidv4(),
      name: characterName,
      type: characterType,
      civilization: civilization.name || civilization.id || 'Unknown Civilization',
      starSystem: starSystem.name || starSystem.id || 'Unknown System',
      planet: planet.name || planet.id || 'Unknown Planet',
      location: characterLocation,
      avatar: characterAvatar,
      followers: this.generateFollowerCount(characterType),
      personality: characterPersonality,
      profession: characterProfession
    };

    // Cache the character for consistency
    this.characterCache.set(character.id, character);
    
    return character;
  }

  private determineCharacterType(): 'citizen' | 'media' | 'official' {
    const rand = Math.random();
    if (rand < 0.70) return 'citizen';  // 70% citizens
    if (rand < 0.85) return 'media';    // 15% media
    return 'official';                  // 15% official
  }

  private generateLocation(type: 'citizen' | 'media' | 'official'): string {
    const locations = {
      citizen: ['Downtown District', 'Residential Zone', 'Market Quarter', 'Arts District', 'Tech Hub', 'University Area'],
      media: ['Media Center', 'News Hub', 'Broadcasting Station', 'Press District', 'Communications Tower'],
      official: ['Capitol Complex', 'Government Center', 'Administrative District', 'Embassy Quarter', 'Command Center']
    };
    
    const typeLocations = locations[type];
    return typeLocations[Math.floor(Math.random() * typeLocations.length)];
  }

  private generateFollowerCount(type: 'citizen' | 'media' | 'official'): number {
    const ranges = {
      citizen: { min: 50, max: 10000 },
      media: { min: 1000, max: 500000 },
      official: { min: 5000, max: 2000000 }
    };
    
    const range = ranges[type];
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  }

  /**
   * Generate AI-powered character name based on civilization and location
   */
  private async generateAICharacterName(civilization: any, starSystem: any, planet: any): Promise<string> {
    try {
      const prompt = `Generate a realistic character name for someone from ${civilization.name || 'Unknown Civilization'} in the ${starSystem.name || 'Unknown System'} star system on ${planet.name || 'Unknown Planet'}. 

Consider the cultural naming conventions that might exist in this civilization. The name should feel authentic to a futuristic galactic society but still be pronounceable and memorable.

Return only the full name (first and last name), nothing else.`;

      const response = await fetch(`${this.aiServiceUrl}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          maxTokens: 20,
          temperature: 0.9
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.content?.trim() || this.generateFallbackName();
      }
    } catch (error) {
      console.error('AI name generation failed:', error);
    }

    return this.generateFallbackName();
  }

  /**
   * Generate AI-powered avatar based on character type
   */
  private async generateAIAvatar(characterType: 'citizen' | 'media' | 'official'): Promise<string> {
    try {
      const prompt = `Suggest a single emoji that would represent a ${characterType} in a futuristic galactic civilization. Consider their role and profession.

For citizens: everyday people, workers, families
For media: journalists, broadcasters, content creators  
For officials: government workers, administrators, leaders

Return only the emoji character, nothing else.`;

      const response = await fetch(`${this.aiServiceUrl}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          maxTokens: 5,
          temperature: 0.8
        })
      });

      if (response.ok) {
        const result = await response.json();
        const emoji = result.content?.trim();
        if (emoji && emoji.length <= 4) { // Basic emoji validation
          return emoji;
        }
      }
    } catch (error) {
      console.error('AI avatar generation failed:', error);
    }

    return this.generateFallbackAvatar(characterType);
  }

  /**
   * Generate AI-powered personality trait
   */
  private async generateAIPersonality(): Promise<string> {
    try {
      // First try to get known personalities from the game
      let knownPersonalities: string[] = [];
      if (this.gameStateProvider.getKnownPersonalities) {
        try {
          knownPersonalities = await this.gameStateProvider.getKnownPersonalities();
        } catch (error) {
          console.error('Failed to get known personalities:', error);
        }
      }

      let prompt = `Generate a single personality trait for a character in a futuristic galactic civilization. The trait should be:
- One word or short phrase (2-3 words max)
- Descriptive of how they communicate and behave
- Suitable for social media interactions
- Creative but believable

Examples: witty, contemplative, optimistic, sarcastic, philosophical`;

      // If we have known personalities from the game, include them as examples
      if (knownPersonalities.length > 0) {
        const personalityExamples = knownPersonalities.slice(0, 8).join(', ');
        prompt += `\n\nGame-specific personality examples: ${personalityExamples}`;
      }

      prompt += `\n\nReturn only the personality trait, nothing else.`;

      const response = await fetch(`${this.aiServiceUrl}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          maxTokens: 10,
          temperature: 0.9
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.content?.trim() || 'thoughtful';
      }
    } catch (error) {
      console.error('AI personality generation failed:', error);
    }

    return 'thoughtful';
  }

  /**
   * Generate AI-powered profession based on character type and civilization
   */
  private async generateAIProfession(characterType: 'citizen' | 'media' | 'official', civilization: any): Promise<string> {
    try {
      const prompt = `Generate a profession for a ${characterType} in ${civilization.name || 'a galactic civilization'}. Consider:

For citizens: everyday jobs, skilled trades, service workers, specialists
For media: journalism, broadcasting, content creation, communications
For officials: government roles, administration, public service, leadership

The profession should:
- Be appropriate for a futuristic galactic society
- Fit the character type
- Be specific but not overly complex
- Be 1-3 words

Return only the profession title, nothing else.`;

      const response = await fetch(`${this.aiServiceUrl}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          maxTokens: 15,
          temperature: 0.8
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.content?.trim() || this.generateFallbackProfession(characterType);
      }
    } catch (error) {
      console.error('AI profession generation failed:', error);
    }

    return this.generateFallbackProfession(characterType);
  }

  /**
   * Generate AI-powered location based on character type and planet
   */
  private async generateAILocation(characterType: 'citizen' | 'media' | 'official', planet: any, starSystem: any): Promise<string> {
    try {
      // First try to get actual location names from the game
      let knownLocations: string[] = [];
      if (this.gameStateProvider.getLocationNames && planet.id) {
        try {
          knownLocations = await this.gameStateProvider.getLocationNames(planet.id);
        } catch (error) {
          console.error('Failed to get known locations:', error);
        }
      }

      // If we have known locations, use one of them
      if (knownLocations.length > 0) {
        return knownLocations[Math.floor(Math.random() * knownLocations.length)];
      }

      // Otherwise, generate with AI
      let prompt = `Generate a specific location name where a ${characterType} would live/work on ${planet.name || 'a planet'} in the ${starSystem.name || 'Unknown System'} system.

Consider:
- Citizens: residential areas, districts, neighborhoods
- Media: media centers, broadcasting districts, press quarters
- Officials: government districts, administrative centers, capitol areas

The location should:
- Sound like a real place on a futuristic planet
- Be appropriate for the character type
- Be 2-4 words
- Feel authentic to the planet/system`;

      // If we have some known locations but not many, use them as examples
      if (knownLocations.length > 0 && knownLocations.length < 5) {
        prompt += `\n\nExisting locations on this planet: ${knownLocations.join(', ')}`;
      }

      prompt += `\n\nReturn only the location name, nothing else.`;

      const response = await fetch(`${this.aiServiceUrl}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          maxTokens: 20,
          temperature: 0.8
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.content?.trim() || this.generateFallbackLocation(characterType);
      }
    } catch (error) {
      console.error('AI location generation failed:', error);
    }

    return this.generateFallbackLocation(characterType);
  }

  /**
   * Try to get an existing NPC from the game state
   */
  private async tryGetExistingNPC(characterType: string, civilization: any, starSystem: any, planet: any): Promise<any | null> {
    try {
      if (this.gameStateProvider.getExistingNPCs) {
        const npcs = await this.gameStateProvider.getExistingNPCs();
        
        // Filter NPCs by location and type if possible
        const suitableNPCs = Array.from(npcs.values()).filter((npc: any) => {
          // Basic filtering - can be enhanced based on actual NPC data structure
          const matchesCivilization = !npc.civilization || npc.civilization === civilization.name;
          const matchesSystem = !npc.starSystem || npc.starSystem === starSystem.name;
          const matchesPlanet = !npc.planet || npc.planet === planet.name;
          const matchesType = !npc.type || npc.type === characterType;
          
          return matchesCivilization && matchesSystem && matchesPlanet && matchesType;
        });
        
        if (suitableNPCs.length > 0) {
          // Return a random suitable NPC
          return suitableNPCs[Math.floor(Math.random() * suitableNPCs.length)];
        }
      }
    } catch (error) {
      console.error('Failed to get existing NPCs:', error);
    }
    
    return null;
  }

  // Fallback methods for when AI generation fails
  private generateFallbackName(): string {
    const prefixes = ['Zar', 'Kae', 'Nov', 'Ori', 'Lun', 'Vex', 'Ast', 'Pho', 'Sag', 'Ech'];
    const suffixes = ['a', 'el', 'on', 'ia', 'us', 'ar', 'en', 'ix', 'ys', 'um'];
    const lastPrefixes = ['Star', 'Void', 'Light', 'Storm', 'Mind', 'Soul', 'Night', 'Dawn'];
    const lastSuffixes = ['weaver', 'walker', 'bringer', 'caller', 'forge', 'fire', 'fall', 'breaker'];
    
    const firstName = prefixes[Math.floor(Math.random() * prefixes.length)] + 
                     suffixes[Math.floor(Math.random() * suffixes.length)];
    const lastName = lastPrefixes[Math.floor(Math.random() * lastPrefixes.length)] + 
                    lastSuffixes[Math.floor(Math.random() * lastSuffixes.length)];
    
    return `${firstName} ${lastName}`;
  }

  private generateFallbackAvatar(type: 'citizen' | 'media' | 'official'): string {
    const avatars = {
      citizen: ['👤', '👨‍🚀', '👩‍🚀', '🧑‍💻', '👩‍🔬', '👨‍🔧', '👩‍🎨', '🧑‍🏭'],
      media: ['📰', '📺', '🎙️', '📻', '💻', '📸', '🎥', '📡'],
      official: ['🏛️', '🚀', '🔬', '📈', '🛡️', '⚖️', '🌍', '💼']
    };
    
    const typeAvatars = avatars[type];
    return typeAvatars[Math.floor(Math.random() * typeAvatars.length)];
  }

  private generateFallbackProfession(type: 'citizen' | 'media' | 'official'): string {
    const professions = {
      citizen: ['Engineer', 'Scientist', 'Pilot', 'Trader', 'Artist', 'Teacher', 'Technician'],
      media: ['Journalist', 'Broadcaster', 'Reporter', 'Editor', 'Correspondent', 'Analyst'],
      official: ['Administrator', 'Diplomat', 'Director', 'Coordinator', 'Supervisor', 'Manager']
    };
    
    const typeProfessions = professions[type];
    return typeProfessions[Math.floor(Math.random() * typeProfessions.length)];
  }

  private generateFallbackLocation(type: 'citizen' | 'media' | 'official'): string {
    const locations = {
      citizen: ['Residential District', 'Market Quarter', 'Tech Hub', 'Arts District', 'Harbor Zone'],
      media: ['Media Center', 'Press District', 'Broadcasting Hub', 'News Quarter', 'Comm Tower'],
      official: ['Government Center', 'Administrative District', 'Capitol Complex', 'Embassy Quarter']
    };
    
    const typeLocations = locations[type];
    return typeLocations[Math.floor(Math.random() * typeLocations.length)];
  }

  /**
   * Generate AI-powered content using actual AI service calls
   */
  async generateAIContent(request: ContentGenerationRequest): Promise<string> {
    const { contentType, character, gameContext } = request;
    
    // Get current game context from the game state provider
    const currentEvents = await this.gameStateProvider.getCurrentEvents();
    const politicalClimate = await this.gameStateProvider.getPoliticalClimate();
    const economicStatus = await this.gameStateProvider.getEconomicStatus();
    
    const enrichedGameContext = {
      ...gameContext,
      currentEvents: currentEvents.length > 0 ? currentEvents : gameContext.currentEvents,
      politicalClimate: politicalClimate || gameContext.politicalClimate,
      economicStatus: economicStatus || gameContext.economicStatus
    };
    
    const prompts = {
      life_humor: this.buildLifeHumorPrompt(character, enrichedGameContext),
      citizen_commentary: this.buildCitizenCommentaryPrompt(character, enrichedGameContext),
      official_announcement: this.buildOfficialAnnouncementPrompt(character, enrichedGameContext)
    };

    try {
      const response = await fetch(`${this.aiServiceUrl}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompts[contentType],
          maxTokens: 150,
          temperature: 0.8,
          model: 'gpt-4o-mini' // Use a fast, cost-effective model for social media content
        })
      });

      if (!response.ok) {
        throw new Error(`AI service responded with ${response.status}`);
      }

      const result = await response.json();
      return result.content || result.text || 'AI service returned empty content';
      
    } catch (error) {
      console.error('AI content generation failed:', error);
      // Fallback to a simple dynamic message
      return this.generateFallbackContent(contentType, character);
    }
  }

  private buildLifeHumorPrompt(character: WitterCharacter, gameContext: any): string {
    const currentEvents = gameContext.currentEvents || [];
    
    // Sometimes reference current events in life humor (30% chance)
    let contextualHint = '';
    if (currentEvents.length > 0 && Math.random() < 0.3) {
      const event = currentEvents[Math.floor(Math.random() * currentEvents.length)];
      contextualHint = `\n\nOCCASIONAL CONTEXT (use if it fits naturally): ${event}`;
    }

    return `You are ${character.name}, a ${character.personality} ${character.profession} living on ${character.planet} in the ${character.civilization}. 

Write a HILARIOUS and RELATABLE social media post about everyday life in a futuristic galactic civilization. The post should be:
- Funny and shareable (make people laugh!)
- About 1-2 sentences (under 280 characters)
- Include relevant emojis
- Reflect your ${character.personality} personality
- Reference futuristic technology or space life in a funny way
- Be about daily life, relationships, work, or universal experiences
- Occasionally reference current galactic events if they affect daily life

${contextualHint}

Examples of engaging life humor (DO NOT copy these exactly):
- "My AI coffee maker achieved sentience and now judges my life choices. We're both disappointed ☕🤖 #MondayMood"
- "Tried to parallel park my hover car. Ended up in orbit. GPS says 'recalculating' for 3 hours now 🚗🌌 #SpaceProblems"
- "Dating in space is hard. 'It's not you, it's the gravitational pull of your personality' 💔🚀 #SingleInSpace"

Write something completely original and hilarious about galactic daily life:`;
  }

  private buildCitizenCommentaryPrompt(character: WitterCharacter, gameContext: any): string {
    const currentEvents = gameContext.currentEvents || [];
    const politicalClimate = gameContext.politicalClimate || '';
    const economicStatus = gameContext.economicStatus || '';
    
    // Create context-aware prompt based on real game events
    let contextualInfo = '';
    if (currentEvents.length > 0) {
      const relevantEvent = currentEvents[Math.floor(Math.random() * currentEvents.length)];
      contextualInfo += `\n\nCURRENT CONTEXT: ${relevantEvent}`;
    }
    
    if (politicalClimate) {
      contextualInfo += `\nPOLITICAL CLIMATE: ${politicalClimate}`;
    }
    
    if (economicStatus) {
      contextualInfo += `\nECONOMIC STATUS: ${economicStatus}`;
    }

    return `You are ${character.name}, a ${character.personality} citizen of ${character.civilization} living on ${character.planet}.

Write a WITTY and ENTERTAINING social media comment about the current galactic events, politics, or your civilization's situation. The post should be:
- Clever and funny (citizens should be entertaining, not boring!)
- About 1-2 sentences (under 280 characters)  
- Include relevant emojis
- Reflect your ${character.personality} personality
- Comment on the ACTUAL current events and political/economic situation
- Be relatable and shareable

${contextualInfo}

Examples of engaging citizen commentary (DO NOT copy these exactly):
- "So we can afford warp drives but not decent coffee in the space stations? Priorities, people! ☕🚀 #FirstWorldGalaxyProblems"
- "Breaking: Local government discovers efficiency. Scientists baffled. Citizens suspicious. More at 11. 📺🤔"
- "That moment when your civilization's 'economic boom' means you can finally afford TWO space ramen packets 🍜💰 #LivingTheDream"

Write something completely original that relates to the current game situation and makes people laugh:`;
  }

  private buildOfficialAnnouncementPrompt(character: WitterCharacter, gameContext: any): string {
    const currentEvents = gameContext.currentEvents || [];
    const politicalClimate = gameContext.politicalClimate || '';
    const economicStatus = gameContext.economicStatus || '';
    
    // Create context-aware prompt based on real game events
    let contextualInfo = '';
    if (currentEvents.length > 0) {
      const relevantEvent = currentEvents[Math.floor(Math.random() * currentEvents.length)];
      contextualInfo += `\n\nCURRENT CONTEXT: ${relevantEvent}`;
    }
    
    if (politicalClimate) {
      contextualInfo += `\nPOLITICAL CLIMATE: ${politicalClimate}`;
    }
    
    if (economicStatus) {
      contextualInfo += `\nECONOMIC STATUS: ${economicStatus}`;
    }

    return `You are ${character.name}, an official representative of ${character.civilization} working in ${character.location}.

Write a FUN and ENGAGING government or media announcement that relates to the current game story and events. The post should be:
- Professional but entertaining and witty
- About 2-3 sentences (under 300 characters)  
- Include relevant emojis (📊 🔬 🛡️ 🚀 ⚡ 🌟 etc.)
- Reference the current events, political climate, or economic situation
- Sound official but with personality and humor
- Make citizens actually WANT to read government updates

${contextualInfo}

Examples of engaging tone (DO NOT copy these exactly):
- "🚀 BREAKING: Our new warp drive just broke the speed limit... and physics! Legal is having a field day. #Innovation #WorthIt"
- "📊 ECONOMIC UPDATE: Trade is so good, our accountants ran out of zeroes. Ordering more from Alpha Centauri. 💰"
- "🛡️ SECURITY NOTICE: That 'unidentified object' was just Bob's lunch. Crisis averted. Bob's cooking... still a threat. 😅"

Write something completely original that citizens will actually enjoy reading:`;
  }

  private generateFallbackContent(contentType: string, character: WitterCharacter): string {
    const fallbacks = {
      life_humor: `Just another day in ${character.civilization}! My ${character.profession?.toLowerCase() || 'galactic'} life is... interesting 😅 #${character.planet}Life`,
      citizen_commentary: `The latest policy from ${character.civilization} leadership is... exactly what you'd expect 🙄 #Politics`,
      official_announcement: `📊 UPDATE: Ongoing operations in ${character.starSystem} proceeding as planned. More details to follow. - ${character.civilization} Administration`
    };
    
    return fallbacks[contentType as keyof typeof fallbacks] || `Update from ${character.name} on ${character.planet}`;
  }

  /**
   * Generate a complete Witter post with AI-generated content
   */
  async generatePost(filters?: {
    civilization?: string;
    starSystem?: string;
    planet?: string;
    contentType?: 'life_humor' | 'citizen_commentary' | 'official_announcement';
  }): Promise<WitterPost> {
    // Determine content type based on distribution: 35% life, 35% commentary, 30% official
    let contentType: 'life_humor' | 'citizen_commentary' | 'official_announcement';
    
    if (filters?.contentType) {
      contentType = filters.contentType;
    } else {
      const rand = Math.random();
      if (rand < 0.35) contentType = 'life_humor';
      else if (rand < 0.70) contentType = 'citizen_commentary';
      else contentType = 'official_announcement';
    }

    // Generate character based on content type
    const characterType = contentType === 'official_announcement' 
      ? (Math.random() < 0.7 ? 'official' : 'media')
      : 'citizen';
    
    const character = await this.generateProceduralCharacter(characterType);
    
    // Apply filters if provided (override generated values)
    if (filters?.civilization) character.civilization = filters.civilization;
    if (filters?.starSystem) character.starSystem = filters.starSystem;
    if (filters?.planet) character.planet = filters.planet;

    // Generate AI content with current game context
    const content = await this.generateAIContent({
      contentType,
      character,
      gameContext: {} // Will be enriched with actual game data in generateAIContent
    });

    // Create post
    const post: WitterPost = {
      id: `witt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: character.id,
      authorName: character.name,
      authorType: character.type.toUpperCase(),
      content,
      timestamp: new Date().toISOString(),
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
        sourceType: character.type,
        category: contentType,
        topics: [contentType, 'social'],
        personality: character.personality,
        hasImage: Math.random() < 0.15 // 15% chance for image posts
      }
    };

    // Add image for meme posts
    if (post.metadata.hasImage) {
      post.image = await this.generateMemeImage(content);
    }

    return post;
  }

  private async generateMemeImage(content: string): Promise<{ url: string; alt: string; type: string }> {
    try {
      const response = await fetch(`${this.aiServiceUrl}/api/ai/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Create a humorous meme image for this social media post: "${content}". Style: futuristic, space-themed, funny`,
          style: 'meme',
          size: '512x512'
        })
      });

      if (response.ok) {
        const result = await response.json();
        return {
          url: result.imageUrl,
          alt: content.substring(0, 100) + '...',
          type: 'meme'
        };
      }
    } catch (error) {
      console.error('Image generation failed:', error);
    }

    // Fallback to placeholder
    return {
      url: `https://picsum.photos/512/512?random=${Math.random()}`,
      alt: content.substring(0, 100) + '...',
      type: 'meme'
    };
  }

  /**
   * Generate multiple posts for feed
   */
  async generateFeed(count: number = 20, filters?: {
    civilization?: string;
    starSystem?: string;
    planet?: string;
  }): Promise<WitterPost[]> {
    const posts: WitterPost[] = [];
    
    // Generate posts in parallel for better performance
    const promises = Array.from({ length: count }, () => this.generatePost(filters));
    const generatedPosts = await Promise.all(promises);
    
    posts.push(...generatedPosts);
    
    // Sort by timestamp (newest first)
    return posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Generate AI-powered comment for a post
   */
  async generateComment(originalPost?: WitterPost, filters?: {
    civilization?: string;
    starSystem?: string;
    planet?: string;
  }): Promise<any> {
    // Generate a character for the commenter
    const commenter = await this.generateProceduralCharacter();
    
    // Apply filters if provided
    if (filters?.civilization) commenter.civilization = filters.civilization;
    if (filters?.starSystem) commenter.starSystem = filters.starSystem;
    if (filters?.planet) commenter.planet = filters.planet;

    // Determine comment type/tone
    const commentTypes = ['agreement', 'disagreement', 'humor', 'question', 'personal_experience'];
    const commentType = commentTypes[Math.floor(Math.random() * commentTypes.length)];
    
    // Build AI prompt for comment generation
    let prompt = `You are ${commenter.name}, a ${commenter.personality} ${commenter.profession} from ${commenter.civilization} living on ${commenter.planet} in the ${commenter.starSystem} system.

Write a social media comment that is ${commentType === 'agreement' ? 'supportive and agreeing' : 
                                      commentType === 'disagreement' ? 'respectfully disagreeing' :
                                      commentType === 'humor' ? 'funny and lighthearted' :
                                      commentType === 'question' ? 'asking a thoughtful question' :
                                      'sharing a personal experience'}.

The comment should:
- Be 1-2 sentences (under 200 characters)
- Reflect your ${commenter.personality} personality
- Reference your background from ${commenter.civilization}
- Include relevant emojis
- Sound natural and conversational`;

    // Add context about the original post if available
    if (originalPost) {
      prompt += `\n\nYou are commenting on this post: "${originalPost.content.substring(0, 200)}..."`;
    }

    prompt += `\n\nWrite only the comment, nothing else:`;

    try {
      // Generate AI content
      const content = await this.generateAIContent({
        contentType: 'citizen_commentary', // Use citizen commentary as base
        character: commenter,
        gameContext: {} // Will be enriched with actual game data
      });

      // For comments, we want shorter, more conversational content
      // So let's make a direct AI call with the comment-specific prompt
      const response = await fetch(`${this.aiServiceUrl}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          maxTokens: 50,
          temperature: 0.8
        })
      });

      let commentContent = '';
      if (response.ok) {
        const result = await response.json();
        commentContent = result.content?.trim() || this.generateFallbackComment(commenter);
      } else {
        commentContent = this.generateFallbackComment(commenter);
      }

      return {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        postId: originalPost?.id || 'unknown',
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

    } catch (error) {
      console.error('AI comment generation failed:', error);
      
      return {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        postId: originalPost?.id || 'unknown',
        authorId: commenter.id,
        authorName: commenter.name,
        authorAvatar: commenter.avatar,
        content: this.generateFallbackComment(commenter),
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
    }
  }

  /**
   * Generate fallback comment when AI fails
   */
  private generateFallbackComment(character: WitterCharacter): string {
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
}

export default WitterAIService;
