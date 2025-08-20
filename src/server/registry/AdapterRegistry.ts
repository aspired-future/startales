/**
 * Adapter Registry with Runtime Selection and Hot-Switching
 * Manages adapter instances with per-campaign and per-session overrides
 */

import { EventEmitter } from 'events';
import { BaseAdapter, AdapterDependencies } from '../../shared/adapters/base.js';
import { 
  LLMAdapter, 
  STTAdapter, 
  TTSAdapter, 
  ImageGenAdapter, 
  VideoGenAdapter, 
  EmbeddingsAdapter 
} from '../../shared/adapters/index.js';

// Import all the real adapters
import { OllamaLLMAdapter } from '../providers/OllamaLLMAdapter.js';
import { OpenAILLMAdapter } from '../providers/OpenAILLMAdapter.js';
import { AnthropicLLMAdapter } from '../providers/AnthropicLLMAdapter.js';
import { GeminiLLMAdapter } from '../providers/GeminiLLMAdapter.js';
import { GrokLLMAdapter } from '../providers/GrokLLMAdapter.js';

// Adapter Types
export type AdapterType = 'llm' | 'stt' | 'tts' | 'image' | 'video' | 'embeddings';

// Union type for all adapters
export type AnyAdapter = LLMAdapter | STTAdapter | TTSAdapter | ImageGenAdapter | VideoGenAdapter | EmbeddingsAdapter;

// Adapter Factory Function
export type AdapterFactory<T extends BaseAdapter = BaseAdapter> = (
  config: Record<string, any>,
  dependencies: AdapterDependencies
) => T | Promise<T>;

// Adapter Information
export interface AdapterInfo {
  id: string;
  type: AdapterType;
  name: string;
  description?: string;
  version?: string;
  capabilities?: any;
  isActive: boolean;
  lastUsed?: Date;
  errorCount: number;
  successCount: number;
}

// Provider Configuration
export interface ProviderConfig {
  apiKeyRef?: string;
  baseUrl?: string;
  host?: string;
  timeout?: number;
  retries?: number;
  [key: string]: any;
}

// Registry Configuration
export interface RegistryConfig {
  providers: {
    [K in AdapterType]?: {
      default: string;
      perCampaign?: Record<string, string>;
      perSession?: Record<string, string>;
    };
  };
  providerConfigs: Record<string, ProviderConfig>;
}

// Context for adapter resolution
export interface AdapterContext {
  campaignId?: string;
  sessionId?: string;
  userId?: string;
  requestId?: string;
}

// Registry Events
export interface RegistryEvents {
  'adapter-registered': { type: AdapterType; id: string };
  'adapter-unregistered': { type: AdapterType; id: string };
  'config-changed': { config: RegistryConfig };
  'adapter-error': { type: AdapterType; id: string; error: Error };
  'adapter-success': { type: AdapterType; id: string };
  'hot-switch': { type: AdapterType; from: string; to: string; context: AdapterContext };
}

/**
 * Adapter Registry with Hot-Switching Support
 */
export class AdapterRegistry extends EventEmitter {
  private factories = new Map<string, { type: AdapterType; factory: AdapterFactory; info: Partial<AdapterInfo> }>();
  private instances = new Map<string, BaseAdapter>();
  private config: RegistryConfig = { providers: {}, providerConfigs: {} };
  private dependencies: AdapterDependencies;
  private secretsManager?: SecretsManager;
  private configWatcher?: ConfigWatcher;
  private stats = new Map<string, { errors: number; successes: number; lastUsed?: Date }>();

  constructor(
    dependencies: AdapterDependencies = {},
    secretsManager?: SecretsManager,
    configWatcher?: ConfigWatcher
  ) {
    super();
    this.dependencies = dependencies;
    this.secretsManager = secretsManager;
    this.configWatcher = configWatcher;

    // Set up config watching
    if (this.configWatcher) {
      this.configWatcher.on('config-changed', (newConfig: RegistryConfig) => {
        this.updateConfig(newConfig);
      });
    }
  }

  /**
   * Register an adapter factory
   */
  register<T extends BaseAdapter>(
    type: AdapterType,
    id: string,
    factory: AdapterFactory<T>,
    info: Partial<AdapterInfo> = {}
  ): void {
    const key = `${type}:${id}`;
    
    this.factories.set(key, {
      type,
      factory: factory as AdapterFactory,
      info: {
        id,
        type,
        name: info.name || id,
        description: info.description,
        version: info.version,
        isActive: false,
        errorCount: 0,
        successCount: 0,
        ...info
      }
    });

    // Initialize stats
    if (!this.stats.has(key)) {
      this.stats.set(key, { errors: 0, successes: 0 });
    }

    this.emit('adapter-registered', { type, id });
  }

  /**
   * Unregister an adapter
   */
  unregister(type: AdapterType, id: string): void {
    const key = `${type}:${id}`;
    
    // Remove factory
    this.factories.delete(key);
    
    // Remove instance if exists
    if (this.instances.has(key)) {
      this.instances.delete(key);
    }

    // Remove stats
    this.stats.delete(key);

    this.emit('adapter-unregistered', { type, id });
  }

  /**
   * Get adapter instance with context-based resolution
   */
  async get<T extends BaseAdapter>(
    type: AdapterType,
    context: AdapterContext = {}
  ): Promise<T> {
    const providerId = this.resolveProviderId(type, context);
    const key = `${type}:${providerId}`;

    // Check if we have a factory for this provider
    const factoryEntry = this.factories.get(key);
    if (!factoryEntry) {
      throw new Error(`No adapter registered for ${type}:${providerId}`);
    }

    // Get or create instance
    let instance = this.instances.get(key);
    if (!instance) {
      try {
        const config = await this.resolveProviderConfig(providerId);
        instance = await factoryEntry.factory(config, this.dependencies);
        this.instances.set(key, instance);
        
        // Update stats
        const stats = this.stats.get(key)!;
        stats.successes++;
        stats.lastUsed = new Date();
        this.stats.set(key, stats);

        this.emit('adapter-success', { type, id: providerId });
      } catch (error) {
        // Update error stats
        const stats = this.stats.get(key) || { errors: 0, successes: 0 };
        stats.errors++;
        this.stats.set(key, stats);

        this.emit('adapter-error', { type, id: providerId, error: error as Error });
        throw new Error(`Failed to create adapter ${type}:${providerId}: ${(error as Error).message}`);
      }
    } else {
      // Update last used
      const stats = this.stats.get(key)!;
      stats.lastUsed = new Date();
      this.stats.set(key, stats);
    }

    return instance as T;
  }

  /**
   * List available adapters of a specific type
   */
  list(type: AdapterType): AdapterInfo[] {
    const adapters: AdapterInfo[] = [];

    for (const [key, entry] of this.factories.entries()) {
      if (entry.type === type) {
        const stats = this.stats.get(key) || { errors: 0, successes: 0 };
        const isActive = this.instances.has(key);

        adapters.push({
          ...entry.info,
          id: entry.info.id!,
          type: entry.type,
          name: entry.info.name!,
          isActive,
          errorCount: stats.errors,
          successCount: stats.successes,
          lastUsed: stats.lastUsed
        });
      }
    }

    return adapters.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * List all registered adapters
   */
  listAll(): Record<AdapterType, AdapterInfo[]> {
    const result = {} as Record<AdapterType, AdapterInfo[]>;
    const types: AdapterType[] = ['llm', 'stt', 'tts', 'image', 'video', 'embeddings'];

    for (const type of types) {
      result[type] = this.list(type);
    }

    return result;
  }

  /**
   * Update registry configuration
   */
  updateConfig(newConfig: RegistryConfig): void {
    const oldConfig = this.config;
    this.config = { ...newConfig };

    // Detect changes and invalidate affected instances
    this.invalidateChangedInstances(oldConfig, newConfig);

    this.emit('config-changed', { config: newConfig });
  }

  /**
   * Get current configuration
   */
  getConfig(): RegistryConfig {
    return { ...this.config };
  }

  /**
   * Hot-switch provider for a specific context
   */
  async hotSwitch(
    type: AdapterType,
    newProviderId: string,
    context: AdapterContext
  ): Promise<void> {
    const oldProviderId = this.resolveProviderId(type, context);
    
    if (oldProviderId === newProviderId) {
      return; // No change needed
    }

    // Update configuration
    if (context.sessionId) {
      if (!this.config.providers[type]) {
        this.config.providers[type] = { default: newProviderId };
      }
      if (!this.config.providers[type]!.perSession) {
        this.config.providers[type]!.perSession = {};
      }
      this.config.providers[type]!.perSession![context.sessionId] = newProviderId;
    } else if (context.campaignId) {
      if (!this.config.providers[type]) {
        this.config.providers[type] = { default: newProviderId };
      }
      if (!this.config.providers[type]!.perCampaign) {
        this.config.providers[type]!.perCampaign = {};
      }
      this.config.providers[type]!.perCampaign![context.campaignId] = newProviderId;
    } else {
      // Update default
      if (!this.config.providers[type]) {
        this.config.providers[type] = { default: newProviderId };
      } else {
        this.config.providers[type]!.default = newProviderId;
      }
    }

    this.emit('hot-switch', { type, from: oldProviderId, to: newProviderId, context });
  }

  /**
   * Clear all instances (force recreation)
   */
  clearInstances(): void {
    this.instances.clear();
  }

  /**
   * Get registry statistics
   */
  getStats(): Record<string, { errors: number; successes: number; lastUsed?: Date }> {
    return Object.fromEntries(this.stats.entries());
  }

  /**
   * Set provider configuration for a specific adapter type
   */
  setProviderConfig(type: AdapterType, config: { default: string; perCampaign?: Record<string, string>; perSession?: Record<string, string> }): void {
    this.config.providers[type] = config;
    this.emit('config-changed', { config: this.config });
  }

  /**
   * Resolve provider ID based on context hierarchy
   */
  private resolveProviderId(type: AdapterType, context: AdapterContext): string {
    const typeConfig = this.config.providers[type];
    if (!typeConfig) {
      throw new Error(`No configuration found for adapter type: ${type}`);
    }

    // Session override takes precedence
    if (context.sessionId && typeConfig.perSession?.[context.sessionId]) {
      return typeConfig.perSession[context.sessionId];
    }

    // Campaign override is next
    if (context.campaignId && typeConfig.perCampaign?.[context.campaignId]) {
      return typeConfig.perCampaign[context.campaignId];
    }

    // Fall back to default
    if (!typeConfig.default) {
      throw new Error(`No default provider configured for adapter type: ${type}`);
    }

    return typeConfig.default;
  }

  /**
   * Resolve provider configuration with secrets
   */
  private async resolveProviderConfig(providerId: string): Promise<Record<string, any>> {
    const config = this.config.providerConfigs[providerId];
    if (!config) {
      throw new Error(`No configuration found for provider: ${providerId}`);
    }

    const resolvedConfig = { ...config };

    // Resolve secrets
    if (this.secretsManager && config.apiKeyRef && config.apiKeyRef.startsWith('secret://')) {
      const secretKey = config.apiKeyRef.replace('secret://', '');
      try {
        resolvedConfig.apiKey = await this.secretsManager.getSecret(secretKey);
        delete resolvedConfig.apiKeyRef; // Remove reference, keep resolved value
      } catch (error) {
        throw new Error(`Failed to resolve secret ${secretKey}: ${(error as Error).message}`);
      }
    }

    return resolvedConfig;
  }

  /**
   * Invalidate instances that are affected by config changes
   */
  private invalidateChangedInstances(oldConfig: RegistryConfig, newConfig: RegistryConfig): void {
    // Compare provider configs
    for (const [providerId, newProviderConfig] of Object.entries(newConfig.providerConfigs)) {
      const oldProviderConfig = oldConfig.providerConfigs[providerId];
      
      if (!oldProviderConfig || JSON.stringify(oldProviderConfig) !== JSON.stringify(newProviderConfig)) {
        // Provider config changed, invalidate all instances using this provider
        for (const [key, instance] of this.instances.entries()) {
          if (key.endsWith(`:${providerId}`)) {
            this.instances.delete(key);
          }
        }
      }
    }

    // Compare provider mappings
    for (const type of Object.keys(newConfig.providers) as AdapterType[]) {
      const oldTypeConfig = oldConfig.providers[type];
      const newTypeConfig = newConfig.providers[type];

      if (!oldTypeConfig || JSON.stringify(oldTypeConfig) !== JSON.stringify(newTypeConfig)) {
        // Provider mappings changed, clear instances for this type
        for (const [key, instance] of this.instances.entries()) {
          if (key.startsWith(`${type}:`)) {
            this.instances.delete(key);
          }
        }
      }
    }
  }
}

/**
 * Secrets Manager Interface
 */
export interface SecretsManager {
  getSecret(key: string): Promise<string>;
  setSecret(key: string, value: string): Promise<void>;
  deleteSecret(key: string): Promise<void>;
  listSecrets(): Promise<string[]>;
}

/**
 * Config Watcher Interface
 */
export interface ConfigWatcher extends EventEmitter {
  start(): Promise<void>;
  stop(): Promise<void>;
  getCurrentConfig(): Promise<RegistryConfig>;
}

/**
 * Default registry instance
 */
export let defaultRegistry: AdapterRegistry;

/**
 * Initialize the global adapter registry with all available adapters
 */
export function initializeRegistry(): void {
  if (defaultRegistry) {
    return; // Already initialized
  }

  defaultRegistry = new AdapterRegistry();

  // Register all LLM adapters with factory functions
  defaultRegistry.register('llm', 'ollama', 
    (config, deps) => new OllamaLLMAdapter(config, deps), {
    description: 'Local/AWS Ollama LLM - cost-effective, great for standard gameplay'
  });

  defaultRegistry.register('llm', 'openai', 
    (config, deps) => new OpenAILLMAdapter(config, deps), {
    description: 'OpenAI GPT models - premium quality for elite gameplay'
  });

  defaultRegistry.register('llm', 'anthropic', 
    (config, deps) => new AnthropicLLMAdapter(config, deps), {
    description: 'Anthropic Claude models - excellent reasoning for complex narratives'
  });

  defaultRegistry.register('llm', 'gemini', 
    (config, deps) => new GeminiLLMAdapter(config, deps), {
    description: 'Google Gemini models - multimodal capabilities for visual elements'
  });

  defaultRegistry.register('llm', 'grok', 
    (config, deps) => new GrokLLMAdapter(config, deps), {
    description: 'xAI Grok models - real-time knowledge for current events'
  });

  // Set default provider configuration
  defaultRegistry.setProviderConfig('llm', {
    default: 'ollama',
    perCampaign: {},
    perSession: {}
  });
}

/**
 * Get default registry instance
 */
export function getRegistry(): AdapterRegistry {
  if (!defaultRegistry) {
    throw new Error('Registry not initialized. Call initializeRegistry() first.');
  }
  return defaultRegistry;
}
