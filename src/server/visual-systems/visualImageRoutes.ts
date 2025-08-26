/**
 * Visual Image Routes - API endpoints for serving generated entity images
 */

import { Router } from 'express';
import { getImageStorageService } from './ImageStorageService.js';
import { getPool } from '../storage/db.js';

const router = Router();

/**
 * Get image by entity ID and type
 * GET /api/visual-systems/images/:entityType/:entityId
 */
router.get('/images/:entityType/:entityId', async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    
    // Validate entity type
    const validTypes = ['planet', 'city', 'character', 'species', 'logo', 'civilization'];
    if (!validTypes.includes(entityType)) {
      return res.status(400).json({
        error: 'Invalid entity type',
        validTypes
      });
    }

    const storageService = getImageStorageService(getPool());
    const image = await storageService.getImageByEntity(entityId, entityType);

    if (!image) {
      return res.status(404).json({
        error: 'Image not found',
        entityId,
        entityType
      });
    }

    res.json({
      imageUrl: image.imageUrl,
      thumbnailUrl: image.thumbnailUrl,
      metadata: image.metadata
    });

  } catch (error) {
    console.error('Error getting entity image:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get image by image ID
 * GET /api/visual-systems/images/id/:imageId
 */
router.get('/images/id/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    
    const storageService = getImageStorageService(getPool());
    const image = await storageService.getImageById(imageId);

    if (!image) {
      return res.status(404).json({
        error: 'Image not found',
        imageId
      });
    }

    res.json({
      id: image.id,
      entityId: image.entityId,
      entityType: image.entityType,
      imageUrl: image.imageUrl,
      thumbnailUrl: image.thumbnailUrl,
      metadata: image.metadata,
      status: image.status,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt
    });

  } catch (error) {
    console.error('Error getting image by ID:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Search images with filters
 * GET /api/visual-systems/images/search
 */
router.get('/images/search', async (req, res) => {
  try {
    const {
      entityType,
      entityId,
      tags,
      style,
      status = 'completed',
      limit = '20',
      offset = '0',
      startDate,
      endDate
    } = req.query;

    const filters: any = {
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    };

    if (entityType) filters.entityType = entityType as string;
    if (entityId) filters.entityId = entityId as string;
    if (style) filters.style = style as string;
    if (status) filters.status = status as string;
    
    if (tags) {
      filters.tags = (tags as string).split(',').map(tag => tag.trim());
    }

    if (startDate && endDate) {
      filters.dateRange = {
        start: new Date(startDate as string),
        end: new Date(endDate as string)
      };
    }

    const storageService = getImageStorageService(getPool());
    const result = await storageService.searchImages(filters);

    res.json({
      images: result.images.map(image => ({
        id: image.id,
        entityId: image.entityId,
        entityType: image.entityType,
        imageUrl: image.imageUrl,
        thumbnailUrl: image.thumbnailUrl,
        metadata: image.metadata,
        status: image.status,
        createdAt: image.createdAt
      })),
      total: result.total,
      limit: filters.limit,
      offset: filters.offset
    });

  } catch (error) {
    console.error('Error searching images:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get images by entity type
 * GET /api/visual-systems/images/type/:entityType
 */
router.get('/images/type/:entityType', async (req, res) => {
  try {
    const { entityType } = req.params;
    const { limit = '20', offset = '0' } = req.query;

    const validTypes = ['planet', 'city', 'character', 'species', 'logo', 'civilization'];
    if (!validTypes.includes(entityType)) {
      return res.status(400).json({
        error: 'Invalid entity type',
        validTypes
      });
    }

    const storageService = getImageStorageService(getPool());
    const result = await storageService.getImagesByEntityType(
      entityType,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.json({
      images: result.images.map(image => ({
        id: image.id,
        entityId: image.entityId,
        entityType: image.entityType,
        imageUrl: image.imageUrl,
        thumbnailUrl: image.thumbnailUrl,
        metadata: image.metadata,
        createdAt: image.createdAt
      })),
      total: result.total,
      entityType
    });

  } catch (error) {
    console.error('Error getting images by type:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get recent images
 * GET /api/visual-systems/images/recent
 */
router.get('/images/recent', async (req, res) => {
  try {
    const { limit = '10' } = req.query;

    const storageService = getImageStorageService(getPool());
    const images = await storageService.getRecentImages(parseInt(limit as string));

    res.json({
      images: images.map(image => ({
        id: image.id,
        entityId: image.entityId,
        entityType: image.entityType,
        imageUrl: image.imageUrl,
        thumbnailUrl: image.thumbnailUrl,
        metadata: image.metadata,
        createdAt: image.createdAt
      }))
    });

  } catch (error) {
    console.error('Error getting recent images:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get images by tags
 * GET /api/visual-systems/images/tags/:tags
 */
router.get('/images/tags/:tags', async (req, res) => {
  try {
    const { tags } = req.params;
    const { limit = '20' } = req.query;

    const tagArray = tags.split(',').map(tag => tag.trim());
    
    const storageService = getImageStorageService(getPool());
    const images = await storageService.getImagesByTags(tagArray, parseInt(limit as string));

    res.json({
      images: images.map(image => ({
        id: image.id,
        entityId: image.entityId,
        entityType: image.entityType,
        imageUrl: image.imageUrl,
        thumbnailUrl: image.thumbnailUrl,
        metadata: image.metadata,
        createdAt: image.createdAt
      })),
      tags: tagArray
    });

  } catch (error) {
    console.error('Error getting images by tags:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get storage statistics
 * GET /api/visual-systems/images/stats
 */
router.get('/images/stats', async (req, res) => {
  try {
    const storageService = getImageStorageService(getPool());
    const stats = await storageService.getStorageStats();

    res.json(stats);

  } catch (error) {
    console.error('Error getting storage stats:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Update image status
 * PUT /api/visual-systems/images/:imageId/status
 */
router.put('/images/:imageId/status', async (req, res) => {
  try {
    const { imageId } = req.params;
    const { status } = req.body;

    const validStatuses = ['generating', 'completed', 'failed', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        validStatuses
      });
    }

    const storageService = getImageStorageService(getPool());
    await storageService.updateImageStatus(imageId, status);

    res.json({
      success: true,
      imageId,
      status
    });

  } catch (error) {
    console.error('Error updating image status:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Delete image
 * DELETE /api/visual-systems/images/:imageId
 */
router.delete('/images/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;

    const storageService = getImageStorageService(getPool());
    await storageService.deleteImage(imageId);

    res.json({
      success: true,
      imageId,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Trigger image generation for entity
 * POST /api/visual-systems/images/generate
 */
router.post('/images/generate', async (req, res) => {
  try {
    const { entityType, entityId, entityData, priority = 'medium' } = req.body;

    const validTypes = ['planet', 'city', 'character', 'species', 'logo', 'civilization'];
    if (!validTypes.includes(entityType)) {
      return res.status(400).json({
        error: 'Invalid entity type',
        validTypes
      });
    }

    if (!entityId || !entityData) {
      return res.status(400).json({
        error: 'Missing required fields: entityId, entityData'
      });
    }

    // Import and use the appropriate visual integration
    let result;
    switch (entityType) {
      case 'planet':
        const { getPlanetVisualIntegration } = await import('./PlanetVisualIntegration.js');
        const planetVisual = getPlanetVisualIntegration();
        result = await planetVisual.onPlanetCreated(entityData);
        break;
        
      case 'city':
        const { getCityVisualIntegration } = await import('./CityVisualIntegration.js');
        const cityVisual = getCityVisualIntegration();
        result = await cityVisual.onCityCreated(entityData);
        break;
        
      case 'character':
        const { getCharacterVisualIntegration } = await import('./CharacterVisualIntegration.js');
        const characterVisual = getCharacterVisualIntegration();
        result = await characterVisual.onCharacterCreated(entityData);
        break;
        
      case 'species':
        const { getSpeciesVisualIntegration } = await import('./SpeciesVisualIntegration.js');
        const speciesVisual = getSpeciesVisualIntegration();
        result = await speciesVisual.onSpeciesCreated(entityData);
        break;
        
      case 'logo':
      case 'civilization':
        const { getLogoVisualIntegration } = await import('./LogoVisualIntegration.js');
        const logoVisual = getLogoVisualIntegration();
        result = await logoVisual.generateEntityLogo(entityData);
        break;
        
      default:
        return res.status(400).json({
          error: 'Unsupported entity type for generation'
        });
    }

    if (result) {
      res.json({
        success: true,
        entityId,
        entityType,
        imageUrl: result.imageUrl,
        metadata: result.metadata
      });
    } else {
      res.status(500).json({
        error: 'Image generation failed',
        entityId,
        entityType
      });
    }

  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
