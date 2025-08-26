/**
 * Space Civilization Game - Detailed Image & Video Prompt Generator
 * Generates consistent, detailed prompts for AI image/video generation
 */

export interface PromptStyle {
  baseStyle: string;
  lighting: string;
  composition: string;
  quality: string;
  artStyle: string;
}

export interface EntityContext {
  entityType: 'character' | 'species' | 'planet' | 'city' | 'spaceship' | 'unit' | 'weapon' | 'building' | 'environment' | 'effect' | 'cutscene';
  entityName: string;
  civilization?: string;
  era?: 'early_space' | 'interstellar' | 'galactic' | 'transcendent';
  mood?: 'peaceful' | 'tense' | 'dramatic' | 'mysterious' | 'heroic' | 'ominous';
  setting?: 'space' | 'planet_surface' | 'city' | 'ship_interior' | 'station' | 'void';
}

// Consistent visual style for the space civilization game
const GAME_VISUAL_STYLE: PromptStyle = {
  baseStyle: "photorealistic sci-fi concept art, highly detailed, professional game asset",
  lighting: "dramatic cinematic lighting with volumetric fog and particle effects",
  composition: "dynamic composition with depth of field and atmospheric perspective",
  quality: "8K resolution, ultra-high quality, sharp focus, intricate details",
  artStyle: "modern sci-fi aesthetic, sleek futuristic design, advanced technology"
};

// Color palettes for different civilizations
const CIVILIZATION_PALETTES = {
  'Terran Federation': 'blue and silver tones, clean metallic surfaces, holographic displays',
  'Zephyrian Empire': 'purple and gold accents, crystalline structures, energy patterns',
  'Centauri Republic': 'green and copper hues, organic-tech fusion, bioluminescent elements',
  'Vegan Collective': 'warm orange and bronze, sustainable technology, living architecture',
  'Sirian Empire': 'red and black military aesthetic, angular designs, weapon systems',
  'Kepler Technocracy': 'white and cyan, pristine laboratory environments, advanced AI interfaces',
  'Andromeda Empire': 'deep space purple and silver, massive scale structures, ancient technology',
  'Orion Collective': 'multi-colored energy signatures, diverse species integration, adaptive technology'
};

// Environmental settings for consistency
const ENVIRONMENT_SETTINGS = {
  space: "deep space background with distant stars, nebulae, and cosmic phenomena",
  planet_surface: "alien planet surface with unique geological features, atmospheric effects",
  city: "futuristic cityscape with towering spires, flying vehicles, holographic advertisements",
  ship_interior: "high-tech spaceship interior with control panels, corridors, and viewing ports",
  station: "massive space station with docking bays, rotating sections, and defensive systems",
  void: "mysterious void space with energy anomalies and unknown phenomena"
};

// Species-specific characteristics for consistency
const SPECIES_TRAITS = {
  human: "human features, diverse ethnicities, advanced cybernetic enhancements, military or civilian attire",
  zephyrian: "tall elegant beings with crystalline skin patterns, luminous eyes, flowing robes with energy conduits",
  centaurian: "plant-human hybrid features, bark-like skin textures, symbiotic technology integration",
  vegan: "insectoid characteristics, compound eyes, chitinous armor plating, hive-mind indicators",
  sirian: "reptilian features, scaled skin, predatory aspects, military bearing and equipment",
  kepler: "highly augmented beings, visible cybernetic implants, neural interface ports, pristine appearance",
  andromedan: "ancient ethereal beings, energy-based physiology, translucent features, cosmic awareness",
  orion: "diverse collective species, adaptive characteristics, multi-species cooperation indicators"
};

export class SpaceCivPromptGenerator {
  
  /**
   * Generate detailed character prompt
   */
  static generateCharacterPrompt(context: EntityContext): string {
    const { entityName, civilization = 'Terran Federation', era = 'interstellar', mood = 'heroic' } = context;
    
    const civilizationPalette = CIVILIZATION_PALETTES[civilization as keyof typeof CIVILIZATION_PALETTES] || CIVILIZATION_PALETTES['Terran Federation'];
    const speciesKey = civilization.toLowerCase().split(' ')[0] as keyof typeof SPECIES_TRAITS;
    const speciesTraits = SPECIES_TRAITS[speciesKey] || SPECIES_TRAITS.human;
    
    return `${GAME_VISUAL_STYLE.baseStyle}, portrait of ${entityName}, ${speciesTraits}, ${civilizationPalette}, ${mood} expression and pose, ${era} era technology and clothing, ${GAME_VISUAL_STYLE.lighting}, ${GAME_VISUAL_STYLE.composition}, ${GAME_VISUAL_STYLE.quality}, ${GAME_VISUAL_STYLE.artStyle}`;
  }

  /**
   * Generate detailed planet/environment prompt
   */
  static generateEnvironmentPrompt(context: EntityContext): string {
    const { entityName, setting = 'planet_surface', mood = 'mysterious', era = 'interstellar' } = context;
    
    const environmentSetting = ENVIRONMENT_SETTINGS[setting];
    
    return `${GAME_VISUAL_STYLE.baseStyle}, ${entityName}, ${environmentSetting}, ${mood} atmosphere, ${era} era structures and technology, alien flora and fauna, atmospheric effects and weather patterns, ${GAME_VISUAL_STYLE.lighting}, ${GAME_VISUAL_STYLE.composition}, ${GAME_VISUAL_STYLE.quality}, ${GAME_VISUAL_STYLE.artStyle}`;
  }

  /**
   * Generate detailed spaceship/vehicle prompt
   */
  static generateVehiclePrompt(context: EntityContext): string {
    const { entityName, civilization = 'Terran Federation', era = 'interstellar', mood = 'heroic' } = context;
    
    const civilizationPalette = CIVILIZATION_PALETTES[civilization as keyof typeof CIVILIZATION_PALETTES] || CIVILIZATION_PALETTES['Terran Federation'];
    
    return `${GAME_VISUAL_STYLE.baseStyle}, ${entityName} spaceship, ${civilizationPalette}, ${era} era technology and design, ${mood} presence in space, advanced propulsion systems, weapon arrays, defensive shields, detailed hull textures and markings, ${ENVIRONMENT_SETTINGS.space}, ${GAME_VISUAL_STYLE.lighting}, ${GAME_VISUAL_STYLE.composition}, ${GAME_VISUAL_STYLE.quality}, ${GAME_VISUAL_STYLE.artStyle}`;
  }

  /**
   * Generate detailed city/structure prompt
   */
  static generateCityPrompt(context: EntityContext): string {
    const { entityName, civilization = 'Terran Federation', era = 'interstellar', mood = 'peaceful' } = context;
    
    const civilizationPalette = CIVILIZATION_PALETTES[civilization as keyof typeof CIVILIZATION_PALETTES] || CIVILIZATION_PALETTES['Terran Federation'];
    
    return `${GAME_VISUAL_STYLE.baseStyle}, ${entityName} city, ${civilizationPalette}, ${era} era architecture and infrastructure, ${mood} atmosphere, towering spires and megastructures, flying vehicles and transport systems, holographic displays and advertisements, diverse population and activity, ${GAME_VISUAL_STYLE.lighting}, ${GAME_VISUAL_STYLE.composition}, ${GAME_VISUAL_STYLE.quality}, ${GAME_VISUAL_STYLE.artStyle}`;
  }

  /**
   * Generate detailed video/cutscene prompt
   */
  static generateVideoPrompt(context: EntityContext): string {
    const { entityName, civilization, era = 'interstellar', mood = 'dramatic', setting = 'space' } = context;
    
    const civilizationPalette = civilization ? CIVILIZATION_PALETTES[civilization as keyof typeof CIVILIZATION_PALETTES] : '';
    const environmentSetting = ENVIRONMENT_SETTINGS[setting];
    
    return `${GAME_VISUAL_STYLE.baseStyle}, cinematic sequence: ${entityName}, ${environmentSetting}, ${civilizationPalette}, ${era} era technology and effects, ${mood} pacing and tension, dynamic camera movements, particle effects and energy signatures, character interactions and dialogue, ambient sound design elements, ${GAME_VISUAL_STYLE.lighting}, ${GAME_VISUAL_STYLE.composition}, ${GAME_VISUAL_STYLE.quality}, ${GAME_VISUAL_STYLE.artStyle}, 30 second duration, smooth transitions`;
  }

  /**
   * Generate prompt based on entity type
   */
  static generatePrompt(context: EntityContext): string {
    switch (context.entityType) {
      case 'character':
      case 'species':
        return this.generateCharacterPrompt(context);
      
      case 'planet':
      case 'environment':
        return this.generateEnvironmentPrompt(context);
      
      case 'spaceship':
      case 'unit':
        return this.generateVehiclePrompt(context);
      
      case 'city':
      case 'building':
        return this.generateCityPrompt(context);
      
      case 'cutscene':
      case 'effect':
        return this.generateVideoPrompt(context);
      
      default:
        return `${GAME_VISUAL_STYLE.baseStyle}, ${context.entityName}, space civilization game asset, ${GAME_VISUAL_STYLE.lighting}, ${GAME_VISUAL_STYLE.composition}, ${GAME_VISUAL_STYLE.quality}, ${GAME_VISUAL_STYLE.artStyle}`;
    }
  }

  /**
   * Get consistent style guide for asset type
   */
  static getStyleGuide(entityType: string): string {
    const guides = {
      character: "Consistent character design with recognizable features, clothing, and accessories that reflect their role and civilization",
      species: "Distinctive species characteristics that remain consistent across all representations, unique but believable alien features",
      planet: "Unique planetary features with consistent climate, terrain, and atmospheric conditions throughout all views",
      city: "Architectural style that reflects the civilization's culture and technology level, consistent building materials and design motifs",
      spaceship: "Technology level and design philosophy consistent with the civilization's aesthetic and capabilities",
      environment: "Consistent lighting, weather patterns, and environmental features that create a believable world"
    };
    
    return guides[entityType as keyof typeof guides] || "Maintain visual consistency with established game art style and lore";
  }

  /**
   * Generate variation prompts for the same entity
   */
  static generateVariations(baseContext: EntityContext, variationCount: number = 3): string[] {
    const variations = [];
    const moods = ['peaceful', 'tense', 'dramatic', 'mysterious', 'heroic'];
    const angles = ['front view', 'side profile', 'three-quarter view', 'dynamic angle', 'close-up'];
    
    for (let i = 0; i < variationCount; i++) {
      const variationContext = {
        ...baseContext,
        mood: moods[i % moods.length] as any,
      };
      
      let basePrompt = this.generatePrompt(variationContext);
      
      // Add variation-specific elements
      if (baseContext.entityType === 'character') {
        basePrompt += `, ${angles[i % angles.length]}`;
      }
      
      variations.push(basePrompt);
    }
    
    return variations;
  }
}

// Export commonly used prompt templates
export const PROMPT_TEMPLATES = {
  character: SpaceCivPromptGenerator.generateCharacterPrompt,
  environment: SpaceCivPromptGenerator.generateEnvironmentPrompt,
  vehicle: SpaceCivPromptGenerator.generateVehiclePrompt,
  city: SpaceCivPromptGenerator.generateCityPrompt,
  video: SpaceCivPromptGenerator.generateVideoPrompt
};

export default SpaceCivPromptGenerator;
