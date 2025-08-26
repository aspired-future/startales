/**
 * Character API Routes
 *
 * RESTful API endpoints for the Dynamic Character System
 */

import express from 'express';
import { Pool } from 'pg';
import { DynamicCharacterEngine } from './DynamicCharacterEngine.js';
import { CharacterService } from './CharacterService.js';
import { ProceduralCharacterGenerator } from './ProceduralCharacterGenerator.js';
import { initializeCharacterSchema } from './characterSchema.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = express.Router();
let characterEngine: DynamicCharacterEngine;
let characterService: CharacterService;
let characterGenerator: ProceduralCharacterGenerator;

// Enhanced Knob System for Character Story/Game State Awareness
const charactersKnobSystem = new EnhancedKnobSystem('characters', {
  // Game State Awareness & Context (8 knobs)
  'game-state-awareness-level': {
    id: 'game-state-awareness-level',
    name: 'Game State Awareness Level',
    description: 'How well characters understand current game state and context',
    category: 'game-state-awareness',
    type: 'percentage',
    min: 10,
    max: 100,
    default: 75,
    step: 5,
    unit: '%'
  },
  'political-situation-understanding': {
    id: 'political-situation-understanding',
    name: 'Political Situation Understanding',
    description: 'Character awareness of political events and diplomatic situations',
    category: 'game-state-awareness',
    type: 'percentage',
    min: 20,
    max: 100,
    default: 70,
    step: 5,
    unit: '%'
  },
  'economic-context-awareness': {
    id: 'economic-context-awareness',
    name: 'Economic Context Awareness',
    description: 'Understanding of economic conditions and market dynamics',
    category: 'game-state-awareness',
    type: 'percentage',
    min: 20,
    max: 100,
    default: 65,
    step: 5,
    unit: '%'
  },
  'military-situation-knowledge': {
    id: 'military-situation-knowledge',
    name: 'Military Situation Knowledge',
    description: 'Awareness of military conflicts, threats, and defense status',
    category: 'game-state-awareness',
    type: 'percentage',
    min: 10,
    max: 100,
    default: 60,
    step: 5,
    unit: '%'
  },
  'technological-progress-tracking': {
    id: 'technological-progress-tracking',
    name: 'Technological Progress Tracking',
    description: 'Knowledge of technological developments and research progress',
    category: 'game-state-awareness',
    type: 'percentage',
    min: 20,
    max: 100,
    default: 70,
    step: 5,
    unit: '%'
  },
  'social-cultural-awareness': {
    id: 'social-cultural-awareness',
    name: 'Social & Cultural Awareness',
    description: 'Understanding of social movements and cultural changes',
    category: 'game-state-awareness',
    type: 'percentage',
    min: 30,
    max: 100,
    default: 80,
    step: 5,
    unit: '%'
  },
  'crisis-event-recognition': {
    id: 'crisis-event-recognition',
    name: 'Crisis Event Recognition',
    description: 'Ability to recognize and respond to crisis situations',
    category: 'game-state-awareness',
    type: 'percentage',
    min: 40,
    max: 100,
    default: 85,
    step: 5,
    unit: '%'
  },
  'historical-context-integration': {
    id: 'historical-context-integration',
    name: 'Historical Context Integration',
    description: 'Integration of historical events into current decision-making',
    category: 'game-state-awareness',
    type: 'percentage',
    min: 20,
    max: 100,
    default: 60,
    step: 5,
    unit: '%'
  },

  // Specialty Knowledge & Expertise (8 knobs)
  'professional-expertise-depth': {
    id: 'professional-expertise-depth',
    name: 'Professional Expertise Depth',
    description: 'Depth of knowledge in character\'s professional specialty',
    category: 'specialty-knowledge',
    type: 'percentage',
    min: 50,
    max: 100,
    default: 85,
    step: 5,
    unit: '%'
  },
  'cross-domain-knowledge': {
    id: 'cross-domain-knowledge',
    name: 'Cross-Domain Knowledge',
    description: 'Understanding of areas outside character\'s main specialty',
    category: 'specialty-knowledge',
    type: 'percentage',
    min: 10,
    max: 80,
    default: 40,
    step: 5,
    unit: '%'
  },
  'strategic-thinking-capability': {
    id: 'strategic-thinking-capability',
    name: 'Strategic Thinking Capability',
    description: 'Ability to think strategically and plan long-term',
    category: 'specialty-knowledge',
    type: 'percentage',
    min: 20,
    max: 100,
    default: 70,
    step: 5,
    unit: '%'
  },
  'technical-competency-level': {
    id: 'technical-competency-level',
    name: 'Technical Competency Level',
    description: 'Level of technical skills and knowledge in specialty area',
    category: 'specialty-knowledge',
    type: 'percentage',
    min: 30,
    max: 100,
    default: 80,
    step: 5,
    unit: '%'
  },
  'advisory-quality-standard': {
    id: 'advisory-quality-standard',
    name: 'Advisory Quality Standard',
    description: 'Quality and accuracy of advice provided to leadership',
    category: 'specialty-knowledge',
    type: 'percentage',
    min: 40,
    max: 100,
    default: 85,
    step: 5,
    unit: '%'
  },
  'innovation-creativity-level': {
    id: 'innovation-creativity-level',
    name: 'Innovation & Creativity Level',
    description: 'Ability to generate innovative solutions and creative ideas',
    category: 'specialty-knowledge',
    type: 'percentage',
    min: 20,
    max: 100,
    default: 65,
    step: 5,
    unit: '%'
  },
  'risk-assessment-accuracy': {
    id: 'risk-assessment-accuracy',
    name: 'Risk Assessment Accuracy',
    description: 'Accuracy in identifying and evaluating risks',
    category: 'specialty-knowledge',
    type: 'percentage',
    min: 30,
    max: 100,
    default: 75,
    step: 5,
    unit: '%'
  },
  'decision-support-effectiveness': {
    id: 'decision-support-effectiveness',
    name: 'Decision Support Effectiveness',
    description: 'Effectiveness in supporting leadership decision-making',
    category: 'specialty-knowledge',
    type: 'percentage',
    min: 40,
    max: 100,
    default: 80,
    step: 5,
    unit: '%'
  },

  // Character Responsiveness & Adaptation (8 knobs)
  'situational-adaptability': {
    id: 'situational-adaptability',
    name: 'Situational Adaptability',
    description: 'Ability to adapt behavior based on changing circumstances',
    category: 'responsiveness-adaptation',
    type: 'percentage',
    min: 30,
    max: 100,
    default: 75,
    step: 5,
    unit: '%'
  },
  'information-processing-speed': {
    id: 'information-processing-speed',
    name: 'Information Processing Speed',
    description: 'Speed of processing and responding to new information',
    category: 'responsiveness-adaptation',
    type: 'percentage',
    min: 40,
    max: 100,
    default: 70,
    step: 5,
    unit: '%'
  },
  'proactive-initiative-level': {
    id: 'proactive-initiative-level',
    name: 'Proactive Initiative Level',
    description: 'Tendency to take initiative and act proactively',
    category: 'responsiveness-adaptation',
    type: 'percentage',
    min: 20,
    max: 100,
    default: 65,
    step: 5,
    unit: '%'
  },
  'collaborative-engagement': {
    id: 'collaborative-engagement',
    name: 'Collaborative Engagement',
    description: 'Level of engagement in collaborative activities and discussions',
    category: 'responsiveness-adaptation',
    type: 'percentage',
    min: 30,
    max: 100,
    default: 80,
    step: 5,
    unit: '%'
  },
  'feedback-responsiveness': {
    id: 'feedback-responsiveness',
    name: 'Feedback Responsiveness',
    description: 'Responsiveness to feedback and willingness to adjust',
    category: 'responsiveness-adaptation',
    type: 'percentage',
    min: 40,
    max: 100,
    default: 75,
    step: 5,
    unit: '%'
  },
  'learning-adaptation-rate': {
    id: 'learning-adaptation-rate',
    name: 'Learning & Adaptation Rate',
    description: 'Speed of learning from experience and adapting strategies',
    category: 'responsiveness-adaptation',
    type: 'percentage',
    min: 30,
    max: 100,
    default: 70,
    step: 5,
    unit: '%'
  },
  'stress-performance-stability': {
    id: 'stress-performance-stability',
    name: 'Stress Performance Stability',
    description: 'Maintenance of performance quality under stress',
    category: 'responsiveness-adaptation',
    type: 'percentage',
    min: 40,
    max: 100,
    default: 75,
    step: 5,
    unit: '%'
  },
  'change-management-capability': {
    id: 'change-management-capability',
    name: 'Change Management Capability',
    description: 'Ability to manage and lead through organizational changes',
    category: 'responsiveness-adaptation',
    type: 'percentage',
    min: 30,
    max: 100,
    default: 70,
    step: 5,
    unit: '%'
  }
});

// Apply characters knobs to game state
function applyCharactersKnobsToGameState(campaignId: string, civilizationId: string) {
  // This function will be called by the simulation engine to apply knob settings
  console.log(`Applied character knobs to game state for campaign ${campaignId}, civilization ${civilizationId}`);
}

export function initializeCharacterService(pool: Pool): void {
  characterService = new CharacterService(pool);
  characterEngine = new DynamicCharacterEngine(pool);
  characterGenerator = new ProceduralCharacterGenerator(pool);
  
  // Initialize database schema
  initializeCharacterSchema(pool).catch(error => {
    console.error('❌ Failed to initialize character schema:', error);
  });
  
  console.log('✅ Character Service initialized');
}

export function getCharacterEngine(): DynamicCharacterEngine {
  if (!characterEngine) {
    throw new Error('Character engine not initialized. Call initializeCharacterService first.');
  }
  return characterEngine;
}

export function getCharacterService(): CharacterService {
  if (!characterService) {
    throw new Error('Character service not initialized. Call initializeCharacterService first.');
  }
  return characterService;
}

// Generate new character
router.post('/generate', async (req, res) => {
  try {
    const { templateId, civilizationId, planetId, cityId, seed } = req.body;

    if (!templateId || !civilizationId || !planetId) {
      return res.status(400).json({
        error: 'Missing required parameters: templateId, civilizationId, planetId'
      });
    }

    const template = await characterService.getCharacterTemplate(templateId);
    if (!template) {
      return res.status(404).json({
        error: `Character template not found: ${templateId}`
      });
    }

    const context = {
      civilization_id: civilizationId,
      planet_id: planetId,
      city_id: cityId,
      current_events: [],
      economic_climate: 'stable',
      political_climate: 'stable',
      social_trends: [],
      technology_level: 50,
      population_density: 100,
      cultural_values: []
    };

    const character = await characterGenerator.generateCompleteCharacter(template, context, seed);
    const characterId = await characterService.createCharacter(character);

    res.json({
      success: true,
      character_id: characterId,
      character: {
        id: character.id,
        name: character.name,
        category: character.category,
        subcategory: character.subcategory,
        attributes: character.attributes,
        profession: character.profession,
        social_media: character.social_media
      }
    });

  } catch (error) {
    console.error('❌ Error generating character:', error);
    res.status(500).json({
      error: 'Failed to generate character',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Generate multiple characters for a civilization
router.post('/generate-population', async (req, res) => {
  try {
    const { civilizationId, planetId, cityId, count = 10, distribution } = req.body;

    if (!civilizationId || !planetId) {
      return res.status(400).json({
        error: 'Missing required parameters: civilizationId, planetId'
      });
    }

    const context = {
      civilization_id: civilizationId,
      planet_id: planetId,
      city_id: cityId,
      current_events: [],
      economic_climate: 'stable',
      political_climate: 'stable',
      social_trends: [],
      technology_level: 50,
      population_density: 100,
      cultural_values: []
    };

    const characters = await characterEngine.generateInitialPopulation(context, count, distribution);
    
    const characterIds = [];
    for (const character of characters) {
      const characterId = await characterService.createCharacter(character);
      characterIds.push(characterId);
    }

    res.json({
      success: true,
      generated_count: characters.length,
      character_ids: characterIds,
      characters: characters.map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        subcategory: c.subcategory,
        attributes: c.attributes
      }))
    });

  } catch (error) {
    console.error('❌ Error generating population:', error);
    res.status(500).json({
      error: 'Failed to generate population',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get character profiles for WhoseApp
router.get('/profiles', async (req, res) => {
  try {
    const { civilizationId } = req.query;
    console.log('📋 Getting character profiles for civilization:', civilizationId);

    // Mock character profiles for WhoseApp
    const mockCharacters = [
      {
        id: 'char_diplomat_001',
        name: 'Ambassador Elena Vasquez',
        title: 'Chief Diplomatic Officer',
        department: 'Foreign Affairs',
        role: 'diplomat',
        avatar: '/api/characters/avatars/elena_vasquez.jpg',
        biography: 'A seasoned diplomat with over 20 years of experience in interstellar relations.',
        specialties: ['Interstellar Diplomacy', 'Trade Negotiations', 'Cultural Relations'],
        clearanceLevel: 'top_secret',
        whoseAppProfile: {
          status: 'online',
          statusMessage: 'In negotiations with Zephyrian delegation',
          lastSeen: new Date(),
          activeConversations: ['conv_001', 'channel_dept_foreign']
        },
        witterProfile: {
          handle: '@AmbassadorElena',
          followerCount: 125000,
          followingCount: 450,
          postCount: 2340,
          verificationStatus: 'government'
        },
        actionStats: {
          totalAssigned: 47,
          completed: 42,
          inProgress: 3,
          overdue: 0,
          successRate: 89,
          currentWorkload: 3
        }
      },
      {
        id: 'char_economist_001',
        name: 'Dr. Marcus Chen',
        title: 'Economic Policy Director',
        department: 'Treasury & Economic Affairs',
        role: 'economist',
        avatar: '/api/characters/avatars/marcus_chen.jpg',
        biography: 'Brilliant economist and policy strategist with a PhD in Galactic Economics.',
        specialties: ['Macroeconomic Policy', 'Market Analysis', 'Fiscal Strategy'],
        clearanceLevel: 'classified',
        whoseAppProfile: {
          status: 'busy',
          statusMessage: 'Analyzing stimulus package models',
          lastSeen: new Date(Date.now() - 1800000),
          activeConversations: ['conv_002', 'channel_dept_treasury']
        },
        witterProfile: {
          handle: '@DrMarcusChen',
          followerCount: 89000,
          followingCount: 230,
          postCount: 1876,
          verificationStatus: 'government'
        },
        actionStats: {
          totalAssigned: 34,
          completed: 29,
          inProgress: 4,
          overdue: 1,
          successRate: 85,
          currentWorkload: 4
        }
      },
      {
        id: 'char_commander_001',
        name: 'General Sarah Mitchell',
        title: 'Defense Secretary',
        department: 'Military & Defense',
        role: 'military',
        avatar: '/api/characters/avatars/sarah_mitchell.jpg',
        biography: 'Decorated military leader with extensive experience in strategic operations.',
        specialties: ['Military Strategy', 'Defense Planning', 'Crisis Management'],
        clearanceLevel: 'top_secret',
        whoseAppProfile: {
          status: 'online',
          statusMessage: 'Reviewing defense protocols',
          lastSeen: new Date(),
          activeConversations: ['channel_defense', 'channel_cabinet']
        },
        witterProfile: {
          handle: '@GeneralMitchell',
          followerCount: 203000,
          followingCount: 156,
          postCount: 1456,
          verificationStatus: 'government'
        },
        actionStats: {
          totalAssigned: 52,
          completed: 48,
          inProgress: 2,
          overdue: 0,
          successRate: 92,
          currentWorkload: 2
        }
      }
    ];

    console.log('✅ Returning mock character profiles:', mockCharacters.length);

    res.json({
      success: true,
      characters: mockCharacters,
      count: mockCharacters.length
    });
  } catch (error) {
    console.error('❌ Error getting character profiles:', error);
    res.status(500).json({
      error: 'Failed to get character profiles',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get character by ID
router.get('/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;
    const character = await characterService.getCharacter(characterId);

    if (!character) {
      return res.status(404).json({
        error: `Character not found: ${characterId}`
      });
    }

    res.json({
      success: true,
      character
    });

  } catch (error) {
    console.error('❌ Error getting character:', error);
    res.status(500).json({
      error: 'Failed to get character',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get characters by civilization
router.get('/civilization/:civilizationId', async (req, res) => {
  try {
    const { civilizationId } = req.params;
    const { limit = 50, category } = req.query;

    let characters;
    if (category) {
      characters = await characterService.getCharactersByCategory(
        category as string, 
        parseInt(civilizationId), 
        parseInt(limit as string)
      );
    } else {
      characters = await characterService.getCharactersByCivilization(
        parseInt(civilizationId), 
        parseInt(limit as string)
      );
    }

    res.json({
      success: true,
      civilization_id: parseInt(civilizationId),
      count: characters.length,
      characters: characters.map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        subcategory: c.subcategory,
        attributes: c.attributes,
        profession: c.profession,
        social_media: c.social_media,
        status: c.status
      }))
    });

  } catch (error) {
    console.error('❌ Error getting characters by civilization:', error);
    res.status(500).json({
      error: 'Failed to get characters',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get character templates
router.get('/templates/list', async (req, res) => {
  try {
    const templates = await characterService.getCharacterTemplates();

    res.json({
      success: true,
      count: templates.length,
      templates
    });

  } catch (error) {
    console.error('❌ Error getting character templates:', error);
    res.status(500).json({
      error: 'Failed to get character templates',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update character
router.put('/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;
    const updates = req.body;

    await characterService.updateCharacter(characterId, updates);

    res.json({
      success: true,
      message: `Character ${characterId} updated successfully`
    });

  } catch (error) {
    console.error('❌ Error updating character:', error);
    res.status(500).json({
      error: 'Failed to update character',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete character
router.delete('/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;

    await characterService.deleteCharacter(characterId);

    res.json({
      success: true,
      message: `Character ${characterId} deleted successfully`
    });

  } catch (error) {
    console.error('❌ Error deleting character:', error);
    res.status(500).json({
      error: 'Failed to delete character',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Simulate character interactions
router.post('/:characterId/interact', async (req, res) => {
  try {
    const { characterId } = req.params;
    const { interactionType, context } = req.body;

    const result = await characterEngine.simulateCharacterInteraction(
      characterId, 
      interactionType, 
      context
    );

    res.json({
      success: true,
      interaction_result: result
    });

  } catch (error) {
    console.error('❌ Error simulating character interaction:', error);
    res.status(500).json({
      error: 'Failed to simulate interaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get character analytics
router.get('/:characterId/analytics', async (req, res) => {
  try {
    const { characterId } = req.params;
    const { days = 30 } = req.query;

    const analytics = await characterEngine.getCharacterAnalytics(
      characterId, 
      parseInt(days as string)
    );

    res.json({
      success: true,
      character_id: characterId,
      analytics
    });

  } catch (error) {
    console.error('❌ Error getting character analytics:', error);
    res.status(500).json({
      error: 'Failed to get character analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ==================== GAME STATE AWARENESS ENDPOINTS ====================

/**
 * GET /api/characters/game-state-awareness
 * Get character awareness levels and knowledge of current game state
 */
router.get('/game-state-awareness', async (req, res) => {
  try {
    const { campaignId, civilizationId, characterId } = req.query;
    
    if (!campaignId || !civilizationId) {
      return res.status(400).json({ error: 'Campaign ID and Civilization ID are required' });
    }

    const knobValues = await charactersKnobSystem.getKnobValues(campaignId as string, civilizationId as string);
    
    // Get character-specific awareness based on their role and specialty
    const characterAwareness = {
      gameStateAwareness: {
        level: knobValues['game-state-awareness-level'],
        politicalSituation: knobValues['political-situation-understanding'],
        economicContext: knobValues['economic-context-awareness'],
        militarySituation: knobValues['military-situation-knowledge'],
        technologicalProgress: knobValues['technological-progress-tracking'],
        socialCultural: knobValues['social-cultural-awareness'],
        crisisRecognition: knobValues['crisis-event-recognition'],
        historicalContext: knobValues['historical-context-integration']
      },
      specialtyKnowledge: {
        professionalExpertise: knobValues['professional-expertise-depth'],
        crossDomainKnowledge: knobValues['cross-domain-knowledge'],
        strategicThinking: knobValues['strategic-thinking-capability'],
        technicalCompetency: knobValues['technical-competency-level'],
        advisoryQuality: knobValues['advisory-quality-standard'],
        innovationCreativity: knobValues['innovation-creativity-level'],
        riskAssessment: knobValues['risk-assessment-accuracy'],
        decisionSupport: knobValues['decision-support-effectiveness']
      },
      responsivenessAdaptation: {
        situationalAdaptability: knobValues['situational-adaptability'],
        informationProcessing: knobValues['information-processing-speed'],
        proactiveInitiative: knobValues['proactive-initiative-level'],
        collaborativeEngagement: knobValues['collaborative-engagement'],
        feedbackResponsiveness: knobValues['feedback-responsiveness'],
        learningAdaptation: knobValues['learning-adaptation-rate'],
        stressPerformance: knobValues['stress-performance-stability'],
        changeManagement: knobValues['change-management-capability']
      }
    };
    
    res.json({
      success: true,
      data: characterAwareness,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting character game state awareness:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get character game state awareness'
    });
  }
});

/**
 * GET /api/characters/specialty-analysis
 * Get analysis of character performance in their specialty areas
 */
router.get('/specialty-analysis', async (req, res) => {
  try {
    const { campaignId, civilizationId, characterId } = req.query;
    
    if (!campaignId || !civilizationId) {
      return res.status(400).json({ error: 'Campaign ID and Civilization ID are required' });
    }

    const knobValues = await charactersKnobSystem.getKnobValues(campaignId as string, civilizationId as string);
    
    const specialtyAnalysis = {
      expertiseMetrics: {
        professionalDepth: knobValues['professional-expertise-depth'],
        crossDomainBreadth: knobValues['cross-domain-knowledge'],
        strategicCapability: knobValues['strategic-thinking-capability'],
        technicalSkills: knobValues['technical-competency-level']
      },
      performanceIndicators: {
        advisoryQuality: knobValues['advisory-quality-standard'],
        innovationLevel: knobValues['innovation-creativity-level'],
        riskAssessmentAccuracy: knobValues['risk-assessment-accuracy'],
        decisionSupportValue: knobValues['decision-support-effectiveness']
      },
      adaptabilityFactors: {
        situationalFlexibility: knobValues['situational-adaptability'],
        learningSpeed: knobValues['learning-adaptation-rate'],
        stressResilience: knobValues['stress-performance-stability'],
        changeLeadership: knobValues['change-management-capability']
      },
      overallRating: calculateOverallSpecialtyRating(knobValues)
    };
    
    res.json({
      success: true,
      data: specialtyAnalysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting character specialty analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get character specialty analysis'
    });
  }
});

/**
 * POST /api/characters/update-awareness
 * Update character awareness based on new game events or information
 */
router.post('/update-awareness', async (req, res) => {
  try {
    const { campaignId, civilizationId, characterId, eventType, eventData, awarenessImpact } = req.body;
    
    if (!campaignId || !civilizationId || !eventType) {
      return res.status(400).json({ error: 'Campaign ID, Civilization ID, and event type are required' });
    }

    // Simulate updating character awareness based on events
    const awarenessUpdate = {
      characterId: characterId || 'all',
      eventType,
      eventData,
      awarenessChanges: {
        gameStateAwareness: awarenessImpact?.gameState || 0,
        politicalUnderstanding: awarenessImpact?.political || 0,
        economicAwareness: awarenessImpact?.economic || 0,
        militaryKnowledge: awarenessImpact?.military || 0,
        technologicalTracking: awarenessImpact?.technology || 0,
        socialCulturalAwareness: awarenessImpact?.social || 0
      },
      timestamp: new Date().toISOString(),
      processed: true
    };
    
    res.json({
      success: true,
      data: awarenessUpdate,
      message: 'Character awareness updated successfully'
    });
  } catch (error) {
    console.error('Error updating character awareness:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update character awareness'
    });
  }
});

// Helper function to calculate overall specialty rating
function calculateOverallSpecialtyRating(knobValues: any): number {
  const expertiseScore = (
    knobValues['professional-expertise-depth'] +
    knobValues['technical-competency-level'] +
    knobValues['strategic-thinking-capability']
  ) / 3;
  
  const performanceScore = (
    knobValues['advisory-quality-standard'] +
    knobValues['decision-support-effectiveness'] +
    knobValues['risk-assessment-accuracy']
  ) / 3;
  
  const adaptabilityScore = (
    knobValues['situational-adaptability'] +
    knobValues['learning-adaptation-rate'] +
    knobValues['change-management-capability']
  ) / 3;
  
  return (expertiseScore + performanceScore + adaptabilityScore) / 3;
}

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, charactersKnobSystem);

export default router;