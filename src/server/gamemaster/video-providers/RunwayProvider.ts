import { IVideoProvider, VideoGenerationRequest, VideoGenerationResponse, VideoProviderCapabilities, VideoProviderConfig } from './IVideoProvider';

/**
 * Runway ML Video Generation Provider
 */
export class RunwayProvider extends IVideoProvider {
  private baseUrl = 'https://api.runwayml.com/v1';

  constructor(config: VideoProviderConfig) {
    super(config);
  }

  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    const startTime = Date.now();
    
    try {
      const validationErrors = this.validateRequest(request);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      const videoId = this.generateVideoId();

      if (!this.config.apiKey) {
        console.warn('⚠️ Runway: No API key provided, returning mock response');
        return this.generateMockResponse(videoId, request);
      }

      // Runway Gen-3 API call
      const response = await fetch(`${this.baseUrl}/image_to_video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gen3a_turbo',
          prompt_text: request.prompt,
          duration: Math.min(request.duration || 10, 10), // Runway max 10s
          ratio: this.mapAspectRatio(request.aspectRatio || '16:9'),
          watermark: false,
          enhance_prompt: true,
          seed: request.seed ? parseInt(request.seed) : undefined
        }),
        signal: AbortSignal.timeout(this.config.timeout || 120000)
      });

      if (!response.ok) {
        throw new Error(`Runway API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      
      const result: VideoGenerationResponse = {
        videoId: data.id || videoId,
        status: this.mapRunwayStatus(data.status),
        videoUrl: data.output?.[0],
        thumbnailUrl: data.thumbnail,
        duration: data.duration || request.duration || 10,
        resolution: '1280x768', // Runway default
        prompt: request.prompt,
        seed: data.seed?.toString(),
        generatedAt: new Date().toISOString(),
        providerData: {
          provider: 'runway',
          model: 'gen3a_turbo',
          runwayId: data.id,
          credits_used: data.credits_used
        }
      };

      this.updateMetrics(true, Date.now() - startTime);
      return result;

    } catch (error) {
      console.error('Runway generation failed:', error);
      this.updateMetrics(false, Date.now() - startTime);
      return this.generateMockResponse(this.generateVideoId(), request, error.message);
    }
  }

  async checkStatus(videoId: string): Promise<VideoGenerationResponse> {
    if (!this.config.apiKey) {
      return {
        videoId,
        status: 'completed',
        videoUrl: this.getMockVideoUrl(videoId),
        thumbnailUrl: this.getMockThumbnailUrl(videoId),
        duration: 10
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/tasks/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Runway status check failed: ${response.status}`);
      }

      const data = await response.json() as any;
      
      return {
        videoId,
        status: this.mapRunwayStatus(data.status),
        videoUrl: data.output?.[0],
        thumbnailUrl: data.thumbnail,
        duration: data.duration,
        completedAt: data.status === 'SUCCEEDED' ? new Date().toISOString() : undefined,
        error: data.failure_reason,
        providerData: data
      };

    } catch (error) {
      return {
        videoId,
        status: 'failed',
        error: error.message
      };
    }
  }

  async cancelGeneration(videoId: string): Promise<boolean> {
    if (!this.config.apiKey) {
      return true;
    }

    try {
      const response = await fetch(`${this.baseUrl}/tasks/${videoId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  getCapabilities(): VideoProviderCapabilities {
    return {
      name: 'Runway',
      version: 'Gen-3 Alpha Turbo',
      supportedAspectRatios: ['16:9', '9:16', '1:1'],
      supportedResolutions: ['1280x768', '768x1280', '768x768'],
      supportedFrameRates: [24],
      supportedStyles: ['cinematic', 'realistic'],
      maxDuration: 10, // Runway Gen-3 max
      minDuration: 2,
      maxPromptLength: 500,
      costPerSecond: 0.95, // Runway pricing
      averageGenerationTime: 90,
      concurrentGenerations: 3
    };
  }

  async isAvailable(): Promise<boolean> {
    if (!this.config.apiKey) return true;

    try {
      const response = await fetch(`${this.baseUrl}/account`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async validateConfig(): Promise<boolean> {
    if (!this.config.apiKey) {
      console.warn('Runway: No API key provided, mock mode will be used');
      return true;
    }
    return this.isAvailable();
  }

  private mapAspectRatio(aspectRatio: string): string {
    const mapping: Record<string, string> = {
      '16:9': '1280:768',
      '9:16': '768:1280',
      '1:1': '768:768'
    };
    return mapping[aspectRatio] || '1280:768';
  }

  private mapRunwayStatus(status: string): VideoGenerationResponse['status'] {
    const mapping: Record<string, VideoGenerationResponse['status']> = {
      'PENDING': 'queued',
      'RUNNING': 'processing',
      'SUCCEEDED': 'completed',
      'FAILED': 'failed',
      'CANCELLED': 'cancelled'
    };
    return mapping[status] || 'processing';
  }

  private generateMockResponse(videoId: string, request: VideoGenerationRequest, error?: string): VideoGenerationResponse {
    return {
      videoId,
      status: error ? 'failed' : 'completed',
      videoUrl: error ? undefined : this.getMockVideoUrl(request.prompt || ''),
      thumbnailUrl: error ? undefined : this.getMockThumbnailUrl(request.prompt || ''),
      duration: Math.min(request.duration || 10, 10),
      resolution: '1280x768',
      prompt: request.prompt,
      generatedAt: new Date().toISOString(),
      error,
      providerData: {
        provider: 'runway',
        mode: 'mock'
      }
    };
  }

  private getMockVideoUrl(prompt: string): string {
    // Use same logic as VEO3 for consistency
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('discovery')) return '/api/videos/mock/space_discovery.mp4';
    if (promptLower.includes('crisis')) return '/api/videos/mock/political_crisis.mp4';
    if (promptLower.includes('economic')) return '/api/videos/mock/economic_success.mp4';
    if (promptLower.includes('military')) return '/api/videos/mock/military_alert.mp4';
    if (promptLower.includes('disaster')) return '/api/videos/mock/disaster_alert.mp4';
    if (promptLower.includes('technology')) return '/api/videos/mock/tech_breakthrough.mp4';
    
    return '/api/videos/mock/general_announcement.mp4';
  }

  private getMockThumbnailUrl(prompt: string): string {
    return this.getMockVideoUrl(prompt).replace('.mp4', '_thumb.jpg');
  }
}

