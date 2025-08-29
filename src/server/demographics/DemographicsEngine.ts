/**
 * Demographics & Lifecycle Engine
 * 
 * Comprehensive system for tracking population lifecycle, casualties, plunder,
 * and demographic transitions in the economic simulation.
 */

import {
  LifespanProfile,
  HealthStatus,
  ChronicCondition,
  MedicalEvent,
  CasualtyEvent,
  CasualtyRecord,
  PlunderEvent,
  DemographicTransition,
  MortalityData,
  BirthData,
  DemographicsAnalyticsData,
  CasualtyType,
  CasualtyCause,
  PlunderType,
  TransitionType,
  LifeStage,
  MedicalEventType,
  CasualtyOutcome,
  InjuryType,
  InjurySeverity
} from './types';

export class DemographicsEngine {
  private lifespanProfiles: Map<string, LifespanProfile> = new Map();
  private casualtyEvents: CasualtyEvent[] = [];
  private plunderEvents: PlunderEvent[] = [];
  private demographicTransitions: DemographicTransition[] = [];
  private mortalityData: MortalityData[] = [];
  private birthData: BirthData[] = [];
  private currentYear: number = 2024;

  // ===== LIFECYCLE MANAGEMENT =====

  createLifespanProfile(citizenId: string, birthDate: Date): LifespanProfile {
    const age = this.calculateAge(birthDate);
    const lifeExpectancy = this.calculateLifeExpectancy(age);
    
    const profile: LifespanProfile = {
      citizenId,
      birthDate,
      currentAge: age,
      lifeExpectancy,
      healthStatus: this.generateInitialHealthStatus(),
      mortalityRisk: this.calculateMortalityRisk(age, this.generateInitialHealthStatus()),
      lifeStage: this.determineLifeStage(age),
      dependents: [],
      caregivers: []
    };

    this.lifespanProfiles.set(citizenId, profile);
    return profile;
  }

  updateLifespanProfile(citizenId: string): LifespanProfile | null {
    const profile = this.lifespanProfiles.get(citizenId);
    if (!profile) return null;

    // Update age and life stage
    profile.currentAge = this.calculateAge(profile.birthDate);
    profile.lifeStage = this.determineLifeStage(profile.currentAge);
    
    // Update health status
    this.updateHealthStatus(profile);
    
    // Recalculate mortality risk
    profile.mortalityRisk = this.calculateMortalityRisk(profile.currentAge, profile.healthStatus);

    return profile;
  }

  processNaturalDeath(citizenId: string): boolean {
    const profile = this.lifespanProfiles.get(citizenId);
    if (!profile) return false;

    // Check if natural death occurs based on mortality risk
    const deathRoll = Math.random();
    if (deathRoll < profile.mortalityRisk) {
      this.recordDeath(citizenId, 'natural_causes');
      return true;
    }

    return false;
  }

  recordDeath(citizenId: string, cause: string): void {
    const profile = this.lifespanProfiles.get(citizenId);
    if (!profile) return;

    // Record medical event for death
    const deathEvent: MedicalEvent = {
      eventId: `death_${citizenId}_${Date.now()}`,
      date: new Date(),
      type: 'illness',
      description: `Death due to ${cause}`,
      outcome: 'fatal',
      cost: 0
    };

    profile.healthStatus.medicalHistory.push(deathEvent);
    
    // Remove from active profiles (could move to historical records)
    this.lifespanProfiles.delete(citizenId);
  }

  // ===== CASUALTY MANAGEMENT =====

  recordCasualtyEvent(
    type: CasualtyType,
    cause: CasualtyCause,
    location: string,
    casualties: CasualtyRecord[]
  ): CasualtyEvent {
    const event: CasualtyEvent = {
      eventId: `casualty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type,
      cause,
      location,
      casualties,
      severity: this.calculateCasualtySeverity(casualties),
      responseTime: this.calculateResponseTime(type, location),
      economicImpact: this.calculateCasualtyEconomicImpact(casualties),
      socialImpact: this.calculateCasualtySocialImpact(casualties, type)
    };

    this.casualtyEvents.push(event);
    
    // Process individual casualties
    casualties.forEach(casualty => {
      this.processCasualtyRecord(casualty, event);
    });

    return event;
  }

  processCasualtyRecord(casualty: CasualtyRecord, event: CasualtyEvent): void {
    const profile = this.lifespanProfiles.get(casualty.citizenId);
    if (!profile) return;

    switch (casualty.outcome) {
      case 'death':
        this.recordDeath(casualty.citizenId, `${event.type}_${event.cause}`);
        break;
      
      case 'critical_injury':
      case 'serious_injury':
      case 'minor_injury':
        this.recordInjury(profile, casualty, event);
        break;
    }
  }

  recordInjury(profile: LifespanProfile, casualty: CasualtyRecord, event: CasualtyEvent): void {
    const medicalEvent: MedicalEvent = {
      eventId: `injury_${profile.citizenId}_${Date.now()}`,
      date: event.timestamp,
      type: 'injury',
      description: `${casualty.injuryType} injury from ${event.cause}`,
      outcome: casualty.permanentDisability ? 'chronic' : 'recovered',
      cost: casualty.economicLoss
    };

    profile.healthStatus.medicalHistory.push(medicalEvent);
    
    // Update health status based on injury
    if (casualty.severity === 'life_threatening') {
      profile.healthStatus.physicalHealth = Math.max(0, profile.healthStatus.physicalHealth - 30);
      profile.mortalityRisk += 0.1;
    } else if (casualty.severity === 'severe') {
      profile.healthStatus.physicalHealth = Math.max(0, profile.healthStatus.physicalHealth - 20);
      profile.mortalityRisk += 0.05;
    }

    // Add chronic condition if permanent disability
    if (casualty.permanentDisability) {
      const condition: ChronicCondition = {
        conditionId: `disability_${Date.now()}`,
        name: `${casualty.injuryType} disability`,
        severity: casualty.severity === 'life_threatening' ? 'severe' : 'moderate',
        diagnosisDate: event.timestamp,
        treatmentStatus: 'managed',
        mortalityImpact: casualty.severity === 'life_threatening' ? 0.05 : 0.02
      };
      
      profile.healthStatus.chronicConditions.push(condition);
    }
  }

  // ===== PLUNDER & CONQUEST MANAGEMENT =====

  recordPlunderEvent(
    type: PlunderType,
    source: string,
    target: string,
    totalValue: number
  ): PlunderEvent {
    const event: PlunderEvent = {
      eventId: `plunder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type,
      source,
      target,
      resources: this.generateResourceCapture(totalValue * 0.4),
      population: this.generatePopulationCapture(source),
      infrastructure: this.generateInfrastructureCapture(totalValue * 0.3),
      totalValue,
      distributionPlan: this.generatePlunderDistribution(type)
    };

    this.plunderEvents.push(event);
    return event;
  }

  // ===== DEMOGRAPHIC TRANSITIONS =====

  initiateDemographicTransition(
    type: TransitionType,
    cause: string,
    affectedPopulation: number
  ): DemographicTransition {
    const transition: DemographicTransition = {
      transitionId: `transition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startDate: new Date(),
      type,
      cause: cause as any,
      affectedPopulation,
      demographicChanges: this.calculateDemographicChanges(type, affectedPopulation),
      economicImpact: this.calculateTransitionEconomicImpact(type, affectedPopulation),
      socialImpact: this.calculateTransitionSocialImpact(type, affectedPopulation)
    };

    this.demographicTransitions.push(transition);
    return transition;
  }

  // ===== ANALYTICS & REPORTING =====

  generateDemographicsAnalytics(): DemographicsAnalyticsData {
    return {
      populationGrowth: this.calculatePopulationGrowthMetrics(),
      mortalityAnalysis: this.analyzeMortality(),
      casualtyAnalysis: this.analyzeCasualties(),
      plunderAnalysis: this.analyzePlunder(),
      demographicProjections: this.generateDemographicProjections(),
      healthMetrics: this.calculateHealthMetrics(),
      recommendations: this.generateRecommendations()
    };
  }

  // ===== PRIVATE HELPER METHODS =====

  private calculateAge(birthDate: Date): number {
    const now = new Date();
    const ageInMs = now.getTime() - birthDate.getTime();
    return Math.floor(ageInMs / (365.25 * 24 * 60 * 60 * 1000));
  }

  private calculateLifeExpectancy(age: number): number {
    // Base life expectancy with age-adjusted calculation
    const baseLifeExpectancy = 78;
    const ageAdjustment = Math.max(0, (baseLifeExpectancy - age));
    return ageAdjustment + Math.random() * 10 - 5; // ±5 year variation
  }

  private generateInitialHealthStatus(): HealthStatus {
    return {
      physicalHealth: 70 + Math.random() * 30,
      mentalHealth: 70 + Math.random() * 30,
      chronicConditions: [],
      healthcareAccess: 50 + Math.random() * 50,
      lastCheckup: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      medicalHistory: []
    };
  }

  private calculateMortalityRisk(age: number, health: HealthStatus): number {
    let baseRisk = 0.001; // 0.1% base annual mortality risk
    
    // Age factor (exponential increase after 65)
    if (age > 65) {
      baseRisk *= Math.pow(1.1, age - 65);
    }
    
    // Health factor
    const healthFactor = (200 - health.physicalHealth - health.mentalHealth) / 200;
    baseRisk *= (1 + healthFactor);
    
    // Chronic conditions
    health.chronicConditions.forEach(condition => {
      baseRisk += condition.mortalityImpact;
    });
    
    return Math.min(1, baseRisk);
  }

  private determineLifeStage(age: number): LifeStage {
    if (age < 2) return 'infant';
    if (age < 12) return 'child';
    if (age < 18) return 'adolescent';
    if (age < 30) return 'young_adult';
    if (age < 50) return 'adult';
    if (age < 65) return 'middle_aged';
    if (age < 80) return 'senior';
    return 'elderly';
  }

  private updateHealthStatus(profile: LifespanProfile): void {
    // Gradual health decline with age
    const agingFactor = profile.currentAge > 50 ? (profile.currentAge - 50) * 0.1 : 0;
    profile.healthStatus.physicalHealth = Math.max(0, profile.healthStatus.physicalHealth - agingFactor);
    
    // Healthcare access affects health maintenance
    const healthcareFactor = profile.healthStatus.healthcareAccess / 100;
    profile.healthStatus.physicalHealth += healthcareFactor * 2;
    profile.healthStatus.mentalHealth += healthcareFactor * 1;
    
    // Cap at 100
    profile.healthStatus.physicalHealth = Math.min(100, profile.healthStatus.physicalHealth);
    profile.healthStatus.mentalHealth = Math.min(100, profile.healthStatus.mentalHealth);
  }

  private calculateCasualtySeverity(casualties: CasualtyRecord[]): any {
    const deaths = casualties.filter(c => c.outcome === 'death').length;
    const critical = casualties.filter(c => c.outcome === 'critical_injury').length;
    
    if (deaths > 10 || critical > 20) return 'catastrophic';
    if (deaths > 5 || critical > 10) return 'major';
    if (deaths > 1 || critical > 5) return 'moderate';
    return 'minor';
  }

  private calculateResponseTime(type: CasualtyType, location: string): number {
    // Base response time in minutes
    let baseTime = 15;
    
    if (type === 'warfare') baseTime = 30;
    if (type === 'disaster') baseTime = 45;
    if (location.includes('rural')) baseTime *= 2;
    
    return baseTime + Math.random() * 10;
  }

  private calculateCasualtyEconomicImpact(casualties: CasualtyRecord[]): number {
    return casualties.reduce((total, casualty) => total + casualty.economicLoss, 0);
  }

  private calculateCasualtySocialImpact(casualties: CasualtyRecord[], type: CasualtyType): number {
    const baseSocialImpact = casualties.length * 100;
    
    // Type multipliers
    const multipliers = {
      warfare: 2.0,
      terrorism: 3.0,
      crime: 1.5,
      disaster: 1.2,
      accident: 1.0,
      disease: 0.8,
      civil_unrest: 2.5,
      industrial: 1.3
    };
    
    return baseSocialImpact * (multipliers[type] || 1.0);
  }

  private generateResourceCapture(value: number): any[] {
    // Generate random resource captures based on total value
    const resources = ['gold', 'silver', 'food', 'weapons', 'tools', 'livestock'];
    return resources.map(resource => ({
      resourceType: resource,
      quantity: Math.floor(value / 100 * Math.random() * 10),
      quality: 60 + Math.random() * 40,
      value: value / resources.length * (0.5 + Math.random()),
      condition: Math.random() > 0.2 ? 'good' : 'damaged'
    }));
  }

  private generatePopulationCapture(source: string): any {
    const totalCaptured = Math.floor(Math.random() * 1000 + 100);
    return {
      totalCaptured,
      demographics: [
        { ageGroup: 'adult', gender: 'male', profession: 'farmer', skillLevel: 60, count: Math.floor(totalCaptured * 0.3), disposition: 'neutral' },
        { ageGroup: 'adult', gender: 'female', profession: 'artisan', skillLevel: 70, count: Math.floor(totalCaptured * 0.25), disposition: 'hostile' },
        { ageGroup: 'young_adult', gender: 'male', profession: 'soldier', skillLevel: 80, count: Math.floor(totalCaptured * 0.15), disposition: 'hostile' }
      ],
      slaves: Math.floor(totalCaptured * 0.2),
      prisoners: Math.floor(totalCaptured * 0.1),
      refugees: Math.floor(totalCaptured * 0.4),
      collaborators: Math.floor(totalCaptured * 0.05)
    };
  }

  private generateInfrastructureCapture(value: number): any {
    return {
      buildings: [
        { buildingType: 'workshop', condition: 80, functionality: 75, value: value * 0.3, canRelocate: false },
        { buildingType: 'warehouse', condition: 90, functionality: 95, value: value * 0.2, canRelocate: false }
      ],
      technology: [
        { technologyId: 'metalworking', name: 'Advanced Metalworking', level: 3, completeness: 85, researchValue: value * 0.15, militaryValue: value * 0.1, economicValue: value * 0.2 }
      ],
      knowledge: [
        { domain: 'engineering', expertise: ['construction', 'fortification'], specialists: 5, documentation: 70, transferability: 60 }
      ],
      culturalAssets: {
        artworks: 25,
        historicalArtifacts: 10,
        culturalKnowledge: ['local_traditions', 'craft_techniques'],
        languages: ['local_dialect'],
        traditions: ['harvest_festival', 'craft_guild_practices'],
        value: value * 0.1
      }
    };
  }

  private generatePlunderDistribution(type: PlunderType): any {
    const distributions = {
      conquest: { government: 30, military: 25, nobles: 20, merchants: 10, citizens: 10, infrastructure: 3, reserves: 2 },
      raid: { government: 20, military: 40, nobles: 15, merchants: 15, citizens: 5, infrastructure: 3, reserves: 2 },
      tribute: { government: 50, military: 15, nobles: 15, merchants: 10, citizens: 5, infrastructure: 3, reserves: 2 }
    };
    
    return distributions[type] || distributions.conquest;
  }

  private calculateDemographicChanges(type: TransitionType, affectedPopulation: number): any[] {
    // Simplified demographic change calculation
    const ageGroups = ['0-14', '15-29', '30-49', '50-64', '65+'];
    return ageGroups.map(ageGroup => ({
      ageGroup,
      gender: 'male',
      beforeCount: Math.floor(affectedPopulation / 10),
      afterCount: Math.floor(affectedPopulation / 10 * (0.9 + Math.random() * 0.2)),
      changeRate: -5 + Math.random() * 10,
      migrationIn: Math.floor(Math.random() * 100),
      migrationOut: Math.floor(Math.random() * 100),
      births: Math.floor(Math.random() * 50),
      deaths: Math.floor(Math.random() * 30)
    }));
  }

  private calculateTransitionEconomicImpact(type: TransitionType, affectedPopulation: number): any {
    const baseImpact = affectedPopulation / 10000;
    return {
      gdpChange: baseImpact * (-2 + Math.random() * 4),
      laborForceChange: baseImpact * (-1 + Math.random() * 2),
      dependencyRatioChange: baseImpact * (-0.5 + Math.random()),
      productivityChange: baseImpact * (-1 + Math.random() * 2),
      consumptionChange: baseImpact * (-1 + Math.random() * 2),
      savingsChange: baseImpact * (-2 + Math.random() * 4)
    };
  }

  private calculateTransitionSocialImpact(type: TransitionType, affectedPopulation: number): any {
    const baseImpact = affectedPopulation / 10000;
    return {
      familyStructureChange: baseImpact * (-1 + Math.random() * 2),
      educationDemandChange: baseImpact * Math.random() * 2,
      healthcareDemandChange: baseImpact * Math.random() * 3,
      housingDemandChange: baseImpact * (-1 + Math.random() * 2),
      socialCohesionChange: baseImpact * (-2 + Math.random()),
      culturalDiversityChange: baseImpact * Math.random()
    };
  }

  private calculatePopulationGrowthMetrics(): any {
    const currentPopulation = this.lifespanProfiles.size;
    return {
      currentGrowthRate: 1.2 + Math.random() * 0.8,
      naturalIncrease: 0.8 + Math.random() * 0.4,
      netMigration: -0.2 + Math.random() * 0.4,
      doubleTime: 50 + Math.random() * 20,
      peakPopulation: currentPopulation * (1.5 + Math.random() * 0.5),
      peakYear: this.currentYear + 30 + Math.random() * 20
    };
  }

  private analyzeMortality(): any {
    return {
      overallTrends: [
        { period: '2020-2024', mortalityRate: 8.5, change: -0.2, primaryCauses: ['heart_disease', 'cancer'], affectedGroups: ['elderly'] }
      ],
      riskFactors: [
        { factor: 'smoking', prevalence: 15, mortalityImpact: 0.05, economicCost: 50000, interventionCost: 1000, preventionPotential: 80 }
      ],
      preventableDeaths: Math.floor(this.casualtyEvents.length * 0.3),
      healthcareGaps: [
        { service: 'preventive_care', coverage: 60, demand: 90, gap: 30, priority: 'high' }
      ],
      interventionOpportunities: [
        { intervention: 'vaccination_program', targetPopulation: 10000, costPerPerson: 50, livesaved: 100, costPerLifeSaved: 5000, feasibility: 85 }
      ]
    };
  }

  private analyzeCasualties(): any {
    const totalCasualties = this.casualtyEvents.reduce((sum, event) => sum + event.casualties.length, 0);
    return {
      totalCasualties,
      casualtyRate: totalCasualties / Math.max(1, this.lifespanProfiles.size) * 1000,
      byType: this.casualtyEvents.reduce((acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + event.casualties.length;
        return acc;
      }, {} as Record<CasualtyType, number>),
      byCause: this.casualtyEvents.reduce((acc, event) => {
        acc[event.cause] = (acc[event.cause] || 0) + event.casualties.length;
        return acc;
      }, {} as Record<CasualtyCause, number>),
      trends: [
        { period: '2024', casualties: totalCasualties, change: 0, primaryTypes: ['accident', 'crime'], emergingThreats: ['cyber_warfare'] }
      ],
      hotspots: [
        { location: 'downtown', casualtyRate: 15, primaryCauses: ['crime', 'accident'], riskLevel: 'high', interventionNeeded: true }
      ],
      preventionOpportunities: [
        { measure: 'improved_lighting', targetCasualties: ['crime'], effectiveness: 70, cost: 100000, implementation: 'infrastructure', timeframe: '6_months' }
      ]
    };
  }

  private analyzePlunder(): any {
    const totalValue = this.plunderEvents.reduce((sum, event) => sum + event.totalValue, 0);
    return {
      totalValue,
      byType: this.plunderEvents.reduce((acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + event.totalValue;
        return acc;
      }, {} as Record<PlunderType, number>),
      efficiency: 0.7 + Math.random() * 0.2,
      distribution: {
        inequality: 0.6 + Math.random() * 0.3,
        concentrationRatio: 0.4 + Math.random() * 0.2,
        beneficiaryGroups: ['military', 'nobles', 'merchants'],
        socialTension: 30 + Math.random() * 40
      },
      economicImpact: {
        gdpBoost: totalValue / 1000000,
        inflationPressure: totalValue / 10000000,
        tradeBalance: totalValue / 2000000,
        investmentIncrease: totalValue / 5000000,
        consumptionIncrease: totalValue / 3000000
      },
      sustainabilityMetrics: {
        renewabilityRate: 20 + Math.random() * 30,
        depletionRisk: 40 + Math.random() * 30,
        alternativeSources: 3 + Math.random() * 5,
        longTermViability: 50 + Math.random() * 30
      }
    };
  }

  private generateDemographicProjections(): any {
    const timeHorizon = 50;
    const currentPopulation = this.lifespanProfiles.size;
    
    return {
      timeHorizon,
      populationProjection: Array.from({ length: 10 }, (_, i) => ({
        year: this.currentYear + i * 5,
        totalPopulation: Math.floor(currentPopulation * Math.pow(1.012, i * 5)),
        growthRate: 1.2 - i * 0.1,
        births: Math.floor(currentPopulation * 0.015),
        deaths: Math.floor(currentPopulation * 0.008),
        netMigration: Math.floor(currentPopulation * 0.002)
      })),
      ageStructureEvolution: Array.from({ length: 10 }, (_, i) => ({
        year: this.currentYear + i * 5,
        ageGroups: {
          '0-14': 20 - i * 0.5,
          '15-64': 65 + i * 0.2,
          '65+': 15 + i * 0.3
        },
        medianAge: 35 + i * 0.5,
        youthRatio: 25 - i * 0.5,
        elderlyRatio: 15 + i * 0.3
      })),
      dependencyRatioProjection: Array.from({ length: 10 }, (_, i) => ({
        year: this.currentYear + i * 5,
        totalDependencyRatio: 50 + i * 2,
        youthDependencyRatio: 30 - i * 0.5,
        elderlyDependencyRatio: 20 + i * 2.5,
        economicImpact: i * 0.1
      })),
      laborForceProjection: Array.from({ length: 10 }, (_, i) => ({
        year: this.currentYear + i * 5,
        laborForceSize: Math.floor(currentPopulation * 0.65 * Math.pow(1.01, i * 5)),
        participationRate: 65 + i * 0.2,
        skillDistribution: {
          'low': 30 - i * 0.5,
          'medium': 50,
          'high': 20 + i * 0.5
        },
        productivityIndex: 100 + i * 2
      }))
    };
  }

  private calculateHealthMetrics(): any {
    const profiles = Array.from(this.lifespanProfiles.values());
    const avgPhysicalHealth = profiles.reduce((sum, p) => sum + p.healthStatus.physicalHealth, 0) / Math.max(1, profiles.length);
    const avgMentalHealth = profiles.reduce((sum, p) => sum + p.healthStatus.mentalHealth, 0) / Math.max(1, profiles.length);
    
    return {
      overallHealthIndex: (avgPhysicalHealth + avgMentalHealth) / 2,
      lifeExpectancyTrend: 0.2,
      healthcareAccessibility: profiles.reduce((sum, p) => sum + p.healthStatus.healthcareAccess, 0) / Math.max(1, profiles.length),
      diseasePrevalence: [
        { disease: 'hypertension', prevalence: 25, incidence: 3, mortality: 0.5, cost: 5000, preventable: true },
        { disease: 'diabetes', prevalence: 8, incidence: 1.2, mortality: 0.3, cost: 8000, preventable: true }
      ],
      healthInequality: 15 + Math.random() * 10,
      preventiveCareUtilization: 45 + Math.random() * 20
    };
  }

  private generateRecommendations(): any[] {
    return [
      {
        category: 'healthcare',
        priority: 'high',
        title: 'Expand Preventive Care Programs',
        description: 'Increase access to preventive healthcare services to reduce long-term mortality risk',
        expectedImpact: 'Reduce mortality rate by 15% over 10 years',
        cost: 5000000,
        timeframe: '2_years',
        feasibility: 85,
        riskLevel: 'low'
      },
      {
        category: 'casualty_prevention',
        priority: 'critical',
        title: 'Enhanced Emergency Response System',
        description: 'Improve emergency response times and capabilities to reduce casualty severity',
        expectedImpact: 'Reduce casualty fatality rate by 25%',
        cost: 10000000,
        timeframe: '3_years',
        feasibility: 75,
        riskLevel: 'medium'
      },
      {
        category: 'public_health',
        priority: 'medium',
        title: 'Population Health Monitoring System',
        description: 'Implement comprehensive health tracking and early warning systems',
        expectedImpact: 'Improve health outcomes by 20%',
        cost: 3000000,
        timeframe: '18_months',
        feasibility: 90,
        riskLevel: 'low'
      }
    ];
  }

  // ===== PUBLIC GETTERS =====

  getLifespanProfile(citizenId: string): LifespanProfile | undefined {
    return this.lifespanProfiles.get(citizenId);
  }

  getAllLifespanProfiles(): LifespanProfile[] {
    return Array.from(this.lifespanProfiles.values());
  }

  getCasualtyEvents(): CasualtyEvent[] {
    return [...this.casualtyEvents];
  }

  getPlunderEvents(): PlunderEvent[] {
    return [...this.plunderEvents];
  }

  getDemographicTransitions(): DemographicTransition[] {
    return [...this.demographicTransitions];
  }

  getCurrentPopulation(): number {
    return this.lifespanProfiles.size;
  }
}
