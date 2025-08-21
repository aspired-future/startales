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

// Enhanced AI Knobs for Characters System
const charactersKnobsData = {
  // Character Generation & Diversity
  character_diversity_level: 0.8,       // Character diversity and uniqueness level
  procedural_generation_complexity: 0.7, // Procedural character generation complexity
  character_archetype_variety: 0.8,     // Character archetype and role variety
  
  // Personality & Behavior
  personality_trait_intensity: 0.7,     // Character personality trait intensity
  behavioral_consistency: 0.8,          // Character behavioral consistency and reliability
  emotional_response_variability: 0.6,  // Emotional response variability and authenticity
  
  // Character Development & Growth
  character_development_rate: 0.6,      // Character growth and development rate
  skill_progression_speed: 0.7,         // Character skill and ability progression
  relationship_evolution_rate: 0.6,     // Character relationship development rate
  
  // Social Dynamics & Relationships
  social_network_complexity: 0.7,       // Character social network complexity
  interpersonal_conflict_frequency: 0.5, // Interpersonal conflict and drama frequency
  alliance_formation_tendency: 0.6,     // Character alliance and friendship formation
  
  // Character Agency & Autonomy
  autonomous_decision_making: 0.7,      // Character autonomous decision-making capability
  proactive_behavior_level: 0.6,        // Character proactive behavior and initiative
  goal_pursuit_persistence: 0.8,        // Character goal pursuit and persistence
  
  // Communication & Interaction
  dialogue_sophistication: 0.8,         // Character dialogue sophistication and depth
  communication_frequency: 0.7,         // Character communication and interaction frequency
  storytelling_contribution: 0.8,       // Character contribution to narrative and story
  
  // Cultural & Background Authenticity
  cultural_background_depth: 0.8,       // Character cultural background authenticity
  historical_context_integration: 0.7,  // Historical and contextual background integration
  species_trait_expression: 0.8,        // Species-specific trait expression and authenticity
  
  // Character Specialization & Roles
  professional_competence_level: 0.8,   // Character professional skill and competence
  role_specialization_depth: 0.7,       // Character role specialization and expertise
  leadership_capability_variation: 0.6, // Leadership capability variation across characters
  
  // Narrative Integration
  plot_relevance_weighting: 0.7,        // Character plot relevance and story integration
  dramatic_timing_sensitivity: 0.6,     // Character dramatic timing and narrative awareness
  story_arc_contribution: 0.8,          // Character story arc and development contribution
  
  // Character Persistence & Memory
  memory_retention_accuracy: 0.8,       // Character memory retention and recall accuracy
  relationship_memory_depth: 0.7,       // Character relationship history memory depth
  experience_learning_rate: 0.6,        // Character learning from experience rate
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Characters
const charactersKnobSystem = new EnhancedKnobSystem(charactersKnobsData);

// Apply characters knobs to game state
function applyCharactersKnobsToGameState() {
  const knobs = charactersKnobSystem.knobs;
  
  // Apply character generation settings
  const characterGeneration = (knobs.character_diversity_level + knobs.procedural_generation_complexity + 
    knobs.character_archetype_variety) / 3;
  
  // Apply personality and behavior settings
  const personalityBehavior = (knobs.personality_trait_intensity + knobs.behavioral_consistency + 
    knobs.emotional_response_variability) / 3;
  
  // Apply character development settings
  const characterDevelopment = (knobs.character_development_rate + knobs.skill_progression_speed + 
    knobs.relationship_evolution_rate) / 3;
  
  // Apply social dynamics settings
  const socialDynamics = (knobs.social_network_complexity + knobs.interpersonal_conflict_frequency + 
    knobs.alliance_formation_tendency) / 3;
  
  // Apply character agency settings
  const characterAgency = (knobs.autonomous_decision_making + knobs.proactive_behavior_level + 
    knobs.goal_pursuit_persistence) / 3;
  
  // Apply narrative integration settings
  const narrativeIntegration = (knobs.plot_relevance_weighting + knobs.dramatic_timing_sensitivity + 
    knobs.story_arc_contribution) / 3;
  
  console.log('Applied characters knobs to game state:', {
    characterGeneration,
    personalityBehavior,
    characterDevelopment,
    socialDynamics,
    characterAgency,
    narrativeIntegration
  });
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

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'characters', charactersKnobSystem, applyCharactersKnobsToGameState);

export default router;