/**
 * Species Visual Integration - Hooks image generation into species/race creation and management
 */

import { EntityVisualGenerator, EntityImageResult } from './EntityVisualGenerator.js';

export interface SpeciesData {
  id: string;
  name: string;
  type?: string;
  origin?: string;
  physicalTraits?: {
    averageHeight?: number;
    averageLifespan?: number;
    bodyType?: string;
    specialFeatures?: string[];
    environmentalNeeds?: string[];
  };
  mentalTraits?: {
    intelligence?: number;
    emotionalRange?: number;
    psychicAbilities?: boolean;
    collectiveMind?: boolean;
    memoryType?: string;
  };
  culturalTraits?: {
    socialStructure?: string;
    values?: string[];
    taboos?: string[];
    artForms?: string[];
    philosophy?: string;
  };
  technologicalLevel?: {
    overall?: number;
    specializations?: { [field: string]: number };
    uniqueTechnologies?: string[];
  };
  biologicalNeeds?: {
    atmosphere?: string[];
    temperature?: { min: number; max: number };
    gravity?: { min: number; max: number };
    radiation?: string;
    diet?: string;
  };
  homeworld?: string;
}

export class SpeciesVisualIntegration {
  private visualGenerator: EntityVisualGenerator;
  private autoGenerateImages: boolean = true;
  private generatedSpecies: Set<string> = new Set();

  constructor(visualGenerator?: EntityVisualGenerator) {
    this.visualGenerator = visualGenerator || new EntityVisualGenerator();
  }

  /**
   * Hook into species creation to automatically generate images
   */
  async onSpeciesCreated(speciesData: SpeciesData): Promise<EntityImageResult | null> {
    if (!this.autoGenerateImages || this.generatedSpecies.has(speciesData.id)) {
      return null;
    }

    try {
      console.log(`🧬 Generating image for species: ${speciesData.name}`);
      
      const result = await this.visualGenerator.generateSpeciesImage(speciesData);
      
      this.generatedSpecies.add(speciesData.id);
      console.log(`✅ Generated image for species ${speciesData.name}: ${result.imageUrl}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Failed to generate image for species ${speciesData.name}:`, error);
      return null;
    }
  }

  /**
   * Queue species image generation for batch processing
   */
  queueSpeciesImageGeneration(speciesData: SpeciesData, priority: 'low' | 'medium' | 'high' = 'medium'): void {
    if (this.generatedSpecies.has(speciesData.id)) {
      return;
    }

    this.visualGenerator.queueImageGeneration({
      entityType: 'species',
      entityId: speciesData.id,
      entityData: speciesData,
      priority
    });

    this.generatedSpecies.add(speciesData.id);
  }

  /**
   * Generate species template image (for character generation reference)
   */
  async generateSpeciesTemplate(speciesData: SpeciesData): Promise<EntityImageResult | null> {
    try {
      const templateData = {
        ...speciesData,
        isTemplate: true,
        name: `${speciesData.name} Template`
      };

      const result = await this.visualGenerator.generateSpeciesImage(templateData);
      console.log(`✅ Generated template for species ${speciesData.name}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Failed to generate template for species ${speciesData.name}:`, error);
      return null;
    }
  }

  /**
   * Generate species variants (male, female, different age groups, etc.)
   */
  async generateSpeciesVariants(
    speciesData: SpeciesData, 
    variants: string[] = ['male', 'female', 'elder', 'youth']
  ): Promise<EntityImageResult[]> {
    const results: EntityImageResult[] = [];

    for (const variant of variants) {
      try {
        const variantData = {
          ...speciesData,
          id: `${speciesData.id}_${variant}`,
          name: `${speciesData.name} (${variant})`,
          variant
        };

        const result = await this.visualGenerator.generateSpeciesImage(variantData);
        if (result) {
          results.push(result);
        }
      } catch (error) {
        console.error(`❌ Failed to generate ${variant} variant for species ${speciesData.name}:`, error);
      }
    }

    return results;
  }

  /**
   * Get generated image for a species
   */
  getSpeciesImage(speciesId: string): EntityImageResult | undefined {
    return this.visualGenerator.getEntityImage(speciesId);
  }

  /**
   * Check if species has generated image
   */
  hasSpeciesImage(speciesId: string): boolean {
    return this.visualGenerator.hasEntityImage(speciesId);
  }

  /**
   * Enable/disable automatic image generation
   */
  setAutoGenerate(enabled: boolean): void {
    this.autoGenerateImages = enabled;
  }

  /**
   * Batch generate images for multiple species
   */
  async batchGenerateSpeciesImages(species: SpeciesData[], maxConcurrent: number = 2): Promise<EntityImageResult[]> {
    const results: EntityImageResult[] = [];
    const batches = this.chunkArray(species, maxConcurrent);

    for (const batch of batches) {
      const batchPromises = batch.map(speciesData => this.onSpeciesCreated(speciesData));
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          results.push(result.value);
        } else {
          console.warn(`Failed to generate image for species ${batch[index].id}:`, result.status === 'rejected' ? result.reason : 'Unknown error');
        }
      });

      // Delay between batches to avoid overwhelming the system
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    return results;
  }

  /**
   * Generate evolutionary stages for a species
   */
  async generateEvolutionaryStages(
    speciesData: SpeciesData,
    stages: string[] = ['primitive', 'developing', 'advanced', 'transcendent']
  ): Promise<EntityImageResult[]> {
    const results: EntityImageResult[] = [];

    for (const stage of stages) {
      try {
        const stageData = {
          ...speciesData,
          id: `${speciesData.id}_${stage}`,
          name: `${speciesData.name} (${stage})`,
          evolutionaryStage: stage,
          technologicalLevel: {
            ...speciesData.technologicalLevel,
            overall: this.getTechLevelByStage(stage)
          }
        };

        const result = await this.visualGenerator.generateSpeciesImage(stageData);
        if (result) {
          results.push(result);
        }
      } catch (error) {
        console.error(`❌ Failed to generate ${stage} stage for species ${speciesData.name}:`, error);
      }
    }

    return results;
  }

  /**
   * Get technology level by evolutionary stage
   */
  private getTechLevelByStage(stage: string): number {
    const stageLevels = {
      primitive: 2,
      developing: 4,
      advanced: 7,
      transcendent: 10
    };

    return stageLevels[stage as keyof typeof stageLevels] || 5;
  }

  /**
   * Chunk array into smaller arrays
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Clear generated species cache
   */
  clearGeneratedCache(): void {
    this.generatedSpecies.clear();
  }

  /**
   * Get generation statistics
   */
  getGenerationStats(): { totalGenerated: number; cacheSize: number } {
    return {
      totalGenerated: this.generatedSpecies.size,
      cacheSize: this.generatedSpecies.size
    };
  }

  /**
   * Generate species comparison image (multiple species side by side)
   */
  async generateSpeciesComparison(speciesData: SpeciesData[], title: string = 'Species Comparison'): Promise<EntityImageResult | null> {
    if (speciesData.length < 2) {
      console.warn('Need at least 2 species for comparison');
      return null;
    }

    try {
      const comparisonData = {
        id: `comparison_${speciesData.map(s => s.id).join('_')}`,
        name: title,
        type: 'comparison',
        species: speciesData.slice(0, 4), // Limit to 4 species for visual clarity
        comparisonType: 'side_by_side'
      };

      // Use the species generator but with comparison prompt
      const result = await this.visualGenerator.generateSpeciesImage(comparisonData);
      console.log(`✅ Generated species comparison: ${title}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Failed to generate species comparison: ${title}:`, error);
      return null;
    }
  }
}

// Global instance for easy access
let globalSpeciesVisualIntegration: SpeciesVisualIntegration | null = null;

export function getSpeciesVisualIntegration(): SpeciesVisualIntegration {
  if (!globalSpeciesVisualIntegration) {
    globalSpeciesVisualIntegration = new SpeciesVisualIntegration();
  }
  return globalSpeciesVisualIntegration;
}

export function initializeSpeciesVisualIntegration(visualGenerator?: EntityVisualGenerator): SpeciesVisualIntegration {
  globalSpeciesVisualIntegration = new SpeciesVisualIntegration(visualGenerator);
  return globalSpeciesVisualIntegration;
}
