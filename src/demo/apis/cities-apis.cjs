const { citiesGameState, createCity, calculateMilitaryStrength, calculateResearchOutput, calculateTradeValue, calculateDevelopmentPriorities, runCityAutopilot, simulateCity } = require('../game-state/cities-state.cjs');
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const citiesKnobsData = {
  // Urban Development
  urban_planning_efficiency: 0.6,    // AI can optimize city layouts (0.0-1.0)
  infrastructure_investment: 0.5,    // AI can prioritize infrastructure (0.0-1.0)
  housing_development: 0.7,          // AI can focus on housing (0.0-1.0)
  transportation_priority: 0.5,      // AI can improve transport systems (0.0-1.0)
  
  // Economic Focus
  industrial_development: 0.6,       // AI can boost manufacturing (0.0-1.0)
  commercial_growth: 0.5,            // AI can expand commerce (0.0-1.0)
  technology_sector_focus: 0.7,      // AI can prioritize tech industry (0.0-1.0)
  tourism_investment: 0.3,           // AI can develop tourism (0.0-1.0)
  
  // Quality of Life
  environmental_protection: 0.6,     // AI can prioritize green policies (0.0-1.0)
  public_services_funding: 0.7,      // AI can fund public services (0.0-1.0)
  cultural_development: 0.4,         // AI can invest in culture (0.0-1.0)
  healthcare_infrastructure: 0.6,    // AI can improve healthcare (0.0-1.0)
  
  // Strategic Priorities
  military_base_development: 0.4,    // AI can build military facilities (0.0-1.0)
  research_facility_priority: 0.8,   // AI can prioritize research centers (0.0-1.0)
  trade_hub_development: 0.5,        // AI can develop trade infrastructure (0.0-1.0)
  
  // Governance
  automation_level: 0.5,             // AI can automate city management (0.0-1.0)
  citizen_participation: 0.6,        // AI can encourage civic engagement (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const citiesKnobSystem = new EnhancedKnobSystem(citiesKnobsData);

// Backward compatibility - expose knobs directly
const citiesKnobs = citiesKnobSystem.knobs;

// Structured Outputs - For AI consumption, HUD display, and game state
function generateCitiesStructuredOutputs() {
  const cities = Array.from(citiesGameState.cities.values());
  
  // Calculate aggregate metrics
  const totalPopulation = cities.reduce((sum, city) => sum + city.population, 0);
  const avgQualityOfLife = cities.reduce((sum, city) => sum + city.qualityOfLife, 0) / cities.length;
  const totalEconomicOutput = cities.reduce((sum, city) => sum + city.economicOutput, 0);
  const totalMilitaryStrength = cities.reduce((sum, city) => sum + city.militaryStrength, 0);
  const totalResearchOutput = cities.reduce((sum, city) => sum + city.researchOutput, 0);
  
  return {
    // High-level metrics for AI decision-making
    urban_metrics: {
      total_cities: cities.length,
      total_population: totalPopulation,
      average_quality_of_life: avgQualityOfLife,
      total_economic_output: totalEconomicOutput,
      urbanization_efficiency: calculateUrbanizationEfficiency(),
      infrastructure_quality: calculateInfrastructureQuality(),
      sustainability_index: calculateSustainabilityIndex()
    },
    
    // Development analysis for AI strategic planning
    development_analysis: {
      growth_potential: analyzeGrowthPotential(),
      specialization_distribution: analyzeSpecializationDistribution(),
      resource_allocation: analyzeResourceAllocation(),
      strategic_positioning: analyzeStrategicPositioning(),
      development_bottlenecks: identifyDevelopmentBottlenecks()
    },
    
    // Policy impact assessment for AI feedback
    policy_effectiveness: {
      infrastructure_roi: assessInfrastructureInvestment(),
      quality_of_life_impact: assessQualityOfLifePolicies(),
      economic_development_success: assessEconomicDevelopment(),
      environmental_policy_outcomes: assessEnvironmentalPolicies(),
      governance_efficiency: assessGovernanceEfficiency()
    },
    
    // City alerts and recommendations for AI attention
    ai_alerts: generateCitiesAIAlerts(),
    
    // Structured data for other systems
    cross_system_data: {
      military_capacity: { total_strength: totalMilitaryStrength, strategic_cities: cities.filter(c => c.militaryStrength > 1000).length },
      research_capacity: { total_output: totalResearchOutput, research_cities: cities.filter(c => c.researchOutput > 500).length },
      economic_capacity: { total_output: totalEconomicOutput, economic_hubs: cities.filter(c => c.economicOutput > 2000).length },
      population_distribution: analyzePopulationDistribution(),
      strategic_assets: identifyStrategicAssets()
    },
    
    timestamp: Date.now(),
    knobs_applied: { ...citiesKnobs }
  };
}

// Helper functions for cities structured outputs (streamlined)
function calculateUrbanizationEfficiency() {
  const cities = Array.from(citiesGameState.cities.values());
  const avgEfficiency = cities.reduce((sum, city) => sum + (city.qualityOfLife * city.economicOutput / city.population), 0) / cities.length;
  return Math.min(1.0, avgEfficiency / 1000); // Normalized
}

function calculateInfrastructureQuality() {
  return citiesKnobs.infrastructure_investment * citiesKnobs.transportation_priority;
}

function calculateSustainabilityIndex() {
  return citiesKnobs.environmental_protection * 0.6 + citiesKnobs.public_services_funding * 0.4;
}

function analyzeGrowthPotential() {
  const cities = Array.from(citiesGameState.cities.values());
  const growthCities = cities.filter(city => city.population < 500000 && city.qualityOfLife > 0.6).length;
  return { high_growth_cities: growthCities, growth_rate: growthCities / cities.length };
}

function analyzeSpecializationDistribution() {
  const cities = Array.from(citiesGameState.cities.values());
  const specializations = {};
  cities.forEach(city => {
    const spec = city.currentSpecialization || 'general';
    specializations[spec] = (specializations[spec] || 0) + 1;
  });
  return specializations;
}

function analyzeResourceAllocation() {
  return {
    infrastructure_focus: citiesKnobs.infrastructure_investment,
    economic_focus: (citiesKnobs.industrial_development + citiesKnobs.commercial_growth) / 2,
    quality_focus: (citiesKnobs.environmental_protection + citiesKnobs.public_services_funding) / 2
  };
}

function analyzeStrategicPositioning() {
  const cities = Array.from(citiesGameState.cities.values());
  const strategicCities = cities.filter(city => city.strategicImportance > 0.7).length;
  return { strategic_cities: strategicCities, strategic_ratio: strategicCities / cities.length };
}

function identifyDevelopmentBottlenecks() {
  const bottlenecks = [];
  if (citiesKnobs.infrastructure_investment < 0.4) bottlenecks.push('infrastructure_deficit');
  if (citiesKnobs.housing_development < 0.5) bottlenecks.push('housing_shortage');
  if (citiesKnobs.transportation_priority < 0.4) bottlenecks.push('transport_issues');
  return bottlenecks;
}

function assessInfrastructureInvestment() {
  const investment = citiesKnobs.infrastructure_investment;
  const quality = calculateInfrastructureQuality();
  return { investment_level: investment, quality_outcome: quality, roi_score: investment * quality };
}

function assessQualityOfLifePolicies() {
  const policies = (citiesKnobs.environmental_protection + citiesKnobs.public_services_funding + citiesKnobs.healthcare_infrastructure) / 3;
  const cities = Array.from(citiesGameState.cities.values());
  const avgQoL = cities.reduce((sum, city) => sum + city.qualityOfLife, 0) / cities.length;
  return { policy_strength: policies, quality_outcome: avgQoL, effectiveness: policies * avgQoL };
}

function assessEconomicDevelopment() {
  const development = (citiesKnobs.industrial_development + citiesKnobs.commercial_growth + citiesKnobs.technology_sector_focus) / 3;
  const cities = Array.from(citiesGameState.cities.values());
  const totalEconomic = cities.reduce((sum, city) => sum + city.economicOutput, 0);
  return { development_focus: development, economic_output: totalEconomic, success_score: development * (totalEconomic / 1000000) };
}

function assessEnvironmentalPolicies() {
  const environmental = citiesKnobs.environmental_protection;
  const sustainability = calculateSustainabilityIndex();
  return { policy_strength: environmental, sustainability_index: sustainability, environmental_score: environmental * sustainability };
}

function assessGovernanceEfficiency() {
  const automation = citiesKnobs.automation_level;
  const participation = citiesKnobs.citizen_participation;
  const efficiency = automation * 0.6 + participation * 0.4;
  return { automation_level: automation, citizen_engagement: participation, governance_score: efficiency };
}

function generateCitiesAIAlerts() {
  const alerts = [];
  const cities = Array.from(citiesGameState.cities.values());
  
  // Population alerts
  const overcrowdedCities = cities.filter(city => city.population > 1000000 && city.qualityOfLife < 0.5).length;
  if (overcrowdedCities > 0) alerts.push({ type: 'overcrowding', severity: 'high', message: `${overcrowdedCities} cities experiencing overcrowding` });
  
  // Infrastructure alerts
  if (citiesKnobs.infrastructure_investment < 0.3) alerts.push({ type: 'infrastructure_crisis', severity: 'high', message: 'Critical infrastructure investment needed' });
  
  // Economic alerts
  const economicStagnation = cities.filter(city => city.economicOutput < 1000).length;
  if (economicStagnation > cities.length * 0.3) alerts.push({ type: 'economic_stagnation', severity: 'medium', message: 'Multiple cities showing economic stagnation' });
  
  return alerts;
}

function analyzePopulationDistribution() {
  const cities = Array.from(citiesGameState.cities.values());
  const totalPop = cities.reduce((sum, city) => sum + city.population, 0);
  const megaCities = cities.filter(city => city.population > 1000000).length;
  return { total_population: totalPop, mega_cities: megaCities, average_city_size: totalPop / cities.length };
}

function identifyStrategicAssets() {
  const cities = Array.from(citiesGameState.cities.values());
  const militaryAssets = cities.filter(city => city.militaryStrength > 1000).length;
  const researchAssets = cities.filter(city => city.researchOutput > 500).length;
  const economicAssets = cities.filter(city => city.economicOutput > 2000).length;
  return { military_assets: militaryAssets, research_assets: researchAssets, economic_assets: economicAssets };
}

// Apply AI knobs to actual cities game state
function applyCitiesKnobsToGameState() {
  const cities = Array.from(citiesGameState.cities.values());
  
  cities.forEach(city => {
    // Apply infrastructure investment to quality of life
    const infrastructureBonus = citiesKnobs.infrastructure_investment * 0.2;
    city.qualityOfLife = Math.min(1.0, city.qualityOfLife + infrastructureBonus);
    
    // Apply economic development knobs to economic output
    const economicMultiplier = 1 + (citiesKnobs.industrial_development * 0.1) + (citiesKnobs.commercial_growth * 0.1);
    city.economicOutput = Math.floor(city.economicOutput * economicMultiplier);
    
    // Apply research facility priority to research output
    if (citiesKnobs.research_facility_priority > 0.6) {
      const researchBonus = (citiesKnobs.research_facility_priority - 0.6) * 0.5;
      city.researchOutput = Math.floor(city.researchOutput * (1 + researchBonus));
    }
    
    // Apply military base development to military strength
    if (citiesKnobs.military_base_development > 0.5) {
      const militaryBonus = (citiesKnobs.military_base_development - 0.5) * 0.3;
      city.militaryStrength = Math.floor(city.militaryStrength * (1 + militaryBonus));
    }
    
    // Apply environmental protection to quality of life
    const environmentalBonus = citiesKnobs.environmental_protection * 0.15;
    city.qualityOfLife = Math.min(1.0, city.qualityOfLife + environmentalBonus);
  });
  
  console.log('🎛️ Cities knobs applied to game state:', {
    infrastructure_investment: citiesKnobs.infrastructure_investment,
    economic_development: (citiesKnobs.industrial_development + citiesKnobs.commercial_growth) / 2,
    research_priority: citiesKnobs.research_facility_priority
  });
}

function setupCitiesAPIs(app) {
  // Get all cities with galactic overview
  app.get('/api/cities', (req, res) => {
    const cities = Array.from(citiesGameState.cities.values()).map(city => ({
      id: city.id,
      name: city.name,
      planet: city.planet,
      starSystem: city.starSystem,
      population: city.population,
      economicOutput: city.economicOutput,
      militaryStrength: city.militaryStrength,
      researchOutput: city.researchOutput,
      tradeValue: city.tradeValue,
      qualityOfLife: city.qualityOfLife,
      currentSpecialization: city.currentSpecialization,
      specializationProgress: city.specializationProgress,
      strategicImportance: city.strategicImportance,
      autopilotEnabled: city.autopilotEnabled,
      playerControlled: city.playerControlled,
      lastUpdated: city.lastUpdated
    }));
    
    // Calculate galactic totals
    const totalMilitaryStrength = cities.reduce((sum, city) => sum + city.militaryStrength, 0);
    const totalResearchOutput = cities.reduce((sum, city) => sum + city.researchOutput, 0);
    const totalTradeValue = cities.reduce((sum, city) => sum + city.tradeValue, 0);
    
    // Group by star system
    const systemSummary = {};
    cities.forEach(city => {
      if (!systemSummary[city.starSystem]) {
        systemSummary[city.starSystem] = {
          cities: 0,
          population: 0,
          economicOutput: 0,
          militaryStrength: 0,
          researchOutput: 0
        };
      }
      systemSummary[city.starSystem].cities += 1;
      systemSummary[city.starSystem].population += city.population;
      systemSummary[city.starSystem].economicOutput += city.economicOutput;
      systemSummary[city.starSystem].militaryStrength += city.militaryStrength;
      systemSummary[city.starSystem].researchOutput += city.researchOutput;
    });
    
    res.json({
      cities,
      totalCities: cities.length,
      totalPopulation: cities.reduce((sum, city) => sum + city.population, 0),
      totalEconomicOutput: cities.reduce((sum, city) => sum + city.economicOutput, 0),
      totalMilitaryStrength,
      totalResearchOutput,
      totalTradeValue,
      averageQualityOfLife: cities.reduce((sum, city) => sum + city.qualityOfLife, 0) / cities.length,
      systemSummary,
      autopilotSettings: citiesGameState.autopilotSettings
    });
  });

  // Legacy endpoint for backward compatibility
  app.get('/api/cities/list', (req, res) => {
    const cities = Array.from(citiesGameState.cities.values()).map(city => ({
      id: city.id.replace('city_', ''),
      name: city.name,
      planet: city.planet,
      population: city.population,
      specialization: city.currentSpecialization ? 
        citiesGameState.specializationTypes.find(s => s.id === city.currentSpecialization)?.name || 'None' : 'None'
    }));
    
    res.json({
      cities,
      totalCities: cities.length,
      totalPopulation: cities.reduce((sum, city) => sum + city.population, 0)
    });
  });

  // Get specific city details
  app.get('/api/cities/:cityId', (req, res) => {
    const city = citiesGameState.cities.get(req.params.cityId);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    res.json(city);
  });

  // Create new city
  app.post('/api/cities', (req, res) => {
    try {
      const cityData = {
        name: req.body.name,
        planet: req.body.planet || 'Unknown Planet',
        coordinates: req.body.coordinates || { x: Math.random() * 300, y: Math.random() * 300 },
        climate: req.body.climate || 'temperate',
        terrain: req.body.terrain || 'plains',
        population: req.body.initialPopulation || 50000,
        founded: new Date(),
        currentSpecialization: null,
        specializationProgress: 0
      };
      
      const city = createCity(cityData);
      citiesGameState.cities.set(city.id, city);
      
      res.status(201).json(city);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create city', details: error.message });
    }
  });

  // Simulate city development
  app.post('/api/cities/:cityId/simulate', (req, res) => {
    const city = citiesGameState.cities.get(req.params.cityId);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    try {
      const simulationResults = simulateCity(city);
      res.json({
        success: true,
        city: city,
        simulationResults: simulationResults,
        message: 'City simulation completed successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Simulation failed', details: error.message });
    }
  });

  // Get available specializations for a city
  app.get('/api/cities/:cityId/specializations/available', (req, res) => {
    const city = citiesGameState.cities.get(req.params.cityId);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    const availableSpecializations = citiesGameState.specializationTypes.filter(spec => {
      // Check population requirement
      if (city.population < spec.requiredPopulation) return false;
      
      // Check infrastructure requirements
      const requirementsMet = Object.entries(spec.requirements).every(([infraType, requiredLevel]) => {
        const infra = city.infrastructure.find(i => i.id === infraType);
        return infra && infra.level >= requiredLevel;
      });
      
      return requirementsMet;
    });
    
    res.json({ availableSpecializations });
  });

  // Get all specialization types
  app.get('/api/cities/specializations/all', (req, res) => {
    res.json({ specializations: citiesGameState.specializationTypes });
  });

  // Develop city specialization
  app.post('/api/cities/:cityId/specializations/:specializationId', (req, res) => {
    const city = citiesGameState.cities.get(req.params.cityId);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    const specialization = citiesGameState.specializationTypes.find(s => s.id === req.params.specializationId);
    if (!specialization) {
      return res.status(404).json({ error: 'Specialization not found' });
    }
    
    // Check if city can develop this specialization
    if (city.population < specialization.requiredPopulation) {
      return res.status(400).json({ error: 'Insufficient population for this specialization' });
    }
    
    const requirementsMet = Object.entries(specialization.requirements).every(([infraType, requiredLevel]) => {
      const infra = city.infrastructure.find(i => i.id === infraType);
      return infra && infra.level >= requiredLevel;
    });
    
    if (!requirementsMet) {
      return res.status(400).json({ error: 'Infrastructure requirements not met' });
    }
    
    // Start specialization development
    city.currentSpecialization = specialization.id;
    city.specializationProgress = 5; // Start with 5% progress
    city.lastUpdated = new Date();
    
    res.json({
      success: true,
      message: `Started developing ${specialization.name} specialization`,
      city: city
    });
  });

  // Get city infrastructure
  app.get('/api/cities/:cityId/infrastructure', (req, res) => {
    const city = citiesGameState.cities.get(req.params.cityId);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    const totalMaintenanceCost = city.infrastructure.reduce((sum, infra) => sum + infra.maintenanceCost, 0);
    
    res.json({
      infrastructure: city.infrastructure,
      totalInfrastructure: city.totalInfrastructure,
      averageLevel: city.averageInfrastructureLevel,
      totalMaintenanceCost: totalMaintenanceCost,
      infrastructureBudget: city.infrastructureBudget
    });
  });

  // Upgrade city infrastructure
  app.post('/api/cities/:cityId/infrastructure/:infrastructureId', (req, res) => {
    const city = citiesGameState.cities.get(req.params.cityId);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    const infrastructure = city.infrastructure.find(i => i.id === req.params.infrastructureId);
    if (!infrastructure) {
      return res.status(404).json({ error: 'Infrastructure type not found' });
    }
    
    if (infrastructure.level >= 10) {
      return res.status(400).json({ error: 'Infrastructure already at maximum level' });
    }
    
    const infraType = citiesGameState.infrastructureTypes.find(t => t.id === req.params.infrastructureId);
    const upgradeCost = infraType.upgradeCost * infrastructure.level;
    
    if (city.infrastructureBudget < upgradeCost) {
      return res.status(400).json({ error: 'Insufficient budget for upgrade' });
    }
    
    // Perform upgrade
    infrastructure.level += 1;
    infrastructure.capacity = infraType.baseCapacity * infrastructure.level;
    infrastructure.maintenanceCost = infraType.upgradeCost * 0.1 * infrastructure.level;
    infrastructure.upgradeRecommended = false;
    
    city.infrastructureBudget -= upgradeCost;
    
    // Recalculate city metrics
    city.totalInfrastructure = city.infrastructure.reduce((sum, infra) => sum + infra.level, 0);
    city.averageInfrastructureLevel = city.totalInfrastructure / city.infrastructure.length;
    city.lastUpdated = new Date();
    
    res.json({
      success: true,
      message: `${infrastructure.name} upgraded to level ${infrastructure.level}`,
      infrastructure: infrastructure,
      remainingBudget: city.infrastructureBudget
    });
  });

  // Get city analytics
  app.get('/api/cities/:cityId/analytics', (req, res) => {
    const city = citiesGameState.cities.get(req.params.cityId);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    // Calculate economic health metrics
    const gdpPerCapita = city.economicOutput / city.population;
    const economicGrowthRate = ((city.economicOutput / (city.population * 45)) - 1) * 100; // Compared to base of 45
    const industrialDiversification = city.geographicAdvantages.length * 15 + (city.currentSpecialization ? 25 : 0);
    
    const competitiveAdvantages = [...city.geographicAdvantages];
    if (city.currentSpecialization) {
      const spec = citiesGameState.specializationTypes.find(s => s.id === city.currentSpecialization);
      if (spec) competitiveAdvantages.push(...spec.primaryIndustries);
    }
    
    // Calculate infrastructure health
    const overallInfraLevel = (city.averageInfrastructureLevel / 10) * 100;
    const maintenanceBacklog = city.infrastructure
      .filter(i => i.upgradeRecommended)
      .reduce((sum, i) => sum + (citiesGameState.infrastructureTypes.find(t => t.id === i.id)?.upgradeCost || 0), 0);
    const capacityUtilization = city.infrastructure.reduce((sum, i) => sum + i.utilization, 0) / city.infrastructure.length * 100;
    
    // Calculate social health metrics
    const socialMobility = Math.max(0, 100 - (city.population / 50000)); // Decreases with city size
    const culturalVitality = city.geographicAdvantages.includes('tourism_potential') ? 85 : 65;
    const communityEngagement = Math.min(100, city.qualityOfLife + Math.random() * 20 - 10);
    
    // 5-year projections
    const projectedPopulationGrowth = 1 + (city.qualityOfLife / 100 * 0.3);
    const projectedPopulation = Math.floor(city.population * Math.pow(projectedPopulationGrowth, 5));
    const projectedGDP = Math.floor(city.economicOutput * Math.pow(1.05, 5)); // 5% annual growth
    const projectedQualityOfLife = Math.min(100, city.qualityOfLife + 10);
    
    const keyOpportunities = [];
    if (city.averageInfrastructureLevel < 7) keyOpportunities.push('Infrastructure Development');
    if (!city.currentSpecialization) keyOpportunities.push('Economic Specialization');
    if (city.population > 1000000) keyOpportunities.push('Metropolitan Expansion');
    if (city.geographicAdvantages.length > 2) keyOpportunities.push('Geographic Advantage Utilization');
    
    const analytics = {
      economicHealth: {
        gdpPerCapita: gdpPerCapita,
        economicGrowthRate: economicGrowthRate,
        industrialDiversification: industrialDiversification,
        competitiveAdvantages: competitiveAdvantages.slice(0, 5) // Limit to 5
      },
      infrastructureHealth: {
        overallLevel: overallInfraLevel,
        maintenanceBacklog: maintenanceBacklog,
        capacityUtilization: capacityUtilization
      },
      socialHealth: {
        qualityOfLife: city.qualityOfLife,
        socialMobility: socialMobility,
        culturalVitality: culturalVitality,
        communityEngagement: communityEngagement
      },
      fiveYearProjection: {
        projectedPopulation: projectedPopulation,
        projectedGDP: projectedGDP,
        projectedQualityOfLife: projectedQualityOfLife,
        keyOpportunities: keyOpportunities
      }
    };
    
    res.json(analytics);
  });

  // Compare two cities
  app.get('/api/cities/:cityAId/compare/:cityBId', (req, res) => {
    const cityA = citiesGameState.cities.get(req.params.cityAId);
    const cityB = citiesGameState.cities.get(req.params.cityBId);
    
    if (!cityA || !cityB) {
      return res.status(404).json({ error: 'One or both cities not found' });
    }
    
    const metrics = [
      { metric: 'Population', cityAValue: cityA.population, cityBValue: cityB.population },
      { metric: 'Economic Output', cityAValue: cityA.economicOutput, cityBValue: cityB.economicOutput },
      { metric: 'Quality of Life', cityAValue: cityA.qualityOfLife, cityBValue: cityB.qualityOfLife },
      { metric: 'Infrastructure Level', cityAValue: cityA.averageInfrastructureLevel, cityBValue: cityB.averageInfrastructureLevel },
      { metric: 'Attractiveness', cityAValue: cityA.attractiveness, cityBValue: cityB.attractiveness },
      { metric: 'Sustainability', cityAValue: cityA.sustainability, cityBValue: cityB.sustainability }
    ];
    
    const comparison = metrics.map(m => ({
      ...m,
      winner: m.cityAValue > m.cityBValue ? cityA.name : 
              m.cityBValue > m.cityAValue ? cityB.name : 'Tie'
    }));
    
    const cityAWins = comparison.filter(c => c.winner === cityA.name).length;
    const cityBWins = comparison.filter(c => c.winner === cityB.name).length;
    const overallWinner = cityAWins > cityBWins ? cityA.name : 
                         cityBWins > cityAWins ? cityB.name : 'Tie';
    
    res.json({
      cityA: { id: cityA.id, name: cityA.name },
      cityB: { id: cityB.id, name: cityB.name },
      comparison: comparison,
      winner: overallWinner,
      score: { [cityA.name]: cityAWins, [cityB.name]: cityBWins }
    });
  });

  // ===== AUTOPILOT CONTROL ENDPOINTS =====

  // Get autopilot settings
  app.get('/api/cities/autopilot/settings', (req, res) => {
    res.json(citiesGameState.autopilotSettings);
  });

  // Update autopilot settings
  app.put('/api/cities/autopilot/settings', (req, res) => {
    const { enabled, aggressiveness, priorityFocus, infrastructureThreshold } = req.body;
    
    if (enabled !== undefined) citiesGameState.autopilotSettings.enabled = enabled;
    if (aggressiveness) citiesGameState.autopilotSettings.aggressiveness = aggressiveness;
    if (priorityFocus) citiesGameState.autopilotSettings.priorityFocus = priorityFocus;
    if (infrastructureThreshold !== undefined) citiesGameState.autopilotSettings.infrastructureThreshold = infrastructureThreshold;
    
    res.json({
      success: true,
      message: 'Autopilot settings updated',
      settings: citiesGameState.autopilotSettings
    });
  });

  // Toggle autopilot for specific city
  app.post('/api/cities/:cityId/autopilot/toggle', (req, res) => {
    const city = citiesGameState.cities.get(req.params.cityId);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    city.autopilotEnabled = !city.autopilotEnabled;
    city.lastUpdated = new Date();
    
    res.json({
      success: true,
      cityId: city.id,
      cityName: city.name,
      autopilotEnabled: city.autopilotEnabled,
      message: `Autopilot ${city.autopilotEnabled ? 'enabled' : 'disabled'} for ${city.name}`
    });
  });

  // Toggle player control for specific city
  app.post('/api/cities/:cityId/player-control/toggle', (req, res) => {
    const city = citiesGameState.cities.get(req.params.cityId);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    city.playerControlled = !city.playerControlled;
    city.lastUpdated = new Date();
    
    res.json({
      success: true,
      cityId: city.id,
      cityName: city.name,
      playerControlled: city.playerControlled,
      message: `${city.name} is now ${city.playerControlled ? 'player controlled' : 'AI managed'}`
    });
  });

  // Run autopilot manually for specific city
  app.post('/api/cities/:cityId/autopilot/run', (req, res) => {
    const city = citiesGameState.cities.get(req.params.cityId);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    if (!city.autopilotEnabled) {
      return res.status(400).json({ error: 'Autopilot is disabled for this city' });
    }
    
    const results = runCityAutopilot(city);
    
    res.json({
      success: true,
      cityId: city.id,
      cityName: city.name,
      autopilotResults: results,
      city: city
    });
  });

  // Run autopilot for all cities
  app.post('/api/cities/autopilot/run-all', (req, res) => {
    const results = [];
    let totalDecisions = 0;
    
    citiesGameState.cities.forEach(city => {
      if (city.autopilotEnabled && !city.playerControlled) {
        const autopilotResults = runCityAutopilot(city);
        results.push({
          cityId: city.id,
          cityName: city.name,
          decisions: autopilotResults.decisions.length,
          message: autopilotResults.message
        });
        totalDecisions += autopilotResults.decisions.length;
      }
    });
    
    res.json({
      success: true,
      message: `Autopilot completed for ${results.length} cities`,
      totalDecisions: totalDecisions,
      cityResults: results
    });
  });

  // Get autopilot decisions history for a city
  app.get('/api/cities/:cityId/autopilot/history', (req, res) => {
    const city = citiesGameState.cities.get(req.params.cityId);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    res.json({
      cityId: city.id,
      cityName: city.name,
      autopilotEnabled: city.autopilotEnabled,
      lastAutopilotRun: city.lastAutopilotRun,
      recentDecisions: city.autopilotDecisions || [],
      developmentPriorities: city.developmentPriorities
    });
  });

  // Set city specialization (strategic level control)
  app.post('/api/cities/:cityId/set-specialization/:specializationId', (req, res) => {
    const city = citiesGameState.cities.get(req.params.cityId);
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    const specialization = citiesGameState.specializationTypes.find(s => s.id === req.params.specializationId);
    if (!specialization) {
      return res.status(404).json({ error: 'Specialization not found' });
    }
    
    // Player can override requirements for strategic control
    city.currentSpecialization = specialization.id;
    city.specializationProgress = Math.max(city.specializationProgress, 10); // Boost progress
    city.developmentPriorities = calculateDevelopmentPriorities(city, city.infrastructure);
    city.lastUpdated = new Date();
    
    res.json({
      success: true,
      message: `${city.name} specialization set to ${specialization.name}`,
      city: {
        id: city.id,
        name: city.name,
        currentSpecialization: city.currentSpecialization,
        specializationProgress: city.specializationProgress,
        developmentPriorities: city.developmentPriorities
      }
    });
  });

  // Get galactic overview
  app.get('/api/cities/galactic-overview', (req, res) => {
    const cities = Array.from(citiesGameState.cities.values());
    const starSystems = Array.from(citiesGameState.starSystems.values());
    
    // Calculate empire-wide statistics
    const empireStats = {
      totalCities: cities.length,
      totalPopulation: cities.reduce((sum, city) => sum + city.population, 0),
      totalEconomicOutput: cities.reduce((sum, city) => sum + city.economicOutput, 0),
      totalMilitaryStrength: cities.reduce((sum, city) => sum + city.militaryStrength, 0),
      totalResearchOutput: cities.reduce((sum, city) => sum + city.researchOutput, 0),
      totalTradeValue: cities.reduce((sum, city) => sum + city.tradeValue, 0),
      averageQualityOfLife: cities.reduce((sum, city) => sum + city.qualityOfLife, 0) / cities.length,
      autopilotCities: cities.filter(city => city.autopilotEnabled).length,
      playerControlledCities: cities.filter(city => city.playerControlled).length
    };
    
    // Strategic importance breakdown
    const strategicBreakdown = {};
    cities.forEach(city => {
      if (!strategicBreakdown[city.strategicImportance]) {
        strategicBreakdown[city.strategicImportance] = 0;
      }
      strategicBreakdown[city.strategicImportance]++;
    });
    
    // Specialization breakdown
    const specializationBreakdown = {};
    cities.forEach(city => {
      const spec = city.currentSpecialization || 'none';
      if (!specializationBreakdown[spec]) {
        specializationBreakdown[spec] = 0;
      }
      specializationBreakdown[spec]++;
    });
    
    res.json({
      empireStats,
      strategicBreakdown,
      specializationBreakdown,
      starSystems: starSystems.map(system => ({
        ...system,
        cities: cities.filter(city => city.starSystem === system.id).length
      })),
      autopilotSettings: citiesGameState.autopilotSettings
    });
  });

  // ===== AI INTEGRATION ENDPOINTS =====
  
  // Enhanced AI knob endpoints with multi-format input support
  app.get('/api/cities/knobs', (req, res) => {
    const knobData = citiesKnobSystem.getKnobsWithMetadata();
    res.json({
      ...knobData,
      system: 'cities',
      description: 'AI-adjustable parameters for cities system with enhanced input support',
      input_help: citiesKnobSystem.getKnobDescriptions()
    });
  });

  app.post('/api/cities/knobs', (req, res) => {
    const { knobs, source = 'ai' } = req.body;
    
    if (!knobs || typeof knobs !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid knobs data. Expected object with knob values.',
        help: citiesKnobSystem.getKnobDescriptions().examples
      });
    }
    
    // Update knobs using enhanced system
    const updateResult = citiesKnobSystem.updateKnobs(knobs, source);
    
    // Apply knobs to game state
    try {
      applyCitiesKnobsToGameState();
    } catch (error) {
      console.error('Error applying cities knobs to game state:', error);
    }
    
    res.json({
      success: updateResult.success,
      system: 'cities',
      ...updateResult,
      message: 'Cities knobs updated successfully using enhanced input processing'
    });
  });

  // Get knob help/documentation
  app.get('/api/cities/knobs/help', (req, res) => {
    res.json({
      system: 'cities',
      help: citiesKnobSystem.getKnobDescriptions(),
      current_values: citiesKnobSystem.getKnobsWithMetadata()
    });
  });

  // Get structured outputs for AI consumption
  app.get('/api/cities/ai-data', (req, res) => {
    const structuredData = generateCitiesStructuredOutputs();
    res.json({
      ...structuredData,
      description: 'Structured cities data for AI analysis and decision-making'
    });
  });

  // Get cross-system integration data
  app.get('/api/cities/cross-system', (req, res) => {
    const outputs = generateCitiesStructuredOutputs();
    res.json({
      military_data: outputs.cross_system_data.military_capacity,
      research_data: outputs.cross_system_data.research_capacity,
      economic_data: outputs.cross_system_data.economic_capacity,
      population_data: outputs.cross_system_data.population_distribution,
      strategic_data: outputs.cross_system_data.strategic_assets,
      urban_summary: outputs.urban_metrics,
      timestamp: outputs.timestamp
    });
  });
}

module.exports = { setupCitiesAPIs };
