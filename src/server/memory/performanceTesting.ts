import { bootstrapLLMProviders } from '../llm/bootstrap';
import { conversationStorage } from './conversationStorage';
import { embeddingService } from './embeddingService';
import { qdrantClient } from './qdrantClient';
import { semanticSearchService } from './semanticSearch';
import { aiContextService } from './aiContextService';
import { memoryAdminService } from './memoryAdminService';
import { captureUserMessage, captureAssistantMessage, createContext } from './messageCapture';

export interface PerformanceMetrics {
  operation: string;
  duration: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage?: number;
  success: boolean;
  errorRate: number;
  p50: number;
  p95: number;
  p99: number;
}

export interface LoadTestResult {
  testName: string;
  concurrentUsers: number;
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  throughputPerSecond: number;
  errorRate: number;
  percentiles: {
    p50: number;
    p95: number;
    p99: number;
  };
}

export interface SystemResourceUsage {
  timestamp: string;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  cpuUsage?: number;
  networkIO?: {
    bytesIn: number;
    bytesOut: number;
  };
}

/**
 * Comprehensive Performance Testing Suite for Vector Memory System
 */
export class PerformanceTester {
  private results: PerformanceMetrics[] = [];
  private resourceUsage: SystemResourceUsage[] = [];
  private isMonitoring = false;

  constructor() {
    this.startResourceMonitoring();
  }

  /**
   * Run complete performance test suite
   */
  async runFullTestSuite(): Promise<{
    individual: PerformanceMetrics[];
    loadTests: LoadTestResult[];
    resources: SystemResourceUsage[];
    summary: any;
  }> {
    console.log('🚀 STARTING COMPREHENSIVE PERFORMANCE TEST SUITE');
    console.log('='.repeat(60));

    try {
      // Initialize systems
      console.log('🔧 Initializing systems...');
      bootstrapLLMProviders();
      await conversationStorage.initializeTables();

      // Individual component performance tests
      console.log('\n📊 RUNNING INDIVIDUAL COMPONENT TESTS');
      const individualResults = await this.runIndividualTests();

      // Load testing
      console.log('\n🔥 RUNNING LOAD TESTS');
      const loadTestResults = await this.runLoadTests();

      // Generate summary
      const summary = this.generateSummary(individualResults, loadTestResults);

      console.log('\n✅ PERFORMANCE TEST SUITE COMPLETED');
      
      return {
        individual: individualResults,
        loadTests: loadTestResults,
        resources: this.resourceUsage,
        summary
      };

    } catch (error) {
      console.error('❌ Performance test suite failed:', error);
      throw error;
    } finally {
      this.stopResourceMonitoring();
    }
  }

  /**
   * Test individual component performance
   */
  private async runIndividualTests(): Promise<PerformanceMetrics[]> {
    const tests = [
      () => this.testEmbeddingService(),
      () => this.testVectorOperations(),
      () => this.testSemanticSearch(),
      () => this.testAIContextGeneration(),
      () => this.testConversationCapture(),
      () => this.testAdminOperations()
    ];

    const results: PerformanceMetrics[] = [];

    for (const test of tests) {
      try {
        const result = await test();
        results.push(result);
        
        // Brief pause between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Test failed:', error);
      }
    }

    return results;
  }

  /**
   * Test embedding service performance
   */
  private async testEmbeddingService(): Promise<PerformanceMetrics> {
    console.log('  🧠 Testing Embedding Service...');
    
    const testTexts = [
      'I want to expand my mining operations for maximum profit',
      'What should be my strategy for diplomatic relations with the Terran Federation?',
      'How can I optimize my trade routes between systems?',
      'Should I focus on military expansion or economic growth?',
      'What are the best resources to mine in the Kepler system?'
    ];

    const timings: number[] = [];
    let successes = 0;
    let failures = 0;

    const startMemory = process.memoryUsage().heapUsed;
    
    for (let i = 0; i < 50; i++) {
      const text = testTexts[i % testTexts.length];
      const startTime = Date.now();
      
      try {
        await embeddingService.embedSingle(text);
        const duration = Date.now() - startTime;
        timings.push(duration);
        successes++;
      } catch (error) {
        failures++;
        timings.push(5000); // Penalty for failures
      }
    }

    const endMemory = process.memoryUsage().heapUsed;
    timings.sort((a, b) => a - b);

    return {
      operation: 'embedding_service',
      duration: timings.reduce((sum, t) => sum + t, 0) / timings.length,
      throughput: successes / (timings.reduce((sum, t) => sum + t, 0) / 1000),
      memoryUsage: endMemory - startMemory,
      success: failures === 0,
      errorRate: (failures / (successes + failures)) * 100,
      p50: timings[Math.floor(timings.length * 0.5)],
      p95: timings[Math.floor(timings.length * 0.95)],
      p99: timings[Math.floor(timings.length * 0.99)]
    };
  }

  /**
   * Test vector database operations
   */
  private async testVectorOperations(): Promise<PerformanceMetrics> {
    console.log('  🗄️ Testing Vector Database Operations...');

    const timings: number[] = [];
    let successes = 0;
    let failures = 0;

    const startMemory = process.memoryUsage().heapUsed;

    // Test vector storage and retrieval
    for (let i = 0; i < 20; i++) {
      const startTime = Date.now();
      
      try {
        const testVector = {
          id: `perf-test-${i}`,
          vector: Array.from({ length: 768 }, () => Math.random() - 0.5),
          payload: {
            content: `Performance test message ${i}`,
            role: 'user',
            campaignId: 1,
            actionType: 'performance_test',
            entities: ['performance', 'testing'],
            timestamp: new Date().toISOString()
          }
        };

        await qdrantClient.storeConversation(testVector);
        
        // Test retrieval
        const searchVector = Array.from({ length: 768 }, () => Math.random() - 0.5);
        await qdrantClient.searchSimilar(searchVector, { limit: 5 });

        const duration = Date.now() - startTime;
        timings.push(duration);
        successes++;
      } catch (error) {
        failures++;
        timings.push(10000); // Penalty for failures
      }
    }

    const endMemory = process.memoryUsage().heapUsed;
    timings.sort((a, b) => a - b);

    return {
      operation: 'vector_operations',
      duration: timings.reduce((sum, t) => sum + t, 0) / timings.length,
      throughput: successes / (timings.reduce((sum, t) => sum + t, 0) / 1000),
      memoryUsage: endMemory - startMemory,
      success: failures === 0,
      errorRate: (failures / (successes + failures)) * 100,
      p50: timings[Math.floor(timings.length * 0.5)],
      p95: timings[Math.floor(timings.length * 0.95)],
      p99: timings[Math.floor(timings.length * 0.99)]
    };
  }

  /**
   * Test semantic search performance
   */
  private async testSemanticSearch(): Promise<PerformanceMetrics> {
    console.log('  🔍 Testing Semantic Search...');

    const searchQueries = [
      'mining operations profit optimization',
      'diplomatic strategy alliance formation',
      'trade route efficiency improvement',
      'military expansion vs economic growth',
      'resource extraction best practices'
    ];

    const timings: number[] = [];
    let successes = 0;
    let failures = 0;

    const startMemory = process.memoryUsage().heapUsed;

    for (let i = 0; i < 30; i++) {
      const query = searchQueries[i % searchQueries.length];
      const startTime = Date.now();
      
      try {
        await semanticSearchService.quickSearch(query, 1, 8);
        const duration = Date.now() - startTime;
        timings.push(duration);
        successes++;
      } catch (error) {
        failures++;
        timings.push(8000); // Penalty for failures
      }
    }

    const endMemory = process.memoryUsage().heapUsed;
    timings.sort((a, b) => a - b);

    return {
      operation: 'semantic_search',
      duration: timings.reduce((sum, t) => sum + t, 0) / timings.length,
      throughput: successes / (timings.reduce((sum, t) => sum + t, 0) / 1000),
      memoryUsage: endMemory - startMemory,
      success: failures === 0,
      errorRate: (failures / (successes + failures)) * 100,
      p50: timings[Math.floor(timings.length * 0.5)],
      p95: timings[Math.floor(timings.length * 0.95)],
      p99: timings[Math.floor(timings.length * 0.99)]
    };
  }

  /**
   * Test AI context generation performance
   */
  private async testAIContextGeneration(): Promise<PerformanceMetrics> {
    console.log('  🧠 Testing AI Context Generation...');

    const prompts = [
      'Analyze my current economic situation',
      'What military strategy should I pursue?',
      'How should I handle trade negotiations?',
      'What expansion opportunities are available?',
      'Optimize my resource allocation strategy'
    ];

    const timings: number[] = [];
    let successes = 0;
    let failures = 0;

    const startMemory = process.memoryUsage().heapUsed;

    for (let i = 0; i < 10; i++) { // Fewer iterations due to AI call cost
      const prompt = prompts[i % prompts.length];
      const startTime = Date.now();
      
      try {
        // Use quick response to minimize AI costs during testing
        await aiContextService.quickResponseWithMemory(prompt, 1, {
          maxContext: 3 // Limit context for faster testing
        });
        
        const duration = Date.now() - startTime;
        timings.push(duration);
        successes++;
      } catch (error) {
        failures++;
        timings.push(15000); // Penalty for failures
        console.warn(`AI context generation failed: ${error}`);
      }
    }

    const endMemory = process.memoryUsage().heapUsed;
    timings.sort((a, b) => a - b);

    return {
      operation: 'ai_context_generation',
      duration: timings.reduce((sum, t) => sum + t, 0) / timings.length,
      throughput: successes / (timings.reduce((sum, t) => sum + t, 0) / 1000),
      memoryUsage: endMemory - startMemory,
      success: failures < timings.length * 0.5, // Allow some failures for AI calls
      errorRate: (failures / (successes + failures)) * 100,
      p50: timings[Math.floor(timings.length * 0.5)],
      p95: timings[Math.floor(timings.length * 0.95)],
      p99: timings[Math.floor(timings.length * 0.99)]
    };
  }

  /**
   * Test conversation capture performance
   */
  private async testConversationCapture(): Promise<PerformanceMetrics> {
    console.log('  💬 Testing Conversation Capture...');

    const messages = [
      'I need help optimizing my mining operations',
      'What diplomatic strategy should I use?',
      'How can I improve my trade efficiency?',
      'Should I expand militarily or economically?',
      'What resources are most valuable?'
    ];

    const timings: number[] = [];
    let successes = 0;
    let failures = 0;

    const startMemory = process.memoryUsage().heapUsed;

    for (let i = 0; i < 25; i++) {
      const message = messages[i % messages.length];
      const startTime = Date.now();
      
      try {
        const context = createContext(1, {
          entities: ['performance', 'testing'],
          actionType: 'performance_test'
        });

        await captureUserMessage(message, context);
        
        const duration = Date.now() - startTime;
        timings.push(duration);
        successes++;
      } catch (error) {
        failures++;
        timings.push(3000); // Penalty for failures
      }
    }

    const endMemory = process.memoryUsage().heapUsed;
    timings.sort((a, b) => a - b);

    return {
      operation: 'conversation_capture',
      duration: timings.reduce((sum, t) => sum + t, 0) / timings.length,
      throughput: successes / (timings.reduce((sum, t) => sum + t, 0) / 1000),
      memoryUsage: endMemory - startMemory,
      success: failures === 0,
      errorRate: (failures / (successes + failures)) * 100,
      p50: timings[Math.floor(timings.length * 0.5)],
      p95: timings[Math.floor(timings.length * 0.95)],
      p99: timings[Math.floor(timings.length * 0.99)]
    };
  }

  /**
   * Test admin operations performance
   */
  private async testAdminOperations(): Promise<PerformanceMetrics> {
    console.log('  🎛️ Testing Admin Operations...');

    const timings: number[] = [];
    let successes = 0;
    let failures = 0;

    const startMemory = process.memoryUsage().heapUsed;

    const operations = [
      () => memoryAdminService.getSystemHealth(),
      () => memoryAdminService.getMemoryAnalytics(),
      () => memoryAdminService.getVectorDatabaseStats(),
      () => memoryAdminService.manageConversations({}, 10, 0)
    ];

    for (let i = 0; i < 20; i++) {
      const operation = operations[i % operations.length];
      const startTime = Date.now();
      
      try {
        await operation();
        const duration = Date.now() - startTime;
        timings.push(duration);
        successes++;
      } catch (error) {
        failures++;
        timings.push(5000); // Penalty for failures
      }
    }

    const endMemory = process.memoryUsage().heapUsed;
    timings.sort((a, b) => a - b);

    return {
      operation: 'admin_operations',
      duration: timings.reduce((sum, t) => sum + t, 0) / timings.length,
      throughput: successes / (timings.reduce((sum, t) => sum + t, 0) / 1000),
      memoryUsage: endMemory - startMemory,
      success: failures === 0,
      errorRate: (failures / (successes + failures)) * 100,
      p50: timings[Math.floor(timings.length * 0.5)],
      p95: timings[Math.floor(timings.length * 0.95)],
      p99: timings[Math.floor(timings.length * 0.99)]
    };
  }

  /**
   * Run load tests with concurrent users
   */
  private async runLoadTests(): Promise<LoadTestResult[]> {
    const loadTests = [
      { name: 'embedding_load_test', concurrentUsers: 5, operations: 50 },
      { name: 'search_load_test', concurrentUsers: 10, operations: 100 },
      { name: 'capture_load_test', concurrentUsers: 8, operations: 80 },
      { name: 'mixed_operations_test', concurrentUsers: 12, operations: 120 }
    ];

    const results: LoadTestResult[] = [];

    for (const test of loadTests) {
      console.log(`  ⚡ Running ${test.name} (${test.concurrentUsers} users, ${test.operations} ops)...`);
      
      try {
        const result = await this.runConcurrentLoadTest(
          test.name,
          test.concurrentUsers,
          test.operations
        );
        results.push(result);
        
        // Cool down between tests
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Load test ${test.name} failed:`, error);
      }
    }

    return results;
  }

  /**
   * Run concurrent load test
   */
  private async runConcurrentLoadTest(
    testName: string,
    concurrentUsers: number,
    totalOperations: number
  ): Promise<LoadTestResult> {
    
    const operationsPerUser = Math.ceil(totalOperations / concurrentUsers);
    const promises: Promise<number[]>[] = [];

    const testStartTime = Date.now();

    // Create concurrent user simulations
    for (let user = 0; user < concurrentUsers; user++) {
      promises.push(this.simulateUserOperations(testName, operationsPerUser, user));
    }

    // Wait for all users to complete
    const allTimings = await Promise.all(promises);
    const flatTimings = allTimings.flat().filter(t => t > 0);

    const testEndTime = Date.now();
    const totalTestTime = (testEndTime - testStartTime) / 1000; // seconds

    flatTimings.sort((a, b) => a - b);

    const successfulOperations = flatTimings.length;
    const failedOperations = totalOperations - successfulOperations;

    return {
      testName,
      concurrentUsers,
      totalOperations,
      successfulOperations,
      failedOperations,
      averageResponseTime: flatTimings.reduce((sum, t) => sum + t, 0) / flatTimings.length,
      maxResponseTime: Math.max(...flatTimings),
      minResponseTime: Math.min(...flatTimings),
      throughputPerSecond: successfulOperations / totalTestTime,
      errorRate: (failedOperations / totalOperations) * 100,
      percentiles: {
        p50: flatTimings[Math.floor(flatTimings.length * 0.5)] || 0,
        p95: flatTimings[Math.floor(flatTimings.length * 0.95)] || 0,
        p99: flatTimings[Math.floor(flatTimings.length * 0.99)] || 0
      }
    };
  }

  /**
   * Simulate user operations for load testing
   */
  private async simulateUserOperations(
    testType: string,
    operationCount: number,
    userId: number
  ): Promise<number[]> {
    
    const timings: number[] = [];

    for (let i = 0; i < operationCount; i++) {
      const startTime = Date.now();
      
      try {
        switch (testType) {
          case 'embedding_load_test':
            await embeddingService.embedSingle(`User ${userId} operation ${i} test message`);
            break;
            
          case 'search_load_test':
            await semanticSearchService.quickSearch(`user ${userId} query ${i}`, 1, 5);
            break;
            
          case 'capture_load_test':
            const context = createContext(1, { entities: ['load', 'test'] });
            await captureUserMessage(`User ${userId} message ${i}`, context);
            break;
            
          case 'mixed_operations_test':
            if (i % 3 === 0) {
              await embeddingService.embedSingle(`Mixed test ${userId}-${i}`);
            } else if (i % 3 === 1) {
              await semanticSearchService.quickSearch(`mixed query ${userId}-${i}`, 1, 3);
            } else {
              const ctx = createContext(1, { entities: ['mixed'] });
              await captureUserMessage(`Mixed message ${userId}-${i}`, ctx);
            }
            break;
        }
        
        const duration = Date.now() - startTime;
        timings.push(duration);
        
      } catch (error) {
        // Record failure but continue
        timings.push(-1); // Negative timing indicates failure
      }
      
      // Small delay between operations to simulate realistic usage
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    return timings;
  }

  /**
   * Monitor system resource usage
   */
  private startResourceMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    const monitorInterval = setInterval(() => {
      const memUsage = process.memoryUsage();
      
      this.resourceUsage.push({
        timestamp: new Date().toISOString(),
        memoryUsage: {
          used: memUsage.heapUsed,
          total: memUsage.heapTotal,
          percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100
        }
      });
      
      // Keep only last 100 readings
      if (this.resourceUsage.length > 100) {
        this.resourceUsage = this.resourceUsage.slice(-100);
      }
      
    }, 1000); // Every second

    // Store interval reference for cleanup
    (this as any).monitorInterval = monitorInterval;
  }

  /**
   * Stop resource monitoring
   */
  private stopResourceMonitoring(): void {
    this.isMonitoring = false;
    
    if ((this as any).monitorInterval) {
      clearInterval((this as any).monitorInterval);
    }
  }

  /**
   * Generate performance summary
   */
  private generateSummary(
    individual: PerformanceMetrics[],
    loadTests: LoadTestResult[]
  ) {
    const overallSuccess = individual.every(test => test.success) && 
                          loadTests.every(test => test.errorRate < 10);

    const avgResponseTime = individual.reduce((sum, test) => sum + test.duration, 0) / individual.length;
    const totalThroughput = individual.reduce((sum, test) => sum + test.throughput, 0);

    return {
      overallResult: overallSuccess ? 'PASS' : 'FAIL',
      totalTests: individual.length + loadTests.length,
      passedTests: individual.filter(t => t.success).length + loadTests.filter(t => t.errorRate < 10).length,
      averageResponseTime: Math.round(avgResponseTime),
      totalThroughput: Math.round(totalThroughput),
      recommendations: this.generateRecommendations(individual, loadTests),
      performanceGrade: this.calculatePerformanceGrade(individual, loadTests)
    };
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(
    individual: PerformanceMetrics[],
    loadTests: LoadTestResult[]
  ): string[] {
    const recommendations: string[] = [];

    // Check individual test performance
    individual.forEach(test => {
      if (test.duration > 2000) {
        recommendations.push(`${test.operation}: Consider optimization - average response time ${test.duration}ms`);
      }
      if (test.errorRate > 5) {
        recommendations.push(`${test.operation}: High error rate ${test.errorRate.toFixed(1)}% needs investigation`);
      }
      if (test.throughput < 10) {
        recommendations.push(`${test.operation}: Low throughput ${test.throughput.toFixed(1)} ops/sec`);
      }
    });

    // Check load test performance
    loadTests.forEach(test => {
      if (test.averageResponseTime > 3000) {
        recommendations.push(`${test.testName}: High response time under load (${test.averageResponseTime}ms)`);
      }
      if (test.errorRate > 10) {
        recommendations.push(`${test.testName}: High error rate under load (${test.errorRate.toFixed(1)}%)`);
      }
      if (test.throughputPerSecond < 5) {
        recommendations.push(`${test.testName}: Low throughput under load (${test.throughputPerSecond.toFixed(1)} ops/sec)`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('✅ All performance metrics are within acceptable ranges');
    }

    return recommendations;
  }

  /**
   * Calculate overall performance grade
   */
  private calculatePerformanceGrade(
    individual: PerformanceMetrics[],
    loadTests: LoadTestResult[]
  ): string {
    let score = 100;

    // Deduct points for individual test issues
    individual.forEach(test => {
      if (!test.success) score -= 15;
      if (test.duration > 2000) score -= 10;
      if (test.errorRate > 5) score -= 10;
      if (test.throughput < 10) score -= 5;
    });

    // Deduct points for load test issues
    loadTests.forEach(test => {
      if (test.errorRate > 10) score -= 15;
      if (test.averageResponseTime > 3000) score -= 10;
      if (test.throughputPerSecond < 5) score -= 5;
    });

    if (score >= 90) return 'A (Excellent)';
    if (score >= 80) return 'B (Good)';
    if (score >= 70) return 'C (Acceptable)';
    if (score >= 60) return 'D (Needs Improvement)';
    return 'F (Poor)';
  }

  /**
   * Export results to JSON
   */
  exportResults(results: any): string {
    return JSON.stringify(results, null, 2);
  }

  /**
   * Export results to CSV
   */
  exportResultsToCSV(results: any): string {
    const lines: string[] = [];
    
    // Individual test results
    lines.push('Test Type,Operation,Duration (ms),Throughput (ops/sec),Success,Error Rate (%),P50,P95,P99');
    
    results.individual.forEach((test: PerformanceMetrics) => {
      lines.push([
        'Individual',
        test.operation,
        test.duration.toFixed(1),
        test.throughput.toFixed(2),
        test.success,
        test.errorRate.toFixed(1),
        test.p50,
        test.p95,
        test.p99
      ].join(','));
    });

    // Load test results
    lines.push(''); // Empty line separator
    lines.push('Test Type,Test Name,Concurrent Users,Avg Response (ms),Throughput (ops/sec),Error Rate (%),P50,P95,P99');
    
    results.loadTests.forEach((test: LoadTestResult) => {
      lines.push([
        'Load Test',
        test.testName,
        test.concurrentUsers,
        test.averageResponseTime.toFixed(1),
        test.throughputPerSecond.toFixed(2),
        test.errorRate.toFixed(1),
        test.percentiles.p50,
        test.percentiles.p95,
        test.percentiles.p99
      ].join(','));
    });

    return lines.join('\n');
  }
}

// Export singleton instance
export const performanceTester = new PerformanceTester();
