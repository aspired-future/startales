/**
 * Immigration & Migration Engine - Core Engine
 * 
 * Manages comprehensive population movement modeling including legal/illegal immigration,
 * internal migration, cultural integration, and policy effects on migration flows.
 */

import { 
  MigrationFlow, 
  ImmigrationPolicy, 
  IntegrationOutcome,
  MigrationAnalytics,
  MigrationEvent,
  MigrationEngineConfig,
  DEFAULT_MIGRATION_POLICIES,
  MIGRATION_FLOW_TYPES,
  MIGRATION_SUBTYPES,
  INTEGRATION_STAGES
} from './types.js';

export class MigrationEngine {
  private migrationFlows: Map<string, MigrationFlow> = new Map();
  private immigrationPolicies: Map<string, ImmigrationPolicy> = new Map();
  private integrationOutcomes: Map<string, IntegrationOutcome> = new Map();
  private migrationEvents: MigrationEvent[] = [];
  private config: MigrationEngineConfig;

  constructor(config?: Partial<MigrationEngineConfig>) {
    this.config = {
      baseFlowVolatility: 0.15,
      economicSensitivity: 0.8,
      policySensitivity: 0.6,
      networkEffectStrength: 0.4,
      integrationTimeframe: 60, // 5 years average
      integrationVariability: 0.3,
      supportServiceEffectiveness: 0.7,
      discriminationImpact: 0.4,
      laborMarketAbsorption: 0.8,
      skillPremium: 1.5,
      entrepreneurshipRate: 0.15,
      remittanceRate: 0.2,
      culturalAdaptationRate: 0.02, // 2% per month
      socialCohesionSensitivity: 0.3,
      interculturalContactRate: 0.05,
      segregationTendency: 0.2,
      policyImplementationLag: 6, // 6 months
      enforcementEffectiveness: 0.75,
      publicOpinionInfluence: 0.4,
      timeStep: 'month',
      randomEventFrequency: 0.03,
      capacityConstraints: true,
      ...config
    };

    // Initialize default policies
    this.initializeDefaultPolicies();
  }

  private initializeDefaultPolicies(): void {
    DEFAULT_MIGRATION_POLICIES.forEach(policy => {
      this.immigrationPolicies.set(policy.id, policy);
    });
  }

  /**
   * Create a new migration flow
   */
  createMigrationFlow(params: {
    type: MigrationFlow['type'];
    subtype: MigrationFlow['subtype'];
    originCityId?: string;
    originCountry?: string;
    destinationCityId: string;
    populationSize: number;
    demographics: MigrationFlow['demographics'];
    economicProfile: MigrationFlow['economicProfile'];
    pushFactors: MigrationFlow['pushFactors'];
    pullFactors: MigrationFlow['pullFactors'];
    legalStatus: MigrationFlow['legalStatus'];
    integrationFactors: MigrationFlow['integrationFactors'];
    duration?: number;
  }): MigrationFlow {
    const flowId = `flow_${params.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const flow: MigrationFlow = {
      id: flowId,
      type: params.type,
      subtype: params.subtype,
      originCityId: params.originCityId,
      originCountry: params.originCountry,
      destinationCityId: params.destinationCityId,
      populationSize: params.populationSize,
      startDate: new Date(),
      duration: params.duration,
      demographics: params.demographics,
      economicProfile: params.economicProfile,
      pushFactors: params.pushFactors,
      pullFactors: params.pullFactors,
      legalStatus: params.legalStatus,
      visaType: this.determineVisaType(params.subtype, params.legalStatus),
      documentationLevel: this.calculateDocumentationLevel(params.legalStatus, params.subtype),
      integrationFactors: params.integrationFactors,
      createdAt: new Date(),
      lastUpdated: new Date(),
      status: 'active'
    };

    // Apply policy effects
    this.applyPolicyEffectsToFlow(flow);
    
    this.migrationFlows.set(flowId, flow);
    
    // Create initial integration outcome
    this.createIntegrationOutcome(flow);
    
    // Log migration event
    this.logMigrationEvent({
      type: 'flow_change',
      description: `New ${flow.type} flow created: ${flow.populationSize} people from ${flow.originCountry || flow.originCityId} to ${flow.destinationCityId}`,
      severity: flow.populationSize > 1000 ? 'high' : 'medium',
      affectedCities: [flow.destinationCityId],
      affectedFlows: [flowId],
      impact: {
        populationImpact: flow.populationSize,
        economicImpact: this.calculateEconomicImpact(flow),
        socialImpact: this.calculateSocialImpact(flow),
        policyImpact: 0
      }
    });

    return flow;
  }

  /**
   * Simulate migration system for one time step
   */
  simulateTimeStep(): void {
    // Update existing flows
    this.updateMigrationFlows();
    
    // Update integration outcomes
    this.updateIntegrationOutcomes();
    
    // Apply policy effects
    this.applyPolicyEffects();
    
    // Generate random events
    this.processRandomEvents();
    
    // Update flow dynamics based on network effects
    this.updateNetworkEffects();
    
    // Check capacity constraints
    this.checkCapacityConstraints();
  }

  /**
   * Create or update immigration policy
   */
  createImmigrationPolicy(policy: Omit<ImmigrationPolicy, 'id' | 'createdAt' | 'lastUpdated'>): ImmigrationPolicy {
    const policyId = `policy_${policy.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    
    const newPolicy: ImmigrationPolicy = {
      id: policyId,
      createdAt: new Date(),
      lastUpdated: new Date(),
      ...policy
    };

    this.immigrationPolicies.set(policyId, newPolicy);
    
    // Apply policy effects to existing flows
    this.applyPolicyToExistingFlows(newPolicy);
    
    // Log policy event
    this.logMigrationEvent({
      type: 'policy_implementation',
      description: `New immigration policy implemented: ${policy.name}`,
      severity: 'medium',
      affectedCities: policy.targetCities || [],
      affectedFlows: [],
      affectedPolicies: [policyId],
      impact: {
        populationImpact: 0,
        economicImpact: policy.implementationCost,
        socialImpact: policy.effects.socialCohesion,
        policyImpact: policy.effects.legalPathwayStrength
      }
    });

    return newPolicy;
  }

  /**
   * Get migration analytics for a city
   */
  getMigrationAnalytics(cityId: string, timeframe: MigrationAnalytics['timeframe'] = 'monthly'): MigrationAnalytics {
    const cityFlows = Array.from(this.migrationFlows.values())
      .filter(flow => flow.destinationCityId === cityId || flow.originCityId === cityId);
    
    const cityIntegrationOutcomes = Array.from(this.integrationOutcomes.values())
      .filter(outcome => outcome.cityId === cityId);

    return {
      cityId,
      analysisDate: new Date(),
      timeframe,
      flowAnalytics: this.calculateFlowAnalytics(cityFlows, cityId),
      integrationAnalytics: this.calculateIntegrationAnalytics(cityIntegrationOutcomes),
      economicImpact: this.calculateEconomicImpactAnalytics(cityFlows, cityIntegrationOutcomes),
      socialImpact: this.calculateSocialImpactAnalytics(cityFlows, cityIntegrationOutcomes),
      policyEffectiveness: this.calculatePolicyEffectiveness(cityId),
      projections: this.generateProjections(cityId, cityFlows)
    };
  }

  /**
   * Get all migration flows
   */
  getAllMigrationFlows(): MigrationFlow[] {
    return Array.from(this.migrationFlows.values());
  }

  /**
   * Get flows for specific city
   */
  getCityMigrationFlows(cityId: string): MigrationFlow[] {
    return Array.from(this.migrationFlows.values())
      .filter(flow => flow.destinationCityId === cityId || flow.originCityId === cityId);
  }

  /**
   * Get integration outcomes for city
   */
  getCityIntegrationOutcomes(cityId: string): IntegrationOutcome[] {
    return Array.from(this.integrationOutcomes.values())
      .filter(outcome => outcome.cityId === cityId);
  }

  /**
   * Get all immigration policies
   */
  getAllPolicies(): ImmigrationPolicy[] {
    return Array.from(this.immigrationPolicies.values());
  }

  /**
   * Get migration events
   */
  getMigrationEvents(limit?: number): MigrationEvent[] {
    const events = this.migrationEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return limit ? events.slice(0, limit) : events;
  }

  // Private helper methods

  private updateMigrationFlows(): void {
    this.migrationFlows.forEach(flow => {
      // Update flow status based on duration
      if (flow.duration && flow.endDate && new Date() > flow.endDate) {
        flow.status = 'completed';
      }
      
      // Apply economic and policy pressures
      this.updateFlowDynamics(flow);
      
      // Update population size based on various factors
      this.updateFlowPopulation(flow);
      
      flow.lastUpdated = new Date();
    });
  }

  private updateFlowDynamics(flow: MigrationFlow): void {
    // Economic sensitivity effects
    const economicPressure = this.calculateEconomicPressure(flow);
    const policyPressure = this.calculatePolicyPressure(flow);
    
    // Adjust flow characteristics based on pressures
    const totalPressure = economicPressure * this.config.economicSensitivity + 
                         policyPressure * this.config.policySensitivity;
    
    // Update push/pull factors
    flow.pushFactors.economic = Math.max(0, Math.min(100, 
      flow.pushFactors.economic + totalPressure * 0.1));
    flow.pullFactors.economic = Math.max(0, Math.min(100, 
      flow.pullFactors.economic - totalPressure * 0.1));
  }

  private updateFlowPopulation(flow: MigrationFlow): void {
    // Base volatility
    const volatility = (Math.random() - 0.5) * this.config.baseFlowVolatility;
    
    // Policy effects
    const policyMultiplier = this.calculatePolicyMultiplier(flow);
    
    // Network effects (existing migrants attract more)
    const networkEffect = this.calculateNetworkEffect(flow);
    
    // Calculate population change
    const changeRate = volatility + (policyMultiplier - 1) * 0.1 + networkEffect;
    const populationChange = Math.floor(flow.populationSize * changeRate);
    
    flow.populationSize = Math.max(0, flow.populationSize + populationChange);
  }

  private updateIntegrationOutcomes(): void {
    this.integrationOutcomes.forEach(outcome => {
      this.progressIntegration(outcome);
      outcome.lastAssessment = new Date();
    });
  }

  private progressIntegration(outcome: IntegrationOutcome): void {
    // Increase time in destination
    outcome.timeInDestination += 1; // Assuming monthly updates
    
    // Progress integration based on various factors
    const integrationRate = this.calculateIntegrationRate(outcome);
    
    // Update economic integration
    this.updateEconomicIntegration(outcome, integrationRate);
    
    // Update social integration
    this.updateSocialIntegration(outcome, integrationRate);
    
    // Update civic integration
    this.updateCivicIntegration(outcome, integrationRate);
    
    // Update cultural integration
    this.updateCulturalIntegration(outcome, integrationRate);
    
    // Update integration stage
    this.updateIntegrationStage(outcome);
  }

  private calculateIntegrationRate(outcome: IntegrationOutcome): number {
    let baseRate = this.config.culturalAdaptationRate;
    
    // Adjust based on support services
    if (outcome.serviceUtilization.languageClasses) baseRate *= 1.3;
    if (outcome.serviceUtilization.jobTraining) baseRate *= 1.2;
    if (outcome.serviceUtilization.mentorshipPrograms) baseRate *= 1.4;
    
    // Adjust based on barriers
    const barrierImpact = (outcome.integrationChallenges.languageBarriers + 
                          outcome.integrationChallenges.discriminationLevel + 
                          outcome.integrationChallenges.culturalBarriers) / 300;
    baseRate *= (1 - barrierImpact * this.config.discriminationImpact);
    
    return Math.max(0.001, baseRate);
  }

  private updateEconomicIntegration(outcome: IntegrationOutcome, rate: number): void {
    const economic = outcome.economicIntegration;
    
    // Employment rate improvement
    economic.employmentRate = Math.min(95, economic.employmentRate + rate * 100);
    
    // Income growth
    const skillUtilization = economic.jobSkillUtilization / 100;
    const incomeGrowthRate = rate * skillUtilization * this.config.skillPremium;
    economic.averageIncome *= (1 + incomeGrowthRate);
    
    // Skill utilization improvement
    economic.jobSkillUtilization = Math.min(100, 
      economic.jobSkillUtilization + rate * 50);
    
    // Entrepreneurship development
    if (outcome.timeInDestination > 24) { // After 2 years
      economic.entrepreneurshipRate = Math.min(100, 
        economic.entrepreneurshipRate + rate * this.config.entrepreneurshipRate * 100);
    }
    
    // Social mobility
    economic.socialMobility = Math.min(100, 
      economic.socialMobility + rate * 30);
  }

  private updateSocialIntegration(outcome: IntegrationOutcome, rate: number): void {
    const social = outcome.socialIntegration;
    
    // Language proficiency
    social.languageProficiency = Math.min(100, 
      social.languageProficiency + rate * 80);
    
    // Social network growth
    const networkGrowthRate = rate * this.config.interculturalContactRate * 1000;
    social.socialNetworkSize += networkGrowthRate;
    
    // Community participation
    social.communityParticipation = Math.min(100, 
      social.communityParticipation + rate * 40);
    
    // Intercultural friendships
    social.interculturalFriendships = Math.min(100, 
      social.interculturalFriendships + rate * 35);
    
    // Cultural adaptation
    social.culturalAdaptation = Math.min(100, 
      social.culturalAdaptation + rate * 60);
    
    // Discrimination experience (should decrease over time)
    social.discriminationExperience = Math.max(0, 
      social.discriminationExperience - rate * 20);
  }

  private updateCivicIntegration(outcome: IntegrationOutcome, rate: number): void {
    const civic = outcome.civicIntegration;
    
    // Civic participation
    civic.civicParticipation = Math.min(100, 
      civic.civicParticipation + rate * 25);
    
    // Political engagement (slower development)
    if (outcome.timeInDestination > 36) { // After 3 years
      civic.politicalEngagement = Math.min(100, 
        civic.politicalEngagement + rate * 15);
    }
    
    // Legal knowledge
    civic.legalKnowledge = Math.min(100, 
      civic.legalKnowledge + rate * 45);
    
    // Institutional trust
    civic.institutionalTrust = Math.min(100, 
      civic.institutionalTrust + rate * 30);
    
    // Legal status progression
    if (outcome.timeInDestination > 60 && civic.legalStatus === 'temporary') {
      civic.legalStatus = 'permanent_resident';
    }
    if (outcome.timeInDestination > 120 && civic.legalStatus === 'permanent_resident') {
      civic.legalStatus = 'citizen';
    }
  }

  private updateCulturalIntegration(outcome: IntegrationOutcome, rate: number): void {
    const cultural = outcome.culturalIntegration;
    
    // Cultural adoption (gradual increase)
    cultural.culturalAdoption = Math.min(100, 
      cultural.culturalAdoption + rate * 40);
    
    // Cultural retention (gradual decrease, but stabilizes)
    const retentionDecay = rate * 20 * (cultural.culturalRetention / 100);
    cultural.culturalRetention = Math.max(30, 
      cultural.culturalRetention - retentionDecay);
    
    // Bilingual proficiency
    cultural.bilingualProficiency = Math.min(100, 
      cultural.bilingualProficiency + rate * 50);
    
    // Cultural bridging ability
    cultural.culturalBridging = Math.min(100, 
      cultural.culturalBridging + rate * 35);
    
    // Identity formation evolution
    if (cultural.culturalAdoption > 70 && cultural.culturalRetention > 50) {
      cultural.identityFormation = 'bicultural';
    } else if (cultural.culturalAdoption > 80) {
      cultural.identityFormation = 'destination';
    } else if (cultural.culturalRetention > 80) {
      cultural.identityFormation = 'origin';
    }
  }

  private updateIntegrationStage(outcome: IntegrationOutcome): void {
    const avgIntegration = (
      outcome.economicIntegration.employmentRate +
      outcome.socialIntegration.languageProficiency +
      outcome.civicIntegration.civicParticipation +
      outcome.culturalIntegration.culturalAdoption
    ) / 4;
    
    if (avgIntegration >= 80) {
      outcome.integrationStage = INTEGRATION_STAGES.FULL_INTEGRATION;
    } else if (avgIntegration >= 60) {
      outcome.integrationStage = INTEGRATION_STAGES.INTEGRATION;
    } else if (avgIntegration >= 40) {
      outcome.integrationStage = INTEGRATION_STAGES.ADAPTATION;
    } else if (outcome.timeInDestination > 6) {
      outcome.integrationStage = INTEGRATION_STAGES.INITIAL_SETTLEMENT;
    } else {
      outcome.integrationStage = INTEGRATION_STAGES.ARRIVAL;
    }
  }

  private applyPolicyEffects(): void {
    // Apply policy effects to flows with implementation lag
    this.immigrationPolicies.forEach(policy => {
      if (policy.status === 'active') {
        const monthsSinceImplementation = 
          (Date.now() - policy.implementationDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
        
        if (monthsSinceImplementation >= this.config.policyImplementationLag) {
          this.applyPolicyToFlows(policy);
        }
      }
    });
  }

  private applyPolicyToFlows(policy: ImmigrationPolicy): void {
    this.migrationFlows.forEach(flow => {
      if (this.isPolicyApplicable(policy, flow)) {
        this.applyPolicyEffectsToFlow(flow, policy);
      }
    });
  }

  private applyPolicyEffectsToFlow(flow: MigrationFlow, policy?: ImmigrationPolicy): void {
    if (!policy) {
      // Apply all applicable policies
      this.immigrationPolicies.forEach(p => {
        if (this.isPolicyApplicable(p, flow)) {
          this.applyPolicyEffectsToFlow(flow, p);
        }
      });
      return;
    }
    
    // Apply specific policy effects
    const effectiveness = policy.enforcementLevel / 100 * this.config.enforcementEffectiveness;
    
    // Adjust flow population based on policy multiplier
    const policyEffect = (policy.effects.flowMultiplier - 1) * effectiveness;
    flow.populationSize = Math.floor(flow.populationSize * (1 + policyEffect));
    
    // Adjust legal status based on policy
    if (policy.effects.legalPathwayStrength > 70 && flow.legalStatus === 'undocumented') {
      if (Math.random() < effectiveness * 0.3) {
        flow.legalStatus = 'documented';
        flow.documentationLevel = Math.min(100, flow.documentationLevel + 30);
      }
    }
  }

  private isPolicyApplicable(policy: ImmigrationPolicy, flow: MigrationFlow): boolean {
    // Check if policy targets this flow type
    if (!policy.targetGroups.includes(flow.subtype)) {
      return false;
    }
    
    // Check if policy targets this city
    if (policy.targetCities && !policy.targetCities.includes(flow.destinationCityId)) {
      return false;
    }
    
    // Check if policy is active
    if (policy.status !== 'active') {
      return false;
    }
    
    return true;
  }

  private applyPolicyToExistingFlows(policy: ImmigrationPolicy): void {
    this.migrationFlows.forEach(flow => {
      if (this.isPolicyApplicable(policy, flow)) {
        this.applyPolicyEffectsToFlow(flow, policy);
      }
    });
  }

  private processRandomEvents(): void {
    if (Math.random() < this.config.randomEventFrequency) {
      this.generateRandomMigrationEvent();
    }
  }

  private generateRandomMigrationEvent(): void {
    const eventTypes = ['crisis_response', 'capacity_limit', 'flow_change'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)] as MigrationEvent['type'];
    
    const cities = Array.from(new Set(
      Array.from(this.migrationFlows.values()).map(f => f.destinationCityId)
    ));
    
    if (cities.length === 0) return;
    
    const affectedCity = cities[Math.floor(Math.random() * cities.length)];
    
    this.logMigrationEvent({
      type: eventType,
      description: this.generateEventDescription(eventType),
      severity: Math.random() > 0.7 ? 'high' : 'medium',
      affectedCities: [affectedCity],
      affectedFlows: [],
      impact: {
        populationImpact: Math.floor(Math.random() * 1000),
        economicImpact: (Math.random() - 0.5) * 1000000,
        socialImpact: (Math.random() - 0.5) * 20,
        policyImpact: (Math.random() - 0.5) * 10
      }
    });
  }

  private generateEventDescription(eventType: MigrationEvent['type']): string {
    const descriptions = {
      'crisis_response': 'Emergency migration response activated due to regional crisis',
      'capacity_limit': 'Migration capacity limits reached, processing delays expected',
      'flow_change': 'Significant change in migration patterns detected'
    };
    
    return descriptions[eventType] || 'Migration system event occurred';
  }

  private updateNetworkEffects(): void {
    // Calculate network effects for each destination city
    const cityNetworks = new Map<string, number>();
    
    this.migrationFlows.forEach(flow => {
      const existing = cityNetworks.get(flow.destinationCityId) || 0;
      cityNetworks.set(flow.destinationCityId, existing + flow.populationSize);
    });
    
    // Apply network effects to flows
    this.migrationFlows.forEach(flow => {
      const networkSize = cityNetworks.get(flow.destinationCityId) || 0;
      const networkEffect = this.calculateNetworkEffect(flow, networkSize);
      
      // Network effects increase pull factors
      flow.pullFactors.social = Math.min(100, 
        flow.pullFactors.social + networkEffect * 10);
    });
  }

  private calculateNetworkEffect(flow: MigrationFlow, networkSize?: number): number {
    if (!networkSize) {
      networkSize = Array.from(this.migrationFlows.values())
        .filter(f => f.destinationCityId === flow.destinationCityId)
        .reduce((sum, f) => sum + f.populationSize, 0);
    }
    
    // Network effect increases with network size but has diminishing returns
    const normalizedSize = networkSize / 10000; // Normalize to reasonable scale
    return Math.min(1, normalizedSize * this.config.networkEffectStrength);
  }

  private checkCapacityConstraints(): void {
    if (!this.config.capacityConstraints) return;
    
    // Check capacity for each destination city
    const cityCapacities = new Map<string, number>();
    
    this.migrationFlows.forEach(flow => {
      const existing = cityCapacities.get(flow.destinationCityId) || 0;
      cityCapacities.set(flow.destinationCityId, existing + flow.populationSize);
    });
    
    // Apply capacity constraints
    cityCapacities.forEach((capacity, cityId) => {
      const maxCapacity = 100000; // Simplified capacity limit
      
      if (capacity > maxCapacity) {
        this.logMigrationEvent({
          type: 'capacity_limit',
          description: `Migration capacity exceeded in ${cityId}`,
          severity: 'critical',
          affectedCities: [cityId],
          affectedFlows: [],
          impact: {
            populationImpact: capacity - maxCapacity,
            economicImpact: -500000,
            socialImpact: -15,
            policyImpact: -20
          }
        });
      }
    });
  }

  private createIntegrationOutcome(flow: MigrationFlow): IntegrationOutcome {
    const outcomeId = `integration_${flow.id}_${Date.now()}`;
    
    const outcome: IntegrationOutcome = {
      id: outcomeId,
      migrationFlowId: flow.id,
      cityId: flow.destinationCityId,
      timeInDestination: 0,
      integrationStage: INTEGRATION_STAGES.ARRIVAL,
      
      economicIntegration: {
        employmentRate: Math.max(0, 60 - (100 - flow.integrationFactors.languageProficiency) * 0.3),
        averageIncome: flow.economicProfile.averageIncome * 0.7, // Initial income penalty
        incomeGrowth: 0,
        jobSkillUtilization: flow.integrationFactors.languageProficiency * 0.6,
        entrepreneurshipRate: 0,
        socialMobility: 30
      },
      
      socialIntegration: {
        languageProficiency: flow.integrationFactors.languageProficiency,
        socialNetworkSize: flow.integrationFactors.socialNetworks * 0.1,
        communityParticipation: 20,
        interculturalFriendships: 10,
        culturalAdaptation: flow.integrationFactors.culturalSimilarity,
        discriminationExperience: Math.max(0, 50 - flow.integrationFactors.culturalSimilarity)
      },
      
      civicIntegration: {
        legalStatus: flow.legalStatus === 'documented' ? 'temporary' : 'undocumented',
        civicParticipation: 15,
        politicalEngagement: 5,
        legalKnowledge: 30,
        institutionalTrust: 50
      },
      
      culturalIntegration: {
        culturalRetention: 90,
        culturalAdoption: flow.integrationFactors.culturalSimilarity,
        bilingualProficiency: flow.integrationFactors.languageProficiency * 0.8,
        culturalBridging: 20,
        identityFormation: 'origin'
      },
      
      integrationChallenges: {
        languageBarriers: Math.max(0, 100 - flow.integrationFactors.languageProficiency),
        credentialRecognition: Math.random() * 60 + 20,
        discriminationLevel: Math.max(0, 60 - flow.integrationFactors.culturalSimilarity),
        culturalBarriers: Math.max(0, 80 - flow.integrationFactors.culturalSimilarity),
        economicBarriers: Math.random() * 40 + 20,
        legalBarriers: flow.legalStatus === 'undocumented' ? 80 : 20
      },
      
      serviceUtilization: {
        languageClasses: Math.random() > 0.6,
        jobTraining: Math.random() > 0.7,
        credentialRecognition: Math.random() > 0.8,
        socialServices: Math.random() > 0.5,
        legalAid: flow.legalStatus === 'undocumented' ? Math.random() > 0.4 : false,
        culturalOrientation: Math.random() > 0.6,
        mentorshipPrograms: Math.random() > 0.8
      },
      
      outcomes: {
        overallSatisfaction: 60,
        qualityOfLifeChange: 0,
        futureIntentions: 'undecided',
        recommendationLikelihood: 50
      },
      
      lastAssessment: new Date(),
      assessmentFrequency: 3, // Every 3 months
      dataQuality: 75
    };
    
    this.integrationOutcomes.set(outcomeId, outcome);
    return outcome;
  }

  // Analytics calculation methods

  private calculateFlowAnalytics(flows: MigrationFlow[], cityId: string): MigrationAnalytics['flowAnalytics'] {
    const inflows = flows.filter(f => f.destinationCityId === cityId && f.type === 'immigration');
    const outflows = flows.filter(f => f.originCityId === cityId && f.type === 'emigration');
    
    const totalInflows = inflows.reduce((sum, f) => sum + f.populationSize, 0);
    const totalOutflows = outflows.reduce((sum, f) => sum + f.populationSize, 0);
    
    return {
      totalInflows,
      totalOutflows,
      netMigration: totalInflows - totalOutflows,
      migrationRate: (totalInflows - totalOutflows) / 1000, // Per 1000 population
      flowsByType: this.groupFlowsByProperty(flows, 'type'),
      flowsBySubtype: this.groupFlowsByProperty(flows, 'subtype'),
      flowsByOrigin: this.groupFlowsByOrigin(flows),
      flowTrends: {
        growthRate: this.calculateFlowGrowthRate(flows),
        seasonality: {},
        volatility: this.config.baseFlowVolatility
      }
    };
  }

  private calculateIntegrationAnalytics(outcomes: IntegrationOutcome[]): MigrationAnalytics['integrationAnalytics'] {
    if (outcomes.length === 0) {
      return {
        averageIntegrationScore: 0,
        integrationByStage: {},
        integrationSuccessRate: 0,
        economicIntegrationAvg: 0,
        socialIntegrationAvg: 0,
        civicIntegrationAvg: 0,
        culturalIntegrationAvg: 0,
        topChallenges: [],
        barrierSeverity: {}
      };
    }
    
    const avgEconomic = outcomes.reduce((sum, o) => 
      sum + (o.economicIntegration.employmentRate + o.economicIntegration.socialMobility) / 2, 0) / outcomes.length;
    
    const avgSocial = outcomes.reduce((sum, o) => 
      sum + (o.socialIntegration.languageProficiency + o.socialIntegration.culturalAdaptation) / 2, 0) / outcomes.length;
    
    const avgCivic = outcomes.reduce((sum, o) => 
      sum + (o.civicIntegration.civicParticipation + o.civicIntegration.legalKnowledge) / 2, 0) / outcomes.length;
    
    const avgCultural = outcomes.reduce((sum, o) => 
      sum + (o.culturalIntegration.culturalAdoption + o.culturalIntegration.bilingualProficiency) / 2, 0) / outcomes.length;
    
    return {
      averageIntegrationScore: (avgEconomic + avgSocial + avgCivic + avgCultural) / 4,
      integrationByStage: this.groupOutcomesByStage(outcomes),
      integrationSuccessRate: outcomes.filter(o => 
        o.integrationStage === 'integration' || o.integrationStage === 'full_integration'
      ).length / outcomes.length * 100,
      economicIntegrationAvg: avgEconomic,
      socialIntegrationAvg: avgSocial,
      civicIntegrationAvg: avgCivic,
      culturalIntegrationAvg: avgCultural,
      topChallenges: this.identifyTopChallenges(outcomes),
      barrierSeverity: this.calculateBarrierSeverity(outcomes)
    };
  }

  private calculateEconomicImpactAnalytics(flows: MigrationFlow[], outcomes: IntegrationOutcome[]): MigrationAnalytics['economicImpact'] {
    const totalPopulation = flows.reduce((sum, f) => sum + f.populationSize, 0);
    const avgIncome = outcomes.reduce((sum, o) => sum + o.economicIntegration.averageIncome, 0) / Math.max(1, outcomes.length);
    
    return {
      laborForceContribution: totalPopulation * 0.7, // Assume 70% labor force participation
      taxContribution: avgIncome * totalPopulation * 0.25, // Assume 25% effective tax rate
      entrepreneurshipImpact: outcomes.reduce((sum, o) => sum + o.economicIntegration.entrepreneurshipRate, 0),
      skillsContribution: this.calculateSkillsContribution(flows),
      remittanceOutflows: avgIncome * totalPopulation * this.config.remittanceRate,
      fiscalBalance: 0, // Simplified - would need more detailed calculation
      servicesCost: totalPopulation * 5000, // Estimated annual cost per person
      infrastructureImpact: totalPopulation * 0.1 // Impact factor
    };
  }

  private calculateSocialImpactAnalytics(flows: MigrationFlow[], outcomes: IntegrationOutcome[]): MigrationAnalytics['socialImpact'] {
    const culturalDiversity = Math.min(100, flows.length * 5); // Simplified diversity measure
    const avgSocialIntegration = outcomes.reduce((sum, o) => 
      sum + o.socialIntegration.culturalAdaptation, 0) / Math.max(1, outcomes.length);
    
    return {
      culturalDiversity,
      socialCohesion: Math.max(0, 80 - (100 - avgSocialIntegration) * 0.3),
      interculturalContact: avgSocialIntegration * 0.8,
      communityVitality: Math.min(100, culturalDiversity * 0.8 + avgSocialIntegration * 0.2),
      segregationLevel: Math.max(0, (100 - avgSocialIntegration) * this.config.segregationTendency),
      tensionLevel: Math.max(0, outcomes.reduce((sum, o) => 
        sum + o.socialIntegration.discriminationExperience, 0) / Math.max(1, outcomes.length)),
      discriminationReports: outcomes.filter(o => 
        o.socialIntegration.discriminationExperience > 60).length
    };
  }

  private calculatePolicyEffectiveness(cityId: string): MigrationAnalytics['policyEffectiveness'] {
    const activePolicies = Array.from(this.immigrationPolicies.values())
      .filter(p => p.status === 'active' && 
        (!p.targetCities || p.targetCities.includes(cityId)));
    
    const avgEffectiveness = activePolicies.reduce((sum, p) => 
      sum + p.enforcementLevel, 0) / Math.max(1, activePolicies.length);
    
    return {
      activePolicies: activePolicies.length,
      policyComplianceRate: avgEffectiveness,
      policyImpactScore: avgEffectiveness * this.config.enforcementEffectiveness,
      legalPathwayUtilization: avgEffectiveness * 0.8,
      illegalFlowReduction: avgEffectiveness * 0.6,
      integrationSupportEffectiveness: avgEffectiveness * this.config.supportServiceEffectiveness
    };
  }

  private generateProjections(cityId: string, flows: MigrationFlow[]): MigrationAnalytics['projections'] {
    const currentYear = new Date().getFullYear();
    const projectedInflows: { [year: number]: number } = {};
    
    // Simple projection based on current trends
    const currentInflow = flows
      .filter(f => f.destinationCityId === cityId)
      .reduce((sum, f) => sum + f.populationSize, 0);
    
    for (let i = 1; i <= 5; i++) {
      const year = currentYear + i;
      const growthRate = 0.05; // 5% annual growth assumption
      projectedInflows[year] = Math.floor(currentInflow * Math.pow(1 + growthRate, i));
    }
    
    return {
      projectedInflows,
      projectedIntegrationOutcomes: {
        economicIntegration: 75,
        socialIntegration: 70,
        civicIntegration: 65,
        culturalIntegration: 80
      },
      capacityConstraints: this.identifyCapacityConstraints(cityId),
      policyRecommendations: this.generatePolicyRecommendations(cityId)
    };
  }

  // Helper methods for analytics

  private groupFlowsByProperty(flows: MigrationFlow[], property: keyof MigrationFlow): { [key: string]: number } {
    const groups: { [key: string]: number } = {};
    
    flows.forEach(flow => {
      const key = String(flow[property]);
      groups[key] = (groups[key] || 0) + flow.populationSize;
    });
    
    return groups;
  }

  private groupFlowsByOrigin(flows: MigrationFlow[]): { [origin: string]: number } {
    const groups: { [origin: string]: number } = {};
    
    flows.forEach(flow => {
      const origin = flow.originCountry || flow.originCityId || 'Unknown';
      groups[origin] = (groups[origin] || 0) + flow.populationSize;
    });
    
    return groups;
  }

  private groupOutcomesByStage(outcomes: IntegrationOutcome[]): { [stage: string]: number } {
    const groups: { [stage: string]: number } = {};
    
    outcomes.forEach(outcome => {
      const stage = outcome.integrationStage;
      groups[stage] = (groups[stage] || 0) + 1;
    });
    
    return groups;
  }

  private calculateFlowGrowthRate(flows: MigrationFlow[]): number {
    // Simplified growth rate calculation
    return flows.length > 0 ? 0.05 : 0; // 5% if flows exist
  }

  private identifyTopChallenges(outcomes: IntegrationOutcome[]): string[] {
    const challengeCounts: { [challenge: string]: number } = {};
    
    outcomes.forEach(outcome => {
      Object.entries(outcome.integrationChallenges).forEach(([challenge, severity]) => {
        if (severity > 50) {
          challengeCounts[challenge] = (challengeCounts[challenge] || 0) + 1;
        }
      });
    });
    
    return Object.entries(challengeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([challenge]) => challenge);
  }

  private calculateBarrierSeverity(outcomes: IntegrationOutcome[]): { [barrier: string]: number } {
    const barriers: { [barrier: string]: number } = {};
    
    outcomes.forEach(outcome => {
      Object.entries(outcome.integrationChallenges).forEach(([barrier, severity]) => {
        barriers[barrier] = (barriers[barrier] || 0) + severity;
      });
    });
    
    // Average the severity scores
    Object.keys(barriers).forEach(barrier => {
      barriers[barrier] /= outcomes.length;
    });
    
    return barriers;
  }

  private calculateSkillsContribution(flows: MigrationFlow[]): { [skill: string]: number } {
    const skills: { [skill: string]: number } = {};
    
    flows.forEach(flow => {
      flow.economicProfile.jobSkills.forEach(skill => {
        skills[skill] = (skills[skill] || 0) + flow.populationSize;
      });
    });
    
    return skills;
  }

  private identifyCapacityConstraints(cityId: string): string[] {
    const constraints: string[] = [];
    
    const cityFlows = this.getCityMigrationFlows(cityId);
    const totalPopulation = cityFlows.reduce((sum, f) => sum + f.populationSize, 0);
    
    if (totalPopulation > 50000) {
      constraints.push('Housing capacity strain');
    }
    if (totalPopulation > 30000) {
      constraints.push('Integration services capacity');
    }
    if (totalPopulation > 75000) {
      constraints.push('Labor market saturation');
    }
    
    return constraints;
  }

  private generatePolicyRecommendations(cityId: string): string[] {
    const recommendations: string[] = [];
    
    const analytics = this.getMigrationAnalytics(cityId);
    
    if (analytics.integrationAnalytics.averageIntegrationScore < 60) {
      recommendations.push('Increase integration support services');
    }
    if (analytics.socialImpact.tensionLevel > 40) {
      recommendations.push('Implement community cohesion programs');
    }
    if (analytics.economicImpact.fiscalBalance < 0) {
      recommendations.push('Review fiscal impact and adjust policies');
    }
    
    return recommendations;
  }

  // Utility methods

  private determineVisaType(subtype: MigrationFlow['subtype'], legalStatus: MigrationFlow['legalStatus']): string | undefined {
    if (legalStatus === 'undocumented') return undefined;
    
    const visaTypes: { [key: string]: string } = {
      'economic': 'Work Visa',
      'student': 'Student Visa',
      'family_reunification': 'Family Visa',
      'refugee': 'Refugee Status',
      'temporary_worker': 'Temporary Work Permit'
    };
    
    return visaTypes[subtype] || 'General Visa';
  }

  private calculateDocumentationLevel(legalStatus: MigrationFlow['legalStatus'], subtype: MigrationFlow['subtype']): number {
    if (legalStatus === 'undocumented') return Math.random() * 30; // 0-30%
    if (legalStatus === 'documented') return Math.random() * 30 + 70; // 70-100%
    if (legalStatus === 'refugee') return Math.random() * 40 + 40; // 40-80%
    return Math.random() * 50 + 50; // 50-100%
  }

  private calculateEconomicImpact(flow: MigrationFlow): number {
    return flow.populationSize * flow.economicProfile.averageIncome * 0.3; // Simplified calculation
  }

  private calculateSocialImpact(flow: MigrationFlow): number {
    const culturalDistance = 100 - flow.integrationFactors.culturalSimilarity;
    return Math.max(-20, Math.min(20, (flow.populationSize / 1000) * (culturalDistance / 100) * -10));
  }

  private calculateEconomicPressure(flow: MigrationFlow): number {
    // Simplified economic pressure calculation
    return (flow.pushFactors.economic - flow.pullFactors.economic) / 100;
  }

  private calculatePolicyPressure(flow: MigrationFlow): number {
    // Calculate pressure from applicable policies
    let totalPressure = 0;
    let policyCount = 0;
    
    this.immigrationPolicies.forEach(policy => {
      if (this.isPolicyApplicable(policy, flow)) {
        totalPressure += (policy.effects.flowMultiplier - 1);
        policyCount++;
      }
    });
    
    return policyCount > 0 ? totalPressure / policyCount : 0;
  }

  private calculatePolicyMultiplier(flow: MigrationFlow): number {
    let multiplier = 1.0;
    
    this.immigrationPolicies.forEach(policy => {
      if (this.isPolicyApplicable(policy, flow)) {
        const effectiveness = policy.enforcementLevel / 100;
        multiplier *= (1 + (policy.effects.flowMultiplier - 1) * effectiveness);
      }
    });
    
    return multiplier;
  }

  private logMigrationEvent(event: Omit<MigrationEvent, 'id' | 'timestamp' | 'reportedBy' | 'resolved' | 'responseActions'>): void {
    const migrationEvent: MigrationEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      reportedBy: 'system',
      resolved: false,
      responseActions: [],
      ...event
    };
    
    this.migrationEvents.push(migrationEvent);
    
    // Keep only last 1000 events
    if (this.migrationEvents.length > 1000) {
      this.migrationEvents = this.migrationEvents.slice(-1000);
    }
  }
}
