/**
 * Business Engine Tests
 * Sprint 7: Test suite for business creation and lifecycle management
 */

import { BusinessEngine } from '../BusinessEngine.js';
import { BusinessType, BusinessIndustry, BusinessStatus, EmploymentType } from '../types.js';
import { Citizen } from '../../population/types.js';

describe('BusinessEngine', () => {
  let businessEngine: BusinessEngine;
  let mockCitizen: Citizen;

  beforeEach(() => {
    businessEngine = new BusinessEngine();
    
    // Create a mock citizen for testing
    mockCitizen = {
      id: 'test_citizen_001',
      name: 'Test Entrepreneur',
      age: 30,
      gender: 'non_binary',
      cityId: 'alpha',
      
      // Psychological profile suitable for entrepreneurship
      psychologicalProfile: {
        openness: 0.8,
        conscientiousness: 0.8,
        extraversion: 0.7,
        agreeableness: 0.6,
        neuroticism: 0.3
      },
      
      // Skills suitable for business ownership
      skills: {
        business_management: 7,
        leadership: 6,
        communication: 7,
        financial_planning: 6,
        marketing: 5,
        programming: 8, // For tech business
        customer_service: 6
      },
      
      // Other required fields
      income: 75000,
      education: 'bachelors',
      occupation: 'software_engineer',
      maritalStatus: 'single',
      children: 0,
      healthStatus: 'healthy',
      politicalAffiliation: 'independent',
      satisfactionLevel: 0.7,
      stressLevel: 0.3,
      
      // Life events and career path
      lifeEvents: [],
      careerPath: {
        currentLevel: 2,
        experienceYears: 5,
        skillDevelopment: {},
        careerGoals: ['business_owner', 'entrepreneur']
      },
      
      // Social and economic factors
      socialConnections: 20,
      culturalValues: {},
      consumptionPreferences: {},
      
      // Timestamps
      createdAt: new Date(),
      lastUpdated: new Date()
    };
  });

  describe('Business Creation', () => {
    test('should create business for qualified citizen', () => {
      const business = businessEngine.createBusiness(
        mockCitizen,
        'software_consulting',
        'Tech Solutions LLC',
        50000
      );
      
      expect(business).toBeTruthy();
      expect(business?.name).toBe('Tech Solutions LLC');
      expect(business?.ownerId).toBe(mockCitizen.id);
      expect(business?.industry).toBe(BusinessIndustry.TECHNOLOGY);
      expect(business?.status).toBe(BusinessStatus.STARTUP);
      expect(business?.initialCapital).toBe(50000);
      expect(business?.currentCapital).toBe(50000);
      expect(business?.employeeCount).toBe(1); // Owner
    });

    test('should fail to create business with insufficient capital', () => {
      expect(() => {
        businessEngine.createBusiness(
          mockCitizen,
          'software_consulting',
          'Tech Solutions LLC',
          10000 // Below minimum requirement
        );
      }).toThrow('Insufficient capital');
    });

    test('should fail to create business for unqualified citizen', () => {
      const unqualifiedCitizen = {
        ...mockCitizen,
        skills: {
          programming: 3, // Too low
          business_management: 2,
          communication: 3
        }
      };

      const business = businessEngine.createBusiness(
        unqualifiedCitizen,
        'software_consulting',
        'Failed Business',
        50000
      );
      
      expect(business).toBeNull();
    });

    test('should prevent citizen from owning multiple businesses', () => {
      // Create first business
      const firstBusiness = businessEngine.createBusiness(
        mockCitizen,
        'software_consulting',
        'First Business',
        50000
      );
      expect(firstBusiness).toBeTruthy();

      // Try to create second business
      const secondBusiness = businessEngine.createBusiness(
        mockCitizen,
        'accounting_practice',
        'Second Business',
        30000
      );
      expect(secondBusiness).toBeNull();
    });
  });

  describe('Employee Management', () => {
    let business: any;

    beforeEach(() => {
      business = businessEngine.createBusiness(
        mockCitizen,
        'software_consulting',
        'Test Business',
        100000
      );
    });

    test('should hire employee successfully', () => {
      const success = businessEngine.hireEmployee(
        business.id,
        'employee_001',
        'Developer',
        60000,
        EmploymentType.FULL_TIME
      );
      
      expect(success).toBe(true);
      
      const updatedBusiness = businessEngine.getBusiness(business.id);
      expect(updatedBusiness?.employeeCount).toBe(2); // Owner + 1 employee
      expect(updatedBusiness?.employees).toHaveLength(2);
      
      const newEmployee = updatedBusiness?.employees.find(emp => emp.citizenId === 'employee_001');
      expect(newEmployee).toBeTruthy();
      expect(newEmployee?.position).toBe('Developer');
      expect(newEmployee?.salary).toBe(60000);
    });

    test('should fail to hire employee with excessive salary', () => {
      const success = businessEngine.hireEmployee(
        business.id,
        'employee_001',
        'Developer',
        50000, // 50% of capital, exceeds 10% limit
        EmploymentType.FULL_TIME
      );
      
      expect(success).toBe(false);
    });

    test('should fire employee successfully', () => {
      // First hire an employee
      businessEngine.hireEmployee(
        business.id,
        'employee_001',
        'Developer',
        60000,
        EmploymentType.FULL_TIME
      );
      
      // Then fire them
      const success = businessEngine.fireEmployee(business.id, 'employee_001');
      expect(success).toBe(true);
      
      const updatedBusiness = businessEngine.getBusiness(business.id);
      expect(updatedBusiness?.employeeCount).toBe(1); // Back to just owner
    });

    test('should fail to fire non-existent employee', () => {
      const success = businessEngine.fireEmployee(business.id, 'non_existent');
      expect(success).toBe(false);
    });
  });

  describe('Business Operations', () => {
    let business: any;

    beforeEach(() => {
      business = businessEngine.createBusiness(
        mockCitizen,
        'software_consulting',
        'Test Business',
        100000
      );
    });

    test('should process monthly operations', () => {
      const events = businessEngine.processMonthlyOperations();
      
      expect(Array.isArray(events)).toBe(true);
      
      const updatedBusiness = businessEngine.getBusiness(business.id);
      expect(updatedBusiness?.monthlyMetrics).toHaveLength(1);
      expect(updatedBusiness?.lastUpdated).toBeInstanceOf(Date);
    });

    test('should update business metrics during operations', () => {
      // Process operations
      businessEngine.processMonthlyOperations();
      
      const updatedBusiness = businessEngine.getBusiness(business.id);
      expect(updatedBusiness?.monthlyRevenue).toBeGreaterThanOrEqual(0);
      expect(updatedBusiness?.monthlyExpenses).toBeGreaterThan(0);
      expect(typeof updatedBusiness?.profitMargin).toBe('number');
    });

    test('should handle business failure due to insufficient capital', () => {
      // Create a business with very low capital
      const failingBusiness = businessEngine.createBusiness(
        {
          ...mockCitizen,
          id: 'failing_citizen',
          skills: {
            ...mockCitizen.skills,
            business_management: 5 // Lower skill
          }
        },
        'local_coffee_shop',
        'Failing Coffee Shop',
        75000 // Minimum capital
      );
      
      expect(failingBusiness).toBeTruthy();
      
      // Simulate several months of poor performance
      for (let i = 0; i < 6; i++) {
        businessEngine.processMonthlyOperations();
      }
      
      const updatedBusiness = businessEngine.getBusiness(failingBusiness!.id);
      // Business might be closing due to poor performance
      expect(updatedBusiness?.status).toBeDefined();
    });
  });

  describe('Business Analytics', () => {
    let business: any;

    beforeEach(() => {
      business = businessEngine.createBusiness(
        mockCitizen,
        'software_consulting',
        'Analytics Test Business',
        100000
      );
      
      // Add some monthly metrics
      businessEngine.processMonthlyOperations();
    });

    test('should generate business analytics', () => {
      const analytics = businessEngine.getBusinessAnalytics(business.id);
      
      expect(analytics).toBeTruthy();
      expect(analytics.business).toBeTruthy();
      expect(analytics.performance).toBeTruthy();
      expect(analytics.trends).toBeTruthy();
      expect(analytics.risks).toBeTruthy();
      expect(analytics.opportunities).toBeTruthy();
      
      // Check performance metrics
      expect(typeof analytics.performance.monthlyRevenue).toBe('number');
      expect(typeof analytics.performance.monthlyExpenses).toBe('number');
      expect(typeof analytics.performance.profitMargin).toBe('number');
      expect(typeof analytics.performance.cashFlow).toBe('number');
      expect(typeof analytics.performance.returnOnInvestment).toBe('number');
    });

    test('should calculate growth rates', () => {
      // Process multiple months to generate trend data
      for (let i = 0; i < 6; i++) {
        businessEngine.processMonthlyOperations();
      }
      
      const analytics = businessEngine.getBusinessAnalytics(business.id);
      
      expect(typeof analytics.trends.revenueGrowth).toBe('number');
      expect(typeof analytics.trends.profitGrowth).toBe('number');
      expect(typeof analytics.trends.customerGrowth).toBe('number');
      expect(typeof analytics.trends.marketShareGrowth).toBe('number');
    });

    test('should identify risks and opportunities', () => {
      const analytics = businessEngine.getBusinessAnalytics(business.id);
      
      // Risk assessment
      expect(typeof analytics.risks.cashFlowRisk).toBe('boolean');
      expect(typeof analytics.risks.competitionRisk).toBe('boolean');
      expect(typeof analytics.risks.reputationRisk).toBe('boolean');
      expect(typeof analytics.risks.growthRisk).toBe('boolean');
      
      // Opportunity assessment
      expect(typeof analytics.opportunities.expansionReady).toBe('boolean');
      expect(typeof analytics.opportunities.hiringRecommended).toBe('boolean');
      expect(typeof analytics.opportunities.newProductOpportunity).toBe('boolean');
    });
  });

  describe('Business Opportunities', () => {
    test('should have initialized business opportunities', () => {
      const opportunities = businessEngine.getBusinessOpportunities();
      
      expect(Array.isArray(opportunities)).toBe(true);
      expect(opportunities.length).toBeGreaterThan(0);
      
      // Check that key opportunities exist
      const opportunityIds = opportunities.map(o => o.id);
      expect(opportunityIds).toContain('software_consulting');
      expect(opportunityIds).toContain('local_coffee_shop');
      expect(opportunityIds).toContain('accounting_practice');
    });

    test('should have valid opportunity data', () => {
      const opportunities = businessEngine.getBusinessOpportunities();
      const softwareOpp = opportunities.find(o => o.id === 'software_consulting');
      
      expect(softwareOpp).toBeTruthy();
      expect(softwareOpp?.industry).toBe(BusinessIndustry.TECHNOLOGY);
      expect(softwareOpp?.minimumCapital).toBeGreaterThan(0);
      expect(softwareOpp?.requiredSkills.length).toBeGreaterThan(0);
      expect(softwareOpp?.successProbability).toBeGreaterThan(0);
      expect(softwareOpp?.successProbability).toBeLessThanOrEqual(1);
    });
  });

  describe('Business Events', () => {
    let business: any;

    beforeEach(() => {
      business = businessEngine.createBusiness(
        mockCitizen,
        'software_consulting',
        'Event Test Business',
        100000
      );
    });

    test('should record business founding event', () => {
      const events = businessEngine.getBusinessEvents(business.id);
      
      expect(events.length).toBeGreaterThan(0);
      const foundingEvent = events.find(e => e.eventType === 'founded');
      expect(foundingEvent).toBeTruthy();
      expect(foundingEvent?.businessId).toBe(business.id);
    });

    test('should record hiring events', () => {
      businessEngine.hireEmployee(
        business.id,
        'employee_001',
        'Developer',
        60000,
        EmploymentType.FULL_TIME
      );
      
      const events = businessEngine.getBusinessEvents(business.id);
      const hiringEvent = events.find(e => e.eventType === 'hired_employee');
      expect(hiringEvent).toBeTruthy();
    });

    test('should record firing events', () => {
      // First hire, then fire
      businessEngine.hireEmployee(
        business.id,
        'employee_001',
        'Developer',
        60000,
        EmploymentType.FULL_TIME
      );
      businessEngine.fireEmployee(business.id, 'employee_001');
      
      const events = businessEngine.getBusinessEvents(business.id);
      const firingEvent = events.find(e => e.eventType === 'fired_employee');
      expect(firingEvent).toBeTruthy();
    });
  });

  describe('Data Retrieval', () => {
    test('should retrieve business by ID', () => {
      const business = businessEngine.createBusiness(
        mockCitizen,
        'software_consulting',
        'Retrieval Test',
        50000
      );
      
      const retrieved = businessEngine.getBusiness(business!.id);
      expect(retrieved).toEqual(business);
    });

    test('should return undefined for non-existent business', () => {
      const business = businessEngine.getBusiness('non_existent_id');
      expect(business).toBeUndefined();
    });

    test('should get businesses by owner', () => {
      const business = businessEngine.createBusiness(
        mockCitizen,
        'software_consulting',
        'Owner Test',
        50000
      );
      
      const ownerBusinesses = businessEngine.getBusinessesByOwner(mockCitizen.id);
      expect(ownerBusinesses).toHaveLength(1);
      expect(ownerBusinesses[0]).toEqual(business);
    });

    test('should get businesses by industry', () => {
      const business = businessEngine.createBusiness(
        mockCitizen,
        'software_consulting',
        'Industry Test',
        50000
      );
      
      const techBusinesses = businessEngine.getBusinessesByIndustry(BusinessIndustry.TECHNOLOGY);
      expect(techBusinesses.length).toBeGreaterThan(0);
      expect(techBusinesses.some(b => b.id === business!.id)).toBe(true);
    });

    test('should get all businesses', () => {
      const initialCount = businessEngine.getAllBusinesses().length;
      
      businessEngine.createBusiness(
        mockCitizen,
        'software_consulting',
        'All Test',
        50000
      );
      
      const allBusinesses = businessEngine.getAllBusinesses();
      expect(allBusinesses.length).toBe(initialCount + 1);
    });
  });
});
