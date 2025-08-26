import { 
  IImageGenerationProvider, 
  ImageGenerationRequest, 
  ImageGenerationResponse, 
  ProviderStatus,
  ProviderCapabilities,
  GeneratedImage,
  ImageGenerationMetadata
} from '../interfaces/IImageGenerationProvider';

/**
 * OpenAI DALL-E provider implementation
 */
export class DallEProvider extends IImageGenerationProvider {
  private openai: any; // OpenAI client when available

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY || '';
    super('OpenAI DALL-E', apiKey, 'https://api.openai.com/v1', 'dall-e-3');
    
    if (!this.apiKey) {
      console.warn('⚠️ OPENAI_API_KEY not found. DALL-E generation will use mock responses.');
      return;
    }
    
    // TODO: Initialize OpenAI client when available
    // this.openai = new OpenAI({ apiKey: this.apiKey });
    console.log('🎨 DALL-E Provider initialized (mock mode)');
  }

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const startTime = Date.now();
    const normalizedRequest = this.normalizeRequest(request);
    
    // Validate request
    const validation = this.validateRequest(normalizedRequest);
    if (!validation.valid) {
      return this.createErrorResponse(`Validation failed: ${validation.errors.join(', ')}`);
    }

    if (!this.apiKey) {
      return this.getMockResponse(normalizedRequest, startTime);
    }

    try {
      console.log('🎨 Generating image with DALL-E:', {
        prompt: normalizedRequest.prompt,
        model: normalizedRequest.model,
        size: `${normalizedRequest.width}x${normalizedRequest.height}`,
        quality: normalizedRequest.quality
      });

      // TODO: Replace with actual DALL-E API call
      // const response = await this.openai.images.generate({
      //   model: normalizedRequest.model,
      //   prompt: normalizedRequest.prompt,
      //   size: this.getDallESize(normalizedRequest.width!, normalizedRequest.height!),
      //   quality: normalizedRequest.quality === 'hd' ? 'hd' : 'standard',
      //   n: 1,
      //   response_format: 'url'
      // });

      // For now, return a mock response
      return this.getMockResponse(normalizedRequest, startTime);

    } catch (error) {
      console.error('❌ Error generating image with DALL-E:', error);
      return this.createErrorResponse(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  async generateVariations(request: ImageGenerationRequest, count: number): Promise<ImageGenerationResponse> {
    const startTime = Date.now();
    const normalizedRequest = this.normalizeRequest(request);
    normalizedRequest.count = Math.min(count, this.getCapabilities().maxBatchSize);

    if (!this.apiKey) {
      return this.getMockVariationsResponse(normalizedRequest, startTime);
    }

    try {
      // DALL-E 3 doesn't support batch generation, so we'll generate one at a time
      const images: GeneratedImage[] = [];
      
      for (let i = 0; i < normalizedRequest.count!; i++) {
        const variationPrompt = `${normalizedRequest.prompt} (variation ${i + 1})`;
        const variationRequest = { ...normalizedRequest, prompt: variationPrompt };
        const response = await this.generateImage(variationRequest);
        
        if (response.success && response.images) {
          images.push(...response.images);
        }
      }

      const processingTime = Date.now() - startTime;
      const metadata: ImageGenerationMetadata = {
        provider: this.providerName,
        model: normalizedRequest.model || this.defaultModel,
        prompt: normalizedRequest.prompt,
        timestamp: new Date().toISOString(),
        aspectRatio: normalizedRequest.aspectRatio || '1:1',
        style: normalizedRequest.style || 'digital-art',
        quality: normalizedRequest.quality || 'standard',
        processingTimeMs: processingTime
      };

      return {
        success: true,
        images,
        metadata,
        usage: {
          creditsUsed: images.length,
          costUsd: images.length * 0.04 // DALL-E 3 pricing
        }
      };
    } catch (error) {
      return this.createErrorResponse(
        error instanceof Error ? error.message : 'Variations generation failed'
      );
    }
  }

  async generateGameEntityImage(
    entityType: 'planet' | 'character' | 'species' | 'civilization' | 'city' | 'logo' | 'flag' | 'building' | 'vehicle' | 'weapon',
    entityName: string,
    description: string,
    style: string = 'digital-art'
  ): Promise<ImageGenerationResponse> {
    const stylePrompts = {
      planet: 'photorealistic space photography, detailed planetary surface, cosmic vista, NASA-style',
      character: 'detailed character portrait, professional concept art, character design sheet',
      species: 'alien creature design, biological accuracy, scientific illustration, detailed anatomy',
      civilization: 'architectural photography, grand scale, epic civilization, detailed structures',
      city: 'urban photography, futuristic cityscape, architectural detail, metropolitan vista',
      logo: 'clean minimalist logo, professional design, vector-style, corporate branding',
      flag: 'flag design, heraldic symbols, geometric patterns, official government style',
      building: 'architectural photography, modern design, structural detail, professional',
      vehicle: 'industrial design, technical illustration, detailed mechanics, professional render',
      weapon: 'technical diagram, military specification, detailed engineering, tactical design'
    };

    // DALL-E works better with more descriptive, natural language prompts
    const enhancedPrompt = `A detailed ${style} illustration of ${entityName}: ${description}. ${stylePrompts[entityType]}. High quality, professional, detailed.`;

    const request: ImageGenerationRequest = {
      prompt: enhancedPrompt,
      aspectRatio: entityType === 'logo' || entityType === 'flag' ? '1:1' : '16:9',
      style: style as any,
      quality: 'hd',
      model: this.defaultModel
    };

    return this.generateImage(request);
  }

  async getStatus(): Promise<ProviderStatus> {
    return {
      isAvailable: true,
      isConfigured: this.isConfigured(),
      apiKeyPresent: !!this.apiKey,
      model: this.defaultModel,
      version: '3.0',
      capabilities: this.getCapabilities()
    };
  }

  getCapabilities(): ProviderCapabilities {
    return {
      supportedAspectRatios: ['1:1', '16:9', '9:16'],
      supportedStyles: ['photographic', 'digital-art', 'illustration', 'concept-art'],
      supportedQualities: ['standard', 'hd'],
      maxWidth: 1792,
      maxHeight: 1792,
      supportsNegativePrompt: false,
      supportsSeed: false,
      supportsSteps: false,
      supportsGuidanceScale: false,
      supportsBatchGeneration: false, // DALL-E 3 generates one at a time
      maxBatchSize: 1,
      supportsInpainting: false,
      supportsOutpainting: false,
      supportsImageToImage: false,
      supportsUpscaling: false
    };
  }

  async testProvider(): Promise<ImageGenerationResponse> {
    const testRequest: ImageGenerationRequest = {
      prompt: 'A majestic space station orbiting Earth, with solar panels gleaming in sunlight, detailed digital art',
      aspectRatio: '16:9',
      style: 'digital-art',
      quality: 'hd'
    };

    return this.generateImage(testRequest);
  }

  /**
   * Convert dimensions to DALL-E supported sizes
   */
  private getDallESize(width: number, height: number): '1024x1024' | '1792x1024' | '1024x1792' {
    const aspectRatio = width / height;
    
    if (aspectRatio > 1.5) {
      return '1792x1024'; // Wide
    } else if (aspectRatio < 0.75) {
      return '1024x1792'; // Tall
    } else {
      return '1024x1024'; // Square
    }
  }

  /**
   * Mock response for testing
   */
  private getMockResponse(request: ImageGenerationRequest, startTime: number): ImageGenerationResponse {
    const processingTime = Date.now() - startTime;
    const dimensions = this.aspectRatioToDimensions(request.aspectRatio || '1:1');
    const mockImageUrl = `https://picsum.photos/${dimensions.width}/${dimensions.height}?random=${Date.now()}`;
    
    const image: GeneratedImage = {
      url: mockImageUrl,
      width: dimensions.width,
      height: dimensions.height,
      format: 'png',
      revisedPrompt: `Enhanced: ${request.prompt}` // DALL-E often revises prompts
    };

    const metadata: ImageGenerationMetadata = {
      provider: this.providerName,
      model: request.model || this.defaultModel,
      prompt: request.prompt,
      revisedPrompt: image.revisedPrompt,
      timestamp: new Date().toISOString(),
      aspectRatio: request.aspectRatio || '1:1',
      style: request.style || 'digital-art',
      quality: request.quality || 'standard',
      processingTimeMs: processingTime,
      requestId: `dalle-mock-${Date.now()}`
    };

    return {
      success: true,
      images: [image],
      metadata,
      usage: {
        creditsUsed: 1,
        costUsd: request.quality === 'hd' ? 0.08 : 0.04
      }
    };
  }

  /**
   * Mock variations response
   */
  private getMockVariationsResponse(request: ImageGenerationRequest, startTime: number): ImageGenerationResponse {
    const processingTime = Date.now() - startTime;
    const count = request.count || 3;
    const dimensions = this.aspectRatioToDimensions(request.aspectRatio || '1:1');
    const images: GeneratedImage[] = [];

    for (let i = 0; i < count; i++) {
      images.push({
        url: `https://picsum.photos/${dimensions.width}/${dimensions.height}?random=${Date.now() + i}`,
        width: dimensions.width,
        height: dimensions.height,
        format: 'png',
        revisedPrompt: `Enhanced variation ${i + 1}: ${request.prompt}`
      });
    }

    const metadata: ImageGenerationMetadata = {
      provider: this.providerName,
      model: request.model || this.defaultModel,
      prompt: request.prompt,
      timestamp: new Date().toISOString(),
      aspectRatio: request.aspectRatio || '1:1',
      style: request.style || 'digital-art',
      quality: request.quality || 'standard',
      processingTimeMs: processingTime,
      requestId: `dalle-variations-${Date.now()}`
    };

    return {
      success: true,
      images,
      metadata,
      usage: {
        creditsUsed: count,
        costUsd: count * (request.quality === 'hd' ? 0.08 : 0.04)
      }
    };
  }
}
