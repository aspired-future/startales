import { LLMProvider } from '../llm/types';
import { getProvider } from '../llm/factory';
import crypto from 'crypto';

export interface EmbeddingOptions {
  model?: string;
  provider?: string;
  batchSize?: number;
  useCache?: boolean;
}

export interface EmbeddingCache {
  [key: string]: {
    vector: number[];
    timestamp: number;
    model: string;
    provider: string;
  };
}

/**
 * High-performance embedding service with multi-provider support and caching
 * Supports local (Ollama) and cloud (OpenAI) providers with intelligent fallback
 */
export class EmbeddingService {
  private cache: EmbeddingCache = {};
  private cacheHits = 0;
  private cacheMisses = 0;
  private maxCacheSize: number;
  private cacheExpirationMs: number;
  
  // Provider preferences: local first, then cloud fallback
  private providerOrder = ['ollama', 'openai'];
  private defaultModels = {
    ollama: 'nomic-embed-text',
    openai: 'text-embedding-3-small'
  };

  constructor(maxCacheSize = 10000, cacheExpirationMs = 24 * 60 * 60 * 1000) { // 24 hours default
    this.maxCacheSize = maxCacheSize;
    this.cacheExpirationMs = cacheExpirationMs;
  }

  /**
   * Generate cache key for text + model + provider combination
   */
  private generateCacheKey(text: string, model: string, provider: string): string {
    const content = `${provider}:${model}:${text}`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Clean expired entries from cache
   */
  private cleanExpiredCache(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, entry] of Object.entries(this.cache)) {
      if (now - entry.timestamp > this.cacheExpirationMs) {
        delete this.cache[key];
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned ${cleanedCount} expired cache entries`);
    }
  }

  /**
   * Evict oldest entries if cache is too large (LRU)
   */
  private evictOldestEntries(): void {
    const cacheKeys = Object.keys(this.cache);
    if (cacheKeys.length <= this.maxCacheSize) return;

    // Sort by timestamp (oldest first)
    const sortedEntries = cacheKeys
      .map(key => ({ key, timestamp: this.cache[key].timestamp }))
      .sort((a, b) => a.timestamp - b.timestamp);

    const toEvict = sortedEntries.slice(0, cacheKeys.length - this.maxCacheSize);
    toEvict.forEach(entry => delete this.cache[entry.key]);
    
    console.log(`♻️ Evicted ${toEvict.length} old cache entries`);
  }

  /**
   * Get embedding from cache if available
   */
  private getCachedEmbedding(text: string, model: string, provider: string): number[] | null {
    const key = this.generateCacheKey(text, model, provider);
    const entry = this.cache[key];
    
    if (!entry) {
      this.cacheMisses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() - entry.timestamp > this.cacheExpirationMs) {
      delete this.cache[key];
      this.cacheMisses++;
      return null;
    }
    
    this.cacheHits++;
    return entry.vector;
  }

  /**
   * Store embedding in cache
   */
  private setCachedEmbedding(text: string, model: string, provider: string, vector: number[]): void {
    const key = this.generateCacheKey(text, model, provider);
    
    this.cache[key] = {
      vector,
      timestamp: Date.now(),
      model,
      provider
    };
    
    // Periodic cleanup
    if (Object.keys(this.cache).length % 100 === 0) {
      this.cleanExpiredCache();
      this.evictOldestEntries();
    }
  }

  /**
   * Get the best available provider for embeddings
   */
  private async getBestProvider(preferredProvider?: string): Promise<{ provider: LLMProvider; name: string }> {
    // If specific provider requested, try it first
    if (preferredProvider) {
      try {
        const provider = getProvider(preferredProvider);
        if (provider.supportsEmbedding) {
          return { provider, name: preferredProvider };
        }
      } catch {
        console.warn(`⚠️ Preferred provider '${preferredProvider}' not available, trying alternatives`);
      }
    }

    // Try providers in order of preference
    for (const providerName of this.providerOrder) {
      try {
        const provider = getProvider(providerName);
        if (provider.supportsEmbedding) {
          return { provider, name: providerName };
        }
      } catch {
        console.warn(`⚠️ Provider '${providerName}' not available`);
      }
    }

    throw new Error('No embedding providers available');
  }

  /**
   * Generate embeddings for a single text
   */
  async embedSingle(text: string, options: EmbeddingOptions = {}): Promise<number[]> {
    const { provider: providerName, useCache = true } = options;
    
    // Get best available provider
    const { provider, name } = await this.getBestProvider(providerName);
    const model = options.model || this.defaultModels[name as keyof typeof this.defaultModels] || 'default';
    
    // Check cache first
    if (useCache) {
      const cached = this.getCachedEmbedding(text, model, name);
      if (cached) {
        return cached;
      }
    }

    // Generate embedding
    try {
      const result = await provider.embed!([text], { model });
      const vector = result.vectors[0];
      
      // Cache the result
      if (useCache) {
        this.setCachedEmbedding(text, model, name, vector);
      }
      
      return vector;
    } catch (error) {
      console.error(`❌ Embedding failed with ${name}:`, error);
      
      // Try fallback providers
      for (const fallbackName of this.providerOrder) {
        if (fallbackName === name) continue; // Skip the one that just failed
        
        try {
          const fallbackProvider = getProvider(fallbackName);
          if (fallbackProvider.supportsEmbedding) {
            console.log(`🔄 Trying fallback provider: ${fallbackName}`);
            const fallbackModel = this.defaultModels[fallbackName as keyof typeof this.defaultModels] || 'default';
            const result = await fallbackProvider.embed!([text], { model: fallbackModel });
            const vector = result.vectors[0];
            
            if (useCache) {
              this.setCachedEmbedding(text, fallbackModel, fallbackName, vector);
            }
            
            return vector;
          }
        } catch (fallbackError) {
          console.error(`❌ Fallback ${fallbackName} also failed:`, fallbackError);
        }
      }
      
      throw new Error(`All embedding providers failed. Last error: ${error}`);
    }
  }

  /**
   * Generate embeddings for multiple texts with intelligent batching
   */
  async embedBatch(texts: string[], options: EmbeddingOptions = {}): Promise<number[][]> {
    const { 
      provider: providerName, 
      batchSize = 100,
      useCache = true 
    } = options;
    
    // Get best available provider
    const { provider, name } = await this.getBestProvider(providerName);
    const model = options.model || this.defaultModels[name as keyof typeof this.defaultModels] || 'default';
    
    const results: number[][] = [];
    const textsToEmbed: { text: string; index: number }[] = [];
    
    // Check cache for each text
    if (useCache) {
      for (let i = 0; i < texts.length; i++) {
        const cached = this.getCachedEmbedding(texts[i], model, name);
        if (cached) {
          results[i] = cached;
        } else {
          textsToEmbed.push({ text: texts[i], index: i });
        }
      }
    } else {
      for (let i = 0; i < texts.length; i++) {
        textsToEmbed.push({ text: texts[i], index: i });
      }
    }
    
    console.log(`📊 Cache: ${this.cacheHits} hits, ${this.cacheMisses} misses. Processing ${textsToEmbed.length}/${texts.length} texts`);
    
    // Process remaining texts in batches
    for (let i = 0; i < textsToEmbed.length; i += batchSize) {
      const batch = textsToEmbed.slice(i, i + batchSize);
      const batchTexts = batch.map(item => item.text);
      
      try {
        const result = await provider.embed!(batchTexts, { model });
        
        // Store results and cache
        for (let j = 0; j < batch.length; j++) {
          const vector = result.vectors[j];
          const originalIndex = batch[j].index;
          
          results[originalIndex] = vector;
          
          if (useCache) {
            this.setCachedEmbedding(batch[j].text, model, name, vector);
          }
        }
        
      } catch (error) {
        console.error(`❌ Batch embedding failed, falling back to individual processing:`, error);
        
        // Fall back to individual processing for this batch
        for (const item of batch) {
          try {
            const vector = await this.embedSingle(item.text, { ...options, useCache });
            results[item.index] = vector;
          } catch (individualError) {
            console.error(`❌ Individual embedding failed for text ${item.index}:`, individualError);
            // Use a zero vector as fallback
            const dimSize = results.find(r => r)?.length || 768;
            results[item.index] = new Array(dimSize).fill(0);
          }
        }
      }
    }
    
    return results;
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const totalRequests = this.cacheHits + this.cacheMisses;
    const hitRate = totalRequests > 0 ? (this.cacheHits / totalRequests) * 100 : 0;
    
    return {
      size: Object.keys(this.cache).length,
      maxSize: this.maxCacheSize,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: hitRate.toFixed(2) + '%',
      expirationMs: this.cacheExpirationMs
    };
  }

  /**
   * Clear all cached embeddings
   */
  clearCache(): void {
    this.cache = {};
    this.cacheHits = 0;
    this.cacheMisses = 0;
    console.log('🧹 Embedding cache cleared');
  }

  /**
   * Get available embedding providers
   */
  getAvailableProviders(): string[] {
    const available: string[] = [];
    
    for (const providerName of this.providerOrder) {
      try {
        const provider = getProvider(providerName);
        if (provider.supportsEmbedding) {
          available.push(providerName);
        }
      } catch {
        // Provider not available
      }
    }
    
    return available;
  }

  /**
   * Health check for embedding service
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    providers: { name: string; available: boolean; model: string }[];
    cache: ReturnType<typeof this.getCacheStats>;
  }> {
    const providers: { name: string; available: boolean; model: string }[] = [];
    let availableCount = 0;
    
    for (const providerName of this.providerOrder) {
      try {
        const provider = getProvider(providerName);
        const available = !!provider.supportsEmbedding;
        const model = this.defaultModels[providerName as keyof typeof this.defaultModels] || 'default';
        
        providers.push({ name: providerName, available, model });
        if (available) availableCount++;
      } catch {
        providers.push({ name: providerName, available: false, model: 'N/A' });
      }
    }
    
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'unhealthy';
    if (availableCount >= 2) {
      status = 'healthy';
    } else if (availableCount === 1) {
      status = 'degraded';
    }
    
    return {
      status,
      providers,
      cache: this.getCacheStats()
    };
  }
}

// Export singleton instance
export const embeddingService = new EmbeddingService();
