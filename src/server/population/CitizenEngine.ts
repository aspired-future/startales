/**
 * Citizen Engine - Individual citizen modeling and lifecycle management
 * 
 * Handles creation, evolution, and behavior simulation for individual citizens
 * with realistic psychological profiles and decision-making processes.
 */

import { 
  Citizen, CitizenId, PsychologicalProfile, Demographics, CareerProfile,
  FinancialStatus, SocialConnections, LifeGoals, LifeEvent, Decision,
  DecisionType, DecisionOption, IncentiveResponse, IncentiveType,
  PopulationConfig, LifeEventType
} from './types.js';

export class CitizenEngine {
  private citizens: Map<string, Citizen> = new Map();
  private config: PopulationConfig;
  private prng: () => number;

  constructor(config: PopulationConfig, seed: number = Date.now()) {
    this.config = config;
    this.prng = this.createSeededPRNG(seed);
  }

  private createSeededPRNG(seed: number): () => number {
    let a = seed;
    return () => {
      a ^= a << 13;
      a ^= a >>> 17;
      a ^= a << 5;
      return (a >>> 0) / 0xffffffff;
    };
  }

  /**
   * Generate a new citizen with realistic attributes
   */
  generateCitizen(cityId: string): Citizen {
    const id: CitizenId = { value: `citizen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
    
    const demographics = this.generateDemographics(cityId);
    const psychology = this.generatePsychology();
    const career = this.generateCareer(demographics, psychology);
    const finances = this.generateFinances(career, demographics);
    const social = this.generateSocialConnections(psychology, demographics);
    const goals = this.generateLifeGoals(psychology, demographics, career);

    const citizen: Citizen = {
      id,
      demographics,
      psychology,
      career,
      finances,
      social,
      goals,
      
      // Initial dynamic state
      happiness: this.calculateInitialHappiness(psychology, career, finances, social),
      stress: this.calculateInitialStress(psychology, career, finances),
      health: 0.7 + this.prng() * 0.3, // Generally healthy population
      
      lifeEvents: [{
        id: `birth_${id.value}`,
        type: 'birth',
        timestamp: new Date(Date.now() - demographics.age * 365 * 24 * 60 * 60 * 1000),
        impact: { happiness: 0, stress: 0, finances: 0, career: 0, social: 0 },
        description: 'Born'
      }],
      decisionHistory: [],
      
      createdAt: new Date(),
      lastUpdated: new Date(),
      version: 1
    };

    this.citizens.set(id.value, citizen);
    return citizen;
  }

  private generateDemographics(cityId: string): Demographics {
    // Age distribution - realistic population pyramid
    const ageRand = this.prng();
    let age: number;
    if (ageRand < 0.25) age = 18 + Math.floor(this.prng() * 12); // 18-29
    else if (ageRand < 0.5) age = 30 + Math.floor(this.prng() * 15); // 30-44
    else if (ageRand < 0.75) age = 45 + Math.floor(this.prng() * 20); // 45-64
    else age = 65 + Math.floor(this.prng() * 20); // 65+

    const genders = ['male', 'female', 'other'] as const;
    const educationLevels = ['none', 'primary', 'secondary', 'tertiary', 'advanced'] as const;
    const maritalStatuses = ['single', 'married', 'divorced', 'widowed'] as const;
    const residenceTypes = ['rural', 'suburban', 'urban', 'metropolitan'] as const;

    // Education correlates with age and random factors
    let educationLevel: typeof educationLevels[number];
    const eduRand = this.prng();
    if (age < 25) {
      educationLevel = eduRand < 0.4 ? 'secondary' : eduRand < 0.8 ? 'tertiary' : 'advanced';
    } else {
      educationLevel = eduRand < 0.2 ? 'primary' : eduRand < 0.5 ? 'secondary' : 
                      eduRand < 0.8 ? 'tertiary' : 'advanced';
    }

    // Marital status correlates with age
    let maritalStatus: typeof maritalStatuses[number];
    if (age < 25) maritalStatus = this.prng() < 0.8 ? 'single' : 'married';
    else if (age < 40) maritalStatus = this.prng() < 0.4 ? 'single' : 'married';
    else maritalStatus = this.prng() < 0.1 ? 'single' : this.prng() < 0.8 ? 'married' : 
                        this.prng() < 0.9 ? 'divorced' : 'widowed';

    return {
      age,
      gender: genders[Math.floor(this.prng() * genders.length)],
      educationLevel,
      maritalStatus,
      householdSize: maritalStatus === 'married' ? 2 + Math.floor(this.prng() * 3) : 
                    this.prng() < 0.7 ? 1 : 2 + Math.floor(this.prng() * 2),
      dependents: maritalStatus === 'married' && this.prng() < 0.6 ? 
                 Math.floor(this.prng() * 3) : 0,
      cityId,
      residenceType: residenceTypes[Math.floor(this.prng() * residenceTypes.length)],
      mobilityWillingness: this.prng()
    };
  }

  private generatePsychology(): PsychologicalProfile {
    // Generate Big Five traits using normal distribution approximation
    const normalRandom = () => {
      const u1 = this.prng();
      const u2 = this.prng();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return Math.max(0, Math.min(1, 0.5 + z * 0.15)); // Mean 0.5, std 0.15, clamped to [0,1]
    };

    return {
      openness: normalRandom(),
      conscientiousness: normalRandom(),
      extraversion: normalRandom(),
      agreeableness: normalRandom(),
      neuroticism: normalRandom(),
      
      riskTolerance: normalRandom(),
      spendingImpulsiveness: normalRandom(),
      savingsOrientation: normalRandom(),
      
      authorityRespect: normalRandom(),
      changeAdaptability: normalRandom(),
      socialInfluence: normalRandom()
    };
  }

  private generateCareer(demographics: Demographics, psychology: PsychologicalProfile): CareerProfile {
    const professions = [
      'teacher', 'engineer', 'doctor', 'nurse', 'accountant', 'lawyer', 'manager',
      'technician', 'salesperson', 'clerk', 'worker', 'artist', 'scientist',
      'consultant', 'analyst', 'developer', 'designer', 'researcher'
    ];

    // Career choice influenced by education and personality
    let profession = professions[Math.floor(this.prng() * professions.length)];
    
    // Adjust based on education
    if (demographics.educationLevel === 'advanced') {
      const advancedProfs = ['doctor', 'lawyer', 'scientist', 'researcher', 'engineer'];
      if (this.prng() < 0.6) profession = advancedProfs[Math.floor(this.prng() * advancedProfs.length)];
    }

    const experience = Math.max(0, demographics.age - 22 - Math.floor(this.prng() * 5));
    const skillLevel = Math.min(100, 20 + experience * 2 + this.prng() * 30);

    // Generate skills based on profession and personality
    const skills: Record<string, number> = {};
    const baseSkills = ['communication', 'problem_solving', 'teamwork', 'leadership', 'technical'];
    baseSkills.forEach(skill => {
      skills[skill] = 20 + this.prng() * 60 + (psychology.conscientiousness * 20);
    });

    // Employment status based on age and economic factors
    let employmentStatus: CareerProfile['employmentStatus'];
    if (demographics.age < 18) employmentStatus = 'student';
    else if (demographics.age > 65) employmentStatus = 'retired';
    else if (this.prng() < 0.05) employmentStatus = 'unemployed';
    else if (this.prng() < 0.02) employmentStatus = 'disabled';
    else employmentStatus = 'employed';

    // Salary based on profession, education, experience, and skills
    const baseSalary = this.getBaseSalaryForProfession(profession);
    const educationMultiplier = this.getEducationMultiplier(demographics.educationLevel);
    const experienceMultiplier = 1 + (experience * 0.02);
    const skillMultiplier = 1 + (skillLevel - 50) * 0.005;
    
    const salary = employmentStatus === 'employed' ? 
      baseSalary * educationMultiplier * experienceMultiplier * skillMultiplier * (0.8 + this.prng() * 0.4) : 0;

    return {
      currentProfession: profession,
      skillLevel,
      experience,
      careerAmbition: psychology.conscientiousness * 0.7 + psychology.openness * 0.3,
      skills,
      learningRate: psychology.openness * 0.6 + psychology.conscientiousness * 0.4,
      employmentStatus,
      currentEmployer: employmentStatus === 'employed' ? `${profession}_corp_${Math.floor(this.prng() * 100)}` : undefined,
      salary,
      jobSatisfaction: 0.4 + this.prng() * 0.4 + (psychology.agreeableness * 0.2)
    };
  }

  private generateFinances(career: CareerProfile, demographics: Demographics): FinancialStatus {
    const monthlyIncome = career.salary / 12;
    
    // Expenses based on income, household size, and lifestyle
    const baseExpenses = monthlyIncome * (0.6 + this.prng() * 0.3);
    const householdMultiplier = 1 + (demographics.householdSize - 1) * 0.2;
    const monthlyExpenses = baseExpenses * householdMultiplier;

    // Savings based on income minus expenses and savings orientation
    const potentialSavings = Math.max(0, monthlyIncome - monthlyExpenses);
    const actualSavingsRate = 0.1 + this.prng() * 0.2; // 10-30% of potential
    const monthlySavings = potentialSavings * actualSavingsRate;

    // Total savings based on age and career history
    const yearsWorking = Math.max(0, demographics.age - 22);
    const totalSavings = monthlySavings * yearsWorking * 12 * (0.5 + this.prng() * 1.0);

    // Debt based on age, education, and spending patterns
    const educationDebt = demographics.educationLevel === 'tertiary' ? 20000 + this.prng() * 30000 :
                         demographics.educationLevel === 'advanced' ? 40000 + this.prng() * 60000 : 0;
    const consumerDebt = monthlyExpenses * (1 + this.prng() * 2); // 1-3 months of expenses
    const totalDebt = educationDebt + consumerDebt;

    // Credit score based on income, debt, and financial behavior
    const debtToIncomeRatio = totalDebt / (monthlyIncome * 12);
    const baseCreditScore = 650;
    const incomeBonus = Math.min(100, monthlyIncome / 1000);
    const debtPenalty = Math.min(150, debtToIncomeRatio * 200);
    const creditScore = Math.max(300, Math.min(850, baseCreditScore + incomeBonus - debtPenalty + (this.prng() * 100 - 50)));

    return {
      income: monthlyIncome,
      expenses: monthlyExpenses,
      savings: totalSavings,
      debt: totalDebt,
      creditScore,
      spendingCategories: {
        housing: monthlyExpenses * 0.3,
        food: monthlyExpenses * 0.15,
        transportation: monthlyExpenses * 0.15,
        healthcare: monthlyExpenses * 0.08,
        education: monthlyExpenses * 0.05,
        entertainment: monthlyExpenses * 0.12,
        savings: monthlySavings,
        other: monthlyExpenses * 0.15
      }
    };
  }

  private generateSocialConnections(psychology: PsychologicalProfile, demographics: Demographics): SocialConnections {
    return {
      familyTies: 0.3 + psychology.agreeableness * 0.4 + this.prng() * 0.3,
      friendshipNetwork: psychology.extraversion * 0.6 + this.prng() * 0.4,
      communityInvolvement: psychology.agreeableness * 0.4 + psychology.conscientiousness * 0.3 + this.prng() * 0.3,
      politicalEngagement: psychology.openness * 0.5 + this.prng() * 0.5
    };
  }

  private generateLifeGoals(psychology: PsychologicalProfile, demographics: Demographics, career: CareerProfile): LifeGoals {
    return {
      careerAdvancement: career.careerAmbition,
      familyFormation: demographics.maritalStatus === 'single' ? 0.3 + this.prng() * 0.5 : 0.7 + this.prng() * 0.3,
      wealthAccumulation: psychology.conscientiousness * 0.6 + this.prng() * 0.4,
      socialStatus: psychology.extraversion * 0.5 + this.prng() * 0.5,
      personalFulfillment: psychology.openness * 0.6 + this.prng() * 0.4,
      securityStability: (1 - psychology.riskTolerance) * 0.7 + psychology.neuroticism * 0.3
    };
  }

  private calculateInitialHappiness(psychology: PsychologicalProfile, career: CareerProfile, finances: FinancialStatus, social: SocialConnections): number {
    const jobSatisfactionWeight = 0.25;
    const financialSecurityWeight = 0.2;
    const socialConnectionWeight = 0.3;
    const personalityWeight = 0.25;

    const financialSecurity = Math.min(1, finances.savings / (finances.expenses * 6)); // 6 months emergency fund
    const socialConnection = (social.familyTies + social.friendshipNetwork + social.communityInvolvement) / 3;
    const personalityHappiness = (psychology.extraversion + (1 - psychology.neuroticism) + psychology.agreeableness) / 3;

    return (
      career.jobSatisfaction * jobSatisfactionWeight +
      financialSecurity * financialSecurityWeight +
      socialConnection * socialConnectionWeight +
      personalityHappiness * personalityWeight
    );
  }

  private calculateInitialStress(psychology: PsychologicalProfile, career: CareerProfile, finances: FinancialStatus): number {
    const financialStress = Math.min(1, finances.debt / (finances.income * 12)) * 0.4;
    const jobStress = (1 - career.jobSatisfaction) * 0.3;
    const personalityStress = psychology.neuroticism * 0.3;

    return Math.min(1, financialStress + jobStress + personalityStress);
  }

  private getBaseSalaryForProfession(profession: string): number {
    const salaryMap: Record<string, number> = {
      'doctor': 120000, 'lawyer': 100000, 'engineer': 80000, 'scientist': 75000,
      'manager': 70000, 'accountant': 60000, 'teacher': 50000, 'nurse': 55000,
      'analyst': 65000, 'developer': 75000, 'consultant': 80000, 'designer': 60000,
      'researcher': 70000, 'technician': 45000, 'salesperson': 50000,
      'clerk': 35000, 'worker': 40000, 'artist': 35000
    };
    return salaryMap[profession] || 45000;
  }

  private getEducationMultiplier(education: Demographics['educationLevel']): number {
    const multipliers = {
      'none': 0.7, 'primary': 0.8, 'secondary': 1.0, 'tertiary': 1.3, 'advanced': 1.6
    };
    return multipliers[education];
  }

  /**
   * Simulate citizen behavior and decision-making for one time step
   */
  simulateTimeStep(citizenId: string, incentives: IncentiveType[] = []): void {
    const citizen = this.citizens.get(citizenId);
    if (!citizen) return;

    // Age the citizen
    this.ageCitizen(citizen);

    // Process life events
    this.processLifeEvents(citizen);

    // Make decisions based on current state and incentives
    this.makeDecisions(citizen, incentives);

    // Update dynamic attributes
    this.updateDynamicAttributes(citizen);

    // Update timestamp
    citizen.lastUpdated = new Date();
    citizen.version++;
  }

  private ageCitizen(citizen: Citizen): void {
    // Age increases based on time step configuration
    const ageIncrement = this.config.timeStep === 'year' ? 1 :
                        this.config.timeStep === 'month' ? 1/12 :
                        this.config.timeStep === 'week' ? 1/52 : 1/365;
    
    citizen.demographics.age += ageIncrement * this.config.agingRate;

    // Skill decay with age (very gradual)
    if (citizen.demographics.age > 50) {
      const decayRate = (citizen.demographics.age - 50) * 0.001;
      Object.keys(citizen.career.skills).forEach(skill => {
        citizen.career.skills[skill] *= (1 - decayRate);
      });
    }
  }

  private processLifeEvents(citizen: Citizen): void {
    // Generate random life events based on citizen state and probabilities
    const eventProbability = 0.05; // 5% chance per time step
    
    if (this.prng() < eventProbability) {
      const eventType = this.selectLifeEvent(citizen);
      const event = this.generateLifeEvent(citizen, eventType);
      citizen.lifeEvents.push(event);
      this.applyLifeEventImpact(citizen, event);
    }
  }

  private selectLifeEvent(citizen: Citizen): LifeEventType {
    const age = citizen.demographics.age;
    const events: LifeEventType[] = [];

    // Age-appropriate events
    if (age >= 18 && age <= 30) events.push('education', 'job_start', 'marriage');
    if (age >= 25 && age <= 45) events.push('child_birth', 'home_purchase', 'promotion');
    if (age >= 30 && age <= 60) events.push('job_loss', 'divorce', 'illness');
    if (age >= 50) events.push('retirement', 'health_decline');

    // Always possible events
    events.push('skill_acquisition', 'social_connection', 'windfall', 'relocation');

    return events[Math.floor(this.prng() * events.length)];
  }

  private generateLifeEvent(citizen: Citizen, type: LifeEventType): LifeEvent {
    const impact = { happiness: 0, stress: 0, finances: 0, career: 0, social: 0 };
    let description = '';

    switch (type) {
      case 'promotion':
        impact.happiness = 0.1 + this.prng() * 0.2;
        impact.career = 0.2 + this.prng() * 0.3;
        impact.finances = 0.1 + this.prng() * 0.2;
        description = 'Received a promotion at work';
        break;
      case 'job_loss':
        impact.happiness = -(0.2 + this.prng() * 0.3);
        impact.stress = 0.3 + this.prng() * 0.4;
        impact.finances = -(0.3 + this.prng() * 0.5);
        description = 'Lost job due to economic conditions';
        break;
      case 'marriage':
        impact.happiness = 0.2 + this.prng() * 0.3;
        impact.social = 0.3 + this.prng() * 0.4;
        description = 'Got married';
        break;
      case 'child_birth':
        impact.happiness = 0.3 + this.prng() * 0.4;
        impact.stress = 0.1 + this.prng() * 0.2;
        impact.finances = -(0.1 + this.prng() * 0.2);
        description = 'Had a child';
        break;
      default:
        impact.happiness = (this.prng() - 0.5) * 0.2;
        description = `Life event: ${type}`;
    }

    return {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date(),
      impact,
      description
    };
  }

  private applyLifeEventImpact(citizen: Citizen, event: LifeEvent): void {
    citizen.happiness = Math.max(0, Math.min(1, citizen.happiness + event.impact.happiness));
    citizen.stress = Math.max(0, Math.min(1, citizen.stress + event.impact.stress));
    
    // Apply financial impact
    citizen.finances.income *= (1 + event.impact.finances);
    citizen.finances.savings *= (1 + event.impact.finances * 0.5);
    
    // Apply career impact
    citizen.career.jobSatisfaction = Math.max(0, Math.min(1, 
      citizen.career.jobSatisfaction + event.impact.career));
  }

  private makeDecisions(citizen: Citizen, incentives: IncentiveType[]): void {
    // Citizens make decisions based on their goals, current state, and available incentives
    const decisionProbability = 0.1; // 10% chance of making a major decision per time step
    
    if (this.prng() < decisionProbability) {
      const decisionType = this.selectDecisionType(citizen, incentives);
      const decision = this.generateDecision(citizen, decisionType, incentives);
      citizen.decisionHistory.push(decision);
      this.applyDecisionOutcome(citizen, decision);
    }
  }

  private selectDecisionType(citizen: Citizen, incentives: IncentiveType[]): DecisionType {
    const decisions: DecisionType[] = ['spending_choice', 'savings_decision'];
    
    // Add context-specific decisions
    if (citizen.career.jobSatisfaction < 0.4) decisions.push('career_change');
    if (citizen.finances.savings > citizen.finances.expenses * 6) decisions.push('investment');
    if (citizen.goals.careerAdvancement > 0.7) decisions.push('education_investment');
    
    // Add incentive-driven decisions
    if (incentives.includes('education_opportunity')) decisions.push('education_investment');
    if (incentives.includes('job_training')) decisions.push('career_change');
    
    return decisions[Math.floor(this.prng() * decisions.length)];
  }

  private generateDecision(citizen: Citizen, type: DecisionType, incentives: IncentiveType[]): Decision {
    const options: DecisionOption[] = [];
    
    // Generate options based on decision type
    switch (type) {
      case 'spending_choice':
        options.push(
          { id: 'save', description: 'Save money', expectedUtility: 0.6, riskLevel: 0.1, cost: 0, timeCommitment: 0 },
          { id: 'spend', description: 'Spend on entertainment', expectedUtility: 0.7, riskLevel: 0.2, cost: 0.1, timeCommitment: 0 },
          { id: 'invest', description: 'Invest in assets', expectedUtility: 0.8, riskLevel: 0.5, cost: 0.2, timeCommitment: 0.1 }
        );
        break;
      case 'career_change':
        options.push(
          { id: 'stay', description: 'Stay in current job', expectedUtility: 0.5, riskLevel: 0.1, cost: 0, timeCommitment: 0 },
          { id: 'change', description: 'Change careers', expectedUtility: 0.8, riskLevel: 0.7, cost: 0.3, timeCommitment: 0.5 }
        );
        break;
    }

    // Choose option based on citizen psychology and utility
    const chosenOption = this.selectBestOption(citizen, options);
    
    return {
      id: `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type,
      context: { incentives, currentState: { happiness: citizen.happiness, stress: citizen.stress } },
      options,
      chosenOption: chosenOption.id,
      reasoning: `Chose ${chosenOption.description} based on personality and current situation`
    };
  }

  private selectBestOption(citizen: Citizen, options: DecisionOption[]): DecisionOption {
    // Calculate utility for each option based on citizen psychology
    const utilities = options.map(option => {
      let utility = option.expectedUtility;
      
      // Adjust for risk tolerance
      utility -= option.riskLevel * (1 - citizen.psychology.riskTolerance);
      
      // Adjust for conscientiousness (long-term thinking)
      utility += option.timeCommitment * citizen.psychology.conscientiousness * 0.5;
      
      // Add random factor
      utility += (this.prng() - 0.5) * 0.2;
      
      return utility;
    });

    const bestIndex = utilities.indexOf(Math.max(...utilities));
    return options[bestIndex];
  }

  private applyDecisionOutcome(citizen: Citizen, decision: Decision): void {
    const option = decision.options.find(o => o.id === decision.chosenOption);
    if (!option) return;

    // Apply costs and benefits
    citizen.finances.expenses += option.cost * citizen.finances.income;
    citizen.happiness += (option.expectedUtility - 0.5) * 0.1;
    citizen.stress += option.riskLevel * 0.05;
    
    // Clamp values
    citizen.happiness = Math.max(0, Math.min(1, citizen.happiness));
    citizen.stress = Math.max(0, Math.min(1, citizen.stress));
  }

  private updateDynamicAttributes(citizen: Citizen): void {
    // Gradual return to baseline for dynamic attributes
    const decayRate = 0.05;
    
    // Happiness tends toward baseline based on personality and circumstances
    const baselineHappiness = this.calculateInitialHappiness(
      citizen.psychology, citizen.career, citizen.finances, citizen.social
    );
    citizen.happiness += (baselineHappiness - citizen.happiness) * decayRate;
    
    // Stress decays over time
    citizen.stress *= (1 - decayRate);
    
    // Health changes based on age, stress, and lifestyle
    const healthDecay = citizen.demographics.age > 40 ? 0.001 : 0;
    const stressImpact = citizen.stress * 0.002;
    citizen.health = Math.max(0.1, citizen.health - healthDecay - stressImpact + this.prng() * 0.001);
  }

  /**
   * Calculate how a citizen responds to a specific incentive
   */
  calculateIncentiveResponse(citizenId: string, incentiveType: IncentiveType, incentiveStrength: number): IncentiveResponse {
    const citizen = this.citizens.get(citizenId);
    if (!citizen) {
      throw new Error(`Citizen ${citizenId} not found`);
    }

    // Response strength based on personality and current state
    let responseStrength = 0.5; // Base response
    
    switch (incentiveType) {
      case 'tax_reduction':
        responseStrength += citizen.psychology.savingsOrientation * 0.3;
        responseStrength += (1 - citizen.psychology.authorityRespect) * 0.2;
        break;
      case 'education_opportunity':
        responseStrength += citizen.psychology.openness * 0.4;
        responseStrength += citizen.goals.careerAdvancement * 0.3;
        break;
      case 'job_training':
        responseStrength += citizen.career.careerAmbition * 0.4;
        responseStrength += (1 - citizen.career.jobSatisfaction) * 0.3;
        break;
    }

    // Adjust for incentive strength
    responseStrength *= incentiveStrength;
    responseStrength = Math.max(0, Math.min(1, responseStrength));

    // Calculate behavior changes
    const behaviorChange: Record<string, number> = {};
    switch (incentiveType) {
      case 'tax_reduction':
        behaviorChange.spending = responseStrength * 0.2;
        behaviorChange.saving = responseStrength * 0.1;
        break;
      case 'education_opportunity':
        behaviorChange.education_investment = responseStrength * 0.5;
        behaviorChange.career_focus = responseStrength * 0.3;
        break;
    }

    return {
      citizenId: citizen.id,
      incentiveType,
      responseStrength,
      behaviorChange,
      adaptationRate: citizen.psychology.changeAdaptability,
      saturationPoint: 0.8 + this.prng() * 0.2
    };
  }

  // Getters and utility methods
  getCitizen(citizenId: string): Citizen | undefined {
    return this.citizens.get(citizenId);
  }

  getAllCitizens(): Citizen[] {
    return Array.from(this.citizens.values());
  }

  getCitizensByCity(cityId: string): Citizen[] {
    return this.getAllCitizens().filter(c => c.demographics.cityId === cityId);
  }

  getCitizensCount(): number {
    return this.citizens.size;
  }

  removeCitizen(citizenId: string): boolean {
    return this.citizens.delete(citizenId);
  }
}
