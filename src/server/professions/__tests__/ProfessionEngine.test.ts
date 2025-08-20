/**
 * Profession Engine Tests
 * Sprint 6: Test suite for profession and career management system
 */

import { ProfessionEngine } from '../ProfessionEngine.js';
import { Citizen } from '../../population/types.js';
import { EmploymentStatus, UnemploymentReason } from '../types.js';

describe('ProfessionEngine', () => {
  let professionEngine: ProfessionEngine;
  let mockCitizen: Citizen;

  beforeEach(() => {
    professionEngine = new ProfessionEngine();
    
    // Create a mock citizen for testing
    mockCitizen = {
      id: 'test_citizen_001',
      name: 'Test Citizen',
      age: 25,
      gender: 'non_binary',
      cityId: 'alpha',
      
      // Psychological profile suitable for software engineering
      psychologicalProfile: {
        openness: 0.8,
        conscientiousness: 0.7,
        extraversion: 0.5,
        agreeableness: 0.6,
        neuroticism: 0.3
      },
      
      // Skills suitable for software engineering
      skills: {
        programming: 7,
        problem_solving: 8,
        mathematics: 6,
        communication: 5,
        project_management: 4
      },
      
      // Other required fields
      income: 50000,
      education: 'bachelors',
      occupation: 'student',
      maritalStatus: 'single',
      children: 0,
      healthStatus: 'healthy',
      politicalAffiliation: 'independent',
      satisfactionLevel: 0.7,
      stressLevel: 0.3,
      
      // Life events and career path
      lifeEvents: [],
      careerPath: {
        currentLevel: 1,
        experienceYears: 0,
        skillDevelopment: {},
        careerGoals: ['software_engineer']
      },
      
      // Social and economic factors
      socialConnections: 10,
      culturalValues: {},
      consumptionPreferences: {},
      
      // Timestamps
      createdAt: new Date(),
      lastUpdated: new Date()
    };
  });

  describe('Profession Assignment', () => {
    test('should assign suitable profession to qualified citizen', () => {
      const employment = professionEngine.assignProfession(mockCitizen);
      
      expect(employment).toBeTruthy();
      expect(employment?.citizenId).toBe(mockCitizen.id);
      expect(employment?.professionId).toBe('software_engineer');
      expect(employment?.employmentStatus).toBe(EmploymentStatus.EMPLOYED);
      expect(employment?.salary).toBeGreaterThan(0);
    });

    test('should create unemployment record for unqualified citizen', () => {
      // Create citizen with no relevant skills
      const unqualifiedCitizen = {
        ...mockCitizen,
        skills: {
          programming: 2, // Too low for software engineering
          problem_solving: 3,
          mathematics: 2,
          communication: 4,
          project_management: 1
        }
      };

      const employment = professionEngine.assignProfession(unqualifiedCitizen);
      
      expect(employment).toBeNull();
      
      const unemploymentRecord = professionEngine.getUnemploymentRecord(unqualifiedCitizen.id);
      expect(unemploymentRecord).toBeTruthy();
      expect(unemploymentRecord?.reason).toBe(UnemploymentReason.NEW_GRADUATE);
    });

    test('should prefer specified professions when provided', () => {
      const employment = professionEngine.assignProfession(mockCitizen, ['teacher']);
      
      // Should still get software engineer since citizen is better qualified for it
      expect(employment?.professionId).toBe('software_engineer');
    });
  });

  describe('Career Advancement', () => {
    test('should process career advancement correctly', () => {
      // First assign a profession
      const employment = professionEngine.assignProfession(mockCitizen);
      expect(employment).toBeTruthy();
      
      // Simulate some experience and good performance
      if (employment) {
        employment.experienceYears = 2.5;
        employment.performanceRating = 0.8;
        employment.skillProficiency.programming = 8;
      }
      
      const transitions = professionEngine.processCareerAdvancement();
      
      // Should have processed at least one transition (experience update)
      expect(Array.isArray(transitions)).toBe(true);
    });

    test('should update performance based on satisfaction', () => {
      const employment = professionEngine.assignProfession(mockCitizen);
      expect(employment).toBeTruthy();
      
      const initialPerformance = employment?.performanceRating || 0;
      
      // Process advancement (which updates performance)
      professionEngine.processCareerAdvancement();
      
      const updatedEmployment = professionEngine.getEmployment(mockCitizen.id);
      expect(updatedEmployment?.performanceRating).toBeDefined();
    });
  });

  describe('Labor Market Analytics', () => {
    test('should generate labor market analytics', () => {
      // Assign some professions first
      professionEngine.assignProfession(mockCitizen);
      
      const markets = professionEngine.getLaborMarketAnalytics('alpha');
      
      expect(Array.isArray(markets)).toBe(true);
      expect(markets.length).toBeGreaterThan(0);
      
      const softwareMarket = markets.find(m => m.professionId === 'software_engineer');
      expect(softwareMarket).toBeTruthy();
      expect(softwareMarket?.filledPositions).toBeGreaterThan(0);
    });

    test('should calculate unemployment statistics', () => {
      const stats = professionEngine.getUnemploymentStatistics('alpha');
      
      expect(stats).toBeTruthy();
      expect(typeof stats.unemploymentRate).toBe('number');
      expect(stats.unemploymentRate).toBeGreaterThanOrEqual(0);
      expect(stats.unemploymentRate).toBeLessThanOrEqual(1);
    });
  });

  describe('Profession Data', () => {
    test('should have initialized professions', () => {
      const professions = professionEngine.getAllProfessions();
      
      expect(Array.isArray(professions)).toBe(true);
      expect(professions.length).toBeGreaterThan(0);
      
      // Check that key professions exist
      const professionIds = professions.map(p => p.id);
      expect(professionIds).toContain('software_engineer');
      expect(professionIds).toContain('registered_nurse');
      expect(professionIds).toContain('teacher');
      expect(professionIds).toContain('retail_associate');
    });

    test('should retrieve specific profession', () => {
      const profession = professionEngine.getProfession('software_engineer');
      
      expect(profession).toBeTruthy();
      expect(profession?.name).toBe('Software Engineer');
      expect(profession?.category).toBe('technology');
      expect(profession?.requiredSkills.length).toBeGreaterThan(0);
      expect(profession?.careerLevels.length).toBeGreaterThan(0);
    });

    test('should return undefined for non-existent profession', () => {
      const profession = professionEngine.getProfession('non_existent_profession');
      expect(profession).toBeUndefined();
    });
  });

  describe('Career Transitions', () => {
    test('should track career transitions', () => {
      // Assign profession and process advancement
      professionEngine.assignProfession(mockCitizen);
      professionEngine.processCareerAdvancement();
      
      const transitions = professionEngine.getCareerTransitions(mockCitizen.id);
      expect(Array.isArray(transitions)).toBe(true);
    });

    test('should get all career transitions when no citizen ID provided', () => {
      const allTransitions = professionEngine.getCareerTransitions();
      expect(Array.isArray(allTransitions)).toBe(true);
    });
  });

  describe('Employment Records', () => {
    test('should store and retrieve employment records', () => {
      const employment = professionEngine.assignProfession(mockCitizen);
      expect(employment).toBeTruthy();
      
      const retrievedEmployment = professionEngine.getEmployment(mockCitizen.id);
      expect(retrievedEmployment).toEqual(employment);
    });

    test('should return undefined for non-existent employment', () => {
      const employment = professionEngine.getEmployment('non_existent_citizen');
      expect(employment).toBeUndefined();
    });
  });

  describe('Salary Calculations', () => {
    test('should calculate reasonable starting salaries', () => {
      const employment = professionEngine.assignProfession(mockCitizen);
      
      expect(employment?.salary).toBeTruthy();
      expect(employment?.salary).toBeGreaterThan(30000); // Reasonable minimum
      expect(employment?.salary).toBeLessThan(200000); // Reasonable maximum for entry level
    });

    test('should vary salaries based on citizen skills', () => {
      // Create two citizens with different skill levels
      const highSkillCitizen = {
        ...mockCitizen,
        id: 'high_skill_citizen',
        skills: {
          programming: 9,
          problem_solving: 9,
          mathematics: 8,
          communication: 7,
          project_management: 6
        }
      };

      const lowSkillCitizen = {
        ...mockCitizen,
        id: 'low_skill_citizen',
        skills: {
          programming: 6,
          problem_solving: 6,
          mathematics: 5,
          communication: 4,
          project_management: 3
        }
      };

      const highSkillEmployment = professionEngine.assignProfession(highSkillCitizen);
      const lowSkillEmployment = professionEngine.assignProfession(lowSkillCitizen);

      expect(highSkillEmployment?.salary).toBeGreaterThan(lowSkillEmployment?.salary || 0);
    });
  });
});
