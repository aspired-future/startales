import express from 'express';
import { getPool } from '../storage/db';
import { CommerceSecretaryService } from './CommerceSecretaryService';
import { TradeEngine } from '../trade/tradeEngine';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system';

const router = express.Router();

// Enhanced AI Knobs for Commerce System
const commerceKnobsData = {
  // Trade Policy & International Commerce
  trade_liberalization_level: 0.7,       // Trade liberalization and market openness level
  tariff_policy_protectionism: 0.4,      // Tariff policy and protectionist measures
  free_trade_agreement_pursuit: 0.8,     // Free trade agreement negotiation and pursuit
  
  // Export Promotion & Competitiveness
  export_promotion_investment: 0.8,      // Export promotion and market development investment
  export_credit_support: 0.7,            // Export credit and financing support programs
  trade_mission_frequency: 0.6,          // Trade mission and international promotion frequency
  
  // Import Regulation & Standards
  import_safety_standards: 0.9,          // Import safety and quality standards enforcement
  customs_efficiency: 0.8,               // Customs processing efficiency and modernization
  anti_dumping_enforcement: 0.7,         // Anti-dumping and unfair trade practice enforcement
  
  // Domestic Commerce & Market Regulation
  domestic_market_competition: 0.8,      // Domestic market competition and antitrust enforcement
  consumer_protection_strength: 0.8,     // Consumer protection and rights enforcement
  commercial_dispute_resolution: 0.7,    // Commercial dispute resolution and arbitration
  
  // Small Business & Entrepreneurship
  small_business_export_support: 0.7,    // Small business export assistance and support
  minority_business_development: 0.7,    // Minority and disadvantaged business development
  entrepreneurship_promotion: 0.8,       // Entrepreneurship promotion and startup support
  
  // Industry Development & Innovation
  strategic_industry_support: 0.6,       // Strategic industry development and support
  manufacturing_competitiveness: 0.7,    // Manufacturing competitiveness and modernization
  innovation_commercialization: 0.8,     // Innovation commercialization and technology transfer
  
  // Economic Data & Analysis
  economic_intelligence_gathering: 0.8,  // Economic intelligence and market analysis
  trade_data_transparency: 0.8,          // Trade data transparency and public reporting
  market_research_investment: 0.7,       // Market research and analysis investment
  
  // Regional & Sectoral Development
  regional_economic_development: 0.6,    // Regional economic development and balance
  sectoral_diversification_support: 0.7, // Economic sectoral diversification support
  rural_commerce_development: 0.6,       // Rural and remote area commerce development
  
  // Digital Commerce & Technology
  e_commerce_regulation: 0.7,            // E-commerce regulation and digital trade policy
  digital_trade_facilitation: 0.8,       // Digital trade facilitation and infrastructure
  cybersecurity_commerce_protection: 0.8, // Cybersecurity protection for commerce
  
  // International Economic Cooperation
  multilateral_trade_engagement: 0.7,    // Multilateral trade organization engagement
  economic_diplomacy_priority: 0.7,      // Economic diplomacy and international relations
  development_aid_trade_linkage: 0.6,    // Development aid and trade linkage programs
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Commerce
const commerceKnobSystem = new EnhancedKnobSystem(commerceKnobsData);

// Apply commerce knobs to game state
function applyCommerceKnobsToGameState() {
  const knobs = commerceKnobSystem.knobs;
  
  // Apply trade policy settings
  const tradePolicy = (knobs.trade_liberalization_level + knobs.tariff_policy_protectionism + 
    knobs.free_trade_agreement_pursuit) / 3;
  
  // Apply export promotion settings
  const exportPromotion = (knobs.export_promotion_investment + knobs.export_credit_support + 
    knobs.trade_mission_frequency) / 3;
  
  // Apply domestic commerce settings
  const domesticCommerce = (knobs.domestic_market_competition + knobs.consumer_protection_strength + 
    knobs.commercial_dispute_resolution) / 3;
  
  // Apply small business support settings
  const smallBusinessSupport = (knobs.small_business_export_support + knobs.minority_business_development + 
    knobs.entrepreneurship_promotion) / 3;
  
  // Apply industry development settings
  const industryDevelopment = (knobs.strategic_industry_support + knobs.manufacturing_competitiveness + 
    knobs.innovation_commercialization) / 3;
  
  // Apply digital commerce settings
  const digitalCommerce = (knobs.e_commerce_regulation + knobs.digital_trade_facilitation + 
    knobs.cybersecurity_commerce_protection) / 3;
  
  console.log('Applied commerce knobs to game state:', {
    tradePolicy,
    exportPromotion,
    domesticCommerce,
    smallBusinessSupport,
    industryDevelopment,
    digitalCommerce
  });
}

// Initialize service
const getCommerceService = () => new CommerceSecretaryService(getPool());

// ===== TRADE POLICY MANAGEMENT =====

/**
 * POST /api/commerce/policies/tariffs - Create tariff policy
 */
router.post('/policies/tariffs', async (req, res) => {
  try {
    const service = getCommerceService();
    const {
      campaignId,
      targetResource,
      targetPartner,
      targetRoute,
      tariffRate,
      effectiveDate,
      expirationDate,
      justification,
      createdBy
    } = req.body;

    if (!campaignId || !tariffRate || !effectiveDate || !justification || !createdBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'tariffRate', 'effectiveDate', 'justification', 'createdBy']
      });
    }

    // Validate resource if specified
    if (targetResource) {
      const resource = TradeEngine.getResource(targetResource);
      if (!resource) {
        return res.status(400).json({
          error: 'Invalid resource',
          message: `Resource ${targetResource} not found`,
          validResources: TradeEngine.getTradeResources().map(r => r.id)
        });
      }
    }

    const policy = await service.createTradePolicy(campaignId, {
      policyType: 'tariff',
      targetResource,
      targetPartner,
      targetRoute,
      policyValue: Number(tariffRate),
      effectiveDate: new Date(effectiveDate),
      expirationDate: expirationDate ? new Date(expirationDate) : undefined,
      justification,
      economicImpact: {
        estimatedRevenueIncrease: Number(tariffRate) * 100000, // Placeholder calculation
        expectedTradeReduction: Number(tariffRate) * 0.1
      },
      status: 'active',
      createdBy
    });

    res.json({
      success: true,
      policy,
      message: `Tariff policy created: ${tariffRate * 100}% on ${targetResource || 'all resources'}`
    });
  } catch (error) {
    console.error('Error creating tariff policy:', error);
    res.status(500).json({
      error: 'Failed to create tariff policy',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/commerce/policies/tariffs - Get tariff policies
 */
router.get('/policies/tariffs', async (req, res) => {
  try {
    const service = getCommerceService();
    const { campaignId, status, targetResource } = req.query;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const policies = await service.getTradePolicies(Number(campaignId), {
      policyType: 'tariff',
      status: status as string,
      targetResource: targetResource as string
    });

    res.json({
      success: true,
      policies,
      count: policies.length
    });
  } catch (error) {
    console.error('Error fetching tariff policies:', error);
    res.status(500).json({
      error: 'Failed to fetch tariff policies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/commerce/policies/tariffs/:id/status - Update tariff policy status
 */
router.put('/policies/tariffs/:id/status', async (req, res) => {
  try {
    const service = getCommerceService();
    const { id } = req.params;
    const { status, approvedBy } = req.body;

    if (!status || !['active', 'expired', 'suspended', 'repealed'].includes(status)) {
      return res.status(400).json({
        error: 'Valid status is required',
        validStatuses: ['active', 'expired', 'suspended', 'repealed']
      });
    }

    const policy = await service.updateTradePolicyStatus(id, status, approvedBy);

    res.json({
      success: true,
      policy,
      message: `Tariff policy status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating tariff policy status:', error);
    res.status(500).json({
      error: 'Failed to update tariff policy status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== BUSINESS REGISTRY =====

/**
 * POST /api/commerce/businesses/register - Register new business
 */
router.post('/businesses/register', async (req, res) => {
  try {
    const service = getCommerceService();
    const {
      campaignId,
      businessName,
      businessType,
      industrySector,
      annualRevenue,
      employeeCount,
      contactInfo,
      businessAddress
    } = req.body;

    if (!campaignId || !businessName || !businessType || !industrySector) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'businessName', 'businessType', 'industrySector']
      });
    }

    const business = await service.registerBusiness(campaignId, {
      businessName,
      businessType,
      industrySector,
      licenseStatus: 'active',
      complianceScore: 1.0,
      annualRevenue: Number(annualRevenue) || 0,
      employeeCount: Number(employeeCount) || 0,
      regulatoryFlags: [],
      contactInfo: contactInfo || {},
      businessAddress,
      taxId: `TAX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    res.json({
      success: true,
      business,
      message: `Business "${businessName}" registered successfully`
    });
  } catch (error) {
    console.error('Error registering business:', error);
    res.status(500).json({
      error: 'Failed to register business',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/commerce/businesses - Get registered businesses
 */
router.get('/businesses', async (req, res) => {
  try {
    const service = getCommerceService();
    const { campaignId, businessType, industrySector, licenseStatus, minComplianceScore } = req.query;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const businesses = await service.getBusinesses(Number(campaignId), {
      businessType: businessType as string,
      industrySector: industrySector as string,
      licenseStatus: licenseStatus as string,
      minComplianceScore: minComplianceScore ? Number(minComplianceScore) : undefined
    });

    res.json({
      success: true,
      businesses,
      count: businesses.length
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({
      error: 'Failed to fetch businesses',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/commerce/businesses/:id/license - Update business license status
 */
router.put('/businesses/:id/license', async (req, res) => {
  try {
    const service = getCommerceService();
    const { id } = req.params;
    const { licenseStatus, reason } = req.body;

    if (!licenseStatus || !['active', 'suspended', 'revoked', 'expired', 'pending'].includes(licenseStatus)) {
      return res.status(400).json({
        error: 'Valid license status is required',
        validStatuses: ['active', 'suspended', 'revoked', 'expired', 'pending']
      });
    }

    const business = await service.updateBusinessLicense(id, licenseStatus, reason);

    res.json({
      success: true,
      business,
      message: `Business license status updated to ${licenseStatus}`
    });
  } catch (error) {
    console.error('Error updating business license:', error);
    res.status(500).json({
      error: 'Failed to update business license',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== MARKET INTELLIGENCE =====

/**
 * POST /api/commerce/intelligence/collect-data - Collect market intelligence
 */
router.post('/intelligence/collect-data', async (req, res) => {
  try {
    const service = getCommerceService();
    const {
      campaignId,
      intelligenceType,
      targetMarket,
      dataPoints,
      analystNotes,
      classification
    } = req.body;

    if (!campaignId || !intelligenceType || !targetMarket) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'intelligenceType', 'targetMarket']
      });
    }

    const intelligence = await service.collectMarketIntelligence(campaignId, {
      intelligenceType,
      targetMarket,
      dataPoints: dataPoints || {},
      analysisResults: {},
      confidenceLevel: 0.7,
      analystNotes,
      actionableInsights: [],
      classification: classification || 'internal',
      sourceReliability: 'medium'
    });

    res.json({
      success: true,
      intelligence,
      message: `Market intelligence collected for ${targetMarket}`
    });
  } catch (error) {
    console.error('Error collecting market intelligence:', error);
    res.status(500).json({
      error: 'Failed to collect market intelligence',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/commerce/intelligence/market-analysis - Get market analysis
 */
router.get('/intelligence/market-analysis', async (req, res) => {
  try {
    const service = getCommerceService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    // Generate comprehensive trade data analysis
    const analysis = await service.analyzeTradeData(Number(campaignId));

    res.json({
      success: true,
      analysis,
      message: 'Market analysis completed'
    });
  } catch (error) {
    console.error('Error performing market analysis:', error);
    res.status(500).json({
      error: 'Failed to perform market analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/commerce/intelligence/reports - Get intelligence reports
 */
router.get('/intelligence/reports', async (req, res) => {
  try {
    const service = getCommerceService();
    const { campaignId, intelligenceType, targetMarket, minConfidenceLevel, classification } = req.query;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const reports = await service.getMarketIntelligence(Number(campaignId), {
      intelligenceType: intelligenceType as string,
      targetMarket: targetMarket as string,
      minConfidenceLevel: minConfidenceLevel ? Number(minConfidenceLevel) : undefined,
      classification: classification as string
    });

    res.json({
      success: true,
      reports,
      count: reports.length
    });
  } catch (error) {
    console.error('Error fetching intelligence reports:', error);
    res.status(500).json({
      error: 'Failed to fetch intelligence reports',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== ECONOMIC DEVELOPMENT =====

/**
 * POST /api/commerce/development/projects - Create development project
 */
router.post('/development/projects', async (req, res) => {
  try {
    const service = getCommerceService();
    const {
      campaignId,
      projectName,
      projectType,
      targetSector,
      budgetAllocated,
      expectedOutcomes,
      startDate,
      targetCompletion,
      projectManager
    } = req.body;

    if (!campaignId || !projectName || !projectType || !startDate || !targetCompletion) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'projectName', 'projectType', 'startDate', 'targetCompletion']
      });
    }

    const project = await service.createEconomicDevelopmentProject(campaignId, {
      projectName,
      projectType,
      targetSector,
      budgetAllocated: Number(budgetAllocated) || 0,
      budgetSpent: 0,
      expectedOutcomes: expectedOutcomes || {},
      actualOutcomes: {},
      status: 'planning',
      startDate: new Date(startDate),
      targetCompletion: new Date(targetCompletion),
      projectManager,
      stakeholders: [],
      riskAssessment: {},
      successMetrics: {}
    });

    res.json({
      success: true,
      project,
      message: `Economic development project "${projectName}" created`
    });
  } catch (error) {
    console.error('Error creating development project:', error);
    res.status(500).json({
      error: 'Failed to create development project',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/commerce/development/projects - Get development projects
 */
router.get('/development/projects', async (req, res) => {
  try {
    const service = getCommerceService();
    const { campaignId, projectType, status, targetSector } = req.query;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const projects = await service.getEconomicDevelopmentProjects(Number(campaignId), {
      projectType: projectType as string,
      status: status as string,
      targetSector: targetSector as string
    });

    res.json({
      success: true,
      projects,
      count: projects.length
    });
  } catch (error) {
    console.error('Error fetching development projects:', error);
    res.status(500).json({
      error: 'Failed to fetch development projects',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== OPERATIONS & ANALYTICS =====

/**
 * GET /api/commerce/operations - Get commerce operations
 */
router.get('/operations', async (req, res) => {
  try {
    const service = getCommerceService();
    const { campaignId, operationType, status, priority } = req.query;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const operations = await service.getOperations(Number(campaignId), {
      operationType: operationType as string,
      status: status as string,
      priority: priority as string
    });

    res.json({
      success: true,
      operations,
      count: operations.length
    });
  } catch (error) {
    console.error('Error fetching operations:', error);
    res.status(500).json({
      error: 'Failed to fetch operations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/commerce/operations/execute - Execute commerce operation
 */
router.post('/operations/execute', async (req, res) => {
  try {
    const service = getCommerceService();
    const {
      campaignId,
      operationType,
      title,
      description,
      parameters,
      priority,
      assignedTo
    } = req.body;

    if (!campaignId || !operationType || !title || !description) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'operationType', 'title', 'description']
      });
    }

    const operation = await service.createOperation(campaignId, {
      operationType,
      title,
      description,
      status: 'active',
      parameters: parameters || {},
      results: {},
      priority: priority || 'medium',
      assignedTo
    });

    res.json({
      success: true,
      operation,
      message: `Commerce operation "${title}" initiated`
    });
  } catch (error) {
    console.error('Error executing operation:', error);
    res.status(500).json({
      error: 'Failed to execute operation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/commerce/analytics/dashboard - Get commerce dashboard data
 */
router.get('/analytics/dashboard', async (req, res) => {
  try {
    const service = getCommerceService();
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    const analytics = await service.getDepartmentAnalytics(Number(campaignId));

    res.json({
      success: true,
      analytics,
      message: 'Commerce Department analytics retrieved'
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/commerce/resources - Get available trade resources
 */
router.get('/resources', async (req, res) => {
  try {
    const resources = TradeEngine.getTradeResources();

    res.json({
      success: true,
      resources,
      count: resources.length
    });
  } catch (error) {
    console.error('Error fetching trade resources:', error);
    res.status(500).json({
      error: 'Failed to fetch trade resources',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== TRADE PACT INTEGRATION =====

/**
 * POST /api/commerce/trade-pacts/initiate - Initiate trade pact negotiation
 */
router.post('/trade-pacts/initiate', async (req, res) => {
  try {
    const { campaignId, pactType, memberCivilizations, leadNegotiator } = req.body;
    
    if (!campaignId || !pactType || !memberCivilizations || !leadNegotiator) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'pactType', 'memberCivilizations', 'leadNegotiator']
      });
    }

    const service = getCommerceService();
    const result = await service.initiateTradePactNegotiation(
      campaignId, 
      pactType, 
      memberCivilizations, 
      leadNegotiator
    );

    res.json({
      success: true,
      data: result,
      message: 'Trade pact negotiation initiated successfully'
    });
  } catch (error) {
    console.error('Error initiating trade pact negotiation:', error);
    res.status(500).json({
      error: 'Failed to initiate trade pact negotiation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/commerce/trade-pacts/compliance/:campaignId/:civilizationId - Monitor trade pact compliance
 */
router.get('/trade-pacts/compliance/:campaignId/:civilizationId', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const civilizationId = parseInt(req.params.civilizationId);
    
    const service = getCommerceService();
    const complianceReport = await service.monitorTradePactCompliance(campaignId, civilizationId);

    res.json({
      success: true,
      data: complianceReport,
      message: 'Trade pact compliance report generated'
    });
  } catch (error) {
    console.error('Error monitoring trade pact compliance:', error);
    res.status(500).json({
      error: 'Failed to monitor trade pact compliance',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/commerce/trade-pacts/impact/:campaignId/:civilizationId - Analyze trade pact economic impact
 */
router.get('/trade-pacts/impact/:campaignId/:civilizationId', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const civilizationId = parseInt(req.params.civilizationId);
    const pactId = req.query.pact_id ? parseInt(req.query.pact_id as string) : undefined;
    
    const service = getCommerceService();
    const impactAnalysis = await service.analyzeTradePactImpact(campaignId, civilizationId, pactId);

    res.json({
      success: true,
      data: impactAnalysis,
      message: 'Trade pact economic impact analysis completed'
    });
  } catch (error) {
    console.error('Error analyzing trade pact impact:', error);
    res.status(500).json({
      error: 'Failed to analyze trade pact impact',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/commerce/trade-pacts/dashboard/:campaignId/:civilizationId - Get trade pact dashboard
 */
router.get('/trade-pacts/dashboard/:campaignId/:civilizationId', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.campaignId);
    const civilizationId = parseInt(req.params.civilizationId);
    
    const service = getCommerceService();
    const dashboard = await service.getTradePactDashboard(campaignId, civilizationId);

    res.json({
      success: true,
      data: dashboard,
      message: 'Trade pact dashboard data retrieved'
    });
  } catch (error) {
    console.error('Error getting trade pact dashboard:', error);
    res.status(500).json({
      error: 'Failed to get trade pact dashboard',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'commerce', commerceKnobSystem, applyCommerceKnobsToGameState);

export default router;
