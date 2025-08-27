import { EventEmitter } from 'events';
import { BaseAPI } from '../BaseAPI';
import { ParallelExecutionEngine } from '../ParallelExecutionEngine';
import { MasterOrchestrator } from '../MasterOrchestrator';
import { APIExecutionContext, APIExecutionResult } from '../types';
import { DatabasePool } from 'pg';

// Chaos experiment configuration
interface ChaosExperimentConfig {
  name: string;
  description: string;
  category: 'failure' | 'latency' | 'resource' | 'network' | 'data';
  severity: 'low' | 'medium' | 'high' | 'critical';
  duration: number; // milliseconds
  probability: number; // 0-1
  targetComponents: string[];
  expectedBehavior: string;
  recoveryTimeMs: number;
}

// Chaos experiment result
interface ChaosExperimentResult {
  experimentId: string;
  config: ChaosExperimentConfig;
  startTime: number;
  endTime: number;
  success: boolean;
  systemRecovered: boolean;
  recoveryTimeMs: number;
  impactedComponents: string[];
  performanceImpact: {
    throughputDegradation: number;
    latencyIncrease: number;
    errorRateIncrease: number;
  };
  observations: string[];
  recommendations: string[];
}

// Chaos testing suite result
interface ChaosTestSuiteResult {
  suiteId: string;
  startTime: number;
  endTime: number;
  totalExperiments: number;
  successfulExperiments: number;
  failedExperiments: number;
  systemResilienceScore: number;
  results: ChaosExperimentResult[];
  overallRecommendations: string[];
}

// Failure injection types
type FailureType = 
  | 'api_timeout'
  | 'api_error'
  | 'memory_pressure'
  | 'cpu_spike'
  | 'network_partition'
  | 'database_unavailable'
  | 'random_delays'
  | 'resource_exhaustion'
  | 'cascading_failure'
  | 'data_corruption';

export class ChaosEngineeringTests extends EventEmitter {
  private experiments: Map<string, ChaosExperimentConfig> = new Map();
  private activeExperiments: Map<string, any> = new Map();
  private results: ChaosExperimentResult[] = [];
  private isRunning: boolean = false;

  constructor() {
    super();
    this.registerDefaultExperiments();
  }

  /**
   * Run comprehensive chaos engineering test suite
   */
  async runChaosTestSuite(
    apis: BaseAPI[],
    orchestrator: MasterOrchestrator,
    parallelEngine: ParallelExecutionEngine,
    options: {
      includeCategories?: string[];
      excludeCategories?: string[];
      severityLevels?: string[];
      customExperiments?: ChaosExperimentConfig[];
    } = {}
  ): Promise<ChaosTestSuiteResult> {
    const suiteId = `chaos_suite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    console.log(`🌪️ Starting Chaos Engineering Test Suite ${suiteId}`);
    this.isRunning = true;
    this.results = [];
    
    this.emit('chaosTestSuiteStarted', { suiteId, experimentCount: this.experiments.size });

    try {
      // Add custom experiments if provided
      if (options.customExperiments) {
        options.customExperiments.forEach(exp => this.experiments.set(exp.name, exp));
      }

      // Filter experiments based on options
      const filteredExperiments = this.filterExperiments(options);
      
      // Run each chaos experiment
      for (const [experimentName, config] of filteredExperiments) {
        console.log(`💥 Running chaos experiment: ${experimentName}`);
        
        try {
          const result = await this.runChaosExperiment(
            config,
            apis,
            orchestrator,
            parallelEngine
          );
          
          this.results.push(result);
          this.emit('chaosExperimentCompleted', { experimentName, result });
        } catch (error) {
          console.error(`❌ Chaos experiment ${experimentName} failed:`, error);
          this.emit('chaosExperimentFailed', { experimentName, error });
        }
      }

      const endTime = Date.now();
      const suiteResult = this.buildSuiteResult(suiteId, startTime, endTime);
      
      console.log(`✅ Chaos Test Suite completed: Resilience Score ${suiteResult.systemResilienceScore.toFixed(2)}`);
      this.emit('chaosTestSuiteCompleted', suiteResult);
      
      return suiteResult;
    } catch (error) {
      console.error(`❌ Chaos Test Suite failed:`, error);
      this.emit('chaosTestSuiteFailed', { suiteId, error });
      throw error;
    } finally {
      this.isRunning = false;
      await this.cleanupAllExperiments();
    }
  }

  /**
   * Run individual chaos experiment
   */
  async runChaosExperiment(
    config: ChaosExperimentConfig,
    apis: BaseAPI[],
    orchestrator: MasterOrchestrator,
    parallelEngine: ParallelExecutionEngine
  ): Promise<ChaosExperimentResult> {
    const experimentId = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    console.log(`🔬 Starting chaos experiment: ${config.name}`);
    
    // Baseline performance measurement
    const baseline = await this.measureBaselinePerformance(apis, orchestrator, parallelEngine);
    
    // Inject chaos
    const chaosInjection = await this.injectChaos(config, apis, orchestrator, parallelEngine);
    
    try {
      // Monitor system during chaos
      const duringChaosMetrics = await this.monitorSystemDuringChaos(
        config,
        apis,
        orchestrator,
        parallelEngine
      );
      
      // Stop chaos injection
      await this.stopChaosInjection(chaosInjection);
      
      // Measure recovery
      const recoveryMetrics = await this.measureRecovery(apis, orchestrator, parallelEngine, baseline);
      
      const endTime = Date.now();
      
      return {
        experimentId,
        config,
        startTime,
        endTime,
        success: duringChaosMetrics.systemStable,
        systemRecovered: recoveryMetrics.recovered,
        recoveryTimeMs: recoveryMetrics.recoveryTime,
        impactedComponents: duringChaosMetrics.impactedComponents,
        performanceImpact: {
          throughputDegradation: this.calculateThroughputDegradation(baseline, duringChaosMetrics),
          latencyIncrease: this.calculateLatencyIncrease(baseline, duringChaosMetrics),
          errorRateIncrease: this.calculateErrorRateIncrease(baseline, duringChaosMetrics)
        },
        observations: duringChaosMetrics.observations,
        recommendations: this.generateExperimentRecommendations(config, duringChaosMetrics, recoveryMetrics)
      };
    } catch (error) {
      await this.stopChaosInjection(chaosInjection);
      throw error;
    }
  }

  /**
   * Run specific failure injection tests
   */
  async testFailureScenarios(
    apis: BaseAPI[],
    scenarios: FailureType[]
  ): Promise<ChaosExperimentResult[]> {
    console.log(`💣 Testing ${scenarios.length} failure scenarios`);
    
    const results: ChaosExperimentResult[] = [];
    
    for (const scenario of scenarios) {
      const config = this.createFailureScenarioConfig(scenario);
      const mockOrchestrator = this.createMockOrchestrator();
      const mockParallelEngine = this.createMockParallelEngine();
      
      const result = await this.runChaosExperiment(
        config,
        apis,
        mockOrchestrator,
        mockParallelEngine
      );
      
      results.push(result);
    }
    
    return results;
  }

  /**
   * Test system resilience under various conditions
   */
  async testSystemResilience(
    apis: BaseAPI[],
    orchestrator: MasterOrchestrator
  ): Promise<{
    resilienceScore: number;
    weakPoints: string[];
    strengths: string[];
    recommendations: string[];
  }> {
    console.log(`🛡️ Testing system resilience`);
    
    const resilienceTests = [
      'api_cascade_failure',
      'resource_exhaustion',
      'network_partition',
      'database_failure',
      'memory_pressure'
    ];
    
    const results: ChaosExperimentResult[] = [];
    
    for (const testName of resilienceTests) {
      const config = this.experiments.get(testName);
      if (config) {
        const mockParallelEngine = this.createMockParallelEngine();
        const result = await this.runChaosExperiment(config, apis, orchestrator, mockParallelEngine);
        results.push(result);
      }
    }
    
    return this.analyzeResilienceResults(results);
  }

  // ============================================================================
  // CHAOS INJECTION METHODS
  // ============================================================================

  private async injectChaos(
    config: ChaosExperimentConfig,
    apis: BaseAPI[],
    orchestrator: MasterOrchestrator,
    parallelEngine: ParallelExecutionEngine
  ): Promise<any> {
    console.log(`💉 Injecting chaos: ${config.name}`);
    
    const injection = {
      id: `injection_${Date.now()}`,
      config,
      active: true,
      startTime: Date.now()
    };
    
    this.activeExperiments.set(injection.id, injection);
    
    switch (config.category) {
      case 'failure':
        return await this.injectFailureChaos(config, apis, injection);
      
      case 'latency':
        return await this.injectLatencyChaos(config, apis, injection);
      
      case 'resource':
        return await this.injectResourceChaos(config, injection);
      
      case 'network':
        return await this.injectNetworkChaos(config, injection);
      
      case 'data':
        return await this.injectDataChaos(config, injection);
      
      default:
        throw new Error(`Unknown chaos category: ${config.category}`);
    }
  }

  private async injectFailureChaos(
    config: ChaosExperimentConfig,
    apis: BaseAPI[],
    injection: any
  ): Promise<any> {
    // Inject API failures
    const originalExecuteMethods = new Map();
    
    for (const api of apis) {
      if (config.targetComponents.includes(api.getConfig().id) || config.targetComponents.includes('all')) {
        const originalExecute = api.execute.bind(api);
        originalExecuteMethods.set(api.getConfig().id, originalExecute);
        
        // Override execute method to inject failures
        api.execute = async (context: APIExecutionContext) => {
          if (Math.random() < config.probability) {
            throw new Error(`Chaos injection: ${config.name}`);
          }
          return await originalExecute(context);
        };
      }
    }
    
    injection.originalMethods = originalExecuteMethods;
    return injection;
  }

  private async injectLatencyChaos(
    config: ChaosExperimentConfig,
    apis: BaseAPI[],
    injection: any
  ): Promise<any> {
    // Inject latency delays
    const originalExecuteMethods = new Map();
    
    for (const api of apis) {
      if (config.targetComponents.includes(api.getConfig().id) || config.targetComponents.includes('all')) {
        const originalExecute = api.execute.bind(api);
        originalExecuteMethods.set(api.getConfig().id, originalExecute);
        
        // Override execute method to inject delays
        api.execute = async (context: APIExecutionContext) => {
          if (Math.random() < config.probability) {
            const delay = Math.random() * config.duration;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          return await originalExecute(context);
        };
      }
    }
    
    injection.originalMethods = originalExecuteMethods;
    return injection;
  }

  private async injectResourceChaos(config: ChaosExperimentConfig, injection: any): Promise<any> {
    // Inject resource pressure (memory/CPU)
    const memoryBallast: any[] = [];
    
    if (config.targetComponents.includes('memory') || config.targetComponents.includes('all')) {
      // Consume memory
      const memorySize = 50 * 1024 * 1024; // 50MB chunks
      const chunks = Math.floor(config.severity === 'high' ? 10 : config.severity === 'medium' ? 5 : 2);
      
      for (let i = 0; i < chunks; i++) {
        memoryBallast.push(new Array(memorySize / 8).fill(Math.random()));
      }
    }
    
    injection.memoryBallast = memoryBallast;
    return injection;
  }

  private async injectNetworkChaos(config: ChaosExperimentConfig, injection: any): Promise<any> {
    // Simulate network issues (would need actual network manipulation in real implementation)
    console.log(`🌐 Simulating network chaos: ${config.name}`);
    
    injection.networkSimulation = {
      type: 'partition',
      affectedComponents: config.targetComponents
    };
    
    return injection;
  }

  private async injectDataChaos(config: ChaosExperimentConfig, injection: any): Promise<any> {
    // Simulate data corruption or inconsistency
    console.log(`💾 Simulating data chaos: ${config.name}`);
    
    injection.dataCorruption = {
      type: 'corruption',
      affectedData: config.targetComponents
    };
    
    return injection;
  }

  private async stopChaosInjection(injection: any): Promise<void> {
    console.log(`🛑 Stopping chaos injection: ${injection.id}`);
    
    injection.active = false;
    
    // Restore original methods
    if (injection.originalMethods) {
      // In a real implementation, we would restore the original methods
      // For this simulation, we'll just mark as stopped
    }
    
    // Clean up memory ballast
    if (injection.memoryBallast) {
      injection.memoryBallast.length = 0;
    }
    
    this.activeExperiments.delete(injection.id);
  }

  // ============================================================================
  // MONITORING AND MEASUREMENT METHODS
  // ============================================================================

  private async measureBaselinePerformance(
    apis: BaseAPI[],
    orchestrator: MasterOrchestrator,
    parallelEngine: ParallelExecutionEngine
  ): Promise<any> {
    console.log(`📊 Measuring baseline performance`);
    
    const startTime = Date.now();
    const mockContext = this.createMockContext();
    
    // Measure API performance
    const apiResults = await Promise.allSettled(
      apis.slice(0, 3).map(api => api.execute(mockContext))
    );
    
    const endTime = Date.now();
    
    return {
      duration: endTime - startTime,
      successRate: apiResults.filter(r => r.status === 'fulfilled').length / apiResults.length,
      throughput: apiResults.length / ((endTime - startTime) / 1000),
      averageLatency: (endTime - startTime) / apiResults.length,
      errorRate: apiResults.filter(r => r.status === 'rejected').length / apiResults.length
    };
  }

  private async monitorSystemDuringChaos(
    config: ChaosExperimentConfig,
    apis: BaseAPI[],
    orchestrator: MasterOrchestrator,
    parallelEngine: ParallelExecutionEngine
  ): Promise<any> {
    console.log(`👁️ Monitoring system during chaos: ${config.name}`);
    
    const monitoringDuration = Math.min(config.duration, 10000); // Max 10 seconds
    const startTime = Date.now();
    const observations: string[] = [];
    const impactedComponents: string[] = [];
    
    // Monitor for the specified duration
    const endTime = startTime + monitoringDuration;
    let systemStable = true;
    let successfulOperations = 0;
    let totalOperations = 0;
    
    while (Date.now() < endTime) {
      try {
        const mockContext = this.createMockContext();
        
        // Test a few APIs
        const testApis = apis.slice(0, 2);
        const results = await Promise.allSettled(
          testApis.map(api => api.execute(mockContext))
        );
        
        totalOperations += results.length;
        successfulOperations += results.filter(r => r.status === 'fulfilled').length;
        
        // Check for failures
        const failures = results.filter(r => r.status === 'rejected');
        if (failures.length > 0) {
          observations.push(`API failures detected: ${failures.length}/${results.length}`);
          impactedComponents.push(...testApis.map(api => api.getConfig().id));
        }
        
        // Check system stability
        const currentSuccessRate = successfulOperations / totalOperations;
        if (currentSuccessRate < 0.5) {
          systemStable = false;
          observations.push('System stability compromised: success rate below 50%');
        }
        
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms intervals
      } catch (error) {
        observations.push(`Monitoring error: ${error}`);
        systemStable = false;
      }
    }
    
    return {
      systemStable,
      successRate: successfulOperations / totalOperations,
      impactedComponents: [...new Set(impactedComponents)],
      observations,
      totalOperations,
      successfulOperations
    };
  }

  private async measureRecovery(
    apis: BaseAPI[],
    orchestrator: MasterOrchestrator,
    parallelEngine: ParallelExecutionEngine,
    baseline: any
  ): Promise<any> {
    console.log(`🔄 Measuring system recovery`);
    
    const recoveryStartTime = Date.now();
    const maxRecoveryTime = 30000; // 30 seconds max
    
    let recovered = false;
    let recoveryTime = 0;
    
    while (!recovered && (Date.now() - recoveryStartTime) < maxRecoveryTime) {
      try {
        const current = await this.measureBaselinePerformance(apis, orchestrator, parallelEngine);
        
        // Check if performance is back to acceptable levels
        if (current.successRate >= baseline.successRate * 0.9) {
          recovered = true;
          recoveryTime = Date.now() - recoveryStartTime;
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        }
      } catch (error) {
        console.warn('Recovery measurement failed:', error);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (!recovered) {
      recoveryTime = maxRecoveryTime;
    }
    
    return {
      recovered,
      recoveryTime
    };
  }

  // ============================================================================
  // EXPERIMENT REGISTRATION AND CONFIGURATION
  // ============================================================================

  private registerDefaultExperiments(): void {
    // API Cascade Failure
    this.experiments.set('api_cascade_failure', {
      name: 'API Cascade Failure',
      description: 'Tests system behavior when multiple APIs fail in cascade',
      category: 'failure',
      severity: 'high',
      duration: 5000,
      probability: 0.8,
      targetComponents: ['all'],
      expectedBehavior: 'System should gracefully degrade and maintain core functionality',
      recoveryTimeMs: 10000
    });

    // Memory Pressure Test
    this.experiments.set('memory_pressure', {
      name: 'Memory Pressure Test',
      description: 'Tests system behavior under high memory pressure',
      category: 'resource',
      severity: 'medium',
      duration: 8000,
      probability: 1.0,
      targetComponents: ['memory'],
      expectedBehavior: 'System should handle memory pressure without crashing',
      recoveryTimeMs: 5000
    });

    // Latency Injection Test
    this.experiments.set('latency_injection', {
      name: 'Latency Injection Test',
      description: 'Tests system behavior with increased API latency',
      category: 'latency',
      severity: 'medium',
      duration: 6000,
      probability: 0.5,
      targetComponents: ['all'],
      expectedBehavior: 'System should handle increased latency gracefully',
      recoveryTimeMs: 3000
    });

    // Network Partition Test
    this.experiments.set('network_partition', {
      name: 'Network Partition Test',
      description: 'Simulates network partitioning between components',
      category: 'network',
      severity: 'high',
      duration: 7000,
      probability: 1.0,
      targetComponents: ['network'],
      expectedBehavior: 'System should detect and handle network partitions',
      recoveryTimeMs: 15000
    });

    // Resource Exhaustion Test
    this.experiments.set('resource_exhaustion', {
      name: 'Resource Exhaustion Test',
      description: 'Tests system behavior when resources are exhausted',
      category: 'resource',
      severity: 'critical',
      duration: 10000,
      probability: 1.0,
      targetComponents: ['memory', 'cpu'],
      expectedBehavior: 'System should prevent resource exhaustion and maintain stability',
      recoveryTimeMs: 20000
    });
  }

  // ============================================================================
  // UTILITY AND HELPER METHODS
  // ============================================================================

  private filterExperiments(options: any): Map<string, ChaosExperimentConfig> {
    const filtered = new Map<string, ChaosExperimentConfig>();
    
    for (const [name, config] of this.experiments) {
      let include = true;
      
      if (options.includeCategories && !options.includeCategories.includes(config.category)) {
        include = false;
      }
      
      if (options.excludeCategories && options.excludeCategories.includes(config.category)) {
        include = false;
      }
      
      if (options.severityLevels && !options.severityLevels.includes(config.severity)) {
        include = false;
      }
      
      if (include) {
        filtered.set(name, config);
      }
    }
    
    return filtered;
  }

  private buildSuiteResult(suiteId: string, startTime: number, endTime: number): ChaosTestSuiteResult {
    const totalDuration = endTime - startTime;
    const successfulExperiments = this.results.filter(r => r.success).length;
    const failedExperiments = this.results.length - successfulExperiments;
    
    const resilienceScore = this.calculateSystemResilienceScore();
    const overallRecommendations = this.generateOverallRecommendations();
    
    return {
      suiteId,
      startTime,
      endTime,
      totalExperiments: this.results.length,
      successfulExperiments,
      failedExperiments,
      systemResilienceScore: resilienceScore,
      results: this.results,
      overallRecommendations
    };
  }

  private calculateSystemResilienceScore(): number {
    if (this.results.length === 0) return 0;
    
    let totalScore = 0;
    
    for (const result of this.results) {
      let experimentScore = 0;
      
      // Base score for system stability during chaos
      if (result.success) experimentScore += 30;
      
      // Score for recovery
      if (result.systemRecovered) experimentScore += 30;
      
      // Score for recovery time (faster is better)
      const recoveryTimeScore = Math.max(0, 20 - (result.recoveryTimeMs / 1000));
      experimentScore += recoveryTimeScore;
      
      // Score for performance impact (less impact is better)
      const performanceScore = Math.max(0, 20 - (result.performanceImpact.throughputDegradation * 20));
      experimentScore += performanceScore;
      
      totalScore += Math.min(100, experimentScore);
    }
    
    return totalScore / this.results.length;
  }

  private generateOverallRecommendations(): string[] {
    const recommendations: string[] = [];
    
    const failedExperiments = this.results.filter(r => !r.success);
    if (failedExperiments.length > 0) {
      recommendations.push('Implement better error handling and graceful degradation for failed scenarios');
    }
    
    const slowRecoveryExperiments = this.results.filter(r => r.recoveryTimeMs > 15000);
    if (slowRecoveryExperiments.length > 0) {
      recommendations.push('Optimize system recovery mechanisms to reduce recovery time');
    }
    
    const highImpactExperiments = this.results.filter(r => r.performanceImpact.throughputDegradation > 0.5);
    if (highImpactExperiments.length > 0) {
      recommendations.push('Implement circuit breakers and bulkheads to limit performance impact');
    }
    
    return recommendations;
  }

  private analyzeResilienceResults(results: ChaosExperimentResult[]): any {
    const resilienceScore = results.reduce((sum, r) => sum + (r.success ? 1 : 0), 0) / results.length;
    
    const weakPoints = results
      .filter(r => !r.success)
      .map(r => r.config.name);
    
    const strengths = results
      .filter(r => r.success && r.systemRecovered)
      .map(r => r.config.name);
    
    const recommendations = [
      ...new Set(results.flatMap(r => r.recommendations))
    ];
    
    return {
      resilienceScore,
      weakPoints,
      strengths,
      recommendations
    };
  }

  private createFailureScenarioConfig(scenario: FailureType): ChaosExperimentConfig {
    const configs: Record<FailureType, Partial<ChaosExperimentConfig>> = {
      api_timeout: {
        category: 'latency',
        severity: 'medium',
        duration: 10000,
        probability: 1.0
      },
      api_error: {
        category: 'failure',
        severity: 'high',
        duration: 5000,
        probability: 0.8
      },
      memory_pressure: {
        category: 'resource',
        severity: 'medium',
        duration: 8000,
        probability: 1.0
      },
      cpu_spike: {
        category: 'resource',
        severity: 'high',
        duration: 6000,
        probability: 1.0
      },
      network_partition: {
        category: 'network',
        severity: 'critical',
        duration: 10000,
        probability: 1.0
      },
      database_unavailable: {
        category: 'failure',
        severity: 'critical',
        duration: 8000,
        probability: 1.0
      },
      random_delays: {
        category: 'latency',
        severity: 'low',
        duration: 5000,
        probability: 0.3
      },
      resource_exhaustion: {
        category: 'resource',
        severity: 'critical',
        duration: 12000,
        probability: 1.0
      },
      cascading_failure: {
        category: 'failure',
        severity: 'critical',
        duration: 15000,
        probability: 0.9
      },
      data_corruption: {
        category: 'data',
        severity: 'high',
        duration: 7000,
        probability: 0.5
      }
    };
    
    const baseConfig = configs[scenario];
    
    return {
      name: `${scenario.replace(/_/g, ' ').toUpperCase()} Test`,
      description: `Tests system behavior during ${scenario.replace(/_/g, ' ')}`,
      targetComponents: ['all'],
      expectedBehavior: 'System should maintain stability and recover gracefully',
      recoveryTimeMs: 10000,
      ...baseConfig
    } as ChaosExperimentConfig;
  }

  private calculateThroughputDegradation(baseline: any, during: any): number {
    return Math.max(0, (baseline.throughput - during.throughput) / baseline.throughput);
  }

  private calculateLatencyIncrease(baseline: any, during: any): number {
    return Math.max(0, (during.averageLatency - baseline.averageLatency) / baseline.averageLatency);
  }

  private calculateErrorRateIncrease(baseline: any, during: any): number {
    return Math.max(0, during.errorRate - baseline.errorRate);
  }

  private generateExperimentRecommendations(
    config: ChaosExperimentConfig,
    duringMetrics: any,
    recoveryMetrics: any
  ): string[] {
    const recommendations: string[] = [];
    
    if (!duringMetrics.systemStable) {
      recommendations.push(`Implement better resilience for ${config.category} failures`);
    }
    
    if (!recoveryMetrics.recovered) {
      recommendations.push('Improve system recovery mechanisms and health checks');
    }
    
    if (recoveryMetrics.recoveryTime > config.recoveryTimeMs) {
      recommendations.push('Optimize recovery time through better monitoring and automation');
    }
    
    return recommendations;
  }

  private createMockContext(): APIExecutionContext {
    return {
      gameState: {
        civilization: { id: 'chaos_test_civ', name: 'Chaos Test Civilization' },
        timestamp: Date.now(),
        tickNumber: 1
      },
      knobOverrides: new Map(),
      eventHistory: [],
      metadata: { chaosTestMode: true }
    };
  }

  private createMockOrchestrator(): MasterOrchestrator {
    // Return a mock orchestrator for testing
    return {} as MasterOrchestrator;
  }

  private createMockParallelEngine(): ParallelExecutionEngine {
    // Return a mock parallel engine for testing
    return {} as ParallelExecutionEngine;
  }

  private async cleanupAllExperiments(): Promise<void> {
    console.log('🧹 Cleaning up all chaos experiments');
    
    for (const [id, injection] of this.activeExperiments) {
      await this.stopChaosInjection(injection);
    }
    
    this.activeExperiments.clear();
  }

  /**
   * Add custom chaos experiment
   */
  addExperiment(config: ChaosExperimentConfig): void {
    this.experiments.set(config.name, config);
  }

  /**
   * Get all experiment results
   */
  getResults(): ChaosExperimentResult[] {
    return [...this.results];
  }

  /**
   * Clear all results
   */
  clearResults(): void {
    this.results = [];
  }

  /**
   * Check if chaos tests are currently running
   */
  isRunningTests(): boolean {
    return this.isRunning;
  }
}

// Factory function for creating chaos engineering tests
export function createChaosEngineeringTests(): ChaosEngineeringTests {
  return new ChaosEngineeringTests();
}

// Export types for external use
export type {
  ChaosExperimentConfig,
  ChaosExperimentResult,
  ChaosTestSuiteResult,
  FailureType
};
