import { Pool } from 'pg';
import { getGameMasterStoryEngine } from '../story/GameMasterStoryEngine';
import { getAIService } from '../ai/AIService';

export interface GameConfiguration {
  id: string;
  name: string;
  description: string;
  theme: 'space_opera' | 'cyberpunk' | 'fantasy' | 'post_apocalyptic' | 'steampunk' | 'modern_politics';
  maxPlayers: number;
  storyComplexity: 'simple' | 'moderate' | 'complex' | 'epic';
  gameMode: 'cooperative' | 'competitive' | 'mixed';
  duration: 'short' | 'medium' | 'long' | 'campaign'; // 1-3 hours, 3-6 hours, 6+ hours, ongoing
  createdBy: string; // Host player ID
  createdAt: Date;
  status: 'setup' | 'waiting_for_players' | 'active' | 'paused' | 'completed';
  storyInitialized: boolean;
  playerSlots: PlayerSlot[];
}

export interface PlayerSlot {
  slotId: number;
  playerId?: string;
  playerName?: string;
  civilizationId?: number;
  role: 'host' | 'player' | 'observer';
  joinedAt?: Date;
  isReady: boolean;
}

export interface StorySetupOptions {
  theme: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'epic';
  playerCount: number;
  customPrompt?: string;
  includeConflicts: boolean;
  includeMysteries: boolean;
  includeAlliances: boolean;
  paceOfEvents: 'slow' | 'moderate' | 'fast' | 'dynamic';
}

export class GameSetupService {
  private pool: Pool;
  private aiService: any;
  private storyEngine: any;
  private activeGames: Map<string, GameConfiguration> = new Map();

  constructor(pool: Pool) {
    this.pool = pool;
    this.aiService = getAIService();
    try {
      this.storyEngine = getGameMasterStoryEngine();
    } catch (error) {
      console.warn('Story Engine not available during game setup:', error.message);
      this.storyEngine = null;
    }
  }

  /**
   * Create a new game with story initialization
   */
  async createGame(hostPlayerId: string, config: Partial<GameConfiguration>): Promise<GameConfiguration> {
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const gameConfig: GameConfiguration = {
      id: gameId,
      name: config.name || 'Galactic Saga',
      description: config.description || 'An epic space opera adventure',
      theme: config.theme || 'space_opera',
      maxPlayers: config.maxPlayers || 4,
      storyComplexity: config.storyComplexity || 'moderate',
      gameMode: config.gameMode || 'cooperative',
      duration: config.duration || 'medium',
      createdBy: hostPlayerId,
      createdAt: new Date(),
      status: 'setup',
      storyInitialized: false,
      playerSlots: this.createPlayerSlots(config.maxPlayers || 4, hostPlayerId)
    };

    // Store the game configuration
    this.activeGames.set(gameId, gameConfig);
    
    console.log(`🎮 Created new game: ${gameConfig.name} (${gameId})`);
    
    // Initialize the story for this game
    await this.initializeGameStory(gameConfig);
    
    return gameConfig;
  }

  /**
   * Initialize the story for a game
   */
  private async initializeGameStory(gameConfig: GameConfiguration): Promise<void> {
    if (!this.storyEngine) {
      console.log('📖 Story engine not available, using basic setup');
      gameConfig.storyInitialized = true;
      return;
    }

    try {
      console.log(`📖 Initializing story for game: ${gameConfig.name}`);
      
      // Create story setup options based on game configuration
      const storyOptions: StorySetupOptions = {
        theme: gameConfig.theme,
        complexity: gameConfig.storyComplexity,
        playerCount: gameConfig.maxPlayers,
        includeConflicts: gameConfig.gameMode !== 'cooperative',
        includeMysteries: gameConfig.storyComplexity !== 'simple',
        includeAlliances: gameConfig.maxPlayers > 2,
        paceOfEvents: this.getEventPaceFromDuration(gameConfig.duration)
      };

      // Generate a comprehensive story setup
      const storySetup = await this.generateStorySetup(gameConfig, storyOptions);
      
      // Initialize the story engine for this game
      // We'll use the game ID as a unique civilization ID for story tracking
      const gameStoryId = parseInt(gameConfig.id.replace(/\D/g, '').slice(0, 8)) || 1;
      
      await this.storyEngine.initializeStoryForCivilization(gameStoryId, gameConfig.theme);
      
      gameConfig.storyInitialized = true;
      
      console.log(`✅ Story initialized for game: ${gameConfig.name}`);
      
    } catch (error) {
      console.error('Error initializing game story:', error);
      gameConfig.storyInitialized = false;
    }
  }

  /**
   * Generate a comprehensive story setup based on game configuration
   */
  private async generateStorySetup(gameConfig: GameConfiguration, options: StorySetupOptions): Promise<any> {
    const setupPrompt = `
    Create a comprehensive story setup for a ${gameConfig.theme} game with the following parameters:
    
    Game: "${gameConfig.name}"
    Description: ${gameConfig.description}
    Theme: ${gameConfig.theme}
    Players: ${gameConfig.maxPlayers}
    Complexity: ${options.complexity}
    Game Mode: ${gameConfig.gameMode}
    Duration: ${gameConfig.duration}
    
    Generate a story setup that includes:
    - Central conflict or mystery that drives the entire campaign
    - Multiple story arcs that can unfold over time
    - Opportunities for player interaction and meaningful choices
    - ${options.includeConflicts ? 'Inter-player conflicts and competition' : 'Cooperative challenges'}
    - ${options.includeMysteries ? 'Deep mysteries and plot twists' : 'Straightforward narrative progression'}
    - ${options.includeAlliances ? 'Alliance opportunities and diplomatic elements' : 'Individual player focus'}
    - Event pacing: ${options.paceOfEvents}
    
    The story should be engaging for ${gameConfig.maxPlayers} players and suitable for a ${gameConfig.duration} session.
    
    Return JSON with:
    - overallTheme: Main story theme
    - centralConflict: Primary conflict driving the story
    - storyArcs: Array of story arc summaries
    - keyCharacters: Important NPCs and their roles
    - majorEvents: Planned major story events
    - playerRoles: Suggested roles/positions for players
    - winConditions: How the story can conclude successfully
    `;

    try {
      const response = await this.aiService.generateContent(setupPrompt, {
        temperature: 0.8,
        maxTokens: 2000
      });

      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating story setup:', error);
      return this.getDefaultStorySetup(gameConfig);
    }
  }

  /**
   * Get default story setup if AI generation fails
   */
  private getDefaultStorySetup(gameConfig: GameConfiguration): any {
    return {
      overallTheme: `Epic ${gameConfig.theme} adventure`,
      centralConflict: 'Ancient forces threaten the galaxy, requiring heroes to unite and save civilization',
      storyArcs: [
        'Discovery of the ancient threat',
        'Gathering allies and resources',
        'Confronting the primary antagonist',
        'Resolution and new beginnings'
      ],
      keyCharacters: [
        'The Game Master - Narrator and guide',
        'Ancient Guardian - Mysterious ally',
        'Shadow Council - Primary antagonists'
      ],
      majorEvents: [
        'Opening crisis that brings players together',
        'Discovery of ancient technology or knowledge',
        'Betrayal or major plot twist',
        'Final confrontation and resolution'
      ],
      playerRoles: Array(gameConfig.maxPlayers).fill(0).map((_, i) => `Leader of Civilization ${i + 1}`),
      winConditions: ['Defeat the ancient threat', 'Establish lasting peace', 'Unlock the secrets of the ancients']
    };
  }

  /**
   * Create player slots for the game
   */
  private createPlayerSlots(maxPlayers: number, hostPlayerId: string): PlayerSlot[] {
    const slots: PlayerSlot[] = [];
    
    // First slot is always the host
    slots.push({
      slotId: 1,
      playerId: hostPlayerId,
      role: 'host',
      isReady: false,
      joinedAt: new Date()
    });
    
    // Create remaining slots
    for (let i = 2; i <= maxPlayers; i++) {
      slots.push({
        slotId: i,
        role: 'player',
        isReady: false
      });
    }
    
    return slots;
  }

  /**
   * Add a player to an existing game
   */
  async joinGame(gameId: string, playerId: string, playerName: string): Promise<boolean> {
    const game = this.activeGames.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    if (game.status !== 'waiting_for_players' && game.status !== 'setup') {
      throw new Error('Game is not accepting new players');
    }

    // Find an empty slot
    const emptySlot = game.playerSlots.find(slot => !slot.playerId);
    if (!emptySlot) {
      throw new Error('Game is full');
    }

    // Assign player to slot
    emptySlot.playerId = playerId;
    emptySlot.playerName = playerName;
    emptySlot.joinedAt = new Date();
    
    // Assign a civilization ID
    emptySlot.civilizationId = emptySlot.slotId;

    console.log(`👤 Player ${playerName} joined game ${game.name} in slot ${emptySlot.slotId}`);
    
    return true;
  }

  /**
   * Start the game when all players are ready
   */
  async startGame(gameId: string): Promise<boolean> {
    const game = this.activeGames.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    if (!game.storyInitialized) {
      throw new Error('Story not yet initialized');
    }

    // Check if all joined players are ready
    const joinedSlots = game.playerSlots.filter(slot => slot.playerId);
    const allReady = joinedSlots.every(slot => slot.isReady);
    
    if (!allReady) {
      throw new Error('Not all players are ready');
    }

    game.status = 'active';
    
    console.log(`🚀 Started game: ${game.name} with ${joinedSlots.length} players`);
    
    return true;
  }

  /**
   * Get event pace from game duration
   */
  private getEventPaceFromDuration(duration: string): 'slow' | 'moderate' | 'fast' | 'dynamic' {
    switch (duration) {
      case 'short': return 'fast';
      case 'medium': return 'moderate';
      case 'long': return 'slow';
      case 'campaign': return 'dynamic';
      default: return 'moderate';
    }
  }

  /**
   * Get all active games
   */
  getActiveGames(): GameConfiguration[] {
    return Array.from(this.activeGames.values());
  }

  /**
   * Get a specific game
   */
  getGame(gameId: string): GameConfiguration | null {
    return this.activeGames.get(gameId) || null;
  }

  /**
   * Set player ready status
   */
  setPlayerReady(gameId: string, playerId: string, ready: boolean): boolean {
    const game = this.activeGames.get(gameId);
    if (!game) return false;

    const playerSlot = game.playerSlots.find(slot => slot.playerId === playerId);
    if (!playerSlot) return false;

    playerSlot.isReady = ready;
    return true;
  }
}

// Singleton instance
let gameSetupService: GameSetupService;

export function initializeGameSetupService(pool: Pool): void {
  gameSetupService = new GameSetupService(pool);
  console.log('🎮 Game Setup Service initialized');
}

export function getGameSetupService(): GameSetupService {
  if (!gameSetupService) {
    throw new Error('Game Setup Service not initialized');
  }
  return gameSetupService;
}
