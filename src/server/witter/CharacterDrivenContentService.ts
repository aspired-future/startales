import { Pool } from 'pg';
import { CharacterService } from '../characters/CharacterService';
import { DynamicCharacter } from '../characters/characterInterfaces';
import { getGameMasterStoryEngine } from './GameMasterStoryEngine';

export interface PersistentCharacter {
  id: string;
  name: string;
  profession: string;
  civilization: string;
  planet: string;
  personality: 'witty' | 'serious' | 'sarcastic' | 'enthusiastic' | 'cynical' | 'optimistic' | 'dramatic' | 'mysterious';
  authorType: 'MEDIA' | 'CITIZEN' | 'ANALYST' | 'CELEBRITY' | 'OFFICIAL' | 'INFLUENCER' | 'ATHLETE' | 'SCIENTIST';
  avatar: string;
  backstory: string;
  currentStoryline?: string;
  relationships: CharacterRelationship[];
  recentEvents: string[];
  specialties: string[];
  followers: number;
  credibility: number;
  lastActive: Date;
  isRecurring: boolean;
}

export interface CharacterRelationship {
  characterId: string;
  characterName: string;
  relationshipType: 'rival' | 'ally' | 'romantic' | 'mentor' | 'colleague' | 'enemy' | 'friend';
  backstory: string;
  currentStatus: 'active' | 'dormant' | 'resolved';
}

export interface GameEvent {
  id: string;
  type: 'economic' | 'political' | 'military' | 'scientific' | 'cultural' | 'diplomatic';
  title: string;
  description: string;
  civilizationsInvolved: string[];
  charactersAffected: string[];
  timestamp: Date;
  impact: 'major' | 'moderate' | 'minor';
  ongoingStoryline?: string;
}

export interface CharacterPost {
  id: string;
  characterId: string;
  content: string;
  timestamp: Date;
  gameEventId?: string;
  storylineId?: string;
  referencedCharacters: string[];
  contentType: 'reaction' | 'announcement' | 'gossip' | 'analysis' | 'personal' | 'breaking';
  metrics: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export class CharacterDrivenContentService {
  private pool: Pool;
  private aiServiceUrl: string;
  private characterService: CharacterService;
  private characterCache: Map<string, PersistentCharacter> = new Map();
  private activeStorylines: Map<string, any> = new Map();

  constructor(pool: Pool, aiServiceUrl: string = process.env.AI_SERVICE_URL || 'http://localhost:8001') {
    this.pool = pool;
    this.aiServiceUrl = aiServiceUrl;
    this.characterService = new CharacterService(pool);
  }

  async generateCharacterDrivenContent(
    civilizationId: number, 
    gameEvents: GameEvent[], 
    count: number = 10
  ): Promise<CharacterPost[]> {
    const posts: CharacterPost[] = [];

    // Get or create persistent characters
    const characters = await this.getActiveCharacters(civilizationId, count);
    
    // Update characters based on recent game events
    await this.updateCharactersFromGameEvents(characters, gameEvents);

    // Generate posts from character perspectives
    for (const character of characters) {
      try {
        const post = await this.generateCharacterPost(character, gameEvents);
        if (post) {
          posts.push(post);
          // Update character's recent activity
          character.lastActive = new Date();
          character.recentEvents.push(post.content.substring(0, 100) + '...');
          if (character.recentEvents.length > 5) {
            character.recentEvents = character.recentEvents.slice(-5);
          }
        }
      } catch (error) {
        console.error(`Failed to generate post for character ${character.name}:`, error);
      }
    }

    // Save updated character states
    await this.saveCharacterStates(characters);

    return posts;
  }

  private async generateCharacterPost(
    character: PersistentCharacter, 
    gameEvents: GameEvent[]
  ): Promise<CharacterPost | null> {
    // Find relevant game events for this character
    const relevantEvents = gameEvents.filter(event => 
      event.civilizationsInvolved.includes(character.civilization) ||
      event.charactersAffected.includes(character.id) ||
      this.isEventRelevantToCharacter(event, character)
    );

    // Choose content type based on character and events
    const contentType = this.determineContentType(character, relevantEvents);
    
    // Build character-specific prompt
    const prompt = this.buildCharacterPrompt(character, relevantEvents, contentType);

    try {
      const response = await fetch(`${this.aiServiceUrl}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          maxTokens: 250,
          temperature: 0.95, // Very high for maximum character personality
          model: 'gpt-4o-mini'
        })
      });

      if (!response.ok) {
        throw new Error(`AI service responded with ${response.status}`);
      }

      const result = await response.json();
      const content = result.content || result.text || '';

      if (content.length < 10) return null;

      return {
        id: `char_${character.id}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        characterId: character.id,
        content,
        timestamp: new Date(),
        gameEventId: relevantEvents[0]?.id,
        storylineId: character.currentStoryline,
        referencedCharacters: this.extractReferencedCharacters(content, character),
        contentType,
        metrics: {
          likes: Math.floor(Math.random() * (character.followers / 100)) + 10,
          shares: Math.floor(Math.random() * (character.followers / 500)) + 5,
          comments: Math.floor(Math.random() * (character.followers / 200)) + 3
        }
      };

    } catch (error) {
      console.error('AI content generation failed for character:', error);
      return this.generateFallbackCharacterPost(character, relevantEvents);
    }
  }

  private buildCharacterPrompt(
    character: PersistentCharacter, 
    relevantEvents: GameEvent[], 
    contentType: string
  ): string {
    // Get story context from Game Master
    let storyContext = '';
    try {
      const gameMaster = getGameMasterStoryEngine();
      const gameStoryContext = gameMaster.getStoryContextForCharacters(parseInt(character.civilization.match(/\d+/)?.[0] || '1'));
      
      if (gameStoryContext) {
        storyContext = `\nCURRENT STORY CONTEXT:
- Theme: ${gameStoryContext.gameTheme}
- Genre: ${gameStoryContext.storyGenre}
- Story Tension: ${gameStoryContext.storyTension}/10
- Active Storylines: ${gameStoryContext.majorStorylines?.join(', ') || 'None'}
- Recent Story Events: ${gameStoryContext.recentEvents?.map((e: any) => e.title).join(', ') || 'None'}`;
      }
    } catch (error) {
      // Game Master not available, continue without story context
      console.log('Game Master story context not available');
    }
    const personalityTraits = {
      witty: "clever, uses wordplay, makes unexpected connections, subtle humor",
      serious: "professional, analytical, focuses on implications",
      sarcastic: "dry humor, ironic observations, subtle mockery",
      enthusiastic: "energetic, exclamation points, genuine excitement",
      cynical: "skeptical, points out flaws, dark humor",
      optimistic: "positive outlook, sees opportunities, encouraging",
      dramatic: "theatrical, emotional, exaggerated reactions",
      mysterious: "cryptic hints, insider knowledge, speaks in riddles"
    };

    const relationshipContext = character.relationships.length > 0 
      ? `\nYour relationships: ${character.relationships.map(r => 
          `${r.characterName} (${r.relationshipType})`).join(', ')}.`
      : '';

    const recentContext = character.recentEvents.length > 0
      ? `\nYour recent activity: ${character.recentEvents.slice(-2).join(' ')}`
      : '';

    const eventContext = relevantEvents.length > 0
      ? `\nCurrent events affecting you: ${relevantEvents.map(e => e.title).join(', ')}`
      : '';

    const storylineContext = character.currentStoryline
      ? `\nOngoing storyline: ${character.currentStoryline}`
      : '';

    return `You are ${character.name}, a ${character.personality} ${character.profession} from ${character.civilization} living on ${character.planet}.

Your personality: ${personalityTraits[character.personality]}
Your background: ${character.backstory}
Your specialties: ${character.specialties.join(', ')}
Your followers: ${character.followers.toLocaleString()}${relationshipContext}${recentContext}${eventContext}${storylineContext}${storyContext}

Write a social media post that:
- Shows your unique ${character.personality} personality clearly
- References specific game events, characters, or ongoing storylines
- Reflects your professional expertise and background
- Includes personal opinions and reactions based on your character
- Is 3-4 sentences long and genuinely engaging
- Uses appropriate emojis and hashtags naturally
- Advances your character's story or relationships
- Feels authentic to your established personality and history

Content type: ${contentType}

Write ONLY the post content, nothing else.`;
  }

  private async getActiveCharacters(civilizationId: number, count: number): Promise<PersistentCharacter[]> {
    try {
      // Get characters from the existing character system
      const dynamicCharacters = await this.characterService.getCharactersByCivilization(civilizationId, count * 2);
      
      if (dynamicCharacters.length === 0) {
        console.log(`⚠️ No characters found for civilization ${civilizationId}, generating some...`);
        // If no characters exist, we could trigger character generation here
        // For now, fall back to creating some basic characters
        return await this.createFallbackCharacters(civilizationId, count);
      }

      // Convert DynamicCharacters to PersistentCharacters for Witter
      const witterCharacters = this.convertDynamicCharactersToPersistent(dynamicCharacters, count);
      
      // Cache the characters
      witterCharacters.forEach(char => {
        this.characterCache.set(char.id, char);
      });

      console.log(`✅ Retrieved ${witterCharacters.length} characters for Witter from civilization ${civilizationId}`);
      return witterCharacters;

    } catch (error) {
      console.error('❌ Error fetching characters from character system:', error);
      // Fallback to creating basic characters
      return await this.createFallbackCharacters(civilizationId, count);
    }
  }

  private convertDynamicCharactersToPersistent(dynamicCharacters: DynamicCharacter[], maxCount: number): PersistentCharacter[] {
    return dynamicCharacters.slice(0, maxCount).map(dynChar => {
      // Convert the rich DynamicCharacter to PersistentCharacter format
      const personality = this.mapPersonalityTraits(dynChar.personality);
      const authorType = this.mapCategoryToAuthorType(dynChar.category);
      
      return {
        id: dynChar.id,
        name: dynChar.name.full_display,
        profession: dynChar.profession?.title || dynChar.profession?.industry || 'Citizen',
        civilization: `Civilization ${dynChar.civilization_id}`, // TODO: Get actual civ name
        planet: `Planet ${dynChar.planet_id}`, // TODO: Get actual planet name
        personality,
        authorType,
        avatar: this.generateAvatarFromAppearance(dynChar.appearance),
        backstory: dynChar.background?.personal_history || 'A citizen of the galaxy with their own story to tell.',
        currentStoryline: this.extractCurrentStoryline(dynChar),
        relationships: this.convertRelationships(dynChar.relationships || []),
        recentEvents: [],
        specialties: this.extractSpecialties(dynChar),
        followers: this.calculateFollowers(dynChar),
        credibility: this.calculateCredibility(dynChar),
        lastActive: new Date(),
        isRecurring: true
      };
    });
  }

  private mapPersonalityTraits(personality: any): 'witty' | 'serious' | 'sarcastic' | 'enthusiastic' | 'cynical' | 'optimistic' | 'dramatic' | 'mysterious' {
    if (!personality || !personality.traits) return 'serious';
    
    const traits = personality.traits;
    
    // Map personality traits to Witter personality types
    if (traits.includes('humorous') || traits.includes('clever')) return 'witty';
    if (traits.includes('pessimistic') || traits.includes('skeptical')) return 'cynical';
    if (traits.includes('energetic') || traits.includes('passionate')) return 'enthusiastic';
    if (traits.includes('ironic') || traits.includes('mocking')) return 'sarcastic';
    if (traits.includes('hopeful') || traits.includes('positive')) return 'optimistic';
    if (traits.includes('theatrical') || traits.includes('expressive')) return 'dramatic';
    if (traits.includes('secretive') || traits.includes('enigmatic')) return 'mysterious';
    
    return 'serious'; // Default
  }

  private mapCategoryToAuthorType(category: string): 'MEDIA' | 'CITIZEN' | 'ANALYST' | 'CELEBRITY' | 'OFFICIAL' | 'INFLUENCER' | 'ATHLETE' | 'SCIENTIST' {
    switch (category.toLowerCase()) {
      case 'media': return 'MEDIA';
      case 'official': case 'military': return 'OFFICIAL';
      case 'business': return 'ANALYST';
      case 'celebrity': return 'CELEBRITY';
      case 'academic': return 'SCIENTIST';
      case 'criminal': return 'CITIZEN'; // Don't expose criminal status
      default: return 'CITIZEN';
    }
  }

  private generateAvatarFromAppearance(appearance: any): string {
    // Generate emoji or avatar based on appearance
    const avatars = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🔬', '👩‍🔬', '👨‍🎨', '👩‍🎨', '🤖', '👽'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  private extractCurrentStoryline(dynChar: DynamicCharacter): string | undefined {
    // Extract current storyline from character's game integration or status
    if (dynChar.game_integration?.current_storylines?.length > 0) {
      return dynChar.game_integration.current_storylines[0];
    }
    if (dynChar.status?.current_situation) {
      return dynChar.status.current_situation;
    }
    return undefined;
  }

  private convertRelationships(relationships: any[]): any[] {
    // Convert DynamicCharacter relationships to PersistentCharacter format
    return relationships.slice(0, 3).map(rel => ({
      characterId: rel.target_character_id || rel.id,
      characterName: rel.target_name || rel.name || 'Unknown',
      relationshipType: rel.relationship_type || 'colleague',
      backstory: rel.history || 'Connected through shared experiences',
      currentStatus: rel.status || 'active'
    }));
  }

  private extractSpecialties(dynChar: DynamicCharacter): string[] {
    const specialties = [];
    
    if (dynChar.profession?.industry) specialties.push(dynChar.profession.industry);
    if (dynChar.skills) {
      Object.keys(dynChar.skills).slice(0, 3).forEach(skill => specialties.push(skill));
    }
    if (dynChar.background?.education?.field) specialties.push(dynChar.background.education.field);
    
    return specialties.length > 0 ? specialties : ['general knowledge'];
  }

  private calculateFollowers(dynChar: DynamicCharacter): number {
    // Calculate followers based on character attributes and social media presence
    const baseFollowers = 1000;
    const charisma = dynChar.attributes?.charisma || 50;
    const socialInfluence = dynChar.attributes?.social_influence || 50;
    const multiplier = (charisma + socialInfluence) / 100;
    
    return Math.floor(baseFollowers * multiplier * (Math.random() * 10 + 1));
  }

  private calculateCredibility(dynChar: DynamicCharacter): number {
    // Calculate credibility based on integrity, intelligence, and profession
    const integrity = dynChar.attributes?.integrity || 50;
    const intelligence = dynChar.attributes?.intelligence || 50;
    const professionBonus = dynChar.category === 'academic' ? 20 : 
                           dynChar.category === 'official' ? 15 : 
                           dynChar.category === 'media' ? 10 : 0;
    
    return Math.min(10, Math.floor((integrity + intelligence + professionBonus) / 20));
  }

  private async createFallbackCharacters(civilizationId: number, count: number): Promise<PersistentCharacter[]> {
    console.log(`⚠️ Creating fallback characters for civilization ${civilizationId}`);
    return this.createPersistentCharacters(civilizationId, count);
  }

  private async createPersistentCharacters(civilizationId: number, count: number): Promise<PersistentCharacter[]> {
    const characters: PersistentCharacter[] = [];
    
    const characterTemplates = [
      {
        name: "Dr. Zara Voidwhisper",
        profession: "Quantum Physicist",
        personality: "mysterious" as const,
        authorType: "SCIENTIST" as const,
        avatar: "🔬",
        backstory: "Brilliant quantum researcher who discovered anomalies in space-time that governments want to suppress",
        specialties: ["quantum mechanics", "space-time research", "government conspiracies"],
        currentStoryline: "Investigating mysterious quantum signatures near the galactic core"
      },
      {
        name: "Captain Rex Stormbreaker",
        profession: "Military Commander",
        personality: "dramatic" as const,
        authorType: "OFFICIAL" as const,
        avatar: "⚔️",
        backstory: "Decorated war hero turned whistleblower exposing corruption in inter-civilization military contracts",
        specialties: ["military strategy", "inter-civ politics", "defense contracts"],
        currentStoryline: "Exposing illegal weapons deals between civilizations"
      },
      {
        name: "Luna Starweaver",
        profession: "Entertainment Reporter",
        personality: "witty" as const,
        authorType: "MEDIA" as const,
        avatar: "✨",
        backstory: "Sharp-tongued celebrity journalist with inside access to the biggest scandals in galactic entertainment",
        specialties: ["celebrity gossip", "entertainment industry", "social media trends"],
        currentStoryline: "Investigating a love triangle between three major galactic celebrities"
      },
      {
        name: "Marcus Creditcrash",
        profession: "Financial Analyst",
        personality: "cynical" as const,
        authorType: "ANALYST" as const,
        avatar: "💸",
        backstory: "Former insider trader turned market critic who predicted the last three economic crashes",
        specialties: ["market manipulation", "economic forecasting", "corporate fraud"],
        currentStoryline: "Warning about an impending market crash that authorities are trying to hide"
      },
      {
        name: "Aria Quantumleap",
        profession: "Pro Athlete",
        personality: "enthusiastic" as const,
        authorType: "CELEBRITY" as const,
        avatar: "🏆",
        backstory: "Rising star in Quantum Racing who's breaking barriers and challenging traditional sports culture",
        specialties: ["quantum racing", "sports politics", "inter-civ competition"],
        currentStoryline: "Fighting discrimination in professional sports while training for the Galactic Championships"
      },
      {
        name: "Professor Sage Mindbridge",
        profession: "Cultural Anthropologist",
        personality: "optimistic" as const,
        authorType: "SCIENTIST" as const,
        avatar: "🌍",
        backstory: "Leading expert on inter-species relationships and cultural integration across civilizations",
        specialties: ["cultural studies", "inter-species relations", "social movements"],
        currentStoryline: "Documenting the first successful inter-species marriage ceremonies"
      },
      {
        name: "Phoenix Shadowdancer",
        profession: "Underground Journalist",
        personality: "sarcastic" as const,
        authorType: "INFLUENCER" as const,
        avatar: "🕵️",
        backstory: "Investigative reporter who exposes government secrets and corporate cover-ups through encrypted channels",
        specialties: ["government secrets", "corporate espionage", "underground networks"],
        currentStoryline: "Tracking a conspiracy involving multiple civilization leaders"
      },
      {
        name: "Nova Heartstring",
        profession: "Relationship Counselor",
        personality: "serious" as const,
        authorType: "CITIZEN" as const,
        avatar: "💕",
        backstory: "Therapist specializing in inter-civilization relationships and the psychological effects of space colonization",
        specialties: ["psychology", "relationships", "mental health"],
        currentStoryline: "Helping couples navigate the challenges of long-distance space relationships"
      }
    ];

    const civilizations = [
      'Terran Republic', 'Alpha Centauri Alliance', 'Vega Federation',
      'Proxima Coalition', 'Kepler Union', 'Sirius Empire'
    ];

    const planets = [
      'New Terra', 'Alpha Prime', 'Vega Station', 'Proxima Base',
      'Kepler Colony', 'Sirius Central', 'Frontier Outpost', 'Deep Space Nine'
    ];

    for (let i = 0; i < Math.min(count, characterTemplates.length); i++) {
      const template = characterTemplates[i];
      const civilization = civilizations[Math.floor(Math.random() * civilizations.length)];
      const planet = planets[Math.floor(Math.random() * planets.length)];

      const character: PersistentCharacter = {
        id: `persistent_${template.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
        name: template.name,
        profession: template.profession,
        civilization,
        planet,
        personality: template.personality,
        authorType: template.authorType,
        avatar: template.avatar,
        backstory: template.backstory,
        currentStoryline: template.currentStoryline,
        relationships: [],
        recentEvents: [],
        specialties: template.specialties,
        followers: Math.floor(Math.random() * 500000) + 50000,
        credibility: Math.floor(Math.random() * 3) + 7, // 7-9
        lastActive: new Date(),
        isRecurring: true
      };

      characters.push(character);
    }

    // Create some relationships between characters
    this.createCharacterRelationships(characters);

    return characters;
  }

  private createCharacterRelationships(characters: PersistentCharacter[]): void {
    // Create some interesting relationships
    const relationships = [
      {
        char1: "Dr. Zara Voidwhisper",
        char2: "Captain Rex Stormbreaker", 
        type: "ally" as const,
        backstory: "Both investigating government cover-ups from different angles"
      },
      {
        char1: "Luna Starweaver",
        char2: "Aria Quantumleap",
        type: "friend" as const,
        backstory: "Luna covers Aria's sports career and they've become close friends"
      },
      {
        char1: "Marcus Creditcrash",
        char2: "Phoenix Shadowdancer",
        type: "colleague" as const,
        backstory: "Share information about corporate corruption and financial crimes"
      },
      {
        char1: "Nova Heartstring",
        char2: "Professor Sage Mindbridge",
        type: "mentor" as const,
        backstory: "Sage was Nova's professor and continues to guide her research"
      }
    ];

    relationships.forEach(rel => {
      const char1 = characters.find(c => c.name === rel.char1);
      const char2 = characters.find(c => c.name === rel.char2);
      
      if (char1 && char2) {
        char1.relationships.push({
          characterId: char2.id,
          characterName: char2.name,
          relationshipType: rel.type,
          backstory: rel.backstory,
          currentStatus: 'active'
        });
        
        char2.relationships.push({
          characterId: char1.id,
          characterName: char1.name,
          relationshipType: rel.type,
          backstory: rel.backstory,
          currentStatus: 'active'
        });
      }
    });
  }

  private isEventRelevantToCharacter(event: GameEvent, character: PersistentCharacter): boolean {
    // Check if event type matches character's specialties
    return character.specialties.some(specialty => 
      event.description.toLowerCase().includes(specialty.toLowerCase()) ||
      event.title.toLowerCase().includes(specialty.toLowerCase())
    );
  }

  private determineContentType(
    character: PersistentCharacter, 
    relevantEvents: GameEvent[]
  ): 'reaction' | 'announcement' | 'gossip' | 'analysis' | 'personal' | 'breaking' {
    if (relevantEvents.length > 0 && relevantEvents[0].impact === 'major') {
      return character.authorType === 'MEDIA' ? 'breaking' : 'reaction';
    }
    
    if (character.authorType === 'CELEBRITY' || character.profession.includes('Entertainment')) {
      return Math.random() > 0.5 ? 'gossip' : 'personal';
    }
    
    if (character.authorType === 'ANALYST' || character.authorType === 'SCIENTIST') {
      return 'analysis';
    }
    
    if (character.authorType === 'OFFICIAL') {
      return 'announcement';
    }
    
    return Math.random() > 0.6 ? 'personal' : 'reaction';
  }

  private extractReferencedCharacters(content: string, author: PersistentCharacter): string[] {
    const referenced: string[] = [];
    
    // Look for character names in relationships
    author.relationships.forEach(rel => {
      if (content.includes(rel.characterName) || content.includes(rel.characterName.split(' ')[0])) {
        referenced.push(rel.characterId);
      }
    });
    
    return referenced;
  }

  private generateFallbackCharacterPost(
    character: PersistentCharacter, 
    relevantEvents: GameEvent[]
  ): CharacterPost {
    const fallbackContent = {
      "Dr. Zara Voidwhisper": "🔬 The quantum signatures I'm detecting near the galactic core are... disturbing. The government keeps telling us it's 'natural phenomena' but my calculations suggest otherwise. Something big is coming, and they know it. #QuantumMystery #TruthSeekers",
      "Captain Rex Stormbreaker": "⚔️ Another 'training exercise' between civilizations that looks suspiciously like weapons testing! The military-industrial complex is playing dangerous games with our security. When will leaders prioritize peace over profit? #MilitaryTruth #PeaceFirst",
      "Luna Starweaver": "✨ BREAKING: Sources tell me a certain A-list celebrity couple's 'perfect relationship' is anything but! The drama behind the scenes would make your head spin. More details coming soon... 👀 #CelebritySecrets #GalacticGossip"
    };

    const content = fallbackContent[character.name] || 
      `${character.avatar} Just another day in the life of a ${character.personality} ${character.profession}! The galaxy keeps getting more interesting by the minute. #GalacticLife #${character.profession.replace(/\s+/g, '')}`;

    return {
      id: `fallback_${character.id}_${Date.now()}`,
      characterId: character.id,
      content,
      timestamp: new Date(),
      referencedCharacters: [],
      contentType: 'personal',
      metrics: {
        likes: Math.floor(Math.random() * 200) + 50,
        shares: Math.floor(Math.random() * 100) + 20,
        comments: Math.floor(Math.random() * 50) + 10
      }
    };
  }

  private async updateCharactersFromGameEvents(
    characters: PersistentCharacter[], 
    gameEvents: GameEvent[]
  ): Promise<void> {
    // Update character storylines based on game events
    for (const character of characters) {
      const relevantEvents = gameEvents.filter(event => 
        event.civilizationsInvolved.includes(character.civilization) ||
        this.isEventRelevantToCharacter(event, character)
      );

      if (relevantEvents.length > 0) {
        // Update character's current storyline
        const majorEvent = relevantEvents.find(e => e.impact === 'major');
        if (majorEvent && majorEvent.ongoingStoryline) {
          character.currentStoryline = majorEvent.ongoingStoryline;
        }

        // Add to recent events
        relevantEvents.forEach(event => {
          if (!character.recentEvents.includes(event.title)) {
            character.recentEvents.push(event.title);
          }
        });

        // Keep only recent events
        if (character.recentEvents.length > 5) {
          character.recentEvents = character.recentEvents.slice(-5);
        }
      }
    }
  }

  private async saveCharacterStates(characters: PersistentCharacter[]): Promise<void> {
    // Update cache
    characters.forEach(char => {
      this.characterCache.set(char.id, char);
    });

    // In a full implementation, this would save to database
    // For now, we rely on the in-memory cache
  }

  // Convert character posts to the format expected by the Witter system
  convertToWitterPosts(characterPosts: CharacterPost[]): any[] {
    return characterPosts.map(post => {
      const character = this.characterCache.get(post.characterId);
      if (!character) return null;

      return {
        id: post.id,
        authorId: character.id,
        authorName: character.name,
        authorType: character.authorType.toLowerCase(),
        authorAvatar: character.avatar,
        content: post.content,
        timestamp: post.timestamp.toISOString(),
        likes: post.metrics.likes,
        shares: post.metrics.shares,
        comments: post.metrics.comments,
        metadata: {
          sourceType: 'character_driven',
          characterId: character.id,
          personality: character.personality,
          profession: character.profession,
          civilization: character.civilization,
          storylineId: post.storylineId,
          gameEventId: post.gameEventId,
          contentType: post.contentType,
          credibility: character.credibility,
          isRecurring: character.isRecurring
        }
      };
    }).filter(post => post !== null);
  }
}

let characterDrivenContentService: CharacterDrivenContentService;

export function initializeCharacterDrivenContentService(pool: Pool): void {
  characterDrivenContentService = new CharacterDrivenContentService(pool);
  console.log('✅ Character-Driven Content Service initialized');
}

export function getCharacterDrivenContentService(): CharacterDrivenContentService {
  if (!characterDrivenContentService) {
    throw new Error('Character-Driven Content Service not initialized');
  }
  return characterDrivenContentService;
}

export default CharacterDrivenContentService;
