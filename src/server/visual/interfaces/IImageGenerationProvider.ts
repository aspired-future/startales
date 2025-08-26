/**
 * Abstract interface for image generation providers
 * Supports any provider: Google Imagen, DALL-E, Midjourney, Stable Diffusion, etc.
 */

export interface ImageGenerationRequest {
  prompt: string;
  aspectRatio?: '1:1' | '9:16' | '16:9' | '4:3' | '3:4' | 'custom';
  width?: number;
  height?: number;
  style?: 'photographic' | 'digital-art' | 'illustration' | 'anime' | 'concept-art' | 'oil-painting' | 'watercolor' | 'sketch' | 'realistic' | 'abstract';
  quality?: 'draft' | 'standard' | 'hd' | 'ultra-hd';
  safetyLevel?: 'low' | 'medium' | 'high';
  seed?: number;
  steps?: number;
  guidanceScale?: number;
  negativePrompt?: string;
  count?: number; // Number of images to generate
  model?: string; // Specific model variant (e.g., 'dall-e-3', 'imagen-2', 'sdxl-1.0')
  customParameters?: Record<string, any>; // Provider-specific parameters
}

export interface ImageGenerationResponse {
  success: boolean;
  images?: GeneratedImage[];
  error?: string;
  metadata?: ImageGenerationMetadata;
  usage?: UsageInfo;
}

export interface GeneratedImage {
  url?: string;
  base64Data?: string;
  width: number;
  height: number;
  format: 'png' | 'jpg' | 'webp';
  seed?: number;
  revisedPrompt?: string; // Some providers modify the prompt
}

export interface ImageGenerationMetadata {
  provider: string;
  model: string;
  prompt: string;
  revisedPrompt?: string;
  timestamp: string;
  aspectRatio: string;
  style: string;
  quality: string;
  processingTimeMs: number;
  requestId?: string;
}

export interface UsageInfo {
  creditsUsed?: number;
  tokensUsed?: number;
  costUsd?: number;
  remainingCredits?: number;
}

export interface ProviderCapabilities {
  supportedAspectRatios: string[];
  supportedStyles: string[];
  supportedQualities: string[];
  maxWidth: number;
  maxHeight: number;
  supportsNegativePrompt: boolean;
  supportsSeed: boolean;
  supportsSteps: boolean;
  supportsGuidanceScale: boolean;
  supportsBatchGeneration: boolean;
  maxBatchSize: number;
  supportsInpainting: boolean;
  supportsOutpainting: boolean;
  supportsImageToImage: boolean;
  supportsUpscaling: boolean;
}

export interface ProviderStatus {
  isAvailable: boolean;
  isConfigured: boolean;
  apiKeyPresent: boolean;
  model: string;
  version?: string;
  rateLimitRemaining?: number;
  rateLimitReset?: Date;
  lastError?: string;
  capabilities: ProviderCapabilities;
}

/**
 * Abstract base class for image generation providers
 */
export abstract class IImageGenerationProvider {
  protected providerName: string;
  protected apiKey: string;
  protected baseUrl?: string;
  protected defaultModel: string;

  constructor(providerName: string, apiKey: string, baseUrl?: string, defaultModel?: string) {
    this.providerName = providerName;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.defaultModel = defaultModel || 'default';
  }

  /**
   * Generate a single image
   */
  abstract generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse>;

  /**
   * Generate multiple images with variations
   */
  abstract generateVariations(request: ImageGenerationRequest, count: number): Promise<ImageGenerationResponse>;

  /**
   * Generate image for a specific game entity type
   */
  abstract generateGameEntityImage(
    entityType: 'planet' | 'character' | 'species' | 'civilization' | 'city' | 'logo' | 'flag' | 'building' | 'vehicle' | 'weapon',
    entityName: string,
    description: string,
    style?: string
  ): Promise<ImageGenerationResponse>;

  /**
   * Get provider status and capabilities
   */
  abstract getStatus(): Promise<ProviderStatus>;

  /**
   * Get provider capabilities
   */
  abstract getCapabilities(): ProviderCapabilities;

  /**
   * Test the provider with a simple generation
   */
  abstract testProvider(): Promise<ImageGenerationResponse>;

  /**
   * Validate a generation request
   */
  validateRequest(request: ImageGenerationRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const capabilities = this.getCapabilities();

    // Validate aspect ratio
    if (request.aspectRatio && !capabilities.supportedAspectRatios.includes(request.aspectRatio)) {
      errors.push(`Unsupported aspect ratio: ${request.aspectRatio}`);
    }

    // Validate style
    if (request.style && !capabilities.supportedStyles.includes(request.style)) {
      errors.push(`Unsupported style: ${request.style}`);
    }

    // Validate quality
    if (request.quality && !capabilities.supportedQualities.includes(request.quality)) {
      errors.push(`Unsupported quality: ${request.quality}`);
    }

    // Validate dimensions
    if (request.width && request.width > capabilities.maxWidth) {
      errors.push(`Width ${request.width} exceeds maximum ${capabilities.maxWidth}`);
    }
    if (request.height && request.height > capabilities.maxHeight) {
      errors.push(`Height ${request.height} exceeds maximum ${capabilities.maxHeight}`);
    }

    // Validate batch size
    if (request.count && request.count > capabilities.maxBatchSize) {
      errors.push(`Batch size ${request.count} exceeds maximum ${capabilities.maxBatchSize}`);
    }

    // Validate negative prompt support
    if (request.negativePrompt && !capabilities.supportsNegativePrompt) {
      errors.push('Provider does not support negative prompts');
    }

    // Validate seed support
    if (request.seed && !capabilities.supportsSeed) {
      errors.push('Provider does not support seed parameter');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Normalize request parameters for the provider
   */
  protected normalizeRequest(request: ImageGenerationRequest): ImageGenerationRequest {
    const normalized = { ...request };

    // Set default model if not specified
    if (!normalized.model) {
      normalized.model = this.defaultModel;
    }

    // Convert aspect ratio to dimensions if needed
    if (normalized.aspectRatio && !normalized.width && !normalized.height) {
      const dimensions = this.aspectRatioToDimensions(normalized.aspectRatio);
      normalized.width = dimensions.width;
      normalized.height = dimensions.height;
    }

    // Set default quality
    if (!normalized.quality) {
      normalized.quality = 'standard';
    }

    // Set default style
    if (!normalized.style) {
      normalized.style = 'digital-art';
    }

    return normalized;
  }

  /**
   * Convert aspect ratio to dimensions
   */
  protected aspectRatioToDimensions(aspectRatio: string): { width: number; height: number } {
    const ratioMap: Record<string, { width: number; height: number }> = {
      '1:1': { width: 1024, height: 1024 },
      '16:9': { width: 1344, height: 768 },
      '9:16': { width: 768, height: 1344 },
      '4:3': { width: 1152, height: 896 },
      '3:4': { width: 896, height: 1152 }
    };

    return ratioMap[aspectRatio] || { width: 1024, height: 1024 };
  }

  /**
   * Create standardized error response
   */
  protected createErrorResponse(error: string, requestId?: string): ImageGenerationResponse {
    return {
      success: false,
      error,
      metadata: {
        provider: this.providerName,
        model: this.defaultModel,
        prompt: '',
        timestamp: new Date().toISOString(),
        aspectRatio: '1:1',
        style: 'digital-art',
        quality: 'standard',
        processingTimeMs: 0,
        requestId
      }
    };
  }

  /**
   * Check if provider is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get provider name
   */
  getProviderName(): string {
    return this.providerName;
  }
}
