import express from 'express';
import { Pool } from 'pg';
import { getGameMasterStoryEngine, initializeGameMasterStoryEngine } from './GameMasterStoryEngine.js';

const router = express.Router();

let storyEngine: any;

export function initializeStoryRoutes(pool: Pool): void {
  initializeGameMasterStoryEngine(pool);
  storyEngine = getGameMasterStoryEngine();
  console.log('📖 Story routes initialized');
}

/**
 * POST /api/story/initialize
 * Initialize story for a civilization
 */
router.post('/initialize', async (req, res) => {
  try {
    const { civilizationId, gameTheme = 'space_opera' } = req.body;
    
    if (!civilizationId) {
      return res.status(400).json({ error: 'civilizationId is required' });
    }

    await storyEngine.initializeStoryForCivilization(parseInt(civilizationId), gameTheme);
    
    res.json({ 
      success: true, 
      message: `Story initialized for civilization ${civilizationId}`,
      theme: gameTheme
    });
  } catch (error) {
    console.error('Error initializing story:', error);
    res.status(500).json({ error: 'Failed to initialize story' });
  }
});

/**
 * GET /api/story/events/:civilizationId
 * Get story events for a civilization
 */
router.get('/events/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const { limit = '10' } = req.query;
    
    // Try to get from GameMasterStoryEngine first for dynamic generation
    try {
      const { getGameMasterStoryEngine } = await import('../witter/GameMasterStoryEngine.js');
      const gameMaster = getGameMasterStoryEngine();
      
      // Generate dynamic story events based on current game state
      const events = await gameMaster.generateStoryEvents(
        parseInt(civilizationId), 
        parseInt(limit as string)
      );
      
      res.json({ 
        events,
        total: events.length,
        civilizationId: parseInt(civilizationId),
        generated: true,
        timestamp: new Date().toISOString()
      });
      
    } catch (gameMasterError) {
      console.warn('GameMaster not available, using story engine fallback');
      
      const events = await storyEngine.getStoryEvents(
        parseInt(civilizationId), 
        parseInt(limit as string)
      );
      
      res.json({ 
        events,
        total: events.length,
        civilizationId: parseInt(civilizationId),
        generated: false
      });
    }
    
  } catch (error) {
    console.error('Error fetching story events:', error);
    res.status(500).json({ error: 'Failed to fetch story events' });
  }
});

/**
 * GET /api/story/arcs/:civilizationId
 * Get active story arcs for a civilization
 */
router.get('/arcs/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    
    const arcs = await storyEngine.getActiveStoryArcs(parseInt(civilizationId));
    
    res.json({ 
      arcs,
      total: arcs.length,
      civilizationId: parseInt(civilizationId)
    });
  } catch (error) {
    console.error('Error fetching story arcs:', error);
    res.status(500).json({ error: 'Failed to fetch story arcs' });
  }
});

/**
 * POST /api/story/respond
 * Respond to a story event with a choice
 */
router.post('/respond', async (req, res) => {
  try {
    const { civilizationId, eventId, choiceId } = req.body;
    
    if (!civilizationId || !eventId || !choiceId) {
      return res.status(400).json({ 
        error: 'civilizationId, eventId, and choiceId are required' 
      });
    }

    await storyEngine.respondToStoryEvent(
      parseInt(civilizationId), 
      eventId, 
      choiceId
    );
    
    res.json({ 
      success: true, 
      message: 'Response recorded',
      eventId,
      choiceId
    });
  } catch (error) {
    console.error('Error responding to story event:', error);
    res.status(500).json({ error: 'Failed to record response' });
  }
});

/**
 * POST /api/story/plot-twist/:civilizationId
 * Manually trigger a plot twist (for testing/admin)
 */
router.post('/plot-twist/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const { storyArcId } = req.body;
    
    if (!storyArcId) {
      return res.status(400).json({ error: 'storyArcId is required' });
    }

    await storyEngine.generatePlotTwist(parseInt(civilizationId), storyArcId);
    
    res.json({ 
      success: true, 
      message: 'Plot twist generated',
      civilizationId: parseInt(civilizationId),
      storyArcId
    });
  } catch (error) {
    console.error('Error generating plot twist:', error);
    res.status(500).json({ error: 'Failed to generate plot twist' });
  }
});

/**
 * POST /api/story/mission
 * Create a story-driven mission
 */
router.post('/mission', async (req, res) => {
  try {
    const { civilizationId, storyEventId, missionType = 'investigation' } = req.body;
    
    if (!civilizationId || !storyEventId) {
      return res.status(400).json({ 
        error: 'civilizationId and storyEventId are required' 
      });
    }

    const missionId = await storyEngine.createStoryMission(
      parseInt(civilizationId), 
      storyEventId, 
      missionType
    );
    
    res.json({ 
      success: true, 
      missionId,
      message: 'Story mission created',
      storyEventId,
      missionType
    });
  } catch (error) {
    console.error('Error creating story mission:', error);
    res.status(500).json({ error: 'Failed to create story mission' });
  }
});

/**
 * GET /api/story/status/:civilizationId
 * Get overall story status and progress
 */
router.get('/status/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    
    const arcs = await storyEngine.getActiveStoryArcs(parseInt(civilizationId));
    const recentEvents = await storyEngine.getStoryEvents(parseInt(civilizationId), 5);
    
    const status = {
      civilizationId: parseInt(civilizationId),
      activeArcs: arcs.length,
      currentPhases: arcs.map(arc => ({
        arcId: arc.id,
        title: arc.title,
        phase: arc.currentPhase,
        eventsCount: arc.events.length
      })),
      recentEvents: recentEvents.map(event => ({
        id: event.id,
        title: event.title,
        type: event.type,
        urgency: event.urgency,
        timestamp: event.timestamp
      })),
      totalEvents: recentEvents.length
    };
    
    res.json(status);
  } catch (error) {
    console.error('Error fetching story status:', error);
    res.status(500).json({ error: 'Failed to fetch story status' });
  }
});

export default router;
