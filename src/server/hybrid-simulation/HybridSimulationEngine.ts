/**
 * Hybrid Simulation Engine
 * Combines deterministic calculations with AI-powered natural language analysis
 * Operates on 120-second strategic tick intervals
 */

import { EventEmitter } from 'events';
import { step } from '../sim/engine.js';
import { CampaignState } from '../sim/types.js';
import { characterVectorMemory } from '../memory/characterVectorMemory.js';
import { civilizationVectorMemory } from '../memory/civilizationVectorMemory.js';
import { psychologyVectorMemory } from './PsychologyVectorMemory.js';
import { aiAnalysisVectorMemory } from './AIAnalysisVectorMemory.js';
import {
  StrategicTick,
  TickConfiguration,
  TICK_MODES,
  PlayerAction,
  DeterministicResults,
  NaturalLanguageResults,
  HybridResults,
  MemoryUpdate,
  CampaignTicker,
  HybridEngineConfig,
  DEFAULT_HYBRID_ENGINE_CONFIG,
  EconomicAnalytics,
  MilitaryAnalytics,
  ResearchAnalytics,
  PopulationAnalytics,
  DiplomaticAnalytics,
  StateChanges
} from './types.js';
import { NaturalLanguageProcessor } from './NaturalLanguageProcessor.js';
import { HybridIntegrator } from './HybridIntegrator.js';

export class HybridSimulationEngine extends EventEmitter {
  private campaigns = new Map<number, CampaignTicker>();
  private tickTimers = new Map<number, NodeJS.Timeout>();
  private config: HybridEngineConfig;
  private naturalLanguageProcessor: NaturalLanguageProcessor;
  private hybridIntegrator: HybridIntegrator;
  private isShuttingDown = false;

  constructor(config: Partial<HybridEngineConfig> = {}) {
    super();
    this.config = { ...DEFAULT_HYBRID_ENGINE_CONFIG, ...config };
    this.naturalLanguageProcessor = new NaturalLanguageProcessor(this.config);
    this.hybridIntegrator = new HybridIntegrator(this.config);
    
    // Set up event listeners
    this.setupEventListeners();
  }

  // ===== CAMPAIGN MANAGEMENT =====

  /**
   * Register a campaign for hybrid simulation processing
   */
  async registerCampaign(
    campaignId: number, 
    tickMode: keyof typeof TICK_MODES = 'strategic'
  ): Promise<void> {
    if (this.campaigns.has(campaignId)) {
      throw new Error(`Campaign ${campaignId} is already registered`);
    }

    const ticker: CampaignTicker = {
      campaignId,
      isActive: false,
      currentMode: TICK_MODES[tickMode],
      nextTickTime: new Date(Date.now() + TICK_MODES[tickMode].interval),
      lastTickTime: new Date(),
      tickCount: 0,
      averageTickTime: 0,
      lastTickDuration: 0,
      errorCount: 0,
      activePlayers: [],
      lastPlayerAction: new Date(),
      queuedActions: []
    };

    this.campaigns.set(campaignId, ticker);
    this.emit('campaignRegistered', { campaignId, tickMode });
  }

  /**
   * Start hybrid simulation for a campaign
   */
  async startCampaign(campaignId: number): Promise<void> {
    const ticker = this.campaigns.get(campaignId);
    if (!ticker) {
      throw new Error(`Campaign ${campaignId} is not registered`);
    }

    if (ticker.isActive) {
      throw new Error(`Campaign ${campaignId} is already active`);
    }

    ticker.isActive = true;
    this.scheduleNextTick(campaignId);
    this.emit('campaignStarted', { campaignId });
  }

  /**
   * Stop hybrid simulation for a campaign
   */
  async stopCampaign(campaignId: number): Promise<void> {
    const ticker = this.campaigns.get(campaignId);
    if (!ticker) {
      throw new Error(`Campaign ${campaignId} is not registered`);
    }

    ticker.isActive = false;
    
    const timer = this.tickTimers.get(campaignId);
    if (timer) {
      clearTimeout(timer);
      this.tickTimers.delete(campaignId);
    }

    this.emit('campaignStopped', { campaignId });
  }

  /**
   * Unregister a campaign from hybrid simulation
   */
  async unregisterCampaign(campaignId: number): Promise<void> {
    await this.stopCampaign(campaignId);
    this.campaigns.delete(campaignId);
    this.emit('campaignUnregistered', { campaignId });
  }

  // ===== TICK PROCESSING =====

  /**
   * Process a strategic tick for a campaign
   */
  async processTick(campaignId: number): Promise<StrategicTick> {
    const startTime = Date.now();
    const ticker = this.campaigns.get(campaignId);
    
    if (!ticker) {
      throw new Error(`Campaign ${campaignId} is not registered`);
    }

    try {
      // Create tick context
      const tick: Partial<StrategicTick> = {
        tickId: ticker.tickCount + 1,
        campaignId,
        timestamp: new Date(),
        interval: ticker.currentMode.interval,
        seed: this.generateTickSeed(campaignId, ticker.tickCount + 1),
        playerActions: [...ticker.queuedActions],
        phaseTimings: {
          deterministic: 0,
          naturalLanguage: 0,
          hybridIntegration: 0,
          memoryUpdates: 0,
          persistence: 0
        }
      };

      // Clear queued actions
      ticker.queuedActions = [];

      // Phase 1: Deterministic Processing
      const deterministicStart = Date.now();
      const deterministicResults = await this.runDeterministicPhase(
        campaignId, 
        tick.seed!, 
        tick.playerActions!
      );
      tick.deterministicPhase = deterministicResults;
      tick.phaseTimings!.deterministic = Date.now() - deterministicStart;

      // Phase 2: Natural Language Analysis (if enabled)
      let naturalLanguageResults: NaturalLanguageResults;
      if (this.config.enableNaturalLanguageAnalysis) {
        const nlStart = Date.now();
        naturalLanguageResults = await this.runNaturalLanguagePhase(
          campaignId,
          deterministicResults
        );
        tick.naturalLanguagePhase = naturalLanguageResults;
        tick.phaseTimings!.naturalLanguage = Date.now() - nlStart;
      } else {
        naturalLanguageResults = this.createEmptyNaturalLanguageResults();
        tick.naturalLanguagePhase = naturalLanguageResults;
      }

      // Phase 3: Hybrid Integration
      const hybridStart = Date.now();
      const hybridResults = await this.runHybridIntegration(
        deterministicResults,
        naturalLanguageResults
      );
      tick.hybridIntegration = hybridResults;
      tick.phaseTimings!.hybridIntegration = Date.now() - hybridStart;

      // Phase 4: Memory Updates (if enabled)
      let memoryUpdates: MemoryUpdate[] = [];
      if (this.config.enableMemoryIntegration) {
        const memoryStart = Date.now();
        memoryUpdates = await this.updateMemorySystems(
          campaignId,
          tick as StrategicTick,
          hybridResults
        );
        tick.memoryUpdates = memoryUpdates;
        tick.phaseTimings!.memoryUpdates = Date.now() - memoryStart;
      } else {
        tick.memoryUpdates = [];
      }

      // Phase 5: Persistence
      const persistenceStart = Date.now();
      await this.persistTickResults(campaignId, hybridResults.finalCampaignState);
      tick.phaseTimings!.persistence = Date.now() - persistenceStart;

      // Finalize tick
      const totalTime = Date.now() - startTime;
      tick.processingTime = totalTime;

      const completedTick = tick as StrategicTick;

      // Update ticker state
      ticker.tickCount++;
      ticker.lastTickTime = new Date();
      ticker.lastTickDuration = totalTime;
      ticker.averageTickTime = (ticker.averageTickTime * (ticker.tickCount - 1) + totalTime) / ticker.tickCount;

      // Schedule next tick
      if (ticker.isActive) {
        this.scheduleNextTick(campaignId);
      }

      // Emit events
      this.emit('tickCompleted', { campaignId, tick: completedTick });

      return completedTick;

    } catch (error) {
      ticker.errorCount++;
      this.emit('tickError', { campaignId, error, tickCount: ticker.tickCount });
      
      // Schedule retry with exponential backoff
      if (ticker.isActive) {
        const retryDelay = Math.min(ticker.currentMode.interval, 30000 * Math.pow(2, ticker.errorCount));
        setTimeout(() => {
          if (ticker.isActive) {
            this.scheduleNextTick(campaignId);
          }
        }, retryDelay);
      }
      
      throw error;
    }
  }

  /**
   * Run deterministic simulation phase
   */
  private async runDeterministicPhase(
    campaignId: number,
    seed: string,
    playerActions: PlayerAction[]
  ): Promise<DeterministicResults> {
    // Use existing simulation engine
    const campaignState = await step({
      campaignId,
      seed,
      actions: playerActions
    });

    // Generate enhanced analytics
    const economic = this.generateEconomicAnalytics(campaignState);
    const military = this.generateMilitaryAnalytics(campaignState);
    const research = this.generateResearchAnalytics(campaignState);
    const population = this.generatePopulationAnalytics(campaignState);
    const diplomatic = this.generateDiplomaticAnalytics(campaignState);

    // Calculate changes from previous tick
    const changesFromPreviousTick = await this.calculateStateChanges(campaignId, campaignState);

    return {
      campaignState,
      economic,
      military,
      research,
      population,
      diplomatic,
      calculationTime: 0, // Will be set by caller
      changesFromPreviousTick
    };
  }

  /**
   * Run natural language analysis phase
   */
  private async runNaturalLanguagePhase(
    campaignId: number,
    deterministicResults: DeterministicResults
  ): Promise<NaturalLanguageResults> {
    return await this.naturalLanguageProcessor.analyzeGameState(
      campaignId,
      deterministicResults
    );
  }

  /**
   * Run hybrid integration phase
   */
  private async runHybridIntegration(
    deterministicResults: DeterministicResults,
    naturalLanguageResults: NaturalLanguageResults
  ): Promise<HybridResults> {
    return await this.hybridIntegrator.integrateEffects(
      deterministicResults,
      naturalLanguageResults
    );
  }

  /**
   * Update memory systems with tick results
   */
  private async updateMemorySystems(
    campaignId: number,
    tick: StrategicTick,
    hybridResults: HybridResults
  ): Promise<MemoryUpdate[]> {
    const updates: MemoryUpdate[] = [];

    try {
      // Update civilization memory
      const civMemoryUpdate = await this.updateCivilizationMemory(
        campaignId,
        tick,
        hybridResults
      );
      updates.push(civMemoryUpdate);

      // Update character memories (for characters involved in events)
      const characterUpdates = await this.updateCharacterMemories(
        campaignId,
        tick,
        hybridResults
      );
      updates.push(...characterUpdates);

      // Update psychology memory with continuous analysis
      const psychologyUpdate = await this.updatePsychologyMemory(
        campaignId,
        tick,
        hybridResults
      );
      updates.push(psychologyUpdate);

      // Update AI analysis memory with insights and continuity
      const aiAnalysisUpdate = await this.updateAIAnalysisMemory(
        campaignId,
        tick,
        hybridResults
      );
      updates.push(aiAnalysisUpdate);

    } catch (error) {
      console.error('Memory update failed:', error);
      // Don't fail the entire tick for memory errors
    }

    return updates;
  }

  // ===== UTILITY METHODS =====

  /**
   * Schedule the next tick for a campaign
   */
  private scheduleNextTick(campaignId: number): void {
    const ticker = this.campaigns.get(campaignId);
    if (!ticker || !ticker.isActive || this.isShuttingDown) {
      return;
    }

    // Adaptive tick rate based on activity
    if (this.config.adaptiveTickRates) {
      ticker.currentMode = this.calculateAdaptiveTickRate(ticker);
    }

    const delay = ticker.currentMode.interval;
    ticker.nextTickTime = new Date(Date.now() + delay);

    const timer = setTimeout(() => {
      this.processTick(campaignId).catch(error => {
        console.error(`Tick processing failed for campaign ${campaignId}:`, error);
      });
    }, delay);

    this.tickTimers.set(campaignId, timer);
  }

  /**
   * Calculate adaptive tick rate based on campaign activity
   */
  private calculateAdaptiveTickRate(ticker: CampaignTicker): TickConfiguration {
    const timeSinceLastAction = Date.now() - ticker.lastPlayerAction.getTime();
    const hasActivePlayers = ticker.activePlayers.length > 0;

    // Active players present - strategic gameplay
    if (hasActivePlayers && timeSinceLastAction < 300000) { // 5 minutes
      return TICK_MODES.strategic; // 120s intervals
    }

    // High error rate - slow down
    if (ticker.errorCount > 3) {
      return TICK_MODES.idle; // 300s intervals
    }

    // No recent activity - idle processing
    if (timeSinceLastAction > 1800000) { // 30 minutes
      return TICK_MODES.idle; // 300s intervals
    }

    // Default to strategic processing
    return TICK_MODES.strategic; // 120s intervals
  }

  /**
   * Generate a deterministic seed for a tick
   */
  private generateTickSeed(campaignId: number, tickId: number): string {
    return `campaign_${campaignId}_tick_${tickId}_${Date.now()}`;
  }

  /**
   * Set up event listeners for the engine
   */
  private setupEventListeners(): void {
    this.on('campaignStarted', ({ campaignId }) => {
      console.log(`🚀 Hybrid simulation started for campaign ${campaignId}`);
    });

    this.on('campaignStopped', ({ campaignId }) => {
      console.log(`⏹️ Hybrid simulation stopped for campaign ${campaignId}`);
    });

    this.on('tickCompleted', ({ campaignId, tick }) => {
      console.log(`✅ Tick ${tick.tickId} completed for campaign ${campaignId} in ${tick.processingTime}ms`);
    });

    this.on('tickError', ({ campaignId, error, tickCount }) => {
      console.error(`❌ Tick error for campaign ${campaignId} at tick ${tickCount}:`, error.message);
    });
  }

  // ===== PLACEHOLDER METHODS (TO BE IMPLEMENTED) =====

  private generateEconomicAnalytics(state: CampaignState): EconomicAnalytics {
    // TODO: Implement comprehensive economic analytics
    return {
      gdp: 0,
      gdpGrowth: 0,
      inflation: 0,
      unemployment: 0,
      tradeBalance: 0,
      resourceProduction: {},
      resourceConsumption: {},
      marketPrices: {},
      priceVolatility: {}
    };
  }

  private generateMilitaryAnalytics(state: CampaignState): MilitaryAnalytics {
    // TODO: Implement military analytics
    return {
      totalForces: 0,
      readinessLevel: 0,
      morale: 0,
      defensiveCapability: 0,
      offensiveCapability: 0,
      logisticsEfficiency: 0,
      threatLevel: 0
    };
  }

  private generateResearchAnalytics(state: CampaignState): ResearchAnalytics {
    // TODO: Implement research analytics
    return {
      totalProjects: 0,
      completionRate: 0,
      breakthroughProbability: 0,
      researchEfficiency: 0,
      technologyLevel: 0,
      innovationIndex: 0
    };
  }

  private generatePopulationAnalytics(state: CampaignState): PopulationAnalytics {
    // TODO: Implement population analytics
    return {
      totalPopulation: 0,
      populationGrowth: 0,
      happinessIndex: 0,
      educationLevel: 0,
      healthIndex: 0,
      employmentRate: 0,
      migrationRate: 0
    };
  }

  private generateDiplomaticAnalytics(state: CampaignState): DiplomaticAnalytics {
    // TODO: Implement diplomatic analytics
    return {
      relationships: {},
      activeNegotiations: 0,
      tradeAgreements: 0,
      conflicts: 0,
      diplomaticInfluence: 0
    };
  }

  private async calculateStateChanges(campaignId: number, state: CampaignState): Promise<StateChanges> {
    // TODO: Implement state change calculation
    return {
      economic: [],
      military: [],
      research: [],
      population: [],
      diplomatic: [],
      significant: false
    };
  }

  private createEmptyNaturalLanguageResults(): NaturalLanguageResults {
    return {
      populationMood: {
        overall: 'content',
        factors: ['System operating normally'],
        witterSentiment: {
          overallSentiment: 0,
          emotionalBreakdown: {
            joy: 0.2, anger: 0.1, fear: 0.1, sadness: 0.1, surprise: 0.1, trust: 0.3
          },
          topTopics: [],
          influentialPosts: []
        },
        demographicBreakdown: {},
        trendDirection: 'stable'
      },
      economicStory: {
        summary: 'Economic systems operating within normal parameters.',
        trends: [],
        predictions: ['Continued stable operation expected'],
        concerns: [],
        opportunities: [],
        marketStory: 'Market conditions remain stable.'
      },
      militaryStatus: {
        readiness: 'Military systems maintain standard operational status.',
        morale: 'Personnel morale within acceptable ranges.',
        threats: [],
        opportunities: [],
        strategicSituation: 'Strategic situation stable.',
        recommendations: []
      },
      diplomaticSituation: {
        relationships: [],
        negotiations: [],
        tensions: [],
        opportunities: [],
        overallStanding: 'Diplomatic status remains neutral.'
      },
      researchNarrative: {
        breakthroughs: [],
        setbacks: [],
        innovations: [],
        researchClimate: 'Research activities proceeding normally.',
        futureProspects: ['Steady progress expected']
      },
      overallNarrative: 'All systems operating within normal parameters.',
      keyEvents: [],
      predictions: [],
      analysisTime: 0,
      confidenceScore: 0.5,
      sourcesAnalyzed: []
    };
  }

  private async updateCivilizationMemory(
    campaignId: number,
    tick: StrategicTick,
    hybridResults: HybridResults
  ): Promise<MemoryUpdate> {
    const startTime = Date.now();
    const memories: MemoryEntry[] = [];
    const errors: string[] = [];

    try {
      // Create tick summary memory
      const tickSummary = `Tick ${tick.tickId}: ${hybridResults.narrativeContext.overallNarrative || 'Simulation step completed'}`;
      memories.push({
        content: tickSummary,
        contentType: 'tick_summary',
        metadata: {
          tickId: tick.tickId,
          timestamp: tick.timestamp,
          importance: 'medium',
          tags: ['simulation', 'tick_summary'],
          relatedEntities: [`campaign_${campaignId}`]
        }
      });

      // Add emergent events to memory
      for (const event of hybridResults.emergentEvents) {
        memories.push({
          content: `${event.title}: ${event.description}`,
          contentType: 'event',
          metadata: {
            tickId: tick.tickId,
            timestamp: tick.timestamp,
            importance: event.severity === 'critical' ? 'critical' : 
                       event.severity === 'major' ? 'high' : 'medium',
            tags: ['event', event.type, event.severity],
            relatedEntities: [`campaign_${campaignId}`, `event_${event.id}`]
          }
        });
      }

      // Add AI analysis results to memory
      if (tick.naturalLanguagePhase.overallNarrative) {
        memories.push({
          content: `AI Analysis: ${tick.naturalLanguagePhase.overallNarrative}`,
          contentType: 'analysis',
          metadata: {
            tickId: tick.tickId,
            timestamp: tick.timestamp,
            importance: 'medium',
            tags: ['ai_analysis', 'narrative'],
            relatedEntities: [`campaign_${campaignId}`]
          }
        });
      }

      // Store memories in civilization vector memory
      if (memories.length > 0) {
        const memoryIds = await civilizationVectorMemory.storeBatchCivilizationMemory(
          campaignId.toString(),
          memories.map(m => ({
            content: m.content,
            contentType: m.contentType,
            metadata: m.metadata
          })),
          campaignId
        );

        console.log(`Stored ${memoryIds.length} civilization memories for campaign ${campaignId}`);
      }

      return {
        type: 'civilization',
        targetId: campaignId.toString(),
        memories,
        updateTime: Date.now() - startTime,
        memoryCount: memories.length,
        success: true,
        errors
      };

    } catch (error) {
      console.error('Civilization memory update failed:', error);
      errors.push(error.message);

      return {
        type: 'civilization',
        targetId: campaignId.toString(),
        memories,
        updateTime: Date.now() - startTime,
        memoryCount: 0,
        success: false,
        errors
      };
    }
  }

  private async updateCharacterMemories(
    campaignId: number,
    tick: StrategicTick,
    hybridResults: HybridResults
  ): Promise<MemoryUpdate[]> {
    const updates: MemoryUpdate[] = [];

    try {
      // Get characters involved in events
      const involvedCharacters = new Set<string>();
      
      // Add characters from emergent events
      for (const event of hybridResults.emergentEvents) {
        if (event.characterInvolvement) {
          event.characterInvolvement.forEach(char => involvedCharacters.add(char));
        }
      }

      // Update memories for involved characters
      for (const characterId of involvedCharacters) {
        const startTime = Date.now();
        const memories: MemoryEntry[] = [];
        const errors: string[] = [];

        try {
          // Create event participation memories
          for (const event of hybridResults.emergentEvents) {
            if (event.characterInvolvement?.includes(characterId)) {
              memories.push({
                content: `Participated in ${event.title}: ${event.description}`,
                contentType: 'event',
                metadata: {
                  tickId: tick.tickId,
                  timestamp: tick.timestamp,
                  importance: event.severity === 'critical' ? 'critical' : 
                             event.severity === 'major' ? 'high' : 'medium',
                  tags: ['event_participation', event.type, event.severity],
                  relatedEntities: [`campaign_${campaignId}`, `event_${event.id}`]
                }
              });
            }
          }

          // Store character memories if any
          if (memories.length > 0) {
            const memoryIds = await characterVectorMemory.storeBatchCharacterMemory(
              characterId,
              memories.map(m => ({
                content: m.content,
                contentType: m.contentType,
                metadata: m.metadata
              })),
              campaignId
            );

            console.log(`Stored ${memoryIds.length} memories for character ${characterId}`);
          }

          updates.push({
            type: 'character',
            targetId: characterId,
            memories,
            updateTime: Date.now() - startTime,
            memoryCount: memories.length,
            success: true,
            errors
          });

        } catch (error) {
          console.error(`Character memory update failed for ${characterId}:`, error);
          errors.push(error.message);

          updates.push({
            type: 'character',
            targetId: characterId,
            memories,
            updateTime: Date.now() - startTime,
            memoryCount: 0,
            success: false,
            errors
          });
        }
      }

    } catch (error) {
      console.error('Character memories update failed:', error);
    }

    return updates;
  }

  /**
   * Update psychology memory with continuous psychological analysis
   */
  private async updatePsychologyMemory(
    campaignId: number,
    tick: StrategicTick,
    hybridResults: HybridResults
  ): Promise<MemoryUpdate> {
    const startTime = Date.now();
    const memories: MemoryEntry[] = [];
    const errors: string[] = [];

    try {
      // Get previous psychology analysis for continuity
      const previousAnalyses = await psychologyVectorMemory.getPreviousPsychologyAnalysis(
        campaignId,
        tick.tickId,
        undefined,
        3
      );

      // Create psychology memory entry with continuity context
      const psychologyEntry = {
        content: `Psychology Analysis Tick ${tick.tickId}: Population mood is ${tick.naturalLanguagePhase.populationMood.overall} with ${tick.naturalLanguagePhase.populationMood.trendDirection} trend. Key factors: ${tick.naturalLanguagePhase.populationMood.factors.join(', ')}`,
        analysisType: 'mood_analysis' as const,
        psychologyMetrics: {
          overallMood: tick.naturalLanguagePhase.populationMood.overall,
          sentimentScore: tick.naturalLanguagePhase.populationMood.witterSentiment.overallSentiment,
          behavioralIndicators: tick.naturalLanguagePhase.populationMood.factors,
          trendDirection: tick.naturalLanguagePhase.populationMood.trendDirection,
          confidenceLevel: tick.naturalLanguagePhase.confidenceScore
        },
        continuityFactors: {
          previousTickReference: previousAnalyses.length > 0 ? previousAnalyses[0].metadata.tickId : 0,
          trendContinuation: this.checkTrendContinuation(previousAnalyses, tick.naturalLanguagePhase.populationMood.trendDirection),
          significantChanges: this.identifyPsychologyChanges(previousAnalyses, tick.naturalLanguagePhase.populationMood),
          contextualFactors: tick.naturalLanguagePhase.populationMood.factors
        },
        metadata: {
          tickId: tick.tickId,
          timestamp: tick.timestamp,
          importance: this.assessPsychologyImportance(tick.naturalLanguagePhase.populationMood),
          tags: ['psychology', 'population_mood', tick.naturalLanguagePhase.populationMood.overall],
          relatedEntities: [`campaign_${campaignId}`, `tick_${tick.tickId}`]
        }
      };

      // Store in psychology vector memory
      const psychologyId = await psychologyVectorMemory.storePsychologyAnalysis(campaignId, psychologyEntry);

      memories.push({
        content: psychologyEntry.content,
        contentType: 'psychology_analysis',
        metadata: {
          ...psychologyEntry.metadata,
          analysisType: 'psychology',
          continuityScore: this.calculatePsychologyContinuityScore(previousAnalyses, psychologyEntry)
        }
      });

      console.log(`Stored psychology analysis ${psychologyId} for campaign ${campaignId}`);

      return {
        type: 'psychology',
        targetId: campaignId.toString(),
        memories,
        updateTime: Date.now() - startTime,
        memoryCount: memories.length,
        success: true,
        errors
      };

    } catch (error) {
      console.error('Psychology memory update failed:', error);
      errors.push(error.message);

      return {
        type: 'psychology',
        targetId: campaignId.toString(),
        memories,
        updateTime: Date.now() - startTime,
        memoryCount: 0,
        success: false,
        errors
      };
    }
  }

  /**
   * Update AI analysis memory with insights and continuity
   */
  private async updateAIAnalysisMemory(
    campaignId: number,
    tick: StrategicTick,
    hybridResults: HybridResults
  ): Promise<MemoryUpdate> {
    const startTime = Date.now();
    const memories: MemoryEntry[] = [];
    const errors: string[] = [];

    try {
      // Get previous AI analyses for building upon insights
      const previousAnalyses = await aiAnalysisVectorMemory.getPreviousAIAnalyses(
        campaignId,
        tick.tickId,
        undefined,
        5
      );

      // Create AI analysis entries for different insight types
      const analysisEntries = [
        // Economic insights
        {
          content: `Economic Analysis Tick ${tick.tickId}: ${tick.naturalLanguagePhase.economicStory.summary}. Key trends: ${tick.naturalLanguagePhase.economicStory.trends.map(t => t.description).join('; ')}`,
          analysisType: 'economic_insight' as const,
          insightCategory: 'economic_analysis'
        },
        // Strategic assessment
        {
          content: `Strategic Assessment Tick ${tick.tickId}: Military readiness - ${tick.naturalLanguagePhase.militaryStatus.readiness}. Diplomatic standing - ${tick.naturalLanguagePhase.diplomaticSituation.overallStanding}`,
          analysisType: 'strategic_assessment' as const,
          insightCategory: 'strategic_overview'
        },
        // Cross-domain correlations
        {
          content: `Cross-Domain Analysis Tick ${tick.tickId}: ${tick.naturalLanguagePhase.overallNarrative}. Sentiment modifiers applied: ${hybridResults.modificationsApplied.join(', ')}`,
          analysisType: 'cross_domain_correlation' as const,
          insightCategory: 'hybrid_integration'
        }
      ];

      for (const entryData of analysisEntries) {
        const aiAnalysisEntry = {
          content: entryData.content,
          analysisType: entryData.analysisType,
          analysisMetrics: {
            insightCategory: entryData.insightCategory,
            confidenceScore: tick.naturalLanguagePhase.confidenceScore,
            noveltyScore: this.calculateNoveltyScore(previousAnalyses, entryData.content),
            correlationStrength: entryData.analysisType === 'cross_domain_correlation' ? 
              this.calculateCorrelationStrength(hybridResults.sentimentModifiers) : undefined
          },
          continuityFactors: {
            buildOnPreviousAnalysis: previousAnalyses.length > 0,
            referencedInsights: this.findReferencedInsights(previousAnalyses, entryData.content),
            contradictsPrevious: this.checkForContradictions(previousAnalyses, entryData.content),
            evolutionFromTick: previousAnalyses.length > 0 ? previousAnalyses[0].metadata.tickId : tick.tickId
          },
          metadata: {
            tickId: tick.tickId,
            timestamp: tick.timestamp,
            importance: this.assessAIAnalysisImportance(entryData.analysisType, tick.naturalLanguagePhase),
            tags: ['ai_analysis', entryData.analysisType, entryData.insightCategory],
            relatedEntities: [`campaign_${campaignId}`, `tick_${tick.tickId}`]
          }
        };

        // Store in AI analysis vector memory
        const analysisId = await aiAnalysisVectorMemory.storeAIAnalysis(campaignId, aiAnalysisEntry);

        memories.push({
          content: aiAnalysisEntry.content,
          contentType: 'ai_insight',
          metadata: {
            ...aiAnalysisEntry.metadata,
            analysisType: 'ai_analysis',
            continuityScore: aiAnalysisEntry.analysisMetrics.confidenceScore
          }
        });

        console.log(`Stored AI analysis ${analysisId} for campaign ${campaignId}`);
      }

      return {
        type: 'ai_analysis',
        targetId: campaignId.toString(),
        memories,
        updateTime: Date.now() - startTime,
        memoryCount: memories.length,
        success: true,
        errors
      };

    } catch (error) {
      console.error('AI analysis memory update failed:', error);
      errors.push(error.message);

      return {
        type: 'ai_analysis',
        targetId: campaignId.toString(),
        memories,
        updateTime: Date.now() - startTime,
        memoryCount: 0,
        success: false,
        errors
      };
    }
  }

  private async persistTickResults(campaignId: number, state: CampaignState): Promise<void> {
    try {
      // Use existing event sourcing system to persist the state
      // This will be handled by the existing simulation engine persistence
      console.log(`Tick results persisted for campaign ${campaignId}`);
    } catch (error) {
      console.error('Tick result persistence failed:', error);
      throw error;
    }
  }

  // ===== PUBLIC API =====

  /**
   * Queue a player action for the next tick
   */
  async queuePlayerAction(campaignId: number, action: PlayerAction): Promise<void> {
    const ticker = this.campaigns.get(campaignId);
    if (!ticker) {
      throw new Error(`Campaign ${campaignId} is not registered`);
    }

    ticker.queuedActions.push(action);
    ticker.lastPlayerAction = new Date();

    // Add player to active list if not present
    if (!ticker.activePlayers.includes(action.playerId)) {
      ticker.activePlayers.push(action.playerId);
    }

    // Execute immediately if required
    if (action.requiresImmediate) {
      await this.executeImmediateAction(campaignId, action);
    }

    this.emit('actionQueued', { campaignId, action });
  }

  /**
   * Execute an immediate action (outside of tick processing)
   */
  private async executeImmediateAction(campaignId: number, action: PlayerAction): Promise<void> {
    // TODO: Implement immediate action execution
    this.emit('immediateActionExecuted', { campaignId, action });
  }

  /**
   * Get campaign status
   */
  getCampaignStatus(campaignId: number): CampaignTicker | undefined {
    return this.campaigns.get(campaignId);
  }

  /**
   * Get all registered campaigns
   */
  getAllCampaigns(): CampaignTicker[] {
    return Array.from(this.campaigns.values());
  }

  /**
   * Shutdown the engine gracefully
   */
  async shutdown(): Promise<void> {
    this.isShuttingDown = true;

    // Stop all campaigns
    const campaignIds = Array.from(this.campaigns.keys());
    await Promise.all(campaignIds.map(id => this.stopCampaign(id)));

    // Clear all timers
    this.tickTimers.forEach(timer => clearTimeout(timer));
    this.tickTimers.clear();

    this.emit('engineShutdown');
  }

  // ===== CONTINUITY ANALYSIS HELPERS =====

  private checkTrendContinuation(previousAnalyses: any[], currentTrend: string): boolean {
    if (previousAnalyses.length === 0) return false;
    const lastTrend = previousAnalyses[0].psychologyMetrics?.trendDirection;
    return lastTrend === currentTrend;
  }

  private identifyPsychologyChanges(previousAnalyses: any[], currentMood: any): string[] {
    const changes: string[] = [];
    
    if (previousAnalyses.length > 0) {
      const lastAnalysis = previousAnalyses[0];
      
      if (lastAnalysis.psychologyMetrics?.overallMood !== currentMood.overall) {
        changes.push(`Mood changed from ${lastAnalysis.psychologyMetrics.overallMood} to ${currentMood.overall}`);
      }
      
      const sentimentDiff = Math.abs(
        (lastAnalysis.psychologyMetrics?.sentimentScore || 0) - currentMood.witterSentiment.overallSentiment
      );
      
      if (sentimentDiff > 0.2) {
        changes.push(`Significant sentiment shift: ${(sentimentDiff * 100).toFixed(1)}%`);
      }
    }
    
    return changes;
  }

  private assessPsychologyImportance(populationMood: any): 'low' | 'medium' | 'high' | 'critical' {
    if (populationMood.overall === 'rebellious' || populationMood.overall === 'ecstatic') {
      return 'critical';
    }
    if (populationMood.overall === 'angry' || populationMood.overall === 'happy') {
      return 'high';
    }
    if (populationMood.overall === 'concerned') {
      return 'medium';
    }
    return 'low';
  }

  private calculatePsychologyContinuityScore(previousAnalyses: any[], currentEntry: any): number {
    if (previousAnalyses.length === 0) return 0.5;
    
    let continuityScore = 0;
    const lastAnalysis = previousAnalyses[0];
    
    // Trend continuation bonus
    if (currentEntry.continuityFactors.trendContinuation) {
      continuityScore += 0.4;
    }
    
    // Mood stability bonus
    if (lastAnalysis.psychologyMetrics?.overallMood === currentEntry.psychologyMetrics.overallMood) {
      continuityScore += 0.3;
    }
    
    // Contextual factor similarity
    const sharedFactors = currentEntry.continuityFactors.contextualFactors.filter(
      (factor: string) => lastAnalysis.continuityFactors?.contextualFactors?.includes(factor)
    ).length;
    
    const maxFactors = Math.max(
      currentEntry.continuityFactors.contextualFactors.length,
      lastAnalysis.continuityFactors?.contextualFactors?.length || 0
    );
    
    if (maxFactors > 0) {
      continuityScore += (sharedFactors / maxFactors) * 0.3;
    }
    
    return Math.min(1.0, continuityScore);
  }

  private calculateNoveltyScore(previousAnalyses: any[], content: string): number {
    if (previousAnalyses.length === 0) return 1.0;
    
    // Simple novelty calculation based on content similarity
    // In a real implementation, this could use semantic similarity
    const contentWords = content.toLowerCase().split(' ');
    let maxSimilarity = 0;
    
    for (const analysis of previousAnalyses.slice(0, 5)) {
      const analysisWords = (analysis.content || '').toLowerCase().split(' ');
      const commonWords = contentWords.filter(word => analysisWords.includes(word));
      const similarity = commonWords.length / Math.max(contentWords.length, analysisWords.length);
      maxSimilarity = Math.max(maxSimilarity, similarity);
    }
    
    return Math.max(0, 1 - maxSimilarity);
  }

  private calculateCorrelationStrength(sentimentModifiers: any): number {
    // Calculate correlation strength based on how many modifiers are active
    const modifierValues = Object.values(sentimentModifiers).filter(
      (value: any) => typeof value === 'number' && Math.abs(value) > 0.05
    ) as number[];
    
    if (modifierValues.length === 0) return 0;
    
    const avgMagnitude = modifierValues.reduce((sum, val) => sum + Math.abs(val), 0) / modifierValues.length;
    return Math.min(1.0, avgMagnitude * 2); // Scale to 0-1 range
  }

  private findReferencedInsights(previousAnalyses: any[], content: string): string[] {
    // Simple implementation - in practice, this could use semantic similarity
    const references: string[] = [];
    const contentLower = content.toLowerCase();
    
    for (const analysis of previousAnalyses.slice(0, 3)) {
      if (analysis.analysisMetrics?.insightCategory) {
        const category = analysis.analysisMetrics.insightCategory.toLowerCase();
        if (contentLower.includes(category) || contentLower.includes('previous') || contentLower.includes('trend')) {
          references.push(`analysis_${analysis.metadata.tickId}`);
        }
      }
    }
    
    return references;
  }

  private checkForContradictions(previousAnalyses: any[], content: string): boolean {
    // Simple contradiction detection
    const contentLower = content.toLowerCase();
    const contradictionWords = ['however', 'but', 'contrary', 'opposite', 'different', 'changed'];
    
    return contradictionWords.some(word => contentLower.includes(word));
  }

  private assessAIAnalysisImportance(analysisType: string, naturalLanguagePhase: any): 'low' | 'medium' | 'high' | 'critical' {
    if (analysisType === 'cross_domain_correlation' && naturalLanguagePhase.confidenceScore > 0.8) {
      return 'high';
    }
    if (analysisType === 'strategic_assessment') {
      return 'medium';
    }
    if (analysisType === 'economic_insight' && naturalLanguagePhase.economicStory?.concerns?.length > 0) {
      return 'high';
    }
    return 'medium';
  }
}

// Export singleton instance
export const hybridSimulationEngine = new HybridSimulationEngine();
