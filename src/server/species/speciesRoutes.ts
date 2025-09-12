/**
 * Species Management Routes
 * 
 * API endpoints for managing species in the game
 */

import express from 'express';
import { Pool } from 'pg';
import { getSpeciesGenerator, initializeSpeciesGenerator } from './SpeciesGenerator';

const router = express.Router();

/**
 * Get all available species
 */
router.get('/', async (req, res) => {
  try {
    const speciesGenerator = getSpeciesGenerator();
    const allSpecies = speciesGenerator.getAllSpecies();
    
    res.json({
      success: true,
      species: allSpecies,
      count: allSpecies.length
    });
  } catch (error) {
    console.error('❌ Error getting species:', error);
    res.status(500).json({
      error: 'Failed to get species',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get a specific species by ID
 */
router.get('/:speciesId', async (req, res) => {
  try {
    const { speciesId } = req.params;
    const speciesGenerator = getSpeciesGenerator();
    const species = speciesGenerator.getSpecies(speciesId);
    
    if (!species) {
      return res.status(404).json({
        error: `Species not found: ${speciesId}`
      });
    }
    
    res.json({
      success: true,
      species
    });
  } catch (error) {
    console.error('❌ Error getting species:', error);
    res.status(500).json({
      error: 'Failed to get species',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Generate a new species for game setup
 */
router.post('/generate', async (req, res) => {
  try {
    const { theme, existingSpeciesIds, gameContext } = req.body;
    
    console.log(`🧬 Generating new species for theme: ${theme}`);
    
    const speciesGenerator = getSpeciesGenerator();
    
    // Get existing species to avoid overlap
    const existingSpecies = existingSpeciesIds ? 
      existingSpeciesIds.map((id: string) => speciesGenerator.getSpecies(id)).filter(Boolean) : 
      [];
    
    const newSpecies = await speciesGenerator.generateNewSpecies(
      theme || 'space_opera',
      existingSpecies,
      gameContext || {}
    );
    
    res.json({
      success: true,
      species: newSpecies,
      message: `Generated new species: ${newSpecies.name}`
    });
  } catch (error) {
    console.error('❌ Error generating species:', error);
    res.status(500).json({
      error: 'Failed to generate species',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get species suitable for a civilization type
 */
router.post('/suitable-for-civilization', async (req, res) => {
  try {
    const { governmentType, culturalValues, technologyLevel } = req.body;
    
    const speciesGenerator = getSpeciesGenerator();
    const suitableSpecies = speciesGenerator.getSpeciesForCivilization(
      governmentType || 'democracy',
      culturalValues || [],
      technologyLevel || 50
    );
    
    res.json({
      success: true,
      species: suitableSpecies,
      count: suitableSpecies.length,
      message: `Found ${suitableSpecies.length} suitable species`
    });
  } catch (error) {
    console.error('❌ Error finding suitable species:', error);
    res.status(500).json({
      error: 'Failed to find suitable species',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get core species (the 9 main species)
 */
router.get('/core/list', async (req, res) => {
  try {
    const speciesGenerator = getSpeciesGenerator();
    const allSpecies = speciesGenerator.getAllSpecies();
    const coreSpecies = allSpecies.filter(species => species.category === 'core');
    
    res.json({
      success: true,
      species: coreSpecies.map(species => ({
        id: species.id,
        name: species.name,
        emoji: species.emoji,
        description: species.description,
        primaryFocus: species.traits.primary_focus,
        gameplayBonuses: species.gameplayBonuses
      })),
      count: coreSpecies.length
    });
  } catch (error) {
    console.error('❌ Error getting core species:', error);
    res.status(500).json({
      error: 'Failed to get core species',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;

// Initialize function for server startup
export function initializeSpeciesRoutes(pool: Pool): void {
  initializeSpeciesGenerator();
  console.log('🧬 Species Routes initialized');
}
