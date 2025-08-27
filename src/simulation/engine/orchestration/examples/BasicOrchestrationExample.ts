/**
 * Basic Orchestration Example - How to set up and use the StarTales orchestration system
 * 
 * This example demonstrates:
 * - Setting up the orchestration system
 * - Registering API systems
 * - Running tick-based simulations
 * - Monitoring system health and performance
 */

import { Pool } from 'pg';
import {
  MasterOrchestrator,
  OrchestrationConfig,
  PopulationAPI,
  EconomicsAPI
} from '../index';

/**
 * Example of how to initialize and run the StarTales orchestration system
 */
export class BasicOrchestrationExample {
  private orchestrator: MasterOrchestrator;
  private databasePool: Pool;

  constructor() {
    // Initialize database connection
    this.databasePool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'startales',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password'
    });

    // Configure orchestration system
    const config: OrchestrationConfig = {
      // Timing Configuration
      tickInterval: 30000, // 30 seconds per tick
      maxTickDuration: 60000, // 1 minute max per tick
      
      // Concurrency Configuration
      maxConcurrentSystems: 10,
      maxConcurrentAPTs: 5,
      maxConcurrentCivilizations: 4,
      
      // Resource Limits
      maxMemoryUsage: 1024 * 1024 * 1024, // 1GB
      maxCpuUsage: 80, // 80% CPU
      
      // Timeout Configuration
      systemTimeoutMs: 30000, // 30 seconds
      aptTimeoutMs: 15000, // 15 seconds
      tickTimeoutMs: 60000, // 1 minute
      
      // Retry Configuration
      maxRetryAttempts: 3,
      retryDelayMs: 1000,
      
      // Circuit Breaker Configuration
      circuitBreakerConfig: {
        failureThreshold: 5,
        recoveryTimeMs: 60000,
        successThreshold: 3,
        timeoutMs: 30000
      },
      
      // Cache Configuration
      cacheEnabled: true,
      cacheMaxSize: 1000,
      cacheDefaultTTL: 300000, // 5 minutes
      
      // AI Configuration
      aiModels: {
        primary: 'claude-3-sonnet',
        fallback: 'gpt-4',
        research: 'claude-3-sonnet'
      },
      
      // Database Configuration
      databasePool: this.databasePool
    };

    // Initialize orchestrator
    this.orchestrator = new MasterOrchestrator(config);
  }

  /**
   * Set up the orchestration system with example APIs
   */
  async setup(): Promise<void> {
    console.log('🚀 Setting up StarTales Orchestration System...');

    try {
      // Initialize API systems
      const populationAPI = new PopulationAPI({
        initialPopulationSize: 1000000,
        birthRate: 0.015,
        deathRate: 0.008,
        immigrationRate: 0.002,
        emigrationRate: 0.001
      });

      const economicsAPI = new EconomicsAPI(this.databasePool);

      // Register systems with the orchestrator
      this.orchestrator.apiRegistry.registerSystem(populationAPI.getSystemDefinition());
      this.orchestrator.apiRegistry.registerSystem(economicsAPI.getSystemDefinition());

      console.log('✅ API systems registered successfully');

      // Set up event listeners for monitoring
      this.setupEventListeners();

      console.log('✅ Orchestration system setup complete');
    } catch (error) {
      console.error('❌ Failed to set up orchestration system:', error);
      throw error;
    }
  }

  /**
   * Start the orchestration system
   */
  async start(): Promise<void> {
    console.log('🎯 Starting orchestration system...');
    
    try {
      await this.orchestrator.start();
      console.log('✅ Orchestration system started successfully');
      
      // Display initial status
      this.displayStatus();
      
      // Set up periodic status updates
      setInterval(() => {
        this.displayStatus();
      }, 60000); // Every minute
      
    } catch (error) {
      console.error('❌ Failed to start orchestration system:', error);
      throw error;
    }
  }

  /**
   * Stop the orchestration system
   */
  async stop(): Promise<void> {
    console.log('🛑 Stopping orchestration system...');
    
    try {
      await this.orchestrator.stop();
      await this.databasePool.end();
      console.log('✅ Orchestration system stopped successfully');
    } catch (error) {
      console.error('❌ Failed to stop orchestration system:', error);
      throw error;
    }
  }

  /**
   * Execute a single tick manually (for testing)
   */
  async executeSingleTick(): Promise<void> {
    console.log('🎯 Executing single tick...');
    
    try {
      const result = await this.orchestrator.executeTick();
      
      console.log(`✅ Tick completed in ${result.totalExecutionTime}ms`);
      console.log(`📊 Systems executed: ${result.systemResults.size}`);
      console.log(`📈 Events generated: ${result.eventsGenerated.length}`);
      
      if (result.errors.length > 0) {
        console.log(`⚠️ Errors: ${result.errors.length}`);
        result.errors.forEach(error => {
          console.log(`  - ${error.systemId}: ${error.error}`);
        });
      }
      
    } catch (error) {
      console.error('❌ Failed to execute tick:', error);
      throw error;
    }
  }

  /**
   * Get detailed system metrics
   */
  getMetrics(): any {
    return this.orchestrator.getDetailedMetrics();
  }

  /**
   * Display current system status
   */
  private displayStatus(): void {
    const status = this.orchestrator.getStatus();
    
    console.log('\n📊 === ORCHESTRATION STATUS ===');
    console.log(`Running: ${status.running ? '✅' : '❌'}`);
    console.log(`Current Tick: ${status.currentTick}`);
    console.log(`Last Tick: ${status.lastTickTime.toISOString()}`);
    console.log(`Next Tick: ${status.nextTickTime.toISOString()}`);
    
    console.log('\n🏥 System Health:');
    for (const [systemId, health] of status.systemHealth) {
      const statusIcon = health.status === 'healthy' ? '✅' : 
                        health.status === 'degraded' ? '⚠️' : '❌';
      console.log(`  ${statusIcon} ${systemId}: ${health.status} (${(health.successRate * 100).toFixed(1)}% success)`);
    }
    
    console.log('\n📈 Performance Metrics:');
    console.log(`  Average Tick Time: ${status.performanceMetrics.averageTickTime.toFixed(2)}ms`);
    console.log(`  Memory Usage: ${(status.performanceMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Cache Hit Rate: ${(status.performanceMetrics.cacheHitRates.get('apt') || 0 * 100).toFixed(1)}%`);
    console.log('================================\n');
  }

  /**
   * Set up event listeners for monitoring and debugging
   */
  private setupEventListeners(): void {
    // Orchestrator events
    this.orchestrator.on('started', () => {
      console.log('🎯 Orchestrator started');
    });

    this.orchestrator.on('stopped', () => {
      console.log('🛑 Orchestrator stopped');
    });

    this.orchestrator.on('tickCompleted', (result) => {
      console.log(`✅ Tick ${result.tickId} completed in ${result.totalExecutionTime}ms`);
    });

    this.orchestrator.on('tickFailed', (result, error) => {
      console.error(`❌ Tick ${result.tickId} failed:`, error.message);
    });

    this.orchestrator.on('systemHealthChanged', (systemId, status) => {
      console.log(`🏥 System ${systemId} health changed to: ${status}`);
    });

    this.orchestrator.on('error', (error) => {
      console.error('❌ Orchestrator error:', error);
    });

    // Circuit breaker events
    this.orchestrator.circuitBreakerManager.on('stateChanged', (state, systemId) => {
      console.log(`🔌 Circuit breaker for ${systemId} changed to: ${state}`);
    });

    // Fallback manager events
    this.orchestrator.fallbackManager.on('fallbackSuccess', (aptId, strategy, level) => {
      console.log(`🛡️ Fallback success: ${aptId} using ${strategy} (level ${level})`);
    });

    this.orchestrator.fallbackManager.on('fallbackFailure', (aptId, error) => {
      console.error(`🛡️ Fallback failure for ${aptId}: ${error}`);
    });

    // APT scheduler events
    this.orchestrator.aptScheduler.on('aptScheduled', (aptId, priority) => {
      console.log(`📅 APT scheduled: ${aptId} (priority: ${priority})`);
    });

    // Cache events
    this.orchestrator.aptCache.on('cacheHit', (aptId, cacheKey, accessTime) => {
      console.log(`💾 Cache hit: ${aptId} (${accessTime.toFixed(2)}ms)`);
    });

    this.orchestrator.aptCache.on('cacheInvalidated', (count, keys) => {
      console.log(`🗑️ Cache invalidated: ${count} entries`);
    });
  }
}

/**
 * Example usage function
 */
export async function runBasicExample(): Promise<void> {
  const example = new BasicOrchestrationExample();
  
  try {
    // Set up the system
    await example.setup();
    
    // Start the orchestration system
    await example.start();
    
    // Let it run for a few ticks
    console.log('🎮 Orchestration system is now running...');
    console.log('Press Ctrl+C to stop');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Received shutdown signal...');
      await example.stop();
      process.exit(0);
    });
    
    // Keep the process alive
    await new Promise(() => {}); // Run indefinitely
    
  } catch (error) {
    console.error('❌ Example failed:', error);
    await example.stop();
    process.exit(1);
  }
}

/**
 * Example of running a single tick for testing
 */
export async function runSingleTickExample(): Promise<void> {
  const example = new BasicOrchestrationExample();
  
  try {
    await example.setup();
    await example.executeSingleTick();
    
    const metrics = example.getMetrics();
    console.log('\n📊 Detailed Metrics:', JSON.stringify(metrics, null, 2));
    
    await example.stop();
  } catch (error) {
    console.error('❌ Single tick example failed:', error);
    await example.stop();
    process.exit(1);
  }
}

// Export for direct execution
if (require.main === module) {
  // Run the basic example if this file is executed directly
  runBasicExample().catch(console.error);
}
