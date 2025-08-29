/**
 * Enhanced Knobs Integration for SimEngineOrchestrator
 * Integrates all new enhanced API knobs with the simulation engine
 */

import { Pool } from 'pg';
import { EventEmitter } from 'events';

// Import all enhanced knob systems
import { EnhancedKnobSystem } from '../../server/shared/enhanced-knob-system';

export interface EnhancedKnobsManager {
  businessCycle: EnhancedKnobSystem;
  worldWonders: EnhancedKnobSystem;
  politicalSystems: EnhancedKnobSystem;
  culture: EnhancedKnobSystem;
  treasury: EnhancedKnobSystem;
  characterAwareness: EnhancedKnobSystem;
  nationalSymbols: EnhancedKnobSystem;
  missions: EnhancedKnobSystem;
  debtToGDP: EnhancedKnobSystem;
  gameMasterVideos: EnhancedKnobSystem;
  militaryDefense: EnhancedKnobSystem;
  leaderSpeeches: EnhancedKnobSystem;
  addressNation: EnhancedKnobSystem;
  delegation: EnhancedKnobSystem;
  witterFeed: EnhancedKnobSystem;
  whoseApp: EnhancedKnobSystem;
}

export interface KnobUpdateEvent {
  system: string;
  knobName: string;
  oldValue: number;
  newValue: number;
  source: 'ai' | 'player' | 'system';
  timestamp: Date;
  campaignId: string;
  civilizationId: string;
}

export interface SimulationState {
  businessCycle: {
    currentPhase: string;
    volatility: number;
    growthRate: number;
  };
  worldWonders: {
    constructionSpeed: number;
    availabilityRate: number;
    culturalImpact: number;
  };
  politicalSystems: {
    stability: number;
    democraticHealth: number;
    polarization: number;
  };
  culture: {
    diversity: number;
    cohesion: number;
    evolution: number;
  };
  treasury: {
    efficiency: number;
    transparency: number;
    taxCompliance: number;
  };
  characterAwareness: {
    storyAwareness: number;
    gameStateKnowledge: number;
    specialtyExpertise: number;
  };
  nationalSymbols: {
    recognitionLevel: number;
    culturalSignificance: number;
    unityImpact: number;
  };
  missions: {
    generationRate: number;
    difficulty: number;
    storyIntegration: number;
  };
  debtToGDP: {
    ratio: number;
    sustainability: number;
    riskLevel: number;
  };
  gameMasterVideos: {
    productionRate: number;
    quality: number;
    engagement: number;
  };
  militaryDefense: {
    readiness: number;
    coordination: number;
    effectiveness: number;
  };
  leaderSpeeches: {
    frequency: number;
    effectiveness: number;
    authenticity: number;
  };
  addressNation: {
    impact: number;
    credibility: number;
    reach: number;
  };
  delegation: {
    efficiency: number;
    accountability: number;
    coordination: number;
  };
  witterFeed: {
    engagement: number;
    contentQuality: number;
    influence: number;
  };
  whoseApp: {
    adoption: number;
    satisfaction: number;
    connectivity: number;
  };
}

export class EnhancedKnobsIntegration extends EventEmitter {
  private pool: Pool;
  private knobSystems: EnhancedKnobsManager;
  private simulationState: Map<string, SimulationState> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(pool: Pool) {
    super();
    this.pool = pool;
    this.knobSystems = this.initializeKnobSystems();
    this.startUpdateLoop();
  }

  private initializeKnobSystems(): EnhancedKnobsManager {
    return {
      businessCycle: new EnhancedKnobSystem('business_cycle', {
        cycle_volatility: { min: 0.0, max: 1.0, default: 0.5, unit: 'intensity', description: 'Business cycle volatility' },
        expansion_duration: { min: 0.3, max: 3.0, default: 1.0, unit: 'multiplier', description: 'Expansion phase duration' },
        recession_severity: { min: 0.1, max: 2.0, default: 1.0, unit: 'multiplier', description: 'Recession severity factor' },
        recovery_speed: { min: 0.2, max: 2.5, default: 1.0, unit: 'multiplier', description: 'Economic recovery speed' }
      }),

      worldWonders: new EnhancedKnobSystem('world_wonders', {
        construction_speed: { min: 0.2, max: 3.0, default: 1.0, unit: 'multiplier', description: 'Wonder construction speed' },
        availability_rate: { min: 0.1, max: 1.0, default: 0.6, unit: 'rate', description: 'Wonder availability rate' },
        cultural_impact: { min: 0.5, max: 2.0, default: 1.0, unit: 'multiplier', description: 'Cultural impact multiplier' },
        maintenance_cost: { min: 0.3, max: 2.0, default: 1.0, unit: 'multiplier', description: 'Maintenance cost factor' }
      }),

      politicalSystems: new EnhancedKnobSystem('political_systems', {
        multiparty_stability: { min: 0.0, max: 1.0, default: 0.7, unit: 'stability', description: 'Multiparty system stability' },
        polarization_tendency: { min: 0.0, max: 1.0, default: 0.4, unit: 'tendency', description: 'Political polarization tendency' },
        voter_turnout: { min: 0.3, max: 0.95, default: 0.65, unit: 'rate', description: 'Base voter turnout rate' },
        democratic_health: { min: 0.0, max: 1.0, default: 0.7, unit: 'health', description: 'Democratic health index' }
      }),

      culture: new EnhancedKnobSystem('culture', {
        cultural_diversity: { min: 0.0, max: 1.0, default: 0.6, unit: 'diversity', description: 'Cultural diversity level' },
        social_cohesion: { min: 0.0, max: 1.0, default: 0.7, unit: 'cohesion', description: 'Social cohesion strength' },
        tradition_preservation: { min: 0.0, max: 1.0, default: 0.5, unit: 'preservation', description: 'Tradition preservation rate' },
        innovation_acceptance: { min: 0.0, max: 1.0, default: 0.6, unit: 'acceptance', description: 'Cultural innovation acceptance' }
      }),

      treasury: new EnhancedKnobSystem('treasury', {
        tax_efficiency: { min: 0.3, max: 1.0, default: 0.7, unit: 'efficiency', description: 'Tax collection efficiency' },
        spending_transparency: { min: 0.0, max: 1.0, default: 0.6, unit: 'transparency', description: 'Government spending transparency' },
        budget_discipline: { min: 0.0, max: 1.0, default: 0.5, unit: 'discipline', description: 'Budget discipline level' },
        revenue_diversification: { min: 0.0, max: 1.0, default: 0.4, unit: 'diversification', description: 'Revenue source diversification' }
      }),

      characterAwareness: new EnhancedKnobSystem('character_awareness', {
        story_awareness: { min: 0.0, max: 1.0, default: 0.7, unit: 'awareness', description: 'Character story awareness level' },
        game_state_knowledge: { min: 0.0, max: 1.0, default: 0.6, unit: 'knowledge', description: 'Game state knowledge depth' },
        specialty_expertise: { min: 0.0, max: 1.0, default: 0.8, unit: 'expertise', description: 'Specialty area expertise' },
        contextual_adaptation: { min: 0.0, max: 1.0, default: 0.5, unit: 'adaptation', description: 'Contextual adaptation ability' }
      }),

      nationalSymbols: new EnhancedKnobSystem('national_symbols', {
        symbol_recognition: { min: 0.0, max: 1.0, default: 0.8, unit: 'recognition', description: 'National symbol recognition' },
        cultural_significance: { min: 0.0, max: 1.0, default: 0.7, unit: 'significance', description: 'Cultural significance level' },
        unity_impact: { min: 0.0, max: 1.0, default: 0.6, unit: 'impact', description: 'National unity impact' },
        evolution_rate: { min: 0.0, max: 1.0, default: 0.2, unit: 'rate', description: 'Symbol evolution rate' }
      }),

      missions: new EnhancedKnobSystem('missions', {
        generation_rate: { min: 0.1, max: 2.0, default: 1.0, unit: 'rate', description: 'Mission generation rate' },
        difficulty_scaling: { min: 0.3, max: 2.0, default: 1.0, unit: 'scaling', description: 'Mission difficulty scaling' },
        story_integration: { min: 0.0, max: 1.0, default: 0.7, unit: 'integration', description: 'Story integration level' },
        reward_scaling: { min: 0.5, max: 2.0, default: 1.0, unit: 'scaling', description: 'Mission reward scaling' }
      }),

      debtToGDP: new EnhancedKnobSystem('debt_to_gdp', {
        debt_sustainability: { min: 0.0, max: 1.0, default: 0.6, unit: 'sustainability', description: 'Debt sustainability index' },
        borrowing_capacity: { min: 0.0, max: 1.0, default: 0.7, unit: 'capacity', description: 'Government borrowing capacity' },
        interest_sensitivity: { min: 0.0, max: 1.0, default: 0.5, unit: 'sensitivity', description: 'Interest rate sensitivity' },
        fiscal_discipline: { min: 0.0, max: 1.0, default: 0.6, unit: 'discipline', description: 'Fiscal discipline level' }
      }),

      gameMasterVideos: new EnhancedKnobSystem('gamemaster_videos', {
        production_frequency: { min: 0.1, max: 2.0, default: 1.0, unit: 'frequency', description: 'Video production frequency' },
        content_quality: { min: 0.3, max: 1.0, default: 0.7, unit: 'quality', description: 'Content quality level' },
        narrative_impact: { min: 0.0, max: 1.0, default: 0.8, unit: 'impact', description: 'Narrative impact strength' },
        player_engagement: { min: 0.0, max: 1.0, default: 0.6, unit: 'engagement', description: 'Player engagement level' }
      }),

      militaryDefense: new EnhancedKnobSystem('military_defense', {
        readiness_level: { min: 0.0, max: 1.0, default: 0.7, unit: 'readiness', description: 'Military readiness level' },
        joint_coordination: { min: 0.0, max: 1.0, default: 0.6, unit: 'coordination', description: 'Joint chiefs coordination' },
        defense_efficiency: { min: 0.3, max: 1.0, default: 0.7, unit: 'efficiency', description: 'Defense system efficiency' },
        threat_assessment: { min: 0.0, max: 1.0, default: 0.8, unit: 'assessment', description: 'Threat assessment accuracy' }
      }),

      leaderSpeeches: new EnhancedKnobSystem('leader_speeches', {
        speech_frequency: { min: 0.1, max: 2.0, default: 1.0, unit: 'frequency', description: 'Leader speech frequency' },
        message_effectiveness: { min: 0.0, max: 1.0, default: 0.7, unit: 'effectiveness', description: 'Message effectiveness' },
        authenticity_level: { min: 0.0, max: 1.0, default: 0.8, unit: 'authenticity', description: 'Speech authenticity level' },
        issue_addressing: { min: 0.0, max: 1.0, default: 0.6, unit: 'addressing', description: 'Issue addressing completeness' }
      }),

      addressNation: new EnhancedKnobSystem('address_nation', {
        broadcast_reach: { min: 0.3, max: 1.0, default: 0.8, unit: 'reach', description: 'National address broadcast reach' },
        message_impact: { min: 0.0, max: 1.0, default: 0.7, unit: 'impact', description: 'Message impact strength' },
        credibility_factor: { min: 0.0, max: 1.0, default: 0.6, unit: 'credibility', description: 'Leader credibility factor' },
        response_generation: { min: 0.0, max: 1.0, default: 0.5, unit: 'response', description: 'Public response generation' }
      }),

      delegation: new EnhancedKnobSystem('delegation', {
        delegation_efficiency: { min: 0.3, max: 1.0, default: 0.7, unit: 'efficiency', description: 'Delegation efficiency' },
        accountability_level: { min: 0.0, max: 1.0, default: 0.6, unit: 'accountability', description: 'Accountability enforcement' },
        coordination_quality: { min: 0.0, max: 1.0, default: 0.5, unit: 'coordination', description: 'Inter-department coordination' },
        authority_clarity: { min: 0.0, max: 1.0, default: 0.8, unit: 'clarity', description: 'Authority delegation clarity' }
      }),

      witterFeed: new EnhancedKnobSystem('witter_feed', {
        content_generation: { min: 0.1, max: 2.0, default: 1.0, unit: 'generation', description: 'Content generation rate' },
        engagement_quality: { min: 0.0, max: 1.0, default: 0.6, unit: 'quality', description: 'Engagement quality level' },
        influence_reach: { min: 0.0, max: 1.0, default: 0.7, unit: 'reach', description: 'Social influence reach' },
        content_diversity: { min: 0.0, max: 1.0, default: 0.8, unit: 'diversity', description: 'Content diversity level' }
      }),

      whoseApp: new EnhancedKnobSystem('whose_app', {
        user_adoption: { min: 0.0, max: 1.0, default: 0.6, unit: 'adoption', description: 'User adoption rate' },
        feature_satisfaction: { min: 0.0, max: 1.0, default: 0.7, unit: 'satisfaction', description: 'Feature satisfaction level' },
        connectivity_quality: { min: 0.0, max: 1.0, default: 0.8, unit: 'connectivity', description: 'Connection quality' },
        privacy_trust: { min: 0.0, max: 1.0, default: 0.5, unit: 'trust', description: 'Privacy trust level' }
      })
    };
  }

  /**
   * Update knob values for a specific civilization
   */
  async updateKnobs(
    campaignId: string, 
    civilizationId: string, 
    system: string, 
    knobs: Record<string, number>, 
    source: 'ai' | 'player' | 'system' = 'system'
  ): Promise<void> {
    const knobSystem = this.knobSystems[system as keyof EnhancedKnobsManager];
    if (!knobSystem) {
      throw new Error(`Unknown knob system: ${system}`);
    }

    const updateResult = knobSystem.updateKnobs(knobs, source);
    
    // Store knob updates in database
    for (const [knobName, newValue] of Object.entries(knobs)) {
      await this.pool.query(`
        INSERT INTO enhanced_knobs_state (campaign_id, civilization_id, system_name, knob_name, knob_value, updated_by, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (campaign_id, civilization_id, system_name, knob_name) 
        DO UPDATE SET knob_value = $5, updated_by = $6, last_updated = NOW()
      `, [campaignId, civilizationId, system, knobName, newValue, source]);

      // Emit update event
      this.emit('knobUpdate', {
        system,
        knobName,
        oldValue: updateResult.previous_values[knobName] || 0,
        newValue,
        source,
        timestamp: new Date(),
        campaignId,
        civilizationId
      } as KnobUpdateEvent);
    }

    // Update simulation state
    await this.updateSimulationState(campaignId, civilizationId);
  }

  /**
   * Get all knob values for a civilization
   */
  async getKnobValues(campaignId: string, civilizationId: string): Promise<Record<string, Record<string, number>>> {
    const result = await this.pool.query(`
      SELECT system_name, knob_name, knob_value 
      FROM enhanced_knobs_state 
      WHERE campaign_id = $1 AND civilization_id = $2
    `, [campaignId, civilizationId]);

    const knobValues: Record<string, Record<string, number>> = {};
    
    for (const row of result.rows) {
      if (!knobValues[row.system_name]) {
        knobValues[row.system_name] = {};
      }
      knobValues[row.system_name][row.knob_name] = row.knob_value;
    }

    return knobValues;
  }

  /**
   * Update simulation state based on current knob values
   */
  private async updateSimulationState(campaignId: string, civilizationId: string): Promise<void> {
    const key = `${campaignId}-${civilizationId}`;
    const knobValues = await this.getKnobValues(campaignId, civilizationId);

    const newState: SimulationState = {
      businessCycle: {
        currentPhase: this.calculateBusinessCyclePhase(knobValues.business_cycle || {}),
        volatility: knobValues.business_cycle?.cycle_volatility || 0.5,
        growthRate: this.calculateGrowthRate(knobValues.business_cycle || {})
      },
      worldWonders: {
        constructionSpeed: knobValues.world_wonders?.construction_speed || 1.0,
        availabilityRate: knobValues.world_wonders?.availability_rate || 0.6,
        culturalImpact: knobValues.world_wonders?.cultural_impact || 1.0
      },
      politicalSystems: {
        stability: knobValues.political_systems?.multiparty_stability || 0.7,
        democraticHealth: knobValues.political_systems?.democratic_health || 0.7,
        polarization: knobValues.political_systems?.polarization_tendency || 0.4
      },
      culture: {
        diversity: knobValues.culture?.cultural_diversity || 0.6,
        cohesion: knobValues.culture?.social_cohesion || 0.7,
        evolution: knobValues.culture?.innovation_acceptance || 0.6
      },
      treasury: {
        efficiency: knobValues.treasury?.tax_efficiency || 0.7,
        transparency: knobValues.treasury?.spending_transparency || 0.6,
        taxCompliance: this.calculateTaxCompliance(knobValues.treasury || {})
      },
      characterAwareness: {
        storyAwareness: knobValues.character_awareness?.story_awareness || 0.7,
        gameStateKnowledge: knobValues.character_awareness?.game_state_knowledge || 0.6,
        specialtyExpertise: knobValues.character_awareness?.specialty_expertise || 0.8
      },
      nationalSymbols: {
        recognitionLevel: knobValues.national_symbols?.symbol_recognition || 0.8,
        culturalSignificance: knobValues.national_symbols?.cultural_significance || 0.7,
        unityImpact: knobValues.national_symbols?.unity_impact || 0.6
      },
      missions: {
        generationRate: knobValues.missions?.generation_rate || 1.0,
        difficulty: knobValues.missions?.difficulty_scaling || 1.0,
        storyIntegration: knobValues.missions?.story_integration || 0.7
      },
      debtToGDP: {
        ratio: this.calculateDebtToGDPRatio(knobValues.debt_to_gdp || {}),
        sustainability: knobValues.debt_to_gdp?.debt_sustainability || 0.6,
        riskLevel: this.calculateDebtRisk(knobValues.debt_to_gdp || {})
      },
      gameMasterVideos: {
        productionRate: knobValues.gamemaster_videos?.production_frequency || 1.0,
        quality: knobValues.gamemaster_videos?.content_quality || 0.7,
        engagement: knobValues.gamemaster_videos?.player_engagement || 0.6
      },
      militaryDefense: {
        readiness: knobValues.military_defense?.readiness_level || 0.7,
        coordination: knobValues.military_defense?.joint_coordination || 0.6,
        effectiveness: knobValues.military_defense?.defense_efficiency || 0.7
      },
      leaderSpeeches: {
        frequency: knobValues.leader_speeches?.speech_frequency || 1.0,
        effectiveness: knobValues.leader_speeches?.message_effectiveness || 0.7,
        authenticity: knobValues.leader_speeches?.authenticity_level || 0.8
      },
      addressNation: {
        impact: knobValues.address_nation?.message_impact || 0.7,
        credibility: knobValues.address_nation?.credibility_factor || 0.6,
        reach: knobValues.address_nation?.broadcast_reach || 0.8
      },
      delegation: {
        efficiency: knobValues.delegation?.delegation_efficiency || 0.7,
        accountability: knobValues.delegation?.accountability_level || 0.6,
        coordination: knobValues.delegation?.coordination_quality || 0.5
      },
      witterFeed: {
        engagement: knobValues.witter_feed?.engagement_quality || 0.6,
        contentQuality: knobValues.witter_feed?.content_generation || 1.0,
        influence: knobValues.witter_feed?.influence_reach || 0.7
      },
      whoseApp: {
        adoption: knobValues.whose_app?.user_adoption || 0.6,
        satisfaction: knobValues.whose_app?.feature_satisfaction || 0.7,
        connectivity: knobValues.whose_app?.connectivity_quality || 0.8
      }
    };

    this.simulationState.set(key, newState);
    
    // Emit state update event
    this.emit('stateUpdate', {
      campaignId,
      civilizationId,
      state: newState,
      timestamp: new Date()
    });
  }

  /**
   * Get current simulation state for a civilization
   */
  getSimulationState(campaignId: string, civilizationId: string): SimulationState | null {
    const key = `${campaignId}-${civilizationId}`;
    return this.simulationState.get(key) || null;
  }

  /**
   * Start the update loop for continuous simulation
   */
  private startUpdateLoop(): void {
    this.updateInterval = setInterval(async () => {
      // Update simulation states for all active civilizations
      for (const [key, state] of this.simulationState.entries()) {
        const [campaignId, civilizationId] = key.split('-');
        await this.updateSimulationState(campaignId, civilizationId);
      }
    }, 30000); // Update every 30 seconds
  }

  /**
   * Stop the update loop
   */
  stopUpdateLoop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Helper calculation methods
  private calculateBusinessCyclePhase(knobs: Record<string, number>): string {
    const volatility = knobs.cycle_volatility || 0.5;
    const random = Math.random();
    
    if (random < 0.4 - volatility * 0.2) return 'expansion';
    if (random < 0.6 + volatility * 0.1) return 'peak';
    if (random < 0.8 + volatility * 0.1) return 'contraction';
    return 'trough';
  }

  private calculateGrowthRate(knobs: Record<string, number>): number {
    const baseRate = 0.025;
    const expansionModifier = knobs.expansion_duration || 1.0;
    const recoverySpeed = knobs.recovery_speed || 1.0;
    
    return baseRate * expansionModifier * recoverySpeed;
  }

  private calculateTaxCompliance(knobs: Record<string, number>): number {
    const efficiency = knobs.tax_efficiency || 0.7;
    const transparency = knobs.spending_transparency || 0.6;
    
    return (efficiency + transparency) / 2;
  }

  private calculateDebtToGDPRatio(knobs: Record<string, number>): number {
    const sustainability = knobs.debt_sustainability || 0.6;
    const discipline = knobs.fiscal_discipline || 0.6;
    
    // Higher sustainability and discipline = lower debt ratio
    return Math.max(0.1, 1.0 - (sustainability + discipline) / 2);
  }

  private calculateDebtRisk(knobs: Record<string, number>): number {
    const sustainability = knobs.debt_sustainability || 0.6;
    const interestSensitivity = knobs.interest_sensitivity || 0.5;
    
    return Math.max(0.0, interestSensitivity - sustainability);
  }

  /**
   * Initialize knob states for a new civilization
   */
  async initializeCivilizationKnobs(campaignId: string, civilizationId: string): Promise<void> {
    for (const [systemName, knobSystem] of Object.entries(this.knobSystems)) {
      const defaultKnobs = knobSystem.getAllKnobValues();
      await this.updateKnobs(campaignId, civilizationId, systemName, defaultKnobs, 'system');
    }
  }

  /**
   * Get knob recommendations from AI analysis
   */
  async getAIKnobRecommendations(
    campaignId: string, 
    civilizationId: string, 
    context: Record<string, any>
  ): Promise<Record<string, Record<string, number>>> {
    // This would integrate with AI service to get intelligent knob recommendations
    // For now, return mock recommendations
    return {
      business_cycle: {
        cycle_volatility: Math.max(0.0, Math.min(1.0, context.economicStress || 0.5)),
        recovery_speed: Math.max(0.2, Math.min(2.5, 1.0 + (context.policySupport || 0) * 0.5))
      },
      political_systems: {
        polarization_tendency: Math.max(0.0, Math.min(1.0, context.socialTension || 0.4)),
        democratic_health: Math.max(0.0, Math.min(1.0, context.institutionalStrength || 0.7))
      }
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopUpdateLoop();
    this.removeAllListeners();
  }
}
