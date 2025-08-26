import { IVideoProvider, VideoGenerationRequest, VideoGenerationResponse, VideoProviderCapabilities, VideoProviderConfig } from './IVideoProvider.js';

/**
 * Pika Labs Video Generation Provider
 */
export class PikaProvider extends IVideoProvider {
  private baseUrl = 'https://api.pika.art/v1';

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
        console.warn('⚠️ Pika: No API key provided, returning mock response');
        return this.generateMockResponse(videoId, request);
      }

      // Pika API call
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          options: {
            frameRate: request.frameRate || 24,
            aspectRatio: request.aspectRatio || '16:9',
            motion: request.motionStrength || 0.5,
            camera: this.mapCameraMovement(request.cameraMovement || 'dynamic'),
            style: request.style || 'cinematic'
          },
          negativePrompt: request.negativePrompt,
          seed: request.seed
        }),
        signal: AbortSignal.timeout(this.config.timeout || 180000)
      });

      if (!response.ok) {
        throw new Error(`Pika API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      
      const result: VideoGenerationResponse = {
        videoId: data.job_id || videoId,
        status: this.mapPikaStatus(data.status),
        videoUrl: data.result_url,
        thumbnailUrl: data.thumbnail_url,
        duration: 3, // Pika typically generates 3-4 second videos
        resolution: '1024x576', // Pika default
        prompt: request.prompt,
        seed: data.seed?.toString(),
        generatedAt: new Date().toISOString(),
        providerData: {
          provider: 'pika',
          model: 'pika-1.0',
          jobId: data.job_id,
          credits_used: data.credits_deducted
        }
      };

      this.updateMetrics(true, Date.now() - startTime);
      return result;

    } catch (error) {
      console.error('Pika generation failed:', error);
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
        duration: 3
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/jobs/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Pika status check failed: ${response.status}`);
      }

      const data = await response.json() as any;
      
      return {
        videoId,
        status: this.mapPikaStatus(data.status),
        videoUrl: data.result_url,
        thumbnailUrl: data.thumbnail_url,
        duration: data.duration || 3,
        completedAt: data.status === 'completed' ? new Date().toISOString() : undefined,
        error: data.error_message,
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
      const response = await fetch(`${this.baseUrl}/jobs/${videoId}/cancel`, {
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
      name: 'Pika',
      version: '1.0',
      supportedAspectRatios: ['16:9', '9:16', '1:1'],
      supportedResolutions: ['1024x576', '576x1024', '768x768'],
      supportedFrameRates: [24],
      supportedStyles: ['cinematic', 'animated', 'realistic'],
      maxDuration: 4, // Pika max duration
      minDuration: 2,
      maxPromptLength: 1000,
      costPerSecond: 0.50, // Estimated Pika pricing
      averageGenerationTime: 60,
      concurrentGenerations: 5
    };
  }

  async isAvailable(): Promise<boolean> {
    if (!this.config.apiKey) return true;

    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async validateConfig(): Promise<boolean> {
    if (!this.config.apiKey) {
      console.warn('Pika: No API key provided, mock mode will be used');
      return true;
    }
    return this.isAvailable();
  }

  private mapCameraMovement(movement: string): string {
    const mapping: Record<string, string> = {
      'static': 'none',
      'slow_pan': 'pan',
      'dynamic': 'zoom',
      'handheld': 'shake'
    };
    return mapping[movement] || 'zoom';
  }

  private mapPikaStatus(status: string): VideoGenerationResponse['status'] {
    const mapping: Record<string, VideoGenerationResponse['status']> = {
      'pending': 'queued',
      'processing': 'processing',
      'completed': 'completed',
      'failed': 'failed',
      'cancelled': 'cancelled'
    };
    return mapping[status] || 'processing';
  }

  private generateMockResponse(videoId: string, request: VideoGenerationRequest, error?: string): VideoGenerationResponse {
    return {
      videoId,
      status: error ? 'failed' : 'completed',
      videoUrl: error ? undefined : this.getMockVideoUrl(request.prompt || ''),
      thumbnailUrl: error ? undefined : this.getMockThumbnailUrl(request.prompt || ''),
      duration: 3,
      resolution: '1024x576',
      prompt: request.prompt,
      generatedAt: new Date().toISOString(),
      error,
      providerData: {
        provider: 'pika',
        mode: 'mock'
      }
    };
  }

  private getMockVideoUrl(prompt: string): string {
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

