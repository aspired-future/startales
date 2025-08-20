/**
 * Labor Market Analytics Tests
 * Sprint 6: Test suite for labor market analysis and forecasting
 */

import { LaborMarketAnalytics } from '../LaborMarketAnalytics.js';
import { ProfessionEngine } from '../ProfessionEngine.js';
import { Profession, Employment, LaborMarket } from '../types.js';
import { Citizen } from '../../population/types.js';

describe('LaborMarketAnalytics', () => {
  let analytics: LaborMarketAnalytics;
  let professionEngine: ProfessionEngine;
  let mockProfession: Profession;
  let mockEmploymentRecords: Employment[];
  let mockCitizens: Citizen[];

  beforeEach(() => {
    analytics = new LaborMarketAnalytics();
    professionEngine = new ProfessionEngine();
    
    // Get a real profession from the engine
    mockProfession = professionEngine.getProfession('software_engineer')!;
    
    // Create mock employment records
    mockEmploymentRecords = [
      {
        citizenId: 'citizen_001',
        professionId: 'software_engineer',
        title: 'Software Engineer',
        level: 1,
        salary: 75000,
        startDate: new Date('2023-01-01'),
        performanceRating: 0.8,
        skillProficiency: {
          programming: 7,
          problem_solving: 8,
          mathematics: 6
        },
        experienceYears: 2,
        employmentStatus: 'employed' as any,
        workSchedule: 'full_time' as any,
        satisfactionLevel: 0.7,
        promotionEligible: false,
        trainingPrograms: [],
        mentorshipStatus: 'none' as any
      },
      {
        citizenId: 'citizen_002',
        professionId: 'software_engineer',
        title: 'Senior Software Engineer',
        level: 2,
        salary: 105000,
        startDate: new Date('2020-01-01'),
        performanceRating: 0.9,
        skillProficiency: {
          programming: 8,
          problem_solving: 9,
          mathematics: 7
        },
        experienceYears: 5,
        employmentStatus: 'employed' as any,
        workSchedule: 'full_time' as any,
        satisfactionLevel: 0.8,
        promotionEligible: true,
        trainingPrograms: ['Advanced Architecture'],
        mentorshipStatus: 'is_mentor' as any
      }
    ];

    // Create mock citizens
    mockCitizens = [
      {
        id: 'citizen_001',
        name: 'Alice Developer',
        age: 28,
        gender: 'female',
        cityId: 'alpha',
        psychologicalProfile: {
          openness: 0.8,
          conscientiousness: 0.7,
          extraversion: 0.5,
          agreeableness: 0.6,
          neuroticism: 0.3
        },
        skills: {
          programming: 7,
          problem_solving: 8,
          mathematics: 6,
          communication: 5
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
          currentLevel: 1,
          experienceYears: 2,
          skillDevelopment: {},
          careerGoals: ['senior_software_engineer']
        },
        socialConnections: 15,
        culturalValues: {},
        consumptionPreferences: {},
        createdAt: new Date(),
        lastUpdated: new Date()
      }
    ];
  });

  describe('Labor Market Analysis', () => {
    test('should analyze labor market for professions', () => {
      const professions = [mockProfession];
      const markets = analytics.analyzeLaborMarket(
        professions,
        mockEmploymentRecords,
        [],
        mockCitizens
      );

      expect(Array.isArray(markets)).toBe(true);
      expect(markets.length).toBe(1);

      const market = markets[0];
      expect(market.professionId).toBe('software_engineer');
      expect(market.filledPositions).toBe(2); // Two employed citizens
      expect(market.totalPositions).toBeGreaterThanOrEqual(market.filledPositions);
      expect(market.averageSalary).toBe(90000); // (75000 + 105000) / 2
    });

    test('should calculate median salary correctly', () => {
      const professions = [mockProfession];
      const markets = analytics.analyzeLaborMarket(
        professions,
        mockEmploymentRecords,
        [],
        mockCitizens
      );

      const market = markets[0];
      expect(market.medianSalary).toBe(90000); // Median of [75000, 105000]
    });

    test('should handle empty employment records', () => {
      const professions = [mockProfession];
      const markets = analytics.analyzeLaborMarket(
        professions,
        [], // No employment records
        [],
        mockCitizens
      );

      expect(markets.length).toBe(1);
      const market = markets[0];
      expect(market.filledPositions).toBe(0);
      expect(market.averageSalary).toBe(0);
    });
  });

  describe('Market Forecasting', () => {
    test('should generate quarterly forecast', () => {
      const mockMarket: LaborMarket = {
        professionId: 'software_engineer',
        cityId: 'alpha',
        totalPositions: 100,
        filledPositions: 90,
        openPositions: 10,
        qualifiedCandidates: 15,
        competitionLevel: 'moderate' as any,
        salaryTrend: 'growing' as any,
        demandTrend: 'growing' as any,
        averageSalary: 90000,
        medianSalary: 85000,
        salaryGrowthRate: 0.05,
        turnoverRate: 0.15,
        timeToFill: 30
      };

      const forecast = analytics.generateForecast(mockProfession, mockMarket, 'quarterly');

      expect(forecast.professionId).toBe('software_engineer');
      expect(forecast.timeframe).toBe('quarterly');
      expect(forecast.projectedDemand).toBeGreaterThan(0);
      expect(forecast.supplyDemandRatio).toBeGreaterThan(0);
      expect(typeof forecast.automationThreat).toBe('number');
      expect(forecast.automationThreat).toBeGreaterThanOrEqual(0);
      expect(forecast.automationThreat).toBeLessThanOrEqual(1);
    });

    test('should generate annual forecast', () => {
      const mockMarket: LaborMarket = {
        professionId: 'software_engineer',
        cityId: 'alpha',
        totalPositions: 100,
        filledPositions: 90,
        openPositions: 10,
        qualifiedCandidates: 15,
        competitionLevel: 'moderate' as any,
        salaryTrend: 'growing' as any,
        demandTrend: 'growing' as any,
        averageSalary: 90000,
        medianSalary: 85000,
        salaryGrowthRate: 0.05,
        turnoverRate: 0.15,
        timeToFill: 30
      };

      const forecast = analytics.generateForecast(mockProfession, mockMarket, 'annual');

      expect(forecast.timeframe).toBe('annual');
      expect(forecast.projectedDemand).toBeGreaterThan(mockMarket.totalPositions);
      expect(forecast.newPositionsExpected).toBeGreaterThan(0);
    });

    test('should generate five-year forecast', () => {
      const mockMarket: LaborMarket = {
        professionId: 'software_engineer',
        cityId: 'alpha',
        totalPositions: 100,
        filledPositions: 90,
        openPositions: 10,
        qualifiedCandidates: 15,
        competitionLevel: 'moderate' as any,
        salaryTrend: 'growing' as any,
        demandTrend: 'growing' as any,
        averageSalary: 90000,
        medianSalary: 85000,
        salaryGrowthRate: 0.05,
        turnoverRate: 0.15,
        timeToFill: 30
      };

      const forecast = analytics.generateForecast(mockProfession, mockMarket, 'five_year');

      expect(forecast.timeframe).toBe('five_year');
      expect(forecast.projectedDemand).toBeGreaterThan(mockMarket.totalPositions * 1.1); // Should show significant growth over 5 years
    });
  });

  describe('Skills Gap Analysis', () => {
    test('should identify skills gaps', () => {
      // Create employment records with skill deficiencies
      const employmentWithGaps: Employment[] = [
        {
          ...mockEmploymentRecords[0],
          skillProficiency: {
            programming: 5, // Below required level of 6
            problem_solving: 6, // Below required level of 7
            mathematics: 4   // Below required level of 5
          }
        }
      ];

      const skillsGaps = analytics.analyzeSkillsGaps(mockProfession, employmentWithGaps);

      expect(Array.isArray(skillsGaps)).toBe(true);
      expect(skillsGaps.length).toBeGreaterThan(0);

      const programmingGap = skillsGaps.find(gap => gap.skillId === 'programming');
      expect(programmingGap).toBeTruthy();
      expect(programmingGap?.gapSize).toBeGreaterThan(0);
      expect(programmingGap?.affectedPositions).toBe(1);
      expect(programmingGap?.trainingPrograms.length).toBeGreaterThan(0);
    });

    test('should not identify gaps when skills meet requirements', () => {
      // Use employment records with adequate skills
      const skillsGaps = analytics.analyzeSkillsGaps(mockProfession, mockEmploymentRecords);

      // Should have no gaps since mock records have adequate skills
      expect(skillsGaps.length).toBe(0);
    });
  });

  describe('Wage Analysis', () => {
    test('should analyze wages for profession', () => {
      const wageAnalysis = analytics.analyzeWages(mockProfession, mockEmploymentRecords);

      expect(wageAnalysis.professionId).toBe('software_engineer');
      expect(wageAnalysis.currentMedian).toBe(90000);
      expect(wageAnalysis.currentRange.min).toBe(75000);
      expect(wageAnalysis.currentRange.max).toBe(105000);
      expect(typeof wageAnalysis.oneYearGrowth).toBe('number');
      expect(typeof wageAnalysis.projectedGrowth).toBe('number');
    });

    test('should handle empty employment records in wage analysis', () => {
      const wageAnalysis = analytics.analyzeWages(mockProfession, []);

      expect(wageAnalysis.currentMedian).toBe(0);
      expect(wageAnalysis.currentRange.min).toBe(0);
      expect(wageAnalysis.currentRange.max).toBe(0);
    });
  });

  describe('Career Mobility Analysis', () => {
    test('should analyze career mobility between professions', () => {
      const teacherProfession = professionEngine.getProfession('teacher')!;
      const careerTransitions: any[] = [
        {
          citizenId: 'citizen_001',
          fromProfession: 'teacher',
          toProfession: 'software_engineer',
          transitionDate: new Date(),
          transitionType: 'career_change',
          salaryChange: 25, // 25% increase
          satisfactionChange: 0.1,
          retrainingRequired: true
        }
      ];

      const mobilityAnalysis = analytics.analyzeCareerMobility(
        teacherProfession,
        mockProfession,
        careerTransitions
      );

      expect(mobilityAnalysis.fromProfessionId).toBe('teacher');
      expect(mobilityAnalysis.toProfessionId).toBe('software_engineer');
      expect(mobilityAnalysis.transitionRate).toBeGreaterThan(0);
      expect(mobilityAnalysis.averageSalaryChange).toBe(25);
      expect(mobilityAnalysis.retrainingRequired).toBe(true);
      expect(Array.isArray(mobilityAnalysis.skillsGap)).toBe(true);
    });

    test('should handle no transition data', () => {
      const teacherProfession = professionEngine.getProfession('teacher')!;
      const mobilityAnalysis = analytics.analyzeCareerMobility(
        teacherProfession,
        mockProfession,
        [] // No transitions
      );

      expect(mobilityAnalysis.transitionRate).toBe(0);
      expect(mobilityAnalysis.successRate).toBe(0);
      expect(mobilityAnalysis.averageSalaryChange).toBe(0);
    });
  });

  describe('Risk Assessment', () => {
    test('should assess automation risk correctly', () => {
      // Test different profession categories for automation risk
      const techProfession = professionEngine.getProfession('software_engineer')!;
      const retailProfession = professionEngine.getProfession('retail_associate')!;

      const mockMarket: LaborMarket = {
        professionId: 'software_engineer',
        cityId: 'alpha',
        totalPositions: 100,
        filledPositions: 90,
        openPositions: 10,
        qualifiedCandidates: 15,
        competitionLevel: 'moderate' as any,
        salaryTrend: 'growing' as any,
        demandTrend: 'growing' as any,
        averageSalary: 90000,
        medianSalary: 85000,
        salaryGrowthRate: 0.05,
        turnoverRate: 0.15,
        timeToFill: 30
      };

      const techForecast = analytics.generateForecast(techProfession, mockMarket, 'annual');
      const retailForecast = analytics.generateForecast(retailProfession, 
        { ...mockMarket, professionId: 'retail_associate' }, 'annual');

      // Software engineering should have lower automation risk than retail
      expect(techForecast.automationThreat).toBeLessThan(retailForecast.automationThreat);
    });

    test('should assess economic sensitivity', () => {
      const mockMarket: LaborMarket = {
        professionId: 'software_engineer',
        cityId: 'alpha',
        totalPositions: 100,
        filledPositions: 90,
        openPositions: 10,
        qualifiedCandidates: 15,
        competitionLevel: 'moderate' as any,
        salaryTrend: 'growing' as any,
        demandTrend: 'growing' as any,
        averageSalary: 90000,
        medianSalary: 85000,
        salaryGrowthRate: 0.05,
        turnoverRate: 0.15,
        timeToFill: 30
      };

      const forecast = analytics.generateForecast(mockProfession, mockMarket, 'annual');

      expect(typeof forecast.economicSensitivity).toBe('number');
      expect(forecast.economicSensitivity).toBeGreaterThanOrEqual(0);
      expect(forecast.economicSensitivity).toBeLessThanOrEqual(1);
    });
  });
});
