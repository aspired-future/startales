/**
 * Advanced Game Modes - API Routes
 * 
 * Provides REST API endpoints for COOP, Achievement, Conquest, and Hero game modes
 * with session management, objectives, and player interactions.
 */

import { Router, Request, Response } from 'express';
import { GameModesEngine } from './GameModesEngine.js';
import { GameModeType, DifficultyLevel } from './types.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = Router();

// Enhanced AI Knobs for Game Modes System
const gameModesKnobsData = {
  // Game Mode Difficulty & Balance
  difficulty_scaling_intensity: 0.7,      // Difficulty scaling and challenge intensity
  player_skill_adaptation: 0.7,           // Player skill adaptation and dynamic difficulty
  challenge_progression_rate: 0.6,        // Challenge progression and learning curve rate
  
  // Cooperative & Multiplayer Features
  cooperative_gameplay_emphasis: 0.8,     // Cooperative gameplay and team collaboration emphasis
  multiplayer_interaction_depth: 0.7,     // Multiplayer interaction depth and social features
  team_coordination_requirements: 0.6,    // Team coordination and communication requirements
  
  // Achievement & Progression Systems
  achievement_system_complexity: 0.7,     // Achievement system complexity and variety
  progression_reward_frequency: 0.7,      // Progression reward frequency and motivation
  milestone_celebration_intensity: 0.6,   // Milestone celebration and recognition intensity
  
  // Conquest & Competition Features
  conquest_mode_aggressiveness: 0.6,      // Conquest mode competitiveness and aggression
  territorial_expansion_emphasis: 0.7,     // Territorial expansion and control emphasis
  competitive_ranking_importance: 0.6,    // Competitive ranking and leaderboard importance
  
  // Hero & Character Development
  hero_progression_depth: 0.8,            // Hero character progression depth and customization
  character_specialization_variety: 0.8,  // Character specialization and role variety
  narrative_integration_strength: 0.7,    // Narrative integration and story importance
  
  // Game Session Management
  session_flexibility: 0.7,               // Game session flexibility and adaptability
  save_system_robustness: 0.9,            // Save system robustness and reliability
  session_recovery_capability: 0.8,       // Session recovery and crash resilience
  
  // Player Experience & Accessibility
  accessibility_feature_support: 0.8,     // Accessibility feature support and inclusion
  user_interface_customization: 0.7,      // User interface customization and personalization
  tutorial_system_comprehensiveness: 0.7, // Tutorial system comprehensiveness and guidance
  
  // Content Generation & Variety
  procedural_content_generation: 0.6,     // Procedural content generation and variety
  dynamic_event_frequency: 0.6,           // Dynamic event frequency and unpredictability
  replayability_enhancement: 0.7,         // Replayability enhancement and content longevity
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Game Modes
const gameModesKnobSystem = new EnhancedKnobSystem(gameModesKnobsData);

// Apply game modes knobs to game state
function applyGameModesKnobsToGameState() {
  const knobs = gameModesKnobSystem.knobs;
  
  // Apply difficulty and balance settings
  const difficultyBalance = (knobs.difficulty_scaling_intensity + knobs.player_skill_adaptation + 
    knobs.challenge_progression_rate) / 3;
  
  // Apply cooperative gameplay settings
  const cooperativeGameplay = (knobs.cooperative_gameplay_emphasis + knobs.multiplayer_interaction_depth + 
    knobs.team_coordination_requirements) / 3;
  
  // Apply achievement system settings
  const achievementSystem = (knobs.achievement_system_complexity + knobs.progression_reward_frequency + 
    knobs.milestone_celebration_intensity) / 3;
  
  // Apply conquest features settings
  const conquestFeatures = (knobs.conquest_mode_aggressiveness + knobs.territorial_expansion_emphasis + 
    knobs.competitive_ranking_importance) / 3;
  
  // Apply hero development settings
  const heroDevelopment = (knobs.hero_progression_depth + knobs.character_specialization_variety + 
    knobs.narrative_integration_strength) / 3;
  
  // Apply player experience settings
  const playerExperience = (knobs.accessibility_feature_support + knobs.user_interface_customization + 
    knobs.tutorial_system_comprehensiveness) / 3;
  
  console.log('Applied game modes knobs to game state:', {
    difficultyBalance,
    cooperativeGameplay,
    achievementSystem,
    conquestFeatures,
    heroDevelopment,
    playerExperience
  });
}

const gameModesEngine = new GameModesEngine();

// ===== GAME MODE ENDPOINTS =====

/**
 * GET /api/game-modes
 * Get all available game modes
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const { type, difficulty } = req.query;

    let gameModes = gameModesEngine.getGameModes();

    // Apply filters
    if (type) {
      gameModes = gameModesEngine.getGameModesByType(type as GameModeType);
    }

    if (difficulty) {
      gameModes = gameModes.filter(mode => mode.difficulty === difficulty);
    }

    res.json({
      success: true,
      gameModes,
      count: gameModes.length
    });

  } catch (error) {
    console.error('Failed to get game modes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get game modes'
    });
  }
});

/**
 * GET /api/game-modes/:id
 * Get specific game mode by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const gameMode = gameModesEngine.getGameMode(id);

    if (!gameMode) {
      return res.status(404).json({
        success: false,
        error: 'Game mode not found'
      });
    }

    res.json({
      success: true,
      gameMode
    });

  } catch (error) {
    console.error('Failed to get game mode:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get game mode'
    });
  }
});

/**
 * POST /api/game-modes
 * Create custom game mode
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const gameMode = req.body;

    // Validate required fields
    if (!gameMode.id || !gameMode.name || !gameMode.type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: id, name, type'
      });
    }

    gameModesEngine.createCustomGameMode(gameMode);

    res.status(201).json({
      success: true,
      message: 'Custom game mode created',
      gameMode
    });

  } catch (error) {
    console.error('Failed to create game mode:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create game mode'
    });
  }
});

// ===== SESSION MANAGEMENT ENDPOINTS =====

/**
 * GET /api/game-modes/sessions
 * Get active game sessions
 */
router.get('/sessions', (req: Request, res: Response) => {
  try {
    const { status, gameMode, playerId } = req.query;

    let sessions = gameModesEngine.getActiveSessions();

    // Apply filters
    if (status) {
      sessions = sessions.filter(session => session.status === status);
    }

    if (gameMode) {
      sessions = sessions.filter(session => session.gameMode.type === gameMode);
    }

    if (playerId) {
      sessions = sessions.filter(session => 
        session.players.some(player => player.playerId === playerId)
      );
    }

    res.json({
      success: true,
      sessions,
      count: sessions.length
    });

  } catch (error) {
    console.error('Failed to get sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sessions'
    });
  }
});

/**
 * POST /api/game-modes/sessions
 * Create new game session
 */
router.post('/sessions', (req: Request, res: Response) => {
  try {
    const { gameModeId, hostPlayerId, settings } = req.body;

    if (!gameModeId || !hostPlayerId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: gameModeId, hostPlayerId'
      });
    }

    const session = gameModesEngine.createSession(gameModeId, hostPlayerId, settings);

    res.status(201).json({
      success: true,
      message: 'Game session created',
      session
    });

  } catch (error) {
    console.error('Failed to create session:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create session'
    });
  }
});

/**
 * GET /api/game-modes/sessions/:id
 * Get specific game session
 */
router.get('/sessions/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = gameModesEngine.getSession(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      session
    });

  } catch (error) {
    console.error('Failed to get session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get session'
    });
  }
});

/**
 * POST /api/game-modes/sessions/:id/join
 * Join game session
 */
router.post('/sessions/:id/join', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: playerId'
      });
    }

    const success = gameModesEngine.addPlayerToSession(id, playerId);

    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to join session (session full, already in session, or session not available)'
      });
    }

    const session = gameModesEngine.getSession(id);

    res.json({
      success: true,
      message: 'Joined session successfully',
      session
    });

  } catch (error) {
    console.error('Failed to join session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to join session'
    });
  }
});

/**
 * POST /api/game-modes/sessions/:id/leave
 * Leave game session
 */
router.post('/sessions/:id/leave', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: playerId'
      });
    }

    const success = gameModesEngine.removePlayerFromSession(id, playerId);

    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to leave session (session not found or player not in session)'
      });
    }

    res.json({
      success: true,
      message: 'Left session successfully'
    });

  } catch (error) {
    console.error('Failed to leave session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to leave session'
    });
  }
});

/**
 * POST /api/game-modes/sessions/:id/start
 * Start game session
 */
router.post('/sessions/:id/start', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const success = gameModesEngine.startSession(id);

    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to start session (not enough players or session not in waiting state)'
      });
    }

    const session = gameModesEngine.getSession(id);

    res.json({
      success: true,
      message: 'Session started successfully',
      session
    });

  } catch (error) {
    console.error('Failed to start session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start session'
    });
  }
});

/**
 * POST /api/game-modes/sessions/:id/end
 * End game session
 */
router.post('/sessions/:id/end', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { winner, victoryType } = req.body;

    const success = gameModesEngine.endSession(id, winner, victoryType);

    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to end session (session not found)'
      });
    }

    res.json({
      success: true,
      message: 'Session ended successfully'
    });

  } catch (error) {
    console.error('Failed to end session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to end session'
    });
  }
});

// ===== OBJECTIVE MANAGEMENT ENDPOINTS =====

/**
 * POST /api/game-modes/sessions/:id/objectives/:objectiveId/progress
 * Update objective progress
 */
router.post('/sessions/:id/objectives/:objectiveId/progress', (req: Request, res: Response) => {
  try {
    const { id, objectiveId } = req.params;
    const { playerId, progress } = req.body;

    if (progress === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: progress'
      });
    }

    const success = gameModesEngine.updateObjectiveProgress(id, objectiveId, playerId, progress);

    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to update objective progress'
      });
    }

    const objectiveProgress = gameModesEngine.getObjectiveProgress(id, objectiveId, playerId);

    res.json({
      success: true,
      message: 'Objective progress updated',
      objectiveProgress
    });

  } catch (error) {
    console.error('Failed to update objective progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update objective progress'
    });
  }
});

/**
 * GET /api/game-modes/sessions/:id/objectives/:objectiveId/progress
 * Get objective progress
 */
router.get('/sessions/:id/objectives/:objectiveId/progress', (req: Request, res: Response) => {
  try {
    const { id, objectiveId } = req.params;
    const { playerId } = req.query;

    const objectiveProgress = gameModesEngine.getObjectiveProgress(id, objectiveId, playerId as string);

    if (!objectiveProgress) {
      return res.status(404).json({
        success: false,
        error: 'Objective progress not found'
      });
    }

    res.json({
      success: true,
      objectiveProgress
    });

  } catch (error) {
    console.error('Failed to get objective progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get objective progress'
    });
  }
});

// ===== ACHIEVEMENT SYSTEM ENDPOINTS =====

/**
 * GET /api/game-modes/achievements
 * Get all achievements
 */
router.get('/achievements', (req: Request, res: Response) => {
  try {
    const { category, difficulty, hidden } = req.query;

    let achievements = gameModesEngine.getAchievements();

    // Apply filters
    if (category) {
      achievements = achievements.filter(achievement => achievement.category === category);
    }

    if (difficulty) {
      achievements = achievements.filter(achievement => achievement.difficulty === difficulty);
    }

    if (hidden !== undefined) {
      const showHidden = hidden === 'true';
      achievements = achievements.filter(achievement => achievement.isHidden === showHidden);
    }

    res.json({
      success: true,
      achievements,
      count: achievements.length
    });

  } catch (error) {
    console.error('Failed to get achievements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get achievements'
    });
  }
});

/**
 * GET /api/game-modes/achievements/:id
 * Get specific achievement
 */
router.get('/achievements/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const achievement = gameModesEngine.getAchievement(id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      achievement
    });

  } catch (error) {
    console.error('Failed to get achievement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get achievement'
    });
  }
});

/**
 * POST /api/game-modes/achievements/check
 * Check player achievements
 */
router.post('/achievements/check', (req: Request, res: Response) => {
  try {
    const { playerId, sessionId } = req.body;

    if (!playerId || !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: playerId, sessionId'
      });
    }

    const session = gameModesEngine.getSession(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    const achievements = gameModesEngine.checkPlayerAchievements(playerId, session);

    res.json({
      success: true,
      achievements,
      count: achievements.length
    });

  } catch (error) {
    console.error('Failed to check achievements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check achievements'
    });
  }
});

// ===== HERO SYSTEM ENDPOINTS =====

/**
 * GET /api/game-modes/heroes
 * Get all heroes
 */
router.get('/heroes', (req: Request, res: Response) => {
  try {
    const { class: heroClass, level } = req.query;

    let heroes = gameModesEngine.getHeroes();

    // Apply filters
    if (heroClass) {
      heroes = heroes.filter(hero => hero.class.id === heroClass);
    }

    if (level) {
      const levelNum = parseInt(level as string);
      heroes = heroes.filter(hero => hero.level === levelNum);
    }

    res.json({
      success: true,
      heroes,
      count: heroes.length
    });

  } catch (error) {
    console.error('Failed to get heroes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get heroes'
    });
  }
});

/**
 * GET /api/game-modes/heroes/:id
 * Get specific hero
 */
router.get('/heroes/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hero = gameModesEngine.getHero(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        error: 'Hero not found'
      });
    }

    res.json({
      success: true,
      hero
    });

  } catch (error) {
    console.error('Failed to get hero:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get hero'
    });
  }
});

/**
 * POST /api/game-modes/heroes/:id/level-up
 * Level up hero
 */
router.post('/heroes/:id/level-up', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: sessionId'
      });
    }

    const success = gameModesEngine.levelUpHero(id, sessionId);

    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to level up hero'
      });
    }

    const hero = gameModesEngine.getHero(id);

    res.json({
      success: true,
      message: 'Hero leveled up successfully',
      hero
    });

  } catch (error) {
    console.error('Failed to level up hero:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to level up hero'
    });
  }
});

// ===== CONQUEST SYSTEM ENDPOINTS =====

/**
 * GET /api/game-modes/territories
 * Get all territories
 */
router.get('/territories', (req: Request, res: Response) => {
  try {
    const { type, controlledBy } = req.query;

    let territories = gameModesEngine.getTerritories();

    // Apply filters
    if (type) {
      territories = territories.filter(territory => territory.type === type);
    }

    if (controlledBy) {
      territories = territories.filter(territory => territory.controlledBy === controlledBy);
    }

    res.json({
      success: true,
      territories,
      count: territories.length
    });

  } catch (error) {
    console.error('Failed to get territories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get territories'
    });
  }
});

/**
 * GET /api/game-modes/territories/:id
 * Get specific territory
 */
router.get('/territories/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const territory = gameModesEngine.getTerritory(id);

    if (!territory) {
      return res.status(404).json({
        success: false,
        error: 'Territory not found'
      });
    }

    res.json({
      success: true,
      territory
    });

  } catch (error) {
    console.error('Failed to get territory:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get territory'
    });
  }
});

/**
 * POST /api/game-modes/territories/:id/capture
 * Capture territory
 */
router.post('/territories/:id/capture', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { playerId, sessionId } = req.body;

    if (!playerId || !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: playerId, sessionId'
      });
    }

    const success = gameModesEngine.captureTerritory(id, playerId, sessionId);

    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to capture territory'
      });
    }

    const territory = gameModesEngine.getTerritory(id);

    res.json({
      success: true,
      message: 'Territory captured successfully',
      territory
    });

  } catch (error) {
    console.error('Failed to capture territory:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to capture territory'
    });
  }
});

// ===== QUEST SYSTEM ENDPOINTS =====

/**
 * GET /api/game-modes/quests
 * Get all quests
 */
router.get('/quests', (req: Request, res: Response) => {
  try {
    const { type, category, difficulty } = req.query;

    let quests = gameModesEngine.getQuests();

    // Apply filters
    if (type) {
      quests = quests.filter(quest => quest.type === type);
    }

    if (category) {
      quests = quests.filter(quest => quest.category === category);
    }

    if (difficulty) {
      quests = quests.filter(quest => quest.difficulty === difficulty);
    }

    res.json({
      success: true,
      quests,
      count: quests.length
    });

  } catch (error) {
    console.error('Failed to get quests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get quests'
    });
  }
});

/**
 * GET /api/game-modes/quests/:id
 * Get specific quest
 */
router.get('/quests/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const quest = gameModesEngine.getQuest(id);

    if (!quest) {
      return res.status(404).json({
        success: false,
        error: 'Quest not found'
      });
    }

    res.json({
      success: true,
      quest
    });

  } catch (error) {
    console.error('Failed to get quest:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get quest'
    });
  }
});

/**
 * POST /api/game-modes/quests/:id/complete
 * Complete quest
 */
router.post('/quests/:id/complete', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { playerId, sessionId } = req.body;

    if (!playerId || !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: playerId, sessionId'
      });
    }

    const success = gameModesEngine.completeQuest(id, playerId, sessionId);

    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to complete quest'
      });
    }

    res.json({
      success: true,
      message: 'Quest completed successfully'
    });

  } catch (error) {
    console.error('Failed to complete quest:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete quest'
    });
  }
});

// ===== UTILITY ENDPOINTS =====

/**
 * GET /api/game-modes/player/:playerId/session
 * Get player's current session
 */
router.get('/player/:playerId/session', (req: Request, res: Response) => {
  try {
    const { playerId } = req.params;
    const session = gameModesEngine.getPlayerSession(playerId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Player not in any session'
      });
    }

    res.json({
      success: true,
      session
    });

  } catch (error) {
    console.error('Failed to get player session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get player session'
    });
  }
});

/**
 * GET /api/game-modes/capabilities
 * Get game modes capabilities
 */
router.get('/capabilities', (req: Request, res: Response) => {
  try {
    const capabilities = {
      gameModeTypes: ['COOP', 'ACHIEVEMENT', 'CONQUEST', 'HERO'],
      difficultyLevels: ['EASY', 'MEDIUM', 'HARD', 'EXTREME', 'ADAPTIVE'],
      sessionStatuses: ['WAITING', 'STARTING', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED'],
      playerStatuses: ['CONNECTED', 'DISCONNECTED', 'ELIMINATED', 'VICTORIOUS', 'SPECTATING'],
      objectiveTypes: [
        'SURVIVAL', 'DEFENSE', 'CONSTRUCTION', 'RESEARCH', 'DIPLOMACY',
        'ECONOMIC', 'MILITARY', 'EXPLORATION', 'ACHIEVEMENT', 'COLLECTION',
        'ELIMINATION', 'TERRITORY', 'RESCUE', 'ESCORT', 'PUZZLE'
      ],
      victoryTypes: [
        'ELIMINATION', 'DOMINATION', 'ECONOMIC', 'TECHNOLOGICAL', 'DIPLOMATIC',
        'CULTURAL', 'SURVIVAL', 'SCORE', 'OBJECTIVE', 'TIME', 'COOPERATIVE'
      ],
      achievementCategories: [
        'COMBAT', 'ECONOMIC', 'TECHNOLOGICAL', 'DIPLOMATIC', 'EXPLORATION',
        'CONSTRUCTION', 'SURVIVAL', 'SOCIAL', 'SPECIAL', 'SEASONAL'
      ],
      questCategories: [
        'COMBAT', 'EXPLORATION', 'COLLECTION', 'DELIVERY', 'ESCORT',
        'PUZZLE', 'SOCIAL', 'CRAFTING', 'SURVIVAL', 'INVESTIGATION'
      ],
      features: {
        coopMode: true,
        achievementMode: true,
        conquestMode: true,
        heroMode: true,
        customGameModes: true,
        sessionManagement: true,
        objectiveTracking: true,
        achievementSystem: true,
        heroProgression: true,
        territorialConquest: true,
        questSystem: true,
        realTimeUpdates: true
      }
    };

    res.json({
      success: true,
      capabilities
    });

  } catch (error) {
    console.error('Failed to get capabilities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get capabilities'
    });
  }
});

/**
 * GET /api/game-modes/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  try {
    const activeSessions = gameModesEngine.getActiveSessions();
    const gameModes = gameModesEngine.getGameModes();
    const achievements = gameModesEngine.getAchievements();
    const heroes = gameModesEngine.getHeroes();

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      statistics: {
        activeSessions: activeSessions.length,
        availableGameModes: gameModes.length,
        totalAchievements: achievements.length,
        availableHeroes: heroes.length
      },
      checks: {
        gameModesEngine: 'operational',
        sessionManagement: 'operational',
        achievementSystem: 'operational',
        heroSystem: 'operational'
      }
    };

    res.json({
      success: true,
      health
    });

  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      health: {
        status: 'unhealthy',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'game-modes', gameModesKnobSystem, applyGameModesKnobsToGameState);

export default router;
