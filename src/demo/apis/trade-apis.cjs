const { 
  tradeGameState, 
  createCorporation, 
  createTradeRoute, 
  createContract, 
  calculateCurrentPrice, 
  simulateMarket, 
  getTradeAnalytics 
} = require('../game-state/trade-state.cjs');

function setupTradeAPIs(app) {
  // Get all star systems with trade data
  app.get('/api/trade/systems', (req, res) => {
    const systems = Array.from(tradeGameState.starSystems.values()).map(system => ({
      ...system,
      currentPrices: {}
    }));
    
    // Add current prices for each commodity in each system
    systems.forEach(system => {
      tradeGameState.commodities.forEach((commodity, commodityId) => {
        system.currentPrices[commodityId] = calculateCurrentPrice(commodityId, system.id);
      });
    });
    
    res.json({
      systems,
      totalSystems: systems.length
    });
  });

  // Get commodity prices for a specific system
  app.get('/api/trade/prices', (req, res) => {
    const { system = 'sol' } = req.query;
    
    if (!tradeGameState.starSystems.has(system)) {
      return res.status(404).json({ error: 'System not found' });
    }
    
    const prices = {};
    tradeGameState.commodities.forEach((commodity, commodityId) => {
      prices[commodityId] = {
        current: calculateCurrentPrice(commodityId, system),
        base: commodity.basePrice,
        change: ((calculateCurrentPrice(commodityId, system) - commodity.basePrice) / commodity.basePrice * 100).toFixed(2),
        supply: commodity.supply,
        demand: commodity.demand,
        unit: commodity.unit
      };
    });
    
    res.json({
      system,
      timestamp: new Date(),
      prices
    });
  });

  // Get all commodities with market data
  app.get('/api/trade/commodities', (req, res) => {
    const commodities = Array.from(tradeGameState.commodities.values()).map(commodity => ({
      ...commodity,
      priceChange: ((commodity.currentPrice - commodity.basePrice) / commodity.basePrice * 100).toFixed(2),
      supplyDemandRatio: (commodity.supply / commodity.demand).toFixed(2)
    }));
    
    res.json({
      commodities,
      totalCommodities: commodities.length,
      lastUpdated: new Date()
    });
  });

  // Get price history for a specific commodity
  app.get('/api/trade/commodities/:commodityId/history', (req, res) => {
    const commodity = tradeGameState.commodities.get(req.params.commodityId);
    if (!commodity) {
      return res.status(404).json({ error: 'Commodity not found' });
    }
    
    res.json({
      commodity: {
        id: req.params.commodityId,
        name: commodity.name,
        category: commodity.category
      },
      priceHistory: commodity.priceHistory,
      currentPrice: commodity.currentPrice,
      basePrice: commodity.basePrice
    });
  });

  // Get all trade routes
  app.get('/api/trade/routes', (req, res) => {
    const { status, routeType } = req.query;
    
    let routes = Array.from(tradeGameState.tradeRoutes.values());
    
    if (status) {
      routes = routes.filter(route => route.status === status);
    }
    
    if (routeType) {
      routes = routes.filter(route => route.routeType === routeType);
    }
    
    // Add system names and calculate profitability
    const enrichedRoutes = routes.map(route => {
      const originSystem = tradeGameState.starSystems.get(route.origin);
      const destSystem = tradeGameState.starSystems.get(route.destination);
      
      return {
        ...route,
        originName: originSystem ? originSystem.name : route.origin,
        destinationName: destSystem ? destSystem.name : route.destination,
        estimatedProfit: Math.round(route.profitability * route.trafficVolume * 100),
        routeTypeInfo: tradeGameState.routeTypes.find(rt => rt.id === route.routeType)
      };
    });
    
    res.json({
      routes: enrichedRoutes,
      totalRoutes: enrichedRoutes.length,
      routeTypes: tradeGameState.routeTypes
    });
  });

  // Create new trade route
  app.post('/api/trade/routes', (req, res) => {
    try {
      const { origin, destination, routeType, primaryCommodities } = req.body;
      
      if (!origin || !destination) {
        return res.status(400).json({ error: 'Origin and destination are required' });
      }
      
      if (!tradeGameState.starSystems.has(origin) || !tradeGameState.starSystems.has(destination)) {
        return res.status(400).json({ error: 'Invalid origin or destination system' });
      }
      
      // Calculate distance (simplified)
      const originSys = tradeGameState.starSystems.get(origin);
      const destSys = tradeGameState.starSystems.get(destination);
      const distance = Math.sqrt(
        Math.pow(destSys.coordinates.x - originSys.coordinates.x, 2) +
        Math.pow(destSys.coordinates.y - originSys.coordinates.y, 2) +
        Math.pow(destSys.coordinates.z - originSys.coordinates.z, 2)
      );
      
      const routeData = {
        origin,
        destination,
        routeType: routeType || 'standard',
        primaryCommodities: primaryCommodities || [],
        distance: Math.round(distance * 100) / 100,
        travelTime: Math.ceil(distance * 2) // Simplified: 2 days per light year
      };
      
      const route = createTradeRoute(routeData);
      tradeGameState.tradeRoutes.set(route.id, route);
      
      res.status(201).json({
        route,
        message: 'Trade route created successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create trade route', details: error.message });
    }
  });

  // Get all corporations
  app.get('/api/trade/corporations', (req, res) => {
    const { sector } = req.query;
    
    let corporations = Array.from(tradeGameState.corporations.values());
    
    if (sector) {
      corporations = corporations.filter(corp => corp.sector === sector);
    }
    
    // Add headquarters system name
    const enrichedCorps = corporations.map(corp => {
      const hqSystem = tradeGameState.starSystems.get(corp.headquarters);
      return {
        ...corp,
        headquartersName: hqSystem ? hqSystem.name : corp.headquarters,
        contractCount: corp.contracts.length,
        routeCount: corp.tradeRoutes.length
      };
    });
    
    res.json({
      corporations: enrichedCorps,
      totalCorporations: enrichedCorps.length,
      sectors: tradeGameState.corporationSectors
    });
  });

  // Create new corporation
  app.post('/api/trade/corporations', (req, res) => {
    try {
      const { name, sector, headquarters, specialties } = req.body;
      
      if (!name || !sector || !headquarters) {
        return res.status(400).json({ error: 'Name, sector, and headquarters are required' });
      }
      
      if (!tradeGameState.starSystems.has(headquarters)) {
        return res.status(400).json({ error: 'Invalid headquarters system' });
      }
      
      const corpData = {
        name,
        sector,
        headquarters,
        specialties: specialties || [],
        reputation: 50 + Math.random() * 30, // 50-80 starting reputation
        marketShare: Math.random() * 0.1 // 0-10% starting market share
      };
      
      const corporation = createCorporation(corpData);
      tradeGameState.corporations.set(corporation.id, corporation);
      
      res.status(201).json({
        corporation,
        message: 'Corporation created successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create corporation', details: error.message });
    }
  });

  // Get all contracts
  app.get('/api/trade/contracts', (req, res) => {
    const { status, type, commodity } = req.query;
    
    let contracts = Array.from(tradeGameState.contracts.values());
    
    if (status) {
      contracts = contracts.filter(contract => contract.status === status);
    }
    
    if (type) {
      contracts = contracts.filter(contract => contract.type === type);
    }
    
    if (commodity) {
      contracts = contracts.filter(contract => contract.commodity === commodity);
    }
    
    // Enrich contracts with additional data
    const enrichedContracts = contracts.map(contract => {
      const originSystem = tradeGameState.starSystems.get(contract.originSystem);
      const destSystem = tradeGameState.starSystems.get(contract.destinationSystem);
      const corporation = tradeGameState.corporations.get(contract.corporationId);
      const commodityInfo = tradeGameState.commodities.get(contract.commodity);
      
      return {
        ...contract,
        originName: originSystem ? originSystem.name : contract.originSystem,
        destinationName: destSystem ? destSystem.name : contract.destinationSystem,
        corporationName: corporation ? corporation.name : 'Unknown',
        commodityName: commodityInfo ? commodityInfo.name : contract.commodity,
        daysUntilDelivery: Math.ceil((new Date(contract.deliveryDate) - new Date()) / (1000 * 60 * 60 * 24))
      };
    });
    
    res.json({
      contracts: enrichedContracts,
      totalContracts: enrichedContracts.length,
      contractTypes: tradeGameState.contractTypes
    });
  });

  // Create new contract
  app.post('/api/trade/contracts', (req, res) => {
    try {
      const { type, commodity, quantity, originSystem, destinationSystem, corporationId } = req.body;
      
      if (!type || !commodity || !quantity || !originSystem || !destinationSystem) {
        return res.status(400).json({ error: 'All contract fields are required' });
      }
      
      if (!tradeGameState.commodities.has(commodity)) {
        return res.status(400).json({ error: 'Invalid commodity' });
      }
      
      if (!tradeGameState.starSystems.has(originSystem) || !tradeGameState.starSystems.has(destinationSystem)) {
        return res.status(400).json({ error: 'Invalid origin or destination system' });
      }
      
      if (corporationId && !tradeGameState.corporations.has(corporationId)) {
        return res.status(400).json({ error: 'Invalid corporation ID' });
      }
      
      const contractData = {
        type,
        commodity,
        quantity: parseInt(quantity),
        originSystem,
        destinationSystem,
        corporationId: corporationId || Array.from(tradeGameState.corporations.keys())[0] // Default to first corp
      };
      
      const contract = createContract(contractData);
      tradeGameState.contracts.set(contract.id, contract);
      
      // Add contract to corporation
      if (corporationId) {
        const corporation = tradeGameState.corporations.get(corporationId);
        if (corporation) {
          corporation.contracts.push(contract.id);
        }
      }
      
      res.status(201).json({
        contract,
        message: 'Contract created successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create contract', details: error.message });
    }
  });

  // Get trade analytics and indices
  app.get('/api/trade/indices', (req, res) => {
    const analytics = getTradeAnalytics();
    
    // Calculate additional indices
    const priceIndex = Math.round(analytics.averagePrice);
    const volumeIndex = Math.round(analytics.totalTradeVolume / 1000); // Scale down for readability
    const contractIndex = analytics.activeContracts;
    
    const indices = {
      priceIndex,
      volumeIndex,
      contractIndex,
      corporationIndex: analytics.totalCorporations,
      routeIndex: analytics.totalRoutes,
      ...analytics
    };
    
    res.json({
      indices,
      timestamp: new Date(),
      message: 'Trade indices calculated successfully'
    });
  });

  // Simulate market changes
  app.post('/api/trade/simulate', (req, res) => {
    try {
      simulateMarket();
      
      const analytics = getTradeAnalytics();
      
      res.json({
        success: true,
        message: 'Market simulation completed',
        timestamp: new Date(),
        marketSummary: {
          totalSystems: analytics.totalSystems,
          averagePrice: Math.round(analytics.averagePrice * 100) / 100,
          totalTradeVolume: analytics.totalTradeVolume,
          activeContracts: analytics.activeContracts
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Market simulation failed', details: error.message });
    }
  });

  // Get trade opportunities (AI recommendations)
  app.get('/api/trade/opportunities', (req, res) => {
    const opportunities = [];
    
    // Find price arbitrage opportunities
    const commodities = Array.from(tradeGameState.commodities.values());
    const systems = Array.from(tradeGameState.starSystems.values());
    
    commodities.forEach(commodity => {
      const prices = systems.map(system => ({
        system: system.id,
        systemName: system.name,
        price: calculateCurrentPrice(commodity.id, system.id)
      }));
      
      prices.sort((a, b) => a.price - b.price);
      
      if (prices.length >= 2) {
        const cheapest = prices[0];
        const mostExpensive = prices[prices.length - 1];
        const profitMargin = ((mostExpensive.price - cheapest.price) / cheapest.price * 100);
        
        if (profitMargin > 15) { // Only show opportunities with >15% profit margin
          opportunities.push({
            type: 'arbitrage',
            commodity: commodity.id,
            commodityName: commodity.name,
            buyFrom: cheapest.systemName,
            sellTo: mostExpensive.systemName,
            buyPrice: cheapest.price,
            sellPrice: mostExpensive.price,
            profitMargin: Math.round(profitMargin * 100) / 100,
            estimatedProfit: Math.round((mostExpensive.price - cheapest.price) * 100), // Assuming 100 units
            priority: profitMargin > 30 ? 'high' : profitMargin > 20 ? 'medium' : 'low'
          });
        }
      }
    });
    
    // Find route expansion opportunities
    const existingRoutes = Array.from(tradeGameState.tradeRoutes.values());
    systems.forEach(originSystem => {
      systems.forEach(destSystem => {
        if (originSystem.id !== destSystem.id) {
          const routeExists = existingRoutes.some(route => 
            (route.origin === originSystem.id && route.destination === destSystem.id) ||
            (route.origin === destSystem.id && route.destination === originSystem.id)
          );
          
          if (!routeExists && Math.random() > 0.7) { // Randomly suggest some new routes
            const distance = Math.sqrt(
              Math.pow(destSystem.coordinates.x - originSystem.coordinates.x, 2) +
              Math.pow(destSystem.coordinates.y - originSystem.coordinates.y, 2) +
              Math.pow(destSystem.coordinates.z - originSystem.coordinates.z, 2)
            );
            
            opportunities.push({
              type: 'new_route',
              origin: originSystem.name,
              destination: destSystem.name,
              distance: Math.round(distance * 100) / 100,
              estimatedTraffic: Math.floor(Math.random() * 500) + 100,
              investmentRequired: Math.floor(distance * 1000000), // 1M credits per light year
              priority: distance < 10 ? 'high' : distance < 50 ? 'medium' : 'low'
            });
          }
        }
      });
    });
    
    // Sort opportunities by priority and profit
    opportunities.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 1;
      const bPriority = priorityOrder[b.priority] || 1;
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      const aProfit = a.profitMargin || a.estimatedTraffic || 0;
      const bProfit = b.profitMargin || b.estimatedTraffic || 0;
      return bProfit - aProfit;
    });
    
    res.json({
      opportunities: opportunities.slice(0, 10), // Return top 10 opportunities
      totalOpportunities: opportunities.length,
      timestamp: new Date()
    });
  });

  // Get specific corporation details
  app.get('/api/trade/corporations/:corporationId', (req, res) => {
    const corporation = tradeGameState.corporations.get(req.params.corporationId);
    if (!corporation) {
      return res.status(404).json({ error: 'Corporation not found' });
    }
    
    // Get corporation's contracts
    const corporationContracts = Array.from(tradeGameState.contracts.values())
      .filter(contract => contract.corporationId === req.params.corporationId);
    
    // Get corporation's trade routes
    const corporationRoutes = Array.from(tradeGameState.tradeRoutes.values())
      .filter(route => corporation.tradeRoutes.includes(route.id));
    
    const hqSystem = tradeGameState.starSystems.get(corporation.headquarters);
    
    res.json({
      ...corporation,
      headquartersName: hqSystem ? hqSystem.name : corporation.headquarters,
      contracts: corporationContracts,
      routes: corporationRoutes,
      totalContractValue: corporationContracts.reduce((sum, contract) => sum + contract.totalValue, 0),
      averageContractSize: corporationContracts.length > 0 ? 
        corporationContracts.reduce((sum, contract) => sum + contract.totalValue, 0) / corporationContracts.length : 0
    });
  });

  // Update contract status
  app.put('/api/trade/contracts/:contractId', (req, res) => {
    const contract = tradeGameState.contracts.get(req.params.contractId);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    const { status } = req.body;
    if (!['active', 'completed', 'cancelled', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    contract.status = status;
    contract.lastUpdated = new Date();
    
    if (status === 'completed') {
      contract.completedDate = new Date();
    }
    
    res.json({
      contract,
      message: `Contract status updated to ${status}`
    });
  });
}

module.exports = { setupTradeAPIs };

