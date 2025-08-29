import { veo3VideoGenerator } from './VEO3VideoGenerator';

// Visual consistency system for VEO 3 videos matching game aesthetics
interface GameVisualStyle {
  colorPalette: ColorPalette;
  artDirection: ArtDirection;
  cinematicStyle: CinematicStyle;
  technicalSpecs: TechnicalSpecs;
}

interface ColorPalette {
  primary: string[];      // Cyan/Blue Tech: #00d9ff, #0099cc, #004d66
  secondary: string[];    // Orange/Amber Energy: #ff9500, #cc7700, #663c00
  success: string[];      // Green Matrix: #00ff88, #00cc66, #004d26
  warning: string[];      // Yellow Alert: #ffdd00, #ccaa00, #665500
  danger: string[];       // Red Alert: #ff3366, #cc1144, #660822
  interface: string[];    // Dark Sci-Fi: #0a0a0f, #1a1a2e, #16213e, #2a4a6b
  text: string[];         // Text Colors: #e0e6ed, #a0b3c8, #00d9ff
}

interface ArtDirection {
  style: 'SCI_FI' | 'SPACE_OPERA' | 'CYBERPUNK' | 'BIO_ORGANIC';
  mood: 'HEROIC' | 'GRITTY' | 'MYSTERIOUS' | 'DRAMATIC' | 'EPIC';
  theme: 'SPACE_EXPLORATION' | 'POLITICAL_INTRIGUE' | 'MILITARY_CONFLICT' | 'DISCOVERY';
  influences: string[];
  lighting: 'CINEMATIC' | 'DRAMATIC' | 'SOFT' | 'HARSH' | 'NEON';
}

interface CinematicStyle {
  cameraWork: 'SWEEPING' | 'INTIMATE' | 'DYNAMIC' | 'STEADY' | 'HANDHELD';
  pacing: 'FAST' | 'MEDIUM' | 'SLOW' | 'VARIABLE';
  transitions: 'SMOOTH' | 'QUICK_CUT' | 'FADE' | 'WIPE';
  aspectRatio: '16:9' | '21:9' | '4:3' | '1:1';
  duration: number; // seconds
}

interface TechnicalSpecs {
  quality: 'STANDARD' | 'HIGH' | 'ULTRA';
  resolution: '1080p' | '1440p' | '4K';
  frameRate: 24 | 30 | 60;
  compression: 'H264' | 'H265' | 'AV1';
}

class VideoStyleConsistency {
  private gameStyle: GameVisualStyle;
  
  constructor() {
    this.gameStyle = this.initializeGameStyle();
  }

  private initializeGameStyle(): GameVisualStyle {
    return {
      colorPalette: {
        primary: ['#00d9ff', '#0099cc', '#004d66'],
        secondary: ['#ff9500', '#cc7700', '#663c00'],
        success: ['#00ff88', '#00cc66', '#004d26'],
        warning: ['#ffdd00', '#ccaa00', '#665500'],
        danger: ['#ff3366', '#cc1144', '#660822'],
        interface: ['#0a0a0f', '#1a1a2e', '#16213e', '#2a4a6b'],
        text: ['#e0e6ed', '#a0b3c8', '#00d9ff']
      },
      artDirection: {
        style: 'SCI_FI',
        mood: 'HEROIC',
        theme: 'SPACE_EXPLORATION',
        influences: ['Mass Effect', 'Star Trek', 'Interstellar', 'Blade Runner 2049'],
        lighting: 'CINEMATIC'
      },
      cinematicStyle: {
        cameraWork: 'SWEEPING',
        pacing: 'MEDIUM',
        transitions: 'SMOOTH',
        aspectRatio: '16:9',
        duration: 8
      },
      technicalSpecs: {
        quality: 'HIGH',
        resolution: '1080p',
        frameRate: 30,
        compression: 'H264'
      }
    };
  }

  // Generate style-consistent prompt for VEO 3
  generateStyledPrompt(basePrompt: string, eventType: string, context: Record<string, any>): string {
    const styleTokens = this.getStyleTokens(eventType, context);
    const colorGuidance = this.getColorGuidance(eventType);
    const cinematicGuidance = this.getCinematicGuidance(eventType);
    const technicalGuidance = this.getTechnicalGuidance();

    return `${basePrompt}

VISUAL STYLE REQUIREMENTS:
${styleTokens}

COLOR PALETTE:
${colorGuidance}

CINEMATOGRAPHY:
${cinematicGuidance}

TECHNICAL SPECIFICATIONS:
${technicalGuidance}

CONSISTENCY NOTES:
- Maintain sci-fi aesthetic consistent with Mass Effect and Star Trek visual languages
- Use clean, futuristic UI elements with glowing cyan/blue accents
- Ensure lighting creates dramatic but heroic atmosphere
- Include subtle particle effects and lens flares for sci-fi authenticity
- Character designs should match established species visual templates
- Technology should appear advanced but grounded in established game universe`;
  }

  private getStyleTokens(eventType: string, context: Record<string, any>): string {
    const baseTokens = [
      'cinematic sci-fi',
      'high production value',
      'futuristic aesthetic',
      'clean design language',
      'heroic tone',
      'space exploration theme'
    ];

    const eventSpecificTokens = this.getEventSpecificTokens(eventType);
    const contextualTokens = this.getContextualTokens(context);

    return [...baseTokens, ...eventSpecificTokens, ...contextualTokens].join(', ');
  }

  private getEventSpecificTokens(eventType: string): string[] {
    const eventTokens: Record<string, string[]> = {
      'major_discovery': [
        'sense of wonder',
        'scientific breakthrough',
        'exploration triumph',
        'cosmic revelation'
      ],
      'political_crisis': [
        'political tension',
        'governmental drama',
        'diplomatic urgency',
        'leadership challenge'
      ],
      'economic_milestone': [
        'prosperity celebration',
        'economic success',
        'trade triumph',
        'financial achievement'
      ],
      'military_conflict': [
        'military precision',
        'tactical operations',
        'strategic warfare',
        'defensive readiness'
      ],
      'natural_disaster': [
        'emergency response',
        'crisis management',
        'survival determination',
        'rescue operations'
      ],
      'technology_breakthrough': [
        'innovation celebration',
        'technological marvel',
        'scientific advancement',
        'engineering triumph'
      ],
      'population_milestone': [
        'community celebration',
        'cultural diversity',
        'social harmony',
        'population growth'
      ],
      'colony_established': [
        'pioneering spirit',
        'new beginnings',
        'settlement foundation',
        'frontier expansion'
      ],
      'diplomatic_achievement': [
        'diplomatic success',
        'alliance formation',
        'peaceful resolution',
        'interspecies cooperation'
      ]
    };

    return eventTokens[eventType] || ['dramatic moment', 'significant event'];
  }

  private getContextualTokens(context: Record<string, any>): string[] {
    const tokens: string[] = [];

    if (context.location) {
      tokens.push(`${context.location} environment`);
    }

    if (context.species) {
      tokens.push(`${context.species} cultural aesthetics`);
    }

    if (context.severity === 'high' || context.priority === 'critical') {
      tokens.push('high stakes', 'urgent atmosphere');
    }

    if (context.celebratory) {
      tokens.push('celebratory mood', 'triumphant atmosphere');
    }

    return tokens;
  }

  private getColorGuidance(eventType: string): string {
    const colorMappings: Record<string, string> = {
      'major_discovery': `Primary: Cyan/Blue tech colors (${this.gameStyle.colorPalette.primary.join(', ')}) for wonder and discovery`,
      'political_crisis': `Danger: Red alert colors (${this.gameStyle.colorPalette.danger.join(', ')}) for tension and urgency`,
      'economic_milestone': `Success: Green matrix colors (${this.gameStyle.colorPalette.success.join(', ')}) for prosperity and growth`,
      'military_conflict': `Secondary: Orange/Amber energy (${this.gameStyle.colorPalette.secondary.join(', ')}) for military action`,
      'natural_disaster': `Warning: Yellow alert colors (${this.gameStyle.colorPalette.warning.join(', ')}) for emergency situations`,
      'technology_breakthrough': `Primary: Cyan/Blue tech (${this.gameStyle.colorPalette.primary.join(', ')}) for innovation and advancement`,
      'population_milestone': `Success: Green matrix (${this.gameStyle.colorPalette.success.join(', ')}) for positive growth`,
      'colony_established': `Primary: Cyan/Blue tech (${this.gameStyle.colorPalette.primary.join(', ')}) for new frontiers`,
      'diplomatic_achievement': `Success: Green matrix (${this.gameStyle.colorPalette.success.join(', ')}) for peaceful cooperation`
    };

    const baseGuidance = `
- Interface colors: ${this.gameStyle.colorPalette.interface.join(', ')} for backgrounds and panels
- Text colors: ${this.gameStyle.colorPalette.text.join(', ')} for readability and accents
- Avoid oversaturated colors that clash with the established palette`;

    return (colorMappings[eventType] || 'Use balanced color palette') + baseGuidance;
  }

  private getCinematicGuidance(eventType: string): string {
    const cinematicMappings: Record<string, string> = {
      'major_discovery': 'Sweeping camera movements revealing the discovery, slow zoom-ins for dramatic effect, smooth transitions',
      'political_crisis': 'Quick cuts between locations, handheld camera for urgency, dramatic close-ups on speakers',
      'economic_milestone': 'Steady camera work showcasing prosperity, smooth pans across thriving areas, celebratory angles',
      'military_conflict': 'Dynamic camera movements, tactical angles, quick cuts for action sequences',
      'natural_disaster': 'Handheld camera for chaos, wide shots showing scale, urgent pacing',
      'technology_breakthrough': 'Smooth camera work highlighting innovation, close-ups on technology, reveal shots',
      'population_milestone': 'Wide establishing shots, smooth pans across communities, celebratory camera work',
      'colony_established': 'Sweeping establishing shots, time-lapse style sequences, pioneering perspective',
      'diplomatic_achievement': 'Formal camera work, steady shots of meetings, ceremonial angles'
    };

    const baseCinematography = `
- Aspect ratio: ${this.gameStyle.cinematicStyle.aspectRatio}
- Duration: ${this.gameStyle.cinematicStyle.duration} seconds
- Lighting: ${this.gameStyle.artDirection.lighting} with dramatic shadows and highlights
- Include subtle lens flares and particle effects for sci-fi authenticity`;

    return (cinematicMappings[eventType] || 'Standard cinematic approach') + baseCinematography;
  }

  private getTechnicalGuidance(): string {
    return `
- Quality: ${this.gameStyle.technicalSpecs.quality} production values
- Resolution: ${this.gameStyle.technicalSpecs.resolution} minimum
- Frame rate: ${this.gameStyle.technicalSpecs.frameRate} fps for smooth motion
- Ensure compatibility with web video players
- Optimize for streaming while maintaining visual quality
- Include proper compression for fast loading`;
  }

  // Generate character-consistent prompts
  generateCharacterConsistentPrompt(characterId: string, basePrompt: string, context: Record<string, any>): string {
    // This would integrate with the existing character visual system
    const characterVisualData = this.getCharacterVisualData(characterId);
    
    if (!characterVisualData) {
      return this.generateStyledPrompt(basePrompt, context.eventType || 'general', context);
    }

    const characterGuidance = `
CHARACTER CONSISTENCY:
- Character ID: ${characterId}
- Species: ${characterVisualData.species}
- Visual seed: ${characterVisualData.visualSeed}
- Established appearance: ${characterVisualData.description}
- Clothing/Equipment: ${characterVisualData.currentOutfit}
- Expression context: ${context.emotion || 'professional'}`;

    return this.generateStyledPrompt(basePrompt + characterGuidance, context.eventType || 'general', context);
  }

  private getCharacterVisualData(characterId: string): any {
    // This would integrate with the existing character system
    // For now, return null to use general styling
    return null;
  }

  // Generate location-consistent prompts
  generateLocationConsistentPrompt(locationId: string, basePrompt: string, context: Record<string, any>): string {
    const locationVisualData = this.getLocationVisualData(locationId);
    
    if (!locationVisualData) {
      return this.generateStyledPrompt(basePrompt, context.eventType || 'general', context);
    }

    const locationGuidance = `
LOCATION CONSISTENCY:
- Location: ${locationId}
- Environment type: ${locationVisualData.biome}
- Architectural style: ${locationVisualData.architecture}
- Lighting conditions: ${locationVisualData.lighting}
- Atmospheric effects: ${locationVisualData.atmosphere}`;

    return this.generateStyledPrompt(basePrompt + locationGuidance, context.eventType || 'general', context);
  }

  private getLocationVisualData(locationId: string): any {
    // This would integrate with the existing location system
    // For now, return basic data
    return {
      biome: 'space_station',
      architecture: 'futuristic_clean',
      lighting: 'artificial_blue',
      atmosphere: 'controlled_environment'
    };
  }

  // Validate video against style guidelines
  validateVideoConsistency(videoUrl: string, expectedStyle: string): Promise<boolean> {
    // This would use AI vision models to validate the generated video
    // matches the expected visual style
    console.log(`🎬 Style Validation: Checking ${videoUrl} against ${expectedStyle} guidelines`);
    
    // For now, return true (mock validation)
    return Promise.resolve(true);
  }

  // Get style profile for campaign
  getCampaignStyleProfile(campaignId: string): GameVisualStyle {
    // This would load campaign-specific visual styles
    // For now, return the default game style
    return this.gameStyle;
  }

  // Update style based on campaign progression
  updateStyleForProgression(campaignId: string, progressionData: Record<string, any>): void {
    // This would modify visual style based on story progression
    // e.g., darker tones as conflicts escalate, brighter as prosperity increases
    console.log(`🎬 Style Update: Adjusting visual style for campaign ${campaignId} progression`);
  }
}

// Create singleton instance
export const videoStyleConsistency = new VideoStyleConsistency();

export default videoStyleConsistency;

