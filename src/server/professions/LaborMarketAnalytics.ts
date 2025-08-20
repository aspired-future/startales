/**
 * Labor Market Analytics - Advanced labor market analysis and forecasting
 * Sprint 6: Comprehensive labor market dynamics with supply/demand tracking
 */

import { 
  LaborMarket, 
  Employment, 
  UnemploymentRecord, 
  Profession,
  ProfessionMetrics,
  CompetitionLevel,
  SalaryTrend,
  DemandTrend,
  ProfessionCategory,
  EmploymentStatus,
  UnemploymentReason
} from './types.js';
import { Citizen } from '../population/types.js';

export interface LaborMarketForecast {
  professionId: string;
  timeframe: 'quarterly' | 'annual' | 'five_year';
  
  // Demand Projections
  projectedDemand: number;
  demandGrowthRate: number;
  newPositionsExpected: number;
  
  // Supply Projections
  projectedSupply: number;
  graduatesEntering: number;
  retirements: number;
  careerChangers: number;
  
  // Market Balance
  supplyDemandRatio: number;
  competitionForecast: CompetitionLevel;
  salaryForecast: SalaryTrend;
  
  // Risk Factors
  automationThreat: number; // 0-1
  economicSensitivity: number; // 0-1
  skillsGapRisk: number; // 0-1
}

export interface SkillsGapAnalysis {
  professionId: string;
  skillId: string;
  skillName: string;
  
  // Current State
  requiredLevel: number;
  averageLevel: number;
  gapSize: number;
  
  // Impact
  affectedPositions: number;
  salaryImpact: number; // % premium for skill
  productivityImpact: number;
  
  // Solutions
  trainingPrograms: string[];
  estimatedTrainingTime: number; // months
  trainingCost: number;
}

export interface WageAnalysis {
  professionId: string;
  cityId: string;
  
  // Current Wages
  currentMedian: number;
  currentRange: { min: number; max: number };
  
  // Historical Trends
  oneYearGrowth: number;
  fiveYearGrowth: number;
  inflationAdjustedGrowth: number;
  
  // Market Factors
  demandPressure: number; // 0-1
  supplyConstraints: number; // 0-1
  skillPremium: number; // % above base
  
  // Projections
  projectedGrowth: number;
  confidenceInterval: { lower: number; upper: number };
}

export interface CareerMobilityAnalysis {
  fromProfessionId: string;
  toProfessionId: string;
  
  // Transition Metrics
  transitionRate: number; // % of workers who make this move
  successRate: number; // % who succeed in new role
  averageTimeToTransition: number; // months
  
  // Requirements
  skillsGap: SkillsGapAnalysis[];
  retrainingRequired: boolean;
  experienceTransferability: number; // 0-1
  
  // Outcomes
  averageSalaryChange: number; // %
  satisfactionChange: number; // 0-1
  careerAdvancementImpact: number; // 0-1
}

export class LaborMarketAnalytics {
  private historicalData: Map<string, ProfessionMetrics[]> = new Map();
  private marketForecasts: Map<string, LaborMarketForecast> = new Map();
  private skillsGaps: Map<string, SkillsGapAnalysis[]> = new Map();

  /**
   * Analyze current labor market conditions across all professions
   */
  analyzeLaborMarket(
    professions: Profession[],
    employmentRecords: Employment[],
    unemploymentRecords: UnemploymentRecord[],
    citizens: Citizen[]
  ): LaborMarket[] {
    const markets: LaborMarket[] = [];

    for (const profession of professions) {
      const market = this.analyzeProfessionMarket(
        profession,
        employmentRecords,
        unemploymentRecords,
        citizens
      );
      markets.push(market);
    }

    return markets;
  }

  /**
   * Analyze labor market for a specific profession
   */
  private analyzeProfessionMarket(
    profession: Profession,
    employmentRecords: Employment[],
    unemploymentRecords: UnemploymentRecord[],
    citizens: Citizen[]
  ): LaborMarket {
    // Get employed in this profession
    const employed = employmentRecords.filter(
      emp => emp.professionId === profession.id && 
             emp.employmentStatus === EmploymentStatus.EMPLOYED
    );

    // Get unemployed with this profession background
    const unemployedWithBackground = unemploymentRecords.filter(
      unemp => unemp.previousProfession === profession.id
    );

    // Calculate qualified candidates (unemployed + underemployed + career changers)
    const qualifiedCandidates = this.calculateQualifiedCandidates(
      profession,
      unemploymentRecords,
      citizens
    );

    // Estimate total positions needed (based on economic growth and turnover)
    const totalPositions = this.estimateTotalPositions(profession, employed.length);
    const openPositions = Math.max(0, totalPositions - employed.length);

    // Calculate market dynamics
    const competitionLevel = this.calculateCompetitionLevel(
      openPositions,
      qualifiedCandidates
    );

    const salaryTrend = this.calculateSalaryTrend(profession.id, employed);
    const demandTrend = this.calculateDemandTrend(profession);

    // Calculate salary statistics
    const salaries = employed.map(emp => emp.salary);
    const averageSalary = salaries.reduce((sum, sal) => sum + sal, 0) / salaries.length || 0;
    const medianSalary = this.calculateMedian(salaries);

    // Calculate market metrics
    const salaryGrowthRate = this.calculateSalaryGrowthRate(profession.id);
    const turnoverRate = this.calculateTurnoverRate(profession.id, employed);
    const timeToFill = this.calculateTimeToFill(profession, competitionLevel);

    return {
      professionId: profession.id,
      cityId: 'default', // Would be dynamic in multi-city system
      totalPositions,
      filledPositions: employed.length,
      openPositions,
      qualifiedCandidates,
      competitionLevel,
      salaryTrend,
      demandTrend,
      averageSalary,
      medianSalary,
      salaryGrowthRate,
      turnoverRate,
      timeToFill
    };
  }

  /**
   * Generate labor market forecast for a profession
   */
  generateForecast(
    profession: Profession,
    currentMarket: LaborMarket,
    timeframe: 'quarterly' | 'annual' | 'five_year'
  ): LaborMarketForecast {
    const timeMultiplier = timeframe === 'quarterly' ? 0.25 : 
                          timeframe === 'annual' ? 1 : 5;

    // Demand projections based on growth trends and economic factors
    const baseGrowthRate = this.getBaseGrowthRate(profession);
    const demandGrowthRate = baseGrowthRate * timeMultiplier;
    const projectedDemand = Math.round(
      currentMarket.totalPositions * (1 + demandGrowthRate)
    );
    const newPositionsExpected = projectedDemand - currentMarket.totalPositions;

    // Supply projections
    const graduatesEntering = this.estimateGraduates(profession, timeMultiplier);
    const retirements = this.estimateRetirements(profession, timeMultiplier);
    const careerChangers = this.estimateCareerChangers(profession, timeMultiplier);
    const projectedSupply = currentMarket.filledPositions + graduatesEntering - retirements + careerChangers;

    // Market balance analysis
    const supplyDemandRatio = projectedSupply / projectedDemand;
    const competitionForecast = this.forecastCompetition(supplyDemandRatio);
    const salaryForecast = this.forecastSalaryTrend(supplyDemandRatio, profession);

    // Risk assessment
    const automationThreat = this.assessAutomationRisk(profession);
    const economicSensitivity = this.assessEconomicSensitivity(profession);
    const skillsGapRisk = this.assessSkillsGapRisk(profession);

    const forecast: LaborMarketForecast = {
      professionId: profession.id,
      timeframe,
      projectedDemand,
      demandGrowthRate,
      newPositionsExpected,
      projectedSupply,
      graduatesEntering,
      retirements,
      careerChangers,
      supplyDemandRatio,
      competitionForecast,
      salaryForecast,
      automationThreat,
      economicSensitivity,
      skillsGapRisk
    };

    this.marketForecasts.set(`${profession.id}-${timeframe}`, forecast);
    return forecast;
  }

  /**
   * Analyze skills gaps in the labor market
   */
  analyzeSkillsGaps(
    profession: Profession,
    employmentRecords: Employment[]
  ): SkillsGapAnalysis[] {
    const gaps: SkillsGapAnalysis[] = [];
    const employed = employmentRecords.filter(emp => emp.professionId === profession.id);

    for (const skillReq of profession.requiredSkills) {
      // Calculate current skill levels
      const skillLevels = employed.map(emp => 
        emp.skillProficiency[skillReq.skillId] || 0
      );
      
      const averageLevel = skillLevels.reduce((sum, level) => sum + level, 0) / skillLevels.length || 0;
      const gapSize = Math.max(0, skillReq.minimumLevel - averageLevel);

      if (gapSize > 0) {
        // Calculate impact
        const affectedPositions = skillLevels.filter(level => level < skillReq.minimumLevel).length;
        const salaryImpact = this.calculateSkillSalaryImpact(skillReq, gapSize);
        const productivityImpact = gapSize * 0.1; // 10% productivity loss per skill point gap

        // Suggest solutions
        const trainingPrograms = this.suggestTrainingPrograms(skillReq);
        const estimatedTrainingTime = Math.ceil(gapSize * 2); // 2 months per skill point
        const trainingCost = estimatedTrainingTime * 2000; // $2000 per month

        gaps.push({
          professionId: profession.id,
          skillId: skillReq.skillId,
          skillName: skillReq.skillName,
          requiredLevel: skillReq.minimumLevel,
          averageLevel,
          gapSize,
          affectedPositions,
          salaryImpact,
          productivityImpact,
          trainingPrograms,
          estimatedTrainingTime,
          trainingCost
        });
      }
    }

    this.skillsGaps.set(profession.id, gaps);
    return gaps;
  }

  /**
   * Analyze wage trends and projections
   */
  analyzeWages(
    profession: Profession,
    employmentRecords: Employment[],
    cityId: string = 'default'
  ): WageAnalysis {
    const employed = employmentRecords.filter(emp => emp.professionId === profession.id);
    const salaries = employed.map(emp => emp.salary);

    // Current wage statistics
    const currentMedian = this.calculateMedian(salaries);
    const currentRange = {
      min: Math.min(...salaries) || 0,
      max: Math.max(...salaries) || 0
    };

    // Historical trends (would use actual historical data in production)
    const oneYearGrowth = this.getHistoricalGrowth(profession.id, 1);
    const fiveYearGrowth = this.getHistoricalGrowth(profession.id, 5);
    const inflationRate = 0.025; // 2.5% annual inflation
    const inflationAdjustedGrowth = oneYearGrowth - inflationRate;

    // Market factors
    const demandPressure = this.calculateDemandPressure(profession);
    const supplyConstraints = this.calculateSupplyConstraints(profession);
    const skillPremium = this.calculateSkillPremium(profession, employed);

    // Projections
    const projectedGrowth = this.projectWageGrowth(
      demandPressure,
      supplyConstraints,
      skillPremium
    );
    const confidenceInterval = this.calculateConfidenceInterval(projectedGrowth);

    return {
      professionId: profession.id,
      cityId,
      currentMedian,
      currentRange,
      oneYearGrowth,
      fiveYearGrowth,
      inflationAdjustedGrowth,
      demandPressure,
      supplyConstraints,
      skillPremium,
      projectedGrowth,
      confidenceInterval
    };
  }

  /**
   * Analyze career mobility patterns between professions
   */
  analyzeCareerMobility(
    fromProfession: Profession,
    toProfession: Profession,
    careerTransitions: any[]
  ): CareerMobilityAnalysis {
    // Find transitions between these professions
    const transitions = careerTransitions.filter(
      t => t.fromProfession === fromProfession.id && t.toProfession === toProfession.id
    );

    // Calculate transition metrics
    const transitionRate = transitions.length / 1000; // Per 1000 workers (placeholder)
    const successfulTransitions = transitions.filter(t => t.satisfactionChange > 0);
    const successRate = successfulTransitions.length / transitions.length || 0;
    const averageTimeToTransition = transitions.reduce(
      (sum, t) => sum + (t.retrainingRequired ? 6 : 3), 0
    ) / transitions.length || 3;

    // Analyze skill requirements
    const skillsGap = this.compareSkillRequirements(fromProfession, toProfession);
    const retrainingRequired = skillsGap.some(gap => gap.gapSize > 2);
    const experienceTransferability = this.calculateExperienceTransferability(
      fromProfession,
      toProfession
    );

    // Analyze outcomes
    const averageSalaryChange = transitions.reduce(
      (sum, t) => sum + t.salaryChange, 0
    ) / transitions.length || 0;
    const satisfactionChange = transitions.reduce(
      (sum, t) => sum + t.satisfactionChange, 0
    ) / transitions.length || 0;
    const careerAdvancementImpact = this.calculateCareerAdvancementImpact(
      fromProfession,
      toProfession
    );

    return {
      fromProfessionId: fromProfession.id,
      toProfessionId: toProfession.id,
      transitionRate,
      successRate,
      averageTimeToTransition,
      skillsGap,
      retrainingRequired,
      experienceTransferability,
      averageSalaryChange,
      satisfactionChange,
      careerAdvancementImpact
    };
  }

  // Helper methods for calculations
  private calculateQualifiedCandidates(
    profession: Profession,
    unemploymentRecords: UnemploymentRecord[],
    citizens: Citizen[]
  ): number {
    // Count unemployed with relevant background
    const unemployedQualified = unemploymentRecords.filter(
      unemp => unemp.previousProfession === profession.id ||
               this.hasRelevantSkills(citizens.find(c => c.id === unemp.citizenId), profession)
    ).length;

    // Estimate career changers and new graduates
    const potentialCareerChangers = Math.floor(citizens.length * 0.02); // 2% considering career change
    const newGraduates = Math.floor(citizens.length * 0.01); // 1% new graduates

    return unemployedQualified + potentialCareerChangers + newGraduates;
  }

  private hasRelevantSkills(citizen: Citizen | undefined, profession: Profession): boolean {
    if (!citizen) return false;
    
    let matchingSkills = 0;
    for (const requirement of profession.requiredSkills) {
      const citizenLevel = citizen.skills[requirement.skillId] || 0;
      if (citizenLevel >= requirement.minimumLevel * 0.8) { // 80% of required level
        matchingSkills++;
      }
    }
    
    return matchingSkills >= profession.requiredSkills.length * 0.6; // 60% skill match
  }

  private estimateTotalPositions(profession: Profession, currentEmployed: number): number {
    // Base on economic growth and profession-specific factors
    const economicGrowthRate = 0.03; // 3% annual growth
    const professionGrowthMultiplier = this.getProfessionGrowthMultiplier(profession);
    
    return Math.round(currentEmployed * (1 + economicGrowthRate * professionGrowthMultiplier));
  }

  private getProfessionGrowthMultiplier(profession: Profession): number {
    switch (profession.category) {
      case ProfessionCategory.TECHNOLOGY: return 1.5; // High growth
      case ProfessionCategory.HEALTHCARE: return 1.3; // High growth
      case ProfessionCategory.EDUCATION: return 1.1; // Moderate growth
      case ProfessionCategory.MANUFACTURING: return 0.8; // Declining
      case ProfessionCategory.RETAIL: return 0.9; // Slow growth
      default: return 1.0; // Average growth
    }
  }

  private calculateCompetitionLevel(openPositions: number, qualifiedCandidates: number): CompetitionLevel {
    if (openPositions === 0) return CompetitionLevel.VERY_HIGH;
    
    const ratio = qualifiedCandidates / openPositions;
    if (ratio <= 1) return CompetitionLevel.LOW;
    if (ratio <= 2) return CompetitionLevel.MODERATE;
    if (ratio <= 4) return CompetitionLevel.HIGH;
    return CompetitionLevel.VERY_HIGH;
  }

  private calculateSalaryTrend(professionId: string, employed: Employment[]): SalaryTrend {
    // Simplified calculation - would use historical data in production
    const avgPerformance = employed.reduce((sum, emp) => sum + emp.performanceRating, 0) / employed.length || 0.5;
    
    if (avgPerformance > 0.8) return SalaryTrend.RAPIDLY_GROWING;
    if (avgPerformance > 0.6) return SalaryTrend.GROWING;
    if (avgPerformance > 0.4) return SalaryTrend.STABLE;
    return SalaryTrend.DECLINING;
  }

  private calculateDemandTrend(profession: Profession): DemandTrend {
    // Map profession growth projection to demand trend
    switch (profession.growthProjection) {
      case 'rapidly_growing': return DemandTrend.RAPIDLY_GROWING;
      case 'growing': return DemandTrend.GROWING;
      case 'stable': return DemandTrend.STABLE;
      case 'declining': return DemandTrend.DECLINING;
      default: return DemandTrend.STABLE;
    }
  }

  private calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private calculateSalaryGrowthRate(professionId: string): number {
    // Placeholder - would use historical data
    return 0.03 + (Math.random() * 0.04); // 3-7% annual growth
  }

  private calculateTurnoverRate(professionId: string, employed: Employment[]): number {
    // Estimate based on satisfaction levels
    const avgSatisfaction = employed.reduce((sum, emp) => sum + emp.satisfactionLevel, 0) / employed.length || 0.5;
    return Math.max(0.05, 0.3 - (avgSatisfaction * 0.2)); // 5-30% turnover
  }

  private calculateTimeToFill(profession: Profession, competition: CompetitionLevel): number {
    const baseTime = 30; // 30 days base
    const competitionMultiplier = competition === CompetitionLevel.LOW ? 0.5 :
                                 competition === CompetitionLevel.MODERATE ? 1.0 :
                                 competition === CompetitionLevel.HIGH ? 1.5 : 2.0;
    
    const skillComplexity = profession.requiredSkills.length * 5; // 5 days per required skill
    
    return Math.round(baseTime * competitionMultiplier + skillComplexity);
  }

  // Additional helper methods would be implemented here...
  private getBaseGrowthRate(profession: Profession): number {
    return this.getProfessionGrowthMultiplier(profession) * 0.03;
  }

  private estimateGraduates(profession: Profession, timeMultiplier: number): number {
    return Math.floor(100 * timeMultiplier * this.getProfessionGrowthMultiplier(profession));
  }

  private estimateRetirements(profession: Profession, timeMultiplier: number): number {
    return Math.floor(50 * timeMultiplier); // Base retirement rate
  }

  private estimateCareerChangers(profession: Profession, timeMultiplier: number): number {
    return Math.floor(25 * timeMultiplier); // Base career change rate
  }

  private forecastCompetition(ratio: number): CompetitionLevel {
    if (ratio < 0.8) return CompetitionLevel.HIGH;
    if (ratio < 1.0) return CompetitionLevel.MODERATE;
    if (ratio < 1.2) return CompetitionLevel.LOW;
    return CompetitionLevel.LOW;
  }

  private forecastSalaryTrend(ratio: number, profession: Profession): SalaryTrend {
    if (ratio < 0.9) return SalaryTrend.RAPIDLY_GROWING;
    if (ratio < 1.0) return SalaryTrend.GROWING;
    if (ratio < 1.1) return SalaryTrend.STABLE;
    return SalaryTrend.DECLINING;
  }

  private assessAutomationRisk(profession: Profession): number {
    switch (profession.automationRisk) {
      case 'low': return 0.1;
      case 'moderate': return 0.3;
      case 'high': return 0.6;
      case 'very_high': return 0.8;
      default: return 0.3;
    }
  }

  private assessEconomicSensitivity(profession: Profession): number {
    // Technology and finance are more sensitive to economic cycles
    switch (profession.category) {
      case ProfessionCategory.TECHNOLOGY: return 0.7;
      case ProfessionCategory.FINANCE: return 0.8;
      case ProfessionCategory.CONSTRUCTION: return 0.9;
      case ProfessionCategory.HEALTHCARE: return 0.2;
      case ProfessionCategory.EDUCATION: return 0.3;
      default: return 0.5;
    }
  }

  private assessSkillsGapRisk(profession: Profession): number {
    // More complex professions have higher skills gap risk
    const complexityScore = profession.requiredSkills.length * 
                           profession.requiredSkills.filter(s => s.minimumLevel > 7).length;
    return Math.min(0.9, complexityScore * 0.1);
  }

  private calculateSkillSalaryImpact(skillReq: any, gapSize: number): number {
    const baseImpact = skillReq.importance === 'critical' ? 0.15 : 0.08;
    return baseImpact * gapSize; // % salary impact
  }

  private suggestTrainingPrograms(skillReq: any): string[] {
    return [`${skillReq.skillName} Certification Program`, `Advanced ${skillReq.skillName} Training`];
  }

  private getHistoricalGrowth(professionId: string, years: number): number {
    // Placeholder - would use actual historical data
    return 0.03 + (Math.random() * 0.02); // 3-5% historical growth
  }

  private calculateDemandPressure(profession: Profession): number {
    switch (profession.demandLevel) {
      case 'very_low': return 0.1;
      case 'low': return 0.3;
      case 'moderate': return 0.5;
      case 'high': return 0.7;
      case 'very_high': return 0.9;
      default: return 0.5;
    }
  }

  private calculateSupplyConstraints(profession: Profession): number {
    // Higher education requirements = higher supply constraints
    const educationConstraint = profession.educationLevel >= EducationLevel.BACHELORS ? 0.3 : 0.1;
    const skillConstraint = profession.requiredSkills.length * 0.05;
    return Math.min(0.9, educationConstraint + skillConstraint);
  }

  private calculateSkillPremium(profession: Profession, employed: Employment[]): number {
    // Calculate premium for high-skill workers
    const highSkillWorkers = employed.filter(emp => 
      Object.values(emp.skillProficiency).some(level => level > 8)
    );
    return highSkillWorkers.length / employed.length * 0.2; // Up to 20% premium
  }

  private projectWageGrowth(demandPressure: number, supplyConstraints: number, skillPremium: number): number {
    const baseGrowth = 0.03; // 3% base growth
    const marketPressure = (demandPressure + supplyConstraints) * 0.05;
    const skillBonus = skillPremium * 0.1;
    return baseGrowth + marketPressure + skillBonus;
  }

  private calculateConfidenceInterval(projectedGrowth: number): { lower: number; upper: number } {
    const margin = projectedGrowth * 0.3; // 30% confidence interval
    return {
      lower: projectedGrowth - margin,
      upper: projectedGrowth + margin
    };
  }

  private compareSkillRequirements(fromProfession: Profession, toProfession: Profession): SkillsGapAnalysis[] {
    const gaps: SkillsGapAnalysis[] = [];
    
    for (const toSkill of toProfession.requiredSkills) {
      const fromSkill = fromProfession.requiredSkills.find(s => s.skillId === toSkill.skillId);
      const currentLevel = fromSkill?.minimumLevel || 0;
      const gapSize = Math.max(0, toSkill.minimumLevel - currentLevel);
      
      if (gapSize > 0) {
        gaps.push({
          professionId: toProfession.id,
          skillId: toSkill.skillId,
          skillName: toSkill.skillName,
          requiredLevel: toSkill.minimumLevel,
          averageLevel: currentLevel,
          gapSize,
          affectedPositions: 1,
          salaryImpact: gapSize * 0.05,
          productivityImpact: gapSize * 0.1,
          trainingPrograms: [`${toSkill.skillName} Bridge Program`],
          estimatedTrainingTime: gapSize * 2,
          trainingCost: gapSize * 4000
        });
      }
    }
    
    return gaps;
  }

  private calculateExperienceTransferability(fromProfession: Profession, toProfession: Profession): number {
    // Same category = high transferability
    if (fromProfession.category === toProfession.category) return 0.8;
    
    // Related categories
    const relatedCategories = {
      [ProfessionCategory.TECHNOLOGY]: [ProfessionCategory.FINANCE],
      [ProfessionCategory.HEALTHCARE]: [ProfessionCategory.EDUCATION],
      [ProfessionCategory.RETAIL]: [ProfessionCategory.HOSPITALITY]
    };
    
    if (relatedCategories[fromProfession.category]?.includes(toProfession.category)) {
      return 0.5;
    }
    
    return 0.2; // Low transferability
  }

  private calculateCareerAdvancementImpact(fromProfession: Profession, toProfession: Profession): number {
    // Compare salary potential and growth prospects
    const salaryImprovement = (toProfession.baseSalary.median - fromProfession.baseSalary.median) / fromProfession.baseSalary.median;
    const growthImprovement = this.getProfessionGrowthMultiplier(toProfession) - this.getProfessionGrowthMultiplier(fromProfession);
    
    return Math.max(0, Math.min(1, (salaryImprovement + growthImprovement) / 2));
  }
}
