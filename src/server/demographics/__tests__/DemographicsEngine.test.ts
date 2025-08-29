/**
 * Demographics Engine Tests
 * 
 * Unit tests for the Demographics & Lifecycle Systems engine
 */

import { DemographicsEngine } from '../DemographicsEngine';
import { CasualtyType, CasualtyCause, PlunderType, TransitionType } from '../types';

describe('DemographicsEngine', () => {
  let engine: DemographicsEngine;

  beforeEach(() => {
    engine = new DemographicsEngine();
  });

  describe('Lifespan Management', () => {
    it('should create a lifespan profile', () => {
      const citizenId = 'citizen_001';
      const birthDate = new Date('1990-01-01');
      
      const profile = engine.createLifespanProfile(citizenId, birthDate);
      
      expect(profile.citizenId).toBe(citizenId);
      expect(profile.birthDate).toEqual(birthDate);
      expect(profile.currentAge).toBeGreaterThan(30);
      expect(profile.lifeExpectancy).toBeGreaterThan(0);
      expect(profile.healthStatus).toBeDefined();
      expect(profile.mortalityRisk).toBeGreaterThanOrEqual(0);
      expect(profile.mortalityRisk).toBeLessThanOrEqual(1);
      expect(profile.lifeStage).toBeDefined();
    });

    it('should update lifespan profile', () => {
      const citizenId = 'citizen_002';
      const birthDate = new Date('1980-01-01');
      
      engine.createLifespanProfile(citizenId, birthDate);
      const updatedProfile = engine.updateLifespanProfile(citizenId);
      
      expect(updatedProfile).toBeDefined();
      expect(updatedProfile!.currentAge).toBeGreaterThan(40);
      expect(updatedProfile!.healthStatus).toBeDefined();
    });

    it('should determine correct life stage', () => {
      const infantId = 'infant_001';
      const adultId = 'adult_001';
      const seniorId = 'senior_001';
      
      const infantProfile = engine.createLifespanProfile(infantId, new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)); // 1 year old
      const adultProfile = engine.createLifespanProfile(adultId, new Date(Date.now() - 35 * 365 * 24 * 60 * 60 * 1000)); // 35 years old
      const seniorProfile = engine.createLifespanProfile(seniorId, new Date(Date.now() - 70 * 365 * 24 * 60 * 60 * 1000)); // 70 years old
      
      expect(infantProfile.lifeStage).toBe('infant');
      expect(adultProfile.lifeStage).toBe('adult');
      expect(seniorProfile.lifeStage).toBe('senior');
    });

    it('should record death', () => {
      const citizenId = 'citizen_003';
      const birthDate = new Date('1950-01-01');
      
      engine.createLifespanProfile(citizenId, birthDate);
      engine.recordDeath(citizenId, 'natural_causes');
      
      const profile = engine.getLifespanProfile(citizenId);
      expect(profile).toBeUndefined();
    });

    it('should get all lifespan profiles', () => {
      engine.createLifespanProfile('citizen_001', new Date('1990-01-01'));
      engine.createLifespanProfile('citizen_002', new Date('1985-01-01'));
      
      const profiles = engine.getAllLifespanProfiles();
      expect(profiles).toHaveLength(2);
    });

    it('should get current population count', () => {
      expect(engine.getCurrentPopulation()).toBe(0);
      
      engine.createLifespanProfile('citizen_001', new Date('1990-01-01'));
      engine.createLifespanProfile('citizen_002', new Date('1985-01-01'));
      
      expect(engine.getCurrentPopulation()).toBe(2);
    });
  });

  describe('Casualty Management', () => {
    it('should record casualty event', () => {
      const casualties = [
        {
          citizenId: 'casualty_001',
          outcome: 'death' as const,
          injuryType: 'trauma' as const,
          severity: 'life_threatening' as const,
          treatmentRequired: true,
          recoveryTime: 0,
          permanentDisability: false,
          economicLoss: 50000
        }
      ];

      const event = engine.recordCasualtyEvent(
        'warfare' as CasualtyType,
        'combat' as CasualtyCause,
        'battlefield',
        casualties
      );

      expect(event.type).toBe('warfare');
      expect(event.cause).toBe('combat');
      expect(event.location).toBe('battlefield');
      expect(event.casualties).toHaveLength(1);
      expect(event.severity).toBeDefined();
      expect(event.responseTime).toBeGreaterThan(0);
      expect(event.economicImpact).toBe(50000);
      expect(event.socialImpact).toBeGreaterThan(0);
    });

    it('should calculate casualty severity correctly', () => {
      const minorCasualties = [
        {
          citizenId: 'minor_001',
          outcome: 'minor_injury' as const,
          injuryType: 'laceration' as const,
          severity: 'minor' as const,
          treatmentRequired: true,
          recoveryTime: 7,
          permanentDisability: false,
          economicLoss: 1000
        }
      ];

      const majorCasualties = Array.from({ length: 15 }, (_, i) => ({
        citizenId: `major_${i}`,
        outcome: 'death' as const,
        injuryType: 'trauma' as const,
        severity: 'life_threatening' as const,
        treatmentRequired: false,
        recoveryTime: 0,
        permanentDisability: false,
        economicLoss: 100000
      }));

      const minorEvent = engine.recordCasualtyEvent('accident', 'vehicle_accident', 'highway', minorCasualties);
      const majorEvent = engine.recordCasualtyEvent('warfare', 'bombing', 'city_center', majorCasualties);

      expect(minorEvent.severity).toBe('minor');
      expect(majorEvent.severity).toBe('catastrophic');
    });

    it('should get casualty events', () => {
      const casualties = [
        {
          citizenId: 'casualty_001',
          outcome: 'minor_injury' as const,
          injuryType: 'burn' as const,
          severity: 'moderate' as const,
          treatmentRequired: true,
          recoveryTime: 14,
          permanentDisability: false,
          economicLoss: 5000
        }
      ];

      engine.recordCasualtyEvent('industrial', 'fire', 'factory', casualties);
      
      const events = engine.getCasualtyEvents();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('industrial');
    });
  });

  describe('Plunder Management', () => {
    it('should record plunder event', () => {
      const event = engine.recordPlunderEvent(
        'conquest' as PlunderType,
        'enemy_fortress',
        'capital_treasury',
        1000000
      );

      expect(event.type).toBe('conquest');
      expect(event.source).toBe('enemy_fortress');
      expect(event.target).toBe('capital_treasury');
      expect(event.totalValue).toBe(1000000);
      expect(event.resources).toBeDefined();
      expect(event.population).toBeDefined();
      expect(event.infrastructure).toBeDefined();
      expect(event.distributionPlan).toBeDefined();
    });

    it('should generate appropriate resource capture', () => {
      const event = engine.recordPlunderEvent('raid', 'merchant_convoy', 'bandit_camp', 500000);
      
      expect(event.resources).toBeInstanceOf(Array);
      expect(event.resources.length).toBeGreaterThan(0);
      
      event.resources.forEach(resource => {
        expect(resource.resourceType).toBeDefined();
        expect(resource.quantity).toBeGreaterThanOrEqual(0);
        expect(resource.quality).toBeGreaterThanOrEqual(0);
        expect(resource.quality).toBeLessThanOrEqual(100);
        expect(resource.value).toBeGreaterThan(0);
        expect(['pristine', 'good', 'damaged', 'destroyed']).toContain(resource.condition);
      });
    });

    it('should get plunder events', () => {
      engine.recordPlunderEvent('tribute', 'vassal_state', 'imperial_treasury', 250000);
      engine.recordPlunderEvent('piracy', 'trade_ship', 'pirate_base', 75000);
      
      const events = engine.getPlunderEvents();
      expect(events).toHaveLength(2);
      expect(events[0].type).toBe('tribute');
      expect(events[1].type).toBe('piracy');
    });
  });

  describe('Demographic Transitions', () => {
    it('should initiate demographic transition', () => {
      const transition = engine.initiateDemo graphicTransition(
        'urbanization' as TransitionType,
        'economic_development',
        50000
      );

      expect(transition.type).toBe('urbanization');
      expect(transition.cause).toBe('economic_development');
      expect(transition.affectedPopulation).toBe(50000);
      expect(transition.demographicChanges).toBeDefined();
      expect(transition.economicImpact).toBeDefined();
      expect(transition.socialImpact).toBeDefined();
      expect(transition.startDate).toBeDefined();
      expect(transition.endDate).toBeUndefined();
    });

    it('should calculate demographic changes', () => {
      const transition = engine.initiateDemo graphicTransition('population_boom', 'healthcare_improvement', 100000);
      
      expect(transition.demographicChanges).toBeInstanceOf(Array);
      expect(transition.demographicChanges.length).toBeGreaterThan(0);
      
      transition.demographicChanges.forEach(change => {
        expect(change.ageGroup).toBeDefined();
        expect(change.gender).toBeDefined();
        expect(change.beforeCount).toBeGreaterThanOrEqual(0);
        expect(change.afterCount).toBeGreaterThanOrEqual(0);
        expect(typeof change.changeRate).toBe('number');
        expect(change.migrationIn).toBeGreaterThanOrEqual(0);
        expect(change.migrationOut).toBeGreaterThanOrEqual(0);
        expect(change.births).toBeGreaterThanOrEqual(0);
        expect(change.deaths).toBeGreaterThanOrEqual(0);
      });
    });

    it('should get demographic transitions', () => {
      engine.initiateDemo graphicTransition('aging_society', 'demographic_transition', 75000);
      engine.initiateDemo graphicTransition('youth_bulge', 'population_boom', 25000);
      
      const transitions = engine.getDemographicTransitions();
      expect(transitions).toHaveLength(2);
      expect(transitions[0].type).toBe('aging_society');
      expect(transitions[1].type).toBe('youth_bulge');
    });
  });

  describe('Analytics Generation', () => {
    beforeEach(() => {
      // Set up test data
      engine.createLifespanProfile('citizen_001', new Date('1990-01-01'));
      engine.createLifespanProfile('citizen_002', new Date('1985-01-01'));
      engine.createLifespanProfile('citizen_003', new Date('1975-01-01'));
      
      engine.recordCasualtyEvent('accident', 'vehicle_accident', 'highway', [
        {
          citizenId: 'casualty_001',
          outcome: 'minor_injury',
          injuryType: 'fracture',
          severity: 'moderate',
          treatmentRequired: true,
          recoveryTime: 30,
          permanentDisability: false,
          economicLoss: 10000
        }
      ]);
      
      engine.recordPlunderEvent('conquest', 'enemy_city', 'treasury', 500000);
      engine.initiateDemo graphicTransition('urbanization', 'economic_development', 10000);
    });

    it('should generate comprehensive analytics', () => {
      const analytics = engine.generateDemographicsAnalytics();
      
      expect(analytics.populationGrowth).toBeDefined();
      expect(analytics.mortalityAnalysis).toBeDefined();
      expect(analytics.casualtyAnalysis).toBeDefined();
      expect(analytics.plunderAnalysis).toBeDefined();
      expect(analytics.demographicProjections).toBeDefined();
      expect(analytics.healthMetrics).toBeDefined();
      expect(analytics.recommendations).toBeDefined();
    });

    it('should generate population growth metrics', () => {
      const analytics = engine.generateDemographicsAnalytics();
      const growth = analytics.populationGrowth;
      
      expect(typeof growth.currentGrowthRate).toBe('number');
      expect(typeof growth.naturalIncrease).toBe('number');
      expect(typeof growth.netMigration).toBe('number');
      expect(typeof growth.doubleTime).toBe('number');
      expect(typeof growth.peakPopulation).toBe('number');
      expect(typeof growth.peakYear).toBe('number');
      
      expect(growth.doubleTime).toBeGreaterThan(0);
      expect(growth.peakPopulation).toBeGreaterThan(engine.getCurrentPopulation());
    });

    it('should generate mortality analysis', () => {
      const analytics = engine.generateDemographicsAnalytics();
      const mortality = analytics.mortalityAnalysis;
      
      expect(mortality.overallTrends).toBeInstanceOf(Array);
      expect(mortality.riskFactors).toBeInstanceOf(Array);
      expect(typeof mortality.preventableDeaths).toBe('number');
      expect(mortality.healthcareGaps).toBeInstanceOf(Array);
      expect(mortality.interventionOpportunities).toBeInstanceOf(Array);
    });

    it('should generate casualty analysis', () => {
      const analytics = engine.generateDemographicsAnalytics();
      const casualties = analytics.casualtyAnalysis;
      
      expect(typeof casualties.totalCasualties).toBe('number');
      expect(typeof casualties.casualtyRate).toBe('number');
      expect(casualties.byType).toBeDefined();
      expect(casualties.byCause).toBeDefined();
      expect(casualties.trends).toBeInstanceOf(Array);
      expect(casualties.hotspots).toBeInstanceOf(Array);
      expect(casualties.preventionOpportunities).toBeInstanceOf(Array);
    });

    it('should generate plunder analysis', () => {
      const analytics = engine.generateDemographicsAnalytics();
      const plunder = analytics.plunderAnalysis;
      
      expect(typeof plunder.totalValue).toBe('number');
      expect(plunder.byType).toBeDefined();
      expect(typeof plunder.efficiency).toBe('number');
      expect(plunder.distribution).toBeDefined();
      expect(plunder.economicImpact).toBeDefined();
      expect(plunder.sustainabilityMetrics).toBeDefined();
    });

    it('should generate demographic projections', () => {
      const analytics = engine.generateDemographicsAnalytics();
      const projections = analytics.demographicProjections;
      
      expect(typeof projections.timeHorizon).toBe('number');
      expect(projections.populationProjection).toBeInstanceOf(Array);
      expect(projections.ageStructureEvolution).toBeInstanceOf(Array);
      expect(projections.dependencyRatioProjection).toBeInstanceOf(Array);
      expect(projections.laborForceProjection).toBeInstanceOf(Array);
      
      expect(projections.timeHorizon).toBeGreaterThan(0);
      expect(projections.populationProjection.length).toBeGreaterThan(0);
    });

    it('should generate health metrics', () => {
      const analytics = engine.generateDemographicsAnalytics();
      const health = analytics.healthMetrics;
      
      expect(typeof health.overallHealthIndex).toBe('number');
      expect(typeof health.lifeExpectancyTrend).toBe('number');
      expect(typeof health.healthcareAccessibility).toBe('number');
      expect(health.diseasePrevalence).toBeInstanceOf(Array);
      expect(typeof health.healthInequality).toBe('number');
      expect(typeof health.preventiveCareUtilization).toBe('number');
      
      expect(health.overallHealthIndex).toBeGreaterThanOrEqual(0);
      expect(health.overallHealthIndex).toBeLessThanOrEqual(100);
    });

    it('should generate recommendations', () => {
      const analytics = engine.generateDemographicsAnalytics();
      const recommendations = analytics.recommendations;
      
      expect(recommendations).toBeInstanceOf(Array);
      expect(recommendations.length).toBeGreaterThan(0);
      
      recommendations.forEach(rec => {
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

  describe('Natural Death Processing', () => {
    it('should process natural death based on mortality risk', () => {
      const citizenId = 'high_risk_citizen';
      const birthDate = new Date('1920-01-01'); // Very old citizen
      
      const profile = engine.createLifespanProfile(citizenId, birthDate);
      
      // High mortality risk should increase chance of natural death
      expect(profile.mortalityRisk).toBeGreaterThan(0.1);
      
      // Test multiple times due to randomness
      let deathOccurred = false;
      for (let i = 0; i < 100; i++) {
        engine.createLifespanProfile(`test_${i}`, new Date('1920-01-01'));
        if (engine.processNaturalDeath(`test_${i}`)) {
          deathOccurred = true;
          break;
        }
      }
      
      // At least one death should occur with very high mortality risk
      expect(deathOccurred).toBe(true);
    });

    it('should not process death for non-existent citizen', () => {
      const result = engine.processNaturalDeath('non_existent_citizen');
      expect(result).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty analytics gracefully', () => {
      const analytics = engine.generateDemographicsAnalytics();
      
      expect(analytics).toBeDefined();
      expect(analytics.populationGrowth).toBeDefined();
      expect(analytics.casualtyAnalysis.totalCasualties).toBe(0);
      expect(analytics.plunderAnalysis.totalValue).toBe(0);
    });

    it('should handle invalid citizen ID for updates', () => {
      const result = engine.updateLifespanProfile('invalid_citizen');
      expect(result).toBeNull();
    });

    it('should handle death recording for non-existent citizen', () => {
      // Should not throw error
      expect(() => {
        engine.recordDeath('non_existent_citizen', 'accident');
      }).not.toThrow();
    });

    it('should handle large casualty events', () => {
      const largeCasualties = Array.from({ length: 1000 }, (_, i) => ({
        citizenId: `mass_casualty_${i}`,
        outcome: 'death' as const,
        injuryType: 'trauma' as const,
        severity: 'life_threatening' as const,
        treatmentRequired: false,
        recoveryTime: 0,
        permanentDisability: false,
        economicLoss: 50000
      }));

      const event = engine.recordCasualtyEvent('disaster', 'natural_disaster', 'affected_region', largeCasualties);
      
      expect(event.casualties).toHaveLength(1000);
      expect(event.severity).toBe('catastrophic');
      expect(event.economicImpact).toBe(50000000); // 1000 * 50000
    });
  });
});
