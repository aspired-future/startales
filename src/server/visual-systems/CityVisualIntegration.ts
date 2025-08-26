/**
 * City Visual Integration - Hooks image generation into city creation and management
 */

import { EntityVisualGenerator, EntityImageResult } from './EntityVisualGenerator.js';

export interface CityData {
  id: string;
  name: string;
  population?: number;
  climate?: string;
  terrain?: string;
  specialization?: string;
  planet?: string;
  coordinates?: { x: number; y: number };
  infrastructure?: any;
  founded?: Date;
  size?: string;
  economicOutput?: number;
}

export class CityVisualIntegration {
  private visualGenerator: EntityVisualGenerator;
  private autoGenerateImages: boolean = true;

  constructor(visualGenerator?: EntityVisualGenerator) {
    this.visualGenerator = visualGenerator || new EntityVisualGenerator();
  }

  /**
   * Hook into city creation to automatically generate images
   */
  async onCityCreated(cityData: CityData): Promise<EntityImageResult | null> {
    if (!this.autoGenerateImages) {
      return null;
    }

    try {
      console.log(`🏙️ Generating image for city: ${cityData.name}`);
      
      const result = await this.visualGenerator.generateCityImage(cityData);
      
      console.log(`✅ Generated image for city ${cityData.name}: ${result.imageUrl}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Failed to generate image for city ${cityData.name}:`, error);
      return null;
    }
  }

  /**
   * Queue city image generation for batch processing
   */
  queueCityImageGeneration(cityData: CityData, priority: 'low' | 'medium' | 'high' = 'medium'): void {
    this.visualGenerator.queueImageGeneration({
      entityType: 'city',
      entityId: cityData.id,
      entityData: cityData,
      priority
    });
  }

  /**
   * Get generated image for a city
   */
  getCityImage(cityId: string): EntityImageResult | undefined {
    return this.visualGenerator.getEntityImage(cityId);
  }

  /**
   * Check if city has generated image
   */
  hasCityImage(cityId: string): boolean {
    return this.visualGenerator.hasEntityImage(cityId);
  }

  /**
   * Enable/disable automatic image generation
   */
  setAutoGenerate(enabled: boolean): void {
    this.autoGenerateImages = enabled;
  }

  /**
   * Update city image when city data changes significantly
   */
  async onCityUpdated(cityData: CityData, significantChange: boolean = false): Promise<EntityImageResult | null> {
    if (!significantChange || !this.autoGenerateImages) {
      return null;
    }

    // Only regenerate if there's a significant change (population growth, specialization change, etc.)
    const existingImage = this.getCityImage(cityData.id);
    if (existingImage) {
      const daysSinceGeneration = (Date.now() - existingImage.metadata.generatedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceGeneration < 30) { // Don't regenerate if image is less than 30 days old
        return existingImage;
      }
    }

    return this.onCityCreated(cityData);
  }

  /**
   * Generate city image based on development stage
   */
  async generateCityImageByStage(cityData: CityData, stage: 'settlement' | 'town' | 'city' | 'metropolis'): Promise<EntityImageResult | null> {
    const stageData = {
      ...cityData,
      developmentStage: stage,
      population: this.getPopulationByStage(stage, cityData.population)
    };

    return this.onCityCreated(stageData);
  }

  /**
   * Get typical population for development stage
   */
  private getPopulationByStage(stage: string, currentPop?: number): number {
    if (currentPop) return currentPop;

    const stagePopulations = {
      settlement: 5000,
      town: 25000,
      city: 250000,
      metropolis: 2500000
    };

    return stagePopulations[stage as keyof typeof stagePopulations] || 100000;
  }
}

// Global instance for easy access
let globalCityVisualIntegration: CityVisualIntegration | null = null;

export function getCityVisualIntegration(): CityVisualIntegration {
  if (!globalCityVisualIntegration) {
    globalCityVisualIntegration = new CityVisualIntegration();
  }
  return globalCityVisualIntegration;
}

export function initializeCityVisualIntegration(visualGenerator?: EntityVisualGenerator): CityVisualIntegration {
  globalCityVisualIntegration = new CityVisualIntegration(visualGenerator);
  return globalCityVisualIntegration;
}
