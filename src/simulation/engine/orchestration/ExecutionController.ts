/**
 * ExecutionController - Controls API execution with timeout, cancellation, and resource management
 * 
 * This class is responsible for:
 * - Executing API calls with proper timeout handling
 * - Managing execution cancellation and cleanup
 * - Tracking active executions and resource usage
 * - Providing execution statistics and monitoring
 */

import { EventEmitter } from 'events';
import {
  APIExecutionContext,
  APIExecutionResult,
  IExecutionController,
  ExecutionMetrics,
  SystemDefinition
} from './types';

interface ActiveExecution {
  executionId: string;
  systemId: string;
  startTime: Date;
  timeoutMs: number;
  abortController: AbortController;
  promise: Promise<APIExecutionResult>;
  resolve: (result: APIExecutionResult) => void;
  reject: (error: Error) => void;
}

interface ExecutionLimits {
  maxConcurrentExecutions: number;
  maxExecutionTime: number;
  maxMemoryUsage: number;
  maxRetryAttempts: number;
}

export class ExecutionController extends EventEmitter implements IExecutionController {
  private activeExecutions: Map<string, ActiveExecution> = new Map();
  private executionQueue: APIExecutionContext[] = [];
  private executionHistory: Map<string, ExecutionMetrics[]> = new Map();
  private limits: ExecutionLimits;
  private isProcessingQueue = false;

  constructor(limits: Partial<ExecutionLimits> = {}) {
    super();
    
    this.limits = {
      maxConcurrentExecutions: limits.maxConcurrentExecutions || 10,
      maxExecutionTime: limits.maxExecutionTime || 30000, // 30 seconds
      maxMemoryUsage: limits.maxMemoryUsage || 500 * 1024 * 1024, // 500MB
      maxRetryAttempts: limits.maxRetryAttempts || 3
    };

    // Start queue processor
    this.startQueueProcessor();
    
    // Monitor resource usage
    this.startResourceMonitoring();
  }

  /**
   * Execute a system API with full timeout and cancellation support
   */
  async executeSystem(
    systemId: string, 
    context: APIExecutionContext
  ): Promise<APIExecutionResult> {
    const executionId = context.executionId;
    
    try {
      console.log(`🚀 Starting execution: ${systemId} (${executionId})`);
      
      // Check execution limits
      await this.checkExecutionLimits(systemId, context);
      
      // Create execution with timeout
      const result = await this.executeWithTimeout(
        () => this.performSystemExecution(systemId, context),
        context.timeoutMs || this.limits.maxExecutionTime,
        executionId
      );
      
      // Record successful execution
      this.recordExecutionMetrics(systemId, result.executionMetrics, true);
      
      console.log(`✅ Completed execution: ${systemId} (${executionId}) in ${result.executionTime}ms`);
      
      return result;
    } catch (error) {
      console.error(`❌ Failed execution: ${systemId} (${executionId}):`, error);
      
      // Record failed execution
      this.recordExecutionMetrics(systemId, {
        executionTime: Date.now() - context.timestamp.getTime(),
        memoryUsage: 0,
        cpuTime: 0,
        cacheHits: 0,
        cacheMisses: 0,
        retryCount: 0,
        fallbacksUsed: 0
      }, false);
      
      // Create error result
      const errorResult: APIExecutionResult = {
        executionId,
        systemId,
        success: false,
        executionTime: Date.now() - context.timestamp.getTime(),
        timestamp: new Date(),
        gameStateUpdates: {},
        civilizationUpdates: new Map(),
        systemOutputs: null,
        eventsGenerated: [],
        scheduledActions: [],
        executionMetrics: {
          executionTime: Date.now() - context.timestamp.getTime(),
          memoryUsage: 0,
          cpuTime: 0,
          cacheHits: 0,
          cacheMisses: 0,
          retryCount: 0,
          fallbacksUsed: 0
        },
        error: error.message
      };
      
      return errorResult;
    }
  }

  /**
   * Execute operation with timeout and cancellation support
   */
  async executeWithTimeout<T>(
    operation: (signal: AbortSignal) => Promise<T>,
    timeoutMs: number,
    executionId?: string
  ): Promise<T> {
    const controller = new AbortController();
    const id = executionId || this.generateExecutionId();
    
    // Set up timeout
    const timeoutHandle = setTimeout(() => {
      controller.abort();
    }, timeoutMs);
    
    try {
      // Execute operation with abort signal
      const result = await Promise.race([
        operation(controller.signal),
        this.createTimeoutPromise(timeoutMs)
      ]);
      
      clearTimeout(timeoutHandle);
      return result;
    } catch (error) {
      clearTimeout(timeoutHandle);
      
      if (controller.signal.aborted) {
        throw new Error(`Execution timeout after ${timeoutMs}ms`);
      }
      
      throw error;
    } finally {
      // Clean up active execution tracking
      if (executionId && this.activeExecutions.has(executionId)) {
        this.activeExecutions.delete(executionId);
      }
    }
  }

  /**
   * Cancel a specific execution
   */
  cancelExecution(executionId: string): void {
    const execution = this.activeExecutions.get(executionId);
    
    if (execution) {
      console.log(`🛑 Cancelling execution: ${execution.systemId} (${executionId})`);
      
      execution.abortController.abort();
      execution.reject(new Error('Execution cancelled'));
      
      this.activeExecutions.delete(executionId);
      
      this.emit('executionCancelled', executionId, execution.systemId);
    }
  }

  /**
   * Cancel all active executions
   */
  cancelAllExecutions(): void {
    console.log(`🛑 Cancelling all ${this.activeExecutions.size} active executions`);
    
    const executionIds = Array.from(this.activeExecutions.keys());
    
    for (const executionId of executionIds) {
      this.cancelExecution(executionId);
    }
    
    // Clear the queue as well
    this.executionQueue.length = 0;
    
    console.log('✅ All executions cancelled');
  }

  /**
   * Get execution statistics
   */
  getExecutionStatistics(): {
    activeExecutions: number;
    queuedExecutions: number;
    totalExecutions: number;
    averageExecutionTime: number;
    successRate: number;
    systemStats: Map<string, {
      totalExecutions: number;
      averageTime: number;
      successRate: number;
      lastExecution: Date;
    }>;
  } {
    const systemStats = new Map();
    let totalExecutions = 0;
    let totalTime = 0;
    let totalSuccesses = 0;

    for (const [systemId, metrics] of this.executionHistory) {
      const systemMetrics = {
        totalExecutions: metrics.length,
        averageTime: metrics.reduce((sum, m) => sum + m.executionTime, 0) / metrics.length,
        successRate: metrics.filter(m => m.fallbacksUsed === 0).length / metrics.length,
        lastExecution: new Date(Math.max(...metrics.map(m => Date.now() - m.executionTime)))
      };
      
      systemStats.set(systemId, systemMetrics);
      
      totalExecutions += metrics.length;
      totalTime += metrics.reduce((sum, m) => sum + m.executionTime, 0);
      totalSuccesses += metrics.filter(m => m.fallbacksUsed === 0).length;
    }

    return {
      activeExecutions: this.activeExecutions.size,
      queuedExecutions: this.executionQueue.length,
      totalExecutions,
      averageExecutionTime: totalExecutions > 0 ? totalTime / totalExecutions : 0,
      successRate: totalExecutions > 0 ? totalSuccesses / totalExecutions : 0,
      systemStats
    };
  }

  /**
   * Queue execution for later processing
   */
  queueExecution(context: APIExecutionContext): void {
    this.executionQueue.push(context);
    
    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async performSystemExecution(
    systemId: string,
    context: APIExecutionContext
  ): Promise<APIExecutionResult> {
    const startTime = performance.now();
    const startMemory = process.memoryUsage().heapUsed;
    
    try {
      // This would be replaced with actual API call to the system
      // For now, we'll simulate the execution
      const result = await this.simulateSystemExecution(systemId, context);
      
      const endTime = performance.now();
      const endMemory = process.memoryUsage().heapUsed;
      
      // Add execution metrics
      result.executionMetrics = {
        executionTime: endTime - startTime,
        memoryUsage: endMemory - startMemory,
        cpuTime: endTime - startTime, // Simplified
        cacheHits: 0,
        cacheMisses: 0,
        retryCount: 0,
        fallbacksUsed: 0
      };
      
      result.executionTime = endTime - startTime;
      
      return result;
    } catch (error) {
      throw new Error(`System execution failed: ${error.message}`);
    }
  }

  private async simulateSystemExecution(
    systemId: string,
    context: APIExecutionContext
  ): Promise<APIExecutionResult> {
    // Simulate execution time based on system complexity
    const executionTime = Math.random() * 2000 + 500; // 500-2500ms
    await new Promise(resolve => setTimeout(resolve, executionTime));
    
    return {
      executionId: context.executionId,
      systemId,
      success: true,
      executionTime,
      timestamp: new Date(),
      gameStateUpdates: {},
      civilizationUpdates: new Map(),
      systemOutputs: {
        message: `System ${systemId} executed successfully`,
        data: { processed: true }
      },
      eventsGenerated: [],
      scheduledActions: [],
      executionMetrics: {
        executionTime,
        memoryUsage: 0,
        cpuTime: 0,
        cacheHits: 0,
        cacheMisses: 0,
        retryCount: 0,
        fallbacksUsed: 0
      }
    };
  }

  private async checkExecutionLimits(
    systemId: string,
    context: APIExecutionContext
  ): Promise<void> {
    // Check concurrent execution limit
    if (this.activeExecutions.size >= this.limits.maxConcurrentExecutions) {
      throw new Error(
        `Execution limit reached: ${this.activeExecutions.size}/${this.limits.maxConcurrentExecutions}`
      );
    }
    
    // Check memory usage
    const memoryUsage = process.memoryUsage().heapUsed;
    if (memoryUsage > this.limits.maxMemoryUsage) {
      throw new Error(
        `Memory limit exceeded: ${Math.round(memoryUsage / 1024 / 1024)}MB > ${Math.round(this.limits.maxMemoryUsage / 1024 / 1024)}MB`
      );
    }
    
    // Check system-specific limits
    const systemHistory = this.executionHistory.get(systemId) || [];
    const recentFailures = systemHistory
      .filter(m => Date.now() - m.executionTime < 60000) // Last minute
      .filter(m => m.fallbacksUsed > 0).length;
    
    if (recentFailures > 5) {
      throw new Error(`System ${systemId} has too many recent failures: ${recentFailures}`);
    }
  }

  private createTimeoutPromise<T>(timeoutMs: number): Promise<T> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timeout after ${timeoutMs}ms`));
      }, timeoutMs);
    });
  }

  private recordExecutionMetrics(
    systemId: string,
    metrics: ExecutionMetrics,
    success: boolean
  ): void {
    if (!this.executionHistory.has(systemId)) {
      this.executionHistory.set(systemId, []);
    }
    
    const history = this.executionHistory.get(systemId)!;
    history.push({
      ...metrics,
      fallbacksUsed: success ? 0 : 1 // Simple success/failure tracking
    });
    
    // Keep only last 100 executions per system
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    // Emit metrics event
    this.emit('executionMetrics', systemId, metrics, success);
  }

  private generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startQueueProcessor(): void {
    setInterval(() => {
      if (!this.isProcessingQueue && this.executionQueue.length > 0) {
        this.processQueue();
      }
    }, 1000); // Check every second
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.executionQueue.length === 0) {
      return;
    }
    
    this.isProcessingQueue = true;
    
    try {
      while (this.executionQueue.length > 0 && this.activeExecutions.size < this.limits.maxConcurrentExecutions) {
        const context = this.executionQueue.shift()!;
        
        // Execute without waiting
        this.executeSystem(context.systemSpecificData?.systemId || 'unknown', context)
          .catch(error => {
            console.error('Queued execution failed:', error);
          });
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  private startResourceMonitoring(): void {
    setInterval(() => {
      const memoryUsage = process.memoryUsage();
      const activeCount = this.activeExecutions.size;
      
      // Emit resource usage metrics
      this.emit('resourceUsage', {
        memoryUsage: memoryUsage.heapUsed,
        activeExecutions: activeCount,
        queuedExecutions: this.executionQueue.length
      });
      
      // Check for resource pressure
      if (memoryUsage.heapUsed > this.limits.maxMemoryUsage * 0.8) {
        this.emit('resourcePressure', {
          type: 'memory',
          usage: memoryUsage.heapUsed,
          limit: this.limits.maxMemoryUsage,
          percentage: (memoryUsage.heapUsed / this.limits.maxMemoryUsage) * 100
        });
      }
      
      if (activeCount > this.limits.maxConcurrentExecutions * 0.8) {
        this.emit('resourcePressure', {
          type: 'concurrency',
          usage: activeCount,
          limit: this.limits.maxConcurrentExecutions,
          percentage: (activeCount / this.limits.maxConcurrentExecutions) * 100
        });
      }
    }, 5000); // Check every 5 seconds
  }
}
