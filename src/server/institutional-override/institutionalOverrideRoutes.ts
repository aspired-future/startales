/**
 * Institutional Override API Routes
 * 
 * REST API endpoints for the comprehensive Institutional Override System,
 * allowing leaders to override decisions from Legislature, Central Bank, and Supreme Court.
 */

import { Router, Request, Response } from 'express';
import { InstitutionalOverrideService } from './InstitutionalOverrideService';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';
import { Pool } from 'pg';

export function createInstitutionalOverrideRoutes(pool: Pool): Router {
  const router = Router();
  const overrideService = new InstitutionalOverrideService(pool);

  // Enhanced AI Knobs for Institutional Override System
  const institutionalOverrideKnobsData = {
    // Override Analysis & Decision Making
    override_analysis_sophistication: 0.85,      // Override analysis sophistication and depth
    constitutional_analysis_rigor: 0.90,         // Constitutional analysis rigor and thoroughness
    political_consequence_modeling: 0.80,        // Political consequence modeling accuracy
    
    // Institutional Balance & Separation of Powers
    separation_of_powers_sensitivity: 0.85,      // Separation of powers sensitivity and protection
    institutional_independence_weighting: 0.80,  // Institutional independence consideration weight
    democratic_balance_preservation: 0.85,       // Democratic balance preservation priority
    
    // Risk Assessment & Mitigation
    constitutional_crisis_prevention: 0.90,      // Constitutional crisis prevention emphasis
    rule_of_law_protection: 0.88,               // Rule of law protection priority
    institutional_trust_preservation: 0.82,      // Institutional trust preservation weight
    
    // Political Cost & Benefit Analysis
    political_capital_optimization: 0.75,        // Political capital optimization and efficiency
    public_support_analysis_accuracy: 0.80,      // Public support analysis accuracy
    party_relationship_impact_modeling: 0.78,    // Party relationship impact modeling precision
    
    // Challenge & Opposition Management
    override_challenge_anticipation: 0.83,       // Override challenge anticipation capability
    legal_defense_preparation: 0.85,             // Legal defense preparation thoroughness
    opposition_response_prediction: 0.77,        // Opposition response prediction accuracy
    
    // Institution-Specific Considerations
    legislative_override_expertise: 0.80,        // Legislative override analysis expertise
    central_bank_override_caution: 0.90,         // Central bank override caution and economic impact
    supreme_court_override_restraint: 0.95,      // Supreme court override restraint and constitutional respect
    
    // Temporal & Strategic Factors
    override_timing_optimization: 0.75,          // Override timing optimization for maximum effectiveness
    long_term_consequence_analysis: 0.82,        // Long-term consequence analysis depth
    precedent_setting_awareness: 0.87,           // Precedent setting awareness and consideration
    
    // Public Communication & Justification
    override_justification_quality: 0.83,        // Override justification quality and persuasiveness
    constitutional_basis_articulation: 0.88,     // Constitutional basis articulation clarity
    public_communication_effectiveness: 0.78,    // Public communication effectiveness for overrides
    
    lastUpdated: Date.now()
  };

  // Initialize Enhanced Knob System
  const institutionalOverrideKnobSystem = new EnhancedKnobSystem(institutionalOverrideKnobsData);

  // Apply institutional override knobs to game state
  function applyInstitutionalOverrideKnobsToGameState() {
    const knobs = institutionalOverrideKnobSystem.knobs;
    
    // Apply override analysis settings
    const overrideAnalysis = (knobs.override_analysis_sophistication + knobs.constitutional_analysis_rigor + 
      knobs.political_consequence_modeling) / 3;
    
    // Apply institutional balance settings
    const institutionalBalance = (knobs.separation_of_powers_sensitivity + knobs.institutional_independence_weighting + 
      knobs.democratic_balance_preservation) / 3;
    
    // Apply risk management settings
    const riskManagement = (knobs.constitutional_crisis_prevention + knobs.rule_of_law_protection + 
      knobs.institutional_trust_preservation) / 3;
    
    // Apply institution-specific settings
    const institutionSpecific = (knobs.legislative_override_expertise + knobs.central_bank_override_caution + 
      knobs.supreme_court_override_restraint) / 3;
    
    console.log('Applied institutional override knobs to game state:', {
      overrideAnalysis,
      institutionalBalance,
      riskManagement,
      institutionSpecific
    });
  }

  /**
   * Analyze a potential institutional override
   * GET /api/institutional-override/analyze/:institutionType/:decisionId
   */
  router.get('/analyze/:institutionType/:decisionId', async (req: Request, res: Response) => {
    try {
      const institutionType = req.params.institutionType as 'legislature' | 'central_bank' | 'supreme_court';
      const decisionId = req.params.decisionId;
      const campaignId = parseInt(req.query.campaignId as string) || 1;
      const leaderCharacterId = req.query.leaderCharacterId as string || 'leader-1';
      const overrideType = req.query.overrideType as string || 'approve';

      if (!['legislature', 'central_bank', 'supreme_court'].includes(institutionType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid institution type',
          message: 'Institution type must be legislature, central_bank, or supreme_court'
        });
      }

      if (!['approve', 'reject', 'modify', 'suspend'].includes(overrideType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid override type',
          message: 'Override type must be approve, reject, modify, or suspend'
        });
      }

      const analysis = await overrideService.analyzeOverride(
        institutionType,
        decisionId,
        campaignId,
        leaderCharacterId,
        overrideType as any
      );

      res.json({
        success: true,
        data: {
          analysis,
          institution: institutionType,
          decision: decisionId,
          overrideType,
          timestamp: new Date()
        },
        message: `Override analysis completed for ${institutionType} ${overrideType} action`
      });
    } catch (error) {
      console.error('Error analyzing institutional override:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to analyze institutional override',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Execute an institutional override
   * POST /api/institutional-override/execute
   */
  router.post('/execute', async (req: Request, res: Response) => {
    try {
      const {
        institutionType,
        targetDecisionId,
        campaignId = 1,
        leaderCharacterId = 'leader-1',
        overrideDecision,
        overrideReason,
        overrideJustification,
        constitutionalBasis,
        legalPrecedent,
        modifications,
        implementationNotes,
        temporaryDuration
      } = req.body;

      // Validate required fields
      if (!institutionType || !targetDecisionId || !overrideDecision || !overrideReason || !overrideJustification || !constitutionalBasis) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          required: ['institutionType', 'targetDecisionId', 'overrideDecision', 'overrideReason', 'overrideJustification', 'constitutionalBasis']
        });
      }

      const override = await overrideService.executeOverride({
        institutionType,
        targetDecisionId,
        campaignId: Number(campaignId),
        leaderCharacterId,
        overrideDecision,
        overrideReason,
        overrideJustification,
        constitutionalBasis,
        legalPrecedent,
        modifications,
        implementationNotes,
        temporaryDuration
      });

      res.json({
        success: true,
        data: override,
        message: `${institutionType.toUpperCase()} override executed: ${overrideDecision.toUpperCase()}`,
        consequences: {
          politicalCost: override.politicalCost,
          approvalImpact: override.publicApprovalImpact,
          institutionalTrustImpact: override.institutionalTrustImpact,
          separationOfPowersImpact: override.separationOfPowersImpact,
          partyImpacts: override.partyRelationsImpact
        }
      });
    } catch (error) {
      console.error('Error executing institutional override:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to execute institutional override',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Get all overrides by leader
   * GET /api/institutional-override/leader/:leaderCharacterId
   */
  router.get('/leader/:leaderCharacterId', async (req: Request, res: Response) => {
    try {
      const leaderCharacterId = req.params.leaderCharacterId;
      const campaignId = parseInt(req.query.campaignId as string) || 1;
      const institutionType = req.query.institutionType as 'legislature' | 'central_bank' | 'supreme_court';
      const limit = parseInt(req.query.limit as string) || 20;

      const overrides = await overrideService.getOverridesByLeader(
        leaderCharacterId,
        campaignId,
        institutionType,
        limit
      );

      res.json({
        success: true,
        data: overrides,
        message: `Retrieved ${overrides.length} institutional overrides`,
        summary: {
          total: overrides.length,
          byInstitution: overrides.reduce((acc, override) => {
            acc[override.institutionType] = (acc[override.institutionType] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
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
   * Get eligible decisions for override by institution
   * GET /api/institutional-override/eligible/:institutionType/:campaignId
   */
  router.get('/eligible/:institutionType/:campaignId', async (req: Request, res: Response) => {
    try {
      const institutionType = req.params.institutionType as 'legislature' | 'central_bank' | 'supreme_court';
      const campaignId = parseInt(req.params.campaignId);

      if (!['legislature', 'central_bank', 'supreme_court'].includes(institutionType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid institution type',
          message: 'Institution type must be legislature, central_bank, or supreme_court'
        });
      }

      const decisions = await overrideService.getEligibleDecisions(institutionType, campaignId);

      res.json({
        success: true,
        data: decisions,
        message: `Retrieved ${decisions.length} eligible ${institutionType} decisions`,
        eligibilityCriteria: {
          institution: institutionType,
          statuses: ['approved', 'rejected', 'implemented'],
          excludes: 'Decisions with active overrides'
        }
      });
    } catch (error) {
      console.error('Error getting eligible decisions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve eligible decisions',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Challenge an institutional override
   * POST /api/institutional-override/:overrideId/challenge
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
        message: `Institutional override challenged by ${challenger}`,
        challenge: challengedOverride.challengeDetails
      });
    } catch (error) {
      console.error('Error challenging override:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to challenge institutional override',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Get override statistics for a campaign
   * GET /api/institutional-override/stats/:campaignId
   */
  router.get('/stats/:campaignId', async (req: Request, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const timeframe = req.query.timeframe as string || '30d';

      const statistics = await overrideService.getOverrideStatistics(campaignId, timeframe);

      // Calculate overall statistics
      const overallStats = statistics.reduce((acc: any, stat: any) => {
        acc.totalOverrides += parseInt(stat.total_overrides) || 0;
        acc.totalApprovals += parseInt(stat.approvals) || 0;
        acc.totalRejections += parseInt(stat.rejections) || 0;
        acc.totalModifications += parseInt(stat.modifications) || 0;
        acc.totalSuspensions += parseInt(stat.suspensions) || 0;
        acc.totalChallenged += parseInt(stat.challenged) || 0;
        acc.totalReversed += parseInt(stat.reversed) || 0;
        return acc;
      }, {
        totalOverrides: 0,
        totalApprovals: 0,
        totalRejections: 0,
        totalModifications: 0,
        totalSuspensions: 0,
        totalChallenged: 0,
        totalReversed: 0
      });

      res.json({
        success: true,
        data: {
          timeframe,
          overall: overallStats,
          byInstitution: statistics,
          institutionalBreakdown: statistics.reduce((acc: any, stat: any) => {
            acc[stat.institution_type] = {
              total: parseInt(stat.total_overrides) || 0,
              avgPoliticalCost: parseFloat(stat.avg_political_cost) || 0,
              avgApprovalImpact: parseFloat(stat.avg_approval_impact) || 0,
              avgTrustImpact: parseFloat(stat.avg_trust_impact) || 0,
              avgSeparationImpact: parseFloat(stat.avg_separation_impact) || 0
            };
            return acc;
          }, {} as Record<string, any>)
        },
        message: `Institutional override statistics for ${timeframe} timeframe`
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
   * Get separation of powers metrics
   * GET /api/institutional-override/separation-powers/:campaignId
   */
  router.get('/separation-powers/:campaignId', async (req: Request, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId);

      const query = `
        SELECT * FROM separation_of_powers_metrics 
        WHERE campaign_id = $1 
        ORDER BY updated_at DESC 
        LIMIT 1
      `;

      const result = await pool.query(query, [campaignId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No separation of powers data found',
          message: `No data found for campaign ${campaignId}`
        });
      }

      const metrics = result.rows[0];

      res.json({
        success: true,
        data: {
          campaignId,
          executivePowerIndex: parseFloat(metrics.executive_power_index),
          legislativeIndependenceIndex: parseFloat(metrics.legislative_independence_index),
          judicialIndependenceIndex: parseFloat(metrics.judicial_independence_index),
          monetaryIndependenceIndex: parseFloat(metrics.monetary_independence_index),
          constitutionalBalanceScore: parseFloat(metrics.constitutional_balance_score),
          democraticHealthIndex: parseFloat(metrics.democratic_health_index),
          totalInstitutionalOverrides: parseInt(metrics.total_institutional_overrides),
          overrideFrequency30d: parseInt(metrics.override_frequency_30d),
          crisisSeverityLevel: metrics.crisis_severity_level,
          lastUpdate: metrics.updated_at
        },
        message: 'Separation of powers metrics retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting separation of powers metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve separation of powers metrics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * Get institutional trust metrics
   * GET /api/institutional-override/trust-metrics/:campaignId
   */
  router.get('/trust-metrics/:campaignId', async (req: Request, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      const institutionType = req.query.institutionType as string;

      let query = `
        SELECT * FROM institutional_trust_metrics 
        WHERE campaign_id = $1
      `;
      const params = [campaignId];

      if (institutionType && ['legislature', 'central_bank', 'supreme_court'].includes(institutionType)) {
        query += ' AND institution_type = $2';
        params.push(institutionType as any);
      }

      query += ' ORDER BY institution_type, updated_at DESC';

      const result = await pool.query(query, params);

      const trustMetrics = result.rows.map(row => ({
        institutionType: row.institution_type,
        publicTrustRating: parseFloat(row.public_trust_rating),
        expertTrustRating: parseFloat(row.expert_trust_rating),
        internationalTrustRating: parseFloat(row.international_trust_rating),
        independencePerception: parseFloat(row.independence_perception),
        effectivenessRating: parseFloat(row.effectiveness_rating),
        overrideImpactCumulative: parseFloat(row.override_impact_cumulative),
        totalOverrides: parseInt(row.total_overrides),
        successfulChallenges: parseInt(row.successful_challenges),
        lastOverrideDate: row.last_override_date,
        lastUpdate: row.updated_at
      }));

      res.json({
        success: true,
        data: trustMetrics,
        message: `Retrieved trust metrics for ${trustMetrics.length} institutions`
      });
    } catch (error) {
      console.error('Error getting trust metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve trust metrics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Enhanced Knob System Endpoints
  createEnhancedKnobEndpoints(router, 'institutional-override', institutionalOverrideKnobSystem, applyInstitutionalOverrideKnobsToGameState);

  return router;
}
