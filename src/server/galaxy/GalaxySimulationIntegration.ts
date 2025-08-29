/**
 * Galaxy Simulation Integration
 * Integrates Galaxy Map and Galaxy Data with the AI/Deterministic/Orchestrator sim engine
 */

import { Pool } from 'pg';
import { EventEmitter } from 'events';
import { GalaxyKnobsState, DEFAULT_GALAXY_KNOBS, GALAXY_KNOBS_AI_PROMPTS, applyGalaxyKnobsToSimulation } from './galaxyKnobs';

export interface GalaxySimulationState {
  campaignId: string;
  civilizationId: string;
  galaxyMap: any;
  territories: any;
  discoveries: any[];
  explorationMissions: any[];
  navigationRoutes: any[];
  knobStates: GalaxyKnobsState;
  lastUpdated: Date;
}

export interface GalaxyEvent {
  id: string;
  type: 'discovery' | 'exploration_complete' | 'territory_change' | 'cosmic_event' | 'first_contact' | 'trade_route_established';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location?: {
    systemId?: string;
    sectorId?: string;
    coordinates?: { x: number; y: number; z: number };
  };
  affectedCivilizations: string[];
  discoveryData?: any;
  territoryData?: any;
  timestamp: Date;
}

export class GalaxySimulationIntegration extends EventEmitter {
  private pool: Pool;
  private activeSimulations: Map<string, GalaxySimulationState> = new Map();
  private knobStates: Map<string, GalaxyKnobsState> = new Map();
  private simulationInterval: NodeJS.Timeout | null = null;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
    this.startGalaxySimulation();
  }

  /**
   * Register a civilization for galaxy simulation
   */
  async registerCivilization(campaignId: string, civilizationId: string): Promise<void> {
    const key = `${campaignId}-${civilizationId}`;
    
    // Initialize galaxy simulation state
    const galaxyState: GalaxySimulationState = {
      campaignId,
      civilizationId,
      galaxyMap: await this.generateGalaxyMap(campaignId),
      territories: await this.generateTerritories(campaignId),
      discoveries: [],
      explorationMissions: [],
      navigationRoutes: [],
      knobStates: { ...DEFAULT_GALAXY_KNOBS },
      lastUpdated: new Date()
    };

    this.activeSimulations.set(key, galaxyState);
    this.knobStates.set(civilizationId, { ...DEFAULT_GALAXY_KNOBS });

    console.log(`🌌 Registered civilization ${civilizationId} for galaxy simulation`);
    this.emit('civilizationRegistered', { campaignId, civilizationId });
  }

  /**
   * Update galaxy knob values
   */
  async updateKnobs(civilizationId: string, knobUpdates: Partial<GalaxyKnobsState>): Promise<void> {
    const currentKnobs = this.knobStates.get(civilizationId) || { ...DEFAULT_GALAXY_KNOBS };
    const updatedKnobs = { ...currentKnobs, ...knobUpdates, lastUpdated: Date.now() };
    
    this.knobStates.set(civilizationId, updatedKnobs);

    // Apply knobs to all active simulations for this civilization
    for (const [key, simulation] of this.activeSimulations.entries()) {
      if (simulation.civilizationId === civilizationId) {
        simulation.knobStates = updatedKnobs;
        await this.applyKnobsToSimulation(simulation);
      }
    }

    console.log(`🎛️ Updated galaxy knobs for civilization ${civilizationId}`);
    this.emit('knobsUpdated', { civilizationId, knobs: updatedKnobs });
  }

  /**
   * Get current knob states for a civilization
   */
  getKnobs(civilizationId: string): GalaxyKnobsState {
    return this.knobStates.get(civilizationId) || { ...DEFAULT_GALAXY_KNOBS };
  }

  /**
   * Process galaxy simulation tick
   */
  async processSimulationTick(): Promise<void> {
    for (const [key, simulation] of this.activeSimulations.entries()) {
      try {
        await this.processGalaxySimulation(simulation);
      } catch (error) {
        console.error(`Error processing galaxy simulation for ${key}:`, error);
      }
    }
  }

  /**
   * Process individual galaxy simulation
   */
  private async processGalaxySimulation(simulation: GalaxySimulationState): Promise<void> {
    const knobs = simulation.knobStates;
    const events: GalaxyEvent[] = [];

    // Process exploration missions
    const explorationEvents = await this.processExplorationMissions(simulation, knobs);
    events.push(...explorationEvents);

    // Process cosmic events
    if (Math.random() < knobs.cosmic_event_frequency) {
      const cosmicEvent = await this.generateCosmicEvent(simulation, knobs);
      events.push(cosmicEvent);
    }

    // Process discoveries
    if (Math.random() < knobs.scientific_anomaly_frequency) {
      const discoveryEvent = await this.generateDiscoveryEvent(simulation, knobs);
      events.push(discoveryEvent);
    }

    // Process territorial changes
    if (Math.random() < knobs.border_dispute_frequency) {
      const territoryEvent = await this.generateTerritoryEvent(simulation, knobs);
      events.push(territoryEvent);
    }

    // Process first contact events
    if (Math.random() < knobs.first_contact_protocols * 0.1) { // Low frequency for first contact
      const firstContactEvent = await this.generateFirstContactEvent(simulation, knobs);
      events.push(firstContactEvent);
    }

    // Emit events
    for (const event of events) {
      this.emit('galaxyEvent', event);
    }

    simulation.lastUpdated = new Date();
  }

  /**
   * Apply knobs to simulation state
   */
  private async applyKnobsToSimulation(simulation: GalaxySimulationState): Promise<void> {
    const knobs = simulation.knobStates;
    
    // Apply knobs to galaxy map generation
    if (simulation.galaxyMap) {
      simulation.galaxyMap.metadata.explorationBonus = knobs.exploration_reward_frequency;
      simulation.galaxyMap.metadata.discoveryRate = knobs.discovery_significance_weighting;
      simulation.galaxyMap.metadata.hazardLevel = knobs.space_hazard_frequency;
    }

    // Apply knobs to territories
    if (simulation.territories) {
      simulation.territories.diplomaticComplexity = knobs.diplomatic_complexity;
      simulation.territories.neutralZoneStability = knobs.neutral_zone_stability;
    }

    console.log(`🎛️ Applied galaxy knobs to simulation for ${simulation.civilizationId}`);
  }

  /**
   * Generate galaxy map data
   */
  private async generateGalaxyMap(campaignId: string): Promise<any> {
    // This would typically query the database, but for now we'll generate mock data
    return {
      campaignId: Number(campaignId),
      sectors: Array.from({ length: 10 }, (_, i) => ({
        id: `sector_${i + 1}`,
        name: `Sector ${i + 1}`,
        coordinates: {
          x: Math.floor(Math.random() * 1000),
          y: Math.floor(Math.random() * 1000),
          z: Math.floor(Math.random() * 100)
        },
        starSystems: Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, j) => ({
          id: `system_${i + 1}_${j + 1}`,
          name: `System ${i + 1}-${j + 1}`,
          starType: ['G', 'K', 'M', 'F', 'A'][Math.floor(Math.random() * 5)],
          planets: Math.floor(Math.random() * 8) + 1,
          explored: Math.random() > 0.3,
          controlledBy: Math.random() > 0.7 ? `civilization_${Math.floor(Math.random() * 3) + 1}` : null
        })),
        controlStatus: Math.random() > 0.5 ? 'controlled' : Math.random() > 0.5 ? 'contested' : 'neutral',
        explorationLevel: Math.floor(Math.random() * 100)
      })),
      metadata: {
        totalSectors: 10,
        exploredSectors: 7,
        controlledSectors: 4,
        zoom: 1,
        lastUpdated: new Date()
      }
    };
  }

  /**
   * Generate territories data
   */
  private async generateTerritories(campaignId: string): Promise<any> {
    return {
      campaignId: Number(campaignId),
      civilizations: Array.from({ length: 5 }, (_, i) => ({
        id: `civilization_${i + 1}`,
        name: `Civilization ${i + 1}`,
        controlledSystems: Math.floor(Math.random() * 20) + 5,
        territorialClaims: Array.from({ length: Math.floor(Math.random() * 10) + 3 }, (_, j) => ({
          systemId: `system_${i + 1}_${j + 1}`,
          claimStrength: Math.random(),
          disputed: Math.random() > 0.8
        })),
        diplomaticStatus: Math.random() > 0.5 ? 'neutral' : Math.random() > 0.5 ? 'allied' : 'hostile'
      })),
      neutralZones: Array.from({ length: 3 }, (_, i) => ({
        id: `neutral_${i + 1}`,
        name: `Neutral Zone ${i + 1}`,
        systems: Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, j) => `neutral_system_${i + 1}_${j + 1}`),
        established: new Date(Date.now() - Math.random() * 31536000000),
        treatyStatus: 'active'
      })),
      disputes: Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => ({
        id: `dispute_${i + 1}`,
        involvedCivilizations: [`civilization_${i + 1}`, `civilization_${i + 2}`],
        disputedSystems: [`system_disputed_${i + 1}`],
        severity: Math.floor(Math.random() * 5) + 1,
        startDate: new Date(Date.now() - Math.random() * 86400000 * 30)
      }))
    };
  }

  /**
   * Process exploration missions
   */
  private async processExplorationMissions(simulation: GalaxySimulationState, knobs: GalaxyKnobsState): Promise<GalaxyEvent[]> {
    const events: GalaxyEvent[] = [];
    
    // Simulate exploration mission completion
    if (Math.random() < knobs.exploration_reward_frequency * 0.3) {
      const event: GalaxyEvent = {
        id: `exploration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'exploration_complete',
        severity: 'medium',
        description: 'Exploration mission completed with significant discoveries',
        location: {
          systemId: `system_${Math.floor(Math.random() * 10) + 1}`,
          coordinates: {
            x: Math.floor(Math.random() * 1000),
            y: Math.floor(Math.random() * 1000),
            z: Math.floor(Math.random() * 100)
          }
        },
        affectedCivilizations: [simulation.civilizationId],
        timestamp: new Date()
      };
      events.push(event);
    }

    return events;
  }

  /**
   * Generate cosmic event
   */
  private async generateCosmicEvent(simulation: GalaxySimulationState, knobs: GalaxyKnobsState): Promise<GalaxyEvent> {
    const cosmicEvents = [
      'Supernova explosion detected in nearby system',
      'Gravitational anomaly disrupts hyperspace routes',
      'Solar storm affects communication networks',
      'Black hole formation creates new navigation hazard',
      'Stellar collision creates rare element deposits'
    ];

    return {
      id: `cosmic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'cosmic_event',
      severity: Math.random() > 0.7 ? 'high' : 'medium',
      description: cosmicEvents[Math.floor(Math.random() * cosmicEvents.length)],
      location: {
        sectorId: `sector_${Math.floor(Math.random() * 10) + 1}`,
        coordinates: {
          x: Math.floor(Math.random() * 1000),
          y: Math.floor(Math.random() * 1000),
          z: Math.floor(Math.random() * 100)
        }
      },
      affectedCivilizations: [simulation.civilizationId],
      timestamp: new Date()
    };
  }

  /**
   * Generate discovery event
   */
  private async generateDiscoveryEvent(simulation: GalaxySimulationState, knobs: GalaxyKnobsState): Promise<GalaxyEvent> {
    const discoveryTypes = ['ancient artifact', 'new species', 'rare mineral', 'energy source', 'technological relic'];
    const discoveryType = discoveryTypes[Math.floor(Math.random() * discoveryTypes.length)];

    return {
      id: `discovery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'discovery',
      severity: 'medium',
      description: `Significant ${discoveryType} discovered during exploration`,
      location: {
        systemId: `system_${Math.floor(Math.random() * 10) + 1}`,
        coordinates: {
          x: Math.floor(Math.random() * 1000),
          y: Math.floor(Math.random() * 1000),
          z: Math.floor(Math.random() * 100)
        }
      },
      affectedCivilizations: [simulation.civilizationId],
      discoveryData: {
        type: discoveryType,
        significance: Math.floor(Math.random() * 10) + 1,
        scientificValue: Math.floor(Math.random() * 100),
        economicValue: Math.floor(Math.random() * 100),
        strategicValue: Math.floor(Math.random() * 100)
      },
      timestamp: new Date()
    };
  }

  /**
   * Generate territory event
   */
  private async generateTerritoryEvent(simulation: GalaxySimulationState, knobs: GalaxyKnobsState): Promise<GalaxyEvent> {
    return {
      id: `territory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'territory_change',
      severity: 'medium',
      description: 'Territorial boundaries have shifted due to diplomatic negotiations',
      location: {
        systemId: `system_${Math.floor(Math.random() * 10) + 1}`
      },
      affectedCivilizations: [simulation.civilizationId, `civilization_${Math.floor(Math.random() * 3) + 1}`],
      territoryData: {
        previousController: `civilization_${Math.floor(Math.random() * 3) + 1}`,
        newController: simulation.civilizationId,
        disputeResolution: 'diplomatic'
      },
      timestamp: new Date()
    };
  }

  /**
   * Generate first contact event
   */
  private async generateFirstContactEvent(simulation: GalaxySimulationState, knobs: GalaxyKnobsState): Promise<GalaxyEvent> {
    return {
      id: `first_contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'first_contact',
      severity: 'high',
      description: 'First contact established with previously unknown civilization',
      location: {
        systemId: `system_${Math.floor(Math.random() * 10) + 1}`,
        coordinates: {
          x: Math.floor(Math.random() * 1000),
          y: Math.floor(Math.random() * 1000),
          z: Math.floor(Math.random() * 100)
        }
      },
      affectedCivilizations: [simulation.civilizationId],
      timestamp: new Date()
    };
  }

  /**
   * Start galaxy simulation loop
   */
  private startGalaxySimulation(): void {
    this.simulationInterval = setInterval(async () => {
      await this.processSimulationTick();
    }, 30000); // Process every 30 seconds

    console.log('🌌 Galaxy simulation loop started');
  }

  /**
   * Stop galaxy simulation
   */
  stopSimulation(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    console.log('🌌 Galaxy simulation stopped');
  }

  /**
   * Get simulation state for a civilization
   */
  getSimulationState(campaignId: string, civilizationId: string): GalaxySimulationState | undefined {
    const key = `${campaignId}-${civilizationId}`;
    return this.activeSimulations.get(key);
  }

  /**
   * Get AI recommendations for knob adjustments
   */
  async getAIRecommendations(civilizationId: string, gameState: any): Promise<any> {
    const currentKnobs = this.getKnobs(civilizationId);
    const recommendations = [];

    // Analyze game state and recommend knob adjustments
    if (gameState.explorationActivity < 0.3) {
      recommendations.push({
        knob: 'exploration_reward_frequency',
        currentValue: currentKnobs.exploration_reward_frequency,
        recommendedValue: Math.min(currentKnobs.exploration_reward_frequency + 0.1, 1.0),
        reason: 'Low exploration activity detected, increasing rewards to encourage exploration',
        confidence: 0.8
      });
    }

    if (gameState.diplomaticTensions > 0.7) {
      recommendations.push({
        knob: 'border_dispute_frequency',
        currentValue: currentKnobs.border_dispute_frequency,
        recommendedValue: Math.max(currentKnobs.border_dispute_frequency - 0.1, 0.1),
        reason: 'High diplomatic tensions, reducing border disputes to stabilize relations',
        confidence: 0.9
      });
    }

    return {
      civilizationId,
      recommendations,
      timestamp: new Date()
    };
  }
}
