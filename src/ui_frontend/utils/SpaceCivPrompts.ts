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
  baseStyle: "epic space fantasy concept art, fantastical galactic civilization, otherworldly and imaginative, digital art masterpiece",
  lighting: "ethereal cosmic lighting with mystical energy auras, stellar phenomena, and magical particle effects",
  composition: "cinematic space opera composition with sweeping galactic vistas and dramatic scale",
  quality: "ultra-high quality digital art, vibrant colors, stunning visual effects, masterful detail",
  artStyle: "space age fantasy aesthetic, mystical technology, crystalline structures, energy-based designs, cosmic magic"
};

// Color palettes for different civilizations
const CIVILIZATION_PALETTES = {
  'Terran Federation': 'brilliant azure and prismatic silver, crystalline energy conduits, floating holographic mandalas',
  'Zephyrian Empire': 'royal amethyst and liquid gold, living crystal formations, pulsing energy webs',
  'Centauri Republic': 'emerald starlight and molten copper, bio-luminescent tree cities, symbiotic energy networks',
  'Vegan Collective': 'sunset plasma and cosmic bronze, organic crystal spires, living light architecture',
  'Sirian Empire': 'crimson void and obsidian steel, angular energy blades, weapon-crystal arrays',
  'Kepler Technocracy': 'pure starlight and electric cyan, floating crystal laboratories, sentient AI light-forms',
  'Andromeda Empire': 'deep cosmos purple and astral silver, ancient floating megaliths, time-worn energy matrices',
  'Orion Collective': 'rainbow nebula energies, multi-dimensional crystal harmonics, unified consciousness light-streams'
};

// Environmental settings for consistency
const ENVIRONMENT_SETTINGS = {
  space: "mystical cosmic void with swirling galaxies, ethereal nebulae, floating crystal asteroids, and dimensional portals",
  planet_surface: "fantastical alien worlds with floating landmasses, crystal forests, energy geysers, and magical atmospheric phenomena",
  city: "magnificent crystal spire cities with floating platforms, energy bridges, levitating vehicles, and holographic constellation displays",
  ship_interior: "mystical starship interiors with crystalline control matrices, energy conduit walls, and cosmic viewing chambers",
  station: "colossal space citadels with rotating crystal rings, energy docking arrays, and defensive light-barrier systems",
  void: "enigmatic dimensional rifts with swirling energy storms, reality distortions, and ancient cosmic artifacts"
};

// Species-specific characteristics for consistency
const SPECIES_TRAITS = {
  human: "evolved human forms with stellar energy tattoos, cosmic awareness eyes, flowing star-cloth garments with energy patterns",
  zephyrian: "majestic crystal-born beings with prismatic skin, galaxy-swirl eyes, ethereal robes woven from pure light",
  centaurian: "tree-spirit humanoids with living bark skin, bioluminescent veins, symbiotic crystal-tech integration",
  vegan: "elegant insectoid mystics with iridescent carapaces, multifaceted gem eyes, ceremonial energy-armor",
  sirian: "draconic warrior-mages with scaled energy skin, flame-bright eyes, mystical battle regalia and crystal weapons",
  kepler: "transcendent techno-mystics with living metal implants, neural-light interfaces, robes of pure energy",
  andromedan: "ancient star-born entities with translucent energy bodies, cosmic-void eyes, flowing dimensional cloaks",
  orion: "harmonious collective beings with adaptive energy forms, rainbow-spectrum features, unity-crystal accessories"
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
    
    return `${GAME_VISUAL_STYLE.baseStyle}, ${entityName} mystical starcraft, ${civilizationPalette}, ${era} era crystal-tech and energy design, ${mood} presence in cosmic void, ethereal propulsion systems, energy weapon arrays, shimmering force barriers, intricate crystal hull patterns and glowing runes, ${ENVIRONMENT_SETTINGS.space}, ${GAME_VISUAL_STYLE.lighting}, ${GAME_VISUAL_STYLE.composition}, ${GAME_VISUAL_STYLE.quality}, ${GAME_VISUAL_STYLE.artStyle}`;
  }

  /**
   * Generate detailed city/structure prompt
   */
  static generateCityPrompt(context: EntityContext): string {
    const { entityName, civilization = 'Terran Federation', era = 'interstellar', mood = 'peaceful' } = context;
    
    const civilizationPalette = CIVILIZATION_PALETTES[civilization as keyof typeof CIVILIZATION_PALETTES] || CIVILIZATION_PALETTES['Terran Federation'];
    
    return `${GAME_VISUAL_STYLE.baseStyle}, ${entityName} crystal metropolis, ${civilizationPalette}, ${era} era mystical architecture and energy infrastructure, ${mood} atmosphere, soaring crystal spires and floating megastructures, levitating vehicles and energy transport streams, holographic constellation displays and light-advertisements, diverse galactic population and mystical activity, ${GAME_VISUAL_STYLE.lighting}, ${GAME_VISUAL_STYLE.composition}, ${GAME_VISUAL_STYLE.quality}, ${GAME_VISUAL_STYLE.artStyle}`;
  }

  /**
   * Generate detailed video/cutscene prompt
   */
  static generateVideoPrompt(context: EntityContext): string {
    const { entityName, civilization, era = 'interstellar', mood = 'dramatic', setting = 'space' } = context;
    
    const civilizationPalette = civilization ? CIVILIZATION_PALETTES[civilization as keyof typeof CIVILIZATION_PALETTES] : '';
    const environmentSetting = ENVIRONMENT_SETTINGS[setting];
    
    return `${GAME_VISUAL_STYLE.baseStyle}, epic cinematic sequence: ${entityName}, ${environmentSetting}, ${civilizationPalette}, ${era} era mystical technology and magical effects, ${mood} pacing and cosmic tension, sweeping camera movements through space, ethereal particle effects and energy signatures, character interactions with mystical dialogue, ambient cosmic soundscape elements, ${GAME_VISUAL_STYLE.lighting}, ${GAME_VISUAL_STYLE.composition}, ${GAME_VISUAL_STYLE.quality}, ${GAME_VISUAL_STYLE.artStyle}, 30 second duration, seamless magical transitions`;
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
        return `${GAME_VISUAL_STYLE.baseStyle}, ${context.entityName}, mystical galactic civilization game asset, ${GAME_VISUAL_STYLE.lighting}, ${GAME_VISUAL_STYLE.composition}, ${GAME_VISUAL_STYLE.quality}, ${GAME_VISUAL_STYLE.artStyle}`;
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
