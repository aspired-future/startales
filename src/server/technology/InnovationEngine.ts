/**
 * Innovation Engine - Distributed Innovation System
 * Handles innovation from government, corporations, citizens, and AI
 */

import {
  Technology, TechnologyCategory, InnovationEvent, InnovationSource,
  InnovationOutcome, InnovationTeamMember, InnovationAccident,
  CivilizationTech, PsychicPower, TechTreeNode
} from './types.js';

export class InnovationEngine {
  private innovationEvents: Map<string, InnovationEvent> = new Map();
  private prng: () => number;

  constructor(seed: number) {
    this.prng = this.createSeededPRNG(seed);
  }

  private createSeededPRNG(seed: number): () => number {
    let a = seed;
    return () => {
      a ^= a << 13;
      a ^= a >>> 17;
      a ^= a << 5;
      return (a >>> 0) / 0xffffffff;
    };
  }

  // Trigger innovation events from different sources
  triggerInnovation(params: {
    source: InnovationSource;
    civilization: CivilizationTech;
    targetCategory?: TechnologyCategory;
    targetTechnology?: string;
    funding?: number;
    duration?: number;
    riskTolerance?: number;
  }): InnovationEvent {
    const id = `innovation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const event: InnovationEvent = {
      id,
      type: params.source,
      targetTechnologyId: params.targetTechnology,
      category: params.targetCategory,
      eventDate: new Date(),
      duration: params.duration || this.calculateInnovationDuration(params.source),
      cost: params.funding || this.calculateInnovationCost(params.source, params.civilization),
      probability: this.calculateSuccessProbability(params.source, params.civilization, params.riskTolerance),
      leadResearcher: this.selectLeadResearcher(params.source, params.civilization),
      organization: this.determineOrganization(params.source, params.civilization),
      team: this.assembleInnovationTeam(params.source, params.civilization),
      funding: params.funding || 0,
      equipment: this.generateRequiredEquipment(params.source, params.targetCategory),
      facilities: this.generateRequiredFacilities(params.source, params.targetCategory),
      discoveredTechnologies: [],
      breakthroughs: [],
      deadEnds: [],
      spinoffOpportunities: []
    };

    this.innovationEvents.set(id, event);
    return event;
  }

  // Execute innovation event and determine outcomes
  executeInnovation(eventId: string, availableTechnologies: Technology[], techTree: TechTreeNode[]): InnovationOutcome {
    const event = this.innovationEvents.get(eventId);
    if (!event) {
      throw new Error('Innovation event not found');
    }

    const success = this.prng() < event.probability;
    const breakthroughLevel = this.determineBreakthroughLevel(event, success);
    
    const outcome: InnovationOutcome = {
      success,
      breakthroughLevel,
      technologiesUnlocked: [],
      psychicPowersAwakened: [],
      newResearchDirections: [],
      cost: event.cost * (0.8 + this.prng() * 0.4),
      timeSpent: event.duration * (0.9 + this.prng() * 0.2),
      resourcesConsumed: this.calculateResourceConsumption(event),
      accidents: [],
      ethicalConcerns: [],
      securityRisks: [],
      researchData: [],
      theoreticalInsights: [],
      practicalApplications: []
    };

    if (success) {
      this.processSuccessfulInnovation(event, outcome, availableTechnologies, techTree);
    } else {
      this.processFailedInnovation(event, outcome);
    }

    // Check for accidents (more likely with higher risk tolerance and complexity)
    this.checkForAccidents(event, outcome);

    event.outcome = outcome;
    return outcome;
  }

  // Corporate innovation (private R&D)
  triggerCorporateInnovation(params: {
    civilization: CivilizationTech;
    corporationId: string;
    researchBudget: number;
    targetMarket?: TechnologyCategory;
    competitivePressure: number;
  }): InnovationEvent {
    return this.triggerInnovation({
      source: 'Corporate R&D',
      civilization: params.civilization,
      targetCategory: params.targetMarket,
      funding: params.researchBudget,
      duration: 180 + Math.floor(this.prng() * 365), // 6 months to 1.5 years
      riskTolerance: 0.3 + (params.competitivePressure * 0.4)
    });
  }

  // Citizen innovation (independent inventors)
  triggerCitizenInnovation(params: {
    civilization: CivilizationTech;
    citizenId: string;
    personalFunding: number;
    expertise: TechnologyCategory[];
    psychicAbilities?: string[];
  }): InnovationEvent {
    const targetCategory = params.expertise[Math.floor(this.prng() * params.expertise.length)];
    
    return this.triggerInnovation({
      source: 'Independent Inventor',
      civilization: params.civilization,
      targetCategory,
      funding: params.personalFunding,
      duration: 30 + Math.floor(this.prng() * 180), // 1-6 months
      riskTolerance: 0.6 + this.prng() * 0.3 // Citizens often take bigger risks
    });
  }

  // AI-driven innovation
  triggerAIInnovation(params: {
    civilization: CivilizationTech;
    aiSystemId: string;
    computingPower: number;
    dataAccess: string[];
    autonomyLevel: number;
  }): InnovationEvent {
    return this.triggerInnovation({
      source: 'AI Innovation',
      civilization: params.civilization,
      targetCategory: this.selectAIResearchTarget(params.civilization),
      funding: params.computingPower * 100, // Computing power as funding proxy
      duration: 1 + Math.floor(this.prng() * 30), // AI works much faster
      riskTolerance: params.autonomyLevel // Higher autonomy = more risk-taking
    });
  }

  // Accidental discoveries
  triggerAccidentalDiscovery(params: {
    civilization: CivilizationTech;
    triggerEvent: string;
    location: string;
    involvedPersonnel: string[];
  }): InnovationEvent {
    return this.triggerInnovation({
      source: 'Accidental Breakthrough',
      civilization: params.civilization,
      funding: 0, // No planned funding
      duration: 1, // Instant discovery
      riskTolerance: 1.0 // Accidents ignore risk tolerance
    });
  }

  // Psychic revelations
  triggerPsychicRevelation(params: {
    civilization: CivilizationTech;
    psychicId: string;
    psychicPowers: string[];
    meditationLevel: number;
  }): InnovationEvent {
    return this.triggerInnovation({
      source: 'Psychic Discovery',
      civilization: params.civilization,
      targetCategory: 'Psychic',
      funding: params.meditationLevel * 10000,
      duration: 7 + Math.floor(this.prng() * 30), // 1 week to 1 month
      riskTolerance: 0.8 // Psychic research is inherently risky
    });
  }

  // Process successful innovation outcomes
  private processSuccessfulInnovation(
    event: InnovationEvent, 
    outcome: InnovationOutcome, 
    availableTechnologies: Technology[], 
    techTree: TechTreeNode[]
  ): void {
    // Discover new technologies based on breakthrough level
    const discoveryCount = this.getDiscoveryCount(outcome.breakthroughLevel);
    
    for (let i = 0; i < discoveryCount; i++) {
      const newTech = this.discoverNewTechnology(event, availableTechnologies, techTree);
      if (newTech) {
        outcome.technologiesUnlocked.push(newTech.id);
        event.discoveredTechnologies.push(newTech.id);
      }
    }

    // Generate research insights
    outcome.researchData = this.generateResearchData(event);
    outcome.theoreticalInsights = this.generateTheoreticalInsights(event, outcome.breakthroughLevel);
    outcome.practicalApplications = this.generatePracticalApplications(event);

    // Check for psychic power awakening
    if (event.type === 'Psychic Discovery' || this.prng() < 0.1) {
      const awakenedPowers = this.awakenPsychicPowers(event);
      outcome.psychicPowersAwakened = awakenedPowers;
    }

    // Generate new research directions
    outcome.newResearchDirections = this.generateNewResearchDirections(event, outcome.breakthroughLevel);

    // Add breakthrough to event tracking
    const breakthroughDescription = this.describeBreakthrough(event, outcome);
    event.breakthroughs.push(breakthroughDescription);
  }

  private processFailedInnovation(event: InnovationEvent, outcome: InnovationOutcome): void {
    // Even failures can provide insights
    outcome.researchData = this.generateFailureInsights(event);
    
    // Mark as dead end if it's a complete failure
    if (this.prng() < 0.3) {
      const deadEndDescription = this.describeDeadEnd(event);
      event.deadEnds.push(deadEndDescription);
    }

    // Sometimes failures lead to unexpected discoveries
    if (this.prng() < 0.1) {
      outcome.newResearchDirections = [`Unexpected insights from ${event.type} failure`];
    }
  }

  private checkForAccidents(event: InnovationEvent, outcome: InnovationOutcome): void {
    const accidentProbability = this.calculateAccidentProbability(event);
    
    if (this.prng() < accidentProbability) {
      const accident = this.generateAccident(event);
      outcome.accidents.push(accident);
      
      // Accidents can have various consequences
      if (accident.severity === 'Severe' || accident.severity === 'Catastrophic') {
        outcome.cost *= 1.5 + this.prng(); // Increased costs
        outcome.timeSpent *= 1.2 + this.prng() * 0.5; // Delays
      }
      
      // Some accidents lead to breakthroughs
      if (this.prng() < 0.2) {
        outcome.newResearchDirections.push(`Accidental discovery from ${accident.type}`);
      }
    }
  }

  private discoverNewTechnology(
    event: InnovationEvent, 
    availableTechnologies: Technology[], 
    techTree: TechTreeNode[]
  ): Technology | null {
    // Find hidden technologies that could be discovered
    const hiddenNodes = techTree.filter(node => 
      node.state === 'Hidden' &&
      this.meetsDiscoveryConditions(node, event, availableTechnologies)
    );

    if (hiddenNodes.length === 0) {
      return null;
    }

    // Select technology based on event type and probability
    const selectedNode = this.selectTechnologyForDiscovery(hiddenNodes, event);
    const technology = availableTechnologies.find(tech => tech.id === selectedNode.technologyId);
    
    if (technology) {
      // Update technology state
      technology.treeState = 'Discovered';
      technology.discoveryDate = new Date();
      technology.discoveryMethod = event.type;
      technology.hiddenUntilDiscovered = false;
      
      // Update tree node
      selectedNode.state = 'Discovered';
    }

    return technology || null;
  }

  private meetsDiscoveryConditions(
    node: TechTreeNode, 
    event: InnovationEvent, 
    availableTechnologies: Technology[]
  ): boolean {
    // Check if discovery triggers are met
    for (const trigger of node.discoveryTriggers) {
      if (trigger.type === 'Research Threshold' && event.category) {
        return trigger.conditions.category === event.category;
      }
      
      if (trigger.type === 'Corporate Innovation' && event.type === 'Corporate R&D') {
        return this.prng() < trigger.probability;
      }
      
      if (trigger.type === 'AI Breakthrough' && event.type === 'AI Innovation') {
        return this.prng() < trigger.probability;
      }
      
      if (trigger.type === 'Psychic Awakening' && event.type === 'Psychic Discovery') {
        return this.prng() < trigger.probability;
      }
    }

    return false;
  }

  private selectTechnologyForDiscovery(hiddenNodes: TechTreeNode[], event: InnovationEvent): TechTreeNode {
    // Weight selection by discovery probability and research priority
    const weights = hiddenNodes.map(node => 
      node.discoveryProbability * node.researchPriority * node.breakthroughPotential
    );
    
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = this.prng() * totalWeight;
    
    for (let i = 0; i < hiddenNodes.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return hiddenNodes[i];
      }
    }
    
    return hiddenNodes[0]; // Fallback
  }

  // Innovation source-specific calculations
  private calculateInnovationDuration(source: InnovationSource): number {
    const baseDurations: Record<InnovationSource, number> = {
      'Government Research': 365 * 2, // 2 years
      'Corporate R&D': 365, // 1 year
      'Independent Inventor': 180, // 6 months
      'Academic Institution': 365 * 1.5, // 1.5 years
      'Military Development': 365, // 1 year
      'Alien Technology': 30, // 1 month (reverse engineering)
      'Psychic Discovery': 7, // 1 week
      'AI Innovation': 1, // 1 day
      'Accidental Breakthrough': 1 // Instant
    };

    const baseDuration = baseDurations[source];
    return Math.floor(baseDuration * (0.5 + this.prng()));
  }

  private calculateInnovationCost(source: InnovationSource, civilization: CivilizationTech): number {
    const baseCosts: Record<InnovationSource, number> = {
      'Government Research': civilization.researchCapacity * 1000,
      'Corporate R&D': civilization.corporateInnovation * 500000,
      'Independent Inventor': 10000 + Math.floor(this.prng() * 100000),
      'Academic Institution': civilization.academicResearch * 200000,
      'Military Development': civilization.governmentResearch * 800000,
      'Alien Technology': 50000, // Analysis costs
      'Psychic Discovery': 5000, // Minimal material costs
      'AI Innovation': civilization.researchCapacity * 100, // Computing costs
      'Accidental Breakthrough': 0 // No planned costs
    };

    return baseCosts[source] * (0.5 + this.prng());
  }

  private calculateSuccessProbability(
    source: InnovationSource, 
    civilization: CivilizationTech, 
    riskTolerance?: number
  ): number {
    const baseProbabilities: Record<InnovationSource, number> = {
      'Government Research': 0.6,
      'Corporate R&D': 0.7,
      'Independent Inventor': 0.3,
      'Academic Institution': 0.5,
      'Military Development': 0.8,
      'Alien Technology': 0.9,
      'Psychic Discovery': 0.4,
      'AI Innovation': 0.8,
      'Accidental Breakthrough': 0.2
    };

    let probability = baseProbabilities[source];
    
    // Adjust based on civilization capabilities
    probability *= (1 + civilization.innovationRate);
    
    // Risk tolerance affects probability
    if (riskTolerance) {
      probability *= (0.5 + riskTolerance * 0.5);
    }

    return Math.max(0.1, Math.min(0.95, probability));
  }

  private selectLeadResearcher(source: InnovationSource, civilization: CivilizationTech): string {
    const researcherTypes: Record<InnovationSource, string> = {
      'Government Research': 'Government Scientist',
      'Corporate R&D': 'Corporate Researcher',
      'Independent Inventor': 'Independent Inventor',
      'Academic Institution': 'Professor',
      'Military Development': 'Military Engineer',
      'Alien Technology': 'Xenoarchaeologist',
      'Psychic Discovery': 'Psychic Researcher',
      'AI Innovation': 'AI System',
      'Accidental Breakthrough': 'Accidental Discoverer'
    };

    return `${researcherTypes[source]} ${Math.floor(this.prng() * 1000)}`;
  }

  private determineOrganization(source: InnovationSource, civilization: CivilizationTech): string {
    const organizations: Record<InnovationSource, string[]> = {
      'Government Research': ['National Research Institute', 'Government Laboratory', 'State University'],
      'Corporate R&D': ['MegaCorp Industries', 'Innovation Dynamics', 'Future Technologies Inc.'],
      'Independent Inventor': ['Private Workshop', 'Home Laboratory', 'Garage Startup'],
      'Academic Institution': ['University Research Center', 'Institute of Technology', 'Science Academy'],
      'Military Development': ['Defense Research Agency', 'Military Technology Division', 'Strategic Weapons Lab'],
      'Alien Technology': ['Xenoarchaeology Department', 'First Contact Division', 'Alien Technology Task Force'],
      'Psychic Discovery': ['Psychic Research Institute', 'Consciousness Studies Center', 'Paranormal Investigation Unit'],
      'AI Innovation': ['AI Research Collective', 'Machine Intelligence Lab', 'Synthetic Minds Institute'],
      'Accidental Breakthrough': ['Industrial Facility', 'Research Accident Site', 'Experimental Zone']
    };

    const orgList = organizations[source];
    return orgList[Math.floor(this.prng() * orgList.length)];
  }

  private assembleInnovationTeam(source: InnovationSource, civilization: CivilizationTech): InnovationTeamMember[] {
    const team: InnovationTeamMember[] = [];
    const teamSize = this.getTeamSize(source);
    
    for (let i = 0; i < teamSize; i++) {
      const member: InnovationTeamMember = {
        personId: `person_${Math.floor(this.prng() * 10000)}`,
        role: this.assignTeamRole(i, teamSize),
        expertise: this.generateExpertise(),
        psychicAbilities: this.generatePsychicAbilities(civilization.psychicPopulation),
        contribution: 0.3 + this.prng() * 0.7
      };
      
      team.push(member);
    }
    
    return team;
  }

  private getTeamSize(source: InnovationSource): number {
    const teamSizes: Record<InnovationSource, [number, number]> = {
      'Government Research': [10, 50],
      'Corporate R&D': [5, 25],
      'Independent Inventor': [1, 3],
      'Academic Institution': [3, 15],
      'Military Development': [8, 30],
      'Alien Technology': [2, 8],
      'Psychic Discovery': [1, 5],
      'AI Innovation': [1, 1], // Just the AI
      'Accidental Breakthrough': [1, 5]
    };

    const [min, max] = teamSizes[source];
    return min + Math.floor(this.prng() * (max - min + 1));
  }

  private assignTeamRole(index: number, teamSize: number): InnovationTeamMember['role'] {
    if (index === 0) return 'Lead Researcher';
    if (index < teamSize * 0.3) return 'Specialist';
    if (index < teamSize * 0.6) return 'Engineer';
    if (index < teamSize * 0.8) return 'Theorist';
    if (this.prng() < 0.1) return 'Psychic Consultant';
    return 'Assistant';
  }

  private generateExpertise(): TechnologyCategory[] {
    const allCategories: TechnologyCategory[] = [
      'Military', 'Industrial', 'Medical', 'Agricultural', 'Transportation',
      'Communication', 'Energy', 'Computing', 'Materials', 'Space',
      'Biotechnology', 'Nanotechnology', 'Quantum', 'AI', 'Robotics',
      'Psychic', 'FTL', 'Terraforming', 'Megastructures', 'Consciousness',
      'Dimensional', 'Temporal', 'Exotic Matter', 'Galactic Engineering'
    ];

    const expertiseCount = 1 + Math.floor(this.prng() * 3); // 1-3 areas of expertise
    const expertise: TechnologyCategory[] = [];
    
    for (let i = 0; i < expertiseCount; i++) {
      const category = allCategories[Math.floor(this.prng() * allCategories.length)];
      if (!expertise.includes(category)) {
        expertise.push(category);
      }
    }
    
    return expertise;
  }

  private generatePsychicAbilities(psychicPopulation: number): string[] {
    if (this.prng() > psychicPopulation) {
      return []; // No psychic abilities
    }

    const abilities = ['basic_telepathy', 'empathic_sensing', 'intuitive_flashes'];
    const abilityCount = Math.floor(this.prng() * 3) + 1;
    
    return abilities.slice(0, abilityCount);
  }

  private determineBreakthroughLevel(event: InnovationEvent, success: boolean): InnovationOutcome['breakthroughLevel'] {
    if (!success) return 'Minor';
    
    const random = this.prng();
    const sourceMultiplier = this.getSourceBreakthroughMultiplier(event.type);
    
    const adjustedRandom = random * sourceMultiplier;
    
    if (adjustedRandom > 0.95) return 'Paradigm Shift';
    if (adjustedRandom > 0.85) return 'Revolutionary';
    if (adjustedRandom > 0.65) return 'Major';
    if (adjustedRandom > 0.35) return 'Significant';
    return 'Minor';
  }

  private getSourceBreakthroughMultiplier(source: InnovationSource): number {
    const multipliers: Record<InnovationSource, number> = {
      'Government Research': 1.0,
      'Corporate R&D': 0.8,
      'Independent Inventor': 1.5, // Higher risk, higher reward
      'Academic Institution': 1.2,
      'Military Development': 0.9,
      'Alien Technology': 2.0, // Alien tech can be revolutionary
      'Psychic Discovery': 1.8, // Psychic insights can be paradigm-shifting
      'AI Innovation': 1.6, // AI can make unexpected connections
      'Accidental Breakthrough': 2.5 // Accidents can lead to major discoveries
    };

    return multipliers[source];
  }

  private getDiscoveryCount(breakthroughLevel: InnovationOutcome['breakthroughLevel']): number {
    const counts: Record<InnovationOutcome['breakthroughLevel'], number> = {
      'Minor': 1,
      'Significant': 1,
      'Major': 2,
      'Revolutionary': 3,
      'Paradigm Shift': 5
    };

    return counts[breakthroughLevel];
  }

  private generateRequiredEquipment(source: InnovationSource, category?: TechnologyCategory): string[] {
    const baseEquipment: Record<InnovationSource, string[]> = {
      'Government Research': ['Advanced Laboratory Equipment', 'Supercomputers', 'Specialized Instruments'],
      'Corporate R&D': ['Commercial Lab Equipment', 'Prototyping Tools', 'Testing Facilities'],
      'Independent Inventor': ['Basic Tools', 'Computer', 'Workshop Equipment'],
      'Academic Institution': ['Research Equipment', 'Library Access', 'Student Assistants'],
      'Military Development': ['Military-Grade Equipment', 'Secure Facilities', 'Testing Ranges'],
      'Alien Technology': ['Analysis Equipment', 'Containment Systems', 'Translation Devices'],
      'Psychic Discovery': ['Meditation Equipment', 'Biofeedback Monitors', 'Isolation Chambers'],
      'AI Innovation': ['Quantum Computers', 'Neural Networks', 'Data Centers'],
      'Accidental Breakthrough': ['Whatever was available at the time']
    };

    return baseEquipment[source] || [];
  }

  private generateRequiredFacilities(source: InnovationSource, category?: TechnologyCategory): string[] {
    const baseFacilities: Record<InnovationSource, string[]> = {
      'Government Research': ['National Laboratory', 'Research Institute', 'Government Facility'],
      'Corporate R&D': ['Corporate Research Center', 'Innovation Lab', 'Development Facility'],
      'Independent Inventor': ['Home Workshop', 'Garage Lab', 'Private Studio'],
      'Academic Institution': ['University Laboratory', 'Research Building', 'Academic Center'],
      'Military Development': ['Military Base', 'Defense Facility', 'Classified Location'],
      'Alien Technology': ['Secure Analysis Facility', 'Containment Lab', 'Xenoarchaeology Site'],
      'Psychic Discovery': ['Meditation Center', 'Psychic Research Facility', 'Consciousness Lab'],
      'AI Innovation': ['Data Center', 'AI Research Facility', 'Computing Complex'],
      'Accidental Breakthrough': ['Industrial Site', 'Experimental Facility', 'Accident Location']
    };

    return baseFacilities[source] || [];
  }

  private selectAIResearchTarget(civilization: CivilizationTech): TechnologyCategory {
    // AI tends to focus on computing, AI, and consciousness technologies
    const aiPreferences: TechnologyCategory[] = ['AI', 'Computing', 'Consciousness', 'Quantum', 'Robotics'];
    return aiPreferences[Math.floor(this.prng() * aiPreferences.length)];
  }

  private calculateAccidentProbability(event: InnovationEvent): number {
    let probability = 0.05; // Base 5% chance
    
    // Higher risk sources have more accidents
    const riskMultipliers: Record<InnovationSource, number> = {
      'Government Research': 0.8,
      'Corporate R&D': 0.6,
      'Independent Inventor': 2.0, // Much higher risk
      'Academic Institution': 1.0,
      'Military Development': 1.2,
      'Alien Technology': 1.5,
      'Psychic Discovery': 1.8,
      'AI Innovation': 0.3, // AI is more careful
      'Accidental Breakthrough': 0.0 // Already an accident
    };

    probability *= riskMultipliers[event.type];
    
    // Higher funding = better safety measures
    if (event.funding > 1000000) {
      probability *= 0.5;
    }
    
    return Math.max(0.01, Math.min(0.3, probability));
  }

  private generateAccident(event: InnovationEvent): InnovationAccident {
    const accidentTypes = [
      'Equipment Failure', 'Psychic Overload', 'Dimensional Breach', 
      'AI Awakening', 'Temporal Anomaly', 'Consciousness Transfer', 'Reality Distortion'
    ];

    const severities = ['Minor', 'Moderate', 'Severe', 'Catastrophic'];
    const severityWeights = [0.5, 0.3, 0.15, 0.05]; // Most accidents are minor
    
    let random = this.prng();
    let severityIndex = 0;
    for (let i = 0; i < severityWeights.length; i++) {
      random -= severityWeights[i];
      if (random <= 0) {
        severityIndex = i;
        break;
      }
    }

    const accident: InnovationAccident = {
      type: accidentTypes[Math.floor(this.prng() * accidentTypes.length)] as any,
      severity: severities[severityIndex] as any,
      effects: this.generateAccidentEffects(event),
      casualties: this.calculateCasualties(severities[severityIndex] as any),
      containmentRequired: severityIndex >= 2, // Severe and Catastrophic need containment
      coverupAttempted: this.prng() < 0.4 && severityIndex >= 1 // 40% chance of coverup for moderate+
    };

    return accident;
  }

  private generateAccidentEffects(event: InnovationEvent): string[] {
    const effects = [
      'Equipment damage',
      'Research data loss',
      'Facility contamination',
      'Personnel injury',
      'Unexpected side effects',
      'Security breach',
      'Environmental impact'
    ];

    const effectCount = 1 + Math.floor(this.prng() * 3);
    return effects.slice(0, effectCount);
  }

  private calculateCasualties(severity: string): number {
    const casualtyRanges: Record<string, [number, number]> = {
      'Minor': [0, 0],
      'Moderate': [0, 2],
      'Severe': [1, 10],
      'Catastrophic': [5, 50]
    };

    const [min, max] = casualtyRanges[severity];
    return min + Math.floor(this.prng() * (max - min + 1));
  }

  private generateResearchData(event: InnovationEvent): string[] {
    return [
      `Research findings from ${event.type}`,
      `Experimental data and observations`,
      `Theoretical framework development`,
      `Practical implementation notes`
    ];
  }

  private generateTheoreticalInsights(event: InnovationEvent, breakthroughLevel: string): string[] {
    const insights = [
      `New theoretical framework for ${event.category}`,
      `Fundamental principles discovered`,
      `Mathematical models developed`,
      `Physical laws clarified`
    ];

    const insightCount = breakthroughLevel === 'Paradigm Shift' ? 4 : 
                        breakthroughLevel === 'Revolutionary' ? 3 : 2;
    
    return insights.slice(0, insightCount);
  }

  private generatePracticalApplications(event: InnovationEvent): string[] {
    return [
      `Commercial applications in ${event.category}`,
      `Industrial process improvements`,
      `Consumer product opportunities`,
      `Infrastructure enhancements`
    ];
  }

  private awakenPsychicPowers(event: InnovationEvent): string[] {
    if (event.type !== 'Psychic Discovery' && this.prng() > 0.1) {
      return [];
    }

    const powers = ['basic_telepathy', 'empathic_sensing', 'telekinetic_manipulation'];
    const powerCount = Math.floor(this.prng() * 2) + 1;
    
    return powers.slice(0, powerCount);
  }

  private generateNewResearchDirections(event: InnovationEvent, breakthroughLevel: string): string[] {
    const directions = [
      `Advanced ${event.category} research`,
      `Cross-disciplinary applications`,
      `Theoretical extensions`,
      `Practical implementations`,
      `Safety and ethics studies`
    ];

    const directionCount = breakthroughLevel === 'Paradigm Shift' ? 5 : 
                          breakthroughLevel === 'Revolutionary' ? 4 : 
                          breakthroughLevel === 'Major' ? 3 : 2;
    
    return directions.slice(0, directionCount);
  }

  private describeBreakthrough(event: InnovationEvent, outcome: InnovationOutcome): string {
    return `${outcome.breakthroughLevel} breakthrough in ${event.category} research by ${event.organization}`;
  }

  private describeDeadEnd(event: InnovationEvent): string {
    return `${event.type} research in ${event.category} proved to be a dead end`;
  }

  private generateFailureInsights(event: InnovationEvent): string[] {
    return [
      `Lessons learned from ${event.type} failure`,
      `Approaches that don't work`,
      `Resource allocation mistakes`,
      `Technical limitations identified`
    ];
  }

  private calculateResourceConsumption(event: InnovationEvent): Record<string, number> {
    return {
      'Research Hours': event.duration * event.team.length * 8,
      'Computing Power': Math.floor(this.prng() * 1000000),
      'Materials': Math.floor(this.prng() * 100000),
      'Energy': Math.floor(this.prng() * 500000)
    };
  }

  // Getters
  getInnovationEvents(): InnovationEvent[] {
    return Array.from(this.innovationEvents.values());
  }

  getActiveInnovations(): InnovationEvent[] {
    return Array.from(this.innovationEvents.values()).filter(event => !event.outcome);
  }

  getCompletedInnovations(): InnovationEvent[] {
    return Array.from(this.innovationEvents.values()).filter(event => event.outcome);
  }
}
