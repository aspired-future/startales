/**
 * Leader Communications API Routes
 * 
 * REST API endpoints for the Leader Communications System,
 * providing briefings, speeches, decision support, and natural language integration.
 */

import { Router, Request, Response } from 'express';
import { leaderBriefingEngine } from './LeaderBriefingEngine';
import { leaderSpeechEngine } from './LeaderSpeechEngine';
import { decisionSupportEngine } from './DecisionSupportEngine';
import { 
  BriefingRequest, 
  SpeechRequest,
  DecisionSupportRequest,
  LeaderCommunicationResponse,
  LeaderBriefing,
  LeaderSpeech,
  PendingDecision
} from './types';
import { db } from '../storage/db';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = Router();

// Enhanced AI Knobs for Leader Communications System
const leaderCommunicationsKnobsData = {
  // Briefing Quality & Depth
  briefing_detail_comprehensiveness: 0.8,    // Briefing detail comprehensiveness and thoroughness
  information_synthesis_quality: 0.8,        // Information synthesis quality and insight generation
  strategic_context_emphasis: 0.7,           // Strategic context emphasis and big-picture perspective
  
  // Decision Support & Analysis
  decision_support_sophistication: 0.8,      // Decision support sophistication and analytical depth
  recommendation_confidence_level: 0.7,      // Recommendation confidence level and certainty
  risk_assessment_thoroughness: 0.8,         // Risk assessment thoroughness and scenario analysis
  
  // Communication Style & Tone
  communication_formality_level: 0.7,        // Communication formality level and professional tone
  leadership_voice_authenticity: 0.8,        // Leadership voice authenticity and personal style
  message_clarity_optimization: 0.9,         // Message clarity optimization and comprehensibility
  
  // Speech Generation & Rhetoric
  speech_persuasiveness_factor: 0.7,         // Speech persuasiveness factor and rhetorical effectiveness
  audience_adaptation_sensitivity: 0.8,      // Audience adaptation sensitivity and targeting
  emotional_resonance_calibration: 0.7,      // Emotional resonance calibration and impact
  
  // Information Processing & Filtering
  information_prioritization_accuracy: 0.8,  // Information prioritization accuracy and relevance
  noise_filtering_effectiveness: 0.8,        // Noise filtering effectiveness and signal clarity
  real_time_update_responsiveness: 0.7,      // Real-time update responsiveness and agility
  
  // Crisis Communication & Emergency Response
  crisis_communication_urgency: 0.8,         // Crisis communication urgency and rapid response
  emergency_briefing_prioritization: 0.9,    // Emergency briefing prioritization and focus
  stakeholder_notification_efficiency: 0.8,  // Stakeholder notification efficiency and coverage
  
  // Natural Language Integration
  natural_language_understanding: 0.8,       // Natural language understanding and interpretation
  conversational_interface_fluency: 0.7,     // Conversational interface fluency and naturalness
  context_awareness_sophistication: 0.8,     // Context awareness sophistication and memory
  
  // Performance & Efficiency
  response_generation_speed: 0.7,            // Response generation speed and timeliness
  computational_resource_optimization: 0.7,  // Computational resource optimization and efficiency
  multi_task_processing_capability: 0.7,     // Multi-task processing capability and parallelization
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Leader Communications
const leaderCommunicationsKnobSystem = new EnhancedKnobSystem(leaderCommunicationsKnobsData);

// Apply leader communications knobs to game state
function applyLeaderCommunicationsKnobsToGameState() {
  const knobs = leaderCommunicationsKnobSystem.knobs;
  
  // Apply briefing quality settings
  const briefingQuality = (knobs.briefing_detail_comprehensiveness + knobs.information_synthesis_quality + 
    knobs.strategic_context_emphasis) / 3;
  
  // Apply decision support settings
  const decisionSupport = (knobs.decision_support_sophistication + knobs.recommendation_confidence_level + 
    knobs.risk_assessment_thoroughness) / 3;
  
  // Apply communication style settings
  const communicationStyle = (knobs.communication_formality_level + knobs.leadership_voice_authenticity + 
    knobs.message_clarity_optimization) / 3;
  
  // Apply speech generation settings
  const speechGeneration = (knobs.speech_persuasiveness_factor + knobs.audience_adaptation_sensitivity + 
    knobs.emotional_resonance_calibration) / 3;
  
  // Apply information processing settings
  const informationProcessing = (knobs.information_prioritization_accuracy + knobs.noise_filtering_effectiveness + 
    knobs.real_time_update_responsiveness) / 3;
  
  // Apply crisis communication settings
  const crisisCommunication = (knobs.crisis_communication_urgency + knobs.emergency_briefing_prioritization + 
    knobs.stakeholder_notification_efficiency) / 3;
  
  console.log('Applied leader communications knobs to game state:', {
    briefingQuality,
    decisionSupport,
    communicationStyle,
    speechGeneration,
    informationProcessing,
    crisisCommunication
  });
}

/**
 * Generate leader briefing
 * POST /api/leader/briefing
 */
router.post('/briefing', async (req: Request, res: Response) => {
  try {
    const request: BriefingRequest = {
      campaignId: req.body.campaignId || 1,
      tickId: req.body.tickId || 1,
      leaderCharacterId: req.body.leaderCharacterId || 'leader-1',
      type: req.body.type || 'daily',
      
      includeSections: req.body.includeSections,
      excludeSections: req.body.excludeSections,
      priority: req.body.priority,
      
      recentEvents: req.body.recentEvents,
      specificTopics: req.body.specificTopics,
      timeframe: req.body.timeframe,
      
      detailLevel: req.body.detailLevel || 'standard',
      includeRecommendations: req.body.includeRecommendations !== false,
      includeDecisionSupport: req.body.includeDecisionSupport !== false
    };

    const startTime = Date.now();
    const briefing = await leaderBriefingEngine.generateBriefing(request);
    const generationTime = Date.now() - startTime;
    
    // Store briefing in database
    await storeBriefing(briefing);

    const response: LeaderCommunicationResponse<LeaderBriefing> = {
      success: true,
      data: briefing,
      message: `Generated ${briefing.type} briefing with ${briefing.sections.length} sections`,
      timestamp: new Date(),
      generationStats: {
        totalTime: generationTime,
        aiModel: briefing.generationContext.aiModel,
        confidence: briefing.generationContext.confidence
      },
      qualityMetrics: {
        relevance: 0.85,
        actionability: briefing.recommendations.length > 0 ? 0.9 : 0.6,
        clarity: 0.8,
        completeness: briefing.sections.length / 6 // Assuming 6 ideal sections
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating briefing:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during briefing generation',
      message: 'Failed to generate leader briefing',
      timestamp: new Date()
    });
  }
});

/**
 * Generate leader speech
 * POST /api/leader/speech
 */
router.post('/speech', async (req: Request, res: Response) => {
  try {
    const request: SpeechRequest = {
      campaignId: req.body.campaignId || 1,
      tickId: req.body.tickId || 1,
      leaderCharacterId: req.body.leaderCharacterId || 'leader-1',
      type: req.body.type || 'policy_announcement',
      
      audience: req.body.audience || {
        primary: 'general_public',
        demographics: ['citizens'],
        estimatedSize: 1000000,
        broadcastChannels: ['television', 'radio', 'internet'],
        expectedReach: 0.8
      },
      
      occasion: req.body.occasion || 'Official Address',
      keyMessages: req.body.keyMessages,
      tone: req.body.tone,
      duration: req.body.duration,
      
      recentEvents: req.body.recentEvents,
      policyFocus: req.body.policyFocus,
      currentChallenges: req.body.currentChallenges,
      
      styleGuide: req.body.styleGuide,
      inspirationalLevel: req.body.inspirationalLevel,
      formalityLevel: req.body.formalityLevel
    };

    const startTime = Date.now();
    const speech = await leaderSpeechEngine.generateSpeech(request);
    const generationTime = Date.now() - startTime;
    
    // Store speech in database
    await storeSpeech(speech);

    const response: LeaderCommunicationResponse<LeaderSpeech> = {
      success: true,
      data: speech,
      message: `Generated ${speech.type} speech (${speech.duration} minutes)`,
      timestamp: new Date(),
      generationStats: {
        totalTime: generationTime,
        aiModel: speech.generationContext.aiModel,
        confidence: speech.generationContext.confidence
      },
      qualityMetrics: {
        relevance: 0.85,
        actionability: speech.simulationEffects.length > 0 ? 0.9 : 0.5,
        clarity: 0.8,
        completeness: speech.keyMessages.length >= 3 ? 0.9 : 0.7
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during speech generation',
      message: 'Failed to generate leader speech',
      timestamp: new Date()
    });
  }
});

/**
 * Apply speech effects to simulation
 * POST /api/leader/speech/:id/apply
 */
router.post('/speech/:id/apply', async (req: Request, res: Response) => {
  try {
    const speechId = req.params.id;
    const speech = await getSpeechById(speechId);

    if (!speech) {
      return res.status(404).json({
        success: false,
        error: 'Speech not found',
        message: `No speech found with ID: ${speechId}`,
        timestamp: new Date()
      });
    }

    const effects = await leaderSpeechEngine.applySpeechEffects(speech);

    const response: LeaderCommunicationResponse = {
      success: true,
      data: {
        speech,
        effects,
        effectsApplied: effects.length
      },
      message: `Applied ${effects.length} speech effects to simulation`,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error applying speech effects:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to apply speech effects',
      timestamp: new Date()
    });
  }
});

/**
 * Generate decision support analysis
 * POST /api/leader/decision-support
 */
router.post('/decision-support', async (req: Request, res: Response) => {
  try {
    const request: DecisionSupportRequest = {
      campaignId: req.body.campaignId || 1,
      tickId: req.body.tickId || 1,
      leaderCharacterId: req.body.leaderCharacterId || 'leader-1',
      
      decisionTitle: req.body.decisionTitle || 'Leadership Decision',
      decisionDescription: req.body.decisionDescription || '',
      category: req.body.category || 'social',
      urgency: req.body.urgency || 'important',
      
      includeRiskAssessment: req.body.includeRiskAssessment !== false,
      includeCostBenefit: req.body.includeCostBenefit !== false,
      includeStakeholderAnalysis: req.body.includeStakeholderAnalysis !== false,
      
      constraints: req.body.constraints,
      objectives: req.body.objectives,
      availableResources: req.body.availableResources,
      
      analysisDepth: req.body.analysisDepth || 'standard',
      includeAlternatives: req.body.includeAlternatives !== false,
      maxOptions: req.body.maxOptions || 4
    };

    const startTime = Date.now();
    const decision = await decisionSupportEngine.generateDecisionSupport(request);
    const generationTime = Date.now() - startTime;

    const response: LeaderCommunicationResponse<PendingDecision> = {
      success: true,
      data: decision,
      message: `Generated decision support with ${decision.options.length} options`,
      timestamp: new Date(),
      generationStats: {
        totalTime: generationTime,
        aiModel: 'gpt-4',
        confidence: 0.8
      },
      qualityMetrics: {
        relevance: 0.9,
        actionability: 0.85,
        clarity: 0.8,
        completeness: decision.options.length >= 3 ? 0.9 : 0.7
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating decision support:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during decision support generation',
      message: 'Failed to generate decision support',
      timestamp: new Date()
    });
  }
});

/**
 * Implement a decision
 * POST /api/leader/decisions/:id/implement
 */
router.post('/decisions/:id/implement', async (req: Request, res: Response) => {
  try {
    const decisionId = req.params.id;
    const selectedOptionId = req.body.optionId;

    if (!selectedOptionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing option ID',
        message: 'Must specify which option to implement',
        timestamp: new Date()
      });
    }

    const result = await decisionSupportEngine.implementDecision(decisionId, selectedOptionId);

    const response: LeaderCommunicationResponse = {
      success: true,
      data: result,
      message: `Decision implemented with ${result.effects.length} effects applied`,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error implementing decision:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to implement decision',
      timestamp: new Date()
    });
  }
});

/**
 * Get leader briefings
 * GET /api/leader/briefings
 */
router.get('/briefings', async (req: Request, res: Response) => {
  try {
    const campaignId = req.query.campaignId ? parseInt(req.query.campaignId as string) : 1;
    const leaderCharacterId = req.query.leaderCharacterId as string || 'leader-1';
    const type = req.query.type as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const briefings = await getBriefings(campaignId, leaderCharacterId, type, limit);

    const response: LeaderCommunicationResponse<LeaderBriefing[]> = {
      success: true,
      data: briefings,
      message: `Retrieved ${briefings.length} briefings`,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting briefings:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve briefings',
      timestamp: new Date()
    });
  }
});

/**
 * Get leader speeches
 * GET /api/leader/speeches
 */
router.get('/speeches', async (req: Request, res: Response) => {
  try {
    const campaignId = req.query.campaignId ? parseInt(req.query.campaignId as string) : 1;
    const leaderCharacterId = req.query.leaderCharacterId as string || 'leader-1';
    const type = req.query.type as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const speeches = await getSpeeches(campaignId, leaderCharacterId, type, limit);

    const response: LeaderCommunicationResponse<LeaderSpeech[]> = {
      success: true,
      data: speeches,
      message: `Retrieved ${speeches.length} speeches`,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting speeches:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve speeches',
      timestamp: new Date()
    });
  }
});

/**
 * Get pending decisions
 * GET /api/leader/decisions
 */
router.get('/decisions', async (req: Request, res: Response) => {
  try {
    const campaignId = req.query.campaignId ? parseInt(req.query.campaignId as string) : 1;
    const category = req.query.category as string;
    const urgency = req.query.urgency as string;
    const status = req.query.status as string || 'pending';
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const decisions = await getDecisions(campaignId, category, urgency, status, limit);

    const response: LeaderCommunicationResponse<PendingDecision[]> = {
      success: true,
      data: decisions,
      message: `Retrieved ${decisions.length} decisions`,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting decisions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve decisions',
      timestamp: new Date()
    });
  }
});

/**
 * Get specific briefing by ID
 * GET /api/leader/briefings/:id
 */
router.get('/briefings/:id', async (req: Request, res: Response) => {
  try {
    const briefingId = req.params.id;
    const briefing = await getBriefingById(briefingId);

    if (!briefing) {
      return res.status(404).json({
        success: false,
        error: 'Briefing not found',
        message: `No briefing found with ID: ${briefingId}`,
        timestamp: new Date()
      });
    }

    const response: LeaderCommunicationResponse<LeaderBriefing> = {
      success: true,
      data: briefing,
      message: 'Briefing retrieved successfully',
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting briefing:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve briefing',
      timestamp: new Date()
    });
  }
});

/**
 * Get specific speech by ID
 * GET /api/leader/speeches/:id
 */
router.get('/speeches/:id', async (req: Request, res: Response) => {
  try {
    const speechId = req.params.id;
    const speech = await getSpeechById(speechId);

    if (!speech) {
      return res.status(404).json({
        success: false,
        error: 'Speech not found',
        message: `No speech found with ID: ${speechId}`,
        timestamp: new Date()
      });
    }

    const response: LeaderCommunicationResponse<LeaderSpeech> = {
      success: true,
      data: speech,
      message: 'Speech retrieved successfully',
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting speech:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve speech',
      timestamp: new Date()
    });
  }
});

/**
 * Get specific decision by ID
 * GET /api/leader/decisions/:id
 */
router.get('/decisions/:id', async (req: Request, res: Response) => {
  try {
    const decisionId = req.params.id;
    const decision = await getDecisionById(decisionId);

    if (!decision) {
      return res.status(404).json({
        success: false,
        error: 'Decision not found',
        message: `No decision found with ID: ${decisionId}`,
        timestamp: new Date()
      });
    }

    const response: LeaderCommunicationResponse<PendingDecision> = {
      success: true,
      data: decision,
      message: 'Decision retrieved successfully',
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting decision:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve decision',
      timestamp: new Date()
    });
  }
});

/**
 * Update decision status
 * PUT /api/leader/decisions/:id/status
 */
router.put('/decisions/:id/status', async (req: Request, res: Response) => {
  try {
    const decisionId = req.params.id;
    const newStatus = req.body.status;
    const feedback = req.body.feedback;

    if (!newStatus) {
      return res.status(400).json({
        success: false,
        error: 'Missing status',
        message: 'Must specify new status',
        timestamp: new Date()
      });
    }

    const updatedDecision = await decisionSupportEngine.updateDecision(decisionId, {
      status: newStatus,
      feedback
    });

    const response: LeaderCommunicationResponse<PendingDecision> = {
      success: true,
      data: updatedDecision,
      message: 'Decision status updated successfully',
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating decision status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update decision status',
      timestamp: new Date()
    });
  }
});

/**
 * Get leader communication analytics
 * GET /api/leader/analytics
 */
router.get('/analytics', async (req: Request, res: Response) => {
  try {
    const campaignId = req.query.campaignId ? parseInt(req.query.campaignId as string) : 1;
    const timeframe = req.query.timeframe as string || '7d';

    const analytics = await getLeaderCommunicationAnalytics(campaignId, timeframe);

    const response: LeaderCommunicationResponse = {
      success: true,
      data: analytics,
      message: 'Analytics retrieved successfully',
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve analytics',
      timestamp: new Date()
    });
  }
});

// Helper Functions

/**
 * Store briefing in database
 */
async function storeBriefing(briefing: LeaderBriefing): Promise<void> {
  try {
    const query = `
      INSERT INTO leader_briefings (
        id, type, title, summary, content, campaign_id, tick_id, leader_character_id,
        sections, key_points, recommendations, urgent_matters, pending_decisions,
        advisor_inputs, civilization_status, threat_assessment, opportunity_analysis,
        generation_context, created_at, scheduled_for, acknowledged, priority, classification
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        updated_at = now()
    `;

    await db.query(query, [
      briefing.id, briefing.type, briefing.title, briefing.summary, briefing.content,
      briefing.campaignId, briefing.tickId, briefing.leaderCharacterId,
      JSON.stringify(briefing.sections), JSON.stringify(briefing.keyPoints),
      JSON.stringify(briefing.recommendations), JSON.stringify(briefing.urgentMatters),
      JSON.stringify(briefing.pendingDecisions), JSON.stringify(briefing.advisorInputs),
      JSON.stringify(briefing.civilizationStatus), JSON.stringify(briefing.threatAssessment),
      JSON.stringify(briefing.opportunityAnalysis), JSON.stringify(briefing.generationContext),
      briefing.createdAt, briefing.scheduledFor, briefing.acknowledged,
      briefing.priority, briefing.classification
    ]);
  } catch (error) {
    console.error('Error storing briefing:', error);
    throw error;
  }
}

/**
 * Store speech in database
 */
async function storeSpeech(speech: LeaderSpeech): Promise<void> {
  try {
    const query = `
      INSERT INTO leader_speeches (
        id, type, title, content, summary, campaign_id, tick_id, leader_character_id,
        audience, venue, occasion, tone, duration, key_messages, expected_impact,
        simulation_effects, public_reaction, generation_context, created_at,
        scheduled_for, status, priority
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        status = EXCLUDED.status,
        updated_at = now()
    `;

    await db.query(query, [
      speech.id, speech.type, speech.title, speech.content, speech.summary,
      speech.campaignId, speech.tickId, speech.leaderCharacterId,
      JSON.stringify(speech.audience), speech.venue, speech.occasion,
      speech.tone, speech.duration, JSON.stringify(speech.keyMessages),
      JSON.stringify(speech.expectedImpact), JSON.stringify(speech.simulationEffects),
      JSON.stringify(speech.publicReaction), JSON.stringify(speech.generationContext),
      speech.createdAt, speech.scheduledFor, speech.status, speech.priority
    ]);
  } catch (error) {
    console.error('Error storing speech:', error);
    throw error;
  }
}

/**
 * Get briefings from database
 */
async function getBriefings(
  campaignId: number, 
  leaderCharacterId: string, 
  type?: string, 
  limit: number = 10
): Promise<LeaderBriefing[]> {
  try {
    let query = 'SELECT * FROM leader_briefings WHERE campaign_id = $1 AND leader_character_id = $2';
    const params = [campaignId, leaderCharacterId];
    
    if (type) {
      query += ' AND type = $3';
      params.push(type);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
    params.push(limit);

    const result = await db.query(query, params);
    
    return result.rows.map(row => ({
      id: row.id,
      type: row.type,
      title: row.title,
      summary: row.summary,
      content: row.content,
      campaignId: row.campaign_id,
      tickId: row.tick_id,
      leaderCharacterId: row.leader_character_id,
      sections: JSON.parse(row.sections || '[]'),
      keyPoints: JSON.parse(row.key_points || '[]'),
      recommendations: JSON.parse(row.recommendations || '[]'),
      urgentMatters: JSON.parse(row.urgent_matters || '[]'),
      pendingDecisions: JSON.parse(row.pending_decisions || '[]'),
      advisorInputs: JSON.parse(row.advisor_inputs || '[]'),
      civilizationStatus: JSON.parse(row.civilization_status || '{}'),
      threatAssessment: JSON.parse(row.threat_assessment || '{}'),
      opportunityAnalysis: JSON.parse(row.opportunity_analysis || '{}'),
      generationContext: JSON.parse(row.generation_context || '{}'),
      createdAt: new Date(row.created_at),
      scheduledFor: row.scheduled_for ? new Date(row.scheduled_for) : undefined,
      deliveredAt: row.delivered_at ? new Date(row.delivered_at) : undefined,
      readAt: row.read_at ? new Date(row.read_at) : undefined,
      acknowledged: row.acknowledged,
      priority: row.priority,
      classification: row.classification
    }));
  } catch (error) {
    console.error('Error getting briefings:', error);
    return [];
  }
}

/**
 * Get speeches from database
 */
async function getSpeeches(
  campaignId: number, 
  leaderCharacterId: string, 
  type?: string, 
  limit: number = 10
): Promise<LeaderSpeech[]> {
  try {
    let query = 'SELECT * FROM leader_speeches WHERE campaign_id = $1 AND leader_character_id = $2';
    const params = [campaignId, leaderCharacterId];
    
    if (type) {
      query += ' AND type = $3';
      params.push(type);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
    params.push(limit);

    const result = await db.query(query, params);
    
    return result.rows.map(row => ({
      id: row.id,
      type: row.type,
      title: row.title,
      content: row.content,
      summary: row.summary,
      campaignId: row.campaign_id,
      tickId: row.tick_id,
      leaderCharacterId: row.leader_character_id,
      audience: JSON.parse(row.audience || '{}'),
      venue: row.venue,
      occasion: row.occasion,
      tone: row.tone,
      duration: row.duration,
      keyMessages: JSON.parse(row.key_messages || '[]'),
      expectedImpact: JSON.parse(row.expected_impact || '{}'),
      actualImpact: JSON.parse(row.actual_impact || '{}'),
      simulationEffects: JSON.parse(row.simulation_effects || '[]'),
      publicReaction: JSON.parse(row.public_reaction || '{}'),
      generationContext: JSON.parse(row.generation_context || '{}'),
      createdAt: new Date(row.created_at),
      scheduledFor: row.scheduled_for ? new Date(row.scheduled_for) : undefined,
      deliveredAt: row.delivered_at ? new Date(row.delivered_at) : undefined,
      status: row.status,
      priority: row.priority
    }));
  } catch (error) {
    console.error('Error getting speeches:', error);
    return [];
  }
}

/**
 * Get decisions from database
 */
async function getDecisions(
  campaignId: number, 
  category?: string, 
  urgency?: string, 
  status: string = 'pending', 
  limit: number = 20
): Promise<PendingDecision[]> {
  try {
    let query = 'SELECT * FROM pending_decisions WHERE campaign_id = $1 AND status = $2';
    const params = [campaignId, status];
    
    if (category) {
      query += ' AND category = $3';
      params.push(category);
    }
    
    if (urgency) {
      query += ' AND urgency = $' + (params.length + 1);
      params.push(urgency);
    }
    
    query += ' ORDER BY priority DESC, deadline ASC LIMIT $' + (params.length + 1);
    params.push(limit);

    const result = await db.query(query, params);
    
    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      urgency: row.urgency,
      background: row.background,
      stakeholders: JSON.parse(row.stakeholders || '[]'),
      constraints: JSON.parse(row.constraints || '[]'),
      options: JSON.parse(row.options || '[]'),
      recommendedOption: row.recommended_option,
      riskAssessment: JSON.parse(row.risk_assessment || '{}'),
      costBenefitAnalysis: JSON.parse(row.cost_benefit_analysis || '{}'),
      deadline: new Date(row.deadline),
      escalationDate: row.escalation_date ? new Date(row.escalation_date) : undefined,
      aiRecommendation: JSON.parse(row.ai_recommendation || '{}'),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      status: row.status,
      priority: row.priority
    }));
  } catch (error) {
    console.error('Error getting decisions:', error);
    return [];
  }
}

/**
 * Get briefing by ID
 */
async function getBriefingById(id: string): Promise<LeaderBriefing | null> {
  try {
    const result = await db.query('SELECT * FROM leader_briefings WHERE id = $1', [id]);
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id,
      type: row.type,
      title: row.title,
      summary: row.summary,
      content: row.content,
      campaignId: row.campaign_id,
      tickId: row.tick_id,
      leaderCharacterId: row.leader_character_id,
      sections: JSON.parse(row.sections || '[]'),
      keyPoints: JSON.parse(row.key_points || '[]'),
      recommendations: JSON.parse(row.recommendations || '[]'),
      urgentMatters: JSON.parse(row.urgent_matters || '[]'),
      pendingDecisions: JSON.parse(row.pending_decisions || '[]'),
      advisorInputs: JSON.parse(row.advisor_inputs || '[]'),
      civilizationStatus: JSON.parse(row.civilization_status || '{}'),
      threatAssessment: JSON.parse(row.threat_assessment || '{}'),
      opportunityAnalysis: JSON.parse(row.opportunity_analysis || '{}'),
      generationContext: JSON.parse(row.generation_context || '{}'),
      createdAt: new Date(row.created_at),
      scheduledFor: row.scheduled_for ? new Date(row.scheduled_for) : undefined,
      deliveredAt: row.delivered_at ? new Date(row.delivered_at) : undefined,
      readAt: row.read_at ? new Date(row.read_at) : undefined,
      acknowledged: row.acknowledged,
      priority: row.priority,
      classification: row.classification
    };
  } catch (error) {
    console.error('Error getting briefing by ID:', error);
    return null;
  }
}

/**
 * Get speech by ID
 */
async function getSpeechById(id: string): Promise<LeaderSpeech | null> {
  try {
    const result = await db.query('SELECT * FROM leader_speeches WHERE id = $1', [id]);
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id,
      type: row.type,
      title: row.title,
      content: row.content,
      summary: row.summary,
      campaignId: row.campaign_id,
      tickId: row.tick_id,
      leaderCharacterId: row.leader_character_id,
      audience: JSON.parse(row.audience || '{}'),
      venue: row.venue,
      occasion: row.occasion,
      tone: row.tone,
      duration: row.duration,
      keyMessages: JSON.parse(row.key_messages || '[]'),
      expectedImpact: JSON.parse(row.expected_impact || '{}'),
      actualImpact: JSON.parse(row.actual_impact || '{}'),
      simulationEffects: JSON.parse(row.simulation_effects || '[]'),
      publicReaction: JSON.parse(row.public_reaction || '{}'),
      generationContext: JSON.parse(row.generation_context || '{}'),
      createdAt: new Date(row.created_at),
      scheduledFor: row.scheduled_for ? new Date(row.scheduled_for) : undefined,
      deliveredAt: row.delivered_at ? new Date(row.delivered_at) : undefined,
      status: row.status,
      priority: row.priority
    };
  } catch (error) {
    console.error('Error getting speech by ID:', error);
    return null;
  }
}

/**
 * Get decision by ID
 */
async function getDecisionById(id: string): Promise<PendingDecision | null> {
  try {
    const result = await db.query('SELECT * FROM pending_decisions WHERE id = $1', [id]);
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      urgency: row.urgency,
      background: row.background,
      stakeholders: JSON.parse(row.stakeholders || '[]'),
      constraints: JSON.parse(row.constraints || '[]'),
      options: JSON.parse(row.options || '[]'),
      recommendedOption: row.recommended_option,
      riskAssessment: JSON.parse(row.risk_assessment || '{}'),
      costBenefitAnalysis: JSON.parse(row.cost_benefit_analysis || '{}'),
      deadline: new Date(row.deadline),
      escalationDate: row.escalation_date ? new Date(row.escalation_date) : undefined,
      aiRecommendation: JSON.parse(row.ai_recommendation || '{}'),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      status: row.status,
      priority: row.priority
    };
  } catch (error) {
    console.error('Error getting decision by ID:', error);
    return null;
  }
}

/**
 * Get leader communication analytics
 */
async function getLeaderCommunicationAnalytics(campaignId: number, timeframe: string): Promise<any> {
  try {
    const timeCondition = timeframe === '24h' ? "created_at >= NOW() - INTERVAL '1 day'" :
                         timeframe === '7d' ? "created_at >= NOW() - INTERVAL '7 days'" :
                         "created_at >= NOW() - INTERVAL '30 days'";

    const briefingQuery = `
      SELECT COUNT(*) as count, type, AVG(CASE WHEN acknowledged THEN 1 ELSE 0 END) as acknowledgment_rate
      FROM leader_briefings 
      WHERE campaign_id = $1 AND ${timeCondition}
      GROUP BY type
    `;

    const speechQuery = `
      SELECT COUNT(*) as count, type, AVG(duration) as avg_duration
      FROM leader_speeches 
      WHERE campaign_id = $1 AND ${timeCondition}
      GROUP BY type
    `;

    const decisionQuery = `
      SELECT COUNT(*) as count, category, status, AVG(priority) as avg_priority
      FROM pending_decisions 
      WHERE campaign_id = $1 AND ${timeCondition}
      GROUP BY category, status
    `;

    const [briefingResult, speechResult, decisionResult] = await Promise.all([
      db.query(briefingQuery, [campaignId]),
      db.query(speechQuery, [campaignId]),
      db.query(decisionQuery, [campaignId])
    ]);

    return {
      timeframe,
      briefings: {
        total: briefingResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
        byType: briefingResult.rows,
        averageAcknowledgmentRate: briefingResult.rows.reduce((sum, row) => sum + parseFloat(row.acknowledgment_rate), 0) / briefingResult.rows.length || 0
      },
      speeches: {
        total: speechResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
        byType: speechResult.rows,
        averageDuration: speechResult.rows.reduce((sum, row) => sum + parseFloat(row.avg_duration), 0) / speechResult.rows.length || 0
      },
      decisions: {
        total: decisionResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
        byCategory: decisionResult.rows,
        averagePriority: decisionResult.rows.reduce((sum, row) => sum + parseFloat(row.avg_priority), 0) / decisionResult.rows.length || 0
      }
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    return {
      timeframe,
      briefings: { total: 0, byType: [], averageAcknowledgmentRate: 0 },
      speeches: { total: 0, byType: [], averageDuration: 0 },
      decisions: { total: 0, byCategory: [], averagePriority: 0 }
    };
  }
}

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'leader-communications', leaderCommunicationsKnobSystem, applyLeaderCommunicationsKnobsToGameState);

export default router;
