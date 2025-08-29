/**
 * Profession Engine - Core profession and career management system
 * Sprint 6: Comprehensive profession modeling with labor market dynamics
 */

import { 
  Profession, 
  Employment, 
  UnemploymentRecord, 
  CareerTransition,
  LaborMarket,
  ProfessionCategory,
  EducationLevel,
  EmploymentStatus,
  UnemploymentReason,
  TransitionType,
  DemandLevel,
  CompetitionLevel,
  SkillImportance
} from './types';
import { Citizen } from '../population/types';

export class ProfessionEngine {
  private professions: Map<string, Profession> = new Map();
  private employmentRecords: Map<string, Employment> = new Map(); // citizenId -> Employment
  private unemploymentRecords: Map<string, UnemploymentRecord> = new Map();
  private laborMarkets: Map<string, LaborMarket> = new Map(); // professionId-cityId -> LaborMarket
  private careerTransitions: CareerTransition[] = [];

  constructor() {
    this.initializeProfessions();
  }

  /**
   * Initialize comprehensive profession database
   */
  private initializeProfessions(): void {
    const professions: Profession[] = [
      // Technology Sector
      {
        id: 'software_engineer',
        name: 'Software Engineer',
        category: ProfessionCategory.TECHNOLOGY,
        description: 'Design and develop software applications and systems',
        requiredSkills: [
          { skillId: 'programming', skillName: 'Programming', minimumLevel: 6, importance: SkillImportance.CRITICAL },
          { skillId: 'problem_solving', skillName: 'Problem Solving', minimumLevel: 7, importance: SkillImportance.CRITICAL },
          { skillId: 'mathematics', skillName: 'Mathematics', minimumLevel: 5, importance: SkillImportance.IMPORTANT }
        ],
        optionalSkills: [
          { skillId: 'communication', skillName: 'Communication', minimumLevel: 5, importance: SkillImportance.PREFERRED },
          { skillId: 'project_management', skillName: 'Project Management', minimumLevel: 4, importance: SkillImportance.NICE_TO_HAVE }
        ],
        educationLevel: EducationLevel.BACHELORS,
        experienceRequired: 0,
        baseSalary: { minimum: 65000, median: 85000, maximum: 120000, currency: 'USD' },
        salaryProgression: {
          entryLevel: { minimum: 65000, median: 75000, maximum: 90000, currency: 'USD' },
          midLevel: { minimum: 85000, median: 105000, maximum: 130000, currency: 'USD' },
          seniorLevel: { minimum: 120000, median: 150000, maximum: 200000, currency: 'USD' },
          executiveLevel: { minimum: 180000, median: 250000, maximum: 400000, currency: 'USD' }
        },
        benefits: {
          healthInsurance: true,
          retirement: true,
          paidTimeOff: 25,
          flexibleSchedule: true,
          professionalDevelopment: true,
          stockOptions: true
        },
        careerLevels: [
          {
            level: 1,
            title: 'Junior Software Engineer',
            salaryMultiplier: 1.0,
            requiredExperience: 0,
            requiredSkills: [
              { skillId: 'programming', skillName: 'Programming', minimumLevel: 5, importance: SkillImportance.CRITICAL }
            ],
            responsibilities: ['Write code under supervision', 'Debug simple issues', 'Learn development practices']
          },
          {
            level: 2,
            title: 'Software Engineer',
            salaryMultiplier: 1.4,
            requiredExperience: 2,
            requiredSkills: [
              { skillId: 'programming', skillName: 'Programming', minimumLevel: 7, importance: SkillImportance.CRITICAL },
              { skillId: 'system_design', skillName: 'System Design', minimumLevel: 5, importance: SkillImportance.IMPORTANT }
            ],
            responsibilities: ['Design software components', 'Code review', 'Mentor junior developers']
          },
          {
            level: 3,
            title: 'Senior Software Engineer',
            salaryMultiplier: 1.8,
            requiredExperience: 5,
            requiredSkills: [
              { skillId: 'programming', skillName: 'Programming', minimumLevel: 8, importance: SkillImportance.CRITICAL },
              { skillId: 'system_design', skillName: 'System Design', minimumLevel: 7, importance: SkillImportance.CRITICAL },
              { skillId: 'leadership', skillName: 'Leadership', minimumLevel: 6, importance: SkillImportance.IMPORTANT }
            ],
            responsibilities: ['Lead technical projects', 'Architecture decisions', 'Team leadership']
          }
        ],
        promotionCriteria: {
          performanceThreshold: 0.75,
          skillRequirements: [
            { skillId: 'programming', skillName: 'Programming', minimumLevel: 7, importance: SkillImportance.CRITICAL }
          ],
          experienceRequired: 2,
          availabilityRate: 0.3
        },
        lateralMoves: ['data_scientist', 'product_manager', 'devops_engineer'],
        demandLevel: DemandLevel.VERY_HIGH,
        growthProjection: 'rapidly_growing' as any,
        automationRisk: 'low' as any,
        urbanPreference: 0.8,
        remoteWorkCompatible: true,
        travelRequirement: 'none' as any
      },

      // Healthcare Sector
      {
        id: 'registered_nurse',
        name: 'Registered Nurse',
        category: ProfessionCategory.HEALTHCARE,
        description: 'Provide patient care and support in healthcare settings',
        requiredSkills: [
          { skillId: 'medical_knowledge', skillName: 'Medical Knowledge', minimumLevel: 7, importance: SkillImportance.CRITICAL },
          { skillId: 'empathy', skillName: 'Empathy', minimumLevel: 8, importance: SkillImportance.CRITICAL },
          { skillId: 'communication', skillName: 'Communication', minimumLevel: 7, importance: SkillImportance.CRITICAL }
        ],
        optionalSkills: [
          { skillId: 'stress_management', skillName: 'Stress Management', minimumLevel: 6, importance: SkillImportance.IMPORTANT },
          { skillId: 'leadership', skillName: 'Leadership', minimumLevel: 5, importance: SkillImportance.PREFERRED }
        ],
        educationLevel: EducationLevel.ASSOCIATES,
        experienceRequired: 0,
        baseSalary: { minimum: 55000, median: 70000, maximum: 90000, currency: 'USD' },
        salaryProgression: {
          entryLevel: { minimum: 55000, median: 62000, maximum: 70000, currency: 'USD' },
          midLevel: { minimum: 65000, median: 75000, maximum: 85000, currency: 'USD' },
          seniorLevel: { minimum: 80000, median: 95000, maximum: 120000, currency: 'USD' }
        },
        benefits: {
          healthInsurance: true,
          retirement: true,
          paidTimeOff: 20,
          flexibleSchedule: false,
          professionalDevelopment: true,
          stockOptions: false
        },
        careerLevels: [
          {
            level: 1,
            title: 'Staff Nurse',
            salaryMultiplier: 1.0,
            requiredExperience: 0,
            requiredSkills: [
              { skillId: 'medical_knowledge', skillName: 'Medical Knowledge', minimumLevel: 6, importance: SkillImportance.CRITICAL }
            ],
            responsibilities: ['Direct patient care', 'Medication administration', 'Patient monitoring']
          },
          {
            level: 2,
            title: 'Charge Nurse',
            salaryMultiplier: 1.3,
            requiredExperience: 3,
            requiredSkills: [
              { skillId: 'medical_knowledge', skillName: 'Medical Knowledge', minimumLevel: 7, importance: SkillImportance.CRITICAL },
              { skillId: 'leadership', skillName: 'Leadership', minimumLevel: 6, importance: SkillImportance.IMPORTANT }
            ],
            responsibilities: ['Supervise nursing staff', 'Coordinate patient care', 'Staff scheduling']
          }
        ],
        promotionCriteria: {
          performanceThreshold: 0.8,
          skillRequirements: [
            { skillId: 'medical_knowledge', skillName: 'Medical Knowledge', minimumLevel: 7, importance: SkillImportance.CRITICAL }
          ],
          experienceRequired: 3,
          availabilityRate: 0.2
        },
        lateralMoves: ['nurse_practitioner', 'healthcare_administrator'],
        demandLevel: DemandLevel.VERY_HIGH,
        growthProjection: 'rapidly_growing' as any,
        automationRisk: 'low' as any,
        urbanPreference: 0.6,
        remoteWorkCompatible: false,
        travelRequirement: 'none' as any
      },

      // Education Sector
      {
        id: 'teacher',
        name: 'Teacher',
        category: ProfessionCategory.EDUCATION,
        description: 'Educate and mentor students in academic subjects',
        requiredSkills: [
          { skillId: 'subject_expertise', skillName: 'Subject Expertise', minimumLevel: 7, importance: SkillImportance.CRITICAL },
          { skillId: 'communication', skillName: 'Communication', minimumLevel: 8, importance: SkillImportance.CRITICAL },
          { skillId: 'patience', skillName: 'Patience', minimumLevel: 8, importance: SkillImportance.CRITICAL }
        ],
        optionalSkills: [
          { skillId: 'creativity', skillName: 'Creativity', minimumLevel: 6, importance: SkillImportance.IMPORTANT },
          { skillId: 'technology', skillName: 'Technology', minimumLevel: 5, importance: SkillImportance.PREFERRED }
        ],
        educationLevel: EducationLevel.BACHELORS,
        experienceRequired: 0,
        baseSalary: { minimum: 40000, median: 55000, maximum: 75000, currency: 'USD' },
        salaryProgression: {
          entryLevel: { minimum: 40000, median: 45000, maximum: 52000, currency: 'USD' },
          midLevel: { minimum: 50000, median: 60000, maximum: 70000, currency: 'USD' },
          seniorLevel: { minimum: 65000, median: 75000, maximum: 90000, currency: 'USD' }
        },
        benefits: {
          healthInsurance: true,
          retirement: true,
          paidTimeOff: 60, // Summer break
          flexibleSchedule: false,
          professionalDevelopment: true,
          stockOptions: false
        },
        careerLevels: [
          {
            level: 1,
            title: 'New Teacher',
            salaryMultiplier: 1.0,
            requiredExperience: 0,
            requiredSkills: [
              { skillId: 'subject_expertise', skillName: 'Subject Expertise', minimumLevel: 6, importance: SkillImportance.CRITICAL }
            ],
            responsibilities: ['Classroom instruction', 'Lesson planning', 'Student assessment']
          },
          {
            level: 2,
            title: 'Experienced Teacher',
            salaryMultiplier: 1.3,
            requiredExperience: 5,
            requiredSkills: [
              { skillId: 'subject_expertise', skillName: 'Subject Expertise', minimumLevel: 7, importance: SkillImportance.CRITICAL },
              { skillId: 'classroom_management', skillName: 'Classroom Management', minimumLevel: 7, importance: SkillImportance.IMPORTANT }
            ],
            responsibilities: ['Advanced instruction', 'Mentor new teachers', 'Curriculum development']
          }
        ],
        promotionCriteria: {
          performanceThreshold: 0.7,
          skillRequirements: [
            { skillId: 'subject_expertise', skillName: 'Subject Expertise', minimumLevel: 7, importance: SkillImportance.CRITICAL }
          ],
          experienceRequired: 5,
          availabilityRate: 0.15
        },
        lateralMoves: ['principal', 'curriculum_specialist', 'education_consultant'],
        demandLevel: DemandLevel.HIGH,
        growthProjection: 'stable' as any,
        automationRisk: 'low' as any,
        urbanPreference: 0.5,
        remoteWorkCompatible: false,
        travelRequirement: 'none' as any
      },

      // Retail Sector
      {
        id: 'retail_associate',
        name: 'Retail Sales Associate',
        category: ProfessionCategory.RETAIL,
        description: 'Assist customers and handle sales transactions in retail environments',
        requiredSkills: [
          { skillId: 'customer_service', skillName: 'Customer Service', minimumLevel: 6, importance: SkillImportance.CRITICAL },
          { skillId: 'communication', skillName: 'Communication', minimumLevel: 6, importance: SkillImportance.CRITICAL }
        ],
        optionalSkills: [
          { skillId: 'sales', skillName: 'Sales', minimumLevel: 5, importance: SkillImportance.IMPORTANT },
          { skillId: 'product_knowledge', skillName: 'Product Knowledge', minimumLevel: 5, importance: SkillImportance.PREFERRED }
        ],
        educationLevel: EducationLevel.HIGH_SCHOOL,
        experienceRequired: 0,
        baseSalary: { minimum: 25000, median: 30000, maximum: 40000, currency: 'USD' },
        salaryProgression: {
          entryLevel: { minimum: 25000, median: 28000, maximum: 32000, currency: 'USD' },
          midLevel: { minimum: 30000, median: 35000, maximum: 42000, currency: 'USD' },
          seniorLevel: { minimum: 38000, median: 45000, maximum: 55000, currency: 'USD' }
        },
        benefits: {
          healthInsurance: false,
          retirement: false,
          paidTimeOff: 10,
          flexibleSchedule: true,
          professionalDevelopment: false,
          stockOptions: false
        },
        careerLevels: [
          {
            level: 1,
            title: 'Sales Associate',
            salaryMultiplier: 1.0,
            requiredExperience: 0,
            requiredSkills: [
              { skillId: 'customer_service', skillName: 'Customer Service', minimumLevel: 5, importance: SkillImportance.CRITICAL }
            ],
            responsibilities: ['Customer assistance', 'Cash register operation', 'Store maintenance']
          },
          {
            level: 2,
            title: 'Senior Sales Associate',
            salaryMultiplier: 1.2,
            requiredExperience: 2,
            requiredSkills: [
              { skillId: 'customer_service', skillName: 'Customer Service', minimumLevel: 7, importance: SkillImportance.CRITICAL },
              { skillId: 'sales', skillName: 'Sales', minimumLevel: 6, importance: SkillImportance.IMPORTANT }
            ],
            responsibilities: ['Lead sales initiatives', 'Train new associates', 'Inventory management']
          }
        ],
        promotionCriteria: {
          performanceThreshold: 0.65,
          skillRequirements: [
            { skillId: 'customer_service', skillName: 'Customer Service', minimumLevel: 6, importance: SkillImportance.CRITICAL }
          ],
          experienceRequired: 1,
          availabilityRate: 0.4
        },
        lateralMoves: ['store_manager', 'sales_representative'],
        demandLevel: DemandLevel.MODERATE,
        growthProjection: 'stable' as any,
        automationRisk: 'moderate' as any,
        urbanPreference: 0.7,
        remoteWorkCompatible: false,
        travelRequirement: 'none' as any
      }
    ];

    // Store professions in map
    professions.forEach(profession => {
      this.professions.set(profession.id, profession);
    });
  }

  /**
   * Assign a profession to a citizen based on their skills and preferences
   */
  assignProfession(citizen: Citizen, preferredProfessions?: string[]): Employment | null {
    const suitableProfessions = this.findSuitableProfessions(citizen, preferredProfessions);
    
    if (suitableProfessions.length === 0) {
      // Create unemployment record
      this.createUnemploymentRecord(citizen.id, UnemploymentReason.NEW_GRADUATE);
      return null;
    }

    // Select best profession based on citizen psychology and market conditions
    const selectedProfession = this.selectBestProfession(citizen, suitableProfessions);
    const profession = this.professions.get(selectedProfession.id)!;

    // Calculate starting salary based on skills and market conditions
    const startingSalary = this.calculateStartingSalary(citizen, profession);

    // Create employment record
    const employment: Employment = {
      citizenId: citizen.id,
      professionId: profession.id,
      title: profession.careerLevels[0].title,
      level: 1,
      salary: startingSalary,
      startDate: new Date(),
      performanceRating: 0.5 + (Math.random() * 0.3), // 0.5-0.8 initial performance
      skillProficiency: this.calculateInitialSkillProficiency(citizen, profession),
      experienceYears: 0,
      employmentStatus: EmploymentStatus.EMPLOYED,
      workSchedule: 'full_time' as any,
      satisfactionLevel: this.calculateJobSatisfaction(citizen, profession),
      promotionEligible: false,
      trainingPrograms: [],
      mentorshipStatus: 'none' as any
    };

    this.employmentRecords.set(citizen.id, employment);
    return employment;
  }

  /**
   * Find professions suitable for a citizen based on their skills and education
   */
  private findSuitableProfessions(citizen: Citizen, preferredProfessions?: string[]): Profession[] {
    const suitable: Profession[] = [];

    for (const profession of this.professions.values()) {
      // Check education requirements
      if (!this.meetsEducationRequirement(citizen, profession)) {
        continue;
      }

      // Check skill requirements
      if (!this.meetsSkillRequirements(citizen, profession)) {
        continue;
      }

      // If preferred professions specified, prioritize those
      if (preferredProfessions && preferredProfessions.includes(profession.id)) {
        suitable.unshift(profession); // Add to front
      } else {
        suitable.push(profession);
      }
    }

    return suitable;
  }

  /**
   * Select the best profession for a citizen based on psychology and market conditions
   */
  private selectBestProfession(citizen: Citizen, suitableProfessions: Profession[]): Profession {
    // Score each profession based on citizen psychology and preferences
    const scoredProfessions = suitableProfessions.map(profession => {
      let score = 0;

      // Personality fit scoring
      if (profession.category === ProfessionCategory.TECHNOLOGY) {
        score += citizen.psychologicalProfile.openness * 0.3;
        score += citizen.psychologicalProfile.conscientiousness * 0.2;
      } else if (profession.category === ProfessionCategory.HEALTHCARE) {
        score += citizen.psychologicalProfile.agreeableness * 0.4;
        score += citizen.psychologicalProfile.conscientiousness * 0.3;
      } else if (profession.category === ProfessionCategory.EDUCATION) {
        score += citizen.psychologicalProfile.agreeableness * 0.3;
        score += citizen.psychologicalProfile.extraversion * 0.2;
      }

      // Salary preference (higher income citizens prefer higher-paying jobs)
      const salaryScore = profession.baseSalary.median / 100000; // Normalize to 0-1
      score += salaryScore * 0.3;

      // Market demand (citizens prefer jobs with good prospects)
      const demandScore = this.getDemandScore(profession.demandLevel);
      score += demandScore * 0.2;

      return { profession, score };
    });

    // Sort by score and return best match
    scoredProfessions.sort((a, b) => b.score - a.score);
    return scoredProfessions[0].profession;
  }

  /**
   * Calculate starting salary based on citizen skills and market conditions
   */
  private calculateStartingSalary(citizen: Citizen, profession: Profession): number {
    const baseSalary = profession.salaryProgression.entryLevel.median;
    let multiplier = 1.0;

    // Skill bonus (better skills = higher starting salary)
    const skillMatch = this.calculateSkillMatch(citizen, profession);
    multiplier += (skillMatch - 0.5) * 0.3; // ±15% based on skill match

    // Education bonus
    if (this.getEducationLevel(citizen) > profession.educationLevel) {
      multiplier += 0.1; // 10% bonus for over-qualification
    }

    // Market conditions (high demand = higher salaries)
    const demandMultiplier = this.getDemandMultiplier(profession.demandLevel);
    multiplier *= demandMultiplier;

    return Math.round(baseSalary * multiplier);
  }

  /**
   * Process career advancement for all employed citizens
   */
  processCareerAdvancement(): CareerTransition[] {
    const transitions: CareerTransition[] = [];

    for (const employment of this.employmentRecords.values()) {
      if (employment.employmentStatus !== EmploymentStatus.EMPLOYED) {
        continue;
      }

      // Update experience
      employment.experienceYears += 1/12; // Monthly progression

      // Check for promotion eligibility
      const profession = this.professions.get(employment.professionId)!;
      const nextLevel = employment.level + 1;
      
      if (nextLevel < profession.careerLevels.length) {
        const nextCareerLevel = profession.careerLevels[nextLevel];
        
        if (this.isEligibleForPromotion(employment, nextCareerLevel, profession)) {
          // Process promotion
          const transition = this.processPromotion(employment, nextCareerLevel);
          if (transition) {
            transitions.push(transition);
          }
        }
      }

      // Update performance based on skill match and satisfaction
      this.updatePerformance(employment);
    }

    return transitions;
  }

  /**
   * Get comprehensive labor market analytics
   */
  getLaborMarketAnalytics(cityId: string): LaborMarket[] {
    const markets: LaborMarket[] = [];

    for (const profession of this.professions.values()) {
      const employed = Array.from(this.employmentRecords.values())
        .filter(emp => emp.professionId === profession.id && emp.employmentStatus === EmploymentStatus.EMPLOYED);
      
      const unemployed = Array.from(this.unemploymentRecords.values())
        .filter(unemp => unemp.previousProfession === profession.id);

      const totalPositions = employed.length + Math.floor(employed.length * 0.1); // 10% vacancy rate
      const openPositions = totalPositions - employed.length;
      
      const market: LaborMarket = {
        professionId: profession.id,
        cityId: cityId,
        totalPositions,
        filledPositions: employed.length,
        openPositions,
        qualifiedCandidates: unemployed.length,
        competitionLevel: this.calculateCompetitionLevel(employed.length, unemployed.length),
        salaryTrend: 'stable' as any,
        demandTrend: 'stable' as any,
        averageSalary: employed.reduce((sum, emp) => sum + emp.salary, 0) / employed.length || 0,
        medianSalary: this.calculateMedianSalary(employed),
        salaryGrowthRate: 0.03, // 3% annual growth
        turnoverRate: 0.15, // 15% annual turnover
        timeToFill: 30 // 30 days average
      };

      markets.push(market);
    }

    return markets;
  }

  /**
   * Get unemployment statistics by demographics
   */
  getUnemploymentStatistics(cityId: string): any {
    const unemployed = Array.from(this.unemploymentRecords.values());
    const employed = Array.from(this.employmentRecords.values())
      .filter(emp => emp.employmentStatus === EmploymentStatus.EMPLOYED);

    const totalLaborForce = unemployed.length + employed.length;
    const unemploymentRate = totalLaborForce > 0 ? unemployed.length / totalLaborForce : 0;

    // Group by reason
    const byReason = unemployed.reduce((acc, record) => {
      acc[record.reason] = (acc[record.reason] || 0) + 1;
      return acc;
    }, {} as Record<UnemploymentReason, number>);

    // Calculate average unemployment duration
    const avgDuration = unemployed.reduce((sum, record) => sum + record.unemploymentDuration, 0) / unemployed.length || 0;

    return {
      totalUnemployed: unemployed.length,
      totalEmployed: employed.length,
      unemploymentRate,
      averageDuration: avgDuration,
      byReason,
      activelySearching: unemployed.filter(u => u.activelySearching).length,
      receivingBenefits: unemployed.filter(u => u.unemploymentBenefits).length
    };
  }

  // Helper methods
  private meetsEducationRequirement(citizen: Citizen, profession: Profession): boolean {
    const citizenEducation = this.getEducationLevel(citizen);
    return citizenEducation >= profession.educationLevel;
  }

  private meetsSkillRequirements(citizen: Citizen, profession: Profession): boolean {
    for (const requirement of profession.requiredSkills) {
      const citizenSkillLevel = citizen.skills[requirement.skillId] || 0;
      if (citizenSkillLevel < requirement.minimumLevel) {
        return false;
      }
    }
    return true;
  }

  private getEducationLevel(citizen: Citizen): EducationLevel {
    // Map citizen education to EducationLevel enum
    // This would be based on citizen's education property
    return EducationLevel.BACHELORS; // Placeholder
  }

  private calculateSkillMatch(citizen: Citizen, profession: Profession): number {
    let totalWeight = 0;
    let weightedScore = 0;

    for (const requirement of profession.requiredSkills) {
      const citizenLevel = citizen.skills[requirement.skillId] || 0;
      const weight = requirement.importance === SkillImportance.CRITICAL ? 3 : 
                    requirement.importance === SkillImportance.IMPORTANT ? 2 : 1;
      
      const score = Math.min(citizenLevel / requirement.minimumLevel, 1.5); // Cap at 150%
      weightedScore += score * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? weightedScore / totalWeight : 0.5;
  }

  private getDemandScore(demandLevel: DemandLevel): number {
    switch (demandLevel) {
      case DemandLevel.VERY_LOW: return 0.1;
      case DemandLevel.LOW: return 0.3;
      case DemandLevel.MODERATE: return 0.5;
      case DemandLevel.HIGH: return 0.7;
      case DemandLevel.VERY_HIGH: return 0.9;
      default: return 0.5;
    }
  }

  private getDemandMultiplier(demandLevel: DemandLevel): number {
    switch (demandLevel) {
      case DemandLevel.VERY_LOW: return 0.8;
      case DemandLevel.LOW: return 0.9;
      case DemandLevel.MODERATE: return 1.0;
      case DemandLevel.HIGH: return 1.1;
      case DemandLevel.VERY_HIGH: return 1.2;
      default: return 1.0;
    }
  }

  private calculateInitialSkillProficiency(citizen: Citizen, profession: Profession): Record<string, number> {
    const proficiency: Record<string, number> = {};
    
    for (const requirement of profession.requiredSkills) {
      proficiency[requirement.skillId] = citizen.skills[requirement.skillId] || 0;
    }

    return proficiency;
  }

  private calculateJobSatisfaction(citizen: Citizen, profession: Profession): number {
    let satisfaction = 0.5; // Base satisfaction

    // Personality fit
    if (profession.category === ProfessionCategory.TECHNOLOGY) {
      satisfaction += (citizen.psychologicalProfile.openness - 0.5) * 0.3;
    } else if (profession.category === ProfessionCategory.HEALTHCARE) {
      satisfaction += (citizen.psychologicalProfile.agreeableness - 0.5) * 0.3;
    }

    // Salary satisfaction (relative to expectations)
    const salaryExpectation = citizen.income * 1.1; // Expect 10% more
    if (profession.baseSalary.median >= salaryExpectation) {
      satisfaction += 0.2;
    }

    return Math.max(0, Math.min(1, satisfaction));
  }

  private createUnemploymentRecord(citizenId: string, reason: UnemploymentReason): void {
    const record: UnemploymentRecord = {
      citizenId,
      unemploymentStart: new Date(),
      unemploymentDuration: 0,
      reason,
      activelySearching: true,
      applicationsSubmitted: 0,
      interviewsReceived: 0,
      jobOffersReceived: 0,
      unemploymentBenefits: reason === UnemploymentReason.LAYOFF,
      retrainingPrograms: [],
      jobSearchAssistance: false,
      skillsGap: [],
      locationConstraints: false,
      transportationIssues: false,
      childcareNeeds: false
    };

    this.unemploymentRecords.set(citizenId, record);
  }

  private isEligibleForPromotion(employment: Employment, nextLevel: any, profession: Profession): boolean {
    // Check experience requirement
    if (employment.experienceYears < nextLevel.requiredExperience) {
      return false;
    }

    // Check performance threshold
    if (employment.performanceRating < profession.promotionCriteria.performanceThreshold) {
      return false;
    }

    // Check skill requirements
    for (const requirement of nextLevel.requiredSkills) {
      const currentLevel = employment.skillProficiency[requirement.skillId] || 0;
      if (currentLevel < requirement.minimumLevel) {
        return false;
      }
    }

    // Random availability based on promotion rate
    return Math.random() < profession.promotionCriteria.availabilityRate;
  }

  private processPromotion(employment: Employment, nextLevel: any): CareerTransition | null {
    const oldLevel = employment.level;
    const oldSalary = employment.salary;

    // Update employment record
    employment.level = nextLevel.level;
    employment.title = nextLevel.title;
    employment.salary = Math.round(employment.salary * nextLevel.salaryMultiplier);
    employment.promotionEligible = false;

    // Create transition record
    const transition: CareerTransition = {
      citizenId: employment.citizenId,
      fromProfession: employment.professionId,
      toProfession: employment.professionId,
      transitionDate: new Date(),
      transitionType: TransitionType.PROMOTION,
      retrainingRequired: false,
      salaryChange: ((employment.salary - oldSalary) / oldSalary) * 100,
      satisfactionChange: 0.1, // Promotions increase satisfaction
      mentorshipReceived: false,
      formalTraining: false,
      networkingSupport: false,
      financialSupport: 0
    };

    this.careerTransitions.push(transition);
    return transition;
  }

  private updatePerformance(employment: Employment): void {
    // Performance influenced by skill match, satisfaction, and random factors
    const basePerformance = employment.performanceRating;
    const satisfactionBonus = (employment.satisfactionLevel - 0.5) * 0.2;
    const randomFactor = (Math.random() - 0.5) * 0.1;
    
    employment.performanceRating = Math.max(0, Math.min(1, 
      basePerformance + satisfactionBonus + randomFactor
    ));
  }

  private calculateCompetitionLevel(employed: number, unemployed: number): CompetitionLevel {
    const ratio = unemployed / (employed + unemployed);
    if (ratio < 0.05) return CompetitionLevel.LOW;
    if (ratio < 0.1) return CompetitionLevel.MODERATE;
    if (ratio < 0.2) return CompetitionLevel.HIGH;
    return CompetitionLevel.VERY_HIGH;
  }

  private calculateMedianSalary(employed: Employment[]): number {
    if (employed.length === 0) return 0;
    
    const salaries = employed.map(emp => emp.salary).sort((a, b) => a - b);
    const mid = Math.floor(salaries.length / 2);
    
    return salaries.length % 2 === 0 
      ? (salaries[mid - 1] + salaries[mid]) / 2 
      : salaries[mid];
  }

  // Getter methods
  getProfession(professionId: string): Profession | undefined {
    return this.professions.get(professionId);
  }

  getAllProfessions(): Profession[] {
    return Array.from(this.professions.values());
  }

  getEmployment(citizenId: string): Employment | undefined {
    return this.employmentRecords.get(citizenId);
  }

  getUnemploymentRecord(citizenId: string): UnemploymentRecord | undefined {
    return this.unemploymentRecords.get(citizenId);
  }

  getCareerTransitions(citizenId?: string): CareerTransition[] {
    if (citizenId) {
      return this.careerTransitions.filter(t => t.citizenId === citizenId);
    }
    return this.careerTransitions;
  }
}
