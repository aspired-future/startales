import { Router } from 'express';
import { getRegistry } from '../registry/AdapterRegistry';
import { AdapterType } from '../../shared/adapters/index';

export const providersRouter = Router();

/**
 * GET /api/providers
 * List all available providers by type
 */
providersRouter.get('/', async (_req, res) => {
  try {
    const registry = getRegistry();
    const allProviders = registry.listAll();
    
    res.json({
      providers: allProviders,
      stats: registry.getStats(),
      config: registry.getConfig()
    });
  } catch (error) {
    console.error('Error listing providers:', error);
    res.status(500).json({ 
      error: 'Failed to list providers',
      message: (error as Error).message 
    });
  }
});

/**
 * GET /api/providers/:type
 * List providers of a specific type
 */
providersRouter.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    // Validate adapter type
    if (!Object.values(AdapterType).includes(type as AdapterType)) {
      return res.status(400).json({ 
        error: 'Invalid adapter type',
        validTypes: Object.values(AdapterType)
      });
    }
    
    const registry = getRegistry();
    const providers = registry.list(type as AdapterType);
    
    res.json({
      type,
      providers,
      stats: registry.getStats()
    });
  } catch (error) {
    console.error(`Error listing ${req.params.type} providers:`, error);
    res.status(500).json({ 
      error: `Failed to list ${req.params.type} providers`,
      message: (error as Error).message 
    });
  }
});

/**
 * GET /api/providers/config
 * Get current provider configuration
 */
providersRouter.get('/config', async (_req, res) => {
  try {
    const registry = getRegistry();
    const config = registry.getConfig();
    
    // Redact sensitive information (API keys, secrets)
    const sanitizedConfig = {
      providers: config.providers,
      providerConfigs: Object.fromEntries(
        Object.entries(config.providerConfigs).map(([key, value]) => [
          key,
          {
            ...value,
            // Replace actual API keys with references
            apiKey: value.apiKeyRef ? '[REDACTED]' : undefined,
            apiKeyRef: value.apiKeyRef
          }
        ])
      )
    };
    
    res.json(sanitizedConfig);
  } catch (error) {
    console.error('Error getting provider config:', error);
    res.status(500).json({ 
      error: 'Failed to get provider configuration',
      message: (error as Error).message 
    });
  }
});

/**
 * POST /api/providers/config
 * Update provider configuration
 */
providersRouter.post('/config', async (req, res) => {
  try {
    const { providers, providerConfigs } = req.body;
    
    if (!providers && !providerConfigs) {
      return res.status(400).json({ 
        error: 'Either providers or providerConfigs must be provided' 
      });
    }
    
    const registry = getRegistry();
    const currentConfig = registry.getConfig();
    
    // Merge with existing configuration
    const newConfig = {
      providers: providers || currentConfig.providers,
      providerConfigs: providerConfigs || currentConfig.providerConfigs
    };
    
    // Validate provider references
    for (const [type, typeConfig] of Object.entries(newConfig.providers)) {
      if (typeConfig.default && !newConfig.providerConfigs[typeConfig.default]) {
        return res.status(400).json({
          error: `Default provider '${typeConfig.default}' for type '${type}' not found in providerConfigs`
        });
      }
      
      // Validate per-campaign overrides
      if (typeConfig.perCampaign) {
        for (const [campaignId, providerId] of Object.entries(typeConfig.perCampaign)) {
          if (!newConfig.providerConfigs[providerId]) {
            return res.status(400).json({
              error: `Provider '${providerId}' for campaign '${campaignId}' not found in providerConfigs`
            });
          }
        }
      }
      
      // Validate per-session overrides
      if (typeConfig.perSession) {
        for (const [sessionId, providerId] of Object.entries(typeConfig.perSession)) {
          if (!newConfig.providerConfigs[providerId]) {
            return res.status(400).json({
              error: `Provider '${providerId}' for session '${sessionId}' not found in providerConfigs`
            });
          }
        }
      }
    }
    
    // Update registry configuration
    registry.updateConfig(newConfig);
    
    res.json({ 
      success: true,
      config: registry.getConfig()
    });
  } catch (error) {
    console.error('Error updating provider config:', error);
    res.status(500).json({ 
      error: 'Failed to update provider configuration',
      message: (error as Error).message 
    });
  }
});

/**
 * GET /api/providers/:type/:id/schema
 * Get configuration schema for a specific provider
 */
providersRouter.get('/:type/:id/schema', async (req, res) => {
  try {
    const { type, id } = req.params;
    
    // Validate adapter type
    if (!Object.values(AdapterType).includes(type as AdapterType)) {
      return res.status(400).json({ 
        error: 'Invalid adapter type',
        validTypes: Object.values(AdapterType)
      });
    }
    
    const registry = getRegistry();
    const provider = registry.get(type as AdapterType, id);
    
    if (!provider) {
      return res.status(404).json({ 
        error: `Provider '${id}' not found for type '${type}'` 
      });
    }

    // Get configuration schema (this would need to be implemented in the provider)
    const schema = {
      type,
      required: ['apiKey'], // Default required fields
      optional: ['baseUrl', 'timeout', 'maxRetries'],
      fields: {
        apiKey: {
          type: 'secret',
          description: 'API key for authentication',
          placeholder: 'Enter your API key'
        },
        baseUrl: {
          type: 'string',
          description: 'Base URL for the API endpoint',
          placeholder: 'https://api.example.com'
        },
        timeout: {
          type: 'number',
          description: 'Request timeout in milliseconds',
          placeholder: '30000',
          validation: { min: 1000, max: 120000 }
        },
        maxRetries: {
          type: 'number',
          description: 'Maximum number of retry attempts',
          placeholder: '3',
          validation: { min: 0, max: 10 }
        }
      }
    };
    
    res.json(schema);
  } catch (error) {
    console.error(`Error getting schema for ${req.params.type}:${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Failed to get provider schema',
      message: (error as Error).message 
    });
  }
});

/**
 * POST /api/providers/:type/switch
 * Hot-switch provider for a specific context
 */
providersRouter.post('/:type/switch', async (req, res) => {
  try {
    const { type } = req.params;
    const { providerId, campaignId, sessionId } = req.body;
    
    // Validate adapter type
    if (!Object.values(AdapterType).includes(type as AdapterType)) {
      return res.status(400).json({ 
        error: 'Invalid adapter type',
        validTypes: Object.values(AdapterType)
      });
    }
    
    if (!providerId) {
      return res.status(400).json({ error: 'providerId is required' });
    }
    
    const registry = getRegistry();
    const context = { campaignId, sessionId };
    
    await registry.hotSwitch(type as AdapterType, providerId, context);
    
    res.json({ 
      success: true,
      type,
      providerId,
      context
    });
  } catch (error) {
    console.error(`Error hot-switching ${req.params.type} provider:`, error);
    res.status(500).json({ 
      error: `Failed to hot-switch ${req.params.type} provider`,
      message: (error as Error).message 
    });
  }
});

/**
 * POST /api/providers/:type/:id/test
 * Test connection to a specific provider
 */
providersRouter.post('/:type/:id/test', async (req, res) => {
  try {
    const { type, id } = req.params;
    const { campaignId, sessionId } = req.body;
    
    // Validate adapter type
    if (!Object.values(AdapterType).includes(type as AdapterType)) {
      return res.status(400).json({ 
        error: 'Invalid adapter type',
        validTypes: Object.values(AdapterType)
      });
    }
    
    const registry = getRegistry();
    const context = { campaignId, sessionId };
    
    // Try to get the adapter instance (this will test configuration and connectivity)
    const adapter = await registry.get(type as AdapterType, context);
    
    // For LLM adapters, we can test with a simple capability check
    if (type === 'llm' && 'getCapabilities' in adapter) {
      const capabilities = await (adapter as any).getCapabilities();
      res.json({ 
        success: true,
        type,
        providerId: id,
        capabilities,
        message: 'Connection successful'
      });
    } else {
      // For other adapter types, just confirm we can instantiate
      res.json({ 
        success: true,
        type,
        providerId: id,
        message: 'Provider configuration valid'
      });
    }
  } catch (error) {
    console.error(`Error testing ${req.params.type}:${req.params.id}:`, error);
    res.status(400).json({ 
      success: false,
      error: `Failed to test ${req.params.type} provider ${req.params.id}`,
      message: (error as Error).message 
    });
  }
});

/**
 * GET /api/providers/secrets
 * List available secret references (without revealing values)
 */
providersRouter.get('/secrets', async (_req, res) => {
  try {
    // This would integrate with the secrets manager
    // For now, return a placeholder response
    res.json({
      secrets: [
        'openai-api-key',
        'anthropic-api-key',
        'perplexity-api-key',
        'ollama-host'
      ]
    });
  } catch (error) {
    console.error('Error listing secrets:', error);
    res.status(500).json({ 
      error: 'Failed to list secrets',
      message: (error as Error).message 
    });
  }
});

export default providersRouter;
