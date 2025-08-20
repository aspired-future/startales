/**
 * Unit tests for Provider Registry (TC011)
 * Tests provider registration, discovery, failover, and load balancing
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ProviderRegistry } from '../providerRegistry';
import { LLMProvider, STTProvider, TTSProvider, ImageProvider, EmbeddingProvider } from '../types';

// Mock providers for testing
class MockLLMProvider implements LLMProvider {
  name = 'mock-llm';
  type = 'llm' as const;
  
  async generateText(prompt: string, options?: any) {
    return { text: `Mock response to: ${prompt}`, usage: { tokens: 10 } };
  }
  
  async streamText(prompt: string, options?: any) {
    // Mock async generator
    async function* mockStream() {
      yield { text: 'Mock ', done: false };
      yield { text: 'streaming ', done: false };
      yield { text: 'response', done: true };
    }
    return mockStream();
  }
  
  async healthCheck() {
    return { healthy: true, latency: 50 };
  }
}

class MockSTTProvider implements STTProvider {
  name = 'mock-stt';
  type = 'stt' as const;
  
  async transcribe(audio: Buffer, options?: any) {
    return { text: 'Mock transcription', confidence: 0.95 };
  }
  
  async streamTranscribe(audioStream: AsyncIterable<Buffer>, options?: any) {
    async function* mockStream() {
      yield { text: 'Mock', partial: true };
      yield { text: 'Mock transcription', partial: false };
    }
    return mockStream();
  }
  
  async healthCheck() {
    return { healthy: true, latency: 30 };
  }
}

describe('ProviderRegistry', () => {
  let registry: ProviderRegistry;
  
  beforeEach(() => {
    registry = new ProviderRegistry();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Provider Registration (TC011)', () => {
    it('should register LLM providers', () => {
      const provider = new MockLLMProvider();
      registry.register(provider);
      
      const registered = registry.getProvider('llm', 'mock-llm');
      expect(registered).toBe(provider);
    });

    it('should register multiple provider types', () => {
      const llmProvider = new MockLLMProvider();
      const sttProvider = new MockSTTProvider();
      
      registry.register(llmProvider);
      registry.register(sttProvider);
      
      expect(registry.getProvider('llm', 'mock-llm')).toBe(llmProvider);
      expect(registry.getProvider('stt', 'mock-stt')).toBe(sttProvider);
    });

    it('should prevent duplicate provider registration', () => {
      const provider1 = new MockLLMProvider();
      const provider2 = new MockLLMProvider();
      
      registry.register(provider1);
      
      expect(() => registry.register(provider2))
        .toThrow('Provider mock-llm of type llm is already registered');
    });

    it('should allow provider replacement with force flag', () => {
      const provider1 = new MockLLMProvider();
      const provider2 = new MockLLMProvider();
      
      registry.register(provider1);
      registry.register(provider2, { replace: true });
      
      expect(registry.getProvider('llm', 'mock-llm')).toBe(provider2);
    });
  });

  describe('Provider Discovery (TC011)', () => {
    it('should list providers by type', () => {
      const llmProvider = new MockLLMProvider();
      const sttProvider = new MockSTTProvider();
      
      registry.register(llmProvider);
      registry.register(sttProvider);
      
      const llmProviders = registry.getProviders('llm');
      expect(llmProviders).toHaveLength(1);
      expect(llmProviders[0]).toBe(llmProvider);
    });

    it('should return empty array for unknown provider type', () => {
      const providers = registry.getProviders('unknown' as any);
      expect(providers).toEqual([]);
    });

    it('should get provider by name and type', () => {
      const provider = new MockLLMProvider();
      registry.register(provider);
      
      const found = registry.getProvider('llm', 'mock-llm');
      expect(found).toBe(provider);
    });

    it('should return undefined for unknown provider', () => {
      const found = registry.getProvider('llm', 'unknown');
      expect(found).toBeUndefined();
    });
  });

  describe('Provider Health Monitoring (TC011)', () => {
    it('should check provider health', async () => {
      const provider = new MockLLMProvider();
      registry.register(provider);
      
      const health = await registry.checkHealth('llm', 'mock-llm');
      expect(health).toEqual({ healthy: true, latency: 50 });
    });

    it('should handle health check failures', async () => {
      const provider = new MockLLMProvider();
      vi.spyOn(provider, 'healthCheck').mockRejectedValue(new Error('Health check failed'));
      
      registry.register(provider);
      
      const health = await registry.checkHealth('llm', 'mock-llm');
      expect(health).toEqual({ 
        healthy: false, 
        error: 'Health check failed',
        latency: expect.any(Number)
      });
    });

    it('should check health of all providers', async () => {
      const llmProvider = new MockLLMProvider();
      const sttProvider = new MockSTTProvider();
      
      registry.register(llmProvider);
      registry.register(sttProvider);
      
      const healthResults = await registry.checkAllHealth();
      
      expect(healthResults).toHaveLength(2);
      expect(healthResults[0]).toMatchObject({
        type: 'llm',
        name: 'mock-llm',
        healthy: true
      });
      expect(healthResults[1]).toMatchObject({
        type: 'stt',
        name: 'mock-stt',
        healthy: true
      });
    });
  });

  describe('Provider Failover (TC011)', () => {
    it('should failover to backup provider on failure', async () => {
      const primaryProvider = new MockLLMProvider();
      const backupProvider = new MockLLMProvider();
      backupProvider.name = 'backup-llm';
      
      // Make primary provider fail
      vi.spyOn(primaryProvider, 'generateText').mockRejectedValue(new Error('Primary failed'));
      
      registry.register(primaryProvider);
      registry.register(backupProvider);
      
      // Configure failover
      registry.configureFailover('llm', ['mock-llm', 'backup-llm']);
      
      const result = await registry.executeWithFailover('llm', 'generateText', 'test prompt');
      expect(result).toEqual({ 
        text: 'Mock response to: test prompt', 
        usage: { tokens: 10 },
        provider: 'backup-llm'
      });
    });

    it('should track provider failure counts', async () => {
      const provider = new MockLLMProvider();
      vi.spyOn(provider, 'generateText').mockRejectedValue(new Error('Failed'));
      
      registry.register(provider);
      
      try {
        await registry.executeWithFailover('llm', 'generateText', 'test');
      } catch (error) {
        // Expected to fail
      }
      
      const stats = registry.getProviderStats('llm', 'mock-llm');
      expect(stats.failures).toBe(1);
    });
  });

  describe('Load Balancing (TC011)', () => {
    it('should distribute requests across providers using round-robin', async () => {
      const provider1 = new MockLLMProvider();
      const provider2 = new MockLLMProvider();
      provider1.name = 'llm-1';
      provider2.name = 'llm-2';
      
      registry.register(provider1);
      registry.register(provider2);
      
      registry.configureLoadBalancing('llm', ['llm-1', 'llm-2'], 'round-robin');
      
      const result1 = await registry.executeWithLoadBalancing('llm', 'generateText', 'test1');
      const result2 = await registry.executeWithLoadBalancing('llm', 'generateText', 'test2');
      
      expect(result1.provider).toBe('llm-1');
      expect(result2.provider).toBe('llm-2');
    });

    it('should use weighted load balancing', async () => {
      const provider1 = new MockLLMProvider();
      const provider2 = new MockLLMProvider();
      provider1.name = 'llm-1';
      provider2.name = 'llm-2';
      
      registry.register(provider1);
      registry.register(provider2);
      
      registry.configureLoadBalancing('llm', [
        { name: 'llm-1', weight: 3 },
        { name: 'llm-2', weight: 1 }
      ], 'weighted');
      
      // Execute multiple requests to test distribution
      const results = await Promise.all(
        Array.from({ length: 8 }, (_, i) => 
          registry.executeWithLoadBalancing('llm', 'generateText', `test${i}`)
        )
      );
      
      const provider1Count = results.filter(r => r.provider === 'llm-1').length;
      const provider2Count = results.filter(r => r.provider === 'llm-2').length;
      
      // Should be roughly 3:1 ratio (6:2 out of 8 requests)
      expect(provider1Count).toBeGreaterThan(provider2Count);
    });
  });

  describe('Configuration Management (TC011)', () => {
    it('should load configuration from environment', () => {
      const config = {
        providers: {
          llm: {
            'openai': { apiKey: 'test-key', model: 'gpt-4' },
            'anthropic': { apiKey: 'test-key-2', model: 'claude-3' }
          }
        },
        failover: {
          llm: ['openai', 'anthropic']
        }
      };
      
      registry.loadConfiguration(config);
      
      const failoverConfig = registry.getFailoverConfiguration('llm');
      expect(failoverConfig).toEqual(['openai', 'anthropic']);
    });

    it('should validate configuration schema', () => {
      const invalidConfig = {
        providers: {
          llm: {
            'invalid': { missingApiKey: true }
          }
        }
      };
      
      expect(() => registry.loadConfiguration(invalidConfig))
        .toThrow('Invalid provider configuration');
    });
  });

  describe('Metrics and Monitoring (TC011)', () => {
    it('should track request metrics', async () => {
      const provider = new MockLLMProvider();
      registry.register(provider);
      
      await registry.executeWithFailover('llm', 'generateText', 'test');
      
      const stats = registry.getProviderStats('llm', 'mock-llm');
      expect(stats.requests).toBe(1);
      expect(stats.successes).toBe(1);
      expect(stats.failures).toBe(0);
      expect(stats.averageLatency).toBeGreaterThan(0);
    });

    it('should track latency percentiles', async () => {
      const provider = new MockLLMProvider();
      registry.register(provider);
      
      // Execute multiple requests
      await Promise.all(
        Array.from({ length: 10 }, () => 
          registry.executeWithFailover('llm', 'generateText', 'test')
        )
      );
      
      const stats = registry.getProviderStats('llm', 'mock-llm');
      expect(stats.latencyPercentiles).toHaveProperty('p50');
      expect(stats.latencyPercentiles).toHaveProperty('p95');
      expect(stats.latencyPercentiles).toHaveProperty('p99');
    });
  });
});
