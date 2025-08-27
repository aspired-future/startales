/**
 * MasterOrchestrator - Central coordination hub for the StarTales simulation system
 * 
 * This class orchestrates the entire simulation by:
 * - Managing tick-based execution cycles
 * - Coordinating three-tier system execution (Civilization → Inter-Civ → Galactic)
 * - Integrating all orchestration components (GameState, APIs, APTs, Fallbacks)
 * - Ensuring proper execution order and dependency resolution
 * - Monitoring performance and handling system degradation
 */

import { EventEmitter } from 'events';
import {
  IOrchestrator,
  OrchestrationConfig,
  OrchestrationStatus,
  TickExecutionPlan,
  TickExecutionResult,
  SystemDefinition,
  APIExecutionContext,
  APIExecutionResult,
  GameStateSnapshot,
  SystemHealth,
  PerformanceMetrics,
  TickPerformanceMetrics
} from './types';

import { GameStateManager } from './GameStateManager';
import { APIRegistry } from './APIRegistry';
import { ExecutionController } from './ExecutionController';
import { CircuitBreakerManager } from './CircuitBreaker';
import { DependencyValidator } from './DependencyValidator';
import { APTEngine } from './APTEngine';
import { APTCache } from './APTCache';
import { APTScheduler } from './APTScheduler';
import { FallbackManager } from './FallbackManager';

interface TickState {
  tickId: string;
  startTime: Date;
  currentPhase: 'planning' | 'tier1' | 'tier2' | 'tier3' | 'finalization' | 'completed';
  completedSystems: Set<string>;
  failedSystems: Set<string>;
  executionResults: Map<string, APIExecutionResult>;
  gameStateBefore: GameStateSnapshot | null;
  gameStateAfter: GameStateSnapshot | null;
}

export class MasterOrchestrator extends EventEmitter implements IOrchestrator {
  private config: OrchestrationConfig;
  private isRunning = false;
  private currentTick: TickState | null = null;
  private tickCounter = 0;
  private lastTickTime: Date | null = null;
  private nextTickTime: Date | null = null;
  
  // Core components
  private gameStateManager: GameStateManager;
  private apiRegistry: APIRegistry;
  private executionController: ExecutionController;
  private circuitBreakerManager: CircuitBreakerManager;
  private dependencyValidator: DependencyValidator;
  private aptEngine: APTEngine;
  private aptCache: APTCache;
  private aptScheduler: APTScheduler;
  private fallbackManager: FallbackManager;
  
  // Performance tracking
  private performanceHistory: TickPerformanceMetrics[] = [];
  private systemHealthMap: Map<string, SystemHealth> = new Map();

  constructor(config: OrchestrationConfig) {
    super();
    
    this.config = config;
    
    // Initialize core components
    this.gameStateManager = new GameStateManager(config.databasePool);
    this.apiRegistry = new APIRegistry();
    this.executionController = new ExecutionController({
      maxConcurrentExecutions: config.maxConcurrentSystems,
      maxExecutionTime: config.systemTimeoutMs,
      maxMemoryUsage: config.maxMemoryUsage,
      maxRetryAttempts: config.maxRetryAttempts
    });
    this.circuitBreakerManager = new CircuitBreakerManager(config.circuitBreakerConfig);
    this.dependencyValidator = new DependencyValidator();
    this.aptEngine = new APTEngine();
    this.aptCache = new APTCache({
      maxSize: config.cacheMaxSize,
      defaultTTL: config.cacheDefaultTTL,
      enableIntelligentTTL: true
    });
    this.aptScheduler = new APTScheduler({
      maxConcurrentExecutions: config.maxConcurrentAPTs,
      maxBatchSize: 10,
      batchTimeoutMs: 2000,
      priorityThreshold: 70,
      throttleThreshold: 20
    });
    this.fallbackManager = new FallbackManager();
    
    this.setupEventHandlers();
    this.initializeSystemHealth();
    
    console.log('🎯 Master Orchestrator initialized');
  }

  /**
   * Start the orchestration system
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Orchestrator is already running');
      return;
    }
    
    try {
      console.log('🚀 Starting Master Orchestrator...');
      
      // Validate system configuration
      await this.validateConfiguration();
      
      // Initialize game state
      await this.initializeGameState();
      
      // Start tick execution loop
      this.isRunning = true;
      this.scheduleNextTick();
      
      console.log('✅ Master Orchestrator started successfully');
      this.emit('started');
    } catch (error) {
      console.error('❌ Failed to start Master Orchestrator:', error);
      throw error;
    }
  }

  /**
   * Stop the orchestration system
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('⚠️ Orchestrator is not running');
      return;
    }
    
    try {
      console.log('🛑 Stopping Master Orchestrator...');
      
      this.isRunning = false;
      
      // Cancel any active executions
      this.executionController.cancelAllExecutions();
      
      // Clear scheduler queue
      this.aptScheduler.clearQueue();
      
      // Wait for current tick to complete if running
      if (this.currentTick && this.currentTick.currentPhase !== 'completed') {
        console.log('⏳ Waiting for current tick to complete...');
        await new Promise(resolve => {
          const checkCompletion = () => {
            if (!this.currentTick || this.currentTick.currentPhase === 'completed') {
              resolve(undefined);
            } else {
              setTimeout(checkCompletion, 100);
            }
          };
          checkCompletion();
        });
      }
      
      console.log('✅ Master Orchestrator stopped successfully');
      this.emit('stopped');
    } catch (error) {
      console.error('❌ Failed to stop Master Orchestrator:', error);
      throw error;
    }
  }

  /**
   * Execute a single tick manually
   */
  async executeTick(): Promise<TickExecutionResult> {
    if (!this.isRunning) {
      throw new Error('Orchestrator is not running');
    }
    
    const tickId = this.generateTickId();
    console.log(`🎯 Starting tick execution: ${tickId}`);
    
    // Initialize tick state
    this.currentTick = {
      tickId,
      startTime: new Date(),
      currentPhase: 'planning',
      completedSystems: new Set(),
      failedSystems: new Set(),
      executionResults: new Map(),
      gameStateBefore: null,
      gameStateAfter: null
    };
    
    try {
      // Phase 1: Planning and preparation
      await this.executePlanningPhase();
      
      // Phase 2: Tier 1 - Civilization systems (parallel)
      await this.executeTier1Phase();
      
      // Phase 3: Tier 2 - Inter-civilization systems (sequential)
      await this.executeTier2Phase();
      
      // Phase 4: Tier 3 - Galactic systems (sequential)
      await this.executeTier3Phase();
      
      // Phase 5: Finalization and state updates
      await this.executeFinalizationPhase();
      
      // Create execution result
      const result = this.createTickExecutionResult();
      
      // Update performance metrics
      this.updatePerformanceMetrics(result);
      
      // Update system health
      this.updateSystemHealth();
      
      this.currentTick.currentPhase = 'completed';
      this.lastTickTime = new Date();
      this.tickCounter++;
      
      console.log(`✅ Tick ${tickId} completed in ${result.totalExecutionTime}ms`);
      this.emit('tickCompleted', result);
      
      return result;
    } catch (error) {
      console.error(`❌ Tick ${tickId} failed:`, error);
      
      const errorResult = this.createErrorTickResult(error);
      this.emit('tickFailed', errorResult, error);
      
      return errorResult;
    } finally {
      // Schedule next tick if still running
      if (this.isRunning) {
        this.scheduleNextTick();
      }
    }
  }

  /**
   * Get current orchestration status
   */
  getStatus(): OrchestrationStatus {
    const performanceMetrics: PerformanceMetrics = {
      averageTickTime: this.calculateAverageTickTime(),
      maxTickTime: this.calculateMaxTickTime(),
      minTickTime: this.calculateMinTickTime(),
      systemExecutionTimes: this.calculateSystemExecutionTimes(),
      aptExecutionTimes: this.calculateAPTExecutionTimes(),
      memoryUsage: process.memoryUsage().heapUsed,
      cpuUsage: 0, // Would be calculated from actual CPU monitoring
      systemSuccessRates: this.calculateSystemSuccessRates(),
      aptSuccessRates: this.calculateAPTSuccessRates(),
      cacheHitRates: this.calculateCacheHitRates(),
      cacheSize: this.aptCache.getStats().totalEntries
    };
    
    return {
      running: this.isRunning,
      currentTick: this.tickCounter,
      lastTickTime: this.lastTickTime || new Date(),
      nextTickTime: this.nextTickTime || new Date(),
      systemHealth: this.systemHealthMap,
      performanceMetrics
    };
  }

  /**
   * Get detailed orchestration metrics
   */
  getDetailedMetrics(): {
    orchestrator: OrchestrationStatus;
    gameState: any;
    apiRegistry: any;
    executionController: any;
    circuitBreakers: any;
    aptEngine: any;
    aptCache: any;
    aptScheduler: any;
    fallbackManager: any;
  } {
    return {
      orchestrator: this.getStatus(),
      gameState: {}, // GameStateManager doesn't expose detailed metrics yet
      apiRegistry: {
        totalSystems: this.apiRegistry.getAllSystems().length,
        systemsByTier: {
          tier1: this.apiRegistry.getSystemsByTier(1).length,
          tier2: this.apiRegistry.getSystemsByTier(2).length,
          tier3: this.apiRegistry.getSystemsByTier(3).length
        }
      },
      executionController: this.executionController.getExecutionStatistics(),
      circuitBreakers: this.circuitBreakerManager.getSystemHealth(),
      aptEngine: this.aptEngine.getEngineStatistics(),
      aptCache: this.aptCache.getStats(),
      aptScheduler: this.aptScheduler.getStats(),
      fallbackManager: this.fallbackManager.getStats()
    };
  }

  // ============================================================================
  // PRIVATE EXECUTION PHASES
  // ============================================================================

  private async executePlanningPhase(): Promise<void> {
    console.log('📋 Phase 1: Planning and preparation');
    this.currentTick!.currentPhase = 'planning';
    
    // Get current game state
    this.currentTick!.gameStateBefore = await this.gameStateManager.getCurrentState();
    
    // Validate system dependencies
    const systems = this.apiRegistry.getAllSystems();
    this.dependencyValidator.buildDependencyGraph(systems);
    
    const validation = this.dependencyValidator.validateDependencies();
    if (!validation.valid) {
      throw new Error(`Dependency validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Update fallback manager with current system stress
    const systemLoad = this.calculateSystemLoad();
    this.fallbackManager.updateSystemStress(systemLoad, 'Tick planning phase');
    
    console.log('✅ Planning phase completed');
  }

  private async executeTier1Phase(): Promise<void> {
    console.log('🏛️ Phase 2: Tier 1 - Civilization systems (parallel)');
    this.currentTick!.currentPhase = 'tier1';
    
    const tier1Systems = this.apiRegistry.getSystemsByTier(1);
    const civilizations = Array.from(this.currentTick!.gameStateBefore!.civilizations.keys());
    
    // Execute civilization systems in parallel for each civilization
    const executionPromises: Promise<void>[] = [];
    
    for (const civId of civilizations) {
      for (const system of tier1Systems) {
        const promise = this.executeSystemForCivilization(system, civId);
        executionPromises.push(promise);
      }
    }
    
    // Wait for all parallel executions to complete
    await Promise.allSettled(executionPromises);
    
    console.log(`✅ Tier 1 phase completed (${tier1Systems.length} systems × ${civilizations.length} civs)`);
  }

  private async executeTier2Phase(): Promise<void> {
    console.log('🤝 Phase 3: Tier 2 - Inter-civilization systems (sequential)');
    this.currentTick!.currentPhase = 'tier2';
    
    const tier2Systems = this.apiRegistry.getSystemsByTier(2);
    
    // Execute inter-civilization systems sequentially
    for (const system of tier2Systems) {
      await this.executeInterCivilizationSystem(system);
    }
    
    console.log(`✅ Tier 2 phase completed (${tier2Systems.length} systems)`);
  }

  private async executeTier3Phase(): Promise<void> {
    console.log('🌌 Phase 4: Tier 3 - Galactic systems (sequential)');
    this.currentTick!.currentPhase = 'tier3';
    
    const tier3Systems = this.apiRegistry.getSystemsByTier(3);
    
    // Execute galactic systems sequentially
    for (const system of tier3Systems) {
      await this.executeGalacticSystem(system);
    }
    
    console.log(`✅ Tier 3 phase completed (${tier3Systems.length} systems)`);
  }

  private async executeFinalizationPhase(): Promise<void> {
    console.log('🎯 Phase 5: Finalization and state updates');
    this.currentTick!.currentPhase = 'finalization';
    
    // Aggregate all execution results and update game state
    const stateUpdates = this.aggregateStateUpdates();
    
    if (Object.keys(stateUpdates).length > 0) {
      await this.gameStateManager.updateState(stateUpdates);
    }
    
    // Get final game state
    this.currentTick!.gameStateAfter = await this.gameStateManager.getCurrentState();
    
    // Invalidate relevant cache entries
    this.invalidateCache();
    
    console.log('✅ Finalization phase completed');
  }

  // ============================================================================
  // PRIVATE SYSTEM EXECUTION METHODS
  // ============================================================================

  private async executeSystemForCivilization(system: SystemDefinition, civilizationId: string): Promise<void> {
    try {
      const context = await this.createExecutionContext(system, civilizationId);
      const result = await this.executeSystemWithFaultTolerance(system, context);
      
      this.currentTick!.executionResults.set(`${system.id}_${civilizationId}`, result);
      this.currentTick!.completedSystems.add(`${system.id}_${civilizationId}`);
    } catch (error) {
      console.error(`❌ Failed to execute ${system.id} for civilization ${civilizationId}:`, error);
      this.currentTick!.failedSystems.add(`${system.id}_${civilizationId}`);
    }
  }

  private async executeInterCivilizationSystem(system: SystemDefinition): Promise<void> {
    try {
      const context = await this.createExecutionContext(system);
      const result = await this.executeSystemWithFaultTolerance(system, context);
      
      this.currentTick!.executionResults.set(system.id, result);
      this.currentTick!.completedSystems.add(system.id);
    } catch (error) {
      console.error(`❌ Failed to execute inter-civ system ${system.id}:`, error);
      this.currentTick!.failedSystems.add(system.id);
    }
  }

  private async executeGalacticSystem(system: SystemDefinition): Promise<void> {
    try {
      const context = await this.createExecutionContext(system);
      const result = await this.executeSystemWithFaultTolerance(system, context);
      
      this.currentTick!.executionResults.set(system.id, result);
      this.currentTick!.completedSystems.add(system.id);
    } catch (error) {
      console.error(`❌ Failed to execute galactic system ${system.id}:`, error);
      this.currentTick!.failedSystems.add(system.id);
    }
  }

  private async executeSystemWithFaultTolerance(
    system: SystemDefinition,
    context: APIExecutionContext
  ): Promise<APIExecutionResult> {
    // Execute with circuit breaker protection
    return this.circuitBreakerManager.execute(system.id, async () => {
      return this.executionController.executeSystem(system.id, context);
    });
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async createExecutionContext(
    system: SystemDefinition,
    civilizationId?: string
  ): Promise<APIExecutionContext> {
    const gameState = this.currentTick!.gameStateBefore!;
    
    return {
      executionId: this.generateExecutionId(),
      tickId: this.currentTick!.tickId,
      timestamp: new Date(),
      triggerType: 'scheduled',
      priority: system.priority,
      gameState,
      civilizationContext: civilizationId ? gameState.civilizations.get(civilizationId) : undefined,
      systemSpecificData: {},
      knobSettings: {},
      timeoutMs: system.timeoutMs,
      retryAttempts: this.config.maxRetryAttempts,
      enableFallbacks: true,
      dependencyResults: new Map()
    };
  }

  private aggregateStateUpdates(): Partial<GameStateSnapshot> {
    const updates: any = {};
    
    // Aggregate updates from all execution results
    for (const result of this.currentTick!.executionResults.values()) {
      if (result.success && result.gameStateUpdates) {
        Object.assign(updates, result.gameStateUpdates);
      }
    }
    
    // Update tick counter
    updates.currentTick = this.tickCounter + 1;
    
    return updates;
  }

  private invalidateCache(): void {
    const systemChanges = Array.from(this.currentTick!.completedSystems);
    
    this.aptCache.invalidate({
      systemChanges,
      customTriggers: ['tick_completion']
    });
  }

  private createTickExecutionResult(): TickExecutionResult {
    const endTime = new Date();
    const totalTime = endTime.getTime() - this.currentTick!.startTime.getTime();
    
    return {
      tickId: this.currentTick!.tickId,
      success: this.currentTick!.failedSystems.size === 0,
      totalExecutionTime: totalTime,
      systemResults: this.currentTick!.executionResults,
      aptResults: new Map(), // Would be populated from APT executions
      gameStateBefore: this.currentTick!.gameStateBefore!,
      gameStateAfter: this.currentTick!.gameStateAfter!,
      performanceMetrics: this.calculateTickPerformanceMetrics(totalTime),
      eventsGenerated: [],
      scheduledActions: [],
      errors: [],
      warnings: []
    };
  }

  private createErrorTickResult(error: Error): TickExecutionResult {
    const endTime = new Date();
    const totalTime = endTime.getTime() - this.currentTick!.startTime.getTime();
    
    return {
      tickId: this.currentTick!.tickId,
      success: false,
      totalExecutionTime: totalTime,
      systemResults: this.currentTick!.executionResults,
      aptResults: new Map(),
      gameStateBefore: this.currentTick!.gameStateBefore!,
      gameStateAfter: this.currentTick!.gameStateBefore!, // No changes on error
      performanceMetrics: this.calculateTickPerformanceMetrics(totalTime),
      eventsGenerated: [],
      scheduledActions: [],
      errors: [{
        systemId: 'orchestrator',
        error: error.message,
        timestamp: new Date(),
        severity: 'critical',
        recoverable: true
      }],
      warnings: []
    };
  }

  private calculateTickPerformanceMetrics(totalTime: number): TickPerformanceMetrics {
    return {
      totalTime,
      tier1Time: 0, // Would be calculated from actual phase timings
      tier2Time: 0,
      tier3Time: 0,
      systemTimes: new Map(),
      aptTimes: new Map(),
      memoryPeak: process.memoryUsage().heapUsed,
      cacheHitRate: this.aptCache.getStats().hitRate
    };
  }

  private scheduleNextTick(): void {
    if (!this.isRunning) return;
    
    this.nextTickTime = new Date(Date.now() + this.config.tickInterval);
    
    setTimeout(() => {
      if (this.isRunning) {
        this.executeTick().catch(error => {
          console.error('❌ Scheduled tick execution failed:', error);
          this.emit('error', error);
        });
      }
    }, this.config.tickInterval);
  }

  private async validateConfiguration(): Promise<void> {
    // Validate that all required components are properly configured
    const systems = this.apiRegistry.getAllSystems();
    
    if (systems.length === 0) {
      throw new Error('No systems registered in API registry');
    }
    
    const validation = this.dependencyValidator.validateDependencies();
    if (!validation.valid) {
      throw new Error(`System dependencies are invalid: ${validation.errors.join(', ')}`);
    }
  }

  private async initializeGameState(): Promise<void> {
    // Ensure game state is properly initialized
    await this.gameStateManager.getCurrentState();
  }

  private calculateSystemLoad(): number {
    const stats = this.executionController.getExecutionStatistics();
    const maxConcurrent = this.config.maxConcurrentSystems;
    
    return Math.min(1, stats.activeExecutions / maxConcurrent);
  }

  private updatePerformanceMetrics(result: TickExecutionResult): void {
    this.performanceHistory.push(result.performanceMetrics);
    
    // Keep only last 100 ticks
    if (this.performanceHistory.length > 100) {
      this.performanceHistory.shift();
    }
  }

  private updateSystemHealth(): void {
    const circuitBreakerHealth = this.circuitBreakerManager.getSystemHealth();
    
    for (const [systemId, health] of circuitBreakerHealth) {
      this.systemHealthMap.set(systemId, {
        systemId,
        status: health.state === 'CLOSED' ? 'healthy' : 
                health.state === 'HALF_OPEN' ? 'degraded' : 'failed',
        lastExecution: new Date(),
        successRate: health.healthScore / 100,
        averageExecutionTime: health.metrics.averageResponseTime,
        circuitBreakerState: {
          state: health.state as any,
          failureCount: health.metrics.failedCalls,
          lastFailureTime: health.metrics.lastFailureTime || new Date(0),
          successCount: health.metrics.successfulCalls,
          lastSuccessTime: health.metrics.lastSuccessTime || new Date(0)
        }
      });
    }
  }

  private setupEventHandlers(): void {
    // Set up event handlers for component integration
    this.circuitBreakerManager.on('stateChanged', (state, systemId) => {
      console.log(`🔌 Circuit breaker ${systemId} changed to ${state}`);
      this.emit('systemHealthChanged', systemId, state);
    });
    
    this.fallbackManager.on('fallbackSuccess', (aptId, strategy, level) => {
      console.log(`🛡️ Fallback success: ${aptId} using ${strategy} (level ${level})`);
    });
  }

  private initializeSystemHealth(): void {
    const systems = this.apiRegistry.getAllSystems();
    
    for (const system of systems) {
      this.systemHealthMap.set(system.id, {
        systemId: system.id,
        status: 'healthy',
        lastExecution: new Date(),
        successRate: 1.0,
        averageExecutionTime: system.estimatedExecutionTime,
        circuitBreakerState: {
          state: 'CLOSED',
          failureCount: 0,
          lastFailureTime: new Date(0),
          successCount: 0,
          lastSuccessTime: new Date(0)
        }
      });
    }
  }

  // Performance calculation methods (simplified implementations)
  private calculateAverageTickTime(): number {
    if (this.performanceHistory.length === 0) return 0;
    return this.performanceHistory.reduce((sum, p) => sum + p.totalTime, 0) / this.performanceHistory.length;
  }

  private calculateMaxTickTime(): number {
    if (this.performanceHistory.length === 0) return 0;
    return Math.max(...this.performanceHistory.map(p => p.totalTime));
  }

  private calculateMinTickTime(): number {
    if (this.performanceHistory.length === 0) return 0;
    return Math.min(...this.performanceHistory.map(p => p.totalTime));
  }

  private calculateSystemExecutionTimes(): Map<string, number> {
    // Would be calculated from actual execution data
    return new Map();
  }

  private calculateAPTExecutionTimes(): Map<string, number> {
    // Would be calculated from APT engine data
    return new Map();
  }

  private calculateSystemSuccessRates(): Map<string, number> {
    // Would be calculated from circuit breaker data
    return new Map();
  }

  private calculateAPTSuccessRates(): Map<string, number> {
    // Would be calculated from APT engine data
    return new Map();
  }

  private calculateCacheHitRates(): Map<string, number> {
    // Would be calculated from cache data
    return new Map();
  }

  private generateTickId(): string {
    return `tick_${this.tickCounter + 1}_${Date.now()}`;
  }

  private generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
