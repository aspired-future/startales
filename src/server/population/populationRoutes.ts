/**
 * Population API Routes - REST endpoints for population and demographics system
 * 
 * Provides comprehensive API access to citizen data, population metrics,
 * demographic analysis, and incentive response simulation.
 */

import { Router } from 'express';
import { CitizenEngine } from './CitizenEngine.js';
import { PopulationAnalytics } from './PopulationAnalytics.js';
import { 
  Citizen, PopulationMetrics, IncentiveType, IncentiveResponse, 
  PopulationConfig, DecisionType 
} from './types.js';

const router = Router();

// Global population engine instance (in production, this would be per-campaign)
const defaultConfig: PopulationConfig = {
  initialPopulationSize: 1000,
  birthRate: 0.015,
  deathRate: 0.008,
  immigrationRate: 0.005,
  emigrationRate: 0.003,
  timeStep: 'month',
  agingRate: 1.0,
  skillDecayRate: 0.001,
  memoryDecayRate: 0.01,
  decisionFrequency: 0.1,
  socialInfluenceStrength: 0.3,
  adaptationSpeed: 0.2,
  baseConsumption: 2000,
  incomeVolatility: 0.1,
  jobMobilityRate: 0.05
};

const citizenEngine = new CitizenEngine(defaultConfig, 12345);
const analytics = new PopulationAnalytics();

// Initialize with some sample citizens for demo
const sampleCities = ['city_alpha', 'city_beta', 'city_gamma'];
for (let i = 0; i < 100; i++) {
  const cityId = sampleCities[i % sampleCities.length];
  citizenEngine.generateCitizen(cityId);
}

/**
 * GET /api/population/citizens
 * Get all citizens or filter by criteria
 */
router.get('/citizens', (req, res) => {
  try {
    const { cityId, profession, ageMin, ageMax, limit = 50 } = req.query;
    
    let citizens = citizenEngine.getAllCitizens();
    
    // Apply filters
    if (cityId) {
      citizens = citizens.filter(c => c.demographics.cityId === cityId);
    }
    
    if (profession) {
      citizens = citizens.filter(c => c.career.currentProfession === profession);
    }
    
    if (ageMin || ageMax) {
      const minAge = ageMin ? parseInt(ageMin as string) : 0;
      const maxAge = ageMax ? parseInt(ageMax as string) : 150;
      citizens = citizens.filter(c => c.demographics.age >= minAge && c.demographics.age <= maxAge);
    }
    
    // Limit results
    const limitNum = parseInt(limit as string);
    citizens = citizens.slice(0, limitNum);
    
    res.json({
      citizens,
      total: citizens.length,
      filters: { cityId, profession, ageMin, ageMax, limit }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch citizens', details: error.message });
  }
});

/**
 * GET /api/population/citizens/:id
 * Get specific citizen by ID
 */
router.get('/citizens/:id', (req, res) => {
  try {
    const { id } = req.params;
    const citizen = citizenEngine.getCitizen(id);
    
    if (!citizen) {
      return res.status(404).json({ error: 'Citizen not found' });
    }
    
    res.json({ citizen });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch citizen', details: error.message });
  }
});

/**
 * POST /api/population/citizens
 * Generate new citizen(s)
 */
router.post('/citizens', (req, res) => {
  try {
    const { cityId = 'city_alpha', count = 1 } = req.body;
    
    const newCitizens: Citizen[] = [];
    for (let i = 0; i < Math.min(count, 10); i++) { // Limit to 10 per request
      const citizen = citizenEngine.generateCitizen(cityId);
      newCitizens.push(citizen);
    }
    
    res.json({
      citizens: newCitizens,
      count: newCitizens.length,
      message: `Generated ${newCitizens.length} new citizens in ${cityId}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate citizens', details: error.message });
  }
});

/**
 * GET /api/population/demographics
 * Get comprehensive population demographics and metrics
 */
router.get('/demographics', (req, res) => {
  try {
    const { cityId } = req.query;
    
    let citizens = citizenEngine.getAllCitizens();
    if (cityId) {
      citizens = citizenEngine.getCitizensByCity(cityId as string);
    }
    
    const metrics = analytics.calculatePopulationMetrics(citizens);
    const inequality = analytics.calculateInequality(citizens);
    
    res.json({
      metrics,
      inequality,
      cityId: cityId || 'all',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate demographics', details: error.message });
  }
});

/**
 * POST /api/population/incentives
 * Apply incentives and get population response analysis
 */
router.post('/incentives', (req, res) => {
  try {
    const { 
      incentiveType, 
      incentiveStrength = 1.0, 
      targetCriteria = {}, 
      simulateOnly = true 
    } = req.body;
    
    if (!incentiveType || !Object.values(['tax_reduction', 'tax_increase', 'subsidy', 'regulation', 'social_program', 'education_opportunity', 'job_training', 'healthcare_access', 'housing_assistance', 'public_transport', 'environmental_policy', 'cultural_program', 'infrastructure']).includes(incentiveType)) {
      return res.status(400).json({ 
        error: 'Invalid incentive type',
        validTypes: ['tax_reduction', 'tax_increase', 'subsidy', 'regulation', 'social_program', 'education_opportunity', 'job_training', 'healthcare_access', 'housing_assistance', 'public_transport', 'environmental_policy', 'cultural_program', 'infrastructure']
      });
    }
    
    // Get target population
    let targetCitizens = citizenEngine.getAllCitizens();
    
    // Apply targeting criteria
    if (targetCriteria.cityId) {
      targetCitizens = targetCitizens.filter(c => c.demographics.cityId === targetCriteria.cityId);
    }
    if (targetCriteria.profession) {
      targetCitizens = targetCitizens.filter(c => c.career.currentProfession === targetCriteria.profession);
    }
    if (targetCriteria.ageMin || targetCriteria.ageMax) {
      const minAge = targetCriteria.ageMin || 0;
      const maxAge = targetCriteria.ageMax || 150;
      targetCitizens = targetCitizens.filter(c => c.demographics.age >= minAge && c.demographics.age <= maxAge);
    }
    if (targetCriteria.incomeMin || targetCriteria.incomeMax) {
      const minIncome = targetCriteria.incomeMin || 0;
      const maxIncome = targetCriteria.incomeMax || Infinity;
      targetCitizens = targetCitizens.filter(c => {
        const annualIncome = c.finances.income * 12;
        return annualIncome >= minIncome && annualIncome <= maxIncome;
      });
    }
    
    // Calculate incentive responses
    const responses: IncentiveResponse[] = targetCitizens.map(citizen => 
      citizenEngine.calculateIncentiveResponse(citizen.id.value, incentiveType as IncentiveType, incentiveStrength)
    );
    
    // Analyze impact
    const impact = analytics.analyzeIncentiveImpact(targetCitizens, responses);
    
    // If not simulation only, apply the incentive effects
    if (!simulateOnly) {
      // In a real implementation, this would modify citizen states
      // For now, we'll just log that the incentive was applied
      console.log(`Applied incentive ${incentiveType} to ${targetCitizens.length} citizens`);
    }
    
    res.json({
      incentive: {
        type: incentiveType,
        strength: incentiveStrength,
        targetCriteria,
        appliedTo: targetCitizens.length,
        simulationOnly: simulateOnly
      },
      responses: responses.slice(0, 10), // Sample of responses
      impact,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process incentives', details: error.message });
  }
});

/**
 * POST /api/population/simulate
 * Simulate population for one or more time steps
 */
router.post('/simulate', (req, res) => {
  try {
    const { steps = 1, incentives = [], cityId } = req.body;
    
    let citizens = citizenEngine.getAllCitizens();
    if (cityId) {
      citizens = citizenEngine.getCitizensByCity(cityId);
    }
    
    const beforeMetrics = analytics.calculatePopulationMetrics(citizens);
    
    // Simulate time steps
    for (let step = 0; step < Math.min(steps, 12); step++) { // Limit to 12 steps
      citizens.forEach(citizen => {
        citizenEngine.simulateTimeStep(citizen.id.value, incentives);
      });
    }
    
    // Get updated citizens and calculate new metrics
    citizens = cityId ? citizenEngine.getCitizensByCity(cityId) : citizenEngine.getAllCitizens();
    const afterMetrics = analytics.calculatePopulationMetrics(citizens);
    
    // Calculate changes
    const changes = {
      populationChange: afterMetrics.totalPopulation - beforeMetrics.totalPopulation,
      happinessChange: afterMetrics.happinessIndex - beforeMetrics.happinessIndex,
      stressChange: afterMetrics.stressIndex - beforeMetrics.stressIndex,
      incomeChange: afterMetrics.averageIncome - beforeMetrics.averageIncome,
      unemploymentChange: afterMetrics.unemploymentRate - beforeMetrics.unemploymentRate
    };
    
    res.json({
      simulation: {
        steps,
        incentives,
        cityId: cityId || 'all',
        citizensSimulated: citizens.length
      },
      before: beforeMetrics,
      after: afterMetrics,
      changes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to simulate population', details: error.message });
  }
});

/**
 * GET /api/population/analytics/trends
 * Get demographic trends and historical analysis
 */
router.get('/analytics/trends', (req, res) => {
  try {
    const { cityId, timeframe = '12m' } = req.query;
    
    // In a real implementation, this would fetch historical data
    // For demo, we'll generate sample trend data
    const citizens = cityId ? 
      citizenEngine.getCitizensByCity(cityId as string) : 
      citizenEngine.getAllCitizens();
    
    const currentMetrics = analytics.calculatePopulationMetrics(citizens);
    
    // Generate sample historical data
    const historicalMetrics: PopulationMetrics[] = [];
    for (let i = 11; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      historicalMetrics.push({
        ...currentMetrics,
        totalPopulation: Math.floor(currentMetrics.totalPopulation * (1 + variation)),
        averageAge: currentMetrics.averageAge + (Math.random() - 0.5) * 2,
        averageIncome: currentMetrics.averageIncome * (1 + variation),
        happinessIndex: Math.max(0, Math.min(1, currentMetrics.happinessIndex + (Math.random() - 0.5) * 0.2)),
        stressIndex: Math.max(0, Math.min(1, currentMetrics.stressIndex + (Math.random() - 0.5) * 0.2))
      });
    }
    
    const trends = analytics.calculateDemographicTrends(historicalMetrics);
    
    res.json({
      trends,
      timeframe,
      cityId: cityId || 'all',
      dataPoints: historicalMetrics.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate trends', details: error.message });
  }
});

/**
 * GET /api/population/analytics/inequality
 * Get detailed inequality analysis
 */
router.get('/analytics/inequality', (req, res) => {
  try {
    const { cityId } = req.query;
    
    const citizens = cityId ? 
      citizenEngine.getCitizensByCity(cityId as string) : 
      citizenEngine.getAllCitizens();
    
    const inequality = analytics.calculateInequality(citizens);
    const metrics = analytics.calculatePopulationMetrics(citizens);
    
    res.json({
      inequality,
      context: {
        totalPopulation: metrics.totalPopulation,
        averageIncome: metrics.averageIncome,
        cityId: cityId || 'all'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate inequality', details: error.message });
  }
});

/**
 * GET /api/population/professions
 * Get profession statistics and career information
 */
router.get('/professions', (req, res) => {
  try {
    const { cityId } = req.query;
    
    const citizens = cityId ? 
      citizenEngine.getCitizensByCity(cityId as string) : 
      citizenEngine.getAllCitizens();
    
    // Calculate profession statistics
    const professionStats: Record<string, {
      count: number;
      averageSalary: number;
      averageSatisfaction: number;
      averageSkillLevel: number;
      employmentRate: number;
    }> = {};
    
    citizens.forEach(citizen => {
      const profession = citizen.career.currentProfession;
      if (!professionStats[profession]) {
        professionStats[profession] = {
          count: 0,
          averageSalary: 0,
          averageSatisfaction: 0,
          averageSkillLevel: 0,
          employmentRate: 0
        };
      }
      
      const stats = professionStats[profession];
      stats.count++;
      stats.averageSalary += citizen.finances.income * 12; // Annual salary
      stats.averageSatisfaction += citizen.career.jobSatisfaction;
      stats.averageSkillLevel += citizen.career.skillLevel;
      if (citizen.career.employmentStatus === 'employed') {
        stats.employmentRate++;
      }
    });
    
    // Calculate averages
    Object.values(professionStats).forEach(stats => {
      if (stats.count > 0) {
        stats.averageSalary /= stats.count;
        stats.averageSatisfaction /= stats.count;
        stats.averageSkillLevel /= stats.count;
        stats.employmentRate /= stats.count;
      }
    });
    
    // Sort by count
    const sortedProfessions = Object.entries(professionStats)
      .sort((a, b) => b[1].count - a[1].count);
    
    res.json({
      professions: Object.fromEntries(sortedProfessions),
      totalProfessions: Object.keys(professionStats).length,
      cityId: cityId || 'all',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profession statistics', details: error.message });
  }
});

/**
 * GET /api/population/health
 * Get population health and system status
 */
router.get('/health', (req, res) => {
  try {
    const totalCitizens = citizenEngine.getCitizensCount();
    const cities = ['city_alpha', 'city_beta', 'city_gamma'];
    const cityPopulations = cities.map(cityId => ({
      cityId,
      population: citizenEngine.getCitizensByCity(cityId).length
    }));
    
    res.json({
      status: 'healthy',
      totalCitizens,
      cityPopulations,
      config: defaultConfig,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'System health check failed', details: error.message });
  }
});

export default router;
