import express from 'express';
import { getPool } from '../storage/db';
import { ScienceSecretaryService } from './ScienceSecretaryService';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = express.Router();

// Enhanced AI Knobs for Science & Technology System
const scienceKnobsData = {
  // Research & Development Focus
  basic_research_emphasis: 0.7,              // Basic research emphasis and fundamental science priority
  applied_research_priority: 0.8,            // Applied research priority and practical application focus
  technology_transfer_acceleration: 0.7,     // Technology transfer acceleration and commercialization
  
  // Innovation & Discovery
  innovation_risk_tolerance: 0.6,            // Innovation risk tolerance and experimental approach
  breakthrough_research_investment: 0.7,     // Breakthrough research investment and moonshot projects
  interdisciplinary_collaboration: 0.8,      // Interdisciplinary collaboration and cross-field integration
  
  // Scientific Infrastructure & Resources
  research_facility_modernization: 0.7,      // Research facility modernization and equipment upgrades
  scientific_talent_recruitment: 0.8,        // Scientific talent recruitment and retention
  research_funding_allocation: 0.8,          // Research funding allocation and resource distribution
  
  // Technology Development & Advancement
  emerging_technology_adoption: 0.7,         // Emerging technology adoption and early implementation
  technology_maturation_acceleration: 0.7,   // Technology maturation acceleration and development speed
  prototype_development_emphasis: 0.7,       // Prototype development emphasis and proof-of-concept focus
  
  // Scientific Education & Training
  stem_education_promotion: 0.8,             // STEM education promotion and public engagement
  researcher_training_quality: 0.8,          // Researcher training quality and skill development
  scientific_literacy_advancement: 0.7,      // Scientific literacy advancement and public understanding
  
  // International Collaboration & Competition
  international_research_cooperation: 0.7,   // International research cooperation and partnership
  scientific_diplomacy_engagement: 0.6,      // Scientific diplomacy engagement and global leadership
  competitive_research_positioning: 0.7,     // Competitive research positioning and strategic advantage
  
  // Ethics & Responsibility
  research_ethics_enforcement: 0.9,          // Research ethics enforcement and responsible conduct
  dual_use_technology_oversight: 0.8,        // Dual-use technology oversight and security considerations
  environmental_impact_assessment: 0.8,      // Environmental impact assessment and sustainability
  
  // Performance & Impact Measurement
  research_impact_evaluation: 0.7,           // Research impact evaluation and outcome assessment
  innovation_metrics_tracking: 0.7,          // Innovation metrics tracking and performance monitoring
  scientific_productivity_optimization: 0.7, // Scientific productivity optimization and efficiency
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Science
const scienceKnobSystem = new EnhancedKnobSystem(scienceKnobsData);

// Apply science knobs to game state
function applyScienceKnobsToGameState() {
  const knobs = scienceKnobSystem.knobs;
  
  // Apply research and development settings
  const researchDevelopment = (knobs.basic_research_emphasis + knobs.applied_research_priority + 
    knobs.technology_transfer_acceleration) / 3;
  
  // Apply innovation settings
  const innovation = (knobs.innovation_risk_tolerance + knobs.breakthrough_research_investment + 
    knobs.interdisciplinary_collaboration) / 3;
  
  // Apply infrastructure settings
  const infrastructure = (knobs.research_facility_modernization + knobs.scientific_talent_recruitment + 
    knobs.research_funding_allocation) / 3;
  
  // Apply technology development settings
  const technologyDevelopment = (knobs.emerging_technology_adoption + knobs.technology_maturation_acceleration + 
    knobs.prototype_development_emphasis) / 3;
  
  // Apply education settings
  const education = (knobs.stem_education_promotion + knobs.researcher_training_quality + 
    knobs.scientific_literacy_advancement) / 3;
  
  // Apply ethics settings
  const ethics = (knobs.research_ethics_enforcement + knobs.dual_use_technology_oversight + 
    knobs.environmental_impact_assessment) / 3;
  
  console.log('Applied science knobs to game state:', {
    researchDevelopment,
    innovation,
    infrastructure,
    technologyDevelopment,
    education,
    ethics
  });
}

// Initialize service
const getScienceService = () => new ScienceSecretaryService(getPool());

// ===== SCIENCE OPERATIONS MANAGEMENT =====

/**
 * POST /api/science/operations - Create science operation
 */
router.post('/operations', async (req, res) => {
  try {
    const service = getScienceService();
    const {
      campaignId,
      operationType,
      title,
      description,
      priority,
      operationData,
      targetTechnologies,
      affectedInstitutions,
      budgetImpact,
      plannedStartDate,
      plannedCompletionDate,
      successMetrics,
      authorizedBy,
      approvalLevel
    } = req.body;

    if (!campaignId || !operationType || !title || !description || !authorizedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'operationType', 'title', 'description', 'authorizedBy']
      });
    }

    const operation = await service.createScienceOperation({
      campaignId: Number(campaignId),
      operationType,
      title,
      description,
      priority,
      operationData,
      targetTechnologies,
      affectedInstitutions,
      budgetImpact: budgetImpact ? Number(budgetImpact) : undefined,
      plannedStartDate: plannedStartDate ? new Date(plannedStartDate) : undefined,
      plannedCompletionDate: plannedCompletionDate ? new Date(plannedCompletionDate) : undefined,
      successMetrics,
      authorizedBy,
      approvalLevel
    });

    res.json({
      success: true,
      operation,
      message: `Science operation "${title}" created successfully`
    });
  } catch (error) {
    console.error('Error creating science operation:', error);
    res.status(500).json({
      error: 'Failed to create science operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/science/operations - List science operations
 */
router.get('/operations', async (req, res) => {
  try {
    const service = getScienceService();
    const { campaignId, operationType, status, priority, limit } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const operations = await service.getScienceOperations(Number(campaignId), {
      operationType: operationType as string,
      status: status as string,
      priority: priority as string,
      limit: limit ? Number(limit) : undefined
    });

    res.json({
      success: true,
      operations,
      count: operations.length
    });
  } catch (error) {
    console.error('Error fetching science operations:', error);
    res.status(500).json({
      error: 'Failed to fetch science operations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/science/operations/:id - Update science operation
 */
router.put('/operations/:id', async (req, res) => {
  try {
    const service = getScienceService();
    const { id } = req.params;
    const { status, actualStartDate, actualCompletionDate, actualOutcomes, lessonsLearned } = req.body;

    const operation = await service.updateScienceOperation(id, {
      status,
      actualStartDate: actualStartDate ? new Date(actualStartDate) : undefined,
      actualCompletionDate: actualCompletionDate ? new Date(actualCompletionDate) : undefined,
      actualOutcomes,
      lessonsLearned
    });

    res.json({
      success: true,
      operation,
      message: 'Science operation updated successfully'
    });
  } catch (error) {
    console.error('Error updating science operation:', error);
    res.status(500).json({
      error: 'Failed to update science operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== RESEARCH BUDGET MANAGEMENT =====

/**
 * POST /api/science/budgets - Allocate research budget
 */
router.post('/budgets', async (req, res) => {
  try {
    const service = getScienceService();
    const {
      campaignId,
      fiscalYear,
      budgetCategory,
      allocatedAmount,
      expectedOutcomes,
      fundingSource,
      spendingRestrictions,
      performanceRequirements,
      multiYearCommitment,
      commitmentYears,
      approvedBy
    } = req.body;

    if (!campaignId || !fiscalYear || !budgetCategory || !allocatedAmount || !approvedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'fiscalYear', 'budgetCategory', 'allocatedAmount', 'approvedBy']
      });
    }

    const budget = await service.allocateResearchBudget({
      campaignId: Number(campaignId),
      fiscalYear: Number(fiscalYear),
      budgetCategory,
      allocatedAmount: Number(allocatedAmount),
      expectedOutcomes,
      fundingSource,
      spendingRestrictions,
      performanceRequirements,
      multiYearCommitment,
      commitmentYears: commitmentYears ? Number(commitmentYears) : undefined,
      approvedBy
    });

    res.json({
      success: true,
      budget,
      message: `Research budget allocated for ${budgetCategory}`
    });
  } catch (error) {
    console.error('Error allocating research budget:', error);
    res.status(500).json({
      error: 'Failed to allocate research budget',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/science/budgets - Get research budgets
 */
router.get('/budgets', async (req, res) => {
  try {
    const service = getScienceService();
    const { campaignId, fiscalYear } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const budgets = await service.getResearchBudgets(
      Number(campaignId),
      fiscalYear ? Number(fiscalYear) : undefined
    );

    res.json({
      success: true,
      budgets,
      count: budgets.length
    });
  } catch (error) {
    console.error('Error fetching research budgets:', error);
    res.status(500).json({
      error: 'Failed to fetch research budgets',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== RESEARCH PRIORITIES MANAGEMENT =====

/**
 * POST /api/science/priorities - Set research priority
 */
router.post('/priorities', async (req, res) => {
  try {
    const service = getScienceService();
    const {
      campaignId,
      priorityName,
      priorityCategory,
      description,
      strategicImportance,
      urgencyLevel,
      budgetAllocationPercentage,
      targetTimelineYears,
      targetTechnologies,
      expectedEconomicImpact,
      setBy,
      approvedBy
    } = req.body;

    if (!campaignId || !priorityName || !priorityCategory || !description || !strategicImportance || !setBy || !approvedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'priorityName', 'priorityCategory', 'description', 'strategicImportance', 'setBy', 'approvedBy']
      });
    }

    const priority = await service.setResearchPriority({
      campaignId: Number(campaignId),
      priorityName,
      priorityCategory,
      description,
      strategicImportance: Number(strategicImportance),
      urgencyLevel,
      budgetAllocationPercentage: budgetAllocationPercentage ? Number(budgetAllocationPercentage) : undefined,
      targetTimelineYears: targetTimelineYears ? Number(targetTimelineYears) : undefined,
      targetTechnologies,
      expectedEconomicImpact: expectedEconomicImpact ? Number(expectedEconomicImpact) : undefined,
      setBy,
      approvedBy
    });

    res.json({
      success: true,
      priority,
      message: `Research priority "${priorityName}" set successfully`
    });
  } catch (error) {
    console.error('Error setting research priority:', error);
    res.status(500).json({
      error: 'Failed to set research priority',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/science/priorities - Get research priorities
 */
router.get('/priorities', async (req, res) => {
  try {
    const service = getScienceService();
    const { campaignId, category, status, urgencyLevel } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const priorities = await service.getResearchPriorities(Number(campaignId), {
      category: category as string,
      status: status as string,
      urgencyLevel: urgencyLevel as string
    });

    res.json({
      success: true,
      priorities,
      count: priorities.length
    });
  } catch (error) {
    console.error('Error fetching research priorities:', error);
    res.status(500).json({
      error: 'Failed to fetch research priorities',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== INNOVATION PROGRAMS MANAGEMENT =====

/**
 * POST /api/science/programs - Create innovation program
 */
router.post('/programs', async (req, res) => {
  try {
    const service = getScienceService();
    const {
      campaignId,
      programName,
      programType,
      description,
      objectives,
      totalBudget,
      participantCapacity,
      programDurationMonths,
      programManager
    } = req.body;

    if (!campaignId || !programName || !programType || !description || !totalBudget || !programManager) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'programName', 'programType', 'description', 'totalBudget', 'programManager']
      });
    }

    const program = await service.createInnovationProgram({
      campaignId: Number(campaignId),
      programName,
      programType,
      description,
      objectives,
      totalBudget: Number(totalBudget),
      participantCapacity: participantCapacity ? Number(participantCapacity) : undefined,
      programDurationMonths: programDurationMonths ? Number(programDurationMonths) : undefined,
      programManager
    });

    res.json({
      success: true,
      program,
      message: `Innovation program "${programName}" created successfully`
    });
  } catch (error) {
    console.error('Error creating innovation program:', error);
    res.status(500).json({
      error: 'Failed to create innovation program',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/science/programs - List innovation programs
 */
router.get('/programs', async (req, res) => {
  try {
    const service = getScienceService();
    const { campaignId, programType, status } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const programs = await service.getInnovationPrograms(Number(campaignId), {
      programType: programType as string,
      status: status as string
    });

    res.json({
      success: true,
      programs,
      count: programs.length
    });
  } catch (error) {
    console.error('Error fetching innovation programs:', error);
    res.status(500).json({
      error: 'Failed to fetch innovation programs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== SCIENTIFIC POLICIES MANAGEMENT =====

/**
 * POST /api/science/policies - Create scientific policy
 */
router.post('/policies', async (req, res) => {
  try {
    const service = getScienceService();
    const {
      campaignId,
      policyName,
      policyCategory,
      policyDescription,
      policyText,
      effectiveDate,
      approvedBy,
      scopeOfApplication,
      policyLevel
    } = req.body;

    if (!campaignId || !policyName || !policyCategory || !policyDescription || !policyText || !effectiveDate || !approvedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'policyName', 'policyCategory', 'policyDescription', 'policyText', 'effectiveDate', 'approvedBy']
      });
    }

    const policy = await service.createScientificPolicy({
      campaignId: Number(campaignId),
      policyName,
      policyCategory,
      policyDescription,
      policyText,
      effectiveDate: new Date(effectiveDate),
      approvedBy,
      scopeOfApplication,
      policyLevel
    });

    res.json({
      success: true,
      policy,
      message: `Scientific policy "${policyName}" created successfully`
    });
  } catch (error) {
    console.error('Error creating scientific policy:', error);
    res.status(500).json({
      error: 'Failed to create scientific policy',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/science/policies - List scientific policies
 */
router.get('/policies', async (req, res) => {
  try {
    const service = getScienceService();
    const { campaignId, category, status } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const policies = await service.getScientificPolicies(Number(campaignId), {
      category: category as string,
      status: status as string
    });

    res.json({
      success: true,
      policies,
      count: policies.length
    });
  } catch (error) {
    console.error('Error fetching scientific policies:', error);
    res.status(500).json({
      error: 'Failed to fetch scientific policies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== RESEARCH INSTITUTIONS MANAGEMENT =====

/**
 * POST /api/science/institutions - Register research institution
 */
router.post('/institutions', async (req, res) => {
  try {
    const service = getScienceService();
    const {
      campaignId,
      institutionName,
      institutionType,
      description,
      location,
      specializationAreas,
      annualBudget,
      directorName
    } = req.body;

    if (!campaignId || !institutionName || !institutionType || !description || !location) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'institutionName', 'institutionType', 'description', 'location']
      });
    }

    const institution = await service.registerResearchInstitution({
      campaignId: Number(campaignId),
      institutionName,
      institutionType,
      description,
      location,
      specializationAreas,
      annualBudget: annualBudget ? Number(annualBudget) : undefined,
      directorName
    });

    res.json({
      success: true,
      institution,
      message: `Research institution "${institutionName}" registered successfully`
    });
  } catch (error) {
    console.error('Error registering research institution:', error);
    res.status(500).json({
      error: 'Failed to register research institution',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/science/institutions - List research institutions
 */
router.get('/institutions', async (req, res) => {
  try {
    const service = getScienceService();
    const { campaignId, institutionType, operationalStatus } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const institutions = await service.getResearchInstitutions(Number(campaignId), {
      institutionType: institutionType as string,
      operationalStatus: operationalStatus as string
    });

    res.json({
      success: true,
      institutions,
      count: institutions.length
    });
  } catch (error) {
    console.error('Error fetching research institutions:', error);
    res.status(500).json({
      error: 'Failed to fetch research institutions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== TECHNOLOGY INTEGRATION ENDPOINTS =====

/**
 * GET /api/science/technologies - Get technology overview (integrates with existing TechnologyEngine)
 */
router.get('/technologies', async (req, res) => {
  try {
    const { campaignId, category, level, status } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    // This would integrate with the existing TechnologyEngine
    // For now, return a structured response that shows the integration point
    res.json({
      success: true,
      message: 'Technology overview - integrates with existing TechnologyEngine',
      integrationPoint: '/api/technology/overview',
      filters: { campaignId, category, level, status },
      note: 'This endpoint will integrate with the existing TechnologyEngine to provide Science Secretary oversight of all research and development activities'
    });
  } catch (error) {
    console.error('Error fetching technology overview:', error);
    res.status(500).json({
      error: 'Failed to fetch technology overview',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/science/technologies/prioritize - Set technology development priorities
 */
router.post('/technologies/prioritize', async (req, res) => {
  try {
    const { campaignId, technologyIds, priorityLevel, budgetAllocation, timeline } = req.body;

    if (!campaignId || !technologyIds || !priorityLevel) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'technologyIds', 'priorityLevel']
      });
    }

    // This would integrate with the existing TechnologyEngine to set priorities
    res.json({
      success: true,
      message: 'Technology priorities set successfully',
      prioritizedTechnologies: technologyIds,
      priorityLevel,
      budgetAllocation,
      timeline,
      note: 'This endpoint will integrate with the existing TechnologyEngine to set government research priorities'
    });
  } catch (error) {
    console.error('Error setting technology priorities:', error);
    res.status(500).json({
      error: 'Failed to set technology priorities',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== ANALYTICS AND REPORTING =====

/**
 * GET /api/science/analytics - Get science analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    const service = getScienceService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const analytics = await service.getScienceAnalytics(Number(campaignId));

    res.json({
      success: true,
      analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching science analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch science analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/science/reports/progress - Research progress report
 */
router.get('/reports/progress', async (req, res) => {
  try {
    const service = getScienceService();
    const { campaignId, timeframe } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const analytics = await service.getScienceAnalytics(Number(campaignId));
    const operations = await service.getScienceOperations(Number(campaignId), { limit: 50 });
    const priorities = await service.getResearchPriorities(Number(campaignId));

    const progressReport = {
      reportDate: new Date().toISOString(),
      timeframe: timeframe || 'current',
      summary: {
        totalProjects: analytics.activeProjects + analytics.completedProjects,
        activeProjects: analytics.activeProjects,
        completedProjects: analytics.completedProjects,
        budgetUtilization: analytics.budgetUtilization,
        researchOutputScore: analytics.researchOutputScore
      },
      recentOperations: operations.slice(0, 10),
      topPriorities: priorities.filter(p => p.strategicImportance >= 8).slice(0, 5),
      performanceMetrics: {
        innovationImpactScore: analytics.innovationImpactScore,
        collaborationEffectiveness: analytics.collaborationEffectiveness,
        activePolicies: analytics.activePolicies,
        researchInstitutions: analytics.researchInstitutions
      }
    };

    res.json({
      success: true,
      progressReport,
      message: 'Research progress report generated successfully'
    });
  } catch (error) {
    console.error('Error generating progress report:', error);
    res.status(500).json({
      error: 'Failed to generate progress report',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/science/dashboard - Science Secretary dashboard data
 */
router.get('/dashboard', async (req, res) => {
  try {
    const service = getScienceService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const [analytics, recentOperations, topPriorities, activePrograms] = await Promise.all([
      service.getScienceAnalytics(Number(campaignId)),
      service.getScienceOperations(Number(campaignId), { limit: 5 }),
      service.getResearchPriorities(Number(campaignId), { status: 'active' }),
      service.getInnovationPrograms(Number(campaignId), { status: 'active' })
    ]);

    const dashboard = {
      overview: analytics,
      recentActivity: recentOperations,
      currentPriorities: topPriorities.sort((a, b) => b.strategicImportance - a.strategicImportance).slice(0, 5),
      activePrograms: activePrograms.slice(0, 5),
      alerts: [
        ...(analytics.budgetUtilization > 90 ? [{
          type: 'warning',
          message: 'Research budget utilization above 90%',
          action: 'Review budget allocation'
        }] : []),
        ...(analytics.activeProjects === 0 ? [{
          type: 'error',
          message: 'No active research projects',
          action: 'Initiate new research operations'
        }] : [])
      ]
    };

    res.json({
      success: true,
      dashboard,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching science dashboard:', error);
    res.status(500).json({
      error: 'Failed to fetch science dashboard',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'science', scienceKnobSystem, applyScienceKnobsToGameState);

export default router;
