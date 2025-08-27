/**
 * CircuitBreaker - Fault tolerance mechanism for system executions
 * 
 * This class implements the Circuit Breaker pattern to:
 * - Prevent cascade failures across systems
 * - Provide fast failure when systems are down
 * - Allow automatic recovery when systems recover
 * - Track system health and failure patterns
 */

import { EventEmitter } from 'events';
import {
  CircuitBreakerState,
  CircuitBreakerConfig
} from './types';

interface CircuitBreakerMetrics {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  timeouts: number;
  circuitOpenTime: number;
  lastFailureTime: Date | null;
  lastSuccessTime: Date | null;
  averageResponseTime: number;
}

export class CircuitBreaker extends EventEmitter {
  private state: CircuitBreakerState;
  private config: CircuitBreakerConfig;
  private metrics: CircuitBreakerMetrics;
  private responseTimeHistory: number[] = [];
  private systemId: string;

  constructor(systemId: string, config: Partial<CircuitBreakerConfig> = {}) {
    super();
    
    this.systemId = systemId;
    this.config = {
      failureThreshold: config.failureThreshold || 5,
      recoveryTimeMs: config.recoveryTimeMs || 60000, // 1 minute
      successThreshold: config.successThreshold || 3,
      timeoutMs: config.timeoutMs || 30000 // 30 seconds
    };
    
    this.state = {
      state: 'CLOSED',
      failureCount: 0,
      lastFailureTime: new Date(0),
      successCount: 0,
      lastSuccessTime: new Date(0)
    };
    
    this.metrics = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      timeouts: 0,
      circuitOpenTime: 0,
      lastFailureTime: null,
      lastSuccessTime: null,
      averageResponseTime: 0
    };

    console.log(`🔌 Circuit breaker initialized for system: ${systemId}`);
  }

  /**
   * Execute operation with circuit breaker protection
   */
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    // Check circuit state before execution
    if (this.state.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state.state = 'HALF_OPEN';
        this.state.successCount = 0;
        console.log(`🔄 Circuit breaker for ${this.systemId} moved to HALF_OPEN`);
        this.emit('stateChanged', 'HALF_OPEN', this.systemId);
      } else {
        const error = new Error(`Circuit breaker is OPEN for system ${this.systemId}`);
        this.emit('callRejected', this.systemId, error);
        throw error;
      }
    }

    const startTime = performance.now();
    this.metrics.totalCalls++;

    try {
      // Execute operation with timeout
      const result = await Promise.race([
        operation(),
        this.createTimeoutPromise()
      ]);

      const responseTime = performance.now() - startTime;
      this.recordSuccess(responseTime);
      
      return result;
    } catch (error) {
      const responseTime = performance.now() - startTime;
      
      if (error.message.includes('timeout')) {
        this.recordTimeout(responseTime);
      } else {
        this.recordFailure(responseTime);
      }
      
      throw error;
    }
  }

  /**
   * Get current circuit breaker state
   */
  getState(): CircuitBreakerState {
    return { ...this.state };
  }

  /**
   * Get circuit breaker metrics
   */
  getMetrics(): CircuitBreakerMetrics {
    return { ...this.metrics };
  }

  /**
   * Get system health score (0-100)
   */
  getHealthScore(): number {
    if (this.metrics.totalCalls === 0) return 100;
    
    const successRate = this.metrics.successfulCalls / this.metrics.totalCalls;
    const stateMultiplier = this.getStateMultiplier();
    const responseTimeScore = this.getResponseTimeScore();
    
    return Math.round(successRate * stateMultiplier * responseTimeScore * 100);
  }

  /**
   * Force circuit breaker to specific state (for testing/manual intervention)
   */
  forceState(newState: 'CLOSED' | 'OPEN' | 'HALF_OPEN'): void {
    const oldState = this.state.state;
    this.state.state = newState;
    
    if (newState === 'CLOSED') {
      this.state.failureCount = 0;
      this.state.successCount = 0;
    } else if (newState === 'OPEN') {
      this.state.lastFailureTime = new Date();
    }
    
    console.log(`🔧 Circuit breaker for ${this.systemId} forced from ${oldState} to ${newState}`);
    this.emit('stateChanged', newState, this.systemId);
  }

  /**
   * Reset circuit breaker to initial state
   */
  reset(): void {
    this.state = {
      state: 'CLOSED',
      failureCount: 0,
      lastFailureTime: new Date(0),
      successCount: 0,
      lastSuccessTime: new Date(0)
    };
    
    this.metrics = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      timeouts: 0,
      circuitOpenTime: 0,
      lastFailureTime: null,
      lastSuccessTime: null,
      averageResponseTime: 0
    };
    
    this.responseTimeHistory = [];
    
    console.log(`🔄 Circuit breaker for ${this.systemId} reset`);
    this.emit('reset', this.systemId);
  }

  /**
   * Check if system is currently available
   */
  isAvailable(): boolean {
    return this.state.state !== 'OPEN';
  }

  /**
   * Get failure rate over specified time window
   */
  getFailureRate(timeWindowMs: number = 300000): number { // Default 5 minutes
    if (this.metrics.totalCalls === 0) return 0;
    
    const now = Date.now();
    const cutoffTime = now - timeWindowMs;
    
    // This is a simplified calculation - in a real implementation,
    // you'd want to track individual call timestamps
    if (this.metrics.lastFailureTime && this.metrics.lastFailureTime.getTime() > cutoffTime) {
      return this.metrics.failedCalls / this.metrics.totalCalls;
    }
    
    return 0;
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private recordSuccess(responseTime: number): void {
    this.metrics.successfulCalls++;
    this.metrics.lastSuccessTime = new Date();
    this.state.lastSuccessTime = new Date();
    this.state.failureCount = 0; // Reset failure count on success
    
    this.updateResponseTime(responseTime);
    
    if (this.state.state === 'HALF_OPEN') {
      this.state.successCount++;
      
      if (this.state.successCount >= this.config.successThreshold) {
        this.state.state = 'CLOSED';
        this.state.successCount = 0;
        
        console.log(`✅ Circuit breaker for ${this.systemId} moved to CLOSED after successful recovery`);
        this.emit('stateChanged', 'CLOSED', this.systemId);
      }
    }
    
    this.emit('callSucceeded', this.systemId, responseTime);
  }

  private recordFailure(responseTime: number): void {
    this.metrics.failedCalls++;
    this.metrics.lastFailureTime = new Date();
    this.state.lastFailureTime = new Date();
    this.state.failureCount++;
    
    this.updateResponseTime(responseTime);
    
    if (this.state.state === 'CLOSED' && this.state.failureCount >= this.config.failureThreshold) {
      this.state.state = 'OPEN';
      this.metrics.circuitOpenTime = Date.now();
      
      console.log(`🚨 Circuit breaker for ${this.systemId} OPENED after ${this.state.failureCount} failures`);
      this.emit('stateChanged', 'OPEN', this.systemId);
    } else if (this.state.state === 'HALF_OPEN') {
      // Any failure in HALF_OPEN immediately returns to OPEN
      this.state.state = 'OPEN';
      this.state.successCount = 0;
      this.metrics.circuitOpenTime = Date.now();
      
      console.log(`🚨 Circuit breaker for ${this.systemId} returned to OPEN from HALF_OPEN`);
      this.emit('stateChanged', 'OPEN', this.systemId);
    }
    
    this.emit('callFailed', this.systemId, responseTime);
  }

  private recordTimeout(responseTime: number): void {
    this.metrics.timeouts++;
    this.recordFailure(responseTime); // Treat timeouts as failures
    
    this.emit('callTimeout', this.systemId, responseTime);
  }

  private shouldAttemptReset(): boolean {
    const now = Date.now();
    const timeSinceLastFailure = now - this.state.lastFailureTime.getTime();
    
    return timeSinceLastFailure >= this.config.recoveryTimeMs;
  }

  private updateResponseTime(responseTime: number): void {
    this.responseTimeHistory.push(responseTime);
    
    // Keep only last 100 response times
    if (this.responseTimeHistory.length > 100) {
      this.responseTimeHistory.shift();
    }
    
    // Update average
    this.metrics.averageResponseTime = 
      this.responseTimeHistory.reduce((sum, time) => sum + time, 0) / 
      this.responseTimeHistory.length;
  }

  private getStateMultiplier(): number {
    switch (this.state.state) {
      case 'CLOSED': return 1.0;
      case 'HALF_OPEN': return 0.5;
      case 'OPEN': return 0.0;
      default: return 1.0;
    }
  }

  private getResponseTimeScore(): number {
    if (this.responseTimeHistory.length === 0) return 1.0;
    
    const avgResponseTime = this.metrics.averageResponseTime;
    
    // Score based on response time (1.0 for <1s, decreasing to 0.1 for >10s)
    if (avgResponseTime < 1000) return 1.0;
    if (avgResponseTime < 2000) return 0.9;
    if (avgResponseTime < 3000) return 0.8;
    if (avgResponseTime < 5000) return 0.6;
    if (avgResponseTime < 10000) return 0.4;
    return 0.1;
  }

  private createTimeoutPromise(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timeout after ${this.config.timeoutMs}ms`));
      }, this.config.timeoutMs);
    });
  }
}

/**
 * CircuitBreakerManager - Manages multiple circuit breakers for different systems
 */
export class CircuitBreakerManager extends EventEmitter {
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private defaultConfig: CircuitBreakerConfig;

  constructor(defaultConfig: Partial<CircuitBreakerConfig> = {}) {
    super();
    
    this.defaultConfig = {
      failureThreshold: defaultConfig.failureThreshold || 5,
      recoveryTimeMs: defaultConfig.recoveryTimeMs || 60000,
      successThreshold: defaultConfig.successThreshold || 3,
      timeoutMs: defaultConfig.timeoutMs || 30000
    };
  }

  /**
   * Get or create circuit breaker for a system
   */
  getCircuitBreaker(systemId: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
    if (!this.circuitBreakers.has(systemId)) {
      const circuitBreaker = new CircuitBreaker(systemId, { ...this.defaultConfig, ...config });
      
      // Forward events
      circuitBreaker.on('stateChanged', (state, id) => this.emit('stateChanged', state, id));
      circuitBreaker.on('callSucceeded', (id, time) => this.emit('callSucceeded', id, time));
      circuitBreaker.on('callFailed', (id, time) => this.emit('callFailed', id, time));
      circuitBreaker.on('callTimeout', (id, time) => this.emit('callTimeout', id, time));
      circuitBreaker.on('callRejected', (id, error) => this.emit('callRejected', id, error));
      
      this.circuitBreakers.set(systemId, circuitBreaker);
    }
    
    return this.circuitBreakers.get(systemId)!;
  }

  /**
   * Execute operation with circuit breaker protection
   */
  async execute<T>(systemId: string, operation: () => Promise<T>): Promise<T> {
    const circuitBreaker = this.getCircuitBreaker(systemId);
    return circuitBreaker.execute(operation);
  }

  /**
   * Get health status of all systems
   */
  getSystemHealth(): Map<string, {
    systemId: string;
    state: string;
    healthScore: number;
    metrics: CircuitBreakerMetrics;
  }> {
    const health = new Map();
    
    for (const [systemId, circuitBreaker] of this.circuitBreakers) {
      health.set(systemId, {
        systemId,
        state: circuitBreaker.getState().state,
        healthScore: circuitBreaker.getHealthScore(),
        metrics: circuitBreaker.getMetrics()
      });
    }
    
    return health;
  }

  /**
   * Get systems that are currently unavailable
   */
  getUnavailableSystems(): string[] {
    const unavailable: string[] = [];
    
    for (const [systemId, circuitBreaker] of this.circuitBreakers) {
      if (!circuitBreaker.isAvailable()) {
        unavailable.push(systemId);
      }
    }
    
    return unavailable;
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    console.log(`🔄 Resetting all ${this.circuitBreakers.size} circuit breakers`);
    
    for (const circuitBreaker of this.circuitBreakers.values()) {
      circuitBreaker.reset();
    }
    
    this.emit('allReset');
  }

  /**
   * Remove circuit breaker for a system
   */
  removeCircuitBreaker(systemId: string): boolean {
    const removed = this.circuitBreakers.delete(systemId);
    
    if (removed) {
      console.log(`🗑️ Removed circuit breaker for system: ${systemId}`);
      this.emit('circuitBreakerRemoved', systemId);
    }
    
    return removed;
  }
}
