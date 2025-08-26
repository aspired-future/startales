import { IImageGenerationProvider, ImageGenerationRequest, ImageGenerationResponse, ProviderStatus } from './interfaces/IImageGenerationProvider';

/**
 * Registry for managing multiple image generation providers
 * Supports provider switching, fallbacks, and load balancing
 */
export class ImageGenerationProviderRegistry {
  private providers: Map<string, IImageGenerationProvider> = new Map();
  private primaryProvider: string | null = null;
  private fallbackProviders: string[] = [];
  private loadBalancingEnabled: boolean = false;
  private currentProviderIndex: number = 0;

  /**
   * Register a new image generation provider
   */
  registerProvider(name: string, provider: IImageGenerationProvider): void {
    this.providers.set(name, provider);
    
    // Set as primary if it's the first provider
    if (!this.primaryProvider) {
      this.primaryProvider = name;
    }

    console.log(`🎨 Registered image generation provider: ${name}`);
  }

  /**
   * Unregister a provider
   */
  unregisterProvider(name: string): boolean {
    const removed = this.providers.delete(name);
    
    if (removed) {
      // Update primary provider if it was removed
      if (this.primaryProvider === name) {
        this.primaryProvider = this.providers.size > 0 ? Array.from(this.providers.keys())[0] : null;
      }
      
      // Remove from fallbacks
      this.fallbackProviders = this.fallbackProviders.filter(p => p !== name);
      
      console.log(`🗑️ Unregistered image generation provider: ${name}`);
    }
    
    return removed;
  }

  /**
   * Set the primary provider
   */
  setPrimaryProvider(name: string): boolean {
    if (this.providers.has(name)) {
      this.primaryProvider = name;
      console.log(`🎯 Set primary image generation provider: ${name}`);
      return true;
    }
    return false;
  }

  /**
   * Set fallback providers (in order of preference)
   */
  setFallbackProviders(providers: string[]): void {
    // Validate all providers exist
    const validProviders = providers.filter(name => this.providers.has(name));
    this.fallbackProviders = validProviders;
    console.log(`🔄 Set fallback providers: ${validProviders.join(', ')}`);
  }

  /**
   * Enable/disable load balancing across providers
   */
  setLoadBalancing(enabled: boolean): void {
    this.loadBalancingEnabled = enabled;
    console.log(`⚖️ Load balancing ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get a provider by name
   */
  getProvider(name: string): IImageGenerationProvider | null {
    return this.providers.get(name) || null;
  }

  /**
   * Get the current active provider (considering load balancing)
   */
  getActiveProvider(): IImageGenerationProvider | null {
    if (this.providers.size === 0) {
      return null;
    }

    if (this.loadBalancingEnabled) {
      return this.getLoadBalancedProvider();
    }

    if (this.primaryProvider && this.providers.has(this.primaryProvider)) {
      return this.providers.get(this.primaryProvider)!;
    }

    // Return first available provider
    return Array.from(this.providers.values())[0];
  }

  /**
   * Get provider using load balancing
   */
  private getLoadBalancedProvider(): IImageGenerationProvider {
    const providerNames = Array.from(this.providers.keys());
    const providerName = providerNames[this.currentProviderIndex % providerNames.length];
    this.currentProviderIndex++;
    return this.providers.get(providerName)!;
  }

  /**
   * Generate image with automatic fallback
   */
  async generateImage(request: ImageGenerationRequest, preferredProvider?: string): Promise<ImageGenerationResponse> {
    const startTime = Date.now();
    
    // Try preferred provider first
    if (preferredProvider && this.providers.has(preferredProvider)) {
      try {
        const provider = this.providers.get(preferredProvider)!;
        const response = await provider.generateImage(request);
        if (response.success) {
          return response;
        }
        console.warn(`⚠️ Preferred provider ${preferredProvider} failed: ${response.error}`);
      } catch (error) {
        console.warn(`⚠️ Preferred provider ${preferredProvider} error:`, error);
      }
    }

    // Try primary provider
    const primaryProvider = this.getActiveProvider();
    if (primaryProvider) {
      try {
        const response = await primaryProvider.generateImage(request);
        if (response.success) {
          return response;
        }
        console.warn(`⚠️ Primary provider failed: ${response.error}`);
      } catch (error) {
        console.warn(`⚠️ Primary provider error:`, error);
      }
    }

    // Try fallback providers
    for (const fallbackName of this.fallbackProviders) {
      const fallbackProvider = this.providers.get(fallbackName);
      if (fallbackProvider) {
        try {
          console.log(`🔄 Trying fallback provider: ${fallbackName}`);
          const response = await fallbackProvider.generateImage(request);
          if (response.success) {
            return response;
          }
          console.warn(`⚠️ Fallback provider ${fallbackName} failed: ${response.error}`);
        } catch (error) {
          console.warn(`⚠️ Fallback provider ${fallbackName} error:`, error);
        }
      }
    }

    // All providers failed
    const processingTime = Date.now() - startTime;
    return {
      success: false,
      error: 'All image generation providers failed',
      metadata: {
        provider: 'registry',
        model: 'fallback',
        prompt: request.prompt,
        timestamp: new Date().toISOString(),
        aspectRatio: request.aspectRatio || '1:1',
        style: request.style || 'digital-art',
        quality: request.quality || 'standard',
        processingTimeMs: processingTime
      }
    };
  }

  /**
   * Generate variations with automatic fallback
   */
  async generateVariations(request: ImageGenerationRequest, count: number, preferredProvider?: string): Promise<ImageGenerationResponse> {
    const provider = preferredProvider ? this.getProvider(preferredProvider) : this.getActiveProvider();
    
    if (!provider) {
      return {
        success: false,
        error: 'No image generation providers available',
        metadata: {
          provider: 'registry',
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

    return provider.generateVariations(request, count);
  }

  /**
   * Generate game entity image with automatic fallback
   */
  async generateGameEntityImage(
    entityType: 'planet' | 'character' | 'species' | 'civilization' | 'city' | 'logo' | 'flag' | 'building' | 'vehicle' | 'weapon',
    entityName: string,
    description: string,
    style?: string,
    preferredProvider?: string
  ): Promise<ImageGenerationResponse> {
    const provider = preferredProvider ? this.getProvider(preferredProvider) : this.getActiveProvider();
    
    if (!provider) {
      return {
        success: false,
        error: 'No image generation providers available',
        metadata: {
          provider: 'registry',
          model: 'none',
          prompt: description,
          timestamp: new Date().toISOString(),
          aspectRatio: '1:1',
          style: style || 'digital-art',
          quality: 'standard',
          processingTimeMs: 0
        }
      };
    }

    return provider.generateGameEntityImage(entityType, entityName, description, style);
  }

  /**
   * Get status of all providers
   */
  async getAllProviderStatuses(): Promise<Record<string, ProviderStatus>> {
    const statuses: Record<string, ProviderStatus> = {};
    
    for (const [name, provider] of this.providers) {
      try {
        statuses[name] = await provider.getStatus();
      } catch (error) {
        statuses[name] = {
          isAvailable: false,
          isConfigured: false,
          apiKeyPresent: false,
          model: 'unknown',
          lastError: error instanceof Error ? error.message : 'Unknown error',
          capabilities: {
            supportedAspectRatios: [],
            supportedStyles: [],
            supportedQualities: [],
            maxWidth: 0,
            maxHeight: 0,
            supportsNegativePrompt: false,
            supportsSeed: false,
            supportsSteps: false,
            supportsGuidanceScale: false,
            supportsBatchGeneration: false,
            maxBatchSize: 1,
            supportsInpainting: false,
            supportsOutpainting: false,
            supportsImageToImage: false,
            supportsUpscaling: false
          }
        };
      }
    }
    
    return statuses;
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
    return {
      totalProviders: this.providers.size,
      availableProviders: Array.from(this.providers.keys()),
      primaryProvider: this.primaryProvider,
      fallbackProviders: this.fallbackProviders,
      loadBalancingEnabled: this.loadBalancingEnabled
    };
  }

  /**
   * Test all providers
   */
  async testAllProviders(): Promise<Record<string, ImageGenerationResponse>> {
    const results: Record<string, ImageGenerationResponse> = {};
    
    for (const [name, provider] of this.providers) {
      try {
        console.log(`🧪 Testing provider: ${name}`);
        results[name] = await provider.testProvider();
      } catch (error) {
        results[name] = {
          success: false,
          error: error instanceof Error ? error.message : 'Test failed',
          metadata: {
            provider: name,
            model: 'test',
            prompt: 'test',
            timestamp: new Date().toISOString(),
            aspectRatio: '1:1',
            style: 'digital-art',
            quality: 'standard',
            processingTimeMs: 0
          }
        };
      }
    }
    
    return results;
  }

  /**
   * Get list of all registered providers
   */
  getProviderNames(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Check if any providers are available
   */
  hasProviders(): boolean {
    return this.providers.size > 0;
  }

  /**
   * Clear all providers
   */
  clearProviders(): void {
    this.providers.clear();
    this.primaryProvider = null;
    this.fallbackProviders = [];
    this.currentProviderIndex = 0;
    console.log('🧹 Cleared all image generation providers');
  }
}

// Export singleton instance
export const imageProviderRegistry = new ImageGenerationProviderRegistry();
