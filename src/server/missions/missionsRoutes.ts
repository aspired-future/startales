/**
 * Missions API Routes
 * RESTful API for mission management with Game Master AI integration
 */

import express from 'express';
import { Pool } from 'pg';
import MissionsService from './MissionsService.js';
import { MISSIONS_KNOBS, MISSIONS_AI_PROMPTS } from './missionsKnobs.js';

export function createMissionsRoutes(pool: Pool): express.Router {
  const router = express.Router();
  const missionsService = new MissionsService(pool);

  // ===== ENHANCED KNOB SYSTEM (MUST BE FIRST TO AVOID CONFLICTS) =====

  // Get missions knob settings
  router.get('/knobs', async (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          defaultKnobs: MISSIONS_KNOBS,
          descriptions: getMissionsKnobDescriptions(),
          presets: getMissionsKnobPresets()
        },
        message: 'Missions knobs retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting missions knobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve missions knobs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get missions AI prompts
  router.get('/ai-prompts', async (req, res) => {
    try {
      res.json({
        success: true,
        data: MISSIONS_AI_PROMPTS,
        message: 'Missions AI prompts retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting missions AI prompts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve missions AI prompts',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get mission templates
  router.get('/templates/list', async (req, res) => {
    try {
      const { type } = req.query;
      const templates = await missionsService.getMissionTemplates(type as any);

      res.json({
        success: true,
        data: templates,
        message: `Retrieved ${templates.length} mission templates`
      });
    } catch (error) {
      console.error('Error getting mission templates:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve mission templates',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ===== CORE MISSIONS ENDPOINTS =====

  // Get all missions for a civilization
  router.get('/civilization/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { status, type, priority } = req.query;

      let missions = await missionsService.getMissions(campaignId, civilizationId, status as any);

      // Apply additional filters
      if (type) {
        missions = missions.filter(m => m.type === type);
      }
      if (priority) {
        missions = missions.filter(m => m.priority === priority);
      }

      res.json({
        success: true,
        data: missions,
        message: `Retrieved ${missions.length} missions for civilization ${civilizationId}`
      });
    } catch (error) {
      console.error('Error getting missions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve missions',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get specific mission by ID
  router.get('/:missionId', async (req, res) => {
    try {
      const { missionId } = req.params;
      const mission = await missionsService.getMission(missionId);

      if (!mission) {
        return res.status(404).json({
          success: false,
          error: 'Mission not found'
        });
      }

      res.json({
        success: true,
        data: mission,
        message: 'Mission retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting mission:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve mission',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Create new mission
  router.post('/civilization/:campaignId/:civilizationId', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const missionData = {
        ...req.body,
        campaignId,
        civilizationId
      };

      const mission = await missionsService.createMission(missionData);

      res.status(201).json({
        success: true,
        data: mission,
        message: 'Mission created successfully'
      });
    } catch (error) {
      console.error('Error creating mission:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create mission',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Update mission
  router.put('/:missionId', async (req, res) => {
    try {
      const { missionId } = req.params;
      const updates = req.body;

      const mission = await missionsService.updateMission(missionId, updates);

      res.json({
        success: true,
        data: mission,
        message: 'Mission updated successfully'
      });
    } catch (error) {
      console.error('Error updating mission:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update mission',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Start mission
  router.post('/:missionId/start', async (req, res) => {
    try {
      const { missionId } = req.params;
      const { assignedCharacters = [], assignedFleets = [] } = req.body;

      const mission = await missionsService.startMission(missionId, assignedCharacters, assignedFleets);

      res.json({
        success: true,
        data: mission,
        message: 'Mission started successfully'
      });
    } catch (error) {
      console.error('Error starting mission:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start mission',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Complete mission
  router.post('/:missionId/complete', async (req, res) => {
    try {
      const { missionId } = req.params;
      const { success = true, results } = req.body;

      const mission = await missionsService.completeMission(missionId, success, results);

      res.json({
        success: true,
        data: mission,
        message: `Mission ${success ? 'completed successfully' : 'failed'}`
      });
    } catch (error) {
      console.error('Error completing mission:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to complete mission',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ===== GAME MASTER AI INTEGRATION =====

  // Generate AI mission based on game state
  router.post('/civilization/:campaignId/:civilizationId/generate', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { gameState, storyContext, missionType } = req.body;

      const mission = await missionsService.generateGameMasterMission(
        campaignId,
        civilizationId,
        gameState,
        storyContext
      );

      res.status(201).json({
        success: true,
        data: mission,
        message: 'AI-generated mission created successfully'
      });
    } catch (error) {
      console.error('Error generating AI mission:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate AI mission',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Update missions knob settings
  router.put('/knobs', async (req, res) => {
    try {
      const { knobs } = req.body;
      
      // Validate knob values (0-100)
      for (const [key, value] of Object.entries(knobs)) {
        if (typeof value !== 'number' || value < 0 || value > 100) {
          return res.status(400).json({
            success: false,
            error: `Invalid knob value for ${key}: must be between 0 and 100`
          });
        }
      }

      // In a real implementation, you would store these settings
      // For now, we'll just return success
      res.json({
        success: true,
        data: { updatedKnobs: knobs },
        message: 'Missions knobs updated successfully'
      });
    } catch (error) {
      console.error('Error updating missions knobs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update missions knobs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Generate AI analysis for missions
  router.post('/civilization/:campaignId/:civilizationId/ai-analysis', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const { promptType, parameters } = req.body;

      if (!promptType || !MISSIONS_AI_PROMPTS[promptType as keyof typeof MISSIONS_AI_PROMPTS]) {
        return res.status(400).json({
          success: false,
          error: 'Invalid prompt type. Available types: ' + Object.keys(MISSIONS_AI_PROMPTS).join(', ')
        });
      }

      const prompt = MISSIONS_AI_PROMPTS[promptType as keyof typeof MISSIONS_AI_PROMPTS];
      
      // Replace parameters in prompt template
      let processedPrompt = prompt;
      if (parameters) {
        Object.entries(parameters).forEach(([key, value]) => {
          processedPrompt = processedPrompt.replace(new RegExp(`{${key}}`, 'g'), String(value));
        });
      }

      res.json({
        success: true,
        data: {
          promptType,
          processedPrompt,
          parameters,
          // Mock AI response
          aiResponse: `AI analysis for ${promptType} would be generated here based on the current mission situation.`
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

  // ===== MISSION STATISTICS =====

  // Get mission statistics for a civilization
  router.get('/civilization/:campaignId/:civilizationId/stats', async (req, res) => {
    try {
      const { campaignId, civilizationId } = req.params;
      const missions = await missionsService.getMissions(campaignId, civilizationId);

      const stats = {
        total: missions.length,
        byStatus: {
          available: missions.filter(m => m.status === 'available').length,
          active: missions.filter(m => m.status === 'active').length,
          completed: missions.filter(m => m.status === 'completed').length,
          failed: missions.filter(m => m.status === 'failed').length,
          cancelled: missions.filter(m => m.status === 'cancelled').length,
          on_hold: missions.filter(m => m.status === 'on_hold').length
        },
        byType: {
          exploration: missions.filter(m => m.type === 'exploration').length,
          diplomatic: missions.filter(m => m.type === 'diplomatic').length,
          military: missions.filter(m => m.type === 'military').length,
          economic: missions.filter(m => m.type === 'economic').length,
          research: missions.filter(m => m.type === 'research').length,
          espionage: missions.filter(m => m.type === 'espionage').length,
          humanitarian: missions.filter(m => m.type === 'humanitarian').length,
          cultural: missions.filter(m => m.type === 'cultural').length
        },
        byPriority: {
          low: missions.filter(m => m.priority === 'low').length,
          medium: missions.filter(m => m.priority === 'medium').length,
          high: missions.filter(m => m.priority === 'high').length,
          critical: missions.filter(m => m.priority === 'critical').length
        },
        byDifficulty: {
          1: missions.filter(m => m.difficulty === 1).length,
          2: missions.filter(m => m.difficulty === 2).length,
          3: missions.filter(m => m.difficulty === 3).length,
          4: missions.filter(m => m.difficulty === 4).length,
          5: missions.filter(m => m.difficulty === 5).length
        },
        gameMasterGenerated: missions.filter(m => m.gameMasterGenerated).length,
        averageSuccessProbability: missions.reduce((sum, m) => sum + m.successProbability, 0) / missions.length || 0
      };

      res.json({
        success: true,
        data: stats,
        message: 'Mission statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting mission statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve mission statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
}

// Helper functions for knob system
function getMissionsKnobDescriptions(): Record<string, string> {
  return {
    missionGenerationRate: "Frequency of new mission generation by Game Master AI",
    difficultyScaling: "How mission difficulty scales with civilization progress",
    rewardGenerosity: "Base reward amounts for completed missions",
    riskAssessmentAccuracy: "Accuracy of mission risk predictions",
    storyIntegrationDepth: "How deeply missions integrate with main story arc",
    characterInvolvementLevel: "Degree of character involvement in missions",
    timeConstraintStrictness: "How strictly time limits are enforced",
    failureConsequenceSeverity: "Severity of consequences for mission failures",
    successBonusMultiplier: "Bonus rewards for exceptional mission success",
    aiAnalysisDetail: "Depth of AI analysis for mission planning",
    emergencyMissionFrequency: "Frequency of urgent, time-sensitive missions",
    diplomaticMissionComplexity: "Complexity of diplomatic mission objectives",
    militaryMissionIntensity: "Combat intensity of military missions",
    explorationMissionScope: "Scope and scale of exploration missions",
    researchMissionDepth: "Scientific depth of research missions",
    economicMissionImpact: "Economic impact of trade and resource missions",
    espionageMissionRisk: "Risk level of espionage and intelligence missions",
    culturalMissionSignificance: "Cultural significance of humanitarian missions",
    missionChainComplexity: "Complexity of multi-part mission chains",
    playerChoiceImpact: "How much player choices affect mission outcomes",
    resourceRequirementFlexibility: "Flexibility in mission resource requirements",
    collaborativeMissionFrequency: "Frequency of multi-civilization missions",
    seasonalMissionVariation: "Variation in missions based on galactic seasons",
    legacyMissionInfluence: "How past missions influence future opportunities"
  };
}

function getMissionsKnobPresets(): Record<string, Partial<typeof MISSIONS_KNOBS>> {
  return {
    story_focused: {
      missionGenerationRate: 30,
      storyIntegrationDepth: 90,
      characterInvolvementLevel: 85,
      aiAnalysisDetail: 80,
      playerChoiceImpact: 95
    },
    action_packed: {
      missionGenerationRate: 80,
      militaryMissionIntensity: 90,
      emergencyMissionFrequency: 70,
      difficultyScaling: 75,
      failureConsequenceSeverity: 60
    },
    exploration_heavy: {
      explorationMissionScope: 90,
      missionGenerationRate: 60,
      researchMissionDepth: 80,
      rewardGenerosity: 70,
      riskAssessmentAccuracy: 85
    },
    diplomatic_focus: {
      diplomaticMissionComplexity: 85,
      culturalMissionSignificance: 80,
      collaborativeMissionFrequency: 75,
      playerChoiceImpact: 90,
      storyIntegrationDepth: 70
    },
    casual_play: {
      difficultyScaling: 40,
      timeConstraintStrictness: 30,
      failureConsequenceSeverity: 25,
      resourceRequirementFlexibility: 80,
      rewardGenerosity: 75
    }
  };
}

export default createMissionsRoutes;
