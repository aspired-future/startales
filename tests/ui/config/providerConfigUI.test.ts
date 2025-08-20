/**
 * Provider Configuration UI Tests
 * Tests UI for switching providers and persisting selections without raw keys
 */

import { test, expect, Page } from '@playwright/test';

// Mock provider data
const mockProviders = {
  llm: [
    { id: 'openai', name: 'OpenAI', description: 'GPT models' },
    { id: 'ollama', name: 'Ollama', description: 'Local LLM' },
    { id: 'anthropic', name: 'Anthropic', description: 'Claude models' }
  ],
  stt: [
    { id: 'whisper', name: 'Whisper', description: 'OpenAI Whisper' },
    { id: 'vosk', name: 'Vosk', description: 'Offline speech recognition' }
  ]
};

const mockConfig = {
  providers: {
    llm: { default: 'openai' },
    stt: { default: 'whisper' }
  },
  providerConfigs: {
    openai: { apiKeyRef: 'secret://openai-key' },
    whisper: { modelPath: '/models/whisper' }
  }
};

test.describe('Provider Configuration UI', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('/api/providers/list', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProviders)
      });
    });

    await page.route('/api/settings/providers', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockConfig)
        });
      } else if (route.request().method() === 'POST') {
        const requestBody = await route.request().postDataJSON();
        
        // Validate no raw API keys
        const bodyStr = JSON.stringify(requestBody);
        expect(bodyStr).not.toContain('sk-');
        expect(bodyStr).not.toContain('claude-');
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });
  });

  test('should display available providers', async ({ page }) => {
    await page.goto('/settings');
    await page.click('[data-testid="providers-tab"]');
    
    // Check provider types
    await expect(page.locator('[data-testid="provider-type-llm"]')).toBeVisible();
    await expect(page.locator('[data-testid="provider-type-stt"]')).toBeVisible();
    
    // Select LLM and verify providers
    await page.click('[data-testid="provider-type-llm"]');
    await expect(page.locator('[data-testid="llm-provider-openai"]')).toBeVisible();
    await expect(page.locator('[data-testid="llm-provider-ollama"]')).toBeVisible();
  });

  test('should switch providers and persist without raw keys', async ({ page }) => {
    await page.goto('/settings');
    await page.click('[data-testid="providers-tab"]');
    await page.click('[data-testid="provider-type-llm"]');
    
    // Current selection
    await expect(page.locator('[data-testid="llm-provider-openai"]')).toHaveClass(/selected/);
    
    // Switch to Ollama
    await page.click('[data-testid="llm-provider-ollama"]');
    await expect(page.locator('[data-testid="llm-provider-ollama"]')).toHaveClass(/selected/);
    
    // Configure with secret reference
    await page.click('[data-testid="configure-ollama"]');
    await page.fill('[data-testid="ollama-host"]', 'localhost:11434');
    
    // Save configuration
    await page.click('[data-testid="save-config"]');
    await expect(page.locator('[data-testid="config-saved-message"]')).toBeVisible();
    
    // Verify persistence after reload
    await page.reload();
    await page.goto('/settings');
    await page.click('[data-testid="providers-tab"]');
    await page.click('[data-testid="provider-type-llm"]');
    await expect(page.locator('[data-testid="llm-provider-ollama"]')).toHaveClass(/selected/);
  });

  test('should test connections without exposing secrets', async ({ page }) => {
    await page.route('/api/providers/test-connection', async route => {
      const requestBody = await route.request().postDataJSON();
      
      // Verify no raw keys in test request
      const bodyStr = JSON.stringify(requestBody);
      expect(bodyStr).not.toContain('sk-');
      expect(bodyStr).toContain('secret://');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Connection successful' })
      });
    });
    
    await page.goto('/settings');
    await page.click('[data-testid="providers-tab"]');
    await page.click('[data-testid="provider-type-llm"]');
    
    // Configure provider with secret reference
    await page.click('[data-testid="configure-openai"]');
    await page.fill('[data-testid="openai-api-key-ref"]', 'secret://test-key');
    
    // Test connection
    await page.click('[data-testid="test-connection-openai"]');
    await expect(page.locator('[data-testid="connection-test-result"]')).toHaveText('Connection successful');
  });

  test('should handle validation errors', async ({ page }) => {
    await page.goto('/settings');
    await page.click('[data-testid="providers-tab"]');
    await page.click('[data-testid="provider-type-llm"]');
    
    // Configure with invalid values
    await page.click('[data-testid="configure-openai"]');
    await page.fill('[data-testid="openai-api-key-ref"]', 'invalid-reference');
    
    // Try to save
    await page.click('[data-testid="save-config"]');
    
    // Should show validation error
    await expect(page.locator('[data-testid="validation-error-api-key-ref"]')).toBeVisible();
    await expect(page.locator('[data-testid="validation-error-api-key-ref"]')).toContainText('must start with "secret://"');
  });

  test('should support per-campaign overrides', async ({ page }) => {
    await page.goto('/settings');
    await page.click('[data-testid="providers-tab"]');
    await page.click('[data-testid="overrides-tab"]');
    
    // Add campaign override
    await page.click('[data-testid="add-campaign-override"]');
    await page.fill('[data-testid="campaign-id-input"]', 'test-campaign');
    await page.selectOption('[data-testid="campaign-provider-select"]', 'ollama');
    await page.click('[data-testid="save-campaign-override"]');
    
    // Verify override appears
    await expect(page.locator('[data-testid="campaign-override-test-campaign"]')).toBeVisible();
    
    // Save configuration
    await page.click('[data-testid="save-config"]');
    await expect(page.locator('[data-testid="config-saved-message"]')).toBeVisible();
  });
});