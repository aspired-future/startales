import express from 'express';
import { getPool } from '../storage/db.js';
import { SupremeCourtAdvisoryService } from './SupremeCourtAdvisoryService.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = express.Router();

// Enhanced AI Knobs for Supreme Court System
const supremeCourtKnobsData = {
  // Constitutional Interpretation & Review
  constitutional_interpretation_rigor: 0.9,  // Constitutional interpretation rigor and textual analysis
  precedent_adherence_strength: 0.8,         // Precedent adherence strength and stare decisis respect
  constitutional_originalism_emphasis: 0.7,  // Constitutional originalism emphasis and historical context
  
  // Judicial Independence & Integrity
  judicial_independence_protection: 0.9,     // Judicial independence protection and political insulation
  judicial_ethics_enforcement: 0.9,          // Judicial ethics enforcement and integrity standards
  decision_impartiality_maintenance: 0.9,    // Decision impartiality maintenance and bias prevention
  
  // Rights Protection & Civil Liberties
  civil_rights_protection_strength: 0.9,     // Civil rights protection strength and constitutional guarantees
  minority_rights_safeguarding: 0.8,         // Minority rights safeguarding and equal protection
  due_process_enforcement_rigor: 0.9,        // Due process enforcement rigor and procedural fairness
  
  // Legal Reasoning & Analysis
  legal_reasoning_sophistication: 0.8,       // Legal reasoning sophistication and analytical depth
  constitutional_scholarship_integration: 0.8, // Constitutional scholarship integration and academic rigor
  legal_precedent_analysis_thoroughness: 0.8, // Legal precedent analysis thoroughness and case law review
  
  // Court Administration & Efficiency
  case_processing_efficiency: 0.7,           // Case processing efficiency and timely resolution
  court_administration_excellence: 0.8,      // Court administration excellence and operational management
  judicial_resource_optimization: 0.7,       // Judicial resource optimization and capacity management
  
  // Public Trust & Transparency
  judicial_transparency_commitment: 0.7,     // Judicial transparency commitment and public accountability
  public_confidence_maintenance: 0.8,        // Public confidence maintenance and institutional legitimacy
  judicial_communication_clarity: 0.7,       // Judicial communication clarity and decision explanation
  
  // Constitutional Evolution & Adaptation
  constitutional_adaptation_balance: 0.7,    // Constitutional adaptation balance between stability and change
  emerging_rights_recognition: 0.7,          // Emerging rights recognition and evolving constitutional understanding
  societal_change_responsiveness: 0.6,       // Societal change responsiveness and contemporary relevance
  
  // Inter-Branch Relations & Separation of Powers
  separation_of_powers_enforcement: 0.9,     // Separation of powers enforcement and constitutional balance
  executive_oversight_capability: 0.8,       // Executive oversight capability and checks and balances
  legislative_review_thoroughness: 0.8,      // Legislative review thoroughness and constitutional compliance
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Supreme Court
const supremeCourtKnobSystem = new EnhancedKnobSystem(supremeCourtKnobsData);

// Apply supreme court knobs to game state
function applySupremeCourtKnobsToGameState() {
  const knobs = supremeCourtKnobSystem.knobs;
  
  // Apply constitutional interpretation settings
  const constitutionalInterpretation = (knobs.constitutional_interpretation_rigor + knobs.precedent_adherence_strength + 
    knobs.constitutional_originalism_emphasis) / 3;
  
  // Apply judicial independence settings
  const judicialIndependence = (knobs.judicial_independence_protection + knobs.judicial_ethics_enforcement + 
    knobs.decision_impartiality_maintenance) / 3;
  
  // Apply rights protection settings
  const rightsProtection = (knobs.civil_rights_protection_strength + knobs.minority_rights_safeguarding + 
    knobs.due_process_enforcement_rigor) / 3;
  
  // Apply legal reasoning settings
  const legalReasoning = (knobs.legal_reasoning_sophistication + knobs.constitutional_scholarship_integration + 
    knobs.legal_precedent_analysis_thoroughness) / 3;
  
  // Apply public trust settings
  const publicTrust = (knobs.judicial_transparency_commitment + knobs.public_confidence_maintenance + 
    knobs.judicial_communication_clarity) / 3;
  
  // Apply separation of powers settings
  const separationOfPowers = (knobs.separation_of_powers_enforcement + knobs.executive_oversight_capability + 
    knobs.legislative_review_thoroughness) / 3;
  
  console.log('Applied supreme court knobs to game state:', {
    constitutionalInterpretation,
    judicialIndependence,
    rightsProtection,
    legalReasoning,
    publicTrust,
    separationOfPowers
  });
}

// Initialize service
const getSupremeCourtService = () => new SupremeCourtAdvisoryService(getPool());

// ===== CONSTITUTIONAL REVIEW MANAGEMENT =====

/**
 * POST /api/supreme-court/reviews - Create constitutional review
 */
router.post('/reviews', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const {
      campaignId,
      reviewType,
      reviewTitle,
      subjectMatter,
      constitutionalProvisions,
      legalPrecedents,
      constitutionalAnalysis,
      legalReasoning,
      rightsImpactAssessment,
      recommendationSummary,
      detailedOpinion,
      constitutionalCompliance,
      confidenceLevel,
      urgencyLevel,
      alternativeApproaches,
      implementationGuidance
    } = req.body;

    if (!campaignId || !reviewType || !reviewTitle || !subjectMatter || 
        !constitutionalAnalysis || !legalReasoning || !rightsImpactAssessment ||
        !recommendationSummary || !detailedOpinion || !constitutionalCompliance ||
        !confidenceLevel || !urgencyLevel) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: [
          'campaignId', 'reviewType', 'reviewTitle', 'subjectMatter',
          'constitutionalAnalysis', 'legalReasoning', 'rightsImpactAssessment',
          'recommendationSummary', 'detailedOpinion', 'constitutionalCompliance',
          'confidenceLevel', 'urgencyLevel'
        ]
      });
    }

    const review = await service.createConstitutionalReview({
      campaignId: Number(campaignId),
      reviewType,
      reviewTitle,
      subjectMatter,
      constitutionalProvisions: constitutionalProvisions || [],
      legalPrecedents: legalPrecedents || [],
      constitutionalAnalysis,
      legalReasoning,
      rightsImpactAssessment,
      recommendationSummary,
      detailedOpinion,
      constitutionalCompliance,
      confidenceLevel: Number(confidenceLevel),
      urgencyLevel,
      alternativeApproaches,
      implementationGuidance
    });

    res.json({
      success: true,
      review,
      message: `Constitutional review "${reviewTitle}" created successfully`
    });
  } catch (error) {
    console.error('Error creating constitutional review:', error);
    res.status(500).json({
      error: 'Failed to create constitutional review',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/supreme-court/reviews - List constitutional reviews
 */
router.get('/reviews', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const { 
      campaignId, reviewType, constitutionalCompliance, status, urgencyLevel, limit 
    } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const reviews = await service.getConstitutionalReviews(Number(campaignId), {
      reviewType: reviewType as string,
      constitutionalCompliance: constitutionalCompliance as string,
      status: status as string,
      urgencyLevel: urgencyLevel as string,
      limit: limit ? Number(limit) : undefined
    });

    res.json({
      success: true,
      reviews,
      count: reviews.length
    });
  } catch (error) {
    console.error('Error fetching constitutional reviews:', error);
    res.status(500).json({
      error: 'Failed to fetch constitutional reviews',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/supreme-court/reviews/:id/leader-response - Leader response to review
 */
router.put('/reviews/:id/leader-response', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const { id } = req.params;
    const { leaderDecision, leaderResponse, leaderModifications } = req.body;

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

    const review = await service.respondToConstitutionalReview(
      id,
      leaderDecision,
      leaderResponse,
      leaderModifications
    );

    res.json({
      success: true,
      review,
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

// ===== SUPREME COURT JUSTICE MANAGEMENT =====

/**
 * GET /api/supreme-court/justices - List Supreme Court justices
 */
router.get('/justices', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const { campaignId, tenureStatus } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const justices = await service.getSupremeCourtJustices(
      Number(campaignId),
      tenureStatus as string
    );

    res.json({
      success: true,
      justices,
      count: justices.length
    });
  } catch (error) {
    console.error('Error fetching Supreme Court justices:', error);
    res.status(500).json({
      error: 'Failed to fetch Supreme Court justices',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/supreme-court/justices/:id - Get justice details
 */
router.get('/justices/:id', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const { id } = req.params;

    const justice = await service.getJusticeById(id);

    if (!justice) {
      return res.status(404).json({
        error: 'Supreme Court justice not found'
      });
    }

    res.json({
      success: true,
      justice
    });
  } catch (error) {
    console.error('Error fetching Supreme Court justice:', error);
    res.status(500).json({
      error: 'Failed to fetch Supreme Court justice',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== LEGAL PRECEDENT MANAGEMENT =====

/**
 * GET /api/supreme-court/precedents - Search legal precedents
 */
router.get('/precedents', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const { campaignId, caseType, courtLevel, currentStatus, limit } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const precedents = await service.getLegalPrecedents(Number(campaignId), {
      caseType: caseType as string,
      courtLevel: courtLevel as string,
      currentStatus: currentStatus as string,
      limit: limit ? Number(limit) : undefined
    });

    res.json({
      success: true,
      precedents,
      count: precedents.length
    });
  } catch (error) {
    console.error('Error fetching legal precedents:', error);
    res.status(500).json({
      error: 'Failed to fetch legal precedents',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/supreme-court/precedents/search - Search by constitutional provision
 */
router.get('/precedents/search', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const { campaignId, provision } = req.query;

    if (!campaignId || !provision) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['campaignId', 'provision']
      });
    }

    const precedents = await service.searchPrecedentsByProvision(
      Number(campaignId),
      provision as string
    );

    res.json({
      success: true,
      precedents,
      count: precedents.length,
      searchTerm: provision
    });
  } catch (error) {
    console.error('Error searching legal precedents:', error);
    res.status(500).json({
      error: 'Failed to search legal precedents',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== CONSTITUTIONAL INTERPRETATION =====

/**
 * GET /api/supreme-court/interpretations - Get constitutional interpretations
 */
router.get('/interpretations', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const { campaignId, provision } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const interpretations = await service.getConstitutionalInterpretations(
      Number(campaignId),
      provision as string
    );

    res.json({
      success: true,
      interpretations,
      count: interpretations.length
    });
  } catch (error) {
    console.error('Error fetching constitutional interpretations:', error);
    res.status(500).json({
      error: 'Failed to fetch constitutional interpretations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/supreme-court/interpretations - Create constitutional interpretation
 */
router.post('/interpretations', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const {
      campaignId,
      constitutionalProvision,
      interpretationType,
      interpretationSummary,
      detailedAnalysis,
      historicalContext,
      comparativeAnalysis,
      evolutionOverTime,
      currentApplication,
      relatedPrecedents,
      scholarlyConsensus,
      practicalImplications,
      alternativeInterpretations,
      confidenceLevel
    } = req.body;

    if (!campaignId || !constitutionalProvision || !interpretationType || 
        !interpretationSummary || !detailedAnalysis || !currentApplication ||
        !scholarlyConsensus || !practicalImplications || !confidenceLevel) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: [
          'campaignId', 'constitutionalProvision', 'interpretationType',
          'interpretationSummary', 'detailedAnalysis', 'currentApplication',
          'scholarlyConsensus', 'practicalImplications', 'confidenceLevel'
        ]
      });
    }

    const interpretation = await service.createConstitutionalInterpretation({
      campaignId: Number(campaignId),
      constitutionalProvision,
      interpretationType,
      interpretationSummary,
      detailedAnalysis,
      historicalContext,
      comparativeAnalysis,
      evolutionOverTime,
      currentApplication,
      relatedPrecedents,
      scholarlyConsensus,
      practicalImplications,
      alternativeInterpretations,
      confidenceLevel: Number(confidenceLevel)
    });

    res.json({
      success: true,
      interpretation,
      message: 'Constitutional interpretation created successfully'
    });
  } catch (error) {
    console.error('Error creating constitutional interpretation:', error);
    res.status(500).json({
      error: 'Failed to create constitutional interpretation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== JUDICIAL OPINION MANAGEMENT =====

/**
 * POST /api/supreme-court/opinions - Create judicial opinion
 */
router.post('/opinions', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const {
      campaignId,
      opinionType,
      caseId,
      reviewId,
      authoringJustice,
      joiningJustices,
      opinionSummary,
      legalAnalysis,
      constitutionalReasoning,
      precedentDiscussion,
      policyImplications,
      futureGuidance,
      scholarlyReception
    } = req.body;

    if (!campaignId || !opinionType || !authoringJustice || !opinionSummary ||
        !legalAnalysis || !constitutionalReasoning) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: [
          'campaignId', 'opinionType', 'authoringJustice', 'opinionSummary',
          'legalAnalysis', 'constitutionalReasoning'
        ]
      });
    }

    const opinion = await service.createJudicialOpinion({
      campaignId: Number(campaignId),
      opinionType,
      caseId,
      reviewId,
      authoringJustice,
      joiningJustices,
      opinionSummary,
      legalAnalysis,
      constitutionalReasoning,
      precedentDiscussion,
      policyImplications,
      futureGuidance,
      scholarlyReception
    });

    res.json({
      success: true,
      opinion,
      message: 'Judicial opinion created successfully'
    });
  } catch (error) {
    console.error('Error creating judicial opinion:', error);
    res.status(500).json({
      error: 'Failed to create judicial opinion',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/supreme-court/opinions - List judicial opinions
 */
router.get('/opinions', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const { campaignId, opinionType, authoringJustice, limit } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const opinions = await service.getJudicialOpinions(Number(campaignId), {
      opinionType: opinionType as string,
      authoringJustice: authoringJustice as string,
      limit: limit ? Number(limit) : undefined
    });

    res.json({
      success: true,
      opinions,
      count: opinions.length
    });
  } catch (error) {
    console.error('Error fetching judicial opinions:', error);
    res.status(500).json({
      error: 'Failed to fetch judicial opinions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== LEADER INTERACTION MANAGEMENT =====

/**
 * POST /api/supreme-court/interactions - Record leader-court interaction
 */
router.post('/interactions', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const {
      campaignId,
      interactionType,
      interactionSummary,
      constitutionalIssue,
      courtPosition,
      leaderPosition,
      legalDiscussion,
      constitutionalAnalysis,
      agreementsReached,
      disagreements,
      compromiseSolutions,
      interactionOutcome,
      constitutionalImplications,
      precedentImpact,
      publicDisclosure
    } = req.body;

    if (!campaignId || !interactionType || !interactionSummary || 
        !courtPosition || !leaderPosition || !interactionOutcome) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: [
          'campaignId', 'interactionType', 'interactionSummary',
          'courtPosition', 'leaderPosition', 'interactionOutcome'
        ]
      });
    }

    const interaction = await service.recordLeaderCourtInteraction({
      campaignId: Number(campaignId),
      interactionType,
      interactionSummary,
      constitutionalIssue,
      courtPosition,
      leaderPosition,
      legalDiscussion,
      constitutionalAnalysis,
      agreementsReached,
      disagreements,
      compromiseSolutions,
      interactionOutcome,
      constitutionalImplications,
      precedentImpact,
      publicDisclosure
    });

    res.json({
      success: true,
      interaction,
      message: 'Leader-court interaction recorded successfully'
    });
  } catch (error) {
    console.error('Error recording leader-court interaction:', error);
    res.status(500).json({
      error: 'Failed to record leader-court interaction',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/supreme-court/interactions/recent - Get recent interactions
 */
router.get('/interactions/recent', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const { campaignId, limit } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const interactions = await service.getRecentLeaderCourtInteractions(
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
 * GET /api/supreme-court/analytics - Court analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const analytics = await service.getLatestCourtAnalytics(Number(campaignId));

    res.json({
      success: true,
      analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching court analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch court analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/supreme-court/analytics/update - Update analytics
 */
router.post('/analytics/update', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const analytics = await service.updateCourtAnalytics(Number(campaignId));

    res.json({
      success: true,
      analytics,
      message: 'Court analytics updated successfully'
    });
  } catch (error) {
    console.error('Error updating court analytics:', error);
    res.status(500).json({
      error: 'Failed to update court analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/supreme-court/dashboard - Supreme Court dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    const service = getSupremeCourtService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const dashboard = await service.getSupremeCourtDashboard(Number(campaignId));

    res.json({
      success: true,
      dashboard,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching Supreme Court dashboard:', error);
    res.status(500).json({
      error: 'Failed to fetch Supreme Court dashboard',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'supreme-court', supremeCourtKnobSystem, applySupremeCourtKnobsToGameState);

export default router;
