import { performance } from 'perf_hooks';
import { EventEmitter } from 'events';
import { BaseAPI } from '../BaseAPI';
import { ParallelExecutionEngine } from '../ParallelExecutionEngine';
import { MasterOrchestrator } from '../MasterOrchestrator';
import { APIExecutionContext } from '../types';
import { DatabasePool } from 'pg';

// Benchmark configuration
interface BenchmarkConfig {
  iterations: number;
  warmupIterations: number;
  timeoutMs: number;
  memoryThresholdMB: number;
  cpuThresholdPercent: number;
  concurrencyLevels: number[];
  testDataSizes: number[];
}

// Benchmark result
interface BenchmarkResult {
  testName: string;
  iterations: number;
  totalTimeMs: number;
  averageTimeMs: number;
  minTimeMs: number;
  maxTimeMs: number;
  throughputPerSecond: number;
  memoryUsageMB: {
    initial: number;
    peak: number;
    final: number;
  };
  cpuUsagePercent: number;
  successRate: number;
  errorCount: number;
  percentiles: {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
  };
}

// Comprehensive benchmark suite result
interface BenchmarkSuiteResult {
  suiteId: string;
  startTime: number;
  endTime: number;
  totalDurationMs: number;
  results: BenchmarkResult[];
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    averagePerformance: number;
    performanceGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  };
  recommendations: string[];
}

// Performance test case
interface PerformanceTestCase {
  name: string;
  description: string;
  category: 'api' | 'orchestration' | 'parallel' | 'integration' | 'stress';
  setup: () => Promise<any>;
  execute: (context: any) => Promise<any>;
  teardown: (context: any) => Promise<void>;
  expectedPerformance: {
    maxTimeMs: number;
    minThroughput: number;
    maxMemoryMB: number;
  };
}

export class PerformanceBenchmarkSuite extends EventEmitter {
  private config: BenchmarkConfig;
  private testCases: Map<string, PerformanceTestCase> = new Map();
  private results: BenchmarkResult[] = [];
  private isRunning: boolean = false;

  constructor(config: Partial<BenchmarkConfig> = {}) {
    super();
    
    this.config = {
      iterations: config.iterations || 100,
      warmupIterations: config.warmupIterations || 10,
      timeoutMs: config.timeoutMs || 30000,
      memoryThresholdMB: config.memoryThresholdMB || 1024,
      cpuThresholdPercent: config.cpuThresholdPercent || 80,
      concurrencyLevels: config.concurrencyLevels || [1, 2, 4, 8, 16],
      testDataSizes: config.testDataSizes || [10, 100, 1000, 5000]
    };

    this.registerDefaultTestCases();
  }

  /**
   * Run the complete performance benchmark suite
   */
  async runBenchmarkSuite(
    apis: BaseAPI[],
    databasePool?: DatabasePool,
    options: {
      includeCategories?: string[];
      excludeCategories?: string[];
      customTests?: PerformanceTestCase[];
    } = {}
  ): Promise<BenchmarkSuiteResult> {
    const suiteId = `benchmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    console.log(`🚀 Starting Performance Benchmark Suite ${suiteId}`);
    this.isRunning = true;
    this.results = [];
    
    this.emit('suiteStarted', { suiteId, testCount: this.testCases.size });

    try {
      // Add custom tests if provided
      if (options.customTests) {
        options.customTests.forEach(test => this.testCases.set(test.name, test));
      }

      // Filter test cases based on categories
      const filteredTests = this.filterTestCases(options.includeCategories, options.excludeCategories);
      
      // Run each test case
      for (const [testName, testCase] of filteredTests) {
        console.log(`📊 Running benchmark: ${testName}`);
        
        try {
          const result = await this.runSingleBenchmark(testName, testCase, apis, databasePool);
          this.results.push(result);
          
          this.emit('testCompleted', { testName, result });
        } catch (error) {
          console.error(`❌ Benchmark ${testName} failed:`, error);
          this.emit('testFailed', { testName, error });
        }
      }

      const endTime = Date.now();
      const suiteResult = this.buildSuiteResult(suiteId, startTime, endTime);
      
      console.log(`✅ Benchmark Suite completed: ${suiteResult.summary.passedTests}/${suiteResult.summary.totalTests} tests passed`);
      this.emit('suiteCompleted', suiteResult);
      
      return suiteResult;
    } catch (error) {
      console.error(`❌ Benchmark Suite failed:`, error);
      this.emit('suiteFailed', { suiteId, error });
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Run API performance benchmarks
   */
  async benchmarkAPIs(apis: BaseAPI[]): Promise<BenchmarkResult[]> {
    console.log(`🔧 Benchmarking ${apis.length} APIs`);
    
    const results: BenchmarkResult[] = [];
    
    for (const api of apis) {
      const testName = `API_${api.getConfig().name}`;
      const result = await this.benchmarkSingleAPI(api, testName);
      results.push(result);
    }
    
    return results;
  }

  /**
   * Run parallel execution benchmarks
   */
  async benchmarkParallelExecution(
    apis: BaseAPI[],
    contexts: APIExecutionContext[]
  ): Promise<BenchmarkResult[]> {
    console.log(`⚡ Benchmarking parallel execution with ${apis.length} APIs`);
    
    const results: BenchmarkResult[] = [];
    const parallelEngine = new ParallelExecutionEngine();
    
    for (const concurrency of this.config.concurrencyLevels) {
      const testName = `ParallelExecution_Concurrency${concurrency}`;
      
      const result = await this.runBenchmark(testName, async () => {
        const limitedApis = apis.slice(0, concurrency);
        const limitedContexts = contexts.slice(0, concurrency);
        
        return await parallelEngine.executeParallel(limitedApis, limitedContexts);
      });
      
      results.push(result);
    }
    
    parallelEngine.shutdown();
    return results;
  }

  /**
   * Run orchestration system benchmarks
   */
  async benchmarkOrchestration(
    orchestrator: MasterOrchestrator,
    contexts: APIExecutionContext[]
  ): Promise<BenchmarkResult[]> {
    console.log(`🎼 Benchmarking orchestration system`);
    
    const results: BenchmarkResult[] = [];
    
    for (const dataSize of this.config.testDataSizes) {
      const testName = `Orchestration_DataSize${dataSize}`;
      
      const result = await this.runBenchmark(testName, async () => {
        const limitedContexts = contexts.slice(0, Math.min(dataSize, contexts.length));
        return await orchestrator.executeTick(limitedContexts[0] || this.createMockContext());
      });
      
      results.push(result);
    }
    
    return results;
  }

  /**
   * Run stress tests
   */
  async runStressTests(apis: BaseAPI[]): Promise<BenchmarkResult[]> {
    console.log(`💪 Running stress tests`);
    
    const results: BenchmarkResult[] = [];
    
    // Memory stress test
    const memoryStressResult = await this.runMemoryStressTest(apis);
    results.push(memoryStressResult);
    
    // Concurrent load stress test
    const concurrentStressResult = await this.runConcurrentStressTest(apis);
    results.push(concurrentStressResult);
    
    // Duration stress test
    const durationStressResult = await this.runDurationStressTest(apis);
    results.push(durationStressResult);
    
    return results;
  }

  // ============================================================================
  // PRIVATE BENCHMARK EXECUTION METHODS
  // ============================================================================

  private async runSingleBenchmark(
    testName: string,
    testCase: PerformanceTestCase,
    apis: BaseAPI[],
    databasePool?: DatabasePool
  ): Promise<BenchmarkResult> {
    console.log(`🔍 Setting up benchmark: ${testName}`);
    
    // Setup test context
    const setupContext = await testCase.setup();
    const testContext = { ...setupContext, apis, databasePool };
    
    try {
      // Warmup iterations
      console.log(`🔥 Warming up: ${testName}`);
      for (let i = 0; i < this.config.warmupIterations; i++) {
        await testCase.execute(testContext);
      }
      
      // Actual benchmark iterations
      console.log(`⏱️ Benchmarking: ${testName}`);
      const result = await this.runBenchmark(testName, () => testCase.execute(testContext));
      
      // Validate performance expectations
      this.validatePerformanceExpectations(result, testCase.expectedPerformance);
      
      return result;
    } finally {
      await testCase.teardown(testContext);
    }
  }

  private async benchmarkSingleAPI(api: BaseAPI, testName: string): Promise<BenchmarkResult> {
    const mockContext = this.createMockContext();
    
    return await this.runBenchmark(testName, async () => {
      return await api.execute(mockContext);
    });
  }

  private async runBenchmark(testName: string, operation: () => Promise<any>): Promise<BenchmarkResult> {
    const times: number[] = [];
    const memoryUsage = {
      initial: this.getMemoryUsageMB(),
      peak: 0,
      final: 0
    };
    
    let successCount = 0;
    let errorCount = 0;
    
    const startTime = performance.now();
    
    for (let i = 0; i < this.config.iterations; i++) {
      const iterationStart = performance.now();
      
      try {
        await operation();
        successCount++;
      } catch (error) {
        errorCount++;
        console.warn(`Iteration ${i} failed:`, error);
      }
      
      const iterationEnd = performance.now();
      const iterationTime = iterationEnd - iterationStart;
      times.push(iterationTime);
      
      // Track peak memory usage
      const currentMemory = this.getMemoryUsageMB();
      memoryUsage.peak = Math.max(memoryUsage.peak, currentMemory);
      
      // Emit progress
      if (i % Math.max(1, Math.floor(this.config.iterations / 10)) === 0) {
        this.emit('benchmarkProgress', {
          testName,
          iteration: i,
          totalIterations: this.config.iterations,
          progress: i / this.config.iterations
        });
      }
    }
    
    const endTime = performance.now();
    memoryUsage.final = this.getMemoryUsageMB();
    
    // Calculate statistics
    const totalTime = endTime - startTime;
    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const throughput = this.config.iterations / (totalTime / 1000);
    const successRate = successCount / this.config.iterations;
    
    // Calculate percentiles
    const sortedTimes = times.sort((a, b) => a - b);
    const percentiles = {
      p50: this.calculatePercentile(sortedTimes, 0.5),
      p90: this.calculatePercentile(sortedTimes, 0.9),
      p95: this.calculatePercentile(sortedTimes, 0.95),
      p99: this.calculatePercentile(sortedTimes, 0.99)
    };
    
    return {
      testName,
      iterations: this.config.iterations,
      totalTimeMs: totalTime,
      averageTimeMs: averageTime,
      minTimeMs: minTime,
      maxTimeMs: maxTime,
      throughputPerSecond: throughput,
      memoryUsageMB: memoryUsage,
      cpuUsagePercent: 0, // Would need external library for accurate CPU measurement
      successRate,
      errorCount,
      percentiles
    };
  }

  private async runMemoryStressTest(apis: BaseAPI[]): Promise<BenchmarkResult> {
    const testName = 'MemoryStressTest';
    
    return await this.runBenchmark(testName, async () => {
      // Execute multiple APIs simultaneously to stress memory
      const promises = apis.map(api => api.execute(this.createMockContext()));
      await Promise.all(promises);
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
    });
  }

  private async runConcurrentStressTest(apis: BaseAPI[]): Promise<BenchmarkResult> {
    const testName = 'ConcurrentStressTest';
    const maxConcurrency = Math.max(...this.config.concurrencyLevels);
    
    return await this.runBenchmark(testName, async () => {
      const promises: Promise<any>[] = [];
      
      for (let i = 0; i < maxConcurrency; i++) {
        const api = apis[i % apis.length];
        promises.push(api.execute(this.createMockContext()));
      }
      
      await Promise.all(promises);
    });
  }

  private async runDurationStressTest(apis: BaseAPI[]): Promise<BenchmarkResult> {
    const testName = 'DurationStressTest';
    const stressDurationMs = 10000; // 10 seconds
    
    return await this.runBenchmark(testName, async () => {
      const endTime = Date.now() + stressDurationMs;
      
      while (Date.now() < endTime) {
        const api = apis[Math.floor(Math.random() * apis.length)];
        await api.execute(this.createMockContext());
      }
    });
  }

  // ============================================================================
  // TEST CASE REGISTRATION
  // ============================================================================

  private registerDefaultTestCases(): void {
    // API Performance Test
    this.testCases.set('api_performance', {
      name: 'API Performance Test',
      description: 'Tests individual API execution performance',
      category: 'api',
      setup: async () => ({}),
      execute: async (context) => {
        const api = context.apis[0];
        if (api) {
          return await api.execute(this.createMockContext());
        }
      },
      teardown: async () => {},
      expectedPerformance: {
        maxTimeMs: 5000,
        minThroughput: 10,
        maxMemoryMB: 256
      }
    });

    // Parallel Execution Test
    this.testCases.set('parallel_execution', {
      name: 'Parallel Execution Test',
      description: 'Tests parallel execution engine performance',
      category: 'parallel',
      setup: async () => ({
        parallelEngine: new ParallelExecutionEngine()
      }),
      execute: async (context) => {
        const { parallelEngine, apis } = context;
        const contexts = apis.map(() => this.createMockContext());
        return await parallelEngine.executeParallel(apis.slice(0, 4), contexts);
      },
      teardown: async (context) => {
        context.parallelEngine?.shutdown();
      },
      expectedPerformance: {
        maxTimeMs: 10000,
        minThroughput: 5,
        maxMemoryMB: 512
      }
    });

    // Memory Usage Test
    this.testCases.set('memory_usage', {
      name: 'Memory Usage Test',
      description: 'Tests memory consumption patterns',
      category: 'stress',
      setup: async () => ({}),
      execute: async (context) => {
        const largeData = new Array(10000).fill(0).map(() => ({
          id: Math.random().toString(36),
          data: new Array(100).fill(Math.random())
        }));
        
        // Process large data set
        return largeData.reduce((sum, item) => sum + item.data.length, 0);
      },
      teardown: async () => {
        if (global.gc) global.gc();
      },
      expectedPerformance: {
        maxTimeMs: 1000,
        minThroughput: 50,
        maxMemoryMB: 128
      }
    });
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private filterTestCases(
    includeCategories?: string[],
    excludeCategories?: string[]
  ): Map<string, PerformanceTestCase> {
    const filtered = new Map<string, PerformanceTestCase>();
    
    for (const [name, testCase] of this.testCases) {
      let include = true;
      
      if (includeCategories && !includeCategories.includes(testCase.category)) {
        include = false;
      }
      
      if (excludeCategories && excludeCategories.includes(testCase.category)) {
        include = false;
      }
      
      if (include) {
        filtered.set(name, testCase);
      }
    }
    
    return filtered;
  }

  private validatePerformanceExpectations(
    result: BenchmarkResult,
    expectations: PerformanceTestCase['expectedPerformance']
  ): void {
    const issues: string[] = [];
    
    if (result.averageTimeMs > expectations.maxTimeMs) {
      issues.push(`Average time ${result.averageTimeMs}ms exceeds limit ${expectations.maxTimeMs}ms`);
    }
    
    if (result.throughputPerSecond < expectations.minThroughput) {
      issues.push(`Throughput ${result.throughputPerSecond} below minimum ${expectations.minThroughput}`);
    }
    
    if (result.memoryUsageMB.peak > expectations.maxMemoryMB) {
      issues.push(`Peak memory ${result.memoryUsageMB.peak}MB exceeds limit ${expectations.maxMemoryMB}MB`);
    }
    
    if (issues.length > 0) {
      console.warn(`⚠️ Performance expectations not met for ${result.testName}:`, issues);
      this.emit('performanceWarning', { testName: result.testName, issues });
    }
  }

  private buildSuiteResult(suiteId: string, startTime: number, endTime: number): BenchmarkSuiteResult {
    const totalDuration = endTime - startTime;
    const passedTests = this.results.filter(r => r.successRate >= 0.95).length;
    const failedTests = this.results.length - passedTests;
    
    const averagePerformance = this.results.reduce((sum, r) => sum + r.successRate, 0) / this.results.length;
    const performanceGrade = this.calculatePerformanceGrade(averagePerformance);
    
    const recommendations = this.generatePerformanceRecommendations();
    
    return {
      suiteId,
      startTime,
      endTime,
      totalDurationMs: totalDuration,
      results: this.results,
      summary: {
        totalTests: this.results.length,
        passedTests,
        failedTests,
        averagePerformance,
        performanceGrade
      },
      recommendations
    };
  }

  private calculatePerformanceGrade(averagePerformance: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (averagePerformance >= 0.95) return 'A';
    if (averagePerformance >= 0.90) return 'B';
    if (averagePerformance >= 0.80) return 'C';
    if (averagePerformance >= 0.70) return 'D';
    return 'F';
  }

  private generatePerformanceRecommendations(): string[] {
    const recommendations: string[] = [];
    
    // Analyze results for recommendations
    const slowTests = this.results.filter(r => r.averageTimeMs > 5000);
    if (slowTests.length > 0) {
      recommendations.push('Consider optimizing slow-performing APIs or increasing timeout limits');
    }
    
    const highMemoryTests = this.results.filter(r => r.memoryUsageMB.peak > 512);
    if (highMemoryTests.length > 0) {
      recommendations.push('Monitor memory usage and consider implementing memory optimization strategies');
    }
    
    const lowThroughputTests = this.results.filter(r => r.throughputPerSecond < 10);
    if (lowThroughputTests.length > 0) {
      recommendations.push('Investigate throughput bottlenecks and consider parallel processing improvements');
    }
    
    return recommendations;
  }

  private calculatePercentile(sortedArray: number[], percentile: number): number {
    const index = Math.ceil(sortedArray.length * percentile) - 1;
    return sortedArray[Math.max(0, index)];
  }

  private getMemoryUsageMB(): number {
    const memoryUsage = process.memoryUsage();
    return Math.round(memoryUsage.heapUsed / 1024 / 1024);
  }

  private createMockContext(): APIExecutionContext {
    return {
      gameState: {
        civilization: { id: 'test_civ', name: 'Test Civilization' },
        timestamp: Date.now(),
        tickNumber: 1
      },
      knobOverrides: new Map(),
      eventHistory: [],
      metadata: { benchmarkMode: true }
    };
  }

  /**
   * Add custom test case
   */
  addTestCase(testCase: PerformanceTestCase): void {
    this.testCases.set(testCase.name, testCase);
  }

  /**
   * Get benchmark results
   */
  getResults(): BenchmarkResult[] {
    return [...this.results];
  }

  /**
   * Clear all results
   */
  clearResults(): void {
    this.results = [];
  }

  /**
   * Check if benchmark is currently running
   */
  isRunningBenchmark(): boolean {
    return this.isRunning;
  }
}

// Factory function for creating benchmark suite
export function createPerformanceBenchmarkSuite(config?: Partial<BenchmarkConfig>): PerformanceBenchmarkSuite {
  return new PerformanceBenchmarkSuite(config);
}

// Export types for external use
export type {
  BenchmarkConfig,
  BenchmarkResult,
  BenchmarkSuiteResult,
  PerformanceTestCase
};
