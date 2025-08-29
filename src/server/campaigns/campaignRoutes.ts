/**
 * Campaign Management API Routes
 * 
 * REST API endpoints for Campaign Management System
 * including campaign creation, progression, objectives, and player management.
 */

import express from 'express';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = express.Router();

// Enhanced AI Knobs for Campaign Management System
const campaignKnobsData = {
  // Campaign Progression & Pacing
  story_progression_speed: 0.7,            // Story progression speed and narrative pacing
  objective_completion_difficulty: 0.6,    // Objective completion difficulty and challenge scaling
  campaign_length_optimization: 0.8,       // Campaign length optimization and content density
  
  // Player Engagement & Experience
  player_agency_emphasis: 0.8,             // Player agency emphasis and meaningful choice impact
  narrative_branching_complexity: 0.7,     // Narrative branching complexity and story variations
  character_development_depth: 0.8,        // Character development depth and progression systems
  
  // Dynamic Content & Adaptation
  dynamic_event_generation: 0.7,           // Dynamic event generation and emergent storytelling
  adaptive_difficulty_adjustment: 0.7,     // Adaptive difficulty adjustment and player skill matching
  procedural_quest_creation: 0.6,          // Procedural quest creation and objective variety
  
  // Multiplayer & Collaboration
  cooperative_gameplay_facilitation: 0.8,  // Cooperative gameplay facilitation and team coordination
  competitive_element_integration: 0.6,    // Competitive element integration and rivalry systems
  cross_campaign_interaction: 0.5,         // Cross-campaign interaction and shared universe elements
  
  // World Building & Immersion
  world_consistency_maintenance: 0.9,      // World consistency maintenance and lore adherence
  environmental_storytelling_depth: 0.8,   // Environmental storytelling depth and atmospheric detail
  cultural_authenticity_emphasis: 0.8,     // Cultural authenticity emphasis and believable societies
  
  // Resource Management & Economy
  resource_scarcity_balance: 0.7,          // Resource scarcity balance and economic pressure
  reward_distribution_fairness: 0.8,       // Reward distribution fairness and progression equity
  economic_impact_simulation: 0.7,         // Economic impact simulation and market consequences
  
  // Conflict & Resolution Systems
  diplomatic_solution_availability: 0.7,   // Diplomatic solution availability and peaceful options
  military_engagement_complexity: 0.7,     // Military engagement complexity and tactical depth
  moral_choice_consequence_weight: 0.8,    // Moral choice consequence weight and ethical impact
  
  // Campaign Analytics & Optimization
  player_behavior_analysis_depth: 0.7,     // Player behavior analysis depth and engagement metrics
  campaign_performance_tracking: 0.8,      // Campaign performance tracking and success measurement
  content_optimization_automation: 0.6,    // Content optimization automation and AI-driven improvements
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Campaigns
const campaignKnobSystem = new EnhancedKnobSystem(campaignKnobsData);

// Apply campaign knobs to game state
function applyCampaignKnobsToGameState() {
  const knobs = campaignKnobSystem.knobs;
  
  // Apply campaign progression settings
  const campaignProgression = (knobs.story_progression_speed + knobs.objective_completion_difficulty + 
    knobs.campaign_length_optimization) / 3;
  
  // Apply player engagement settings
  const playerEngagement = (knobs.player_agency_emphasis + knobs.narrative_branching_complexity + 
    knobs.character_development_depth) / 3;
  
  // Apply dynamic content settings
  const dynamicContent = (knobs.dynamic_event_generation + knobs.adaptive_difficulty_adjustment + 
    knobs.procedural_quest_creation) / 3;
  
  // Apply multiplayer settings
  const multiplayer = (knobs.cooperative_gameplay_facilitation + knobs.competitive_element_integration + 
    knobs.cross_campaign_interaction) / 3;
  
  // Apply world building settings
  const worldBuilding = (knobs.world_consistency_maintenance + knobs.environmental_storytelling_depth + 
    knobs.cultural_authenticity_emphasis) / 3;
  
  // Apply conflict resolution settings
  const conflictResolution = (knobs.diplomatic_solution_availability + knobs.military_engagement_complexity + 
    knobs.moral_choice_consequence_weight) / 3;
  
  console.log('Applied campaign knobs to game state:', {
    campaignProgression,
    playerEngagement,
    dynamicContent,
    multiplayer,
    worldBuilding,
    conflictResolution
  });
}

// ===== CAMPAIGN MANAGEMENT =====

/**
 * GET /api/campaigns - Get all campaigns
 */
router.get('/', async (req, res) => {
  try {
    const { 
      userId, 
      status, 
      limit = 50, 
      offset = 0,
      sortBy = 'created_at'
    } = req.query;

    // Mock campaign data
    const campaigns = Array.from({ length: Math.min(Number(limit), 20) }, (_, i) => ({
      id: i + Number(offset) + 1,
      name: `Campaign ${i + Number(offset) + 1}`,
      description: `A thrilling galactic adventure campaign featuring exploration, diplomacy, and conquest.`,
      status: status || ['active', 'completed', 'paused'][Math.floor(Math.random() * 3)],
      createdBy: userId || `user_${Math.floor(Math.random() * 10) + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 365), // Within last year
      lastPlayed: new Date(Date.now() - Math.random() * 86400000 * 30), // Within last 30 days
      players: Array.from({ length: Math.floor(Math.random() * 6) + 1 }, (_, j) => ({
        id: `player_${j + 1}`,
        name: `Player ${j + 1}`,
        role: ['leader', 'advisor', 'general', 'diplomat'][Math.floor(Math.random() * 4)],
        joinedAt: new Date(Date.now() - Math.random() * 86400000 * 180)
      })),
      settings: {
        difficulty: ['easy', 'normal', 'hard', 'expert'][Math.floor(Math.random() * 4)],
        gameMode: ['story', 'sandbox', 'competitive'][Math.floor(Math.random() * 3)],
        maxPlayers: Math.floor(Math.random() * 8) + 2,
        turnDuration: Math.floor(Math.random() * 168) + 24, // hours
        autoSave: true
      },
      progress: {
        currentChapter: Math.floor(Math.random() * 10) + 1,
        completedObjectives: Math.floor(Math.random() * 50),
        totalObjectives: Math.floor(Math.random() * 100) + 50,
        playtimeHours: Math.floor(Math.random() * 500) + 10
      },
      statistics: {
        battlesWon: Math.floor(Math.random() * 20),
        battlesLost: Math.floor(Math.random() * 10),
        diplomacySuccesses: Math.floor(Math.random() * 15),
        planetsColonized: Math.floor(Math.random() * 30),
        resourcesGathered: Math.floor(Math.random() * 10000)
      }
    }));

    res.json({
      success: true,
      data: campaigns,
      count: campaigns.length,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: campaigns.length
      }
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({
      error: 'Failed to fetch campaigns',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/campaigns/:campaignId - Get specific campaign details
 */
router.get('/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { includeHistory = false } = req.query;

    const campaign = {
      id: Number(campaignId),
      name: `Campaign ${campaignId}`,
      description: `Detailed campaign information for campaign ${campaignId}`,
      status: 'active',
      createdBy: `user_${Math.floor(Math.random() * 10) + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 365),
      lastPlayed: new Date(Date.now() - Math.random() * 86400000 * 7),
      
      // Detailed campaign information
      narrative: {
        currentChapter: {
          id: 'chapter_3',
          name: 'The Galactic Convergence',
          description: 'Multiple civilizations converge on a mysterious artifact',
          objectives: [
            { id: 'obj_1', description: 'Investigate the artifact', completed: true },
            { id: 'obj_2', description: 'Negotiate with alien diplomats', completed: false },
            { id: 'obj_3', description: 'Secure strategic resources', completed: false }
          ]
        },
        availableChoices: [
          {
            id: 'choice_1',
            description: 'Approach diplomatically',
            consequences: ['Improved relations', 'Slower progress'],
            difficulty: 'medium'
          },
          {
            id: 'choice_2',
            description: 'Use military force',
            consequences: ['Quick resolution', 'Damaged reputation'],
            difficulty: 'hard'
          }
        ]
      },

      gameState: {
        turn: Math.floor(Math.random() * 100) + 1,
        phase: 'action',
        activePlayer: 'player_1',
        timeRemaining: Math.floor(Math.random() * 86400), // seconds
        resources: {
          credits: Math.floor(Math.random() * 100000),
          energy: Math.floor(Math.random() * 1000),
          materials: Math.floor(Math.random() * 5000),
          influence: Math.floor(Math.random() * 100)
        }
      },

      players: Array.from({ length: Math.floor(Math.random() * 4) + 2 }, (_, i) => ({
        id: `player_${i + 1}`,
        name: `Player ${i + 1}`,
        civilization: `civilization_${i + 1}`,
        role: ['leader', 'advisor', 'general', 'diplomat'][i % 4],
        status: Math.random() > 0.2 ? 'online' : 'offline',
        lastAction: new Date(Date.now() - Math.random() * 3600000),
        score: Math.floor(Math.random() * 10000),
        achievements: Array.from({ length: Math.floor(Math.random() * 10) }, (_, j) => ({
          id: `achievement_${j + 1}`,
          name: `Achievement ${j + 1}`,
          unlockedAt: new Date(Date.now() - Math.random() * 86400000 * 30)
        }))
      })),

      history: includeHistory === 'true' ? Array.from({ length: 20 }, (_, i) => ({
        id: `event_${i + 1}`,
        type: ['battle', 'diplomacy', 'exploration', 'trade'][Math.floor(Math.random() * 4)],
        description: `Historical event ${i + 1}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 30),
        participants: [`player_${Math.floor(Math.random() * 4) + 1}`],
        outcome: Math.random() > 0.5 ? 'success' : 'failure'
      })) : undefined
    };

    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({
      error: 'Failed to fetch campaign',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/campaigns - Create new campaign
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      createdBy,
      settings,
      initialPlayers
    } = req.body;

    if (!name || !createdBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'createdBy']
      });
    }

    const newCampaign = {
      id: Math.floor(Math.random() * 10000) + 1000,
      name,
      description: description || 'A new galactic adventure awaits',
      status: 'active',
      createdBy,
      createdAt: new Date(),
      lastPlayed: new Date(),
      
      settings: {
        difficulty: settings?.difficulty || 'normal',
        gameMode: settings?.gameMode || 'story',
        maxPlayers: settings?.maxPlayers || 6,
        turnDuration: settings?.turnDuration || 72,
        autoSave: settings?.autoSave !== false
      },

      players: initialPlayers || [{
        id: createdBy,
        name: 'Campaign Creator',
        role: 'leader',
        joinedAt: new Date()
      }],

      progress: {
        currentChapter: 1,
        completedObjectives: 0,
        totalObjectives: 50,
        playtimeHours: 0
      },

      gameState: {
        turn: 1,
        phase: 'setup',
        activePlayer: createdBy,
        resources: {
          credits: 10000,
          energy: 100,
          materials: 500,
          influence: 50
        }
      }
    };

    res.status(201).json({
      success: true,
      data: newCampaign
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({
      error: 'Failed to create campaign',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== CAMPAIGN ACTIONS & PROGRESSION =====

/**
 * POST /api/campaigns/:campaignId/actions - Execute campaign action
 */
router.post('/:campaignId/actions', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const {
      playerId,
      actionType,
      actionData,
      targetId
    } = req.body;

    if (!playerId || !actionType) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['playerId', 'actionType']
      });
    }

    const actionResult = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      campaignId: Number(campaignId),
      playerId,
      actionType,
      actionData: actionData || {},
      targetId: targetId || null,
      timestamp: new Date(),
      success: Math.random() > 0.2, // 80% success rate
      consequences: [
        'Resource changes applied',
        'Diplomatic relations updated',
        'New objectives unlocked'
      ],
      nextTurn: Math.random() > 0.5,
      rewards: {
        experience: Math.floor(Math.random() * 100) + 10,
        resources: {
          credits: Math.floor(Math.random() * 1000),
          influence: Math.floor(Math.random() * 10)
        }
      }
    };

    res.json({
      success: true,
      data: actionResult
    });
  } catch (error) {
    console.error('Error executing campaign action:', error);
    res.status(500).json({
      error: 'Failed to execute campaign action',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/campaigns/:campaignId/status - Update campaign status
 */
router.put('/:campaignId/status', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { status, updatedBy } = req.body;

    if (!status || !updatedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['status', 'updatedBy']
      });
    }

    const validStatuses = ['active', 'paused', 'completed', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        validStatuses
      });
    }

    const updatedCampaign = {
      id: Number(campaignId),
      status,
      updatedBy,
      updatedAt: new Date(),
      previousStatus: 'active' // Mock previous status
    };

    res.json({
      success: true,
      data: updatedCampaign
    });
  } catch (error) {
    console.error('Error updating campaign status:', error);
    res.status(500).json({
      error: 'Failed to update campaign status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== PLAYER MANAGEMENT =====

/**
 * POST /api/campaigns/:campaignId/players - Add player to campaign
 */
router.post('/:campaignId/players', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { playerId, playerName, role, invitedBy } = req.body;

    if (!playerId || !playerName || !invitedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['playerId', 'playerName', 'invitedBy']
      });
    }

    const newPlayer = {
      id: playerId,
      name: playerName,
      role: role || 'player',
      campaignId: Number(campaignId),
      joinedAt: new Date(),
      invitedBy,
      status: 'active',
      permissions: {
        canInviteOthers: role === 'leader',
        canModifySettings: role === 'leader',
        canKickPlayers: role === 'leader'
      }
    };

    res.status(201).json({
      success: true,
      data: newPlayer
    });
  } catch (error) {
    console.error('Error adding player to campaign:', error);
    res.status(500).json({
      error: 'Failed to add player to campaign',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== GRAPHICS GENERATION =====

/**
 * POST /api/campaign/generate-graphics - Generate graphics options for campaign
 */
router.post('/generate-graphics', async (req, res) => {
  try {
    const { scenario } = req.body;

    if (!scenario) {
      return res.status(400).json({
        error: 'Missing required field: scenario'
      });
    }

    // Generate graphics options based on scenario
    const graphicsOptions = [
      {
        id: 'realistic-space',
        name: 'Realistic Space Opera',
        theme: 'Photorealistic space environments with detailed starships and planets',
        preview: '/api/images/placeholder/realistic-space.jpg',
        style: 'realistic'
      },
      {
        id: 'stylized-cosmic',
        name: 'Stylized Cosmic Adventure',
        theme: 'Artistic interpretation with vibrant colors and stylized designs',
        preview: '/api/images/placeholder/stylized-cosmic.jpg',
        style: 'stylized'
      },
      {
        id: 'minimalist-clean',
        name: 'Minimalist Interface',
        theme: 'Clean, geometric designs with focus on clarity and function',
        preview: '/api/images/placeholder/minimalist-clean.jpg',
        style: 'minimalist'
      },
      {
        id: 'retro-futuristic',
        name: 'Retro-Futuristic',
        theme: 'Classic sci-fi aesthetic with neon colors and chrome details',
        preview: '/api/images/placeholder/retro-futuristic.jpg',
        style: 'retro'
      }
    ];

    // TODO: In the future, use AI to generate actual custom graphics based on scenario
    // For now, return predefined options

    res.json(graphicsOptions);
  } catch (error) {
    console.error('Error generating graphics options:', error);
    res.status(500).json({
      error: 'Failed to generate graphics options',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'campaigns', campaignKnobSystem, applyCampaignKnobsToGameState);

export default router;
