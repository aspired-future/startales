/**
 * Demographics Analytics Tests
 * 
 * Unit tests for the Demographics Analytics module
 */

import { DemographicsAnalytics } from '../DemographicsAnalytics';
import { 
  LifespanProfile, 
  CasualtyEvent, 
  PlunderEvent, 
  DemographicTransition,
  HealthStatus,
  CasualtyRecord
} from '../types';

describe('DemographicsAnalytics', () => {
  let analytics: DemographicsAnalytics;

  beforeEach(() => {
    analytics = new DemographicsAnalytics();
  });

  // Helper function to create mock lifespan profiles
  const createMockProfile = (citizenId: string, age: number, healthScore: number = 75): LifespanProfile => {
    const birthDate = new Date(Date.now() - age * 365 * 24 * 60 * 60 * 1000);
    const healthStatus: HealthStatus = {
      physicalHealth: healthScore,
      mentalHealth: healthScore,
      chronicConditions: [],
      healthcareAccess: 70,
      lastCheckup: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
      medicalHistory: []
    };

    return {
      citizenId,
      birthDate,
      currentAge: age,
      lifeExpectancy: 78 - (age * 0.1),
      healthStatus,
      mortalityRisk: age > 65 ? 0.05 : 0.01,
      lifeStage: age < 18 ? 'child' : age < 65 ? 'adult' : 'senior',
      dependents: [],
      caregivers: []
    };
  };

  // Helper function to create mock casualty events
  const createMockCasualtyEvent = (type: string, casualties: number): CasualtyEvent => {
    const casualtyRecords: CasualtyRecord[] = Array.from({ length: casualties }, (_, i) => ({
      citizenId: `casualty_${i}`,
      outcome: i < casualties * 0.1 ? 'death' : 'minor_injury',
      injuryType: 'trauma',
      severity: 'moderate',
      treatmentRequired: true,
      recoveryTime: 14,
      permanentDisability: false,
      economicLoss: 5000
    }));

    return {
      eventId: `event_${Date.now()}`,
      timestamp: new Date(),
      type: type as any,
      cause: 'accident' as any,
      location: 'test_location',
      casualties: casualtyRecords,
      severity: 'moderate' as any,
      responseTime: 15,
      economicImpact: casualties * 5000,
      socialImpact: casualties * 100
    };
  };

  // Helper function to create mock plunder events
  const createMockPlunderEvent = (type: string, value: number): PlunderEvent => ({
    eventId: `plunder_${Date.now()}`,
    timestamp: new Date(),
    type: type as any,
    source: 'test_source',
    target: 'test_target',
    resources: [],
    population: {
      totalCaptured: 100,
      demographics: [],
      slaves: 20,
      prisoners: 10,
      refugees: 60,
      collaborators: 10
    },
    infrastructure: {
      buildings: [],
      technology: [],
      knowledge: [],
      culturalAssets: {
        artworks: 10,
        historicalArtifacts: 5,
        culturalKnowledge: [],
        languages: [],
        traditions: [],
        value: value * 0.1
      }
    },
    totalValue: value,
    distributionPlan: {
      government: 30,
      military: 25,
      nobles: 20,
      merchants: 10,
      citizens: 10,
      infrastructure: 3,
      reserves: 2
    }
  });

  describe('Population Growth Analysis', () => {
    it('should analyze population growth metrics', () => {
      const profiles = [
        createMockProfile('citizen_001', 25),
        createMockProfile('citizen_002', 35),
        createMockProfile('citizen_003', 45),
        createMockProfile('citizen_004', 55),
        createMockProfile('citizen_005', 65)
      ];

      const result = analytics.analyzePopulationGrowth(profiles, []);

      expect(result.currentGrowthRate).toBeDefined();
      expect(typeof result.currentGrowthRate).toBe('number');
      expect(result.naturalIncrease).toBeDefined();
      expect(result.netMigration).toBeDefined();
      expect(result.doubleTime).toBeGreaterThan(0);
      expect(result.peakPopulation).toBeGreaterThan(profiles.length);
      expect(result.peakYear).toBeGreaterThan(new Date().getFullYear());
    });

    it('should handle empty population', () => {
      const result = analytics.analyzePopulationGrowth([], []);

      expect(result.currentGrowthRate).toBeDefined();
      expect(result.doubleTime).toBeDefined();
      expect(result.peakPopulation).toBeDefined();
    });

    it('should calculate birth and death rates', () => {
      const profiles = [
        createMockProfile('young_001', 25),
        createMockProfile('young_002', 30),
        createMockProfile('old_001', 75),
        createMockProfile('old_002', 80)
      ];

      const result = analytics.analyzePopulationGrowth(profiles, []);

      // Should have positive natural increase due to young population
      expect(result.naturalIncrease).toBeDefined();
      expect(typeof result.naturalIncrease).toBe('number');
    });
  });

  describe('Mortality Analysis', () => {
    it('should analyze mortality patterns', () => {
      const profiles = [
        createMockProfile('healthy_001', 40, 90),
        createMockProfile('unhealthy_001', 60, 50),
        createMockProfile('elderly_001', 75, 60)
      ];

      const casualtyEvents = [
        createMockCasualtyEvent('accident', 5),
        createMockCasualtyEvent('disease', 3)
      ];

      const result = analytics.analyzeMortality(profiles, casualtyEvents);

      expect(result.overallTrends).toBeInstanceOf(Array);
      expect(result.riskFactors).toBeInstanceOf(Array);
      expect(typeof result.preventableDeaths).toBe('number');
      expect(result.healthcareGaps).toBeInstanceOf(Array);
      expect(result.interventionOpportunities).toBeInstanceOf(Array);

      expect(result.preventableDeaths).toBeGreaterThanOrEqual(0);
      expect(result.healthcareGaps.length).toBeGreaterThan(0);
    });

    it('should identify healthcare gaps', () => {
      const profiles = [
        createMockProfile('low_access_001', 45, 70),
        createMockProfile('low_access_002', 50, 65)
      ];

      // Simulate low healthcare access
      profiles.forEach(profile => {
        profile.healthStatus.healthcareAccess = 40;
      });

      const result = analytics.analyzeMortality(profiles, []);

      expect(result.healthcareGaps.length).toBeGreaterThan(0);
      const preventiveCareGap = result.healthcareGaps.find(gap => gap.service === 'preventive_care');
      expect(preventiveCareGap).toBeDefined();
      expect(preventiveCareGap!.priority).toBe('critical');
    });

    it('should calculate risk factors', () => {
      const profiles = [
        createMockProfile('chronic_001', 55, 60),
        createMockProfile('chronic_002', 60, 55)
      ];

      // Add chronic conditions
      profiles[0].healthStatus.chronicConditions = [
        {
          conditionId: 'diabetes_001',
          name: 'diabetes',
          severity: 'moderate',
          diagnosisDate: new Date(),
          treatmentStatus: 'managed',
          mortalityImpact: 0.02
        }
      ];

      profiles[1].healthStatus.chronicConditions = [
        {
          conditionId: 'hypertension_001',
          name: 'hypertension',
          severity: 'mild',
          diagnosisDate: new Date(),
          treatmentStatus: 'controlled',
          mortalityImpact: 0.01
        }
      ];

      const result = analytics.analyzeMortality(profiles, []);

      expect(result.riskFactors.length).toBeGreaterThan(0);
      const diabetesRisk = result.riskFactors.find(risk => risk.factor === 'diabetes');
      expect(diabetesRisk).toBeDefined();
      expect(diabetesRisk!.prevalence).toBe(50); // 1 out of 2 profiles
    });
  });

  describe('Casualty Analysis', () => {
    it('should analyze casualty patterns', () => {
      const casualtyEvents = [
        createMockCasualtyEvent('accident', 10),
        createMockCasualtyEvent('crime', 5),
        createMockCasualtyEvent('disaster', 20)
      ];

      const result = analytics.analyzeCasualties(casualtyEvents);

      expect(result.totalCasualties).toBe(35);
      expect(result.casualtyRate).toBeGreaterThan(0);
      expect(result.byType).toBeDefined();
      expect(result.byCause).toBeDefined();
      expect(result.trends).toBeInstanceOf(Array);
      expect(result.hotspots).toBeInstanceOf(Array);
      expect(result.preventionOpportunities).toBeInstanceOf(Array);

      expect(result.byType['accident']).toBe(10);
      expect(result.byType['crime']).toBe(5);
      expect(result.byType['disaster']).toBe(20);
    });

    it('should identify casualty hotspots', () => {
      const casualtyEvents = [
        { ...createMockCasualtyEvent('accident', 25), location: 'downtown' },
        { ...createMockCasualtyEvent('crime', 30), location: 'downtown' },
        { ...createMockCasualtyEvent('accident', 5), location: 'suburbs' }
      ];

      const result = analytics.analyzeCasualties(casualtyEvents);

      expect(result.hotspots.length).toBeGreaterThan(0);
      const downtownHotspot = result.hotspots.find(spot => spot.location === 'downtown');
      expect(downtownHotspot).toBeDefined();
      expect(downtownHotspot!.riskLevel).toBe('extreme');
      expect(downtownHotspot!.interventionNeeded).toBe(true);
    });

    it('should suggest prevention opportunities', () => {
      const casualtyEvents = [
        createMockCasualtyEvent('accident', 15),
        createMockCasualtyEvent('industrial', 10)
      ];

      const result = analytics.analyzeCasualties(casualtyEvents);

      expect(result.preventionOpportunities.length).toBeGreaterThan(0);
      const safetyTraining = result.preventionOpportunities.find(
        opp => opp.measure === 'safety_training'
      );
      expect(safetyTraining).toBeDefined();
      expect(safetyTraining!.targetCasualties).toContain('accident');
    });

    it('should handle empty casualty data', () => {
      const result = analytics.analyzeCasualties([]);

      expect(result.totalCasualties).toBe(0);
      expect(result.casualtyRate).toBe(0);
      expect(result.byType).toEqual({});
      expect(result.byCause).toEqual({});
      expect(result.trends).toBeInstanceOf(Array);
      expect(result.hotspots).toBeInstanceOf(Array);
    });
  });

  describe('Plunder Analysis', () => {
    it('should analyze plunder patterns', () => {
      const plunderEvents = [
        createMockPlunderEvent('conquest', 1000000),
        createMockPlunderEvent('raid', 500000),
        createMockPlunderEvent('tribute', 750000)
      ];

      const result = analytics.analyzePlunder(plunderEvents);

      expect(result.totalValue).toBe(2250000);
      expect(result.byType).toBeDefined();
      expect(result.efficiency).toBeGreaterThan(0);
      expect(result.distribution).toBeDefined();
      expect(result.economicImpact).toBeDefined();
      expect(result.sustainabilityMetrics).toBeDefined();

      expect(result.byType['conquest']).toBe(1000000);
      expect(result.byType['raid']).toBe(500000);
      expect(result.byType['tribute']).toBe(750000);
    });

    it('should calculate plunder efficiency', () => {
      const plunderEvents = [
        createMockPlunderEvent('conquest', 2000000),
        createMockPlunderEvent('raid', 100000)
      ];

      const result = analytics.analyzePlunder(plunderEvents);

      expect(result.efficiency).toBeGreaterThan(0);
      expect(result.efficiency).toBeLessThanOrEqual(50); // Reasonable upper bound
    });

    it('should analyze distribution patterns', () => {
      const plunderEvents = [
        createMockPlunderEvent('conquest', 1000000)
      ];

      const result = analytics.analyzePlunder(plunderEvents);

      expect(result.distribution.inequality).toBeGreaterThan(0);
      expect(result.distribution.inequality).toBeLessThanOrEqual(1);
      expect(result.distribution.concentrationRatio).toBeGreaterThan(0);
      expect(result.distribution.beneficiaryGroups).toContain('government');
      expect(result.distribution.socialTension).toBeGreaterThan(0);
    });

    it('should handle empty plunder data', () => {
      const result = analytics.analyzePlunder([]);

      expect(result.totalValue).toBe(0);
      expect(result.byType).toEqual({});
      expect(result.efficiency).toBe(0);
      expect(result.distribution.inequality).toBe(0.5);
      expect(result.distribution.beneficiaryGroups).toEqual([]);
    });
  });

  describe('Demographic Projections', () => {
    it('should generate demographic projections', () => {
      const profiles = [
        createMockProfile('citizen_001', 25),
        createMockProfile('citizen_002', 35),
        createMockProfile('citizen_003', 45),
        createMockProfile('citizen_004', 55),
        createMockProfile('citizen_005', 65)
      ];

      const transitions: DemographicTransition[] = [];

      const result = analytics.generateDemographicProjections(profiles, transitions);

      expect(result.timeHorizon).toBe(50);
      expect(result.populationProjection).toBeInstanceOf(Array);
      expect(result.ageStructureEvolution).toBeInstanceOf(Array);
      expect(result.dependencyRatioProjection).toBeInstanceOf(Array);
      expect(result.laborForceProjection).toBeInstanceOf(Array);

      expect(result.populationProjection.length).toBeGreaterThan(0);
      expect(result.ageStructureEvolution.length).toBeGreaterThan(0);
      expect(result.dependencyRatioProjection.length).toBeGreaterThan(0);
      expect(result.laborForceProjection.length).toBeGreaterThan(0);
    });

    it('should project population growth', () => {
      const profiles = [
        createMockProfile('citizen_001', 30),
        createMockProfile('citizen_002', 35)
      ];

      const result = analytics.generateDemographicProjections(profiles, []);

      const firstProjection = result.populationProjection[0];
      const lastProjection = result.populationProjection[result.populationProjection.length - 1];

      expect(firstProjection.totalPopulation).toBeGreaterThan(0);
      expect(lastProjection.totalPopulation).toBeGreaterThan(firstProjection.totalPopulation);
      expect(firstProjection.year).toBeLessThan(lastProjection.year);
    });

    it('should project age structure evolution', () => {
      const profiles = [
        createMockProfile('young_001', 20),
        createMockProfile('adult_001', 40),
        createMockProfile('senior_001', 70)
      ];

      const result = analytics.generateDemographicProjections(profiles, []);

      const firstStructure = result.ageStructureEvolution[0];
      const lastStructure = result.ageStructureEvolution[result.ageStructureEvolution.length - 1];

      expect(firstStructure.ageGroups['0-14']).toBeGreaterThan(lastStructure.ageGroups['0-14']);
      expect(firstStructure.ageGroups['65+']).toBeLessThan(lastStructure.ageGroups['65+']);
      expect(lastStructure.medianAge).toBeGreaterThan(firstStructure.medianAge);
    });

    it('should project dependency ratios', () => {
      const profiles = [
        createMockProfile('citizen_001', 25),
        createMockProfile('citizen_002', 45)
      ];

      const result = analytics.generateDemographicProjections(profiles, []);

      const firstRatio = result.dependencyRatioProjection[0];
      const lastRatio = result.dependencyRatioProjection[result.dependencyRatioProjection.length - 1];

      expect(firstRatio.totalDependencyRatio).toBeGreaterThan(0);
      expect(lastRatio.elderlyDependencyRatio).toBeGreaterThan(firstRatio.elderlyDependencyRatio);
      expect(firstRatio.youthDependencyRatio).toBeGreaterThan(lastRatio.youthDependencyRatio);
    });

    it('should project labor force changes', () => {
      const profiles = [
        createMockProfile('worker_001', 30),
        createMockProfile('worker_002', 40)
      ];

      const result = analytics.generateDemographicProjections(profiles, []);

      const firstLabor = result.laborForceProjection[0];
      const lastLabor = result.laborForceProjection[result.laborForceProjection.length - 1];

      expect(firstLabor.laborForceSize).toBeGreaterThan(0);
      expect(lastLabor.participationRate).toBeGreaterThan(firstLabor.participationRate);
      expect(lastLabor.skillDistribution.high).toBeGreaterThan(firstLabor.skillDistribution.high);
      expect(lastLabor.productivityIndex).toBeGreaterThan(firstLabor.productivityIndex);
    });
  });

  describe('Health Metrics', () => {
    it('should calculate health metrics', () => {
      const profiles = [
        createMockProfile('healthy_001', 30, 85),
        createMockProfile('average_001', 40, 70),
        createMockProfile('unhealthy_001', 50, 55)
      ];

      const result = analytics.calculateHealthMetrics(profiles);

      expect(result.overallHealthIndex).toBeGreaterThan(0);
      expect(result.overallHealthIndex).toBeLessThanOrEqual(100);
      expect(result.lifeExpectancyTrend).toBe(0.2);
      expect(result.healthcareAccessibility).toBeGreaterThan(0);
      expect(result.diseasePrevalence).toBeInstanceOf(Array);
      expect(result.healthInequality).toBeGreaterThan(0);
      expect(result.preventiveCareUtilization).toBeGreaterThanOrEqual(0);
      expect(result.preventiveCareUtilization).toBeLessThanOrEqual(100);
    });

    it('should handle empty population for health metrics', () => {
      const result = analytics.calculateHealthMetrics([]);

      expect(result.overallHealthIndex).toBe(75);
      expect(result.lifeExpectancyTrend).toBe(0.2);
      expect(result.healthcareAccessibility).toBe(60);
      expect(result.diseasePrevalence).toEqual([]);
      expect(result.healthInequality).toBe(15);
      expect(result.preventiveCareUtilization).toBe(45);
    });

    it('should calculate health inequality', () => {
      const profiles = [
        createMockProfile('very_healthy', 30, 95),
        createMockProfile('very_unhealthy', 30, 25)
      ];

      const result = analytics.calculateHealthMetrics(profiles);

      expect(result.healthInequality).toBeGreaterThan(30); // High inequality due to large health gap
    });

    it('should calculate preventive care utilization', () => {
      const profiles = [
        createMockProfile('recent_checkup', 40, 75),
        createMockProfile('old_checkup', 40, 75)
      ];

      // Set recent checkup for first profile
      profiles[0].healthStatus.lastCheckup = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 1 month ago
      // Set old checkup for second profile
      profiles[1].healthStatus.lastCheckup = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000); // Over 1 year ago

      const result = analytics.calculateHealthMetrics(profiles);

      expect(result.preventiveCareUtilization).toBe(50); // 1 out of 2 had recent checkup
    });

    it('should analyze disease prevalence', () => {
      const profiles = [
        createMockProfile('diabetic', 50, 65),
        createMockProfile('hypertensive', 55, 70),
        createMockProfile('healthy', 45, 85)
      ];

      // Add chronic conditions
      profiles[0].healthStatus.chronicConditions = [
        {
          conditionId: 'diabetes_001',
          name: 'diabetes',
          severity: 'moderate',
          diagnosisDate: new Date(),
          treatmentStatus: 'managed',
          mortalityImpact: 0.02
        }
      ];

      profiles[1].healthStatus.chronicConditions = [
        {
          conditionId: 'hypertension_001',
          name: 'hypertension',
          severity: 'mild',
          diagnosisDate: new Date(),
          treatmentStatus: 'controlled',
          mortalityImpact: 0.01
        }
      ];

      const result = analytics.calculateHealthMetrics(profiles);

      expect(result.diseasePrevalence.length).toBe(2);
      const diabetes = result.diseasePrevalence.find(d => d.disease === 'diabetes');
      const hypertension = result.diseasePrevalence.find(d => d.disease === 'hypertension');

      expect(diabetes).toBeDefined();
      expect(diabetes!.prevalence).toBeCloseTo(33.33, 1); // 1 out of 3
      expect(hypertension).toBeDefined();
      expect(hypertension!.prevalence).toBeCloseTo(33.33, 1); // 1 out of 3
    });
  });

  describe('Recommendations Generation', () => {
    it('should generate healthcare recommendations', () => {
      const profiles = [
        createMockProfile('low_access_001', 40, 70),
        createMockProfile('low_access_002', 45, 65)
      ];

      // Set low healthcare access
      profiles.forEach(profile => {
        profile.healthStatus.healthcareAccess = 50;
      });

      const result = analytics.generateRecommendations(profiles, [], []);

      const healthcareRec = result.find(rec => rec.category === 'healthcare');
      expect(healthcareRec).toBeDefined();
      expect(healthcareRec!.priority).toBe('high');
      expect(healthcareRec!.title).toContain('Healthcare');
    });

    it('should generate mortality reduction recommendations', () => {
      const profiles = [
        createMockProfile('high_risk_001', 70, 50),
        createMockProfile('high_risk_002', 75, 45)
      ];

      // Set high mortality risk
      profiles.forEach(profile => {
        profile.mortalityRisk = 0.15;
      });

      const result = analytics.generateRecommendations(profiles, [], []);

      const mortalityRec = result.find(rec => rec.category === 'mortality_reduction');
      expect(mortalityRec).toBeDefined();
      expect(mortalityRec!.priority).toBe('critical');
    });

    it('should generate casualty prevention recommendations', () => {
      const casualtyEvents = [
        createMockCasualtyEvent('accident', 10),
        createMockCasualtyEvent('accident', 15),
        createMockCasualtyEvent('accident', 20)
      ];

      const result = analytics.generateRecommendations([], casualtyEvents, []);

      const casualtyRec = result.find(rec => rec.category === 'casualty_prevention');
      expect(casualtyRec).toBeDefined();
      expect(casualtyRec!.priority).toBe('high');
    });

    it('should generate population growth recommendations', () => {
      const profiles = [
        createMockProfile('elderly_001', 70, 70),
        createMockProfile('elderly_002', 75, 65),
        createMockProfile('elderly_003', 80, 60)
      ];

      const result = analytics.generateRecommendations(profiles, [], []);

      const populationRec = result.find(rec => rec.category === 'population_growth');
      expect(populationRec).toBeDefined();
      expect(populationRec!.priority).toBe('medium');
    });

    it('should generate public health recommendations', () => {
      const profiles = [
        createMockProfile('chronic_001', 50, 60),
        createMockProfile('chronic_002', 55, 65)
      ];

      // Add chronic conditions to majority of population
      profiles.forEach(profile => {
        profile.healthStatus.chronicConditions = [
          {
            conditionId: 'condition_001',
            name: 'chronic_disease',
            severity: 'moderate',
            diagnosisDate: new Date(),
            treatmentStatus: 'managed',
            mortalityImpact: 0.02
          }
        ];
      });

      const result = analytics.generateRecommendations(profiles, [], []);

      const publicHealthRec = result.find(rec => rec.category === 'public_health');
      expect(publicHealthRec).toBeDefined();
      expect(publicHealthRec!.priority).toBe('medium');
    });

    it('should sort recommendations by priority', () => {
      const profiles = [
        createMockProfile('high_risk', 70, 40), // Will trigger mortality reduction (critical)
        createMockProfile('low_access', 40, 70)  // Will trigger healthcare (high)
      ];

      profiles[0].mortalityRisk = 0.15; // High mortality risk
      profiles[1].healthStatus.healthcareAccess = 50; // Low healthcare access

      const result = analytics.generateRecommendations(profiles, [], []);

      expect(result.length).toBeGreaterThan(1);
      
      // Check that critical priority comes before high priority
      const priorities = result.map(rec => rec.priority);
      const criticalIndex = priorities.indexOf('critical');
      const highIndex = priorities.indexOf('high');
      
      if (criticalIndex !== -1 && highIndex !== -1) {
        expect(criticalIndex).toBeLessThan(highIndex);
      }
    });

    it('should include all required recommendation fields', () => {
      const profiles = [createMockProfile('test', 40, 60)];
      profiles[0].healthStatus.healthcareAccess = 50;

      const result = analytics.generateRecommendations(profiles, [], []);

      expect(result.length).toBeGreaterThan(0);
      
      result.forEach(rec => {
        expect(rec.category).toBeDefined();
        expect(['low', 'medium', 'high', 'critical']).toContain(rec.priority);
        expect(rec.title).toBeDefined();
        expect(rec.description).toBeDefined();
        expect(rec.expectedImpact).toBeDefined();
        expect(typeof rec.cost).toBe('number');
        expect(rec.timeframe).toBeDefined();
        expect(typeof rec.feasibility).toBe('number');
        expect(['low', 'medium', 'high']).toContain(rec.riskLevel);
        
        expect(rec.cost).toBeGreaterThanOrEqual(0);
        expect(rec.feasibility).toBeGreaterThanOrEqual(0);
        expect(rec.feasibility).toBeLessThanOrEqual(100);
      });
    });
  });
});
