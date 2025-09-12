/**
 * Game Character Generation Routes
 * 
 * API endpoints for generating characters dynamically based on game setup
 */

import express from 'express';
import { Pool } from 'pg';
import { getGameCharacterService, GameCharacterConfig, CivilizationData } from './GameCharacterService';

const router = express.Router();

/**
 * Generate characters for a specific game setup
 */
router.post('/generate-for-game', async (req, res) => {
  try {
    const { gameId, gameConfig, civilizations } = req.body;
    
    console.log(`🎮 Generating characters for game ${gameId}`);
    
    const gameCharacterService = getGameCharacterService();
    const allCharacters = await gameCharacterService.generateCharactersForGameSetup(
      gameId,
      gameConfig,
      civilizations
    );
    
    // Convert Map to object for JSON response
    const charactersObj: { [civId: number]: any[] } = {};
    allCharacters.forEach((characters, civId) => {
      charactersObj[civId] = characters.map(char => ({
        id: char.id,
        name: char.name.full_display,
        title: char.profession.job_title,
        department: char.subcategory,
        category: char.category,
        civilizationId: char.civilization_id
      }));
    });
    
    res.json({
      success: true,
      message: `Generated characters for ${civilizations.length} civilizations`,
      characters: charactersObj,
      totalCharacters: Array.from(allCharacters.values()).reduce((sum, chars) => sum + chars.length, 0)
    });
    
  } catch (error) {
    console.error('❌ Error generating characters for game:', error);
    res.status(500).json({
      error: 'Failed to generate characters for game',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Generate characters for a specific civilization
 */
router.post('/generate-for-civilization', async (req, res) => {
  try {
    const { config, civilizationData } = req.body as {
      config: GameCharacterConfig;
      civilizationData: CivilizationData;
    };
    
    console.log(`🏛️ Generating characters for civilization ${civilizationData.name}`);
    
    const gameCharacterService = getGameCharacterService();
    const characters = await gameCharacterService.generateGameCharacters(config, civilizationData);
    
    res.json({
      success: true,
      message: `Generated ${characters.length} characters for ${civilizationData.name}`,
      characters: characters.map(char => ({
        id: char.id,
        name: char.name.full_display,
        title: char.profession.job_title,
        department: char.subcategory,
        category: char.category,
        civilizationId: char.civilization_id,
        voiceProfile: (char as any).voiceProfile
      })),
      count: characters.length
    });
    
  } catch (error) {
    console.error('❌ Error generating characters for civilization:', error);
    res.status(500).json({
      error: 'Failed to generate characters for civilization',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Update characters based on game events
 */
router.post('/update-from-events', async (req, res) => {
  try {
    const { civilizationId, events, gameState } = req.body;
    
    console.log(`🔄 Updating characters for civilization ${civilizationId} based on events`);
    
    const gameCharacterService = getGameCharacterService();
    await gameCharacterService.updateCharactersFromGameEvents(civilizationId, events, gameState);
    
    res.json({
      success: true,
      message: `Updated characters for civilization ${civilizationId}`
    });
    
  } catch (error) {
    console.error('❌ Error updating characters from events:', error);
    res.status(500).json({
      error: 'Failed to update characters from events',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get sample civilization data for testing
 */
router.get('/sample-civilization', (req, res) => {
  const sampleCivilization: CivilizationData = {
    id: 1,
    name: 'Terran Federation',
    species_id: 'core_species_1', // The Synthesists
    government_type: 'federation',
    population: 500000000,
    technology_level: 75,
    economic_status: 'good',
    political_stability: 70,
    cultural_values: ['democracy', 'innovation', 'exploration', 'diversity'],
    current_events: [
      'New trade agreement with Zephyrian Empire',
      'Technological breakthrough in quantum computing',
      'Rising tensions with Vorthan Confederacy'
    ],
    external_relations: {
      '2': 60,  // Zephyrian Empire - friendly
      '3': -30, // Vorthan Confederacy - hostile
      '4': 20   // Nexus Coalition - neutral
    }
  };
  
  res.json({
    success: true,
    civilization: sampleCivilization
  });
});

/**
 * Get sample game configuration for testing
 */
router.get('/sample-config', (req, res) => {
  const sampleConfig: GameCharacterConfig = {
    civilizationId: 1,
    planetId: 1,
    gameTheme: 'space_opera',
    playerCount: 4,
    storyComplexity: 'moderate',
    includeGovernment: true,
    includeBusinessLeaders: true,
    includeDiplomats: true,
    includeOtherCivs: false,
    characterDensity: 'normal'
  };
  
  res.json({
    success: true,
    config: sampleConfig
  });
});

export default router;

// Initialize function for server startup
export function initializeGameCharacterRoutes(pool: Pool): void {
  console.log('🎭 Game Character Routes initialized');
}
