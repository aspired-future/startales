// Placeholder cities state - will be extracted from comprehensive-demo-server.cjs
const citiesGameState = {
  cities: new Map(),
  starSystems: new Map(),
  planetData: new Map(),
  globalCityCounter: 1,
  infrastructureTypes: [
    { id: 'housing', name: 'Housing', category: 'residential' },
    { id: 'commercial', name: 'Commercial', category: 'economic' },
    { id: 'industrial', name: 'Industrial', category: 'economic' },
    { id: 'education', name: 'Education', category: 'social' },
    { id: 'healthcare', name: 'Healthcare', category: 'social' },
    { id: 'transport', name: 'Transport', category: 'infrastructure' },
    { id: 'utilities', name: 'Utilities', category: 'infrastructure' },
    { id: 'entertainment', name: 'Entertainment', category: 'social' },
    { id: 'military_base', name: 'Military Base', category: 'defense' },
    { id: 'spaceport', name: 'Spaceport', category: 'transport' },
    { id: 'research_facility', name: 'Research Facility', category: 'science' }
  ],
  specializationTypes: [
    { id: 'industrial_hub', name: 'Industrial Hub', focus: 'manufacturing' },
    { id: 'tech_center', name: 'Technology Center', focus: 'innovation' },
    { id: 'trade_port', name: 'Trade Port', focus: 'commerce' },
    { id: 'research_station', name: 'Research Station', focus: 'science' },
    { id: 'military_fortress', name: 'Military Fortress', focus: 'defense' },
    { id: 'agricultural_center', name: 'Agricultural Center', focus: 'food_production' },
    { id: 'mining_colony', name: 'Mining Colony', focus: 'resource_extraction' },
    { id: 'cultural_hub', name: 'Cultural Hub', focus: 'arts_entertainment' }
  ]
};

// Initialize with sample cities
function initializeCitiesGameState() {
  // Sample cities data
  const sampleCities = [
    { id: 'city_1', name: 'New Terra', population: 2500000, averageIncome: 45000, averageInfrastructureLevel: 7, qualityOfLife: 75 },
    { id: 'city_2', name: 'Alpha Station', population: 1200000, averageIncome: 52000, averageInfrastructureLevel: 8, qualityOfLife: 80 },
    { id: 'city_3', name: 'Beta Colony', population: 800000, averageIncome: 38000, averageInfrastructureLevel: 6, qualityOfLife: 65 },
    { id: 'city_4', name: 'Centauri Prime', population: 1800000, averageIncome: 48000, averageInfrastructureLevel: 7.5, qualityOfLife: 78 },
    { id: 'city_5', name: 'Vega Outpost', population: 600000, averageIncome: 35000, averageInfrastructureLevel: 5, qualityOfLife: 60 },
    { id: 'city_6', name: 'Kepler Base', population: 900000, averageIncome: 42000, averageInfrastructureLevel: 6.5, qualityOfLife: 70 }
  ];

  sampleCities.forEach(cityData => {
    const city = {
      ...cityData,
      infrastructure: citiesGameState.infrastructureTypes.map(type => ({
        id: type.id,
        name: type.name,
        level: Math.floor(Math.random() * 10) + 1,
        category: type.category
      }))
    };
    citiesGameState.cities.set(cityData.id, city);
  });

  console.log(`Cities game state initialized with ${citiesGameState.cities.size} cities`);
}

// Initialize the cities state
initializeCitiesGameState();

module.exports = { citiesGameState };

