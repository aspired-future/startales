/**
 * Unit tests for CityAnalyticsEngine
 */

import { CityAnalyticsEngine } from '../CityAnalytics';
import { City, CitySpecialization, DEFAULT_SPECIALIZATIONS } from '../types';

describe('CityAnalyticsEngine', () => {
  let analyticsEngine: CityAnalyticsEngine;
  let sampleCity: City;
  let sampleCities: City[];

  beforeEach(() => {
    analyticsEngine = new CityAnalyticsEngine();
    
    // Create a sample city for testing
    sampleCity = {
      id: 'test-city-1',
      name: 'Test City',
      founded: new Date('2020-01-01'),
      coordinates: { x: 100, y: 100 },
      climate: 'temperate',
      terrain: 'plains',
      size: 100,
      population: 150000,
      populationGrowthRate: 0.025,
      economicOutput: 7500000000, // $7.5B
      unemploymentRate: 0.05,
      averageIncome: 50000,
      costOfLiving: 100,
      currentSpecialization: 'tech_hub',
      specializationProgress: 65,
      specializationHistory: [{
        specializationId: 'tech_hub',
        startDate: new Date('2022-01-01'),
        maxStageReached: 2
      }],
      infrastructure: {
        'roads': {
          id: 'roads',
          name: 'Road Network',
          type: 'transport',
          level: 6,
          capacity: 60000,
          maintenanceCost: 300000,
          constructionCost: 4500000,
          constructionTime: 36,
          qualityOfLifeImpact: 30,
          economicImpact: 48
        },
        'schools': {
          id: 'schools',
          name: 'Educational Facilities',
          type: 'education',
          level: 7,
          capacity: 14000,
          maintenanceCost: 420000,
          constructionCost: 6300000,
          constructionTime: 56,
          qualityOfLifeImpact: 70,
          economicImpact: 42
        },
        'university': {
          id: 'university',
          name: 'University',
          type: 'education',
          level: 5,
          capacity: 50000,
          maintenanceCost: 1000000,
          constructionCost: 15000000,
          constructionTime: 120,
          qualityOfLifeImpact: 40,
          economicImpact: 60
        }
      },
      infrastructureBudget: 75000000,
      geographicAdvantages: ['strategic_crossroads'],
      naturalResources: {},
      qualityOfLife: 78,
      attractiveness: 72,
      sustainability: 68,
      tradePartners: [],
      taxRate: 0.08,
      governmentBudget: 180000000,
      governmentDebt: 50000000,
      policyModifiers: [],
      monthlyMetrics: [
        {
          date: new Date('2023-01-01'),
          population: 145000,
          economicOutput: 7200000000,
          qualityOfLife: 75,
          unemploymentRate: 0.06,
          infrastructureSpending: 70000000,
          businessCount: 290
        },
        {
          date: new Date('2023-12-01'),
          population: 150000,
          economicOutput: 7500000000,
          qualityOfLife: 78,
          unemploymentRate: 0.05,
          infrastructureSpending: 75000000,
          businessCount: 300
        }
      ],
      lastUpdated: new Date(),
      version: 1
    };

    // Create sample cities for comparison
    sampleCities = [
      sampleCity,
      {
        ...sampleCity,
        id: 'test-city-2',
        name: 'Comparison City',
        population: 200000,
        economicOutput: 8000000000,
        qualityOfLife: 70,
        unemploymentRate: 0.07,
        currentSpecialization: 'manufacturing_center'
      }
    ];
  });

  describe('Economic Health Analysis', () => {
    test('should calculate GDP per capita correctly', () => {
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity);
      
      const expectedGDPPerCapita = sampleCity.economicOutput / sampleCity.population;
      expect(analytics.economicHealth.gdpPerCapita).toBe(expectedGDPPerCapita);
      expect(analytics.economicHealth.gdpPerCapita).toBe(50000);
    });

    test('should calculate economic growth rate from historical data', () => {
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity);
      
      // Should calculate growth based on monthly metrics
      expect(analytics.economicHealth.economicGrowthRate).toBeDefined();
      expect(typeof analytics.economicHealth.economicGrowthRate).toBe('number');
    });

    test('should identify competitive advantages', () => {
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity);
      
      expect(analytics.economicHealth.competitiveAdvantages).toBeInstanceOf(Array);
      expect(analytics.economicHealth.competitiveAdvantages.length).toBeGreaterThan(0);
      
      // Should include specialization advantage
      expect(analytics.economicHealth.competitiveAdvantages.some(
        advantage => advantage.includes('tech hub')
      )).toBe(true);
    });

    test('should identify economic vulnerabilities', () => {
      // Create a city with vulnerabilities
      const vulnerableCity: City = {
        ...sampleCity,
        unemploymentRate: 0.12, // High unemployment
        governmentDebt: 400000000, // High debt
        populationGrowthRate: -0.01 // Population decline
      };

      const analytics = analyticsEngine.generateCityAnalytics(vulnerableCity);
      
      expect(analytics.economicHealth.economicVulnerabilities).toBeInstanceOf(Array);
      expect(analytics.economicHealth.economicVulnerabilities.length).toBeGreaterThan(0);
      
      // Should identify high unemployment
      expect(analytics.economicHealth.economicVulnerabilities.some(
        vuln => vuln.includes('unemployment')
      )).toBe(true);
    });

    test('should calculate industrial diversification', () => {
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity);
      
      expect(analytics.economicHealth.industrialDiversification).toBeGreaterThanOrEqual(0);
      expect(analytics.economicHealth.industrialDiversification).toBeLessThanOrEqual(100);
    });
  });

  describe('Infrastructure Health Analysis', () => {
    test('should calculate overall infrastructure level', () => {
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity);
      
      const expectedLevel = ((6 + 7 + 5) / 3) * 10; // Average level * 10
      expect(analytics.infrastructureHealth.overallLevel).toBeCloseTo(expectedLevel, 1);
    });

    test('should calculate maintenance backlog', () => {
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity);
      
      expect(analytics.infrastructureHealth.maintenanceBacklog).toBeGreaterThanOrEqual(0);
      expect(typeof analytics.infrastructureHealth.maintenanceBacklog).toBe('number');
    });

    test('should calculate capacity utilization', () => {
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity);
      
      expect(analytics.infrastructureHealth.capacityUtilization).toBeGreaterThanOrEqual(0);
      expect(typeof analytics.infrastructureHealth.capacityUtilization).toBe('number');
    });

    test('should identify priority upgrades', () => {
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity);
      
      expect(analytics.infrastructureHealth.priorityUpgrades).toBeInstanceOf(Array);
      // Priority upgrades should be sorted by urgency (highest first)
      for (let i = 1; i < analytics.infrastructureHealth.priorityUpgrades.length; i++) {
        expect(analytics.infrastructureHealth.priorityUpgrades[i-1].urgency)
          .toBeGreaterThanOrEqual(analytics.infrastructureHealth.priorityUpgrades[i].urgency);
      }
    });
  });

  describe('Social Health Analysis', () => {
    test('should calculate social mobility', () => {
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity);
      
      expect(analytics.socialHealth.socialMobility).toBeGreaterThanOrEqual(0);
      expect(analytics.socialHealth.socialMobility).toBeLessThanOrEqual(100);
    });

    test('should calculate cultural vitality', () => {
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity);
      
      expect(analytics.socialHealth.culturalVitality).toBeGreaterThanOrEqual(0);
      expect(analytics.socialHealth.culturalVitality).toBeLessThanOrEqual(100);
    });

    test('should calculate community engagement', () => {
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity);
      
      expect(analytics.socialHealth.communityEngagement).toBeGreaterThanOrEqual(0);
      expect(analytics.socialHealth.communityEngagement).toBeLessThanOrEqual(100);
    });

    test('should use quality of life from city data', () => {
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity);
      
      expect(analytics.socialHealth.qualityOfLife).toBe(sampleCity.qualityOfLife);
    });
  });

  describe('Regional Ranking', () => {
    test('should calculate rankings compared to other cities', () => {
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity, sampleCities);
      
      expect(analytics.regionalRanking.economicOutput).toBeGreaterThan(0);
      expect(analytics.regionalRanking.qualityOfLife).toBeGreaterThan(0);
      expect(analytics.regionalRanking.growth).toBeGreaterThan(0);
      expect(analytics.regionalRanking.innovation).toBeGreaterThan(0);
      
      // Rankings should be within the number of cities
      expect(analytics.regionalRanking.economicOutput).toBeLessThanOrEqual(sampleCities.length);
      expect(analytics.regionalRanking.qualityOfLife).toBeLessThanOrEqual(sampleCities.length);
    });

    test('should handle single city ranking', () => {
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity, [sampleCity]);
      
      // With only one city, all rankings should be 1
      expect(analytics.regionalRanking.economicOutput).toBe(1);
      expect(analytics.regionalRanking.qualityOfLife).toBe(1);
      expect(analytics.regionalRanking.growth).toBe(1);
      expect(analytics.regionalRanking.innovation).toBe(1);
    });
  });

  describe('Five-Year Projection', () => {
    test('should project population growth', () => {
      const specializations = new Map(DEFAULT_SPECIALIZATIONS.map(spec => [spec.id, spec]));
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity, sampleCities, specializations);
      
      expect(analytics.fiveYearProjection.projectedPopulation).toBeGreaterThan(0);
      // Should generally project growth for an attractive city
      expect(analytics.fiveYearProjection.projectedPopulation).toBeGreaterThanOrEqual(sampleCity.population);
    });

    test('should project GDP growth', () => {
      const specializations = new Map(DEFAULT_SPECIALIZATIONS.map(spec => [spec.id, spec]));
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity, sampleCities, specializations);
      
      expect(analytics.fiveYearProjection.projectedGDP).toBeGreaterThan(0);
      expect(analytics.fiveYearProjection.projectedGDP).toBeGreaterThanOrEqual(sampleCity.economicOutput);
    });

    test('should project quality of life improvements', () => {
      const specializations = new Map(DEFAULT_SPECIALIZATIONS.map(spec => [spec.id, spec]));
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity, sampleCities, specializations);
      
      expect(analytics.fiveYearProjection.projectedQualityOfLife).toBeGreaterThanOrEqual(0);
      expect(analytics.fiveYearProjection.projectedQualityOfLife).toBeLessThanOrEqual(100);
    });

    test('should identify key risks and opportunities', () => {
      const specializations = new Map(DEFAULT_SPECIALIZATIONS.map(spec => [spec.id, spec]));
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity, sampleCities, specializations);
      
      expect(analytics.fiveYearProjection.keyRisks).toBeInstanceOf(Array);
      expect(analytics.fiveYearProjection.keyOpportunities).toBeInstanceOf(Array);
      
      // Should have at least some risks or opportunities
      expect(analytics.fiveYearProjection.keyRisks.length + 
             analytics.fiveYearProjection.keyOpportunities.length).toBeGreaterThan(0);
    });
  });

  describe('City Comparison', () => {
    test('should compare two cities across multiple metrics', () => {
      const cityA = sampleCities[0];
      const cityB = sampleCities[1];
      
      const comparison = analyticsEngine.compareCities(cityA, cityB);
      
      expect(comparison.winner).toBeDefined();
      expect(comparison.comparison).toBeInstanceOf(Array);
      expect(comparison.comparison.length).toBeGreaterThan(0);
      
      // Each comparison should have required fields
      comparison.comparison.forEach(comp => {
        expect(comp.metric).toBeDefined();
        expect(comp.cityAValue).toBeDefined();
        expect(comp.cityBValue).toBeDefined();
        expect(comp.winner).toBeDefined();
        expect([cityA.name, cityB.name]).toContain(comp.winner);
      });
    });

    test('should determine overall winner based on individual metric wins', () => {
      const cityA = sampleCities[0];
      const cityB = sampleCities[1];
      
      const comparison = analyticsEngine.compareCities(cityA, cityB);
      
      const cityAWins = comparison.comparison.filter(c => c.winner === cityA.name).length;
      const cityBWins = comparison.comparison.filter(c => c.winner === cityB.name).length;
      
      const expectedWinner = cityAWins > cityBWins ? cityA.name : cityB.name;
      expect(comparison.winner).toBe(expectedWinner);
    });

    test('should include standard comparison metrics', () => {
      const cityA = sampleCities[0];
      const cityB = sampleCities[1];
      
      const comparison = analyticsEngine.compareCities(cityA, cityB);
      
      const metrics = comparison.comparison.map(c => c.metric);
      expect(metrics).toContain('Population');
      expect(metrics).toContain('GDP per Capita');
      expect(metrics).toContain('Quality of Life');
      expect(metrics).toContain('Unemployment Rate');
      expect(metrics).toContain('Attractiveness');
    });
  });

  describe('Analytics Metadata', () => {
    test('should include analysis metadata', () => {
      const analytics = analyticsEngine.generateCityAnalytics(sampleCity);
      
      expect(analytics.cityId).toBe(sampleCity.id);
      expect(analytics.analysisDate).toBeInstanceOf(Date);
      expect(analytics.analysisDate.getTime()).toBeLessThanOrEqual(Date.now());
    });

    test('should generate consistent results for same input', () => {
      const analytics1 = analyticsEngine.generateCityAnalytics(sampleCity, sampleCities);
      const analytics2 = analyticsEngine.generateCityAnalytics(sampleCity, sampleCities);
      
      // Core metrics should be the same (allowing for small timing differences)
      expect(analytics1.economicHealth.gdpPerCapita).toBe(analytics2.economicHealth.gdpPerCapita);
      expect(analytics1.socialHealth.qualityOfLife).toBe(analytics2.socialHealth.qualityOfLife);
      expect(analytics1.infrastructureHealth.overallLevel).toBe(analytics2.infrastructureHealth.overallLevel);
    });
  });

  describe('Edge Cases', () => {
    test('should handle city with no infrastructure', () => {
      const cityWithoutInfra: City = {
        ...sampleCity,
        infrastructure: {}
      };

      const analytics = analyticsEngine.generateCityAnalytics(cityWithoutInfra);
      
      expect(analytics.infrastructureHealth.overallLevel).toBe(0);
      expect(analytics.infrastructureHealth.maintenanceBacklog).toBe(0);
      expect(analytics.infrastructureHealth.priorityUpgrades).toEqual([]);
    });

    test('should handle city with no monthly metrics', () => {
      const cityWithoutMetrics: City = {
        ...sampleCity,
        monthlyMetrics: []
      };

      const analytics = analyticsEngine.generateCityAnalytics(cityWithoutMetrics);
      
      // Should still generate analytics, using defaults for growth calculations
      expect(analytics.economicHealth.economicGrowthRate).toBeDefined();
      expect(typeof analytics.economicHealth.economicGrowthRate).toBe('number');
    });

    test('should handle city with no specialization', () => {
      const cityWithoutSpec: City = {
        ...sampleCity,
        currentSpecialization: undefined,
        specializationHistory: []
      };

      const analytics = analyticsEngine.generateCityAnalytics(cityWithoutSpec);
      
      expect(analytics.economicHealth.competitiveAdvantages).toBeInstanceOf(Array);
      // Should still have some advantages from infrastructure, geography, etc.
    });
  });
});
