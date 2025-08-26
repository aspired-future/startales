/**
 * Game Master Story Engine for Witter
 * 
 * This service acts as the Game Master, dynamically creating characters, 
 * propelling storylines forward, and generating story-driven content based 
 * on the current game state and setup.
 */

import { Pool } from 'pg';
import { CharacterService } from '../characters/CharacterService.js';
import { DynamicCharacterEngine } from '../characters/DynamicCharacterEngine.js';
import { ProceduralCharacterGenerator } from '../characters/ProceduralCharacterGenerator.js';
import { getAIService } from '../../services/AIService.js';
import { v4 as uuidv4 } from 'uuid';

export interface GameSetup {
  civilizationId: number;
  gameTheme: string; // e.g., "political intrigue", "scientific discovery", "economic warfare"
  storyGenre: string; // e.g., "space opera", "cyberpunk", "political thriller"
  playerActions: string[];
  currentEvents: string[];
  majorStorylines: string[];
  characterPopulationTarget: number; // How many characters should exist
  storyTension: number; // 1-10, how dramatic/intense the story should be
}

export interface StoryEvent {
  id: string;
  type: 'character_introduction' | 'plot_development' | 'conflict_escalation' | 'revelation' | 'crisis';
  title: string;
  description: string;
  charactersInvolved: string[];
  storyImpact: number; // 1-10
  triggerConditions: string[];
  timestamp: Date;
  gameSetupId: string;
}

export interface CharacterGenerationRequest {
  civilizationId: number;
  characterType: 'protagonist' | 'antagonist' | 'supporting' | 'background' | 'catalyst';
  storyRole: string; // e.g., "whistleblower", "corrupt official", "love interest"
  relationshipToExisting?: string; // Connection to existing characters
  urgency: 'immediate' | 'soon' | 'background';
  count: number;
}

export class GameMasterStoryEngine {
  private pool: Pool;
  private characterService: CharacterService;
  private characterEngine: DynamicCharacterEngine;
  private characterGenerator: ProceduralCharacterGenerator;
  private aiService: any;
  private activeGameSetups: Map<number, GameSetup> = new Map();
  private storyEvents: Map<string, StoryEvent[]> = new Map();
  private characterGenerationQueue: CharacterGenerationRequest[] = [];
  private storyProgressionTimers: Map<number, NodeJS.Timeout> = new Map();
  private lastPlayerActivity: Map<number, Date> = new Map();
  private storyMilestones: Map<number, string[]> = new Map();

  constructor(pool: Pool) {
    this.pool = pool;
    this.characterService = new CharacterService(pool);
    this.characterEngine = new DynamicCharacterEngine(pool);
    this.characterGenerator = new ProceduralCharacterGenerator(pool);
    this.aiService = getAIService();
  }

  /**
   * Initialize the story engine for a new game
   */
  async initializeGameStory(gameSetup: GameSetup): Promise<void> {
    console.log(`🎭 Game Master initializing story for civilization ${gameSetup.civilizationId}`);
    console.log(`📖 Theme: ${gameSetup.gameTheme}, Genre: ${gameSetup.storyGenre}`);
    
    this.activeGameSetups.set(gameSetup.civilizationId, gameSetup);
    
    // Generate initial character population based on story needs
    await this.generateInitialCharacterPopulation(gameSetup);
    
    // Create initial story events
    await this.generateInitialStoryEvents(gameSetup);
    
    // Set up ongoing story monitoring
    this.scheduleStoryProgression(gameSetup.civilizationId);
    
    // Start active story management
    this.startActiveStoryManagement(gameSetup.civilizationId);
    
    console.log(`✅ Game Master story initialization complete and active management started for civilization ${gameSetup.civilizationId}`);
  }

  /**
   * Generate characters specifically for the story
   */
  private async generateInitialCharacterPopulation(gameSetup: GameSetup): Promise<void> {
    const { civilizationId, gameTheme, storyGenre, characterPopulationTarget } = gameSetup;
    
    // Check existing character count
    const existingCharacters = await this.characterService.getCharactersByCivilization(civilizationId, 1000);
    const currentCount = existingCharacters.length;
    
    if (currentCount >= characterPopulationTarget) {
      console.log(`✅ Civilization ${civilizationId} already has ${currentCount} characters (target: ${characterPopulationTarget})`);
      return;
    }
    
    const charactersToGenerate = characterPopulationTarget - currentCount;
    console.log(`🎭 Generating ${charactersToGenerate} story-driven characters for ${gameTheme} theme`);
    
    // Generate character distribution based on story theme
    const distribution = this.calculateStoryBasedDistribution(gameTheme, storyGenre, charactersToGenerate);
    
    // Generate characters in batches
    const batchSize = 50;
    for (let i = 0; i < charactersToGenerate; i += batchSize) {
      const batchCount = Math.min(batchSize, charactersToGenerate - i);
      await this.generateCharacterBatch(civilizationId, gameTheme, storyGenre, batchCount, distribution);
      
      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  private calculateStoryBasedDistribution(theme: string, genre: string, totalCount: number): any {
    // Calculate character type distribution based on story theme
    const baseDistribution = {
      citizen: 0.4,    // 40% regular citizens
      media: 0.15,     // 15% media/journalists
      official: 0.15,  // 15% government/military
      business: 0.15,  // 15% business/corporate
      academic: 0.08,  // 8% scientists/academics
      celebrity: 0.05, // 5% celebrities/influencers
      criminal: 0.02   // 2% criminals/underground
    };

    // Adjust distribution based on story theme
    switch (theme.toLowerCase()) {
      case 'political intrigue':
        baseDistribution.official += 0.1;
        baseDistribution.media += 0.1;
        baseDistribution.citizen -= 0.2;
        break;
      case 'scientific discovery':
        baseDistribution.academic += 0.15;
        baseDistribution.media += 0.05;
        baseDistribution.citizen -= 0.2;
        break;
      case 'economic warfare':
        baseDistribution.business += 0.15;
        baseDistribution.media += 0.05;
        baseDistribution.citizen -= 0.2;
        break;
      case 'social upheaval':
        baseDistribution.citizen += 0.1;
        baseDistribution.media += 0.1;
        baseDistribution.official -= 0.2;
        break;
    }

    // Convert to actual counts
    const distribution: any = {};
    Object.keys(baseDistribution).forEach(type => {
      distribution[type] = Math.floor(totalCount * baseDistribution[type as keyof typeof baseDistribution]);
    });

    return distribution;
  }

  private async generateCharacterBatch(
    civilizationId: number, 
    theme: string, 
    genre: string, 
    count: number, 
    distribution: any
  ): Promise<void> {
    try {
      // Use the existing character generation system
      const context = {
        civilization_id: civilizationId,
        planet_id: 1, // TODO: Get actual planet ID
        city_id: 1,   // TODO: Get actual city ID
        current_events: [`Story theme: ${theme}`, `Genre: ${genre}`],
        economic_climate: 'dynamic',
        political_climate: 'tense',
        social_trends: [theme, genre],
        technology_level: 75,
        population_density: 150,
        cultural_values: [theme.replace(' ', '_')]
      };

      const characters = await this.characterEngine.generateInitialPopulation(context, count, distribution);
      
      // Save characters to database
      for (const character of characters) {
        await this.characterService.createCharacter(character);
      }
      
      console.log(`✅ Generated batch of ${characters.length} characters for ${theme} story`);
      
    } catch (error) {
      console.error('❌ Error generating character batch:', error);
    }
  }

  /**
   * Generate story events that will drive character interactions
   */
  private async generateInitialStoryEvents(gameSetup: GameSetup): Promise<void> {
    const { civilizationId, gameTheme, majorStorylines } = gameSetup;
    
    const storyEvents: StoryEvent[] = [];
    
    // Generate events for each major storyline
    for (const storyline of majorStorylines) {
      const events = await this.generateStorylineEvents(civilizationId, storyline, gameTheme);
      storyEvents.push(...events);
    }
    
    // Store events
    this.storyEvents.set(civilizationId.toString(), storyEvents);
    
    console.log(`📚 Generated ${storyEvents.length} story events for civilization ${civilizationId}`);
  }

  private async generateStorylineEvents(civilizationId: number, storyline: string, theme: string): Promise<StoryEvent[]> {
    const events: StoryEvent[] = [];
    
    // Generate 3-5 events per storyline
    const eventCount = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < eventCount; i++) {
      const event: StoryEvent = {
        id: uuidv4(),
        type: this.selectEventType(i, eventCount),
        title: await this.generateEventTitle(storyline, theme, i),
        description: await this.generateEventDescription(storyline, theme, i),
        charactersInvolved: [], // Will be populated when event triggers
        storyImpact: Math.floor(Math.random() * 5) + 3, // 3-8 impact
        triggerConditions: this.generateTriggerConditions(storyline, i),
        timestamp: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)), // Spread over days
        gameSetupId: civilizationId.toString()
      };
      
      events.push(event);
    }
    
    return events;
  }

  private selectEventType(index: number, total: number): StoryEvent['type'] {
    if (index === 0) return 'character_introduction';
    if (index === total - 1) return 'crisis';
    
    const types: StoryEvent['type'][] = ['plot_development', 'conflict_escalation', 'revelation'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private async generateEventTitle(storyline: string, theme: string, index: number): Promise<string> {
    const prompt = `Generate a compelling story event title for a ${theme} storyline about "${storyline}". This is event ${index + 1} in the sequence. Make it dramatic and specific. Return only the title, no quotes.`;
    
    try {
      const response = await this.aiService.generateContent(prompt, {
        temperature: 0.8,
        maxTokens: 50,
        model: 'main'
      });
      
      return this.extractContentFromResponse(response) || `${storyline} Development ${index + 1}`;
    } catch (error) {
      console.error('Error generating event title:', error);
      return `${storyline} Development ${index + 1}`;
    }
  }

  private async generateEventDescription(storyline: string, theme: string, index: number): Promise<string> {
    const prompt = `Generate a detailed description for a story event in a ${theme} storyline about "${storyline}". This is event ${index + 1}. Describe what happens, who might be involved, and why it matters. 2-3 sentences.`;
    
    try {
      const response = await this.aiService.generateContent(prompt, {
        temperature: 0.8,
        maxTokens: 150,
        model: 'main'
      });
      
      return this.extractContentFromResponse(response) || `A significant development occurs in the ${storyline} situation.`;
    } catch (error) {
      console.error('Error generating event description:', error);
      return `A significant development occurs in the ${storyline} situation.`;
    }
  }

  private generateTriggerConditions(storyline: string, index: number): string[] {
    const conditions = [
      `storyline_${storyline.replace(/\s+/g, '_')}_active`,
      `event_sequence_${index}`,
      `time_elapsed_${index * 24}h`
    ];
    
    if (index > 0) {
      conditions.push(`previous_event_completed`);
    }
    
    return conditions;
  }

  /**
   * Schedule ongoing story progression
   */
  private scheduleStoryProgression(civilizationId: number): void {
    // Set up periodic story progression (every 30 minutes)
    setInterval(() => {
      this.progressStory(civilizationId);
    }, 30 * 60 * 1000);
    
    console.log(`⏰ Scheduled story progression for civilization ${civilizationId}`);
  }

  /**
   * Progress the story by triggering events and generating new characters
   */
  async progressStory(civilizationId: number): Promise<void> {
    const gameSetup = this.activeGameSetups.get(civilizationId);
    if (!gameSetup) return;
    
    console.log(`🎬 Game Master progressing story for civilization ${civilizationId}`);
    
    // Check if any story events should trigger
    await this.checkAndTriggerEvents(civilizationId);
    
    // Generate new characters if needed for story
    await this.generateStoryDrivenCharacters(civilizationId);
    
    // Update existing character storylines
    await this.updateCharacterStorylines(civilizationId);
  }

  private async checkAndTriggerEvents(civilizationId: number): Promise<void> {
    const events = this.storyEvents.get(civilizationId.toString()) || [];
    const now = new Date();
    
    for (const event of events) {
      if (event.timestamp <= now && this.shouldTriggerEvent(event)) {
        await this.triggerStoryEvent(event);
      }
    }
  }

  private shouldTriggerEvent(event: StoryEvent): boolean {
    // Check trigger conditions
    // For now, just check timing
    return true;
  }

  private async triggerStoryEvent(event: StoryEvent): Promise<void> {
    console.log(`🎭 Triggering story event: ${event.title}`);
    
    // Find characters to involve in this event
    const characters = await this.selectCharactersForEvent(event);
    event.charactersInvolved = characters.map(c => c.id);
    
    // This event will influence character posts in the Witter feed
    // The characters involved will reference this event in their posts
  }

  private async selectCharactersForEvent(event: StoryEvent): Promise<any[]> {
    // Select 2-4 characters to be involved in this event
    const civilizationId = parseInt(event.gameSetupId);
    const allCharacters = await this.characterService.getCharactersByCivilization(civilizationId, 100);
    
    const selectedCount = Math.floor(Math.random() * 3) + 2; // 2-4 characters
    const shuffled = allCharacters.sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, selectedCount);
  }

  private async generateStoryDrivenCharacters(civilizationId: number): Promise<void> {
    // Check if we need new characters for ongoing stories
    const gameSetup = this.activeGameSetups.get(civilizationId);
    if (!gameSetup) return;
    
    // Randomly decide if we should introduce a new character (10% chance)
    if (Math.random() < 0.1) {
      console.log(`🎭 Game Master introducing new character to civilization ${civilizationId}`);
      
      const characterType = this.selectNewCharacterType(gameSetup);
      await this.generateSpecificCharacter(civilizationId, characterType, gameSetup);
    }
  }

  private selectNewCharacterType(gameSetup: GameSetup): string {
    const types = ['whistleblower', 'investigator', 'insider', 'rival', 'ally', 'catalyst'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private async generateSpecificCharacter(civilizationId: number, characterType: string, gameSetup: GameSetup): Promise<void> {
    try {
      const context = {
        civilization_id: civilizationId,
        planet_id: 1,
        city_id: 1,
        current_events: [`New ${characterType} emerges`, ...gameSetup.currentEvents],
        economic_climate: 'dynamic',
        political_climate: 'tense',
        social_trends: [gameSetup.gameTheme, characterType],
        technology_level: 75,
        population_density: 150,
        cultural_values: [gameSetup.gameTheme.replace(' ', '_')]
      };

      // Generate a single character with specific role
      const characters = await this.characterEngine.generateInitialPopulation(context, 1, { [characterType]: 1 });
      
      if (characters.length > 0) {
        await this.characterService.createCharacter(characters[0]);
        console.log(`✅ Generated new ${characterType} character: ${characters[0].name.full_display}`);
      }
      
    } catch (error) {
      console.error(`❌ Error generating ${characterType} character:`, error);
    }
  }

  private async updateCharacterStorylines(civilizationId: number): Promise<void> {
    // Update character storylines based on recent events
    // This will influence their future posts
    const gameSetup = this.activeGameSetups.get(civilizationId);
    if (!gameSetup) return;
    
    // Get recent events
    const recentEvents = this.storyEvents.get(civilizationId.toString()) || [];
    const activeEvents = recentEvents.filter(e => 
      e.timestamp <= new Date() && 
      e.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    );
    
    if (activeEvents.length > 0) {
      console.log(`📝 Updating character storylines based on ${activeEvents.length} recent events`);
      // Character storylines will be updated to reflect these events
      // This influences their social media posts
    }
  }

  private extractContentFromResponse(response: any): string {
    if (typeof response === 'string') {
      return response.trim();
    }
    if (response && response.content) {
      return response.content.trim();
    }
    if (response && response.text) {
      return response.text.trim();
    }
    return '';
  }

  /**
   * Generate dynamic story events based on current game state
   */
  async generateStoryEvents(civilizationId: number, limit: number = 10): Promise<any[]> {
    const gameSetup = this.activeGameSetups.get(civilizationId);
    if (!gameSetup) {
      console.warn(`No game setup found for civilization ${civilizationId}, generating basic events`);
      return this.generateBasicStoryEvents(civilizationId, limit);
    }

    try {
      const storyPrompt = `
      Generate ${limit} dynamic story events for a ${gameSetup.storyGenre} campaign with the theme "${gameSetup.gameTheme}".
      
      Game Context:
      - Story Tension: ${gameSetup.storyTension}/10
      - Major Storylines: ${gameSetup.majorStorylines.join(', ')}
      - Current Events: ${gameSetup.currentEvents.join(', ')}
      - Player Actions: ${gameSetup.playerActions.join(', ')}
      
      Generate events that:
      - Build on existing storylines
      - Reflect current game state and player actions
      - Provide meaningful choices with consequences
      - Include dramatic narration suitable for text-to-speech
      - Have contextual image descriptions for AI generation
      - Vary in urgency and story phase
      
      Return JSON array with events containing:
      - id, title, description, type, urgency, storyPhase
      - dramaticNarration (TTS-ready with stage directions)
      - cinematicDescription (for image generation)
      - playerChoices array with consequences
      - timestamp, requiresResponse, mediaGenerated
      `;

      const response = await this.aiService.generateContent(storyPrompt, {
        temperature: 0.8,
        maxTokens: 2000
      });

      const events = JSON.parse(response);
      
      // Enhance events with dynamic image URLs based on content
      const enhancedEvents = events.map((event: any) => ({
        ...event,
        id: `event_${civilizationId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(Date.now() - Math.random() * 3600000), // Random time in last hour
        visualContent: this.generateContextualImageURL(event, gameSetup),
        storyArc: this.determineStoryArc(event, gameSetup),
        mediaGenerated: true
      }));

      // Store events for future reference
      const existingEvents = this.storyEvents.get(civilizationId.toString()) || [];
      this.storyEvents.set(civilizationId.toString(), [...existingEvents, ...enhancedEvents]);

      console.log(`✅ Generated ${enhancedEvents.length} dynamic story events for civilization ${civilizationId}`);
      return enhancedEvents;

    } catch (error) {
      console.error('Error generating dynamic story events:', error);
      return this.generateBasicStoryEvents(civilizationId, limit);
    }
  }

  /**
   * Generate contextual image URL based on story content and game theme
   */
  private generateContextualImageURL(event: any, gameSetup: GameSetup): string {
    const themeKeywords = gameSetup.gameTheme.toLowerCase().replace(/\s+/g, '-');
    const genreKeywords = gameSetup.storyGenre.toLowerCase().replace(/\s+/g, '-');
    const eventKeywords = event.title.toLowerCase().replace(/\s+/g, '-');
    const typeKeywords = event.type.replace(/_/g, '-');
    
    const seedString = `futuristic-${genreKeywords}-${themeKeywords}-${eventKeywords}-${typeKeywords}-lively-galaxy`;
    
    return `https://picsum.photos/seed/${seedString}/800/450`;
  }

  /**
   * Determine which story arc an event belongs to
   */
  private determineStoryArc(event: any, gameSetup: GameSetup): string {
    // Map event types to story arcs based on game theme
    const arcMappings: Record<string, string> = {
      'political intrigue': 'political-conspiracy',
      'scientific discovery': 'research-breakthrough',
      'economic warfare': 'trade-conflict',
      'cosmic horror': 'void-invasion',
      'exploration': 'discovery-expedition'
    };
    
    return arcMappings[gameSetup.gameTheme.toLowerCase()] || 'main-storyline';
  }

  /**
   * Generate basic fallback story events when AI generation fails
   */
  private generateBasicStoryEvents(civilizationId: number, limit: number): any[] {
    const basicEvents = [
      {
        id: `basic_event_${civilizationId}_${Date.now()}_1`,
        title: 'Galactic Council Assembly',
        description: 'Representatives from across the galaxy gather to discuss pressing interstellar matters.',
        type: 'story',
        urgency: 'medium',
        storyPhase: 'rising_action',
        dramaticNarration: 'The great halls of the Galactic Council echo with the voices of a thousand worlds. Today, decisions will be made that will shape the future of our civilization.',
        cinematicDescription: 'Vast council chambers with representatives from diverse alien species, holographic displays showing star maps, dramatic lighting',
        visualContent: 'https://picsum.photos/seed/galactic-council-assembly-futuristic-politics/800/450',
        timestamp: new Date(Date.now() - Math.random() * 1800000),
        requiresResponse: true,
        playerChoices: [
          {
            id: 'diplomatic',
            text: 'Pursue diplomatic solutions',
            consequences: ['Improved relations', 'Slower progress']
          },
          {
            id: 'aggressive',
            text: 'Take a strong stance',
            consequences: ['Quick results', 'Potential conflicts']
          }
        ],
        storyArc: 'main-storyline',
        mediaGenerated: true
      }
    ];

    return basicEvents.slice(0, limit);
  }

  /**
   * Start active story management for a civilization
   */
  startActiveStoryManagement(civilizationId: number): void {
    console.log(`🎭 Starting active story management for civilization ${civilizationId}`);
    
    // Clear any existing timer
    this.stopActiveStoryManagement(civilizationId);
    
    // Set up periodic story progression
    const timer = setInterval(() => {
      this.progressStory(civilizationId);
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    this.storyProgressionTimers.set(civilizationId, timer);
    this.lastPlayerActivity.set(civilizationId, new Date());
    
    // Initialize story milestones
    this.initializeStoryMilestones(civilizationId);
  }

  /**
   * Stop active story management for a civilization
   */
  stopActiveStoryManagement(civilizationId: number): void {
    const timer = this.storyProgressionTimers.get(civilizationId);
    if (timer) {
      clearInterval(timer);
      this.storyProgressionTimers.delete(civilizationId);
      console.log(`🎭 Stopped active story management for civilization ${civilizationId}`);
    }
  }

  /**
   * Record player activity to influence story pacing
   */
  recordPlayerActivity(civilizationId: number, activityType: string, details?: any): void {
    this.lastPlayerActivity.set(civilizationId, new Date());
    
    const gameSetup = this.activeGameSetups.get(civilizationId);
    if (gameSetup) {
      // Add player action to the game setup for story context
      gameSetup.playerActions.push(`${activityType}: ${details || 'action taken'}`);
      
      // Keep only the last 10 actions to avoid memory bloat
      if (gameSetup.playerActions.length > 10) {
        gameSetup.playerActions = gameSetup.playerActions.slice(-10);
      }
      
      console.log(`📝 Recorded player activity: ${activityType} for civilization ${civilizationId}`);
    }
  }

  /**
   * Main story progression logic - called periodically by the Game Master
   */
  private async progressStory(civilizationId: number): Promise<void> {
    const gameSetup = this.activeGameSetups.get(civilizationId);
    if (!gameSetup) return;

    try {
      const lastActivity = this.lastPlayerActivity.get(civilizationId);
      const timeSinceActivity = lastActivity ? Date.now() - lastActivity.getTime() : 0;
      const minutesSinceActivity = timeSinceActivity / (1000 * 60);

      // Determine if we should generate a new story event
      const shouldGenerateEvent = this.shouldGenerateStoryEvent(civilizationId, minutesSinceActivity);
      
      if (shouldGenerateEvent) {
        console.log(`🎭 Game Master generating new story event for civilization ${civilizationId}`);
        await this.generateProgressionEvent(civilizationId);
      }

      // Check for story milestones
      await this.checkStoryMilestones(civilizationId);

      // Update story tension based on recent activity
      this.adjustStoryTension(civilizationId, minutesSinceActivity);

    } catch (error) {
      console.error(`❌ Error in story progression for civilization ${civilizationId}:`, error);
    }
  }

  /**
   * Determine if a new story event should be generated
   */
  private shouldGenerateStoryEvent(civilizationId: number, minutesSinceActivity: number): boolean {
    const gameSetup = this.activeGameSetups.get(civilizationId);
    if (!gameSetup) return false;

    const existingEvents = this.storyEvents.get(civilizationId.toString()) || [];
    const recentEvents = existingEvents.filter(e => 
      Date.now() - e.timestamp.getTime() < 30 * 60 * 1000 // Last 30 minutes
    );

    // Don't generate too many events too quickly
    if (recentEvents.length >= 3) return false;

    // Generate events based on story tension and player activity
    const tensionFactor = gameSetup.storyTension / 10;
    const activityFactor = Math.min(minutesSinceActivity / 60, 1); // 0-1 based on hours since activity

    // Higher tension = more frequent events
    // More time since activity = more likely to generate event to re-engage
    const probability = (tensionFactor * 0.3) + (activityFactor * 0.4) + 0.1;
    
    return Math.random() < probability;
  }

  /**
   * Generate a story progression event
   */
  private async generateProgressionEvent(civilizationId: number): Promise<void> {
    const gameSetup = this.activeGameSetups.get(civilizationId);
    if (!gameSetup) return;

    const existingEvents = this.storyEvents.get(civilizationId.toString()) || [];
    const recentEvents = existingEvents.slice(-5); // Last 5 events for context

    try {
      const progressionPrompt = `
      As the Game Master, generate a new story event that progresses the narrative for a ${gameSetup.storyGenre} campaign.
      
      Current Game Context:
      - Theme: ${gameSetup.gameTheme}
      - Story Tension: ${gameSetup.storyTension}/10
      - Recent Player Actions: ${gameSetup.playerActions.slice(-3).join(', ')}
      - Major Storylines: ${gameSetup.majorStorylines.join(', ')}
      - Recent Events: ${recentEvents.map(e => e.title).join(', ')}
      
      Generate an event that:
      - Builds on recent events and player actions
      - Advances one of the major storylines
      - Creates new opportunities for player engagement
      - Matches the current story tension level
      - Includes meaningful choices with consequences
      - Has dramatic narration for voice synthesis
      - Provides a compelling reason for players to take action
      
      The event should feel like a natural progression of the story, not random.
      
      Return JSON with: id, title, description, type, urgency, storyPhase, dramaticNarration, cinematicDescription, playerChoices, requiresResponse
      `;

      const response = await this.aiService.generateContent(progressionPrompt, {
        temperature: 0.7,
        maxTokens: 800
      });

      const eventData = JSON.parse(response);
      
      const newEvent = {
        ...eventData,
        id: `gm_event_${civilizationId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        visualContent: this.generateContextualImageURL(eventData, gameSetup),
        storyArc: this.determineStoryArc(eventData, gameSetup),
        mediaGenerated: true,
        generatedByGM: true
      };

      // Add to events
      const updatedEvents = [...existingEvents, newEvent];
      this.storyEvents.set(civilizationId.toString(), updatedEvents);

      console.log(`✅ Game Master generated progression event: "${newEvent.title}" for civilization ${civilizationId}`);

      // Trigger any related systems (missions, character reactions, etc.)
      await this.triggerEventConsequences(civilizationId, newEvent);

    } catch (error) {
      console.error('Error generating progression event:', error);
    }
  }

  /**
   * Initialize story milestones for tracking major story beats
   */
  private initializeStoryMilestones(civilizationId: number): void {
    const gameSetup = this.activeGameSetups.get(civilizationId);
    if (!gameSetup) return;

    const milestones = [
      'first_major_decision',
      'conflict_escalation',
      'alliance_formation',
      'betrayal_revealed',
      'climax_approach',
      'final_confrontation',
      'resolution_achieved'
    ];

    this.storyMilestones.set(civilizationId, milestones);
  }

  /**
   * Check if any story milestones should be triggered
   */
  private async checkStoryMilestones(civilizationId: number): Promise<void> {
    const milestones = this.storyMilestones.get(civilizationId) || [];
    const existingEvents = this.storyEvents.get(civilizationId.toString()) || [];
    
    // Logic to determine if milestones should be triggered based on:
    // - Number of events
    // - Player choices made
    // - Time elapsed
    // - Story tension level
    
    if (existingEvents.length >= 5 && milestones.includes('conflict_escalation')) {
      await this.triggerStoryMilestone(civilizationId, 'conflict_escalation');
    }
  }

  /**
   * Trigger a specific story milestone
   */
  private async triggerStoryMilestone(civilizationId: number, milestone: string): Promise<void> {
    console.log(`🎯 Triggering story milestone: ${milestone} for civilization ${civilizationId}`);
    
    // Remove the milestone so it doesn't trigger again
    const milestones = this.storyMilestones.get(civilizationId) || [];
    const updatedMilestones = milestones.filter(m => m !== milestone);
    this.storyMilestones.set(civilizationId, updatedMilestones);
    
    // Generate a milestone event
    await this.generateMilestoneEvent(civilizationId, milestone);
  }

  /**
   * Generate a special milestone event
   */
  private async generateMilestoneEvent(civilizationId: number, milestone: string): Promise<void> {
    // Similar to generateProgressionEvent but specifically for major story beats
    console.log(`📖 Generating milestone event for ${milestone}`);
    // Implementation would be similar to generateProgressionEvent but with milestone-specific prompts
  }

  /**
   * Adjust story tension based on player activity and events
   */
  private adjustStoryTension(civilizationId: number, minutesSinceActivity: number): void {
    const gameSetup = this.activeGameSetups.get(civilizationId);
    if (!gameSetup) return;

    // Increase tension if players are inactive (to create urgency)
    if (minutesSinceActivity > 120) { // 2 hours
      gameSetup.storyTension = Math.min(10, gameSetup.storyTension + 0.5);
    }
    
    // Decrease tension slightly after major events to allow breathing room
    const recentEvents = this.storyEvents.get(civilizationId.toString()) || [];
    const veryRecentEvents = recentEvents.filter(e => 
      Date.now() - e.timestamp.getTime() < 10 * 60 * 1000 // Last 10 minutes
    );
    
    if (veryRecentEvents.length > 0) {
      gameSetup.storyTension = Math.max(1, gameSetup.storyTension - 0.2);
    }
  }

  /**
   * Trigger consequences of story events (missions, character reactions, etc.)
   */
  private async triggerEventConsequences(civilizationId: number, event: any): Promise<void> {
    // Create related missions
    if (event.requiresResponse) {
      await this.createStoryMission(civilizationId, event.id, 'story_response');
    }
    
    // Update character storylines
    await this.updateCharacterStorylines(civilizationId);
    
    // Potentially generate new characters if the story calls for it
    if (event.type === 'discovery' || event.type === 'crisis') {
      this.queueCharacterGeneration(civilizationId, 'specialist', event.title);
    }
  }

  /**
   * Get current story context for character content generation
   */
  getStoryContextForCharacters(civilizationId: number): any {
    const gameSetup = this.activeGameSetups.get(civilizationId);
    const events = this.storyEvents.get(civilizationId.toString()) || [];
    
    const recentEvents = events.filter(e => 
      e.timestamp <= new Date() && 
      e.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    );
    
    return {
      gameTheme: gameSetup?.gameTheme || 'general',
      storyGenre: gameSetup?.storyGenre || 'space opera',
      recentEvents: recentEvents.map(e => ({ title: e.title, description: e.description })),
      storyTension: gameSetup?.storyTension || 5,
      majorStorylines: gameSetup?.majorStorylines || []
    };
  }
}

let gameMasterStoryEngine: GameMasterStoryEngine;

export function initializeGameMasterStoryEngine(pool: Pool): void {
  gameMasterStoryEngine = new GameMasterStoryEngine(pool);
  console.log('✅ Game Master Story Engine initialized');
}

export function getGameMasterStoryEngine(): GameMasterStoryEngine {
  if (!gameMasterStoryEngine) {
    throw new Error('Game Master Story Engine not initialized');
  }
  return gameMasterStoryEngine;
}

export default GameMasterStoryEngine;
