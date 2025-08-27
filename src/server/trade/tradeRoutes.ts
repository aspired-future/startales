/**
 * Trade Routes API
 * 
 * REST API endpoints for the Trade & Commerce System
 * including trade routes, resources, pricing, and market dynamics.
 */

import express from 'express';
import { TradeEngine } from './tradeEngine.js';
import { TradeStorage } from './tradeStorage.js';
import { TradeSimulationIntegration } from './TradeSimulationIntegration.js';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = express.Router();

// Initialize Trade Simulation Integration (will be properly injected from SimEngineOrchestrator)
let tradeSimulation: TradeSimulationIntegration | null = null;

// Function to set the trade simulation instance (called from server initialization)
export function setTradeSimulation(simulation: TradeSimulationIntegration) {
  tradeSimulation = simulation;
}

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

// ===== MISSING FRONTEND API ENDPOINTS =====

/**
 * GET /api/trade/indices - Get trade indices and market indicators
 */
router.get('/indices', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    // Try to get data from simulation integration first
    let indices;
    if (tradeSimulation) {
      const simulationState = tradeSimulation.getSimulationState('1'); // Default civilization
      if (simulationState) {
        indices = {
          galacticTradeIndex: simulationState.marketIndices.galacticTradeIndex,
          commodityIndex: simulationState.marketIndices.commodityIndex,
          shippingIndex: simulationState.marketIndices.shippingIndex,
          volatilityIndex: simulationState.marketIndices.volatilityIndex,
          volumeIndex: simulationState.marketIndices.volumeIndex,
          trends: {
            daily: (Math.random() - 0.5) * 5,
            weekly: (Math.random() - 0.5) * 10,
            monthly: (Math.random() - 0.5) * 20
          },
          sectors: [
            { name: 'Raw Materials', value: 1456.2 * (0.8 + Math.random() * 0.4), change: (Math.random() - 0.5) * 10 },
            { name: 'Technology', value: 3421.8 * (0.8 + Math.random() * 0.4), change: (Math.random() - 0.5) * 10 },
            { name: 'Energy', value: 987.6 * (0.8 + Math.random() * 0.4), change: (Math.random() - 0.5) * 10 },
            { name: 'Agriculture', value: 654.3 * (0.8 + Math.random() * 0.4), change: (Math.random() - 0.5) * 10 }
          ]
        };
      }
    }
    
    // Fallback to mock data if simulation not available
    if (!indices) {
      indices = {
        galacticTradeIndex: 2847.5,
        commodityIndex: 1234.8,
        shippingIndex: 892.3,
        volatilityIndex: 0.23,
        volumeIndex: 156789,
        trends: {
          daily: 2.3,
          weekly: -1.2,
          monthly: 8.7
        },
        sectors: [
          { name: 'Raw Materials', value: 1456.2, change: 3.4 },
          { name: 'Technology', value: 3421.8, change: -0.8 },
          { name: 'Energy', value: 987.6, change: 5.2 },
          { name: 'Agriculture', value: 654.3, change: 1.9 }
        ]
      };
    }

    res.json({
      success: true,
      data: indices
    });
  } catch (error) {
    console.error('Error fetching trade indices:', error);
    res.status(500).json({
      error: 'Failed to fetch trade indices',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/trade/systems - Get trading systems and hubs
 */
router.get('/systems', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    // Generate mock trading systems data
    const systems = [
      {
        id: 'sol-hub',
        name: 'Sol Trading Hub',
        location: 'Sol System',
        type: 'Major Hub',
        volume: 2847000,
        efficiency: 0.92,
        connections: 15,
        status: 'Active'
      },
      {
        id: 'alpha-centauri',
        name: 'Alpha Centauri Exchange',
        location: 'Alpha Centauri',
        type: 'Regional Hub',
        volume: 1234000,
        efficiency: 0.87,
        connections: 8,
        status: 'Active'
      },
      {
        id: 'vega-station',
        name: 'Vega Trade Station',
        location: 'Vega System',
        type: 'Specialized Hub',
        volume: 892000,
        efficiency: 0.94,
        connections: 12,
        status: 'Active'
      }
    ];

    res.json({
      success: true,
      data: systems,
      count: systems.length
    });
  } catch (error) {
    console.error('Error fetching trading systems:', error);
    res.status(500).json({
      error: 'Failed to fetch trading systems',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/trade/commodities - Get commodity prices and data
 */
router.get('/commodities', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    // Generate mock commodities data
    const commodities = [
      {
        id: 'quantum-crystals',
        name: 'Quantum Crystals',
        category: 'Technology',
        price: 15420.50,
        change: 3.2,
        volume: 45600,
        supply: 'Limited',
        demand: 'High'
      },
      {
        id: 'dark-matter',
        name: 'Dark Matter',
        category: 'Energy',
        price: 89750.25,
        change: -1.8,
        volume: 12300,
        supply: 'Scarce',
        demand: 'Critical'
      },
      {
        id: 'bio-nutrients',
        name: 'Bio-Nutrients',
        category: 'Agriculture',
        price: 234.75,
        change: 0.9,
        volume: 892000,
        supply: 'Abundant',
        demand: 'Steady'
      },
      {
        id: 'rare-metals',
        name: 'Rare Metals',
        category: 'Raw Materials',
        price: 5670.80,
        change: 2.1,
        volume: 156000,
        supply: 'Moderate',
        demand: 'High'
      }
    ];

    res.json({
      success: true,
      data: commodities,
      count: commodities.length
    });
  } catch (error) {
    console.error('Error fetching commodities:', error);
    res.status(500).json({
      error: 'Failed to fetch commodities',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/trade/corporations - Get corporation data and stocks
 */
router.get('/corporations', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    // Generate mock corporations data
    const corporations = [
      {
        id: 'galactic-shipping',
        name: 'Galactic Shipping Corp',
        sector: 'Logistics',
        stockPrice: 1247.80,
        change: 2.3,
        marketCap: '2.8T Credits',
        volume: 156000,
        rating: 'AAA'
      },
      {
        id: 'quantum-dynamics',
        name: 'Quantum Dynamics Ltd',
        sector: 'Technology',
        stockPrice: 3421.50,
        change: -0.7,
        marketCap: '1.9T Credits',
        volume: 89000,
        rating: 'AA+'
      },
      {
        id: 'stellar-mining',
        name: 'Stellar Mining Consortium',
        sector: 'Raw Materials',
        stockPrice: 892.25,
        change: 4.1,
        marketCap: '1.2T Credits',
        volume: 234000,
        rating: 'A'
      }
    ];

    res.json({
      success: true,
      data: corporations,
      count: corporations.length
    });
  } catch (error) {
    console.error('Error fetching corporations:', error);
    res.status(500).json({
      error: 'Failed to fetch corporations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/trade/contracts - Get available trade contracts
 */
router.get('/contracts', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    // Generate mock contracts data
    const contracts = [
      {
        id: 'contract-001',
        title: 'Quantum Crystal Delivery',
        client: 'Vega Research Institute',
        commodity: 'Quantum Crystals',
        quantity: 5000,
        destination: 'Vega System',
        reward: 750000,
        deadline: '2024-12-15',
        difficulty: 'Medium',
        status: 'Available'
      },
      {
        id: 'contract-002',
        title: 'Emergency Medical Supplies',
        client: 'Centauri Medical Corps',
        commodity: 'Bio-Nutrients',
        quantity: 25000,
        destination: 'Alpha Centauri',
        reward: 450000,
        deadline: '2024-11-30',
        difficulty: 'Easy',
        status: 'Available'
      },
      {
        id: 'contract-003',
        title: 'Rare Metal Extraction',
        client: 'Orion Mining Guild',
        commodity: 'Rare Metals',
        quantity: 12000,
        destination: 'Orion Nebula',
        reward: 1200000,
        deadline: '2025-01-20',
        difficulty: 'Hard',
        status: 'Available'
      }
    ];

    res.json({
      success: true,
      data: contracts,
      count: contracts.length
    });
  } catch (error) {
    console.error('Error fetching trade contracts:', error);
    res.status(500).json({
      error: 'Failed to fetch trade contracts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/trade/opportunities - Get trade opportunities
 */
router.get('/opportunities', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Missing required parameter: campaignId'
      });
    }

    // Generate mock opportunities data
    const opportunities = [
      {
        id: 'opp-001',
        type: 'Price Arbitrage',
        title: 'Dark Matter Price Gap',
        description: 'Significant price difference between Sol and Vega systems',
        commodity: 'Dark Matter',
        profitPotential: 2.3,
        riskLevel: 'Medium',
        timeWindow: '72 hours',
        estimatedProfit: 890000
      },
      {
        id: 'opp-002',
        type: 'Supply Shortage',
        title: 'Bio-Nutrient Shortage on Mars',
        description: 'Critical shortage creating high demand and premium prices',
        commodity: 'Bio-Nutrients',
        profitPotential: 1.8,
        riskLevel: 'Low',
        timeWindow: '5 days',
        estimatedProfit: 340000
      },
      {
        id: 'opp-003',
        type: 'New Route',
        title: 'Unexplored Trade Route',
        description: 'Newly discovered system with untapped resources',
        commodity: 'Exotic Materials',
        profitPotential: 4.2,
        riskLevel: 'High',
        timeWindow: '2 weeks',
        estimatedProfit: 1500000
      }
    ];

    res.json({
      success: true,
      data: opportunities,
      count: opportunities.length
    });
  } catch (error) {
    console.error('Error fetching trade opportunities:', error);
    res.status(500).json({
      error: 'Failed to fetch trade opportunities',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'trade', tradeKnobSystem, applyTradeKnobsToGameState);

export default router;
