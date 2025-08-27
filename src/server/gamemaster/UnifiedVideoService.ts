import { videoProviderManager, VideoProviderManager } from './video-providers/VideoProviderFactory.js';
import { VideoGenerationRequest, VideoGenerationResponse, GameVideoGenerationRequest } from './video-providers/IVideoProvider.js';
import { videoStyleConsistency } from './VideoStyleConsistency.js';

/**
 * Unified Video Generation Service
 * 
 * This service provides a single interface for video generation that can use
 * any provider (VEO 3, Runway, Pika, etc.) with automatic fallback and
 * visual consistency enforcement.
 */
export class UnifiedVideoService {
  private providerManager: VideoProviderManager;
  private activeGenerations: Map<string, { provider: string; startTime: number }> = new Map();

  constructor(providerManager?: VideoProviderManager) {
    this.providerManager = providerManager || videoProviderManager;
    this.setupProviderConfigs();
  }

  private setupProviderConfigs(): void {
    // Configure providers with environment variables
    this.providerManager.setProviderConfig('veo3', {
      apiKey: process.env.GOOGLE_API_KEY,
      timeout: 120000,
      defaultQuality: 'high',
      defaultStyle: 'cinematic',
      defaultAspectRatio: '16:9'
    });

    this.providerManager.setProviderConfig('runway', {
      apiKey: process.env.RUNWAY_API_KEY,
      timeout: 180000,
      defaultQuality: 'standard',
      defaultStyle: 'cinematic',
      defaultAspectRatio: '16:9'
    });

    this.providerManager.setProviderConfig('pika', {
      apiKey: process.env.PIKA_API_KEY,
      timeout: 120000,
      defaultQuality: 'standard',
      defaultStyle: 'cinematic',
      defaultAspectRatio: '16:9'
    });
  }

  /**
   * Generate a video with automatic provider selection and visual consistency
   */
  async generateVideo(request: GameVideoGenerationRequest): Promise<VideoGenerationResponse & { provider: string }> {
    try {
      // Apply visual consistency to the prompt
      const enhancedPrompt = this.enhancePromptWithConsistency(request);
      
      // Convert to standard video generation request
      const videoRequest: VideoGenerationRequest = {
        prompt: enhancedPrompt,
        duration: request.duration || 8,
        aspectRatio: request.aspectRatio || '16:9',
        style: request.style || 'cinematic',
        quality: request.quality || 'high',
        resolution: request.resolution || '1080p',
        frameRate: request.frameRate || 30,
        seed: request.seed,
        negativePrompt: request.negativePrompt,
        motionStrength: request.motionStrength,
        cameraMovement: request.cameraMovement,
        providerOptions: request.providerOptions
      };

      // Select best provider based on request priority
      if (request.priority === 'critical') {
        this.providerManager.setBestProvider('speed');
      } else if (request.priority === 'high') {
        this.providerManager.setBestProvider('quality');
      } else {
        this.providerManager.setBestProvider('cost');
      }

      console.log(`🎬 Generating video with enhanced prompt (${enhancedPrompt.length} chars)`);
      
      // Generate video with automatic provider fallback
      const result = await this.providerManager.generateVideo(videoRequest);
      
      // Track active generation
      this.activeGenerations.set(result.videoId, {
        provider: result.provider || 'unknown',
        startTime: Date.now()
      });

      console.log(`✅ Video generation initiated: ${result.videoId} (${result.provider})`);
      
      return result;

    } catch (error) {
      console.error('🎬 Unified video generation failed:', error);
      throw new Error(`Video generation failed: ${error.message}`);
    }
  }

  /**
   * Generate video for specific game event with context awareness
   */
  async generateEventVideo(
    eventType: string, 
    context: Record<string, any> = {},
    options: Partial<GameVideoGenerationRequest> = {}
  ): Promise<VideoGenerationResponse & { provider: string }> {
    
    // Generate base prompt for the event
    let basePrompt: string;
    
    if (context.characterId) {
      basePrompt = this.generateCharacterEventPrompt(eventType, context);
    } else if (context.locationId) {
      basePrompt = this.generateLocationEventPrompt(eventType, context);
    } else {
      basePrompt = this.generateGenericEventPrompt(eventType, context);
    }

    // Create enhanced request
    const request: GameVideoGenerationRequest = {
      prompt: basePrompt,
      duration: this.getEventDuration(eventType),
      aspectRatio: '16:9',
      style: 'cinematic',
      quality: 'high',
      priority: context.priority || 'normal',
      context: {
        eventType,
        characterId: context.characterId,
        locationId: context.locationId,
        campaignId: context.campaignId,
        gameState: context.gameState,
        colorPalette: this.getEventColorPalette(eventType),
        visualStyle: this.getEventVisualStyle(eventType),
        cinematicStyle: this.getEventCinematicStyle(eventType),
        storyMoment: context.storyMoment,
        emotionalTone: context.emotionalTone
      },
      ...options
    };

    return this.generateVideo(request);
  }

  /**
   * Check the status of a video generation
   */
  async checkVideoStatus(videoId: string): Promise<VideoGenerationResponse> {
    const generation = this.activeGenerations.get(videoId);
    
    if (generation) {
      try {
        const result = await this.providerManager.checkStatus(videoId, generation.provider);
        
        // Clean up completed generations
        if (result.status === 'completed' || result.status === 'failed' || result.status === 'cancelled') {
          this.activeGenerations.delete(videoId);
        }
        
        return result;
      } catch (error) {
        console.error(`Status check failed for ${videoId}:`, error);
        this.activeGenerations.delete(videoId);
        throw error;
      }
    }

    // Try to check status without knowing the provider
    return this.providerManager.checkStatus(videoId);
  }

  /**
   * Cancel a video generation
   */
  async cancelVideo(videoId: string): Promise<boolean> {
    const generation = this.activeGenerations.get(videoId);
    
    if (generation) {
      const success = await this.providerManager.cancelGeneration(videoId, generation.provider);
      if (success) {
        this.activeGenerations.delete(videoId);
      }
      return success;
    }

    return this.providerManager.cancelGeneration(videoId);
  }

  /**
   * Get information about all available providers
   */
  getProviderCapabilities(): Record<string, any> {
    return this.providerManager.getAllProviderCapabilities();
  }

  /**
   * Get current status of all providers
   */
  async getProviderStatus(): Promise<Record<string, { available: boolean; metrics?: any }>> {
    return this.providerManager.getProviderStatus();
  }

  /**
   * Get active generations
   */
  getActiveGenerations(): Array<{ videoId: string; provider: string; duration: number }> {
    const now = Date.now();
    return Array.from(this.activeGenerations.entries()).map(([videoId, data]) => ({
      videoId,
      provider: data.provider,
      duration: Math.floor((now - data.startTime) / 1000)
    }));
  }

  private enhancePromptWithConsistency(request: GameVideoGenerationRequest): string {
    if (request.context?.eventType) {
      return videoStyleConsistency.generateStyledPrompt(
        request.prompt,
        request.context.eventType,
        request.context
      );
    }
    
    // Apply basic visual consistency
    return videoStyleConsistency.generateStyledPrompt(
      request.prompt,
      'general',
      request.context || {}
    );
  }

  private generateCharacterEventPrompt(eventType: string, context: Record<string, any>): string {
    // This would integrate with the character system to get character details
    const characterId = context.characterId;
    const basePrompt = this.generateGenericEventPrompt(eventType, context);
    
    return `${basePrompt}

CHARACTER FOCUS:
- Feature character ${characterId} prominently in the scene
- Maintain character's established visual identity and species characteristics
- Show appropriate emotional response for ${eventType}
- Include character's typical equipment and attire`;
  }

  private generateLocationEventPrompt(eventType: string, context: Record<string, any>): string {
    const locationId = context.locationId;
    const basePrompt = this.generateGenericEventPrompt(eventType, context);
    
    return `${basePrompt}

LOCATION FOCUS:
- Set the scene in ${locationId} with accurate environmental details
- Show location's distinctive architectural and atmospheric characteristics
- Include appropriate scale and perspective for the location
- Maintain environmental consistency with established location design`;
  }

  private generateGenericEventPrompt(eventType: string, context: Record<string, any>): string {
    const eventPrompts: Record<string, string> = {
      'major_discovery': `Create an epic space fantasy discovery video showing a mystical cosmic breakthrough. 
        Include ethereal crystal telescopes, mystic scholars analyzing energy patterns, and magical reveal of the discovery. 
        Show floating holographic constellations, crystalline UI elements, and a sense of cosmic wonder and transcendence.`,
      
      'political_crisis': `Create a dramatic galactic political crisis video showing interdimensional government instability. 
        Show emergency council meetings in floating crystal chambers, concerned mystic officials, energy-broadcast news, and citizens reacting with cosmic awareness. 
        Include magnificent crystal palace governments and tense mystical atmosphere.`,
      
      'economic_milestone': `Create a prosperity celebration video for a major galactic economic milestone. 
        Show bustling crystal space ports, thriving energy colonies, successful interdimensional trade routes, and celebrating cosmic citizens. 
        Show rising energy indicators and crystalline prosperity displays with magical abundance.`,
      
      'military_conflict': `Create a military alert video showing mystical defense systems activation. 
        Show cosmic defense arrays, crystal-armored commanders in energy briefings, and ethereal fleet preparations. 
        Include magical starships with energy weapons and tactical crystal displays.`,
      
      'natural_disaster': `Create an emergency cosmic disaster video showing mystical crisis response. 
        Show energy-based emergency response teams, dimensional evacuation procedures, and magical disaster management. 
        Include crystalline emergency systems and ethereal rescue operations.`,
      
      'technology_breakthrough': `Create a mystical technology breakthrough video showcasing cosmic innovation. 
        Show floating crystal laboratories, mystic scientists celebrating, and new energy-tech demonstrations. 
        Include ethereal labs with holographic crystal displays and magical technological marvels.`
    };

    return eventPrompts[eventType] || `Create an epic cinematic video for ${eventType} game event with mystical space fantasy galactic civilization setting.`;
  }

  private getEventDuration(eventType: string): number {
    const durations: Record<string, number> = {
      'major_discovery': 10,
      'political_crisis': 6,
      'economic_milestone': 8,
      'military_conflict': 7,
      'natural_disaster': 9,
      'technology_breakthrough': 8
    };
    
    return durations[eventType] || 8;
  }

  private getEventColorPalette(eventType: string): string[] {
    const palettes: Record<string, string[]> = {
      'major_discovery': ['#00d9ff', '#0099cc', '#004d66'],
      'political_crisis': ['#ff3366', '#cc1144', '#660822'],
      'economic_milestone': ['#00ff88', '#00cc66', '#004d26'],
      'military_conflict': ['#ff9500', '#cc7700', '#663c00'],
      'natural_disaster': ['#ffdd00', '#ccaa00', '#665500'],
      'technology_breakthrough': ['#00d9ff', '#0099cc', '#004d66']
    };
    
    return palettes[eventType] || ['#00d9ff', '#0099cc', '#004d66'];
  }

  private getEventVisualStyle(eventType: string): string {
    const styles: Record<string, string> = {
      'major_discovery': 'Epic sci-fi with sense of wonder',
      'political_crisis': 'Dramatic tension with urgent atmosphere',
      'economic_milestone': 'Celebratory prosperity showcase',
      'military_conflict': 'Dynamic tactical military action',
      'natural_disaster': 'Emergency response with urgency',
      'technology_breakthrough': 'Inspiring innovation celebration'
    };
    
    return styles[eventType] || 'Cinematic sci-fi';
  }

  private getEventCinematicStyle(eventType: string): string {
    const styles: Record<string, string> = {
      'major_discovery': 'Sweeping camera movements with dramatic reveals',
      'political_crisis': 'Quick cuts with handheld urgency',
      'economic_milestone': 'Steady celebratory camera work',
      'military_conflict': 'Dynamic tactical angles',
      'natural_disaster': 'Urgent handheld emergency style',
      'technology_breakthrough': 'Smooth tech-focused cinematography'
    };
    
    return styles[eventType] || 'Professional cinematic style';
  }
}

// Export singleton instance
export const unifiedVideoService = new UnifiedVideoService();

export default UnifiedVideoService;

