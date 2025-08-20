// ===== CITIES MANAGEMENT SYSTEM =====
const citiesGameState = {
  cities: new Map(),
  starSystems: new Map(),
  planetData: new Map(),
  globalCityCounter: 1,
  
  // Infrastructure types with enhanced properties
  infrastructureTypes: [
    { id: 'housing', name: 'Housing', category: 'residential', baseCapacity: 10000, upgradeCost: 50000 },
    { id: 'commercial', name: 'Commercial', category: 'economic', baseCapacity: 5000, upgradeCost: 75000 },
    { id: 'industrial', name: 'Industrial', category: 'economic', baseCapacity: 3000, upgradeCost: 100000 },
    { id: 'education', name: 'Education', category: 'social', baseCapacity: 8000, upgradeCost: 60000 },
    { id: 'healthcare', name: 'Healthcare', category: 'social', baseCapacity: 12000, upgradeCost: 80000 },
    { id: 'transportation', name: 'Transportation', category: 'infrastructure', baseCapacity: 15000, upgradeCost: 90000 },
    { id: 'utilities', name: 'Utilities', category: 'infrastructure', baseCapacity: 20000, upgradeCost: 70000 },
    { id: 'entertainment', name: 'Entertainment', category: 'social', baseCapacity: 6000, upgradeCost: 40000 },
    { id: 'military_base', name: 'Military Base', category: 'defense', baseCapacity: 2000, upgradeCost: 150000 },
    { id: 'spaceport', name: 'Spaceport', category: 'transport', baseCapacity: 1000, upgradeCost: 200000 },
    { id: 'research_facility', name: 'Research Facility', category: 'science', baseCapacity: 1500, upgradeCost: 120000 },
    { id: 'security', name: 'Security', category: 'defense', baseCapacity: 5000, upgradeCost: 85000 }
  ],
  
  // Enhanced specialization types with requirements and priorities
  specializationTypes: [
    {
      id: 'industrial_hub',
      name: 'Industrial Hub',
      focus: 'manufacturing',
      requiredPopulation: 500000,
      requirements: { industrial: 5, transportation: 4, utilities: 4 },
      primaryIndustries: ['manufacturing', 'logistics', 'heavy_industry'],
      autopilotPriority: { economic: 0.5, military: 0.2, research: 0.1, infrastructure: 0.2 }
    },
    {
      id: 'tech_center',
      name: 'Technology Center',
      focus: 'innovation',
      requiredPopulation: 300000,
      requirements: { research_facility: 6, education: 5, utilities: 4 },
      primaryIndustries: ['software', 'biotechnology', 'artificial_intelligence'],
      autopilotPriority: { economic: 0.3, military: 0.1, research: 0.5, infrastructure: 0.1 }
    },
    {
      id: 'trade_port',
      name: 'Trade Port',
      focus: 'commerce',
      requiredPopulation: 200000,
      requirements: { spaceport: 4, commercial: 5, transportation: 5 },
      primaryIndustries: ['interstellar_trade', 'logistics', 'finance'],
      autopilotPriority: { economic: 0.6, military: 0.1, research: 0.1, infrastructure: 0.2 }
    },
    {
      id: 'research_station',
      name: 'Research Station',
      focus: 'science',
      requiredPopulation: 150000,
      requirements: { research_facility: 7, education: 6, utilities: 5 },
      primaryIndustries: ['scientific_research', 'development', 'innovation'],
      autopilotPriority: { economic: 0.2, military: 0.1, research: 0.6, infrastructure: 0.1 }
    },
    {
      id: 'military_fortress',
      name: 'Military Fortress',
      focus: 'defense',
      requiredPopulation: 400000,
      requirements: { military_base: 6, security: 5, industrial: 4 },
      primaryIndustries: ['defense_manufacturing', 'military_training', 'security'],
      autopilotPriority: { economic: 0.2, military: 0.6, research: 0.1, infrastructure: 0.1 }
    },
    {
      id: 'agricultural_center',
      name: 'Agricultural Center',
      focus: 'food_production',
      requiredPopulation: 100000,
      requirements: { utilities: 4, transportation: 3, industrial: 2 },
      primaryIndustries: ['agriculture', 'food_processing', 'biotechnology'],
      autopilotPriority: { economic: 0.4, military: 0.1, research: 0.2, infrastructure: 0.3 }
    },
    {
      id: 'mining_colony',
      name: 'Mining Colony',
      focus: 'resource_extraction',
      requiredPopulation: 80000,
      requirements: { industrial: 5, utilities: 4, transportation: 4 },
      primaryIndustries: ['mining', 'resource_processing', 'heavy_machinery'],
      autopilotPriority: { economic: 0.5, military: 0.2, research: 0.1, infrastructure: 0.2 }
    },
    {
      id: 'cultural_hub',
      name: 'Cultural Hub',
      focus: 'arts_entertainment',
      requiredPopulation: 250000,
      requirements: { entertainment: 6, education: 4, commercial: 4 },
      primaryIndustries: ['arts', 'entertainment', 'tourism', 'media'],
      autopilotPriority: { economic: 0.4, military: 0.1, research: 0.2, infrastructure: 0.3 }
    }
  ],
  
  // Autopilot system settings
  autopilotSettings: {
    enabled: true,
    aggressiveness: 'balanced', // conservative, balanced, aggressive
    priorityFocus: 'economic', // economic, military, research, balanced
    infrastructureThreshold: 0.8 // Upgrade when utilization > 80%
  },
  
  // Strategic importance types
  strategicImportanceTypes: ['capital', 'military', 'research', 'industrial', 'transport', 'frontier'],
  
  // Terrain and climate types
  terrainTypes: ['coastal', 'mountains', 'plains', 'hills', 'river', 'desert', 'forest', 'tundra'],
  climateTypes: ['temperate', 'tropical', 'arid', 'arctic', 'mediterranean', 'continental']
};

// Initialize cities game state with comprehensive data
function initializeCitiesGameState() {
  // Create star systems
  const starSystems = [
    { id: 'sol', name: 'Sol System', coordinates: { x: 150, y: 150 }, planets: ['earth', 'mars', 'europa'] },
    { id: 'alpha_centauri', name: 'Alpha Centauri', coordinates: { x: 200, y: 100 }, planets: ['proxima_b', 'centauri_prime'] },
    { id: 'vega', name: 'Vega System', coordinates: { x: 100, y: 200 }, planets: ['vega_prime', 'vega_minor'] },
    { id: 'kepler', name: 'Kepler System', coordinates: { x: 250, y: 180 }, planets: ['kepler_442b'] },
    { id: 'sirius', name: 'Sirius System', coordinates: { x: 180, y: 250 }, planets: ['sirius_alpha'] }
  ];
  
  starSystems.forEach(system => {
    citiesGameState.starSystems.set(system.id, system);
  });
  
  // Create planets with resources
  const planets = [
    { id: 'earth', name: 'Earth', starSystem: 'sol', resources: ['water', 'minerals', 'agriculture'], habitability: 95 },
    { id: 'mars', name: 'Mars', starSystem: 'sol', resources: ['iron', 'rare_metals', 'ice'], habitability: 60 },
    { id: 'europa', name: 'Europa', starSystem: 'sol', resources: ['water', 'energy', 'rare_elements'], habitability: 40 },
    { id: 'proxima_b', name: 'Proxima Centauri b', starSystem: 'alpha_centauri', resources: ['energy', 'minerals'], habitability: 70 },
    { id: 'centauri_prime', name: 'Centauri Prime', starSystem: 'alpha_centauri', resources: ['agriculture', 'water', 'minerals'], habitability: 85 },
    { id: 'vega_prime', name: 'Vega Prime', starSystem: 'vega', resources: ['rare_metals', 'energy', 'crystals'], habitability: 75 },
    { id: 'vega_minor', name: 'Vega Minor', starSystem: 'vega', resources: ['ice', 'minerals'], habitability: 45 },
    { id: 'kepler_442b', name: 'Kepler-442b', starSystem: 'kepler', resources: ['water', 'agriculture', 'biomass'], habitability: 90 },
    { id: 'sirius_alpha', name: 'Sirius Alpha', starSystem: 'sirius', resources: ['energy', 'rare_elements', 'crystals'], habitability: 65 }
  ];
  
  planets.forEach(planet => {
    citiesGameState.planetData.set(planet.id, planet);
  });
  
  // Create comprehensive cities
  const sampleCities = [
    {
      id: 'city_1',
      name: 'New Terra',
      planet: 'earth',
      starSystem: 'sol',
      population: 2500000,
      coordinates: { x: 120, y: 80 },
      terrain: 'coastal',
      climate: 'temperate',
      strategicImportance: 'capital',
      founded: new Date('2157-03-15')
    },
    {
      id: 'city_2',
      name: 'Alpha Station',
      planet: 'centauri_prime',
      starSystem: 'alpha_centauri',
      population: 1200000,
      coordinates: { x: 200, y: 150 },
      terrain: 'plains',
      climate: 'mediterranean',
      strategicImportance: 'military',
      founded: new Date('2162-08-22')
    },
    {
      id: 'city_3',
      name: 'Beta Colony',
      planet: 'mars',
      starSystem: 'sol',
      population: 800000,
      coordinates: { x: 180, y: 200 },
      terrain: 'desert',
      climate: 'arid',
      strategicImportance: 'industrial',
      founded: new Date('2159-11-10')
    },
    {
      id: 'city_4',
      name: 'Vega Research Hub',
      planet: 'vega_prime',
      starSystem: 'vega',
      population: 600000,
      coordinates: { x: 90, y: 120 },
      terrain: 'mountains',
      climate: 'continental',
      strategicImportance: 'research',
      founded: new Date('2164-05-18')
    },
    {
      id: 'city_5',
      name: 'Kepler Gardens',
      planet: 'kepler_442b',
      starSystem: 'kepler',
      population: 900000,
      coordinates: { x: 250, y: 100 },
      terrain: 'forest',
      climate: 'tropical',
      strategicImportance: 'transport',
      founded: new Date('2161-12-03')
    },
    {
      id: 'city_6',
      name: 'Sirius Outpost',
      planet: 'sirius_alpha',
      starSystem: 'sirius',
      population: 450000,
      coordinates: { x: 160, y: 250 },
      terrain: 'hills',
      climate: 'temperate',
      strategicImportance: 'frontier',
      founded: new Date('2165-07-28')
    }
  ];

  sampleCities.forEach(cityData => {
    const city = createCity(cityData);
    citiesGameState.cities.set(cityData.id, city);
  });

  console.log(`Cities game state initialized with ${citiesGameState.cities.size} cities across ${citiesGameState.starSystems.size} star systems`);
}

// Create a comprehensive city with all systems
function createCity(cityData) {
  const planet = citiesGameState.planetData.get(cityData.planet);
  const planetaryResources = planet ? planet.resources : ['minerals', 'water'];
  
  // Generate infrastructure based on city type and population
  const infrastructure = citiesGameState.infrastructureTypes.map(type => {
    const baseLevel = Math.floor(Math.random() * 5) + 3; // 3-7 base level
    const populationBonus = Math.floor(cityData.population / 500000); // Bonus for larger cities
    const level = Math.min(10, baseLevel + populationBonus);
    
    return {
      id: type.id,
      name: type.name,
      category: type.category,
      level: level,
      capacity: type.baseCapacity * level,
      utilization: 0.4 + Math.random() * 0.4, // 40-80% utilization
      maintenanceCost: type.upgradeCost * 0.1 * level,
      upgradeRecommended: false
    };
  });
  
  // Calculate derived metrics
  const totalInfrastructure = infrastructure.reduce((sum, infra) => sum + infra.level, 0);
  const averageInfrastructureLevel = totalInfrastructure / infrastructure.length;
  
  // Generate geographic advantages
  const geographicAdvantages = generateGeographicAdvantages(cityData.terrain, cityData.climate);
  
  // Calculate economic output based on population and infrastructure
  const economicOutput = cityData.population * (50 + averageInfrastructureLevel * 10);
  const averageIncome = economicOutput / cityData.population * 0.6;
  
  // Calculate quality metrics
  const qualityOfLife = Math.min(100, 40 + averageInfrastructureLevel * 6 + geographicAdvantages.length * 5);
  const attractiveness = Math.min(100, qualityOfLife + Math.random() * 20 - 10);
  const sustainability = Math.min(100, 50 + averageInfrastructureLevel * 4 + (planet?.habitability || 50) * 0.3);
  
  // Calculate galactic metrics
  const militaryStrength = calculateMilitaryStrength(infrastructure);
  const researchOutput = calculateResearchOutput(infrastructure, cityData.population);
  const tradeValue = calculateTradeValue(infrastructure, planetaryResources);
  
  // Development priorities based on strategic importance
  const developmentPriorities = calculateDevelopmentPriorities(cityData, infrastructure);
  
  const city = {
    id: cityData.id,
    name: cityData.name,
    planet: cityData.planet,
    starSystem: cityData.starSystem,
    population: cityData.population,
    coordinates: cityData.coordinates,
    terrain: cityData.terrain,
    climate: cityData.climate,
    strategicImportance: cityData.strategicImportance,
    founded: cityData.founded,
    
    // Infrastructure
    infrastructure: infrastructure,
    totalInfrastructure: totalInfrastructure,
    averageInfrastructureLevel: averageInfrastructureLevel,
    
    // Economic metrics
    economicOutput: economicOutput,
    averageIncome: averageIncome,
    taxRate: 0.20, // 20% default tax rate
    governmentBudget: economicOutput * 0.20,
    infrastructureBudget: economicOutput * 0.20 * 0.6,
    
    // Quality metrics
    qualityOfLife: qualityOfLife,
    attractiveness: attractiveness,
    sustainability: sustainability,
    
    // Galactic metrics
    militaryStrength: militaryStrength,
    researchOutput: researchOutput,
    tradeValue: tradeValue,
    
    // Specialization
    currentSpecialization: null,
    specializationProgress: 0,
    
    // Geographic and planetary
    geographicAdvantages: geographicAdvantages,
    planetaryResources: planetaryResources,
    
    // Autopilot system
    autopilotEnabled: true,
    playerControlled: false,
    developmentPriorities: developmentPriorities,
    autopilotDecisions: [],
    lastAutopilotRun: null,
    
    // Metadata
    lastUpdated: new Date(),
    createdAt: new Date()
  };

  return city;
}

// Helper functions (simplified versions)
function generateGeographicAdvantages(terrain, climate) {
  const terrainAdvantages = {
    coastal: ['natural_harbor', 'fishing_grounds', 'tourism_potential'],
    mountains: ['mineral_deposits', 'hydroelectric_potential', 'defensive_position'],
    plains: ['agricultural_fertility', 'easy_expansion', 'transportation_hub'],
    hills: ['scenic_beauty', 'wind_energy', 'strategic_position'],
    river: ['fresh_water', 'transportation_route', 'fertile_soil'],
    desert: ['solar_energy', 'mineral_extraction', 'unique_ecosystem'],
    forest: ['timber_resources', 'biodiversity', 'carbon_sequestration'],
    tundra: ['mineral_deposits', 'research_opportunities', 'unique_ecosystem']
  };
  
  const advantages = [];
  const terrainOptions = terrainAdvantages[terrain] || [];
  const numAdvantages = Math.floor(Math.random() * 2) + 1;
  
  for (let i = 0; i < numAdvantages && i < terrainOptions.length; i++) {
    const randomAdvantage = terrainOptions[Math.floor(Math.random() * terrainOptions.length)];
    if (!advantages.includes(randomAdvantage)) {
      advantages.push(randomAdvantage);
    }
  }
  
  return advantages;
}

function calculateMilitaryStrength(infrastructure) {
  const militaryBase = infrastructure.find(i => i.id === 'military_base');
  const security = infrastructure.find(i => i.id === 'security');
  const industrial = infrastructure.find(i => i.id === 'industrial');
  
  let strength = 0;
  if (militaryBase) strength += militaryBase.level * 100;
  if (security) strength += security.level * 50;
  if (industrial) strength += industrial.level * 20;
  
  return Math.floor(strength);
}

function calculateResearchOutput(infrastructure, population) {
  const researchFacility = infrastructure.find(i => i.id === 'research_facility');
  const education = infrastructure.find(i => i.id === 'education');
  
  let output = population * 0.001;
  if (researchFacility) output += researchFacility.level * 50;
  if (education) output += education.level * 30;
  
  return Math.floor(output);
}

function calculateTradeValue(infrastructure, planetResources) {
  const commercial = infrastructure.find(i => i.id === 'commercial');
  const spaceport = infrastructure.find(i => i.id === 'spaceport');
  const transportation = infrastructure.find(i => i.id === 'transportation');
  
  let value = 0;
  if (commercial) value += commercial.level * 100;
  if (spaceport) value += spaceport.level * 150;
  if (transportation) value += transportation.level * 75;
  
  const resourceBonus = planetResources.length * 50;
  value += resourceBonus;
  
  return Math.floor(value);
}

function calculateDevelopmentPriorities(cityData, infrastructure) {
  const priorities = {
    economic: 0.4,
    military: 0.2,
    research: 0.2,
    infrastructure: 0.2
  };
  
  // Adjust based on strategic importance
  switch (cityData.strategicImportance) {
    case 'capital':
      priorities.economic = 0.3;
      priorities.military = 0.3;
      priorities.research = 0.2;
      priorities.infrastructure = 0.2;
      break;
    case 'military':
      priorities.military = 0.5;
      priorities.economic = 0.2;
      priorities.research = 0.1;
      priorities.infrastructure = 0.2;
      break;
    case 'research':
      priorities.research = 0.5;
      priorities.economic = 0.2;
      priorities.military = 0.1;
      priorities.infrastructure = 0.2;
      break;
    case 'industrial':
      priorities.economic = 0.5;
      priorities.military = 0.2;
      priorities.research = 0.1;
      priorities.infrastructure = 0.2;
      break;
  }
  
  return priorities;
}

function runCityAutopilot(city) {
  if (!city.autopilotEnabled || city.playerControlled) {
    return { decisions: [], message: 'Autopilot disabled or player controlled' };
  }
  
  const decisions = [];
  const settings = citiesGameState.autopilotSettings;
  
  // Simple infrastructure optimization
  const needsUpgrade = city.infrastructure.filter(infra => 
    infra.utilization > settings.infrastructureThreshold && 
    infra.level < 10 && 
    city.infrastructureBudget > (citiesGameState.infrastructureTypes.find(t => t.id === infra.id)?.upgradeCost || 0) * infra.level
  );
  
  // Upgrade one infrastructure if possible
  if (needsUpgrade.length > 0) {
    const infra = needsUpgrade[0];
    const infraType = citiesGameState.infrastructureTypes.find(t => t.id === infra.id);
    const upgradeCost = infraType.upgradeCost * infra.level;
    
    if (city.infrastructureBudget >= upgradeCost) {
      infra.level += 1;
      infra.capacity = infraType.baseCapacity * infra.level;
      infra.maintenanceCost = infraType.upgradeCost * 0.1 * infra.level;
      infra.upgradeRecommended = false;
      city.infrastructureBudget -= upgradeCost;
      
      decisions.push({
        type: 'infrastructure_upgrade',
        target: infra.name,
        newLevel: infra.level,
        cost: upgradeCost,
        reason: `High utilization (${(infra.utilization * 100).toFixed(1)}%)`
      });
    }
  }
  
  // Apply decisions and log them
  city.autopilotDecisions = [...(city.autopilotDecisions || []), ...decisions].slice(-10); // Keep last 10
  city.lastAutopilotRun = new Date();
  
  return { decisions, message: `Autopilot made ${decisions.length} optimization decisions` };
}

function simulateCity(city) {
  // Basic population growth
  const growthRate = 0.02; // 2% annual growth
  const monthlyGrowthRate = growthRate / 12;
  const populationGrowth = Math.floor(city.population * monthlyGrowthRate);
  city.population += populationGrowth;
  
  // Update economic output
  city.economicOutput = city.population * (50 + city.averageInfrastructureLevel * 10);
  city.averageIncome = city.economicOutput / city.population * 0.6;
  
  // Update government finances
  city.governmentBudget = city.economicOutput * city.taxRate;
  city.infrastructureBudget = city.governmentBudget * 0.6;
  
  // Update infrastructure utilization
  city.infrastructure.forEach(infra => {
    const populationPressure = city.population / (infra.capacity * 0.8);
    infra.utilization = Math.min(1.0, populationPressure);
    infra.upgradeRecommended = infra.utilization > 0.85;
  });
  
  // Recalculate metrics
  city.militaryStrength = calculateMilitaryStrength(city.infrastructure);
  city.researchOutput = calculateResearchOutput(city.infrastructure, city.population);
  city.tradeValue = calculateTradeValue(city.infrastructure, city.planetaryResources);
  
  city.lastUpdated = new Date();
  
  return {
    populationGrowth: populationGrowth,
    newPopulation: city.population,
    economicGrowth: city.economicOutput - (city.population - populationGrowth) * (50 + city.averageInfrastructureLevel * 10),
    message: 'City simulation completed successfully'
  };
}

// Initialize the cities state
initializeCitiesGameState();

module.exports = { 
  citiesGameState, 
  createCity,
  calculateMilitaryStrength,
  calculateResearchOutput,
  calculateTradeValue,
  calculateDevelopmentPriorities,
  runCityAutopilot,
  simulateCity
};
