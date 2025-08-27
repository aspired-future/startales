import { APIExecutionContext, APIExecutionResult, APIHealthStatus } from './types';
import { BaseAPI } from './BaseAPI';
import { EventEmitter } from 'events';
import { DatabasePool } from 'pg';

// Parallel execution configuration
interface ParallelExecutionConfig {
  maxConcurrentTasks: number;
  taskTimeoutMs: number;
  retryAttempts: number;
  priorityLevels: number;
  resourceLimits: {
    maxMemoryMB: number;
    maxCpuPercent: number;
  };
}

// Task execution metadata
interface ExecutionTask {
  id: string;
  api: BaseAPI;
  context: APIExecutionContext;
  priority: number;
  estimatedDuration: number;
  memoryRequirement: number;
  dependencies: string[];
  retryCount: number;
  startTime?: number;
  endTime?: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  result?: APIExecutionResult;
  error?: Error;
}

// Resource monitoring
interface ResourceUsage {
  memoryMB: number;
  cpuPercent: number;
  activeTasks: number;
  queuedTasks: number;
}

// Execution statistics
interface ExecutionStats {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageExecutionTime: number;
  throughputPerSecond: number;
  resourceEfficiency: number;
}

// Parallel execution result
interface ParallelExecutionResult {
  executionId: string;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  executionTimeMs: number;
  results: Map<string, APIExecutionResult>;
  errors: Map<string, Error>;
  stats: ExecutionStats;
}

export class ParallelExecutionEngine extends EventEmitter {
  private config: ParallelExecutionConfig;
  private taskQueue: ExecutionTask[] = [];
  private runningTasks: Map<string, ExecutionTask> = new Map();
  private completedTasks: Map<string, ExecutionTask> = new Map();
  private resourceMonitor: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private executionId: string = '';

  constructor(config: Partial<ParallelExecutionConfig> = {}) {
    super();
    
    this.config = {
      maxConcurrentTasks: config.maxConcurrentTasks || 8,
      taskTimeoutMs: config.taskTimeoutMs || 30000,
      retryAttempts: config.retryAttempts || 3,
      priorityLevels: config.priorityLevels || 5,
      resourceLimits: {
        maxMemoryMB: config.resourceLimits?.maxMemoryMB || 2048,
        maxCpuPercent: config.resourceLimits?.maxCpuPercent || 80,
        ...config.resourceLimits
      }
    };

    this.startResourceMonitoring();
  }

  /**
   * Execute multiple APIs in parallel with intelligent scheduling
   */
  async executeParallel(
    apis: BaseAPI[],
    contexts: APIExecutionContext[],
    options: {
      priorityOverrides?: Map<string, number>;
      dependencyGraph?: Map<string, string[]>;
      executionStrategy?: 'balanced' | 'priority' | 'resource-optimal';
    } = {}
  ): Promise<ParallelExecutionResult> {
    this.executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    console.log(`🚀 Starting parallel execution ${this.executionId} with ${apis.length} tasks`);

    // Create execution tasks
    const tasks = this.createExecutionTasks(apis, contexts, options);
    
    // Add tasks to queue with priority sorting
    this.taskQueue = this.sortTasksByPriority(tasks, options.executionStrategy || 'balanced');
    
    this.isRunning = true;
    this.emit('executionStarted', { executionId: this.executionId, taskCount: tasks.length });

    try {
      // Execute tasks with intelligent scheduling
      await this.executeTaskQueue();
      
      const endTime = Date.now();
      const result = this.buildExecutionResult(startTime, endTime);
      
      console.log(`✅ Parallel execution ${this.executionId} completed: ${result.completedTasks}/${result.totalTasks} tasks`);
      this.emit('executionCompleted', result);
      
      return result;
    } catch (error) {
      console.error(`❌ Parallel execution ${this.executionId} failed:`, error);
      this.emit('executionFailed', { executionId: this.executionId, error });
      throw error;
    } finally {
      this.isRunning = false;
      this.cleanup();
    }
  }

  /**
   * Execute civilization systems with optimized parallel processing
   */
  async executeCivilizationSystems(
    civilizationApis: BaseAPI[],
    civilizationContexts: APIExecutionContext[],
    options: {
      civilizationId?: string;
      systemPriorities?: Map<string, number>;
      resourceAllocation?: 'equal' | 'weighted' | 'adaptive';
    } = {}
  ): Promise<ParallelExecutionResult> {
    console.log(`🏛️ Executing civilization systems for ${options.civilizationId || 'unknown'}`);

    // Optimize for civilization-specific execution patterns
    const civilizationConfig = {
      ...this.config,
      maxConcurrentTasks: Math.min(civilizationApis.length, 6), // Optimal for civilization systems
      taskTimeoutMs: 45000, // Longer timeout for complex civilization analysis
    };

    const tempConfig = this.config;
    this.config = civilizationConfig;

    try {
      const result = await this.executeParallel(civilizationApis, civilizationContexts, {
        priorityOverrides: options.systemPriorities,
        executionStrategy: 'resource-optimal',
        dependencyGraph: this.buildCivilizationDependencies(civilizationApis)
      });

      console.log(`🏛️ Civilization systems execution completed for ${options.civilizationId}`);
      return result;
    } finally {
      this.config = tempConfig;
    }
  }

  /**
   * Get current execution status and metrics
   */
  getExecutionStatus(): {
    isRunning: boolean;
    executionId: string;
    queuedTasks: number;
    runningTasks: number;
    completedTasks: number;
    resourceUsage: ResourceUsage;
  } {
    return {
      isRunning: this.isRunning,
      executionId: this.executionId,
      queuedTasks: this.taskQueue.length,
      runningTasks: this.runningTasks.size,
      completedTasks: this.completedTasks.size,
      resourceUsage: this.getCurrentResourceUsage()
    };
  }

  /**
   * Cancel current execution
   */
  async cancelExecution(): Promise<void> {
    console.log(`🛑 Cancelling parallel execution ${this.executionId}`);
    
    this.isRunning = false;
    
    // Cancel running tasks
    for (const task of this.runningTasks.values()) {
      task.status = 'cancelled';
    }
    
    // Clear queue
    this.taskQueue.forEach(task => task.status = 'cancelled');
    this.taskQueue = [];
    
    this.emit('executionCancelled', { executionId: this.executionId });
  }

  // ============================================================================
  // PRIVATE IMPLEMENTATION METHODS
  // ============================================================================

  private createExecutionTasks(
    apis: BaseAPI[],
    contexts: APIExecutionContext[],
    options: any
  ): ExecutionTask[] {
    return apis.map((api, index) => {
      const apiId = api.getConfig().id;
      const context = contexts[index] || contexts[0]; // Fallback to first context
      
      return {
        id: `${apiId}_${index}`,
        api,
        context,
        priority: options.priorityOverrides?.get(apiId) || 3, // Default medium priority
        estimatedDuration: this.estimateTaskDuration(api),
        memoryRequirement: this.estimateMemoryRequirement(api),
        dependencies: options.dependencyGraph?.get(apiId) || [],
        retryCount: 0,
        status: 'pending'
      };
    });
  }

  private sortTasksByPriority(tasks: ExecutionTask[], strategy: string): ExecutionTask[] {
    switch (strategy) {
      case 'priority':
        return tasks.sort((a, b) => b.priority - a.priority);
      
      case 'resource-optimal':
        return tasks.sort((a, b) => {
          // Balance priority with resource efficiency
          const aScore = a.priority * 2 - (a.memoryRequirement / 100) - (a.estimatedDuration / 1000);
          const bScore = b.priority * 2 - (b.memoryRequirement / 100) - (b.estimatedDuration / 1000);
          return bScore - aScore;
        });
      
      case 'balanced':
      default:
        return tasks.sort((a, b) => {
          // Balance priority, duration, and dependencies
          const aScore = a.priority - (a.dependencies.length * 0.5) - (a.estimatedDuration / 2000);
          const bScore = b.priority - (b.dependencies.length * 0.5) - (b.estimatedDuration / 2000);
          return bScore - aScore;
        });
    }
  }

  private async executeTaskQueue(): Promise<void> {
    while (this.isRunning && (this.taskQueue.length > 0 || this.runningTasks.size > 0)) {
      // Start new tasks if resources allow
      await this.startAvailableTasks();
      
      // Wait for some tasks to complete
      if (this.runningTasks.size > 0) {
        await this.waitForTaskCompletion();
      }
      
      // Small delay to prevent tight loop
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  private async startAvailableTasks(): Promise<void> {
    const resourceUsage = this.getCurrentResourceUsage();
    
    while (
      this.taskQueue.length > 0 &&
      this.runningTasks.size < this.config.maxConcurrentTasks &&
      resourceUsage.memoryMB < this.config.resourceLimits.maxMemoryMB &&
      resourceUsage.cpuPercent < this.config.resourceLimits.maxCpuPercent
    ) {
      const task = this.findNextExecutableTask();
      if (!task) break;
      
      // Remove from queue and start execution
      this.taskQueue = this.taskQueue.filter(t => t.id !== task.id);
      await this.startTask(task);
    }
  }

  private findNextExecutableTask(): ExecutionTask | null {
    for (const task of this.taskQueue) {
      if (this.areTaskDependenciesSatisfied(task)) {
        return task;
      }
    }
    return null;
  }

  private areTaskDependenciesSatisfied(task: ExecutionTask): boolean {
    return task.dependencies.every(depId => 
      this.completedTasks.has(depId) && 
      this.completedTasks.get(depId)?.status === 'completed'
    );
  }

  private async startTask(task: ExecutionTask): Promise<void> {
    task.status = 'running';
    task.startTime = Date.now();
    this.runningTasks.set(task.id, task);
    
    console.log(`▶️ Starting task ${task.id} (${task.api.getConfig().name})`);
    this.emit('taskStarted', { taskId: task.id, apiName: task.api.getConfig().name });

    // Execute task with timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Task timeout')), this.config.taskTimeoutMs);
    });

    try {
      const result = await Promise.race([
        task.api.execute(task.context),
        timeoutPromise
      ]);
      
      await this.completeTask(task, result);
    } catch (error) {
      await this.failTask(task, error as Error);
    }
  }

  private async completeTask(task: ExecutionTask, result: APIExecutionResult): Promise<void> {
    task.status = 'completed';
    task.endTime = Date.now();
    task.result = result;
    
    this.runningTasks.delete(task.id);
    this.completedTasks.set(task.id, task);
    
    const duration = task.endTime! - task.startTime!;
    console.log(`✅ Task ${task.id} completed in ${duration}ms`);
    this.emit('taskCompleted', { taskId: task.id, duration, result });
  }

  private async failTask(task: ExecutionTask, error: Error): Promise<void> {
    task.retryCount++;
    
    if (task.retryCount <= this.config.retryAttempts) {
      console.log(`🔄 Retrying task ${task.id} (attempt ${task.retryCount}/${this.config.retryAttempts})`);
      
      // Reset task and add back to queue with lower priority
      task.status = 'pending';
      task.priority = Math.max(1, task.priority - 1);
      task.startTime = undefined;
      
      this.runningTasks.delete(task.id);
      this.taskQueue.unshift(task); // Add to front for retry
      
      this.emit('taskRetry', { taskId: task.id, attempt: task.retryCount, error });
    } else {
      task.status = 'failed';
      task.endTime = Date.now();
      task.error = error;
      
      this.runningTasks.delete(task.id);
      this.completedTasks.set(task.id, task);
      
      console.error(`❌ Task ${task.id} failed after ${task.retryCount} attempts:`, error.message);
      this.emit('taskFailed', { taskId: task.id, error });
    }
  }

  private async waitForTaskCompletion(): Promise<void> {
    return new Promise(resolve => {
      const checkCompletion = () => {
        if (this.runningTasks.size === 0) {
          resolve();
        } else {
          setTimeout(checkCompletion, 50);
        }
      };
      checkCompletion();
    });
  }

  private buildCivilizationDependencies(apis: BaseAPI[]): Map<string, string[]> {
    const dependencies = new Map<string, string[]>();
    
    // Define logical dependencies for civilization systems
    const apiIds = apis.map(api => api.getConfig().id);
    
    // Population depends on nothing (base system)
    if (apiIds.includes('population-api')) {
      dependencies.set('population-api', []);
    }
    
    // Economics depends on population
    if (apiIds.includes('economics-api') && apiIds.includes('population-api')) {
      dependencies.set('economics-api', ['population-api']);
    }
    
    // Military depends on population and economics
    if (apiIds.includes('military-api')) {
      const deps = [];
      if (apiIds.includes('population-api')) deps.push('population-api');
      if (apiIds.includes('economics-api')) deps.push('economics-api');
      dependencies.set('military-api', deps);
    }
    
    // Technology depends on economics
    if (apiIds.includes('technology-api') && apiIds.includes('economics-api')) {
      dependencies.set('technology-api', ['economics-api']);
    }
    
    // Cultural depends on population
    if (apiIds.includes('cultural-api') && apiIds.includes('population-api')) {
      dependencies.set('cultural-api', ['population-api']);
    }
    
    // Governance depends on population and cultural
    if (apiIds.includes('governance-api')) {
      const deps = [];
      if (apiIds.includes('population-api')) deps.push('population-api');
      if (apiIds.includes('cultural-api')) deps.push('cultural-api');
      dependencies.set('governance-api', deps);
    }
    
    return dependencies;
  }

  private estimateTaskDuration(api: BaseAPI): number {
    const config = api.getConfig();
    // Estimate based on API complexity and historical data
    const baseTime = 2000; // 2 seconds base
    const complexityMultiplier = config.category === 'specialized' ? 1.5 : 1.0;
    return baseTime * complexityMultiplier;
  }

  private estimateMemoryRequirement(api: BaseAPI): number {
    const config = api.getConfig();
    // Estimate based on API type and complexity
    const baseMemory = 64; // 64MB base
    const complexityMultiplier = config.category === 'specialized' ? 1.5 : 1.0;
    return baseMemory * complexityMultiplier;
  }

  private getCurrentResourceUsage(): ResourceUsage {
    const memoryUsage = process.memoryUsage();
    return {
      memoryMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      cpuPercent: 0, // Would need external library for accurate CPU measurement
      activeTasks: this.runningTasks.size,
      queuedTasks: this.taskQueue.length
    };
  }

  private buildExecutionResult(startTime: number, endTime: number): ParallelExecutionResult {
    const executionTimeMs = endTime - startTime;
    const allTasks = Array.from(this.completedTasks.values());
    const completedTasks = allTasks.filter(t => t.status === 'completed');
    const failedTasks = allTasks.filter(t => t.status === 'failed');
    
    const results = new Map<string, APIExecutionResult>();
    const errors = new Map<string, Error>();
    
    completedTasks.forEach(task => {
      if (task.result) results.set(task.id, task.result);
    });
    
    failedTasks.forEach(task => {
      if (task.error) errors.set(task.id, task.error);
    });
    
    const avgExecutionTime = completedTasks.length > 0 
      ? completedTasks.reduce((sum, task) => sum + (task.endTime! - task.startTime!), 0) / completedTasks.length
      : 0;
    
    const throughputPerSecond = completedTasks.length / (executionTimeMs / 1000);
    const resourceEfficiency = completedTasks.length / allTasks.length;
    
    return {
      executionId: this.executionId,
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      failedTasks: failedTasks.length,
      executionTimeMs,
      results,
      errors,
      stats: {
        totalTasks: allTasks.length,
        completedTasks: completedTasks.length,
        failedTasks: failedTasks.length,
        averageExecutionTime: avgExecutionTime,
        throughputPerSecond,
        resourceEfficiency
      }
    };
  }

  private startResourceMonitoring(): void {
    this.resourceMonitor = setInterval(() => {
      const usage = this.getCurrentResourceUsage();
      this.emit('resourceUpdate', usage);
      
      // Emit warnings if resources are high
      if (usage.memoryMB > this.config.resourceLimits.maxMemoryMB * 0.9) {
        this.emit('resourceWarning', { type: 'memory', usage: usage.memoryMB, limit: this.config.resourceLimits.maxMemoryMB });
      }
    }, 1000);
  }

  private cleanup(): void {
    this.taskQueue = [];
    this.runningTasks.clear();
    this.completedTasks.clear();
    this.executionId = '';
  }

  /**
   * Shutdown the parallel execution engine
   */
  shutdown(): void {
    if (this.resourceMonitor) {
      clearInterval(this.resourceMonitor);
      this.resourceMonitor = null;
    }
    
    this.cancelExecution();
    this.removeAllListeners();
  }
}

// Factory function for creating parallel execution engine
export function createParallelExecutionEngine(config?: Partial<ParallelExecutionConfig>): ParallelExecutionEngine {
  return new ParallelExecutionEngine(config);
}

// Export types for external use
export type {
  ParallelExecutionConfig,
  ExecutionTask,
  ResourceUsage,
  ExecutionStats,
  ParallelExecutionResult
};
