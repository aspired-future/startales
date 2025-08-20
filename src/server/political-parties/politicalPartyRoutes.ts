import express from 'express';
import { getPool } from '../storage/db.js';
import { PoliticalPartySystemService } from './PoliticalPartySystemService.js';

const router = express.Router();

// Initialize service
const getPoliticalPartyService = () => new PoliticalPartySystemService(getPool());

// ===== ENHANCED PARTY MANAGEMENT =====

/**
 * GET /api/political-parties/enhanced - Get comprehensive party profiles
 */
router.get('/enhanced', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const parties = await service.getEnhancedPoliticalParties(Number(campaignId));

    res.json({
      success: true,
      parties,
      count: parties.length
    });
  } catch (error) {
    console.error('Error fetching enhanced political parties:', error);
    res.status(500).json({
      error: 'Failed to fetch enhanced political parties',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/political-parties/:id/backstory - Update party backstory
 */
router.put('/:id/backstory', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { id } = req.params;
    const { backstory, historicalEvents } = req.body;

    if (!backstory) {
      return res.status(400).json({
        error: 'Missing required field: backstory'
      });
    }

    const party = await service.updatePartyBackstory(id, backstory, historicalEvents);

    res.json({
      success: true,
      party,
      message: 'Party backstory updated successfully'
    });
  } catch (error) {
    console.error('Error updating party backstory:', error);
    res.status(500).json({
      error: 'Failed to update party backstory',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/political-parties/:id/demographics - Get party demographics
 */
router.get('/:id/demographics', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { id } = req.params;

    const demographics = await service.getPartyDemographics(id);

    res.json({
      success: true,
      demographics
    });
  } catch (error) {
    console.error('Error fetching party demographics:', error);
    res.status(500).json({
      error: 'Failed to fetch party demographics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== PARTY LEADERSHIP MANAGEMENT =====

/**
 * GET /api/political-parties/leadership - Get party leadership
 */
router.get('/leadership', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { campaignId, partyId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const leadership = await service.getPartyLeadership(
      Number(campaignId),
      partyId as string
    );

    res.json({
      success: true,
      leadership,
      count: leadership.length
    });
  } catch (error) {
    console.error('Error fetching party leadership:', error);
    res.status(500).json({
      error: 'Failed to fetch party leadership',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/political-parties/:id/leadership - Manage party leadership
 */
router.post('/:id/leadership', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { id } = req.params;
    const {
      campaignId,
      leadershipPosition,
      leaderName,
      appointmentDate,
      leadershipStyle,
      approvalRating,
      specialization,
      politicalBackground,
      leadershipPriorities
    } = req.body;

    if (!campaignId || !leadershipPosition || !leaderName || !appointmentDate || !leadershipStyle) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'leadershipPosition', 'leaderName', 'appointmentDate', 'leadershipStyle']
      });
    }

    const leadership = await service.managePartyLeadership({
      campaignId: Number(campaignId),
      partyId: id,
      leadershipPosition,
      leaderName,
      appointmentDate: new Date(appointmentDate),
      leadershipStyle,
      approvalRating,
      specialization,
      politicalBackground,
      leadershipPriorities
    });

    res.json({
      success: true,
      leadership,
      message: 'Party leadership updated successfully'
    });
  } catch (error) {
    console.error('Error managing party leadership:', error);
    res.status(500).json({
      error: 'Failed to manage party leadership',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== POLICY POSITION MANAGEMENT =====

/**
 * GET /api/political-parties/policy-positions - Get party policy positions
 */
router.get('/policy-positions', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { campaignId, partyId, policyArea } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const positions = await service.getPartyPolicyPositions(
      Number(campaignId),
      partyId as string,
      policyArea as string
    );

    res.json({
      success: true,
      positions,
      count: positions.length
    });
  } catch (error) {
    console.error('Error fetching party policy positions:', error);
    res.status(500).json({
      error: 'Failed to fetch party policy positions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/political-parties/:id/policy-positions - Create policy position
 */
router.post('/:id/policy-positions', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { id } = req.params;
    const {
      campaignId,
      policyArea,
      policyTopic,
      positionSummary,
      detailedPosition,
      positionStrength,
      flexibilityLevel,
      publicMessaging,
      supportingArguments
    } = req.body;

    if (!campaignId || !policyArea || !policyTopic || !positionSummary || 
        !detailedPosition || !positionStrength || !flexibilityLevel) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: [
          'campaignId', 'policyArea', 'policyTopic', 'positionSummary',
          'detailedPosition', 'positionStrength', 'flexibilityLevel'
        ]
      });
    }

    const position = await service.createPolicyPosition({
      campaignId: Number(campaignId),
      partyId: id,
      policyArea,
      policyTopic,
      positionSummary,
      detailedPosition,
      positionStrength,
      flexibilityLevel,
      publicMessaging,
      supportingArguments
    });

    res.json({
      success: true,
      position,
      message: 'Policy position created successfully'
    });
  } catch (error) {
    console.error('Error creating policy position:', error);
    res.status(500).json({
      error: 'Failed to create policy position',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/political-parties/policy-positions/:positionId - Update policy position
 */
router.put('/policy-positions/:positionId', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { positionId } = req.params;
    const { evolutionReason, ...updates } = req.body;

    const position = await service.updatePolicyPosition(
      positionId,
      updates,
      evolutionReason
    );

    res.json({
      success: true,
      position,
      message: 'Policy position updated successfully'
    });
  } catch (error) {
    console.error('Error updating policy position:', error);
    res.status(500).json({
      error: 'Failed to update policy position',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/political-parties/policy-comparison - Compare policy positions
 */
router.get('/policy-comparison', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { campaignId, policyArea, policyTopic } = req.query;

    if (!campaignId || !policyArea || !policyTopic) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['campaignId', 'policyArea', 'policyTopic']
      });
    }

    const comparison = await service.comparePolicyPositions(
      Number(campaignId),
      policyArea as string,
      policyTopic as string
    );

    res.json({
      success: true,
      comparison
    });
  } catch (error) {
    console.error('Error comparing policy positions:', error);
    res.status(500).json({
      error: 'Failed to compare policy positions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== WITTER INTEGRATION =====

/**
 * POST /api/political-parties/:id/witter-post - Create party Witter post
 */
router.post('/:id/witter-post', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { id } = req.params;
    const {
      campaignId,
      accountType,
      accountHandle,
      postType,
      postContent,
      hashtags,
      mentions,
      politicalContext,
      messagingStrategy
    } = req.body;

    if (!campaignId || !accountType || !accountHandle || !postType || !postContent) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'accountType', 'accountHandle', 'postType', 'postContent']
      });
    }

    const post = await service.createPartyWitterPost({
      campaignId: Number(campaignId),
      partyId: id,
      accountType,
      accountHandle,
      postType,
      postContent,
      hashtags,
      mentions,
      politicalContext,
      messagingStrategy
    });

    res.json({
      success: true,
      post,
      message: 'Party Witter post created successfully'
    });
  } catch (error) {
    console.error('Error creating party Witter post:', error);
    res.status(500).json({
      error: 'Failed to create party Witter post',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/political-parties/witter-activity - Get recent political Witter activity
 */
router.get('/witter-activity', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { campaignId, limit } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const activity = await service.getRecentPoliticalWitterActivity(
      Number(campaignId),
      limit ? Number(limit) : 20
    );

    res.json({
      success: true,
      activity,
      count: activity.length
    });
  } catch (error) {
    console.error('Error fetching political Witter activity:', error);
    res.status(500).json({
      error: 'Failed to fetch political Witter activity',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/political-parties/:id/rapid-response - Create rapid response
 */
router.post('/:id/rapid-response', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { id } = req.params;
    const { campaignId, eventDescription, responseContent, hashtags } = req.body;

    if (!campaignId || !eventDescription || !responseContent) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'eventDescription', 'responseContent']
      });
    }

    const response = await service.createRapidResponse(
      Number(campaignId),
      id,
      eventDescription,
      responseContent,
      hashtags
    );

    res.json({
      success: true,
      response,
      message: 'Rapid response created successfully'
    });
  } catch (error) {
    console.error('Error creating rapid response:', error);
    res.status(500).json({
      error: 'Failed to create rapid response',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== ELECTORAL PERFORMANCE =====

/**
 * POST /api/political-parties/:id/electoral-performance - Record electoral performance
 */
router.post('/:id/electoral-performance', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { id } = req.params;
    const {
      campaignId,
      electionType,
      electionDate,
      voteShare,
      seatsWon,
      seatsContested,
      voterTurnoutImpact,
      demographicPerformance,
      geographicPerformance,
      issuePerformance,
      campaignSpending,
      campaignStrategy,
      electionOutcome,
      postElectionAnalysis
    } = req.body;

    if (!campaignId || !electionType || !electionDate || voteShare === undefined || 
        seatsWon === undefined || seatsContested === undefined || !electionOutcome) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: [
          'campaignId', 'electionType', 'electionDate', 'voteShare',
          'seatsWon', 'seatsContested', 'electionOutcome'
        ]
      });
    }

    const performance = await service.recordElectoralPerformance({
      campaignId: Number(campaignId),
      partyId: id,
      electionType,
      electionDate: new Date(electionDate),
      voteShare: Number(voteShare),
      seatsWon: Number(seatsWon),
      seatsContested: Number(seatsContested),
      voterTurnoutImpact,
      demographicPerformance,
      geographicPerformance,
      issuePerformance,
      campaignSpending,
      campaignStrategy,
      electionOutcome,
      postElectionAnalysis
    });

    res.json({
      success: true,
      performance,
      message: 'Electoral performance recorded successfully'
    });
  } catch (error) {
    console.error('Error recording electoral performance:', error);
    res.status(500).json({
      error: 'Failed to record electoral performance',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/political-parties/electoral-trends - Get electoral trends
 */
router.get('/electoral-trends', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { campaignId, partyId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const trends = await service.getElectoralTrends(
      Number(campaignId),
      partyId as string
    );

    res.json({
      success: true,
      trends
    });
  } catch (error) {
    console.error('Error fetching electoral trends:', error);
    res.status(500).json({
      error: 'Failed to fetch electoral trends',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== COALITION MANAGEMENT =====

/**
 * POST /api/political-parties/coalitions - Create coalition
 */
router.post('/coalitions', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const {
      campaignId,
      coalitionName,
      coalitionType,
      memberParties,
      coalitionAgreement,
      policyPriorities,
      leadershipStructure,
      expectedDuration
    } = req.body;

    if (!campaignId || !coalitionName || !coalitionType || !memberParties || memberParties.length === 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'coalitionName', 'coalitionType', 'memberParties']
      });
    }

    const coalition = await service.createCoalition({
      campaignId: Number(campaignId),
      coalitionName,
      coalitionType,
      memberParties,
      coalitionAgreement,
      policyPriorities,
      leadershipStructure,
      expectedDuration
    });

    res.json({
      success: true,
      coalition,
      message: 'Coalition created successfully'
    });
  } catch (error) {
    console.error('Error creating coalition:', error);
    res.status(500).json({
      error: 'Failed to create coalition',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/political-parties/coalitions/active - Get active coalitions
 */
router.get('/coalitions/active', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const coalitions = await service.getActiveCoalitions(Number(campaignId));

    res.json({
      success: true,
      coalitions,
      count: coalitions.length
    });
  } catch (error) {
    console.error('Error fetching active coalitions:', error);
    res.status(500).json({
      error: 'Failed to fetch active coalitions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/political-parties/coalitions/:id - Update coalition status
 */
router.put('/coalitions/:id', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { id } = req.params;
    const { status, statusReason } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'Missing required field: status'
      });
    }

    if (!['forming', 'active', 'strained', 'dissolved'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        validOptions: ['forming', 'active', 'strained', 'dissolved']
      });
    }

    const coalition = await service.updateCoalitionStatus(id, status, statusReason);

    res.json({
      success: true,
      coalition,
      message: `Coalition status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating coalition status:', error);
    res.status(500).json({
      error: 'Failed to update coalition status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== PARTY EVENTS =====

/**
 * POST /api/political-parties/:id/events - Create party event
 */
router.post('/:id/events', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { id } = req.params;
    const {
      campaignId,
      eventType,
      eventTitle,
      eventDescription,
      eventDate,
      location,
      expectedAttendance,
      keySpeakers,
      eventAgenda,
      mediaCoverage,
      witterCoverage
    } = req.body;

    if (!campaignId || !eventType || !eventTitle || !eventDate) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'eventType', 'eventTitle', 'eventDate']
      });
    }

    const event = await service.createPartyEvent({
      campaignId: Number(campaignId),
      partyId: id,
      eventType,
      eventTitle,
      eventDescription,
      eventDate: new Date(eventDate),
      location,
      expectedAttendance,
      keySpeakers,
      eventAgenda,
      mediaCoverage,
      witterCoverage
    });

    res.json({
      success: true,
      event,
      message: 'Party event created successfully'
    });
  } catch (error) {
    console.error('Error creating party event:', error);
    res.status(500).json({
      error: 'Failed to create party event',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/political-parties/events/upcoming - Get upcoming events
 */
router.get('/events/upcoming', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { campaignId, limit } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const events = await service.getUpcomingPartyEvents(
      Number(campaignId),
      limit ? Number(limit) : 10
    );

    res.json({
      success: true,
      events,
      count: events.length
    });
  } catch (error) {
    console.error('Error fetching upcoming party events:', error);
    res.status(500).json({
      error: 'Failed to fetch upcoming party events',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== DASHBOARD & ANALYTICS =====

/**
 * GET /api/political-parties/dashboard - Get political party dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    const service = getPoliticalPartyService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const dashboard = await service.getPoliticalPartyDashboard(Number(campaignId));

    res.json({
      success: true,
      dashboard,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching political party dashboard:', error);
    res.status(500).json({
      error: 'Failed to fetch political party dashboard',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
