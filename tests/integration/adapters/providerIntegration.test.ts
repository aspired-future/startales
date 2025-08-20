/**
 * Provider Adapter Framework Integration Tests
 * Tests end-to-end workflows, failover, and load balancing
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock adapter and registry for integration testing
class MockLLMAdapter {
  constructor(
    private providerId: string,
    private shouldFail: boolean = false,
    private latency: number = 100
  ) {}

  async chat(options: { messages: any[] }) {
    if (this.shouldFail) {
      throw new Error(`${this.providerId} adapter failed`);
    }
    
    await new Promise(resolve => setTimeout(resolve, this.latency));
    
    return {
      text: `Response from ${this.providerId}`,
      model: 'default',
      tokens: { input: 10, output: 5 }
    };
  }
}

class MockAdapterRegistry {
  private adapters = new Map<string, MockLLMAdapter[]>();
  private requestCounts = new Map<string, number>();
  private currentIndex = new Map<string, number>();

  registerAdapter(type: string, providerId: string, adapter: MockLLMAdapter) {
    const key = `${type}:${providerId}`;
    if (!this.adapters.has(key)) {
      this.adapters.set(key, []);
    }
    this.adapters.get(key)!.push(adapter);
    this.requestCounts.set(key, 0);
    this.currentIndex.set(key, 0);
  }

  async getAdapter(type: string, providerId: string): Promise<MockLLMAdapter> {
    const key = `${type}:${providerId}`;
    const adapters = this.adapters.get(key);
    
    if (!adapters || adapters.length === 0) {
      throw new Error(`No adapters for ${key}`);
    }
    
    // Round-robin load balancing
    const currentIdx = this.currentIndex.get(key)!;
    const adapter = adapters[currentIdx % adapters.length];
    this.currentIndex.set(key, currentIdx + 1);
    this.requestCounts.set(key, this.requestCounts.get(key)! + 1);
    
    return adapter;
  }

  async getAdapterWithFailover(
    type: string,
    primaryId: string,
    fallbackIds: string[]
  ): Promise<{ adapter: MockLLMAdapter; providerId: string }> {
    const providerIds = [primaryId, ...fallbackIds];
    
    for (const providerId of providerIds) {
      try {
        const adapter = await this.getAdapter(type, providerId);
        return { adapter, providerId };
      } catch (error) {
        continue;
      }
    }
    
    throw new Error(`All providers failed: ${providerIds.join(', ')}`);
  }

  getRequestCount(type: string, providerId: string): number {
    return this.requestCounts.get(`${type}:${providerId}`) || 0;
  }

  reset() {
    this.requestCounts.clear();
    this.currentIndex.clear();
  }
}

describe('Provider Adapter Framework Integration', () => {
  let registry: MockAdapterRegistry;

  beforeEach(() => {
    registry = new MockAdapterRegistry();
    
    // Register test adapters
    registry.registerAdapter('llm', 'openai', new MockLLMAdapter('openai', false, 100));
    registry.registerAdapter('llm', 'openai', new MockLLMAdapter('openai', false, 120));
    registry.registerAdapter('llm', 'ollama', new MockLLMAdapter('ollama', false, 200));
    registry.registerAdapter('llm', 'anthropic', new MockLLMAdapter('anthropic', false, 150));
  });

  afterEach(() => {
    registry.reset();
  });

  describe('End-to-End Workflows', () => {
    it('should complete full request lifecycle', async () => {
      const adapter = await registry.getAdapter('llm', 'openai');
      
      const startTime = Date.now();
      const result = await adapter.chat({
        messages: [{ role: 'user', content: 'Hello' }]
      });
      const endTime = Date.now();

      expect(result.text).toBe('Response from openai');
      expect(result.tokens).toEqual({ input: 10, output: 5 });
      expect(endTime - startTime).toBeGreaterThan(90);
    });

    it('should handle concurrent requests', async () => {
      const requests = Array(10).fill(0).map(async (_, i) => {
        const adapter = await registry.getAdapter('llm', 'openai');
        return adapter.chat({ messages: [{ role: 'user', content: `Request ${i}` }] });
      });

      const results = await Promise.all(requests);
      
      expect(results).toHaveLength(10);
      expect(registry.getRequestCount('llm', 'openai')).toBe(10);
      
      results.forEach(result => {
        expect(result.text).toBe('Response from openai');
      });
    });
  });

  describe('Failover Scenarios', () => {
    it('should failover to backup provider', async () => {
      registry.registerAdapter('llm', 'failing', new MockLLMAdapter('failing', true));

      const { adapter, providerId } = await registry.getAdapterWithFailover(
        'llm',
        'failing',
        ['openai', 'ollama']
      );

      expect(providerId).toBe('openai');
      
      const result = await adapter.chat({
        messages: [{ role: 'user', content: 'Test failover' }]
      });
      
      expect(result.text).toBe('Response from openai');
    });

    it('should fail when all providers unavailable', async () => {
      registry.registerAdapter('llm', 'failing1', new MockLLMAdapter('failing1', true));
      registry.registerAdapter('llm', 'failing2', new MockLLMAdapter('failing2', true));

      await expect(registry.getAdapterWithFailover(
        'llm',
        'failing1',
        ['failing2']
      )).rejects.toThrow('All providers failed');
    });
  });

  describe('Load Balancing', () => {
    it('should distribute requests across instances', async () => {
      // Add more instances
      registry.registerAdapter('llm', 'openai', new MockLLMAdapter('openai', false, 110));
      registry.registerAdapter('llm', 'openai', new MockLLMAdapter('openai', false, 130));

      const requests = Array(12).fill(0).map(async () => {
        const adapter = await registry.getAdapter('llm', 'openai');
        return adapter.chat({ messages: [{ role: 'user', content: 'Test' }] });
      });

      const results = await Promise.all(requests);
      
      expect(results).toHaveLength(12);
      expect(registry.getRequestCount('llm', 'openai')).toBe(12);
      
      results.forEach(result => {
        expect(result.text).toBe('Response from openai');
      });
    });

    it('should handle multiple providers', async () => {
      const providers = ['openai', 'ollama', 'anthropic'];
      const requestCounts = [5, 3, 7];
      
      const allRequests = [];
      
      for (let i = 0; i < providers.length; i++) {
        const provider = providers[i];
        const count = requestCounts[i];
        
        for (let j = 0; j < count; j++) {
          allRequests.push(
            registry.getAdapter('llm', provider).then(adapter =>
              adapter.chat({ messages: [{ role: 'user', content: `${provider}-${j}` }] })
            )
          );
        }
      }
      
      const results = await Promise.all(allRequests);
      expect(results).toHaveLength(15);
      
      expect(registry.getRequestCount('llm', 'openai')).toBe(5);
      expect(registry.getRequestCount('llm', 'ollama')).toBe(3);
      expect(registry.getRequestCount('llm', 'anthropic')).toBe(7);
    });
  });

  describe('Performance', () => {
    it('should handle high request volume', async () => {
      const startTime = Date.now();
      const requestCount = 50;
      
      const requests = Array(requestCount).fill(0).map(async (_, i) => {
        const provider = ['openai', 'ollama', 'anthropic'][i % 3];
        const adapter = await registry.getAdapter('llm', provider);
        return adapter.chat({ messages: [{ role: 'user', content: `Request ${i}` }] });
      });
      
      const results = await Promise.all(requests);
      const endTime = Date.now();
      
      expect(results).toHaveLength(requestCount);
      expect(endTime - startTime).toBeLessThan(3000);
      
      // Verify load distribution
      const openaiRequests = registry.getRequestCount('llm', 'openai');
      const ollamaRequests = registry.getRequestCount('llm', 'ollama');
      const anthropicRequests = registry.getRequestCount('llm', 'anthropic');
      
      expect(openaiRequests + ollamaRequests + anthropicRequests).toBe(requestCount);
    });
  });
});