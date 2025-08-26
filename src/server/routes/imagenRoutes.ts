import express from 'express';
import { unifiedImageService } from '../visual/UnifiedImageGenerationService';
import { ImageGenerationRequest } from '../visual/interfaces/IImageGenerationProvider';

const router = express.Router();

/**
 * POST /api/imagen/generate
 * Generate a single image using Google Imagen
 */
router.post('/generate', async (req, res) => {
  try {
    const request: ImageGenerationRequest = {
      prompt: req.body.prompt,
      aspectRatio: req.body.aspectRatio || '1:1',
      style: req.body.style || 'digital-art',
      quality: req.body.quality || 'hd',
      safetyLevel: req.body.safetyLevel || 'medium'
    };

    if (!request.prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    console.log('🎨 Unified Image API: Generating image for prompt:', request.prompt);

    // Get provider recommendation
    const recommendedProvider = unifiedImageService.getProviderRecommendation(request);
    const preferredProvider = req.body.provider || recommendedProvider;
    
    const result = await unifiedImageService.generateImage(request, preferredProvider);

    res.json(result);
  } catch (error) {
    console.error('❌ Error in imagen/generate:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/imagen/generate-variations
 * Generate multiple variations of an image
 */
router.post('/generate-variations', async (req, res) => {
  try {
    const request: ImageGenerationRequest = {
      prompt: req.body.prompt,
      aspectRatio: req.body.aspectRatio || '1:1',
      style: req.body.style || 'digital-art',
      quality: req.body.quality || 'hd'
    };

    const count = Math.min(req.body.count || 3, 5); // Limit to 5 variations

    if (!request.prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    console.log(`🎨 Unified Image API: Generating ${count} variations for:`, request.prompt);

    const preferredProvider = req.body.provider;
    const results = await unifiedImageService.generateVariations(request, count, preferredProvider);

    res.json({
      success: true,
      variations: results,
      count: results.length
    });
  } catch (error) {
    console.error('❌ Error in imagen/generate-variations:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/imagen/generate-entity
 * Generate image for a specific game entity
 */
router.post('/generate-entity', async (req, res) => {
  try {
    const { entityType, entityName, description, style } = req.body;

    if (!entityType || !entityName || !description) {
      return res.status(400).json({
        success: false,
        error: 'entityType, entityName, and description are required'
      });
    }

    const validEntityTypes = ['planet', 'character', 'species', 'civilization', 'city', 'logo'];
    if (!validEntityTypes.includes(entityType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid entityType. Must be one of: ${validEntityTypes.join(', ')}`
      });
    }

    console.log(`🎨 Unified Image API: Generating ${entityType} image for ${entityName}`);

    const preferredProvider = req.body.provider;
    const result = await unifiedImageService.generateGameEntityImage(
      entityType,
      entityName,
      description,
      style || 'digital-art',
      preferredProvider
    );

    res.json(result);
  } catch (error) {
    console.error('❌ Error in imagen/generate-entity:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/imagen/status
 * Get the status of the Imagen service
 */
router.get('/status', async (req, res) => {
  try {
    const allStatuses = await unifiedImageService.getAllProviderStatuses();
    const registryStatus = unifiedImageService.getRegistryStatus();
    
    res.json({
      success: true,
      service: 'Unified Image Generation',
      registry: registryStatus,
      providers: allStatuses,
      endpoints: [
        'POST /api/imagen/generate',
        'POST /api/imagen/generate-variations',
        'POST /api/imagen/generate-entity',
        'GET /api/imagen/status',
        'GET /api/imagen/test'
      ]
    });
  } catch (error) {
    console.error('❌ Error getting unified image service status:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/imagen/test
 * Test the Imagen service with a simple generation
 */
router.get('/test', async (req, res) => {
  try {
    console.log('🧪 Testing unified image generation service...');

    const providerName = req.query.provider as string;
    
    if (providerName) {
      // Test specific provider
      const result = await unifiedImageService.testProvider(providerName);
      const status = await unifiedImageService.getAllProviderStatuses();
      
      res.json({
        success: true,
        message: `${providerName} test completed`,
        testResult: result,
        providerStatus: status[providerName]
      });
    } else {
      // Test all providers
      const results = await unifiedImageService.testAllProviders();
      const registryStatus = unifiedImageService.getRegistryStatus();
      
      res.json({
        success: true,
        message: 'All providers test completed',
        testResults: results,
        registryStatus
      });
    }
  } catch (error) {
    console.error('❌ Error in unified image service test:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    });
  }
});

export default router;
