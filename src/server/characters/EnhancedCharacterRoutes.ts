/**
 * Enhanced Character Routes with Game State Awareness
 * 
 * Provides API endpoints for contextually aware character interactions
 */

import express from 'express';
import { ContextualCharacterAI, CharacterInteractionRequest } from './ContextualCharacterAI';
import { GameStateAwarenessService } from './GameStateAwareness';
import { CharacterService } from './CharacterService';

const router = express.Router();
const contextualAI = new ContextualCharacterAI();
const gameStateService = new GameStateAwarenessService();
const characterService = new CharacterService();

/**
 * POST /api/characters/:characterId/interact-aware
 * Enhanced character interaction with full game state awareness
 */
router.post('/:characterId/interact-aware', async (req, res) => {
  try {
    const { characterId } = req.params;
    const {
      prompt,
      interactionType = 'conversation',
      conversationId,
      participantId,
      topic,
      context,
      gameState,
      urgency = 'normal',
      confidentiality = 'public',
      previousMessages = []
    } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required for character interaction'
      });
    }

    // Get character data
    const character = await characterService.getCharacterById(characterId);
    if (!character) {
      return res.status(404).json({
        error: 'Character not found'
      });
    }

    // Create interaction request
    const interactionRequest: CharacterInteractionRequest = {
      characterId,
      prompt,
      interactionType: interactionType as any,
      context: {
        conversationId: conversationId || `conv_${Date.now()}`,
        participantId: participantId || 'player',
        topic: topic || 'General Discussion',
        context: context || '',
        previousMessages: previousMessages.map((msg: any) => ({
          speaker: msg.speaker,
          message: msg.message,
          timestamp: new Date(msg.timestamp || Date.now()),
          emotional_tone: msg.emotional_tone
        })),
        relationship_status: 'neutral', // TODO: Get from relationship system
        conversation_goals: []
      },
      gameState,
      urgency: urgency as any,
      confidentiality: confidentiality as any
    };

    // Process interaction with contextual AI
    const response = await contextualAI.processCharacterInteraction(
      character,
      interactionRequest
    );

    res.json({
      success: true,
      interaction: response,
      meta: {
        character_name: character.name.full_display,
        interaction_type: interactionType,
        processing_time: response.interaction_metadata.processing_time,
        confidence_score: response.interaction_metadata.confidence_score
      }
    });

  } catch (error) {
    console.error('❌ Error in enhanced character interaction:', error);
    res.status(500).json({
      error: 'Failed to process character interaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/characters/:characterId/awareness-context
 * Get character's current awareness context and knowledge
 */
router.get('/:characterId/awareness-context', async (req, res) => {
  try {
    const { characterId } = req.params;
    const { campaignId = 'default_campaign' } = req.query;

    // Get character data
    const character = await characterService.getCharacterById(characterId);
    if (!character) {
      return res.status(404).json({
        error: 'Character not found'
      });
    }

    // Get awareness context
    const awarenessContext = await gameStateService.createCharacterContext(
      characterId,
      character,
      campaignId as string
    );

    // Get interaction stats
    const interactionStats = contextualAI.getInteractionStats(characterId);

    res.json({
      success: true,
      character_id: characterId,
      character_name: character.name.full_display,
      awareness_context: {
        profession: awarenessContext.character.profession,
        specialization: awarenessContext.character.specialization,
        clearance_level: awarenessContext.character.clearance_level,
        access_privileges: awarenessContext.character.access_privileges,
        information_networks: awarenessContext.character.information_networks,
        game_state_awareness: {
          current_phase: awarenessContext.gameState.gamePhase,
          civilization_status: awarenessContext.gameState.playerCivilization.name,
          recent_events_count: awarenessContext.gameState.recentEvents.length
        },
        specialty_knowledge: {
          profession_field: awarenessContext.specialtyKnowledge.profession.field,
          expertise_level: awarenessContext.specialtyKnowledge.profession.expertise_level,
          specializations: awarenessContext.specialtyKnowledge.profession.specializations,
          years_experience: awarenessContext.specialtyKnowledge.profession.years_experience,
          has_government_knowledge: !!awarenessContext.specialtyKnowledge.government,
          has_military_knowledge: !!awarenessContext.specialtyKnowledge.military,
          has_business_knowledge: !!awarenessContext.specialtyKnowledge.business,
          has_academic_knowledge: !!awarenessContext.specialtyKnowledge.academic,
          has_media_knowledge: !!awarenessContext.specialtyKnowledge.media
        },
        recent_updates_count: awarenessContext.recentUpdates.length,
        conversation_history_count: awarenessContext.conversationContext.recent_conversations.length
      },
      interaction_stats: interactionStats
    });

  } catch (error) {
    console.error('❌ Error getting character awareness context:', error);
    res.status(500).json({
      error: 'Failed to get character awareness context',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/characters/:characterId/update-knowledge
 * Update character's knowledge with new information
 */
router.post('/:characterId/update-knowledge', async (req, res) => {
  try {
    const { characterId } = req.params;
    const {
      type,
      content,
      source,
      reliability = 80,
      timestamp
    } = req.body;

    if (!type || !content || !source) {
      return res.status(400).json({
        error: 'Type, content, and source are required'
      });
    }

    // Update character knowledge
    await contextualAI.updateCharacterKnowledge(characterId, {
      type,
      content,
      source,
      reliability: Math.max(0, Math.min(100, reliability)),
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    res.json({
      success: true,
      message: 'Character knowledge updated successfully',
      update: {
        character_id: characterId,
        information_type: type,
        source,
        reliability,
        timestamp: timestamp || new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error updating character knowledge:', error);
    res.status(500).json({
      error: 'Failed to update character knowledge',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/characters/:characterId/specialty-insights
 * Get character's specialty insights for a given topic
 */
router.get('/:characterId/specialty-insights', async (req, res) => {
  try {
    const { characterId } = req.params;
    const { topic, context } = req.query;

    if (!topic) {
      return res.status(400).json({
        error: 'Topic parameter is required'
      });
    }

    // Get character data
    const character = await characterService.getCharacterById(characterId);
    if (!character) {
      return res.status(404).json({
        error: 'Character not found'
      });
    }

    // Get specialty knowledge
    const specialtyKnowledge = await gameStateService.getSpecialtyKnowledge(
      characterId,
      character
    );

    // Generate insights based on specialty
    const insights = generateTopicInsights(
      topic as string,
      specialtyKnowledge,
      character,
      context as string
    );

    res.json({
      success: true,
      character_id: characterId,
      character_name: character.name.full_display,
      topic: topic,
      insights: insights,
      expertise_areas: {
        profession: specialtyKnowledge.profession.field,
        specializations: specialtyKnowledge.profession.specializations,
        expertise_level: specialtyKnowledge.profession.expertise_level,
        years_experience: specialtyKnowledge.profession.years_experience
      }
    });

  } catch (error) {
    console.error('❌ Error getting character specialty insights:', error);
    res.status(500).json({
      error: 'Failed to get character specialty insights',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/characters/batch-interact
 * Interact with multiple characters simultaneously
 */
router.post('/batch-interact', async (req, res) => {
  try {
    const {
      characterIds,
      prompt,
      interactionType = 'conversation',
      context,
      gameState
    } = req.body;

    if (!characterIds || !Array.isArray(characterIds) || characterIds.length === 0) {
      return res.status(400).json({
        error: 'characterIds array is required'
      });
    }

    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required'
      });
    }

    const interactions = [];
    const errors = [];

    // Process interactions in parallel
    const promises = characterIds.map(async (characterId: string) => {
      try {
        // Get character data
        const character = await characterService.getCharacterById(characterId);
        if (!character) {
          errors.push({ characterId, error: 'Character not found' });
          return null;
        }

        // Create interaction request
        const interactionRequest: CharacterInteractionRequest = {
          characterId,
          prompt,
          interactionType: interactionType as any,
          context: {
            conversationId: `batch_${Date.now()}_${characterId}`,
            participantId: 'player',
            topic: 'Batch Discussion',
            context: context || '',
            previousMessages: [],
            relationship_status: 'neutral',
            conversation_goals: []
          },
          gameState,
          urgency: 'normal',
          confidentiality: 'public'
        };

        // Process interaction
        const response = await contextualAI.processCharacterInteraction(
          character,
          interactionRequest
        );

        return {
          character_id: characterId,
          character_name: character.name.full_display,
          response: response.response,
          confidence_score: response.interaction_metadata.confidence_score
        };

      } catch (error) {
        errors.push({
          characterId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        return null;
      }
    });

    const results = await Promise.all(promises);
    const successfulInteractions = results.filter(result => result !== null);

    res.json({
      success: true,
      interactions: successfulInteractions,
      total_requested: characterIds.length,
      successful_interactions: successfulInteractions.length,
      errors: errors.length > 0 ? errors : undefined,
      meta: {
        interaction_type: interactionType,
        batch_timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error in batch character interaction:', error);
    res.status(500).json({
      error: 'Failed to process batch character interactions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/characters/game-state-summary
 * Get current game state summary for character awareness
 */
router.get('/game-state-summary', async (req, res) => {
  try {
    const { campaignId = 'default_campaign' } = req.query;

    // Get current game state
    const gameState = await gameStateService.getCurrentGameState(campaignId as string);

    // Create summary for character awareness
    const summary = {
      current_turn: gameState.currentTurn,
      game_phase: gameState.gamePhase,
      civilization: {
        name: gameState.playerCivilization.name,
        species: gameState.playerCivilization.species,
        government_type: gameState.playerCivilization.government_type,
        population: gameState.playerCivilization.total_population,
        military_strength: gameState.playerCivilization.military_strength,
        economic_power: gameState.playerCivilization.economic_power,
        technology_level: gameState.playerCivilization.technology_level
      },
      situation_summary: {
        political_stability: gameState.politicalSituation.activeWars.length === 0 ? 'stable' : 'unstable',
        economic_health: gameState.economicSituation.unemployment_rate < 5 ? 'good' : 'concerning',
        military_status: gameState.militarySituation.threat_level,
        social_mood: gameState.socialSituation.population_happiness > 70 ? 'positive' : 'mixed',
        recent_events_count: gameState.recentEvents.length
      },
      key_metrics: {
        gdp: gameState.economicSituation.gdp,
        unemployment_rate: gameState.economicSituation.unemployment_rate,
        population_happiness: gameState.socialSituation.population_happiness,
        military_readiness: gameState.militarySituation.military_readiness,
        technology_level: gameState.technologySituation.research_level
      }
    };

    res.json({
      success: true,
      campaign_id: campaignId,
      game_state_summary: summary,
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error getting game state summary:', error);
    res.status(500).json({
      error: 'Failed to get game state summary',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/characters/clear-caches
 * Clear all character awareness caches (admin endpoint)
 */
router.post('/clear-caches', async (req, res) => {
  try {
    contextualAI.clearCaches();
    gameStateService.clearCaches();

    res.json({
      success: true,
      message: 'All character awareness caches cleared successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error clearing caches:', error);
    res.status(500).json({
      error: 'Failed to clear caches',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper function to generate topic insights
function generateTopicInsights(
  topic: string,
  specialtyKnowledge: any,
  character: any,
  context?: string
): any[] {
  const insights = [];

  // Government insights
  if (specialtyKnowledge.government) {
    if (topic.toLowerCase().includes('policy') || topic.toLowerCase().includes('government')) {
      insights.push({
        type: 'Policy Analysis',
        insight: `From my experience in ${specialtyKnowledge.government.department}, I can provide insights on the policy implications...`,
        expertise_level: 85,
        confidence: 90,
        source: 'Government Experience'
      });
    }

    if (topic.toLowerCase().includes('budget') || topic.toLowerCase().includes('finance')) {
      insights.push({
        type: 'Budget Impact',
        insight: 'Based on my oversight of budget allocations, this could affect...',
        expertise_level: 80,
        confidence: 85,
        source: 'Budget Oversight'
      });
    }
  }

  // Military insights
  if (specialtyKnowledge.military) {
    if (topic.toLowerCase().includes('security') || topic.toLowerCase().includes('defense')) {
      insights.push({
        type: 'Security Assessment',
        insight: `As a ${specialtyKnowledge.military.rank} in the ${specialtyKnowledge.military.branch}, I assess the security implications as...`,
        expertise_level: 90,
        confidence: 95,
        source: 'Military Training'
      });
    }

    if (topic.toLowerCase().includes('threat') || topic.toLowerCase().includes('military')) {
      insights.push({
        type: 'Threat Analysis',
        insight: 'From a military perspective, the strategic considerations include...',
        expertise_level: 88,
        confidence: 92,
        source: 'Strategic Planning'
      });
    }
  }

  // Business insights
  if (specialtyKnowledge.business) {
    if (topic.toLowerCase().includes('economic') || topic.toLowerCase().includes('business')) {
      insights.push({
        type: 'Economic Impact',
        insight: `Given my experience in the ${specialtyKnowledge.business.industry} industry, the business implications suggest...`,
        expertise_level: 82,
        confidence: 88,
        source: 'Industry Experience'
      });
    }

    if (topic.toLowerCase().includes('market') || topic.toLowerCase().includes('trade')) {
      insights.push({
        type: 'Market Analysis',
        insight: 'The market dynamics and competitive landscape indicate...',
        expertise_level: 85,
        confidence: 87,
        source: 'Market Intelligence'
      });
    }
  }

  // Academic insights
  if (specialtyKnowledge.academic) {
    if (topic.toLowerCase().includes('research') || topic.toLowerCase().includes('science')) {
      insights.push({
        type: 'Research Perspective',
        insight: `Based on my research in ${specialtyKnowledge.academic.field}, the scientific evidence suggests...`,
        expertise_level: 88,
        confidence: 90,
        source: 'Academic Research'
      });
    }

    if (topic.toLowerCase().includes('technology') || topic.toLowerCase().includes('innovation')) {
      insights.push({
        type: 'Technical Analysis',
        insight: 'From a technological standpoint, the innovations and challenges include...',
        expertise_level: 85,
        confidence: 88,
        source: 'Technical Expertise'
      });
    }
  }

  // Media insights
  if (specialtyKnowledge.media) {
    if (topic.toLowerCase().includes('public') || topic.toLowerCase().includes('opinion')) {
      insights.push({
        type: 'Public Perception',
        insight: `As a journalist covering ${specialtyKnowledge.media.beat.join(', ')}, I've observed that public opinion tends to...`,
        expertise_level: 75,
        confidence: 80,
        source: 'Media Coverage'
      });
    }

    if (topic.toLowerCase().includes('communication') || topic.toLowerCase().includes('media')) {
      insights.push({
        type: 'Media Analysis',
        insight: 'The media landscape and communication strategies suggest...',
        expertise_level: 78,
        confidence: 82,
        source: 'Journalism Experience'
      });
    }
  }

  // Regional insights (always available)
  if (topic.toLowerCase().includes('local') || topic.toLowerCase().includes('regional')) {
    insights.push({
      type: 'Regional Context',
      insight: `In my region (${specialtyKnowledge.regional.home_region}), the local implications include...`,
      expertise_level: 70,
      confidence: 75,
      source: 'Local Knowledge'
    });
  }

  // If no specific insights, provide general professional perspective
  if (insights.length === 0) {
    insights.push({
      type: 'Professional Perspective',
      insight: `From my experience as ${character.profession?.current_job || 'a professional'}, I would approach this by...`,
      expertise_level: 60,
      confidence: 65,
      source: 'Professional Experience'
    });
  }

  return insights;
}

export default router;


