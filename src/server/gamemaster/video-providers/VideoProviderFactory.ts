import { IVideoProvider, IVideoProviderFactory, VideoProviderCapabilities, VideoProviderConfig } from './IVideoProvider.js';
import { VEO3Provider } from './VEO3Provider.js';
import { RunwayProvider } from './RunwayProvider.js';
import { PikaProvider } from './PikaProvider.js';

/**
 * Factory for creating video generation providers
 */
export class VideoProviderFactory implements IVideoProviderFactory {
  private static instance: VideoProviderFactory;
  private providers: Map<string, typeof IVideoProvider> = new Map();
  private providerInstances: Map<string, IVideoProvider> = new Map();

  constructor() {
    this.registerDefaultProviders();
  }

  static getInstance(): VideoProviderFactory {
    if (!VideoProviderFactory.instance) {
      VideoProviderFactory.instance = new VideoProviderFactory();
    }
    return VideoProviderFactory.instance;
  }

  private registerDefaultProviders(): void {
    this.providers.set('veo3', VEO3Provider as any);
    this.providers.set('runway', RunwayProvider as any);
    this.providers.set('pika', PikaProvider as any);
  }

  createProvider(providerName: string, config: VideoProviderConfig): IVideoProvider {
    const ProviderClass = this.providers.get(providerName.toLowerCase());
    
    if (!ProviderClass) {
      throw new Error(`Unknown video provider: ${providerName}. Available providers: ${this.getSupportedProviders().join(', ')}`);
    }

    // Cache provider instances by name + config hash
    const configHash = this.hashConfig(config);
    const instanceKey = `${providerName}-${configHash}`;
    
    if (!this.providerInstances.has(instanceKey)) {
      this.providerInstances.set(instanceKey, new ProviderClass(config));
    }

    return this.providerInstances.get(instanceKey)!;
  }

  getSupportedProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  getProviderInfo(providerName: string): VideoProviderCapabilities | null {
    try {
      const provider = this.createProvider(providerName, {});
      return provider.getCapabilities();
    } catch {
      return null;
    }
  }

  registerProvider(name: string, providerClass: typeof IVideoProvider): void {
    this.providers.set(name.toLowerCase(), providerClass);
  }

  private hashConfig(config: VideoProviderConfig): string {
    // Simple hash of config for caching
    return Buffer.from(JSON.stringify(config)).toString('base64').substring(0, 8);
  }
}

/**
 * Multi-provider video generation manager
 */
export class VideoProviderManager {
  private factory: VideoProviderFactory;
  private primaryProvider: string;
  private fallbackProviders: string[];
  private providerConfigs: Map<string, VideoProviderConfig> = new Map();

  constructor(
    primaryProvider: string = 'veo3',
    fallbackProviders: string[] = ['runway', 'pika']
  ) {
    this.factory = VideoProviderFactory.getInstance();
    this.primaryProvider = primaryProvider;
    this.fallbackProviders = fallbackProviders;
  }

  setProviderConfig(providerName: string, config: VideoProviderConfig): void {
    this.providerConfigs.set(providerName, config);
  }

  async generateVideo(request: any): Promise<any> {
    const providers = [this.primaryProvider, ...this.fallbackProviders];
    
    for (const providerName of providers) {
      try {
        const config = this.providerConfigs.get(providerName) || {};
        const provider = this.factory.createProvider(providerName, config);
        
        // Check if provider is available
        if (!(await provider.isAvailable())) {
          console.warn(`Provider ${providerName} is not available, trying next...`);
          continue;
        }

        console.log(`🎬 Attempting video generation with ${providerName}`);
        const result = await provider.generateVideo(request);
        
        if (result.status !== 'failed') {
          console.log(`✅ Video generation successful with ${providerName}`);
          return { ...result, provider: providerName };
        }
        
        console.warn(`Provider ${providerName} failed, trying next...`);
        
      } catch (error) {
        console.error(`Provider ${providerName} error:`, error);
        continue;
      }
    }

    throw new Error('All video providers failed to generate video');
  }

  async checkStatus(videoId: string, providerName?: string): Promise<any> {
    if (providerName) {
      const config = this.providerConfigs.get(providerName) || {};
      const provider = this.factory.createProvider(providerName, config);
      return provider.checkStatus(videoId);
    }

    // If no provider specified, try to determine from videoId
    const detectedProvider = this.detectProviderFromVideoId(videoId);
    if (detectedProvider) {
      const config = this.providerConfigs.get(detectedProvider) || {};
      const provider = this.factory.createProvider(detectedProvider, config);
      return provider.checkStatus(videoId);
    }

    throw new Error('Cannot determine provider for video ID');
  }

  async cancelGeneration(videoId: string, providerName?: string): Promise<boolean> {
    if (providerName) {
      const config = this.providerConfigs.get(providerName) || {};
      const provider = this.factory.createProvider(providerName, config);
      return provider.cancelGeneration(videoId);
    }

    const detectedProvider = this.detectProviderFromVideoId(videoId);
    if (detectedProvider) {
      const config = this.providerConfigs.get(detectedProvider) || {};
      const provider = this.factory.createProvider(detectedProvider, config);
      return provider.cancelGeneration(videoId);
    }

    return false;
  }

  getAllProviderCapabilities(): Record<string, VideoProviderCapabilities> {
    const capabilities: Record<string, VideoProviderCapabilities> = {};
    
    for (const providerName of this.factory.getSupportedProviders()) {
      const info = this.factory.getProviderInfo(providerName);
      if (info) {
        capabilities[providerName] = info;
      }
    }
    
    return capabilities;
  }

  async getProviderStatus(): Promise<Record<string, { available: boolean; metrics?: any }>> {
    const status: Record<string, { available: boolean; metrics?: any }> = {};
    
    for (const providerName of this.factory.getSupportedProviders()) {
      try {
        const config = this.providerConfigs.get(providerName) || {};
        const provider = this.factory.createProvider(providerName, config);
        
        status[providerName] = {
          available: await provider.isAvailable(),
          metrics: provider.getMetrics()
        };
      } catch (error) {
        status[providerName] = {
          available: false
        };
      }
    }
    
    return status;
  }

  setBestProvider(criteria: 'speed' | 'quality' | 'cost' = 'quality'): void {
    const capabilities = this.getAllProviderCapabilities();
    
    let bestProvider = this.primaryProvider;
    let bestScore = 0;
    
    for (const [name, caps] of Object.entries(capabilities)) {
      let score = 0;
      
      switch (criteria) {
        case 'speed':
          score = caps.averageGenerationTime ? 1000 / caps.averageGenerationTime : 0;
          break;
        case 'quality':
          score = caps.maxDuration * (caps.supportedResolutions.length * 10);
          break;
        case 'cost':
          score = caps.costPerSecond ? 100 / caps.costPerSecond : 0;
          break;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestProvider = name;
      }
    }
    
    this.primaryProvider = bestProvider;
    console.log(`🎬 Best provider for ${criteria}: ${bestProvider}`);
  }

  private detectProviderFromVideoId(videoId: string): string | null {
    if (videoId.startsWith('veo3_')) return 'veo3';
    if (videoId.startsWith('runway_')) return 'runway';
    if (videoId.startsWith('pika_')) return 'pika';
    
    // Try to detect from video ID patterns
    if (videoId.includes('runwayml')) return 'runway';
    if (videoId.includes('pika')) return 'pika';
    if (videoId.includes('google') || videoId.includes('gemini')) return 'veo3';
    
    return null;
  }
}

// Export singleton instance
export const videoProviderManager = new VideoProviderManager();
export const videoProviderFactory = VideoProviderFactory.getInstance();

