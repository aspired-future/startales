// ===== TRADE MANAGEMENT SYSTEM =====
const tradeGameState = {
  starSystems: new Map(),
  tradeRoutes: new Map(),
  tradingPosts: new Map(),
  corporations: new Map(),
  contracts: new Map(),
  tariffs: new Map(),
  commodities: new Map(),
  marketData: new Map(),
  tradeHistory: [],
  globalTradeCounter: 1,
  globalRouteCounter: 1,
  globalContractCounter: 1,
  globalCorporationCounter: 1,

  // Base commodity types
  commodityTypes: [
    { id: 'alloy', name: 'Quantum Alloys', category: 'materials', basePrice: 100, volatility: 0.15, unit: 'tons' },
    { id: 'fuel', name: 'Hyperdrive Fuel', category: 'energy', basePrice: 50, volatility: 0.25, unit: 'units' },
    { id: 'food', name: 'Synthetic Food', category: 'consumables', basePrice: 25, volatility: 0.10, unit: 'crates' },
    { id: 'tech', name: 'Advanced Technology', category: 'technology', basePrice: 200, volatility: 0.30, unit: 'modules' },
    { id: 'medicine', name: 'Medical Supplies', category: 'healthcare', basePrice: 150, volatility: 0.20, unit: 'doses' },
    { id: 'luxury', name: 'Luxury Goods', category: 'consumer', basePrice: 300, volatility: 0.35, unit: 'items' },
    { id: 'raw_materials', name: 'Raw Materials', category: 'materials', basePrice: 40, volatility: 0.12, unit: 'tons' },
    { id: 'weapons', name: 'Military Equipment', category: 'military', basePrice: 500, volatility: 0.40, unit: 'units' },
    { id: 'data', name: 'Information Data', category: 'technology', basePrice: 80, volatility: 0.45, unit: 'packets' },
    { id: 'art', name: 'Cultural Artifacts', category: 'culture', basePrice: 250, volatility: 0.50, unit: 'pieces' }
  ],

  // Trade route types
  routeTypes: [
    { id: 'express', name: 'Express Route', speedMultiplier: 2.0, costMultiplier: 1.5, riskLevel: 'low' },
    { id: 'standard', name: 'Standard Route', speedMultiplier: 1.0, costMultiplier: 1.0, riskLevel: 'medium' },
    { id: 'bulk', name: 'Bulk Cargo Route', speedMultiplier: 0.7, costMultiplier: 0.8, riskLevel: 'medium' },
    { id: 'secure', name: 'Secure Route', speedMultiplier: 0.8, costMultiplier: 1.3, riskLevel: 'very_low' },
    { id: 'smuggling', name: 'Black Market Route', speedMultiplier: 1.2, costMultiplier: 0.6, riskLevel: 'very_high' }
  ],

  // Contract types
  contractTypes: [
    { id: 'spot', name: 'Spot Contract', duration: 'immediate', priceModifier: 1.0 },
    { id: 'short_term', name: 'Short Term Contract', duration: '30_days', priceModifier: 0.95 },
    { id: 'long_term', name: 'Long Term Contract', duration: '1_year', priceModifier: 0.85 },
    { id: 'offtake', name: 'Offtake Agreement', duration: '5_years', priceModifier: 0.75 },
    { id: 'futures', name: 'Futures Contract', duration: 'variable', priceModifier: 1.1 }
  ],

  // Corporation sectors
  corporationSectors: [
    'mining', 'manufacturing', 'shipping', 'technology', 'agriculture', 
    'energy', 'pharmaceuticals', 'entertainment', 'finance', 'defense'
  ]
};

function initializeTradeSystem() {
  // Initialize star systems with trade data
  const systems = [
    {
      id: 'sol',
      name: 'Sol System',
      coordinates: { x: 0, y: 0, z: 0 },
      economicTier: 'tier_1',
      specializations: ['technology', 'finance', 'manufacturing'],
      tradeVolume: 1000000,
      securityLevel: 'high',
      taxRate: 0.08
    },
    {
      id: 'alpha_centauri',
      name: 'Alpha Centauri System',
      coordinates: { x: 4.3, y: 0, z: 0 },
      economicTier: 'tier_1',
      specializations: ['mining', 'energy', 'research'],
      tradeVolume: 750000,
      securityLevel: 'high',
      taxRate: 0.06
    },
    {
      id: 'vega',
      name: 'Vega System',
      coordinates: { x: 25, y: 0, z: 0 },
      economicTier: 'tier_2',
      specializations: ['agriculture', 'luxury', 'culture'],
      tradeVolume: 500000,
      securityLevel: 'medium',
      taxRate: 0.10
    },
    {
      id: 'kepler',
      name: 'Kepler System',
      coordinates: { x: 600, y: 0, z: 0 },
      economicTier: 'tier_2',
      specializations: ['technology', 'research', 'data'],
      tradeVolume: 400000,
      securityLevel: 'medium',
      taxRate: 0.05
    },
    {
      id: 'sirius',
      name: 'Sirius System',
      coordinates: { x: 8.6, y: 0, z: 0 },
      economicTier: 'tier_1',
      specializations: ['shipping', 'trade', 'finance'],
      tradeVolume: 900000,
      securityLevel: 'medium',
      taxRate: 0.04
    }
  ];

  systems.forEach(system => {
    tradeGameState.starSystems.set(system.id, system);
  });

  // Initialize commodities with current market prices
  tradeGameState.commodityTypes.forEach(commodity => {
    tradeGameState.commodities.set(commodity.id, {
      ...commodity,
      currentPrice: commodity.basePrice * (0.8 + Math.random() * 0.4), // ±20% variation
      priceHistory: generatePriceHistory(commodity.basePrice, commodity.volatility),
      supply: Math.floor(Math.random() * 10000) + 1000,
      demand: Math.floor(Math.random() * 8000) + 2000,
      lastUpdated: new Date()
    });
  });

  // Initialize sample corporations
  const sampleCorps = [
    {
      name: 'Galactic Mining Consortium',
      sector: 'mining',
      headquarters: 'alpha_centauri',
      specialties: ['alloy', 'raw_materials'],
      reputation: 85,
      marketShare: 0.25
    },
    {
      name: 'Sirius Trade Federation',
      sector: 'shipping',
      headquarters: 'sirius',
      specialties: ['logistics', 'transport'],
      reputation: 92,
      marketShare: 0.35
    },
    {
      name: 'Vega Luxury Imports',
      sector: 'entertainment',
      headquarters: 'vega',
      specialties: ['luxury', 'art'],
      reputation: 78,
      marketShare: 0.15
    },
    {
      name: 'Sol Tech Industries',
      sector: 'technology',
      headquarters: 'sol',
      specialties: ['tech', 'data'],
      reputation: 88,
      marketShare: 0.30
    },
    {
      name: 'Kepler Research Corp',
      sector: 'technology',
      headquarters: 'kepler',
      specialties: ['tech', 'medicine'],
      reputation: 90,
      marketShare: 0.20
    }
  ];

  sampleCorps.forEach(corp => {
    const corporation = createCorporation(corp);
    tradeGameState.corporations.set(corporation.id, corporation);
  });

  // Initialize sample trade routes
  const sampleRoutes = [
    {
      origin: 'sol',
      destination: 'alpha_centauri',
      routeType: 'standard',
      primaryCommodities: ['tech', 'fuel'],
      distance: 4.3,
      travelTime: 15 // days
    },
    {
      origin: 'sirius',
      destination: 'vega',
      routeType: 'bulk',
      primaryCommodities: ['luxury', 'art'],
      distance: 16.4,
      travelTime: 25
    },
    {
      origin: 'alpha_centauri',
      destination: 'kepler',
      routeType: 'express',
      primaryCommodities: ['alloy', 'raw_materials'],
      distance: 595.7,
      travelTime: 180
    }
  ];

  sampleRoutes.forEach(route => {
    const tradeRoute = createTradeRoute(route);
    tradeGameState.tradeRoutes.set(tradeRoute.id, tradeRoute);
  });

  // Initialize sample contracts
  const sampleContracts = [
    {
      type: 'long_term',
      commodity: 'alloy',
      quantity: 500,
      originSystem: 'alpha_centauri',
      destinationSystem: 'sol',
      corporationId: Array.from(tradeGameState.corporations.keys())[0]
    },
    {
      type: 'spot',
      commodity: 'luxury',
      quantity: 100,
      originSystem: 'vega',
      destinationSystem: 'sirius',
      corporationId: Array.from(tradeGameState.corporations.keys())[2]
    }
  ];

  sampleContracts.forEach(contract => {
    const tradeContract = createContract(contract);
    tradeGameState.contracts.set(tradeContract.id, tradeContract);
  });

  console.log(`Trade system initialized with ${tradeGameState.starSystems.size} systems, ${tradeGameState.corporations.size} corporations, and ${tradeGameState.tradeRoutes.size} routes`);
}

function generatePriceHistory(basePrice, volatility, days = 30) {
  const history = [];
  let currentPrice = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random walk with mean reversion
    const change = (Math.random() - 0.5) * volatility * basePrice;
    const meanReversion = (basePrice - currentPrice) * 0.1;
    currentPrice = Math.max(basePrice * 0.3, currentPrice + change + meanReversion);
    
    history.push({
      date: date,
      price: Math.round(currentPrice * 100) / 100,
      volume: Math.floor(Math.random() * 1000) + 100
    });
  }
  
  return history;
}

function createCorporation(corpData) {
  const corporation = {
    id: `corp_${tradeGameState.globalCorporationCounter++}`,
    name: corpData.name,
    sector: corpData.sector,
    headquarters: corpData.headquarters,
    specialties: corpData.specialties || [],
    reputation: corpData.reputation || 50,
    marketShare: corpData.marketShare || 0.1,
    founded: corpData.founded || new Date(Date.now() - Math.random() * 10 * 365 * 24 * 60 * 60 * 1000), // Random date within 10 years
    employees: Math.floor(Math.random() * 50000) + 1000,
    revenue: Math.floor(Math.random() * 1000000000) + 100000000, // 100M - 1B credits
    assets: [],
    contracts: [],
    tradeRoutes: [],
    lastUpdated: new Date()
  };
  
  return corporation;
}

function createTradeRoute(routeData) {
  const route = {
    id: `route_${tradeGameState.globalRouteCounter++}`,
    name: `${routeData.origin.toUpperCase()} → ${routeData.destination.toUpperCase()}`,
    origin: routeData.origin,
    destination: routeData.destination,
    routeType: routeData.routeType || 'standard',
    primaryCommodities: routeData.primaryCommodities || [],
    distance: routeData.distance,
    travelTime: routeData.travelTime, // in days
    status: 'active',
    securityLevel: calculateRouteSecurityLevel(routeData.origin, routeData.destination),
    trafficVolume: Math.floor(Math.random() * 1000) + 100,
    profitability: Math.random() * 0.3 + 0.1, // 10-40% profit margin
    established: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000), // Random date within 5 years
    lastUpdated: new Date()
  };
  
  return route;
}

function createContract(contractData) {
  const contractType = tradeGameState.contractTypes.find(t => t.id === contractData.type) || tradeGameState.contractTypes[0];
  const commodity = tradeGameState.commodities.get(contractData.commodity);
  const basePrice = commodity ? commodity.currentPrice : 100;
  
  const contract = {
    id: `ctr_${tradeGameState.globalContractCounter++}`,
    type: contractData.type,
    commodity: contractData.commodity,
    quantity: contractData.quantity,
    unitPrice: Math.round(basePrice * contractType.priceModifier * 100) / 100,
    totalValue: Math.round(basePrice * contractType.priceModifier * contractData.quantity * 100) / 100,
    originSystem: contractData.originSystem,
    destinationSystem: contractData.destinationSystem,
    corporationId: contractData.corporationId,
    status: 'active',
    created: new Date(),
    duration: contractType.duration,
    deliveryDate: calculateDeliveryDate(contractData.originSystem, contractData.destinationSystem),
    terms: generateContractTerms(contractData),
    lastUpdated: new Date()
  };
  
  return contract;
}

function calculateRouteSecurityLevel(origin, destination) {
  const originSystem = tradeGameState.starSystems.get(origin);
  const destSystem = tradeGameState.starSystems.get(destination);
  
  if (!originSystem || !destSystem) return 'unknown';
  
  const avgSecurity = (getSecurityScore(originSystem.securityLevel) + getSecurityScore(destSystem.securityLevel)) / 2;
  
  if (avgSecurity >= 4) return 'high';
  if (avgSecurity >= 3) return 'medium';
  if (avgSecurity >= 2) return 'low';
  return 'very_low';
}

function getSecurityScore(level) {
  switch (level) {
    case 'very_high': return 5;
    case 'high': return 4;
    case 'medium': return 3;
    case 'low': return 2;
    case 'very_low': return 1;
    default: return 3;
  }
}

function calculateDeliveryDate(origin, destination) {
  const route = Array.from(tradeGameState.tradeRoutes.values())
    .find(r => (r.origin === origin && r.destination === destination) || 
                (r.origin === destination && r.destination === origin));
  
  const travelTime = route ? route.travelTime : 30; // Default 30 days
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + travelTime);
  
  return deliveryDate;
}

function generateContractTerms(contractData) {
  const terms = [
    'Standard galactic trade regulations apply',
    'Force majeure clause included',
    'Payment due within 30 days of delivery'
  ];
  
  if (contractData.type === 'long_term' || contractData.type === 'offtake') {
    terms.push('Price adjustment clause for market volatility');
    terms.push('Minimum quality standards must be maintained');
  }
  
  if (contractData.type === 'futures') {
    terms.push('Settlement can be cash or physical delivery');
    terms.push('Margin requirements apply');
  }
  
  return terms;
}

function calculateCurrentPrice(commodityId, systemId) {
  const commodity = tradeGameState.commodities.get(commodityId);
  const system = tradeGameState.starSystems.get(systemId);
  
  if (!commodity || !system) return 0;
  
  let price = commodity.currentPrice;
  
  // Apply system-specific modifiers
  if (system.specializations.includes(commodity.category)) {
    price *= 0.9; // 10% discount for specialized systems
  }
  
  // Apply tax
  price *= (1 + system.taxRate);
  
  // Apply supply/demand dynamics
  const supplyDemandRatio = commodity.supply / commodity.demand;
  if (supplyDemandRatio > 1.2) {
    price *= 0.95; // Oversupply reduces price
  } else if (supplyDemandRatio < 0.8) {
    price *= 1.05; // High demand increases price
  }
  
  return Math.round(price * 100) / 100;
}

function simulateMarket() {
  // Update commodity prices
  tradeGameState.commodities.forEach((commodity, commodityId) => {
    const volatility = commodity.volatility;
    const change = (Math.random() - 0.5) * volatility * commodity.basePrice;
    const meanReversion = (commodity.basePrice - commodity.currentPrice) * 0.05;
    
    commodity.currentPrice = Math.max(
      commodity.basePrice * 0.3,
      commodity.currentPrice + change + meanReversion
    );
    
    // Update supply and demand
    commodity.supply += Math.floor((Math.random() - 0.5) * 1000);
    commodity.demand += Math.floor((Math.random() - 0.5) * 800);
    commodity.supply = Math.max(100, commodity.supply);
    commodity.demand = Math.max(100, commodity.demand);
    
    commodity.lastUpdated = new Date();
    
    // Add to price history
    commodity.priceHistory.push({
      date: new Date(),
      price: Math.round(commodity.currentPrice * 100) / 100,
      volume: Math.floor(Math.random() * 1000) + 100
    });
    
    // Keep only last 30 days of history
    if (commodity.priceHistory.length > 30) {
      commodity.priceHistory = commodity.priceHistory.slice(-30);
    }
  });
  
  // Update trade route traffic
  tradeGameState.tradeRoutes.forEach(route => {
    route.trafficVolume += Math.floor((Math.random() - 0.5) * 100);
    route.trafficVolume = Math.max(50, route.trafficVolume);
    route.lastUpdated = new Date();
  });
}

function getTradeAnalytics() {
  const analytics = {
    totalSystems: tradeGameState.starSystems.size,
    totalRoutes: tradeGameState.tradeRoutes.size,
    totalCorporations: tradeGameState.corporations.size,
    totalContracts: tradeGameState.contracts.size,
    activeContracts: Array.from(tradeGameState.contracts.values()).filter(c => c.status === 'active').length,
    totalTradeVolume: Array.from(tradeGameState.starSystems.values()).reduce((sum, sys) => sum + sys.tradeVolume, 0),
    averagePrice: Array.from(tradeGameState.commodities.values()).reduce((sum, comm) => sum + comm.currentPrice, 0) / tradeGameState.commodities.size,
    topCommodities: Array.from(tradeGameState.commodities.values())
      .sort((a, b) => b.currentPrice - a.currentPrice)
      .slice(0, 5)
      .map(c => ({ id: c.id, name: c.name, price: c.currentPrice })),
    topRoutes: Array.from(tradeGameState.tradeRoutes.values())
      .sort((a, b) => b.trafficVolume - a.trafficVolume)
      .slice(0, 5)
      .map(r => ({ id: r.id, name: r.name, traffic: r.trafficVolume }))
  };
  
  return analytics;
}

// Initialize the trade system
initializeTradeSystem();

module.exports = {
  tradeGameState,
  createCorporation,
  createTradeRoute,
  createContract,
  calculateCurrentPrice,
  simulateMarket,
  getTradeAnalytics,
  initializeTradeSystem
};

