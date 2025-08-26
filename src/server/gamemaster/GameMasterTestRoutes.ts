import express from 'express';
import { gameMasterTriggerService } from './GameMasterTriggers.js';
import { veo3VideoGenerator } from './VEO3VideoGenerator.js';

export const createGameMasterTestRoutes = () => {
  const router = express.Router();

  // Test endpoint to trigger various game events
  router.post('/test/trigger-event', async (req, res) => {
    const { eventType, campaignId = 'default', ...eventData } = req.body;

    try {
      switch (eventType) {
        case 'major_discovery':
          await gameMasterTriggerService.triggerDiscovery(campaignId, {
            type: eventData.type || 'planet',
            significance: 'high',
            location: eventData.location || 'Kepler-442 System',
            ...eventData
          });
          break;

        case 'political_crisis':
          await gameMasterTriggerService.triggerPoliticalChange(campaignId, {
            newStability: eventData.newStability || 45,
            change: eventData.change || -25,
            ...eventData
          });
          break;

        case 'economic_milestone':
          await gameMasterTriggerService.triggerEconomicMilestone(campaignId, {
            newGDP: eventData.newGDP || 50000000000000,
            growthPercent: eventData.growthPercent || 30,
            ...eventData
          });
          break;

        case 'military_threat':
          await gameMasterTriggerService.triggerMilitaryThreat(campaignId, {
            threatLevel: 'high',
            readiness: eventData.readiness || 85,
            ...eventData
          });
          break;

        case 'natural_disaster':
          await gameMasterTriggerService.triggerNaturalDisaster(campaignId, {
            severity: 'major',
            affectedPopulation: eventData.affectedPopulation || 500000,
            disasterType: eventData.disasterType || 'asteroid_impact',
            ...eventData
          });
          break;

        case 'technology_breakthrough':
          await gameMasterTriggerService.triggerTechnologyBreakthrough(campaignId, {
            techType: eventData.techType || 'faster_than_light',
            breakthrough: true,
            capabilities: eventData.capabilities || ['interstellar_travel', 'quantum_communication'],
            ...eventData
          });
          break;

        case 'population_milestone':
          await gameMasterTriggerService.triggerPopulationMilestone(campaignId, {
            newPopulation: eventData.newPopulation || 1500000,
            growthRate: eventData.growthRate || 2.5,
            ...eventData
          });
          break;

        case 'colony_established':
          await gameMasterTriggerService.triggerColonyEstablished(campaignId, {
            colonyName: eventData.colonyName || 'New Terra',
            planetType: eventData.planetType || 'terrestrial',
            totalPlanets: eventData.totalPlanets || 3,
            ...eventData
          });
          break;

        case 'diplomatic_achievement':
          await gameMasterTriggerService.triggerDiplomaticEvent(campaignId, {
            allianceCount: eventData.allianceCount || 4,
            relations: eventData.relations || { 'Vega_Federation': 85, 'Centauri_Republic': 78 },
            ...eventData
          });
          break;

        default:
          return res.status(400).json({
            success: false,
            error: `Unknown event type: ${eventType}`
          });
      }

      res.json({
        success: true,
        message: `Triggered ${eventType} event for campaign ${campaignId}`,
        eventData
      });

    } catch (error) {
      console.error('Error triggering test event:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to trigger event'
      });
    }
  });

  // Get current game state
  router.get('/test/game-state/:campaignId?', (req, res) => {
    const campaignId = req.params.campaignId || 'default';
    const gameState = gameMasterTriggerService.getGameState(campaignId);
    
    res.json({
      success: true,
      campaignId,
      gameState
    });
  });

  // Get event history
  router.get('/test/event-history/:campaignId?', (req, res) => {
    const campaignId = req.params.campaignId;
    const limit = parseInt(req.query.limit as string) || 50;
    const events = gameMasterTriggerService.getEventHistory(campaignId, limit);
    
    res.json({
      success: true,
      campaignId: campaignId || 'all',
      events,
      count: events.length
    });
  });

  // Clear game state (for testing)
  router.delete('/test/clear-state/:campaignId?', (req, res) => {
    const campaignId = req.params.campaignId;
    gameMasterTriggerService.clearState(campaignId);
    
    res.json({
      success: true,
      message: campaignId ? `Cleared state for campaign ${campaignId}` : 'Cleared all state'
    });
  });

  // Predefined test scenarios
  router.post('/test/scenario/:scenarioName', async (req, res) => {
    const { scenarioName } = req.params;
    const { campaignId = 'default' } = req.body;

    try {
      switch (scenarioName) {
        case 'first_contact':
          await gameMasterTriggerService.triggerDiscovery(campaignId, {
            type: 'alien_civilization',
            significance: 'high',
            location: 'Proxima Centauri System',
            details: 'First contact with an advanced alien civilization has been established.'
          });
          break;

        case 'galactic_war':
          await gameMasterTriggerService.triggerMilitaryThreat(campaignId, {
            threatLevel: 'high',
            readiness: 95,
            threatSource: 'Hostile_Empire',
            details: 'A hostile galactic empire has declared war on our civilization.'
          });
          break;

        case 'economic_boom':
          await gameMasterTriggerService.triggerEconomicMilestone(campaignId, {
            newGDP: 75000000000000,
            growthPercent: 45,
            details: 'Discovery of rare resources has triggered an unprecedented economic boom.'
          });
          break;

        case 'technological_singularity':
          await gameMasterTriggerService.triggerTechnologyBreakthrough(campaignId, {
            techType: 'artificial_general_intelligence',
            breakthrough: true,
            capabilities: ['self_improving_ai', 'quantum_consciousness', 'reality_simulation'],
            details: 'Achievement of artificial general intelligence marks the beginning of the technological singularity.'
          });
          break;

        case 'planetary_catastrophe':
          await gameMasterTriggerService.triggerNaturalDisaster(campaignId, {
            severity: 'major',
            affectedPopulation: 2000000,
            disasterType: 'gamma_ray_burst',
            details: 'A nearby gamma-ray burst has severely damaged our home planet\'s atmosphere.'
          });
          break;

        case 'galactic_alliance':
          await gameMasterTriggerService.triggerDiplomaticEvent(campaignId, {
            allianceCount: 8,
            relations: {
              'Vega_Federation': 95,
              'Centauri_Republic': 90,
              'Andromeda_Coalition': 88,
              'Orion_Syndicate': 85
            },
            details: 'Formation of the Grand Galactic Alliance brings unprecedented cooperation.'
          });
          break;

        case 'colonial_expansion':
          // Trigger multiple colony establishments
          for (let i = 1; i <= 5; i++) {
            await gameMasterTriggerService.triggerColonyEstablished(campaignId, {
              colonyName: `Colony Alpha-${i}`,
              planetType: ['terrestrial', 'oceanic', 'desert', 'arctic', 'volcanic'][i - 1],
              totalPlanets: i + 2
            });
          }
          break;

        default:
          return res.status(400).json({
            success: false,
            error: `Unknown scenario: ${scenarioName}`
          });
      }

      res.json({
        success: true,
        message: `Executed scenario "${scenarioName}" for campaign ${campaignId}`,
        scenario: scenarioName
      });

    } catch (error) {
      console.error('Error executing test scenario:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to execute scenario'
      });
    }
  });

  // List available scenarios
  router.get('/test/scenarios', (req, res) => {
    const scenarios = [
      {
        name: 'first_contact',
        description: 'First contact with an alien civilization',
        triggers: ['major_discovery']
      },
      {
        name: 'galactic_war',
        description: 'Declaration of war by a hostile empire',
        triggers: ['military_threat']
      },
      {
        name: 'economic_boom',
        description: 'Unprecedented economic growth',
        triggers: ['economic_milestone']
      },
      {
        name: 'technological_singularity',
        description: 'Achievement of artificial general intelligence',
        triggers: ['technology_breakthrough']
      },
      {
        name: 'planetary_catastrophe',
        description: 'Major natural disaster affecting the home planet',
        triggers: ['natural_disaster']
      },
      {
        name: 'galactic_alliance',
        description: 'Formation of a grand galactic alliance',
        triggers: ['diplomatic_achievement']
      },
      {
        name: 'colonial_expansion',
        description: 'Rapid expansion across multiple star systems',
        triggers: ['colony_established']
      }
    ];

    res.json({
      success: true,
      scenarios,
      count: scenarios.length
    });
  });

  // VEO 3 specific test endpoints
  router.post('/test/veo3/generate', async (req, res) => {
    const { prompt, duration = 8, aspectRatio = '16:9', style = 'cinematic', quality = 'high' } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required for VEO 3 video generation'
      });
    }

    try {
      console.log(`🎬 VEO 3 Test: Generating video with prompt: "${prompt}"`);
      
      const videoResponse = await veo3VideoGenerator.generateVideo({
        prompt,
        duration,
        aspectRatio,
        style,
        quality
      });

      res.json({
        success: true,
        message: 'VEO 3 video generation initiated',
        video: videoResponse,
        prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : '')
      });

    } catch (error) {
      console.error('VEO 3 test generation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate VEO 3 video'
      });
    }
  });

  // Generate VEO 3 video for specific game event with visual consistency
  router.post('/test/veo3/event-video', async (req, res) => {
    const { eventType, context = {} } = req.body;

    if (!eventType) {
      return res.status(400).json({
        success: false,
        error: 'Event type is required'
      });
    }

    try {
      let prompt: string;
      let videoType = 'general';

      if (context.characterId) {
        prompt = veo3VideoGenerator.generateCharacterVideoPrompt(context.characterId, eventType, context);
        videoType = 'character-specific';
      } else if (context.locationId) {
        prompt = veo3VideoGenerator.generateLocationVideoPrompt(context.locationId, eventType, context);
        videoType = 'location-specific';
      } else {
        prompt = veo3VideoGenerator.generatePromptForEvent(eventType, context);
      }
      
      console.log(`🎬 VEO 3 Test: Generating ${videoType} ${eventType} video`);
      console.log(`🎬 VEO 3 Prompt: ${prompt.substring(0, 300)}...`);
      
      const videoResponse = await veo3VideoGenerator.generateVideo({
        prompt,
        duration: 8,
        aspectRatio: '16:9',
        style: 'cinematic',
        quality: 'high'
      });

      res.json({
        success: true,
        message: `VEO 3 ${videoType} video generated for ${eventType}`,
        eventType,
        videoType,
        context,
        video: videoResponse,
        generatedPrompt: prompt,
        promptLength: prompt.length,
        visualConsistency: {
          characterId: context.characterId || null,
          locationId: context.locationId || null,
          styleApplied: true,
          colorPaletteUsed: true
        }
      });

    } catch (error) {
      console.error('VEO 3 event video generation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate VEO 3 event video'
      });
    }
  });

  // Test character-specific video generation
  router.post('/test/veo3/character-video', async (req, res) => {
    const { characterId, eventType = 'major_discovery', context = {} } = req.body;

    if (!characterId) {
      return res.status(400).json({
        success: false,
        error: 'Character ID is required'
      });
    }

    try {
      const enhancedContext = { ...context, characterId };
      const prompt = veo3VideoGenerator.generateCharacterVideoPrompt(characterId, eventType, enhancedContext);
      
      console.log(`🎬 VEO 3 Character Test: Generating video for character ${characterId}`);
      
      const videoResponse = await veo3VideoGenerator.generateVideo({
        prompt,
        duration: 10,
        aspectRatio: '16:9',
        style: 'cinematic',
        quality: 'high'
      });

      res.json({
        success: true,
        message: `Character-specific VEO 3 video generated for ${characterId}`,
        characterId,
        eventType,
        video: videoResponse,
        generatedPrompt: prompt,
        visualConsistency: {
          characterConsistency: true,
          visualSeedUsed: true,
          speciesAestheticsApplied: true
        }
      });

    } catch (error) {
      console.error('VEO 3 character video generation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate character-specific VEO 3 video'
      });
    }
  });

  // Test location-specific video generation
  router.post('/test/veo3/location-video', async (req, res) => {
    const { locationId, eventType = 'colony_established', context = {} } = req.body;

    if (!locationId) {
      return res.status(400).json({
        success: false,
        error: 'Location ID is required'
      });
    }

    try {
      const enhancedContext = { ...context, locationId };
      const prompt = veo3VideoGenerator.generateLocationVideoPrompt(locationId, eventType, enhancedContext);
      
      console.log(`🎬 VEO 3 Location Test: Generating video for location ${locationId}`);
      
      const videoResponse = await veo3VideoGenerator.generateVideo({
        prompt,
        duration: 12,
        aspectRatio: '16:9',
        style: 'cinematic',
        quality: 'high'
      });

      res.json({
        success: true,
        message: `Location-specific VEO 3 video generated for ${locationId}`,
        locationId,
        eventType,
        video: videoResponse,
        generatedPrompt: prompt,
        visualConsistency: {
          locationConsistency: true,
          environmentalStyling: true,
          architecturalConsistency: true
        }
      });

    } catch (error) {
      console.error('VEO 3 location video generation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate location-specific VEO 3 video'
      });
    }
  });

  // Check VEO 3 video status
  router.get('/test/veo3/status/:videoId', async (req, res) => {
    const { videoId } = req.params;

    try {
      const status = await veo3VideoGenerator.checkVideoStatus(videoId);
      
      res.json({
        success: true,
        videoId,
        status
      });

    } catch (error) {
      console.error('VEO 3 status check failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check VEO 3 video status'
      });
    }
  });

  // Test all VEO 3 event types
  router.post('/test/veo3/all-events', async (req, res) => {
    const eventTypes = [
      'major_discovery',
      'political_crisis', 
      'economic_milestone',
      'military_conflict',
      'natural_disaster',
      'technology_breakthrough',
      'population_milestone',
      'colony_established',
      'diplomatic_achievement'
    ];

    const results = [];

    try {
      for (const eventType of eventTypes) {
        const prompt = veo3VideoGenerator.generatePromptForEvent(eventType, {
          location: 'Test System',
          campaignId: 'test'
        });

        const videoResponse = await veo3VideoGenerator.generateVideo({
          prompt,
          duration: 6,
          aspectRatio: '16:9',
          style: 'cinematic',
          quality: 'standard'
        });

        results.push({
          eventType,
          video: videoResponse,
          prompt: prompt.substring(0, 150) + '...'
        });

        console.log(`🎬 VEO 3 Test: Generated ${eventType} video - ${videoResponse.videoUrl}`);
      }

      res.json({
        success: true,
        message: `Generated ${results.length} VEO 3 videos for all event types`,
        results,
        totalEvents: eventTypes.length
      });

    } catch (error) {
      console.error('VEO 3 bulk generation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate VEO 3 videos for all events',
        partialResults: results
      });
    }
  });

  return router;
};

export default createGameMasterTestRoutes;
