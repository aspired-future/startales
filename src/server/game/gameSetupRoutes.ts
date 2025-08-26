import express from 'express';
import { Pool } from 'pg';
import { getGameSetupService, initializeGameSetupService } from './GameSetupService.js';

const router = express.Router();

let gameSetupService: any;

export function initializeGameSetupRoutes(pool: Pool): void {
  initializeGameSetupService(pool);
  gameSetupService = getGameSetupService();
  console.log('🎮 Game setup routes initialized');
}

/**
 * POST /api/game/create
 * Create a new game with story initialization
 */
router.post('/create', async (req, res) => {
  try {
    const { hostPlayerId, gameConfig } = req.body;
    
    if (!hostPlayerId) {
      return res.status(400).json({ error: 'hostPlayerId is required' });
    }

    const game = await gameSetupService.createGame(hostPlayerId, gameConfig || {});
    
    res.json({ 
      success: true, 
      game,
      message: `Game "${game.name}" created successfully`
    });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

/**
 * GET /api/game/list
 * Get all active games
 */
router.get('/list', async (req, res) => {
  try {
    const games = gameSetupService.getActiveGames();
    
    // Filter out sensitive information for public listing
    const publicGames = games
      .filter(game => game.status === 'waiting_for_players' || game.status === 'setup')
      .map(game => ({
        id: game.id,
        name: game.name,
        description: game.description,
        theme: game.theme,
        maxPlayers: game.maxPlayers,
        currentPlayers: game.playerSlots.filter(slot => slot.playerId).length,
        gameMode: game.gameMode,
        duration: game.duration,
        storyComplexity: game.storyComplexity,
        status: game.status,
        storyInitialized: game.storyInitialized
      }));
    
    res.json({ 
      games: publicGames,
      total: publicGames.length
    });
  } catch (error) {
    console.error('Error listing games:', error);
    res.status(500).json({ error: 'Failed to list games' });
  }
});

/**
 * GET /api/game/:gameId
 * Get detailed information about a specific game
 */
router.get('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = gameSetupService.getGame(gameId);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json({ game });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

/**
 * POST /api/game/:gameId/join
 * Join an existing game
 */
router.post('/:gameId/join', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { playerId, playerName } = req.body;
    
    if (!playerId || !playerName) {
      return res.status(400).json({ error: 'playerId and playerName are required' });
    }

    const success = await gameSetupService.joinGame(gameId, playerId, playerName);
    
    if (success) {
      const game = gameSetupService.getGame(gameId);
      res.json({ 
        success: true, 
        game,
        message: `Successfully joined game "${game?.name}"`
      });
    } else {
      res.status(400).json({ error: 'Failed to join game' });
    }
  } catch (error) {
    console.error('Error joining game:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/game/:gameId/ready
 * Set player ready status
 */
router.post('/:gameId/ready', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { playerId, ready = true } = req.body;
    
    if (!playerId) {
      return res.status(400).json({ error: 'playerId is required' });
    }

    const success = gameSetupService.setPlayerReady(gameId, playerId, ready);
    
    if (success) {
      const game = gameSetupService.getGame(gameId);
      res.json({ 
        success: true, 
        game,
        message: `Player ready status updated`
      });
    } else {
      res.status(400).json({ error: 'Failed to update ready status' });
    }
  } catch (error) {
    console.error('Error updating ready status:', error);
    res.status(500).json({ error: 'Failed to update ready status' });
  }
});

/**
 * POST /api/game/:gameId/start
 * Start the game when all players are ready
 */
router.post('/:gameId/start', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const success = await gameSetupService.startGame(gameId);
    
    if (success) {
      const game = gameSetupService.getGame(gameId);
      res.json({ 
        success: true, 
        game,
        message: `Game "${game?.name}" started successfully!`
      });
    } else {
      res.status(400).json({ error: 'Failed to start game' });
    }
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/game/:gameId/story-status
 * Get the story status for a game
 */
router.get('/:gameId/story-status', async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = gameSetupService.getGame(gameId);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    // Convert game ID to story civilization ID
    const gameStoryId = parseInt(gameId.replace(/\D/g, '').slice(0, 8)) || 1;
    
    // This would integrate with the story system to get current story status
    res.json({ 
      gameId,
      storyInitialized: game.storyInitialized,
      civilizationId: gameStoryId,
      theme: game.theme,
      storyComplexity: game.storyComplexity
    });
  } catch (error) {
    console.error('Error fetching story status:', error);
    res.status(500).json({ error: 'Failed to fetch story status' });
  }
});

export default router;
