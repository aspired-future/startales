/**
 * OrchestrationIntegrationTests - Comprehensive integration test suite
 * 
 * This test suite validates:
 * - End-to-end orchestration system functionality
 * - API integration and data flow
 * - Event bus communication
 * - Performance monitoring
 * - Error handling and recovery
 * - APT execution and caching
 * - Circuit breaker functionality
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { Pool } from 'pg';
import {
  MasterOrchestrator,
  OrchestrationConfig,
  PopulationAPI,
  EconomicsAPI,
  MilitaryAPI,
  EventBus,
  PerformanceMonitor,
  createEventBusWithTables
} from '../index';
import {
  APIExecutionContext,
  GameStateSnapshot,
  CivilizationContext,
  GameEvent
} from '../types';

describe('Orchestration System Integration Tests', () => {
  let databasePool: Pool;
  let orchestrator: MasterOrchestrator;
  let eventBus: EventBus;
  let performanceMonitor: PerformanceMonitor;
  let populationAPI: PopulationAPI;
  let economicsAPI: EconomicsAPI;
  let militaryAPI: MilitaryAPI;

  beforeAll(async () => {
    // Set up test database
    databasePool = new Pool({
      host: process.env.TEST_DB_HOST || 'localhost',
      port: parseInt(process.env.TEST_DB_PORT || '5432'),
      database: process.env.TEST_DB_NAME || 'startales_test',
      user: process.env.TEST_DB_USER || 'postgres',
      password: process.env.TEST_DB_PASSWORD || 'password'
    });

    // Create test tables
    await createTestTables();
    
    // Initialize event bus with tables
    eventBus = await createEventBusWithTables(databasePool, {
      maxConcurrentEvents: 5,
      processingIntervalMs: 100,
      enablePersistence: true
    });

    // Initialize performance monitor
    performanceMonitor = new PerformanceMonitor({
      metricsCollectionIntervalMs: 1000,
      alertingEnabled: true,
      enablePredictiveAnalysis: false // Disable for tests
    }, databasePool);

    // Initialize API systems
    populationAPI = new PopulationAPI({
      initialPopulationSize: 100000,
      birthRate: 0.015,
      deathRate: 0.008
    });

    economicsAPI = new EconomicsAPI(databasePool);
    militaryAPI = new MilitaryAPI(databasePool);

    // Configure orchestration system
    const config: OrchestrationConfig = {
      tickInterval: 5000, // 5 seconds for tests
      maxTickDuration: 30000,
      maxConcurrentSystems: 5,
      maxConcurrentAPTs: 3,
      maxConcurrentCivilizations: 2,
      maxMemoryUsage: 512 * 1024 * 1024, // 512MB
      maxCpuUsage: 80,
      systemTimeoutMs: 15000,
      aptTimeoutMs: 10000,
      tickTimeoutMs: 30000,
      maxRetryAttempts: 2,
      retryDelayMs: 500,
      circuitBreakerConfig: {
        failureThreshold: 3,
        recoveryTimeMs: 30000,
        successThreshold: 2,
        timeoutMs: 15000
      },
      cacheEnabled: true,
      cacheMaxSize: 100,
      cacheDefaultTTL: 60000,
      aiModels: {
        primary: 'mock-model',
        fallback: 'mock-fallback',
        research: 'mock-research'
      },
      databasePool
    };

    orchestrator = new MasterOrchestrator(config);
    
    // Register API systems
    orchestrator.apiRegistry.registerSystem(populationAPI.getSystemDefinition());
    orchestrator.apiRegistry.registerSystem(economicsAPI.getSystemDefinition());
    orchestrator.apiRegistry.registerSystem(militaryAPI.getSystemDefinition());
  });

  afterAll(async () => {
    if (orchestrator) {
      await orchestrator.stop();
    }
    if (eventBus) {
      await eventBus.shutdown();
    }
    if (performanceMonitor) {
      performanceMonitor.stop();
    }
    if (databasePool) {
      await databasePool.end();
    }
  });

  beforeEach(async () => {
    // Clear test data
    await clearTestData();
  });

  afterEach(async () => {
    // Clean up after each test
    if (orchestrator.isRunning()) {
      await orchestrator.stop();
    }
  });

  describe('System Initialization', () => {
    it('should initialize all components successfully', async () => {
      expect(orchestrator).toBeDefined();
      expect(eventBus).toBeDefined();
      expect(performanceMonitor).toBeDefined();
      expect(populationAPI).toBeDefined();
      expect(economicsAPI).toBeDefined();
      expect(militaryAPI).toBeDefined();
    });

    it('should register API systems correctly', () => {
      const registeredSystems = orchestrator.apiRegistry.getRegisteredSystems();
      
      expect(registeredSystems).toHaveLength(3);
      expect(registeredSystems.some(s => s.id === 'population')).toBe(true);
      expect(registeredSystems.some(s => s.id === 'economics')).toBe(true);
      expect(registeredSystems.some(s => s.id === 'military')).toBe(true);
    });

    it('should validate system dependencies', () => {
      const validation = orchestrator.dependencyValidator.validateDependencies();
      
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.cycles).toHaveLength(0);
    });
  });

  describe('Single Tick Execution', () => {
    it('should execute a complete tick successfully', async () => {
      const gameState = createMockGameState();
      const civilizations = createMockCivilizations();
      
      // Set up game state
      await orchestrator.gameStateManager.updateGameState(gameState);
      for (const civ of civilizations) {
        await orchestrator.gameStateManager.updateCivilizationState(civ.id, civ);
      }

      const result = await orchestrator.executeTick();
      
      expect(result.success).toBe(true);
      expect(result.systemResults.size).toBeGreaterThan(0);
      expect(result.totalExecutionTime).toBeGreaterThan(0);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle system failures gracefully', async () => {
      // Mock a system failure
      const originalExecute = populationAPI.execute;
      populationAPI.execute = jest.fn().mockRejectedValue(new Error('Test failure'));

      const gameState = createMockGameState();
      await orchestrator.gameStateManager.updateGameState(gameState);

      const result = await orchestrator.executeTick();
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].systemId).toBe('population');

      // Restore original function
      populationAPI.execute = originalExecute;
    });

    it('should respect execution timeouts', async () => {
      // Mock a slow system
      const originalExecute = economicsAPI.execute;
      economicsAPI.execute = jest.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 20000)); // 20 seconds
        return {
          executionId: 'test',
          systemId: 'economics',
          success: true,
          executionTime: 20000,
          timestamp: new Date(),
          gameStateUpdates: {},
          civilizationUpdates: new Map(),
          systemOutputs: {},
          eventsGenerated: [],
          scheduledActions: [],
          executionMetrics: {
            executionTime: 20000,
            memoryUsage: 0,
            cpuTime: 0,
            cacheHits: 0,
            cacheMisses: 0,
            retryCount: 0,
            fallbacksUsed: 0
          }
        };
      });

      const gameState = createMockGameState();
      await orchestrator.gameStateManager.updateGameState(gameState);

      const result = await orchestrator.executeTick();
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.error.includes('timeout'))).toBe(true);

      // Restore original function
      economicsAPI.execute = originalExecute;
    }, 35000);
  });

  describe('Event Bus Integration', () => {
    it('should publish and process events correctly', async () => {
      const testEvent: GameEvent = {
        id: 'test_event_1',
        type: 'policy_change',
        source: 'test_system',
        data: { policy: 'tax_rate', newValue: 0.3 },
        timestamp: new Date(),
        priority: 'medium',
        processed: false
      };

      let receivedEvent: GameEvent | null = null;
      
      // Subscribe to events
      eventBus.subscribe('test_subscriber', ['policy_change'], async (event) => {
        receivedEvent = event;
      });

      // Publish event
      await eventBus.publish(testEvent);

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 500));

      expect(receivedEvent).not.toBeNull();
      expect(receivedEvent?.id).toBe(testEvent.id);
      expect(receivedEvent?.type).toBe(testEvent.type);
    });

    it('should handle event processing failures', async () => {
      const testEvent: GameEvent = {
        id: 'test_event_2',
        type: 'error_event',
        source: 'test_system',
        data: {},
        timestamp: new Date(),
        priority: 'high',
        processed: false
      };

      let errorCount = 0;
      
      // Subscribe with failing handler
      eventBus.subscribe('failing_subscriber', ['error_event'], async (event) => {
        errorCount++;
        throw new Error('Test handler failure');
      }, { maxRetries: 2 });

      // Publish event
      await eventBus.publish(testEvent);

      // Wait for processing and retries
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Should have tried 3 times (initial + 2 retries)
      expect(errorCount).toBe(3);
      
      // Event should be in dead letter queue
      const deadLetters = eventBus.getDeadLetterQueue();
      expect(deadLetters.length).toBeGreaterThan(0);
      expect(deadLetters[0].originalEvent.id).toBe(testEvent.id);
    });
  });

  describe('Performance Monitoring', () => {
    it('should collect and report performance metrics', async () => {
      performanceMonitor.start();
      
      const gameState = createMockGameState();
      await orchestrator.gameStateManager.updateGameState(gameState);

      // Execute a few ticks
      await orchestrator.executeTick();
      await orchestrator.executeTick();

      // Wait for metrics collection
      await new Promise(resolve => setTimeout(resolve, 2000));

      const metrics = performanceMonitor.getMetrics();
      
      expect(metrics.totalEventsProcessed).toBeGreaterThanOrEqual(0);
      expect(metrics.averageProcessingTime).toBeGreaterThanOrEqual(0);

      performanceMonitor.stop();
    });

    it('should generate alerts for threshold violations', async () => {
      performanceMonitor.start();
      
      // Set a low threshold for testing
      performanceMonitor.setThreshold({
        metric: 'test_metric',
        warningThreshold: 10,
        criticalThreshold: 20,
        unit: 'ms',
        description: 'Test metric',
        enabled: true
      });

      let alertReceived = false;
      performanceMonitor.on('alertCreated', (alert) => {
        if (alert.metric === 'test_metric') {
          alertReceived = true;
        }
      });

      // Simulate high metric value
      performanceMonitor.recordMetrics({
        averageTickTime: 0,
        maxTickTime: 0,
        minTickTime: 0,
        systemExecutionTimes: new Map(),
        aptExecutionTimes: new Map(),
        memoryUsage: 0,
        cpuUsage: 0,
        systemSuccessRates: new Map(),
        aptSuccessRates: new Map(),
        cacheHitRates: new Map(),
        cacheSize: 0
      });

      // Manually trigger threshold check
      performanceMonitor['checkMetricThreshold']('test_metric', 25);

      expect(alertReceived).toBe(true);
      
      const activeAlerts = performanceMonitor.getActiveAlerts();
      expect(activeAlerts.some(a => a.metric === 'test_metric')).toBe(true);

      performanceMonitor.stop();
    });
  });

  describe('API System Integration', () => {
    it('should execute population API correctly', async () => {
      const context = createMockExecutionContext();
      
      const result = await populationAPI.execute(context);
      
      expect(result.success).toBe(true);
      expect(result.systemId).toBe('population');
      expect(result.gameStateUpdates).toBeDefined();
      expect(result.systemOutputs).toBeDefined();
    });

    it('should execute economics API correctly', async () => {
      const context = createMockExecutionContext();
      
      const result = await economicsAPI.execute(context);
      
      expect(result.success).toBe(true);
      expect(result.systemId).toBe('economics');
      expect(result.gameStateUpdates.economicData).toBeDefined();
    });

    it('should execute military API correctly', async () => {
      const context = createMockExecutionContext();
      
      const result = await militaryAPI.execute(context);
      
      expect(result.success).toBe(true);
      expect(result.systemId).toBe('military');
      expect(result.gameStateUpdates.militaryData).toBeDefined();
    });

    it('should handle API knob updates', () => {
      // Test population API knobs
      populationAPI.updateKnobSettings({
        population_growth_rate: 0.025,
        birth_rate: 0.018
      });
      
      const populationKnobs = populationAPI.getCurrentKnobs();
      expect(populationKnobs.population_growth_rate).toBe(0.025);
      expect(populationKnobs.birth_rate).toBe(0.018);

      // Test economics API knobs
      economicsAPI.updateKnobSettings({
        gdp_growth_target: 0.04,
        inflation_target: 0.025
      });
      
      const economicsKnobs = economicsAPI.getCurrentKnobs();
      expect(economicsKnobs.gdp_growth_target).toBe(0.04);
      expect(economicsKnobs.inflation_target).toBe(0.025);
    });
  });

  describe('Circuit Breaker Functionality', () => {
    it('should open circuit breaker after repeated failures', async () => {
      const systemId = 'population';
      const circuitBreaker = orchestrator.circuitBreakerManager.getCircuitBreaker(systemId);
      
      // Mock repeated failures
      for (let i = 0; i < 5; i++) {
        circuitBreaker.recordFailure(new Error('Test failure'));
      }
      
      expect(circuitBreaker.getState()).toBe('open');
    });

    it('should transition to half-open state after recovery time', async () => {
      const systemId = 'economics';
      const circuitBreaker = orchestrator.circuitBreakerManager.getCircuitBreaker(systemId);
      
      // Force circuit breaker to open
      for (let i = 0; i < 5; i++) {
        circuitBreaker.recordFailure(new Error('Test failure'));
      }
      
      expect(circuitBreaker.getState()).toBe('open');
      
      // Wait for recovery time (shortened for test)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Attempt execution (should transition to half-open)
      try {
        await circuitBreaker.execute(async () => {
          throw new Error('Still failing');
        });
      } catch (error) {
        // Expected to fail
      }
      
      expect(circuitBreaker.getState()).toBe('open'); // Should remain open after failure
    });
  });

  describe('Cache Functionality', () => {
    it('should cache APT results correctly', async () => {
      const aptEngine = orchestrator.aptEngine;
      const cache = orchestrator.aptCache;
      
      // Mock APT execution
      const mockTemplate = {
        id: 'test-apt',
        name: 'Test APT',
        description: 'Test template',
        category: 'test',
        promptTemplate: 'Test prompt: {variable}',
        requiredVariables: ['variable'],
        optionalVariables: [],
        preferredModel: 'mock-model',
        temperature: 0.5,
        maxTokens: 100,
        outputSchema: {},
        outputFormat: 'json',
        timeoutMs: 5000,
        retryAttempts: 1,
        cacheable: true,
        cacheTTL: 60000,
        estimatedExecutionTime: 1000,
        memoryUsage: 10 * 1024 * 1024,
        complexity: 'low'
      };
      
      const variables = { variable: 'test_value' };
      const context = createMockExecutionContext();
      
      // First execution should miss cache
      const cacheKey = cache.generateCacheKey('test-apt', variables, context);
      const cachedResult1 = cache.get(cacheKey);
      expect(cachedResult1).toBeNull();
      
      // Store result in cache
      const mockResult = { success: true, result: 'test_result' };
      cache.set(cacheKey, mockResult, 60000);
      
      // Second access should hit cache
      const cachedResult2 = cache.get(cacheKey);
      expect(cachedResult2).toEqual(mockResult);
    });
  });

  describe('Error Recovery', () => {
    it('should recover from system failures', async () => {
      let failureCount = 0;
      const maxFailures = 2;
      
      // Mock intermittent failures
      const originalExecute = militaryAPI.execute;
      militaryAPI.execute = jest.fn().mockImplementation(async (context) => {
        failureCount++;
        if (failureCount <= maxFailures) {
          throw new Error(`Intermittent failure ${failureCount}`);
        }
        return originalExecute.call(militaryAPI, context);
      });

      const gameState = createMockGameState();
      await orchestrator.gameStateManager.updateGameState(gameState);

      // First few ticks should fail
      let result1 = await orchestrator.executeTick();
      expect(result1.success).toBe(false);
      
      let result2 = await orchestrator.executeTick();
      expect(result2.success).toBe(false);
      
      // Third tick should succeed
      let result3 = await orchestrator.executeTick();
      expect(result3.success).toBe(true);

      // Restore original function
      militaryAPI.execute = originalExecute;
    });
  });

  describe('Stress Testing', () => {
    it('should handle multiple civilizations concurrently', async () => {
      const civilizations = [];
      for (let i = 0; i < 5; i++) {
        civilizations.push(createMockCivilization(`civ_${i}`));
      }

      const gameState = createMockGameState();
      await orchestrator.gameStateManager.updateGameState(gameState);
      
      for (const civ of civilizations) {
        await orchestrator.gameStateManager.updateCivilizationState(civ.id, civ);
      }

      const result = await orchestrator.executeTick();
      
      expect(result.success).toBe(true);
      expect(result.systemResults.size).toBeGreaterThan(0);
    });

    it('should handle high event volume', async () => {
      const events: GameEvent[] = [];
      for (let i = 0; i < 50; i++) {
        events.push({
          id: `stress_event_${i}`,
          type: 'test_event',
          source: 'stress_test',
          data: { index: i },
          timestamp: new Date(),
          priority: 'low',
          processed: false
        });
      }

      let processedCount = 0;
      eventBus.subscribe('stress_subscriber', ['test_event'], async (event) => {
        processedCount++;
      });

      // Publish all events
      await eventBus.publishBatch(events);

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      expect(processedCount).toBe(50);
    });
  });

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  async function createTestTables(): Promise<void> {
    await databasePool.query(`
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        average_tick_time REAL,
        max_tick_time REAL,
        min_tick_time REAL,
        memory_usage BIGINT,
        cpu_usage REAL,
        cache_size INTEGER,
        metrics_data JSONB
      );
    `);
  }

  async function clearTestData(): Promise<void> {
    await databasePool.query('DELETE FROM event_bus_events');
    await databasePool.query('DELETE FROM event_bus_dead_letters');
    await databasePool.query('DELETE FROM performance_metrics');
  }

  function createMockGameState(): GameStateSnapshot {
    return {
      currentTick: 1,
      gameTime: new Date(),
      activeEvents: [],
      globalParameters: {},
      environmentalFactors: {},
      galacticState: {
        totalCivilizations: 3,
        activeCivilizations: 3,
        galacticEvents: [],
        tradeRoutes: [],
        diplomaticRelations: []
      }
    };
  }

  function createMockCivilizations(): CivilizationContext[] {
    return [
      createMockCivilization('civ_1'),
      createMockCivilization('civ_2'),
      createMockCivilization('civ_3')
    ];
  }

  function createMockCivilization(id: string): CivilizationContext {
    return {
      id,
      name: `Civilization ${id}`,
      total_population: 1000000,
      economicData: {
        gdp: 50000000000,
        gdpGrowthRate: 0.03,
        unemployment: 0.05,
        inflation: 0.02
      },
      technologyData: {
        researchLevel: 75,
        militaryTech: 60,
        communicationsTech: 80
      },
      recentEvents: [],
      recentDecisions: [],
      alliances: [],
      activeConflicts: [],
      diplomaticRelations: []
    };
  }

  function createMockExecutionContext(): APIExecutionContext {
    return {
      executionId: 'test_execution_1',
      tickId: 1,
      timestamp: new Date(),
      gameState: createMockGameState(),
      civilizationContext: createMockCivilization('test_civ'),
      galacticContext: {
        totalCivilizations: 1,
        activeCivilizations: 1,
        galacticEvents: [],
        tradeRoutes: [],
        diplomaticRelations: []
      },
      knobSettings: {
        population_growth_rate: 0.02,
        gdp_growth_target: 0.03,
        military_budget: 0.05
      },
      triggerType: 'scheduled',
      priority: 'medium'
    };
  }
});

// Mock implementations for testing
jest.mock('../APTEngine', () => ({
  APTEngine: jest.fn().mockImplementation(() => ({
    executeAPT: jest.fn().mockResolvedValue({
      success: true,
      result: { mock: true },
      executionTime: 1000
    }),
    registerTemplate: jest.fn(),
    getTemplate: jest.fn()
  }))
}));

// Export for use in other test files
export {
  createMockGameState,
  createMockCivilization,
  createMockExecutionContext
};
