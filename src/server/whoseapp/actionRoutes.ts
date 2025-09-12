/**
 * Character Action Routes
 * API endpoints for character action management
 */

import { Router } from 'express';
import { Pool } from 'pg';
import { CharacterActionService } from './CharacterActionService';

const router = Router();
let actionService: CharacterActionService;

export const initializeActionRoutes = (pool: Pool) => {
  actionService = new CharacterActionService(pool);
  return router;
};

// Get all actions for a conversation
router.get('/conversations/:conversationId/actions', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const actions = await actionService.getActionsByConversation(conversationId);
    
    res.json({
      success: true,
      data: actions
    });
  } catch (error) {
    console.error('Error fetching conversation actions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch actions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all active actions across all conversations
router.get('/actions/active', async (req, res) => {
  try {
    const actions = await actionService.getAllActiveActions();
    
    res.json({
      success: true,
      data: actions
    });
  } catch (error) {
    console.error('Error fetching active actions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch active actions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Propose a new action
router.post('/actions/propose', async (req, res) => {
  try {
    const {
      conversationId,
      characterId,
      characterName,
      actionType,
      title,
      description,
      targetAPI,
      parameters,
      estimatedDuration,
      priority
    } = req.body;

    if (!conversationId || !characterId || !actionType || !title || !targetAPI) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['conversationId', 'characterId', 'actionType', 'title', 'targetAPI']
      });
    }

    const action = await actionService.proposeAction(
      conversationId,
      characterId,
      characterName,
      actionType,
      title,
      description,
      targetAPI,
      parameters,
      estimatedDuration,
      priority
    );

    res.json({
      success: true,
      data: action
    });
  } catch (error) {
    console.error('Error proposing action:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to propose action',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Approve and execute an action
router.post('/actions/:actionId/execute', async (req, res) => {
  try {
    const { actionId } = req.params;
    
    await actionService.approveAndExecuteAction(actionId);
    
    res.json({
      success: true,
      message: 'Action approved and execution started'
    });
  } catch (error) {
    console.error('Error executing action:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute action',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get character capabilities
router.get('/characters/:characterId/capabilities', async (req, res) => {
  try {
    const { characterId } = req.params;
    const capabilities = await actionService.getCharacterCapabilities(characterId);
    
    if (!capabilities) {
      return res.status(404).json({
        success: false,
        error: 'Character capabilities not found'
      });
    }

    res.json({
      success: true,
      data: capabilities
    });
  } catch (error) {
    console.error('Error fetching character capabilities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch character capabilities',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
