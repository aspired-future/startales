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

const router = express.Router();
let characterEngine: DynamicCharacterEngine;
let characterService: CharacterService;
let characterGenerator: ProceduralCharacterGenerator;

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

export default router;