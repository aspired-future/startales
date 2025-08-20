/**
 * PopulationAnalytics Tests
 * 
 * Unit tests for the PopulationAnalytics class covering demographic analysis,
 * inequality metrics, and incentive impact analysis.
 */

import { PopulationAnalytics } from '../PopulationAnalytics.js';
import { CitizenEngine } from '../CitizenEngine.js';
import { Citizen, PopulationConfig, IncentiveResponse, IncentiveType } from '../types.js';

describe('PopulationAnalytics', () => {
  let analytics: PopulationAnalytics;
  let engine: CitizenEngine;
  let testCitizens: Citizen[];

  beforeEach(() => {
    analytics = new PopulationAnalytics();
    
    const config: PopulationConfig = {
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
    
    engine = new CitizenEngine(config, 12345);
    
    // Generate test population
    testCitizens = [];
    for (let i = 0; i < 20; i++) {
      testCitizens.push(engine.generateCitizen('test_city'));
    }
  });

  describe('Population Metrics Calculation', () => {
    test('should calculate basic population metrics', () => {
      const metrics = analytics.calculatePopulationMetrics(testCitizens);
      
      expect(metrics.totalPopulation).toBe(testCitizens.length);
      expect(metrics.averageAge).toBeGreaterThan(0);
      expect(metrics.averageIncome).toBeGreaterThan(0);
      expect(metrics.unemploymentRate).toBeGreaterThanOrEqual(0);
      expect(metrics.unemploymentRate).toBeLessThanOrEqual(1);
      expect(metrics.happinessIndex).toBeGreaterThanOrEqual(0);
      expect(metrics.happinessIndex).toBeLessThanOrEqual(1);
      expect(metrics.stressIndex).toBeGreaterThanOrEqual(0);
      expect(metrics.stressIndex).toBeLessThanOrEqual(1);
    });

    test('should handle empty population', () => {
      const metrics = analytics.calculatePopulationMetrics([]);
      
      expect(metrics.totalPopulation).toBe(0);
      expect(metrics.averageAge).toBe(0);
      expect(metrics.averageIncome).toBe(0);
      expect(metrics.unemploymentRate).toBe(0);
    });

    test('should calculate age distribution correctly', () => {
      const metrics = analytics.calculatePopulationMetrics(testCitizens);
      
      expect(metrics.ageDistribution).toBeDefined();
      expect(typeof metrics.ageDistribution['18-29']).toBe('number');
      expect(typeof metrics.ageDistribution['30-44']).toBe('number');
      expect(typeof metrics.ageDistribution['45-64']).toBe('number');
      expect(typeof metrics.ageDistribution['65+']).toBe('number');
      
      // Age distribution should sum to 100%
      const total = Object.values(metrics.ageDistribution).reduce((sum, val) => sum + val, 0);
      expect(total).toBeCloseTo(100, 1);
    });

    test('should calculate education distribution correctly', () => {
      const metrics = analytics.calculatePopulationMetrics(testCitizens);
      
      expect(metrics.educationDistribution).toBeDefined();
      
      // Education distribution should sum to 100%
      const total = Object.values(metrics.educationDistribution).reduce((sum, val) => sum + val, 0);
      expect(total).toBeCloseTo(100, 1);
    });

    test('should calculate profession distribution', () => {
      const metrics = analytics.calculatePopulationMetrics(testCitizens);
      
      expect(metrics.professionDistribution).toBeDefined();
      expect(Object.keys(metrics.professionDistribution).length).toBeGreaterThan(0);
      
      // Should show top professions
      const professionPercentages = Object.values(metrics.professionDistribution);
      professionPercentages.forEach(percentage => {
        expect(percentage).toBeGreaterThan(0);
        expect(percentage).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Inequality Analysis', () => {
    test('should calculate Gini coefficient', () => {
      const inequality = analytics.calculateInequality(testCitizens);
      
      expect(inequality.giniCoefficient).toBeGreaterThanOrEqual(0);
      expect(inequality.giniCoefficient).toBeLessThanOrEqual(1);
    });

    test('should calculate income deciles', () => {
      const inequality = analytics.calculateInequality(testCitizens);
      
      expect(inequality.incomeDeciles).toHaveLength(10);
      
      // Deciles should be in ascending order
      for (let i = 1; i < inequality.incomeDeciles.length; i++) {
        expect(inequality.incomeDeciles[i]).toBeGreaterThanOrEqual(inequality.incomeDeciles[i - 1]);
      }
    });

    test('should calculate wealth distribution', () => {
      const inequality = analytics.calculateInequality(testCitizens);
      
      expect(inequality.wealthDistribution).toBeDefined();
      expect(typeof inequality.wealthDistribution['negative']).toBe('number');
      expect(typeof inequality.wealthDistribution['0-10k']).toBe('number');
      expect(typeof inequality.wealthDistribution['100k+']).toBe('number');
      
      // Wealth distribution should sum to 100%
      const total = Object.values(inequality.wealthDistribution).reduce((sum, val) => sum + val, 0);
      expect(total).toBeCloseTo(100, 1);
    });

    test('should handle single citizen inequality calculation', () => {
      const singleCitizen = [testCitizens[0]];
      const inequality = analytics.calculateInequality(singleCitizen);
      
      expect(inequality.giniCoefficient).toBe(0); // No inequality with one person
      expect(inequality.incomeDeciles).toHaveLength(10);
    });
  });

  describe('Incentive Impact Analysis', () => {
    test('should analyze incentive responses', () => {
      // Create mock incentive responses
      const responses: IncentiveResponse[] = testCitizens.slice(0, 10).map(citizen => ({
        citizenId: citizen.id,
        incentiveType: 'education_opportunity' as IncentiveType,
        responseStrength: Math.random(),
        behaviorChange: {
          education_investment: Math.random() * 0.5,
          career_focus: Math.random() * 0.3
        },
        adaptationRate: Math.random(),
        saturationPoint: 0.8 + Math.random() * 0.2
      }));
      
      const impact = analytics.analyzeIncentiveImpact(testCitizens, responses);
      
      expect(impact.overallResponseRate).toBeGreaterThanOrEqual(0);
      expect(impact.overallResponseRate).toBeLessThanOrEqual(1);
      expect(impact.responseByDemographic).toBeDefined();
      expect(impact.behaviorChanges).toBeDefined();
      expect(impact.economicImpact).toBeDefined();
      
      // Economic impact should have expected properties
      expect(typeof impact.economicImpact.spendingChange).toBe('number');
      expect(typeof impact.economicImpact.savingsChange).toBe('number');
      expect(typeof impact.economicImpact.productivityChange).toBe('number');
    });

    test('should handle empty incentive responses', () => {
      const impact = analytics.analyzeIncentiveImpact(testCitizens, []);
      
      expect(impact.overallResponseRate).toBe(0);
      expect(Object.keys(impact.behaviorChanges)).toHaveLength(0);
    });

    test('should calculate demographic response differences', () => {
      // Create responses with demographic bias
      const youngCitizens = testCitizens.filter(c => c.demographics.age < 35);
      const olderCitizens = testCitizens.filter(c => c.demographics.age >= 35);
      
      const responses: IncentiveResponse[] = [
        ...youngCitizens.map(citizen => ({
          citizenId: citizen.id,
          incentiveType: 'education_opportunity' as IncentiveType,
          responseStrength: 0.8, // High response for young citizens
          behaviorChange: { education_investment: 0.5 },
          adaptationRate: 0.7,
          saturationPoint: 0.9
        })),
        ...olderCitizens.slice(0, 2).map(citizen => ({
          citizenId: citizen.id,
          incentiveType: 'education_opportunity' as IncentiveType,
          responseStrength: 0.2, // Low response for older citizens
          behaviorChange: { education_investment: 0.1 },
          adaptationRate: 0.3,
          saturationPoint: 0.8
        }))
      ];
      
      const impact = analytics.analyzeIncentiveImpact(testCitizens, responses);
      
      // Young citizens should have higher response rate
      if (impact.responseByDemographic.young && impact.responseByDemographic.older) {
        expect(impact.responseByDemographic.young).toBeGreaterThan(impact.responseByDemographic.older);
      }
    });
  });

  describe('Demographic Trends', () => {
    test('should calculate trends from historical data', () => {
      // Create mock historical metrics
      const historicalMetrics = [];
      for (let i = 0; i < 12; i++) {
        const baseMetrics = analytics.calculatePopulationMetrics(testCitizens);
        historicalMetrics.push({
          ...baseMetrics,
          totalPopulation: baseMetrics.totalPopulation + i * 10,
          averageAge: baseMetrics.averageAge + i * 0.1,
          averageIncome: baseMetrics.averageIncome * (1 + i * 0.02)
        });
      }
      
      const trends = analytics.calculateDemographicTrends(historicalMetrics);
      
      expect(trends.populationGrowth).toHaveLength(12);
      expect(trends.ageingTrend).toHaveLength(12);
      expect(trends.incomeTrend).toHaveLength(12);
      expect(trends.educationTrend).toHaveLength(12);
      expect(trends.wellbeingTrend).toHaveLength(12);
      
      // Population should show growth trend
      expect(trends.populationGrowth[11]).toBeGreaterThan(trends.populationGrowth[0]);
    });

    test('should handle insufficient historical data', () => {
      const trends = analytics.calculateDemographicTrends([]);
      
      expect(trends.populationGrowth).toHaveLength(0);
      expect(trends.ageingTrend).toHaveLength(0);
      expect(trends.incomeTrend).toHaveLength(0);
      expect(trends.educationTrend).toHaveLength(0);
      expect(trends.wellbeingTrend).toHaveLength(0);
    });
  });

  describe('Data Validation', () => {
    test('should produce consistent metrics for same population', () => {
      const metrics1 = analytics.calculatePopulationMetrics(testCitizens);
      const metrics2 = analytics.calculatePopulationMetrics(testCitizens);
      
      expect(metrics1.totalPopulation).toBe(metrics2.totalPopulation);
      expect(metrics1.averageAge).toBe(metrics2.averageAge);
      expect(metrics1.averageIncome).toBe(metrics2.averageIncome);
      expect(metrics1.happinessIndex).toBe(metrics2.happinessIndex);
    });

    test('should handle citizens with extreme values', () => {
      // Create a citizen with extreme values
      const extremeCitizen = engine.generateCitizen('test_city');
      extremeCitizen.finances.income = 1000000; // Very high income
      extremeCitizen.demographics.age = 100; // Very old
      extremeCitizen.happiness = 1.0; // Maximum happiness
      
      const citizensWithExtreme = [...testCitizens, extremeCitizen];
      const metrics = analytics.calculatePopulationMetrics(citizensWithExtreme);
      
      // Should still produce valid metrics
      expect(metrics.totalPopulation).toBe(citizensWithExtreme.length);
      expect(metrics.averageIncome).toBeGreaterThan(0);
      expect(metrics.happinessIndex).toBeGreaterThanOrEqual(0);
      expect(metrics.happinessIndex).toBeLessThanOrEqual(1);
    });

    test('should maintain percentage constraints in distributions', () => {
      const metrics = analytics.calculatePopulationMetrics(testCitizens);
      
      // All distribution percentages should sum to 100%
      const ageTotal = Object.values(metrics.ageDistribution).reduce((sum, val) => sum + val, 0);
      const genderTotal = Object.values(metrics.genderDistribution).reduce((sum, val) => sum + val, 0);
      const educationTotal = Object.values(metrics.educationDistribution).reduce((sum, val) => sum + val, 0);
      
      expect(ageTotal).toBeCloseTo(100, 1);
      expect(genderTotal).toBeCloseTo(100, 1);
      expect(educationTotal).toBeCloseTo(100, 1);
    });
  });
});
