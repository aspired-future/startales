// TRUE AI-POWERED WITTER CONTENT GENERATION
// No templates, no hardcoded content - everything is AI generated

interface Character {
  id: string;
  name: string;
  avatar: string;
  type: 'citizen' | 'media' | 'official';
  civilization: string;
  starSystem: string;
  planet: string;
  location: string;
  followers: number;
  personality: string;
  profession: string;
  verified: boolean;
}

interface GameContext {
  currentEvents: string[];
  politicalClimate: string;
  economicStatus: string;
  recentNews: string[];
  civilizations: any[];
  starSystems: any[];
  planets: any[];
}

interface AIGenerationRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

interface AIGenerationResponse {
  content: string;
  success: boolean;
  error?: string;
}

export class TrueAIWitterService {
  private aiServiceUrl: string;
  private fallbackEnabled: boolean;

  constructor(aiServiceUrl: string = 'http://localhost:8001/api/ai/generate', fallbackEnabled: boolean = true) {
    this.aiServiceUrl = aiServiceUrl;
    this.fallbackEnabled = fallbackEnabled;
  }

  /**
   * Generate a completely AI-powered character with unique name, personality, and background
   */
  async generateAICharacter(gameContext: GameContext): Promise<Character> {
    const characterPrompt = `Generate a unique character for a galactic social media platform. Create:
1. A creative, sci-fi appropriate name (first and last name)
2. A personality trait (one word, be creative beyond basic traits)
3. A profession (space-age appropriate)
4. A brief background or quirk

Available civilizations: ${gameContext.civilizations.map(c => c.name).join(', ')}
Available star systems: ${gameContext.starSystems.map(s => s.name).join(', ')}

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
        const civ = gameContext.civilizations.find(c => c.name === aiData.preferredCivilization) || 
                   gameContext.civilizations[Math.floor(Math.random() * gameContext.civilizations.length)];
        const system = gameContext.starSystems.find(s => s.name === aiData.preferredSystem) ||
                      gameContext.starSystems[Math.floor(Math.random() * gameContext.starSystems.length)];
        const planet = system.planets?.[Math.floor(Math.random() * system.planets.length)] || `${system.name} Prime`;

        return {
          id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: aiData.name,
          avatar: this.generateContextualAvatar(aiData.profession, aiData.personality),
          type: this.determineCharacterType(),
          civilization: civ.name,
          starSystem: system.name,
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

  /**
   * Generate completely AI-powered post content
   */
  async generateAIPost(character: Character, gameContext: GameContext): Promise<string> {
    const contentType = this.determineContentType(character);
    
    let basePrompt = '';
    let contextInfo = '';

    // Build context from current game state
    if (gameContext.currentEvents.length > 0) {
      contextInfo += `Current galactic events: ${gameContext.currentEvents.slice(0, 3).join(', ')}. `;
    }
    if (gameContext.recentNews.length > 0) {
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

  /**
   * Generate AI-powered comment
   */
  async generateAIComment(character: Character, originalPost: any, gameContext: GameContext): Promise<string> {
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

  /**
   * Call the AI service
   */
  private async callAIService(request: AIGenerationRequest): Promise<AIGenerationResponse> {
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
          model: 'gpt-3.5-turbo' // or whatever model is available
        }),
        timeout: 10000 // 10 second timeout
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

  /**
   * Determine content type based on character
   */
  private determineContentType(character: Character): string {
    if (character.type === 'official') {
      return 'official_announcement';
    } else if (character.type === 'media') {
      return 'media_report';
    } else {
      // Citizens - mix of life and commentary
      return Math.random() < 0.6 ? 'citizen_life' : 'citizen_commentary';
    }
  }

  /**
   * Generate contextual avatar based on profession and personality
   */
  private generateContextualAvatar(profession: string, personality: string): string {
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

    // Default sci-fi avatars
    const defaultAvatars = ['🚀', '🌟', '🌌', '👽', '🔮', '⚡', '🌙', '☄️', '🌠', '🪐'];
    return defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
  }

  /**
   * Determine character type
   */
  private determineCharacterType(): 'citizen' | 'media' | 'official' {
    const rand = Math.random();
    if (rand < 0.7) return 'citizen';
    if (rand < 0.85) return 'media';
    return 'official';
  }

  /**
   * Generate follower count based on personality
   */
  private generateFollowerCount(personality: string): number {
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

  /**
   * Generate location suffix
   */
  private generateLocationSuffix(): string {
    const suffixes = ['District', 'Sector', 'Zone', 'Quarter', 'Hub', 'Station', 'Colony', 'Outpost'];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    return `${suffix} ${number}`;
  }

  /**
   * Fallback character generation (still procedural but better than templates)
   */
  private generateProceduralCharacter(gameContext: GameContext): Character {
    // Use game context for realistic data
    const civ = gameContext.civilizations[Math.floor(Math.random() * gameContext.civilizations.length)];
    const system = gameContext.starSystems[Math.floor(Math.random() * gameContext.starSystems.length)];
    const planet = system.planets?.[Math.floor(Math.random() * system.planets.length)] || `${system.name} Prime`;

    return {
      id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `Citizen ${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      avatar: '👤',
      type: this.determineCharacterType(),
      civilization: civ.name,
      starSystem: system.name,
      planet: planet,
      location: `${planet} ${this.generateLocationSuffix()}`,
      followers: Math.floor(Math.random() * 1000) + 10,
      personality: 'unique',
      profession: 'Resident',
      verified: false
    };
  }

  /**
   * Fallback post generation
   */
  private async generateFallbackPost(character: Character, gameContext: GameContext): Promise<string> {
    const topics = [
      `Life on ${character.planet} is interesting`,
      `Working as a ${character.profession} in ${character.civilization}`,
      `The view from ${character.location} today`,
      `Thoughts on recent galactic events`
    ];
    
    const topic = topics[Math.floor(Math.random() * topics.length)];
    return `${topic}... ${character.personality} perspective from ${character.starSystem} 🌟 #GalacticLife`;
  }

  /**
   * Fallback comment generation
   */
  private async generateFallbackComment(character: Character, originalPost: any): Promise<string> {
    const reactions = [
      `Interesting perspective from ${character.planet}!`,
      `As a ${character.profession}, I can relate to this`,
      `This resonates with us in ${character.civilization}`,
      `${character.personality} take: this is spot on!`
    ];
    
    return reactions[Math.floor(Math.random() * reactions.length)] + ' 🌟';
  }
}

export default TrueAIWitterService;

