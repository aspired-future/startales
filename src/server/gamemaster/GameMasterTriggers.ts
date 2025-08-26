import { gameMasterVideoService } from './GameMasterVideoAPI';

interface GameEvent {
  type: string;
  data: Record<string, any>;
  campaignId: string;
  playerId?: string;
  timestamp: string;
}

interface TriggerCondition {
  field: string;
  operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'change';
  value: any;
  threshold?: number; // For change detection
}

class GameMasterTriggerService {
  private gameState: Map<string, Record<string, any>> = new Map();
  private eventHistory: GameEvent[] = [];
  private maxHistorySize = 1000;

  // Monitor game events and trigger videos when conditions are met
  async processGameEvent(event: GameEvent): Promise<void> {
    // Store event in history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Update game state
    this.updateGameState(event);

    // Check for trigger conditions
    await this.checkTriggerConditions(event);

    console.log(`🎮 Game Master: Processed event "${event.type}" for campaign ${event.campaignId}`);
  }

  private updateGameState(event: GameEvent) {
    const stateKey = event.campaignId;
    const currentState = this.gameState.get(stateKey) || {};

    // Update state based on event type
    switch (event.type) {
      case 'discovery_made':
        currentState.discoveries = (currentState.discoveries || 0) + 1;
        currentState.lastDiscovery = event.data;
        break;

      case 'political_stability_change':
        currentState.politicalStability = event.data.newStability;
        currentState.stabilityChange = event.data.change;
        break;

      case 'economic_milestone':
        currentState.gdp = event.data.newGDP;
        currentState.gdpGrowth = event.data.growthPercent;
        break;

      case 'military_threat_detected':
        currentState.threatLevel = event.data.threatLevel;
        currentState.militaryReadiness = event.data.readiness;
        break;

      case 'natural_disaster':
        currentState.disasterSeverity = event.data.severity;
        currentState.affectedPopulation = event.data.affectedPopulation;
        break;

      case 'technology_breakthrough':
        currentState.techLevel = event.data.newTechLevel;
        currentState.researchPoints = event.data.researchPoints;
        break;

      case 'population_milestone':
        currentState.population = event.data.newPopulation;
        currentState.populationGrowth = event.data.growthRate;
        break;

      case 'diplomatic_event':
        currentState.diplomaticRelations = event.data.relations;
        currentState.allianceCount = event.data.allianceCount;
        break;

      case 'resource_discovery':
        currentState.resources = { ...currentState.resources, ...event.data.resources };
        break;

      case 'colony_established':
        currentState.colonies = (currentState.colonies || 0) + 1;
        currentState.totalPlanets = event.data.totalPlanets;
        break;
    }

    this.gameState.set(stateKey, currentState);
  }

  private async checkTriggerConditions(event: GameEvent) {
    const state = this.gameState.get(event.campaignId) || {};

    // Define trigger conditions for different scenarios
    const triggerChecks = [
      // Major Discovery Triggers
      {
        condition: () => event.type === 'discovery_made' && event.data.significance === 'high',
        triggerType: 'major_discovery',
        context: {
          campaignId: event.campaignId,
          discoveryType: event.data.type,
          location: event.data.location,
          details: `A ${event.data.type} of high significance has been discovered at ${event.data.location}.`
        }
      },

      // Political Crisis Triggers
      {
        condition: () => event.type === 'political_stability_change' && state.stabilityChange <= -20,
        triggerType: 'political_crisis',
        context: {
          campaignId: event.campaignId,
          stabilityChange: state.stabilityChange,
          currentStability: state.politicalStability,
          details: `Political stability has dropped by ${Math.abs(state.stabilityChange)}%, creating a crisis situation.`
        }
      },

      // Economic Milestone Triggers
      {
        condition: () => event.type === 'economic_milestone' && state.gdpGrowth >= 25,
        triggerType: 'economic_milestone',
        context: {
          campaignId: event.campaignId,
          gdpGrowth: state.gdpGrowth,
          newGDP: state.gdp,
          details: `Economic growth has reached ${state.gdpGrowth}%, marking a significant milestone.`
        }
      },

      // Military Conflict Triggers
      {
        condition: () => event.type === 'military_threat_detected' && state.threatLevel === 'high',
        triggerType: 'military_conflict',
        context: {
          campaignId: event.campaignId,
          threatLevel: state.threatLevel,
          readiness: state.militaryReadiness,
          details: `High-level military threat detected. Defense systems are at ${state.militaryReadiness}% readiness.`
        }
      },

      // Natural Disaster Triggers
      {
        condition: () => event.type === 'natural_disaster' && state.disasterSeverity === 'major',
        triggerType: 'natural_disaster',
        context: {
          campaignId: event.campaignId,
          severity: state.disasterSeverity,
          affectedPopulation: state.affectedPopulation,
          details: `Major natural disaster affecting ${state.affectedPopulation} citizens requires immediate response.`
        }
      },

      // Technology Breakthrough Triggers
      {
        condition: () => event.type === 'technology_breakthrough' && event.data.breakthrough === true,
        triggerType: 'technology_breakthrough',
        context: {
          campaignId: event.campaignId,
          techType: event.data.techType,
          newCapabilities: event.data.capabilities,
          details: `Breakthrough in ${event.data.techType} technology opens new possibilities for civilization.`
        }
      },

      // Population Milestone Triggers
      {
        condition: () => event.type === 'population_milestone' && state.population >= 1000000,
        triggerType: 'population_milestone',
        context: {
          campaignId: event.campaignId,
          population: state.population,
          growthRate: state.populationGrowth,
          details: `Population has reached ${(state.population / 1000000).toFixed(1)} million citizens.`
        }
      },

      // First Colony Triggers
      {
        condition: () => event.type === 'colony_established' && state.colonies === 1,
        triggerType: 'first_colony',
        context: {
          campaignId: event.campaignId,
          colonyName: event.data.colonyName,
          planetType: event.data.planetType,
          details: `The first colony "${event.data.colonyName}" has been successfully established.`
        }
      },

      // Multiple Colony Milestone
      {
        condition: () => event.type === 'colony_established' && state.colonies >= 5,
        triggerType: 'colonial_expansion',
        context: {
          campaignId: event.campaignId,
          totalColonies: state.colonies,
          totalPlanets: state.totalPlanets,
          details: `Colonial expansion has reached ${state.colonies} colonies across ${state.totalPlanets} planets.`
        }
      },

      // Diplomatic Achievement
      {
        condition: () => event.type === 'diplomatic_event' && state.allianceCount >= 3,
        triggerType: 'diplomatic_achievement',
        context: {
          campaignId: event.campaignId,
          allianceCount: state.allianceCount,
          relations: state.diplomaticRelations,
          details: `Diplomatic success: ${state.allianceCount} active alliances established.`
        }
      }
    ];

    // Check each trigger condition
    for (const trigger of triggerChecks) {
      if (trigger.condition()) {
        try {
          await gameMasterVideoService.triggerVideo(trigger.triggerType, trigger.context);
        } catch (error) {
          console.error(`Failed to trigger video for ${trigger.triggerType}:`, error);
        }
      }
    }
  }

  // Helper methods for external systems to trigger events
  async triggerDiscovery(campaignId: string, discoveryData: any) {
    await this.processGameEvent({
      type: 'discovery_made',
      data: discoveryData,
      campaignId,
      timestamp: new Date().toISOString()
    });
  }

  async triggerPoliticalChange(campaignId: string, stabilityData: any) {
    await this.processGameEvent({
      type: 'political_stability_change',
      data: stabilityData,
      campaignId,
      timestamp: new Date().toISOString()
    });
  }

  async triggerEconomicMilestone(campaignId: string, economicData: any) {
    await this.processGameEvent({
      type: 'economic_milestone',
      data: economicData,
      campaignId,
      timestamp: new Date().toISOString()
    });
  }

  async triggerMilitaryThreat(campaignId: string, threatData: any) {
    await this.processGameEvent({
      type: 'military_threat_detected',
      data: threatData,
      campaignId,
      timestamp: new Date().toISOString()
    });
  }

  async triggerNaturalDisaster(campaignId: string, disasterData: any) {
    await this.processGameEvent({
      type: 'natural_disaster',
      data: disasterData,
      campaignId,
      timestamp: new Date().toISOString()
    });
  }

  async triggerTechnologyBreakthrough(campaignId: string, techData: any) {
    await this.processGameEvent({
      type: 'technology_breakthrough',
      data: techData,
      campaignId,
      timestamp: new Date().toISOString()
    });
  }

  async triggerPopulationMilestone(campaignId: string, populationData: any) {
    await this.processGameEvent({
      type: 'population_milestone',
      data: populationData,
      campaignId,
      timestamp: new Date().toISOString()
    });
  }

  async triggerColonyEstablished(campaignId: string, colonyData: any) {
    await this.processGameEvent({
      type: 'colony_established',
      data: colonyData,
      campaignId,
      timestamp: new Date().toISOString()
    });
  }

  async triggerDiplomaticEvent(campaignId: string, diplomaticData: any) {
    await this.processGameEvent({
      type: 'diplomatic_event',
      data: diplomaticData,
      campaignId,
      timestamp: new Date().toISOString()
    });
  }

  // Get current game state
  getGameState(campaignId: string): Record<string, any> {
    return this.gameState.get(campaignId) || {};
  }

  // Get event history
  getEventHistory(campaignId?: string, limit = 50): GameEvent[] {
    let events = this.eventHistory;
    
    if (campaignId) {
      events = events.filter(event => event.campaignId === campaignId);
    }
    
    return events.slice(-limit);
  }

  // Clear state (for testing or reset)
  clearState(campaignId?: string) {
    if (campaignId) {
      this.gameState.delete(campaignId);
      this.eventHistory = this.eventHistory.filter(event => event.campaignId !== campaignId);
    } else {
      this.gameState.clear();
      this.eventHistory = [];
    }
  }
}

// Create singleton instance
export const gameMasterTriggerService = new GameMasterTriggerService();

export default gameMasterTriggerService;

