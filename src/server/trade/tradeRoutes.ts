/**
 * Trade Routes API
 * 
 * REST API endpoints for the Trade & Commerce System
 * including trade routes, resources, pricing, and market dynamics.
 */

import express from 'express';
import { TradeEngine } from './tradeEngine.js';
import { TradeStorage } from './tradeStorage.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = express.Router();

// Enhanced AI Knobs for Trade & Commerce System
const tradeKnobsData = {
  // Trade Route Efficiency & Management
  trade_route_efficiency: 0.8,             // Trade route efficiency and logistics optimization
  transportation_cost_optimization: 0.7,   // Transportation cost optimization and route planning
  trade_volume_capacity: 0.8,              // Trade volume capacity and throughput management
  
  // Market Dynamics & Pricing
  market_price_volatility: 0.6,            // Market price volatility and price fluctuation intensity
  supply_demand_responsiveness: 0.8,       // Supply and demand responsiveness and market equilibrium
  price_discovery_efficiency: 0.7,         // Price discovery efficiency and market transparency
  
  // Resource Management & Availability
  resource_availability_stability: 0.7,    // Resource availability stability and supply consistency
  resource_quality_standards: 0.8,         // Resource quality standards and product certification
  strategic_resource_prioritization: 0.8,  // Strategic resource prioritization and national security
  
  // International Trade & Relations
  international_trade_facilitation: 0.7,   // International trade facilitation and diplomatic commerce
  trade_agreement_negotiation: 0.7,        // Trade agreement negotiation and bilateral relations
  customs_efficiency: 0.8,                 // Customs efficiency and border processing speed
  
  // Trade Security & Risk Management
  trade_route_security: 0.8,               // Trade route security and piracy prevention
  cargo_insurance_coverage: 0.7,           // Cargo insurance coverage and risk mitigation
  trade_dispute_resolution: 0.7,           // Trade dispute resolution and conflict mediation
  
  // Economic Integration & Development
  economic_integration_depth: 0.7,         // Economic integration depth and market unification
  trade_infrastructure_investment: 0.8,    // Trade infrastructure investment and development
  small_trader_support: 0.6,               // Small trader support and market accessibility
  
  // Innovation & Technology Adoption
  trade_technology_adoption: 0.7,          // Trade technology adoption and digital transformation
  automated_trading_systems: 0.6,          // Automated trading systems and algorithmic commerce
  blockchain_trade_verification: 0.6,      // Blockchain trade verification and transparency
  
  // Environmental & Sustainability
  sustainable_trade_practices: 0.7,        // Sustainable trade practices and environmental responsibility
  carbon_footprint_reduction: 0.6,         // Carbon footprint reduction and green logistics
  ethical_sourcing_enforcement: 0.7,       // Ethical sourcing enforcement and fair trade standards
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for Trade
const tradeKnobSystem = new EnhancedKnobSystem(tradeKnobsData);

// Apply trade knobs to game state
function applyTradeKnobsToGameState() {
  const knobs = tradeKnobSystem.knobs;
  
  // Apply trade route efficiency settings
  const tradeRouteEfficiency = (knobs.trade_route_efficiency + knobs.transportation_cost_optimization + 
    knobs.trade_volume_capacity) / 3;
  
  // Apply market dynamics settings
  const marketDynamics = (knobs.market_price_volatility + knobs.supply_demand_responsiveness + 
    knobs.price_discovery_efficiency) / 3;
  
  // Apply resource management settings
  const resourceManagement = (knobs.resource_availability_stability + knobs.resource_quality_standards + 
    knobs.strategic_resource_prioritization) / 3;
  
  // Apply international trade settings
  const internationalTrade = (knobs.international_trade_facilitation + knobs.trade_agreement_negotiation + 
    knobs.customs_efficiency) / 3;
  
  // Apply trade security settings
  const tradeSecurity = (knobs.trade_route_security + knobs.cargo_insurance_coverage + 
    knobs.trade_dispute_resolution) / 3;
  
  // Apply sustainability settings
  const sustainability = (knobs.sustainable_trade_practices + knobs.carbon_footprint_reduction + 
    knobs.ethical_sourcing_enforcement) / 3;
  
  console.log('Applied trade knobs to game state:', {
    tradeRouteEfficiency,
    marketDynamics,
    resourceManagement,
    internationalTrade,
    tradeSecurity,
    sustainability
  });
}

// Initialize services
const tradeEngine = new TradeEngine();
const tradeStorage = new TradeStorage();

// ===== TRADE ROUTES MANAGEMENT =====

/**
 * GET /api/trade/routes - Get all trade routes
 */
router.get('/routes', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const routes = await tradeStorage.getTradeRoutes(Number(campaignId));

    res.json({
      success: true,
      data: routes,
      count: routes.length
    });
  } catch (error) {
    console.error('Error fetching trade routes:', error);
    res.status(500).json({
      error: 'Failed to fetch trade routes',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/trade/routes - Create new trade route
 */
router.post('/routes', async (req, res) => {
  try {
    const {
      campaignId,
      name,
      origin,
      destination,
      resources,
      frequency,
      capacity
    } = req.body;

    if (!campaignId || !name || !origin || !destination || !resources) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'name', 'origin', 'destination', 'resources']
      });
    }

    const route = await tradeStorage.createTradeRoute({
      campaignId: Number(campaignId),
      name,
      origin,
      destination,
      resources,
      frequency: frequency || 'weekly',
      capacity: capacity || 1000
    });

    res.status(201).json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error('Error creating trade route:', error);
    res.status(500).json({
      error: 'Failed to create trade route',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== RESOURCES MANAGEMENT =====

/**
 * GET /api/trade/resources - Get all trade resources
 */
router.get('/resources', async (req, res) => {
  try {
    const { category } = req.query;
    
    const resources = tradeEngine.getTradeResources();
    const filteredResources = category 
      ? resources.filter(r => r.category === category)
      : resources;

    res.json({
      success: true,
      data: filteredResources,
      count: filteredResources.length
    });
  } catch (error) {
    console.error('Error fetching trade resources:', error);
    res.status(500).json({
      error: 'Failed to fetch trade resources',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/trade/prices - Get current market prices
 */
router.get('/prices', async (req, res) => {
  try {
    const { campaignId, resourceId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const prices = await tradeStorage.getCurrentPrices(Number(campaignId), resourceId as string);

    res.json({
      success: true,
      data: prices,
      count: Array.isArray(prices) ? prices.length : 1
    });
  } catch (error) {
    console.error('Error fetching trade prices:', error);
    res.status(500).json({
      error: 'Failed to fetch trade prices',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== MARKET ANALYSIS =====

/**
 * GET /api/trade/market-analysis - Get market analysis
 */
router.get('/market-analysis', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const analysis = await tradeEngine.generateMarketAnalysis(Number(campaignId));

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error generating market analysis:', error);
    res.status(500).json({
      error: 'Failed to generate market analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/trade/simulate-step - Simulate trade step
 */
router.post('/simulate-step', async (req, res) => {
  try {
    const { campaignId } = req.body;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    const result = await tradeEngine.simulateTradeStep(Number(campaignId));

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error simulating trade step:', error);
    res.status(500).json({
      error: 'Failed to simulate trade step',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'trade', tradeKnobSystem, applyTradeKnobsToGameState);

export default router;
