// Using built-in fetch (Node.js 18+)
import { videoStyleConsistency } from './VideoStyleConsistency.js';

interface VEO3VideoRequest {
  prompt: string;
  duration?: number; // seconds, typically 5-10 for VEO 3
  aspectRatio?: '16:9' | '9:16' | '1:1';
  style?: 'cinematic' | 'documentary' | 'animated' | 'realistic';
  quality?: 'standard' | 'high';
}

interface VEO3VideoResponse {
  videoId: string;
  status: 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  error?: string;
}

class VEO3VideoGenerator {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ GOOGLE_API_KEY not found. VEO 3 video generation will use mock responses.');
    }
  }

  async generateVideo(request: VEO3VideoRequest): Promise<VEO3VideoResponse> {
    if (!this.apiKey) {
      return this.generateMockVideo(request);
    }

    try {
      // Note: This is a conceptual implementation
      // The actual VEO 3 API endpoints may differ when officially released
      const response = await fetch(`${this.baseUrl}/models/veo-3:generateVideo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          duration: request.duration || 8,
          aspectRatio: request.aspectRatio || '16:9',
          style: request.style || 'cinematic',
          quality: request.quality || 'high'
        })
      });

      if (!response.ok) {
        throw new Error(`VEO 3 API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      
      return {
        videoId: data.videoId || `veo3_${Date.now()}`,
        status: data.status || 'processing',
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
        duration: data.duration || request.duration || 8
      };

    } catch (error) {
      console.error('VEO 3 video generation failed:', error);
      
      // Fallback to mock video
      return this.generateMockVideo(request);
    }
  }

  private generateMockVideo(request: VEO3VideoRequest): VEO3VideoResponse {
    const videoId = `mock_veo3_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate mock video based on prompt content
    const mockVideoUrl = this.getMockVideoUrl(request.prompt);
    const mockThumbnailUrl = this.getMockThumbnailUrl(request.prompt);
    
    console.log(`🎬 VEO 3 Mock: Generated video for prompt: "${request.prompt.substring(0, 50)}..."`);
    
    return {
      videoId,
      status: 'completed',
      videoUrl: mockVideoUrl,
      thumbnailUrl: mockThumbnailUrl,
      duration: request.duration || 8
    };
  }

  private getMockVideoUrl(prompt: string): string {
    // Analyze prompt to determine appropriate mock video
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

  // Generate contextual prompts for different game events with visual consistency
  generatePromptForEvent(eventType: string, context: Record<string, any>): string {
    const basePrompts = {
      'major_discovery': this.generateDiscoveryPrompt(context),
      'political_crisis': this.generatePoliticalCrisisPrompt(context),
      'economic_milestone': this.generateEconomicPrompt(context),
      'military_conflict': this.generateMilitaryPrompt(context),
      'natural_disaster': this.generateDisasterPrompt(context),
      'technology_breakthrough': this.generateTechnologyPrompt(context),
      'population_milestone': this.generatePopulationPrompt(context),
      'colony_established': this.generateColonyPrompt(context),
      'diplomatic_achievement': this.generateDiplomaticPrompt(context)
    };

    const basePrompt = basePrompts[eventType as keyof typeof basePrompts] || this.generateGenericPrompt(eventType, context);
    
    // Apply visual consistency styling
    return videoStyleConsistency.generateStyledPrompt(basePrompt, eventType, context);
  }

  // Generate character-specific video prompts
  generateCharacterVideoPrompt(characterId: string, eventType: string, context: Record<string, any>): string {
    const basePrompt = this.generatePromptForEvent(eventType, context);
    return videoStyleConsistency.generateCharacterConsistentPrompt(characterId, basePrompt, context);
  }

  // Generate location-specific video prompts
  generateLocationVideoPrompt(locationId: string, eventType: string, context: Record<string, any>): string {
    const basePrompt = this.generatePromptForEvent(eventType, context);
    return videoStyleConsistency.generateLocationConsistentPrompt(locationId, basePrompt, context);
  }

  private generateDiscoveryPrompt(context: Record<string, any>): string {
    const location = context.location || 'distant star system';
    const discoveryType = context.discoveryType || 'mysterious signal';
    
    return `Create a cinematic space discovery video showing ${discoveryType} detected in ${location}. 
    Show deep space telescopes, scientists analyzing data, and dramatic reveal of the discovery. 
    Include futuristic UI elements, holographic displays, and a sense of wonder and excitement. 
    Style: Epic sci-fi cinematography with dramatic lighting and sweeping camera movements.`;
  }

  private generatePoliticalCrisisPrompt(context: Record<string, any>): string {
    const stabilityChange = context.stabilityChange || -25;
    
    return `Create a dramatic political crisis video showing government instability with ${Math.abs(stabilityChange)}% stability drop. 
    Show emergency government meetings, concerned officials, news broadcasts, and citizens reacting. 
    Include futuristic government buildings, holographic news displays, and tense atmosphere. 
    Style: Serious documentary tone with quick cuts and urgent pacing.`;
  }

  private generateEconomicPrompt(context: Record<string, any>): string {
    const gdpGrowth = context.gdpGrowth || 30;
    
    return `Create an economic success video celebrating ${gdpGrowth}% GDP growth milestone. 
    Show bustling space ports, thriving colonies, successful trade routes, and celebrating citizens. 
    Include futuristic economic displays, rising charts, and prosperity indicators. 
    Style: Uplifting and energetic with bright colors and dynamic transitions.`;
  }

  private generateMilitaryPrompt(context: Record<string, any>): string {
    const threatLevel = context.threatLevel || 'high';
    
    return `Create a military alert video showing ${threatLevel} threat level detected. 
    Show space defense systems activating, military commanders in briefings, and fleet preparations. 
    Include futuristic warships, tactical displays, and red alert atmospheres. 
    Style: Intense military thriller with dramatic music and strategic camera angles.`;
  }

  private generateDisasterPrompt(context: Record<string, any>): string {
    const severity = context.severity || 'major';
    const disasterType = context.disasterType || 'natural catastrophe';
    
    return `Create an emergency disaster video showing ${severity} ${disasterType} affecting the civilization. 
    Show emergency response teams, evacuation procedures, and disaster impact scenes. 
    Include futuristic emergency systems, rescue operations, and crisis management. 
    Style: Urgent documentary with handheld camera work and emergency lighting.`;
  }

  private generateTechnologyPrompt(context: Record<string, any>): string {
    const techType = context.techType || 'advanced technology';
    
    return `Create a technology breakthrough video showcasing ${techType} achievement. 
    Show research laboratories, scientists celebrating, and the new technology in action. 
    Include futuristic labs, holographic tech displays, and innovation demonstrations. 
    Style: Inspiring and futuristic with clean aesthetics and smooth camera movements.`;
  }

  private generatePopulationPrompt(context: Record<string, any>): string {
    const population = context.population || 1000000;
    
    return `Create a population milestone video celebrating ${(population / 1000000).toFixed(1)} million citizens. 
    Show thriving cities, diverse populations, and celebration events across colonies. 
    Include futuristic cityscapes, population counters, and community gatherings. 
    Style: Celebratory and diverse with warm lighting and community focus.`;
  }

  private generateColonyPrompt(context: Record<string, any>): string {
    const colonyName = context.colonyName || 'New Settlement';
    const planetType = context.planetType || 'terrestrial world';
    
    return `Create a colony establishment video showing ${colonyName} being founded on a ${planetType}. 
    Show colonists arriving, construction beginning, and the first settlements taking shape. 
    Include spacecraft landings, construction equipment, and pioneering spirit. 
    Style: Epic and hopeful with sweeping planetary vistas and human achievement themes.`;
  }

  private generateDiplomaticPrompt(context: Record<string, any>): string {
    const allianceCount = context.allianceCount || 3;
    
    return `Create a diplomatic achievement video showing formation of ${allianceCount} galactic alliances. 
    Show diplomatic meetings, treaty signings, and representatives from different civilizations. 
    Include futuristic diplomatic chambers, holographic communications, and unity celebrations. 
    Style: Formal and dignified with ceremonial atmosphere and multicultural representation.`;
  }

  private generateGenericPrompt(eventType: string, context: Record<string, any>): string {
    return `Create a cinematic video for ${eventType} game event. 
    Show futuristic sci-fi setting with appropriate dramatic tone for the situation. 
    Include advanced technology, space environments, and engaging visual storytelling. 
    Style: High-quality sci-fi cinematography with professional production values.`;
  }

  // Check video generation status (for async operations)
  async checkVideoStatus(videoId: string): Promise<VEO3VideoResponse> {
    if (!this.apiKey) {
      // Mock videos are always completed immediately
      return {
        videoId,
        status: 'completed',
        videoUrl: '/api/videos/mock/general_announcement.mp4',
        thumbnailUrl: '/api/videos/mock/general_announcement_thumb.jpg',
        duration: 8
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/videos/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`VEO 3 status check failed: ${response.status}`);
      }

      return await response.json() as VEO3VideoResponse;

    } catch (error) {
      console.error('VEO 3 status check failed:', error);
      return {
        videoId,
        status: 'failed',
        error: 'Failed to check video status'
      };
    }
  }
}

// Create singleton instance
export const veo3VideoGenerator = new VEO3VideoGenerator();

export default veo3VideoGenerator;
