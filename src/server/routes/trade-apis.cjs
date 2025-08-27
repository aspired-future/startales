const { 
  tradeGameState, 
  createCorporation, 
  createTradeRoute, 
  createContract, 
  calculateCurrentPrice, 
  simulateMarket, 
  getTradeAnalytics 
} = require('../game-state/trade-state.cjs');
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const tradeKnobsData = {
  // Market Regulation
  market_regulation_level: 0.5,      // AI can adjust market oversight (0.0=free market, 1.0=heavy regulation)
  trade_tariff_rate: 0.2,           // AI can set tariff rates (0.0-1.0, normalized from 0-50%)
  export_incentives: 0.3,           // AI can boost exports (0.0-1.0)
  import_restrictions: 0.2,         // AI can restrict imports (0.0-1.0)
  
  // Economic Policy
  currency_stability_focus: 0.6,    // AI can prioritize currency stability (0.0-1.0)
  inflation_control_priority: 0.7,  // AI can control inflation through trade (0.0-1.0)
  employment_protection: 0.5,       // AI can protect domestic jobs (0.0-1.0)
  
  // Trade Infrastructure
  logistics_investment: 0.4,        // AI can invest in trade infrastructure (0.0-1.0)
  technology_adoption: 0.6,         // AI can modernize trade systems (0.0-1.0)
  security_measures: 0.5,           // AI can enhance trade security (0.0-1.0)
  
  // International Relations
  trade_diplomacy_focus: 0.5,       // AI can prioritize trade diplomacy (0.0-1.0)
  alliance_trade_preference: 0.7,   // AI can favor allied trade partners (0.0-1.0)
  sanctions_enforcement: 0.3,       // AI can enforce trade sanctions (0.0-1.0)
  
  // Market Dynamics
  speculation_controls: 0.4,        // AI can control market speculation (0.0-1.0)
  price_volatility_dampening: 0.6, // AI can reduce price swings (0.0-1.0)
  supply_chain_resilience: 0.5,    // AI can strengthen supply chains (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const tradeKnobSystem = new EnhancedKnobSystem(tradeKnobsData);

// Backward compatibility - expose knobs directly
const tradeKnobs = tradeKnobSystem.knobs;

// Structured Outputs - For AI consumption, HUD display, and game state
function generateTradeStructuredOutputs() {
  const commodities = Array.from(tradeGameState.commodities.values());
  const routes = Array.from(tradeGameState.tradeRoutes.values());
  const corporations = Array.from(tradeGameState.corporations.values());
  
  // Calculate market health metrics
  const avgPriceVolatility = commodities.reduce((sum, commodity) => {
    const priceHistory = commodity.priceHistory || [];
    if (priceHistory.length < 2) return sum;
    
    const volatility = priceHistory.reduce((vSum, price, index) => {
      if (index === 0) return vSum;
      return vSum + Math.abs(price - priceHistory[index - 1]) / priceHistory[index - 1];
    }, 0) / (priceHistory.length - 1);
    
    return sum + volatility;
  }, 0) / commodities.length;
  
  const totalTradeVolume = routes.reduce((sum, route) => sum + (route.volume || 0), 0);
  const activeRoutes = routes.filter(route => route.status === 'active').length;
  const profitableRoutes = routes.filter(route => (route.profitability || 0) > 0).length;
  
  return {
    // High-level metrics for AI decision-making
    market_metrics: {
      total_trade_volume: totalTradeVolume,
      active_trade_routes: activeRoutes,
      route_profitability_ratio: activeRoutes > 0 ? profitableRoutes / activeRoutes : 0,
      market_volatility: avgPriceVolatility,
      commodity_diversity: commodities.length,
      corporate_competition: corporations.length,
      trade_balance: calculateTradeBalance(),
      economic_integration: calculateEconomicIntegration()
    },
    
    // Trade flow analysis for AI strategic planning
    trade_flows: {
      export_strength: analyzeExportStrength(),
      import_dependency: analyzeImportDependency(),
      supply_chain_stability: analyzeSupplyChainStability(),
      market_concentration: analyzeMarketConcentration(),
      trade_route_efficiency: analyzeRouteEfficiency()
    },
    
    // Policy impact assessment for AI feedback
    policy_effectiveness: {
      tariff_impact: assessTariffPolicy(),
      regulation_outcomes: assessRegulationPolicy(),
      infrastructure_roi: assessInfrastructureInvestment(),
      diplomacy_benefits: assessTradeDiplomacy(),
      security_effectiveness: assessSecurityMeasures()
    },
    
    // Market alerts and opportunities for AI attention
    ai_alerts: generateTradeAIAlerts(),
    
    // Structured data for other systems
    cross_system_data: {
      economic_impact: calculateEconomicImpact(),
      employment_effects: calculateEmploymentEffects(),
      resource_availability: calculateResourceAvailability(),
      technological_advancement: calculateTechAdvancement(),
      diplomatic_influence: calculateDiplomaticInfluence()
    },
    
    timestamp: Date.now(),
    knobs_applied: { ...tradeKnobs }
  };
}

// Helper functions for trade structured outputs
function calculateTradeBalance() {
  const routes = Array.from(tradeGameState.tradeRoutes.values());
  const exports = routes.filter(r => r.type === 'export').reduce((sum, r) => sum + (r.volume || 0), 0);
  const imports = routes.filter(r => r.type === 'import').reduce((sum, r) => sum + (r.volume || 0), 0);
  return exports - imports;
}

function calculateEconomicIntegration() {
  const routes = Array.from(tradeGameState.tradeRoutes.values());
  const uniquePartners = new Set(routes.map(r => r.destination || r.origin)).size;
  return Math.min(1.0, uniquePartners / 20); // Normalized to max 20 partners
}

function analyzeExportStrength() {
  const commodities = Array.from(tradeGameState.commodities.values());
  const exportCommodities = commodities.filter(c => (c.supply || 0) > (c.demand || 0));
  const strength = exportCommodities.length / commodities.length;
  return { strength_ratio: strength, competitive_commodities: exportCommodities.length };
}

function analyzeImportDependency() {
  const commodities = Array.from(tradeGameState.commodities.values());
  const importCommodities = commodities.filter(c => (c.demand || 0) > (c.supply || 0));
  const dependency = importCommodities.length / commodities.length;
  return { dependency_ratio: dependency, critical_imports: importCommodities.length };
}

function analyzeSupplyChainStability() {
  const routes = Array.from(tradeGameState.tradeRoutes.values());
  const stableRoutes = routes.filter(r => (r.reliability || 0) > 0.7).length;
  const stability = routes.length > 0 ? stableRoutes / routes.length : 0;
  return { stability_score: stability, stable_routes: stableRoutes, total_routes: routes.length };
}

function analyzeMarketConcentration() {
  const corporations = Array.from(tradeGameState.corporations.values());
  const totalMarketShare = corporations.reduce((sum, corp) => sum + (corp.marketShare || 0), 0);
  const topCorps = corporations.sort((a, b) => (b.marketShare || 0) - (a.marketShare || 0)).slice(0, 3);
  const concentration = topCorps.reduce((sum, corp) => sum + (corp.marketShare || 0), 0);
  return { concentration_ratio: concentration, market_leaders: topCorps.length };
}

function analyzeRouteEfficiency() {
  const routes = Array.from(tradeGameState.tradeRoutes.values());
  const avgEfficiency = routes.reduce((sum, route) => sum + (route.efficiency || 0.5), 0) / routes.length;
  return { average_efficiency: avgEfficiency, efficient_routes: routes.filter(r => (r.efficiency || 0) > 0.8).length };
}

function assessTariffPolicy() {
  const tariffRate = tradeKnobs.trade_tariff_rate;
  const tradeBalance = calculateTradeBalance();
  const impact = tariffRate * (tradeBalance < 0 ? 2 : 1); // Higher impact if trade deficit
  return { tariff_rate: tariffRate, trade_balance_impact: impact, effectiveness: impact > 0.15 ? 'significant' : 'moderate' };
}

function assessRegulationPolicy() {
  const regulation = tradeKnobs.market_regulation_level;
  const stability = analyzeSupplyChainStability().stability_score;
  const outcome = regulation * stability;
  return { regulation_level: regulation, market_stability: stability, regulatory_effectiveness: outcome };
}

function assessInfrastructureInvestment() {
  const investment = tradeKnobs.logistics_investment;
  const efficiency = analyzeRouteEfficiency().average_efficiency;
  const roi = investment * efficiency * 1.5; // Infrastructure multiplier
  return { investment_level: investment, route_efficiency: efficiency, roi_score: roi };
}

function assessTradeDiplomacy() {
  const diplomacy = tradeKnobs.trade_diplomacy_focus;
  const integration = calculateEconomicIntegration();
  const benefits = diplomacy * integration;
  return { diplomacy_focus: diplomacy, economic_integration: integration, diplomatic_benefits: benefits };
}

function assessSecurityMeasures() {
  const security = tradeKnobs.security_measures;
  const stability = analyzeSupplyChainStability().stability_score;
  const effectiveness = security * stability;
  return { security_investment: security, supply_chain_stability: stability, security_effectiveness: effectiveness };
}

function generateTradeAIAlerts() {
  const alerts = [];
  
  // Trade balance alerts
  const tradeBalance = calculateTradeBalance();
  if (tradeBalance < -1000000) alerts.push({ type: 'trade_deficit', severity: 'high', message: 'Large trade deficit threatens economic stability' });
  if (tradeBalance > 2000000) alerts.push({ type: 'trade_surplus', severity: 'medium', message: 'Large trade surplus may invite retaliation' });
  
  // Market volatility alert
  const commodities = Array.from(tradeGameState.commodities.values());
  const volatileCommodities = commodities.filter(c => {
    const history = c.priceHistory || [];
    if (history.length < 2) return false;
    const lastChange = Math.abs(history[history.length - 1] - history[history.length - 2]) / history[history.length - 2];
    return lastChange > 0.2; // 20% price change
  });
  
  if (volatileCommodities.length > commodities.length * 0.3) {
    alerts.push({ type: 'market_volatility', severity: 'high', message: 'High market volatility detected across multiple commodities' });
  }
  
  // Supply chain disruption alert
  const stability = analyzeSupplyChainStability();
  if (stability.stability_score < 0.4) {
    alerts.push({ type: 'supply_chain_risk', severity: 'high', message: 'Supply chain instability threatens trade operations' });
  }
  
  // Market concentration alert
  const concentration = analyzeMarketConcentration();
  if (concentration.concentration_ratio > 0.7) {
    alerts.push({ type: 'market_concentration', severity: 'medium', message: 'High market concentration may reduce competition' });
  }
  
  return alerts;
}

function calculateEconomicImpact() {
  const totalVolume = Array.from(tradeGameState.tradeRoutes.values()).reduce((sum, route) => sum + (route.volume || 0), 0);
  const avgProfitability = Array.from(tradeGameState.tradeRoutes.values()).reduce((sum, route) => sum + (route.profitability || 0), 0) / tradeGameState.tradeRoutes.size;
  const gdpContribution = totalVolume * avgProfitability * 0.1; // Simplified GDP calculation
  return { trade_volume: totalVolume, gdp_contribution: gdpContribution, economic_multiplier: avgProfitability };
}

function calculateEmploymentEffects() {
  const corporations = Array.from(tradeGameState.corporations.values());
  const totalEmployment = corporations.reduce((sum, corp) => sum + (corp.employees || 0), 0);
  const tradeJobs = totalEmployment * 0.3; // Assume 30% of corporate jobs are trade-related
  return { direct_employment: tradeJobs, indirect_employment: tradeJobs * 1.5, total_impact: tradeJobs * 2.5 };
}

function calculateResourceAvailability() {
  const commodities = Array.from(tradeGameState.commodities.values());
  const criticalResources = commodities.filter(c => c.category === 'raw_materials' || c.category === 'energy');
  const availability = criticalResources.reduce((sum, resource) => sum + (resource.supply || 0), 0) / criticalResources.length;
  return { resource_abundance: availability, critical_resources: criticalResources.length, supply_security: availability > 0.7 ? 'secure' : 'at_risk' };
}

function calculateTechAdvancement() {
  const techAdoption = tradeKnobs.technology_adoption;
  const efficiency = analyzeRouteEfficiency().average_efficiency;
  const advancement = techAdoption * efficiency;
  return { technology_level: techAdoption, operational_efficiency: efficiency, innovation_index: advancement };
}

function calculateDiplomaticInfluence() {
  const diplomacy = tradeKnobs.trade_diplomacy_focus;
  const integration = calculateEconomicIntegration();
  const influence = diplomacy * integration * 1.2; // Diplomatic multiplier
  return { diplomatic_investment: diplomacy, economic_leverage: integration, soft_power_index: influence };
}

// Apply AI knobs to actual trade game state
function applyTradeKnobsToGameState() {
  const commodities = Array.from(tradeGameState.commodities.values());
  const routes = Array.from(tradeGameState.tradeRoutes.values());
  
  // Apply market regulation to price volatility
  const regulationEffect = 1 - (tradeKnobs.market_regulation_level * 0.3); // Reduce volatility by up to 30%
  commodities.forEach(commodity => {
    if (commodity.priceHistory && commodity.priceHistory.length > 0) {
      const basePrice = commodity.basePrice;
      const currentPrice = commodity.currentPrice || basePrice;
      const maxDeviation = basePrice * 0.5 * regulationEffect; // Regulation limits price swings
      
      commodity.currentPrice = Math.max(basePrice - maxDeviation, Math.min(basePrice + maxDeviation, currentPrice));
    }
  });
  
  // Apply tariffs to trade routes (convert 0.0-1.0 to 0-50% tariff rate)
  routes.forEach(route => {
    if (route.type === 'import') {
      const tariffRate = tradeKnobs.trade_tariff_rate * 0.5; // Convert to 0-50% range
      const tariffCost = (route.value || 0) * tariffRate;
      route.cost = (route.cost || 0) + tariffCost;
      route.profitability = (route.profitability || 0) - (tariffCost / (route.value || 1));
    }
    
    if (route.type === 'export' && tradeKnobs.export_incentives > 0.5) {
      const incentive = (tradeKnobs.export_incentives - 0.5) * 0.2; // Up to 10% bonus
      route.profitability = (route.profitability || 0) * (1 + incentive);
    }
  });
  
  // Apply infrastructure investment to route efficiency
  const infrastructureBonus = tradeKnobs.logistics_investment * 0.2; // Up to 20% efficiency bonus
  routes.forEach(route => {
    route.efficiency = Math.min(1.0, (route.efficiency || 0.5) + infrastructureBonus);
  });
  
  // Apply security measures to route reliability
  const securityBonus = tradeKnobs.security_measures * 0.15; // Up to 15% reliability bonus
  routes.forEach(route => {
    route.reliability = Math.min(1.0, (route.reliability || 0.7) + securityBonus);
  });
  
  // Apply technology adoption to overall system efficiency
  const techBonus = tradeKnobs.technology_adoption * 0.1; // Up to 10% system-wide bonus
  routes.forEach(route => {
    route.volume = Math.floor((route.volume || 0) * (1 + techBonus));
  });
  
  console.log('🎛️ Trade knobs applied to game state:', {
    market_regulation: tradeKnobs.market_regulation_level,
    tariff_rate: tradeKnobs.trade_tariff_rate,
    infrastructure_investment: tradeKnobs.logistics_investment,
    security_measures: tradeKnobs.security_measures
  });
}

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

  // ===== AI INTEGRATION ENDPOINTS =====
  
  // Enhanced AI knob endpoints with multi-format input support
  app.get('/api/trade/knobs', (req, res) => {
    const knobData = tradeKnobSystem.getKnobsWithMetadata();
    res.json({
      ...knobData,
      system: 'trade',
      description: 'AI-adjustable parameters for trade system with enhanced input support',
      input_help: tradeKnobSystem.getKnobDescriptions()
    });
  });

  app.post('/api/trade/knobs', (req, res) => {
    const { knobs, source = 'ai' } = req.body;
    
    if (!knobs || typeof knobs !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid knobs data. Expected object with knob values.',
        help: tradeKnobSystem.getKnobDescriptions().examples
      });
    }
    
    // Update knobs using enhanced system
    const updateResult = tradeKnobSystem.updateKnobs(knobs, source);
    
    // Apply knobs to game state (this is where the magic happens)
    try {
      applyTradeKnobsToGameState();
    } catch (error) {
      console.error('Error applying trade knobs to game state:', error);
    }
    
    res.json({
      success: updateResult.success,
      system: 'trade',
      ...updateResult,
      message: 'Trade knobs updated successfully using enhanced input processing'
    });
  });

  // Get knob help/documentation
  app.get('/api/trade/knobs/help', (req, res) => {
    res.json({
      system: 'trade',
      help: tradeKnobSystem.getKnobDescriptions(),
      current_values: tradeKnobSystem.getKnobsWithMetadata()
    });
  });

  // Get structured outputs for AI consumption
  app.get('/api/trade/ai-data', (req, res) => {
    const structuredData = generateTradeStructuredOutputs();
    res.json({
      ...structuredData,
      description: 'Structured trade data for AI analysis and decision-making'
    });
  });

  // Get cross-system integration data
  app.get('/api/trade/cross-system', (req, res) => {
    const outputs = generateTradeStructuredOutputs();
    res.json({
      economic_data: outputs.cross_system_data.economic_impact,
      employment_data: outputs.cross_system_data.employment_effects,
      resource_data: outputs.cross_system_data.resource_availability,
      technology_data: outputs.cross_system_data.technological_advancement,
      diplomatic_data: outputs.cross_system_data.diplomatic_influence,
      market_summary: outputs.market_metrics,
      timestamp: outputs.timestamp
    });
  });

  // Get trade alerts for AI attention
  app.get('/api/trade/alerts', (req, res) => {
    const outputs = generateTradeStructuredOutputs();
    res.json({
      alerts: outputs.ai_alerts,
      alert_count: outputs.ai_alerts.length,
      high_priority: outputs.ai_alerts.filter(alert => alert.severity === 'high').length,
      timestamp: outputs.timestamp
    });
  });

  // Simulate market changes (for AI testing and game progression)
  app.post('/api/trade/simulate', (req, res) => {
    const { steps = 1, applyKnobs = true } = req.body;
    
    try {
      // Apply current knobs if requested
      if (applyKnobs) {
        applyTradeKnobsToGameState();
      }
      
      // Run market simulation
      for (let i = 0; i < steps; i++) {
        simulateMarket();
      }
      
      const outputs = generateTradeStructuredOutputs();
      
      res.json({
        success: true,
        simulation_steps: steps,
        knobs_applied: applyKnobs,
        market_state: outputs.market_metrics,
        alerts: outputs.ai_alerts,
        timestamp: outputs.timestamp
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Market simulation failed', 
        details: error.message 
      });
    }
  });
}

module.exports = { setupTradeAPIs };

