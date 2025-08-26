import express from 'express';
import { WebSocket } from 'ws';
import { veo3VideoGenerator } from './VEO3VideoGenerator.js';
import { unifiedVideoService } from './UnifiedVideoService.js';

interface GameMasterVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  triggerEvent: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  autoPlay: boolean;
  skipable: boolean;
  targetPlayers?: string[]; // If empty, broadcast to all players
  campaignId: string;
}

interface VideoTrigger {
  eventType: string;
  conditions: Record<string, any>;
  videoTemplate: Partial<GameMasterVideo>;
  cooldownMinutes?: number;
  maxTriggersPerSession?: number;
}

class GameMasterVideoService {
  private activeVideos: Map<string, GameMasterVideo> = new Map();
  private videoTriggers: VideoTrigger[] = [];
  private triggerCooldowns: Map<string, number> = new Map();
  private sessionTriggerCounts: Map<string, number> = new Map();
  private wsClients: Set<WebSocket> = new Set();

  constructor() {
    this.initializeDefaultTriggers();
  }

  // WebSocket management
  addWebSocketClient(ws: WebSocket) {
    this.wsClients.add(ws);
    ws.on('close', () => {
      this.wsClients.delete(ws);
    });
  }

  private broadcastToPlayers(video: GameMasterVideo) {
    const message = JSON.stringify({
      type: 'gm_video',
      data: video
    });

    this.wsClients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(message);
        } catch (error) {
          console.error('Failed to send video to client:', error);
          this.wsClients.delete(ws);
        }
      }
    });

    console.log(`🎬 Game Master: Broadcasting video "${video.title}" to ${this.wsClients.size} players`);
  }

  // Video generation and management
  async generateVideo(trigger: VideoTrigger, context: Record<string, any>): Promise<GameMasterVideo> {
    const videoId = `gm_video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate video content based on trigger and context
    const video: GameMasterVideo = {
      id: videoId,
      title: this.generateTitle(trigger, context),
      description: this.generateDescription(trigger, context),
      videoUrl: await this.generateVideoUrl(trigger, context),
      thumbnailUrl: await this.generateThumbnailUrl(trigger, context),
      duration: this.estimateDuration(trigger, context),
      triggerEvent: trigger.eventType,
      timestamp: new Date().toISOString(),
      priority: trigger.videoTemplate.priority || 'medium',
      autoPlay: trigger.videoTemplate.autoPlay ?? true,
      skipable: trigger.videoTemplate.skipable ?? true,
      targetPlayers: trigger.videoTemplate.targetPlayers || [],
      campaignId: context.campaignId || 'default',
      ...trigger.videoTemplate
    };

    this.activeVideos.set(videoId, video);
    return video;
  }

  async triggerVideo(eventType: string, context: Record<string, any>): Promise<GameMasterVideo | null> {
    const trigger = this.videoTriggers.find(t => t.eventType === eventType);
    if (!trigger) return null;

    // Check cooldown
    const cooldownKey = `${eventType}_${context.campaignId || 'default'}`;
    const lastTrigger = this.triggerCooldowns.get(cooldownKey) || 0;
    const cooldownMs = (trigger.cooldownMinutes || 5) * 60 * 1000;
    
    if (Date.now() - lastTrigger < cooldownMs) {
      console.log(`🎬 Game Master: Video trigger "${eventType}" is on cooldown`);
      return null;
    }

    // Check session limits
    const sessionKey = `${eventType}_session`;
    const sessionCount = this.sessionTriggerCounts.get(sessionKey) || 0;
    const maxTriggers = trigger.maxTriggersPerSession || 10;
    
    if (sessionCount >= maxTriggers) {
      console.log(`🎬 Game Master: Video trigger "${eventType}" has reached session limit`);
      return null;
    }

    // Generate and broadcast video
    try {
      const video = await this.generateVideo(trigger, context);
      this.broadcastToPlayers(video);
      
      // Update cooldowns and counts
      this.triggerCooldowns.set(cooldownKey, Date.now());
      this.sessionTriggerCounts.set(sessionKey, sessionCount + 1);
      
      return video;
    } catch (error) {
      console.error('Failed to generate Game Master video:', error);
      return null;
    }
  }

  // Content generation methods
  private generateTitle(trigger: VideoTrigger, context: Record<string, any>): string {
    const titles = {
      'major_discovery': [
        'Galactic Discovery Alert',
        'Breaking: New World Found',
        'Scientific Breakthrough Detected',
        'Exploration Success Report'
      ],
      'political_crisis': [
        'Emergency Political Briefing',
        'Diplomatic Crisis Alert',
        'Government Stability Warning',
        'Political Situation Update'
      ],
      'economic_milestone': [
        'Economic Achievement Unlocked',
        'Trade Milestone Reached',
        'Financial Success Report',
        'Economic Growth Alert'
      ],
      'military_conflict': [
        'Military Action Report',
        'Conflict Status Update',
        'Defense Alert Issued',
        'Strategic Situation Brief'
      ],
      'natural_disaster': [
        'Emergency Disaster Alert',
        'Natural Catastrophe Report',
        'Crisis Response Activated',
        'Emergency Situation Update'
      ],
      'technology_breakthrough': [
        'Technology Breakthrough',
        'Innovation Alert',
        'Research Success Report',
        'Scientific Advancement'
      ]
    };

    const eventTitles = titles[trigger.eventType as keyof typeof titles] || ['Game Master Message'];
    const baseTitle = eventTitles[Math.floor(Math.random() * eventTitles.length)];
    
    // Add context-specific details
    if (context.location) {
      return `${baseTitle} - ${context.location}`;
    }
    
    return baseTitle;
  }

  private generateDescription(trigger: VideoTrigger, context: Record<string, any>): string {
    const descriptions = {
      'major_discovery': 'A significant discovery has been made that will impact the future of our civilization.',
      'political_crisis': 'Political tensions have reached a critical point requiring immediate attention.',
      'economic_milestone': 'Our economic achievements have reached a new milestone worth celebrating.',
      'military_conflict': 'Military developments require strategic consideration and response.',
      'natural_disaster': 'Natural forces have created an emergency situation requiring immediate action.',
      'technology_breakthrough': 'Technological advancement opens new possibilities for our civilization.'
    };

    let baseDescription = descriptions[trigger.eventType as keyof typeof descriptions] || 
                         'An important development requires your attention.';

    // Add context details
    if (context.details) {
      baseDescription += ` ${context.details}`;
    }

    return baseDescription;
  }

  private async generateVideoUrl(trigger: VideoTrigger, context: Record<string, any>): Promise<string> {
    try {
      console.log(`🎬 Unified Video Service: Generating video for ${trigger.eventType}`);
      
      // Use unified video service for multi-provider support
      const videoResponse = await unifiedVideoService.generateEventVideo(
        trigger.eventType,
        context,
        {
          duration: this.estimateDuration(trigger, context),
          aspectRatio: '16:9',
          style: 'cinematic',
          quality: 'high',
          priority: context.priority || 'normal'
        }
      );

      if (videoResponse.status === 'completed' && videoResponse.videoUrl) {
        console.log(`🎬 ${videoResponse.provider}: Video generated successfully - ${videoResponse.videoUrl}`);
        return videoResponse.videoUrl;
      } else if (videoResponse.status === 'processing' || videoResponse.status === 'queued') {
        console.log(`🎬 ${videoResponse.provider}: Video is ${videoResponse.status} - ${videoResponse.videoId}`);
        return videoResponse.videoUrl || '/api/videos/processing_placeholder.mp4';
      } else {
        console.error(`🎬 ${videoResponse.provider}: Video generation failed - ${videoResponse.error}`);
        return this.getFallbackVideoUrl(trigger.eventType);
      }
    } catch (error) {
      console.error('🎬 Unified Video Service: Video generation error:', error);
      
      // Fallback to original VEO 3 system
      try {
        console.log('🎬 Falling back to VEO 3 direct generation...');
        const prompt = veo3VideoGenerator.generatePromptForEvent(trigger.eventType, context);
        const videoResponse = await veo3VideoGenerator.generateVideo({
          prompt,
          duration: this.estimateDuration(trigger, context),
          aspectRatio: '16:9',
          style: 'cinematic',
          quality: 'high'
        });
        
        return videoResponse.videoUrl || this.getFallbackVideoUrl(trigger.eventType);
      } catch (fallbackError) {
        console.error('🎬 Fallback generation also failed:', fallbackError);
        return this.getFallbackVideoUrl(trigger.eventType);
      }
    }
  }

  private getFallbackVideoUrl(eventType: string): string {
    // Fallback to mock videos if VEO 3 fails
    const mockVideos = {
      'major_discovery': '/api/videos/mock/space_discovery.mp4',
      'political_crisis': '/api/videos/mock/political_crisis.mp4',
      'economic_milestone': '/api/videos/mock/economic_success.mp4',
      'military_conflict': '/api/videos/mock/military_alert.mp4',
      'natural_disaster': '/api/videos/mock/disaster_alert.mp4',
      'technology_breakthrough': '/api/videos/mock/tech_breakthrough.mp4'
    };

    return mockVideos[eventType as keyof typeof mockVideos] || '/api/videos/mock/general_announcement.mp4';
  }

  private async generateThumbnailUrl(trigger: VideoTrigger, context: Record<string, any>): Promise<string> {
    // Generate thumbnail for the video
    const mockThumbnails = {
      'major_discovery': '/api/thumbnails/discovery.jpg',
      'political_crisis': '/api/thumbnails/political.jpg',
      'economic_milestone': '/api/thumbnails/economic.jpg',
      'military_conflict': '/api/thumbnails/military.jpg',
      'natural_disaster': '/api/thumbnails/disaster.jpg',
      'technology_breakthrough': '/api/thumbnails/technology.jpg'
    };

    return mockThumbnails[trigger.eventType as keyof typeof mockThumbnails] || '/api/thumbnails/default.jpg';
  }

  private estimateDuration(trigger: VideoTrigger, context: Record<string, any>): number {
    // Estimate video duration based on content complexity
    const baseDurations = {
      'major_discovery': 45,
      'political_crisis': 60,
      'economic_milestone': 30,
      'military_conflict': 75,
      'natural_disaster': 90,
      'technology_breakthrough': 50
    };

    return baseDurations[trigger.eventType as keyof typeof baseDurations] || 45;
  }

  private initializeDefaultTriggers() {
    this.videoTriggers = [
      {
        eventType: 'major_discovery',
        conditions: { discoveryType: 'planet', significance: 'high' },
        videoTemplate: {
          priority: 'high',
          autoPlay: true,
          skipable: true
        },
        cooldownMinutes: 30,
        maxTriggersPerSession: 3
      },
      {
        eventType: 'political_crisis',
        conditions: { stabilityChange: -20 },
        videoTemplate: {
          priority: 'critical',
          autoPlay: true,
          skipable: false
        },
        cooldownMinutes: 15,
        maxTriggersPerSession: 5
      },
      {
        eventType: 'economic_milestone',
        conditions: { gdpGrowth: 25 },
        videoTemplate: {
          priority: 'medium',
          autoPlay: true,
          skipable: true
        },
        cooldownMinutes: 60,
        maxTriggersPerSession: 2
      },
      {
        eventType: 'military_conflict',
        conditions: { threatLevel: 'high' },
        videoTemplate: {
          priority: 'high',
          autoPlay: true,
          skipable: false
        },
        cooldownMinutes: 20,
        maxTriggersPerSession: 4
      },
      {
        eventType: 'natural_disaster',
        conditions: { severity: 'major' },
        videoTemplate: {
          priority: 'critical',
          autoPlay: true,
          skipable: false
        },
        cooldownMinutes: 45,
        maxTriggersPerSession: 3
      },
      {
        eventType: 'technology_breakthrough',
        conditions: { researchLevel: 'breakthrough' },
        videoTemplate: {
          priority: 'medium',
          autoPlay: true,
          skipable: true
        },
        cooldownMinutes: 90,
        maxTriggersPerSession: 2
      }
    ];
  }

  // API methods
  getActiveVideos(): GameMasterVideo[] {
    return Array.from(this.activeVideos.values());
  }

  getVideo(videoId: string): GameMasterVideo | undefined {
    return this.activeVideos.get(videoId);
  }

  dismissVideo(videoId: string): boolean {
    return this.activeVideos.delete(videoId);
  }

  addTrigger(trigger: VideoTrigger): void {
    this.videoTriggers.push(trigger);
  }

  getTriggers(): VideoTrigger[] {
    return [...this.videoTriggers];
  }

  clearSessionCounts(): void {
    this.sessionTriggerCounts.clear();
  }
}

// Create singleton instance
export const gameMasterVideoService = new GameMasterVideoService();

// Express routes
export const createGameMasterVideoRoutes = () => {
  const router = express.Router();

  // Get all active videos
  router.get('/videos', (req, res) => {
    res.json({
      success: true,
      videos: gameMasterVideoService.getActiveVideos()
    });
  });

  // Get specific video
  router.get('/videos/:videoId', (req, res) => {
    const video = gameMasterVideoService.getVideo(req.params.videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    res.json({
      success: true,
      video
    });
  });

  // Manually trigger a video
  router.post('/trigger', async (req, res) => {
    const { eventType, context } = req.body;
    
    if (!eventType) {
      return res.status(400).json({
        success: false,
        error: 'Event type is required'
      });
    }

    try {
      const video = await gameMasterVideoService.triggerVideo(eventType, context || {});
      
      if (!video) {
        return res.status(429).json({
          success: false,
          error: 'Video trigger is on cooldown or limit reached'
        });
      }

      res.json({
        success: true,
        video
      });
    } catch (error) {
      console.error('Error triggering video:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to trigger video'
      });
    }
  });

  // Dismiss a video
  router.delete('/videos/:videoId', (req, res) => {
    const success = gameMasterVideoService.dismissVideo(req.params.videoId);
    res.json({ success });
  });

  // Get available triggers
  router.get('/triggers', (req, res) => {
    res.json({
      success: true,
      triggers: gameMasterVideoService.getTriggers()
    });
  });

  // Add new trigger
  router.post('/triggers', (req, res) => {
    try {
      gameMasterVideoService.addTrigger(req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Invalid trigger configuration'
      });
    }
  });

  // Clear session counts (admin)
  router.post('/admin/clear-session', (req, res) => {
    gameMasterVideoService.clearSessionCounts();
    res.json({ success: true });
  });

  return router;
};

export default gameMasterVideoService;
