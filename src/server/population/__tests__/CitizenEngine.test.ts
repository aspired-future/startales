/**
 * CitizenEngine Tests
 * 
 * Unit tests for the CitizenEngine class covering citizen generation,
 * lifecycle management, decision-making, and incentive responses.
 */

import { CitizenEngine } from '../CitizenEngine';
import { PopulationConfig, IncentiveType } from '../types';

describe('CitizenEngine', () => {
  let engine: CitizenEngine;
  let config: PopulationConfig;

  beforeEach(() => {
    config = {
      initialPopulationSize: 100,
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
    engine = new CitizenEngine(config, 12345); // Fixed seed for reproducible tests
  });

  describe('Citizen Generation', () => {
    test('should generate a citizen with valid attributes', () => {
      const citizen = engine.generateCitizen('test_city');
      
      expect(citizen.id.value).toBeDefined();
      expect(citizen.demographics.cityId).toBe('test_city');
      expect(citizen.demographics.age).toBeGreaterThanOrEqual(18);
      expect(citizen.demographics.age).toBeLessThanOrEqual(100);
      
      // Psychology traits should be between 0 and 1
      expect(citizen.psychology.openness).toBeGreaterThanOrEqual(0);
      expect(citizen.psychology.openness).toBeLessThanOrEqual(1);
      expect(citizen.psychology.conscientiousness).toBeGreaterThanOrEqual(0);
      expect(citizen.psychology.conscientiousness).toBeLessThanOrEqual(1);
      
      // Career should be valid
      expect(citizen.career.currentProfession).toBeDefined();
      expect(citizen.career.skillLevel).toBeGreaterThanOrEqual(0);
      expect(citizen.career.skillLevel).toBeLessThanOrEqual(100);
      
      // Finances should be realistic
      expect(citizen.finances.income).toBeGreaterThan(0);
      expect(citizen.finances.expenses).toBeGreaterThan(0);
      
      // Dynamic attributes should be in valid range
      expect(citizen.happiness).toBeGreaterThanOrEqual(0);
      expect(citizen.happiness).toBeLessThanOrEqual(1);
      expect(citizen.stress).toBeGreaterThanOrEqual(0);
      expect(citizen.stress).toBeLessThanOrEqual(1);
    });

    test('should generate citizens with different attributes', () => {
      const citizens = [];
      for (let i = 0; i < 10; i++) {
        citizens.push(engine.generateCitizen('test_city'));
      }
      
      // Check that citizens have different ages
      const ages = citizens.map(c => c.demographics.age);
      const uniqueAges = new Set(ages);
      expect(uniqueAges.size).toBeGreaterThan(1);
      
      // Check that citizens have different professions
      const professions = citizens.map(c => c.career.currentProfession);
      const uniqueProfessions = new Set(professions);
      expect(uniqueProfessions.size).toBeGreaterThan(1);
    });

    test('should maintain citizen count', () => {
      const initialCount = engine.getCitizensCount();
      
      engine.generateCitizen('city1');
      expect(engine.getCitizensCount()).toBe(initialCount + 1);
      
      engine.generateCitizen('city2');
      expect(engine.getCitizensCount()).toBe(initialCount + 2);
    });
  });

  describe('Citizen Retrieval', () => {
    test('should retrieve citizen by ID', () => {
      const citizen = engine.generateCitizen('test_city');
      const retrieved = engine.getCitizen(citizen.id.value);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.id.value).toBe(citizen.id.value);
    });

    test('should return undefined for non-existent citizen', () => {
      const retrieved = engine.getCitizen('non_existent_id');
      expect(retrieved).toBeUndefined();
    });

    test('should filter citizens by city', () => {
      engine.generateCitizen('city1');
      engine.generateCitizen('city1');
      engine.generateCitizen('city2');
      
      const city1Citizens = engine.getCitizensByCity('city1');
      const city2Citizens = engine.getCitizensByCity('city2');
      
      expect(city1Citizens.length).toBe(2);
      expect(city2Citizens.length).toBe(1);
      
      city1Citizens.forEach(citizen => {
        expect(citizen.demographics.cityId).toBe('city1');
      });
    });
  });

  describe('Time Step Simulation', () => {
    test('should age citizen during simulation', () => {
      const citizen = engine.generateCitizen('test_city');
      const initialAge = citizen.demographics.age;
      
      engine.simulateTimeStep(citizen.id.value);
      
      const updatedCitizen = engine.getCitizen(citizen.id.value);
      expect(updatedCitizen?.demographics.age).toBeGreaterThan(initialAge);
    });

    test('should update citizen version on simulation', () => {
      const citizen = engine.generateCitizen('test_city');
      const initialVersion = citizen.version;
      
      engine.simulateTimeStep(citizen.id.value);
      
      const updatedCitizen = engine.getCitizen(citizen.id.value);
      expect(updatedCitizen?.version).toBe(initialVersion + 1);
    });

    test('should handle non-existent citizen gracefully', () => {
      expect(() => {
        engine.simulateTimeStep('non_existent_id');
      }).not.toThrow();
    });
  });

  describe('Incentive Response', () => {
    test('should calculate incentive response for valid citizen', () => {
      const citizen = engine.generateCitizen('test_city');
      
      const response = engine.calculateIncentiveResponse(
        citizen.id.value, 
        'education_opportunity' as IncentiveType, 
        1.0
      );
      
      expect(response.citizenId.value).toBe(citizen.id.value);
      expect(response.incentiveType).toBe('education_opportunity');
      expect(response.responseStrength).toBeGreaterThanOrEqual(0);
      expect(response.responseStrength).toBeLessThanOrEqual(1);
      expect(response.behaviorChange).toBeDefined();
      expect(response.adaptationRate).toBeGreaterThanOrEqual(0);
      expect(response.adaptationRate).toBeLessThanOrEqual(1);
    });

    test('should throw error for non-existent citizen', () => {
      expect(() => {
        engine.calculateIncentiveResponse('non_existent_id', 'tax_reduction' as IncentiveType, 1.0);
      }).toThrow('Citizen non_existent_id not found');
    });

    test('should vary response based on citizen psychology', () => {
      // Generate multiple citizens and test education opportunity response
      const citizens = [];
      for (let i = 0; i < 5; i++) {
        citizens.push(engine.generateCitizen('test_city'));
      }
      
      const responses = citizens.map(citizen => 
        engine.calculateIncentiveResponse(citizen.id.value, 'education_opportunity' as IncentiveType, 1.0)
      );
      
      // Responses should vary based on individual psychology
      const responseStrengths = responses.map(r => r.responseStrength);
      const uniqueStrengths = new Set(responseStrengths.map(s => Math.round(s * 100)));
      expect(uniqueStrengths.size).toBeGreaterThan(1);
    });
  });

  describe('Citizen Removal', () => {
    test('should remove citizen successfully', () => {
      const citizen = engine.generateCitizen('test_city');
      const initialCount = engine.getCitizensCount();
      
      const removed = engine.removeCitizen(citizen.id.value);
      
      expect(removed).toBe(true);
      expect(engine.getCitizensCount()).toBe(initialCount - 1);
      expect(engine.getCitizen(citizen.id.value)).toBeUndefined();
    });

    test('should return false for non-existent citizen removal', () => {
      const removed = engine.removeCitizen('non_existent_id');
      expect(removed).toBe(false);
    });
  });

  describe('Deterministic Behavior', () => {
    test('should generate identical citizens with same seed', () => {
      const engine1 = new CitizenEngine(config, 12345);
      const engine2 = new CitizenEngine(config, 12345);
      
      const citizen1 = engine1.generateCitizen('test_city');
      const citizen2 = engine2.generateCitizen('test_city');
      
      // Should have same demographic attributes (age, profession, etc.)
      expect(citizen1.demographics.age).toBe(citizen2.demographics.age);
      expect(citizen1.career.currentProfession).toBe(citizen2.career.currentProfession);
      expect(citizen1.psychology.openness).toBeCloseTo(citizen2.psychology.openness, 5);
    });

    test('should generate different citizens with different seeds', () => {
      const engine1 = new CitizenEngine(config, 12345);
      const engine2 = new CitizenEngine(config, 54321);
      
      const citizen1 = engine1.generateCitizen('test_city');
      const citizen2 = engine2.generateCitizen('test_city');
      
      // Should have different attributes
      const attributesDiffer = 
        citizen1.demographics.age !== citizen2.demographics.age ||
        citizen1.career.currentProfession !== citizen2.career.currentProfession ||
        Math.abs(citizen1.psychology.openness - citizen2.psychology.openness) > 0.1;
      
      expect(attributesDiffer).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle extreme incentive strengths', () => {
      const citizen = engine.generateCitizen('test_city');
      
      // Test very low strength
      const lowResponse = engine.calculateIncentiveResponse(
        citizen.id.value, 'tax_reduction' as IncentiveType, 0.1
      );
      expect(lowResponse.responseStrength).toBeGreaterThanOrEqual(0);
      
      // Test very high strength
      const highResponse = engine.calculateIncentiveResponse(
        citizen.id.value, 'tax_reduction' as IncentiveType, 2.0
      );
      expect(highResponse.responseStrength).toBeLessThanOrEqual(1);
    });

    test('should maintain data integrity after multiple simulations', () => {
      const citizen = engine.generateCitizen('test_city');
      
      // Run multiple simulation steps
      for (let i = 0; i < 10; i++) {
        engine.simulateTimeStep(citizen.id.value);
      }
      
      const updatedCitizen = engine.getCitizen(citizen.id.value);
      expect(updatedCitizen).toBeDefined();
      expect(updatedCitizen?.happiness).toBeGreaterThanOrEqual(0);
      expect(updatedCitizen?.happiness).toBeLessThanOrEqual(1);
      expect(updatedCitizen?.stress).toBeGreaterThanOrEqual(0);
      expect(updatedCitizen?.stress).toBeLessThanOrEqual(1);
      expect(updatedCitizen?.health).toBeGreaterThan(0);
      expect(updatedCitizen?.health).toBeLessThanOrEqual(1);
    });
  });
});
