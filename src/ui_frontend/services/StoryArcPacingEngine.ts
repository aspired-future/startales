/**
 * Story Arc Pacing Engine
 * 
 * Distributes key story events across campaign duration to ensure proper dramatic pacing
 * with configurable climax timing and celebration phases.
 */

export interface StoryEvent {
  id: string;
  type: 'introduction' | 'rising_action' | 'plot_twist' | 'climax' | 'falling_action' | 'resolution' | 'celebration';
  title: string;
  description: string;
  intensity: number; // 1-10 scale
  week: number;
  duration: number; // Duration in weeks
  prerequisites?: string[]; // IDs of events that must happen first
  consequences?: string[]; // IDs of events this triggers
  villainInvolvement?: boolean;
  playerChoiceRequired?: boolean;
}

export interface StoryArc {
  campaignId: string;
  totalWeeks: number;
  events: StoryEvent[];
  climaxWeek: number;
  pacing: 'slow' | 'medium' | 'fast';
  theme: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface PacingConfig {
  campaignDurationWeeks: number;
  climaxPosition: 'early' | 'middle' | 'late' | 'custom'; // When climax occurs
  customClimaxWeek?: number;
  intensityProfile: 'gradual' | 'steep' | 'plateau' | 'multiple_peaks';
  celebrationDuration: number; // Weeks of celebration/resolution after climax
  eventDensity: 'sparse' | 'moderate' | 'dense'; // How many events per week
  allowPlayerChoice: boolean; // Whether to include player decision points
  villainPresence: 'minimal' | 'moderate' | 'heavy'; // How much villain involvement
}

export class StoryArcPacingEngine {
  private static instance: StoryArcPacingEngine;
  
  public static getInstance(): StoryArcPacingEngine {
    if (!StoryArcPacingEngine.instance) {
      StoryArcPacingEngine.instance = new StoryArcPacingEngine();
    }
    return StoryArcPacingEngine.instance;
  }

  /**
   * Generate a complete story arc based on pacing configuration
   */
  public generateStoryArc(
    campaignId: string,
    config: PacingConfig,
    theme: string = 'space_opera',
    difficulty: string = 'intermediate'
  ): StoryArc {
    const climaxWeek = this.calculateClimaxWeek(config);
    const events = this.generateStoryEvents(config, climaxWeek, theme, difficulty);
    
    return {
      campaignId,
      totalWeeks: config.campaignDurationWeeks,
      events: this.sortEventsByWeek(events),
      climaxWeek,
      pacing: this.determinePacing(config),
      theme,
      difficulty: difficulty as any
    };
  }

  /**
   * Calculate when the climax should occur based on configuration
   */
  private calculateClimaxWeek(config: PacingConfig): number {
    const { campaignDurationWeeks, climaxPosition, customClimaxWeek, celebrationDuration } = config;
    
    // Ensure we have enough time for celebration after climax
    const maxClimaxWeek = campaignDurationWeeks - celebrationDuration;
    
    switch (climaxPosition) {
      case 'early':
        return Math.floor(campaignDurationWeeks * 0.6); // 60% through
      case 'middle':
        return Math.floor(campaignDurationWeeks * 0.75); // 75% through (classic structure)
      case 'late':
        return Math.min(Math.floor(campaignDurationWeeks * 0.85), maxClimaxWeek); // 85% through
      case 'custom':
        return Math.min(customClimaxWeek || Math.floor(campaignDurationWeeks * 0.75), maxClimaxWeek);
      default:
        return Math.floor(campaignDurationWeeks * 0.75);
    }
  }

  /**
   * Generate story events distributed across the campaign timeline
   */
  private generateStoryEvents(
    config: PacingConfig,
    climaxWeek: number,
    theme: string,
    difficulty: string
  ): StoryEvent[] {
    const events: StoryEvent[] = [];
    const { campaignDurationWeeks, intensityProfile, eventDensity } = config;

    // Calculate event distribution
    const totalEvents = this.calculateTotalEvents(campaignDurationWeeks, eventDensity);
    const intensityCurve = this.generateIntensityCurve(campaignDurationWeeks, climaxWeek, intensityProfile);

    // Generate introduction events (first 20% of campaign)
    const introWeeks = Math.floor(campaignDurationWeeks * 0.2);
    events.push(...this.generateIntroductionEvents(introWeeks, theme));

    // Generate rising action events (20% to climax)
    const risingActionStart = introWeeks + 1;
    const risingActionEnd = climaxWeek - 1;
    events.push(...this.generateRisingActionEvents(
      risingActionStart, 
      risingActionEnd, 
      intensityCurve, 
      theme, 
      difficulty,
      config
    ));

    // Generate climax event
    events.push(this.generateClimaxEvent(climaxWeek, theme, difficulty));

    // Generate falling action and resolution (after climax)
    const resolutionStart = climaxWeek + 1;
    events.push(...this.generateResolutionEvents(
      resolutionStart, 
      campaignDurationWeeks, 
      config.celebrationDuration,
      theme
    ));

    return events;
  }

  /**
   * Calculate total number of events based on campaign length and density
   */
  private calculateTotalEvents(weeks: number, density: string): number {
    const baseEvents = Math.floor(weeks / 2); // Base: 1 event per 2 weeks
    
    switch (density) {
      case 'sparse':
        return Math.max(5, Math.floor(baseEvents * 0.7));
      case 'moderate':
        return Math.max(8, baseEvents);
      case 'dense':
        return Math.max(12, Math.floor(baseEvents * 1.5));
      default:
        return baseEvents;
    }
  }

  /**
   * Generate intensity curve for the campaign
   */
  private generateIntensityCurve(totalWeeks: number, climaxWeek: number, profile: string): number[] {
    const curve: number[] = new Array(totalWeeks + 1).fill(0);
    
    for (let week = 1; week <= totalWeeks; week++) {
      switch (profile) {
        case 'gradual':
          curve[week] = this.calculateGradualIntensity(week, climaxWeek, totalWeeks);
          break;
        case 'steep':
          curve[week] = this.calculateSteepIntensity(week, climaxWeek, totalWeeks);
          break;
        case 'plateau':
          curve[week] = this.calculatePlateauIntensity(week, climaxWeek, totalWeeks);
          break;
        case 'multiple_peaks':
          curve[week] = this.calculateMultiplePeaksIntensity(week, climaxWeek, totalWeeks);
          break;
        default:
          curve[week] = this.calculateGradualIntensity(week, climaxWeek, totalWeeks);
      }
    }
    
    return curve;
  }

  private calculateGradualIntensity(week: number, climaxWeek: number, totalWeeks: number): number {
    if (week <= climaxWeek) {
      // Gradual rise to climax
      return Math.min(10, 2 + (week / climaxWeek) * 8);
    } else {
      // Gradual fall after climax
      const falloffRate = (totalWeeks - climaxWeek) / 3;
      return Math.max(1, 10 - ((week - climaxWeek) / falloffRate) * 7);
    }
  }

  private calculateSteepIntensity(week: number, climaxWeek: number, totalWeeks: number): number {
    if (week <= climaxWeek) {
      // Steep rise to climax
      const progress = week / climaxWeek;
      return Math.min(10, 2 + Math.pow(progress, 2) * 8);
    } else {
      // Quick fall after climax
      return Math.max(1, 10 - Math.pow((week - climaxWeek) / (totalWeeks - climaxWeek), 0.5) * 8);
    }
  }

  private calculatePlateauIntensity(week: number, climaxWeek: number, totalWeeks: number): number {
    const plateauStart = Math.floor(climaxWeek * 0.7);
    const plateauEnd = climaxWeek + Math.floor((totalWeeks - climaxWeek) * 0.3);
    
    if (week < plateauStart) {
      return 2 + (week / plateauStart) * 4; // Rise to plateau
    } else if (week <= plateauEnd) {
      return 6 + Math.sin((week - plateauStart) / (plateauEnd - plateauStart) * Math.PI) * 4; // Plateau with variation
    } else {
      return Math.max(1, 6 - ((week - plateauEnd) / (totalWeeks - plateauEnd)) * 5); // Fall from plateau
    }
  }

  private calculateMultiplePeaksIntensity(week: number, climaxWeek: number, totalWeeks: number): number {
    // Create multiple peaks with main climax being highest
    const peakCount = Math.floor(totalWeeks / 8) + 1;
    const peakSpacing = totalWeeks / peakCount;
    
    let intensity = 2;
    for (let i = 0; i < peakCount; i++) {
      const peakWeek = (i + 1) * peakSpacing;
      const distance = Math.abs(week - peakWeek);
      const peakHeight = peakWeek === climaxWeek ? 10 : 4 + Math.random() * 3;
      const peakInfluence = Math.max(0, peakHeight - distance * 0.8);
      intensity = Math.max(intensity, peakInfluence);
    }
    
    return Math.min(10, intensity);
  }

  /**
   * Generate introduction events for the campaign opening
   */
  private generateIntroductionEvents(introWeeks: number, theme: string): StoryEvent[] {
    const events: StoryEvent[] = [];
    const templates = this.getEventTemplates(theme);
    
    // Opening event (Week 1)
    events.push({
      id: `intro_1`,
      type: 'introduction',
      title: templates.introduction.opening.title,
      description: templates.introduction.opening.description,
      intensity: 3,
      week: 1,
      duration: 1,
      playerChoiceRequired: false
    });

    // World establishment (Week 2-3)
    if (introWeeks >= 2) {
      events.push({
        id: `intro_2`,
        type: 'introduction',
        title: templates.introduction.worldBuilding.title,
        description: templates.introduction.worldBuilding.description,
        intensity: 2,
        week: Math.min(2, introWeeks),
        duration: 1,
        playerChoiceRequired: true
      });
    }

    // Character introductions (spread across intro period)
    if (introWeeks >= 3) {
      events.push({
        id: `intro_3`,
        type: 'introduction',
        title: templates.introduction.characters.title,
        description: templates.introduction.characters.description,
        intensity: 3,
        week: Math.min(3, introWeeks),
        duration: 1,
        playerChoiceRequired: true
      });
    }

    return events;
  }

  /**
   * Generate rising action events building toward climax
   */
  private generateRisingActionEvents(
    startWeek: number,
    endWeek: number,
    intensityCurve: number[],
    theme: string,
    difficulty: string,
    config: PacingConfig
  ): StoryEvent[] {
    const events: StoryEvent[] = [];
    const templates = this.getEventTemplates(theme);
    const eventCount = Math.floor((endWeek - startWeek) / 2) + 1;
    
    for (let i = 0; i < eventCount; i++) {
      const week = startWeek + Math.floor((endWeek - startWeek) * (i / eventCount));
      const intensity = intensityCurve[week] || 5;
      
      // Determine event type based on intensity and position
      let eventType: StoryEvent['type'] = 'rising_action';
      if (intensity > 7 && Math.random() > 0.6) {
        eventType = 'plot_twist';
      }
      
      const template = eventType === 'plot_twist' 
        ? templates.risingAction.plotTwist 
        : templates.risingAction.challenge;
      
      events.push({
        id: `rising_${i + 1}`,
        type: eventType,
        title: template.title,
        description: template.description,
        intensity: Math.floor(intensity),
        week,
        duration: 1,
        villainInvolvement: config.villainPresence !== 'minimal' && intensity > 5,
        playerChoiceRequired: config.allowPlayerChoice && Math.random() > 0.4
      });
    }
    
    return events;
  }

  /**
   * Generate the climax event
   */
  private generateClimaxEvent(climaxWeek: number, theme: string, difficulty: string): StoryEvent {
    const templates = this.getEventTemplates(theme);
    
    return {
      id: 'climax_main',
      type: 'climax',
      title: templates.climax.title,
      description: templates.climax.description,
      intensity: 10,
      week: climaxWeek,
      duration: 2, // Climax spans 2 weeks
      villainInvolvement: true,
      playerChoiceRequired: true
    };
  }

  /**
   * Generate resolution and celebration events
   */
  private generateResolutionEvents(
    startWeek: number,
    totalWeeks: number,
    celebrationDuration: number,
    theme: string
  ): StoryEvent[] {
    const events: StoryEvent[] = [];
    const templates = this.getEventTemplates(theme);
    
    // Immediate aftermath (falling action)
    events.push({
      id: 'resolution_1',
      type: 'falling_action',
      title: templates.resolution.aftermath.title,
      description: templates.resolution.aftermath.description,
      intensity: 6,
      week: startWeek,
      duration: 1,
      playerChoiceRequired: true
    });

    // Final resolution
    const resolutionWeek = Math.min(startWeek + 2, totalWeeks - celebrationDuration);
    events.push({
      id: 'resolution_2',
      type: 'resolution',
      title: templates.resolution.conclusion.title,
      description: templates.resolution.conclusion.description,
      intensity: 4,
      week: resolutionWeek,
      duration: 1,
      playerChoiceRequired: false
    });

    // Celebration period
    if (celebrationDuration > 0) {
      const celebrationStart = totalWeeks - celebrationDuration + 1;
      events.push({
        id: 'celebration',
        type: 'celebration',
        title: templates.celebration.title,
        description: templates.celebration.description,
        intensity: 7,
        week: celebrationStart,
        duration: celebrationDuration,
        playerChoiceRequired: false
      });
    }

    return events;
  }

  /**
   * Get event templates based on theme
   */
  private getEventTemplates(theme: string) {
    const templates = {
      space_opera: {
        introduction: {
          opening: {
            title: "The Galactic Situation",
            description: "Players are briefed on the current state of galactic politics and their role as leaders."
          },
          worldBuilding: {
            title: "Establishing Territories",
            description: "Players explore their starting systems and establish initial diplomatic contacts."
          },
          characters: {
            title: "Key Figures Emerge",
            description: "Important NPCs and potential allies/enemies are introduced to the players."
          }
        },
        risingAction: {
          challenge: {
            title: "Escalating Tensions",
            description: "Political or military challenges arise that require player attention and decision-making."
          },
          plotTwist: {
            title: "Unexpected Revelations",
            description: "New information comes to light that changes the players' understanding of the situation."
          }
        },
        climax: {
          title: "The Final Confrontation",
          description: "The ultimate challenge that will determine the fate of the galaxy and the players' civilizations."
        },
        resolution: {
          aftermath: {
            title: "Dealing with Consequences",
            description: "Players handle the immediate aftermath of the climactic events and their choices."
          },
          conclusion: {
            title: "New Galactic Order",
            description: "The long-term consequences of the campaign are established and the new status quo is defined."
          }
        },
        celebration: {
          title: "Victory Celebration",
          description: "Players celebrate their achievements and the successful conclusion of their campaign."
        }
      },
      // Add more themes as needed
      political_intrigue: {
        introduction: {
          opening: {
            title: "The Political Landscape",
            description: "Players are introduced to the complex web of galactic politics and their position within it."
          },
          worldBuilding: {
            title: "Building Alliances",
            description: "Players begin forming initial political alliances and understanding the power structures."
          },
          characters: {
            title: "Power Players",
            description: "Key political figures, both allies and rivals, are introduced to the campaign."
          }
        },
        risingAction: {
          challenge: {
            title: "Political Maneuvering",
            description: "Complex political situations arise requiring careful negotiation and strategic thinking."
          },
          plotTwist: {
            title: "Betrayal and Secrets",
            description: "Hidden agendas are revealed and trusted allies may show their true colors."
          }
        },
        climax: {
          title: "The Ultimate Gambit",
          description: "A crucial political moment where all previous maneuvering comes to a head."
        },
        resolution: {
          aftermath: {
            title: "Political Fallout",
            description: "Players deal with the consequences of their political choices and actions."
          },
          conclusion: {
            title: "New Political Order",
            description: "The political landscape is reshaped based on the campaign's outcomes."
          }
        },
        celebration: {
          title: "Political Victory",
          description: "Players celebrate their political achievements and consolidated power."
        }
      }
    };

    return templates[theme as keyof typeof templates] || templates.space_opera;
  }

  /**
   * Sort events by week for proper timeline ordering
   */
  private sortEventsByWeek(events: StoryEvent[]): StoryEvent[] {
    return events.sort((a, b) => a.week - b.week);
  }

  /**
   * Determine overall pacing based on configuration
   */
  private determinePacing(config: PacingConfig): 'slow' | 'medium' | 'fast' {
    const { eventDensity, intensityProfile } = config;
    
    if (eventDensity === 'dense' || intensityProfile === 'steep') {
      return 'fast';
    } else if (eventDensity === 'sparse' || intensityProfile === 'plateau') {
      return 'slow';
    } else {
      return 'medium';
    }
  }

  /**
   * Validate story arc for consistency and proper pacing
   */
  public validateStoryArc(arc: StoryArc): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check for proper event distribution
    const eventsByType = arc.events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (!eventsByType.introduction) {
      issues.push("Missing introduction events");
    }
    if (!eventsByType.climax) {
      issues.push("Missing climax event");
    }
    if (!eventsByType.resolution && !eventsByType.celebration) {
      issues.push("Missing resolution or celebration events");
    }

    // Check intensity progression
    const intensities = arc.events.map(e => e.intensity);
    const climaxEvent = arc.events.find(e => e.type === 'climax');
    if (climaxEvent && climaxEvent.intensity < 9) {
      issues.push("Climax intensity should be 9 or 10");
    }

    // Check timeline consistency
    const lastWeek = Math.max(...arc.events.map(e => e.week + e.duration - 1));
    if (lastWeek > arc.totalWeeks) {
      issues.push("Events extend beyond campaign duration");
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * Generate a preview of the story arc for display in the campaign wizard
   */
  public generateStoryArcPreview(config: PacingConfig, theme: string): string {
    const climaxWeek = this.calculateClimaxWeek(config);
    const pacing = this.determinePacing(config);
    
    return `This ${config.campaignDurationWeeks}-week ${theme} campaign will feature ${pacing} pacing with the climax occurring around week ${climaxWeek}. The story will include ${config.eventDensity} event density with ${config.intensityProfile} intensity progression, culminating in a ${config.celebrationDuration}-week celebration period.`;
  }
}

export default StoryArcPacingEngine;
