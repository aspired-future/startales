/**
 * Legislative Override API Routes
 * 
 * REST API endpoints for the Legislative Override System,
 * allowing leaders to override legislative votes with political consequences.
 */

import { Router, Request, Response } from 'express';
import { LegislativeOverrideService } from './LegislativeOverrideService.js';
import { Pool } from 'pg';

export function createLegislativeOverrideRoutes(pool: Pool): Router {
  const router = Router();
  const overrideService = new LegislativeOverrideService(pool);

  /**
   * Analyze a potential legislative override
   * GET /api/legislature/override/analyze/:proposalId
   */
  router.get('/analyze/:proposalId', async (req: Request, res: Response) => {
    try {
      const proposalId = req.params.proposalId;
      const campaignId = parseInt(req.query.campaignId as string) || 1;
      const leaderCharacterId = req.query.leaderCharacterId as string || 'leader-1';
      const overrideType = req.query.overrideType as string || 'approve';

      if (!['approve', 'veto', 'modify'].includes(overrideType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid override type',
          message: 'Override type must be approve, veto, or modify'
        });
      }

      const analysis = await overrideService.analyzeOverride(
        proposalId,
        campaignId,
        leaderCharacterId,
        overrideType as 'approve' | 'veto' | 'modify'
      );

      res.json({
        success: true,
        data: {
          analysis,
          proposal: proposalId,
          overrideType,
          timestamp: new Date()
        },
        message: `Override analysis completed for ${overrideType} action`
      });
    } catch (error) {
      console.error('Error analyzing legislative override:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to analyze legislative override',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Execute a legislative override
   * POST /api/legislature/override/execute
   */
  router.post('/execute', async (req: Request, res: Response) => {
    try {
      const {
        proposalId,
        campaignId = 1,
        leaderCharacterId = 'leader-1',
        overrideDecision,
        overrideReason,
        overrideJustification,
        constitutionalBasis,
        legalPrecedent,
        modifications,
        implementationNotes
      } = req.body;

      // Validate required fields
      if (!proposalId || !overrideDecision || !overrideReason || !overrideJustification || !constitutionalBasis) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          required: ['proposalId', 'overrideDecision', 'overrideReason', 'overrideJustification', 'constitutionalBasis']
        });
      }

      const override = await overrideService.executeOverride({
        proposalId,
        campaignId: Number(campaignId),
        leaderCharacterId,
        overrideDecision,
        overrideReason,
        overrideJustification,
        constitutionalBasis,
        legalPrecedent,
        modifications,
        implementationNotes
      });

      res.json({
        success: true,
        data: override,
        message: `Legislative override executed: ${overrideDecision.toUpperCase()}`,
        politicalConsequences: {
          politicalCost: override.politicalCost,
          approvalImpact: override.publicApprovalImpact,
          partyImpacts: override.partyRelationsImpact
        }
      });
    } catch (error) {
      console.error('Error executing legislative override:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to execute legislative override',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Get all overrides by leader
   * GET /api/legislature/override/leader/:leaderCharacterId
   */
  router.get('/leader/:leaderCharacterId', async (req: Request, res: Response) => {
    try {
      const leaderCharacterId = req.params.leaderCharacterId;
      const campaignId = parseInt(req.query.campaignId as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const overrides = await overrideService.getOverridesByLeader(
        leaderCharacterId,
        campaignId,
        limit
      );

      res.json({
        success: true,
        data: overrides,
        message: `Retrieved ${overrides.length} legislative overrides`,
        summary: {
          total: overrides.length,
          byDecision: overrides.reduce((acc, override) => {
            acc[override.overrideDecision] = (acc[override.overrideDecision] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          byStatus: overrides.reduce((acc, override) => {
            acc[override.status] = (acc[override.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        }
      });
    } catch (error) {
      console.error('Error getting leader overrides:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve leader overrides',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Get specific override by ID
   * GET /api/legislature/override/:overrideId
   */
  router.get('/:overrideId', async (req: Request, res: Response) => {
    try {
      const overrideId = req.params.overrideId;
      const override = await overrideService.getOverrideById(overrideId);

      if (!override) {
        return res.status(404).json({
          success: false,
          error: 'Override not found',
          message: `No legislative override found with ID: ${overrideId}`
        });
      }

      res.json({
        success: true,
        data: override,
        message: 'Legislative override retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting override by ID:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve legislative override',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Challenge an override
   * POST /api/legislature/override/:overrideId/challenge
   */
  router.post('/:overrideId/challenge', async (req: Request, res: Response) => {
    try {
      const overrideId = req.params.overrideId;
      const { challenger, challengeReason } = req.body;

      if (!challenger || !challengeReason) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          required: ['challenger', 'challengeReason']
        });
      }

      const challengedOverride = await overrideService.challengeOverride(
        overrideId,
        challenger,
        challengeReason
      );

      res.json({
        success: true,
        data: challengedOverride,
        message: `Legislative override challenged by ${challenger}`,
        challenge: challengedOverride.challengeDetails
      });
    } catch (error) {
      console.error('Error challenging override:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to challenge legislative override',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Resolve a challenged override
   * POST /api/legislature/override/:overrideId/resolve
   */
  router.post('/:overrideId/resolve', async (req: Request, res: Response) => {
    try {
      const overrideId = req.params.overrideId;
      const { resolution, resolutionDetails } = req.body;

      if (!resolution || !resolutionDetails) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          required: ['resolution', 'resolutionDetails']
        });
      }

      if (!['upheld', 'reversed'].includes(resolution)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid resolution',
          message: 'Resolution must be either "upheld" or "reversed"'
        });
      }

      const resolvedOverride = await overrideService.resolveChallengedOverride(
        overrideId,
        resolution,
        resolutionDetails
      );

      res.json({
        success: true,
        data: resolvedOverride,
        message: `Legislative override challenge resolved: ${resolution.toUpperCase()}`,
        resolution: resolvedOverride.challengeDetails
      });
    } catch (error) {
      console.error('Error resolving override challenge:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resolve override challenge',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Get override statistics for a campaign
   * GET /api/legislature/override/stats/:campaignId
   */
  router.get('/stats/:campaignId', async (req: Request, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const timeframe = req.query.timeframe as string || '30d';

      // Calculate date range based on timeframe
      const now = new Date();
      let startDate: Date;
      
      switch (timeframe) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Get override statistics from database
      const statsQuery = `
        SELECT 
          COUNT(*) as total_overrides,
          COUNT(CASE WHEN override_decision = 'approve' THEN 1 END) as approvals,
          COUNT(CASE WHEN override_decision = 'veto' THEN 1 END) as vetoes,
          COUNT(CASE WHEN override_decision = 'modify' THEN 1 END) as modifications,
          COUNT(CASE WHEN status = 'challenged' THEN 1 END) as challenged,
          COUNT(CASE WHEN status = 'reversed' THEN 1 END) as reversed,
          AVG(political_cost) as avg_political_cost,
          AVG(public_approval_impact) as avg_approval_impact
        FROM legislative_overrides 
        WHERE campaign_id = $1 AND created_at >= $2
      `;

      const result = await pool.query(statsQuery, [campaignId, startDate]);
      const stats = result.rows[0];

      // Get recent overrides
      const recentQuery = `
        SELECT id, proposal_id, override_decision, override_reason, political_cost, 
               public_approval_impact, status, created_at
        FROM legislative_overrides 
        WHERE campaign_id = $1 AND created_at >= $2
        ORDER BY created_at DESC 
        LIMIT 10
      `;

      const recentResult = await pool.query(recentQuery, [campaignId, startDate]);

      res.json({
        success: true,
        data: {
          timeframe,
          statistics: {
            totalOverrides: parseInt(stats.total_overrides) || 0,
            byDecision: {
              approve: parseInt(stats.approvals) || 0,
              veto: parseInt(stats.vetoes) || 0,
              modify: parseInt(stats.modifications) || 0
            },
            byStatus: {
              challenged: parseInt(stats.challenged) || 0,
              reversed: parseInt(stats.reversed) || 0
            },
            averages: {
              politicalCost: parseFloat(stats.avg_political_cost) || 0,
              approvalImpact: parseFloat(stats.avg_approval_impact) || 0
            }
          },
          recentOverrides: recentResult.rows
        },
        message: `Override statistics for ${timeframe} timeframe`
      });
    } catch (error) {
      console.error('Error getting override statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve override statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Get proposals eligible for override
   * GET /api/legislature/override/eligible/:campaignId
   */
  router.get('/eligible/:campaignId', async (req: Request, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const status = req.query.status as string;

      let whereClause = 'WHERE campaign_id = $1 AND status IN (\'passed\', \'failed\', \'leader_review\')';
      const params = [campaignId];

      if (status && ['passed', 'failed', 'leader_review'].includes(status)) {
        whereClause = 'WHERE campaign_id = $1 AND status = $2';
        params.push(status);
      }

      // Get eligible proposals that don't already have active overrides
      const query = `
        SELECT p.*, 
               v.vote_result, v.votes_for, v.votes_against, v.total_votes,
               CASE WHEN o.id IS NOT NULL THEN TRUE ELSE FALSE END as has_override
        FROM legislative_proposals p
        LEFT JOIN (
          SELECT DISTINCT ON (proposal_id) proposal_id, vote_result, votes_for, votes_against, total_votes
          FROM legislative_votes 
          ORDER BY proposal_id, vote_date DESC
        ) v ON p.id = v.proposal_id
        LEFT JOIN legislative_overrides o ON p.id = o.proposal_id AND o.status IN ('active', 'challenged')
        ${whereClause}
        AND o.id IS NULL
        ORDER BY p.created_at DESC
        LIMIT 50
      `;

      const result = await pool.query(query, params);

      res.json({
        success: true,
        data: result.rows,
        message: `Retrieved ${result.rows.length} proposals eligible for override`,
        eligibilityCriteria: {
          statuses: ['passed', 'failed', 'leader_review'],
          excludes: 'Proposals with active or challenged overrides'
        }
      });
    } catch (error) {
      console.error('Error getting eligible proposals:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve eligible proposals',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
}
