const { demographicsGameState, initializeDemographicsSystem } = require('../game-state/demographics-state');
const { citiesGameState } = require('../game-state/cities-state');
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

function setupDemographicsAPIs(app) {
  // Initialize demographics system
  initializeDemographicsSystem();

  // Enhanced AI Knobs for Demographics System
  const demographicsKnobsData = {
    // Population Growth Factors
    birth_rate_influence: 0.6,           // Influence on birth rates
    death_rate_influence: 0.5,           // Influence on death rates
    migration_attractiveness: 0.7,       // Attractiveness for migration
    
    // Age Distribution Management
    youth_support_programs: 0.6,         // Support for youth programs
    elderly_care_quality: 0.7,           // Quality of elderly care
    working_age_retention: 0.8,          // Retention of working-age population
    
    // Education & Skills
    education_investment_level: 0.7,     // Investment in education
    skill_development_programs: 0.6,     // Skill development initiatives
    higher_education_accessibility: 0.5, // Higher education accessibility
    
    // Employment & Economy
    job_creation_focus: 0.8,             // Focus on job creation
    unemployment_support: 0.6,           // Unemployment support programs
    economic_opportunity_creation: 0.7,  // Economic opportunity creation
    
    // Health & Wellness
    healthcare_accessibility: 0.8,       // Healthcare accessibility
    public_health_programs: 0.7,         // Public health program effectiveness
    mental_health_support: 0.5,          // Mental health support services
    
    // Social Integration
    cultural_diversity_support: 0.6,     // Support for cultural diversity
    social_cohesion_programs: 0.7,       // Social cohesion programs
    community_engagement: 0.5,           // Community engagement initiatives
    
    // Urban Planning
    housing_affordability: 0.6,          // Housing affordability programs
    infrastructure_development: 0.8,     // Infrastructure development
    environmental_quality: 0.7,          // Environmental quality maintenance
    
    // Data Collection & Analysis
    census_accuracy: 0.9,                // Census and data collection accuracy
    demographic_forecasting: 0.7,        // Demographic forecasting capability
    policy_impact_measurement: 0.6,      // Policy impact measurement
    
    lastUpdated: Date.now()
  };

  // Initialize Enhanced Knob System
  const demographicsKnobSystem = new EnhancedKnobSystem(demographicsKnobsData);

  // Apply knobs to game state
  function applyDemographicsKnobsToGameState() {
    const knobs = demographicsKnobSystem.knobs;
    
    // Apply population growth factors
    const populationGrowthImpact = (knobs.birth_rate_influence - knobs.death_rate_influence + knobs.migration_attractiveness) / 3;
    
    // Apply age distribution management
    const ageDistributionImpact = (knobs.youth_support_programs + knobs.elderly_care_quality + knobs.working_age_retention) / 3;
    
    // Apply education and skills impact
    const educationImpact = (knobs.education_investment_level + knobs.skill_development_programs + knobs.higher_education_accessibility) / 3;
    
    // Apply employment and economy impact
    const employmentImpact = (knobs.job_creation_focus + knobs.unemployment_support + knobs.economic_opportunity_creation) / 3;
    
    // Apply health and wellness impact
    const healthImpact = (knobs.healthcare_accessibility + knobs.public_health_programs + knobs.mental_health_support) / 3;
    
    // Apply social integration impact
    const socialImpact = (knobs.cultural_diversity_support + knobs.social_cohesion_programs + knobs.community_engagement) / 3;
    
    // Apply urban planning impact
    const urbanPlanningImpact = (knobs.housing_affordability + knobs.infrastructure_development + knobs.environmental_quality) / 3;
    
    // Apply data collection impact
    const dataQualityImpact = (knobs.census_accuracy + knobs.demographic_forecasting + knobs.policy_impact_measurement) / 3;
    
    console.log('Applied demographics knobs to game state:', {
      populationGrowthImpact,
      ageDistributionImpact,
      educationImpact,
      employmentImpact,
      healthImpact,
      socialImpact,
      urbanPlanningImpact,
      dataQualityImpact
    });
  }

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
    const { calculateQualityOfLifeIndex, calculateHumanDevelopmentIndex } = require('../game-state/demographics-state');
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

  // Enhanced Knob System Endpoints
  createEnhancedKnobEndpoints(app, 'demographics-js', demographicsKnobSystem, applyDemographicsKnobsToGameState);
}

module.exports = { setupDemographicsAPIs };

