// ===== DEMOGRAPHICS DEEP DIVE SYSTEM =====
const demographicsGameState = {
  populationData: new Map(),
  demographicTrends: new Map(),
  socialMobilityData: new Map(),
  populationProjections: new Map(),
  demographicEvents: [],
  globalDemographicsCounter: 1,
  
  // Age group categories
  ageGroups: ['0-14', '15-29', '30-44', '45-59', '60-74', '75+'],
  
  // Education levels
  educationLevels: ['no_education', 'primary', 'secondary', 'tertiary', 'advanced'],
  
  // Income brackets
  incomeBrackets: ['low', 'lower_middle', 'middle', 'upper_middle', 'high'],
  
  // Occupation categories
  occupationCategories: [
    'agriculture', 'manufacturing', 'services', 'technology', 'healthcare',
    'education', 'government', 'military', 'research', 'arts_entertainment'
  ],
  
  // Social mobility indicators
  mobilityIndicators: {
    education_mobility: { weight: 0.3, description: 'Educational advancement across generations' },
    income_mobility: { weight: 0.25, description: 'Income progression over time' },
    occupation_mobility: { weight: 0.2, description: 'Career advancement and job changes' },
    geographic_mobility: { weight: 0.15, description: 'Movement between cities/planets' },
    social_capital: { weight: 0.1, description: 'Network and social connections' }
  },
  
  // Demographic transition stages
  transitionStages: ['pre_transition', 'early_transition', 'late_transition', 'post_transition'],
  
  // Population projection models
  projectionModels: ['linear', 'exponential', 'logistic', 'cohort_component']
};

// Initialize demographics system with sample data
function initializeDemographicsSystem() {
  const { citiesGameState } = require('./cities-state.cjs');
  
  // Create demographic data for existing cities
  citiesGameState.cities.forEach((city, cityId) => {
    generateCityDemographics(cityId, city);
    generateSocialMobilityData(cityId, city);
    generatePopulationProjections(cityId, city);
  });
  
  console.log(`Demographics system initialized for ${demographicsGameState.populationData.size} cities`);
}

// Generate comprehensive demographic data for a city
function generateCityDemographics(cityId, city) {
  const totalPopulation = city.population;
  
  // Generate age distribution
  const ageDistribution = {};
  let remainingPop = totalPopulation;
  
  demographicsGameState.ageGroups.forEach((ageGroup, index) => {
    let percentage;
    switch (ageGroup) {
      case '0-14': percentage = 0.18 + Math.random() * 0.12; break; // 18-30%
      case '15-29': percentage = 0.22 + Math.random() * 0.08; break; // 22-30%
      case '30-44': percentage = 0.20 + Math.random() * 0.08; break; // 20-28%
      case '45-59': percentage = 0.16 + Math.random() * 0.08; break; // 16-24%
      case '60-74': percentage = 0.12 + Math.random() * 0.08; break; // 12-20%
      case '75+': percentage = Math.max(0.02, 1 - Object.values(ageDistribution).reduce((sum, val) => sum + val, 0)); break;
      default: percentage = 0.05;
    }
    
    if (index === demographicsGameState.ageGroups.length - 1) {
      // Last group gets remaining population
      ageDistribution[ageGroup] = Math.max(0, remainingPop);
    } else {
      const groupPop = Math.floor(totalPopulation * percentage);
      ageDistribution[ageGroup] = groupPop;
      remainingPop -= groupPop;
    }
  });
  
  // Generate education distribution
  const educationDistribution = {};
  demographicsGameState.educationLevels.forEach((level, index) => {
    let percentage;
    switch (level) {
      case 'no_education': percentage = 0.05 + Math.random() * 0.15; break;
      case 'primary': percentage = 0.15 + Math.random() * 0.15; break;
      case 'secondary': percentage = 0.30 + Math.random() * 0.15; break;
      case 'tertiary': percentage = 0.25 + Math.random() * 0.15; break;
      case 'advanced': percentage = Math.max(0.05, 1 - Object.values(educationDistribution).reduce((sum, val) => sum + val, 0)); break;
      default: percentage = 0.1;
    }
    
    if (index === demographicsGameState.educationLevels.length - 1) {
      educationDistribution[level] = Math.max(0.05, 1 - Object.values(educationDistribution).reduce((sum, val) => sum + val, 0));
    } else {
      educationDistribution[level] = percentage;
    }
  });
  
  // Generate income distribution
  const incomeDistribution = {};
  demographicsGameState.incomeBrackets.forEach((bracket, index) => {
    let percentage;
    switch (bracket) {
      case 'low': percentage = 0.15 + Math.random() * 0.15; break;
      case 'lower_middle': percentage = 0.20 + Math.random() * 0.10; break;
      case 'middle': percentage = 0.25 + Math.random() * 0.10; break;
      case 'upper_middle': percentage = 0.20 + Math.random() * 0.10; break;
      case 'high': percentage = Math.max(0.05, 1 - Object.values(incomeDistribution).reduce((sum, val) => sum + val, 0)); break;
      default: percentage = 0.1;
    }
    
    if (index === demographicsGameState.incomeBrackets.length - 1) {
      incomeDistribution[bracket] = Math.max(0.05, 1 - Object.values(incomeDistribution).reduce((sum, val) => sum + val, 0));
    } else {
      incomeDistribution[bracket] = percentage;
    }
  });
  
  // Generate occupation distribution
  const occupationDistribution = {};
  demographicsGameState.occupationCategories.forEach((category, index) => {
    let percentage;
    switch (category) {
      case 'services': percentage = 0.25 + Math.random() * 0.10; break;
      case 'technology': percentage = 0.15 + Math.random() * 0.10; break;
      case 'manufacturing': percentage = 0.12 + Math.random() * 0.08; break;
      case 'healthcare': percentage = 0.08 + Math.random() * 0.06; break;
      case 'education': percentage = 0.06 + Math.random() * 0.04; break;
      case 'government': percentage = 0.05 + Math.random() * 0.05; break;
      default: percentage = 0.03 + Math.random() * 0.05;
    }
    
    if (index === demographicsGameState.occupationCategories.length - 1) {
      occupationDistribution[category] = Math.max(0.02, 1 - Object.values(occupationDistribution).reduce((sum, val) => sum + val, 0));
    } else {
      occupationDistribution[category] = Math.min(percentage, 0.3);
    }
  });
  
  // Calculate demographic indicators
  const demographicIndicators = {
    birthRate: 12 + Math.random() * 25, // per 1000
    deathRate: 5 + Math.random() * 15, // per 1000
    fertilityRate: 1.2 + Math.random() * 2.8, // children per woman
    lifeExpectancy: 70 + Math.random() * 25, // years
    medianAge: 25 + Math.random() * 20, // years
    dependencyRatio: (ageDistribution['0-14'] + ageDistribution['75+']) / (totalPopulation - ageDistribution['0-14'] - ageDistribution['75+']),
    urbanizationRate: 0.6 + Math.random() * 0.35, // percentage urban
    literacyRate: 0.75 + Math.random() * 0.24, // percentage literate
    giniCoefficient: 0.25 + Math.random() * 0.5 // income inequality
  };
  
  // Determine demographic transition stage
  const transitionStage = determineDemographicTransitionStage(demographicIndicators);
  
  const cityDemographics = {
    cityId: cityId,
    cityName: city.name,
    totalPopulation: totalPopulation,
    ageDistribution: ageDistribution,
    educationDistribution: educationDistribution,
    incomeDistribution: incomeDistribution,
    occupationDistribution: occupationDistribution,
    demographicIndicators: demographicIndicators,
    transitionStage: transitionStage,
    diversityIndex: calculateDiversityIndex(educationDistribution, incomeDistribution),
    qualityOfLifeIndex: calculateQualityOfLifeIndex(city, demographicIndicators),
    humanDevelopmentIndex: calculateHumanDevelopmentIndex(demographicIndicators, educationDistribution, incomeDistribution),
    lastUpdated: new Date(),
    historicalData: generateHistoricalDemographics(5) // 5 years of history
  };
  
  demographicsGameState.populationData.set(cityId, cityDemographics);
  
  // Generate demographic trends
  generateDemographicTrends(cityId, cityDemographics);
}

// Determine demographic transition stage
function determineDemographicTransitionStage(indicators) {
  const { birthRate, deathRate, fertilityRate } = indicators;
  
  if (birthRate > 30 && deathRate > 15) return 'pre_transition';
  if (birthRate > 25 && deathRate < 15) return 'early_transition';
  if (birthRate < 20 && deathRate < 10) return 'late_transition';
  return 'post_transition';
}

// Calculate diversity index
function calculateDiversityIndex(educationDist, incomeDist) {
  const educationEntropy = calculateEntropy(Object.values(educationDist));
  const incomeEntropy = calculateEntropy(Object.values(incomeDist));
  return (educationEntropy + incomeEntropy) / 2;
}

// Calculate entropy for diversity measurement
function calculateEntropy(distribution) {
  const total = distribution.reduce((sum, val) => sum + val, 0);
  return -distribution.reduce((entropy, val) => {
    if (val === 0) return entropy;
    const p = val / total;
    return entropy + p * Math.log2(p);
  }, 0);
}

// Calculate quality of life index
function calculateQualityOfLifeIndex(city, indicators) {
  const economicScore = (city.averageIncome / 50000) * 25; // Max 25 points
  const healthScore = (indicators.lifeExpectancy / 100) * 25; // Max 25 points
  const educationScore = (indicators.literacyRate) * 25; // Max 25 points
  const infrastructureScore = (city.averageInfrastructureLevel / 10) * 25; // Max 25 points
  
  return Math.min(100, economicScore + healthScore + educationScore + infrastructureScore);
}

// Calculate human development index
function calculateHumanDevelopmentIndex(indicators, educationDist, incomeDist) {
  const lifeExpectancyIndex = (indicators.lifeExpectancy - 20) / (85 - 20);
  const educationIndex = educationDist.tertiary + educationDist.advanced;
  const incomeIndex = incomeDist.middle + incomeDist.upper_middle + incomeDist.high;
  
  return Math.pow(lifeExpectancyIndex * educationIndex * incomeIndex, 1/3);
}

// Generate historical demographics data
function generateHistoricalDemographics(years) {
  const history = [];
  const currentDate = new Date();
  
  for (let i = years; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear() - i, currentDate.getMonth(), currentDate.getDate());
    history.push({
      year: date.getFullYear(),
      population: Math.floor(Math.random() * 100000) + 500000,
      birthRate: 10 + Math.random() * 30,
      deathRate: 3 + Math.random() * 20,
      migrationRate: -5 + Math.random() * 10,
      unemploymentRate: Math.random() * 15,
      medianIncome: 25000 + Math.random() * 50000
    });
  }
  
  return history;
}

// Generate demographic trends
function generateDemographicTrends(cityId, demographics) {
  const trends = {
    cityId: cityId,
    populationGrowthTrend: calculatePopulationGrowthTrend(demographics.historicalData),
    agingTrend: calculateAgingTrend(demographics.ageDistribution),
    educationTrend: calculateEducationTrend(demographics.educationDistribution),
    incomeTrend: calculateIncomeTrend(demographics.incomeDistribution),
    migrationTrend: calculateMigrationTrend(cityId),
    urbanizationTrend: calculateUrbanizationTrend(demographics.demographicIndicators),
    trendProjections: generateTrendProjections(demographics),
    lastAnalyzed: new Date()
  };
  
  demographicsGameState.demographicTrends.set(cityId, trends);
}

// Calculate population growth trend
function calculatePopulationGrowthTrend(historicalData) {
  if (historicalData.length < 2) return { rate: 0, trend: 'stable' };
  
  const growthRates = [];
  for (let i = 1; i < historicalData.length; i++) {
    const rate = (historicalData[i].population - historicalData[i-1].population) / historicalData[i-1].population;
    growthRates.push(rate);
  }
  
  const avgGrowthRate = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
  const trend = avgGrowthRate > 0.02 ? 'growing' : avgGrowthRate < -0.01 ? 'declining' : 'stable';
  
  return { rate: avgGrowthRate, trend: trend, volatility: calculateVolatility(growthRates) };
}

// Calculate aging trend
function calculateAgingTrend(ageDistribution) {
  const youngPop = ageDistribution['0-14'] + ageDistribution['15-29'];
  const oldPop = ageDistribution['60-74'] + ageDistribution['75+'];
  const agingRatio = oldPop / youngPop;
  
  return {
    agingRatio: agingRatio,
    trend: agingRatio > 0.8 ? 'rapidly_aging' : agingRatio > 0.5 ? 'aging' : 'young',
    elderlyPercentage: oldPop,
    youthPercentage: youngPop
  };
}

// Calculate education trend
function calculateEducationTrend(educationDistribution) {
  const highEducation = educationDistribution.tertiary + educationDistribution.advanced;
  const lowEducation = educationDistribution.no_education + educationDistribution.primary;
  
  return {
    educationIndex: highEducation / (highEducation + lowEducation),
    trend: highEducation > 0.4 ? 'highly_educated' : highEducation > 0.2 ? 'moderately_educated' : 'low_education',
    skillGap: Math.abs(highEducation - lowEducation),
    educationMobility: Math.random() * 0.3 + 0.1 // Simulated mobility
  };
}

// Calculate income trend
function calculateIncomeTrend(incomeDistribution) {
  const highIncome = incomeDistribution.upper_middle + incomeDistribution.high;
  const lowIncome = incomeDistribution.low + incomeDistribution.lower_middle;
  
  return {
    inequalityIndex: Math.abs(highIncome - lowIncome),
    trend: highIncome > 0.4 ? 'high_income' : highIncome > 0.2 ? 'middle_income' : 'low_income',
    middleClassStrength: incomeDistribution.middle,
    incomeMobility: Math.random() * 0.4 + 0.1
  };
}

// Calculate migration trend
function calculateMigrationTrend(cityId) {
  // This would integrate with migration system
  return {
    netMigration: Math.random() * 2000 - 1000,
    trend: 'balanced',
    migrationRate: Math.random() * 0.02,
    attractivenessScore: 50 + Math.random() * 40
  };
}

// Calculate urbanization trend
function calculateUrbanizationTrend(indicators) {
  return {
    urbanizationRate: indicators.urbanizationRate,
    trend: indicators.urbanizationRate > 0.8 ? 'highly_urbanized' : 
           indicators.urbanizationRate > 0.5 ? 'urbanizing' : 'rural',
    urbanGrowthRate: Math.random() * 0.05 + 0.01
  };
}

// Generate trend projections
function generateTrendProjections(demographics) {
  const projections = {};
  const years = [5, 10, 20];
  
  years.forEach(year => {
    projections[`year_${year}`] = {
      population: Math.floor(demographics.totalPopulation * Math.pow(1.02, year)),
      medianAge: demographics.demographicIndicators.medianAge + (year * 0.3),
      lifeExpectancy: demographics.demographicIndicators.lifeExpectancy + (year * 0.2),
      educationLevel: Math.min(1.0, (demographics.educationDistribution.tertiary + demographics.educationDistribution.advanced) * (1 + year * 0.02)),
      urbanizationRate: Math.min(1.0, demographics.demographicIndicators.urbanizationRate + (year * 0.01))
    };
  });
  
  return projections;
}

// Generate social mobility data
function generateSocialMobilityData(cityId, city) {
  const mobilityData = {
    cityId: cityId,
    overallMobilityScore: calculateOverallMobilityScore(city),
    educationMobility: generateEducationMobilityData(),
    incomeMobility: generateIncomeMobilityData(),
    occupationMobility: generateOccupationMobilityData(),
    geographicMobility: generateGeographicMobilityData(cityId),
    socialCapital: generateSocialCapitalData(),
    mobilityBarriers: generateMobilityBarriers(),
    mobilityOpportunities: generateMobilityOpportunities(),
    intergenerationalMobility: generateIntergenerationalMobilityData(),
    lastUpdated: new Date()
  };
  
  demographicsGameState.socialMobilityData.set(cityId, mobilityData);
}

// Calculate overall mobility score
function calculateOverallMobilityScore(city) {
  const economicFactor = (city.averageIncome / 50000) * 25;
  const educationFactor = (city.infrastructure.find(i => i.id === 'education')?.level || 5) * 2.5;
  const infrastructureFactor = city.averageInfrastructureLevel * 2.5;
  const qualityFactor = (city.qualityOfLife / 100) * 25;
  
  return Math.min(100, economicFactor + educationFactor + infrastructureFactor + qualityFactor);
}

// Generate education mobility data
function generateEducationMobilityData() {
  return {
    educationAccessScore: 60 + Math.random() * 35,
    skillDevelopmentRate: Math.random() * 0.15 + 0.05,
    educationROI: Math.random() * 200 + 150, // % return on education investment
    educationBarriers: ['cost', 'time', 'access', 'quality'].filter(() => Math.random() < 0.4),
    educationOpportunities: ['scholarships', 'online_learning', 'vocational_training', 'research_programs'].filter(() => Math.random() < 0.6)
  };
}

// Generate income mobility data
function generateIncomeMobilityData() {
  return {
    incomeGrowthRate: Math.random() * 0.08 + 0.02,
    wageFlexibility: Math.random() * 0.6 + 0.2,
    entrepreneurshipRate: Math.random() * 0.12 + 0.03,
    incomeVolatility: Math.random() * 0.3 + 0.1,
    wealthAccumulation: Math.random() * 0.25 + 0.05
  };
}

// Generate occupation mobility data
function generateOccupationMobilityData() {
  return {
    jobChangeFrequency: Math.random() * 0.3 + 0.1,
    careerAdvancementRate: Math.random() * 0.2 + 0.05,
    skillTransferability: Math.random() * 0.8 + 0.2,
    jobMarketFlexibility: Math.random() * 0.7 + 0.3,
    occupationDiversification: Math.random() * 0.6 + 0.2
  };
}

// Generate geographic mobility data
function generateGeographicMobilityData(cityId) {
  return {
    migrationRate: Math.random() * 0.02,
    mobilityFrequency: Math.random() * 0.15 + 0.02,
    migrationDistance: Math.random() * 1000 + 100, // km average
    returnMigrationRate: Math.random() * 0.3 + 0.1,
    migrationMotivation: ['economic', 'family', 'education', 'lifestyle'].filter(() => Math.random() < 0.5)
  };
}

// Generate social capital data
function generateSocialCapitalData() {
  return {
    networkSize: Math.floor(Math.random() * 100) + 50,
    socialConnectedness: Math.random() * 0.8 + 0.2,
    communityEngagement: Math.random() * 0.7 + 0.3,
    trustLevel: Math.random() * 0.6 + 0.4,
    socialSupport: Math.random() * 0.8 + 0.2
  };
}

// Generate mobility barriers
function generateMobilityBarriers() {
  const allBarriers = [
    'lack_of_education', 'financial_constraints', 'discrimination', 'geographic_isolation',
    'language_barriers', 'lack_of_networks', 'regulatory_barriers', 'cultural_barriers',
    'health_issues', 'family_obligations'
  ];
  
  return allBarriers.filter(() => Math.random() < 0.3);
}

// Generate mobility opportunities
function generateMobilityOpportunities() {
  const allOpportunities = [
    'education_programs', 'job_training', 'entrepreneurship_support', 'mentorship',
    'networking_events', 'skill_certification', 'financial_assistance', 'technology_access',
    'career_counseling', 'internship_programs'
  ];
  
  return allOpportunities.filter(() => Math.random() < 0.4);
}

// Generate intergenerational mobility data
function generateIntergenerationalMobilityData() {
  return {
    educationMobilityMatrix: generateMobilityMatrix(demographicsGameState.educationLevels),
    incomeMobilityMatrix: generateMobilityMatrix(demographicsGameState.incomeBrackets),
    occupationMobilityMatrix: generateMobilityMatrix(demographicsGameState.occupationCategories.slice(0, 5)),
    mobilityElasticity: Math.random() * 0.6 + 0.2,
    generationalProgress: Math.random() * 0.4 + 0.1
  };
}

// Generate mobility matrix
function generateMobilityMatrix(categories) {
  const matrix = {};
  categories.forEach(fromCategory => {
    matrix[fromCategory] = {};
    categories.forEach(toCategory => {
      if (fromCategory === toCategory) {
        matrix[fromCategory][toCategory] = 0.4 + Math.random() * 0.3; // Higher probability of staying
      } else {
        matrix[fromCategory][toCategory] = Math.random() * 0.3; // Lower probability of moving
      }
    });
  });
  return matrix;
}

// Generate population projections
function generatePopulationProjections(cityId, city) {
  const projections = {
    cityId: cityId,
    basePopulation: city.population,
    projectionModels: {},
    scenarioAnalysis: generateScenarioAnalysis(city),
    cohortProjections: generateCohortProjections(city),
    lastProjected: new Date()
  };
  
  // Generate projections for different models
  demographicsGameState.projectionModels.forEach(model => {
    projections.projectionModels[model] = generateModelProjection(model, city);
  });
  
  demographicsGameState.populationProjections.set(cityId, projections);
}

// Generate scenario analysis
function generateScenarioAnalysis(city) {
  const scenarios = ['optimistic', 'baseline', 'pessimistic'];
  const analysis = {};
  
  scenarios.forEach(scenario => {
    let growthMultiplier;
    switch (scenario) {
      case 'optimistic': growthMultiplier = 1.5; break;
      case 'pessimistic': growthMultiplier = 0.7; break;
      default: growthMultiplier = 1.0;
    }
    
    analysis[scenario] = {
      populationGrowthRate: (0.02 * growthMultiplier),
      economicGrowthRate: (0.03 * growthMultiplier),
      migrationRate: (0.01 * growthMultiplier),
      projectedPopulation: {}
    };
    
    // Project population for next 20 years
    for (let year = 1; year <= 20; year++) {
      analysis[scenario].projectedPopulation[`year_${year}`] = 
        Math.floor(city.population * Math.pow(1 + analysis[scenario].populationGrowthRate, year));
    }
  });
  
  return analysis;
}

// Generate cohort projections
function generateCohortProjections(city) {
  const cohorts = {};
  
  demographicsGameState.ageGroups.forEach(ageGroup => {
    cohorts[ageGroup] = {
      currentSize: Math.floor(city.population * (0.1 + Math.random() * 0.2)),
      survivalRate: 0.85 + Math.random() * 0.14,
      migrationRate: -0.02 + Math.random() * 0.04,
      projections: {}
    };
    
    // Project cohort for next 10 years
    for (let year = 1; year <= 10; year++) {
      const survivalFactor = Math.pow(cohorts[ageGroup].survivalRate, year);
      const migrationFactor = 1 + (cohorts[ageGroup].migrationRate * year);
      cohorts[ageGroup].projections[`year_${year}`] = 
        Math.floor(cohorts[ageGroup].currentSize * survivalFactor * migrationFactor);
    }
  });
  
  return cohorts;
}

// Generate model projection
function generateModelProjection(model, city) {
  const projection = { model: model, parameters: {}, projections: {} };
  
  switch (model) {
    case 'linear':
      projection.parameters = { growthRate: 0.02 + Math.random() * 0.03 };
      break;
    case 'exponential':
      projection.parameters = { growthRate: 0.015 + Math.random() * 0.025, baseYear: new Date().getFullYear() };
      break;
    case 'logistic':
      projection.parameters = { 
        carryingCapacity: city.population * (2 + Math.random() * 3),
        growthRate: 0.05 + Math.random() * 0.05
      };
      break;
    case 'cohort_component':
      projection.parameters = {
        birthRate: 15 + Math.random() * 20,
        deathRate: 5 + Math.random() * 10,
        migrationRate: -2 + Math.random() * 4
      };
      break;
  }
  
  // Generate projections for next 25 years
  for (let year = 1; year <= 25; year++) {
    projection.projections[`year_${year}`] = calculateModelProjection(model, city.population, year, projection.parameters);
  }
  
  return projection;
}

// Calculate model projection
function calculateModelProjection(model, basePopulation, year, params) {
  switch (model) {
    case 'linear':
      return Math.floor(basePopulation + (basePopulation * params.growthRate * year));
    case 'exponential':
      return Math.floor(basePopulation * Math.pow(1 + params.growthRate, year));
    case 'logistic':
      const k = params.carryingCapacity;
      const r = params.growthRate;
      const t = year;
      return Math.floor(k / (1 + ((k - basePopulation) / basePopulation) * Math.exp(-r * t)));
    case 'cohort_component':
      const naturalIncrease = (params.birthRate - params.deathRate) / 1000;
      const netMigration = params.migrationRate / 1000;
      const totalGrowthRate = naturalIncrease + netMigration;
      return Math.floor(basePopulation * Math.pow(1 + totalGrowthRate, year));
    default:
      return basePopulation;
  }
}

// Calculate volatility
function calculateVolatility(values) {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

module.exports = {
  demographicsGameState,
  initializeDemographicsSystem,
  calculateQualityOfLifeIndex,
  calculateHumanDevelopmentIndex
};
