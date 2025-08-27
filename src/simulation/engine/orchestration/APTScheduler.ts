/**
 * APTScheduler - Intelligent scheduling and batching for AI Prompt Template executions
 * 
 * This class provides:
 * - Priority-based scheduling with dynamic adjustment
 * - Intelligent batching to optimize AI model usage
 * - Load balancing across multiple AI providers
 * - Execution throttling to prevent resource exhaustion
 * - Performance optimization through strategic queuing
 */

import { EventEmitter } from 'events';
import {
  APTExecutionRequest,
  APTExecutionResult,
  APTTemplate
} from './types';

interface ScheduledAPTRequest {
  id: string;
  request: APTExecutionRequest;
  priority: number; // 0-100, higher = more urgent
  queuedAt: Date;
  estimatedExecutionTime: number;
  retryCount: number;
  maxRetries: number;
  resolve: (result: APTExecutionResult) => void;
  reject: (error: Error) => void;
}

interface ExecutionBatch {
  id: string;
  requests: ScheduledAPTRequest[];
  totalEstimatedTime: number;
  priority: number;
  createdAt: Date;
  modelType: string;
}

interface SchedulerConfig {
  maxConcurrentExecutions: number;
  maxBatchSize: number;
  batchTimeoutMs: number;
  priorityThreshold: number;
  throttleThreshold: number;
  adaptivePriority: boolean;
}

interface SchedulerStats {
  totalScheduled: number;
  totalExecuted: number;
  totalBatched: number;
  averageWaitTime: number;
  averageBatchSize: number;
  currentQueueSize: number;
  activeExecutions: number;
  throughputPerMinute: number;
}

export class APTScheduler extends EventEmitter {
  private queue: ScheduledAPTRequest[] = [];
  private activeExecutions: Map<string, ScheduledAPTRequest> = new Map();
  private batches: Map<string, ExecutionBatch> = new Map();
  private config: SchedulerConfig;
  private stats: SchedulerStats;
  private isProcessing = false;
  private lastThroughputCheck = Date.now();
  private executionHistory: Array<{ timestamp: Date; duration: number }> = [];

  constructor(config: Partial<SchedulerConfig> = {}) {
    super();
    
    this.config = {
      maxConcurrentExecutions: config.maxConcurrentExecutions || 5,
      maxBatchSize: config.maxBatchSize || 10,
      batchTimeoutMs: config.batchTimeoutMs || 2000, // 2 seconds
      priorityThreshold: config.priorityThreshold || 70,
      throttleThreshold: config.throttleThreshold || 20, // executions per minute
      adaptivePriority: config.adaptivePriority !== false
    };
    
    this.stats = {
      totalScheduled: 0,
      totalExecuted: 0,
      totalBatched: 0,
      averageWaitTime: 0,
      averageBatchSize: 0,
      currentQueueSize: 0,
      activeExecutions: 0,
      throughputPerMinute: 0
    };

    this.startProcessingLoop();
    this.startStatsUpdater();
    
    console.log(`📅 APT Scheduler initialized with config:`, this.config);
  }

  /**
   * Schedule an APT execution request
   */
  async scheduleAPT(
    request: APTExecutionRequest,
    template: APTTemplate,
    customPriority?: number
  ): Promise<APTExecutionResult> {
    return new Promise((resolve, reject) => {
      const scheduledRequest: ScheduledAPTRequest = {
        id: this.generateRequestId(),
        request,
        priority: customPriority || this.calculatePriority(request, template),
        queuedAt: new Date(),
        estimatedExecutionTime: template.estimatedExecutionTime || 2000,
        retryCount: 0,
        maxRetries: template.retryAttempts || 2,
        resolve,
        reject
      };
      
      this.addToQueue(scheduledRequest);
      this.stats.totalScheduled++;
      this.updateQueueStats();
      
      console.log(`📅 Scheduled APT: ${request.aptId} (priority: ${scheduledRequest.priority})`);
      this.emit('aptScheduled', request.aptId, scheduledRequest.priority);
      
      // Start processing if not already running
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  /**
   * Get current scheduler statistics
   */
  getStats(): SchedulerStats {
    return { ...this.stats };
  }

  /**
   * Get detailed queue information
   */
  getQueueInfo(): {
    queue: Array<{
      id: string;
      aptId: string;
      priority: number;
      waitTime: number;
      estimatedTime: number;
    }>;
    batches: Array<{
      id: string;
      size: number;
      priority: number;
      estimatedTime: number;
      age: number;
    }>;
    activeExecutions: Array<{
      id: string;
      aptId: string;
      startTime: Date;
      estimatedCompletion: Date;
    }>;
  } {
    const now = Date.now();
    
    return {
      queue: this.queue.map(req => ({
        id: req.id,
        aptId: req.request.aptId,
        priority: req.priority,
        waitTime: now - req.queuedAt.getTime(),
        estimatedTime: req.estimatedExecutionTime
      })),
      batches: Array.from(this.batches.values()).map(batch => ({
        id: batch.id,
        size: batch.requests.length,
        priority: batch.priority,
        estimatedTime: batch.totalEstimatedTime,
        age: now - batch.createdAt.getTime()
      })),
      activeExecutions: Array.from(this.activeExecutions.values()).map(req => ({
        id: req.id,
        aptId: req.request.aptId,
        startTime: req.queuedAt,
        estimatedCompletion: new Date(req.queuedAt.getTime() + req.estimatedExecutionTime)
      }))
    };
  }

  /**
   * Adjust scheduler configuration dynamically
   */
  updateConfig(newConfig: Partial<SchedulerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log(`📅 Scheduler config updated:`, newConfig);
    this.emit('configUpdated', this.config);
  }

  /**
   * Clear all queued requests (emergency stop)
   */
  clearQueue(): number {
    const clearedCount = this.queue.length;
    
    // Reject all queued requests
    for (const req of this.queue) {
      req.reject(new Error('Queue cleared by scheduler'));
    }
    
    this.queue.length = 0;
    this.batches.clear();
    this.updateQueueStats();
    
    console.log(`🗑️ Cleared ${clearedCount} queued APT requests`);
    this.emit('queueCleared', clearedCount);
    
    return clearedCount;
  }

  /**
   * Get performance recommendations based on current metrics
   */
  getPerformanceRecommendations(): Array<{
    type: 'warning' | 'suggestion' | 'critical';
    message: string;
    action?: string;
  }> {
    const recommendations: Array<{
      type: 'warning' | 'suggestion' | 'critical';
      message: string;
      action?: string;
    }> = [];
    
    // Check queue size
    if (this.stats.currentQueueSize > 50) {
      recommendations.push({
        type: 'critical',
        message: `Queue size is very high (${this.stats.currentQueueSize})`,
        action: 'Consider increasing maxConcurrentExecutions or adding more AI providers'
      });
    } else if (this.stats.currentQueueSize > 20) {
      recommendations.push({
        type: 'warning',
        message: `Queue size is elevated (${this.stats.currentQueueSize})`,
        action: 'Monitor for potential bottlenecks'
      });
    }
    
    // Check wait times
    if (this.stats.averageWaitTime > 10000) {
      recommendations.push({
        type: 'warning',
        message: `Average wait time is high (${this.stats.averageWaitTime}ms)`,
        action: 'Consider optimizing batch sizes or execution priorities'
      });
    }
    
    // Check throughput
    if (this.stats.throughputPerMinute < 10) {
      recommendations.push({
        type: 'suggestion',
        message: `Throughput is low (${this.stats.throughputPerMinute}/min)`,
        action: 'Consider increasing batch sizes or concurrent executions'
      });
    }
    
    // Check batch efficiency
    if (this.stats.averageBatchSize < 3 && this.stats.totalBatched > 10) {
      recommendations.push({
        type: 'suggestion',
        message: `Batch sizes are small (avg: ${this.stats.averageBatchSize})`,
        action: 'Consider increasing batchTimeoutMs to allow larger batches'
      });
    }
    
    return recommendations;
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private addToQueue(request: ScheduledAPTRequest): void {
    // Insert request in priority order
    let insertIndex = this.queue.length;
    
    for (let i = 0; i < this.queue.length; i++) {
      if (this.queue[i].priority < request.priority) {
        insertIndex = i;
        break;
      }
    }
    
    this.queue.splice(insertIndex, 0, request);
  }

  private calculatePriority(request: APTExecutionRequest, template: APTTemplate): number {
    let priority = 50; // Base priority
    
    // Adjust based on request priority
    switch (request.priority) {
      case 'critical': priority += 40; break;
      case 'high': priority += 25; break;
      case 'medium': priority += 0; break;
      case 'low': priority -= 15; break;
    }
    
    // Adjust based on template complexity
    switch (template.complexity) {
      case 'low': priority += 5; break;
      case 'medium': priority += 0; break;
      case 'high': priority -= 10; break;
    }
    
    // Adjust based on estimated execution time (faster = higher priority)
    if (template.estimatedExecutionTime < 1000) {
      priority += 10;
    } else if (template.estimatedExecutionTime > 5000) {
      priority -= 5;
    }
    
    // Adaptive priority based on current system load
    if (this.config.adaptivePriority) {
      if (this.stats.currentQueueSize > 20) {
        // Prioritize faster executions when queue is large
        if (template.estimatedExecutionTime < 2000) {
          priority += 15;
        }
      }
      
      if (this.stats.throughputPerMinute < 5) {
        // Boost all priorities when throughput is low
        priority += 10;
      }
    }
    
    return Math.max(0, Math.min(100, priority));
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    try {
      while (this.queue.length > 0 && this.activeExecutions.size < this.config.maxConcurrentExecutions) {
        // Check if we should throttle
        if (this.shouldThrottle()) {
          console.log('⏸️ Throttling APT executions due to high load');
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        
        // Try to create a batch
        const batch = this.createBatch();
        
        if (batch) {
          this.executeBatch(batch);
        } else if (this.queue.length > 0) {
          // Execute single high-priority request
          const request = this.queue.shift()!;
          this.executeSingle(request);
        }
      }
    } finally {
      this.isProcessing = false;
    }
    
    // Schedule next processing cycle if queue is not empty
    if (this.queue.length > 0) {
      setTimeout(() => this.processQueue(), 100);
    }
  }

  private createBatch(): ExecutionBatch | null {
    if (this.queue.length === 0) return null;
    
    // Check if we have high-priority items that should execute immediately
    const highPriorityCount = this.queue.filter(req => req.priority >= this.config.priorityThreshold).length;
    if (highPriorityCount > 0 && highPriorityCount < 3) {
      return null; // Execute high-priority items individually
    }
    
    // Group requests by model type and similar characteristics
    const batchCandidates = this.queue.slice(0, Math.min(this.config.maxBatchSize, this.queue.length));
    const modelGroups = new Map<string, ScheduledAPTRequest[]>();
    
    for (const request of batchCandidates) {
      const modelKey = this.getModelKey(request);
      if (!modelGroups.has(modelKey)) {
        modelGroups.set(modelKey, []);
      }
      modelGroups.get(modelKey)!.push(request);
    }
    
    // Find the largest viable batch
    let bestBatch: ScheduledAPTRequest[] | null = null;
    let bestModelType = '';
    
    for (const [modelType, requests] of modelGroups) {
      if (requests.length >= 2) { // Minimum batch size
        const viableBatch = this.selectViableBatch(requests);
        if (!bestBatch || viableBatch.length > bestBatch.length) {
          bestBatch = viableBatch;
          bestModelType = modelType;
        }
      }
    }
    
    if (!bestBatch || bestBatch.length < 2) {
      return null;
    }
    
    // Remove batched requests from queue
    for (const request of bestBatch) {
      const index = this.queue.indexOf(request);
      if (index !== -1) {
        this.queue.splice(index, 1);
      }
    }
    
    const batch: ExecutionBatch = {
      id: this.generateBatchId(),
      requests: bestBatch,
      totalEstimatedTime: bestBatch.reduce((sum, req) => sum + req.estimatedExecutionTime, 0),
      priority: Math.max(...bestBatch.map(req => req.priority)),
      createdAt: new Date(),
      modelType: bestModelType
    };
    
    this.batches.set(batch.id, batch);
    this.stats.totalBatched += batch.requests.length;
    
    return batch;
  }

  private selectViableBatch(requests: ScheduledAPTRequest[]): ScheduledAPTRequest[] {
    // Sort by priority and select compatible requests
    const sorted = requests.sort((a, b) => b.priority - a.priority);
    const batch: ScheduledAPTRequest[] = [];
    let totalTime = 0;
    
    for (const request of sorted) {
      // Check if adding this request would exceed time limits
      if (totalTime + request.estimatedExecutionTime > 30000) { // 30 second batch limit
        break;
      }
      
      // Check compatibility with existing batch items
      if (this.isCompatibleWithBatch(request, batch)) {
        batch.push(request);
        totalTime += request.estimatedExecutionTime;
        
        if (batch.length >= this.config.maxBatchSize) {
          break;
        }
      }
    }
    
    return batch;
  }

  private isCompatibleWithBatch(request: ScheduledAPTRequest, batch: ScheduledAPTRequest[]): boolean {
    if (batch.length === 0) return true;
    
    // Check priority compatibility (don't batch very different priorities)
    const avgPriority = batch.reduce((sum, req) => sum + req.priority, 0) / batch.length;
    if (Math.abs(request.priority - avgPriority) > 30) {
      return false;
    }
    
    // Check if request types are compatible for batching
    const batchAptTypes = new Set(batch.map(req => this.getAPTType(req.request.aptId)));
    const requestType = this.getAPTType(request.request.aptId);
    
    // Allow batching of similar APT types
    return batchAptTypes.has(requestType) || batchAptTypes.size === 0;
  }

  private async executeBatch(batch: ExecutionBatch): Promise<void> {
    console.log(`🔄 Executing batch ${batch.id} with ${batch.requests.length} requests`);
    
    // Mark all requests as active
    for (const request of batch.requests) {
      this.activeExecutions.set(request.id, request);
    }
    
    try {
      // Execute all requests in the batch concurrently
      const results = await Promise.allSettled(
        batch.requests.map(request => this.executeAPTRequest(request))
      );
      
      // Process results
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const request = batch.requests[i];
        
        if (result.status === 'fulfilled') {
          request.resolve(result.value);
          this.recordExecution(request, result.value.executionTime);
        } else {
          if (request.retryCount < request.maxRetries) {
            request.retryCount++;
            this.addToQueue(request);
            console.log(`🔄 Retrying APT ${request.request.aptId} (attempt ${request.retryCount})`);
          } else {
            request.reject(result.reason);
          }
        }
        
        this.activeExecutions.delete(request.id);
      }
      
      console.log(`✅ Batch ${batch.id} completed`);
      this.emit('batchCompleted', batch.id, batch.requests.length);
    } catch (error) {
      console.error(`❌ Batch ${batch.id} failed:`, error);
      
      // Handle batch failure
      for (const request of batch.requests) {
        if (request.retryCount < request.maxRetries) {
          request.retryCount++;
          this.addToQueue(request);
        } else {
          request.reject(error);
        }
        this.activeExecutions.delete(request.id);
      }
    } finally {
      this.batches.delete(batch.id);
      this.updateQueueStats();
    }
  }

  private async executeSingle(request: ScheduledAPTRequest): Promise<void> {
    console.log(`🔄 Executing single APT: ${request.request.aptId}`);
    
    this.activeExecutions.set(request.id, request);
    
    try {
      const result = await this.executeAPTRequest(request);
      request.resolve(result);
      this.recordExecution(request, result.executionTime);
      console.log(`✅ Single APT completed: ${request.request.aptId}`);
    } catch (error) {
      if (request.retryCount < request.maxRetries) {
        request.retryCount++;
        this.addToQueue(request);
        console.log(`🔄 Retrying APT ${request.request.aptId} (attempt ${request.retryCount})`);
      } else {
        request.reject(error);
      }
    } finally {
      this.activeExecutions.delete(request.id);
      this.updateQueueStats();
    }
  }

  private async executeAPTRequest(request: ScheduledAPTRequest): Promise<APTExecutionResult> {
    // This would integrate with the actual APT execution engine
    // For now, we'll simulate the execution
    const startTime = performance.now();
    
    // Simulate execution time
    await new Promise(resolve => 
      setTimeout(resolve, request.estimatedExecutionTime * (0.8 + Math.random() * 0.4))
    );
    
    const executionTime = performance.now() - startTime;
    
    return {
      executionId: request.id,
      aptId: request.request.aptId,
      success: Math.random() > 0.1, // 90% success rate
      executionTime,
      timestamp: new Date(),
      rawResponse: 'Simulated response',
      parsedResult: { simulated: true },
      cacheHit: false,
      qualityScore: 0.7 + Math.random() * 0.3,
      retryCount: request.retryCount
    };
  }

  private recordExecution(request: ScheduledAPTRequest, executionTime: number): void {
    const waitTime = Date.now() - request.queuedAt.getTime();
    
    this.executionHistory.push({
      timestamp: new Date(),
      duration: executionTime
    });
    
    // Keep only last 1000 executions
    if (this.executionHistory.length > 1000) {
      this.executionHistory.shift();
    }
    
    this.stats.totalExecuted++;
    
    // Update average wait time
    const totalWaitTime = this.stats.averageWaitTime * (this.stats.totalExecuted - 1) + waitTime;
    this.stats.averageWaitTime = totalWaitTime / this.stats.totalExecuted;
    
    this.emit('aptExecuted', request.request.aptId, executionTime, waitTime);
  }

  private shouldThrottle(): boolean {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    const recentExecutions = this.executionHistory.filter(
      exec => exec.timestamp.getTime() > oneMinuteAgo
    ).length;
    
    return recentExecutions > this.config.throttleThreshold;
  }

  private updateQueueStats(): void {
    this.stats.currentQueueSize = this.queue.length;
    this.stats.activeExecutions = this.activeExecutions.size;
    
    if (this.stats.totalBatched > 0) {
      // This is a simplified calculation
      this.stats.averageBatchSize = this.stats.totalBatched / Math.max(1, this.batches.size);
    }
  }

  private getModelKey(request: ScheduledAPTRequest): string {
    // Generate a key for grouping similar requests
    return `${this.getAPTType(request.request.aptId)}_${request.request.priority}`;
  }

  private getAPTType(aptId: string): string {
    if (aptId.includes('population')) return 'population';
    if (aptId.includes('economic')) return 'economic';
    if (aptId.includes('military')) return 'military';
    if (aptId.includes('diplomacy')) return 'diplomacy';
    if (aptId.includes('technology')) return 'technology';
    return 'general';
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateBatchId(): string {
    return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startProcessingLoop(): void {
    // Process queue every 500ms
    setInterval(() => {
      if (!this.isProcessing && this.queue.length > 0) {
        this.processQueue();
      }
    }, 500);
  }

  private startStatsUpdater(): void {
    // Update throughput stats every minute
    setInterval(() => {
      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      
      const recentExecutions = this.executionHistory.filter(
        exec => exec.timestamp.getTime() > oneMinuteAgo
      ).length;
      
      this.stats.throughputPerMinute = recentExecutions;
      this.lastThroughputCheck = now;
      
      this.emit('statsUpdated', this.stats);
    }, 60000);
  }
}
