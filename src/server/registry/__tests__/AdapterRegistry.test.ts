/**
 * Adapter Registry Tests (TC013)
 * Tests registry resolution, hot-switching, and configuration management
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { AdapterRegistry, AdapterType, RegistryConfig } from '../AdapterRegistry';
import { MockSecretsManager } from '../SecretsManager';
import { MemoryConfigWatcher } from '../ConfigWatcher';
import { BaseAdapter, AdapterDependencies } from '../../../shared/adapters/base';
import { LLMAdapter } from '../../../shared/adapters/llm';

// Mock adapter implementations
class MockLLMAdapter implements LLMAdapter {
  constructor(private config: Record<string, any>) {}

  async getCapabilities() {
    return {
      models: ['mock-model'],
      cost: { inputPer1K: 0.001, outputPer1K: 0.002 },
      streaming: true,
      languages: ['en']
    };
  }

  async chat(options: any) {
    return {
      text: `Mock response from ${this.config.name || 'unknown'}`,
      model: 'mock-model',
      tokens: { input: 10, output: 5 },
      finishReason: 'stop' as const
    };
  }
}

class MockSTTAdapter implements BaseAdapter {
  constructor(private config: Record<string, any>) {}

  async getCapabilities() {
    return {
      models: ['mock-stt'],
      cost: { inputPer1K: 0.001 },
      languages: ['en']
    };
  }
}

describe('Adapter Registry (TC013)', () => {
  let registry: AdapterRegistry;
  let secretsManager: MockSecretsManager;
  let configWatcher: MemoryConfigWatcher;
  let dependencies: AdapterDependencies;

  beforeEach(() => {
    // Setup secrets manager with test secrets
    secretsManager = new MockSecretsManager({
      'openai-api-key': 'sk-test-openai-key',
      'anthropic-api-key': 'sk-test-anthropic-key'
    });

    // Setup config watcher with test configuration
    const initialConfig: RegistryConfig = {
      providers: {
        llm: {
          default: 'openai',
          perCampaign: {
            'campaign-1': 'anthropic'
          },
          perSession: {
            'session-1': 'ollama'
          }
        },
        stt: {
          default: 'whisper'
        }
      },
      providerConfigs: {
        openai: {
          apiKeyRef: 'secret://openai-api-key',
          baseUrl: 'https://api.openai.com/v1',
          name: 'OpenAI'
        },
        anthropic: {
          apiKeyRef: 'secret://anthropic-api-key',
          baseUrl: 'https://api.anthropic.com',
          name: 'Anthropic'
        },
        ollama: {
          host: 'http://localhost:11434',
          name: 'Ollama'
        },
        whisper: {
          apiKeyRef: 'secret://openai-api-key',
          name: 'Whisper'
        }
      }
    };

    configWatcher = new MemoryConfigWatcher(initialConfig);

    // Setup dependencies
    dependencies = {
      logger: {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn()
      },
      requestId: () => `req-${Date.now()}`
    };

    // Create registry
    registry = new AdapterRegistry(dependencies, secretsManager, configWatcher);
  });

  afterEach(() => {
    registry.removeAllListeners();
  });

  describe('Adapter Registration', () => {
    it('should register adapter factories', () => {
      const factory = (config: any) => new MockLLMAdapter(config);
      
      registry.register('llm', 'test-provider', factory, {
        name: 'Test Provider',
        description: 'A test LLM provider',
        version: '1.0.0'
      });

      const adapters = registry.list('llm');
      expect(adapters).toHaveLength(1);
      expect(adapters[0]).toMatchObject({
        id: 'test-provider',
        type: 'llm',
        name: 'Test Provider',
        description: 'A test LLM provider',
        version: '1.0.0',
        isActive: false,
        errorCount: 0,
        successCount: 0
      });
    });

    it('should emit registration events', () => {
      const registeredSpy = jest.fn();
      registry.on('adapter-registered', registeredSpy);

      const factory = (config: any) => new MockLLMAdapter(config);
      registry.register('llm', 'test-provider', factory);

      expect(registeredSpy).toHaveBeenCalledWith({
        type: 'llm',
        id: 'test-provider'
      });
    });

    it('should unregister adapters', () => {
      const factory = (config: any) => new MockLLMAdapter(config);
      registry.register('llm', 'test-provider', factory);

      const unregisteredSpy = jest.fn();
      registry.on('adapter-unregistered', unregisteredSpy);

      registry.unregister('llm', 'test-provider');

      expect(registry.list('llm')).toHaveLength(0);
      expect(unregisteredSpy).toHaveBeenCalledWith({
        type: 'llm',
        id: 'test-provider'
      });
    });
  });

  describe('Context-based Provider Resolution', () => {
    beforeEach(() => {
      // Register test adapters
      registry.register('llm', 'openai', (config) => new MockLLMAdapter(config));
      registry.register('llm', 'anthropic', (config) => new MockLLMAdapter(config));
      registry.register('llm', 'ollama', (config) => new MockLLMAdapter(config));
    });

    it('should resolve default provider', async () => {
      const adapter = await registry.get<LLMAdapter>('llm', {});
      const result = await adapter.chat({ messages: [] });
      
      expect(result.text).toContain('OpenAI'); // Should use OpenAI config
    });

    it('should resolve campaign-specific provider', async () => {
      const adapter = await registry.get<LLMAdapter>('llm', { campaignId: 'campaign-1' });
      const result = await adapter.chat({ messages: [] });
      
      expect(result.text).toContain('Anthropic'); // Should use Anthropic config
    });

    it('should resolve session-specific provider (highest priority)', async () => {
      const adapter = await registry.get<LLMAdapter>('llm', { 
        campaignId: 'campaign-1', 
        sessionId: 'session-1' 
      });
      const result = await adapter.chat({ messages: [] });
      
      expect(result.text).toContain('Ollama'); // Should use Ollama config (session overrides campaign)
    });

    it('should fall back to campaign when session not found', async () => {
      const adapter = await registry.get<LLMAdapter>('llm', { 
        campaignId: 'campaign-1', 
        sessionId: 'non-existent-session' 
      });
      const result = await adapter.chat({ messages: [] });
      
      expect(result.text).toContain('Anthropic'); // Should use Anthropic config
    });

    it('should fall back to default when neither campaign nor session found', async () => {
      const adapter = await registry.get<LLMAdapter>('llm', { 
        campaignId: 'non-existent-campaign', 
        sessionId: 'non-existent-session' 
      });
      const result = await adapter.chat({ messages: [] });
      
      expect(result.text).toContain('OpenAI'); // Should use OpenAI config
    });
  });

  describe('Secrets Resolution', () => {
    beforeEach(() => {
      registry.register('llm', 'openai', (config) => {
        expect(config.apiKey).toBe('sk-test-openai-key'); // Should be resolved
        expect(config.apiKeyRef).toBeUndefined(); // Should be removed
        return new MockLLMAdapter(config);
      });
    });

    it('should resolve secrets from secrets manager', async () => {
      await registry.get<LLMAdapter>('llm', {});
      // Expectations are in the factory function above
    });

    it('should handle missing secrets', async () => {
      // Update config to reference non-existent secret
      configWatcher.updateProviderConfig('openai', {
        apiKeyRef: 'secret://non-existent-key',
        name: 'OpenAI'
      });

      await expect(registry.get<LLMAdapter>('llm', {})).rejects.toThrow(
        'Failed to resolve secret non-existent-key'
      );
    });
  });

  describe('Instance Caching and Reuse', () => {
    beforeEach(() => {
      let instanceCount = 0;
      registry.register('llm', 'openai', (config) => {
        instanceCount++;
        const adapter = new MockLLMAdapter(config);
        (adapter as any).instanceId = instanceCount;
        return adapter;
      });
    });

    it('should reuse adapter instances', async () => {
      const adapter1 = await registry.get<LLMAdapter>('llm', {});
      const adapter2 = await registry.get<LLMAdapter>('llm', {});
      
      expect((adapter1 as any).instanceId).toBe((adapter2 as any).instanceId);
    });

    it('should create separate instances for different providers', async () => {
      registry.register('llm', 'anthropic', (config) => new MockLLMAdapter(config));

      const openaiAdapter = await registry.get<LLMAdapter>('llm', {});
      const anthropicAdapter = await registry.get<LLMAdapter>('llm', { campaignId: 'campaign-1' });
      
      expect(openaiAdapter).not.toBe(anthropicAdapter);
    });
  });

  describe('Hot-Switching', () => {
    beforeEach(() => {
      registry.register('llm', 'openai', (config) => new MockLLMAdapter(config));
      registry.register('llm', 'anthropic', (config) => new MockLLMAdapter(config));
    });

    it('should hot-switch default provider', async () => {
      const hotSwitchSpy = jest.fn();
      registry.on('hot-switch', hotSwitchSpy);

      // Get initial adapter (should be OpenAI)
      const adapter1 = await registry.get<LLMAdapter>('llm', {});
      const result1 = await adapter1.chat({ messages: [] });
      expect(result1.text).toContain('OpenAI');

      // Hot-switch to Anthropic
      await registry.hotSwitch('llm', 'anthropic', {});

      // Get adapter again (should be Anthropic now)
      const adapter2 = await registry.get<LLMAdapter>('llm', {});
      const result2 = await adapter2.chat({ messages: [] });
      expect(result2.text).toContain('Anthropic');

      expect(hotSwitchSpy).toHaveBeenCalledWith({
        type: 'llm',
        from: 'openai',
        to: 'anthropic',
        context: {}
      });
    });

    it('should hot-switch campaign-specific provider', async () => {
      await registry.hotSwitch('llm', 'openai', { campaignId: 'campaign-2' });

      const adapter = await registry.get<LLMAdapter>('llm', { campaignId: 'campaign-2' });
      const result = await adapter.chat({ messages: [] });
      expect(result.text).toContain('OpenAI');
    });

    it('should hot-switch session-specific provider', async () => {
      await registry.hotSwitch('llm', 'anthropic', { sessionId: 'session-2' });

      const adapter = await registry.get<LLMAdapter>('llm', { sessionId: 'session-2' });
      const result = await adapter.chat({ messages: [] });
      expect(result.text).toContain('Anthropic');
    });

    it('should not emit hot-switch event when switching to same provider', async () => {
      const hotSwitchSpy = jest.fn();
      registry.on('hot-switch', hotSwitchSpy);

      await registry.hotSwitch('llm', 'openai', {}); // Already the default

      expect(hotSwitchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Configuration Changes', () => {
    beforeEach(() => {
      registry.register('llm', 'openai', (config) => new MockLLMAdapter(config));
      registry.register('llm', 'anthropic', (config) => new MockLLMAdapter(config));
    });

    it('should invalidate instances when provider config changes', async () => {
      // Get initial adapter
      const adapter1 = await registry.get<LLMAdapter>('llm', {});
      
      // Change provider config
      configWatcher.updateProviderConfig('openai', {
        apiKeyRef: 'secret://openai-api-key',
        baseUrl: 'https://api.openai.com/v1',
        name: 'OpenAI Updated'
      });

      // Get adapter again - should be new instance with updated config
      const adapter2 = await registry.get<LLMAdapter>('llm', {});
      const result = await adapter2.chat({ messages: [] });
      expect(result.text).toContain('OpenAI Updated');
    });

    it('should invalidate instances when provider mappings change', async () => {
      // Get initial adapter (should be OpenAI)
      await registry.get<LLMAdapter>('llm', {});

      // Change default provider
      configWatcher.setDefaultProvider('llm', 'anthropic');

      // Get adapter again - should be Anthropic now
      const adapter = await registry.get<LLMAdapter>('llm', {});
      const result = await adapter.chat({ messages: [] });
      expect(result.text).toContain('Anthropic');
    });

    it('should emit config-changed event', () => {
      const configChangedSpy = jest.fn();
      registry.on('config-changed', configChangedSpy);

      const newConfig: RegistryConfig = {
        providers: { llm: { default: 'anthropic' } },
        providerConfigs: { anthropic: { name: 'Anthropic' } }
      };

      registry.updateConfig(newConfig);

      expect(configChangedSpy).toHaveBeenCalledWith({ config: newConfig });
    });
  });

  describe('Error Handling', () => {
    it('should handle adapter factory errors', async () => {
      const errorSpy = jest.fn();
      registry.on('adapter-error', errorSpy);

      registry.register('llm', 'failing-provider', () => {
        throw new Error('Factory failed');
      });

      await expect(registry.get('llm', {})).rejects.toThrow(
        'Failed to create adapter llm:failing-provider: Factory failed'
      );

      expect(errorSpy).toHaveBeenCalledWith({
        type: 'llm',
        id: 'failing-provider',
        error: expect.any(Error)
      });
    });

    it('should handle missing adapter registration', async () => {
      await expect(registry.get('llm', {})).rejects.toThrow(
        'No adapter registered for llm:openai'
      );
    });

    it('should handle missing provider configuration', async () => {
      registry.register('llm', 'openai', (config) => new MockLLMAdapter(config));

      // Remove provider config
      configWatcher.updateConfig({
        providers: { llm: { default: 'openai' } },
        providerConfigs: {} // Empty configs
      });

      await expect(registry.get('llm', {})).rejects.toThrow(
        'No configuration found for provider: openai'
      );
    });

    it('should handle missing adapter type configuration', async () => {
      configWatcher.updateConfig({
        providers: {}, // No LLM config
        providerConfigs: {}
      });

      await expect(registry.get('llm', {})).rejects.toThrow(
        'No configuration found for adapter type: llm'
      );
    });
  });

  describe('Statistics and Monitoring', () => {
    beforeEach(() => {
      registry.register('llm', 'openai', (config) => new MockLLMAdapter(config));
      registry.register('llm', 'failing-provider', () => {
        throw new Error('Always fails');
      });
    });

    it('should track success statistics', async () => {
      await registry.get<LLMAdapter>('llm', {});
      await registry.get<LLMAdapter>('llm', {}); // Second call (cached)

      const stats = registry.getStats();
      expect(stats['llm:openai']).toMatchObject({
        errors: 0,
        successes: 1, // Only counted once due to caching
        lastUsed: expect.any(Date)
      });
    });

    it('should track error statistics', async () => {
      try {
        await registry.get('llm', { campaignId: 'test-campaign' });
      } catch (error) {
        // Expected to fail
      }

      // Update config to use failing provider for test campaign
      configWatcher.setCampaignProvider('llm', 'test-campaign', 'failing-provider');

      try {
        await registry.get('llm', { campaignId: 'test-campaign' });
      } catch (error) {
        // Expected to fail
      }

      const stats = registry.getStats();
      expect(stats['llm:failing-provider']).toMatchObject({
        errors: 1,
        successes: 0
      });
    });

    it('should update adapter info with statistics', async () => {
      await registry.get<LLMAdapter>('llm', {});

      const adapters = registry.list('llm');
      const openaiAdapter = adapters.find(a => a.id === 'openai');

      expect(openaiAdapter).toMatchObject({
        isActive: true,
        successCount: 1,
        errorCount: 0,
        lastUsed: expect.any(Date)
      });
    });
  });

  describe('Utility Methods', () => {
    beforeEach(() => {
      registry.register('llm', 'openai', (config) => new MockLLMAdapter(config));
      registry.register('stt', 'whisper', (config) => new MockSTTAdapter(config));
    });

    it('should list all adapters by type', () => {
      const allAdapters = registry.listAll();

      expect(allAdapters.llm).toHaveLength(1);
      expect(allAdapters.stt).toHaveLength(1);
      expect(allAdapters.tts).toHaveLength(0);
      expect(allAdapters.image).toHaveLength(0);
      expect(allAdapters.video).toHaveLength(0);
      expect(allAdapters.embeddings).toHaveLength(0);
    });

    it('should clear all instances', async () => {
      // Create some instances
      await registry.get<LLMAdapter>('llm', {});

      let adapters = registry.list('llm');
      expect(adapters[0].isActive).toBe(true);

      // Clear instances
      registry.clearInstances();

      adapters = registry.list('llm');
      expect(adapters[0].isActive).toBe(false);
    });

    it('should get current configuration', () => {
      const config = registry.getConfig();

      expect(config.providers.llm?.default).toBe('openai');
      expect(config.providerConfigs.openai).toBeDefined();
    });
  });
});
