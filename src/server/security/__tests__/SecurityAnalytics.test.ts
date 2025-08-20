/**
 * Security Analytics Tests
 * Tests for security analytics and reporting functionality
 */

import { SecurityAnalytics } from '../SecurityAnalytics.js';
import { SecurityEngine } from '../SecurityEngine.js';
import { PoliceForce, NationalGuard, Prison, SecurityEvent } from '../types.js';

describe('SecurityAnalytics', () => {
  let analytics: SecurityAnalytics;
  let engine: SecurityEngine;

  beforeEach(() => {
    analytics = new SecurityAnalytics();
    engine = new SecurityEngine();
  });

  describe('Security Metrics Calculation', () => {
    it('should calculate security metrics for empty systems', () => {
      const metrics = analytics.calculateSecurityMetrics([], [], []);

      expect(metrics.policeEffectiveness).toBe(0);
      expect(metrics.guardReadiness).toBe(0);
      expect(metrics.prisonSecurity).toBe(0);
      expect(metrics.overallSafety).toBe(0);
      expect(metrics.budgetUtilization).toBe(0);
      expect(metrics.personnelEfficiency).toBe(0);
      expect(metrics.publicTrust).toBe(50); // Default when no police forces
      expect(metrics.systemResilience).toBeGreaterThan(0);
    });

    it('should calculate metrics with populated systems', () => {
      // Create test data
      const police = engine.createPoliceForce('city_001', 'Test Police', 'Local', 'City', 1000000);
      const guard = engine.createNationalGuard('Test Guard', 2000000);
      const prison = engine.createPrison('Test Prison', 'Civilian', 100, 'Medium', 500000);

      // Add some personnel to test personnel efficiency
      engine.hireOfficer(police.id, 'Officer Test', 'Officer');
      engine.enlistGuardMember(guard.id, 'Guard Test', 'Private');

      const policeForces = [engine.getPoliceForce(police.id)!];
      const nationalGuards = [engine.getNationalGuard(guard.id)!];
      const prisons = [engine.getPrison(prison.id)!];

      const metrics = analytics.calculateSecurityMetrics(policeForces, nationalGuards, prisons);

      expect(metrics.policeEffectiveness).toBeGreaterThan(0);
      expect(metrics.guardReadiness).toBeGreaterThan(0);
      expect(metrics.prisonSecurity).toBeGreaterThan(0);
      expect(metrics.overallSafety).toBeGreaterThan(0);
      expect(metrics.budgetUtilization).toBeGreaterThan(0);
      expect(metrics.personnelEfficiency).toBeGreaterThan(0);
      expect(metrics.publicTrust).toBeGreaterThan(0);
      expect(metrics.systemResilience).toBeGreaterThan(0);
    });

    it('should handle high corruption scenarios', () => {
      const police = engine.createPoliceForce('city_001', 'Corrupt Police', 'Local', 'City', 1000000);
      const force = engine.getPoliceForce(police.id)!;
      
      // Simulate high corruption
      force.corruption = 80;
      
      const metrics = analytics.calculateSecurityMetrics([force], [], []);
      
      expect(metrics.publicTrust).toBeLessThan(50);
      expect(metrics.policeEffectiveness).toBeLessThan(50);
    });
  });

  describe('Threat Assessment', () => {
    it('should assess threat levels based on events and performance', () => {
      const police = engine.createPoliceForce('city_001', 'Test Police', 'Local', 'City', 1000000);
      const guard = engine.createNationalGuard('Test Guard', 2000000);
      const prison = engine.createPrison('Test Prison', 'Civilian', 100, 'Medium', 500000);

      // Create security events
      const events: SecurityEvent[] = [
        {
          id: '1',
          type: 'Crime',
          location: 'Downtown',
          severity: 'High',
          description: 'Armed robbery',
          response: 'Investigating',
          resolved: false,
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'Corruption',
          location: 'Police Station',
          severity: 'Medium',
          description: 'Bribery allegation',
          response: 'Under review',
          resolved: false,
          timestamp: new Date()
        }
      ];

      const assessment = analytics.assessThreat(
        [engine.getPoliceForce(police.id)!],
        [engine.getNationalGuard(guard.id)!],
        [engine.getPrison(prison.id)!],
        events
      );

      expect(assessment.crimeLevel).toBeDefined();
      expect(['Low', 'Medium', 'High', 'Critical']).toContain(assessment.crimeLevel);
      expect(assessment.securityGaps).toBeDefined();
      expect(assessment.vulnerabilities).toBeDefined();
      expect(assessment.riskFactors).toBeDefined();
      expect(assessment.mitigation).toBeDefined();
    });

    it('should escalate threat level with many crime events', () => {
      const police = engine.createPoliceForce('city_001', 'Overwhelmed Police', 'Local', 'City', 1000000);
      const force = engine.getPoliceForce(police.id)!;
      
      // Simulate poor performance
      force.performance.crimeReduction = 30;

      // Create many crime events
      const events: SecurityEvent[] = Array.from({ length: 25 }, (_, i) => ({
        id: `crime_${i}`,
        type: 'Crime',
        location: `Location ${i}`,
        severity: 'High',
        description: `Crime ${i}`,
        response: 'Investigating',
        resolved: false,
        timestamp: new Date()
      }));

      const assessment = analytics.assessThreat([force], [], [], events);
      
      expect(assessment.crimeLevel).toBe('Critical');
      expect(assessment.securityGaps.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Trends Analysis', () => {
    it('should generate performance trends', () => {
      const police = engine.createPoliceForce('city_001', 'Test Police', 'Local', 'City', 1000000);
      const prison = engine.createPrison('Test Prison', 'Civilian', 100, 'Medium', 500000);

      const trends = analytics.analyzePerformanceTrends(
        [engine.getPoliceForce(police.id)!],
        [engine.getPrison(prison.id)!]
      );

      expect(trends.crimeReduction).toHaveLength(12);
      expect(trends.responseTime).toHaveLength(12);
      expect(trends.clearanceRate).toHaveLength(12);
      expect(trends.recidivism).toHaveLength(12);
      expect(trends.corruption).toHaveLength(12);
      expect(trends.publicSafety).toHaveLength(12);

      // Check that all values are within reasonable ranges
      trends.crimeReduction.forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Resource Allocation Analysis', () => {
    it('should analyze resource allocation', () => {
      const police = engine.createPoliceForce('city_001', 'Test Police', 'Local', 'City', 1000000);
      const guard = engine.createNationalGuard('Test Guard', 2000000);
      const prison = engine.createPrison('Test Prison', 'Civilian', 100, 'Medium', 500000);

      const allocation = analytics.analyzeResourceAllocation(
        [engine.getPoliceForce(police.id)!],
        [engine.getNationalGuard(guard.id)!],
        [engine.getPrison(prison.id)!]
      );

      expect(allocation.policeAllocation).toBeCloseTo(28.57, 1); // 1M out of 3.5M
      expect(allocation.guardAllocation).toBeCloseTo(57.14, 1); // 2M out of 3.5M
      expect(allocation.prisonAllocation).toBeCloseTo(14.29, 1); // 0.5M out of 3.5M
      expect(allocation.optimalDistribution).toBeDefined();
      expect(allocation.efficiency).toBeGreaterThanOrEqual(0);
      expect(allocation.efficiency).toBeLessThanOrEqual(100);
    });

    it('should handle single system allocation', () => {
      const police = engine.createPoliceForce('city_001', 'Only Police', 'Local', 'City', 1000000);

      const allocation = analytics.analyzeResourceAllocation(
        [engine.getPoliceForce(police.id)!],
        [],
        []
      );

      expect(allocation.policeAllocation).toBe(100);
      expect(allocation.guardAllocation).toBe(0);
      expect(allocation.prisonAllocation).toBe(0);
    });
  });

  describe('Security Health Assessment', () => {
    it('should assess overall security health', () => {
      const police = engine.createPoliceForce('city_001', 'Test Police', 'Local', 'City', 1000000);
      const guard = engine.createNationalGuard('Test Guard', 2000000);
      const prison = engine.createPrison('Test Prison', 'Civilian', 100, 'Medium', 500000);

      const health = analytics.assessSecurityHealth(
        [engine.getPoliceForce(police.id)!],
        [engine.getNationalGuard(guard.id)!],
        [engine.getPrison(prison.id)!]
      );

      expect(health.overall).toBeGreaterThanOrEqual(0);
      expect(health.overall).toBeLessThanOrEqual(100);
      expect(health.components.lawEnforcement).toBeGreaterThanOrEqual(0);
      expect(health.components.nationalSecurity).toBeGreaterThanOrEqual(0);
      expect(health.components.corrections).toBeGreaterThanOrEqual(0);
      expect(health.components.publicSafety).toBeGreaterThanOrEqual(0);
      expect(['Excellent', 'Good', 'Fair', 'Poor', 'Critical']).toContain(health.status);
      expect(Array.isArray(health.concerns)).toBe(true);
    });

    it('should identify health concerns for poor performance', () => {
      const police = engine.createPoliceForce('city_001', 'Poor Police', 'Local', 'City', 1000000);
      const force = engine.getPoliceForce(police.id)!;
      
      // Simulate poor performance
      force.performance.crimeReduction = 30;
      force.corruption = 40;

      const health = analytics.assessSecurityHealth([force], [], []);
      
      expect(health.overall).toBeLessThan(60);
      expect(health.status).toMatch(/Poor|Critical/);
      expect(health.concerns.length).toBeGreaterThan(0);
      expect(health.concerns.some(c => c.includes('performance'))).toBe(true);
    });
  });

  describe('Optimization Recommendations', () => {
    it('should generate recommendations for system improvements', () => {
      const police = engine.createPoliceForce('city_001', 'Test Police', 'Local', 'City', 1000000);
      const guard = engine.createNationalGuard('Test Guard', 2000000);
      const prison = engine.createPrison('Test Prison', 'Civilian', 100, 'Medium', 500000);

      // Simulate various issues
      const force = engine.getPoliceForce(police.id)!;
      force.performance.crimeReduction = 40; // Below 60 threshold
      force.corruption = 30; // Above 25 threshold
      force.performance.responseTime = 15; // Above 12 threshold

      const guardUnit = engine.getNationalGuard(guard.id)!;
      guardUnit.readiness = 60; // Below 75 threshold

      const prisonFacility = engine.getPrison(prison.id)!;
      prisonFacility.performance.overcrowding = 20; // Above 15 threshold
      prisonFacility.performance.rehabilitation = 40; // Below 50 threshold

      const recommendations = analytics.generateOptimizationRecommendations(
        [force],
        [guardUnit],
        [prisonFacility]
      );

      expect(recommendations.length).toBeGreaterThan(0);
      
      // Check for specific recommendation types
      const trainingRecs = recommendations.filter(r => r.type === 'Personnel Training');
      const policyRecs = recommendations.filter(r => r.type === 'Policy Change');
      const equipmentRecs = recommendations.filter(r => r.type === 'Equipment Upgrade');
      const facilityRecs = recommendations.filter(r => r.type === 'Facility Improvement');
      const programRecs = recommendations.filter(r => r.type === 'Program Expansion');

      expect(trainingRecs.length).toBeGreaterThan(0);
      expect(policyRecs.length).toBeGreaterThan(0);
      expect(equipmentRecs.length).toBeGreaterThan(0);
      expect(facilityRecs.length).toBeGreaterThan(0);
      expect(programRecs.length).toBeGreaterThan(0);

      // Check recommendation structure
      recommendations.forEach(rec => {
        expect(rec.type).toBeDefined();
        expect(['Low', 'Medium', 'High', 'Critical']).toContain(rec.priority);
        expect(rec.description).toBeDefined();
        expect(rec.impact).toBeDefined();
        expect(rec.cost).toBeGreaterThan(0);
        expect(rec.timeframe).toBeDefined();
      });

      // Check that recommendations are sorted by priority
      const priorities = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      for (let i = 1; i < recommendations.length; i++) {
        const prevPriority = priorities[recommendations[i-1].priority as keyof typeof priorities];
        const currPriority = priorities[recommendations[i].priority as keyof typeof priorities];
        expect(prevPriority).toBeGreaterThanOrEqual(currPriority);
      }
    });

    it('should generate no recommendations for well-performing systems', () => {
      const police = engine.createPoliceForce('city_001', 'Excellent Police', 'Local', 'City', 1000000);
      const guard = engine.createNationalGuard('Excellent Guard', 2000000);
      const prison = engine.createPrison('Excellent Prison', 'Civilian', 100, 'Medium', 500000);

      // Simulate excellent performance
      const force = engine.getPoliceForce(police.id)!;
      force.performance.crimeReduction = 90;
      force.corruption = 5;
      force.performance.responseTime = 5;

      const guardUnit = engine.getNationalGuard(guard.id)!;
      guardUnit.readiness = 95;

      const prisonFacility = engine.getPrison(prison.id)!;
      prisonFacility.performance.overcrowding = 5;
      prisonFacility.performance.rehabilitation = 80;
      prisonFacility.performance.security = 90;

      const recommendations = analytics.generateOptimizationRecommendations(
        [force],
        [guardUnit],
        [prisonFacility]
      );

      expect(recommendations.length).toBe(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty arrays gracefully', () => {
      expect(() => {
        analytics.calculateSecurityMetrics([], [], []);
      }).not.toThrow();

      expect(() => {
        analytics.assessThreat([], [], [], []);
      }).not.toThrow();

      expect(() => {
        analytics.analyzeResourceAllocation([], [], []);
      }).not.toThrow();
    });

    it('should handle systems with zero budgets', () => {
      const police = engine.createPoliceForce('city_001', 'Zero Budget Police', 'Local', 'City', 0);
      
      const allocation = analytics.analyzeResourceAllocation([engine.getPoliceForce(police.id)!], [], []);
      
      expect(allocation.efficiency).toBe(0);
      expect(isNaN(allocation.policeAllocation)).toBe(true); // Division by zero
    });

    it('should handle extreme performance values', () => {
      const police = engine.createPoliceForce('city_001', 'Extreme Police', 'Local', 'City', 1000000);
      const force = engine.getPoliceForce(police.id)!;
      
      // Set extreme values
      force.performance.crimeReduction = 150; // Above 100
      force.corruption = -10; // Below 0

      const metrics = analytics.calculateSecurityMetrics([force], [], []);
      
      // Should handle extreme values gracefully
      expect(metrics.policeEffectiveness).toBeGreaterThanOrEqual(0);
      expect(metrics.policeEffectiveness).toBeLessThanOrEqual(100);
    });
  });
});
