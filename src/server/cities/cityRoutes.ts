/**
 * City System API Routes
 * 
 * RESTful API endpoints for city management, specialization development,
 * infrastructure management, and analytics.
 */

import express from 'express';
import { CityEngine } from './CityEngine.js';
import { CityAnalyticsEngine } from './CityAnalytics.js';
import { City, CitySpecialization, DEFAULT_SPECIALIZATIONS } from './types.js';

const router = express.Router();

// Initialize engines
const cityEngine = new CityEngine();
const analyticsEngine = new CityAnalyticsEngine();

// Initialize with some sample cities for demonstration
initializeSampleCities();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  const cities = cityEngine.getAllCities();
  res.json({
    status: 'healthy',
    service: 'city-system',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    totalCities: cities.length,
    activeCities: cities.filter(city => city.population > 0).length
  });
});

/**
 * Get all cities with optional filtering
 */
router.get('/', (req, res) => {
  try {
    const cities = cityEngine.getAllCities();
    
    // Apply filters
    let filteredCities = cities;
    
    const { minPopulation, maxPopulation, specialization, climate, terrain } = req.query;
    
    if (minPopulation) {
      filteredCities = filteredCities.filter(city => city.population >= parseInt(minPopulation as string));
    }
    
    if (maxPopulation) {
      filteredCities = filteredCities.filter(city => city.population <= parseInt(maxPopulation as string));
    }
    
    if (specialization) {
      filteredCities = filteredCities.filter(city => city.currentSpecialization === specialization);
    }
    
    if (climate) {
      filteredCities = filteredCities.filter(city => city.climate === climate);
    }
    
    if (terrain) {
      filteredCities = filteredCities.filter(city => city.terrain === terrain);
    }

    // Sort by population by default
    filteredCities.sort((a, b) => b.population - a.population);

    res.json({
      cities: filteredCities,
      total: filteredCities.length,
      filters: { minPopulation, maxPopulation, specialization, climate, terrain }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch cities', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get specific city by ID
 */
router.get('/:cityId', (req, res) => {
  try {
    const { cityId } = req.params;
    const city = cityEngine.getCity(cityId);
    
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json(city);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch city', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Create a new city
 */
router.post('/', (req, res) => {
  try {
    const { 
      name, 
      coordinates, 
      climate, 
      terrain, 
      initialPopulation, 
      geographicAdvantages, 
      naturalResources 
    } = req.body;

    if (!name || !coordinates || !climate || !terrain) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, coordinates, climate, terrain' 
      });
    }

    const city = cityEngine.createCity({
      name,
      coordinates,
      climate,
      terrain,
      initialPopulation,
      geographicAdvantages,
      naturalResources
    });

    res.status(201).json(city);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create city', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Simulate city development for one time step
 */
router.post('/:cityId/simulate', (req, res) => {
  try {
    const { cityId } = req.params;
    const city = cityEngine.simulateTimeStep(cityId);
    
    res.json({
      message: 'City simulation step completed',
      city,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to simulate city', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get available specializations for a city
 */
router.get('/:cityId/specializations/available', (req, res) => {
  try {
    const { cityId } = req.params;
    const availableSpecializations = cityEngine.getAvailableSpecializations(cityId);
    
    res.json({
      cityId,
      availableSpecializations,
      total: availableSpecializations.length
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch available specializations', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Develop a specialization for a city
 */
router.post('/:cityId/specializations/:specializationId', (req, res) => {
  try {
    const { cityId, specializationId } = req.params;
    const success = cityEngine.developSpecialization(cityId, specializationId);
    
    if (!success) {
      return res.status(400).json({ 
        error: 'Cannot develop specialization', 
        message: 'City does not meet requirements or specialization not found' 
      });
    }

    const city = cityEngine.getCity(cityId);
    res.json({
      message: 'Specialization development started',
      city,
      specializationId
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to develop specialization', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get all available specializations
 */
router.get('/specializations/all', (req, res) => {
  try {
    res.json({
      specializations: DEFAULT_SPECIALIZATIONS,
      total: DEFAULT_SPECIALIZATIONS.length
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch specializations', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get city infrastructure
 */
router.get('/:cityId/infrastructure', (req, res) => {
  try {
    const { cityId } = req.params;
    const city = cityEngine.getCity(cityId);
    
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    const infrastructureArray = Object.values(city.infrastructure).map(infra => ({
      ...infra,
      utilizationRate: city.population / infra.capacity,
      maintenanceDue: infra.level < 5,
      upgradeRecommended: (city.population / infra.capacity) > 0.8
    }));

    res.json({
      cityId,
      infrastructure: infrastructureArray,
      totalInfrastructure: infrastructureArray.length,
      averageLevel: infrastructureArray.reduce((sum, infra) => sum + infra.level, 0) / infrastructureArray.length,
      totalMaintenanceCost: infrastructureArray.reduce((sum, infra) => sum + infra.maintenanceCost, 0),
      infrastructureBudget: city.infrastructureBudget
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch infrastructure', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Build or upgrade infrastructure
 */
router.post('/:cityId/infrastructure/:infrastructureId', (req, res) => {
  try {
    const { cityId, infrastructureId } = req.params;
    const { targetLevel } = req.body;
    
    const success = cityEngine.buildInfrastructure(cityId, infrastructureId, targetLevel);
    
    if (!success) {
      return res.status(400).json({ 
        error: 'Cannot build infrastructure', 
        message: 'Insufficient budget or invalid parameters' 
      });
    }

    const city = cityEngine.getCity(cityId);
    res.json({
      message: 'Infrastructure built/upgraded successfully',
      city,
      infrastructureId,
      newLevel: city?.infrastructure[infrastructureId]?.level
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to build infrastructure', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get city analytics
 */
router.get('/:cityId/analytics', (req, res) => {
  try {
    const { cityId } = req.params;
    const city = cityEngine.getCity(cityId);
    
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    const allCities = cityEngine.getAllCities();
    const specializations = new Map(DEFAULT_SPECIALIZATIONS.map(spec => [spec.id, spec]));
    
    const analytics = analyticsEngine.generateCityAnalytics(city, allCities, specializations);
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to generate analytics', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Compare two cities
 */
router.get('/:cityId/compare/:otherCityId', (req, res) => {
  try {
    const { cityId, otherCityId } = req.params;
    
    const cityA = cityEngine.getCity(cityId);
    const cityB = cityEngine.getCity(otherCityId);
    
    if (!cityA || !cityB) {
      return res.status(404).json({ error: 'One or both cities not found' });
    }

    const comparison = analyticsEngine.compareCities(cityA, cityB);
    
    res.json({
      cityA: { id: cityA.id, name: cityA.name },
      cityB: { id: cityB.id, name: cityB.name },
      ...comparison
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to compare cities', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get city development events
 */
router.get('/:cityId/events', (req, res) => {
  try {
    const { cityId } = req.params;
    const { limit } = req.query;
    
    const events = cityEngine.getCityEvents(cityId, limit ? parseInt(limit as string) : undefined);
    
    res.json({
      cityId,
      events,
      total: events.length
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch city events', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Get city metrics history
 */
router.get('/:cityId/metrics', (req, res) => {
  try {
    const { cityId } = req.params;
    const city = cityEngine.getCity(cityId);
    
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json({
      cityId,
      metrics: city.monthlyMetrics,
      currentMetrics: {
        population: city.population,
        economicOutput: city.economicOutput,
        qualityOfLife: city.qualityOfLife,
        unemploymentRate: city.unemploymentRate,
        attractiveness: city.attractiveness
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch city metrics', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * Initialize sample cities for demonstration
 */
function initializeSampleCities() {
  // Create diverse sample cities
  const sampleCities = [
    {
      name: 'New Metropolis',
      coordinates: { x: 100, y: 100 },
      climate: 'temperate' as const,
      terrain: 'plains' as const,
      initialPopulation: 150000,
      geographicAdvantages: ['strategic_crossroads'],
      naturalResources: {}
    },
    {
      name: 'Coastal Harbor',
      coordinates: { x: 200, y: 50 },
      climate: 'mediterranean' as const,
      terrain: 'coastal' as const,
      initialPopulation: 85000,
      geographicAdvantages: ['coastal_access'],
      naturalResources: {}
    },
    {
      name: 'Mountain View',
      coordinates: { x: 50, y: 200 },
      climate: 'temperate' as const,
      terrain: 'mountains' as const,
      initialPopulation: 45000,
      geographicAdvantages: ['mountain_resources'],
      naturalResources: {}
    },
    {
      name: 'River Valley',
      coordinates: { x: 150, y: 150 },
      climate: 'temperate' as const,
      terrain: 'river' as const,
      initialPopulation: 120000,
      geographicAdvantages: ['river_access', 'fertile_plains'],
      naturalResources: {}
    }
  ];

  sampleCities.forEach(cityParams => {
    try {
      const city = cityEngine.createCity(cityParams);
      
      // Simulate some development for variety
      const simulationSteps = Math.floor(Math.random() * 12) + 1; // 1-12 months
      for (let i = 0; i < simulationSteps; i++) {
        cityEngine.simulateTimeStep(city.id);
      }
      
      // Randomly assign specializations to some cities
      if (Math.random() > 0.5) {
        const availableSpecs = cityEngine.getAvailableSpecializations(city.id);
        if (availableSpecs.length > 0) {
          const randomSpec = availableSpecs[Math.floor(Math.random() * availableSpecs.length)];
          cityEngine.developSpecialization(city.id, randomSpec.id);
        }
      }
    } catch (error) {
      console.error(`Failed to create sample city ${cityParams.name}:`, error);
    }
  });
}

export default router;
