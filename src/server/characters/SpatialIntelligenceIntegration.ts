/**
 * Spatial Intelligence Integration for Character AI Systems
 * Integrates galactic map awareness, military intelligence, trade logistics, and sensor systems
 */

import { Pool } from 'pg';
import { EventEmitter } from 'events';
import { SpatialAwarenessKnobsState, DEFAULT_SPATIAL_AWARENESS_KNOBS, applySpatialAwarenessKnobsToCharacterAI } from './spatialAwarenessKnobs.js';

export interface GalacticPosition {
  systemId: string;
  coordinates: { x: number; y: number; z: number };
  sectorId?: string;
}

export interface FleetIntelligence {
  fleetId: string;
  position: GalacticPosition;
  size: number;
  composition: string[];
  allegiance: 'friendly' | 'enemy' | 'neutral' | 'unknown';
  lastSeen: Date;
  movementVector?: { x: number; y: number; z: number };
  estimatedDestination?: GalacticPosition;
  threatLevel: number; // 0-10
  detectionConfidence: number; // 0-1
}

export interface ResourceIntelligence {
  resourceId: string;
  type: string;
  location: GalacticPosition;
  quantity: number;
  quality: number; // 0-1
  extractionDifficulty: number; // 0-1
  controlledBy?: string;
  marketValue: number;
  transportCost: number;
  securityRisk: number; // 0-1
}

export interface TradeIntelligence {
  routeId: string;
  origin: GalacticPosition;
  destination: GalacticPosition;
  goods: string[];
  volume: number;
  frequency: number;
  profitMargin: number;
  travelTime: number; // hours
  securityLevel: number; // 0-1
  competitionLevel: number; // 0-1
  demand: number; // 0-1
}

export interface SensorContact {
  contactId: string;
  position: GalacticPosition;
  type: 'fleet' | 'station' | 'anomaly' | 'debris' | 'unknown';
  size: number;
  signature: string;
  detectedAt: Date;
  confidence: number; // 0-1
  range: number; // distance from sensor
  classification?: string;
}

export interface CharacterSpatialState {
  characterId: string;
  role: 'military_commander' | 'intelligence_officer' | 'trade_executive' | 'explorer' | 'diplomat' | 'scientist';
  position: GalacticPosition;
  knowledgeBase: {
    fleetIntelligence: FleetIntelligence[];
    resourceIntelligence: ResourceIntelligence[];
    tradeIntelligence: TradeIntelligence[];
    sensorContacts: SensorContact[];
  };
  capabilities: {
    sensorRange: number;
    intelligenceNetworkReach: number;
    analysisAccuracy: number;
    predictionReliability: number;
  };
  lastUpdated: Date;
}

export class SpatialIntelligenceIntegration extends EventEmitter {
  private pool: Pool;
  private characterStates: Map<string, CharacterSpatialState> = new Map();
  private knobStates: Map<string, SpatialAwarenessKnobsState> = new Map();
  private galaxyMap: any = null;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
    this.startSpatialIntelligenceUpdates();
  }

  /**
   * Register a character for spatial intelligence
   */
  async registerCharacter(characterId: string, role: string, initialPosition: GalacticPosition): Promise<void> {
    const characterState: CharacterSpatialState = {
      characterId,
      role: role as any,
      position: initialPosition,
      knowledgeBase: {
        fleetIntelligence: [],
        resourceIntelligence: [],
        tradeIntelligence: [],
        sensorContacts: []
      },
      capabilities: this.calculateCapabilitiesForRole(role),
      lastUpdated: new Date()
    };

    this.characterStates.set(characterId, characterState);
    this.knobStates.set(characterId, { ...DEFAULT_SPATIAL_AWARENESS_KNOBS });

    console.log(`🧠 Registered character ${characterId} (${role}) for spatial intelligence`);
    this.emit('characterRegistered', { characterId, role });
  }

  /**
   * Update spatial awareness knobs for a character
   */
  async updateKnobs(characterId: string, knobUpdates: Partial<SpatialAwarenessKnobsState>): Promise<void> {
    const currentKnobs = this.knobStates.get(characterId) || { ...DEFAULT_SPATIAL_AWARENESS_KNOBS };
    const updatedKnobs = { ...currentKnobs, ...knobUpdates, lastUpdated: Date.now() };
    
    this.knobStates.set(characterId, updatedKnobs);

    // Update character capabilities based on new knobs
    const characterState = this.characterStates.get(characterId);
    if (characterState) {
      characterState.capabilities = this.calculateCapabilitiesFromKnobs(characterState.role, updatedKnobs);
      this.characterStates.set(characterId, characterState);
    }

    console.log(`🎛️ Updated spatial awareness knobs for character ${characterId}`);
    this.emit('knobsUpdated', { characterId, knobs: updatedKnobs });
  }

  /**
   * Calculate distance between two galactic positions
   */
  calculateDistance(pos1: GalacticPosition, pos2: GalacticPosition): number {
    const dx = pos1.coordinates.x - pos2.coordinates.x;
    const dy = pos1.coordinates.y - pos2.coordinates.y;
    const dz = pos1.coordinates.z - pos2.coordinates.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Calculate travel time between positions
   */
  calculateTravelTime(origin: GalacticPosition, destination: GalacticPosition, fleetSpeed: number = 1.0): number {
    const distance = this.calculateDistance(origin, destination);
    const knobs = this.knobStates.get('default') || DEFAULT_SPATIAL_AWARENESS_KNOBS;
    
    // Apply knobs to travel time calculation
    const baseTime = distance / fleetSpeed;
    const accuracyFactor = knobs.travel_time_estimation;
    const hazardFactor = 1 + (1 - knobs.space_hazard_recognition) * 0.2;
    
    return baseTime * hazardFactor * (0.8 + accuracyFactor * 0.4);
  }

  /**
   * Detect fleets within sensor range
   */
  async detectFleets(characterId: string): Promise<FleetIntelligence[]> {
    const characterState = this.characterStates.get(characterId);
    if (!characterState) return [];

    const knobs = this.knobStates.get(characterId) || DEFAULT_SPATIAL_AWARENESS_KNOBS;
    const sensorRange = characterState.capabilities.sensorRange * knobs.sensor_range_efficiency;

    // Simulate fleet detection (in real implementation, this would query actual fleet positions)
    const detectedFleets: FleetIntelligence[] = [];
    
    // Generate mock fleet detections based on sensor capabilities
    const numDetections = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < numDetections; i++) {
      const distance = Math.random() * sensorRange;
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI;
      
      const detectedFleet: FleetIntelligence = {
        fleetId: `fleet_${Date.now()}_${i}`,
        position: {
          systemId: `system_${Math.floor(Math.random() * 100)}`,
          coordinates: {
            x: characterState.position.coordinates.x + distance * Math.cos(angle) * Math.cos(elevation),
            y: characterState.position.coordinates.y + distance * Math.sin(angle) * Math.cos(elevation),
            z: characterState.position.coordinates.z + distance * Math.sin(elevation)
          }
        },
        size: Math.floor(Math.random() * 20) + 1,
        composition: ['cruiser', 'destroyer', 'frigate'],
        allegiance: Math.random() > 0.5 ? 'enemy' : 'neutral',
        lastSeen: new Date(),
        threatLevel: Math.floor(Math.random() * 10) + 1,
        detectionConfidence: knobs.enemy_fleet_detection_range * (1 - distance / sensorRange)
      };
      
      detectedFleets.push(detectedFleet);
    }

    // Update character's knowledge base
    characterState.knowledgeBase.fleetIntelligence = [
      ...characterState.knowledgeBase.fleetIntelligence.filter(f => 
        Date.now() - f.lastSeen.getTime() < 3600000 // Keep intelligence for 1 hour
      ),
      ...detectedFleets
    ];

    return detectedFleets;
  }

  /**
   * Analyze resource opportunities
   */
  async analyzeResourceOpportunities(characterId: string): Promise<ResourceIntelligence[]> {
    const characterState = this.characterStates.get(characterId);
    if (!characterState) return [];

    const knobs = this.knobStates.get(characterId) || DEFAULT_SPATIAL_AWARENESS_KNOBS;
    
    // Generate resource intelligence based on character's knowledge and capabilities
    const resources: ResourceIntelligence[] = [];
    const numResources = Math.floor(Math.random() * 8) + 2;
    
    for (let i = 0; i < numResources; i++) {
      const distance = Math.random() * 1000;
      const resource: ResourceIntelligence = {
        resourceId: `resource_${Date.now()}_${i}`,
        type: ['minerals', 'energy', 'biologicals', 'rare_elements'][Math.floor(Math.random() * 4)],
        location: {
          systemId: `system_${Math.floor(Math.random() * 100)}`,
          coordinates: {
            x: characterState.position.coordinates.x + (Math.random() - 0.5) * distance,
            y: characterState.position.coordinates.y + (Math.random() - 0.5) * distance,
            z: characterState.position.coordinates.z + (Math.random() - 0.5) * distance
          }
        },
        quantity: Math.floor(Math.random() * 10000) + 1000,
        quality: Math.random(),
        extractionDifficulty: Math.random(),
        marketValue: Math.floor(Math.random() * 1000) + 100,
        transportCost: this.calculateTravelTime(characterState.position, {
          systemId: `system_${Math.floor(Math.random() * 100)}`,
          coordinates: {
            x: characterState.position.coordinates.x + (Math.random() - 0.5) * distance,
            y: characterState.position.coordinates.y + (Math.random() - 0.5) * distance,
            z: characterState.position.coordinates.z + (Math.random() - 0.5) * distance
          }
        }) * knobs.transport_cost_calculation,
        securityRisk: Math.random()
      };
      
      resources.push(resource);
    }

    characterState.knowledgeBase.resourceIntelligence = resources;
    return resources;
  }

  /**
   * Optimize trade routes
   */
  async optimizeTradeRoutes(characterId: string): Promise<TradeIntelligence[]> {
    const characterState = this.characterStates.get(characterId);
    if (!characterState) return [];

    const knobs = this.knobStates.get(characterId) || DEFAULT_SPATIAL_AWARENESS_KNOBS;
    
    // Generate optimized trade routes based on spatial analysis
    const routes: TradeIntelligence[] = [];
    const numRoutes = Math.floor(Math.random() * 6) + 2;
    
    for (let i = 0; i < numRoutes; i++) {
      const origin = {
        systemId: `origin_${i}`,
        coordinates: {
          x: characterState.position.coordinates.x + (Math.random() - 0.5) * 500,
          y: characterState.position.coordinates.y + (Math.random() - 0.5) * 500,
          z: characterState.position.coordinates.z + (Math.random() - 0.5) * 100
        }
      };
      
      const destination = {
        systemId: `dest_${i}`,
        coordinates: {
          x: origin.coordinates.x + (Math.random() - 0.5) * 300,
          y: origin.coordinates.y + (Math.random() - 0.5) * 300,
          z: origin.coordinates.z + (Math.random() - 0.5) * 50
        }
      };
      
      const route: TradeIntelligence = {
        routeId: `route_${Date.now()}_${i}`,
        origin,
        destination,
        goods: ['electronics', 'food', 'minerals', 'energy'][Math.floor(Math.random() * 4)].split(),
        volume: Math.floor(Math.random() * 1000) + 100,
        frequency: Math.floor(Math.random() * 10) + 1,
        profitMargin: Math.random() * 0.5 + 0.1,
        travelTime: this.calculateTravelTime(origin, destination),
        securityLevel: knobs.trade_security_assessment,
        competitionLevel: Math.random(),
        demand: Math.random()
      };
      
      routes.push(route);
    }

    characterState.knowledgeBase.tradeIntelligence = routes;
    return routes;
  }

  /**
   * Get spatial intelligence for a character
   */
  getSpatialIntelligence(characterId: string): CharacterSpatialState | null {
    return this.characterStates.get(characterId) || null;
  }

  /**
   * Get AI recommendations for spatial awareness improvements
   */
  async getAIRecommendations(characterId: string): Promise<any> {
    const characterState = this.characterStates.get(characterId);
    const knobs = this.knobStates.get(characterId);
    
    if (!characterState || !knobs) return null;

    const recommendations = [];

    // Analyze performance and suggest improvements
    if (characterState.role === 'military_commander') {
      if (knobs.fleet_movement_tracking < 0.8) {
        recommendations.push({
          knob: 'fleet_movement_tracking',
          currentValue: knobs.fleet_movement_tracking,
          recommendedValue: Math.min(knobs.fleet_movement_tracking + 0.1, 1.0),
          reason: 'Military commanders need enhanced fleet tracking for strategic advantage',
          confidence: 0.9,
          priority: 'high'
        });
      }
    }

    if (characterState.role === 'trade_executive') {
      if (knobs.trade_route_optimization < 0.8) {
        recommendations.push({
          knob: 'trade_route_optimization',
          currentValue: knobs.trade_route_optimization,
          recommendedValue: Math.min(knobs.trade_route_optimization + 0.1, 1.0),
          reason: 'Trade executives benefit from optimized route planning for profit maximization',
          confidence: 0.85,
          priority: 'high'
        });
      }
    }

    if (characterState.role === 'intelligence_officer') {
      if (knobs.intelligence_network_coverage < 0.7) {
        recommendations.push({
          knob: 'intelligence_network_coverage',
          currentValue: knobs.intelligence_network_coverage,
          recommendedValue: Math.min(knobs.intelligence_network_coverage + 0.15, 1.0),
          reason: 'Intelligence officers require extensive network coverage for effective operations',
          confidence: 0.9,
          priority: 'high'
        });
      }
    }

    return {
      characterId,
      role: characterState.role,
      recommendations,
      timestamp: new Date()
    };
  }

  /**
   * Calculate capabilities for character role
   */
  private calculateCapabilitiesForRole(role: string): any {
    const baseCapabilities = {
      sensorRange: 100,
      intelligenceNetworkReach: 50,
      analysisAccuracy: 0.7,
      predictionReliability: 0.6
    };

    switch (role) {
      case 'military_commander':
        return {
          ...baseCapabilities,
          sensorRange: 150,
          analysisAccuracy: 0.9,
          predictionReliability: 0.8
        };
      case 'intelligence_officer':
        return {
          ...baseCapabilities,
          intelligenceNetworkReach: 200,
          analysisAccuracy: 0.95,
          predictionReliability: 0.85
        };
      case 'trade_executive':
        return {
          ...baseCapabilities,
          sensorRange: 80,
          intelligenceNetworkReach: 120,
          analysisAccuracy: 0.8,
          predictionReliability: 0.9
        };
      case 'explorer':
        return {
          ...baseCapabilities,
          sensorRange: 200,
          analysisAccuracy: 0.85,
          predictionReliability: 0.7
        };
      default:
        return baseCapabilities;
    }
  }

  /**
   * Calculate capabilities from knobs
   */
  private calculateCapabilitiesFromKnobs(role: string, knobs: SpatialAwarenessKnobsState): any {
    const baseCapabilities = this.calculateCapabilitiesForRole(role);
    
    return {
      sensorRange: baseCapabilities.sensorRange * knobs.sensor_range_efficiency,
      intelligenceNetworkReach: baseCapabilities.intelligenceNetworkReach * knobs.intelligence_network_coverage,
      analysisAccuracy: baseCapabilities.analysisAccuracy * knobs.distance_calculation_accuracy,
      predictionReliability: baseCapabilities.predictionReliability * knobs.travel_time_estimation
    };
  }

  /**
   * Start spatial intelligence updates
   */
  private startSpatialIntelligenceUpdates(): void {
    this.updateInterval = setInterval(async () => {
      for (const [characterId, characterState] of this.characterStates.entries()) {
        try {
          // Update fleet intelligence
          await this.detectFleets(characterId);
          
          // Update resource intelligence for trade characters
          if (characterState.role === 'trade_executive') {
            await this.analyzeResourceOpportunities(characterId);
            await this.optimizeTradeRoutes(characterId);
          }
          
          characterState.lastUpdated = new Date();
        } catch (error) {
          console.error(`Error updating spatial intelligence for ${characterId}:`, error);
        }
      }
    }, 45000); // Update every 45 seconds

    console.log('🧠 Spatial intelligence updates started');
  }

  /**
   * Stop spatial intelligence updates
   */
  stopUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    console.log('🧠 Spatial intelligence updates stopped');
  }
}
