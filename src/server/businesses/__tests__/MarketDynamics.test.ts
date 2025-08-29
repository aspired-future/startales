/**
 * Market Dynamics Tests
 * Sprint 7: Test suite for market competition and dynamics analysis
 */

import { MarketDynamics } from '../MarketDynamics';
import { BusinessEngine } from '../BusinessEngine';
import { Business, BusinessIndustry, BusinessStatus, CompetitionLevel } from '../types';
import { Citizen } from '../../population/types';

describe('MarketDynamics', () => {
  let marketDynamics: MarketDynamics;
  let businessEngine: BusinessEngine;
  let mockBusinesses: Business[];
  let mockCitizen: Citizen;

  beforeEach(() => {
    marketDynamics = new MarketDynamics();
    businessEngine = new BusinessEngine();
    
    // Create a mock citizen
    mockCitizen = {
      id: 'test_citizen_001',
      name: 'Test Entrepreneur',
      age: 30,
      gender: 'non_binary',
      cityId: 'alpha',
      psychologicalProfile: {
        openness: 0.8,
        conscientiousness: 0.8,
        extraversion: 0.7,
        agreeableness: 0.6,
        neuroticism: 0.3
      },
      skills: {
        business_management: 7,
        programming: 8,
        communication: 7
      },
      income: 75000,
      education: 'bachelors',
      occupation: 'software_engineer',
      maritalStatus: 'single',
      children: 0,
      healthStatus: 'healthy',
      politicalAffiliation: 'independent',
      satisfactionLevel: 0.7,
      stressLevel: 0.3,
      lifeEvents: [],
      careerPath: {
        currentLevel: 2,
        experienceYears: 5,
        skillDevelopment: {},
        careerGoals: ['business_owner']
      },
      socialConnections: 20,
      culturalValues: {},
      consumptionPreferences: {},
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    // Create mock businesses for testing
    const business1 = businessEngine.createBusiness(
      mockCitizen,
      'software_consulting',
      'Tech Solutions A',
      50000
    );

    const business2 = businessEngine.createBusiness(
      { ...mockCitizen, id: 'citizen_002' },
      'software_consulting',
      'Tech Solutions B',
      75000
    );

    mockBusinesses = [business1!, business2!].filter(Boolean);
  });

  describe('Market Analysis', () => {
    test('should analyze market for specific industry and city', () => {
      const analysis = marketDynamics.analyzeMarket(
        BusinessIndustry.TECHNOLOGY,
        'alpha',
        mockBusinesses
      );

      expect(analysis).toBeTruthy();
      expect(analysis.industry).toBe(BusinessIndustry.TECHNOLOGY);
      expect(analysis.cityId).toBe('alpha');
      expect(analysis.numberOfCompetitors).toBe(2);
      expect(analysis.totalMarketSize).toBeGreaterThan(0);
      expect(analysis.addressableMarket).toBeGreaterThan(0);
      expect(typeof analysis.marketGrowthRate).toBe('number');
      expect(typeof analysis.marketConcentration).toBe('number');
    });

    test('should handle empty market analysis', () => {
      const analysis = marketDynamics.analyzeMarket(
        BusinessIndustry.HEALTHCARE,
        'beta',
        [] // No businesses
      );

      expect(analysis).toBeTruthy();
      expect(analysis.numberOfCompetitors).toBe(0);
      expect(analysis.totalMarketSize).toBeGreaterThan(0); // Base market size
    });

    test('should include industry trends in analysis', () => {
      const analysis = marketDynamics.analyzeMarket(
        BusinessIndustry.TECHNOLOGY,
        'alpha',
        mockBusinesses
      );

      expect(Array.isArray(analysis.industryTrends)).toBe(true);
      expect(analysis.industryTrends.length).toBeGreaterThan(0);
      
      const trends = analysis.industryTrends;
      expect(trends.some(t => t.name.includes('AI'))).toBe(true); // Should have AI trend
    });

    test('should include barriers to entry', () => {
      const analysis = marketDynamics.analyzeMarket(
        BusinessIndustry.TECHNOLOGY,
        'alpha',
        mockBusinesses
      );

      expect(Array.isArray(analysis.barrierToEntry)).toBe(true);
      expect(analysis.barrierToEntry.length).toBeGreaterThan(0);
    });
  });

  describe('Competition Analysis', () => {
    test('should analyze competition between businesses', () => {
      const business = mockBusinesses[0];
      const competitors = mockBusinesses.slice(1);
      
      const analyses = marketDynamics.analyzeCompetition(business, competitors);

      expect(Array.isArray(analyses)).toBe(true);
      expect(analyses.length).toBe(competitors.length);
      
      const analysis = analyses[0];
      expect(analysis.businessId).toBe(business.id);
      expect(analysis.competitorId).toBe(competitors[0].id);
      expect(typeof analysis.competitionIntensity).toBe('number');
      expect(typeof analysis.marketOverlap).toBe('number');
      expect(Array.isArray(analysis.competitiveAdvantages)).toBe(true);
      expect(Array.isArray(analysis.competitiveDisadvantages)).toBe(true);
      expect(Object.values(CompetitionLevel)).toContain(analysis.threatLevel);
    });

    test('should calculate market overlap correctly', () => {
      const business1 = mockBusinesses[0];
      const business2 = mockBusinesses[1];
      
      const analyses = marketDynamics.analyzeCompetition(business1, [business2]);
      const analysis = analyses[0];
      
      // Same industry and city should have high overlap
      expect(analysis.marketOverlap).toBeGreaterThan(0.5);
    });

    test('should identify competitive advantages and disadvantages', () => {
      // Modify one business to have better metrics
      const business1 = mockBusinesses[0];
      const business2 = mockBusinesses[1];
      
      business1.reputation = 0.8;
      business1.marketShare = 0.3;
      business2.reputation = 0.4;
      business2.marketShare = 0.1;
      
      const analyses = marketDynamics.analyzeCompetition(business1, [business2]);
      const analysis = analyses[0];
      
      expect(analysis.competitiveAdvantages.length).toBeGreaterThan(0);
      expect(analysis.competitiveAdvantages.some(adv => 
        adv.includes('reputation') || adv.includes('market share')
      )).toBe(true);
    });
  });

  describe('Market Dynamics Simulation', () => {
    test('should simulate market dynamics and generate events', () => {
      const events = marketDynamics.simulateMarketDynamics(mockBusinesses);

      expect(Array.isArray(events)).toBe(true);
      // Events are random, so we just check the structure
      events.forEach(event => {
        expect(event.id).toBeTruthy();
        expect(event.businessId).toBeTruthy();
        expect(event.eventType).toBeTruthy();
        expect(event.description).toBeTruthy();
        expect(event.impact).toBeTruthy();
        expect(event.timestamp).toBeInstanceOf(Date);
      });
    });

    test('should handle empty business list in simulation', () => {
      const events = marketDynamics.simulateMarketDynamics([]);
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBe(0);
    });
  });

  describe('Market Segments', () => {
    test('should have initialized market segments', () => {
      const segments = marketDynamics.getMarketSegments();

      expect(Array.isArray(segments)).toBe(true);
      expect(segments.length).toBeGreaterThan(0);
      
      // Check that key segments exist
      const segmentIds = segments.map(s => s.id);
      expect(segmentIds).toContain('software_consulting');
      expect(segmentIds).toContain('coffee_shops');
      expect(segmentIds).toContain('accounting_services');
    });

    test('should have valid segment data', () => {
      const segments = marketDynamics.getMarketSegments();
      const techSegment = segments.find(s => s.id === 'software_consulting');

      expect(techSegment).toBeTruthy();
      expect(techSegment?.industry).toBe(BusinessIndustry.TECHNOLOGY);
      expect(techSegment?.size).toBeGreaterThan(0);
      expect(techSegment?.growthRate).toBeGreaterThan(-1); // Can be negative but reasonable
      expect(techSegment?.profitability).toBeGreaterThan(0);
      expect(Object.values(CompetitionLevel)).toContain(techSegment?.competitionLevel);
      expect(Array.isArray(techSegment?.barriers)).toBe(true);
      expect(Array.isArray(techSegment?.keySuccessFactors)).toBe(true);
    });

    test('should filter segments by industry', () => {
      const allSegments = marketDynamics.getMarketSegments();
      const techSegments = allSegments.filter(s => s.industry === BusinessIndustry.TECHNOLOGY);
      
      expect(techSegments.length).toBeGreaterThan(0);
      techSegments.forEach(segment => {
        expect(segment.industry).toBe(BusinessIndustry.TECHNOLOGY);
      });
    });
  });

  describe('Industry Trends', () => {
    test('should have industry trends for major industries', () => {
      const techTrends = marketDynamics.getIndustryTrends(BusinessIndustry.TECHNOLOGY);
      const foodTrends = marketDynamics.getIndustryTrends(BusinessIndustry.FOOD_SERVICE);
      
      expect(Array.isArray(techTrends)).toBe(true);
      expect(Array.isArray(foodTrends)).toBe(true);
      expect(techTrends.length).toBeGreaterThan(0);
      expect(foodTrends.length).toBeGreaterThan(0);
    });

    test('should have valid trend data', () => {
      const trends = marketDynamics.getIndustryTrends(BusinessIndustry.TECHNOLOGY);
      
      trends.forEach(trend => {
        expect(trend.name).toBeTruthy();
        expect(trend.description).toBeTruthy();
        expect(['very_negative', 'negative', 'neutral', 'positive', 'very_positive'])
          .toContain(trend.impact);
        expect(['short_term', 'medium_term', 'long_term'])
          .toContain(trend.timeframe);
      });
    });

    test('should return empty array for industries without trends', () => {
      const trends = marketDynamics.getIndustryTrends(BusinessIndustry.AGRICULTURE);
      expect(Array.isArray(trends)).toBe(true);
      expect(trends.length).toBe(0);
    });
  });

  describe('Competitive Responses', () => {
    test('should track competitive responses', () => {
      // Simulate some market dynamics to potentially generate responses
      marketDynamics.simulateMarketDynamics(mockBusinesses);
      
      const responses = marketDynamics.getCompetitiveResponses();
      expect(Array.isArray(responses)).toBe(true);
      
      // If responses were generated, check their structure
      responses.forEach(response => {
        expect(response.businessId).toBeTruthy();
        expect(response.responseType).toBeTruthy();
        expect(response.description).toBeTruthy();
        expect(typeof response.cost).toBe('number');
        expect(response.expectedImpact).toBeTruthy();
        expect(typeof response.duration).toBe('number');
      });
    });

    test('should filter responses by business ID', () => {
      const businessId = mockBusinesses[0].id;
      const responses = marketDynamics.getCompetitiveResponses(businessId);
      
      expect(Array.isArray(responses)).toBe(true);
      responses.forEach(response => {
        expect(response.businessId).toBe(businessId);
      });
    });
  });

  describe('Market Analysis Retrieval', () => {
    test('should retrieve market analysis by industry and city', () => {
      // First analyze the market
      const originalAnalysis = marketDynamics.analyzeMarket(
        BusinessIndustry.TECHNOLOGY,
        'alpha',
        mockBusinesses
      );

      // Then retrieve it
      const retrievedAnalysis = marketDynamics.getMarketAnalysis(
        BusinessIndustry.TECHNOLOGY,
        'alpha'
      );

      expect(retrievedAnalysis).toEqual(originalAnalysis);
    });

    test('should return undefined for non-analyzed market', () => {
      const analysis = marketDynamics.getMarketAnalysis(
        BusinessIndustry.HEALTHCARE,
        'gamma'
      );

      expect(analysis).toBeUndefined();
    });
  });

  describe('Competitor Analysis Retrieval', () => {
    test('should retrieve competitor analyses by business ID', () => {
      const business = mockBusinesses[0];
      const competitors = mockBusinesses.slice(1);
      
      // First analyze competition
      const originalAnalyses = marketDynamics.analyzeCompetition(business, competitors);

      // Then retrieve
      const retrievedAnalyses = marketDynamics.getCompetitorAnalyses(business.id);

      expect(retrievedAnalyses).toEqual(originalAnalyses);
    });

    test('should return empty array for business with no analyses', () => {
      const analyses = marketDynamics.getCompetitorAnalyses('non_existent_business');
      expect(analyses).toEqual([]);
    });
  });

  describe('Market Metrics Calculations', () => {
    test('should calculate reasonable market sizes', () => {
      const analysis = marketDynamics.analyzeMarket(
        BusinessIndustry.TECHNOLOGY,
        'alpha',
        mockBusinesses
      );

      expect(analysis.totalMarketSize).toBeGreaterThan(100000); // Reasonable minimum
      expect(analysis.totalMarketSize).toBeLessThan(10000000); // Reasonable maximum
      expect(analysis.addressableMarket).toBeLessThanOrEqual(analysis.totalMarketSize);
    });

    test('should calculate market concentration correctly', () => {
      const analysis = marketDynamics.analyzeMarket(
        BusinessIndustry.TECHNOLOGY,
        'alpha',
        mockBusinesses
      );

      expect(analysis.marketConcentration).toBeGreaterThanOrEqual(0);
      expect(analysis.marketConcentration).toBeLessThanOrEqual(1);
    });

    test('should calculate customer demographics', () => {
      const analysis = marketDynamics.analyzeMarket(
        BusinessIndustry.TECHNOLOGY,
        'alpha',
        mockBusinesses
      );

      expect(analysis.targetDemographics).toBeTruthy();
      expect(analysis.targetDemographics.ageGroups).toBeTruthy();
      expect(analysis.targetDemographics.incomeGroups).toBeTruthy();
      expect(analysis.targetDemographics.educationLevels).toBeTruthy();
      expect(analysis.targetDemographics.occupations).toBeTruthy();
    });
  });
});
