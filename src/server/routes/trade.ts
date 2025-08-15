import express from 'express';
import { TradeEngine } from '../trade/tradeEngine.js';
import { TradeStorage } from '../trade/tradeStorage.js';
import { resumeCampaign } from '../persistence/eventSourcing.js';
import seedrandom from 'seedrandom';

const router = express.Router();

// Note: Trade tables will be initialized on first API call that needs them

/**
 * GET /api/trade/prices - Get current trade prices
 */
router.get('/prices', async (req, res) => {
  try {
    // Lazy initialization - only initialize when first API call is made
    await TradeStorage.initializeTradeTables();
    
    const { campaignId, resourceId } = req.query;
    
    if (resourceId) {
      // Get price for specific resource
      const price = await TradeStorage.getResourcePrice(resourceId as string);
      
      if (!price) {
        return res.status(404).json({
          error: 'Resource price not found',
          message: `No price data available for resource: ${resourceId}`
        });
      }
      
      const resource = TradeEngine.getResource(resourceId as string);
      
      res.json({
        success: true,
        resource,
        price,
        lastUpdated: price.lastUpdated
      });
    } else {
      // Get all current prices
      const prices = await TradeStorage.getPrices();
      const resources = TradeEngine.getTradeResources();
      
      // If we have campaign ID, recalculate prices based on current state
      if (campaignId) {
        try {
          const campaignState = await resumeCampaign(Number(campaignId));
          const rng = seedrandom(`trade-prices-${campaignState.step}`);
          
          const updatedPrices = TradeEngine.calculatePrices(campaignState, prices, rng);
          
          // Save updated prices
          await TradeStorage.savePrices(updatedPrices);
          
          res.json({
            success: true,
            prices: updatedPrices,
            resources,
            campaignStep: campaignState.step,
            message: 'Prices updated based on current campaign state'
          });
        } catch (error) {
          // If campaign loading fails, return cached prices
          res.json({
            success: true,
            prices,
            resources,
            message: 'Returning cached prices (campaign state unavailable)'
          });
        }
      } else {
        res.json({
          success: true,
          prices,
          resources
        });
      }
    }
  } catch (error) {
    console.error('Error fetching trade prices:', error);
    res.status(500).json({
      error: 'Failed to fetch trade prices',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/trade/routes - Create a new trade route
 */
router.post('/routes', async (req, res) => {
  try {
    const { campaignId, name, origin, destination, resources, distance, travelTime, capacity, tariffRate } = req.body;
    
    if (!campaignId || !name || !origin || !destination || !resources || !distance || !travelTime || !capacity) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'name', 'origin', 'destination', 'resources', 'distance', 'travelTime', 'capacity']
      });
    }
    
    // Validate resources
    const validResources = TradeEngine.getTradeResources().map(r => r.id);
    const invalidResources = resources.filter((r: string) => !validResources.includes(r));
    
    if (invalidResources.length > 0) {
      return res.status(400).json({
        error: 'Invalid resources',
        invalidResources,
        validResources
      });
    }
    
    const route = TradeEngine.createTradeRoute(Number(campaignId), {
      name,
      origin,
      destination,
      resources,
      distance: Number(distance),
      travelTime: Number(travelTime),
      capacity: Number(capacity),
      tariffRate: Number(tariffRate) || 0
    });
    
    await TradeStorage.saveRoute(route);
    
    res.json({
      success: true,
      route,
      message: `Trade route "${name}" created successfully`
    });
  } catch (error) {
    console.error('Error creating trade route:', error);
    res.status(500).json({
      error: 'Failed to create trade route',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/trade/routes - Get trade routes for a campaign
 */
router.get('/routes', async (req, res) => {
  try {
    const { campaignId, status } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Campaign ID is required'
      });
    }
    
    const routes = await TradeStorage.getRoutes(Number(campaignId), status as string);
    
    res.json({
      success: true,
      routes,
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
 * POST /api/trade/contracts - Create a new trade contract
 */
router.post('/contracts', async (req, res) => {
  try {
    const { 
      campaignId, type, resourceId, quantity, pricePerUnit, counterparty,
      routeId, deliveryDeadline, terms 
    } = req.body;
    
    if (!campaignId || !type || !resourceId || !quantity || !pricePerUnit || !counterparty) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['campaignId', 'type', 'resourceId', 'quantity', 'pricePerUnit', 'counterparty']
      });
    }
    
    // Validate resource exists
    const resource = TradeEngine.getResource(resourceId);
    if (!resource) {
      return res.status(400).json({
        error: 'Invalid resource',
        message: `Resource ${resourceId} not found`,
        validResources: TradeEngine.getTradeResources().map(r => r.id)
      });
    }
    
    // Validate route if provided
    if (routeId) {
      const route = await TradeStorage.getRoute(routeId);
      if (!route) {
        return res.status(400).json({
          error: 'Invalid route',
          message: `Route ${routeId} not found`
        });
      }
      
      // Check if route supports this resource
      if (!route.resources.includes(resourceId)) {
        return res.status(400).json({
          error: 'Route does not support this resource',
          message: `Route ${route.name} does not handle ${resource.name}`,
          supportedResources: route.resources
        });
      }
    }
    
    // Check if contract can be executed based on current campaign state
    if (type === 'sell' || type === 'buy') {
      try {
        const campaignState = await resumeCampaign(Number(campaignId));
        const testContract = TradeEngine.createTradeContract(Number(campaignId), {
          type,
          resourceId,
          quantity: Number(quantity),
          pricePerUnit: Number(pricePerUnit),
          counterparty,
          routeId,
          deliveryDeadline: deliveryDeadline ? new Date(deliveryDeadline) : undefined,
          terms: terms || {
            paymentMethod: 'credits',
            deliveryTerms: 'immediate'
          }
        });
        
        const canExecute = TradeEngine.canExecuteContract(testContract, campaignState);
        
        if (!canExecute) {
          const errorMessage = type === 'sell' 
            ? `Insufficient ${resource.name} to sell (need ${quantity}, have ${campaignState.resources[resourceId] || 0})`
            : `Insufficient credits to buy (need ${testContract.totalValue}, have ${campaignState.resources.credits})`;
          
          return res.status(400).json({
            error: 'Contract cannot be executed',
            message: errorMessage,
            currentResources: campaignState.resources
          });
        }
      } catch (error) {
        console.warn('Could not validate contract against campaign state:', error);
        // Continue anyway - validation is optional
      }
    }
    
    const contract = TradeEngine.createTradeContract(Number(campaignId), {
      type,
      resourceId,
      quantity: Number(quantity),
      pricePerUnit: Number(pricePerUnit),
      counterparty,
      routeId,
      deliveryDeadline: deliveryDeadline ? new Date(deliveryDeadline) : undefined,
      terms: terms || {
        paymentMethod: 'credits',
        deliveryTerms: 'immediate'
      }
    });
    
    await TradeStorage.saveContract(contract);
    
    res.json({
      success: true,
      contract,
      resource,
      message: `${type} contract for ${quantity} ${resource.name} created successfully`
    });
  } catch (error) {
    console.error('Error creating trade contract:', error);
    res.status(500).json({
      error: 'Failed to create trade contract',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/trade/contracts - Get trade contracts for a campaign
 */
router.get('/contracts', async (req, res) => {
  try {
    const { campaignId, status } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Campaign ID is required'
      });
    }
    
    const contracts = await TradeStorage.getContracts(Number(campaignId), status as string);
    
    // Enrich contracts with resource information
    const enrichedContracts = contracts.map(contract => {
      const resource = TradeEngine.getResource(contract.resourceId);
      return {
        ...contract,
        resource
      };
    });
    
    res.json({
      success: true,
      contracts: enrichedContracts,
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
 * GET /api/trade/indices - Get trade analytics and indices
 */
router.get('/indices', async (req, res) => {
  try {
    const { campaignId } = req.query;
    
    if (!campaignId) {
      return res.status(400).json({
        error: 'Campaign ID is required'
      });
    }
    
    const [prices, contracts, routes] = await Promise.all([
      TradeStorage.getPrices(),
      TradeStorage.getContracts(Number(campaignId)),
      TradeStorage.getRoutes(Number(campaignId))
    ]);
    
    const analytics = TradeEngine.calculateTradeAnalytics(prices, contracts, routes);
    const stats = await TradeStorage.getTradeStats(Number(campaignId));
    
    res.json({
      success: true,
      analytics,
      stats,
      priceCount: Object.keys(prices).length,
      message: 'Trade analytics calculated successfully'
    });
  } catch (error) {
    console.error('Error calculating trade indices:', error);
    res.status(500).json({
      error: 'Failed to calculate trade indices',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/trade/contracts/:id/status - Update contract status
 */
router.put('/contracts/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, executeContract } = req.body;
    
    if (!status || !['pending', 'active', 'completed', 'cancelled', 'failed'].includes(status)) {
      return res.status(400).json({
        error: 'Valid status is required',
        validStatuses: ['pending', 'active', 'completed', 'cancelled', 'failed']
      });
    }
    
    const contract = await TradeStorage.getContract(id);
    
    if (!contract) {
      return res.status(404).json({
        error: 'Contract not found'
      });
    }
    
    // If completing contract and executeContract is true, apply effects to campaign
    if (status === 'completed' && executeContract) {
      try {
        const campaignState = await resumeCampaign(contract.campaignId);
        const updatedState = TradeEngine.executeContract(contract, campaignState);
        
        // Note: In a full implementation, you'd want to save this state change as an event
        // For now, we'll just log it
        console.log(`Contract ${id} executed, state changes:`, {
          resourceChange: updatedState.resources[contract.resourceId] - (campaignState.resources[contract.resourceId] || 0),
          creditsChange: updatedState.resources.credits - campaignState.resources.credits
        });
      } catch (error) {
        console.warn('Could not execute contract effects on campaign state:', error);
      }
    }
    
    await TradeStorage.updateContractStatus(
      id, 
      status,
      status === 'completed' ? new Date() : undefined
    );
    
    const updatedContract = await TradeStorage.getContract(id);
    const resource = TradeEngine.getResource(contract.resourceId);
    
    res.json({
      success: true,
      contract: updatedContract,
      resource,
      message: `Contract status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating contract status:', error);
    res.status(500).json({
      error: 'Failed to update contract status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/trade/routes/:id/status - Update route status
 */
router.put('/routes/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['active', 'suspended', 'blocked'].includes(status)) {
      return res.status(400).json({
        error: 'Valid status is required',
        validStatuses: ['active', 'suspended', 'blocked']
      });
    }
    
    const route = await TradeStorage.getRoute(id);
    
    if (!route) {
      return res.status(404).json({
        error: 'Route not found'
      });
    }
    
    await TradeStorage.updateRouteStatus(id, status);
    
    const updatedRoute = await TradeStorage.getRoute(id);
    
    res.json({
      success: true,
      route: updatedRoute,
      message: `Route status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating route status:', error);
    res.status(500).json({
      error: 'Failed to update route status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;


