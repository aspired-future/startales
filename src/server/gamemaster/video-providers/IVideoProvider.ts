/**
 * Abstract Video Provider Interface
 * 
 * This interface allows the Game Master system to use any video generation provider
 * (VEO 3, Runway, Pika Labs, Luma AI, etc.) interchangeably.
 */

export interface VideoGenerationRequest {
  prompt: string;
  duration?: number; // seconds
  aspectRatio?: '16:9' | '9:16' | '1:1' | '21:9' | '4:3';
  style?: 'cinematic' | 'documentary' | 'animated' | 'realistic' | 'artistic';
  quality?: 'draft' | 'standard' | 'high' | 'ultra';
  resolution?: '480p' | '720p' | '1080p' | '1440p' | '4K';
  frameRate?: 24 | 30 | 60;
  
  // Advanced options
  seed?: string; // For reproducible generation
  negativePrompt?: string; // What to avoid
  motionStrength?: number; // 0-1, how much motion
  cameraMovement?: 'static' | 'slow_pan' | 'dynamic' | 'handheld';
  
  // Provider-specific options
  providerOptions?: Record<string, any>;
}

export interface VideoGenerationResponse {
  videoId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  videoUrl?: string;
  thumbnailUrl?: string;
  previewUrl?: string; // Low-res preview while processing
  duration?: number;
  resolution?: string;
  fileSize?: number; // bytes
  
  // Generation metadata
  prompt?: string;
  seed?: string;
  generatedAt?: string;
  completedAt?: string;
  
  // Error information
  error?: string;
  errorCode?: string;
  
  // Provider-specific data
  providerData?: Record<string, any>;
}

export interface VideoProviderCapabilities {
  name: string;
  version: string;
  
  // Supported features
  supportedAspectRatios: string[];
  supportedResolutions: string[];
  supportedFrameRates: number[];
  supportedStyles: string[];
  
  // Limitations
  maxDuration: number; // seconds
  minDuration: number; // seconds
  maxPromptLength: number; // characters
  
  // Pricing (optional)
  costPerSecond?: number; // USD
  costPerGeneration?: number; // USD
  
  // Performance
  averageGenerationTime?: number; // seconds
  concurrentGenerations?: number; // max parallel generations
}

export interface VideoProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number; // milliseconds
  retries?: number;
  
  // Default generation settings
  defaultQuality?: string;
  defaultStyle?: string;
  defaultAspectRatio?: string;
  
  // Provider-specific configuration
  providerSettings?: Record<string, any>;
}

export interface VideoProviderMetrics {
  totalGenerations: number;
  successfulGenerations: number;
  failedGenerations: number;
  averageGenerationTime: number;
  totalCost?: number;
  lastUsed?: string;
}

/**
 * Abstract base class for video generation providers
 */
export abstract class IVideoProvider {
  protected config: VideoProviderConfig;
  protected metrics: VideoProviderMetrics;

  constructor(config: VideoProviderConfig) {
    this.config = config;
    this.metrics = {
      totalGenerations: 0,
      successfulGenerations: 0,
      failedGenerations: 0,
      averageGenerationTime: 0
    };
  }

  // Core generation methods
  abstract generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse>;
  abstract checkStatus(videoId: string): Promise<VideoGenerationResponse>;
  abstract cancelGeneration(videoId: string): Promise<boolean>;
  
  // Provider information
  abstract getCapabilities(): VideoProviderCapabilities;
  abstract isAvailable(): Promise<boolean>;
  abstract validateConfig(): Promise<boolean>;
  
  // Optional methods with default implementations
  async getGenerationHistory(limit?: number): Promise<VideoGenerationResponse[]> {
    // Default: return empty array (override in provider if supported)
    return [];
  }
  
  async deleteVideo(videoId: string): Promise<boolean> {
    // Default: not supported (override in provider if supported)
    return false;
  }
  
  async downloadVideo(videoId: string, outputPath: string): Promise<boolean> {
    // Default: not supported (override in provider if supported)
    return false;
  }
  
  // Metrics and monitoring
  getMetrics(): VideoProviderMetrics {
    return { ...this.metrics };
  }
  
  protected updateMetrics(success: boolean, generationTime?: number): void {
    this.metrics.totalGenerations++;
    this.metrics.lastUsed = new Date().toISOString();
    
    if (success) {
      this.metrics.successfulGenerations++;
    } else {
      this.metrics.failedGenerations++;
    }
    
    if (generationTime) {
      const totalTime = this.metrics.averageGenerationTime * (this.metrics.totalGenerations - 1);
      this.metrics.averageGenerationTime = (totalTime + generationTime) / this.metrics.totalGenerations;
    }
  }
  
  // Utility methods
  protected validateRequest(request: VideoGenerationRequest): string[] {
    const errors: string[] = [];
    const capabilities = this.getCapabilities();
    
    if (!request.prompt || request.prompt.trim().length === 0) {
      errors.push('Prompt is required');
    }
    
    if (request.prompt && request.prompt.length > capabilities.maxPromptLength) {
      errors.push(`Prompt exceeds maximum length of ${capabilities.maxPromptLength} characters`);
    }
    
    if (request.duration) {
      if (request.duration > capabilities.maxDuration) {
        errors.push(`Duration exceeds maximum of ${capabilities.maxDuration} seconds`);
      }
      if (request.duration < capabilities.minDuration) {
        errors.push(`Duration below minimum of ${capabilities.minDuration} seconds`);
      }
    }
    
    if (request.aspectRatio && !capabilities.supportedAspectRatios.includes(request.aspectRatio)) {
      errors.push(`Aspect ratio ${request.aspectRatio} not supported`);
    }
    
    if (request.frameRate && !capabilities.supportedFrameRates.includes(request.frameRate)) {
      errors.push(`Frame rate ${request.frameRate} not supported`);
    }
    
    return errors;
  }
  
  protected generateVideoId(): string {
    return `${this.getCapabilities().name.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Provider factory interface for dynamic provider loading
 */
export interface IVideoProviderFactory {
  createProvider(providerName: string, config: VideoProviderConfig): IVideoProvider;
  getSupportedProviders(): string[];
  getProviderInfo(providerName: string): VideoProviderCapabilities | null;
}

/**
 * Video generation context for enhanced prompts
 */
export interface VideoGenerationContext {
  eventType?: string;
  characterId?: string;
  locationId?: string;
  campaignId?: string;
  gameState?: Record<string, any>;
  
  // Visual consistency requirements
  colorPalette?: string[];
  visualStyle?: string;
  cinematicStyle?: string;
  
  // Narrative context
  previousEvents?: string[];
  storyMoment?: string;
  emotionalTone?: string;
}

/**
 * Enhanced request with game context
 */
export interface GameVideoGenerationRequest extends VideoGenerationRequest {
  context?: VideoGenerationContext;
  consistencyProfile?: string; // Reference to visual consistency profile
  priority?: 'low' | 'normal' | 'high' | 'critical';
}

export default IVideoProvider;

