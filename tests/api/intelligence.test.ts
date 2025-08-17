/**
 * Intelligence System API Tests
 * Task 46: Information Classification & Espionage System
 * 
 * Comprehensive test suite for:
 * - Information Classification & Security
 * - Espionage Operations & Spy Networks
 * - Intelligence Market & Trading
 * - Counter-Intelligence Operations
 */

import request from 'supertest';
import express from 'express';
import intelligenceRouter from '../../src/server/routes/intelligence.js';
import { 
  informationClassification, 
  InformationType, 
  SecurityLevel 
} from '../../src/server/intelligence/informationClassification.js';
import { 
  espionageOperations, 
  SpyType, 
  OperationType 
} from '../../src/server/intelligence/espionageOperations.js';
import { 
  intelligenceMarket, 
  MarketRole, 
  TransactionType, 
  MarketTier 
} from '../../src/server/intelligence/intelligenceMarket.js';

// Test app setup
const app = express();
app.use(express.json());
app.use('/api/intelligence', intelligenceRouter);

describe('Intelligence System API', () => {
  
  // ============================================================================
  // INFORMATION CLASSIFICATION TESTS
  // ============================================================================
  
  describe('Information Classification', () => {
    
    test('POST /api/intelligence/classify - should classify new information', async () => {
      const informationData = {
        title: 'Advanced Quantum Computing Research',
        content: 'Classified research data on quantum computing breakthroughs including proprietary algorithms and experimental results.',
        type: 'RESEARCH_DATA',
        sourceOrganization: 'TechCorp Labs',
        metadata: {
          acquisitionMethod: 'research',
          riskLevel: 'medium'
        }
      };

      const response = await request(app)
        .post('/api/intelligence/classify')
        .send(informationData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(informationData.title);
      expect(response.body.data.type).toBe(informationData.type);
      expect(response.body.data.sourceOrganization).toBe(informationData.sourceOrganization);
      expect(response.body.data).toHaveProperty('securityLevel');
      expect(response.body.data).toHaveProperty('strategicValue');
      expect(response.body.data.strategicValue).toBeGreaterThan(0);
      expect(response.body.data.strategicValue).toBeLessThanOrEqual(100);
      expect(response.body.data).toHaveProperty('accessLevel');
      expect(response.body.data.tags).toBeInstanceOf(Array);
      expect(response.body.data.freshness).toBe(1.0);
    });

    test('POST /api/intelligence/classify - should handle missing required fields', async () => {
      const incompleteData = {
        title: 'Test Information',
        // Missing content, type, and sourceOrganization
      };

      const response = await request(app)
        .post('/api/intelligence/classify')
        .send(incompleteData)
        .expect(400);

      expect(response.body.error).toContain('Missing required fields');
    });

    test('POST /api/intelligence/classify - should handle invalid information type', async () => {
      const invalidData = {
        title: 'Test Information',
        content: 'Test content',
        type: 'INVALID_TYPE',
        sourceOrganization: 'Test Org'
      };

      const response = await request(app)
        .post('/api/intelligence/classify')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toContain('Invalid information type');
      expect(response.body.validTypes).toContain('RESEARCH_DATA');
    });

    test('POST /api/intelligence/access-request - should create access request', async () => {
      // First classify some information
      const asset = informationClassification.classifyInformation(
        'Test Classified Data',
        'This is classified information for testing access requests.',
        InformationType.RESEARCH_DATA,
        'Test Organization'
      );

      const accessRequestData = {
        requesterId: 'user123',
        requesterOrganization: 'Requesting Corp',
        assetId: asset.id,
        justification: 'Need access for strategic analysis project'
      };

      const response = await request(app)
        .post('/api/intelligence/access-request')
        .send(accessRequestData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.requesterId).toBe(accessRequestData.requesterId);
      expect(response.body.data.assetId).toBe(accessRequestData.assetId);
      expect(response.body.data.status).toBe('pending');
      expect(response.body.data.justification).toBe(accessRequestData.justification);
    });

    test('GET /api/intelligence/assets - should return information assets', async () => {
      // Create some test assets
      informationClassification.classifyInformation(
        'Public Information',
        'This is public information available to everyone.',
        InformationType.MARKET_INTELLIGENCE,
        'Public Source'
      );

      const response = await request(app)
        .get('/api/intelligence/assets?accessLevel=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.total).toBeGreaterThan(0);
      
      // Check that assets are properly formatted
      if (response.body.data.length > 0) {
        const asset = response.body.data[0];
        expect(asset).toHaveProperty('id');
        expect(asset).toHaveProperty('title');
        expect(asset).toHaveProperty('securityLevel');
        expect(asset).toHaveProperty('strategicValue');
      }
    });

    test('GET /api/intelligence/assets - should filter by search query', async () => {
      // Create test asset with specific content
      informationClassification.classifyInformation(
        'Quantum Computing Breakthrough',
        'Revolutionary quantum computing algorithm with unprecedented performance.',
        InformationType.TECHNOLOGY_SPECS,
        'Research Institute'
      );

      const response = await request(app)
        .get('/api/intelligence/assets?search=quantum&accessLevel=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      
      // Should find the quantum-related asset
      const quantumAssets = response.body.data.filter(asset => 
        asset.title.toLowerCase().includes('quantum') || 
        asset.content.toLowerCase().includes('quantum')
      );
      expect(quantumAssets.length).toBeGreaterThan(0);
    });

    test('POST /api/intelligence/reports - should create intelligence report', async () => {
      // Create test assets
      const asset1 = informationClassification.classifyInformation(
        'Market Analysis Q1',
        'Comprehensive market analysis for Q1 showing growth trends.',
        InformationType.MARKET_INTELLIGENCE,
        'Analytics Corp'
      );

      const asset2 = informationClassification.classifyInformation(
        'Competitor Research',
        'Research on competitor strategies and market positioning.',
        InformationType.MARKET_INTELLIGENCE,
        'Analytics Corp'
      );

      const reportData = {
        title: 'Q1 Market Intelligence Report',
        summary: 'Comprehensive analysis of market conditions and competitor activities.',
        assetIds: [asset1.id, asset2.id],
        analysisLevel: 'analyzed',
        createdBy: 'analyst001'
      };

      const response = await request(app)
        .post('/api/intelligence/reports')
        .send(reportData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(reportData.title);
      expect(response.body.data.summary).toBe(reportData.summary);
      expect(response.body.data.assets).toEqual(reportData.assetIds);
      expect(response.body.data.analysisLevel).toBe(reportData.analysisLevel);
      expect(response.body.data.createdBy).toBe(reportData.createdBy);
      expect(response.body.data).toHaveProperty('confidence');
      expect(response.body.data).toHaveProperty('securityLevel');
    });
  });

  // ============================================================================
  // ESPIONAGE OPERATIONS TESTS
  // ============================================================================
  
  describe('Espionage Operations', () => {
    
    test('POST /api/intelligence/agents/recruit - should recruit new spy agent', async () => {
      const agentData = {
        codename: 'SHADOW_WALKER',
        type: 'CORPORATE_INFILTRATOR',
        organization: 'Intelligence Agency Alpha',
        targetOrganization: 'MegaCorp Industries',
        coverIdentity: 'Senior Marketing Manager',
        handler: 'Agent Smith'
      };

      const response = await request(app)
        .post('/api/intelligence/agents/recruit')
        .send(agentData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.codename).toBe(agentData.codename);
      expect(response.body.data.type).toBe(agentData.type);
      expect(response.body.data.organization).toBe(agentData.organization);
      expect(response.body.data.targetOrganization).toBe(agentData.targetOrganization);
      expect(response.body.data.coverIdentity).toBe(agentData.coverIdentity);
      expect(response.body.data.handler).toBe(agentData.handler);
      expect(response.body.data.status).toBe('active');
      expect(response.body.data.skillLevel).toBeGreaterThan(0);
      expect(response.body.data.skillLevel).toBeLessThanOrEqual(10);
      expect(response.body.data.trustworthiness).toBeGreaterThan(0);
      expect(response.body.data.trustworthiness).toBeLessThanOrEqual(1);
      expect(response.body.data.cost).toBeGreaterThan(0);
      expect(response.body.data.specialties).toBeInstanceOf(Array);
    });

    test('POST /api/intelligence/agents/recruit - should handle invalid spy type', async () => {
      const invalidAgentData = {
        codename: 'TEST_AGENT',
        type: 'INVALID_SPY_TYPE',
        organization: 'Test Org',
        targetOrganization: 'Target Org',
        coverIdentity: 'Test Identity',
        handler: 'Test Handler'
      };

      const response = await request(app)
        .post('/api/intelligence/agents/recruit')
        .send(invalidAgentData)
        .expect(400);

      expect(response.body.error).toContain('Invalid spy type');
      expect(response.body.validTypes).toContain('CORPORATE_INFILTRATOR');
    });

    test('GET /api/intelligence/agents - should return all spy agents', async () => {
      // Recruit a test agent first
      espionageOperations.recruitAgent(
        'TEST_AGENT_001',
        SpyType.RESEARCH_SCIENTIST,
        'Test Agency',
        'Target Corp',
        'Research Director',
        'Handler Alpha'
      );

      const response = await request(app)
        .get('/api/intelligence/agents')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.total).toBeGreaterThan(0);
      
      // Check agent structure
      if (response.body.data.length > 0) {
        const agent = response.body.data[0];
        expect(agent).toHaveProperty('id');
        expect(agent).toHaveProperty('codename');
        expect(agent).toHaveProperty('type');
        expect(agent).toHaveProperty('status');
        expect(agent).toHaveProperty('skillLevel');
      }
    });

    test('GET /api/intelligence/agents - should filter agents by status', async () => {
      const response = await request(app)
        .get('/api/intelligence/agents?status=active')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      
      // All returned agents should have 'active' status
      response.body.data.forEach(agent => {
        expect(agent.status).toBe('active');
      });
    });

    test('POST /api/intelligence/operations/plan - should plan new operation', async () => {
      const operationData = {
        codename: 'OPERATION_NIGHTFALL',
        type: 'INTELLIGENCE_GATHERING',
        description: 'Gather intelligence on competitor research and development activities.',
        targetOrganization: 'Competitor Corp',
        operatingOrganization: 'Our Agency',
        objectives: [
          'Identify key research projects',
          'Assess technological capabilities',
          'Determine strategic priorities'
        ],
        handler: 'Operations Manager',
        approvedBy: 'Director of Intelligence'
      };

      const response = await request(app)
        .post('/api/intelligence/operations/plan')
        .send(operationData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.codename).toBe(operationData.codename);
      expect(response.body.data.type).toBe(operationData.type);
      expect(response.body.data.description).toBe(operationData.description);
      expect(response.body.data.targetOrganization).toBe(operationData.targetOrganization);
      expect(response.body.data.operatingOrganization).toBe(operationData.operatingOrganization);
      expect(response.body.data.objectives).toEqual(operationData.objectives);
      expect(response.body.data.handler).toBe(operationData.handler);
      expect(response.body.data.approvedBy).toBe(operationData.approvedBy);
      expect(response.body.data.status).toBe('PLANNING');
      expect(response.body.data).toHaveProperty('successProbability');
      expect(response.body.data).toHaveProperty('riskLevel');
      expect(response.body.data).toHaveProperty('budget');
      expect(response.body.data).toHaveProperty('estimatedDuration');
    });

    test('GET /api/intelligence/operations - should return all operations', async () => {
      // Plan a test operation first
      espionageOperations.planOperation(
        'TEST_OP_001',
        OperationType.SURVEILLANCE,
        'Test surveillance operation',
        'Target Organization',
        'Operating Organization',
        ['Monitor activities', 'Gather intelligence'],
        'Test Handler',
        'Test Approver'
      );

      const response = await request(app)
        .get('/api/intelligence/operations')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.total).toBeGreaterThan(0);
      
      // Check operation structure
      if (response.body.data.length > 0) {
        const operation = response.body.data[0];
        expect(operation).toHaveProperty('id');
        expect(operation).toHaveProperty('codename');
        expect(operation).toHaveProperty('type');
        expect(operation).toHaveProperty('status');
        expect(operation).toHaveProperty('successProbability');
      }
    });

    test('GET /api/intelligence/agents/available - should return available agents for operation type', async () => {
      // Recruit an agent suitable for intelligence gathering
      espionageOperations.recruitAgent(
        'INTEL_AGENT_001',
        SpyType.CORPORATE_INFILTRATOR,
        'Test Agency',
        'Target Corp',
        'Business Analyst',
        'Handler Beta'
      );

      const response = await request(app)
        .get('/api/intelligence/agents/available?operationType=INTELLIGENCE_GATHERING')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.total).toBeGreaterThanOrEqual(0);
      
      // Check that returned agents are suitable for the operation type
      response.body.data.forEach(agent => {
        expect(agent.status).toMatch(/^(active|deep_cover)$/);
      });
    });

    test('GET /api/intelligence/counter-intelligence/alerts - should return CI alerts', async () => {
      const response = await request(app)
        .get('/api/intelligence/counter-intelligence/alerts')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.total).toBeGreaterThanOrEqual(0);
      
      // Check alert structure if any exist
      if (response.body.data.length > 0) {
        const alert = response.body.data[0];
        expect(alert).toHaveProperty('id');
        expect(alert).toHaveProperty('type');
        expect(alert).toHaveProperty('severity');
        expect(alert).toHaveProperty('description');
        expect(alert).toHaveProperty('investigationStatus');
      }
    });
  });

  // ============================================================================
  // INTELLIGENCE MARKET TESTS
  // ============================================================================
  
  describe('Intelligence Market', () => {
    
    test('POST /api/intelligence/market/participants/register - should register market participant', async () => {
      const participantData = {
        name: 'Intelligence Broker Alpha',
        organization: 'Alpha Intelligence Services',
        role: 'BROKER',
        marketTier: 'LEGITIMATE',
        specializations: ['RESEARCH_DATA', 'TECHNOLOGY_SPECS']
      };

      const response = await request(app)
        .post('/api/intelligence/market/participants/register')
        .send(participantData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(participantData.name);
      expect(response.body.data.organization).toBe(participantData.organization);
      expect(response.body.data.role).toBe(participantData.role);
      expect(response.body.data.marketTier).toBe(participantData.marketTier);
      expect(response.body.data.specializations).toEqual(participantData.specializations);
      expect(response.body.data.reputation).toBe(50); // Default starting reputation
      expect(response.body.data.trustScore).toBe(0.5); // Default starting trust score
      expect(response.body.data.totalTransactions).toBe(0);
      expect(response.body.data.verificationStatus).toBe('unverified');
    });

    test('POST /api/intelligence/market/participants/register - should handle invalid market role', async () => {
      const invalidParticipantData = {
        name: 'Test Participant',
        organization: 'Test Org',
        role: 'INVALID_ROLE',
        marketTier: 'LEGITIMATE',
        specializations: ['RESEARCH_DATA']
      };

      const response = await request(app)
        .post('/api/intelligence/market/participants/register')
        .send(invalidParticipantData)
        .expect(400);

      expect(response.body.error).toContain('Invalid market role');
      expect(response.body.validRoles).toContain('BUYER');
    });

    test('POST /api/intelligence/market/listings - should create intelligence listing', async () => {
      // First register a seller
      const seller = intelligenceMarket.registerParticipant(
        'Intelligence Seller',
        'Seller Corp',
        MarketRole.SELLER,
        MarketTier.LEGITIMATE,
        [InformationType.RESEARCH_DATA]
      );

      // Create an information asset
      const asset = informationClassification.classifyInformation(
        'Advanced AI Research',
        'Cutting-edge artificial intelligence research with commercial applications.',
        InformationType.RESEARCH_DATA,
        'Research Institute'
      );

      const listingData = {
        assetId: asset.id,
        sellerId: seller.id,
        title: 'Advanced AI Research Data',
        description: 'Comprehensive research data on next-generation AI algorithms.',
        category: 'RESEARCH_DATA',
        securityLevel: 'PROPRIETARY',
        listingType: 'PURCHASE',
        basePrice: 50000
      };

      const response = await request(app)
        .post('/api/intelligence/market/listings')
        .send(listingData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.assetId).toBe(listingData.assetId);
      expect(response.body.data.sellerId).toBe(listingData.sellerId);
      expect(response.body.data.title).toBe(listingData.title);
      expect(response.body.data.description).toBe(listingData.description);
      expect(response.body.data.category).toBe(listingData.category);
      expect(response.body.data.securityLevel).toBe(listingData.securityLevel);
      expect(response.body.data.listingType).toBe(listingData.listingType);
      expect(response.body.data.basePrice).toBe(listingData.basePrice);
      expect(response.body.data.currentPrice).toBe(listingData.basePrice);
      expect(response.body.data.status).toBe('active');
      expect(response.body.data).toHaveProperty('strategicValue');
      expect(response.body.data).toHaveProperty('marketTier');
    });

    test('GET /api/intelligence/market/listings/search - should search market listings', async () => {
      const response = await request(app)
        .get('/api/intelligence/market/listings/search?query=research')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.total).toBeGreaterThanOrEqual(0);
      
      // Check listing structure if any exist
      if (response.body.data.length > 0) {
        const listing = response.body.data[0];
        expect(listing).toHaveProperty('id');
        expect(listing).toHaveProperty('title');
        expect(listing).toHaveProperty('category');
        expect(listing).toHaveProperty('securityLevel');
        expect(listing).toHaveProperty('currentPrice');
        expect(listing).toHaveProperty('strategicValue');
        expect(listing.status).toBe('active');
      }
    });

    test('GET /api/intelligence/market/listings/search - should filter by price range', async () => {
      const response = await request(app)
        .get('/api/intelligence/market/listings/search?minPrice=10000&maxPrice=100000')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      
      // Check that all returned listings are within price range
      response.body.data.forEach(listing => {
        expect(listing.currentPrice).toBeGreaterThanOrEqual(10000);
        expect(listing.currentPrice).toBeLessThanOrEqual(100000);
      });
    });

    test('POST /api/intelligence/market/transactions/initiate - should initiate transaction', async () => {
      // Create seller, buyer, and listing
      const seller = intelligenceMarket.registerParticipant(
        'Seller Corp',
        'Seller Organization',
        MarketRole.SELLER,
        MarketTier.LEGITIMATE,
        [InformationType.MARKET_INTELLIGENCE]
      );

      const buyer = intelligenceMarket.registerParticipant(
        'Buyer Corp',
        'Buyer Organization',
        MarketRole.BUYER,
        MarketTier.LEGITIMATE,
        [InformationType.MARKET_INTELLIGENCE]
      );

      const asset = informationClassification.classifyInformation(
        'Market Analysis Report',
        'Comprehensive market analysis with strategic insights.',
        InformationType.MARKET_INTELLIGENCE,
        'Analytics Firm'
      );

      const listing = intelligenceMarket.createListing(
        asset.id,
        seller.id,
        'Market Intelligence Report',
        'Strategic market analysis for Q2',
        InformationType.MARKET_INTELLIGENCE,
        SecurityLevel.PROPRIETARY,
        TransactionType.PURCHASE,
        25000
      );

      const transactionData = {
        listingId: listing.id,
        buyerId: buyer.id,
        transactionType: 'PURCHASE'
      };

      const response = await request(app)
        .post('/api/intelligence/market/transactions/initiate')
        .send(transactionData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.listingId).toBe(transactionData.listingId);
      expect(response.body.data.buyerId).toBe(transactionData.buyerId);
      expect(response.body.data.sellerId).toBe(seller.id);
      expect(response.body.data.transactionType).toBe(transactionData.transactionType);
      expect(response.body.data.paymentStatus).toBe('pending');
      expect(response.body.data.deliveryStatus).toBe('pending');
      expect(response.body.data).toHaveProperty('agreedPrice');
      expect(response.body.data).toHaveProperty('totalCost');
      expect(response.body.data).toHaveProperty('contractTerms');
    });

    test('POST /api/intelligence/market/pricing/calculate - should calculate dynamic pricing', async () => {
      const pricingData = {
        category: 'TECHNOLOGY_SPECS',
        securityLevel: 'CLASSIFIED',
        freshness: 0.9,
        reliability: 0.8,
        strategicValue: 75
      };

      const response = await request(app)
        .post('/api/intelligence/market/pricing/calculate')
        .send(pricingData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('suggestedPrice');
      expect(response.body.data.suggestedPrice).toBeGreaterThan(0);
      expect(response.body.data.category).toBe(pricingData.category);
      expect(response.body.data.securityLevel).toBe(pricingData.securityLevel);
      expect(response.body.data.freshness).toBe(pricingData.freshness);
      expect(response.body.data.reliability).toBe(pricingData.reliability);
      expect(response.body.data.strategicValue).toBe(pricingData.strategicValue);
    });

    test('GET /api/intelligence/market/analytics - should return market analytics', async () => {
      const response = await request(app)
        .get('/api/intelligence/market/analytics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('totalListings');
      expect(response.body.data).toHaveProperty('activeListings');
      expect(response.body.data).toHaveProperty('totalTransactions');
      expect(response.body.data).toHaveProperty('totalVolume');
      expect(response.body.data).toHaveProperty('averageTransactionValue');
      expect(response.body.data).toHaveProperty('marketTierDistribution');
      expect(response.body.data).toHaveProperty('informationTypeDistribution');
      expect(response.body.data).toHaveProperty('securityLevelDistribution');
      expect(response.body.data).toHaveProperty('priceRanges');
      expect(response.body.data).toHaveProperty('topCategories');
      expect(response.body.data).toHaveProperty('marketTrends');
      
      // Check that numeric values are valid
      expect(typeof response.body.data.totalListings).toBe('number');
      expect(typeof response.body.data.activeListings).toBe('number');
      expect(typeof response.body.data.totalTransactions).toBe('number');
      expect(typeof response.body.data.totalVolume).toBe('number');
      expect(typeof response.body.data.averageTransactionValue).toBe('number');
      
      // Check that arrays are properly structured
      expect(Array.isArray(response.body.data.topCategories)).toBe(true);
      expect(Array.isArray(response.body.data.marketTrends.hotCategories)).toBe(true);
      expect(Array.isArray(response.body.data.marketTrends.emergingMarkets)).toBe(true);
    });
  });

  // ============================================================================
  // UTILITY TESTS
  // ============================================================================
  
  describe('Utility Endpoints', () => {
    
    test('GET /api/intelligence/enums - should return all enumeration values', async () => {
      const response = await request(app)
        .get('/api/intelligence/enums')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('InformationType');
      expect(response.body.data).toHaveProperty('SecurityLevel');
      expect(response.body.data).toHaveProperty('SpyType');
      expect(response.body.data).toHaveProperty('OperationType');
      expect(response.body.data).toHaveProperty('MarketRole');
      expect(response.body.data).toHaveProperty('TransactionType');
      expect(response.body.data).toHaveProperty('MarketTier');
      
      // Check that enums contain expected values
      expect(response.body.data.InformationType).toContain('RESEARCH_DATA');
      expect(response.body.data.SecurityLevel).toContain('CLASSIFIED');
      expect(response.body.data.SpyType).toContain('CORPORATE_INFILTRATOR');
      expect(response.body.data.OperationType).toContain('INTELLIGENCE_GATHERING');
      expect(response.body.data.MarketRole).toContain('BROKER');
      expect(response.body.data.TransactionType).toContain('PURCHASE');
      expect(response.body.data.MarketTier).toContain('LEGITIMATE');
    });
  });

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================
  
  describe('Integration Scenarios', () => {
    
    test('Complete intelligence workflow - classify, recruit, operate, trade', async () => {
      // 1. Classify information
      const classifyResponse = await request(app)
        .post('/api/intelligence/classify')
        .send({
          title: 'Strategic Technology Blueprint',
          content: 'Classified technology specifications with strategic military applications.',
          type: 'TECHNOLOGY_SPECS',
          sourceOrganization: 'Defense Contractor'
        });
      
      expect(classifyResponse.body.success).toBe(true);
      const asset = classifyResponse.body.data;

      // 2. Recruit spy agent
      const recruitResponse = await request(app)
        .post('/api/intelligence/agents/recruit')
        .send({
          codename: 'TECH_INFILTRATOR',
          type: 'RESEARCH_SCIENTIST',
          organization: 'Intelligence Service',
          targetOrganization: 'Defense Contractor',
          coverIdentity: 'Senior Research Engineer',
          handler: 'Control Officer'
        });
      
      expect(recruitResponse.body.success).toBe(true);
      const agent = recruitResponse.body.data;

      // 3. Plan espionage operation
      const operationResponse = await request(app)
        .post('/api/intelligence/operations/plan')
        .send({
          codename: 'OPERATION_TECH_HARVEST',
          type: 'TECHNOLOGY_THEFT',
          description: 'Acquire strategic technology specifications.',
          targetOrganization: 'Defense Contractor',
          operatingOrganization: 'Intelligence Service',
          objectives: ['Acquire technology specs', 'Maintain cover', 'Extract safely'],
          handler: 'Control Officer',
          approvedBy: 'Operations Director'
        });
      
      expect(operationResponse.body.success).toBe(true);
      const operation = operationResponse.body.data;

      // 4. Register market participants
      const sellerResponse = await request(app)
        .post('/api/intelligence/market/participants/register')
        .send({
          name: 'Intelligence Seller',
          organization: 'Intelligence Service',
          role: 'SELLER',
          marketTier: 'GRAY_MARKET',
          specializations: ['TECHNOLOGY_SPECS']
        });
      
      expect(sellerResponse.body.success).toBe(true);
      const seller = sellerResponse.body.data;

      // 5. Create market listing
      const listingResponse = await request(app)
        .post('/api/intelligence/market/listings')
        .send({
          assetId: asset.id,
          sellerId: seller.id,
          title: 'Strategic Technology Intelligence',
          description: 'High-value technology specifications from defense sector.',
          category: 'TECHNOLOGY_SPECS',
          securityLevel: asset.securityLevel,
          listingType: 'PURCHASE',
          basePrice: 100000
        });
      
      expect(listingResponse.body.success).toBe(true);
      const listing = listingResponse.body.data;

      // 6. Search market for the listing
      const searchResponse = await request(app)
        .get(`/api/intelligence/market/listings/search?query=technology`)
        .expect(200);
      
      expect(searchResponse.body.success).toBe(true);
      const foundListing = searchResponse.body.data.find(l => l.id === listing.id);
      expect(foundListing).toBeDefined();

      // 7. Get market analytics
      const analyticsResponse = await request(app)
        .get('/api/intelligence/market/analytics')
        .expect(200);
      
      expect(analyticsResponse.body.success).toBe(true);
      expect(analyticsResponse.body.data.totalListings).toBeGreaterThan(0);
    });

    test('Security access control workflow', async () => {
      // 1. Classify high-security information
      const classifyResponse = await request(app)
        .post('/api/intelligence/classify')
        .send({
          title: 'Top Secret Military Plans',
          content: 'Classified military strategic plans with national security implications.',
          type: 'MILITARY_PLANS',
          sourceOrganization: 'Military Command'
        });
      
      expect(classifyResponse.body.success).toBe(true);
      const asset = classifyResponse.body.data;
      expect(asset.securityLevel).toBe('TOP_SECRET');

      // 2. Request access with insufficient clearance
      const lowAccessResponse = await request(app)
        .get(`/api/intelligence/assets/${asset.id}?requesterId=lowClearanceUser`)
        .expect(403);
      
      expect(lowAccessResponse.body.error).toContain('Access denied');

      // 3. Create access request
      const accessRequestResponse = await request(app)
        .post('/api/intelligence/access-request')
        .send({
          requesterId: 'highClearanceUser',
          requesterOrganization: 'Authorized Agency',
          assetId: asset.id,
          justification: 'Required for strategic planning analysis with proper clearance.'
        });
      
      expect(accessRequestResponse.body.success).toBe(true);
      const accessRequest = accessRequestResponse.body.data;

      // 4. Approve access request
      const approvalResponse = await request(app)
        .post(`/api/intelligence/access-request/${accessRequest.id}/process`)
        .send({
          approverId: 'securityOfficer',
          approved: true,
          conditions: ['Time-limited access', 'Audit trail required']
        });
      
      expect(approvalResponse.body.success).toBe(true);
      expect(approvalResponse.body.data.status).toBe('approved');

      // 5. Access information with approved request
      const accessResponse = await request(app)
        .get(`/api/intelligence/assets/${asset.id}?requesterId=highClearanceUser`)
        .expect(200);
      
      expect(accessResponse.body.success).toBe(true);
      expect(accessResponse.body.data.id).toBe(asset.id);
    });
  });
});
