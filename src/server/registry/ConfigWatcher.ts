/**
 * Configuration Watcher Implementation
 * Watches for configuration changes and notifies the registry
 */

import { EventEmitter } from 'events';
import { promises as fs } from 'fs';
import { watch, FSWatcher } from 'fs';
import { join } from 'path';
import { ConfigWatcher, RegistryConfig } from './AdapterRegistry.js';

/**
 * File-based Configuration Watcher
 * Watches a JSON configuration file for changes
 */
export class FileConfigWatcher extends EventEmitter implements ConfigWatcher {
  private configPath: string;
  private watcher?: FSWatcher;
  private currentConfig?: RegistryConfig;
  private watchDebounceMs: number;
  private debounceTimer?: NodeJS.Timeout;

  constructor(configPath: string, watchDebounceMs = 1000) {
    super();
    this.configPath = configPath;
    this.watchDebounceMs = watchDebounceMs;
  }

  async start(): Promise<void> {
    // Load initial configuration
    await this.loadConfig();

    // Start watching for changes
    try {
      this.watcher = watch(this.configPath, (eventType) => {
        if (eventType === 'change') {
          this.debouncedReload();
        }
      });

      console.log(`📁 Config watcher started for: ${this.configPath}`);
    } catch (error) {
      console.warn(`⚠️ Failed to start config watcher: ${(error as Error).message}`);
    }
  }

  async stop(): Promise<void> {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = undefined;
    }

    if (this.watcher) {
      this.watcher.close();
      this.watcher = undefined;
    }

    console.log(`📁 Config watcher stopped for: ${this.configPath}`);
  }

  async getCurrentConfig(): Promise<RegistryConfig> {
    if (!this.currentConfig) {
      await this.loadConfig();
    }
    return this.currentConfig!;
  }

  private async loadConfig(): Promise<void> {
    try {
      const content = await fs.readFile(this.configPath, 'utf-8');
      const config = JSON.parse(content) as RegistryConfig;
      
      // Validate configuration structure
      this.validateConfig(config);
      
      const oldConfig = this.currentConfig;
      this.currentConfig = config;

      // Emit change event if config actually changed
      if (oldConfig && JSON.stringify(oldConfig) !== JSON.stringify(config)) {
        this.emit('config-changed', config);
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // Config file doesn't exist, create default
        await this.createDefaultConfig();
      } else {
        console.error(`❌ Failed to load config from ${this.configPath}:`, error);
        throw error;
      }
    }
  }

  private validateConfig(config: any): asserts config is RegistryConfig {
    if (!config || typeof config !== 'object') {
      throw new Error('Configuration must be an object');
    }

    if (!config.providers || typeof config.providers !== 'object') {
      throw new Error('Configuration must have a "providers" object');
    }

    if (!config.providerConfigs || typeof config.providerConfigs !== 'object') {
      throw new Error('Configuration must have a "providerConfigs" object');
    }

    // Validate provider configurations
    for (const [type, typeConfig] of Object.entries(config.providers)) {
      if (!['llm', 'stt', 'tts', 'image', 'video', 'embeddings'].includes(type)) {
        throw new Error(`Invalid adapter type: ${type}`);
      }

      if (typeof typeConfig !== 'object' || !typeConfig.default) {
        throw new Error(`Provider type ${type} must have a default provider`);
      }
    }
  }

  private async createDefaultConfig(): Promise<void> {
    const defaultConfig: RegistryConfig = {
      providers: {
        llm: {
          default: 'openai'
        },
        stt: {
          default: 'whisper'
        },
        tts: {
          default: 'system'
        },
        image: {
          default: 'openai'
        },
        embeddings: {
          default: 'openai'
        }
      },
      providerConfigs: {
        openai: {
          apiKeyRef: 'secret://openai-api-key',
          baseUrl: 'https://api.openai.com/v1'
        },
        whisper: {
          apiKeyRef: 'secret://openai-api-key',
          baseUrl: 'https://api.openai.com/v1'
        },
        system: {
          // System TTS doesn't need API key
        },
        ollama: {
          host: 'http://localhost:11434',
          timeout: 30000
        }
      }
    };

    try {
      await fs.writeFile(this.configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
      this.currentConfig = defaultConfig;
      console.log(`📁 Created default config at: ${this.configPath}`);
    } catch (error) {
      console.error(`❌ Failed to create default config:`, error);
      throw error;
    }
  }

  private debouncedReload(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(async () => {
      try {
        await this.loadConfig();
      } catch (error) {
        console.error(`❌ Failed to reload config:`, error);
        this.emit('error', error);
      }
    }, this.watchDebounceMs);
  }
}

/**
 * In-Memory Configuration Watcher
 * For testing and development - allows programmatic config updates
 */
export class MemoryConfigWatcher extends EventEmitter implements ConfigWatcher {
  private config: RegistryConfig;

  constructor(initialConfig?: RegistryConfig) {
    super();
    this.config = initialConfig || this.getDefaultConfig();
  }

  async start(): Promise<void> {
    // Nothing to start for memory watcher
  }

  async stop(): Promise<void> {
    // Nothing to stop for memory watcher
  }

  async getCurrentConfig(): Promise<RegistryConfig> {
    return { ...this.config };
  }

  /**
   * Update configuration programmatically
   */
  updateConfig(newConfig: RegistryConfig): void {
    const oldConfig = this.config;
    this.config = { ...newConfig };

    if (JSON.stringify(oldConfig) !== JSON.stringify(newConfig)) {
      this.emit('config-changed', this.config);
    }
  }

  /**
   * Update provider configuration
   */
  updateProviderConfig(providerId: string, config: Record<string, any>): void {
    const newConfig = { ...this.config };
    newConfig.providerConfigs = { ...newConfig.providerConfigs };
    newConfig.providerConfigs[providerId] = { ...config };
    
    this.updateConfig(newConfig);
  }

  /**
   * Set default provider for a type
   */
  setDefaultProvider(type: keyof RegistryConfig['providers'], providerId: string): void {
    const newConfig = { ...this.config };
    newConfig.providers = { ...newConfig.providers };
    
    if (!newConfig.providers[type]) {
      newConfig.providers[type] = { default: providerId };
    } else {
      newConfig.providers[type] = { ...newConfig.providers[type], default: providerId };
    }
    
    this.updateConfig(newConfig);
  }

  /**
   * Set campaign-specific provider
   */
  setCampaignProvider(type: keyof RegistryConfig['providers'], campaignId: string, providerId: string): void {
    const newConfig = { ...this.config };
    newConfig.providers = { ...newConfig.providers };
    
    if (!newConfig.providers[type]) {
      newConfig.providers[type] = { default: 'unknown' };
    }
    
    const typeConfig = { ...newConfig.providers[type] };
    if (!typeConfig.perCampaign) {
      typeConfig.perCampaign = {};
    }
    typeConfig.perCampaign = { ...typeConfig.perCampaign };
    typeConfig.perCampaign[campaignId] = providerId;
    
    newConfig.providers[type] = typeConfig;
    this.updateConfig(newConfig);
  }

  /**
   * Set session-specific provider
   */
  setSessionProvider(type: keyof RegistryConfig['providers'], sessionId: string, providerId: string): void {
    const newConfig = { ...this.config };
    newConfig.providers = { ...newConfig.providers };
    
    if (!newConfig.providers[type]) {
      newConfig.providers[type] = { default: 'unknown' };
    }
    
    const typeConfig = { ...newConfig.providers[type] };
    if (!typeConfig.perSession) {
      typeConfig.perSession = {};
    }
    typeConfig.perSession = { ...typeConfig.perSession };
    typeConfig.perSession[sessionId] = providerId;
    
    newConfig.providers[type] = typeConfig;
    this.updateConfig(newConfig);
  }

  private getDefaultConfig(): RegistryConfig {
    return {
      providers: {
        llm: {
          default: 'openai'
        }
      },
      providerConfigs: {
        openai: {
          apiKeyRef: 'secret://openai-api-key'
        }
      }
    };
  }
}

/**
 * Create appropriate config watcher based on environment
 */
export function createConfigWatcher(options: {
  type?: 'file' | 'memory';
  configPath?: string;
  watchDebounceMs?: number;
  initialConfig?: RegistryConfig;
} = {}): ConfigWatcher {
  const type = options.type || (process.env.NODE_ENV === 'test' ? 'memory' : 'file');

  switch (type) {
    case 'file':
      return new FileConfigWatcher(
        options.configPath || join(process.cwd(), '.taskmaster', 'adapter-config.json'),
        options.watchDebounceMs
      );
    
    case 'memory':
      return new MemoryConfigWatcher(options.initialConfig);
    
    default:
      throw new Error(`Unknown config watcher type: ${type}`);
  }
}
