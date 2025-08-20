/**
 * Secrets Manager Tests
 * Tests secret storage and retrieval functionality
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { promises as fs } from 'fs';
import { EnvSecretsManager, FileSecretsManager, MockSecretsManager, createSecretsManager } from '../SecretsManager.js';

describe('Secrets Manager', () => {
  describe('EnvSecretsManager', () => {
    let originalEnv: NodeJS.ProcessEnv;
    let manager: EnvSecretsManager;

    beforeEach(() => {
      originalEnv = { ...process.env };
      manager = new EnvSecretsManager({ envPrefix: 'TEST_' });
    });

    afterEach(() => {
      process.env = originalEnv;
      manager.clearCache();
    });

    it('should get secrets from environment variables', async () => {
      process.env.TEST_OPENAI_API_KEY = 'sk-test-key';

      const secret = await manager.getSecret('openai-api-key');
      expect(secret).toBe('sk-test-key');
    });

    it('should normalize secret keys for environment variables', async () => {
      process.env.TEST_COMPLEX_SECRET_NAME = 'test-value';

      const secret = await manager.getSecret('complex.secret-name');
      expect(secret).toBe('test-value');
    });

    it('should cache retrieved secrets', async () => {
      process.env.TEST_CACHED_SECRET = 'cached-value';

      await manager.getSecret('cached-secret');
      
      // Remove from env
      delete process.env.TEST_CACHED_SECRET;

      // Should still return cached value
      const secret = await manager.getSecret('cached-secret');
      expect(secret).toBe('cached-value');
    });

    it('should throw error for missing secrets', async () => {
      await expect(manager.getSecret('non-existent-secret')).rejects.toThrow(
        'Secret not found: non-existent-secret'
      );
    });

    it('should list secrets from environment', async () => {
      process.env.TEST_SECRET_ONE = 'value1';
      process.env.TEST_SECRET_TWO = 'value2';
      process.env.OTHER_SECRET = 'other'; // Should be ignored

      const secrets = await manager.listSecrets();
      
      expect(secrets).toContain('secret-one');
      expect(secrets).toContain('secret-two');
      expect(secrets).not.toContain('other');
    });

    it('should set secrets in cache only', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await manager.setSecret('test-secret', 'test-value');

      expect(await manager.getSecret('test-secret')).toBe('test-value');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Secret \'test-secret\' set in cache only')
      );

      consoleSpy.mockRestore();
    });

    it('should delete secrets from cache only', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await manager.setSecret('test-secret', 'test-value');
      await manager.deleteSecret('test-secret');

      await expect(manager.getSecret('test-secret')).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Secret \'test-secret\' removed from cache only')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('FileSecretsManager', () => {
    let manager: FileSecretsManager;
    let testFilePath: string;

    beforeEach(() => {
      testFilePath = `.test-secrets-${Date.now()}.json`;
      manager = new FileSecretsManager(testFilePath);
    });

    afterEach(async () => {
      try {
        await fs.unlink(testFilePath);
      } catch (error) {
        // File might not exist, ignore
      }
    });

    it('should create file if it does not exist', async () => {
      await manager.setSecret('test-secret', 'test-value');

      const content = await fs.readFile(testFilePath, 'utf-8');
      const data = JSON.parse(content);
      
      expect(data['test-secret']).toBe('test-value');
    });

    it('should get secrets from file', async () => {
      await manager.setSecret('file-secret', 'file-value');

      const secret = await manager.getSecret('file-secret');
      expect(secret).toBe('file-value');
    });

    it('should update existing secrets', async () => {
      await manager.setSecret('update-secret', 'original-value');
      await manager.setSecret('update-secret', 'updated-value');

      const secret = await manager.getSecret('update-secret');
      expect(secret).toBe('updated-value');
    });

    it('should delete secrets from file', async () => {
      await manager.setSecret('delete-secret', 'delete-value');
      await manager.deleteSecret('delete-secret');

      await expect(manager.getSecret('delete-secret')).rejects.toThrow(
        'Secret not found: delete-secret'
      );
    });

    it('should list all secrets in file', async () => {
      await manager.setSecret('secret-1', 'value-1');
      await manager.setSecret('secret-2', 'value-2');

      const secrets = await manager.listSecrets();
      
      expect(secrets).toEqual(['secret-1', 'secret-2']);
    });

    it('should handle file read errors', async () => {
      const invalidManager = new FileSecretsManager('/invalid/path/secrets.json');

      await expect(invalidManager.setSecret('test', 'value')).rejects.toThrow(
        'Failed to save secrets file'
      );
    });

    it('should load existing file on first access', async () => {
      // Create file manually
      const initialData = { 'existing-secret': 'existing-value' };
      await fs.writeFile(testFilePath, JSON.stringify(initialData), 'utf-8');

      // Create new manager instance
      const newManager = new FileSecretsManager(testFilePath);
      
      const secret = await newManager.getSecret('existing-secret');
      expect(secret).toBe('existing-value');
    });
  });

  describe('MockSecretsManager', () => {
    let manager: MockSecretsManager;

    beforeEach(() => {
      manager = new MockSecretsManager({
        'initial-secret': 'initial-value'
      });
    });

    it('should initialize with provided secrets', async () => {
      const secret = await manager.getSecret('initial-secret');
      expect(secret).toBe('initial-value');
    });

    it('should set and get secrets', async () => {
      await manager.setSecret('test-secret', 'test-value');

      const secret = await manager.getSecret('test-secret');
      expect(secret).toBe('test-value');
    });

    it('should delete secrets', async () => {
      await manager.setSecret('delete-me', 'value');
      await manager.deleteSecret('delete-me');

      await expect(manager.getSecret('delete-me')).rejects.toThrow(
        'Secret not found: delete-me'
      );
    });

    it('should list all secrets', async () => {
      await manager.setSecret('secret-1', 'value-1');
      await manager.setSecret('secret-2', 'value-2');

      const secrets = await manager.listSecrets();
      
      expect(secrets).toContain('initial-secret');
      expect(secrets).toContain('secret-1');
      expect(secrets).toContain('secret-2');
    });

    it('should get all secrets for testing', () => {
      const allSecrets = manager.getAllSecrets();
      
      expect(allSecrets).toEqual({
        'initial-secret': 'initial-value'
      });
    });

    it('should clear all secrets', async () => {
      await manager.setSecret('temp-secret', 'temp-value');
      
      manager.clear();
      
      const secrets = await manager.listSecrets();
      expect(secrets).toHaveLength(0);
    });

    it('should throw error for non-existent secrets', async () => {
      await expect(manager.getSecret('non-existent')).rejects.toThrow(
        'Secret not found: non-existent'
      );
    });

    it('should throw error when deleting non-existent secrets', async () => {
      await expect(manager.deleteSecret('non-existent')).rejects.toThrow(
        'Secret not found: non-existent'
      );
    });
  });

  describe('createSecretsManager', () => {
    it('should create env secrets manager by default', () => {
      const manager = createSecretsManager();
      expect(manager).toBeInstanceOf(EnvSecretsManager);
    });

    it('should create file secrets manager when specified', () => {
      const manager = createSecretsManager({ type: 'file' });
      expect(manager).toBeInstanceOf(FileSecretsManager);
    });

    it('should create mock secrets manager when specified', () => {
      const manager = createSecretsManager({ type: 'mock' });
      expect(manager).toBeInstanceOf(MockSecretsManager);
    });

    it('should create mock secrets manager in test environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';

      const manager = createSecretsManager();
      expect(manager).toBeInstanceOf(MockSecretsManager);

      process.env.NODE_ENV = originalEnv;
    });

    it('should pass options to created managers', () => {
      const manager = createSecretsManager({
        type: 'env',
        envPrefix: 'CUSTOM_'
      });

      expect(manager).toBeInstanceOf(EnvSecretsManager);
      // Can't easily test the prefix without accessing private properties
    });

    it('should throw error for unknown type', () => {
      expect(() => createSecretsManager({ type: 'unknown' as any })).toThrow(
        'Unknown secrets manager type: unknown'
      );
    });
  });
});
