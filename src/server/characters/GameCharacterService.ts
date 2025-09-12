/**
 * Game Character Service
 * 
 * Orchestrates character generation for the entire game based on game setup,
 * civilization data, and current game state. Integrates with WhoseApp for
 * dynamic character interactions.
 */

import { Pool } from 'pg';
import { GovernmentCharacterGenerator, GovernmentStructure, PoliticalContext } from './GovernmentCharacterGenerator';
import { ProceduralCharacterGenerator, CharacterGenerationContext } from './ProceduralCharacterGenerator';
import { DynamicCharacter } from './DynamicCharacterEngine';
import { getSpeciesGenerator, Species } from '../species/SpeciesGenerator';

export interface GameCharacterConfig {
  civilizationId: number;
  planetId: number;
  cityId?: number;
  gameTheme: string;
  playerCount: number;
  storyComplexity: 'simple' | 'moderate' | 'complex' | 'epic';
  includeGovernment: boolean;
  includeBusinessLeaders: boolean;
  includeDiplomats: boolean;
  includeOtherCivs: boolean;
  characterDensity: 'minimal' | 'normal' | 'rich' | 'maximum';
}

export interface CivilizationData {
  id: number;
  name: string;
  species_id: string; // Reference to species
  government_type: 'democracy' | 'republic' | 'monarchy' | 'federation' | 'empire' | 'confederation';
  population: number;
  technology_level: number;
  economic_status: 'excellent' | 'good' | 'fair' | 'poor' | 'crisis';
  political_stability: number; // 0-100
  cultural_values: string[];
  current_events: string[];
  external_relations: { [civId: string]: number }; // -100 to 100
}

export class GameCharacterService {
  private pool: Pool;
  private governmentGenerator: GovernmentCharacterGenerator;
  private characterGenerator: ProceduralCharacterGenerator;
  private generatedCharacters: Map<number, DynamicCharacter[]> = new Map();

  constructor(pool: Pool) {
    this.pool = pool;
    this.governmentGenerator = new GovernmentCharacterGenerator(pool);
    this.characterGenerator = new ProceduralCharacterGenerator(pool);
  }

  /**
   * Generate all characters for a game based on configuration
   */
  async generateGameCharacters(
    config: GameCharacterConfig,
    civilizationData: CivilizationData
  ): Promise<DynamicCharacter[]> {
    console.log(`🎭 Generating characters for civilization ${civilizationData.name} (Species: ${civilizationData.species_id})`);

    const allCharacters: DynamicCharacter[] = [];
    
    // Get species data
    const speciesGenerator = getSpeciesGenerator();
    const species = speciesGenerator.getSpecies(civilizationData.species_id);
    
    if (!species) {
      console.warn(`Species ${civilizationData.species_id} not found, using default`);
    }
    
    // Create character generation context
    const context = this.createGenerationContext(config, civilizationData, species);
    
    // Generate government officials if requested
    if (config.includeGovernment) {
      const governmentStructure = this.createGovernmentStructure(civilizationData);
      const politicalContext = this.createPoliticalContext(civilizationData);
      
      const governmentCharacters = await this.governmentGenerator.generateGovernment(
        config.civilizationId,
        config.planetId,
        governmentStructure,
        politicalContext,
        context
      );
      
      allCharacters.push(...governmentCharacters);
    }

    // Generate additional character types
    const additionalTypes = this.determineAdditionalCharacterTypes(config);
    if (additionalTypes.length > 0) {
      const additionalCharacters = await this.governmentGenerator.generateAdditionalCharacters(
        config.civilizationId,
        config.planetId,
        context,
        additionalTypes
      );
      
      allCharacters.push(...additionalCharacters);
    }

    // Generate citizen characters based on density
    const citizenCharacters = await this.generateCitizenCharacters(config, context);
    allCharacters.push(...citizenCharacters);

    // Store generated characters
    this.generatedCharacters.set(config.civilizationId, allCharacters);

    // Save characters to database
    await this.saveCharactersToDatabase(allCharacters);

    console.log(`✅ Generated ${allCharacters.length} total characters for ${civilizationData.name}`);
    return allCharacters;
  }

  /**
   * Get characters for WhoseApp integration
   */
  async getCharactersForWhoseApp(civilizationId: number): Promise<any[]> {
    let characters = this.generatedCharacters.get(civilizationId);
    
    if (!characters) {
      // Load from database if not in memory
      characters = await this.loadCharactersFromDatabase(civilizationId);
    }

    if (!characters || characters.length === 0) {
      console.warn(`No characters found for civilization ${civilizationId}`);
      return [];
    }

    // Convert to WhoseApp format
    return characters.map(character => this.convertToWhoseAppFormat(character));
  }

  /**
   * Generate characters for a specific game setup
   */
  async generateCharactersForGameSetup(
    gameId: string,
    gameConfig: any,
    civilizations: CivilizationData[]
  ): Promise<Map<number, DynamicCharacter[]>> {
    console.log(`🎮 Generating characters for game ${gameId}`);

    const allGameCharacters = new Map<number, DynamicCharacter[]>();

    for (const civilization of civilizations) {
      const config: GameCharacterConfig = {
        civilizationId: civilization.id,
        planetId: 1, // Default planet
        gameTheme: gameConfig.theme || 'space_opera',
        playerCount: gameConfig.maxPlayers || 4,
        storyComplexity: gameConfig.storyComplexity || 'moderate',
        includeGovernment: true,
        includeBusinessLeaders: gameConfig.storyComplexity !== 'simple',
        includeDiplomats: civilizations.length > 1,
        includeOtherCivs: civilizations.length > 1,
        characterDensity: this.getCharacterDensityFromComplexity(gameConfig.storyComplexity)
      };

      const characters = await this.generateGameCharacters(config, civilization);
      allGameCharacters.set(civilization.id, characters);
    }

    console.log(`✅ Generated characters for ${civilizations.length} civilizations`);
    return allGameCharacters;
  }

  /**
   * Update character data based on game events
   */
  async updateCharactersFromGameEvents(
    civilizationId: number,
    events: string[],
    gameState: any
  ): Promise<void> {
    const characters = this.generatedCharacters.get(civilizationId);
    if (!characters) return;

    console.log(`🔄 Updating ${characters.length} characters based on game events`);

    for (const character of characters) {
      // Update character opinions, status, and relationships based on events
      await this.updateCharacterFromEvents(character, events, gameState);
    }

    // Save updated characters
    await this.saveCharactersToDatabase(characters);
  }

  /**
   * Create character generation context from game config
   */
  private createGenerationContext(
    config: GameCharacterConfig,
    civilizationData: CivilizationData,
    species?: Species | null
  ): CharacterGenerationContext {
    return {
      civilization_id: config.civilizationId,
      planet_id: config.planetId,
      city_id: config.cityId,
      current_events: civilizationData.current_events,
      economic_climate: civilizationData.economic_status,
      political_climate: this.getPoliticalClimateDescription(civilizationData.political_stability),
      social_trends: this.generateSocialTrends(civilizationData),
      technology_level: civilizationData.technology_level,
      population_density: this.calculatePopulationDensity(civilizationData.population),
      cultural_values: civilizationData.cultural_values
    };
  }

  /**
   * Create government structure from civilization data
   */
  private createGovernmentStructure(civilizationData: CivilizationData): GovernmentStructure {
    return {
      government_type: civilizationData.government_type,
      leadership_style: this.determineLeadershipStyle(civilizationData.government_type),
      cabinet_size: this.determineCabinetSize(civilizationData.government_type, civilizationData.population),
      term_length: this.determineTermLength(civilizationData.government_type),
      election_cycle: civilizationData.government_type === 'democracy' ? 'regular' : 
                     civilizationData.government_type === 'republic' ? 'regular' : 'none',
      power_distribution: this.determinePowerDistribution(civilizationData.government_type)
    };
  }

  /**
   * Create political context from civilization data
   */
  private createPoliticalContext(civilizationData: CivilizationData): PoliticalContext {
    return {
      current_crisis: civilizationData.current_events.filter(event => 
        event.includes('crisis') || event.includes('emergency') || event.includes('threat')
      ),
      approval_rating: Math.max(20, Math.min(80, civilizationData.political_stability + Math.random() * 20 - 10)),
      economic_situation: civilizationData.economic_status,
      external_threats: this.identifyExternalThreats(civilizationData.external_relations),
      internal_challenges: this.identifyInternalChallenges(civilizationData),
      recent_elections: Math.random() < 0.3, // 30% chance of recent elections
      coalition_government: civilizationData.government_type === 'democracy' && Math.random() < 0.4
    };
  }

  /**
   * Determine additional character types to generate
   */
  private determineAdditionalCharacterTypes(config: GameCharacterConfig): string[] {
    const types: string[] = [];

    if (config.includeBusinessLeaders) {
      types.push('business_leaders');
    }

    if (config.includeDiplomats) {
      types.push('diplomats');
    }

    if (config.includeOtherCivs) {
      types.push('other_civ_leaders');
    }

    // Add advisors for complex games
    if (config.storyComplexity === 'complex' || config.storyComplexity === 'epic') {
      types.push('advisors');
    }

    return types;
  }

  /**
   * Generate citizen characters based on density setting
   */
  private async generateCitizenCharacters(
    config: GameCharacterConfig,
    context: CharacterGenerationContext
  ): Promise<DynamicCharacter[]> {
    const citizenCount = this.getCitizenCountFromDensity(config.characterDensity);
    const citizens: DynamicCharacter[] = [];

    console.log(`👥 Generating ${citizenCount} citizen characters`);

    // Create citizen templates
    const citizenTemplates = this.createCitizenTemplates();

    for (let i = 0; i < citizenCount; i++) {
      const template = citizenTemplates[Math.floor(Math.random() * citizenTemplates.length)];
      const citizen = await this.characterGenerator.generateCompleteCharacter(
        template,
        context,
        `citizen_${config.civilizationId}_${i}`
      );

      // Add voice profile
      (citizen as any).voiceProfile = this.generateCitizenVoiceProfile(citizen);
      
      citizens.push(citizen);
    }

    return citizens;
  }

  /**
   * Convert character to WhoseApp format
   */
  private convertToWhoseAppFormat(character: DynamicCharacter): any {
    // Get species information if available
    const speciesGenerator = getSpeciesGenerator();
    const species = speciesGenerator.getSpecies((character as any).species_id || 'core_species_1');
    
    return {
      id: character.id,
      name: character.name.full_display,
      title: character.profession.job_title,
      department: character.subcategory,
      category: character.category,
      species: species ? {
        id: species.id,
        name: species.name,
        emoji: species.emoji
      } : null,
      avatar: character.appearance.avatar_url || '/api/characters/avatar/default',
      description: this.generateCharacterDescription(character, species),
      personality: character.personality.core_traits,
      voiceProfile: this.generateSpeciesAwareVoiceProfile(character, species),
      status: 'available',
      lastActive: new Date().toISOString()
    };
  }

  /**
   * Generate character description for WhoseApp
   */
  private generateCharacterDescription(character: DynamicCharacter, species?: Species | null): string {
    const role = character.profession.job_title;
    const department = character.subcategory;
    const traits = character.personality.core_traits.slice(0, 3).join(', ');
    const speciesInfo = species ? ` ${species.name} ` : ' ';
    
    return `${speciesInfo}${role} in ${department}. Known for being ${traits}.`;
  }

  /**
   * Generate species-aware voice profile
   */
  private generateSpeciesAwareVoiceProfile(character: DynamicCharacter, species?: Species | null): any {
    const baseProfile = (character as any).voiceProfile || {
      pitch: 'medium',
      rate: 1.0,
      voice: character.demographics.gender === 'male' ? 'male' : 'female',
      accent: 'neutral',
      tone: 'friendly'
    };

    if (species && species.voiceCharacteristics) {
      // Apply species-specific voice characteristics
      const speciesVoice = species.voiceCharacteristics;
      
      return {
        ...baseProfile,
        pitch: speciesVoice.pitch_range,
        accent: speciesVoice.accent_characteristics[0] || baseProfile.accent,
        tone: speciesVoice.communication_style || baseProfile.tone,
        species_modulation: speciesVoice.speech_patterns[0] || 'standard'
      };
    }

    return baseProfile;
  }

  /**
   * Save characters to database
   */
  private async saveCharactersToDatabase(characters: DynamicCharacter[]): Promise<void> {
    try {
      for (const character of characters) {
        await this.pool.query(`
          INSERT INTO characters (
            id, name, category, subcategory, civilization_id, 
            data, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
          ON CONFLICT (id) DO UPDATE SET
            data = $6, updated_at = NOW()
        `, [
          character.id,
          character.name.full_display,
          character.category,
          character.subcategory,
          character.civilization_id,
          JSON.stringify(character)
        ]);
      }
      
      console.log(`💾 Saved ${characters.length} characters to database`);
    } catch (error) {
      console.error('Error saving characters to database:', error);
    }
  }

  /**
   * Load characters from database
   */
  private async loadCharactersFromDatabase(civilizationId: number): Promise<DynamicCharacter[]> {
    try {
      const result = await this.pool.query(
        'SELECT data FROM characters WHERE civilization_id = $1',
        [civilizationId]
      );
      
      return result.rows.map(row => JSON.parse(row.data));
    } catch (error) {
      console.error('Error loading characters from database:', error);
      return [];
    }
  }

  // Helper methods

  private getPoliticalClimateDescription(stability: number): string {
    if (stability > 80) return 'stable';
    if (stability > 60) return 'mostly_stable';
    if (stability > 40) return 'uncertain';
    if (stability > 20) return 'unstable';
    return 'crisis';
  }

  private generateSocialTrends(civilizationData: CivilizationData): string[] {
    const trends = ['technological_advancement', 'social_media_influence'];
    
    if (civilizationData.economic_status === 'excellent') {
      trends.push('prosperity_culture', 'innovation_focus');
    } else if (civilizationData.economic_status === 'poor') {
      trends.push('economic_anxiety', 'social_unrest');
    }
    
    return trends;
  }

  private calculatePopulationDensity(population: number): number {
    // Simplified calculation - in a real game this would be more complex
    return Math.min(100, Math.max(10, Math.log10(population) * 10));
  }

  private determineLeadershipStyle(governmentType: string): any {
    const styles = {
      'democracy': 'presidential',
      'republic': 'parliamentary',
      'monarchy': 'autocratic',
      'federation': 'council',
      'empire': 'autocratic',
      'confederation': 'council'
    };
    
    return styles[governmentType] || 'presidential';
  }

  private determineCabinetSize(governmentType: string, population: number): number {
    let baseSize = 12;
    
    if (governmentType === 'empire' || governmentType === 'federation') {
      baseSize = 15;
    } else if (governmentType === 'monarchy') {
      baseSize = 8;
    }
    
    // Adjust for population
    if (population > 1000000000) baseSize += 3;
    else if (population < 100000000) baseSize -= 2;
    
    return Math.max(6, Math.min(20, baseSize));
  }

  private determineTermLength(governmentType: string): number {
    const termLengths = {
      'democracy': 4,
      'republic': 5,
      'monarchy': 0, // Lifetime
      'federation': 6,
      'empire': 0, // Lifetime
      'confederation': 3
    };
    
    return termLengths[governmentType] || 4;
  }

  private determinePowerDistribution(governmentType: string): any {
    if (governmentType === 'federation' || governmentType === 'confederation') {
      return 'federal';
    } else if (governmentType === 'democracy' || governmentType === 'republic') {
      return 'distributed';
    } else {
      return 'centralized';
    }
  }

  private identifyExternalThreats(externalRelations: { [civId: string]: number }): string[] {
    const threats: string[] = [];
    
    Object.entries(externalRelations).forEach(([civId, relation]) => {
      if (relation < -50) {
        threats.push(`Hostile relations with Civilization ${civId}`);
      }
    });
    
    return threats;
  }

  private identifyInternalChallenges(civilizationData: CivilizationData): string[] {
    const challenges: string[] = [];
    
    if (civilizationData.economic_status === 'poor' || civilizationData.economic_status === 'crisis') {
      challenges.push('Economic difficulties');
    }
    
    if (civilizationData.political_stability < 50) {
      challenges.push('Political instability');
    }
    
    return challenges;
  }

  private getCharacterDensityFromComplexity(complexity: string): 'minimal' | 'normal' | 'rich' | 'maximum' {
    const densityMap = {
      'simple': 'minimal',
      'moderate': 'normal',
      'complex': 'rich',
      'epic': 'maximum'
    };
    
    return densityMap[complexity] || 'normal';
  }

  private getCitizenCountFromDensity(density: string): number {
    const counts = {
      'minimal': 3,
      'normal': 8,
      'rich': 15,
      'maximum': 25
    };
    
    return counts[density] || 8;
  }

  private createCitizenTemplates(): any[] {
    // Create basic citizen templates
    return [
      {
        id: 'citizen_professional',
        category: 'citizen',
        subcategory: 'professional',
        rarity: 'common',
        baseAttributes: {
          intelligence: 65, charisma: 60, ambition: 55, integrity: 70,
          creativity: 60, empathy: 65, resilience: 65, leadership: 50,
          technical_skill: 70, social_influence: 45
        },
        personalityTraits: ['hardworking', 'reliable', 'practical'],
        professionPool: ['Engineer', 'Teacher', 'Nurse', 'Accountant', 'Manager'],
        backgroundTemplates: [], namePatterns: [], appearanceTemplates: [], 
        skillSets: [], relationshipTendencies: [], emergenceConditions: []
      },
      {
        id: 'citizen_creative',
        category: 'citizen',
        subcategory: 'creative',
        rarity: 'uncommon',
        baseAttributes: {
          intelligence: 70, charisma: 65, ambition: 60, integrity: 65,
          creativity: 85, empathy: 70, resilience: 60, leadership: 55,
          technical_skill: 55, social_influence: 60
        },
        personalityTraits: ['creative', 'expressive', 'independent'],
        professionPool: ['Artist', 'Writer', 'Designer', 'Musician', 'Filmmaker'],
        backgroundTemplates: [], namePatterns: [], appearanceTemplates: [], 
        skillSets: [], relationshipTendencies: [], emergenceConditions: []
      }
    ];
  }

  private generateCitizenVoiceProfile(character: DynamicCharacter): any {
    return {
      pitch: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      rate: 0.9 + Math.random() * 0.3, // 0.9 to 1.2
      voice: character.demographics.gender === 'male' ? 'male' : 'female',
      accent: 'neutral',
      tone: 'friendly'
    };
  }

  private async updateCharacterFromEvents(
    character: DynamicCharacter,
    events: string[],
    gameState: any
  ): Promise<void> {
    // Update character based on game events
    // This would modify opinions, status, relationships, etc.
    console.log(`Updating character ${character.name.full_display} based on events`);
  }
}

// Singleton instance
let gameCharacterService: GameCharacterService;

export function initializeGameCharacterService(pool: Pool): void {
  gameCharacterService = new GameCharacterService(pool);
  console.log('🎭 Game Character Service initialized');
}

export function getGameCharacterService(): GameCharacterService {
  if (!gameCharacterService) {
    throw new Error('Game Character Service not initialized');
  }
  return gameCharacterService;
}
