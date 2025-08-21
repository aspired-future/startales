/**
 * Visual Systems API Routes
 * 
 * Provides REST API endpoints for AI-generated graphics and videos
 * with visual consistency management and progressive enhancement.
 */

import express from 'express';
import { VisualSystemsEngine } from './VisualSystemsEngine.js';
import {
  VisualAssetType,
  VisualCategory,
  GenerationPrompt,
  GenerationOptions,
  RequestPriority,
  QualityLevel,
  ConsistencyProfile,
  StyleGuide
} from './types.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = express.Router();

// Enhanced AI Knobs for Visual Systems
const visualSystemsKnobsData = {
  // Visual Quality & Fidelity
  visual_quality_standard: 0.8,           // Overall visual quality and fidelity standard
  detail_level_emphasis: 0.7,             // Detail level and visual complexity emphasis
  artistic_style_consistency: 0.9,        // Artistic style consistency across assets
  
  // AI Generation Parameters
  ai_creativity_level: 0.7,               // AI creativity and artistic freedom level
  prompt_interpretation_flexibility: 0.6, // Prompt interpretation flexibility and variation
  generation_speed_vs_quality: 0.7,       // Generation speed vs quality optimization balance
  
  // Asset Type Specialization
  character_design_sophistication: 0.8,   // Character design sophistication and uniqueness
  environment_detail_richness: 0.8,       // Environment and landscape detail richness
  ui_element_polish_level: 0.7,           // UI element polish and professional appearance
  
  // Visual Consistency & Branding
  brand_consistency_enforcement: 0.9,     // Brand consistency and visual identity enforcement
  color_palette_adherence: 0.8,           // Color palette adherence and harmony
  visual_theme_coherence: 0.9,            // Visual theme coherence across all assets
  
  // Technical Specifications
  resolution_optimization: 0.8,           // Resolution optimization for different use cases
  file_format_efficiency: 0.8,            // File format efficiency and compression optimization
  cross_platform_compatibility: 0.8,      // Cross-platform compatibility and standards
  
  // Content Appropriateness & Safety
  content_safety_filtering: 0.9,          // Content safety filtering and appropriateness
  cultural_sensitivity_awareness: 0.8,    // Cultural sensitivity and inclusive representation
  age_appropriate_content: 0.9,           // Age-appropriate content generation and filtering
  
  // Performance & Resource Management
  generation_resource_allocation: 0.7,    // Generation resource allocation and efficiency
  batch_processing_optimization: 0.7,     // Batch processing optimization and throughput
  storage_efficiency_priority: 0.7,       // Storage efficiency and asset management priority
  
  // Innovation & Experimentation
  experimental_feature_adoption: 0.6,     // Experimental feature adoption and innovation
  artistic_trend_incorporation: 0.6,      // Artistic trend incorporation and modernization
  visual_technology_advancement: 0.7,     // Visual technology advancement and cutting-edge features
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Visual Systems
const visualSystemsKnobSystem = new EnhancedKnobSystem(visualSystemsKnobsData);

// Apply visual systems knobs to game state
function applyVisualSystemsKnobsToGameState() {
  const knobs = visualSystemsKnobSystem.knobs;
  
  // Apply visual quality settings
  const visualQuality = (knobs.visual_quality_standard + knobs.detail_level_emphasis + 
    knobs.artistic_style_consistency) / 3;
  
  // Apply AI generation settings
  const aiGeneration = (knobs.ai_creativity_level + knobs.prompt_interpretation_flexibility + 
    knobs.generation_speed_vs_quality) / 3;
  
  // Apply asset specialization settings
  const assetSpecialization = (knobs.character_design_sophistication + knobs.environment_detail_richness + 
    knobs.ui_element_polish_level) / 3;
  
  // Apply consistency and branding settings
  const consistencyBranding = (knobs.brand_consistency_enforcement + knobs.color_palette_adherence + 
    knobs.visual_theme_coherence) / 3;
  
  // Apply technical specifications settings
  const technicalSpecs = (knobs.resolution_optimization + knobs.file_format_efficiency + 
    knobs.cross_platform_compatibility) / 3;
  
  // Apply content safety settings
  const contentSafety = (knobs.content_safety_filtering + knobs.cultural_sensitivity_awareness + 
    knobs.age_appropriate_content) / 3;
  
  console.log('Applied visual systems knobs to game state:', {
    visualQuality,
    aiGeneration,
    assetSpecialization,
    consistencyBranding,
    technicalSpecs,
    contentSafety
  });
}

const visualEngine = new VisualSystemsEngine();

// ===== ASSET GENERATION =====

/**
 * POST /generate
 * Generate a new visual asset
 */
router.post('/generate', async (req, res) => {
  try {
    const {
      type,
      category,
      prompt,
      options = {}
    } = req.body;

    // Validate required fields
    if (!type || !category || !prompt) {
      return res.status(400).json({
        error: 'Missing required fields: type, category, prompt'
      });
    }

    // Validate types
    const validTypes: VisualAssetType[] = [
      'IMAGE', 'VIDEO', 'ANIMATION', 'SPRITE', 'TEXTURE', 'MODEL',
      'ICON', 'BACKGROUND', 'PORTRAIT', 'LANDSCAPE', 'UI_ELEMENT'
    ];
    
    const validCategories: VisualCategory[] = [
      'CHARACTER', 'SPECIES', 'PLANET', 'CITY', 'SPACESHIP', 'UNIT',
      'TOOL', 'WEAPON', 'BUILDING', 'ENVIRONMENT', 'EFFECT',
      'UI', 'LOGO', 'INTERFACE', 'CUTSCENE', 'EVENT'
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}`
      });
    }

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    // Create generation prompt
    const generationPrompt: GenerationPrompt = {
      text: prompt.text || prompt,
      style: prompt.style || {
        artistic: 'SCI_FI',
        technical: {
          renderingEngine: 'PHOTOREALISTIC',
          quality: 'HIGH',
          optimization: 'STANDARD',
          format: 'PNG',
          compression: {
            quality: 85,
            format: 'PNG',
            progressive: true,
            lossless: false
          }
        },
        composition: {
          layout: 'CENTERED',
          framing: 'MEDIUM',
          perspective: 'THREE_QUARTER',
          focus: 'SHARP',
          balance: 'SYMMETRICAL'
        },
        lighting: {
          type: 'NATURAL',
          direction: 'FRONT',
          intensity: 0.8,
          color: '#ffffff',
          shadows: {
            enabled: true,
            intensity: 0.6,
            softness: 0.5,
            color: '#000000'
          },
          ambient: {
            enabled: true,
            intensity: 0.3,
            color: '#87ceeb',
            source: 'SKY'
          }
        },
        color: {
          palette: 'primary',
          saturation: 0.8,
          brightness: 0.7,
          contrast: 0.8,
          temperature: 'NEUTRAL',
          harmony: 'COMPLEMENTARY'
        }
      },
      mood: prompt.mood || {
        emotional: 'HEROIC',
        atmospheric: 'CLEAR',
        energy: 'MODERATE',
        tension: 'MILD'
      },
      details: prompt.details || [],
      negativePrompts: prompt.negativePrompts || [],
      referenceImages: prompt.referenceImages || [],
      inspiration: prompt.inspiration || []
    };

    // Generate asset
    const response = await visualEngine.createAsset(
      type,
      category,
      generationPrompt,
      options
    );

    res.json({
      success: true,
      data: response,
      message: 'Asset generation completed'
    });

  } catch (error) {
    console.error('Asset generation error:', error);
    res.status(500).json({
      error: 'Asset generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /generate/character
 * Generate a character asset with specific character information
 */
router.post('/generate/character', async (req, res) => {
  try {
    const { characterInfo, prompt, options = {} } = req.body;

    if (!characterInfo || !prompt) {
      return res.status(400).json({
        error: 'Missing required fields: characterInfo, prompt'
      });
    }

    const generationPrompt: GenerationPrompt = {
      text: prompt.text || prompt,
      style: prompt.style || {
        artistic: 'REALISTIC',
        technical: {
          renderingEngine: 'PHOTOREALISTIC',
          quality: 'HIGH',
          optimization: 'STANDARD',
          format: 'PNG',
          compression: {
            quality: 90,
            format: 'PNG',
            progressive: true,
            lossless: false
          }
        },
        composition: {
          layout: 'CENTERED',
          framing: 'MEDIUM',
          perspective: 'THREE_QUARTER',
          focus: 'SHARP',
          balance: 'SYMMETRICAL'
        },
        lighting: {
          type: 'NATURAL',
          direction: 'FRONT',
          intensity: 0.8,
          color: '#ffffff',
          shadows: {
            enabled: true,
            intensity: 0.6,
            softness: 0.5,
            color: '#000000'
          },
          ambient: {
            enabled: true,
            intensity: 0.3,
            color: '#87ceeb',
            source: 'SKY'
          }
        },
        color: {
          palette: 'primary',
          saturation: 0.8,
          brightness: 0.7,
          contrast: 0.8,
          temperature: 'NEUTRAL',
          harmony: 'COMPLEMENTARY'
        }
      },
      mood: prompt.mood || {
        emotional: 'HEROIC',
        atmospheric: 'CLEAR',
        energy: 'MODERATE',
        tension: 'MILD'
      },
      details: prompt.details || [],
      negativePrompts: prompt.negativePrompts || [],
      referenceImages: prompt.referenceImages || [],
      inspiration: prompt.inspiration || []
    };

    const character = await visualEngine.createCharacterAsset(
      characterInfo,
      generationPrompt,
      options
    );

    res.json({
      success: true,
      data: character,
      message: 'Character asset generated successfully'
    });

  } catch (error) {
    console.error('Character generation error:', error);
    res.status(500).json({
      error: 'Character generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /generate/species
 * Generate a species asset with specific species information
 */
router.post('/generate/species', async (req, res) => {
  try {
    const { speciesInfo, prompt, options = {} } = req.body;

    if (!speciesInfo || !prompt) {
      return res.status(400).json({
        error: 'Missing required fields: speciesInfo, prompt'
      });
    }

    const generationPrompt: GenerationPrompt = {
      text: prompt.text || prompt,
      style: prompt.style || {
        artistic: 'REALISTIC',
        technical: {
          renderingEngine: 'PHOTOREALISTIC',
          quality: 'HIGH',
          optimization: 'STANDARD',
          format: 'PNG',
          compression: {
            quality: 90,
            format: 'PNG',
            progressive: true,
            lossless: false
          }
        },
        composition: {
          layout: 'CENTERED',
          framing: 'WIDE',
          perspective: 'THREE_QUARTER',
          focus: 'SHARP',
          balance: 'SYMMETRICAL'
        },
        lighting: {
          type: 'NATURAL',
          direction: 'FRONT',
          intensity: 0.8,
          color: '#ffffff',
          shadows: {
            enabled: true,
            intensity: 0.6,
            softness: 0.5,
            color: '#000000'
          },
          ambient: {
            enabled: true,
            intensity: 0.3,
            color: '#87ceeb',
            source: 'SKY'
          }
        },
        color: {
          palette: 'primary',
          saturation: 0.8,
          brightness: 0.7,
          contrast: 0.8,
          temperature: 'NEUTRAL',
          harmony: 'COMPLEMENTARY'
        }
      },
      mood: prompt.mood || {
        emotional: 'MYSTERIOUS',
        atmospheric: 'ETHEREAL',
        energy: 'MODERATE',
        tension: 'MILD'
      },
      details: prompt.details || [],
      negativePrompts: prompt.negativePrompts || [],
      referenceImages: prompt.referenceImages || [],
      inspiration: prompt.inspiration || []
    };

    const species = await visualEngine.createSpeciesAsset(
      speciesInfo,
      generationPrompt,
      options
    );

    res.json({
      success: true,
      data: species,
      message: 'Species asset generated successfully'
    });

  } catch (error) {
    console.error('Species generation error:', error);
    res.status(500).json({
      error: 'Species generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /generate/environment
 * Generate an environment asset with specific environment information
 */
router.post('/generate/environment', async (req, res) => {
  try {
    const { environmentInfo, prompt, options = {} } = req.body;

    if (!environmentInfo || !prompt) {
      return res.status(400).json({
        error: 'Missing required fields: environmentInfo, prompt'
      });
    }

    const generationPrompt: GenerationPrompt = {
      text: prompt.text || prompt,
      style: prompt.style || {
        artistic: 'REALISTIC',
        technical: {
          renderingEngine: 'PHOTOREALISTIC',
          quality: 'HIGH',
          optimization: 'STANDARD',
          format: 'PNG',
          compression: {
            quality: 90,
            format: 'PNG',
            progressive: true,
            lossless: false
          }
        },
        composition: {
          layout: 'RULE_OF_THIRDS',
          framing: 'WIDE',
          perspective: 'AERIAL',
          focus: 'DEEP',
          balance: 'ASYMMETRICAL'
        },
        lighting: {
          type: 'NATURAL',
          direction: 'TOP',
          intensity: 0.9,
          color: '#ffffff',
          shadows: {
            enabled: true,
            intensity: 0.7,
            softness: 0.6,
            color: '#000000'
          },
          ambient: {
            enabled: true,
            intensity: 0.4,
            color: '#87ceeb',
            source: 'SKY'
          }
        },
        color: {
          palette: 'primary',
          saturation: 0.9,
          brightness: 0.8,
          contrast: 0.7,
          temperature: 'WARM',
          harmony: 'ANALOGOUS'
        }
      },
      mood: prompt.mood || {
        emotional: 'PEACEFUL',
        atmospheric: 'BRIGHT',
        energy: 'CALM',
        tension: 'RELAXED'
      },
      details: prompt.details || [],
      negativePrompts: prompt.negativePrompts || [],
      referenceImages: prompt.referenceImages || [],
      inspiration: prompt.inspiration || []
    };

    const environment = await visualEngine.createEnvironmentAsset(
      environmentInfo,
      generationPrompt,
      options
    );

    res.json({
      success: true,
      data: environment,
      message: 'Environment asset generated successfully'
    });

  } catch (error) {
    console.error('Environment generation error:', error);
    res.status(500).json({
      error: 'Environment generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /generate/video
 * Generate a video asset with specific video information
 */
router.post('/generate/video', async (req, res) => {
  try {
    const { videoInfo, prompt, options = {} } = req.body;

    if (!videoInfo || !prompt) {
      return res.status(400).json({
        error: 'Missing required fields: videoInfo, prompt'
      });
    }

    const generationPrompt: GenerationPrompt = {
      text: prompt.text || prompt,
      style: prompt.style || {
        artistic: 'CINEMATIC',
        technical: {
          renderingEngine: 'PHOTOREALISTIC',
          quality: 'ULTRA',
          optimization: 'STANDARD',
          format: 'MP4',
          compression: {
            quality: 85,
            format: 'MP4',
            progressive: true,
            lossless: false
          }
        },
        composition: {
          layout: 'CINEMATIC',
          framing: 'WIDE',
          perspective: 'DYNAMIC',
          focus: 'SELECTIVE',
          balance: 'DYNAMIC'
        },
        lighting: {
          type: 'DRAMATIC',
          direction: 'MULTIPLE',
          intensity: 0.9,
          color: '#ffffff',
          shadows: {
            enabled: true,
            intensity: 0.8,
            softness: 0.4,
            color: '#000000'
          },
          ambient: {
            enabled: true,
            intensity: 0.2,
            color: '#1a1a2e',
            source: 'ARTIFICIAL'
          }
        },
        color: {
          palette: 'primary',
          saturation: 0.9,
          brightness: 0.7,
          contrast: 0.9,
          temperature: 'COOL',
          harmony: 'COMPLEMENTARY'
        }
      },
      mood: prompt.mood || {
        emotional: 'DRAMATIC',
        atmospheric: 'CINEMATIC',
        energy: 'HIGH',
        tension: 'MODERATE'
      },
      details: prompt.details || [],
      negativePrompts: prompt.negativePrompts || [],
      referenceImages: prompt.referenceImages || [],
      inspiration: prompt.inspiration || []
    };

    const video = await visualEngine.createVideoAsset(
      videoInfo,
      generationPrompt,
      options
    );

    res.json({
      success: true,
      data: video,
      message: 'Video asset generated successfully'
    });

  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({
      error: 'Video generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== ASSET MANAGEMENT =====

/**
 * GET /assets
 * Get all visual assets with optional filtering
 */
router.get('/assets', (req, res) => {
  try {
    const { type, category, search, limit = 50, offset = 0 } = req.query;

    let assets = visualEngine.getAllAssets();

    // Apply filters
    if (type) {
      assets = assets.filter(asset => asset.type === type);
    }

    if (category) {
      assets = assets.filter(asset => asset.category === category);
    }

    if (search) {
      assets = visualEngine.searchAssets(search as string);
    }

    // Apply pagination
    const startIndex = parseInt(offset as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedAssets = assets.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        assets: paginatedAssets,
        total: assets.length,
        limit: parseInt(limit as string),
        offset: startIndex,
        hasMore: endIndex < assets.length
      },
      message: 'Assets retrieved successfully'
    });

  } catch (error) {
    console.error('Assets retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve assets',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /assets/:id
 * Get a specific visual asset by ID
 */
router.get('/assets/:id', (req, res) => {
  try {
    const { id } = req.params;
    const asset = visualEngine.getAsset(id);

    if (!asset) {
      return res.status(404).json({
        error: 'Asset not found'
      });
    }

    res.json({
      success: true,
      data: asset,
      message: 'Asset retrieved successfully'
    });

  } catch (error) {
    console.error('Asset retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve asset',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /assets/by-type/:type
 * Get assets by type
 */
router.get('/assets/by-type/:type', (req, res) => {
  try {
    const { type } = req.params;
    const assets = visualEngine.getAssetsByType(type as VisualAssetType);

    res.json({
      success: true,
      data: assets,
      message: `Assets of type ${type} retrieved successfully`
    });

  } catch (error) {
    console.error('Assets by type retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve assets by type',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /assets/by-category/:category
 * Get assets by category
 */
router.get('/assets/by-category/:category', (req, res) => {
  try {
    const { category } = req.params;
    const assets = visualEngine.getAssetsByCategory(category as VisualCategory);

    res.json({
      success: true,
      data: assets,
      message: `Assets of category ${category} retrieved successfully`
    });

  } catch (error) {
    console.error('Assets by category retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve assets by category',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== CONSISTENCY PROFILES =====

/**
 * GET /consistency-profiles
 * Get all consistency profiles
 */
router.get('/consistency-profiles', (req, res) => {
  try {
    const profiles = visualEngine.getAllConsistencyProfiles();

    res.json({
      success: true,
      data: profiles,
      message: 'Consistency profiles retrieved successfully'
    });

  } catch (error) {
    console.error('Consistency profiles retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve consistency profiles',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /consistency-profiles/:id
 * Get a specific consistency profile by ID
 */
router.get('/consistency-profiles/:id', (req, res) => {
  try {
    const { id } = req.params;
    const profile = visualEngine.getConsistencyProfile(id);

    if (!profile) {
      return res.status(404).json({
        error: 'Consistency profile not found'
      });
    }

    res.json({
      success: true,
      data: profile,
      message: 'Consistency profile retrieved successfully'
    });

  } catch (error) {
    console.error('Consistency profile retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve consistency profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /consistency-profiles
 * Create a new consistency profile
 */
router.post('/consistency-profiles', (req, res) => {
  try {
    const profileData = req.body;

    if (!profileData.name || !profileData.type) {
      return res.status(400).json({
        error: 'Missing required fields: name, type'
      });
    }

    const profile = visualEngine.createConsistencyProfile(profileData);

    res.status(201).json({
      success: true,
      data: profile,
      message: 'Consistency profile created successfully'
    });

  } catch (error) {
    console.error('Consistency profile creation error:', error);
    res.status(500).json({
      error: 'Failed to create consistency profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /consistency-profiles/:id
 * Update a consistency profile
 */
router.put('/consistency-profiles/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProfile = visualEngine.updateConsistencyProfile(id, updates);

    if (!updatedProfile) {
      return res.status(404).json({
        error: 'Consistency profile not found'
      });
    }

    res.json({
      success: true,
      data: updatedProfile,
      message: 'Consistency profile updated successfully'
    });

  } catch (error) {
    console.error('Consistency profile update error:', error);
    res.status(500).json({
      error: 'Failed to update consistency profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /consistency-profiles/:id
 * Delete a consistency profile
 */
router.delete('/consistency-profiles/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = visualEngine.deleteConsistencyProfile(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Consistency profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Consistency profile deleted successfully'
    });

  } catch (error) {
    console.error('Consistency profile deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete consistency profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== STYLE GUIDES =====

/**
 * GET /style-guides
 * Get all style guides
 */
router.get('/style-guides', (req, res) => {
  try {
    const styleGuides = visualEngine.getAllStyleGuides();

    res.json({
      success: true,
      data: styleGuides,
      message: 'Style guides retrieved successfully'
    });

  } catch (error) {
    console.error('Style guides retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve style guides',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /style-guides/:id
 * Get a specific style guide by ID
 */
router.get('/style-guides/:id', (req, res) => {
  try {
    const { id } = req.params;
    const styleGuide = visualEngine.getStyleGuide(id);

    if (!styleGuide) {
      return res.status(404).json({
        error: 'Style guide not found'
      });
    }

    res.json({
      success: true,
      data: styleGuide,
      message: 'Style guide retrieved successfully'
    });

  } catch (error) {
    console.error('Style guide retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve style guide',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /style-guides
 * Create a new style guide
 */
router.post('/style-guides', (req, res) => {
  try {
    const styleGuideData = req.body;

    if (!styleGuideData.name || !styleGuideData.description) {
      return res.status(400).json({
        error: 'Missing required fields: name, description'
      });
    }

    const styleGuide = visualEngine.createStyleGuide(styleGuideData);

    res.status(201).json({
      success: true,
      data: styleGuide,
      message: 'Style guide created successfully'
    });

  } catch (error) {
    console.error('Style guide creation error:', error);
    res.status(500).json({
      error: 'Failed to create style guide',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== GENERATION QUEUE & HISTORY =====

/**
 * GET /generation/queue
 * Get current generation queue
 */
router.get('/generation/queue', (req, res) => {
  try {
    const queue = visualEngine.getGenerationQueue();

    res.json({
      success: true,
      data: queue,
      message: 'Generation queue retrieved successfully'
    });

  } catch (error) {
    console.error('Generation queue retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve generation queue',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /generation/history
 * Get generation history
 */
router.get('/generation/history', (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const history = visualEngine.getGenerationHistory();

    // Apply pagination
    const startIndex = parseInt(offset as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedHistory = history.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        history: paginatedHistory,
        total: history.length,
        limit: parseInt(limit as string),
        offset: startIndex,
        hasMore: endIndex < history.length
      },
      message: 'Generation history retrieved successfully'
    });

  } catch (error) {
    console.error('Generation history retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve generation history',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /generation/status/:requestId
 * Get generation status for a specific request
 */
router.get('/generation/status/:requestId', (req, res) => {
  try {
    const { requestId } = req.params;
    const status = visualEngine.getGenerationStatus(requestId);

    if (!status) {
      return res.status(404).json({
        error: 'Generation request not found'
      });
    }

    res.json({
      success: true,
      data: { status },
      message: 'Generation status retrieved successfully'
    });

  } catch (error) {
    console.error('Generation status retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve generation status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== ANALYTICS & METRICS =====

/**
 * GET /metrics/system
 * Get system-wide metrics
 */
router.get('/metrics/system', (req, res) => {
  try {
    const metrics = visualEngine.getSystemMetrics();

    res.json({
      success: true,
      data: metrics,
      message: 'System metrics retrieved successfully'
    });

  } catch (error) {
    console.error('System metrics retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve system metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /metrics/assets
 * Get asset analytics
 */
router.get('/metrics/assets', (req, res) => {
  try {
    const analytics = visualEngine.getAssetAnalytics();

    res.json({
      success: true,
      data: analytics,
      message: 'Asset analytics retrieved successfully'
    });

  } catch (error) {
    console.error('Asset analytics retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve asset analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== HEALTH CHECK =====

/**
 * GET /health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  try {
    const metrics = visualEngine.getSystemMetrics();
    
    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        metrics: {
          assets: metrics.assets,
          profiles: metrics.profiles,
          styleGuides: metrics.styleGuides,
          queueSize: metrics.queueSize
        }
      },
      message: 'Visual Systems Engine is healthy'
    });

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'visual-systems', visualSystemsKnobSystem, applyVisualSystemsKnobsToGameState);

export default router;
