import express from 'express';
import { getPool } from '../storage/db.js';
import { CentralBankAdvisoryService } from './CentralBankAdvisoryService.js';

const router = express.Router();

// Initialize service
const getCentralBankService = () => new CentralBankAdvisoryService(getPool());

// ===== POLICY RECOMMENDATION MANAGEMENT =====

/**
 * POST /api/central-bank/recommendations - Create policy recommendation
 */
router.post('/recommendations', async (req, res) => {
  try {
    const service = getCentralBankService();
    const {
      campaignId,
      recommendationType,
      recommendationTitle,
      recommendationSummary,
      detailedAnalysis,
      recommendedAction,
      economicRationale,
      riskAssessment,
      implementationTimeline,
      confidenceLevel,
      urgencyLevel,
      supportingData,
      alternativeOptions,
      internationalPrecedents
    } = req.body;

    if (!campaignId || !recommendationType || !recommendationTitle || !recommendationSummary || 
        !detailedAnalysis || !recommendedAction || !economicRationale || !riskAssessment || 
        !confidenceLevel || !urgencyLevel) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: [
          'campaignId', 'recommendationType', 'recommendationTitle', 'recommendationSummary',
          'detailedAnalysis', 'recommendedAction', 'economicRationale', 'riskAssessment',
          'confidenceLevel', 'urgencyLevel'
        ]
      });
    }

    const recommendation = await service.createPolicyRecommendation({
      campaignId: Number(campaignId),
      recommendationType,
      recommendationTitle,
      recommendationSummary,
      detailedAnalysis,
      recommendedAction,
      economicRationale,
      riskAssessment,
      implementationTimeline,
      confidenceLevel: Number(confidenceLevel),
      urgencyLevel,
      supportingData,
      alternativeOptions,
      internationalPrecedents
    });

    res.json({
      success: true,
      recommendation,
      message: `Policy recommendation "${recommendationTitle}" created successfully`
    });
  } catch (error) {
    console.error('Error creating policy recommendation:', error);
    res.status(500).json({
      error: 'Failed to create policy recommendation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/central-bank/recommendations - List policy recommendations
 */
router.get('/recommendations', async (req, res) => {
  try {
    const service = getCentralBankService();
    const { campaignId, recommendationType, status, urgencyLevel, limit } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const recommendations = await service.getPolicyRecommendations(Number(campaignId), {
      recommendationType: recommendationType as string,
      status: status as string,
      urgencyLevel: urgencyLevel as string,
      limit: limit ? Number(limit) : undefined
    });

    res.json({
      success: true,
      recommendations,
      count: recommendations.length
    });
  } catch (error) {
    console.error('Error fetching policy recommendations:', error);
    res.status(500).json({
      error: 'Failed to fetch policy recommendations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/central-bank/recommendations/:id/leader-response - Leader response to recommendation
 */
router.put('/recommendations/:id/leader-response', async (req, res) => {
  try {
    const service = getCentralBankService();
    const { id } = req.params;
    const { leaderDecision, leaderResponse, implementationNotes } = req.body;

    if (!leaderDecision || !leaderResponse) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['leaderDecision', 'leaderResponse']
      });
    }

    if (!['accept', 'modify', 'reject', 'defer'].includes(leaderDecision)) {
      return res.status(400).json({
        error: 'Invalid leader decision',
        validOptions: ['accept', 'modify', 'reject', 'defer']
      });
    }

    const recommendation = await service.respondToPolicyRecommendation(
      id,
      leaderDecision,
      leaderResponse,
      implementationNotes
    );

    res.json({
      success: true,
      recommendation,
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

// ===== MONETARY POLICY MANAGEMENT =====

/**
 * GET /api/central-bank/monetary-policy/current - Get current monetary policy
 */
router.get('/monetary-policy/current', async (req, res) => {
  try {
    const service = getCentralBankService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const policy = await service.getCurrentMonetaryPolicy(Number(campaignId));

    if (!policy) {
      return res.status(404).json({
        error: 'No monetary policy found for this campaign'
      });
    }

    res.json({
      success: true,
      policy
    });
  } catch (error) {
    console.error('Error fetching current monetary policy:', error);
    res.status(500).json({
      error: 'Failed to fetch current monetary policy',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/central-bank/monetary-policy/update - Update monetary policy (leader decision)
 */
router.post('/monetary-policy/update', async (req, res) => {
  try {
    const service = getCentralBankService();
    const {
      campaignId,
      policyRate,
      depositRate,
      lendingRate,
      inflationTarget,
      inflationTolerance,
      reserveRequirement,
      policyStance,
      forwardGuidance,
      changeRationale,
      decidedBy,
      recommendationId,
      nextReviewDate
    } = req.body;

    if (!campaignId || !changeRationale || !decidedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'changeRationale', 'decidedBy']
      });
    }

    const policy = await service.updateMonetaryPolicy({
      campaignId: Number(campaignId),
      policyRate: policyRate ? Number(policyRate) : undefined,
      depositRate: depositRate ? Number(depositRate) : undefined,
      lendingRate: lendingRate ? Number(lendingRate) : undefined,
      inflationTarget: inflationTarget ? Number(inflationTarget) : undefined,
      inflationTolerance: inflationTolerance ? Number(inflationTolerance) : undefined,
      reserveRequirement: reserveRequirement ? Number(reserveRequirement) : undefined,
      policyStance,
      forwardGuidance,
      changeRationale,
      decidedBy,
      recommendationId,
      nextReviewDate: nextReviewDate ? new Date(nextReviewDate) : undefined
    });

    res.json({
      success: true,
      policy,
      message: 'Monetary policy updated successfully'
    });
  } catch (error) {
    console.error('Error updating monetary policy:', error);
    res.status(500).json({
      error: 'Failed to update monetary policy',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== FINANCIAL STABILITY MONITORING =====

/**
 * GET /api/central-bank/stability/assessment - Get latest stability assessment
 */
router.get('/stability/assessment', async (req, res) => {
  try {
    const service = getCentralBankService();
    const { campaignId, assessmentType } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const assessment = await service.getLatestStabilityAssessment(
      Number(campaignId),
      assessmentType as string
    );

    res.json({
      success: true,
      assessment
    });
  } catch (error) {
    console.error('Error fetching stability assessment:', error);
    res.status(500).json({
      error: 'Failed to fetch stability assessment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/central-bank/stability/assessment - Create stability assessment
 */
router.post('/stability/assessment', async (req, res) => {
  try {
    const service = getCentralBankService();
    const {
      campaignId,
      assessmentType,
      assessmentTitle,
      overallRating,
      keyFindings,
      riskFactors,
      stabilityIndicators,
      trendAnalysis,
      recommendations,
      monitoringPriorities,
      internationalComparison,
      nextAssessmentDate
    } = req.body;

    if (!campaignId || !assessmentType || !assessmentTitle || !overallRating || 
        !keyFindings || !trendAnalysis || !recommendations) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: [
          'campaignId', 'assessmentType', 'assessmentTitle', 'overallRating',
          'keyFindings', 'trendAnalysis', 'recommendations'
        ]
      });
    }

    const assessment = await service.createStabilityAssessment({
      campaignId: Number(campaignId),
      assessmentType,
      assessmentTitle,
      overallRating,
      keyFindings,
      riskFactors,
      stabilityIndicators,
      trendAnalysis,
      recommendations,
      monitoringPriorities,
      internationalComparison,
      nextAssessmentDate: nextAssessmentDate ? new Date(nextAssessmentDate) : undefined
    });

    res.json({
      success: true,
      assessment,
      message: `Stability assessment "${assessmentTitle}" created successfully`
    });
  } catch (error) {
    console.error('Error creating stability assessment:', error);
    res.status(500).json({
      error: 'Failed to create stability assessment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/central-bank/stability/indicators - Get stability indicators dashboard
 */
router.get('/stability/indicators', async (req, res) => {
  try {
    const service = getCentralBankService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const indicators = await service.getStabilityIndicators(Number(campaignId));

    res.json({
      success: true,
      indicators
    });
  } catch (error) {
    console.error('Error fetching stability indicators:', error);
    res.status(500).json({
      error: 'Failed to fetch stability indicators',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== CRISIS MANAGEMENT =====

/**
 * GET /api/central-bank/crisis/protocols - Get crisis protocols
 */
router.get('/crisis/protocols', async (req, res) => {
  try {
    const service = getCentralBankService();
    const { campaignId, crisisType } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const protocols = await service.getCrisisProtocols(
      Number(campaignId),
      crisisType as string
    );

    res.json({
      success: true,
      protocols,
      count: protocols.length
    });
  } catch (error) {
    console.error('Error fetching crisis protocols:', error);
    res.status(500).json({
      error: 'Failed to fetch crisis protocols',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/central-bank/crisis/activate - Activate crisis protocol
 */
router.post('/crisis/activate', async (req, res) => {
  try {
    const service = getCentralBankService();
    const { protocolId, activationContext } = req.body;

    if (!protocolId || !activationContext) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['protocolId', 'activationContext']
      });
    }

    const activation = await service.activateCrisisProtocol(protocolId, activationContext);

    res.json({
      success: true,
      activation,
      message: 'Crisis protocol activated successfully'
    });
  } catch (error) {
    console.error('Error activating crisis protocol:', error);
    res.status(500).json({
      error: 'Failed to activate crisis protocol',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== ECONOMIC RESEARCH & ANALYSIS =====

/**
 * GET /api/central-bank/research/forecasts - Get economic forecasts
 */
router.get('/research/forecasts', async (req, res) => {
  try {
    const service = getCentralBankService();
    const { campaignId, researchType } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const forecasts = await service.getEconomicForecasts(
      Number(campaignId),
      researchType as string
    );

    res.json({
      success: true,
      forecasts,
      count: forecasts.length
    });
  } catch (error) {
    console.error('Error fetching economic forecasts:', error);
    res.status(500).json({
      error: 'Failed to fetch economic forecasts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/central-bank/research/create - Create economic research
 */
router.post('/research/create', async (req, res) => {
  try {
    const service = getCentralBankService();
    const {
      campaignId,
      researchType,
      researchTitle,
      executiveSummary,
      methodology,
      keyFindings,
      policyImplications,
      forecastData,
      confidenceIntervals,
      assumptions,
      limitations,
      publicationStatus,
      publicationDate
    } = req.body;

    if (!campaignId || !researchType || !researchTitle || !executiveSummary || 
        !methodology || !keyFindings || !policyImplications) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: [
          'campaignId', 'researchType', 'researchTitle', 'executiveSummary',
          'methodology', 'keyFindings', 'policyImplications'
        ]
      });
    }

    const research = await service.createEconomicResearch({
      campaignId: Number(campaignId),
      researchType,
      researchTitle,
      executiveSummary,
      methodology,
      keyFindings,
      policyImplications,
      forecastData,
      confidenceIntervals,
      assumptions,
      limitations,
      publicationStatus,
      publicationDate: publicationDate ? new Date(publicationDate) : undefined
    });

    res.json({
      success: true,
      research,
      message: `Economic research "${researchTitle}" created successfully`
    });
  } catch (error) {
    console.error('Error creating economic research:', error);
    res.status(500).json({
      error: 'Failed to create economic research',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== INDEPENDENCE METRICS =====

/**
 * GET /api/central-bank/independence/metrics - Get independence metrics
 */
router.get('/independence/metrics', async (req, res) => {
  try {
    const service = getCentralBankService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const metrics = await service.getLatestIndependenceMetrics(Number(campaignId));

    res.json({
      success: true,
      metrics
    });
  } catch (error) {
    console.error('Error fetching independence metrics:', error);
    res.status(500).json({
      error: 'Failed to fetch independence metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/central-bank/independence/update - Update independence metrics
 */
router.post('/independence/update', async (req, res) => {
  try {
    const service = getCentralBankService();
    const {
      campaignId,
      analyticalIndependenceScore,
      policyInfluenceScore,
      publicCredibilityScore,
      internationalReputationScore,
      marketConfidenceIndicator,
      independenceFactors
    } = req.body;

    if (!campaignId || analyticalIndependenceScore === undefined || 
        policyInfluenceScore === undefined || publicCredibilityScore === undefined || 
        internationalReputationScore === undefined || marketConfidenceIndicator === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: [
          'campaignId', 'analyticalIndependenceScore', 'policyInfluenceScore',
          'publicCredibilityScore', 'internationalReputationScore', 'marketConfidenceIndicator'
        ]
      });
    }

    const metrics = await service.updateIndependenceMetrics({
      campaignId: Number(campaignId),
      analyticalIndependenceScore: Number(analyticalIndependenceScore),
      policyInfluenceScore: Number(policyInfluenceScore),
      publicCredibilityScore: Number(publicCredibilityScore),
      internationalReputationScore: Number(internationalReputationScore),
      marketConfidenceIndicator: Number(marketConfidenceIndicator),
      independenceFactors: independenceFactors || {}
    });

    res.json({
      success: true,
      metrics,
      message: 'Independence metrics updated successfully'
    });
  } catch (error) {
    console.error('Error updating independence metrics:', error);
    res.status(500).json({
      error: 'Failed to update independence metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== ANALYTICS & DASHBOARD =====

/**
 * GET /api/central-bank/analytics - Central Bank analytics dashboard
 */
router.get('/analytics', async (req, res) => {
  try {
    const service = getCentralBankService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const analytics = await service.getCentralBankAnalytics(Number(campaignId));

    res.json({
      success: true,
      analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching Central Bank analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch Central Bank analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/central-bank/dashboard - Central Bank dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    const service = getCentralBankService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const [analytics, pendingRecommendations, stabilityIndicators, independenceMetrics] = await Promise.all([
      service.getCentralBankAnalytics(Number(campaignId)),
      service.getPolicyRecommendations(Number(campaignId), { status: 'pending', limit: 10 }),
      service.getStabilityIndicators(Number(campaignId)),
      service.getLatestIndependenceMetrics(Number(campaignId))
    ]);

    const dashboard = {
      overview: analytics,
      pendingRecommendations: pendingRecommendations.slice(0, 5),
      stabilityStatus: stabilityIndicators,
      independenceMetrics,
      alerts: [
        ...(pendingRecommendations.filter(r => r.urgencyLevel === 'critical').length > 0 ? [{
          type: 'critical_recommendations',
          message: 'Critical policy recommendations awaiting leader decision',
          count: pendingRecommendations.filter(r => r.urgencyLevel === 'critical').length
        }] : []),
        ...(stabilityIndicators.alerts || [])
      ],
      quickActions: [
        { action: 'create_recommendation', label: 'Create Policy Recommendation' },
        { action: 'update_policy', label: 'Update Monetary Policy' },
        { action: 'stability_assessment', label: 'Run Stability Assessment' },
        { action: 'crisis_protocols', label: 'Review Crisis Protocols' }
      ]
    };

    res.json({
      success: true,
      dashboard,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching Central Bank dashboard:', error);
    res.status(500).json({
      error: 'Failed to fetch Central Bank dashboard',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
