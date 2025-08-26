import { imageProviderRegistry } from './ImageGenerationProviderRegistry';
import { GoogleImagenProvider } from './providers/GoogleImagenProvider';
import { DallEProvider } from './providers/DallEProvider';
import { StableDiffusionProvider } from './providers/StableDiffusionProvider';
import { 
  ImageGenerationRequest, 
  ImageGenerationResponse, 
  ProviderStatus 
} from './interfaces/IImageGenerationProvider';

/**
 * Unified service for image generation that manages multiple providers
 * Provides a single interface for all image generation needs
 */
export class UnifiedImageGenerationService {
  private initialized: boolean = false;

  constructor() {
    this.initializeProviders();
  }

  /**
   * Initialize all available providers
   */
  private initializeProviders(): void {
    try {
      // Register Google Imagen
      const googleProvider = new GoogleImagenProvider();
      imageProviderRegistry.registerProvider('google-imagen', googleProvider);

      // Register DALL-E
      const dalleProvider = new DallEProvider();
      imageProviderRegistry.registerProvider('dall-e', dalleProvider);

      // Register Stable Diffusion
      const sdProvider = new StableDiffusionProvider();
      imageProviderRegistry.registerProvider('stable-diffusion', sdProvider);

      // Set up provider hierarchy based on availability
      this.setupProviderHierarchy();

      this.initialized = true;
      console.log('🎨 Unified Image Generation Service initialized with providers:', 
        imageProviderRegistry.getProviderNames().join(', '));
    } catch (error) {
      console.error('❌ Error initializing image generation providers:', error);
    }
  }

  /**
   * Set up provider hierarchy and fallbacks
   */
  private async setupProviderHierarchy(): Promise<void> {
    const statuses = await imageProviderRegistry.getAllProviderStatuses();
    
    // Find the best configured provider as primary
    let primaryProvider: string | null = null;
    const fallbacks: string[] = [];

    // Priority order: Google Imagen > DALL-E > Stable Diffusion
    const priorityOrder = ['google-imagen', 'dall-e', 'stable-diffusion'];
    
    for (const providerName of priorityOrder) {
      const status = statuses[providerName];
      if (status?.isConfigured && status.isAvailable) {
        if (!primaryProvider) {
          primaryProvider = providerName;
        } else {
          fallbacks.push(providerName);
        }
      }
    }

    if (primaryProvider) {
      imageProviderRegistry.setPrimaryProvider(primaryProvider);
      imageProviderRegistry.setFallbackProviders(fallbacks);
      console.log(`🎯 Primary provider: ${primaryProvider}, Fallbacks: ${fallbacks.join(', ')}`);
    } else {
      console.warn('⚠️ No configured providers found, using mock responses');
    }
  }

  /**
   * Generate a single image using the best available provider
   */
  async generateImage(
    request: ImageGenerationRequest, 
    preferredProvider?: string
  ): Promise<ImageGenerationResponse> {
    if (!this.initialized) {
      return {
        success: false,
        error: 'Service not initialized',
        metadata: {
          provider: 'unified-service',
          model: 'none',
          prompt: request.prompt,
          timestamp: new Date().toISOString(),
          aspectRatio: request.aspectRatio || '1:1',
          style: request.style || 'digital-art',
          quality: request.quality || 'standard',
          processingTimeMs: 0
        }
      };
    }

    return imageProviderRegistry.generateImage(request, preferredProvider);
  }

  /**
   * Generate multiple image variations
   */
  async generateVariations(
    request: ImageGenerationRequest, 
    count: number = 3,
    preferredProvider?: string
  ): Promise<ImageGenerationResponse> {
    if (!this.initialized) {
      return {
        success: false,
        error: 'Service not initialized',
        metadata: {
          provider: 'unified-service',
          model: 'none',
          prompt: request.prompt,
          timestamp: new Date().toISOString(),
          aspectRatio: request.aspectRatio || '1:1',
          style: request.style || 'digital-art',
          quality: request.quality || 'standard',
          processingTimeMs: 0
        }
      };
    }

    return imageProviderRegistry.generateVariations(request, count, preferredProvider);
  }

  /**
   * Generate image for a specific game entity
   */
  async generateGameEntityImage(
    entityType: 'planet' | 'character' | 'species' | 'civilization' | 'city' | 'logo' | 'flag' | 'building' | 'vehicle' | 'weapon',
    entityName: string,
    description: string,
    style: string = 'digital-art',
    preferredProvider?: string
  ): Promise<ImageGenerationResponse> {
    if (!this.initialized) {
      return {
        success: false,
        error: 'Service not initialized',
        metadata: {
          provider: 'unified-service',
          model: 'none',
          prompt: description,
          timestamp: new Date().toISOString(),
          aspectRatio: '1:1',
          style,
          quality: 'standard',
          processingTimeMs: 0
        }
      };
    }

    return imageProviderRegistry.generateGameEntityImage(
      entityType, 
      entityName, 
      description, 
      style, 
      preferredProvider
    );
  }

  /**
   * Get status of all providers
   */
  async getAllProviderStatuses(): Promise<Record<string, ProviderStatus>> {
    if (!this.initialized) {
      return {};
    }

    return imageProviderRegistry.getAllProviderStatuses();
  }

  /**
   * Get registry status
   */
  getRegistryStatus(): {
    totalProviders: number;
    availableProviders: string[];
    primaryProvider: string | null;
    fallbackProviders: string[];
    loadBalancingEnabled: boolean;
  } {
    if (!this.initialized) {
      return {
        totalProviders: 0,
        availableProviders: [],
        primaryProvider: null,
        fallbackProviders: [],
        loadBalancingEnabled: false
      };
    }

    return imageProviderRegistry.getRegistryStatus();
  }

  /**
   * Test all providers
   */
  async testAllProviders(): Promise<Record<string, ImageGenerationResponse>> {
    if (!this.initialized) {
      return {};
    }

    return imageProviderRegistry.testAllProviders();
  }

  /**
   * Test a specific provider
   */
  async testProvider(providerName: string): Promise<ImageGenerationResponse> {
    if (!this.initialized) {
      return {
        success: false,
        error: 'Service not initialized',
        metadata: {
          provider: providerName,
          model: 'none',
          prompt: 'test',
          timestamp: new Date().toISOString(),
          aspectRatio: '1:1',
          style: 'digital-art',
          quality: 'standard',
          processingTimeMs: 0
        }
      };
    }

    const provider = imageProviderRegistry.getProvider(providerName);
    if (!provider) {
      return {
        success: false,
        error: `Provider ${providerName} not found`,
        metadata: {
          provider: providerName,
          model: 'none',
          prompt: 'test',
          timestamp: new Date().toISOString(),
          aspectRatio: '1:1',
          style: 'digital-art',
          quality: 'standard',
          processingTimeMs: 0
        }
      };
    }

    return provider.testProvider();
  }

  /**
   * Set primary provider
   */
  setPrimaryProvider(providerName: string): boolean {
    if (!this.initialized) {
      return false;
    }

    return imageProviderRegistry.setPrimaryProvider(providerName);
  }

  /**
   * Set fallback providers
   */
  setFallbackProviders(providers: string[]): void {
    if (!this.initialized) {
      return;
    }

    imageProviderRegistry.setFallbackProviders(providers);
  }

  /**
   * Enable/disable load balancing
   */
  setLoadBalancing(enabled: boolean): void {
    if (!this.initialized) {
      return;
    }

    imageProviderRegistry.setLoadBalancing(enabled);
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders(): string[] {
    if (!this.initialized) {
      return [];
    }

    return imageProviderRegistry.getProviderNames();
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Reinitialize providers (useful for config changes)
   */
  async reinitialize(): Promise<void> {
    console.log('🔄 Reinitializing image generation service...');
    imageProviderRegistry.clearProviders();
    this.initialized = false;
    this.initializeProviders();
    await this.setupProviderHierarchy();
  }

  /**
   * Get provider recommendations based on request type
   */
  getProviderRecommendation(request: ImageGenerationRequest): string | null {
    const statuses = imageProviderRegistry.getRegistryStatus();
    
    // Recommend based on request characteristics
    if (request.negativePrompt || request.seed || request.steps) {
      // Stable Diffusion is best for advanced controls
      if (statuses.availableProviders.includes('stable-diffusion')) {
        return 'stable-diffusion';
      }
    }
    
    if (request.quality === 'hd' && request.style === 'photographic') {
      // DALL-E 3 is excellent for high-quality photographic images
      if (statuses.availableProviders.includes('dall-e')) {
        return 'dall-e';
      }
    }
    
    if (request.style === 'digital-art' || request.style === 'concept-art') {
      // Google Imagen is great for digital art
      if (statuses.availableProviders.includes('google-imagen')) {
        return 'google-imagen';
      }
    }
    
    // Return primary provider as fallback
    return statuses.primaryProvider;
  }
}

// Export singleton instance
export const unifiedImageService = new UnifiedImageGenerationService();
