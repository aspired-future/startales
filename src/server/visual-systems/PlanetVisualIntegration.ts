/**
 * Planet Visual Integration - Hooks image generation into planet creation and management
 */

import { EntityVisualGenerator, EntityImageResult } from './EntityVisualGenerator';

export interface PlanetData {
  id: string | number;
  name: string;
  biome: string;
  gravity: number;
  systemId?: number;
  deposits?: Array<{ resource: string; richness: number }>;
  atmosphere?: string[];
  climate?: string;
  hazard?: string;
}

export class PlanetVisualIntegration {
  private visualGenerator: EntityVisualGenerator;
  private autoGenerateImages: boolean = true;

  constructor(visualGenerator?: EntityVisualGenerator) {
    this.visualGenerator = visualGenerator || new EntityVisualGenerator();
  }

  /**
   * Hook into planet creation to automatically generate images
   */
  async onPlanetCreated(planetData: PlanetData): Promise<EntityImageResult | null> {
    if (!this.autoGenerateImages) {
      return null;
    }

    try {
      console.log(`🌍 Generating image for planet: ${planetData.name}`);
      
      // Convert planet data to format expected by visual generator
      const visualData = {
        id: planetData.id.toString(),
        name: planetData.name,
        type: this.mapBiomeToType(planetData.biome),
        biome: planetData.biome,
        gravity: planetData.gravity,
        resources: planetData.deposits?.map(d => d.resource) || [],
        atmosphere: planetData.atmosphere || this.inferAtmosphere(planetData.biome),
        climate: planetData.climate || this.inferClimate(planetData.biome)
      };

      const result = await this.visualGenerator.generatePlanetImage(visualData);
      
      console.log(`✅ Generated image for planet ${planetData.name}: ${result.imageUrl}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Failed to generate image for planet ${planetData.name}:`, error);
      return null;
    }
  }

  /**
   * Queue planet image generation for batch processing
   */
  queuePlanetImageGeneration(planetData: PlanetData, priority: 'low' | 'medium' | 'high' = 'medium'): void {
    this.visualGenerator.queueImageGeneration({
      entityType: 'planet',
      entityId: planetData.id.toString(),
      entityData: {
        id: planetData.id.toString(),
        name: planetData.name,
        type: this.mapBiomeToType(planetData.biome),
        biome: planetData.biome,
        gravity: planetData.gravity,
        resources: planetData.deposits?.map(d => d.resource) || [],
        atmosphere: planetData.atmosphere || this.inferAtmosphere(planetData.biome),
        climate: planetData.climate || this.inferClimate(planetData.biome)
      },
      priority
    });
  }

  /**
   * Get generated image for a planet
   */
  getPlanetImage(planetId: string | number): EntityImageResult | undefined {
    return this.visualGenerator.getEntityImage(planetId.toString());
  }

  /**
   * Check if planet has generated image
   */
  hasPlanetImage(planetId: string | number): boolean {
    return this.visualGenerator.hasEntityImage(planetId.toString());
  }

  /**
   * Enable/disable automatic image generation
   */
  setAutoGenerate(enabled: boolean): void {
    this.autoGenerateImages = enabled;
  }

  /**
   * Map biome to planet type for better image generation
   */
  private mapBiomeToType(biome: string): string {
    const biomeTypeMap: { [key: string]: string } = {
      'Desert': 'desert',
      'Oceanic': 'ocean',
      'Ocean': 'ocean',
      'Jungle': 'forest',
      'Forest': 'forest',
      'Temperate': 'terrestrial',
      'Arctic': 'ice',
      'Ice': 'ice',
      'Volcanic': 'volcanic',
      'Barren': 'barren',
      'Swamp': 'swamp',
      'Savanna': 'grassland',
      'Tundra': 'tundra',
      'Continental': 'terrestrial',
      'Tropical': 'tropical'
    };

    return biomeTypeMap[biome] || 'terrestrial';
  }

  /**
   * Infer atmosphere composition from biome
   */
  private inferAtmosphere(biome: string): string[] {
    const atmosphereMap: { [key: string]: string[] } = {
      'Desert': ['nitrogen', 'oxygen', 'trace gases'],
      'Oceanic': ['nitrogen', 'oxygen', 'water vapor'],
      'Ocean': ['nitrogen', 'oxygen', 'water vapor'],
      'Jungle': ['nitrogen', 'oxygen', 'carbon dioxide'],
      'Forest': ['nitrogen', 'oxygen', 'carbon dioxide'],
      'Temperate': ['nitrogen', 'oxygen'],
      'Arctic': ['nitrogen', 'oxygen', 'argon'],
      'Ice': ['nitrogen', 'oxygen', 'argon'],
      'Volcanic': ['nitrogen', 'sulfur dioxide', 'carbon dioxide'],
      'Barren': ['carbon dioxide', 'nitrogen'],
      'Swamp': ['nitrogen', 'oxygen', 'methane'],
      'Savanna': ['nitrogen', 'oxygen'],
      'Tundra': ['nitrogen', 'oxygen', 'argon']
    };

    return atmosphereMap[biome] || ['nitrogen', 'oxygen'];
  }

  /**
   * Infer climate from biome
   */
  private inferClimate(biome: string): string {
    const climateMap: { [key: string]: string } = {
      'Desert': 'arid',
      'Oceanic': 'maritime',
      'Ocean': 'maritime',
      'Jungle': 'tropical',
      'Forest': 'temperate',
      'Temperate': 'temperate',
      'Arctic': 'polar',
      'Ice': 'polar',
      'Volcanic': 'volcanic',
      'Barren': 'harsh',
      'Swamp': 'humid',
      'Savanna': 'semi-arid',
      'Tundra': 'subarctic'
    };

    return climateMap[biome] || 'temperate';
  }
}

// Global instance for easy access
let globalPlanetVisualIntegration: PlanetVisualIntegration | null = null;

export function getPlanetVisualIntegration(): PlanetVisualIntegration {
  if (!globalPlanetVisualIntegration) {
    globalPlanetVisualIntegration = new PlanetVisualIntegration();
  }
  return globalPlanetVisualIntegration;
}

export function initializePlanetVisualIntegration(visualGenerator?: EntityVisualGenerator): PlanetVisualIntegration {
  globalPlanetVisualIntegration = new PlanetVisualIntegration(visualGenerator);
  return globalPlanetVisualIntegration;
}
