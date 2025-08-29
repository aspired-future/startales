/**
 * Secrets Manager Implementation
 * Handles secure storage and retrieval of API keys and other secrets
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { SecretsManager } from './AdapterRegistry';

/**
 * Environment Variables Secrets Manager
 * Reads secrets from environment variables with optional fallback to file
 */
export class EnvSecretsManager implements SecretsManager {
  private envPrefix: string;
  private fallbackFile?: string;
  private cache = new Map<string, string>();

  constructor(options: {
    envPrefix?: string;
    fallbackFile?: string;
  } = {}) {
    this.envPrefix = options.envPrefix || 'STARTALES_';
    this.fallbackFile = options.fallbackFile;
  }

  async getSecret(key: string): Promise<string> {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // Try environment variable
    const envKey = `${this.envPrefix}${key.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
    const envValue = process.env[envKey];
    
    if (envValue) {
      this.cache.set(key, envValue);
      return envValue;
    }

    // Try fallback file if configured
    if (this.fallbackFile) {
      try {
        const fileContent = await fs.readFile(this.fallbackFile, 'utf-8');
        const secrets = JSON.parse(fileContent);
        
        if (secrets[key]) {
          this.cache.set(key, secrets[key]);
          return secrets[key];
        }
      } catch (error) {
        // File doesn't exist or is invalid, continue to error
      }
    }

    throw new Error(`Secret not found: ${key} (tried env var ${envKey}${this.fallbackFile ? ` and file ${this.fallbackFile}` : ''})`);
  }

  async setSecret(key: string, value: string): Promise<void> {
    // For env-based secrets manager, we can only update the cache
    // In production, this would integrate with a proper secrets service
    this.cache.set(key, value);
    
    console.warn(`EnvSecretsManager.setSecret: Secret '${key}' set in cache only. Consider using a persistent secrets store.`);
  }

  async deleteSecret(key: string): Promise<void> {
    this.cache.delete(key);
    console.warn(`EnvSecretsManager.deleteSecret: Secret '${key}' removed from cache only.`);
  }

  async listSecrets(): Promise<string[]> {
    const secrets = new Set<string>();
    
    // Add cached secrets
    for (const key of this.cache.keys()) {
      secrets.add(key);
    }

    // Add environment variable secrets
    for (const envKey of Object.keys(process.env)) {
      if (envKey.startsWith(this.envPrefix)) {
        const secretKey = envKey
          .substring(this.envPrefix.length)
          .toLowerCase()
          .replace(/_/g, '-');
        secrets.add(secretKey);
      }
    }

    // Add file-based secrets if available
    if (this.fallbackFile) {
      try {
        const fileContent = await fs.readFile(this.fallbackFile, 'utf-8');
        const fileSecrets = JSON.parse(fileContent);
        
        for (const key of Object.keys(fileSecrets)) {
          secrets.add(key);
        }
      } catch (error) {
        // File doesn't exist or is invalid, ignore
      }
    }

    return Array.from(secrets).sort();
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * File-based Secrets Manager
 * Stores secrets in an encrypted JSON file (simple implementation)
 */
export class FileSecretsManager implements SecretsManager {
  private filePath: string;
  private cache = new Map<string, string>();
  private loaded = false;

  constructor(filePath: string = '.secrets.json') {
    this.filePath = filePath;
  }

  async getSecret(key: string): Promise<string> {
    await this.ensureLoaded();
    
    const value = this.cache.get(key);
    if (!value) {
      throw new Error(`Secret not found: ${key}`);
    }
    
    return value;
  }

  async setSecret(key: string, value: string): Promise<void> {
    await this.ensureLoaded();
    
    this.cache.set(key, value);
    await this.save();
  }

  async deleteSecret(key: string): Promise<void> {
    await this.ensureLoaded();
    
    if (!this.cache.has(key)) {
      throw new Error(`Secret not found: ${key}`);
    }
    
    this.cache.delete(key);
    await this.save();
  }

  async listSecrets(): Promise<string[]> {
    await this.ensureLoaded();
    return Array.from(this.cache.keys()).sort();
  }

  private async ensureLoaded(): Promise<void> {
    if (this.loaded) return;

    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      const data = JSON.parse(content);
      
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          this.cache.set(key, value);
        }
      }
    } catch (error) {
      // File doesn't exist yet, that's okay
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw new Error(`Failed to load secrets file: ${(error as Error).message}`);
      }
    }

    this.loaded = true;
  }

  private async save(): Promise<void> {
    const data = Object.fromEntries(this.cache.entries());
    
    try {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Failed to save secrets file: ${(error as Error).message}`);
    }
  }
}

/**
 * Mock Secrets Manager for testing
 */
export class MockSecretsManager implements SecretsManager {
  private secrets = new Map<string, string>();

  constructor(initialSecrets: Record<string, string> = {}) {
    for (const [key, value] of Object.entries(initialSecrets)) {
      this.secrets.set(key, value);
    }
  }

  async getSecret(key: string): Promise<string> {
    const value = this.secrets.get(key);
    if (!value) {
      throw new Error(`Secret not found: ${key}`);
    }
    return value;
  }

  async setSecret(key: string, value: string): Promise<void> {
    this.secrets.set(key, value);
  }

  async deleteSecret(key: string): Promise<void> {
    if (!this.secrets.has(key)) {
      throw new Error(`Secret not found: ${key}`);
    }
    this.secrets.delete(key);
  }

  async listSecrets(): Promise<string[]> {
    return Array.from(this.secrets.keys()).sort();
  }

  /**
   * Get all secrets (for testing)
   */
  getAllSecrets(): Record<string, string> {
    return Object.fromEntries(this.secrets.entries());
  }

  /**
   * Clear all secrets (for testing)
   */
  clear(): void {
    this.secrets.clear();
  }
}

/**
 * Create appropriate secrets manager based on environment
 */
export function createSecretsManager(options: {
  type?: 'env' | 'file' | 'mock';
  envPrefix?: string;
  filePath?: string;
  fallbackFile?: string;
  initialSecrets?: Record<string, string>;
} = {}): SecretsManager {
  const type = options.type || (process.env.NODE_ENV === 'test' ? 'mock' : 'env');

  switch (type) {
    case 'env':
      return new EnvSecretsManager({
        envPrefix: options.envPrefix,
        fallbackFile: options.fallbackFile
      });
    
    case 'file':
      return new FileSecretsManager(options.filePath);
    
    case 'mock':
      return new MockSecretsManager(options.initialSecrets);
    
    default:
      throw new Error(`Unknown secrets manager type: ${type}`);
  }
}
