/**
 * APTCache - Intelligent caching system for AI Prompt Template results
 * 
 * This class provides:
 * - Context-aware caching with intelligent key generation
 * - TTL (Time To Live) management with dynamic adjustment
 * - Cache invalidation based on game state changes
 * - Performance optimization with hit rate tracking
 * - Memory management with LRU eviction
 */

import { EventEmitter } from 'events';
import {
  APTExecutionRequest,
  APTExecutionResult,
  GameStateSnapshot,
  CivilizationContext
} from './types';

interface CacheEntry {
  key: string;
  aptId: string;
  result: APTExecutionResult;
  createdAt: Date;
  lastAccessed: Date;
  accessCount: number;
  ttl: number;
  contextHash: string;
  invalidationTriggers: string[];
}

interface CacheStats {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
  totalEntries: number;
  memoryUsage: number;
  averageAccessTime: number;
  evictions: number;
}

interface InvalidationRule {
  trigger: string;
  affectedPatterns: string[];
  description: string;
}

export class APTCache extends EventEmitter {
  private cache: Map<string, CacheEntry> = new Map();
  private accessOrder: string[] = []; // For LRU eviction
  private stats: CacheStats;
  private maxSize: number;
  private defaultTTL: number;
  private invalidationRules: Map<string, InvalidationRule> = new Map();
  private contextHashCache: Map<string, string> = new Map();

  constructor(options: {
    maxSize?: number;
    defaultTTL?: number;
    enableIntelligentTTL?: boolean;
  } = {}) {
    super();
    
    this.maxSize = options.maxSize || 1000;
    this.defaultTTL = options.defaultTTL || 300000; // 5 minutes
    
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      hitRate: 0,
      totalEntries: 0,
      memoryUsage: 0,
      averageAccessTime: 0,
      evictions: 0
    };

    this.initializeInvalidationRules();
    this.startCleanupTimer();
    
    console.log(`🗄️ APT Cache initialized with max size: ${this.maxSize}, default TTL: ${this.defaultTTL}ms`);
  }

  /**
   * Get cached result for an APT request
   */
  get(request: APTExecutionRequest, gameState: GameStateSnapshot): APTExecutionResult | null {
    const startTime = performance.now();
    this.stats.totalRequests++;
    
    try {
      const cacheKey = this.generateCacheKey(request, gameState);
      const entry = this.cache.get(cacheKey);
      
      if (!entry) {
        this.stats.cacheMisses++;
        this.updateStats();
        return null;
      }
      
      // Check if entry has expired
      if (this.isExpired(entry)) {
        this.cache.delete(cacheKey);
        this.removeFromAccessOrder(cacheKey);
        this.stats.cacheMisses++;
        this.updateStats();
        return null;
      }
      
      // Update access information
      entry.lastAccessed = new Date();
      entry.accessCount++;
      this.updateAccessOrder(cacheKey);
      
      // Mark as cache hit
      const result = { ...entry.result, cacheHit: true, cacheKey };
      
      this.stats.cacheHits++;
      this.updateStats();
      
      const accessTime = performance.now() - startTime;
      this.updateAverageAccessTime(accessTime);
      
      console.log(`💾 Cache HIT for APT ${request.aptId} (${accessTime.toFixed(2)}ms)`);
      this.emit('cacheHit', request.aptId, cacheKey, accessTime);
      
      return result;
    } catch (error) {
      console.error('❌ Cache get error:', error);
      this.stats.cacheMisses++;
      this.updateStats();
      return null;
    }
  }

  /**
   * Store result in cache
   */
  set(
    request: APTExecutionRequest, 
    result: APTExecutionResult, 
    gameState: GameStateSnapshot,
    customTTL?: number
  ): void {
    try {
      const cacheKey = this.generateCacheKey(request, gameState);
      const contextHash = this.generateContextHash(gameState, request.context.civilizationContext);
      
      // Determine TTL
      const ttl = customTTL || this.calculateIntelligentTTL(request, result);
      
      // Create cache entry
      const entry: CacheEntry = {
        key: cacheKey,
        aptId: request.aptId,
        result: { ...result, cacheHit: false },
        createdAt: new Date(),
        lastAccessed: new Date(),
        accessCount: 0,
        ttl,
        contextHash,
        invalidationTriggers: this.getInvalidationTriggers(request)
      };
      
      // Check if we need to evict entries
      if (this.cache.size >= this.maxSize) {
        this.evictLRU();
      }
      
      // Store entry
      this.cache.set(cacheKey, entry);
      this.accessOrder.push(cacheKey);
      
      this.stats.totalEntries = this.cache.size;
      this.updateMemoryUsage();
      
      console.log(`💾 Cached APT result: ${request.aptId} (TTL: ${ttl}ms)`);
      this.emit('cacheSet', request.aptId, cacheKey, ttl);
    } catch (error) {
      console.error('❌ Cache set error:', error);
    }
  }

  /**
   * Invalidate cache entries based on game state changes
   */
  invalidate(changes: {
    gameStateChanges?: Partial<GameStateSnapshot>;
    civilizationChanges?: Map<string, Partial<CivilizationContext>>;
    systemChanges?: string[];
    customTriggers?: string[];
  }): number {
    let invalidatedCount = 0;
    const keysToRemove: string[] = [];
    
    console.log('🗑️ Processing cache invalidation...');
    
    for (const [key, entry] of this.cache) {
      let shouldInvalidate = false;
      
      // Check system-specific invalidation
      if (changes.systemChanges) {
        for (const systemId of changes.systemChanges) {
          if (entry.invalidationTriggers.includes(systemId)) {
            shouldInvalidate = true;
            break;
          }
        }
      }
      
      // Check custom triggers
      if (changes.customTriggers) {
        for (const trigger of changes.customTriggers) {
          if (entry.invalidationTriggers.includes(trigger)) {
            shouldInvalidate = true;
            break;
          }
        }
      }
      
      // Check context hash changes for civilization-specific entries
      if (changes.civilizationChanges && !shouldInvalidate) {
        // This would require more sophisticated context comparison
        // For now, we'll use a simple approach
        shouldInvalidate = this.hasContextChanged(entry, changes);
      }
      
      if (shouldInvalidate) {
        keysToRemove.push(key);
        invalidatedCount++;
      }
    }
    
    // Remove invalidated entries
    for (const key of keysToRemove) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
    }
    
    this.stats.totalEntries = this.cache.size;
    this.updateMemoryUsage();
    
    if (invalidatedCount > 0) {
      console.log(`🗑️ Invalidated ${invalidatedCount} cache entries`);
      this.emit('cacheInvalidated', invalidatedCount, keysToRemove);
    }
    
    return invalidatedCount;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    const entriesCleared = this.cache.size;
    this.cache.clear();
    this.accessOrder.length = 0;
    this.contextHashCache.clear();
    
    this.stats.totalEntries = 0;
    this.stats.memoryUsage = 0;
    
    console.log(`🗑️ Cleared all ${entriesCleared} cache entries`);
    this.emit('cacheCleared', entriesCleared);
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get detailed cache information
   */
  getCacheInfo(): {
    stats: CacheStats;
    entries: Array<{
      key: string;
      aptId: string;
      age: number;
      accessCount: number;
      ttl: number;
      size: number;
    }>;
    topAPTs: Array<{
      aptId: string;
      hitCount: number;
      missCount: number;
      hitRate: number;
    }>;
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.values()).map(entry => ({
      key: entry.key,
      aptId: entry.aptId,
      age: now - entry.createdAt.getTime(),
      accessCount: entry.accessCount,
      ttl: entry.ttl,
      size: this.estimateEntrySize(entry)
    }));
    
    // Calculate per-APT statistics
    const aptStats = new Map<string, { hits: number; misses: number }>();
    // This would be populated from execution history in a real implementation
    
    const topAPTs = Array.from(aptStats.entries()).map(([aptId, stats]) => ({
      aptId,
      hitCount: stats.hits,
      missCount: stats.misses,
      hitRate: stats.hits / (stats.hits + stats.misses)
    })).sort((a, b) => b.hitRate - a.hitRate);
    
    return {
      stats: this.getStats(),
      entries,
      topAPTs
    };
  }

  /**
   * Optimize cache by removing low-value entries
   */
  optimize(): {
    entriesRemoved: number;
    memoryFreed: number;
  } {
    const initialSize = this.cache.size;
    const initialMemory = this.stats.memoryUsage;
    
    console.log('🔧 Optimizing cache...');
    
    const now = Date.now();
    const keysToRemove: string[] = [];
    
    // Remove entries that are rarely accessed and old
    for (const [key, entry] of this.cache) {
      const age = now - entry.createdAt.getTime();
      const accessRate = entry.accessCount / Math.max(1, age / 60000); // accesses per minute
      
      // Remove if very old and rarely accessed
      if (age > 600000 && accessRate < 0.1) { // 10 minutes old, < 0.1 accesses/min
        keysToRemove.push(key);
      }
    }
    
    // Remove identified entries
    for (const key of keysToRemove) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
    }
    
    this.stats.totalEntries = this.cache.size;
    this.updateMemoryUsage();
    
    const entriesRemoved = initialSize - this.cache.size;
    const memoryFreed = initialMemory - this.stats.memoryUsage;
    
    console.log(`🔧 Cache optimization complete: removed ${entriesRemoved} entries, freed ${memoryFreed} bytes`);
    this.emit('cacheOptimized', entriesRemoved, memoryFreed);
    
    return { entriesRemoved, memoryFreed };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private generateCacheKey(request: APTExecutionRequest, gameState: GameStateSnapshot): string {
    // Create a deterministic cache key based on APT ID, variables, and relevant context
    const keyComponents = [
      request.aptId,
      this.hashObject(request.variables),
      gameState.currentTick.toString(),
      gameState.gamePhase
    ];
    
    // Add civilization-specific context if applicable
    if (request.context.civilizationContext) {
      keyComponents.push(request.context.civilizationContext.id);
      keyComponents.push(request.context.civilizationContext.total_population.toString());
      keyComponents.push(request.context.civilizationContext.economic_power.toString());
    }
    
    return keyComponents.join('|');
  }

  private generateContextHash(
    gameState: GameStateSnapshot, 
    civContext?: CivilizationContext
  ): string {
    const contextKey = `${gameState.currentTick}_${civContext?.id || 'global'}`;
    
    if (this.contextHashCache.has(contextKey)) {
      return this.contextHashCache.get(contextKey)!;
    }
    
    const contextData = {
      tick: gameState.currentTick,
      phase: gameState.gamePhase,
      civId: civContext?.id,
      civPop: civContext?.total_population,
      civEcon: civContext?.economic_power
    };
    
    const hash = this.hashObject(contextData);
    this.contextHashCache.set(contextKey, hash);
    
    // Keep context hash cache small
    if (this.contextHashCache.size > 1000) {
      const keys = Array.from(this.contextHashCache.keys());
      for (let i = 0; i < 100; i++) {
        this.contextHashCache.delete(keys[i]);
      }
    }
    
    return hash;
  }

  private calculateIntelligentTTL(request: APTExecutionRequest, result: APTExecutionResult): number {
    let ttl = this.defaultTTL;
    
    // Adjust TTL based on result quality
    if (result.qualityScore > 0.8) {
      ttl *= 1.5; // High quality results last longer
    } else if (result.qualityScore < 0.5) {
      ttl *= 0.5; // Low quality results expire faster
    }
    
    // Adjust TTL based on execution time
    if (result.executionTime > 5000) {
      ttl *= 2; // Expensive operations should be cached longer
    }
    
    // Adjust TTL based on APT category
    if (request.aptId.includes('population') || request.aptId.includes('economic')) {
      ttl *= 0.8; // Frequently changing data expires faster
    } else if (request.aptId.includes('culture') || request.aptId.includes('technology')) {
      ttl *= 1.2; // Slower changing data lasts longer
    }
    
    return Math.min(Math.max(ttl, 30000), 1800000); // Between 30s and 30min
  }

  private getInvalidationTriggers(request: APTExecutionRequest): string[] {
    const triggers: string[] = [];
    
    // Add system-based triggers
    if (request.aptId.includes('population')) {
      triggers.push('population', 'demographics', 'health', 'education');
    }
    if (request.aptId.includes('economic')) {
      triggers.push('economics', 'trade', 'finance', 'business');
    }
    if (request.aptId.includes('military')) {
      triggers.push('military', 'defense', 'warfare', 'security');
    }
    if (request.aptId.includes('diplomacy')) {
      triggers.push('diplomacy', 'relations', 'treaties', 'politics');
    }
    
    // Add civilization-specific triggers
    if (request.context.civilizationContext) {
      triggers.push(`civ_${request.context.civilizationContext.id}`);
    }
    
    // Add global triggers
    triggers.push('game_state', 'global_events');
    
    return triggers;
  }

  private isExpired(entry: CacheEntry): boolean {
    const age = Date.now() - entry.createdAt.getTime();
    return age > entry.ttl;
  }

  private evictLRU(): void {
    if (this.accessOrder.length === 0) return;
    
    const lruKey = this.accessOrder.shift()!;
    this.cache.delete(lruKey);
    this.stats.evictions++;
    
    console.log(`🗑️ Evicted LRU cache entry: ${lruKey}`);
    this.emit('cacheEvicted', lruKey);
  }

  private updateAccessOrder(key: string): void {
    // Move to end of access order (most recently used)
    const index = this.accessOrder.indexOf(key);
    if (index !== -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(key);
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index !== -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  private updateStats(): void {
    this.stats.hitRate = this.stats.totalRequests > 0 ? 
      this.stats.cacheHits / this.stats.totalRequests : 0;
  }

  private updateAverageAccessTime(accessTime: number): void {
    const totalAccesses = this.stats.cacheHits + this.stats.cacheMisses;
    this.stats.averageAccessTime = 
      (this.stats.averageAccessTime * (totalAccesses - 1) + accessTime) / totalAccesses;
  }

  private updateMemoryUsage(): void {
    let totalSize = 0;
    for (const entry of this.cache.values()) {
      totalSize += this.estimateEntrySize(entry);
    }
    this.stats.memoryUsage = totalSize;
  }

  private estimateEntrySize(entry: CacheEntry): number {
    // Rough estimation of memory usage
    const baseSize = 200; // Base object overhead
    const keySize = entry.key.length * 2; // UTF-16 characters
    const resultSize = JSON.stringify(entry.result).length * 2;
    return baseSize + keySize + resultSize;
  }

  private hasContextChanged(entry: CacheEntry, changes: any): boolean {
    // Simplified context change detection
    // In a real implementation, this would be more sophisticated
    return changes.civilizationChanges && changes.civilizationChanges.size > 0;
  }

  private hashObject(obj: any): string {
    // Simple hash function for objects
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  private initializeInvalidationRules(): void {
    const rules: InvalidationRule[] = [
      {
        trigger: 'population_change',
        affectedPatterns: ['population*', 'demographic*', 'social*'],
        description: 'Population changes affect demographic and social analyses'
      },
      {
        trigger: 'economic_change',
        affectedPatterns: ['economic*', 'trade*', 'finance*', 'business*'],
        description: 'Economic changes affect financial and trade analyses'
      },
      {
        trigger: 'military_change',
        affectedPatterns: ['military*', 'defense*', 'warfare*', 'security*'],
        description: 'Military changes affect defense and security analyses'
      },
      {
        trigger: 'political_change',
        affectedPatterns: ['political*', 'governance*', 'diplomacy*'],
        description: 'Political changes affect governance and diplomatic analyses'
      },
      {
        trigger: 'technology_change',
        affectedPatterns: ['technology*', 'research*', 'innovation*'],
        description: 'Technology changes affect research and innovation analyses'
      }
    ];
    
    for (const rule of rules) {
      this.invalidationRules.set(rule.trigger, rule);
    }
  }

  private startCleanupTimer(): void {
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      this.cleanupExpired();
    }, 300000);
  }

  private cleanupExpired(): void {
    const now = Date.now();
    const keysToRemove: string[] = [];
    
    for (const [key, entry] of this.cache) {
      if (this.isExpired(entry)) {
        keysToRemove.push(key);
      }
    }
    
    for (const key of keysToRemove) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
    }
    
    if (keysToRemove.length > 0) {
      this.stats.totalEntries = this.cache.size;
      this.updateMemoryUsage();
      console.log(`🧹 Cleaned up ${keysToRemove.length} expired cache entries`);
      this.emit('cacheCleanup', keysToRemove.length);
    }
  }
}
