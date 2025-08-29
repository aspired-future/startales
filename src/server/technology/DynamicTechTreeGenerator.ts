/**
 * Dynamic Tech Tree Generator
 * Creates procedural, hidden tech trees for each game with futuristic focus
 */

import { 
  Technology, TechnologyCategory, TechnologyLevel, TechnologyEra,
  TechTreeNode, TechTreeConnection, DiscoveryTrigger, HiddenCondition,
  PsychicPower, PsychicPowerCategory, PsychicAcquisitionMethod,
  InnovationSource, TechTreeNodeState
} from './types';

export class DynamicTechTreeGenerator {
  private seed: number;
  private prng: () => number;

  constructor(seed: number) {
    this.seed = seed;
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

  // Generate complete dynamic tech tree for a civilization
  generateTechTree(startingEra: TechnologyEra, gameType: 'rapid' | 'standard' | 'extended' = 'rapid'): {
    technologies: Technology[];
    psychicPowers: PsychicPower[];
    techTree: TechTreeNode[];
    startingTechnologies: string[];
  } {
    const technologies: Technology[] = [];
    const psychicPowers: PsychicPower[] = [];
    const techTree: TechTreeNode[] = [];

    // Generate base technologies for each era
    this.generateEraProgression(technologies, startingEra, gameType);
    
    // Generate futuristic technologies (the main focus)
    this.generateFuturisticTechnologies(technologies);
    
    // Generate psychic powers
    this.generatePsychicPowers(psychicPowers, technologies);
    
    // Create dynamic tech tree structure
    this.createTechTreeNodes(techTree, technologies, psychicPowers);
    
    // Establish dynamic connections
    this.createDynamicConnections(techTree, technologies);
    
    // Add discovery triggers and hidden conditions
    this.addDiscoveryMechanics(techTree, technologies);

    // Determine starting technologies based on era
    const startingTechnologies = this.determineStartingTechnologies(technologies, startingEra);

    return {
      technologies,
      psychicPowers,
      techTree,
      startingTechnologies
    };
  }

  private generateEraProgression(technologies: Technology[], startingEra: TechnologyEra, gameType: string): void {
    const eras: TechnologyEra[] = [
      'Stone Age', 'Bronze Age', 'Iron Age', 'Industrial', 'Information', 'Digital',
      'Space Age', 'Interplanetary', 'Interstellar', 'Galactic', 'Transcendent'
    ];

    const startIndex = eras.indexOf(startingEra);
    const eraCount = gameType === 'rapid' ? 3 : gameType === 'standard' ? 5 : 7;

    // Generate minimal early technologies (rapid progression to space age)
    for (let i = startIndex; i < Math.min(startIndex + eraCount, eras.length); i++) {
      this.generateEraBasics(technologies, eras[i]);
    }
  }

  private generateEraBasics(technologies: Technology[], era: TechnologyEra): void {
    const basicTechs = this.getBasicTechnologiesForEra(era);
    
    for (const techData of basicTechs) {
      const tech: Technology = {
        id: `${era.toLowerCase().replace(' ', '_')}_${techData.name.toLowerCase().replace(/\s+/g, '_')}`,
        name: techData.name,
        category: techData.category,
        level: techData.level,
        era: era,
        description: techData.description,
        complexity: techData.complexity,
        researchCost: techData.researchCost,
        implementationCost: techData.implementationCost,
        maintenanceCost: techData.maintenanceCost,
        treeState: era === 'Stone Age' ? 'Unlocked' : 'Hidden',
        isDeadEnd: false,
        hiddenUntilDiscovered: era !== 'Stone Age',
        prerequisites: techData.prerequisites || [],
        unlocks: [],
        softPrerequisites: [],
        alternativePrerequisites: [],
        economicBonus: techData.economicBonus || 0,
        militaryBonus: techData.militaryBonus || 0,
        researchBonus: techData.researchBonus || 0,
        acquisitionMethod: 'Research',
        acquisitionDate: new Date(),
        acquisitionCost: techData.researchCost,
        implementationProgress: 0,
        operationalStatus: 'Research',
        securityLevel: Math.floor(this.prng() * 5) + 3,
        vulnerabilityScore: Math.floor(this.prng() * 5) + 3,
        metadata: {
          discoveredBy: 'Historical Development',
          patents: [],
          classifications: [],
          exportRestrictions: false,
          dualUse: false,
          isPsychicTech: false,
          requiresPsychicAbility: false,
          alienOrigin: false,
          theoreticalOnly: false
        }
      };
      
      technologies.push(tech);
    }
  }

  private generateFuturisticTechnologies(technologies: Technology[]): void {
    // Space Age Technologies
    this.generateSpaceTechnologies(technologies);
    
    // Advanced Energy Technologies
    this.generateEnergyTechnologies(technologies);
    
    // Consciousness and AI Technologies
    this.generateConsciousnessTechnologies(technologies);
    
    // Exotic Physics Technologies
    this.generateExoticPhysicsTechnologies(technologies);
    
    // Galactic Engineering Technologies
    this.generateGalacticEngineeringTechnologies(technologies);
    
    // Dimensional and Temporal Technologies
    this.generateDimensionalTechnologies(technologies);
  }

  private generateSpaceTechnologies(technologies: Technology[]): void {
    const spaceTechs = [
      {
        name: 'Ion Drive Propulsion',
        category: 'Space' as TechnologyCategory,
        level: 'Advanced' as TechnologyLevel,
        era: 'Space Age' as TechnologyEra,
        description: 'Efficient ion-based spacecraft propulsion for interplanetary travel',
        complexity: 6,
        researchCost: 2000000,
        implementationCost: 1000000,
        maintenanceCost: 200000,
        economicBonus: 15000,
        militaryBonus: 10000,
        researchBonus: 5000
      },
      {
        name: 'Fusion Torch Drive',
        category: 'Space' as TechnologyCategory,
        level: 'Cutting-Edge' as TechnologyLevel,
        era: 'Interplanetary' as TechnologyEra,
        description: 'High-thrust fusion-powered spacecraft propulsion',
        complexity: 8,
        researchCost: 5000000,
        implementationCost: 2500000,
        maintenanceCost: 500000,
        economicBonus: 50000,
        militaryBonus: 75000,
        researchBonus: 25000
      },
      {
        name: 'Alcubierre Warp Drive',
        category: 'FTL' as TechnologyCategory,
        level: 'Theoretical' as TechnologyLevel,
        era: 'Interstellar' as TechnologyEra,
        description: 'Faster-than-light travel through spacetime manipulation',
        complexity: 10,
        researchCost: 50000000,
        implementationCost: 25000000,
        maintenanceCost: 5000000,
        economicBonus: 500000,
        militaryBonus: 200000,
        researchBonus: 100000,
        theoreticalOnly: true
      },
      {
        name: 'Quantum Entanglement Communication',
        category: 'Communication' as TechnologyCategory,
        level: 'Experimental' as TechnologyLevel,
        era: 'Interstellar' as TechnologyEra,
        description: 'Instantaneous communication across any distance',
        complexity: 9,
        researchCost: 10000000,
        implementationCost: 5000000,
        maintenanceCost: 1000000,
        economicBonus: 100000,
        militaryBonus: 150000,
        researchBonus: 75000
      },
      {
        name: 'Dyson Sphere Construction',
        category: 'Megastructures' as TechnologyCategory,
        level: 'Transcendent' as TechnologyLevel,
        era: 'Galactic' as TechnologyEra,
        description: 'Massive stellar energy collection megastructure',
        complexity: 10,
        researchCost: 1000000000,
        implementationCost: 500000000,
        maintenanceCost: 100000000,
        economicBonus: 10000000,
        militaryBonus: 1000000,
        researchBonus: 5000000
      }
    ];

    for (const techData of spaceTechs) {
      const tech = this.createTechnology(techData);
      technologies.push(tech);
    }
  }

  private generateEnergyTechnologies(technologies: Technology[]): void {
    const energyTechs = [
      {
        name: 'Cold Fusion Reactor',
        category: 'Energy' as TechnologyCategory,
        level: 'Experimental' as TechnologyLevel,
        era: 'Space Age' as TechnologyEra,
        description: 'Room-temperature nuclear fusion power generation',
        complexity: 9,
        researchCost: 15000000,
        implementationCost: 7500000,
        maintenanceCost: 1500000,
        economicBonus: 200000,
        militaryBonus: 50000,
        researchBonus: 100000
      },
      {
        name: 'Zero Point Energy Extraction',
        category: 'Exotic Matter' as TechnologyCategory,
        level: 'Theoretical' as TechnologyLevel,
        era: 'Interstellar' as TechnologyEra,
        description: 'Harvesting energy from quantum vacuum fluctuations',
        complexity: 10,
        researchCost: 100000000,
        implementationCost: 50000000,
        maintenanceCost: 10000000,
        economicBonus: 2000000,
        militaryBonus: 500000,
        researchBonus: 1000000,
        theoreticalOnly: true
      },
      {
        name: 'Stellar Engineering',
        category: 'Galactic Engineering' as TechnologyCategory,
        level: 'Transcendent' as TechnologyLevel,
        era: 'Galactic' as TechnologyEra,
        description: 'Direct manipulation of stellar processes and lifecycles',
        complexity: 10,
        researchCost: 500000000,
        implementationCost: 250000000,
        maintenanceCost: 50000000,
        economicBonus: 5000000,
        militaryBonus: 2000000,
        researchBonus: 2500000
      }
    ];

    for (const techData of energyTechs) {
      const tech = this.createTechnology(techData);
      technologies.push(tech);
    }
  }

  private generateConsciousnessTechnologies(technologies: Technology[]): void {
    const consciousnessTechs = [
      {
        name: 'Neural Interface Implants',
        category: 'Consciousness' as TechnologyCategory,
        level: 'Advanced' as TechnologyLevel,
        era: 'Digital' as TechnologyEra,
        description: 'Direct brain-computer interface technology',
        complexity: 7,
        researchCost: 3000000,
        implementationCost: 1500000,
        maintenanceCost: 300000,
        economicBonus: 75000,
        militaryBonus: 100000,
        researchBonus: 50000,
        isPsychicTech: true
      },
      {
        name: 'Consciousness Transfer Protocol',
        category: 'Consciousness' as TechnologyCategory,
        level: 'Experimental' as TechnologyLevel,
        era: 'Interplanetary' as TechnologyEra,
        description: 'Digital backup and transfer of human consciousness',
        complexity: 9,
        researchCost: 25000000,
        implementationCost: 12500000,
        maintenanceCost: 2500000,
        economicBonus: 500000,
        militaryBonus: 200000,
        researchBonus: 300000,
        isPsychicTech: true
      },
      {
        name: 'Collective Consciousness Network',
        category: 'Consciousness' as TechnologyCategory,
        level: 'Transcendent' as TechnologyLevel,
        era: 'Galactic' as TechnologyEra,
        description: 'Shared consciousness across multiple individuals',
        complexity: 10,
        researchCost: 200000000,
        implementationCost: 100000000,
        maintenanceCost: 20000000,
        economicBonus: 3000000,
        militaryBonus: 1000000,
        researchBonus: 2000000,
        isPsychicTech: true,
        requiresPsychicAbility: true
      },
      {
        name: 'Artificial General Intelligence',
        category: 'AI' as TechnologyCategory,
        level: 'Cutting-Edge' as TechnologyLevel,
        era: 'Space Age' as TechnologyEra,
        description: 'Human-level artificial intelligence with general reasoning',
        complexity: 8,
        researchCost: 20000000,
        implementationCost: 10000000,
        maintenanceCost: 2000000,
        economicBonus: 300000,
        militaryBonus: 400000,
        researchBonus: 500000
      }
    ];

    for (const techData of consciousnessTechs) {
      const tech = this.createTechnology(techData);
      technologies.push(tech);
    }
  }

  private generateExoticPhysicsTechnologies(technologies: Technology[]): void {
    const exoticTechs = [
      {
        name: 'Gravitational Manipulation',
        category: 'Exotic Matter' as TechnologyCategory,
        level: 'Theoretical' as TechnologyLevel,
        era: 'Interstellar' as TechnologyEra,
        description: 'Direct control over gravitational fields',
        complexity: 10,
        researchCost: 75000000,
        implementationCost: 37500000,
        maintenanceCost: 7500000,
        economicBonus: 1000000,
        militaryBonus: 2000000,
        researchBonus: 500000,
        theoreticalOnly: true
      },
      {
        name: 'Exotic Matter Synthesis',
        category: 'Exotic Matter' as TechnologyCategory,
        level: 'Experimental' as TechnologyLevel,
        era: 'Interstellar' as TechnologyEra,
        description: 'Creation of matter with negative energy density',
        complexity: 9,
        researchCost: 40000000,
        implementationCost: 20000000,
        maintenanceCost: 4000000,
        economicBonus: 600000,
        militaryBonus: 800000,
        researchBonus: 400000
      },
      {
        name: 'Quantum Tunneling Drives',
        category: 'Quantum' as TechnologyCategory,
        level: 'Cutting-Edge' as TechnologyLevel,
        era: 'Interplanetary' as TechnologyEra,
        description: 'Propulsion through quantum mechanical tunneling effects',
        complexity: 8,
        researchCost: 12000000,
        implementationCost: 6000000,
        maintenanceCost: 1200000,
        economicBonus: 150000,
        militaryBonus: 300000,
        researchBonus: 100000
      }
    ];

    for (const techData of exoticTechs) {
      const tech = this.createTechnology(techData);
      technologies.push(tech);
    }
  }

  private generateGalacticEngineeringTechnologies(technologies: Technology[]): void {
    const galacticTechs = [
      {
        name: 'Planetary Terraforming',
        category: 'Terraforming' as TechnologyCategory,
        level: 'Advanced' as TechnologyLevel,
        era: 'Interplanetary' as TechnologyEra,
        description: 'Large-scale planetary atmosphere and ecosystem engineering',
        complexity: 7,
        researchCost: 8000000,
        implementationCost: 4000000,
        maintenanceCost: 800000,
        economicBonus: 200000,
        militaryBonus: 50000,
        researchBonus: 100000
      },
      {
        name: 'Ringworld Construction',
        category: 'Megastructures' as TechnologyCategory,
        level: 'Transcendent' as TechnologyLevel,
        era: 'Galactic' as TechnologyEra,
        description: 'Massive ring-shaped habitat around a star',
        complexity: 10,
        researchCost: 2000000000,
        implementationCost: 1000000000,
        maintenanceCost: 200000000,
        economicBonus: 20000000,
        militaryBonus: 5000000,
        researchBonus: 10000000
      },
      {
        name: 'Galactic Positioning Network',
        category: 'Galactic Engineering' as TechnologyCategory,
        level: 'Cutting-Edge' as TechnologyLevel,
        era: 'Galactic' as TechnologyEra,
        description: 'Galaxy-wide navigation and communication infrastructure',
        complexity: 9,
        researchCost: 100000000,
        implementationCost: 50000000,
        maintenanceCost: 10000000,
        economicBonus: 2000000,
        militaryBonus: 1500000,
        researchBonus: 1000000
      }
    ];

    for (const techData of galacticTechs) {
      const tech = this.createTechnology(techData);
      technologies.push(tech);
    }
  }

  private generateDimensionalTechnologies(technologies: Technology[]): void {
    const dimensionalTechs = [
      {
        name: 'Dimensional Pocket Storage',
        category: 'Dimensional' as TechnologyCategory,
        level: 'Experimental' as TechnologyLevel,
        era: 'Interstellar' as TechnologyEra,
        description: 'Storage of matter in pocket dimensions',
        complexity: 9,
        researchCost: 30000000,
        implementationCost: 15000000,
        maintenanceCost: 3000000,
        economicBonus: 400000,
        militaryBonus: 600000,
        researchBonus: 200000,
        requiresPsychicAbility: true
      },
      {
        name: 'Temporal Manipulation Field',
        category: 'Temporal' as TechnologyCategory,
        level: 'Theoretical' as TechnologyLevel,
        era: 'Transcendent' as TechnologyEra,
        description: 'Local manipulation of time flow rates',
        complexity: 10,
        researchCost: 500000000,
        implementationCost: 250000000,
        maintenanceCost: 50000000,
        economicBonus: 5000000,
        militaryBonus: 10000000,
        researchBonus: 2500000,
        theoreticalOnly: true,
        requiresPsychicAbility: true
      },
      {
        name: 'Reality Anchor Technology',
        category: 'Dimensional' as TechnologyCategory,
        level: 'Transcendent' as TechnologyLevel,
        era: 'Transcendent' as TechnologyEra,
        description: 'Stabilization of local reality against dimensional intrusions',
        complexity: 10,
        researchCost: 1000000000,
        implementationCost: 500000000,
        maintenanceCost: 100000000,
        economicBonus: 10000000,
        militaryBonus: 20000000,
        researchBonus: 5000000,
        requiresPsychicAbility: true
      }
    ];

    for (const techData of dimensionalTechs) {
      const tech = this.createTechnology(techData);
      technologies.push(tech);
    }
  }

  private generatePsychicPowers(psychicPowers: PsychicPower[], technologies: Technology[]): void {
    const psychicPowerData = [
      {
        name: 'Basic Telepathy',
        category: 'Telepathy' as PsychicPowerCategory,
        level: 1,
        description: 'Read surface thoughts and emotions of nearby individuals',
        acquisitionMethod: 'Natural Awakening' as PsychicAcquisitionMethod,
        trainingRequired: true,
        trainingDuration: 90,
        trainingCost: 50000,
        mentalEnergyRequired: 10,
        range: 10,
        duration: 60,
        cooldown: 300,
        burnoutRisk: 5,
        psychicFeedbackRisk: 2,
        detectionRisk: 30,
        prevalenceInPopulation: 0.1
      },
      {
        name: 'Telekinetic Manipulation',
        category: 'Telekinesis' as PsychicPowerCategory,
        level: 3,
        description: 'Move and manipulate objects with mental force',
        acquisitionMethod: 'Meditation Training' as PsychicAcquisitionMethod,
        trainingRequired: true,
        trainingDuration: 180,
        trainingCost: 100000,
        mentalEnergyRequired: 25,
        range: 5,
        duration: 120,
        cooldown: 600,
        burnoutRisk: 15,
        psychicFeedbackRisk: 10,
        detectionRisk: 60,
        prevalenceInPopulation: 0.05
      },
      {
        name: 'Precognitive Flashes',
        category: 'Precognition' as PsychicPowerCategory,
        level: 2,
        description: 'Brief glimpses of possible future events',
        acquisitionMethod: 'Natural Awakening' as PsychicAcquisitionMethod,
        trainingRequired: false,
        trainingDuration: 0,
        trainingCost: 0,
        mentalEnergyRequired: 15,
        range: -1,
        duration: 5,
        cooldown: 3600,
        burnoutRisk: 20,
        psychicFeedbackRisk: 25,
        detectionRisk: 10,
        prevalenceInPopulation: 0.02
      },
      {
        name: 'Technopathic Interface',
        category: 'Technopathy' as PsychicPowerCategory,
        level: 5,
        description: 'Direct mental interface with electronic systems',
        acquisitionMethod: 'Technological Augmentation' as PsychicAcquisitionMethod,
        trainingRequired: true,
        trainingDuration: 365,
        trainingCost: 500000,
        mentalEnergyRequired: 40,
        range: 1,
        duration: 300,
        cooldown: 1800,
        burnoutRisk: 30,
        psychicFeedbackRisk: 40,
        detectionRisk: 80,
        prevalenceInPopulation: 0.001,
        requiredTechnologies: ['neural_interface_implants']
      },
      {
        name: 'Dimensional Sight',
        category: 'Dimensional Sight' as PsychicPowerCategory,
        level: 7,
        description: 'Perceive objects and entities in parallel dimensions',
        acquisitionMethod: 'Dimensional Exposure' as PsychicAcquisitionMethod,
        trainingRequired: true,
        trainingDuration: 730,
        trainingCost: 2000000,
        mentalEnergyRequired: 60,
        range: 100,
        duration: 180,
        cooldown: 7200,
        burnoutRisk: 50,
        psychicFeedbackRisk: 60,
        detectionRisk: 90,
        prevalenceInPopulation: 0.0001,
        requiredTechnologies: ['dimensional_pocket_storage']
      },
      {
        name: 'Consciousness Transfer',
        category: 'Consciousness Transfer' as PsychicPowerCategory,
        level: 9,
        description: 'Transfer consciousness between bodies or digital substrates',
        acquisitionMethod: 'Consciousness Upload' as PsychicAcquisitionMethod,
        trainingRequired: true,
        trainingDuration: 1095,
        trainingCost: 10000000,
        mentalEnergyRequired: 100,
        range: -1,
        duration: -1,
        cooldown: 86400,
        burnoutRisk: 80,
        psychicFeedbackRisk: 90,
        detectionRisk: 100,
        prevalenceInPopulation: 0.00001,
        requiredTechnologies: ['consciousness_transfer_protocol']
      }
    ];

    for (const powerData of psychicPowerData) {
      const power: PsychicPower = {
        id: `psychic_${powerData.name.toLowerCase().replace(/\s+/g, '_')}`,
        name: powerData.name,
        category: powerData.category,
        level: powerData.level,
        description: powerData.description,
        acquisitionMethod: powerData.acquisitionMethod,
        trainingRequired: powerData.trainingRequired,
        trainingDuration: powerData.trainingDuration,
        trainingCost: powerData.trainingCost,
        requiredTechnologies: powerData.requiredTechnologies || [],
        requiredPowers: [],
        geneticRequirements: [],
        mentalEnergyRequired: powerData.mentalEnergyRequired,
        range: powerData.range,
        duration: powerData.duration,
        cooldown: powerData.cooldown,
        burnoutRisk: powerData.burnoutRisk,
        psychicFeedbackRisk: powerData.psychicFeedbackRisk,
        detectionRisk: powerData.detectionRisk,
        militaryApplications: this.generateMilitaryApplications(powerData.category),
        civilianApplications: this.generateCivilianApplications(powerData.category),
        researchApplications: this.generateResearchApplications(powerData.category),
        metadata: {
          discoveredBy: 'Natural Manifestation',
          firstManifestationDate: new Date(),
          prevalenceInPopulation: powerData.prevalenceInPopulation,
          governmentClassification: this.determineClassification(powerData.level),
          ethicalConcerns: this.generateEthicalConcerns(powerData.category)
        }
      };

      psychicPowers.push(power);
    }
  }

  private createTechnology(techData: any): Technology {
    return {
      id: `${techData.name.toLowerCase().replace(/\s+/g, '_')}`,
      name: techData.name,
      category: techData.category,
      level: techData.level,
      era: techData.era,
      description: techData.description,
      complexity: techData.complexity,
      researchCost: techData.researchCost,
      implementationCost: techData.implementationCost,
      maintenanceCost: techData.maintenanceCost,
      treeState: 'Hidden',
      isDeadEnd: this.prng() < 0.1, // 10% chance of dead end
      hiddenUntilDiscovered: true,
      prerequisites: [],
      unlocks: [],
      softPrerequisites: [],
      alternativePrerequisites: [],
      economicBonus: techData.economicBonus,
      militaryBonus: techData.militaryBonus,
      researchBonus: techData.researchBonus,
      acquisitionMethod: 'Research',
      acquisitionDate: new Date(),
      acquisitionCost: techData.researchCost,
      implementationProgress: 0,
      operationalStatus: 'Research',
      securityLevel: Math.floor(this.prng() * 5) + 5,
      vulnerabilityScore: Math.floor(this.prng() * 5) + 3,
      metadata: {
        discoveredBy: 'Unknown',
        patents: [],
        classifications: [],
        exportRestrictions: techData.level === 'Cutting-Edge' || techData.level === 'Experimental',
        dualUse: techData.category === 'Military' || this.prng() > 0.7,
        isPsychicTech: techData.isPsychicTech || false,
        requiresPsychicAbility: techData.requiresPsychicAbility || false,
        alienOrigin: techData.alienOrigin || false,
        theoreticalOnly: techData.theoreticalOnly || false
      }
    };
  }

  private createTechTreeNodes(techTree: TechTreeNode[], technologies: Technology[], psychicPowers: PsychicPower[]): void {
    let nodeIndex = 0;
    
    for (const tech of technologies) {
      const node: TechTreeNode = {
        technologyId: tech.id,
        position: this.generateNodePosition(nodeIndex, tech.era, tech.category),
        state: tech.treeState,
        discoveryProbability: this.calculateDiscoveryProbability(tech),
        prerequisiteConnections: [],
        unlockConnections: [],
        discoveryTriggers: this.generateDiscoveryTriggers(tech),
        hiddenConditions: this.generateHiddenConditions(tech),
        researchPriority: this.calculateResearchPriority(tech),
        deadEndProbability: tech.isDeadEnd ? 1.0 : this.prng() * 0.3,
        breakthroughPotential: this.calculateBreakthroughPotential(tech)
      };
      
      techTree.push(node);
      nodeIndex++;
    }
  }

  private createDynamicConnections(techTree: TechTreeNode[], technologies: Technology[]): void {
    // Create prerequisite chains based on complexity and era
    for (const tech of technologies) {
      const node = techTree.find(n => n.technologyId === tech.id);
      if (!node) continue;

      // Find potential prerequisites
      const prerequisites = this.findLogicalPrerequisites(tech, technologies);
      tech.prerequisites = prerequisites.map(p => p.id);

      // Create connections
      for (const prereq of prerequisites) {
        const prereqNode = techTree.find(n => n.technologyId === prereq.id);
        if (prereqNode) {
          const connection: TechTreeConnection = {
            fromTechId: prereq.id,
            toTechId: tech.id,
            connectionType: 'Hard Prerequisite',
            strength: 0.8 + this.prng() * 0.2,
            hidden: this.prng() < 0.3 // 30% of connections are hidden
          };
          
          node.prerequisiteConnections.push(connection);
          prereqNode.unlockConnections.push(connection);
        }
      }

      // Add soft prerequisites and alternative paths
      this.addSoftConnections(tech, technologies, node, techTree);
    }
  }

  private findLogicalPrerequisites(tech: Technology, technologies: Technology[]): Technology[] {
    const prerequisites: Technology[] = [];
    
    // Find technologies in earlier eras or same era with lower complexity
    const candidates = technologies.filter(t => 
      (this.getEraOrder(t.era) < this.getEraOrder(tech.era) || 
       (t.era === tech.era && t.complexity < tech.complexity)) &&
      this.isLogicalPrerequisite(t, tech)
    );

    // Select 1-3 prerequisites based on complexity
    const prereqCount = Math.min(Math.max(1, Math.floor(tech.complexity / 3)), 3);
    
    for (let i = 0; i < prereqCount && candidates.length > 0; i++) {
      const index = Math.floor(this.prng() * candidates.length);
      prerequisites.push(candidates.splice(index, 1)[0]);
    }

    return prerequisites;
  }

  private isLogicalPrerequisite(candidate: Technology, target: Technology): boolean {
    // Same category technologies are often prerequisites
    if (candidate.category === target.category) return true;
    
    // Cross-category logical connections
    const logicalConnections: Record<string, string[]> = {
      'FTL': ['Space', 'Energy', 'Quantum', 'Exotic Matter'],
      'Consciousness': ['AI', 'Biotechnology', 'Computing', 'Psychic'],
      'Psychic': ['Biotechnology', 'Medical', 'Consciousness'],
      'Galactic Engineering': ['Space', 'Megastructures', 'Energy'],
      'Dimensional': ['Quantum', 'Exotic Matter', 'Psychic'],
      'Temporal': ['Quantum', 'Dimensional', 'Exotic Matter']
    };

    return logicalConnections[target.category]?.includes(candidate.category) || false;
  }

  private addSoftConnections(tech: Technology, technologies: Technology[], node: TechTreeNode, techTree: TechTreeNode[]): void {
    // Add soft prerequisites (helpful but not required)
    const softCandidates = technologies.filter(t => 
      t.id !== tech.id &&
      !tech.prerequisites.includes(t.id) &&
      this.isSoftPrerequisite(t, tech)
    );

    const softCount = Math.floor(this.prng() * 3); // 0-2 soft prerequisites
    for (let i = 0; i < softCount && softCandidates.length > 0; i++) {
      const index = Math.floor(this.prng() * softCandidates.length);
      const softPrereq = softCandidates.splice(index, 1)[0];
      
      tech.softPrerequisites.push(softPrereq.id);
      
      const softNode = techTree.find(n => n.technologyId === softPrereq.id);
      if (softNode) {
        const connection: TechTreeConnection = {
          fromTechId: softPrereq.id,
          toTechId: tech.id,
          connectionType: 'Soft Prerequisite',
          strength: 0.3 + this.prng() * 0.4,
          hidden: this.prng() < 0.5
        };
        
        node.prerequisiteConnections.push(connection);
        softNode.unlockConnections.push(connection);
      }
    }

    // Add alternative prerequisite paths
    if (tech.prerequisites.length > 1 && this.prng() < 0.3) {
      const alternatives = this.findAlternativePrerequisites(tech, technologies);
      if (alternatives.length > 0) {
        tech.alternativePrerequisites.push(alternatives.map(a => a.id));
      }
    }
  }

  private isSoftPrerequisite(candidate: Technology, target: Technology): boolean {
    // Related categories that provide synergy bonuses
    const synergyMap: Record<string, string[]> = {
      'Space': ['Materials', 'Energy', 'Computing'],
      'AI': ['Computing', 'Consciousness', 'Quantum'],
      'Psychic': ['Medical', 'Biotechnology', 'AI'],
      'FTL': ['Dimensional', 'Temporal', 'Quantum']
    };

    return synergyMap[target.category]?.includes(candidate.category) || false;
  }

  private findAlternativePrerequisites(tech: Technology, technologies: Technology[]): Technology[] {
    // Find technologies that could serve as alternative paths
    return technologies.filter(t => 
      t.category === tech.category &&
      t.complexity >= tech.complexity - 2 &&
      t.complexity < tech.complexity &&
      !tech.prerequisites.includes(t.id)
    ).slice(0, 2);
  }

  private addDiscoveryMechanics(techTree: TechTreeNode[], technologies: Technology[]): void {
    for (const node of techTree) {
      const tech = technologies.find(t => t.id === node.technologyId);
      if (!tech) continue;

      // Add discovery triggers based on technology type
      node.discoveryTriggers = this.generateDiscoveryTriggers(tech);
      node.hiddenConditions = this.generateHiddenConditions(tech);
    }
  }

  private generateDiscoveryTriggers(tech: Technology): DiscoveryTrigger[] {
    const triggers: DiscoveryTrigger[] = [];

    // Research threshold trigger (always present)
    triggers.push({
      type: 'Research Threshold',
      conditions: {
        category: tech.category,
        researchPoints: tech.researchCost * 0.1,
        prerequisites: tech.prerequisites
      },
      probability: 0.3 + (tech.complexity * 0.05),
      oneTime: false
    });

    // Special triggers based on technology type
    if (tech.metadata.isPsychicTech) {
      triggers.push({
        type: 'Psychic Awakening',
        conditions: {
          psychicPopulation: 0.01,
          psychicEvents: 1
        },
        probability: 0.2,
        oneTime: true
      });
    }

    if (tech.metadata.alienOrigin) {
      triggers.push({
        type: 'Alien Contact',
        conditions: {
          alienEncounter: true,
          diplomaticRelations: 'Friendly'
        },
        probability: 0.8,
        oneTime: true
      });
    }

    if (tech.category === 'AI') {
      triggers.push({
        type: 'AI Breakthrough',
        conditions: {
          aiResearchLevel: 7,
          computingPower: 1000000
        },
        probability: 0.4,
        oneTime: false
      });
    }

    return triggers;
  }

  private generateHiddenConditions(tech: Technology): HiddenCondition[] {
    const conditions: HiddenCondition[] = [];

    // Era requirement
    conditions.push({
      type: 'Era Requirement',
      requirement: tech.era,
      revealsPrerequistes: true
    });

    // Population size for advanced technologies
    if (tech.level === 'Cutting-Edge' || tech.level === 'Experimental') {
      conditions.push({
        type: 'Population Size',
        requirement: 1000000 * tech.complexity,
        revealsPrerequistes: false
      });
    }

    // Psychic population for psychic technologies
    if (tech.metadata.requiresPsychicAbility) {
      conditions.push({
        type: 'Psychic Population',
        requirement: 0.001 * tech.complexity,
        revealsPrerequistes: true
      });
    }

    return conditions;
  }

  // Utility methods
  private getBasicTechnologiesForEra(era: TechnologyEra): any[] {
    const eraBasics: Record<TechnologyEra, any[]> = {
      'Stone Age': [
        { name: 'Fire Making', category: 'Energy', level: 'Primitive', complexity: 1, researchCost: 1000, implementationCost: 500, maintenanceCost: 100, description: 'Controlled use of fire for warmth and cooking' },
        { name: 'Stone Tools', category: 'Materials', level: 'Primitive', complexity: 1, researchCost: 500, implementationCost: 250, maintenanceCost: 50, description: 'Basic stone implements for hunting and gathering' }
      ],
      'Bronze Age': [
        { name: 'Bronze Working', category: 'Materials', level: 'Basic', complexity: 2, researchCost: 5000, implementationCost: 2500, maintenanceCost: 500, description: 'Alloy creation and metalworking techniques' },
        { name: 'Agriculture', category: 'Agricultural', level: 'Basic', complexity: 2, researchCost: 3000, implementationCost: 1500, maintenanceCost: 300, description: 'Systematic cultivation of crops and livestock' }
      ],
      'Iron Age': [
        { name: 'Iron Working', category: 'Materials', level: 'Basic', complexity: 3, researchCost: 10000, implementationCost: 5000, maintenanceCost: 1000, description: 'Iron smelting and tool production' },
        { name: 'Writing Systems', category: 'Communication', level: 'Basic', complexity: 2, researchCost: 8000, implementationCost: 4000, maintenanceCost: 800, description: 'Written language for record keeping and communication' }
      ],
      'Industrial': [
        { name: 'Steam Power', category: 'Energy', level: 'Intermediate', complexity: 4, researchCost: 50000, implementationCost: 25000, maintenanceCost: 5000, description: 'Steam-driven machinery and transportation' },
        { name: 'Mass Production', category: 'Industrial', level: 'Intermediate', complexity: 4, researchCost: 40000, implementationCost: 20000, maintenanceCost: 4000, description: 'Factory-based manufacturing systems' }
      ],
      'Information': [
        { name: 'Electronics', category: 'Computing', level: 'Intermediate', complexity: 5, researchCost: 100000, implementationCost: 50000, maintenanceCost: 10000, description: 'Electronic circuits and devices' },
        { name: 'Telecommunications', category: 'Communication', level: 'Intermediate', complexity: 5, researchCost: 80000, implementationCost: 40000, maintenanceCost: 8000, description: 'Long-distance electronic communication' }
      ],
      'Digital': [
        { name: 'Computer Networks', category: 'Computing', level: 'Advanced', complexity: 6, researchCost: 200000, implementationCost: 100000, maintenanceCost: 20000, description: 'Interconnected computer systems' },
        { name: 'Internet Protocols', category: 'Communication', level: 'Advanced', complexity: 6, researchCost: 150000, implementationCost: 75000, maintenanceCost: 15000, description: 'Global information network standards' }
      ],
      'Space Age': [],
      'Interplanetary': [],
      'Interstellar': [],
      'Galactic': [],
      'Transcendent': []
    };

    return eraBasics[era] || [];
  }

  private generateNodePosition(index: number, era: TechnologyEra, category: TechnologyCategory): { x: number; y: number } {
    const eraY = this.getEraOrder(era) * 200;
    const categoryX = this.getCategoryOrder(category) * 150;
    const jitter = (this.prng() - 0.5) * 50;
    
    return {
      x: categoryX + jitter,
      y: eraY + (index % 3) * 50
    };
  }

  private getEraOrder(era: TechnologyEra): number {
    const eras: TechnologyEra[] = [
      'Stone Age', 'Bronze Age', 'Iron Age', 'Industrial', 'Information', 'Digital',
      'Space Age', 'Interplanetary', 'Interstellar', 'Galactic', 'Transcendent'
    ];
    return eras.indexOf(era);
  }

  private getCategoryOrder(category: TechnologyCategory): number {
    const categories: TechnologyCategory[] = [
      'Materials', 'Energy', 'Agricultural', 'Industrial', 'Medical',
      'Transportation', 'Communication', 'Computing', 'Military', 'Space',
      'AI', 'Biotechnology', 'Quantum', 'Nanotechnology', 'Robotics',
      'Psychic', 'FTL', 'Terraforming', 'Megastructures', 'Consciousness',
      'Dimensional', 'Temporal', 'Exotic Matter', 'Galactic Engineering'
    ];
    return categories.indexOf(category);
  }

  private calculateDiscoveryProbability(tech: Technology): number {
    let probability = 0.1; // Base 10% chance per research cycle
    
    // Adjust based on complexity (higher complexity = lower probability)
    probability *= (11 - tech.complexity) / 10;
    
    // Adjust based on era (future tech is harder to discover)
    const eraMultiplier = Math.max(0.1, 1 - (this.getEraOrder(tech.era) * 0.1));
    probability *= eraMultiplier;
    
    // Theoretical technologies are much harder to discover
    if (tech.metadata.theoreticalOnly) {
      probability *= 0.1;
    }
    
    return Math.max(0.01, Math.min(0.5, probability));
  }

  private calculateResearchPriority(tech: Technology): number {
    let priority = 5; // Base priority
    
    // Higher for technologies with good economic/military bonuses
    priority += (tech.economicBonus + tech.militaryBonus + tech.researchBonus) / 100000;
    
    // Lower for dead ends
    if (tech.isDeadEnd) {
      priority *= 0.3;
    }
    
    // Higher for breakthrough potential
    priority += tech.complexity * 0.5;
    
    return Math.max(1, Math.min(10, priority));
  }

  private calculateBreakthroughPotential(tech: Technology): number {
    let potential = tech.complexity * 0.1;
    
    // Higher for cutting-edge and experimental technologies
    if (tech.level === 'Cutting-Edge') potential += 0.2;
    if (tech.level === 'Experimental') potential += 0.3;
    if (tech.level === 'Theoretical') potential += 0.4;
    if (tech.level === 'Transcendent') potential += 0.5;
    
    // Higher for psychic and exotic technologies
    if (tech.metadata.isPsychicTech) potential += 0.2;
    if (tech.category === 'Exotic Matter' || tech.category === 'Dimensional') potential += 0.3;
    
    return Math.max(0.1, Math.min(0.9, potential));
  }

  private determineStartingTechnologies(technologies: Technology[], startingEra: TechnologyEra): string[] {
    const startingTechs = technologies.filter(tech => 
      this.getEraOrder(tech.era) <= this.getEraOrder(startingEra) &&
      tech.complexity <= 3
    );
    
    return startingTechs.map(tech => tech.id);
  }

  private generateMilitaryApplications(category: PsychicPowerCategory): string[] {
    const applications: Record<PsychicPowerCategory, string[]> = {
      'Telepathy': ['Intelligence gathering', 'Interrogation', 'Battlefield communication'],
      'Telekinesis': ['Weapon manipulation', 'Projectile deflection', 'Equipment sabotage'],
      'Precognition': ['Tactical prediction', 'Ambush detection', 'Strategic planning'],
      'Mind Control': ['Enemy manipulation', 'Crowd control', 'Asset recruitment'],
      'Energy Manipulation': ['Weapon enhancement', 'Shield generation', 'EMP attacks'],
      'Technopathy': ['Electronic warfare', 'System infiltration', 'Drone control'],
      'Dimensional Sight': ['Reconnaissance', 'Hidden base detection', 'Stealth detection'],
      'Consciousness Transfer': ['Deep cover operations', 'Immortal commanders', 'Infiltration'],
      'Psychometry': ['Forensic investigation', 'Equipment history', 'Battlefield analysis'],
      'Empathy': ['Morale manipulation', 'Psychological warfare', 'Loyalty assessment'],
      'Astral Projection': ['Remote reconnaissance', 'Infiltration', 'Surveillance'],
      'Healing': ['Field medicine', 'Rapid recovery', 'Combat endurance'],
      'Time Perception': ['Reaction enhancement', 'Timing coordination', 'Temporal tactics']
    };
    
    return applications[category] || ['Unknown military applications'];
  }

  private generateCivilianApplications(category: PsychicPowerCategory): string[] {
    const applications: Record<PsychicPowerCategory, string[]> = {
      'Telepathy': ['Therapy', 'Education', 'Conflict resolution'],
      'Telekinesis': ['Construction', 'Manufacturing', 'Disability assistance'],
      'Precognition': ['Disaster prediction', 'Market forecasting', 'Safety planning'],
      'Mind Control': ['Addiction treatment', 'Phobia therapy', 'Behavior modification'],
      'Energy Manipulation': ['Power generation', 'Healing', 'Environmental control'],
      'Technopathy': ['System maintenance', 'Data recovery', 'Interface design'],
      'Dimensional Sight': ['Search and rescue', 'Archaeological exploration', 'Quality control'],
      'Consciousness Transfer': ['Medical treatment', 'Education', 'Experience sharing'],
      'Psychometry': ['Historical research', 'Crime investigation', 'Authentication'],
      'Empathy': ['Counseling', 'Customer service', 'Social work'],
      'Astral Projection': ['Exploration', 'Entertainment', 'Spiritual practice'],
      'Healing': ['Medical treatment', 'Veterinary care', 'Plant cultivation'],
      'Time Perception': ['Productivity enhancement', 'Sports performance', 'Art creation']
    };
    
    return applications[category] || ['Unknown civilian applications'];
  }

  private generateResearchApplications(category: PsychicPowerCategory): string[] {
    const applications: Record<PsychicPowerCategory, string[]> = {
      'Telepathy': ['Psychology research', 'Communication studies', 'Consciousness research'],
      'Telekinesis': ['Physics research', 'Materials science', 'Engineering'],
      'Precognition': ['Quantum mechanics', 'Probability theory', 'Temporal studies'],
      'Mind Control': ['Neuroscience', 'Behavioral psychology', 'Ethics research'],
      'Energy Manipulation': ['Physics research', 'Energy studies', 'Field theory'],
      'Technopathy': ['Computer science', 'AI research', 'Interface design'],
      'Dimensional Sight': ['Dimensional physics', 'Cosmology', 'Reality studies'],
      'Consciousness Transfer': ['Consciousness studies', 'Digital immortality', 'Identity research'],
      'Psychometry': ['Archaeology', 'Forensics', 'Historical research'],
      'Empathy': ['Social psychology', 'Emotional intelligence', 'Group dynamics'],
      'Astral Projection': ['Consciousness research', 'Out-of-body studies', 'Spiritual research'],
      'Healing': ['Medical research', 'Regenerative medicine', 'Bioenergy studies'],
      'Time Perception': ['Temporal mechanics', 'Relativity research', 'Consciousness studies']
    };
    
    return applications[category] || ['Unknown research applications'];
  }

  private determineClassification(level: number): string {
    if (level <= 2) return 'Unclassified';
    if (level <= 4) return 'Restricted';
    if (level <= 6) return 'Confidential';
    if (level <= 8) return 'Secret';
    return 'Top Secret';
  }

  private generateEthicalConcerns(category: PsychicPowerCategory): string[] {
    const concerns: Record<PsychicPowerCategory, string[]> = {
      'Telepathy': ['Privacy violation', 'Consent issues', 'Mental intrusion'],
      'Telekinesis': ['Property damage', 'Unintended harm', 'Weapon potential'],
      'Precognition': ['Free will paradox', 'Predestination ethics', 'Information misuse'],
      'Mind Control': ['Autonomy violation', 'Coercion', 'Identity erasure'],
      'Energy Manipulation': ['Uncontrolled discharge', 'Environmental damage', 'Weapon creation'],
      'Technopathy': ['System security', 'Digital privacy', 'Infrastructure vulnerability'],
      'Dimensional Sight': ['Reality perception', 'Sanity risks', 'Dimensional contamination'],
      'Consciousness Transfer': ['Identity continuity', 'Soul questions', 'Digital rights'],
      'Psychometry': ['Privacy of objects', 'Historical accuracy', 'Traumatic memories'],
      'Empathy': ['Emotional manipulation', 'Boundary violations', 'Psychological harm'],
      'Astral Projection': ['Spiritual trespass', 'Reality detachment', 'Identity confusion'],
      'Healing': ['Medical regulation', 'Unequal access', 'Dependency creation'],
      'Time Perception': ['Temporal paradox', 'Reality distortion', 'Causality violation']
    };
    
    return concerns[category] || ['Unknown ethical implications'];
  }
}
