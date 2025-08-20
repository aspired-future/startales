/**
 * Population Analytics - Demographic analysis and population-level metrics
 * 
 * Provides comprehensive analytics for population demographics, economic indicators,
 * social mobility, and behavioral patterns across the citizen population.
 */

import { Citizen, PopulationMetrics, IncentiveType, IncentiveResponse } from './types.js';

export class PopulationAnalytics {
  /**
   * Calculate comprehensive population metrics from citizen data
   */
  calculatePopulationMetrics(citizens: Citizen[]): PopulationMetrics {
    if (citizens.length === 0) {
      return this.getEmptyMetrics();
    }

    const totalPopulation = citizens.length;
    
    // Basic demographic calculations
    const averageAge = citizens.reduce((sum, c) => sum + c.demographics.age, 0) / totalPopulation;
    const averageIncome = citizens.reduce((sum, c) => sum + c.finances.income, 0) / totalPopulation;
    
    // Employment metrics
    const unemployed = citizens.filter(c => c.career.employmentStatus === 'unemployed').length;
    const unemploymentRate = unemployed / totalPopulation;
    
    // Well-being indices
    const happinessIndex = citizens.reduce((sum, c) => sum + c.happiness, 0) / totalPopulation;
    const stressIndex = citizens.reduce((sum, c) => sum + c.stress, 0) / totalPopulation;
    
    // Social mobility calculation
    const socialMobility = this.calculateSocialMobility(citizens);
    
    // Distribution calculations
    const ageDistribution = this.calculateAgeDistribution(citizens);
    const genderDistribution = this.calculateGenderDistribution(citizens);
    const educationDistribution = this.calculateEducationDistribution(citizens);
    const professionDistribution = this.calculateProfessionDistribution(citizens);
    const incomeDistribution = this.calculateIncomeDistribution(citizens);
    
    // Economic indicators
    const consumerConfidence = this.calculateConsumerConfidence(citizens);
    const spendingPropensity = this.calculateSpendingPropensity(citizens);
    const savingsRate = this.calculateSavingsRate(citizens);
    const debtToIncomeRatio = this.calculateDebtToIncomeRatio(citizens);

    return {
      totalPopulation,
      averageAge,
      averageIncome,
      unemploymentRate,
      educationDistribution,
      happinessIndex,
      stressIndex,
      socialMobility,
      ageDistribution,
      genderDistribution,
      professionDistribution,
      incomeDistribution,
      consumerConfidence,
      spendingPropensity,
      savingsRate,
      debtToIncomeRatio
    };
  }

  private getEmptyMetrics(): PopulationMetrics {
    return {
      totalPopulation: 0,
      averageAge: 0,
      averageIncome: 0,
      unemploymentRate: 0,
      educationDistribution: {},
      happinessIndex: 0,
      stressIndex: 0,
      socialMobility: 0,
      ageDistribution: {},
      genderDistribution: {},
      professionDistribution: {},
      incomeDistribution: {},
      consumerConfidence: 0,
      spendingPropensity: 0,
      savingsRate: 0,
      debtToIncomeRatio: 0
    };
  }

  private calculateSocialMobility(citizens: Citizen[]): number {
    // Social mobility based on education advancement and income changes
    let mobilityScore = 0;
    let validCitizens = 0;

    citizens.forEach(citizen => {
      // Education mobility (compared to baseline for their age cohort)
      const expectedEducation = this.getExpectedEducationForAge(citizen.demographics.age);
      const educationMobility = this.getEducationScore(citizen.demographics.educationLevel) - expectedEducation;
      
      // Income mobility (compared to baseline for their education/profession)
      const expectedIncome = this.getExpectedIncomeForProfile(citizen);
      const incomeMobility = (citizen.finances.income - expectedIncome) / expectedIncome;
      
      // Career satisfaction as mobility indicator
      const careerMobility = citizen.career.jobSatisfaction - 0.5; // Baseline satisfaction
      
      // Combine mobility indicators
      const citizenMobility = (educationMobility * 0.4 + incomeMobility * 0.4 + careerMobility * 0.2);
      mobilityScore += citizenMobility;
      validCitizens++;
    });

    return validCitizens > 0 ? Math.max(0, Math.min(1, 0.5 + mobilityScore / validCitizens)) : 0.5;
  }

  private getExpectedEducationForAge(age: number): number {
    // Historical education expectations by age cohort
    if (age < 30) return 2.5; // Tertiary expected for younger generation
    if (age < 50) return 2.0; // Secondary expected for middle generation
    return 1.5; // Lower expectations for older generation
  }

  private getEducationScore(education: string): number {
    const scores = { 'none': 0, 'primary': 1, 'secondary': 2, 'tertiary': 3, 'advanced': 4 };
    return scores[education as keyof typeof scores] || 0;
  }

  private getExpectedIncomeForProfile(citizen: Citizen): number {
    // Base income expectations by education and profession
    const educationMultipliers = {
      'none': 0.7, 'primary': 0.8, 'secondary': 1.0, 'tertiary': 1.3, 'advanced': 1.6
    };
    
    const professionBases: Record<string, number> = {
      'doctor': 120000, 'lawyer': 100000, 'engineer': 80000, 'scientist': 75000,
      'manager': 70000, 'accountant': 60000, 'teacher': 50000, 'nurse': 55000,
      'analyst': 65000, 'developer': 75000, 'consultant': 80000, 'designer': 60000,
      'researcher': 70000, 'technician': 45000, 'salesperson': 50000,
      'clerk': 35000, 'worker': 40000, 'artist': 35000
    };

    const baseIncome = professionBases[citizen.career.currentProfession] || 45000;
    const educationMultiplier = educationMultipliers[citizen.demographics.educationLevel as keyof typeof educationMultipliers] || 1.0;
    
    return (baseIncome * educationMultiplier) / 12; // Monthly income
  }

  private calculateAgeDistribution(citizens: Citizen[]): Record<string, number> {
    const distribution: Record<string, number> = {
      '18-29': 0, '30-44': 0, '45-64': 0, '65+': 0
    };

    citizens.forEach(citizen => {
      const age = citizen.demographics.age;
      if (age < 30) distribution['18-29']++;
      else if (age < 45) distribution['30-44']++;
      else if (age < 65) distribution['45-64']++;
      else distribution['65+']++;
    });

    // Convert to percentages
    const total = citizens.length;
    Object.keys(distribution).forEach(key => {
      distribution[key] = (distribution[key] / total) * 100;
    });

    return distribution;
  }

  private calculateGenderDistribution(citizens: Citizen[]): Record<string, number> {
    const distribution: Record<string, number> = { 'male': 0, 'female': 0, 'other': 0 };

    citizens.forEach(citizen => {
      distribution[citizen.demographics.gender]++;
    });

    // Convert to percentages
    const total = citizens.length;
    Object.keys(distribution).forEach(key => {
      distribution[key] = (distribution[key] / total) * 100;
    });

    return distribution;
  }

  private calculateEducationDistribution(citizens: Citizen[]): Record<string, number> {
    const distribution: Record<string, number> = {
      'none': 0, 'primary': 0, 'secondary': 0, 'tertiary': 0, 'advanced': 0
    };

    citizens.forEach(citizen => {
      distribution[citizen.demographics.educationLevel]++;
    });

    // Convert to percentages
    const total = citizens.length;
    Object.keys(distribution).forEach(key => {
      distribution[key] = (distribution[key] / total) * 100;
    });

    return distribution;
  }

  private calculateProfessionDistribution(citizens: Citizen[]): Record<string, number> {
    const distribution: Record<string, number> = {};

    citizens.forEach(citizen => {
      const profession = citizen.career.currentProfession;
      distribution[profession] = (distribution[profession] || 0) + 1;
    });

    // Convert to percentages and sort by count
    const total = citizens.length;
    const sortedProfessions = Object.entries(distribution)
      .map(([profession, count]) => [profession, (count / total) * 100])
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 10); // Top 10 professions

    const result: Record<string, number> = {};
    sortedProfessions.forEach(([profession, percentage]) => {
      result[profession] = percentage as number;
    });

    return result;
  }

  private calculateIncomeDistribution(citizens: Citizen[]): Record<string, number> {
    const distribution: Record<string, number> = {
      '0-25k': 0, '25k-50k': 0, '50k-75k': 0, '75k-100k': 0, '100k+': 0
    };

    citizens.forEach(citizen => {
      const annualIncome = citizen.finances.income * 12;
      if (annualIncome < 25000) distribution['0-25k']++;
      else if (annualIncome < 50000) distribution['25k-50k']++;
      else if (annualIncome < 75000) distribution['50k-75k']++;
      else if (annualIncome < 100000) distribution['75k-100k']++;
      else distribution['100k+']++;
    });

    // Convert to percentages
    const total = citizens.length;
    Object.keys(distribution).forEach(key => {
      distribution[key] = (distribution[key] / total) * 100;
    });

    return distribution;
  }

  private calculateConsumerConfidence(citizens: Citizen[]): number {
    // Consumer confidence based on happiness, job satisfaction, and financial security
    let totalConfidence = 0;

    citizens.forEach(citizen => {
      const financialSecurity = Math.min(1, citizen.finances.savings / (citizen.finances.expenses * 6));
      const jobSecurity = citizen.career.employmentStatus === 'employed' ? citizen.career.jobSatisfaction : 0;
      const personalWellbeing = citizen.happiness;
      
      const confidence = (financialSecurity * 0.4 + jobSecurity * 0.3 + personalWellbeing * 0.3);
      totalConfidence += confidence;
    });

    return citizens.length > 0 ? totalConfidence / citizens.length : 0;
  }

  private calculateSpendingPropensity(citizens: Citizen[]): number {
    // Spending propensity based on income, savings behavior, and psychological factors
    let totalPropensity = 0;

    citizens.forEach(citizen => {
      const incomeConfidence = Math.min(1, citizen.finances.income / 5000); // Normalized to $5k/month
      const savingsBuffer = Math.min(1, citizen.finances.savings / (citizen.finances.expenses * 3));
      const spendingPersonality = citizen.psychology.spendingImpulsiveness;
      
      const propensity = (incomeConfidence * 0.4 + savingsBuffer * 0.3 + spendingPersonality * 0.3);
      totalPropensity += propensity;
    });

    return citizens.length > 0 ? totalPropensity / citizens.length : 0;
  }

  private calculateSavingsRate(citizens: Citizen[]): number {
    let totalSavingsRate = 0;
    let validCitizens = 0;

    citizens.forEach(citizen => {
      if (citizen.finances.income > 0) {
        const savingsRate = citizen.finances.spendingCategories.savings / citizen.finances.income;
        totalSavingsRate += savingsRate;
        validCitizens++;
      }
    });

    return validCitizens > 0 ? totalSavingsRate / validCitizens : 0;
  }

  private calculateDebtToIncomeRatio(citizens: Citizen[]): number {
    let totalRatio = 0;
    let validCitizens = 0;

    citizens.forEach(citizen => {
      if (citizen.finances.income > 0) {
        const annualIncome = citizen.finances.income * 12;
        const ratio = citizen.finances.debt / annualIncome;
        totalRatio += ratio;
        validCitizens++;
      }
    });

    return validCitizens > 0 ? totalRatio / validCitizens : 0;
  }

  /**
   * Analyze population response to incentives
   */
  analyzeIncentiveImpact(citizens: Citizen[], incentiveResponses: IncentiveResponse[]): {
    overallResponseRate: number;
    responseByDemographic: Record<string, number>;
    behaviorChanges: Record<string, number>;
    economicImpact: {
      spendingChange: number;
      savingsChange: number;
      productivityChange: number;
    };
  } {
    const totalCitizens = citizens.length;
    const respondingCitizens = incentiveResponses.length;
    const overallResponseRate = totalCitizens > 0 ? respondingCitizens / totalCitizens : 0;

    // Response by demographic groups
    const responseByDemographic = this.calculateResponseByDemographic(citizens, incentiveResponses);

    // Aggregate behavior changes
    const behaviorChanges: Record<string, number> = {};
    incentiveResponses.forEach(response => {
      Object.entries(response.behaviorChange).forEach(([behavior, change]) => {
        behaviorChanges[behavior] = (behaviorChanges[behavior] || 0) + change;
      });
    });

    // Normalize behavior changes
    Object.keys(behaviorChanges).forEach(behavior => {
      behaviorChanges[behavior] /= respondingCitizens;
    });

    // Calculate economic impact
    const economicImpact = {
      spendingChange: behaviorChanges.spending || 0,
      savingsChange: behaviorChanges.saving || 0,
      productivityChange: (behaviorChanges.career_focus || 0) + (behaviorChanges.education_investment || 0) * 0.5
    };

    return {
      overallResponseRate,
      responseByDemographic,
      behaviorChanges,
      economicImpact
    };
  }

  private calculateResponseByDemographic(citizens: Citizen[], responses: IncentiveResponse[]): Record<string, number> {
    const responseMap = new Map(responses.map(r => [r.citizenId.value, r.responseStrength]));
    
    const demographics = {
      'young': { count: 0, totalResponse: 0 },
      'middle': { count: 0, totalResponse: 0 },
      'older': { count: 0, totalResponse: 0 },
      'low_education': { count: 0, totalResponse: 0 },
      'high_education': { count: 0, totalResponse: 0 },
      'low_income': { count: 0, totalResponse: 0 },
      'high_income': { count: 0, totalResponse: 0 }
    };

    citizens.forEach(citizen => {
      const response = responseMap.get(citizen.id.value) || 0;
      
      // Age groups
      if (citizen.demographics.age < 35) {
        demographics.young.count++;
        demographics.young.totalResponse += response;
      } else if (citizen.demographics.age < 55) {
        demographics.middle.count++;
        demographics.middle.totalResponse += response;
      } else {
        demographics.older.count++;
        demographics.older.totalResponse += response;
      }

      // Education groups
      if (['none', 'primary', 'secondary'].includes(citizen.demographics.educationLevel)) {
        demographics.low_education.count++;
        demographics.low_education.totalResponse += response;
      } else {
        demographics.high_education.count++;
        demographics.high_education.totalResponse += response;
      }

      // Income groups
      const annualIncome = citizen.finances.income * 12;
      if (annualIncome < 50000) {
        demographics.low_income.count++;
        demographics.low_income.totalResponse += response;
      } else {
        demographics.high_income.count++;
        demographics.high_income.totalResponse += response;
      }
    });

    // Calculate average response rates
    const result: Record<string, number> = {};
    Object.entries(demographics).forEach(([group, data]) => {
      result[group] = data.count > 0 ? data.totalResponse / data.count : 0;
    });

    return result;
  }

  /**
   * Generate demographic trends over time
   */
  calculateDemographicTrends(historicalMetrics: PopulationMetrics[]): {
    populationGrowth: number[];
    ageingTrend: number[];
    educationTrend: number[];
    incomeTrend: number[];
    wellbeingTrend: number[];
  } {
    if (historicalMetrics.length < 2) {
      return {
        populationGrowth: [],
        ageingTrend: [],
        educationTrend: [],
        incomeTrend: [],
        wellbeingTrend: []
      };
    }

    const populationGrowth = historicalMetrics.map(m => m.totalPopulation);
    const ageingTrend = historicalMetrics.map(m => m.averageAge);
    const incomeTrend = historicalMetrics.map(m => m.averageIncome);
    const wellbeingTrend = historicalMetrics.map(m => m.happinessIndex - m.stressIndex);

    // Education trend (percentage with tertiary+ education)
    const educationTrend = historicalMetrics.map(m => 
      (m.educationDistribution.tertiary || 0) + (m.educationDistribution.advanced || 0)
    );

    return {
      populationGrowth,
      ageingTrend,
      educationTrend,
      incomeTrend,
      wellbeingTrend
    };
  }

  /**
   * Calculate inequality metrics
   */
  calculateInequality(citizens: Citizen[]): {
    giniCoefficient: number;
    incomeDeciles: number[];
    wealthDistribution: Record<string, number>;
    socialMobilityMatrix: number[][];
  } {
    if (citizens.length === 0) {
      return {
        giniCoefficient: 0,
        incomeDeciles: [],
        wealthDistribution: {},
        socialMobilityMatrix: []
      };
    }

    // Calculate Gini coefficient for income inequality
    const incomes = citizens.map(c => c.finances.income).sort((a, b) => a - b);
    const giniCoefficient = this.calculateGiniCoefficient(incomes);

    // Income deciles
    const incomeDeciles = this.calculateDeciles(incomes);

    // Wealth distribution (savings + assets - debt)
    const wealth = citizens.map(c => c.finances.savings - c.finances.debt);
    const wealthDistribution = this.calculateWealthDistribution(wealth);

    // Social mobility matrix (education transitions between generations)
    const socialMobilityMatrix = this.calculateSocialMobilityMatrix(citizens);

    return {
      giniCoefficient,
      incomeDeciles,
      wealthDistribution,
      socialMobilityMatrix
    };
  }

  private calculateGiniCoefficient(sortedIncomes: number[]): number {
    const n = sortedIncomes.length;
    if (n === 0) return 0;

    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += (2 * (i + 1) - n - 1) * sortedIncomes[i];
    }

    const totalIncome = sortedIncomes.reduce((a, b) => a + b, 0);
    return totalIncome > 0 ? sum / (n * totalIncome) : 0;
  }

  private calculateDeciles(sortedValues: number[]): number[] {
    const deciles: number[] = [];
    const n = sortedValues.length;

    for (let i = 1; i <= 10; i++) {
      const index = Math.floor((i * n) / 10) - 1;
      deciles.push(sortedValues[Math.max(0, index)]);
    }

    return deciles;
  }

  private calculateWealthDistribution(wealth: number[]): Record<string, number> {
    const distribution: Record<string, number> = {
      'negative': 0, '0-10k': 0, '10k-50k': 0, '50k-100k': 0, '100k+': 0
    };

    wealth.forEach(w => {
      if (w < 0) distribution['negative']++;
      else if (w < 10000) distribution['0-10k']++;
      else if (w < 50000) distribution['10k-50k']++;
      else if (w < 100000) distribution['50k-100k']++;
      else distribution['100k+']++;
    });

    // Convert to percentages
    const total = wealth.length;
    Object.keys(distribution).forEach(key => {
      distribution[key] = (distribution[key] / total) * 100;
    });

    return distribution;
  }

  private calculateSocialMobilityMatrix(citizens: Citizen[]): number[][] {
    // Simplified mobility matrix - would need generational data for full implementation
    // This is a placeholder showing the structure
    const educationLevels = ['none', 'primary', 'secondary', 'tertiary', 'advanced'];
    const matrix: number[][] = [];

    for (let i = 0; i < educationLevels.length; i++) {
      matrix[i] = new Array(educationLevels.length).fill(0);
      // Diagonal dominance (most people stay in same education level as parents)
      matrix[i][i] = 0.6;
      // Some upward mobility
      if (i < educationLevels.length - 1) matrix[i][i + 1] = 0.25;
      // Some downward mobility
      if (i > 0) matrix[i][i - 1] = 0.15;
    }

    return matrix;
  }
}
