import { IVideoProvider, VideoGenerationRequest, VideoGenerationResponse, VideoProviderCapabilities, VideoProviderConfig } from './IVideoProvider.js';
import { GoogleServiceAccountAuth } from '../../auth/GoogleServiceAccountAuth.js';

/**
 * Google VEO 3 Video Generation Provider
 */
export class VEO3Provider extends IVideoProvider {
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  private authService: GoogleServiceAccountAuth | null = null;

  constructor(config: VideoProviderConfig) {
    super(config);
    this.initializeAuth();
  }

  private initializeAuth(): void {
    try {
      // Try Service Account authentication first
      this.authService = GoogleServiceAccountAuth.autoDetect([
        'https://www.googleapis.com/auth/generative-language',
        'https://www.googleapis.com/auth/cloud-platform'
      ]);
      
      const authInfo = this.authService.getAuthInfo();
      console.log('✅ VEO 3: Initialized with Google Service Account');
      console.log(`   📧 Client: ${authInfo.clientEmail}`);
      console.log(`   🏗️ Project: ${authInfo.projectId}`);
      
    } catch (error) {
      console.warn('⚠️ VEO 3: Service Account auth failed, trying API key...');
      
      if (this.config.apiKey) {
        console.log('✅ VEO 3: Using API key authentication');
      } else {
        console.warn('⚠️ VEO 3: No authentication configured, using mock mode');
        console.log('   💡 To enable real video generation:');
        console.log('   1. Place service account JSON in project root, or');
        console.log('   2. Set GOOGLE_APPLICATION_CREDENTIALS environment variable, or');
        console.log('   3. Provide GOOGLE_API_KEY in configuration');
      }
    }
  }

  private async getAuthToken(): Promise<string> {
    if (this.authService) {
      return this.authService.getAccessToken();
    } else if (this.config.apiKey) {
      return this.config.apiKey;
    } else {
      throw new Error('No authentication method available');
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (this.authService) {
      return this.authService.isValid();
    }
    return !!this.config.apiKey;
  }

  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    const startTime = Date.now();
    
    try {
      // Validate request
      const validationErrors = this.validateRequest(request);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      const videoId = this.generateVideoId();

      // Check if authentication is available
      let authToken: string;
      try {
        authToken = await this.getAuthToken();
      } catch (error) {
        console.warn('⚠️ VEO 3: No authentication available, returning mock response');
        return this.generateMockResponse(videoId, request);
      }

      // Make actual VEO 3 API call
      const response = await fetch(`${this.baseUrl}/models/veo-3:generateVideo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          duration: request.duration || 8,
          aspectRatio: request.aspectRatio || '16:9',
          style: request.style || 'cinematic',
          quality: request.quality || 'high',
          resolution: request.resolution || '1080p',
          frameRate: request.frameRate || 30,
          seed: request.seed,
          negativePrompt: request.negativePrompt,
          motionStrength: request.motionStrength || 0.7,
          cameraMovement: request.cameraMovement || 'dynamic'
        }),
        signal: AbortSignal.timeout(this.config.timeout || 60000)
      });

      if (!response.ok) {
        throw new Error(`VEO 3 API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      
      const result: VideoGenerationResponse = {
        videoId: data.videoId || videoId,
        status: data.status || 'processing',
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
        previewUrl: data.previewUrl,
        duration: data.duration || request.duration || 8,
        resolution: data.resolution || request.resolution || '1080p',
        fileSize: data.fileSize,
        prompt: request.prompt,
        seed: data.seed || request.seed,
        generatedAt: new Date().toISOString(),
        providerData: {
          provider: 'veo3',
          model: 'veo-3',
          apiVersion: 'v1beta'
        }
      };

      this.updateMetrics(true, Date.now() - startTime);
      return result;

    } catch (error) {
      console.error('VEO 3 generation failed:', error);
      this.updateMetrics(false, Date.now() - startTime);
      
      // Return mock response as fallback
      return this.generateMockResponse(this.generateVideoId(), request, error.message);
    }
  }

  async checkStatus(videoId: string): Promise<VideoGenerationResponse> {
    if (!this.config.apiKey) {
      // Mock videos are always completed
      return {
        videoId,
        status: 'completed',
        videoUrl: this.getMockVideoUrl(videoId),
        thumbnailUrl: this.getMockThumbnailUrl(videoId),
        duration: 8,
        completedAt: new Date().toISOString()
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/videos/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`VEO 3 status check failed: ${response.status}`);
      }

      const data = await response.json() as any;
      
      return {
        videoId,
        status: data.status,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
        previewUrl: data.previewUrl,
        duration: data.duration,
        resolution: data.resolution,
        fileSize: data.fileSize,
        completedAt: data.completedAt,
        error: data.error,
        providerData: data
      };

    } catch (error) {
      console.error('VEO 3 status check failed:', error);
      return {
        videoId,
        status: 'failed',
        error: error.message
      };
    }
  }

  async cancelGeneration(videoId: string): Promise<boolean> {
    if (!this.config.apiKey) {
      return true; // Mock cancellation always succeeds
    }

    try {
      const response = await fetch(`${this.baseUrl}/videos/${videoId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('VEO 3 cancellation failed:', error);
      return false;
    }
  }

  getCapabilities(): VideoProviderCapabilities {
    return {
      name: 'VEO 3',
      version: '1.0.0',
      supportedAspectRatios: ['16:9', '9:16', '1:1', '21:9'],
      supportedResolutions: ['720p', '1080p', '1440p', '4K'],
      supportedFrameRates: [24, 30, 60],
      supportedStyles: ['cinematic', 'documentary', 'animated', 'realistic'],
      maxDuration: 60, // VEO 3 supports up to 60 seconds
      minDuration: 2,
      maxPromptLength: 2000,
      costPerSecond: 0.10, // Estimated cost
      averageGenerationTime: 120, // 2 minutes average
      concurrentGenerations: 5
    };
  }

  async isAvailable(): Promise<boolean> {
    if (!this.config.apiKey) {
      return true; // Mock mode is always available
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async validateConfig(): Promise<boolean> {
    if (!this.config.apiKey) {
      console.warn('VEO 3: No API key provided, mock mode will be used');
      return true;
    }

    return this.isAvailable();
  }

  private generateMockResponse(videoId: string, request: VideoGenerationRequest, error?: string): VideoGenerationResponse {
    const mockVideoUrl = this.getMockVideoUrl(request.prompt || '');
    
    return {
      videoId,
      status: error ? 'failed' : 'completed',
      videoUrl: error ? undefined : mockVideoUrl,
      thumbnailUrl: error ? undefined : this.getMockThumbnailUrl(request.prompt || ''),
      duration: request.duration || 8,
      resolution: request.resolution || '1080p',
      prompt: request.prompt,
      generatedAt: new Date().toISOString(),
      completedAt: error ? undefined : new Date().toISOString(),
      error,
      providerData: {
        provider: 'veo3',
        mode: 'mock',
        reason: error ? 'api_error' : 'no_api_key'
      }
    };
  }

  private getMockVideoUrl(prompt: string): string {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('discovery') || promptLower.includes('planet') || promptLower.includes('exploration')) {
      return '/api/videos/mock/space_discovery.mp4';
    }
    if (promptLower.includes('crisis') || promptLower.includes('political') || promptLower.includes('government')) {
      return '/api/videos/mock/political_crisis.mp4';
    }
    if (promptLower.includes('economic') || promptLower.includes('trade') || promptLower.includes('prosperity')) {
      return '/api/videos/mock/economic_success.mp4';
    }
    if (promptLower.includes('military') || promptLower.includes('war') || promptLower.includes('conflict')) {
      return '/api/videos/mock/military_alert.mp4';
    }
    if (promptLower.includes('disaster') || promptLower.includes('catastrophe') || promptLower.includes('emergency')) {
      return '/api/videos/mock/disaster_alert.mp4';
    }
    if (promptLower.includes('technology') || promptLower.includes('breakthrough') || promptLower.includes('innovation')) {
      return '/api/videos/mock/tech_breakthrough.mp4';
    }
    
    return '/api/videos/mock/general_announcement.mp4';
  }

  private getMockThumbnailUrl(prompt: string): string {
    const videoUrl = this.getMockVideoUrl(prompt);
    return videoUrl.replace('.mp4', '_thumb.jpg');
  }
}
