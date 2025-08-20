import express from 'express';
import { getPool } from '../storage/db.js';
import { LegislativeBodiesAdvisoryService } from './LegislativeBodiesAdvisoryService.js';

const router = express.Router();

// Initialize service
const getLegislatureService = () => new LegislativeBodiesAdvisoryService(getPool());

// ===== LEGISLATIVE PROPOSAL MANAGEMENT =====

/**
 * POST /api/legislature/proposals - Create legislative proposal
 */
router.post('/proposals', async (req, res) => {
  try {
    const service = getLegislatureService();
    const {
      campaignId,
      proposalType,
      proposalTitle,
      proposalSummary,
      fullText,
      policyCategory,
      sponsorParty,
      coSponsors,
      committeeAssignment,
      constitutionalAnalysis,
      impactAssessment,
      fiscalImpact,
      implementationTimeline,
      publicSupportEstimate,
      urgencyLevel
    } = req.body;

    if (!campaignId || !proposalType || !proposalTitle || !proposalSummary || 
        !fullText || !policyCategory || !sponsorParty || !impactAssessment || !urgencyLevel) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: [
          'campaignId', 'proposalType', 'proposalTitle', 'proposalSummary',
          'fullText', 'policyCategory', 'sponsorParty', 'impactAssessment', 'urgencyLevel'
        ]
      });
    }

    const proposal = await service.createLegislativeProposal({
      campaignId: Number(campaignId),
      proposalType,
      proposalTitle,
      proposalSummary,
      fullText,
      policyCategory,
      sponsorParty,
      coSponsors,
      committeeAssignment,
      constitutionalAnalysis,
      impactAssessment,
      fiscalImpact,
      implementationTimeline,
      publicSupportEstimate: publicSupportEstimate ? Number(publicSupportEstimate) : undefined,
      urgencyLevel
    });

    res.json({
      success: true,
      proposal,
      message: `Legislative proposal "${proposalTitle}" created successfully`
    });
  } catch (error) {
    console.error('Error creating legislative proposal:', error);
    res.status(500).json({
      error: 'Failed to create legislative proposal',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/legislature/proposals - List legislative proposals
 */
router.get('/proposals', async (req, res) => {
  try {
    const service = getLegislatureService();
    const { 
      campaignId, proposalType, policyCategory, status, urgencyLevel, sponsorParty, limit 
    } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const proposals = await service.getLegislativeProposals(Number(campaignId), {
      proposalType: proposalType as string,
      policyCategory: policyCategory as string,
      status: status as string,
      urgencyLevel: urgencyLevel as string,
      sponsorParty: sponsorParty as string,
      limit: limit ? Number(limit) : undefined
    });

    res.json({
      success: true,
      proposals,
      count: proposals.length
    });
  } catch (error) {
    console.error('Error fetching legislative proposals:', error);
    res.status(500).json({
      error: 'Failed to fetch legislative proposals',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/legislature/proposals/:id/leader-response - Leader response to proposal
 */
router.put('/proposals/:id/leader-response', async (req, res) => {
  try {
    const service = getLegislatureService();
    const { id } = req.params;
    const { leaderDecision, leaderResponse, leaderModifications } = req.body;

    if (!leaderDecision || !leaderResponse) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['leaderDecision', 'leaderResponse']
      });
    }

    if (!['approve', 'modify', 'veto', 'defer'].includes(leaderDecision)) {
      return res.status(400).json({
        error: 'Invalid leader decision',
        validOptions: ['approve', 'modify', 'veto', 'defer']
      });
    }

    const proposal = await service.respondToLegislativeProposal(
      id,
      leaderDecision,
      leaderResponse,
      leaderModifications
    );

    res.json({
      success: true,
      proposal,
      message: `Leader response recorded: ${leaderDecision}`
    });
  } catch (error) {
    console.error('Error recording leader response:', error);
    res.status(500).json({
      error: 'Failed to record leader response',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== POLITICAL PARTY MANAGEMENT =====

/**
 * GET /api/legislature/parties - List political parties
 */
router.get('/parties', async (req, res) => {
  try {
    const service = getLegislatureService();
    const { campaignId, ideology } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const parties = await service.getPoliticalParties(
      Number(campaignId),
      ideology as string
    );

    res.json({
      success: true,
      parties,
      count: parties.length
    });
  } catch (error) {
    console.error('Error fetching political parties:', error);
    res.status(500).json({
      error: 'Failed to fetch political parties',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/legislature/parties/:id - Get party details
 */
router.get('/parties/:id', async (req, res) => {
  try {
    const service = getLegislatureService();
    const { id } = req.params;

    const party = await service.getPoliticalPartyById(id);

    if (!party) {
      return res.status(404).json({
        error: 'Political party not found'
      });
    }

    res.json({
      success: true,
      party
    });
  } catch (error) {
    console.error('Error fetching political party:', error);
    res.status(500).json({
      error: 'Failed to fetch political party',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/legislature/parties/:id/position - Update party position
 */
router.post('/parties/:id/position', async (req, res) => {
  try {
    const service = getLegislatureService();
    const { id } = req.params;
    const { issue, position, statement } = req.body;

    if (!issue || !position || !statement) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['issue', 'position', 'statement']
      });
    }

    const party = await service.updatePartyPosition(id, issue, position, statement);

    res.json({
      success: true,
      party,
      message: `Party position on "${issue}" updated successfully`
    });
  } catch (error) {
    console.error('Error updating party position:', error);
    res.status(500).json({
      error: 'Failed to update party position',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== VOTING SYSTEM =====

/**
 * POST /api/legislature/votes - Conduct legislative vote
 */
router.post('/votes', async (req, res) => {
  try {
    const service = getLegislatureService();
    const { proposalId, campaignId, voteType, requiredMajority, partyVotes } = req.body;

    if (!proposalId || !campaignId || !voteType || !requiredMajority || !partyVotes) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['proposalId', 'campaignId', 'voteType', 'requiredMajority', 'partyVotes']
      });
    }

    const vote = await service.conductLegislativeVote({
      proposalId,
      campaignId: Number(campaignId),
      voteType,
      requiredMajority,
      partyVotes
    });

    res.json({
      success: true,
      vote,
      message: `Legislative vote conducted: ${vote.voteResult}`
    });
  } catch (error) {
    console.error('Error conducting legislative vote:', error);
    res.status(500).json({
      error: 'Failed to conduct legislative vote',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/legislature/votes/history/:proposalId - Get voting history
 */
router.get('/votes/history/:proposalId', async (req, res) => {
  try {
    const service = getLegislatureService();
    const { proposalId } = req.params;

    const votes = await service.getVotingHistory(proposalId);

    res.json({
      success: true,
      votes,
      count: votes.length
    });
  } catch (error) {
    console.error('Error fetching voting history:', error);
    res.status(500).json({
      error: 'Failed to fetch voting history',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== COMMITTEE SYSTEM =====

/**
 * GET /api/legislature/committees - List legislative committees
 */
router.get('/committees', async (req, res) => {
  try {
    const service = getLegislatureService();
    const { campaignId, committeeType } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const committees = await service.getLegislativeCommittees(
      Number(campaignId),
      committeeType as string
    );

    res.json({
      success: true,
      committees,
      count: committees.length
    });
  } catch (error) {
    console.error('Error fetching legislative committees:', error);
    res.status(500).json({
      error: 'Failed to fetch legislative committees',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/legislature/committees/assign - Assign proposal to committee
 */
router.post('/committees/assign', async (req, res) => {
  try {
    const service = getLegislatureService();
    const { proposalId, committeeName } = req.body;

    if (!proposalId || !committeeName) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['proposalId', 'committeeName']
      });
    }

    await service.assignProposalToCommittee(proposalId, committeeName);

    res.json({
      success: true,
      message: `Proposal assigned to ${committeeName} successfully`
    });
  } catch (error) {
    console.error('Error assigning proposal to committee:', error);
    res.status(500).json({
      error: 'Failed to assign proposal to committee',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== SESSION MANAGEMENT =====

/**
 * POST /api/legislature/sessions - Schedule legislative session
 */
router.post('/sessions', async (req, res) => {
  try {
    const service = getLegislatureService();
    const {
      campaignId,
      sessionType,
      sessionTitle,
      sessionDescription,
      scheduledDate,
      durationMinutes,
      agendaItems,
      publicAccess,
      mediaCoverage
    } = req.body;

    if (!campaignId || !sessionType || !sessionTitle || !scheduledDate || !agendaItems) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'sessionType', 'sessionTitle', 'scheduledDate', 'agendaItems']
      });
    }

    const session = await service.scheduleLegislativeSession({
      campaignId: Number(campaignId),
      sessionType,
      sessionTitle,
      sessionDescription,
      scheduledDate: new Date(scheduledDate),
      durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
      agendaItems,
      publicAccess,
      mediaCoverage
    });

    res.json({
      success: true,
      session,
      message: `Legislative session "${sessionTitle}" scheduled successfully`
    });
  } catch (error) {
    console.error('Error scheduling legislative session:', error);
    res.status(500).json({
      error: 'Failed to schedule legislative session',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/legislature/sessions/upcoming - Get upcoming sessions
 */
router.get('/sessions/upcoming', async (req, res) => {
  try {
    const service = getLegislatureService();
    const { campaignId, limit } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const sessions = await service.getUpcomingSessions(
      Number(campaignId),
      limit ? Number(limit) : 10
    );

    res.json({
      success: true,
      sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error);
    res.status(500).json({
      error: 'Failed to fetch upcoming sessions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== LEADER INTERACTION MANAGEMENT =====

/**
 * POST /api/legislature/interactions - Record leader interaction
 */
router.post('/interactions', async (req, res) => {
  try {
    const service = getLegislatureService();
    const {
      campaignId,
      interactionType,
      interactionSummary,
      proposalId,
      leaderPosition,
      legislativeResponse,
      discussionPoints,
      agreementsReached,
      disagreements,
      compromiseSolutions,
      interactionOutcome,
      publicDisclosure
    } = req.body;

    if (!campaignId || !interactionType || !interactionSummary || 
        !leaderPosition || !interactionOutcome) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: [
          'campaignId', 'interactionType', 'interactionSummary',
          'leaderPosition', 'interactionOutcome'
        ]
      });
    }

    const interaction = await service.recordLeaderInteraction({
      campaignId: Number(campaignId),
      interactionType,
      interactionSummary,
      proposalId,
      leaderPosition,
      legislativeResponse,
      discussionPoints,
      agreementsReached,
      disagreements,
      compromiseSolutions,
      interactionOutcome,
      publicDisclosure
    });

    res.json({
      success: true,
      interaction,
      message: 'Leader-legislative interaction recorded successfully'
    });
  } catch (error) {
    console.error('Error recording leader interaction:', error);
    res.status(500).json({
      error: 'Failed to record leader interaction',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/legislature/interactions/recent - Get recent interactions
 */
router.get('/interactions/recent', async (req, res) => {
  try {
    const service = getLegislatureService();
    const { campaignId, limit } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const interactions = await service.getRecentLeaderInteractions(
      Number(campaignId),
      limit ? Number(limit) : 10
    );

    res.json({
      success: true,
      interactions,
      count: interactions.length
    });
  } catch (error) {
    console.error('Error fetching recent interactions:', error);
    res.status(500).json({
      error: 'Failed to fetch recent interactions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== ANALYTICS & DASHBOARD =====

/**
 * GET /api/legislature/analytics - Legislative analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    const service = getLegislatureService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const analytics = await service.getLatestLegislativeAnalytics(Number(campaignId));

    res.json({
      success: true,
      analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching legislative analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch legislative analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/legislature/analytics/update - Update analytics
 */
router.post('/analytics/update', async (req, res) => {
  try {
    const service = getLegislatureService();
    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const analytics = await service.updateLegislativeAnalytics(Number(campaignId));

    res.json({
      success: true,
      analytics,
      message: 'Legislative analytics updated successfully'
    });
  } catch (error) {
    console.error('Error updating legislative analytics:', error);
    res.status(500).json({
      error: 'Failed to update legislative analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/legislature/dashboard - Legislative dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    const service = getLegislatureService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const dashboard = await service.getLegislativeDashboard(Number(campaignId));

    res.json({
      success: true,
      dashboard,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching legislative dashboard:', error);
    res.status(500).json({
      error: 'Failed to fetch legislative dashboard',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
