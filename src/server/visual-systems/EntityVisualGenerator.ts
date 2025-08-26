/**
 * Entity Visual Generator - Automatic image generation for game entities
 * Integrates with VisualSystemsEngine to generate images for planets, cities, characters, species, and logos
 */

import { EventEmitter } from 'events';
import { VisualSystemsEngine } from './VisualSystemsEngine.js';
import { 
  VisualAssetType, 
  VisualCategory, 
  GenerationPrompt,
  GenerationOptions,
  GeneratedAsset 
} from './types.js';
import { ImageStorageService, getImageStorageService } from './ImageStorageService.js';

export interface EntityImageRequest {
  entityType: 'planet' | 'city' | 'character' | 'species' | 'logo' | 'civilization';
  entityId: string;
  entityData: any;
  priority?: 'low' | 'medium' | 'high';
  style?: 'realistic' | 'artistic' | 'cinematic' | 'technical';
}

export interface EntityImageResult {
  entityId: string;
  entityType: string;
  imageUrl: string;
  thumbnailUrl?: string;
  metadata: {
    generatedAt: Date;
    prompt: string;
    style: string;
    dimensions: { width: number; height: number };
    tags: string[];
  };
}

export class EntityVisualGenerator extends EventEmitter {
  private visualEngine: VisualSystemsEngine;
  private generationQueue: Map<string, EntityImageRequest> = new Map();
  private generatedImages: Map<string, EntityImageResult> = new Map();
  private isProcessing: boolean = false;
  private storageService: ImageStorageService | null = null;

  constructor(visualEngine?: VisualSystemsEngine, storageService?: ImageStorageService) {
    super();
    this.visualEngine = visualEngine || new VisualSystemsEngine();
    this.storageService = storageService || null;
  }

  /**
   * Set the image storage service
   */
  setStorageService(storageService: ImageStorageService): void {
    this.storageService = storageService;
  }

  /**
   * Generate image for a planet
   */
  async generatePlanetImage(planetData: {
    id: string;
    name: string;
    type?: string;
    biome?: string;
    atmosphere?: string[];
    climate?: string;
    gravity?: number;
    resources?: string[];
  }): Promise<EntityImageResult> {
    const prompt = this.buildPlanetPrompt(planetData);
    
    const generationPrompt: GenerationPrompt = {
      text: prompt,
      style: {
        artistic: 'SCI_FI',
        technical: {
          renderingEngine: 'PHOTOREALISTIC',
          quality: 'HIGH',
          optimization: 'STANDARD',
          format: 'PNG'
        },
        composition: {
          layout: 'CENTERED',
          framing: 'WIDE',
          perspective: 'ORBITAL',
          focus: 'SHARP',
          balance: 'SYMMETRICAL'
        },
        lighting: {
          type: 'NATURAL',
          direction: 'FRONT',
          intensity: 0.9,
          color: '#ffffff'
        }
      },
      mood: {
        emotional: 'AWE_INSPIRING',
        atmospheric: 'CLEAR',
        energy: 'MODERATE',
        tension: 'NONE'
      },
      details: [
        'high detail surface features',
        'realistic atmospheric effects',
        'space view perspective',
        'cinematic lighting'
      ],
      negativePrompts: [
        'blurry',
        'low quality',
        'distorted',
        'unrealistic colors'
      ]
    };

    const response = await this.visualEngine.createAsset(
      'IMAGE',
      'PLANET',
      generationPrompt,
      { priority: 'medium' }
    );

    const result: EntityImageResult = {
      entityId: planetData.id,
      entityType: 'planet',
      imageUrl: response.asset?.url || '',
      metadata: {
        generatedAt: new Date(),
        prompt,
        style: 'realistic',
        dimensions: { width: 1024, height: 1024 },
        tags: ['planet', planetData.biome || 'unknown', planetData.type || 'terrestrial']
      }
    };

    this.generatedImages.set(planetData.id, result);
    
    // Store in database if storage service is available
    await this.storeImageResult(result);
    
    this.emit('imageGenerated', result);
    
    return result;
  }

  /**
   * Generate image for a city
   */
  async generateCityImage(cityData: {
    id: string;
    name: string;
    population?: number;
    climate?: string;
    terrain?: string;
    specialization?: string;
    planet?: string;
    infrastructure?: any;
  }): Promise<EntityImageResult> {
    const prompt = this.buildCityPrompt(cityData);
    
    const generationPrompt: GenerationPrompt = {
      text: prompt,
      style: {
        artistic: 'SCI_FI',
        technical: {
          renderingEngine: 'PHOTOREALISTIC',
          quality: 'HIGH',
          optimization: 'STANDARD',
          format: 'PNG'
        },
        composition: {
          layout: 'CENTERED',
          framing: 'WIDE',
          perspective: 'AERIAL',
          focus: 'SHARP',
          balance: 'ASYMMETRICAL'
        }
      },
      mood: {
        emotional: 'BUSTLING',
        atmospheric: 'CLEAR',
        energy: 'HIGH',
        tension: 'NONE'
      }
    };

    const response = await this.visualEngine.createAsset(
      'IMAGE',
      'CITY',
      generationPrompt,
      { priority: 'medium' }
    );

    const result: EntityImageResult = {
      entityId: cityData.id,
      entityType: 'city',
      imageUrl: response.asset?.url || '',
      metadata: {
        generatedAt: new Date(),
        prompt,
        style: 'realistic',
        dimensions: { width: 1024, height: 1024 },
        tags: ['city', cityData.specialization || 'general', cityData.climate || 'temperate']
      }
    };

    this.generatedImages.set(cityData.id, result);
    
    // Store in database if storage service is available
    await this.storeImageResult(result);
    
    this.emit('imageGenerated', result);
    
    return result;
  }

  /**
   * Generate portrait for a character
   */
  async generateCharacterImage(characterData: {
    id: string;
    name: string;
    species?: string;
    role?: string;
    appearance?: any;
    personality?: any;
    profession?: any;
  }): Promise<EntityImageResult> {
    const prompt = this.buildCharacterPrompt(characterData);
    
    const generationPrompt: GenerationPrompt = {
      text: prompt,
      style: {
        artistic: 'SCI_FI',
        technical: {
          renderingEngine: 'PHOTOREALISTIC',
          quality: 'HIGH',
          optimization: 'STANDARD',
          format: 'PNG'
        },
        composition: {
          layout: 'CENTERED',
          framing: 'MEDIUM',
          perspective: 'THREE_QUARTER',
          focus: 'SHARP',
          balance: 'SYMMETRICAL'
        }
      },
      mood: {
        emotional: 'CONFIDENT',
        atmospheric: 'CLEAR',
        energy: 'MODERATE',
        tension: 'MILD'
      }
    };

    const response = await this.visualEngine.createAsset(
      'PORTRAIT',
      'CHARACTER',
      generationPrompt,
      { priority: 'high' }
    );

    const result: EntityImageResult = {
      entityId: characterData.id,
      entityType: 'character',
      imageUrl: response.asset?.url || '',
      metadata: {
        generatedAt: new Date(),
        prompt,
        style: 'realistic',
        dimensions: { width: 512, height: 512 },
        tags: ['character', characterData.species || 'human', characterData.role || 'citizen']
      }
    };

    this.generatedImages.set(characterData.id, result);
    
    // Store in database if storage service is available
    await this.storeImageResult(result);
    
    this.emit('imageGenerated', result);
    
    return result;
  }

  /**
   * Generate image for a species
   */
  async generateSpeciesImage(speciesData: {
    id: string;
    name: string;
    type?: string;
    physicalTraits?: any;
    culturalTraits?: any;
    homeworld?: string;
  }): Promise<EntityImageResult> {
    const prompt = this.buildSpeciesPrompt(speciesData);
    
    const generationPrompt: GenerationPrompt = {
      text: prompt,
      style: {
        artistic: 'SCI_FI',
        technical: {
          renderingEngine: 'PHOTOREALISTIC',
          quality: 'HIGH',
          optimization: 'STANDARD',
          format: 'PNG'
        },
        composition: {
          layout: 'CENTERED',
          framing: 'FULL',
          perspective: 'FRONT',
          focus: 'SHARP',
          balance: 'SYMMETRICAL'
        }
      }
    };

    const response = await this.visualEngine.createAsset(
      'IMAGE',
      'SPECIES',
      generationPrompt,
      { priority: 'medium' }
    );

    const result: EntityImageResult = {
      entityId: speciesData.id,
      entityType: 'species',
      imageUrl: response.asset?.url || '',
      metadata: {
        generatedAt: new Date(),
        prompt,
        style: 'realistic',
        dimensions: { width: 768, height: 1024 },
        tags: ['species', speciesData.type || 'humanoid', speciesData.name]
      }
    };

    this.generatedImages.set(speciesData.id, result);
    
    // Store in database if storage service is available
    await this.storeImageResult(result);
    
    this.emit('imageGenerated', result);
    
    return result;
  }

  /**
   * Generate logo for a civilization or organization
   */
  async generateLogoImage(logoData: {
    id: string;
    name: string;
    type: 'civilization' | 'organization' | 'corporation' | 'military';
    values?: string[];
    colors?: string[];
    symbols?: string[];
    style?: 'modern' | 'traditional' | 'futuristic' | 'military';
  }): Promise<EntityImageResult> {
    const prompt = this.buildLogoPrompt(logoData);
    
    const generationPrompt: GenerationPrompt = {
      text: prompt,
      style: {
        artistic: 'GRAPHIC_DESIGN',
        technical: {
          renderingEngine: 'VECTOR',
          quality: 'HIGH',
          optimization: 'STANDARD',
          format: 'PNG'
        },
        composition: {
          layout: 'CENTERED',
          framing: 'TIGHT',
          perspective: 'FRONT',
          focus: 'SHARP',
          balance: 'SYMMETRICAL'
        }
      }
    };

    const response = await this.visualEngine.createAsset(
      'LOGO',
      'LOGO',
      generationPrompt,
      { priority: 'low' }
    );

    const result: EntityImageResult = {
      entityId: logoData.id,
      entityType: 'logo',
      imageUrl: response.asset?.url || '',
      metadata: {
        generatedAt: new Date(),
        prompt,
        style: logoData.style || 'modern',
        dimensions: { width: 512, height: 512 },
        tags: ['logo', logoData.type, logoData.name]
      }
    };

    this.generatedImages.set(logoData.id, result);
    
    // Store in database if storage service is available
    await this.storeImageResult(result);
    
    this.emit('imageGenerated', result);
    
    return result;
  }

  /**
   * Get generated image for an entity
   */
  getEntityImage(entityId: string): EntityImageResult | undefined {
    return this.generatedImages.get(entityId);
  }

  /**
   * Check if entity has generated image
   */
  hasEntityImage(entityId: string): boolean {
    return this.generatedImages.has(entityId);
  }

  /**
   * Queue image generation for later processing
   */
  queueImageGeneration(request: EntityImageRequest): void {
    this.generationQueue.set(request.entityId, request);
    this.processQueue();
  }

  /**
   * Process queued image generation requests
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.generationQueue.size === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // Process high priority items first
      const requests = Array.from(this.generationQueue.values())
        .sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2);
        });

      for (const request of requests.slice(0, 5)) { // Process up to 5 at a time
        try {
          await this.generateEntityImage(request);
          this.generationQueue.delete(request.entityId);
        } catch (error) {
          console.error(`Failed to generate image for ${request.entityType} ${request.entityId}:`, error);
        }
      }
    } finally {
      this.isProcessing = false;
      
      // Continue processing if there are more items
      if (this.generationQueue.size > 0) {
        setTimeout(() => this.processQueue(), 1000);
      }
    }
  }

  /**
   * Generate image based on entity type
   */
  private async generateEntityImage(request: EntityImageRequest): Promise<EntityImageResult> {
    switch (request.entityType) {
      case 'planet':
        return this.generatePlanetImage(request.entityData);
      case 'city':
        return this.generateCityImage(request.entityData);
      case 'character':
        return this.generateCharacterImage(request.entityData);
      case 'species':
        return this.generateSpeciesImage(request.entityData);
      case 'logo':
      case 'civilization':
        return this.generateLogoImage(request.entityData);
      default:
        throw new Error(`Unsupported entity type: ${request.entityType}`);
    }
  }

  /**
   * Build prompt for planet image generation
   */
  private buildPlanetPrompt(planetData: any): string {
    const biome = planetData.biome || planetData.type || 'terrestrial';
    const atmosphere = planetData.atmosphere?.join(', ') || 'breathable atmosphere';
    const climate = planetData.climate || 'temperate';
    
    let prompt = `A stunning ${biome} planet named ${planetData.name} viewed from space, `;
    prompt += `${climate} climate with ${atmosphere}, `;
    prompt += `highly detailed surface features, realistic atmospheric effects, `;
    prompt += `cinematic space photography, 4K quality, photorealistic`;

    if (planetData.resources?.length > 0) {
      prompt += `, rich in ${planetData.resources.slice(0, 3).join(', ')}`;
    }

    return prompt;
  }

  /**
   * Build prompt for city image generation
   */
  private buildCityPrompt(cityData: any): string {
    const population = cityData.population || 1000000;
    const size = population > 5000000 ? 'massive metropolis' : 
                 population > 1000000 ? 'large city' : 
                 population > 100000 ? 'medium city' : 'small city';
    
    let prompt = `Aerial view of ${cityData.name}, a futuristic ${size} `;
    prompt += `on an alien planet, ${cityData.climate || 'temperate'} climate, `;
    prompt += `${cityData.terrain || 'plains'} terrain, `;
    
    if (cityData.specialization) {
      prompt += `specialized for ${cityData.specialization}, `;
    }
    
    prompt += `advanced architecture, bustling with activity, `;
    prompt += `sci-fi cityscape, highly detailed, cinematic lighting, 4K quality`;

    return prompt;
  }

  /**
   * Build prompt for character image generation
   */
  private buildCharacterPrompt(characterData: any): string {
    const species = characterData.species || 'human';
    const role = characterData.role || characterData.profession?.title || 'citizen';
    
    let prompt = `Professional portrait of a ${species} ${role} named ${characterData.name}, `;
    
    if (characterData.appearance) {
      if (characterData.appearance.age) {
        prompt += `${characterData.appearance.age} years old, `;
      }
      if (characterData.appearance.build) {
        prompt += `${characterData.appearance.build} build, `;
      }
      if (characterData.appearance.distinctive_features) {
        prompt += `${characterData.appearance.distinctive_features.join(', ')}, `;
      }
    }
    
    prompt += `confident expression, professional lighting, `;
    prompt += `high quality portrait photography, detailed facial features, `;
    prompt += `sci-fi character design, 4K quality`;

    return prompt;
  }

  /**
   * Build prompt for species image generation
   */
  private buildSpeciesPrompt(speciesData: any): string {
    const type = speciesData.type || 'humanoid';
    
    let prompt = `Full body illustration of a ${speciesData.name} species, ${type} alien race, `;
    
    if (speciesData.physicalTraits) {
      if (speciesData.physicalTraits.averageHeight) {
        prompt += `${speciesData.physicalTraits.averageHeight}m tall, `;
      }
      if (speciesData.physicalTraits.specialFeatures) {
        prompt += `${speciesData.physicalTraits.specialFeatures.slice(0, 3).join(', ')}, `;
      }
    }
    
    if (speciesData.culturalTraits?.values) {
      prompt += `embodying ${speciesData.culturalTraits.values.slice(0, 2).join(' and ')} values, `;
    }
    
    prompt += `detailed alien anatomy, sci-fi character design, `;
    prompt += `professional concept art, highly detailed, 4K quality`;

    return prompt;
  }

  /**
   * Build prompt for logo generation
   */
  private buildLogoPrompt(logoData: any): string {
    const style = logoData.style || 'modern';
    const type = logoData.type || 'organization';
    
    let prompt = `${style} logo design for ${logoData.name}, a ${type} `;
    
    if (logoData.values?.length > 0) {
      prompt += `representing ${logoData.values.slice(0, 2).join(' and ')}, `;
    }
    
    if (logoData.symbols?.length > 0) {
      prompt += `incorporating ${logoData.symbols.slice(0, 2).join(' and ')} symbols, `;
    }
    
    if (logoData.colors?.length > 0) {
      prompt += `using ${logoData.colors.slice(0, 3).join(', ')} colors, `;
    }
    
    prompt += `clean vector design, professional branding, `;
    prompt += `scalable logo, high contrast, minimalist design`;

    return prompt;
  }

  /**
   * Store image result in database
   */
  private async storeImageResult(result: EntityImageResult): Promise<void> {
    if (!this.storageService) {
      try {
        // Try to get storage service if not set
        this.storageService = getImageStorageService();
      } catch (error) {
        console.warn('Image storage service not available, skipping database storage');
        return;
      }
    }

    try {
      await this.storageService.storeImage(result);
    } catch (error) {
      console.error('Failed to store image in database:', error);
    }
  }

  /**
   * Get image from storage service
   */
  async getStoredImage(entityId: string, entityType: string): Promise<EntityImageResult | null> {
    if (!this.storageService) {
      return null;
    }

    try {
      const storedImage = await this.storageService.getImageByEntity(entityId, entityType);
      if (!storedImage) {
        return null;
      }

      return {
        entityId: storedImage.entityId,
        entityType: storedImage.entityType,
        imageUrl: storedImage.imageUrl,
        thumbnailUrl: storedImage.thumbnailUrl,
        metadata: storedImage.metadata
      };
    } catch (error) {
      console.error('Failed to get stored image:', error);
      return null;
    }
  }
}
