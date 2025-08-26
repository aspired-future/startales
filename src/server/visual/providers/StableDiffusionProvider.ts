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
 * Stable Diffusion provider implementation
 * Can work with local installations, Stability AI API, or other SD-compatible APIs
 */
export class StableDiffusionProvider extends IImageGenerationProvider {
  private client: any; // HTTP client for API calls

  constructor(apiKey?: string, baseUrl?: string) {
    const key = apiKey || process.env.STABILITY_API_KEY || process.env.SD_API_KEY || '';
    const url = baseUrl || process.env.SD_BASE_URL || 'https://api.stability.ai/v1';
    super('Stable Diffusion', key, url, 'stable-diffusion-xl-1024-v1-0');
    
    if (!this.apiKey && !this.baseUrl?.includes('localhost')) {
      console.warn('⚠️ STABILITY_API_KEY not found. Stable Diffusion will use mock responses.');
    }
    
    console.log(`🎨 Stable Diffusion Provider initialized (${this.baseUrl})`);
  }

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const startTime = Date.now();
    const normalizedRequest = this.normalizeRequest(request);
    
    // Validate request
    const validation = this.validateRequest(normalizedRequest);
    if (!validation.valid) {
      return this.createErrorResponse(`Validation failed: ${validation.errors.join(', ')}`);
    }

    if (!this.apiKey && !this.baseUrl?.includes('localhost')) {
      return this.getMockResponse(normalizedRequest, startTime);
    }

    try {
      console.log('🎨 Generating image with Stable Diffusion:', {
        prompt: normalizedRequest.prompt,
        negativePrompt: normalizedRequest.negativePrompt,
        width: normalizedRequest.width,
        height: normalizedRequest.height,
        steps: normalizedRequest.steps,
        guidanceScale: normalizedRequest.guidanceScale,
        seed: normalizedRequest.seed
      });

      // TODO: Replace with actual Stable Diffusion API call
      // const response = await fetch(`${this.baseUrl}/generation/${normalizedRequest.model}/text-to-image`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     'Accept': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     text_prompts: [
      //       { text: normalizedRequest.prompt, weight: 1 },
      //       ...(normalizedRequest.negativePrompt ? [{ text: normalizedRequest.negativePrompt, weight: -1 }] : [])
      //     ],
      //     cfg_scale: normalizedRequest.guidanceScale || 7,
      //     height: normalizedRequest.height,
      //     width: normalizedRequest.width,
      //     samples: 1,
      //     steps: normalizedRequest.steps || 30,
      //     seed: normalizedRequest.seed || 0
      //   })
      // });

      // For now, return a mock response
      return this.getMockResponse(normalizedRequest, startTime);

    } catch (error) {
      console.error('❌ Error generating image with Stable Diffusion:', error);
      return this.createErrorResponse(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  async generateVariations(request: ImageGenerationRequest, count: number): Promise<ImageGenerationResponse> {
    const startTime = Date.now();
    const normalizedRequest = this.normalizeRequest(request);
    normalizedRequest.count = Math.min(count, this.getCapabilities().maxBatchSize);

    if (!this.apiKey && !this.baseUrl?.includes('localhost')) {
      return this.getMockVariationsResponse(normalizedRequest, startTime);
    }

    try {
      // Stable Diffusion can generate multiple images in one call
      const images: GeneratedImage[] = [];
      
      // Generate variations by slightly modifying the seed
      const baseSeed = normalizedRequest.seed || Math.floor(Math.random() * 1000000);
      
      for (let i = 0; i < normalizedRequest.count!; i++) {
        const variationRequest = { 
          ...normalizedRequest, 
          seed: baseSeed + i,
          prompt: `${normalizedRequest.prompt}, variation ${i + 1}`
        };
        
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
          costUsd: images.length * 0.01 // SD is typically cheaper
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
      planet: 'space art, planetary landscape, cosmic vista, detailed surface features, atmospheric effects',
      character: 'character design, portrait, detailed features, professional concept art, character sheet',
      species: 'creature design, alien biology, detailed anatomy, scientific accuracy, concept art',
      civilization: 'architectural concept art, grand structures, epic scale, detailed buildings, urban planning',
      city: 'cityscape, urban environment, futuristic architecture, detailed buildings, metropolitan',
      logo: 'logo design, minimalist, clean lines, professional, vector style, brand identity',
      flag: 'flag design, heraldic symbols, geometric patterns, national colors, symbolic elements',
      building: 'architectural visualization, structural design, detailed facade, modern architecture',
      vehicle: 'vehicle design, mechanical details, industrial design, technical illustration',
      weapon: 'weapon design, tactical equipment, military hardware, detailed mechanics'
    };

    const negativePrompts = {
      planet: 'blurry, low quality, distorted, unrealistic colors',
      character: 'blurry, deformed, extra limbs, bad anatomy, low quality',
      species: 'blurry, deformed, bad anatomy, unrealistic, low quality',
      civilization: 'blurry, low quality, modern buildings, contemporary architecture',
      city: 'blurry, low quality, rural, countryside, natural landscape',
      logo: 'complex, cluttered, photographic, realistic, detailed background',
      flag: 'complex, photographic, realistic, detailed background, cluttered',
      building: 'blurry, low quality, deformed structure, bad architecture',
      vehicle: 'blurry, low quality, deformed, unrealistic proportions',
      weapon: 'blurry, low quality, deformed, unrealistic, toy-like'
    };

    const enhancedPrompt = `${description}, ${stylePrompts[entityType]}, ${style}, high quality, detailed, masterpiece, for ${entityName}`;

    const request: ImageGenerationRequest = {
      prompt: enhancedPrompt,
      negativePrompt: negativePrompts[entityType],
      aspectRatio: entityType === 'logo' || entityType === 'flag' ? '1:1' : '16:9',
      style: style as any,
      quality: 'hd',
      steps: 30,
      guidanceScale: 7.5,
      model: this.defaultModel
    };

    return this.generateImage(request);
  }

  async getStatus(): Promise<ProviderStatus> {
    return {
      isAvailable: true,
      isConfigured: this.isConfigured() || this.baseUrl?.includes('localhost'),
      apiKeyPresent: !!this.apiKey,
      model: this.defaultModel,
      version: 'XL 1.0',
      capabilities: this.getCapabilities()
    };
  }

  getCapabilities(): ProviderCapabilities {
    return {
      supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4', 'custom'],
      supportedStyles: ['photographic', 'digital-art', 'illustration', 'anime', 'concept-art', 'oil-painting', 'watercolor', 'sketch'],
      supportedQualities: ['draft', 'standard', 'hd'],
      maxWidth: 1536,
      maxHeight: 1536,
      supportsNegativePrompt: true,
      supportsSeed: true,
      supportsSteps: true,
      supportsGuidanceScale: true,
      supportsBatchGeneration: true,
      maxBatchSize: 8,
      supportsInpainting: true,
      supportsOutpainting: true,
      supportsImageToImage: true,
      supportsUpscaling: true
    };
  }

  async testProvider(): Promise<ImageGenerationResponse> {
    const testRequest: ImageGenerationRequest = {
      prompt: 'a majestic space station orbiting a blue planet, futuristic architecture, detailed, digital art, masterpiece',
      negativePrompt: 'blurry, low quality, deformed, bad anatomy',
      aspectRatio: '16:9',
      style: 'digital-art',
      quality: 'hd',
      steps: 20,
      guidanceScale: 7.5
    };

    return this.generateImage(testRequest);
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
      seed: request.seed || Math.floor(Math.random() * 1000000)
    };

    const metadata: ImageGenerationMetadata = {
      provider: this.providerName,
      model: request.model || this.defaultModel,
      prompt: request.prompt,
      timestamp: new Date().toISOString(),
      aspectRatio: request.aspectRatio || '1:1',
      style: request.style || 'digital-art',
      quality: request.quality || 'standard',
      processingTimeMs: processingTime,
      requestId: `sd-mock-${Date.now()}`
    };

    return {
      success: true,
      images: [image],
      metadata,
      usage: {
        creditsUsed: 1,
        costUsd: 0.01
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
    const baseSeed = request.seed || Math.floor(Math.random() * 1000000);

    for (let i = 0; i < count; i++) {
      images.push({
        url: `https://picsum.photos/${dimensions.width}/${dimensions.height}?random=${Date.now() + i}`,
        width: dimensions.width,
        height: dimensions.height,
        format: 'png',
        seed: baseSeed + i
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
      requestId: `sd-variations-${Date.now()}`
    };

    return {
      success: true,
      images,
      metadata,
      usage: {
        creditsUsed: count,
        costUsd: count * 0.01
      }
    };
  }
}
