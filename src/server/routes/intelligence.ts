/**
 * Intelligence System API Routes
 * Task 46: Information Classification & Espionage System
 * 
 * Comprehensive API for information classification, espionage operations,
 * and intelligence market functionality.
 */

import { Router } from 'express';
import { 
  informationClassification, 
  InformationType, 
  SecurityLevel 
} from '../intelligence/informationClassification.js';
import { 
  espionageOperations, 
  SpyType, 
  OperationType 
} from '../intelligence/espionageOperations.js';
import { 
  intelligenceMarket, 
  MarketRole, 
  TransactionType, 
  MarketTier 
} from '../intelligence/intelligenceMarket.js';

const router = Router();

// ============================================================================
// INFORMATION CLASSIFICATION ROUTES
// ============================================================================

/**
 * POST /api/intelligence/classify
 * Classify new information and assign security level
 */
router.post('/classify', async (req, res) => {
  try {
    const { title, content, type, sourceOrganization, metadata = {} } = req.body;

    if (!title || !content || !type || !sourceOrganization) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, content, type, sourceOrganization' 
      });
    }

    if (!Object.values(InformationType).includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid information type',
        validTypes: Object.values(InformationType)
      });
    }

    const asset = informationClassification.classifyInformation(
      title,
      content,
      type as InformationType,
      sourceOrganization,
      metadata
    );

    res.json({
      success: true,
      data: asset
    });
  } catch (error) {
    console.error('Error classifying information:', error);
    res.status(500).json({ 
      error: 'Failed to classify information',
      details: error.message 
    });
  }
});

/**
 * POST /api/intelligence/access-request
 * Request access to classified information
 */
router.post('/access-request', async (req, res) => {
  try {
    const { requesterId, requesterOrganization, assetId, justification } = req.body;

    if (!requesterId || !requesterOrganization || !assetId || !justification) {
      return res.status(400).json({ 
        error: 'Missing required fields: requesterId, requesterOrganization, assetId, justification' 
      });
    }

    const accessRequest = informationClassification.requestAccess(
      requesterId,
      requesterOrganization,
      assetId,
      justification
    );

    res.json({
      success: true,
      data: accessRequest
    });
  } catch (error) {
    console.error('Error creating access request:', error);
    res.status(500).json({ 
      error: 'Failed to create access request',
      details: error.message 
    });
  }
});

/**
 * POST /api/intelligence/access-request/:requestId/process
 * Approve or deny access request
 */
router.post('/access-request/:requestId/process', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { approverId, approved, conditions } = req.body;

    if (!approverId || typeof approved !== 'boolean') {
      return res.status(400).json({ 
        error: 'Missing required fields: approverId, approved' 
      });
    }

    const processedRequest = informationClassification.processAccessRequest(
      requestId,
      approverId,
      approved,
      conditions
    );

    res.json({
      success: true,
      data: processedRequest
    });
  } catch (error) {
    console.error('Error processing access request:', error);
    res.status(500).json({ 
      error: 'Failed to process access request',
      details: error.message 
    });
  }
});

/**
 * GET /api/intelligence/assets/:assetId
 * Access information asset (if authorized)
 */
router.get('/assets/:assetId', async (req, res) => {
  try {
    const { assetId } = req.params;
    const { requesterId } = req.query;

    if (!requesterId) {
      return res.status(400).json({ 
        error: 'Missing required parameter: requesterId' 
      });
    }

    const asset = informationClassification.accessInformation(assetId, requesterId as string);

    res.json({
      success: true,
      data: asset
    });
  } catch (error) {
    console.error('Error accessing information:', error);
    res.status(403).json({ 
      error: 'Access denied',
      details: error.message 
    });
  }
});

/**
 * GET /api/intelligence/assets
 * Get information assets (filtered by access level)
 */
router.get('/assets', async (req, res) => {
  try {
    const { accessLevel = 1, search, type, securityLevel, tags } = req.query;

    let assets = informationClassification.getInformationAssets(Number(accessLevel));

    if (search || type || securityLevel || tags) {
      assets = informationClassification.searchInformation(
        search as string || '',
        type as InformationType,
        securityLevel as SecurityLevel,
        tags ? (tags as string).split(',') : undefined,
        Number(accessLevel)
      );
    }

    res.json({
      success: true,
      data: assets,
      total: assets.length
    });
  } catch (error) {
    console.error('Error getting information assets:', error);
    res.status(500).json({ 
      error: 'Failed to get information assets',
      details: error.message 
    });
  }
});

/**
 * POST /api/intelligence/reports
 * Create intelligence report from multiple assets
 */
router.post('/reports', async (req, res) => {
  try {
    const { title, summary, assetIds, analysisLevel, createdBy } = req.body;

    if (!title || !summary || !assetIds || !analysisLevel || !createdBy) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, summary, assetIds, analysisLevel, createdBy' 
      });
    }

    if (!Array.isArray(assetIds)) {
      return res.status(400).json({ 
        error: 'assetIds must be an array' 
      });
    }

    const validAnalysisLevels = ['raw', 'processed', 'analyzed', 'strategic'];
    if (!validAnalysisLevels.includes(analysisLevel)) {
      return res.status(400).json({ 
        error: 'Invalid analysis level',
        validLevels: validAnalysisLevels
      });
    }

    const report = informationClassification.createIntelligenceReport(
      title,
      summary,
      assetIds,
      analysisLevel,
      createdBy
    );

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error creating intelligence report:', error);
    res.status(500).json({ 
      error: 'Failed to create intelligence report',
      details: error.message 
    });
  }
});

// ============================================================================
// ESPIONAGE OPERATIONS ROUTES
// ============================================================================

/**
 * POST /api/intelligence/agents/recruit
 * Recruit a new spy agent
 */
router.post('/agents/recruit', async (req, res) => {
  try {
    const { codename, type, organization, targetOrganization, coverIdentity, handler } = req.body;

    if (!codename || !type || !organization || !targetOrganization || !coverIdentity || !handler) {
      return res.status(400).json({ 
        error: 'Missing required fields: codename, type, organization, targetOrganization, coverIdentity, handler' 
      });
    }

    if (!Object.values(SpyType).includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid spy type',
        validTypes: Object.values(SpyType)
      });
    }

    const agent = espionageOperations.recruitAgent(
      codename,
      type as SpyType,
      organization,
      targetOrganization,
      coverIdentity,
      handler
    );

    res.json({
      success: true,
      data: agent
    });
  } catch (error) {
    console.error('Error recruiting agent:', error);
    res.status(500).json({ 
      error: 'Failed to recruit agent',
      details: error.message 
    });
  }
});

/**
 * GET /api/intelligence/agents
 * Get all spy agents
 */
router.get('/agents', async (req, res) => {
  try {
    const { status, type, organization } = req.query;

    let agents = espionageOperations.getSpyAgents();

    // Apply filters
    if (status) {
      agents = agents.filter(agent => agent.status === status);
    }
    if (type) {
      agents = agents.filter(agent => agent.type === type);
    }
    if (organization) {
      agents = agents.filter(agent => 
        agent.organization === organization || agent.targetOrganization === organization
      );
    }

    res.json({
      success: true,
      data: agents,
      total: agents.length
    });
  } catch (error) {
    console.error('Error getting agents:', error);
    res.status(500).json({ 
      error: 'Failed to get agents',
      details: error.message 
    });
  }
});

/**
 * POST /api/intelligence/operations/plan
 * Plan a new espionage operation
 */
router.post('/operations/plan', async (req, res) => {
  try {
    const { 
      codename, 
      type, 
      description, 
      targetOrganization, 
      operatingOrganization, 
      objectives, 
      handler, 
      approvedBy 
    } = req.body;

    if (!codename || !type || !description || !targetOrganization || 
        !operatingOrganization || !objectives || !handler || !approvedBy) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    if (!Object.values(OperationType).includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid operation type',
        validTypes: Object.values(OperationType)
      });
    }

    if (!Array.isArray(objectives)) {
      return res.status(400).json({ 
        error: 'objectives must be an array' 
      });
    }

    const operation = espionageOperations.planOperation(
      codename,
      type as OperationType,
      description,
      targetOrganization,
      operatingOrganization,
      objectives,
      handler,
      approvedBy
    );

    res.json({
      success: true,
      data: operation
    });
  } catch (error) {
    console.error('Error planning operation:', error);
    res.status(500).json({ 
      error: 'Failed to plan operation',
      details: error.message 
    });
  }
});

/**
 * POST /api/intelligence/operations/:operationId/assign-agents
 * Assign agents to an operation
 */
router.post('/operations/:operationId/assign-agents', async (req, res) => {
  try {
    const { operationId } = req.params;
    const { agentIds } = req.body;

    if (!Array.isArray(agentIds)) {
      return res.status(400).json({ 
        error: 'agentIds must be an array' 
      });
    }

    const operation = espionageOperations.assignAgentsToOperation(operationId, agentIds);

    res.json({
      success: true,
      data: operation
    });
  } catch (error) {
    console.error('Error assigning agents:', error);
    res.status(500).json({ 
      error: 'Failed to assign agents',
      details: error.message 
    });
  }
});

/**
 * POST /api/intelligence/operations/:operationId/execute
 * Execute an espionage operation
 */
router.post('/operations/:operationId/execute', async (req, res) => {
  try {
    const { operationId } = req.params;

    const operation = espionageOperations.executeOperation(operationId);

    res.json({
      success: true,
      data: operation
    });
  } catch (error) {
    console.error('Error executing operation:', error);
    res.status(500).json({ 
      error: 'Failed to execute operation',
      details: error.message 
    });
  }
});

/**
 * GET /api/intelligence/operations
 * Get all espionage operations
 */
router.get('/operations', async (req, res) => {
  try {
    const { status, type, organization } = req.query;

    let operations = espionageOperations.getOperations();

    // Apply filters
    if (status) {
      operations = operations.filter(op => op.status === status);
    }
    if (type) {
      operations = operations.filter(op => op.type === type);
    }
    if (organization) {
      operations = operations.filter(op => 
        op.operatingOrganization === organization || op.targetOrganization === organization
      );
    }

    res.json({
      success: true,
      data: operations,
      total: operations.length
    });
  } catch (error) {
    console.error('Error getting operations:', error);
    res.status(500).json({ 
      error: 'Failed to get operations',
      details: error.message 
    });
  }
});

/**
 * GET /api/intelligence/agents/available
 * Get available agents for operation type
 */
router.get('/agents/available', async (req, res) => {
  try {
    const { operationType, targetOrganization } = req.query;

    if (!operationType) {
      return res.status(400).json({ 
        error: 'Missing required parameter: operationType' 
      });
    }

    if (!Object.values(OperationType).includes(operationType as OperationType)) {
      return res.status(400).json({ 
        error: 'Invalid operation type',
        validTypes: Object.values(OperationType)
      });
    }

    const agents = espionageOperations.getAvailableAgents(
      operationType as OperationType,
      targetOrganization as string
    );

    res.json({
      success: true,
      data: agents,
      total: agents.length
    });
  } catch (error) {
    console.error('Error getting available agents:', error);
    res.status(500).json({ 
      error: 'Failed to get available agents',
      details: error.message 
    });
  }
});

/**
 * GET /api/intelligence/counter-intelligence/alerts
 * Get counter-intelligence alerts
 */
router.get('/counter-intelligence/alerts', async (req, res) => {
  try {
    const { severity, status, type } = req.query;

    let alerts = espionageOperations.getCounterIntelligenceAlerts();

    // Apply filters
    if (severity) {
      alerts = alerts.filter(alert => alert.severity === severity);
    }
    if (status) {
      alerts = alerts.filter(alert => alert.investigationStatus === status);
    }
    if (type) {
      alerts = alerts.filter(alert => alert.type === type);
    }

    res.json({
      success: true,
      data: alerts,
      total: alerts.length
    });
  } catch (error) {
    console.error('Error getting counter-intelligence alerts:', error);
    res.status(500).json({ 
      error: 'Failed to get counter-intelligence alerts',
      details: error.message 
    });
  }
});

// ============================================================================
// INTELLIGENCE MARKET ROUTES
// ============================================================================

/**
 * POST /api/intelligence/market/participants/register
 * Register a new market participant
 */
router.post('/market/participants/register', async (req, res) => {
  try {
    const { name, organization, role, marketTier, specializations } = req.body;

    if (!name || !organization || !role || !marketTier || !specializations) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, organization, role, marketTier, specializations' 
      });
    }

    if (!Object.values(MarketRole).includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid market role',
        validRoles: Object.values(MarketRole)
      });
    }

    if (!Object.values(MarketTier).includes(marketTier)) {
      return res.status(400).json({ 
        error: 'Invalid market tier',
        validTiers: Object.values(MarketTier)
      });
    }

    if (!Array.isArray(specializations)) {
      return res.status(400).json({ 
        error: 'specializations must be an array' 
      });
    }

    const participant = intelligenceMarket.registerParticipant(
      name,
      organization,
      role as MarketRole,
      marketTier as MarketTier,
      specializations as InformationType[]
    );

    res.json({
      success: true,
      data: participant
    });
  } catch (error) {
    console.error('Error registering market participant:', error);
    res.status(500).json({ 
      error: 'Failed to register market participant',
      details: error.message 
    });
  }
});

/**
 * POST /api/intelligence/market/listings
 * Create a new intelligence listing
 */
router.post('/market/listings', async (req, res) => {
  try {
    const { 
      assetId, 
      sellerId, 
      title, 
      description, 
      category, 
      securityLevel, 
      listingType, 
      basePrice,
      options = {}
    } = req.body;

    if (!assetId || !sellerId || !title || !description || !category || 
        !securityLevel || !listingType || !basePrice) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    if (!Object.values(InformationType).includes(category)) {
      return res.status(400).json({ 
        error: 'Invalid information category',
        validCategories: Object.values(InformationType)
      });
    }

    if (!Object.values(SecurityLevel).includes(securityLevel)) {
      return res.status(400).json({ 
        error: 'Invalid security level',
        validLevels: Object.values(SecurityLevel)
      });
    }

    if (!Object.values(TransactionType).includes(listingType)) {
      return res.status(400).json({ 
        error: 'Invalid transaction type',
        validTypes: Object.values(TransactionType)
      });
    }

    const listing = intelligenceMarket.createListing(
      assetId,
      sellerId,
      title,
      description,
      category as InformationType,
      securityLevel as SecurityLevel,
      listingType as TransactionType,
      Number(basePrice),
      options
    );

    res.json({
      success: true,
      data: listing
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ 
      error: 'Failed to create listing',
      details: error.message 
    });
  }
});

/**
 * GET /api/intelligence/market/listings/search
 * Search intelligence listings
 */
router.get('/market/listings/search', async (req, res) => {
  try {
    const { 
      query = '', 
      category, 
      securityLevel, 
      marketTier, 
      minPrice, 
      maxPrice, 
      freshness, 
      reliability, 
      tags, 
      geographicRelevance,
      participantId 
    } = req.query;

    const filters: any = {};
    
    if (category) filters.category = category as InformationType;
    if (securityLevel) filters.securityLevel = securityLevel as SecurityLevel;
    if (marketTier) filters.marketTier = marketTier as MarketTier;
    if (minPrice || maxPrice) {
      filters.priceRange = {
        min: minPrice ? Number(minPrice) : 0,
        max: maxPrice ? Number(maxPrice) : Infinity
      };
    }
    if (freshness) filters.freshness = Number(freshness);
    if (reliability) filters.reliability = Number(reliability);
    if (tags) filters.tags = (tags as string).split(',');
    if (geographicRelevance) filters.geographicRelevance = (geographicRelevance as string).split(',');

    const listings = intelligenceMarket.searchListings(
      query as string,
      filters,
      participantId as string
    );

    res.json({
      success: true,
      data: listings,
      total: listings.length
    });
  } catch (error) {
    console.error('Error searching listings:', error);
    res.status(500).json({ 
      error: 'Failed to search listings',
      details: error.message 
    });
  }
});

/**
 * POST /api/intelligence/market/transactions/initiate
 * Initiate a transaction
 */
router.post('/market/transactions/initiate', async (req, res) => {
  try {
    const { listingId, buyerId, transactionType, offeredPrice, brokerId } = req.body;

    if (!listingId || !buyerId || !transactionType) {
      return res.status(400).json({ 
        error: 'Missing required fields: listingId, buyerId, transactionType' 
      });
    }

    if (!Object.values(TransactionType).includes(transactionType)) {
      return res.status(400).json({ 
        error: 'Invalid transaction type',
        validTypes: Object.values(TransactionType)
      });
    }

    const transaction = intelligenceMarket.initiateTransaction(
      listingId,
      buyerId,
      transactionType as TransactionType,
      offeredPrice ? Number(offeredPrice) : undefined,
      brokerId
    );

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error initiating transaction:', error);
    res.status(500).json({ 
      error: 'Failed to initiate transaction',
      details: error.message 
    });
  }
});

/**
 * POST /api/intelligence/market/transactions/:transactionId/complete
 * Complete a transaction
 */
router.post('/market/transactions/:transactionId/complete', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { buyerRating, sellerRating, buyerFeedback, sellerFeedback } = req.body;

    const transaction = intelligenceMarket.completeTransaction(
      transactionId,
      buyerRating ? Number(buyerRating) : undefined,
      sellerRating ? Number(sellerRating) : undefined,
      buyerFeedback,
      sellerFeedback
    );

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error completing transaction:', error);
    res.status(500).json({ 
      error: 'Failed to complete transaction',
      details: error.message 
    });
  }
});

/**
 * GET /api/intelligence/market/analytics
 * Get market analytics
 */
router.get('/market/analytics', async (req, res) => {
  try {
    const analytics = intelligenceMarket.getMarketAnalytics();

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error getting market analytics:', error);
    res.status(500).json({ 
      error: 'Failed to get market analytics',
      details: error.message 
    });
  }
});

/**
 * POST /api/intelligence/market/pricing/calculate
 * Calculate dynamic pricing for information
 */
router.post('/market/pricing/calculate', async (req, res) => {
  try {
    const { category, securityLevel, freshness, reliability, strategicValue } = req.body;

    if (!category || !securityLevel || freshness === undefined || 
        reliability === undefined || strategicValue === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: category, securityLevel, freshness, reliability, strategicValue' 
      });
    }

    const price = intelligenceMarket.calculateDynamicPrice(
      category as InformationType,
      securityLevel as SecurityLevel,
      Number(freshness),
      Number(reliability),
      Number(strategicValue)
    );

    res.json({
      success: true,
      data: {
        suggestedPrice: price,
        category,
        securityLevel,
        freshness: Number(freshness),
        reliability: Number(reliability),
        strategicValue: Number(strategicValue)
      }
    });
  } catch (error) {
    console.error('Error calculating pricing:', error);
    res.status(500).json({ 
      error: 'Failed to calculate pricing',
      details: error.message 
    });
  }
});

// ============================================================================
// UTILITY ROUTES
// ============================================================================

/**
 * GET /api/intelligence/enums
 * Get all enumeration values for the intelligence system
 */
router.get('/enums', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        InformationType: Object.values(InformationType),
        SecurityLevel: Object.values(SecurityLevel),
        SpyType: Object.values(SpyType),
        OperationType: Object.values(OperationType),
        MarketRole: Object.values(MarketRole),
        TransactionType: Object.values(TransactionType),
        MarketTier: Object.values(MarketTier)
      }
    });
  } catch (error) {
    console.error('Error getting enums:', error);
    res.status(500).json({ 
      error: 'Failed to get enums',
      details: error.message 
    });
  }
});

export default router;
