import { GameMasterPersonality } from './ContentGenerator';
import { GalacticCivilizationGenerator, GalacticRace, StarSystem, Planet, Civilization } from './GalacticCivilizationGenerator';
import { PlayerInteractionService } from './PlayerInteractionService';

export interface ExplorationState {
  playerId: string;
  discoveredSystems: Set<string>;
  discoveredRaces: Set<string>;
  discoveredCivilizations: Set<string>;
  explorationLevel: number; // 1-10, affects discovery range and quality
  currentLocation: {
    systemId: string;
    planetId?: string;
    cityId?: string;
  };
  explorationHistory: ExplorationEvent[];
  activeExpeditions: Expedition[];
  explorationPoints: number; // Currency for exploration activities
  discoveryStreak: number; // Consecutive discoveries for bonuses
}

export interface ExplorationEvent {
  id: string;
  timestamp: Date;
  type: 'SYSTEM_DISCOVERY' | 'PLANET_DISCOVERY' | 'RACE_FIRST_CONTACT' | 'CIVILIZATION_ENCOUNTER' | 'ANOMALY_FOUND' | 'RESOURCE_DISCOVERY';
  location: {
    systemId: string;
    planetId?: string;
    coordinates?: { x: number; y: number; z: number };
  };
  discoveredEntity?: {
    id: string;
    name: string;
    type: string;
  };
  significance: 'MINOR' | 'MAJOR' | 'HISTORIC' | 'LEGENDARY';
  description: string;
  rewards: ExplorationReward[];
  sharedWithNetwork: boolean;
}

export interface ExplorationReward {
  type: 'EXPLORATION_POINTS' | 'REPUTATION' | 'TECHNOLOGY' | 'RESOURCES' | 'SOCIAL_FOLLOWERS' | 'UNIQUE_ITEM';
  amount: number;
  description: string;
}

export interface Expedition {
  id: string;
  name: string;
  playerId: string;
  targetLocation: {
    systemId?: string;
    coordinates?: { x: number; y: number; z: number };
    searchRadius?: number;
  };
  objectives: ExplorationObjective[];
  startTime: Date;
  estimatedDuration: number; // in hours
  status: 'PREPARING' | 'IN_TRANSIT' | 'EXPLORING' | 'RETURNING' | 'COMPLETED' | 'FAILED';
  crew: ExpeditionCrew[];
  equipment: ExpeditionEquipment[];
  discoveries: ExplorationEvent[];
  cost: number; // in exploration points
  riskLevel: number; // 1-10
}

export interface ExplorationObjective {
  id: string;
  type: 'FIND_HABITABLE_PLANET' | 'DISCOVER_NEW_RACE' | 'MAP_SYSTEM' | 'FIND_RESOURCES' | 'INVESTIGATE_ANOMALY' | 'ESTABLISH_CONTACT';
  description: string;
  completed: boolean;
  reward: ExplorationReward[];
}

export interface ExpeditionCrew {
  id: string;
  name: string;
  role: 'CAPTAIN' | 'NAVIGATOR' | 'SCIENTIST' | 'DIPLOMAT' | 'ENGINEER' | 'SECURITY';
  skill: number; // 1-10
  specialization: string;
  experience: number;
}

export interface ExpeditionEquipment {
  id: string;
  name: string;
  type: 'SCANNER' | 'PROBE' | 'COMMUNICATION' | 'DEFENSE' | 'LIFE_SUPPORT' | 'RESEARCH';
  quality: number; // 1-10
  durability: number; // 0-100%
  specialFeatures: string[];
}

export interface DiscoveryZone {
  id: string;
  name: string;
  centerCoordinates: { x: number; y: number; z: number };
  radius: number; // in light years
  discoveryDensity: number; // 0-1, how likely discoveries are
  dangerLevel: number; // 1-10
  specialCharacteristics: string[];
  dominantPhenomena: string[];
  recommendedLevel: number; // Player exploration level
}

export interface CosmicAnomaly {
  id: string;
  name: string;
  type: 'WORMHOLE' | 'NEBULA' | 'BLACK_HOLE' | 'NEUTRON_STAR' | 'DARK_MATTER_CLOUD' | 'QUANTUM_STORM' | 'TEMPORAL_RIFT' | 'ANCIENT_ARTIFACT';
  location: { x: number; y: number; z: number };
  discoveredBy?: string; // Player ID
  discoveryDate?: Date;
  effects: AnomalyEffect[];
  studyRequirements: string[];
  potentialRewards: ExplorationReward[];
  dangerLevel: number; // 1-10
}

export interface AnomalyEffect {
  type: 'NAVIGATION_HAZARD' | 'COMMUNICATION_INTERFERENCE' | 'ENERGY_BOOST' | 'TIME_DILATION' | 'DIMENSIONAL_INSTABILITY' | 'ENHANCED_DISCOVERY';
  strength: number; // 1-10
  radius: number; // in light years
  description: string;
}

export interface FirstContactProtocol {
  raceId: string;
  contactingPlayerId: string;
  contactDate: Date;
  contactMethod: 'PEACEFUL' | 'ACCIDENTAL' | 'HOSTILE' | 'TRADE' | 'DISTRESS_SIGNAL';
  initialReaction: 'FRIENDLY' | 'CAUTIOUS' | 'HOSTILE' | 'CURIOUS' | 'INDIFFERENT';
  communicationEstablished: boolean;
  culturalExchangeLevel: number; // 0-10
  diplomaticStatus: 'UNKNOWN' | 'NEUTRAL' | 'FRIENDLY' | 'ALLIED' | 'TENSE' | 'HOSTILE';
  tradeRelations: boolean;
  sharedTechnologies: string[];
  ongoingNegotiations: string[];
}

export class GalacticExplorationService {
  private personality: GameMasterPersonality;
  private civilizationGenerator: GalacticCivilizationGenerator;
  private playerInteractionService: PlayerInteractionService;
  private explorationStates: Map<string, ExplorationState>;
  private discoveryZones: Map<string, DiscoveryZone>;
  private cosmicAnomalies: Map<string, CosmicAnomaly>;
  private firstContacts: Map<string, FirstContactProtocol>;
  private globalDiscoveries: Map<string, ExplorationEvent>; // Shared discoveries
  private explorationQueue: Map<string, Expedition[]>; // Player expedition queues
  private discoveryGenerationRadius: number;

  constructor(
    personality: GameMasterPersonality,
    civilizationGenerator: GalacticCivilizationGenerator,
    playerInteractionService: PlayerInteractionService
  ) {
    this.personality = personality;
    this.civilizationGenerator = civilizationGenerator;
    this.playerInteractionService = playerInteractionService;
    this.explorationStates = new Map();
    this.discoveryZones = new Map();
    this.cosmicAnomalies = new Map();
    this.firstContacts = new Map();
    this.globalDiscoveries = new Map();
    this.explorationQueue = new Map();
    this.discoveryGenerationRadius = 100; // Light years around player

    this.initializeExplorationSystem();
  }

  private async initializeExplorationSystem() {
    console.log('🚀 Initializing Galactic Exploration System...');
    
    // Generate initial discovery zones
    await this.generateDiscoveryZones();
    
    // Generate cosmic anomalies
    await this.generateCosmicAnomalies();
    
    // Start background discovery generation
    this.startBackgroundGeneration();
    
    console.log('✨ Exploration System Ready!');
  }

  // Initialize player exploration state
  async initializePlayerExploration(playerId: string, startingSystemId: string): Promise<ExplorationState> {
    const explorationState: ExplorationState = {
      playerId,
      discoveredSystems: new Set([startingSystemId]),
      discoveredRaces: new Set(),
      discoveredCivilizations: new Set(),
      explorationLevel: 1,
      currentLocation: { systemId: startingSystemId },
      explorationHistory: [],
      activeExpeditions: [],
      explorationPoints: 100, // Starting points
      discoveryStreak: 0
    };

    this.explorationStates.set(playerId, explorationState);
    this.explorationQueue.set(playerId, []);

    // Generate initial discoveries around starting location
    await this.generateNearbyDiscoveries(playerId, startingSystemId);

    return explorationState;
  }

  // Launch an exploration expedition
  async launchExpedition(playerId: string, expeditionConfig: Partial<Expedition>): Promise<Expedition> {
    const playerState = this.explorationStates.get(playerId);
    if (!playerState) {
      throw new Error('Player exploration state not initialized');
    }

    // Generate expedition details
    const expedition = await this.createExpedition(playerId, expeditionConfig);
    
    // Check if player can afford it
    if (playerState.explorationPoints < expedition.cost) {
      throw new Error('Insufficient exploration points');
    }

    // Deduct cost and add to active expeditions
    playerState.explorationPoints -= expedition.cost;
    playerState.activeExpeditions.push(expedition);

    // Add to processing queue
    const playerQueue = this.explorationQueue.get(playerId) || [];
    playerQueue.push(expedition);
    this.explorationQueue.set(playerId, playerQueue);

    console.log(`🚀 Expedition "${expedition.name}" launched by ${playerId}`);
    return expedition;
  }

  // Process expedition progress
  async processExpeditions(): Promise<void> {
    for (const [playerId, expeditions] of this.explorationQueue) {
      for (let i = expeditions.length - 1; i >= 0; i--) {
        const expedition = expeditions[i];
        const progress = await this.processExpeditionProgress(expedition);
        
        if (progress.completed) {
          // Remove from queue and update player state
          expeditions.splice(i, 1);
          await this.completeExpedition(playerId, expedition);
        }
      }
    }
  }

  private async processExpeditionProgress(expedition: Expedition): Promise<{ completed: boolean; discoveries: ExplorationEvent[] }> {
    const now = new Date();
    const elapsed = now.getTime() - expedition.startTime.getTime();
    const expectedDuration = expedition.estimatedDuration * 60 * 60 * 1000; // Convert hours to ms
    
    const progress = elapsed / expectedDuration;
    
    if (progress >= 1.0) {
      // Expedition completed
      expedition.status = 'COMPLETED';
      return { completed: true, discoveries: expedition.discoveries };
    }

    // Check for discoveries during expedition
    if (expedition.status === 'EXPLORING' && Math.random() < 0.1) { // 10% chance per check
      const discovery = await this.generateExpeditionDiscovery(expedition);
      if (discovery) {
        expedition.discoveries.push(discovery);
      }
    }

    return { completed: false, discoveries: expedition.discoveries };
  }

  // Generate a discovery during an expedition
  private async generateExpeditionDiscovery(expedition: Expedition): Promise<ExplorationEvent | null> {
    const discoveryTypes = ['SYSTEM_DISCOVERY', 'PLANET_DISCOVERY', 'RACE_FIRST_CONTACT', 'ANOMALY_FOUND', 'RESOURCE_DISCOVERY'];
    const discoveryType = this.randomChoice(discoveryTypes) as ExplorationEvent['type'];

    let discoveredEntity: ExplorationEvent['discoveredEntity'];
    let significance: ExplorationEvent['significance'] = 'MINOR';
    let description = '';
    const rewards: ExplorationReward[] = [];

    switch (discoveryType) {
      case 'SYSTEM_DISCOVERY':
        // Generate new star system
        const newSystem = await this.generateNewStarSystem(expedition.targetLocation.coordinates);
        discoveredEntity = {
          id: newSystem.id,
          name: newSystem.name,
          type: 'STAR_SYSTEM'
        };
        significance = newSystem.totalPopulation > 0 ? 'MAJOR' : 'MINOR';
        description = `Discovered ${newSystem.name}, a ${newSystem.starType}-type star system with ${newSystem.planets.length} planets.`;
        rewards.push({
          type: 'EXPLORATION_POINTS',
          amount: significance === 'MAJOR' ? 50 : 25,
          description: 'System discovery bonus'
        });
        break;

      case 'PLANET_DISCOVERY':
        // Generate new planet in known system
        const newPlanet = await this.generateNewPlanet(expedition.targetLocation.systemId);
        if (newPlanet) {
          discoveredEntity = {
            id: newPlanet.id,
            name: newPlanet.name,
            type: 'PLANET'
          };
          significance = newPlanet.population > 0 ? 'MAJOR' : 'MINOR';
          description = `Discovered ${newPlanet.name}, a ${newPlanet.type.toLowerCase().replace('_', ' ')} planet.`;
          rewards.push({
            type: 'EXPLORATION_POINTS',
            amount: significance === 'MAJOR' ? 30 : 15,
            description: 'Planet discovery bonus'
          });
        }
        break;

      case 'RACE_FIRST_CONTACT':
        // Generate new alien race
        const newRace = await this.generateNewAlienRace();
        discoveredEntity = {
          id: newRace.id,
          name: newRace.name,
          type: 'ALIEN_RACE'
        };
        significance = 'HISTORIC';
        description = `First contact with the ${newRace.name}, a ${newRace.type.toLowerCase().replace('_', ' ')} species!`;
        rewards.push(
          {
            type: 'EXPLORATION_POINTS',
            amount: 100,
            description: 'First contact achievement'
          },
          {
            type: 'REPUTATION',
            amount: 25,
            description: 'Diplomatic reputation boost'
          },
          {
            type: 'SOCIAL_FOLLOWERS',
            amount: 500,
            description: 'Fame from historic discovery'
          }
        );
        
        // Establish first contact protocol
        await this.establishFirstContact(expedition.playerId, newRace.id);
        break;

      case 'ANOMALY_FOUND':
        // Generate cosmic anomaly
        const anomaly = await this.generateCosmicAnomaly(expedition.targetLocation.coordinates);
        discoveredEntity = {
          id: anomaly.id,
          name: anomaly.name,
          type: 'COSMIC_ANOMALY'
        };
        significance = anomaly.dangerLevel > 7 ? 'LEGENDARY' : 'MAJOR';
        description = `Discovered ${anomaly.name}, a ${anomaly.type.toLowerCase().replace('_', ' ')}!`;
        rewards.push({
          type: 'EXPLORATION_POINTS',
          amount: significance === 'LEGENDARY' ? 75 : 40,
          description: 'Anomaly discovery bonus'
        });
        break;

      case 'RESOURCE_DISCOVERY':
        // Generate resource deposit
        const resources = this.generateResourceDeposit();
        discoveredEntity = {
          id: `resource_${Date.now()}`,
          name: resources.name,
          type: 'RESOURCE_DEPOSIT'
        };
        significance = resources.rarity === 'LEGENDARY' ? 'HISTORIC' : 'MINOR';
        description = `Discovered ${resources.name}, a ${resources.rarity.toLowerCase()} resource deposit.`;
        rewards.push({
          type: 'RESOURCES',
          amount: resources.amount,
          description: `${resources.name} extraction rights`
        });
        break;
    }

    if (!discoveredEntity) return null;

    const discovery: ExplorationEvent = {
      id: `discovery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type: discoveryType,
      location: {
        systemId: expedition.targetLocation.systemId || 'unknown',
        coordinates: expedition.targetLocation.coordinates
      },
      discoveredEntity,
      significance,
      description,
      rewards,
      sharedWithNetwork: false
    };

    return discovery;
  }

  // Generate a new star system during exploration
  private async generateNewStarSystem(nearCoordinates?: { x: number; y: number; z: number }): Promise<StarSystem> {
    // Use the civilization generator to create a new system
    const newSystem = await this.civilizationGenerator.generateSingleSystem();
    
    // If coordinates provided, place it nearby
    if (nearCoordinates) {
      const offset = {
        x: (Math.random() - 0.5) * 20, // ±10 light years
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 4   // Thinner in Z direction
      };
      
      newSystem.coordinates = {
        x: nearCoordinates.x + offset.x,
        y: nearCoordinates.y + offset.y,
        z: nearCoordinates.z + offset.z
      };
    }

    // Add to civilization generator's system map
    this.civilizationGenerator.addSystem(newSystem);
    
    return newSystem;
  }

  // Generate a new planet in an existing system
  private async generateNewPlanet(systemId?: string): Promise<Planet | null> {
    if (!systemId) return null;
    
    const system = this.civilizationGenerator.getSystemById(systemId);
    if (!system) return null;

    // Generate new planet for this system
    const newPlanet = await this.civilizationGenerator.generateSinglePlanet(systemId, system.planets.length + 1, system.starType);
    
    // Add to system
    system.planets.push(newPlanet);
    system.totalPopulation += newPlanet.population;
    
    return newPlanet;
  }

  // Generate a new alien race during exploration
  private async generateNewAlienRace(): Promise<GalacticRace> {
    const newRace = await this.civilizationGenerator.generateSingleRace();
    
    // Add to civilization generator's race map
    this.civilizationGenerator.addRace(newRace);
    
    // Generate some NPCs of this race for the social network
    await this.playerInteractionService.generateNPCsOfRace(newRace.id, 50);
    
    return newRace;
  }

  // Generate cosmic anomaly
  private async generateCosmicAnomaly(coordinates?: { x: number; y: number; z: number }): Promise<CosmicAnomaly> {
    const anomalyTypes = ['WORMHOLE', 'NEBULA', 'BLACK_HOLE', 'NEUTRON_STAR', 'DARK_MATTER_CLOUD', 'QUANTUM_STORM', 'TEMPORAL_RIFT', 'ANCIENT_ARTIFACT'];
    const type = this.randomChoice(anomalyTypes) as CosmicAnomaly['type'];
    
    const anomalyNames = {
      'WORMHOLE': ['Void Gate', 'Dimensional Tunnel', 'Space Bridge', 'Quantum Passage'],
      'NEBULA': ['Stellar Nursery', 'Cosmic Cloud', 'Star Garden', 'Plasma Field'],
      'BLACK_HOLE': ['Event Horizon', 'Gravity Well', 'Void Maw', 'Singularity'],
      'NEUTRON_STAR': ['Pulsar Beacon', 'Magnetic Storm', 'Gravity Lighthouse', 'Dense Core'],
      'DARK_MATTER_CLOUD': ['Shadow Realm', 'Invisible Mass', 'Dark Cluster', 'Phantom Zone'],
      'QUANTUM_STORM': ['Reality Flux', 'Probability Storm', 'Quantum Chaos', 'Wave Collapse'],
      'TEMPORAL_RIFT': ['Time Fracture', 'Chronos Gate', 'Temporal Anomaly', 'Time Wound'],
      'ANCIENT_ARTIFACT': ['Precursor Relic', 'Ancient Monument', 'Stellar Construct', 'Forgotten Technology']
    };
    
    const name = this.randomChoice(anomalyNames[type]);
    const anomalyId = `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const effects = this.generateAnomalyEffects(type);
    const dangerLevel = this.randomBetween(1, 10);
    
    const anomaly: CosmicAnomaly = {
      id: anomalyId,
      name,
      type,
      location: coordinates || this.generateRandomCoordinates(),
      effects,
      studyRequirements: this.generateStudyRequirements(type),
      potentialRewards: this.generateAnomalyRewards(type, dangerLevel),
      dangerLevel
    };

    this.cosmicAnomalies.set(anomalyId, anomaly);
    return anomaly;
  }

  private generateAnomalyEffects(type: CosmicAnomaly['type']): AnomalyEffect[] {
    const effects: AnomalyEffect[] = [];
    
    switch (type) {
      case 'WORMHOLE':
        effects.push({
          type: 'NAVIGATION_HAZARD',
          strength: 8,
          radius: 5,
          description: 'Gravitational distortions affect navigation'
        });
        effects.push({
          type: 'ENHANCED_DISCOVERY',
          strength: 6,
          radius: 10,
          description: 'Leads to distant regions of space'
        });
        break;
      
      case 'BLACK_HOLE':
        effects.push({
          type: 'NAVIGATION_HAZARD',
          strength: 10,
          radius: 20,
          description: 'Extreme gravitational field'
        });
        effects.push({
          type: 'TIME_DILATION',
          strength: 7,
          radius: 15,
          description: 'Time passes differently near the event horizon'
        });
        break;
      
      case 'QUANTUM_STORM':
        effects.push({
          type: 'COMMUNICATION_INTERFERENCE',
          strength: 9,
          radius: 25,
          description: 'Quantum fluctuations disrupt communications'
        });
        effects.push({
          type: 'DIMENSIONAL_INSTABILITY',
          strength: 8,
          radius: 15,
          description: 'Reality becomes unstable'
        });
        break;
      
      case 'NEBULA':
        effects.push({
          type: 'COMMUNICATION_INTERFERENCE',
          strength: 4,
          radius: 50,
          description: 'Dense gas clouds block signals'
        });
        effects.push({
          type: 'ENHANCED_DISCOVERY',
          strength: 5,
          radius: 30,
          description: 'Rich in stellar formation and resources'
        });
        break;
    }
    
    return effects;
  }

  private generateStudyRequirements(type: CosmicAnomaly['type']): string[] {
    const baseRequirements = ['Advanced Sensors', 'Scientific Crew', 'Protective Shielding'];
    
    const specificRequirements: { [key: string]: string[] } = {
      'WORMHOLE': ['Gravitational Wave Detector', 'Quantum Navigation System'],
      'BLACK_HOLE': ['Extreme Gravity Shielding', 'Time Dilation Compensator'],
      'QUANTUM_STORM': ['Quantum Stabilizer', 'Reality Anchor'],
      'TEMPORAL_RIFT': ['Temporal Shielding', 'Chronometer Array'],
      'ANCIENT_ARTIFACT': ['Xenoarchaeology Equipment', 'Universal Translator']
    };
    
    return [...baseRequirements, ...(specificRequirements[type] || [])];
  }

  private generateAnomalyRewards(type: CosmicAnomaly['type'], dangerLevel: number): ExplorationReward[] {
    const rewards: ExplorationReward[] = [];
    
    // Base rewards scale with danger
    rewards.push({
      type: 'EXPLORATION_POINTS',
      amount: dangerLevel * 10,
      description: 'Anomaly study completion'
    });
    
    // Type-specific rewards
    switch (type) {
      case 'WORMHOLE':
        rewards.push({
          type: 'TECHNOLOGY',
          amount: 1,
          description: 'Faster-than-light travel improvements'
        });
        break;
      
      case 'ANCIENT_ARTIFACT':
        rewards.push({
          type: 'UNIQUE_ITEM',
          amount: 1,
          description: 'Precursor technology artifact'
        });
        rewards.push({
          type: 'TECHNOLOGY',
          amount: 2,
          description: 'Advanced alien technology'
        });
        break;
      
      case 'QUANTUM_STORM':
        rewards.push({
          type: 'TECHNOLOGY',
          amount: 1,
          description: 'Quantum manipulation technology'
        });
        break;
    }
    
    return rewards;
  }

  // Establish first contact with a new race
  private async establishFirstContact(playerId: string, raceId: string): Promise<FirstContactProtocol> {
    const race = this.civilizationGenerator.getRaceById(raceId);
    if (!race) {
      throw new Error('Race not found');
    }

    // Determine initial reaction based on race characteristics
    let initialReaction: FirstContactProtocol['initialReaction'] = 'CAUTIOUS';
    
    if (race.culturalTraits.values.includes('harmony') || race.culturalTraits.values.includes('knowledge')) {
      initialReaction = 'FRIENDLY';
    } else if (race.culturalTraits.values.includes('survival') || race.mentalTraits.intelligence < 5) {
      initialReaction = 'HOSTILE';
    } else if (race.mentalTraits.curiosity > 0.7) {
      initialReaction = 'CURIOUS';
    }

    const firstContact: FirstContactProtocol = {
      raceId,
      contactingPlayerId: playerId,
      contactDate: new Date(),
      contactMethod: 'PEACEFUL', // Default for exploration discoveries
      initialReaction,
      communicationEstablished: race.languageCharacteristics.grammar !== 'TELEPATHIC' || Math.random() > 0.3,
      culturalExchangeLevel: 1,
      diplomaticStatus: initialReaction === 'HOSTILE' ? 'HOSTILE' : 'NEUTRAL',
      tradeRelations: false,
      sharedTechnologies: [],
      ongoingNegotiations: []
    };

    this.firstContacts.set(`${playerId}_${raceId}`, firstContact);

    // Generate Witter posts about the first contact
    await this.generateFirstContactSocialMedia(playerId, race, firstContact);

    return firstContact;
  }

  // Generate social media content for first contact
  private async generateFirstContactSocialMedia(playerId: string, race: GalacticRace, contact: FirstContactProtocol): Promise<void> {
    // Create a historic Witter post about the discovery
    const wittContent = this.generateFirstContactWitt(race, contact);
    
    // Post to Witter network
    await this.playerInteractionService.createDiscoveryPost(playerId, {
      content: wittContent,
      type: 'FIRST_CONTACT',
      significance: 'HISTORIC',
      discoveredEntity: {
        id: race.id,
        name: race.name,
        type: 'ALIEN_RACE'
      }
    });

    // Generate NPC reactions from other races
    await this.generateFirstContactReactions(playerId, race, contact);
  }

  private generateFirstContactWitt(race: GalacticRace, contact: FirstContactProtocol): string {
    const reactionEmojis = {
      'FRIENDLY': '🤝',
      'CAUTIOUS': '🤔',
      'HOSTILE': '⚠️',
      'CURIOUS': '👁️',
      'INDIFFERENT': '😐'
    };

    const emoji = reactionEmojis[contact.initialReaction];
    
    const templates = [
      `HISTORIC MOMENT! ${emoji} Just made first contact with the ${race.name}! These ${race.type.toLowerCase().replace('_', ' ')} beings are unlike anything we've encountered. Their ${race.culturalTraits.philosophy} philosophy and ${race.culturalTraits.socialStructure.toLowerCase().replace('_', ' ')} society present fascinating new perspectives on galactic civilization. #FirstContact #GalacticExploration #${race.name}`,
      
      `🌌 BREAKING: First contact established with ${race.name}! ${emoji} Initial reaction: ${contact.initialReaction.toLowerCase()}. These remarkable ${race.type.toLowerCase().replace('_', ' ')} entities have mastered ${race.technologicalLevel.uniqueTechnologies.slice(0, 2).join(' and ')}. Communication ${contact.communicationEstablished ? 'successful' : 'challenging'} due to their ${race.languageCharacteristics.grammar.toLowerCase().replace('_', ' ')} language structure. History in the making! #AlienContact #Discovery`,
      
      `${emoji} The galaxy just got bigger! Met the ${race.name} today - a ${race.type.toLowerCase().replace('_', ' ')} species with ${race.physicalTraits.averageLifespan} year lifespans and incredible ${race.technologicalLevel.specializations.physics > 8 ? 'physics' : race.technologicalLevel.specializations.biology > 8 ? 'biological' : 'technological'} capabilities. Their ${race.culturalTraits.values.slice(0, 2).join(' and ')} values could teach us so much. The future of galactic relations starts now! #NewSpecies #GalacticUnity`
    ];

    return this.randomChoice(templates);
  }

  // Generate reactions from other NPCs to first contact
  private async generateFirstContactReactions(playerId: string, newRace: GalacticRace, contact: FirstContactProtocol): Promise<void> {
    // Get relevant NPCs (scientists, diplomats, other race representatives)
    const relevantNPCs = await this.playerInteractionService.getNPCsByProfession(['Scientist', 'Diplomat', 'Xenobiologist', 'Cultural Anthropologist']);
    
    for (const npc of relevantNPCs.slice(0, 5)) { // Limit to 5 reactions
      const reaction = this.generateNPCFirstContactReaction(npc, newRace, contact);
      
      await this.playerInteractionService.createNPCResponse(npc.id, playerId, {
        type: 'COMMENT',
        content: reaction,
        timestamp: new Date(Date.now() + Math.random() * 3600000) // Within 1 hour
      });
    }
  }

  private generateNPCFirstContactReaction(npc: any, race: GalacticRace, contact: FirstContactProtocol): string {
    const reactions = [
      `Fascinating! The ${race.name}'s ${race.type.toLowerCase().replace('_', ' ')} physiology suggests evolutionary adaptations to ${race.biologicalNeeds.atmosphere.join(' and ')} environments. This could revolutionize our understanding of life in the galaxy! 🧬`,
      
      `As a diplomat, I'm intrigued by their ${contact.initialReaction.toLowerCase()} response. The ${race.name}'s ${race.culturalTraits.socialStructure.toLowerCase().replace('_', ' ')} society will require careful negotiation protocols. We must approach with respect for their ${race.culturalTraits.values.slice(0, 2).join(' and ')} values. 🤝`,
      
      `The technological implications are staggering! Their mastery of ${race.technologicalLevel.uniqueTechnologies[0] || 'advanced technology'} could advance our civilization by centuries. We must establish scientific exchange programs immediately! 🚀`,
      
      `This changes everything we thought we knew about ${race.type.toLowerCase().replace('_', ' ')} life forms. Their ${race.mentalTraits.collectiveMind ? 'collective consciousness' : 'individual intelligence'} challenges our assumptions about sentience. Remarkable discovery! 🌟`,
      
      `From a cultural perspective, the ${race.name}'s ${race.culturalTraits.philosophy} philosophy offers new insights into galactic civilization. Their ${race.culturalTraits.artForms.join(', ')} art forms could enrich our cultural understanding immensely. 🎨`
    ];

    return this.randomChoice(reactions);
  }

  // Generate resource deposits
  private generateResourceDeposit(): { name: string; rarity: string; amount: number } {
    const resources = [
      { name: 'Quantum Crystals', rarity: 'LEGENDARY', baseAmount: 1000 },
      { name: 'Dark Matter Particles', rarity: 'LEGENDARY', baseAmount: 500 },
      { name: 'Temporal Energy Cells', rarity: 'EPIC', baseAmount: 2000 },
      { name: 'Psionic Resonance Stones', rarity: 'EPIC', baseAmount: 1500 },
      { name: 'Neutronium Deposits', rarity: 'RARE', baseAmount: 5000 },
      { name: 'Exotic Matter Veins', rarity: 'RARE', baseAmount: 3000 },
      { name: 'Rare Earth Elements', rarity: 'UNCOMMON', baseAmount: 10000 },
      { name: 'Crystalline Formations', rarity: 'UNCOMMON', baseAmount: 8000 },
      { name: 'Metallic Ore Deposits', rarity: 'COMMON', baseAmount: 20000 },
      { name: 'Hydrocarbon Reserves', rarity: 'COMMON', baseAmount: 15000 }
    ];

    const resource = this.randomChoice(resources);
    const amount = Math.floor(resource.baseAmount * (0.5 + Math.random()));

    return {
      name: resource.name,
      rarity: resource.rarity,
      amount
    };
  }

  // Background generation of new content
  private startBackgroundGeneration(): void {
    // Generate new discoveries every 5 minutes
    setInterval(async () => {
      await this.generateBackgroundDiscoveries();
    }, 5 * 60 * 1000);

    // Process expeditions every minute
    setInterval(async () => {
      await this.processExpeditions();
    }, 60 * 1000);

    // Generate cosmic events every 30 minutes
    setInterval(async () => {
      await this.generateCosmicEvents();
    }, 30 * 60 * 1000);
  }

  private async generateBackgroundDiscoveries(): Promise<void> {
    // Generate new systems, planets, and anomalies in unexplored regions
    const newSystemChance = 0.1; // 10% chance
    const newAnomalyChance = 0.05; // 5% chance

    if (Math.random() < newSystemChance) {
      const coordinates = this.generateRandomCoordinates();
      await this.generateNewStarSystem(coordinates);
    }

    if (Math.random() < newAnomalyChance) {
      const coordinates = this.generateRandomCoordinates();
      await this.generateCosmicAnomaly(coordinates);
    }
  }

  private async generateCosmicEvents(): Promise<void> {
    // Generate galaxy-wide events that affect exploration
    const events = [
      'Stellar phenomena affecting navigation',
      'New trade routes discovered',
      'Ancient artifacts detected',
      'Cosmic storms disrupting communications',
      'Gravitational anomalies opening new regions'
    ];

    const event = this.randomChoice(events);
    console.log(`🌌 Cosmic Event: ${event}`);
    
    // Broadcast to all players
    await this.broadcastCosmicEvent(event);
  }

  private async broadcastCosmicEvent(event: string): Promise<void> {
    // Create system-wide announcement
    for (const [playerId] of this.explorationStates) {
      await this.playerInteractionService.createSystemAnnouncement(playerId, {
        type: 'COSMIC_EVENT',
        content: `🌌 GALACTIC ALERT: ${event}`,
        timestamp: new Date()
      });
    }
  }

  // Utility methods
  private generateRandomCoordinates(): { x: number; y: number; z: number } {
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * 50000; // 50,000 light year galaxy
    const height = (Math.random() - 0.5) * 5000; // 5,000 light year thickness

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: height
    };
  }

  private async generateNearbyDiscoveries(playerId: string, systemId: string): Promise<void> {
    const system = this.civilizationGenerator.getSystemById(systemId);
    if (!system) return;

    // Generate 3-5 nearby systems for initial exploration
    const nearbyCount = this.randomBetween(3, 5);
    
    for (let i = 0; i < nearbyCount; i++) {
      const nearbyCoords = {
        x: system.coordinates.x + (Math.random() - 0.5) * 50,
        y: system.coordinates.y + (Math.random() - 0.5) * 50,
        z: system.coordinates.z + (Math.random() - 0.5) * 10
      };
      
      await this.generateNewStarSystem(nearbyCoords);
    }
  }

  private async createExpedition(playerId: string, config: Partial<Expedition>): Promise<Expedition> {
    const expeditionId = `expedition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const expedition: Expedition = {
      id: expeditionId,
      name: config.name || `Exploration Mission ${Date.now()}`,
      playerId,
      targetLocation: config.targetLocation || { searchRadius: 25 },
      objectives: config.objectives || [
        {
          id: 'explore',
          type: 'MAP_SYSTEM',
          description: 'Explore and map unknown regions',
          completed: false,
          reward: [{ type: 'EXPLORATION_POINTS', amount: 25, description: 'Exploration bonus' }]
        }
      ],
      startTime: new Date(),
      estimatedDuration: config.estimatedDuration || this.randomBetween(2, 8), // 2-8 hours
      status: 'EXPLORING',
      crew: config.crew || await this.generateExpeditionCrew(),
      equipment: config.equipment || await this.generateExpeditionEquipment(),
      discoveries: [],
      cost: config.cost || 50,
      riskLevel: config.riskLevel || this.randomBetween(1, 5)
    };

    return expedition;
  }

  private async generateExpeditionCrew(): Promise<ExpeditionCrew[]> {
    const roles = ['CAPTAIN', 'NAVIGATOR', 'SCIENTIST', 'ENGINEER'];
    const crew: ExpeditionCrew[] = [];

    for (const role of roles) {
      crew.push({
        id: `crew_${Date.now()}_${role}`,
        name: this.generateCrewName(),
        role: role as ExpeditionCrew['role'],
        skill: this.randomBetween(3, 8),
        specialization: this.generateSpecialization(role),
        experience: this.randomBetween(1, 10)
      });
    }

    return crew;
  }

  private generateCrewName(): string {
    const firstNames = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Sage'];
    const lastNames = ['Nova', 'Star', 'Void', 'Flux', 'Drift', 'Storm', 'Wave', 'Prism'];
    return `${this.randomChoice(firstNames)} ${this.randomChoice(lastNames)}`;
  }

  private generateSpecialization(role: string): string {
    const specializations: { [key: string]: string[] } = {
      'CAPTAIN': ['Leadership', 'Tactical', 'Diplomatic', 'Strategic'],
      'NAVIGATOR': ['Stellar Cartography', 'Quantum Navigation', 'Wormhole Theory', 'Gravitational Analysis'],
      'SCIENTIST': ['Xenobiology', 'Astrophysics', 'Quantum Mechanics', 'Cultural Analysis'],
      'ENGINEER': ['Propulsion', 'Life Support', 'Sensors', 'Defensive Systems']
    };

    const options = specializations[role] || ['General'];
    return this.randomChoice(options);
  }

  private async generateExpeditionEquipment(): Promise<ExpeditionEquipment[]> {
    const equipment: ExpeditionEquipment[] = [
      {
        id: 'scanner_1',
        name: 'Long Range Scanner',
        type: 'SCANNER',
        quality: this.randomBetween(3, 8),
        durability: this.randomBetween(70, 100),
        specialFeatures: ['Deep Space Detection', 'Life Sign Analysis']
      },
      {
        id: 'comm_1',
        name: 'Quantum Communicator',
        type: 'COMMUNICATION',
        quality: this.randomBetween(4, 9),
        durability: this.randomBetween(80, 100),
        specialFeatures: ['Faster-than-Light', 'Universal Translation']
      },
      {
        id: 'defense_1',
        name: 'Shield Generator',
        type: 'DEFENSE',
        quality: this.randomBetween(2, 7),
        durability: this.randomBetween(60, 95),
        specialFeatures: ['Energy Absorption', 'Kinetic Dampening']
      }
    ];

    return equipment;
  }

  private async generateDiscoveryZones(): Promise<void> {
    // Generate 20-30 discovery zones across the galaxy
    const zoneCount = this.randomBetween(20, 30);
    
    for (let i = 0; i < zoneCount; i++) {
      const zone: DiscoveryZone = {
        id: `zone_${i}`,
        name: this.generateZoneName(),
        centerCoordinates: this.generateRandomCoordinates(),
        radius: this.randomBetween(500, 2000), // 500-2000 light years
        discoveryDensity: Math.random(),
        dangerLevel: this.randomBetween(1, 10),
        specialCharacteristics: this.generateZoneCharacteristics(),
        dominantPhenomena: this.generateZonePhenomena(),
        recommendedLevel: this.randomBetween(1, 10)
      };

      this.discoveryZones.set(zone.id, zone);
    }
  }

  private generateZoneName(): string {
    const prefixes = ['Stellar', 'Cosmic', 'Quantum', 'Void', 'Nebular', 'Galactic', 'Temporal', 'Dark'];
    const suffixes = ['Expanse', 'Region', 'Sector', 'Zone', 'Territory', 'Domain', 'Realm', 'Fields'];
    return `${this.randomChoice(prefixes)} ${this.randomChoice(suffixes)}`;
  }

  private generateZoneCharacteristics(): string[] {
    const characteristics = [
      'High stellar density', 'Ancient civilizations', 'Exotic matter concentrations',
      'Temporal anomalies', 'Dimensional instabilities', 'Rich resource deposits',
      'Dangerous phenomena', 'Unexplored territories', 'Archaeological sites',
      'Unique life forms', 'Advanced technologies', 'Mysterious signals'
    ];
    
    return this.randomChoices(characteristics, 1, 3);
  }

  private generateZonePhenomena(): string[] {
    const phenomena = [
      'Gravitational waves', 'Quantum storms', 'Dark matter clouds',
      'Stellar nurseries', 'Black hole clusters', 'Wormhole networks',
      'Energy cascades', 'Temporal rifts', 'Dimensional barriers',
      'Psionic fields', 'Exotic radiation', 'Crystalline formations'
    ];
    
    return this.randomChoices(phenomena, 1, 2);
  }

  private async completeExpedition(playerId: string, expedition: Expedition): Promise<void> {
    const playerState = this.explorationStates.get(playerId);
    if (!playerState) return;

    // Award rewards
    let totalPoints = 0;
    for (const discovery of expedition.discoveries) {
      for (const reward of discovery.rewards) {
        if (reward.type === 'EXPLORATION_POINTS') {
          totalPoints += reward.amount;
        }
      }
      
      // Add to player's exploration history
      playerState.explorationHistory.push(discovery);
      
      // Share significant discoveries on social network
      if (discovery.significance === 'HISTORIC' || discovery.significance === 'LEGENDARY') {
        discovery.sharedWithNetwork = true;
        await this.shareDiscoveryOnNetwork(playerId, discovery);
      }
    }

    // Award exploration points
    playerState.explorationPoints += totalPoints;
    
    // Update discovery streak
    if (expedition.discoveries.length > 0) {
      playerState.discoveryStreak += 1;
    } else {
      playerState.discoveryStreak = 0;
    }

    // Level up if enough discoveries
    if (playerState.explorationHistory.length >= playerState.explorationLevel * 10) {
      playerState.explorationLevel += 1;
      await this.playerInteractionService.createSystemAnnouncement(playerId, {
        type: 'LEVEL_UP',
        content: `🎉 Exploration Level Up! You are now a Level ${playerState.explorationLevel} Explorer!`,
        timestamp: new Date()
      });
    }

    // Remove from active expeditions
    const activeIndex = playerState.activeExpeditions.findIndex(e => e.id === expedition.id);
    if (activeIndex >= 0) {
      playerState.activeExpeditions.splice(activeIndex, 1);
    }

    console.log(`✅ Expedition "${expedition.name}" completed by ${playerId} with ${expedition.discoveries.length} discoveries`);
  }

  private async shareDiscoveryOnNetwork(playerId: string, discovery: ExplorationEvent): Promise<void> {
    const content = `🌟 ${discovery.significance.toUpperCase()} DISCOVERY! ${discovery.description} This changes our understanding of the galaxy! #Discovery #Exploration #${discovery.discoveredEntity?.type}`;
    
    await this.playerInteractionService.createDiscoveryPost(playerId, {
      content,
      type: discovery.type,
      significance: discovery.significance,
      discoveredEntity: discovery.discoveredEntity
    });
  }

  // Public API methods
  getPlayerExplorationState(playerId: string): ExplorationState | null {
    return this.explorationStates.get(playerId) || null;
  }

  getDiscoveryZones(): DiscoveryZone[] {
    return Array.from(this.discoveryZones.values());
  }

  getCosmicAnomalies(): CosmicAnomaly[] {
    return Array.from(this.cosmicAnomalies.values());
  }

  getGlobalDiscoveries(): ExplorationEvent[] {
    return Array.from(this.globalDiscoveries.values());
  }

  getFirstContacts(playerId: string): FirstContactProtocol[] {
    return Array.from(this.firstContacts.values()).filter(fc => fc.contactingPlayerId === playerId);
  }

  // Utility methods
  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private randomChoices<T>(array: T[], min: number, max: number): T[] {
    const count = this.randomBetween(min, max);
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}

export default GalacticExplorationService;
