import { Pool } from 'pg';
import { getAIService } from '../ai/AIService.js';
import { UnifiedImageGenerationService } from '../visual/UnifiedImageGenerationService.js';

export interface StoryEvent {
  id: string;
  title: string;
  description: string;
  type: 'story' | 'crisis' | 'achievement' | 'discovery' | 'plot_twist' | 'climax' | 'challenge';
  storyArc: string; // Which story arc this belongs to
  visualContent?: string; // AI-generated image URL
  videoContent?: string; // AI-generated video URL
  audioNarration?: string; // Audio file URL for TTS narration
  dramaticNarration: string; // TTS-ready dramatic text with stage directions
  cinematicDescription: string; // Rich visual description for image/video generation
  timestamp: Date;
  requiresResponse: boolean;
  playerChoices?: StoryChoice[];
  consequences?: string[];
  missionIds?: string[]; // Related missions
  characterIds?: string[]; // Characters involved
  urgency: 'low' | 'medium' | 'high' | 'critical';
  storyPhase: 'setup' | 'rising_action' | 'climax' | 'falling_action' | 'resolution';
  mediaGenerated: boolean; // Track if visual media has been generated
}

export interface StoryChoice {
  id: string;
  text: string;
  consequences: string[];
  missionTriggers?: string[];
  characterReactions?: { characterId: string; reaction: string }[];
}

export interface StoryArc {
  id: string;
  title: string;
  description: string;
  theme: string; // e.g., 'political intrigue', 'alien contact', 'economic crisis'
  currentPhase: 'setup' | 'rising_action' | 'climax' | 'falling_action' | 'resolution';
  startDate: Date;
  estimatedDuration: number; // in game days
  events: StoryEvent[];
  characters: string[]; // Character IDs involved
  missions: string[]; // Mission IDs created by this arc
  playerChoices: { eventId: string; choiceId: string; timestamp: Date }[];
}

export interface GameMasterMessage {
  id: string;
  type: 'story_update' | 'plot_twist' | 'challenge' | 'mission_briefing' | 'character_message';
  title: string;
  content: string;
  sender: 'Game Master' | string; // Character name if from character
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  relatedEventId?: string;
  relatedMissionId?: string;
  requiresAction: boolean;
  actionOptions?: { id: string; text: string; outcome: string }[];
}

export class GameMasterStoryEngine {
  private pool: Pool;
  private aiService: any;
  private visualEngine: UnifiedImageGenerationService;
  private activeStoryArcs: Map<number, StoryArc[]> = new Map(); // civilizationId -> story arcs
  private storyTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(pool: Pool) {
    this.pool = pool;
    this.aiService = getAIService();
    try {
      this.visualEngine = new UnifiedImageGenerationService();
    } catch (error) {
      console.warn('Visual Systems Engine not available for story generation:', error.message);
      this.visualEngine = null;
    }
  }

  async initializeStoryForCivilization(civilizationId: number, gameTheme: string = 'space_opera'): Promise<void> {
    console.log(`🎭 Initializing story for civilization ${civilizationId} with theme: ${gameTheme}`);
    
    // Create initial story arc
    const initialArc = await this.createStoryArc(civilizationId, gameTheme);
    
    // Store in active arcs
    if (!this.activeStoryArcs.has(civilizationId)) {
      this.activeStoryArcs.set(civilizationId, []);
    }
    this.activeStoryArcs.get(civilizationId)!.push(initialArc);
    
    // Generate opening story event
    await this.generateOpeningEvent(civilizationId, initialArc);
    
    // Schedule future events
    this.scheduleStoryProgression(civilizationId, initialArc.id);
  }

  private async createStoryArc(civilizationId: number, theme: string): Promise<StoryArc> {
    const storyPrompt = `
    Create an engaging story arc for a galactic civilization simulation game.
    
    Theme: ${theme}
    Civilization ID: ${civilizationId}
    
    Generate a compelling story arc with:
    - A central conflict or mystery
    - Multiple phases (setup, rising action, climax, falling action, resolution)
    - Opportunities for player choices that matter
    - Integration with economic, political, and military systems
    - Character-driven subplots
    - Unexpected plot twists
    
    The story should be epic in scope but personal in impact, affecting both the civilization and individual characters.
    Make it engaging, dramatic, and fun with high stakes and meaningful consequences.
    
    Return a JSON object with title, description, theme, and estimated duration in game days.
    `;

    try {
      const response = await this.aiService.generateContent(storyPrompt, {
        temperature: 0.8,
        maxTokens: 1000
      });

      const storyData = JSON.parse(response);
      
      const storyArc: StoryArc = {
        id: `arc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: storyData.title,
        description: storyData.description,
        theme: storyData.theme || theme,
        currentPhase: 'setup',
        startDate: new Date(),
        estimatedDuration: storyData.estimatedDuration || 30,
        events: [],
        characters: [],
        missions: [],
        playerChoices: []
      };

      return storyArc;
    } catch (error) {
      console.error('Error creating story arc:', error);
      // Fallback to default story arc
      return {
        id: `arc_${Date.now()}_fallback`,
        title: 'The Galactic Convergence',
        description: 'Ancient signals from the galaxy\'s core suggest a long-dormant civilization is awakening. Your choices will determine whether this leads to enlightenment or catastrophe.',
        theme: 'ancient_mystery',
        currentPhase: 'setup',
        startDate: new Date(),
        estimatedDuration: 45,
        events: [],
        characters: [],
        missions: [],
        playerChoices: []
      };
    }
  }

  private async generateOpeningEvent(civilizationId: number, storyArc: StoryArc): Promise<void> {
    const eventPrompt = `
    Generate an opening story event for the story arc: "${storyArc.title}"
    
    Description: ${storyArc.description}
    Theme: ${storyArc.theme}
    
    Create an engaging opening event that:
    - Sets up the central mystery/conflict
    - Introduces key stakes
    - Provides meaningful player choices
    - Creates urgency and interest
    - Connects to the civilization's current state
    
    The event should be dramatic but not overwhelming, establishing the tone for the entire arc.
    
    Return JSON with: 
    - title: Event title
    - description: Brief event description
    - dramaticNarration: Dramatic, TTS-ready narration with stage directions in [brackets] like [PAUSE], [DRAMATIC WHISPER], [RISING TENSION]
    - cinematicDescription: Rich visual description for AI image/video generation
    - playerChoices: Array of choice objects with text and consequences
    - urgency: Urgency level
    `;

    try {
      const response = await this.aiService.generateContent(eventPrompt, {
        temperature: 0.7,
        maxTokens: 1200
      });

      const eventData = JSON.parse(response);
      
      const storyEvent: StoryEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: eventData.title,
        description: eventData.description,
        dramaticNarration: eventData.dramaticNarration || eventData.description,
        cinematicDescription: eventData.cinematicDescription || `Epic galactic scene: ${eventData.description}`,
        type: 'story',
        storyArc: storyArc.id,
        timestamp: new Date(),
        requiresResponse: true,
        playerChoices: eventData.playerChoices || [],
        urgency: eventData.urgency || 'medium',
        storyPhase: 'setup',
        mediaGenerated: false
      };

      // Generate visual media for the event
      await this.generateEventMedia(storyEvent);

      // Add to story arc
      storyArc.events.push(storyEvent);
      
      // Store in database
      await this.saveStoryEvent(civilizationId, storyEvent);
      
      // Send Game Master message with dramatic flair
      await this.sendGameMasterMessage(civilizationId, {
        id: `msg_${Date.now()}`,
        type: 'story_update',
        title: `🎭 New Story: ${storyEvent.title}`,
        content: `${storyEvent.dramaticNarration}\n\n[PAUSE] This marks the beginning of a new chapter in your civilization's history. Your choices will shape the outcome. [DRAMATIC EMPHASIS]`,
        sender: 'Game Master',
        timestamp: new Date(),
        priority: 'high',
        relatedEventId: storyEvent.id,
        requiresAction: true,
        actionOptions: storyEvent.playerChoices?.map(choice => ({
          id: choice.id,
          text: choice.text,
          outcome: choice.consequences.join(', ')
        }))
      });

    } catch (error) {
      console.error('Error generating opening event:', error);
      // Fallback event
      await this.createFallbackOpeningEvent(civilizationId, storyArc);
    }
  }

  private async createFallbackOpeningEvent(civilizationId: number, storyArc: StoryArc): Promise<void> {
    const fallbackEvent: StoryEvent = {
      id: `event_${Date.now()}_fallback`,
      title: 'Mysterious Signals Detected',
      description: 'Your deep space monitoring stations have detected unusual energy signatures emanating from the galactic core. The patterns suggest artificial origin, but the technology appears far beyond current understanding.',
      dramaticNarration: '[MYSTERIOUS TONE] Deep in the void of space, your monitoring stations have detected something... extraordinary. [PAUSE] Energy signatures unlike anything in our databases pulse from the galactic core. [RISING TENSION] The patterns suggest artificial origin, but the technology... [WHISPER] appears far beyond current understanding. [DRAMATIC PAUSE] What ancient intelligence stirs in the heart of our galaxy?',
      cinematicDescription: 'A vast galactic core pulsing with mysterious energy, ancient alien technology awakening in deep space, monitoring stations detecting strange signals, dramatic cosmic vista with swirling nebulae and distant stars',
      type: 'discovery',
      storyArc: storyArc.id,
      timestamp: new Date(),
      requiresResponse: true,
      playerChoices: [
        {
          id: 'investigate',
          text: 'Launch immediate investigation mission',
          consequences: ['High resource cost', 'Potential major discovery', 'Risk to exploration teams']
        },
        {
          id: 'monitor',
          text: 'Continue monitoring and gather more data',
          consequences: ['Lower cost', 'Delayed progress', 'Safer approach']
        },
        {
          id: 'ignore',
          text: 'Focus on internal development instead',
          consequences: ['No immediate cost', 'Missed opportunity', 'Unknown future consequences']
        }
      ],
      urgency: 'medium',
      storyPhase: 'setup',
      mediaGenerated: false
    };

    // Generate visual media for fallback event too
    await this.generateEventMedia(fallbackEvent);

    storyArc.events.push(fallbackEvent);
    await this.saveStoryEvent(civilizationId, fallbackEvent);
  }

  /**
   * Generate visual media (images and videos) for a story event
   */
  private async generateEventMedia(storyEvent: StoryEvent): Promise<void> {
    if (!this.visualEngine) {
      console.log('📸 Visual engine not available, skipping media generation for:', storyEvent.title);
      return;
    }

    try {
      console.log(`🎬 Generating visual media for story event: ${storyEvent.title}`);

      // Generate image for the event
      const imagePrompt = `${storyEvent.cinematicDescription}, cinematic composition, dramatic lighting, epic scale, high quality digital art, galactic civilization theme`;
      
      const imageResult = await this.visualEngine.generateImage({
        prompt: imagePrompt,
        style: 'cinematic',
        aspectRatio: '16:9',
        quality: 'high'
      });

      if (imageResult && imageResult.url) {
        storyEvent.visualContent = imageResult.url;
        console.log(`📸 Generated image for ${storyEvent.title}: ${imageResult.url}`);
      }

      // For critical/climax events, also generate video
      if (storyEvent.urgency === 'critical' || storyEvent.type === 'climax' || storyEvent.type === 'plot_twist') {
        const videoPrompt = `${storyEvent.cinematicDescription}, dramatic camera movements, epic space opera cinematography, high production value`;
        
        const videoResult = await this.visualEngine.generateVideo({
          prompt: videoPrompt,
          duration: 10, // 10 seconds
          style: 'cinematic',
          quality: 'high'
        });

        if (videoResult && videoResult.url) {
          storyEvent.videoContent = videoResult.url;
          console.log(`🎥 Generated video for ${storyEvent.title}: ${videoResult.url}`);
        }
      }

      storyEvent.mediaGenerated = true;

    } catch (error) {
      console.error('Error generating visual media for story event:', error);
      storyEvent.mediaGenerated = false;
    }
  }

  async generatePlotTwist(civilizationId: number, storyArcId: string): Promise<void> {
    const storyArc = this.getStoryArc(civilizationId, storyArcId);
    if (!storyArc) return;

    const twistPrompt = `
    Generate a dramatic plot twist for the ongoing story: "${storyArc.title}"
    
    Current phase: ${storyArc.currentPhase}
    Previous events: ${storyArc.events.map(e => e.title).join(', ')}
    Player choices made: ${storyArc.playerChoices.length}
    
    Create a plot twist that:
    - Recontextualizes previous events
    - Raises the stakes significantly
    - Creates new challenges and opportunities
    - Surprises but makes sense in hindsight
    - Drives the story toward climax
    
    The twist should be dramatic and impactful, changing the player's understanding of the situation.
    
    Return JSON with: 
    - title: Dramatic twist title
    - description: Brief description
    - dramaticNarration: Shocking TTS-ready narration with stage directions like [SUDDEN REVELATION], [OMINOUS TONE], [DRAMATIC GASP]
    - cinematicDescription: Visual description for dramatic twist imagery
    - newChallenges: Array of new challenges
    - immediateConsequences: Array of immediate consequences
    - urgency: Urgency level (should be high/critical for twists)
    `;

    try {
      const response = await this.aiService.generateContent(twistPrompt, {
        temperature: 0.9,
        maxTokens: 1200
      });

      const twistData = JSON.parse(response);
      
      const plotTwistEvent: StoryEvent = {
        id: `twist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: twistData.title,
        description: twistData.description,
        dramaticNarration: twistData.dramaticNarration || `[SUDDEN REVELATION] ${twistData.description} [DRAMATIC PAUSE] Everything you thought you knew... was wrong.`,
        cinematicDescription: twistData.cinematicDescription || `Shocking plot twist revelation, dramatic lighting, characters in disbelief, galactic conspiracy unveiled, epic space opera moment`,
        type: 'plot_twist',
        storyArc: storyArc.id,
        timestamp: new Date(),
        requiresResponse: true,
        consequences: twistData.immediateConsequences,
        urgency: twistData.urgency || 'critical',
        storyPhase: storyArc.currentPhase,
        mediaGenerated: false
      };

      // Generate dramatic visual media for the twist
      await this.generateEventMedia(plotTwistEvent);

      storyArc.events.push(plotTwistEvent);
      await this.saveStoryEvent(civilizationId, plotTwistEvent);

      // Send dramatic Game Master message with enhanced narration
      await this.sendGameMasterMessage(civilizationId, {
        id: `twist_msg_${Date.now()}`,
        type: 'plot_twist',
        title: `🌟 PLOT TWIST: ${plotTwistEvent.title}`,
        content: `${plotTwistEvent.dramaticNarration}\n\n[OMINOUS TONE] ⚡ The situation has dramatically changed! New challenges await your leadership. [RISING TENSION]`,
        sender: 'Game Master',
        timestamp: new Date(),
        priority: 'urgent',
        relatedEventId: plotTwistEvent.id,
        requiresAction: true
      });

    } catch (error) {
      console.error('Error generating plot twist:', error);
    }
  }

  async createStoryMission(civilizationId: number, storyEventId: string, missionType: string): Promise<string | null> {
    // This will integrate with the existing missions system
    const missionPrompt = `
    Create a mission based on the story event.
    
    Mission Type: ${missionType}
    Story Context: Current galactic story development
    
    Generate a mission that:
    - Advances the story
    - Provides clear objectives
    - Has meaningful rewards and consequences
    - Integrates with civilization systems
    
    Return JSON with: title, description, objectives, rewards, timeLimit, difficulty.
    `;

    try {
      const response = await this.aiService.generateContent(missionPrompt, {
        temperature: 0.7,
        maxTokens: 600
      });

      const missionData = JSON.parse(response);
      
      // Here we would call the existing missions API to create the mission
      // For now, return a mock mission ID
      const missionId = `mission_${Date.now()}_story`;
      
      console.log(`📋 Created story mission: ${missionData.title} (${missionId})`);
      return missionId;

    } catch (error) {
      console.error('Error creating story mission:', error);
      return null;
    }
  }

  private scheduleStoryProgression(civilizationId: number, storyArcId: string): void {
    // Schedule next story event in 5-15 minutes (for demo purposes)
    const delay = Math.random() * 600000 + 300000; // 5-15 minutes
    
    const timer = setTimeout(async () => {
      await this.progressStory(civilizationId, storyArcId);
    }, delay);

    this.storyTimers.set(`${civilizationId}_${storyArcId}`, timer);
  }

  private async progressStory(civilizationId: number, storyArcId: string): Promise<void> {
    const storyArc = this.getStoryArc(civilizationId, storyArcId);
    if (!storyArc) return;

    // Determine what type of event to generate based on story phase and random chance
    const eventTypes = ['story', 'challenge', 'discovery'];
    if (Math.random() < 0.3) eventTypes.push('plot_twist');
    if (storyArc.currentPhase === 'rising_action' && Math.random() < 0.2) {
      eventTypes.push('climax');
    }

    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    switch (eventType) {
      case 'plot_twist':
        await this.generatePlotTwist(civilizationId, storyArcId);
        break;
      case 'climax':
        await this.generateClimax(civilizationId, storyArcId);
        break;
      default:
        await this.generateStoryEvent(civilizationId, storyArcId, eventType as any);
    }

    // Schedule next progression
    this.scheduleStoryProgression(civilizationId, storyArcId);
  }

  private async generateClimax(civilizationId: number, storyArcId: string): Promise<void> {
    const storyArc = this.getStoryArc(civilizationId, storyArcId);
    if (!storyArc) return;

    storyArc.currentPhase = 'climax';

    const climaxEvent: StoryEvent = {
      id: `climax_${Date.now()}`,
      title: 'The Final Confrontation',
      description: 'All paths have led to this moment. The fate of your civilization hangs in the balance as the ultimate challenge presents itself.',
      type: 'climax',
      storyArc: storyArc.id,
      timestamp: new Date(),
      requiresResponse: true,
      urgency: 'critical',
      storyPhase: 'climax'
    };

    storyArc.events.push(climaxEvent);
    await this.saveStoryEvent(civilizationId, climaxEvent);

    await this.sendGameMasterMessage(civilizationId, {
      id: `climax_msg_${Date.now()}`,
      type: 'story_update',
      title: '🔥 THE CLIMAX APPROACHES',
      content: 'The moment of truth has arrived. Everything your civilization has worked toward comes down to the choices you make now.',
      sender: 'Game Master',
      timestamp: new Date(),
      priority: 'urgent',
      relatedEventId: climaxEvent.id,
      requiresAction: true
    });
  }

  private async generateStoryEvent(civilizationId: number, storyArcId: string, eventType: 'story' | 'challenge' | 'discovery'): Promise<void> {
    // Generate regular story progression events
    const storyArc = this.getStoryArc(civilizationId, storyArcId);
    if (!storyArc) return;

    const eventPrompt = `
    Generate a ${eventType} event for the ongoing story: "${storyArc.title}"
    Current phase: ${storyArc.currentPhase}
    
    Create an engaging ${eventType} that advances the story and provides player agency.
    `;

    try {
      const response = await this.aiService.generateContent(eventPrompt, {
        temperature: 0.8,
        maxTokens: 600
      });

      const eventData = JSON.parse(response);
      
      const storyEvent: StoryEvent = {
        id: `event_${Date.now()}_${eventType}`,
        title: eventData.title,
        description: eventData.description,
        type: eventType,
        storyArc: storyArc.id,
        timestamp: new Date(),
        requiresResponse: eventData.requiresResponse || false,
        urgency: eventData.urgency || 'medium',
        storyPhase: storyArc.currentPhase
      };

      storyArc.events.push(storyEvent);
      await this.saveStoryEvent(civilizationId, storyEvent);

    } catch (error) {
      console.error(`Error generating ${eventType} event:`, error);
    }
  }

  private getStoryArc(civilizationId: number, storyArcId: string): StoryArc | null {
    const arcs = this.activeStoryArcs.get(civilizationId);
    return arcs?.find(arc => arc.id === storyArcId) || null;
  }

  private async saveStoryEvent(civilizationId: number, event: StoryEvent): Promise<void> {
    // Save to database - implement based on your database schema
    console.log(`💾 Saving story event: ${event.title} for civilization ${civilizationId}`);
  }

  private async sendGameMasterMessage(civilizationId: number, message: GameMasterMessage): Promise<void> {
    // Send message to player - integrate with existing messaging system
    console.log(`📨 Game Master message to civilization ${civilizationId}: ${message.title}`);
  }

  // Public API methods
  async getActiveStoryArcs(civilizationId: number): Promise<StoryArc[]> {
    return this.activeStoryArcs.get(civilizationId) || [];
  }

  async getStoryEvents(civilizationId: number, limit: number = 10): Promise<StoryEvent[]> {
    const arcs = await this.getActiveStoryArcs(civilizationId);
    const allEvents = arcs.flatMap(arc => arc.events);
    return allEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async respondToStoryEvent(civilizationId: number, eventId: string, choiceId: string): Promise<void> {
    // Handle player choice and generate consequences
    console.log(`🎯 Player choice for event ${eventId}: ${choiceId}`);
    
    // This would trigger follow-up events, missions, or story progression
    // based on the player's choice
  }
}

// Singleton instance
let gameMasterStoryEngine: GameMasterStoryEngine;

export function initializeGameMasterStoryEngine(pool: Pool): void {
  gameMasterStoryEngine = new GameMasterStoryEngine(pool);
  console.log('🎭 Game Master Story Engine initialized');
}

export function getGameMasterStoryEngine(): GameMasterStoryEngine {
  if (!gameMasterStoryEngine) {
    throw new Error('Game Master Story Engine not initialized');
  }
  return gameMasterStoryEngine;
}
