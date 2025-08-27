const { demographicsGameState, initializeDemographicsSystem } = require('../game-state/demographics-state.cjs');
const { citiesGameState } = require('../game-state/cities-state.cjs');
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const demographicsKnobsData = {
  // Population Growth Controls
  birth_rate_modifier: 0.5,        // AI can adjust birth rates (0.0-1.0, 0.5=normal)
  death_rate_modifier: 0.5,        // AI can adjust death rates (0.0-1.0, 0.5=normal) 
  migration_attractiveness: 0.5,   // AI can make cities more/less attractive (0.0-1.0)
  
  // Education & Development
  education_investment: 0.7,       // AI can prioritize education (0.0-1.0)
  healthcare_investment: 0.6,      // AI can prioritize healthcare (0.0-1.0)
  social_mobility_support: 0.5,    // AI can support social mobility (0.0-1.0)
  
  // Economic Factors
  income_inequality_policy: 0.5,   // AI can address inequality (0.0=ignore, 1.0=aggressive)
  employment_programs: 0.4,        // AI can fund job programs (0.0-1.0)
  urban_development: 0.6,          // AI can prioritize urban vs rural (0.0=rural, 1.0=urban)
  
  // Quality of Life
  environmental_quality: 0.7,      // AI can prioritize environment (0.0-1.0)
  cultural_investment: 0.5,        // AI can invest in culture (0.0-1.0)
  infrastructure_quality: 0.6,     // AI can improve infrastructure (0.0-1.0)
  
  // Crisis Response
  pandemic_response: 0.5,          // AI can adjust pandemic measures (0.0-1.0)
  disaster_preparedness: 0.4,      // AI can prepare for disasters (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const demographicsKnobSystem = new EnhancedKnobSystem(demographicsKnobsData);

// Backward compatibility - expose knobs directly
const demographicsKnobs = demographicsKnobSystem.knobs;

// Structured Outputs - For AI consumption, HUD display, and game state
function generateStructuredOutputs() {
  const totalPopulation = Array.from(demographicsGameState.populationData.values())
    .reduce((sum, city) => sum + city.totalPopulation, 0);
  
  const avgQualityOfLife = Array.from(demographicsGameState.populationData.values())
    .reduce((sum, city) => sum + city.qualityOfLifeIndex, 0) / demographicsGameState.populationData.size;
  
  return {
    // High-level metrics for AI decision-making
    population_metrics: {
      total_population: totalPopulation,
      growth_rate: calculateAverageGrowthRate(),
      quality_of_life_index: avgQualityOfLife,
      social_mobility_score: calculateAverageMobility(),
      education_level: calculateAverageEducation(),
      health_index: calculateAverageHealth(),
      urbanization_rate: calculateUrbanizationRate()
    },
    
    // Trend analysis for AI strategic planning
    demographic_trends: {
      aging_trend: analyzeAgingTrend(),
      migration_patterns: analyzeMigrationPatterns(),
      education_progression: analyzeEducationTrends(),
      economic_mobility: analyzeEconomicMobility(),
      crisis_resilience: analyzeCrisisResilience()
    },
    
    // Policy impact assessment for AI feedback
    policy_effectiveness: {
      birth_rate_impact: assessBirthRatePolicy(),
      education_roi: assessEducationInvestment(),
      healthcare_outcomes: assessHealthcareInvestment(),
      inequality_reduction: assessInequalityPolicy(),
      urban_development_success: assessUrbanDevelopment()
    },
    
    // Alerts and recommendations for AI attention
    ai_alerts: generateAIAlerts(),
    
    // Structured data for other systems
    cross_system_data: {
      workforce_availability: calculateWorkforceMetrics(),
      consumer_market_size: calculateConsumerMetrics(),
      tax_base_strength: calculateTaxBaseMetrics(),
      military_recruitment_pool: calculateMilitaryPool(),
      research_capacity: calculateResearchCapacity()
    },
    
    timestamp: Date.now(),
    knobs_applied: { ...demographicsKnobs }
  };
}

// Helper functions for structured outputs
function calculateAverageGrowthRate() {
  const trends = Array.from(demographicsGameState.demographicTrends.values());
  return trends.reduce((sum, trend) => sum + (trend.populationGrowthTrend?.rate || 0), 0) / trends.length;
}

function calculateAverageMobility() {
  const mobility = Array.from(demographicsGameState.socialMobilityData.values());
  return mobility.reduce((sum, data) => sum + (data.overallMobilityScore || 0), 0) / mobility.length;
}

function calculateAverageEducation() {
  const populations = Array.from(demographicsGameState.populationData.values());
  return populations.reduce((sum, pop) => {
    const tertiary = pop.educationDistribution?.tertiary || 0;
    const advanced = pop.educationDistribution?.advanced || 0;
    return sum + tertiary + advanced;
  }, 0) / populations.length;
}

function calculateAverageHealth() {
  const populations = Array.from(demographicsGameState.populationData.values());
  return populations.reduce((sum, pop) => sum + (pop.demographicIndicators?.lifeExpectancy || 70) / 100, 0) / populations.length;
}

function calculateUrbanizationRate() {
  // Simplified: assume cities with >100k are urban
  const populations = Array.from(demographicsGameState.populationData.values());
  const urbanPop = populations.filter(pop => pop.totalPopulation > 100000).reduce((sum, pop) => sum + pop.totalPopulation, 0);
  const totalPop = populations.reduce((sum, pop) => sum + pop.totalPopulation, 0);
  return urbanPop / totalPop;
}

function analyzeAgingTrend() {
  const populations = Array.from(demographicsGameState.populationData.values());
  const avgElderlyRatio = populations.reduce((sum, pop) => sum + (pop.ageDistribution?.['75+'] || 0), 0) / populations.length;
  return { elderly_ratio: avgElderlyRatio, trend: avgElderlyRatio > 0.15 ? 'aging' : 'stable' };
}

function analyzeMigrationPatterns() {
  const trends = Array.from(demographicsGameState.demographicTrends.values());
  const avgMigration = trends.reduce((sum, trend) => sum + (trend.migrationTrend?.netMigration || 0), 0) / trends.length;
  return { net_migration_rate: avgMigration, pattern: avgMigration > 0 ? 'immigration' : 'emigration' };
}

function analyzeEducationTrends() {
  const trends = Array.from(demographicsGameState.demographicTrends.values());
  const avgEducationGrowth = trends.reduce((sum, trend) => sum + (trend.educationTrend?.improvementRate || 0), 0) / trends.length;
  return { improvement_rate: avgEducationGrowth, trend: avgEducationGrowth > 0.02 ? 'improving' : 'stable' };
}

function analyzeEconomicMobility() {
  const mobility = Array.from(demographicsGameState.socialMobilityData.values());
  const avgIncomeMobility = mobility.reduce((sum, data) => sum + (data.incomeMobility?.mobilityIndex || 0), 0) / mobility.length;
  return { income_mobility_index: avgIncomeMobility, assessment: avgIncomeMobility > 0.6 ? 'high' : 'moderate' };
}

function analyzeCrisisResilience() {
  // Apply knobs to assess crisis resilience
  const healthcareStrength = demographicsKnobs.healthcare_investment;
  const disasterPrep = demographicsKnobs.disaster_preparedness;
  const pandemicResponse = demographicsKnobs.pandemic_response;
  
  const resilience = (healthcareStrength + disasterPrep + pandemicResponse) / 3;
  return { resilience_score: resilience, level: resilience > 0.7 ? 'high' : resilience > 0.4 ? 'moderate' : 'low' };
}

function assessBirthRatePolicy() {
  const modifier = demographicsKnobs.birth_rate_modifier;
  const impact = Math.abs(modifier - 1.0);
  return { modifier_applied: modifier, policy_impact: impact, effectiveness: impact > 0.2 ? 'significant' : 'minimal' };
}

function assessEducationInvestment() {
  const investment = demographicsKnobs.education_investment;
  const avgEducation = calculateAverageEducation();
  const roi = avgEducation * investment;
  return { investment_level: investment, education_outcome: avgEducation, roi_score: roi };
}

function assessHealthcareInvestment() {
  const investment = demographicsKnobs.healthcare_investment;
  const healthIndex = calculateAverageHealth();
  const outcome = healthIndex * investment;
  return { investment_level: investment, health_outcome: healthIndex, effectiveness_score: outcome };
}

function assessInequalityPolicy() {
  const policy = demographicsKnobs.income_inequality_policy;
  const populations = Array.from(demographicsGameState.populationData.values());
  const avgGini = populations.reduce((sum, pop) => sum + (pop.demographicIndicators?.giniCoefficient || 0.4), 0) / populations.length;
  const reduction = policy * 0.1; // Policy can reduce inequality by up to 10%
  return { policy_strength: policy, current_inequality: avgGini, projected_reduction: reduction };
}

function assessUrbanDevelopment() {
  const development = demographicsKnobs.urban_development;
  const urbanRate = calculateUrbanizationRate();
  const success = development * urbanRate;
  return { development_focus: development, urbanization_rate: urbanRate, success_score: success };
}

function generateAIAlerts() {
  const alerts = [];
  
  // Population growth alerts
  const growthRate = calculateAverageGrowthRate();
  if (growthRate < -0.01) alerts.push({ type: 'population_decline', severity: 'high', message: 'Population declining rapidly' });
  if (growthRate > 0.05) alerts.push({ type: 'population_boom', severity: 'medium', message: 'Rapid population growth may strain resources' });
  
  // Aging population alert
  const agingTrend = analyzeAgingTrend();
  if (agingTrend.elderly_ratio > 0.2) alerts.push({ type: 'aging_population', severity: 'medium', message: 'Aging population requires healthcare focus' });
  
  // Education alert
  const educationLevel = calculateAverageEducation();
  if (educationLevel < 0.3) alerts.push({ type: 'education_crisis', severity: 'high', message: 'Low education levels threaten economic growth' });
  
  // Quality of life alert
  const populations = Array.from(demographicsGameState.populationData.values());
  const avgQoL = populations.reduce((sum, pop) => sum + pop.qualityOfLifeIndex, 0) / populations.length;
  if (avgQoL < 0.4) alerts.push({ type: 'quality_of_life', severity: 'high', message: 'Poor quality of life may cause unrest' });
  
  return alerts;
}

function calculateWorkforceMetrics() {
  const populations = Array.from(demographicsGameState.populationData.values());
  const workingAge = populations.reduce((sum, pop) => {
    const age30_44 = pop.ageDistribution?.['30-44'] || 0;
    const age45_59 = pop.ageDistribution?.['45-59'] || 0;
    return sum + age30_44 + age45_59;
  }, 0);
  
  const skillLevel = calculateAverageEducation();
  return { working_age_population: workingAge, skill_level: skillLevel, workforce_quality: workingAge * skillLevel };
}

function calculateConsumerMetrics() {
  const populations = Array.from(demographicsGameState.populationData.values());
  const totalPop = populations.reduce((sum, pop) => sum + pop.totalPopulation, 0);
  const avgIncome = populations.reduce((sum, pop) => {
    const middle = pop.incomeDistribution?.middle || 0;
    const upperMiddle = pop.incomeDistribution?.upper_middle || 0;
    const high = pop.incomeDistribution?.high || 0;
    return sum + middle + upperMiddle + high;
  }, 0) / populations.length;
  
  return { total_consumers: totalPop, purchasing_power: avgIncome, market_size: totalPop * avgIncome };
}

function calculateTaxBaseMetrics() {
  const workforce = calculateWorkforceMetrics();
  const consumers = calculateConsumerMetrics();
  const taxBase = workforce.workforce_quality * consumers.purchasing_power;
  return { tax_base_strength: taxBase, revenue_potential: taxBase * 0.3 }; // Assume 30% effective tax rate
}

function calculateMilitaryPool() {
  const populations = Array.from(demographicsGameState.populationData.values());
  const militaryAge = populations.reduce((sum, pop) => {
    const age15_29 = pop.ageDistribution?.['15-29'] || 0;
    const age30_44 = pop.ageDistribution?.['30-44'] || 0;
    return sum + age15_29 + age30_44;
  }, 0);
  
  const healthIndex = calculateAverageHealth();
  return { eligible_population: militaryAge, fitness_level: healthIndex, recruitment_potential: militaryAge * healthIndex };
}

function calculateResearchCapacity() {
  const populations = Array.from(demographicsGameState.populationData.values());
  const researchers = populations.reduce((sum, pop) => {
    const advanced = pop.educationDistribution?.advanced || 0;
    const tertiary = pop.educationDistribution?.tertiary || 0;
    return sum + advanced + (tertiary * 0.3); // 30% of tertiary educated can do research
  }, 0);
  
  return { research_workforce: researchers, innovation_potential: researchers * demographicsKnobs.education_investment };
}

// Apply AI knobs to actual game state - this is where knobs affect the simulation
function applyKnobsToGameState() {
  const populations = Array.from(demographicsGameState.populationData.values());
  const trends = Array.from(demographicsGameState.demographicTrends.values());
  
  populations.forEach((population, index) => {
    const cityId = Array.from(demographicsGameState.populationData.keys())[index];
    
    // Apply birth rate modifier (convert 0.0-1.0 to 0.5-2.0 range)
    if (population.demographicIndicators) {
      const birthRateMultiplier = 0.5 + (demographicsKnobs.birth_rate_modifier * 1.5); // 0.5-2.0
      population.demographicIndicators.birthRate = Math.max(0.005, 
        population.demographicIndicators.birthRate * birthRateMultiplier);
      
      // Apply death rate modifier (convert 0.0-1.0 to 0.5-2.0 range)
      const deathRateMultiplier = 0.5 + (demographicsKnobs.death_rate_modifier * 1.5); // 0.5-2.0
      population.demographicIndicators.deathRate = Math.max(0.003, 
        population.demographicIndicators.deathRate * deathRateMultiplier);
      
      // Apply healthcare investment to life expectancy
      const healthcareBonus = demographicsKnobs.healthcare_investment * 5; // Up to 5 years bonus
      population.demographicIndicators.lifeExpectancy = Math.min(95, 
        population.demographicIndicators.lifeExpectancy + healthcareBonus);
    }
    
    // Apply education investment to education distribution
    if (population.educationDistribution && demographicsKnobs.education_investment > 0.5) {
      const educationBonus = (demographicsKnobs.education_investment - 0.5) * 0.2; // Up to 10% bonus
      
      // Shift population toward higher education
      const tertiary = population.educationDistribution.tertiary || 0;
      const advanced = population.educationDistribution.advanced || 0;
      
      population.educationDistribution.tertiary = Math.min(0.6, tertiary + educationBonus);
      population.educationDistribution.advanced = Math.min(0.3, advanced + educationBonus * 0.5);
      
      // Reduce lower education proportionally
      const totalIncrease = educationBonus + (educationBonus * 0.5);
      population.educationDistribution.primary = Math.max(0.05, 
        (population.educationDistribution.primary || 0.3) - totalIncrease * 0.5);
      population.educationDistribution.secondary = Math.max(0.1, 
        (population.educationDistribution.secondary || 0.4) - totalIncrease * 0.5);
    }
    
    // Apply income inequality policy
    if (population.demographicIndicators && demographicsKnobs.income_inequality_policy > 0.5) {
      const inequalityReduction = (demographicsKnobs.income_inequality_policy - 0.5) * 0.2; // Up to 10% reduction
      population.demographicIndicators.giniCoefficient = Math.max(0.2, 
        population.demographicIndicators.giniCoefficient - inequalityReduction);
    }
    
    // Apply quality of life improvements
    const qolBonus = (
      demographicsKnobs.healthcare_investment * 0.2 +
      demographicsKnobs.education_investment * 0.15 +
      demographicsKnobs.environmental_quality * 0.15 +
      demographicsKnobs.infrastructure_quality * 0.2 +
      demographicsKnobs.cultural_investment * 0.1
    );
    
    population.qualityOfLifeIndex = Math.min(1.0, 
      population.qualityOfLifeIndex + qolBonus);
    
    // Apply migration attractiveness
    if (trends[index] && trends[index].migrationTrend) {
      const attractiveness = demographicsKnobs.migration_attractiveness;
      const migrationBonus = (attractiveness - 0.5) * 0.02; // -1% to +1% migration rate
      
      trends[index].migrationTrend.netMigration = Math.max(-0.02, Math.min(0.02, 
        (trends[index].migrationTrend.netMigration || 0) + migrationBonus));
    }
    
    // Apply urban development focus
    if (demographicsKnobs.urban_development > 0.6 && population.totalPopulation > 50000) {
      // Urban-focused development increases city population growth
      const urbanBonus = (demographicsKnobs.urban_development - 0.6) * 0.01;
      population.totalPopulation = Math.floor(population.totalPopulation * (1 + urbanBonus));
    }
  });
  
  // Update social mobility based on knobs
  const mobilityData = Array.from(demographicsGameState.socialMobilityData.values());
  mobilityData.forEach(mobility => {
    if (mobility.overallMobilityScore !== undefined) {
      const mobilityBonus = demographicsKnobs.social_mobility_support * 0.2; // Up to 20% bonus
      mobility.overallMobilityScore = Math.min(1.0, mobility.overallMobilityScore + mobilityBonus);
      
      // Improve specific mobility types
      if (mobility.educationMobility) {
        mobility.educationMobility.mobilityIndex = Math.min(1.0, 
          (mobility.educationMobility.mobilityIndex || 0.5) + demographicsKnobs.education_investment * 0.15);
      }
      
      if (mobility.incomeMobility) {
        mobility.incomeMobility.mobilityIndex = Math.min(1.0, 
          (mobility.incomeMobility.mobilityIndex || 0.5) + demographicsKnobs.employment_programs * 0.1);
      }
    }
  });
  
  console.log('🎛️ Demographics knobs applied to game state:', {
    birth_rate_modifier: demographicsKnobs.birth_rate_modifier,
    education_investment: demographicsKnobs.education_investment,
    healthcare_investment: demographicsKnobs.healthcare_investment,
    migration_attractiveness: demographicsKnobs.migration_attractiveness
  });
}

function setupDemographicsAPIs(app) {
  // Initialize demographics system
  initializeDemographicsSystem();

  // AI Integration Endpoints
  
  // Enhanced AI knob endpoints with multi-format input support
  app.get('/api/demographics/knobs', (req, res) => {
    const knobData = demographicsKnobSystem.getKnobsWithMetadata();
    res.json({
      ...knobData,
      system: 'demographics',
      description: 'AI-adjustable parameters for demographics system with enhanced input support',
      input_help: demographicsKnobSystem.getKnobDescriptions()
    });
  });

  app.post('/api/demographics/knobs', (req, res) => {
    const { knobs, source = 'ai' } = req.body;
    
    if (!knobs || typeof knobs !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid knobs data. Expected object with knob values.',
        help: demographicsKnobSystem.getKnobDescriptions().examples
      });
    }
    
    // Update knobs using enhanced system
    const updateResult = demographicsKnobSystem.updateKnobs(knobs, source);
    
    // Apply knobs to game state (this is where the magic happens)
    try {
      applyKnobsToGameState();
    } catch (error) {
      console.error('Error applying demographics knobs to game state:', error);
    }
    
    res.json({
      success: updateResult.success,
      system: 'demographics',
      ...updateResult,
      message: 'Demographics knobs updated successfully using enhanced input processing'
    });
  });

  // Get knob help/documentation
  app.get('/api/demographics/knobs/help', (req, res) => {
    res.json({
      system: 'demographics',
      help: demographicsKnobSystem.getKnobDescriptions(),
      current_values: demographicsKnobSystem.getKnobsWithMetadata()
    });
  });

  // Get structured outputs for AI consumption
  app.get('/api/demographics/ai-data', (req, res) => {
    const structuredData = generateStructuredOutputs();
    res.json({
      ...structuredData,
      description: 'Structured demographics data for AI analysis and decision-making'
    });
  });

  // Get cross-system integration data
  app.get('/api/demographics/cross-system', (req, res) => {
    const outputs = generateStructuredOutputs();
    res.json({
      workforce_data: outputs.cross_system_data.workforce_availability,
      consumer_data: outputs.cross_system_data.consumer_market_size,
      tax_data: outputs.cross_system_data.tax_base_strength,
      military_data: outputs.cross_system_data.military_recruitment_pool,
      research_data: outputs.cross_system_data.research_capacity,
      population_summary: outputs.population_metrics,
      timestamp: outputs.timestamp
    });
  });

  // Get demographic data for all cities
  app.get('/api/demographics/population', (req, res) => {
    const populationData = Array.from(demographicsGameState.populationData.values());
    res.json({
      total: populationData.length,
      totalPopulation: populationData.reduce((sum, city) => sum + city.totalPopulation, 0),
      cities: populationData
    });
  });

  // Get demographic data for a specific city
  app.get('/api/demographics/population/:cityId', (req, res) => {
    const { cityId } = req.params;
    const cityData = demographicsGameState.populationData.get(cityId);
    
    if (!cityData) {
      return res.status(404).json({ error: 'City demographic data not found' });
    }
    
    res.json(cityData);
  });

  // Get demographic trends for all cities
  app.get('/api/demographics/trends', (req, res) => {
    const trendsData = Array.from(demographicsGameState.demographicTrends.values());
    res.json({
      total: trendsData.length,
      trends: trendsData
    });
  });

  // Get demographic trends for a specific city
  app.get('/api/demographics/trends/:cityId', (req, res) => {
    const { cityId } = req.params;
    const trendsData = demographicsGameState.demographicTrends.get(cityId);
    
    if (!trendsData) {
      return res.status(404).json({ error: 'City trends data not found' });
    }
    
    res.json(trendsData);
  });

  // Get social mobility data for all cities
  app.get('/api/demographics/mobility', (req, res) => {
    const mobilityData = Array.from(demographicsGameState.socialMobilityData.values());
    res.json({
      total: mobilityData.length,
      mobility: mobilityData
    });
  });

  // Get social mobility data for a specific city
  app.get('/api/demographics/mobility/:cityId', (req, res) => {
    const { cityId } = req.params;
    const mobilityData = demographicsGameState.socialMobilityData.get(cityId);
    
    if (!mobilityData) {
      return res.status(404).json({ error: 'City mobility data not found' });
    }
    
    res.json(mobilityData);
  });

  // Get population projections for all cities
  app.get('/api/demographics/projections', (req, res) => {
    const projectionsData = Array.from(demographicsGameState.populationProjections.values());
    res.json({
      total: projectionsData.length,
      projections: projectionsData
    });
  });

  // Get population projections for a specific city
  app.get('/api/demographics/projections/:cityId', (req, res) => {
    const { cityId } = req.params;
    const { model } = req.query;
    const projectionsData = demographicsGameState.populationProjections.get(cityId);
    
    if (!projectionsData) {
      return res.status(404).json({ error: 'City projections data not found' });
    }
    
    // If specific model requested, return only that model
    if (model && projectionsData.projectionModels[model]) {
      res.json({
        cityId: cityId,
        model: model,
        basePopulation: projectionsData.basePopulation,
        projection: projectionsData.projectionModels[model],
        lastProjected: projectionsData.lastProjected
      });
    } else {
      res.json(projectionsData);
    }
  });

  // Get demographic analytics for a city
  app.get('/api/demographics/analytics/:cityId', (req, res) => {
    const { cityId } = req.params;
    const { timeframe = 'yearly' } = req.query;
    
    const populationData = demographicsGameState.populationData.get(cityId);
    const trendsData = demographicsGameState.demographicTrends.get(cityId);
    const mobilityData = demographicsGameState.socialMobilityData.get(cityId);
    const projectionsData = demographicsGameState.populationProjections.get(cityId);
    
    if (!populationData) {
      return res.status(404).json({ error: 'City demographic data not found' });
    }
    
    // Comprehensive analytics combining all demographic data
    const analytics = {
      cityId: cityId,
      cityName: populationData.cityName,
      timeframe: timeframe,
      
      // Population overview
      populationOverview: {
        totalPopulation: populationData.totalPopulation,
        populationDensity: populationData.totalPopulation / 100, // Simplified calculation
        growthRate: trendsData?.populationGrowthTrend?.rate || 0,
        growthTrend: trendsData?.populationGrowthTrend?.trend || 'stable',
        transitionStage: populationData.transitionStage
      },
      
      // Age structure analysis
      ageStructure: {
        distribution: populationData.ageDistribution,
        medianAge: populationData.demographicIndicators.medianAge,
        agingTrend: trendsData?.agingTrend || {},
        dependencyRatio: populationData.demographicIndicators.dependencyRatio,
        youthBulge: populationData.ageDistribution['15-29'] > 0.25
      },
      
      // Education and skills
      educationProfile: {
        distribution: populationData.educationDistribution,
        literacyRate: populationData.demographicIndicators.literacyRate,
        educationTrend: trendsData?.educationTrend || {},
        skillGap: trendsData?.educationTrend?.skillGap || 0,
        educationMobility: mobilityData?.educationMobility || {}
      },
      
      // Economic demographics
      economicProfile: {
        incomeDistribution: populationData.incomeDistribution,
        occupationDistribution: populationData.occupationDistribution,
        giniCoefficient: populationData.demographicIndicators.giniCoefficient,
        incomeTrend: trendsData?.incomeTrend || {},
        incomeMobility: mobilityData?.incomeMobility || {}
      },
      
      // Quality of life indicators
      qualityOfLife: {
        index: populationData.qualityOfLifeIndex,
        lifeExpectancy: populationData.demographicIndicators.lifeExpectancy,
        birthRate: populationData.demographicIndicators.birthRate,
        deathRate: populationData.demographicIndicators.deathRate,
        fertilityRate: populationData.demographicIndicators.fertilityRate,
        humanDevelopmentIndex: populationData.humanDevelopmentIndex
      },
      
      // Social mobility analysis
      socialMobility: {
        overallScore: mobilityData?.overallMobilityScore || 0,
        educationMobility: mobilityData?.educationMobility || {},
        incomeMobility: mobilityData?.incomeMobility || {},
        occupationMobility: mobilityData?.occupationMobility || {},
        geographicMobility: mobilityData?.geographicMobility || {},
        barriers: mobilityData?.mobilityBarriers || [],
        opportunities: mobilityData?.mobilityOpportunities || []
      },
      
      // Migration patterns
      migrationProfile: {
        migrationTrend: trendsData?.migrationTrend || {},
        attractivenessScore: trendsData?.migrationTrend?.attractivenessScore || 50,
        netMigration: trendsData?.migrationTrend?.netMigration || 0
      },
      
      // Urbanization
      urbanization: {
        urbanizationRate: populationData.demographicIndicators.urbanizationRate,
        urbanizationTrend: trendsData?.urbanizationTrend || {}
      },
      
      // Diversity and inclusion
      diversity: {
        diversityIndex: populationData.diversityIndex,
        culturalDiversity: Math.min(100, populationData.totalPopulation / 10000),
        socialCohesion: mobilityData?.socialCapital?.socialConnectedness || 0.5
      },
      
      // Future projections summary
      projectionsSummary: {
        availableModels: Object.keys(projectionsData?.projectionModels || {}),
        scenarioAnalysis: projectionsData?.scenarioAnalysis || {},
        trendProjections: trendsData?.trendProjections || {}
      },
      
      lastUpdated: new Date()
    };
    
    res.json(analytics);
  });

  // Get comparative demographics across cities
  app.get('/api/demographics/comparative', (req, res) => {
    const { metric = 'population', cities } = req.query;
    const cityIds = cities ? cities.split(',') : Array.from(demographicsGameState.populationData.keys());
    
    const comparison = {
      metric: metric,
      cities: cityIds.length,
      data: []
    };
    
    cityIds.forEach(cityId => {
      const populationData = demographicsGameState.populationData.get(cityId);
      const trendsData = demographicsGameState.demographicTrends.get(cityId);
      const mobilityData = demographicsGameState.socialMobilityData.get(cityId);
      
      if (populationData) {
        const cityComparison = {
          cityId: cityId,
          cityName: populationData.cityName,
          totalPopulation: populationData.totalPopulation,
          growthRate: trendsData?.populationGrowthTrend?.rate || 0,
          medianAge: populationData.demographicIndicators.medianAge,
          lifeExpectancy: populationData.demographicIndicators.lifeExpectancy,
          literacyRate: populationData.demographicIndicators.literacyRate,
          giniCoefficient: populationData.demographicIndicators.giniCoefficient,
          qualityOfLifeIndex: populationData.qualityOfLifeIndex,
          humanDevelopmentIndex: populationData.humanDevelopmentIndex,
          mobilityScore: mobilityData?.overallMobilityScore || 0,
          diversityIndex: populationData.diversityIndex,
          transitionStage: populationData.transitionStage
        };
        
        comparison.data.push(cityComparison);
      }
    });
    
    // Sort by the requested metric
    switch (metric) {
      case 'population':
        comparison.data.sort((a, b) => b.totalPopulation - a.totalPopulation);
        break;
      case 'growth':
        comparison.data.sort((a, b) => b.growthRate - a.growthRate);
        break;
      case 'quality':
        comparison.data.sort((a, b) => b.qualityOfLifeIndex - a.qualityOfLifeIndex);
        break;
      case 'mobility':
        comparison.data.sort((a, b) => b.mobilityScore - a.mobilityScore);
        break;
      case 'development':
        comparison.data.sort((a, b) => b.humanDevelopmentIndex - a.humanDevelopmentIndex);
        break;
      default:
        // Keep original order
    }
    
    res.json(comparison);
  });

  // Simulate demographic changes
  app.post('/api/demographics/simulate', (req, res) => {
    try {
      const { cityId, years = 1 } = req.body;
      const simulationResults = [];
      
      if (cityId) {
        // Simulate specific city
        const result = simulateCityDemographics(cityId, years);
        if (result) {
          simulationResults.push(result);
        }
      } else {
        // Simulate all cities
        demographicsGameState.populationData.forEach((data, cityId) => {
          const result = simulateCityDemographics(cityId, years);
          if (result) {
            simulationResults.push(result);
          }
        });
      }
      
      res.json({
        success: true,
        timestamp: new Date(),
        simulatedYears: years,
        citiesSimulated: simulationResults.length,
        results: simulationResults
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Simulate demographic changes for a city
  function simulateCityDemographics(cityId, years) {
    const populationData = demographicsGameState.populationData.get(cityId);
    const trendsData = demographicsGameState.demographicTrends.get(cityId);
    
    if (!populationData || !trendsData) return null;
    
    const growthRate = trendsData.populationGrowthTrend.rate || 0.02;
    const agingRate = 0.3; // Years added to median age per year
    const educationImprovement = 0.02; // Education level improvement per year
    
    // Simulate population changes
    const newPopulation = Math.floor(populationData.totalPopulation * Math.pow(1 + growthRate, years));
    const newMedianAge = populationData.demographicIndicators.medianAge + (agingRate * years);
    const newLifeExpectancy = populationData.demographicIndicators.lifeExpectancy + (0.2 * years);
    
    // Update education distribution (gradual improvement)
    const newEducationDistribution = { ...populationData.educationDistribution };
    const improvementFactor = educationImprovement * years;
    newEducationDistribution.tertiary += improvementFactor * 0.6;
    newEducationDistribution.advanced += improvementFactor * 0.4;
    newEducationDistribution.secondary -= improvementFactor * 0.5;
    newEducationDistribution.primary -= improvementFactor * 0.3;
    newEducationDistribution.no_education -= improvementFactor * 0.2;
    
    // Ensure distributions sum to 1
    const educationTotal = Object.values(newEducationDistribution).reduce((sum, val) => sum + val, 0);
    Object.keys(newEducationDistribution).forEach(key => {
      newEducationDistribution[key] = Math.max(0.01, newEducationDistribution[key] / educationTotal);
    });
    
    // Update the stored data
    populationData.totalPopulation = newPopulation;
    populationData.demographicIndicators.medianAge = newMedianAge;
    populationData.demographicIndicators.lifeExpectancy = newLifeExpectancy;
    populationData.educationDistribution = newEducationDistribution;
    populationData.lastUpdated = new Date();
    
    // Recalculate derived metrics
    const { calculateQualityOfLifeIndex, calculateHumanDevelopmentIndex } = require('../game-state/demographics-state.cjs');
    populationData.qualityOfLifeIndex = calculateQualityOfLifeIndex(
      citiesGameState.cities.get(cityId), 
      populationData.demographicIndicators
    );
    populationData.humanDevelopmentIndex = calculateHumanDevelopmentIndex(
      populationData.demographicIndicators,
      populationData.educationDistribution,
      populationData.incomeDistribution
    );
    
    return {
      cityId: cityId,
      cityName: populationData.cityName,
      changes: {
        populationChange: newPopulation - (populationData.totalPopulation / Math.pow(1 + growthRate, years)),
        medianAgeChange: agingRate * years,
        lifeExpectancyChange: 0.2 * years,
        educationImprovement: improvementFactor
      },
      newMetrics: {
        population: newPopulation,
        medianAge: newMedianAge,
        lifeExpectancy: newLifeExpectancy,
        qualityOfLifeIndex: populationData.qualityOfLifeIndex,
        humanDevelopmentIndex: populationData.humanDevelopmentIndex
      }
    };
  }
}

module.exports = { setupDemographicsAPIs };
