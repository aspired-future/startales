/**
 * Character Visual Integration - Hooks image generation into character creation and management
 */

import { EntityVisualGenerator, EntityImageResult } from './EntityVisualGenerator.js';

export interface CharacterData {
  id: string;
  name: string | { full_display?: string; first?: string; last?: string };
  species?: string;
  role?: string;
  category?: string;
  subcategory?: string;
  appearance?: {
    age?: number;
    build?: string;
    height?: string;
    distinctive_features?: string[];
    clothing_style?: string;
    accessories?: string[];
  };
  personality?: {
    traits?: string[];
    temperament?: string;
    values?: string[];
  };
  profession?: {
    title?: string;
    department?: string;
    rank?: string;
    specialization?: string;
  };
  civilization_id?: number;
  planet_id?: number;
  city_id?: number;
}

export class CharacterVisualIntegration {
  private visualGenerator: EntityVisualGenerator;
  private autoGenerateImages: boolean = true;
  private generatedCharacters: Set<string> = new Set();

  constructor(visualGenerator?: EntityVisualGenerator) {
    this.visualGenerator = visualGenerator || new EntityVisualGenerator();
  }

  /**
   * Hook into character creation to automatically generate portraits
   */
  async onCharacterCreated(characterData: CharacterData): Promise<EntityImageResult | null> {
    if (!this.autoGenerateImages || this.generatedCharacters.has(characterData.id)) {
      return null;
    }

    try {
      console.log(`👤 Generating portrait for character: ${this.getCharacterDisplayName(characterData)}`);
      
      const visualData = this.prepareCharacterVisualData(characterData);
      const result = await this.visualGenerator.generateCharacterImage(visualData);
      
      this.generatedCharacters.add(characterData.id);
      console.log(`✅ Generated portrait for character ${this.getCharacterDisplayName(characterData)}: ${result.imageUrl}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Failed to generate portrait for character ${this.getCharacterDisplayName(characterData)}:`, error);
      return null;
    }
  }

  /**
   * Queue character image generation for batch processing
   */
  queueCharacterImageGeneration(characterData: CharacterData, priority: 'low' | 'medium' | 'high' = 'high'): void {
    if (this.generatedCharacters.has(characterData.id)) {
      return;
    }

    this.visualGenerator.queueImageGeneration({
      entityType: 'character',
      entityId: characterData.id,
      entityData: this.prepareCharacterVisualData(characterData),
      priority
    });

    this.generatedCharacters.add(characterData.id);
  }

  /**
   * Generate character image with specific expression or pose
   */
  async generateCharacterVariant(
    characterData: CharacterData, 
    variant: 'portrait' | 'action' | 'formal' | 'casual' = 'portrait'
  ): Promise<EntityImageResult | null> {
    try {
      const visualData = {
        ...this.prepareCharacterVisualData(characterData),
        variant
      };

      const result = await this.visualGenerator.generateCharacterImage(visualData);
      console.log(`✅ Generated ${variant} variant for character ${this.getCharacterDisplayName(characterData)}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Failed to generate ${variant} variant for character ${this.getCharacterDisplayName(characterData)}:`, error);
      return null;
    }
  }

  /**
   * Get generated image for a character
   */
  getCharacterImage(characterId: string): EntityImageResult | undefined {
    return this.visualGenerator.getEntityImage(characterId);
  }

  /**
   * Check if character has generated image
   */
  hasCharacterImage(characterId: string): boolean {
    return this.visualGenerator.hasEntityImage(characterId);
  }

  /**
   * Enable/disable automatic image generation
   */
  setAutoGenerate(enabled: boolean): void {
    this.autoGenerateImages = enabled;
  }

  /**
   * Batch generate images for multiple characters
   */
  async batchGenerateCharacterImages(characters: CharacterData[], maxConcurrent: number = 3): Promise<EntityImageResult[]> {
    const results: EntityImageResult[] = [];
    const batches = this.chunkArray(characters, maxConcurrent);

    for (const batch of batches) {
      const batchPromises = batch.map(character => this.onCharacterCreated(character));
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          results.push(result.value);
        } else {
          console.warn(`Failed to generate image for character ${batch[index].id}:`, result.status === 'rejected' ? result.reason : 'Unknown error');
        }
      });

      // Small delay between batches to avoid overwhelming the system
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return results;
  }

  /**
   * Prepare character data for visual generation
   */
  private prepareCharacterVisualData(characterData: CharacterData): any {
    return {
      id: characterData.id,
      name: this.getCharacterDisplayName(characterData),
      species: characterData.species || 'human',
      role: characterData.role || characterData.profession?.title || 'citizen',
      appearance: characterData.appearance,
      personality: characterData.personality,
      profession: characterData.profession
    };
  }

  /**
   * Get display name for character
   */
  private getCharacterDisplayName(characterData: CharacterData): string {
    if (typeof characterData.name === 'string') {
      return characterData.name;
    }
    
    if (characterData.name?.full_display) {
      return characterData.name.full_display;
    }
    
    if (characterData.name?.first && characterData.name?.last) {
      return `${characterData.name.first} ${characterData.name.last}`;
    }
    
    if (characterData.name?.first) {
      return characterData.name.first;
    }
    
    return 'Unknown Character';
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
   * Clear generated characters cache
   */
  clearGeneratedCache(): void {
    this.generatedCharacters.clear();
  }

  /**
   * Get generation statistics
   */
  getGenerationStats(): { totalGenerated: number; cacheSize: number } {
    return {
      totalGenerated: this.generatedCharacters.size,
      cacheSize: this.generatedCharacters.size
    };
  }
}

// Global instance for easy access
let globalCharacterVisualIntegration: CharacterVisualIntegration | null = null;

export function getCharacterVisualIntegration(): CharacterVisualIntegration {
  if (!globalCharacterVisualIntegration) {
    globalCharacterVisualIntegration = new CharacterVisualIntegration();
  }
  return globalCharacterVisualIntegration;
}

export function initializeCharacterVisualIntegration(visualGenerator?: EntityVisualGenerator): CharacterVisualIntegration {
  globalCharacterVisualIntegration = new CharacterVisualIntegration(visualGenerator);
  return globalCharacterVisualIntegration;
}
