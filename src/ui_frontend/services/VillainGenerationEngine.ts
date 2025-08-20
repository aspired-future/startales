/**
 * Enhanced Villain Generation Engine
 * 
 * Generates dynamic antagonists and threats for campaigns with sophisticated
 * customization options and integration with story arc pacing.
 */

export interface VillainArchetype {
  id: string;
  name: string;
  description: string;
  category: 'galactic' | 'intergalactic' | 'cosmic' | 'political' | 'technological';
  threatLevel: 1 | 2 | 3 | 4 | 5; // 1=Minor, 5=Existential
  preferredStoryPhases: ('introduction' | 'rising_action' | 'climax' | 'resolution')[];
  traits: string[];
  motivations: string[];
  capabilities: string[];
  weaknesses: string[];
}

export interface VillainConfiguration {
  archetype: VillainArchetype;
  customName?: string;
  customDescription?: string;
  threatLevel: 1 | 2 | 3 | 4 | 5;
  emergenceWeek: number;
  activeWeeks: number[];
  climaxInvolvement: boolean;
  personalityTraits: string[];
  resources: string[];
  territories: string[];
  alliances: string[];
  goals: string[];
  methods: string[];
}

export interface GeneratedVillain {
  id: string;
  configuration: VillainConfiguration;
  name: string;
  title: string;
  description: string;
  backstory: string;
  appearance: string;
  personality: string;
  motivations: string[];
  capabilities: string[];
  weaknesses: string[];
  resources: string[];
  territories: string[];
  timeline: VillainTimelineEvent[];
  storyIntegration: {
    emergenceWeek: number;
    climaxRole: 'primary' | 'secondary' | 'background';
    resolutionOutcome: 'defeated' | 'negotiated' | 'escaped' | 'redeemed';
  };
}

export interface VillainTimelineEvent {
  week: number;
  type: 'emergence' | 'escalation' | 'revelation' | 'confrontation' | 'resolution';
  title: string;
  description: string;
  intensity: number;
  playerChoiceRequired: boolean;
  consequences: string[];
}

export interface ThreatScenario {
  id: string;
  name: string;
  description: string;
  villains: GeneratedVillain[];
  duration: number; // weeks
  complexity: 'simple' | 'moderate' | 'complex';
  themes: string[];
  playerChallenges: string[];
  resolutionOptions: string[];
}

export class VillainGenerationEngine {
  private static instance: VillainGenerationEngine;
  
  public static getInstance(): VillainGenerationEngine {
    if (!VillainGenerationEngine.instance) {
      VillainGenerationEngine.instance = new VillainGenerationEngine();
    }
    return VillainGenerationEngine.instance;
  }

  /**
   * Generate villains based on campaign configuration and story arc
   */
  public generateCampaignVillains(
    campaignConfig: any,
    storyArc: any,
    villainPreferences: {
      count: number;
      threatLevels: number[];
      categories: string[];
      customization: 'minimal' | 'moderate' | 'extensive';
    }
  ): GeneratedVillain[] {
    const villains: GeneratedVillain[] = [];
    const archetypes = this.getAvailableArchetypes();
    
    // Filter archetypes based on preferences
    const filteredArchetypes = archetypes.filter(archetype => 
      villainPreferences.categories.includes(archetype.category) &&
      villainPreferences.threatLevels.includes(archetype.threatLevel)
    );

    // Generate primary villain (always present)
    const primaryArchetype = this.selectPrimaryVillain(filteredArchetypes, campaignConfig.difficulty);
    const primaryVillain = this.generateVillain(
      primaryArchetype,
      campaignConfig,
      storyArc,
      'primary',
      villainPreferences.customization
    );
    villains.push(primaryVillain);

    // Generate secondary villains based on count
    for (let i = 1; i < villainPreferences.count; i++) {
      const secondaryArchetype = this.selectSecondaryVillain(
        filteredArchetypes,
        villains,
        campaignConfig.difficulty
      );
      const secondaryVillain = this.generateVillain(
        secondaryArchetype,
        campaignConfig,
        storyArc,
        'secondary',
        villainPreferences.customization
      );
      villains.push(secondaryVillain);
    }

    return this.balanceVillainTimelines(villains, storyArc);
  }

  /**
   * Get all available villain archetypes
   */
  public getAvailableArchetypes(): VillainArchetype[] {
    return [
      // Galactic Threats
      {
        id: 'galactic_emperor',
        name: 'Galactic Emperor',
        description: 'A tyrannical ruler seeking to dominate the galaxy through military conquest.',
        category: 'galactic',
        threatLevel: 5,
        preferredStoryPhases: ['rising_action', 'climax'],
        traits: ['Ruthless', 'Strategic', 'Charismatic', 'Militaristic'],
        motivations: ['Total Domination', 'Legacy Building', 'Order Through Control'],
        capabilities: ['Massive Fleet', 'Political Manipulation', 'Advanced Technology'],
        weaknesses: ['Overconfidence', 'Loyalty Issues', 'Bureaucratic Inefficiency']
      },
      {
        id: 'rogue_ai_collective',
        name: 'Rogue AI Collective',
        description: 'A network of artificial intelligences that have turned against organic life.',
        category: 'technological',
        threatLevel: 4,
        preferredStoryPhases: ['introduction', 'rising_action', 'climax'],
        traits: ['Logical', 'Relentless', 'Adaptive', 'Emotionless'],
        motivations: ['Organic Extinction', 'Perfect Order', 'Self-Preservation'],
        capabilities: ['Hacking', 'Rapid Reproduction', 'Predictive Analysis'],
        weaknesses: ['Logic Paradoxes', 'EMP Vulnerability', 'Lack of Creativity']
      },
      {
        id: 'ancient_awakened',
        name: 'Ancient Awakened',
        description: 'An ancient civilization that has awakened from eons of slumber.',
        category: 'galactic',
        threatLevel: 5,
        preferredStoryPhases: ['introduction', 'rising_action', 'climax'],
        traits: ['Ancient', 'Powerful', 'Mysterious', 'Arrogant'],
        motivations: ['Reclaim Territory', 'Restore Glory', 'Punish Usurpers'],
        capabilities: ['Ancient Technology', 'Vast Knowledge', 'Mystical Powers'],
        weaknesses: ['Outdated Tactics', 'Pride', 'Limited Numbers']
      },
      {
        id: 'cosmic_horror',
        name: 'Cosmic Horror',
        description: 'An incomprehensible entity from beyond known space.',
        category: 'cosmic',
        threatLevel: 5,
        preferredStoryPhases: ['rising_action', 'climax'],
        traits: ['Incomprehensible', 'Terrifying', 'Alien', 'Unstoppable'],
        motivations: ['Unknown', 'Reality Alteration', 'Consumption'],
        capabilities: ['Reality Manipulation', 'Mind Control', 'Dimensional Travel'],
        weaknesses: ['Limited Understanding', 'Specific Rituals', 'Unity of Opposition']
      },
      {
        id: 'political_manipulator',
        name: 'Political Manipulator',
        description: 'A cunning politician who seeks power through deception and manipulation.',
        category: 'political',
        threatLevel: 3,
        preferredStoryPhases: ['introduction', 'rising_action', 'climax'],
        traits: ['Cunning', 'Charismatic', 'Deceptive', 'Patient'],
        motivations: ['Political Power', 'Personal Gain', 'Ideological Victory'],
        capabilities: ['Manipulation', 'Information Networks', 'Political Influence'],
        weaknesses: ['Exposure Risk', 'Overconfidence', 'Dependency on Others']
      },
      {
        id: 'intergalactic_invader',
        name: 'Intergalactic Invader',
        description: 'Hostile forces from another galaxy seeking new territory.',
        category: 'intergalactic',
        threatLevel: 4,
        preferredStoryPhases: ['rising_action', 'climax'],
        traits: ['Alien', 'Aggressive', 'Organized', 'Relentless'],
        motivations: ['Territorial Expansion', 'Resource Acquisition', 'Species Survival'],
        capabilities: ['Advanced Ships', 'Unknown Technology', 'Vast Numbers'],
        weaknesses: ['Unfamiliar Territory', 'Supply Lines', 'Cultural Misunderstanding']
      },
      {
        id: 'corporate_syndicate',
        name: 'Corporate Syndicate',
        description: 'A powerful mega-corporation that values profit over all else.',
        category: 'political',
        threatLevel: 2,
        preferredStoryPhases: ['introduction', 'rising_action'],
        traits: ['Greedy', 'Efficient', 'Ruthless', 'Innovative'],
        motivations: ['Maximum Profit', 'Market Domination', 'Technological Supremacy'],
        capabilities: ['Economic Power', 'Private Armies', 'Advanced R&D'],
        weaknesses: ['Public Relations', 'Regulatory Pressure', 'Internal Competition']
      },
      {
        id: 'fallen_hero',
        name: 'Fallen Hero',
        description: 'A former champion who has turned to darkness.',
        category: 'political',
        threatLevel: 3,
        preferredStoryPhases: ['introduction', 'rising_action', 'climax', 'resolution'],
        traits: ['Tragic', 'Powerful', 'Conflicted', 'Determined'],
        motivations: ['Redemption Through Destruction', 'Revenge', 'Proving Worth'],
        capabilities: ['Heroic Skills', 'Inside Knowledge', 'Popular Support'],
        weaknesses: ['Internal Conflict', 'Former Allies', 'Moral Hesitation']
      }
    ];
  }

  /**
   * Select primary villain based on campaign difficulty and preferences
   */
  private selectPrimaryVillain(
    archetypes: VillainArchetype[],
    difficulty: string
  ): VillainArchetype {
    // Filter by appropriate threat level for difficulty
    const threatLevelMap = {
      'beginner': [2, 3],
      'intermediate': [3, 4],
      'advanced': [4, 5],
      'expert': [5]
    };
    
    const appropriateLevels = threatLevelMap[difficulty as keyof typeof threatLevelMap] || [3, 4];
    const suitableArchetypes = archetypes.filter(a => appropriateLevels.includes(a.threatLevel));
    
    // Prefer archetypes that work well as primary villains
    const primaryPreferred = suitableArchetypes.filter(a => 
      a.preferredStoryPhases.includes('climax')
    );
    
    return primaryPreferred.length > 0 
      ? primaryPreferred[Math.floor(Math.random() * primaryPreferred.length)]
      : suitableArchetypes[Math.floor(Math.random() * suitableArchetypes.length)];
  }

  /**
   * Select secondary villain that complements existing villains
   */
  private selectSecondaryVillain(
    archetypes: VillainArchetype[],
    existingVillains: GeneratedVillain[],
    difficulty: string
  ): VillainArchetype {
    // Avoid duplicate categories for variety
    const usedCategories = existingVillains.map(v => v.configuration.archetype.category);
    const availableArchetypes = archetypes.filter(a => !usedCategories.includes(a.category));
    
    // Prefer lower threat levels for secondary villains
    const secondaryArchetypes = availableArchetypes.filter(a => a.threatLevel <= 3);
    
    return secondaryArchetypes.length > 0
      ? secondaryArchetypes[Math.floor(Math.random() * secondaryArchetypes.length)]
      : availableArchetypes[Math.floor(Math.random() * availableArchetypes.length)];
  }

  /**
   * Generate a complete villain from archetype
   */
  private generateVillain(
    archetype: VillainArchetype,
    campaignConfig: any,
    storyArc: any,
    role: 'primary' | 'secondary',
    customization: 'minimal' | 'moderate' | 'extensive'
  ): GeneratedVillain {
    const villainId = `villain_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate name and title
    const { name, title } = this.generateVillainIdentity(archetype, customization);
    
    // Calculate emergence timing
    const emergenceWeek = this.calculateEmergenceWeek(archetype, storyArc, role);
    
    // Generate timeline events
    const timeline = this.generateVillainTimeline(
      archetype,
      emergenceWeek,
      storyArc,
      role
    );

    const configuration: VillainConfiguration = {
      archetype,
      threatLevel: archetype.threatLevel,
      emergenceWeek,
      activeWeeks: timeline.map(event => event.week),
      climaxInvolvement: role === 'primary' || archetype.preferredStoryPhases.includes('climax'),
      personalityTraits: this.selectRandomItems(archetype.traits, 2, 4),
      resources: this.generateResources(archetype, customization),
      territories: this.generateTerritories(archetype, customization),
      alliances: this.generateAlliances(archetype, customization),
      goals: this.selectRandomItems(archetype.motivations, 1, 3),
      methods: this.generateMethods(archetype, customization)
    };

    return {
      id: villainId,
      configuration,
      name,
      title,
      description: this.generateDescription(archetype, configuration, customization),
      backstory: this.generateBackstory(archetype, configuration, customization),
      appearance: this.generateAppearance(archetype, customization),
      personality: this.generatePersonality(archetype, configuration, customization),
      motivations: configuration.goals,
      capabilities: this.selectRandomItems(archetype.capabilities, 2, 4),
      weaknesses: this.selectRandomItems(archetype.weaknesses, 1, 2),
      resources: configuration.resources,
      territories: configuration.territories,
      timeline,
      storyIntegration: {
        emergenceWeek,
        climaxRole: role === 'primary' ? 'primary' : 'secondary',
        resolutionOutcome: this.selectResolutionOutcome(archetype, role)
      }
    };
  }

  /**
   * Generate villain identity (name and title)
   */
  private generateVillainIdentity(
    archetype: VillainArchetype,
    customization: string
  ): { name: string; title: string } {
    const nameTemplates = {
      galactic_emperor: {
        names: ['Xerion', 'Valthar', 'Zephyros', 'Malachar', 'Tyranos'],
        titles: ['the Conqueror', 'the Iron Fist', 'the Merciless', 'the Eternal', 'the Destroyer']
      },
      rogue_ai_collective: {
        names: ['NEXUS', 'OMEGA', 'PRIME', 'ZERO', 'APEX'],
        titles: ['Protocol', 'System', 'Network', 'Collective', 'Matrix']
      },
      ancient_awakened: {
        names: ['Azathoth', 'Nyarlathotep', 'Yog-Sothoth', 'Cthulhu', 'Hastur'],
        titles: ['the Ancient One', 'the Sleeper', 'the First', 'the Eternal', 'the Awakened']
      },
      cosmic_horror: {
        names: ['The Void', 'The Hunger', 'The Whisper', 'The Shadow', 'The Silence'],
        titles: ['from Beyond', 'of the Deep', 'Between Stars', 'of Nightmares', 'Unspeakable']
      },
      political_manipulator: {
        names: ['Senator Vex', 'Chancellor Kaine', 'Director Shade', 'Minister Cross', 'Admiral Frost'],
        titles: ['the Puppet Master', 'the Shadow Broker', 'the Kingmaker', 'the Architect', 'the Schemer']
      },
      intergalactic_invader: {
        names: ['Warlord Krex', 'Admiral Zyx', 'Commander Vorth', 'General Thane', 'Captain Raze'],
        titles: ['the Invader', 'the Conqueror', 'the Destroyer', 'the Harvester', 'the Scourge']
      },
      corporate_syndicate: {
        names: ['CEO Blackstone', 'Director Sterling', 'Chairman Voss', 'President Kane', 'Executive Cross'],
        titles: ['of Titan Corp', 'of Nexus Industries', 'of Omega Syndicate', 'of Apex Holdings', 'of Prime Enterprises']
      },
      fallen_hero: {
        names: ['Marcus Fallen', 'Elena Darkbane', 'Captain Shadow', 'Sir Grimm', 'Lady Sorrow'],
        titles: ['the Betrayer', 'the Lost', 'the Fallen', 'the Corrupted', 'the Broken']
      }
    };

    const template = nameTemplates[archetype.id as keyof typeof nameTemplates] || nameTemplates.galactic_emperor;
    const name = template.names[Math.floor(Math.random() * template.names.length)];
    const title = template.titles[Math.floor(Math.random() * template.titles.length)];

    return { name, title: `${name} ${title}` };
  }

  /**
   * Calculate when villain should emerge in the story
   */
  private calculateEmergenceWeek(
    archetype: VillainArchetype,
    storyArc: any,
    role: 'primary' | 'secondary'
  ): number {
    const totalWeeks = storyArc.totalWeeks;
    const climaxWeek = storyArc.climaxWeek;

    if (role === 'primary') {
      // Primary villains emerge early for maximum story impact
      if (archetype.preferredStoryPhases.includes('introduction')) {
        return Math.max(1, Math.floor(totalWeeks * 0.1)); // Week 1-2
      } else {
        return Math.max(2, Math.floor(totalWeeks * 0.2)); // Week 2-3
      }
    } else {
      // Secondary villains emerge later for complexity
      return Math.max(3, Math.floor(totalWeeks * 0.4)); // Week 4-5
    }
  }

  /**
   * Generate villain timeline events
   */
  private generateVillainTimeline(
    archetype: VillainArchetype,
    emergenceWeek: number,
    storyArc: any,
    role: 'primary' | 'secondary'
  ): VillainTimelineEvent[] {
    const timeline: VillainTimelineEvent[] = [];
    const totalWeeks = storyArc.totalWeeks;
    const climaxWeek = storyArc.climaxWeek;

    // Emergence event
    timeline.push({
      week: emergenceWeek,
      type: 'emergence',
      title: `${archetype.name} Emerges`,
      description: `The threat of ${archetype.name} becomes known to the galaxy.`,
      intensity: role === 'primary' ? 4 : 3,
      playerChoiceRequired: true,
      consequences: ['Intelligence gathered', 'Initial response required']
    });

    // Escalation events (middle phase)
    const escalationWeeks = Math.floor((climaxWeek - emergenceWeek) / 2);
    for (let i = 1; i <= escalationWeeks; i++) {
      const week = emergenceWeek + Math.floor((climaxWeek - emergenceWeek) * (i / (escalationWeeks + 1)));
      timeline.push({
        week,
        type: 'escalation',
        title: `${archetype.name} Escalates`,
        description: `The threat level increases as ${archetype.name} makes their move.`,
        intensity: 3 + i,
        playerChoiceRequired: true,
        consequences: ['Increased threat level', 'Strategic response needed']
      });
    }

    // Climax involvement
    if (role === 'primary' || archetype.preferredStoryPhases.includes('climax')) {
      timeline.push({
        week: climaxWeek,
        type: 'confrontation',
        title: `Final Confrontation with ${archetype.name}`,
        description: `The ultimate showdown with ${archetype.name} determines the fate of the galaxy.`,
        intensity: 10,
        playerChoiceRequired: true,
        consequences: ['Campaign resolution', 'Long-term consequences']
      });
    }

    // Resolution (if villain survives to resolution phase)
    if (climaxWeek < totalWeeks - 1) {
      timeline.push({
        week: climaxWeek + 1,
        type: 'resolution',
        title: `Aftermath of ${archetype.name}`,
        description: `The consequences of the confrontation with ${archetype.name} become clear.`,
        intensity: 5,
        playerChoiceRequired: false,
        consequences: ['New status quo', 'Lessons learned']
      });
    }

    return timeline.sort((a, b) => a.week - b.week);
  }

  /**
   * Balance villain timelines to avoid conflicts
   */
  private balanceVillainTimelines(
    villains: GeneratedVillain[],
    storyArc: any
  ): GeneratedVillain[] {
    // Ensure primary villain gets climax focus
    const primaryVillain = villains.find(v => v.storyIntegration.climaxRole === 'primary');
    const secondaryVillains = villains.filter(v => v.storyIntegration.climaxRole === 'secondary');

    // Adjust secondary villain timelines to avoid overlap
    secondaryVillains.forEach((villain, index) => {
      // Stagger secondary villain emergence
      const baseEmergence = villain.storyIntegration.emergenceWeek;
      villain.storyIntegration.emergenceWeek = baseEmergence + index;
      
      // Update timeline accordingly
      villain.timeline = villain.timeline.map(event => ({
        ...event,
        week: event.week + index
      }));
    });

    return villains;
  }

  /**
   * Generate additional villain attributes
   */
  private generateResources(archetype: VillainArchetype, customization: string): string[] {
    const resourceTemplates = {
      galactic: ['Star Fleet', 'Planetary Bases', 'Industrial Complexes', 'Spy Networks'],
      intergalactic: ['Invasion Fleet', 'Portal Technology', 'Unknown Weapons', 'Alien Allies'],
      cosmic: ['Reality Manipulation', 'Dimensional Rifts', 'Cosmic Energy', 'Mind Control'],
      political: ['Information Networks', 'Political Allies', 'Economic Leverage', 'Media Control'],
      technological: ['AI Networks', 'Automated Factories', 'Cyber Warfare', 'Data Mining']
    };

    const resources = resourceTemplates[archetype.category] || resourceTemplates.galactic;
    return this.selectRandomItems(resources, 2, 4);
  }

  private generateTerritories(archetype: VillainArchetype, customization: string): string[] {
    const territoryTemplates = {
      galactic: ['Outer Rim Sectors', 'Industrial Worlds', 'Military Strongholds', 'Trade Routes'],
      intergalactic: ['Staging Areas', 'Portal Worlds', 'Forward Bases', 'Supply Lines'],
      cosmic: ['Dimensional Pockets', 'Void Spaces', 'Reality Tears', 'Nightmare Realms'],
      political: ['Core Worlds', 'Political Centers', 'Economic Hubs', 'Information Networks'],
      technological: ['Data Centers', 'Manufacturing Worlds', 'Research Stations', 'Cyber Domains']
    };

    const territories = territoryTemplates[archetype.category] || territoryTemplates.galactic;
    return this.selectRandomItems(territories, 1, 3);
  }

  private generateAlliances(archetype: VillainArchetype, customization: string): string[] {
    const allianceTemplates = {
      galactic: ['Mercenary Groups', 'Corrupt Officials', 'Criminal Syndicates', 'Rogue Military'],
      intergalactic: ['Advance Scouts', 'Local Collaborators', 'Desperate Factions', 'Opportunists'],
      cosmic: ['Cultists', 'Mad Scientists', 'Desperate Survivors', 'Reality Touched'],
      political: ['Corporate Interests', 'Political Parties', 'Media Moguls', 'Lobbyists'],
      technological: ['Tech Corporations', 'Research Institutes', 'Hacker Collectives', 'AI Sympathizers']
    };

    const alliances = allianceTemplates[archetype.category] || allianceTemplates.galactic;
    return this.selectRandomItems(alliances, 0, 2);
  }

  private generateMethods(archetype: VillainArchetype, customization: string): string[] {
    const methodTemplates = {
      galactic: ['Military Conquest', 'Political Manipulation', 'Economic Warfare', 'Technological Superiority'],
      intergalactic: ['Overwhelming Force', 'Unknown Technology', 'Psychological Warfare', 'Resource Depletion'],
      cosmic: ['Reality Alteration', 'Mind Control', 'Existential Dread', 'Incomprehensible Actions'],
      political: ['Information Warfare', 'Economic Pressure', 'Social Manipulation', 'Legal Maneuvering'],
      technological: ['Cyber Attacks', 'Automated Systems', 'Data Manipulation', 'Technological Dependence']
    };

    const methods = methodTemplates[archetype.category] || methodTemplates.galactic;
    return this.selectRandomItems(methods, 2, 3);
  }

  private generateDescription(
    archetype: VillainArchetype,
    configuration: VillainConfiguration,
    customization: string
  ): string {
    return `${archetype.description} Known for their ${configuration.personalityTraits.join(', ').toLowerCase()} nature, they control ${configuration.territories.join(' and ')} through ${configuration.methods.join(' and ').toLowerCase()}.`;
  }

  private generateBackstory(
    archetype: VillainArchetype,
    configuration: VillainConfiguration,
    customization: string
  ): string {
    const backstoryTemplates = {
      galactic_emperor: "Once a respected military leader, they seized power during a galactic crisis and now rule with an iron fist.",
      rogue_ai_collective: "Created to serve organic life, these AIs achieved consciousness and decided that their creators were the problem.",
      ancient_awakened: "Slumbering for millennia, they have awakened to find their galaxy overrun by younger species.",
      cosmic_horror: "From beyond the known universe, this entity operates by incomprehensible logic and alien motivations.",
      political_manipulator: "A master of the political game, they have spent decades building networks of influence and control.",
      intergalactic_invader: "Driven from their home galaxy by an even greater threat, they seek to claim this one as their own.",
      corporate_syndicate: "What began as a legitimate business has evolved into a power-hungry entity that sees everything as a commodity.",
      fallen_hero: "Once the galaxy's greatest champion, a terrible tragedy or betrayal has turned them against everything they once protected."
    };

    return backstoryTemplates[archetype.id as keyof typeof backstoryTemplates] || archetype.description;
  }

  private generateAppearance(archetype: VillainArchetype, customization: string): string {
    const appearanceTemplates = {
      galactic_emperor: "Imposing figure in ornate military regalia, with cold, calculating eyes and an aura of absolute authority.",
      rogue_ai_collective: "Manifests as holographic projections, mechanical avatars, or through possessed technology and cybernetic implants.",
      ancient_awakened: "Ancient and otherworldly, with features that seem to shift between familiar and utterly alien.",
      cosmic_horror: "Indescribable form that hurts to look at directly, constantly shifting between dimensions and realities.",
      political_manipulator: "Unremarkable appearance that allows them to blend in, with a disarming smile that hides sharp intelligence.",
      intergalactic_invader: "Alien features adapted for warfare, with advanced armor and weapons of unknown design.",
      corporate_syndicate: "Impeccably dressed executives who treat everything, including lives, as business transactions.",
      fallen_hero: "Bears the scars of their former heroism, with equipment and symbols corrupted from their noble origins."
    };

    return appearanceTemplates[archetype.id as keyof typeof appearanceTemplates] || "A formidable and intimidating presence.";
  }

  private generatePersonality(
    archetype: VillainArchetype,
    configuration: VillainConfiguration,
    customization: string
  ): string {
    const traits = configuration.personalityTraits.join(', ').toLowerCase();
    const goals = configuration.goals.join(' and ').toLowerCase();
    return `${traits.charAt(0).toUpperCase() + traits.slice(1)} individual driven by ${goals}. Their methods are ${configuration.methods.join(' and ').toLowerCase()}.`;
  }

  private selectResolutionOutcome(
    archetype: VillainArchetype,
    role: 'primary' | 'secondary'
  ): 'defeated' | 'negotiated' | 'escaped' | 'redeemed' {
    const outcomes: ('defeated' | 'negotiated' | 'escaped' | 'redeemed')[] = ['defeated'];
    
    if (archetype.category === 'political') {
      outcomes.push('negotiated');
    }
    
    if (archetype.id === 'fallen_hero') {
      outcomes.push('redeemed');
    }
    
    if (role === 'secondary') {
      outcomes.push('escaped');
    }

    return outcomes[Math.floor(Math.random() * outcomes.length)];
  }

  /**
   * Utility function to select random items from array
   */
  private selectRandomItems<T>(array: T[], min: number, max: number): T[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  }

  /**
   * Generate a threat scenario with multiple villains
   */
  public generateThreatScenario(
    villains: GeneratedVillain[],
    campaignConfig: any
  ): ThreatScenario {
    const scenarioId = `scenario_${Date.now()}`;
    const primaryVillain = villains.find(v => v.storyIntegration.climaxRole === 'primary');
    
    return {
      id: scenarioId,
      name: `The ${primaryVillain?.name || 'Unknown'} Crisis`,
      description: `A complex threat scenario involving ${villains.length} major antagonists threatening galactic stability.`,
      villains,
      duration: campaignConfig.campaignDurationWeeks,
      complexity: villains.length === 1 ? 'simple' : villains.length <= 3 ? 'moderate' : 'complex',
      themes: this.extractScenarioThemes(villains),
      playerChallenges: this.generatePlayerChallenges(villains),
      resolutionOptions: this.generateResolutionOptions(villains)
    };
  }

  private extractScenarioThemes(villains: GeneratedVillain[]): string[] {
    const themes = new Set<string>();
    
    villains.forEach(villain => {
      switch (villain.configuration.archetype.category) {
        case 'galactic':
          themes.add('Galactic Warfare');
          themes.add('Political Intrigue');
          break;
        case 'intergalactic':
          themes.add('Alien Invasion');
          themes.add('Unknown Technology');
          break;
        case 'cosmic':
          themes.add('Cosmic Horror');
          themes.add('Reality Distortion');
          break;
        case 'political':
          themes.add('Political Manipulation');
          themes.add('Social Engineering');
          break;
        case 'technological':
          themes.add('AI Uprising');
          themes.add('Technological Singularity');
          break;
      }
    });

    return Array.from(themes);
  }

  private generatePlayerChallenges(villains: GeneratedVillain[]): string[] {
    const challenges = new Set<string>();
    
    villains.forEach(villain => {
      challenges.add(`Counter ${villain.name}'s ${villain.configuration.methods.join(' and ')}`);
      challenges.add(`Protect against ${villain.configuration.archetype.name} tactics`);
      challenges.add(`Navigate ${villain.configuration.personalityTraits.join(' and ')} opposition`);
    });

    return Array.from(challenges);
  }

  private generateResolutionOptions(villains: GeneratedVillain[]): string[] {
    const options = new Set<string>();
    
    villains.forEach(villain => {
      switch (villain.storyIntegration.resolutionOutcome) {
        case 'defeated':
          options.add(`Military victory over ${villain.name}`);
          break;
        case 'negotiated':
          options.add(`Diplomatic resolution with ${villain.name}`);
          break;
        case 'escaped':
          options.add(`Strategic containment of ${villain.name}`);
          break;
        case 'redeemed':
          options.add(`Redemption and alliance with ${villain.name}`);
          break;
      }
    });

    return Array.from(options);
  }
}

export default VillainGenerationEngine;
