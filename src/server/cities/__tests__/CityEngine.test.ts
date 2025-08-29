/**
 * Unit tests for CityEngine
 */

import { CityEngine } from '../CityEngine';
import { City, CityEngineConfig } from '../types';

describe('CityEngine', () => {
  let cityEngine: CityEngine;

  beforeEach(() => {
    cityEngine = new CityEngine();
  });

  describe('City Creation', () => {
    test('should create a city with basic parameters', () => {
      const city = cityEngine.createCity({
        name: 'Test City',
        coordinates: { x: 100, y: 100 },
        climate: 'temperate',
        terrain: 'plains',
        initialPopulation: 50000
      });

      expect(city.name).toBe('Test City');
      expect(city.population).toBe(50000);
      expect(city.climate).toBe('temperate');
      expect(city.terrain).toBe('plains');
      expect(city.coordinates).toEqual({ x: 100, y: 100 });
      expect(city.qualityOfLife).toBeGreaterThan(0);
      expect(city.economicOutput).toBeGreaterThan(0);
    });

    test('should create a city with geographic advantages', () => {
      const city = cityEngine.createCity({
        name: 'Coastal City',
        coordinates: { x: 200, y: 50 },
        climate: 'mediterranean',
        terrain: 'coastal',
        initialPopulation: 75000,
        geographicAdvantages: ['coastal_access']
      });

      expect(city.geographicAdvantages).toContain('coastal_access');
      expect(city.economicOutput).toBeGreaterThan(75000 * 35000); // Should have bonus from coastal access
    });

    test('should generate appropriate initial infrastructure', () => {
      const city = cityEngine.createCity({
        name: 'Large City',
        coordinates: { x: 150, y: 150 },
        climate: 'temperate',
        terrain: 'plains',
        initialPopulation: 200000
      });

      expect(Object.keys(city.infrastructure).length).toBeGreaterThan(0);
      expect(city.infrastructure['roads']).toBeDefined();
      expect(city.infrastructure['water_system']).toBeDefined();
      expect(city.infrastructure['power_grid']).toBeDefined();
    });
  });

  describe('City Simulation', () => {
    let testCity: City;

    beforeEach(() => {
      testCity = cityEngine.createCity({
        name: 'Simulation Test City',
        coordinates: { x: 100, y: 100 },
        climate: 'temperate',
        terrain: 'plains',
        initialPopulation: 100000
      });
    });

    test('should simulate city development for one time step', () => {
      const initialPopulation = testCity.population;
      const initialEconomicOutput = testCity.economicOutput;

      const updatedCity = cityEngine.simulateTimeStep(testCity.id);

      expect(updatedCity.version).toBe(testCity.version + 1);
      expect(updatedCity.lastUpdated.getTime()).toBeGreaterThan(testCity.lastUpdated.getTime());
      expect(updatedCity.monthlyMetrics.length).toBeGreaterThan(0);
    });

    test('should update population based on attractiveness and quality of life', () => {
      // Set high attractiveness and quality of life
      testCity.attractiveness = 80;
      testCity.qualityOfLife = 85;

      const initialPopulation = testCity.population;
      cityEngine.simulateTimeStep(testCity.id);

      // Population should grow with high attractiveness and QoL
      expect(testCity.population).toBeGreaterThanOrEqual(initialPopulation);
    });

    test('should record monthly metrics', () => {
      cityEngine.simulateTimeStep(testCity.id);

      expect(testCity.monthlyMetrics.length).toBe(1);
      const metrics = testCity.monthlyMetrics[0];
      expect(metrics.population).toBe(testCity.population);
      expect(metrics.economicOutput).toBe(testCity.economicOutput);
      expect(metrics.qualityOfLife).toBe(testCity.qualityOfLife);
    });
  });

  describe('Specialization Development', () => {
    let testCity: City;

    beforeEach(() => {
      testCity = cityEngine.createCity({
        name: 'Tech City',
        coordinates: { x: 100, y: 100 },
        climate: 'temperate',
        terrain: 'plains',
        initialPopulation: 150000 // Large enough for tech specialization
      });

      // Add required infrastructure for tech specialization
      cityEngine.buildInfrastructure(testCity.id, 'university', 5);
      cityEngine.buildInfrastructure(testCity.id, 'high_speed_internet', 5);
      cityEngine.buildInfrastructure(testCity.id, 'business_parks', 5);
    });

    test('should allow specialization development when requirements are met', () => {
      const success = cityEngine.developSpecialization(testCity.id, 'tech_hub');
      expect(success).toBe(true);

      const updatedCity = cityEngine.getCity(testCity.id);
      expect(updatedCity?.currentSpecialization).toBe('tech_hub');
      expect(updatedCity?.specializationProgress).toBe(0);
      expect(updatedCity?.specializationHistory.length).toBe(1);
    });

    test('should reject specialization development when requirements are not met', () => {
      const smallCity = cityEngine.createCity({
        name: 'Small City',
        coordinates: { x: 50, y: 50 },
        climate: 'temperate',
        terrain: 'plains',
        initialPopulation: 25000 // Too small for tech specialization
      });

      const success = cityEngine.developSpecialization(smallCity.id, 'tech_hub');
      expect(success).toBe(false);

      const city = cityEngine.getCity(smallCity.id);
      expect(city?.currentSpecialization).toBeUndefined();
    });

    test('should return available specializations based on city capabilities', () => {
      const availableSpecs = cityEngine.getAvailableSpecializations(testCity.id);
      
      expect(availableSpecs.length).toBeGreaterThan(0);
      expect(availableSpecs.some(spec => spec.id === 'tech_hub')).toBe(true);
    });
  });

  describe('Infrastructure Management', () => {
    let testCity: City;

    beforeEach(() => {
      testCity = cityEngine.createCity({
        name: 'Infrastructure City',
        coordinates: { x: 100, y: 100 },
        climate: 'temperate',
        terrain: 'plains',
        initialPopulation: 100000
      });
    });

    test('should build new infrastructure', () => {
      const success = cityEngine.buildInfrastructure(testCity.id, 'airport', 3);
      expect(success).toBe(true);

      const updatedCity = cityEngine.getCity(testCity.id);
      expect(updatedCity?.infrastructure['airport']).toBeDefined();
      expect(updatedCity?.infrastructure['airport'].level).toBe(3);
    });

    test('should upgrade existing infrastructure', () => {
      const initialLevel = testCity.infrastructure['roads']?.level || 0;
      const success = cityEngine.buildInfrastructure(testCity.id, 'roads', initialLevel + 1);
      expect(success).toBe(true);

      const updatedCity = cityEngine.getCity(testCity.id);
      expect(updatedCity?.infrastructure['roads'].level).toBe(initialLevel + 1);
    });

    test('should reject infrastructure building with insufficient budget', () => {
      // Drain the city budget
      testCity.governmentBudget = 1000; // Very low budget

      const success = cityEngine.buildInfrastructure(testCity.id, 'airport', 5);
      expect(success).toBe(false);
    });

    test('should not allow infrastructure level above maximum', () => {
      const success = cityEngine.buildInfrastructure(testCity.id, 'roads', 15); // Above max level of 10
      expect(success).toBe(false);
    });
  });

  describe('Quality of Life Calculation', () => {
    test('should calculate quality of life based on multiple factors', () => {
      const city = cityEngine.createCity({
        name: 'QoL Test City',
        coordinates: { x: 100, y: 100 },
        climate: 'temperate',
        terrain: 'plains',
        initialPopulation: 100000
      });

      expect(city.qualityOfLife).toBeGreaterThan(0);
      expect(city.qualityOfLife).toBeLessThanOrEqual(100);

      // Improve infrastructure and check QoL improvement
      const initialQoL = city.qualityOfLife;
      cityEngine.buildInfrastructure(city.id, 'schools', 8);
      cityEngine.buildInfrastructure(city.id, 'healthcare', 8);
      cityEngine.simulateTimeStep(city.id);

      expect(city.qualityOfLife).toBeGreaterThanOrEqual(initialQoL);
    });
  });

  describe('City Events', () => {
    let testCity: City;

    beforeEach(() => {
      testCity = cityEngine.createCity({
        name: 'Event City',
        coordinates: { x: 100, y: 100 },
        climate: 'temperate',
        terrain: 'plains',
        initialPopulation: 100000
      });
    });

    test('should track city development events', () => {
      // Develop a specialization to generate an event
      cityEngine.buildInfrastructure(testCity.id, 'university', 5);
      cityEngine.buildInfrastructure(testCity.id, 'high_speed_internet', 5);
      cityEngine.buildInfrastructure(testCity.id, 'business_parks', 5);
      cityEngine.developSpecialization(testCity.id, 'tech_hub');

      const events = cityEngine.getCityEvents(testCity.id);
      expect(events.length).toBeGreaterThan(0);

      // Should have city creation and specialization events
      const creationEvent = events.find(e => e.type === 'population_milestone');
      const specializationEvent = events.find(e => e.type === 'specialization_change');
      
      expect(creationEvent).toBeDefined();
      expect(specializationEvent).toBeDefined();
    });

    test('should limit events when requested', () => {
      // Generate multiple events
      cityEngine.buildInfrastructure(testCity.id, 'roads', 5);
      cityEngine.buildInfrastructure(testCity.id, 'airport', 3);

      const allEvents = cityEngine.getCityEvents(testCity.id);
      const limitedEvents = cityEngine.getCityEvents(testCity.id, 2);

      expect(limitedEvents.length).toBeLessThanOrEqual(2);
      expect(limitedEvents.length).toBeLessThanOrEqual(allEvents.length);
    });
  });

  describe('City Retrieval', () => {
    test('should retrieve all cities', () => {
      const city1 = cityEngine.createCity({
        name: 'City 1',
        coordinates: { x: 100, y: 100 },
        climate: 'temperate',
        terrain: 'plains'
      });

      const city2 = cityEngine.createCity({
        name: 'City 2',
        coordinates: { x: 200, y: 200 },
        climate: 'tropical',
        terrain: 'coastal'
      });

      const allCities = cityEngine.getAllCities();
      expect(allCities.length).toBeGreaterThanOrEqual(2);
      expect(allCities.some(c => c.id === city1.id)).toBe(true);
      expect(allCities.some(c => c.id === city2.id)).toBe(true);
    });

    test('should retrieve specific city by ID', () => {
      const createdCity = cityEngine.createCity({
        name: 'Specific City',
        coordinates: { x: 100, y: 100 },
        climate: 'temperate',
        terrain: 'plains'
      });

      const retrievedCity = cityEngine.getCity(createdCity.id);
      expect(retrievedCity).toBeDefined();
      expect(retrievedCity?.id).toBe(createdCity.id);
      expect(retrievedCity?.name).toBe('Specific City');
    });

    test('should return undefined for non-existent city', () => {
      const nonExistentCity = cityEngine.getCity('non-existent-id');
      expect(nonExistentCity).toBeUndefined();
    });
  });

  describe('Configuration', () => {
    test('should use custom configuration', () => {
      const customConfig: Partial<CityEngineConfig> = {
        basePopulationGrowthRate: 0.05, // 5% instead of default 2%
        economicGrowthVolatility: 0.3,
        infrastructureDecayRate: 0.1
      };

      const customEngine = new CityEngine(customConfig);
      
      // Test that the custom configuration is applied
      const city = customEngine.createCity({
        name: 'Custom Config City',
        coordinates: { x: 100, y: 100 },
        climate: 'temperate',
        terrain: 'plains',
        initialPopulation: 50000
      });

      expect(city.populationGrowthRate).toBe(0.05);
    });
  });
});
