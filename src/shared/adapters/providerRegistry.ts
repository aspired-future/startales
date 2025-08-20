/**
 * Provider Registry Implementation
 * Manages provider registration, discovery, failover, and load balancing
 */

import { EventEmitter } from 'events';
import {
  BaseProvider,
  ProviderType,
  ProviderRegistryConfig,
  LoadBalancingConfig,
  ProviderStats,
  ProviderError,
  ProviderErrorType,
  HealthCheckResult,
  AdapterExecutionResult,
  RetryConfig,
  CircuitBreakerConfig,
  ProviderMetrics,
  ProviderEvent
} from './types';

interface CircuitBreakerState {
  state: 'closed' | 'open' | 'half-open';
  failures: number;
  lastFailureTime: number;
  nextAttemptTime: number;
}

export class ProviderRegistry extends EventEmitter {
  private providers: Map<string, Map<string, BaseProvider>> = new Map();
  private stats: Map<string, ProviderStats> = new Map();
  private failoverConfig: Map<ProviderType, string[]> = new Map();
  private loadBalancingConfig: Map<ProviderType, LoadBalancingConfig> = new Map();
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private loadBalancingState: Map<string, number> = new Map(); // For round-robin
  private retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    jitter: true,
    retryableErrors: ['network_error', 'timeout', 'server_error', 'rate_limit']
  };
  private circuitBreakerConfig: CircuitBreakerConfig = {
    failureThreshold: 5,
    recoveryTimeout: 60000,
    monitoringPeriod: 10000,
    minimumRequests: 10
  };

  constructor() {
    super();
    this.setupCleanupInterval();
  }

  /**
   * Register a provider
   */
  register(provider: BaseProvider, options: { replace?: boolean } = {}): void {
    const typeKey = provider.type;
    const providerKey = provider.name;
    const fullKey = `${typeKey}:${providerKey}`;

    if (!this.providers.has(typeKey)) {
      this.providers.set(typeKey, new Map());
    }

    const typeProviders = this.providers.get(typeKey)!;
    
    if (typeProviders.has(providerKey) && !options.replace) {
      throw new Error(`Provider ${providerKey} of type ${typeKey} is already registered`);
    }

    typeProviders.set(providerKey, provider);
    
    // Initialize stats
    this.stats.set(fullKey, {
      requests: 0,
      successes: 0,
      failures: 0,
      averageLatency: 0,
      latencyPercentiles: { p50: 0, p95: 0, p99: 0 },
      errorTypes: {},
      lastRequest: undefined,
      lastSuccess: undefined,
      lastFailure: undefined
    });

    // Initialize circuit breaker
    this.circuitBreakers.set(fullKey, {
      state: 'closed',
      failures: 0,
      lastFailureTime: 0,
      nextAttemptTime: 0
    });

    this.emit('provider:registered', { type: typeKey, name: providerKey, provider });
  }

  /**
   * Get provider by type and name
   */
  getProvider<T extends BaseProvider>(type: ProviderType, name: string): T | undefined {
    const typeProviders = this.providers.get(type);
    return typeProviders?.get(name) as T | undefined;
  }

  /**
   * Get all providers of a specific type
   */
  getProviders<T extends BaseProvider>(type: ProviderType): T[] {
    const typeProviders = this.providers.get(type);
    return typeProviders ? Array.from(typeProviders.values()) as T[] : [];
  }

  /**
   * Check health of a specific provider
   */
  async checkHealth(type: ProviderType, name: string): Promise<HealthCheckResult> {
    const provider = this.getProvider(type, name);
    if (!provider) {
      return { healthy: false, latency: 0, error: 'Provider not found' };
    }

    const startTime = Date.now();
    try {
      const result = await provider.healthCheck();
      const latency = Date.now() - startTime;
      return { ...result, latency };
    } catch (error) {
      const latency = Date.now() - startTime;
      return {
        healthy: false,
        latency,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check health of all providers
   */
  async checkAllHealth(): Promise<Array<HealthCheckResult & { type: ProviderType; name: string }>> {
    const results: Array<HealthCheckResult & { type: ProviderType; name: string }> = [];

    for (const [type, typeProviders] of this.providers) {
      for (const [name] of typeProviders) {
        const health = await this.checkHealth(type as ProviderType, name);
        results.push({ ...health, type: type as ProviderType, name });
      }
    }

    return results;
  }

  /**
   * Configure failover order for a provider type
   */
  configureFailover(type: ProviderType, providerNames: string[]): void {
    this.failoverConfig.set(type, providerNames);
    this.emit('failover:configured', { type, providers: providerNames });
  }

  /**
   * Get failover configuration
   */
  getFailoverConfiguration(type: ProviderType): string[] | undefined {
    return this.failoverConfig.get(type);
  }

  /**
   * Configure load balancing for a provider type
   */
  configureLoadBalancing(type: ProviderType, providers: (string | { name: string; weight: number })[], strategy: LoadBalancingConfig['strategy']): void {
    this.loadBalancingConfig.set(type, { providers, strategy });
    this.loadBalancingState.set(type, 0); // Reset round-robin counter
    this.emit('loadbalancing:configured', { type, providers, strategy });
  }

  /**
   * Get load balancing configuration
   */
  getLoadBalancingConfiguration(type: ProviderType): LoadBalancingConfig | undefined {
    return this.loadBalancingConfig.get(type);
  }

  /**
   * Execute method with failover
   */
  async executeWithFailover<T>(
    type: ProviderType,
    method: string,
    ...args: any[]
  ): Promise<AdapterExecutionResult<T>> {
    const failoverProviders = this.failoverConfig.get(type) || [];
    const availableProviders = failoverProviders.length > 0 
      ? failoverProviders 
      : Array.from(this.providers.get(type)?.keys() || []);

    if (availableProviders.length === 0) {
      throw new ProviderError('No providers available', 'unknown', 'unknown');
    }

    let lastError: Error | undefined;
    let retries = 0;
    const startTime = Date.now();

    for (const providerName of availableProviders) {
      const provider = this.getProvider(type, providerName);
      if (!provider) continue;

      const fullKey = `${type}:${providerName}`;
      
      // Check circuit breaker
      if (!this.isCircuitBreakerClosed(fullKey)) {
        continue;
      }

      try {
        const result = await this.executeWithRetry(provider, method, args, fullKey);
        const executionTime = Date.now() - startTime;

        this.recordSuccess(fullKey, executionTime);
        this.resetCircuitBreaker(fullKey);

        return {
          result,
          provider: providerName,
          usage: result.usage || { requests: 1 },
          executionTime,
          retries,
          failoverUsed: availableProviders.indexOf(providerName) > 0,
          originalProvider: availableProviders[0] !== providerName ? availableProviders[0] : undefined
        };
      } catch (error) {
        lastError = error;
        retries++;
        
        this.recordFailure(fullKey, error);
        this.updateCircuitBreaker(fullKey);
        
        this.emit('provider:error', {
          type,
          provider: providerName,
          method,
          error,
          timestamp: new Date()
        });
      }
    }

    // All providers failed
    const executionTime = Date.now() - startTime;
    throw new ProviderError(
      `All providers failed. Last error: ${lastError?.message}`,
      'unknown',
      'unknown',
      undefined,
      lastError
    );
  }

  /**
   * Execute method with load balancing
   */
  async executeWithLoadBalancing<T>(
    type: ProviderType,
    method: string,
    ...args: any[]
  ): Promise<AdapterExecutionResult<T>> {
    const config = this.loadBalancingConfig.get(type);
    if (!config) {
      throw new ProviderError('No load balancing configuration found', 'unknown', 'unknown');
    }

    const providerName = this.selectProviderForLoadBalancing(type, config);
    const provider = this.getProvider(type, providerName);
    
    if (!provider) {
      throw new ProviderError(`Provider ${providerName} not found`, providerName, 'unknown');
    }

    const fullKey = `${type}:${providerName}`;
    const startTime = Date.now();

    try {
      const result = await this.executeWithRetry(provider, method, args, fullKey);
      const executionTime = Date.now() - startTime;

      this.recordSuccess(fullKey, executionTime);
      
      return {
        result,
        provider: providerName,
        usage: result.usage || { requests: 1 },
        executionTime,
        retries: 0,
        failoverUsed: false
      };
    } catch (error) {
      this.recordFailure(fullKey, error);
      throw error;
    }
  }

  /**
   * Execute method with retry logic
   */
  private async executeWithRetry(provider: BaseProvider, method: string, args: any[], fullKey: string): Promise<any> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const methodFn = (provider as any)[method];
        if (typeof methodFn !== 'function') {
          throw new Error(`Method ${method} not found on provider`);
        }
        
        return await methodFn.apply(provider, args);
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === this.retryConfig.maxRetries) {
          break;
        }

        const errorType = this.classifyError(error as Error);
        if (!this.retryConfig.retryableErrors.includes(errorType)) {
          break;
        }

        const delay = this.calculateRetryDelay(attempt);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Select provider for load balancing
   */
  private selectProviderForLoadBalancing(type: ProviderType, config: LoadBalancingConfig): string {
    switch (config.strategy) {
      case 'round-robin':
        return this.selectRoundRobin(type, config);
      case 'weighted':
        return this.selectWeighted(config);
      case 'least-latency':
        return this.selectLeastLatency(type, config);
      case 'least-errors':
        return this.selectLeastErrors(type, config);
      default:
        return this.selectRoundRobin(type, config);
    }
  }

  /**
   * Round-robin selection
   */
  private selectRoundRobin(type: ProviderType, config: LoadBalancingConfig): string {
    const providers = config.providers.map(p => typeof p === 'string' ? p : p.name);
    const currentIndex = this.loadBalancingState.get(type) || 0;
    const selectedProvider = providers[currentIndex % providers.length];
    
    this.loadBalancingState.set(type, currentIndex + 1);
    return selectedProvider;
  }

  /**
   * Weighted selection
   */
  private selectWeighted(config: LoadBalancingConfig): string {
    const weightedProviders = config.providers.filter(p => typeof p === 'object') as { name: string; weight: number }[];
    const totalWeight = weightedProviders.reduce((sum, p) => sum + p.weight, 0);
    const random = Math.random() * totalWeight;
    
    let currentWeight = 0;
    for (const provider of weightedProviders) {
      currentWeight += provider.weight;
      if (random <= currentWeight) {
        return provider.name;
      }
    }
    
    return weightedProviders[0].name;
  }

  /**
   * Least latency selection
   */
  private selectLeastLatency(type: ProviderType, config: LoadBalancingConfig): string {
    const providers = config.providers.map(p => typeof p === 'string' ? p : p.name);
    let bestProvider = providers[0];
    let bestLatency = Infinity;

    for (const providerName of providers) {
      const stats = this.getProviderStats(type, providerName);
      if (stats.averageLatency < bestLatency) {
        bestLatency = stats.averageLatency;
        bestProvider = providerName;
      }
    }

    return bestProvider;
  }

  /**
   * Least errors selection
   */
  private selectLeastErrors(type: ProviderType, config: LoadBalancingConfig): string {
    const providers = config.providers.map(p => typeof p === 'string' ? p : p.name);
    let bestProvider = providers[0];
    let bestErrorRate = Infinity;

    for (const providerName of providers) {
      const stats = this.getProviderStats(type, providerName);
      const errorRate = stats.requests > 0 ? stats.failures / stats.requests : 0;
      if (errorRate < bestErrorRate) {
        bestErrorRate = errorRate;
        bestProvider = providerName;
      }
    }

    return bestProvider;
  }

  /**
   * Get provider statistics
   */
  getProviderStats(type: ProviderType, name: string): ProviderStats {
    const fullKey = `${type}:${name}`;
    return this.stats.get(fullKey) || {
      requests: 0,
      successes: 0,
      failures: 0,
      averageLatency: 0,
      latencyPercentiles: { p50: 0, p95: 0, p99: 0 },
      errorTypes: {}
    };
  }

  /**
   * Load configuration
   */
  loadConfiguration(config: ProviderRegistryConfig): void {
    // Validate configuration
    this.validateConfiguration(config);

    // Configure failover
    if (config.failover) {
      for (const [type, providers] of Object.entries(config.failover)) {
        this.configureFailover(type as ProviderType, providers);
      }
    }

    // Configure load balancing
    if (config.loadBalancing) {
      for (const [type, lbConfig] of Object.entries(config.loadBalancing)) {
        this.configureLoadBalancing(type as ProviderType, lbConfig.providers, lbConfig.strategy);
      }
    }

    this.emit('configuration:loaded', config);
  }

  /**
   * Validate configuration
   */
  private validateConfiguration(config: ProviderRegistryConfig): void {
    if (!config.providers || typeof config.providers !== 'object') {
      throw new Error('Invalid provider configuration');
    }

    // Add more validation as needed
  }

  /**
   * Circuit breaker methods
   */
  private isCircuitBreakerClosed(fullKey: string): boolean {
    const breaker = this.circuitBreakers.get(fullKey);
    if (!breaker) return true;

    const now = Date.now();
    
    switch (breaker.state) {
      case 'closed':
        return true;
      case 'open':
        if (now >= breaker.nextAttemptTime) {
          breaker.state = 'half-open';
          return true;
        }
        return false;
      case 'half-open':
        return true;
      default:
        return true;
    }
  }

  private updateCircuitBreaker(fullKey: string): void {
    const breaker = this.circuitBreakers.get(fullKey);
    if (!breaker) return;

    breaker.failures++;
    breaker.lastFailureTime = Date.now();

    if (breaker.failures >= this.circuitBreakerConfig.failureThreshold) {
      breaker.state = 'open';
      breaker.nextAttemptTime = Date.now() + this.circuitBreakerConfig.recoveryTimeout;
      this.emit('circuit-breaker:opened', { provider: fullKey });
    }
  }

  private resetCircuitBreaker(fullKey: string): void {
    const breaker = this.circuitBreakers.get(fullKey);
    if (!breaker) return;

    if (breaker.state === 'half-open') {
      breaker.state = 'closed';
      breaker.failures = 0;
      this.emit('circuit-breaker:closed', { provider: fullKey });
    }
  }

  /**
   * Statistics tracking
   */
  private recordSuccess(fullKey: string, latency: number): void {
    const stats = this.stats.get(fullKey);
    if (!stats) return;

    stats.requests++;
    stats.successes++;
    stats.lastSuccess = new Date();
    stats.lastRequest = new Date();
    
    // Update average latency (simple moving average)
    stats.averageLatency = (stats.averageLatency * (stats.successes - 1) + latency) / stats.successes;
    
    // TODO: Update percentiles with proper algorithm
  }

  private recordFailure(fullKey: string, error: Error): void {
    const stats = this.stats.get(fullKey);
    if (!stats) return;

    stats.requests++;
    stats.failures++;
    stats.lastFailure = new Date();
    stats.lastRequest = new Date();

    const errorType = this.classifyError(error);
    stats.errorTypes[errorType] = (stats.errorTypes[errorType] || 0) + 1;
  }

  /**
   * Error classification
   */
  private classifyError(error: Error): ProviderErrorType {
    const message = error.message.toLowerCase();
    
    if (message.includes('unauthorized') || message.includes('invalid api key')) {
      return 'authentication';
    }
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return 'rate_limit';
    }
    if (message.includes('quota') || message.includes('billing')) {
      return 'quota_exceeded';
    }
    if (message.includes('timeout')) {
      return 'timeout';
    }
    if (message.includes('network') || message.includes('connection')) {
      return 'network_error';
    }
    if (message.includes('server error') || message.includes('internal error')) {
      return 'server_error';
    }
    if (message.includes('content') || message.includes('policy')) {
      return 'content_filter';
    }
    if (message.includes('invalid') || message.includes('bad request')) {
      return 'invalid_request';
    }
    
    return 'unknown';
  }

  /**
   * Retry delay calculation
   */
  private calculateRetryDelay(attempt: number): number {
    const delay = Math.min(
      this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt),
      this.retryConfig.maxDelay
    );

    if (this.retryConfig.jitter) {
      return delay * (0.5 + Math.random() * 0.5);
    }

    return delay;
  }

  /**
   * Utility methods
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private setupCleanupInterval(): void {
    // Clean up old statistics periodically
    setInterval(() => {
      // Implementation for cleaning up old data
    }, 300000); // 5 minutes
  }

  /**
   * Clear all providers (for testing)
   */
  clear(): void {
    this.providers.clear();
    this.stats.clear();
    this.failoverConfig.clear();
    this.loadBalancingConfig.clear();
    this.circuitBreakers.clear();
    this.loadBalancingState.clear();
  }
}
