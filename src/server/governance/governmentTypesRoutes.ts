import express from 'express';
import { Pool } from 'pg';
import { GovernmentTypesService } from './GovernmentTypesService';
import { 
  DEFAULT_GOVERNMENT_TYPES_KNOBS, 
  GOVERNMENT_TYPE_KNOB_PRESETS,
  GOVERNMENT_TYPES_AI_PROMPTS,
  GOVERNMENT_TYPES_KNOB_DESCRIPTIONS,
  GovernmentTypesKnobs
} from './governmentTypesKnobs';

export function createGovernmentTypesRoutes(pool: Pool): express.Router {
  const router = express.Router();
  const governmentTypesService = new GovernmentTypesService(pool);

  // Get all available government types
  router.get('/types', async (req, res) => {
    try {
      const types = await governmentTypesService.getGovernmentTypes();
      res.json({
        success: true,
        data: types,
        message: 'Government types retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching government types:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch government types',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get specific government type
  router.get('/types/:typeId', async (req, res) => {
    try {
      const { typeId } = req.params;
      const type = await governmentTypesService.getGovernmentType(typeId);
      
      if (!type) {
        return res.status(404).json({
          success: false,
          error: 'Government type not found'
        });
      }

      res.json({
        success: true,
        data: type,
        message: 'Government type retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching government type:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch government type',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get civilization's current government
  router.get('/civilization/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const government = await governmentTypesService.getCivilizationGovernment(
        parseInt(campaignId),
        civilizationId
      );

      if (!government) {
        return res.status(404).json({
          success: false,
          error: 'No government found for this civilization'
        });
      }

      res.json({
        success: true,
        data: government,
        message: 'Civilization government retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching civilization government:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch civilization government',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Change government type
  router.post('/civilization/:campaignId/:civilizationId/change', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const {
        newGovernmentTypeId,
        transitionMethod,
        transitionReason,
        newLeader
      } = req.body;

      if (!newGovernmentTypeId || !transitionMethod || !transitionReason || !newLeader) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: newGovernmentTypeId, transitionMethod, transitionReason, newLeader'
        });
      }

      const validTransitionMethods = ['peaceful', 'revolution', 'coup', 'invasion', 'reform'];
      if (!validTransitionMethods.includes(transitionMethod)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid transition method. Must be one of: ' + validTransitionMethods.join(', ')
        });
      }

      const newGovernment = await governmentTypesService.changeGovernmentType(
        parseInt(campaignId),
        civilizationId,
        newGovernmentTypeId,
        transitionMethod,
        transitionReason,
        newLeader
      );

      res.json({
        success: true,
        data: newGovernment,
        message: 'Government type changed successfully'
      });
    } catch (error) {
      console.error('Error changing government type:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to change government type',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Calculate government effectiveness
  router.get('/civilization/:campaignId/:civilizationId/effectiveness', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { situation = 'normal' } = req.query;

      const validSituations = ['crisis', 'normal', 'prosperity'];
      if (!validSituations.includes(situation as string)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid situation. Must be one of: ' + validSituations.join(', ')
        });
      }

      const effectiveness = await governmentTypesService.calculateGovernmentEffectiveness(
        parseInt(campaignId),
        civilizationId,
        situation as 'crisis' | 'normal' | 'prosperity'
      );

      res.json({
        success: true,
        data: effectiveness,
        message: 'Government effectiveness calculated successfully'
      });
    } catch (error) {
      console.error('Error calculating government effectiveness:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate government effectiveness',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Check transition possibility
  router.get('/civilization/:campaignId/:civilizationId/can-transition/:targetTypeId', async (req, res) => {
    try {
      const { campaignId, civilizationId, targetTypeId } = req.params;

      const transitionCheck = await governmentTypesService.canTransitionTo(
        parseInt(campaignId),
        civilizationId,
        targetTypeId
      );

      res.json({
        success: true,
        data: transitionCheck,
        message: 'Transition possibility checked successfully'
      });
    } catch (error) {
      console.error('Error checking transition possibility:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check transition possibility',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Update government metrics
  router.put('/civilization/:campaignId/:civilizationId/metrics', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const metrics = req.body;

      // Validate metrics
      const validMetrics = ['legitimacy', 'stability', 'decisionEfficiency', 'publicSatisfaction', 'economicPerformance'];
      const invalidMetrics = Object.keys(metrics).filter(key => !validMetrics.includes(key));
      
      if (invalidMetrics.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid metrics: ' + invalidMetrics.join(', ') + '. Valid metrics: ' + validMetrics.join(', ')
        });
      }

      // Validate metric values (0-100)
      for (const [key, value] of Object.entries(metrics)) {
        if (typeof value !== 'number' || value < 0 || value > 100) {
          return res.status(400).json({
            success: false,
            error: `Invalid value for ${key}: must be a number between 0 and 100`
          });
        }
      }

      await governmentTypesService.updateGovernmentMetrics(
        parseInt(campaignId),
        civilizationId,
        metrics
      );

      res.json({
        success: true,
        message: 'Government metrics updated successfully'
      });
    } catch (error) {
      console.error('Error updating government metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update government metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Add government challenge
  router.post('/civilization/:campaignId/:civilizationId/challenges', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { type, severity, description, timeframe } = req.body;

      if (!type || !severity || !description || !timeframe) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: type, severity, description, timeframe'
        });
      }

      if (typeof severity !== 'number' || severity < 1 || severity > 10) {
        return res.status(400).json({
          success: false,
          error: 'Severity must be a number between 1 and 10'
        });
      }

      await governmentTypesService.addGovernmentChallenge(
        parseInt(campaignId),
        civilizationId,
        { type, severity, description, timeframe }
      );

      res.json({
        success: true,
        message: 'Government challenge added successfully'
      });
    } catch (error) {
      console.error('Error adding government challenge:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add government challenge',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get government comparison
  router.get('/compare', async (req, res) => {
    try {
      const { types } = req.query;
      
      if (!types || typeof types !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Missing or invalid types parameter. Provide comma-separated government type IDs.'
        });
      }

      const typeIds = types.split(',').map(id => id.trim());
      const governmentTypes = await Promise.all(
        typeIds.map(id => governmentTypesService.getGovernmentType(id))
      );

      const validTypes = governmentTypes.filter(type => type !== null);
      
      if (validTypes.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No valid government types found'
        });
      }

      // Create comparison matrix
      const comparison = {
        types: validTypes,
        comparison: {
          decisionSpeed: validTypes.map(type => ({ name: type!.name, value: type!.decisionSpeed })),
          economicControl: validTypes.map(type => ({ name: type!.name, value: type!.economicControl })),
          civilLiberties: validTypes.map(type => ({ name: type!.name, value: type!.civilLiberties })),
          stability: validTypes.map(type => ({ name: type!.name, value: type!.stabilityFactors.institutionalStrength })),
          popularSupport: validTypes.map(type => ({ name: type!.name, value: type!.stabilityFactors.popularSupport }))
        }
      };

      res.json({
        success: true,
        data: comparison,
        message: 'Government types comparison generated successfully'
      });
    } catch (error) {
      console.error('Error generating government comparison:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate government comparison',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get knob settings for government types
  router.get('/knobs', async (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          defaultKnobs: DEFAULT_GOVERNMENT_TYPES_KNOBS,
          presets: GOVERNMENT_TYPE_KNOB_PRESETS,
          descriptions: GOVERNMENT_TYPES_KNOB_DESCRIPTIONS
        },
        message: 'Government types knobs retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching government types knobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch government types knobs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get AI prompts for government types
  router.get('/ai-prompts', async (req, res) => {
    try {
      res.json({
        success: true,
        data: GOVERNMENT_TYPES_AI_PROMPTS,
        message: 'Government types AI prompts retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching AI prompts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch AI prompts',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Apply knob preset to government type
  router.post('/civilization/:campaignId/:civilizationId/apply-preset', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { presetName } = req.body;

      if (!presetName || !GOVERNMENT_TYPE_KNOB_PRESETS[presetName]) {
        return res.status(400).json({
          success: false,
          error: 'Invalid preset name. Available presets: ' + Object.keys(GOVERNMENT_TYPE_KNOB_PRESETS).join(', ')
        });
      }

      const preset = GOVERNMENT_TYPE_KNOB_PRESETS[presetName];
      const knobSettings = { ...DEFAULT_GOVERNMENT_TYPES_KNOBS, ...preset };

      // In a real implementation, you would save these knob settings to the database
      // For now, we'll just return the applied settings
      res.json({
        success: true,
        data: {
          appliedPreset: presetName,
          knobSettings
        },
        message: 'Knob preset applied successfully'
      });
    } catch (error) {
      console.error('Error applying knob preset:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to apply knob preset',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Generate AI analysis using prompts
  router.post('/civilization/:campaignId/:civilizationId/ai-analysis', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { promptType, parameters } = req.body;

      if (!promptType || !GOVERNMENT_TYPES_AI_PROMPTS[promptType as keyof typeof GOVERNMENT_TYPES_AI_PROMPTS]) {
        return res.status(400).json({
          success: false,
          error: 'Invalid prompt type. Available types: ' + Object.keys(GOVERNMENT_TYPES_AI_PROMPTS).join(', ')
        });
      }

      const prompt = GOVERNMENT_TYPES_AI_PROMPTS[promptType as keyof typeof GOVERNMENT_TYPES_AI_PROMPTS];
      
      // Replace parameters in prompt template
      let processedPrompt = prompt;
      if (parameters) {
        Object.entries(parameters).forEach(([key, value]) => {
          processedPrompt = processedPrompt.replace(new RegExp(`{${key}}`, 'g'), String(value));
        });
      }

      // In a real implementation, you would send this to an AI service
      // For now, we'll return the processed prompt
      res.json({
        success: true,
        data: {
          promptType,
          processedPrompt,
          parameters,
          // Mock AI response
          aiResponse: `AI analysis for ${promptType} would be generated here based on the current government situation.`
        },
        message: 'AI analysis generated successfully'
      });
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate AI analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
}
